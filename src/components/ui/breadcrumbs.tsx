import Link from "next/link";
import { ChevronRight } from "lucide-react";

/** Breadcrumb trail for the dark page heroes. The last item is the current page. */
export function Breadcrumbs({ items }: { items: { name: string; path: string }[] }) {
  return (
    <nav aria-label="Brotkrümelnavigation" className="text-sm">
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-cream/60">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={item.path} className="flex items-center gap-1.5">
              {last ? (
                <span aria-current="page" className="text-cream/90">
                  {item.name}
                </span>
              ) : (
                <>
                  <Link href={item.path} className="transition-colors hover:text-copper">
                    {item.name}
                  </Link>
                  <ChevronRight aria-hidden className="size-3.5 text-cream/35" strokeWidth={1.5} />
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
