/**
 * Launch check, before and after the domain goes live.
 *
 *   npm run check:launch
 *   npm run check:launch -- https://www.anb-treuhand.ch
 *
 * Without a URL it lists the values in src/config/site.ts that the client still has to
 * confirm. With a URL it also checks the live site: pages, security headers, indexing, admin
 * area, retention job and e-mail signatures. Exits with 1 when something is wrong.
 */
import { site, unconfirmedFields } from "../src/config/site.ts";

let failed = 0;
const ok = (text: string) => console.log(`  ✓ ${text}`);
const warn = (text: string) => console.log(`  ⚠ ${text}`);
const bad = (text: string) => {
  failed++;
  console.log(`  ✗ ${text}`);
};

console.log(`\n${site.brand}: Startprüfung\n`);
console.log("Angaben in src/config/site.ts");
const open = unconfirmedFields();
if (open.length === 0) ok("Alle Angaben sind bestätigt.");
for (const field of open) warn(`${field.field}: ${field.note ?? "noch nicht bestätigt"}`);

const base = process.argv[2]?.replace(/\/$/, "");
if (!base) {
  console.log("\nFür die Prüfung der Live-Seite die Adresse anhängen: npm run check:launch -- https://www.anb-treuhand.ch\n");
  process.exit(failed ? 1 : 0);
}

async function get(path: string, init: RequestInit = {}): Promise<Response> {
  return fetch(`${base}${path}`, { redirect: "manual", ...init, headers: { "user-agent": "anb-launch-check", ...init.headers } });
}

console.log(`\nLive-Seite ${base}`);

const home = await get("/");
if (home.status !== 200) bad(`Startseite antwortet mit ${home.status}`);
else ok("Startseite erreichbar");
const html = await home.text();
const noindex = /<meta name="robots" content="[^"]*noindex/.test(html);
const vercelApp = new URL(base).hostname.endsWith(".vercel.app");
if (vercelApp) {
  if (noindex) ok("Vercel-Adresse ist für Suchmaschinen gesperrt (richtig, bis die Domain verbunden ist)");
  else bad("Vercel-Adresse ist indexierbar");
} else if (noindex) {
  bad("Die Seite ist für Suchmaschinen gesperrt: nach dem Verbinden der Domain einmal neu deployen (Redeploy)");
} else {
  ok("Für Suchmaschinen freigegeben");
}

const headers: [string, string][] = [
  ["content-security-policy", "Content-Security-Policy"],
  ["strict-transport-security", "HSTS"],
  ["x-frame-options", "X-Frame-Options"],
  ["x-content-type-options", "X-Content-Type-Options"],
  ["referrer-policy", "Referrer-Policy"],
];
const missing = headers.filter(([name]) => !home.headers.get(name)).map(([, label]) => label);
if (missing.length) bad(`Sicherheits-Header fehlen: ${missing.join(", ")}`);
else ok("Sicherheits-Header gesetzt");

for (const path of ["/leistungen", "/immobilien", "/rechner", "/rechner/treuhand", "/rechner/firmengruendung", "/rechner/immobilien", "/kontakt", "/impressum", "/datenschutz"]) {
  const res = await get(path);
  if (res.status !== 200) bad(`${path} antwortet mit ${res.status}`);
}
ok("Unterseiten geprüft");

const robots = await get("/robots.txt");
const robotsText = await robots.text();
if (robots.status !== 200) bad("robots.txt fehlt");
else if (!vercelApp && !robotsText.includes("Sitemap:")) bad("robots.txt nennt keine Sitemap");
else ok("robots.txt vorhanden");

const sitemap = await get("/sitemap.xml");
const urls = (await sitemap.text()).match(/<loc>([^<]+)<\/loc>/g) ?? [];
if (sitemap.status !== 200 || urls.length === 0) bad("sitemap.xml fehlt oder ist leer");
else if (!vercelApp && !urls.every((u) => u.includes(new URL(base).host))) bad("Die Sitemap zeigt auf eine andere Adresse: NEXT_PUBLIC_SITE_URL prüfen");
else ok(`Sitemap mit ${urls.length} Seiten`);

const admin = await get("/admin");
const target = admin.headers.get("location") ?? "";
if (admin.status >= 300 && admin.status < 400 && target.includes("/admin/login")) ok("Admin-Bereich verlangt die Anmeldung");
else bad(`/admin leitet nicht zur Anmeldung (Status ${admin.status})`);
const login = await get("/admin/login");
if (!/noindex/.test(login.headers.get("x-robots-tag") ?? "")) bad("Admin-Anmeldung ohne X-Robots-Tag noindex");
if (!/no-store/.test(login.headers.get("cache-control") ?? "")) bad("Admin-Anmeldung wird zwischengespeichert (Cache-Control)");
const setup = await (await get("/admin/einrichtung")).text();
if (setup.includes("Der Admin-Bereich ist eingerichtet.")) ok("Admin-Bereich eingerichtet (Datenbank, Passwort, Zwei-Faktor-Code)");
else warn("Admin-Bereich noch nicht eingerichtet: /admin/einrichtung öffnen");

const cron = await get("/api/cron/retention");
if (cron.status === 401) ok("Löschjob geschützt (CRON_SECRET gesetzt)");
else if (cron.status === 200) warn("Löschjob läuft ohne Datenbank: Anfragen werden nur per E-Mail zugestellt");
else bad(`Löschjob meldet ${cron.status}: CRON_SECRET in Vercel prüfen`);

const logo = await get("/signatur/anb-logo.png");
if (logo.status === 200 && logo.headers.get("content-type")?.startsWith("image/png")) ok("Bilder der E-Mail-Signatur erreichbar");
else bad(`/signatur/anb-logo.png antwortet mit ${logo.status}`);

if (!vercelApp) {
  const host = new URL(base).hostname;
  const other = host.startsWith("www.") ? host.slice(4) : `www.${host}`;
  try {
    const res = await fetch(`https://${other}/`, { redirect: "manual" });
    const location = res.headers.get("location") ?? "";
    if (res.status >= 300 && res.status < 400 && location.includes(host)) ok(`${other} leitet auf ${host} weiter`);
    else warn(`${other} leitet nicht auf ${host} weiter (Status ${res.status}): in Vercel unter Domains einstellen`);
  } catch {
    warn(`${other} ist nicht erreichbar: DNS-Eintrag bei cyon prüfen`);
  }
}

console.log(failed ? `\n${failed} Problem${failed === 1 ? "" : "e"} gefunden.\n` : "\nAlles in Ordnung.\n");
process.exit(failed ? 1 : 0);
