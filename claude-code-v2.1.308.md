# Claude Code v2.1.308

> 작성일: 2026-10-23

---

# 📋 요약본

## 🛠️ 개선/수정 (1건)
- **버그 수정 및 안정성 개선** — 여러 버그를 고치고 안정성을 높였다. 원문에 세부 항목이 없어 어떤 기능이 바뀌었는지는 알 수 없다. 설정을 바꿀 필요는 없다.

## 🔑 이번 버전의 핵심 키워드
**"조용한 안정화"** — 새 기능 없이 내부 버그 수정과 안정성 개선만 담은 유지보수 릴리스다.

---

# 📜 원문 (한글 번역본)

> 원문 ChangeLog를 원래 순서 그대로 한 줄도 빠짐없이 번역한 문서입니다.

- 버그 수정 및 안정성 개선

---

## 🎯 챌린지

이번 버전에서 내 환경에 적용해볼 만한 항목입니다.

### 1. statusLine 스크립트를 고정 경로로 옮기기
- **파일**: `~/.claude/settings.json` (`statusLine.command`), 새 파일 `~/.claude/statusline.js`
- **근거**: 지금 `statusLine`은 `token-optimizer` 플러그인 캐시 경로(`.../token-optimizer/5.8.8/...`)를 직접 가리킨다. 이 플러그인은 `enabledPlugins`에서 `false`라 꺼져 있다. 캐시가 지워지거나 버전 폴더가 바뀌면 상태줄이 조용히 사라진다. 이번 버전은 안정성 개선 릴리스다. 이 기회에 `statusline.js`를 `~/.claude/statusline.js`로 복사하고 `command`를 그 경로로 바꿔 외부 캐시에 기대지 않게 한다.
- **난이도**: ★☆☆ (약 10분)

### 2. `deploy-guard.sh` 회귀 테스트 스크립트 만들기
- **파일**: 새 파일 `~/.claude/hooks/test-deploy-guard.sh`
- **근거**: 버전이 오를 때마다 `PreToolUse` hook 입력 형식이나 차단 동작이 그대로인지 확인해야 한다. 버그 수정 릴리스도 예외가 아니다. `git push origin feat/x`, `git push origin fix/y`, `git push origin HEAD:dev` 세 경우의 JSON 입력을 hook에 넣는 스크립트를 만든다. 앞의 둘은 차단되고 `dev`는 통과하는지 종료 코드로 확인한다. 업데이트 직후 한 번 돌리면 §6 Deploy 정책이 실제로 지켜지는지 바로 알 수 있다.
- **난이도**: ★★☆ (약 20분)

### 3. 쓰지 않는 마켓플레이스 등록 정리
- **파일**: `~/.claude/settings.json` (`extraKnownMarketplaces`)
- **근거**: `karpathy-skills`와 `understand-anything`은 마켓플레이스로 등록돼 있지만 그 플러그인은 모두 `false`다. 쓰지 않는 소스가 남아 있으면 시작할 때나 플러그인 갱신 때 불필요한 GitHub 조회가 생기고, 실패 지점도 늘어난다. 앞으로 다시 켤 계획이 없는 항목은 지워서 설정을 줄인다. `token-optimizer`는 1번 챌린지를 끝낸 뒤에 정리 여부를 정한다.
- **난이도**: ★☆☆ (약 5분)
