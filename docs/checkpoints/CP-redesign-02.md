# Checkpoint redesign-02 — STEP 1–12 fase brief (28–29 September 2026)

Server sempat mati saat publish; dihidupkan ulang via keepalive
(PID 2891, port 4321) dan terverifikasi 200. Kode tidak berubah
akibat restart — dist yang disajikan adalah hasil publish terverifikasi.

## STEP 1 — Token/tipografi/spasi
Tambah `--color-info`, skala `display-number`; H1 700 / H2 600 /
H3 16px-bold (hierarki via bobot, bukan cuma ukuran); section mobile
dirapatkan. Check 0 error.

## STEP 2 — Header
Dua baris di <480px (brand + nav kompak); Metode item ketiga;
active = pil + underline.

## STEP 3 — Hero
Tinggi dibatasi; strip aktivitas dari data nyata (isu aktif, sumber
primer official/law/court, 5 indikator, pembaruan relatif terakhir);
jangkar mini-chart PDB 2005–2023 + tautan pembanding. Tanpa angka
fabrikasi — semua dihitung dari observasi/konten.

## STEP 4 — Kartu kompak
Padding rapat, ringkasan clamp-2, CTA tombol tetap. Target ±1,5
kartu/viewport perlu cek visual browser (terbuka).

## STEP 5 — Update bertipe
KOREKSI (dari corrections + alasan) vs PENJELASAN (dari updated_at);
diurut tanggal, maks 5. Tanpa before/after yang difabrikasi.

## STEP 6 — Preview compare
Rata-rata PDB A vs B + mini two-series + sumber + caveat, dihitung
di frontmatter dari observasi.

## STEP 7 — Kontrol↔hasil
Tautan lompat ↓ hasil / ↑ ubah pilihan; sticky desktop dipertahankan.

## STEP 8 — Tap-to-read
Klik/fokus titik → panel bacaan role=status. Panel ada di SSR.

## STEP 9 — Grid metrik
Ringkasan dl menjadi grid 2 kolom berisi kartu angka.

## STEP 10 — Kartu sumber
Daftar sumber indikator menjadi kartu (primer/data/sekunder +
rilis + ambil).

## STEP 11 — Footer
Grid 1fr/auto, padding/gap rapat; disclaimer audit sebagai notice.

## STEP 12 — Klaim-bukti
Section evidence cards dari impact (proyeksi vs berjalan) + TOC.

## Bukti
- check+tsc: 0 error. Unit 25/25, integrasi 13/13, audit-ui 0 temuan.
- Render live: activity-strip, hero-anchor, preview-chart, issue-card,
  update-timeline, trust-strip, swapPeriods, downloadCsv, mode-help,
  range-help, caution-line, chartReading, jump-link — semua hadir.
- Publish atomik 28 berkas; sinkron 8 berkas/79 hash terverifikasi.

## Terbuka (butuh browser/perangkat nyata)
Screenshot 360–1440, zoom 200%, TalkBack, Web Vitals lapangan,
audit kontras render, PNG touch icon, flowchart APBN, benchmark,
multi-indikator, share-image, watchlist.
