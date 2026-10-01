# Checkpoint redesign Editorial Precision — 27 September 2026

Status: implementasi selesai dan terverifikasi pada kandidat → live lokal.
Server localhost TIDAK di-restart (tetap PID 6612, port 4321).

## Yang diterapkan dari DESIGN.md
- Token terpusat `src/styles/tokens.css`, font Manrope variable Latin self-host
  (OFL-1.1, `public/fonts/OFL-Manrope.txt`), fallback system-ui.
- Header ringkas Pantau/Bandingkan, footer editorial, skip link, `theme-color`.
- Beranda: intro kiri + isu pilihan dominan + 2 isu pendamping bertumpuk,
  pembaruan dari `updated_at`, undangan pembanding tanpa angka dekoratif.
- Halaman isu: urutan PRD, sitasi di dekat klaim (di luar `<details>` tertutup),
  kronologi dengan presisi tanggal, pihak terkait, glossary dengan Escape +
  kembalikan fokus, riwayat koreksi, share dengan fallback manual.
- Pembanding: mode kalender memakai tahun sebenarnya + jeda transisi;
  rentang setara memakai tahun penuh ke-1..dst (bukan sejak pelantikan);
  sumbu Y bersama mencakup nol; seri dibedakan garis/marker/teks;
  garis terputus pada missing/perubahan versi; sumber/definisi/satuan/tabel/
  ringkasan diperbarui bersamaan; periode sama ditolak dengan pesan;
  URL memulihkan state; back/forward sinkron; tabel satu tindakan;
  data rusak → tabel bawaan + kontrol disabled + pesan jujur.
- Halaman indikator memakai panel/grafik/tabel yang sama; halaman
  metode/tentang/editorial/privasi/koreksi/404 memakai layout Prose.
- Kontak koreksi dan identitas pengelola ditulis jujur sebagai
  "belum ditetapkan" — bukan placeholder email/nama.

## Bukti pemeriksaan (kandidat dist-candidate, lalu dipromosikan)
- `astro check` + `tsc --noEmit`: 0 error.
- Validasi konten: 3 isu, 9 peristiwa, 13 sumber. Data: 90 observasi, 5 indikator.
- Unit: 20/20 (rumus, transisi, query, geometri kalender/setara, escaping SVG).
- Integrasi jsdom atas HTML build: 10/10 (5 indikator, URL/share/history,
  tabel, kegagalan data, fokus glossary, proyeksi published).
- `audit-ui`: 16 rute, 0 temuan DOM axe-core (aturan kontras dinonaktifkan
  karena jsdom tanpa mesin layout), JS gzip maks 7,0 KB, aset awal maks
  103 KB, font 24,8 KB, angka tabular + glif punctuation terverifikasi.
- Sitemap 15 rute dengan `lastmod` editorial (bukan waktu build).

## Batas yang belum diperiksa (butuh browser/perangkat nyata)
- Layout visual 360/390/768/1024/1440 px, zoom 200%, TalkBack,
  Web Vitals lapangan, dan audit kontras hasil render.
- Audit editorial 100% terhadap dokumen sumber + studi pengguna (CP11),
  beta + rollback + persetujuan rilis (CP12–CP13) sebelum produksi.

## Keputusan desain yang disengaja
- Manrope (bukan Geist): sesuai DESIGN.md, lisensi OFL terverifikasi,
  angka tabular + diakritik Indonesia diperiksa via fontkit.
- Em-dash dihilangkan dari headline/CTA; panah →/↗ diganti teks
  "Buka/Lihat" + aria-hidden karena glif tidak ada di subset Latin.
- Tanpa `PUBLIC_SITE_URL`: canonical localhost + noindex (pratinjau).
- Tema terang saja; dark mode tidak ditambahkan (di luar MVP).
- `scripts/test-e2e.mjs` adalah smoke check HTML lama, bukan E2E browser —
  dilabeli jujur di README agar tidak disalahartikan.
