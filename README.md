# ANB Treuhand Website

Website von ANB Treuhand, Langenthal: Leistungen, Immobilien, drei Preisrechner mit
Offertanfrage, Kontaktformular und ein Admin-Bereich für Tarife und Anfragen.

Corporate Design und Umsetzung: Webnova (webnova.ch).

## Technik

- Next.js 16 (App Router, Cache Components, Turbopack), React 19, TypeScript, Tailwind CSS 4
- Hosting: Vercel (Region Frankfurt), Domain anb-treuhand.ch bei cyon
- Datenbank: Neon Postgres (Tarife, Kopien der Anfragen, Admin-Anmeldungen)
- E-Mail: Resend (Anfragen an ANB, Bestätigung an die anfragende Person)
- Keine Tracker, keine Cookies auf der öffentlichen Seite, Schriften selbst gehostet

Die öffentlichen Seiten sind statisch. Die Rechner lesen ihre Tarife aus der Datenbank und
bleiben zwischengespeichert, bis im Admin-Bereich neue Tarife gespeichert werden.

## Lokal starten

```bash
npm install
cp .env.example .env.local   # ausfüllen, für einen ersten Blick reicht CONTACT_DRY_RUN=true
npm run dev                  # http://localhost:3000
```

Ohne `DATABASE_URL` rechnen die Rechner mit den Standardtarifen und Anfragen gehen nur per
E-Mail. Mit `CONTACT_DRY_RUN=true` prüfen die Formulare alles, versenden aber nichts.

## Befehle

| Befehl | Zweck |
| --- | --- |
| `npm run dev` | Entwicklungsserver |
| `npm run build` | Produktions-Build |
| `npm run typecheck` | TypeScript prüfen |
| `npm run lint` | ESLint |
| `npm test` | Unit-Tests (Rechner, Worttrennung, Login); mit `TEST_DATABASE_URL` auch die Datenbank-Tests |
| `npm run check:launch` | offene Angaben auflisten; mit Adresse (`-- https://…`) auch die Live-Seite prüfen |

## Wo was steht

| Was | Datei |
| --- | --- |
| Firmendaten, Kontakt, Öffnungszeiten, rechtliche Angaben | `src/config/site.ts` |
| Leistungen und ihre Texte | `src/content/services.ts` |
| Immobilien, Startseite, Navigation | `src/content/` |
| Rechner: Berechnung und Standardtarife | `src/lib/calculators/` |
| Seiten | `src/app/(site)/` |
| Admin-Bereich | `src/app/admin/`, `src/lib/admin/` |
| Datenbanktabellen | `src/lib/db/migrations.ts` |
| E-Mail-Signaturen (feste Adressen) | `public/signatur/` |

Angaben, die der Kunde noch bestätigen muss, sind in `src/config/site.ts` mit
`confirmed: false` markiert und erscheinen erst danach auf der Seite.

## Anleitungen

- [Go-live](docs/GO-LIVE.md): Vercel, Domain, E-Mail, Admin, Kontrolle
- [Admin-Bereich](docs/ADMIN.md): Anmeldung, Tarife, Anfragen, Sicherheit
- [Tarife](docs/TARIFE.md): wie die Rechner rechnen und was die Werte bedeuten
- [Kundenportal](docs/KUNDENPORTAL.md): Konzept für Phase 2
