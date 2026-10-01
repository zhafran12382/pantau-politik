import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { JSDOM } from 'jsdom';
import { initComparison } from '../../src/client/compare.mjs';
import { initUI } from '../../src/client/ui.mjs';

const dist = path.resolve(process.env.DIST_DIR || 'dist');
async function open(route = 'bandingkan', query = '', { init = true, mutate } = {}) {
  const html = await readFile(path.join(dist, route, 'index.html'), 'utf8');
  const dom = new JSDOM(html, { url: `http://localhost:4321/${route}/?${query}`, pretendToBeVisual: true });
  if (mutate) mutate(dom.window.document);
  if (init) { initComparison(dom.window.document, dom.window); initUI(dom.window.document, dom.window); }
  return dom;
}
const change = (dom, id, value) => {
  const control = dom.window.document.getElementById(id);
  control.value = value;
  control.dispatchEvent(new dom.window.Event('change', { bubbles: true }));
};
test('SSR: graph, sources and default table are readable without executing JS', async () => {
  const dom = await open('bandingkan', '', { init: false });
  const doc = dom.window.document;
  assert.ok(doc.getElementById('dataTable'));
  assert.equal(doc.getElementById('tableWrap').hidden, false);
  assert.ok(doc.querySelector('#chartWrap svg'));
  assert.ok(doc.querySelector('#sourceBox a[href^="https://"]'));
  assert.equal(doc.getElementById('compareFields').disabled, true);
  dom.window.close();
});
test('all five indicators change table, definition, sources, summary and graph together', async () => {
  const dom = await open();
  const doc = dom.window.document;
  const data = JSON.parse(doc.getElementById('compare-data').textContent);
  for (const indicator of data.indicators) {
    change(dom, 'selInd', indicator.id);
    assert.equal(doc.getElementById('resultTitle').textContent, indicator.label);
    assert.equal(doc.getElementById('sourceDefinition').textContent, indicator.definition);
    assert.ok(doc.querySelector('caption').textContent.includes(indicator.unit));
    assert.equal(doc.getElementById('sourceReference').textContent.startsWith(indicator.reference_period), true);
    const expected = indicator.source_ids.map(id => data.sources.find(source => source.id === id).url);
    assert.deepEqual([...doc.querySelectorAll('#indicatorSources a')].map(link => link.href), expected);
    assert.ok(doc.getElementById('summaries').textContent.includes('2005'));
    assert.equal(new URL(dom.window.location.href).searchParams.get('indikator'), indicator.id);
  }
  dom.window.close();
});
test('same period preserves state and visibly explains the rejected selection', async () => {
  const dom = await open();
  const before = dom.window.location.href;
  change(dom, 'selB', 'admin-2004-2014');
  assert.equal(dom.window.document.getElementById('selB').value, 'admin-2014-2024');
  assert.equal(dom.window.location.href, before);
  assert.equal(dom.window.document.getElementById('compareNotice').hidden, false);
  assert.match(dom.window.document.getElementById('compareNotice').textContent, /berbeda/);
  dom.window.close();
});
test('calendar/equal mode, swapping, copied URL and reopening restore the exact state', async () => {
  const dom = await open();
  const doc = dom.window.document;
  const calendar = doc.querySelector('#chartWrap path').getAttribute('d');
  const mode = doc.querySelector('input[value="setara"]'); mode.checked = true;
  mode.dispatchEvent(new dom.window.Event('change', { bubbles: true }));
  assert.notEqual(doc.querySelector('#chartWrap path').getAttribute('d'), calendar);
  doc.getElementById('swapPeriods').click();
  change(dom, 'selInd', 'gini');
  let copied;
  Object.defineProperty(dom.window.navigator, 'clipboard', { value: { writeText: async value => { copied = value; } } });
  doc.querySelector('[data-share-button]').click();
  await new Promise(resolve => setTimeout(resolve, 20));
  assert.match(doc.querySelector('[data-share-status]').textContent, /Tautan disalin/);
  const reopened = await open('bandingkan', new URL(copied).search.slice(1));
  assert.equal(reopened.window.document.getElementById('selInd').value, 'gini');
  assert.equal(reopened.window.document.getElementById('selA').value, 'admin-2014-2024');
  assert.equal(reopened.window.document.querySelector('input[value="setara"]').checked, true);
  dom.window.close(); reopened.window.close();
});
test('back and forward restore selection without manufacturing extra history entries', async () => {
  const dom = await open();
  change(dom, 'selInd', 'gini'); change(dom, 'selInd', 'inflasi');
  const length = dom.window.history.length;
  const pop = action => new Promise(resolve => { dom.window.addEventListener('popstate', resolve, { once: true }); action(); });
  await pop(() => dom.window.history.back());
  assert.equal(dom.window.document.getElementById('selInd').value, 'gini');
  await pop(() => dom.window.history.forward());
  assert.equal(dom.window.document.getElementById('selInd').value, 'inflasi');
  assert.equal(dom.window.history.length, length);
  dom.window.close();
});
test('invalid link displays fallback notice; table is visible and collapsible', async () => {
  const dom = await open('bandingkan', 'indikator=unknown&mode=setara&mode=kalender');
  const doc = dom.window.document;
  assert.equal(doc.getElementById('selInd').value, 'pdb-growth');
  assert.equal(doc.getElementById('compareNotice').hidden, false);
  assert.equal(doc.getElementById('tableWrap').hidden, false);
  assert.equal(doc.getElementById('tableToggle').textContent, 'Sembunyikan angka');
  doc.getElementById('tableToggle').click();
  assert.equal(doc.getElementById('tableWrap').hidden, true);
  assert.equal(doc.getElementById('tableToggle').getAttribute('aria-expanded'), 'false');
  doc.getElementById('tableToggle').click();
  assert.equal(doc.getElementById('tableWrap').hidden, false);
  dom.window.close();
});
test('malformed data preserves static table and disabled controls', async () => {
  const dom = await open('bandingkan', 'indikator=gini', { mutate: doc => { doc.getElementById('compare-data').textContent = '{broken'; } });
  const doc = dom.window.document;
  assert.equal(doc.getElementById('compareFields').disabled, true);
  assert.equal(doc.getElementById('tableWrap').hidden, false);
  assert.match(doc.getElementById('compareNotice').textContent, /Tabel bawaan/);
  dom.window.close();
});
test('failed share and clipboard reveal a selectable URL, cancellation does not show error', async () => {
  const dom = await open(); const doc = dom.window.document;
  dom.window.navigator.share = async () => { throw new Error('Unavailable'); };
  doc.querySelector('[data-share-button]').click();
  await new Promise(resolve => setTimeout(resolve, 20));
  assert.equal(doc.querySelector('[data-share-fallback]').hidden, false);
  assert.equal(doc.querySelector('[data-share-url]').value, dom.window.location.href);
  assert.equal(doc.activeElement, doc.querySelector('[data-share-url]'));
  dom.window.navigator.share = async () => { throw new dom.window.DOMException('Cancelled', 'AbortError'); };
  doc.querySelector('[data-share-button]').click();
  await new Promise(resolve => setTimeout(resolve, 20));
  assert.equal(doc.querySelector('[data-share-status]').textContent, '');
  dom.window.close();
});
test('homepage search and topic filter narrow visible issue cards', async () => {
  const { initIssueFilter } = await import('../../src/client/home-filter.mjs');
  const html = await readFile(path.join(dist, 'index.html'), 'utf8');
  const dom = new JSDOM(html, { url: 'http://localhost:4321/', pretendToBeVisual: true });
  const doc = dom.window.document;
  initIssueFilter(doc, dom.window);
  assert.equal(doc.querySelectorAll('.issue-card:not([hidden])').length, 3);
  assert.ok(doc.querySelector('.trust-strip'), 'trust architecture above the fold');
  doc.getElementById('issueSearch').value = 'pemilu';
  doc.getElementById('issueSearch').dispatchEvent(new dom.window.Event('input', { bubbles: true }));
  assert.equal(doc.querySelectorAll('.issue-card:not([hidden])').length, 1);
  assert.equal(doc.getElementById('noResults').hidden, true);
  doc.getElementById('issueSearch').value = 'zzzz-tidak-ada';
  doc.getElementById('issueSearch').dispatchEvent(new dom.window.Event('input', { bubbles: true }));
  assert.equal(doc.getElementById('noResults').hidden, false);
  dom.window.close();
});
test('compare page exposes swap, CSV, mode help, caution and delta', async () => {
  const dom = await open();
  const doc = dom.window.document;
  assert.match(doc.querySelector('h1').textContent.replace(/\s+/g, ' '), /Bandingkan satu indikator/);
  assert.match(doc.querySelector('h1').textContent, /antar dua periode/);
  assert.ok(doc.getElementById('swapPeriods'), 'swap action adjacent to period selects');
  assert.ok(doc.getElementById('downloadCsv'), 'CSV download affordance');
  assert.ok(doc.querySelector('.mode-help summary'), 'mode explanation before selection');
  assert.ok(doc.querySelector('.range-help summary'), 'range exclusion explained');
  assert.match(doc.querySelector('.caution-line').textContent, /bukan bukti sebab-akibat/);
  assert.match(doc.getElementById('summaries').textContent, /Selisih/);
  assert.match(doc.getElementById('resultMeta').textContent, /dari \d+ tahun tersedia/);
  assert.ok(doc.querySelector('#chartWrap svg footer, #chartWrap svg text:last-child'), 'chart carries footer');
  dom.window.close();
});
test('issue page has TOC, status chip, source kinds and correction anchor', async () => {
  const dom = await open('isu/subsidi-energi-apbn', '', { init: false });
  const doc = dom.window.document;
  assert.ok(doc.querySelector('nav.toc'), 'anchor navigation for long explainer');
  assert.ok(doc.querySelector('.chip--dev, .chip--wait, .chip--done, .chip--arch'), 'status is a defined chip, not plain text');
  assert.ok(doc.querySelector('.source-kind'), 'primary vs secondary sources labelled');
  assert.match(doc.querySelector('.article-meta').textContent, /tanggal naskah|Diterbitkan/);
  dom.window.close();
});
test('issue source links remain outside closed details; glossary Escape returns focus', async () => {
  const dom = await open('isu/angka-kemiskinan-bps'); const doc = dom.window.document;
  assert.ok(doc.querySelector('.timeline > li .citations a[href^="https://"]'));
  assert.equal(doc.querySelector('.timeline .citations').closest('details'), null);
  const glossary = doc.querySelector('.glossary'); glossary.open = true;
  glossary.querySelector('[data-glossary-close]').focus();
  glossary.dispatchEvent(new dom.window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  assert.equal(glossary.open, false);
  assert.equal(doc.activeElement, glossary.querySelector('summary'));
  dom.window.close();
});
