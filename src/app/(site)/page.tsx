import Link from "next/link";
import { Check, ChevronRight } from "lucide-react";
import { PhoneMockup } from "@/components/home/phone-mockup";
import { QuickCalculator } from "@/components/home/quick-calculator";
import { CalculatorCards } from "@/components/sections/calculator-cards";
import { CtaBand } from "@/components/sections/cta-band";
import { ProcessSteps } from "@/components/sections/process-steps";
import { ServiceIndex, type ServiceIndexItem } from "@/components/sections/service-index";
import { JsonLd } from "@/components/seo/json-ld";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Faq } from "@/components/ui/faq";
import { Icon } from "@/components/ui/icon";
import { Section, SectionHeader } from "@/components/ui/section";
import { site } from "@/config/site";
import { hero, homeFaq, intro, portal, process, values } from "@/content/home";
import { propertyGroups } from "@/content/immobilien";
import { primaryCta } from "@/content/navigation";
import { serviceHref, services } from "@/content/services";
import { faqJsonLd, pageMetadata } from "@/lib/seo";
import { getTariffs } from "@/lib/tariffs/store";
import { SMALL_HEADING, hyphenate } from "@/lib/hyphenate";

export const metadata = pageMetadata({
  title: "ANB Treuhand in Langenthal: Buchhaltung, Steuern, Firmengründung und Immobilien",
  description: site.description,
  path: "/",
  absoluteTitle: true,
});

const serviceItems: ServiceIndexItem[] = [
  ...services.map((s) => ({ href: serviceHref(s.slug), name: s.name, tagline: s.tagline, summary: s.summary, icon: s.icon })),
  {
    href: "/immobilien",
    name: "Immobilien",
    tagline: "Verwaltung, Verkauf und Sanierung.",
    summary: "Wir verwalten Mietliegenschaften und Stockwerkeigentum, begleiten Verkäufe und koordinieren Sanierungen von der Offerte bis zur Abnahme.",
    icon: "key",
  },
];

export default async function HomePage() {
  const tariffs = await getTariffs("treuhand");
  const [first, second] = hero.title;

  return (
    <>
      {/* Hero: the promise on the left, the quick calculator on the right. */}
      <section className="bg-white pb-[clamp(3.5rem,8vw,6.5rem)] pt-[clamp(3rem,7vw,6rem)]">
        <Container className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
          <div className="min-w-0">
            <p className="kicker">{hero.eyebrow}</p>
            <h1 className="mt-2.5 text-display">
              {first} <span className="block text-accent">{second}</span>
            </h1>
            <p className="mt-6 max-w-[35rem] text-lead text-body">{hero.lead}</p>
            <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
              <ButtonLink href={primaryCta.href} size="lg">
                {primaryCta.label}
              </ButtonLink>
              <ButtonLink href="/leistungen" variant="text" size="lg" arrow>
                Unsere Leistungen
              </ButtonLink>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[0.9375rem] text-muted">
              {hero.highlights.map((h) => (
                <li key={h.label} className="flex items-center gap-2">
                  <Check aria-hidden className="size-4 text-accent" strokeWidth={2.25} />
                  {h.label}
                </li>
              ))}
            </ul>
          </div>
          <div className="min-w-0">
            <QuickCalculator tariffs={tariffs} />
          </div>
        </Container>
      </section>

      {/* Services. */}
      <Section tone="mist" labelledBy="leistungen-title">
        <SectionHeader
          id="leistungen-title"
          eyebrow="Leistungen"
          title="Alles aus einer Hand."
          text="Von der ersten Buchung bis zur Steuererklärung, von der Gründung bis zur eigenen Liegenschaft: Sie haben eine Ansprechperson für alles."
          align="center"
        />
        <ServiceIndex items={serviceItems} className="mt-12 md:mt-14" />
      </Section>

      {/* Who we are and the four values. */}
      <Section tone="white" labelledBy="intro-title">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-[4.5rem]">
          <div className="min-w-0">
            <p className="kicker">Über ANB Treuhand</p>
            <h2 id="intro-title" className="mt-2.5 text-h2">
              {intro.statement}
            </h2>
            <p className="mt-5 text-lead text-body">{intro.text}</p>
            <ButtonLink href="/ueber-uns" variant="text" className="mt-4 -ml-1" arrow>
              Mehr über uns
            </ButtonLink>
          </div>
          <ul className="grid content-center gap-x-8 gap-y-10 sm:grid-cols-2">
            {values.map((v) => (
              <li key={v.title}>
                <span aria-hidden className="flex size-11 items-center justify-center rounded-xl bg-accent-soft text-accent">
                  <Icon name={v.icon} className="size-5" />
                </span>
                <h3 className="mt-4 text-[1.0625rem] font-semibold">{hyphenate(v.title, SMALL_HEADING)}</h3>
                <p className="mt-1.5 text-[0.9375rem] text-body">{v.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* Calculators. */}
      <Section tone="mist" labelledBy="rechner-title">
        <SectionHeader
          id="rechner-title"
          eyebrow="Preisrechner"
          title="Preise, die Sie vorher kennen."
          text="Drei Rechner, ein Prinzip: Sie wählen, was Sie brauchen, und sehen sofort den Richtpreis. Die Offerte fordern Sie mit einem Klick an."
          align="center"
        />
        <CalculatorCards tone="mist" className="mt-12 md:mt-14" />
      </Section>

      {/* Real estate. */}
      <Section tone="white" labelledBy="immobilien-title">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-[4.5rem]">
          <div className="min-w-0">
            <p className="kicker">Immobilien</p>
            <h2 id="immobilien-title" className="mt-2.5 text-h2">
              Ihre Liegenschaft in guten Händen.
            </h2>
            <p className="mt-5 text-lead text-body">
              Ob vermietete Wohnung, Mehrfamilienhaus oder Stockwerkeigentum: Wir kümmern uns um Mieterschaft, Abrechnungen und Unterhalt. Und wenn es Zeit für einen Verkauf oder
              eine Sanierung ist, begleiten wir Sie Schritt für Schritt.
            </p>
            <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
              <ButtonLink href="/immobilien">Immobilien-Leistungen</ButtonLink>
              <ButtonLink href="/rechner/immobilien" variant="secondary">
                Richtpreis berechnen
              </ButtonLink>
            </div>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2">
            {propertyGroups.map((g) => (
              <li key={g.id}>
                <Link href={`/immobilien#${g.id}`} className="group flex h-full flex-col rounded-card bg-mist p-6 transition-[background-color,box-shadow] duration-200 hover:bg-white hover:shadow-card">
                  <span aria-hidden className="flex size-11 items-center justify-center rounded-xl bg-accent-soft text-accent">
                    <Icon name={g.icon} className="size-5" />
                  </span>
                  <h3 className="mt-4 text-[1.0625rem] font-semibold">{hyphenate(g.title, SMALL_HEADING)}</h3>
                  <p className="mt-1.5 flex-1 text-[0.9375rem] text-body">{g.lead}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-[0.9375rem] font-medium text-accent">
                    Mehr erfahren
                    <ChevronRight aria-hidden className="size-4 transition-transform duration-150 group-hover:translate-x-0.5" strokeWidth={2} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* How we work together. */}
      <Section tone="mist" labelledBy="ablauf-title">
        <SectionHeader id="ablauf-title" eyebrow="Zusammenarbeit" title="So einfach starten wir." align="center" />
        <ProcessSteps steps={process} className="mt-12 md:mt-14" />
      </Section>

      {/* Customer portal, phase 2. */}
      <Section tone="white" labelledBy="portal-title">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-[4.5rem]">
          <div className="min-w-0">
            <p className="kicker">{portal.eyebrow}</p>
            <h2 id="portal-title" className="mt-2.5 text-h2">
              {portal.title}
            </h2>
            <p className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-2.5 py-0.5 text-[0.8125rem] font-semibold text-accent">
              <span aria-hidden className="size-1.5 rounded-full bg-current" />
              In Vorbereitung
            </p>
            <p className="mt-5 text-lead text-body">{portal.text}</p>
            <ul className="mt-7 grid gap-3.5">
              {portal.features.map((f) => (
                <li key={f} className="flex items-start gap-3 text-body">
                  <span aria-hidden className="mt-0.5 flex size-[1.375rem] shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
                    <Check className="size-3.5" strokeWidth={2.5} />
                  </span>
                  {f}
                </li>
              ))}
            </ul>
            <ButtonLink href="/kundenportal" variant="text" className="mt-5 -ml-1" arrow>
              Mehr zum Kundenportal
            </ButtonLink>
          </div>
          <PhoneMockup />
        </div>
      </Section>

      {/* Questions. */}
      <Section tone="mist" labelledBy="faq-title">
        <div className="mx-auto max-w-[47.5rem]">
          <SectionHeader id="faq-title" eyebrow="Fragen" title="Gut zu wissen." align="center" />
          <div className="mt-10 md:mt-12">
            <Faq items={homeFaq} />
          </div>
        </div>
      </Section>

      <CtaBand />
      <JsonLd data={faqJsonLd(homeFaq)} />
    </>
  );
}
