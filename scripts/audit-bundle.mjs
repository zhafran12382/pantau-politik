import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { JSDOM } from 'jsdom';
import { measureInitialAssets } from './lib/assets.mjs';

const dist = path.resolve(process.env.DIST_DIR || 'dist');
async function htmlFiles(directory) {
  const result = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    result.push(...(entry.isDirectory() ? await htmlFiles(file) : file.endsWith('.html') ? [file] : []));
  }
  return result;
}
const files = await htmlFiles(dist);
let maximum = 0;
for (const file of files) {
  const html = await readFile(file, 'utf8');
  const route = '/' + path.relative(dist, file).replaceAll(path.sep, '/').replace(/index\.html$/, '');
  const dom = new JSDOM(html, { url: `http://localhost${route}` });
  const result = await measureInitialAssets(dom.window.document, dist, html);
  dom.window.close();
  maximum = Math.max(maximum, result.jsGzip);
  console.log(`${route}: ${(result.jsGzip / 1024).toFixed(1)} KiB gzip JS, ${Math.round(result.initialBytes / 1024)} KiB aset awal`);
  if (result.jsGzip > 150 * 1024 || result.initialBytes > 1024 * 1024) {
    throw new Error(`${route}: budget halaman terlampaui`);
  }
}
console.log(`Budget ${files.length} halaman lulus; JS awal maksimum ${(maximum / 1024).toFixed(1)} KiB gzip. Imported chunks termasuk dalam hitungan.`);
