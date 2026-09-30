import http from 'node:http';
import { stat } from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../', import.meta.url));
const port = Number(process.env.PORT || 4173);
const types = { '.html':'text/html; charset=utf-8', '.css':'text/css', '.js':'text/javascript', '.svg':'image/svg+xml', '.webp':'image/webp', '.png':'image/png', '.jpg':'image/jpeg', '.mp4':'video/mp4', '.vtt':'text/vtt', '.xml':'application/xml', '.txt':'text/plain', '.woff2':'font/woff2' };
const publicFiles = new Set(['index.html','styles.css','script.js','robots.txt','sitemap.xml']);
http.createServer(async (req, res) => {
  if (!['GET','HEAD'].includes(req.method)) { res.writeHead(405, { Allow:'GET, HEAD' }).end(); return; }
  try {
    const requested = decodeURIComponent(new URL(req.url, 'http://localhost').pathname).replace(/^\/+/, '') || 'index.html';
    const file = path.resolve(root, requested);
    const relative = path.relative(root, file);
    if (relative.startsWith('..') || path.isAbsolute(relative) || (!publicFiles.has(relative) && !relative.startsWith(`assets${path.sep}`))) { res.writeHead(404).end('Not found'); return; }
    const info = await stat(file);
    if (!info.isFile()) { res.writeHead(404).end('Not found'); return; }
    const headers = { 'Content-Type':types[path.extname(file)] || 'application/octet-stream', 'X-Content-Type-Options':'nosniff', 'Accept-Ranges':'bytes' };
    let start = 0, end = info.size - 1, status = 200;
    if (req.headers.range) {
      const match = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range);
      if (!match || (!match[1] && !match[2])) { res.writeHead(416, {'Content-Range':`bytes */${info.size}`}).end(); return; }
      if (match[1]) { start = Number(match[1]); end = match[2] ? Math.min(Number(match[2]), end) : end; }
      else start = Math.max(0, info.size - Number(match[2]));
      if (start > end || start >= info.size || !Number.isSafeInteger(start) || !Number.isSafeInteger(end)) { res.writeHead(416, {'Content-Range':`bytes */${info.size}`}).end(); return; }
      status = 206; headers['Content-Range'] = `bytes ${start}-${end}/${info.size}`;
    }
    headers['Content-Length'] = end - start + 1;
    res.writeHead(status, headers);
    if (req.method === 'HEAD') { res.end(); return; }
    const stream = createReadStream(file, {start,end});
    stream.on('error', () => res.destroy());
    res.on('close', () => stream.destroy());
    stream.pipe(res);
  } catch { if (!res.headersSent) res.writeHead(404); res.end('Not found'); }
}).listen(port, '127.0.0.1', () => console.log(`Tawqee: http://127.0.0.1:${port}`));
