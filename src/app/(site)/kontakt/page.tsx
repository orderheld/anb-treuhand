import { Suspense } from "react";
import { Clock, Mail, MapPin, Navigation, Phone } from "lucide-react";
import { MonogramOutline } from "@/components/brand/motifs";
import { ContactForm, ContactFormFromUrl } from "@/components/forms/contact-form";
import { PageHero } from "@/components/sections/page-hero";
import { JsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/ui/container";
import { addressLine, firstCallSentence, mapsHref, phoneHref, responseClause, site } from "@/config/site";
import { formsAvailable, serverEnv } from "@/lib/env";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { Hours } from "@/components/ui/hours";

export const metadata = pageMetadata({
  title: "Kontakt und Erstgespräch",
  description: `Kontaktieren Sie ANB Treuhand in Langenthal: ${addressLine()}. Telefon, E-Mail oder Kontaktformular. ${firstCallSentence()}`,
  path: "/kontakt",
});

const crumbs = [
  { name: "Start", path: "/" },
  { name: "Kontakt", path: "/kontakt" },
];

export default function KontaktPage() {
  const { phone, email, address, openingHours, person, title } = site.contact;
  const formProps = {
    fallbackEmail: email.value,
    testMode: serverEnv.dryRun,
    confirmation: serverEnv.confirmation,
    responseClause: responseClause(),
  };

  return (
    <>
      <PageHero
        eyebrow="Kontakt"
        title="Wir freuen uns auf Sie."
        lead={`Schreiben Sie uns, rufen Sie an oder kommen Sie vorbei. ${firstCallSentence()}`}
        breadcrumbs={crumbs}
        compact
      />

      <section aria-label="Kontaktformular und Kontaktangaben" className="bg-cream py-12 md:py-20">
        <Container>
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-7">
              <div className="rounded-[1.75rem] border border-sand/80 bg-white p-6 shadow-card sm:p-10">
                <h2 className="font-serif text-[1.875rem] leading-tight text-ink">Nachricht senden</h2>
                <p className="mt-2 text-muted">Wir melden uns persönlich bei Ihnen{responseClause()}.</p>
                <div className="mt-8">
                  {formsAvailable() ? (
                    <Suspense fallback={<ContactForm {...formProps} />}>
                      <ContactFormFromUrl {...formProps} />
                    </Suspense>
                  ) : (
                    <p className="rounded-2xl border border-sand bg-cream/60 p-6 leading-relaxed text-body">
                      Das Formular ist gerade nicht verfügbar. Schreiben Sie uns bitte direkt an{" "}
                      <a href={`mailto:${email.value}`} className="font-medium text-forest underline decoration-copper underline-offset-[3px]">
                        {email.value}
                      </a>
                      {phone.value ? ` oder rufen Sie uns an: ${phone.value}` : ""}.
                    </p>
                  )}
                </div>
              </div>
            </div>

            <aside aria-labelledby="direkt-title" className="lg:col-span-5">
              <div className="on-dark grain relative isolate overflow-hidden rounded-[1.75rem] bg-forest p-8 text-cream sm:p-10 lg:sticky lg:top-28">
                <MonogramOutline className="absolute -bottom-8 -right-12 -z-10 w-[24rem]" opacity={0.12} animate={false} />
                <h2 id="direkt-title" className="font-serif text-[1.875rem] leading-tight">
                  Direkt erreichbar
                </h2>
                <ul className="mt-8 space-y-6">
                  {phone.value ? (
                    <li className="flex gap-4">
                      <Phone aria-hidden className="mt-1 size-5 shrink-0 text-copper" strokeWidth={1.5} />
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-cream/60">Telefon</p>
                        <a href={phoneHref(phone.value)} className="mt-1 block text-lg tabular transition-colors hover:text-copper">
                          {phone.value}
                        </a>
                      </div>
                    </li>
                  ) : null}
                  <li className="flex gap-4">
                    <Mail aria-hidden className="mt-1 size-5 shrink-0 text-copper" strokeWidth={1.5} />
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-cream/60">E-Mail</p>
                      <a href={`mailto:${email.value}`} className="mt-1 block text-lg transition-colors hover:text-copper">
                        {email.value}
                      </a>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <MapPin aria-hidden className="mt-1 size-5 shrink-0 text-copper" strokeWidth={1.5} />
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-cream/60">Adresse</p>
                      <p className="mt-1 leading-relaxed">
                        {site.brand}
                        <br />
                        {address.street}
                        <br />
                        {address.postalCode} {address.city}
                      </p>
                      <a
                        href={mapsHref()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex items-center gap-2 text-sm text-copper underline decoration-copper/50 underline-offset-[5px] hover:decoration-copper"
                        aria-label={`Route planen zu ${addressLine()} (öffnet Google Maps)`}
                      >
                        <Navigation aria-hidden className="size-4" strokeWidth={1.5} />
                        Route planen
                      </a>
                    </div>
                  </li>
                  {openingHours.confirmed ? (
                    <li className="flex gap-4">
                      <Clock aria-hidden className="mt-1 size-5 shrink-0 text-copper" strokeWidth={1.5} />
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-cream/60">Bürozeiten</p>
                        {openingHours.value.map((h) => (
                          <p key={h.days} className="mt-1 leading-relaxed">
                            {h.days}
                            <br />
                            <span className="text-cream/75">
                              <Hours text={h.hours} />
                            </span>
                          </p>
                        ))}
                      </div>
                    </li>
                  ) : null}
                </ul>
                <div className="mt-9 flex items-center gap-4 border-t border-cream/10 pt-7">
                  <span aria-hidden className="flex size-12 shrink-0 items-center justify-center rounded-full border border-copper/60 font-serif text-lg text-copper">
                    {person
                      .split(/\s+/)
                      .map((p) => p[0])
                      .join("")}
                  </span>
                  <p className="leading-snug">
                    <span className="block font-medium">{person}</span>
                    <span className="text-sm text-cream/70">{title}</span>
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </section>

      <JsonLd data={breadcrumbJsonLd(crumbs)} />
    </>
  );
}
