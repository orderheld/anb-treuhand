import "server-only";
import type { PoolClient } from "pg";
import { query, transaction } from "@/lib/db/client";

/**
 * Login throttling.
 *
 * - Per IP: at most 5 failed attempts in 15 minutes, of either kind.
 * - Whole login: after 10 attempts with the right password and a wrong code within an hour,
 *   every login is refused until those attempts are an hour old. Only someone who knows the
 *   password can cause this, so a stranger cannot lock the office out by guessing passwords.
 *
 * Check and record are atomic: an attempt is reserved (recorded as a failure) under an advisory
 * lock before the password is checked, so concurrent requests see each other. The slow password
 * check runs outside the lock. A successful login turns its reservation into a success and
 * clears that IP's failures. Refused attempts are not recorded, so they never extend a block.
 */
export const PER_IP_LIMIT = 5;
export const LOGIN_WINDOW_MINUTES = 15;
/** Attempts with the right password and a wrong code, per hour, before the whole login locks. */
export const GLOBAL_CODE_LIMIT = 10;
export const CODE_LOCK_MINUTES = 60;
/** Serialises the counting and recording of login attempts across server instances. */
const LOGIN_LOCK = 4_900_502;

async function lock(client: PoolClient): Promise<void> {
  // Transaction level, so it also works through Neon's pooled connection (PgBouncer).
  await client.query("select pg_advisory_xact_lock($1)", [LOGIN_LOCK]);
}

async function ipFailures(client: PoolClient, ipHash: string): Promise<number> {
  const { rows } = await client.query<{ n: number }>(
    "select count(*)::int as n from login_attempts where ip_hash = $1 and not success and at > now() - make_interval(mins => $2)",
    [ipHash, LOGIN_WINDOW_MINUTES],
  );
  return rows[0]?.n ?? 0;
}

async function codeFailures(client: PoolClient): Promise<number> {
  const { rows } = await client.query<{ n: number }>(
    "select count(*)::int as n from login_attempts where kind = 'code' and not success and at > now() - make_interval(mins => $1)",
    [CODE_LOCK_MINUTES],
  );
  return rows[0]?.n ?? 0;
}

export type LoginReservation = { status: "ok"; id: string } | { status: "ip_blocked" } | { status: "code_locked" };

/**
 * Before the password is checked: refuses when this IP has reached its limit or the login is
 * locked by wrong codes, otherwise records the attempt as a failed one and returns its id.
 */
export async function reserveLoginAttempt(ipHash: string): Promise<LoginReservation> {
  return transaction(async (client) => {
    await lock(client);
    if ((await codeFailures(client)) >= GLOBAL_CODE_LIMIT) return { status: "code_locked" };
    if ((await ipFailures(client, ipHash)) >= PER_IP_LIMIT) return { status: "ip_blocked" };
    const { rows } = await client.query<{ id: string }>("insert into login_attempts (ip_hash) values ($1) returning id::text", [ipHash]);
    return { status: "ok", id: rows[0].id };
  });
}

/**
 * After the password was correct: checks the code under the same lock, so concurrent guesses
 * cannot pass the code limit. `check` verifies the code (and claims its step) in the given
 * transaction. A wrong code turns the reserved attempt into a code failure; a right one into a
 * success, and that IP's failures are cleared.
 */
export async function checkLoginCode(attemptId: string, ipHash: string, check: (client: PoolClient) => Promise<boolean>): Promise<"ok" | "wrong" | "locked"> {
  const result = await transaction(async (client) => {
    await lock(client);
    // Another attempt may have locked the login meanwhile; this one stays a plain failure.
    if ((await codeFailures(client)) >= GLOBAL_CODE_LIMIT) return "locked" as const;
    if (!(await check(client))) {
      await client.query("update login_attempts set kind = 'code' where id = $1", [attemptId]);
      return "wrong" as const;
    }
    await client.query("update login_attempts set success = true where id = $1", [attemptId]);
    await client.query("delete from login_attempts where ip_hash = $1 and not success", [ipHash]);
    return "ok" as const;
  });
  await removeOldAttempts();
  return result;
}

/** Entries older than 30 days are not needed. */
export async function removeOldAttempts(): Promise<void> {
  await query("delete from login_attempts where at < now() - interval '30 days'");
}
