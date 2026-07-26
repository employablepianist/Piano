#!/usr/bin/env node
/**
 * validate-titles.js — check that all content files have a title in frontmatter.
 *
 * Every .md file in content/ should have `title = "..."` in its TOML frontmatter.
 * Without a title, page/section <title> renders as " — SiteName" and breaks
 * backlinks.json / graph labels.
 *
 * Usage: node scripts/validate-titles.js [content-dir]
 */

const fs = require('fs');
const path = require('path');

const CONTENT_DIR = process.argv[2] || 'content';

function walk(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.') || entry.name.startsWith('_')) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walk(full));
    } else if (entry.name.endsWith('.md')) {
      files.push(full);
    }
  }
  return files;
}

const violations = [];

for (const file of walk(CONTENT_DIR)) {
  const text = fs.readFileSync(file, 'utf-8');
  // Find frontmatter: content between first and second +++
  const fmMatch = text.match(/^\+\+\+\n([\s\S]*?)\n\+\+\+/);
  if (!fmMatch) continue; // no frontmatter — skip (other rules catch this)

  const fm = fmMatch[1];
  // Check for title = "..."
  const hasTitle = /^title\s*=\s*"/m.test(fm);
  if (!hasTitle) {
    violations.push(file);
  }
}

if (violations.length > 0) {
  console.log(`[validate-titles] ${violations.length} file(s) missing title:`);
  for (const f of violations) {
    console.log(`  ${f}`);
  }
  process.exit(1);
}

console.log(`[validate-titles] All ${walk(CONTENT_DIR).length} files have titles ✓`);
process.exit(0);
