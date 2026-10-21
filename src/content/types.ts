export interface FaqItem {
  question: string;
  /** Plain text; links as "[Label](/pfad)". */
  answer: string;
}

export type IconName =
  | "book"
  | "receipt"
  | "building"
  | "users"
  | "compass"
  | "home"
  | "hammer"
  | "key"
  | "calculator"
  | "shield"
  | "smartphone"
  | "handshake"
  | "map-pin"
  | "sparkles"
  | "file-text"
  | "chart"
  | "calendar"
  | "message";

export type CalculatorSlug = "treuhand" | "firmengruendung" | "immobilien";

export interface ServiceItem {
  title: string;
  text: string;
}

export interface Service {
  slug: "buchhaltung" | "steuern" | "firmengruendung" | "lohnbuchhaltung" | "unternehmensberatung";
  /** Full name as in the client's service list. */
  name: string;
  /** Short name for navigation and cards. */
  short: string;
  icon: IconName;
  /** One line under the name on cards. */
  tagline: string;
  /** Two sentences for the overview. */
  summary: string;
  metaTitle: string;
  metaDescription: string;
  /** Opening paragraph of the service page. */
  intro: string;
  items: ServiceItem[];
  /** Who it is for. */
  audience: string[];
  /** What the client gets, three short points. */
  promise: { title: string; text: string }[];
  calculator: CalculatorSlug | null;
  faq: FaqItem[];
}
