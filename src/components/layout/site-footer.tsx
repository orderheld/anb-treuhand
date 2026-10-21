import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Container } from "@/components/ui/container";
import { Hours } from "@/components/ui/hours";
import { addressLine, mapsHref, phoneHref, site } from "@/config/site";
import { calculatorHref, calculators } from "@/content/calculators";
import { legalNav } from "@/content/navigation";
import { serviceHref, services } from "@/content/services";

function FooterList({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <h2 className="font-sans text-sm font-semibold text-ink">{title}</h2>
      <ul className="mt-3.5 grid gap-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="text-sm text-muted transition-colors hover:text-ink">
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
  const iconClass = "mt-0.5 size-4 shrink-0 text-accent";
  return (
    <footer className="bg-mist text-sm text-muted">
      <Container className="pb-8 pt-14 md:pt-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.5fr_repeat(3,1fr)] lg:gap-8">
          <div className="md:col-span-2 lg:col-span-1">
            <Link href="/" aria-label="ANB Treuhand, zur Startseite" className="inline-block">
              <Logo variant="horizontal" decorative />
            </Link>
            <p className="mt-5 max-w-72">Buchhaltung, Steuern, Löhne, Firmengründungen und Immobilien. Persönlich betreut aus Langenthal.</p>
            <address className="mt-5 grid gap-2.5 not-italic">
              <a href={mapsHref()} className="flex gap-2.5 transition-colors hover:text-ink" target="_blank" rel="noopener noreferrer">
                <MapPin aria-hidden className={iconClass} strokeWidth={1.75} />
                {addressLine()}
              </a>
              {phone.value ? (
                <a href={phoneHref(phone.value)} className="flex gap-2.5 tabular transition-colors hover:text-ink">
                  <Phone aria-hidden className={iconClass} strokeWidth={1.75} />
                  {phone.value}
                </a>
              ) : null}
              <a href={`mailto:${email.value}`} className="flex gap-2.5 transition-colors hover:text-ink">
                <Mail aria-hidden className={iconClass} strokeWidth={1.75} />
                {email.value}
              </a>
              {openingHours.confirmed ? (
                <span className="flex gap-2.5">
                  <Clock aria-hidden className={iconClass} strokeWidth={1.75} />
                  <span>
                    {openingHours.value.map((o) => (
                      <span key={o.days} className="block">
                        {o.days} <Hours text={o.hours} />
                      </span>
                    ))}
                  </span>
                </span>
              ) : null}
            </address>
          </div>
          <FooterList
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

        <div className="mt-12 flex flex-col gap-3 border-t border-line pt-5 text-[0.8125rem] md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {site.brand}, Langenthal
          </p>
          <ul className="flex flex-wrap gap-x-5 gap-y-1">
            {legalNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition-colors hover:text-ink">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <p>
            {site.credit.label}{" "}
            <a href={site.credit.href} target="_blank" rel="noopener" className="text-body transition-colors hover:text-ink">
              {site.credit.name}
            </a>
          </p>
        </div>
      </Container>
    </footer>
  );
}
