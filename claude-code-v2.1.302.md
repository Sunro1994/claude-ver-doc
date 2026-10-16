# Claude Code v2.1.302

> 작성일: 2026-10-17

---

# 📋 요약본

## 🎉 신기능 (4건)
- **`CLAUDE_CODE_AUTO_MODE_MODEL` 환경변수** — auto mode 판정기(도구 실행을 허용할지 자동으로 판단하는 검사 모델)를 클라이언트 쪽에서 돌릴 때 쓸 모델을 고른다.
  - 서버 쪽 auto mode 판정기의 모델은 바뀌지 않는다.
- **`/config` 에 `Idle compaction` 항목 추가** — 세션이 쉬는 동안 대화를 자동 압축하는 기능을 켜고 끌 수 있다.
  - 자동 압축 뒤에 뜨는 안내에 끄는 방법이 함께 나온다.
- **Claude Design 종료 안내** — `/design-sync`·`/design-login` 에 단독 Claude Design(claude.ai/design)이 2026-12-14 에 닫힌다는 안내가 뜬다.
- **[Cloud sessions] routine 미실행 사유 배너** — routine 페이지에서 마지막 실행이 시작되지 않은 이유를 보여준다. 예: 조직의 동시 cloud session 한도 도달.

## 🛠️ 개선/수정 (16건)
- **압축·컨텍스트 안정화** — 압축 중에 턴을 멈출 때 나던 "Prompt is too long" 에러를 고쳤다. 세션 중간에 추가된 도구를 ToolSearch 나 압축 뒤에 다시 불러올 때 생기던 prompt cache miss 도 고쳤다.
- **auto mode 개선** — 대화가 너무 길어 서버 판정기가 검사하지 못하면 이제 대화를 압축한다. 전에는 검사 대상 도구 호출이 모두 거부됐다. OpenTelemetry `tool_decision` 이벤트에서 빠지던 `classifier_category` 도 이제 들어간다.
- **모델·제공자 설정 버그** — 세션 중간에 Vertex·Bedrock 으로 바꾸면 나던 "diagnostics: Extra inputs are not permitted" 에러를 고쳤다. gateway 가 `anthropic/claude-opus-4-1` 처럼 접두어를 붙여 모델 이름을 쓸 때 `/autocompact`·`/effort` 가 엉뚱한 모델에 저장되던 문제도 고쳤다.
- **Read 도구 메모리 보호** — 이미지 파일을 크기와 상관없이 통째로 메모리에 올리던 문제를 고쳤다. 이미지처럼 이름 붙은 pipe·device 도 마찬가지였다. 128 MB 넘는 이미지는 이제 거부한다.
- **plugin·marketplace 안정화** — 하위 명령이 설정 쓰기를 끝내기 전에 종료되던 문제를 고쳤다. git 이 reftable(참조를 저장하는 새 형식)을 쓰면 marketplace 를 매번 다시 clone 하던 문제와 버전이 "unknown" 으로 뜨던 문제도 고쳤다. plugin 이 많을 때 시작 속도가 빨라졌다.
- **MCP 호환성** — 서버가 protocol 2026-07-28 을 쓰면서 `resultType`·`ttlMs`·`cacheScope` 를 빠뜨리면 도구가 안 보이거나 호출이 모두 실패하던 문제를 고쳤다. 데스크톱 앱이 쓸 수 없는 인증 경로를 안내하던 문제도 고쳤다.
- **subagent 실행 방식 통일** — `claude -p`·Agent SDK·데스크톱·VS Code 에서 fork subagent 가 기본으로 켜진다. 데스크톱·VS Code 는 메인 대화의 subagent 를 항상 백그라운드로 돌린다.
- **`claude -p` 기본 권한 모드 변경** — 서드파티 제공자에서 권한 모드 없이 시작하면 `default` 로 시작한다. telemetry 를 껐거나 새로 설치한 경우도 같다.
- **hook 동시 실행 제한** — prompt hook·agent hook 은 한 이벤트당 최대 12개만 동시에 돈다.
- **worktree·Windows 파일 쓰기** — git 2.56 이상에서 worktree 를 만들거나 이어서 쓰지 못하던 문제를 고쳤다. exFAT·FAT32 드라이브에서 모든 파일 쓰기가 거부되던 문제도 고쳤다.
- **터미널 표시 개선** — 줄바꿈된 URL 이 통째로 한 링크가 된다. 이모지 너비 계산 오류와 agents view 빈 행 문제를 고쳤다. `← for agents` 힌트는 10초 뒤에 사라진다.
- **기타 CLI 수정** — 비용·사용량, 안내 문구, 도움말을 고쳤다. 대상은 credit 으로만 결제되는 모델의 prompt suggestion 과금, `remote-control --help`, `plugin details`, `/feedback`·`/design` 안내 문구, PowerShell, artifact publish, Chrome 지시문 cache 위치다.
- **[VSCode] 3건 수정** — 스트리밍 중 코드 블록이 잘못 보이던 문제, URL 에 query string 이 있으면 MCP 로그인이 깨지던 문제, `@browser` 연결 상태가 잘못 표시되던 문제를 고쳤다.
- **[Cloud sessions]·[Remote Control] 9건 수정** — rewind, PR 상태 표시, routine 상태와 중복 재실행, diff view, 다른 기기에서 보낸 메시지 표시, 비용 누적, 에러 문구, 오프라인 상태 표시를 고쳤다.
- **[Claude Tag] 14건 수정·개선** — Slack 응답 형식, 이미지 첨부, 권한, DM 안정성, 관리자 설정 UI 를 정비했다.
- **[Code Review] 설정 재개** — GitHub 연결을 마치고 돌아오면 repository 선택 화면이 다시 열린다.

## 🔑 이번 버전의 핵심 키워드
**"auto mode 모델 선택과 실행 방식 통일"** — 판정기 모델을 직접 고를 수 있게 하고, subagent·권한 모드 기본값을 실행 환경마다 맞췄다.

---

# 📜 원문 (한글 번역본)

> 원문 ChangeLog를 원래 순서 그대로 한 줄도 빠짐없이 번역한 문서입니다.

- 클라이언트 쪽 auto mode 판정기가 쓸 모델을 고르는 `CLAUDE_CODE_AUTO_MODE_MODEL` 을 추가했다. 서버 쪽 auto mode 의 모델은 바꾸지 않는다
- 유휴 압축을 끄거나 다시 켜는 `Idle compaction` 행을 `/config` 에 추가했다. 유휴 압축 뒤에 뜨는 안내가 끄는 방법을 알려준다
- `/design-sync`·`/design-login` 에 단독 Claude Design(claude.ai/design)이 2026-12-14 에 닫힌다는 안내를 추가했다
- 대화를 압축하는 중에 턴을 멈추면 나던 "Prompt is too long" 에러를 수정했다
- 세션 중간에 Vertex·Bedrock 으로 전환한 뒤 요청이 "diagnostics: Extra inputs are not permitted" 로 실패하던 문제를 수정했다
- Read 도구가 크기에 상관없이 이미지 파일을, 또는 이미지 이름을 단 pipe·device 를 통째로 메모리에 올리던 문제를 수정했다. 128 MB 를 넘는 이미지는 이제 거부한다
- gateway 가 Opus 4·4.1 을 `anthropic/claude-opus-4-1` 처럼 접두어를 붙여 부를 때 `/autocompact`·`/effort` 가 엉뚱한 모델에 저장되던 문제를 수정했다
- 세션 중간에 추가된 도구를 ToolSearch 로, 또는 압축 뒤에 다시 불러올 때 생기던 prompt cache miss 를 수정했다
- `claude plugin` 등 하위 명령이 대기 중인 settings·config 쓰기가 끝나기 전에 종료되어, 변경이 사라지거나 `.tmp` 파일이 남던 문제를 수정했다
- git 기본 ref 형식이 reftable 일 때 plugin marketplace 를 refresh 할 때마다 다시 clone 하던 문제와, 새로 설치한 git plugin 의 버전이 "unknown" 으로 뜨던 문제를 수정했다
- PowerShell 도구가 plugin 의 `bin/` 폴더에 있는 명령을 찾지 못하던 문제를 수정했다. 결과가 없는 검색(rg, grep, findstr, git grep)을 `Select-Object` 같은 서식 cmdlet 으로 넘기면 에러를 보고하던 문제도 수정했다
- 데스크톱 앱의 Claude 가 MCP server 인증·재연결에 쓸 수 없는 claude.ai 설정이나 `/mcp` 를 안내하던 문제를 수정했다
- Claude 가 빈 수정 목록을 보내면 artifact publish 가 가끔 실패하던 문제를 수정했다. 더 새로운 artifact 버전이 업데이트를 거절한 뒤 Claude 가 잘못된 방식으로 다시 시도하던 문제도 수정했다
- 대부분의 auto mode 판정기 차단에서 OpenTelemetry `tool_decision` 이벤트에 `classifier_category` 가 빠지던 문제를 수정했다. `OTEL_LOGRECORD_ATTRIBUTE_COUNT_LIMIT` 이 낮을 때 새 `tool_decision` 속성이 `tool_use_id`·`tool_source`·`tool_parameters` 를 밀어내던 문제도 수정했다
- 긴 목록을 내려가거나 섹션을 접은 뒤 agents view 의 행이 비어 있던 문제를 수정했다
- 로그인하지 않은 상태에서 `claude remote-control --help` 가 사용법을 출력하고 종료하지 않던 문제를 수정했다
- cloud session 에서 `/design consent`·`/design revoke` 가 실패하면 쓸 수 없는 `/design-login` 을 제안하던 문제를 수정했다. 이제 claude.ai/design/settings 를 안내한다
- 서버가 protocol 버전 2026-07-28 을 협상하면서 `resultType`·`ttlMs`·`cacheScope` 를 빠뜨리면 MCP server 도구가 보이지 않거나 모든 도구 호출이 실패하던 문제를 수정했다
- 요금제상 credit 으로만 결제되는 모델에서 prompt suggestion 이 사용량 credit 을 쓰던 문제를 수정했다. credit 으로 청구된 응답 뒤에는 이제 건너뛴다
- backtick 안에 쓴 URL 이 줄바꿈되면 첫 줄만 클릭되던 문제를 수정했다. hyperlink 를 지원하는 터미널에서는 URL 전체가 한 링크가 된다
- `claude plugin details <name>@builtin` 이 plugin 을 찾지 못하면 내장 plugin 을 절대 보여주지 않는 `claude plugin list` 를 제안하던 문제를 수정했다. 이제 `/plugin` 을 안내한다
- 링크가 이모지 안에서 시작할 때 줄바꿈 너비가 한 칸 넓게 잡히던 문제를 수정했다. 이 때문에 질문 미리보기에서 이모지가 가려지고 표가 목록으로 바뀌었다
- git 2.56 이상에서 엉뚱한 `.git` 파일이 존재하지 않는 디렉터리를 가리키면 worktree isolation 이 worktree 생성·재개를 거부하던 문제를 수정했다
- cloud session 이 새 프로세스로 재개되면 비용·사용량이 0부터 다시 시작하던 문제를 수정했다
- Self-hosted runner: git reftable 형식으로 저장된 checkout 을 재사용하는 세션에서 git fetch 가 "bad object refs/heads" 로 실패하던 문제를 수정했다
- Windows: exFAT·FAT32 드라이브의 프로젝트에서 모든 파일 쓰기가 거부되거나 확인을 요구하던 문제를 수정했다. `--plugin-dir` 로 시작한 세션도 포함한다
- plugin 이 많을 때 시작 시간을 줄였다. plugin command·agent 파일을 불러올 때 파일 시스템 호출이 크게 줄었고, Windows 에서 가장 많이 줄었다
- 서버 쪽 판정기를 쓰는 auto mode 를 개선했다. 안전 검사에 쓰기엔 너무 긴 대화는 이제 압축한다. 전에는 검사 대상 도구 호출이 모두 거부됐다
- 다른 폴더에서 다시 연 백그라운드 세션에 LLM gateway 가 없을 때 메시지를 개선했다. "Not logged in" 대신 이유를 알려준다
- 권한 모드 없이 시작한 `claude -p`·Agent SDK 세션이 서드파티 제공자에서, telemetry 를 끈 상태에서, 또는 새로 설치한 상태에서 `default` 모드로 시작하도록 바꿨다. `--permission-mode auto` 는 auto 를 유지한다
- fork subagent(`subagent_type: "fork"`)를 터미널처럼 `claude -p`·Agent SDK·데스크톱 앱·VS Code 에서도 기본으로 켜도록 바꿨다. `CLAUDE_CODE_FORK_SUBAGENT=0` 으로 끈다. `claude mcp serve` 는 제공하지 않는다
- 데스크톱 앱·VS Code 가 메인 대화의 subagent 를 Claude 판단에 맡기지 않고 터미널처럼 항상 백그라운드로 돌리도록 바꿨다. `claude -p`·Agent SDK·데스크톱 앱·VS Code 에서 subagent 가 스스로 부르는 Agent 호출은 이제 기본으로 foreground 에서 돈다
- `← for agents` 하단 힌트가 세션을 연 뒤 10초가 지나면 숨겨지도록 바꿨다. 사용자 응답을 기다리는 agent 수는 계속 보인다
- 새 대화가 공유 prompt cache 에서 Claude in Chrome 지시문을 읽을 수 있도록 system prompt 안 위치를 바꿨다
- prompt hook·agent hook 은 한 이벤트당 최대 12개만 동시에 돌고 나머지는 차례를 기다리도록 바꿨다
- 조직 정책으로 `/feedback` 을 끈 경우의 메시지를 바꿨다. 조직 관리자 대신 GitHub issues 를 안내한다
- [VSCode] 응답 스트리밍 중 목록 안의 닫히지 않은 코드 블록 뒤 텍스트가 일반 텍스트로 보였다가 코드로 바뀌던 문제를 수정했다
- [VSCode] 서버 URL 에 query string 이 있으면 패널의 MCP server 로그인이 깨진 인증 페이지를 열던 문제를 수정했다
- [VSCode] Claude 확장이 있는 브라우저에 연결할 수 없는데도 `@browser` 배너가 "Browser connected" 로 표시되던 문제를 수정했다
- [Cloud sessions] routine 페이지에 마지막 실행이 시작되지 않은 이유를 알려주는 배너를 추가했다. 예: 조직의 동시 cloud session 한도 도달
- [Cloud sessions] cloud session 에서 가장 최근 메시지를 뺀 모든 메시지에서 "Rewind to here" 가 실패하던 문제를 수정했다. self-hosted runner 는 Claude Code v2.1.246 이상이 필요하다
- [Cloud sessions] GitHub 가 다시 검사하는 동안 cloud session 의 PR 상태 표시줄이 merge conflict 가 있는 PR 을 ready 로 되돌려 표시하던 문제를 수정했다
- [Cloud sessions] cloud session 이 예기치 않게 멈춘 routine 실행이 Completed 로, 시작 전에 보관된 실행이 Cancelled 로 표시되던 문제를 수정했다. 둘 다 이제 failed 로 표시된다
- [Cloud sessions] 세션의 GitHub repository 이름을 바꾸거나 옮긴 뒤 cloud session 의 diff view 에서 변경이 빠지거나 로드가 실패하던 문제를 수정했다
- [Cloud sessions] 중간에 실패한 예약 routine 실행이 1시간 이상 뒤 처음부터 다시 실행되던 문제를 수정했다. 이 때문에 같은 보고서를 두 번 올리는 식으로 작업이 반복될 수 있었다
- [Cloud sessions] 열려 있는 cloud session 에 다른 기기에서 보낸 메시지가 새로고침하거나 다른 곳을 눌렀다 돌아오기 전까지 가끔 보이지 않던 문제를 수정했다
- [Cloud sessions] cloud session 시작 실패 시 에러를 개선했다. "Something went wrong" 대신 "Connection lost" 또는 "Server error" 로 표시한다
- [Remote Control] 컴퓨터가 오프라인이 되면 Remote Control 세션의 subagent 창이 계속 돌던 문제를 수정했다. 이제 Remote Control 연결이 끊겼다고 표시한다
- [Claude Tag] Claude 가 이전 메시지를 수정하는 방식으로 답했을 때 Slack 채널·DM 의 멘션 아래에 "is thinking…" 이 계속 남던 문제를 수정했다
- [Claude Tag] Claude 의 Slack 응답에서 번호·글머리 단계 아래 코드 블록 안 URL 이 꺾쇠괄호로 감싸져, 복사한 명령이 깨지던 문제를 수정했다
- [Claude Tag] Slack 에 첨부한 HEIC·SVG·TIFF·BMP 이미지가 Claude 에게 전달되지 않던 문제를 수정했다. 이제 다른 파일 형식처럼 작업 파일로 전달된다
- [Claude Tag] 역할별로 Claude Tag 를 제한하는 조직에서 새 채널 관리자가 Slack 의 Claude 접근 권한을 잃던 문제를 수정했다. 이제 manager 역할도 Slack 의 Claude Tag 권한을 받는다
- [Claude Tag] MCP server 가 같은 host 를 쓰는 custom connector 가 Claude Tag 관리자 설정에서 하나로 보이던 문제를 수정했다. 이제 서버마다 별도 connector 로 보인다
- [Claude Tag] Slack 조회 하나가 멈추면 Slack 의 Claude 가 DM 에 "DMs are temporarily unavailable" 로 답하고 메시지를 버리던 문제를 수정했다. 이제 먼저 재시도한다
- [Claude Tag] Slack Enterprise Grid 에서 Claude 와의 DM 이 Slack workspace 드롭다운을 무시하던 문제를 수정했다. 이제 마지막으로 Claude 를 연 연결 workspace 에서 실행된다
- [Claude Tag] Slack 의 Claude 가 채널 월 지출 한도 안내에서 채널 관리자가 한도를 올릴 수 있다고 하던 문제를 수정했다. 이제 조직 owner 를 안내하고 사용량 페이지 링크를 단다
- [Claude Tag] Claude 의 Slack 응답에서 링크가 바로 뒤의 굵게·기울임 닫는 기호나 전각 문장부호를 먹어, 링크와 서식이 깨지던 문제를 수정했다
- [Claude Tag] Claude Tag 관리자 설정의 repository 검색을 개선했다. 연결된 GitHub 계정을 최대 100개까지 다루고, GitHub App 설치의 첫 5,000개 뒤에 있는 private repository 도 찾는다
- [Claude Tag] Claude Tag 관리자 설정의 Add place 를 개선했다. 조직 전체 채널 목록이 다 뜨기를 기다리지 않고, 입력하거나 붙여 넣은 채널을 바로 보여준다
- [Claude Tag] Claude Tag 관리자 설정에서 workspace·채널 페이지의 Add > Domain 을 개선했다. 모든 채널이 아니라 그 페이지만 로드되면 바로 쓸 수 있다
- [Claude Tag] Claude Tag 관리자 설정에서 Claude 접근 권한을 Bundles, Connectors, Skills and plugins, Channels 네 탭으로 정리했다
- [Claude Tag] 조직 설정의 Roles 페이지가 Claude Tag 채널 관리자용으로 만든 역할을 조직 자체 역할 아래 접힌 섹션에 묶어 보여주도록 바꿨다
- [Code Review] GitHub 를 연결하러 나갔다 오면 Code Review 설정이 이어지지 않던 문제를 수정했다. 관리자 설정으로 돌아오면 repository 선택 화면이 다시 열린다

---

## 🎯 챌린지

이번 버전에서 내 환경에 적용해볼 만한 항목입니다.

### 1. auto mode 판정기 모델을 Opus 로 고정
- **파일**: `~/.claude/settings.json` (`env` 블록에 `CLAUDE_CODE_AUTO_MODE_MODEL` 추가)
- **근거**: `autoMode.environment` 를 따로 설정해 auto mode 를 쓰고 있고, CLAUDE.md §5 에서 신뢰성 우선(Opus 기본)을 정해 두었다. 새 `CLAUDE_CODE_AUTO_MODE_MODEL` 로 클라이언트 쪽 판정기도 같은 기준의 모델에 맞춘다. 서버 쪽 판정기에는 적용되지 않는다는 점은 알아 둔다.
- **난이도**: ★☆☆ (약 5분)

### 2. changelog 동기화 cron 의 `claude -p` 옵션 명시
- **파일**: `~/.claude/skills/claude-changelog-sync/` 안 동기화 스크립트(`claude -p --model opus` 를 부르는 부분)
- **근거**: 이번 버전부터 `claude -p` 에서 fork subagent 가 기본으로 켜지고, 일부 조건에서 권한 모드 기본값이 `default` 로 바뀐다. 매일 08:00 에 무인으로 도는 작업이라 동작이 바뀌면 바로 알기 어렵다. `--permission-mode` 를 명시하고, 필요하면 `CLAUDE_CODE_FORK_SUBAGENT=0` 을 붙여 결과를 매번 같게 만든다.
- **난이도**: ★★☆ (약 15분)

### 3. `Idle compaction` 켜짐/꺼짐 결정
- **파일**: `~/.claude/settings.json` (`/config` 의 `Idle compaction` 행에서 바꾸면 저장된다)
- **근거**: `opus[1m]` 과 `xhigh` 로 긴 세션을 돌리는데, 쉬는 동안 자동 압축이 일어나면 작업 원칙·복명복창 같은 맥락이 요약 과정에서 흐려질 수 있다. 이번 버전에서 새로 생긴 토글로 직접 정하고, 압축 뒤 뜨는 안내 문구로 실제 동작을 한 번 확인한다.
- **난이도**: ★☆☆ (약 5분)
