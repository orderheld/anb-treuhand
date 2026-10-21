"use server";

import { headers } from "next/headers";
import { absoluteUrl, site } from "@/config/site";
import { estimateOf, parseCalculatorInput } from "@/lib/calculators/index";
import { formsAvailable, serverEnv } from "@/lib/env";
import { sendOfferEmails } from "@/lib/requests/email";
import { clientIp, hashIp, takeToken } from "@/lib/requests/rate-limit";
import { createReference } from "@/lib/requests/reference";
import { fieldErrors, offerContactSchema } from "@/lib/requests/schema";
import { REQUEST_TEXT_FIELDS, type RequestField, type RequestState, type RequestValues } from "@/lib/requests/state";
import { isStorageConfigured, recentRequestCount, storeRequest } from "@/lib/requests/store";
import { isCalculatorSlug } from "@/lib/tariffs/registry";
import { getTariffs } from "@/lib/tariffs/store";

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

/**
 * Offer request from one of the three calculators. The price is always recomputed here with the
 * current tariffs; the browser only sends the chosen values.
 */
export async function requestOffer(_prev: RequestState, formData: FormData): Promise<RequestState> {
  const values = readValues(formData);
  const fallback = site.contact.email.value;

  if (!formsAvailable()) {
    return { status: "error", message: `Das Formular ist zurzeit nicht verfügbar. Bitte schreiben Sie uns an ${fallback}.`, values };
  }

  // 1. Spam protection: honeypot field must stay empty. Bots get a success without anything sent.
  const honeypot = formData.get("website");
  if (typeof honeypot === "string" && honeypot.trim() !== "") {
    log("offer.spam", { reason: "honeypot" });
    return { status: "success", reference: createReference(), email: "", confirmation: false };
  }

  // 2. Spam protection: minimum fill time, measured in the browser (only sent with JavaScript).
  const elapsedRaw = formData.get("elapsedMs");
  const elapsed = typeof elapsedRaw === "string" && elapsedRaw !== "" ? Number(elapsedRaw) : Number.NaN;
  if (Number.isFinite(elapsed) && elapsed >= 0 && elapsed < MIN_FILL_MS) {
    log("offer.spam", { reason: "too_fast" });
    return { status: "error", message: "Die Anfrage wurde sehr schnell gesendet. Bitte prüfen Sie Ihre Angaben und senden Sie sie erneut.", values };
  }

  // 3. Validation of the contact details and of the calculator values, reported together.
  const slug = formData.get("calculator");
  if (typeof slug !== "string" || !isCalculatorSlug(slug)) {
    return { status: "error", message: "Der Rechner wurde nicht erkannt. Bitte laden Sie die Seite neu.", values };
  }
  const contact = offerContactSchema.safeParse(Object.fromEntries(formData));
  const calculator = parseCalculatorInput(slug, formData.get("input"));
  if (!contact.success || !calculator.ok) {
    const errors: Partial<Record<RequestField, string>> = contact.success ? {} : fieldErrors(contact.error);
    if (!calculator.ok) errors.input = calculator.error;
    return { status: "invalid", errors, values };
  }

  // 4. Rate limiting per IP (hashed, never stored in plain text).
  const ipHash = hashIp(clientIp(await headers()));
  let limited = !takeToken(ipHash);
  if (!limited && isStorageConfigured()) {
    try {
      limited = (await recentRequestCount(ipHash)) >= DB_HOURLY_LIMIT;
    } catch (err) {
      log("offer.ratelimit_db_error", { error: err instanceof Error ? err.message : "unknown" });
    }
  }
  if (limited) {
    log("offer.rate_limited", {});
    return {
      status: "error",
      message: `Es wurden in kurzer Zeit zu viele Anfragen gesendet. Bitte versuchen Sie es später erneut oder schreiben Sie direkt an ${fallback}.`,
      values,
    };
  }

  // 5. Recompute with the current tariffs, deliver by e-mail first, then store (optional).
  const tariffs = await getTariffs(slug);
  const estimate = estimateOf(calculator.value, tariffs);
  const reference = createReference();
  const stored = isStorageConfigured();
  const delivery = await sendOfferEmails({
    reference,
    contact: contact.data,
    request: calculator.value,
    estimate,
    hint: tariffs["allgemein.hinweis"],
    adminLink: stored ? absoluteUrl(`/admin/anfragen?ref=${reference}`) : undefined,
  });

  let storage: "disabled" | "stored" | "failed" = "disabled";
  if (stored) {
    try {
      await storeRequest({
        reference,
        kind: "offerte",
        calculator: calculator.value,
        estimate,
        name: contact.data.name,
        company: contact.data.company,
        email: contact.data.email,
        phone: contact.data.phone,
        timing: contact.data.timing,
        message: contact.data.message,
        ipHash,
        delivery: delivery.internal,
        confirmation: delivery.confirmation,
      });
      storage = "stored";
    } catch (err) {
      storage = "failed";
      log("offer.store_error", { reference, error: err instanceof Error ? err.message : "unknown" });
    }
  }

  log("offer.received", {
    reference,
    calculator: slug,
    email: delivery.internal.ok ? (serverEnv.dryRun ? "dry_run" : "sent") : "failed",
    emailError: delivery.internal.ok ? undefined : delivery.internal.error,
    confirmation: delivery.confirmation,
    storage,
  });

  if (!delivery.internal.ok) {
    return {
      status: "error",
      message: `Ihre Anfrage konnte leider nicht zugestellt werden. Bitte senden Sie sie direkt an ${fallback} und geben Sie die Referenz an.`,
      reference,
      values,
    };
  }
  return { status: "success", reference, email: contact.data.email, confirmation: delivery.confirmation === "sent" };
}
