import test from 'node:test';
import assert from 'node:assert/strict';
import { parseComparisonParams } from '../../src/lib/comparison/url.mjs';

const ctx = { adminIds: ['admin-2004-2014', 'admin-2014-2024'], indicatorIds: ['pdb-growth', 'gini'] };

test('U10: query valid lolos', () => {
  const r = parseComparisonParams('a=admin-2004-2014&b=admin-2014-2024&indikator=gini&mode=setara', ctx);
  assert.equal(r.state.indikator, 'gini');
  assert.equal(r.hadInvalid, false);
});
test('U10: periode sama ditolak', () => {
  const r = parseComparisonParams('a=admin-2004-2014&b=admin-2004-2014&indikator=pdb-growth', ctx);
  assert.notEqual(r.state.a, r.state.b);
});
test('U10: indikator tak dikenal fallback', () => {
  const r = parseComparisonParams('a=admin-2004-2014&b=admin-2014-2024&indikator=x', ctx);
  assert.equal(r.state.indikator, 'pdb-growth');
  assert.equal(r.hadInvalid, true);
});
