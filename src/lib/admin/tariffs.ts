import "server-only";
import type { CalculatorSlug } from "@/content/types";
import { parseTariffs } from "@/lib/calculators/shared";
import { query } from "@/lib/db/client";
import { tariffRegistry } from "@/lib/tariffs/registry";

/**
 * Tariffs in the admin area, read straight from the database (the public pages read them
 * through the cache in lib/tariffs/store.ts). A calculator without a saved row uses its defaults.
 */

export interface SavedTariffs {
  values: Record<string, number | boolean | string>;
  /** Null while the defaults apply. */
  updatedAt: Date | null;
}

export async function savedTariffs(slug: CalculatorSlug): Promise<SavedTariffs> {
  const entry = tariffRegistry[slug];
  const rows = await query<{ value: unknown; updated_at: Date }>("select value, updated_at from settings where key = $1", [entry.key]);
  return {
    values: parseTariffs(entry.fields, rows[0]?.value) as Record<string, number | boolean | string>,
    updatedAt: rows[0]?.updated_at ?? null,
  };
}

/** When each calculator's tariffs were last saved (null: defaults). */
export async function tariffsUpdatedAt(): Promise<Record<CalculatorSlug, Date | null>> {
  const keys = Object.values(tariffRegistry).map((e) => e.key);
  const rows = await query<{ key: string; updated_at: Date }>("select key, updated_at from settings where key = any($1)", [keys]);
  const out = {} as Record<CalculatorSlug, Date | null>;
  for (const [slug, entry] of Object.entries(tariffRegistry) as [CalculatorSlug, (typeof tariffRegistry)[CalculatorSlug]][]) {
    out[slug] = rows.find((r) => r.key === entry.key)?.updated_at ?? null;
  }
  return out;
}

export async function saveTariffs(slug: CalculatorSlug, values: Record<string, unknown>): Promise<void> {
  await query(
    `insert into settings (key, value) values ($1, $2::jsonb)
     on conflict (key) do update set value = excluded.value, updated_at = now()`,
    [tariffRegistry[slug].key, JSON.stringify(values)],
  );
}

/** Back to the defaults in the code. */
export async function resetTariffs(slug: CalculatorSlug): Promise<void> {
  await query("delete from settings where key = $1", [tariffRegistry[slug].key]);
}
