import { Clock, Mail, Phone } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Hours } from "@/components/ui/hours";
import { firstCallFree, phoneHref, site } from "@/config/site";
import { primaryCta } from "@/content/navigation";
import { hyphenate } from "@/lib/hyphenate";
import { cn } from "@/lib/utils";

/** Closing invitation to the free first meeting, centred, with the direct contacts below. */
export function CtaBand({
  title = "Lernen wir uns kennen",
  text,
  divider = false,
}: {
  title?: string;
  text?: string;
  /** Fine line above, when the section before is white as well. */
  divider?: boolean;
}) {
  const { phone, email, openingHours } = site.contact;
  const body =
    text ??
    (firstCallFree()
      ? "Das Erstgespräch ist kostenlos und unverbindlich. In Langenthal, bei Ihnen oder per Video."
      : "Erzählen Sie uns von Ihrem Vorhaben. In Langenthal, bei Ihnen oder per Video.");
  return (
    <section aria-labelledby="abschluss-title" className="bg-white">
      <Container>
        <div className={cn("mx-auto py-[clamp(4.5rem,8vw,7rem)] text-center", divider && "border-t border-line")}>
          <div className="mx-auto max-w-[47.5rem]">
          <h2 id="abschluss-title" className="text-h2">
            {hyphenate(title)}
          </h2>
          <p className="mx-auto mt-4 max-w-[35rem] text-lead text-body">{body}</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <ButtonLink href={primaryCta.href} size="lg">
              Termin anfragen
            </ButtonLink>
            <ButtonLink href="/kontakt" variant="text" size="lg" arrow>
              Alle Kontaktwege
            </ButtonLink>
          </div>
          <ul className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[0.9375rem] text-muted">
            {phone.value ? (
              <li>
                <a href={phoneHref(phone.value)} className="inline-flex items-center gap-1.5 tabular text-body transition-colors hover:text-accent">
                  <Phone aria-hidden className="size-4" strokeWidth={1.75} />
                  {phone.value}
                </a>
              </li>
            ) : null}
            <li>
              <a href={`mailto:${email.value}`} className="inline-flex items-center gap-1.5 text-body transition-colors hover:text-accent">
                <Mail aria-hidden className="size-4" strokeWidth={1.75} />
                {email.value}
              </a>
            </li>
            {openingHours.confirmed
              ? openingHours.value.map((o) => (
                  <li key={o.days}>
                    {/* Icon inline with the text, so days and hours wrap like a sentence on phones. */}
                    <Clock aria-hidden className="mr-1.5 inline size-4" strokeWidth={1.75} />
                    {o.days} <Hours text={o.hours} />
                  </li>
                ))
              : null}
          </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
