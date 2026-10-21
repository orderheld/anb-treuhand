"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { adminButton } from "./ui";

/** Copies a value to the clipboard and confirms it for a moment. */
export function CopyButton({ value, label = "Kopieren" }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className={adminButton("secondary", "sm")}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch {
          setCopied(false);
        }
      }}
    >
      {copied ? <Check aria-hidden className="size-4 text-emerald-700" /> : <Copy aria-hidden className="size-4" />}
      <span aria-live="polite">{copied ? "Kopiert" : label}</span>
    </button>
  );
}
