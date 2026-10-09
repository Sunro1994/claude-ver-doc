# Claude Code v2.1.294

> 작성일: 2026-10-09

---

# 📋 요약본

## 🛠️ 개선/수정 (2건)
- **지시문형 `prompt`·`agent` hook의 차단 실패 수정** — "Block commands that..."처럼 지시문으로 쓴 `prompt`·`agent` hook이 막아야 할 동작을 통과시키던 버그를 고쳤다. 이제 지시문형 hook도 의도대로 차단한다.
  - 기존에 지시문형 hook을 써 왔다면 그동안 차단이 실제로 안 됐을 수 있다. 이번 버전에서 다시 동작을 확인해야 한다.
- **Stop·SubagentStop의 지시문형 `prompt` hook 판정 개선** — "Carry on if the build is broken"처럼 지시문으로 쓴 `prompt` hook을 더 정확하게 판정한다. Claude가 일을 덜 끝낸 채 멈추는 경우가 줄어든다.

## 🔑 이번 버전의 핵심 키워드
**"지시문형 hook이 이제 제대로 동작한다"** — 자연어로 쓴 `prompt`·`agent` hook의 차단과 계속 진행 판정이 믿을 만해졌다.

---

# 📜 원문 (한글 번역본)

> 원문 ChangeLog를 원래 순서 그대로 한 줄도 빠짐없이 번역한 문서입니다.

- 지시문 형태("Block commands that..." 등)로 작성된 `prompt` 및 `agent` hook이 차단해야 할 동작을 허용하던 문제를 수정했다
- Stop 및 SubagentStop에 지시문 형태("Carry on if the build is broken" 등)로 작성된 `prompt` hook의 판정 방식을 개선해, Claude가 일찍 멈출 가능성을 줄였다

---

## 🎯 챌린지

이번 버전에서 내 환경에 적용해볼 만한 항목입니다.

### 1. Stop에 "검증 전 종료 금지" prompt hook 추가
- **파일**: `~/.claude/settings.json`
- **근거**: CLAUDE.md §4는 "검증이 끝나기 전에는 성공이라고 말하지 않는다"를 요구한다. 지금 Stop hook은 `osascript` 알림 하나뿐이다. 이번 버전에서 Stop의 지시문형 `prompt` hook 판정이 좋아졌다. 그래서 "빌드·테스트 확인 없이 완료를 선언했으면 계속 진행"이라는 `type: "prompt"` hook을 기존 알림 hook 옆에 넣으면 실제로 효과가 난다.
- **난이도**: ★☆☆ (약 10분)

### 2. SubagentStop에 서브에이전트 결과 검증 hook 추가
- **파일**: `~/.claude/settings.json`
- **근거**: CLAUDE.md §5와 메모리 `feedback-subagent-spec-fidelity`에는 "서브에이전트가 spec을 멋대로 바꾼다"는 문제가 기록돼 있다. 이번 버전에서 SubagentStop의 지시문형 `prompt` hook 판정도 개선됐다. "보고한 파일 경로가 실제로 있는지, spec 임계값을 바꾸지 않았는지 확인되지 않았으면 계속 진행"이라는 hook을 추가하면 서브에이전트가 일찍 끝내는 것을 막을 수 있다.
- **난이도**: ★★☆ (약 15분)

### 3. 무단 commit·push를 막는 prompt hook 보강
- **파일**: `~/.claude/settings.json`
- **근거**: `deploy-guard.sh`는 `feat/*`·`fix/*` 원격 push만 막는다. CLAUDE.md §6의 "사용자 요청 없이 `git commit`·`git push` 금지"는 지금 아무것도 강제하지 않는다. 이번 버전에서 "Block commands that..." 형태의 PreToolUse `prompt` hook이 실제로 차단하도록 고쳐졌다. Bash matcher에 "사용자가 명시적으로 요청하지 않은 `git commit`·`git push`는 차단"이라는 hook을 하나 추가한다. 추가한 뒤 무해한 테스트 레포에서 차단되는지 직접 확인한다.
- **난이도**: ★★☆ (약 20분)
