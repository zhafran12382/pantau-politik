# Checkpoint build MVP-01 — 27 September 2026

Status: lulus (teknis + konten awal; audit final CP11 tetap wajib sebelum klaim rilis publik).

Artefak yang diperiksa: `dist/` 16 halaman + sitemap (247 KB total).
Sumber build: `/data/data/com.termux/files/usr/tmp/opencode/platform-politik` (symlink/exec-capable), disinkron ke workspace.

## Bukti
- `validate-content`: 3 isu, 9 peristiwa, 13 sumber — lulus.
- `validate-data`: 90 observasi, 5 indikator — lulus.
- Unit+integrasi: 13/13 lulus (U01–U11, I02).
- `astro check`: 0 errors.
- `astro build`: 16 pages.
- `test-artifacts`: tanpa draf/internal/sintetis.
- `test-e2e` statis: kartu→isu, sumber, tabel bawaan, canonical — lulus.
- `audit-bundle`: JS gzip 2,6 KB (batas 150 KB awal).

## Cakupan PRD
FR01–FR08 P0 terimplementasi; NFR03 (no-JS tabel/ringkasan/sumber), NFR05 (360px satu kolom, target 44px), NFR06 (allowlist http/https, escape), SEO (canonical/sitemap/robots), privasi (analitik off, iklan off), _headers keamanan.

## Batasan
Dataset 90 slot adalah ringkasan kerja dari tabel BPS — wajib audit 100% dokumen + hitungan independen + studi 8 peserta (CP11), beta + rollback (CP12–CP13) sebelum produksi. Nilai `tests/fixtures/` sintetis, tidak dipublikasikan.
