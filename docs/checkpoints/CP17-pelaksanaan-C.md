# CP17 — Pelaksanaan arah C “Arsip Ruang Redaksi” (30 September 2026)

Kontrak: CP16. Semua teks cap dari daftar jujur; tanpa watermark, tanpa
logo/brand referensi, tanpa klaim otoritas.

## Yang diubah

- Token: kertas koran `#f3ecdc`, permukaan `#faf6ea`, tinta `#211a12`,
  merah cap `#a32c21`, 15 pasangan kontras lolos (teks ≥4,5:1, cap 6,07:1,
  seri-B 5,24:1). Radius diseragamkan 2px; teal SaaS dipensiunkan.
- Tekstur hanya CSS: grain linear-gradient halus di body, garis aturan
  ganda tebal-tipis, kotak filing putus-putus, bayangan keras 3px
  (offset solid, bukan glow modern).
- Masthead (`Base.astro`): strip arsip hitam, papan nama serif besar,
  dateline (kode berkas + tanggal edisi nyata saat build + semboyan),
  nav sebagai seksi koran uppercase (aktif = blok tinta).
- Hero (`index.astro`): kicker halaman depan + cap pratinjau, headline
  serif display, garis ganda, strip berkas berkotak, CTA utama blok tinta,
  jangkar data sebagai dokumen berkode.
- Kliping (`IssueRegisterEntry`): header filing (kode mono + kategori +
  cap), judul serif, footer bukti bergaris ganda + CTA teks (bukan tombol).
- Kawat (`UpdateLedger`): nomor perkara, jenis KOREKSI (merah cap) /
  PENJELASAN (tinta), tanggal tabular.
- Exhibit (`ComparisonPanel`, `ComparisonPreview`, halaman Bandingkan):
  filehead berkas + cap “Angka kondisi”; isi fungsional (grafik, tabel,
  CSV, mode kalender/setara) tidak berubah.
- Footer: kolofon serif + baris kolofon arsip.

## Verifikasi

- check 0 error; unit 25/25; integrasi 13/13; audit-ui 0 temuan (17 rute).
- 12 penanda arah C ada di render; 8 frasa terlarang (TOP SECRET,
  RAHASIA NEGARA, TERVERIFIKASI, RESMI, watermark…) tidak ada di mana pun.
- Publish atomik 30 berkas; live 200 + 4 penanda terverifikasi di render.
- TERHAMBAT (dicatat): screenshot/viewport, zoom 200% manual, TalkBack —
  tanpa browser di perangkat ini. Audit editorial prasyarat rilis publik.
