// Copy reviewed source files back to the Android shared workspace, preserving prior versions.
import { access, readFile, readdir, copyFile, mkdir, rename, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
const source = path.resolve(new URL('..', import.meta.url).pathname);
const destination = '/storage/emulated/0/Opencode/platform-politik';
if (source === destination) throw new Error('Run this from the internal Termux build copy');
await access(path.join(destination, 'DESIGN.md'));
const stamp = new Date().toISOString().replaceAll(':', '-');
const archive = path.join(destination, '.history', `before-redesign-${stamp}`);
const roots = ['src', 'public', 'content', 'scripts', 'tests', 'docs'];
const singleFiles = ['package.json', 'package-lock.json', 'astro.config.mjs', 'tsconfig.json', 'README.md', '.gitignore'];
const files = [...singleFiles];
async function walk(directory, prefix = '') {
  const found = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const relative = path.join(prefix, entry.name);
    if (entry.isDirectory()) found.push(...await walk(path.join(directory, entry.name), relative)); else found.push(relative);
  }
  return found;
}
for (const folder of roots) files.push(...(await walk(path.join(source, folder))).map(file => path.join(folder, file)));
const nested = path.join(destination, 'src/src');
let archivedNested = [];
if (await access(nested).then(() => true, () => false)) {
  archivedNested = await walk(nested);
  await mkdir(archive, { recursive: true });
  await rename(nested, path.join(archive, 'nested-src'));
}
let count = 0;
for (const relative of files) {
  const input = path.join(source, relative), output = path.join(destination, relative);
  const content = await readFile(input);
  const previous = await readFile(output).catch(() => null);
  if (previous?.equals(content)) continue;
  if (previous) {
    const saved = path.join(archive, relative);
    await mkdir(path.dirname(saved), { recursive: true });
    await writeFile(saved, previous);
  }
  await mkdir(path.dirname(output), { recursive: true });
  await writeFile(output, content);
  count++;
}
const hashes = {};
for (const relative of files) {
  const sourceHash = createHash('sha256').update(await readFile(path.join(source, relative))).digest('hex');
  const targetHash = createHash('sha256').update(await readFile(path.join(destination, relative))).digest('hex');
  if (sourceHash !== targetHash) throw new Error(`Source sync mismatch: ${relative}`);
  hashes[relative] = targetHash;
}
// Shared-storage dist is a copy of the tested candidate; live localhost serves the internal dist.
for (const relative of await walk(path.join(source, 'dist-candidate'))) {
  const target = path.join(destination, 'dist', relative);
  await mkdir(path.dirname(target), { recursive: true });
  await copyFile(path.join(source, 'dist-candidate', relative), target);
}
await mkdir(path.join(destination, '.reports'), { recursive: true });
await copyFile(path.join(source, '.reports/design-audit.json'), path.join(destination, '.reports/design-audit.json'));
await writeFile(path.join(destination, '.reports/source-sync.json'), JSON.stringify({ syncedAt: new Date().toISOString(), changed: count, archivedNested, archive, hashes }, null, 2) + '\n');
console.log(`Synced ${count} changed source files; verified ${files.length} hashes; preserved ${archivedNested.length} nested-source files in ${archive}.`);
