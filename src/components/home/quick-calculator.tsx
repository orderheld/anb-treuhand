"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { ChevronRight, Minus, Plus } from "lucide-react";
import { AnimatedNumber } from "@/components/calculators/animated-number";
import { legalForms, type LegalForm } from "@/lib/calculators/shared";
import { activeTreuhandServices, calculateTreuhand, TREUHAND_START, type TreuhandTariffs } from "@/lib/calculators/treuhand";
import { formatNumber } from "@/lib/utils";

const SLIDER_MAX = 300;
const marks = [0, 100, 200, 300];

/**
 * Small version of the Treuhand calculator in the home hero: legal form, bookings and employees,
 * with the usual package of services. "Genau berechnen" opens the full calculator with the same
 * values (/rechner/treuhand?rf=…&b=…&m=…).
 */
export function QuickCalculator({ tariffs }: { tariffs: TreuhandTariffs }) {
  const id = useId();
  const [rechtsform, setRechtsform] = useState<LegalForm>(TREUHAND_START.rechtsform);
  const [buchungen, setBuchungen] = useState(TREUHAND_START.buchungen);
  const [mitarbeitende, setMitarbeitende] = useState(TREUHAND_START.mitarbeitende);

  const offered = activeTreuhandServices(tariffs).map((s) => s.value);
  // Without employees there is no payroll in the package.
  const leistungen = TREUHAND_START.leistungen.filter((s) => offered.includes(s) && (s !== "lohn" || mitarbeitende > 0));
  if (leistungen.length === 0) return null;

  const estimate = calculateTreuhand({ ...TREUHAND_START, rechtsform, buchungen, mitarbeitende, leistungen }, tariffs);
  const monthly = estimate.totals.monat;
  const href = `/rechner/treuhand?rf=${rechtsform}&b=${buchungen}&m=${mitarbeitende}`;
  const fill = (Math.min(buchungen, SLIDER_MAX) / SLIDER_MAX) * 100;
  const stepButton =
    "flex size-10 items-center justify-center rounded-full bg-mist text-body transition-colors hover:bg-mist-deep hover:text-ink disabled:pointer-events-none disabled:opacity-40";

  return (
    <section aria-labelledby={`${id}-title`} className="overflow-hidden rounded-panel bg-white shadow-lift ring-1 ring-black/[0.04]">
      <div className="p-6 sm:p-8">
        <p className="kicker">Schnellrechner</p>
        <h2 id={`${id}-title`} className="mt-1 text-2xl leading-tight">
          Was kostet Ihre Buchhaltung?
        </h2>

        <fieldset className="mt-6">
          <legend className="text-[0.9375rem] font-medium">Rechtsform</legend>
          <div className="mt-2 grid grid-cols-3 gap-0.5 rounded-xl bg-mist p-[3px]">
            {legalForms.map((f) => (
              <label
                key={f.value}
                className="flex h-9 cursor-pointer items-center justify-center rounded-[0.5625rem] px-1 text-center text-[0.9375rem] font-medium text-body transition-colors hover:text-ink has-checked:bg-white has-checked:font-semibold has-checked:text-ink has-checked:shadow-[0_0_0_0.5px_rgb(0_0_0/0.04),0_2px_6px_rgb(0_0_0/0.1)] has-focus-visible:outline-2 has-focus-visible:outline-offset-1 has-focus-visible:outline-accent"
              >
                <input type="radio" name={`${id}-rf`} value={f.value} checked={rechtsform === f.value} onChange={() => setRechtsform(f.value)} className="sr-only" />
                {f.short}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="mt-6">
          <div className="flex items-baseline justify-between gap-4">
            <label htmlFor={`${id}-b`} className="text-[0.9375rem] font-medium">
              Buchungen pro Monat
            </label>
            <output htmlFor={`${id}-b`} className="text-xl font-[650] tabular">
              {buchungen >= SLIDER_MAX ? `${SLIDER_MAX}+` : buchungen}
            </output>
          </div>
          <input
            id={`${id}-b`}
            type="range"
            min={0}
            max={SLIDER_MAX}
            step={5}
            value={Math.min(buchungen, SLIDER_MAX)}
            onChange={(e) => setBuchungen(Number(e.target.value))}
            aria-valuetext={`${buchungen} Buchungen pro Monat`}
            className="range mt-1.5"
            style={{ "--range-fill": `${fill}%` } as React.CSSProperties}
          />
          <div aria-hidden className="flex justify-between text-[0.8125rem] text-muted tabular">
            {marks.map((m) => (
              <span key={m}>{m === SLIDER_MAX ? `${m}+` : m}</span>
            ))}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between gap-4">
          <span id={`${id}-m-label`} className="text-[0.9375rem] font-medium">
            Mitarbeitende mit Lohn
          </span>
          <div role="group" aria-labelledby={`${id}-m-label`} className="flex items-center gap-2">
            <button type="button" className={stepButton} onClick={() => setMitarbeitende((n) => Math.max(0, n - 1))} disabled={mitarbeitende <= 0} aria-label="Eine Person weniger">
              <Minus aria-hidden className="size-4" strokeWidth={2} />
            </button>
            <output aria-live="polite" className="w-8 text-center text-xl font-[650] tabular">
              {mitarbeitende}
            </output>
            <button type="button" className={stepButton} onClick={() => setMitarbeitende((n) => Math.min(50, n + 1))} disabled={mitarbeitende >= 50} aria-label="Eine Person mehr">
              <Plus aria-hidden className="size-4" strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-line bg-mist p-6 sm:px-8 sm:pb-8">
        <p className="text-[0.9375rem] font-medium text-muted">Richtpreis pro Monat</p>
        <p className="mt-0.5 flex items-baseline gap-2">
          <span className="text-xl font-semibold text-muted">CHF</span>
          <AnimatedNumber value={monthly} className="text-figure font-[650] text-ink tabular" />
          <span className="sr-only">{`CHF ${formatNumber(monthly)} pro Monat`}</span>
        </p>
        <p className="mt-2 text-[0.8125rem] text-muted">
          Mit Buchhaltung, MWST, {leistungen.includes("lohn") ? "Löhnen, " : ""}Jahresabschluss und Steuererklärung. Unverbindlich.
        </p>
        <Link
          href={href}
          className="group mt-5 flex min-h-12 items-center justify-center gap-1.5 rounded-full bg-forest px-6 py-2.5 font-semibold text-white transition-colors hover:bg-forest-deep"
        >
          Genau berechnen
          <ChevronRight aria-hidden className="size-4 shrink-0 transition-transform duration-150 group-hover:translate-x-0.5" strokeWidth={2} />
        </Link>
      </div>
    </section>
  );
}
