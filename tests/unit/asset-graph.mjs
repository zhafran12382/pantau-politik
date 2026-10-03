import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import os from 'node:os';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import { JSDOM } from 'jsdom';
import { measureInitialAssets } from '../../scripts/lib/assets.mjs';

async function fixture(t, files) {
  const root = await mkdtemp(path.join(os.tmpdir(), 'pantau-assets-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  for (const [name, content] of Object.entries(files)) {
    await mkdir(path.dirname(path.join(root, name)), { recursive: true });
    await writeFile(path.join(root, name), content);
  }
  return root;
}

test('Asset budget follows static/dynamic imports, CSS fonts and cycles once per page', async t => {
  const files = {
    'main.js': "import './chunks/core.js'; export { x } from './other.js'; import('./late.js');",
    'chunks/core.js': "import '../main.js'; export const core = 1;",
    'other.js': 'export const x = 2;',
    'late.js': 'export const late = 3;',
    'styles.css': '@import "./theme.css"; @font-face{font-family:Manrope;src:url("./font.woff2")}',
    'theme.css': 'body{color:#211a12}',
    'font.woff2': Buffer.from([1, 2, 3, 4]),
    'favicon.svg': '<svg xmlns="http://www.w3.org/2000/svg"></svg>',
  };
  const root = await fixture(t, files);
  const html = '<!doctype html><script type="module" src="/main.js"></script><link rel="stylesheet" href="/styles.css"><link rel="preload" href="/font.woff2"><link rel="icon" href="/favicon.svg">';
  const dom = new JSDOM(html, { url: 'http://localhost/bandingkan/' });
  t.after(() => dom.window.close());
  const result = await measureInitialAssets(dom.window.document, root, html);
  assert.deepEqual([...result.assets].map(file => path.relative(root, file)).sort(), Object.keys(files).sort());
  const buffers = Object.entries(files).map(([name, content]) => ({ name, bytes: Buffer.from(content) }));
  assert.equal(result.initialBytes, Buffer.byteLength(html) + buffers.reduce((sum, file) => sum + file.bytes.length, 0));
  assert.equal(result.jsGzip, buffers.filter(file => file.name.endsWith('.js')).reduce((sum, file) => sum + gzipSync(file.bytes).length, 0));
  assert.equal(result.fontBytes, files['font.woff2'].length);
  assert.equal(result.styles.length, 2);
});

test('Asset budget rejects external resources rather than claiming a partial measurement', async t => {
  const root = await fixture(t, {});
  const html = '<!doctype html><script src="https://example.invalid/vendor.js"></script>';
  const dom = new JSDOM(html, { url: 'http://localhost/' });
  t.after(() => dom.window.close());
  await assert.rejects(measureInitialAssets(dom.window.document, root, html), /External initial asset/);
});

test('Unresolved dynamic browser imports block a budget claim', async t => {
  const root = await fixture(t, { 'main.js': 'const modulePath = location.hash; import(modulePath);' });
  const html = '<!doctype html><script type="module" src="/main.js"></script>';
  const dom = new JSDOM(html, { url: 'http://localhost/' });
  t.after(() => dom.window.close());
  await assert.rejects(measureInitialAssets(dom.window.document, root, html), /Cannot prove dynamic import budget/);
});
