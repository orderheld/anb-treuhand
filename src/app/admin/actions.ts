"use server";

import { redirect } from "next/navigation";
import { audit } from "@/lib/admin/audit";
import { destroyAdminSession, getAdminSession } from "@/lib/admin/auth/session";

export async function logout(): Promise<void> {
  const session = await getAdminSession();
  if (session) await audit("logout", {}, session.id);
  await destroyAdminSession();
  redirect("/admin/login");
}
