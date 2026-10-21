import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, Phone, Trash2 } from "lucide-react";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { Card, DetailList, Notice, PageHeader, Pill, adminButton } from "@/components/admin/ui";
import { phoneHref } from "@/config/site";
import { requireAdmin } from "@/lib/admin/auth/session";
import { formatDayTime } from "@/lib/admin/format";
import { getRequest, requestStatuses, type RequestDetail } from "@/lib/admin/requests";
import { parseCalculatorInput } from "@/lib/calculators/index";
import type { Estimate } from "@/lib/calculators/shared";
import { labelOf, timings } from "@/lib/requests/options";
import { estimateLineRows, inputRows, totalRows } from "@/lib/requests/summary";
import { cn } from "@/lib/utils";
import { deleteRequestAction, setStatusAction } from "../actions";
import { requestTitle, statusLabel } from "../request-meta";

export const metadata: Metadata = { title: "Anfrage" };
export const instant = false;

/** The stored estimate is our own JSON, but older rows may have another shape. */
function storedEstimate(value: unknown): Estimate | null {
  const e = value as Partial<Estimate> | null;
  if (!e || !Array.isArray(e.lines) || typeof e.totals !== "object" || e.totals === null) return null;
  return { lines: e.lines, totals: e.totals, range: e.range ?? null, warnings: Array.isArray(e.warnings) ? e.warnings : [] };
}

function delivery(r: RequestDetail): { label: string; tone: "erledigt" | "danger" | "neutral" } {
  if (r.emailStatus === "sent") return { label: "per E-Mail zugestellt", tone: "erledigt" };
  if (r.emailStatus === "dry_run") return { label: "Testmodus, keine E-Mail", tone: "neutral" };
  return { label: "E-Mail fehlgeschlagen", tone: "danger" };
}

function confirmationLabel(r: RequestDetail): string {
  if (r.emailStatus === "dry_run") return "Testmodus";
  if (r.confirmationStatus === "sent") return "gesendet";
  if (r.confirmationStatus === "failed") return "fehlgeschlagen";
  return "keine";
}

export default async function RequestPage({ params }: PageProps<"/admin/anfragen/[ref]">) {
  await requireAdmin();
  const { ref } = await params;
  const r = await getRequest(decodeURIComponent(ref));
  if (!r) notFound();

  const calc = r.kind === "offerte" && r.calculator ? parseCalculatorInput(r.calculator, r.input) : null;
  const estimate = r.kind === "offerte" ? storedEstimate(r.estimate) : null;
  const sent = delivery(r);
  const replySubject = encodeURIComponent(`Ihre Anfrage bei ANB Treuhand (${r.reference})`);

  return (
    <div className="space-y-8">
      <Link href="/admin/anfragen" className="inline-flex items-center gap-2 text-sm text-muted hover:text-ink">
        <ArrowLeft aria-hidden className="size-4" />
        Alle Anfragen
      </Link>

      <PageHeader
        eyebrow={requestTitle(r)}
        title={r.name}
        actions={
          <>
            <a href={`mailto:${r.email}?subject=${replySubject}`} className={adminButton("primary", "sm")}>
              <Mail aria-hidden className="size-4" />
              Antworten
            </a>
            {r.phone ? (
              <a href={phoneHref(r.phone)} className={adminButton("secondary", "sm")}>
                <Phone aria-hidden className="size-4" />
                Anrufen
              </a>
            ) : null}
          </>
        }
      >
        <p>
          {formatDayTime(r.createdAt)} · Referenz <span className="whitespace-nowrap font-mono text-ink">{r.reference}</span>
        </p>
      </PageHeader>

      {r.emailStatus === "failed" ? (
        <Notice tone="danger" title="Diese Anfrage kam nicht per E-Mail an">
          Bitte melden Sie sich direkt bei der Person. {r.emailError ? <span className="text-red-900/80">Fehler: {r.emailError}</span> : null}
        </Notice>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[1fr_20rem] lg:items-start">
        <div className="min-w-0 space-y-6">
          <Card title="Kontakt">
            <DetailList
              rows={[
                { label: "Name", value: r.name },
                ...(r.company ? [{ label: "Firma", value: r.company }] : []),
                { label: "E-Mail", value: <a href={`mailto:${r.email}?subject=${replySubject}`} className="text-forest underline decoration-copper underline-offset-4">{r.email}</a> },
                ...(r.phone ? [{ label: "Telefon", value: <a href={phoneHref(r.phone)} className="text-forest underline decoration-copper underline-offset-4">{r.phone}</a> }] : []),
                ...(r.timing ? [{ label: "Gewünschter Start", value: labelOf(timings, r.timing) }] : []),
              ]}
            />
          </Card>

          {r.message ? (
            <Card title="Nachricht">
              <p className="whitespace-pre-line break-words leading-relaxed text-ink">{r.message}</p>
            </Card>
          ) : null}

          {calc?.ok ? (
            <Card title="Angaben im Rechner">
              <DetailList rows={inputRows(calc.value).map((row) => ({ label: row.label, value: row.value }))} />
            </Card>
          ) : null}

          {estimate && r.calculator ? (
            <Card title="Berechneter Richtpreis" description="So hat der Rechner beim Absenden gerechnet, mit den damaligen Tarifen.">
              <ul className="divide-y divide-line">
                {estimateLineRows(estimate).map((line, i) => (
                  <li key={i} className="flex items-baseline justify-between gap-4 py-2.5 text-[0.9375rem]">
                    <span className="min-w-0">
                      <span className="text-ink">{line.label}</span>
                      {line.detail ? <span className="block text-sm text-muted">{line.detail}</span> : null}
                    </span>
                    <span className={cn("shrink-0 whitespace-nowrap tabular", line.external ? "text-muted" : "text-ink")}>{line.amount}</span>
                  </li>
                ))}
              </ul>
              <DetailList className="mt-4 border-t border-forest/20 pt-2" rows={totalRows(r.calculator, estimate).map((row) => ({ label: row.label, value: <strong className="font-medium">{row.value}</strong> }))} />
            </Card>
          ) : null}
        </div>

        <div className="space-y-6">
          <Card title="Status">
            <form action={setStatusAction.bind(null, r.reference)} className="space-y-2">
              {requestStatuses.map((s) => (
                <button
                  key={s.value}
                  type="submit"
                  name="status"
                  value={s.value}
                  aria-pressed={r.status === s.value}
                  className={cn(
                    "flex w-full items-center justify-between rounded-xl border px-4 py-2.5 text-left text-[0.9375rem] transition-colors",
                    r.status === s.value ? "border-forest bg-forest text-cream" : "border-line bg-white text-ink hover:border-forest/40",
                  )}
                >
                  {s.label}
                  {r.status === s.value ? <span className="text-xs text-cream/70">aktuell</span> : null}
                </button>
              ))}
            </form>
            <p className="mt-4 text-sm text-muted">Zuletzt geändert: {formatDayTime(r.updatedAt)}</p>
          </Card>

          <Card title="Zustellung">
            <div className="space-y-2 text-sm">
              <p className="flex items-center justify-between gap-3">
                <span className="text-muted">An ANB Treuhand</span>
                <Pill tone={sent.tone}>{sent.label}</Pill>
              </p>
              <p className="flex items-center justify-between gap-3">
                <span className="text-muted">Bestätigung an Absender</span>
                <span className="text-ink">{confirmationLabel(r)}</span>
              </p>
              <p className="flex items-center justify-between gap-3">
                <span className="text-muted">Status</span>
                <Pill tone={r.status}>{statusLabel(r.status)}</Pill>
              </p>
            </div>
          </Card>

          <Card title="Löschen" description="Zum Beispiel, wenn jemand die Löschung seiner Daten verlangt. Die E-Mail in Ihrem Postfach bleibt bestehen.">
            <ConfirmButton variant="danger" action={deleteRequestAction.bind(null, r.reference)} question={`Anfrage ${r.reference} von ${r.name} endgültig löschen?`}>
              <Trash2 aria-hidden className="size-4" />
              Anfrage löschen
            </ConfirmButton>
          </Card>
        </div>
      </div>
    </div>
  );
}
