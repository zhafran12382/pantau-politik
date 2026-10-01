import { defineConfig } from 'astro/config';

// Kandidat produksi: static output + trailing slash agar URL stabil /isu/{slug}/
export default defineConfig({
  output: 'static',
  trailingSlash: 'always',
  site: process.env.PUBLIC_SITE_URL || 'http://127.0.0.1:4321',
  outDir: process.env.BUILD_CANDIDATE === '1' ? './dist-candidate' : './dist',
  // Keep small client modules external so the site's script-src 'self' policy works.
  vite: { build: { assetsInlineLimit: 0 } },
  build: {
    inlineStylesheets: 'auto'
  }
});
