import "server-only";
import type { PoolClient } from "pg";

/**
 * Remembers the last accepted TOTP step, so a code that was seen (over a shoulder, in a screen
 * share) cannot be used a second time. The update is atomic across server instances; `client`
 * is the transaction in which the login checks the code.
 */
export async function claimTotpStep(step: number, client: PoolClient): Promise<boolean> {
  const { rows } = await client.query(
    `insert into settings (key, value) values ('admin.totp_last_step', $1::jsonb)
     on conflict (key) do update set value = excluded.value, updated_at = now()
     where (settings.value #>> '{}')::bigint < (excluded.value #>> '{}')::bigint
     returning key`,
    [JSON.stringify(step)],
  );
  return rows.length === 1;
}

/** Only relative admin paths are accepted as target after the login. */
export function safeAdminTarget(value: unknown): string {
  if (typeof value !== "string") return "/admin";
  if (!/^\/admin(\/[A-Za-z0-9\-._~%/?=&]*)?$/.test(value) || value.startsWith("//") || value.includes("..")) return "/admin";
  if (value.startsWith("/admin/login") || value.startsWith("/admin/einrichtung")) return "/admin";
  return value;
}
