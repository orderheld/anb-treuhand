import "server-only";

/** Only relative admin paths are accepted as target after the login. */
export function safeAdminTarget(value: unknown): string {
  if (typeof value !== "string") return "/admin";
  if (!/^\/admin(\/[A-Za-z0-9\-._~%/?=&]*)?$/.test(value) || value.startsWith("//") || value.includes("..")) return "/admin";
  if (value.startsWith("/admin/login") || value.startsWith("/admin/einrichtung")) return "/admin";
  return value;
}
