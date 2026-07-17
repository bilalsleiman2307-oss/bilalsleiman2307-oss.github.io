import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const site = "https://www.trust-schluesseldienstberlin.de";
const obsoleteEmail = ["trust.schluesseldienstberlin", "gmail.com"].join("@");
const templatePhrases = [
  ["Was kostet", "Ratgeber"].join(" "),
  ["Diese Seite ist auf die", "Suchintention"].join(" "),
  ["Suchintention rund um", "Ratgeber"].join(" ")
];
const errors = [];
const warnings = [];
const ignored = new Set([".git", "assets", "naLogImpressions", "node_modules", "reports", "scripts"]);

function walk(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory() && ignored.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(full));
    else if (entry.name === "index.html" || (dir === root && entry.name.endsWith(".html"))) files.push(full);
  }
  return files;
}

const routeFor = (file) => {
  const relative = path.relative(root, file).replaceAll("\\", "/");
  if (relative === "index.html") return "/";
  if (relative.endsWith("/index.html")) return `/${relative.slice(0, -"index.html".length)}`;
  return `/${relative}`;
};
const decode = (value = "") => value.replace(/<[^>]*>/g, " ").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/\s+/g, " ").trim();
const pages = walk(root).map((file) => ({ file, route: routeFor(file), html: fs.readFileSync(file, "utf8") }));
const routeSet = new Set(pages.map((page) => page.route));
const sitemap = fs.readFileSync(path.join(root, "sitemap.xml"), "utf8");
const sitemapUrls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
const aliasRoutes = new Set([
  "/startseite/", "/schlüsseldienst-köpenick/", "/schlüsseldienst-schöneberg/", "/schlüsseldienst-französisch-buchholz/",
  "/leistung/schlüsseldienst-berlin-türöffnung-notdienst-24h/", "/tür-zugefallen-was-tun/", "/türöffnung-berlin-kosten/",
  "/ratgeber/tuer-zugefallen-pankow/", "/ratgeber/tuer-zugefallen-wedding/",
  "/ratgeber/schluessel-verloren-gesundbrunnen/", "/ratgeber/schluessel-verloren-mitte/"
]);

const canonicalPages = [];
const internalTargets = new Map();
for (const page of pages) {
  const rel = path.relative(root, page.file).replaceAll("\\", "/");
  const titles = [...page.html.matchAll(/<title>([\s\S]*?)<\/title>/gi)];
  const metas = [...page.html.matchAll(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/gi)];
  const canonicals = [...page.html.matchAll(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/gi)].map((m) => m[1]);
  const h1s = [...page.html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)];
  if (titles.length !== 1 || !decode(titles[0]?.[1])) errors.push(`${rel}: genau ein nicht-leerer Titel erwartet`);
  if (metas.length !== 1 || !metas[0]?.[1]) errors.push(`${rel}: genau eine Meta-Description erwartet`);
  if (canonicals.length !== 1) errors.push(`${rel}: genau ein Canonical erwartet`);
  if (h1s.length !== 1 || !decode(h1s[0]?.[1])) errors.push(`${rel}: genau eine nicht-leere H1 erwartet`);
  if (canonicals[0] === `${site}${page.route}`) canonicalPages.push({ ...page, title: decode(titles[0]?.[1] || ""), description: metas[0]?.[1] || "", canonical: canonicals[0] });

  const scripts = [...page.html.matchAll(/<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi)];
  for (const script of scripts) {
    try {
      const json = JSON.parse(script[1]);
      const graph = json["@graph"] || [];
      if (page.route.startsWith("/ratgeber/") || page.route === "/ratgeber/") {
        if (graph.some((item) => item["@type"] === "Service")) errors.push(`${rel}: Ratgeber darf kein Service-Schema enthalten`);
      }
      const faq = graph.find((item) => item["@type"] === "FAQPage");
      for (const question of faq?.mainEntity || []) {
        if (!page.html.includes(question.name) || !page.html.includes(question.acceptedAnswer?.text || "")) errors.push(`${rel}: FAQ-Schema stimmt nicht mit sichtbarem Inhalt überein`);
      }
      if (graph.some((item) => item.aggregateRating || item.review)) errors.push(`${rel}: unerwartete Bewertungsdaten im Schema`);
    } catch (error) {
      errors.push(`${rel}: ungültiges JSON-LD (${error.message})`);
    }
  }

  for (const match of page.html.matchAll(/<(?:a|link|script|img)\b[^>]*(?:href|src)=["']([^"']+)["']/gi)) {
    const href = match[1];
    if (!href.startsWith("/") || href.startsWith("//")) continue;
    const clean = href.split("#")[0].split("?")[0] || "/";
    if (clean.startsWith("/assets/") || clean === "/favicon.ico") {
      if (!fs.existsSync(path.join(root, clean.slice(1).replaceAll("/", path.sep)))) errors.push(`${rel}: Asset fehlt ${clean}`);
      continue;
    }
    if (!internalTargets.has(clean)) internalTargets.set(clean, []);
    internalTargets.get(clean).push(page.route);
    if (!routeSet.has(clean)) errors.push(`${rel}: internes Linkziel fehlt ${clean}`);
    if (aliasRoutes.has(clean) || clean.endsWith(".html")) errors.push(`${rel}: interner Link zeigt auf nicht bevorzugte URL ${clean}`);
  }

  if (page.html.toLowerCase().includes(obsoleteEmail)) errors.push(`${rel}: alte Gmail-Adresse vorhanden`);
  if (/Ramlerstr\. 2(?!a)/i.test(page.html)) errors.push(`${rel}: alte Hausnummer vorhanden`);
  if (templatePhrases.some((phrase) => page.html.includes(phrase))) errors.push(`${rel}: sichtbare Templateformulierung vorhanden`);
  if (!page.html.includes('class="menu-toggle"') || !page.html.includes('id="main-nav"')) errors.push(`${rel}: mobile Navigation unvollständig`);
  if (!page.html.includes(`tel:03040563878`) || !page.html.includes(`https://wa.me/493040563878`)) errors.push(`${rel}: Telefon- oder WhatsApp-Link fehlt`);
}

const titleGroups = Map.groupBy(canonicalPages, (page) => page.title);
for (const [title, group] of titleGroups) if (group.length > 1) errors.push(`Doppelter Titel "${title}": ${group.map((page) => page.route).join(", ")}`);
const descriptionGroups = Map.groupBy(canonicalPages, (page) => page.description);
for (const [description, group] of descriptionGroups) if (group.length > 1) errors.push(`Doppelte Meta-Description "${description}": ${group.map((page) => page.route).join(", ")}`);
for (const page of canonicalPages) if (page.route !== "/" && !internalTargets.has(page.route)) errors.push(`Verwaiste indexierbare Seite: ${page.route}`);

if (!sitemap.startsWith('<?xml version="1.0" encoding="UTF-8"?>') || !sitemap.includes('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"')) errors.push("Sitemap: XML-Kopf oder Namespace fehlt");
if (new Set(sitemapUrls).size !== sitemapUrls.length) errors.push("Sitemap enthält doppelte URLs");
const canonicalUrls = new Set(canonicalPages.map((page) => page.canonical));
for (const url of sitemapUrls) if (!canonicalUrls.has(url)) errors.push(`Sitemap enthält keine bevorzugte Canonical-URL: ${url}`);
for (const url of canonicalUrls) if (!sitemapUrls.includes(url)) errors.push(`Canonical-URL fehlt in Sitemap: ${url}`);
const robots = fs.readFileSync(path.join(root, "robots.txt"), "utf8");
if (!robots.includes(`Sitemap: ${site}/sitemap.xml`)) errors.push("robots.txt verweist nicht auf die richtige Sitemap");
const navigationScript = fs.readFileSync(path.join(root, "assets/js/main.js"), "utf8");
if (!navigationScript.includes("menu-toggle") || !navigationScript.includes("aria-expanded")) errors.push("Navigationsskript enthält keine Menü-Umschaltung");

const pageByRoute = new Map(pages.map((page) => [page.route, page]));
const home = pageByRoute.get("/")?.html || "";
const emergency = pageByRoute.get("/leistung/schlüsselnotdienst/")?.html || "";
const doorOpening = pageByRoute.get("/türöffnung-berlin-24h-notdienst/")?.html || "";
const priceTransition = pageByRoute.get("/türöffnung-berlin-kosten/")?.html || "";
const fallenService = pageByRoute.get("/leistung/öffnung-bei-zugefallenen-türen/")?.html || "";
const fallenGuide = pageByRoute.get("/ratgeber/tuer-zugefallen-berlin/")?.html || "";

if (!home.includes('<h1>Schlüsseldienst Berlin</h1>')) errors.push("Startseite: exakte H1 Schlüsseldienst Berlin fehlt");
if (!home.includes('href="/türöffnung-berlin-24h-notdienst/"><h2>Türöffnung Berlin</h2>')) errors.push("Startseite: starker exakter Link Türöffnung Berlin fehlt");
if (!home.includes('href="/leistung/schlüsselnotdienst/"><h2>Schlüsselnotdienst Berlin</h2>')) errors.push("Startseite: starker exakter Link Schlüsselnotdienst Berlin fehlt");
if (!emergency.includes('<h1>Schlüsselnotdienst Berlin</h1>')) errors.push("Schlüsselnotdienst: exakte H1 fehlt");
for (const href of ["/türöffnung-berlin-24h-notdienst/", "/schlüsseldienst-berlin-preise/", "/leistung/öffnung-bei-zugefallenen-türen/", "/leistung/öffnung-bei-abgeschlossenen-türen/"]) {
  if (!emergency.includes(`href="${href}"`)) errors.push(`Schlüsselnotdienst: Pflichtlink fehlt ${href}`);
}
if (!doorOpening.includes('<h1>Türöffnung Berlin</h1>')) errors.push("Türöffnung: exakte H1 fehlt");
for (const href of ["/leistung/öffnung-bei-zugefallenen-türen/", "/leistung/öffnung-bei-abgeschlossenen-türen/", "/schlüssel-steckt-innen-tür-zu/", "/leistung/schlüsselnotdienst/#schluessel-abgebrochen", "/schlüsseldienst-berlin-preise/"]) {
  if (!doorOpening.includes(`href="${href}"`)) errors.push(`Türöffnung: Szenario- oder Pflichtlink fehlt ${href}`);
}
if (!priceTransition.includes(`<link rel="canonical" href="${site}/schlüsseldienst-berlin-preise/">`) || !priceTransition.includes(`http-equiv="refresh" content="0; url=${site}/schlüsseldienst-berlin-preise/"`)) errors.push("Kosten-Übergangsseite verweist nicht korrekt auf die Preisseite");
if (!fallenService.includes('href="/ratgeber/tuer-zugefallen-berlin/"')) errors.push("Zugefallen-Leistung: Link zum Ratgeber fehlt");
if (!fallenGuide.includes('href="/leistung/öffnung-bei-zugefallenen-türen/"')) errors.push("Zugefallen-Ratgeber: Link zur Leistung fehlt");
for (const price of ["59 €", "79 €", "99 €", "89 €", "109 €", "129 €"]) if (!home.includes(price) || !doorOpening.includes(price)) errors.push(`Veröffentlichter Preis fehlt: ${price}`);
if (!home.includes("105 Bewertungen")) errors.push("Startseite: bestehende Anzahl von 105 Bewertungen fehlt");
if (canonicalPages.some((page) => page.html.includes("Suchintention"))) errors.push("Sichtbare SEO-Templateformulierung Suchintention vorhanden");

const generator = fs.readFileSync(path.join(root, "scripts/build-site.mjs"), "utf8");
if (generator.toLowerCase().includes(obsoleteEmail) || /Ramlerstr\. 2(?!a)/i.test(generator)) errors.push("Alte Kontaktdaten in zentraler Build-Quelle vorhanden");

console.log(JSON.stringify({ pages: pages.length, canonicalPages: canonicalPages.length, sitemapUrls: sitemapUrls.length, errors: errors.length, warnings: warnings.length }, null, 2));
for (const error of errors) console.error(`ERROR ${error}`);
for (const warning of warnings) console.warn(`WARN ${warning}`);
if (errors.length) process.exit(1);
