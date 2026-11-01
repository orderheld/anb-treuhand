import { describe, expect, it } from "vitest";
import { MAX_TOKEN_AGE_MS, MIN_FILL_MS, checkContent, checkFormToken, issueFormToken } from "./spam";

describe("form token", () => {
  const t0 = Date.UTC(2026, 10, 1, 10);

  it("accepts a token after the minimum fill time", () => {
    expect(checkFormToken(issueFormToken(t0), t0 + MIN_FILL_MS + 1)).toBe("ok");
  });
  it("refuses a token that is used too fast or too late", () => {
    expect(checkFormToken(issueFormToken(t0), t0 + 500)).toBe("too_fast");
    expect(checkFormToken(issueFormToken(t0), t0 + MAX_TOKEN_AGE_MS + 1)).toBe("expired");
  });
  it("detects missing and forged tokens", () => {
    expect(checkFormToken(null)).toBe("missing");
    expect(checkFormToken("")).toBe("missing");
    const [, sig] = issueFormToken(t0).split(".");
    expect(checkFormToken(`${(t0 - 60_000).toString(36)}.${sig}`, t0)).toBe("invalid");
    expect(checkFormToken("abc", t0)).toBe("invalid");
    expect(checkFormToken(`${t0.toString(36)}.x.y`, t0)).toBe("invalid");
  });
});

describe("content check", () => {
  it("lets ordinary requests through", () => {
    expect(checkContent({ name: "Anna Müller", company: "Müller GmbH", message: "Guten Tag, wir brauchen Hilfe bei der Buchhaltung und der Steuererklärung. Unsere Website ist www.mueller.ch." }).ok).toBe(true);
    expect(checkContent({ name: "Ardit Krasniqi", message: "Përshëndetje, kam nevojë për ndihmë me tatimet. Danke!" }).ok).toBe(true);
    expect(checkContent({ name: "Jean Dupont", message: "Bonjour, je cherche une fiduciaire pour ma Sàrl." }).ok).toBe(true);
  });
  it("blocks typical spam", () => {
    expect(checkContent({ name: "Best SEO https://spam.example", message: "Hello" })).toEqual({ ok: false, reason: "link_in_name" });
    expect(checkContent({ name: "John", message: "See https://a.example and https://b.example" })).toEqual({ ok: false, reason: "links" });
    expect(checkContent({ name: "John", message: '<a href="x">cheap</a>' })).toEqual({ ok: false, reason: "markup" });
    expect(checkContent({ name: "Иван", message: "Привет, интересное предложение" })).toEqual({ ok: false, reason: "script" });
    expect(checkContent({ name: "Mike", message: "We offer SEO and backlinks to get you on the first page of Google." })).toEqual({ ok: false, reason: "phrases" });
  });
});
