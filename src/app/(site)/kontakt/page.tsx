import { Suspense } from "react";
import { Clock, Mail, MapPin, Navigation, Phone } from "lucide-react";
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

  const label = "text-sm text-muted";
  const icon = "mt-0.5 size-5 shrink-0 text-accent";
  return (
    <>
      <PageHero
        eyebrow="Kontakt"
        title="Wir freuen uns auf Sie."
        lead={`Schreiben Sie uns, rufen Sie an oder kommen Sie vorbei. ${firstCallSentence()}`}
        breadcrumbs={crumbs}
        compact
      />

      <section aria-label="Kontaktformular und Kontaktangaben" className="bg-mist py-12 md:py-20">
        <Container>
          <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
            <div className="min-w-0 lg:col-span-7">
              <div className="rounded-panel bg-white p-6 shadow-hairline sm:p-10">
                <h2 className="text-[1.875rem] leading-tight">Nachricht senden</h2>
                <p className="mt-2 text-muted">Wir melden uns persönlich bei Ihnen{responseClause()}.</p>
                <div className="mt-8">
                  {formsAvailable() ? (
                    <Suspense fallback={<ContactForm {...formProps} />}>
                      <ContactFormFromUrl {...formProps} />
                    </Suspense>
                  ) : (
                    <p className="rounded-field bg-mist p-5 text-body">
                      Das Formular ist gerade nicht verfügbar. Schreiben Sie uns bitte direkt an{" "}
                      <a href={`mailto:${email.value}`} className="font-medium text-accent underline underline-offset-[3px]">
                        {email.value}
                      </a>
                      {phone.value ? ` oder rufen Sie uns an: ${phone.value}` : ""}.
                    </p>
                  )}
                </div>
              </div>
            </div>

            <aside aria-labelledby="direkt-title" className="min-w-0 lg:col-span-5">
              <div className="rounded-panel bg-white p-7 shadow-hairline sm:p-9 lg:sticky lg:top-28">
                <h2 id="direkt-title" className="text-[1.875rem] leading-tight">
                  Direkt erreichbar
                </h2>
                <ul className="mt-7 grid gap-5">
                  {phone.value ? (
                    <li className="flex gap-3.5">
                      <Phone aria-hidden className={icon} strokeWidth={1.75} />
                      <div>
                        <p className={label}>Telefon</p>
                        <a href={phoneHref(phone.value)} className="mt-0.5 block text-lg font-medium tabular text-ink transition-colors hover:text-accent">
                          {phone.value}
                        </a>
                      </div>
                    </li>
                  ) : null}
                  <li className="flex gap-3.5">
                    <Mail aria-hidden className={icon} strokeWidth={1.75} />
                    <div className="min-w-0">
                      <p className={label}>E-Mail</p>
                      <a href={`mailto:${email.value}`} className="mt-0.5 block break-words text-lg font-medium text-ink transition-colors hover:text-accent">
                        {email.value}
                      </a>
                    </div>
                  </li>
                  <li className="flex gap-3.5">
                    <MapPin aria-hidden className={icon} strokeWidth={1.75} />
                    <div>
                      <p className={label}>Adresse</p>
                      <p className="mt-0.5 text-ink">
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
                        className="mt-2 inline-flex items-center gap-1.5 text-[0.9375rem] font-medium text-accent hover:text-accent-hover"
                        aria-label={`Route planen zu ${addressLine()} (öffnet Google Maps)`}
                      >
                        <Navigation aria-hidden className="size-4" strokeWidth={1.75} />
                        Route planen
                      </a>
                    </div>
                  </li>
                  {openingHours.confirmed ? (
                    <li className="flex gap-3.5">
                      <Clock aria-hidden className={icon} strokeWidth={1.75} />
                      <div>
                        <p className={label}>Bürozeiten</p>
                        {openingHours.value.map((h) => (
                          <p key={h.days} className="mt-0.5 text-ink">
                            {h.days}
                            <br />
                            <span className="text-body">
                              <Hours text={h.hours} />
                            </span>
                          </p>
                        ))}
                      </div>
                    </li>
                  ) : null}
                </ul>
                <div className="mt-8 flex items-center gap-4 border-t border-line pt-6">
                  <span aria-hidden className="flex size-12 shrink-0 items-center justify-center rounded-full bg-accent-soft font-semibold text-accent">
                    {person
                      .split(/\s+/)
                      .map((p) => p[0])
                      .join("")}
                  </span>
                  <p className="leading-snug">
                    <span className="block font-serif text-xl font-medium text-ink">{person}</span>
                    <span className="text-sm text-muted">{title}</span>
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
