import { Phone } from "lucide-react";
import { MonogramOutline } from "@/components/brand/motifs";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { firstCallFree, phoneHref, site } from "@/config/site";
import { primaryCta } from "@/content/navigation";
import { hyphenate } from "@/lib/hyphenate";

/** Closing invitation to the free first meeting, at the end of most pages. */
export function CtaBand({
  title = "Lernen wir uns kennen.",
  text,
}: {
  title?: string;
  text?: string;
}) {
  const phone = site.contact.phone.value;
  const body =
    text ??
    (firstCallFree()
      ? "Das Erstgespräch ist kostenlos und unverbindlich. In Langenthal, bei Ihnen oder per Video."
      : "Erzählen Sie uns von Ihrem Vorhaben. In Langenthal, bei Ihnen oder per Video.");
  return (
    <section className="on-dark grain relative isolate overflow-hidden bg-forest text-cream">
      <MonogramOutline className="absolute -bottom-[18%] -right-[6%] -z-10 w-[min(62rem,110%)]" opacity={0.16} animate={false} />
      <Container className="relative py-20 md:py-28">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="min-w-0 lg:col-span-7">
            <p className="eyebrow">Gratis Erstgespräch</p>
            <h2 className="mt-6 text-h2">{hyphenate(title)}</h2>
            <p className="mt-6 max-w-xl text-lead text-cream/75">{body}</p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row lg:col-span-5 lg:justify-end">
            <ButtonLink href={primaryCta.href} variant="copper" size="lg" arrow>
              Termin anfragen
            </ButtonLink>
            {phone ? (
              <ButtonLink href={phoneHref(phone)} variant="outline-light" size="lg">
                <Phone aria-hidden className="size-4" strokeWidth={1.5} />
                <span className="tabular">{phone}</span>
              </ButtonLink>
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  );
}
