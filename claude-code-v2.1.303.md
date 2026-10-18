# Claude Code v2.1.303

> 작성일: 2026-10-19

---

# 📋 요약본

## 🛠️ 개선/수정 (1건)
- **버그 수정 및 안정성 개선**: 여러 버그를 고치고 동작 안정성을 높였다. 원문에 세부 항목이 없어서 어떤 기능이 바뀌었는지는 알 수 없다. 사용법이 바뀐 부분은 없다.

## 🔑 이번 버전의 핵심 키워드
**"조용한 안정화"**: 새 기능 없이 내부 버그와 안정성만 손본 유지보수 릴리스다.

---

# 📜 원문 (한글 번역본)

> 원문 ChangeLog를 원래 순서 그대로 한 줄도 빠짐없이 번역한 문서입니다.

- 버그 수정 및 안정성 개선

---

## 🎯 챌린지

이번 버전에서 내 환경에 적용해볼 만한 항목입니다.

### 1. deploy-guard hook이 계속 막는지 확인
- **파일**: `~/.claude/hooks/deploy-guard.sh`
- **근거**: 이번 버전은 바뀐 내용을 밝히지 않았다. 그래서 hook(명령 실행 전에 끼어드는 검사 스크립트)이 예전처럼 동작하는지 직접 확인해야 한다. `PreToolUse` Bash matcher로 `git push origin feat/test`를 흉내 내 보낸다. 차단되면 정상이다. `git push origin HEAD:dev` 형태는 통과해야 정상이다. 원격에 feat 브랜치가 쌓이는 사고(2026-07-08)를 다시 겪지 않게 하는 안전장치 점검이다.
- **난이도**: ★☆☆ (약 10분)

### 2. 꺼진 플러그인을 가리키는 statusLine 경로 정리
- **파일**: `~/.claude/settings.json` (`statusLine.command`)
- **근거**: `statusLine`은 `token-optimizer/5.8.8/...statusline.js`라는 버전 고정 캐시 경로를 쓴다. 그런데 `enabledPlugins`에서 `token-optimizer@alexgreensh-token-optimizer`는 `false`다. 캐시가 정리되거나 버전이 바뀌면 상태줄이 조용히 깨진다. `ls`로 해당 파일이 있는지 확인한다. 파일이 없으면 statusLine을 지우거나 `/statusline`으로 다시 설정한다.
- **난이도**: ★☆☆ (약 10분)

### 3. 쓰지 않는 marketplace 등록 정리
- **파일**: `~/.claude/settings.json` (`extraKnownMarketplaces`)
- **근거**: `karpathy-skills`·`understand-anything`·`alexgreensh-token-optimizer`는 등록만 되어 있다. 플러그인은 모두 꺼져 있다. 등록된 marketplace(플러그인 저장소 목록)는 시작할 때 불필요한 조회 대상이 되고, 변경 내용이 공개되지 않은 업데이트에서 원인 찾기를 어렵게 한다. 앞으로 다시 켤 계획이 없는 항목만 지운다. 지운 뒤 Claude Code를 다시 열어 정상 시작되는지 확인한다.
- **난이도**: ★★☆ (약 15분)
