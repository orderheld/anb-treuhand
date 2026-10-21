import { CornerFacet, Facet } from "@/components/brand/motifs";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";
import { hyphenate } from "@/lib/hyphenate";

/**
 * Green opening of every inner page, with the copper facet line of the business card. The top
 * padding clears the fixed header.
 */
export function PageHero({
  eyebrow,
  title,
  lead,
  breadcrumbs,
  children,
  aside,
  compact = false,
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  breadcrumbs?: { name: string; path: string }[];
  /** Buttons or other actions below the lead. */
  children?: React.ReactNode;
  /** Optional element on the right on large screens (e.g. a key figure). */
  aside?: React.ReactNode;
  /** Less height, for pages where the content below is the point (calculators, legal texts). */
  compact?: boolean;
  className?: string;
}) {
  return (
    <section className={cn("on-dark grain relative isolate overflow-hidden bg-forest text-cream", className)}>
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(110%_90%_at_85%_-10%,#2a4d3c_0%,#1c382a_48%,#142a1f_100%)]" />
      {/* On phones and tablets the facet sits in the top right corner, so the line never crosses the text. */}
      <CornerFacet id="page-facet-sm" className="-z-10 opacity-90 lg:hidden" />
      <Facet start={1180} id="page-facet" className="-z-10 hidden opacity-90 lg:block" />
      <Container className={cn("relative", compact ? "pb-14 pt-28 md:pb-20 md:pt-36" : "pb-20 pt-32 md:pb-28 md:pt-44")}>
        {breadcrumbs ? <Breadcrumbs items={breadcrumbs} /> : null}
        <div className={cn("grid gap-12 lg:grid-cols-12 lg:items-end", breadcrumbs ? "mt-10 md:mt-14" : null)}>
          <div className={cn("min-w-0", aside ? "lg:col-span-7" : "lg:col-span-9")}>
            {eyebrow ? <p className="eyebrow anb-rise">{eyebrow}</p> : null}
            <h1 className={cn("anb-rise text-h1", eyebrow ? "mt-6" : null)} style={{ "--anb-delay": "0.05s" } as React.CSSProperties}>
              {typeof title === "string" ? hyphenate(title) : title}
            </h1>
            {lead ? (
              <div className="anb-rise mt-7 max-w-2xl text-lead text-cream/75" style={{ "--anb-delay": "0.12s" } as React.CSSProperties}>
                {lead}
              </div>
            ) : null}
            {children ? (
              <div className="anb-rise mt-10 flex flex-wrap items-center gap-4" style={{ "--anb-delay": "0.18s" } as React.CSSProperties}>
                {children}
              </div>
            ) : null}
          </div>
          {aside ? <div className="min-w-0 lg:col-span-4 lg:col-start-9">{aside}</div> : null}
        </div>
      </Container>
    </section>
  );
}
