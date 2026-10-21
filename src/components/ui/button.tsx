import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * primary: Tannengrün with white text (12.7:1). secondary: white with a fine border, on white and
 * grey surfaces. text: a plain green link with an arrow, next to a large button.
 */
type Variant = "primary" | "secondary" | "text";
type Size = "lg" | "md" | "sm";

const base =
  "group inline-flex items-center justify-center gap-2 rounded-full border border-transparent text-center font-semibold leading-tight max-w-full whitespace-normal sm:whitespace-nowrap transition-[color,background-color,border-color,opacity] duration-150 active:opacity-85 disabled:pointer-events-none disabled:opacity-55";

const variants: Record<Variant, string> = {
  primary: "bg-forest text-white hover:bg-forest-deep",
  secondary: "border-line-strong bg-white text-ink hover:bg-mist",
  text: "px-1 font-medium text-accent hover:text-accent-hover",
};

const sizes: Record<Size, string> = {
  // Minimum heights: a long label may wrap below 640 px instead of overflowing the screen.
  lg: "min-h-[3.125rem] px-[1.625rem] py-2.5 text-[1.0625rem]",
  md: "min-h-11 px-5 py-2 text-[0.9375rem]",
  sm: "min-h-9 px-3.5 py-1.5 text-[0.8125rem]",
};

const textSizes: Record<Size, string> = {
  lg: "min-h-[3.125rem] text-[1.0625rem]",
  md: "min-h-11 text-[0.9375rem]",
  sm: "min-h-9 text-[0.8125rem]",
};

export function buttonClasses({
  variant = "primary",
  size = "md",
  className,
}: { variant?: Variant; size?: Size; className?: string } = {}) {
  return cn(base, variants[variant], variant === "text" ? textSizes[size] : sizes[size], className);
}

interface ButtonLinkProps {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  arrow?: boolean;
  className?: string;
  prefetch?: boolean;
}

export function ButtonLink({ href, children, variant, size, arrow, className, prefetch }: ButtonLinkProps) {
  const external = /^(https?:|mailto:|tel:)/.test(href);
  const content = (
    <>
      {children}
      {arrow ? <ChevronRight aria-hidden className="-mr-1 size-4 shrink-0 transition-transform duration-150 group-hover:translate-x-0.5" strokeWidth={2} /> : null}
    </>
  );
  if (external) {
    return (
      <a href={href} className={buttonClasses({ variant, size, className })}>
        {content}
      </a>
    );
  }
  return (
    <Link href={href} prefetch={prefetch} className={buttonClasses({ variant, size, className })}>
      {content}
    </Link>
  );
}
