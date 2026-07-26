#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const dir = path.join(process.cwd(), 'public');
const BASE = 'https://4779.ru';

function walk(d) {
  const f = [];
  for (const e of fs.readdirSync(d, {withFileTypes: true})) {
    if (e.name.startsWith('.')) continue;
    const p = path.join(d, e.name);
    if (e.isDirectory()) f.push(...walk(p));
    else if (e.name.endsWith('.html')) f.push(p);
  }
  return f;
}

const urls = [];
for (const file of walk(dir)) {
  let rel = path.relative(dir, file);
  if (path.basename(rel) === 'index.html') rel = path.dirname(rel);
  else rel = rel.replace(/\.html$/, '');
  if (rel === '.') rel = '';
  let url = '/' + rel.replace(/\\/g, '/');
  if (url !== '/') url += '/';
  if (!url.startsWith('/p/') && !url.startsWith('/w/') && url !== '/' && url !== '/graph/') continue;
  const html = fs.readFileSync(file, 'utf-8');
  const m = html.match(/<time datetime="([^"]+)"/);
  urls.push({ url, date: m ? m[1] : '' });
}
urls.sort((a, b) => a.url.localeCompare(b.url));

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u => `  <url>\n    <loc>${BASE}${u.url}</loc>${u.date ? `\n    <lastmod>${u.date}</lastmod>` : ''}\n  </url>`).join('\n')}\n</urlset>\n`;
fs.writeFileSync(path.join(dir, 'sitemap.xml'), xml);
console.log(`[sitemap] ${urls.length} URLs`);
