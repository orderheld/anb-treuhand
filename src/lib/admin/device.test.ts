import { describe, expect, it } from "vitest";
import { describeUserAgent } from "./device";

describe("describeUserAgent", () => {
  it("names browser and system", () => {
    expect(
      describeUserAgent("Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1"),
    ).toBe("Safari auf iPhone");
    expect(
      describeUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36 Edg/141.0.0.0"),
    ).toBe("Edge auf Windows");
    expect(describeUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36")).toBe(
      "Chrome auf Mac",
    );
    expect(describeUserAgent("Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/141.0 Mobile/15E148 Safari/604.1")).toBe(
      "Chrome auf iPhone",
    );
    expect(describeUserAgent("Mozilla/5.0 (Android 15; Mobile; rv:143.0) Gecko/143.0 Firefox/143.0")).toBe("Firefox auf Android");
  });

  it("falls back for unknown or missing values", () => {
    expect(describeUserAgent(null)).toBe("Unbekanntes Gerät");
    expect(describeUserAgent("curl/8.5.0")).toBe("Unbekanntes Gerät");
  });
});
