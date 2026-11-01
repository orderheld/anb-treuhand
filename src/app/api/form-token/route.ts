import { connection } from "next/server";
import { issueFormToken } from "@/lib/requests/spam";

/** Signed timestamp for the contact and offer forms (see src/lib/requests/spam.ts). */
export async function GET() {
  await connection(); // never prerendered: every visitor needs a fresh timestamp
  return Response.json({ token: issueFormToken() }, { headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" } });
}
