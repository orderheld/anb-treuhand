import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";
import { hyphenate } from "@/lib/hyphenate";

/** White opening of every inner page: breadcrumbs, kicker, title, lead and optional actions. */
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
    <section className={cn("bg-white", className)}>
      <Container className={compact ? "pb-10 pt-8 md:pb-14 md:pt-10" : "pb-14 pt-8 md:pb-20 md:pt-10"}>
        {breadcrumbs ? <Breadcrumbs items={breadcrumbs} /> : null}
        <div className={cn("grid gap-12 lg:grid-cols-12 lg:items-center", breadcrumbs ? "mt-10 md:mt-14" : null)}>
          <div className={cn("min-w-0", aside ? "lg:col-span-7" : "lg:col-span-9")}>
            {eyebrow ? <p className="kicker mb-3">{eyebrow}</p> : null}
            <h1 className="text-h1">{typeof title === "string" ? hyphenate(title) : title}</h1>
            {lead ? <div className="mt-5 max-w-2xl text-lead text-body">{lead}</div> : null}
            {children ? <div className="mt-8 flex flex-wrap items-center gap-3">{children}</div> : null}
          </div>
          {aside ? <div className="min-w-0 lg:col-span-5 lg:col-start-8">{aside}</div> : null}
        </div>
      </Container>
    </section>
  );
}
