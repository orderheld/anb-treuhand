# Admin-Bereich

Adresse: `https://www.anb-treuhand.ch/admin`

Hier passen Sie die Preise der drei Rechner an und sehen alle Anfragen aus dem Kontaktformular
und den Rechnern. Es gibt einen gemeinsamen Zugang für ANB Treuhand und Webnova. Registrieren
kann sich niemand.

## Anmelden

Sie brauchen nur das gemeinsame Passwort. Seit dem 27.10.2026 fragt die Anmeldung keinen Code
aus einer Authenticator-App mehr ab (Wunsch von Ferhat). Das Passwort ist damit der einzige
Schutz: mindestens 12 Zeichen, nirgends sonst verwendet, nur an Personen weitergeben, die den
Zugang brauchen.

Eine Anmeldung gilt höchstens 12 Stunden und endet nach 4 Stunden ohne Aktivität.

**Gesperrt?** Nach 5 Fehlversuchen ist die Anmeldung von dieser Adresse für 15 Minuten gesperrt.
Nach 30 Fehlversuchen innert einer Stunde, egal von wo, ist die Anmeldung für alle bis zu einer
Stunde gesperrt. Dann versucht vermutlich jemand, das Passwort zu erraten: im Protokoll
nachsehen und das Passwort ändern, wenn es nicht sehr stark ist.

## Übersicht

Neue Anfragen, die Tarife der Rechner mit dem Datum der letzten Änderung und der Betrieb:

- **E-Mail-Versand:** eingerichtet, Testmodus (nur in Vorschauen) oder fehlt.
- **Kopie im Admin-Bereich:** ob Anfragen zusätzlich hier gespeichert werden.
- **Fehlversuche:** fehlgeschlagene Anmeldungen der letzten sieben Tage.

## Tarife

Pro Rechner ein Formular mit allen Preisen, gruppiert wie im Rechner. Unter einem geänderten
Wert steht der Standardwert.

- **Speichern** gilt sofort: Die Website rechnet ab der nächsten Anfrage mit den neuen Werten.
- Jeder Wert wird beim Speichern geprüft (Bereich, Nachkommastellen). Fehlerhafte Felder sind
  markiert, gespeichert wird dann nichts.
- **Im Rechner anbieten** blendet eine Leistung im Rechner aus oder ein.
- **Standardwerte** setzt alle Tarife dieses Rechners auf die ursprünglichen Werte zurück.
- Bereits eingegangene Offertanfragen behalten den Preis, den der Rechner beim Absenden
  angezeigt hat.

Was die Werte bedeuten: [TARIFE.md](TARIFE.md).

## Anfragen

Jede Anfrage kommt per E-Mail an `info@anb-treuhand.ch`. Hier steht zusätzlich eine Kopie mit
allen Angaben aus dem Rechner und dem berechneten Richtpreis.

- **Status:** Neu, In Bearbeitung, Erledigt. Die Zahl neben «Anfragen» in der Navigation
  zählt die neuen.
- **Antworten** öffnet eine E-Mail an die Person, mit der Referenz im Betreff.
- **Löschen** entfernt die Kopie endgültig, zum Beispiel wenn jemand die Löschung seiner Daten
  verlangt. Die E-Mail im Postfach bleibt bestehen und muss dort gelöscht werden.
- Nach 365 Tagen werden Anfragen automatisch gelöscht, wie in der Datenschutzerklärung
  beschrieben.

## Sicherheit

- **Angemeldete Geräte:** wo gerade jemand angemeldet ist. **Alle abmelden** beendet jede
  Anmeldung, auch die eigene.
- **Protokoll:** die letzten 50 Anmeldungen und Änderungen (Tarife, Status, Löschungen). Stehen
  dort viele fehlgeschlagene Anmeldungen und Sie waren es nicht, ändern Sie das Passwort.

## Passwort ändern

1. Anmelden, Sicherheit → «Zur Einrichtung».
2. «Neuen Passwort-Hash erzeugen», neues Passwort eingeben (mindestens 12 Zeichen, kein Bezug
   zur Firma), Hash kopieren.
3. Vercel → Settings → Environment Variables: `ADMIN_PASSWORD_HASH` ersetzen.
4. Deployments → letztes Deployment → Redeploy.

Danach gilt nur noch das neue Passwort, und alle Geräte sind abgemeldet.

## Gerät verloren oder Passwort weitergegeben

1. Sofort unter Sicherheit **Alle abmelden**.
2. Das Passwort ändern (siehe oben). Danach gilt das alte Passwort nicht mehr.

## Technisch

- Zugangsdaten stehen nur als Umgebungsvariable in Vercel: ein PBKDF2-Hash des Passworts
  (600 000 Runden). Das Passwort selbst ist nirgends gespeichert. Eine noch gesetzte Variable
  `ADMIN_TOTP_SECRET` wird nicht mehr gelesen und kann gelöscht werden.
- Das Sitzungs-Cookie ist `HttpOnly`, `Secure` und `SameSite=Lax`; in der Datenbank steht nur
  ein Hash davon.
- Admin-Seiten werden nie zwischengespeichert und nie indexiert.
- Code: `src/app/admin/`, `src/lib/admin/`.
