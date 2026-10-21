"use server";

import { headers } from "next/headers";
import { absoluteUrl, site } from "@/config/site";
import { formsAvailable, serverEnv } from "@/lib/env";
import { sendContactEmails } from "@/lib/requests/email";
import { clientIp, hashIp, takeToken } from "@/lib/requests/rate-limit";
import { createReference } from "@/lib/requests/reference";
import { contactSchema, fieldErrors } from "@/lib/requests/schema";
import { REQUEST_TEXT_FIELDS, type RequestState, type RequestValues } from "@/lib/requests/state";
import { isStorageConfigured, recentRequestCount, storeRequest } from "@/lib/requests/store";

/** Minimum time between page load and submit. Faster submissions are almost always bots. */
const MIN_FILL_MS = 3000;
const DB_HOURLY_LIMIT = 5;

function readValues(formData: FormData): RequestValues {
  const values: RequestValues = {};
  for (const key of REQUEST_TEXT_FIELDS) {
    const v = formData.get(key);
    if (typeof v === "string") values[key] = v.slice(0, 6000);
  }
  return values;
}

function log(event: string, data: Record<string, unknown>) {
  // No personal data in logs: only the reference and technical status.
  console.info(JSON.stringify({ event, ...data }));
}

export async function submitContact(_prev: RequestState, formData: FormData): Promise<RequestState> {
  const values = readValues(formData);
  const fallback = site.contact.email.value;

  if (!formsAvailable()) {
    return { status: "error", message: `Das Formular ist zurzeit nicht verfügbar. Bitte schreiben Sie uns an ${fallback}.`, values };
  }

  // 1. Spam protection: honeypot field must stay empty.
  const honeypot = formData.get("website");
  if (typeof honeypot === "string" && honeypot.trim() !== "") {
    log("contact.spam", { reason: "honeypot" });
    return { status: "success", reference: createReference(), email: "", confirmation: false };
  }

  // 2. Spam protection: minimum fill time, measured in the browser (only sent with JavaScript).
  const elapsedRaw = formData.get("elapsedMs");
  const elapsed = typeof elapsedRaw === "string" && elapsedRaw !== "" ? Number(elapsedRaw) : Number.NaN;
  if (Number.isFinite(elapsed) && elapsed >= 0 && elapsed < MIN_FILL_MS) {
    log("contact.spam", { reason: "too_fast" });
    return { status: "error", message: "Die Nachricht wurde sehr schnell gesendet. Bitte prüfen Sie Ihre Angaben und senden Sie sie erneut.", values };
  }

  // 3. Validation.
  const parsed = contactSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { status: "invalid", errors: fieldErrors(parsed.error), values };
  const input = parsed.data;

  // 4. Rate limiting per IP (hashed, never stored in plain text).
  const ipHash = hashIp(clientIp(await headers()));
  let limited = !takeToken(ipHash);
  if (!limited && isStorageConfigured()) {
    try {
      limited = (await recentRequestCount(ipHash)) >= DB_HOURLY_LIMIT;
    } catch (err) {
      log("contact.ratelimit_db_error", { error: err instanceof Error ? err.message : "unknown" });
    }
  }
  if (limited) {
    log("contact.rate_limited", {});
    return {
      status: "error",
      message: `Es wurden in kurzer Zeit zu viele Nachrichten gesendet. Bitte versuchen Sie es später erneut oder schreiben Sie direkt an ${fallback}.`,
      values,
    };
  }

  // 5. Deliver by e-mail first, then store (optional).
  const reference = createReference();
  const stored = isStorageConfigured();
  const delivery = await sendContactEmails({ reference, input, adminLink: stored ? absoluteUrl(`/admin/anfragen?ref=${reference}`) : undefined });

  let storage: "disabled" | "stored" | "failed" = "disabled";
  if (stored) {
    try {
      await storeRequest({
        reference,
        kind: "kontakt",
        topic: input.topic,
        name: input.name,
        company: input.company,
        email: input.email,
        phone: input.phone,
        message: input.message,
        ipHash,
        delivery: delivery.internal,
        confirmation: delivery.confirmation,
      });
      storage = "stored";
    } catch (err) {
      storage = "failed";
      log("contact.store_error", { reference, error: err instanceof Error ? err.message : "unknown" });
    }
  }

  log("contact.received", {
    reference,
    topic: input.topic,
    email: delivery.internal.ok ? (serverEnv.dryRun ? "dry_run" : "sent") : "failed",
    emailError: delivery.internal.ok ? undefined : delivery.internal.error,
    confirmation: delivery.confirmation,
    storage,
  });

  if (!delivery.internal.ok) {
    return {
      status: "error",
      message: `Ihre Nachricht konnte leider nicht zugestellt werden. Bitte senden Sie sie direkt an ${fallback} und geben Sie die Referenz an.`,
      reference,
      values,
    };
  }
  return { status: "success", reference, email: input.email, confirmation: delivery.confirmation === "sent" };
}
