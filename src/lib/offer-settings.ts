import "server-only";
import type { OfferSettings } from "@/components/calculators/types";
import { phoneHref, responseClause, site, vatNote } from "@/config/site";
import { formsAvailable, serverEnv } from "@/lib/env";

/** Settings of the offer form for the calculator pages, read at build time. */
export function offerSettings(): OfferSettings {
  const phone = site.contact.phone.value;
  return {
    formsAvailable: formsAvailable(),
    testMode: serverEnv.dryRun,
    confirmation: serverEnv.confirmation,
    fallbackEmail: site.contact.email.value,
    responseClause: responseClause(),
    vatNote: vatNote(),
    phone: phone ? { label: phone, href: phoneHref(phone) } : null,
  };
}
