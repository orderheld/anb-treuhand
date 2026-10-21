"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * The header floats transparent over the green hero and turns into a solid, blurred bar once the
 * page scrolls. Only this state needs JavaScript; without it the header stays readable on green.
 */
export function HeaderShell({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 24);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <header
      data-scrolled={scrolled || undefined}
      className={cn(
        "on-dark group/header fixed inset-x-0 top-0 z-50 text-cream transition-[background-color,box-shadow,border-color] duration-500 ease-out-soft",
        // The blur sits on a pseudo-element: backdrop-filter on the header itself would become
        // the containing block of the fixed mobile menu panel.
        "border-b border-transparent before:absolute before:inset-0 before:-z-10 before:opacity-0 before:transition-opacity before:duration-500",
        "before:bg-forest-deep/85 before:backdrop-blur-xl data-[scrolled]:border-cream/[0.08] data-[scrolled]:before:opacity-100",
      )}
    >
      {children}
    </header>
  );
}
