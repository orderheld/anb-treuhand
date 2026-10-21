import type { Metadata } from "next";
import Link from "next/link";
import { Check, ChevronRight } from "lucide-react";
import { CtaBand } from "@/components/sections/cta-band";
import { PageHero } from "@/components/sections/page-hero";
import { JsonLd } from "@/components/seo/json-ld";
import { ButtonLink } from "@/components/ui/button";
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

/** Small round check mark in front of a list item. */
function CheckMark() {
  return (
    <span aria-hidden className="mt-0.5 flex size-[1.375rem] shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
      <Check className="size-3.5" strokeWidth={2.5} />
    </span>
  );
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
  const others = [
    ...services.filter((s) => s.slug !== slug).map((s) => ({ href: serviceHref(s.slug), name: s.short, tagline: s.tagline, icon: s.icon })),
    { href: "/immobilien", name: "Immobilien", tagline: "Verwaltung, Verkauf und Sanierung.", icon: "key" as const },
  ];

  return (
    <>
      <PageHero
        eyebrow="Leistungen"
        title={service.name}
        lead={service.summary}
        breadcrumbs={crumbs}
        aside={
          <div className="rounded-card bg-mist p-6 sm:p-7">
            <p className="kicker">Ihr Vorteil</p>
            <ul className="mt-4 grid gap-4">
              {service.promise.map((p) => (
                <li key={p.title} className="flex gap-3">
                  <CheckMark />
                  <span className="min-w-0">
                    <span className="block font-semibold text-ink">{p.title}</span>
                    <span className="mt-0.5 block text-[0.9375rem] text-body">{p.text}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        }
      >
        <ButtonLink href={contactHref} size="lg">
          Gratis Erstgespräch
        </ButtonLink>
        {calc ? (
          <ButtonLink href={calculatorHref(calc.slug)} variant="secondary" size="lg">
            Preis berechnen
          </ButtonLink>
        ) : null}
      </PageHero>

      {/* The promise in one line, the approach and who it is for. */}
      <Section tone="mist" labelledBy="ueberblick-title">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-[4.5rem]">
          <div className="min-w-0">
            <p className="kicker">Überblick</p>
            <h2 id="ueberblick-title" className="mt-2.5 text-h2">
              {hyphenate(service.tagline)}
            </h2>
          </div>
          <div className="min-w-0">
            <p className="text-lead text-body">{service.intro}</p>
            <h3 className="mt-8 text-[1.0625rem] font-semibold">Für wen</h3>
            <ul className="mt-4 grid gap-x-8 gap-y-3 sm:grid-cols-2">
              {service.audience.map((a) => (
                <li key={a} className="flex items-start gap-3 text-body">
                  <CheckMark />
                  {a}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* What exactly we do, and the matching calculator. */}
      <Section tone="white" labelledBy="leistungen-title">
        <SectionHeader id="leistungen-title" eyebrow="Das übernehmen wir" title="Im Detail." />
        <ol className="mt-10 grid gap-5 md:mt-12 md:grid-cols-2">
          {service.items.map((item, i) => (
            <li key={item.title} className="flex gap-4 rounded-card bg-mist p-6 sm:p-7">
              <span aria-hidden className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white text-[0.9375rem] font-semibold text-accent tabular">
                {i + 1}
              </span>
              <div className="min-w-0">
                <h3 className="text-[1.0625rem] font-semibold leading-snug">{hyphenate(item.title, SMALL_HEADING)}</h3>
                <p className="mt-1.5 text-[0.9375rem] text-body">{item.text}</p>
              </div>
            </li>
          ))}
        </ol>

        {calc ? (
          <div className="mt-16 flex flex-col gap-8 rounded-panel border border-line p-8 sm:p-10 md:flex-row md:items-center md:justify-between md:gap-10 md:px-12">
            <div className="min-w-0">
              <p className="kicker">{hyphenate(calc.name)}</p>
              <h2 id="preis-title" className="mt-2 text-[clamp(1.75rem,1.45rem+1vw,2.25rem)] leading-tight">
                {hyphenate(calc.title)}
              </h2>
              <p className="mt-3 max-w-xl text-body">{calc.description}</p>
            </div>
            <div className="flex shrink-0 flex-col items-start gap-2 md:items-end">
              <ButtonLink href={calculatorHref(calc.slug)} size="lg">
                Richtpreis berechnen
              </ButtonLink>
              <p className="text-sm text-muted">Unverbindlich, ohne Anmeldung.</p>
            </div>
          </div>
        ) : null}
      </Section>

      <Section tone="mist" labelledBy="faq-title">
        <div className="mx-auto max-w-[47.5rem]">
          <SectionHeader id="faq-title" eyebrow="Fragen" title="Gut zu wissen." align="center" />
          <div className="mt-10 md:mt-12">
            <Faq items={service.faq} />
          </div>
        </div>
      </Section>

      {/* The other services. */}
      <Section tone="white" labelledBy="weitere-title">
        <SectionHeader id="weitere-title" eyebrow="Weitere Leistungen" title="Alles aus einer Hand." />
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {others.map((s) => (
            <li key={s.href}>
              <Link href={s.href} className="group flex h-full flex-col rounded-card bg-mist p-5 transition-[background-color,box-shadow] duration-200 hover:bg-white hover:shadow-card">
                <span aria-hidden className="flex size-10 items-center justify-center rounded-xl bg-accent-soft text-accent">
                  <Icon name={s.icon} className="size-5" />
                </span>
                <span className="mt-4 font-semibold leading-snug text-ink">{s.name}</span>
                <span className="mt-1 flex-1 text-sm text-body">{s.tagline}</span>
                <ChevronRight aria-hidden className="mt-4 size-4 text-accent transition-transform duration-150 group-hover:translate-x-0.5" strokeWidth={2} />
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <CtaBand divider />
      <JsonLd data={[breadcrumbJsonLd(crumbs), serviceJsonLd(service, path), faqJsonLd(service.faq)]} />
    </>
  );
}
