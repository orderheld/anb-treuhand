import {
  BookOpenCheck,
  Building2,
  Calculator,
  CalendarDays,
  ChartNoAxesCombined,
  Compass,
  FileText,
  Hammer,
  Handshake,
  House,
  KeyRound,
  MapPin,
  MessageSquare,
  ReceiptText,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Users,
  type LucideProps,
} from "lucide-react";
import type { IconName } from "@/content/types";

const icons = {
  book: BookOpenCheck,
  receipt: ReceiptText,
  building: Building2,
  users: Users,
  compass: Compass,
  home: House,
  hammer: Hammer,
  key: KeyRound,
  calculator: Calculator,
  shield: ShieldCheck,
  smartphone: Smartphone,
  handshake: Handshake,
  "map-pin": MapPin,
  sparkles: Sparkles,
  "file-text": FileText,
  chart: ChartNoAxesCombined,
  calendar: CalendarDays,
  message: MessageSquare,
} satisfies Record<IconName, React.ComponentType<LucideProps>>;

/** Line icon by name. Decorative by default. */
export function Icon({ name, strokeWidth = 1.75, ...props }: { name: IconName } & LucideProps) {
  const Component = icons[name];
  return <Component aria-hidden strokeWidth={strokeWidth} {...props} />;
}
