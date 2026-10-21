import { cn } from "@/lib/utils";
import { SMALL_HEADING, hyphenate } from "@/lib/hyphenate";

/** Numbered steps in a row: a small green number, title and text. */
export function ProcessSteps({ steps, className }: { steps: readonly { title: string; text: string }[]; className?: string }) {
  return (
    <ol className={cn("grid gap-x-8 gap-y-10 sm:grid-cols-2", steps.length === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4", className)}>
      {steps.map((step, i) => (
        <li key={step.title}>
          <span aria-hidden className="flex size-9 items-center justify-center rounded-full bg-accent-soft text-[0.9375rem] font-[650] text-accent tabular">
            {i + 1}
          </span>
          <h3 className="mt-4 text-h3">{hyphenate(step.title, SMALL_HEADING)}</h3>
          <p className="mt-2 text-body">{step.text}</p>
        </li>
      ))}
    </ol>
  );
}
