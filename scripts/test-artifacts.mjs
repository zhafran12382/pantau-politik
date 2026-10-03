import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const DIST = path.resolve(process.env.DIST_DIR || 'dist');
async function* walk(dir) {
  const ents = await readdir(dir, { withFileTypes: true });
  for (const e of ents) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else yield p;
  }
}
const forbidden = ['__DRAFT__', 'SYNTHETIC-TEST-MARKER', 'redaksi-internal', 'TODO-EDITORIAL'];
let files = 0;
try {
  for await (const f of walk(DIST)) {
    files++;
    if (/\.(html|js|json|xml|txt)$/.test(f)) {
      const txt = await readFile(f, 'utf-8').catch(() => '');
      for (const pat of forbidden) {
        if (txt.includes(pat)) { console.error(`Kebocoran artefak: ${f} mengandung ${pat}`); process.exit(1); }
      }
    }
  }
} catch (e) {
  console.error(`Artefak ${DIST} belum tersedia atau tidak dapat dibaca. Build kandidat yang sama dahulu.`, e.message);
  process.exit(1);
}
console.log(`Artefak diperiksa: ${files} berkas, tanpa penanda draf/internal.`);
