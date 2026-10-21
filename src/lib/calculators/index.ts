import * as z from "zod";
import type { CalculatorSlug } from "@/content/types";
import { calculateGruendung, gruendungInputSchema, type GruendungInput, type GruendungTariffs } from "./gruendung";
import { calculateImmobilien, immobilienInputSchema, recurringPerYear, type ImmobilienInput, type ImmobilienTariffs } from "./immobilien";
import type { Estimate } from "./shared";
import { calculateTreuhand, treuhandInputSchema, type TreuhandInput, type TreuhandTariffs } from "./treuhand";

/** The values of one calculator, tagged with its slug. */
export type CalculatorRequest =
  | { slug: "treuhand"; input: TreuhandInput }
  | { slug: "firmengruendung"; input: GruendungInput }
  | { slug: "immobilien"; input: ImmobilienInput };

function firstIssue(error: z.ZodError): string {
  return error.issues[0]?.message ?? "Bitte prüfen Sie die Angaben im Rechner.";
}

/**
 * Reads the calculator values sent with an offer request (JSON from the browser). Never trusts
 * them: they are validated with the same schema the calculator uses.
 */
export function parseCalculatorInput(slug: CalculatorSlug, raw: unknown): { ok: true; value: CalculatorRequest } | { ok: false; error: string } {
  let data: unknown;
  try {
    data = typeof raw === "string" ? JSON.parse(raw) : raw;
  } catch {
    return { ok: false, error: "Die Angaben im Rechner konnten nicht gelesen werden. Bitte laden Sie die Seite neu." };
  }
  switch (slug) {
    case "treuhand": {
      const parsed = treuhandInputSchema.safeParse(data);
      return parsed.success ? { ok: true, value: { slug, input: parsed.data } } : { ok: false, error: firstIssue(parsed.error) };
    }
    case "firmengruendung": {
      const parsed = gruendungInputSchema.safeParse(data);
      return parsed.success ? { ok: true, value: { slug, input: parsed.data } } : { ok: false, error: firstIssue(parsed.error) };
    }
    case "immobilien": {
      const parsed = immobilienInputSchema.safeParse(data);
      return parsed.success ? { ok: true, value: { slug, input: parsed.data } } : { ok: false, error: firstIssue(parsed.error) };
    }
  }
}

/** Runs the matching calculation. The tariffs must belong to the same calculator. */
export function estimateOf(request: CalculatorRequest, tariffs: TreuhandTariffs | GruendungTariffs | ImmobilienTariffs): Estimate {
  switch (request.slug) {
    case "treuhand":
      return calculateTreuhand(request.input, tariffs as TreuhandTariffs);
    case "firmengruendung":
      return calculateGruendung(request.input, tariffs as GruendungTariffs);
    case "immobilien":
      return calculateImmobilien(request.input, tariffs as ImmobilienTariffs);
  }
}

/** The main figure of a result, as on the result panel. */
export function headlineOf(slug: CalculatorSlug, estimate: Estimate): { label: string; amount: number; suffix: string } {
  switch (slug) {
    case "treuhand":
      return { label: "Richtpreis", amount: estimate.totals.monat, suffix: "pro Monat" };
    case "firmengruendung":
      return { label: "Gründungspreis", amount: estimate.totals.einmalig, suffix: "einmalig" };
    case "immobilien": {
      const recurring = recurringPerYear(estimate);
      return recurring > 0
        ? { label: "Richtpreis", amount: recurring, suffix: "pro Jahr" }
        : { label: "Richtpreis", amount: estimate.totals.einmalig, suffix: "einmalig" };
    }
  }
}
