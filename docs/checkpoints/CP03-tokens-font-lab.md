# CP03 — Tokens, font, lab komponen

## Tokens
- Kertas `#FAF7F0`, tinta `#1A1C1A`, garis aturan `#D8D2C4`,
  `--font-serif: Source Serif 4`.
- Kontras pasangan baru dihitung: semua ≥4,5:1
  (terendah chip-arsip 4,54:1).

## Font
- Source Serif 4 latin-600 OFL via `@fontsource/source-serif-4`
  (21,5 KB) + Manrope variable latin (24,8 KB) = ±46 KB < 60 KB.
- Preload keduanya; `font-display: swap`.
- Serif dipakai: H1 home/artikel/prose, judul entri, wordmark.
  UI/data/tabel tetap Manrope (bukan kostum).

## Lab
- `src/pages/lab/` (noindex, dikecualikan sitemap): judul ekstrem,
  cap, tombol (termasuk contoh disabled yang ditandai JANGAN),
  select panjang, kartu, notice, tabel. Audit mewajibkan 17 rute
  dan noindex lab.

## Gerbang
- [x] check 0; unit 25/25; integrasi 13/13; audit-ui 0 temuan.
- [x] Anggaran font/aset lolos.
