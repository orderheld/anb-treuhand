import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Facet } from "@/components/brand/motifs";
import { CtaBand } from "@/components/sections/cta-band";
import { PageHero } from "@/components/sections/page-hero";
import { JsonLd } from "@/components/seo/json-ld";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Faq } from "@/components/ui/faq";
import { Icon } from "@/components/ui/icon";
import { Section, SectionHeader } from "@/components/ui/section";
import { propertyFaq, propertyGroups } from "@/content/immobilien";
import { propertyTypes } from "@/lib/calculators/immobilien";
import { breadcrumbJsonLd, faqJsonLd, pageMetadata, serviceJsonLd } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { SMALL_HEADING, hyphenate } from "@/lib/hyphenate";

const description =
  "Immobilienverwaltung, Stockwerkeigentum, Nebenkostenabrechnung, Immobilienbuchhaltung, Verkauf, Sanierung und Baubegleitung in Langenthal und im Oberaargau. Richtpreis online berechnen.";

export const metadata = pageMetadata({
  title: "Immobilien: Verwaltung, Verkauf und Sanierung in Langenthal",
  description,
  path: "/immobilien",
});

const crumbs = [
  { name: "Start", path: "/" },
  { name: "Immobilien", path: "/immobilien" },
];

export default function ImmobilienPage() {
  return (
    <>
      <PageHero
        eyebrow="Immobilien"
        title="Ihre Liegenschaft in guten Händen."
        lead="Wir verwalten Mietliegenschaften und Stockwerkeigentum, erstellen die Abrechnungen, begleiten Verkäufe und koordinieren Sanierungen. Zuverlässig, erreichbar und mit klaren Abläufen."
        breadcrumbs={crumbs}
        aside={
          <nav aria-labelledby="objektart-title" className="rounded-[1.75rem] border border-cream/12 bg-forest-deep/60 p-7 backdrop-blur-md">
            <p id="objektart-title" className="text-[0.6875rem] font-medium uppercase tracking-[0.24em] text-copper">
              Richtpreis berechnen für
            </p>
            <ul className="mt-4 divide-y divide-cream/10">
              {propertyTypes.map((p) => (
                <li key={p.value}>
                  <Link href={`/rechner/immobilien?art=${p.value}`} className="group flex items-center justify-between gap-4 py-3 text-cream/85 transition-colors hover:text-copper">
                    {p.label}
                    <ArrowRight aria-hidden className="size-4 text-copper/70 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.75} />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        }
      >
        <ButtonLink href="/rechner/immobilien" variant="copper" size="lg" arrow>
          Richtpreis berechnen
        </ButtonLink>
        <ButtonLink href="/kontakt?anliegen=immobilien" variant="outline-light" size="lg">
          Beratung anfragen
        </ButtonLink>
      </PageHero>

      {/* The four areas, alternating white and cream. */}
      {propertyGroups.map((group, gi) => (
        <section
          key={group.id}
          id={group.id}
          aria-labelledby={`${group.id}-title`}
          className={cn("scroll-mt-20 py-20 md:py-28", gi % 2 === 0 ? "bg-white" : "bg-cream")}
        >
          <Container>
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
              <div className="min-w-0 lg:col-span-4">
                <div className="lg:sticky lg:top-32">
                  <span aria-hidden className="flex size-14 items-center justify-center rounded-full bg-forest text-copper">
                    <Icon name={group.icon} className="size-6" />
                  </span>
                  <p className="eyebrow mt-8">{String(gi + 1).padStart(2, "0")} / {String(propertyGroups.length).padStart(2, "0")}</p>
                  <h2 id={`${group.id}-title`} className="mt-5 text-h2">
                    {hyphenate(group.title)}
                  </h2>
                  <p className="mt-5 text-lead text-body">{group.lead}</p>
                </div>
              </div>
              <ul className="min-w-0 border-t border-sand lg:col-span-7 lg:col-start-6">
                {group.items.map((item) => (
                  <li key={item.title} className="border-b border-sand py-7">
                    <h3 className="font-serif text-h3 text-ink">{hyphenate(item.title, SMALL_HEADING)}</h3>
                    <p className="mt-2.5 max-w-2xl leading-relaxed text-body">{item.text}</p>
                  </li>
                ))}
              </ul>
            </div>
          </Container>
        </section>
      ))}

      {/* Calculator. */}
      <section aria-labelledby="preis-title" className="bg-white pb-20 md:pb-28">
        <Container>
          <div className="on-dark grain relative isolate overflow-hidden rounded-[2rem] bg-forest px-6 py-12 text-cream sm:px-12 md:py-16">
            <Facet start={1300} id="preis-facet" className="-z-10 hidden opacity-80 md:block" animate={false} />
            <div className="grid gap-10 md:grid-cols-12 md:items-center">
              <div className="min-w-0 md:col-span-7">
                <p className="eyebrow">Immobilien-Rechner</p>
                <h2 id="preis-title" className="mt-6 font-serif text-[clamp(1.875rem,1.4rem+1.6vw,2.75rem)] leading-tight">
                  Was kostet die Verwaltung Ihrer Liegenschaft?
                </h2>
                <p className="mt-5 max-w-xl text-lead text-cream/75">
                  Art, Grösse und Mieteinnahmen eingeben, Leistungen wählen und sofort den Richtpreis sehen. Auch für Verkauf und Sanierung.
                </p>
              </div>
              <div className="flex flex-col gap-4 md:col-span-5 md:items-end">
                <ButtonLink href="/rechner/immobilien" variant="copper" size="lg" arrow>
                  Richtpreis berechnen
                </ButtonLink>
                <p className="text-sm text-cream/60">Unverbindlich, ohne Anmeldung.</p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <Section tone="cream" labelledBy="faq-title">
        <div className="grid gap-12 lg:grid-cols-12">
          <SectionHeader id="faq-title" eyebrow="Fragen" title="Gut zu wissen." className="lg:col-span-4" />
          <div className="lg:col-span-8">
            <Faq items={propertyFaq} />
          </div>
        </div>
      </Section>

      <CtaBand title="Sprechen wir über Ihre Liegenschaft." text="Wir schauen uns Ihre Situation an und zeigen Ihnen, wie wir Sie entlasten können. Unverbindlich, vor Ort oder bei uns in Langenthal." />
      <JsonLd
        data={[
          breadcrumbJsonLd(crumbs),
          serviceJsonLd({ name: "Immobilienverwaltung, Verkauf und Sanierung", metaDescription: description }, "/immobilien"),
          faqJsonLd(propertyFaq),
        ]}
      />
    </>
  );
}
