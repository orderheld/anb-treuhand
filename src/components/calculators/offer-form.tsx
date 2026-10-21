"use client";

import { startTransition, useActionState, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { requestOffer } from "@/app/(site)/rechner/actions";
import {
  ChoiceChips,
  Consent,
  ErrorSummary,
  Field,
  Honeypot,
  SubmitError,
  SubmitRow,
  SuccessPanel,
  TestModeNotice,
  inputClass,
} from "@/components/forms/fields";
import { buttonClasses } from "@/components/ui/button";
import type { CalculatorSlug } from "@/content/types";
import { timings } from "@/lib/requests/options";
import {
  initialRequestState,
  REQUEST_TEXT_FIELDS,
  type RequestField,
  type RequestState,
  type RequestTextField,
  type RequestValues,
} from "@/lib/requests/state";
import { cn } from "@/lib/utils";
import { StepHeader, stepCardClass } from "./controls";

/** In the order of the form, so the error summary lists the fields as they appear. */
const FIELD_LABELS: Partial<Record<RequestField, string>> = {
  input: "Angaben im Rechner",
  name: "Name",
  company: "Firma",
  email: "E-Mail",
  phone: "Telefon",
  timing: "Gewünschter Start",
  message: "Nachricht",
  consent: "Datenschutz",
};

/** Where the error summary links to; the calculator values link to the steps. */
const FIELD_TARGETS: Partial<Record<RequestField, string>> = { input: "rechner-schritte" };

function enteredValues(data: FormData): RequestValues {
  const values: RequestValues = {};
  for (const field of REQUEST_TEXT_FIELDS) {
    const value = data.get(field);
    if (typeof value === "string") values[field] = value;
  }
  return values;
}

/**
 * The request as the browser sends it with JavaScript. A dropped connection throws here; the
 * form stays filled and offers the e-mail address instead of the framework's error screen.
 */
async function submitSafely(prev: RequestState, data: FormData): Promise<RequestState> {
  try {
    return await requestOffer(prev, data);
  } catch {
    return {
      status: "error",
      message: "Beim Senden ist ein technischer Fehler aufgetreten. Ihre Angaben sind noch da. Bitte senden Sie die Anfrage erneut oder schreiben Sie uns per E-Mail.",
      values: enteredValues(data),
    };
  }
}

/**
 * Contact details for an offer, sent together with the current calculator values. The server
 * recomputes the price with the current tariffs and e-mails the request to ANB.
 */
export function OfferForm({
  calculator,
  input,
  inputError,
  companyLabel,
  fallbackEmail,
  testMode,
  responseClause,
  confirmation,
  number,
}: {
  calculator: CalculatorSlug;
  /** The calculator values, sent as JSON. */
  input: unknown;
  /** A problem with the calculator values that blocks the request (e.g. capital below the minimum). */
  inputError?: string | null;
  /** Label of the optional company field, or null to leave it out. */
  companyLabel: string | null;
  fallbackEmail: string;
  testMode: boolean;
  /** ", in der Regel innert eines Arbeitstages" or "" (from the site configuration). */
  responseClause: string;
  /** The visitor receives a confirmation e-mail (CONTACT_CONFIRMATION). */
  confirmation: boolean;
  /** Step number shown before the title. */
  number: number;
}) {
  // Without JavaScript the browser posts the form to the Server Action itself.
  const [postedState, formAction] = useActionState(requestOffer, initialRequestState);
  // With JavaScript handleSubmit sends through submitSafely.
  const [sentState, send, pending] = useActionState(submitSafely, initialRequestState);
  const state = sentState === initialRequestState ? postedState : sentState;
  const [blocked, setBlocked] = useState<string | null>(null);
  const mountedAt = useRef(0);
  const summaryRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (mountedAt.current === 0) mountedAt.current = performance.now();
  }, []);

  useEffect(() => {
    if (state.status === "invalid" || state.status === "error") summaryRef.current?.focus();
    if (state.status === "success") successRef.current?.focus();
  }, [state]);

  const shell = (children: React.ReactNode) => (
    <section id="offerte" aria-labelledby="offerte-title" tabIndex={-1} className={cn(stepCardClass, "scroll-mt-28 focus:outline-none")}>
      <StepHeader
        number={number}
        title="Offerte anfordern"
        titleId="offerte-title"
        text={<>Kostenlos und unverbindlich. Wir melden uns persönlich bei Ihnen{responseClause}.</>}
      />
      <div className="mt-8">{children}</div>
    </section>
  );

  if (state.status === "success") {
    return (
      <div id="offerte" className="scroll-mt-28">
        <SuccessPanel
          headingRef={successRef}
          title="Vielen Dank für Ihre Anfrage"
          reference={state.reference}
          text={
            <>
              <p>
                Ihre Anfrage ist bei uns angekommen. Wir prüfen Ihre Angaben und melden uns persönlich bei Ihnen{responseClause}.
              </p>
              {state.confirmation ? <p className="mt-3">Eine Bestätigung mit Ihrem Richtpreis haben wir an {state.email} gesendet.</p> : null}
            </>
          }
        >
          <Link href="/" className={buttonClasses({ variant: "secondary" })}>
            Zur Startseite
          </Link>
          <Link href="/leistungen" className={buttonClasses({ variant: "text" })}>
            Unsere Leistungen
          </Link>
        </SuccessPanel>
      </div>
    );
  }

  const values: RequestValues = state.status === "invalid" || state.status === "error" ? state.values : {};
  const errors: Partial<Record<RequestField, string>> = state.status === "invalid" ? { ...state.errors } : {};
  if (blocked) errors.input = blocked;
  const errorEntries = (Object.keys(FIELD_LABELS) as RequestField[])
    .filter((field) => errors[field])
    .map((field): [string, string, string] => [FIELD_TARGETS[field] ?? field, FIELD_LABELS[field] as string, errors[field] as string]);
  const v = (field: RequestTextField) => values[field] ?? "";

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    // Dispatch manually so the browser keeps all entered values.
    event.preventDefault();
    if (inputError) {
      setBlocked(inputError);
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    setBlocked(null);
    const data = new FormData(event.currentTarget);
    // Fill time on the visitor's own clock, so a wrong system time cannot block the request.
    if (mountedAt.current > 0) data.set("elapsedMs", String(Math.round(performance.now() - mountedAt.current)));
    startTransition(() => send(data));
  }

  return shell(
    <form action={formAction} onSubmit={handleSubmit} noValidate className="space-y-7" aria-describedby="offerte-hinweis">
      <input type="hidden" name="calculator" value={calculator} />
      <input type="hidden" name="input" value={JSON.stringify(input)} />

      <div className="space-y-4">
        {testMode ? <TestModeNotice /> : null}
        {errorEntries.length > 0 ? <ErrorSummary ref={summaryRef} errors={errorEntries} /> : null}
        {state.status === "error" ? <SubmitError ref={summaryRef} message={state.message} reference={state.reference} fallbackEmail={fallbackEmail} /> : null}
        <p id="offerte-hinweis" className="text-sm text-muted">
          Pflichtfelder sind mit <span aria-hidden className="text-accent">*</span>
          <span className="sr-only">Stern</span> markiert.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field id="name" label="Vorname und Name" required error={errors.name}>
          {(p) => <input {...p} name="name" type="text" autoComplete="name" defaultValue={v("name")} className={inputClass} />}
        </Field>
        {companyLabel ? (
          <Field id="company" label={companyLabel} optional error={errors.company}>
            {(p) => <input {...p} name="company" type="text" autoComplete="organization" defaultValue={v("company")} className={inputClass} />}
          </Field>
        ) : null}
        <Field id="email" label="E-Mail" required error={errors.email}>
          {(p) => <input {...p} name="email" type="email" autoComplete="email" inputMode="email" defaultValue={v("email")} className={inputClass} />}
        </Field>
        <Field id="phone" label="Telefon" optional error={errors.phone}>
          {(p) => <input {...p} name="phone" type="tel" autoComplete="tel" defaultValue={v("phone")} className={inputClass} />}
        </Field>
      </div>

      <ChoiceChips name="timing" legend="Gewünschter Start" optional options={timings} defaultValue={v("timing")} error={errors.timing} />

      <Field id="message" label="Nachricht" optional hint="Fragen, Besonderheiten oder ein Wunschtermin für das Erstgespräch." error={errors.message}>
        {(p) => <textarea {...p} name="message" rows={4} defaultValue={v("message")} className={cn(inputClass, "resize-y")} />}
      </Field>

      <Honeypot />

      <div className="space-y-7">
        <Consent defaultChecked={v("consent") === "on"} error={errors.consent} />
        <SubmitRow
          pending={pending}
          label="Offerte anfordern"
          pendingLabel="Anfrage wird gesendet"
          note={confirmation ? "Verschlüsselt übermittelt. Sie erhalten eine Bestätigung per E-Mail." : undefined}
        />
      </div>
    </form>,
  );
}
