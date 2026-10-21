import { cn } from "@/lib/utils";

/**
 * White bar with a fine line below, slightly translucent over the page while it scrolls. The blur
 * sits on a pseudo-element: backdrop-filter on the header itself would become the containing block
 * of positioned descendants such as the mobile menu.
 */
export function HeaderShell({ children }: { children: React.ReactNode }) {
  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-line",
        "before:absolute before:inset-0 before:-z-10 before:bg-white/85 before:backdrop-blur-xl before:backdrop-saturate-[1.8]",
      )}
    >
      {children}
    </header>
  );
}
