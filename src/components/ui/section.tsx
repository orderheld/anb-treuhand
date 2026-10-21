import { cn } from "@/lib/utils";
import { Container } from "./container";
import { hyphenate } from "@/lib/hyphenate";

/** Section backgrounds of the public site: white, and light grey (mist) to set sections apart. */
export type SectionTone = "white" | "mist";
export type SectionSpace = "tight" | "default";

const tones: Record<SectionTone, string> = {
  white: "bg-white",
  mist: "bg-mist",
};

const spaces: Record<SectionSpace, string> = {
  tight: "py-14 md:py-16",
  default: "py-[clamp(4.5rem,8vw,7rem)]",
};

/** Bottom padding only, for a section that continues the page hero above it. */
const bottomSpaces: Record<SectionSpace, string> = {
  tight: "pb-14 md:pb-16",
  default: "pb-[clamp(4.5rem,8vw,7rem)]",
};

export function Section({
  id,
  tone = "white",
  space = "default",
  className,
  containerClassName,
  labelledBy,
  flushTop = false,
  children,
}: {
  id?: string;
  tone?: SectionTone;
  space?: SectionSpace;
  className?: string;
  containerClassName?: string;
  labelledBy?: string;
  /** No top padding: the section continues the white page hero. */
  flushTop?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={cn(flushTop ? bottomSpaces[space] : spaces[space], tones[tone], className)}>
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}

/**
 * Heading block of a section: kicker in green, title, optional lead. `align="center"` centres a
 * short heading above a grid; `layout="split"` puts the lead beside the title on large screens.
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
      {eyebrow ? <p className="kicker mb-2.5">{eyebrow}</p> : null}
      <Heading id={id} className={cn(Heading === "h1" ? "text-h1" : "text-h2", titleClassName)}>
        {typeof title === "string" ? hyphenate(title) : title}
      </Heading>
    </>
  );
  const body = text ? <div className="text-lead text-body">{text}</div> : null;

  if (layout === "split") {
    return (
      <div className={cn("grid gap-5 lg:grid-cols-12 lg:gap-10", className)}>
        <div className="min-w-0 lg:col-span-6">{heading}</div>
        {body ? <div className="max-w-xl lg:col-span-5 lg:col-start-8 lg:self-end">{body}</div> : null}
      </div>
    );
  }

  return (
    <div className={cn("max-w-3xl", centered && "mx-auto max-w-[45rem] text-center", className)}>
      {heading}
      {body ? <div className={cn("mt-4", centered && "mx-auto max-w-2xl")}>{body}</div> : null}
    </div>
  );
}
