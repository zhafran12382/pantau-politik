import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { JSDOM } from 'jsdom';

const dist = path.resolve(process.env.DIST_DIR || 'dist');
let moduleId = 0;
async function openBuilt(t, route, query = '', mutate) {
  const html = await readFile(path.join(dist, route, 'index.html'), 'utf8');
  const dom = new JSDOM(html, { url: `http://localhost:4321/${route ? route + '/' : ''}${query}`, pretendToBeVisual: true });
  const doc = dom.window.document;
  if (mutate) mutate(doc, dom.window);
  const previous = { document: globalThis.document, window: globalThis.window };
  globalThis.document = doc;
  globalThis.window = dom.window;
  t.after(() => { dom.window.close(); globalThis.document = previous.document; globalThis.window = previous.window; });
  const scripts = [...doc.querySelectorAll('script[type="module"][src]')];
  assert.ok(scripts.length, 'Built page must reference an actual module bundle');
  for (const script of scripts) {
    const url = pathToFileURL(path.join(dist, new URL(script.src).pathname));
    url.search = `fixture=${++moduleId}`;
    await import(url.href);
  }
  return dom;
}
function change(dom, id, value) {
  const control = dom.window.document.getElementById(id);
  control.value = value;
  control.dispatchEvent(new dom.window.Event('change', { bubbles: true }));
}

test('Built homepage module activates the real register, filter and reset without losing hash', async t => {
  const dom = await openBuilt(t, '', '#isu');
  const doc = dom.window.document;
  assert.equal(doc.getElementById('issueFilterControls').hidden, false);
  assert.equal(doc.getElementById('issueSearch').disabled, false);
  const input = doc.getElementById('issueSearch');
  input.value = 'PP-003';
  input.dispatchEvent(new dom.window.Event('input', { bubbles: true }));
  assert.equal(doc.querySelectorAll('.register-entry:not([hidden])').length, 1);
  assert.equal(doc.querySelector('.register-entry:not([hidden]) .file-code').textContent, 'PP-003');
  assert.equal(dom.window.location.hash, '#isu');
  doc.getElementById('resetFilter').click();
  assert.equal(doc.querySelectorAll('.register-entry:not([hidden])').length, 3);
  assert.equal(doc.activeElement, input);
});

test('Built comparison module updates units, mode, swapped periods, table and point reading together', async t => {
  const dom = await openBuilt(t, 'bandingkan', '#hasil');
  const doc = dom.window.document;
  assert.equal(doc.getElementById('compareFields').disabled, false);
  assert.equal(doc.getElementById('downloadCsv').hidden, false);
  change(dom, 'selInd', 'gini');
  assert.ok(doc.querySelector('caption').textContent.includes('indeks 0–1'));
  const point = doc.querySelector('#chartWrap [tabindex][aria-label]');
  point.dispatchEvent(new dom.window.Event('focusin', { bubbles: true }));
  assert.equal(doc.getElementById('chartReading').textContent, point.getAttribute('aria-label'));
  change(dom, 'selInd', 'inflasi');
  assert.notEqual(doc.getElementById('chartReading').textContent, point.getAttribute('aria-label'));
  const mode = doc.querySelector('input[value="setara"]');
  mode.checked = true;
  mode.dispatchEvent(new dom.window.Event('change', { bubbles: true }));
  doc.getElementById('swapPeriods').click();
  assert.equal(doc.getElementById('selA').value, 'admin-2014-2024');
  assert.equal(new URL(dom.window.location.href).searchParams.get('mode'), 'setara');
  assert.equal(dom.window.location.hash, '#hasil');
  doc.getElementById('tableToggle').click();
  assert.equal(doc.getElementById('tableWrap').hidden, true);
  doc.getElementById('tableToggle').click();
  assert.equal(doc.getElementById('tableWrap').hidden, false);
});

test('Built comparison refuses pending CSV and exposes an explanatory fallback', async t => {
  let created = false;
  const dom = await openBuilt(t, 'bandingkan', '', (doc, win) => {
    const data = JSON.parse(doc.getElementById('compare-data').textContent);
    data.indicators.find(indicator => indicator.id === 'pdb-growth').audit_status = 'pending';
    doc.getElementById('compare-data').textContent = JSON.stringify(data);
    win.URL.createObjectURL = () => { created = true; return 'blob:test-pending'; };
  });
  const doc = dom.window.document;
  assert.equal(doc.getElementById('downloadCsv').disabled, true);
  doc.getElementById('downloadCsv').dispatchEvent(new dom.window.Event('click', { bubbles: true }));
  assert.equal(created, false);
  assert.match(doc.getElementById('chartWrap').textContent, /belum dapat dibandingkan/);
  assert.match(doc.getElementById('csvNote').textContent, /pemeriksaan metode/);
});

test('Built issue share/glossary module copies the actual URL and restores glossary focus', async t => {
  let copied;
  const dom = await openBuilt(t, 'isu/subsidi-energi-apbn', '#sumber', (doc, win) => {
    Object.defineProperty(win.navigator, 'clipboard', { configurable: true, value: { writeText: async value => { copied = value; } } });
  });
  const doc = dom.window.document;
  const share = doc.querySelector('[data-share-button]');
  assert.equal(share.hidden, false);
  share.click();
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(copied, dom.window.location.href);
  assert.match(doc.querySelector('[data-share-status]').textContent, /Tautan disalin/);
  const glossary = doc.querySelector('.glossary');
  glossary.open = true;
  const close = glossary.querySelector('[data-glossary-close]');
  close.focus();
  glossary.dispatchEvent(new dom.window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  assert.equal(glossary.open, false);
  assert.equal(doc.activeElement, glossary.querySelector('summary'));
});
