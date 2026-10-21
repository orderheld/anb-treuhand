import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Container } from "@/components/ui/container";
import { addressLine, mapsHref, phoneHref, site } from "@/config/site";
import { calculatorHref, calculators } from "@/content/calculators";
import { legalNav } from "@/content/navigation";
import { serviceHref, services } from "@/content/services";
import { Hours } from "@/components/ui/hours";

function FooterList({ title, links, className }: { title: string; links: { href: string; label: string }[]; className?: string }) {
  return (
    <div className={className}>
      <h2 className="font-sans text-xs font-medium uppercase tracking-[0.22em] text-copper">{title}</h2>
      <ul className="mt-5 space-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="text-[0.9375rem] text-cream/75 transition-colors hover:text-cream">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SiteFooter() {
  const year = process.env.NEXT_PUBLIC_BUILD_YEAR;
  const { phone, email, openingHours } = site.contact;
  return (
    <footer className="on-dark grain relative overflow-hidden bg-forest-deep text-cream">
      <Container className="relative pb-10 pt-20 md:pt-24">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <Link href="/" aria-label="ANB Treuhand, zur Startseite" className="inline-block">
              <Logo variant="stacked" tone="light" decorative className="h-auto w-44" />
            </Link>
            <p className="mt-8 max-w-xs text-[0.9375rem] leading-relaxed text-cream/70">
              Buchhaltung, Steuern, Löhne, Firmengründungen und Immobilien. Persönlich betreut aus Langenthal.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:col-span-5">
            <FooterList
              className="row-span-2 sm:row-span-1"
              title="Leistungen"
              links={[...services.map((s) => ({ href: serviceHref(s.slug), label: s.short })), { href: "/immobilien", label: "Immobilien" }]}
            />
            <FooterList title="Preisrechner" links={calculators.map((c) => ({ href: calculatorHref(c.slug), label: c.short }))} />
            <FooterList
              title="ANB Treuhand"
              links={[
                { href: "/ueber-uns", label: "Über uns" },
                { href: "/kundenportal", label: "Kundenportal" },
                { href: "/kontakt", label: "Kontakt" },
              ]}
            />
          </div>
          <address className="not-italic lg:col-span-3">
            <h2 className="font-sans text-xs font-medium uppercase tracking-[0.22em] text-copper">Kontakt</h2>
            <ul className="mt-5 space-y-4 text-[0.9375rem] text-cream/80">
              <li>
                <a href={mapsHref()} className="flex gap-3 transition-colors hover:text-cream" target="_blank" rel="noopener noreferrer">
                  <MapPin aria-hidden className="mt-1 size-4 shrink-0 text-copper" strokeWidth={1.5} />
                  <span>
                    {site.brand}
                    <br />
                    {addressLine().replace(", ", " · ")}
                  </span>
                </a>
              </li>
              {phone.value ? (
                <li>
                  <a href={phoneHref(phone.value)} className="flex gap-3 tabular transition-colors hover:text-cream">
                    <Phone aria-hidden className="mt-1 size-4 shrink-0 text-copper" strokeWidth={1.5} />
                    {phone.value}
                  </a>
                </li>
              ) : null}
              <li>
                <a href={`mailto:${email.value}`} className="flex gap-3 transition-colors hover:text-cream">
                  <Mail aria-hidden className="mt-1 size-4 shrink-0 text-copper" strokeWidth={1.5} />
                  {email.value}
                </a>
              </li>
              {openingHours.confirmed ? (
                <li className="flex gap-3">
                  <Clock aria-hidden className="mt-1 size-4 shrink-0 text-copper" strokeWidth={1.5} />
                  <span>
                    {openingHours.value.map((o) => (
                      <span key={o.days} className="block">
                        {o.days}
                        <br />
                        <span className="text-cream/60">
                          <Hours text={o.hours} />
                        </span>
                      </span>
                    ))}
                  </span>
                </li>
              ) : null}
            </ul>
          </address>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-cream/10 pt-8 text-sm text-cream/55 md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {site.brand} · Langenthal
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {legalNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition-colors hover:text-cream">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <p>
            {site.credit.label}{" "}
            <a href={site.credit.href} target="_blank" rel="noopener" className="text-cream/75 transition-colors hover:text-copper">
              {site.credit.name}
            </a>
          </p>
        </div>
      </Container>
    </footer>
  );
}
