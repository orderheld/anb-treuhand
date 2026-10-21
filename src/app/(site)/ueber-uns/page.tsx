import { Clock, Mail, MapPin, Navigation, Phone } from "lucide-react";
import { MonogramOutline } from "@/components/brand/motifs";
import { CtaBand } from "@/components/sections/cta-band";
import { PageHero } from "@/components/sections/page-hero";
import { ProcessSteps } from "@/components/sections/process-steps";
import { JsonLd } from "@/components/seo/json-ld";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
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
        <ButtonLink href={primaryCta.href} variant="copper" size="lg" arrow>
          {primaryCta.label}
        </ButtonLink>
      </PageHero>

      <Section tone="white" space="loose" labelledBy="haltung-title">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6">
            <p className="eyebrow">Unsere Haltung</p>
            <h2 id="haltung-title" className="mt-7 font-serif text-statement text-ink">
              Treuhand heisst Vertrauen. Darum arbeiten wir persönlich, transparent und verlässlich.
            </h2>
          </div>
          <div className="space-y-6 text-lead text-body lg:col-span-5 lg:col-start-8 lg:self-end">
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

      <Section tone="cream" labelledBy="werte-title">
        <SectionHeader id="werte-title" eyebrow="Was uns ausmacht" title="Vier Versprechen." />
        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v, i) => (
            <li key={v.title} className="relative flex flex-col overflow-hidden rounded-[1.75rem] border border-sand/80 bg-white p-7 shadow-card">
              <span aria-hidden className="absolute right-6 top-5 font-serif text-[3.5rem] leading-none text-cream-deep">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span aria-hidden className="relative flex size-12 items-center justify-center rounded-full border border-copper/50 bg-cream text-forest">
                <Icon name={v.icon} className="size-5" />
              </span>
              <h3 className="relative mt-6 font-serif text-h3 text-ink">{hyphenate(v.title, SMALL_HEADING)}</h3>
              <p className="relative mt-3 leading-relaxed text-body">{v.text}</p>
            </li>
          ))}
        </ul>
      </Section>

      {/* The contact person, with a monogram instead of a portrait. */}
      <Section tone="white" labelledBy="person-title">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-10">
          <div className="min-w-0 lg:col-span-5">
            <p className="eyebrow">Ihre Ansprechperson</p>
            <h2 id="person-title" className="mt-7 text-h2">
              Eine Person, die Ihr Mandat kennt.
            </h2>
            <p className="mt-6 text-lead text-body">
              Bei uns haben Sie eine feste Ansprechperson, vom Erstgespräch bis zum Jahresabschluss. Sie erreichen uns direkt, per Telefon, E-Mail oder persönlich in Langenthal.
            </p>
          </div>
          <div className="min-w-0 lg:col-span-6 lg:col-start-7">
            <div className="on-dark grain relative isolate overflow-hidden rounded-[2rem] bg-forest p-6 text-cream sm:p-10">
              <MonogramOutline className="absolute -bottom-10 -right-10 -z-10 w-[26rem]" opacity={0.14} animate={false} />
              <div className="flex items-center gap-5 sm:gap-6">
                <span aria-hidden className="flex size-16 shrink-0 items-center justify-center rounded-full border border-copper/60 font-serif text-2xl text-copper sm:size-20 sm:text-[1.75rem]">
                  {initials(person)}
                </span>
                <div className="min-w-0">
                  <p className="font-serif text-2xl leading-tight sm:text-[1.75rem]">{person}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.2em] text-copper sm:text-sm">{title}</p>
                </div>
              </div>
              <ul className="mt-9 space-y-3 border-t border-cream/10 pt-7 text-cream/85">
                {phone.value ? (
                  <li>
                    <a href={phoneHref(phone.value)} className="inline-flex items-center gap-3 transition-colors hover:text-copper">
                      <Phone aria-hidden className="size-4 text-copper" strokeWidth={1.5} />
                      <span className="tabular">{phone.value}</span>
                    </a>
                  </li>
                ) : null}
                <li>
                  <a href={`mailto:${email.value}`} className="inline-flex items-center gap-3 transition-colors hover:text-copper">
                    <Mail aria-hidden className="size-4 text-copper" strokeWidth={1.5} />
                    {email.value}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Section>

      {/* Where we are. */}
      <section aria-labelledby="standort-title" className="bg-cream py-20 md:py-28">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-5">
              <p className="eyebrow">Standort</p>
              <h2 id="standort-title" className="mt-7 text-h2">
                In Langenthal zu Hause.
              </h2>
              <p className="mt-6 text-lead text-body">
                Unser Büro liegt mitten in Langenthal. Wir arbeiten für Kundschaft im ganzen Oberaargau und im Kanton Bern. Dank digitaler Zusammenarbeit auch gerne darüber hinaus.
              </p>
            </div>
            <dl className="grid gap-8 sm:grid-cols-2 lg:col-span-6 lg:col-start-7 lg:self-end">
              <div className="rounded-[1.75rem] border border-sand/80 bg-white p-7">
                <dt className="flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.2em] text-bronze">
                  <MapPin aria-hidden className="size-4" strokeWidth={1.5} />
                  Adresse
                </dt>
                <dd className="mt-4 leading-relaxed text-ink">
                  {site.brand}
                  <br />
                  {site.contact.address.street}
                  <br />
                  {site.contact.address.postalCode} {site.contact.address.city}
                </dd>
                <dd className="mt-5">
                  <a
                    href={mapsHref()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[0.9375rem] font-medium text-forest underline decoration-copper underline-offset-[5px] hover:decoration-2"
                    aria-label={`Route planen zu ${addressLine()} (öffnet Google Maps)`}
                  >
                    <Navigation aria-hidden className="size-4" strokeWidth={1.5} />
                    Route planen
                  </a>
                </dd>
              </div>
              {openingHours.confirmed ? (
                <div className="rounded-[1.75rem] border border-sand/80 bg-white p-7">
                  <dt className="flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.2em] text-bronze">
                    <Clock aria-hidden className="size-4" strokeWidth={1.5} />
                    Bürozeiten
                  </dt>
                  {openingHours.value.map((h) => (
                    <dd key={h.days} className="mt-4 leading-relaxed text-ink">
                      {h.days}
                      <br />
                      <span className="text-body">
                        <Hours text={h.hours} />
                      </span>
                    </dd>
                  ))}
                </div>
              ) : null}
            </dl>
          </div>
        </Container>
      </section>

      <Section tone="white" labelledBy="ablauf-title">
        <SectionHeader id="ablauf-title" eyebrow="Zusammenarbeit" title="So arbeiten wir zusammen." />
        <ProcessSteps steps={process} className="mt-14 md:mt-16" />
      </Section>

      <CtaBand />
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
    </>
  );
}
