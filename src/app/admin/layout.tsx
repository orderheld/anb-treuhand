import type { Metadata } from "next";

/**
 * Admin area: rendered per request, never indexed (also sent as X-Robots-Tag, see
 * next.config.ts). Pages read the session and the database on every request, so navigations
 * may block instead of showing a static shell. Every admin page repeats `instant = false`,
 * because Next.js validates navigations between sibling pages separately.
 */
export const instant = false;

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · Admin ANB Treuhand" },
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
  referrer: "no-referrer",
};

export default function AdminRootLayout({ children }: LayoutProps<"/admin">) {
  return <div className="flex min-h-dvh flex-col bg-mist text-[0.9375rem] leading-normal">{children}</div>;
}
