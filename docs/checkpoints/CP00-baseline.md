# CP00 — Baseline arah A (status: lulus parsial, visual diblokir browser)

Tanggal: 30 September 2026.

## Sumber kode kanonis
- Kerja/build: `/data/data/com.termux/files/usr/tmp/opencode/platform-politik`
  (node_modules, exec, symlink OK; `npm run dev/build/check/test` hanya sah di sini).
- Arsip/berbagi: `/storage/emulated/0/Opencode/platform-politik`
  (disinkron via `npm run sync:workspace`, verifikasi hash; JANGAN build di sini).
- Hash 40 berkas src/content/scripts/konfig: `.reports/baseline-cp00.json`.
- Localhost: PID 21943, port 4321, melayani `dist/` (terverifikasi 200).

## Fungsi yang harus tetap bekerja (uji regresi tiap CP)
search/filter, URL pembanding, back/forward, berbagi, CSV, tabel tanpa JS,
sumber, koreksi, status stale, mode kalender/setara, canonical+noindex pratinjau.

## Jalur browser: TERHENTI SEMENTARA (dicatat jujur)
- Tidak ada chromium/firefox di Termux; `apt-cache` kosong.
- `playwright-core` menolak platform `android`; sudah di-uninstall kembali
  agar dependency bersih.
- Workaround: (1) pemeriksaan DOM/teks render per CP — BUKAN pengganti
  screenshot; (2) protokol screenshot sisi-pengguna di bawah; (3) visual
  checkpoint tetap “terhambat” sampai ada bukti render.

## Protokol screenshot pengguna (aktual, tanpa browser di perangkat ini)
1. Buka `http://127.0.0.1:4321/` di browser HP (Chrome).
2. Tiap CP: screenshot 360px + desktop (mode desktop bila tersedia).
3. Bandingkan dengan baseline naratif di tiap catatan CP.
4. Khusus grafik: cubit-zoom label, tap titik, putar landscape.

## Matriks viewport acuan
360, 390, 412, 768, 1024, 1440 + zoom 200% + reduced-motion + tanpa JS.

## Gerbang
LULUS untuk: baseline hash, inventaris fungsi, server lokal.
TERHAMBAT untuk: screenshot baseline pra-A (tidak ada render pra-A yang
bisa diabadikan di sini; baseline teks/DOM dipakai sebagai pengganti
sementara dan dicatat sebagai keterbatasan).
