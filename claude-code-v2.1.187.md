# Claude Code v2.1.187

> 작성일: 2026-06-24

---

# 📋 요약본

## 🎉 신기능 (3건)
- **`sandbox.credentials` 설정** — 샌드박스에서 실행되는 명령이 자격증명 파일과 시크릿 환경변수를 읽지 못하도록 차단하는 설정 추가.
- **조직 설정 기반 모델 제한** — 모델 선택기, `--model`, `/model`, `ANTHROPIC_MODEL` 에 조직이 구성한 모델 제한을 적용. 제한된 모델을 선택하면 "restricted by your organization's settings" 메시지를 표시.
- **선택 메뉴 마우스 클릭 지원** — 전체화면 모드에서 권한 프롬프트, `/model`, `/config` 등 선택 메뉴를 마우스 클릭으로 고를 수 있음.

## 🛠️ 개선/수정 (18건)
- **`--resume` 실패 수정** — 원본 `-p` 실행이 모델 턴을 만들지 않았을 때 "No conversation found" 로 실패하던 문제 수정.
- **`--json-schema` / 워크플로우 `agent({schema})` 구조화 출력 수정** — 성공한 호출 이후 모델이 `StructuredOutput` 을 무한 재호출하지 못하게 하고, 후속 턴에서도 구조화 출력을 안정적으로 반환.
- **원격 MCP 도구 호출 행(hang) 수정** — 5분간 응답 없이 멈추던 호출을 무한 대기 대신 에러로 중단 (`CLAUDE_CODE_MCP_TOOL_IDLE_TIMEOUT` 로 재정의 가능).
- **Claude Code Remote 세션 시작 지연 수정** — 에이전트 프록시 CA 시스템 신뢰 설치 추가 후 시작이 약 2.7초 느려지던 문제 수정.
- **붙여넣은 한국어/CJK 텍스트 깨짐 수정** — 붙여넣기를 바이트 단위 확장 키 이벤트로 전달하는 터미널에서 모지바케가 되던 문제 수정.
- **`/update` 원격 제어 행 수정** — 시작 시 신뢰 대화상자가 떠야 하는 상황에서 `/update` 가 멈추던 문제 수정.
- **에이전트 뷰 백그라운드 작업 멈춤 수정** — 에이전트가 구조화 출력 없이 턴을 끝낼 때 작업이 "working" 상태로 무한히 멈추던 문제 수정.
- **채널 연결 끊김 수정** — 에이전트 뷰를 오간 뒤, 그리고 `/bg`·`/tui`·`/update` 후 채널 연결이 끊기던 문제 수정.
- **에이전트 중단 알림 수정** — 누가 에이전트를 중단했는지 정확히 표기하도록 고치고, 문구를 "came to rest" 대신 "finished"/"stopped" 로 개선.
- **서브에이전트 depth 추적 수정** — 재개된 서브에이전트는 원래 spawn depth 를 복원하고, fork 된 서브에이전트는 depth 상한에 포함되도록 수정.
- **에이전트 worktree 등록 누수 수정** — 종료된 에이전트가 남긴 `.git/worktrees/` 의 잠긴 항목을 자동 정리.
- **Ghostty Cmd+click URL 수정** — macOS Ghostty 전체화면 모드에서 Cmd+click 으로 URL 이 열리지 않던 문제 수정.
- **`claude --help` 플래그 누락 수정** — `--bg`/`--background` 플래그가 목록에 표시되지 않던 문제 수정.
- **`/share` 업로드 중 키 입력 수정** — 업로드 중 Esc, Ctrl-C, Ctrl-D 가 동작하지 않던 문제 수정.
- **`/install-github-app` 개선** — GitHub Actions 워크플로우 설정을 선택 사항으로 전환. GitHub App 만 설치하고 워크플로우/시크릿 단계를 건너뛸 수 있음.
- **`/btw` 개선** — ←/→ 화살표로 이전 답변을 단계별로 탐색 가능.
- **`/plugin` 개선** — 최근 사용하지 않은 플러그인을 노출해 정리할 수 있도록 개선.
- **[VSCode] 확장 응답 없음 수정** — 큰 세션을 재개할 때 확장이 응답하지 않던 문제 수정.

## 🔑 이번 버전의 핵심 키워드
**"Remote·에이전트·MCP 안정화 + 자격증명 샌드박스 차단"** — 신기능보다 원격/에이전트/MCP 행·연결·알림 결함을 대거 잡고, 시크릿 보호와 조직 모델 제어를 더한 안정화 릴리스.

---

# 📜 원문 (한글 번역본)

> 원문 ChangeLog를 원래 순서 그대로 한 줄도 빠짐없이 번역한 문서입니다.

- 샌드박스 명령이 자격증명 파일과 시크릿 환경변수를 읽지 못하도록 차단하는 `sandbox.credentials` 설정 추가
- 모델 선택기, `--model`, `/model`, `ANTHROPIC_MODEL` 에 조직이 구성한 모델 제한을 추가하고, 제한된 모델을 선택하면 "restricted by your organization's settings" 메시지를 표시
- 전체화면 모드에서 선택 메뉴(권한 프롬프트, `/model`, `/config` 등)에 마우스 클릭 지원 추가
- 원본 `-p` 실행이 모델 턴을 만들지 않았을 때 `--resume` 이 "No conversation found" 로 실패하던 문제 수정
- `--json-schema` 및 워크플로우 `agent({schema})` 구조화 출력 수정: 성공한 호출 이후 모델이 `StructuredOutput` 을 무한히 재호출할 수 없게 되었고, 후속 턴에서도 구조화 출력이 안정적으로 반환됨
- 5분간 응답 없이 멈추던 원격 MCP 도구 호출 수정 — 이제 무한 대기 대신 에러로 중단 (`CLAUDE_CODE_MCP_TOOL_IDLE_TIMEOUT` 로 재정의 가능)
- 에이전트 프록시 CA 시스템 신뢰 설치가 추가된 후 Claude Code Remote 세션 시작이 약 2.7초 느려지던 문제 수정
- 붙여넣기를 바이트 단위 확장 키 이벤트로 전달하는 터미널에서 붙여넣은 한국어/CJK 텍스트가 모지바케가 되던 문제 수정
- 시작 시 신뢰 대화상자가 표시되어야 할 때 Remote Control 을 통한 `/update` 가 멈추던 문제 수정
- 에이전트가 구조화 출력 없이 턴을 끝냈을 때 에이전트 뷰의 백그라운드 작업이 "working" 상태로 무한히 멈추던 문제 수정
- 에이전트 뷰로 이동했다가 돌아온 후, 그리고 `/bg`, `/tui`, `/update` 후 채널 연결이 끊기던 문제 수정
- 에이전트 중단 알림이 누가 에이전트를 중단했는지 정확히 표기하지 못하던 문제 수정 및 문구 개선("came to rest" 대신 "finished"/"stopped")
- 서브에이전트 depth 추적 수정: 재개된 서브에이전트는 원래 spawn depth 를 복원하고, fork 된 서브에이전트는 depth 상한에 포함됨
- 누수된 에이전트 worktree 등록 수정: 종료된 에이전트가 남긴 `.git/worktrees/` 의 잠긴 항목을 자동 정리
- macOS Ghostty 전체화면 모드에서 Cmd+click 으로 URL 이 열리지 않던 문제 수정
- `claude --help` 가 `--bg`/`--background` 플래그를 나열하지 않던 문제 수정
- `/share` 업로드 중 Esc, Ctrl-C, Ctrl-D 가 동작하지 않던 문제 수정
- `/install-github-app` 개선: GitHub Actions 워크플로우 설정이 이제 선택 사항 — GitHub App 만 설치하고 워크플로우/시크릿 단계를 건너뛸 수 있음
- `/btw` 개선: ←/→ 화살표 탐색으로 이전 답변을 단계별로 훑을 수 있음
- `/plugin` 개선: 최근 사용하지 않은 플러그인을 노출해 정리할 수 있게 함
- [VSCode] 큰 세션을 재개할 때 확장이 응답하지 않게 되던 문제 수정

---

## 🎯 챌린지

이번 버전에서 내 환경에 적용해볼 만한 항목입니다.

### 1. 원격 MCP 도구 idle 타임아웃 단축
- **파일**: `~/.claude/settings.json` (`env` 블록에 `CLAUDE_CODE_MCP_TOOL_IDLE_TIMEOUT` 추가)
- **근거**: 이번 버전이 멈춘 원격 MCP 호출을 5분 후 에러로 끊도록 바꿨다. 현재 환경엔 claude.ai 커넥터(Asana·Atlassian·Notion·Linear 등) 다수가 붙어 있어 한 곳이 행 걸리면 5분을 통째로 기다린다. 값을 `60000`(60초) 정도로 낮추면 멈춘 커넥터가 더 빨리 실패해 작업 흐름이 끊기지 않는다.
- **난이도**: ★☆☆ (약 5분)

### 2. 미사용 플러그인 정리
- **파일**: `~/.claude/settings.json` (`enabledPlugins`)
- **근거**: `/plugin` 이 최근 안 쓴 플러그인을 노출하도록 개선됐다. 현재 `swift-lsp`, `playground`, `vercel` 등 켜진 플러그인이 많고 `andrej-karpathy-skills` 는 이미 꺼져 있다. `/plugin` 으로 사용 빈도를 확인해 안 쓰는 것을 비활성화하면 스킬 목록·컨텍스트 부담이 줄어든다(이미 80% 컨텍스트 경고 hook을 쓰는 환경에 직접 도움).
- **난이도**: ★☆☆ (약 10분)

### 3. 자격증명 샌드박스 차단 설정 추가
- **파일**: `~/.claude/settings.json` (`sandbox.credentials`)
- **근거**: 이번 버전이 샌드박스 명령의 자격증명 파일·시크릿 환경변수 읽기를 차단하는 설정을 추가했다. 이미 `deploy-guard.sh` 와 `/deploy-precheck` 로 secret leak 을 막는 환경이므로, 샌드박스 실행을 쓴다면 같은 방어선을 명령 실행 단계까지 확장하는 의미가 있다. (샌드박스 모드를 쓰지 않는다면 적용 효과 없음 — 사용 여부 먼저 확인.)
- **난이도**: ★★☆ (약 15분)
