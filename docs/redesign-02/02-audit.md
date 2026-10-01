# FASE 2 — Audit Desain Pantau Politik (build saat ini)

Basis: render HTML aktual 3 rute (home 12,4 KB / compare 55,5 KB /
issue 13 KB), teks render, dan struktur DOM. Tanpa screenshot.

## Yang dipertahankan (fondasi bagus)
Hijau restrained; tipografi bersih; kartu isu terstruktur + status chip +
source count + sparkline + CTA “Lihat bukti & sumber”; brand mark;
perbandingan dengan mode ganda; metodologi; koreksi transparan.

## P0 — menghambat comprehension / usability
1. **Hero text-heavy tanpa jangkar data.** Fold pertama = headline +
   lead + 2 tombol + trust strip teks. Tak ada angka/grafik mini.
   (Apple: satu ide + satu jangkar nyata.)
2. **Update feed = changelog CMS.** “Penjelasan diperbarui. Status: x.”
   tak menjawab APA YANG BERUBAH. Butuh tipe update + before→after.
3. **Compare preview di homepage datar.** Heading + paragraf + tombol;
   tanpa angka/grafik mini. Fitur pembeda tak terbukti di tempatnya.
4. **Kontrol–hasil terpisah jauh di mobile.** Sticky desktop ada;
   mobile hanya mengandalkan scroll bolak-balik.
5. **Chart tanpa tooltip sentuh.** `<title>` hanya untuk hover/fokus;
   pengguna sentuh tak bisa membaca titik. Butuh tap-to-read.
6. **Sumber masih footnote.** Daftar link di bawah; belum kartu sumber
   (institusi · dokumen · terbit · cakupan · ambil) ala OWID.
7. **Status tanpa definisi di tempat.** “Sedang berkembang” tak menjelaskan
   berkembang apanya tanpa membuka disclosure lain.

## P1 — melemahkan product identity
8. **Signature interaction belum ada.** Semua pola standar
   (dropdown → chart → teks). Kandidat: scrub timeline periode,
   tap-titik chart, explorer isu↔data dua arah.
9. **Isu⇄data belum dua arah.** Issue → indikator ada; grafik → isu
   belum (marker 2008/2020 belum bertautan ke isu/peristiwa).
10. **Ritme vertikal monoton.** Judul → paragraf → meta → garis,
    berulang. Perlu variasi: strip angka, timeline, kartu bukti.
11. **Nav 3 item memakan satu baris penuh di 360px.** Perlu baris
    brand + baris nav kompak, atau nav inline lebih rapat.
12. **Footer tinggi untuk sedikit konten;** disclaimer penting tenggelam.

## P2 — polish
13. Panah CTA dekoratif; underline noise pada judul panjang.
14. “Data dalam konteks” sebagai eyebrow filler berulang.
15. Radius/shadow kecil tak konsisten antar kartu/panel.
16. Touch icon PNG belum ada (sharp tak tersedia di Android).

## Urutan kerja
P0 (1–7) → P1 (8–12) → P2 (13–16). Tanpa data/informasi baru yang
difabrikasi: semua angka strip/preview dihitung dari konten + observasi.
