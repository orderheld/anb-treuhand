import "server-only";
import { isDatabaseConfigured, query } from "@/lib/db/client";
import { serverEnv } from "@/lib/env";
import type { CalculatorRequest } from "@/lib/calculators/index";
import type { Estimate } from "@/lib/calculators/shared";
import type { EmailResult } from "./email";

/**
 * Optional copy of every request in the database, for the admin area. The e-mail stays the
 * primary channel: storage runs after it and a failure never loses a request.
 */

/**
 * Requests are stored only when the privacy policy's promises can hold: a secret salt for the
 * IP hash and a secret for the daily deletion job.
 */
export function isStorageConfigured(): boolean {
  return isDatabaseConfigured() && Boolean(serverEnv.cronSecret && serverEnv.ipSalt);
}

/** Requests from this IP hash in the last hour, across all server instances. */
export async function recentRequestCount(ipHash: string): Promise<number> {
  const rows = await query<{ count: number }>(
    "select count(*)::int as count from requests where ip_hash = $1 and created_at > now() - interval '1 hour'",
    [ipHash],
  );
  return rows[0]?.count ?? 0;
}

export interface StoredRequest {
  reference: string;
  kind: "offerte" | "kontakt";
  calculator?: CalculatorRequest | null;
  estimate?: Estimate | null;
  topic?: string | null;
  name: string;
  company?: string | null;
  email: string;
  phone?: string | null;
  timing?: string | null;
  message?: string | null;
  ipHash: string;
  delivery: EmailResult;
  confirmation: "sent" | "failed" | "skipped";
}

export async function storeRequest(r: StoredRequest): Promise<void> {
  const emailStatus = r.delivery.ok ? (r.delivery.id === null && serverEnv.dryRun ? "dry_run" : "sent") : "failed";
  await query(
    `insert into requests (
      reference, kind, calculator, topic, name, company, email, phone, timing, message, input, estimate,
      email_status, email_id, email_error, confirmation_status, consent_at, ip_hash
    ) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, now(), $17)`,
    [
      r.reference,
      r.kind,
      r.calculator?.slug ?? null,
      r.topic ?? null,
      r.name,
      r.company ?? null,
      r.email,
      r.phone ?? null,
      r.timing ?? null,
      r.message ?? null,
      r.calculator ? JSON.stringify(r.calculator.input) : null,
      r.estimate ? JSON.stringify(r.estimate) : null,
      emailStatus,
      r.delivery.ok ? r.delivery.id : null,
      r.delivery.ok ? null : r.delivery.error.slice(0, 500),
      r.confirmation,
      r.ipHash,
    ],
  );
}

/** Deletes stored requests older than the retention period. Returns the number of rows removed. */
export async function deleteExpiredRequests(days: number): Promise<number> {
  const rows = await query("delete from requests where created_at < now() - make_interval(days => $1) returning id", [days]);
  return rows.length;
}
