import "server-only";
import { createHash, randomBytes, timingSafeEqual } from "node:crypto";

export function sha256(data: Buffer | string): string {
  return createHash("sha256").update(data).digest("hex");
}

export function randomToken(bytes = 32): string {
  return randomBytes(bytes).toString("base64url");
}

export function safeEqual(a: Buffer, b: Buffer): boolean {
  return a.length === b.length && timingSafeEqual(a, b);
}
