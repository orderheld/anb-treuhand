"use client";

import { startTransition, useActionState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { submitContact } from "@/app/(site)/kontakt/actions";
import { buttonClasses } from "@/components/ui/button";
import { topics, type Topic } from "@/lib/requests/options";
import {
  initialRequestState,
  REQUEST_TEXT_FIELDS,
  type RequestField,
  type RequestState,
  type RequestTextField,
  type RequestValues,
} from "@/lib/requests/state";
import { cn } from "@/lib/utils";
import { ChoiceChips, Consent, ErrorSummary, Field, Honeypot, SubmitError, SubmitRow, SuccessPanel, TestModeNotice, inputClass } from "./fields";

/** In the order of the form, so the error summary lists the fields as they appear. */
const FIELD_LABELS: Partial<Record<RequestField, string>> = {
  topic: "Anliegen",
  name: "Name",
  company: "Firma",
  email: "E-Mail",
  phone: "Telefon",
  message: "Nachricht",
  consent: "Datenschutz",
};

function enteredValues(data: FormData): RequestValues {
  const values: RequestValues = {};
  for (const field of REQUEST_TEXT_FIELDS) {
    const value = data.get(field);
    if (typeof value === "string") values[field] = value;
  }
  return values;
}

/** See OfferForm: a dropped connection keeps the form filled instead of showing an error screen. */
async function submitSafely(prev: RequestState, data: FormData): Promise<RequestState> {
  try {
    return await submitContact(prev, data);
  } catch {
    return {
      status: "error",
      message: "Beim Senden ist ein technischer Fehler aufgetreten. Ihre Angaben sind noch da. Bitte senden Sie die Nachricht erneut oder schreiben Sie uns per E-Mail.",
      values: enteredValues(data),
    };
  }
}

export interface ContactFormProps {
  fallbackEmail: string;
  testMode: boolean;
  confirmation: boolean;
  /** ", in der Regel innert eines Arbeitstages" or "". */
  responseClause: string;
  defaultTopic?: Topic;
}

export function ContactForm({ fallbackEmail, testMode, confirmation, responseClause, defaultTopic }: ContactFormProps) {
  const [postedState, formAction] = useActionState(submitContact, initialRequestState);
  const [sentState, send, pending] = useActionState(submitSafely, initialRequestState);
  const state = sentState === initialRequestState ? postedState : sentState;
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

  if (state.status === "success") {
    return (
      <SuccessPanel
        headingRef={successRef}
        title="Vielen Dank für Ihre Nachricht"
        reference={state.reference}
        text={
          <>
            <p>Ihre Nachricht ist bei uns angekommen. Wir melden uns persönlich bei Ihnen{responseClause}.</p>
            {state.confirmation ? <p className="mt-3">Eine Bestätigung haben wir an {state.email} gesendet.</p> : null}
          </>
        }
      >
        <Link href="/rechner" className={buttonClasses({ variant: "outline-light" })}>
          Preise berechnen
        </Link>
        <Link href="/" className={buttonClasses({ variant: "text-light" })}>
          Zur Startseite
        </Link>
      </SuccessPanel>
    );
  }

  const values: RequestValues = state.status === "invalid" || state.status === "error" ? state.values : {};
  const errors: Partial<Record<RequestField, string>> = state.status === "invalid" ? state.errors : {};
  const errorEntries = (Object.keys(FIELD_LABELS) as RequestField[])
    .filter((field) => errors[field])
    .map((field): [string, string, string] => [field, FIELD_LABELS[field] as string, errors[field] as string]);
  const v = (field: RequestTextField) => values[field] ?? "";

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (mountedAt.current > 0) data.set("elapsedMs", String(Math.round(performance.now() - mountedAt.current)));
    startTransition(() => send(data));
  }

  return (
    <form action={formAction} onSubmit={handleSubmit} noValidate className="space-y-7" aria-describedby="kontakt-hinweis">
      <div className="space-y-4">
        {testMode ? <TestModeNotice /> : null}
        {errorEntries.length > 0 ? <ErrorSummary ref={summaryRef} errors={errorEntries} /> : null}
        {state.status === "error" ? <SubmitError ref={summaryRef} message={state.message} reference={state.reference} fallbackEmail={fallbackEmail} /> : null}
        <p id="kontakt-hinweis" className="text-sm text-muted">
          Pflichtfelder sind mit <span aria-hidden className="text-bronze">*</span>
          <span className="sr-only">Stern</span> markiert.
        </p>
      </div>

      <ChoiceChips name="topic" legend="Worum geht es?" required options={topics} defaultValue={v("topic") || defaultTopic} error={errors.topic} />

      <div className="grid gap-6 sm:grid-cols-2">
        <Field id="name" label="Vorname und Name" required error={errors.name}>
          {(p) => <input {...p} name="name" type="text" autoComplete="name" defaultValue={v("name")} className={inputClass} />}
        </Field>
        <Field id="company" label="Firma" optional error={errors.company}>
          {(p) => <input {...p} name="company" type="text" autoComplete="organization" defaultValue={v("company")} className={inputClass} />}
        </Field>
        <Field id="email" label="E-Mail" required error={errors.email}>
          {(p) => <input {...p} name="email" type="email" autoComplete="email" inputMode="email" defaultValue={v("email")} className={inputClass} />}
        </Field>
        <Field id="phone" label="Telefon" optional hint="Für einen Rückruf." error={errors.phone}>
          {(p) => <input {...p} name="phone" type="tel" autoComplete="tel" defaultValue={v("phone")} className={inputClass} />}
        </Field>
      </div>

      <Field id="message" label="Ihre Nachricht" required hint="Erzählen Sie kurz, worum es geht. Gerne auch mit einem Terminwunsch." error={errors.message}>
        {(p) => <textarea {...p} name="message" rows={6} defaultValue={v("message")} className={cn(inputClass, "resize-y")} />}
      </Field>

      <Honeypot />

      <div className="space-y-7">
        <Consent defaultChecked={v("consent") === "on"} error={errors.consent} />
        <SubmitRow
          pending={pending}
          label="Nachricht senden"
          pendingLabel="Nachricht wird gesendet"
          note={confirmation ? "Verschlüsselt übermittelt. Sie erhalten eine Bestätigung per E-Mail." : undefined}
        />
      </div>
    </form>
  );
}

/** The form with the topic from the address (/kontakt?anliegen=steuern), read in the browser. */
export function ContactFormFromUrl(props: Omit<ContactFormProps, "defaultTopic">) {
  const params = useSearchParams();
  const topic = topics.find((t) => t.value === params.get("anliegen"))?.value;
  return <ContactForm key={topic ?? "none"} {...props} defaultTopic={topic} />;
}
