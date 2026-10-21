import type { CalculatorSlug } from "@/content/types";
import { GRUENDUNG_DEFAULTS, GRUENDUNG_FIELDS, type GruendungTariffs } from "@/lib/calculators/gruendung";
import { IMMOBILIEN_DEFAULTS, IMMOBILIEN_FIELDS, type ImmobilienTariffs } from "@/lib/calculators/immobilien";
import type { TariffField } from "@/lib/calculators/shared";
import { TREUHAND_DEFAULTS, TREUHAND_FIELDS, type TreuhandTariffs } from "@/lib/calculators/treuhand";

/** Tariff object per calculator. */
export interface TariffsBySlug {
  treuhand: TreuhandTariffs;
  firmengruendung: GruendungTariffs;
  immobilien: ImmobilienTariffs;
}

export type TariffsOf<K extends CalculatorSlug> = TariffsBySlug[K];

/** Fields, defaults and storage key of each calculator's tariffs. */
export const tariffRegistry: { [K in CalculatorSlug]: { fields: readonly TariffField[]; defaults: TariffsBySlug[K]; key: string; title: string } } = {
  treuhand: { fields: TREUHAND_FIELDS, defaults: TREUHAND_DEFAULTS, key: "tarife.treuhand", title: "Treuhand-Preisrechner" },
  firmengruendung: { fields: GRUENDUNG_FIELDS, defaults: GRUENDUNG_DEFAULTS, key: "tarife.firmengruendung", title: "Firmengründungsrechner" },
  immobilien: { fields: IMMOBILIEN_FIELDS, defaults: IMMOBILIEN_DEFAULTS, key: "tarife.immobilien", title: "Immobilien-Rechner" },
};

export const calculatorSlugs = Object.keys(tariffRegistry) as CalculatorSlug[];

export function isCalculatorSlug(value: string): value is CalculatorSlug {
  return value in tariffRegistry;
}

/** Cache tag of the tariffs; the admin area expires it after a change. */
export const TARIFF_TAG = "tarife";
