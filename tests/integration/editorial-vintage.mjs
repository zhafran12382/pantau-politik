import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { JSDOM } from 'jsdom';
import { initIssueFilter } from '../../src/client/home-filter.mjs';

const dist = path.resolve(process.env.DIST_DIR || 'dist');
const json = async file => JSON.parse(await readFile(new URL(`../../content/${file}`, import.meta.url), 'utf8'));
const [issues, order, codes, events, corrections, sources] = await Promise.all([
  json('issues/issues.json'), json('editorial-order.json'), json('register-map.json'),
  json('events/events.json'), json('corrections/corrections.json'), json('sources/sources.json'),
]);
const published = issues.filter(issue => issue.publication_status === 'published');
const sourceIdsFor = issue => [...new Set([
  ...issue.source_ids, ...issue.impact.flatMap(impact => impact.source_ids),
  ...events.filter(event => event.issue_id === issue.id).flatMap(event => event.source_ids),
  ...corrections.filter(change => change.affected_ids.includes(issue.id)).flatMap(change => change.source_ids),
])];
async function open(route = '', suffix = '') {
  const html = await readFile(path.join(dist, route, 'index.html'), 'utf8');
  return new JSDOM(html, { url: `https://example.test/${route ? `${route}/` : ''}${suffix}`, pretendToBeVisual: true });
}
const normalized = text => text.trim().replace(/\s+/g, ' ');

// Dapat dijalankan sebelum build; tes DOM di bawah wajib memakai artefak kandidat baru.
test('source contract: home drops independent sparklines and issue page drops inferred actor relations', async () => {
  const [home, issue, card] = await Promise.all([
    readFile(new URL('../../src/pages/index.astro', import.meta.url), 'utf8'),
    readFile(new URL('../../src/pages/isu/[slug].astro', import.meta.url), 'utf8'),
    readFile(new URL('../../src/components/issues/IssueRegisterEntry.astro', import.meta.url), 'utf8'),
  ]);
  assert.doesNotMatch(home, /issueFigure|previewAnchorChart|hero-anchor|PP-REG\/001/);
  assert.doesNotMatch(card, /polyline|issue-card__spark|interface Figure/);
  assert.doesNotMatch(issue, /actors\.filter|actors\.json|involved\.flatMap/);
  assert.match(issue, /id="dampak"/);
  assert.match(issue, /id="bukti"/);
  assert.match(home, /<IssueIndexEntry /);
});

test('source contract: filter URL preserves hash and has no browser-global CSS.escape dependency', async () => {
  const filter = await readFile(new URL('../../src/client/home-filter.mjs', import.meta.url), 'utf8');
  assert.match(filter, /url\.hash/);
  assert.doesNotMatch(filter, /CSS\.escape/);
});

test('vintage SSR: one editorial lead and a complete filing index use the actual register map', async () => {
  const dom = await open(); const doc = dom.window.document;
  const featured = doc.querySelector('.issue-card--featured');
  assert.equal(doc.querySelectorAll('.issue-card--featured').length, 1);
  assert.equal(featured.dataset.issueId, order.featured_issue_id);
  assert.equal(normalized(featured.querySelector('.filing-tab').textContent), `BERKAS ${codes[order.featured_issue_id]}`);
  assert.ok(featured.classList.contains('dossier-frame'));
  assert.ok(doc.querySelector('.supporting-issues .issue-card'));
  assert.equal(doc.querySelector('.home-intro figure, .home-intro svg'), null);
  assert.equal(doc.querySelector('.issue-card__spark'), null);
  const entries = [...doc.querySelectorAll('.register-entry')];
  assert.equal(entries.length, published.length);
  assert.deepEqual(entries.map(entry => entry.dataset.issueId).sort(), published.map(issue => issue.id).sort());
  for (const entry of entries) {
    const issue = published.find(item => item.id === entry.dataset.issueId);
    assert.equal(entry.querySelector('.register-entry__code').textContent, codes[issue.id]);
    assert.equal(entry.querySelector('h3 a').textContent, issue.title);
    assert.equal(entry.querySelector('h3 a').getAttribute('href'), `/isu/${issue.slug}/`);
    const sourceLink = entry.querySelector('.register-entry__meta a');
    assert.equal(sourceLink.getAttribute('href'), `/isu/${issue.slug}/#sumber`);
    assert.ok(sourceLink.textContent.startsWith(`${sourceIdsFor(issue).length} sumber`));
  }
  assert.equal([...featured.querySelectorAll('a')].filter(link => link.getAttribute('href').endsWith('#sumber')).length, 1);
  assert.equal([...featured.querySelectorAll('a')].some(link => /Jejak bukti/i.test(link.textContent)), false);
  dom.window.close();
});

test('vintage SSR: hidden disabled search controls do not present dead no-JS interactions', async () => {
  const dom = await open(); const doc = dom.window.document;
  assert.equal(doc.getElementById('issueFilterControls').hidden, true);
  assert.equal(doc.getElementById('issueSearch').disabled, true);
  assert.ok([...doc.querySelectorAll('#categoryFilters button, #resetFilter')].every(button => button.disabled));
  assert.equal(doc.getElementById('filterFallback').hidden, false);
  assert.equal(doc.querySelectorAll('.register-entry[hidden], .issue-card[hidden]').length, 0);
  for (const link of doc.querySelectorAll('.issue-card a[href$="#sumber"], .register-entry a[href$="#sumber"]')) {
    const route = new URL(link.href).pathname.slice(1, -1);
    const issueDom = await open(route);
    assert.ok(issueDom.window.document.getElementById('sumber'), `${route} has the source destination`);
    issueDom.window.close();
  }
  dom.window.close();
});

test('vintage runtime: actual index, editorial cards, query, empty state and reset remain synchronized', async () => {
  const issue = published[0]; const code = codes[issue.id];
  const dom = await open('', `?cari=${encodeURIComponent(code)}&keep=1#isu`); const doc = dom.window.document;
  initIssueFilter(doc, dom.window);
  assert.equal(doc.getElementById('issueFilterControls').hidden, false);
  assert.equal(doc.getElementById('filterFallback').hidden, true);
  assert.equal(doc.querySelectorAll('.register-entry:not([hidden])').length, 1);
  assert.equal(doc.querySelector('.register-entry:not([hidden])').dataset.issueId, issue.id);
  assert.equal(doc.querySelector('.issue-card:not([hidden])').dataset.issueId, issue.id);
  assert.equal(dom.window.location.hash, '#isu');
  assert.equal(doc.getElementById('resultCount').textContent, `1 dari ${published.length} isu`);
  const input = doc.getElementById('issueSearch'); input.value = 'fixture-no-match';
  input.dispatchEvent(new dom.window.Event('input', { bubbles: true }));
  assert.equal(doc.getElementById('noResults').hidden, false);
  assert.equal(doc.querySelector('.issue-grid').hidden, true);
  doc.getElementById('resetFilter').click();
  assert.equal(doc.querySelectorAll('.register-entry:not([hidden])').length, published.length);
  assert.equal(doc.getElementById('noResults').hidden, true);
  assert.equal(doc.activeElement, input);
  assert.equal(dom.window.location.href, 'https://example.test/?keep=1#isu');
  dom.window.close();
});

test('vintage issue: TOC precedes the body and each impact appears once with sources and projection intact', async () => {
  for (const issue of published) {
    const dom = await open(`isu/${issue.slug}`); const doc = dom.window.document;
    assert.equal(doc.querySelector('.article-header .lead').textContent, issue.summary);
    assert.equal(normalized(doc.querySelector('.article-header .filing-tab').textContent), `BERKAS ${codes[issue.id]}`);
    const body = doc.querySelector('.article-body'); const toc = doc.querySelector('nav.toc');
    assert.ok(toc.compareDocumentPosition(body) & dom.window.Node.DOCUMENT_POSITION_FOLLOWING);
    for (const link of toc.querySelectorAll('a')) assert.ok(doc.querySelector(link.getAttribute('href')));
    assert.ok(doc.getElementById('dampak')); assert.ok(doc.getElementById('bukti'));
    assert.equal(doc.getElementById('pihak'), null);
    const evidence = [...doc.querySelectorAll('.evidence-card')];
    assert.equal(evidence.length, issue.impact.length);
    for (const [index, impact] of issue.impact.entries()) {
      const card = evidence[index];
      assert.equal(card.querySelector('h3').textContent, impact.group);
      assert.equal(card.querySelector('.evidence-claim').textContent, impact.text);
      assert.equal(body.textContent.split(impact.text).length - 1, 1);
      assert.equal(Boolean(card.querySelector('.projection')), impact.is_projection);
      assert.deepEqual([...card.querySelectorAll('.citations li')].map(item => item.dataset.sourceId), [...new Set(impact.source_ids)]);
    }
    assert.ok(doc.querySelector('.article-meta time[datetime]').getAttribute('datetime') === issue.last_checked_at);
    assert.ok(doc.querySelector(`.article-meta time[datetime="${issue.published_at}"]`));
    assert.ok(doc.querySelector(`.article-meta time[datetime="${issue.updated_at}"]`));
    assert.match(doc.querySelector('.article-meta').textContent, /tanggal naskah/);
    dom.window.close();
  }
});

test('vintage sources: cited evidence stays outside details and source files retain exact dates/locators', async () => {
  for (const issue of published) {
    const dom = await open(`isu/${issue.slug}`); const doc = dom.window.document;
    const records = [...doc.querySelectorAll('.source-record')];
    assert.deepEqual(records.map(record => record.id), sourceIdsFor(issue));
    for (const record of records) {
      const source = sources.find(item => item.id === record.id);
      assert.ok(record.querySelector('.source-filehead .source-kind'));
      assert.equal(record.querySelector('h3 a').getAttribute('href'), new URL(source.url).href);
      assert.equal(normalized(record.querySelector('h3 a').textContent).replace(/ ↗$/, ''), source.title);
      assert.ok(record.textContent.includes(source.publisher));
      assert.ok(record.textContent.includes(source.locator));
      assert.ok(record.querySelector(`time[datetime="${source.accessed_at}"]`));
      if (source.published_at) assert.ok(record.querySelector(`time[datetime="${source.published_at}"]`));
      else assert.match(record.textContent, /Tanggal rilis tidak tercatat/);
      assert.equal(record.closest('details'), null);
    }
    for (const citations of doc.querySelectorAll('.citations')) assert.equal(citations.closest('details'), null);
    const timeline = events.filter(event => event.issue_id === issue.id).sort((a, b) => b.occurred_at.localeCompare(a.occurred_at));
    const rows = [...doc.querySelectorAll('.timeline > li')];
    assert.equal(rows.length, timeline.length);
    for (const [index, event] of timeline.entries()) {
      assert.equal(rows[index].querySelector('.timeline__body > p').textContent, event.description);
      assert.deepEqual([...rows[index].querySelectorAll('.citations li')].map(item => item.dataset.sourceId), [...new Set(event.source_ids)]);
    }
    dom.window.close();
  }
});

test('vintage honesty: only approved horizontal stamp text appears on homepage and issue routes', async () => {
  const allowed = new Set(['ARSIP PUBLIK', 'DRAF PRATINJAU — BELUM AUDIT', 'KOREKSI TERCATAT']);
  for (const route of ['', ...published.map(issue => `isu/${issue.slug}`)]) {
    const dom = await open(route); const doc = dom.window.document;
    const stamps = [...doc.querySelectorAll('.stamp')];
    assert.ok(stamps.length > 0);
    for (const stamp of stamps) {
      assert.ok(allowed.has(normalized(stamp.textContent).toUpperCase()), stamp.textContent);
      assert.equal(stamp.getAttribute('style'), null);
    }
    assert.doesNotMatch(doc.body.textContent, /TOP SECRET|RAHASIA NEGARA|TERVERIFIKASI/);
    assert.equal(doc.querySelector('[class*="watermark"], [class*="redaction"]'), null);
    dom.window.close();
  }
});
