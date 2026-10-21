import Link from "next/link";
import { Phone } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { phoneHref, site } from "@/config/site";
import { primaryCta } from "@/content/navigation";
import { HeaderShell } from "./header-shell";
import { MobileNav } from "./mobile-nav";
import { DesktopNav } from "./nav-links";

/** Every page opens with a green hero, so the header is set in cream on green throughout. */
export function SiteHeader() {
  const phone = site.contact.phone.value;
  return (
    <HeaderShell>
      <Container className="flex h-[4.25rem] items-center justify-between gap-6 transition-[height] duration-500 lg:h-20 lg:group-data-[scrolled]/header:h-[4.25rem]">
        <Link href="/" className="-m-1 shrink-0 rounded p-1" aria-label="ANB Treuhand, zur Startseite">
          <Logo variant="horizontal" tone="light" decorative className="h-7 w-auto sm:h-8" />
        </Link>
        <div className="flex items-center gap-2 lg:gap-4">
          <DesktopNav />
          {phone ? (
            <a
              href={phoneHref(phone)}
              className="hidden items-center gap-2 whitespace-nowrap px-2 text-[0.9375rem] tabular text-cream/80 transition-colors hover:text-copper 2xl:inline-flex"
            >
              <Phone aria-hidden className="size-4 text-copper" strokeWidth={1.5} />
              {phone}
            </a>
          ) : null}
          <ButtonLink href={primaryCta.href} size="sm" variant="copper" className="hidden sm:inline-flex">
            {primaryCta.label}
          </ButtonLink>
          <MobileNav phone={phone} phoneHref={phone ? phoneHref(phone) : null} email={site.contact.email.value} />
        </div>
      </Container>
    </HeaderShell>
  );
}
