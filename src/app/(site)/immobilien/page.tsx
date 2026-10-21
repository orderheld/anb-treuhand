import Link from "next/link";
import { ChevronRight } from "lucide-react";
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
  "Immobilienverwaltung, Stockwerkeigentum, Nebenkostenabrechnung, Immobilienbuchhaltung, Verkauf, Sanierung und Baubegleitung. Richtpreis online berechnen.";

export const metadata = pageMetadata({
  title: "Immobilien: Verwaltung, Verkauf und Sanierung",
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
        title="Ihre Liegenschaft in guten Händen"
        lead="Wir verwalten Mietliegenschaften und Stockwerkeigentum, erstellen die Abrechnungen, begleiten Verkäufe und koordinieren Sanierungen. Zuverlässig, erreichbar und mit klaren Abläufen."
        breadcrumbs={crumbs}
        aside={
          <nav aria-labelledby="objektart-title" className="rounded-card bg-mist p-6 sm:p-7">
            <p id="objektart-title" className="kicker">
              Richtpreis berechnen für
            </p>
            <ul className="mt-3 divide-y divide-line">
              {propertyTypes.map((p) => (
                <li key={p.value}>
                  <Link href={`/rechner/immobilien?art=${p.value}`} className="group flex items-center justify-between gap-4 py-3 text-ink transition-colors hover:text-accent">
                    {p.label}
                    <ChevronRight aria-hidden className="size-4 text-muted transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-accent" strokeWidth={2} />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        }
      >
        <ButtonLink href="/rechner/immobilien" size="lg">
          Richtpreis berechnen
        </ButtonLink>
        <ButtonLink href="/kontakt?anliegen=immobilien" variant="secondary" size="lg">
          Beratung anfragen
        </ButtonLink>
      </PageHero>

      {/* The four areas, alternating grey and white. */}
      {propertyGroups.map((group, gi) => (
        <section
          key={group.id}
          id={group.id}
          aria-labelledby={`${group.id}-title`}
          className={cn("scroll-mt-20 py-[clamp(4.5rem,8vw,7rem)]", gi % 2 === 0 ? "bg-mist" : "bg-white")}
        >
          <Container>
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-10">
              <div className="min-w-0 lg:col-span-5">
                <div className="lg:sticky lg:top-28">
                  <span aria-hidden className="flex size-11 items-center justify-center rounded-xl bg-accent-soft text-accent">
                    <Icon name={group.icon} className="size-5" />
                  </span>
                  <p className="kicker mt-5">
                    Bereich {gi + 1} von {propertyGroups.length}
                  </p>
                  <h2 id={`${group.id}-title`} className="mt-2 text-h2">
                    {hyphenate(group.title)}
                  </h2>
                  <p className="mt-4 text-lead text-body">{group.lead}</p>
                </div>
              </div>
              <ul className="min-w-0 border-t border-line lg:col-span-7 lg:col-start-6 lg:mt-1">
                {group.items.map((item) => (
                  <li key={item.title} className="border-b border-line py-6">
                    <h3 className="text-[1.0625rem] font-semibold leading-snug">{hyphenate(item.title, SMALL_HEADING)}</h3>
                    <p className="mt-1.5 max-w-2xl text-body">{item.text}</p>
                  </li>
                ))}
              </ul>
            </div>
          </Container>
        </section>
      ))}

      {/* Calculator. */}
      <section aria-labelledby="preis-title" className="bg-mist pb-[clamp(4.5rem,8vw,7rem)]">
        <Container>
          <div className="flex flex-col gap-8 rounded-panel bg-white p-8 shadow-hairline sm:p-10 md:flex-row md:items-center md:justify-between md:gap-10 md:px-12">
            <div className="min-w-0">
              <p className="kicker">Immobilien-Rechner</p>
              <h2 id="preis-title" className="mt-2 text-[clamp(1.75rem,1.45rem+1vw,2.25rem)] leading-tight">
                Was kostet die Verwaltung Ihrer Liegenschaft?
              </h2>
              <p className="mt-3 max-w-xl text-body">
                Art, Grösse und Mieteinnahmen eingeben, Leistungen wählen und sofort den Richtpreis sehen. Auch für Verkauf und Sanierung.
              </p>
            </div>
            <div className="flex shrink-0 flex-col items-start gap-2 md:items-end">
              <ButtonLink href="/rechner/immobilien" size="lg">
                Richtpreis berechnen
              </ButtonLink>
              <p className="text-sm text-muted">Unverbindlich, ohne Anmeldung.</p>
            </div>
          </div>
        </Container>
      </section>

      <Section tone="white" labelledBy="faq-title">
        <div className="mx-auto max-w-[47.5rem]">
          <SectionHeader id="faq-title" eyebrow="Fragen" title="Gut zu wissen" align="center" />
          <div className="mt-10 md:mt-12">
            <Faq items={propertyFaq} />
          </div>
        </div>
      </Section>

      <CtaBand
        divider
        title="Sprechen wir über Ihre Liegenschaft"
        text="Wir schauen uns Ihre Situation an und zeigen Ihnen, wie wir Sie entlasten können. Unverbindlich, vor Ort oder bei uns in Langenthal."
      />
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
