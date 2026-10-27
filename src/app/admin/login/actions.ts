"use server";

import { redirect } from "next/navigation";
import { audit } from "@/lib/admin/audit";
import { safeAdminTarget } from "@/lib/admin/auth/login";
import { verifyAdminPassword } from "@/lib/admin/auth/password";
import { completeLoginAttempt, removeOldAttempts, reserveLoginAttempt } from "@/lib/admin/auth/rate-limit";
import { createAdminSession } from "@/lib/admin/auth/session";
import { isAdminConfigured } from "@/lib/admin/env";
import { fail, type ActionState } from "@/lib/admin/forms";
import { requestIpHash } from "@/lib/admin/request";

const WRONG = "Das Passwort ist nicht korrekt.";
const IP_BLOCKED = "Zu viele Fehlversuche von dieser Adresse. Bitte warten Sie 15 Minuten.";
const LOCKED = "Nach vielen Fehlversuchen ist die Anmeldung bis zu einer Stunde gesperrt. Bitte versuchen Sie es später wieder.";

/**
 * The only way in: the shared password. There is no registration. The attempt is reserved
 * before the password check, so parallel requests cannot pass the limits (see auth/rate-limit.ts).
 */
export async function login(_prev: ActionState, data: FormData): Promise<ActionState> {
  if (!isAdminConfigured()) redirect("/admin/einrichtung");

  const ipHash = await requestIpHash();
  const reservation = await reserveLoginAttempt(ipHash);
  if (reservation.status === "ip_blocked") return fail(IP_BLOCKED);
  if (reservation.status === "locked") return fail(LOCKED);

  if (!(await verifyAdminPassword(String(data.get("password") ?? "")))) {
    // The reserved attempt stays recorded as a failure.
    await removeOldAttempts();
    await audit("login_failed", { reason: "password" });
    return fail(WRONG);
  }

  await completeLoginAttempt(reservation.id, ipHash);
  const sessionId = await createAdminSession();
  await audit("login", {}, sessionId);
  redirect(safeAdminTarget(data.get("next")));
}
