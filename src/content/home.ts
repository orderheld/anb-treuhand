import type { FaqItem, IconName } from "./types";

/** Texts of the home page. Claims stay within what the client confirmed (20.10.2026). */

export const hero = {
  eyebrow: "Treuhand in Langenthal",
  /** The second part is set in copper foil. */
  title: ["Klarheit für", "Ihre Zahlen."],
  lead: "Buchhaltung, Steuern, Löhne, Firmengründungen und Immobilien: persönlich betreut, digital organisiert und zu Preisen, die Sie schon vorher kennen.",
  highlights: [
    { icon: "calculator", label: "Richtpreise online" },
    { icon: "handshake", label: "Erstgespräch kostenlos" },
    { icon: "smartphone", label: "Digital oder auf Papier" },
  ] as { icon: IconName; label: string }[],
};

export const intro = {
  statement: "Wir kümmern uns um Ihre Zahlen, damit Sie sich um Ihr Unternehmen kümmern können.",
  text: "ANB Treuhand ist ein junges, aufgestelltes Team mit professioneller Erfahrung in Buchhaltung, Steuern und Immobilien. Wir verbinden das Handwerk einer klassischen Treuhand mit modernen, digitalen Abläufen. Für KMU, Selbstständige und Privatpersonen in Langenthal, im Oberaargau und darüber hinaus.",
};

export const values: { icon: IconName; title: string; text: string }[] = [
  {
    icon: "handshake",
    title: "Persönlich",
    text: "Eine feste Ansprechperson, die Ihr Unternehmen kennt. Sie erreichen uns direkt, ohne Callcenter und Ticketnummern.",
  },
  {
    icon: "calculator",
    title: "Transparent",
    text: "Richtpreise online, Offerten mit klaren Pauschalen. Sie wissen vorher, was Sie bezahlen.",
  },
  {
    icon: "smartphone",
    title: "Digital",
    text: "Belege per Foto, Unterlagen per E-Mail, Auswertungen auf Knopfdruck. Und wer lieber Ordner bringt, ist genauso willkommen.",
  },
  {
    icon: "map-pin",
    title: "Regional verankert",
    text: "Mitten in Langenthal, nahe bei unserer Kundschaft. Wir kennen die Gemeinden, Behörden und Gepflogenheiten im Kanton Bern.",
  },
];

export const process: { title: string; text: string }[] = [
  { title: "Kennenlernen", text: "Im kostenlosen Erstgespräch hören wir zu und klären, was Sie brauchen." },
  { title: "Offerte", text: "Sie erhalten eine klare Offerte mit festen Pauschalen, ohne Kleingedrucktes." },
  { title: "Start", text: "Wir übernehmen Ihre Unterlagen und richten den Ablauf ein, digital oder auf Papier." },
  { title: "Begleitung", text: "Laufende Betreuung mit fester Ansprechperson, Fristen behalten wir für Sie im Blick." },
];

export const portal = {
  eyebrow: "Digitales Kundenportal",
  title: "Ihr Treuhandbüro in der Hosentasche.",
  text: "Wir bauen ein geschütztes Kundenportal für Sie auf: Belege per Smartphone hochladen, Steuerunterlagen digital einreichen, Dokumente von uns abholen und jederzeit sehen, was noch fehlt.",
  features: [
    "Rechnungen und Belege per Foto hochladen",
    "Steuerunterlagen digital einreichen",
    "Dokumente von ANB Treuhand erhalten",
    "Fehlende Unterlagen und offene Aufgaben sehen",
    "Sicher mit uns kommunizieren",
  ],
};

export const homeFaq: FaqItem[] = [
  {
    question: "Für wen arbeitet ANB Treuhand?",
    answer:
      "Für KMU, Selbstständige, Gründerinnen und Gründer, Privatpersonen sowie Eigentümerinnen und Eigentümer von Liegenschaften. Zu Hause sind wir in Langenthal und im Oberaargau. Dank digitaler Zusammenarbeit arbeiten wir auch gerne mit Kundschaft aus der ganzen Schweiz.",
  },
  {
    question: "Wie verbindlich sind die Preise im Rechner?",
    answer:
      "Die Rechner zeigen unverbindliche Richtpreise auf Basis unserer Tarife. Nach dem Erstgespräch erhalten Sie eine verbindliche Offerte. Weicht sie ab, erklären wir Ihnen genau, warum.",
  },
  {
    question: "Was kostet das Erstgespräch?",
    answer: "Nichts. Das Erstgespräch ist kostenlos und unverbindlich, bei uns in Langenthal, bei Ihnen oder per Video.",
  },
  {
    question: "Wie schnell können wir starten?",
    answer: "Sobald Sie zusagen. Bei einem Wechsel von einer anderen Treuhand kümmern wir uns um die Übergabe der Unterlagen, damit keine Frist verloren geht.",
  },
  {
    question: "Wie sicher sind meine Daten bei Ihnen?",
    answer:
      "Diskretion ist für uns selbstverständlich: Wir behandeln alle Unterlagen streng vertraulich und übermitteln digitale Daten verschlüsselt. Mehr dazu in der [Datenschutzerklärung](/datenschutz).",
  },
];
