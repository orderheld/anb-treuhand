import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ChevronRight, Inbox } from "lucide-react";
import { Icon } from "@/components/ui/icon";
import { Card, Notice, PageHeader, Pill, type PillTone } from "@/components/admin/ui";
import { calculators } from "@/content/calculators";
import { loginActivity } from "@/lib/admin/audit";
import { requireAdmin } from "@/lib/admin/auth/session";
import { formatDateTime, formatDay } from "@/lib/admin/format";
import { listRequests, requestCounts } from "@/lib/admin/requests";
import { tariffsUpdatedAt } from "@/lib/admin/tariffs";
import { isEmailConfigured, serverEnv } from "@/lib/env";
import { isStorageConfigured } from "@/lib/requests/store";
import { tariffRegistry } from "@/lib/tariffs/registry";
import { cn } from "@/lib/utils";
import { requestTitle, statusLabel } from "./anfragen/request-meta";

export const metadata: Metadata = { title: "Übersicht" };
export const instant = false;

const hourFormat = new Intl.DateTimeFormat("de-CH", { hour: "numeric", hourCycle: "h23", timeZone: "Europe/Zurich" });

/** By the hour in Zurich. formatToParts, because de-CH formats a lone hour as "9 Uhr". */
function greeting(now: Date): string {
  const hour = Number(hourFormat.formatToParts(now).find((p) => p.type === "hour")?.value);
  if (hour >= 5 && hour < 11) return "Guten Morgen";
  if (hour >= 11 && hour < 18) return "Guten Tag";
  return "Guten Abend";
}

function StatusRow({ label, tone, value, hint }: { label: string; tone: PillTone; value: string; hint?: React.ReactNode }) {
  return (
    <div className="py-3">
      <div className="flex items-center justify-between gap-3">
        <span className="text-ink">{label}</span>
        <Pill tone={tone}>{value}</Pill>
      </div>
      {hint ? <p className="mt-1 text-sm leading-relaxed text-muted">{hint}</p> : null}
    </div>
  );
}

export default async function AdminHome() {
  const session = await requireAdmin();
  const [counts, latest, updated, logins] = await Promise.all([requestCounts(), listRequests(undefined, 6), tariffsUpdatedAt(), loginActivity(session.id)]);
  const email = isEmailConfigured();
  const storage = isStorageConfigured();

  const tiles = [
    { label: "Neue Anfragen", short: "Neu", value: counts.neu, href: "/admin/anfragen?status=neu", highlight: counts.neu > 0 },
    { label: "In Bearbeitung", short: "In Bearbeitung", value: counts.in_bearbeitung, href: "/admin/anfragen?status=in_bearbeitung", highlight: false },
    { label: "Erledigt", short: "Erledigt", value: counts.erledigt, href: "/admin/anfragen?status=erledigt", highlight: false },
  ];

  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Übersicht" title={greeting(new Date())}>
        <p>
          Hier sehen Sie neue Anfragen, passen die Preise der Rechner an und prüfen, ob alles läuft.
          {logins.previousLogin ? ` Letzte Anmeldung vor dieser: ${formatDateTime(logins.previousLogin)}.` : null}
        </p>
      </PageHeader>

      {!email && !serverEnv.dryRun ? (
        <Notice tone="danger" title="Der E-Mail-Versand ist nicht eingerichtet">
          Die Formulare auf der Website nehmen keine Anfragen an, bis in Vercel <code>RESEND_API_KEY</code>, <code>CONTACT_TO_EMAIL</code> und{" "}
          <code>CONTACT_FROM_EMAIL</code> gesetzt sind.
        </Notice>
      ) : null}

      <ul className="grid grid-cols-3 gap-2 sm:gap-4">
        {tiles.map((t) => (
          <li key={t.label} className="min-w-0">
            <Link
              href={t.href}
              className={cn(
                "group flex h-full flex-col justify-between gap-4 rounded-2xl border p-3.5 transition-colors sm:gap-6 sm:p-6",
                t.highlight ? "border-forest bg-forest text-cream hover:bg-forest-deep" : "border-line bg-white text-ink hover:border-forest/40",
              )}
            >
              <span className={cn("text-xs leading-snug sm:text-sm", t.highlight ? "text-cream/80" : "text-muted")}>
                <span className="sm:hidden">{t.short}</span>
                <span className="hidden sm:inline">{t.label}</span>
              </span>
              <span className="flex items-end justify-between gap-3">
                <span className={cn("font-serif text-[2rem] leading-none tabular sm:text-[2.75rem]", t.highlight && "text-copper")}>{t.value}</span>
                <ArrowRight
                  aria-hidden
                  className={cn("mb-1 hidden size-5 transition-transform group-hover:translate-x-1 sm:block", t.highlight ? "text-copper" : "text-muted")}
                />
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="grid gap-6 lg:grid-cols-[1fr_22rem] lg:items-start">
        <Card
          className="min-w-0"
          title="Neueste Anfragen"
          actions={
            counts.total > 0 ? (
              <Link href="/admin/anfragen" className="inline-flex items-center gap-1 text-sm font-medium text-forest hover:text-forest-deep">
                Alle {counts.total}
                <ChevronRight aria-hidden className="size-4" />
              </Link>
            ) : null
          }
        >
          {latest.length === 0 ? (
            <div className="flex flex-col items-center rounded-xl border border-dashed border-line px-6 py-12 text-center">
              <Inbox aria-hidden className="size-7 text-bronze" strokeWidth={1.5} />
              <p className="mt-3 font-medium text-ink">Noch keine Anfragen.</p>
              <p className="mt-1 max-w-sm text-sm text-muted">
                {storage
                  ? "Anfragen aus dem Kontaktformular und den Rechnern erscheinen hier und kommen zusätzlich per E-Mail."
                  : "Anfragen kommen per E-Mail. Eine Kopie erscheint hier, sobald die Speicherung eingerichtet ist."}
              </p>
            </div>
          ) : (
            <ul className="-mx-2 divide-y divide-line">
              {latest.map((r) => (
                <li key={r.reference}>
                  <Link href={`/admin/anfragen/${r.reference}`} className="group flex items-center gap-3 rounded-xl px-2 py-3 transition-colors hover:bg-mist">
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-ink">
                        {r.name}
                        {r.company ? <span className="font-normal text-muted"> · {r.company}</span> : null}
                      </p>
                      <p className="text-sm text-muted sm:truncate">
                        <span className="block truncate sm:inline">{requestTitle(r)}</span>
                        <span className="hidden sm:inline"> · </span>
                        <span className="block sm:inline">{formatDateTime(r.createdAt)}</span>
                      </p>
                    </div>
                    <Pill tone={r.status}>{statusLabel(r.status)}</Pill>
                    <ChevronRight aria-hidden className="hidden size-4 shrink-0 text-muted sm:block" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <div className="space-y-6">
          <Card title="Tarife der Rechner">
            <ul className="-mx-2 divide-y divide-line">
              {calculators.map((c) => {
                const at = updated[c.slug];
                return (
                  <li key={c.slug}>
                    <Link href={`/admin/tarife/${c.slug}`} className="group flex items-center gap-3 rounded-xl px-2 py-3 transition-colors hover:bg-mist">
                      <span aria-hidden className="flex size-9 shrink-0 items-center justify-center rounded-full bg-forest text-copper">
                        <Icon name={c.icon} className="size-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-ink">{tariffRegistry[c.slug].title}</span>
                        <span className="block text-sm text-muted">{at ? `Angepasst am ${formatDay(at)}` : "Standardwerte"}</span>
                      </span>
                      <ChevronRight aria-hidden className="size-4 shrink-0 text-muted transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </Card>

          <Card title="Betrieb">
            <div className="-my-3 divide-y divide-line">
              <StatusRow
                label="E-Mail-Versand"
                tone={email ? "ok" : serverEnv.dryRun ? "warning" : "danger"}
                value={email ? "eingerichtet" : serverEnv.dryRun ? "Testmodus" : "fehlt"}
                hint={!email && serverEnv.dryRun ? "Anfragen werden nur protokolliert, nicht versendet." : undefined}
              />
              <StatusRow
                label="Kopie im Admin-Bereich"
                tone={storage ? "ok" : "warning"}
                value={storage ? "aktiv" : "aus"}
                hint={storage ? `Anfragen werden nach ${serverEnv.retentionDays} Tagen automatisch gelöscht.` : "Es fehlt CRON_SECRET oder CONTACT_IP_SALT in Vercel."}
              />
              <StatusRow
                label="Fehlversuche, 7 Tage"
                tone={logins.failed === 0 ? "ok" : logins.failed < 5 ? "neutral" : "warning"}
                value={logins.failed === 0 ? "keine" : String(logins.failed)}
                hint={
                  logins.failed > 0 ? (
                    <Link href="/admin/sicherheit" className="text-forest underline decoration-copper underline-offset-4">
                      Protokoll ansehen
                    </Link>
                  ) : undefined
                }
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
