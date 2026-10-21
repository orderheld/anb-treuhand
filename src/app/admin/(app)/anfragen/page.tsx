import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Inbox } from "lucide-react";
import { Notice, PageHeader, Pill } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin/auth/session";
import { formatDateTime } from "@/lib/admin/format";
import { isRequestStatus, listRequests, requestCounts, requestStatuses } from "@/lib/admin/requests";
import { isStorageConfigured } from "@/lib/requests/store";
import { serverEnv } from "@/lib/env";
import { cn } from "@/lib/utils";
import { requestTitle, statusLabel } from "./request-meta";

export const metadata: Metadata = { title: "Anfragen" };
export const instant = false;

export default async function RequestsPage({ searchParams }: PageProps<"/admin/anfragen">) {
  await requireAdmin();
  const query = await searchParams;
  const status = isRequestStatus(query.status) ? query.status : undefined;
  const [requests, counts] = await Promise.all([listRequests(status), requestCounts()]);
  const filters = [{ value: undefined, label: "Alle", count: counts.total }, ...requestStatuses.map((s) => ({ value: s.value, label: s.label, count: counts[s.value] }))];

  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Anfragen" title="Kontakt und Offerten">
        <p>
          Jede Anfrage kommt per E-Mail. Hier finden Sie zusätzlich eine Kopie mit allen Angaben aus dem Rechner. Nach {serverEnv.retentionDays} Tagen werden Anfragen
          automatisch gelöscht.
        </p>
      </PageHeader>

      {query.geloescht ? <Notice tone="success" title="Die Anfrage wurde gelöscht." /> : null}
      {!isStorageConfigured() ? (
        <Notice tone="warning" title="Neue Anfragen werden nicht gespeichert">
          Es fehlt <code>CRON_SECRET</code> oder <code>CONTACT_IP_SALT</code> in Vercel. Die Anfragen kommen weiterhin per E-Mail.
        </Notice>
      ) : null}

      <nav aria-label="Filter" className="flex flex-wrap gap-2">
        {filters.map((f) => {
          const active = f.value === status;
          return (
            <Link
              key={f.label}
              href={f.value ? `/admin/anfragen?status=${f.value}` : "/admin/anfragen"}
              aria-current={active ? "page" : undefined}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm transition-colors",
                active ? "border-accent bg-accent-soft font-semibold text-accent" : "border-line bg-white text-ink hover:border-line-strong",
              )}
            >
              {f.label}
              <span className={cn("tabular text-xs", active ? "text-accent" : "text-muted")}>{f.count}</span>
            </Link>
          );
        })}
      </nav>

      {requests.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-line bg-white px-6 py-16 text-center">
          <Inbox aria-hidden className="size-8 text-accent" strokeWidth={1.5} />
          <p className="mt-4 font-medium text-ink">{status ? `Keine Anfragen mit Status «${statusLabel(status)}».` : "Noch keine Anfragen."}</p>
          <p className="mt-1 text-sm text-muted">Neue Anfragen aus dem Kontaktformular und den Rechnern erscheinen hier.</p>
        </div>
      ) : (
        <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white">
          {requests.map((r) => (
            <li key={r.reference}>
              <Link href={`/admin/anfragen/${r.reference}`} className="group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-mist">
                <div className="grid min-w-0 flex-1 gap-1 sm:grid-cols-[1fr_12rem_9rem] sm:items-center sm:gap-6">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-ink">
                      {r.name}
                      {r.company ? <span className="font-normal text-muted"> · {r.company}</span> : null}
                    </p>
                    <p className="truncate text-sm text-muted">{requestTitle(r)}</p>
                  </div>
                  <p className="text-sm tabular text-muted">{formatDateTime(r.createdAt)}</p>
                  <div className="flex flex-wrap gap-1.5">
                    <Pill tone={r.status}>{statusLabel(r.status)}</Pill>
                    {r.emailStatus === "failed" ? <Pill tone="danger">E-Mail fehlgeschlagen</Pill> : null}
                  </div>
                </div>
                <ChevronRight aria-hidden className="size-5 shrink-0 text-muted transition-transform group-hover:translate-x-0.5" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
