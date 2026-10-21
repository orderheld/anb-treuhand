"use client";

import { useId, useState } from "react";
import { Check, ChevronDown, Minus, Plus } from "lucide-react";
import { cn, formatNumber } from "@/lib/utils";

/** Card that groups one step of a calculator. */
export function StepCard({ number, title, text, children }: { number: number; title: string; text?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[1.75rem] border border-sand/80 bg-white p-6 shadow-card sm:p-8">
      <header className="flex items-start gap-4">
        <span aria-hidden className="mt-1 font-serif text-2xl leading-none text-copper">
          {String(number).padStart(2, "0")}
        </span>
        <div>
          <h2 className="font-serif text-[1.625rem] leading-tight text-ink">{title}</h2>
          {text ? <p className="mt-1.5 text-[0.9375rem] text-muted">{text}</p> : null}
        </div>
      </header>
      <div className="mt-7 space-y-8">{children}</div>
    </section>
  );
}

interface Option<V extends string> {
  value: V;
  label: string;
  description?: string;
}

/** Single choice as a row of cards (native radios, keyboard: arrow keys). */
export function Segmented<V extends string>({
  legend,
  name,
  options,
  value,
  onChange,
  columns = 3,
  mobileColumns = 1,
  hideLegend = false,
}: {
  legend: string;
  name: string;
  options: readonly Option<V>[];
  value: V;
  onChange: (value: V) => void;
  columns?: 2 | 3 | 4;
  /** Columns below 640 px; two suit short labels without description. */
  mobileColumns?: 1 | 2;
  hideLegend?: boolean;
}) {
  return (
    <fieldset>
      <legend className={cn("mb-3 text-[0.9375rem] font-medium text-ink", hideLegend && "sr-only")}>{legend}</legend>
      <div
        className={cn(
          "grid gap-3",
          mobileColumns === 2 && "grid-cols-2",
          columns === 2 && "sm:grid-cols-2",
          columns === 3 && "sm:grid-cols-3",
          columns === 4 && "sm:grid-cols-4",
        )}
      >
        {options.map((o) => (
          <label
            key={o.value}
            className={cn(
              "relative flex cursor-pointer flex-col rounded-2xl border border-sand bg-cream/40 px-4 py-3.5 transition-all duration-300",
              "hover:border-forest/40 has-checked:border-forest has-checked:bg-forest has-checked:text-cream has-checked:shadow-[0_12px_24px_-16px_rgb(20_42_31/0.9)]",
              "has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-forest",
            )}
          >
            <input type="radio" name={name} value={o.value} checked={value === o.value} onChange={() => onChange(o.value)} className="peer sr-only" />
            <span className="font-medium leading-snug">{o.label}</span>
            {o.description ? <span className="mt-0.5 text-sm leading-snug text-muted peer-checked:text-cream/70">{o.description}</span> : null}
            <Check aria-hidden className="absolute right-3 top-3 size-4 text-copper opacity-0 transition-opacity peer-checked:opacity-100" strokeWidth={2} />
          </label>
        ))}
      </div>
    </fieldset>
  );
}

/** Slider with an exact number field beside it. The field accepts values above the slider range. */
export function SliderField({
  label,
  hint,
  value,
  onChange,
  min,
  max,
  sliderMax,
  step = 1,
  unit,
  currency = false,
  marks,
}: {
  label: string;
  hint?: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  /** Upper end of the slider; larger values can be typed. */
  sliderMax: number;
  step?: number;
  unit?: string;
  /** Shows "CHF" inside the field, as in the amount fields. */
  currency?: boolean;
  marks?: number[];
}) {
  const id = useId();
  const [draft, setDraft] = useState<string | null>(null);
  const clamped = Math.min(value, sliderMax);
  const fill = ((clamped - min) / (sliderMax - min)) * 100;
  const wide = sliderMax >= 100_000;
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-2">
        <label htmlFor={`${id}-number`} className="text-[0.9375rem] font-medium text-ink">
          {label}
          {currency ? <span className="sr-only"> in CHF</span> : null}
        </label>
        <div className="relative flex items-baseline gap-2">
          {currency ? (
            <span aria-hidden className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-medium tracking-[0.12em] text-muted">
              CHF
            </span>
          ) : null}
          {/* Text rather than number, so amounts show with thousands separators once the field loses focus. */}
          <input
            id={`${id}-number`}
            type="text"
            inputMode="numeric"
            autoComplete="off"
            value={draft ?? formatNumber(value)}
            onFocus={() => setDraft(String(value))}
            onBlur={() => setDraft(null)}
            onChange={(e) => {
              setDraft(e.target.value);
              const n = Number(e.target.value.replace(/['’\s]/g, ""));
              if (e.target.value.trim() !== "" && Number.isFinite(n)) onChange(Math.max(min, Math.min(max, Math.round(n))));
            }}
            aria-describedby={hint ? `${id}-hint` : undefined}
            className={cn(
              "rounded-xl border border-field bg-white px-3 py-1.5 text-right font-serif text-2xl text-ink tabular transition-[border-color,box-shadow] hover:border-forest/70 focus:border-forest focus:outline-none focus:ring-4 focus:ring-forest/10",
              currency ? "w-44 pl-12" : wide ? "w-40" : "w-28",
            )}
          />
          {unit ? <span className="text-sm text-muted">{unit}</span> : null}
        </div>
      </div>
      <input
        type="range"
        aria-label={label}
        min={min}
        max={sliderMax}
        step={step}
        value={clamped}
        onChange={(e) => onChange(Number(e.target.value))}
        className="range mt-3"
        style={{ "--range-fill": `${fill}%` } as React.CSSProperties}
      />
      {marks ? (
        <div aria-hidden className="mt-1 flex justify-between text-xs text-muted tabular">
          {marks.map((m) => (
            <span key={m}>{m === sliderMax ? `${formatNumber(m)}+` : formatNumber(m)}</span>
          ))}
        </div>
      ) : null}
      {hint ? (
        <p id={`${id}-hint`} className="mt-3 text-sm text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

/** Small whole numbers with minus and plus buttons. */
export function Stepper({
  label,
  hint,
  value,
  onChange,
  min,
  max,
  unit,
}: {
  label: string;
  hint?: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  unit?: string;
}) {
  const id = useId();
  const button =
    "flex size-11 items-center justify-center rounded-full border border-field bg-white text-forest transition-colors hover:border-forest hover:bg-forest hover:text-cream disabled:pointer-events-none disabled:opacity-40";
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <label htmlFor={id} className="text-[0.9375rem] font-medium text-ink">
          {label}
        </label>
        {hint ? (
          <p id={`${id}-hint`} className="mt-0.5 text-sm text-muted">
            {hint}
          </p>
        ) : null}
      </div>
      <div className="flex items-center gap-2">
        <button type="button" className={button} onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} aria-label={`${label}: weniger`}>
          <Minus aria-hidden className="size-4" strokeWidth={1.75} />
        </button>
        <input
          id={id}
          type="number"
          inputMode="numeric"
          min={min}
          max={max}
          value={value}
          onChange={(e) => {
            const n = Number(e.target.value);
            onChange(Number.isFinite(n) ? Math.max(min, Math.min(max, Math.round(n))) : min);
          }}
          aria-describedby={hint ? `${id}-hint` : undefined}
          className="w-[4.5rem] rounded-xl border border-field bg-white py-1.5 text-center font-serif text-2xl text-ink tabular transition-[border-color,box-shadow] hover:border-forest/70 focus:border-forest focus:outline-none focus:ring-4 focus:ring-forest/10"
        />
        <button type="button" className={button} onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} aria-label={`${label}: mehr`}>
          <Plus aria-hidden className="size-4" strokeWidth={1.75} />
        </button>
        {unit ? <span className="ml-1 text-sm text-muted">{unit}</span> : null}
      </div>
    </div>
  );
}

/** A service that can be switched on and off, with its share of the price. */
export function ServiceToggle({
  label,
  description,
  checked,
  onChange,
  price,
  included,
  children,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** E.g. "CHF 235 / Mt." or "+ CHF 75 / Mt." for a service not yet selected. */
  price?: string | null;
  /** Part of another selected service: shown as selected, cannot be switched off. */
  included?: string | null;
  /** Extra options shown while the service is selected. */
  children?: React.ReactNode;
}) {
  const on = checked || Boolean(included);
  return (
    <div
      className={cn(
        "rounded-2xl border transition-all duration-300",
        on ? "border-forest/60 bg-cream/60 shadow-[inset_0_0_0_1px_rgb(28_56_42/0.35)]" : "border-sand bg-white hover:border-forest/30",
        included && "border-forest/25 bg-cream/40 shadow-none",
      )}
    >
      <label
        className={cn(
          "flex items-start gap-4 p-4 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-forest sm:p-5",
          included ? "cursor-default" : "cursor-pointer",
        )}
      >
        <input
          type="checkbox"
          checked={on}
          disabled={Boolean(included)}
          onChange={(e) => onChange(e.target.checked)}
          className="peer sr-only"
        />
        <span
          aria-hidden
          className={cn(
            "mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md border transition-colors",
            on ? "border-forest bg-forest" : "border-field bg-white",
            included && "border-forest/50 bg-forest/70",
          )}
        >
          <Check className={cn("size-4 text-copper transition-opacity", on ? "opacity-100" : "opacity-0")} strokeWidth={2.25} />
        </span>
        <span className="min-w-0 flex-1">
          {/* Stacked on phones, price on the right from 640 px: the same layout for every service. */}
          <span className="flex flex-col items-start gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
            <span className="min-w-0 font-medium text-ink">{label}</span>
            {included ? (
              <span className="shrink-0 rounded-full bg-forest/[0.07] px-2.5 py-0.5 text-xs font-medium tracking-wide text-forest">inklusive</span>
            ) : price ? (
              <span className={cn("shrink-0 whitespace-nowrap text-sm tabular", checked ? "text-bronze" : "text-muted")}>{price}</span>
            ) : null}
          </span>
          <span className="mt-1 block text-sm leading-snug text-muted">{included ?? description}</span>
        </span>
      </label>
      {checked && !included && children ? <div className="space-y-6 border-t border-sand/80 px-4 pb-5 pt-5 sm:px-5">{children}</div> : null}
    </div>
  );
}

/** Native select in the style of the text inputs (canton). */
export function SelectField({
  label,
  value,
  onChange,
  options,
  hint,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly (readonly [string, string])[];
  hint?: string;
}) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="text-[0.9375rem] font-medium text-ink">
        {label}
      </label>
      <div className="relative mt-2">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-describedby={hint ? `${id}-hint` : undefined}
          className="block w-full cursor-pointer appearance-none rounded-xl border border-field bg-white py-3 pl-4 pr-11 text-base text-ink transition-[border-color,box-shadow] hover:border-forest/70 focus:border-forest focus:outline-none focus:ring-4 focus:ring-forest/10"
        >
          {options.map(([v, l]) => (
            <option key={v} value={v}>
              {l}
            </option>
          ))}
        </select>
        <ChevronDown aria-hidden className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-forest" strokeWidth={1.75} />
      </div>
      {hint ? (
        <p id={`${id}-hint`} className="mt-2 text-sm text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

/**
 * A franc amount (rent, sale price, construction costs). Typed with or without apostrophes;
 * shown with thousands separators once the field loses focus.
 */
export function AmountField({
  label,
  hint,
  value,
  onChange,
  max = 500_000_000,
  periods,
}: {
  label: string;
  hint?: string;
  value: number;
  onChange: (value: number) => void;
  max?: number;
  /** Optional switch between monthly and yearly amounts. */
  periods?: { value: "monat" | "jahr"; onChange: (value: "monat" | "jahr") => void };
}) {
  const id = useId();
  const [draft, setDraft] = useState<string | null>(null);
  const shown = draft ?? (value > 0 ? formatNumber(value) : "");
  return (
    <div>
      <label htmlFor={id} className="text-[0.9375rem] font-medium text-ink">
        {label}
      </label>
      <div className="mt-2 flex flex-wrap items-stretch gap-3">
        <div className="relative min-w-0 flex-1 basis-48">
          <span aria-hidden className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium tracking-[0.12em] text-muted">
            CHF
          </span>
          <input
            id={id}
            type="text"
            inputMode="numeric"
            autoComplete="off"
            value={shown}
            placeholder="0"
            onFocus={() => setDraft(value > 0 ? String(value) : "")}
            onBlur={() => setDraft(null)}
            onChange={(e) => {
              setDraft(e.target.value);
              const n = Number(e.target.value.replace(/['’\s]/g, "").replace(",", "."));
              onChange(Number.isFinite(n) && n > 0 ? Math.min(max, Math.round(n)) : 0);
            }}
            aria-describedby={hint ? `${id}-hint` : undefined}
            className="block w-full rounded-xl border border-field bg-white py-3 pl-14 pr-4 font-serif text-2xl text-ink tabular transition-[border-color,box-shadow] placeholder:text-hint hover:border-forest/70 focus:border-forest focus:outline-none focus:ring-4 focus:ring-forest/10"
          />
        </div>
        {periods ? (
          <div role="radiogroup" aria-label={`${label}: Zeitraum`} className="flex rounded-xl border border-field bg-white p-1">
            {(["monat", "jahr"] as const).map((p) => (
              <label
                key={p}
                className="flex cursor-pointer items-center rounded-lg px-4 text-sm text-ink transition-colors has-checked:bg-forest has-checked:text-cream has-focus-visible:outline-2 has-focus-visible:outline-offset-1 has-focus-visible:outline-forest"
              >
                <input type="radio" name={`${id}-period`} checked={periods.value === p} onChange={() => periods.onChange(p)} className="sr-only" />
                {p === "monat" ? "pro Monat" : "pro Jahr"}
              </label>
            ))}
          </div>
        ) : null}
      </div>
      {hint ? (
        <p id={`${id}-hint`} className="mt-2 text-sm text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

/** Labelled text input used by the founding calculator (company name, seat). */
export function TextInput({
  label,
  value,
  onChange,
  placeholder,
  hint,
  optional,
  maxLength,
  multiline,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  hint?: string;
  optional?: boolean;
  maxLength?: number;
  multiline?: boolean;
  autoComplete?: string;
}) {
  const id = useId();
  const cls =
    "mt-2 block w-full rounded-xl border border-field bg-white px-4 py-3 text-base text-ink placeholder:text-hint transition-[border-color,box-shadow] hover:border-forest/70 focus:border-forest focus:outline-none focus:ring-4 focus:ring-forest/10";
  return (
    <div>
      <label htmlFor={id} className="text-[0.9375rem] font-medium text-ink">
        {label}
        {optional ? <span className="font-normal text-muted"> (optional)</span> : null}
      </label>
      {multiline ? (
        <textarea
          id={id}
          rows={3}
          value={value}
          maxLength={maxLength}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          aria-describedby={hint ? `${id}-hint` : undefined}
          className={cn(cls, "resize-y")}
        />
      ) : (
        <input
          id={id}
          type="text"
          value={value}
          maxLength={maxLength}
          placeholder={placeholder}
          autoComplete={autoComplete}
          onChange={(e) => onChange(e.target.value)}
          aria-describedby={hint ? `${id}-hint` : undefined}
          className={cls}
        />
      )}
      {hint ? (
        <p id={`${id}-hint`} className="mt-2 text-sm text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
