import type { Metadata } from "next";
import { KeyRound, LogOut, Monitor, Smartphone } from "lucide-react";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { AdminLinkButton, Card, PageHeader, Pill } from "@/components/admin/ui";
import { recentAudit } from "@/lib/admin/audit";
import { LOGIN_WINDOW_MINUTES, PER_IP_LIMIT } from "@/lib/admin/auth/rate-limit";
import { ABSOLUTE_HOURS, IDLE_HOURS, activeAdminSessions, requireAdmin } from "@/lib/admin/auth/session";
import { describeUserAgent } from "@/lib/admin/device";
import { formatDateTime } from "@/lib/admin/format";
import { cn } from "@/lib/utils";
import { logoutAllAction } from "./actions";
import { describeAudit } from "./audit-meta";

export const metadata: Metadata = { title: "Sicherheit" };
export const instant = false;

const AUDIT_LIMIT = 50;

const protections = [
  "Anmeldung nur mit Passwort und dem sechsstelligen Code aus der Authenticator-App.",
  `Jeder Code gilt nur einmal. Nach ${PER_IP_LIMIT} Fehlversuchen ist die Adresse für ${LOGIN_WINDOW_MINUTES} Minuten gesperrt.`,
  `Eine Anmeldung gilt höchstens ${ABSOLUTE_HOURS} Stunden und endet nach ${IDLE_HOURS} Stunden ohne Aktivität.`,
  "Ein neues Passwort oder ein neuer Code-Schlüssel meldet alle Geräte ab.",
];

export default async function SecurityPage() {
  const session = await requireAdmin();
  const [sessions, entries] = await Promise.all([activeAdminSessions(), recentAudit(AUDIT_LIMIT)]);

  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Sicherheit" title="Zugang und Protokoll">
        <p>Hier sehen Sie, auf welchen Geräten jemand angemeldet ist und was zuletzt geändert wurde.</p>
      </PageHeader>

      <div className="grid gap-6 lg:grid-cols-[1fr_22rem] lg:items-start">
        <div className="min-w-0 space-y-6">
          <Card
            title="Angemeldete Geräte"
            description={sessions.length === 1 ? "Nur dieses Gerät ist angemeldet." : `${sessions.length} Geräte sind angemeldet.`}
            actions={
              <ConfirmButton
                variant="danger"
                action={logoutAllAction}
                question="Alle Geräte abmelden, auch dieses? Danach ist eine neue Anmeldung mit Passwort und Code nötig."
              >
                <LogOut aria-hidden className="size-4" />
                Alle abmelden
              </ConfirmButton>
            }
          >
            <ul className="divide-y divide-line">
              {sessions.map((s) => {
                const label = describeUserAgent(s.userAgent);
                const mobile = /iPhone|iPad|Android/.test(label);
                const DeviceIcon = mobile ? Smartphone : Monitor;
                return (
                  <li key={s.id} className="flex items-start gap-3 py-3">
                    <span aria-hidden className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-mist text-forest">
                      <DeviceIcon className="size-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="flex flex-wrap items-center gap-2 text-ink">
                        {label}
                        {s.id === session.id ? <Pill tone="ok">Dieses Gerät</Pill> : null}
                      </p>
                      <p className="text-sm text-muted">
                        Angemeldet {formatDateTime(s.createdAt)} · zuletzt aktiv {formatDateTime(s.lastSeenAt)}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </Card>

          <Card title="Protokoll" description={`Die letzten ${AUDIT_LIMIT} Anmeldungen und Änderungen. Einträge werden nach zwei Jahren gelöscht.`}>
            {entries.length === 0 ? (
              <p className="text-sm text-muted">Noch keine Einträge.</p>
            ) : (
              <ol className="divide-y divide-line">
                {entries.map((entry) => {
                  const line = describeAudit(entry);
                  return (
                    <li key={entry.id} className="grid gap-x-6 gap-y-0.5 py-3 sm:grid-cols-[10.5rem_1fr]">
                      <time dateTime={entry.at.toISOString()} className="text-sm tabular text-muted">
                        {formatDateTime(entry.at)}
                      </time>
                      <div className="min-w-0">
                        <p className={cn("flex items-center gap-2 break-words", line.warning ? "text-amber-900" : "text-ink")}>
                          {line.warning ? <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-amber-500" /> : null}
                          {line.title}
                        </p>
                        {line.detail ? <p className="break-words text-sm text-muted">{line.detail}</p> : null}
                      </div>
                    </li>
                  );
                })}
              </ol>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="So ist der Zugang geschützt">
            <ul className="space-y-3 text-sm leading-relaxed text-muted">
              {protections.map((text) => (
                <li key={text} className="flex gap-3">
                  <span aria-hidden className="mt-2 h-px w-3 shrink-0 bg-copper" />
                  {text}
                </li>
              ))}
            </ul>
          </Card>

          <Card
            title="Passwort oder Handy wechseln"
            description="Steht im Protokoll «Richtiges Passwort, falscher Code» und Sie waren es nicht, ändern Sie bitte das Passwort."
          >
            <AdminLinkButton href="/admin/einrichtung" variant="secondary" size="sm">
              <KeyRound aria-hidden className="size-4" />
              Zur Einrichtung
            </AdminLinkButton>
          </Card>
        </div>
      </div>
    </div>
  );
}
