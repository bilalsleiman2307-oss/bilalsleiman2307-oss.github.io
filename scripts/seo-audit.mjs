import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const outputArg = process.argv.indexOf("--output");
const output = outputArg >= 0 ? process.argv[outputArg + 1] : "reports/seo-inventory.json";
const site = "https://www.trust-schluesseldienstberlin.de";
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

const decode = (value = "") => value
  .replace(/<[^>]*>/g, " ")
  .replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'")
  .replace(/&auml;/g, "ä").replace(/&ouml;/g, "ö").replace(/&uuml;/g, "ü")
  .replace(/&Auml;/g, "Ä").replace(/&Ouml;/g, "Ö").replace(/&Uuml;/g, "Ü").replace(/&szlig;/g, "ß")
  .replace(/\s+/g, " ").trim();
const match = (html, re) => decode(html.match(re)?.[1] || "");
const routeFor = (file) => {
  const relative = path.relative(root, file).replaceAll("\\", "/");
  if (relative === "index.html") return "/";
  if (relative.endsWith("/index.html")) return `/${relative.slice(0, -"index.html".length)}`;
  return `/${relative}`;
};
const typeFor = (route) => {
  if (route === "/" || route === "/startseite/") return "Startseite";
  if (route === "/impressum/" || route === "/impressum.html") return "Rechtliches";
  if (route.includes("preise") || route.includes("kosten")) return route.startsWith("/ratgeber/") ? "Ratgeber" : "Preis";
  if (route.startsWith("/leistung/")) return route === "/leistung/" ? "Leistungsübersicht" : "Leistung";
  if (route.startsWith("/ratgeber/") || route === "/ratgeber/") return "Ratgeber";
  if (/^\/schl(ü|ue|u)sseldienst-[^/]+(?:\/|\.html)$/.test(route)) return "Bezirk";
  return "Leistung";
};
const intentFor = (route, h1) => {
  if (route === "/") return "Schlüsseldienst Berlin / lokaler Notdienst";
  if (route === "/startseite/") return "Alternative Startseiten-URL";
  if (route.includes("öffnung-bei-zugefallenen") || route.includes("tuer-zugefallen") || route.includes("tür-zugefallen")) return "Tür nur zugefallen: Hilfe oder Information";
  if (route.includes("öffnung-bei-abgeschlossenen")) return "Abgeschlossene Tür öffnen";
  if (route.includes("kosten") || route.includes("preise")) return "Kosten und Preise des Schlüsseldienstes";
  if (route.includes("schlüsselnotdienst") || route.includes("schluesselnotdienst")) return "Akuter Schlüsselnotdienst";
  if (route.includes("schlosswechsel") || route.includes("sicherheitsschlösser")) return "Schloss- oder Zylinderwechsel";
  if (route.includes("sicherheitstechnik") || route.includes("einbruchschutz")) return "Einbruchschutz und Sicherheitstechnik";
  if (typeFor(route) === "Bezirk") return `Lokaler Schlüsseldienst: ${h1}`;
  return h1 || route;
};

const sitemapPath = path.join(root, "sitemap.xml");
const sitemapXml = fs.existsSync(sitemapPath) ? fs.readFileSync(sitemapPath, "utf8") : "";
const sitemapUrls = new Set([...sitemapXml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]));
const files = walk(root);
const parsed = files.map((file) => {
  const html = fs.readFileSync(file, "utf8");
  const route = routeFor(file);
  const h1s = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) => decode(m[1]));
  const links = [...html.matchAll(/<a\b[^>]*href=["']([^"']+)["']/gi)].map((m) => m[1]);
  return {
    route,
    url: `${site}${route}`,
    file: path.relative(root, file).replaceAll("\\", "/"),
    title: match(html, /<title>([\s\S]*?)<\/title>/i),
    metaDescription: match(html, /<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i),
    canonical: html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i)?.[1] || "",
    h1: h1s[0] || "",
    h1Count: h1s.length,
    pageType: typeFor(route),
    likelyIntent: intentFor(route, h1s[0] || ""),
    links,
    inSitemap: sitemapUrls.has(`${site}${route}`)
  };
});

const linkedRoutes = new Set(parsed.flatMap((page) => page.links)
  .filter((href) => href.startsWith("/"))
  .map((href) => href.split("#")[0].split("?")[0] || "/"));

const normalizedKey = (route) => route
  .toLowerCase()
  .replaceAll("ö", "oe").replaceAll("ü", "ue").replaceAll("ä", "ae").replaceAll("ß", "ss")
  .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  .replaceAll("schluesseldienst", "schluesseldienst")
  .replace(/\.html$/, "/");
const variantGroups = new Map();
for (const page of parsed) {
  const key = normalizedKey(page.route);
  if (!variantGroups.has(key)) variantGroups.set(key, []);
  variantGroups.get(key).push(page.route);
}
const intentGroups = new Map();
for (const page of parsed) {
  if (!intentGroups.has(page.likelyIntent)) intentGroups.set(page.likelyIntent, []);
  intentGroups.get(page.likelyIntent).push(page.route);
}

const pages = parsed.map(({ links, ...page }) => ({
  ...page,
  internallyLinked: page.route === "/" || linkedRoutes.has(page.route),
  orphaned: page.route !== "/" && !linkedRoutes.has(page.route),
  possibleOverlap: (intentGroups.get(page.likelyIntent) || []).filter((route) => route !== page.route),
  urlVariants: (variantGroups.get(normalizedKey(page.route)) || []).filter((route) => route !== page.route)
}));

const report = {
  generatedAt: new Date().toISOString(),
  source: "generated public HTML before or after the central build",
  pageCount: pages.length,
  sitemapUrlCount: sitemapUrls.size,
  pages
};
const target = path.resolve(root, output);
fs.mkdirSync(path.dirname(target), { recursive: true });
fs.writeFileSync(target, `${JSON.stringify(report, null, 2)}\n`, "utf8");
console.log(`Audited ${pages.length} public HTML pages -> ${path.relative(root, target)}`);
