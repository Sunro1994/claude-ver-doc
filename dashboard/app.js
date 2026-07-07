const $ = sel => document.querySelector(sel);

let versions = [];
let current = null;

async function fetchJSON(url, opts) {
  const r = await fetch(url, opts);
  const data = await r.json();
  if (!r.ok) throw new Error(data.error || `HTTP ${r.status}`);
  return data;
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
    const data = await fetchJSON(`/api/version?file=${encodeURIComponent(file)}`);
    current = versions.find(v => v.file === file);
    $('#empty').hidden = true;
    $('#content').hidden = false;
    $('#docTitle').textContent = `Claude Code v${current.version}`;
    $('#docMeta').innerHTML = `
      <span>📅 ${current.date || '날짜 미상'}</span>
      ${current.keyword ? `<span class="kw-badge">🔑 ${current.keyword}</span>` : ''}
      <span class="file-name">${current.file}</span>
    `;
    $('#docBody').innerHTML = marked.parse(data.content);
    updateGenButton();
    renderSidebar();
  } catch (e) {
    alert('읽기 실패: ' + e.message);
  }
}

function updateGenButton() {
  const btn = $('#genBtn');
  const status = $('#genStatus');
  if (!current) return;
  if (current.hasChallenge) {
    btn.disabled = true;
    btn.textContent = '🎯 챌린지 있음';
    status.textContent = '이미 생성됨';
    status.className = 'ok';
  } else {
    btn.disabled = false;
    btn.textContent = '🎯 챌린지 생성';
    status.textContent = '';
    status.className = '';
  }
}

async function onGenerate() {
  if (!current || current.hasChallenge) return;
  const btn = $('#genBtn');
  const status = $('#genStatus');
  btn.disabled = true;
  btn.textContent = '생성 중…';
  status.textContent = 'claude -p --model opus 호출 중 (수십 초 소요)';
  status.className = 'pending';

  try {
    const res = await fetchJSON('/api/generate-challenge', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ file: current.file }),
    });
    if (res.skipped) {
      status.textContent = '건너뜀: ' + res.reason;
    } else {
      status.textContent = `✓ +${res.bytesAdded} bytes`;
      status.className = 'ok';
    }
    await reload(current.file);
  } catch (e) {
    status.textContent = '실패: ' + e.message;
    status.className = 'err';
    btn.disabled = false;
    btn.textContent = '🎯 챌린지 생성 (재시도)';
  }
}

async function reload(selectFile) {
  versions = await fetchJSON('/api/versions');
  renderSidebar();
  if (selectFile) await selectVersion(selectFile);
}

document.addEventListener('DOMContentLoaded', async () => {
  $('#genBtn').addEventListener('click', onGenerate);
  try {
    await reload();
    if (versions.length) selectVersion(versions[0].file);
  } catch (e) {
    $('#versionList').textContent = '오류: ' + e.message;
  }
});
