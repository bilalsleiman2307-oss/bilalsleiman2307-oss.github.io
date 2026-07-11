import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const site = "https://www.trust-schluesseldienstberlin.de";
const phone = "+491638516782";
const phoneDisplay = "+49 163 8516782";
const email = "trust.schluesseldienstberlin@gmail.com";
const version = "trust-redesign-3";

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

const districtNames = {
  "charlottenburg":"Charlottenburg", "franzoesisch-buchholz":"Französisch Buchholz", "französisch-buchholz":"Französisch Buchholz",
  "friedrichshain":"Friedrichshain", "gesundbrunnen":"Gesundbrunnen", "koepenick":"Köpenick", "köpenick":"Köpenick",
  "kreuzberg":"Kreuzberg", "lichtenberg":"Lichtenberg", "marzahn":"Marzahn", "mitte":"Mitte", "moabit":"Moabit",
  "neukölln":"Neukölln", "pankow":"Pankow", "prenzlauerberg":"Prenzlauer Berg", "reinickendorf":"Reinickendorf",
  "schoeneberg":"Schöneberg", "schöneberg":"Schöneberg", "spandau":"Spandau", "steglitz":"Steglitz", "tempelhof":"Tempelhof",
  "treptow":"Treptow", "wedding":"Wedding", "weißensee":"Weißensee", "wilmersdorf":"Wilmersdorf", "zehlendorf":"Zehlendorf"
};
const districtRoutes = allIndexes.filter((r) => r.startsWith("schlüsseldienst-") && districtNames[r.slice(16)]);

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

const esc = (s) => String(s).replace(/[&<>\"]/g, (c) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const routeUrl = (slug) => `${site}/${slug ? `${slug}/` : ""}`;
const leaf = (slug) => slug.split("/").at(-1);
const titleFor = (slug) => {
  if (!slug) return "Schlüsseldienst Berlin 24/7 | Türöffnung & Notdienst";
  if (slug.startsWith("schlüsseldienst-")) return `Schlüsseldienst ${districtNames[slug.slice(16)] || labels[slug] || slug} | Türöffnung 24/7`;
  return `${labels[leaf(slug)] || leaf(slug).replaceAll("-", " ")} | Trust Schlüsseldienst Berlin`;
};
const keywordFor = (slug) => !slug ? "Schlüsseldienst Berlin" : slug.startsWith("schlüsseldienst-") && districtNames[slug.slice(16)] ? `Schlüsseldienst ${districtNames[slug.slice(16)]}` : labels[leaf(slug)] || leaf(slug).replaceAll("-", " ");
const descriptionFor = (slug) => `${keywordFor(slug)}: Türöffnung, Schloss- und Zylinderwechsel mit klarer Preisabsprache vor Beginn. 24/7 erreichbar unter ${phoneDisplay}.`;

function schema(slug, keyword, faqs) {
  const url = routeUrl(slug);
  const area = slug.startsWith("schlüsseldienst-") ? districtNames[slug.slice(16)] : "Berlin";
  const graph = [
    {"@type":"Organization","@id":`${site}/#organization`,name:"Trust Schlüsseldienst Berlin",url:`${site}/`,email,telephone:phoneDisplay,logo:`${site}/assets/logo.jpeg`},
    {"@type":"Locksmith","@id":`${site}/#localbusiness`,name:"Trust Schlüsseldienst Berlin",url:`${site}/`,telephone:phoneDisplay,email,address:{"@type":"PostalAddress",streetAddress:"Ramlerstr. 2",postalCode:"13355",addressLocality:"Berlin",addressCountry:"DE"},areaServed:{"@type":"AdministrativeArea",name:area || "Berlin"},openingHours:"Mo-Su 00:00-24:00",priceRange:"€€"},
    {"@type":"WebPage","@id":`${url}#webpage`,url,name:titleFor(slug),description:descriptionFor(slug),isPartOf:{"@id":`${site}/#website`}},
    {"@type":"BreadcrumbList",itemListElement:[{"@type":"ListItem",position:1,name:"Startseite",item:`${site}/`},...(slug?[{"@type":"ListItem",position:2,name:keyword,item:url}]:[])]},
    {"@type":"FAQPage",mainEntity:faqs.map(([q,a])=>({"@type":"Question",name:q,acceptedAnswer:{"@type":"Answer",text:a}}))}
  ];
  if (!slug) graph.push({"@type":"WebSite","@id":`${site}/#website`,name:"Trust Schlüsseldienst Berlin",url:`${site}/`});
  if (slug && slug !== "impressum") graph.push({"@type":"Service",name:keyword,serviceType:keyword,provider:{"@id":`${site}/#localbusiness`},areaServed:{"@type":"AdministrativeArea",name:area || "Berlin"}});
  return `<script type="application/ld+json">${JSON.stringify({"@context":"https://schema.org","@graph":graph})}</script>`;
}

const header = `<header class="site-header"><div class="container-wide header-inner"><a class="brand" href="/"><img src="/assets/logo.jpeg?v=${version}" alt="Trust Schlüsseldienst Berlin Logo"><span><strong>Trust Schlüsseldienst</strong><small>Berlin · 24/7 erreichbar</small></span></a><button class="menu-toggle" type="button" aria-label="Menü öffnen" aria-expanded="false" aria-controls="main-nav">&#9776;</button><nav id="main-nav" class="main-nav"><a href="/">Startseite</a><a href="/leistung/">Leistungen</a><a href="/#preise">Preise</a><a href="/#einsatzgebiete">Einsatzgebiete</a><a href="/ratgeber/">Ratgeber</a></nav><div class="header-actions"><a class="button button-whatsapp" href="https://wa.me/491638516782">WhatsApp</a><a class="button button-primary" href="tel:${phone}">Jetzt anrufen</a></div></div></header>`;

const footer = `<footer class="site-footer"><div class="container-wide"><div class="footer-grid footer-grid-compact"><div><img class="footer-logo" src="/assets/logo.jpeg?v=${version}" alt="Trust Schlüsseldienst Berlin"><div class="footer-title">Trust Schlüsseldienst Berlin</div><p>Türöffnung, Schloss- und Zylinderwechsel in Berlin – mit Preisabsprache vor Beginn.</p></div><div><div class="footer-title">Schnellzugriff</div><a href="/#preise">Preise</a><a href="/leistung/">Leistungen</a><a href="/schlüsseldienst-in-der-nähe/">Einsatzgebiete</a><a href="/impressum/">Impressum</a></div><div><div class="footer-title">Kontakt</div><a href="tel:${phone}">${phoneDisplay}</a><a href="https://wa.me/491638516782">WhatsApp</a><a href="mailto:${email}">${email}</a></div></div><div class="footer-bottom"><span>© ${new Date().getFullYear()} Trust Schlüsseldienst Berlin</span></div></div></footer><div class="mobile-callbar"><a class="button button-whatsapp" href="https://wa.me/491638516782">WhatsApp</a><a class="button button-primary" href="tel:${phone}">Anrufen</a></div>`;

function faq(keyword) { return [
  [`Was kostet ${keyword}?`,"Der Preis hängt davon ab, ob die Tür zugefallen oder abgeschlossen ist, zu welcher Uhrzeit der Einsatz erfolgt und ob Material benötigt wird. Anfahrt, Leistung und mögliche Zuschläge werden vor Beginn besprochen."],
  ["Kann eine zugefallene Tür beschädigungsfrei geöffnet werden?","Eine nur zugefallene, nicht verriegelte Tür lässt sich in der Regel ohne Beschädigung öffnen. Die konkrete Situation wird vor Ort geprüft."],
  ["Welche Legitimation ist für die Türöffnung nötig?","Vor der Öffnung prüfen wir die Berechtigung. Liegt der Ausweis in der Wohnung, kann die Legitimation nach der Öffnung oder durch eine geeignete Bestätigung erfolgen."],
  ["Ist der Schlüsseldienst rund um die Uhr erreichbar?","Ja, Trust Schlüsseldienst Berlin ist 24 Stunden am Tag und an sieben Tagen pro Woche telefonisch erreichbar."],
  ["Wann ist ein Zylinderwechsel sinnvoll?","Nach Schlüsselverlust, bei einem defekten Zylinder oder bei Sicherheitsbedenken kann ein Wechsel sinnvoll sein. Material wird nur nach vorheriger Absprache eingebaut."],
  ["Erhalte ich eine Rechnung?","Ja. Die ausgeführte Leistung und vereinbartes Material werden nachvollziehbar aufgeführt."]
]; }

const trustBar = `<section class="trust-strip"><div class="container trust-grid"><div><strong>24/7 erreichbar</strong><span>Tag und Nacht anrufen</span></div><div><strong>Preis vor Beginn</strong><span>Klare Absprache</span></div><div><strong>Legitimation</strong><span>Sicherer Ablauf</span></div><div><strong>Rechnung möglich</strong><span>Nachvollziehbare Leistung</span></div></div></section>`;

function prices() { return `<section id="preise" class="section-soft"><div class="container"><div class="section-intro"><span class="eyebrow">Transparente Orientierung</span><h2>Preise für Türöffnung und Zylinderwechsel</h2><p>Alle Beträge inkl. MwSt. Anfahrt und mögliche Zusatzarbeiten werden telefonisch genannt und vor Arbeitsbeginn vereinbart.</p></div><div class="price-table-wrap"><table><thead><tr><th>Leistung</th><th>07–20 Uhr</th><th>20–00 Uhr</th><th>00–07 Uhr</th></tr></thead><tbody><tr><td>Zugefallene Tür öffnen</td><td>59 €</td><td>79 €</td><td>99 €</td></tr><tr><td>Abgeschlossene Tür öffnen</td><td>89 €</td><td>109 €</td><td>129 €</td></tr><tr><td>Zylinderwechsel</td><td>89 €</td><td>109 €</td><td>129 €</td></tr></tbody></table></div><div class="mobile-price-list"><article><h3>Zugefallene Tür</h3><p><span>07–20 Uhr</span><strong>59 €</strong></p><p><span>20–00 Uhr</span><strong>79 €</strong></p><p><span>00–07 Uhr</span><strong>99 €</strong></p></article><article><h3>Abgeschlossene Tür</h3><p><span>07–20 Uhr</span><strong>89 €</strong></p><p><span>20–00 Uhr</span><strong>109 €</strong></p><p><span>00–07 Uhr</span><strong>129 €</strong></p></article><article><h3>Zylinderwechsel</h3><p><span>07–20 Uhr</span><strong>89 €</strong></p><p><span>20–00 Uhr</span><strong>109 €</strong></p><p><span>00–07 Uhr</span><strong>129 €</strong></p></article></div><p class="fine-print">Profilzylinder, Sicherheitsbeschläge und sonstiges Material sind nur nach ausdrücklicher Absprache Bestandteil des Auftrags.</p></div></section>`; }

function districts() { return `<section id="einsatzgebiete"><div class="container"><div class="section-intro"><span class="eyebrow">Lokaler Schlüsseldienst</span><h2>Einsatzgebiete in ganz Berlin</h2><p>Wählen Sie Ihren Bezirk. Die bestehenden lokalen Seiten bleiben unter ihren bisherigen URLs erreichbar.</p></div><div class="area-links">${districtRoutes.map(r=>`<a href="/${r}/">${districtNames[r.slice(16)]}</a>`).join("")}</div></div></section>`; }

function headingHtml(keyword) {
  if (keyword.startsWith("Schlüsseldienst ")) {
    return `<span class="title-primary">Schlüsseldienst</span><span class="title-location">${esc(keyword.slice("Schlüsseldienst ".length))}</span>`;
  }
  return esc(keyword);
}

function render(slug) {
  const keyword = keywordFor(slug);
  const faqs = faq(keyword);
  const isLegal = slug === "impressum" || slug === "impressum.html";
  const district = slug.startsWith("schlüsseldienst-") ? districtNames[slug.slice(16)] : null;
  const intro = district ? `${keyword} hilft bei zugefallenen und abgeschlossenen Türen, Schlüsselverlust sowie Schloss- und Zylinderwechsel. Wir klären Situation, Legitimation, Anfahrt und Preis, bevor die Arbeit beginnt.` : `Trust ${keyword} hilft bei Türöffnungen, Schlosswechsel, Zylinderwechsel und akuten Schlüsselfällen. Vor Beginn klären wir die Situation, Ihre Berechtigung, den Preis und das passende Vorgehen.`;
  const seoIntro = `<section class="seo-welcome"><div class="container"><h2>Willkommen bei Trust Schlüsseldienst Berlin</h2><p>Sie brauchen schnell Hilfe, weil Ihre Tür zugefallen ist, der Schlüssel innen steckt oder das Schloss klemmt? Trust Schlüsseldienst Berlin ist 24/7 erreichbar. Wir klären vor Beginn der Arbeit die Türsituation, Ihre Berechtigung und den Preis – transparent und ohne versteckte Kosten.</p></div></section>`;
  const main = isLegal ? `<section class="page-hero compact"><div class="container"><span class="eyebrow">Rechtliche Angaben</span><h1>Impressum</h1></div></section><section><div class="container"><div class="card legal-card"><h2>Anbieterkennzeichnung</h2><p><strong>Trust B&M Service UG (haftungsbeschränkt)</strong><br>Inhaber: Bilal Sleiman<br>Ramlerstr. 2a<br>13355 Berlin</p><p>Handelsregister: HRB 288982 B</p><p>Telefon: <a href="tel:${phone}">${phoneDisplay}</a><br>E-Mail: <a href="mailto:${email}">${email}</a></p></div></div></section>` : `<section class="page-hero page-hero-image"><div class="container"><div class="hero-copy"><h1>${headingHtml(keyword)}</h1><p>${esc(intro)}</p><div class="hero-actions"><a class="button button-primary" href="tel:${phone}">Jetzt anrufen</a><a class="button button-whatsapp" href="https://wa.me/491638516782">WhatsApp</a><a class="button button-secondary" href="/#preise">Preise ansehen</a></div><ul class="hero-points"><li>Festpreis am Telefon</li><li>24/7 Türöffnung</li><li>Einbruchschutz</li></ul></div></div></section>${seoIntro}<section><div class="container"><div class="section-intro clean-intro"><h2>Professionelle Hilfe rund um Tür, Schloss und Sicherheit</h2><p>Jeder Einsatz beginnt mit einer klaren Einschätzung. Zusatzarbeiten oder Material erfolgen nur nach Absprache.</p></div><div class="grid-3 service-cards-clean"><a class="card service-card-clean" href="/leistung/öffnung-bei-zugefallenen-türen/"><h3>Zugefallene Tür</h3><p>Wenn die Wohnungstür nur zugefallen ist, prüfen wir die Türsituation und öffnen möglichst schonend. Trust Schlüsseldienst Berlin erklärt Preis, Anfahrt und Vorgehen vor Beginn transparent.</p><span class="card-button">Mehr erfahren</span></a><a class="card service-card-clean" href="/leistung/öffnung-bei-abgeschlossenen-türen/"><h3>Abgeschlossene Tür</h3><p>Bei abgeschlossener Tür analysieren wir Schloss, Zylinder und Beschlag sorgfältig. Sie erhalten vor der Arbeit eine klare Einschätzung, damit die Öffnung fair und nachvollziehbar bleibt.</p><span class="card-button">Mehr erfahren</span></a><a class="card service-card-clean" href="/leistung/schlosswechsel-berlin-schlösser-schnell-sicher-wechseln/"><h3>Schloss- & Zylinderwechsel</h3><p>Nach Schlüsselverlust, Defekt oder Sicherheitsbedenken wechseln wir Zylinder und Schlösser nur nach Absprache. Material, Aufwand und Kosten werden vorher verständlich erklärt.</p><span class="card-button">Mehr erfahren</span></a></div></div></section><section class="section-blue"><div class="container"><div class="section-intro"><span class="eyebrow">So läuft es ab</span><h2>In vier klaren Schritten wieder Zugang erhalten</h2></div><div class="process-grid"><div class="process-step"><span>1</span><h3>Situation schildern</h3><p>Bezirk, Türart und ob die Tür zugefallen oder abgeschlossen ist.</p></div><div class="process-step"><span>2</span><h3>Preis klären</h3><p>Anfahrt, Leistung, Uhrzeit und mögliche Besonderheiten werden besprochen.</p></div><div class="process-step"><span>3</span><h3>Legitimation prüfen</h3><p>Die Berechtigung zur Öffnung wird vor Ort nachvollziehbar geprüft.</p></div><div class="process-step"><span>4</span><h3>Tür öffnen</h3><p>Wir wählen die zur Situation passende, möglichst schonende Methode.</p></div></div></div></section>${prices()}<section><div class="container split"><div><span class="eyebrow">Seriöser Ablauf</span><h2>Woran Sie einen fairen Schlüsseldienst erkennen</h2><p>Ein seriöser Ablauf beginnt nicht erst an der Tür. Fragen Sie nach Anfahrt, Grundpreis, Zuschlägen und möglichen Materialkosten. Bei Trust werden diese Punkte vor Beginn geklärt. Ein Zylinder oder Beschlag wird nicht ohne Ihre Zustimmung gewechselt.</p></div><div class="card"><h3>Vor dem Einsatz hilfreich</h3><ul class="mini-list"><li>Genaue Adresse und Berliner Bezirk</li><li>Tür nur zugefallen oder abgeschlossen?</li><li>Steckt ein Schlüssel von innen?</li><li>Besonderer Sicherheitsbeschlag vorhanden?</li><li>Ausweis oder andere Legitimation verfügbar?</li></ul></div></div></section>${districts()}<section class="section-soft"><div class="container"><div class="section-intro"><span class="eyebrow">Häufige Fragen</span><h2>Antworten zu ${esc(keyword)}</h2></div><div class="faq-list">${faqs.map(([q,a])=>`<details class="faq-item"><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join("")}</div></div></section><section><div class="container"><div class="cta-panel"><div><h2>Jetzt Schlüsseldienst in Berlin anrufen</h2><p>Nennen Sie Bezirk und Türsituation. Wir besprechen Preis und Vorgehen vor Beginn.</p></div><div class="cta-actions"><a class="button button-primary" href="tel:${phone}">${phoneDisplay}</a><a class="button button-whatsapp" href="https://wa.me/491638516782">WhatsApp</a></div></div></div></section>`;
  return `<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(titleFor(slug))}</title><meta name="description" content="${esc(descriptionFor(slug))}"><meta name="robots" content="index,follow,max-image-preview:large"><link rel="canonical" href="${routeUrl(slug)}"><link rel="icon" href="/favicon.ico"><link rel="stylesheet" href="/assets/css/styles.css?v=${version}">${schema(slug,keyword,faqs)}</head><body>${header}<main>${slug?`<div class="breadcrumb"><div class="container"><a href="/">Startseite</a><span>›</span><span>${esc(keyword)}</span></div></div>`:""}${main}</main>${footer}<script src="/assets/js/main.js?v=${version}" defer></script></body></html>`;
}

fs.writeFileSync(path.join(root, "index.html"), render(""), "utf8");
for (const slug of allIndexes) fs.writeFileSync(path.join(root, slug, "index.html"), render(slug), "utf8");

const sitemapRoutes = ["", ...allIndexes.filter(r => r !== "startseite")];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapRoutes.map(r=>`  <url><loc>${routeUrl(r)}</loc><lastmod>${new Date().toISOString().slice(0,10)}</lastmod></url>`).join("\n")}\n</urlset>\n`;
fs.writeFileSync(path.join(root,"sitemap.xml"),sitemap,"utf8");
console.log(`Generated ${allIndexes.length + 1} pages without changing existing directory routes.`);
