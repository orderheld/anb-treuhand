import Link from "next/link";
import { AlertTriangle, CheckCircle2, Info, XCircle } from "lucide-react";
import { hyphenate } from "@/lib/hyphenate";
import { cn } from "@/lib/utils";

/**
 * Building blocks of the admin area: calm and functional, in the style of the website (white
 * cards on light grey, Tannengrün for actions, green accents).
 */

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
type ButtonSize = "md" | "sm";

export function adminButton(variant: ButtonVariant = "primary", size: ButtonSize = "md", className?: string): string {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors disabled:pointer-events-none disabled:opacity-60",
    size === "md" ? "min-h-11 px-5 text-[0.9375rem]" : "min-h-9 px-4 text-sm",
    variant === "primary" && "bg-forest text-white hover:bg-forest-deep",
    variant === "secondary" && "border border-line-strong bg-white text-ink hover:bg-mist",
    variant === "danger" && "border border-red-200 bg-white text-red-800 hover:border-red-300 hover:bg-red-50",
    variant === "ghost" && "text-ink hover:bg-mist",
    className,
  );
}

export function AdminLinkButton({
  href,
  children,
  variant,
  size,
  className,
}: {
  href: string;
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}) {
  return (
    <Link href={href} className={adminButton(variant, size, className)}>
      {children}
    </Link>
  );
}

export function PageHeader({ eyebrow, title, children, actions }: { eyebrow?: string; title: string; children?: React.ReactNode; actions?: React.ReactNode }) {
  return (
    <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow ? <p className="kicker">{eyebrow}</p> : null}
        <h1 className={cn("text-[2rem] font-semibold leading-tight tracking-[-0.018em] text-ink", eyebrow && "mt-1.5")}>{hyphenate(title)}</h1>
        {children ? <div className="mt-2 max-w-2xl text-[0.9375rem] leading-relaxed text-muted">{children}</div> : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap gap-2">{actions}</div> : null}
    </header>
  );
}

export function Card({
  title,
  description,
  actions,
  children,
  className,
  id,
}: {
  title?: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={cn("rounded-card border border-line bg-white p-5 sm:p-6", className)}>
      {title || actions ? (
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            {title ? <h2 className="text-[1.0625rem] font-semibold text-ink">{title}</h2> : null}
            {description ? <p className="mt-1 text-sm leading-relaxed text-muted">{description}</p> : null}
          </div>
          {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
        </div>
      ) : null}
      {children ? <div className={cn(title || actions ? "mt-5" : null)}>{children}</div> : null}
    </section>
  );
}

const noticeTones = {
  info: { box: "border-accent-line bg-accent-soft text-ink", icon: Info, iconClass: "text-accent" },
  success: { box: "border-emerald-200 bg-emerald-50 text-emerald-950", icon: CheckCircle2, iconClass: "text-emerald-700" },
  warning: { box: "border-amber-200 bg-amber-50 text-amber-950", icon: AlertTriangle, iconClass: "text-amber-700" },
  danger: { box: "border-red-200 bg-red-50 text-red-950", icon: XCircle, iconClass: "text-red-700" },
};

export function Notice({ tone = "info", title, children, className }: { tone?: keyof typeof noticeTones; title?: string; children?: React.ReactNode; className?: string }) {
  const t = noticeTones[tone];
  const Icon = t.icon;
  return (
    <div className={cn("flex gap-3 rounded-field border px-4 py-3 text-sm leading-relaxed", t.box, className)}>
      <Icon aria-hidden className={cn("mt-0.5 size-4 shrink-0", t.iconClass)} />
      <div className="min-w-0">
        {title ? <p className="font-semibold">{title}</p> : null}
        {children ? <div className={cn(title && "mt-1")}>{children}</div> : null}
      </div>
    </div>
  );
}

const pillTones = {
  neu: "bg-accent-soft text-accent",
  in_bearbeitung: "bg-sky-100 text-sky-900",
  erledigt: "bg-emerald-100 text-emerald-900",
  ok: "bg-emerald-100 text-emerald-900",
  warning: "bg-amber-100 text-amber-900",
  neutral: "bg-mist text-muted",
  danger: "bg-red-100 text-red-900",
};

export type PillTone = keyof typeof pillTones;

export function Pill({ tone = "neutral", children }: { tone?: PillTone; children: React.ReactNode }) {
  return <span className={cn("inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium", pillTones[tone])}>{children}</span>;
}

/** Label and value pairs, e.g. the details of a request. */
export function DetailList({ rows, className }: { rows: { label: string; value: React.ReactNode }[]; className?: string }) {
  return (
    <dl className={cn("divide-y divide-line", className)}>
      {rows.map((row) => (
        <div key={row.label} className="grid gap-1 py-2.5 text-[0.9375rem] sm:grid-cols-[12rem_1fr] sm:gap-4">
          <dt className="text-muted">{row.label}</dt>
          <dd className="min-w-0 break-words text-ink">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}
