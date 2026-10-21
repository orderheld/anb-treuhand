"use client";

import { Mail } from "lucide-react";
import type { CalculatorSlug } from "@/content/types";
import type { CalculatorRequest } from "@/lib/calculators/index";
import type { Estimate } from "@/lib/calculators/shared";
import { estimateLineRows, inputRows, totalRows } from "@/lib/requests/summary";
import { OfferForm } from "./offer-form";
import type { OfferSettings } from "./types";

/**
 * Last step of every calculator: the offer form, or, while the form cannot send (no e-mail
 * delivery configured), an e-mail with the calculation already filled in.
 */
export function OfferStep({
  request,
  estimate,
  inputError,
  companyLabel,
  settings,
  number,
  title,
}: {
  request: CalculatorRequest;
  estimate: Estimate;
  inputError?: string | null;
  companyLabel: string | null;
  settings: OfferSettings;
  number: number;
  /** Calculator name for the e-mail subject. */
  title: string;
}) {
  if (settings.formsAvailable) {
    return (
      <OfferForm
        calculator={request.slug as CalculatorSlug}
        input={request.input}
        inputError={inputError}
        companyLabel={companyLabel}
        fallbackEmail={settings.fallbackEmail}
        testMode={settings.testMode}
        responseClause={settings.responseClause}
        confirmation={settings.confirmation}
        number={number}
      />
    );
  }

  const body = [
    "Guten Tag",
    "",
    `Bitte senden Sie mir eine Offerte. Meine Angaben im ${title}:`,
    "",
    ...inputRows(request).map((r) => `${r.label}: ${r.value}`),
    "",
    "Richtpreis:",
    ...estimateLineRows(estimate).map((l) => `- ${l.label}: ${l.amount}`),
    ...totalRows(request.slug, estimate).map((r) => `${r.label}: ${r.value}`),
    "",
    "Name:",
    "Telefon:",
    "",
    "Freundliche Grüsse",
  ].join("\n");
  const href = `mailto:${settings.fallbackEmail}?subject=${encodeURIComponent(`Offertanfrage ${title}`)}&body=${encodeURIComponent(body)}`;

  return (
    <section id="offerte" aria-labelledby="offerte-title" tabIndex={-1} className="scroll-mt-28 rounded-[1.75rem] border border-sand/80 bg-white p-6 shadow-card focus:outline-none sm:p-8">
      <header className="flex items-start gap-4">
        <span aria-hidden className="mt-1 font-serif text-2xl leading-none text-copper">
          {String(number).padStart(2, "0")}
        </span>
        <div>
          <h2 id="offerte-title" className="font-serif text-[1.625rem] leading-tight text-ink">
            Offerte anfordern
          </h2>
          <p className="mt-1.5 text-[0.9375rem] text-muted">
            Senden Sie uns Ihre Berechnung per E-Mail. Ihre Angaben sind im Entwurf schon eingetragen.
          </p>
        </div>
      </header>
      <a
        href={href}
        className="mt-8 inline-flex min-h-14 items-center justify-center gap-2.5 rounded-full bg-forest px-8 py-3 font-medium text-cream transition-colors duration-300 hover:bg-forest-deep"
      >
        <Mail aria-hidden className="size-4" strokeWidth={1.75} />
        Offerte per E-Mail anfordern
      </a>
      <p className="mt-4 text-sm text-muted">
        Oder direkt an <span className="text-ink">{settings.fallbackEmail}</span>
        {settings.phone ? (
          <>
            {" "}
            oder{" "}
            <a href={settings.phone.href} className="text-forest underline decoration-copper underline-offset-[3px]">
              {settings.phone.label}
            </a>
          </>
        ) : null}
        .
      </p>
    </section>
  );
}
