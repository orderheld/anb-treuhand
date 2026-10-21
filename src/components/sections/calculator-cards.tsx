import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Icon } from "@/components/ui/icon";
import { calculatorHref, calculators } from "@/content/calculators";
import type { CalculatorSlug } from "@/content/types";
import { cn } from "@/lib/utils";
import { SMALL_HEADING, hyphenate } from "@/lib/hyphenate";

/**
 * The three calculators as cards (hub page, home page, below a calculator). White cards on grey
 * sections (`tone="mist"`), grey cards on white ones.
 */
export function CalculatorCards({
  exclude,
  className,
  headingLevel: Heading = "h3",
  tone = "white",
}: {
  exclude?: CalculatorSlug;
  className?: string;
  headingLevel?: "h2" | "h3";
  /** Background of the surrounding section. */
  tone?: "white" | "mist";
}) {
  const list = calculators.filter((c) => c.slug !== exclude);
  return (
    <ul className={cn("grid gap-5", list.length === 3 ? "lg:grid-cols-3" : "md:grid-cols-2", className)}>
      {list.map((c) => (
        <li key={c.slug}>
          <Link
            href={calculatorHref(c.slug)}
            className={cn(
              "group flex h-full flex-col rounded-card p-6 transition-shadow duration-200 hover:shadow-card sm:p-7",
              tone === "mist" ? "bg-white" : "bg-mist hover:bg-white",
            )}
          >
            <span aria-hidden className="flex size-11 items-center justify-center rounded-xl bg-accent-soft text-accent">
              <Icon name={c.icon} className="size-5" />
            </span>
            <span className="mt-5 text-sm font-semibold text-accent">{c.name}</span>
            <Heading className="mt-1 text-h3">{hyphenate(c.title, SMALL_HEADING)}</Heading>
            <p className="mt-2 flex-1 text-[0.9375rem] text-body">{c.description}</p>
            <span className="mt-5 inline-flex items-center gap-1 text-[0.9375rem] font-medium text-accent">
              Zum Rechner
              <ChevronRight aria-hidden className="size-4 transition-transform duration-150 group-hover:translate-x-0.5" strokeWidth={2} />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
