import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { phoneHref, site } from "@/config/site";
import { primaryCta } from "@/content/navigation";
import { HeaderShell } from "./header-shell";
import { MobileNav } from "./mobile-nav";
import { DesktopNav } from "./nav-links";

export function SiteHeader() {
  const phone = site.contact.phone.value;
  return (
    <HeaderShell>
      <Container className="relative flex h-20 items-center gap-8">
        <Link href="/" className="shrink-0 rounded" aria-label="ANB Treuhand, zur Startseite">
          {/* Querformat from 360 px; below, where it does not fit, the small signet as the CI manual asks. */}
          <Logo variant="signet" decorative className="min-[360px]:hidden" />
          <Logo variant="horizontal" decorative priority className="hidden min-[360px]:block" />
        </Link>
        <DesktopNav />
        <div className="ml-auto flex items-center gap-4">
          {phone ? (
            <a href={phoneHref(phone)} className="hidden whitespace-nowrap text-[0.9375rem] tabular text-body transition-colors hover:text-ink xl:inline">
              {phone}
            </a>
          ) : null}
          <ButtonLink href={primaryCta.href} size="sm" className="hidden sm:inline-flex">
            {primaryCta.label}
          </ButtonLink>
          <MobileNav phone={phone} phoneHref={phone ? phoneHref(phone) : null} email={site.contact.email.value} />
        </div>
      </Container>
    </HeaderShell>
  );
}
