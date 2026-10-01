import test from 'node:test';
import assert from 'node:assert/strict';
import { parseDateOnly, daysSinceJakarta, isStale } from '../../src/lib/dates/dates.mjs';

test('U11: tanggal valid & stale 7 hari', () => {
  assert.ok(parseDateOnly('2026-09-25'));
  assert.equal(parseDateOnly('2026-02-30'), null);
  assert.equal(daysSinceJakarta('2026-09-20', '2026-09-27'), 7);
  assert.equal(isStale('2026-09-20', '2026-09-27'), false);
  assert.equal(isStale('2026-09-19', '2026-09-27'), true);
});
