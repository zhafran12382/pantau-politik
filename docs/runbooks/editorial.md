# Runbook editorial

## Pemeriksaan Selasa/Jumat (tanpa perubahan isi)
1. Buka sumber pemantauan tiap isu.
2. Jika tidak ada perubahan: ubah `last_checked_at` + catat di `editorial/review-log.md`.
3. Validasi + build preview lokal. Jangan ubah `published_at`/`updated_at`.

## Pembaruan substantif
1. Edit isu/event/sumber terkait, naikkan `updated_at`.
2. `npm run validate`, pratinjau, minta persetujuan editor untuk versi tersebut.
3. Build kandidat, QA, publikasi satu versi utuh.

## Koreksi serius
1. Sembunyikan klaim terkait terlebih dahulu, pertahankan halaman + catatan peninjauan.
2. Tambah entri `corrections.json`, perbarui halaman terdampak.
3. Publikasikan sebagai rilis baru; jangan rollback ke versi yang diketahui salah.
