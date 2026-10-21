import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { CornerFacet, Facet, MonogramOutline } from "@/components/brand/motifs";
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
      {/* Hero: the front of the business card, with the quick calculator beside the promise. */}
      <section className="on-dark grain relative isolate overflow-hidden bg-forest text-cream">
        <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(90%_80%_at_80%_0%,#2a4d3c_0%,#1c382a_45%,#142a1f_100%)]" />
        <Facet start={1160} id="hero-facet" className="-z-10 hidden lg:block" />
        <CornerFacet id="hero-facet-sm" className="-z-10 lg:hidden" />

        <Container className="relative pb-16 pt-28 sm:pt-32 md:pb-24 lg:flex lg:min-h-[min(100svh,62rem)] lg:items-center lg:pb-28 lg:pt-36">
          <div className="grid w-full gap-14 lg:grid-cols-12 lg:items-center lg:gap-10">
            <div className="lg:col-span-7">
              <p className="eyebrow anb-rise">{hero.eyebrow}</p>
              <h1 className="anb-rise mt-7 text-display" style={{ "--anb-delay": "0.06s" } as React.CSSProperties}>
                {first}
                <br />
                <span className="foil anb-foil" style={{ "--anb-delay": "0.7s" } as React.CSSProperties}>
                  {second}
                </span>
              </h1>
              <p className="anb-rise mt-8 max-w-xl text-lead text-cream/75" style={{ "--anb-delay": "0.14s" } as React.CSSProperties}>
                {hero.lead}
              </p>
              <div className="anb-rise mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap" style={{ "--anb-delay": "0.2s" } as React.CSSProperties}>
                <ButtonLink href={primaryCta.href} variant="copper" size="lg" arrow>
                  {primaryCta.label}
                </ButtonLink>
                <ButtonLink href="/leistungen" variant="outline-light" size="lg">
                  Unsere Leistungen
                </ButtonLink>
              </div>
              <ul className="anb-rise mt-12 flex flex-wrap gap-x-8 gap-y-3 text-[0.9375rem] text-cream/75" style={{ "--anb-delay": "0.26s" } as React.CSSProperties}>
                {hero.highlights.map((h) => (
                  <li key={h.label} className="flex items-center gap-2.5">
                    <Icon name={h.icon} className="size-4 text-copper" />
                    {h.label}
                  </li>
                ))}
              </ul>
            </div>
            <div className="anb-rise lg:col-span-5" style={{ "--anb-delay": "0.3s" } as React.CSSProperties}>
              <QuickCalculator tariffs={tariffs} />
            </div>
          </div>
        </Container>
      </section>

      {/* Who we are, in one sentence, and the four values. */}
      <Section tone="white" space="loose" labelledBy="intro-title">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <p className="eyebrow">Über ANB Treuhand</p>
            <h2 id="intro-title" className="mt-7 font-serif text-statement text-ink">
              {intro.statement}
            </h2>
          </div>
          <div className="lg:col-span-4 lg:col-start-9 lg:self-end">
            <p className="text-lead text-body">{intro.text}</p>
            <Link href="/ueber-uns" className="group mt-7 inline-flex items-center gap-2 font-medium text-forest underline decoration-copper underline-offset-[6px] hover:decoration-2">
              Mehr über uns
              <ArrowRight aria-hidden className="size-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.75} />
            </Link>
          </div>
        </div>
        <ul className="mt-16 grid gap-x-8 gap-y-12 border-t border-line pt-14 sm:grid-cols-2 lg:mt-24 lg:grid-cols-4">
          {values.map((v) => (
            <li key={v.title} className="anb-reveal">
              <span aria-hidden className="flex size-12 items-center justify-center rounded-full border border-copper/50 bg-cream text-forest">
                <Icon name={v.icon} className="size-5" />
              </span>
              <h3 className="mt-6 font-serif text-h3 text-ink">{hyphenate(v.title, SMALL_HEADING)}</h3>
              <p className="mt-3 leading-relaxed text-body">{v.text}</p>
            </li>
          ))}
        </ul>
      </Section>

      {/* Services as an index. */}
      <Section tone="cream" labelledBy="leistungen-title">
        <SectionHeader
          id="leistungen-title"
          eyebrow="Leistungen"
          title="Alles aus einer Hand."
          text="Von der ersten Buchung bis zur Steuererklärung, von der Gründung bis zur eigenen Liegenschaft: Sie haben eine Ansprechperson für alles."
          layout="split"
        />
        <ServiceIndex items={serviceItems} className="mt-14 md:mt-20" />
      </Section>

      {/* Calculators on green. */}
      <section aria-labelledby="rechner-title" className="on-dark grain relative isolate overflow-hidden bg-forest py-20 text-cream md:py-28">
        <Facet start={1250} id="rechner-facet" className="-z-10 hidden opacity-70 lg:block" animate={false} />
        <Container className="relative">
          <SectionHeader
            id="rechner-title"
            eyebrow="Preisrechner"
            title={
              <>
                Preise, die Sie <span className="foil">vorher</span> kennen.
              </>
            }
            text="Drei Rechner, ein Prinzip: Sie wählen, was Sie brauchen, und sehen sofort den Richtpreis. Die Offerte fordern Sie mit einem Klick an."
            layout="split"
          />
          <CalculatorCards tone="dark" className="mt-14 md:mt-16" />
        </Container>
      </section>

      {/* Real estate teaser. */}
      <Section tone="white" labelledBy="immobilien-title">
        <div className="grid gap-14 lg:grid-cols-12 lg:items-center lg:gap-10">
          <div className="lg:col-span-5">
            <p className="eyebrow">Immobilien</p>
            <h2 id="immobilien-title" className="mt-7 text-h2">
              Ihre Liegenschaft in guten Händen.
            </h2>
            <p className="mt-6 text-lead text-body">
              Ob vermietete Wohnung, Mehrfamilienhaus oder Stockwerkeigentum: Wir kümmern uns um Mieterschaft, Abrechnungen und Unterhalt. Und wenn es Zeit für einen Verkauf oder
              eine Sanierung ist, begleiten wir Sie Schritt für Schritt.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
              <ButtonLink href="/immobilien" arrow>
                Immobilien-Leistungen
              </ButtonLink>
              <ButtonLink href="/rechner/immobilien" variant="outline">
                Richtpreis berechnen
              </ButtonLink>
            </div>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2 lg:col-span-6 lg:col-start-7">
            {propertyGroups.map((g, i) => (
              <li key={g.id} className={i % 2 === 1 ? "sm:translate-y-8" : undefined}>
                <Link
                  href={`/immobilien#${g.id}`}
                  className="group flex h-full flex-col rounded-[1.75rem] border border-sand/80 bg-cream/50 p-7 transition-[border-color,background-color,box-shadow] duration-500 ease-out-soft hover:border-copper/50 hover:bg-white hover:shadow-lift"
                >
                  <span aria-hidden className="flex size-11 items-center justify-center rounded-full bg-forest text-copper">
                    <Icon name={g.icon} className="size-5" />
                  </span>
                  <h3 className="mt-6 font-serif text-h3 text-ink">{hyphenate(g.title, SMALL_HEADING)}</h3>
                  <p className="mt-2.5 flex-1 text-[0.9375rem] leading-relaxed text-body">{g.lead}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-forest">
                    Mehr erfahren
                    <ArrowRight aria-hidden className="size-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.75} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* How we work together. */}
      <Section tone="cream" labelledBy="ablauf-title">
        <SectionHeader id="ablauf-title" eyebrow="Zusammenarbeit" title="So einfach starten wir." />
        <ProcessSteps steps={process} className="mt-14 md:mt-16" />
      </Section>

      {/* Customer portal, phase 2. */}
      <section aria-labelledby="portal-title" className="on-dark grain relative isolate overflow-hidden bg-forest-deep py-20 text-cream md:py-28">
        <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(70%_80%_at_85%_50%,#234536_0%,transparent_70%)]" />
        <Container className="relative">
          <div className="grid items-center gap-16 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-6">
              <p className="eyebrow">{portal.eyebrow}</p>
              <h2 id="portal-title" className="mt-7 text-h2">
                {portal.title}
              </h2>
              <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-copper/40 px-3.5 py-1 text-sm text-copper">
                <span aria-hidden className="size-1.5 rounded-full bg-copper" />
                In Vorbereitung
              </p>
              <p className="mt-6 max-w-xl text-lead text-cream/75">{portal.text}</p>
              <ul className="mt-8 space-y-3">
                {portal.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-cream/85">
                    <Check aria-hidden className="mt-1 size-4 shrink-0 text-copper" strokeWidth={2} />
                    {f}
                  </li>
                ))}
              </ul>
              <ButtonLink href="/kundenportal" variant="text-light" className="mt-10" arrow>
                Mehr zum Kundenportal
              </ButtonLink>
            </div>
            <div className="relative lg:col-span-5 lg:col-start-8">
              <MonogramOutline className="absolute left-1/2 top-1/2 -z-10 w-[150%] -translate-x-1/2 -translate-y-1/2" opacity={0.12} animate={false} />
              <PhoneMockup className="anb-reveal" />
            </div>
          </div>
        </Container>
      </section>

      {/* Questions. */}
      <Section tone="white" labelledBy="faq-title">
        <div className="grid gap-12 lg:grid-cols-12">
          <SectionHeader id="faq-title" eyebrow="Fragen" title="Gut zu wissen." className="lg:col-span-4" />
          <div className="lg:col-span-8">
            <Faq items={homeFaq} />
          </div>
        </div>
      </Section>

      <CtaBand />
      <JsonLd data={faqJsonLd(homeFaq)} />
    </>
  );
}
