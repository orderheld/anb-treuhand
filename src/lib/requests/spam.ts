import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { serverEnv } from "@/lib/env";

/**
 * Invisible spam protection for the contact and offer forms. People see none of it:
 *
 * 1. Form token: the form asks the server for a signed timestamp when it appears on screen and
 *    sends it back with the request. Bots that post straight to the endpoint have none, and a
 *    forged one fails the signature. The timestamp also gives a server-side minimum fill time.
 * 2. Content check: links, link markup, foreign scripts and typical advertising phrases that do
 *    not belong in a request to a Swiss Treuhand office.
 *
 * The honeypot field and the rate limit live in the actions and rate-limit.ts.
 */

/** Faster than this between form display and submit is a bot. */
export const MIN_FILL_MS = 3000;
/** Tokens older than this are refused, the visitor is asked to reload the page. */
export const MAX_TOKEN_AGE_MS = 24 * 60 * 60 * 1000;

function key(): string {
  // Derived from an existing secret, so no new environment variable is needed.
  const base = serverEnv.ipSalt ?? serverEnv.cronSecret ?? "anb-local-development";
  return createHmac("sha256", base).update("anb-form-token-v1").digest("hex");
}

function sign(payload: string): string {
  return createHmac("sha256", key()).update(payload).digest("base64url");
}

export function issueFormToken(now = Date.now()): string {
  const payload = now.toString(36);
  return `${payload}.${sign(payload)}`;
}

export type TokenCheck = "ok" | "missing" | "invalid" | "too_fast" | "expired";

export function checkFormToken(token: unknown, now = Date.now()): TokenCheck {
  if (typeof token !== "string" || token === "") return "missing";
  const [payload, signature, ...rest] = token.split(".");
  if (!payload || !signature || rest.length > 0 || token.length > 100) return "invalid";
  const expected = Buffer.from(sign(payload));
  const given = Buffer.from(signature);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return "invalid";
  const issued = Number.parseInt(payload, 36);
  if (!Number.isFinite(issued)) return "invalid";
  const age = now - issued;
  if (age < MIN_FILL_MS) return "too_fast";
  if (age > MAX_TOKEN_AGE_MS) return "expired";
  return "ok";
}

const LINK = /\b(?:https?:\/\/|www\.)\S+/gi;
const LINK_MARKUP = /<a\s|\[url[=\]]|\[link[=\]]|<\/a>/i;
/** Cyrillic, CJK, Hangul, Thai: no request to ANB is written in these. */
const FOREIGN_SCRIPT = /[Ѐ-ӿ぀-ヿ㐀-鿿가-힯฀-๿]/;
/** English advertising phrases seen in contact form spam. */
const SPAM_PHRASES =
  /\b(?:seo|backlinks?|guest ?posts?|link ?building|casino|viagra|cialis|crypto(?:currency)?|bitcoin|forex|first page of google|rank(?:ing)? (?:on|in) google|search engine optimi[sz]ation|web ?traffic|increase (?:your )?(?:traffic|sales|leads)|unsubscribe|lead generation|outsourc\w*|whatsapp me)\b/gi;

export interface ContentFields {
  name?: string;
  company?: string;
  message?: string;
}

export type ContentCheck = { ok: true } | { ok: false; reason: "link_in_name" | "links" | "markup" | "script" | "phrases" };

export function checkContent({ name = "", company = "", message = "" }: ContentFields): ContentCheck {
  const all = `${name}\n${company}\n${message}`;
  if (/https?:\/\/|www\./i.test(`${name} ${company}`)) return { ok: false, reason: "link_in_name" };
  if (LINK_MARKUP.test(all)) return { ok: false, reason: "markup" };
  if ((message.match(LINK) ?? []).length > 1) return { ok: false, reason: "links" };
  if (FOREIGN_SCRIPT.test(all)) return { ok: false, reason: "script" };
  if (new Set((all.match(SPAM_PHRASES) ?? []).map((p) => p.toLowerCase())).size >= 2) return { ok: false, reason: "phrases" };
  return { ok: true };
}

/** Shown when the content check fails. Real people can fix it, bots do not read it. */
export function contentMessage(fallbackEmail: string): string {
  return `Unser Spamschutz hat Ihre Nachricht zurückgehalten. Bitte entfernen Sie Links und Werbebegriffe aus dem Text oder schreiben Sie uns direkt an ${fallbackEmail}.`;
}
