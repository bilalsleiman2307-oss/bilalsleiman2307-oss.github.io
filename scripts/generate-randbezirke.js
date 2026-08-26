const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const template = fs.readFileSync(path.join(root, 'schlüsseldienst-spandau', 'index.html'), 'utf8');

const places = [
  {name:'Heiligensee', slug:'schlüsseldienst-heiligensee', local:'Zwischen Alt-Heiligensee, Schulzendorf und den Wohnlagen an der Havel prägen Einfamilienhäuser, kleinere Mehrfamilienhäuser und ruhige Straßen den Ortsteil. Bei einer Aussperrung helfen eine genaue Adresse und Hinweise zur Tür dabei, Anfahrt und Auftrag vorab klar einzuordnen.'},
  {name:'Frohnau', slug:'schlüsseldienst-frohnau', local:'Frohnau ist durch die Gartenstadt, den Zeltinger Platz, den Ludolfingerplatz und weitläufige Wohnstraßen geprägt. Unterschiedliche Haustüren, ältere Schlösser und moderne Schließzylinder erfordern eine genaue Beschreibung der Situation vor der Anfahrt.'},
  {name:'Hermsdorf', slug:'schlüsseldienst-hermsdorf', local:'Vom historischen Ortskern über die Wohngebiete am Waldsee bis zum Umfeld des S-Bahnhofs Hermsdorf gibt es sehr unterschiedliche Gebäude- und Türtypen. Nennen Sie beim Anruf Straße, Türzustand und Besonderheiten am Schloss, damit der Auftrag passend vorbereitet werden kann.'},
  {name:'Kladow', slug:'schlüsseldienst-kladow', local:'Kladow verbindet den alten Dorfkern mit Wohnlagen an der Havel und neueren Siedlungsbereichen. Wegen der weiten Wege im Berliner Südwesten werden Einsatzadresse, voraussichtliche Anfahrt und Festpreis besonders sorgfältig vor der Beauftragung abgestimmt.'},
  {name:'Staaken', slug:'schlüsseldienst-staaken', local:'Alt-Staaken, Neu-Staaken und die Wohngebiete entlang der Heerstraße unterscheiden sich deutlich in Bauweise und Türtechnik. Eine präzise Angabe zu Adresse, Türart und Verriegelung hilft, die passende Türöffnung und den Festpreis am Telefon zu klären.'},
  {name:'Französisch Buchholz', slug:'schlüsseldienst-franzoesisch-buchholz', local:'Rund um den alten Dorfkern, die Bucher Straße und die neueren Wohngebiete finden sich Haustüren und Schließanlagen verschiedener Baujahre. Wir besprechen vorab, ob die Tür nur zugefallen oder abgeschlossen ist und welche Anfahrt vereinbart wird.'},
  {name:'Karow', slug:'schlüsseldienst-karow', local:'Alt-Karow, die Wohngebiete nahe dem S-Bahnhof und die neueren Siedlungen im Norden Pankows weisen unterschiedliche Tür- und Schlosstypen auf. Beschreiben Sie die Situation möglichst genau, damit Leistung, Anfahrt und Preis vorab eingeordnet werden können.'},
  {name:'Buch', slug:'schlüsseldienst-buch', local:'Buch umfasst den historischen Ortskern, das Klinikumfeld und neue Wohnquartiere am nördlichen Berliner Stadtrand. Bei einem Schlüsselnotfall werden Adresse, Türzustand und die voraussichtliche Anfahrt bereits am Telefon konkret besprochen.'},
  {name:'Mahlsdorf', slug:'schlüsseldienst-mahlsdorf', local:'Mahlsdorf ist von Einfamilienhausgebieten, dem Hultschiner Damm und den Wohnlagen rund um den S-Bahnhof geprägt. Haustüren und Nebeneingänge können sehr unterschiedliche Schlösser besitzen, weshalb wir die konkrete Situation vor dem Einsatz abfragen.'},
  {name:'Kaulsdorf', slug:'schlüsseldienst-kaulsdorf', local:'Zwischen dem alten Dorfkern, den Kaulsdorfer Seen und den weitläufigen Wohnstraßen stehen viele individuell ausgestattete Häuser. Angaben zu Tür, Zylinder und Verriegelung ermöglichen eine klare Preis- und Leistungsabsprache vor der Anfahrt.'},
  {name:'Müggelheim', slug:'schlüsseldienst-mueggelheim', local:'Müggelheim liegt zwischen Wald- und Wasserflächen im Berliner Südosten und besitzt viele ruhige Wohnstraßen rund um den Dorfanger. Wegen der Randlage stimmen wir Einsatzadresse, Anfahrtszeit und Festpreis besonders transparent am Telefon ab.'},
  {name:'Rahnsdorf', slug:'schlüsseldienst-rahnsdorf', local:'Rahnsdorf mit Hessenwinkel, Wilhelmshagen und den wasserreichen Wohnlagen weist teils größere Entfernungen zwischen den Quartieren auf. Die genaue Adresse ist deshalb wichtig, um die Anfahrt realistisch einzuschätzen und den Auftrag vorab zu vereinbaren.'},
  {name:'Rudow', slug:'schlüsseldienst-rudow', local:'Von Alt-Rudow bis zu den Wohngebieten an der südlichen Stadtgrenze gibt es Mehrfamilienhäuser, Reihenhäuser und Einfamilienhäuser. Für die Türöffnung wird am Telefon geklärt, ob die Tür zugefallen, abgeschlossen oder das Schloss technisch defekt ist.'},
  {name:'Lichtenrade', slug:'schlüsseldienst-lichtenrade', local:'Lichtenrade verbindet den alten Ortskern mit dichten Wohnlagen rund um die Bahnhofstraße und ruhigeren Straßen an der südlichen Stadtgrenze. Türzustand, Adresse und mögliche Besonderheiten am Schloss werden vor dem Einsatz konkret erfragt.'},
  {name:'Wannsee', slug:'schlüsseldienst-wannsee', local:'Wannsee umfasst weitläufige Wohnlagen zwischen Seen, Wald und der Verbindung Richtung Potsdam. Damit die Anfahrt zuverlässig geplant werden kann, nennen Sie bitte die genaue Adresse sowie den Zustand von Tür, Schloss und Schließzylinder.'}
];

const links = places.map(p => `<a href="/${p.slug}/">${p.name}</a>`).join('');

for (const place of places) {
  const title = place.name === 'Französisch Buchholz'
    ? 'Schlüsseldienst Französisch Buchholz | 24/7 Türöffnung'
    : `Schlüsseldienst ${place.name} 24/7 | Festpreis am Telefon`;
  const description = `Schlüsseldienst ${place.name}: schnelle Türöffnung, Schlüsselnotdienst und Schlosswechsel. 24/7 erreichbar, Festpreis und Anfahrt vorab am Telefon.`;
  let html = template
    .replaceAll('schlüsseldienst-spandau', place.slug)
    .replaceAll('Schlüsseldienst Spandau | Türöffnung 24/7', title)
    .replaceAll('Schlüsseldienst Spandau: Türöffnung, Schlüsselnotdienst, Schloss- und Zylinderwechsel mit klarer Preisabsprache vor Beginn. 24/7 erreichbar unter 03040563878.', description)
    .replaceAll('Spandau, Berlin', `${place.name}, Berlin`)
    .replaceAll('Spandau', place.name)
    .replace('<body>', '<body class="local-page">')
    .replaceAll('href="/#preise"', 'href="/schlüsseldienst-berlin-preise/"');

  html = html.replace(
    /(<section class="page-hero[\s\S]*?<\/h1>)<p>[\s\S]*?<\/p>/,
    `$1<p>Ihr Schlüsseldienst in ${place.name} für Türöffnungen, Schlüsselnotfälle sowie Schloss- und Zylinderwechsel. Trust ist 24/7 erreichbar; Festpreis, Anfahrt und Vorgehen werden vor dem Einsatz am Telefon vereinbart.</p>`
  );
  html = html.replace(
    /<section class="seo-welcome">[\s\S]*?<\/section>/,
    `<section class="seo-welcome"><div class="container"><span class="eyebrow">Schnell · fair · unkompliziert</span><h2>Schlüsselnotdienst in ${place.name} mit klarer Preisabsprache</h2><p>Wenn die Tür zugefallen ist oder der Schlüssel fehlt, zählt schnelle und nachvollziehbare Hilfe. Sie erfahren Festpreis und Anfahrt am Telefon, bevor der Auftrag beginnt – ohne Lockangebot und ohne unangekündigte Zusatzarbeit.</p></div></section>`
  );
  html = html.replace(
    /(<section class="seo-focus">[\s\S]*?<h2>)[\s\S]*?(<\/h2>)<p>[\s\S]*?<\/p><p>[\s\S]*?<\/p>/,
    `$1Schlüsseldienst ${place.name}: lokal vorbereitet$2<p>${place.local}</p><p>Wir helfen bei zugefallenen und abgeschlossenen Türen, einem innen steckenden oder verlorenen Schlüssel sowie bei defekten Schlössern. Material und zusätzliche Arbeiten werden nur nach ausdrücklicher Zustimmung ausgeführt.</p>`
  );
  html = html.replace(
    /(<section id="einsatzgebiete">[\s\S]*?<div class="area-links">)[\s\S]*?(<\/div><\/div><\/section>)/,
    `$1${links}$2`
  );
  html = html.replaceAll('Ist Trust Schlüsseldienst Berlin rund um die Uhr erreichbar?', `Ist der Schlüsseldienst in ${place.name} rund um die Uhr erreichbar?`);

  const dir = path.join(root, place.slug);
  fs.mkdirSync(dir, {recursive:true});
  fs.writeFileSync(path.join(dir, 'index.html'), html);
}

const sitemapPath = path.join(root, 'sitemap.xml');
let sitemap = fs.readFileSync(sitemapPath, 'utf8');
for (const place of places) {
  const loc = `https://www.trust-schluesseldienstberlin.de/${place.slug}/`;
  if (!sitemap.includes(`<loc>${loc}</loc>`)) {
    sitemap = sitemap.replace('</urlset>', `<url><loc>${loc}</loc><lastmod>2026-08-26</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>\n</urlset>`);
  }
}
fs.writeFileSync(sitemapPath, sitemap);

console.log(`Generated ${places.length} local SEO pages.`);
