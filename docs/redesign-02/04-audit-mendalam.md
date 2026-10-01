# Audit Mendalam Pantau Politik (build CP-revisi-01)

Basis: render HTML aktual home (12,4 KB teks), compare (55,5 KB),
issue; struktur Astro + token + komponen. Tanpa screenshot
(keterbatasan perangkat) — diganti inspeksi DOM/teks render.
Tidak ada kode yang diubah dalam audit ini.

## Visual hierarchy
- H1/H2/judul-kartu dibedakan terutama oleh ukuran; bobot 600–700
  dipakai di hampir semua heading sehingga pada pindai cepat semuanya
  “berteriak” sama keras. Kurang diferensiasi via casing, warna, tracking.
- Eyebrow dipakai di hampir tiap section (“Pembanding data”, kategori)
  sehingga fungsinya sebagai penanda meluruh menjadi filler.
- Angka kunci (display-number) hanya muncul 2x di homepage; di halaman
  lain angka penting tenggelam dalam paragraf/tabel.

## Information architecture
- Tiga rute utama jelas (Pantau/Bandingkan/Metode), tetapi hubungan
  isu↔data satu arah (isu→indikator ada; grafik→isu/peristiwa belum
  bisa diklik/dijelajahi — marker hanya `<title>`).
- Halaman indikator tipis: definisi + grafik yang sama dengan compare,
  tanpa narasi “mengapa angka ini penting untuk isu X”.
- Tidak ada arsip/topik; skala 50–500 isu belum terpikirkan di IA
  (search/filter ada tapi tanpa halaman hasil/topik).

## Navigation
- Nav 3 item satu baris penuh di 360px — mahal untuk 3 tautan.
- Breadcrumb ada di compare/isu tapi gayanya berbeda (teks vs link).
- Tidak ada navigasi antar-isu (sebelum/sesudah/terkait) di halaman isu.
- TOC artikel ada — bagus; tapi tanpa penanda posisi baca.

## Typography
- Satu keluarga Manrope untuk semua peran — konsisten tapi monoton;
  peran angka vs teks vs label hanya dibedakan ukuran.
- Judul isu panjang membungkus 4–5 baris di 360px tanpa clamp,
  mendorong konten penting jauh ke bawah.
- Tidak ada perbedaan tajam antara kutipan angka, label sumbu, dan body.

## Spacing
- Ritme vertikal monoton: section → heading → paragraf → meta → garis,
  berulang dengan jarak yang sama. Mata tidak dibantu memprioritaskan.
- Kartu isu masih tinggi (±600px di mobile): figure + CTA tombol +
  metadata menumpuk. Target 1,5 kartu/viewport belum tercapai.

## Information density
- Viewport pertama home: headline + lead + 4 angka strip + 3 tombol +
  trust strip — padat klaim, tapi hanya 4 angka yang benar-benar data.
- Update feed dan daftar sumber adalah baris teks berulang tanpa
  variasi visual yang membantu pindai (chip jenis ada tapi kecil).

## Cards
- Kartu isu memakai border seragam + radius seragam; featured hanya
  dibedakan aksen kiri 4px — lemah sebagai pembeda utama.
- Kartu sumber dan kartu bukti memakai pola yang sama dengan kartu isu
  (over-consistency): tiga jenis informasi terlihat sama.

## CTA
- Hierarki CTA kabur: “Jelajahi isu” dan “Bandingkan data” sama-sama
  tombol sekunder; “Buka pembanding” primer — tapi di kartu isu CTA-nya
  sekunder lagi. Tidak ada satu aksi primer per layar yang konsisten.
- Panah →/↗ dipakai bergantian; aturan internal vs eksternal belum
  ditegakkan di semua tempat.

## Charts
- Kuat: sumbu bersama mencakup nol, gap vs dotted-break dibedakan,
  transisi diarsir, marker netral, footer shareable, tabel alternatif.
- Lemah: tanpa tooltip sentuh (title saja); titik r=4,5 kecil untuk
  jari; legend teks panjang; sparkline kartu tanpa sumbu sehingga
  bentuknya bisa menyesatkan (min–max lokal tanpa label).
- Preview homepage: dua polyline tanpa label tahun — dekoratif
  mendekati informatif; perlu angka tahun minimal.

## Source presentation
- SourceLinks inline “Sumber: Publisher ↗” bagus dan dekat klaim.
- Kartu sumber compare sudah berlabel primer/sekunder + tanggal —
  tapi di halaman isu daftar sumber masih list polos (inkonsisten).
- Tidak ada pratinjau dokumen (judul + penerbit + tanggal + bagian
  sudah ada; terjadinya “klik buta” ke luar situs belum diatasi).

## Trust signals
- Trust strip di hero + disclaimer audit kuat — fondasi ada.
- Namun: byline/reviewer “belum dikonfirmasi” tampil polos di setiap
  artikel (jujur tapi melemahkan); tidak ada “mengapa kami bisa
  dipercaya” yang ringkas di atas fold selain strip.
- Koreksi hanya terlihat bila ada; tidak ada indikator “nol koreksi
  = belum pernah dikoreksi vs belum diperiksa”.

## Responsive design
- Token dan breakpoint rapi; sticky desktop ada; mobile single-column.
- Risiko tanpa browser: tabel lebar di 360px (overflow-x region —
  sudah benar), grafik 320px (label 14px mungkin sempit), nav dua
  baris <480px (belum terlihat rendernya).

## Accessibility
- Kuat: skip link, focus-visible, live region, semantic, reduced-motion.
- Celah: titik grafik keyboard-focusable tapi tanpa peran yang
  mengumumkan nilai ke SR secara andal (title pada circle tidak
  konsisten dibaca); kontras teks-muted di atas surface-muted belum
  diaudit per pasangan; glossary popover diuji jsdom saja.

## Interaction
- Semua interaksi standar: select, details, share, salin, unduh.
  Belum ada SATU pun signature interaction (scrub, tap-explore,
  linked highlight isu↔data).
- Filter/search homepage tanpa URL state (tidak bisa dibagikan);
  compare sudah URL-state (bagus, tidak konsisten).

## Empty/loading/error states
- Ada untuk data kosong/rusak/blocked — bagus dan jujur.
- Tidak ada loading state (render SSR instan + JS cepat — dapat
  diterima, tapi perlu skeleton bila data membesar).
- Search tanpa hasil ada; kategori kosong belum ada (baru 3 isu).

## Akar masalah (sintesis)
1. Hierarki bergantung ukuran font, bukan sistem perbedan peran.
2. Ritme vertikal seragam → pindai lambat meski konten sudah padat.
3. Tiga jenis kartu memakai satu pola → informasi terasa sama.
4. Grafik benar secara metodologi tapi pasif (baca, jangan sentuh).
5. Trust sudah jujur tapi belum divisualkan sebagai sistem.
