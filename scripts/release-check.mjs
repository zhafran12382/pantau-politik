import { execSync } from 'node:child_process';
function run(cmd) { console.log('$ ' + cmd); execSync(cmd, { stdio: 'inherit' }); }
run('npm run validate');
run('npm test');
run('npm run test:integration');
console.log('release:check — lanjutkan build, test:artifacts, test:e2e, audit:bundle secara berurutan pada kandidat yang sama.');
