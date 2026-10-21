import { describe, expect, it } from "vitest";
import { base32Decode, totpCode, verifyTotp } from "./totp";

// RFC 6238, appendix B (SHA-1), last six digits of the eight-digit values.
const SECRET = "GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ"; // "12345678901234567890"

describe("totp", () => {
  it("decodes base32", () => {
    expect(base32Decode(SECRET).toString()).toBe("12345678901234567890");
    expect(base32Decode("gezd gnbv gy3t qojq gezd gnbv gy3t qojq").toString()).toBe("12345678901234567890");
  });

  it("matches the RFC 6238 test vectors", () => {
    const key = base32Decode(SECRET);
    expect(totpCode(key, Math.floor(59 / 30))).toBe("287082");
    expect(totpCode(key, Math.floor(1111111109 / 30))).toBe("081804");
    expect(totpCode(key, Math.floor(1234567890 / 30))).toBe("005924");
    expect(totpCode(key, Math.floor(2000000000 / 30))).toBe("279037");
  });

  it("accepts the current step and one step of clock drift, nothing more", () => {
    const now = 1234567890 * 1000;
    const step = Math.floor(now / 30_000);
    const key = base32Decode(SECRET);
    expect(verifyTotp(SECRET, totpCode(key, step), now)).toBe(step);
    expect(verifyTotp(SECRET, totpCode(key, step - 1), now)).toBe(step - 1);
    expect(verifyTotp(SECRET, totpCode(key, step + 1), now)).toBe(step + 1);
    expect(verifyTotp(SECRET, totpCode(key, step - 2), now)).toBeNull();
    expect(verifyTotp(SECRET, totpCode(key, step + 2), now)).toBeNull();
  });

  it("rejects malformed codes and short secrets", () => {
    const now = 1234567890 * 1000;
    expect(verifyTotp(SECRET, "12345", now)).toBeNull();
    expect(verifyTotp(SECRET, "1234567", now)).toBeNull();
    expect(verifyTotp(SECRET, "abcdef", now)).toBeNull();
    expect(verifyTotp(SECRET, "005 924", now)).toBe(Math.floor(now / 30_000));
    expect(verifyTotp("GEZDGNBV", "005924", now)).toBeNull();
  });
});
