"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Info, Phone } from "lucide-react";
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
 * The live result of a calculator: a green card like the front of the business card, with the
 * main figure in Bodoni, the positions and totals below and the call to request an offer.
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
      <div className="on-dark grain relative isolate overflow-hidden rounded-[1.75rem] bg-forest text-cream shadow-lift lg:shadow-none">
        <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(120%_70%_at_100%_0%,#2a4d3c_0%,transparent_60%)]" />
        <svg aria-hidden viewBox="0 0 400 600" preserveAspectRatio="xMaxYMin slice" className="pointer-events-none absolute inset-0 -z-10 h-full w-full">
          <defs>
            <linearGradient id={`${id}-line`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#d3a17c" stopOpacity="0.55" />
              <stop offset="1" stopColor="#d3a17c" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Parallel to the thick stroke of the logo's A, like the facet on the business card. */}
          <line x1="338" y1="0" x2="400" y2="179" stroke={`url(#${id}-line)`} strokeWidth="1" vectorEffect="non-scaling-stroke" />
        </svg>

        <div className="p-7 sm:p-8">
          <h2 id={`${id}-title`} className="eyebrow">
            {eyebrow}
          </h2>
          <p className="mt-6 flex items-baseline gap-3">
            <span className="text-sm font-medium tracking-[0.18em] text-copper">CHF</span>
            <AnimatedNumber value={amount} className="font-serif text-numeral text-cream" />
            <span className="sr-only">{`CHF ${formatNumber(amount)} ${suffix}`}</span>
          </p>
          <p className="mt-2 text-cream/70">{suffix}</p>
          {range ? (
            <p className="mt-4 inline-flex items-center rounded-full border border-copper/35 px-3.5 py-1 text-sm text-cream/80 tabular">Bandbreite {range}</p>
          ) : null}
          <p aria-live="polite" className="sr-only">
            {announcement}
          </p>

          <a
            href="#offerte"
            className="group mt-7 flex min-h-14 items-center justify-center gap-2.5 rounded-full bg-copper px-7 py-3 font-medium text-forest-deep shadow-[inset_0_1px_0_rgb(255_255_255/0.35),0_12px_30px_-14px_rgb(211_161_124/0.75)] transition-colors duration-300 hover:bg-copper-light"
          >
            Offerte anfordern
            <ArrowRight aria-hidden className="size-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.75} />
          </a>

          <div aria-hidden className="mt-7 h-px bg-gradient-to-r from-copper/70 via-copper/25 to-transparent" />

          {empty ? (
            <p className="mt-6 text-cream/70">{empty}</p>
          ) : (
            <div className="mt-2 space-y-5">
              {groups.map((group, gi) =>
                group.lines.length === 0 ? null : (
                  <div key={group.title ?? gi}>
                    {group.title ? (
                      <div className="mt-5 flex items-baseline justify-between gap-4 border-b border-cream/10 pb-2">
                        <h3 className="min-w-0 text-xs font-medium uppercase leading-relaxed tracking-[0.2em] text-copper">{group.title}</h3>
                        {group.subtotal ? <span className="shrink-0 whitespace-nowrap text-sm text-cream/85 tabular">{group.subtotal}</span> : null}
                      </div>
                    ) : null}
                    <ul className="divide-y divide-cream/10">
                      {group.lines.map((line) => (
                        <li key={line.key} className="flex items-start justify-between gap-4 py-2.5">
                          <span className="min-w-0">
                            <span className={cn("block leading-snug", line.muted ? "text-cream/60" : "text-cream")}>{line.label}</span>
                            {line.detail ? <span className="mt-0.5 block text-[0.8125rem] leading-snug text-cream/55">{line.detail}</span> : null}
                          </span>
                          <span className={cn("shrink-0 whitespace-nowrap text-right tabular", line.muted ? "text-sm text-copper/90" : "text-cream")}>{line.amount}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ),
              )}
            </div>
          )}

          {totals.length > 0 ? (
            <dl className="mt-4 space-y-2 rounded-2xl bg-forest-deep/60 px-5 py-4">
              {totals.map((t) => (
                <div key={t.label} className="flex items-baseline justify-between gap-4">
                  <dt className="text-sm text-cream/70">{t.label}</dt>
                  <dd className="font-medium text-cream tabular">{t.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}

          {warnings.length > 0 ? (
            <ul className="mt-5 space-y-2">
              {warnings.map((w) => (
                <li key={w} className="flex gap-2.5 rounded-xl border border-copper/30 bg-copper/[0.08] px-4 py-3 text-sm leading-snug text-cream/85">
                  <Info aria-hidden className="mt-0.5 size-4 shrink-0 text-copper" strokeWidth={1.75} />
                  {w}
                </li>
              ))}
            </ul>
          ) : null}

          <p className="mt-5 text-[0.8125rem] leading-relaxed text-cream/60">{note}</p>

          {phone ? (
            <a href={phone.href} className="mt-5 inline-flex items-center gap-2 text-sm text-cream/75 transition-colors hover:text-copper">
              <Phone aria-hidden className="size-3.5" strokeWidth={1.75} />
              Lieber persönlich? <span className="tabular">{phone.label}</span>
            </a>
          ) : null}
        </div>
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
      <div className="on-dark flex items-center justify-between gap-4 rounded-2xl border border-cream/10 bg-forest-deep/95 py-3 pl-5 pr-3 text-cream shadow-float backdrop-blur-md">
        <p className="min-w-0 leading-tight">
          <span className="block text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-copper">{label}</span>
          <span className="mt-1 flex items-baseline gap-1.5">
            <span className="text-xs text-cream/70">CHF</span>
            <AnimatedNumber value={amount} className="font-serif text-2xl" />
            <span className="sr-only">{`CHF ${formatNumber(amount)}`}</span>
            <span className="truncate text-xs text-cream/70">{suffix}</span>
          </span>
        </p>
        <a
          href="#rechner-resultat"
          className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full bg-copper px-5 text-sm font-medium text-forest-deep transition-colors hover:bg-copper-light"
        >
          Details
          <ArrowRight aria-hidden className="size-4" strokeWidth={1.75} />
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
          <div className="lg:sticky lg:top-28 lg:max-h-[calc(100dvh-8rem)] lg:overflow-y-auto lg:overscroll-contain lg:rounded-[1.75rem] lg:[scrollbar-width:thin]">
            {result}
          </div>
        </div>
        <div className="min-w-0 lg:col-span-7">{form}</div>
      </div>
      {bar}
    </>
  );
}
