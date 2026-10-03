import test from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import { initIssueFilter } from '../../src/client/home-filter.mjs';

// Fixture sintetis untuk perilaku UI, bukan fakta atau isi arsip politik.
function fixture(query = '') {
  const dom = new JSDOM(`
    <div id="issueGrid">
      <section class="issue-grid">
        <article class="issue-card" data-issue-id="fixture-a" data-category="Topik A" data-search="xx-001 berkas alfa topik a"></article>
        <div class="supporting-issues"><article class="issue-card" data-issue-id="fixture-b" data-category="Topik B" data-search="xx-002 berkas beta topik b"></article></div>
      </section>
      <div id="issueFilterControls" hidden>
        <input id="issueSearch" disabled />
        <div id="categoryFilters">
          <button data-category="" aria-pressed="true" disabled>Semua</button>
          <button data-category="Topik A" aria-pressed="false" disabled>Topik A</button>
          <button data-category="Topik B" aria-pressed="false" disabled><span>Topik B</span></button>
        </div>
        <button id="resetFilter" disabled hidden>Atur ulang</button>
      </div>
      <p id="filterFallback">Seluruh register ditampilkan.</p>
      <ol>
        <li class="register-entry" data-issue-id="fixture-a" data-category="Topik A" data-search="xx-001 berkas alfa topik a"></li>
        <li class="register-entry" data-issue-id="fixture-b" data-category="Topik B" data-search="xx-002 berkas beta topik b"></li>
        <li class="register-entry" data-issue-id="fixture-c" data-category="Topik B" data-search="xx-003 arsip gamma topik b"></li>
      </ol>
      <p id="resultCount"></p><p id="noResults" hidden>Tidak ada isu yang cocok.</p>
    </div>`, { url: `https://example.test/${query}`, pretendToBeVisual: true });
  return dom;
}
const input = (dom, value) => {
  const control = dom.window.document.getElementById('issueSearch');
  control.value = value;
  control.dispatchEvent(new dom.window.Event('input', { bubbles: true }));
};
const visible = (doc, selector) => [...doc.querySelectorAll(`${selector}:not([hidden])`)].map(item => item.dataset.issueId);

test('home filter: no-JS gate keeps the full register readable, initialization enables controls', () => {
  const dom = fixture(); const doc = dom.window.document;
  assert.equal(doc.getElementById('issueFilterControls').hidden, true);
  assert.equal(doc.getElementById('issueSearch').disabled, true);
  assert.equal(visible(doc, '.register-entry').length, 3);
  assert.equal(initIssueFilter(doc, dom.window), true);
  assert.equal(doc.getElementById('issueFilterControls').hidden, false);
  assert.equal(doc.getElementById('filterFallback').hidden, true);
  assert.equal(doc.getElementById('issueSearch').disabled, false);
  assert.ok([...doc.querySelectorAll('#categoryFilters button')].every(button => !button.disabled));
  assert.equal(doc.getElementById('resultCount').textContent, '3 isu · 2 topik');
  dom.window.close();
});

test('home filter: restore and reset preserve hash, unrelated query and history state', () => {
  const dom = fixture('?cari=%20XX-001%20&topik=Topik+A&keep=1#isu'); const doc = dom.window.document;
  dom.window.history.replaceState({ keep: 'fixture' }, '');
  initIssueFilter(doc, dom.window);
  assert.deepEqual(visible(doc, '.register-entry'), ['fixture-a']);
  assert.deepEqual(visible(doc, '.issue-card'), ['fixture-a']);
  assert.equal(doc.getElementById('resultCount').textContent, '1 dari 3 isu');
  assert.equal(dom.window.location.hash, '#isu');
  assert.equal(new URL(dom.window.location.href).searchParams.get('keep'), '1');
  assert.equal(new URL(dom.window.location.href).searchParams.get('cari'), 'XX-001');
  assert.deepEqual(dom.window.history.state, { keep: 'fixture' });
  doc.getElementById('resetFilter').click();
  assert.equal(dom.window.location.href, 'https://example.test/?keep=1#isu');
  assert.equal(doc.activeElement, doc.getElementById('issueSearch'));
  assert.equal(doc.getElementById('resetFilter').hidden, true);
  assert.equal(visible(doc, '.register-entry').length, 3);
  dom.window.close();
});

test('home filter: real index and editorial cards share search/category state without double counts', () => {
  const dom = fixture(); const doc = dom.window.document;
  initIssueFilter(doc, dom.window);
  input(dom, '  BeTa  ');
  assert.deepEqual(visible(doc, '.register-entry'), ['fixture-b']);
  assert.deepEqual(visible(doc, '.issue-card'), ['fixture-b']);
  doc.querySelector('#categoryFilters button[data-category="Topik A"]').click();
  assert.equal(doc.getElementById('noResults').hidden, false);
  assert.equal(doc.querySelector('.issue-grid').hidden, true);
  assert.equal(doc.getElementById('resultCount').textContent, '0 dari 3 isu');
  input(dom, '');
  assert.deepEqual(visible(doc, '.register-entry'), ['fixture-a']);
  assert.equal(doc.querySelector('.issue-grid').hidden, false);
  assert.equal(doc.querySelector('.supporting-issues').hidden, true);
  assert.equal(doc.querySelector('#categoryFilters button[data-category="Topik A"]').getAttribute('aria-pressed'), 'true');
  dom.window.close();
});

test('home filter: an indexed archive not present in editorial cards remains searchable', () => {
  const dom = fixture(); const doc = dom.window.document;
  initIssueFilter(doc, dom.window); input(dom, 'XX-003');
  assert.deepEqual(visible(doc, '.register-entry'), ['fixture-c']);
  assert.equal(visible(doc, '.issue-card').length, 0);
  assert.equal(doc.getElementById('noResults').hidden, true);
  assert.equal(doc.querySelector('.issue-grid').hidden, true);
  assert.equal(doc.getElementById('resultCount').textContent, '1 dari 3 isu');
  dom.window.close();
});

test('home filter: unknown or selector-like topics normalize safely without CSS.escape', () => {
  const dom = fixture('?topik=%22%5D%23unknown&keep=1#isu'); const doc = dom.window.document;
  assert.doesNotThrow(() => initIssueFilter(doc, dom.window));
  assert.equal(visible(doc, '.register-entry').length, 3);
  assert.equal(new URL(dom.window.location.href).searchParams.has('topik'), false);
  assert.equal(dom.window.location.hash, '#isu');
  doc.querySelector('#categoryFilters button[data-category="Topik B"] span').click();
  assert.equal(doc.getElementById('resultCount').textContent, '2 dari 3 isu');
  assert.equal(new URL(dom.window.location.href).searchParams.get('topik'), 'Topik B');
  dom.window.close();
});

test('home filter: empty state resets search and category with input focus restored', () => {
  const dom = fixture(); const doc = dom.window.document;
  initIssueFilter(doc, dom.window);
  doc.querySelector('#categoryFilters button[data-category="Topik B"]').click(); input(dom, 'tidak-ada');
  assert.equal(doc.getElementById('noResults').hidden, false);
  assert.equal(doc.getElementById('resetFilter').hidden, false);
  doc.getElementById('resetFilter').click();
  assert.equal(doc.getElementById('noResults').hidden, true);
  assert.equal(doc.querySelector('#categoryFilters button[data-category=""]').getAttribute('aria-pressed'), 'true');
  assert.equal(doc.activeElement, doc.getElementById('issueSearch'));
  dom.window.close();
});

test('home filter: popstate restores both index and cards without writing history', () => {
  const dom = fixture(); const doc = dom.window.document;
  initIssueFilter(doc, dom.window); input(dom, 'alfa');
  dom.window.history.pushState({ fixture: true }, '', '?cari=gamma#isu');
  let writes = 0;
  const replace = dom.window.history.replaceState.bind(dom.window.history);
  dom.window.history.replaceState = (...args) => { writes++; return replace(...args); };
  dom.window.dispatchEvent(new dom.window.PopStateEvent('popstate'));
  assert.equal(doc.getElementById('issueSearch').value, 'gamma');
  assert.deepEqual(visible(doc, '.register-entry'), ['fixture-c']);
  assert.equal(writes, 0);
  assert.equal(dom.window.location.hash, '#isu');
  dom.window.close();
});

test('home filter: incomplete DOM keeps the no-JS fallback and disabled controls intact', () => {
  const dom = fixture(); const doc = dom.window.document;
  doc.getElementById('noResults').remove();
  assert.equal(initIssueFilter(doc, dom.window), false);
  assert.equal(doc.getElementById('issueFilterControls').hidden, true);
  assert.equal(doc.getElementById('issueSearch').disabled, true);
  assert.equal(doc.getElementById('filterFallback').hidden, false);
  assert.equal(visible(doc, '.register-entry').length, 3);
  dom.window.close();
});

test('home filter: repeated initialization does not add event handlers', () => {
  const dom = fixture();
  initIssueFilter(dom.window.document, dom.window);
  assert.equal(initIssueFilter(dom.window.document, dom.window), true);
  let writes = 0;
  const replace = dom.window.history.replaceState.bind(dom.window.history);
  dom.window.history.replaceState = (...args) => { writes++; return replace(...args); };
  input(dom, 'alfa');
  assert.equal(writes, 1);
  dom.window.close();
});
