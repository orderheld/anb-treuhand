# Kundenportal (Phase 2)

Stand: Konzept. Die Seite `/kundenportal` stellt das Portal als «in Vorbereitung» vor und zeigt
noch keine Anmeldung (`portalLive: false` in `src/config/site.ts`).

## Ziel

Kundinnen und Kunden von ANB reichen Belege und Steuerunterlagen digital ein, finden ihre
Abschlüsse und Steuererklärungen an einem sicheren Ort und sehen, welche Unterlagen noch fehlen.
Das Portal ergänzt die persönliche Betreuung, es ersetzt sie nicht.

## Umfang der ersten Version

| Funktion | Beschreibung |
| --- | --- |
| Anmeldung | Einladung durch ANB per E-Mail, Anmeldung mit E-Mail-Link oder Passwort und zweitem Faktor. Keine offene Registrierung. |
| Belege hochladen | Fotos und PDFs vom Handy oder Computer, pro Mandat und Jahr abgelegt. |
| Steuerunterlagen | Checkliste pro Steuerjahr (Lohnausweis, Bankauszüge, Säule 3a usw.), abhakbar beim Hochladen. |
| Dokumente von ANB | Abschlüsse, Steuererklärungen, Lohnabrechnungen zum Herunterladen. |
| Offene Punkte | Was noch fehlt und was als Nächstes ansteht, gepflegt von ANB. |
| Nachrichten | Fragen zu einem Dokument direkt im Portal statt per E-Mail. |
| Benachrichtigung | E-Mail an ANB bei neuen Unterlagen, an die Kundschaft bei neuen Dokumenten (ohne Inhalt in der E-Mail). |

Für ANB kommt im bestehenden Admin-Bereich eine Mandatsverwaltung dazu: Mandate anlegen,
Personen einladen, Checklisten pflegen, Dokumente bereitstellen.

## Technik

- Gleiche Basis wie heute: Next.js auf Vercel, Neon Postgres in Frankfurt.
- Dateien in einem Objektspeicher in der Schweiz oder EU mit Verschlüsselung, Zugriff nur über
  kurzlebige, signierte Links. Dateien nie öffentlich.
- Konten pro Person, Rechte pro Mandat (eine Person kann mehrere Mandate haben, zum Beispiel
  Firma und privat).
- Protokoll aller Zugriffe und Uploads, wie im heutigen Admin-Bereich.
- Virenprüfung und Grössenlimits beim Upload, erlaubte Formate: PDF, JPG, PNG, HEIC.

## Datenschutz und Sicherheit

- Treuhanddaten sind besonders schützenswert: Datenstandort Schweiz oder EU, Verträge zur
  Auftragsbearbeitung mit allen Anbietern, Ergänzung der Datenschutzerklärung (revDSG).
- Zwei-Faktor-Anmeldung für alle Konten von ANB, für Kundschaft empfohlen.
- Aufbewahrung nach den Fristen von ANB (geschäftsrelevante Unterlagen in der Regel zehn Jahre),
  Löschung auf Wunsch, soweit keine Pflicht dagegen spricht.
- Vor dem Start: Sicherheitsprüfung (Penetrationstest) durch Dritte.

## Offene Fragen an ANB

1. Welche Buchhaltungs- und Steuersoftware nutzt ANB? Ein Export dorthin spart Abtippen.
2. Sollen Kundinnen und Kunden Dokumente nur hochladen oder auch kommentieren und freigeben?
3. Wer bei ANB pflegt Checklisten und Dokumente?
4. Gewünschter Starttermin, zum Beispiel vor der Steuersaison.

## Vorgehen

1. Fragen klären, Umfang festlegen.
2. Klickbarer Entwurf der wichtigsten Abläufe (Einladung, Upload, Checkliste) zur Abnahme.
3. Umsetzung, Test mit zwei bis drei Pilotkunden.
4. Sicherheitsprüfung, Start, `portalLive` auf `true` und Anmeldung auf der Website freischalten.
