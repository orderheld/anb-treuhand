import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink, RotateCcw } from "lucide-react";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { Notice, PageHeader, adminButton } from "@/components/admin/ui";
import { calculatorHref } from "@/content/calculators";
import { requireAdmin } from "@/lib/admin/auth/session";
import { savedTariffs } from "@/lib/admin/tariffs";
import { calculatorSlugs, isCalculatorSlug, tariffRegistry } from "@/lib/tariffs/registry";
import { formatDayTime } from "@/lib/admin/format";
import { cn } from "@/lib/utils";
import { resetTariffsAction, saveTariffsAction } from "../actions";
import { TariffForm } from "../tariff-form";

export const instant = false;

export async function generateMetadata({ params }: PageProps<"/admin/tarife/[rechner]">): Promise<Metadata> {
  const { rechner } = await params;
  return { title: isCalculatorSlug(rechner) ? `Tarife ${tariffRegistry[rechner].title}` : "Tarife" };
}

export default async function TariffPage({ params, searchParams }: PageProps<"/admin/tarife/[rechner]">) {
  await requireAdmin();
  const { rechner } = await params;
  if (!isCalculatorSlug(rechner)) notFound();
  const query = await searchParams;
  const entry = tariffRegistry[rechner];
  const saved = await savedTariffs(rechner);
  const savedCount = Number(query.gespeichert);

  return (
    <div className="space-y-8">
      <nav aria-label="Rechner" className="flex flex-wrap gap-2">
        {calculatorSlugs.map((slug) => (
          <Link
            key={slug}
            href={`/admin/tarife/${slug}`}
            aria-current={slug === rechner ? "page" : undefined}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm transition-colors",
              slug === rechner ? "border-accent bg-accent-soft font-semibold text-accent" : "border-line bg-white text-ink hover:border-line-strong",
            )}
          >
            {tariffRegistry[slug].title}
          </Link>
        ))}
      </nav>

      <PageHeader
        eyebrow="Tarife"
        title={entry.title}
        actions={
          <>
            <a href={calculatorHref(rechner)} target="_blank" rel="noopener" className={adminButton("secondary", "sm")}>
              <ExternalLink aria-hidden className="size-4" />
              Rechner ansehen
            </a>
            {saved.updatedAt ? (
              <ConfirmButton
                action={resetTariffsAction.bind(null, rechner)}
                question="Alle Tarife dieses Rechners auf die Standardwerte zurücksetzen? Ihre gespeicherten Werte gehen dabei verloren."
              >
                <RotateCcw aria-hidden className="size-4" />
                Standardwerte
              </ConfirmButton>
            ) : null}
          </>
        }
      >
        <p>
          {saved.updatedAt ? `Zuletzt gespeichert am ${formatDayTime(saved.updatedAt)}.` : "Es gelten die Standardwerte."} Änderungen gelten nach dem Speichern sofort für den
          Rechner auf der Website und für neue Offertanfragen. Alle Preise sind Endpreise.
        </p>
      </PageHeader>

      {Number.isInteger(savedCount) && savedCount > 0 ? (
        <Notice tone="success" title="Tarife gespeichert">
          {savedCount === 1 ? "1 Wert wurde" : `${savedCount} Werte wurden`} geändert. Der Rechner auf der Website rechnet ab sofort mit den neuen Tarifen.
        </Notice>
      ) : null}
      {query.zurueckgesetzt ? (
        <Notice tone="success" title="Standardwerte wiederhergestellt">
          Der Rechner rechnet wieder mit den ursprünglichen Tarifen.
        </Notice>
      ) : null}

      {/* Keyed by the save time, so the fields show the stored values after saving or resetting. */}
      <TariffForm key={saved.updatedAt?.toISOString() ?? "standard"} action={saveTariffsAction.bind(null, rechner)} fields={entry.fields} values={saved.values} />
    </div>
  );
}
