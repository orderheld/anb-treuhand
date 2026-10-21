"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { mainNav } from "@/content/navigation";
import { cn } from "@/lib/utils";

export function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`) || (href === "/leistungen" && pathname.startsWith("/leistungen"));
}

export function DesktopNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Hauptnavigation" className="hidden lg:block">
      <ul className="flex items-center gap-1 xl:gap-2">
        {mainNav.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative block whitespace-nowrap px-3 py-2 text-[0.9375rem] tracking-[0.02em] text-cream/75 transition-colors duration-300 hover:text-cream",
                  "after:absolute after:inset-x-3 after:bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-copper after:transition-transform after:duration-500 after:ease-out-soft hover:after:scale-x-100",
                  active && "text-cream after:scale-x-100",
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
