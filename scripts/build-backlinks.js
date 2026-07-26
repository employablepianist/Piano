#!/usr/bin/env node
/**
 * build-backlinks.js — post-build backlink map generator
 *
 * Reads all .html files in public/, extracts internal <a href> links,
 * and builds a reverse map: target URL → list of source page URLs.
 * Outputs public/backlinks.json.
 */
const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.join(process.cwd(), 'public');
const OUT_FILE = path.join(PUBLIC_DIR, 'backlinks.json');

// Collect all .html files recursively
function walk(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walk(full));
    } else if (entry.name.endsWith('.html')) {
      files.push(full);
    }
  }
  return files;
}

// Convert a file path (relative to public/) to a Zola page URL.
// e.g. public/p/hello-zola/index.html → /p/hello-zola/
function filePathToUrl(filePath) {
  let rel = path.relative(PUBLIC_DIR, filePath);
  // Strip index.html
  if (path.basename(rel) === 'index.html') {
    rel = path.dirname(rel);
  } else {
    rel = rel.replace(/\.html$/, '');
  }
  if (rel === '.') rel = '';
  const url = '/' + rel.replace(/\\/g, '/').replace(/\/$/, '');
  return url + (url === '/' ? '' : '/');
}

// Normalize an href to a canonical page URL.
// Only handles internal (/) links.
function normalizeHref(href) {
  if (!href.startsWith('/')) return null;
  // strip fragment and query
  href = href.split('#')[0].split('?')[0];
  // ensure trailing slash for consistency
  if (!href.endsWith('/')) href += '/';
  return href;
}

const backlinks = new Map(); // target → Set of sources

const htmlFiles = walk(PUBLIC_DIR);
console.log(`[backlinks] Found ${htmlFiles.length} HTML files`);

// Collect page title → url mapping
const pageTitles = new Map();

for (const srcFile of htmlFiles) {
  const srcUrl = filePathToUrl(srcFile);
  const html = fs.readFileSync(srcFile, 'utf-8');

  // Extract title
  const titleMatch = html.match(/<title>([^<]*)<\/title>/);
  if (titleMatch) {
    let rawTitle = titleMatch[1].trim();
    // Strip site suffix: " — 4779" or " | site title"
    // Handle both "Page Title — Site" and bare "— Site" (missing page title)
    rawTitle = rawTitle.replace(/(^|\s)[—|-]\s.+$/, '').trim();
    if (rawTitle) {
      pageTitles.set(srcUrl, rawTitle);
    }
  }

  // Extract all <a href="..."> links (handles quoted and unquoted — Zola minification strips quotes)
  const linkRe = /<a\s[^>]*?href=["']?([^"'\s>]+)["']?[^>]*>/gi;
  let m;
  while ((m = linkRe.exec(html)) !== null) {
    const target = normalizeHref(m[1]);
    if (!target) continue;
    if (target === srcUrl) continue; // skip self-links
    if (!backlinks.has(target)) backlinks.set(target, new Set());
    backlinks.get(target).add(srcUrl);
  }
}

// Convert Sets to sorted arrays with titles
const result = {};
for (const [target, sources] of backlinks) {
  result[target] = [...sources].sort().map(srcUrl => ({
    path: srcUrl,
    title: pageTitles.get(srcUrl) || srcUrl
  }));
}

fs.writeFileSync(OUT_FILE, JSON.stringify(result, null, 2));
console.log(`[backlinks] Wrote ${Object.keys(result).length} targets to ${OUT_FILE}`);

// Also write to static/ so the second zola build picks it up
const STATIC_FILE = path.join(process.cwd(), 'static', 'backlinks.json');
fs.writeFileSync(STATIC_FILE, JSON.stringify(result, null, 2));
console.log(`[backlinks] Wrote to ${STATIC_FILE}`);
