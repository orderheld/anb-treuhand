/** One state shape for the Server Actions of the admin area (useActionState). */
export type ActionState =
  | { status: "idle" }
  | { status: "error"; message: string; errors?: Record<string, string> }
  | { status: "success"; message: string };

export const idle: ActionState = { status: "idle" };

export function fail(message: string, errors?: Record<string, string>): ActionState {
  return { status: "error", message, errors };
}

export function ok(message: string): ActionState {
  return { status: "success", message };
}

/** All single-valued fields of a form; internal Next.js fields are dropped. */
export function formObject(data: FormData): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, value] of data.entries()) {
    if (key.startsWith("$ACTION") || typeof value !== "string") continue;
    out[key] = value;
  }
  return out;
}
