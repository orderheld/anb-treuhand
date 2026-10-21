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
 * Firmengründungsrechner: one-off price of a company formation, split into ANB's fee and the
 * estimated external costs (notary, commercial register, bank, stamp duty).
 *
 * Fixed by law and therefore not editable: minimum capital (GmbH CHF 20'000, AG CHF 100'000)
 * and the rule that the stamp duty only applies above its exemption limit. Rates and amounts are
 * tariffs. Handelsregister fees follow the federal fee ordinance (GebV-HReg, since 2021: GmbH and
 * AG CHF 420, Einzelunternehmen CHF 80); notary fees are cantonal, the defaults assume Kanton Bern.
 */

export const GRUENDUNG_FIELDS = [
  { key: "allgemein.rundung", group: "Allgemein", label: "Beträge runden auf", type: "chf", default: 10, min: 1, max: 100, decimals: 0 },
  { key: "allgemein.bandbreite", group: "Allgemein", label: "Bandbreite um das Total", type: "percent", default: 0, max: 50, decimals: 0, unit: "± %", help: "0 blendet die Bandbreite aus." },
  {
    key: "allgemein.hinweis",
    group: "Allgemein",
    label: "Hinweis unter dem Resultat",
    type: "text",
    maxLength: 400,
    default: "Unverbindlicher Richtpreis. Externe Kosten sind Schätzungen; sie werden direkt von den Stellen oder ohne Aufschlag verrechnet.",
  },

  { key: "honorar.grund.einzelunternehmen", group: "Honorar ANB", label: "Gründungspaket Einzelunternehmen", type: "chf", default: 390, unit: "einmalig" },
  { key: "honorar.grund.gmbh", group: "Honorar ANB", label: "Gründungspaket GmbH", type: "chf", default: 890, unit: "einmalig" },
  { key: "honorar.grund.ag", group: "Honorar ANB", label: "Gründungspaket AG", type: "chf", default: 1190, unit: "einmalig" },
  { key: "honorar.proGesellschafter", group: "Honorar ANB", label: "Zuschlag pro weitere Gründerin / weiteren Gründer", type: "chf", default: 60, unit: "pro Person" },

  { key: "zusatz.statuten.aktiv", group: "Zusatzleistungen", label: "Individuelle Statuten anbieten", type: "boolean", default: true },
  { key: "zusatz.statuten.preis", group: "Zusatzleistungen", label: "Individuelle Statuten", type: "chf", default: 280 },
  { key: "zusatz.sacheinlage.aktiv", group: "Zusatzleistungen", label: "Sacheinlage anbieten", type: "boolean", default: true },
  { key: "zusatz.sacheinlage.preis", group: "Zusatzleistungen", label: "Sacheinlage oder Sachübernahme (Gründungsbericht)", type: "chf", default: 650 },
  { key: "zusatz.mwst.aktiv", group: "Zusatzleistungen", label: "MWST-Anmeldung anbieten", type: "boolean", default: true },
  { key: "zusatz.mwst.preis", group: "Zusatzleistungen", label: "MWST-Anmeldung", type: "chf", default: 150 },
  { key: "zusatz.sozialversicherungen.aktiv", group: "Zusatzleistungen", label: "Sozialversicherungen anbieten", type: "boolean", default: true },
  { key: "zusatz.sozialversicherungen.preis", group: "Zusatzleistungen", label: "Anmeldung AHV, BVG und UVG", type: "chf", default: 160 },
  { key: "zusatz.buchhaltung.aktiv", group: "Zusatzleistungen", label: "Buchhaltung einrichten anbieten", type: "boolean", default: true },
  { key: "zusatz.buchhaltung.preis", group: "Zusatzleistungen", label: "Buchhaltung einrichten (Kontenplan, Eröffnungsbilanz, Software)", type: "chf", default: 380 },
  { key: "zusatz.bank.aktiv", group: "Zusatzleistungen", label: "Bankbegleitung anbieten", type: "boolean", default: true },
  { key: "zusatz.bank.preis", group: "Zusatzleistungen", label: "Begleitung Kapitaleinzahlungskonto", type: "chf", default: 90 },
  { key: "zusatz.businessplan.aktiv", group: "Zusatzleistungen", label: "Businessplan anbieten", type: "boolean", default: true },
  { key: "zusatz.businessplan.preis", group: "Zusatzleistungen", label: "Businessplan und Finanzplanung", type: "chf", default: 850 },

  { key: "extern.notar.gmbh", group: "Externe Kosten (Schätzung)", label: "Notariat GmbH", type: "chf", default: 1200, help: "Notariatsgebühren sind kantonal geregelt. Der Wert gilt für den Kanton Bern." },
  { key: "extern.notar.ag", group: "Externe Kosten (Schätzung)", label: "Notariat AG", type: "chf", default: 1500 },
  { key: "extern.notar.proGesellschafter", group: "Externe Kosten (Schätzung)", label: "Notariat: Zuschlag pro weitere Person", type: "chf", default: 60, unit: "pro Person" },
  { key: "extern.handelsregister.einzelunternehmen", group: "Externe Kosten (Schätzung)", label: "Handelsregister Einzelunternehmen", type: "chf", default: 80 },
  { key: "extern.handelsregister.gmbh", group: "Externe Kosten (Schätzung)", label: "Handelsregister GmbH", type: "chf", default: 420 },
  { key: "extern.handelsregister.ag", group: "Externe Kosten (Schätzung)", label: "Handelsregister AG", type: "chf", default: 420 },
  { key: "extern.bank.gmbh", group: "Externe Kosten (Schätzung)", label: "Bank: Kapitaleinzahlungskonto GmbH", type: "chf", default: 250 },
  { key: "extern.bank.ag", group: "Externe Kosten (Schätzung)", label: "Bank: Kapitaleinzahlungskonto AG", type: "chf", default: 300 },
  { key: "extern.diverses", group: "Externe Kosten (Schätzung)", label: "Beglaubigungen und Auszüge (GmbH, AG)", type: "chf", default: 60 },
  { key: "extern.pruefung", group: "Externe Kosten (Schätzung)", label: "Prüfungsbestätigung bei Sacheinlage (Revisor)", type: "chf", default: 900 },
  { key: "extern.emission.satz", group: "Externe Kosten (Schätzung)", label: "Emissionsabgabe", type: "percent", default: 1, max: 10, unit: "% des Kapitals über der Freigrenze" },
  { key: "extern.emission.freigrenze", group: "Externe Kosten (Schätzung)", label: "Freigrenze Emissionsabgabe", type: "chf", default: 1_000_000, max: 100_000_000, decimals: 0 },
] as const satisfies readonly TariffField[];

export type GruendungTariffs = TariffValues<typeof GRUENDUNG_FIELDS>;
export const GRUENDUNG_DEFAULTS: GruendungTariffs = defaultsOf(GRUENDUNG_FIELDS);

/** Minimum capital by law (OR 773 and 621). Not a tariff. */
export const MIN_CAPITAL: Record<Exclude<LegalForm, "einzelunternehmen">, number> = { gmbh: 20_000, ag: 100_000 };

export const foundingExtras = [
  { value: "statuten", label: "Individuelle Statuten", description: "Statt Musterstatuten: Regelungen nach Mass, z. B. zu Vorkaufsrechten." , forms: ["gmbh", "ag"] },
  { value: "sacheinlage", label: "Sacheinlage", description: "Fahrzeuge, Maschinen oder ein Geschäft als Kapital einbringen.", forms: ["gmbh", "ag"] },
  { value: "mwst", label: "MWST-Anmeldung", description: "Anmeldung bei der ESTV, Wahl der Abrechnungsmethode.", forms: ["einzelunternehmen", "gmbh", "ag"] },
  { value: "sozialversicherungen", label: "Sozialversicherungen", description: "Anmeldung bei AHV-Ausgleichskasse, Pensionskasse und Unfallversicherung.", forms: ["gmbh", "ag"] },
  { value: "buchhaltung", label: "Buchhaltung einrichten", description: "Kontenplan, Eröffnungsbilanz, Software und Belegablage.", forms: ["einzelunternehmen", "gmbh", "ag"] },
  { value: "bank", label: "Bankbegleitung", description: "Eröffnung des Kapitaleinzahlungskontos.", forms: ["gmbh", "ag"] },
  { value: "businessplan", label: "Businessplan", description: "Geschäftsmodell, Budget und Liquiditätsplanung für Bank und Start.", forms: ["einzelunternehmen", "gmbh", "ag"] },
] as const;

export type FoundingExtra = (typeof foundingExtras)[number]["value"];

export const cantons = [
  ["AG", "Aargau"], ["AI", "Appenzell Innerrhoden"], ["AR", "Appenzell Ausserrhoden"], ["BE", "Bern"], ["BL", "Basel-Landschaft"],
  ["BS", "Basel-Stadt"], ["FR", "Freiburg"], ["GE", "Genf"], ["GL", "Glarus"], ["GR", "Graubünden"], ["JU", "Jura"],
  ["LU", "Luzern"], ["NE", "Neuenburg"], ["NW", "Nidwalden"], ["OW", "Obwalden"], ["SG", "St. Gallen"], ["SH", "Schaffhausen"],
  ["SO", "Solothurn"], ["SZ", "Schwyz"], ["TG", "Thurgau"], ["TI", "Tessin"], ["UR", "Uri"], ["VD", "Waadt"], ["VS", "Wallis"],
  ["ZG", "Zug"], ["ZH", "Zürich"],
] as const;

export type Canton = (typeof cantons)[number][0];

const extraValues = foundingExtras.map((e) => e.value) as [FoundingExtra, ...FoundingExtra[]];
const blankToUndefined = (v: unknown) => (typeof v === "string" && v.trim() === "" ? undefined : v);

export const gruendungInputSchema = z
  .object({
    rechtsform: z.enum(legalForms.map((f) => f.value) as [LegalForm, ...LegalForm[]], { error: "Bitte wählen Sie die Rechtsform." }),
    firmenname: z.preprocess(blankToUndefined, z.string().trim().max(120, "Der Firmenname ist zu lang.").optional()),
    sitz: z.preprocess(blankToUndefined, z.string().trim().max(80, "Der Firmensitz ist zu lang.").optional()),
    kanton: z.enum(cantons.map((c) => c[0]) as [Canton, ...Canton[]]).default("BE"),
    zweck: z.preprocess(blankToUndefined, z.string().trim().max(1500, "Der Geschäftszweck ist zu lang (maximal 1500 Zeichen).").optional()),
    gesellschafter: z.coerce.number().int().min(1, "Mindestens eine Person.").max(50, "Höchstens 50 Personen.").default(1),
    kapital: z.coerce.number().int().min(0).max(1_000_000_000).default(0),
    /** Einzelunternehmen only: register in the Handelsregister (mandatory from CHF 100'000 turnover). */
    hrEintrag: z.preprocess((v) => v === true || v === "true" || v === "on", z.boolean()).default(true),
    zusatz: z
      .array(z.enum(extraValues, { error: "Unbekannte Zusatzleistung." }))
      .max(extraValues.length)
      .default([])
      .transform((list) => [...new Set(list)]),
  })
  .superRefine((v, ctx) => {
    if (v.rechtsform !== "einzelunternehmen" && v.kapital < MIN_CAPITAL[v.rechtsform]) {
      const min = new Intl.NumberFormat("de-CH").format(MIN_CAPITAL[v.rechtsform]);
      ctx.addIssue({ code: "custom", path: ["kapital"], message: `Das Mindestkapital einer ${legalFormLabel(v.rechtsform)} beträgt CHF ${min}.` });
    }
  });

export type GruendungInput = z.output<typeof gruendungInputSchema>;

export const GRUENDUNG_START: GruendungInput = {
  rechtsform: "gmbh",
  kanton: "BE",
  sitz: "Langenthal",
  gesellschafter: 1,
  kapital: 20_000,
  hrEintrag: true,
  zusatz: ["sozialversicherungen", "buchhaltung"],
};

/** Extras offered by the current tariffs for a legal form. */
export function activeFoundingExtras(t: GruendungTariffs, form: LegalForm) {
  return foundingExtras.filter((e) => t[`zusatz.${e.value}.aktiv`] && (e.forms as readonly LegalForm[]).includes(form));
}

const extraLabel: Record<FoundingExtra, string> = {
  statuten: "Individuelle Statuten",
  sacheinlage: "Sacheinlage oder Sachübernahme",
  mwst: "MWST-Anmeldung",
  sozialversicherungen: "Anmeldung Sozialversicherungen",
  buchhaltung: "Buchhaltung einrichten",
  bank: "Begleitung Kapitaleinzahlungskonto",
  businessplan: "Businessplan und Finanzplanung",
};

const packageDetail: Record<LegalForm, string> = {
  einzelunternehmen: "Beratung, Anmeldung Handelsregister und AHV als Selbstständigerwerbende",
  gmbh: "Beratung, Firmenzweck, Musterstatuten, Koordination mit Notariat und Handelsregister",
  ag: "Beratung, Firmenzweck, Musterstatuten, Koordination mit Notariat und Handelsregister",
};

export function calculateGruendung(input: GruendungInput, t: GruendungTariffs): Estimate {
  const step = t["allgemein.rundung"];
  const rf = input.rechtsform;
  const corporate = rf !== "einzelunternehmen";
  const people = corporate ? Math.max(1, input.gesellschafter) : 1;
  const lines: EstimateLine[] = [];
  const warnings: string[] = [];
  const fee = (key: string, label: string, amount: number, detail?: string) =>
    lines.push({ key, label, amount: roundTo(amount, step), period: "einmalig", detail });
  const external = (key: string, label: string, amount: number, detail?: string) =>
    lines.push({ key, label, amount: roundTo(amount, step), period: "einmalig", detail, external: true });

  fee("paket", `Gründungspaket ${legalFormLabel(rf)}`, t[`honorar.grund.${rf}`], packageDetail[rf]);
  if (people > 1) {
    fee("gesellschafter", "Weitere Gründerinnen und Gründer", (people - 1) * t["honorar.proGesellschafter"], `${plural(people - 1, "weitere Person", "weitere Personen")}`);
  }
  const offered = new Set(activeFoundingExtras(t, rf).map((e) => e.value));
  for (const extra of foundingExtras) {
    if (!input.zusatz.includes(extra.value) || !offered.has(extra.value)) continue;
    fee(extra.value, extraLabel[extra.value], t[`zusatz.${extra.value}.preis`]);
  }

  if (corporate) {
    const notary = t[`extern.notar.${rf}`] + (people - 1) * t["extern.notar.proGesellschafter"];
    external("notar", "Notariat", notary, input.kanton === "BE" ? "Öffentliche Beurkundung der Gründung" : "Schätzung nach Berner Tarif");
    if (input.kanton !== "BE") warnings.push("Notariatsgebühren sind kantonal geregelt. Unsere Schätzung beruht auf dem Kanton Bern.");
  }
  if (corporate || input.hrEintrag) {
    external("handelsregister", "Handelsregister", t[`extern.handelsregister.${rf}`], "Gebühr für die Neueintragung");
  }
  if (corporate) {
    external("bank", "Bank", t[`extern.bank.${rf}`], "Kapitaleinzahlungskonto und Bestätigung");
    external("diverses", "Beglaubigungen und Auszüge", t["extern.diverses"]);
    if (input.zusatz.includes("sacheinlage") && offered.has("sacheinlage")) {
      external("pruefung", "Prüfungsbestätigung", t["extern.pruefung"], "Zugelassene Revisorin oder zugelassener Revisor, bei Sacheinlage gesetzlich vorgeschrieben");
    }
    const taxable = input.kapital - t["extern.emission.freigrenze"];
    if (taxable > 0) {
      external("emission", "Emissionsabgabe", (taxable * t["extern.emission.satz"]) / 100, `${t["extern.emission.satz"]} % auf dem Kapital über der Freigrenze`);
    }
  } else if (!input.hrEintrag) {
    warnings.push("Ab CHF 100'000 Jahresumsatz ist der Eintrag ins Handelsregister Pflicht.");
  }

  const totals = totalsOf(lines);
  return { lines, totals, range: rangeOf(totals.einmalig, t["allgemein.bandbreite"]), warnings };
}

/** Sum of ANB's fee and of the external costs, for the two subtotals. */
export function foundingSubtotals(estimate: Estimate): { fee: number; external: number } {
  let fee = 0;
  let external = 0;
  for (const line of estimate.lines) {
    if (line.external) external += line.amount;
    else fee += line.amount;
  }
  return { fee, external };
}
