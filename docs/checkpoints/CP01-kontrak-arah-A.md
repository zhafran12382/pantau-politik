# CP01 — Kontrak desain arah A “Lembaran Negara”

Status: disepakati pemilik pada 29 September 2026. Menggantikan
“Editorial Precision” sebagai arah visual. Fakta produk, konten,
dan data tidak berubah oleh kontrak ini.

## Keputusan visual yang mengikat
1. Serif display (Source Serif 4 kandidat) untuk H1 isu, judul entri,
   dan wordmark; Manrope untuk UI, body, kontrol, tabel, angka.
2. Nomor register stabil `PP-001…` untuk tiap isu (pemetaan terpisah,
   bukan index array; validasi dugal; tercari via search).
3. Cap status datar + simbol + definisi; empat status PRD; netral politik.
4. Garis aturan 2 px pada masthead; entri register berbatas tegas;
   radius kecil untuk cap, sedang untuk kontrol.
5. Kolom nomor/tanggal desktop; baris ringkas mobile.
6. Bukti memakai kartu `EvidenceRecord` (klaim → jenis → sumber → locator).
7. Tidak ada: tekstur kertas/noise, stempel miring dekoratif, bahasa
   birokratis, serif untuk seluruh UI, dua font display.
8. Batas metafora: “register/berkas/lembar” hanya untuk struktur;
   situs tidak boleh terlihat atau terdengar seperti layanan pemerintah.

## Wireframe mobile (360px)
```text
══ PANTAU POLITIK ═══════════ [tebal 2px]
Pantau · Bandingkan · Metode
─────────────────────────────────
Pahami isu. / Periksa buktinya.   [serif 30px]
Satu kalimat tugas. [Jelajahi isu]
3 isu · 12 sumber · diperbarui 2 h lalu
─────────────────────────────────
REGISTER ISU              [search]
PP-001  APBN DAN ENERGI  [CAP]
Judul isu (serif 21px)
Ringkasan 2 baris.
[mini angka]  4 sumber · diperiksa 25 Sep
Lihat bukti & sumber →
─────────────────────────────────
PP-002 ...
─────────────────────────────────
BUKU PERUBAHAN
25 Sep  KOREKSI  judul… (alasan)
24 Sep  PENJELASAN  judul… (status …→…)
─────────────────────────────────
LEMBAR PEMBANDING
PDB 5,8% vs 4,1% [mini chart] Sumber: BPS
[Buka pembanding →]
```

## Wireframe desktop (≥1024px)
- Masthead satu baris + garis 2px; hero 7/12 + jangkar data 5/12.
- Register: kolom nomor+tanggal 220px + isi fleksibel.
- Isu: kolom register kiri (nomor, tanggal, status) + artikel 68ch.
- Compare: kontrol satu baris; grafik dominan; tabel terbuka.

## Fakta vs visual (dilarang campur)
- Nomor register, cap, dan bingkai TIDAK berarti “terverifikasi”.
- Label audit/pratinjau tetap jujur di dekat materi terdampak.
- Tidak ada klaim, tanggal, sumber, atau identitas baru.

## Gerbang CP01
- [x] A dikunci sebagai arah; Editorial Precision dipensiunkan di DESIGN.md.
- [x] AGENTS.md mengarah ke kontrak ini.
- [x] Wireframe di atas menjadi acuan CP04–CP12.
