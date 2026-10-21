import { Camera, Check, CircleAlert, FileText, Upload } from "lucide-react";
import { Logo } from "@/components/brand/logo";

/**
 * Illustration of the planned customer portal on a phone, drawn in HTML so it stays sharp and
 * matches the brand. Purely decorative: the feature list next to it carries the content.
 */
export function PhoneMockup({ className }: { className?: string }) {
  const documents = [
    { name: "Lohnausweis 2026", meta: "Heute, 09.12", state: "ok" },
    { name: "Säule 3a Bescheinigung", meta: "Gestern", state: "ok" },
    { name: "Kontoauszug Dezember", meta: "Noch offen", state: "open" },
  ] as const;

  return (
    <div aria-hidden className={className}>
      <div className="relative mx-auto w-[17.5rem] rounded-[2.75rem] bg-[#0d1d15] p-2.5 shadow-[0_40px_90px_-30px_rgb(0_0_0/0.7),inset_0_0_0_1px_rgb(255_255_255/0.08)] sm:w-[19rem]">
        <div className="relative overflow-hidden rounded-[2.25rem] bg-cream">
          {/* Status bar and camera notch */}
          <div className="flex items-center justify-between px-6 pb-1 pt-3 text-[0.625rem] font-medium text-forest">
            <span className="tabular">9:41</span>
            <span className="absolute left-1/2 top-2.5 h-5 w-20 -translate-x-1/2 rounded-full bg-[#0d1d15]" />
            <span className="flex items-center gap-1">
              <span className="h-2 w-3 rounded-[2px] border border-forest/70" />
            </span>
          </div>

          <div className="px-5 pb-6 pt-4">
            <div className="flex items-center justify-between">
              <Logo variant="horizontal" tone="dark" decorative className="h-4 w-auto" />
              <span className="flex size-7 items-center justify-center rounded-full bg-forest font-serif text-[0.625rem] text-cream">MK</span>
            </div>

            <p className="mt-5 font-serif text-[1.375rem] leading-tight text-ink">Guten Tag, Frau Keller</p>
            <p className="mt-1 text-[0.6875rem] text-muted">Steuererklärung 2026</p>

            <div className="mt-4 rounded-2xl bg-forest p-4 text-cream">
              <div className="flex items-baseline justify-between">
                <span className="text-[0.625rem] uppercase tracking-[0.2em] text-copper">Unterlagen</span>
                <span className="font-serif text-lg tabular">4 von 5</span>
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-cream/15">
                <div className="h-full w-4/5 rounded-full bg-copper" />
              </div>
              <p className="mt-2.5 text-[0.625rem] text-cream/70">Es fehlt noch ein Dokument.</p>
            </div>

            <ul className="mt-4 space-y-2">
              {documents.map((d) => (
                <li key={d.name} className="flex items-center gap-3 rounded-xl bg-white px-3 py-2.5 shadow-[0_1px_2px_rgb(20_42_31/0.06)]">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-cream text-forest">
                    <FileText className="size-3.5" strokeWidth={1.5} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[0.6875rem] font-medium text-ink">{d.name}</span>
                    <span className="block text-[0.5625rem] text-muted">{d.meta}</span>
                  </span>
                  {d.state === "ok" ? (
                    <Check className="size-3.5 text-forest" strokeWidth={2.25} />
                  ) : (
                    <CircleAlert className="size-3.5 text-bronze" strokeWidth={2} />
                  )}
                </li>
              ))}
            </ul>

            <div className="mt-4 grid grid-cols-[1fr_auto] gap-2">
              <span className="flex h-10 items-center justify-center gap-2 rounded-full bg-copper text-[0.6875rem] font-medium text-forest-deep">
                <Camera className="size-3.5" strokeWidth={1.75} />
                Beleg fotografieren
              </span>
              <span className="flex size-10 items-center justify-center rounded-full border border-forest/20 text-forest">
                <Upload className="size-3.5" strokeWidth={1.75} />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
