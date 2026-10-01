# Panduan pengerjaan proyek

- Untuk desain UI, komponen, tipografi, layout, grafik, atau microcopy, baca `DESIGN.md` (arah **Lembaran Negara** v2.0-draf) dan `docs/checkpoints/CP01-kontrak-arah-A.md` sebelum mengubah implementasi.
- Gunakan token dan komponen yang ditetapkan dokumen tersebut. Ketepatan metode/data PRD serta aksesibilitas menjadi prioritas ketika saran visual bertentangan.
- Skill desain lokal tersedia di `../.agents/skills/anti-slop-design/SKILL.md`. Muat `anti-slop-design` bila tersedia melalui tool skill; bila loader tidak tersedia, baca entry dan modul yang relevan langsung. Hindari memuat seluruh referensi tanpa kebutuhan.
- Dokumen rencana ada di `../RENCANA_IMPLEMENTASI_PLATFORM_POLITIK_MVP.md`. Tandai status implementasi dan pemeriksaan secara akurat; dokumen desain bukan bukti fitur sudah teruji.
- Tentukan sumber kode kanonis sebelum build: ada salinan `src/src/` dan salinan kerja Termux. Periksa isinya sebelum memindahkan atau menghapus.
- Data sintetis hanya untuk pengujian; jangan menciptakan persetujuan editorial, tanggal audit, sumber, atau identitas pengelola.
- Saat pekerjaan tidak memerlukan restart server, pertahankan server localhost yang sedang berjalan sesuai permintaan pengguna.
