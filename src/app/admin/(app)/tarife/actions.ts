"use server";

import { refresh, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { audit } from "@/lib/admin/audit";
import { requireAdmin } from "@/lib/admin/auth/session";
import { fail, formObject, ok, type ActionState } from "@/lib/admin/forms";
import { resetTariffs, saveTariffs, savedTariffs } from "@/lib/admin/tariffs";
import { parseTariffForm } from "@/lib/calculators/shared";
import { TARIFF_TAG, isCalculatorSlug, tariffRegistry } from "@/lib/tariffs/registry";

/**
 * Saves the tariffs of one calculator. Every value is checked against its field (range, decimal
 * places); the cache tag then makes the website use the new tariffs from the next request on.
 * After saving, the page loads again, so the form shows the stored values.
 */
export async function saveTariffsAction(slug: string, _prev: ActionState, data: FormData): Promise<ActionState> {
  const session = await requireAdmin();
  if (!isCalculatorSlug(slug)) return fail("Unbekannter Rechner.");
  const entry = tariffRegistry[slug];
  const parsed = parseTariffForm(entry.fields, formObject(data));
  if (!parsed.ok) return fail("Bitte prüfen Sie die markierten Felder.", parsed.errors);

  const before = (await savedTariffs(slug)).values;
  const values = parsed.values as Record<string, unknown>;
  const changed = entry.fields.filter((f) => before[f.key] !== values[f.key]).map((f) => f.key);
  if (changed.length === 0) return ok("Keine Änderungen: Alle Werte sind schon gespeichert.");

  await saveTariffs(slug, values);
  updateTag(`${TARIFF_TAG}-${slug}`);
  await audit("tariffs_saved", { calculator: slug, changed: changed.slice(0, 60) }, session.id);
  refresh();
  redirect(`/admin/tarife/${slug}?gespeichert=${changed.length}`);
}

/** Back to the defaults in the code. */
export async function resetTariffsAction(slug: string): Promise<void> {
  const session = await requireAdmin();
  if (!isCalculatorSlug(slug)) return;
  await resetTariffs(slug);
  updateTag(`${TARIFF_TAG}-${slug}`);
  await audit("tariffs_reset", { calculator: slug }, session.id);
  refresh();
  redirect(`/admin/tarife/${slug}?zurueckgesetzt=1`);
}
