"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { ArrowRight, Minus, Plus } from "lucide-react";
import { AnimatedNumber } from "@/components/calculators/animated-number";
import { legalForms, type LegalForm } from "@/lib/calculators/shared";
import { activeTreuhandServices, calculateTreuhand, TREUHAND_START, type TreuhandTariffs } from "@/lib/calculators/treuhand";
import { cn, formatNumber } from "@/lib/utils";

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
    "flex size-10 items-center justify-center rounded-full border border-cream/20 text-cream transition-colors hover:border-copper hover:bg-copper hover:text-forest-deep disabled:pointer-events-none disabled:opacity-35";

  return (
    <section
      aria-labelledby={`${id}-title`}
      className="relative overflow-hidden rounded-[2rem] border border-cream/12 bg-forest-deep/70 p-6 shadow-float backdrop-blur-xl sm:p-8"
    >
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-copper/60 to-transparent" />
      <p className="text-[0.6875rem] font-medium uppercase tracking-[0.24em] text-copper">Schnellrechner</p>
      <h2 id={`${id}-title`} className="mt-3 font-serif text-[1.75rem] leading-tight">
        Was kostet Ihre Buchhaltung?
      </h2>

      <fieldset className="mt-7">
        <legend className="text-sm text-cream/70">Rechtsform</legend>
        <div className="mt-2.5 grid grid-cols-3 gap-2">
          {legalForms.map((f) => (
            <label
              key={f.value}
              className="flex min-h-11 cursor-pointer items-center justify-center rounded-full border border-cream/15 px-2 text-center text-sm text-cream/85 transition-colors hover:border-copper/60 has-checked:border-copper has-checked:bg-copper has-checked:font-medium has-checked:text-forest-deep has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-copper"
            >
              <input type="radio" name={`${id}-rf`} value={f.value} checked={rechtsform === f.value} onChange={() => setRechtsform(f.value)} className="sr-only" />
              {f.short}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-6">
        <div className="flex items-baseline justify-between gap-4">
          <label htmlFor={`${id}-b`} className="text-sm text-cream/70">
            Buchungen pro Monat
          </label>
          <output htmlFor={`${id}-b`} className="font-serif text-2xl tabular">
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
          className="range range-dark mt-2"
          style={{ "--range-fill": `${fill}%` } as React.CSSProperties}
        />
        <div aria-hidden className="mt-0.5 flex justify-between text-xs text-cream/45 tabular">
          {marks.map((m) => (
            <span key={m}>{m === SLIDER_MAX ? `${m}+` : m}</span>
          ))}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        <span id={`${id}-m-label`} className="text-sm text-cream/70">
          Mitarbeitende mit Lohn
        </span>
        <div role="group" aria-labelledby={`${id}-m-label`} className="flex items-center gap-3">
          <button type="button" className={stepButton} onClick={() => setMitarbeitende((n) => Math.max(0, n - 1))} disabled={mitarbeitende <= 0} aria-label="Eine Person weniger">
            <Minus aria-hidden className="size-4" strokeWidth={1.75} />
          </button>
          <output aria-live="polite" className="w-8 text-center font-serif text-2xl tabular">
            {mitarbeitende}
          </output>
          <button type="button" className={stepButton} onClick={() => setMitarbeitende((n) => Math.min(50, n + 1))} disabled={mitarbeitende >= 50} aria-label="Eine Person mehr">
            <Plus aria-hidden className="size-4" strokeWidth={1.75} />
          </button>
        </div>
      </div>

      <div className="mt-7 border-t border-cream/10 pt-6">
        <p className="text-sm text-cream/70">Richtpreis</p>
        <p className="mt-1 flex items-baseline gap-2.5">
          <span className="text-sm font-medium tracking-[0.18em] text-copper">CHF</span>
          <AnimatedNumber value={monthly} className="font-serif text-[3.25rem] leading-none" />
          <span className="text-cream/70">pro Monat</span>
          <span className="sr-only">{`CHF ${formatNumber(monthly)} pro Monat`}</span>
        </p>
        <p className="mt-2.5 text-[0.8125rem] leading-snug text-cream/55">
          Mit Buchhaltung, MWST, {leistungen.includes("lohn") ? "Löhnen, " : ""}Jahresabschluss und Steuererklärung. Unverbindlich.
        </p>
        <Link
          href={href}
          className={cn(
            "group mt-6 flex min-h-13 items-center justify-center gap-2.5 rounded-full bg-copper px-6 py-3 font-medium text-forest-deep",
            "shadow-[inset_0_1px_0_rgb(255_255_255/0.35),0_12px_30px_-14px_rgb(211_161_124/0.75)] transition-colors duration-300 hover:bg-copper-light",
          )}
        >
          Genau berechnen
          <ArrowRight aria-hidden className="size-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.75} />
        </Link>
      </div>
    </section>
  );
}
