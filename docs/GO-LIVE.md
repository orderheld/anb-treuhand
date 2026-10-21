# Go-live

Reihenfolge für den Start. Die Schritte 1 bis 6 laufen auf der Vercel-Adresse
(`anb-treuhand-….vercel.app`), die für Suchmaschinen gesperrt ist. Erst Schritt 7 schaltet die
Domain um.

## 1. Umgebungsvariablen in Vercel

Vercel → Projekt `anb-treuhand` → Settings → Environment Variables, jeweils für **Production**.
Geheime Werte als **Sensitive** markieren. Beschreibung aller Werte: [`.env.example`](../.env.example).

| Variable | Wert |
| --- | --- |
| `RESEND_API_KEY` | API-Key von resend.com |
| `CONTACT_TO_EMAIL` | `info@anb-treuhand.ch` |
| `CONTACT_FROM_EMAIL` | `ANB Treuhand <website@anb-treuhand.ch>` |
| `DATABASE_URL` | Connection String von Neon (pooled) |
| `CONTACT_IP_SALT` | langer Zufallswert |
| `CRON_SECRET` | langer Zufallswert |
| `NEXT_PUBLIC_SITE_URL` | `https://www.anb-treuhand.ch` |
| `ADMIN_PASSWORD_HASH` | aus Schritt 3 |
| `ADMIN_TOTP_SECRET` | aus Schritt 3 |

Zufallswerte erzeugen, zum Beispiel:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
```

Eine geänderte Variable gilt erst nach einem neuen Deployment: Deployments → letztes Deployment →
**Redeploy**.

## 2. Deployment

Jeder Push auf `main` baut und veröffentlicht die Seite automatisch. Im Build-Log von Vercel
muss «Compiled successfully» stehen. Die Datenbanktabellen legt die Website beim ersten Zugriff
selbst an.

## 3. Admin-Bereich einrichten

1. `https://<vercel-adresse>/admin/einrichtung` öffnen.
2. Passwort zweimal eingeben, «Hash erzeugen», den Wert als `ADMIN_PASSWORD_HASH` in Vercel
   eintragen. Das Passwort selbst verlässt den Browser nicht.
3. «Code-Schlüssel erzeugen», den QR-Code mit Google Authenticator oder Microsoft Authenticator
   scannen (auf jedem Handy, das Zugang braucht), den angezeigten Code prüfen und den Schlüssel
   als `ADMIN_TOTP_SECRET` eintragen.
4. Redeploy. Danach unter `/admin` anmelden.

Details: [ADMIN.md](ADMIN.md).

## 4. Formulare testen

- Kontaktformular und eine Offertanfrage aus einem Rechner absenden.
- Die Anfrage muss in `info@anb-treuhand.ch` ankommen, die Bestätigung bei der Absenderadresse.
- Im Admin-Bereich unter «Anfragen» erscheint die Kopie, unter «Übersicht → Betrieb» stehen
  E-Mail-Versand und Kopie auf grün.

## 5. Inhalte bestätigen

`npm run check:launch` listet, was in `src/config/site.ts` noch offen ist:

- Inhaberin oder Inhaber der Einzelfirma: fürs Impressum vorgeschrieben.
- UID, falls vorhanden, und ob ein Handelsregistereintrag besteht.
- Ob die Seite eine Antwort «innert eines Arbeitstages» versprechen soll.

Die Tarife der Rechner sind recherchierte Startwerte. ANB prüft sie im Admin-Bereich und passt
sie bei Bedarf an ([TARIFE.md](TARIFE.md)).

## 6. Durchsehen

Alle Seiten auf Handy und Computer anschauen, Rechner ausprobieren, Impressum und
Datenschutzerklärung lesen.

## 7. Domain umschalten (cyon)

Die Domain bleibt bei cyon, auch die E-Mail. Umgestellt werden nur die Einträge für die Website.

1. Vercel → Settings → Domains: `www.anb-treuhand.ch` hinzufügen und `anb-treuhand.ch` darauf
   weiterleiten lassen (Vercel schlägt das so vor).
2. Vercel zeigt die nötigen DNS-Einträge an: einen **A-Record** für `anb-treuhand.ch` und einen
   **CNAME** für `www`. Genau diese Werte bei cyon eintragen (my.cyon.ch → Domains → DNS).
   Bestehende A-, AAAA- oder CNAME-Einträge für `@` und `www` ersetzen.
3. **Nicht ändern:** MX, SPF (TXT `v=spf1 …`), DKIM, die Einträge von Resend und die
   Nameserver. Sonst funktioniert die E-Mail nicht mehr.
4. Warten, bis Vercel die Domain als gültig zeigt (Minuten bis wenige Stunden). Das
   SSL-Zertifikat stellt Vercel automatisch aus.
5. **Redeploy.** Erst damit erkennt die Seite die eigene Domain, gibt sich für Suchmaschinen frei
   und verwendet die Domain in Sitemap, Links und Vorschaubildern.

## 8. Kontrolle nach dem Umschalten

```bash
npm run check:launch -- https://www.anb-treuhand.ch
```

Prüft Seiten, Sicherheits-Header, Indexierung, Sitemap, Admin-Schutz, Löschjob, die Bilder der
E-Mail-Signatur und die Weiterleitung ohne `www`.

Danach:

- Google Search Console: Property `https://www.anb-treuhand.ch` anlegen, per HTML-Tag
  (`GOOGLE_SITE_VERIFICATION` in Vercel, Redeploy) oder per TXT-Eintrag bei cyon bestätigen,
  dann die Sitemap `https://www.anb-treuhand.ch/sitemap.xml` einreichen.
- Google-Unternehmensprofil mit derselben Adresse und Telefonnummer wie auf der Website.
- Eine echte Testanfrage senden.
