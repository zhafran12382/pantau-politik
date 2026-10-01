# FASE 3–4 — Direction & Proposal Komponen

## Direction: “Evidence-first editorial data product”
Bersih, cerdas, editorial, modern, kaya informasi, cukup hangat,
serius tanpa birokratis, premium tanpa mewah, menarik tanpa noise.
Kekayaan datang dari INFORMASI (angka, timeline, sumber, anotasi),
bukan dekorasi. Netral politik: tanpa merah/hijau penilai, tanpa
pemenang, delta selalu “deskriptif, bukan sebab-akibat”.

## Token baru (ditambah, bukan ganti sistem)
- `--color-info`: biru-slate untuk marker konteks Lacuna + chip “menunggu”.
- Skala teks data: `Display number` (angka kunci kartu/preview).
- Radius: kecil (chip/label), sedang (kontrol), besar (kartu utama).
- Bayangan: hanya overlay popover; pemisah utama = border + surface.

## Proposal per fase brief (STEP 1–12)
1. **Tokens/typography/spacing:** tambah token info + display-number;
   rapatkan section mobile; bedakan H1/H2/judul-kartu via
   bobot + casing + warna, bukan cuma ukuran.
2. **Header:** baris brand + baris nav kompak di <480px; active = pil +
   underline; Metode tetap sebagai item ketiga.
3. **Hero:** tinggi ≤60vh mobile; tambah strip aktivitas dari data nyata
   (3 isu · N sumber primer · 5 indikator · diperbarui X lalu) +
   mini-chart PDB 2005–2023 sebagai jangkar (data sudah ada).
4. **Issue explorer:** kartu 2-baris (baris meta Linear + judul clamp-2 +
   sparkline/angka + sumber/hari + CTA). Target 1,5 kartu per viewport.
5. **Update timeline:** tipe (DATA/STATUS/SUMBER/PENJELASAN/KOREKSI)
   diturunkan dari corrections + perubahan `updated_at`; format
   “X → Y”; tanpa data before/after → label jujur “penjelasan”.
6. **Compare preview (home):** blok PDB: 2005–2013 5,8% vs 2015–2023
   4,1% + mini two-series chart + “Sumber: BPS” + caveat + CTA.
   Angka dihitung dari observasi (bukan fabrikasi).
7. **Compare controls:** grup lebih rapat; hasil mengikuti dalam
   1 viewport desktop; mobile + tautan “↓ ke hasil” dan “↑ ubah pilihan”.
8. **Charts:** tap-to-read tooltip (tap titik → panel angka), direct
   labels tetap, anotasi 2008/2020/transisi dapat difokuskan, tabel
   alternatif tetap, unit di sumbu.
9. **Summary:** grid metrik kompak (Awal/Akhir/Rata-rata/Rentang +
   tahun min–maks) + delta eksplisit; detail di disclosure.
10. **Sources:** kartu sumber (institusi · dokumen · terbit · cakupan ·
    diambil · primer/sekunder) di compare + issue; “disentuh”
    dari sitasi klaim.
11. **Footer:** 2 kolom kompak; disclaimer audit sebagai notice,
    bukan teks abu samar.
12. **Issue detail:** modul “Klaim & bukti” (evidence cards:
    klaim → jenis bukti → sumber) + diagram alir APBN sebagai
    ordered-steps (dari konten impact/events yang ada, tanpa fakta baru).

## Yang TIDAK dilakukan
Tanpa data/sumber/tanggal/institusi baru; tanpa gradient/glass/animasi
berat; tanpa dark mode; tanpa multi-indikator; tanpa share-image;
tanpa watchlist/notifikasi (backlog).

## Verifikasi tiap step
Build kandidat → curl render → cek DOM/teks → unit/integrasi/audit
→ publish lokal → sinkron workspace. Tanpa screenshot (keterbatasan
perangkat dicatat); sebagai gantinya inspeksi teks render + assertion
DOM per step.
