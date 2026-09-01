# Claude Code v2.1.258

> 작성일: 2026-09-02

---

# 📋 요약본

## 🛠️ 개선/수정 (2건)
- **macOS 12 (Monterey) 실행 실패 수정** — 2.1.255에서 유입된 회귀로 Monterey에서 Claude Code가 아예 실행되지 않았다. 이번 버전에서 정상 실행된다.
- **원격·예약 세션의 빈 메시지 오류 수정** — 재전송된 권한 승인이 적용되지 못하면 세션이 `"user messages must have non-empty content"` 오류로 실패했다. 이제 실패하지 않는다.

## 🔑 이번 버전의 핵심 키워드
**"회귀 두 건 정리"** — 신기능 없이 Monterey 실행 불가와 원격·예약 세션 중단만 바로잡은 안정화 릴리스.

---

# 📜 원문 (한글 번역본)

> 원문 ChangeLog를 원래 순서 그대로 한 줄도 빠짐없이 번역한 문서입니다.

- macOS 12 (Monterey)에서 Claude Code가 실행되지 않던 문제 수정. 2.1.255에서 유입된 회귀.
- 재전송된 권한 승인이 적용되지 못한 뒤 원격·예약 세션이 `"user messages must have non-empty content"` 오류로 실패하던 문제 수정.

---

## 🎯 챌린지

이번 버전에서 내 환경에 적용해볼 만한 항목입니다.

### 1. 예약 세션 권한 프롬프트 제거
- **파일**: `~/.claude/settings.json`
- **근거**: 원격·예약 세션 실패는 권한 승인 재전송 경로에서 났다. `skipAutoPermissionPrompt`는 이미 켜져 있지만, cron으로 도는 `claude-changelog-sync`가 실제로 어떤 Bash 명령에서 프롬프트를 띄우는지 `permissions.allow`에 명시해두면 승인 왕복 자체가 사라진다. `/fewer-permission-prompts`로 후보를 뽑아 추가한다.
- **난이도**: ★★☆ (약 15분)

### 2. 버전 고정 여부 확인
- **파일**: `~/.claude/settings.json`
- **근거**: 2.1.255~2.1.257을 쓰는 Monterey 환경이라면 실행 자체가 막힌다. 현재 설치 버전을 `claude --version`으로 확인하고, 자동 업데이트를 끈 설정(`autoUpdates` 계열)이 있는지 점검해 2.1.258 이상으로 올린다.
- **난이도**: ★☆☆ (약 5분)

### 3. cron 동기화 실패 알림 추가
- **파일**: `~/.claude/hooks/` (신규 스크립트) 또는 cron 실행 커맨드
- **근거**: 이번 원격·예약 세션 버그처럼 조용히 실패하는 유형은 로그를 보지 않으면 며칠 뒤에야 안다. 매일 08:00 `claude-changelog-sync` cron 실행 커맨드에 종료 코드 검사 + `osascript` 알림을 붙여 실패를 즉시 인지한다. 현재 `Stop` 훅과 동일한 방식이라 재사용이 쉽다.
- **난이도**: ★★☆ (약 15분)
