import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Icon } from "@/components/ui/icon";
import { PageHeader } from "@/components/admin/ui";
import { calculators } from "@/content/calculators";
import { requireAdmin } from "@/lib/admin/auth/session";
import { tariffsUpdatedAt } from "@/lib/admin/tariffs";
import { tariffRegistry } from "@/lib/tariffs/registry";
import { formatDay } from "@/lib/admin/format";
import { hyphenate } from "@/lib/hyphenate";

export const metadata: Metadata = { title: "Tarife" };
export const instant = false;

export default async function TariffsPage() {
  await requireAdmin();
  const updated = await tariffsUpdatedAt();
  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Tarife" title="Preise der Rechner">
        <p>Hier legen Sie fest, womit die drei Rechner auf der Website rechnen. Die Website und die Offertanfragen verwenden immer die gespeicherten Werte.</p>
      </PageHeader>
      <ul className="grid gap-4 md:grid-cols-3">
        {calculators.map((c) => {
          const at = updated[c.slug];
          return (
            <li key={c.slug}>
              <Link
                href={`/admin/tarife/${c.slug}`}
                className="group flex h-full flex-col rounded-2xl border border-line bg-white p-6 transition-colors hover:border-forest/40"
              >
                <span aria-hidden className="flex size-11 items-center justify-center rounded-full bg-forest text-copper">
                  <Icon name={c.icon} className="size-5" />
                </span>
                <span className="mt-5 font-serif text-[1.375rem] leading-tight text-ink">{hyphenate(tariffRegistry[c.slug].title)}</span>
                <span className="mt-1 text-sm text-muted">{tariffRegistry[c.slug].fields.length} Werte</span>
                <span className="mt-4 text-sm text-ink">{at ? `Angepasst am ${formatDay(at)}` : "Standardwerte"}</span>
                <span className="mt-auto flex items-center gap-2 pt-6 text-sm font-medium text-forest">
                  Tarife bearbeiten
                  <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
