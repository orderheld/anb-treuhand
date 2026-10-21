import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Jost } from "next/font/google";
import { isIndexable, site } from "@/config/site";
import "./globals.css";

/**
 * The two typefaces of the corporate design, self-hosted by next/font at build time (no request to
 * Google from the visitor's browser): Bodoni Moda for titles, Jost for everything else. Bodoni Moda
 * keeps its optical-size axis, so large titles get the fine hairlines of the display cut.
 */
const bodoni = Bodoni_Moda({
  subsets: ["latin", "latin-ext"],
  axes: ["opsz"],
  variable: "--font-bodoni",
  display: "swap",
});

const jost = Jost({
  subsets: ["latin", "latin-ext"],
  variable: "--font-jost",
  display: "swap",
});

const googleVerification = process.env.GOOGLE_SITE_VERIFICATION;

export const metadata: Metadata = {
  metadataBase: new URL(site.url.value),
  title: {
    default: `${site.brand} – ${site.tagline}`,
    template: `%s | ${site.brand}`,
  },
  description: site.description,
  applicationName: site.brand,
  creator: site.brand,
  publisher: site.brand,
  formatDetection: { telephone: false, address: false, email: false },
  openGraph: {
    type: "website",
    siteName: site.brand,
    locale: "de_CH",
  },
  robots: isIndexable ? { index: true, follow: true } : { index: false, follow: false },
  ...(googleVerification ? { verification: { google: googleVerification } } : {}),
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
};

/**
 * Shared document shell for the public site (`(site)/layout.tsx`, prerendered) and the admin
 * area (`admin/`, rendered per request). Page chrome lives in those layouts.
 */
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="de-CH" className={`${bodoni.variable} ${jost.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
