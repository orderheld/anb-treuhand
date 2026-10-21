"use server";

import { redirect } from "next/navigation";
import { audit } from "@/lib/admin/audit";
import { claimTotpStep, safeAdminTarget } from "@/lib/admin/auth/login";
import { verifyAdminPassword } from "@/lib/admin/auth/password";
import { checkLoginCode, removeOldAttempts, reserveLoginAttempt } from "@/lib/admin/auth/rate-limit";
import { createAdminSession } from "@/lib/admin/auth/session";
import { verifyTotp } from "@/lib/admin/auth/totp";
import { adminEnv, isAdminConfigured } from "@/lib/admin/env";
import { fail, type ActionState } from "@/lib/admin/forms";
import { requestIpHash } from "@/lib/admin/request";

const WRONG = "Passwort oder Code ist nicht korrekt.";
const IP_BLOCKED = "Zu viele Fehlversuche von dieser Adresse. Bitte warten Sie 15 Minuten.";
const CODE_LOCKED =
  "Die Anmeldung ist bis zu einer Stunde gesperrt: Mit dem richtigen Passwort wurde zu oft ein falscher Code eingegeben. Wenn Sie das nicht waren, ändern Sie das Passwort.";

/**
 * The only way in: the password and the current code of the authenticator app, both required.
 * There is no registration. The attempt is reserved before the password check, so parallel
 * requests cannot pass the limits (see auth/rate-limit.ts).
 */
export async function login(_prev: ActionState, data: FormData): Promise<ActionState> {
  const totpSecret = adminEnv.totpSecret;
  if (!isAdminConfigured() || !totpSecret) redirect("/admin/einrichtung");

  const ipHash = await requestIpHash();
  const reservation = await reserveLoginAttempt(ipHash);
  if (reservation.status === "ip_blocked") return fail(IP_BLOCKED);
  if (reservation.status === "code_locked") return fail(CODE_LOCKED);

  const password = String(data.get("password") ?? "");
  const code = String(data.get("code") ?? "");
  if (!(await verifyAdminPassword(password))) {
    // The reserved attempt stays recorded as a failure.
    await removeOldAttempts();
    await audit("login_failed", { reason: "password" });
    return fail(WRONG);
  }

  const result = await checkLoginCode(reservation.id, ipHash, async (client) => {
    const step = verifyTotp(totpSecret, code);
    // Each code works once: a code seen by someone else cannot be used again.
    return step !== null && (await claimTotpStep(step, client));
  });
  if (result !== "ok") {
    await audit("login_failed", { reason: result === "locked" ? "locked" : "code" });
    return fail(result === "locked" ? CODE_LOCKED : WRONG);
  }

  const sessionId = await createAdminSession();
  await audit("login", {}, sessionId);
  redirect(safeAdminTarget(data.get("next")));
}
