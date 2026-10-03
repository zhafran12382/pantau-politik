import test from 'node:test';
import assert from 'node:assert/strict';
import { comparisonFor } from '../../src/lib/comparison/compute.mjs';
import { comparisonCsv, csvEligibility } from '../../src/lib/comparison/csv.mjs';

function fixture({ status = 'approved', versions = ['v1', 'v1', 'v1', 'v1', 'v1', 'v1'], values = [10, 8, 6, 5, 0, 3] } = {}) {
  const indicator = { id: 'synthetic', label: 'Fixture sintetis', unit: '%', stat_kind: 'endpoint-diff-pp', audit_status: status, source_ids: ['fixture-source'], method_version: 'fixture-method' };
  const admins = [{ id: 'a', label: 'Fixture "A"', start_date: '2004-10-20', end_date: '2008-10-20' }, { id: 'b', label: 'Fixture B', start_date: '2014-10-20', end_date: '2018-10-20' }];
  const observations = [2005, 2006, 2007, 2015, 2016, 2017].map((year, i) => ({ indicator_id: indicator.id, period_start: `${year}-01-01`, value: values[i], series_version: versions[i] }));
  return { indicator, comparison: comparisonFor(indicator, admins, observations, 'a', 'b') };
}

test('CSV refuses pending/blocked indicators even if observations exist', () => {
  for (const status of ['pending', 'blocked']) {
    const { indicator, comparison } = fixture({ status });
    assert.equal(csvEligibility(comparison, indicator).allowed, false);
    assert.throws(() => comparisonCsv(comparison, indicator), /pemeriksaan metode indikator belum selesai/);
    assert.throws(() => comparisonCsv({ ...comparison, blocked: false }, indicator), /pemeriksaan metode/);
  }
});

test('CSV refuses mixed methods within either period in both modes', () => {
  for (const versions of [['v1', 'v2', 'v1', 'v1', 'v1', 'v1'], ['v1', 'v1', 'v1', 'v1', 'v2', 'v1']]) {
    const { indicator, comparison } = fixture({ versions });
    assert.equal(csvEligibility(comparison, indicator).allowed, false);
    for (const mode of ['kalender', 'setara']) assert.throws(() => comparisonCsv(comparison, indicator, mode), /dalam salah satu periode/);
  }
});

test('CSV refuses cross-period incompatible versions even when each period is internally compatible', () => {
  const { indicator, comparison } = fixture({ versions: ['v1', 'v1', 'v1', 'v2', 'v2', 'v2'] });
  assert.equal(comparison.sumA.compatible, true);
  assert.equal(comparison.sumB.compatible, true);
  assert.equal(csvEligibility(comparison, indicator).allowed, false);
  for (const mode of ['kalender', 'setara']) assert.throws(() => comparisonCsv(comparison, indicator, mode), /kedua periode tidak kompatibel/);
});

test('CSV safely exports explicitly labelled partial compatible series, preserving zero versus NA', () => {
  const { indicator, comparison } = fixture({ values: [10, null, 6, 5, 0, 3] });
  const eligibility = csvEligibility(comparison, indicator);
  assert.equal(eligibility.allowed, true);
  assert.equal(eligibility.partial, true);
  assert.equal(comparison.sumA.stat.diff, null);
  assert.match(eligibility.reason, /parsial.*NA, bukan nol/);
  const calendar = comparisonCsv(comparison, indicator);
  assert.match(calendar, /"2006","Fixture ""A""","NA","%","v1"/);
  assert.match(calendar, /"2016","Fixture B","0","%","v1"/);
  assert.match(calendar, /DRAF PRATINJAU — BELUM AUDIT/);
  assert.match(calendar, /fixture-source/);
  assert.match(calendar, /fixture-method/);
  assert.match(calendar, /bukan bukti sebab-akibat/);
  const equal = comparisonCsv(comparison, indicator, 'setara');
  assert.match(equal, /"2","2006","2016","NA","0","%","v1","v1"/);
});

test('CSV blocks unknown method versions and all-missing data', () => {
  const unknown = fixture({ versions: ['v1', null, 'v1', 'v1', 'v1', 'v1'] });
  assert.equal(unknown.comparison.sumA.compatible, false);
  assert.equal(csvEligibility(unknown.comparison, unknown.indicator).allowed, false);
  const empty = fixture({ values: [null, null, null, null, null, null] });
  assert.equal(csvEligibility(empty.comparison, empty.indicator).allowed, false);
  assert.throws(() => comparisonCsv(empty.comparison, empty.indicator), /belum ada observasi/);
});

test('CSV complete compatible export states coverage, methods and rejects unknown mode', () => {
  const { indicator, comparison } = fixture();
  assert.deepEqual([csvEligibility(comparison, indicator).allowed, csvEligibility(comparison, indicator).partial], [true, false]);
  assert.match(comparisonCsv(comparison, indicator), /"lengkap"/);
  assert.throws(() => comparisonCsv(comparison, indicator, 'unknown'), /Mode CSV tidak dikenali/);
});
