"use client";

import { useState } from "react";
import { KeyRound } from "lucide-react";
import { CopyButton } from "@/components/admin/copy-button";
import { inputClass } from "@/components/admin/form";
import { adminButton } from "@/components/admin/ui";
import { cn } from "@/lib/utils";

/**
 * Generates the value of ADMIN_PASSWORD_HASH in the browser. Nothing typed here is sent to the
 * server: the password is hashed locally with PBKDF2 (WebCrypto).
 */

const ITERATIONS = 600_000;

function base64url(bytes: Uint8Array): string {
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function random(n: number): Uint8Array<ArrayBuffer> {
  return crypto.getRandomValues(new Uint8Array(n));
}

async function hashPassword(password: string): Promise<string> {
  const salt = random(16);
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password.normalize("NFC")), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt, iterations: ITERATIONS }, key, 256);
  return `pbkdf2-sha256:${ITERATIONS}:${base64url(salt)}:${base64url(new Uint8Array(bits))}`;
}

const COMMON = ["111111", "123456", "12345678", "password", "passwort", "treuhand", "anb", "admin", "qwertz", "000000"];

function weakness(pw: string): string | null {
  if (!pw) return null;
  if (COMMON.some((c) => pw.toLowerCase().includes(c)) || /^(.)\1*$/.test(pw)) {
    return "Dieses Passwort ist zu leicht zu erraten. Wählen Sie etwas, das nicht mit der Firma zu tun hat.";
  }
  if (pw.length < 12) return "Kürzer als 12 Zeichen. Nehmen Sie mindestens 12 Zeichen oder eine Passphrase aus vier Wörtern.";
  return null;
}

function CopyValue({ name, value }: { name: string; value: string }) {
  return (
    <div className="mt-4 rounded-xl border border-line bg-mist p-3">
      <div className="flex items-center justify-between gap-2">
        <code className="text-xs font-semibold text-ink">{name}</code>
        <CopyButton value={value} label="Wert kopieren" />
      </div>
      <code className="mt-2 block break-all font-mono text-xs text-muted">{value}</code>
    </div>
  );
}

function Step({ icon: Icon, title, children }: { icon: typeof KeyRound; title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-line bg-white p-5 sm:p-6">
      <h2 className="flex items-center gap-2 text-[1.0625rem] font-medium text-ink">
        <Icon aria-hidden className="size-4 text-accent" />
        {title}
      </h2>
      <div className="mt-2 text-sm leading-relaxed text-muted">{children}</div>
    </section>
  );
}

/** Password twice in, hash out. A weak password gets no hash: it is the only key to the admin area. */
export function SetupGenerator() {
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [hash, setHash] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const warn = weakness(pw);
  const mismatch = pw2.length > 0 && pw !== pw2;

  return (
    <Step icon={KeyRound} title="Passwort festlegen">
      <p>
        Das Passwort ist der einzige Schlüssel zum Admin-Bereich: mindestens 12 Zeichen, am besten eine Passphrase aus vier Wörtern. Es wird hier im Browser in
        einen Hash umgerechnet. Nur der Hash kommt zu Vercel, das Passwort selbst wird nirgends gespeichert.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="block text-sm font-medium text-ink">
          Passwort
          <input
            type="password"
            autoComplete="new-password"
            className={cn(inputClass, "mt-1.5")}
            value={pw}
            onChange={(e) => {
              setPw(e.target.value);
              setHash(null);
            }}
          />
        </label>
        <label className="block text-sm font-medium text-ink">
          Passwort wiederholen
          <input
            type="password"
            autoComplete="new-password"
            className={cn(inputClass, "mt-1.5")}
            value={pw2}
            onChange={(e) => {
              setPw2(e.target.value);
              setHash(null);
            }}
          />
        </label>
      </div>
      {warn ? <p className="mt-2 text-[0.8125rem] font-medium text-amber-800">{warn}</p> : null}
      {mismatch ? <p className="mt-2 text-[0.8125rem] font-medium text-red-700">Die beiden Eingaben stimmen nicht überein.</p> : null}
      <button
        type="button"
        className={cn(adminButton("primary"), "mt-4")}
        disabled={!pw || pw !== pw2 || warn !== null || busy}
        onClick={async () => {
          setBusy(true);
          try {
            setHash(await hashPassword(pw));
          } finally {
            setBusy(false);
          }
        }}
      >
        {busy ? "Wird berechnet …" : "Hash erzeugen"}
      </button>
      {hash ? <CopyValue name="ADMIN_PASSWORD_HASH" value={hash} /> : null}
    </Step>
  );
}
