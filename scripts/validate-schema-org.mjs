import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const site = "https://www.trust-schluesseldienstberlin.de";
const endpoint = "https://validator.schema.org/validate";
const sitemap = fs.readFileSync(path.join(root, "sitemap.xml"), "utf8");
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);

const fileForUrl = (url) => {
  const pathname = decodeURIComponent(new URL(url).pathname);
  return pathname === "/"
    ? path.join(root, "index.html")
    : path.join(root, ...pathname.split("/").filter(Boolean), "index.html");
};

async function validate(url) {
  const file = fileForUrl(url);
  if (!fs.existsSync(file)) return { url, errors: 1, warnings: 0, detail: `Lokale Datei fehlt: ${file}` };
  const html = fs.readFileSync(file, "utf8");
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded;charset=UTF-8" },
    body: new URLSearchParams({ html })
  });
  if (!response.ok) return { url, errors: 1, warnings: 0, detail: `HTTP ${response.status}` };
  const payload = await response.text();
  const jsonStart = payload.indexOf("{");
  if (jsonStart < 0) return { url, errors: 1, warnings: 0, detail: "Antwort enthält kein JSON" };
  const result = JSON.parse(payload.slice(jsonStart));
  return {
    url,
    errors: result.totalNumErrors ?? 0,
    warnings: result.totalNumWarnings ?? 0,
    detail: result.totalNumErrors || result.totalNumWarnings ? "Schema.org-Validator meldet Hinweise" : ""
  };
}

const results = [];
for (let index = 0; index < urls.length; index += 4) {
  results.push(...await Promise.all(urls.slice(index, index + 4).map(validate)));
}

const failed = results.filter((result) => result.errors || result.warnings);
console.log(JSON.stringify({
  checked: results.length,
  errors: results.reduce((sum, result) => sum + result.errors, 0),
  warnings: results.reduce((sum, result) => sum + result.warnings, 0),
  failed: failed.length
}, null, 2));
for (const result of failed) console.error(`ERROR ${result.url}: ${result.errors} Fehler, ${result.warnings} Warnungen${result.detail ? ` (${result.detail})` : ""}`);
if (failed.length) process.exit(1);
