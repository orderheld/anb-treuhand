import { absoluteUrl } from "@/config/site";

/**
 * HTML building blocks of the e-mails: tables and inline styles only, so the mails look the same
 * in Outlook, Gmail and Apple Mail. Colours as on the website. The header shows the e-mail logo of
 * the corporate design package (public/email, white ground with 12 px margin, so it stays legible
 * in dark mode); where a mail program blocks images, its alt text names the sender.
 */

const C = {
  forest: "#1C382A",
  accent: "#2D6A4F",
  ink: "#1D1D1F",
  body: "#424245",
  muted: "#6E6E73",
  mist: "#F5F6F5",
  line: "#E4E7E4",
  white: "#FFFFFF",
};

const SANS = "'Helvetica Neue',Helvetica,Arial,sans-serif";

export function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

/** Line breaks of visitor text become <br>, after escaping. */
export function escapeMultiline(value: string): string {
  return escapeHtml(value).replace(/\r?\n/g, "<br>");
}

export function heading(text: string): string {
  return `<h2 style="margin:32px 0 12px;font-family:${SANS};font-size:19px;line-height:1.3;font-weight:600;color:${C.ink}">${escapeHtml(text)}</h2>`;
}

export function paragraph(html: string, muted = false): string {
  return `<p style="margin:0 0 14px;font-family:${SANS};font-size:15px;line-height:1.6;color:${muted ? C.muted : C.body}">${html}</p>`;
}

/** Two-column table of label and value. Values are HTML (escape before). */
export function keyValueTable(rows: [string, string][]): string {
  const body = rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:9px 16px 9px 0;border-top:1px solid ${C.line};font-family:${SANS};font-size:14px;color:${C.muted};vertical-align:top;width:42%">${escapeHtml(label)}</td><td style="padding:9px 0;border-top:1px solid ${C.line};font-family:${SANS};font-size:14px;color:${C.ink};vertical-align:top">${value}</td></tr>`,
    )
    .join("");
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border-bottom:1px solid ${C.line}">${body}</table>`;
}

/** Positions of a price estimate with right-aligned amounts. */
export function linesTable(lines: { label: string; detail?: string; amount: string; external?: boolean }[]): string {
  const body = lines
    .map(
      (l) =>
        `<tr><td style="padding:10px 16px 10px 0;border-top:1px solid ${C.line};font-family:${SANS};font-size:14px;color:${C.ink};vertical-align:top">${escapeHtml(l.label)}${l.external ? ` <span style="color:${C.muted}">(extern)</span>` : ""}${l.detail ? `<br><span style="font-size:12px;color:${C.muted}">${escapeHtml(l.detail)}</span>` : ""}</td><td style="padding:10px 0;border-top:1px solid ${C.line};font-family:${SANS};font-size:14px;color:${C.ink};text-align:right;white-space:nowrap;vertical-align:top">${escapeHtml(l.amount)}</td></tr>`,
    )
    .join("");
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse">${body}</table>`;
}

/** Highlighted totals block (light grey, the first value large). */
export function totalsBlock(rows: [string, string][]): string {
  const body = rows
    .map(
      ([label, value], i) =>
        `<tr><td style="padding:${i === 0 ? "0" : "8px"} 16px 0 0;font-family:${SANS};font-size:13px;color:${C.muted}">${escapeHtml(label)}</td><td style="padding:${i === 0 ? "0" : "8px"} 0 0;font-family:${SANS};font-size:${i === 0 ? "22px" : "15px"};font-weight:${i === 0 ? "bold" : "normal"};color:${C.ink};text-align:right;white-space:nowrap">${escapeHtml(value)}</td></tr>`,
    )
    .join("");
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:16px;background:${C.mist};border-radius:12px"><tr><td style="padding:20px 22px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0">${body}</table></td></tr></table>`;
}

export function referenceLine(reference: string): string {
  return `<p style="margin:24px 0 0;font-family:${SANS};font-size:13px;color:${C.muted}">Referenz: <strong style="color:${C.ink};letter-spacing:0.5px">${escapeHtml(reference)}</strong></p>`;
}

/** The whole mail. `preheader` is the preview line in the inbox. */
export function layout({ title, preheader, content, footer }: { title: string; preheader: string; content: string; footer: string }): string {
  return `<!doctype html>
<html lang="de-CH">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light">
<title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background:${C.mist}">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent">${escapeHtml(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.mist}">
<tr><td align="center" style="padding:32px 12px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:${C.white};border-radius:16px;overflow:hidden">
<tr><td style="padding:16px 24px 12px;border-bottom:1px solid ${C.line}">
<img src="${escapeHtml(absoluteUrl("/email/E-Mail-Signatur_Logo@2x.png"))}" width="253" height="64" alt="ANB Treuhand" style="display:block;width:253px;height:64px;border:0;outline:none;text-decoration:none;font-family:${SANS};font-size:20px;font-weight:600;color:${C.forest}">
</td></tr>
<tr><td style="padding:34px 36px 30px">
<h1 style="margin:0 0 18px;font-family:${SANS};font-size:24px;line-height:1.25;font-weight:600;color:${C.ink}">${escapeHtml(title)}</h1>
${content}
</td></tr>
<tr><td style="padding:22px 36px;background:${C.mist};border-top:1px solid ${C.line};font-family:${SANS};font-size:12px;line-height:1.6;color:${C.muted}">${footer}</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

export const emailColors = C;
