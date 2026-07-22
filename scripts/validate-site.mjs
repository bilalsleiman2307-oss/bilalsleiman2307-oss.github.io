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

const alternateSet = [
  ["de", `${site}/`],
  ["en", `${site}/en/locksmith-berlin/`],
  ["es", `${site}/es/cerrajero-berlin/`],
  ["pt-BR", `${site}/pt/chaveiro-berlim/`],
  ["x-default", `${site}/`]
];
const internationalExpectations = [
  {
    route: "/en/locksmith-berlin/",
    lang: "en",
    hreflang: "en",
    locale: "en_GB",
    title: "24/7 Locksmith Berlin | Door Opening & Emergency Service",
    description: "Locked out in Berlin? Door opening from €59, 24/7 emergency locksmith service and arrival in 10–30 minutes throughout Berlin. Call now.",
    h1: "24/7 Locksmith in Berlin – Fast Help in 10–30 Minutes",
    metaPrice: "Door opening from €59",
    heroFacts: ["Door opening from €59", "24/7 availability", "arrival in 10–30 minutes", "throughout Berlin"]
  },
  {
    route: "/es/cerrajero-berlin/",
    lang: "es",
    hreflang: "es",
    locale: "es_ES",
    title: "Cerrajero 24 horas en Berlín | Apertura de puertas",
    description: "¿Te has quedado fuera en Berlín? Apertura de puertas desde 59 €, cerrajero 24 horas y llegada en 10–30 minutos en todo Berlín. Llámanos.",
    h1: "Cerrajero 24 horas en Berlín – Ayuda rápida en 10–30 minutos",
    metaPrice: "Apertura de puertas desde 59 €",
    heroFacts: ["apertura de puertas en todo Berlín desde 59 €", "servicio 24 horas", "llegada en 10–30 minutos"]
  },
  {
    route: "/pt/chaveiro-berlim/",
    lang: "pt-BR",
    hreflang: "pt-BR",
    locale: "pt_BR",
    title: "Chaveiro 24 horas em Berlim | Abertura de portas",
    description: "Ficou trancado para fora em Berlim? Abertura de portas a partir de 59 €, chaveiro 24 horas e chegada em 10–30 minutos. Ligue agora.",
    h1: "Chaveiro 24 horas em Berlim – Ajuda rápida em 10–30 minutos",
    metaPrice: "Abertura de portas a partir de 59 €",
    heroFacts: ["abertura de portas em toda Berlim a partir de 59 €", "atendimento 24 horas", "chegada em 10–30 minutos"]
  }
];

for (const expectation of internationalExpectations) {
  const page = pageByRoute.get(expectation.route);
  if (!page) { errors.push(`Internationale Seite fehlt: ${expectation.route}`); continue; }
  const html = page.html;
  const lang = html.match(/<html\s+lang="([^"]+)"/i)?.[1];
  const title = decode(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || "");
  const description = html.match(/<meta\s+name="description"\s+content="([^"]+)"/i)?.[1] || "";
  const canonical = html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i)?.[1];
  if (lang !== expectation.lang) errors.push(`${expectation.route}: lang muss ${expectation.lang} sein`);
  if (title !== expectation.title) errors.push(`${expectation.route}: SEO-Titel stimmt nicht`);
  if (description !== expectation.description) errors.push(`${expectation.route}: Meta Description stimmt nicht`);
  if (!description.includes(expectation.metaPrice)) errors.push(`${expectation.route}: Preisformulierung fehlt in Meta Description`);
  if (canonical !== `${site}${expectation.route}`) errors.push(`${expectation.route}: Canonical ist nicht selbstreferenzierend`);
  if (/noindex/i.test(html)) errors.push(`${expectation.route}: darf nicht noindex sein`);
  if (!html.includes(`<h1>${expectation.h1}</h1>`)) errors.push(`${expectation.route}: vorgegebene H1 fehlt`);
  for (const fact of expectation.heroFacts) if (!html.includes(fact)) errors.push(`${expectation.route}: Hero-Fakt fehlt: ${fact}`);
  const priceToken = expectation.hreflang === "en" ? "€59" : "59 €";
  if ((html.split(priceToken).length - 1) < 4) errors.push(`${expectation.route}: Preis muss in Hero, Meta, Preisbereich und FAQ vorkommen`);
  if ((html.match(/<details class="faq-item">/g) || []).length < 8) errors.push(`${expectation.route}: mindestens acht sichtbare FAQ erwartet`);
  if (!html.includes(`property="og:locale" content="${expectation.locale}"`)) errors.push(`${expectation.route}: falsches og:locale`);
  for (const [code, href] of alternateSet) {
    const pattern = `<link rel="alternate" hreflang="${code}" href="${href}">`;
    if ((html.split(pattern).length - 1) !== 1) errors.push(`${expectation.route}: hreflang ${code} fehlt oder ist doppelt`);
  }
  for (const href of ["/", "/en/locksmith-berlin/", "/es/cerrajero-berlin/", "/pt/chaveiro-berlim/"]) if (!html.includes(`href="${href}"`)) errors.push(`${expectation.route}: Sprachlink fehlt ${href}`);
  if (/href="\/(?:leistung|ratgeber|schlüsseldienst-berlin-preise|türöffnung)/i.test(html)) errors.push(`${expectation.route}: unnötiger Link auf deutsche Unterseite vorhanden`);
  if (/(?:79|89|99|109|129)\s*€/u.test(html)) errors.push(`${expectation.route}: zusätzlicher Preis außer 59 € vorhanden`);
  const ldScripts = [...html.matchAll(/<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/gi)].map((match) => JSON.parse(match[1]));
  const graph = ldScripts.flatMap((json) => json["@graph"] || []);
  for (const type of ["Locksmith", "WebPage", "Service", "FAQPage"]) if (!graph.some((item) => item["@type"] === type)) errors.push(`${expectation.route}: Schema-Typ ${type} fehlt`);
  const webpage = graph.find((item) => item["@type"] === "WebPage");
  if (webpage?.inLanguage !== expectation.lang) errors.push(`${expectation.route}: WebPage inLanguage stimmt nicht`);
  const visibleMain = html.match(/<main>([\s\S]*?)<\/main>/i)?.[1] || "";
  if (expectation.hreflang === "es" && /\b(?:você|chaveiro|fechadura|serviço|preço|ligue)\b/iu.test(visibleMain)) errors.push(`${expectation.route}: portugiesische Begriffe im spanischen Hauptinhalt`);
  if (expectation.hreflang === "pt-BR" && /\b(?:cerrajero|cerradura|llaves|llamar|puerta)\b/iu.test(visibleMain)) errors.push(`${expectation.route}: spanische Begriffe im portugiesischen Hauptinhalt`);
}

for (const [code, href] of alternateSet) {
  const pattern = `<link rel="alternate" hreflang="${code}" href="${href}">`;
  if ((home.split(pattern).length - 1) !== 1) errors.push(`Startseite: hreflang ${code} fehlt oder ist doppelt`);
}
if (!home.includes('property="og:locale" content="de_DE"')) errors.push("Startseite: og:locale de_DE fehlt");
for (const href of ["/en/locksmith-berlin/", "/es/cerrajero-berlin/", "/pt/chaveiro-berlim/"]) if (!home.includes(`href="${href}"`)) errors.push(`Startseite: Sprachumschalter-Link fehlt ${href}`);

const generator = fs.readFileSync(path.join(root, "scripts/build-site.mjs"), "utf8");
if (generator.toLowerCase().includes(obsoleteEmail) || /Ramlerstr\. 2(?!a)/i.test(generator)) errors.push("Alte Kontaktdaten in zentraler Build-Quelle vorhanden");

console.log(JSON.stringify({ pages: pages.length, canonicalPages: canonicalPages.length, sitemapUrls: sitemapUrls.length, errors: errors.length, warnings: warnings.length }, null, 2));
for (const error of errors) console.error(`ERROR ${error}`);
for (const warning of warnings) console.warn(`WARN ${warning}`);
if (errors.length) process.exit(1);
