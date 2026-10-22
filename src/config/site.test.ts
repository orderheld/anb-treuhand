import { describe, expect, it } from "vitest";
import { phoneE164, phoneHref } from "./site";

describe("phoneE164", () => {
  it("turns Swiss numbers with a leading 0 into +41", () => {
    expect(phoneE164("032 310 17 29")).toBe("+41323101729");
    expect(phoneE164("079 123 45 67")).toBe("+41791234567");
  });

  it("keeps international numbers and reads a 00 prefix as +", () => {
    expect(phoneE164("+41 32 310 17 29")).toBe("+41323101729");
    expect(phoneE164("0049 30 1234567")).toBe("+49301234567");
    expect(phoneE164("+49 (30) 123-4567")).toBe("+49301234567");
  });

  it("builds the tel: link from it", () => {
    expect(phoneHref("032 310 17 29")).toBe("tel:+41323101729");
  });
});
