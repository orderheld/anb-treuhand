import { cn } from "@/lib/utils";
import { ANB_PATH, RULES_PATH, SIGNET_PATH, TREUHAND_PATH } from "./logo-paths";

/**
 * The ANB Treuhand logo as inline SVG, built from the original outlines (logo-paths.ts).
 *
 * - `stacked`: the official lockup, ANB above TREUHAND between two rules (hero, footer, print).
 * - `horizontal`: the same outlines side by side, ANB | TREUHAND, for the slim header. TREUHAND is
 *   scaled to the width of ANB, so both halves balance.
 * - `signet`: ANB alone in its small-size drawing (favicon, tight spots).
 *
 * `tone="light"` is for green surfaces (letters in cream, as decided by the client for the card
 * front on 20.10.2026), `tone="dark"` for light surfaces (letters in Tannengrün). The rules stay
 * copper in both tones.
 */

type Tone = "light" | "dark";

const letterFill: Record<Tone, string> = { light: "#FFFFFF", dark: "#1C382A" };
const RULE_FILL = "#D3A17C";

/** Horizontal lockup: TREUHAND scale and position (see the component description). */
const H = {
  scale: 1.6,
  /** Vertical centre of ANB (63–213) and of the TREUHAND caps (250.5–273.75). */
  anbCenter: 138,
  treuCenter: 262.125,
  gap: 34,
  ruleWidth: 2.4,
  ruleHeight: 92,
};
const H_RULE_X = 447.5 + H.gap;
const H_TREU_X = H_RULE_X + H.ruleWidth + H.gap;
const H_TREU_WIDTH = (373.95 - 135.56) * H.scale;
const H_WIDTH = H_TREU_X + H_TREU_WIDTH - 63;

export function Logo({
  variant = "stacked",
  tone = "dark",
  className,
  title = "ANB Treuhand",
  decorative = false,
}: {
  variant?: "stacked" | "horizontal" | "signet";
  tone?: Tone;
  className?: string;
  title?: string;
  /** Hide from assistive technology when a visible or aria label already names the brand. */
  decorative?: boolean;
}) {
  const fill = letterFill[tone];
  const a11y = decorative ? { "aria-hidden": true as const } : { role: "img" as const, "aria-label": title };

  if (variant === "signet") {
    return (
      <svg viewBox="45 45 406.2 150" className={cn("block", className)} {...a11y}>
        <path fill={fill} d={SIGNET_PATH} />
      </svg>
    );
  }

  if (variant === "horizontal") {
    const ty = H.anbCenter - H.treuCenter * H.scale;
    const tx = H_TREU_X - 135.56 * H.scale;
    return (
      <svg viewBox={`63 63 ${H_WIDTH.toFixed(1)} 150`} className={cn("block", className)} {...a11y}>
        <path fill={fill} d={ANB_PATH} />
        <rect x={H_RULE_X} y={H.anbCenter - H.ruleHeight / 2} width={H.ruleWidth} height={H.ruleHeight} fill={RULE_FILL} />
        <path fill={fill} d={TREUHAND_PATH} transform={`translate(${tx.toFixed(2)} ${ty.toFixed(2)}) scale(${H.scale})`} />
      </svg>
    );
  }

  return (
    <svg viewBox="63 63 384.5 212" className={cn("block", className)} {...a11y}>
      <path fill={fill} d={ANB_PATH} />
      <path fill={fill} d={TREUHAND_PATH} />
      <path fill={RULE_FILL} d={RULES_PATH} />
    </svg>
  );
}

/** Aspect ratios (width / height) for layout without measuring. */
export const logoRatio = {
  stacked: 384.5 / 212,
  horizontal: H_WIDTH / 150,
  signet: 406.2 / 150,
};
