import Link from "next/link";
import { ExternalLink, LogOut } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { AdminNavLinks } from "@/components/admin/nav-links";
import { requireAdmin } from "@/lib/admin/auth/session";
import { requestCounts } from "@/lib/admin/requests";
import { logout } from "../actions";

/** Every page behind the login: header with navigation, then the page. */
export default async function AdminAppLayout({ children }: LayoutProps<"/admin">) {
  await requireAdmin();
  const counts = await requestCounts();
  return (
    <>
      <header className="bg-forest text-cream">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-x-4 gap-y-3 px-4 py-3 sm:gap-x-6 sm:px-6">
          <Link href="/admin" className="flex items-center gap-3" aria-label="Admin ANB Treuhand, Übersicht">
            <Logo variant="horizontal" tone="light" decorative className="h-6 w-auto sm:h-7" />
            <span className="hidden text-xs uppercase tracking-[0.22em] text-copper sm:inline">Admin</span>
          </Link>
          <nav aria-label="Admin" className="order-last w-full sm:order-none sm:w-auto sm:flex-1">
            <AdminNavLinks newRequests={counts.neu} />
          </nav>
          <div className="ml-auto flex items-center gap-1">
            <a
              href="/"
              target="_blank"
              rel="noopener"
              className="hidden min-h-10 items-center gap-2 rounded-full px-3 text-sm text-cream/80 transition-colors hover:bg-white/10 hover:text-cream min-[360px]:inline-flex"
            >
              <ExternalLink aria-hidden className="size-4" />
              <span className="hidden md:inline">Website</span>
              <span className="sr-only md:hidden">Website ansehen</span>
            </a>
            <form action={logout}>
              <button
                type="submit"
                className="inline-flex min-h-10 items-center gap-2 rounded-full px-3 text-sm text-cream/80 transition-colors hover:bg-white/10 hover:text-cream"
              >
                <LogOut aria-hidden className="size-4" />
                Abmelden
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-10">{children}</main>
    </>
  );
}
