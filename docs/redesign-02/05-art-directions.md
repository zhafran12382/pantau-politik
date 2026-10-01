# Tiga Art Direction untuk Pantau Politik

Aturan main: tidak ada yang difabrikasi saat implementasi nanti;
netral politik (tanpa merah=buruk/hijau=baik untuk periode);
eyebrow/sparkline/pola lain dinilai dari fungsi, bukan larangan absolut.
Eyebrow dipertahankan hanya bila ia memuat informasi navigasi nyata
(bukan slogan); sparkline hanya bila berlabel sumbu/min–maks.

---

## A. “Lembaran Negara” — civic register / arsip dokumen

**Karakter:** seperti membaca lembaran resmi yang dirawat editor:
nomor registrasi tiap isu, garis aturan tegas, stempel status,
angka tabular berwibawa. Hangat dari kertas, serius dari ketelitian.

**Palette:** kertas `#FAF7F0`, tinta `#1A1C1A`, aksen teal dalam
`#07554C` (dipertahankan dari brand), garis aturan `#D8D2C4`,
cap status amber/biru-slate/abu (tetap netral, tak pernah merah-hijau).
**Typography:** display serif bertaji untuk H1 isu (mis. Source Serif /
Newsreader, self-host OFL) + Manrope untuk UI/data; angka selalu tabular.
**Layout:** kolom register — nomor isu + tanggal di margin kiri desktop;
kartu berupa “entri arsip” bernomor dengan garis atas tebal 2px;
tabel bergaris horizontal penuh ala lampiran resmi.

**Kelebihan:** identitas paling kuat dan paling beda dari portal berita;
trust natural untuk produk politik (“tercatat, bernomor, bisa diaudit”);
cocok untuk kronologi dan riwayat koreksi.
**Kekurangan:** risiko terasa birokratis/kaku; serif display menambah
beban font; perlu disiplin agar tak jadi “surat dinas”; chart modern
harus dijaga agar tak bentrok dengan rasa arsip.

## B. “Ruang Data” — dense civic console (terang)

**Karakter:** ruang kerja analis versi ramah: strip ticker pembaruan,
grid metrik rapat, tabel sebagai warga kelas satu, grafik besar dengan
crosshair + tap-to-read. Linear untuk densitas, OWID untuk kredibilitas.

**Palette:** putih hangat dipertahankan; tinta `#16181A`; aksen teal
hanya untuk aksi + seri A; seri B slate; marker konteks biru info;
latar panel `#F2F4F1` untuk mengelompokkan tanpa kartu.
**Typography:** satu keluarga grotesque (Manrope dipertahankan),
hierarki via bobot + uppercase label 12px + angka display besar;
mono HANYA untuk kode/CSV/angka teknis, bukan kostum.
**Layout:** homepage dibuka strip “live” (pembaruan terakhir, N isu,
N sumber — semua dari data); kartu isu = baris terstruktur 2-baris
(meta + judul + angka) yang bisa dipindai 3–4 per viewport;
compare = kontrol kompak menempel + grafik dominan + tabel terbuka.

**Kelebihan:** densitas tertinggi dengan tetap bersih; signature
interaction paling natural (tap titik, scrub periode, linked highlight);
paling siap skala ke 500 isu.
**Kekurangan:** paling dekat dengan “dashboard pemerintahan” bila
kebablasan — butuh sentuhan editorial (ringkasan manusia, nada hangat)
agar tak dingin; risiko over-consistency baris-seragam.

## C. “Majalah Penjelas” — editorial magazine (FT/NYT)

**Karakter:** majalah penjelasan: headline serif besar yang terkendali,
angka pull-quote raksasa sebagai jangkar tiap section, anotasi langsung
pada grafik (judul grafik = temuan faktual netral), batang pembatas
antar bab. Satu visual menjawab satu pertanyaan per isu.

**Palette:** sama netral (kertas, tinta, teal) + satu warna editorial
tambahan yang tenang (biru tinta `#2F4B5E`) khusus anotasi dan pull-quote.
**Typography:** serif untuk headline + pull-quote angka; sans untuk
body/UI; aturan ketat: headline ≤ 12 kata, judul grafik = kalimat temuan.
**Layout:** ritme bab yang bervariasi (hubungi: intro padat → angka
raksasa → teks → grafik beranotasi → sumber); tiap isu wajib punya
“satu visual penjelas” (flow APBN, mekanik pemilu, garis kemiskinan);
daftar sumber sebagai catatan kaki bernomor ala artikel.

**Kelebihan:** visual storytelling terkuat; paling “manusiawi” dan
berbeda dari dashboard; anotasi = konteks politik tersampaikan.
**Kekurangan:** boros ruang vertikal (bertentangan dengan target
densitas); butuh kerja editorial+ilustrasi per isu (mahal di skala);
risiko terasa seperti media opini bila nada tidak dijaga netral.

---

## Rekomendasi awal (untuk dipilih, bukan dieksekusi)

**B sebagai fondasi + C sebagai lapisan:** kerangka Ruang Data
(densitas, tap-to-read, tabel utama) dengan disiplin editorial Majalah
(anotasi netral, judul grafik = temuan, satu visual per isu).
A ditolak sebagai sistem penuh (risiko birokratis) tetapi nomor
registrasi + garis aturan 2px-nya layak diadopsi sebagai detail identitas.

Menunggu pilihanmu: A, B, C, atau hibrida — sebelum satu baris kode pun diubah.
