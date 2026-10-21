import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Icon } from "@/components/ui/icon";
import type { IconName } from "@/content/types";
import { cn } from "@/lib/utils";
import { SMALL_HEADING, hyphenate } from "@/lib/hyphenate";

export interface ServiceIndexItem {
  href: string;
  name: string;
  tagline: string;
  summary: string;
  icon: IconName;
}

/**
 * The services as cards: icon in a green well, name, short summary and a link. White cards on
 * grey sections (`tone="mist"`), grey cards on white ones. The whole card is the link.
 */
export function ServiceIndex({
  items,
  className,
  headingLevel: Heading = "h3",
  tone = "mist",
}: {
  items: ServiceIndexItem[];
  className?: string;
  headingLevel?: "h2" | "h3";
  /** Background of the surrounding section. */
  tone?: "white" | "mist";
}) {
  return (
    <ul className={cn("grid gap-5 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {items.map((item) => (
        <li key={item.href}>
          <Link
            href={item.href}
            className={cn(
              "group flex h-full flex-col rounded-card p-6 transition-shadow duration-200 hover:shadow-card sm:p-7",
              tone === "mist" ? "bg-white" : "bg-mist hover:bg-white",
            )}
          >
            <span aria-hidden className="flex size-11 items-center justify-center rounded-xl bg-accent-soft text-accent">
              <Icon name={item.icon} className="size-5" />
            </span>
            <Heading className="mt-5 text-[1.0625rem] font-semibold leading-snug">{hyphenate(item.name, SMALL_HEADING)}</Heading>
            <p className="mt-1.5 flex-1 text-[0.9375rem] text-body">{item.summary}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-[0.9375rem] font-medium text-accent">
              Mehr erfahren
              <ChevronRight aria-hidden className="size-4 transition-transform duration-150 group-hover:translate-x-0.5" strokeWidth={2} />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
