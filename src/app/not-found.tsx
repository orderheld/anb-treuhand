import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CornerFacet, Facet } from "@/components/brand/motifs";
import { SiteChrome } from "@/components/layout/site-chrome";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export const metadata = {
  title: "Seite nicht gefunden",
  robots: { index: false, follow: true },
};

const links = [
  { href: "/leistungen", label: "Leistungen", text: "Buchhaltung, Steuern, Löhne, Gründung und Beratung" },
  { href: "/rechner", label: "Preisrechner", text: "Richtpreis in einer Minute berechnen" },
  { href: "/immobilien", label: "Immobilien", text: "Verwaltung, Verkauf und Sanierung" },
  { href: "/kontakt", label: "Kontakt", text: "Schreiben Sie uns oder rufen Sie an" },
];

/** 404 for every unknown address, in the look of the site. */
export default function NotFound() {
  return (
    <SiteChrome>
      <section className="on-dark grain relative isolate overflow-hidden bg-forest text-cream">
        <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(110%_90%_at_85%_-10%,#2a4d3c_0%,#1c382a_48%,#142a1f_100%)]" />
        <CornerFacet id="nf-facet-sm" className="-z-10 lg:hidden" />
        <Facet start={1180} id="nf-facet" className="-z-10 hidden lg:block" />
        <Container className="relative pb-20 pt-32 md:pb-28 md:pt-44">
          <p className="eyebrow">Fehler 404</p>
          <h1 className="mt-6 text-h1">
            Diese Seite <span className="foil">gibt es nicht.</span>
          </h1>
          <p className="mt-7 max-w-xl text-lead text-cream/75">Vielleicht hat sich die Adresse geändert oder es hat sich ein Tippfehler eingeschlichen. Hier geht es weiter:</p>
          <div className="mt-10">
            <ButtonLink href="/" variant="copper" size="lg" arrow>
              Zur Startseite
            </ButtonLink>
          </div>
        </Container>
      </section>
      <section aria-label="Beliebte Seiten" className="bg-white py-16 md:py-24">
        <Container>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="group flex h-full flex-col rounded-2xl border border-sand/80 bg-cream/40 p-6 transition-[border-color,box-shadow] duration-500 hover:border-copper/50 hover:shadow-lift"
                >
                  <span className="font-serif text-[1.5rem] leading-tight text-ink">{l.label}</span>
                  <span className="mt-2 flex-1 text-[0.9375rem] leading-snug text-muted">{l.text}</span>
                  <ArrowRight aria-hidden className="mt-5 size-4 text-forest transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.75} />
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </SiteChrome>
  );
}
