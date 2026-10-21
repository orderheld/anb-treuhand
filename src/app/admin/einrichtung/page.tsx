import type { Metadata } from "next";
import { connection } from "next/server";
import { CheckCircle2, CircleAlert, KeyRound, Smartphone } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { AdminLinkButton, Notice } from "@/components/admin/ui";
import { getAdminSession } from "@/lib/admin/auth/session";
import { adminConfigStatus, isAdminConfigured } from "@/lib/admin/env";
import { SetupGenerator } from "./setup-generator";

export const metadata: Metadata = { title: "Einrichtung" };
export const instant = false;

const code = "rounded bg-mist px-1 py-0.5 font-mono text-[0.8125rem] text-ink";

export default async function SetupPage() {
  await connection();
  const configured = isAdminConfigured();
  const session = configured ? await getAdminSession() : null;

  if (configured && !session) {
    return (
      <main className="flex flex-1 items-center justify-center bg-forest px-4 py-16">
        <div className="w-full max-w-sm text-center">
          <Logo variant="stacked" tone="light" className="mx-auto w-36" />
          <p className="mt-10 text-cream/80">Der Admin-Bereich ist eingerichtet.</p>
          <AdminLinkButton href="/admin/login" variant="secondary" className="mt-5">
            Zur Anmeldung
          </AdminLinkButton>
        </div>
      </main>
    );
  }

  const status = adminConfigStatus();
  const set = (name: string) => status.some((item) => item.name === name && item.ok);
  const statusList = (
    <ul className="mt-6 divide-y divide-line rounded-2xl border border-line bg-white">
      {status.map((item) => (
        <li key={item.name} className="flex flex-wrap items-center gap-3 px-4 py-3 text-sm">
          {item.ok ? <CheckCircle2 aria-hidden className="size-5 text-emerald-600" /> : <CircleAlert aria-hidden className="size-5 text-amber-600" />}
          <span className="flex-1 text-ink">{item.label}</span>
          <code className="font-mono text-xs text-muted">{item.name}</code>
          <span className="sr-only">{item.ok ? "gesetzt" : "fehlt"}</span>
        </li>
      ))}
    </ul>
  );

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-12">
      <Logo variant="horizontal" className="h-8 w-auto" />
      {configured ? (
        <>
          {/* Logged in and set up: only what can be changed. */}
          <h1 className="mt-10 font-serif text-[2rem] leading-tight text-ink">Einrichtung</h1>
          <p className="mt-2 text-muted">Der Admin-Bereich ist eingerichtet. Die Zugangsdaten stehen als Umgebungsvariablen bei Vercel, nicht im Code.</p>
          {statusList}

          <section className="mt-6 rounded-2xl border border-line bg-white p-5 text-sm leading-relaxed text-muted sm:p-6">
            <h2 className="flex items-center gap-2 text-[1.0625rem] font-medium text-ink">
              <KeyRound aria-hidden className="size-4 text-bronze" />
              Passwort ändern
            </h2>
            <p className="mt-2">
              Neuen Hash erzeugen, in Vercel <code className={code}>ADMIN_PASSWORD_HASH</code> damit ersetzen und das letzte Deployment neu starten (Redeploy). Danach gilt
              nur noch das neue Passwort, und alle Geräte sind abgemeldet.
            </p>
            <details className="mt-4 rounded-xl border border-line [&[open]>summary]:border-b [&[open]>summary]:border-line">
              <summary className="cursor-pointer select-none list-none rounded-xl px-4 py-2.5 text-sm font-medium text-forest hover:bg-mist [&::-webkit-details-marker]:hidden">
                Neuen Passwort-Hash erzeugen
              </summary>
              <div className="p-3">
                <SetupGenerator password totp={false} />
              </div>
            </details>
          </section>

          <section className="mt-6 rounded-2xl border border-line bg-white p-5 text-sm leading-relaxed text-muted sm:p-6">
            <h2 className="flex items-center gap-2 text-[1.0625rem] font-medium text-ink">
              <Smartphone aria-hidden className="size-4 text-bronze" />
              Neues Handy oder neuer Code-Schlüssel
            </h2>
            <p className="mt-2">
              Ein weiteres Handy braucht keinen neuen Schlüssel: Scannen Sie dort den bisherigen QR-Code. Ist ein Handy verloren, erzeugen Sie einen neuen
              Code-Schlüssel, scannen ihn auf allen Handys, ersetzen in Vercel <code className={code}>ADMIN_TOTP_SECRET</code> und starten das letzte Deployment neu. Auch das meldet alle Geräte ab.
            </p>
            <details className="mt-4 rounded-xl border border-line [&[open]>summary]:border-b [&[open]>summary]:border-line">
              <summary className="cursor-pointer select-none list-none rounded-xl px-4 py-2.5 text-sm font-medium text-forest hover:bg-mist [&::-webkit-details-marker]:hidden">
                Neuen Code-Schlüssel erzeugen
              </summary>
              <div className="p-3">
                <SetupGenerator password={false} totp />
              </div>
            </details>
          </section>

          <AdminLinkButton href="/admin" className="mt-8">
            Zurück zur Übersicht
          </AdminLinkButton>
        </>
      ) : (
        <>
          <h1 className="mt-10 font-serif text-[2rem] leading-tight text-ink">Admin-Bereich einrichten</h1>
          <p className="mt-2 leading-relaxed text-muted">
            Hier passen Sie die Tarife der Preisrechner an und sehen die Anfragen. Es gibt einen gemeinsamen Zugang mit Passwort und dem Code aus einer
            Authenticator-App; registrieren kann sich niemand. Die Zugangsdaten stehen nicht im Code, sondern als Umgebungsvariablen bei Vercel.
          </p>
          {statusList}

          <Notice title="So geht es" className="mt-6">
            <ol className="mt-1 list-decimal space-y-1 pl-5">
              <li>
                <code className={code}>DATABASE_URL</code>: der Connection String der Neon-Datenbank (Region Frankfurt), in Vercel für Production eingetragen.
              </li>
              <li>Unten die fehlenden Werte erzeugen. Den QR-Code scannen Sie mit der Authenticator-App.</li>
              <li>
                In Vercel unter <strong>Settings → Environment Variables</strong> jeden Wert für <em>Production</em> eintragen und als <em>Sensitive</em> markieren.
              </li>
              <li>
                Unter <strong>Deployments</strong> das letzte Deployment neu starten (Redeploy). Sobald alle drei Werte gesetzt sind, ist die Anmeldung aktiv.
              </li>
            </ol>
          </Notice>

          <div className="mt-6">
            <SetupGenerator password={!set("ADMIN_PASSWORD_HASH")} totp={!set("ADMIN_TOTP_SECRET")} />
          </div>
        </>
      )}
    </main>
  );
}
