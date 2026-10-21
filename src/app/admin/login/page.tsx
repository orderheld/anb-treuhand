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
    <main className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <Logo variant="stacked" className="mx-auto" />
        <div className="mt-10 rounded-panel bg-white p-6 shadow-card sm:p-8">
          <h1 className="text-[1.75rem] font-semibold leading-tight tracking-[-0.018em] text-ink">Admin-Bereich</h1>
          <p className="mb-6 mt-2 text-sm leading-relaxed text-muted">Zugang mit Passwort und Code aus der Authenticator-App. Jede Anmeldung wird protokolliert.</p>
          <LoginForm next={next} />
        </div>
      </div>
    </main>
  );
}
