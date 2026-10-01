# Runbook deployment & rollback (Cloudflare Pages kandidat)

1. Kandidat: `npm run validate && npm run build && npm run test:artifacts && npm run test:e2e`.
2. Generate sitemap: `PUBLIC_SITE_URL=https://domain-produksi node scripts/generate-sitemap.mjs`.
3. Deploy preview terlindungi untuk beta; produksi hanya artefak yang disetujui (checksum + manifest).
4. Rilis atomik: satu versi utuh; aset fingerprint; cegah campur versi lama-baru.
5. Rollback: redeploy artefak A yang tersimpan (simpan minimal 3 versi); verifikasi halaman + URL berbagi.
6. Build gagal tidak mengganti situs aktif (atomic deployment penyedia).
