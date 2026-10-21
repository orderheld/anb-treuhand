"use client";

import { useEffect, useState } from "react";
import { ChevronRight, Info, Phone } from "lucide-react";
import { cn, formatNumber } from "@/lib/utils";
import { AnimatedNumber } from "./animated-number";

export interface ResultLine {
  key: string;
  label: string;
  detail?: string;
  /** Formatted amount, e.g. "CHF 235" or "inklusive". */
  amount: string;
  /** Included or informational positions are shown lighter. */
  muted?: boolean;
}

export interface ResultGroup {
  title?: string;
  /** Formatted subtotal next to the group title. */
  subtotal?: string;
  lines: ResultLine[];
}

/** A value that follows `value` after `delay` ms without changes (for screen reader announcements). */
function useDebounced<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

/**
 * The live result of a calculator: a white card with the main figure, the call to request an
 * offer and the positions and totals below.
 */
export function ResultPanel({
  id = "rechner-resultat",
  eyebrow = "Ihr Richtpreis",
  amount,
  suffix,
  range,
  groups,
  totals = [],
  warnings = [],
  note,
  phone,
  empty,
}: {
  id?: string;
  eyebrow?: string;
  amount: number;
  /** "pro Monat", "einmalig" … */
  suffix: string;
  /** Formatted range, e.g. "CHF 560 bis 690". */
  range?: string | null;
  groups: ResultGroup[];
  totals?: { label: string; value: string }[];
  warnings?: string[];
  /** Hint of the tariffs and the VAT sentence. */
  note: string;
  phone?: { label: string; href: string } | null;
  /** Shown instead of the positions while nothing is selected. */
  empty?: string | null;
}) {
  const spoken = `${eyebrow}: CHF ${formatNumber(amount)} ${suffix}`;
  const announcement = useDebounced(spoken, 900);
  return (
    <section id={id} aria-labelledby={`${id}-title`} tabIndex={-1} className="scroll-mt-28 focus:outline-none">
      <div className="rounded-panel bg-white p-6 sm:p-8">
        <h2 id={`${id}-title`} className="kicker font-sans">
          {eyebrow}
        </h2>
        <p className="mt-2 flex items-baseline gap-2">
          <span className="text-xl font-semibold text-muted">CHF</span>
          <AnimatedNumber value={amount} className="text-figure font-[650] text-ink tabular" />
          <span className="sr-only">{`CHF ${formatNumber(amount)} ${suffix}`}</span>
        </p>
        <p className="mt-1 text-body">{suffix}</p>
        {range ? <p className="mt-3 inline-flex items-center rounded-full bg-mist px-3 py-1 text-sm text-body tabular">Bandbreite {range}</p> : null}
        <p aria-live="polite" className="sr-only">
          {announcement}
        </p>

        <a
          href="#offerte"
          className="group mt-6 flex min-h-[3.125rem] items-center justify-center gap-1.5 rounded-full bg-forest px-6 py-2.5 text-[1.0625rem] font-semibold text-white transition-colors duration-150 hover:bg-forest-deep"
        >
          Offerte anfordern
          <ChevronRight aria-hidden className="size-4 shrink-0 transition-transform duration-150 group-hover:translate-x-0.5" strokeWidth={2} />
        </a>

        {empty ? (
          <p className="mt-6 border-t border-line pt-6 text-body">{empty}</p>
        ) : (
          <div className="mt-6 border-t border-line">
            {groups.map((group, gi) =>
              group.lines.length === 0 ? null : (
                <div key={group.title ?? gi}>
                  {group.title ? (
                    <div className="mt-5 flex items-baseline justify-between gap-4">
                      <h3 className="min-w-0 font-sans text-sm font-semibold text-accent">{group.title}</h3>
                      {group.subtotal ? <span className="shrink-0 whitespace-nowrap text-sm font-medium text-body tabular">{group.subtotal}</span> : null}
                    </div>
                  ) : null}
                  <ul className="divide-y divide-line">
                    {group.lines.map((line) => (
                      <li key={line.key} className="flex items-start justify-between gap-4 py-2.5">
                        <span className="min-w-0">
                          <span className={cn("block leading-snug", line.muted ? "text-muted" : "text-ink")}>{line.label}</span>
                          {line.detail ? <span className="mt-0.5 block text-[0.8125rem] leading-snug text-muted">{line.detail}</span> : null}
                        </span>
                        <span className={cn("shrink-0 whitespace-nowrap text-right tabular", line.muted ? "text-sm text-muted" : "font-medium text-ink")}>{line.amount}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ),
            )}
          </div>
        )}

        {totals.length > 0 ? (
          <dl className="mt-4 space-y-2 rounded-card bg-mist px-5 py-4">
            {totals.map((t) => (
              <div key={t.label} className="flex items-baseline justify-between gap-4">
                <dt className="text-sm text-body">{t.label}</dt>
                <dd className="font-semibold text-ink tabular">{t.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}

        {warnings.length > 0 ? (
          <ul className="mt-5 space-y-2">
            {warnings.map((w) => (
              <li key={w} className="flex gap-2.5 rounded-field border border-warn-line bg-warn-soft px-4 py-3 text-sm leading-snug text-body">
                <Info aria-hidden className="mt-0.5 size-4 shrink-0 text-warn" strokeWidth={2} />
                {w}
              </li>
            ))}
          </ul>
        ) : null}

        <p className="mt-5 text-[0.8125rem] leading-relaxed text-muted">{note}</p>

        {phone ? (
          <a href={phone.href} className="mt-4 inline-flex items-center gap-2 text-sm text-body transition-colors hover:text-accent">
            <Phone aria-hidden className="size-3.5 text-accent" strokeWidth={2} />
            Lieber persönlich? <span className="font-medium tabular">{phone.label}</span>
          </a>
        ) : null}
      </div>
    </section>
  );
}

/**
 * Small result bar at the bottom of the screen on phones, while the visitor fills in the steps.
 * It hides as soon as the full result or the offer form is on screen.
 */
export function MobileResultBar({ label, amount, suffix }: { label: string; amount: number; suffix: string }) {
  const [state, setState] = useState({ steps: false, covered: false });

  useEffect(() => {
    const steps = document.getElementById("rechner-schritte");
    const covers = ["rechner-resultat", "offerte"].map((id) => document.getElementById(id)).filter((el): el is HTMLElement => el !== null);
    if (!steps) return;
    const visible = new Set<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target);
          else visible.delete(entry.target);
        }
        setState({ steps: visible.has(steps), covered: covers.some((el) => visible.has(el)) });
      },
      { rootMargin: "0px 0px -15% 0px" },
    );
    observer.observe(steps);
    covers.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const shown = state.steps && !state.covered;
  return (
    <div
      inert={!shown}
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] transition-[translate,opacity] duration-500 ease-out-soft lg:hidden",
        shown ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0",
      )}
    >
      <div className="flex items-center justify-between gap-4 rounded-card border border-line bg-white/95 py-3 pl-5 pr-3 shadow-lift backdrop-blur-md">
        <p className="min-w-0 leading-tight">
          <span className="block text-[0.8125rem] font-medium text-muted">{label}</span>
          <span className="mt-0.5 flex items-baseline gap-1.5">
            <span className="text-sm font-semibold text-muted">CHF</span>
            <AnimatedNumber value={amount} className="text-2xl font-[650] text-ink tabular" />
            <span className="sr-only">{`CHF ${formatNumber(amount)}`}</span>
            <span className="truncate text-[0.8125rem] text-muted">{suffix}</span>
          </span>
        </p>
        <a
          href="#rechner-resultat"
          className="inline-flex min-h-11 shrink-0 items-center gap-1 rounded-full bg-forest pl-5 pr-4 text-sm font-semibold text-white transition-colors hover:bg-forest-deep"
        >
          Details
          <ChevronRight aria-hidden className="size-4" strokeWidth={2} />
        </a>
      </div>
    </div>
  );
}

/** Steps on the left, the result sticky on the right; on phones: steps, result, offer form. */
export function CalculatorLayout({ steps, result, form, bar }: { steps: React.ReactNode; result: React.ReactNode; form: React.ReactNode; bar?: React.ReactNode }) {
  return (
    <>
      <div className="grid gap-6 lg:grid-cols-12 lg:gap-x-10 lg:gap-y-6">
        <div id="rechner-schritte" className="min-w-0 scroll-mt-28 space-y-6 lg:col-span-7">
          {steps}
        </div>
        <div className="min-w-0 lg:col-span-5 lg:col-start-8 lg:row-span-2 lg:row-start-1">
          <div className="lg:sticky lg:top-28 lg:max-h-[calc(100dvh-8rem)] lg:overflow-y-auto lg:overscroll-contain lg:rounded-panel lg:[scrollbar-width:thin]">
            {result}
          </div>
        </div>
        <div className="min-w-0 lg:col-span-7">{form}</div>
      </div>
      {bar}
    </>
  );
}
