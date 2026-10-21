import Image from "next/image";

/**
 * The ANB Treuhand logo from the official files of the corporate design package (public/logo,
 * from 01_Logo/…/Digital_RGB). The logo is never rebuilt from type and always one colour: green on
 * white, white on Tannengrün.
 *
 * - `horizontal` (Querformat): header, footer. CI sizes 234 × 44 or 351 × 66 px; always a whole
 *   pixel pair, otherwise Chromium blurs the hairlines.
 * - `stacked` (Hauptlogo): large spots, at least 160 px wide.
 * - `signet` (Signet klein): ANB alone where space is short, 27 to 160 px wide.
 */

type Tone = "dark" | "light";

const files = {
  horizontal: { dark: "/logo/ANB_Treuhand_Logo_Quer_Gruen.svg", light: "/logo/ANB_Treuhand_Logo_Quer_Weiss.svg" },
  stacked: { dark: "/logo/ANB_Treuhand_Logo_Gruen.svg", light: "/logo/ANB_Treuhand_Logo_Weiss.svg" },
  signet: { dark: "/logo/ANB_Treuhand_Signet_Klein_Gruen.svg", light: "/logo/ANB_Treuhand_Signet_Klein_Weiss.svg" },
} as const;

/** Whole-pixel sizes that keep the edges sharp (see the CI manual, chapter Logo). */
const sizes = {
  horizontal: { md: [234, 44], lg: [351, 66] },
  stacked: { md: [176, 100], lg: [257, 146] },
  signet: { md: [69, 28], lg: [138, 56] },
} as const;

export function Logo({
  variant = "horizontal",
  tone = "dark",
  size = "md",
  className,
  title = "ANB Treuhand",
  decorative = false,
  priority = false,
}: {
  variant?: "horizontal" | "stacked" | "signet";
  tone?: Tone;
  size?: "md" | "lg";
  className?: string;
  title?: string;
  /** Hide from assistive technology when a visible or aria label already names the brand. */
  decorative?: boolean;
  priority?: boolean;
}) {
  const [width, height] = sizes[variant][size];
  return (
    <Image
      src={files[variant][tone]}
      width={width}
      height={height}
      alt={decorative ? "" : title}
      priority={priority}
      unoptimized
      className={className}
      style={{ width, height, maxWidth: "none" }}
    />
  );
}
