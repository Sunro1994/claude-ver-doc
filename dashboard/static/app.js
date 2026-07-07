const $ = sel => document.querySelector(sel);

let versions = [];
let guides = [];
let current = null;

async function fetchJSON(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.json();
}

async function fetchText(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.text();
}

async function fetchJSONOptional(url) {
  try { return await fetchJSON(url); }
  catch { return []; }
}

function groupByDate(list) {
  const map = new Map();
  for (const v of list) {
    const key = v.date || '날짜 미상';
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(v);
  }
  return [...map.entries()];
}

function renderGuideList() {
  const nav = $('#guideList');
  if (!guides.length) { nav.innerHTML = ''; return; }
  nav.innerHTML = guides.map(g => `
    <button class="guide-btn ${current?.file === g.file ? 'active' : ''}" data-guide="${g.file}">
      ${g.title}
    </button>
  `).join('');
  nav.querySelectorAll('.guide-btn').forEach(b => {
    b.addEventListener('click', () => selectGuide(b.dataset.guide));
  });
}

function renderSidebar() {
  const nav = $('#versionList');
  const groups = groupByDate(versions);
  nav.innerHTML = groups.map(([date, items]) => `
    <div class="date-group">
      <div class="date-label">${date}</div>
      <ul>
        ${items.map(v => `
          <li>
            <button class="ver-btn ${current?.file === v.file ? 'active' : ''}" data-file="${v.file}">
              <span class="ver-num">v${v.version}</span>
              ${v.hasChallenge ? '<span class="badge" title="챌린지 있음">🎯</span>' : ''}
              ${v.keyword ? `<span class="ver-kw">${v.keyword}</span>` : ''}
            </button>
          </li>
        `).join('')}
      </ul>
    </div>
  `).join('');

  nav.querySelectorAll('.ver-btn').forEach(b => {
    b.addEventListener('click', () => selectVersion(b.dataset.file));
  });
}

async function selectVersion(file) {
  try {
    const md = await fetchText(`./md/${file}`);
    current = versions.find(v => v.file === file);
    $('#empty').hidden = true;
    $('#content').hidden = false;
    $('#docTitle').textContent = `Claude Code v${current.version}`;
    $('#docMeta').innerHTML = `
      <span>📅 ${current.date || '날짜 미상'}</span>
      ${current.keyword ? `<span class="kw-badge">🔑 ${current.keyword}</span>` : ''}
      <span class="file-name">${current.file}</span>
    `;
    $('#docBody').innerHTML = marked.parse(md);
    renderGuideList();
    renderSidebar();
  } catch (e) {
    alert('읽기 실패: ' + e.message);
  }
}

async function selectGuide(file) {
  try {
    const md = await fetchText(`./guide/${file}`);
    current = guides.find(g => g.file === file);
    $('#empty').hidden = true;
    $('#content').hidden = false;
    $('#docTitle').textContent = current.title;
    $('#docMeta').innerHTML = `<span class="kw-badge">📘 가이드</span> <span class="file-name">${current.file}</span>`;
    $('#docBody').innerHTML = marked.parse(md);
    renderGuideList();
    renderSidebar();
  } catch (e) {
    alert('읽기 실패: ' + e.message);
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  try {
    [versions, guides] = await Promise.all([
      fetchJSON('./versions.json'),
      fetchJSONOptional('./guide.json'),
    ]);
    renderGuideList();
    renderSidebar();
    if (guides.length) await selectGuide(guides[0].file);
    else if (versions.length) await selectVersion(versions[0].file);
  } catch (e) {
    $('#versionList').textContent = '오류: ' + e.message;
  }
});
