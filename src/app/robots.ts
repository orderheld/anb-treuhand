import type { MetadataRoute } from "next";
import { absoluteUrl, isIndexable } from "@/config/site";

/** Production on the own domain is indexed; previews and the *.vercel.app address are not. */
export default function robots(): MetadataRoute.Robots {
  if (!isIndexable) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api/"] },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
