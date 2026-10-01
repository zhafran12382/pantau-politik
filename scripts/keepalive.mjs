// Menjalankan scripts/serve.mjs sebagai daemon yang lepas dari shell.
// Pakai: node scripts/keepalive.mjs [port]
import { spawn } from 'node:child_process';
import { openSync } from 'node:fs';

const port = process.argv[2] || process.env.PORT || '4321';
const logFd = openSync('/data/data/com.termux/files/usr/tmp/opencode/serve-keepalive.log', 'a');
const child = spawn(
  process.execPath,
  ['scripts/serve.mjs'],
  {
    detached: true,
    stdio: ['ignore', logFd, logFd],
    env: { ...process.env, PORT: String(port) },
    cwd: new URL('..', import.meta.url).pathname,
  }
);
child.unref();
console.log(`server dilepas, PID ${child.pid}, port ${port}`);
