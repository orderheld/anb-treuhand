import type { MetadataRoute } from "next";
import { site } from "@/config/site";

/** Web app manifest: name, colours and icons when the site is added to a home screen. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.brand,
    short_name: site.shortBrand,
    description: site.description,
    lang: "de-CH",
    start_url: "/",
    display: "browser",
    background_color: "#142a1f",
    theme_color: "#142a1f",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
