import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { Logo } from "@/components/brand/logo";
import { safeAdminTarget } from "@/lib/admin/auth/login";
import { getAdminSession } from "@/lib/admin/auth/session";
import { isAdminConfigured } from "@/lib/admin/env";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Anmelden" };
export const instant = false;

export default async function LoginPage({ searchParams }: PageProps<"/admin/login">) {
  await connection();
  if (!isAdminConfigured()) redirect("/admin/einrichtung");
  const params = await searchParams;
  const next = typeof params.next === "string" ? safeAdminTarget(params.next) : undefined;
  if (await getAdminSession()) redirect(next ?? "/admin");

  return (
    <main className="flex flex-1 items-center justify-center bg-forest px-4 py-16">
      <div className="w-full max-w-sm">
        <Logo variant="stacked" tone="light" className="mx-auto w-36" />
        <div className="mt-10 rounded-2xl bg-white p-6 shadow-float sm:p-8">
          <h1 className="font-serif text-[1.75rem] leading-tight text-ink">Admin-Bereich</h1>
          <p className="mb-6 mt-2 text-sm leading-relaxed text-muted">Zugang mit Passwort und Code aus der Authenticator-App. Jede Anmeldung wird protokolliert.</p>
          <LoginForm next={next} />
        </div>
      </div>
    </main>
  );
}
