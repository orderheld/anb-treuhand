"use client";

import { useMemo, useState } from "react";
import type { EstimateLine } from "@/lib/calculators/shared";
import {
  activeTreuhandServices,
  calculateTreuhand,
  TREUHAND_START,
  treuhandInputSchema,
  vatMethods,
  type TreuhandInput,
  type TreuhandService,
  type TreuhandTariffs,
} from "@/lib/calculators/treuhand";
import { formatChf, formatNumber } from "@/lib/utils";
import { Segmented, ServiceToggle, SliderField, StepCard, Stepper } from "./controls";
import { linePrice, toResultLines } from "./format";
import { OfferStep } from "./offer-step";
import { CalculatorLayout, MobileResultBar, ResultPanel } from "./result-panel";
import type { OfferSettings } from "./types";

const legalFormOptions = [
  { value: "einzelunternehmen", label: "Einzelunternehmen", description: "Selbstständig, ohne Mindestkapital" },
  { value: "gmbh", label: "GmbH", description: "Mit Stammkapital, beschränkte Haftung" },
  { value: "ag", label: "AG", description: "Mit Aktienkapital, beschränkte Haftung" },
] as const;

/** Start values, limited to the services the current tariffs offer. */
function startValues(initial: Partial<TreuhandInput> | undefined, offered: readonly TreuhandService[]): TreuhandInput {
  const merged = { ...TREUHAND_START, ...initial };
  let leistungen = merged.leistungen.filter((s) => offered.includes(s));
  if (leistungen.length === 0 && offered.length > 0) leistungen = [offered[0]];
  return { ...merged, leistungen };
}

export function TreuhandCalculator({ tariffs, initial, settings }: { tariffs: TreuhandTariffs; initial?: Partial<TreuhandInput>; settings: OfferSettings }) {
  const services = activeTreuhandServices(tariffs);
  const offered = services.map((s) => s.value);
  const [input, setInput] = useState<TreuhandInput>(() => startValues(initial, offered));
  const estimate = useMemo(() => calculateTreuhand(input, tariffs), [input, tariffs]);
  const update = (patch: Partial<TreuhandInput>) => setInput((prev) => ({ ...prev, ...patch }));
  const toggle = (service: TreuhandService, on: boolean) =>
    setInput((prev) => ({ ...prev, leistungen: on ? [...prev.leistungen, service] : prev.leistungen.filter((s) => s !== service) }));

  // Price of a service on its own, shown next to services that are not selected yet.
  const alone = (service: TreuhandService): EstimateLine | undefined =>
    calculateTreuhand({ ...input, leistungen: [service] }, tariffs).lines.find((l) => l.key === service);

  const selected = input.leistungen.filter((s) => offered.includes(s));
  const check = treuhandInputSchema.safeParse({ ...input, leistungen: selected });
  const inputError = check.success ? null : (check.error.issues[0]?.message ?? "Bitte prüfen Sie Ihre Angaben.");

  if (services.length === 0) {
    return (
      <p className="rounded-panel bg-white p-8 text-lead text-body">
        Der Rechner wird gerade überarbeitet. Gerne berechnen wir Ihren Preis persönlich: {settings.fallbackEmail}
      </p>
    );
  }

  const monthly = estimate.lines.filter((l) => l.period === "monat");
  const oneOff = estimate.lines.filter((l) => l.period === "einmalig");
  const totals = [{ label: "Pro Jahr", value: formatChf(estimate.totals.jahr) }];
  if (estimate.totals.einmalig > 0) totals.push({ label: "Einmalig", value: formatChf(estimate.totals.einmalig) });

  return (
    <CalculatorLayout
      steps={
        <>
          <StepCard number={1} title="Ihr Unternehmen" text="Rechtsform und Umfang bestimmen den Aufwand.">
            <Segmented legend="Rechtsform" name="rechtsform" options={legalFormOptions} value={input.rechtsform} onChange={(rechtsform) => update({ rechtsform })} />
            <SliderField
              label="Buchungen pro Monat"
              hint="Jede Rechnung, Quittung und Bankbewegung ist eine Buchung. Kleine Betriebe haben oft 30 bis 100 pro Monat."
              value={input.buchungen}
              onChange={(buchungen) => update({ buchungen })}
              min={0}
              max={5000}
              sliderMax={500}
              step={5}
              marks={[0, 100, 200, 300, 400, 500]}
            />
            <Stepper
              label="Mitarbeitende mit Lohn"
              hint="Personen mit monatlicher Lohnabrechnung, inklusive Geschäftsführung."
              value={input.mitarbeitende}
              onChange={(mitarbeitende) => update({ mitarbeitende })}
              min={0}
              max={1000}
            />
          </StepCard>

          <StepCard number={2} title="Leistungen" text="Wählen Sie, was wir für Sie übernehmen. Jährliche Arbeiten verteilen wir auf zwölf Monate.">
            <div className="space-y-3">
              {services.map((s) => {
                const on = selected.includes(s.value);
                const line = on ? estimate.lines.find((l) => l.key === s.value) : alone(s.value);
                return (
                  <ServiceToggle
                    key={s.value}
                    label={s.label}
                    description={s.description}
                    checked={on}
                    onChange={(checked) => toggle(s.value, checked)}
                    price={line ? `${on ? "" : "+ "}${linePrice(line)}` : null}
                  >
                    {s.value === "mwst" ? (
                      <Segmented
                        legend="Abrechnungsmethode"
                        name="mwstMethode"
                        options={vatMethods}
                        value={input.mwstMethode}
                        onChange={(mwstMethode) => update({ mwstMethode })}
                        columns={2}
                      />
                    ) : null}
                  </ServiceToggle>
                );
              })}
            </div>
          </StepCard>
        </>
      }
      result={
        <ResultPanel
          amount={estimate.totals.monat}
          suffix="pro Monat"
          range={estimate.range ? `${formatChf(estimate.range.from)} bis ${formatNumber(estimate.range.to)}` : null}
          groups={[
            { title: "Pro Monat", lines: toResultLines(monthly) },
            { title: "Einmalig", lines: toResultLines(oneOff) },
          ]}
          totals={selected.length > 0 ? totals : []}
          warnings={estimate.warnings}
          note={`${tariffs["allgemein.hinweis"]} ${settings.vatNote}`}
          phone={settings.phone}
          empty={selected.length === 0 ? "Wählen Sie mindestens eine Leistung, dann sehen Sie hier Ihren Richtpreis." : null}
        />
      }
      form={
        <OfferStep
          request={{ slug: "treuhand", input: { ...input, leistungen: selected } }}
          estimate={estimate}
          inputError={inputError}
          companyLabel="Firma"
          settings={settings}
          number={3}
          title="Treuhand-Preisrechner"
        />
      }
      bar={<MobileResultBar label="Richtpreis" amount={estimate.totals.monat} suffix="pro Monat" />}
    />
  );
}
