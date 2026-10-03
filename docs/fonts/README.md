# Font Dossier Vintage

## Manrope: isi, kontrol dan angka

- Distribusi existing: `@fontsource-variable/manrope@5.3.0`, subset Latin variable WOFF2.
- Sumber: https://github.com/sharanda/manrope
- Distribusi: https://fontsource.org/fonts/manrope
- Lisensi SIL Open Font License 1.1: `public/fonts/OFL-Manrope.txt`.

## Source Serif 4: masthead dan headline

- Distribusi existing: `@fontsource/source-serif-4@5.3.0`, subset Latin normal weight 600 WOFF2.
- Sumber: https://github.com/adobe-fonts/source-serif
- Distribusi: https://fontsource.org/fonts/source-serif-4
- Lisensi SIL Open Font License 1.1 dari paket: `public/fonts/OFL-SourceSerif4.txt`.
- Headline memakai weight 600 yang benar-benar dimuat, bukan meminta bobot display lain sebagai font baru.

Kode/register menggunakan mono sistem, tanpa unduhan font tambahan. Kedua berkas font web dibundel Vite dan di-preload layout menggunakan aset yang sama. Semua permintaan font berasal dari situs sendiri. Audit menghitung byte font yang benar-benar dirujuk per halaman serta glyph/tabel angka Manrope; ini bukan pengujian metrik layout font fallback di browser.

Berkas Geist lama di public merupakan aset historis yang tidak dirujuk CSS/preload. Jangan menganggap keberadaannya sebagai font UI aktif.
