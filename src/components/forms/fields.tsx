import Link from "next/link";
import { AlertCircle, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/** Form controls of the contact and offer forms. */

export const inputClass =
  "block w-full rounded-xl border border-field bg-white px-4 py-3 text-base text-ink transition-[border-color,box-shadow] duration-200 placeholder:text-hint hover:border-forest/70 focus:border-forest focus:outline-none focus:ring-4 focus:ring-forest/10 aria-[invalid=true]:border-red-700 aria-[invalid=true]:focus:ring-red-700/15";

export interface ControlProps {
  id: string;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
  required?: boolean;
}

function Marker({ required, optional }: { required?: boolean; optional?: boolean }) {
  if (required) return <span aria-hidden className="text-bronze"> *</span>;
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
        <p id={errorId} className="mt-2 flex items-start gap-1.5 text-sm text-red-700">
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
              "inline-flex cursor-pointer items-center gap-2 rounded-full border bg-white px-4 py-2 text-[0.9375rem] text-ink transition-colors duration-200 hover:border-forest/70",
              "has-checked:border-forest has-checked:bg-forest has-checked:text-cream",
              "has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-forest",
              "forced-colors:has-checked:border-[color:Highlight] forced-colors:has-checked:bg-[color:Highlight] forced-colors:has-checked:text-[color:HighlightText] forced-colors:has-checked:forced-color-adjust-none",
              error ? "border-red-700/60" : "border-field",
            )}
          >
            <input type="radio" name={name} value={o.value} required={required} defaultChecked={defaultValue === o.value} className="peer sr-only" />
            <Check aria-hidden className="-ml-1 hidden size-3.5 text-copper peer-checked:block" strokeWidth={2.25} />
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
        <p id={errorId} className="mt-2 flex items-start gap-1.5 text-sm text-red-700">
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
    <p className="rounded-xl border border-copper/60 bg-cream px-4 py-3 text-sm text-ink">
      <strong className="font-medium">Testmodus:</strong> Dieses Formular prüft Ihre Eingaben, versendet aber nichts.
    </p>
  );
}

/** Lists every invalid field with a link to it. Receives focus after a failed submit. */
export function ErrorSummary({ ref, errors }: { ref: React.Ref<HTMLDivElement>; errors: [string, string, string][] }) {
  return (
    <div ref={ref} tabIndex={-1} role="alert" className="rounded-2xl border border-red-700/25 bg-red-50 p-5 text-red-900 focus:outline-none">
      <p className="flex items-center gap-2 font-medium">
        <AlertCircle aria-hidden className="size-5" strokeWidth={1.75} />
        Bitte prüfen Sie {errors.length === 1 ? "eine Angabe" : `${errors.length} Angaben`}.
      </p>
      <ul className="mt-3 list-disc space-y-1 pl-7 text-sm">
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
    <div ref={ref} tabIndex={-1} role="alert" className="rounded-2xl border border-red-700/25 bg-red-50 p-5 text-red-900 focus:outline-none">
      <p className="flex items-start gap-2 font-medium">
        <AlertCircle aria-hidden className="mt-0.5 size-5 shrink-0" strokeWidth={1.75} />
        {message}
      </p>
      {reference ? <p className="mt-2 pl-7 text-sm tabular">Referenz: {reference}</p> : null}
      <p className="mt-2 pl-7 text-sm">
        E-Mail:{" "}
        <a href={`mailto:${fallbackEmail}`} className="underline underline-offset-2">
          {fallbackEmail}
        </a>
      </p>
    </div>
  );
}

/** Confirmation after a successful request, on the green surface of the brand. */
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
    <div role="status" className="on-dark grain relative isolate overflow-hidden rounded-[1.75rem] bg-forest p-8 text-cream shadow-lift md:p-10">
      <span aria-hidden className="flex size-14 items-center justify-center rounded-full border border-copper/50 bg-forest-deep">
        <Check className="size-7 text-copper" strokeWidth={1.5} />
      </span>
      <h2 ref={headingRef} tabIndex={-1} className="mt-6 font-serif text-[2rem] leading-tight text-cream focus:outline-none">
        {title}
      </h2>
      <div className="mt-4 max-w-xl leading-relaxed text-cream/80">{text}</div>
      <p className="mt-6 text-sm text-cream/70">
        Referenz: <span className="font-medium tracking-wide text-copper tabular">{reference}</span>
      </p>
      {children ? <div className="mt-8 flex flex-wrap gap-4">{children}</div> : null}
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
          className="mt-1 size-5 shrink-0 cursor-pointer rounded border-field accent-forest"
        />
        <label htmlFor="consent" className="cursor-pointer leading-relaxed text-body">
          Ich habe die{" "}
          <Link href="/datenschutz" className="text-forest underline decoration-copper underline-offset-[3px] hover:decoration-2">
            Datenschutzerklärung
          </Link>{" "}
          gelesen und bin einverstanden, dass meine Angaben zur Bearbeitung der Anfrage verwendet werden.
          <span aria-hidden className="text-bronze"> *</span>
        </label>
      </div>
      {error ? (
        <p id="consent-error" className="mt-2 flex items-start gap-1.5 pl-8 text-sm text-red-700">
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
      <div className="flex flex-col gap-4 border-t border-sand pt-7 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={pending}
          className="group inline-flex min-h-14 items-center justify-center gap-2.5 rounded-full bg-forest px-8 py-3 font-medium text-cream shadow-[inset_0_1px_0_rgb(255_255_255/0.08),0_10px_24px_-14px_rgb(20_42_31/0.8)] transition-colors duration-300 hover:bg-forest-deep disabled:opacity-70"
        >
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
