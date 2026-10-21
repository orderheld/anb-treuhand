import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CalculatorCards } from "@/components/sections/calculator-cards";
import { CtaBand } from "@/components/sections/cta-band";
import { PageHero } from "@/components/sections/page-hero";
import { ServiceIndex, type ServiceIndexItem } from "@/components/sections/service-index";
import { JsonLd } from "@/components/seo/json-ld";
import { ButtonLink } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Section, SectionHeader } from "@/components/ui/section";
import type { IconName } from "@/content/types";
import { primaryCta } from "@/content/navigation";
import { serviceHref, services } from "@/content/services";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { SMALL_HEADING, hyphenate } from "@/lib/hyphenate";

export const metadata = pageMetadata({
  title: "Leistungen: Buchhaltung, Steuern, Löhne, Gründung und Immobilien",
  description:
    "Alle Leistungen von ANB Treuhand in Langenthal: Buchhaltung, Steuern, Lohnbuchhaltung, Firmengründungen, Unternehmensberatung und Immobilien. Persönlich betreut, mit Online-Preisrechner.",
  path: "/leistungen",
});

const crumbs = [
  { name: "Start", path: "/" },
  { name: "Leistungen", path: "/leistungen" },
];

const items: ServiceIndexItem[] = [
  ...services.map((s) => ({ href: serviceHref(s.slug), name: s.name, tagline: s.tagline, summary: s.summary, icon: s.icon })),
  {
    href: "/immobilien",
    name: "Immobilien",
    tagline: "Verwaltung, Verkauf und Sanierung.",
    summary: "Wir verwalten Mietliegenschaften und Stockwerkeigentum, begleiten Verkäufe und koordinieren Sanierungen von der Offerte bis zur Abnahme.",
    icon: "key",
  },
];

/** Who typically works with ANB, with the services that matter most to them. */
const audiences: { icon: IconName; title: string; text: string; links: { href: string; label: string }[] }[] = [
  {
    icon: "building",
    title: "KMU",
    text: "Buchhaltung, Löhne, MWST und Abschluss aus einer Hand, mit einer festen Ansprechperson, die Ihr Unternehmen kennt.",
    links: [
      { href: serviceHref("buchhaltung"), label: "Buchhaltung" },
      { href: serviceHref("lohnbuchhaltung"), label: "Lohnbuchhaltung" },
    ],
  },
  {
    icon: "sparkles",
    title: "Gründerinnen und Gründer",
    text: "Von der Wahl der Rechtsform bis zum Handelsregister, auf Wunsch mit eingerichteter Buchhaltung ab dem ersten Tag.",
    links: [
      { href: serviceHref("firmengruendung"), label: "Firmengründung" },
      { href: "/rechner/firmengruendung", label: "Gründungsrechner" },
    ],
  },
  {
    icon: "users",
    title: "Selbstständige",
    text: "Eine schlanke Buchhaltung, die Steuererklärung für Geschäft und Privat und ehrliche Beratung, wenn es um Wachstum geht.",
    links: [
      { href: serviceHref("steuern"), label: "Steuern" },
      { href: serviceHref("unternehmensberatung"), label: "Beratung" },
    ],
  },
  {
    icon: "home",
    title: "Privatpersonen und Eigentümer",
    text: "Die private Steuererklärung, die Verwaltung Ihrer Liegenschaft oder die Begleitung beim Verkauf und bei Sanierungen.",
    links: [
      { href: serviceHref("steuern"), label: "Steuererklärung" },
      { href: "/immobilien", label: "Immobilien" },
    ],
  },
];

export default function LeistungenPage() {
  return (
    <>
      <PageHero
        eyebrow="Leistungen"
        title="Alles, was Ihre Zahlen brauchen."
        lead="Buchhaltung, Steuern, Löhne, Gründung, Beratung und Immobilien: Sie wählen, was Sie brauchen. Wir kümmern uns darum, persönlich und zuverlässig."
        breadcrumbs={crumbs}
      >
        <ButtonLink href={primaryCta.href} variant="copper" size="lg" arrow>
          {primaryCta.label}
        </ButtonLink>
        <ButtonLink href="/rechner" variant="outline-light" size="lg">
          Preise berechnen
        </ButtonLink>
      </PageHero>

      <Section tone="white" labelledBy="uebersicht-title">
        <h2 id="uebersicht-title" className="sr-only">
          Unsere Leistungen
        </h2>
        <ServiceIndex items={items} />
      </Section>

      <Section tone="cream" labelledBy="fuer-wen-title">
        <SectionHeader
          id="fuer-wen-title"
          eyebrow="Für wen"
          title="Für Unternehmen und Menschen mit Plänen."
          text="Ob Sie ein Unternehmen führen, gerade gründen oder eine Liegenschaft besitzen: Wir stellen die Leistungen so zusammen, wie Sie sie brauchen."
          layout="split"
        />
        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {audiences.map((a) => (
            <li key={a.title} className="flex flex-col rounded-[1.75rem] border border-sand/80 bg-white p-7 shadow-card">
              <span aria-hidden className="flex size-12 items-center justify-center rounded-full border border-copper/50 bg-cream text-forest">
                <Icon name={a.icon} className="size-5" />
              </span>
              <h3 className="mt-6 font-serif text-h3 text-ink">{hyphenate(a.title, SMALL_HEADING)}</h3>
              <p className="mt-3 flex-1 leading-relaxed text-body">{a.text}</p>
              <ul className="mt-6 space-y-2 border-t border-line pt-5">
                {a.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="group inline-flex items-center gap-2 text-[0.9375rem] font-medium text-forest hover:text-bronze">
                      {l.label}
                      <ArrowRight aria-hidden className="size-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.75} />
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="white" labelledBy="rechner-title">
        <SectionHeader
          id="rechner-title"
          eyebrow="Preisrechner"
          title="Was kostet das?"
          text="Mit unseren Rechnern sehen Sie in einer Minute, womit Sie rechnen können. Die Offerte fordern Sie direkt im Rechner an."
          layout="split"
        />
        <CalculatorCards className="mt-14" />
      </Section>

      <CtaBand />
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
    </>
  );
}
