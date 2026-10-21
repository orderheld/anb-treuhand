import { PageHero } from "@/components/sections/page-hero";
import { Section } from "@/components/ui/section";
import { phoneHref, site } from "@/config/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Impressum",
  description: `Impressum von ${site.brand}, ${site.contact.address.street}, ${site.contact.address.postalCode} ${site.contact.address.city}.`,
  path: "/impressum",
});

/**
 * Legal notice. Owner, UID and commercial register appear as soon as they are entered in
 * config/site.ts; `npm run check:launch` lists what is still missing.
 */
export default function ImpressumPage() {
  const { legal, contact } = site;
  const a = contact.address;
  const phone = contact.phone.value;
  const rows: { label: string; value: React.ReactNode }[] = [
    { label: "Firma", value: legal.entityName.value },
    { label: "Rechtsform", value: legal.legalForm.value },
    { label: "Inhaber", value: legal.owner.value },
    {
      label: "Adresse",
      value: (
        <>
          {a.street}
          <br />
          {a.postalCode} {a.city}
          <br />
          {a.country}
        </>
      ),
    },
    { label: "Telefon", value: phone ? <a href={phoneHref(phone)}>{phone}</a> : null },
    { label: "E-Mail", value: <a href={`mailto:${contact.email.value}`}>{contact.email.value}</a> },
    { label: "UID", value: legal.uid.value },
    { label: "Handelsregister", value: legal.commercialRegister.value },
    { label: "MWST-Nummer", value: legal.vatRegistered.value ? legal.vatNumber.value : null },
  ].filter((row) => row.value);

  return (
    <>
      <PageHero eyebrow="Rechtliches" title="Impressum" breadcrumbs={[{ name: "Start", path: "/" }, { name: "Impressum", path: "/impressum" }]} compact />
      <Section tone="white" flushTop>
        <div className="prose-anb border-t border-line pt-8">
          <h2>Verantwortlich für diese Website</h2>
          <dl className="grid gap-x-8 gap-y-3 sm:grid-cols-[10rem_1fr]">
            {rows.map((row) => (
              <div key={row.label} className="contents">
                <dt className="font-medium text-ink">{row.label}</dt>
                <dd>{row.value}</dd>
              </div>
            ))}
          </dl>

          <h2>Haftungsausschluss</h2>
          <p>
            Wir prüfen die Inhalte dieser Website sorgfältig. Trotzdem übernehmen wir keine Gewähr für die Richtigkeit, Vollständigkeit und Aktualität der Informationen. Die Angaben
            ersetzen keine individuelle Beratung.
          </p>
          <p>
            Die Preisrechner zeigen unverbindliche Richtpreise auf Basis unserer Tarife und Ihrer Angaben. Massgebend ist allein die schriftliche Offerte. Externe Kosten wie Gebühren von
            Notariat, Handelsregister oder Bank sind Schätzungen.
          </p>

          <h2>Links auf andere Websites</h2>
          <p>
            Für Inhalte von Websites, auf die wir verlinken, sind ausschliesslich deren Betreiber verantwortlich. Zum Zeitpunkt der Verlinkung waren keine rechtswidrigen Inhalte
            erkennbar.
          </p>

          <h2>Urheberrechte</h2>
          <p>
            Texte, Gestaltung, Logo und Grafiken dieser Website gehören {legal.entityName.value} oder den genannten Rechteinhabern. Jede Verwendung ausserhalb der privaten Nutzung
            braucht unsere vorherige schriftliche Zustimmung.
          </p>

          <h2>Konzept, Design und Umsetzung</h2>
          <p>
            Webnova, <a href={site.credit.href}>{site.credit.name}</a>
          </p>
        </div>
      </Section>
    </>
  );
}
