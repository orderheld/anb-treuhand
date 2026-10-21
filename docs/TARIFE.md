# Tarife der Preisrechner

Die drei Rechner zeigen unverbindliche Richtpreise. Alle Preise und Sätze stellt ANB im
Admin-Bereich unter «Tarife» ein ([ADMIN.md](ADMIN.md)). Die Standardwerte sind recherchierte
Startwerte für das Oberaargau und müssen von ANB geprüft werden.

ANB ist nicht MWST-pflichtig: Alle Beträge sind Endpreise.

## Für alle Rechner

| Wert | Wirkung |
| --- | --- |
| Beträge runden auf | Jede Position wird auf diesen Betrag gerundet (z.B. CHF 5). |
| Bandbreite | Zeigt neben dem Richtpreis einen Bereich, z.B. ± 10 %. 0 blendet ihn aus. |
| Hinweis unter dem Resultat | Der Satz unter dem Ergebnis, etwa zur Unverbindlichkeit. |
| Im Rechner anbieten | Blendet eine Leistung im Rechner aus oder ein. |

Die Summen entstehen immer aus den gerundeten Positionen, die Aufstellung geht also auf.

## Treuhand-Preisrechner

Ergebnis: Richtpreis **pro Monat**, dazu das Total pro Jahr. Einmalige Arbeiten stehen separat.

| Leistung | Berechnung |
| --- | --- |
| Finanzbuchhaltung | Grundpauschale je Rechtsform, darin eine Anzahl Buchungen enthalten. Jede weitere Buchung kostet den Preis ihrer Stufe: Stufe 1 bis vor «Stufe 2 ab Buchung Nr.», dann Stufe 2, ab «Stufe 3 ab Buchung Nr.» Stufe 3. |
| Debitoren & Kreditoren | Pauschale pro Monat plus Zuschlag pro Buchung. |
| MWST-Abrechnungen | Effektive Methode: 4 Abrechnungen pro Jahr, Saldosteuersatz: 2, plus jährliche Umsatzabstimmung, auf 12 Monate verteilt. |
| Lohnbuchhaltung | Grundpauschale plus Betrag pro Person und Monat, dazu Lohnausweise pro Person und die Jahresmeldungen, auf 12 Monate verteilt. Mindestens eine Person. |
| Jahresabschluss | Betrag je Rechtsform plus Zuschlag je monatlicher Buchung, auf 12 Monate verteilt. |
| Steuererklärung | Betrag je Rechtsform, auf 12 Monate verteilt. Beim Einzelunternehmen inklusive private Steuererklärung. |
| Beratung im Quartal | Vier Gespräche pro Jahr, auf 12 Monate verteilt. |
| Digitalisierung | Einmalig, je Rechtsform. |

**Mindesthonorar:** Liegt die Summe pro Monat darunter, ergänzt der Rechner eine Position bis
zum Mindesthonorar. 0 schaltet das aus.

## Firmengründungsrechner

Ergebnis: einmaliger Betrag, getrennt in **Honorar ANB** und **externe Kosten** (Schätzung).

- Gründungspaket je Rechtsform, plus Zuschlag für jede weitere Gründerin und jeden weiteren
  Gründer.
- Zusatzleistungen nach Wahl, jede einzeln ein- und ausschaltbar.
- Externe Kosten: Notariat (GmbH und AG, Berner Tarif, plus Zuschlag pro weitere Person),
  Handelsregister, Bank, Beglaubigungen, bei Sacheinlage die Prüfungsbestätigung.
- Emissionsabgabe: Satz auf dem Kapital über der Freigrenze (heute 1 % über CHF 1 Mio.).

Gesetzlich festgelegt und daher nicht einstellbar: das Mindestkapital (GmbH CHF 20 000,
AG CHF 100 000). Wer einen anderen Kanton als Bern wählt, sieht den Hinweis, dass die
Notariatskosten auf dem Berner Tarif beruhen.

## Immobilien-Rechner

Ergebnis: wiederkehrende Kosten **pro Jahr**, einmalige Leistungen separat.

| Leistung | Berechnung |
| --- | --- |
| Verwaltung Mietliegenschaften | Prozent des Bruttomietertrags je Objektart. Mindestens der Betrag pro Mieteinheit und Monat und mindestens das Mindesthonorar pro Liegenschaft; der höchste der drei Werte gilt. |
| Verwaltung Stockwerkeigentum | Betrag pro Stockwerkeinheit, mindestens das Mindesthonorar der Gemeinschaft. |
| Immobilienbuchhaltung, Heiz- und Nebenkostenabrechnung, Jahres- und Eigentümerabrechnung | Betrag pro Einheit, mindestens das jeweilige Mindesthonorar. |
| Mietzinsinkasso und Mahnwesen | Prozent des Bruttomietertrags, mindestens das Mindesthonorar. |
| Wohnungsabnahmen und -übergaben | Preis pro Abnahme oder Übergabe mal die erwartete Anzahl pro Jahr. |
| Immobilienverkauf | Prozent des Verkaufspreises, mindestens die Mindestprovision. Einmalig. |
| Sanierung und Baubegleitung | Prozent der Bausumme, mindestens das Mindesthonorar. Einmalig. |

**Inklusive (fest im Code):** Die Verwaltung einer Mietliegenschaft enthält Mietzinsinkasso und
Mahnwesen, Abnahmen und Übergaben, die Immobilienbuchhaltung sowie die Jahres- und
Eigentümerabrechnung. Die Verwaltung von Stockwerkeigentum enthält Buchhaltung und
Jahresabrechnung. Werden solche Leistungen zusätzlich gewählt, zeigt der Rechner sie als
«enthalten» ohne Preis.

## Für Entwickler

- Felder, Standardwerte und Berechnung: `src/lib/calculators/treuhand.ts`, `gruendung.ts`,
  `immobilien.ts`. Das Admin-Formular entsteht automatisch aus den Feldern.
- Gespeichert wird pro Rechner ein JSON in der Tabelle `settings` (`tarife.treuhand`,
  `tarife.firmengruendung`, `tarife.immobilien`). Fehlende Felder nehmen den Standardwert,
  ungültige werden verworfen.
- Den `key` eines Feldes nie umbenennen: Gespeicherte Werte gingen sonst verloren. Neue Felder
  brauchen einen Standardwert und, wo sinnvoll, `min`, `max` und `decimals`.
- Die Website liest die Tarife zwischengespeichert (`src/lib/tariffs/store.ts`); das Speichern
  im Admin-Bereich erneuert sie sofort.
- Tests: `src/lib/calculators/calculators.test.ts`.
