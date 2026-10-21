import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

/**
 * Content Security Policy without nonces, so every public page can stay static.
 * No third-party scripts, fonts, maps or trackers are loaded; fonts are self-hosted by next/font.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' blob: data:",
  "font-src 'self'",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()",
  },
];

/**
 * E-mail signatures (public/signatur): mail programs load the images from these fixed addresses,
 * so the files keep their names. Not indexed; the install page may show the images from the
 * live domain while it is opened on a preview address.
 */
const signatureHeaders = [
  { key: "X-Robots-Tag", value: "noindex, nofollow" },
  { key: "Content-Security-Policy", value: csp.replace("img-src 'self'", "img-src 'self' https://anb-treuhand.ch https://www.anb-treuhand.ch") },
];

/** Admin area: never cached, never indexed. */
const privateHeaders = [
  { key: "Cache-Control", value: "private, no-store, max-age=0" },
  { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
  { key: "Referrer-Policy", value: "no-referrer" },
];

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  env: {
    // Copyright year in the footer, fixed at build time so pages stay static.
    NEXT_PUBLIC_BUILD_YEAR: String(new Date().getFullYear()),
  },
  async redirects() {
    return [
      // Short addresses for print, business cards and e-mail signatures.
      { source: "/preisrechner", destination: "/rechner/treuhand", permanent: false },
      { source: "/gruendung", destination: "/rechner/firmengruendung", permanent: false },
      { source: "/offerte", destination: "/rechner", permanent: false },
      { source: "/portal", destination: "/kundenportal", permanent: false },
    ];
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      { source: "/signatur/:path*", headers: signatureHeaders },
      { source: "/admin/:path*", headers: privateHeaders },
      { source: "/admin", headers: privateHeaders },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
