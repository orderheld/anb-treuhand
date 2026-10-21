import "server-only";
import type { CalculatorSlug } from "@/content/types";
import { query } from "@/lib/db/client";

/** Stored contact and offer requests, for the admin area. */

export const requestStatuses = [
  { value: "neu", label: "Neu" },
  { value: "in_bearbeitung", label: "In Bearbeitung" },
  { value: "erledigt", label: "Erledigt" },
] as const;

export type RequestStatus = (typeof requestStatuses)[number]["value"];

export function isRequestStatus(value: unknown): value is RequestStatus {
  return requestStatuses.some((s) => s.value === value);
}

export interface RequestListItem {
  reference: string;
  kind: "offerte" | "kontakt";
  calculator: CalculatorSlug | null;
  topic: string | null;
  name: string;
  company: string | null;
  email: string;
  status: RequestStatus;
  emailStatus: "sent" | "failed" | "dry_run";
  createdAt: Date;
}

export interface RequestDetail extends RequestListItem {
  phone: string | null;
  timing: string | null;
  message: string | null;
  input: unknown;
  estimate: unknown;
  emailError: string | null;
  confirmationStatus: "sent" | "failed" | "skipped" | null;
  updatedAt: Date;
}

type Row = {
  reference: string;
  kind: "offerte" | "kontakt";
  calculator: CalculatorSlug | null;
  topic: string | null;
  name: string;
  company: string | null;
  email: string;
  status: RequestStatus;
  email_status: "sent" | "failed" | "dry_run";
  created_at: Date;
};

function listItem(r: Row): RequestListItem {
  return {
    reference: r.reference,
    kind: r.kind,
    calculator: r.calculator,
    topic: r.topic,
    name: r.name,
    company: r.company,
    email: r.email,
    status: r.status,
    emailStatus: r.email_status,
    createdAt: r.created_at,
  };
}

/** The newest requests first, optionally of one status. */
export async function listRequests(status?: RequestStatus, limit = 200): Promise<RequestListItem[]> {
  const rows = await query<Row>(
    `select reference, kind, calculator, topic, name, company, email, status, email_status, created_at
     from requests where ($1::text is null or status = $1) order by created_at desc limit $2`,
    [status ?? null, limit],
  );
  return rows.map(listItem);
}

export async function requestCounts(): Promise<Record<RequestStatus, number> & { total: number }> {
  const rows = await query<{ status: RequestStatus; n: number }>("select status, count(*)::int as n from requests group by status");
  const counts = { neu: 0, in_bearbeitung: 0, erledigt: 0, total: 0 };
  for (const row of rows) {
    counts[row.status] = row.n;
    counts.total += row.n;
  }
  return counts;
}

export async function getRequest(reference: string): Promise<RequestDetail | null> {
  const rows = await query<
    Row & {
      phone: string | null;
      timing: string | null;
      message: string | null;
      input: unknown;
      estimate: unknown;
      email_error: string | null;
      confirmation_status: RequestDetail["confirmationStatus"];
      updated_at: Date;
    }
  >(
    `select reference, kind, calculator, topic, name, company, email, status, email_status, created_at,
            phone, timing, message, input, estimate, email_error, confirmation_status, updated_at
     from requests where reference = $1`,
    [reference],
  );
  const r = rows[0];
  if (!r) return null;
  return {
    ...listItem(r),
    phone: r.phone,
    timing: r.timing,
    message: r.message,
    input: r.input,
    estimate: r.estimate,
    emailError: r.email_error,
    confirmationStatus: r.confirmation_status,
    updatedAt: r.updated_at,
  };
}

/** Returns false when no request has this reference. */
export async function setRequestStatus(reference: string, status: RequestStatus): Promise<boolean> {
  const rows = await query("update requests set status = $1, updated_at = now() where reference = $2 returning id", [status, reference]);
  return rows.length === 1;
}

export async function deleteRequest(reference: string): Promise<boolean> {
  const rows = await query("delete from requests where reference = $1 returning id", [reference]);
  return rows.length === 1;
}
