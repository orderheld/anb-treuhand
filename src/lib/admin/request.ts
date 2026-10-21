import "server-only";
import { headers } from "next/headers";
import { clientIp, hashIp } from "@/lib/requests/rate-limit";

/** Salted hash of the client IP (as for the forms); the address itself is never stored. */
export async function requestIpHash(): Promise<string> {
  return hashIp(clientIp(await headers()));
}

export async function requestUserAgent(): Promise<string | null> {
  return (await headers()).get("user-agent")?.slice(0, 300) ?? null;
}
