import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

/**
 * Skip link, header, main and footer of the public site. Used by the site layout and the 404 page.
 * The `site` wrapper scopes site-only CSS (serif headings, green page background) so the admin
 * area keeps its own look; `display: contents` keeps the body's flex column layout.
 */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  return (
    <div className="site contents">
      <a
        href="#inhalt"
        className="sr-only z-[60] rounded-full bg-copper px-5 py-3 font-medium text-forest-deep focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Zum Inhalt springen
      </a>
      <SiteHeader />
      <main id="inhalt" className="flex-1 bg-white">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
