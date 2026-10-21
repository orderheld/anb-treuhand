import Link from "next/link";
import { ChevronRight } from "lucide-react";

/** Breadcrumb trail above page titles. The last item is the current page. */
export function Breadcrumbs({ items }: { items: { name: string; path: string }[] }) {
  return (
    <nav aria-label="Brotkrümelnavigation" className="text-sm">
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-muted">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={item.path} className="flex items-center gap-1.5">
              {last ? (
                <span aria-current="page" className="text-body">
                  {item.name}
                </span>
              ) : (
                <>
                  <Link href={item.path} className="transition-colors hover:text-ink">
                    {item.name}
                  </Link>
                  <ChevronRight aria-hidden className="size-3.5 text-line-strong" strokeWidth={2} />
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
