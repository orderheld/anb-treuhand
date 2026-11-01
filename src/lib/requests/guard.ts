import "server-only";
import { createReference } from "./reference";
import { checkContent, checkFormToken, contentMessage, type ContentFields } from "./spam";
import type { RequestState, RequestValues } from "./state";

function log(event: string, data: Record<string, unknown>) {
  console.info(JSON.stringify({ event, ...data }));
}

/** Bots get a success without anything being sent, so they learn nothing. */
function silentSuccess(): RequestState {
  return { status: "success", reference: createReference(), email: "", confirmation: false };
}

/**
 * Checks that need no validation: honeypot and form token. Returns the answer for the visitor if
 * the request stops here, otherwise null.
 */
export function screenSubmission(
  formData: FormData,
  { kind, fallback, values }: { kind: "contact" | "offer"; fallback: string; values: RequestValues },
): RequestState | null {
  const honeypot = formData.get("website");
  if (typeof honeypot === "string" && honeypot.trim() !== "") {
    log(`${kind}.spam`, { reason: "honeypot" });
    return silentSuccess();
  }

  const token = checkFormToken(formData.get("formToken"));
  switch (token) {
    case "ok":
      return null;
    case "invalid":
      log(`${kind}.spam`, { reason: "token_invalid" });
      return silentSuccess();
    case "too_fast":
      log(`${kind}.spam`, { reason: "too_fast" });
      return { status: "error", message: "Das Formular wurde sehr schnell gesendet. Bitte prüfen Sie Ihre Angaben und senden Sie es erneut.", values };
    case "expired":
      log(`${kind}.spam`, { reason: "token_expired" });
      return { status: "error", message: "Die Seite war sehr lange geöffnet. Bitte senden Sie das Formular noch einmal ab.", values };
    case "missing":
      log(`${kind}.spam`, { reason: "token_missing" });
      return {
        status: "error",
        message: `Das Formular konnte nicht geprüft werden. Bitte laden Sie die Seite neu (JavaScript muss aktiviert sein) oder schreiben Sie uns direkt an ${fallback}.`,
        values,
      };
  }
}

/** Content check after validation. Returns the answer for the visitor, or null if the content is fine. */
export function screenContent(fields: ContentFields, { kind, fallback, values }: { kind: "contact" | "offer"; fallback: string; values: RequestValues }): RequestState | null {
  const result = checkContent(fields);
  if (result.ok) return null;
  log(`${kind}.spam`, { reason: `content_${result.reason}` });
  return { status: "error", message: contentMessage(fallback), values };
}
