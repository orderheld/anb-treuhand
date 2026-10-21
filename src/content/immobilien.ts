import type { FaqItem, IconName } from "./types";

/**
 * Rubrik «Immobilien»: the client's property services (20.10.2026), grouped for the page, plus
 * renovation and construction support, which the client added the same day.
 */

export interface PropertyGroup {
  id: string;
  title: string;
  icon: IconName;
  lead: string;
  items: { title: string; text: string }[];
}

export const propertyGroups: PropertyGroup[] = [
  {
    id: "verwaltung",
    title: "Verwaltung",
    icon: "key",
    lead: "Für Mietliegenschaften und Stockwerkeigentum: zuverlässig, erreichbar und mit klaren Abläufen.",
    items: [
      { title: "Immobilienverwaltung", text: "Mietliegenschaften und Stockwerkeigentum, von der Vermietung bis zur Eigentümerversammlung." },
      { title: "Mietzinsinkasso und Mahnwesen", text: "Wir überwachen die Zahlungseingänge, mahnen konsequent und leiten wenn nötig die Betreibung ein." },
      { title: "Mietvertragsverwaltung", text: "Mietverträge, Mietzinsanpassungen, Kündigungen und Korrespondenz nach geltendem Mietrecht." },
      { title: "Wohnungsabnahmen und -übergaben", text: "Protokolle, Schlüsselübergaben, Mängellisten und Kautionsabrechnungen." },
      { title: "Organisation von Unterhalts- und Reparaturarbeiten", text: "Ein Netz aus verlässlichen Handwerksbetrieben, Offerten und Kontrolle der Arbeiten." },
    ],
  },
  {
    id: "finanzen",
    title: "Finanzen",
    icon: "chart",
    lead: "Transparente Zahlen für Eigentümerinnen, Eigentümer und Gemeinschaften.",
    items: [
      { title: "Immobilienbuchhaltung", text: "Liegenschaftsbuchhaltung mit klarer Kontenstruktur und aussagekräftigen Auswertungen." },
      { title: "Heiz- und Nebenkostenabrechnungen", text: "Korrekte, nachvollziehbare Abrechnungen für jede Mieteinheit, fristgerecht erstellt." },
      { title: "Jahres- und Eigentümerabrechnungen", text: "Übersichtliche Abrechnungen und Erneuerungsfonds, die jede Versammlung versteht." },
    ],
  },
  {
    id: "verkauf",
    title: "Verkauf",
    icon: "home",
    lead: "Den richtigen Preis erzielen, ohne Stress und mit sauberer Abwicklung.",
    items: [
      { title: "Immobilienverkauf und Verkaufsbegleitung", text: "Bewertung, Verkaufsdokumentation, Vermarktung, Besichtigungen und Verhandlung bis zur Beurkundung." },
    ],
  },
  {
    id: "sanierung",
    title: "Sanierung und Umbau",
    icon: "hammer",
    lead: "Wir planen, koordinieren und kontrollieren, damit Ihr Projekt im Budget und im Zeitplan bleibt.",
    items: [
      { title: "Immobiliensanierungen", text: "Planung, Organisation und Koordination von Renovationen und Sanierungsprojekten." },
      { title: "Baubegleitung", text: "Unterstützung von Eigentümerinnen und Eigentümern während der gesamten Sanierungsphase." },
      { title: "Handwerkerkoordination", text: "Einholung und Vergleich von Offerten sowie Koordination der Handwerksbetriebe." },
      { title: "Kosten- und Budgetkontrolle", text: "Erstellung von Sanierungsbudgets und laufende Überwachung der Kosten." },
      { title: "Projektmanagement", text: "Terminplanung, Überwachung des Projektfortschritts und Koordination aller Beteiligten." },
      { title: "Immobilienaufwertung", text: "Beratung zu wertsteigernden Renovations- und Modernisierungsmassnahmen." },
      { title: "Unterstützung bei Umbauten", text: "Begleitung bei Wohnungs-, Haus- und Gewerbeumbauten." },
    ],
  },
];

export const propertyFaq: FaqItem[] = [
  {
    question: "Wie berechnet sich das Verwaltungshonorar?",
    answer:
      "Für Mietliegenschaften in Prozent des Bruttomietertrags, mit einem Mindestbetrag pro Mieteinheit. Im Stockwerkeigentum pro Einheit und Jahr. Den Richtpreis für Ihre Liegenschaft sehen Sie im [Immobilien-Rechner](/rechner/immobilien).",
  },
  {
    question: "Was ist im Verwaltungshonorar enthalten?",
    answer:
      "Bei Mietliegenschaften: Mietzinsinkasso, Mahnwesen, Mietverträge, Wohnungsabnahmen und -übergaben, Organisation des Unterhalts, die Liegenschaftsbuchhaltung und die Eigentümerabrechnung. Die Heiz- und Nebenkostenabrechnung rechnen wir separat pro Einheit ab.",
  },
  {
    question: "Übernehmen Sie auch eine einzelne vermietete Wohnung?",
    answer: "Ja. Gerade private Vermieterinnen und Vermieter schätzen es, wenn sich jemand um Mieterwechsel, Nebenkosten und Reparaturen kümmert.",
  },
  {
    question: "Begleiten Sie Sanierungen auch ohne Verwaltungsmandat?",
    answer:
      "Ja. Wir unterstützen Sie bei einzelnen Projekten: vom Budget über die Offerten bis zur Abnahme der Arbeiten. Das Honorar berechnet sich nach der Bausumme oder als Pauschale.",
  },
  {
    question: "Wie hoch ist die Provision beim Verkauf?",
    answer:
      "Die Provision ist ein Prozentsatz des Verkaufspreises mit einem Mindestbetrag. Den Richtwert zeigt der [Immobilien-Rechner](/rechner/immobilien).",
  },
];
