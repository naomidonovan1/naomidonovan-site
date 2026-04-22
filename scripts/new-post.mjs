#!/usr/bin/env node
import { writeFile, mkdir, access } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const CONTENT_DIR = join(ROOT, 'src/content/blog');

const rawSlug = process.argv[2];
if (!rawSlug) {
  console.error('Usage: npm run new-post -- <slug>');
  console.error('Example: npm run new-post -- decoding-motor-intent');
  process.exit(1);
}

const slug = rawSlug
  .toLowerCase()
  .trim()
  .replace(/[^a-z0-9-]+/g, '-')
  .replace(/^-+|-+$/g, '');

if (!slug) {
  console.error(`Invalid slug: "${rawSlug}"`);
  process.exit(1);
}

const filePath = join(CONTENT_DIR, `${slug}.mdx`);

try {
  await access(filePath);
  console.error(`A post with slug "${slug}" already exists: ${filePath}`);
  process.exit(1);
} catch {
  // doesn't exist — good
}

const today = new Date().toISOString().slice(0, 10);

const template = `---
title: "Untitled"
date: ${today}
summary: ""
tags: []
draft: true
private: false
---

Start writing here.
`;

await mkdir(CONTENT_DIR, { recursive: true });
await writeFile(filePath, template, 'utf8');

console.log(`Created ${filePath}`);
console.log(`Edit, then visit /blog?tab=drafts (signed in) to preview.`);
