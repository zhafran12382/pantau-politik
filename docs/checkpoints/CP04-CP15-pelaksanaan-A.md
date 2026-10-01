# CP04–CP15 — Pelaksanaan arah A (30 September 2026)

## CP04 Masthead
- BrandMark diganti: bingkai register + 2 garis aturan + segel aksen
  (simbol grafik-naik dipensiunkan karena berkonotasi performa).
- Wordmark serif 600; favicon + theme-color diselaraskan (`#faf7f0`).
- Header bergaris aturan 2 px; active nav pil + underline (tanpa warna saja).

## CP05–CP06 Homepage + register
- `IssueRegisterEntry`: nomor PP-00x, kategori, cap, judul serif,
  ringkasan clamp-2, sparkline berlabel rentang, jumlah sumber,
  tanggal relatif+absolut, CTA tombol.
- Search + filter + reset + hitungan hasil + query URL yang bisa dibagikan.
- Featured = aksen kiri; non-fitur tanpa slot kosong.

## CP07–CP08 Ledger + preview
- `UpdateLedger`: Koreksi (dengan alasan + tautan #koreksi) vs Penjelasan.
- `ComparisonPreview`: memakai `chartSVG` + model bersama; aman untuk
  indikator non-mean (endpoint + satuan benar).

## CP09–CP10 Kontrol + grafik
- `CompareToolbar` terekstraksi; ⇄ menempel; disclosure mode/rentang.
- Titik r=4,5 + tabindex + tap-to-read panel; versi = garis putus +
  berlian berlabel (tanpa penghubung); transisi diarsir; marker hanya
  yang terverifikasi; footer shareable; label ujung garis.

## CP11 Sumber/CSV + CP12 dossier
- `SourceRecord`: institusi, judul, jenis, periode, rilis, ambil, locator.
- CSV: kolom konsisten, null≠nol, unit/tahun/periode/versi/sumber,
  mengikuti pilihan aktif, blocked tidak bocor.
- Dossier: identitas register di header, TOC mencakup Klaim-bukti,
  evidence cards dari impact (proyeksi vs berjalan).

## CP13–CP15
- Lab noindex dikecualikan sitemap; print stylesheet dipertahankan.
- QA: check 0 error; unit 25/25; integrasi 13/13; audit-ui 0 temuan
  (17 rute); render live diverifikasi (PP-001/002/003, toolbar, CSV,
  caution, evidence, source-cards).
- Publish atomik 30 berkas; rollback tersedia di `.history/`;
  sinkron workspace 32 berkas/91 hash.
- TERHAMBAT (dicatat): screenshot/showcase visual per viewport,
  zoom 200% manual, TalkBack — tanpa browser di perangkat ini.
  Audit editorial produksi tetap prasyarat rilis publik.
