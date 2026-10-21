/** Dates in the admin area, always in Swiss time. */

const day = new Intl.DateTimeFormat("de-CH", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Zurich" });
const short = new Intl.DateTimeFormat("de-CH", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "Europe/Zurich" });
const time = new Intl.DateTimeFormat("de-CH", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Zurich" });

/** 21. Oktober 2026 */
export function formatDay(d: Date): string {
  return day.format(d);
}

/** 21.10.2026, 14:05 Uhr */
export function formatDateTime(d: Date): string {
  return `${short.format(d)}, ${time.format(d)} Uhr`;
}

/** 21. Oktober 2026, 14:05 Uhr */
export function formatDayTime(d: Date): string {
  return `${day.format(d)}, ${time.format(d)} Uhr`;
}
