import { describe, expect, it } from "vitest";
import { calculators } from "@/content/calculators";
import { process as steps, values } from "@/content/home";
import { propertyFaq, propertyGroups } from "@/content/immobilien";
import { services } from "@/content/services";
import { SMALL_HEADING, hyphenate } from "./hyphenate";

const SHY = "\u00AD";
const shown = (text: string) => hyphenate(text).replaceAll(SHY, "·");

describe("hyphenate", () => {
  it("breaks long compounds only where their parts meet", () => {
    expect(shown("Personaladministration")).toBe("Personal·administration");
    expect(shown("Unternehmensberatung")).toBe("Unternehmens·beratung");
    expect(shown("Datenschutzerklärung")).toBe("Daten·schutz·erklärung");
    expect(shown("Sozialversicherungsabrechnungen")).toBe("Sozial·versicherungs·abrechnungen");
    expect(shown("Öffentlichkeitsbeauftragten")).toBe("Öffentlichkeits·beauftragten");
  });

  it("keeps a part whole when a shorter part hides inside it", () => {
    expect(shown("Nebenkostenabrechnung")).toBe("Neben·kosten·abrechnung");
    expect(shown("Umsatzabstimmung")).toBe("Umsatz·abstimmung");
    expect(shown("Fristgerechte")).toBe("Frist·gerechte");
  });

  it("leaves short words, sentences and punctuation alone", () => {
    expect(hyphenate("Klarheit für Ihre Zahlen.")).toBe("Klarheit für Ihre Zahlen.");
    expect(shown("Lohnbuchhaltung & Personaladministration")).toBe("Lohn·buchhaltung & Personal·administration");
    expect(shown("Wohnungsabnahmen und -übergaben")).toBe("Wohnungs·abnahmen und -übergaben");
  });

  it("splits only very long words in smaller headings", () => {
    expect(hyphenate("Was ist im Verwaltungshonorar enthalten?", SMALL_HEADING)).toBe("Was ist im Verwaltungshonorar enthalten?");
    expect(hyphenate("Sozialversicherungsabrechnungen", SMALL_HEADING)).toBe(hyphenate("Sozialversicherungsabrechnungen"));
  });

  it("never changes the letters", () => {
    const text = services.map((s) => `${s.name} ${s.tagline} ${s.items.map((i) => i.title).join(" ")}`).join(" ");
    expect(hyphenate(text).replaceAll(SHY, "")).toBe(text);
  });

  it("gives every long word in a heading a break, so it fits a phone screen", () => {
    const headings = [
      ...services.flatMap((s) => [s.name, s.tagline, ...s.items.map((i) => i.title), ...s.promise.map((p) => p.title), ...s.faq.map((f) => f.question)]),
      ...propertyGroups.flatMap((g) => [g.title, ...g.items.map((i) => i.title)]),
      ...propertyFaq.map((f) => f.question),
      ...calculators.flatMap((c) => [c.name, c.title, ...c.faq.map((f) => f.question)]),
      ...values.map((v) => v.title),
      ...steps.map((s) => s.title),
    ];
    const unbroken = headings
      .flatMap((heading) => hyphenate(heading).match(/[\p{L}­]+/gu) ?? [])
      .filter((word) => word.length >= 16 && !word.includes(SHY));
    expect(unbroken).toEqual([]);
  });
});
