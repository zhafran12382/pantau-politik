# DESIGN.md

## Platform Politik Interaktif · Lembaran Negara

**Versi:** 3.0-draf · Dossier Vintage
**Status:** arah C “Arsip Ruang Redaksi · Dossier Vintage” pada Bab 18 adalah acuan visual aktif. Pemilik meminta implementasi refinemen vintage/dossier dari referensi `docs/redesign-vintage/homepage-v2.png`. Bab 1–17 memuat riwayat arah A/B dan tidak menggantikan kontrak aktif; klaim implementasi historis bukan bukti QA build sekarang.
**Riwayat:** 2.0 mengganti “Editorial Precision” dengan “Lembaran Negara” (keputusan pemilik 29 Sep 2026): register isu bernomor, serif editorial + Manrope, garis aturan, cap status, Jejak Bukti. Kontrak: `docs/checkpoints/CP01-kontrak-arah-A.md`.  
**Nama kerja:** Pantau Politik. Identitas akhir mengikuti keputusan pemilik produk.  
**Acuan produk:** PRD MVP v1.0 dan `../RENCANA_IMPLEMENTASI_PLATFORM_POLITIK_MVP.md`.

---

## 1. Arah visual

> Lembaran Negara: register isu bernomor, serif editorial yang bertaji, garis aturan tegas, dan setiap angka bisa ditelusuri ke dokumen.

Rasa yang dituju: **tercatat, teliti, berwibawa, hangat, mudah diperiksa**.
Nama arah bersifat internal; publik tetap melihat Pantau Politik, bukan dokumen pemerintah.

Pembaca utama adalah pengguna ponsel yang ingin memahami isu dan memeriksa bukti. Tindakan utama beranda adalah membuka penjelasan isu; tindakan utama halaman isu adalah memahami ringkasan lalu memeriksa sumber; tindakan utama pembanding adalah membaca indikator dengan satuan dan periode yang benar.

### Terjemahan referensi Apple dan Tesla

| Prinsip referensi | Penerapan pada produk ini | Alasan |
|---|---|---|
| Apple: hierarki tipografi yang tegas | Judul besar dengan berat terukur, body nyaman, metadata lebih kecil tetapi tetap terbaca | Pembaca dapat mengenali inti halaman sebelum membaca detail. |
| Apple: ruang kosong dan detail konsisten | Jarak antarbagian lebih besar daripada jarak antarelemen dalam satu bagian | Ruang membantu menjelaskan hubungan informasi. |
| Tesla: navigasi ringkas dan komposisi disiplin | Pantau dan Bandingkan selalu mudah ditemukan; tindakan ditulis langsung | Pengguna tidak perlu membuka menu besar untuk tugas inti. |
| Tesla: fokus pada satu hal penting | Satu isu unggulan dominan, dua isu pendamping dengan bobot lebih ringan | Prioritas editorial terlihat tanpa mengklaim popularitas. |
| Keduanya: penyelesaian detail | Tipografi responsif, fokus keyboard, angka sejajar, transisi singkat | Kualitas terasa saat dipakai, bukan hanya saat dilihat. |

Referensi ini menentukan disiplin visual, bukan salinan halaman, logo, font milik merek, atau aset mereka. Foto produk layar penuh digantikan oleh penjelasan isu yang berguna. Tidak ada video hero, intro animasi, atau scroll yang dikunci.

### Enam keputusan karakter

| Sumbu | Keputusan |
|---|---|
| Kepadatan | Register isu ringkas dan mudah dipindai; artikel nyaman dibaca; pembanding mengutamakan kedekatan kontrol–data. |
| Suhu visual | Putih sedikit hangat dengan teks arang, tanpa kesan kertas tua atau aplikasi neon. |
| Formalitas | Kredibel dan berbahasa sehari-hari yang tepat; bukan bahasa kampanye atau pemasaran SaaS. |
| Energi | Tenang; perubahan kontrol terasa langsung. |
| Ornamen | Struktur, tipografi, garis pemisah, dan data asli menjadi elemen visual. |
| Kontras | Kontras teks tinggi; perbedaan ukuran jelas; aksen warna hemat. |

### Ciri khas yang harus terlihat (target arah A)

1. **Nomor register:** tiap isu berkode stabil `PP-001…` (bukan index), tercari, dan disebut dalam koreksi.
2. **Serif editorial + Manrope:** H1 isu, judul entri, dan wordmark memakai serif; UI/data/tabel memakai Manrope tabular.
3. **Garis aturan:** masthead bergaris 2 px; entri register berbatas tegas.
4. **Cap status:** datar, radius kecil, teks + simbol + definisi; netral politik.
5. **Kolom waktu:** tanggal dan kronologi sejajar satu jalur baca.
6. **Jejak Bukti:** klaim/tahun/perubahan → bukti terkait → dokumen sumber.
7. **Presisi angka:** satuan eksplisit, tanggal observasi, dan asal angka selalu dekat.

Website harus tetap terbaca sebagai penerbit penjelasan politik dan data ketika logonya ditutup.

---

## 2. Hierarki keputusan

Urutan penyelesaian konflik: **ketepatan isi dan metode PRD → aksesibilitas → keberhasilan tugas → sistem visual ini → saran skill umum**.

- Ringkasan, status, sumber, tanggal, koreksi, dan keterbatasan penting tidak dikorbankan untuk membuat halaman lebih kosong.
- Warna tidak menjadi identitas permanen politikus/partai, indikator baik-buruk pemerintahan, atau penanda pemenang.
- Label status isu mengikuti empat status PRD; tahap kebijakan merupakan informasi terpisah.
- Data yang belum diaudit tidak boleh dibuat tampak disetujui melalui centang, label Terverifikasi, atau grafik tanpa keterangan.
- Jika data belum layak ditampilkan, gunakan keadaan kosong/blocked dengan penjelasan, bukan angka dekoratif.
- PRD menentukan 150 KB gzip JS awal dan 1 MB aset awal per halaman. Batas umum skill yang lebih longgar tidak berlaku.
- MVP menggunakan tema terang. Checklist dark mode dari skill tidak menambah fitur baru.
- Ungkapan ketidakpastian yang diperlukan, seperti proyeksi atau belum dapat dipastikan, tetap ditulis. Saran copywriting skill untuk menghapus hedging tidak berlaku pada ketidakpastian faktual.

---

## 3. Sistem warna

Halaman didominasi putih hangat, putih, dan arang. Teal menandai tautan, fokus, serta penekanan fungsional. Tombol utama berwarna arang agar tidak semua elemen saling berebut aksen.

| Token | Nilai | Penggunaan |
|---|---|---|
| `--color-page` | `#FAFAF7` | Latar halaman. |
| `--color-surface` | `#FFFFFF` | Form, area grafik, panel yang memang membutuhkan pemisahan. |
| `--color-surface-muted` | `#F1F2EF` | Header tabel, keadaan selected yang ringan, kelompok kontrol. |
| `--color-text` | `#171A19` | Judul, isi, tombol utama. |
| `--color-text-muted` | `#59615E` | Metadata dan teks pendukung. |
| `--color-divider` | `#DADFD9` | Garis dekoratif/pemisah, bukan satu-satunya batas input. |
| `--color-control-border` | `#727C76` | Batas kontrol yang perlu terlihat terhadap putih. |
| `--color-accent` | `#096C60` | Link, fokus, penekanan navigasi. |
| `--color-accent-hover` | `#07554C` | Hover/active untuk tautan beraksen. |
| `--color-accent-soft` | `#E8F2EF` | Latar selected atau selection teks. |
| `--color-action` | `#07554C` | Latar tombol utama (putih di atasnya ±7,5:1). Dipilih agar tombol sekeluarga dengan tautan, bukan blok hitam terpisah. |
| `--color-action-hover` | `#043B34` | Hover/active tombol utama. |
| Chip status (netral, bukan penilaian baik/buruk): `--color-chip-dev{,#-soft}` `#87511B/#FFF3DF`, `--color-chip-wait{,#-soft}` `#3D5A73/#E9F0F6`, `--color-chip-done{,#-soft}` `#4A4F4D/#E8EAE9`, `--color-chip-arch{,#-soft}` `#6B6F6C/#F1F2EF`. | | |
| `--color-warning` | `#87511B` | Label belum diperiksa ulang dan catatan keterbatasan. |
| `--color-warning-soft` | `#FFF3DF` | Latar catatan keterkinian. |
| `--color-error` | `#9E3434` | Error input/data, bukan penilaian politik. |
| `--color-error-soft` | `#FBEFEC` | Latar error. |
| `--color-series-a` | `#096C60` | Seri A: garis utuh + marker lingkaran. |
| `--color-series-b` | `#536579` | Seri B: garis putus-putus + marker persegi. |

### Kontras token yang telah dihitung

Rasio berikut dihitung dengan luminans relatif sRGB untuk pasangan warna solid, tanpa opacity. Ini pemeriksaan palet, bukan audit aksesibilitas halaman.

| Pasangan | Rasio perkiraan |
|---|---|
| Teks utama / latar halaman | 16,76:1 |
| Teks sekunder / latar halaman | 6,09:1 |
| Link teal / latar halaman | 6,04:1 |
| Putih / tombol arang | 17,53:1 |
| Putih / teal | 6,31:1 |
| Batas kontrol / putih | 4,32:1 |
| Teks warning / latar warning | 5,94:1 |
| Teks error / latar error | 6,23:1 |
| Garis seri B / putih | 5,99:1 |

Target: teks normal ≥4,5:1, teks besar ≥3:1, serta batas kontrol/indikator interaksi penting ≥3:1. Pasangan baru, opacity, hover, dan focus tetap diperiksa saat implementasi.

---

## 4. Tipografi

### Keluarga huruf

**Pilihan utama: Manrope**, satu keluarga untuk judul, isi, dan kontrol. Bentuknya terbuka untuk membaca panjang, sementara judul berbobot 600/700 memberi ketegasan yang sesuai arah produk. Satu keluarga menjaga konsistensi dan biaya pemuatan.

- Gunakan WOFF2 yang di-host sendiri; simpan lisensi font dan asal berkas.
- Bobot yang diperlukan: 400, 500, 600, 700. Pilih satu variable subset bila hasil pengukuran lebih kecil.
- Target aset font awal ≤60 KB; periksa hasil kompresi sebelum mengunci aset.
- `font-display: swap`; preload hanya berkas yang benar-benar dipakai di bagian awal halaman.
- Fallback `system-ui, sans-serif` menjaga teks tetap muncul; cocokkan metrik fallback setelah mengukur font, bukan menebak `size-adjust`.
- Periksa angka tabular, tanda minus, tanda persen, koma desimal, diakritik, serta tanda baca Bahasa Indonesia pada font final.
- Tidak mengambil San Francisco atau font Tesla sebagai aset web.

### Skala

Ukuran px di tabel mengasumsikan root 16 px. Implementasi memakai rem/clamp dan tetap mengikuti pembesaran teks pengguna.

| Peran | Ponsel | Desktop | Bobot | Line-height |
|---|---|---|---|---|
| Display beranda | 32 px | 56 px | 600 | 1,08–1,12 |
| H1 artikel/data | 28–32 px | 44 px | 600 | 1,15–1,20 |
| H2 bagian | 22 px | 28 px | 600 | 1,25 |
| Judul kartu isu | 19–22 px | 22 px | 600 | 1,30 |
| Lead/ringkasan | 17 px | 19 px | 400 | 1,55 |
| Isi artikel | 17 px | 17 px | 400 | 1,60 |
| Form/tombol/tabel | 16 px | 16 px | 500/400 | 1,45–1,50 |
| Metadata/caption | 14 px | 14 px | 400/500 | 1,50 |

### Aturan penyusunan

- Judul display memakai tracking sekitar `-0.035em`; judul bagian `-0.02em`; teks isi normal.
- Paragraf rata kiri, tidak di-justify dan tidak ditengahkan.
- Lebar baca target 60–72 karakter pada desktop; ponsel mengikuti ruang tersedia.
- `text-wrap: balance` untuk judul dan `pretty` untuk paragraf sebagai progressive enhancement.
- Satu H1 per halaman. Urutan heading mengikuti isi, bukan ukuran visual yang diinginkan.
- Angka tabel, tanggal terstruktur, dan statistik memakai `font-variant-numeric: tabular-nums lining-nums`.
- Nama indikator, status, dan judul isu boleh membungkus. Jangan memakai ellipsis/line-clamp pada informasi pokok.
- Hindari font sangat tipis; seluruh metadata yang penting tetap kontras dan terbaca.

---

## 5. Tata letak dan ruang

### Grid dan container

- Lebar container utama maksimal **1200 px**, termasuk padding inline.
- Lebar kolom bacaan maksimal **68ch**.
- Gutter: **16 px** di ponsel, **32 px** di tablet, **48 px** di desktop.
- Dasar spacing: **4, 8, 12, 16, 24, 32, 48, 64, 96 px**.
- Label ke input: 8 px; elemen satu kelompok: 12–16 px; antarkelompok: 24–32 px.
- Jarak antarbagian: 48 px ponsel, 64–96 px desktop, sesuai kepadatan isi.
- Area perbandingan lebih rapat: 24–32 px antarblok agar hubungan grafik, angka, dan metode tidak terputus.

### Breakpoint berdasarkan kebutuhan isi

| Rentang | Perilaku |
|---|---|
| <768 px | Satu kolom utama; kontrol bertumpuk; metadata membungkus; kolom waktu di atas isi. |
| 768–1023 px | Kontrol dapat dua kolom; beranda tetap mengikuti panjang judul, bukan memaksa kartu sempit. |
| ≥1024 px | Beranda lead 7/12 dan pendamping 5/12; artikel dengan kolom bacaan terukur; kontrol pembanding satu baris bila cukup. |

Gunakan `minmax(0, 1fr)` untuk track fleksibel. Selalu uji pada 360, 390, 768, 1024, dan 1440 px serta zoom 200%. Jangan menyembunyikan overflow untuk menutupi kesalahan lebar.

### Bentuk dan elevasi

| Elemen | Radius / perlakuan |
|---|---|
| Artikel, daftar pembaruan, tabel | 0; struktur ditunjukkan oleh tipografi dan garis horizontal. |
| Tombol dan select | 8 px. |
| Panel catatan/kelompok kontrol | 12 px. |
| Satu bidang unggulan bila diperlukan | Maksimal 16 px; tidak diulang pada setiap bagian. |
| Overlay penjelasan istilah | 12 px; satu shadow ringan karena benar-benar berada di atas konten. |

Tidak ada shadow pada setiap kartu. Glassmorphism, gradient, glow, dan tekstur dekoratif tidak menjadi bahasa visual produk ini.

---

## 6. Navigasi dan kerangka halaman

### Header

- Wordmark nama kerja di kiri, Pantau dan Bandingkan di kanan.
- Minimum tinggi 64 px desktop dan 56 px ponsel, dengan tinggi otomatis saat teks membungkus.
- Background solid; pemisah bawah tipis. Tidak memakai logo berupa emoji.
- Active nav ditandai bobot 600 dan underline/inset rule, bukan tiga pil besar.
- Kedua tautan utama tetap terlihat pada 360 px. Saat zoom/ukuran teks besar, header boleh menjadi dua baris.
- Header boleh sticky pada desktop bila tidak menutupi konten/fokus; ponsel memakai alur normal.
- Skip link menjadi fokus pertama. Jika sticky aktif, berikan `scroll-margin-top` pada target heading dan fokus.

### Footer

- Pemisah horizontal, nama produk, deskripsi singkat, dan tautan Metode, Tentang, Editorial, Koreksi, Privasi.
- Tautan minimal area sentuh 44 px, dapat disusun dua kolom di ponsel.
- Identitas, alamat kontak, jadwal, dan tahun yang ditampilkan berasal dari konfigurasi nyata.
- Tidak menampilkan logo media/BPS sebagai dukungan terhadap produk. Atribusi sumber ditulis sebagai atribusi.

---

## 7. Beranda Pantau

### Struktur visual

```text
Nama produk                                      Pantau  Bandingkan
──────────────────────────────────────────────────────────────────
Pahami isu. Periksa buktinya.
Penjelasan singkat tentang apa yang tersedia di situs.

Isu pilihan                            Isu lainnya
Judul isu unggulan                     Judul isu kedua
Ringkasan kartu                        Ringkasan, status, tanggal
Status · Diperiksa [tanggal]            ───────────────────────────
Baca penjelasan →                      Judul isu ketiga
                                       Ringkasan, status, tanggal
──────────────────────────────────────────────────────────────────
Pembaruan terbaru
Tanggal                Perubahan substantif + tautan isu
Tanggal                Perubahan substantif + tautan isu
──────────────────────────────────────────────────────────────────
Bandingkan indikator antarperiode       Buka pembanding →
Penjelasan cakupan dan metode dalam kalimat pendek.
──────────────────────────────────────────────────────────────────
Footer
```

Diagram adalah struktur, bukan data atau copy politik siap terbit.

### Aturan

- Intro kiri, singkat, dengan jalur cepat “Jelajahi isu / Bandingkan data / Cara kami memeriksa” agar pengguna baru langsung memilih jalur (terimplementasi).
- Strip kepercayaan tiga kolom (sumber primer, metode terbuka, koreksi tercatat) tepat di bawah intro — trust architecture di atas fold, bukan footer (terimplementasi).
- Isu ditampilkan sebagai **kartu berbingkai** dengan boundary, kategori uppercase aksen, chip status, sparkline + angka kunci indikator terkait, jumlah sumber, tanggal relatif + absolut, dan CTA tombol “Lihat bukti & sumber” (terimplementasi).
- Satu isu unggulan memakai aksen kiri; dua pendamping setara secara visual. Tanpa JS seluruh kartu tampil; pencarian + filter topik menyaring kartu secara progresif (terimplementasi).
- Hitungan “N isu · N topik” memberi sense skala; kolom pencarian + chip topik menyiapkan skala 50–500 isu (terimplementasi).
- Pembaruan berbentuk timeline ringkas satu baris tanggal relatif (“7 hari lalu”) + judul + status; berlabel “Pembaruan penjelasan” agar tidak terbaca sebagai kronologi peristiwa (terimplementasi).
- Ringkasan kartu sekitar maksimal 35 kata, status dan tanggal selalu tersedia.
- Label **Isu pilihan**, bukan Trending atau persentase popularitas.
- Modul pembanding memakai penjelasan nyata + tautan langsung, bukan angka dekoratif.
- Tidak ada tinggi hero tetap `100vh`. Judul display ponsel dibatasi 32 px agar konten aktual terlihat tanpa gulir panjang.

---

## 8. Halaman isu

### Urutan wajib

1. Breadcrumb ringkas.
2. Judul isu sebagai H1.
3. Ringkasan 60–100 kata beserta sitasi yang relevan.
4. Status, tanggal pemeriksaan, publikasi/pembaruan, penulis, dan pemeriksa.
5. Dampak pada kelompok terkait.
6. Kronologi.
7. Posisi atau tindakan pihak terkait.
8. Data relevan bila ada.
9. Sumber lengkap dan riwayat koreksi.

Koreksi atau ketidakpastian material juga mendapat pemberitahuan dekat bagian yang terdampak; bukan hanya ditaruh di bawah halaman.

### Komposisi

- Judul dan isi rata kiri pada satu sumbu. Kolom bacaan tidak melebar menjadi seluruh layar desktop.
- Dampak menggunakan subjudul kelompok dan paragraf bersitasi, bukan tiga kartu ikon dekoratif.
- Pernyataan pihak dan proyeksi diberi label teks yang jelas.
- Status empat jenis memakai warna netral; status Diterapkan tidak otomatis berwarna hijau atau dianggap berhasil.
- Label **Belum diperiksa ulang sejak [tanggal]** tampil penuh dalam panel warning dekat tanggal.
- Tanggal panjang dan identitas panjang dapat membungkus tanpa memotong isi.
- Tindakan berbagi tersedia setelah inti artikel; tidak berupa panel melayang yang menghalangi bacaan.

### Kronologi

- Garis vertikal ringan dengan titik kejadian; tanggal menjadi anchor baca, bukan ilustrasi progres.
- Desktop memakai kolom tanggal sekitar 112 px dan kolom isi fleksibel; mobile tanggal di atas isi.
- Peristiwa terbaru terbuka. Peristiwa lama memakai disclosure native atau kontrol yang setara secara aksesibilitas.
- Ringkasan kejadian dan tautan sumber tetap tersedia tanpa membuka detail tambahan, agar sumber klaim dapat dicapai dalam dua tindakan dari kartu isu.
- Tanggal kejadian dibedakan dari tanggal pemberitaan. Presisi bulan/tahun tidak ditampilkan seolah-olah tanggal hari yang pasti.
- Bukti fakta, pernyataan, dan analisis memakai teks, bukan sekadar warna titik.
- Tidak ada progress bar, persentase penyelesaian, animasi garis terisi, atau ticker live.

### Istilah dan sumber

- Istilah memiliki pemicu teks bergaris bawah putus-putus dan nama aksesibel, misalnya Jelaskan TPT.
- Panel istilah mengikuti pemicu, dibatasi viewport, dapat ditutup dengan tombol/Escape, dan mengembalikan fokus.
- Gunakan popover hanya jika dukungan dan fallback telah diuji; definisi HTML tetap dapat dijangkau saat JS mati.
- Sumber memakai label yang bermakna, misalnya **Sumber BPS [1]**, dengan area sentuh memadai.
- Sitasi klaim menuju dokumen sumber secara langsung bila memungkinkan; daftar akhir memberi publisher, judul, locator, dan tanggal akses.
- Jangan menyembunyikan batas metode, koreksi, atau sumber wajib dalam tooltip.

---

## 9. Pembanding

### Prinsip

Pembanding adalah alat baca data. Ruang kosong mendukung keterbacaan tetapi tidak memisahkan kontrol, grafik, angka, dan metode menjadi beberapa layar yang tidak berkaitan.

### Susunan

```text
Bandingkan indikator
Deskripsi singkat + pilihan bawaan + batas atribusi

Indikator [pilihan]   Periode A [pilihan]   Periode B [pilihan]
Mode waktu:  Kalender | Rentang setara

Judul indikator · satuan
Rentang observasi · jumlah observasi · pengecualian tahun transisi
Legenda: garis utuh/lingkaran A · putus-putus/persegi B

[ Grafik dengan sumbu, label angka, dan skala bersama ]

Ringkasan A                              Ringkasan B
Awal–akhir, statistik sesuai indikator, cakupan

Lihat angka       Bagikan perbandingan       Metode
[ Tabel HTML bawaan, terbuka tanpa JavaScript ]

Definisi · periode rujukan · catatan metode · sumber
```

### Kontrol

- Select native sebagai dasar; teks minimal 16 px, tinggi minimal 48 px, label selalu terlihat. Padding kontrol ringkas agar satu blok tak memakan satu layar.
- Mobile kontrol satu kolom; grid `indikator / A / ⇄ / B`; tombol tukar ⇄ menempel di antara periode (terimplementasi).
- Mode waktu memakai dua radio berlabel atau segmented control yang benar secara semantik + disclosure “Apa bedanya Kalender vs Rentang setara?” dengan contoh tahun nyata (terimplementasi).
- Disclosure “Tahun yang dipakai dalam hitungan” menjelaskan pengecualian 2004/2014/2024 tepat di kontrol (terimplementasi).
- Kontrol sticky di desktop setelah melewati header agar konteks pilihan tak hilang saat membaca hasil; tautan “ubah pilihan” untuk mobile (terimplementasi parsial: sticky desktop).
- Pesan periode sama muncul dekat kontrol dan mempertahankan keadaan valid sebelumnya.
- Perubahan indikator memperbarui grafik, judul, tabel, satuan, rentang, ringkasan, sumber, dan catatan secara bersamaan.
- Fokus tetap pada kontrol yang digunakan. Live region cukup menyebut indikator dan cakupan yang baru.

### Grafik

- SVG dengan grafik garis; tinggi 320 px mobile dan 420 px desktop. Lebar penuh plot, bukan kartu sempit (terimplementasi).
- ViewBox saja tidak cukup untuk responsivitas: gunakan dua render (lebar/sempit) dengan jumlah tick berbeda; label ≥14 px pada ukuran render (terimplementasi).
- Garis 3 px, titik r 4,5 (lingkaran A / persegi B) + teks; titik dapat difokuskan keyboard dengan tooltip native (terimplementasi).
- Label langsung di ujung garis (“2005–13”, “2015–23”) agar pembaca tak bolak-balik legenda (terimplementasi).
- Kalender memakai posisi tahun asli. Rentang setara memakai tahun penuh ke-1, ke-2, dan seterusnya, dengan tahun kalender asal tetap tersedia.
- Tidak boleh menggambar dua seri menumpuk pada indeks tahun ke-1 saat kontrol menunjukkan Kalender.
- Sumbu Y bersama, mencakup nol, dan unit eksplisit (judul sumbu + satuan pada tick teratas); garis nol mendapat penekanan saat domain melintasinya (terimplementasi).
- Domain suatu indikator tidak berubah hanya karena A/B ditukar atau mode waktu diganti. Jika domain bukan dari nol, rentang sumbu harus jelas dan pemotongan yang berpotensi menyesatkan diberi penjelasan.
- Grafik batang jika kelak ditambahkan harus memakai dasar nol.
- Gridline ringan, 4 tick X mobile / 7 desktop; tampilkan nilai tick. Tidak ada grafik tanpa angka sumbu.
- **Encoding ganda yang dibedakan:** garis terputus = data kosong; segmen titik-titik + penanda berlian = pergantian versi seri. Keduanya tak boleh memakai satu gaya (terimplementasi).
- Tahun transisi diarsir + berlabel “transisi” pada mode kalender (terimplementasi).
- Penanda konteks (2008, 2020) bergaris putus-putus + label + catatan “konteks, bukan atribusi”, bersumber dan netral (terimplementasi).
- Footer SVG memuat merek, jumlah sumber, dan caveat non-kausal agar grafik tetap jujur saat dibagikan (terimplementasi).
- Tidak ada gradient area, glow, animasi garis berjalan, skor total, atau penanda pemenang.

### Ringkasan angka

- Satu kelompok ringkasan per periode, berbobot visual sama. Pada ponsel kedua kelompok bertumpuk.
- Nilai awal dan akhir dilabeli tahun serta unit; jangan tampilkan angka besar tanpa jendela waktu.
- PDB/inflasi: mean, **median**, minimum–maksimum **beserta tahunnya**, dan “N dari 9 tahun tersedia”; mean bukan pertumbuhan kumulatif (terimplementasi).
- Kemiskinan/TPT: perubahan dalam poin persentase; Gini dalam poin indeks.
- **Delta eksplisit A vs B** dengan satuan yang benar (poin persentase/poin indeks/unit) + catatan “Deskriptif; bukan bukti sebab-akibat” (terimplementasi).
- Setiap kelompok memiliki disclosure “Cara membaca angka ini” agar metodologi ada sebelum kesimpulan (terimplementasi).
- Nilai parsial atau metode tak kompatibel memiliki penjelasan terlihat dan hitungan yang diwajibkan lengkap diblokir.
- Tanda minus ditulis dengan format konsisten; panah hijau/merah tidak digunakan untuk menghakimi seluruh pemerintahan.

### Tabel

- Caption menyebut indikator, satuan, dan periode. Header kolom menyebut tahun/seri dengan jelas.
- Angka rata kanan, label rata kiri, angka tabular; presisi sesuai indikator, tanpa membulatkan data mentah.
- Garis horizontal seperlunya, tanpa kotak pada setiap sel dan tanpa striped table yang terlalu kuat.
- `Tidak tersedia` ditulis penuh untuk missing; jangan memakai tanda minus yang ambigu.
- Bentuk panjang `Tahun | Periode | Nilai` direkomendasikan untuk kalender; mode setara dapat memakai `Tahun penuh ke-… | A (tahun) | B (tahun)`.
- Tabel 360 px harus tetap dapat dibaca. Bila bentuk lebar diperlukan, scroll hanya di region tabel yang berlabel dan dapat diakses keyboard, bukan pada halaman.
- Tombol Lihat angka membuka tabel dalam satu tindakan. Tanpa JS tabel tetap terbuka; label dan `aria-expanded` harus mengikuti keadaan sebenarnya.

---

## 10. Halaman indikator dan kepercayaan

### `/indikator/{slug}/`

- H1, definisi, unit, periode rujukan, dan batas interpretasi sebelum grafik.
- Grafik/tabel memakai komponen serta model yang sama dengan pembanding.
- Satu tautan jelas untuk membuka indikator tersebut pada pembanding.
- Sumber dan metode dapat diperiksa tanpa JS. Status audit hanya ditampilkan sesuai bukti review yang nyata.

### `/metode/`, `/tentang/`, `/editorial/`, `/privasi/`, `/koreksi/`

- Layout bacaan yang sama; H1 lebih tenang daripada display beranda.
- Daftar isi jangkar hanya bila halaman panjang dan membantu navigasi.
- Halaman metode menggunakan contoh berlabel jelas, definisi, dan tabel; tidak memakai ilustrasi abstrak untuk mengisi ruang.
- Riwayat koreksi berbentuk daftar bertanggal dengan tautan halaman terdampak, alasan, perubahan, dan sumber.
- Tentang menampilkan identitas serta peran yang benar-benar ada; jangan menciptakan kesan tim besar.
- Kebijakan privasi mencerminkan konfigurasi sebenarnya, termasuk analitik/iklan nonaktif bila memang demikian.
- 404 memberi jalan kembali ke Pantau dan Bandingkan, tanpa iklan atau ilustrasi besar.

---

## 11. Interaksi dan microcopy

### Delapan keadaan dasar

Terapkan pada elemen yang relevan; jangan menciptakan spinner untuk HTML yang sudah tersedia.

| Keadaan | Desain dan perilaku |
|---|---|
| Default | Teks/label jelas, bentuk tidak mengandalkan hover. |
| Hover | Perubahan warna/border halus; hanya pada perangkat yang mendukung hover. |
| Focus | Ring 3 px dengan offset 3 px, tetap terlihat pada seluruh permukaan. |
| Active | Respons warna segera; tidak memperbesar kartu atau menggeser layout. |
| Disabled | Alasan tertulis dekat kontrol; tidak hanya opacity rendah. |
| Loading | Pertahankan tinggi hasil dan data sebelumnya dengan label keadaan yang tepat; tidak memasangkan judul baru dengan grafik lama. |
| Empty | Penjelasan spesifik tentang isi/data yang belum tersedia. |
| Error | Apa yang gagal, keadaan yang ditampilkan, dan tindakan berikutnya. |

### Copy yang dipakai

| Situasi | Teks |
|---|---|
| Tautan isu | Lihat bukti & sumber |
| Kontrol tabel tertutup | Lihat angka |
| Kontrol tabel terbuka | Sembunyikan angka |
| Berbagi | Bagikan perbandingan |
| Clipboard berhasil | Tautan disalin. |
| Clipboard gagal | Tautan belum dapat disalin. Salin alamat di bawah ini. |
| Periode sama | Pilih dua pemerintahan yang berbeda. |
| Query invalid | Pilihan pada tautan tidak dikenali. Pilihan bawaan ditampilkan. |
| Loading perubahan | Memuat data untuk pilihan ini… |
| Pemuatan pilihan gagal | Pilihan ini belum berhasil dimuat. Tabel bawaan masih ditampilkan. Baca metode. |
| Audit blocked | Data belum dapat dibandingkan. Pemeriksaan metode belum selesai. |
| Belum ada isu terbit | Belum ada isu yang diterbitkan. Penjelasan akan muncul setelah pemeriksaan editorial. |
| Belum ada koreksi | Belum ada koreksi yang diterbitkan. |
| JavaScript nonaktif | Tabel menampilkan pilihan bawaan. Aktifkan JavaScript untuk mengganti pilihan. |
| Keterkinian | Belum diperiksa ulang sejak [tanggal]. |

Pesan gagal harus mengikuti keadaan sebenarnya. Jika yang dipertahankan adalah pilihan valid terakhir, sebut **pilihan sebelumnya**, bukan **tabel bawaan**.

- Gunakan Bahasa Indonesia dengan sentence case dan istilah yang dijelaskan.
- Hindari klaim Paling netral, 100% akurat, Real-time, Dipercaya ribuan pembaca, dan Terverifikasi tanpa bukti yang sesuai.
- Kata Berhasil dibagikan tidak dipakai sebagai pengganti Tautan disalin.
- Pembatalan share pengguna tidak memunculkan pesan error.
- Fallback manual menggunakan input readonly/selectable, bukan URL panjang yang merusak lebar halaman.

---

## 12. Motion, ikon, dan media

### Motion

- `--duration-fast: 150ms`; `--duration-base: 200ms`; keluar panel 150 ms.
- Easing utama `cubic-bezier(0.2, 0, 0, 1)`.
- Transisi hanya properti yang diperlukan: warna, border, opacity, atau transform kecil pada elemen overlay.
- Interaksi harus memberi feedback segera; jangan menahan pembaruan angka demi animasi.
- Tidak ada `transition: all`, reveal setiap section, count-up angka, parallax, atau autoplay.
- `prefers-reduced-motion: reduce` menghilangkan gerak nonesensial dan smooth scroll; isi tidak pernah menunggu animasi untuk terlihat.

### Ikon dan fotografi

- Ikon outline konsisten 20/24 px, stroke sekitar 1,75–2 px; gunakan SVG seperlunya.
- Ikon dekoratif `aria-hidden`; tombol ikon memiliki nama aksesibel dan area minimal 44 × 44 px.
- Chevron menandakan disclosure; external-link menjelaskan tautan sumber bila diperlukan; tidak setiap heading diberi ikon.
- Ikon hanya untuk fungsi yang terbaca cepat: pencarian, tukar periode (⇄), unduh CSV, info mode, tautan eksternal (↗; tautan internal memakai →). Kategori/status/sumber tidak dibanjiri ikon.
- Foto opsional dan harus menambah konteks. Gunakan sumber berizin, caption, alt, serta dimensi yang jelas.
- Jika foto tidak tersedia, komposisi tipografi tetap lengkap. Tidak diganti manusia buatan AI, gedung generik, atau gambar dramatis tanpa konteks.
- Gambar di bawah fold dapat lazy-load; gambar LCP bila ada tidak lazy-load.

---

## 13. Token implementasi yang dituju

Contoh ini menjadi spesifikasi untuk `src/styles/tokens.css` saat redesign. Jangan menyalin beberapa nilai ke tiap komponen; konsumsi token yang sama.

```css
:root {
  color-scheme: light;
  --font-sans: "Manrope", system-ui, sans-serif;

  --color-page: #fafaf7;
  --color-surface: #ffffff;
  --color-surface-muted: #f1f2ef;
  --color-text: #171a19;
  --color-text-muted: #59615e;
  --color-divider: #dadfd9;
  --color-control-border: #727c76;
  --color-accent: #096c60;
  --color-accent-hover: #07554c;
  --color-accent-soft: #e8f2ef;
  --color-warning: #87511b;
  --color-warning-soft: #fff3df;
  --color-error: #9e3434;
  --color-error-soft: #fbefec;
  --color-series-a: #096c60;
  --color-series-b: #536579;

  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-12: 3rem;
  --space-16: 4rem;
  --space-24: 6rem;

  --text-meta: 0.875rem;
  --text-ui: 1rem;
  --text-body: 1.125rem;
  --text-lead: clamp(1.125rem, 1rem + 0.4vw, 1.25rem);
  --text-card: clamp(1.375rem, 1.2rem + 0.65vw, 1.75rem);
  --text-section: clamp(1.5rem, 1.25rem + 1vw, 2rem);
  --text-title: clamp(2rem, 1.5rem + 2vw, 3rem);
  --text-display: clamp(2.25rem, 1.5rem + 3vw, 4rem);

  --container-max: 75rem;
  --measure: 72ch;
  --gutter: 1.25rem;
  --radius-control: 0.5rem;
  --radius-panel: 0.75rem;
  --radius-feature: 1rem;
  --shadow-overlay: 0 8px 24px rgb(23 26 25 / 10%);
  --duration-fast: 150ms;
  --duration-base: 200ms;
  --ease-ui: cubic-bezier(0.2, 0, 0, 1);
  --z-header: 10;
  --z-popover: 20;
  --z-skip-link: 30;
}

@media (min-width: 48rem) { :root { --gutter: 2rem; } }
@media (min-width: 64rem) { :root { --gutter: 3rem; } }

.container {
  inline-size: 100%;
  max-inline-size: var(--container-max);
  margin-inline: auto;
  padding-inline: var(--gutter);
  box-sizing: border-box;
}

.prose { max-inline-size: var(--measure); }
.numeric { font-variant-numeric: tabular-nums lining-nums; }

:where(a, button, select, input, summary):focus-visible {
  outline: 3px solid var(--color-accent);
  outline-offset: 3px;
}

::selection {
  background: var(--color-accent-soft);
  color: var(--color-text);
}
```

State aktif, warna tambahan, dan jarak baru harus berasal dari sistem ini atau ditambahkan dengan alasan penggunaan yang jelas. Nilai final diukur kembali pada komponen nyata.

---

## 14. Penerapan pada kode yang ada

### Titik perubahan

| Lokasi | Pekerjaan redesign |
|---|---|
| `src/styles/global.css` | Pisahkan token dan aturan dasar; terapkan tipografi, container, fokus, serta breakpoints. |
| `src/layouts/Base.astro` | Header ringkas, wordmark, active nav, footer, skip link, dan metadata warna browser. |
| `src/pages/index.astro` | Ubah unggulan + dua isu menjadi komposisi editorial, bukan grid tiga slot seragam. |
| `src/pages/isu/[slug].astro` | Rapikan urutan ringkasan/status, sitasi langsung, kolom baca, kronologi, dan pihak terkait. |
| `src/pages/bandingkan/index.astro` | Kelompok kontrol, hierarki hasil, tabel semantik, dan seluruh keadaan khusus. |
| `src/client/compare.mjs` | Sinkronisasi state tampilan; feedback tetap terlihat; sumber/definisi ikut berubah. |
| `src/lib/comparison/compute.mjs` | Kalender dan setara benar-benar berbeda; sumbu berangka, label, marker, serta segmentasi. |
| `src/pages/indikator/[slug].astro` | Gunakan komponen data dan token yang sama dengan pembanding. |
| `src/pages/{metode,tentang,editorial,privasi,koreksi}/` | Layout bacaan konsisten dan metadata nyata. |

`src/components/` menampung komponen yang memang dipakai ulang: `SiteHeader`, `SiteFooter`, `IssueTeaser`, `StatusLabel`, `SourceLink`, `Timeline`, `CompareControls`, `TrendChart`, `DataTable`, dan `InlineNotice`. Nama merupakan target, bukan daftar komponen yang sudah dibuat.

### Urutan implementasi

1. Pastikan satu sumber kode yang dibangun. Workspace memiliki `src/src/` dan ada salinan kerja Termux; identifikasi versi kanonis sebelum redesign agar pratinjau dan kode yang diedit tidak berbeda. Jangan menghapus salinan tanpa memeriksa isinya.
2. Implementasikan token, font berlisensi, aturan dasar, header, dan footer.
3. Selesaikan beranda dan halaman isu memakai judul panjang serta data terbit yang sah.
4. Selesaikan pembanding beserta perilaku kalender/setara, data hilang, sumber, dan tabel.
5. Terapkan sistem ke halaman indikator serta halaman kepercayaan.
6. Periksa visual, keyboard, pembaca layar, no-JS, dan ukuran aset pada hasil build yang sama.

Perubahan visual tidak boleh mengganti nilai dataset, status audit, atau tanggal pemeriksaan agar mockup terlihat lebih meyakinkan.

### Temuan awal yang harus diperhatikan saat redesign

- `.cards` sekarang mendefinisikan tiga kolom pada desktop walaupun bagian tersebut memuat dua isu pendamping; ganti struktur, bukan mengisi slot dengan konten tambahan.
- Header dan kartu memakai banyak badge serupa; berikan bobot berbeda pada kategori, status, serta tanggal.
- Grafik membutuhkan label sumbu, legenda, dan penanganan mode waktu yang benar; estetika tidak cukup bila semantik grafik salah.
- Teks sumber/definisi harus ikut berubah saat indikator dipilih; tampilan rapi dengan sumber indikator sebelumnya tetap merupakan kegagalan.
- Penjelasan sumber dan judul panjang harus diuji pada lebar 360 px dengan data nyata.

---

## 15. Aturan anti-slop proyek

### Pola yang ditolak

- Hero gradient ungu/biru, blob, glow, glassmorphism dekoratif, atau wallpaper grid/dot tanpa makna data.
- Hero template terpusat berisi badge, slogan umum, dua CTA, lalu tiga kartu fitur berikon.
- Semua elemen dibungkus kartu, radius besar yang sama, atau border/shadow pada setiap blok.
- Ikon emoji sebagai logo, angka besar palsu, testimoni rekaan, dan badge kepercayaan tanpa bukti.
- Teks abu-abu terlalu pucat, tombol terlalu kecil, nama indikator dipotong, atau sumber hanya terlihat saat hover.
- Animasi untuk semua section, grafik count-up, autoplay, dan scroll-jacking.
- Dark mode otomatis sebagai tambahan estetika yang belum diputuskan.
- Menambah pencarian, bookmark, akun, komentar, atau notifikasi sebagai ornamen navigasi padahal di luar P0.

### Penggantinya

| Kebiasaan generik | Pengganti khusus produk |
|---|---|
| Tiga kartu identik | Satu lead editorial dan dua isu pendamping. |
| Hero gambar dekoratif | Judul yang menjelaskan tugas, lalu isu aktual. |
| Trust badge | Sumber melekat pada klaim, tanggal pemeriksaan, dan koreksi terbuka. |
| Angka besar tanpa konteks | Nilai + unit + periode observasi + sumber. |
| Banyak warna status | Status teks netral; warna warning untuk keterkinian/error yang benar-benar bermakna. |
| Hover tooltip untuk angka | Grafik berlabel, ringkasan teks, dan tabel HTML. |
| Spasi besar seragam | Ruang mengikuti hubungan isi; area data lebih rapat daripada intro. |

Setiap keputusan harus menjawab: **mengapa tepat untuk pembaca yang sedang memahami isu atau memeriksa data ini?**

---

## 16. Kriteria penerimaan redesign

Checklist ini untuk pelaksanaan redesign, bukan klaim telah lulus.

### Visual

- [ ] Arah Editorial Precision terlihat pada beranda, isu, dan pembanding.
- [ ] Satu keluarga font utama digunakan konsisten; lisensi dan anggaran font diperiksa.
- [ ] Hierarki terlihat jelas tanpa kartu dan badge berulang.
- [ ] Ada detail khas kolom waktu dan sitasi yang menyatu dengan bacaan.
- [ ] Judul terpanjang, metadata panjang, nol isu, dan data blocked tidak merusak layout.

### Produk dan data

- [ ] Semua informasi wajib PRD tetap dapat ditemukan.
- [ ] Kartu → isu → sumber klaim maksimal dua tindakan.
- [ ] Pembanding → tabel maksimal satu tindakan.
- [ ] Mode kalender/setara, skala, missing, dan batas metode digambar benar.
- [ ] Sumber, definisi, satuan, tabel, dan ringkasan berubah bersama indikator.
- [ ] Status audit dan keterkinian mencerminkan pemeriksaan yang benar-benar dilakukan.
- [ ] Tidak ada skor total, pemenang, atribusi kausal otomatis, atau warna penilaian pemerintahan.

### Aksesibilitas dan performa

- [ ] Teks normal ≥4,5:1; komponen penting ≥3:1 pada seluruh state.
- [ ] Target sentuh utama minimal 44 × 44 px, termasuk nav dan disclosure.
- [ ] Keyboard, focus visible, urutan tab, Escape, dan fokus kembali bekerja.
- [ ] Pembaca layar mendapat label kontrol, caption tabel, dan perubahan yang ringkas.
- [ ] Lebar 360/390/768/1024/1440 px serta zoom 200% tidak memotong konten utama.
- [ ] Tidak ada scroll horizontal halaman; region tabel lebar memiliki alternatif aksesibel.
- [ ] Tanpa JavaScript, isi utama, sumber, serta tabel bawaan tersedia.
- [ ] Reduced motion dihormati dan isi awal langsung terlihat.
- [ ] JS awal situs ≤150 KB gzip, aset awal ≤1 MB, font sesuai anggaran.
- [ ] Hasil pengukuran laboratorium dicatat terpisah dari Web Vitals lapangan.

### Bukti yang dikumpulkan

Screenshot desktop dan ponsel dari beranda, isu terpanjang, pembanding pada kedua mode, keadaan blocked/error, serta tabel. Lengkapi dengan hasil pemeriksaan keyboard/TalkBack, no-JS, ukuran bundel, dan catatan regresi fitur.

---

## 17. Skill dan referensi

### Skill yang dipasang

- Nama: **`anti-slop-design`**.
- Repository: <https://github.com/Ferousco-dev/anti-slop-design>.
- Commit instalasi: `9798a726fb4235bc6146574c6fbe9d1b05038a76`.
- Lingkup: lokal workspace OpenCode, bukan konfigurasi global pengguna.
- Entry: `../.agents/skills/anti-slop-design/SKILL.md` relatif terhadap root aplikasi; lokasi kompatibel OpenCode yang digunakan CLI `skills`.
- Isi: entry skill, 20 modul referensi, template konteks proyek, dan lisensi MIT.
- Rekaman asal/checksum: `../.agents/skills/anti-slop-design/UPSTREAM.json`.

Pemasangan menggunakan berkas Markdown dari commit tetap di GitHub karena pengambilan langsung melalui CLI memerlukan `git` yang tidak tersedia pada lingkungan ini. Hash Git setiap berkas upstream diperiksa saat pengambilan, kemudian paket lokal dipasang menggunakan `skills add --agent opencode --copy`. Lokasi `.agents/skills/` didukung OpenCode dan dapat diperiksa dengan `skills list --agent opencode`. Pembaruan skill dilakukan eksplisit setelah isi versi baru ditinjau.

Modul paling relevan: filosofi (01), tipografi (04), layout (05), craft (11), pemeriksaan desain (13), workflow (14), jenis produk (15), dan visualisasi data (19). Prinsip proyek pada bagian 2 menentukan penyesuaian terhadap saran skill umum.

Skill adalah pedoman kerja agent, bukan library browser atau pengubah tampilan otomatis. Muat ulang sesi OpenCode untuk memperbarui daftar skill. Jika loader tool tetap gagal di Android, baca entry dan modul terkait langsung dari berkas; pemasangan tidak memerlukan perubahan permission yang sudah ada.

### Referensi arah

- Apple: <https://www.apple.com/id/> — referensi hierarki, ruang, dan penyelesaian detail sesuai arahan pemilik.
- Tesla: <https://www.tesla.com/> — referensi fokus komposisi dan navigasi ringkas sesuai arahan pemilik.
- Our World in Data: <https://ourworldindata.org/> — referensi penyajian data, tabel, serta sumber dari PRD.
- OpenCode Agent Skills: <https://opencode.ai/docs/skills/> — format dan lokasi penemuan skill.

**Keputusan akhir:** kesan elegan dibangun melalui kualitas membaca, konsistensi kontrol, dan ketepatan data. Ornamen hanya layak hadir jika membantu tugas tersebut.

---

## 18. Arah C — Arsip Ruang Redaksi (mengikat sejak 30 September 2026)

Keputusan pemilik: arah C (Hybrid Editorial + Top Secret) menggantikan
pembatasan CP01 poin 7. Kontrak mengikat: `docs/checkpoints/CP16-arah-C.md`;
pelaksanaan: `docs/checkpoints/CP17-pelaksanaan-C.md`.

Koran untuk alur baca publik, dossier untuk pembungkus berkas/bukti.
Cap selalu horizontal dan jujur — hanya “ARSIP PUBLIK”,
“DRAF PRATINJAU — BELUM AUDIT”, “KOREKSI TERCATAT”. Dilarang: “TOP SECRET”,
“RAHASIA NEGARA”, “RESMI”, “TERVERIFIKASI”, klaim otoritas, watermark,
logo/brand referensi, dan bilah apa pun yang menutupi informasi nyata.
Tekstur hanya CSS (grain halus, garis ganda, kotak filing putus-putus).

Palet: kertas `#f3ecdc`, permukaan `#faf6ea`, tinta `#211a12`,
merah cap `#a32c21` (15 pasangan kontras terverifikasi, teks ≥4,5:1).
Tipografi tiga peran: serif display, sans isi, caps + mono untuk kode berkas.
Grafik/tabel tetap fungsional di dalam bingkai exhibit.

### 18.1. Refinemen Dossier Vintage

Rencana terinci: `docs/redesign-vintage/PLAN.md`; keputusan rencana CP18.
Metafora dossier diperkuat pada pembungkus berkas/bukti, bukan pada data
atau klaim otoritas. ENERGY 2 / RHYTHM 2 / MOTION 1.

- Papan nama berupa tipografi, strip arsip tinta tipis, dateline menjelaskan
  tanggal build, navigasi utama terlihat tanpa header sticky tinggi.
- Lead isu memiliki filing tab/kode dari register-map dan satu offset solid;
  pendamping berbobot lebih ringan. Register memakai baris indeks berkas.
- Kepala berkas dan frame putus-putus mengelompokkan bukti. JEJAK BUKTI
  adalah label sumber, bukan cap tambahan atau action yang menduplikasi
  Buka sumber.
- Tekstur hanya CSS pada kertas/frame; permukaan teks dan plot tetap
  solid. Tidak memakai gambar referensi sebagai background, paperclip
  raster, noda, watermark, robekan atau bilah penutup informasi.
- Source Serif 4 weight 600 untuk display, Manrope untuk isi/angka,
  mono sistem hanya metadata berkas. Tidak menambah aset font.
- Token radius dua px, spasi mengikuti hubungan isi, target kontrol
  minimal 44 px dan state dapat membungkus tanpa memotong judul/status.
- Desktop, intermediate dan narrow adalah keadaan layout yang berbeda;
  tidak ada dua toolbar sticky yang menutup fokus/isi. Tema terang saja.
- Halaman isu menyatukan dampak/bukti tanpa kehilangan sitasi/proyeksi.
  Pembanding tetap menyediakan tabel bawaan tanpa JS dan frame exhibit
  yang tidak memberi bobot pemenang pada seri A/B.
- Missing, perubahan versi, kelayakan statistik dan ekspor adalah bagian
  dari ketepatan tampilan. Desain tidak mengubah angka atau flag editorial.

Nilai hex, wording cap, sumber dan kode berasal dari kontrak/konten, bukan
OCR atau perkiraan gambar generatif. Referensi visual bukan bukti kontras
render, font persis, viewport, zoom atau pengujian browser. Hasil QA nyata
dicatat di checkpoint implementasi tersendiri.
