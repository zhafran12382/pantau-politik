# CP02 — Kontrak informasi + perbaikan P0 penyajian

## Kontrak
- `content/register-map.json`: PP-001/002/003; validasi format, dugal,
  kelengkapan isu terbit (`validate-content.mjs`).
- `src/lib/content/counts.mjs`: hitung hanya konten terbit; sumber hanya
  yang dirujuk; dipakai activity strip (menggantikan hitung ad-hoc).
- Marker konteks: field `verified`; grafik hanya merender yang terverifikasi.
  Kedua marker existing (`verified: false`) TIDAK tampil sampai editorial
  menyediakan dokumen pendukung — dicatat jujur, bukan dihapus diam-diam.
- Kelengkapan ≠ audit: agregat yang mensyaratkan kelengkapan diblokir bila
  `!complete`; status audit editorial terpisah.

## Perbaikan P0 (terverifikasi unit/integrasi)
1. Preview homepage memakai `chartSVG` + model bersama (domain dari
   observasi); geometri khusus yang bisa menggambar di luar bidang: DIHAPUS.
2. Sparkline kartu berlabel rentang + tahun + sumber (visible + aria).
3. Delta rata-rata indikator `%` → **poin persentase** (`view.mjs`).
4. Slot tahun dibentuk dulu (`summarizeSeries` map per tahun); baris sumber
   yang hilang menjadi slot missing, bukan hilang dari penyebut.
5. Perubahan versi: garis DIPUTUS + penanda berlian berlabel; tidak ada lagi
   garis penghubung dotted. Test diperbarui.
6. JSDoc tipe `chartSVG` diperbaiki (menyebabkan 2 error check sementara,
   selesai 0 error).

## Gerbang
- [x] check 0 error; unit 25/25; integrasi 13/13 (kandidat ini).
- [x] Tidak ada angka/sumber/tanggal baru yang difabrikasi.
