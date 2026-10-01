# ADR-001 — Fondasi statis Astro

Tanggal: 2026-09-27. Pemilik: pengembang.

Konteks: PRD menuntut situs statis murah, tanpa backend, dengan HTML terbaca tanpa JS.
Opsi: Astro static, Next.js SSR, Hugo.
Keputusan: Astro static output + trailing slash, TypeScript, konten JSON, grafik SVG vanilla.
Alasan: HTML per rute saat build, JS hanya untuk pembanding/berbagi, ukuran kecil, hosting CDN gratis.
Dampak: CP03–CP09. Uji ulang: build, no-JS, bundel.
