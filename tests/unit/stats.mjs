import test from 'node:test';
import assert from 'node:assert/strict';
import { meanIgnoringNull, endpointDiff, fullCalendarYears, formatID, summarizeSeries } from '../../src/lib/statistics/stats.mjs';

test('U01: 10 -> 8 = -2 poin persentase', () => {
  assert.equal(endpointDiff(10, 8), -2);
});
test('U02: gini 0.40 -> 0.38 = -0.02', () => {
  assert.ok(Math.abs(endpointDiff(0.40, 0.38) - (-0.02)) < Number.EPSILON);
});
test('U03: mean [2,null,4] = 3, n=2', () => {
  const r = meanIgnoringNull([2, null, 4]);
  assert.equal(r.mean, 3);
  assert.equal(r.n, 2);
});
test('U04: nol dihitung, missing tidak', () => {
  const r = meanIgnoringNull([0, null]);
  assert.equal(r.mean, 0);
  assert.equal(endpointDiff(null, 5), null);
});
test('U05: tahun transisi dikecualikan', () => {
  const y = fullCalendarYears('2004-10-20', '2014-10-20');
  assert.deepEqual(y, [2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013]);
  const y2 = fullCalendarYears('2014-10-20', '2024-10-20');
  assert.deepEqual(y2, [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023]);
});
test('U06: seluruh missing -> null', () => {
  const m = new Map();
  const s = summarizeSeries([2005, 2006], m, 'mean', 2);
  assert.equal(s.stat, null);
});
test('U07: batas awal missing tidak digeser', () => {
  const m = new Map([[2006, 5]]);
  const s = summarizeSeries([2005, 2006], m, 'endpoint-diff-pp', 2);
  assert.equal(s.stat.diff, null);
  assert.equal(s.stat.blocked, true);
});
test('U09: format Indonesia + negatif nol', () => {
  assert.equal(formatID(-0.001, 2), '0,00');
  assert.equal(formatID(5.6, 1), '5,6');
});
test('interior missing blocks endpoint change even with both endpoints present', () => {
  const s = summarizeSeries([2005, 2006, 2007], new Map([[2005, 10], [2007, 8]]), 'endpoint-diff-pp');
  assert.equal(s.complete, false);
  assert.equal(s.stat.diff, null);
  assert.equal(s.stat.blocked, true);
});
