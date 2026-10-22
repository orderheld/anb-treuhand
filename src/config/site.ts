/**
 * Central company, contact and legal data of ANB Treuhand.
 *
 * Pages, header, footer, imprint, e-mails and structured data read from this file only.
 * Values with `confirmed: false` must be verified with the client before going live;
 * `npm run check:launch` lists them. Unconfirmed statements (opening hours, response time)
 * stay hidden on the site until they are confirmed.
 */

export interface Confirmable<T> {
  value: T;
  confirmed: boolean;
  note?: string;
}

export interface OpeningHours {
  /** As shown on the site, e.g. "Montag bis Freitag". */
  days: string;
  hours: string;
  /** schema.org day names for the structured data. */
  dayOfWeek: string[];
  slots: { opens: string; closes: string }[];
}

/**
 * Production address Vercel reports at build time, without "https://": the shortest custom
 * domain, or the *.vercel.app address while no custom domain is connected. Unset outside Vercel.
 */
const vercelProductionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;

export const site = {
  brand: "ANB Treuhand",
  /** Short name for tight spots (browser tab of the admin area, e-mail sender). */
  shortBrand: "ANB",
  tagline: "Buchhaltung, Steuern und Immobilien",
  description:
    "ANB Treuhand: Buchhaltung, Steuern, Lohnbuchhaltung, Firmengründungen, Unternehmensberatung und Immobilien für KMU, Selbstständige und Privatpersonen. Mit Online-Preisrechner und kostenlosem Erstgespräch.",
  locale: "de-CH",

  /**
   * Public base URL. While Vercel serves production on a *.vercel.app address, that address is
   * used even if NEXT_PUBLIC_SITE_URL is set, so links and share images point to the page being
   * served. With a custom domain NEXT_PUBLIC_SITE_URL wins; outside Vercel the domain is the fallback.
   */
  url: {
    value:
      (vercelProductionHost?.endsWith(".vercel.app") ? undefined : process.env.NEXT_PUBLIC_SITE_URL) ||
      (vercelProductionHost ? `https://${vercelProductionHost}` : "https://www.anb-treuhand.ch"),
    confirmed: true,
    note: "Domain anb-treuhand.ch ist bei cyon registriert (Ferhat, 20.10.2026).",
  } satisfies Confirmable<string>,

  legal: {
    /** Exact business name. Confirmed by Ferhat (20.10.2026): "ANB Treuhand", Einzelfirma. */
    entityName: {
      value: "ANB Treuhand",
      confirmed: true,
      note: "Von Ferhat bestätigt (20.10.2026).",
    } satisfies Confirmable<string>,
    legalForm: { value: "Einzelunternehmen", confirmed: true, note: "Einzelfirma (Ferhat, 20.10.2026)." } as Confirmable<string | null>,
    /**
     * Owner of the sole proprietorship. The imprint of an Einzelunternehmen has to name the owner;
     * Ferhat adds it later (20.10.2026). Until then the imprint shows the business name only.
     */
    owner: { value: null, confirmed: false, note: "Inhaberin/Inhaber fürs Impressum nachtragen (folgt laut Ferhat)." } as Confirmable<string | null>,
    /** e.g. "CHE-123.456.789". Follows later (Ferhat, 20.10.2026). */
    uid: { value: null, confirmed: false, note: "UID nachtragen (folgt laut Ferhat) oder bestätigen, dass keine besteht." } as Confirmable<string | null>,
    /** Not VAT-registered (Ferhat, 20.10.2026): prices are final, no VAT is added. */
    vatRegistered: { value: false, confirmed: true, note: "Nicht MWST-pflichtig (Ferhat, 20.10.2026)." } as Confirmable<boolean>,
    /** e.g. "CHE-123.456.789 MWST", only if VAT-registered. */
    vatNumber: { value: null, confirmed: true, note: "Keine, nicht MWST-pflichtig." } as Confirmable<string | null>,
    /** e.g. "Handelsregister des Kantons Bern", only if registered. */
    commercialRegister: { value: null, confirmed: false, note: "Eintrag im Handelsregister? Falls nein: confirmed auf true setzen." } as Confirmable<string | null>,
  },

  contact: {
    /** Contact person on the contact and about pages (Ferhat, 22.10.2026). */
    person: "Enesa Bilalli",
    /** Job title under the name. None given yet, so the line stays hidden. */
    title: null as string | null,
    email: { value: "info@anb-treuhand.ch", confirmed: true, note: "Von der Visitenkarte." } satisfies Confirmable<string>,
    phone: { value: "032 310 17 29", confirmed: true, note: "Von Ferhat (22.10.2026)." } as Confirmable<string | null>,
    address: {
      street: "Porzellanstrasse 5",
      postalCode: "4900",
      city: "Langenthal",
      region: "BE",
      country: "Schweiz",
      countryCode: "CH",
    },
    /** Opening hours, shown on the contact page and in structured data once confirmed. */
    openingHours: {
      value: [
        {
          days: "Montag bis Freitag",
          hours: "08.00–12.00 und 13.30–17.30 Uhr",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          slots: [
            { opens: "08:00", closes: "12:00" },
            { opens: "13:30", closes: "17:30" },
          ],
        },
      ],
      confirmed: true,
      note: "«Normale Bürozeiten Montag bis Freitag» (Ferhat, 20.10.2026).",
    } as Confirmable<OpeningHours[]>,
  },

  /** Promises on the site. Each one appears only once its `confirmed` is true. */
  offer: {
    /** "Gratis Erstgespräch" comes from the client's own service list. */
    firstCall: {
      value: { free: true },
      confirmed: true,
      note: "«Gratis Erstgespräch» steht in der Leistungsliste des Kunden.",
    } as Confirmable<{ free: boolean }>,
    responseWorkingDays: {
      value: 1,
      confirmed: false,
      note: "Antwort auf Anfragen «in der Regel innert eines Arbeitstages» versprechen?",
    } as Confirmable<number>,
  },

  /**
   * The customer portal is phase 2 (Ferhat, 20.10.2026: "langfristig"). While false, the site
   * presents it as "in Vorbereitung" and shows no login.
   */
  portalLive: false,

  /** Regions in which the services are offered. */
  region: "Oberaargau",
  areaServed: ["Langenthal", "Oberaargau", "Kanton Bern", "Schweiz"],
  languages: ["Deutsch"],

  social: {
    linkedin: null as string | null,
  },

  /** Credit line in the footer, as on Ferhat's other sites. */
  credit: { label: "Webdesign by", name: "webnova.ch", href: "https://webnova.ch" },
} as const;

/**
 * Search engines may index the site only in production on its own domain. Previews and the
 * *.vercel.app address stay out of the index until a custom domain is connected and the project
 * is redeployed. Outside Vercel the site counts as indexable.
 */
export const isIndexable =
  (process.env.VERCEL_ENV ?? "production") === "production" && !vercelProductionHost?.endsWith(".vercel.app");

export function absoluteUrl(path = "/"): string {
  const base = site.url.value.replace(/\/$/, "");
  return path === "/" ? base : `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

/** "Porzellanstrasse 5, 4900 Langenthal" */
export function addressLine(): string {
  const a = site.contact.address;
  return `${a.street}, ${a.postalCode} ${a.city}`;
}

/**
 * Phone number in international format without spaces, e.g. "032 123 45 67" → "+41321234567".
 * Swiss numbers written with a leading 0 get +41, so links also work from abroad.
 */
export function phoneE164(phone: string): string {
  return phone
    .replace(/[^+\d]/g, "")
    .replace(/^00/, "+")
    .replace(/^0/, "+41");
}

/** tel: link target, e.g. "tel:+41321234567". */
export function phoneHref(phone: string): string {
  return `tel:${phoneE164(phone)}`;
}

/** All values that still need confirmation, for the launch check. */
export function unconfirmedFields(): { field: string; value: unknown; note?: string }[] {
  const entries: [string, Confirmable<unknown>][] = [
    ["Domain (url)", site.url],
    ["Firmenname (legal.entityName)", site.legal.entityName],
    ["Rechtsform (legal.legalForm)", site.legal.legalForm],
    ["Inhaber (legal.owner)", site.legal.owner],
    ["UID (legal.uid)", site.legal.uid],
    ["MWST-Pflicht (legal.vatRegistered)", site.legal.vatRegistered],
    ["MWST-Nummer (legal.vatNumber)", site.legal.vatNumber],
    ["Handelsregister (legal.commercialRegister)", site.legal.commercialRegister],
    ["E-Mail (contact.email)", site.contact.email],
    ["Telefon (contact.phone)", site.contact.phone],
    ["Öffnungszeiten (contact.openingHours)", site.contact.openingHours],
    ["Erstgespräch (offer.firstCall)", site.offer.firstCall],
    ["Antwortzeit (offer.responseWorkingDays)", site.offer.responseWorkingDays],
  ];
  return entries
    .filter(([, c]) => !c.confirmed)
    .map(([field, c]) => ({
      field,
      value: c.value !== null && typeof c.value === "object" ? JSON.stringify(c.value) : c.value,
      note: c.note,
    }));
}

const numberWords = ["null", "eines Arbeitstages", "zwei Arbeitstagen", "drei Arbeitstagen"];

/**
 * " – in der Regel innert eines Arbeitstages" once the response time is confirmed, otherwise an
 * empty string. Append directly after the sentence that promises a reply.
 */
export function responseClause(): string {
  const { value, confirmed } = site.offer.responseWorkingDays;
  if (!confirmed) return "";
  return `, in der Regel innert ${numberWords[value] ?? `${value} Arbeitstagen`}`;
}

/** True when the site may call the first meeting free of charge. */
export function firstCallFree(): boolean {
  return site.offer.firstCall.confirmed && site.offer.firstCall.value.free;
}

/** "Das Erstgespräch ist kostenlos und unverbindlich." or the neutral variant. */
export function firstCallSentence(): string {
  return firstCallFree() ? "Das Erstgespräch ist kostenlos und unverbindlich." : "Das Erstgespräch ist unverbindlich.";
}

/**
 * One sentence about VAT next to prices: final prices while ANB is not VAT-registered. Switch
 * `legal.vatRegistered` when that changes; the calculator hints in the admin area then need the
 * same update.
 */
export function vatNote(): string {
  return site.legal.vatRegistered.value ? "Preise exkl. 8,1 % MWST." : "Endpreise: ANB Treuhand ist nicht mehrwertsteuerpflichtig.";
}
