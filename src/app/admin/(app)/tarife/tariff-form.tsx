"use client";

import { ActionForm, inputClass, useFieldError } from "@/components/admin/form";
import type { ActionState } from "@/lib/admin/forms";
import { groupFields, limitsOf, type TariffField } from "@/lib/calculators/shared";
import { cn, formatNumber } from "@/lib/utils";

type Value = number | boolean | string;

/** A value as the website shows it, for the "Standard:" hint. */
function shown(field: TariffField, value: Value): string {
  if (field.type === "boolean") return value ? "angeboten" : "nicht angeboten";
  if (field.type === "text") return String(value) || "leer";
  const n = Number(value);
  if (field.type === "chf") return `CHF ${Number.isInteger(n) ? formatNumber(n) : n.toFixed(2)}`;
  const { decimals } = limitsOf(field);
  const number = decimals > 0 && !Number.isInteger(n) ? n.toFixed(decimals).replace(/0+$/, "") : formatNumber(n);
  if (field.type === "percent") return `${number} %`;
  return number;
}

/** The value in the input: amounts with Rappen always with two decimals (2.40). */
function inputValue(field: TariffField, value: Value): string {
  const n = Number(value);
  return field.type === "chf" && !Number.isInteger(n) ? n.toFixed(2) : String(value);
}

function groupId(group: string): string {
  return `gruppe-${group.toLowerCase().replace(/[^a-z0-9äöü]+/g, "-")}`;
}

function NumberInput({ field, value }: { field: TariffField; value: Value }) {
  const error = useFieldError(field.key);
  const id = `t-${field.key}`;
  const { decimals } = limitsOf(field);
  const changed = value !== field.default;
  const describedBy = [field.help ? `${id}-help` : null, changed ? `${id}-default` : null, error ? `${id}-error` : null].filter(Boolean).join(" ");
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-ink">
        {field.label}
      </label>
      <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
        <div className="relative w-40">
          {field.type === "chf" ? (
            <span aria-hidden className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-medium tracking-[0.12em] text-muted">
              CHF
            </span>
          ) : null}
          <input
            id={id}
            name={field.key}
            type="text"
            inputMode={decimals > 0 ? "decimal" : "numeric"}
            autoComplete="off"
            defaultValue={inputValue(field, value)}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy || undefined}
            className={cn(inputClass, "text-right tabular", field.type === "chf" && "pl-12")}
          />
        </div>
        {field.unit || field.type === "percent" ? <span className="text-sm text-muted">{field.unit ?? "%"}</span> : null}
      </div>
      {field.help ? (
        <p id={`${id}-help`} className="mt-1.5 text-[0.8125rem] leading-relaxed text-muted">
          {field.help}
        </p>
      ) : null}
      {changed ? (
        <p id={`${id}-default`} className="mt-1 text-[0.8125rem] text-bronze">
          Standard: {shown(field, field.default)}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-[0.8125rem] font-medium text-red-700">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function BooleanInput({ field, value }: { field: TariffField; value: Value }) {
  const id = `t-${field.key}`;
  return (
    <div className="sm:col-span-2">
      <label htmlFor={id} className="flex cursor-pointer items-start gap-3">
        <input id={id} name={field.key} type="checkbox" defaultChecked={Boolean(value)} className="mt-1 size-4 shrink-0 accent-forest" />
        <span>
          <span className="block text-sm font-medium text-ink">{field.label}</span>
          {field.help ? <span className="mt-0.5 block text-[0.8125rem] leading-relaxed text-muted">{field.help}</span> : null}
        </span>
      </label>
    </div>
  );
}

function TextInput({ field, value }: { field: TariffField; value: Value }) {
  const error = useFieldError(field.key);
  const id = `t-${field.key}`;
  return (
    <div className="sm:col-span-2">
      <label htmlFor={id} className="block text-sm font-medium text-ink">
        {field.label}
      </label>
      <textarea
        id={id}
        name={field.key}
        rows={3}
        maxLength={field.maxLength}
        defaultValue={String(value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={field.help ? `${id}-help` : undefined}
        className={cn(inputClass, "mt-1.5 resize-y")}
      />
      {field.help ? (
        <p id={`${id}-help`} className="mt-1.5 text-[0.8125rem] leading-relaxed text-muted">
          {field.help}
        </p>
      ) : null}
      {error ? <p className="mt-1.5 text-[0.8125rem] font-medium text-red-700">{error}</p> : null}
    </div>
  );
}

/** All tariffs of one calculator, grouped as in the code, with a jump list on wide screens. */
export function TariffForm({
  action,
  fields,
  values,
}: {
  action: (prev: ActionState, data: FormData) => Promise<ActionState>;
  fields: readonly TariffField[];
  values: Record<string, Value>;
}) {
  const groups = groupFields(fields);
  return (
    <div className="grid gap-8 lg:grid-cols-[14rem_1fr]">
      <nav aria-label="Abschnitte" className="hidden lg:block">
        <ul className="sticky top-6 space-y-1 text-sm">
          {groups.map((g) => (
            <li key={g.group}>
              <a href={`#${groupId(g.group)}`} className="block rounded-lg px-3 py-1.5 text-muted transition-colors hover:bg-white hover:text-ink">
                {g.group}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <div className="min-w-0 rounded-2xl border border-line bg-white px-5 pb-6 sm:px-6">
        <ActionForm action={action} submitLabel="Tarife speichern" stickySubmit className="space-y-10">
          {groups.map((g) => (
            <fieldset key={g.group} id={groupId(g.group)} className="scroll-mt-24">
              <legend className="font-serif text-[1.375rem] leading-tight text-ink">{g.group}</legend>
              <div className="mt-5 grid gap-x-8 gap-y-6 sm:grid-cols-2">
                {g.fields.map((field) => {
                  const value = values[field.key] ?? field.default;
                  if (field.type === "boolean") return <BooleanInput key={field.key} field={field} value={value} />;
                  if (field.type === "text") return <TextInput key={field.key} field={field} value={value} />;
                  return <NumberInput key={field.key} field={field} value={value} />;
                })}
              </div>
            </fieldset>
          ))}
        </ActionForm>
      </div>
    </div>
  );
}
