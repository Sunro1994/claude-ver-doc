# Claude Code v2.1.176

> 작성일: 2026-06-13

---

# 📋 요약본

## 🎉 신기능 (2건)
- **세션 제목이 대화 언어로 생성** — 대화에 사용된 언어로 세션 제목이 자동 생성됨. 특정 언어로 고정하려면 `language` 설정 사용.
- **`footerLinksRegexes` 설정 추가** — footer 행에 regex 매칭 기반 링크 배지를 표시. 사용자 또는 managed settings로 구성 가능.

## ⚙️ 개선 (2건)
- **Bedrock credential caching 개선** — `awsCredentialExport`로 받은 credential을 고정 1시간 대신 실제 `Expiration` 시점까지 캐싱.
- **백그라운드 세션의 auto-update 안내 명확화** — auto-update를 가로지르는 윈도우가 reply를 제출할 수 없을 때 더 명확한 안내 표시 + `claude daemon status`가 version-skew 동작을 설명.

## 🐛 버그 수정 (18건) — 카테고리별
- **🔐 모델 선택 / 허용 정책**:
  - `availableModels` 강제 보강 — alias 모델 선택이 `ANTHROPIC_DEFAULT_*_MODEL` 환경 변수를 통해 차단된 모델로 redirect되는 우회 차단. `/fast`가 allowlist 밖의 모델로 전환하게 될 경우 토글 거부.
  - Opus 4.8이 활성화되지 않은 조직에서 Fable 5의 auto 모드가 실패하던 문제 수정 — classifier가 이제 사용 가능한 최선의 Opus 모델로 fallback.
- **훅**:
  - Read/Edit/Write 도구 경로에 대한 훅 `if` 조건 수정 — 문서화된 패턴(`Edit(src/**)`, `Read(~/.ssh/**)`, `Read(.env)` 등)이 이제 올바르게 매칭됨.
- **🐧 Linux**:
  - `.claude/settings.json`이 절대 target을 가진 symlink일 때 Linux sandbox가 시작에 실패하던 문제 수정.
- **tmux / SSH / 클립보드**:
  - SSH를 통한 tmux 내부에서 `/copy`와 마우스 선택 복사가 시스템 클립보드에 도달하지 않던 문제, 그리고 tmux 3.2 이전 버전에서 paste 버퍼가 로드되지 않던 문제 수정.
- **Remote Control**:
  - 웹/모바일에서 Remote Control 연결 시 세션 모델이 silently 전환되던 문제 수정.
  - Remote Control 끊김 알림이 사람이 읽을 수 있는 사유 대신 단순 숫자 코드를 표시하던 문제, 연결 실패가 대화 transcript에 중복 라인을 추가하던 문제 수정.
  - 다른 계정으로 로그인할 때 Remote Control 세션이 disconnect되지 않던 문제 수정.
- **디렉토리 / Worktree**:
  - `/cd`와 worktree 이동 후에도 세션이 이전 디렉토리의 git branch를 보고하던 문제 수정.
- **`claude agents` / 백그라운드 세션**:
  - 한 윈도우에서 back을 눌러도 같은 세션에 attach된 다른 윈도우는 detach되지 않도록 수정.
  - 턴 중간에 `/bg`로 전환할 때 이어갈 내용이 없으면 백그라운드 세션이 영원히 "Working" 상태로 표시되던 문제 수정.
  - 예약된 wakeup 중 또는 작업이 차단된 동안 열린 PR이 `claude agents` 검색에 나타나지 않던 문제 수정 (PR URL 기반 백그라운드 에이전트 검색).
  - `claude --bg -cn <name>`이 세션 이름을 seed하지 않던 문제 수정.
  - 백그라운드 세션이 respawn 전 persisted 상태의 Windows 네트워크 경로를 neutralize하도록 수정.
  - 손상된 상태 파일에서 나온 malformed resume ID를 백그라운드 세션 respawn이 거부하도록 수정.
- **🪟 Windows**:
  - agents view 입력에 텍스트 cursor가 표시되지 않던 문제 수정.
  - `~/.claude/daemon`에 ReadOnly 속성이 설정되어 있을 때 Windows 백그라운드 서비스 데몬이 시작되지 않던 문제 수정.
- **클라우드 / 인증**:
  - claim 전에 너무 오래 idle 상태이던 클라우드 세션이 "Could not resolve authentication method"로 실패하던 문제 수정.

## 🔑 이번 버전의 핵심 키워드
**"모델 정책 우회 차단 + 백그라운드/Remote Control 정합성"** — v2.1.175에서 `enforceAvailableModels`로 강화한 모델 허용 정책의 남은 우회 경로(`ANTHROPIC_DEFAULT_*_MODEL` 환경 변수와 `/fast` 토글)를 막아 정책을 완전 봉쇄했습니다. 동시에 Remote Control의 silent 모델 전환·계정 전환 시 끊김 누락·끊김 사유 표시, 백그라운드 세션의 `/bg` mid-turn "Working" stuck·PR URL 검색·세션 이름 seeding·Windows 네트워크 경로·daemon ReadOnly 등 운영 환경의 잔여 결함을 광범위하게 정리했습니다. 세션 제목이 대화 언어로 생성되는 것은 다국어 사용자에게 작지만 체감 큰 UX 개선입니다.

---

# 📜 원문 (한글 번역본)

> 원문 ChangeLog를 원래 순서 그대로 한 줄도 빠짐없이 번역한 문서입니다.

- 세션 제목이 이제 대화의 언어로 생성됩니다 (특정 언어로 pin하려면 `language` 설정을 사용).
- footer 행의 regex-매치 링크 배지를 위한 `footerLinksRegexes` 설정을 추가했으며, 사용자 또는 managed settings로 구성 가능합니다.
- Bedrock credential caching을 개선했습니다: `awsCredentialExport`의 credential이 이제 고정 1시간 대신 자신의 `Expiration`까지 캐시됩니다.
- `availableModels` 강제를 수정했습니다: alias 모델 선택이 `ANTHROPIC_DEFAULT_*_MODEL` 환경 변수를 통해 차단된 모델로 redirect될 수 없으며, allowlist 밖의 모델로 전환하게 될 경우 `/fast`가 토글을 거부합니다.
- Opus 4.8이 활성화되지 않은 조직에서 Fable 5의 auto 모드가 실패하던 문제를 수정했습니다 — classifier가 이제 사용 가능한 최선의 Opus 모델로 fallback합니다.
- Read/Edit/Write 도구 경로에 대한 훅 `if` 조건을 수정했습니다: `Edit(src/**)`, `Read(~/.ssh/**)`, `Read(.env)` 같은 문서화된 패턴이 이제 올바르게 매칭됩니다.
- `.claude/settings.json`이 절대 target을 가진 symlink일 때 Linux sandbox가 시작에 실패하던 문제를 수정했습니다.
- SSH를 통한 tmux 내부에서 `/copy`와 마우스 선택 복사가 시스템 클립보드에 도달하지 않던 문제, 그리고 3.2 이전 버전에서 tmux paste 버퍼가 로드되지 않던 문제를 수정했습니다.
- 웹/모바일에서 Remote Control이 연결될 때 세션의 모델이 silently 전환되던 문제를 수정했습니다.
- Remote Control 끊김 알림이 사람이 읽을 수 있는 사유 대신 단순 숫자 코드를 표시하던 문제, 그리고 연결 실패가 대화 transcript에 중복 라인을 추가하던 문제를 수정했습니다.
- 다른 계정으로 로그인할 때 Remote Control 세션이 disconnect되지 않던 문제를 수정했습니다.
- `/cd`와 worktree 이동이 세션을 이전 디렉토리의 git branch로 보고된 채로 두던 문제를 수정했습니다.
- `claude agents`: 한 윈도우에서 back을 누르면 같은 세션에 attach된 다른 윈도우들도 detach되던 문제를 수정했습니다.
- 턴 중간에 `/bg`했을 때 계속할 내용이 없었을 때 백그라운드된 세션이 영원히 "Working"으로 표시되던 문제를 수정했습니다.
- PR URL로 백그라운드 에이전트 검색 수정: 예약된 wakeup 동안 또는 작업이 차단된 동안 열린 PR이 이제 `claude agents` 검색에 나타납니다.
- agents view 입력에 Windows에서 텍스트 cursor가 표시되지 않던 문제를 수정했습니다.
- `claude --bg -cn <name>`이 세션 이름을 seed하지 않던 문제를 수정했습니다.
- 백그라운드 세션이 respawn 전 persisted 상태의 Windows 네트워크 경로를 neutralize하도록 수정했습니다.
- 손상된 상태 파일의 malformed resume ID를 백그라운드 세션 respawn이 거부하도록 수정했습니다.
- `~/.claude/daemon`에 ReadOnly 속성이 설정되어 있을 때 Windows 백그라운드 서비스 데몬이 시작되지 않던 문제를 수정했습니다.
- claim되기 전에 너무 오래 idle 상태였던 클라우드 세션이 "Could not resolve authentication method"로 실패하던 문제를 수정했습니다.
- 백그라운드 세션이 auto-update를 가로지르는 윈도우가 reply를 제출할 수 없을 때 이제 더 명확한 안내를 표시하며, `claude daemon status`가 version-skew 동작을 설명합니다.
