import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * primary: Tannengrün with cream text on light surfaces (11:1). copper: Kupfer with deep green
 * text on green surfaces (6.6:1). outline: hairline button on light surfaces. outline-light:
 * hairline button on green surfaces. text: a plain link with arrow.
 */
type Variant = "primary" | "copper" | "outline" | "outline-light" | "text" | "text-light";
type Size = "lg" | "md" | "sm";

const base =
  "group inline-flex items-center justify-center gap-2.5 rounded-full text-center font-medium tracking-[0.01em] max-w-full whitespace-normal sm:whitespace-nowrap transition-[color,background-color,border-color,box-shadow,transform] duration-300 ease-out-soft disabled:pointer-events-none disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary:
    "bg-forest text-cream shadow-[inset_0_1px_0_rgb(255_255_255/0.08),0_10px_24px_-14px_rgb(20_42_31/0.8)] hover:bg-forest-deep hover:shadow-[inset_0_1px_0_rgb(255_255_255/0.08),0_14px_30px_-14px_rgb(20_42_31/0.9)]",
  copper:
    "bg-copper text-forest-deep shadow-[inset_0_1px_0_rgb(255_255_255/0.35),0_12px_30px_-14px_rgb(211_161_124/0.75)] hover:bg-copper-light",
  outline: "border border-forest/25 bg-transparent text-forest hover:border-forest hover:bg-forest hover:text-cream",
  "outline-light": "border border-cream/30 bg-white/[0.03] text-cream hover:border-copper hover:text-copper",
  text: "px-0 text-forest underline decoration-copper decoration-1 underline-offset-[6px] hover:decoration-2",
  "text-light": "px-0 text-cream underline decoration-copper decoration-1 underline-offset-[6px] hover:text-copper",
};

const sizes: Record<Size, string> = {
  // Minimum heights: a long label may wrap below 640 px instead of overflowing the screen.
  lg: "min-h-14 px-8 py-3 text-base",
  md: "min-h-12 px-6 py-2.5 text-[0.9375rem]",
  sm: "min-h-10 px-5 py-2 text-sm",
};

export function buttonClasses({
  variant = "primary",
  size = "md",
  className,
}: { variant?: Variant; size?: Size; className?: string } = {}) {
  const textLike = variant === "text" || variant === "text-light";
  return cn(base, variants[variant], textLike ? "h-auto rounded-none" : sizes[size], className);
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
      {arrow ? (
        <ArrowRight aria-hidden className="size-4 shrink-0 transition-transform duration-300 ease-out-soft group-hover:translate-x-1" strokeWidth={1.75} />
      ) : null}
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
