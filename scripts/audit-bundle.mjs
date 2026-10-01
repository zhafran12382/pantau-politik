import { readdir } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';

const dist = new URL('../dist/', import.meta.url).pathname;
if (!existsSync(dist)) { console.error('dist/ belum ada.'); process.exit(1); }
async function jsFiles(dir, out = []) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) await jsFiles(p, out);
    else if (e.name.endsWith('.js')) out.push(p);
  }
  return out;
}
const files = await jsFiles(dist);
let total = 0;
for (const f of files) {
  const buf = readFileSync(f);
  // Hanya hitung JS milik situs (abaikan jika nama berisi chunk vendor eksternal — di MVP ini semua milik situs).
  total += gzipSync(buf).length;
}
console.log(`JS gzip total: ${(total / 1024).toFixed(1)} KB pada ${files.length} berkas. Batas: 150 KB awal per halaman (cek manual per rute).`);
if (total > 300 * 1024) { console.error('Bundel terlalu besar.'); process.exit(1); }
