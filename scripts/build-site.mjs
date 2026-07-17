import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const site = "https://www.trust-schluesseldienstberlin.de";
const phone = "03040563878";
const phoneDisplay = "03040563878";
const email = "schluesseldienst@trust-bm-service.de";
const streetAddress = "Ramlerstr. 2a";
const version = "trust-redesign-9";
const googleReviewUrl = "https://share.google/eskADN8c4gLAJoF4b";
const googleWriteReviewUrl = "https://g.page/r/Cb7_XP5XHV96ECE/review";
const googleReviewBadge = `<a class="google-review-badge" href="${googleReviewUrl}" target="_blank" rel="noopener noreferrer" aria-label="Google Bewertungen ansehen"><span class="google-word" aria-hidden="true"><span>G</span><span>o</span><span>o</span><span>g</span><span>l</span><span>e</span></span><span class="review-stars" aria-hidden="true">★★★★★</span><span class="review-text"><strong>5,0</strong> Sterne · 105 Bewertungen</span></a>`;

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

const canonicalRoutes = new Map([
  ["startseite", ""],
  ["schlüsseldienst-köpenick", "schlüsseldienst-koepenick"],
  ["schlüsseldienst-schöneberg", "schlüsseldienst-schoeneberg"],
  ["schlüsseldienst-französisch-buchholz", "schlüsseldienst-franzoesisch-buchholz"],
  ["leistung/schlüsseldienst-berlin-türöffnung-notdienst-24h", "türöffnung-berlin-24h-notdienst"],
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
  "charlottenburg":"Charlottenburg", "franzoesisch-buchholz":"Französisch Buchholz", "französisch-buchholz":"Französisch Buchholz",
  "friedrichshain":"Friedrichshain", "gesundbrunnen":"Gesundbrunnen", "koepenick":"Köpenick", "köpenick":"Köpenick",
  "kreuzberg":"Kreuzberg", "lichtenberg":"Lichtenberg", "marzahn":"Marzahn", "mitte":"Mitte", "moabit":"Moabit",
  "neukölln":"Neukölln", "pankow":"Pankow", "prenzlauerberg":"Prenzlauer Berg", "reinickendorf":"Reinickendorf",
  "schoeneberg":"Schöneberg", "schöneberg":"Schöneberg", "spandau":"Spandau", "steglitz":"Steglitz", "tempelhof":"Tempelhof",
  "treptow":"Treptow", "wedding":"Wedding", "weißensee":"Weißensee", "wilmersdorf":"Wilmersdorf", "zehlendorf":"Zehlendorf"
};
const districtRoutes = allIndexes.filter((r) => r.startsWith("schlüsseldienst-") && districtNames[r.slice(16)] && !canonicalRoutes.has(r));

const labels = {
  "leistung":"Leistungen", "ratgeber":"Ratgeber", "impressum":"Impressum", "startseite":"Startseite",
  "schlüsseldienst-berlin-preise":"Schlüsseldienst Berlin Preise", "schlüsseldienst-in-der-nähe":"Schlüsseldienst in der Nähe",
  "schlüssel-steckt-innen-tür-zu":"Schlüssel steckt innen – Tür zu", "tür-zugefallen-was-tun":"Tür zugefallen – was tun?",
  "türöffnung-berlin-24h-notdienst":"Türöffnung Berlin 24h Notdienst", "türöffnung-berlin-kosten":"Türöffnung Berlin Kosten",
  "schlüsselnotdienst":"Schlüsselnotdienst", "öffnung-bei-abgeschlossenen-türen":"Öffnung bei abgeschlossenen Türen",
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
  "": "Schlüsseldienst Berlin 24/7 Notdienst zum Festpreis am Telefon",
  "startseite": "Schlüsseldienst Berlin | 24/7 Notdienst & Türöffnung",
  "leistung": "Schlüsseldienst Leistungen Berlin | Türöffnung, Schlosswechsel & Einbruchschutz",
  "leistung/schlüsselnotdienst": "Schlüsselnotdienst Berlin 24/7 | Schnelle Hilfe bei Schlüsselnotfall",
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
  "türöffnung-berlin-24h-notdienst": "Türöffnung Berlin 24h Notdienst | Zugefallen oder abgeschlossen",
  "türöffnung-berlin-kosten": "Türöffnung Berlin Kosten | Preis vor Beginn klären",
  "tür-zugefallen-was-tun": "Tür zugefallen was tun? Berlin Ratgeber vom Schlüsseldienst",
  "schlüssel-steckt-innen-tür-zu": "Schlüssel steckt innen Tür zu | Hilfe vom Schlüsseldienst Berlin",
  "ratgeber/schluesseldienst-kosten-berlin": "Schlüsseldienst Kosten Berlin | Preise, Zuschläge & Festpreis",
  "ratgeber/schluessel-verloren-berlin": "Schlüssel verloren Berlin | Was tun und wann Schloss wechseln?",
  "ratgeber/tuer-zugefallen-berlin": "Tür zugefallen Berlin | Hilfe, Kosten und seriöser Ablauf"
};

const descriptionOverrides = {
  "": `Schlüsseldienst Berlin 24/7: Türöffnung, Schlüsselnotdienst, Schlosswechsel und Einbruchschutz. Preis und Vorgehen klären wir vor Beginn am Telefon.`,
  "schlüsseldienst-berlin-preise": `Schlüsseldienst Berlin Preise verständlich erklärt: Tür zugefallen, abgeschlossene Tür, Zylinderwechsel, Zuschläge und Festpreis am Telefon.`,
  "ratgeber/schluesseldienst-kosten-berlin": `Was kostet ein Schlüsseldienst in Berlin? Orientierung zu Türöffnung, Nachtzuschlag, Anfahrt, Material und fairer Preisabsprache.`,
  "ratgeber/schluessel-verloren-berlin": `Schlüssel verloren in Berlin? Erfahren Sie, wann Türöffnung, Zylinderwechsel oder neue Schlüssel sinnvoll sind und worauf Sie achten sollten.`,
  "ratgeber/tuer-zugefallen-berlin": `Tür zugefallen in Berlin? Was Sie sofort tun können, wann der Schlüsseldienst hilft und wie Preis, Legitimation und Ablauf geklärt werden.`,
  "leistung/schlosswechsel-berlin-schlösser-schnell-sicher-wechseln": `Schloss oder Schließzylinder wechseln in Berlin nach Schlüsselverlust, Defekt oder Sicherheitsbedenken. Material nur nach Absprache.`,
  "leistung/sicherheitstechnik-berlin-einbruchschutz-vom-profi": `Einbruchschutz in Berlin: Beratung zu Sicherheitsschloss, Schließzylinder und Türsicherung. Transparent, ohne unnötige Zusatzarbeiten.`
};

const priorityLinks = [
  ["/leistung/schlüsselnotdienst/", "Schlüsselnotdienst"],
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
  if (titleOverrides[slug]) return titleOverrides[slug];
  if (slug.startsWith("schlüsseldienst-")) return `Schlüsseldienst ${districtNames[slug.slice(16)] || labels[slug] || slug} | Türöffnung 24/7`;
  return `${labels[leaf(slug)] || leaf(slug).replaceAll("-", " ")} | Trust Schlüsseldienst Berlin`;
};
const keywordFor = (slug) => !slug ? "Schlüsseldienst Berlin" : slug.startsWith("schlüsseldienst-") && districtNames[slug.slice(16)] ? `Schlüsseldienst ${districtNames[slug.slice(16)]}` : labels[leaf(slug)] || leaf(slug).replaceAll("-", " ");
const descriptionFor = (slug) => descriptionOverrides[slug] || `${keywordFor(slug)}: Türöffnung, Schlüsselnotdienst, Schloss- und Zylinderwechsel mit klarer Preisabsprache vor Beginn. 24/7 erreichbar unter ${phoneDisplay}.`;

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

const isCommercialPage = (slug) => ["service", "service-index", "district", "price"].includes(pageTypeFor(slug));

function schema(slug, keyword, faqs) {
  const canonicalSlug = canonicalSlugFor(slug);
  const url = routeUrl(canonicalSlug);
  const area = slug.startsWith("schlüsseldienst-") ? districtNames[slug.slice(16)] : "Berlin";
  const graph = [
    {"@type":"Organization","@id":`${site}/#organization`,name:"Trust Schlüsseldienst Berlin",url:`${site}/`,email,telephone:phoneDisplay,logo:`${site}/assets/logo.jpeg`},
    {"@type":"Locksmith","@id":`${site}/#localbusiness`,name:"Trust Schlüsseldienst Berlin",url:`${site}/`,telephone:phoneDisplay,email,address:{"@type":"PostalAddress",streetAddress,postalCode:"13355",addressLocality:"Berlin",addressCountry:"DE"},areaServed:{"@type":"AdministrativeArea",name:area || "Berlin"},openingHoursSpecification:{"@type":"OpeningHoursSpecification",dayOfWeek:["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],opens:"00:00",closes:"23:59"},priceRange:"€€"},
    {"@type":"WebPage","@id":`${url}#webpage`,url,name:titleFor(slug),description:descriptionFor(slug),isPartOf:{"@id":`${site}/#website`}},
    {"@type":"BreadcrumbList",itemListElement:[{"@type":"ListItem",position:1,name:"Startseite",item:`${site}/`},...(slug?[{"@type":"ListItem",position:2,name:keyword,item:url}]:[])]},
  ];
  if (!slug) graph.push({"@type":"WebSite","@id":`${site}/#website`,name:"Trust Schlüsseldienst Berlin",url:`${site}/`});
  if (faqs.length) graph.push({"@type":"FAQPage",mainEntity:faqs.map(([q,a])=>({"@type":"Question",name:q,acceptedAnswer:{"@type":"Answer",text:a}}))});
  if (isCommercialPage(slug)) graph.push({"@type":"Service",name:keyword,serviceType:keyword,provider:{"@id":`${site}/#localbusiness`},areaServed:{"@type":"AdministrativeArea",name:area || "Berlin"}});
  if (pageTypeFor(slug) === "guide") graph.push({"@type":"Article",headline:titleFor(slug),mainEntityOfPage:{"@id":`${url}#webpage`},author:{"@id":`${site}/#organization`},publisher:{"@id":`${site}/#organization`}});
  return `<script type="application/ld+json">${JSON.stringify({"@context":"https://schema.org","@graph":graph})}</script>`;
}

const header = `<header class="site-header"><div class="container-wide header-inner"><a class="brand" href="/"><img src="/assets/logo.jpeg?v=${version}" alt="Trust Schlüsseldienst Berlin Logo"><span><strong>Trust Schlüsseldienst</strong><small>Berlin · 24/7 erreichbar</small></span></a><button class="menu-toggle" type="button" aria-label="Menü öffnen" aria-expanded="false" aria-controls="main-nav">&#9776;</button><nav id="main-nav" class="main-nav"><a href="/">Startseite</a><a href="/leistung/">Leistungen</a><a href="/türöffnung-berlin-24h-notdienst/">Türöffnung</a><a href="/schlüsseldienst-berlin-preise/">Preise</a><a href="/schlüsseldienst-in-der-nähe/">Einsatzgebiete</a><a href="/ratgeber/">Ratgeber</a></nav><div class="header-actions"><a class="button button-whatsapp" href="https://wa.me/493040563878">WhatsApp</a><a class="button button-primary" href="tel:${phone}">Jetzt anrufen</a></div></div></header>`;

const footer = `<footer class="site-footer"><div class="container-wide"><div class="footer-grid footer-grid-compact"><div><img class="footer-logo" src="/assets/logo.jpeg?v=${version}" alt="Trust Schlüsseldienst Berlin"><div class="footer-title">Trust Schlüsseldienst Berlin</div><p>Türöffnung, Schloss- und Zylinderwechsel in Berlin – mit Preisabsprache vor Beginn.</p>${googleReviewBadge}</div><div><div class="footer-title">Schnellzugriff</div><a href="/schlüsseldienst-berlin-preise/">Preise</a><a href="/leistung/schlüsselnotdienst/">Schlüsselnotdienst</a><a href="/türöffnung-berlin-24h-notdienst/">Türöffnung Berlin</a><a href="/schlüsseldienst-in-der-nähe/">Einsatzgebiete</a><a href="/impressum/">Impressum</a></div><div><div class="footer-title">Kontakt</div><p>${streetAddress}<br>13355 Berlin</p><a href="tel:${phone}">${phoneDisplay}</a><a href="https://wa.me/493040563878">WhatsApp</a><a href="mailto:${email}">${email}</a></div></div><div class="footer-bottom"><span>© ${new Date().getFullYear()} Trust Schlüsseldienst Berlin</span></div></div></footer><div class="mobile-callbar"><a class="button button-whatsapp" href="https://wa.me/493040563878">WhatsApp</a><a class="button button-primary" href="tel:${phone}">Anrufen</a></div>`;

function faq(slug) {
  if (slug === "ratgeber" || slug === "impressum" || canonicalRoutes.has(slug)) return [];
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
  return `<section class="customer-feedback"><div class="container"><div class="section-intro review-intro"><span class="eyebrow">Kundenerfahrungen</span><h2>Das sagen Kunden über Trust Schlüsseldienst Berlin</h2><p>Echte Rückmeldungen aus Google zeigen, worauf es im Notfall ankommt: schnelle Hilfe, freundlicher Kontakt, klare Preise und saubere Türöffnung.</p></div><div class="review-grid">${homepageReviews.map(([name, text]) => `<article class="review-card"><div class="review-card-stars" aria-label="5 von 5 Sternen">★★★★★</div><p>${esc(text)}</p><footer>~ ${esc(name)}</footer></article>`).join("")}</div><div class="review-actions"><a class="review-action-primary" href="${googleReviewUrl}" target="_blank" rel="noopener noreferrer"><span class="review-google-mark">G</span> Alle Bewertungen ansehen</a><a class="review-action-secondary" href="${googleWriteReviewUrl}" target="_blank" rel="noopener noreferrer"><span aria-hidden="true">☆</span> Bewerten Sie uns auf Google</a></div></div></section>`;
}

function districts() { return `<section id="einsatzgebiete"><div class="container"><div class="section-intro"><span class="eyebrow">Lokaler Schlüsseldienst</span><h2>Einsatzgebiete in ganz Berlin</h2><p>Wählen Sie Ihren Bezirk. Die bestehenden lokalen Seiten bleiben unter ihren bisherigen URLs erreichbar.</p></div><div class="area-links">${districtRoutes.map(r=>`<a href="/${r}/">${districtNames[r.slice(16)]}</a>`).join("")}</div></div></section>`; }

function internalLinkList(slug) {
  return priorityLinks
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

const faqSection = (slug, keyword, faqs) => faqs.length ? `<section class="section-soft"><div class="container"><div class="section-intro"><span class="eyebrow">Häufige Fragen</span><h2>Antworten zu ${esc(keyword)}</h2></div><div class="faq-list">${faqs.map(([q,a])=>`<details class="faq-item"><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join("")}</div></div></section>` : "";
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
    ["/leistung/montage-von-sicherheitsschlösser/", "Sicherheitsschloss montieren", "Montage geeigneter Komponenten nach technischer Prüfung und transparenter Materialvereinbarung."],
    ["/türöffnung-berlin-kosten/", "Kosten einer Türöffnung", "Kostenfaktoren bei zugefallener oder abgeschlossener Tür verständlich einordnen."]
  ];
  return `<section class="page-hero compact"><div class="container"><span class="eyebrow">Leistungsübersicht</span><h1>Schlüsseldienst-Leistungen in Berlin</h1><p>Wählen Sie die Leistung, die zu Ihrer Tür- oder Sicherheitssituation passt. Bei einem akuten Fall erreichen Sie uns 24/7 telefonisch und per WhatsApp.</p></div></section><section><div class="container"><div class="section-intro clean-intro"><h2>Türöffnung, Schlosswechsel und Einbruchschutz</h2><p>Jede Leistung beginnt mit einer klaren Einschätzung. Berechtigung, Preis, mögliche Zuschläge und Material werden vor der Ausführung besprochen.</p></div><div class="grid-3 service-cards-clean">${services.map(([href, heading, text]) => `<a class="card service-card-clean" href="${href}"><h2>${esc(heading)}</h2><p>${esc(text)}</p><span class="card-button">Mehr erfahren</span></a>`).join("")}</div></div></section>${prices()}${contactCta}`;
}

function guideArticleContent(slug, faqs) {
  const article = guideArticles[slug];
  if (!article) return guideIndexContent();
  return `<article><section class="page-hero compact"><div class="container"><span class="eyebrow">Ratgeber</span><h1>${esc(article.h1)}</h1><p>${esc(article.intro)}</p></div></section><section><div class="container"><div class="grid-3 service-cards-clean">${article.sections.map(([heading, text]) => `<section class="card service-card-clean"><h2>${esc(heading)}</h2><p>${esc(text)}</p></section>`).join("")}</div><div class="review-actions"><a class="button button-primary" href="${article.link[0]}">${esc(article.link[1])}</a><a class="button button-secondary" href="/ratgeber/">Alle Ratgeber</a></div></div></section>${faqSection(slug, article.h1, faqs)}${contactCta}</article>`;
}

function transitionPage(slug, target) {
  const targetUrl = routeUrl(target);
  const label = target ? keywordFor(target) : "Schlüsseldienst Berlin";
  return `<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(label)} | Seite zusammengeführt</title><meta name="description" content="Diese frühere URL wurde mit der aktuellen Hauptseite zu ${esc(label)} zusammengeführt."><meta name="robots" content="index,follow"><link rel="canonical" href="${targetUrl}"><meta http-equiv="refresh" content="0; url=${targetUrl}"><link rel="icon" href="/favicon.ico"><link rel="stylesheet" href="/assets/css/styles.css?v=${version}"></head><body>${header}<main><section class="page-hero compact"><div class="container"><span class="eyebrow">Aktuelle Seite</span><h1>Diese Seite wurde zusammengeführt</h1><p>Die vollständigen und aktuellen Informationen finden Sie unter der bevorzugten URL.</p><a class="button button-primary" href="${targetUrl}">Weiter zu ${esc(label)}</a></div></section></main>${footer}<script src="/assets/js/main.js?v=${version}" defer></script></body></html>`;
}

function render(slug) {
  if (canonicalRoutes.has(slug)) return transitionPage(slug, canonicalRoutes.get(slug));
  const keyword = keywordFor(slug);
  const faqs = faq(slug);
  const pageType = pageTypeFor(slug);
  const isLegal = slug === "impressum" || slug === "impressum.html";
  const district = slug.startsWith("schlüsseldienst-") ? districtNames[slug.slice(16)] : null;
  const intro = district ? `${keyword} hilft bei zugefallenen und abgeschlossenen Türen, Schlüsselverlust sowie Schloss- und Zylinderwechsel. Wir klären Situation, Legitimation, Anfahrt und Preis, bevor die Arbeit beginnt.` : `Trust ${keyword} hilft bei Türöffnungen, Schlosswechsel, Zylinderwechsel und akuten Schlüsselfällen. Vor Beginn klären wir die Situation, Ihre Berechtigung, den Preis und das passende Vorgehen.`;
  const seoIntro = `<section class="seo-welcome"><div class="container"><h2>Willkommen bei Trust Schlüsseldienst Berlin</h2><p>Sie brauchen schnell Hilfe, weil Ihre Tür zugefallen ist, der Schlüssel innen steckt oder das Schloss klemmt? Trust Schlüsseldienst Berlin ist 24/7 erreichbar. Wir klären vor Beginn der Arbeit die Türsituation, Ihre Berechtigung und den Preis – transparent und ohne versteckte Kosten.</p></div></section>`;
  const main = pageType === "guide-index" ? guideIndexContent() : pageType === "guide" ? guideArticleContent(slug, faqs) : pageType === "service-index" ? serviceIndexContent() : isLegal ? `<section class="page-hero compact"><div class="container"><span class="eyebrow">Rechtliche Angaben</span><h1>Impressum</h1></div></section><section><div class="container"><div class="card legal-card"><h2>Anbieterkennzeichnung</h2><p><strong>Trust B&M Service UG (haftungsbeschränkt)</strong><br>Inhaber: Bilal Sleiman<br>${streetAddress}<br>13355 Berlin</p><p>Handelsregister: HRB 288982 B</p><p>Telefon: <a href="tel:${phone}">${phoneDisplay}</a><br>E-Mail: <a href="mailto:${email}">${email}</a></p></div></div></section>` : `<section class="page-hero page-hero-image"><div class="container"><div class="hero-copy"><h1>${headingHtml(keyword)}</h1><p>${esc(intro)}</p>${googleReviewBadge}<div class="hero-actions"><a class="button button-primary" href="tel:${phone}">Jetzt anrufen</a><a class="button button-whatsapp" href="https://wa.me/493040563878">WhatsApp</a><a class="button button-secondary" href="/#preise">Preise ansehen</a></div><ul class="hero-points"><li>Festpreis am Telefon</li><li>24/7 Türöffnung</li><li>Einbruchschutz</li></ul></div></div></section>${seoIntro}${intentBlock(slug, keyword, district)}<section><div class="container"><div class="section-intro clean-intro"><h2>Professionelle Hilfe rund um Tür, Schloss und Sicherheit</h2><p>Jeder Einsatz beginnt mit einer klaren Einschätzung. Zusatzarbeiten oder Material erfolgen nur nach Absprache.</p></div><div class="grid-3 service-cards-clean"><a class="card service-card-clean" href="/leistung/öffnung-bei-zugefallenen-türen/"><h3>Zugefallene Tür</h3><p>Wenn die Wohnungstür nur zugefallen ist, prüfen wir die Türsituation und öffnen möglichst schonend. Trust Schlüsseldienst Berlin erklärt Preis, Anfahrt und Vorgehen vor Beginn transparent.</p><span class="card-button">Mehr erfahren</span></a><a class="card service-card-clean" href="/leistung/öffnung-bei-abgeschlossenen-türen/"><h3>Abgeschlossene Tür</h3><p>Bei abgeschlossener Tür analysieren wir Schloss, Zylinder und Beschlag sorgfältig. Sie erhalten vor der Arbeit eine klare Einschätzung, damit die Öffnung fair und nachvollziehbar bleibt.</p><span class="card-button">Mehr erfahren</span></a><a class="card service-card-clean" href="/leistung/schlosswechsel-berlin-schlösser-schnell-sicher-wechseln/"><h3>Schloss- & Zylinderwechsel</h3><p>Nach Schlüsselverlust, Defekt oder Sicherheitsbedenken wechseln wir Zylinder und Schlösser nur nach Absprache. Material, Aufwand und Kosten werden vorher verständlich erklärt.</p><span class="card-button">Mehr erfahren</span></a></div></div></section><section class="section-blue"><div class="container"><div class="section-intro"><span class="eyebrow">So läuft es ab</span><h2>In vier klaren Schritten wieder Zugang erhalten</h2></div><div class="process-grid"><div class="process-step"><span>1</span><h3>Situation schildern</h3><p>Bezirk, Türart und ob die Tür zugefallen oder abgeschlossen ist.</p></div><div class="process-step"><span>2</span><h3>Preis klären</h3><p>Anfahrt, Leistung, Uhrzeit und mögliche Besonderheiten werden besprochen.</p></div><div class="process-step"><span>3</span><h3>Legitimation prüfen</h3><p>Die Berechtigung zur Öffnung wird vor Ort nachvollziehbar geprüft.</p></div><div class="process-step"><span>4</span><h3>Tür öffnen</h3><p>Wir wählen die zur Situation passende, möglichst schonende Methode.</p></div></div></div></section>${prices()}${reviewsSection(slug)}<section><div class="container split"><div><span class="eyebrow">Seriöser Ablauf</span><h2>Woran Sie einen fairen Schlüsseldienst erkennen</h2><p>Ein seriöser Ablauf beginnt nicht erst an der Tür. Fragen Sie nach Anfahrt, Grundpreis, Zuschlägen und möglichen Materialkosten. Bei Trust werden diese Punkte vor Beginn geklärt. Ein Zylinder oder Beschlag wird nicht ohne Ihre Zustimmung gewechselt.</p></div><div class="card"><h3>Vor dem Einsatz hilfreich</h3><ul class="mini-list"><li>Genaue Adresse und Berliner Bezirk</li><li>Tür nur zugefallen oder abgeschlossen?</li><li>Steckt ein Schlüssel von innen?</li><li>Besonderer Sicherheitsbeschlag vorhanden?</li><li>Ausweis oder andere Legitimation verfügbar?</li></ul></div></div></section>${districts()}${faqSection(slug, keyword, faqs)}${contactCta}`;
  return `<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(titleFor(slug))}</title><meta name="description" content="${esc(descriptionFor(slug))}"><meta name="robots" content="index,follow,max-image-preview:large"><link rel="canonical" href="${routeUrl(canonicalSlugFor(slug))}"><link rel="icon" href="/favicon.ico"><link rel="stylesheet" href="/assets/css/styles.css?v=${version}">${schema(slug,keyword,faqs)}</head><body>${header}<main>${slug?`<div class="breadcrumb"><div class="container"><a href="/">Startseite</a><span>›</span><span>${esc(keyword)}</span></div></div>`:""}${main}</main>${footer}<script src="/assets/js/main.js?v=${version}" defer></script></body></html>`;
}

fs.writeFileSync(path.join(root, "index.html"), render(""), "utf8");
for (const slug of allIndexes) fs.writeFileSync(path.join(root, slug, "index.html"), render(slug), "utf8");
for (const [file, target] of legacyHtmlRoutes) fs.writeFileSync(path.join(root, file), transitionPage(file, target), "utf8");

const sitemapRoutes = ["", ...allIndexes.filter((route) => !canonicalRoutes.has(route))];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapRoutes.map(r=>`  <url><loc>${routeUrl(r)}</loc><lastmod>${new Date().toISOString().slice(0,10)}</lastmod></url>`).join("\n")}\n</urlset>\n`;
fs.writeFileSync(path.join(root,"sitemap.xml"),sitemap,"utf8");
console.log(`Generated ${allIndexes.length + 1} pages without changing existing directory routes.`);

