import { Plus } from "lucide-react";
import type { FaqItem } from "@/content/types";
import { RichText } from "./rich-text";
import { SMALL_HEADING, hyphenate } from "@/lib/hyphenate";

/** Accessible FAQ built on native <details>, works without JavaScript. */
export function Faq({ items }: { items: readonly FaqItem[] }) {
  return (
    <div className="divide-y divide-sand border-y border-sand">
      {items.map((item) => (
        <details key={item.question} className="group">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-6 text-left transition-colors marker:hidden [&::-webkit-details-marker]:hidden">
            <h3 className="font-serif text-[1.3125rem] leading-snug text-ink transition-colors group-hover:text-bronze">{hyphenate(item.question, SMALL_HEADING)}</h3>
            <span
              aria-hidden
              className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full border border-forest/20 text-forest transition-all duration-300 group-open:rotate-45 group-open:border-forest group-open:bg-forest group-open:text-cream"
            >
              <Plus className="size-4" strokeWidth={1.5} />
            </span>
          </summary>
          <p className="max-w-3xl pb-7 pr-14 leading-relaxed text-body">
            <RichText text={item.answer} />
          </p>
        </details>
      ))}
    </div>
  );
}
