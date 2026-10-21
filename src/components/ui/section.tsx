import { cn } from "@/lib/utils";
import { Container } from "./container";
import { hyphenate } from "@/lib/hyphenate";

/**
 * Section backgrounds of the public site: white and cream for content, forest (Tannengrün) for
 * dark bands. Forest sets `.on-dark` (copper focus rings and kickers) and cream text.
 */
export type SectionTone = "white" | "cream" | "forest";
export type SectionSpace = "tight" | "default" | "loose";

const tones: Record<SectionTone, string> = {
  white: "bg-white",
  cream: "bg-cream",
  forest: "on-dark grain relative overflow-hidden bg-forest text-cream",
};

const spaces: Record<SectionSpace, string> = {
  tight: "py-16 md:py-20",
  default: "py-20 md:py-28",
  loose: "py-24 md:py-36",
};

export function Section({
  id,
  tone = "white",
  space = "default",
  className,
  containerClassName,
  labelledBy,
  children,
}: {
  id?: string;
  tone?: SectionTone;
  space?: SectionSpace;
  className?: string;
  containerClassName?: string;
  labelledBy?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={cn(spaces[space], tones[tone], className)}>
      <Container className={cn(tone === "forest" && "relative", containerClassName)}>{children}</Container>
    </section>
  );
}

/**
 * Heading block of a section. `layout="split"` puts the text beside the heading on large screens;
 * `align="center"` centres a short heading with the double-rule kicker.
 */
export function SectionHeader({
  id,
  eyebrow,
  title,
  text,
  layout = "stack",
  align = "left",
  className,
  titleClassName,
  as: Heading = "h2",
}: {
  id?: string;
  eyebrow?: string;
  title: React.ReactNode;
  text?: React.ReactNode;
  layout?: "stack" | "split";
  align?: "left" | "center";
  className?: string;
  titleClassName?: string;
  as?: "h1" | "h2";
}) {
  const centered = align === "center";
  const heading = (
    <>
      {eyebrow ? <p className={cn("eyebrow", centered && "eyebrow-center")}>{eyebrow}</p> : null}
      <Heading id={id} className={cn(Heading === "h1" ? "text-h1" : "text-h2", eyebrow ? "mt-6" : null, titleClassName)}>
        {typeof title === "string" ? hyphenate(title) : title}
      </Heading>
    </>
  );
  const body = text ? <div className="text-lead text-body in-[.on-dark]:text-cream/75">{text}</div> : null;

  if (layout === "split") {
    return (
      <div className={cn("grid gap-6 lg:grid-cols-12 lg:gap-10", className)}>
        <div className="lg:col-span-6">{heading}</div>
        {body ? <div className="max-w-xl lg:col-span-5 lg:col-start-8 lg:self-end">{body}</div> : null}
      </div>
    );
  }

  return (
    <div className={cn("max-w-3xl", centered && "mx-auto text-center", className)}>
      {heading}
      {body ? <div className={cn("mt-6", centered && "mx-auto max-w-2xl")}>{body}</div> : null}
    </div>
  );
}
