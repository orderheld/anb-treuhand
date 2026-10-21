import type { AuditEntry } from "@/lib/admin/audit";
import { isRequestStatus } from "@/lib/admin/requests";
import { isCalculatorSlug, tariffRegistry } from "@/lib/tariffs/registry";
import { statusLabel } from "../anfragen/request-meta";

export interface AuditLine {
  title: string;
  detail?: string;
  warning?: boolean;
}

function calculatorTitle(value: unknown): string {
  return typeof value === "string" && isCalculatorSlug(value) ? tariffRegistry[value].title : "Rechner";
}

/** "Grundpauschale, Stundensatz und 2 weitere" */
function fieldLabels(calculator: unknown, keys: unknown): string | undefined {
  if (typeof calculator !== "string" || !isCalculatorSlug(calculator) || !Array.isArray(keys)) return undefined;
  const fields = tariffRegistry[calculator].fields;
  const labels = keys.map((key) => fields.find((f) => f.key === key)?.label).filter((label): label is string => Boolean(label));
  if (labels.length === 0) return undefined;
  if (labels.length <= 3) return labels.join(", ");
  return `${labels.slice(0, 2).join(", ")} und ${labels.length - 2} weitere`;
}

const loginFailures: Record<string, string> = {
  password: "Falsches Passwort",
  code: "Richtiges Passwort, falscher Code",
  locked: "Gesperrt nach zu vielen falschen Codes",
};

/** A readable line for an entry of the audit log. */
export function describeAudit(entry: AuditEntry): AuditLine {
  const d = entry.detail;
  const reference = typeof d.reference === "string" ? d.reference : "";
  switch (entry.action) {
    case "login":
      return { title: "Angemeldet" };
    case "login_failed":
      return { title: "Anmeldung fehlgeschlagen", detail: loginFailures[String(d.reason)], warning: true };
    case "logout":
      return { title: "Abgemeldet" };
    case "logout_all":
      return { title: "Alle Geräte abgemeldet", detail: typeof d.sessions === "number" ? `${d.sessions} ${d.sessions === 1 ? "Sitzung" : "Sitzungen"} beendet` : undefined };
    case "tariffs_saved":
      return { title: `Tarife gespeichert: ${calculatorTitle(d.calculator)}`, detail: fieldLabels(d.calculator, d.changed) };
    case "tariffs_reset":
      return { title: `Standardwerte wiederhergestellt: ${calculatorTitle(d.calculator)}` };
    case "request_status":
      return { title: `Anfrage ${reference}`, detail: isRequestStatus(d.status) ? `Status «${statusLabel(d.status)}»` : undefined };
    case "request_deleted":
      return { title: `Anfrage ${reference} gelöscht` };
    default:
      return { title: String(entry.action) };
  }
}
