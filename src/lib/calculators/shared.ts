/**
 * Building blocks shared by the three price calculators (Treuhand, Firmengründung, Immobilien).
 *
 * Every calculator is defined by a list of tariff fields. The list is the single source of truth:
 * the defaults, the tolerant parser for stored values, the admin form and its validation are all
 * derived from it, so the calculator, the admin area and the database cannot disagree.
 * The calculation functions are pure and run in the browser (live result) and on the server (the
 * offer request is always recomputed there with the current tariffs).
 */

export type TariffFieldType = "chf" | "percent" | "count" | "boolean" | "text";

export interface TariffField {
  /** Stable key in the stored JSON, e.g. "buchhaltung.grund.gmbh". Never rename a shipped key. */
  key: string;
  label: string;
  type: TariffFieldType;
  /** Heading in the admin form. Fields with the same group are shown together. */
  group: string;
  default: number | boolean | string;
  /** Unit shown next to the input, e.g. "pro Monat". */
  unit?: string;
  help?: string;
  min?: number;
  max?: number;
  /** Decimal places accepted in the admin form (0 = whole numbers). */
  decimals?: number;
  /** Text fields: maximum length. */
  maxLength?: number;
}

type ValueOf<F extends TariffField> = F["type"] extends "boolean" ? boolean : F["type"] extends "text" ? string : number;

/** The typed tariff object of a calculator: one property per field key. */
export type TariffValues<Fs extends readonly TariffField[]> = { [F in Fs[number] as F["key"]]: ValueOf<F> };

export function defaultsOf<Fs extends readonly TariffField[]>(fields: Fs): TariffValues<Fs> {
  return Object.fromEntries(fields.map((f) => [f.key, f.default])) as TariffValues<Fs>;
}

/** Number limits of a field, with sensible defaults per type. */
export function limitsOf(field: TariffField): { min: number; max: number; decimals: number } {
  const decimals = field.decimals ?? (field.type === "count" ? 0 : 2);
  const max = field.max ?? (field.type === "percent" ? 100 : field.type === "count" ? 100_000 : 1_000_000);
  return { min: field.min ?? 0, max, decimals };
}

/** Accepts 1'250.50, 1’250,50 and "12 %"; returns NaN for anything else. */
export function parseNumber(value: unknown): number {
  if (typeof value === "number") return Number.isFinite(value) ? value : Number.NaN;
  if (typeof value !== "string") return Number.NaN;
  const clean = value.replace(/['’\s%]/g, "").replace(/^CHF/i, "").replace(",", ".");
  if (clean === "" || !/^-?\d*\.?\d+$/.test(clean)) return Number.NaN;
  return Number(clean);
}

/** Checks one value against its field. Returns the normalised value or an error message. */
export function checkFieldValue(field: TariffField, raw: unknown): { ok: true; value: number | boolean | string } | { ok: false; error: string } {
  if (field.type === "boolean") {
    if (typeof raw === "boolean") return { ok: true, value: raw };
    return { ok: true, value: raw === "on" || raw === "true" };
  }
  if (field.type === "text") {
    const text = typeof raw === "string" ? raw.trim() : "";
    const max = field.maxLength ?? 400;
    if (text.length > max) return { ok: false, error: `Höchstens ${max} Zeichen.` };
    return { ok: true, value: text };
  }
  const { min, max, decimals } = limitsOf(field);
  const n = parseNumber(raw);
  if (Number.isNaN(n)) return { ok: false, error: "Bitte eine Zahl eingeben." };
  if (n < min || n > max) return { ok: false, error: `Bitte eine Zahl zwischen ${min} und ${max} eingeben.` };
  const factor = 10 ** decimals;
  if (Math.abs(Math.round(n * factor) - n * factor) > 1e-6) {
    return { ok: false, error: decimals === 0 ? "Bitte eine ganze Zahl eingeben." : `Höchstens ${decimals} Nachkommastellen.` };
  }
  return { ok: true, value: Math.round(n * factor) / factor };
}

/**
 * Reads a stored tariff object. Every field that is missing, outdated or invalid takes its
 * default, so an older or partial value never breaks a calculator.
 */
export function parseTariffs<Fs extends readonly TariffField[]>(fields: Fs, stored: unknown): TariffValues<Fs> {
  const source = stored && typeof stored === "object" && !Array.isArray(stored) ? (stored as Record<string, unknown>) : {};
  const out: Record<string, unknown> = {};
  for (const field of fields) {
    const raw = source[field.key];
    if (raw === undefined || raw === null) {
      out[field.key] = field.default;
      continue;
    }
    if (field.type === "boolean") {
      out[field.key] = typeof raw === "boolean" ? raw : field.default;
      continue;
    }
    const checked = checkFieldValue(field, raw);
    out[field.key] = checked.ok ? checked.value : field.default;
  }
  return out as TariffValues<Fs>;
}

/**
 * Validates a submitted admin form (FormData entries as strings, checkboxes as "on"). An
 * unchecked checkbox is missing from the form, so booleans default to false here.
 */
export function parseTariffForm<Fs extends readonly TariffField[]>(
  fields: Fs,
  form: Record<string, string | undefined>,
): { ok: true; values: TariffValues<Fs> } | { ok: false; errors: Record<string, string> } {
  const values: Record<string, unknown> = {};
  const errors: Record<string, string> = {};
  for (const field of fields) {
    const raw = form[field.key];
    if (field.type === "boolean") {
      values[field.key] = raw === "on" || raw === "true";
      continue;
    }
    const checked = checkFieldValue(field, raw ?? "");
    if (checked.ok) values[field.key] = checked.value;
    else errors[field.key] = checked.error;
  }
  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return { ok: true, values: values as TariffValues<Fs> };
}

/** Fields grouped by their admin heading, in the order of the list. */
export function groupFields<Fs extends readonly TariffField[]>(fields: Fs): { group: string; fields: Fs[number][] }[] {
  const groups: { group: string; fields: Fs[number][] }[] = [];
  for (const field of fields) {
    const existing = groups.find((g) => g.group === field.group);
    if (existing) existing.fields.push(field);
    else groups.push({ group: field.group, fields: [field] });
  }
  return groups;
}

/* ---------- Results ---------- */

export type Period = "monat" | "jahr" | "einmalig";

export interface EstimateLine {
  key: string;
  label: string;
  /** Short explanation, e.g. "60 Buchungen pro Monat". */
  detail?: string;
  /** Rounded amount in CHF for the line's period. 0 for included services. */
  amount: number;
  period: Period;
  /** Part of another selected service, shown as "inklusive". */
  included?: boolean;
  /** Paid to third parties (notary, commercial register, bank), not to ANB. */
  external?: boolean;
}

export interface Estimate {
  lines: EstimateLine[];
  totals: { monat: number; jahr: number; einmalig: number };
  /** Range around the main figure, when the tariffs define a margin. */
  range: { from: number; to: number } | null;
  /** Hints for the visitor, e.g. a missing rent for the management fee. */
  warnings: string[];
}

/** Rounds to the nearest multiple of `step` (e.g. CHF 5). Values above 0 never round down to 0. */
export function roundTo(value: number, step: number): number {
  if (value <= 0) return 0;
  const s = step > 0 ? step : 1;
  return Math.max(s, Math.round(value / s) * s);
}

/** Sums the rounded lines per period, so the breakdown always adds up to the totals. */
export function totalsOf(lines: EstimateLine[]): Estimate["totals"] {
  const totals = { monat: 0, jahr: 0, einmalig: 0 };
  for (const line of lines) {
    if (!line.included) totals[line.period] += line.amount;
  }
  return totals;
}

/** ± margin around a total, rounded outwards to CHF 10. Null without margin or total. */
export function rangeOf(total: number, marginPercent: number): Estimate["range"] {
  if (total <= 0 || marginPercent <= 0) return null;
  const p = marginPercent / 100;
  return {
    from: Math.max(0, Math.floor((total * (1 - p)) / 10) * 10),
    to: Math.ceil((total * (1 + p)) / 10) * 10,
  };
}

export const periodLabel: Record<Period, string> = {
  monat: "pro Monat",
  jahr: "pro Jahr",
  einmalig: "einmalig",
};

/** Swiss legal forms offered in the calculators. */
export const legalForms = [
  { value: "einzelunternehmen", label: "Einzelunternehmen", short: "Einzelfirma" },
  { value: "gmbh", label: "GmbH", short: "GmbH" },
  { value: "ag", label: "AG", short: "AG" },
] as const;

export type LegalForm = (typeof legalForms)[number]["value"];

export function legalFormLabel(value: LegalForm): string {
  return legalForms.find((f) => f.value === value)?.label ?? value;
}

/** "1 Person", "3 Personen" */
export function plural(n: number, one: string, many: string): string {
  return `${new Intl.NumberFormat("de-CH").format(n)} ${n === 1 ? one : many}`;
}
