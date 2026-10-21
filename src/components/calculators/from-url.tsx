"use client";

import { useSearchParams } from "next/navigation";
import type { GruendungInput, GruendungTariffs } from "@/lib/calculators/gruendung";
import { propertyTypes, type ImmobilienInput, type ImmobilienTariffs } from "@/lib/calculators/immobilien";
import { legalForms, type LegalForm } from "@/lib/calculators/shared";
import type { TreuhandInput, TreuhandTariffs } from "@/lib/calculators/treuhand";
import { GruendungCalculator } from "./gruendung-calculator";
import { ImmobilienCalculator } from "./immobilien-calculator";
import { TreuhandCalculator } from "./treuhand-calculator";
import type { OfferSettings } from "./types";

/**
 * Start values from the address, e.g. /rechner/treuhand?rf=gmbh&b=80&m=3 from the quick
 * calculator on the home page. Read in the browser, so the pages stay static.
 */

function int(value: string | null, min: number, max: number): number | undefined {
  if (value === null || !/^\d{1,9}$/.test(value)) return undefined;
  const n = Number(value);
  return n >= min && n <= max ? n : undefined;
}

function legalForm(value: string | null): LegalForm | undefined {
  return legalForms.find((f) => f.value === value)?.value;
}

function compact<T extends object>(o: T): Partial<T> {
  return Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined)) as Partial<T>;
}

export function TreuhandFromUrl({ tariffs, settings }: { tariffs: TreuhandTariffs; settings: OfferSettings }) {
  const params = useSearchParams();
  const initial: Partial<TreuhandInput> = compact({
    rechtsform: legalForm(params.get("rf")),
    buchungen: int(params.get("b"), 0, 5000),
    mitarbeitende: int(params.get("m"), 0, 1000),
  });
  return <TreuhandCalculator key={JSON.stringify(initial)} tariffs={tariffs} settings={settings} initial={initial} />;
}

export function GruendungFromUrl({ tariffs, settings }: { tariffs: GruendungTariffs; settings: OfferSettings }) {
  const params = useSearchParams();
  const initial: Partial<GruendungInput> = compact({ rechtsform: legalForm(params.get("rf")) });
  return <GruendungCalculator key={JSON.stringify(initial)} tariffs={tariffs} settings={settings} initial={initial} />;
}

export function ImmobilienFromUrl({ tariffs, settings }: { tariffs: ImmobilienTariffs; settings: OfferSettings }) {
  const params = useSearchParams();
  const art = propertyTypes.find((p) => p.value === params.get("art"))?.value;
  const initial: Partial<ImmobilienInput> = compact({ objektart: art });
  return <ImmobilienCalculator key={JSON.stringify(initial)} tariffs={tariffs} settings={settings} initial={initial} />;
}
