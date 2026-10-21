import { Clock, Mail, MapPin, Navigation, Phone } from "lucide-react";
import { CtaBand } from "@/components/sections/cta-band";
import { PageHero } from "@/components/sections/page-hero";
import { ProcessSteps } from "@/components/sections/process-steps";
import { JsonLd } from "@/components/seo/json-ld";
import { ButtonLink } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Section, SectionHeader } from "@/components/ui/section";
import { addressLine, mapsHref, phoneHref, site } from "@/config/site";
import { intro, process, values } from "@/content/home";
import { primaryCta } from "@/content/navigation";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { Hours } from "@/components/ui/hours";
import { SMALL_HEADING, hyphenate } from "@/lib/hyphenate";

export const metadata = pageMetadata({
  title: "Über uns: Ihre Treuhand in Langenthal",
  description:
    "ANB Treuhand ist ein junges, aufgestelltes Team mit professioneller Erfahrung in Buchhaltung, Steuern und Immobilien. Persönlich, transparent und digital, mitten in Langenthal.",
  path: "/ueber-uns",
});

const crumbs = [
  { name: "Start", path: "/" },
  { name: "Über uns", path: "/ueber-uns" },
];

/** "Ali Aliji" → "AA", for the monogram in place of a portrait. */
function initials(name: string): string {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function UeberUnsPage() {
  const { person, title, phone, email, openingHours } = site.contact;
  return (
    <>
      <PageHero eyebrow="Über uns" title="Jung, engagiert und mit Erfahrung." lead={intro.text} breadcrumbs={crumbs}>
        <ButtonLink href={primaryCta.href} size="lg">
          {primaryCta.label}
        </ButtonLink>
      </PageHero>

      <Section tone="mist" labelledBy="haltung-title">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-[4.5rem]">
          <div className="min-w-0">
            <p className="kicker">Unsere Haltung</p>
            <h2 id="haltung-title" className="mt-2.5 text-h2">
              Treuhand heisst Vertrauen. Darum arbeiten wir persönlich, transparent und verlässlich.
            </h2>
          </div>
          <div className="min-w-0 space-y-5 text-lead text-body lg:self-end">
            <p>
              Eine gute Treuhand ist mehr als Buchhaltung: Sie gibt Ihnen Sicherheit und Zeit. Deshalb hören wir zuerst zu, erklären verständlich und behalten Fristen im Blick, damit
              Sie es nicht müssen.
            </p>
            <p>
              Unsere Kundschaft reicht vom Einzelunternehmen über die GmbH bis zur Eigentümergemeinschaft. Was alle verbindet: Sie wollen sich auf das Wesentliche konzentrieren und
              wissen, dass ihre Zahlen stimmen.
            </p>
          </div>
        </div>
      </Section>

      <Section tone="white" labelledBy="werte-title">
        <SectionHeader id="werte-title" eyebrow="Was uns ausmacht" title="Vier Versprechen." align="center" />
        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v) => (
            <li key={v.title} className="flex flex-col rounded-card bg-mist p-6">
              <span aria-hidden className="flex size-11 items-center justify-center rounded-xl bg-accent-soft text-accent">
                <Icon name={v.icon} className="size-5" />
              </span>
              <h3 className="mt-4 text-[1.0625rem] font-semibold leading-snug">{hyphenate(v.title, SMALL_HEADING)}</h3>
              <p className="mt-1.5 text-[0.9375rem] text-body">{v.text}</p>
            </li>
          ))}
        </ul>
      </Section>

      {/* The contact person, with initials instead of a portrait. */}
      <Section tone="mist" labelledBy="person-title">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-[4.5rem]">
          <div className="min-w-0">
            <p className="kicker">Ihre Ansprechperson</p>
            <h2 id="person-title" className="mt-2.5 text-h2">
              Eine Person, die Ihr Mandat kennt.
            </h2>
            <p className="mt-5 text-lead text-body">
              Bei uns haben Sie eine feste Ansprechperson, vom Erstgespräch bis zum Jahresabschluss. Sie erreichen uns direkt, per Telefon, E-Mail oder persönlich in Langenthal.
            </p>
          </div>
          <div className="min-w-0 rounded-panel bg-white p-7 shadow-card sm:p-9">
            <div className="flex items-center gap-5">
              <span aria-hidden className="flex size-16 shrink-0 items-center justify-center rounded-full bg-accent-soft text-xl font-semibold text-accent">
                {initials(person)}
              </span>
              <div className="min-w-0">
                <p className="font-serif text-[1.75rem] font-medium leading-tight text-ink">{person}</p>
                <p className="mt-0.5 text-[0.9375rem] text-muted">{title}</p>
              </div>
            </div>
            <ul className="mt-7 grid gap-3 border-t border-line pt-6 text-body">
              {phone.value ? (
                <li>
                  <a href={phoneHref(phone.value)} className="inline-flex items-center gap-3 transition-colors hover:text-accent">
                    <Phone aria-hidden className="size-4 text-accent" strokeWidth={1.75} />
                    <span className="tabular">{phone.value}</span>
                  </a>
                </li>
              ) : null}
              <li>
                <a href={`mailto:${email.value}`} className="inline-flex items-center gap-3 transition-colors hover:text-accent">
                  <Mail aria-hidden className="size-4 text-accent" strokeWidth={1.75} />
                  {email.value}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </Section>

      {/* Where we are. */}
      <Section tone="white" labelledBy="standort-title">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-[4.5rem]">
          <div className="min-w-0">
            <p className="kicker">Standort</p>
            <h2 id="standort-title" className="mt-2.5 text-h2">
              In Langenthal zu Hause.
            </h2>
            <p className="mt-5 text-lead text-body">
              Unser Büro liegt mitten in Langenthal. Wir arbeiten für Kundschaft im ganzen Oberaargau und im Kanton Bern. Dank digitaler Zusammenarbeit auch gerne darüber hinaus.
            </p>
          </div>
          <dl className="grid content-end gap-5 sm:grid-cols-2">
            <div className="rounded-card bg-mist p-6">
              <dt className="flex items-center gap-2 font-semibold text-ink">
                <MapPin aria-hidden className="size-4 text-accent" strokeWidth={1.75} />
                Adresse
              </dt>
              <dd className="mt-3 text-body">
                {site.brand}
                <br />
                {site.contact.address.street}
                <br />
                {site.contact.address.postalCode} {site.contact.address.city}
              </dd>
              <dd className="mt-4">
                <a
                  href={mapsHref()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[0.9375rem] font-medium text-accent hover:text-accent-hover"
                  aria-label={`Route planen zu ${addressLine()} (öffnet Google Maps)`}
                >
                  <Navigation aria-hidden className="size-4" strokeWidth={1.75} />
                  Route planen
                </a>
              </dd>
            </div>
            {openingHours.confirmed ? (
              <div className="rounded-card bg-mist p-6">
                <dt className="flex items-center gap-2 font-semibold text-ink">
                  <Clock aria-hidden className="size-4 text-accent" strokeWidth={1.75} />
                  Bürozeiten
                </dt>
                {openingHours.value.map((h) => (
                  <dd key={h.days} className="mt-3 text-body">
                    {h.days}
                    <br />
                    <Hours text={h.hours} />
                  </dd>
                ))}
              </div>
            ) : null}
          </dl>
        </div>
      </Section>

      <Section tone="mist" labelledBy="ablauf-title">
        <SectionHeader id="ablauf-title" eyebrow="Zusammenarbeit" title="So arbeiten wir zusammen." align="center" />
        <ProcessSteps steps={process} className="mt-12 md:mt-14" />
      </Section>

      <CtaBand />
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
    </>
  );
}
