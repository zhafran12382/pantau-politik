import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import { init, parse } from 'es-module-lexer';

await init;

// Include imported client chunks and CSS/font dependencies; count each resource once per page.
export async function measureInitialAssets(doc, root, html) {
  const origin = doc.location.origin;
  const base = path.resolve(root);
  const queue = [];
  const assets = new Set();
  const styles = [];
  let initialBytes = Buffer.byteLength(html), jsGzip = 0, fontBytes = 0;
  for (const element of doc.querySelectorAll('script[src], link[rel="stylesheet"], link[rel="preload"], link[rel="modulepreload"], link[rel="icon"], link[rel="manifest"]')) {
    queue.push(element.src || element.href);
  }
  for (const image of doc.querySelectorAll('img[src]')) {
    if (image.getAttribute('loading') !== 'lazy') queue.push(image.src);
  }
  for (const element of doc.querySelectorAll('video[poster]')) queue.push(element.poster);
  while (queue.length) {
    const url = new URL(queue.shift(), doc.location.href);
    if (url.protocol === 'data:') continue;
    if (url.origin !== origin) throw new Error(`External initial asset: ${url}`);
    const file = path.resolve(base, '.' + decodeURIComponent(url.pathname));
    if (!file.startsWith(base + path.sep)) throw new Error(`Asset outside build: ${url}`);
    if (assets.has(file)) continue;
    assets.add(file);
    const buffer = await readFile(file);
    initialBytes += buffer.length;
    if (/\.woff2?$/.test(file)) fontBytes += buffer.length;
    if (/\.m?js$/.test(file)) {
      jsGzip += gzipSync(buffer).length;
      const [imports] = parse(buffer.toString());
      for (const dependency of imports) {
        if (dependency.d === -2) continue; // import.meta is not a fetched module.
        if (!dependency.n) throw new Error(`Cannot prove dynamic import budget: ${file}`);
        if (!/^(?:\.{1,2}\/|\/|https?:)/.test(dependency.n)) throw new Error(`Unbundled browser import: ${dependency.n}`);
        queue.push(new URL(dependency.n, url).href);
      }
    }
    if (file.endsWith('.css')) {
      const css = buffer.toString();
      styles.push(css);
      for (const match of css.matchAll(/url\(["']?([^\s"')]+)["']?\)/g)) {
        if (!match[1].startsWith('data:')) queue.push(new URL(match[1], url).href);
      }
      for (const match of css.matchAll(/@import\s+["']([^"']+)["']/g)) queue.push(new URL(match[1], url).href);
    }
  }
  return { initialBytes, jsGzip, fontBytes, assets, styles };
}
