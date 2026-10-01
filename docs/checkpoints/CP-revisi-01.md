# Checkpoint revisi-01 — umpan balik kepadatan, identitas, dan kepercayaan

Tanggal: 27 September 2026. Server localhost TIDAK di-restart (tetap port 4321).

## Identitas dan hook
- Brand mark garis-tren + wordmark dua warna di navbar/footer; nav aktif
  berupa pil + underline; Metode menjadi tautan ketiga.
- Intro beranda: jalur cepat 3 tugas + strip kepercayaan (sumber primer,
  metode terbuka, koreksi tercatat) di atas fold.
- CTA isu menjadi tombol “Lihat bukti & sumber”; tombol utama memakai
  teal aksi agar sekeluarga dengan tautan.

## Densitas dan kartu
- Tipografi: body 17 px/1,6; display ponsel 32 px; gutter ponsel 16 px;
  spasi section lebih rapat. Token + DESIGN.md v1.1 diperbarui.
- Kartu isu berbingkai: kategori uppercase, chip status berdefinisi,
  sparkline + angka kunci indikator terkait, jumlah sumber, tanggal
  relatif + absolut, CTA tombol. Pencarian + filter topik + hitungan skala.
- Pembaruan berbentuk timeline ringkas satu baris dengan label jenis.

## Pembanding
- Kontrol ringkas + sticky desktop; tombol tukar ⇄; headline presisi
  “satu indikator antar dua periode”; breadcrumb; disclosure mode dan rentang.
- Grafik 320/420 px, garis 3 px, titik fokusable, label ujung garis,
  garis nol tegas, satuan pada tick, tick 4/7, footer shareable.
- Missing = gap; pergantian versi = jembatan titik-titik + berlian berlabel.
  Transisi diarsir; marker 2008/2020 netral dan bersumber.
- Ringkasan: median, min–maks + tahun, “N dari 9 tahun”, delta A-vs-B
  eksplisit + disclaimer, disclosure cara membaca, versi seri user-facing.
- Tabel tampil default; unduh CSV; sumber berlabel primer/data/sekunder
  + tanggal rilis dan pengambilan; caution non-kausal di bawah grafik.

## Halaman isu
- TOC jangkar; chip status; tanggal naskah vs pemeriksaan dijelaskan;
  sumber berlabel jenis + tanggal; sitasi :target ter-highlight.

## Bukti
- `astro check` + tsc: 0 error. Unit 25/25 (3 bug grafik ditemukan test
  dan diperbaiki di sumber: pasangan breaks, offset marker, regex uji).
- Integrasi 13/13. Audit-ui 16 rute, 0 temuan DOM, anggaran aset lolos.
- Sitemap 15 rute, lastmod editorial.

## Belum dikerjakan (butuh browser/perangkat, konten, atau keputusan produk)
- Verifikasi visual per lebar layar, zoom 200%, TalkBack, Web Vitals lapangan.
- PNG touch icon (sharp native tidak tersedia di Android ini).
- Flowchart proses APBN, seat/ballot visual, diagram garis kemiskinan:
  butuh model konten + riset editorial, bukan sekadar styling.
- Watchlist/notifikasi, diff sebelum–sesudah, benchmark nasional,
  multi-indikator side-by-side, share-image: di luar MVP, dicatat backlog.
- Audit editorial 100% + studi pengguna + beta/rollback sebelum produksi.
