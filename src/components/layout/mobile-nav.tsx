"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { ChevronRight, Mail, Menu, Phone, X } from "lucide-react";
import { mainNav, primaryCta } from "@/content/navigation";
import { cn } from "@/lib/utils";
import { isActive } from "./nav-links";

/** Menu button with a panel that drops down below the header on phones and tablets. */
export function MobileNav({ phone, phoneHref, email }: { phone: string | null; phoneHref: string | null; email: string }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const panelId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    const onPointer = (e: PointerEvent) => {
      const target = e.target as Node;
      if (!panelRef.current?.contains(target) && !buttonRef.current?.contains(target)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointer);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <div className="lg:hidden">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className="-mr-2 inline-flex size-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-mist"
      >
        <span className="sr-only">{open ? "Menü schliessen" : "Menü öffnen"}</span>
        {open ? <X aria-hidden className="size-5" strokeWidth={1.75} /> : <Menu aria-hidden className="size-5" strokeWidth={1.75} />}
      </button>
      <div
        ref={panelRef}
        id={panelId}
        hidden={!open}
        className="absolute inset-x-4 top-[calc(100%+0.5rem)] max-h-[calc(100dvh-5.5rem)] overflow-y-auto rounded-card border border-line bg-white p-2.5 shadow-lift sm:left-auto sm:w-80"
      >
        <nav aria-label="Hauptnavigation mobil">
          <ul>
            {[{ href: "/", label: "Startseite" }, ...mainNav].map((item) => {
              const active = item.href === "/" ? pathname === "/" : isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={close}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex items-center justify-between rounded-[0.625rem] px-3 py-3 text-[1.0625rem] transition-colors hover:bg-mist",
                      active ? "font-semibold text-accent" : "text-ink",
                    )}
                  >
                    {item.label}
                    <ChevronRight aria-hidden className="size-4 text-muted" strokeWidth={2} />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <Link
          href={primaryCta.href}
          onClick={close}
          className="mt-2 flex min-h-12 items-center justify-center rounded-full bg-forest px-6 font-semibold text-white transition-colors hover:bg-forest-deep"
        >
          {primaryCta.label}
        </Link>
        <div className="mt-2 grid gap-1 border-t border-line px-3 pb-1.5 pt-3 text-[0.9375rem] text-body">
          {phone && phoneHref ? (
            <a href={phoneHref} className="flex items-center gap-2.5 py-1 tabular hover:text-ink">
              <Phone aria-hidden className="size-4 text-accent" strokeWidth={1.75} />
              {phone}
            </a>
          ) : null}
          <a href={`mailto:${email}`} className="flex items-center gap-2.5 py-1 hover:text-ink">
            <Mail aria-hidden className="size-4 text-accent" strokeWidth={1.75} />
            {email}
          </a>
        </div>
      </div>
    </div>
  );
}
