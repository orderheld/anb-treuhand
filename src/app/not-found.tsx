import Link from "next/link";
import { ChevronRight } from "lucide-react";
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
      <section className="bg-white">
        <Container className="pb-14 pt-16 md:pb-20 md:pt-24">
          <p className="kicker">Fehler 404</p>
          <h1 className="mt-3 text-h1">
            Diese Seite <span className="text-accent">gibt es nicht</span>
          </h1>
          <p className="mt-5 max-w-xl text-lead text-body">Vielleicht hat sich die Adresse geändert oder es hat sich ein Tippfehler eingeschlichen. Hier geht es weiter:</p>
          <div className="mt-8">
            <ButtonLink href="/" size="lg">
              Zur Startseite
            </ButtonLink>
          </div>
        </Container>
      </section>
      <section aria-label="Beliebte Seiten" className="bg-mist py-14 md:py-20">
        <Container>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="group flex h-full flex-col rounded-card bg-white p-6 transition-shadow duration-200 hover:shadow-card">
                  <span className="text-[1.0625rem] font-semibold text-ink">{l.label}</span>
                  <span className="mt-1.5 flex-1 text-[0.9375rem] text-body">{l.text}</span>
                  <ChevronRight aria-hidden className="mt-4 size-4 text-accent transition-transform duration-150 group-hover:translate-x-0.5" strokeWidth={2} />
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </SiteChrome>
  );
}
