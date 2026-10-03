import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { JSDOM } from 'jsdom';
import { initComparison } from '../../src/client/compare.mjs';
import { initUI } from '../../src/client/ui.mjs';

const dist = path.resolve(process.env.DIST_DIR || 'dist');
async function open(route = 'bandingkan', query = '', { init = true, mutate, hash = '' } = {}) {
  const html = await readFile(path.join(dist, route, 'index.html'), 'utf8');
  const dom = new JSDOM(html, { url: `http://localhost:4321/${route}/?${query}${hash}`, pretendToBeVisual: true });
  if (mutate) mutate(dom.window.document);
  if (init) { initComparison(dom.window.document, dom.window); initUI(dom.window.document, dom.window); }
  return dom;
}
const change = (dom, id, value) => {
  const control = dom.window.document.getElementById(id);
  control.value = value;
  control.dispatchEvent(new dom.window.Event('change', { bubbles: true }));
};

function comparisonFixture(doc, { status = 'approved', mixed = false, cross = false, partial = false } = {}) {
  const script = doc.getElementById('compare-data');
  const data = JSON.parse(script.textContent);
  const indicator = data.indicators.find(item => item.id === 'pdb-growth');
  Object.assign(indicator, { audit_status: status, label: 'Fixture sintetis', method_version: 'fixture-v1' });
  data.observations = data.observations.filter(item => item.indicator_id !== indicator.id);
  const years = [...Array.from({ length: 9 }, (_, i) => 2005 + i), ...Array.from({ length: 9 }, (_, i) => 2015 + i)];
  data.observations.push(...years.map((year, i) => ({ indicator_id: indicator.id, period_start: `${year}-01-01`, value: partial && i === 1 ? null : i === 10 ? 0 : i + 1, series_version: mixed && i === 1 || cross && i >= 9 ? 'fixture-v2' : 'fixture-v1' })));
  script.textContent = JSON.stringify(data);
  // Client harness also supports the pre-redesign candidate; SSR contracts are tested separately.
  if (!doc.getElementById('csvNote')) {
    const note = doc.createElement('p'); note.id = 'csvNote'; doc.body.append(note);
  }
}

function captureCsv(win) {
  const blobs = [], downloads = [];
  win.URL.createObjectURL = blob => { blobs.push(blob); return 'blob:fixture-csv'; };
  win.URL.revokeObjectURL = () => {};
  win.HTMLAnchorElement.prototype.click = function () { downloads.push(this.download); };
  return { blobs, downloads, text: blob => new Promise((resolve, reject) => {
    const reader = new win.FileReader(); reader.onload = () => resolve(reader.result); reader.onerror = reject; reader.readAsText(blob);
  }) };
}

function setMode(dom, value) {
  const radio = dom.window.document.querySelector(`input[name="mode"][value="${value}"]`);
  radio.checked = true;
  radio.dispatchEvent(new dom.window.Event('change', { bubbles: true }));
}

test('SSR: graph, sources and default table are readable without executing JS', async () => {
  const dom = await open('bandingkan', '', { init: false });
  const doc = dom.window.document;
  assert.ok(doc.getElementById('dataTable'));
  assert.equal(doc.getElementById('tableWrap').hidden, false);
  assert.ok(doc.querySelector('#chartWrap svg'));
  assert.ok(doc.querySelector('#sourceBox a[href^="https://"]'));
  assert.equal(doc.getElementById('compareFields').disabled, true);
  for (const id of ['tableToggle', 'downloadCsv']) {
    assert.equal(doc.getElementById(id).hidden, true, `${id} hidden before init`);
    assert.equal(doc.getElementById(id).disabled, true, `${id} disabled before init`);
  }
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
  const doc = dom.window.document;
  const beforeResult = doc.getElementById('resultHeader').innerHTML;
  const beforeChart = doc.getElementById('chartWrap').innerHTML;
  doc.getElementById('selB').focus();
  change(dom, 'selB', 'admin-2004-2014');
  assert.equal(dom.window.document.getElementById('selB').value, 'admin-2014-2024');
  assert.equal(dom.window.location.href, before);
  assert.equal(dom.window.document.getElementById('compareNotice').hidden, false);
  assert.match(dom.window.document.getElementById('compareNotice').textContent, /berbeda/);
  assert.equal(doc.activeElement, doc.getElementById('selB'), 'rejected choice does not steal focus');
  assert.equal(doc.getElementById('resultHeader').innerHTML, beforeResult);
  assert.equal(doc.getElementById('chartWrap').innerHTML, beforeChart);
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
  for (const id of ['tableToggle', 'downloadCsv']) {
    assert.equal(doc.getElementById(id).hidden, true);
    assert.equal(doc.getElementById(id).disabled, true);
  }
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
test('regression: pending indicator blocks CSV including manually dispatched click events', async () => {
  for (const status of ['pending', 'blocked']) {
    const dom = await open('bandingkan', '', { mutate: doc => comparisonFixture(doc, { status }) });
    const doc = dom.window.document, capture = captureCsv(dom.window);
    const download = doc.getElementById('downloadCsv');
    assert.equal(download.hidden, false);
    assert.equal(download.disabled, true);
    assert.match(doc.getElementById('csvNote').textContent, /pemeriksaan metode indikator belum selesai/);
    assert.equal(doc.querySelector('#chartWrap svg'), null);
    assert.match(doc.getElementById('dataTable').textContent, /belum disetujui/);
    download.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true }));
    assert.equal(capture.blobs.length, 0);
    assert.equal(capture.downloads.length, 0);
    assert.match(doc.getElementById('compareNotice').textContent, /CSV tidak tersedia/);
    change(dom, 'selInd', 'gini');
    assert.equal(download.disabled, false, 'eligible selection re-enables CSV');
    change(dom, 'selInd', 'pdb-growth');
    assert.equal(download.disabled, true, 'returning to pending selection blocks CSV again');
    dom.window.close();
  }
});

test('regression: CSV eligibility follows per-period and cross-period version compatibility in both modes', async () => {
  for (const options of [{ mixed: true }, { cross: true }]) {
    const dom = await open('bandingkan', '', { mutate: doc => comparisonFixture(doc, options) });
    const doc = dom.window.document, capture = captureCsv(dom.window);
    for (const mode of ['kalender', 'setara']) {
      setMode(dom, mode);
      assert.equal(doc.getElementById('downloadCsv').disabled, true);
      assert.match(doc.getElementById('csvNote').textContent, options.mixed ? /dalam salah satu periode/ : /kedua periode tidak kompatibel/);
      doc.getElementById('downloadCsv').dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true }));
      assert.doesNotMatch(doc.getElementById('summaries').textContent, /Selisih rata-rata/);
    }
    if (options.mixed) {
      assert.doesNotMatch(doc.querySelector('.period-summary').textContent, /Median/);
      assert.ok(doc.querySelector('polygon[data-method-break="true"]'));
    }
    assert.equal(capture.blobs.length, 0);
    dom.window.close();
  }
});

test('regression: compatible partial CSV is explicitly labelled and exports actual Blob content with NA distinct from zero', async () => {
  const dom = await open('bandingkan', '', { mutate: doc => comparisonFixture(doc, { partial: true }) });
  const doc = dom.window.document, capture = captureCsv(dom.window);
  assert.equal(doc.getElementById('downloadCsv').disabled, false);
  assert.equal(doc.getElementById('downloadCsv').textContent, 'Unduh CSV parsial');
  assert.match(doc.getElementById('csvNote').textContent, /parsial.*NA, bukan nol/);
  doc.getElementById('downloadCsv').click();
  assert.equal(capture.blobs.length, 1);
  assert.match(await capture.text(capture.blobs[0]), /"2006",[^\n]*"NA","%","fixture-v1"/);
  setMode(dom, 'setara');
  doc.getElementById('downloadCsv').click();
  assert.equal(capture.blobs.length, 2);
  const csv = await capture.text(capture.blobs[1]);
  assert.match(csv, /"2","2006","2016","NA","0","%","fixture-v1","fixture-v1"/);
  assert.match(csv, /DRAF PRATINJAU — BELUM AUDIT/);
  assert.match(capture.downloads[1], /setara\.csv$/);
  dom.window.close();
});

test('regression: chartReading resets on indicator, mode, swap and history changes', async () => {
  const dom = await open(); const doc = dom.window.document;
  const reading = doc.getElementById('chartReading');
  const read = () => {
    const point = doc.querySelector('#chartWrap [tabindex][aria-label]');
    point.dispatchEvent(new dom.window.FocusEvent('focusin', { bubbles: true }));
    assert.equal(reading.textContent, point.getAttribute('aria-label'));
  };
  const reset = () => assert.equal(reading.textContent, 'Ketuk atau fokus pada titik untuk membaca nilainya.');
  read(); change(dom, 'selInd', 'gini'); reset();
  read(); setMode(dom, 'setara'); reset();
  read(); doc.getElementById('swapPeriods').click(); reset();
  read();
  await new Promise(resolve => { dom.window.addEventListener('popstate', resolve, { once: true }); dom.window.history.back(); });
  reset(); dom.window.close();
});

test('regression: hash survives initial normalization, indicator, mode, swap and back/forward', async () => {
  const dom = await open('bandingkan', 'indikator=unknown', { hash: '#metode-data' });
  const doc = dom.window.document;
  const hash = () => assert.equal(dom.window.location.hash, '#metode-data');
  hash(); change(dom, 'selInd', 'gini'); hash(); setMode(dom, 'setara'); hash();
  doc.getElementById('swapPeriods').click(); hash();
  const pop = action => new Promise(resolve => { dom.window.addEventListener('popstate', resolve, { once: true }); action(); });
  await pop(() => dom.window.history.back()); hash();
  await pop(() => dom.window.history.forward()); hash();
  dom.window.close();
});

test('regression: render failure keeps last valid result, URL, selection and focus', async () => {
  const dom = await open('bandingkan', '', { mutate: doc => {
    const script = doc.getElementById('compare-data'), data = JSON.parse(script.textContent);
    const item = data.observations.find(observation => observation.indicator_id === 'gini');
    data.observations.push({ ...item, value: 123.456, series_version: 'fixture-duplicate' });
    script.textContent = JSON.stringify(data);
  } });
  const doc = dom.window.document;
  const before = ['resultHeader', 'chartWrap', 'summaries', 'tableWrap', 'sourceBox'].map(id => doc.getElementById(id).innerHTML);
  const href = dom.window.location.href;
  doc.getElementById('selInd').focus(); change(dom, 'selInd', 'gini');
  assert.equal(doc.getElementById('selInd').value, 'pdb-growth');
  assert.equal(doc.activeElement, doc.getElementById('selInd'));
  assert.equal(dom.window.location.href, href);
  assert.deepEqual(['resultHeader', 'chartWrap', 'summaries', 'tableWrap', 'sourceBox'].map(id => doc.getElementById(id).innerHTML), before);
  assert.match(doc.getElementById('compareNotice').textContent, /Hasil pilihan sebelumnya/);
  dom.window.close();
});

test('SSR: indicator pages give an accurate static-table instruction, not an unbound tap promise', async () => {
  const dom = await open('indikator/gini', '', { init: false });
  const doc = dom.window.document;
  assert.match(doc.getElementById('chartReading').textContent, /Seluruh nilai dan tahun asal tercantum pada tabel/);
  assert.doesNotMatch(doc.getElementById('chartReading').textContent, /Ketuk/);
  assert.ok(doc.getElementById('dataTable'));
  assert.equal(doc.getElementById('tableWrap').hidden, false);
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
