import { Info } from "lucide-react";
import { CalculatorCards } from "@/components/sections/calculator-cards";
import { CtaBand } from "@/components/sections/cta-band";
import { PageHero } from "@/components/sections/page-hero";
import { ProcessSteps } from "@/components/sections/process-steps";
import { JsonLd } from "@/components/seo/json-ld";
import { Section, SectionHeader } from "@/components/ui/section";
import { firstCallFree, vatNote } from "@/config/site";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Preisrechner: Treuhand, Firmengründung und Immobilien",
  description:
    "Berechnen Sie online den Richtpreis für Buchhaltung, Steuern und Löhne, für Ihre Firmengründung oder die Verwaltung Ihrer Liegenschaft. Unverbindlich, mit Offerte per E-Mail.",
  path: "/rechner",
});

const crumbs = [
  { name: "Start", path: "/" },
  { name: "Preisrechner", path: "/rechner" },
];

export default function RechnerPage() {
  const steps = [
    { title: "Angaben wählen", text: "Rechtsform, Umfang und Leistungen: Sie klicken zusammen, was Sie brauchen." },
    { title: "Richtpreis sehen", text: "Der Preis passt sich sofort an, aufgeschlüsselt nach Positionen." },
    {
      title: "Offerte anfordern",
      text: `Mit wenigen Angaben senden Sie uns die Berechnung. Danach lernen wir uns ${firstCallFree() ? "in einem kostenlosen Gespräch " : ""}kennen.`,
    },
  ];
  return (
    <>
      <PageHero
        eyebrow="Preisrechner"
        title="Preise, die Sie vorher kennen."
        lead="Drei Rechner, ein Prinzip: Sie wählen, was Sie brauchen, und sehen sofort den Richtpreis. Die Offerte fordern Sie mit einem Klick an."
        breadcrumbs={crumbs}
        compact
      />

      <Section tone="mist" labelledBy="rechner-title">
        <h2 id="rechner-title" className="sr-only">
          Unsere Rechner
        </h2>
        <CalculatorCards headingLevel="h3" tone="mist" />
        <p className="mt-8 flex max-w-3xl items-start gap-2.5 text-[0.9375rem] text-muted">
          <Info aria-hidden className="mt-0.5 size-4 shrink-0 text-accent" strokeWidth={1.75} />
          Die Rechner zeigen unverbindliche Richtpreise auf Basis unserer aktuellen Tarife. Die verbindliche Offerte erhalten Sie nach dem Erstgespräch. {vatNote()}
        </p>
      </Section>

      <Section tone="white" labelledBy="ablauf-title">
        <SectionHeader id="ablauf-title" eyebrow="So funktioniert es" title="In drei Schritten zur Offerte." align="center" />
        <ProcessSteps steps={steps} className="mt-12" />
      </Section>

      <CtaBand divider title="Lieber persönlich?" text="Rufen Sie uns an oder vereinbaren Sie ein Erstgespräch. Wir berechnen Ihren Preis gerne gemeinsam mit Ihnen." />
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
    </>
  );
}
