"use client";

import { Mail } from "lucide-react";
import type { CalculatorSlug } from "@/content/types";
import type { CalculatorRequest } from "@/lib/calculators/index";
import type { Estimate } from "@/lib/calculators/shared";
import { estimateLineRows, inputRows, totalRows } from "@/lib/requests/summary";
import { cn } from "@/lib/utils";
import { StepHeader, stepCardClass } from "./controls";
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
    <section id="offerte" aria-labelledby="offerte-title" tabIndex={-1} className={cn(stepCardClass, "scroll-mt-28 focus:outline-none")}>
      <StepHeader
        number={number}
        title="Offerte anfordern"
        titleId="offerte-title"
        text="Senden Sie uns Ihre Berechnung per E-Mail. Ihre Angaben sind im Entwurf schon eingetragen."
      />
      <a
        href={href}
        className="mt-8 inline-flex min-h-[3.125rem] items-center justify-center gap-2 rounded-full bg-forest px-[1.625rem] py-2.5 text-[1.0625rem] font-semibold text-white transition-colors duration-150 hover:bg-forest-deep"
      >
        <Mail aria-hidden className="size-4" strokeWidth={2} />
        Offerte per E-Mail anfordern
      </a>
      <p className="mt-4 text-sm text-muted">
        Oder direkt an <span className="text-ink">{settings.fallbackEmail}</span>
        {settings.phone ? (
          <>
            {" "}
            oder{" "}
            <a href={settings.phone.href} className="text-accent underline decoration-accent-line underline-offset-[3px] hover:decoration-current">
              {settings.phone.label}
            </a>
          </>
        ) : null}
        .
      </p>
    </section>
  );
}
