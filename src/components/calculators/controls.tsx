"use client";

import { useId, useState } from "react";
import { Check, ChevronDown, Minus, Plus } from "lucide-react";
import { cn, formatNumber } from "@/lib/utils";

/** Surface of a calculator step: a white card on the grey calculator section. */
export const stepCardClass = "rounded-panel bg-white p-6 sm:p-8";

/** Number, title and short text at the top of a calculator step. */
export function StepHeader({ number, title, text, titleId }: { number: number; title: string; text?: React.ReactNode; titleId?: string }) {
  return (
    <header className="flex items-start gap-4">
      <span aria-hidden className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent-soft text-[0.9375rem] font-semibold text-accent tabular">
        {number}
      </span>
      <div className="min-w-0 pt-1">
        <h2 id={titleId} className="font-sans text-h3 font-semibold">
          {title}
        </h2>
        {text ? <p className="mt-1 text-[0.9375rem] text-muted">{text}</p> : null}
      </div>
    </header>
  );
}

/** Card that groups one step of a calculator. */
export function StepCard({ number, title, text, children }: { number: number; title: string; text?: string; children: React.ReactNode }) {
  return (
    <section className={stepCardClass}>
      <StepHeader number={number} title={title} text={text} />
      <div className="mt-7 space-y-8">{children}</div>
    </section>
  );
}

/** Text, number and select fields of the calculators. */
const fieldClass =
  "rounded-field border border-field bg-white text-ink transition-[border-color,box-shadow] duration-150 hover:border-muted focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/20";

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
          "grid gap-2.5",
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
              "relative flex cursor-pointer flex-col rounded-field border border-line-strong bg-white py-3.5 pl-4 pr-9 transition-[border-color,background-color,box-shadow] duration-150",
              "hover:border-accent-line has-checked:border-accent has-checked:bg-accent-soft has-checked:shadow-[inset_0_0_0_1px_var(--color-accent)]",
              "has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-accent",
            )}
          >
            <input type="radio" name={name} value={o.value} checked={value === o.value} onChange={() => onChange(o.value)} className="peer sr-only" />
            <span className="font-medium leading-snug text-ink">{o.label}</span>
            {o.description ? <span className="mt-0.5 text-sm leading-snug text-muted">{o.description}</span> : null}
            <span
              aria-hidden
              className="absolute right-3 top-3 flex size-[1.125rem] items-center justify-center rounded-full bg-accent text-white opacity-0 transition-opacity peer-checked:opacity-100"
            >
              <Check className="size-3" strokeWidth={3} />
            </span>
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
            <span aria-hidden className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[0.8125rem] font-semibold text-muted">
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
            className={cn(fieldClass, "h-11 px-3 text-right text-xl font-semibold tabular", currency ? "w-44 pl-12" : wide ? "w-40" : "w-28")}
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
        <div aria-hidden className="mt-1 flex justify-between text-[0.8125rem] text-muted tabular">
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
    "flex size-10 items-center justify-center rounded-full bg-mist text-body transition-colors hover:bg-mist-deep hover:text-ink disabled:pointer-events-none disabled:opacity-40";
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
          <Minus aria-hidden className="size-4" strokeWidth={2} />
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
          className={cn(fieldClass, "h-11 w-[4.5rem] text-center text-xl font-semibold tabular")}
        />
        <button type="button" className={button} onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} aria-label={`${label}: mehr`}>
          <Plus aria-hidden className="size-4" strokeWidth={2} />
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
        "rounded-card border bg-white transition-colors duration-150",
        on ? "border-accent" : "border-line-strong hover:border-accent-line",
        included && "border-accent-line",
      )}
    >
      <label
        className={cn(
          "flex items-start gap-4 rounded-card p-4 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-accent sm:p-5",
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
            "mt-0.5 flex size-[1.375rem] shrink-0 items-center justify-center rounded-md border transition-colors",
            on ? "border-accent bg-accent" : "border-field bg-white",
            included && "border-accent/50 bg-accent/50",
          )}
        >
          <Check className={cn("size-3.5 text-white transition-opacity", on ? "opacity-100" : "opacity-0")} strokeWidth={3} />
        </span>
        <span className="min-w-0 flex-1">
          {/* Stacked on phones, price on the right from 640 px: the same layout for every service. */}
          <span className="flex flex-col items-start gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
            <span className="min-w-0 font-medium text-ink">{label}</span>
            {included ? (
              <span className="shrink-0 rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-semibold text-accent">inklusive</span>
            ) : price ? (
              <span className={cn("shrink-0 whitespace-nowrap text-sm tabular", checked ? "font-medium text-accent" : "text-muted")}>{price}</span>
            ) : null}
          </span>
          <span className="mt-1 block text-sm leading-snug text-muted">{included ?? description}</span>
        </span>
      </label>
      {checked && !included && children ? <div className="space-y-6 border-t border-line px-4 pb-5 pt-5 sm:px-5">{children}</div> : null}
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
          className={cn(fieldClass, "block h-12 w-full cursor-pointer appearance-none pl-4 pr-11 text-base")}
        >
          {options.map(([v, l]) => (
            <option key={v} value={v}>
              {l}
            </option>
          ))}
        </select>
        <ChevronDown aria-hidden className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-muted" strokeWidth={2} />
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
          <span aria-hidden className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted">
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
            className={cn(fieldClass, "block h-14 w-full pl-14 pr-4 text-[1.375rem] font-semibold tabular placeholder:text-hint")}
          />
        </div>
        {periods ? (
          <div role="radiogroup" aria-label={`${label}: Zeitraum`} className="flex gap-0.5 rounded-field bg-mist p-[3px]">
            {(["monat", "jahr"] as const).map((p) => (
              <label
                key={p}
                className="flex cursor-pointer items-center rounded-[0.5625rem] px-4 text-sm font-medium text-body transition-colors hover:text-ink has-checked:bg-white has-checked:font-semibold has-checked:text-ink has-checked:shadow-[0_0_0_0.5px_rgb(0_0_0/0.04),0_2px_6px_rgb(0_0_0/0.1)] has-focus-visible:outline-2 has-focus-visible:outline-offset-1 has-focus-visible:outline-accent"
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
  const cls = cn(fieldClass, "mt-2 block w-full px-4 text-base placeholder:text-hint");
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
          className={cn(cls, "resize-y py-3")}
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
          className={cn(cls, "h-12")}
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
