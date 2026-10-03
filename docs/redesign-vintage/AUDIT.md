# Audit revisi visual: Dossier Vintage

Lingkup: gambar konsep beranda desktop + mobile, bukan implementasi aplikasi. Filter: miqdadbadjuber/anti-slop, mode AFTER sesuai pilihan pengguna pada sesi ini. Arahan pengguna: konsep v1 bagus, tetapi kurang vintage dan nuansa dossier.

## Temuan v1 yang menjadi sasaran revisi

1. **MEDIUM, R-20/R-31:** palet dan serif sudah editorial, tetapi permukaan terlalu mulus dan filing motif minim. V1 lebih terasa koran kontemporer daripada arsip berkas. Perkuat texture ringan, filehead dan grouping bukti, bukan mengubah warna/font secara acak.
2. **MEDIUM, R-06/R-14:** nomor isu hadir sebagai metadata biasa, belum menjadi penanda fisik berkas. Tambahkan tab filing pada lead, filehead ringan pada pendamping, tetap kode dari data dan tidak semua panel diberi bobot sama.
3. **MEDIUM, R-09/R-12:** cap v1 terlalu seperti label kecil biasa. Revisi memakai cap horizontal lebih tegas dan strip tinta, hanya wording yang diizinkan. Shadow tidak menjadi default semua panel.
4. **LOW, R-05:** register terlalu seperti tabel modern bersih. Indeks berkas dengan kode mono, aturan tegas dan label kolom spesifik memperkuat identitas tanpa mengubah informasi.

## Review v2 yang benar-benar dilihat

- Board utuh dan crop mobile ditinjau dengan vision, bukan hanya mengandalkan prompt/image tool success.
- V2 menunjukkan strip arsip gelap, tab BERKAS PP-001, bidang dossier utama, filehead pendamping, double rules, grain kertas dan cap horizontal.
- Lead energi memakai PP-001 pada desktop/mobile; pemilu PP-002, kemiskinan PP-003.
- Headline/summary masih terbaca pada crop; tidak terlihat bilah yang menyembunyikan isi atau frasa otoritas/rahasia terlarang.
- Tidak ada statistik promosi, testimoni, tanggal/identitas pengelola rekaan atau chart dekoratif.
- Grid/bobot isi utama versus pendamping masih berbeda, bukan tiga feature cards setara.

## Temuan v2 dan tindakan rencana

5. **MEDIUM, R-07/R-25/C-4:** grain pada gambar relatif padat. Implementasi memakai CSS ringan di margin/frame, area teks/plot lebih bersih; ratio solid sebelumnya bukan bukti kontras piksel gambar ini.
6. **MEDIUM, R-08/R-26:** JEJAK BUKTI di footer lead tampak seperti action tambahan, berpotensi menduplikasi Buka sumber. Rencana menetapkannya sebagai label source group, bukan cap/action terpisah tanpa tujuan.
7. **LOW, R-22/R-31:** paperclip/hole yang terlihat pada gambar adalah mood generatif, bukan aset wajib. Jangan menambah gambar/dekorasi fisik yang memperberat UI; cukup filing tab, corner rule dan frame CSS bermakna.
8. **HIGH sebelum rilis, R-35/C-4:** screenshot konsep tidak membuktikan browser responsiveness, actual font/hex, focus/keyboard, target sentuh, zoom atau TalkBack. Uji di kandidat implementasi.
9. **Konflik kontrak, R-02:** cap canonical mengandung em dash. Pertahankan teks literal kontrak; render gambar generatif bukan sumber string yang akan disalin/OCR. Jangan mengubahnya menjadi tanda hubung hanya karena bitmap.

## Empat blok Delivery Gate

- **Hard Gate: pemeriksaan visual konsep sesuai untuk kode isu, cap horizontal dan kejujuran konten.** Tidak memberikan PASS pada runtime/kontras rendered karena belum diuji; R-02 memiliki pengecualian kontrak yang dinyatakan.
- **Purpose-Gate: rancangan punya alasan tertulis.** Filehead mengidentifikasi berkas, frame mengelompokkan bukti, rules memisahkan seksi, satu accent menandai warning; grain/action duplikat dibatasi oleh PLAN.
- **Liveliness: identitas dossier lebih terlihat.** ENERGY 2 / RHYTHM 2 / MOTION 1 tetap; focal lead, tipografi editorial dan motif filing konsisten antarviewport contoh. Gambar statis tidak memverifikasi motion.
- **Craftsmanship/Quality Locks: proposal siap menjadi bahan eksekusi, belum klaim siap rilis.** Konten dan perbedaan bobot masuk akal; acceptance fungsi/fallback/missing/data eligibility/browser ditetapkan dalam PLAN.

Semua temuan di atas dipertahankan sebagai batas dan kriteria implementasi. Permintaan revisi visual mengizinkan penyesuaian konsep; belum ada source aplikasi diubah atau publish dilakukan.
