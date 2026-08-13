# Claude Code v2.1.229

> 작성일: 2026-08-14

---

# 📋 요약본

## 🎉 신기능 (5건)
- **`claude remote-control --continue`** — 가장 최근 Remote Control 세션을 이어서 여는 옵션이 문서화됐다. 세션 ID를 찾을 필요가 없다.
- **self-hosted runner의 서버 제공 hook** — 자체 호스팅 러너 세션에서도 서버가 내려주는 Claude Code hook을 실행한다. 관리형 환경과 동작이 같아졌다.
- **플러그인 마켓플레이스 `command` 소스** — 로컬 명령(예: IDE)이 플러그인 디렉터리 경로를 출력하면 그 경로를 소스로 쓴다. 매 세션 다시 해석하고 재시작 없이 반영한다.
  - `mode: "link"` 로 지정하면 복사 없이 그 위치를 그대로 사용한다.
- **`ListAgents` 상태 라벨** — 연결이 끊긴 Remote Control 세션은 `offline`, 클라우드 세션은 `cloud` 로 표시한다.
- **[VSCode] 사이드바 세션 그룹** — 우클릭으로 그룹 생성·이름 변경·삭제. Cmd/Ctrl 또는 Shift 클릭으로 여러 세션을 한 번에 옮긴다.

## 🛠️ 개선/수정 (26건)
- **SSE keepalive** — 게이트웨이 스트리밍 응답에 keepalive ping을 넣어 긴 thinking 구간에서 Vertex·Bedrock 업스트림이 idle timeout으로 끊기지 않는다.
- **스트리밍 출력 깨짐** — 긴 응답 일부가 사라지거나 터미널에 두 번 출력되던 문제 수정.
- **비문자열 인자 크래시** — 툴 호출의 `glob`·`file_path`·`command` 값이 문자열이 아닐 때 에러 화면으로 죽던 문제 수정. 해당 세션 `--resume` 시 재발하던 것도 포함.
- **좁은 터미널 RangeError** — 아주 좁은 창에서 진행 바나 마크다운 표를 그릴 때 나던 크래시 수정. `claude --continue`/`--resume` 시작 시 죽던 경우도 해결.
- **Windows 확장 경로 크래시** — 툴 호출·메시지가 `\\?\` 확장 길이 경로나 UNC 경로를 참조할 때 죽던 문제 수정.
- **`CLAUDE_CODE_ATTRIBUTION_HEADER` 와 auto mode** — attribution 헤더를 끈 사용자(Anthropic API 직접 연결)가 모든 툴 호출에서 auto mode 실패하던 문제 수정.
- **`/model` 의 1M 컨텍스트** — 커스텀 `ANTHROPIC_BASE_URL` 게이트웨이를 쓰는 claude.ai 구독자에게 Sonnet/Opus 1M을 거부하던 문제 수정.
- **MCP OAuth** — redirect URI에 `localhost` 대신 `127.0.0.1` 을 써서 엄격한 인가 서버와도 연결된다.
- **Remote Control 스피너 멈춤** — 노트북 터미널에서 슬래시 명령을 입력하면 원격 클라이언트에 작업 스피너가 걸려 있던 문제 수정.
- **`/install-github-app` 리뷰 워크플로우** — 생성된 Claude Code Review 워크플로우가 리뷰를 PR에 올리지 않고 성공으로 끝나던 문제 수정.
- **IDE 진단 UI 정지** — IDE 확장 연결 상태에서 진단이 수천 개인 파일을 편집한 뒤 UI가 수 초 멈추던 문제 수정.
- **`claude plugin` liveness 파일** — 일회성 명령이 남기던 잔여 파일 때문에 구버전 플러그인이 정리되지 않던 문제 수정.
- **컨테이너 CPU 인식** — CPU 제한이 걸린 컨테이너 안에서 dynamic workflow가 호스트 코어 수를 쓰던 문제 수정.
- **파일 워처 누수** — 원자적 파일 교체 후 핸들이 새던 문제와, Windows에서 네트워크·가상 파일시스템의 예약 작업 워처 실패가 잡히지 않던 오류 수정.
- **공백만 있는 메시지** — SDK 및 `--input-format stream-json` 세션에서 400 API 에러가 나던 문제 수정.
- **32MB 요청 한도** — 메시지만으로 API 한도를 넘는 대화가 벗겨낼 이미지·문서도 없이 compaction을 반복 재시도하던 문제 수정. 이제 한 번에 명확한 메시지로 실패한다.
- **OpenTelemetry 전송** — Claude Desktop 세션의 텔레메트리가 Desktop 관리 게이트웨이(그 게이트웨이가 동시에 텔레메트리 엔드포인트일 때)에서 거부되던 문제 수정.
- **`managed-mcp.json` 충돌** — self-hosted runner 등 원격 세션이 `managed-mcp.json` 배포 상태에서 서버가 MCP 서버를 내려주면 시작 시 종료되던 문제 수정. 이제 경고만 남기고 건너뛴다.
- **러너 git 자격증명 대기** — self-hosted runner의 레포 준비 단계가 Git Credential Manager 프롬프트에서 멈추던 문제 수정. 자격증명이 없으면 git이 즉시 실패한다.
- **workflow prefix 캐시** — fan-out 시 같은 prefix를 쓰는 형제 에이전트를 시차 실행해 뒤 에이전트가 캐시된 프롬프트 prefix를 읽는다. `CLAUDE_CODE_WORKFLOW_PREFIX_STAGGER_MS=0` 으로 끈다.
- **"prompt is too long" 안내** — `/compact` 만 권하지 않고 자동 compaction이 왜 복구하지 못했는지 설명한다.
- **샌드박스 IPv6** — 네트워크 도메인 목록의 IPv6 리터럴을 대괄호로 감싼다(`[::1]:443`). 모호한 표기는 fail-closed로 강제하고 `/doctor` 가 표시한다.
- **`/login` 경고 반복** — `CLAUDE_CODE_OAUTH_TOKEN` 오버라이드 경고를 로그인 성공 후 한 번 더 띄운다.
- **`/commit-push-pr` 자동 승인 축소** — `--force`·`--amend`·`--no-verify` 등 위험 플래그가 붙은 git/gh 명령은 더 이상 자동 승인하지 않는다.
- **Windows 러너 `--base-dir` 필수** — self-hosted runner의 Windows 시작 시 체크아웃 디렉터리를 명시해야 한다. 기본값이 없다.
- **[VSCode] 피드백 경로·`/btw` 패널** — "Report a problem" 과 `/bug` 가 폐기된 설문 링크 대신 내장 피드백 대화상자를 연다. `/btw` 사이드 질문 패널은 경계를 끌어 크기를 조절할 수 있다(사이드 도킹·스택 레이아웃 모두).

## 🔑 이번 버전의 핵심 키워드
**"끊기지 않는 세션"** — 스트리밍 타임아웃, 크래시, 러너 정지를 걷어내고 원격·자체 호스팅 환경의 연속성을 세운 안정화 릴리스.

---

# 📜 원문 (한글 번역본)

> 원문 ChangeLog를 원래 순서 그대로 한 줄도 빠짐없이 번역한 문서입니다.

- 가장 최근 Remote Control 세션을 이어서 여는 `claude remote-control --continue` 를 문서화
- self-hosted runner 세션에 서버가 제공하는 Claude Code hook 지원 추가 — 관리형 환경과 동일한 동작
- 긴 thinking 정지 구간 동안 게이트웨이 스트리밍 응답에 SSE keepalive ping 추가 — Vertex·Bedrock 업스트림의 idle timeout 연결 끊김 방지
- 플러그인 마켓플레이스 `command` 소스 추가: 로컬 명령(예: IDE)이 플러그인 디렉터리를 출력하고, 이 경로는 매 세션 다시 해석되며 재시작 없이 적용된다. `mode: "link"` 는 해당 위치를 그대로 사용
- `ListAgents` 가 연결 끊긴 Remote Control 세션을 `offline` 로 표시하고, 내 클라우드 세션에는 `cloud` 라벨을 붙임
- 긴 응답이 스트리밍 중 일부 사라지고 터미널에 두 번 출력되던 문제 수정
- 툴 호출의 `glob`·`file_path`·`command` 값이 문자열이 아닐 때 에러 화면으로 죽던 크래시 수정 (해당 세션의 `--resume` 포함)
- 아주 좁은 터미널 창에서 진행 바나 마크다운 표를 렌더링할 때 나던 RangeError 크래시 수정 (시작 시 `claude --continue`/`--resume` 도 죽을 수 있었음)
- 툴 호출이나 메시지가 확장 길이(`\\?\`) 또는 UNC 경로로 파일을 참조할 때 Windows에서 나던 크래시 수정
- `CLAUDE_CODE_ATTRIBUTION_HEADER` 로 attribution 헤더를 비활성화한 사용자(Anthropic API 직접 연결)의 auto mode가 모든 툴 호출에서 실패하던 문제 수정
- 커스텀 `ANTHROPIC_BASE_URL` 게이트웨이를 쓰는 claude.ai 구독자에게 `/model` 이 Sonnet/Opus 1M을 거부하던 문제 수정
- redirect URI에 `localhost` 대신 `127.0.0.1` 을 사용해 엄격한 인가 서버와의 MCP OAuth 문제 수정
- 노트북 터미널에서 입력한 슬래시 명령 이후 Remote Control 클라이언트에 작업 스피너가 멈춰 있던 문제 수정
- `/install-github-app` 이 생성하는 Claude Code Review 워크플로우가 pull request에 리뷰를 게시하지 않고 완료되던 문제 수정
- IDE 확장이 연결된 상태에서 IDE 진단이 수천 개인 파일을 편집한 뒤 UI가 수 초간 멈추던 문제 수정
- 일회성 `claude plugin` 명령이 잔여 liveness 파일을 남겨 구버전 플러그인 정리를 막을 수 있던 문제 수정
- CPU 제한이 걸린 컨테이너 내부의 dynamic workflow가 컨테이너의 CPU 제한 대신 호스트 머신의 코어 수를 쓰던 문제 수정
- 원자적 파일 교체 후의 파일 워처 핸들 누수, 그리고 네트워크·가상 파일시스템에서 예약 작업 워처가 실패할 때 Windows에서 잡히지 않던 오류 수정
- 공백만 있는 메시지를 제출하면 SDK 및 `--input-format stream-json` 세션이 400 API 에러를 받던 문제 수정
- 메시지만으로 API의 32MB 요청 한도를 넘는 대화가 벗겨낼 이미지·문서가 없는데도 compaction을 재시도하던 문제 수정 — 이제 명확한 메시지와 함께 한 번에 실패한다
- Claude Desktop 세션의 OpenTelemetry 전송이 Desktop 관리 게이트웨이(해당 게이트웨이가 텔레메트리 엔드포인트이기도 할 때)에서 거부되던 문제 수정
- `managed-mcp.json` 이 배포되어 있고 서버가 MCP 서버를 전달할 때 self-hosted runner 및 기타 원격 세션이 시작 시 종료되던 문제 수정 — 이제 해당 서버는 경고와 함께 건너뛴다
- self-hosted runner의 레포지토리 준비 단계가 Git Credential Manager 프롬프트에서 멈추던 문제 수정 — 이제 자격증명이 없으면 git이 즉시 실패한다
- workflow fan-out 개선: 같은 prefix를 가진 형제 에이전트를 시차 실행해 뒤따르는 에이전트가 prefix를 다시 지불하지 않고 캐시된 프롬프트 prefix를 읽게 함 (`CLAUDE_CODE_WORKFLOW_PREFIX_STAGGER_MS=0` 으로 비활성화)
- "prompt is too long" 에러 개선: `/compact` 만 제안하는 대신 자동 compaction이 왜 복구하지 못했는지 설명
- 샌드박스 개선: 네트워크 도메인 목록의 IPv6 리터럴을 대괄호로 감싸고(`[::1]:443`), 모호한 표기는 fail-closed로 강제하며 `/doctor` 가 이를 표시
- `/login` 이 로그인 성공 후 `CLAUDE_CODE_OAUTH_TOKEN` 오버라이드 경고를 반복하도록 변경
- `/commit-push-pr` 변경: 위험 플래그(`--force`·`--amend`·`--no-verify` 등)가 붙은 git/gh 명령은 더 이상 자동 승인되지 않음
- self-hosted runner의 Windows 시작 시 명시적 `--base-dir` 를 요구하도록 변경 — Windows에는 기본 체크아웃 디렉터리가 없음
- [VSCode] "Report a problem" 과 `/bug` 가 폐기된 설문 링크 대신 내장 피드백 대화상자를 열도록 변경
- [VSCode] `/btw` 사이드 질문 패널을 경계 드래그로 크기 조절 가능하게 함 (사이드 도킹·스택 레이아웃 모두)
- [VSCode] 사이드바에 세션 그룹 추가 — 우클릭으로 생성·이름 변경·삭제, Cmd/Ctrl 또는 Shift 클릭으로 여러 세션을 한 번에 이동

---

## 🎯 챌린지

이번 버전에서 내 환경에 적용해볼 만한 항목입니다.

### 1. `/doctor` 로 샌드박스 IPv6 표기 점검
- **파일**: `~/.claude/settings.json`
- **근거**: 이번 버전부터 네트워크 도메인 목록의 모호한 IPv6 표기는 fail-closed로 막히고 `/doctor` 가 이를 표시한다. `/doctor` 를 한 번 돌려 경고가 뜨는지 확인하고, 뜨면 해당 항목을 `[::1]:443` 형태 대괄호 표기로 고쳐 둔다. 조용히 차단되는 것보다 먼저 잡는 게 낫다.
- **난이도**: ★☆☆ (약 5분)

### 2. workflow prefix 시차 실행 확인
- **파일**: `~/.claude/settings.json` (`env` 블록)
- **근거**: `CLAUDE.md` §7.2에서 Phase 내 독립 task를 병렬 dispatch하고 Workflow pipeline을 쓴다. 이번 버전의 prefix stagger는 fan-out 시 캐시 히트를 늘려 토큰을 아끼는 기본 동작이므로 그대로 두는 게 맞다. 다만 지연이 거슬리면 `env`에 `CLAUDE_CODE_WORKFLOW_PREFIX_STAGGER_MS` 를 짧은 값으로 넣어 조절할 수 있다. 현재 `settings.json` 에 `env` 블록 자체가 없으니, 병렬 dispatch를 한 번 돌려 체감을 본 뒤 결정한다.
- **난이도**: ★☆☆ (약 10분)

### 3. `deploy-guard.sh` 에 위험 플래그 차단 추가
- **파일**: `~/.claude/hooks/deploy-guard.sh`
- **근거**: 이번 버전은 `/commit-push-pr` 에서 `--force`·`--amend`·`--no-verify` 자동 승인을 없앴다. 내 `deploy-guard.sh` 는 `feat/*`·`fix/*` 원격 push만 막는다. 같은 기준으로 `git push --force` 를 `dev`·`ext-dev` 대상에서도 차단하는 규칙을 한 줄 추가하면, `CLAUDE.md` §6의 "ext-dev는 ff 승격만" 규칙이 hook 레벨에서 강제된다.
- **난이도**: ★★☆ (약 15분)

### 4. `/install-github-app` 워크플로우 재생성 여부 확인
- **파일**: 각 레포의 `.github/workflows/claude-code-review.yml`
- **근거**: 기존에 `/install-github-app` 으로 만든 리뷰 워크플로우는 리뷰를 PR에 게시하지 않고도 성공(초록 체크)으로 끝나는 버그가 있었다. 리뷰가 안 올라오는데 실패도 안 뜨면 알아채기 어렵다. 해당 파일이 있는 레포에서 최근 PR에 리뷰 코멘트가 실제로 달렸는지 확인하고, 안 달렸으면 워크플로우를 재생성한다.
- **난이도**: ★★☆ (약 15분)
