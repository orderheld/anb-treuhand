"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { ArrowRight, Mail, Menu, Phone, X } from "lucide-react";
import { mainNav, primaryCta } from "@/content/navigation";
import { cn } from "@/lib/utils";
import { isActive } from "./nav-links";

export function MobileNav({ phone, phoneHref, email }: { phone: string | null; phoneHref: string | null; email: string }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const panelId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // The panel covers the page: take main content and footer out of the tab order and the
    // accessibility tree while it is open, so focus never lands on something hidden behind it.
    const behind = Array.from(document.querySelectorAll<HTMLElement>("#inhalt, #inhalt ~ footer"));
    behind.forEach((el) => el.setAttribute("inert", ""));
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      behind.forEach((el) => el.removeAttribute("inert"));
      window.removeEventListener("keydown", onKey);
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
        className="-mr-2 inline-flex size-11 items-center justify-center rounded-full text-cream transition-colors hover:bg-cream/10"
      >
        <span className="sr-only">{open ? "Menü schliessen" : "Menü öffnen"}</span>
        {open ? <X aria-hidden className="size-6" strokeWidth={1.5} /> : <Menu aria-hidden className="size-6" strokeWidth={1.5} />}
      </button>
      <div id={panelId} hidden={!open} className="grain fixed inset-x-0 bottom-0 top-[4.25rem] z-40 overflow-y-auto bg-forest-deep">
        <nav aria-label="Hauptnavigation mobil" className="relative flex min-h-full flex-col px-6 pb-10 pt-6 sm:px-10">
          <ul className="divide-y divide-cream/10 border-y border-cream/10">
            {[{ href: "/", label: "Startseite" }, ...mainNav].map((item) => {
              const active = item.href === "/" ? pathname === "/" : isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={close}
                    aria-current={active ? "page" : undefined}
                    className={cn("flex items-center justify-between py-4 font-serif text-[1.75rem] leading-tight", active ? "text-copper" : "text-cream")}
                  >
                    {item.label}
                    <ArrowRight aria-hidden className="size-5 text-cream/40" strokeWidth={1.25} />
                  </Link>
                </li>
              );
            })}
          </ul>
          <Link
            href={primaryCta.href}
            onClick={close}
            className="mt-8 flex min-h-14 items-center justify-center rounded-full bg-copper px-6 font-medium text-forest-deep transition-colors hover:bg-copper-light"
          >
            {primaryCta.label}
          </Link>
          <div className="mt-auto space-y-3 pt-10 text-cream/80">
            {phone && phoneHref ? (
              <a href={phoneHref} className="flex items-center gap-3 hover:text-copper">
                <Phone aria-hidden className="size-4 text-copper" strokeWidth={1.5} />
                {phone}
              </a>
            ) : null}
            <a href={`mailto:${email}`} className="flex items-center gap-3 hover:text-copper">
              <Mail aria-hidden className="size-4 text-copper" strokeWidth={1.5} />
              {email}
            </a>
          </div>
        </nav>
      </div>
    </div>
  );
}
