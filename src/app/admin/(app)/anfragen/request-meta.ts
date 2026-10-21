import { calculators } from "@/content/calculators";
import { requestStatuses, type RequestListItem, type RequestStatus } from "@/lib/admin/requests";
import { labelOf, topics } from "@/lib/requests/options";

/** "Offerte Treuhand", "Kontakt: Steuern". */
export function requestTitle(r: Pick<RequestListItem, "kind" | "calculator" | "topic">): string {
  if (r.kind === "offerte") {
    const calc = calculators.find((c) => c.slug === r.calculator);
    return `Offerte ${calc?.short ?? ""}`.trim();
  }
  return r.topic ? `Kontakt: ${labelOf(topics, r.topic)}` : "Kontakt";
}

export function statusLabel(status: RequestStatus): string {
  return requestStatuses.find((s) => s.value === status)?.label ?? status;
}
