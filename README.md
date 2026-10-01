# Pantau Politik

Situs statis Astro dengan arah **Editorial Precision** dari `DESIGN.md`.
Manrope di-host sendiri, warna putih hangat/arang/teal, beranda editorial,
kronologi bersumber, dan pembanding dengan grafik/tabel yang berbagi model perhitungan.

## Pengembangan

```sh
npm ci
npm run dev
```

Pada Android, install dependency di filesystem internal Termux yang mendukung
symlink dan executable. Salinan kerja saat ini:
`/data/data/com.termux/files/usr/tmp/opencode/platform-politik`.
Kode dibawa kembali ke `/storage/emulated/0/Opencode/platform-politik` setelah diverifikasi.

## Build kandidat tanpa mengganggu localhost

```sh
npm run check
npm run build:candidate
npm test
DIST_DIR=dist-candidate npm run test:integration
DIST_DIR=dist-candidate npm run audit:ui
npm run publish:local
npm run sync:workspace
```

`dist-candidate/` tidak menggantikan `dist/` yang sedang disajikan sampai pemeriksaan lulus.
Publikasi lokal memasang aset fingerprint terlebih dahulu, lalu mengganti setiap HTML
secara atomik. Proses server tetap berjalan; versi terdahulu disimpan di `.history/`.
Sinkronisasi membandingkan hash, mencadangkan file yang ditimpa, serta mengarsipkan
duplikasi lama `src/src/` agar tidak ikut diperiksa sebagai kode aktif.

## Localhost

```sh
node scripts/serve.mjs
```

Alamat default `http://127.0.0.1:4321/`. `scripts/keepalive.mjs` menyediakan launcher
background untuk lingkungan Termux ini. Cek server yang sudah aktif sebelum memulai
proses kedua. Server lokal ini dipakai untuk pratinjau.

## Pemeriksaan yang tersedia

- `npm test`: rumus, missing, tahun transisi, query, dan geometri kalender/setara.
- `npm run test:integration`: DOM aktual dari HTML build; pilihan, sumber, history,
  tabel, share/copy, kegagalan data, dan fokus penjelasan istilah.
- `npm run audit:ui`: axe-core pada DOM jsdom, referensi ARIA, ukuran aset awal,
  kebijakan script, font serta angka tabular. Hasil di `.reports/design-audit.json`.
- `scripts/test-e2e.mjs` merupakan nama lama untuk smoke check HTML; bukan pengujian
  browser E2E. Ukuran layar nyata, zoom 200%, TalkBack, dan Web Vitals harus diperiksa
  memakai browser/perangkat. jsdom tidak mempunyai mesin layout.

## Status isi dan rilis

Konten dan 90 slot observasi awal adalah materi kerja yang belum menjalani audit
editorial 100%. Jangan mengartikan status dalam JSON sebagai bukti pemeriksaan manusia.
UI menandai pratinjau; identitas pengelola dan kontak koreksi harus ditetapkan sebelum rilis.
Tanpa `PUBLIC_SITE_URL`, halaman memakai canonical localhost dan noindex.

Sebelum publikasi, jalankan checkpoint editorial, sumber, aksesibilitas manual,
deployment, serta persetujuan pada rencana implementasi. Analitik dan iklan nonaktif.
Upgrade dependency Astro beserta temuan audit paket juga perlu ditinjau untuk rilis;
redesign ini tidak mengubah major version framework.

## Pedoman

- `DESIGN.md`: spesifikasi desain.
- `AGENTS.md`: panduan agent dan skill anti-slop.
- `docs/fonts/README.md`: font dan lisensi.
- `docs/checkpoints/CP-redesign.md`: hasil serta batas pemeriksaan redesign.
