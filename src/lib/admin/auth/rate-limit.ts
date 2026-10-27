import "server-only";
import type { PoolClient } from "pg";
import { query, transaction } from "@/lib/db/client";

/**
 * Login throttling.
 *
 * - Per IP: at most 5 failed attempts in 15 minutes.
 * - Whole login: after 30 failed attempts within an hour, from any addresses, every login is
 *   refused until those attempts are an hour old. The password is the only factor, so guesses
 *   spread over many addresses have to stay few, and so does the work of the slow hash check.
 *   The price: someone who keeps sending wrong passwords can keep everyone out for an hour.
 *
 * Check and record are atomic: an attempt is reserved (recorded as a failure) under an advisory
 * lock before the password is checked, so concurrent requests see each other. The slow password
 * check runs outside the lock. A successful login turns its reservation into a success and
 * clears that IP's failures. Refused attempts are not recorded, so they never extend a block.
 */
export const PER_IP_LIMIT = 5;
export const LOGIN_WINDOW_MINUTES = 15;
/** Failed attempts from all addresses within GLOBAL_LOCK_MINUTES before the whole login locks. */
export const GLOBAL_LIMIT = 30;
export const GLOBAL_LOCK_MINUTES = 60;
/** Serialises the counting and recording of login attempts across server instances. */
const LOGIN_LOCK = 4_900_502;

async function lock(client: PoolClient): Promise<void> {
  // Transaction level, so it also works through Neon's pooled connection (PgBouncer).
  await client.query("select pg_advisory_xact_lock($1)", [LOGIN_LOCK]);
}

/** Failed attempts of the last `minutes`, of one IP or of all. */
async function failures(client: PoolClient, minutes: number, ipHash?: string): Promise<number> {
  const { rows } = await client.query<{ n: number }>(
    "select count(*)::int as n from login_attempts where not success and at > now() - make_interval(mins => $1) and ($2::text is null or ip_hash = $2)",
    [minutes, ipHash ?? null],
  );
  return rows[0]?.n ?? 0;
}

export type LoginReservation = { status: "ok"; id: string } | { status: "ip_blocked" } | { status: "locked" };

/**
 * Before the password is checked: refuses when this IP has reached its limit or the whole login
 * is locked, otherwise records the attempt as a failed one and returns its id.
 */
export async function reserveLoginAttempt(ipHash: string): Promise<LoginReservation> {
  return transaction(async (client) => {
    await lock(client);
    if ((await failures(client, GLOBAL_LOCK_MINUTES)) >= GLOBAL_LIMIT) return { status: "locked" };
    if ((await failures(client, LOGIN_WINDOW_MINUTES, ipHash)) >= PER_IP_LIMIT) return { status: "ip_blocked" };
    const { rows } = await client.query<{ id: string }>("insert into login_attempts (ip_hash) values ($1) returning id::text", [ipHash]);
    return { status: "ok", id: rows[0].id };
  });
}

/** After the right password: the reserved attempt becomes a success, and that IP's failures are cleared. */
export async function completeLoginAttempt(attemptId: string, ipHash: string): Promise<void> {
  await transaction(async (client) => {
    await client.query("update login_attempts set success = true where id = $1", [attemptId]);
    await client.query("delete from login_attempts where ip_hash = $1 and not success", [ipHash]);
  });
  await removeOldAttempts();
}

/** Entries older than 30 days are not needed. */
export async function removeOldAttempts(): Promise<void> {
  await query("delete from login_attempts where at < now() - interval '30 days'");
}
