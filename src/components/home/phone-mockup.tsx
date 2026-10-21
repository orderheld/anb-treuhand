import { Camera, Check, CircleAlert, FileText } from "lucide-react";
import { Logo } from "@/components/brand/logo";

/**
 * Illustration of the planned customer portal on a phone, drawn in HTML so it stays sharp. Purely
 * decorative: the feature list next to it carries the content.
 */
export function PhoneMockup({ className }: { className?: string }) {
  const documents = [
    { name: "Lohnausweis 2026", meta: "Heute, 09.12", state: "ok" },
    { name: "Säule 3a Bescheinigung", meta: "Gestern", state: "ok" },
    { name: "Kontoauszug Dezember", meta: "Noch offen", state: "open" },
  ] as const;

  return (
    <div aria-hidden className={className}>
      <div className="relative mx-auto w-[17.5rem] rounded-[3rem] bg-[#1d1d1f] p-[0.6875rem] shadow-[0_24px_64px_rgb(0_0_0/0.13),inset_0_0_0_2px_#3a3a3c] sm:w-[18.75rem]">
        <span className="absolute left-1/2 top-5 z-10 h-[1.625rem] w-[5.75rem] -translate-x-1/2 rounded-full bg-[#1d1d1f]" />
        <div className="overflow-hidden rounded-[2.375rem] bg-mist px-4 pb-5 pt-14">
          <div className="flex items-center justify-between">
            <Logo variant="signet" decorative />
            <span className="flex size-7 items-center justify-center rounded-full bg-accent-soft text-[0.625rem] font-semibold text-accent">MK</span>
          </div>

          <p className="mt-5 text-[1.25rem] font-[650] leading-tight text-ink">Guten Tag, Frau Keller</p>
          <p className="mt-0.5 text-[0.6875rem] text-muted">Steuererklärung 2026</p>

          <div className="mt-4 rounded-2xl bg-white p-3.5 shadow-hairline">
            <div className="flex items-baseline justify-between">
              <span className="text-[0.6875rem] font-semibold text-ink">Unterlagen</span>
              <span className="text-[0.75rem] font-semibold text-accent tabular">4 von 5</span>
            </div>
            <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-mist-deep">
              <div className="h-full w-4/5 rounded-full bg-accent" />
            </div>
            <p className="mt-2 text-[0.625rem] text-muted">Es fehlt noch ein Dokument.</p>
          </div>

          <ul className="mt-3 space-y-2">
            {documents.map((d) => (
              <li key={d.name} className="flex items-center gap-2.5 rounded-xl bg-white px-3 py-2.5 shadow-hairline">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent">
                  <FileText className="size-3.5" strokeWidth={1.75} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[0.6875rem] font-medium text-ink">{d.name}</span>
                  <span className="block text-[0.5625rem] text-muted">{d.meta}</span>
                </span>
                {d.state === "ok" ? (
                  <Check className="size-3.5 text-ok" strokeWidth={2.5} />
                ) : (
                  <CircleAlert className="size-3.5 text-warn" strokeWidth={2} />
                )}
              </li>
            ))}
          </ul>

          <span className="mt-4 flex h-10 items-center justify-center gap-2 rounded-full bg-forest text-[0.6875rem] font-semibold text-white">
            <Camera className="size-3.5" strokeWidth={2} />
            Beleg fotografieren
          </span>
        </div>
      </div>
    </div>
  );
}
