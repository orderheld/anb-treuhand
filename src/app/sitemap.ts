import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/config/site";
import { calculatorHref, calculators } from "@/content/calculators";
import { serviceHref, services } from "@/content/services";

/** All public pages. The admin area and API routes are excluded (see robots.ts). */
export default function sitemap(): MetadataRoute.Sitemap {
  const entry = (path: string, priority: number, changeFrequency: "monthly" | "yearly" = "monthly"): MetadataRoute.Sitemap[number] => ({
    url: absoluteUrl(path),
    changeFrequency,
    priority,
  });
  return [
    entry("/", 1),
    entry("/leistungen", 0.9),
    ...services.map((s) => entry(serviceHref(s.slug), 0.8)),
    entry("/immobilien", 0.8),
    entry("/rechner", 0.8),
    ...calculators.map((c) => entry(calculatorHref(c.slug), 0.8)),
    entry("/ueber-uns", 0.6),
    entry("/kontakt", 0.7),
    entry("/kundenportal", 0.4),
    entry("/impressum", 0.2, "yearly"),
    entry("/datenschutz", 0.2, "yearly"),
  ];
}
