// Structural/DOM accessibility and actual initial-asset budgets.
// jsdom has no layout engine: this explicitly does NOT claim visual or screen-reader testing.
import { readFile, readdir, stat, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { gzipSync } from 'node:zlib';
import { createRequire } from 'node:module';
import { createHash } from 'node:crypto';
import { JSDOM, VirtualConsole } from 'jsdom';
import { openSync } from 'fontkit';

const require = createRequire(import.meta.url);
const root = path.resolve(process.env.DIST_DIR || 'dist');
async function walk(directory) {
  const results = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) results.push(...await walk(file)); else results.push(file);
  }
  return results;
}
const files = await walk(root);
const htmlFiles = files.filter(file => file.endsWith('.html'));
assert.equal(htmlFiles.length, 17, 'Expected 16 publik + 1 lab development (noindex)');
const lab = htmlFiles.find(f => f.endsWith('/lab/index.html'));
assert.ok(lab, 'Lab development ada');
assert.ok((await readFile(lab, 'utf8')).includes('noindex'), 'Lab wajib noindex');
const axe = await readFile(require.resolve('axe-core/axe.min.js'), 'utf8');
const report = { checkedAt: new Date().toISOString(), domEngine: 'jsdom (no layout engine)', layoutAudit: 'Not run: native browser unavailable on this Android environment', contrastAudit: 'sRGB token pairs calculated separately; not a rendered-page audit', pages: [], font: {} };
const errors = [];

for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  const route = '/' + path.relative(root, file).replaceAll(path.sep, '/').replace(/index\.html$/, '');
  const dom = new JSDOM(html, { url: `http://localhost${route}`, runScripts: 'outside-only', virtualConsole: new VirtualConsole() });
  const doc = dom.window.document;
  assert.equal(doc.documentElement.lang, 'id');
  assert.equal(doc.querySelectorAll('h1').length, 1, route);
  assert.ok(doc.querySelector('main') && doc.querySelector('.skip[href="#konten"]'));
  for (const element of doc.querySelectorAll('[aria-labelledby], [aria-controls]')) {
    for (const attribute of ['aria-labelledby', 'aria-controls']) {
      for (const id of (element.getAttribute(attribute) || '').split(/\s+/).filter(Boolean)) assert.ok(doc.getElementById(id), `${route}: missing ${id}`);
    }
  }
  const assets = new Set();
  const queue = [];
  for (const element of doc.querySelectorAll('script[src], link[rel="stylesheet"], link[rel="preload"], link[rel="modulepreload"]')) queue.push(element.src || element.href);
  let jsGzip = 0, initialBytes = Buffer.byteLength(html), fontBytes = 0;
  for (const script of doc.querySelectorAll('script:not([src])')) {
    if (['application/json', 'application/ld+json'].includes(script.type)) continue;
    if (script.textContent.trim()) errors.push(`${route}: inline executable script violates script-src self`);
  }
  while (queue.length) {
    const url = new URL(queue.shift(), dom.window.location.href);
    if (url.origin !== dom.window.location.origin) throw new Error(`${route}: external initial asset ${url}`);
    const local = path.join(root, decodeURIComponent(url.pathname));
    if (assets.has(local)) continue;
    assets.add(local);
    const buffer = await readFile(local);
    initialBytes += buffer.length;
    if (local.endsWith('.woff2')) fontBytes += buffer.length;
    if (local.endsWith('.js')) jsGzip += gzipSync(buffer).length;
    if (local.endsWith('.css')) {
      const css = buffer.toString();
      assert.ok(css.includes('Manrope'), 'Manrope required in CSS');
      assert.ok(!css.includes('GeistVariable'), 'Old font must not be requested');
      for (const match of css.matchAll(/url\(["']?([^\s"')]+)["']?\)/g)) if (!match[1].startsWith('data:')) queue.push(new URL(match[1], url).href);
      const style = doc.createElement('style'); style.textContent = css; doc.head.append(style);
    }
  }
  assert.ok(jsGzip <= 150 * 1024, `${route}: JS budget`);
  assert.ok(initialBytes <= 1024 * 1024, `${route}: initial asset budget`);
  assert.ok(fontBytes <= 60 * 1024, `${route}: font budget`);
  dom.window.eval(axe);
  const results = await dom.window.axe.run(doc, {
    runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] },
    rules: { 'color-contrast': { enabled: false } },
  });
  const violations = results.violations.map(item => ({ id: item.id, impact: item.impact, elements: item.nodes.map(node => node.target) }));
  for (const violation of violations) errors.push(`${route}: ${JSON.stringify(violation)}`);
  report.pages.push({ route, jsGzip, initialBytes, fontBytes, violations, incompleteRules: results.incomplete.map(item => item.id) });
  console.log(`${route}: ${Math.round(initialBytes / 1024)} KB initial, ${(jsGzip / 1024).toFixed(1)} KB gzip JS, ${violations.length} DOM accessibility findings`);
  dom.window.close();
}
const fontFile = path.join(root, '_astro', (await readdir(path.join(root, '_astro'))).find(name => name.includes('manrope-latin') && name.endsWith('.woff2')));
const font = openSync(fontFile);
const advances = font.layout('0123456789', ['tnum']).positions.map(position => position.xAdvance);
assert.equal(new Set(advances).size, 1, 'Numerals must support tabular alignment');
for (const char of '%−–é') assert.ok(font.hasGlyphForCodePoint(char.codePointAt(0)), `Missing glyph: ${char}`);
report.font = { family: font.familyName, bytes: (await stat(fontFile)).size, tabularNumerals: true, requiredPunctuation: true };
report.artifactHashes = {};
for (const file of files) report.artifactHashes[path.relative(root, file)] = createHash('sha256').update(await readFile(file)).digest('hex');
await mkdir('.reports', { recursive: true });
await writeFile('.reports/design-audit.json', JSON.stringify(report, null, 2) + '\n');
if (errors.length) { for (const error of errors) console.error(error); process.exit(1); }
console.log('Structural accessibility, font and asset checks passed. Layout/zoom/TalkBack still require a real browser.');
