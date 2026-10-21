/** Main navigation of the public site. */
export const mainNav = [
  { href: "/leistungen", label: "Leistungen" },
  { href: "/immobilien", label: "Immobilien" },
  { href: "/rechner", label: "Preisrechner" },
  { href: "/ueber-uns", label: "Über uns" },
  { href: "/kontakt", label: "Kontakt" },
] as const;

export const primaryCta = { href: "/kontakt?anliegen=erstgespraech", label: "Gratis Erstgespräch" } as const;

export const legalNav = [
  { href: "/impressum", label: "Impressum" },
  { href: "/datenschutz", label: "Datenschutz" },
] as const;
