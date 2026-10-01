# FASE 1 — Design Research Summary

Tanggal: 28 September 2026. Metode: inspeksi halaman render aktual
(apple.com, linear.app, ourworldindata.org/grapher, gov.uk, stripe.com)
+ publikasi tim FT/Reuters tentang praktik visual journalism.
Keterbatasan: tidak ada screenshot piksel (tanpa browser di perangkat);
analisis berbasis struktur DOM, copy, dan pola yang terdokumentasi.

## Apple → pola relevan
- Satu ide per section; headline ≤10 kata + satu visual jangkar nyata.
- Tipografi percaya diri sebagai pembawa hierarki; transisi section tegas.
- Terapkan: hero Pantau satu pesan + satu jangkar data nyata (bukan foto).
- JANGAN: giant empty hero 1–2 viewport; produk kita butuh konten dalam fold pertama.

## Linear → pola relevan
- Baris kompak: ID kecil + judul + label + metadata dalam satu baris pindai.
- Metadata sekunder ringkas; kepadatan tanpa kesan sempit via kontras bobot.
- Terapkan: kartu isu dan feed update sebagai baris terstruktur, bukan blok paragraf.
- JANGAN: estetika project-management (sidebar, kode tiket, avatar stack).

## Our World in Data → pola relevan
- Atribusi di samping grafik: Description, Data source, Unit, Date range,
  Last updated, Next expected update, Managed by — selalu terlihat.
- Tab Chart/Table/Sources selevel; unduh CSV + API + sitasi siap salin.
- Terapkan: blok “Tentang angka ini” menempel pada grafik; unduh CSV per
  tampilan; “Terakhir diperbarui / pembaruan berikutnya” eksplisit.
- JANGAN: nada akademik berat dan halaman sepanjang makalah.

## Financial Times → pola relevan
- Judul grafik membawa pesan (“Life expectancy doubled…”), bukan nama tipe chart.
- Grafik memadatkan substansi; riset keterbacaan + aksesibilitas (buta warna,
  keterbatasan waktu pembaca) sebagai bagian desain.
- Terapkan: setiap grafik Pantau punya satu kalimat temuan faktual netral
  + anotasi langsung pada titik/garis, bukan legenda terpisah.
- JANGAN: paywall-pattern dan densitas koran cetak.

## Reuters Graphics → pola relevan
- Kesederhanaan sebagai kekuatan (“strength lies in simplicity”);
  akurasi + sourcing tanpa kompromi; iterasi berulang sebelum rilis.
- Terapkan: satu visual per isu yang menjawab satu pertanyaan
  (flow APBN, mekanik pemilu, garis kemiskinan); tanpa visual bila tak membantu.
- JANGAN: imersi berat (WebGL/scrollytelling) yang membebani ponsel menengah.

## GOV.UK → pola relevan
- Task-first (“The best place to find…”), bahasa lugas, progressive disclosure
  (details/summary), pola yang sama di semua halaman = trust.
- Terapkan: pola kartu/sumber/metode yang identik di semua halaman;
  kalimat tugas sebagai H1 (“Bandingkan…”, “Periksa…”).
- JANGAN: estetika birokrasi dingin; kita butuh hangat editorial.

## Stripe → pola relevan
- Bento berisi UI produk nyata (bukan ilustrasi); pita angka-bukti
  ($1.9T, 99.999%) dengan label spesifik; polish komponen mikro.
- Terapkan: pita “skala platform dari data nyata” (3 isu · N sumber ·
  5 indikator · diperbarui X lalu) — HANYA dari data yang ada.
- JANGAN: bento dekoratif dan angka marketing tanpa sumber.

## Economist / Bloomberg / NYT → pola relevan
- Anotasi peristiwa pada garis waktu; grafik menjelaskan topik rumit
  lewat scrollytelling bertahap.
- Terapkan: marker konteks (2008, 2020, transisi) + mode kalender/setara
  sebagai “penjelas bertahap” versi statis.
- JANGAN: artikel 5000 kata; kita tetap ringkas per isu.

## Sintesis untuk Pantau Politik
Premium = keputusan yang terlihat disengaja + bukti yang dekat.
Density = baris Linear + definisi GOV.UK + substansi FT.
Trust = atribusi OWID + akurasi Reuters + konsistensi GOV.UK.
Semuanya mobile-first, tanpa dekorasi non-informatif.
