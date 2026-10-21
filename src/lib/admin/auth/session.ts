import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { cache } from "react";
import { query } from "@/lib/db/client";
import { randomToken, sha256 } from "../crypto";
import { adminEnv, isAdminConfigured } from "../env";
import { requestIpHash, requestUserAgent } from "../request";

/**
 * Admin sessions: a random token in an HttpOnly cookie, only its SHA-256 in the database.
 * A session ends after 12 hours, after 4 hours without activity, on logout, or when the password
 * or the TOTP key changes in Vercel.
 */

const SECURE = process.env.NODE_ENV === "production";
export const ADMIN_COOKIE = SECURE ? "__Host-anb-admin" : "anb-admin";
export const ABSOLUTE_HOURS = 12;
export const IDLE_HOURS = 4;
/** last_seen_at is written at most every 5 minutes. */
const TOUCH_MS = 5 * 60 * 1000;

export interface AdminSession {
  id: string;
  createdAt: Date;
  expiresAt: Date;
}

/** Fingerprint of the current credentials. Sessions from before a change no longer match. */
function credential(): string {
  return sha256(`${adminEnv.passwordHash?.trim() ?? ""}\n${adminEnv.totpSecret ?? ""}`).slice(0, 32);
}

/** Attributes of the session cookie. Deleting needs the same ones: browsers ignore a `__Host-` cookie without Secure. */
const COOKIE_OPTIONS = { httpOnly: true, secure: SECURE, sameSite: "lax", path: "/" } as const;

/**
 * Removes the session cookie. Only possible in Server Actions and Route Handlers; while a
 * Server Component renders, cookies are read-only and nothing happens.
 */
async function clearAdminCookie(): Promise<void> {
  try {
    (await cookies()).set(ADMIN_COOKIE, "", { ...COOKIE_OPTIONS, maxAge: 0, expires: new Date(0) });
  } catch {
    // Read-only during rendering: the page redirects to the login instead.
  }
}

export async function createAdminSession(): Promise<string> {
  const token = randomToken();
  const id = sha256(token);
  const rows = await query<{ expires_at: Date }>(
    `insert into admin_sessions (id, credential, expires_at, ip_hash, user_agent)
     values ($1, $2, now() + make_interval(hours => $3), $4, $5) returning expires_at`,
    [id, credential(), ABSOLUTE_HOURS, await requestIpHash(), await requestUserAgent()],
  );
  (await cookies()).set(ADMIN_COOKIE, token, { ...COOKIE_OPTIONS, expires: rows[0].expires_at });
  // Housekeeping: expired sessions and those of old credentials are not needed any more.
  await query("delete from admin_sessions where expires_at < now() or credential <> $1", [credential()]);
  return id;
}

/** The current session, or null. Cached per request. */
export const getAdminSession = cache(async (): Promise<AdminSession | null> => {
  // Everything after this point runs per request, never while prerendering.
  await connection();
  if (!isAdminConfigured()) return null;
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  if (!token || token.length > 100) return null;
  const rows = await query<{ id: string; created_at: Date; expires_at: Date; last_seen_at: Date }>(
    `select id, created_at, expires_at, last_seen_at from admin_sessions
     where id = $1 and credential = $2 and expires_at > now() and last_seen_at > now() - make_interval(hours => $3)`,
    [sha256(token), credential(), IDLE_HOURS],
  );
  const row = rows[0];
  if (!row) {
    // Expired, ended elsewhere or forged: drop the cookie, so the proxy sends the next request to the login.
    await clearAdminCookie();
    return null;
  }
  if (Date.now() - row.last_seen_at.getTime() > TOUCH_MS) {
    await query("update admin_sessions set last_seen_at = now() where id = $1", [row.id]);
  }
  return { id: row.id, createdAt: row.created_at, expiresAt: row.expires_at };
});

/**
 * For pages and Server Actions: the session, or a redirect to the login (or to the setup page
 * while the admin area is not configured).
 */
export async function requireAdmin(): Promise<AdminSession> {
  // Request time first: without the variables (a fresh deployment) the redirect would otherwise
  // run at build time and make the admin pages static.
  await connection();
  if (!isAdminConfigured()) redirect("/admin/einrichtung");
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return session;
}

export async function destroyAdminSession(): Promise<void> {
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  if (token) await query("delete from admin_sessions where id = $1", [sha256(token)]);
  await clearAdminCookie();
}

/** Ends every admin session, including the current one. Returns how many were ended. */
export async function destroyAllAdminSessions(): Promise<number> {
  const rows = await query("delete from admin_sessions returning id");
  await clearAdminCookie();
  return rows.length;
}

export interface ActiveSession {
  id: string;
  createdAt: Date;
  lastSeenAt: Date;
  userAgent: string | null;
}

/** Sessions that are still valid, the most recently active first. */
export async function activeAdminSessions(): Promise<ActiveSession[]> {
  const rows = await query<{ id: string; created_at: Date; last_seen_at: Date; user_agent: string | null }>(
    `select id, created_at, last_seen_at, user_agent from admin_sessions
     where credential = $1 and expires_at > now() and last_seen_at > now() - make_interval(hours => $2)
     order by last_seen_at desc`,
    [credential(), IDLE_HOURS],
  );
  return rows.map((r) => ({ id: r.id, createdAt: r.created_at, lastSeenAt: r.last_seen_at, userAgent: r.user_agent }));
}
