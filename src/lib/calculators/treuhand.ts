import * as z from "zod";
import {
  defaultsOf,
  legalFormLabel,
  legalForms,
  plural,
  rangeOf,
  roundTo,
  totalsOf,
  type Estimate,
  type EstimateLine,
  type LegalForm,
  type TariffField,
  type TariffValues,
} from "./shared";

/**
 * Treuhand-Preisrechner: monthly guide price for ongoing fiduciary work, from the legal form,
 * the bookings per month, the number of employees and the chosen services. Yearly services
 * (year-end closing, tax return) are spread over twelve months; one-off work is shown apart.
 * The defaults are researched starting values for the Oberaargau and must be confirmed by ANB.
 */

export const TREUHAND_FIELDS = [
  { key: "allgemein.rundung", group: "Allgemein", label: "Beträge runden auf", type: "chf", default: 5, min: 1, max: 100, decimals: 0, help: "Jede Position wird auf diesen Betrag gerundet." },
  { key: "allgemein.bandbreite", group: "Allgemein", label: "Bandbreite um den Richtpreis", type: "percent", default: 10, max: 50, decimals: 0, unit: "± %", help: "0 blendet die Bandbreite aus." },
  { key: "allgemein.mindestProMonat", group: "Allgemein", label: "Mindesthonorar", type: "chf", default: 120, max: 10_000, decimals: 0, unit: "pro Monat", help: "Liegt die Summe darunter, wird auf diesen Betrag ergänzt. 0 = kein Mindesthonorar." },
  {
    key: "allgemein.hinweis",
    group: "Allgemein",
    label: "Hinweis unter dem Resultat",
    type: "text",
    maxLength: 400,
    default: "Unverbindlicher Richtpreis. Die verbindliche Offerte erhalten Sie nach dem kostenlosen Erstgespräch.",
  },

  { key: "buchhaltung.aktiv", group: "Finanzbuchhaltung", label: "Im Rechner anbieten", type: "boolean", default: true },
  { key: "buchhaltung.grund.einzelunternehmen", group: "Finanzbuchhaltung", label: "Grundpauschale Einzelunternehmen", type: "chf", default: 90, unit: "pro Monat" },
  { key: "buchhaltung.grund.gmbh", group: "Finanzbuchhaltung", label: "Grundpauschale GmbH", type: "chf", default: 140, unit: "pro Monat" },
  { key: "buchhaltung.grund.ag", group: "Finanzbuchhaltung", label: "Grundpauschale AG", type: "chf", default: 170, unit: "pro Monat" },
  { key: "buchhaltung.inklusive", group: "Finanzbuchhaltung", label: "In der Pauschale enthaltene Buchungen", type: "count", default: 20, max: 10_000, unit: "pro Monat" },
  { key: "buchhaltung.preis1", group: "Finanzbuchhaltung", label: "Preis pro weitere Buchung", type: "chf", default: 2.4, max: 100, unit: "pro Buchung" },
  { key: "buchhaltung.stufe2", group: "Finanzbuchhaltung", label: "Stufe 2 ab Buchung Nr.", type: "count", default: 151, min: 1, max: 100_000, unit: "im Monat", help: "Ab dieser Buchung eines Monats gilt der Preis der Stufe 2." },
  { key: "buchhaltung.preis2", group: "Finanzbuchhaltung", label: "Preis pro Buchung in Stufe 2", type: "chf", default: 1.9, max: 100, unit: "pro Buchung" },
  { key: "buchhaltung.stufe3", group: "Finanzbuchhaltung", label: "Stufe 3 ab Buchung Nr.", type: "count", default: 401, min: 1, max: 100_000, unit: "im Monat", help: "Ab dieser Buchung eines Monats gilt der Preis der Stufe 3." },
  { key: "buchhaltung.preis3", group: "Finanzbuchhaltung", label: "Preis pro Buchung in Stufe 3", type: "chf", default: 1.5, max: 100, unit: "pro Buchung" },

  { key: "debikredi.aktiv", group: "Debitoren & Kreditoren", label: "Im Rechner anbieten", type: "boolean", default: true },
  { key: "debikredi.pauschale", group: "Debitoren & Kreditoren", label: "Pauschale", type: "chf", default: 45, unit: "pro Monat" },
  { key: "debikredi.proBuchung", group: "Debitoren & Kreditoren", label: "Zuschlag pro Buchung", type: "chf", default: 0.6, max: 100, unit: "pro Buchung" },

  { key: "mwst.aktiv", group: "MWST-Abrechnungen", label: "Im Rechner anbieten", type: "boolean", default: true },
  { key: "mwst.effektiv", group: "MWST-Abrechnungen", label: "Abrechnung effektive Methode", type: "chf", default: 190, unit: "pro Quartal" },
  { key: "mwst.saldo", group: "MWST-Abrechnungen", label: "Abrechnung Saldosteuersatz", type: "chf", default: 160, unit: "pro Halbjahr" },
  { key: "mwst.jahresabstimmung", group: "MWST-Abrechnungen", label: "Jährliche Umsatzabstimmung", type: "chf", default: 120, unit: "pro Jahr" },

  { key: "lohn.aktiv", group: "Lohnbuchhaltung", label: "Im Rechner anbieten", type: "boolean", default: true },
  { key: "lohn.grund", group: "Lohnbuchhaltung", label: "Grundpauschale", type: "chf", default: 40, unit: "pro Monat" },
  { key: "lohn.proPerson", group: "Lohnbuchhaltung", label: "Lohnabrechnung pro Person", type: "chf", default: 35, unit: "pro Monat" },
  { key: "lohn.jahrProPerson", group: "Lohnbuchhaltung", label: "Lohnausweis pro Person", type: "chf", default: 30, unit: "pro Jahr" },
  { key: "lohn.jahrPauschale", group: "Lohnbuchhaltung", label: "Jahresmeldungen Sozialversicherungen", type: "chf", default: 180, unit: "pro Jahr" },

  { key: "abschluss.aktiv", group: "Jahresabschluss", label: "Im Rechner anbieten", type: "boolean", default: true },
  { key: "abschluss.einzelunternehmen", group: "Jahresabschluss", label: "Jahresabschluss Einzelunternehmen", type: "chf", default: 950, unit: "pro Jahr" },
  { key: "abschluss.gmbh", group: "Jahresabschluss", label: "Jahresabschluss GmbH", type: "chf", default: 1450, unit: "pro Jahr" },
  { key: "abschluss.ag", group: "Jahresabschluss", label: "Jahresabschluss AG", type: "chf", default: 1850, unit: "pro Jahr" },
  {
    key: "abschluss.proBuchung",
    group: "Jahresabschluss",
    label: "Zuschlag je Buchung pro Monat",
    type: "chf",
    default: 2,
    max: 100,
    unit: "pro Jahr",
    help: "Mehr Buchungen bedeuten mehr Abschlussarbeit: Bei 100 Buchungen pro Monat und CHF 2 kommen CHF 200 pro Jahr dazu.",
  },

  { key: "steuern.aktiv", group: "Steuererklärung", label: "Im Rechner anbieten", type: "boolean", default: true },
  { key: "steuern.einzelunternehmen", group: "Steuererklärung", label: "Einzelunternehmen (inkl. private Steuererklärung)", type: "chf", default: 480, unit: "pro Jahr" },
  { key: "steuern.gmbh", group: "Steuererklärung", label: "GmbH", type: "chf", default: 650, unit: "pro Jahr" },
  { key: "steuern.ag", group: "Steuererklärung", label: "AG", type: "chf", default: 780, unit: "pro Jahr" },

  { key: "beratung.aktiv", group: "Beratung", label: "Im Rechner anbieten", type: "boolean", default: true },
  { key: "beratung.proQuartal", group: "Beratung", label: "Quartalsgespräch mit Auswertung und Liquiditätsplanung", type: "chf", default: 290, unit: "pro Quartal" },

  { key: "digital.aktiv", group: "Digitalisierung (einmalig)", label: "Im Rechner anbieten", type: "boolean", default: true },
  { key: "digital.einzelunternehmen", group: "Digitalisierung (einmalig)", label: "Einrichtung Einzelunternehmen", type: "chf", default: 350, unit: "einmalig" },
  { key: "digital.gmbh", group: "Digitalisierung (einmalig)", label: "Einrichtung GmbH", type: "chf", default: 450, unit: "einmalig" },
  { key: "digital.ag", group: "Digitalisierung (einmalig)", label: "Einrichtung AG", type: "chf", default: 550, unit: "einmalig" },
] as const satisfies readonly TariffField[];

export type TreuhandTariffs = TariffValues<typeof TREUHAND_FIELDS>;
export const TREUHAND_DEFAULTS: TreuhandTariffs = defaultsOf(TREUHAND_FIELDS);

/** Services of the calculator, in display order. `aktiv` refers to the tariff toggle. */
export const treuhandServices = [
  { value: "buchhaltung", label: "Finanzbuchhaltung", description: "Laufende Buchführung, Kontenabstimmung, Auswertungen." },
  { value: "debikredi", label: "Debitoren & Kreditoren", description: "Rechnungen, Zahlungsverkehr, offene Posten, Mahnwesen." },
  { value: "mwst", label: "MWST-Abrechnungen", description: "Quartals- oder Halbjahresabrechnung mit der ESTV." },
  { value: "lohn", label: "Lohnbuchhaltung", description: "Monatliche Löhne, Lohnausweise, Sozialversicherungen." },
  { value: "abschluss", label: "Jahresabschluss", description: "Bilanz und Erfolgsrechnung, auf 12 Monate verteilt." },
  { value: "steuern", label: "Steuererklärung", description: "Steuererklärung des Unternehmens, auf 12 Monate verteilt." },
  { value: "beratung", label: "Beratung im Quartal", description: "Auswertung, Liquiditätsplanung und Gespräch alle drei Monate." },
  { value: "digital", label: "Digitalisierung", description: "Einmalige Einrichtung: digitale Belegablage, Software, Bankanbindung." },
] as const;

export type TreuhandService = (typeof treuhandServices)[number]["value"];

export const vatMethods = [
  { value: "effektiv", label: "Effektive Methode", description: "Abrechnung jedes Quartal" },
  { value: "saldo", label: "Saldosteuersatz", description: "Abrechnung jedes Halbjahr" },
] as const;

export type VatMethod = (typeof vatMethods)[number]["value"];

const serviceValues = treuhandServices.map((s) => s.value) as [TreuhandService, ...TreuhandService[]];

export const treuhandInputSchema = z.object({
  rechtsform: z.enum(legalForms.map((f) => f.value) as [LegalForm, ...LegalForm[]], { error: "Bitte wählen Sie die Rechtsform." }),
  buchungen: z.coerce.number({ error: "Bitte geben Sie die Anzahl Buchungen an." }).int().min(0).max(5000),
  mitarbeitende: z.coerce.number({ error: "Bitte geben Sie die Anzahl Mitarbeitende an." }).int().min(0).max(1000),
  leistungen: z
    .array(z.enum(serviceValues, { error: "Unbekannte Leistung." }))
    .min(1, "Bitte wählen Sie mindestens eine Leistung.")
    .max(serviceValues.length)
    .transform((list) => [...new Set(list)]),
  mwstMethode: z.enum(vatMethods.map((m) => m.value) as [VatMethod, ...VatMethod[]]).default("effektiv"),
});

export type TreuhandInput = z.output<typeof treuhandInputSchema>;

export const TREUHAND_START: TreuhandInput = {
  rechtsform: "gmbh",
  buchungen: 60,
  mitarbeitende: 2,
  leistungen: ["buchhaltung", "mwst", "lohn", "abschluss", "steuern"],
  mwstMethode: "effektiv",
};

/** Services offered by the current tariffs. */
export function activeTreuhandServices(t: TreuhandTariffs) {
  return treuhandServices.filter((s) => t[`${s.value}.aktiv`]);
}

/** Bookings beyond the included ones, split into the three volume steps. */
export function bookingSteps(bookings: number, t: TreuhandTariffs): { count: number; price: number }[] {
  const included = t["buchhaltung.inklusive"];
  const s2 = t["buchhaltung.stufe2"] - 1;
  const s3 = Math.max(s2, t["buchhaltung.stufe3"] - 1);
  const step1 = Math.max(0, Math.min(bookings, s2) - included);
  const step2 = Math.max(0, Math.min(bookings, s3) - Math.max(included, s2));
  const step3 = Math.max(0, bookings - Math.max(included, s3));
  return [
    { count: step1, price: t["buchhaltung.preis1"] },
    { count: step2, price: t["buchhaltung.preis2"] },
    { count: step3, price: t["buchhaltung.preis3"] },
  ];
}

const chf = (n: number) => `CHF ${new Intl.NumberFormat("de-CH", { maximumFractionDigits: 0 }).format(n)}`;

export function calculateTreuhand(input: TreuhandInput, t: TreuhandTariffs): Estimate {
  const step = t["allgemein.rundung"];
  const rf = input.rechtsform;
  const n = input.buchungen;
  const offered = new Set(activeTreuhandServices(t).map((s) => s.value));
  const selected = treuhandServices.filter((s) => input.leistungen.includes(s.value) && offered.has(s.value)).map((s) => s.value);
  const lines: EstimateLine[] = [];
  const warnings: string[] = [];
  const monthly = (key: string, label: string, amount: number, detail?: string) =>
    lines.push({ key, label, amount: roundTo(amount, step), period: "monat", detail });

  for (const service of selected) {
    switch (service) {
      case "buchhaltung": {
        const base = t[`buchhaltung.grund.${rf}`];
        const extra = bookingSteps(n, t).reduce((sum, s) => sum + s.count * s.price, 0);
        monthly("buchhaltung", "Finanzbuchhaltung", base + extra, `${plural(n, "Buchung", "Buchungen")} pro Monat, ${legalFormLabel(rf)}`);
        break;
      }
      case "debikredi":
        monthly("debikredi", "Debitoren & Kreditoren", t["debikredi.pauschale"] + t["debikredi.proBuchung"] * n, "Rechnungen, Zahlungen, offene Posten");
        break;
      case "mwst": {
        const effektiv = input.mwstMethode === "effektiv";
        const perYear = (effektiv ? t["mwst.effektiv"] * 4 : t["mwst.saldo"] * 2) + t["mwst.jahresabstimmung"];
        monthly("mwst", "MWST-Abrechnungen", perYear / 12, effektiv ? "Effektive Methode, vier Abrechnungen pro Jahr" : "Saldosteuersatz, zwei Abrechnungen pro Jahr");
        break;
      }
      case "lohn": {
        const people = Math.max(1, input.mitarbeitende);
        if (input.mitarbeitende === 0) warnings.push("Für die Lohnbuchhaltung rechnen wir mit mindestens einer Person.");
        const perMonth = t["lohn.grund"] + t["lohn.proPerson"] * people + (t["lohn.jahrProPerson"] * people + t["lohn.jahrPauschale"]) / 12;
        monthly("lohn", "Lohnbuchhaltung", perMonth, `${plural(people, "Person", "Personen")}, inkl. Lohnausweise und Jahresmeldungen`);
        break;
      }
      case "abschluss": {
        const perYear = t[`abschluss.${rf}`] + t["abschluss.proBuchung"] * n;
        monthly("abschluss", "Jahresabschluss", perYear / 12, `rund ${chf(roundTo(perYear, step))} pro Jahr, auf 12 Monate verteilt`);
        break;
      }
      case "steuern": {
        const perYear = t[`steuern.${rf}`];
        const who = rf === "einzelunternehmen" ? "inkl. private Steuererklärung" : `Steuererklärung ${legalFormLabel(rf)}`;
        monthly("steuern", "Steuererklärung", perYear / 12, `${chf(roundTo(perYear, step))} pro Jahr, ${who}`);
        break;
      }
      case "beratung":
        monthly("beratung", "Beratung im Quartal", (t["beratung.proQuartal"] * 4) / 12, "vier Gespräche pro Jahr mit Auswertung");
        break;
      case "digital":
        lines.push({
          key: "digital",
          label: "Digitalisierung der Buchhaltung",
          amount: roundTo(t[`digital.${rf}`], step),
          period: "einmalig",
          detail: "Einrichtung von Belegablage, Software und Bankanbindung",
        });
        break;
    }
  }

  const minimum = t["allgemein.mindestProMonat"];
  const subtotal = totalsOf(lines).monat;
  if (subtotal > 0 && minimum > 0 && subtotal < minimum) {
    lines.push({ key: "mindest", label: "Ergänzung auf Mindesthonorar", amount: roundTo(minimum - subtotal, 1), period: "monat", detail: `Mindesthonorar ${chf(minimum)} pro Monat` });
  }

  const totals = totalsOf(lines);
  totals.jahr = totals.monat * 12;
  return { lines, totals, range: rangeOf(totals.monat, t["allgemein.bandbreite"]), warnings };
}
