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
        <p className="inline-flex items-center gap-2 rounded-full border border-copper/40 px-4 py-1.5 text-sm text-copper">
          <span aria-hidden className="size-1.5 rounded-full bg-copper" />
          In Vorbereitung
        </p>
      </PageHero>

      <Section tone="white" labelledBy="funktionen-title">
        <SectionHeader
          id="funktionen-title"
          eyebrow="Geplante Funktionen"
          title="Weniger Papier, mehr Überblick."
          text="Das Portal ergänzt die persönliche Betreuung. Sie entscheiden, ob Sie digital, auf Papier oder gemischt mit uns arbeiten."
          layout="split"
        />
        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <li key={f.title} className="rounded-[1.75rem] border border-sand/80 bg-cream/40 p-7">
              <span aria-hidden className="flex size-12 items-center justify-center rounded-full bg-forest text-copper">
                <f.icon className="size-5" strokeWidth={1.5} />
              </span>
              <h3 className="mt-6 font-serif text-h3 text-ink">{hyphenate(f.title, SMALL_HEADING)}</h3>
              <p className="mt-3 leading-relaxed text-body">{f.text}</p>
            </li>
          ))}
          <li className="flex flex-col justify-center rounded-[1.75rem] border border-dashed border-copper/50 p-7">
            <p className="font-serif text-h3 text-ink">Ihre Wünsche zählen.</p>
            <p className="mt-3 leading-relaxed text-body">Was würde Ihnen die Zusammenarbeit erleichtern? Sagen Sie es uns, wir bauen das Portal für unsere Kundschaft.</p>
          </li>
        </ul>
      </Section>

      <Section tone="cream" labelledBy="heute-title">
        <SectionHeader id="heute-title" eyebrow="Schon heute" title="Digital arbeiten geht bereits." text="Bis das Portal bereit ist, tauschen wir Unterlagen so aus, wie es für Sie am einfachsten ist." />
        <ul className="mt-14 grid gap-5 md:grid-cols-3">
          <li className="rounded-[1.75rem] border border-sand/80 bg-white p-7">
            <Mail aria-hidden className="size-6 text-bronze" strokeWidth={1.5} />
            <h3 className="mt-5 font-serif text-h3 text-ink">Per E-Mail</h3>
            <p className="mt-3 leading-relaxed text-body">
              Fotos und PDF an <a href={`mailto:${site.contact.email.value}`} className="text-forest underline decoration-copper underline-offset-[3px]">{site.contact.email.value}</a>.
            </p>
          </li>
          <li className="rounded-[1.75rem] border border-sand/80 bg-white p-7">
            <ScanLine aria-hidden className="size-6 text-bronze" strokeWidth={1.5} />
            <h3 className="mt-5 font-serif text-h3 text-ink">Digitale Belegablage</h3>
            <p className="mt-3 leading-relaxed text-body">Für die laufende Buchhaltung richten wir Ihnen eine digitale Belegablage mit Bankanbindung ein.</p>
          </li>
          <li className="rounded-[1.75rem] border border-sand/80 bg-white p-7">
            <MapPin aria-hidden className="size-6 text-bronze" strokeWidth={1.5} />
            <h3 className="mt-5 font-serif text-h3 text-ink">Persönlich</h3>
            <p className="mt-3 leading-relaxed text-body">
              Ordner und Unterlagen bringen Sie einfach bei uns an der {site.contact.address.street} in {site.contact.address.city} vorbei.
            </p>
          </li>
        </ul>
        <div className="mt-12">
          <ButtonLink href="/kontakt?anliegen=anderes" arrow>
            Fragen zum Portal
          </ButtonLink>
        </div>
      </Section>

      <CtaBand />
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
    </>
  );
}
