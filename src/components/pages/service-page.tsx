import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Facet } from "@/components/brand/motifs";
import { CtaBand } from "@/components/sections/cta-band";
import { PageHero } from "@/components/sections/page-hero";
import { JsonLd } from "@/components/seo/json-ld";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Faq } from "@/components/ui/faq";
import { Icon } from "@/components/ui/icon";
import { Section, SectionHeader } from "@/components/ui/section";
import { calculatorHref, getCalculator } from "@/content/calculators";
import { serviceHref, services } from "@/content/services";
import type { Service } from "@/content/types";
import type { Topic } from "@/lib/requests/options";
import { breadcrumbJsonLd, faqJsonLd, pageMetadata, serviceJsonLd } from "@/lib/seo";
import { SMALL_HEADING, hyphenate } from "@/lib/hyphenate";

/**
 * Page of one fiduciary service. Each service has its own static route (leistungen/buchhaltung …)
 * that renders this component, so no page reads URL data.
 */

/** Topic preselected in the contact form (?anliegen=). */
const contactTopic: Record<Service["slug"], Topic> = {
  buchhaltung: "buchhaltung",
  steuern: "steuern",
  firmengruendung: "gruendung",
  lohnbuchhaltung: "lohn",
  unternehmensberatung: "beratung",
};

function getService(slug: Service["slug"]): Service {
  return services.find((s) => s.slug === slug)!;
}

export function serviceMetadata(slug: Service["slug"]): Metadata {
  const service = getService(slug);
  return pageMetadata({ title: service.metaTitle, description: service.metaDescription, path: serviceHref(slug) });
}

export function ServicePage({ slug }: { slug: Service["slug"] }) {
  const service = getService(slug);
  const path = serviceHref(slug);
  const calc = service.calculator ? getCalculator(service.calculator) : null;
  const contactHref = `/kontakt?anliegen=${contactTopic[slug]}`;
  const crumbs = [
    { name: "Start", path: "/" },
    { name: "Leistungen", path: "/leistungen" },
    { name: service.short, path },
  ];
  const others = services.filter((s) => s.slug !== slug);

  return (
    <>
      <PageHero
        eyebrow="Leistungen"
        title={service.name}
        lead={service.summary}
        breadcrumbs={crumbs}
        aside={
          <div className="rounded-[1.75rem] border border-cream/12 bg-forest-deep/60 p-7 backdrop-blur-md">
            <p className="text-[0.6875rem] font-medium uppercase tracking-[0.24em] text-copper">Ihr Vorteil</p>
            <ul className="mt-5 space-y-5">
              {service.promise.map((p) => (
                <li key={p.title} className="flex gap-3.5">
                  <Check aria-hidden className="mt-1 size-4 shrink-0 text-copper" strokeWidth={2} />
                  <span className="min-w-0">
                    <span className="block font-medium text-cream">{p.title}</span>
                    <span className="mt-0.5 block text-[0.9375rem] leading-relaxed text-cream/70">{p.text}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        }
      >
        <ButtonLink href={contactHref} variant="copper" size="lg" arrow>
          Gratis Erstgespräch
        </ButtonLink>
        {calc ? (
          <ButtonLink href={calculatorHref(calc.slug)} variant="outline-light" size="lg">
            Preis berechnen
          </ButtonLink>
        ) : null}
      </PageHero>

      {/* The promise in one line, the approach and who it is for. */}
      <Section tone="white" labelledBy="ueberblick-title">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <p className="eyebrow">Überblick</p>
            <h2 id="ueberblick-title" className="mt-7 text-h2">
              {hyphenate(service.tagline)}
            </h2>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <p className="text-lead text-body">{service.intro}</p>
            <h3 className="mt-12 text-xs font-medium uppercase tracking-[0.22em] text-bronze">Für wen</h3>
            <ul className="mt-5 grid gap-x-8 gap-y-3 sm:grid-cols-2">
              {service.audience.map((a) => (
                <li key={a} className="flex items-start gap-3 text-body">
                  <span aria-hidden className="mt-[0.8em] h-px w-4 shrink-0 bg-copper" />
                  {a}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* What exactly we do. */}
      <Section tone="cream" labelledBy="leistungen-title">
        <SectionHeader id="leistungen-title" eyebrow="Das übernehmen wir" title="Im Detail." />
        <ol className="mt-14 grid gap-x-12 border-t border-sand md:mt-16 md:grid-cols-2">
          {service.items.map((item, i) => (
            <li key={item.title} className="flex gap-5 border-b border-sand py-8 md:gap-6">
              <span aria-hidden className="pt-1 font-serif text-lg text-bronze tabular">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0">
                <h3 className="font-serif text-h3 text-ink">{hyphenate(item.title, SMALL_HEADING)}</h3>
                <p className="mt-2.5 leading-relaxed text-body">{item.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      {/* Price: link to the matching calculator. */}
      {calc ? (
        <section aria-labelledby="preis-title" className="bg-cream pb-20 md:pb-28">
          <Container>
            <div className="on-dark grain relative isolate overflow-hidden rounded-[2rem] bg-forest px-6 py-12 text-cream sm:px-12 md:py-16">
              <Facet start={1300} id="preis-facet" className="-z-10 hidden opacity-80 md:block" animate={false} />
              <div className="grid gap-10 md:grid-cols-12 md:items-center">
                <div className="min-w-0 md:col-span-7">
                  <p className="eyebrow">{hyphenate(calc.name)}</p>
                  <h2 id="preis-title" className="mt-6 font-serif text-[clamp(1.875rem,1.4rem+1.6vw,2.75rem)] leading-tight">
                    {hyphenate(calc.title)}
                  </h2>
                  <p className="mt-5 max-w-xl text-lead text-cream/75">{calc.description}</p>
                </div>
                <div className="flex flex-col gap-4 md:col-span-5 md:items-end">
                  <ButtonLink href={calculatorHref(calc.slug)} variant="copper" size="lg" arrow>
                    Richtpreis berechnen
                  </ButtonLink>
                  <p className="text-sm text-cream/60">Unverbindlich, ohne Anmeldung.</p>
                </div>
              </div>
            </div>
          </Container>
        </section>
      ) : null}

      <Section tone="white" labelledBy="faq-title">
        <div className="grid gap-12 lg:grid-cols-12">
          <SectionHeader id="faq-title" eyebrow="Fragen" title="Gut zu wissen." className="lg:col-span-4" />
          <div className="lg:col-span-8">
            <Faq items={service.faq} />
          </div>
        </div>
      </Section>

      {/* The other services. */}
      <Section tone="cream" space="tight" labelledBy="weitere-title">
        <SectionHeader id="weitere-title" eyebrow="Weitere Leistungen" title="Alles aus einer Hand." />
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {[...others.map((s) => ({ href: serviceHref(s.slug), name: s.short, tagline: s.tagline, icon: s.icon })), { href: "/immobilien", name: "Immobilien", tagline: "Verwaltung, Verkauf und Sanierung.", icon: "key" as const }].map(
            (s) => (
              <li key={s.href}>
                <Link
                  href={s.href}
                  className="group flex h-full flex-col rounded-2xl border border-sand/80 bg-white p-6 transition-[border-color,box-shadow,transform] duration-500 ease-out-soft hover:-translate-y-0.5 hover:border-copper/50 hover:shadow-lift"
                >
                  <Icon name={s.icon} className="size-5 text-bronze" />
                  <span className="mt-5 font-serif text-[1.375rem] leading-tight text-ink">{s.name}</span>
                  <span className="mt-1.5 flex-1 text-sm leading-snug text-muted">{s.tagline}</span>
                  <ArrowRight aria-hidden className="mt-5 size-4 text-forest transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.75} />
                </Link>
              </li>
            ),
          )}
        </ul>
      </Section>

      <CtaBand />
      <JsonLd data={[breadcrumbJsonLd(crumbs), serviceJsonLd(service, path), faqJsonLd(service.faq)]} />
    </>
  );
}
