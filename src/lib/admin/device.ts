/**
 * A readable name for a browser's user agent, e.g. "Safari auf iPhone". Only for recognising
 * one's own devices in the list of sessions; user agents can be faked.
 */
export function describeUserAgent(ua: string | null | undefined): string {
  if (!ua) return "Unbekanntes Gerät";
  const browser = /Edg(e|A|iOS)?\//.test(ua)
    ? "Edge"
    : /OPR\/|Opera/.test(ua)
      ? "Opera"
      : /Firefox\/|FxiOS\//.test(ua)
        ? "Firefox"
        : /SamsungBrowser\//.test(ua)
          ? "Samsung Internet"
          : /Chrome\/|CriOS\//.test(ua)
            ? "Chrome"
            : /Safari\//.test(ua)
              ? "Safari"
              : null;
  const system = /iPhone/.test(ua)
    ? "iPhone"
    : /iPad/.test(ua)
      ? "iPad"
      : /Android/.test(ua)
        ? "Android"
        : /Windows/.test(ua)
          ? "Windows"
          : /CrOS/.test(ua)
            ? "ChromeOS"
            : /Macintosh|Mac OS X/.test(ua)
              ? "Mac"
              : /Linux/.test(ua)
                ? "Linux"
                : null;
  if (browser && system) return `${browser} auf ${system}`;
  return browser ?? system ?? "Unbekanntes Gerät";
}
