"use client";

import { useState } from "react";
import {
  activeFoundingExtras,
  calculateGruendung,
  cantons,
  foundingSubtotals,
  GRUENDUNG_START,
  gruendungInputSchema,
  MIN_CAPITAL,
  type FoundingExtra,
  type GruendungInput,
  type GruendungTariffs,
} from "@/lib/calculators/gruendung";
import type { LegalForm } from "@/lib/calculators/shared";
import { formatChf, formatNumber } from "@/lib/utils";
import { Segmented, SelectField, ServiceToggle, SliderField, StepCard, Stepper, TextInput } from "./controls";
import { toResultLines } from "./format";
import { OfferStep } from "./offer-step";
import { CalculatorLayout, MobileResultBar, ResultPanel } from "./result-panel";
import type { OfferSettings } from "./types";

const legalFormOptions = [
  { value: "einzelunternehmen", label: "Einzelunternehmen", description: "Für Selbstständige, ohne Mindestkapital" },
  { value: "gmbh", label: "GmbH", description: "Stammkapital ab CHF 20’000" },
  { value: "ag", label: "AG", description: "Aktienkapital ab CHF 100’000" },
] as const;

const capitalSlider: Record<Exclude<LegalForm, "einzelunternehmen">, { sliderMax: number; step: number; marks: number[]; label: string; hint: string }> = {
  gmbh: {
    sliderMax: 200_000,
    step: 1000,
    marks: [20_000, 70_000, 135_000, 200_000],
    label: "Stammkapital",
    hint: "Wird bei der Gründung voll einbezahlt und steht danach Ihrem Unternehmen zur Verfügung.",
  },
  ag: {
    sliderMax: 1_000_000,
    step: 10_000,
    marks: [100_000, 400_000, 700_000, 1_000_000],
    label: "Aktienkapital",
    hint: "Einzuzahlen sind mindestens 20 Prozent, insgesamt aber mindestens CHF 50’000.",
  },
};

export function GruendungCalculator({ tariffs, initial, settings }: { tariffs: GruendungTariffs; initial?: Partial<GruendungInput>; settings: OfferSettings }) {
  const [input, setInput] = useState<GruendungInput>(() => {
    const merged = { ...GRUENDUNG_START, ...initial };
    return merged.rechtsform === "einzelunternehmen" ? merged : { ...merged, kapital: Math.max(merged.kapital, MIN_CAPITAL[merged.rechtsform]) };
  });
  const update = (patch: Partial<GruendungInput>) => setInput((prev) => ({ ...prev, ...patch }));
  const setForm = (rechtsform: LegalForm) =>
    setInput((prev) => ({ ...prev, rechtsform, kapital: rechtsform === "einzelunternehmen" ? prev.kapital : Math.max(prev.kapital, MIN_CAPITAL[rechtsform]) }));
  const toggle = (extra: FoundingExtra, on: boolean) =>
    setInput((prev) => ({ ...prev, zusatz: on ? [...prev.zusatz, extra] : prev.zusatz.filter((z) => z !== extra) }));

  const extras = activeFoundingExtras(tariffs, input.rechtsform);
  const offered = extras.map((e) => e.value as FoundingExtra);
  // Only the extras that fit the chosen legal form are sent and priced.
  const request: GruendungInput = { ...input, zusatz: input.zusatz.filter((z) => offered.includes(z)) };
  const estimate = calculateGruendung(request, tariffs);
  const sub = foundingSubtotals(estimate);
  const check = gruendungInputSchema.safeParse(request);
  const inputError = check.success ? null : (check.error.issues[0]?.message ?? "Bitte prüfen Sie Ihre Angaben.");
  const corporate = input.rechtsform !== "einzelunternehmen";
  const capital = corporate ? capitalSlider[input.rechtsform as "gmbh" | "ag"] : null;

  return (
    <CalculatorLayout
      steps={
        <>
          <StepCard number={1} title="Rechtsform" text="Sie bestimmt Haftung, Kapital und den Ablauf der Gründung.">
            <Segmented legend="Rechtsform" name="rechtsform" options={legalFormOptions} value={input.rechtsform} onChange={setForm} />
            {corporate && capital ? (
              <>
                <Stepper
                  label="Gründerinnen und Gründer"
                  hint="Alle Personen, die Anteile übernehmen."
                  value={input.gesellschafter}
                  onChange={(gesellschafter) => update({ gesellschafter })}
                  min={1}
                  max={50}
                />
                <SliderField
                  key={input.rechtsform}
                  label={capital.label}
                  currency
                  hint={capital.hint}
                  value={input.kapital}
                  onChange={(kapital) => update({ kapital })}
                  min={MIN_CAPITAL[input.rechtsform as "gmbh" | "ag"]}
                  max={1_000_000_000}
                  sliderMax={capital.sliderMax}
                  step={capital.step}
                  marks={capital.marks}
                />
              </>
            ) : (
              <ServiceToggle
                label="Eintrag ins Handelsregister"
                description="Pflicht ab CHF 100’000 Jahresumsatz, darunter freiwillig."
                checked={input.hrEintrag}
                onChange={(hrEintrag) => update({ hrEintrag })}
                price={`${formatChf(tariffs["extern.handelsregister.einzelunternehmen"])} Gebühr`}
              />
            )}
          </StepCard>

          <StepCard number={2} title="Firma und Sitz" text="Noch nicht alles entschieden? Kein Problem, die Angaben sind freiwillig.">
            <TextInput
              label="Firmenname"
              optional
              maxLength={120}
              value={input.firmenname ?? ""}
              onChange={(firmenname) => update({ firmenname })}
              placeholder={corporate ? `z. B. Muster ${input.rechtsform === "gmbh" ? "GmbH" : "AG"}` : "z. B. Muster Malerei"}
              hint={
                corporate
                  ? "Haben Sie schon einen Namen? Wir klären, ob er im Handelsregister noch frei ist."
                  : "Bei einer Einzelfirma muss der Name Ihren Familiennamen enthalten."
              }
            />
            <div className="grid gap-6 sm:grid-cols-2">
              <TextInput label="Sitz (Gemeinde)" maxLength={80} value={input.sitz ?? ""} onChange={(sitz) => update({ sitz })} placeholder="z. B. Langenthal" autoComplete="address-level2" />
              <SelectField label="Kanton" value={input.kanton} onChange={(kanton) => update({ kanton: kanton as GruendungInput["kanton"] })} options={cantons} />
            </div>
            <TextInput
              label="Geschäftszweck"
              optional
              multiline
              maxLength={1500}
              value={input.zweck ?? ""}
              onChange={(zweck) => update({ zweck })}
              placeholder="Was wird Ihr Unternehmen tun?"
              hint="In eigenen Worten. Wir formulieren den Zweck für das Handelsregister."
            />
          </StepCard>

          <StepCard number={3} title="Zusatzleistungen" text="Alles, was den Start erleichtert. Wählen Sie nach Bedarf.">
            <div className="space-y-3">
              {extras.map((e) => (
                <ServiceToggle
                  key={e.value}
                  label={e.label}
                  description={e.description}
                  checked={request.zusatz.includes(e.value)}
                  onChange={(on) => toggle(e.value, on)}
                  price={`${request.zusatz.includes(e.value) ? "" : "+ "}${formatChf(tariffs[`zusatz.${e.value}.preis`])}`}
                />
              ))}
              {extras.length === 0 ? <p className="text-muted">Für diese Rechtsform bieten wir im Rechner keine Zusatzleistungen an.</p> : null}
            </div>
          </StepCard>
        </>
      }
      result={
        <ResultPanel
          eyebrow="Ihr Gründungspreis"
          amount={estimate.totals.einmalig}
          suffix="einmalig, alles zusammen"
          range={estimate.range ? `${formatChf(estimate.range.from)} bis ${formatNumber(estimate.range.to)}` : null}
          groups={[
            { title: "Honorar ANB Treuhand", subtotal: formatChf(sub.fee), lines: toResultLines(estimate.lines.filter((l) => !l.external)) },
            { title: "Externe Kosten (Schätzung)", subtotal: formatChf(sub.external), lines: toResultLines(estimate.lines.filter((l) => l.external)) },
          ]}
          warnings={estimate.warnings}
          note={`${tariffs["allgemein.hinweis"]} ${settings.vatNote}`}
          phone={settings.phone}
        />
      }
      form={
        <OfferStep
          request={{ slug: "firmengruendung", input: request }}
          estimate={estimate}
          inputError={inputError}
          companyLabel={null}
          settings={settings}
          number={4}
          title="Firmengründungsrechner"
        />
      }
      bar={<MobileResultBar label="Gründungspreis" amount={estimate.totals.einmalig} suffix="einmalig" />}
    />
  );
}
