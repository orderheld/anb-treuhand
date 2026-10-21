import Link from "next/link";
import { AlertCircle, Check, Loader2 } from "lucide-react";
import { buttonClasses } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Form controls of the contact and offer forms. */

export const inputClass =
  "block min-h-12 w-full rounded-field border border-field bg-white px-4 py-2.5 text-base text-ink transition-[border-color,box-shadow] duration-150 placeholder:text-hint hover:border-muted focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/20 aria-[invalid=true]:border-danger aria-[invalid=true]:focus:ring-danger/15";

export interface ControlProps {
  id: string;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
  required?: boolean;
}

function Marker({ required, optional }: { required?: boolean; optional?: boolean }) {
  if (required) return <span aria-hidden className="text-accent">{"\u00a0*"}</span>;
  if (optional) return <span className="font-normal text-muted"> (optional)</span>;
  return null;
}

export function Field({
  id,
  label,
  required,
  optional,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  optional?: boolean;
  hint?: string;
  error?: string;
  children: (props: ControlProps) => React.ReactNode;
}) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-[0.9375rem] font-medium text-ink">
        {label}
        <Marker required={required} optional={optional} />
      </label>
      {children({ id, required, "aria-invalid": error ? true : undefined, "aria-describedby": describedBy })}
      {hint ? (
        <p id={hintId} className="mt-2 text-sm text-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="mt-2 flex items-start gap-1.5 text-sm text-danger">
          <AlertCircle aria-hidden className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
          {error}
        </p>
      ) : null}
    </div>
  );
}

/** Invisible for people, bots tend to fill it. */
export function Honeypot() {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden">
      <label htmlFor="website">Website (bitte leer lassen)</label>
      <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
    </div>
  );
}

interface ChoiceOption {
  value: string;
  label: string;
}

/** Single choice as pills (native radios, so it works without JavaScript). */
export function ChoiceChips({
  name,
  legend,
  options,
  defaultValue,
  required,
  optional,
  hint,
  error,
}: {
  /** Field name; also the id the error summary links to. */
  name: string;
  legend: string;
  options: readonly ChoiceOption[];
  defaultValue?: string;
  required?: boolean;
  optional?: boolean;
  hint?: string;
  error?: string;
}) {
  const hintId = hint ? `${name}-hint` : undefined;
  const errorId = error ? `${name}-error` : undefined;
  return (
    <fieldset id={name} tabIndex={-1} aria-describedby={[hintId, errorId].filter(Boolean).join(" ") || undefined} className="scroll-mt-28 focus:outline-none">
      <legend className="mb-3 text-[0.9375rem] font-medium text-ink">
        {legend}
        <Marker required={required} optional={optional} />
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <label
            key={o.value}
            className={cn(
              "inline-flex min-h-10 cursor-pointer items-center gap-1.5 rounded-full border bg-white px-4 py-1.5 text-[0.9375rem] text-body transition-colors duration-150 hover:border-muted hover:text-ink",
              "has-checked:border-accent has-checked:bg-accent-soft has-checked:font-semibold has-checked:text-accent",
              "has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-accent",
              "forced-colors:has-checked:border-[color:Highlight] forced-colors:has-checked:bg-[color:Highlight] forced-colors:has-checked:text-[color:HighlightText] forced-colors:has-checked:forced-color-adjust-none",
              error ? "border-danger/60" : "border-field",
            )}
          >
            <input type="radio" name={name} value={o.value} required={required} defaultChecked={defaultValue === o.value} className="peer sr-only" />
            <Check aria-hidden className="-ml-1 hidden size-3.5 peer-checked:block" strokeWidth={2.75} />
            {o.label}
          </label>
        ))}
      </div>
      {hint ? (
        <p id={hintId} className="mt-2 text-sm text-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="mt-2 flex items-start gap-1.5 text-sm text-danger">
          <AlertCircle aria-hidden className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}

/** Shown above a form whose submissions are only checked, not sent (local tests, previews). */
export function TestModeNotice() {
  return (
    <p className="rounded-field border border-warn-line bg-warn-soft px-4 py-3 text-sm text-ink">
      <strong className="font-semibold">Testmodus:</strong> Dieses Formular prüft Ihre Eingaben, versendet aber nichts.
    </p>
  );
}

/** Lists every invalid field with a link to it. Receives focus after a failed submit. */
export function ErrorSummary({ ref, errors }: { ref: React.Ref<HTMLDivElement>; errors: [string, string, string][] }) {
  return (
    <div ref={ref} tabIndex={-1} role="alert" className="rounded-card border border-danger/25 bg-danger-soft p-5 text-ink focus:outline-none">
      <p className="flex items-center gap-2 font-semibold">
        <AlertCircle aria-hidden className="size-5 text-danger" strokeWidth={2} />
        Bitte prüfen Sie {errors.length === 1 ? "eine Angabe" : `${errors.length} Angaben`}.
      </p>
      <ul className="mt-3 list-disc space-y-1 pl-7 text-sm text-body marker:text-danger">
        {errors.map(([id, label, message]) => (
          <li key={id}>
            <a href={`#${id}`} className="underline underline-offset-2">
              {label}
            </a>
            : {message}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Delivery or spam-check error, with the e-mail address as a way out. */
export function SubmitError({ ref, message, reference, fallbackEmail }: { ref: React.Ref<HTMLDivElement>; message: string; reference?: string; fallbackEmail: string }) {
  return (
    <div ref={ref} tabIndex={-1} role="alert" className="rounded-card border border-danger/25 bg-danger-soft p-5 text-ink focus:outline-none">
      <p className="flex items-start gap-2 font-semibold">
        <AlertCircle aria-hidden className="mt-0.5 size-5 shrink-0 text-danger" strokeWidth={2} />
        {message}
      </p>
      {reference ? <p className="mt-2 pl-7 text-sm text-body tabular">Referenz: {reference}</p> : null}
      <p className="mt-2 pl-7 text-sm text-body">
        E-Mail:{" "}
        <a href={`mailto:${fallbackEmail}`} className="underline underline-offset-2">
          {fallbackEmail}
        </a>
      </p>
    </div>
  );
}

/** Confirmation after a successful request. */
export function SuccessPanel({
  headingRef,
  title,
  text,
  reference,
  children,
}: {
  headingRef: React.Ref<HTMLHeadingElement>;
  title: string;
  text: React.ReactNode;
  reference: string;
  children?: React.ReactNode;
}) {
  return (
    <div role="status" className="rounded-panel bg-white p-8 md:p-10">
      <span aria-hidden className="flex size-14 items-center justify-center rounded-full bg-accent-soft text-accent">
        <Check className="size-7" strokeWidth={2} />
      </span>
      <h2 ref={headingRef} tabIndex={-1} className="mt-6 text-[2rem] leading-tight focus:outline-none">
        {title}
      </h2>
      <div className="mt-4 max-w-xl text-body">{text}</div>
      <p className="mt-6 text-sm text-muted">
        Referenz: <span className="font-semibold text-ink tabular">{reference}</span>
      </p>
      {children ? <div className="mt-8 flex flex-wrap items-center gap-3">{children}</div> : null}
    </div>
  );
}

/** Consent checkbox with the privacy policy link. */
export function Consent({ defaultChecked, error }: { defaultChecked: boolean; error?: string }) {
  return (
    <div>
      <div className="flex gap-3">
        <input
          id="consent"
          name="consent"
          type="checkbox"
          required
          defaultChecked={defaultChecked}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "consent-error" : undefined}
          className="mt-0.5 size-5 shrink-0 cursor-pointer rounded border-field accent-accent"
        />
        <label htmlFor="consent" className="cursor-pointer leading-relaxed text-body">
          Ich habe die{" "}
          <Link href="/datenschutz" className="text-accent underline decoration-accent-line underline-offset-[3px] hover:decoration-current">
            Datenschutzerklärung
          </Link>{" "}
          gelesen und bin einverstanden, dass meine Angaben zur Bearbeitung der Anfrage verwendet werden.
          <span aria-hidden className="text-accent">{"\u00a0*"}</span>
        </label>
      </div>
      {error ? (
        <p id="consent-error" className="mt-2 flex items-start gap-1.5 pl-8 text-sm text-danger">
          <AlertCircle aria-hidden className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function SubmitRow({ pending, label, pendingLabel, note }: { pending: boolean; label: string; pendingLabel: string; note?: string }) {
  return (
    <>
      <div className="flex flex-col gap-4 border-t border-line pt-7 sm:flex-row sm:items-center sm:justify-between">
        <button type="submit" disabled={pending} className={buttonClasses({ size: "lg", className: "disabled:opacity-70" })}>
          {pending ? <Loader2 aria-hidden className="size-4 animate-spin" /> : null}
          {pending ? pendingLabel : label}
        </button>
        <p className="text-sm text-muted sm:max-w-xs sm:text-right">{note ?? "Die Übermittlung ist verschlüsselt. Es werden keine Cookies gesetzt."}</p>
      </div>
      <p aria-live="polite" className="sr-only">
        {pending ? pendingLabel : ""}
      </p>
    </>
  );
}
