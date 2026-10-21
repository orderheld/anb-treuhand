"use client";

import Link, { useLinkStatus } from "next/link";
import { usePathname } from "next/navigation";
import { Inbox, LayoutGrid, ShieldCheck, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/admin", label: "Übersicht", icon: LayoutGrid },
  { href: "/admin/tarife", label: "Tarife", icon: SlidersHorizontal },
  { href: "/admin/anfragen", label: "Anfragen", icon: Inbox },
  { href: "/admin/sicherheit", label: "Sicherheit", icon: ShieldCheck },
];

function isActive(pathname: string, href: string): boolean {
  return href === "/admin" ? pathname === "/admin" : pathname === href || pathname.startsWith(`${href}/`);
}

/** Admin pages render per request, so a navigation can take a moment: a green line shows it. */
function PendingHint() {
  const { pending } = useLinkStatus();
  return (
    <span
      aria-hidden
      className={cn("pointer-events-none absolute inset-x-4 bottom-1 h-0.5 rounded-full bg-accent opacity-0 transition-opacity", pending && "animate-pulse opacity-100")}
    />
  );
}

/** Four equal tabs with icons on phones, a row of pills from sm on. */
export function AdminNavLinks({ newRequests }: { newRequests: number }) {
  const pathname = usePathname();
  return (
    <ul className="grid grid-cols-4 gap-1 sm:flex">
      {items.map((item) => {
        const active = isActive(pathname, item.href);
        const Icon = item.icon;
        const badge = item.href === "/admin/anfragen" && newRequests > 0;
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "relative flex min-h-13 flex-col items-center justify-center gap-1 rounded-xl px-1 text-xs transition-colors sm:min-h-10 sm:flex-row sm:gap-2 sm:rounded-full sm:px-4 sm:text-[0.9375rem]",
                active ? "bg-mist font-semibold text-ink" : "text-body hover:bg-mist hover:text-ink",
              )}
            >
              <Icon aria-hidden className="size-[1.125rem] sm:hidden" strokeWidth={1.75} />
              {item.label}
              {badge ? (
                <span className="absolute right-[calc(50%-1.375rem)] top-1.5 min-w-4.5 rounded-full bg-accent px-1 text-center text-[0.6875rem] font-semibold leading-4.5 tabular text-white sm:static sm:min-w-0 sm:px-1.5 sm:text-xs sm:leading-normal">
                  {newRequests}
                  <span className="sr-only"> neu</span>
                </span>
              ) : null}
              <PendingHint />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
