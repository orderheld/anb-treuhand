import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * tailwind-merge has to know the custom font sizes from globals.css; otherwise it reads
 * `text-h1` as a colour and drops it next to `text-forest`.
 */
const twMerge = extendTailwindMerge({
  extend: {
    theme: { text: ["display", "h1", "h2", "h3", "lead", "statement", "numeral"] },
  },
});

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

const chfNumber = new Intl.NumberFormat("de-CH", { maximumFractionDigits: 0 });
const chfNumber2 = new Intl.NumberFormat("de-CH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** Swiss number format with the apostrophe as thousands separator, e.g. 112’000. */
export function formatNumber(n: number): string {
  return chfNumber.format(n);
}

/** Swiss franc amount without decimals, e.g. formatChf(112000) → "CHF 112’000". */
export function formatChf(n: number): string {
  return `CHF ${formatNumber(n)}`;
}

/** Swiss franc amount with rappen, e.g. formatChf2(2.2) → "CHF 2.20". */
export function formatChf2(n: number): string {
  return `CHF ${chfNumber2.format(n)}`;
}

/** Formats an ISO date (YYYY-MM-DD) as Swiss German date, e.g. 13. Oktober 2026. */
export function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const months = [
    "Januar", "Februar", "März", "April", "Mai", "Juni",
    "Juli", "August", "September", "Oktober", "November", "Dezember",
  ];
  return `${d}. ${months[m - 1]} ${y}`;
}
