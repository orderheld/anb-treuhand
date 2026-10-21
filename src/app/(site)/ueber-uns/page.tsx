import { Clock, MapPin } from "lucide-react";
import { CtaBand } from "@/components/sections/cta-band";
import { PageHero } from "@/components/sections/page-hero";
import { ProcessSteps } from "@/components/sections/process-steps";
import { JsonLd } from "@/components/seo/json-ld";
import { ButtonLink } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Section, SectionHeader } from "@/components/ui/section";
import { site } from "@/config/site";
import { intro, process, values } from "@/content/home";
import { primaryCta } from "@/content/navigation";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { Hours } from "@/components/ui/hours";
import { SMALL_HEADING, hyphenate } from "@/lib/hyphenate";

export const metadata = pageMetadata({
  title: "Über uns: jung, engagiert und mit Erfahrung",
  description:
    "ANB Treuhand ist ein junges, aufgestelltes Team mit professioneller Erfahrung in Buchhaltung, Steuern und Immobilien. Persönlich, transparent und digital.",
  path: "/ueber-uns",
});

const crumbs = [
  { name: "Start", path: "/" },
  { name: "Über uns", path: "/ueber-uns" },
];

export default function UeberUnsPage() {
  const { openingHours } = site.contact;
  return (
    <>
      <PageHero eyebrow="Über uns" title="Jung, engagiert und mit Erfahrung" lead={intro.text} breadcrumbs={crumbs}>
        <ButtonLink href={primaryCta.href} size="lg">
          {primaryCta.label}
        </ButtonLink>
      </PageHero>

      <Section tone="mist" labelledBy="haltung-title">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-[4.5rem]">
          <div className="min-w-0">
            <p className="kicker">Unsere Haltung</p>
            <h2 id="haltung-title" className="mt-2.5 text-h2">
              Treuhand heisst Vertrauen, darum arbeiten wir persönlich, transparent und verlässlich
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
        <SectionHeader id="werte-title" eyebrow="Was uns ausmacht" title="Vier Versprechen" align="center" />
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

      {/* Where we are. */}
      <Section tone="mist" labelledBy="standort-title">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-[4.5rem]">
          <div className="min-w-0">
            <p className="kicker">Standort</p>
            <h2 id="standort-title" className="mt-2.5 text-h2">
              Persönlich vor Ort, digital von überall
            </h2>
            <p className="mt-5 text-lead text-body">
              Unser Büro ist in Langenthal. Wir treffen Sie dort, bei Ihnen oder per Video. Dank digitaler Zusammenarbeit spielt es keine Rolle, wo Sie zu Hause sind.
            </p>
          </div>
          <dl className="grid content-end gap-5 sm:grid-cols-2">
            <div className="rounded-card bg-white p-6">
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
            </div>
            {openingHours.confirmed ? (
              <div className="rounded-card bg-white p-6">
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

      <Section tone="white" labelledBy="ablauf-title">
        <SectionHeader id="ablauf-title" eyebrow="Zusammenarbeit" title="So arbeiten wir zusammen" align="center" />
        <ProcessSteps steps={process} className="mt-12 md:mt-14" />
      </Section>

      <CtaBand divider />
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
    </>
  );
}
