import type { CalculatorSlug, FaqItem, IconName } from "./types";

/** The three calculators as presented on cards, the hub page and in the navigation. */
export const calculators: {
  slug: CalculatorSlug;
  name: string;
  /** Short label for lists, e.g. in the footer. */
  short: string;
  title: string;
  description: string;
  result: string;
  icon: IconName;
  metaTitle: string;
  metaDescription: string;
  faq: FaqItem[];
}[] = [
  {
    slug: "treuhand",
    name: "Treuhand-Preisrechner",
    short: "Treuhand",
    title: "Was kostet meine Buchhaltung?",
    description: "Rechtsform, Buchungen, Mitarbeitende und Leistungen wählen: Sie sehen sofort Ihren monatlichen Richtpreis.",
    result: "Richtpreis pro Monat",
    icon: "calculator",
    metaTitle: "Treuhand-Preisrechner: Buchhaltung, Steuern, Löhne",
    metaDescription:
      "Berechnen Sie online den monatlichen Richtpreis für Buchhaltung, MWST, Lohnbuchhaltung, Jahresabschluss und Steuern. Unverbindlich, mit Offerte per E-Mail.",
    faq: [
      {
        question: "Was zählt als Buchung?",
        answer:
          "Jeder Geschäftsfall, den wir erfassen: eine Rechnung, eine Quittung oder eine Bewegung auf dem Bankkonto. Als Faustregel zählen Sie Ihre Belege und Bankbewegungen eines durchschnittlichen Monats zusammen.",
      },
      {
        question: "Warum zeigt der Rechner einen Preis pro Monat?",
        answer:
          "Jährliche Arbeiten wie Jahresabschluss und Steuererklärung verteilt der Rechner auf zwölf Monate. So sehen Sie auf einen Blick, was Ihre Buchhaltung pro Monat kostet. Wie wir abrechnen, halten wir gemeinsam in der Offerte fest.",
      },
      {
        question: "Wie verbindlich ist der Richtpreis?",
        answer:
          "Er beruht auf unseren aktuellen Tarifen und Ihren Angaben. Die verbindliche Offerte erhalten Sie nach dem kostenlosen Erstgespräch, wenn wir Ihre Unterlagen kennen.",
      },
    ],
  },
  {
    slug: "firmengruendung",
    name: "Firmengründungsrechner",
    short: "Firmengründung",
    title: "Was kostet meine Gründung?",
    description: "Einzelfirma, GmbH oder AG: Honorar und geschätzte Kosten für Notariat, Handelsregister und Bank auf einen Blick.",
    result: "Gründungspreis, einmalig",
    icon: "building",
    metaTitle: "Firmengründungsrechner: Kosten für GmbH, AG und Einzelfirma",
    metaDescription:
      "Was kostet eine Firmengründung in der Schweiz? Honorar, Notariat, Handelsregister und Bank für GmbH, AG und Einzelfirma online berechnen.",
    faq: [
      {
        question: "GmbH oder AG: Was passt zu mir?",
        answer:
          "Bei beiden haftet nur das Gesellschaftsvermögen. Die GmbH braucht CHF 20’000 Stammkapital und passt für die meisten KMU. Die AG braucht CHF 100’000 Aktienkapital, davon sind mindestens CHF 50’000 einzuzahlen; die Aktionärinnen und Aktionäre stehen nicht im Handelsregister. Im Erstgespräch zeigen wir Ihnen, was zu Ihrem Vorhaben passt.",
      },
      {
        question: "Was sind externe Kosten?",
        answer:
          "Gebühren, die nicht an uns gehen: für die öffentliche Beurkundung beim Notariat, die Eintragung ins Handelsregister und das Kapitaleinzahlungskonto der Bank. Der Rechner schätzt sie nach den aktuellen Tarifen. Verrechnet werden sie direkt von den Stellen oder ohne Aufschlag.",
      },
      {
        question: "Wie lange dauert eine Gründung?",
        answer:
          "Sind die Unterlagen vollständig, dauert die Gründung einer GmbH oder AG meist zwei bis vier Wochen bis zum Eintrag im Handelsregister. Eine Einzelfirma ist oft schneller startklar.",
      },
      {
        question: "Muss ich meine Einzelfirma ins Handelsregister eintragen?",
        answer: "Ab einem Jahresumsatz von CHF 100’000 ist der Eintrag Pflicht. Darunter ist er freiwillig.",
      },
    ],
  },
  {
    slug: "immobilien",
    name: "Immobilien-Rechner",
    short: "Immobilien",
    title: "Was kostet die Verwaltung meiner Liegenschaft?",
    description: "Verwaltung, Nebenkosten, Buchhaltung, Verkauf oder Sanierung: Richtpreise für Ihre Immobilie in wenigen Schritten.",
    result: "Richtpreis pro Monat und Jahr",
    icon: "key",
    metaTitle: "Immobilien-Rechner: Verwaltung, Verkauf und Sanierung",
    metaDescription:
      "Richtpreis für Liegenschaftsverwaltung, Stockwerkeigentum, Nebenkostenabrechnung, Verkaufsprovision und Baubegleitung online berechnen.",
    faq: [
      {
        question: "Wie berechnet sich das Verwaltungshonorar?",
        answer:
          "Für Mietliegenschaften in Prozent der Mieteinnahmen, mit einem Mindestbetrag pro Mieteinheit. Im Stockwerkeigentum pro Einheit und Jahr.",
      },
      {
        question: "Was ist in der Verwaltung enthalten?",
        answer:
          "Bei Mietliegenschaften: Mietzinsinkasso, Mahnwesen, Mietverträge, Wohnungsabnahmen und -übergaben, die Organisation des Unterhalts, die Liegenschaftsbuchhaltung und die Eigentümerabrechnung. Die Heiz- und Nebenkostenabrechnung rechnen wir separat pro Einheit ab.",
      },
      {
        question: "Kann ich auch nur einzelne Leistungen beziehen?",
        answer:
          "Ja. Sie können zum Beispiel nur die Heiz- und Nebenkostenabrechnung, die Immobilienbuchhaltung oder die Begleitung einer Sanierung bei uns in Auftrag geben, ohne Verwaltungsmandat.",
      },
    ],
  },
];

export function calculatorHref(slug: CalculatorSlug): string {
  return `/rechner/${slug}`;
}

export function getCalculator(slug: CalculatorSlug) {
  return calculators.find((c) => c.slug === slug)!;
}
