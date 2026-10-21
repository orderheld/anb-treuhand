"use client";

import { createContext, startTransition, use, useActionState, useEffect, useLayoutEffect, useRef, useState } from "react";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { idle, type ActionState } from "@/lib/admin/forms";
import { cn } from "@/lib/utils";
import { adminButton } from "./ui";

/**
 * Forms of the admin area. ActionForm runs a Server Action through useActionState; fields read
 * their error from the context by name. Submitting does not reset the form, so entries stay
 * when the server reports an error.
 */

type Action = (prev: ActionState, data: FormData) => Promise<ActionState>;

const FormContext = createContext<{ state: ActionState; pending: boolean }>({ state: idle, pending: false });

export function useFieldError(name: string): string | undefined {
  const { state } = use(FormContext);
  return state.status === "error" ? state.errors?.[name] : undefined;
}

interface ActionFormProps {
  action: Action;
  children: React.ReactNode;
  submitLabel?: string;
  pendingLabel?: string;
  submitVariant?: "primary" | "secondary" | "danger";
  /** Further buttons next to the submit button. */
  secondary?: React.ReactNode;
  /** Asked before the action runs, e.g. before deleting. */
  confirm?: string;
  className?: string;
  /** Submit row at the top instead of below the fields (long forms keep it sticky). */
  stickySubmit?: boolean;
}

/**
 * Next.js keeps visited pages mounted but hidden; a form that was left starts fresh when its
 * page is shown again, without an old message.
 */
export function ActionForm(props: ActionFormProps) {
  const [generation, setGeneration] = useState(0);
  useLayoutEffect(() => () => setGeneration((g) => g + 1), []);
  return <ActionFormInner key={generation} {...props} />;
}

function ActionFormInner({
  action,
  children,
  submitLabel = "Speichern",
  pendingLabel = "Wird gespeichert …",
  submitVariant = "primary",
  secondary,
  confirm,
  className,
  stickySubmit = false,
}: ActionFormProps) {
  const [state, formAction, pending] = useActionState(action, idle);
  const messageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state.status !== "idle") messageRef.current?.focus();
  }, [state]);

  const message =
    state.status === "error" ? (
      <div ref={messageRef} tabIndex={-1} role="alert" className="flex gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-950 focus:outline-none">
        <AlertCircle aria-hidden className="mt-0.5 size-4 shrink-0 text-red-700" />
        <div>
          <p className="font-medium">{state.message}</p>
          {state.errors && Object.keys(state.errors).length > 1 ? (
            <ul className="mt-1 list-disc pl-4">
              {Object.entries(state.errors).map(([field, error]) => (
                <li key={field}>{error}</li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    ) : state.status === "success" ? (
      <div ref={messageRef} tabIndex={-1} role="status" className="flex gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-950 focus:outline-none">
        <CheckCircle2 aria-hidden className="mt-0.5 size-4 shrink-0 text-emerald-700" />
        <p className="font-medium">{state.message}</p>
      </div>
    ) : null;

  const submitRow = (
    <div className="flex flex-wrap items-center gap-3">
      <button type="submit" disabled={pending} className={adminButton(submitVariant)}>
        {pending ? <Loader2 aria-hidden className="size-4 animate-spin" /> : null}
        {pending ? pendingLabel : submitLabel}
      </button>
      {secondary}
    </div>
  );

  return (
    <FormContext value={{ state, pending }}>
      <form
        noValidate
        className={cn("space-y-6", className)}
        onSubmit={(event) => {
          event.preventDefault();
          if (confirm && !window.confirm(confirm)) return;
          const data = new FormData(event.currentTarget);
          startTransition(() => formAction(data));
        }}
      >
        {stickySubmit ? (
          <div className="sticky top-0 z-10 -mx-5 space-y-3 border-b border-line bg-white/95 px-5 py-3 backdrop-blur sm:-mx-6 sm:px-6">
            {submitRow}
            {message}
          </div>
        ) : (
          message
        )}
        {children}
        {stickySubmit ? null : submitRow}
      </form>
    </FormContext>
  );
}

export const inputClass =
  "block w-full rounded-field border border-field bg-white px-3.5 py-2.5 text-[0.9375rem] text-ink transition-[border-color,box-shadow] placeholder:text-hint hover:border-muted focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/20 aria-invalid:border-danger";

export function TextField({
  name,
  label,
  hint,
  className,
  ...props
}: { name: string; label: string; hint?: string; className?: string } & Omit<React.InputHTMLAttributes<HTMLInputElement>, "name" | "className">) {
  const error = useFieldError(name);
  const id = `f-${name}`;
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-medium text-ink">
        {label}
      </label>
      <input
        id={id}
        name={name}
        aria-invalid={error ? true : undefined}
        aria-describedby={[hint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(Boolean).join(" ") || undefined}
        className={cn(inputClass, "mt-1.5")}
        {...props}
      />
      {hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-[0.8125rem] text-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-[0.8125rem] font-medium text-red-700">
          {error}
        </p>
      ) : null}
    </div>
  );
}
