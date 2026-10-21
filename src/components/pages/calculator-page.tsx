import { Suspense } from "react";
import type { Metadata } from "next";
import { Check } from "lucide-react";
import { GruendungFromUrl, ImmobilienFromUrl, TreuhandFromUrl } from "@/components/calculators/from-url";
import { GruendungCalculator } from "@/components/calculators/gruendung-calculator";
import { ImmobilienCalculator } from "@/components/calculators/immobilien-calculator";
import { TreuhandCalculator } from "@/components/calculators/treuhand-calculator";
import type { OfferSettings } from "@/components/calculators/types";
import { CalculatorCards } from "@/components/sections/calculator-cards";
import { CtaBand } from "@/components/sections/cta-band";
import { PageHero } from "@/components/sections/page-hero";
import { ProcessSteps } from "@/components/sections/process-steps";
import { JsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/ui/container";
import { Faq } from "@/components/ui/faq";
import { Section, SectionHeader } from "@/components/ui/section";
import { firstCallFree, site } from "@/config/site";
import { calculatorHref, getCalculator } from "@/content/calculators";
import type { CalculatorSlug } from "@/content/types";
import { offerSettings } from "@/lib/offer-settings";
import { breadcrumbJsonLd, faqJsonLd, pageMetadata } from "@/lib/seo";
import { getTariffs } from "@/lib/tariffs/store";

/**
 * Page of one calculator. Each calculator has its own static route (rechner/treuhand …), so the
 * whole page is prerendered without reading URL data and navigations to it are instant.
 */

export function calculatorMetadata(slug: CalculatorSlug): Metadata {
  const calc = getCalculator(slug);
  return pageMetadata({ title: calc.metaTitle, description: calc.metaDescription, path: calculatorHref(slug) });
}

/** The calculator with the current tariffs; start values from the address once the page runs in the browser. */
async function Calculator({ slug, settings }: { slug: CalculatorSlug; settings: OfferSettings }) {
  switch (slug) {
    case "treuhand": {
      const tariffs = await getTariffs("treuhand");
      return (
        <Suspense fallback={<TreuhandCalculator tariffs={tariffs} settings={settings} />}>
          <TreuhandFromUrl tariffs={tariffs} settings={settings} />
        </Suspense>
      );
    }
    case "firmengruendung": {
      const tariffs = await getTariffs("firmengruendung");
      return (
        <Suspense fallback={<GruendungCalculator tariffs={tariffs} settings={settings} />}>
          <GruendungFromUrl tariffs={tariffs} settings={settings} />
        </Suspense>
      );
    }
    case "immobilien": {
      const tariffs = await getTariffs("immobilien");
      return (
        <Suspense fallback={<ImmobilienCalculator tariffs={tariffs} settings={settings} />}>
          <ImmobilienFromUrl tariffs={tariffs} settings={settings} />
        </Suspense>
      );
    }
  }
}

export function CalculatorPage({ slug: rechner }: { slug: CalculatorSlug }) {
  const calc = getCalculator(rechner);
  const settings = offerSettings();
  const crumbs = [
    { name: "Start", path: "/" },
    { name: "Preisrechner", path: "/rechner" },
    { name: calc.name, path: calculatorHref(rechner) },
  ];
  const highlights = [
    "Richtpreis in Echtzeit",
    "Offerte kostenlos und unverbindlich",
    ...(site.legal.vatRegistered.value ? [] : ["Endpreise ohne Mehrwertsteuer"]),
  ];
  const steps = [
    { title: "Richtpreis berechnen", text: "Sie wählen, was Sie brauchen, und sehen sofort, womit Sie rechnen können." },
    { title: "Offerte anfordern", text: "Mit wenigen Angaben senden Sie uns Ihre Berechnung. Sie kommt direkt bei uns an." },
    {
      title: "Erstgespräch",
      text: `Wir lernen uns ${firstCallFree() ? "in einem kostenlosen Gespräch " : ""}kennen und klären die Details. Danach erhalten Sie Ihre verbindliche Offerte.`,
    },
  ];

  return (
    <>
      <PageHero eyebrow={calc.name} title={calc.title} lead={calc.description} breadcrumbs={crumbs} compact>
        <ul className="flex flex-wrap gap-x-6 gap-y-2 text-[0.9375rem] text-muted">
          {highlights.map((h) => (
            <li key={h} className="flex items-center gap-2">
              <Check aria-hidden className="size-4 text-accent" strokeWidth={2.25} />
              {h}
            </li>
          ))}
        </ul>
      </PageHero>

      <section aria-label={calc.name} className="bg-mist py-10 md:py-14">
        <Container>
          <Calculator slug={rechner} settings={settings} />
        </Container>
      </section>

      <Section tone="white" labelledBy="ablauf-title">
        <SectionHeader id="ablauf-title" eyebrow="So geht es weiter" title="Vom Richtpreis zur Offerte." align="center" />
        <ProcessSteps steps={steps} className="mt-12 md:mt-14" />
      </Section>

      <Section tone="mist" labelledBy="faq-title">
        <div className="mx-auto max-w-[47.5rem]">
          <SectionHeader id="faq-title" eyebrow="Fragen" title="Gut zu wissen." align="center" />
          <div className="mt-10 md:mt-12">
            <Faq items={calc.faq} />
          </div>
        </div>
      </Section>

      <Section tone="white" labelledBy="weitere-rechner-title">
        <SectionHeader id="weitere-rechner-title" eyebrow="Weitere Rechner" title="Noch etwas berechnen?" align="center" />
        <CalculatorCards exclude={rechner} tone="white" className="mx-auto mt-12 max-w-[52rem] md:mt-14" />
      </Section>

      <CtaBand divider />
      <JsonLd data={[breadcrumbJsonLd(crumbs), faqJsonLd(calc.faq)]} />
    </>
  );
}
