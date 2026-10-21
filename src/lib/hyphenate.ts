/**
 * Soft hyphens between the parts of long German compounds, for large headings on phones.
 *
 * Headings do not use the browser's automatic hyphenation: it also splits short words at a line
 * end ("Zah-len"), breaks compounds in the middle of a part ("Unternehmensbe-ratung") and
 * differs from browser to browser. Instead a long word gets break points only where its parts
 * meet, "Personal·administration" or "Sozial·versicherungs·abrechnungen". The browser uses a
 * break point only when the word does not fit on the line, so on a wide screen nothing changes.
 *
 * Display text only: metadata, e-mails and structured data keep the plain string.
 */

const SHY = "\u00AD";

/** Shorter words fit a phone line even in the largest heading. */
const MIN_WORD_LENGTH = 12;

/**
 * For headings up to about 26px (item titles, questions): only words this long can run out of a
 * phone line there. A lower limit would let the browser split words just to balance two lines.
 */
export const SMALL_HEADING = 20;

/** Fewest letters on either side of a break. */
const MIN_PART_LENGTH = 4;

/**
 * Parts of the compounds on this site, in lower case. A break goes before a part when at least
 * four letters stand on either side. A part inside a longer one is not a joint, so "abrechnung"
 * keeps "rechnung" whole. When a new long word appears in a heading, add its last part here;
 * hyphenate.test.ts names the words that still have no break.
 */
const PARTS = [
  "abnahme",
  "abrechnung",
  "abschluss",
  "abschlüsse",
  "abstimmung",
  "administration",
  "anbindung",
  "anmeldung",
  "anpassung",
  "arbeiten",
  "aufwertung",
  "ausschluss",
  "auswertung",
  "auszahlung",
  "beauftragte",
  "begleitung",
  "beratung",
  "beschränkung",
  "besitzende",
  "betrieb",
  "bewegung",
  "bilanz",
  "buchhaltung",
  "budget",
  "datei",
  "daten",
  "dokumentation",
  "eigentum",
  "eingänge",
  "einnahme",
  "einzahlung",
  "erklärung",
  "erstreckung",
  "ertrag",
  "familie",
  "fonds",
  "formular",
  "fortschritt",
  "führung",
  "gemeinschaft",
  "gerecht",
  "gesellschaft",
  "gesetz",
  "gespräch",
  "gründung",
  "haus",
  "honorar",
  "inkasso",
  "kasse",
  "klausel",
  "konto",
  "kontrolle",
  "koordination",
  "kosten",
  "leistung",
  "liegenschaft",
  "management",
  "mandat",
  "massnahme",
  "meldung",
  "methode",
  "optimierung",
  "pauschale",
  "pflicht",
  "planung",
  "preis",
  "projekt",
  "provision",
  "prozess",
  "rechner",
  "rechnung",
  "recht",
  "register",
  "salden",
  "sanierung",
  "satz",
  "schutz",
  "sicherheit",
  "software",
  "stellung",
  "steuer",
  "struktur",
  "taggeld",
  "tätigkeit",
  "übergabe",
  "umsatz",
  "unterhalt",
  "unterlagen",
  "unternehmen",
  "verkauf",
  "vermögen",
  "versammlung",
  "versicherung",
  "vertrag",
  "verträge",
  "verwaltung",
  "verzeichnis",
  "vorfall",
  "vorschau",
  "werkzeug",
  "wesen",
  "wirtschaft",
  "zeugnis",
  "zins",
  "zulagen",
];

/** Positions in `word` where a soft hyphen may go. */
function breakPoints(word: string): number[] {
  const lower = word.toLowerCase();
  const matches: { start: number; end: number }[] = [];
  for (const part of PARTS) {
    for (let i = lower.indexOf(part); i !== -1; i = lower.indexOf(part, i + 1)) matches.push({ start: i, end: i + part.length });
  }
  const starts = matches
    .filter((m) => !matches.some((other) => other.start < m.start && m.start < other.end))
    .map((m) => m.start)
    .filter((start) => start >= MIN_PART_LENGTH && lower.length - start >= MIN_PART_LENGTH)
    .sort((a, b) => a - b);
  const points: number[] = [];
  for (const start of starts) {
    if (start - (points.at(-1) ?? 0) >= MIN_PART_LENGTH) points.push(start);
  }
  return points;
}

/**
 * Inserts soft hyphens at the joints of long compounds; everything else stays as it is. Pass
 * SMALL_HEADING for smaller headings.
 */
export function hyphenate(text: string, minWordLength = MIN_WORD_LENGTH): string {
  return text.replace(/\p{L}+/gu, (word) => {
    if (word.length < minWordLength) return word;
    const points = breakPoints(word);
    if (points.length === 0) return word;
    let out = "";
    let from = 0;
    for (const point of points) {
      out += word.slice(from, point) + SHY;
      from = point;
    }
    return out + word.slice(from);
  });
}
