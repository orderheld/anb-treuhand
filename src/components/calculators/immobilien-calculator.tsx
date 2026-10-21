"use client";

import { useState } from "react";
import {
  activePropertyServices,
  calculateImmobilien,
  IMMOBILIEN_START,
  immobilienInputSchema,
  includingService,
  propertyServices,
  propertyTypes,
  recurringPerYear,
  type ImmobilienInput,
  type ImmobilienTariffs,
  type PropertyService,
  type PropertyType,
} from "@/lib/calculators/immobilien";
import type { EstimateLine } from "@/lib/calculators/shared";
import { formatChf, formatNumber } from "@/lib/utils";
import { AmountField, Segmented, ServiceToggle, StepCard, Stepper, TextInput } from "./controls";
import { linePrice, toResultLines } from "./format";
import { OfferStep } from "./offer-step";
import { CalculatorLayout, MobileResultBar, ResultPanel, type ResultLine } from "./result-panel";
import type { OfferSettings } from "./types";

/** Example values per type, used until the visitor enters their own. */
const typeDefaults: Record<PropertyType, { einheiten: number; mietertrag: number }> = {
  wohnung: { einheiten: 1, mietertrag: 1800 },
  efh: { einheiten: 1, mietertrag: 2900 },
  mfh: { einheiten: 6, mietertrag: 9600 },
  stwe: { einheiten: 8, mietertrag: 0 },
  gewerbe: { einheiten: 4, mietertrag: 8000 },
  gemischt: { einheiten: 6, mietertrag: 11_000 },
};

const typeOptions = propertyTypes.map((p) => ({ value: p.value, label: p.label }));
const serviceLabel = (s: PropertyService) => propertyServices.find((p) => p.value === s)?.label ?? s;

export function ImmobilienCalculator({ tariffs, initial, settings }: { tariffs: ImmobilienTariffs; initial?: Partial<ImmobilienInput>; settings: OfferSettings }) {
  const [input, setInput] = useState<ImmobilienInput>(() => {
    const type = initial?.objektart ?? IMMOBILIEN_START.objektart;
    const base = type === IMMOBILIEN_START.objektart ? IMMOBILIEN_START : { ...IMMOBILIEN_START, ...typeDefaults[type] };
    const leistungen = type === "stwe" ? base.leistungen.map((s) => (s === "verwaltung" ? "stwe" : s)) : base.leistungen;
    return { ...base, leistungen, ...initial };
  });
  const [touched, setTouched] = useState({ einheiten: false, mietertrag: false });
  const update = (patch: Partial<ImmobilienInput>) => setInput((prev) => ({ ...prev, ...patch }));

  const setType = (objektart: PropertyType) =>
    setInput((prev) => {
      const swap = (s: PropertyService): PropertyService => (objektart === "stwe" && s === "verwaltung" ? "stwe" : objektart !== "stwe" && s === "stwe" ? "verwaltung" : s);
      return {
        ...prev,
        objektart,
        einheiten: touched.einheiten ? prev.einheiten : typeDefaults[objektart].einheiten,
        mietertrag: touched.mietertrag ? prev.mietertrag : typeDefaults[objektart].mietertrag,
        leistungen: [...new Set(prev.leistungen.map(swap))],
      };
    });
  const toggle = (service: PropertyService, on: boolean) =>
    setInput((prev) => ({ ...prev, leistungen: on ? [...prev.leistungen, service] : prev.leistungen.filter((s) => s !== service) }));

  const services = activePropertyServices(tariffs, input.objektart);
  const offered = services.map((s) => s.value as PropertyService);
  const selected = input.leistungen.filter((s) => offered.includes(s));
  const request: ImmobilienInput = { ...input, leistungen: selected };
  const estimate = calculateImmobilien(request, tariffs);
  const check = immobilienInputSchema.safeParse(request);
  const inputError = check.success ? null : (check.error.issues[0]?.message ?? "Bitte prüfen Sie Ihre Angaben.");

  const alone = (service: PropertyService): EstimateLine | undefined =>
    calculateImmobilien({ ...request, leistungen: [service] }, tariffs).lines.find((l) => l.key === service);

  const type = propertyTypes.find((p) => p.value === input.objektart) ?? propertyTypes[0];
  const recurring = recurringPerYear(estimate);
  const main = recurring > 0 ? { amount: recurring, suffix: "pro Jahr" } : { amount: estimate.totals.einmalig, suffix: "einmalig" };

  // Services that are part of a selected management mandate are listed as "inklusive".
  const includedLines: ResultLine[] = offered
    .filter((s) => !selected.includes(s))
    .map((s) => ({ s, parent: includingService(s, selected) }))
    .filter((x): x is { s: PropertyService; parent: PropertyService } => x.parent !== null)
    .map(({ s, parent }) => ({ key: `inkl-${s}`, label: serviceLabel(s), detail: `in «${serviceLabel(parent)}» enthalten`, amount: "inklusive", muted: true }));
  const recurringLines = [...toResultLines(estimate.lines.filter((l) => l.period !== "einmalig"), true), ...includedLines];
  const oneOffLines = toResultLines(estimate.lines.filter((l) => l.period === "einmalig"));

  const totals: { label: string; value: string }[] = [];
  if (recurring > 0) totals.push({ label: "Entspricht pro Monat", value: formatChf(Math.round(recurring / 12)) });
  if (recurring > 0 && estimate.totals.einmalig > 0) totals.push({ label: "Einmalig", value: formatChf(estimate.totals.einmalig) });

  const renderService = (s: (typeof services)[number]) => {
    const on = selected.includes(s.value);
    const parent = includingService(s.value, selected);
    const line = on ? estimate.lines.find((l) => l.key === s.value) : alone(s.value);
    return (
      <ServiceToggle
        key={s.value}
        label={s.label}
        description={s.description}
        checked={on}
        onChange={(checked) => toggle(s.value, checked)}
        included={parent ? `In «${serviceLabel(parent)}» enthalten.` : null}
        price={line && !line.included ? `${on ? "" : "+ "}${linePrice(line)}` : null}
      >
        {s.value === "uebergaben" ? (
          <Stepper
            label="Abnahmen und Übergaben pro Jahr"
            hint="Bei Mieterwechseln. Mit 0 verrechnen wir sie nach Bedarf."
            value={input.uebergabenProJahr}
            onChange={(uebergabenProJahr) => update({ uebergabenProJahr })}
            min={0}
            max={1000}
          />
        ) : s.value === "verkauf" ? (
          <AmountField label="Geschätzter Verkaufspreis" value={input.verkaufspreis} onChange={(verkaufspreis) => update({ verkaufspreis })} />
        ) : s.value === "sanierung" ? (
          <AmountField
            label="Geschätzte Bausumme"
            hint="Ungefähre Kosten der Arbeiten. Eine grobe Schätzung genügt."
            value={input.bausumme}
            onChange={(bausumme) => update({ bausumme })}
          />
        ) : null}
      </ServiceToggle>
    );
  };

  return (
    <CalculatorLayout
      steps={
        <>
          <StepCard number={1} title="Ihre Liegenschaft" text="Art, Grösse und Mietertrag bestimmen das Honorar.">
            <Segmented legend="Art der Immobilie" name="objektart" options={typeOptions} value={input.objektart} onChange={setType} />
            <TextInput label="Standort" optional maxLength={80} value={input.standort ?? ""} onChange={(standort) => update({ standort })} placeholder="z. B. Langenthal" autoComplete="address-level2" />
            <Stepper
              label={`Anzahl ${type.unitLabel}`}
              hint={input.objektart === "gemischt" || input.objektart === "gewerbe" ? "Wohnungen, Ladenflächen, Büros und Gewerberäume zusammen." : undefined}
              value={input.einheiten}
              onChange={(einheiten) => {
                setTouched((t) => ({ ...t, einheiten: true }));
                update({ einheiten });
              }}
              min={1}
              max={2000}
            />
            {input.objektart !== "stwe" ? (
              <AmountField
                label="Mieteinnahmen"
                hint="Summe der Mietzinse aller Einheiten, ohne Nebenkosten."
                value={input.mietertrag}
                onChange={(mietertrag) => {
                  setTouched((t) => ({ ...t, mietertrag: true }));
                  update({ mietertrag });
                }}
                max={100_000_000}
                periods={{ value: input.mietertragPeriode, onChange: (mietertragPeriode) => update({ mietertragPeriode }) }}
              />
            ) : null}
          </StepCard>

          <StepCard number={2} title="Leistungen" text="Laufende Betreuung, Verkauf oder ein Sanierungsprojekt: Wählen Sie, was Sie brauchen.">
            <div>
              <h3 className="mb-3 text-sm font-semibold text-accent">Laufend</h3>
              <div className="space-y-3">{services.filter((s) => s.group === "laufend").map(renderService)}</div>
            </div>
            <div>
              <h3 className="mb-3 text-sm font-semibold text-accent">Einmalig</h3>
              <div className="space-y-3">{services.filter((s) => s.group === "einmalig").map(renderService)}</div>
            </div>
          </StepCard>
        </>
      }
      result={
        <ResultPanel
          amount={main.amount}
          suffix={main.suffix}
          range={estimate.range ? `${formatChf(estimate.range.from)} bis ${formatNumber(estimate.range.to)} pro Jahr` : null}
          groups={[
            { title: "Laufend", lines: recurringLines },
            { title: "Einmalig", lines: oneOffLines },
          ]}
          totals={totals}
          warnings={estimate.warnings}
          note={`${tariffs["allgemein.hinweis"]} ${settings.vatNote}`}
          phone={settings.phone}
          empty={selected.length === 0 ? "Wählen Sie mindestens eine Leistung, dann sehen Sie hier Ihren Richtpreis." : null}
        />
      }
      form={
        <OfferStep
          request={{ slug: "immobilien", input: request }}
          estimate={estimate}
          inputError={inputError}
          companyLabel="Firma oder Eigentümerschaft"
          settings={settings}
          number={3}
          title="Immobilien-Rechner"
        />
      }
      bar={<MobileResultBar label="Richtpreis" amount={main.amount} suffix={main.suffix} />}
    />
  );
}
