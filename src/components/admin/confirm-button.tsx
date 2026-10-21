"use client";

import { useTransition } from "react";
import { adminButton } from "./ui";

/** Runs an action that cannot be undone after the browser's confirmation dialog. */
export function ConfirmButton({
  action,
  question,
  variant = "secondary",
  children,
}: {
  action: () => Promise<void>;
  question: string;
  variant?: "secondary" | "danger";
  children: React.ReactNode;
}) {
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      className={adminButton(variant, "sm")}
      onClick={() => {
        if (!window.confirm(question)) return;
        startTransition(() => action());
      }}
    >
      {children}
    </button>
  );
}
