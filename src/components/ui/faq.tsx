import { ChevronDown } from "lucide-react";
import type { FaqItem } from "@/content/types";
import { RichText } from "./rich-text";
import { SMALL_HEADING, hyphenate } from "@/lib/hyphenate";

/** Accessible FAQ built on native <details>, works without JavaScript. */
export function Faq({ items }: { items: readonly FaqItem[] }) {
  return (
    <div className="border-t border-line">
      {items.map((item) => (
        <details key={item.question} className="group border-b border-line">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-0.5 py-5 text-left marker:hidden [&::-webkit-details-marker]:hidden">
            <h3 className="text-[1.0625rem] font-semibold leading-snug">{hyphenate(item.question, SMALL_HEADING)}</h3>
            <ChevronDown aria-hidden className="size-[1.125rem] shrink-0 text-muted transition-transform duration-200 group-open:rotate-180" strokeWidth={2} />
          </summary>
          <p className="-mt-1 max-w-3xl pb-5 pr-9 text-body">
            <RichText text={item.answer} />
          </p>
        </details>
      ))}
    </div>
  );
}
