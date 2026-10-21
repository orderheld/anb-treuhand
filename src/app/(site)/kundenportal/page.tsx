import { Camera, FileDown, FileUp, ListChecks, Mail, MessageSquareLock, MapPin, ScanLine } from "lucide-react";
import { PhoneMockup } from "@/components/home/phone-mockup";
import { CtaBand } from "@/components/sections/cta-band";
import { PageHero } from "@/components/sections/page-hero";
import { JsonLd } from "@/components/seo/json-ld";
import { ButtonLink } from "@/components/ui/button";
import { Section, SectionHeader } from "@/components/ui/section";
import { site } from "@/config/site";
import { portal } from "@/content/home";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { SMALL_HEADING, hyphenate } from "@/lib/hyphenate";

export const metadata = pageMetadata({
  title: "Kundenportal: Belege und Steuerunterlagen digital einreichen",
  description:
    "Das Kundenportal von ANB Treuhand ist in Vorbereitung: Belege per Smartphone hochladen, Steuerunterlagen digital einreichen und Dokumente sicher austauschen.",
  path: "/kundenportal",
});

const crumbs = [
  { name: "Start", path: "/" },
  { name: "Kundenportal", path: "/kundenportal" },
];

const features = [
  { icon: Camera, title: "Belege per Foto", text: "Rechnungen und Quittungen mit dem Smartphone fotografieren und direkt hochladen, statt Schuhkarton und Ordner." },
  { icon: FileUp, title: "Steuerunterlagen digital", text: "Lohnausweis, Bankauszüge und Belege für die Steuererklärung bequem von zu Hause einreichen." },
  { icon: FileDown, title: "Dokumente von uns", text: "Abschlüsse, Steuererklärungen und Lohnabrechnungen jederzeit abrufbar, an einem sicheren Ort." },
  { icon: ListChecks, title: "Offene Punkte im Blick", text: "Sehen, welche Unterlagen noch fehlen und was als Nächstes ansteht. Ohne Nachfragen per E-Mail." },
  { icon: MessageSquareLock, title: "Sicher kommunizieren", text: "Fragen und Dokumente geschützt austauschen, statt vertrauliche Unterlagen per E-Mail zu senden." },
];

const cardIcon = "flex size-11 items-center justify-center rounded-xl bg-accent-soft text-accent";

export default function KundenportalPage() {
  return (
    <>
      <PageHero
        eyebrow={portal.eyebrow}
        title={portal.title}
        lead={portal.text}
        breadcrumbs={crumbs}
        aside={<PhoneMockup className="hidden lg:block" />}
      >
        <p className="inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-3 py-1 text-sm font-semibold text-accent">
          <span aria-hidden className="size-1.5 rounded-full bg-current" />
          In Vorbereitung
        </p>
      </PageHero>

      <Section tone="mist" labelledBy="funktionen-title">
        <SectionHeader
          id="funktionen-title"
          eyebrow="Geplante Funktionen"
          title="Weniger Papier, mehr Überblick"
          text="Das Portal ergänzt die persönliche Betreuung. Sie entscheiden, ob Sie digital, auf Papier oder gemischt mit uns arbeiten."
          align="center"
        />
        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <li key={f.title} className="rounded-card bg-white p-6 sm:p-7">
              <span aria-hidden className={cardIcon}>
                <f.icon className="size-5" strokeWidth={1.75} />
              </span>
              <h3 className="mt-4 text-[1.0625rem] font-semibold leading-snug">{hyphenate(f.title, SMALL_HEADING)}</h3>
              <p className="mt-1.5 text-[0.9375rem] text-body">{f.text}</p>
            </li>
          ))}
          <li className="flex flex-col justify-center rounded-card border-[1.5px] border-dashed border-line-strong p-6 sm:p-7">
            <p className="text-[1.0625rem] font-semibold text-ink">Ihre Wünsche zählen.</p>
            <p className="mt-1.5 text-[0.9375rem] text-body">Was würde Ihnen die Zusammenarbeit erleichtern? Sagen Sie es uns, wir bauen das Portal für unsere Kundschaft.</p>
          </li>
        </ul>
      </Section>

      <Section tone="white" labelledBy="heute-title">
        <SectionHeader
          id="heute-title"
          eyebrow="Schon heute"
          title="Digital arbeiten geht bereits"
          text="Bis das Portal bereit ist, tauschen wir Unterlagen so aus, wie es für Sie am einfachsten ist."
          align="center"
        />
        <ul className="mt-12 grid gap-5 md:grid-cols-3">
          <li className="rounded-card bg-mist p-6 sm:p-7">
            <span aria-hidden className={cardIcon}>
              <Mail className="size-5" strokeWidth={1.75} />
            </span>
            <h3 className="mt-4 text-[1.0625rem] font-semibold">Per E-Mail</h3>
            <p className="mt-1.5 text-[0.9375rem] text-body">
              Fotos und PDF an{" "}
              <a href={`mailto:${site.contact.email.value}`} className="font-medium text-accent underline decoration-accent-line underline-offset-[3px] hover:decoration-current">
                {site.contact.email.value}
              </a>
              .
            </p>
          </li>
          <li className="rounded-card bg-mist p-6 sm:p-7">
            <span aria-hidden className={cardIcon}>
              <ScanLine className="size-5" strokeWidth={1.75} />
            </span>
            <h3 className="mt-4 text-[1.0625rem] font-semibold">Digitale Belegablage</h3>
            <p className="mt-1.5 text-[0.9375rem] text-body">Für die laufende Buchhaltung richten wir Ihnen eine digitale Belegablage mit Bankanbindung ein.</p>
          </li>
          <li className="rounded-card bg-mist p-6 sm:p-7">
            <span aria-hidden className={cardIcon}>
              <MapPin className="size-5" strokeWidth={1.75} />
            </span>
            <h3 className="mt-4 text-[1.0625rem] font-semibold">Persönlich</h3>
            <p className="mt-1.5 text-[0.9375rem] text-body">
              Ordner und Unterlagen bringen Sie einfach bei uns an der {site.contact.address.street} in {site.contact.address.city} vorbei.
            </p>
          </li>
        </ul>
        <div className="mt-10 text-center">
          <ButtonLink href="/kontakt?anliegen=anderes" variant="secondary">
            Fragen zum Portal
          </ButtonLink>
        </div>
      </Section>

      <CtaBand divider />
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
    </>
  );
}
