import Link from "next/link";

/**
 * Renders plain text with "[Label](/pfad)" links, as used in FAQ answers. Internal paths use
 * next/link; nothing else is interpreted, so content stays safe from markup injection.
 */
export function RichText({ text }: { text: string }) {
  const parts: React.ReactNode[] = [];
  const pattern = /\[([^\]]+)\]\(([^)]+)\)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(text))) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    const [, label, href] = match;
    parts.push(
      href.startsWith("/") ? (
        <Link key={match.index} href={href} className="font-medium text-forest underline decoration-copper underline-offset-4 hover:decoration-2">
          {label}
        </Link>
      ) : (
        <a key={match.index} href={href} className="font-medium text-forest underline decoration-copper underline-offset-4 hover:decoration-2">
          {label}
        </a>
      ),
    );
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
}
