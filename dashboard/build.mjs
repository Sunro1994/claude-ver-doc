#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, '_site');
const MD_OUT = path.join(OUT, 'md');
const GUIDE_SRC = path.join(ROOT, 'guide');
const GUIDE_OUT = path.join(OUT, 'guide');
const STATIC_DIR = path.join(__dirname, 'static');
const STYLE_SRC = path.join(__dirname, 'style.css');

const VERSION_RE = /^claude-code-v(\d+\.\d+\.\d+)\.md$/;
const GUIDE_RE = /^(\d+)-(.+)\.md$/;
const CHALLENGE_HEADER = '## 🎯 챌린지';

function parseDate(md) {
  const m = md.match(/>\s*작성일[:\s]*([0-9]{4}-[0-9]{2}-[0-9]{2})/);
  return m ? m[1] : null;
}

function parseKeyword(md) {
  const m = md.match(/##.*핵심 키워드[\s\S]*?\n\*\*"([^"]+)"\*\*/);
  return m ? m[1] : null;
}

function hasChallenge(md) {
  return md.includes(CHALLENGE_HEADER);
}

async function main() {
  await fs.rm(OUT, { recursive: true, force: true });
  await fs.mkdir(MD_OUT, { recursive: true });

  const files = await fs.readdir(ROOT);
  const versions = [];
  for (const f of files) {
    const m = f.match(VERSION_RE);
    if (!m) continue;
    const md = await fs.readFile(path.join(ROOT, f), 'utf8');
    versions.push({
      file: f,
      version: m[1],
      date: parseDate(md),
      keyword: parseKeyword(md),
      hasChallenge: hasChallenge(md),
    });
    await fs.writeFile(path.join(MD_OUT, f), md, 'utf8');
  }
  versions.sort((a, b) => {
    const d = (b.date || '').localeCompare(a.date || '');
    if (d !== 0) return d;
    return b.version.localeCompare(a.version, undefined, { numeric: true });
  });

  await fs.writeFile(path.join(OUT, 'versions.json'), JSON.stringify(versions, null, 2), 'utf8');

  const guides = await buildGuides();

  for (const asset of ['index.html', 'app.js']) {
    await fs.copyFile(path.join(STATIC_DIR, asset), path.join(OUT, asset));
  }
  await fs.copyFile(STYLE_SRC, path.join(OUT, 'style.css'));

  console.log(`✅ Built ${versions.length} versions + ${guides.length} guides → ${OUT}`);
}

async function buildGuides() {
  const exists = await fs.stat(GUIDE_SRC).then(() => true, () => false);
  if (!exists) return [];
  await fs.mkdir(GUIDE_OUT, { recursive: true });

  const files = await fs.readdir(GUIDE_SRC);
  const guides = [];
  for (const f of files) {
    const m = f.match(GUIDE_RE);
    if (!m) continue;
    const md = await fs.readFile(path.join(GUIDE_SRC, f), 'utf8');
    const titleMatch = md.match(/^#\s+(.+)$/m);
    guides.push({
      file: f,
      order: parseInt(m[1], 10),
      title: titleMatch ? titleMatch[1].trim() : m[2],
    });
    await fs.writeFile(path.join(GUIDE_OUT, f), md, 'utf8');
  }
  guides.sort((a, b) => a.order - b.order);
  await fs.writeFile(path.join(OUT, 'guide.json'), JSON.stringify(guides, null, 2), 'utf8');
  return guides;
}

main().catch(e => { console.error(e); process.exit(1); });
