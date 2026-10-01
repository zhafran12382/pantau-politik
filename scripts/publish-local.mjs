// Promote a tested candidate without stopping the existing static-server process.
// Fingerprinted assets are copied first; each HTML file is atomically replaced last.
import { access, mkdir, readFile, readdir, rename, writeFile, copyFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
const root = path.resolve(new URL('..', import.meta.url).pathname);
const candidate = path.join(root, 'dist-candidate'), live = path.join(root, 'dist');
const stamp = new Date().toISOString().replaceAll(':', '-');
const backup = path.join(root, '.history', `before-${stamp}`);
async function walk(directory, prefix = '') {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const relative = path.join(prefix, entry.name);
    if (entry.isDirectory()) files.push(...await walk(path.join(directory, entry.name), relative)); else files.push(relative);
  }
  return files;
}
const audit = JSON.parse(await readFile(path.join(root, '.reports/design-audit.json'), 'utf8'));
if (audit.pages.length !== 17 || audit.pages.some(page => page.violations.length)) throw new Error('Candidate audit has not passed');
const files = await walk(candidate);
for (const route of ['index.html', 'bandingkan/index.html', 'sitemap.xml']) await access(path.join(candidate, route));
// The report records exact candidate checksums; fail if anything was edited afterward.
if (!audit.artifactHashes) throw new Error('Missing candidate checksum report');
for (const [relative, expected] of Object.entries(audit.artifactHashes)) {
  const actual = createHash('sha256').update(await readFile(path.join(candidate, relative))).digest('hex');
  if (actual !== expected) throw new Error(`Candidate changed after audit: ${relative}`);
}
files.sort((a, b) => Number(a.endsWith('.html')) - Number(b.endsWith('.html')) || (a === 'index.html' ? 1 : b === 'index.html' ? -1 : a.localeCompare(b)));
for (const relative of files) {
  const destination = path.join(live, relative);
  if (await access(destination).then(() => true, () => false)) {
    const archived = path.join(backup, relative);
    await mkdir(path.dirname(archived), { recursive: true });
    await copyFile(destination, archived);
  }
  await mkdir(path.dirname(destination), { recursive: true });
  const temp = `${destination}.pending-${process.pid}`;
  await writeFile(temp, await readFile(path.join(candidate, relative)));
  await rename(temp, destination);
}
console.log(`Promoted ${files.length} files; the localhost process remains running. Previous files: ${backup}`);
