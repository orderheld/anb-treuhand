import { query } from "@/lib/db/client";
import { serverEnv } from "@/lib/env";
import { deleteExpiredRequests } from "@/lib/requests/store";

/**
 * Daily housekeeping (see vercel.json): deletes stored requests older than
 * CONTACT_RETENTION_DAYS, as the privacy policy promises, plus expired admin sessions, old login
 * attempts and audit entries older than two years. Vercel Cron sends
 * "Authorization: Bearer <CRON_SECRET>".
 */
export async function GET(request: Request) {
  // Without a database there is nothing to delete, so the job succeeds without a secret.
  if (!serverEnv.databaseUrl) {
    return Response.json({ deleted: 0, storage: "disabled" });
  }
  const secret = serverEnv.cronSecret;
  if (!secret) {
    // Make a missing secret visible: without it, stored requests would never be deleted.
    console.error(JSON.stringify({ event: "retention.misconfigured", reason: "CRON_SECRET missing" }));
    return Response.json({ error: "misconfigured" }, { status: 500 });
  }
  if (request.headers.get("authorization") !== `Bearer ${secret}`) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }
  const deleted = await deleteExpiredRequests(serverEnv.retentionDays);
  await query("delete from admin_sessions where expires_at < now()");
  await query("delete from login_attempts where at < now() - interval '30 days'");
  await query("delete from audit_log where at < now() - interval '2 years'");
  console.info(JSON.stringify({ event: "retention", deleted, days: serverEnv.retentionDays }));
  return Response.json({ deleted });
}
