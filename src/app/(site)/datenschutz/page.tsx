import { PageHero } from "@/components/sections/page-hero";
import { Section } from "@/components/ui/section";
import { site } from "@/config/site";
import { serverEnv } from "@/lib/env";
import { isStorageConfigured } from "@/lib/requests/store";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Datenschutzerklärung",
  description: `Wie ${site.brand} Personendaten auf dieser Website bearbeitet: Kontaktformular, Preisrechner, Hosting und E-Mail-Versand. Nach dem Schweizer Datenschutzgesetz (DSG).`,
  path: "/datenschutz",
});

/** Last substantive change of this text. Update it together with the content. */
const LAST_UPDATED = "Oktober 2026";

/**
 * Privacy policy under the revised Swiss Federal Act on Data Protection (DSG, in force since
 * 1 September 2023). It describes what the site really does: no cookies or tracking for visitors,
 * fonts served from the site itself, requests by e-mail (Resend) and optionally in the database
 * (Neon, Frankfurt), hosting on Vercel. Adjust it whenever one of these changes.
 */
export default function DatenschutzPage() {
  const { contact, legal } = site;
  const a = contact.address;
  const days = serverEnv.retentionDays;
  const retention = days === 365 ? "zwölf Monaten" : `${days} Tagen`;
  return (
    <>
      <PageHero
        eyebrow="Rechtliches"
        title="Datenschutzerklärung"
        lead="Wir behandeln Ihre Daten so vertraulich wie Ihre Buchhaltung. Hier erfahren Sie, welche Daten wir auf dieser Website bearbeiten und warum."
        breadcrumbs={[
          { name: "Start", path: "/" },
          { name: "Datenschutz", path: "/datenschutz" },
        ]}
        compact
      />
      <Section tone="white" flushTop>
        <div className="prose-anb border-t border-line pt-8">
          <p>
            Diese Datenschutzerklärung gilt für die Website {site.url.value.replace(/^https?:\/\//, "")} und richtet sich nach dem Schweizer Bundesgesetz über den Datenschutz (DSG).
            Stand: {LAST_UPDATED}.
          </p>

          <h2>1. Verantwortlich</h2>
          <p>
            {legal.entityName.value}
            {legal.owner.value ? `, Inhaber ${legal.owner.value}` : ""}
            <br />
            {a.street}, {a.postalCode} {a.city}
            <br />
            <a href={`mailto:${contact.email.value}`}>{contact.email.value}</a>
          </p>
          <p>Bei Fragen zum Datenschutz und für die Ausübung Ihrer Rechte erreichen Sie uns unter dieser Adresse.</p>

          <h2>2. Das Wichtigste in Kürze</h2>
          <ul>
            <li>Wir setzen auf dieser Website keine Cookies und keine Tracking- oder Analysewerkzeuge ein.</li>
            <li>Schriften und Grafiken werden von unserer eigenen Website geladen, nicht von Drittanbietern.</li>
            <li>Daten aus dem Kontaktformular und den Preisrechnern verwenden wir nur, um Ihre Anfrage zu beantworten.</li>
            <li>Wir verkaufen keine Daten und geben sie nicht für Werbezwecke weiter.</li>
          </ul>

          <h2>3. Besuch der Website</h2>
          <p>
            Beim Aufruf der Website verarbeitet unser Hosting-Anbieter technisch notwendige Daten: IP-Adresse, Datum und Uhrzeit, aufgerufene Adresse, Referrer sowie Browser und
            Betriebssystem. Diese Daten werden für den sicheren Betrieb, zur Fehleranalyse und zur Abwehr von Angriffen benötigt und nach kurzer Zeit automatisch gelöscht. Eine
            Zuordnung zu Ihrer Person nehmen wir nicht vor.
          </p>
          <p>
            Die Website wird bei Vercel Inc. (USA) gehostet. Die Seiten werden über ein weltweites Netz von Servern ausgeliefert; Formulare werden in Frankfurt am Main (Deutschland)
            verarbeitet.
          </p>

          <h2>4. Kontaktformular und Offertanfragen</h2>
          <p>
            Wenn Sie uns über das Kontaktformular schreiben oder in einem Preisrechner eine Offerte anfordern, bearbeiten wir die Angaben, die Sie eingeben: Name, E-Mail-Adresse und
            Ihre Nachricht sowie freiwillig Firma, Telefonnummer und gewünschter Start. Bei einer Offertanfrage zusätzlich Ihre Angaben im Rechner, zum Beispiel Rechtsform, Anzahl
            Buchungen oder Art der Liegenschaft, und der berechnete Richtpreis.
          </p>
          <p>
            Wir verwenden diese Daten ausschliesslich, um Ihre Anfrage zu beantworten, eine Offerte zu erstellen und mit Ihnen Kontakt aufzunehmen. Mit dem Absenden willigen Sie in
            diese Bearbeitung ein.
          </p>
          <p>
            Ihre Anfrage wird per E-Mail an uns übermittelt. Für den Versand nutzen wir den Dienst Resend (Resend Inc., USA).
            {serverEnv.confirmation ? " Sie erhalten automatisch eine Bestätigung an die angegebene E-Mail-Adresse." : ""}
          </p>
          {isStorageConfigured() ? (
            <p>
              Zusätzlich speichern wir Anfragen in einer geschützten Datenbank, damit keine Anfrage verloren geht. Die Datenbank betreibt der Anbieter Neon (USA) in Frankfurt am
              Main. Gespeicherte Anfragen werden nach {retention} automatisch gelöscht. Entsteht daraus ein Auftrag, übernehmen wir die nötigen Angaben in unsere Mandatsunterlagen.
            </p>
          ) : null}
          <p>
            Zum Schutz vor Missbrauch und automatisierten Massenanfragen bilden wir aus Ihrer IP-Adresse einen nicht umkehrbaren Prüfwert (Hash) und begrenzen damit die Anzahl Anfragen
            pro Stunde. Die IP-Adresse selbst speichern wir nicht.
          </p>

          <h2>5. Kommunikation per E-Mail und Telefon</h2>
          <p>
            Wenn Sie uns per E-Mail oder Telefon kontaktieren, bearbeiten wir Ihre Angaben, um Ihr Anliegen zu beantworten. Für Mandate gelten die gesetzlichen
            Aufbewahrungspflichten, insbesondere die zehnjährige Aufbewahrung von Geschäftsunterlagen nach Obligationenrecht.
          </p>

          <h2>6. Links zu anderen Diensten</h2>
          <p>
            Auf unserer Website sind keine Karten, Videos oder Social-Media-Inhalte eingebunden. Folgen Sie einem Link auf eine andere Website, gilt dort die Datenschutzerklärung
            des jeweiligen Anbieters.
          </p>

          <h2>7. Bekanntgabe ins Ausland</h2>
          <p>
            Vercel, Resend und Neon haben ihren Sitz in den USA. Eine Bekanntgabe von Personendaten in die USA ist deshalb möglich, auch wenn die Daten in Europa verarbeitet werden. Sie
            erfolgt nur an Anbieter, die nach dem Swiss-U.S. Data Privacy Framework zertifiziert sind oder sich mit den von der Schweiz anerkannten Standardvertragsklauseln zu einem
            angemessenen Datenschutz verpflichtet haben.
          </p>

          <h2>8. Datensicherheit</h2>
          <p>
            Die Website ist durchgehend verschlüsselt (HTTPS). Unsere Systeme sind durch Zugangsbeschränkungen, starke Passwörter und eine Zwei-Faktor-Anmeldung geschützt. Zugriff auf
            Anfragen haben nur Personen bei {legal.entityName.value}, die sie für die Bearbeitung brauchen.
          </p>

          <h2>9. Ihre Rechte</h2>
          <p>Sie haben jederzeit das Recht,</p>
          <ul>
            <li>Auskunft über die Daten zu verlangen, die wir über Sie bearbeiten,</li>
            <li>unrichtige Daten berichtigen zu lassen,</li>
            <li>die Löschung Ihrer Daten zu verlangen, soweit keine gesetzliche Aufbewahrungspflicht besteht,</li>
            <li>Ihre Daten in einem gängigen elektronischen Format zu erhalten,</li>
            <li>einer Bearbeitung zu widersprechen und eine erteilte Einwilligung zu widerrufen.</li>
          </ul>
          <p>
            Schreiben Sie uns dazu an <a href={`mailto:${contact.email.value}`}>{contact.email.value}</a>. Wir können einen Nachweis Ihrer Identität verlangen. Wenn Sie der Ansicht
            sind, dass wir Ihre Daten nicht korrekt bearbeiten, können Sie sich an den Eidgenössischen Datenschutz- und Öffentlichkeitsbeauftragten (EDÖB) wenden:{" "}
            <a href="https://www.edoeb.admin.ch">www.edoeb.admin.ch</a>.
          </p>

          <h2>10. Änderungen</h2>
          <p>
            Wir passen diese Datenschutzerklärung an, wenn sich unsere Website oder die eingesetzten Dienste ändern. Es gilt die jeweils auf dieser Seite veröffentlichte Fassung.
          </p>
        </div>
      </Section>
    </>
  );
}
