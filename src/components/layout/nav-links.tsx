"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { mainNav } from "@/content/navigation";
import { cn } from "@/lib/utils";

export function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`) || (href === "/leistungen" && pathname.startsWith("/leistungen"));
}

/** Plain text links; the current section is marked by darker text and a fine green line. */
export function DesktopNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Hauptnavigation" className="hidden lg:block">
      <ul className="flex items-center gap-7">
        {mainNav.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative block whitespace-nowrap py-2 text-[0.9375rem] text-body transition-colors hover:text-ink",
                  "after:absolute after:inset-x-0 after:-bottom-[0.6875rem] after:h-0.5 after:rounded-full after:bg-accent after:opacity-0 after:transition-opacity",
                  active && "font-medium text-ink after:opacity-100",
                )}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
