import test from 'node:test';
import assert from 'node:assert/strict';
import { buildChartModel, chartSVG } from '../../src/lib/comparison/chart.mjs';
import { comparisonFor } from '../../src/lib/comparison/compute.mjs';
import { comparisonView, sourceKind } from '../../src/lib/comparison/view.mjs';
import { medianIgnoringNull, extremesByYear } from '../../src/lib/statistics/stats.mjs';
import { relativeID } from '../../src/lib/dates/dates.mjs';

const yearsA = [2005, 2006, 2007], yearsB = [2015, 2016, 2017];
const sumA = { values: [1, null, 3], seriesVersions: ['v1', 'v1', 'v2'] };
const sumB = { values: [4, 5, 6], seriesVersions: ['v1', 'v1', 'v1'] };
const args = { yearsA, sumA, yearsB, sumB, unit: '%', idA: 'A', idB: 'B' };

test('calendar includes every elapsed year: no compression of transition years', () => {
  const model = buildChartModel(args);
  assert.equal(model.labels.length, 13);
  assert.equal(model.labels[9], 2014);
  assert.equal(model.seriesA[1], null);
  assert.equal(model.seriesB[9], null);
  assert.equal(model.seriesB[10], 4);
  assert.equal(model.labels[10] - model.labels[9], model.labels[1] - model.labels[0]);
});
test('equal ranges preserve missing values and unequal coverage', () => {
  const model = buildChartModel({ ...args, yearsB: [2015, 2016], sumB: { values: [4, 5] }, mode: 'setara' });
  assert.deepEqual(model.labels, [1, 2, 3]);
  assert.deepEqual(model.seriesA, [1, null, 3]);
  assert.deepEqual(model.seriesB, [4, 5, null]);
});
test('calendar points use elapsed time while ordinal mode aligns first points', () => {
  const calendar = chartSVG(args);
  const ordinal = chartSVG({ ...args, mode: 'setara' });
  const firstA = svg => Number(svg.match(/<circle cx="([\d.]+)"/)[1]);
  const firstB = svg => Number(svg.match(/<rect x="([\d.]+)"/)[1]) + 4.5;
  assert.ok(firstB(calendar) > firstA(calendar));
  assert.equal(firstA(ordinal), firstB(ordinal));
});
test('missing observations leave a gap; version changes break the line with a marker', () => {
  const missing = chartSVG(args);
  const changed = chartSVG({ ...args, sumA: { values: [1, 2, 3], seriesVersions: ['v1', 'v2', 'v2'] } });
  const solidPaths = svg => [...svg.matchAll(/<path d="([^"]+)" stroke="var\(--color-series-a\)" stroke-width="3" fill="none"[^>]*\/>/g)].map(m => m[1]);
  assert.equal((solidPaths(missing).join(' ').match(/M/g) || []).length, 2);
  assert.equal((solidPaths(changed).join(' ').match(/M/g) || []).length, 2);
  assert.ok(!changed.includes('stroke-dasharray="2 4"'), 'no connector line across version break');
  assert.ok(changed.includes('versi seri berubah'), 'version break carries diamond marker + label');
  assert.ok(!missing.includes('versi seri berubah'), 'missing data stays a plain gap');
});
test('SVG is labelled and escapes untrusted labels', () => {
  const svg = chartSVG({ ...args, idA: '<script>alert(1)</script>', chartId: 'test' });
  assert.match(svg, /aria-labelledby="test-title test-description"/);
  assert.match(svg, /satuan %/);
  assert.ok(svg.includes('&lt;script&gt;'));
  assert.ok(!svg.includes('<script>'));
  assert.ok(chartSVG({ ...args, mode: 'setara' }).includes('bukan tahun tepat sejak pelantikan'));
});
test('transition gap is shaded and labelled; markers are neutral context', () => {
  const svg = chartSVG({ ...args, gapYears: [2014], markers: [{ year: 2006, label: 'Contoh konteks', note: 'Konteks.' }] });
  assert.ok(svg.includes('transisi'), 'gap year shaded and labelled');
  assert.ok(svg.includes('Contoh konteks'), 'context marker rendered');
});
test('zero line is emphasized, end labels identify series, points are focusable', () => {
  const svg = chartSVG({ ...args, sumA: { values: [2, -1, 3] }, sumB: { values: [1, 1, 1] } });
  assert.ok(svg.includes('stroke="var(--color-text)"'), 'zero line treatment');
  assert.ok(svg.includes('2005–07') && svg.includes('2015–17'), 'short range end labels');
  assert.ok(svg.includes('tabindex="0"'), 'points keyboard-focusable with native titles');
});
test('footer carries brand, source count and non-causal caveat for sharing', () => {
  const svg = chartSVG({ ...args, footer: 'Pantau Politik · 2 sumber · angka kondisi, bukan bukti sebab-akibat' });
  assert.ok(svg.includes('bukan bukti sebab-akibat'));
});
test('empty data renders an explanatory state, never NaN coordinates', () => {
  const svg = chartSVG({ ...args, sumA: { values: [null, null, null] }, sumB: { values: [null, null, null] } });
  assert.ok(!svg.includes('NaN'));
  assert.ok(!svg.includes('<path'));
  assert.ok(svg.includes('Belum ada observasi'));
});
test('method changes block combined statistics and unapproved indicators expose no chart values', () => {
  const admins = [{ id: 'a', label: 'A', start_date: '2004-10-20', end_date: '2007-10-20' }, { id: 'b', label: 'B', start_date: '2014-10-20', end_date: '2017-10-20' }];
  const indicator = { id: 'tpt', label: 'TPT', unit: '%', stat_kind: 'endpoint-diff-pp', display_precision: 2, audit_status: 'approved', source_ids: [], definition: 'Test', reference_period: 'Agustus', method_version: 'v1', comparability_notes: 'Test' };
  const observations = [2005, 2006, 2015, 2016].map((year, i) => ({ indicator_id: 'tpt', period_start: `${year}-08-01`, value: 10 - i, series_version: i === 1 ? 'v2' : 'v1' }));
  const comparison = comparisonFor(indicator, admins, observations, 'a', 'b');
  assert.equal(comparison.sumA.stat, null);
  assert.equal(comparison.crossCompatible, false);
  const blocked = comparisonFor({ ...indicator, audit_status: 'blocked' }, admins, observations, 'a', 'b');
  const view = comparisonView(blocked, indicator, [], 'kalender');
  assert.match(view.table, /belum disetujui/);
  assert.doesNotMatch(view.summaries, /10,00/);
});
test('summaries carry median, min/max years and explicit A-vs-B delta', () => {
  const admins = [{ id: 'a', label: 'A', start_date: '2004-10-20', end_date: '2007-10-20' }, { id: 'b', label: 'B', start_date: '2014-10-20', end_date: '2017-10-20' }];
  const indicator = { id: 'pdb-growth', label: 'PDB', unit: '%', stat_kind: 'mean', display_precision: 1, audit_status: 'approved', source_ids: [], definition: 'D', reference_period: 'Tahunan', method_version: 'v1', comparability_notes: 'N' };
  const observations = [2005, 2006, 2015, 2016].map((year, i) => ({ indicator_id: 'pdb-growth', period_start: `${year}-01-01`, value: [5, 7, 4, 6][i], series_version: 'v1' }));
  const comparison = comparisonFor(indicator, admins, observations, 'a', 'b');
  assert.equal(comparison.sumA.stat.median, 6);
  assert.deepEqual([comparison.sumA.minAt.year, comparison.sumA.maxAt.year], [2005, 2006]);
  const view = comparisonView(comparison, indicator, [], 'kalender');
  assert.match(view.summaries, /Median tahunan/);
  assert.match(view.summaries, /2005/);
  assert.match(view.summaries, /Selisih rata-rata/);
  assert.match(view.summaries, /poin|%/);
  assert.match(view.summaries, /Deskriptif/);
});
test('median, extremes and relative time helpers behave', () => {
  assert.equal(medianIgnoringNull([3, 1, 2]), 2);
  assert.equal(medianIgnoringNull([4, 1, 2, 3]), 2.5);
  assert.equal(medianIgnoringNull([null, null]), null);
  assert.deepEqual(extremesByYear([2020, 2021], [5, 5]), { min: { value: 5, year: 2020 }, max: { value: 5, year: 2020 } });
  assert.equal(relativeID('2026-09-27', '2026-09-27'), 'hari ini');
  assert.equal(relativeID('2026-09-26', '2026-09-27'), 'kemarin');
  assert.equal(relativeID('2026-09-20', '2026-09-27'), '7 hari lalu');
  assert.equal(sourceKind('law'), 'Primer');
  assert.equal(sourceKind('statistics'), 'Data/metode resmi');
  assert.equal(sourceKind('statistics-secondary'), 'Pembanding sekunder');
});
