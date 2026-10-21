/** Form state shared by the Server Actions and the client forms (no runtime dependencies). */

/** Fields of the contact and offer forms. "input" carries problems with the calculator values. */
export type RequestField = "topic" | "name" | "company" | "email" | "phone" | "timing" | "message" | "consent" | "input";

/** Fields with a text value that the form sends back on errors. */
export type RequestTextField = Exclude<RequestField, "input">;

/** Raw values, returned on errors so the form keeps what the visitor entered. */
export type RequestValues = Partial<Record<RequestTextField, string>>;

export type RequestState =
  | { status: "idle" }
  | { status: "invalid"; errors: Partial<Record<RequestField, string>>; values: RequestValues }
  | { status: "error"; message: string; reference?: string; values: RequestValues }
  | { status: "success"; reference: string; email: string; confirmation: boolean };

export const initialRequestState: RequestState = { status: "idle" };

export const REQUEST_TEXT_FIELDS: RequestTextField[] = ["topic", "name", "company", "email", "phone", "timing", "message", "consent"];
