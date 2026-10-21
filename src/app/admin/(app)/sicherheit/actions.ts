"use server";

import { redirect } from "next/navigation";
import { audit } from "@/lib/admin/audit";
import { destroyAllAdminSessions, requireAdmin } from "@/lib/admin/auth/session";

/** Signs out every device, this one included. */
export async function logoutAllAction(): Promise<void> {
  const session = await requireAdmin();
  const ended = await destroyAllAdminSessions();
  await audit("logout_all", { sessions: ended }, session.id);
  redirect("/admin/login");
}
