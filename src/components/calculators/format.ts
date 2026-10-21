import type { EstimateLine } from "@/lib/calculators/shared";
import { formatChf } from "@/lib/utils";
import type { ResultLine } from "./result-panel";

const periodShort: Record<EstimateLine["period"], string> = { monat: "/ Mt.", jahr: "/ Jahr", einmalig: "einmalig" };

/** "CHF 235 / Mt.", "CHF 450 / Jahr", "CHF 890 einmalig" */
export function linePrice(line: EstimateLine): string {
  return `${formatChf(line.amount)} ${periodShort[line.period]}`;
}

/** Positions for the result panel. `withPeriod` adds "/ Mt." or "/ Jahr" where periods are mixed. */
export function toResultLines(lines: EstimateLine[], withPeriod = false): ResultLine[] {
  return lines.map((l) => ({
    key: l.key,
    label: l.label,
    detail: l.detail,
    amount: l.included ? "inklusive" : withPeriod ? linePrice(l) : formatChf(l.amount),
    muted: l.included || l.key === "mindest",
  }));
}
