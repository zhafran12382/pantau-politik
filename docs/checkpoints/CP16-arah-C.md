# CP16 — Kontrak arah C “Arsip Ruang Redaksi” (Hybrid Editorial + Top Secret)

Status: disetujui pemilik pada 30 September 2026. Menggantikan pembatasan
CP01 poin 7 (“tidak ada tekstur kertas/noise, stempel miring dekoratif”)
dengan aturan terkontrol di bawah. Fakta produk, konten, dan data tidak
berubah oleh kontrak ini.

## Keputusan visual yang mengikat

1. Basis kertas koran hangat + tinta pekat; permukaan kartu bukan putih
   murni. Teal SaaS dipensiunkan; merah cap hemat untuk penanda arsip
   dan peringatan jujur; seri data memakai tinta vs hijau arsip pudar.
2. Tiga peran tipografi: serif display (headline), sans readable (isi),
   condensed caps Manrope-700 + mono sistem untuk kode berkas/label.
   Tanpa font display kedua, tanpa aset font baru.
3. Tekstur hanya CSS (grain linear-gradient sangat halus + garis aturan
   ganda tebal-tipis + kotak filing putus-putus). Tanpa gambar, tanpa
   watermark, tanpa logo/brand dari referensi mana pun.
4. Cap selalu horizontal (tidak miring), berbatas tegas, dan JUJUR:
   diizinkan hanya “ARSIP PUBLIK”, “DRAF PRATINJAU — BELUM AUDIT”,
   “KOREKSI TERCATAT”. DILARANG: “TOP SECRET”, “RAHASIA NEGARA”,
   “RESMI”, “TERVERIFIKASI”, atau klaim otoritas apa pun.
5. Batas metafora: koran untuk alur baca publik, dossier untuk pembungkus
   berkas/bukti. Situs tidak boleh terlihat atau terdengar seperti layanan
   pemerintah; nomor register/cap/bingkai TIDAK berarti “terverifikasi”.
6. Grafik dan tabel tetap fungsional-modern di dalam bingkai exhibit;
   tidak ada redaksi/bilah yang menutupi informasi nyata.

## Struktur halaman (acuan CP17–CP22)

- Masthead: baris nama koran + baris dateline (status arsip, tanggal
  edisi nyata saat build) + nav sebagai seksi koran + strip arsip tipis.
- Hero: kicker edisi + headline serif besar + deck + cap pratinjau +
  strip berkas (N isu · N sumber · pembaruan terakhir) + CTA berkotak.
- Register: entri kliping (header filing: kode mono + kategori + cap;
  judul serif; ringkasan; footer bukti: sparkline + sumber + tanggal;
  CTA teks bergaris aturan).
- Kawat: entri bernomor kasus (PERKARA 01…), jenis KOREKSI/PENJELASAN,
  tanggal tabular, alasan/tautan.
- Exhibit: header berkas (EXHIBIT DATA + kode indikator) + bingkai
  grafik beranotasi + blok sumber; isi fungsional tidak berubah.

## Gerbang CP16

- [x] C dikunci sebagai arah; pembatasan CP01 yang bertentangan dicabut
  terkontrol oleh dokumen ini.
- [x] Daftar cap jujur dikunci (poin 4); pelanggaran = gagal QA.
- [ ] DESIGN.md Bab 18 merujuk kontrak ini.
