# CP18: rancangan Dossier Vintage dan persiapan eksekusi

Status: dokumen rencana dan referensi visual, bukan checkpoint implementasi selesai. Arahan pemilik memperkuat vintage/dossier di atas arah C; fakta, metode dan batas CP16 tetap berlaku.

## Artefak

- [Rencana eksekusi](../redesign-vintage/PLAN.md)
- [Audit konsep](../redesign-vintage/AUDIT.md)
- [Gambar beranda desktop/mobile v2](../redesign-vintage/homepage-v2.png)

Referensi dibuat dengan GPT Image (gpt-image-2-medium); gambar ditinjau utuh dan crop mobile. Identitas terkuat berasal dari strip tinta, filehead, filing tab, bingkai bukti, double rule dan grain ringan, bukan kata-kata klaim rahasia.

## Keputusan

- Pertahankan palet dan font existing, light theme, kode/sumber/status dari data.
- Cap hanya whitelist CP16 dan horizontal; tanpa watermark, otoritas/rahasia atau redaksi dekoratif.
- Tekstur implementasi CSS, lebih ringan daripada bitmap pada area baca/plot.
- JEJAK BUKTI menjadi label sumber, bukan CTA duplikat atau cap tambahan.
- Implementasi tetap wajib memperbaiki konsistensi gate CSV, median metode dan pembacaan titik stale yang sudah direproduksi sebelumnya.
- Rencana merinci tahapan source, regresi dan QA kandidat; tidak mencampur major upgrade dengan redesign.

## Bukti dan keterbatasan

- Referensi image dan audit visual tersedia. Kode PP-001/002/003 cocok antarcontoh viewport.
- Belum ada perubahan source aplikasi, test baru, build revisi atau screenshot browser aplikasi.
- Kontras token sudah dihitung pada studi sebelumnya; tidak mengklaim kontras bitmap/hasil render baru lulus.
- Browser/zoom/TalkBack dan audit editorial tetap gerbang tersendiri.
- Tidak ada publish, sync workspace lain, commit, push atau PR.

Setelah implementasi, catat QA nyata dalam checkpoint berikutnya, jangan mengubah dokumen ini menjadi bukti pengujian yang tidak dilakukan.
