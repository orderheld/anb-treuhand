import { describe, expect, it } from "vitest";
import {
  GRUENDUNG_DEFAULTS,
  GRUENDUNG_FIELDS,
  GRUENDUNG_START,
  calculateGruendung,
  foundingSubtotals,
  gruendungInputSchema,
} from "./gruendung";
import {
  IMMOBILIEN_DEFAULTS,
  IMMOBILIEN_FIELDS,
  IMMOBILIEN_START,
  calculateImmobilien,
  immobilienInputSchema,
  recurringPerYear,
} from "./immobilien";
import { checkFieldValue, parseNumber, parseTariffForm, parseTariffs, rangeOf, roundTo, type Estimate } from "./shared";
import { TREUHAND_DEFAULTS, TREUHAND_FIELDS, TREUHAND_START, bookingSteps, calculateTreuhand, treuhandInputSchema } from "./treuhand";

/** The breakdown must always add up to the totals shown. */
function expectConsistent(estimate: Estimate) {
  const sums = { monat: 0, jahr: 0, einmalig: 0 };
  for (const line of estimate.lines) if (!line.included) sums[line.period] += line.amount;
  expect(estimate.totals.monat).toBe(sums.monat);
  expect(estimate.totals.einmalig).toBe(sums.einmalig);
}

describe("shared helpers", () => {
  it("rounds to steps and never rounds a positive amount down to zero", () => {
    expect(roundTo(142.4, 5)).toBe(140);
    expect(roundTo(142.5, 5)).toBe(145);
    expect(roundTo(1.2, 5)).toBe(5);
    expect(roundTo(0, 5)).toBe(0);
    expect(roundTo(-3, 5)).toBe(0);
  });

  it("reads Swiss number formats", () => {
    expect(parseNumber("1'250.50")).toBe(1250.5);
    expect(parseNumber("1’250,50")).toBe(1250.5);
    expect(parseNumber("4.5 %")).toBe(4.5);
    expect(parseNumber("CHF 90")).toBe(90);
    expect(parseNumber("abc")).toBeNaN();
    expect(parseNumber("")).toBeNaN();
  });

  it("builds a range rounded outwards", () => {
    expect(rangeOf(480, 10)).toEqual({ from: 430, to: 530 });
    expect(rangeOf(480, 0)).toBeNull();
    expect(rangeOf(0, 10)).toBeNull();
  });

  it("checks field limits and decimals", () => {
    const count = TREUHAND_FIELDS.find((f) => f.key === "buchhaltung.inklusive")!;
    expect(checkFieldValue(count, "12.5")).toEqual({ ok: false, error: "Bitte eine ganze Zahl eingeben." });
    expect(checkFieldValue(count, "-1")).toMatchObject({ ok: false });
    expect(checkFieldValue(count, "25")).toEqual({ ok: true, value: 25 });
  });
});

describe("tariff storage", () => {
  it("falls back to defaults for missing, invalid and unknown values", () => {
    const parsed = parseTariffs(TREUHAND_FIELDS, {
      "buchhaltung.grund.gmbh": 155,
      "buchhaltung.preis1": "abc",
      "mwst.aktiv": "yes",
      "unbekannt.feld": 3,
    });
    expect(parsed["buchhaltung.grund.gmbh"]).toBe(155);
    expect(parsed["buchhaltung.preis1"]).toBe(TREUHAND_DEFAULTS["buchhaltung.preis1"]);
    expect(parsed["mwst.aktiv"]).toBe(true);
    expect("unbekannt.feld" in parsed).toBe(false);
    expect(parseTariffs(TREUHAND_FIELDS, null)).toEqual(TREUHAND_DEFAULTS);
  });

  it("validates the admin form and treats missing checkboxes as off", () => {
    const form: Record<string, string> = {};
    for (const f of GRUENDUNG_FIELDS) if (f.type !== "boolean") form[f.key] = String(f.default);
    const ok = parseTariffForm(GRUENDUNG_FIELDS, form);
    expect(ok.ok).toBe(true);
    if (ok.ok) expect(ok.values["zusatz.statuten.aktiv"]).toBe(false);

    const bad = parseTariffForm(GRUENDUNG_FIELDS, { ...form, "extern.notar.gmbh": "viel" });
    expect(bad.ok).toBe(false);
    if (!bad.ok) expect(bad.errors["extern.notar.gmbh"]).toBe("Bitte eine Zahl eingeben.");
  });

  it("has unique keys and defaults within their own limits", () => {
    for (const fields of [TREUHAND_FIELDS, GRUENDUNG_FIELDS, IMMOBILIEN_FIELDS]) {
      const keys = fields.map((f) => f.key);
      expect(new Set(keys).size).toBe(keys.length);
      for (const field of fields) expect(checkFieldValue(field, field.default).ok, field.key).toBe(true);
    }
  });
});

describe("Treuhand-Preisrechner", () => {
  it("splits bookings into the volume steps", () => {
    // 20 included, 21–150 at step 1, 151–400 at step 2, from 401 at step 3.
    expect(bookingSteps(10, TREUHAND_DEFAULTS).map((s) => s.count)).toEqual([0, 0, 0]);
    expect(bookingSteps(60, TREUHAND_DEFAULTS).map((s) => s.count)).toEqual([40, 0, 0]);
    expect(bookingSteps(150, TREUHAND_DEFAULTS).map((s) => s.count)).toEqual([130, 0, 0]);
    expect(bookingSteps(151, TREUHAND_DEFAULTS).map((s) => s.count)).toEqual([130, 1, 0]);
    expect(bookingSteps(500, TREUHAND_DEFAULTS).map((s) => s.count)).toEqual([130, 250, 100]);
  });

  it("computes the start example", () => {
    const e = calculateTreuhand(TREUHAND_START, TREUHAND_DEFAULTS);
    // Buchhaltung 140 + 40 × 2.40 = 236 → 235; MWST (4 × 190 + 120) / 12 = 73.3 → 75;
    // Lohn 40 + 2 × 35 + (2 × 30 + 180) / 12 = 130 → 130; Abschluss (1450 + 2 × 60) / 12 = 130.8 → 130;
    // Steuern 650 / 12 = 54.2 → 55.
    expect(e.lines.map((l) => [l.key, l.amount])).toEqual([
      ["buchhaltung", 235],
      ["mwst", 75],
      ["lohn", 130],
      ["abschluss", 130],
      ["steuern", 55],
    ]);
    expect(e.totals.monat).toBe(625);
    expect(e.totals.jahr).toBe(7500);
    expect(e.range).toEqual({ from: 560, to: 690 });
    expectConsistent(e);
  });

  it("tops up to the minimum fee and shows one-off work apart", () => {
    const e = calculateTreuhand(
      { rechtsform: "einzelunternehmen", buchungen: 5, mitarbeitende: 0, leistungen: ["steuern", "digital"], mwstMethode: "effektiv" },
      TREUHAND_DEFAULTS,
    );
    expect(e.lines.find((l) => l.key === "mindest")?.amount).toBe(80);
    expect(e.totals.monat).toBe(120);
    expect(e.totals.einmalig).toBe(350);
    expectConsistent(e);
  });

  it("ignores services switched off in the tariffs and counts at least one person for payroll", () => {
    const tariffs = { ...TREUHAND_DEFAULTS, "beratung.aktiv": false };
    const e = calculateTreuhand({ ...TREUHAND_START, mitarbeitende: 0, leistungen: ["lohn", "beratung"] }, tariffs);
    // Payroll for one person: 40 + 35 + (30 + 180) / 12 = 92.5 → 95, topped up to the minimum of 120.
    expect(e.lines.map((l) => [l.key, l.amount])).toEqual([
      ["lohn", 95],
      ["mindest", 25],
    ]);
    expect(e.warnings).toHaveLength(1);
  });

  it("validates the input", () => {
    expect(treuhandInputSchema.safeParse({ ...TREUHAND_START, leistungen: [] }).success).toBe(false);
    expect(treuhandInputSchema.safeParse({ ...TREUHAND_START, buchungen: "80" }).success).toBe(true);
    expect(treuhandInputSchema.safeParse({ ...TREUHAND_START, leistungen: ["hacken"] }).success).toBe(false);
  });
});

describe("Firmengründungsrechner", () => {
  it("splits fee and external costs for a GmbH", () => {
    const e = calculateGruendung(GRUENDUNG_START, GRUENDUNG_DEFAULTS);
    expect(foundingSubtotals(e)).toEqual({ fee: 890 + 160 + 380, external: 1200 + 420 + 250 + 60 });
    expect(e.totals.einmalig).toBe(3360);
    expect(e.warnings).toEqual([]);
    expectConsistent(e);
  });

  it("adds people, the audit for contributions in kind and the stamp duty above the exemption", () => {
    const e = calculateGruendung(
      { ...GRUENDUNG_START, rechtsform: "ag", gesellschafter: 3, kapital: 1_500_000, zusatz: ["sacheinlage"], kanton: "ZH" },
      GRUENDUNG_DEFAULTS,
    );
    const amount = (key: string) => e.lines.find((l) => l.key === key)?.amount;
    expect(amount("gesellschafter")).toBe(120);
    expect(amount("notar")).toBe(1500 + 120);
    expect(amount("pruefung")).toBe(900);
    expect(amount("emission")).toBe(5000);
    expect(e.warnings).toHaveLength(1);
  });

  it("has no notary or bank for a sole proprietorship and respects the register choice", () => {
    const e = calculateGruendung({ ...GRUENDUNG_START, rechtsform: "einzelunternehmen", zusatz: ["sozialversicherungen", "mwst"] }, GRUENDUNG_DEFAULTS);
    expect(e.lines.map((l) => l.key)).toEqual(["paket", "mwst", "handelsregister"]);
    const without = calculateGruendung({ ...GRUENDUNG_START, rechtsform: "einzelunternehmen", hrEintrag: false, zusatz: [] }, GRUENDUNG_DEFAULTS);
    expect(without.lines.map((l) => l.key)).toEqual(["paket"]);
    expect(without.warnings).toHaveLength(1);
  });

  it("enforces the minimum capital", () => {
    expect(gruendungInputSchema.safeParse({ ...GRUENDUNG_START, kapital: 10_000 }).success).toBe(false);
    expect(gruendungInputSchema.safeParse({ ...GRUENDUNG_START, rechtsform: "ag", kapital: 50_000 }).success).toBe(false);
    expect(gruendungInputSchema.safeParse({ ...GRUENDUNG_START, rechtsform: "einzelunternehmen", kapital: 0 }).success).toBe(true);
  });
});

describe("Immobilien-Preisrechner", () => {
  it("computes management by rate with included services", () => {
    const e = calculateImmobilien({ ...IMMOBILIEN_START, leistungen: ["verwaltung", "nebenkosten", "inkasso", "buchhaltung"] }, IMMOBILIEN_DEFAULTS);
    // 9'600 × 12 = 115'200 × 4.5 % = 5'184 per year → 432 per month.
    expect(e.lines.find((l) => l.key === "verwaltung")).toMatchObject({ amount: 430, period: "monat" });
    expect(e.lines.find((l) => l.key === "nebenkosten")).toMatchObject({ amount: 450, period: "jahr" });
    expect(e.lines.find((l) => l.key === "inkasso")).toMatchObject({ included: true, amount: 0 });
    expect(e.lines.find((l) => l.key === "buchhaltung")).toMatchObject({ included: true, amount: 0 });
    expect(recurringPerYear(e)).toBe(430 * 12 + 450);
    expectConsistent(e);
  });

  it("applies minimums and warns about missing rent, sale price and construction sum", () => {
    const e = calculateImmobilien(
      { ...IMMOBILIEN_START, objektart: "wohnung", einheiten: 1, mietertrag: 0, leistungen: ["verwaltung", "verkauf", "sanierung"] },
      IMMOBILIEN_DEFAULTS,
    );
    expect(e.lines.find((l) => l.key === "verwaltung")?.amount).toBe(200);
    expect(e.lines.find((l) => l.key === "verkauf")?.amount).toBe(9000);
    expect(e.lines.find((l) => l.key === "sanierung")?.amount).toBe(2500);
    expect(e.warnings).toHaveLength(3);
  });

  it("prices condominium management per unit and sale by percentage", () => {
    const e = calculateImmobilien(
      { ...IMMOBILIEN_START, objektart: "stwe", einheiten: 12, leistungen: ["stwe", "verwaltung", "abrechnung", "verkauf"], verkaufspreis: 950_000 },
      IMMOBILIEN_DEFAULTS,
    );
    expect(e.lines.map((l) => l.key)).toEqual(["stwe", "abrechnung", "verkauf"]);
    expect(e.lines[0]).toMatchObject({ amount: 5040, period: "jahr" });
    expect(e.lines[1]).toMatchObject({ included: true });
    expect(e.lines[2]).toMatchObject({ amount: 23750, period: "einmalig" });
  });

  it("annualises yearly rent input", () => {
    const monthly = calculateImmobilien({ ...IMMOBILIEN_START, mietertrag: 9600, mietertragPeriode: "monat" }, IMMOBILIEN_DEFAULTS);
    const yearly = calculateImmobilien({ ...IMMOBILIEN_START, mietertrag: 115_200, mietertragPeriode: "jahr" }, IMMOBILIEN_DEFAULTS);
    expect(yearly.totals).toEqual(monthly.totals);
    expect(immobilienInputSchema.safeParse({ ...IMMOBILIEN_START, einheiten: 0 }).success).toBe(false);
  });
});
