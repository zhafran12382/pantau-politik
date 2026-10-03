// Legacy script name: HTML smoke checks only, not browser end-to-end coverage.
import { readFile } from 'node:fs/promises';
import path from 'node:path';
const dist = path.resolve(process.env.DIST_DIR || 'dist');
async function mustContain(file, needle, label) {
  const txt = await readFile(path.join(dist, file), 'utf-8');
  if (!txt.includes(needle)) { console.error(`HTML SMOKE GAGAL ${label}: tidak menemukan ${needle} pada ${file}`); process.exit(1); }
  console.log(`ok ${label}`);
}
await mustContain('index.html', '/isu/subsidi-energi-apbn/', 'E01 register->isu');
await mustContain('isu/subsidi-energi-apbn/index.html', 'Badan Pusat Statistik', 'E01 sumber isu');
await mustContain('bandingkan/index.html', 'id="dataTable"', 'E04 tabel bawaan tanpa-JS');
await mustContain('bandingkan/index.html', 'rel="canonical"', 'I06 canonical');
console.log(`HTML smoke checks lulus pada ${dist}. Pemeriksaan ini tidak menjalankan browser atau interaksi pengguna.`);
