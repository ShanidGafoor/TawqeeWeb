import { cp, mkdir, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root = fileURLToPath(new URL('../', import.meta.url));
const out = path.join(root, 'dist');
await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
for (const name of ['index.html', 'styles.css', 'script.js', 'robots.txt', 'sitemap.xml', 'assets']) {
  await cp(path.join(root, name), path.join(out, name), { recursive: true });
}
const headers = '/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  Permissions-Policy: camera=(), microphone=(), geolocation=()\n  X-Frame-Options: DENY\n/assets/*\n  Cache-Control: public, max-age=86400\n';
await writeFile(path.join(out, '_headers'), headers);
console.log('Built static website in dist/.');
