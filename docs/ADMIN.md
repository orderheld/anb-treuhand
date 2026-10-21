# Admin-Bereich

Adresse: `https://www.anb-treuhand.ch/admin`

Hier passen Sie die Preise der drei Rechner an und sehen alle Anfragen aus dem Kontaktformular
und den Rechnern. Es gibt einen gemeinsamen Zugang für ANB Treuhand und Webnova. Registrieren
kann sich niemand.

## Anmelden

Sie brauchen zwei Dinge:

1. das Passwort,
2. den sechsstelligen Code aus der Authenticator-App (Google Authenticator oder Microsoft
   Authenticator). Der Code wechselt alle 30 Sekunden und gilt nur einmal.

Eine Anmeldung gilt höchstens 12 Stunden und endet nach 4 Stunden ohne Aktivität.

**Gesperrt?** Nach 5 Fehlversuchen ist die Anmeldung von dieser Adresse für 15 Minuten gesperrt.
Wird mit dem richtigen Passwort 10-mal ein falscher Code eingegeben, ist die Anmeldung für alle
bis zu einer Stunde gesperrt. Dann hat jemand das Passwort: bitte danach ändern.

**Code stimmt nie?** Meist geht die Uhr des Handys falsch. In den Einstellungen des Handys
«Datum und Uhrzeit automatisch» einschalten.

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
- **Protokoll:** die letzten 50 Anmeldungen und Änderungen (Tarife, Status, Löschungen). Steht dort
  «Richtiges Passwort, falscher Code» und Sie waren es nicht, ändern Sie das Passwort.

## Passwort ändern

1. Anmelden, Sicherheit → «Zur Einrichtung».
2. «Neuen Passwort-Hash erzeugen», neues Passwort eingeben, Hash kopieren.
3. Vercel → Settings → Environment Variables: `ADMIN_PASSWORD_HASH` ersetzen.
4. Deployments → letztes Deployment → Redeploy.

Danach gilt nur noch das neue Passwort, und alle Geräte sind abgemeldet.

## Weiteres Handy

Kein neuer Schlüssel nötig: Der bestehende QR-Code wird auf dem zusätzlichen Handy gescannt.
Wer den QR-Code nicht mehr hat, erzeugt einen neuen Schlüssel (siehe nächster Abschnitt) und
scannt ihn auf allen Handys.

## Handy verloren

1. Sofort unter Sicherheit **Alle abmelden**.
2. Einrichtung → «Neuen Code-Schlüssel erzeugen», auf den verbleibenden Handys scannen.
3. In Vercel `ADMIN_TOTP_SECRET` ersetzen, Redeploy. Der alte Schlüssel gilt dann nicht mehr,
   alle Geräte sind abgemeldet.
4. Wenn das Passwort auf dem Handy gespeichert war: auch das Passwort ändern.

## Technisch

- Zugangsdaten stehen nur als Umgebungsvariablen in Vercel: ein PBKDF2-Hash des Passworts
  (600 000 Runden) und der TOTP-Schlüssel. Das Passwort selbst ist nirgends gespeichert.
- Das Sitzungs-Cookie ist `HttpOnly`, `Secure` und `SameSite=Lax`; in der Datenbank steht nur
  ein Hash davon.
- Admin-Seiten werden nie zwischengespeichert und nie indexiert.
- Code: `src/app/admin/`, `src/lib/admin/`.
