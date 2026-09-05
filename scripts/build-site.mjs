import fs from "node:fs";
import path from "node:path";
import { internationalPages, internationalSlugs } from "./international-pages.mjs";
import { priorityDistrictPages, priorityDistrictSlugs } from "./priority-district-pages.mjs";

const root = process.cwd();
const site = "https://www.trust-schluesseldienstberlin.de";
const phone = "03040563878";
const phoneDisplay = "03040563878";
const schemaPhone = "+49 30 40563878";
const email = "schluesseldienst@trust-bm-service.de";
const streetAddress = "Ramlerstr. 2a";
const businessId = `${site}/#business`;
const websiteId = `${site}/#website`;
const businessDescription = "Trust Schlüsseldienst Berlin ist ein 24/7 erreichbarer Schlüsseldienst und Schlüsselnotdienst in Berlin. Das Unternehmen bietet Türöffnungen bei zugefallenen und abgeschlossenen Türen, Schlosswechsel, Schließzylinderwechsel, Hilfe bei Schlüsselverlust oder abgebrochenen Schlüsseln sowie Einbruchschutz und Sicherheitstechnik. Preise und Anfahrt werden vor Arbeitsbeginn transparent abgestimmt.";
const version = "trust-redesign-15";
const homepageStyleVersion = "trust-redesign-17";
const googleReviewUrl = "https://share.google/eskADN8c4gLAJoF4b";
const googleWriteReviewUrl = "https://g.page/r/Cb7_XP5XHV96ECE/review";
const googleReviewBadge = `<a class="google-review-badge" href="${googleReviewUrl}" target="_blank" rel="noopener noreferrer" aria-label="Google Bewertungen ansehen"><span class="google-word" aria-hidden="true"><span>G</span><span>o</span><span>o</span><span>g</span><span>l</span><span>e</span></span><span class="review-stars" aria-hidden="true">★★★★★</span><span class="review-text"><strong>5,0</strong> Sterne · 105 Bewertungen</span></a>`;
const phoneIcon = `<svg class="home-action-svg" aria-hidden="true" viewBox="0 0 24 24" focusable="false"><path fill="currentColor" d="M6.6 2.8c.5-.2 1.1 0 1.4.5l1.8 3.5c.2.5.1 1-.3 1.4L8 9.5c1.2 2.5 3.2 4.5 5.7 5.7l1.3-1.5c.4-.4.9-.5 1.4-.3l3.5 1.8c.5.3.7.8.5 1.4l-.8 3c-.2.7-.8 1.2-1.5 1.2C9.7 20.8 3.2 14.3 3.2 6c0-.7.5-1.3 1.2-1.5l2.2-.7Z"/></svg>`;
const whatsappIcon = `<svg class="home-action-svg home-whatsapp-svg" aria-hidden="true" viewBox="0 0 24 24" focusable="false"><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M20.2 11.6a8.2 8.2 0 0 1-11.9 7.3L4 20l1.2-4.1a8.2 8.2 0 1 1 15-4.3Z"/><path fill="currentColor" d="M8.4 7.1c.3-.1.6 0 .8.3l1 1.9c.1.3.1.6-.2.8l-.8.7a7.3 7.3 0 0 0 3.2 3.2l.7-.8c.2-.2.5-.3.8-.2l1.9 1c.3.2.4.5.3.8l-.4 1.5c-.1.4-.5.7-.9.7a8.8 8.8 0 0 1-8.6-8.6c0-.4.3-.8.7-.9l1.5-.4Z"/></svg>`;

const allIndexes = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory() || [".git", "assets", "scripts", "naLogImpressions"].includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    const index = path.join(full, "index.html");
    if (fs.existsSync(index)) allIndexes.push(path.relative(root, full).replaceAll("\\", "/"));
    walk(full);
  }
}
walk(root);
for (const slug of internationalSlugs) if (!allIndexes.includes(slug)) allIndexes.push(slug);
if (!allIndexes.includes("sitemap")) allIndexes.push("sitemap");

const canonicalRoutes = new Map([
  ["startseite", ""],
  ["schlüsseldienst-köpenick", "schlüsseldienst-koepenick"],
  ["schlüsseldienst-schöneberg", "schlüsseldienst-schoeneberg"],
  ["schlüsseldienst-französisch-buchholz", "schlüsseldienst-franzoesisch-buchholz"],
  ["leistung/schlüsseldienst-berlin-türöffnung-notdienst-24h", "türöffnung-berlin-24h-notdienst"],
  ["türöffnung-berlin-kosten", "schlüsseldienst-berlin-preise"],
  ["tür-zugefallen-was-tun", "ratgeber/tuer-zugefallen-berlin"],
  ["ratgeber/tuer-zugefallen-pankow", "ratgeber/tuer-zugefallen-berlin"],
  ["ratgeber/tuer-zugefallen-wedding", "ratgeber/tuer-zugefallen-berlin"],
  ["ratgeber/schluessel-verloren-gesundbrunnen", "ratgeber/schluessel-verloren-berlin"],
  ["ratgeber/schluessel-verloren-mitte", "ratgeber/schluessel-verloren-berlin"]
]);

const legacyHtmlRoutes = new Map([
  ["impressum.html", "impressum"],
  ["schluesseldienst-gesundbrunnen.html", "schlüsseldienst-gesundbrunnen"],
  ["schluesseldienst-lichtenberg.html", "schlüsseldienst-lichtenberg"],
  ["schluesseldienst-marzahn.html", "schlüsseldienst-marzahn"],
  ["schluesseldienst-neukoelln.html", "schlüsseldienst-neukölln"],
  ["schluesseldienst-pankow.html", "schlüsseldienst-pankow"],
  ["schluesseldienst-prenzlauerberg.html", "schlüsseldienst-prenzlauerberg"],
  ["schluesseldienst-schoeneberg.html", "schlüsseldienst-schoeneberg"],
  ["schluesseldienst-spandau.html", "schlüsseldienst-spandau"],
  ["schluesseldienst-tempelhof.html", "schlüsseldienst-tempelhof"],
  ["schluesseldienst-treptow.html", "schlüsseldienst-treptow"],
  ["schluesseldienst-wedding.html", "schlüsseldienst-wedding"],
  ["schluesseldienst-wilmersdorf.html", "schlüsseldienst-wilmersdorf"]
]);

const districtNames = {
  "buch":"Buch", "charlottenburg":"Charlottenburg", "franzoesisch-buchholz":"Französisch Buchholz", "französisch-buchholz":"Französisch Buchholz", "frohnau":"Frohnau",
  "friedrichshain":"Friedrichshain", "gesundbrunnen":"Gesundbrunnen", "koepenick":"Köpenick", "köpenick":"Köpenick",
  "heiligensee":"Heiligensee", "hermsdorf":"Hermsdorf", "karow":"Karow", "kaulsdorf":"Kaulsdorf", "kladow":"Kladow", "kreuzberg":"Kreuzberg", "lichtenberg":"Lichtenberg", "lichtenrade":"Lichtenrade", "mahlsdorf":"Mahlsdorf", "marzahn":"Marzahn", "mitte":"Mitte", "moabit":"Moabit", "mueggelheim":"Müggelheim",
  "neukölln":"Neukölln", "pankow":"Pankow", "prenzlauerberg":"Prenzlauer Berg", "reinickendorf":"Reinickendorf",
  "rahnsdorf":"Rahnsdorf", "rudow":"Rudow", "schoeneberg":"Schöneberg", "schöneberg":"Schöneberg", "spandau":"Spandau", "staaken":"Staaken", "steglitz":"Steglitz", "tempelhof":"Tempelhof",
  "treptow":"Treptow", "wannsee":"Wannsee", "wedding":"Wedding", "weißensee":"Weißensee", "wilmersdorf":"Wilmersdorf", "zehlendorf":"Zehlendorf"
};
const districtRoutes = allIndexes.filter((r) => r.startsWith("schlüsseldienst-") && districtNames[r.slice(16)] && !canonicalRoutes.has(r));

const districtDescriptions = {
  "schlüsseldienst-buch": "Schlüsseldienst Berlin Buch: Türöffnung ab 59 €, 24/7 erreichbar. Für Wohnhäuser und Türen nahe dem Klinikum klären wir Anfahrt und Preis vorab.",
  "schlüsseldienst-charlottenburg": "Schlüsseldienst Berlin Charlottenburg: Türöffnung ab 59 €, 24/7 erreichbar. Türzustand, Anfahrt und Preis klären wir verbindlich vor Beginn.",
  "schlüsseldienst-franzoesisch-buchholz": "Schlüsseldienst Berlin Französisch Buchholz: Türöffnung ab 59 €, 24/7 erreichbar. Vor der Anfahrt besprechen wir Schloss, Anfahrtsweg und Kosten.",
  "schlüsseldienst-friedrichshain": "Schlüsseldienst Berlin Friedrichshain: Türöffnung ab 59 €, 24/7 erreichbar. Bei zugefallener oder verriegelter Tür klären wir den Preis vorab.",
  "schlüsseldienst-frohnau": "Schlüsseldienst Berlin Frohnau: Türöffnung ab 59 €, 24/7 erreichbar. Bei Haus- und Wohnungstüren vereinbaren wir Anfahrt, Vorgehen und Preis vorher.",
  "schlüsseldienst-gesundbrunnen": "Schlüsseldienst Berlin Gesundbrunnen: Türöffnung ab 59 €, 24/7 erreichbar. Anfahrt und Preis klären wir vor dem konkreten Einsatz direkt am Telefon.",
  "schlüsseldienst-heiligensee": "Schlüsseldienst Berlin Heiligensee: Türöffnung ab 59 €, 24/7 erreichbar. Für die Randlage stimmen wir Adresse, Anfahrt und Festpreis genau vorher ab.",
  "schlüsseldienst-hermsdorf": "Schlüsseldienst Berlin Hermsdorf: Türöffnung ab 59 €, 24/7 erreichbar. Türart, Schloss und Anfahrtsweg besprechen wir passend zur Adresse vorab.",
  "schlüsseldienst-karow": "Schlüsseldienst Berlin Karow: Türöffnung ab 59 €, 24/7 erreichbar. Ob Alt-Karow oder Neubaugebiet, den konkreten Aufwand klären wir vor Beginn.",
  "schlüsseldienst-kaulsdorf": "Schlüsseldienst Berlin Kaulsdorf: Türöffnung ab 59 €, 24/7 erreichbar. Für individuell gesicherte Haustüren prüfen wir die Angaben vor der Anfahrt.",
  "schlüsseldienst-kladow": "Schlüsseldienst Berlin Kladow: Türöffnung ab 59 €, 24/7 erreichbar. Wegen der Wege im Südwesten werden Anfahrt und Preis am Telefon genau vereinbart.",
  "schlüsseldienst-koepenick": "Schlüsseldienst Berlin Köpenick: Türöffnung ab 59 €, 24/7 erreichbar. Ob zugefallen oder abgeschlossen, Ablauf und Kosten stehen vorher fest.",
  "schlüsseldienst-kreuzberg": "Schlüsseldienst Berlin Kreuzberg: Türöffnung ab 59 €, 24/7 erreichbar. Wir fragen nach der Türsituation und vereinbaren Anfahrt und Preis vorab.",
  "schlüsseldienst-lichtenberg": "Schlüsseldienst Berlin Lichtenberg: Türöffnung ab 59 €, 24/7 erreichbar. Bei Schlüsselverlust oder Defekt besprechen wir das Vorgehen vor Beginn.",
  "schlüsseldienst-lichtenrade": "Schlüsseldienst Berlin Lichtenrade: Türöffnung ab 59 €, 24/7 erreichbar. Türzustand, Adresse und Kosten klären wir vor der Fahrt in den Berliner Süden.",
  "schlüsseldienst-mahlsdorf": "Schlüsseldienst Berlin Mahlsdorf: Türöffnung ab 59 €, 24/7 erreichbar. Bei Haus-, Neben- und Wohnungstüren nennen wir Ablauf und Kosten vor Beginn.",
  "schlüsseldienst-marzahn": "Schlüsseldienst Berlin Marzahn: Türöffnung ab 59 €, 24/7 erreichbar. Für Wohnungstüren und Zylinderprobleme erhalten Sie vorab klare Kosten.",
  "schlüsseldienst-mitte": "Schlüsseldienst Berlin Mitte: Türöffnung ab 59 €, 24/7 erreichbar. Für Wohnung, Büro oder Gewerbe klären wir Preis und Anfahrt vor Arbeitsbeginn.",
  "schlüsseldienst-moabit": "Schlüsseldienst Berlin Moabit: Türöffnung ab 59 €, 24/7 erreichbar. Von der ersten Schilderung bis zur Öffnung bleiben Ablauf und Kosten klar.",
  "schlüsseldienst-mueggelheim": "Schlüsseldienst Berlin Müggelheim: Türöffnung ab 59 €, 24/7 erreichbar. Für die Anfahrt im Südosten vereinbaren wir Adresse und Festpreis telefonisch.",
  "schlüsseldienst-neukölln": "Schlüsseldienst Berlin Neukölln: Türöffnung ab 59 €, 24/7 erreichbar. Tür zu, Schlüssel weg oder Schloss defekt? Den Preis nennen wir vorher.",
  "schlüsseldienst-pankow": "Schlüsseldienst Berlin Pankow: Türöffnung ab 59 €, 24/7 erreichbar. Türart, Anfahrt und mögliche Zusatzarbeiten stimmen wir vor dem Einsatz ab.",
  "schlüsseldienst-prenzlauerberg": "Schlüsseldienst Berlin Prenzlauer Berg: Türöffnung ab 59 €, rund um die Uhr erreichbar. Den konkreten Preis vereinbaren wir vor der Anfahrt.",
  "schlüsseldienst-reinickendorf": "Schlüsseldienst Berlin Reinickendorf: Türöffnung ab 59 €, 24/7 erreichbar. Die Konditionen nennen wir passend zur Türsituation vor der Anfahrt.",
  "schlüsseldienst-rahnsdorf": "Schlüsseldienst Berlin Rahnsdorf: Türöffnung ab 59 €, 24/7 erreichbar. In Hessenwinkel und Wilhelmshagen klären wir Strecke und Preis adressbezogen.",
  "schlüsseldienst-rudow": "Schlüsseldienst Berlin Rudow: Türöffnung ab 59 €, 24/7 erreichbar. Ob Tür zugefallen, verriegelt oder Schloss defekt: Der Preis wird vorher geklärt.",
  "schlüsseldienst-schoeneberg": "Schlüsseldienst Berlin Schöneberg: Türöffnung ab 59 €, 24/7 erreichbar. Wir prüfen Schloss und Beschlag und erklären die Kosten vor Arbeitsbeginn.",
  "schlüsseldienst-spandau": "Schlüsseldienst Berlin Spandau: Türöffnung ab 59 €, 24/7 erreichbar. Für zugefallene und abgeschlossene Türen klären wir den Aufwand telefonisch vorab.",
  "schlüsseldienst-staaken": "Schlüsseldienst Berlin Staaken: Türöffnung ab 59 €, 24/7 erreichbar. In Alt- und Neu-Staaken stimmen wir Türsituation, Anfahrt und Kosten vorher ab.",
  "schlüsseldienst-steglitz": "Schlüsseldienst Berlin Steglitz: Türöffnung ab 59 €, 24/7 erreichbar. Bei Aussperrung oder Schlüsselverlust vereinbaren wir den Preis vorher.",
  "schlüsseldienst-tempelhof": "Schlüsseldienst Berlin Tempelhof: Türöffnung ab 59 €, 24/7 erreichbar. Anfahrt, Türzustand und konkrete Kosten werden vor Arbeitsbeginn besprochen.",
  "schlüsseldienst-treptow": "Schlüsseldienst Berlin Treptow: Türöffnung ab 59 €, 24/7 erreichbar. Bei klemmendem Schloss oder zugefallener Tür kennen Sie den Preis vorab.",
  "schlüsseldienst-wannsee": "Schlüsseldienst Berlin Wannsee: Türöffnung ab 59 €, 24/7 erreichbar. Genaue Adresse, Anfahrtsweg und Türzustand besprechen wir vor dem Einsatz.",
  "schlüsseldienst-wedding": "Schlüsseldienst Berlin Wedding: Türöffnung ab 59 €, 24/7 erreichbar. Türzustand, Anfahrt und konkrete Kosten besprechen wir vor dem Einsatz am Telefon.",
  "schlüsseldienst-weißensee": "Schlüsseldienst Berlin Weißensee: Türöffnung ab 59 €, 24/7 erreichbar. Wir stimmen Methode, Anfahrt und Preis passend zu Ihrer Tür vorher ab.",
  "schlüsseldienst-wilmersdorf": "Schlüsseldienst Berlin Wilmersdorf: Türöffnung ab 59 €, 24/7 erreichbar. Schloss, Zylinder und Preis werden vor der Arbeit nachvollziehbar geklärt.",
  "schlüsseldienst-zehlendorf": "Schlüsseldienst Berlin Zehlendorf: Türöffnung ab 59 €, 24/7 erreichbar. Für Haus- und Wohnungstüren vereinbaren wir Vorgehen und Kosten vorab."
};

const labels = {
  "leistung":"Leistungen", "ratgeber":"Ratgeber", "impressum":"Impressum", "sitemap":"Sitemap", "startseite":"Startseite",
  "schlüsseldienst-berlin-preise":"Schlüsseldienst Berlin Preise", "schlüsseldienst-in-der-nähe":"Schlüsseldienst in der Nähe",
  "schlüssel-steckt-innen-tür-zu":"Schlüssel steckt innen – Tür zu", "tür-zugefallen-was-tun":"Tür zugefallen – was tun?",
  "türöffnung-berlin-24h-notdienst":"Türöffnung Berlin", "türöffnung-berlin-kosten":"Türöffnung Berlin Kosten",
  "schlüsselnotdienst":"Schlüsselnotdienst Berlin", "öffnung-bei-abgeschlossenen-türen":"Öffnung bei abgeschlossenen Türen",
  "öffnung-bei-zugefallenen-türen":"Öffnung bei zugefallenen Türen", "montage-von-sicherheitsschlösser":"Montage von Sicherheitsschlössern",
  "schlosswechsel-berlin-schlösser-schnell-sicher-wechseln":"Schlosswechsel Berlin",
  "sicherheitstechnik-berlin-einbruchschutz-vom-profi":"Sicherheitstechnik & Einbruchschutz Berlin",
  "schlüsseldienst-berlin-türöffnung-notdienst-24h":"Schlüsseldienst Berlin – Türöffnung & Notdienst 24h",
  "tuer-zugefallen-berlin":"Tür zugefallen in Berlin", "schluesseldienst-kosten-berlin":"Schlüsseldienst Kosten Berlin",
  "schluessel-verloren-berlin":"Schlüssel verloren in Berlin", "tuer-zugefallen-wedding":"Tür zugefallen in Wedding",
  "schluessel-verloren-gesundbrunnen":"Schlüssel verloren in Gesundbrunnen", "tuer-zugefallen-pankow":"Tür zugefallen in Pankow",
  "schluessel-verloren-mitte":"Schlüssel verloren in Mitte"
};

const titleOverrides = {
  "": "Trust Schlüsseldienst Berlin ab 59 € | Festpreis am Telefon",
  "sitemap": "Sitemap | Trust Schlüsseldienst Berlin",
  "startseite": "Schlüsseldienst Berlin | 24/7 Notdienst & Türöffnung",
  "leistung": "Schlüsseldienst Berlin: Leistungen & Türöffnung ab 59 €",
  "leistung/schlüsselnotdienst": "Schlüsselnotdienst Berlin 24/7 | Trust Schlüsseldienst",
  "leistung/öffnung-bei-zugefallenen-türen": "Tür zugefallen Berlin | Türöffnung ohne unnötige Schäden",
  "leistung/öffnung-bei-abgeschlossenen-türen": "Abgeschlossene Tür öffnen Berlin | Seriöse Türöffnung",
  "leistung/schlosswechsel-berlin-schlösser-schnell-sicher-wechseln": "Schloss wechseln Berlin | Schließzylinder wechseln nach Absprache",
  "leistung/montage-von-sicherheitsschlösser": "Sicherheitsschloss montieren Berlin | Schloss & Einbruchschutz",
  "leistung/sicherheitstechnik-berlin-einbruchschutz-vom-profi": "Einbruchschutz Berlin | Sicherheitstechnik für Tür und Schloss",
  "leistung/schlüsseldienst-berlin-türöffnung-notdienst-24h": "Türöffnung Berlin 24h Notdienst | Schlüsseldienst Berlin",
  "schlüsseldienst-berlin-preise": "Schlüsseldienst Berlin Preise | Kosten transparent am Telefon klären",
  "schlüsseldienst-in-der-nähe": "Schlüsseldienst in der Nähe Berlin | Einsatzgebiete & Bezirke",
  "schlüsseldienst-franzoesisch-buchholz": "Schlüsseldienst Französisch Buchholz Berlin | Türöffnung 24/7",
  "schlüsseldienst-französisch-buchholz": "Schlüsseldienst Französisch-Buchholz | Türöffnung 24/7",
  "schlüsseldienst-koepenick": "Schlüsseldienst Koepenick Berlin | Türöffnung 24/7",
  "schlüsseldienst-köpenick": "Schlüsseldienst Köpenick | Türöffnung 24/7",
  "schlüsseldienst-schoeneberg": "Schlüsseldienst Schoeneberg Berlin | Türöffnung 24/7",
  "schlüsseldienst-schöneberg": "Schlüsseldienst Schöneberg | Türöffnung 24/7",
  "türöffnung-berlin-24h-notdienst": "Türöffnung Berlin 24/7 | Preise vor Beginn",
  "türöffnung-berlin-kosten": "Türöffnung Berlin Kosten | Preis vor Beginn klären",
  "tür-zugefallen-was-tun": "Tür zugefallen was tun? Berlin Ratgeber vom Schlüsseldienst",
  "schlüssel-steckt-innen-tür-zu": "Schlüssel steckt innen Tür zu | Hilfe vom Schlüsseldienst Berlin",
  "ratgeber/schluesseldienst-kosten-berlin": "Schlüsseldienst Kosten Berlin | Preise, Zuschläge & Festpreis",
  "ratgeber/schluessel-verloren-berlin": "Schlüssel verloren Berlin | Was tun und wann Schloss wechseln?",
  "ratgeber/tuer-zugefallen-berlin": "Tür zugefallen Berlin | Hilfe, Kosten und seriöser Ablauf"
};

const descriptionOverrides = {
  "": `Schlüsseldienst Berlin: Türöffnung ab 59 €, 24/7 erreichbar und in 10–30 Minuten vor Ort. Festpreis vor der Anfahrt am Telefon klären. Jetzt anrufen.`,
  "sitemap": `Sitemap von Trust Schlüsseldienst Berlin mit allen Leistungen, Bezirksseiten, Ratgebern und den englischen, spanischen und portugiesischen Seiten.`,
  "schlüsseldienst-in-der-nähe": `Schlüsseldienst in der Nähe für Berlin, 24/7 erreichbar. Türöffnung ab 59 €. Finden Sie schnelle Hilfe mit klarer Preisabsprache in Ihrem Bezirk.`,
  "leistung/schlüsselnotdienst": `Schlüsselnotdienst Berlin bei Aussperrung, 24/7 erreichbar und meist in 10 bis 30 Minuten vor Ort. Türöffnung ab 59 €, Preis vor Beginn geklärt.`,
  "leistung/öffnung-bei-zugefallenen-türen": `Tür zugefallen in Berlin? Wir öffnen eine nur ins Schloss gefallene Tür ohne Schäden. 24/7 erreichbar, Türöffnung ab 59 € mit Preisabsprache.`,
  "leistung/öffnung-bei-abgeschlossenen-türen": `Abgeschlossene Tür öffnen in Berlin. Wir prüfen Schloss und Zylinder, erklären das Vorgehen und öffnen 24/7 ab 59 € nach klarer Preisabsprache.`,
  "schlüsseldienst-zehlendorf": `Schlüsseldienst Zehlendorf bei Aussperrung, 24/7 erreichbar und meist in 10 bis 30 Minuten vor Ort. Türöffnung ab 59 €, Preis vor Beginn geklärt.`,
  "schlüsseldienst-wilmersdorf": `Schlüsseldienst Wilmersdorf, 24/7 erreichbar. Türöffnung ab 59 €. Wir klären Türzustand, Vorgehen und Preis, bevor der Einsatz bei Ihnen beginnt.`,
  "schlüsseldienst-friedrichshain": `Schlüsseldienst Friedrichshain für zugefallene und abgeschlossene Türen. 24/7 erreichbar, Türöffnung ab 59 € mit klarer Preisabsprache vor Beginn.`,
  "schlüsseldienst-lichtenberg": `Schlüsseldienst Lichtenberg für Türöffnungen, 24/7 erreichbar und meist in 10 bis 30 Minuten vor Ort. Türöffnung ab 59 € nach Preisabsprache.`,
  "schlüsseldienst-charlottenburg": `Schlüsseldienst Charlottenburg, 24/7 erreichbar. Türöffnung ab 59 €. Wir prüfen die Situation und stimmen den Preis vor Arbeitsbeginn mit Ihnen ab.`,
  "schlüsseldienst-franzoesisch-buchholz": `Schlüsseldienst Französisch Buchholz für zugefallene und abgeschlossene Türen. 24/7 erreichbar, Türöffnung ab 59 € nach klarer Preisabsprache.`,
  "schlüsseldienst-schoeneberg": `Schlüsseldienst Schöneberg bei Aussperrung, 24/7 erreichbar und meist in 10 bis 30 Minuten vor Ort. Türöffnung ab 59 €, Preis vorher geklärt.`,
  "leistung/montage-von-sicherheitsschlösser": `Sicherheitsschloss montieren in Berlin. Wir prüfen Tür und Schloss, wählen das Modell und stärken den Einbruchschutz. Einbau nach Absprache.`,
  "schlüssel-steckt-innen-tür-zu": `Schlüssel steckt innen und die Tür ist zu? Wir öffnen die zugefallene Tür möglichst ohne Schäden, 24/7 erreichbar und ab 59 € nach Preisabsprache.`,
  "türöffnung-berlin-24h-notdienst": `Türöffnung Berlin 24/7 für zugefallene oder abgeschlossene Türen. Türzustand, Berechtigung, Preis und mögliche Zusatzarbeiten klären wir vor Beginn.`,
  "schlüsseldienst-berlin-preise": `Schlüsseldienst Berlin Preise verständlich erklärt: Tür zugefallen, abgeschlossene Tür, Zylinderwechsel, Zuschläge und Festpreis am Telefon.`,
  "ratgeber/schluesseldienst-kosten-berlin": `Was kostet ein Schlüsseldienst in Berlin? Orientierung zu Türöffnung, Nachtzuschlag, Anfahrt, Material und fairer Preisabsprache.`,
  "ratgeber/schluessel-verloren-berlin": `Schlüssel verloren in Berlin? Erfahren Sie, wann Türöffnung, Zylinderwechsel oder neue Schlüssel sinnvoll sind und worauf Sie achten sollten.`,
  "ratgeber/tuer-zugefallen-berlin": `Tür zugefallen in Berlin? Was Sie sofort tun können, wann der Schlüsseldienst hilft und wie Preis, Legitimation und Ablauf geklärt werden.`,
  "leistung/schlosswechsel-berlin-schlösser-schnell-sicher-wechseln": `Schloss oder Schließzylinder wechseln in Berlin nach Schlüsselverlust, Defekt oder Sicherheitsbedenken. Material nur nach Absprache.`,
  "leistung/sicherheitstechnik-berlin-einbruchschutz-vom-profi": `Einbruchschutz in Berlin: Beratung zu Sicherheitsschloss, Schließzylinder und Türsicherung. Transparent, ohne unnötige Zusatzarbeiten.`
};

for (const [slug, page] of Object.entries(priorityDistrictPages)) {
  titleOverrides[slug] = page.title;
  descriptionOverrides[slug] = page.description;
}

const priorityLinks = [
  ["/leistung/schlüsselnotdienst/", "Schlüsselnotdienst Berlin"],
  ["/leistung/öffnung-bei-zugefallenen-türen/", "Tür zugefallen"],
  ["/türöffnung-berlin-24h-notdienst/", "Türöffnung Berlin"],
  ["/leistung/schlosswechsel-berlin-schlösser-schnell-sicher-wechseln/", "Schloss wechseln"],
  ["/leistung/sicherheitstechnik-berlin-einbruchschutz-vom-profi/", "Einbruchschutz"],
  ["/schlüsseldienst-berlin-preise/", "Schlüsseldienst Preise"],
  ["/ratgeber/schluesseldienst-kosten-berlin/", "Kosten-Ratgeber"],
  ["/ratgeber/schluessel-verloren-berlin/", "Schlüssel verloren"],
  ["/schlüsseldienst-in-der-nähe/", "Einsatzgebiete"]
];

const esc = (s) => String(s).replace(/[&<>\"]/g, (c) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const routeUrl = (slug) => `${site}/${slug ? `${slug}/` : ""}`;
const canonicalSlugFor = (slug) => canonicalRoutes.get(slug) ?? slug;
const leaf = (slug) => slug.split("/").at(-1);
const titleFor = (slug) => {
  if (districtRoutes.includes(slug)) {
    const district = districtNames[slug.slice(16)];
    return `Schlüsseldienst Berlin ${district} | ${district.length > 12 ? "Ab 59 €" : "Türöffnung ab 59 €"}`;
  }
  if (titleOverrides[slug]) return titleOverrides[slug];
  if (slug.startsWith("schlüsseldienst-") && districtNames[slug.slice(16)]) {
    const district = districtNames[slug.slice(16)];
    return `Schlüsseldienst Berlin ${district} | ${district.length > 12 ? "Ab 59 €" : "Türöffnung ab 59 €"}`;
  }
  return `${labels[leaf(slug)] || leaf(slug).replaceAll("-", " ")} | Trust Schlüsseldienst Berlin`;
};
const keywordFor = (slug) => !slug ? "Schlüsseldienst Berlin" : slug.startsWith("schlüsseldienst-") && districtNames[slug.slice(16)] ? `Schlüsseldienst Berlin ${districtNames[slug.slice(16)]}` : labels[leaf(slug)] || leaf(slug).replaceAll("-", " ");
const descriptionFor = (slug) => districtDescriptions[canonicalSlugFor(slug)] || descriptionOverrides[slug] || `${keywordFor(slug)}: Türöffnung, Schlüsselnotdienst, Schloss- und Zylinderwechsel mit klarer Preisabsprache vor Beginn. 24/7 erreichbar unter ${phoneDisplay}.`;

const pageTypeFor = (slug) => {
  if (!slug || slug === "startseite") return "home";
  if (slug === "impressum") return "legal";
  if (slug === "ratgeber") return "guide-index";
  if (slug.startsWith("ratgeber/")) return "guide";
  if (slug === "leistung") return "service-index";
  if (slug.startsWith("leistung/")) return "service";
  if (slug.startsWith("schlüsseldienst-") && districtNames[slug.slice(16)]) return "district";
  if (slug.includes("preise") || slug.includes("kosten")) return "price";
  return "service";
};

const serviceTypes = {
  "leistung/schlüsselnotdienst": "Schlüsselnotdienst",
  "leistung/öffnung-bei-zugefallenen-türen": "Öffnung einer zugefallenen Tür",
  "leistung/öffnung-bei-abgeschlossenen-türen": "Öffnung einer abgeschlossenen Tür",
  "leistung/schlosswechsel-berlin-schlösser-schnell-sicher-wechseln": "Schlosswechsel und Schließzylinderwechsel",
  "leistung/montage-von-sicherheitsschlösser": "Montage von Sicherheitsschlössern",
  "leistung/sicherheitstechnik-berlin-einbruchschutz-vom-profi": "Einbruchschutz und Sicherheitstechnik",
  "türöffnung-berlin-24h-notdienst": "Türöffnung und Schlüsselnotdienst",
  "schlüssel-steckt-innen-tür-zu": "Türöffnung bei innen steckendem Schlüssel",
  "schlüsseldienst-in-der-nähe": "Schlüsseldienst und Türöffnung in Berlin"
};

const offerCatalogServices = [
  ["Türöffnung bei zugefallener Tür", "Öffnung einer zugefallenen, nicht abgeschlossenen Tür", "leistung/öffnung-bei-zugefallenen-türen"],
  ["Türöffnung bei abgeschlossener Tür", "Öffnung einer abgeschlossenen Tür nach Prüfung von Schloss und Zylinder", "leistung/öffnung-bei-abgeschlossenen-türen"],
  ["Schlüsselnotdienst Berlin", "Hilfe bei Aussperrung, Schlüsselverlust und abgebrochenem Schlüssel", "leistung/schlüsselnotdienst"],
  ["Schloss- und Schließzylinderwechsel", "Austausch von Schloss oder Schließzylinder nach vorheriger Absprache", "leistung/schlosswechsel-berlin-schlösser-schnell-sicher-wechseln"],
  ["Einbruchschutz und Sicherheitstechnik", "Prüfung und Montage geeigneter Sicherungstechnik für Türen", "leistung/sicherheitstechnik-berlin-einbruchschutz-vom-profi"]
];

const businessEntity = (includeCatalog = false) => ({
  "@type": "Locksmith",
  "@id": businessId,
  name: "Trust Schlüsseldienst Berlin",
  legalName: "Trust B&M Service UG (haftungsbeschränkt)",
  description: businessDescription,
  url: `${site}/`,
  telephone: schemaPhone,
  email,
  logo: `${site}/assets/logo-trust-transparent.png`,
  image: [
    `${site}/assets/images/hero-schloss.jpg`,
    `${site}/assets/logo-trust-transparent.png`
  ],
  address: {
    "@type": "PostalAddress",
    streetAddress,
    postalCode: "13355",
    addressLocality: "Berlin",
    addressCountry: "DE"
  },
  areaServed: { "@type": "AdministrativeArea", name: "Berlin" },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    opens: "00:00",
    closes: "23:59"
  },
  currenciesAccepted: "EUR",
  priceRange: "€€",
  sameAs: [googleReviewUrl],
  ...(includeCatalog ? {
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Leistungen von Trust Schlüsseldienst Berlin",
      itemListElement: offerCatalogServices.map(([name, description, route]) => ({
        "@type": "Service",
        name,
        description,
        url: routeUrl(route),
        provider: { "@id": businessId },
        areaServed: { "@type": "AdministrativeArea", name: "Berlin" }
      }))
    }
  } : {})
});

const websiteEntity = () => ({
  "@type": "WebSite",
  "@id": websiteId,
  name: "Trust Schlüsseldienst Berlin",
  url: `${site}/`,
  inLanguage: ["de-DE", "en", "es", "pt-BR"],
  publisher: { "@id": businessId }
});

const serviceEntity = (slug, keyword, url, area) => ({
  "@type": "Service",
  "@id": `${url}#service`,
  name: keyword,
  description: descriptionFor(slug),
  url,
  serviceType: slug.startsWith("schlüsseldienst-") && districtNames[slug.slice(16)]
    ? `Schlüsseldienst und Türöffnung in ${area}`
    : serviceTypes[slug] || keyword,
  provider: { "@id": businessId },
  areaServed: {
    "@type": "AdministrativeArea",
    name: area === "Berlin" ? "Berlin" : `${area}, Berlin`
  }
});

function schema(slug, keyword, faqs) {
  const canonicalSlug = canonicalSlugFor(slug);
  const url = routeUrl(canonicalSlug);
  const area = slug.startsWith("schlüsseldienst-") ? districtNames[slug.slice(16)] : "Berlin";
  const pageType = pageTypeFor(slug);
  const breadcrumbId = `${url}#breadcrumb`;
  const hasService = pageType === "district" || Boolean(serviceTypes[slug]);
  const graph = [websiteEntity()];
  if (pageType !== "legal" && slug !== "sitemap") graph.unshift(businessEntity(!slug));
  graph.push({
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: titleFor(slug),
    description: descriptionFor(slug),
    inLanguage: "de-DE",
    isPartOf: { "@id": websiteId },
    about: { "@id": businessId },
    breadcrumb: { "@id": breadcrumbId },
    ...(hasService ? { mainEntity: { "@id": `${url}#service` } } : {})
  });
  graph.push({
    "@type": "BreadcrumbList",
    "@id": breadcrumbId,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Startseite", item: `${site}/` },
      ...(slug ? [{ "@type": "ListItem", position: 2, name: keyword, item: url }] : [])
    ]
  });
  if (hasService) graph.push(serviceEntity(slug, keyword, url, area || "Berlin"));
  if (faqs.length) graph.push({
    "@type": "FAQPage",
    "@id": `${url}#faq`,
    mainEntity: faqs.map(([q, a]) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a }
    }))
  });
  if (pageType === "guide") graph.push({
    "@type": "Article",
    "@id": `${url}#article`,
    headline: titleFor(slug),
    description: descriptionFor(slug),
    inLanguage: "de-DE",
    mainEntityOfPage: { "@id": `${url}#webpage` },
    author: { "@id": businessId },
    publisher: { "@id": businessId }
  });
  return `<script type="application/ld+json">${JSON.stringify({"@context":"https://schema.org","@graph":graph})}</script>`;
}

const alternateLanguages = [
  ["de", "/", "DE", "Deutsch"],
  ["en", "/en/locksmith-berlin/", "EN", "English"],
  ["es", "/es/cerrajero-berlin/", "ES", "Español"],
  ["pt-BR", "/pt/chaveiro-berlim/", "PT", "Português"]
];

const languageSwitcher = (current = "de", ariaLabel = "Sprache wählen") => {
  const selected = alternateLanguages.find(([code]) => code === current) || alternateLanguages[0];
  const options = alternateLanguages.filter(([code]) => code !== selected[0]);
  return `<div class="language-switcher" data-language-switcher><button class="language-toggle" type="button" aria-label="${esc(ariaLabel)}" aria-haspopup="true" aria-expanded="false" aria-controls="language-menu"><span>${selected[2]}</span><span class="language-arrow" aria-hidden="true">▾</span></button><div class="language-menu" id="language-menu" role="menu" aria-label="${esc(ariaLabel)}">${options.map(([code, href, , label]) => `<a href="${href}" lang="${code}" hreflang="${code}" role="menuitem">${label}</a>`).join("")}</div></div>`;
};

function headerFor(config = null, slug = "") {
  if (!config) return `<header class="site-header"><div class="container-wide header-inner"><a class="brand" href="/" aria-label="Trust Schlüsseldienst Berlin – Startseite"><img src="/assets/logo-trust-transparent.png?v=${version}" width="1346" height="440" alt="Trust Schlüsseldienst Berlin"></a><button class="menu-toggle" type="button" aria-label="Menü öffnen" aria-expanded="false" aria-controls="main-nav">&#9776;</button><nav id="main-nav" class="main-nav"><a href="/">Startseite</a><a href="/leistung/">Leistungen</a><a href="/türöffnung-berlin-24h-notdienst/">Türöffnung</a><a href="/schlüsseldienst-berlin-preise/">Preise</a><a href="/schlüsseldienst-in-der-nähe/">Einsatzgebiete</a><a href="/ratgeber/">Ratgeber</a></nav><div class="header-actions"><a class="button button-whatsapp" href="https://wa.me/493040563878">WhatsApp</a><a class="button button-primary" href="tel:${phone}">Jetzt anrufen</a></div>${languageSwitcher("de")}</div></header>`;
  const pageUrl = `/${slug}/`;
  return `<header class="site-header"><div class="container-wide header-inner"><a class="brand" href="${pageUrl}" aria-label="Trust Schlüsseldienst Berlin"><img src="/assets/logo-trust-transparent.png?v=${version}" width="1346" height="440" alt="Trust Schlüsseldienst Berlin"></a><button class="menu-toggle" type="button" aria-label="${esc(config.nav.menu)}" aria-expanded="false" aria-controls="main-nav">&#9776;</button><nav id="main-nav" class="main-nav"><a href="${pageUrl}">${esc(config.nav.home)}</a><a href="#situations">${esc(config.nav.situations)}</a><a href="#services">${esc(config.nav.services)}</a><a href="#process">${esc(config.nav.process)}</a><a href="#prices">${esc(config.nav.prices)}</a><a href="#faq">${esc(config.nav.faq)}</a></nav><div class="header-actions"><a class="button button-whatsapp" href="https://wa.me/493040563878">WhatsApp</a><a class="button button-primary" href="tel:${phone}">${esc(config.nav.call)}</a></div>${languageSwitcher(config.hreflang, config.nav.language)}</div></header>`;
}

function footerFor(config = null) {
  if (!config) return `<footer class="site-footer"><div class="container-wide"><div class="footer-grid footer-grid-compact"><div><img class="footer-logo" src="/assets/logo-trust-transparent.png?v=${version}" width="1346" height="440" alt="Trust Schlüsseldienst Berlin"><div class="footer-title">Trust Schlüsseldienst Berlin</div><p>Türöffnung, Schloss- und Zylinderwechsel in Berlin – mit Preisabsprache vor Beginn.</p>${googleReviewBadge}</div><div><div class="footer-title">Schnellzugriff</div><a href="/schlüsseldienst-berlin-preise/">Preise</a><a href="/leistung/schlüsselnotdienst/">Schlüsselnotdienst</a><a href="/türöffnung-berlin-24h-notdienst/">Türöffnung Berlin</a><a href="/schlüsseldienst-in-der-nähe/">Einsatzgebiete</a><a href="/impressum/">Impressum</a><a href="/sitemap/">Sitemap</a></div><div><div class="footer-title">Kontakt</div><p>${streetAddress}<br>13355 Berlin</p><a href="tel:${phone}">${phoneDisplay}</a><a href="https://wa.me/493040563878">WhatsApp</a><a href="mailto:${email}">${email}</a></div></div><div class="footer-bottom"><span>© ${new Date().getFullYear()} Trust Schlüsseldienst Berlin</span></div></div></footer><div class="mobile-callbar"><a class="button button-whatsapp" href="https://wa.me/493040563878">WhatsApp</a><a class="button button-primary" href="tel:${phone}">Anrufen</a></div>`;
  return `<footer class="site-footer"><div class="container-wide"><div class="footer-grid footer-grid-compact"><div><img class="footer-logo" src="/assets/logo-trust-transparent.png?v=${version}" width="1346" height="440" alt="Trust Schlüsseldienst Berlin"><div class="footer-title">Trust Schlüsseldienst Berlin</div><p>${esc(config.footerSummary)}</p></div><div><div class="footer-title">${esc(config.footerLinks.overview)}</div><a href="#situations">${esc(config.footerLinks.situations)}</a><a href="#services">${esc(config.footerLinks.services)}</a><a href="#prices">${esc(config.footerLinks.prices)}</a><a href="#faq">${esc(config.footerLinks.faq)}</a><a href="/impressum/">${esc(config.footerLinks.legal)}</a><a href="/sitemap/">${esc(config.footerLinks.sitemap)}</a></div><div><div class="footer-title">${esc(config.footerLinks.contact)}</div><p>${streetAddress}<br>13355 Berlin</p><a href="tel:${phone}">${phoneDisplay}</a><a href="https://wa.me/493040563878">WhatsApp</a><a href="mailto:${email}">${email}</a></div></div><div class="footer-bottom"><span>© ${new Date().getFullYear()} Trust Schlüsseldienst Berlin</span></div></div></footer><div class="mobile-callbar"><a class="button button-whatsapp" href="https://wa.me/493040563878">WhatsApp</a><a class="button button-primary" href="tel:${phone}">${esc(config.footerLinks.call)}</a></div>`;
}

const header = headerFor();
const footer = footerFor();

function faq(slug) {
  if (slug === "ratgeber" || slug === "leistung" || slug === "impressum" || canonicalRoutes.has(slug)) return [];
  if (priorityDistrictPages[slug]) return priorityDistrictPages[slug].faqs;
  if (!slug) return [
    ["Was kostet eine Türöffnung in Berlin?", "Die Öffnung einer nur zugefallenen, nicht abgeschlossenen Tür kostet von 07 bis 20 Uhr ab 59 €, von 20 bis 00 Uhr 79 € und von 00 bis 07 Uhr 99 €. Alle genannten Preise enthalten die Mehrwertsteuer. Der konkrete Festpreis und die Anfahrt werden vor der Anfahrt am Telefon vereinbart."],
    ["Wird der Festpreis wirklich vor der Anfahrt am Telefon vereinbart?", "Ja. Sie beschreiben Türzustand, Adresse, Uhrzeit und erkennbare Besonderheiten. Auf dieser Grundlage werden der konkrete Festpreis, die Anfahrt und das geplante Vorgehen am Telefon vereinbart, bevor der Auftrag beginnt."],
    ["Wie schnell ist der Schlüsseldienst vor Ort?", "Die übliche Anfahrt in Berlin beträgt 10 bis 30 Minuten. Die genaue Zeit hängt von Einsatzadresse, Verkehr, Tageszeit, Baustellen und aktueller Auftragslage ab. Beim Anruf nennen wir die voraussichtliche Anfahrtszeit."],
    ["Wird eine zugefallene Tür ohne Beschädigung geöffnet?", "Ja. Eine nur zugefallene und nicht abgeschlossene Tür wird ohne Beschädigung geöffnet. Bei einer abgeschlossenen, bereits beschädigten oder technisch defekten Tür hängt das Vorgehen vom Zustand von Schloss, Zylinder, Beschlag und Tür ab."],
    ["Was passiert, wenn die Tür abgeschlossen ist?", "Bei einer abgeschlossenen Tür prüfen wir Verriegelung, Schloss, Zylinder und Beschlag. Das passende Vorgehen sowie der dafür geltende Preis werden vor Arbeitsbeginn erklärt und vereinbart."],
    ["Welche Legitimation ist für die Türöffnung erforderlich?", "Vor oder unmittelbar nach der Öffnung prüfen wir die Berechtigung durch einen Ausweis. Liegt der Ausweis in der Wohnung, erfolgt die Prüfung direkt nach der Öffnung. Alternativ kann ein Nachbar die Berechtigung bestätigen."],
    ["Ist ein Profilzylinder im Türöffnungspreis enthalten?", "Nein. Profilzylinder, Schlösser, Beschläge und anderes Material sind nicht automatisch im Türöffnungspreis enthalten. Material wird nur nach vorheriger Absprache eingesetzt und berechnet."],
    ["Ist der Schlüsselnotdienst nachts und am Wochenende erreichbar?", "Ja. Trust Schlüsseldienst Berlin ist 24 Stunden täglich und an sieben Tagen in der Woche erreichbar, auch nachts, am Wochenende und an Feiertagen. Es gelten die sichtbaren Preise des jeweiligen Zeitfensters."]
  ];
  if (slug === "leistung/schlüsselnotdienst") return [
    ["Wann hilft der Schlüsselnotdienst in Berlin?", "Der Schlüsselnotdienst hilft bei Aussperrung, zugefallener oder abgeschlossener Tür, verlorenem oder abgebrochenem Schlüssel und einem Schlüssel, der innen steckt."],
    ["Was ist der Unterschied zwischen zugefallener und abgeschlossener Tür?", "Eine zugefallene Tür ist nicht verriegelt und lässt sich häufig mit einer schonenden Methode öffnen. Bei einer abgeschlossenen Tür müssen Schloss, Zylinder und Verriegelung genauer geprüft werden."],
    ["Wie werden Preis und mögliche Zusatzkosten vereinbart?", "Türzustand, Uhrzeit, Anfahrt und erkennbare Besonderheiten werden am Telefon besprochen. Material oder besondere Arbeiten werden nur nach zusätzlicher Absprache berechnet."],
    ["Welche Berechtigung ist für die Öffnung erforderlich?", "Vor der Türöffnung wird geprüft, ob Sie zum Zugang berechtigt sind. Liegt der Ausweis in der Wohnung, kann die Prüfung unmittelbar nach der Öffnung ergänzt werden."]
  ];
  if (slug === "türöffnung-berlin-24h-notdienst") return [
    ["Welche Türen öffnet Trust Schlüsseldienst Berlin?", "Wir helfen bei nur zugefallenen und abgeschlossenen Türen sowie bei innen steckenden oder abgebrochenen Schlüsseln. Das konkrete Vorgehen hängt von Tür, Schloss und Beschlag ab."],
    ["Kann eine zugefallene Tür ohne Beschädigung geöffnet werden?", "Eine nicht verriegelte Tür lässt sich häufig mit einer schonenden Methode öffnen. Vor Ort wird geprüft, welche Öffnungsmethode zur vorhandenen Tür passt."],
    ["Was kostet eine Türöffnung in Berlin?", "Der veröffentlichte Preis richtet sich nach Türzustand und Zeitfenster. Anfahrt, Besonderheiten und nur nach Absprache benötigtes Material werden vor Arbeitsbeginn geklärt."],
    ["Warum wird vor der Öffnung die Berechtigung geprüft?", "Die Prüfung schützt Bewohner und Eigentümer vor unberechtigten Öffnungen. Ein geeigneter Nachweis kann je nach Situation vor oder unmittelbar nach der Öffnung erfolgen."]
  ];
  if (slug.includes("schluessel-verloren") || slug === "schlüssel-steckt-innen-tür-zu") return [
    ["Muss nach einem verlorenen Schlüssel immer der Zylinder gewechselt werden?", "Nicht automatisch. Entscheidend ist, ob der Schlüssel einer konkreten Adresse zugeordnet werden kann und ein Sicherheitsrisiko besteht. Im Zweifel sollte die Situation fachlich geprüft werden."],
    ["Was sollte ich nach einem Schlüsselverlust zuerst tun?", "Prüfen Sie mögliche Fundorte, informieren Sie bei Mietobjekten gegebenenfalls Vermieter oder Hausverwaltung und lassen Sie sich beraten, bevor Material ausgetauscht wird."],
    ["Wie wird vor einer Türöffnung die Berechtigung geprüft?", "Vor der Öffnung wird die Zugangsberechtigung nachvollziehbar geprüft. Liegt der Ausweis in der Wohnung, kann die Prüfung unmittelbar nach der Öffnung ergänzt werden."]
  ];
  if (slug.includes("tuer-zugefallen") || slug.includes("tür-zugefallen") || slug.includes("zugefallenen-türen")) return [
    ["Lässt sich eine nur zugefallene Tür meist ohne Schaden öffnen?", "Eine nicht verriegelte Tür kann häufig mit einer schonenden Methode geöffnet werden. Welche Methode passt, hängt von Tür, Beschlag und Schloss ab."],
    ["Was darf ich bei einer zugefallenen Tür selbst versuchen?", "Prüfen Sie zuerst, ob ein Ersatzschlüssel erreichbar ist. Gewaltsame Versuche können Tür, Rahmen und Beschlag beschädigen und sollten vermieden werden."],
    ["Welche Angaben helfen bei der telefonischen Preiseinschätzung?", "Wichtig sind Bezirk, Uhrzeit, Türart, ob die Tür nur zugefallen oder abgeschlossen ist und ob ein Schlüssel von innen steckt."]
  ];
  if (slug.includes("kosten") || slug.includes("preise")) return [
    ["Wovon hängen die Kosten einer Türöffnung ab?", "Relevant sind Türzustand, Uhrzeit, Anfahrt, notwendige Öffnungsmethode und nur nach Absprache eingebautes Material."],
    ["Werden mögliche Zuschläge vor Beginn genannt?", "Ja. Uhrzeit, Anfahrt, Leistung und erkennbare Besonderheiten werden vor Arbeitsbeginn besprochen."],
    ["Ist Material im Preis der Türöffnung enthalten?", "Ein neuer Zylinder, Beschlag oder anderes Material ist nur enthalten, wenn dies ausdrücklich vereinbart wurde."]
  ];
  if (slug.includes("schlosswechsel") || slug.includes("sicherheitsschlösser") || slug.includes("sicherheitstechnik")) return [
    ["Wann ist ein Zylinder- oder Schlosswechsel sinnvoll?", "Typische Gründe sind Schlüsselverlust mit Sicherheitsrisiko, ein Defekt, ein Einbruchschaden oder der Wunsch nach besserem Schutz."],
    ["Wird Material ohne Zustimmung eingebaut?", "Nein. Ausführung, Material und Kosten werden vor dem Einbau besprochen."],
    ["Was gehört zu wirksamem Einbruchschutz an der Tür?", "Zylinder, Schutzbeschlag, Schloss, Schließblech und Türblatt sollten zusammen betrachtet werden. Einzelne Komponenten allein lösen nicht jedes Sicherheitsproblem."]
  ];
  return [
    ["Kann eine zugefallene Tür schonend geöffnet werden?", "Eine nur zugefallene, nicht verriegelte Tür lässt sich häufig ohne Beschädigung öffnen. Die konkrete Situation wird vor Ort geprüft."],
    ["Welche Legitimation ist für die Türöffnung nötig?", "Vor der Öffnung prüfen wir die Berechtigung. Liegt der Ausweis in der Wohnung, kann die Legitimation unmittelbar nach der Öffnung ergänzt werden."],
    ["Ist Trust Schlüsseldienst Berlin rund um die Uhr erreichbar?", "Ja, Trust Schlüsseldienst Berlin ist telefonisch 24 Stunden am Tag und an sieben Tagen pro Woche erreichbar."]
  ];
}

const trustBar = `<section class="trust-strip"><div class="container trust-grid"><div><strong>24/7 erreichbar</strong><span>Tag und Nacht anrufen</span></div><div><strong>Preis vor Beginn</strong><span>Klare Absprache</span></div><div><strong>Legitimation</strong><span>Sicherer Ablauf</span></div><div><strong>Rechnung möglich</strong><span>Nachvollziehbare Leistung</span></div></div></section>`;

function prices() { return `<section id="preise" class="section-soft"><div class="container"><div class="section-intro"><span class="eyebrow">Transparente Orientierung</span><h2>Preise für Türöffnung und Zylinderwechsel</h2><p>Alle Beträge inkl. MwSt. Anfahrt und mögliche Zusatzarbeiten werden telefonisch genannt und vor Arbeitsbeginn vereinbart.</p></div><div class="price-table-wrap"><table><thead><tr><th>Leistung</th><th>07–20 Uhr</th><th>20–00 Uhr</th><th>00–07 Uhr</th></tr></thead><tbody><tr><td>Zugefallene Tür öffnen</td><td>59 €</td><td>79 €</td><td>99 €</td></tr><tr><td>Abgeschlossene Tür öffnen</td><td>89 €</td><td>109 €</td><td>129 €</td></tr><tr><td>Zylinderwechsel</td><td>89 €</td><td>109 €</td><td>129 €</td></tr></tbody></table></div><div class="mobile-price-list"><article><h3>Zugefallene Tür</h3><p><span>07–20 Uhr</span><strong>59 €</strong></p><p><span>20–00 Uhr</span><strong>79 €</strong></p><p><span>00–07 Uhr</span><strong>99 €</strong></p></article><article><h3>Abgeschlossene Tür</h3><p><span>07–20 Uhr</span><strong>89 €</strong></p><p><span>20–00 Uhr</span><strong>109 €</strong></p><p><span>00–07 Uhr</span><strong>129 €</strong></p></article><article><h3>Zylinderwechsel</h3><p><span>07–20 Uhr</span><strong>89 €</strong></p><p><span>20–00 Uhr</span><strong>109 €</strong></p><p><span>00–07 Uhr</span><strong>129 €</strong></p></article></div><p class="fine-print">Profilzylinder, Sicherheitsbeschläge und sonstiges Material sind nur nach ausdrücklicher Absprache Bestandteil des Auftrags.</p></div></section>`; }

const homepageReviews = [
  ["Bike Pro", "Extrem schnell, professionell, zuvorkommend und vor allem freundlich und nett. Klärt auf und spricht nicht von oben herab. 100%ige Empfehlung!"],
  ["Christoph Eder", "Super nett, schnell da und macht auch am Wochenende einen total fairen Preis!"],
  ["Himanshu Dubey", "Bilal is very prompt and kind. He came within 20 mins late in the evening to help open the door. Thanks again."],
  ["Simon Mayer", "Ich hatte mich Samstag Abend in Berlin Wedding ausgesperrt. Der Schlüsseldienst war schnell da, die Tür war offen und der Preis fair."],
  ["Viktoria Wagner", "Selbst am Feiertag keinen 100% Zuschlag wie die anderen. Die Tür war schnell offen und dazu war er super nett!"],
  ["Bianca E", "Super unkompliziert, freundlich und fairer Preis!"]
];

function reviewsSection(slug) {
  if (slug && slug !== "startseite") return "";
  return `<section class="customer-feedback"><div class="container"><div class="section-intro review-intro"><span class="eyebrow">Kundenerfahrungen</span><h2>Kundenbewertungen</h2><p>Diese Rückmeldungen sind bereits im Google-Profil von Trust Schlüsseldienst Berlin veröffentlicht. Die Auswahl zeigt Erfahrungen mit Anfahrt, Preisabsprache, Abend- und Wochenendeinsätzen sowie einer Türöffnung in Wedding.</p></div><div class="review-grid">${homepageReviews.map(([name, text]) => `<article class="review-card"><div class="review-card-stars" aria-label="5 von 5 Sternen">★★★★★</div><p>${esc(text)}</p><footer>~ ${esc(name)}</footer></article>`).join("")}</div><div class="review-actions"><a class="review-action-primary" href="${googleReviewUrl}" target="_blank" rel="noopener noreferrer"><span class="review-google-mark">G</span> Alle Bewertungen ansehen</a><a class="review-action-secondary" href="${googleWriteReviewUrl}" target="_blank" rel="noopener noreferrer"><span aria-hidden="true">☆</span> Bewerten Sie uns auf Google</a></div></div></section>`;
}

function districts(prioritize = false) {
  if (!prioritize) return `<section id="einsatzgebiete"><div class="container"><div class="section-intro"><span class="eyebrow">Lokaler Schlüsseldienst</span><h2>Einsatzgebiete in ganz Berlin</h2><p>Wählen Sie Ihren Bezirk. Die bestehenden lokalen Seiten bleiben unter ihren bisherigen URLs erreichbar.</p></div><div class="area-links">${districtRoutes.map(r=>`<a href="/${r}/">${districtNames[r.slice(16)]}</a>`).join("")}</div></div></section>`;
  const priority = priorityDistrictSlugs.filter((slug) => districtRoutes.includes(slug));
  const further = districtRoutes.filter((slug) => !priority.includes(slug));
  return `<section id="einsatzgebiete"><div class="container"><div class="section-intro"><span class="eyebrow">Einsatz in Berlin</span><h2>Schlüsseldienst in Ihrer Nähe – Einsatzgebiete in Berlin</h2><p>Die folgenden Seiten informieren über Türöffnung, Preise und Anfahrt im jeweiligen Bezirk. Es handelt sich um Einsatzgebiete, nicht um zusätzliche Filialen. Die Unternehmensadresse bleibt Ramlerstr. 2a in 13355 Berlin.</p></div><div class="area-links priority-area-links">${priority.map((slug) => `<a href="/${slug}/"><strong>Schlüsseldienst Berlin ${districtNames[slug.slice(16)]}</strong><span>24/7 Türöffnung ab 59 €</span></a>`).join("")}</div><h3 class="home-outskirts-title">Weitere Berliner Bezirke und Ortsteile</h3><div class="area-links home-outskirts-links">${further.map((slug) => `<a href="/${slug}/">${districtNames[slug.slice(16)]}</a>`).join("")}</div></div></section>`;
}

function internalLinkList(slug) {
  const contextualLinks = slug === "leistung/öffnung-bei-zugefallenen-türen"
    ? [["/ratgeber/tuer-zugefallen-berlin/", "Ratgeber: Tür zugefallen"]]
    : [];
  return [...contextualLinks, ...priorityLinks]
    .filter(([href]) => href !== `/${slug}/`)
    .slice(0, 6)
    .map(([href, label]) => `<a href="${href}">${label}</a>`)
    .join("");
}

const pageDetails = {
  "leistung": ["Schlüsseldienst-Leistungen in Berlin", "Von der schonenden Öffnung einer zugefallenen Tür bis zum abgestimmten Schloss- oder Zylinderwechsel: Wählen Sie die Leistung, die zu Ihrer Situation passt.", "Wir unterscheiden klar zwischen Türöffnung, Schlüsselnotdienst und Sicherheitsarbeiten. So erhalten Sie vor Beginn eine nachvollziehbare Einschätzung."],
  "leistung/schlüsselnotdienst": ["Schlüsselnotdienst Berlin bei akuten Schlüsselfällen", "Wir helfen, wenn Sie ausgesperrt sind, der Schlüssel fehlt, abgebrochen ist oder innen steckt. Am Telefon klären wir Türzustand, Bezirk, Uhrzeit und die voraussichtliche Leistung.", "Vor der Öffnung prüfen wir Ihre Berechtigung. Ein Zylinderwechsel erfolgt nur, wenn er technisch oder aus Sicherheitsgründen sinnvoll ist und Sie zugestimmt haben."],
  "türöffnung-berlin-24h-notdienst": ["Türöffnung Berlin – zugefallen oder abgeschlossen", "Eine nur zugefallene Tür erfordert meist ein anderes Vorgehen als eine verriegelte Tür. Deshalb fragen wir bereits am Telefon nach Türart, Schloss, Beschlag und einem möglicherweise innen steckenden Schlüssel.", "Vor Ort bestätigen wir die Situation und die Berechtigung. Anschließend verwenden wir die passende, möglichst schonende Öffnungsmethode."],
  "leistung/öffnung-bei-zugefallenen-türen": ["Zugefallene Tür in Berlin öffnen lassen", "Ist die Tür lediglich ins Schloss gefallen und nicht verriegelt, ist häufig eine schonende Öffnung möglich. Bitte vermeiden Sie gewaltsame Eigenversuche, die Rahmen oder Beschlag beschädigen können.", "Nennen Sie uns am Telefon Bezirk, Türart und Besonderheiten. Preis, Anfahrt und mögliche Zuschläge werden vor Beginn besprochen."],
  "leistung/öffnung-bei-abgeschlossenen-türen": ["Abgeschlossene Tür in Berlin fachgerecht öffnen", "Bei einer verriegelten Tür müssen Schloss, Zylinder, Beschlag und Verriegelung genauer geprüft werden. Der Aufwand kann deshalb höher sein als bei einer nur zugefallenen Tür.", "Wir erklären die geeignete Methode und mögliche Materialkosten vor der Ausführung. Ein Austausch erfolgt ausschließlich nach Ihrer Zustimmung."],
  "leistung/schlosswechsel-berlin-schlösser-schnell-sicher-wechseln": ["Schloss und Schließzylinder in Berlin wechseln", "Ein Wechsel kann bei Defekt, Schlüsselverlust mit Sicherheitsrisiko, Einbruchschaden oder veränderten Zugangsberechtigungen sinnvoll sein.", "Wir prüfen Maße und vorhandene Komponenten, besprechen geeignete Varianten und bauen Material nur nach ausdrücklicher Preis- und Leistungsabsprache ein."],
  "leistung/montage-von-sicherheitsschlösser": ["Sicherheitsschlösser fachgerecht montieren", "Die Montage richtet sich nach Tür, Beschlag, vorhandenem Einsteckschloss und dem gewünschten Schutzniveau.", "Vor dem Einbau klären wir, welche Komponenten technisch zusammenpassen. Material und Montageumfang werden verständlich vereinbart."],
  "leistung/sicherheitstechnik-berlin-einbruchschutz-vom-profi": ["Einbruchschutz und Sicherheitstechnik in Berlin", "Wir betrachten Türblatt, Zylinder, Schutzbeschlag, Schloss und Schließblech als System. So lassen sich Schwachstellen gezielt erkennen.", "Empfehlungen richten sich nach der vorhandenen Tür und dem tatsächlichen Bedarf. Unnötige Komponenten werden nicht ohne Absprache eingebaut."],
  "schlüsseldienst-berlin-preise": ["Schlüsseldienst Berlin: Preise transparent einordnen", "Die Preisübersicht unterscheidet zwischen zugefallener und abgeschlossener Tür sowie den angegebenen Zeitfenstern. Anfahrt und erkennbare Besonderheiten werden vor Beginn geklärt.", "Material wie Profilzylinder oder Sicherheitsbeschlag ist nur nach ausdrücklicher Vereinbarung Bestandteil des Auftrags."],
  "türöffnung-berlin-kosten": ["Kosten einer Türöffnung in Berlin", "Für die Kosten ist entscheidend, ob die Tür nur zugefallen oder abgeschlossen ist, wann der Einsatz erfolgt und ob besondere Sicherheitstechnik vorhanden ist.", "Diese Seite erklärt die Kostenfaktoren einer Türöffnung. Die vollständige Preisübersicht zeigt zusätzlich Zylinderwechsel und Zeitfenster."],
  "schlüssel-steckt-innen-tür-zu": ["Tür zu und Schlüssel steckt innen", "Ein innen steckender Schlüssel verändert die Situation am Schloss. Teilen Sie uns am Telefon mit, ob ein zweiter Schlüssel vorhanden ist und ob die Tür nur zugefallen oder zusätzlich abgeschlossen wurde.", "Wir prüfen zuerst eine schonende Öffnung. Ein Austausch von Zylinder oder Schloss erfolgt nur, wenn er notwendig ist und vereinbart wurde."]
};

function intentBlock(slug, keyword, district) {
  if (slug === "impressum" || slug === "impressum.html") return "";
  const detail = pageDetails[slug] || (district ? [
    `${keyword}: Hilfe vor Ort`,
    `Trust Schlüsseldienst Berlin ist in ${district} für zugefallene und abgeschlossene Türen, Schlüsselnotfälle sowie abgestimmte Schloss- und Zylinderwechsel erreichbar.`,
    `Nennen Sie uns Straße, Türzustand und Besonderheiten am Schloss. Anfahrt, Leistung, Uhrzeit und mögliche Zuschläge werden vor Arbeitsbeginn geklärt.`
  ] : [
    `${keyword} mit klarer Absprache`,
    "Wir klären am Telefon, ob die Tür zugefallen oder abgeschlossen ist, ob ein Schlüssel innen steckt und welche Leistung tatsächlich benötigt wird.",
    "Vor Arbeitsbeginn werden Berechtigung, Vorgehen, Anfahrt und mögliche Zuschläge nachvollziehbar besprochen."
  ]);
  return `<section class="seo-focus"><div class="container split"><div><h2>${esc(detail[0])}</h2><p>${esc(detail[1])}</p><p>${esc(detail[2])}</p></div><div class="card seo-link-card"><h3>Passende Leistungen und Informationen</h3><div class="area-links compact-links">${internalLinkList(slug)}</div></div></div></section>`;
}

function headingHtml(keyword) {
  if (keyword.startsWith("Schlüsseldienst ")) {
    return `<span class="title-primary">Schlüsseldienst</span><span class="title-location">${esc(keyword.slice("Schlüsseldienst ".length))}</span>`;
  }
  return esc(keyword);
}

const guideArticles = {
  "ratgeber/schluesseldienst-kosten-berlin": {
    h1: "Schlüsseldienst-Kosten in Berlin verstehen",
    intro: "Die Kosten hängen vor allem von Türzustand, Uhrzeit, Anfahrt, Öffnungsmethode und vereinbartem Material ab. Dieser Ratgeber hilft Ihnen, ein telefonisches Angebot richtig einzuordnen.",
    sections: [
      ["Diese Angaben beeinflussen den Preis", "Teilen Sie mit, ob die Tür nur zugefallen oder abgeschlossen ist, ob ein Schlüssel innen steckt, welche Türart vorliegt und in welchem Berliner Bezirk Sie Hilfe benötigen."],
      ["Vor Beginn vollständig nachfragen", "Lassen Sie sich Anfahrt, Grundpreis, zeitabhängige Zuschläge und mögliche Materialkosten erklären. Ein neuer Zylinder oder Beschlag sollte nur nach ausdrücklicher Zustimmung eingebaut werden."],
      ["Preisübersicht statt Überraschungen", "Unsere Preisübersicht nennt die veröffentlichten Beträge für typische Türsituationen und Zeitfenster. Besondere Arbeiten werden vor der Ausführung separat vereinbart."]
    ],
    link: ["/schlüsseldienst-berlin-preise/", "Zur Preisübersicht"]
  },
  "ratgeber/schluessel-verloren-berlin": {
    h1: "Schlüssel verloren in Berlin – was jetzt wichtig ist",
    intro: "Nach einem Schlüsselverlust zählt zuerst die Sicherheitslage. Nicht jeder verlorene Schlüssel macht sofort einen Zylinderwechsel nötig, doch ein Bezug zur Adresse kann das Risiko erhöhen.",
    sections: [
      ["Fundorte und Ersatzschlüssel prüfen", "Gehen Sie die letzten Wege durch und klären Sie, ob eine Vertrauensperson einen Ersatzschlüssel besitzt. Bei Mietobjekten kann auch die Hausverwaltung ein sinnvoller Ansprechpartner sein."],
      ["Sicherheitsrisiko realistisch einschätzen", "Ist der Schlüssel zusammen mit Ausweis, Anschrift oder eindeutig zuordenbaren Unterlagen verloren gegangen, sollte ein Zylinderwechsel geprüft werden."],
      ["Nur passende Maßnahmen beauftragen", "Türöffnung und Zylinderwechsel sind getrennte Leistungen. Lassen Sie sich erklären, was notwendig ist, welches Material verwendet wird und welche Kosten entstehen."]
    ],
    link: ["/leistung/schlosswechsel-berlin-schlösser-schnell-sicher-wechseln/", "Schloss- und Zylinderwechsel ansehen"]
  },
  "ratgeber/tuer-zugefallen-berlin": {
    h1: "Tür zugefallen in Berlin – richtig handeln",
    intro: "Bleiben Sie ruhig und prüfen Sie zuerst, ob ein Ersatzschlüssel erreichbar ist. Eine nur zugefallene Tür unterscheidet sich technisch und preislich von einer verriegelten Tür.",
    sections: [
      ["Gewaltsame Versuche vermeiden", "Werkzeuge oder Hebelversuche können Türblatt, Rahmen, Dichtung und Beschlag beschädigen. Dadurch kann aus einer einfachen Öffnung eine teure Reparatur werden."],
      ["Situation am Telefon genau beschreiben", "Nennen Sie Bezirk, Türart, Uhrzeit und ob die Tür abgeschlossen wurde oder ein Schlüssel von innen steckt. Das ermöglicht eine bessere Einschätzung vor der Anfahrt."],
      ["Berechtigung bereithalten", "Ein seriöser Schlüsseldienst prüft, ob Sie zum Zugang berechtigt sind. Liegt der Ausweis in der Wohnung, kann die Prüfung nach der Öffnung ergänzt werden."]
    ],
    link: ["/leistung/öffnung-bei-zugefallenen-türen/", "Türöffnung bei zugefallener Tür"]
  }
};

const faqSection = (slug, keyword, faqs) => faqs.length ? `<section class="section-soft"${!slug ? ' id="faq"' : ""}><div class="container"><div class="section-intro"><span class="eyebrow">Häufige Fragen</span><h2>${!slug ? "Häufige Fragen zum Schlüsseldienst Berlin" : `Antworten zu ${esc(keyword)}`}</h2></div><div class="faq-list">${faqs.map(([q,a])=>`<details class="faq-item"><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join("")}</div></div></section>` : "";
const contactCta = `<section><div class="container"><div class="cta-panel"><div><h2>Hilfe vom Schlüsseldienst Berlin</h2><p>Schildern Sie Bezirk und Türsituation. Preis und Vorgehen werden vor Beginn besprochen.</p></div><div class="cta-actions"><a class="button button-primary" href="tel:${phone}">${phoneDisplay}</a><a class="button button-whatsapp" href="https://wa.me/493040563878">WhatsApp</a></div></div></div></section>`;

function guideIndexContent() {
  return `<section class="page-hero compact"><div class="container"><span class="eyebrow">Praktische Hilfe</span><h1>Ratgeber zum Schlüsseldienst in Berlin</h1><p>Verständliche Hinweise für typische Schlüsselsituationen – damit Sie Risiken, Kostenfaktoren und sinnvolle nächste Schritte besser einschätzen können.</p></div></section><section><div class="container"><div class="section-intro clean-intro"><h2>Hilfreiche Informationen für den Ernstfall</h2><p>Die Artikel erklären konkrete Situationen und führen bei Bedarf zur passenden Leistung. Sie ersetzen keine Prüfung der individuellen Tür- oder Sicherheitslage.</p></div><div class="grid-3 service-cards-clean">${Object.entries(guideArticles).map(([slug, article]) => `<a class="card service-card-clean" href="/${slug}/"><h3>${esc(article.h1)}</h3><p>${esc(article.intro)}</p><span class="card-button">Ratgeber lesen</span></a>`).join("")}</div></div></section>${contactCta}`;
}

function serviceIndexContent() {
  const services = [
    ["/türöffnung-berlin-24h-notdienst/", "Türöffnung Berlin", "Hilfe bei zugefallenen und abgeschlossenen Türen – mit Prüfung der Situation und Preisabsprache vor Beginn."],
    ["/leistung/schlüsselnotdienst/", "Schlüsselnotdienst Berlin", "Akute Hilfe bei Aussperrung, Schlüsselverlust, abgebrochenem oder innen steckendem Schlüssel."],
    ["/schlüssel-steckt-innen-tür-zu/", "Schlüssel steckt innen", "Gezielte Hilfe, wenn die Tür geschlossen ist und der Schlüssel auf der Innenseite steckt."],
    ["/leistung/öffnung-bei-zugefallenen-türen/", "Nur zugefallene Tür", "Schonende Öffnung einer nicht verriegelten Tür nach Prüfung von Tür, Schloss und Beschlag."],
    ["/leistung/öffnung-bei-abgeschlossenen-türen/", "Abgeschlossene Tür", "Fachgerechte Einschätzung einer verriegelten Tür und nachvollziehbare Erklärung des Vorgehens."],
    ["/leistung/schlosswechsel-berlin-schlösser-schnell-sicher-wechseln/", "Schloss- und Zylinderwechsel", "Passender Austausch nach Defekt, Schlüsselverlust oder Sicherheitsbedenken – Material nur nach Absprache."],
    ["/leistung/sicherheitstechnik-berlin-einbruchschutz-vom-profi/", "Einbruchschutz Berlin", "Beratung zu Zylinder, Schutzbeschlag, Schloss und Schließblech als abgestimmtes Sicherheitssystem."],
    ["/leistung/montage-von-sicherheitsschlösser/", "Sicherheitsschloss montieren", "Montage geeigneter Komponenten nach technischer Prüfung und transparenter Materialvereinbarung."]
  ];
  return `<section class="page-hero compact"><div class="container"><span class="eyebrow">Leistungsübersicht</span><h1>Schlüsseldienst-Leistungen in Berlin</h1><p>Wählen Sie die Leistung, die zu Ihrer Tür- oder Sicherheitssituation passt. Bei einem akuten Fall erreichen Sie uns 24/7 telefonisch und per WhatsApp.</p></div></section><section><div class="container"><div class="section-intro clean-intro"><h2>Türöffnung, Schlosswechsel und Einbruchschutz</h2><p>Jede Leistung beginnt mit einer klaren Einschätzung. Berechtigung, Preis, mögliche Zuschläge und Material werden vor der Ausführung besprochen.</p></div><div class="grid-3 service-cards-clean">${services.map(([href, heading, text]) => `<a class="card service-card-clean" href="${href}"><h2>${esc(heading)}</h2><p>${esc(text)}</p><span class="card-button">Mehr erfahren</span></a>`).join("")}</div></div></section>${prices()}${contactCta}`;
}

function guideArticleContent(slug, faqs) {
  const article = guideArticles[slug];
  if (!article) return guideIndexContent();
  return `<article><section class="page-hero compact"><div class="container"><span class="eyebrow">Ratgeber</span><h1>${esc(article.h1)}</h1><p>${esc(article.intro)}</p></div></section><section><div class="container"><div class="grid-3 service-cards-clean">${article.sections.map(([heading, text]) => `<section class="card service-card-clean"><h2>${esc(heading)}</h2><p>${esc(text)}</p></section>`).join("")}</div><div class="review-actions"><a class="button button-primary" href="${article.link[0]}">${esc(article.link[1])}</a><a class="button button-secondary" href="/ratgeber/">Alle Ratgeber</a></div></div></section>${faqSection(slug, article.h1, faqs)}${contactCta}</article>`;
}

const commercialHero = (h1, intro, priceHref = "/#preise") => `<section class="page-hero page-hero-image"><div class="container"><div class="hero-copy"><h1>${esc(h1)}</h1><p>${esc(intro)}</p>${googleReviewBadge}<div class="hero-actions"><a class="button button-primary" href="tel:${phone}">Jetzt anrufen</a><a class="button button-whatsapp" href="https://wa.me/493040563878">WhatsApp</a><a class="button button-secondary" href="${priceHref}">Preise ansehen</a></div><ul class="hero-points"><li>Festpreis am Telefon</li><li>24/7 Türöffnung</li><li>Einbruchschutz</li></ul></div></div></section>`;

const districtHero = (h1, intro) => `<section class="page-hero page-hero-image home-hero district-home-hero"><div class="container"><div class="hero-copy"><a class="home-hero-rating" href="${googleReviewUrl}" target="_blank" rel="noopener noreferrer" aria-label="Google-Bewertungen von Trust Schlüsseldienst Berlin ansehen"><span class="google-word" aria-hidden="true"><span>G</span><span>o</span><span>o</span><span>g</span><span>l</span><span>e</span></span><span class="review-stars" aria-hidden="true">★★★★★</span><span><strong>5,0</strong> · 105 Bewertungen</span></a><h1>${esc(h1)}</h1><p class="home-hero-intro">${esc(intro)}</p><ul class="home-hero-checks"><li>24/7 im Berliner Bezirk erreichbar</li><li>In 10–30 Minuten vor Ort, abhängig von Adresse und Verkehr</li><li>Zugefallene Tür ohne Beschädigung</li><li>Festpreis vor der Anfahrt am Telefon</li></ul><div class="hero-actions home-hero-actions"><a class="button home-call-button" href="tel:${phone}">${phoneIcon}030 40563878 anrufen</a><a class="button button-whatsapp home-whatsapp-button" href="https://wa.me/493040563878">${whatsappIcon}WhatsApp-Kontakt</a></div></div></div></section>`;

function priorityDistrictContent(slug, page) {
  const hero = districtHero(page.h1, page.hero);
  const intro = `<section class="district-intro"><div class="container split district-intro-grid"><div><span class="eyebrow">Trust Schlüsseldienst Berlin</span><h2>${esc(page.introTitle)}</h2>${page.intro.map((text) => `<p>${esc(text)}</p>`).join("")}</div><figure class="district-photo"><img src="${page.image}?v=${version}" width="1200" height="750" alt="${esc(page.imageAlt)}" loading="eager"><figcaption>${esc(page.imageCaption)}</figcaption></figure></div></section>`;
  const price = `<section id="preise" class="section-soft district-prices"><div class="container"><div class="section-intro clean-intro"><span class="eyebrow">Preis vor Arbeitsbeginn</span><h2>Türöffnung ab 59 € in ${esc(page.name)}</h2><p>Die Öffnung einer nur zugefallenen Tür kostet von 07–20 Uhr ab 59 €. Alle Beträge verstehen sich inklusive Mehrwertsteuer. Anfahrt und mögliche Zusatzarbeiten werden telefonisch genannt und vor Arbeitsbeginn vereinbart.</p></div><div class="price-table-wrap"><table><thead><tr><th>Leistung</th><th>07–20 Uhr</th><th>20–00 Uhr</th><th>00–07 Uhr</th></tr></thead><tbody><tr><td>Zugefallene Tür öffnen</td><td>59 €</td><td>79 €</td><td>99 €</td></tr><tr><td>Abgeschlossene Tür öffnen</td><td>89 €</td><td>109 €</td><td>129 €</td></tr><tr><td>Zylinderwechsel</td><td>89 €</td><td>109 €</td><td>129 €</td></tr></tbody></table></div><div class="mobile-price-list"><article><h3>Zugefallene Tür</h3><p><span>07–20 Uhr</span><strong>59 €</strong></p><p><span>20–00 Uhr</span><strong>79 €</strong></p><p><span>00–07 Uhr</span><strong>99 €</strong></p></article><article><h3>Abgeschlossene Tür</h3><p><span>07–20 Uhr</span><strong>89 €</strong></p><p><span>20–00 Uhr</span><strong>109 €</strong></p><p><span>00–07 Uhr</span><strong>129 €</strong></p></article><article><h3>Zylinderwechsel</h3><p><span>07–20 Uhr</span><strong>89 €</strong></p><p><span>20–00 Uhr</span><strong>109 €</strong></p><p><span>00–07 Uhr</span><strong>129 €</strong></p></article></div><p class="fine-print">Profilzylinder, Sicherheitsbeschläge und sonstiges Material sind nur nach ausdrücklicher Absprache Bestandteil des Auftrags. Eine nur zugefallene, nicht verriegelte Tür öffnen wir ohne Beschädigung.</p></div></section>`;
  const arrival = `<section class="district-arrival"><div class="container split"><div><span class="eyebrow">Lokale Anfahrt</span><h2>${esc(page.arrivalTitle)}</h2><p>${esc(page.arrival)}</p></div><div class="card district-contact-card"><h3>Für die Anfahrt bereithalten</h3><ul class="mini-list"><li>Vollständige Adresse und Bezirk</li><li>Tür nur zugefallen oder abgeschlossen?</li><li>Steckt ein Schlüssel auf der Innenseite?</li><li>Etage, Aufgang oder Hinterhof</li></ul><a class="button button-primary" href="tel:${phone}">03040563878 anrufen</a></div></div></section>`;
  const services = `<section class="district-services"><div class="container"><div class="section-intro clean-intro"><span class="eyebrow">Leistungen</span><h2>${esc(page.servicesTitle)}</h2><p>${esc(page.servicesIntro)}</p></div><div class="grid-3 service-cards-clean">${page.services.map(([heading, text], index) => `<article class="card service-card-clean"><h3>${esc(heading)}</h3><p>${esc(text)}</p><a class="card-button" href="${index === 0 ? "/leistung/öffnung-bei-zugefallenen-türen/" : index === 1 ? "/leistung/schlüsselnotdienst/" : "/leistung/sicherheitstechnik-berlin-einbruchschutz-vom-profi/"}">Mehr erfahren</a></article>`).join("")}</div></div></section>`;
  const process = `<section class="section-blue district-process"><div class="container"><div class="section-intro"><span class="eyebrow">Nachvollziehbarer Auftrag</span><h2>So läuft der Einsatz in ${esc(page.name)} ab</h2></div><div class="process-grid"><div class="process-step"><span>1</span><h3>Situation schildern</h3><p>Adresse, Türzustand, Schloss und einen innen steckenden Schlüssel telefonisch nennen.</p></div><div class="process-step"><span>2</span><h3>Preis vereinbaren</h3><p>Grundpreis, Zeitfenster, Anfahrt und erkennbare Besonderheiten vor der Anfahrt klären.</p></div><div class="process-step"><span>3</span><h3>Berechtigung nachweisen</h3><p>Ausweis zeigen oder bei einem Ausweis in der Wohnung die Identität durch Nachbarn bestätigen lassen.</p></div><div class="process-step"><span>4</span><h3>Auftrag ausführen</h3><p>Tür nach Vereinbarung öffnen; Material oder Zusatzarbeiten nur nach erneuter Zustimmung ausführen.</p></div></div></div></section>`;
  const areas = `<section class="district-areas"><div class="container split"><div><span class="eyebrow">Einsatzgebiet</span><h2>${esc(page.areasTitle)}</h2><p>${esc(page.areas)}</p></div><div class="card seo-link-card"><h3>Angrenzende Bezirksseiten</h3><div class="area-links compact-links">${page.neighbors.map(([href, label]) => `<a href="${href}">Schlüsseldienst ${esc(label)}</a>`).join("")}</div></div></div></section>`;
  const experience = page.experience ? `<section class="section-soft district-experience"><div class="container"><div class="section-intro clean-intro"><span class="eyebrow">Echte Google-Rückmeldung</span><h2>Kundenerfahrung aus Wedding</h2></div><blockquote class="district-review"><div aria-label="5 von 5 Sternen">★★★★★</div><p>„${esc(page.experience[1])}“</p><cite>${esc(page.experience[0])}</cite></blockquote></div></section>` : "";
  const links = `<section class="district-links"><div class="container"><div class="section-intro clean-intro"><h2>Wichtige Informationen vor Ihrem Auftrag</h2><p>Vertiefende Angaben zu Leistungen, Preisen und Sicherheit finden Sie auf den zentralen Fachseiten von Trust Schlüsseldienst Berlin.</p></div><div class="area-links district-service-links"><a href="/">Startseite</a><a href="/türöffnung-berlin-24h-notdienst/">Türöffnung Berlin</a><a href="/leistung/schlüsselnotdienst/">Schlüsselnotdienst</a><a href="/schlüsseldienst-berlin-preise/">Preise</a><a href="/leistung/schlosswechsel-berlin-schlösser-schnell-sicher-wechseln/">Schloss wechseln</a><a href="/leistung/sicherheitstechnik-berlin-einbruchschutz-vom-profi/">Einbruchschutz</a><a href="#kontakt">Kontakt</a></div></div></section>`;
  const blocks = { intro, price, arrival, services, process, areas };
  const orders = {
    "schlüsseldienst-gesundbrunnen": ["intro", "price", "arrival", "services", "process", "areas"],
    "schlüsseldienst-wedding": ["intro", "arrival", "price", "services", "process", "areas"],
    "schlüsseldienst-prenzlauerberg": ["intro", "services", "arrival", "price", "process", "areas"],
    "schlüsseldienst-pankow": ["intro", "price", "services", "areas", "arrival", "process"],
    "schlüsseldienst-mitte": ["intro", "arrival", "services", "price", "process", "areas"],
    "schlüsseldienst-reinickendorf": ["intro", "services", "price", "arrival", "areas", "process"]
  };
  return `${hero}${orders[slug].map((key) => blocks[key]).join("")}${experience}${links}${faqSection(slug, `Schlüsseldienst Berlin ${page.name.replace(/^Berlin-/, "")}`, page.faqs)}${contactCta}`;
}

const processSection = `<section class="section-blue"><div class="container"><div class="section-intro"><span class="eyebrow">So läuft es ab</span><h2>In vier klaren Schritten wieder Zugang erhalten</h2></div><div class="process-grid"><div class="process-step"><span>1</span><h3>Situation schildern</h3><p>Bezirk, Türart und Türzustand am Telefon möglichst genau beschreiben.</p></div><div class="process-step"><span>2</span><h3>Preis klären</h3><p>Anfahrt, Leistung, Uhrzeit und mögliche Besonderheiten werden vor Beginn besprochen.</p></div><div class="process-step"><span>3</span><h3>Berechtigung prüfen</h3><p>Vor Ort prüfen wir nachvollziehbar, ob Sie zum Zugang berechtigt sind.</p></div><div class="process-step"><span>4</span><h3>Tür öffnen</h3><p>Wir wählen die zur Situation passende und möglichst schonende Methode.</p></div></div></div></section>`;

function homePrices() {
  return `<section id="preise" class="section-soft home-price-section"><div class="container"><div class="home-price-card"><div class="section-intro clean-intro"><span class="eyebrow">Klare Trust-Preise inklusive Mehrwertsteuer</span><h2>Preise für die Türöffnung bei zugefallener Tür</h2><p class="home-price-lead">Festpreis und Anfahrt werden vor dem Einsatz am Telefon vereinbart.</p></div><div class="home-door-price-grid" role="list" aria-label="Preise für eine nur zugefallene Tür"><article class="home-door-price-item" role="listitem"><span>07:00–20:00 Uhr</span><strong>59 €</strong></article><article class="home-door-price-item" role="listitem"><span>20:00–00:00 Uhr</span><strong>79 €</strong></article><article class="home-door-price-item home-door-price-item-wide" role="listitem"><span>00:00–07:00 Uhr</span><strong>99 €</strong></article></div><div class="home-price-notes"><p>Die Preise gelten für eine nur zugefallene, nicht abgeschlossene Tür. Anfahrt und Festpreis werden vor dem Einsatz am Telefon vereinbart. Bei abgeschlossenen Türen, defekten Schlössern oder zusätzlichen Arbeiten gilt der vorher telefonisch vereinbarte Preis. Profilzylinder und weiteres Material sind nicht im Türöffnungspreis enthalten und werden nur nach vorheriger Absprache berechnet.</p><p>Alle sichtbaren Preise enthalten die Mehrwertsteuer.</p><div class="home-price-actions"><a class="button button-primary" href="tel:${phone}">${phoneIcon}Jetzt anrufen</a><a class="button button-secondary" href="/schlüsseldienst-berlin-preise/">Alle Preise ansehen</a></div></div></div></div></section>`;
}

function homePageContent(faqs) {
  const heroRating = `<a class="home-hero-rating" href="${googleReviewUrl}" target="_blank" rel="noopener noreferrer" aria-label="Google-Bewertungen von Trust Schlüsseldienst Berlin ansehen"><span class="google-word" aria-hidden="true"><span>G</span><span>o</span><span>o</span><span>g</span><span>l</span><span>e</span></span><span class="review-stars" aria-hidden="true">★★★★★</span><span><strong>5,0</strong> · 105 Bewertungen</span></a>`;
  const hero = `<section class="page-hero page-hero-image home-hero"><div class="container"><div class="hero-copy">${heroRating}<h1><span class="home-h1-brand">Trust Schlüsseldienst Berlin</span><span class="home-h1-offer"> – Türöffnung ab 59 €</span></h1><p class="home-hero-intro">Tür zugefallen, ausgesperrt, Schlüssel verloren oder Schloss defekt? Trust Schlüsseldienst Berlin ist 24/7 erreichbar. Den Festpreis und die voraussichtliche Anfahrt vereinbaren wir vor dem Einsatz am Telefon.</p><ul class="home-hero-checks"><li>24/7 Schlüsselnotdienst in Berlin</li><li>In 10–30 Minuten vor Ort, abhängig von Adresse und Verkehr</li><li>Zugefallene Tür ohne Beschädigung</li><li>Festpreis vor der Anfahrt am Telefon</li></ul><div class="hero-actions home-hero-actions"><a class="button home-call-button" href="tel:${phone}">${phoneIcon}030 40563878 anrufen</a><a class="button button-whatsapp home-whatsapp-button" href="https://wa.me/493040563878">${whatsappIcon}WhatsApp-Kontakt</a></div></div></div></section>`;

  const afterPrice = `<section class="home-after-price" id="türsituationen"><div class="container home-after-price-grid"><article class="home-after-price-content"><span class="eyebrow">Direkte Hilfe aus Berlin</span><h2>Trust Schlüsseldienst Berlin für Türöffnung und Schlüsselnotdienst</h2><p>Eine zugefallene Wohnungstür, ein innen steckender Schlüssel oder ein defektes Schloss erfordern unterschiedliche Lösungen. Beschreiben Sie beim Anruf, ob die Tür nur ins Schloss gefallen oder abgeschlossen ist und ob sich der Schlüssel noch im Zylinder befindet. So können wir das Vorgehen, die Anfahrt und den Preis passend zu Ihrer Situation vereinbaren.</p><h3>Tür zugefallen oder ausgesperrt?</h3><p>Eine nur zugefallene Tür wurde nicht mit dem Schlüssel verriegelt. Diese Tür öffnen wir ohne Beschädigung. Tagsüber beginnt der veröffentlichte Preis bei 59 Euro inklusive Mehrwertsteuer. Weitere Einzelheiten finden Sie unter <a href="/leistung/öffnung-bei-zugefallenen-türen/">Öffnung bei zugefallener Tür</a>. Bei einer abgeschlossenen Tür werden Schloss, Zylinder und Beschlag zuerst geprüft; dafür gelten andere Preise und Methoden.</p><h3>Schlüssel steckt innen, ist verloren oder abgebrochen?</h3><p>Steckt der Schlüssel innen, ist wichtig, ob die Tür verriegelt wurde und ob außen ein Schlüsselloch vorhanden ist. Unsere Hinweise zu <a href="/schlüssel-steckt-innen-tür-zu/">Schlüssel steckt innen, Tür zu</a> erklären den passenden Ablauf. Ist ein Schlüssel im Zylinder abgebrochen, nennen Sie uns bitte, ob ein Teil herausragt. Dafür ist der <a href="/leistung/schlüsselnotdienst/#schluessel-abgebrochen">Schlüsselnotdienst bei abgebrochenem Schlüssel</a> zuständig. Ein Schloss- oder Zylinderwechsel erfolgt nur, wenn er erforderlich ist und Sie dem genannten Preis zustimmen.</p><a class="button button-secondary" href="/türöffnung-berlin-24h-notdienst/">Mehr zur Türöffnung in Berlin</a></article><aside class="home-after-price-aside" aria-label="Ablauf und Preisabsprache"><section class="card home-process-card"><h2>So läuft eine Türöffnung bei Trust ab</h2><ol class="home-process-list"><li><strong>Situation schildern</strong><span>Adresse, Bezirk und Türzustand am Telefon nennen.</span></li><li><strong>Preis und Anfahrt klären</strong><span>Festpreis und voraussichtliche Ankunft werden vor der Fahrt vereinbart.</span></li><li><strong>Berechtigung prüfen</strong><span>Ausweis oder einen anderen geeigneten Nachweis bereithalten.</span></li><li><strong>Tür öffnen</strong><span>Die Methode richtet sich nach Schloss, Verriegelung und Türzustand.</span></li><li><strong>Rechnung erhalten</strong><span>Zusätzliche Arbeiten oder Material nur nach Ihrer Zustimmung.</span></li></ol></section><section class="card home-transparency-card"><h2>Vor dem Auftrag geklärt</h2><ul class="home-transparency-list"><li>Berliner Unternehmensanschrift im Impressum</li><li>Preise inklusive Mehrwertsteuer</li><li>Material nur nach ausdrücklicher Absprache</li></ul></section></aside></div></section>`;

  const services = `<section id="leistungen"><div class="container"><div class="section-intro clean-intro"><span class="eyebrow">Leistungen für Tür und Schloss</span><h2>Unsere Leistungen als Schlüsseldienst in Berlin</h2><p>Welche Arbeit sinnvoll ist, hängt vom Türzustand und vom konkreten Problem ab. Eine Türöffnung, ein Schlosswechsel und ein Materialeinbau sind getrennte Leistungen und werden auch getrennt besprochen.</p></div><div class="grid-3 home-service-grid"><article class="card service-card-clean"><h3>Türöffnung bei zugefallener Tür</h3><p>Eine nur zugefallene und nicht abgeschlossene Tür wird ohne Beschädigung geöffnet. Der Preis richtet sich nach dem Zeitfenster und beginnt tagsüber bei 59 € inklusive Mehrwertsteuer.</p><a class="card-button" href="/leistung/öffnung-bei-zugefallenen-türen/">Zugefallene Tür öffnen lassen</a></article><article class="card service-card-clean"><h3>Öffnung einer abgeschlossenen Tür</h3><p>Bei einer verriegelten Tür werden Schloss, Zylinder und Beschlag geprüft. Das geplante Vorgehen und der geltende Preis werden vor Arbeitsbeginn verständlich erklärt.</p><a class="card-button" href="/leistung/öffnung-bei-abgeschlossenen-türen/">Abgeschlossene Tür öffnen lassen</a></article><article class="card service-card-clean"><h3>Schlüsselnotdienst</h3><p>Der Schlüsselnotdienst hilft bei akuter Aussperrung, einem innen steckenden Schlüssel oder einem Problem am Schloss. Er ist 24 Stunden täglich und an sieben Tagen in der Woche erreichbar.</p><a class="card-button" href="/leistung/schlüsselnotdienst/">Zum Schlüsselnotdienst Berlin</a></article><article class="card service-card-clean"><h3>Abgebrochener oder verlorener Schlüssel</h3><p>Ein abgebrochener Schlüssel kann den Zylinder blockieren; ein verlorener Schlüssel kann ein Sicherheitsrisiko darstellen. Nach der Prüfung besprechen wir, ob eine Öffnung genügt oder ein Wechsel sinnvoll ist.</p><a class="card-button" href="/leistung/schlüsselnotdienst/#schluessel-abgebrochen">Hilfe bei Schlüsselproblemen</a></article><article class="card service-card-clean"><h3>Schlosswechsel</h3><p>Ein Schlosswechsel kann nach einem Defekt, einem Einbruchversuch oder bei einer unpassenden alten Verriegelung nötig sein. Material, Montage und Preis werden vor dem Austausch vereinbart.</p><a class="card-button" href="/leistung/schlosswechsel-berlin-schlösser-schnell-sicher-wechseln/">Schlosswechsel in Berlin</a></article><article class="card service-card-clean"><h3>Profilzylinder und Zylinderwechsel</h3><p>Ein Profilzylinder wird nach Schlüsselverlust, Defekt oder bei einem Umzug geprüft und bei Bedarf gewechselt. Der Zylinder ist nicht im Preis einer Türöffnung enthalten und wird nur nach Zustimmung eingebaut.</p><a class="card-button" href="/leistung/schlosswechsel-berlin-schlösser-schnell-sicher-wechseln/">Zylinderwechsel erklären lassen</a></article><article class="card service-card-clean"><h3>Defektes Schloss reparieren</h3><p>Klemmt das Schloss oder greift die Verriegelung nicht, prüfen wir zuerst die Ursache. Reparatur, Austausch und möglicherweise benötigte Teile werden vor der Ausführung besprochen.</p><a class="card-button" href="/leistung/schlosswechsel-berlin-schlösser-schnell-sicher-wechseln/">Defektes Schloss prüfen lassen</a></article><article class="card service-card-clean"><h3>Einbruchschutz und Türsicherung</h3><p>Bei der mechanischen Sicherung müssen Zylinder, Schutzbeschlag, Schloss, Schließblech und Tür zusammenpassen. Wir besprechen geeignete Maßnahmen und den Preis vor der Montage.</p><a class="card-button" href="/leistung/sicherheitstechnik-berlin-einbruchschutz-vom-profi/">Einbruchschutz in Berlin</a></article></div></div></section>`;

  const damageFree = `<section class="section-soft"><div class="container split home-explanation"><div><span class="eyebrow">Klare Unterscheidung</span><h2>Zugefallene Tür ohne Beschädigung öffnen</h2><p>Eine nur zugefallene und nicht abgeschlossene Tür wird ohne Beschädigung geöffnet. Sie wurde nicht mit dem Schlüssel verriegelt, sondern ist lediglich ins Schloss gefallen. Diese Aussage gilt genau für diesen Türzustand.</p><p>Ist die Tür abgeschlossen, das Schloss defekt oder sind Bauteile bereits beschädigt, wird die Situation vor Ort geprüft. Dann hängt die Methode von Verriegelung, Zylinder, Beschlag und Tür ab. Wir behaupten deshalb nicht, dass jede verriegelte oder defekte Tür ohne Schäden geöffnet werden kann.</p><a class="button button-secondary" href="/leistung/öffnung-bei-zugefallenen-türen/">Details zur zugefallenen Tür</a></div><div><span class="eyebrow">Realistische Zeitangabe</span><h2>In 10–30 Minuten in Berlin vor Ort</h2><p>Die Anfahrt beträgt je nach Einsatzadresse und Verkehr 10 bis 30 Minuten. Tageszeit, Baustellen und Auftragslage können die Fahrzeit verändern. Die Spanne ist keine starre Garantie.</p><p>Beim Anruf prüfen wir, von wo die Anfahrt erfolgt, und nennen die voraussichtliche Zeit für Ihre Adresse. So wissen Sie vor der Beauftragung, wann mit der Ankunft zu rechnen ist und welche Anfahrt vereinbart wurde.</p><a class="button button-secondary" href="/schlüsseldienst-in-der-nähe/">Schlüsseldienst in der Nähe finden</a></div></div></section>`;

  const reasons = `<section><div class="container"><div class="section-intro clean-intro"><span class="eyebrow">Vor dem Auftrag geklärt</span><h2>Warum Kunden Trust Schlüsseldienst Berlin anrufen</h2><p>Sie erreichen uns direkt telefonisch. Anfahrtszeit und vereinbarter Preis stehen vor dem Auftrag fest.</p></div><div class="home-benefit-grid"><div class="card"><h3>Preis und Anfahrt</h3><ul class="mini-list"><li>Türöffnung einer zugefallenen Tür ab 59 €</li><li>Festpreis für den konkreten Auftrag am Telefon</li><li>Anfahrt wird vor der Beauftragung genannt</li><li>Alle Tabellenpreise inklusive Mehrwertsteuer</li></ul></div><div class="card"><h3>Ausführung und Material</h3><ul class="mini-list"><li>Zugefallene, nicht abgeschlossene Tür ohne Beschädigung</li><li>Material nur nach ausdrücklicher Absprache</li><li>Keine automatische Berechnung eines Profilzylinders</li><li>Vorgehen wird vor Arbeitsbeginn erklärt</li></ul></div><div class="card"><h3>Erreichbarkeit und Prüfung</h3><ul class="mini-list"><li>24 Stunden täglich direkt erreichbar</li><li>Voraussichtliche Anfahrt 10 bis 30 Minuten</li><li>Berechtigungsprüfung durch Ausweis oder Bestätigung</li><li>5,0 Sterne bei 105 Google-Bewertungen</li></ul></div></div></div></section>`;

  const security = `<section class="section-soft"><div class="container split home-security"><div><span class="eyebrow">Geplante Arbeiten</span><h2>Schlosswechsel und Einbruchschutz in Berlin</h2><p>Ein Schloss- oder Zylinderwechsel kann sinnvoll sein, wenn ein Schlüssel verloren wurde und einer Adresse zugeordnet werden kann, wenn der Zylinder defekt ist, nach einem Umzug oder nach einem Einbruchversuch. Auch veraltete Beschläge und eine schwache mechanische Türsicherung können Anlass für eine Prüfung sein.</p><p>Der Preis einer Türöffnung umfasst nicht automatisch einen neuen Profilzylinder, ein Schloss oder einen Beschlag. Vor einer Montage erklären wir, welche Teile benötigt werden, was die Arbeit kostet und ob eine Reparatur als Alternative möglich ist. Erst nach Ihrer Zustimmung wird Material eingebaut.</p><div class="hero-actions"><a class="button button-secondary" href="/leistung/schlosswechsel-berlin-schlösser-schnell-sicher-wechseln/">Schlosswechsel Berlin</a><a class="button button-secondary" href="/leistung/sicherheitstechnik-berlin-einbruchschutz-vom-profi/">Einbruchschutz Berlin</a></div></div><div class="card"><h3>Kontakt und Unternehmensadresse</h3><p><strong>Trust Schlüsseldienst Berlin</strong><br>Ramlerstr. 2a<br>13355 Berlin</p><p><a href="tel:${phone}">${phoneDisplay}</a><br><a href="mailto:${email}">${email}</a></p><a class="button button-primary" href="/#kontakt">Kontakt zum Schlüsseldienst</a></div></div></section>`;

  return `${hero}${homePrices()}${afterPrice}${services}${damageFree}${districts(true)}${reasons}${reviewsSection("")}${security}${faqSection("", "Schlüsseldienst Berlin", faqs)}${contactCta}`;
}

function emergencyServiceContent(faqs) {
  return `${commercialHero("Schlüsselnotdienst Berlin", "Akut ausgesperrt, Schlüssel verloren oder Schlüssel abgebrochen? Der Trust Schlüsselnotdienst Berlin ist 24/7 erreichbar. Wir klären Türzustand, Berechtigung und Preis vor Beginn.", "/schlüsseldienst-berlin-preise/")}<section><div class="container"><div class="section-intro clean-intro"><h2>24/7 Hilfe bei akuten Schlüsselfällen</h2><p>Beschreiben Sie am Telefon genau, was passiert ist. Je nach Türzustand, Schloss und Schlüsselproblem unterscheidet sich das notwendige Vorgehen.</p></div><div class="grid-3 service-cards-clean"><a class="card service-card-clean" href="/leistung/öffnung-bei-zugefallenen-türen/"><h3>Tür nur zugefallen</h3><p>Die Tür ist ins Schloss gefallen, wurde aber nicht mit dem Schlüssel verriegelt. Diese Situation lässt sich häufig schonender lösen.</p><span class="card-button">Mehr erfahren</span></a><a class="card service-card-clean" href="/leistung/öffnung-bei-abgeschlossenen-türen/"><h3>Tür abgeschlossen</h3><p>Bei einer verriegelten Tür prüfen wir Schloss, Zylinder und Beschlag und erklären das geeignete Vorgehen vor Beginn.</p><span class="card-button">Mehr erfahren</span></a><div class="card service-card-clean" id="schluessel-abgebrochen"><h3>Schlüssel verloren oder abgebrochen</h3><p>Wir prüfen, ob eine Türöffnung genügt oder ob wegen Defekt oder Sicherheitsrisiko weitere Arbeiten sinnvoll sind. Ein Austausch erfolgt nur nach Absprache.</p><a class="card-button" href="/ratgeber/schluessel-verloren-berlin/">Hinweise lesen</a></div></div></div></section><section class="section-soft"><div class="container split"><div><h2>Zugefallen oder abgeschlossen?</h2><p>Eine zugefallene Tür ist nicht verriegelt. Eine abgeschlossene Tür wurde mit dem Schlüssel zugesperrt. Diese Unterscheidung beeinflusst Methode, Aufwand und mögliche Kosten. Teilen Sie uns den Zustand bereits am Telefon mit.</p><a class="button button-secondary" href="/türöffnung-berlin-24h-notdienst/">Türöffnung Berlin</a></div><div class="card"><h3>Berechtigungsprüfung</h3><p>Vor einer Öffnung muss nachvollziehbar sein, dass Sie zum Zugang berechtigt sind. Liegt der Ausweis in der Wohnung, kann die Prüfung nach der Öffnung ergänzt werden.</p><a class="button button-secondary" href="/schlüsseldienst-berlin-preise/">Preise und Zuschläge</a></div></div></section>${processSection}${prices()}<section><div class="container"><div class="section-intro clean-intro"><h2>Preis, Material und Zusatzarbeiten</h2><p>Der veröffentlichte Preis richtet sich nach Türzustand und Zeitfenster. Material, ein notwendiger Zylinderwechsel oder andere Zusatzarbeiten sind nicht automatisch enthalten und werden nur nach Prüfung und Ihrer Zustimmung ausgeführt.</p></div></div></section>${faqSection("leistung/schlüsselnotdienst", "Schlüsselnotdienst Berlin", faqs)}${contactCta}`;
}

function doorOpeningContent(faqs) {
  return `${commercialHero("Türöffnung Berlin", "Tür zu, Schlüssel nicht erreichbar oder im Schloss abgebrochen? Bei einer Türöffnung in Berlin klären wir Situation, Berechtigung, Preis und mögliche Zusatzarbeiten vor Beginn.", "/schlüsseldienst-berlin-preise/")}<section><div class="container"><div class="section-intro clean-intro"><h2>Welche Türsituation liegt vor?</h2><p>Die genaue Ausgangslage entscheidet über Methode und Aufwand. Wählen Sie den Fall, der Ihrer Situation am nächsten kommt.</p></div><div class="grid-3 service-cards-clean"><a class="card service-card-clean" href="/leistung/öffnung-bei-zugefallenen-türen/"><h3>Tür zugefallen</h3><p>Die Tür ist ins Schloss gefallen, aber nicht abgeschlossen.</p><span class="card-button">Mehr erfahren</span></a><a class="card service-card-clean" href="/leistung/öffnung-bei-abgeschlossenen-türen/"><h3>Tür abgeschlossen</h3><p>Die Tür wurde mit dem Schlüssel verriegelt.</p><span class="card-button">Mehr erfahren</span></a><a class="card service-card-clean" href="/schlüssel-steckt-innen-tür-zu/"><h3>Schlüssel steckt innen</h3><p>Der Schlüssel steckt auf der Innenseite und die Tür ist geschlossen.</p><span class="card-button">Mehr erfahren</span></a><a class="card service-card-clean" href="/leistung/schlüsselnotdienst/#schluessel-abgebrochen"><h3>Schlüssel abgebrochen</h3><p>Ein Teil des Schlüssels steckt im Schloss oder Zylinder.</p><span class="card-button">Zum Schlüsselnotdienst</span></a></div></div></section>${processSection}<section class="section-soft"><div class="container split"><div><h2>Berechtigung vor der Türöffnung</h2><p>Wir öffnen nur, wenn die Zugangsberechtigung nachvollziehbar ist. Halten Sie einen Ausweis, Mietvertrag oder eine andere geeignete Bestätigung bereit. Befindet sich der Nachweis in der Wohnung, kann er direkt nach der Öffnung geprüft werden.</p></div><div class="card"><h3>Akuter Notfall?</h3><p>Der Schlüsselnotdienst ist rund um die Uhr für akute Aussperrungen und Schlüsselprobleme erreichbar.</p><a class="button button-secondary" href="/leistung/schlüsselnotdienst/">Schlüsselnotdienst Berlin</a></div></div></section>${prices()}<section><div class="container"><div class="section-intro clean-intro"><h2>Material und mögliche Zusatzarbeiten</h2><p>Eine Türöffnung und ein Schloss- oder Zylinderwechsel sind getrennte Leistungen. Falls Material oder zusätzliche Arbeit erforderlich ist, erklären wir Grund und Kosten vor der Ausführung. Ohne Ihre Zustimmung erfolgt kein Austausch.</p><a class="button button-secondary" href="/schlüsseldienst-berlin-preise/">Alle Preise ansehen</a></div></div></section>${faqSection("türöffnung-berlin-24h-notdienst", "Türöffnung Berlin", faqs)}${contactCta}`;
}

const hreflangTags = () => `${alternateLanguages.map(([code, href]) => `<link rel="alternate" hreflang="${code}" href="${site}${href}">`).join("")}<link rel="alternate" hreflang="x-default" href="${site}/">`;

const openGraphTags = ({ title, description, ogLocale }, url, includeTwitterDetails = false) => `<meta property="og:type" content="website"><meta property="og:site_name" content="Trust Schlüsseldienst Berlin"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${url}"><meta property="og:locale" content="${ogLocale}"><meta property="og:image" content="${site}/assets/images/hero-schloss.jpg"><meta name="twitter:card" content="summary_large_image">${includeTwitterDetails ? `<meta name="twitter:title" content="${esc(title)}"><meta name="twitter:description" content="${esc(description)}"><meta name="twitter:image" content="${site}/assets/images/hero-schloss.jpg">` : ""}`;

function internationalSchema(slug, config) {
  const url = routeUrl(slug);
  const breadcrumbId = `${url}#breadcrumb`;
  const graph = [
    businessEntity(),
    websiteEntity(),
    {
      "@type": "WebPage",
      "@id": `${url}#webpage`,
      url,
      name: config.title,
      description: config.description,
      inLanguage: config.lang,
      isPartOf: { "@id": websiteId },
      about: { "@id": businessId },
      breadcrumb: { "@id": breadcrumbId },
      mainEntity: { "@id": `${url}#service` }
    },
    {
      "@type": "BreadcrumbList",
      "@id": breadcrumbId,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: config.nav.home, item: `${site}/` },
        { "@type": "ListItem", position: 2, name: config.h1, item: url }
      ]
    },
    {
      "@type": "Service",
      "@id": `${url}#service`,
      name: config.h1,
      description: config.description,
      url,
      serviceType: config.h1,
      provider: { "@id": businessId },
      areaServed: { "@type": "AdministrativeArea", name: "Berlin" }
    },
    {
      "@type": "FAQPage",
      "@id": `${url}#faq`,
      inLanguage: config.lang,
      mainEntity: config.faqs.map(([question, answer]) => ({
        "@type": "Question",
        name: question,
        acceptedAnswer: { "@type": "Answer", text: answer }
      }))
    }
  ];
  return `<script type="application/ld+json">${JSON.stringify({"@context":"https://schema.org","@graph":graph})}</script>`;
}

const localizedCards = (items) => items.map(([heading, text]) => `<article class="card service-card-clean"><h3>${esc(heading)}</h3><p>${esc(text)}</p></article>`).join("");

function internationalPrices(config) {
  const [serviceLabel, ...timeLabels] = config.priceTable.columns;
  const desktopRows = config.priceTable.rows.map(([service, ...prices]) => `<tr><td>${esc(service)}</td>${prices.map((price) => `<td>${esc(price)}</td>`).join("")}</tr>`).join("");
  const mobileRows = config.priceTable.rows.map(([service, ...prices]) => `<article><h3>${esc(service)}</h3>${prices.map((price, index) => `<p><span>${esc(timeLabels[index])}</span><strong>${esc(price)}</strong></p>`).join("")}</article>`).join("");
  return `<section id="prices" class="section-soft international-price-section"><div class="container"><div class="section-intro clean-intro"><span class="eyebrow">${esc(config.priceTable.eyebrow)}</span><h2>${esc(config.priceTitle)}</h2><p>${esc(config.priceIntro)}</p></div><div class="international-price-layout"><div><div class="price-table-wrap"><table><thead><tr><th>${esc(serviceLabel)}</th>${timeLabels.map((label) => `<th>${esc(label)}</th>`).join("")}</tr></thead><tbody>${desktopRows}</tbody></table></div><div class="mobile-price-list">${mobileRows}</div></div><aside class="card international-price-points"><ul>${config.pricePoints.map((point) => `<li>${esc(point)}</li>`).join("")}</ul></aside></div><p class="fine-print">${esc(config.priceTable.finePrint)}</p></div></section>`;
}

const publishedInternationalReviews = [
  ["Christoph Eder", "Super nett, schnell da und macht auch am Wochenende einen total fairen Preis!"],
  ["Himanshu Dubey", "Bilal is very prompt and kind. He came within 20 mins late in the evening to help open the door. Thanks again."],
  ["Bianca E", "Super unkompliziert, freundlich und fairer Preis!"]
];

function internationalReviewsSection(config) {
  return `<section class="international-reviews section-soft"><div class="container"><div class="section-intro clean-intro"><h2>${esc(config.reviewsTitle)}</h2><p>${esc(config.reviewsIntro)}</p></div><div class="international-review-grid">${publishedInternationalReviews.map(([name, text]) => `<article class="card international-review-card"><div class="review-stars" aria-label="${esc(config.reviewAria)}">★★★★★</div><blockquote>${esc(text)}</blockquote><cite>${esc(name)}</cite></article>`).join("")}</div><p class="international-review-link"><a class="button button-secondary" href="${googleReviewUrl}" target="_blank" rel="noopener noreferrer">${esc(config.reviewLink)}</a></p></div></section>`;
}

function internationalContent(config) {
  const ratingText = config.hreflang === "en" ? "5.0 · 105 reviews" : config.hreflang === "es" ? "5,0 · 105 reseñas" : "5,0 · 105 avaliações";
  return `<section class="page-hero page-hero-image international-hero"><div class="container"><div class="hero-copy"><a class="international-hero-rating" href="${googleReviewUrl}" target="_blank" rel="noopener noreferrer"><span class="google-word">Google</span><span class="review-stars" aria-hidden="true">★★★★★</span><span>${esc(ratingText)}</span></a><h1>${esc(config.h1)}</h1><p class="international-hero-lead">${esc(config.hero)}</p><ul class="international-hero-facts">${config.heroFacts.map((fact) => `<li>${esc(fact)}</li>`).join("")}</ul><a class="hero-phone" href="tel:${phone}">${phoneDisplay}</a><div class="hero-actions"><a class="button button-primary" href="tel:${phone}">${phoneIcon}${esc(config.nav.call)}</a><a class="button button-whatsapp" href="https://wa.me/493040563878">${whatsappIcon}WhatsApp</a></div></div></div></section>${internationalPrices(config)}<section class="international-quick"><div class="container international-copy-layout"><div><h2>${esc(config.quickTitle)}</h2>${config.quickParagraphs.map((paragraph) => `<p>${esc(paragraph)}</p>`).join("")}</div><aside class="card international-call-card"><strong>${esc(config.priceTable.eyebrow)}</strong><ul>${config.pricePoints.map((point) => `<li>${esc(point)}</li>`).join("")}</ul></aside></div></section><section class="international-trust section-soft"><div class="container"><div class="section-intro clean-intro"><h2>${esc(config.trustTitle)}</h2><p>${esc(config.trustIntro)}</p></div><div class="grid-3 service-cards-clean">${localizedCards(config.trust)}</div></div></section><section id="situations"><div class="container"><div class="section-intro clean-intro"><h2>${esc(config.situationsTitle)}</h2><p>${esc(config.situationsIntro)}</p></div><div class="grid-3 service-cards-clean">${localizedCards(config.situations)}</div></div></section><section id="process" class="section-blue"><div class="container"><div class="section-intro"><h2>${esc(config.processTitle)}</h2></div><div class="process-grid international-process">${config.process.map(([heading, text], index) => `<div class="process-step"><span>${index + 1}</span><h3>${esc(heading)}</h3><p>${esc(text)}</p></div>`).join("")}</div></div></section><section id="services"><div class="container"><div class="section-intro clean-intro"><h2>${esc(config.servicesTitle)}</h2><p>${esc(config.servicesIntro)}</p></div><div class="grid-3 service-cards-clean">${localizedCards(config.services)}</div></div></section><section class="section-soft"><div class="container international-copy-layout"><div><h2>${esc(config.areasTitle)}</h2>${config.areas.map((paragraph) => `<p>${esc(paragraph)}</p>`).join("")}</div><aside class="card international-area-card"><strong>${esc(config.areaLabel)}</strong><p>Wedding · Gesundbrunnen · Mitte · Prenzlauer Berg · Pankow · Reinickendorf · Weißensee</p></aside></div></section><section><div class="container international-copy"><h2>${esc(config.visitorsTitle)}</h2>${config.visitorsParagraphs.map((paragraph) => `<p>${esc(paragraph)}</p>`).join("")}</div></section>${internationalReviewsSection(config)}<section id="faq"><div class="container"><div class="section-intro clean-intro"><h2>${esc(config.faqTitle)}</h2></div><div class="faq-list">${config.faqs.map(([question, answer]) => `<details class="faq-item"><summary>${esc(question)}</summary><p>${esc(answer)}</p></details>`).join("")}</div></div></section><section><div class="container"><div class="cta-panel"><div><h2>${esc(config.ctaTitle)}</h2><p>${esc(config.ctaText)}</p></div><div class="cta-actions"><a class="button button-primary" href="tel:${phone}">${phoneIcon}${phoneDisplay}</a><a class="button button-whatsapp" href="https://wa.me/493040563878">${whatsappIcon}WhatsApp</a></div></div></div></section>`;
}

function renderInternational(slug, config) {
  const url = routeUrl(slug);
  return `<!doctype html><html lang="${config.lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(config.title)}</title><meta name="description" content="${esc(config.description)}"><meta name="robots" content="index,follow,max-image-preview:large"><link rel="canonical" href="${url}">${hreflangTags()}${openGraphTags(config, url, true)}<link rel="icon" href="/favicon.ico"><link rel="stylesheet" href="/assets/css/styles.css?v=${version}">${internationalSchema(slug, config)}</head><body class="international-page">${headerFor(config, slug)}<main>${internationalContent(config)}</main>${footerFor(config)}<script src="/assets/js/main.js?v=${version}" defer></script></body></html>`;
}

function transitionPage(slug, target) {
  const targetUrl = routeUrl(target);
  const label = target ? keywordFor(target) : "Schlüsseldienst Berlin";
  return `<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(label)} | Seite zusammengeführt</title><meta name="description" content="Diese frühere URL wurde mit der aktuellen Hauptseite zu ${esc(label)} zusammengeführt."><meta name="robots" content="index,follow"><link rel="canonical" href="${targetUrl}"><meta http-equiv="refresh" content="0; url=${targetUrl}"><link rel="icon" href="/favicon.ico"><link rel="stylesheet" href="/assets/css/styles.css?v=${version}"></head><body>${header}<main><section class="page-hero compact"><div class="container"><span class="eyebrow">Aktuelle Seite</span><h1>Diese Seite wurde zusammengeführt</h1><p>Die vollständigen und aktuellen Informationen finden Sie unter der bevorzugten URL.</p><a class="button button-primary" href="${targetUrl}">Weiter zu ${esc(label)}</a></div></section></main>${footer}<script src="/assets/js/main.js?v=${version}" defer></script></body></html>`;
}

function htmlSitemapContent() {
  const canonicalPages = allIndexes.filter((route) => route !== "sitemap" && !canonicalRoutes.has(route));
  const languagePages = canonicalPages.filter((route) => internationalSlugs.includes(route));
  const districtPages = canonicalPages.filter((route) => route.startsWith("schlüsseldienst-") && !["schlüsseldienst-berlin-preise", "schlüsseldienst-in-der-nähe"].includes(route));
  const guidePages = canonicalPages.filter((route) => route === "ratgeber" || route.startsWith("ratgeber/"));
  const servicePages = canonicalPages.filter((route) => route === "leistung" || route.startsWith("leistung/") || ["schlüsseldienst-berlin-preise", "schlüsseldienst-in-der-nähe", "türöffnung-berlin-24h-notdienst", "schlüssel-steckt-innen-tür-zu"].includes(route));
  const assigned = new Set([...languagePages, ...districtPages, ...guidePages, ...servicePages]);
  const otherPages = canonicalPages.filter((route) => !assigned.has(route));
  const list = (routes) => `<ul class="sitemap-list">${routes.sort((a, b) => keywordFor(a).localeCompare(keywordFor(b), "de")).map((route) => `<li><a href="/${route}/">${esc(internationalPages[route]?.h1 || keywordFor(route))}</a></li>`).join("")}</ul>`;
  return `<section class="page-hero compact sitemap-hero"><div class="container"><h1>Sitemap</h1><p>Hier finden Sie alle wichtigen, indexierbaren Seiten von Trust Schlüsseldienst Berlin. Frühere oder zusammengeführte URLs werden nicht aufgeführt.</p></div></section><section><div class="container html-sitemap-grid"><article class="card"><h2>Startseite und Kontakt</h2><ul class="sitemap-list"><li><a href="/">Trust Schlüsseldienst Berlin</a></li></ul>${list(otherPages)}</article><article class="card"><h2>Leistungen und Preise</h2>${list(servicePages)}</article><article class="card"><h2>Berliner Bezirke</h2>${list(districtPages)}</article><article class="card"><h2>Ratgeber</h2>${list(guidePages)}</article><article class="card"><h2>International</h2>${list(languagePages)}</article></div></section>`;
}

function renderSitemap() {
  const slug = "sitemap";
  return `<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(titleFor(slug))}</title><meta name="description" content="${esc(descriptionFor(slug))}"><meta name="robots" content="index,follow,max-image-preview:large"><link rel="canonical" href="${routeUrl(slug)}"><link rel="icon" href="/favicon.ico"><link rel="stylesheet" href="/assets/css/styles.css?v=${version}">${schema(slug, keywordFor(slug), [])}</head><body>${header}<main><div class="breadcrumb"><div class="container"><a href="/">Startseite</a><span>›</span><span>Sitemap</span></div></div>${htmlSitemapContent()}</main>${footer}<script src="/assets/js/main.js?v=${version}" defer></script></body></html>`;
}

function render(slug) {
  if (internationalPages[slug]) return renderInternational(slug, internationalPages[slug]);
  if (canonicalRoutes.has(slug)) return transitionPage(slug, canonicalRoutes.get(slug));
  if (slug === "sitemap") return renderSitemap();
  const keyword = keywordFor(slug);
  const faqs = faq(slug);
  const pageType = pageTypeFor(slug);
  const isLegal = slug === "impressum" || slug === "impressum.html";
  const district = slug.startsWith("schlüsseldienst-") ? districtNames[slug.slice(16)] : null;
  const intro = district ? `${keyword} hilft bei zugefallenen und abgeschlossenen Türen, Schlüsselverlust sowie Schloss- und Zylinderwechsel. Wir klären Situation, Legitimation, Anfahrt und Preis, bevor die Arbeit beginnt.` : `Trust ${keyword} hilft bei Türöffnungen, Schlosswechsel, Zylinderwechsel und akuten Schlüsselfällen. Vor Beginn klären wir die Situation, Ihre Berechtigung, den Preis und das passende Vorgehen.`;
  const seoIntro = `<section class="seo-welcome"><div class="container"><h2>Willkommen bei Trust Schlüsseldienst Berlin</h2><p>Sie brauchen schnell Hilfe, weil Ihre Tür zugefallen ist, der Schlüssel innen steckt oder das Schloss klemmt? Trust Schlüsseldienst Berlin ist 24/7 erreichbar. Wir klären vor Beginn der Arbeit die Türsituation, Ihre Berechtigung und den Preis – transparent und ohne versteckte Kosten.</p></div></section>`;
  const standardHero = district ? districtHero(keyword, intro) : `<section class="page-hero page-hero-image"><div class="container"><div class="hero-copy"><h1>${headingHtml(keyword)}</h1><p>${esc(intro)}</p>${googleReviewBadge}<div class="hero-actions"><a class="button button-primary" href="tel:${phone}">Jetzt anrufen</a><a class="button button-whatsapp" href="https://wa.me/493040563878">WhatsApp</a><a class="button button-secondary" href="/#preise">Preise ansehen</a></div><ul class="hero-points"><li>Festpreis am Telefon</li><li>24/7 Türöffnung</li><li>Einbruchschutz</li></ul></div></div></section>`;
  const main = !slug ? homePageContent(faqs) : priorityDistrictPages[slug] ? priorityDistrictContent(slug, priorityDistrictPages[slug]) : slug === "leistung/schlüsselnotdienst" ? emergencyServiceContent(faqs) : slug === "türöffnung-berlin-24h-notdienst" ? doorOpeningContent(faqs) : pageType === "guide-index" ? guideIndexContent() : pageType === "guide" ? guideArticleContent(slug, faqs) : pageType === "service-index" ? serviceIndexContent() : isLegal ? `<section class="page-hero compact"><div class="container"><span class="eyebrow">Rechtliche Angaben</span><h1>Impressum</h1></div></section><section><div class="container"><div class="card legal-card"><h2>Anbieterkennzeichnung</h2><p><strong>Trust B&M Service UG (haftungsbeschränkt)</strong><br>Inhaber: Bilal Sleiman<br>${streetAddress}<br>13355 Berlin</p><p>Handelsregister: HRB 288982 B</p><p>Telefon: <a href="tel:${phone}">${phoneDisplay}</a><br>E-Mail: <a href="mailto:${email}">${email}</a></p></div></div></section>` : `${standardHero}${seoIntro}${intentBlock(slug, keyword, district)}<section><div class="container"><div class="section-intro clean-intro"><h2>Professionelle Hilfe rund um Tür, Schloss und Sicherheit</h2><p>Jeder Einsatz beginnt mit einer klaren Einschätzung. Zusatzarbeiten oder Material erfolgen nur nach Absprache.</p></div><div class="grid-3 service-cards-clean"><a class="card service-card-clean" href="/leistung/öffnung-bei-zugefallenen-türen/"><h3>Zugefallene Tür</h3><p>Wenn die Wohnungstür nur zugefallen ist, prüfen wir die Türsituation und öffnen möglichst schonend. Trust Schlüsseldienst Berlin erklärt Preis, Anfahrt und Vorgehen vor Beginn transparent.</p><span class="card-button">Mehr erfahren</span></a><a class="card service-card-clean" href="/leistung/öffnung-bei-abgeschlossenen-türen/"><h3>Abgeschlossene Tür</h3><p>Bei abgeschlossener Tür analysieren wir Schloss, Zylinder und Beschlag sorgfältig. Sie erhalten vor der Arbeit eine klare Einschätzung, damit die Öffnung fair und nachvollziehbar bleibt.</p><span class="card-button">Mehr erfahren</span></a><a class="card service-card-clean" href="/leistung/schlosswechsel-berlin-schlösser-schnell-sicher-wechseln/"><h3>Schloss- & Zylinderwechsel</h3><p>Nach Schlüsselverlust, Defekt oder Sicherheitsbedenken wechseln wir Zylinder und Schlösser nur nach Absprache. Material, Aufwand und Kosten werden vorher verständlich erklärt.</p><span class="card-button">Mehr erfahren</span></a></div></div></section><section class="section-blue"><div class="container"><div class="section-intro"><span class="eyebrow">So läuft es ab</span><h2>In vier klaren Schritten wieder Zugang erhalten</h2></div><div class="process-grid"><div class="process-step"><span>1</span><h3>Situation schildern</h3><p>Bezirk, Türart und ob die Tür zugefallen oder abgeschlossen ist.</p></div><div class="process-step"><span>2</span><h3>Preis klären</h3><p>Anfahrt, Leistung, Uhrzeit und mögliche Besonderheiten werden besprochen.</p></div><div class="process-step"><span>3</span><h3>Legitimation prüfen</h3><p>Die Berechtigung zur Öffnung wird vor Ort nachvollziehbar geprüft.</p></div><div class="process-step"><span>4</span><h3>Tür öffnen</h3><p>Wir wählen die zur Situation passende, möglichst schonende Methode.</p></div></div></div></section>${prices()}${reviewsSection(slug)}<section><div class="container split"><div><span class="eyebrow">Seriöser Ablauf</span><h2>Woran Sie einen fairen Schlüsseldienst erkennen</h2><p>Ein seriöser Ablauf beginnt nicht erst an der Tür. Fragen Sie nach Anfahrt, Grundpreis, Zuschlägen und möglichen Materialkosten. Bei Trust werden diese Punkte vor Beginn geklärt. Ein Zylinder oder Beschlag wird nicht ohne Ihre Zustimmung gewechselt.</p></div><div class="card"><h3>Vor dem Einsatz hilfreich</h3><ul class="mini-list"><li>Genaue Adresse und Berliner Bezirk</li><li>Tür nur zugefallen oder abgeschlossen?</li><li>Steckt ein Schlüssel von innen?</li><li>Besonderer Sicherheitsbeschlag vorhanden?</li><li>Ausweis oder andere Legitimation verfügbar?</li></ul></div></div></section>${districts()}${faqSection(slug, keyword, faqs)}${contactCta}`;
  const languageHead = !slug ? `${hreflangTags()}${openGraphTags({title:titleFor(slug),description:descriptionFor(slug),ogLocale:"de_DE"}, routeUrl(""), true)}` : "";
  let pageFooter = priorityDistrictPages[slug] || !slug ? footer.replace('<div><div class="footer-title">Kontakt</div>', '<div id="kontakt"><div class="footer-title">Kontakt</div>') : footer;
  if (!slug) {
    pageFooter = pageFooter.replace(
      `<div class="mobile-callbar"><a class="button button-whatsapp" href="https://wa.me/493040563878">WhatsApp</a><a class="button button-primary" href="tel:${phone}">Anrufen</a></div>`,
      `<div class="mobile-callbar home-mobile-callbar"><a class="button button-secondary" href="#preise">Preise ansehen</a><a class="button button-whatsapp" href="https://wa.me/493040563878">WhatsApp</a><a class="button button-primary" href="tel:${phone}">Anrufen</a></div>`,
    );
  }
  const stylesheetVersion = !slug ? homepageStyleVersion : version;
  const bodyClass = !slug ? "home-page" : pageType === "district" ? "district-page" : "";
  return `<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(titleFor(slug))}</title><meta name="description" content="${esc(descriptionFor(slug))}"><meta name="robots" content="index,follow,max-image-preview:large"><link rel="canonical" href="${routeUrl(canonicalSlugFor(slug))}">${languageHead}<link rel="icon" href="/favicon.ico"><link rel="stylesheet" href="/assets/css/styles.css?v=${stylesheetVersion}">${schema(slug,keyword,faqs)}</head><body${bodyClass ? ` class="${bodyClass}"` : ""}>${header}<main>${slug?`<div class="breadcrumb"><div class="container"><a href="/">Startseite</a><span>›</span><span>${esc(keyword)}</span></div></div>`:""}${main}</main>${pageFooter}<script src="/assets/js/main.js?v=${version}" defer></script></body></html>`;
}

fs.writeFileSync(path.join(root, "index.html"), render(""), "utf8");
for (const slug of allIndexes) {
  fs.mkdirSync(path.join(root, slug), { recursive: true });
  fs.writeFileSync(path.join(root, slug, "index.html"), render(slug), "utf8");
}
for (const [file, target] of legacyHtmlRoutes) fs.writeFileSync(path.join(root, file), transitionPage(file, target), "utf8");

const sitemapRoutes = ["", ...allIndexes.filter((route) => !canonicalRoutes.has(route))];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapRoutes.map(r=>`  <url><loc>${routeUrl(r)}</loc><lastmod>${new Date().toISOString().slice(0,10)}</lastmod></url>`).join("\n")}\n</urlset>\n`;
fs.writeFileSync(path.join(root,"sitemap.xml"),sitemap,"utf8");
console.log(`Generated ${allIndexes.length + 1} pages without changing existing directory routes.`);

