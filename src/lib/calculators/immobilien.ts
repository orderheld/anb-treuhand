import * as z from "zod";
import {
  defaultsOf,
  plural,
  rangeOf,
  roundTo,
  totalsOf,
  type Estimate,
  type EstimateLine,
  type TariffField,
  type TariffValues,
} from "./shared";

/**
 * Immobilien-Preisrechner: guide prices for property services. Management of rental property is
 * a percentage of the gross rent with minimums; condominium management, accounting and service
 * charge statements are priced per unit and year; sale and renovation are one-off percentages.
 *
 * Inclusions (fixed, see docs/TARIFE.md): rental management includes rent collection, dunning,
 * tenancy agreements, handovers, maintenance organisation, property accounting and the owner's
 * statement. Condominium management includes its accounting and the annual statement.
 */

export const IMMOBILIEN_FIELDS = [
  { key: "allgemein.rundung", group: "Allgemein", label: "Beträge runden auf", type: "chf", default: 5, min: 1, max: 100, decimals: 0 },
  { key: "allgemein.bandbreite", group: "Allgemein", label: "Bandbreite um den Richtpreis", type: "percent", default: 10, max: 50, decimals: 0, unit: "± %", help: "0 blendet die Bandbreite aus." },
  {
    key: "allgemein.hinweis",
    group: "Allgemein",
    label: "Hinweis unter dem Resultat",
    type: "text",
    maxLength: 400,
    default: "Unverbindlicher Richtpreis. Nach einer Besichtigung erhalten Sie eine verbindliche Offerte.",
  },

  { key: "verwaltung.aktiv", group: "Verwaltung Mietliegenschaften", label: "Im Rechner anbieten", type: "boolean", default: true },
  { key: "verwaltung.satz.wohnung", group: "Verwaltung Mietliegenschaften", label: "Honorar Eigentumswohnung", type: "percent", default: 5, max: 20, unit: "% des Bruttomietertrags" },
  { key: "verwaltung.satz.efh", group: "Verwaltung Mietliegenschaften", label: "Honorar Einfamilienhaus", type: "percent", default: 5, max: 20, unit: "% des Bruttomietertrags" },
  { key: "verwaltung.satz.mfh", group: "Verwaltung Mietliegenschaften", label: "Honorar Mehrfamilienhaus", type: "percent", default: 4.5, max: 20, unit: "% des Bruttomietertrags" },
  { key: "verwaltung.satz.gewerbe", group: "Verwaltung Mietliegenschaften", label: "Honorar Gewerbeliegenschaft", type: "percent", default: 4, max: 20, unit: "% des Bruttomietertrags" },
  { key: "verwaltung.satz.gemischt", group: "Verwaltung Mietliegenschaften", label: "Honorar Wohn- und Geschäftshaus", type: "percent", default: 4.25, max: 20, unit: "% des Bruttomietertrags" },
  { key: "verwaltung.minProEinheit", group: "Verwaltung Mietliegenschaften", label: "Mindestens pro Mieteinheit", type: "chf", default: 45, unit: "pro Monat" },
  { key: "verwaltung.minProJahr", group: "Verwaltung Mietliegenschaften", label: "Mindesthonorar pro Liegenschaft", type: "chf", default: 2400, unit: "pro Jahr" },

  { key: "stwe.aktiv", group: "Verwaltung Stockwerkeigentum", label: "Im Rechner anbieten", type: "boolean", default: true },
  { key: "stwe.proEinheit", group: "Verwaltung Stockwerkeigentum", label: "Honorar pro Stockwerkeinheit", type: "chf", default: 420, unit: "pro Jahr" },
  { key: "stwe.minProJahr", group: "Verwaltung Stockwerkeigentum", label: "Mindesthonorar pro Gemeinschaft", type: "chf", default: 3000, unit: "pro Jahr" },

  { key: "buchhaltung.aktiv", group: "Immobilienbuchhaltung", label: "Im Rechner anbieten", type: "boolean", default: true },
  { key: "buchhaltung.proEinheit", group: "Immobilienbuchhaltung", label: "Pro Einheit", type: "chf", default: 180, unit: "pro Jahr" },
  { key: "buchhaltung.minProJahr", group: "Immobilienbuchhaltung", label: "Mindesthonorar", type: "chf", default: 900, unit: "pro Jahr" },

  { key: "nebenkosten.aktiv", group: "Heiz- und Nebenkostenabrechnung", label: "Im Rechner anbieten", type: "boolean", default: true },
  { key: "nebenkosten.proEinheit", group: "Heiz- und Nebenkostenabrechnung", label: "Pro Einheit", type: "chf", default: 75, unit: "pro Jahr" },
  { key: "nebenkosten.minProJahr", group: "Heiz- und Nebenkostenabrechnung", label: "Mindesthonorar", type: "chf", default: 450, unit: "pro Jahr" },

  { key: "inkasso.aktiv", group: "Mietzinsinkasso und Mahnwesen", label: "Im Rechner anbieten", type: "boolean", default: true },
  { key: "inkasso.satz", group: "Mietzinsinkasso und Mahnwesen", label: "Honorar", type: "percent", default: 1.5, max: 20, unit: "% des Bruttomietertrags" },
  { key: "inkasso.minProJahr", group: "Mietzinsinkasso und Mahnwesen", label: "Mindesthonorar", type: "chf", default: 600, unit: "pro Jahr" },

  { key: "abrechnung.aktiv", group: "Jahres- und Eigentümerabrechnung", label: "Im Rechner anbieten", type: "boolean", default: true },
  { key: "abrechnung.proEinheit", group: "Jahres- und Eigentümerabrechnung", label: "Pro Einheit", type: "chf", default: 120, unit: "pro Jahr" },
  { key: "abrechnung.minProJahr", group: "Jahres- und Eigentümerabrechnung", label: "Mindesthonorar", type: "chf", default: 600, unit: "pro Jahr" },

  { key: "uebergaben.aktiv", group: "Wohnungsabnahmen und -übergaben", label: "Im Rechner anbieten", type: "boolean", default: true },
  { key: "uebergaben.preis", group: "Wohnungsabnahmen und -übergaben", label: "Pro Abnahme oder Übergabe", type: "chf", default: 220 },

  { key: "verkauf.aktiv", group: "Immobilienverkauf", label: "Im Rechner anbieten", type: "boolean", default: true },
  { key: "verkauf.satz", group: "Immobilienverkauf", label: "Verkaufsprovision", type: "percent", default: 2.5, max: 10, unit: "% des Verkaufspreises" },
  { key: "verkauf.min", group: "Immobilienverkauf", label: "Mindestprovision", type: "chf", default: 9000 },

  { key: "sanierung.aktiv", group: "Sanierung und Baubegleitung", label: "Im Rechner anbieten", type: "boolean", default: true },
  { key: "sanierung.satz", group: "Sanierung und Baubegleitung", label: "Honorar", type: "percent", default: 7, max: 30, unit: "% der Bausumme" },
  { key: "sanierung.min", group: "Sanierung und Baubegleitung", label: "Mindesthonorar", type: "chf", default: 2500 },
] as const satisfies readonly TariffField[];

export type ImmobilienTariffs = TariffValues<typeof IMMOBILIEN_FIELDS>;
export const IMMOBILIEN_DEFAULTS: ImmobilienTariffs = defaultsOf(IMMOBILIEN_FIELDS);

export const propertyTypes = [
  { value: "wohnung", label: "Eigentumswohnung", unitLabel: "Wohnungen" },
  { value: "efh", label: "Einfamilienhaus", unitLabel: "Häuser" },
  { value: "mfh", label: "Mehrfamilienhaus", unitLabel: "Wohnungen" },
  { value: "stwe", label: "Stockwerkeigentum", unitLabel: "Stockwerkeinheiten" },
  { value: "gewerbe", label: "Gewerbeliegenschaft", unitLabel: "Mieteinheiten" },
  { value: "gemischt", label: "Wohn- und Geschäftshaus", unitLabel: "Mieteinheiten" },
] as const;

export type PropertyType = (typeof propertyTypes)[number]["value"];

export const propertyServices = [
  { value: "verwaltung", label: "Verwaltung Mietliegenschaft", description: "Vermietung, Mietzinsinkasso, Mahnwesen, Mietverträge, Unterhalt, Buchhaltung.", group: "laufend" },
  { value: "stwe", label: "Verwaltung Stockwerkeigentum", description: "Versammlungen, Erneuerungsfonds, Unterhalt, Jahresrechnung.", group: "laufend" },
  { value: "buchhaltung", label: "Immobilienbuchhaltung", description: "Liegenschaftsbuchhaltung ohne Verwaltungsmandat.", group: "laufend" },
  { value: "nebenkosten", label: "Heiz- und Nebenkostenabrechnung", description: "Jährliche Abrechnung pro Mieteinheit.", group: "laufend" },
  { value: "inkasso", label: "Mietzinsinkasso und Mahnwesen", description: "Überwachung der Zahlungen, Mahnungen, Betreibungen.", group: "laufend" },
  { value: "abrechnung", label: "Jahres- und Eigentümerabrechnung", description: "Übersichtliche Abrechnung für Eigentümerinnen und Eigentümer.", group: "laufend" },
  { value: "uebergaben", label: "Wohnungsabnahmen und -übergaben", description: "Protokoll, Schlüssel, Mängel und Kautionen.", group: "laufend" },
  { value: "verkauf", label: "Immobilienverkauf", description: "Bewertung, Vermarktung, Besichtigungen, Verhandlung bis zur Beurkundung.", group: "einmalig" },
  { value: "sanierung", label: "Sanierung und Baubegleitung", description: "Planung, Offerten, Handwerkerkoordination, Kostenkontrolle.", group: "einmalig" },
] as const;

export type PropertyService = (typeof propertyServices)[number]["value"];

/** Services that are part of another selected one (shown as "inklusive"). */
const includedIn: Partial<Record<PropertyService, PropertyService[]>> = {
  inkasso: ["verwaltung"],
  abrechnung: ["verwaltung", "stwe"],
  uebergaben: ["verwaltung"],
  buchhaltung: ["verwaltung", "stwe"],
};

/** The service a given service is included in, if that one is selected too. */
export function includingService(service: PropertyService, selected: readonly PropertyService[]): PropertyService | null {
  return includedIn[service]?.find((s) => selected.includes(s)) ?? null;
}

const serviceValues = propertyServices.map((s) => s.value) as [PropertyService, ...PropertyService[]];
const blankToUndefined = (v: unknown) => (typeof v === "string" && v.trim() === "" ? undefined : v);
const amount = (max: number) => z.coerce.number({ error: "Bitte geben Sie einen Betrag an." }).min(0, "Der Betrag darf nicht negativ sein.").max(max);

export const immobilienInputSchema = z.object({
  objektart: z.enum(propertyTypes.map((p) => p.value) as [PropertyType, ...PropertyType[]], { error: "Bitte wählen Sie die Art der Immobilie." }),
  standort: z.preprocess(blankToUndefined, z.string().trim().max(80, "Der Standort ist zu lang.").optional()),
  einheiten: z.coerce.number({ error: "Bitte geben Sie die Anzahl Einheiten an." }).int().min(1, "Mindestens eine Einheit.").max(2000),
  mietertrag: amount(100_000_000).default(0),
  mietertragPeriode: z.enum(["monat", "jahr"]).default("monat"),
  leistungen: z
    .array(z.enum(serviceValues, { error: "Unbekannte Leistung." }))
    .min(1, "Bitte wählen Sie mindestens eine Leistung.")
    .max(serviceValues.length)
    .transform((list) => [...new Set(list)]),
  uebergabenProJahr: z.coerce.number().int().min(0).max(1000).default(2),
  verkaufspreis: amount(500_000_000).default(0),
  bausumme: amount(500_000_000).default(0),
});

export type ImmobilienInput = z.output<typeof immobilienInputSchema>;

export const IMMOBILIEN_START: ImmobilienInput = {
  objektart: "mfh",
  einheiten: 6,
  mietertrag: 9600,
  mietertragPeriode: "monat",
  leistungen: ["verwaltung", "nebenkosten"],
  uebergabenProJahr: 2,
  verkaufspreis: 0,
  bausumme: 0,
};

/** Services offered by the current tariffs, without the management type that does not fit the property. */
export function activePropertyServices(t: ImmobilienTariffs, type: PropertyType) {
  return propertyServices.filter((s) => {
    if (!t[`${s.value}.aktiv`]) return false;
    if (type === "stwe") return s.value !== "verwaltung" && s.value !== "inkasso";
    return s.value !== "stwe";
  });
}

const chf = (n: number) => `CHF ${new Intl.NumberFormat("de-CH", { maximumFractionDigits: 0 }).format(n)}`;
const pct = (n: number) => `${new Intl.NumberFormat("de-CH", { maximumFractionDigits: 2 }).format(n)} %`;

export function yearlyRent(input: Pick<ImmobilienInput, "mietertrag" | "mietertragPeriode">): number {
  return input.mietertragPeriode === "monat" ? input.mietertrag * 12 : input.mietertrag;
}

export function calculateImmobilien(input: ImmobilienInput, t: ImmobilienTariffs): Estimate {
  const step = t["allgemein.rundung"];
  const units = input.einheiten;
  const rent = yearlyRent(input);
  const offered = new Set(activePropertyServices(t, input.objektart).map((s) => s.value));
  const selected = propertyServices.filter((s) => input.leistungen.includes(s.value) && offered.has(s.value)).map((s) => s.value);
  const unitWord = (n: number) => plural(n, "Einheit", "Einheiten");
  const lines: EstimateLine[] = [];
  const warnings: string[] = [];
  const push = (line: Omit<EstimateLine, "amount"> & { amount: number }) => lines.push({ ...line, amount: line.included ? 0 : roundTo(line.amount, step) });

  for (const service of selected) {
    const label = propertyServices.find((s) => s.value === service)?.label ?? service;
    const including = includingService(service, selected);
    if (including) {
      const parent = propertyServices.find((s) => s.value === including)?.label ?? including;
      push({ key: service, label, amount: 0, period: "jahr", included: true, detail: `in «${parent}» enthalten` });
      continue;
    }
    switch (service) {
      case "verwaltung": {
        const type = input.objektart === "stwe" ? "mfh" : input.objektart;
        const rate = t[`verwaltung.satz.${type}`];
        const byRate = (rent * rate) / 100;
        const byUnit = t["verwaltung.minProEinheit"] * units * 12;
        const perYear = Math.max(byRate, byUnit, t["verwaltung.minProJahr"]);
        if (rent <= 0) warnings.push("Geben Sie die Mieteinnahmen an, damit wir das Verwaltungshonorar berechnen können. Bis dahin zeigen wir das Mindesthonorar.");
        const detail = perYear === byRate ? `${pct(rate)} von ${chf(rent)} Mietertrag pro Jahr` : `Mindesthonorar für ${unitWord(units)}`;
        push({ key: service, label, amount: perYear / 12, period: "monat", detail });
        break;
      }
      case "stwe": {
        const perYear = Math.max(t["stwe.proEinheit"] * units, t["stwe.minProJahr"]);
        const detail = perYear > t["stwe.proEinheit"] * units ? `Mindesthonorar der Gemeinschaft` : `${unitWord(units)} à ${chf(t["stwe.proEinheit"])}`;
        push({ key: service, label, amount: perYear, period: "jahr", detail });
        break;
      }
      case "buchhaltung":
      case "nebenkosten":
      case "abrechnung": {
        const each = t[`${service}.proEinheit`];
        const perYear = Math.max(each * units, t[`${service}.minProJahr`]);
        push({ key: service, label, amount: perYear, period: "jahr", detail: perYear > each * units ? "Mindesthonorar" : `${unitWord(units)} à ${chf(each)}` });
        break;
      }
      case "inkasso": {
        const perYear = Math.max((rent * t["inkasso.satz"]) / 100, t["inkasso.minProJahr"]);
        if (rent <= 0) warnings.push("Für das Mietzinsinkasso brauchen wir die Mieteinnahmen. Bis dahin zeigen wir das Mindesthonorar.");
        push({ key: service, label, amount: perYear, period: "jahr", detail: rent > 0 ? `${pct(t["inkasso.satz"])} des Mietertrags` : "Mindesthonorar" });
        break;
      }
      case "uebergaben": {
        const count = input.uebergabenProJahr;
        if (count === 0) {
          push({ key: service, label, amount: 0, period: "jahr", included: true, detail: `${chf(t["uebergaben.preis"])} pro Abnahme oder Übergabe, nach Bedarf` });
        } else {
          push({ key: service, label, amount: count * t["uebergaben.preis"], period: "jahr", detail: `${plural(count, "Abnahme oder Übergabe", "Abnahmen oder Übergaben")} à ${chf(t["uebergaben.preis"])}` });
        }
        break;
      }
      case "verkauf": {
        if (input.verkaufspreis <= 0) warnings.push("Geben Sie den geschätzten Verkaufspreis an, damit wir die Provision berechnen können.");
        const fee = Math.max((input.verkaufspreis * t["verkauf.satz"]) / 100, t["verkauf.min"]);
        const detail = input.verkaufspreis > 0 && fee > t["verkauf.min"] ? `${pct(t["verkauf.satz"])} von ${chf(input.verkaufspreis)}` : `Mindestprovision`;
        push({ key: service, label: "Verkaufsprovision", amount: fee, period: "einmalig", detail });
        break;
      }
      case "sanierung": {
        if (input.bausumme <= 0) warnings.push("Geben Sie die geschätzte Bausumme an, damit wir das Honorar für die Baubegleitung berechnen können.");
        const fee = Math.max((input.bausumme * t["sanierung.satz"]) / 100, t["sanierung.min"]);
        const detail = input.bausumme > 0 && fee > t["sanierung.min"] ? `${pct(t["sanierung.satz"])} von ${chf(input.bausumme)} Bausumme` : "Mindesthonorar";
        push({ key: service, label: "Sanierung und Baubegleitung", amount: fee, period: "einmalig", detail });
        break;
      }
    }
  }

  const totals = totalsOf(lines);
  // The main figure: everything that recurs, per year (monthly items times twelve plus yearly items).
  const recurringPerYear = totals.monat * 12 + totals.jahr;
  return { lines, totals, range: rangeOf(recurringPerYear, t["allgemein.bandbreite"]), warnings };
}

/** Recurring costs per year: monthly items times twelve plus yearly items. */
export function recurringPerYear(estimate: Estimate): number {
  return estimate.totals.monat * 12 + estimate.totals.jahr;
}
