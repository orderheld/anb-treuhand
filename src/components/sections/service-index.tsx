import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Icon } from "@/components/ui/icon";
import type { IconName } from "@/content/types";
import { cn } from "@/lib/utils";
import { hyphenate } from "@/lib/hyphenate";

export interface ServiceIndexItem {
  href: string;
  name: string;
  tagline: string;
  summary: string;
  icon: IconName;
}

/**
 * The services as an index with fine rules, like the table of contents of an annual report:
 * number, name in Bodoni, a short promise and the summary. The whole row is the link. On phones
 * the number sits above the name, so long names like "Personaladministration" get the full width.
 */
export function ServiceIndex({ items, className, headingLevel: Heading = "h3" }: { items: ServiceIndexItem[]; className?: string; headingLevel?: "h2" | "h3" }) {
  return (
    <ul className={cn("border-t border-sand", className)}>
      {items.map((item, i) => (
        <li key={item.href} className="border-b border-sand">
          <Link
            href={item.href}
            className="group relative isolate grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-3 py-8 md:grid-cols-12 md:gap-x-8 md:py-10"
          >
            {/* Hover surface reaches slightly beyond the text, so the row reads as one target. */}
            <span
              aria-hidden
              className="absolute -inset-x-4 inset-y-0 -z-10 rounded-2xl bg-white opacity-0 shadow-card transition-opacity duration-500 ease-out-soft group-hover:opacity-100 md:-inset-x-6"
            />
            <span aria-hidden className="font-serif text-lg text-bronze tabular md:col-span-1">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span
              aria-hidden
              className="flex size-10 items-center justify-center justify-self-end rounded-full border border-forest/20 text-forest transition-all duration-500 ease-out-soft group-hover:border-forest group-hover:bg-forest group-hover:text-copper md:order-last md:col-span-1 md:size-12"
            >
              <ArrowUpRight className="size-5 transition-transform duration-500 ease-out-soft group-hover:rotate-45" strokeWidth={1.5} />
            </span>
            <div className="col-span-2 min-w-0 md:col-span-5">
              <Heading className="font-serif text-[1.75rem] leading-[1.15] text-ink transition-colors duration-300 group-hover:text-forest md:text-[2.125rem]">
                {hyphenate(item.name)}
              </Heading>
              <p className="mt-2 flex items-center gap-2 text-sm text-bronze">
                <Icon name={item.icon} className="size-4 shrink-0" />
                {item.tagline}
              </p>
            </div>
            <p className="col-span-2 leading-relaxed text-body md:col-span-5">{item.summary}</p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
