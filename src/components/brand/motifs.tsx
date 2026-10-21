import { cn } from "@/lib/utils";
import { ANB_PATH } from "./logo-paths";

/**
 * Graphic motifs from the business card.
 *
 * The facet: a tonal panel on the right whose edge is a fine copper line, parallel to the thick
 * stroke of the logo's A (about 19° from vertical). It is drawn in an SVG with a fixed aspect
 * ratio and `slice`, so the angle never distorts and the facet stays anchored to the right edge.
 */

/** Slope of the A's thick stroke: (194.8 − 143.71) / (210.4 − 63) ≈ tan 19.1°. */
export const A_SLOPE = (194.8 - 143.71) / (210.4 - 63);

export function Facet({
  className,
  /** Where the copper line meets the top edge, in viewBox units (0–1600). */
  start = 1040,
  tone = "forest",
  animate = true,
  id = "facet",
}: {
  className?: string;
  start?: number;
  tone?: "forest" | "cream";
  animate?: boolean;
  /** Prefix of the gradient ids; give each facet on a page its own. */
  id?: string;
}) {
  const end = start + A_SLOPE * 900;
  const panel = `url(#${id}-${tone})`;
  return (
    <svg
      aria-hidden
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMaxYMid slice"
      className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
    >
      <defs>
        <linearGradient id={`${id}-forest`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2a4d3c" stopOpacity="0.55" />
          <stop offset="1" stopColor="#1c382a" stopOpacity="0.05" />
        </linearGradient>
        <linearGradient id={`${id}-cream`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#efe4d3" stopOpacity="1" />
          <stop offset="1" stopColor="#f7efe3" stopOpacity="0.4" />
        </linearGradient>
        <linearGradient id={`${id}-line`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d3a17c" stopOpacity="0" />
          <stop offset="0.18" stopColor="#d3a17c" stopOpacity="0.9" />
          <stop offset="0.85" stopColor="#d3a17c" stopOpacity="0.9" />
          <stop offset="1" stopColor="#d3a17c" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      <polygon points={`${start},0 1600,0 1600,900 ${end},900`} fill={panel} className={animate ? "anb-fade" : undefined} />
      <line
        x1={start}
        y1={0}
        x2={end}
        y2={900}
        stroke={`url(#${id}-line)`}
        strokeWidth={1.25}
        vectorEffect="non-scaling-stroke"
        pathLength={1}
        className={animate ? "anb-draw" : undefined}
      />
    </svg>
  );
}

/**
 * The facet for phones and tablets. It lives in a band of fixed height at the top, so the copper
 * line stays in the top right corner however tall the section grows and never crosses the text.
 */
export function CornerFacet({ id, className }: { id: string; className?: string }) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-x-0 top-0 h-[38rem]", className)}>
      <Facet start={1470} id={id} />
    </div>
  );
}

/**
 * The ANB letters as a large copper outline, like a blind embossing on the card stock. Purely
 * decorative; the stroke draws itself once on load.
 */
export function MonogramOutline({ className, opacity = 0.22, animate = true }: { className?: string; opacity?: number; animate?: boolean }) {
  return (
    <svg aria-hidden viewBox="60 60 390.5 156" className={cn("pointer-events-none block", className)}>
      <path
        d={ANB_PATH}
        fill="none"
        stroke="#d3a17c"
        strokeOpacity={opacity}
        strokeWidth={0.6}
        vectorEffect="non-scaling-stroke"
        pathLength={1}
        className={animate ? "anb-draw" : undefined}
        style={animate ? ({ "--anb-delay": "0.5s", animationDuration: "3.2s" } as React.CSSProperties) : undefined}
      />
    </svg>
  );
}

/** Short copper rule, as left and right of TREUHAND in the logo. */
export function CopperRule({ className }: { className?: string }) {
  return <span aria-hidden className={cn("block h-px w-12 bg-copper", className)} />;
}
