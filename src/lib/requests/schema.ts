import * as z from "zod";
import { timings, topics, values } from "./options";
import type { RequestField } from "./state";

/** Empty form fields arrive as "", treat them as missing. */
const blankToUndefined = (v: unknown) => (typeof v === "string" && v.trim() === "" ? undefined : v);

const name = z
  .string({ error: "Bitte geben Sie Ihren Namen an." })
  .trim()
  .min(2, "Bitte geben Sie Ihren Namen an.")
  .max(120, "Der Name ist zu lang.");

const email = z
  .string({ error: "Bitte geben Sie Ihre E-Mail-Adresse an." })
  .trim()
  .min(1, "Bitte geben Sie Ihre E-Mail-Adresse an.")
  .max(200, "Die E-Mail-Adresse ist zu lang.")
  .pipe(z.email("Bitte geben Sie eine gültige E-Mail-Adresse an."));

const phone = z.preprocess(
  blankToUndefined,
  z
    .string()
    .trim()
    .max(40, "Die Telefonnummer ist zu lang.")
    .regex(/^\+?[0-9\s()./-]{6,}$/, "Bitte geben Sie eine gültige Telefonnummer an.")
    .optional(),
);

const company = z.preprocess(blankToUndefined, z.string().trim().max(160, "Der Firmenname ist zu lang.").optional());

const consent = z.literal("on", { error: "Bitte bestätigen Sie, dass Sie die Datenschutzerklärung gelesen haben." });

/** Contact details of an offer request; the calculator values are checked separately. */
export const offerContactSchema = z.object({
  name,
  company,
  email,
  phone,
  timing: z.preprocess(blankToUndefined, z.enum(values(timings)).optional()),
  message: z.preprocess(blankToUndefined, z.string().trim().max(3000, "Die Nachricht ist zu lang (maximal 3000 Zeichen).").optional()),
  consent,
});

export type OfferContact = z.output<typeof offerContactSchema>;

/** The contact form on /kontakt. */
export const contactSchema = z.object({
  topic: z.enum(values(topics), { error: "Bitte wählen Sie Ihr Anliegen." }),
  name,
  company,
  email,
  phone,
  message: z
    .string({ error: "Bitte schreiben Sie uns eine kurze Nachricht." })
    .trim()
    .min(10, "Bitte schreiben Sie uns ein, zwei Sätze (mindestens 10 Zeichen).")
    .max(5000, "Die Nachricht ist zu lang (maximal 5000 Zeichen)."),
  consent,
});

export type ContactInput = z.output<typeof contactSchema>;

const FIELDS: RequestField[] = ["topic", "name", "company", "email", "phone", "timing", "message", "consent", "input"];

/** First message per field. */
export function fieldErrors(error: z.ZodError): Partial<Record<RequestField, string>> {
  const flat = z.flattenError(error).fieldErrors as Partial<Record<RequestField, string[]>>;
  const result: Partial<Record<RequestField, string>> = {};
  for (const key of FIELDS) {
    const first = flat[key]?.[0];
    if (first) result[key] = first;
  }
  return result;
}
