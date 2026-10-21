"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { KeyRound, RefreshCw, Smartphone } from "lucide-react";
import { CopyButton } from "@/components/admin/copy-button";
import { inputClass } from "@/components/admin/form";
import { adminButton } from "@/components/admin/ui";
import { cn } from "@/lib/utils";

/**
 * Generates the values of the Vercel environment variables in the browser. Nothing typed here
 * is sent to the server: the password is hashed locally with PBKDF2 (WebCrypto).
 */

const ITERATIONS = 600_000;
const BASE32 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

function base64url(bytes: Uint8Array): string {
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base32(bytes: Uint8Array): string {
  let bits = 0;
  let value = 0;
  let out = "";
  for (const b of bytes) {
    value = (value << 8) | b;
    bits += 8;
    while (bits >= 5) {
      out += BASE32[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) out += BASE32[(value << (5 - bits)) & 31];
  return out;
}

function base32Decode(input: string): Uint8Array<ArrayBuffer> {
  let bits = 0;
  let value = 0;
  const out: number[] = [];
  for (const c of input.toUpperCase().replace(/[^A-Z2-7]/g, "")) {
    value = (value << 5) | BASE32.indexOf(c);
    bits += 5;
    if (bits >= 8) {
      out.push((value >>> (bits - 8)) & 0xff);
      bits -= 8;
    }
  }
  return new Uint8Array(out);
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

async function totpNow(secret: string, offset = 0): Promise<string> {
  const counter = Math.floor(Date.now() / 30_000) + offset;
  const msg = new Uint8Array(8);
  new DataView(msg.buffer).setBigUint64(0, BigInt(counter));
  const key = await crypto.subtle.importKey("raw", base32Decode(secret), { name: "HMAC", hash: "SHA-1" }, false, ["sign"]);
  const mac = new Uint8Array(await crypto.subtle.sign("HMAC", key, msg));
  const o = mac[mac.length - 1] & 0x0f;
  const bin = (((mac[o] & 0x7f) << 24) | (mac[o + 1] << 16) | (mac[o + 2] << 8) | mac[o + 3]) % 1_000_000;
  return String(bin).padStart(6, "0");
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

/** The generators for the values that are still missing. */
export function SetupGenerator({ password, totp: showTotp }: { password: boolean; totp: boolean }) {
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [hash, setHash] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [totp, setTotp] = useState<string | null>(null);
  const [qr, setQr] = useState<string | null>(null);
  const [test, setTest] = useState("");
  const [testResult, setTestResult] = useState<boolean | null>(null);

  useEffect(() => {
    if (!totp) return;
    const uri = `otpauth://totp/ANB%20Treuhand:Admin?secret=${totp}&issuer=ANB%20Treuhand&algorithm=SHA1&digits=6&period=30`;
    QRCode.toDataURL(uri, { margin: 1, width: 220, errorCorrectionLevel: "M" }).then(setQr, () => setQr(null));
  }, [totp]);

  const warn = weakness(pw);
  const mismatch = pw2.length > 0 && pw !== pw2;
  const numbered = password && showTotp;

  return (
    <div className="space-y-4">
      {password ? (
        <Step icon={KeyRound} title={numbered ? "1. Passwort festlegen" : "Passwort festlegen"}>
          <p>Das Passwort wird hier im Browser in einen Hash umgerechnet. Nur der Hash kommt zu Vercel, das Passwort selbst wird nirgends gespeichert.</p>
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
            disabled={!pw || pw !== pw2 || busy}
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
      ) : null}

      {showTotp ? (
        <Step icon={Smartphone} title={numbered ? "2. Zwei-Faktor-Code einrichten" : "Zwei-Faktor-Code einrichten"}>
          <p>Die Anmeldung verlangt immer zwei Dinge: das Passwort und den sechsstelligen Code aus einer Authenticator-App. Ein erratenes Passwort allein reicht so nicht.</p>
          <ol className="mt-2 list-decimal space-y-1 pl-5">
            <li>Google Authenticator oder Microsoft Authenticator aus dem App Store oder Google Play installieren.</li>
            <li>Hier den Code-Schlüssel erzeugen.</li>
            <li>In der App auf «+» tippen, «QR-Code scannen» wählen und den QR-Code scannen. Wer ebenfalls Zugang braucht, scannt denselben Code auf dem eigenen Handy.</li>
            <li>Den Code, den die App jetzt zeigt, unten prüfen.</li>
          </ol>
          <button
            type="button"
            className={cn(adminButton("secondary"), "mt-4")}
            onClick={() => {
              setTotp(base32(random(20)));
              setTest("");
              setTestResult(null);
            }}
          >
            <RefreshCw aria-hidden className="size-4" />
            {totp ? "Neu erzeugen" : "Code-Schlüssel erzeugen"}
          </button>
          {totp ? (
            <div className="mt-4 grid gap-4 sm:grid-cols-[auto_1fr] sm:items-start">
              {qr ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={qr} alt="QR-Code für die Authenticator-App" width={220} height={220} className="rounded-xl border border-line" />
              ) : null}
              <div className="min-w-0">
                <p id="totp-test-hint">Code aus der App hier prüfen:</p>
                <div className="mt-2 flex gap-2">
                  <input
                    aria-label="Code aus der Authenticator-App"
                    aria-describedby="totp-test-hint"
                    autoComplete="off"
                    maxLength={7}
                    className={cn(inputClass, "w-32")}
                    inputMode="numeric"
                    placeholder="123456"
                    value={test}
                    onChange={(e) => {
                      setTest(e.target.value);
                      setTestResult(null);
                    }}
                  />
                  <button
                    type="button"
                    className={adminButton("secondary")}
                    onClick={async () => {
                      const code = test.replace(/\s/g, "");
                      const valid = await Promise.all([-1, 0, 1].map((o) => totpNow(totp, o)));
                      setTestResult(valid.includes(code));
                    }}
                  >
                    Prüfen
                  </button>
                </div>
                {testResult === true ? <p className="mt-2 text-[0.8125rem] font-medium text-emerald-700">Der Code stimmt. Die App ist richtig eingerichtet.</p> : null}
                {testResult === false ? (
                  <p className="mt-2 text-[0.8125rem] font-medium text-red-700">Der Code stimmt nicht. Prüfen Sie die Uhrzeit des Handys und scannen Sie den QR-Code nochmals.</p>
                ) : null}
                <CopyValue name="ADMIN_TOTP_SECRET" value={totp} />
              </div>
            </div>
          ) : null}
        </Step>
      ) : null}
    </div>
  );
}
