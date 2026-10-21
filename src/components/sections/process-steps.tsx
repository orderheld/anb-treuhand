import { cn } from "@/lib/utils";
import { SMALL_HEADING, hyphenate } from "@/lib/hyphenate";

/**
 * Numbered steps in a row, joined by a fine copper line on large screens (as the rules beside
 * TREUHAND in the logo). Works on white, cream and green.
 */
export function ProcessSteps({ steps, className }: { steps: readonly { title: string; text: string }[]; className?: string }) {
  return (
    <ol className={cn("relative grid gap-10 sm:grid-cols-2", steps.length === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4", "lg:gap-8", className)}>
      <span aria-hidden className="absolute left-0 right-0 top-[1.375rem] hidden h-px bg-gradient-to-r from-copper/70 via-copper/40 to-transparent lg:block" />
      {steps.map((step, i) => (
        <li key={step.title} className="relative">
          <span
            aria-hidden
            className="relative flex size-11 items-center justify-center rounded-full border border-copper/60 bg-white font-serif text-lg text-bronze in-[.on-dark]:bg-forest in-[.on-dark]:text-copper"
          >
            {String(i + 1).padStart(2, "0")}
          </span>
          <h3 className="mt-6 font-serif text-h3 text-ink in-[.on-dark]:text-cream">{hyphenate(step.title, SMALL_HEADING)}</h3>
          <p className="mt-3 leading-relaxed text-body in-[.on-dark]:text-cream/75">{step.text}</p>
        </li>
      ))}
    </ol>
  );
}
