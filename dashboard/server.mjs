#!/usr/bin/env node
import http from 'node:http';
import fs from 'node:fs/promises';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DOC_DIR = path.resolve(__dirname, '..');
const PUBLIC_DIR = __dirname;
const HOST = '127.0.0.1';
const PORT = 5174;
const CHALLENGE_HEADER = '## 🎯 챌린지';
const CLAUDE_HOME = path.join(process.env.HOME || '', '.claude');

const VERSION_RE = /^claude-code-v(\d+\.\d+\.\d+)\.md$/;

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

async function listVersions() {
  const files = await fs.readdir(DOC_DIR);
  const versions = [];
  for (const f of files) {
    const m = f.match(VERSION_RE);
    if (!m) continue;
    const full = path.join(DOC_DIR, f);
    const md = await fs.readFile(full, 'utf8');
    versions.push({
      file: f,
      version: m[1],
      date: parseDate(md),
      keyword: parseKeyword(md),
      hasChallenge: hasChallenge(md),
    });
  }
  versions.sort((a, b) => {
    const d = (b.date || '').localeCompare(a.date || '');
    if (d !== 0) return d;
    return b.version.localeCompare(a.version, undefined, { numeric: true });
  });
  return versions;
}

async function readVersion(file) {
  if (!VERSION_RE.test(file)) throw new Error('Invalid file');
  const full = path.join(DOC_DIR, file);
  return fs.readFile(full, 'utf8');
}

function buildPrompt(versionMd, version) {
  const settingsPath = path.join(CLAUDE_HOME, 'settings.json');
  const memoryPath = path.join(CLAUDE_HOME, 'projects', '-Users-leeseonro', 'memory', 'MEMORY.md');
  let settings = '(없음)';
  let memory = '(없음)';
  try { if (existsSync(settingsPath)) settings = readFileSync(settingsPath, 'utf8').slice(0, 4000); } catch {}
  try { if (existsSync(memoryPath)) memory = readFileSync(memoryPath, 'utf8').slice(0, 2000); } catch {}

  return `당신은 Claude Code 버전별 ChangeLog를 보고, 사용자가 자기 환경(\`~/.claude\`)에 직접 적용해볼 만한 "챌린지"를 제안하는 도우미입니다.

# 사용자 환경 컨텍스트

## ~/.claude/settings.json (요약, 최대 4KB)
\`\`\`json
${settings}
\`\`\`

## ~/.claude MEMORY.md
\`\`\`
${memory}
\`\`\`

# 이번 버전 ChangeLog (Claude Code v${version})

${versionMd}

# 출력 규칙

위 ChangeLog를 보고 사용자가 **자기 환경에 적용해볼 만한 챌린지 3~5개**를 골라주세요.
한 항목은 단순히 "기능 소개"가 아니라 사용자가 5~30분 안에 끝낼 수 있는 **구체적 적용 조치**여야 합니다.
사용자 환경에 이미 적용되어 있는 항목은 제외하세요.

다음 마크다운 형식을 **정확히** 지켜 출력하세요. 다른 텍스트/머리말/꼬리말 일절 금지:

## 🎯 챌린지

이번 버전에서 내 환경에 적용해볼 만한 항목입니다.

### 1. {짧은 제목}
- **파일**: \`{구체 경로}\`
- **근거**: {왜 이걸 하면 좋은지 1~2문장, 이 버전의 어떤 항목과 연결되는지}
- **난이도**: ★☆☆ (약 5분)

### 2. {다음 제목}
...
`;
}

function runClaude(prompt) {
  return new Promise((resolve, reject) => {
    const args = ['-p', '--model', 'opus', '--output-format', 'text'];
    const child = spawn('claude', args, { env: process.env });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', d => { stdout += d; });
    child.stderr.on('data', d => { stderr += d; });
    child.on('error', reject);
    child.on('close', code => {
      if (code === 0) resolve(stdout.trim());
      else reject(new Error(`claude exited ${code}: ${stderr.slice(0, 500)}`));
    });
    child.stdin.write(prompt);
    child.stdin.end();
  });
}

async function generateChallenge(file) {
  if (!VERSION_RE.test(file)) throw new Error('Invalid file');
  const full = path.join(DOC_DIR, file);
  const md = await fs.readFile(full, 'utf8');
  if (hasChallenge(md)) {
    return { skipped: true, reason: 'already has challenge' };
  }
  const version = file.match(VERSION_RE)[1];
  const prompt = buildPrompt(md, version);
  const generated = await runClaude(prompt);

  let block = generated.trim();
  if (!block.startsWith(CHALLENGE_HEADER)) {
    const idx = block.indexOf(CHALLENGE_HEADER);
    if (idx > 0) block = block.slice(idx);
    else block = `${CHALLENGE_HEADER}\n\n${block}`;
  }

  const sep = md.endsWith('\n') ? '\n---\n\n' : '\n\n---\n\n';
  const next = md + sep + block + '\n';
  await fs.writeFile(full, next, 'utf8');
  return { ok: true, file, bytesAdded: next.length - md.length };
}

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
};

async function serveStatic(req, res) {
  const url = new URL(req.url, `http://${HOST}:${PORT}`);
  let file = url.pathname === '/' ? '/index.html' : url.pathname;
  const target = path.join(PUBLIC_DIR, file);
  if (!target.startsWith(PUBLIC_DIR)) {
    res.writeHead(403).end('forbidden');
    return;
  }
  try {
    const data = await fs.readFile(target);
    res.writeHead(200, { 'content-type': MIME[path.extname(target)] || 'application/octet-stream' });
    res.end(data);
  } catch {
    res.writeHead(404).end('not found');
  }
}

async function readJson(req) {
  return new Promise((resolve, reject) => {
    let buf = '';
    req.on('data', c => { buf += c; });
    req.on('end', () => {
      if (!buf) return resolve({});
      try { resolve(JSON.parse(buf)); } catch (e) { reject(e); }
    });
  });
}

function json(res, code, body) {
  res.writeHead(code, { 'content-type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(body));
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${HOST}:${PORT}`);

  if (req.method === 'GET' && url.pathname === '/api/versions') {
    try { json(res, 200, await listVersions()); }
    catch (e) { json(res, 500, { error: e.message }); }
    return;
  }

  if (req.method === 'GET' && url.pathname === '/api/version') {
    const file = url.searchParams.get('file');
    try {
      const md = await readVersion(file);
      json(res, 200, { file, content: md });
    } catch (e) { json(res, 400, { error: e.message }); }
    return;
  }

  if (req.method === 'POST' && url.pathname === '/api/generate-challenge') {
    try {
      const { file } = await readJson(req);
      const result = await generateChallenge(file);
      json(res, 200, result);
    } catch (e) { json(res, 500, { error: e.message }); }
    return;
  }

  if (req.method === 'GET') return serveStatic(req, res);
  res.writeHead(405).end('method not allowed');
});

server.listen(PORT, HOST, () => {
  const u = `http://${HOST}:${PORT}`;
  console.log(`📊 claude-ver-doc dashboard: ${u}`);
  console.log(`📂 docs:   ${DOC_DIR}`);
  console.log(`🤖 claude: opus (via 'claude -p --model opus')`);

  if (process.argv.includes('--no-open')) return;
  spawn('open', [u], { stdio: 'ignore', detached: true }).unref();
});
