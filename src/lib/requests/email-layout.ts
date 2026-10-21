/**
 * HTML building blocks of the e-mails: tables and inline styles only, so the mails look the same
 * in Outlook, Gmail and Apple Mail. Colours from the corporate design; the header imitates the
 * logo with system fonts (no remote images, which many mail programs block).
 */

const C = {
  forest: "#1C382A",
  copper: "#D3A17C",
  bronze: "#8F5F3B",
  cream: "#F7EFE3",
  sand: "#E3D6C2",
  body: "#3C4A42",
  muted: "#56655B",
  white: "#FFFFFF",
};

const SANS = "'Helvetica Neue',Helvetica,Arial,sans-serif";
const SERIF = "'Bodoni 72',Didot,'Bodoni MT',Georgia,'Times New Roman',serif";

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
  return `<h2 style="margin:32px 0 12px;font-family:${SERIF};font-size:21px;line-height:1.3;font-weight:normal;color:${C.forest}">${escapeHtml(text)}</h2>`;
}

export function paragraph(html: string, muted = false): string {
  return `<p style="margin:0 0 14px;font-family:${SANS};font-size:15px;line-height:1.6;color:${muted ? C.muted : C.body}">${html}</p>`;
}

/** Two-column table of label and value. Values are HTML (escape before). */
export function keyValueTable(rows: [string, string][]): string {
  const body = rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:9px 16px 9px 0;border-top:1px solid ${C.sand};font-family:${SANS};font-size:14px;color:${C.muted};vertical-align:top;width:42%">${escapeHtml(label)}</td><td style="padding:9px 0;border-top:1px solid ${C.sand};font-family:${SANS};font-size:14px;color:${C.forest};vertical-align:top">${value}</td></tr>`,
    )
    .join("");
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border-bottom:1px solid ${C.sand}">${body}</table>`;
}

/** Positions of a price estimate with right-aligned amounts. */
export function linesTable(lines: { label: string; detail?: string; amount: string; external?: boolean }[]): string {
  const body = lines
    .map(
      (l) =>
        `<tr><td style="padding:10px 16px 10px 0;border-top:1px solid ${C.sand};font-family:${SANS};font-size:14px;color:${C.forest};vertical-align:top">${escapeHtml(l.label)}${l.external ? ` <span style="color:${C.muted}">(extern)</span>` : ""}${l.detail ? `<br><span style="font-size:12px;color:${C.muted}">${escapeHtml(l.detail)}</span>` : ""}</td><td style="padding:10px 0;border-top:1px solid ${C.sand};font-family:${SANS};font-size:14px;color:${C.forest};text-align:right;white-space:nowrap;vertical-align:top">${escapeHtml(l.amount)}</td></tr>`,
    )
    .join("");
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse">${body}</table>`;
}

/** Highlighted totals block (green with copper labels). */
export function totalsBlock(rows: [string, string][]): string {
  const body = rows
    .map(
      ([label, value], i) =>
        `<tr><td style="padding:${i === 0 ? "0" : "8px"} 16px 0 0;font-family:${SANS};font-size:13px;letter-spacing:0.5px;color:${C.copper}">${escapeHtml(label)}</td><td style="padding:${i === 0 ? "0" : "8px"} 0 0;font-family:${i === 0 ? SERIF : SANS};font-size:${i === 0 ? "24px" : "15px"};color:${C.white};text-align:right;white-space:nowrap">${escapeHtml(value)}</td></tr>`,
    )
    .join("");
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:16px;background:${C.forest};border-radius:12px"><tr><td style="padding:20px 22px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0">${body}</table></td></tr></table>`;
}

export function referenceLine(reference: string): string {
  return `<p style="margin:24px 0 0;font-family:${SANS};font-size:13px;color:${C.muted}">Referenz: <strong style="color:${C.forest};letter-spacing:0.5px">${escapeHtml(reference)}</strong></p>`;
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
<body style="margin:0;padding:0;background:${C.cream}">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent">${escapeHtml(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.cream}">
<tr><td align="center" style="padding:32px 12px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:${C.white};border-radius:16px;overflow:hidden">
<tr><td style="background:${C.forest};padding:30px 36px 26px">
<div style="font-family:${SERIF};font-size:30px;line-height:1;letter-spacing:3px;color:${C.white}">ANB</div>
<table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:10px"><tr>
<td style="width:22px;border-top:1px solid ${C.copper};font-size:0;line-height:0">&nbsp;</td>
<td style="padding:0 10px;font-family:${SANS};font-size:10px;letter-spacing:4px;color:${C.white}">TREUHAND</td>
<td style="width:22px;border-top:1px solid ${C.copper};font-size:0;line-height:0">&nbsp;</td>
</tr></table>
</td></tr>
<tr><td style="padding:34px 36px 30px">
<h1 style="margin:0 0 18px;font-family:${SERIF};font-size:27px;line-height:1.2;font-weight:normal;color:${C.forest}">${escapeHtml(title)}</h1>
${content}
</td></tr>
<tr><td style="padding:22px 36px;background:${C.cream};border-top:1px solid ${C.sand};font-family:${SANS};font-size:12px;line-height:1.6;color:${C.muted}">${footer}</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

export const emailColors = C;
