/** Choices of the contact and offer forms. Shared by the client forms and the server validation. */

export interface Option<V extends string = string> {
  value: V;
  label: string;
}

/** Topic of a contact request; ?anliegen= on /kontakt preselects one. */
export const topics = [
  { value: "erstgespraech", label: "Gratis Erstgespräch" },
  { value: "buchhaltung", label: "Buchhaltung" },
  { value: "steuern", label: "Steuern" },
  { value: "gruendung", label: "Firmengründung" },
  { value: "lohn", label: "Lohnbuchhaltung" },
  { value: "beratung", label: "Unternehmensberatung" },
  { value: "immobilien", label: "Immobilien" },
  { value: "anderes", label: "Anderes" },
] as const satisfies readonly Option[];

export type Topic = (typeof topics)[number]["value"];

/** When the visitor would like to start. Optional in both forms. */
export const timings = [
  { value: "sofort", label: "So bald wie möglich" },
  { value: "3-monate", label: "In den nächsten 3 Monaten" },
  { value: "spaeter", label: "Später" },
  { value: "offen", label: "Noch offen" },
] as const satisfies readonly Option[];

export type Timing = (typeof timings)[number]["value"];

export function values<const T extends readonly Option[]>(options: T): [T[number]["value"], ...T[number]["value"][]] {
  return options.map((o) => o.value) as [T[number]["value"], ...T[number]["value"][]];
}

/** Label of a value, or "–" for an empty field. */
export function labelOf(options: readonly Option[], value: string | undefined | null): string {
  if (!value) return "–";
  return options.find((o) => o.value === value)?.label ?? value;
}
