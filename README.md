# Pantau Politik

Situs statis (Astro, tanpa backend) untuk memahami isu politik Indonesia
dan memeriksa buktinya: **Pantau** (register isu bernomor + kronologi
bersumber) dan **Bandingkan** (satu indikator nasional, dua periode
pemerintahan, grafik + tabel + metode dalam satu layar).

Arah visual: **C “Arsip Ruang Redaksi · Dossier Vintage”**: koran untuk
alur baca publik, dossier untuk pembungkus berkas/bukti. Spesifikasi:
`DESIGN.md` Bab 18/18.1; kontrak CP16, rencana CP18, hasil implementasi
dan batas QA di `docs/checkpoints/CP19-implementasi-dossier-vintage.md`.
Referensi/rencana: `docs/redesign-vintage/`; CP17 adalah riwayat build lama.

> Status jujur: draf pratinjau. 90 slot observasi awal dan seluruh konten
> BELUM menjalani audit editorial 100%. UI menandai pratinjau di dekat
> materi terdampak. Identitas pengelola dan kontak koreksi belum ditetapkan.
> Tanpa `PUBLIC_SITE_URL`, halaman memakai canonical localhost + noindex.

## Mulai cepat (mesin mana pun)

Verifikasi saat implementasi memakai Node 26.4.0. Walau manifest historis
menulis `>=20`, jsdom terkunci memerlukan `^22.22.2 || ^24.15.0 || >=26.0.0`;
pilih runtime yang memenuhi dependensi sebelum menjalankan QA.

```sh
npm ci
npm run dev        # pratinjau lokal
npm run check      # astro check + tsc
npm run build      # validate + astro build
```

## Pipeline kandidat (tanpa mengganggu localhost)

```sh
npm run check
npm run build:candidate
npm test
DIST_DIR=dist-candidate npm run test:integration
DIST_DIR=dist-candidate npm run audit:ui
DIST_DIR=dist-candidate npm run test:artifacts
DIST_DIR=dist-candidate npm run test:e2e
DIST_DIR=dist-candidate npm run audit:bundle
```

Pratinjau kandidat tanpa promosi/publish:

```sh
BUILD_CANDIDATE=1 npm run preview -- --host 127.0.0.1 --port 4321
```

Promosi `npm run publish:local` hanya bila diminta dan QA kandidat sudah
lulus; ini bukan izin rilis publik. Browser/zoom/TalkBack dan audit
editorial tetap gerbang tersendiri.

- `npm test`: rumus, missing (`null` ≠ nol), tahun transisi, query,
  geometri kalender/setara. `test:integration`: DOM aktual HTML build.
  `audit:ui`: axe-core via jsdom + aset + font (hasil di
  `.reports/design-audit.json`).
- `scripts/test-e2e.mjs` hanya smoke check HTML, BUKAN pengujian browser.
  Viewport nyata, zoom 200%, TalkBack, Web Vitals butuh browser/perangkat —
  jsdom tidak punya mesin layout.

## Peta repo

- `src/pages/`, `src/layouts/Base.astro`, `src/components/` (issues,
  comparison, shared), `src/client/*.mjs` (JS progresif),
  `src/lib/` (compute, statistik, tanggal), `src/styles/` (token + global).
- `content/` (isu, indikator, observasi, sumber, koreksi, peristiwa,
  register-map, penanda konteks), `editorial/`, `public/`, `scripts/`,
  `tests/`, `docs/checkpoints/`, `docs/decisions/`, `docs/runbooks/`.
- `DESIGN.md`: spesifikasi desain. `AGENTS.md`: panduan handoff agent.
  `docs/fonts/README.md`: font dan lisensi.

## Aturan yang tidak bisa ditawar

- Jangan fabrikasi angka, sumber, tanggal, identitas, atau persetujuan
  editorial. Status JSON bukan bukti pemeriksaan manusia.
- Cap visual hanya dari daftar jujur: “ARSIP PUBLIK”,
  “DRAF PRATINJAU — BELUM AUDIT”, “KOREKSI TERCATAT”. Dilarang:
  “TOP SECRET”, “RAHASIA NEGARA”, “RESMI”, “TERVERIFIKASI”, watermark,
  logo/brand referensi, atau apa pun yang menutupi informasi nyata.
- Budget: JS awal ≤150 KB gzip, aset awal ≤1 MB per halaman. Tema terang.
- Analitik dan iklan nonaktif. Bahasa Indonesia.

## Catatan Android/Termux (diabaikan di mesin normal)

Checkout yang diminta pemilik untuk implementasi ini adalah
`/data/data/com.termux/files/home/pantau-politik` (filesystem internal).
Dokumen lama menyebut salinan di tmp OpenCode dan shared storage; jangan
menganggap salinan itu target aktif atau menjalankan `sync:workspace`
tanpa permintaan eksplisit. Di mesin normal, kerjakan di root checkout.

Pratinjau implementasi melayani `dist-candidate` melalui Astro preview
di loopback, bukan daemon keepalive atau promosi `dist`. Cek server aktif
sebelum memulai proses kedua. `serve.mjs`/`keepalive.mjs` masih merupakan
utilitas lama untuk `dist`. Browser Chromium/Firefox/Playwright tidak
tersedia pada verifikasi ini; proot ada tanpa container terpasang.
