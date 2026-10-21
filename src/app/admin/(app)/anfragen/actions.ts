"use server";

import { refresh } from "next/cache";
import { redirect } from "next/navigation";
import { audit } from "@/lib/admin/audit";
import { requireAdmin } from "@/lib/admin/auth/session";
import { deleteRequest, isRequestStatus, setRequestStatus } from "@/lib/admin/requests";

export async function setStatusAction(reference: string, data: FormData): Promise<void> {
  const session = await requireAdmin();
  const status = data.get("status");
  if (!isRequestStatus(status)) return;
  if (await setRequestStatus(reference, status)) {
    await audit("request_status", { reference, status }, session.id);
  }
  // The navigation shows the number of new requests, so the layout renders again too.
  refresh();
}

export async function deleteRequestAction(reference: string): Promise<void> {
  const session = await requireAdmin();
  if (await deleteRequest(reference)) {
    await audit("request_deleted", { reference }, session.id);
  }
  refresh();
  redirect("/admin/anfragen?geloescht=1");
}
