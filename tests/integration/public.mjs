import test from 'node:test';
import assert from 'node:assert/strict';
import { loadAllContent, projectPublic } from '../../src/lib/content/loader.mjs';

test('I02: hanya published yang diproyeksikan', async () => {
  const data = await loadAllContent();
  const pub = projectPublic(data);
  assert.ok(pub.issues.length >= 3);
  assert.ok(pub.issues.every((i) => i.publication_status === 'published'));
});
