# Claude Code v2.1.304

> 작성일: 2026-10-20

---

# 📋 요약본

## 🎉 신기능 (7건)
- **mod 훅 제어 확장** — mod의 `tool.check` 기능이 늘었다.
  - `decider: "person"` 응답을 추가했다. 이 승인 요청은 권한 다이얼로그나 호스트 콜백만 승인할 수 있다. 물어볼 사람이 없는 환경에서는 mod가 준 사유로 거부한다.
  - `e.isReadOnly` 이벤트 필드를 추가했다. 읽기 전용 도구 호출일 때 값이 설정된다.
  - 먼저 실행된 플러그인이 내 mod의 훅을 건너뛰면 트랜스크립트에 이벤트명과 플러그인명이 남는다.
- **`/auto-mode-setup`** — 프로젝트와 최근 세션을 읽어 auto mode에 환경 정보를 알려주는 안내형 설정이다. 이제 Bedrock, Vertex, Foundry, Claude apps gateway, 텔레메트리 비활성 세션에서도 쓸 수 있다.
- **`/claude-api managed-agents-secure`** — Managed Agents 에이전트 설정을 Anthropic이 공개한 보안 가이드와 비교한다. 설정은 바꾸지 않는다.
- **compaction 요약에 도구 이름 표시** — 트랜스크립트 뷰(Ctrl+O)의 compaction 요약에 그전에 호출한 도구 이름이 표시된다.
- **비활성 대화 재개 경고 (Pro/Max)** — 재개하면 5시간 사용 한도를 크게 소모하는 경우 경고를 띄운다. 그대로 재개하거나 새 대화를 시작할 수 있다. 새 대화에서 이전 대화를 언급하면 Claude가 찾아본다.
- **[VSCode] mod 그리기 지원 범위 확대** — Bedrock, Vertex AI, Foundry, LLM 게이트웨이, 텔레메트리 비활성 세션의 채팅 패널에서도 mod 그리기가 동작한다.
- **[Code Review] 리뷰 레벨과 조직 전체 리뷰** — Owner가 조직 기본 레벨로 Quick, Standard(기본값), Deep 중 하나를 고르고, 레포마다 따로 지정할 수 있다. GitHub 조직의 모든 레포(이후 추가되는 레포 포함)를 한 번에 리뷰 대상으로 지정하는 옵션도 생겼다.

## 🛠️ 개선/수정 (12건)
- **안전 프롬프트 보강** — `/Volumes`, `/media`, `/mnt/c` 같은 마운트 드라이브나 최상위 폴더에 `rm -r`을 실행하면 이제 안전 확인을 묻는다.
- **`claude --worktree` 커밋 유실 방지** — HEAD가 분리됐거나 다른 브랜치일 때 종료 시점에 worktree와 브랜치를 묻지 않고 지우던 문제를 고쳤다.
- **`CLAUDE_CODE_AUTO_COMPACT_WINDOW` 접미사 지원** — `200k`가 100K로 잘못 적용되던 문제를 고쳤다. 이제 `k`, `M` 접미사를 받고, 범위를 벗어난 값이나 무시된 값은 경고한다.
- **headless 실행 종료 보장** — 플러그인이 서브에이전트를 띄워 `--max-turns`, Stop, 입력 종료 이후에도 실행을 이어가던 문제를 고쳤다.
- **compaction·컨텍스트 오류 수정** — compaction 중 턴을 멈춘 뒤 "Context limit reached"나 "Prompt is too long"이 나던 문제를 고쳤다. compaction이 끝나면 스킬 목록을 다시 보내고, `/reload-skills`는 새로 생기거나 바뀐 스킬만 보낸다.
- **서브에이전트 안정성** — 작업을 막 끝낸 직후 메시지를 받거나 재개된 서브에이전트가 최근 작업을 잊던 문제를 고쳤다. 다수 동시 실행 시 응답성과 처리량도 개선했다.
- **LLM 게이트웨이 호환성** — `context_management: Extra inputs are not permitted` 오류가 나면 그 필드를 빼고 다시 보낸다. 커스텀 `ANTHROPIC_BASE_URL`에서 tool search가 기본으로 켜지고, 게이트웨이가 400/422를 반환하면 tool search 없이 재시도한다.
- **`/loop` 1시간 wakeup 캐시 수정** — 최대치(1시간)로 예약한 self-paced wakeup이 프롬프트 캐시 만료 직후 실행되던 문제를 고쳤다.
- **훅 관련 수정** — Agent SDK 콜백 훅이 타임아웃되면 PreToolUse 훅의 deny 사유가 타임아웃 에러로 덮이던 문제를 고쳤다. 스킬의 `once` 훅이 다른 스킬의 같은 훅까지 지우던 문제도 고쳤다. 스킬 훅은 소스당 세션 1회 기준 최대 1,024개, matcher 16,384자로 제한된다.
- **Remote Control·Desktop 수정** — 터미널에 다른 계정으로 로그인했을 때 대화 이력을 계속 주지 않던 문제를 고쳤다. `DISABLE_TELEMETRY` 설정 시 시작이 안 되던 문제와 셸 시작 파일의 환경변수가 보이지 않던 문제도 고쳤다.
- **성능 개선** — auto mode 세션 파일 크기를 줄였다. 긴 대화·재개 대화의 메모리 사용을 줄였다. 큰 compaction 세션의 재개 속도를 높였다.
- **[VSCode] 시작 타임아웃 완화** — SessionStart 훅 실행 시간은 60초 시작 제한에서 빼서 센다(총 10분까지). 백그라운드 서브에이전트는 Agent 카드 아래 상태 한 줄로만 표시한다.

## 🔑 이번 버전의 핵심 키워드
**"mod 권한 통제 강화와 실수로 지우는 사고 차단"** — 사람만 승인할 수 있는 mod 권한 요청이 생겼다. 마운트 드라이브 `rm -r`, worktree 자동 삭제처럼 데이터를 잃을 수 있는 경로도 막았다.

---

# 📜 원문 (한글 번역본)

> 원문 ChangeLog를 원래 순서 그대로 한 줄도 빠짐없이 번역한 문서입니다.

- 먼저 실행된 플러그인이 내 mod의 훅을 건너뛰면 트랜스크립트에 한 줄을 추가한다. 이 줄에는 이벤트와 플러그인 이름이 들어간다.
- mod의 `tool.check` 응답에 `decider: "person"`을 추가했다. 이 ask는 권한 다이얼로그나 호스트 콜백만 승인할 수 있다. 물어볼 사람이 없는 곳에서는 mod의 사유와 함께 거부된다.
- mod의 `tool.check` 이벤트에 `e.isReadOnly`를 추가했다. 도구 호출이 읽기 전용일 때 설정된다.
- `/auto-mode-setup`을 추가했다. 프로젝트와 최근 세션을 읽어 auto mode에 환경을 알려주는 안내형 설정이다. 이제 Bedrock, Vertex, Foundry, Claude apps gateway, 텔레메트리 비활성 세션에서도 쓸 수 있다.
- `/claude-api managed-agents-secure`를 추가했다. Managed Agents 에이전트의 설정을 Anthropic이 공개한 보안 가이드와 비교하며, 아무것도 변경하지 않는다.
- 트랜스크립트 뷰(Ctrl+O)의 compaction 요약에 그전에 호출된 도구 이름을 추가했다.
- Pro·Max 플랜에서 비활성 대화를 재개하면 5시간 사용 한도를 눈에 띄게 소모할 경우 경고를 추가했다. 그대로 재개하거나, 새 대화를 시작할 수 있다. 새 대화에서 이전 대화를 언급하면 Claude가 찾아볼 수 있다.
- 시작 시 `ANTHROPIC_API_KEY`를 승인하거나 `/config`에서 "Use custom API key"를 전환한 뒤 조직 정책이 매시간 점검 때까지 갱신되지 않던 문제를 수정했다.
- Linux에서 `sandbox.filesystem.denyRead` glob에 문자 클래스가 아닌 대괄호(예: `[user-id]` 라우트 폴더)가 있으면 샌드박스 명령이 시작되지 않던 문제를 수정했다.
- 마운트된 드라이브나 최상위 폴더(`/Volumes`, `/media`, WSL의 `/mnt/c`)에 대한 `rm -r`이 `rm -rf /Applications`에 뜨는 안전 프롬프트를 받지 못하던 문제를 수정했다.
- 파일을 줄이는 도중 디스크가 가득 차면 `CLAUDE_CODE_TRANSCRIPT_LOCAL_GC`가 저장된 트랜스크립트에서 메시지를 누락하던 문제를 수정했다.
- 플러그인이 서브에이전트를 띄우거나 끝난 서브에이전트를 다시 실행해 headless 실행을 `--max-turns`, Stop, 입력 종료 이후까지 이어가던 문제를 수정했다.
- mod 리로드가 실패하면 계속 로드된 채로 남는 버전의 도구와 명령까지 제거하던 문제를 수정했다. 이전 버전이 여전히 로드돼 있는지에 대해 메시지가 틀리거나 아무 말도 없던 문제도 함께 수정했다.
- 같은 라벨에 `key`가 없는 버튼이 변경 없이 다시 그려질 때 mod 버튼 클릭이 사라지던 문제를 수정했다.
- managed settings가 있는 머신과 Team·Enterprise 플랜에서 내장 `plugin-authoring` 스킬의 mod 공유가 시크릿 스캔 단계에서 멈추던 문제를 수정했다.
- 예약된 Cowork 클라우드 세션에서 WebFetch에 URL 승인이 필요한데 승인할 사람이 없을 때, 서브에이전트마다 다시 5분씩 기다리던 문제를 수정했다.
- Write 결과와 거부된 편집에서 작업 디렉토리 밖 파일이 `../../…`로 표시되던 문제를 수정했다. 이제 `~/…` 또는 전체 경로로 표시한다.
- Cowork 클라우드 세션에서 "/" 메뉴로 고른 claude.ai Directory 플러그인의 스킬이 명령으로 실행되지 않던 문제를 수정했다.
- 터미널에 다른 계정이 로그인돼 있으면 Remote Control이 데스크톱 대화의 이력을 영구히 보류하던 문제를 수정했다.
- 유료 플랜에서 DISABLE_TELEMETRY 또는 DO_NOT_TRACK이 설정돼 있으면 Claude Desktop에서 Remote Control이 시작되지 않던 문제를 수정했다.
- SDK·데스크톱 세션에서 모델 전환, 메시지, 인터럽트가 컨텍스트 사용량 점검 뒤에서 대기하던 문제를 수정했다.
- LLM 게이트웨이 뒤에서 나던 `context_management: Extra inputs are not permitted` 오류를 수정했다. 이제 해당 필드 없이 요청을 다시 보낸다.
- 최초 설정 중이나 /logout 후 첫 시작 때 로그인하면, server-managed settings로 전달된 OpenTelemetry 설정이 세션 내내 무시되던 문제를 수정했다.
- macOS·Linux의 Claude Desktop Code 탭 세션에서 샌드박스 밖 Bash 명령이 ~/.zshrc 같은 셸 시작 파일에서 export한 환경변수를 보지 못하던 문제를 수정했다.
- 서버 오류 후 Consumer Terms 안내가 하루 이상 생략되던 문제를 수정했다.
- 네트워크·서버 오류 후 `/privacy-settings`가 해당되지 않을 수 있는 선택지를 보여주던 문제를 수정했다.
- API가 너무 길다고 거부한 대화를 compaction하는 도중 턴을 멈추면 "Context limit reached" 또는 "Prompt is too long" 오류가 나던 문제를 수정했다.
- 서브에이전트가 작업을 끝낸 직후 메시지를 받거나 재개되면 가장 최근 작업을 잊던 문제를 수정했다.
- `--tools`, `--resume`, `--debug`, `--json-schema`, `--disable-slash-commands`, `--system-prompt-snapshot`, `claude update`의 `claude --help` 설명을 실제 동작에 맞게 수정했다.
- HEAD가 분리됐거나 다른 브랜치에 있을 때 `claude --worktree`가 종료 시 묻지 않고 worktree와 브랜치를 제거해 커밋을 잃을 수 있던 문제를 수정했다.
- 재개 세션과 클라우드 세션에서 시작 중 플러그인이 리로드될 때마다 스킬 목록 전체를 Claude에게 다시 보내던 문제를 수정했다.
- 이미지처럼 이름 붙은 유휴 파이프나 장치를 기다리는 Read를 인터럽트로 끝낼 수 없던 문제를 수정했다.
- `CLAUDE_CODE_EFFORT_LEVEL`이 `auto` 또는 `unset`이고 보낼 레벨이 없을 때, `/effort status`, `/effort ultracode`, 프롬프트의 effort 표시가 추측한 레벨을 보여주던 문제를 수정했다.
- 같은 도구 호출의 Agent SDK 콜백 훅이 타임아웃되면 PreToolUse 훅의 deny 사유가 타임아웃 오류로 바뀌던 문제를 수정했다.
- 큰 명령 출력 파일을 세션의 tool-results 폴더로 복사하지 못하면 Bash와 PowerShell이 그 파일을 삭제하던 문제를 수정했다. 디스크가 가득 찬 경우는 예외다.
- 약 100열 미만 터미널에서 미리보기가 있는 객관식 질문에 입력한 메모가 "…"로 잘려 입력 내용이 가려지던 문제를 수정했다 (anthropics/claude-code#82768).
- 1시간 최대치로 예약된 self-paced `/loop` wakeup이 1시간 프롬프트 캐시 만료 직후 실행되던 문제를 수정했다. 이제 해당 wakeup이 대화를 캐시 없이 다시 읽지 않는다.
- agent teams 수정: 메인 세션에서 종료 요청을 승인해도 CLI 전체가 종료되지 않는다.
- 스킬의 `once` 훅이 실행 후 다른 스킬의 동일한 훅까지 제거하던 문제를 수정했다.
- 트랜스크립트 모드의 `{`, `}`가 프롬프트를 트랜스크립트 첫 행이 아니라 일관되지 않은 행이나 화면 밖에 두던 문제를 수정했다.
- `CLAUDE_CODE_AUTO_COMPACT_WINDOW=200k`가 조용히 100K 창으로 설정되던 문제를 수정했다. 이제 이 변수는 `--autocompact`처럼 `k`, `M` 접미사를 받고, 범위를 벗어나거나 무시된 값은 경고한다.
- agents 뷰에서 마우스 버튼을 떼기 전에 Ctrl+C를 누르면 텍스트 선택이 복사되지 않고 지워지던 문제를 수정했다.
- `/usage`가 사용량 데이터 rate limit이 걸렸을 때 "잠시 후 다시 시도" 대신 제한이 언제 끝나는지 알려주도록 개선했다.
- 세션에서 작성한 mod가 로드·리로드되거나 로드에 실패할 때 표시되는 줄을 개선했다.
- 여러 뷰를 가진 artifact를 개선했다. 링크를 요청하면 Claude가 뷰별 링크를 적고, 뷰를 바꿔도 주소창은 그대로라는 점을 설명한다.
- 클라우드 세션을 개선했다. 새 대화의 첫 턴이 claude.ai에서 동기화된 플러그인의 로컬(stdio) MCP 서버를 더 이상 기다리지 않는다. 단, 서버가 `alwaysLoad: true`를 설정하면 기다린다.
- 다른 세션 데이터가 담긴 상태 업데이트를 서버가 거부할 때 원격 세션이 상태를 복구하는 방식을 개선했다.
- auto mode의 세션 파일 크기를 개선했다. 안전 분류기의 컨텍스트를 더 이상 매 요청마다 저장하지 않는다.
- `claude -p`의 잘못된 settings 경고를 개선했다. 로드되지 않은 파일은 로드를 막은 원인만 나열하고, 긴 목록은 파일별로 잘라 보여준다.
- SDK·headless 모드에서 큰 compaction 세션의 재개를 개선했다. 재개 후 첫 요청이 더 빨리 전송된다.
- 다수의 서브에이전트가 동시에 실행될 때 응답성과 처리량을 개선했다.
- 길거나 재개된 대화에서 요청을 보낼 때의 메모리 사용을 개선했다.
- Self-hosted runner: git 호스트가 세션의 레포지토리에 대해 "not found"를 반환할 때 오류를 개선했다. 이제 레포지토리 이름과 문의할 대상을 알려준다.
- Windows: 표준 Git for Windows 설치에서 git.exe를 cmd 런처 없이 직접 실행해 git 명령 시작 속도를 개선했다.
- mod의 `settings.read` 훅이 각 settings 레이어를 받아 병합된 settings를 다시 쓰도록 변경했다. 이제 managed mod가 조직 설정을 상한으로 둘 수 있다. 보존 정리(retention sweep)가 쓰는 `cleanupPeriodDays`도 포함된다.
- `/artifacts` 삭제 확인을 번호 선택지로 변경했다. 1 또는 Enter는 유지, 2는 삭제다. y, n, Esc도 계속 동작한다.
- 세션에서 Claude가 작성한 mod를 켜는 질문을 링크나 세션 id 없는 평문으로 변경했다. 새 턴이 시작돼도 질문이 유지되고, 켜면 Claude가 무엇이 로드됐는지 알려준다.
- 커스텀 `ANTHROPIC_BASE_URL` 뒤에서 tool search가 기본으로 켜지도록 변경했다. 게이트웨이가 400 또는 422를 반환하면 tool search 없이 재시도한다.
- compaction 후 Claude에게 스킬 목록을 다시 보내도록 변경했다. `/reload-skills`는 이제 새로 생기거나 바뀐 스킬만 보낸다.
- 스킬 훅을 변경했다. 한 소스(레포, 내 폴더, 플러그인)의 스킬은 세션당 최대 1,024개 훅과 16,384자 matcher까지 등록할 수 있다.
- 플러그인의 훅만 허용하는 정책 아래의 스킬을 변경했다. 메인 대화에서 쓰였지만 훅이 차단된 스킬은 더 이상 `allowed-tools`를 받지 않는다.
- /claude-api 스킬이 Claude Platform on AWS에서 SDK나 curl로 대체하지 않고 `ant` CLI를 쓰도록 업데이트했다.
- `claude plugin validate`에서 mod 훅이 어디서 실행될지 예측하던 안내를 제거했다.
- Opus 5.5의 `/fast` 다이얼로그 제목에서 "(research preview)" 라벨을 제거했다.
- [VSCode] Amazon Bedrock, Google Vertex AI, Microsoft Foundry, LLM 게이트웨이 뒤, 또는 텔레메트리를 끈 세션의 채팅 패널에서 mod 그리기를 추가했다.
- [VSCode] "Subprocess initialization did not complete within 60000ms"로 세션 시작이 실패하던 원인 하나를 수정했다. SessionStart 명령 훅의 실행 시간은 더 이상 제한에 포함되지 않는다(총 10분까지).
- [VSCode] 시작 중에 닫은 세션이 시작이 끝날 때까지 Claude Code 프로세스를 계속 실행하던 문제를 수정했다.
- [VSCode] 구버전 Claude Code도 함께 실행하는 머신에서, 오래 열어둔 패널의 mod 그림이 다음 턴까지 사라지던 문제를 수정했다.
- [VSCode] `claudeCode.claudeProcessWrapper`가 설정돼 있으면 Past conversations에서 세션이 숨겨지던 문제를 수정했다.
- [VSCode] 백그라운드 서브에이전트가 모든 단계를 채팅에 스트리밍하지 않고 Agent 카드 아래 상태 한 줄로 표시되도록 변경했다. 전체 트랜스크립트는 /tasks에 남는다.
- [Cloud sessions] 클라우드 세션에서 composer의 @ 목록에 있는 폴더 이름이 표시되지 않아, 선택하면 멘션 대신 공백만 추가되던 문제를 수정했다.
- [Claude Tag] 작업 도중 채널이 Enterprise Grid 워크스페이스 간에 공유되면 Claude가 스레드에서 응답하지 않던 문제를 수정했다. 이제 새 스레드에서 @-멘션하라는 안내를 한 번 게시한다.
- [Claude Tag] 스레드 밖에서 입력한 `@Claude !fork`에 보이는 응답이 없던 문제를 수정했다. 이제 스레드 안에서 실행하라는 비공개 안내를 보여준다.
- [Code Review] Code Review에 리뷰 레벨을 추가했다. Owner가 조직용으로 Quick, Standard(기본값), Deep 중 하나를 고르고, 개별 레포지토리에 별도 레벨을 줄 수 있다.
- [Code Review] Code Review 관리자 설정에 GitHub 조직의 모든 레포지토리(이후 추가되는 레포 포함)를 하나씩 고르지 않고 리뷰하는 옵션을 추가했다.
- [Code Review] 관리자가 Code Review를 켠 뒤 1~2분 안에 열린 PR이 조용히 건너뛰어지던 문제를 수정했다. 이제 재시도해서 리뷰한다.

---

## 🎯 챌린지

이번 버전에서 내 환경에 적용해볼 만한 항목입니다.

### 1. `/auto-mode-setup`으로 autoMode 환경 정보 다시 만들기
- **파일**: `~/.claude/settings.json` (`autoMode.environment`)
- **근거**: 지금 `autoMode.environment`는 수동으로 채워져 있다. 대부분 "None configured"이고, 파일이 0개인 `/Users/leeseonro/gitlab/flyff` 레포를 기준으로 작성돼 있다. 이번 버전에서 추가된 `/auto-mode-setup`은 프로젝트와 최근 세션을 읽어 이 정보를 채워준다. EOS-H5, Poplus 같은 실제 작업 환경과 GCP 프로젝트, `dev`/`ext-dev` 브랜치 규칙을 반영하면 auto mode가 판단을 잘못하는 일이 줄어든다.
- **난이도**: ★★☆ (약 15분)

### 2. 1M 컨텍스트용 자동 compaction 창 지정
- **파일**: `~/.claude/settings.json` (`env.CLAUDE_CODE_AUTO_COMPACT_WINDOW`)
- **근거**: 기본 모델이 `opus[1m]`이라 긴 세션에서 컨텍스트가 커지기 쉽다. 이번 버전부터 `CLAUDE_CODE_AUTO_COMPACT_WINDOW`가 `k`, `M` 접미사를 제대로 받는다(예전에는 `200k`가 100K로 적용됐다). 범위를 벗어난 값은 경고도 해준다. `"400k"` 같은 값을 지정하면 compaction 시점을 직접 통제할 수 있다. 메모리 인덱스 기준으로 `env` 설정은 아직 확인되지 않는다. 적용 전에 기존 `env` 블록이 있는지 확인해야 한다.
- **난이도**: ★☆☆ (약 5분)
