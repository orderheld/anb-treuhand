import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Icon } from "@/components/ui/icon";
import { calculatorHref, calculators } from "@/content/calculators";
import type { CalculatorSlug } from "@/content/types";
import { cn } from "@/lib/utils";
import { SMALL_HEADING, hyphenate } from "@/lib/hyphenate";

/**
 * The three calculators as cards (hub page, home page, below a calculator). `tone="dark"` is for
 * green sections: tonal cards with copper details instead of white ones.
 */
export function CalculatorCards({
  exclude,
  className,
  headingLevel: Heading = "h3",
  tone = "light",
}: {
  exclude?: CalculatorSlug;
  className?: string;
  headingLevel?: "h2" | "h3";
  tone?: "light" | "dark";
}) {
  const list = calculators.filter((c) => c.slug !== exclude);
  const dark = tone === "dark";
  return (
    <ul className={cn("grid gap-5", list.length === 3 ? "lg:grid-cols-3" : "md:grid-cols-2", className)}>
      {list.map((c) => (
        <li key={c.slug}>
          <Link
            href={calculatorHref(c.slug)}
            className={cn(
              "group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border p-7 transition-[transform,box-shadow,border-color,background-color] duration-500 ease-out-soft hover:-translate-y-1 sm:p-8",
              dark
                ? "border-cream/10 bg-forest-soft hover:border-copper/45 hover:bg-forest-mist hover:shadow-float"
                : "border-sand/80 bg-white shadow-card hover:border-copper/50 hover:shadow-lift",
            )}
          >
            <span
              aria-hidden
              className={cn(
                "flex size-12 items-center justify-center rounded-full border transition-colors duration-500",
                dark
                  ? "border-copper/40 text-copper group-hover:bg-copper group-hover:text-forest-deep"
                  : "border-copper/50 bg-cream text-forest group-hover:bg-forest group-hover:text-copper",
              )}
            >
              <Icon name={c.icon} className="size-5" />
            </span>
            <span className={cn("mt-7 text-xs font-medium uppercase tracking-[0.2em]", dark ? "text-copper" : "text-bronze")}>{c.name}</span>
            <Heading className={cn("mt-3 font-serif text-[1.625rem] leading-tight", dark ? "text-cream" : "text-ink")}>{hyphenate(c.title, SMALL_HEADING)}</Heading>
            <p className={cn("mt-3 flex-1 leading-relaxed", dark ? "text-cream/70" : "text-body")}>{c.description}</p>
            <span className={cn("mt-7 inline-flex items-center gap-2 font-medium", dark ? "text-cream" : "text-forest")}>
              Zum Rechner
              <ArrowRight
                aria-hidden
                className={cn("size-4 transition-transform duration-300 ease-out-soft group-hover:translate-x-1", dark && "text-copper")}
                strokeWidth={1.75}
              />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
