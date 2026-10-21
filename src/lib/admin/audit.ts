import "server-only";
import { query } from "@/lib/db/client";
import { requestIpHash } from "./request";

export type AuditAction =
  | "login"
  | "login_failed"
  | "logout"
  | "logout_all"
  | "tariffs_saved"
  | "tariffs_reset"
  | "request_status"
  | "request_deleted";

/**
 * Writes an entry to the audit log: who changed what, and when. `detail` holds references and
 * keys only (a request reference, a calculator, changed tariff fields), never names or e-mail
 * addresses. The IP is stored as a salted hash.
 */
export async function audit(action: AuditAction, detail: Record<string, unknown> = {}, sessionId?: string): Promise<void> {
  try {
    const ip = await requestIpHash().catch(() => null);
    await query("insert into audit_log (action, detail, session_id) values ($1, $2, $3)", [
      action,
      JSON.stringify({ ...detail, ip }),
      sessionId?.slice(0, 16) ?? null,
    ]);
  } catch (error) {
    // Auditing must never break the action itself, but a failure has to be visible.
    console.error(JSON.stringify({ event: "admin.audit_failed", action, error: String(error) }));
  }
}

export interface AuditEntry {
  id: string;
  at: Date;
  action: AuditAction;
  detail: Record<string, unknown>;
  /** The first 16 characters of the session id, or null (failed logins). */
  sessionId: string | null;
}

/** The newest entries of the audit log first. */
export async function recentAudit(limit = 50): Promise<AuditEntry[]> {
  const rows = await query<{ id: string; at: Date; action: AuditAction; detail: Record<string, unknown> | null; session_id: string | null }>(
    "select id::text as id, at, action, detail, session_id from audit_log order by at desc, id desc limit $1",
    [limit],
  );
  return rows.map((r) => ({ id: r.id, at: r.at, action: r.action, detail: r.detail ?? {}, sessionId: r.session_id }));
}

/** Failed logins in the last `days` days, and the last successful login before the current session. */
export async function loginActivity(currentSessionId: string, days = 7): Promise<{ failed: number; previousLogin: Date | null }> {
  const rows = await query<{ failed: number; previous_login: Date | null }>(
    `select
       (select count(*)::int from audit_log where action = 'login_failed' and at > now() - make_interval(days => $1)) as failed,
       (select max(at) from audit_log where action = 'login' and session_id is distinct from $2) as previous_login`,
    [days, currentSessionId.slice(0, 16)],
  );
  return { failed: rows[0]?.failed ?? 0, previousLogin: rows[0]?.previous_login ?? null };
}
