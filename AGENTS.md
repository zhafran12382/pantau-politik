# Panduan handoff agent — Pantau Politik

Repo: `https://github.com/zhafran12382/pantau-politik` (publik, branch `main`).
Situs statis Astro: Pantau (register isu) + Bandingkan (satu indikator, dua
periode). Baca berkas ini dulu sebelum mengubah apa pun.

## Urutan baca wajib

1. `README.md` — gambaran produk + pipeline kandidat.
2. `DESIGN.md` **Bab 18** — arah C “Arsip Ruang Redaksi” (mengikat).
3. `docs/checkpoints/CP16-arah-C.md` — kontrak visual + daftar cap jujur.
4. `docs/checkpoints/CP17-pelaksanaan-C.md` — apa yang sudah diimplementasi.
5. Checkpoint lain (`CP00–CP15`) hanya untuk riwayat; jangan jadikan acuan
   visual (arah A/B lama sudah digantikan).

## Batasan mengikat (pelanggaran = gagal QA)

- Fakta: jangan menciptakan angka, sumber, tanggal, identitas pengelola,
  atau persetujuan editorial. Status di JSON bukan bukti audit manusia.
- Cap visual HANYA: “ARSIP PUBLIK”, “DRAF PRATINJAU — BELUM AUDIT”,
  “KOREKSI TERCATAT”. DILARANG: “TOP SECRET”, “RAHASIA NEGARA”, “RESMI”,
  “TERVERIFIKASI”, klaim otoritas, watermark, logo/brand referensi.
- Tidak ada elemen yang menutupi informasi nyata (redaksi dekoratif dilarang).
- Budget: JS awal ≤150 KB gzip, aset awal ≤1 MB/halaman. Tema terang saja.
- Hierarki konflik: ketepatan isi/metode → aksesibilitas → keberhasilan
  tugas → sistem visual → saran umum.

## Perintah baku

```sh
npm run check && npm run build:candidate && npm test
DIST_DIR=dist-candidate npm run test:integration
DIST_DIR=dist-candidate npm run audit:ui
npm run publish:local   # atomik + rollback di .history/; menolak bila audit gagal
```

Setiap perubahan visual/fungsional harus lolos rangkaian di atas + verifikasi
render (cap/penanda ada di DOM, frasa terlarang tidak ada). Catat hasilnya di
checkpoint baru `docs/checkpoints/CP##-*.md`, bukan sebagai klaim di dokumen
desain. Dokumen desain bukan bukti fitur teruji.

## Khusus Android/Termux (abaikan di mesin lain)

- Sumber kanonis: `/data/data/com.termux/files/usr/tmp/opencode/platform-politik`
  (JANGAN build di `/storage/emulated`). Setelah verifikasi:
  `npm run sync:workspace`.
- Localhost `http://127.0.0.1:4321/` via `scripts/keepalive.mjs 4321`;
  jangan dobel-proses; pertahankan server bila tak perlu restart.
- Tanpa browser di perangkat ini: Playwright/Chromium tidak tersedia,
  screenshot/zoom-manual/TalkBack berstatus terhambat — catat, jangan klaim.
  Loader skill `ripgrep` rusak di arm64-android: baca berkas langsung.

## Git

- Commit/push/PR hanya bila pemilik meminta eksplisit. Sebelum commit:
  `git status`, `git diff`, pindai secrets; jangan commit `dist/`,
  `node_modules`, `.history`, `.reports` (sudah di `.gitignore`).
- Pesan commit ringkas mengikuti gaya riwayat (`git log --oneline`).
