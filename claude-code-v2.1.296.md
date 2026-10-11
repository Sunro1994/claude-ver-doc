# Claude Code v2.1.296

> 작성일: 2026-10-11

---

# 📋 요약본

## 🎉 신기능 (8건)
- **Claude apps gateway `code` 정책 키** — `managed.policies[]`에 `code` 키를 추가한다. `cli`와 같은 설정을 Claude Desktop의 Code 탭에도 적용한다.
  - `desktop` 키와 함께 쓰면 Claude Desktop의 gateway 모드가 켜진다.
- **서브에이전트 `autoCompactWindow`** — 서브에이전트 frontmatter와 `--agents` 정의에서 지정한다. 서브에이전트가 메인 대화보다 이른 시점에 자동 압축(auto-compact)하게 할 수 있다.
- **`CLAUDE_CODE_WORKFLOW_SUBAGENT_MODEL`** — 모든 workflow 에이전트를 한 모델로 통일한다. 다른 서브에이전트는 원래 모델을 그대로 쓴다.
- **`CLAUDE_CODE_OVERLOADED_RETRY_MAX_DELAY_MS`** — 서버 과부하(529) 응답을 받고 재시도할 때 기다리는 최대 간격(backoff)을 늘린다.
- **`/plugin` 이름 충돌 안내** — 같은 이름의 다른 플러그인이 켜져 있어 hook이 빠진 플러그인에 안내 문구를 띄운다.
- **Read 도구 `allow_large` 옵션** — 크기 제한을 넘는 텍스트 파일도 한 번에 읽는다. 파일 전체가 필요하고 컨텍스트에 여유가 있을 때만 쓴다.
- **[Cloud sessions] 상태 필터** — self-hosted 환경 Activity 탭의 Sessions·Runners 목록에 상태 필터를 추가한다. 여러 상태를 함께 고를 수 있다.
- **[Claude Tag] 메모리 파일 관리** — Claude Tag Admin 권한이 있는 멤버는 Activity 페이지의 Memory 탭에서 워크스페이스·채널 메모리 파일을 만들고 고치고 지울 수 있다.

## 🛠️ 개선/수정 (14건)
- **관리형(managed) hook 차단 동작** — `PreToolUse`가 `"continue": false`로 거부할 때, 또는 `prompt` hook이 차단할 때 호출만 막고 턴은 끝내지 않던 문제를 고친다. `updatedMCPToolOutput`이 적용되지 않던 문제도 고친다.
- **Bash 권한 우회 차단** — `BASH_ARGV0` 변수에 값을 넣고 쓰는 명령이 자동 승인되던 문제를 고친다. 이제 승인을 묻는다. Windows Git Bash에서 `rm -rf /c/Users/<name>`도 묻는다.
- **비 UTF-8 파일 편집 보호** — Windows-1252·Shift-JIS·GBK 파일에서 Edit·NotebookEdit가 비ASCII 문자를 전부 바꿔 쓰던 문제를 고친다. 이런 편집은 이제 거부한다.
- **hook 디버그 로그** — `--debug` 실행 시 도구 호출·프롬프트·SessionStart·Stop의 command hook에 대해 명령·플러그인·결과·소요 시간을 남긴다. 느린 hook을 찾을 수 있다.
- **커스텀 에이전트 frontmatter 오타 안내** — `--debug`가 알 수 없는 frontmatter 필드 이름을 출력하고, 오타로 보이면 힌트를 준다.
- **headless 세션 안정성** — 꺼둔 MCP 서버가 켜지던 문제, Esc로 세션이 끝나거나 검사 안 된 프롬프트가 통과되던 문제, SessionStart hook이 건너뛰어지던 문제를 고친다.
- **Workflow 도구** — CRLF 줄바꿈 스크립트를 거부하던 문제와 깊게 중첩된 결과가 잘리던 문제를 고친다.
- **시크릿 가림(redaction)** — 공유 transcript와 debug 로그에서 일부 시크릿 값이 가려지지 않던 문제를 고친다.
- **`/code-review` 출력** — cloud·SDK·IDE에서 날것의 JSON 배열로 끝나던 결과를 번호 목록으로 보여준다.
- **auto mode 표시** — 검사 결과를 얻지 못해 실행하지 않은 호출을 빨간 에러 대신 흐린 "Not run" 줄로 보여준다.
- **MCP 설명 길이 제한 상향** — 도구 설명과 서버 instructions 제한을 2,048자에서 4,096자로 늘린다.
- **Sonnet 5.5 캐시 읽기 가격 반영** — `/cost`·status line·`--max-budget-usd`의 계산 단가를 100만 토큰당 $0.20에서 $0.10으로 바꾼다.
- **ctrl+o 응답 속도** — 코드가 많은 대화에서 문법 강조 결과를 캐시해 transcript 전환을 빠르게 한다.
- **플러그인·마켓플레이스 안정성** — `constructor`·`prototype` 같은 이름 처리 오류, claude.ai 동기화 스킬 설치가 끝나지 않던 문제, macOS 시작 멈춤을 고친다.

## 🔑 이번 버전의 핵심 키워드
**"hook·권한 경계를 단단히 하고, 서브에이전트 운영을 세밀하게 조절한다"** — 관리형 hook의 차단 동작과 Bash 권한 우회를 바로잡는다. workflow·서브에이전트의 모델 통일과 압축 시점 조절, 529 재시도 간격 조절을 추가한다.

---

# 📜 원문 (한글 번역본)

> 원문 ChangeLog를 원래 순서 그대로 한 줄도 빠짐없이 번역한 문서입니다.

- Claude apps gateway의 `managed.policies[]`에 `code` 키를 추가했다. `cli`와 같은 설정을 Claude Desktop의 Code 탭에도 적용한다. `desktop`과 함께 쓰면 Claude Desktop의 gateway 모드가 켜진다.
- 서브에이전트 frontmatter와 `--agents` 정의에 `autoCompactWindow`를 추가했다. 서브에이전트가 메인 대화의 window보다 일찍 auto-compact할 수 있다.
- 다른 서브에이전트의 모델은 그대로 두고 모든 workflow 에이전트를 한 모델로 실행하는 `CLAUDE_CODE_WORKFLOW_SUBAGENT_MODEL`을 추가했다.
- 과부하(529) 요청을 재시도할 때 backoff 최대 지연을 더 길게 정하는 `CLAUDE_CODE_OVERLOADED_RETRY_MAX_DELAY_MS` 환경변수를 추가했다.
- 같은 이름의 다른 플러그인이 켜져 있어 hook이 제외된 플러그인에 `/plugin`에서 안내 문구를 추가했다.
- Read 도구에 `allow_large` 옵션을 추가했다. 파일 전체가 필요하고 컨텍스트에 여유가 있으면 Claude가 일반 크기 제한을 넘는 텍스트 파일을 한 번에 읽을 수 있다.
- `"continue": false`로 도구 호출을 거부하는 managed-settings `PreToolUse` hook과, 호출을 차단하는 managed `prompt` hook이 호출만 거부하고 턴은 끝내지 않던 문제를 수정했다.
- managed settings의 PostToolUse hook이 일부 세션에서 `updatedMCPToolOutput`을 적용하지 않던 문제를 수정했다.
- headless 세션이 디렉토리를 바꾸거나 플러그인을 다시 불러온 뒤, 해당 폴더에서 꺼둔 `.mcp.json` 또는 플러그인 MCP 서버를 시작하던 문제를 수정했다.
- `allowedProviders`에 `"gateway"`를 내려주는 Claude apps gateway가, 사용자 설정에 그 gateway를 지정한 노트북을 잠가버리던 문제를 수정했다.
- managed settings에서 `forceLoginMethod`를 `gateway`로 두고 `forceLoginGatewayUrl`을 지정하지 않은 머신에서 저장된 Claude apps gateway 로그인이 무시되던 문제를 수정했다(2.1.295 회귀).
- 세션 기록을 읽을 수 없을 때 `--teleport`가 빈 대화를 열던 문제를 수정했다.
- Haiku 5.5 등 adaptive thinking만 받는 모델의 토큰 수 계산이 일부 gateway 뒤에서 실패하고, 다른 곳에서는 budget thinking 기준으로 계산되던 문제를 수정했다.
- 세션 종료로 중단된 도구 호출을 재개된 서브에이전트가 사용자가 거부한 것으로 안내받던 문제를 수정했다.
- hook 출력에 플러그인 힌트 태그와 비슷한 텍스트가 있으면 출력이 변형되던 문제를 수정했다.
- 공유 transcript와 debug 로그의 시크릿 가림이 값 없는 키 뒤에 오는 일부 값을 놓치던 문제를 수정했다. shell 문자열 안에 쓴 JSON도 포함한다.
- MATE Terminal 같은 구형 VTE 기반 터미널에서 복사 후 화면에 `52;c;…` escape sequence가 찍히던 문제를 수정했다.
- `/diff` 패널이나 대화상자가 열려 있는 동안 toast와 알림이 보이지 않은 채 대기하던 문제를 수정했다.
- `UserPromptSubmit` hook 또는 mod의 `prompt.submit` hook 실행 중 Esc나 interrupt를 누르면 headless 세션이 끝나거나, 입력한 프롬프트가 지워지거나, 검사되지 않은 프롬프트가 통과되던 문제를 수정했다.
- headless 세션 시작 후 로드된 플러그인의 SessionStart hook이, 같은 이름(또는 다른 표기)의 다른 플러그인이 이미 실행됐으면 건너뛰어지던 문제를 수정했다.
- 등록이 거부될 때 `claude self-hosted-runner`가 오해를 부르는 에러를 출력하던 문제를 수정했다. 이제 org 관리자 설정 이름을 알려주거나, 재시작된 on-demand runner에는 새 work order가 필요하다고 안내한다.
- `--capacity`가 1보다 큰 runner에서 같은 저장소의 다른 세션이 시작되는 동안 self-hosted runner 세션의 git fetch·pull·push가 실패하던 문제를 수정했다.
- workflow 스크립트가 약 20,000단계보다 깊게 중첩된 결과·agent 옵션 등의 값을 조용히 잘라내고, 깊게 중첩된 결과가 거대한 task 출력 파일을 쓰던 문제를 수정했다.
- 플러그인이 제공하는 `$` 메서드가 호출한 에이전트의 작업 디렉토리 대신 메인 세션의 작업 디렉토리에서 실행되고, 호출 hook이 잡고 있는 턴을 무시하던 문제를 수정했다.
- mod가 다시 로드되거나 제거된 뒤에도 실행 중이던 mod의 hook에서 `$.agent.register`가 성공하던 문제를 수정했다. 이제 호출을 거부한다.
- 응답이 4 MiB 본문 제한을 넘는 `Content-Length`를 선언하면 mod의 `$.http.fetch`가 `HEAD` 요청을 거부하던 문제를 수정했다.
- `constructor` 같은 이름의 마켓플레이스에서 `claude plugin marketplace add`, `marketplace update`, `plugin install`이 내부 에러로 실패하던 문제를 수정했다. 이제 `add`가 그런 이름을 명확히 거부한다.
- `constructor` 또는 `prototype`이라는 이름의 플러그인 시크릿이 해당 플러그인 옵션을 다음에 저장할 때 삭제되던 문제를 수정했다.
- feature flag가 로드되지 않았을 때 cloud 세션이 저장된 권한으로 허용된 Claude in Chrome 동작에 대해 auto mode 검사를 건너뛰던 문제를 수정했다.
- MCP 도구 결과로 턴이 끝난 경우, 재시작 후 `CLAUDE_CODE_RESUME_INTERRUPTED_TURN`이 이미 끝난 턴을 다시 실행하던 문제를 수정했다.
- `BASH_ARGV0` shell 변수에 값을 할당한 뒤 사용하는 일부 명령을 Bash 권한 검사가 자동 승인하던 문제를 수정했다. 이제 승인을 묻는다.
- 유효한 UTF-8이 아닌 파일(Windows-1252, Shift-JIS, GBK)에서 Edit와 NotebookEdit가 모든 비ASCII 문자를 바꿔 쓰던 문제를 수정했다. 이런 편집은 이제 거부한다.
- 백그라운드 서비스 응답이 느릴 때 `←` 직후 보낸 프롬프트가 두 번 실행되고 그중 하나는 foreground에서 보이지 않게 실행되던 문제를 수정했다.
- SessionStart hook 실행 중 보낸 프롬프트가 `←`로 세션을 백그라운드로 옮기면 사라지던 문제를 수정했다. 여전히 전송되지는 않지만 `↑`로 다시 불러올 수 있다.
- headless 세션에서 늦게 로드된 플러그인의 SessionStart hook 출력이 `/clear` 후 새 대화에 들어가던 문제를 수정했다.
- hook이 CLAUDE_ENV_FILE에 쓴 변수를 PowerShell 명령이 보지 못하던 문제를 수정했다(파일에 단순 할당만 있을 때).
- MCP 서버에 인증이 필요할 때 Claude가 cloud 세션을 non-interactive라고 부르며 `/mcp`나 `claude mcp`를 제안하던 문제를 수정했다.
- cloud 세션, Agent SDK, IDE 연동에서 `/code-review`가 날것의 JSON 배열로 끝나던 문제를 수정했다. 이제 결과를 번호 목록으로 출력한다.
- auto mode가 공유 상태가 바뀌지 않았는데도 바뀌었다며 자신의 artifact 업데이트 한 건을 가끔 거부하던 문제를 수정했다.
- 여러 세션이 한 config 디렉토리를 공유할 때 claude.ai에서 동기화한 스킬의 설치가 끝나지 않고 동기화할 때마다 다시 다운로드되던 문제를 수정했다.
- claude.ai에서 동기화한 플러그인이 선언한 마켓플레이스 의존성도 claude.ai에서 동기화된 경우 플러그인이 비활성화되던 문제를 수정했다.
- Linux 머신에서 복사한 플러그인 경로가 /home 아래를 가리킬 때 macOS에서 시작이 멈추던 문제를 수정했다.
- Windows에서 checkout한 파일처럼 CRLF 줄바꿈을 쓰는 스크립트 파일을 Workflow 도구가 거부하던 문제를 수정했다.
- `git commit -q` 또는 `git -C <dir> commit` 후 OpenTelemetry `tool_result` 이벤트에 `git_commit_id`가 빠지던 문제를 수정했다.
- 메시지 텍스트에 Unicode 줄·문단 구분자(U+2028, U+2029)가 있으면 `CLAUDE_CODE_TRANSCRIPT_LOCAL_GC`가 저장된 transcript에서 그 메시지를 빠뜨리던 문제를 수정했다.
- 프롬프트 텍스트에 Unicode 줄·문단 구분자(U+2028, U+2029)가 있으면 `claude purge`가 history 파일에 그 프롬프트를 남기던 문제를 수정했다.
- Windows: 약 1 KB보다 긴 PowerShell 명령이 항상 권한을 묻던 문제를 수정했다. 이제 allow 규칙과 읽기 전용 감지가 32 KB까지 적용된다.
- Windows: 종료 시 stdio MCP 서버가 강제 종료되던 문제를 수정했다. 이제 stdin을 먼저 닫고, 300 ms 후에도 서버가 실행 중이면 프로세스 트리를 종료한다.
- Windows: GitHub SSH 키가 없는 머신에서 GitHub `owner/repo` 플러그인 소스의 `claude plugin install`이 실패하던 문제를 수정했다. 이제 HTTPS로 clone을 재시도한다.
- Windows: bypass permissions 모드에서 Git Bash의 `rm -rf /c/Users/<name>`이 승인을 묻지 않던 문제를 수정했다.
- fullscreen 모드 개선: 마우스 포인터 아래의 링크에 밑줄을 그어 열 수 있음을 보여준다.
- 문법 강조된 코드 블록을 캐시해 코드가 많은 대화에서 transcript 전환(ctrl+o) 응답성을 개선했다.
- Claude apps gateway 뒤의 Claude Desktop Code 탭 개선: gateway의 `code` 설정이 준비되지 않은 머신을 포함해 세션을 시작할 수 없을 때 이유를 답변으로 보여준다.
- 거부된 cloud 세션의 에러 개선: 조직 정책을 불러올 수 없었던 이유를 알려주고, claude.ai 로그인을 덮어쓰는 API key나 auth token을 명시한다.
- `--debug` 출력이 커스텀 에이전트 파일의 알 수 없는 frontmatter 필드 이름을 알려주고, 오타로 보이면 힌트를 주도록 개선했다.
- auto mode 개선: auto mode 검사에서 쓸 수 있는 답을 얻지 못해 실행하지 않은 도구 호출을 빨간 에러 대신 흐린 "Not run" 줄로 보여준다.
- hook용 `--debug` 출력 개선: 도구 호출·프롬프트·SessionStart·Stop의 command hook이 끝날 때 명령·플러그인·결과·소요 시간을 기록해 느린 hook을 식별할 수 있다.
- `CLAUDE_CODE_TRANSCRIPT_LOCAL_GC` 개선: 큰 transcript 파일을 다시 써도 확보되는 공간이 10% 미만이면 다시 쓰지 않는다.
- `/cost`, status line, `--max-budget-usd`, SDK 비용 계산에서 Sonnet 5.5 캐시 읽기 단가를 100만 토큰당 $0.10(기존 $0.20)으로 갱신했다.
- 번들된 dataviz 스킬 갱신: 라이트 모드 일곱 번째 계열을 더 밝은 보라색으로, 다크 모드 기본 텍스트를 더 부드럽게 바꾸고, y축 라벨을 1K처럼 짧게 표시한다.
- 미리 보내는 MCP 도구 설명과 MCP 서버 instructions의 기본 제한을 2,048자에서 4,096자로 바꿨다.
- `←` 변경: 세션이 백그라운드로 옮겨가는 동안 시작된 턴이나 `!` 명령은 보이지 않는 곳에서 끝까지 실행되지 않고 중지된다.
- [VSCode] 확장 설정에서 `claudeCode.spinnerVerbs`가 빠져 있던 문제를 수정했다. 이제 settings.json에서 자동완성·검증되며, 잘못된 값이 채팅 패널을 망가뜨리지 않는다.
- [VSCode] Claude in Chrome이 터미널처럼 `@browser`로 연결한 세션을 포함한 모든 세션에서 브라우저 동작 전에 묻도록 바꿨다. 세션 동안 사이트를 허용하면 반복해서 묻지 않는다.
- [VSCode] Windows에서 C:\repo\file.ts 또는 file:///C:/repo/file.ts 같은 전체 Windows 경로로 쓴 채팅 링크가 파일을 열지 않던 문제를 수정했다.
- [VSCode] OS, VS Code, 또는 `prefersReducedMotion` 설정으로 동작 줄이기를 켜도 작업 표시기가 계속 움직이던 문제를 수정했다.
- [VSCode] 화면이 꺼졌다가 켜지거나 원격 창이 다시 연결된 뒤처럼 패널이 메시지를 늦게 따라잡았을 때 prompt cache 시계가 warm으로 표시되던 문제를 수정했다.
- [Cloud sessions] 관리자 설정에서 self-hosted 환경 Activity 탭의 Sessions·Runners 목록에 상태 필터를 추가했다. 여러 상태를 한 번에 고를 수 있다.
- [Cloud sessions] self-hosted runner를 기다리는 모든 cloud 세션에 같은 대기 순번이 표시되던 문제를 수정했다. 이제 각 세션 앞에 몇 개가 있는지 보여준다.
- [Cloud sessions] Claude가 아직 답하는 중에 보낸 메시지가 답변이 끝나면 그 답변 위로 올라가던 문제를 수정했다. 새로고침 후에도 아래에 남는다.
- [Claude Tag] Slack의 Claude가 세션 링크·모델·비용이 담긴 footer를 스레드의 최신 답변에만 표시하도록 바꿨다. 이전 답변의 footer는 사라진다.
- [Claude Tag] 일부 Slack 답변과 작업 체크리스트에서 괄호가 들어간 URL 링크가 깨져 남는 괄호 텍스트가 보이고 엉뚱한 페이지가 열리던 문제를 수정했다.
- [Claude Tag] 여섯 자리 PR 번호처럼 hex 색상처럼 보이기만 하는 코드 옆에 Slack 답변이 색상 견본을 그리던 문제를 수정했다.
- [Claude Tag] Claude Tag Admin 권한이 있는 멤버가 Activity 페이지의 Memory 탭에서 워크스페이스·채널 메모리 파일을 만들고, 고치고, 지울 수 있도록 추가했다.
- [Claude Tag] Claude가 Slack 채널에 올리는 플러그인 확인 카드가 플러그인 이름 대신 ID를 보여주던 문제를 수정했다.
- [Claude Tag] 채널 자체 설정에 없는 플러그인을 제거하는 카드를 Slack의 Claude가 올리던 문제를 수정했다. 이제 그 플러그인이 어디서 왔는지 설명한다.
- [Claude Tag] self-hosted 환경 세션이 작업 도중 새 runner로 옮겨가면 Slack의 Claude가 가끔 답변을 잃어버리던 문제를 수정했다.
- [Code Review] 리뷰가 끝난 뒤에도 PR의 Code Review check가 가끔 "in progress"로 남던 문제를 수정했다. 이제 리뷰 결과를 보여준다.
- [Code Review] Code Review 관리자 설정이 일반 실패 메시지 대신 정책 제한 등 설정을 저장할 수 없었던 이유를 알려주도록 개선했다.

---

## 🎯 챌린지

이번 버전에서 내 환경에 적용해볼 만한 항목입니다.

### 1. Workflow 에이전트 모델을 Opus로 고정
- **파일**: `~/.claude/settings.json`
- **근거**: CLAUDE.md §5는 "모든 subagent는 Opus"를 규칙으로 정했다. 하지만 지금은 workflow 에이전트의 모델을 강제할 장치가 없다. `env`에 `"CLAUDE_CODE_WORKFLOW_SUBAGENT_MODEL": "claude-opus-5-5"`를 넣으면 이 규칙이 설정 차원에서 지켜진다. `skipWorkflowUsageWarning: true`로 workflow를 자주 쓰는 환경이라 효과가 크다.
- **난이도**: ★☆☆ (약 5분)

### 2. 529 과부하 재시도 간격 늘리기
- **파일**: `~/.claude/settings.json`
- **근거**: `opus[1m]` + `effortLevel: xhigh` 조합과 매일 08:00 cron으로 도는 `claude-changelog-sync`(`claude -p --model opus`)는 서버 과부하(529) 때 실패하기 쉽다. `env`에 `"CLAUDE_CODE_OVERLOADED_RETRY_MAX_DELAY_MS": "60000"`을 넣어 재시도 대기 상한을 늘리면 사람이 보지 않는 자동 실행이 덜 끊긴다.
- **난이도**: ★☆☆ (약 5분)

### 3. deploy-guard.sh 실행 시간 점검
- **파일**: `~/.claude/hooks/deploy-guard.sh`
- **근거**: 이번 버전부터 `--debug`가 command hook의 명령·결과·소요 시간을 기록한다. 이 hook은 모든 Bash 호출 앞에서 돈다. `claude --debug`로 몇 번 실행해 소요 시간을 확인한다. 느리면 스크립트 맨 앞에 `git push`가 없는 명령은 바로 `exit 0`하는 조기 종료 분기를 넣는다.
- **난이도**: ★★☆ (약 15분)
