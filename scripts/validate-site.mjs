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
      for (const service of graph.filter((item) => item["@type"] === "Service")) {
        if ("inLanguage" in service) errors.push(`${rel}: inLanguage ist im Service-Schema nicht zulässig`);
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
  if (/\+49\s*163\s*8516782/.test(page.html)) errors.push(`${rel}: alte Mobilnummer vorhanden`);
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

const homeTitle = decode(home.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || "");
const homeDescription = home.match(/<meta\s+name="description"\s+content="([^"]+)"/i)?.[1] || "";
const homeMain = home.match(/<main>([\s\S]*?)<\/main>/i)?.[1] || "";
const homeVisibleWords = decode(homeMain).split(/\s+/u).filter(Boolean).length;
if (homeTitle !== "Trust Schlüsseldienst Berlin ab 59 € | Festpreis am Telefon") errors.push("Startseite: vorgesehener HTML-Title stimmt nicht");
if (homeDescription.length < 145 || homeDescription.length > 160) errors.push(`Startseite: Meta Description hat ${homeDescription.length} statt 145–160 Zeichen`);
if (!home.includes('<h1><span class="home-h1-brand">Trust Schlüsseldienst Berlin</span><span class="home-h1-offer"> – Türöffnung ab 59 €</span></h1>')) errors.push("Startseite: vorgegebene H1 fehlt");
if (!home.includes("Tür zugefallen, ausgesperrt, Schlüssel verloren oder Schloss defekt?")) errors.push("Startseite: neuer Hero-Einleitungstext fehlt");
if (!home.includes('class="home-hero-rating"') || !home.includes("5,0</strong> · 105 Bewertungen")) errors.push("Startseite: kompakter Google-Hinweis fehlt");
if ((home.match(/<li>[^<]+<\/li>/g) || []).filter((item) => /24\/7 Schlüsselnotdienst|10–30 Minuten|ohne Beschädigung|Festpreis vor der Anfahrt/.test(item)).length < 4) errors.push("Startseite: vier Vertrauenspunkte fehlen");
if (!home.includes('<h2>Preise für die Türöffnung bei zugefallener Tür</h2>')) errors.push("Startseite: Preisüberschrift fehlt");
if (!home.includes('</section><section id="preise" class="section-soft home-price-section">')) errors.push("Startseite: Preisbereich folgt nicht direkt auf den Hero");
if ((home.match(/class="home-door-price-item(?: home-door-price-item-wide)?"/g) || []).length !== 3) errors.push("Startseite: drei Trust-Preisblöcke erwartet");
if (!home.includes('href="tel:03040563878"') || !home.includes('href="/schlüsseldienst-berlin-preise/">Alle Preise ansehen</a>')) errors.push("Startseite: Preisaktionen fehlen");
if ((home.match(/class="home-action-svg/g) || []).length < 3 || !home.includes('class="home-action-svg home-whatsapp-svg"')) errors.push("Startseite: Telefon- oder WhatsApp-SVG fehlt");
if (!home.includes('</section><section class="home-after-price" id="türsituationen">')) errors.push("Startseite: Trust-Informationsbereich folgt nicht direkt auf den Preisbereich");
if (!home.includes("So läuft eine Türöffnung bei Trust ab") || !home.includes("Vor dem Auftrag geklärt")) errors.push("Startseite: Ablauf oder Transparenzhinweise nach der Preisliste fehlen");
if (home.includes("BSD Schlüsseldienst")) errors.push("Startseite: fremder Markenname im Inhalt vorhanden");
if (homeVisibleWords < 1400 || homeVisibleWords > 1900) errors.push(`Startseite: sichtbarer Hauptinhalt hat ${homeVisibleWords} statt 1400–1900 Wörter`);
if (!home.includes('name="twitter:title"') || !home.includes('name="twitter:description"')) errors.push("Startseite: Twitter-Titel oder -Beschreibung fehlt");
for (const href of ["/türöffnung-berlin-24h-notdienst/", "/leistung/schlüsselnotdienst/", "/schlüsseldienst-berlin-preise/", "/leistung/öffnung-bei-zugefallenen-türen/", "/leistung/öffnung-bei-abgeschlossenen-türen/", "/leistung/schlüsselnotdienst/#schluessel-abgebrochen", "/schlüssel-steckt-innen-tür-zu/", "/leistung/schlosswechsel-berlin-schlösser-schnell-sicher-wechseln/", "/leistung/sicherheitstechnik-berlin-einbruchschutz-vom-profi/", "/#kontakt", "/schlüsseldienst-gesundbrunnen/", "/schlüsseldienst-wedding/", "/schlüsseldienst-prenzlauerberg/", "/schlüsseldienst-pankow/", "/schlüsseldienst-mitte/", "/schlüsseldienst-reinickendorf/"]) {
  if (!home.includes(`href="${href}"`)) errors.push(`Startseite: Pflichtlink fehlt ${href}`);
}
if ((home.match(/<details class="faq-item">/g) || []).length !== 8) errors.push("Startseite: genau acht sichtbare FAQ erwartet");
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
for (const price of ["59 €", "79 €", "99 €"]) if (!home.includes(price)) errors.push(`Startseite: Trust-Preis fehlt: ${price}`);
for (const price of ["59 €", "79 €", "99 €", "89 €", "109 €", "129 €"]) if (!doorOpening.includes(price)) errors.push(`Türöffnung: veröffentlichter Preis fehlt: ${price}`);
if (!home.includes("105 Bewertungen")) errors.push("Startseite: bestehende Anzahl von 105 Bewertungen fehlt");
if (canonicalPages.some((page) => page.html.includes("Suchintention"))) errors.push("Sichtbare SEO-Templateformulierung Suchintention vorhanden");

const alternateSet = [
  ["de", `${site}/`],
  ["en", `${site}/en/locksmith-berlin/`],
  ["es", `${site}/es/cerrajero-berlin/`],
  ["pt-BR", `${site}/pt/chaveiro-berlim/`],
  ["x-default", `${site}/`]
];
const languageOptions = [
  ["de", "/", "DE", "Deutsch"],
  ["en", "/en/locksmith-berlin/", "EN", "English"],
  ["es", "/es/cerrajero-berlin/", "ES", "Español"],
  ["pt-BR", "/pt/chaveiro-berlim/", "PT", "Português"]
];

function validateLanguageDropdown(html, currentCode, context) {
  const current = languageOptions.find(([code]) => code === currentCode);
  const menu = html.match(/<div class="language-menu"[^>]*>([\s\S]*?)<\/div>/i)?.[1] || "";
  const nav = html.match(/<nav id="main-nav"[^>]*>([\s\S]*?)<\/nav>/i)?.[1] || "";
  if (!current || !html.includes(`<button class="language-toggle"`) || !html.includes(`<span>${current?.[2]}</span>`)) errors.push(`${context}: aktuelles Sprachkürzel fehlt`);
  if (!html.includes('aria-haspopup="true"') || !html.includes('aria-expanded="false"') || !html.includes('aria-controls="language-menu"')) errors.push(`${context}: ARIA-Angaben des Sprachmenüs fehlen`);
  if ((menu.match(/role="menuitem"/g) || []).length !== 3) errors.push(`${context}: Sprachmenü muss genau drei Optionen enthalten`);
  for (const [, href, , label] of languageOptions.filter(([code]) => code !== currentCode)) if (!menu.includes(`href="${href}"`) || !menu.includes(`>${label}</a>`)) errors.push(`${context}: Sprachoption fehlt: ${label}`);
  if (current && menu.includes(`href="${current[1]}"`)) errors.push(`${context}: aktuelle Sprache darf nicht im Dropdown stehen`);
  if (nav.includes("language-switcher")) errors.push(`${context}: Sprachumschalter steht noch in der Hauptnavigation`);
}
const internationalExpectations = [
  {
    route: "/en/locksmith-berlin/",
    lang: "en",
    hreflang: "en",
    locale: "en_GB",
    title: "Locksmith Berlin – 24/7 Door Opening from €59 | Trust",
    description: "Locksmith Berlin available 24/7. Damage-free opening of shut, unlocked doors from €59, arrival in around 10–30 minutes and fixed price by phone.",
    h1: "Locksmith Berlin – 24/7 Door Opening from €59",
    metaPrice: "from €59",
    heroFacts: ["24/7 emergency service", "Arrival in around 10–30 minutes", "Fixed price agreed by phone", "Shut, unlocked doors opened without damage"]
  },
  {
    route: "/es/cerrajero-berlin/",
    lang: "es",
    hreflang: "es",
    locale: "es_ES",
    title: "Cerrajero en Berlín 24 horas desde 59 € | Trust",
    description: "Cerrajero en Berlín disponible 24 horas. Apertura sin daños de puertas cerradas sin llave desde 59 €, llegada en 10–30 minutos y precio fijo por teléfono.",
    h1: "Cerrajero en Berlín 24 horas – Apertura desde 59 €",
    metaPrice: "desde 59 €",
    heroFacts: ["Servicio urgente 24 horas", "Llegada aproximada en 10–30 minutos", "Precio fijo acordado por teléfono", "Puertas cerradas sin llave, apertura sin daños"]
  },
  {
    route: "/pt/chaveiro-berlim/",
    lang: "pt-BR",
    hreflang: "pt-BR",
    locale: "pt_BR",
    title: "Chaveiro em Berlim 24 horas a partir de 59 € | Trust",
    description: "Chaveiro em Berlim disponível 24 horas. Abertura sem danos de portas apenas fechadas a partir de 59 €, chegada em 10–30 minutos e preço fixo por telefone.",
    h1: "Chaveiro em Berlim 24 horas – Abertura a partir de 59 €",
    metaPrice: "a partir de 59 €",
    heroFacts: ["Atendimento de emergência 24 horas", "Chegada aproximada em 10–30 minutos", "Preço fixo combinado por telefone", "Porta apenas fechada, abertura sem danos"]
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
  const fullPriceList = expectation.hreflang === "en"
    ? ["€59", "€79", "€89", "€99", "€109", "€129"]
    : ["59 €", "79 €", "89 €", "99 €", "109 €", "129 €"];
  for (const price of fullPriceList) if (!html.includes(price)) errors.push(`${expectation.route}: Preis aus deutscher Preisliste fehlt: ${price}`);
  if (!html.includes('class="price-table-wrap"') || !html.includes('class="mobile-price-list"')) errors.push(`${expectation.route}: Desktop- oder Mobil-Preisliste fehlt`);
  const ldScripts = [...html.matchAll(/<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/gi)].map((match) => JSON.parse(match[1]));
  const graph = ldScripts.flatMap((json) => json["@graph"] || []);
  for (const type of ["Locksmith", "WebPage", "Service", "FAQPage"]) if (!graph.some((item) => item["@type"] === type)) errors.push(`${expectation.route}: Schema-Typ ${type} fehlt`);
  const webpage = graph.find((item) => item["@type"] === "WebPage");
  if (webpage?.inLanguage !== expectation.lang) errors.push(`${expectation.route}: WebPage inLanguage stimmt nicht`);
  const visibleMain = html.match(/<main>([\s\S]*?)<\/main>/i)?.[1] || "";
  const wordCount = decode(visibleMain).split(/\s+/u).filter(Boolean).length;
  if (wordCount < 1200 || wordCount > 1800) errors.push(`${expectation.route}: sichtbarer Inhalt hat ${wordCount} Wörter statt 1200–1800`);
  if ((html.match(/<h1\b/gi) || []).length !== 1) errors.push(`${expectation.route}: genau eine H1 erwartet`);
  if (description.length < 140 || description.length > 160) errors.push(`${expectation.route}: Meta Description hat ${description.length} Zeichen statt etwa 140–160`);
  if (!html.includes('name="twitter:title"') || !html.includes('name="twitter:description"')) errors.push(`${expectation.route}: Twitter-Metadaten fehlen`);
  const service = graph.find((item) => item["@type"] === "Service");
  if (service && "inLanguage" in service) errors.push(`${expectation.route}: Service darf kein inLanguage enthalten`);
  const heroEnd = html.indexOf('</section>');
  const pricesStart = html.indexOf('<section id="prices"');
  if (heroEnd < 0 || pricesStart < heroEnd || pricesStart - heroEnd > 20) errors.push(`${expectation.route}: Preisbereich muss direkt nach dem Hero folgen`);
  if (/English[- ]speaking|Spanish[- ]speaking|Portuguese[- ]speaking|hablamos español|falamos português/iu.test(visibleMain)) errors.push(`${expectation.route}: unbelegte Sprachbehauptung gefunden`);
  if (expectation.hreflang === "es" && /\b(?:você|chaveiro|fechadura|serviço|preço|ligue)\b/iu.test(visibleMain)) errors.push(`${expectation.route}: portugiesische Begriffe im spanischen Hauptinhalt`);
  if (expectation.hreflang === "pt-BR" && /\b(?:cerrajero|cerradura|llaves|llamar|puerta)\b/iu.test(visibleMain)) errors.push(`${expectation.route}: spanische Begriffe im portugiesischen Hauptinhalt`);
  validateLanguageDropdown(html, expectation.hreflang, expectation.route);
}

const htmlSitemap = pageByRoute.get("/sitemap/");
if (!htmlSitemap) errors.push("HTML-Sitemap fehlt");
else {
  if (!htmlSitemap.html.includes(`<link rel="canonical" href="${site}/sitemap/">`)) errors.push("HTML-Sitemap: selbstreferenzierender Canonical fehlt");
  if (/noindex/i.test(htmlSitemap.html)) errors.push("HTML-Sitemap darf nicht noindex sein");
  for (const page of canonicalPages.filter((item) => item.route !== "/sitemap/")) if (!htmlSitemap.html.includes(`href="${page.route}"`)) errors.push(`HTML-Sitemap: kanonische Seite fehlt ${page.route}`);
  for (const alias of aliasRoutes) if (htmlSitemap.html.includes(`href="${alias}"`)) errors.push(`HTML-Sitemap: Alias darf nicht verlinkt sein ${alias}`);
}
if (!sitemapUrls.includes(`${site}/sitemap/`)) errors.push("XML-Sitemap: HTML-Sitemap fehlt");
for (const route of ["/locksmith-berlin/", "/cerrajero-berlin/", "/chaveiro-berlim/"]) if (routeSet.has(route) || sitemapUrls.includes(`${site}${route}`)) errors.push(`Doppelte Sprachroute gefunden: ${route}`);
for (const page of canonicalPages) if (!page.html.includes('href="/sitemap/"')) errors.push(`${page.route}: Footer-Link zur Sitemap fehlt`);

for (const [code, href] of alternateSet) {
  const pattern = `<link rel="alternate" hreflang="${code}" href="${href}">`;
  if ((home.split(pattern).length - 1) !== 1) errors.push(`Startseite: hreflang ${code} fehlt oder ist doppelt`);
}
if (!home.includes('property="og:locale" content="de_DE"')) errors.push("Startseite: og:locale de_DE fehlt");
for (const href of ["/en/locksmith-berlin/", "/es/cerrajero-berlin/", "/pt/chaveiro-berlim/"]) if (!home.includes(`href="${href}"`)) errors.push(`Startseite: Sprachumschalter-Link fehlt ${href}`);
validateLanguageDropdown(home, "de", "Startseite");

const generator = fs.readFileSync(path.join(root, "scripts/build-site.mjs"), "utf8");
if (generator.toLowerCase().includes(obsoleteEmail) || /Ramlerstr\. 2(?!a)/i.test(generator)) errors.push("Alte Kontaktdaten in zentraler Build-Quelle vorhanden");

const businessId = `${site}/#business`;
const websiteId = `${site}/#website`;
const expectedBusiness = {
  name: "Trust Schlüsseldienst Berlin",
  legalName: "Trust B&M Service UG (haftungsbeschränkt)",
  telephone: "+49 30 40563878",
  email: "schluesseldienst@trust-bm-service.de",
  streetAddress: "Ramlerstr. 2a",
  postalCode: "13355",
  addressLocality: "Berlin",
  addressCountry: "DE"
};
const explicitServiceRoutes = new Set([
  "/leistung/schlüsselnotdienst/",
  "/leistung/öffnung-bei-zugefallenen-türen/",
  "/leistung/öffnung-bei-abgeschlossenen-türen/",
  "/leistung/schlosswechsel-berlin-schlösser-schnell-sicher-wechseln/",
  "/leistung/montage-von-sicherheitsschlösser/",
  "/leistung/sicherheitstechnik-berlin-einbruchschutz-vom-profi/",
  "/türöffnung-berlin-24h-notdienst/",
  "/schlüssel-steckt-innen-tür-zu/",
  "/schlüsseldienst-in-der-nähe/",
  "/en/locksmith-berlin/",
  "/es/cerrajero-berlin/",
  "/pt/chaveiro-berlim/"
]);
const nonDistrictRoutes = new Set(["/schlüsseldienst-berlin-preise/", "/schlüsseldienst-in-der-nähe/"]);
const noBusinessRoutes = new Set(["/impressum/", "/sitemap/"]);
const guideArticleRoutes = new Set([
  "/ratgeber/schluessel-verloren-berlin/",
  "/ratgeber/schluesseldienst-kosten-berlin/",
  "/ratgeber/tuer-zugefallen-berlin/"
]);

const graphFor = (html, context) => {
  const scripts = [...html.matchAll(/<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi)];
  if (scripts.length !== 1) errors.push(`${context}: genau ein JSON-LD-Block erwartet`);
  try {
    return JSON.parse(scripts[0]?.[1] || "{}")["@graph"] || [];
  } catch (error) {
    errors.push(`${context}: JSON-LD kann nicht ausgewertet werden (${error.message})`);
    return [];
  }
};

for (const page of canonicalPages) {
  const graph = graphFor(page.html, page.route);
  const businessNodes = graph.filter((item) => item["@type"] === "Locksmith");
  const websiteNodes = graph.filter((item) => item["@type"] === "WebSite");
  const webpageNodes = graph.filter((item) => item["@type"] === "WebPage");
  const serviceNodes = graph.filter((item) => item["@type"] === "Service");
  const faqNodes = graph.filter((item) => item["@type"] === "FAQPage");
  const articleNodes = graph.filter((item) => item["@type"] === "Article");
  const districtRoute = page.route.startsWith("/schlüsseldienst-") && !nonDistrictRoutes.has(page.route);
  const expectsService = districtRoute || explicitServiceRoutes.has(page.route);
  const expectedLanguage = page.route.startsWith("/en/") ? "en" : page.route.startsWith("/es/") ? "es" : page.route.startsWith("/pt/") ? "pt-BR" : "de-DE";

  if (graph.some((item) => item["@type"] === "Organization" || item["@id"] === `${site}/#organization` || item["@id"] === `${site}/#localbusiness`)) errors.push(`${page.route}: alte oder doppelte Unternehmensentität vorhanden`);
  const ids = graph.map((item) => item["@id"]).filter(Boolean);
  if (new Set(ids).size !== ids.length) errors.push(`${page.route}: doppelte @id im JSON-LD-Graph`);
  if (websiteNodes.length !== 1 || websiteNodes[0]?.["@id"] !== websiteId || websiteNodes[0]?.publisher?.["@id"] !== businessId) errors.push(`${page.route}: WebSite oder Publisher-Verknüpfung ist inkonsistent`);
  if (webpageNodes.length !== 1) errors.push(`${page.route}: genau eine WebPage-Entität erwartet`);
  const webpage = webpageNodes[0] || {};
  if (webpage["@id"] !== `${page.canonical}#webpage` || webpage.url !== page.canonical) errors.push(`${page.route}: WebPage-ID oder URL stimmt nicht mit Canonical überein`);
  if (webpage.isPartOf?.["@id"] !== websiteId || webpage.about?.["@id"] !== businessId) errors.push(`${page.route}: WebPage ist nicht korrekt mit Website und Unternehmen verknüpft`);
  if (webpage.inLanguage !== expectedLanguage) errors.push(`${page.route}: WebPage inLanguage ist nicht ${expectedLanguage}`);

  if (noBusinessRoutes.has(page.route)) {
    if (businessNodes.length) errors.push(`${page.route}: unnötige Locksmith-Entität auf Rechts- oder Sitemap-Seite`);
  } else {
    if (businessNodes.length !== 1) errors.push(`${page.route}: genau eine zentrale Locksmith-Entität erwartet`);
    const business = businessNodes[0] || {};
    if (business["@id"] !== businessId || business.name !== expectedBusiness.name || business.legalName !== expectedBusiness.legalName) errors.push(`${page.route}: Unternehmens-ID, Name oder Rechtsname stimmt nicht`);
    if (business.telephone !== expectedBusiness.telephone || business.email !== expectedBusiness.email) errors.push(`${page.route}: Telefon oder E-Mail im Unternehmensschema stimmt nicht`);
    for (const [field, value] of Object.entries(expectedBusiness).slice(4)) if (business.address?.[field] !== value) errors.push(`${page.route}: Adresse im Unternehmensschema weicht ab (${field})`);
    if (business.areaServed?.name !== "Berlin" || business.currenciesAccepted !== "EUR") errors.push(`${page.route}: Einsatzgebiet oder Währung im Unternehmensschema stimmt nicht`);
    if (!business.logo || !Array.isArray(business.image) || !business.image.length) errors.push(`${page.route}: Logo oder Unternehmensbilder fehlen`);
    for (const assetUrl of [business.logo, ...(business.image || [])]) {
      if (!assetUrl?.startsWith(`${site}/assets/`)) errors.push(`${page.route}: Schema-Bild ist keine stabile lokale Asset-URL (${assetUrl})`);
      else if (!fs.existsSync(path.join(root, new URL(assetUrl).pathname.slice(1).replaceAll("/", path.sep)))) errors.push(`${page.route}: Schema-Bilddatei fehlt (${assetUrl})`);
    }
    if (JSON.stringify(business.sameAs) !== JSON.stringify(["https://share.google/eskADN8c4gLAJoF4b"])) errors.push(`${page.route}: sameAs enthält keine ausschließlich bestätigte Profil-URL`);
  }

  if (expectsService) {
    if (serviceNodes.length !== 1) errors.push(`${page.route}: genau eine konkrete Service-Entität erwartet`);
    const service = serviceNodes[0] || {};
    if (service["@id"] !== `${page.canonical}#service` || service.url !== page.canonical) errors.push(`${page.route}: Service-ID oder URL stimmt nicht mit Canonical überein`);
    if (!service.name || !service.description || !service.serviceType) errors.push(`${page.route}: Service benötigt Name, Beschreibung und serviceType`);
    if (service.provider?.["@id"] !== businessId) errors.push(`${page.route}: Service verweist nicht auf #business`);
    if (!service.areaServed?.name || (districtRoute && service.areaServed.name === "Berlin")) errors.push(`${page.route}: lokales areaServed ist nicht konkret genug`);
    if ("offers" in service || "inLanguage" in service) errors.push(`${page.route}: Service enthält ein nicht vorgesehenes Offer oder inLanguage`);
    if (webpage.mainEntity?.["@id"] !== `${page.canonical}#service`) errors.push(`${page.route}: WebPage verweist nicht auf ihren Service`);
  } else if (serviceNodes.length) {
    errors.push(`${page.route}: unnötige Service-Entität auf Übersichts-, Preis-, Ratgeber- oder Rechtsseite`);
  }

  if (page.route === "/") {
    const catalog = businessNodes[0]?.hasOfferCatalog;
    if (catalog?.["@type"] !== "OfferCatalog" || catalog.itemListElement?.length !== 5) errors.push("Startseite: zentraler Leistungskatalog ist unvollständig");
    for (const item of catalog?.itemListElement || []) {
      if (item["@type"] !== "Service" || !item.name || !item.description || item.provider?.["@id"] !== businessId) errors.push("Startseite: ungültiger Eintrag im Leistungskatalog");
      if (!canonicalUrls.has(item.url)) errors.push(`Startseite: Leistungskatalog verweist nicht auf eine kanonische Seite (${item.url})`);
      if ("offers" in item) errors.push("Startseite: Leistungskatalog enthält ein nicht abgesichertes Offer");
    }
  } else if (businessNodes[0]?.hasOfferCatalog) errors.push(`${page.route}: Leistungskatalog darf nur an der zentralen Unternehmensentität der Startseite ausgegeben werden`);

  if (guideArticleRoutes.has(page.route)) {
    if (articleNodes.length !== 1 || articleNodes[0]?.author?.["@id"] !== businessId || articleNodes[0]?.publisher?.["@id"] !== businessId) errors.push(`${page.route}: Article ist nicht korrekt mit #business verknüpft`);
  } else if (articleNodes.length) errors.push(`${page.route}: Article-Schema ist auf diesem Seitentyp nicht vorgesehen`);

  const visibleFaqCount = (page.html.match(/<details class="faq-item">/g) || []).length;
  const schemaFaqCount = faqNodes[0]?.mainEntity?.length || 0;
  if (faqNodes.length > 1 || visibleFaqCount !== schemaFaqCount) errors.push(`${page.route}: sichtbare FAQ und FAQ-Schema haben unterschiedliche Umfänge`);
  const serializedGraph = JSON.stringify(graph);
  if (/"(?:aggregateRating|review|ratingValue)"/.test(serializedGraph)) errors.push(`${page.route}: Bewertungsdaten dürfen nicht im Schema stehen`);
  if (/"@type":"Product"/.test(serializedGraph)) errors.push(`${page.route}: Product-Schema ist nicht vorgesehen`);
}

if (routeSet.has("/kontakt/")) errors.push("Unerwartete Kontaktseite gefunden; ContactPage wurde bewusst nicht erzeugt");

console.log(JSON.stringify({ pages: pages.length, canonicalPages: canonicalPages.length, sitemapUrls: sitemapUrls.length, errors: errors.length, warnings: warnings.length }, null, 2));
for (const error of errors) console.error(`ERROR ${error}`);
for (const warning of warnings) console.warn(`WARN ${warning}`);
if (errors.length) process.exit(1);
