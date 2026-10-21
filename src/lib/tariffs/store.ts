import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import type { CalculatorSlug } from "@/content/types";
import { parseTariffs } from "@/lib/calculators/shared";
import { isDatabaseConfigured, query } from "@/lib/db/client";
import { TARIFF_TAG, tariffRegistry, type TariffsOf } from "./registry";

/**
 * Current tariffs of a calculator: the values saved in the admin area (settings table), with
 * every missing field taken from the defaults. Cached until the admin area saves new tariffs
 * (updateTag), so the calculator pages stay static.
 *
 * Without DATABASE_URL the defaults apply. If the database cannot be read, the defaults are used
 * for a short time only and the next request after a minute tries again.
 */
export async function getTariffs<K extends CalculatorSlug>(slug: K): Promise<TariffsOf<K>> {
  "use cache";
  cacheTag(TARIFF_TAG, `${TARIFF_TAG}-${slug}`);
  const entry = tariffRegistry[slug];
  if (!isDatabaseConfigured()) {
    cacheLife("max");
    return entry.defaults;
  }
  try {
    const rows = await query<{ value: unknown }>("select value from settings where key = $1", [entry.key]);
    cacheLife("max");
    return parseTariffs(entry.fields, rows[0]?.value) as unknown as TariffsOf<K>;
  } catch (error) {
    console.error(JSON.stringify({ event: "tariffs.read_failed", slug, error: error instanceof Error ? error.message : String(error) }));
    cacheLife("minutes");
    return entry.defaults;
  }
}
