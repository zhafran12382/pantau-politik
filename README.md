# Pantau Politik

Situs statis (Astro, tanpa backend) untuk memahami isu politik Indonesia
dan memeriksa buktinya: **Pantau** (register isu bernomor + kronologi
bersumber) dan **Bandingkan** (satu indikator nasional, dua periode
pemerintahan, grafik + tabel + metode dalam satu layar).

Arah visual: **C “Arsip Ruang Redaksi”** — koran untuk alur baca publik,
dossier untuk pembungkus berkas/bukti. Spesifikasi: `DESIGN.md` Bab 18,
kontrak `docs/checkpoints/CP16-arah-C.md`, pelaksanaan
`docs/checkpoints/CP17-pelaksanaan-C.md`.

> Status jujur: draf pratinjau. 90 slot observasi awal dan seluruh konten
> BELUM menjalani audit editorial 100%. UI menandai pratinjau di dekat
> materi terdampak. Identitas pengelola dan kontak koreksi belum ditetapkan.
> Tanpa `PUBLIC_SITE_URL`, halaman memakai canonical localhost + noindex.

## Mulai cepat (mesin mana pun)

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
npm run publish:local   # menolak bila audit kandidat belum lolos
```

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

Di perangkat Android ini ada dua salinan: sumber kanonis
`/data/data/com.termux/files/usr/tmp/opencode/platform-politik`
(filesystem internal, dukung symlink/executable) dan arsip
`/storage/emulated/0/Opencode/platform-politik`. Edit dan build di salinan
kanonis, lalu `npm run sync:workspace`. Di mesin normal, kerjakan langsung
di root repo — tidak ada dual-copy.

Localhost: `node scripts/serve.mjs` (default `http://127.0.0.1:4321/`);
`scripts/keepalive.mjs [port]` untuk daemon background. Cek server aktif
sebelum memulai proses kedua. Batasan perangkat: tanpa browser
(Playwright/Chromium tidak tersedia), skill-loader `ripgrep` rusak di
arm64-android (baca berkas langsung), `sharp` native gagal.
