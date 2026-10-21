import "server-only";
import { attachDatabasePool } from "@vercel/functions";
import { Pool, type PoolClient, type QueryResultRow } from "pg";
import { migrations } from "./migrations";

/**
 * Database access (Neon Postgres through the pooled connection string of the Vercel
 * integration, or a local Postgres). One small pool per server instance; the migrations run once
 * per instance before the first query. Without DATABASE_URL the site works without a database:
 * the calculators use their default tariffs and requests are only sent by e-mail.
 */

/** Advisory lock of the migrations (transaction level, so it works through PgBouncer). */
const MIGRATION_LOCK = 4_900_501;

declare global {
  // Survives hot reloads in development.
  var __anbDb: { pool: Pool; ready: Promise<void> } | undefined;
}

export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

/**
 * Connection settings from the connection string. node-postgres ignores libpq's
 * `channel_binding` and warns about `sslmode`, so both are applied explicitly: TLS with a
 * verified certificate, and SCRAM-SHA-256-PLUS (channel binding) whenever the server offers it,
 * as Neon's connection strings ask for with channel_binding=require.
 */
export function poolConfig(url: string): { connectionString: string; ssl: false | { rejectUnauthorized: boolean }; enableChannelBinding: boolean } {
  const parsed = new URL(url);
  const channelBinding = parsed.searchParams.get("channel_binding");
  parsed.searchParams.delete("channel_binding");
  parsed.searchParams.delete("sslmode");
  const local = parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1";
  return {
    connectionString: parsed.toString(),
    ssl: local ? false : { rejectUnauthorized: true },
    enableChannelBinding: !local && channelBinding !== "disable",
  };
}

async function migrate(pool: Pool): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query("begin");
    try {
      await client.query("select pg_advisory_xact_lock($1)", [MIGRATION_LOCK]);
      await client.query("create table if not exists schema_migrations (id text primary key, applied_at timestamptz not null default now())");
      const { rows } = await client.query<{ id: string }>("select id from schema_migrations");
      const applied = new Set(rows.map((r) => r.id));
      for (const migration of migrations) {
        if (applied.has(migration.id)) continue;
        await client.query(migration.sql);
        await client.query("insert into schema_migrations (id) values ($1)", [migration.id]);
        console.info(JSON.stringify({ event: "db.migration_applied", id: migration.id }));
      }
      await client.query("commit");
    } catch (error) {
      await client.query("rollback");
      throw error;
    }
  } finally {
    client.release();
  }
}

function init() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL fehlt.");
  // A database that does not answer must not hold a request (or the build) forever.
  const pool = new Pool({ ...poolConfig(url), max: 5, idleTimeoutMillis: 10_000, connectionTimeoutMillis: 10_000 });
  // An idle connection dropped by the server must not crash the process.
  pool.on("error", (error) => console.error(JSON.stringify({ event: "db.pool_error", error: String(error) })));
  attachDatabasePool(pool);
  const ready = migrate(pool);
  // A failed migration must not stay cached forever; the next request tries again.
  ready.catch(() => {
    globalThis.__anbDb = undefined;
  });
  return { pool, ready };
}

async function pool(): Promise<Pool> {
  globalThis.__anbDb ??= init();
  const state = globalThis.__anbDb;
  await state.ready;
  return state.pool;
}

/** Runs one parameterised query once all migrations have run. */
export async function query<T extends QueryResultRow = QueryResultRow>(text: string, params: unknown[] = []): Promise<T[]> {
  const { rows } = await (await pool()).query<T>(text, params);
  return rows;
}

/** Runs `fn` in a transaction on one connection. */
export async function transaction<T>(fn: (client: PoolClient) => Promise<T>): Promise<T> {
  const client = await (await pool()).connect();
  try {
    await client.query("begin");
    const result = await fn(client);
    await client.query("commit");
    return result;
  } catch (error) {
    await client.query("rollback").catch(() => {});
    throw error;
  } finally {
    client.release();
  }
}
