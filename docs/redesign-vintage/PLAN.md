# Rencana eksekusi: Dossier Vintage

Status: desain sudah diimplementasikan atas permintaan pemilik. Hasil nyata dan batas verifikasi di [CP19](../checkpoints/CP19-implementasi-dossier-vintage.md); belum publish dan bukan persetujuan audit editorial. Kontrak faktual/aksesibilitas CP16 tetap berlaku. Referensi visual: [homepage-v2.png](homepage-v2.png); [audit konsep sebelum implementasi](AUDIT.md).

## 1. Target visual

Nama arah: **Arsip Ruang Redaksi · Dossier Vintage**.

Dari koran digital yang bersih menuju berkas redaksi berkarakter, tanpa menjadi layanan pemerintah atau dokumen rahasia. Nuansa yang diminta pemilik dibentuk oleh kertas hangat, kepala berkas, tab filing, aturan ganda, label mesin ketik dan cap horizontal yang jujur. Bukan label rahasia, bilah redaksi atau watermark.

ENERGY 2 / RHYTHM 2 / MOTION 1. Komposisi dasar v1 dipertahankan: isu unggulan dominan, dua isu pendamping, register, exhibit pembanding; desktop dan ponsel memakai sistem yang sama.

## 2. Keputusan yang dikunci untuk eksekusi

- Palet existing: halaman #f3ecdc, permukaan #faf6ea, tinta #211a12, metadata #6f6353, merah cap #a32c21, seri B #5f6b52. Gambar generatif bukan sumber nilai hex.
- Font existing: Source Serif 4 untuk masthead/headline; Manrope untuk isi, tabel, kontrol; mono sistem untuk kode/metadata filing. Tidak mengunduh font dekoratif baru.
- Strip arsip tinta gelap, tipis dan dapat membungkus di ponsel. Masthead jangan menjadi header sticky tinggi.
- Double rule hitam tebal-tipis: pemisah seksi, bukan border untuk segala elemen.
- Lead isu berupa satu dossier utama dengan tab **BERKAS PP-001**, kepala berkas untuk kategori, judul serif, ringkasan, status proses, sumber. Isu pendamping memakai framing lebih ringan, bukan tiga kartu setara.
- Kode berkas dari register-map, tidak hard-code urutan PP saat membuat komponen; PP-001 energi, PP-002 pemilu, PP-003 kemiskinan adalah data sekarang, bukan aturan universal.
- Frame filing putus-putus dan corner mark hanya membungkus berkas/bukti, tidak menutupi konten. Tab tidak boleh keluar dari viewport atau parent pada zoom.
- Satu offset solid sekitar 3px untuk dossier unggulan bila diperlukan. Tidak membuat semua panel mengambang.
- Tekstur hanya CSS, tipis di area halaman/frame dan nyaris bersih di area teks/grafik. Tidak memakai PNG referensi sebagai background, tidak mengimpor raster grain atau gambar paperclip.
- Grain pada image v2 merupakan mood reference; kepadatan tekstur bitmap tidak perlu ditiru literal. Tidak memakai huruf body distressed, robekan, noda atau animasi berulang.
- **JEJAK BUKTI** adalah label filing/source group, bukan cap baru atau action ketiga yang menduplikasi Buka sumber. Gunakan satu tindakan sumber yang jelas dan beri href ke target yang ada.
- Cap hanya ARSIP PUBLIK, DRAF PRATINJAU — BELUM AUDIT, KOREKSI TERCATAT bila koreksi benar-benar ada. Semuanya horizontal. Dilarang cap otoritas atau label rahasia.
- Border/sudut filing mendekati siku; kontrol tetap punya target minimum 44×44 px. Metadata tidak lebih kecil dari anggaran keterbacaan existing.
- Grafik/tabel tetap modern, jelas dan tanpa tekstur di area plot. Bedakan seri lewat garis, marker dan label, bukan penilaian politik.

## 3. Audit gambar dan batas referensi

Gambar v2 sudah ditinjau utuh dan crop ponsel. Kode isu sesuai, cap terlihat horizontal, judul tetap terbaca dan tidak ada bilah penutup atau statistik promosi. Tidak terlihat frasa yang mengklaim rahasia atau otoritas.

Ini bukan hasil QA browser: rasio kontras piksel, font persis, target sentuh, posisi sticky, overflow kontinu, keyboard dan TalkBack belum dibuktikan. Em dash literal dalam cap adalah pengecualian kontrak terhadap R-02 anti-slop, bukan izin mengubah token wajib. Jangan mengklaim semua aturan filter atau aksesibilitas telah lolos dari gambar.

## 4. Urutan kerja dan berkas

### Tahap 0: baseline dan lingkup

- Kerjakan checkout `/data/data/com.termux/files/home/pantau-politik`; jangan otomatis mengubah salinan lama di tmp/shared storage.
- Catat git status dan baseline check/build/test/integration/audit terhadap kandidat yang sama.
- Baca CP16/CP17, README, DESIGN Bab18 dan audit bug. Jangan ubah angka, sumber, status audit atau tanggal pemeriksaan untuk menyesuaikan mockup.
- Tidak melakukan major dependency upgrade bersama redesign. Temuan npm audit ditangani sebagai pekerjaan keamanan tersendiri dengan penilaian dampak.

### Tahap 1: fondasi dan masthead

Berkas: `src/styles/tokens.css`, `src/styles/global.css`, `src/layouts/Base.astro`, `src/components/shared/BrandMark.astro` bila perlu.

- Selaraskan radius/spacing/header offsets yang saat ini tersebar.
- Tambahkan token/kelas filing-tab, filehead, dossier-frame, double-rule dan texture-intensity dengan nama konsisten.
- CSS grain/pseudo-element harus pointer-events:none, tidak menimpa teks/fokus dan tidak membawa label yang tampak sebagai fakta.
- Strip/masthead desktop dan mobile konsisten; nav Pantau/Bandingkan/Metode tetap tersedia.
- Sinkronkan favicon/theme/manifest dengan palet baru jika ada sisa arah lama, tanpa mendesain logo baru di luar lingkup.

### Tahap 2: beranda dan register

Berkas: `src/pages/index.astro`, `src/components/issues/IssueRegisterEntry.astro`, `src/components/issues/UpdateLedger.astro`, `src/client/home-filter.mjs` hanya bila diperlukan.

- Terapkan lead dossier dan pendamping kliping, tetap berdasarkan editorial-order.
- Filehead membaca kode dan kategori dari data; satu CTA membaca dan sumber yang jelas.
- Intro singkat, status pratinjau dekat isi; register index terasa filing, bukan tabel administratif berlebihan.
- Search/filter/reset dan hasil kosong tetap bekerja; jangan menghilangkan hash tautan ketika menormalisasi URL.
- Kawat koreksi/pembaruan hanya memakai entri nyata. Tidak menciptakan jumlah sumber atau indikator promosi.
- Bila sparkline dipertahankan, jangan menghapus missing lalu menyambungkan garis atau mengabaikan versi. Gunakan model bersama atau hilangkan sparkline yang tidak layak.

### Tahap 3: halaman isu dan bukti

Berkas: `src/pages/isu/[slug].astro`, komponen shared SourceLinks/SourceRecord/Freshness.

- Pembungkus sumber sebagai dossier; isi artikel tetap kolom bacaan bersih.
- Kurangi pengulangan dampak dan klaim-bukti tanpa membuang isi, sitasi/proyeksi atau arti faktual.
- Rail/daftar isi mobile berada sebelum isi panjang, bukan setelah seluruh artikel seperti board skematis v1.
- Jangan menyimpulkan pihak terkait hanya dari kesamaan sumber sebagai relasi baru; perubahan skema aktor di luar lingkup visual perlu dibahas terpisah.
- Tanggal naskah dan pemeriksaan tetap dibedakan; jangan menganggap tanggal build membuktikan data segar.

### Tahap 4: pembanding dan konsistensi kelayakan data

Berkas: `src/components/comparison/ComparisonPanel.astro`, ComparisonPreview/CompareToolbar, `src/pages/bandingkan/index.astro`, halaman indikator, `src/client/compare.mjs`, `src/lib/comparison/view.mjs`, `compute.mjs`, `chart.mjs`.

- Filing frame mengelilingi plot/metode, tidak ikut menjadi texture di grafik.
- Pernyataan “Angka kondisi” menjadi catatan biasa, bukan `.stamp` di luar whitelist.
- Perbaiki gate CSV untuk indikator blocked; kode ekspor mengikuti kelayakan statistik yang ditampilkan.
- Reset chartReading setelah render baru supaya angka indikator sebelumnya tidak tertinggal.
- Blok median gabungan pada versi seri tidak kompatibel, sejajar dengan statistik utama/delta.
- Tombol khusus JS tidak tampak aktif sebelum init berhasil; tanpa JS, tabel bawaan tetap terbuka.
- Petunjuk baca titik pada halaman indikator harus memiliki perilaku nyata atau diganti petunjuk yang sesuai.
- Penanda pergantian versi benar-benar berbeda dari seri normal dan missing; geometri harus cocok penjelasannya.
- Jagakan label sumbu/marker pada ponsel; hindari footer SVG yang terlalu kecil atau keluar plot.

### Tahap 5: QA dan checkpoint implementasi

Jalankan pada artefak kandidat yang sama:

```sh
npm run check
npm run build:candidate
npm test
DIST_DIR=dist-candidate npm run test:integration
DIST_DIR=dist-candidate npm run audit:ui
```

Tambahkan tes regresi untuk temuan kelayakan CSV, pembacaan titik stale, median versi campur, URL hash, gate kontrol no-JS dan whitelist cap. Uji semua lima indikator, dua mode, tukar A/B, query invalid, Back/Forward, share/cancel/fallback, no-JS, missing dan audit pending dengan fixture yang jelas terpisah dari data politik.

QA visual: desktop/ponsel untuk beranda, isu panjang, pembanding dan keadaan error/blocked; sampel 360/390/768/1024/1440 px, reflow kontinu dan zoom 200%. Keyboard, fokus tidak tertutup, pembaca layar/TalkBack bila tersedia, forced colors/reduced motion. Jika browser lokal tidak tersedia, catat blocker dan gunakan browser remote/CI yang benar-benar dapat diakses, jangan mengganti hasilnya dengan klaim dari jsdom.

Budget tetap JS awal <=150 KiB gzip, aset awal <=1 MiB/halaman, font sesuai budget existing. Ukuran PNG referensi dalam docs tidak menjadi budget web karena tidak dimuat sebagai aset halaman.

Tulis checkpoint implementasi baru dengan hasil nyata, bukan mengubah dokumen rencana menjadi klaim keberhasilan. Publish lokal hanya setelah QA lolos dan lingkup publikasi dikonfirmasi; rilis publik tetap memerlukan audit editorial/identitas/kontak yang belum selesai. Tidak commit/push/PR tanpa permintaan eksplisit.

## 5. Acceptance criteria sebelum promosi

- Desktop/mobile terasa sebagai situs yang sama; kode/register/sumber tidak diubah demi komposisi.
- Vintage/dossier terlihat pada header berkas, framing bukti dan indeks; bukan grunge atau label rahasia.
- Cap whitelist tepat, tanpa watermark/redaksi dekoratif; note kausal tetap dekat data.
- Semua kontrol punya perilaku dan keadaan yang benar; tidak ada export/statistik yang melewati blokir metode/audit.
- Sumber dapat dijangkau maksimal dua tindakan dari beranda; tabel pembanding maksimal satu tindakan atau sudah terbuka.
- Kontras, keyboard, reflow dan budget diuji sesuai alatnya; batas verifikasi dinyatakan jujur.
- Tidak ada perubahan data/editorial, source sync lain atau deployment diam-diam.

## 6. Status saat handoff

Implementasi source, build kandidat, tes unit/integrasi dan audit otomatis selesai; hasil rinci CP19. Pratinjau lokal melayani kandidat tanpa publish. QA browser/viewport/zoom/TalkBack dan audit editorial masih terbuka, bukan pekerjaan yang boleh dianggap lulus dari jsdom. Board HTML v1 dan audit gambar disimpan sebagai riwayat, bukan bukti render aplikasi. Jangan commit/push/publish tanpa permintaan eksplisit.
