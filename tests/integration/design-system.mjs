import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { JSDOM } from 'jsdom';

const dist = path.resolve(process.env.DIST_DIR || 'dist');
async function htmlFiles(directory) {
  const result = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    result.push(...(entry.isDirectory() ? await htmlFiles(file) : file.endsWith('.html') ? [file] : []));
  }
  return result;
}
const allowedStamps = new Set(['ARSIP PUBLIK', 'DRAF PRATINJAU — BELUM AUDIT', 'KOREKSI TERCATAT']);
const forbiddenIdentity = /\b(?:TOP SECRET|RAHASIA NEGARA|TERVERIFIKASI|CLASSIFIED|DECLASSIFIED)\b/i;
const routeFile = pathname => path.join(dist, pathname.replace(/^\//, ''), pathname.endsWith('/') ? 'index.html' : '');

test('Every built page keeps the truthful archive frame, unique IDs and real anchors', async () => {
  const files = await htmlFiles(dist);
  assert.equal(files.length, 17, 'Current MVP route set');
  for (const file of files) {
    const route = '/' + path.relative(dist, file).replaceAll(path.sep, '/').replace(/index\.html$/, '');
    const dom = new JSDOM(await readFile(file, 'utf8'), { url: `http://localhost${route}` });
    const doc = dom.window.document;
    assert.equal(doc.documentElement.lang, 'id', route);
    assert.equal(doc.querySelectorAll('h1').length, 1, route);
    assert.ok(doc.querySelector('.archive-strip')?.textContent.includes('Arsip publik'), route);
    assert.ok(doc.querySelector('.footer-note')?.textContent.includes('belum menjalani audit'), route);
    const ids = [...doc.querySelectorAll('[id]')].map(element => element.id);
    assert.equal(new Set(ids).size, ids.length, `Duplicate IDs at ${route}`);
    for (const element of doc.querySelectorAll('[aria-labelledby], [aria-controls]')) {
      for (const attribute of ['aria-labelledby', 'aria-controls']) {
        for (const id of (element.getAttribute(attribute) || '').split(/\s+/).filter(Boolean)) {
          assert.ok(doc.getElementById(id), `${route}: missing aria target ${id}`);
        }
      }
    }
    for (const stamp of doc.querySelectorAll('.stamp')) {
      assert.ok(allowedStamps.has(stamp.textContent.replace(/\s+/g, ' ').trim().toUpperCase()), `${route}: invalid stamp ${stamp.textContent}`);
    }
    for (const identity of doc.querySelectorAll('.archive-strip, .filing-tab, .filehead, .exhibit__filehead, .brand, .stamp')) {
      assert.ok(!forbiddenIdentity.test(identity.textContent), `${route}: dishonest identity`);
    }
    for (const link of doc.querySelectorAll('a[href]')) {
      const raw = link.getAttribute('href');
      if (raw.startsWith('#')) assert.ok(doc.getElementById(raw.slice(1)), `${route}: dead anchor ${raw}`);
      if (raw.startsWith('/') && !raw.startsWith('//')) {
        const target = new URL(raw, 'http://localhost');
        const targetFile = routeFile(target.pathname);
        await readFile(targetFile, 'utf8');
        if (target.hash && target.pathname !== route) {
          const linked = new JSDOM(await readFile(targetFile, 'utf8'));
          assert.ok(linked.window.document.getElementById(target.hash.slice(1)), `${route}: dead linked anchor ${raw}`);
          linked.window.close();
        }
      }
    }
    assert.equal(doc.querySelectorAll('.brand-mark svg').length, 0, 'Masthead must remain the wordmark, not a new emblem');
    assert.ok(!doc.querySelector('img[src*="homepage-v2"], img[src*="homepage-reference"]'));
    dom.window.close();
  }
});

test('Homepage exposes filing metadata and the same register codes as issue pages', async () => {
  const dom = new JSDOM(await readFile(path.join(dist, 'index.html'), 'utf8'));
  const doc = dom.window.document;
  assert.ok(doc.querySelector('.filing-tab'), 'Featured issue has a real filing tab');
  const map = JSON.parse(await readFile(new URL('../../content/register-map.json', import.meta.url), 'utf8'));
  const issues = JSON.parse(await readFile(new URL('../../content/issues/issues.json', import.meta.url), 'utf8'));
  for (const issue of issues.filter(item => item.publication_status === 'published')) {
    assert.ok(doc.querySelector(`a[href="/isu/${issue.slug}/"]`));
    assert.ok(doc.body.textContent.includes(map[issue.id]));
    const issueDom = new JSDOM(await readFile(path.join(dist, 'isu', issue.slug, 'index.html'), 'utf8'));
    assert.ok(issueDom.window.document.body.textContent.includes(map[issue.id]));
    issueDom.window.close();
  }
  assert.equal(doc.querySelectorAll('.issue-card__spark').length, 0, 'No ordinal sparkline that removes missing years');
  dom.window.close();
});

test('Comparison uses an exhibit body, semantic table and non-stamp causal caveat', async () => {
  const dom = new JSDOM(await readFile(path.join(dist, 'bandingkan', 'index.html'), 'utf8'));
  const doc = dom.window.document;
  assert.ok(doc.querySelector('.exhibit__body #chartWrap'));
  assert.equal(doc.getElementById('chartWrap').getAttribute('tabindex'), '0');
  assert.equal(doc.getElementById('chartWrap').getAttribute('role'), 'region');
  assert.ok(doc.getElementById('tableWrap')?.querySelector('caption'));
  assert.ok(doc.getElementById('tableWrap').hasAttribute('tabindex'), 'Scrollable table is keyboard reachable');
  for (const stamp of doc.querySelectorAll('.stamp')) assert.ok(!stamp.textContent.includes('Angka kondisi'));
  assert.ok(doc.querySelector('.caution-line')?.textContent.includes('bukan bukti sebab-akibat'));
  dom.window.close();
});
