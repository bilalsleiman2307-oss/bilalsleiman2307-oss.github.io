const fs = require('fs');
const path = require('path');
const slugs = ['heiligensee','frohnau','hermsdorf','kladow','staaken','franzoesisch-buchholz','karow','buch','mahlsdorf','kaulsdorf','mueggelheim','rahnsdorf','rudow','lichtenrade','wannsee'].map(s => `schlüsseldienst-${s}`);
const titles = new Set();
const descriptions = new Set();
const errors = [];
for (const slug of slugs) {
  const html = fs.readFileSync(path.join(slug, 'index.html'), 'utf8');
  const title = html.match(/<title>(.*?)<\/title>/)?.[1] || '';
  const description = html.match(/<meta name="description" content="(.*?)">/)?.[1] || '';
  const canonical = html.match(/<link rel="canonical" href="(.*?)">/)?.[1] || '';
  try { JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1]); } catch { errors.push(`${slug}: invalid schema`); }
  if (!canonical.endsWith(`/${slug}/`)) errors.push(`${slug}: canonical`);
  if (!html.includes('<body class="local-page">')) errors.push(`${slug}: design class`);
  if (title.length > 62) errors.push(`${slug}: title ${title.length}`);
  if (description.length < 120 || description.length > 160) errors.push(`${slug}: description ${description.length}`);
  titles.add(title);
  descriptions.add(description);
  console.log(`${slug}: title=${title.length}, description=${description.length}`);
}
if (titles.size !== slugs.length) errors.push('titles not unique');
if (descriptions.size !== slugs.length) errors.push('descriptions not unique');
console.log(JSON.stringify({pages:slugs.length, uniqueTitles:titles.size, uniqueDescriptions:descriptions.size, errors}, null, 2));
process.exitCode = errors.length ? 1 : 0;
