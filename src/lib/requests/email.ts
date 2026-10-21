import "server-only";
import { Resend } from "resend";
import { absoluteUrl, addressLine, responseClause, site, vatNote } from "@/config/site";
import { getCalculator } from "@/content/calculators";
import type { CalculatorRequest } from "@/lib/calculators/index";
import type { Estimate } from "@/lib/calculators/shared";
import { serverEnv } from "@/lib/env";
import {
  emailColors,
  escapeHtml,
  escapeMultiline,
  heading,
  keyValueTable,
  layout,
  linesTable,
  paragraph,
  referenceLine,
  totalsBlock,
} from "./email-layout";
import { labelOf, timings, topics } from "./options";
import type { ContactInput, OfferContact } from "./schema";
import { estimateLineRows, inputRows, totalRows } from "./summary";

export type EmailResult = { ok: true; id: string | null } | { ok: false; error: string };

interface Mail {
  to: string;
  replyTo: string;
  subject: string;
  text: string;
  html: string;
  tag: string;
  idempotencyKey: string;
}

async function send(mail: Mail): Promise<EmailResult> {
  if (serverEnv.dryRun) {
    // The full text is only printed locally; deployed dry runs log the subject line only.
    const body = process.env.NODE_ENV === "development" ? `\n${mail.text}` : "";
    console.info(`[mail] dry run, not sent: ${mail.tag} (${mail.idempotencyKey})${body}`);
    return { ok: true, id: null };
  }
  if (!serverEnv.resendApiKey || !serverEnv.contactFrom) return { ok: false, error: "email_not_configured" };
  try {
    const resend = new Resend(serverEnv.resendApiKey);
    const { data, error } = await resend.emails.send(
      {
        from: serverEnv.contactFrom,
        to: mail.to,
        replyTo: mail.replyTo,
        subject: mail.subject,
        text: mail.text,
        html: mail.html,
        tags: [{ name: "source", value: mail.tag }],
      },
      { idempotencyKey: mail.idempotencyKey },
    );
    if (error) return { ok: false, error: `${error.name}: ${error.message}` };
    return { ok: true, id: data?.id ?? null };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "unknown_error" };
  }
}

/** Recipient of the requests. The dry run needs no address. */
function recipient(): string | null {
  return serverEnv.contactTo ?? (serverEnv.dryRun ? site.contact.email.value : null);
}

const received = () =>
  new Intl.DateTimeFormat("de-CH", { dateStyle: "long", timeStyle: "short", timeZone: "Europe/Zurich" }).format(new Date());

const hostLabel = () => absoluteUrl("/").replace(/^https?:\/\//, "");

function contactRows(c: { name: string; company?: string; email: string; phone?: string }): [string, string][] {
  return [
    ["Name", escapeHtml(c.name)],
    ["Firma", escapeHtml(c.company ?? "–")],
    ["E-Mail", `<a href="mailto:${escapeHtml(c.email)}" style="color:${emailColors.accent}">${escapeHtml(c.email)}</a>`],
    ["Telefon", c.phone ? `<a href="tel:${escapeHtml(c.phone.replace(/[^+\d]/g, ""))}" style="color:${emailColors.accent}">${escapeHtml(c.phone)}</a>` : "–"],
  ];
}

function signatureHtml(): string {
  const phone = site.contact.phone.value;
  return paragraph(
    `Freundliche Grüsse<br><strong style="color:${emailColors.ink}">${escapeHtml(site.brand)}</strong><br>${escapeHtml(addressLine())}${
      phone ? `<br>${escapeHtml(phone)}` : ""
    }<br><a href="mailto:${escapeHtml(site.contact.email.value)}" style="color:${emailColors.accent}">${escapeHtml(site.contact.email.value)}</a> · <a href="${escapeHtml(absoluteUrl("/"))}" style="color:${emailColors.accent}">${escapeHtml(hostLabel())}</a>`,
  );
}

function signatureText(): string {
  const phone = site.contact.phone.value;
  return ["Freundliche Grüsse", site.brand, addressLine(), phone, site.contact.email.value, hostLabel()].filter(Boolean).join("\n");
}

const confirmationFooter = () =>
  `Sie erhalten diese E-Mail, weil über ${escapeHtml(hostLabel())} eine Anfrage mit Ihrer Adresse gesendet wurde. Falls das nicht Sie waren, können Sie diese Nachricht ignorieren.`;

function rowsText(rows: { label: string; value: string }[]): string {
  return rows.map((r) => `${r.label}: ${r.value}`).join("\n");
}

/* ---------- Offer request (calculator) ---------- */

export interface OfferMail {
  reference: string;
  contact: OfferContact;
  request: CalculatorRequest;
  estimate: Estimate;
  /** Hint of the tariffs under the result ("Unverbindlicher Richtpreis …"). */
  hint: string;
  /** Link to the stored request in the admin area, when requests are stored. */
  adminLink?: string;
}

export function renderOfferInternal(m: OfferMail): { subject: string; text: string; html: string } {
  const calc = getCalculator(m.request.slug);
  const inputs = inputRows(m.request);
  const lines = estimateLineRows(m.estimate);
  const totals = totalRows(m.request.slug, m.estimate);
  const subject = `Offertanfrage ${calc.short}: ${m.contact.name} (${m.reference})`;
  const timing = labelOf(timings, m.contact.timing);

  const text = [
    `Neue Offertanfrage über ${hostLabel()}: ${calc.name}`,
    "",
    `Referenz: ${m.reference}`,
    `Name: ${m.contact.name}`,
    `Firma: ${m.contact.company ?? "–"}`,
    `E-Mail: ${m.contact.email}`,
    `Telefon: ${m.contact.phone ?? "–"}`,
    `Gewünschter Start: ${timing}`,
    "",
    "Nachricht:",
    m.contact.message ?? "–",
    "",
    "Angaben im Rechner:",
    rowsText(inputs),
    "",
    "Berechnung mit den aktuellen Tarifen:",
    ...lines.map((l) => `- ${l.label}${l.external ? " (extern)" : ""}: ${l.amount}${l.detail ? ` (${l.detail})` : ""}`),
    "",
    rowsText(totals),
    ...(m.estimate.warnings.length ? ["", "Hinweise an die Kundin oder den Kunden:", ...m.estimate.warnings.map((w) => `- ${w}`)] : []),
    "",
    `Eingang: ${received()}. Antworten gehen direkt an ${m.contact.email}.`,
    m.adminLink ? `Admin: ${m.adminLink}` : "",
  ].join("\n");

  const content = [
    paragraph(`Über den <strong style="color:${emailColors.ink}">${escapeHtml(calc.name)}</strong> ist eine neue Anfrage eingegangen.`),
    keyValueTable([...contactRows(m.contact), ["Gewünschter Start", escapeHtml(timing)], ["Referenz", escapeHtml(m.reference)]]),
    m.contact.message ? heading("Nachricht") + paragraph(escapeMultiline(m.contact.message)) : "",
    heading("Angaben im Rechner"),
    keyValueTable(inputs.map((r) => [r.label, escapeMultiline(r.value)])),
    heading("Berechnung mit den aktuellen Tarifen"),
    linesTable(lines),
    totalsBlock(totals.map((r) => [r.label, r.value])),
    m.estimate.warnings.length
      ? paragraph(`<br><strong>Hinweise im Rechner:</strong><br>${m.estimate.warnings.map(escapeHtml).join("<br>")}`, true)
      : "",
  ].join("\n");

  const footer = `Eingang: ${escapeHtml(received())}. Mit «Antworten» schreiben Sie direkt an ${escapeHtml(m.contact.email)}.${
    m.adminLink ? `<br><a href="${escapeHtml(m.adminLink)}" style="color:${emailColors.accent}">Anfrage im Admin-Bereich öffnen</a>` : ""
  }`;
  return { subject, text, html: layout({ title: "Neue Offertanfrage", preheader: `${calc.name}: ${m.contact.name}`, content, footer }) };
}

/**
 * Confirmation to the visitor. Contains no text the visitor typed (not even the name), so the
 * form cannot be misused to send messages to third parties under ANB's name.
 */
export function renderOfferConfirmation(m: OfferMail): { subject: string; text: string; html: string } {
  const calc = getCalculator(m.request.slug);
  const inputs = inputRows(m.request).filter((r) => !r.free);
  const lines = estimateLineRows(m.estimate);
  const totals = totalRows(m.request.slug, m.estimate);
  const subject = `Ihre Anfrage bei ${site.brand} (${m.reference})`;
  const next = `Wir prüfen Ihre Angaben und melden uns persönlich bei Ihnen${responseClause()}. Im kostenlosen Erstgespräch klären wir die Einzelheiten, danach erhalten Sie Ihre verbindliche Offerte.`;
  const note = `${m.hint} ${vatNote()}`.trim();

  const text = [
    "Guten Tag",
    "",
    `Vielen Dank für Ihre Anfrage über unseren ${calc.name}. ${next}`,
    "",
    "Ihre Angaben:",
    rowsText(inputs),
    "",
    "Ihr Richtpreis:",
    ...lines.map((l) => `- ${l.label}: ${l.amount}`),
    rowsText(totals),
    "",
    note,
    "",
    `Referenz: ${m.reference}`,
    "",
    "Haben Sie Fragen? Antworten Sie einfach auf diese E-Mail.",
    "",
    signatureText(),
  ].join("\n");

  const content = [
    paragraph("Guten Tag"),
    paragraph(`Vielen Dank für Ihre Anfrage über unseren ${escapeHtml(calc.name)}. ${escapeHtml(next)}`),
    heading("Ihre Angaben"),
    keyValueTable(inputs.map((r) => [r.label, escapeHtml(r.value)])),
    heading("Ihr Richtpreis"),
    linesTable(lines),
    totalsBlock(totals.map((r) => [r.label, r.value])),
    paragraph(`<br>${escapeHtml(note)}`, true),
    referenceLine(m.reference),
    paragraph("<br>Haben Sie Fragen? Antworten Sie einfach auf diese E-Mail."),
    signatureHtml(),
  ].join("\n");

  return { subject, text, html: layout({ title: "Vielen Dank für Ihre Anfrage", preheader: `Ihr Richtpreis und die nächsten Schritte (${m.reference})`, content, footer: confirmationFooter() }) };
}

/* ---------- Contact form ---------- */

export interface ContactMail {
  reference: string;
  input: ContactInput;
  adminLink?: string;
}

export function renderContactInternal(m: ContactMail): { subject: string; text: string; html: string } {
  const topic = labelOf(topics, m.input.topic);
  const subject = `Kontaktanfrage ${topic}: ${m.input.name} (${m.reference})`;
  const text = [
    `Neue Kontaktanfrage über ${hostLabel()}`,
    "",
    `Referenz: ${m.reference}`,
    `Anliegen: ${topic}`,
    `Name: ${m.input.name}`,
    `Firma: ${m.input.company ?? "–"}`,
    `E-Mail: ${m.input.email}`,
    `Telefon: ${m.input.phone ?? "–"}`,
    "",
    "Nachricht:",
    m.input.message,
    "",
    `Eingang: ${received()}. Antworten gehen direkt an ${m.input.email}.`,
    m.adminLink ? `Admin: ${m.adminLink}` : "",
  ].join("\n");
  const content = [
    paragraph(`Über das Kontaktformular ist eine neue Anfrage eingegangen.`),
    keyValueTable([["Anliegen", escapeHtml(topic)], ...contactRows(m.input), ["Referenz", escapeHtml(m.reference)]]),
    heading("Nachricht"),
    paragraph(escapeMultiline(m.input.message)),
  ].join("\n");
  const footer = `Eingang: ${escapeHtml(received())}. Mit «Antworten» schreiben Sie direkt an ${escapeHtml(m.input.email)}.${
    m.adminLink ? `<br><a href="${escapeHtml(m.adminLink)}" style="color:${emailColors.accent}">Anfrage im Admin-Bereich öffnen</a>` : ""
  }`;
  return { subject, text, html: layout({ title: `Kontaktanfrage: ${topic}`, preheader: `${topic}: ${m.input.name}`, content, footer }) };
}

export function renderContactConfirmation(m: ContactMail): { subject: string; text: string; html: string } {
  const topic = labelOf(topics, m.input.topic);
  const subject = `Ihre Nachricht an ${site.brand} (${m.reference})`;
  const next = `Wir melden uns persönlich bei Ihnen${responseClause()}.`;
  const text = [
    "Guten Tag",
    "",
    `Vielen Dank für Ihre Nachricht. ${next}`,
    "",
    `Ihr Anliegen: ${topic}`,
    `Referenz: ${m.reference}`,
    "",
    "Haben Sie Fragen? Antworten Sie einfach auf diese E-Mail.",
    "",
    signatureText(),
  ].join("\n");
  const content = [
    paragraph("Guten Tag"),
    paragraph(`Vielen Dank für Ihre Nachricht. ${escapeHtml(next)}`),
    keyValueTable([["Ihr Anliegen", escapeHtml(topic)]]),
    referenceLine(m.reference),
    paragraph("<br>Haben Sie Fragen? Antworten Sie einfach auf diese E-Mail."),
    signatureHtml(),
  ].join("\n");
  return { subject, text, html: layout({ title: "Vielen Dank für Ihre Nachricht", preheader: `Wir haben Ihre Nachricht erhalten (${m.reference})`, content, footer: confirmationFooter() }) };
}

/* ---------- Delivery ---------- */

export interface Delivery {
  internal: EmailResult;
  confirmation: "sent" | "failed" | "skipped";
}

/**
 * Sends the request to ANB first. Only when that worked, the confirmation goes to the visitor;
 * its failure does not fail the request.
 */
async function deliver(
  reference: string,
  visitorEmail: string,
  tag: "website_offer" | "website_contact",
  internal: { subject: string; text: string; html: string },
  confirmation: { subject: string; text: string; html: string },
): Promise<Delivery> {
  const to = recipient();
  if (!to) return { internal: { ok: false, error: "email_not_configured" }, confirmation: "skipped" };
  const result = await send({ to, replyTo: visitorEmail, ...internal, tag, idempotencyKey: `${tag}/${reference}` });
  if (!result.ok || !serverEnv.confirmation) return { internal: result, confirmation: "skipped" };
  const sent = await send({
    to: visitorEmail,
    replyTo: serverEnv.contactTo ?? site.contact.email.value,
    ...confirmation,
    tag: `${tag}_confirmation`,
    idempotencyKey: `${tag}_confirmation/${reference}`,
  });
  if (!sent.ok) console.error(JSON.stringify({ event: "mail.confirmation_failed", reference, error: sent.error }));
  return { internal: result, confirmation: sent.ok ? "sent" : "failed" };
}

export function sendOfferEmails(m: OfferMail): Promise<Delivery> {
  return deliver(m.reference, m.contact.email, "website_offer", renderOfferInternal(m), renderOfferConfirmation(m));
}

export function sendContactEmails(m: ContactMail): Promise<Delivery> {
  return deliver(m.reference, m.input.email, "website_contact", renderContactInternal(m), renderContactConfirmation(m));
}
