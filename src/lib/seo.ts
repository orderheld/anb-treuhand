import type { Metadata } from "next";
import { absoluteUrl, site } from "@/config/site";
import type { FaqItem, Service } from "@/content/types";

interface PageMetaInput {
  /** Title without the " | ANB Treuhand" suffix (the layout template adds it). */
  title: string;
  description: string;
  path: string;
  /** Use for the home page, where the template must not apply. */
  absoluteTitle?: boolean;
  noindex?: boolean;
}

/**
 * Default share image (app/opengraph-image.png from the corporate design package). Listed
 * explicitly because a page's own openGraph object replaces the file-based image of the root
 * segment.
 */
const shareImage = {
  url: "/opengraph-image.png",
  width: 1200,
  height: 630,
  alt: "ANB Treuhand, Langenthal: Buchhaltung, Steuern, Löhne, Firmengründungen und Immobilien.",
};

/** Metadata for a page: canonical URL, Open Graph and Twitter. */
export function pageMetadata(input: PageMetaInput): Metadata {
  const ogTitle = input.absoluteTitle ? input.title : `${input.title} | ${site.brand}`;
  return {
    title: input.absoluteTitle ? { absolute: input.title } : input.title,
    description: input.description,
    alternates: { canonical: input.path },
    openGraph: {
      type: "website",
      url: input.path,
      siteName: site.brand,
      locale: "de_CH",
      title: ogTitle,
      description: input.description,
      images: [shareImage],
    },
    twitter: { card: "summary_large_image", title: ogTitle, description: input.description, images: [shareImage.url] },
    ...(input.noindex ? { robots: { index: false, follow: true } } : {}),
  };
}

/* ---------- Structured data (schema.org). Only facts that are true today. ---------- */

const ORG_ID = `${absoluteUrl("/")}#organisation`;
const WEBSITE_ID = `${absoluteUrl("/")}#website`;

export function organizationJsonLd() {
  const { address, phone, email, openingHours } = site.contact;
  return {
    "@context": "https://schema.org",
    "@type": "AccountingService",
    "@id": ORG_ID,
    name: site.brand,
    ...(site.legal.entityName.confirmed ? { legalName: site.legal.entityName.value } : {}),
    description: site.description,
    url: absoluteUrl("/"),
    logo: absoluteUrl("/brand/anb-treuhand-logo.png"),
    image: absoluteUrl("/opengraph-image.png"),
    email: email.value,
    ...(phone.value ? { telephone: phone.value } : {}),
    address: {
      "@type": "PostalAddress",
      streetAddress: address.street,
      postalCode: address.postalCode,
      addressLocality: address.city,
      addressRegion: address.region,
      addressCountry: address.countryCode,
    },
    areaServed: site.areaServed.map((name) => ({ "@type": "Place", name })),
    knowsLanguage: ["de"],
    ...(openingHours.confirmed
      ? {
          openingHoursSpecification: openingHours.value.flatMap((h) =>
            h.slots.map((slot) => ({ "@type": "OpeningHoursSpecification", dayOfWeek: h.dayOfWeek, opens: slot.opens, closes: slot.closes })),
          ),
        }
      : {}),
    ...(site.social.linkedin ? { sameAs: [site.social.linkedin] } : {}),
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: site.brand,
    url: absoluteUrl("/"),
    inLanguage: site.locale,
    publisher: { "@id": ORG_ID },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({ "@type": "ListItem", position: i + 1, name: item.name, item: absoluteUrl(item.path) })),
  };
}

export function serviceJsonLd(service: Pick<Service, "name" | "metaDescription">, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    serviceType: service.name,
    description: service.metaDescription,
    url: absoluteUrl(path),
    provider: { "@id": ORG_ID },
    areaServed: site.areaServed.map((name) => ({ "@type": "Place", name })),
  };
}

export function faqJsonLd(faq: readonly FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: stripLinks(f.answer) } })),
  };
}

/** "[Label](/pfad)" → "Label" for plain-text contexts. */
export function stripLinks(text: string): string {
  return text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
}
