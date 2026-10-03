# CP19: implementasi Dossier Vintage dan QA kandidat

Tanggal verifikasi: 2 Oktober 2026. Checkout: `/data/data/com.termux/files/home/pantau-politik`, baseline Git `d5785c8271bec375722b73ed693186aea84d3a1a`. Pemilik meminta implementasi referensi v2 yang tercatat di CP18. Tidak ada commit, push, publikasi atau sinkronisasi ke salinan workspace lain.

## Yang benar-benar diubah

- Token dan global CSS dikonsolidasikan: palet arsip existing, radius dua px, type/spacing scale, grain hanya pada kertas, bidang baca/plot solid, filing tab dan frame bermakna, satu offset pada dossier unggulan. Header/toolbar tidak menumpuk sebagai sticky overlays.
- Masthead berupa wordmark serif, strip tinta dan dateline build yang tidak menyamar sebagai tanggal pemeriksaan isi. Favicon/manifest selaras dengan palet. Tidak menambah font display/aset gambar untuk dekorasi.
- Beranda: satu dossier unggulan, dua kliping pendamping, register publik yang lengkap, search/filter yang sinkron dengan kartu dan indeks, sources/metadata nyata. Kontrol disembunyikan dan disabled sampai JS siap. Sparkline independen yang memadatkan missing/tahun dihapus.
- Isu: rail/TOC sebelum body pada urutan DOM, dampak+bukti tampil sekali tanpa kehilangan proyeksi/sitasi, sumber berbingkai filing, koreksi/jalur berbagi tetap tersedia. Aktor tidak lagi disimpulkan hanya dari kesamaan sumber.
- Pembanding/indikator: exhibit dengan body padding yang benar, plot bersih, causal caveat bukan cap baru, tabel dan grafik menjadi region berlabel yang keyboard-reachable, SVG minimal 300/640 unit untuk baseline compact/wide. Header data/source/code ikut berubah bersama pilihan.
- CSV: pending/blocked, versi campur/unknown dan perbandingan lintas metode ditolak. CSV parsial kompatibel diberi label, mempertahankan NA berbeda dari nol dan menyertakan catatan pratinjau/metode.
- Median lintas metode inkompatibel diblokir, chartReading direset setelah perubahan, URL hash dipertahankan, marker perubahan versi benar-benar berlian fokusable. Preview unapproved tidak menampilkan grafik/angka.
- Jenis source statistik memakai label Data/metode statistik, bukan cap otoritas. Cap hanya whitelist CP16; wording literal cap tidak diambil dari OCR gambar.
- Audit aset kini mengikuti static/dynamic imported chunks, CSS/import/font, favicon dan manifest, satu kali per halaman. Skrip artifact/smoke/bundle memakai DIST_DIR kandidat yang sama. Lisensi Source Serif 4 dicantumkan.

`content/`, `package.json`, `package-lock.json` dan `astro.config.mjs` tidak diubah. Tidak memutakhirkan angka, tanggal, sources, flag audit atau dependensi agar UI terlihat lebih meyakinkan.

## Eksekusi yang diverifikasi

Pipeline kandidat final, exit 0:

```sh
npm run check
npm run build:candidate
npm test
DIST_DIR=dist-candidate npm run test:integration
DIST_DIR=dist-candidate npm run audit:ui
DIST_DIR=dist-candidate npm run test:artifacts
DIST_DIR=dist-candidate npm run test:e2e
DIST_DIR=dist-candidate npm run audit:bundle
```

- Astro/TypeScript: **0 error, 0 warning, 0 hint**.
- Build: **17 HTML pages**, sitemap **15 routes**.
- Unit: **53/53 lulus**.
- Integrasi: **35/35 lulus**, termasuk empat tes yang mengeksekusi bundle JavaScript hasil build di DOM jsdom, bukan hanya mengimpor modul source.
- Audit WCAG struktural/jsdom: **0 violations pada 17 halaman**; aturan kontras rendered dinonaktifkan dan incomplete rules tetap tercatat.
- JS awal maksimum: **10.39 KiB gzip (10635 byte)**, termasuk imported chunks; batas 150 KiB.
- Aset awal maksimum: **159.75 KiB (163582 byte)**; batas 1 MiB. Font awal **46368 byte**; budget 60 KiB.
- Pemindaian artefak: **31 berkas**, tanpa penanda internal/sintetis yang dilarang.
- `git diff --check` lulus; diff dataset dan manifest dependency kosong.

## Pratinjau lokal yang benar-benar berjalan

Command:

```sh
BUILD_CANDIDATE=1 npm run preview -- --host 127.0.0.1 --port 4321
```

URL lokal: **http://127.0.0.1:4321/**. Proses background pratinjau `proc_a243e11eaaf3` melayani `dist-candidate`, bukan promosi `dist` atau deployment publik.

HTTP read-back memverifikasi SHA-256 **30 berkas yang disajikan**, termasuk seluruh halaman/aset, cocok laporan audit kandidat. `_headers` adalah konfigurasi hosting yang tidak disajikan Astro preview; tidak dihitung sebagai hasil fetch yang cocok. Rute tidak ada menghasilkan HTTP **404**.

Bukti lokal yang diabaikan Git:
- `.reports/dossier-vintage-verification.log`
- `.reports/design-audit.json`
- `.reports/dossier-vintage-metrics.json`
- `.reports/dossier-vintage-live.json`

## Gerbang anti-slop AFTER, dengan batas yang jujur

- **Hard Gate source/DOM lulus pada ruang yang diuji:** cap sesuai whitelist, ID/aria target unik/ada, semua anchor internal memiliki tujuan, dataset tidak berubah, tidak ada logo/team/testimoni/angka promosi rekaan atau bitmap reference dimuat UI. Kontras token diperiksa rumus; bukan klaim kontras screenshot. Pengecualian R-02 adalah em dash dalam cap literal yang diwajibkan kontrak.
- **Purpose-Gate:** kepala/tab mengidentifikasi berkas, dashed frame mengelompokkan sumber, double rules memisahkan seksi; JEJAK BUKTI label sumber, tidak menjadi CTA ketiga. Tidak ada glass/glow/grunge, ikon ornamental atau shadow pada semua panel.
- **Liveliness:** ENERGY 2 / RHYTHM 2 / MOTION 1; hierarki lead/pendamping/register/exhibit diwujudkan dalam markup/CSS. Tidak mengklaim penilaian estetika hasil browser telah selesai.
- **Craftsmanship yang dieksekusi:** filter/reset/popstate; lima indikator; mode kalender/setara; swap; URL/back-forward; tabel; pending/incompatible/partial CSV; point reading reset; no-JS/init failure; share/clipboard/cancel/fallback; glossary Escape/focus; sumber/proyeksi; bundle hasil build. Semua tercakup tes yang benar-benar dijalankan.

## TERHAMBAT / belum menjadi klaim penerimaan rilis

Chromium/Firefox/Playwright browser tidak tersedia; proot ada tetapi tidak memiliki container terpasang. Tidak memasang browser/OS tambahan di luar lingkup repo. **Screenshot/reflow kontinu/viewport nyata, zoom 200%, kontras rendered, keyboard browser, TalkBack, dan Web Vitals belum diuji.** CSS/DOM/jsdom dan HTTP bukan pengganti layout engine browser.

Temuan dependensi npm audit yang tercatat sebelumnya tetap pekerjaan terpisah; tidak melakukan major upgrade tanpa penilaian dampak. Dataset dan seluruh materi masih membutuhkan audit editorial nyata, identitas pengelola dan kontak koreksi sebelum rilis publik. Kelulusan teknis di atas bukan persetujuan editorial atau izin publish.
