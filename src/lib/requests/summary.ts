import type { CalculatorSlug } from "@/content/types";
import { cantons, foundingExtras, foundingSubtotals } from "@/lib/calculators/gruendung";
import { includingService, propertyServices, propertyTypes, recurringPerYear } from "@/lib/calculators/immobilien";
import type { CalculatorRequest } from "@/lib/calculators/index";
import { legalFormLabel, type Estimate, type EstimateLine } from "@/lib/calculators/shared";
import { treuhandServices, vatMethods } from "@/lib/calculators/treuhand";
import { formatChf, formatNumber } from "@/lib/utils";

/**
 * Readable summaries of an offer request, used by the e-mails and the admin area. Pure functions
 * without server dependencies.
 */

export interface SummaryRow {
  label: string;
  value: string;
  /** Typed by the visitor. Left out of the confirmation e-mail, so the form cannot be used to send arbitrary text. */
  free?: boolean;
}

const periodShort: Record<EstimateLine["period"], string> = { monat: "pro Monat", jahr: "pro Jahr", einmalig: "einmalig" };

/** The values the visitor chose in the calculator. */
export function inputRows(request: CalculatorRequest): SummaryRow[] {
  switch (request.slug) {
    case "treuhand": {
      const i = request.input;
      const vat = vatMethods.find((m) => m.value === i.mwstMethode)?.label ?? i.mwstMethode;
      const services = treuhandServices
        .filter((s) => i.leistungen.includes(s.value))
        .map((s) => (s.value === "mwst" ? `${s.label} (${vat})` : s.label));
      return [
        { label: "Rechtsform", value: legalFormLabel(i.rechtsform) },
        { label: "Buchungen pro Monat", value: formatNumber(i.buchungen) },
        { label: "Mitarbeitende mit Lohn", value: formatNumber(i.mitarbeitende) },
        { label: "Leistungen", value: services.join(", ") || "–" },
      ];
    }
    case "firmengruendung": {
      const i = request.input;
      const corporate = i.rechtsform !== "einzelunternehmen";
      const canton = cantons.find(([code]) => code === i.kanton)?.[1] ?? i.kanton;
      const extras = foundingExtras
        .filter((e) => i.zusatz.includes(e.value) && (e.forms as readonly string[]).includes(i.rechtsform))
        .map((e) => e.label);
      const rows: SummaryRow[] = [
        { label: "Rechtsform", value: legalFormLabel(i.rechtsform) },
        { label: "Firmenname", value: i.firmenname ?? "–", free: true },
        { label: "Sitz", value: i.sitz ?? "–", free: true },
        { label: "Kanton", value: canton },
        { label: "Zweck", value: i.zweck ?? "–", free: true },
      ];
      if (corporate) {
        rows.push(
          { label: "Gründerinnen und Gründer", value: formatNumber(i.gesellschafter) },
          { label: i.rechtsform === "gmbh" ? "Stammkapital" : "Aktienkapital", value: formatChf(Math.max(i.kapital, 0)) },
        );
      } else {
        rows.push({ label: "Eintrag ins Handelsregister", value: i.hrEintrag ? "Ja" : "Nein" });
      }
      rows.push({ label: "Zusatzleistungen", value: extras.join(", ") || "Keine" });
      return rows;
    }
    case "immobilien": {
      const i = request.input;
      const type = propertyTypes.find((p) => p.value === i.objektart);
      const services = propertyServices.filter((s) => i.leistungen.includes(s.value));
      const rows: SummaryRow[] = [
        { label: "Art der Immobilie", value: type?.label ?? i.objektart },
        { label: "Standort", value: i.standort ?? "–", free: true },
        { label: type?.unitLabel ?? "Einheiten", value: formatNumber(i.einheiten) },
      ];
      if (i.objektart !== "stwe") {
        rows.push({ label: "Mieteinnahmen", value: i.mietertrag > 0 ? `${formatChf(i.mietertrag)} ${i.mietertragPeriode === "monat" ? "pro Monat" : "pro Jahr"}` : "–" });
      }
      rows.push({ label: "Leistungen", value: services.map((s) => s.label).join(", ") || "–" });
      const selected = services.map((s) => s.value);
      if (selected.includes("uebergaben") && !includingService("uebergaben", selected)) {
        rows.push({ label: "Abnahmen und Übergaben pro Jahr", value: formatNumber(i.uebergabenProJahr) });
      }
      if (selected.includes("verkauf")) rows.push({ label: "Geschätzter Verkaufspreis", value: i.verkaufspreis > 0 ? formatChf(i.verkaufspreis) : "–" });
      if (selected.includes("sanierung")) rows.push({ label: "Geschätzte Bausumme", value: i.bausumme > 0 ? formatChf(i.bausumme) : "–" });
      return rows;
    }
  }
}

/** The positions of the result, with the amount as text ("CHF 235 pro Monat", "inklusive"). */
export function estimateLineRows(estimate: Estimate): { label: string; detail?: string; amount: string; external?: boolean }[] {
  return estimate.lines.map((line) => ({
    label: line.label,
    detail: line.detail,
    amount: line.included ? "inklusive" : `${formatChf(line.amount)} ${periodShort[line.period]}`,
    external: line.external,
  }));
}

/** Totals of a result, in the order of the result panel. */
export function totalRows(slug: CalculatorSlug, estimate: Estimate): SummaryRow[] {
  const { totals, range } = estimate;
  const rows: SummaryRow[] = [];
  switch (slug) {
    case "treuhand":
      rows.push({ label: "Richtpreis pro Monat", value: formatChf(totals.monat) }, { label: "Pro Jahr", value: formatChf(totals.jahr) });
      if (range) rows.push({ label: "Bandbreite", value: `${formatChf(range.from)} bis ${formatNumber(range.to)} pro Monat` });
      if (totals.einmalig > 0) rows.push({ label: "Einmalig", value: formatChf(totals.einmalig) });
      break;
    case "firmengruendung": {
      const sub = foundingSubtotals(estimate);
      rows.push(
        { label: "Honorar ANB Treuhand", value: formatChf(sub.fee) },
        { label: "Externe Kosten (Schätzung)", value: formatChf(sub.external) },
        { label: "Total einmalig", value: formatChf(totals.einmalig) },
      );
      if (range) rows.push({ label: "Bandbreite", value: `${formatChf(range.from)} bis ${formatNumber(range.to)}` });
      break;
    }
    case "immobilien": {
      const recurring = recurringPerYear(estimate);
      if (recurring > 0) {
        rows.push({ label: "Laufend pro Jahr", value: formatChf(recurring) });
        if (range) rows.push({ label: "Bandbreite", value: `${formatChf(range.from)} bis ${formatNumber(range.to)} pro Jahr` });
      }
      if (totals.einmalig > 0) rows.push({ label: "Einmalig", value: formatChf(totals.einmalig) });
      break;
    }
  }
  return rows;
}
