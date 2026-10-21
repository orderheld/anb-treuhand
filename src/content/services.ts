import type { Service } from "./types";

/**
 * The five fiduciary services of ANB Treuhand. Item titles follow the client's own service list
 * (20.10.2026); the explanations are written for the website. Immobilien has its own section
 * (content/immobilien.ts).
 */
export const services: Service[] = [
  {
    slug: "buchhaltung",
    name: "Buchhaltung & Rechnungswesen",
    short: "Buchhaltung",
    icon: "book",
    tagline: "Saubere Zahlen, jeden Monat",
    summary: "Wir führen Ihre Buchhaltung laufend, sauber und nachvollziehbar. Sie wissen jederzeit, wo Ihr Unternehmen steht.",
    metaTitle: "Buchhaltung und Rechnungswesen für KMU",
    metaDescription:
      "Buchhaltung und Rechnungswesen für KMU und Selbstständige: Finanzbuchhaltung, Debitoren und Kreditoren, Abschlüsse, MWST und digitale Belegablage. Kostenloses Erstgespräch.",
    intro:
      "Eine gute Buchhaltung ist mehr als eine Pflicht. Sie zeigt Ihnen, ob Ihre Preise stimmen, wann Liquidität knapp wird und wo Potenzial liegt. Wir übernehmen die Buchführung vollständig oder ergänzen Ihr Team dort, wo es Unterstützung braucht – digital, termintreu und mit einer festen Ansprechperson.",
    items: [
      { title: "Finanzbuchhaltung", text: "Laufende Verbuchung Ihrer Belege, Kontenabstimmung und aussagekräftige Monats- oder Quartalsauswertungen." },
      { title: "Debitoren- und Kreditorenbuchhaltung", text: "Rechnungsstellung, Zahlungsverkehr, Überwachung offener Posten und ein freundliches, konsequentes Mahnwesen." },
      { title: "Jahres- und Zwischenabschlüsse", text: "Bilanz und Erfolgsrechnung nach Obligationenrecht, steueroptimiert vorbereitet und verständlich erklärt." },
      { title: "MWST-Abrechnungen", text: "Fristgerechte Abrechnungen mit der ESTV, effektiv oder nach Saldosteuersatz, inklusive Umsatzabstimmung." },
      { title: "Digitalisierung der Buchhaltung", text: "Digitale Belegablage, Bankanbindung und moderne Software: weniger Papier, weniger Aufwand, mehr Überblick." },
    ],
    audience: ["KMU aus Gewerbe, Handel und Dienstleistung", "Selbstständige und Freiberufliche", "Start-ups im ersten Geschäftsjahr", "Vereine und Stiftungen"],
    promise: [
      { title: "Monatlich aktuell", text: "Keine Überraschungen beim Jahresabschluss, weil die Zahlen laufend stimmen." },
      { title: "Digital oder auf Papier", text: "Belege per App, E-Mail oder im Ordner: Wir passen uns Ihrer Arbeitsweise an." },
      { title: "Fixe Richtpreise", text: "Den monatlichen Richtpreis berechnen Sie online, bevor wir zusammenarbeiten." },
    ],
    calculator: "treuhand",
    faq: [
      {
        question: "Wie bringe ich Ihnen meine Belege?",
        answer:
          "So, wie es für Sie am einfachsten ist: als Foto oder PDF per E-Mail, über eine digitale Belegablage oder ganz klassisch im Ordner bei uns in Langenthal. Beim Start richten wir gemeinsam einen Ablauf ein, der zu Ihnen passt.",
      },
      {
        question: "Was zählt als Buchung?",
        answer:
          "Eine Buchung ist ein Geschäftsvorfall: eine Rechnung, eine Zahlung, eine Spesenquittung. Die Anzahl pro Monat bestimmt den Aufwand. Im [Preisrechner](/rechner/treuhand) können Sie die Zahl schätzen, die Offerte prüfen wir danach mit Ihnen.",
      },
      {
        question: "Kann ich meine bestehende Buchhaltungssoftware behalten?",
        answer: "In den meisten Fällen ja. Wir arbeiten mit den gängigen Schweizer Lösungen und beraten Sie, wenn ein Wechsel Zeit und Kosten spart.",
      },
      {
        question: "Übernehmen Sie auch eine Buchhaltung mitten im Jahr?",
        answer: "Ja. Wir übernehmen die bisherigen Zahlen, prüfen die Eröffnungssalden und führen die Buchhaltung nahtlos weiter.",
      },
    ],
  },
  {
    slug: "steuern",
    name: "Steuern",
    short: "Steuern",
    icon: "receipt",
    tagline: "Keine Abzüge verschenken",
    summary: "Steuererklärungen für Privatpersonen und Unternehmen, korrekt und fristgerecht. Dazu Beratung, die Ihnen langfristig Steuern spart.",
    metaTitle: "Steuererklärung und Steuerberatung",
    metaDescription:
      "Steuererklärung für Privatpersonen und Unternehmen, Steuerberatung und Steueroptimierung im Kanton Bern. Kostenloses Erstgespräch bei ANB Treuhand.",
    intro:
      "Steuern sind komplex, aber Ihre Steuererklärung muss es nicht sein. Wir füllen sie vollständig aus, nutzen alle zulässigen Abzüge und behalten Fristen und Veranlagungen für Sie im Blick. Für Unternehmen planen wir vorausschauend, damit Entscheidungen auch steuerlich aufgehen.",
    items: [
      { title: "Steuererklärungen für Privatpersonen", text: "Für Angestellte, Paare, Familien, Rentnerinnen und Rentner sowie Liegenschaftsbesitzende, inklusive Wertschriftenverzeichnis." },
      { title: "Steuererklärungen für Unternehmen", text: "Für GmbH, AG und Einzelunternehmen, abgestimmt auf den Jahresabschluss." },
      { title: "Steuerberatung und Steueroptimierung", text: "Säule 3a, Einkäufe in die Pensionskasse, Liegenschaftsunterhalt, Lohn oder Dividende: Wir zeigen, was sich für Sie lohnt." },
      { title: "Unterstützung bei Steuerfragen", text: "Wir prüfen Veranlagungen, erstellen Einsprachen und vertreten Sie gegenüber der Steuerverwaltung." },
    ],
    audience: ["Privatpersonen und Familien", "Selbstständige und Einzelunternehmen", "GmbH und AG", "Eigentümerinnen und Eigentümer von Liegenschaften"],
    promise: [
      { title: "Alle Abzüge geprüft", text: "Wir kennen die Praxis im Kanton Bern und nutzen, was Ihnen zusteht." },
      { title: "Fristen im Griff", text: "Wir kümmern uns um Fristerstreckungen und prüfen jede Veranlagung." },
      { title: "Klare Pauschalen", text: "Sie kennen den Preis Ihrer Steuererklärung im Voraus." },
    ],
    calculator: "treuhand",
    faq: [
      {
        question: "Welche Unterlagen brauchen Sie für meine Steuererklärung?",
        answer:
          "Lohnausweis, Bank- und Depotauszüge per 31. Dezember, Belege zu Säule 3a und Pensionskasse, Krankheits- und Weiterbildungskosten sowie die Steuererklärung des Vorjahres. Nach dem Erstgespräch erhalten Sie eine persönliche Checkliste.",
      },
      {
        question: "Kann ich die Steuererklärung auch digital einreichen?",
        answer: "Ja. Sie senden uns Ihre Unterlagen als PDF oder Foto, wir reichen die Steuererklärung elektronisch ein.",
      },
      {
        question: "Was kostet eine private Steuererklärung?",
        answer:
          "Das hängt von Ihrer Situation ab, etwa von Liegenschaften oder Wertschriften. Wir nennen Ihnen nach einem kurzen Gespräch eine feste Pauschale. [Schreiben Sie uns](/kontakt?anliegen=steuern).",
      },
    ],
  },
  {
    slug: "firmengruendung",
    name: "Firmengründungen",
    short: "Firmengründung",
    icon: "building",
    tagline: "Vom Geistesblitz zum Handelsregister",
    summary: "Wir begleiten Sie von der Wahl der Rechtsform bis zum Eintrag im Handelsregister. Schnell, rechtssicher und zu einem klaren Preis.",
    metaTitle: "Firmengründung: GmbH, AG und Einzelfirma",
    metaDescription:
      "Firma gründen mit ANB Treuhand: Beratung zur Rechtsform, Firmenzweck, Statuten, Notariat und Handelsregister. Gründungskosten online berechnen.",
    intro:
      "Eine Firma zu gründen ist ein grosser Schritt. Wir sorgen dafür, dass er gelingt: Wir beraten Sie zur passenden Rechtsform, formulieren den Firmenzweck, bereiten die Statuten vor und koordinieren Notariat, Bank und Handelsregister. Sie konzentrieren sich auf Ihre Idee, wir auf die Formalitäten.",
    items: [
      { title: "Gründung von Einzelfirmen, GmbHs und AGs", text: "Das passende Gründungspaket für Ihre Rechtsform, inklusive aller Unterlagen." },
      { title: "Beratung bei der Wahl der Rechtsform", text: "Haftung, Steuern, Sozialversicherungen und Kapital: Wir vergleichen die Varianten anhand Ihrer Pläne." },
      { title: "Erstellung von Firmenzwecken und Vorbereitung der Statuten", text: "Ein Zweck, der heute passt und morgen Raum lässt, und Statuten, die Ihre Zusammenarbeit regeln." },
      { title: "Koordination mit Notariat und Handelsregister", text: "Wir organisieren Termine, Unterlagen und Anmeldungen und behalten den Überblick." },
      { title: "Begleitung während des gesamten Gründungsprozesses", text: "Von der ersten Idee bis zur Eröffnungsbilanz, auf Wunsch mit MWST- und Sozialversicherungsanmeldung." },
    ],
    audience: ["Gründerinnen und Gründer", "Selbstständige, die eine GmbH gründen möchten", "Teams mit mehreren Gesellschafterinnen und Gesellschaftern", "Unternehmen mit neuer Tochtergesellschaft"],
    promise: [
      { title: "Gründungskosten vorab", text: "Honorar und externe Kosten im Gründungsrechner, transparent aufgeschlüsselt." },
      { title: "Alles aus einer Hand", text: "Notariat, Bank, Handelsregister und Behörden koordinieren wir für Sie." },
      { title: "Bereit für den Start", text: "Auf Wunsch mit eingerichteter Buchhaltung ab dem ersten Tag." },
    ],
    calculator: "firmengruendung",
    faq: [
      {
        question: "Wie lange dauert eine GmbH-Gründung?",
        answer:
          "Sind die Angaben vollständig, dauert es meist zwei bis drei Wochen bis zum Eintrag im Handelsregister. Den grössten Teil der Wartezeit übernehmen Bank, Notariat und Handelsregister.",
      },
      {
        question: "Wie viel Kapital brauche ich?",
        answer:
          "Eine GmbH braucht mindestens CHF 20’000 Stammkapital, eine AG mindestens CHF 100’000 Aktienkapital, wovon bei der Gründung mindestens CHF 50’000 einbezahlt sein müssen. Das Kapital bleibt im Unternehmen und steht für die Geschäftstätigkeit zur Verfügung.",
      },
      {
        question: "Einzelfirma oder GmbH?",
        answer:
          "Die Einzelfirma ist einfach und günstig, Sie haften aber mit Ihrem Privatvermögen. Die GmbH trennt Geschäft und Privat und wirkt gegenüber Kundschaft und Banken oft professioneller. Im [Erstgespräch](/kontakt?anliegen=gruendung) vergleichen wir beide Varianten mit Ihren Zahlen.",
      },
      {
        question: "Was kostet eine Gründung insgesamt?",
        answer: "Das berechnen Sie im [Gründungsrechner](/rechner/firmengruendung): unser Honorar und die geschätzten Kosten für Notariat, Handelsregister und Bank.",
      },
    ],
  },
  {
    slug: "lohnbuchhaltung",
    name: "Lohnbuchhaltung & Personaladministration",
    short: "Lohnbuchhaltung",
    icon: "users",
    tagline: "Löhne pünktlich, Meldungen korrekt",
    summary: "Monatliche Lohnabrechnungen, Lohnausweise und alle Meldungen an die Sozialversicherungen. Korrekt, pünktlich und vertraulich.",
    metaTitle: "Lohnbuchhaltung und Personaladministration",
    metaDescription:
      "Lohnbuchhaltung für KMU: monatliche Lohnabrechnungen, Lohnausweise, Sozialversicherungen, An- und Abmeldungen und Personaladministration. Persönlich betreut von ANB Treuhand.",
    intro:
      "Ihre Mitarbeitenden verlassen sich auf einen korrekten Lohn, die Sozialversicherungen auf korrekte Meldungen. Wir übernehmen die Lohnbuchhaltung vollständig: von der monatlichen Abrechnung über Quellensteuer und Lohnausweise bis zur Jahresmeldung an AHV, Pensionskasse und Unfallversicherung.",
    items: [
      { title: "Monatliche Lohnabrechnungen", text: "Inklusive Zulagen, Spesen, Quellensteuer und Auszahlungsdateien für Ihre Bank." },
      { title: "Lohnausweise und Lohnmeldungen", text: "Lohnausweise nach Vorgaben der Steuerverwaltung und alle Jahresmeldungen." },
      { title: "Sozialversicherungsabrechnungen", text: "AHV/IV/EO, ALV, Familienzulagen, Pensionskasse, Unfall- und Krankentaggeldversicherung." },
      { title: "Personaladministration", text: "Arbeitsverträge, Arbeitszeugnisse, Bestätigungen und das Personaldossier, sauber geführt." },
      { title: "An- und Abmeldungen bei Sozialversicherungen", text: "Bei Eintritt, Austritt, Mutterschaft, Unfall oder Krankheit: Wir erledigen die Meldungen." },
    ],
    audience: ["KMU mit einer bis fünfzig Mitarbeitenden", "Inhaberinnen und Inhaber, die sich selbst einen Lohn auszahlen", "Unternehmen mit Stundenlöhnen und Saisonkräften", "Privathaushalte mit Angestellten"],
    promise: [
      { title: "Pünktlich zum Zahltag", text: "Lohnläufe nach festem Kalender, Auszahlungsdatei inklusive." },
      { title: "Vertraulich", text: "Lohndaten behandeln wir mit höchster Diskretion." },
      { title: "Preis pro Person", text: "Sie zahlen nach Anzahl Mitarbeitenden, ohne versteckte Zuschläge." },
    ],
    calculator: "treuhand",
    faq: [
      {
        question: "Bis wann brauchen Sie die Angaben für den Monatslohn?",
        answer: "In der Regel bis zum 20. des Monats. Wir legen den Kalender beim Start gemeinsam fest, damit die Löhne pünktlich ausbezahlt werden.",
      },
      {
        question: "Übernehmen Sie auch die Quellensteuer?",
        answer: "Ja. Wir berechnen die Quellensteuer, rechnen sie mit der Steuerverwaltung ab und berücksichtigen sie auf den Lohnausweisen.",
      },
      {
        question: "Ich bin allein in meiner GmbH. Brauche ich eine Lohnbuchhaltung?",
        answer: "Ja, sobald Sie sich einen Lohn auszahlen. Wir rechnen auch einzelne Löhne ab und beraten Sie zur richtigen Höhe von Lohn und Dividende.",
      },
    ],
  },
  {
    slug: "unternehmensberatung",
    name: "Unternehmensberatung",
    short: "Beratung",
    icon: "compass",
    tagline: "Entscheiden mit klarem Blick",
    summary: "Betriebswirtschaftliche Beratung, Finanz- und Liquiditätsplanung und administrative Unterstützung für Selbstständige und KMU.",
    metaTitle: "Unternehmensberatung für KMU",
    metaDescription:
      "Unternehmensberatung für Selbstständige und KMU: Finanz- und Liquiditätsplanung, betriebswirtschaftliche Beratung und administrative Unterstützung. Gratis Erstgespräch.",
    intro:
      "Gute Entscheidungen brauchen gute Grundlagen. Wir übersetzen Ihre Zahlen in Antworten: Lohnt sich die Investition? Reicht die Liquidität bis zum Winter? Welche Preise braucht es? Als Sparringpartner begleiten wir Sie mit dem Blick von aussen und der Nähe einer festen Ansprechperson.",
    items: [
      { title: "Betriebswirtschaftliche Beratung", text: "Kalkulation, Preisgestaltung, Kostenstruktur und Kennzahlen, die wirklich etwas aussagen." },
      { title: "Finanz- und Liquiditätsplanung", text: "Budget, Liquiditätsvorschau und Finanzierung, damit Sie Engpässe früh erkennen." },
      { title: "Administrative Unterstützung", text: "Korrespondenz, Verträge, Versicherungen und Behörden: Wir entlasten Sie im Büroalltag." },
      { title: "Begleitung von Selbstständigen und KMU", text: "Regelmässige Gespräche, in denen wir Zahlen, Ziele und nächste Schritte besprechen." },
      { title: "Gratis Erstgespräch", text: "Wir lernen Ihr Unternehmen kennen und zeigen, wo wir helfen können. Kostenlos und unverbindlich." },
    ],
    audience: ["Selbstständige in der Aufbauphase", "KMU vor Investitionen oder Wachstum", "Unternehmen in der Nachfolgeplanung", "Inhaberinnen und Inhaber, die entlastet werden möchten"],
    promise: [
      { title: "Zahlen, die sprechen", text: "Auswertungen, die Sie verstehen, statt Tabellen, die niemand liest." },
      { title: "Auf Augenhöhe", text: "Ehrliche Einschätzungen und konkrete Empfehlungen." },
      { title: "Erstgespräch gratis", text: "Sie entscheiden erst danach, ob und wie wir zusammenarbeiten." },
    ],
    calculator: "treuhand",
    faq: [
      {
        question: "Wie läuft das kostenlose Erstgespräch ab?",
        answer:
          "Wir treffen uns in Langenthal, bei Ihnen oder per Video. Sie erzählen von Ihrem Unternehmen, wir stellen Fragen und zeigen, wo wir Sie entlasten können. Danach erhalten Sie eine klare Offerte.",
      },
      {
        question: "Rechnen Sie Beratung nach Stunden ab?",
        answer: "Für laufende Begleitung bieten wir feste Quartalspauschalen an. Einzelne Projekte offerieren wir vorab, damit Sie die Kosten kennen.",
      },
    ],
  },
];

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

export function serviceHref(slug: Service["slug"]): string {
  return `/leistungen/${slug}`;
}
