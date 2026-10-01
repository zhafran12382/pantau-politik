// Server statis kecil untuk localhost — tanpa dependensi.
// Pakai: PORT=4321 node scripts/serve.mjs   (dari folder platform-politik)
import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DIST = path.dirname(fileURLToPath(import.meta.url)) + '/../dist/';
const DIST_ABS = path.resolve(DIST) + path.sep;
const PORT = Number(process.env.PORT || 4321);
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
};

const server = http.createServer(async (req, res) => {
  try {
    let p = decodeURIComponent(new URL(req.url || '/', 'http://x').pathname);
    if (p.endsWith('/')) p += 'index.html';
    const file = path.resolve(path.join(DIST_ABS, '.' + p));
    if (!file.startsWith(DIST_ABS)) {
      res.writeHead(403);
      res.end('forbidden');
      return;
    }
    const data = await readFile(file).catch(() => null);
    if (data === null) {
      const nf = await readFile(path.join(DIST_ABS, '404.html')).catch(() => Buffer.from('404'));
      res.writeHead(404, { 'content-type': 'text/html; charset=utf-8' });
      res.end(nf);
      return;
    }
    res.writeHead(200, { 'content-type': MIME[path.extname(file)] || 'application/octet-stream' });
    res.end(data);
  } catch {
    res.writeHead(500);
    res.end('error');
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Melayani dist/ di http://127.0.0.1:${PORT}/  (Ctrl+C untuk berhenti)`);
});
