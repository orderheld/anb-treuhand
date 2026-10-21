import "server-only";

/**
 * Configuration of the admin area: one shared login with password and two-factor code, for
 * ANB Treuhand and Webnova. The values are environment variables in Vercel, never part of the
 * repository; /admin/einrichtung generates them in the browser.
 */
export const adminEnv = {
  /** Postgres connection string (Neon). Tariffs, requests and sessions are stored there. */
  databaseUrl: process.env.DATABASE_URL,
  /**
   * PBKDF2 hash of the password: pbkdf2-sha256:<iterations>:<salt>:<hash> (base64url).
   * Colons instead of the usual "$", because .env files expand "$" as variables.
   */
  passwordHash: process.env.ADMIN_PASSWORD_HASH,
  /** TOTP secret (base32) for an authenticator app. Every login asks for the six-digit code. */
  totpSecret: process.env.ADMIN_TOTP_SECRET?.trim() || undefined,
};

export interface AdminConfigItem {
  name: string;
  label: string;
  ok: boolean;
}

/** Splits a stored password hash; "$" is accepted as separator too. */
export function parsePasswordHash(value: string | undefined) {
  const parts = value?.trim().split(/[:$]/) ?? [];
  const iterations = Number(parts[1]);
  if (parts.length !== 4 || parts[0] !== "pbkdf2-sha256" || !Number.isInteger(iterations) || iterations < 100_000 || !parts[2] || !parts[3]) {
    return null;
  }
  return { iterations, salt: Buffer.from(parts[2], "base64url"), hash: Buffer.from(parts[3], "base64url") };
}

/** At least 80 bits in base32 (16 characters), as the authenticator apps expect. */
export function totpSecretValid(value: string | undefined = adminEnv.totpSecret): boolean {
  const clean = value?.replace(/\s/g, "").replace(/=+$/, "").toUpperCase() ?? "";
  return /^[A-Z2-7]{16,}$/.test(clean);
}

function passwordHashValid(): boolean {
  const parsed = parsePasswordHash(adminEnv.passwordHash);
  return parsed !== null && parsed.salt.length >= 16 && parsed.hash.length >= 32;
}

/** State of every setting, for the setup page. Contains no values. */
export function adminConfigStatus(): AdminConfigItem[] {
  return [
    { name: "DATABASE_URL", label: "Datenbank (Neon)", ok: Boolean(adminEnv.databaseUrl) },
    { name: "ADMIN_PASSWORD_HASH", label: "Passwort (als Hash)", ok: passwordHashValid() },
    { name: "ADMIN_TOTP_SECRET", label: "Zwei-Faktor-Code (Authenticator-App)", ok: totpSecretValid() },
  ];
}

/** Database, password and two-factor code are all set. Login and every admin page need it. */
export function isAdminConfigured(): boolean {
  return adminConfigStatus().every((item) => item.ok);
}
