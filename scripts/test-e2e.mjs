// Legacy script name: HTML smoke checks only, not browser end-to-end coverage.
import { readFile } from 'node:fs/promises';
async function mustContain(file, needle, label) {
  const txt = await readFile(new URL(file, import.meta.url), 'utf-8');
  if (!txt.includes(needle)) { console.error(`E2E GAGAL ${label}: tidak menemukan ${needle} pada ${file}`); process.exit(1); }
  console.log(`ok ${label}`);
}
await mustContain('../dist/index.html', '/isu/subsidi-energi-apbn/', 'E01 kartu->isu');
await mustContain('../dist/isu/subsidi-energi-apbn/index.html', 'Badan Pusat Statistik', 'E01 sumber isu');
await mustContain('../dist/bandingkan/index.html', 'id="dataTable"', 'E04 tabel bawaan tanpa-JS');
await mustContain('../dist/bandingkan/index.html', 'rel="canonical"', 'I06 canonical');
console.log('HTML smoke checks lulus. Pemeriksaan ini tidak menjalankan browser atau interaksi pengguna.');
