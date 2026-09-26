# Claude Code v2.1.282

> 작성일: 2026-09-27

---

# 📋 요약본

## 🎉 신기능 (8건)
- **`maxProseWidth` 설정** — 넓은 터미널에서 Claude 답변 글의 최대 너비를 정한다. 표와 코드 블록은 원래 전체 너비를 그대로 쓴다.
- **텔레메트리 변수 무시 알림** — 프로젝트 설정 파일에 들어 있는 텔레메트리(사용 데이터 수집) 변수가 무시됐거나 텔레메트리를 껐을 때 알려 준다. 시작할 때 안내가 뜨고, `/status`·`claude doctor`에도 항목이 생긴다.
- **`allowClaudeInChromeWithManagedMcp` 관리형 설정** — 관리자가 `managed-mcp.json`만 쓰도록 막아 둔 환경에서도 `claude --chrome`을 함께 실행할 수 있다. Chrome이 막혔을 때 뜨는 에러가 이 설정 이름을 알려 준다.
- **`store.readiness_grace_seconds`** — Claude apps gateway 설정이다. Postgres가 잠깐 끊겨도(DB 장애 전환 등) `/readyz`가 계속 "준비됨"으로 응답한다.
- **`/feedback` 초안 목록 스크롤바** — fullscreen 모드에서 마우스를 목록 위에 올리면 스크롤바가 나온다.
- **[Cloud sessions] GitHub App 상태 표시** — Settings › Connectors › GitHub에서 앱 설치 여부, 연결 가능 여부, 연결·설치·재연결 방법을 보여 준다.
- **[Cloud sessions] GitHub 외 Git 서버 링크** — 저장소 메뉴에 "Open repository"와 "Open compare page" 링크가 생긴다.
- **[Cloud sessions] 다른 소유자 저장소 추가 연결** — 이미 저장소가 붙은 실행 중 세션에 fork의 upstream처럼 소유자가 다른 저장소를 더 붙일 수 있다. Slack에서 시작한 세션도 된다.

## 🛠️ 개선/수정 (18건)
- **웹 검색 결과 400 에러** — API가 풀지 못하는 웹 검색 결과가 대화 기록에 있으면 모든 요청이 실패하던 문제를 고쳤다.
- **extended thinking(확장 사고) 유실** — 아래 경우에 Claude의 이전 사고 기록이 사라지던 문제를 고쳤다.
  - `--continue`·`--resume`로 이어 갈 때
  - 작업 중 `/model`·`/rename` 같은 즉시 실행 명령을 쓸 때
  - `--tools` 목록에서 기본 도구를 뺀 채 다시 실행할 때
- **`redacted_thinking` 에러 자동 복구** — 이 에러가 나면 대화의 사고 블록을 버리고 한 번 다시 시도한다.
- **compaction(대화 압축) 실패** — 요약 요청이 거절되면 fallback 모델로 다시 시도한다.
- **xhigh effort 에러** — thinking이 꺼져 있고 effort가 high보다 높은 세션에서 안전 관련 모델 전환 뒤 턴이 실패하던 문제를 고쳤다.
- **Fable usage-credits 흐름** — SDK 호스트 세션에서 답하지 않은 프롬프트가 모델을 바꾸던 문제를 고쳤다. 이제 턴이 그냥 끝난다. `/model`에 전체 Fable model id를 넣으면 API 에러 대신 크레딧 안내가 뜬다.
- **로그인 갱신 경합** — 다른 프로세스가 로그인 정보를 갱신하다 종료되면 최대 1분간 요청이 실패하던 문제를 고쳤다. 조직 정책 조회를 다시 시도하지 않던 문제도 고쳤다.
- **Bash 권한 규칙의 `:*`** — 패턴 중간에 `:*`가 있는 규칙이 settings 파일에서 무시되던 문제를 고쳤다. 이제 모든 소스에서 적용되고, 시작할 때 매칭 방식을 경고로 알려 준다.
- **managed settings(관리형 설정) 견고성** — 잘못 적은 boolean 잠금 값도 잠금으로 적용한다. 중첩 값 하나가 잘못돼도 블록 전체를 버리지 않는다. Windows/WSL에서는 관리자 정책이 깨져 있으면 사용자 설정이 대신 적용되지 않게 막는다.
- **디스크 쿼터 표시** — Bash·PowerShell이 디스크 용량 초과를 "Exit code 1"로만 보여 주고 큰 임시 파일을 남기던 문제를 고쳤다.
- **터미널 렌더링·입력** — 여러 줄 붙여넣기가 한 줄씩 전송되던 문제, fullscreen 시작 시 빈 화면이 번쩍이던 문제, CJK·이모지 diff에 글자가 남던 문제 등을 고쳤다.
- **vim 모드 대량 수정** — count, `.` 반복, `>>`·`dd`·`p`의 커서 위치와 대상 줄 오류를 고쳤다.
- **플러그인 제거 안전성** — 설정 파일이 아직 플러그인을 켜 두고 있거나 파일을 읽을 수 없으면, 제거를 멈추고 저장된 옵션·시크릿을 지운다. 이제 멈추고 해당 파일 이름을 알려 준다.
- **대형 세션 재개 속도** — 한 번도 압축하지 않은 큰 세션도 더 빨리 다시 연다.
- **skill 네임스페이스 보호** — `anthropic-skills`·`claude-ai` 이름을 흉내 낸 로컬 skill·명령·MCP가 claude.ai 동기화 skill인 척하지 못하게 막는다.
- **프로젝트 설정의 텔레메트리 차단** — 프로젝트·로컬 설정에서 OTEL export를 켜는 변수(`CLAUDE_CODE_ENABLE_TELEMETRY`, `OTEL_LOG_*` 등)를 무시한다. 관리형 설정이 제한을 걸면 `sandbox.excludedCommands`의 프로젝트 항목도 무시한다.
- **auto mode 서버 분류기 기본값** — Anthropic API에 직접 연결하고 텔레메트리가 꺼져 있으면, auto mode가 서버 쪽 분류기를 기본으로 쓴다. `CLAUDE_CODE_AUTO_MODE_SERVER=0`으로 끌 수 있다.
- **VSCode·Cloud·Claude Tag** — VSCode 긴 답변 스트림 지연, Routines 로딩 속도, Slack Enterprise Grid 응답 문제 등 여러 가지를 고쳤다.

## 🔑 이번 버전의 핵심 키워드
**"사고 기록 보존과 설정 신뢰 경계 강화"** — 이어 가는 세션에서 extended thinking이 사라지지 않게 하고, 프로젝트·관리형 설정이 권한과 텔레메트리를 몰래 바꾸지 못하게 막는다.

---

# 📜 원문 (한글 번역본)

> 원문 ChangeLog를 원래 순서 그대로 한 줄도 빠짐없이 번역한 문서입니다.

- 넓은 터미널에서 Claude 답변 글의 너비를 제한하는 `maxProseWidth` 설정을 추가했다. 표와 코드 블록은 전체 너비를 유지한다.
- 프로젝트 settings 파일에 있는 텔레메트리 변수 중 무시됐거나 텔레메트리를 끈 것을 알려 주는 시작 알림을 추가했다. `/status`와 `claude doctor`에도 해당 항목을 추가했다.
- `claude --chrome`을 독점 `managed-mcp.json`과 함께 실행할 수 있게 하는 `allowClaudeInChromeWithManagedMcp` 관리형 설정을 추가했다. Chrome이 차단될 때 표시되는 에러가 이 설정 이름을 알려 준다.
- Claude apps gateway에 `store.readiness_grace_seconds`를 추가했다. 데이터베이스 failover 같은 짧은 Postgres 중단 동안에도 `/readyz`가 ready 상태를 유지할 수 있다.
- fullscreen 모드의 `/feedback` 초안 목록에 스크롤바를 추가했다. 마우스가 목록 위에 있을 때 나타난다.
- API가 복호화할 수 없는 웹 검색 결과(예: 서드파티 gateway를 거쳐 응답한 턴의 결과)가 기록에 있는 대화에서 모든 요청이 400 에러로 실패하던 문제를 수정했다.
- 이어 가거나 재개한 세션(`--continue`, `--resume`)이 이전 메시지를 형태가 바뀐 채 다시 보내던 경우를 더 많이 수정했다. 이 문제로 API가 Claude의 이전 추론을 버릴 수 있었다.
- Claude가 작업하는 도중 `/model`, `/rename`, `/artifacts` 같은 즉시 실행 slash command를 쓰면 이전 extended thinking이 사라지던 문제를 수정했다.
- 대화 앞부분에서 제공했던 built-in 도구를 뺀 `--tools` 목록으로 다시 실행하면, 이어 가거나 재개한 대화가 이전 extended thinking을 잃던 문제를 수정했다.
- 매 턴마다 "Invalid `data` in `redacted_thinking` block" API 에러로 실패하던 세션을 수정했다. 이제 Claude Code가 대화의 thinking 블록을 버리고 한 번 다시 시도한다.
- 요약 요청이 거절되면 compaction이 실패하던 문제를 수정했다. 이제 fallback 모델로 다시 시도한다.
- thinking이 꺼져 있고 effort가 high보다 높은 세션에서, 안전 관련 모델 전환 뒤 턴이 실패하던 문제("Effort 'xhigh' isn't available with thinking turned off")를 수정했다.
- Claude Desktop 같은 SDK 호스트 세션에서 답하지 않은 Fable usage-credits 프롬프트가 모델을 바꾸던 문제를 수정했다. 이제 턴이 끝나고, Remote Control 클라이언트에도 모델 전환 안내가 표시된다.
- 요금제에 필요한 usage credits가 아직 켜지지 않았을 때, 전체 Fable model id로 `/model`을 실행하면 usage-credits 프롬프트 대신 API 에러에서 멈추던 문제를 수정했다.
- 다른 Claude Code 프로세스가 로그인 갱신 중 종료되거나 강제 종료된 뒤, 최대 1분 동안 "another Claude Code process is refreshing it" 로그인 에러로 요청이 실패하던 문제를 수정했다.
- 다른 Claude Code 창이 로그인을 갱신하는 동안 시작한 세션(VS Code 창이 여러 개일 때 흔함)이 조직 정책 조회를 다시 시도하지 않던 문제를 수정했다.
- 시작할 때 CLAUDE.md와 rules가 `..` 또는 `/.vol` 형태의 커널 경로를 거쳐 macOS의 `/Network`에 닿는 저장소 symlink로 읽히던 문제를 수정했다. macOS의 `/home`을 가리키는 rules 링크가 목록에 표시되던 문제도 수정했다.
- 패턴 중간에 `:*`가 있는 Bash 권한 규칙이, `--allowedTools`에서는 적용되면서 settings 파일에서는 건너뛰어지던 문제를 수정했다. 이제 모든 소스에서 동작하고, 어떻게 매칭되는지 시작 경고로 알려 준다.
- 원격 세션의 worker가 재시작될 때, 복원된 권한 프롬프트에서 승인한 명령이 두 번 실행되던 문제를 수정했다.
- managed settings에서 `disableClaudeAiConnectors`, `allowManagedPermissionRulesOnly` 같은 boolean 잠금 키에 잘못된 타입의 값이 들어가면 무시되던 문제를 수정했다. 이제 잠금이 적용되고, 시작할 때 해당 키 이름을 알려 준다.
- managed `permissions`, `autoMode`, `worktree`, `attribution` 설정에서 중첩 값 하나가 잘못되면 블록 전체가 무시되던 문제를 수정했다. 이제 나머지 값은 그대로 적용된다.
- managed `allowManagedPermissionRulesOnly` 아래에서 저장소·사용자·`--add-dir`의 skills, commands, skills-directory 플러그인 manifest가 `allowed-tools`로 자기 도구를 미리 승인하던 문제를 수정했다.
- Amazon Bedrock과 Bedrock Mantle의 safeguard 차단 메시지에 request ID가 나오지 않던 문제를 수정했다. 이제 차단 메시지에 message ID도 표시된다.
- Vertex AI: 새로 출시된 모델처럼 Claude Code가 아직 모르는 모델에서 웹 검색이 제공되지 않던 문제를 수정했다.
- Bash와 PowerShell이 디스크 쿼터 초과를 "Exit code 1" 뒤에 숨기고 큰 출력 파일을 temp에 남기던 문제를 수정했다.
- 도구 입력 검증 에러가, 같은 호출의 다른 파라미터도 잘못됐는데 모르는·누락된·타입이 틀린 파라미터 하나만 알려 주던 문제를 수정했다. 이제 나머지도 함께 나열한다.
- 세션 도중 터미널의 bracketed paste mode가 초기화된 뒤, 붙여넣은 여러 줄 텍스트가 한 줄씩 전송되던 문제를 수정했다.
- `SessionStart` hook이 있는 프로젝트에서 시작할 때 프롬프트 예시 문구가 깜빡이고 사라지던 문제를 수정했다.
- fullscreen 모드로 시작할 때 첫 화면 전에 빈 화면이 번쩍이던 문제를 수정했다.
- 화면이 짧아졌지만 여전히 터미널보다 클 때 non-fullscreen 렌더러의 줄이 깨지거나 엉뚱한 곳에 그려지던 문제를 수정했다. 예: shell 명령이 출력을 흘려보내는 동안 프롬프트 줄을 지울 때.
- 다시 그린 줄의 CJK 문자나 이모지가 다음 줄로 넘어갈 때 diff의 마지막 열에 이전 글자가 남던 문제를 수정했다.
- 기록에서 불러온 프롬프트에 tab이 있으면 커서가 끝보다 앞에 놓이던 문제를 수정했다.
- ctrl+enter를 줄바꿈으로 보내는 터미널(1.25 이전 Windows Terminal)에서 send-now 힌트가 ctrl+enter로 표시되던 문제를 수정했다. 이제 그런 터미널에서는 ctrl+x ctrl+s로 표시된다.
- Remote Control의 eligibility 에러는 `--debug`로 실행하라고 안내하는데, `claude remote-control --debug`가 "Unknown argument: --debug"로 실패하던 문제를 수정했다.
- `/install-github-app`이 "cancelled"라고 표시한 뒤에도 브랜치를 push하고 API key secret을 저장하던 문제를 수정했다. 이제 나가면 남은 단계를 멈추고 이미 한 작업을 알려 준다.
- Bedrock, Vertex 등 서드파티 provider에서 저장 도중 취소해도 /feedback, /bug, /share가 보고서 파일을 저장하던 문제를 수정했다.
- 플러그인 settings 파일이 아직 플러그인을 켜 두고 있거나 읽을 수 없는데도, 플러그인 제거가 성공으로 표시되고 저장된 옵션을 지우던 문제를 수정했다. 이제 멈추고 해당 파일 이름을 알려 준다.
- 제거 후 설치된 플러그인 목록을 읽을 수 없을 때 플러그인의 저장된 옵션과 시크릿을 지우던 문제를 수정했다. 이제 보존하고 제거 결과에 그 사실을 알린다.
- `/skills`에서 `/` 바로 뒤에 입력한 키가 검색창 대신 skill 목록을 움직이던 문제를 수정했다.
- 입력하는 동안 터미널 커서가 `/skills` 검색창에서 skill 목록으로 튀던 문제를 수정했다. 이 문제로 caret이 가려지고 IME 입력이 엉뚱한 곳에 들어갈 수 있었다.
- fullscreen 모드가 아니라 스크롤바가 절대 나타날 수 없는데도, `/skills`·`/mcp`처럼 스크롤바가 있는 목록이 두 칸 좁게 그려지던 문제를 수정했다.
- 긴 키로 재지정했을 때 agent 패널 footer가 두 줄로 넘어가던 문제, 그리고 "Esc to collapse" 힌트가 재지정한 collapse 키를 반영하지 않던 문제를 수정했다.
- `keybindings.json`에서 stop-all-agents 단축키를 해제했을 때 `/tasks` 대화상자 footer에 ` · ` 구분자가 두 번 나오던 문제를 수정했다.
- Claude가 버전 label을 60자보다 길게 지으면 artifact 게시가 실패하던 문제를 수정했다. 이제 label을 줄인다.
- 목록 항목을 여는 code block의 맨 위 빈 줄이 screen-reader 모드, 인용된 목록, 매우 긴 목록에서 사라지던 문제를 수정했다. 직접 연 경우와 인용 안에서 연 경우 모두 해당한다.
- PDF 페이지 읽기 에러 메시지를 수정했다. 악센트나 라틴 문자가 아닌 글자가 들어간 경로를 읽을 수 있게 표시한다. "password"나 "invalid" 같은 이름의 폴더 때문에 에러가 원인을 잘못 짚는 일도 막았다.
- vim 모드에서 `>>`가 빈 줄을 들여쓰던 문제, 줄보다 긴 count를 준 `r`가 텍스트를 바꾸던 문제, `2J`가 한 줄 더 합치던 문제, 마지막 줄의 count(`2dd`, `2>>`)가 그 줄을 옮기거나 지우던 문제를 수정했다.
- vim 모드 커서 위치를 수정했다. `dd`, `dj`, `dG`나 줄 단위 `p`/`P` 뒤에는 첫 번째 공백 아닌 문자에 놓인다. `yy`는 더 이상 커서를 옮기지 않고, 이모지 뒤에서 Esc를 눌러도 커서가 이모지 안에 남지 않는다.
- vim 모드에서 `x`, `s`, `p`, `d`, `c`를 반복할 때 `.` 앞에 입력한 count를 무시하던 문제를 수정했다. 위쪽 줄이 wrap될 때 줄 단위 `p`/`P`, `o`, `O`, `J`, `>>`, `<<`가 엉뚱한 줄에 적용되던 문제도 수정했다.
- normal 모드에서 기록이나 큐에서 불러온 프롬프트의 끝보다 뒤에 커서가 놓여 `x`가 아무것도 안 하던 문제를 수정했다.
- 한 번도 compaction하지 않은 세션을 포함해 매우 큰 세션의 재개 시간을 줄였다.
- Windows에서 transcript 파일을 읽지 못해(EBADF) 세션을 재개할 수 없을 때 보이는 에러를 개선했다. 이제 가능한 원인과 해 볼 조치를 알려 준다.
- Claude Desktop의 unknown-model 에러가 다른 모델로 바꾸라고 제안하도록 개선했다.
- 권한 프롬프트에서 특이한 Unicode를 표시하는 방식을 개선했다.
- `/artifacts`를 개선했다. 제목이 한 열로 정렬되고, 세부 정보는 단어 중간에서 자르지 않고 통째로 뺀다. 목록에서 PgUp/PgDn, Home/End, 마우스 휠, 클릭을 쓸 수 있다.
- `claude-api` skill을 업데이트했다. 출력 전 거절 과금 설명이 How refusals are billed 문서로 연결된다. 스트림 도중 거절은 일반 요금으로 과금되고, 출력 전 거절은 rate limit에 포함된다.
- `claude-api` skill이 Managed Agents 리소스를 버전 관리 파일로 유지할 때 `ant apply`를 권장하도록 업데이트했다.
- Anthropic API에 직접 연결하고 텔레메트리가 꺼져 있을 때 auto mode가 기본으로 server-side classifier를 쓰도록 변경했다(`CLAUDE_CODE_AUTO_MODE_SERVER=0`으로 끌 수 있다).
- managed settings나 `--settings`가 `allowUnsandboxedCommands: false`를 설정했거나 managed `allowManagedDomainsOnly: true`일 때, `sandbox.excludedCommands`가 프로젝트·로컬 설정 항목을 무시하도록 변경했다.
- 프로젝트·로컬 설정에서 OpenTelemetry export를 켜거나, endpoint를 지정하거나, 내용을 수집하는 변수(`CLAUDE_CODE_ENABLE_TELEMETRY`, `OTEL_LOG_*` 등)를 무시하도록 변경했다.
- Windows/WSL managed settings를 변경했다. 관리자 정책(HKLM, `managed-settings.json`)이 있지만 잘못됐거나 읽을 수 없으면, 사용자가 쓸 수 있는 HKCU와 WSL `/etc/claude-code`가 적용되지 않는다.
- `Skill(anthropic-skills:*)`와 `Skill(claude-ai:*)` 허용 규칙이 claude.ai에서 동기화된 skill만 포함하도록 변경했다. 이름만 같은 플러그인이나 다른 skill은 포함하지 않는다.
- `anthropic-skills` 또는 `claude-ai` 네임스페이스의 skill 폴더, command 파일, workflow command가 더 이상 로드되지 않도록 변경했다. 그런 이름의 플러그인은 계속 로드되지만, 이름이 겹치면 동기화된 skill이 우선한다.
- `anthropic-skills` 또는 `claude-ai`라는 이름으로 설정한 MCP 서버가 skill이나 prompt를 나열하지 않도록 변경했다(도구는 계속 동작한다). 다시 나열하려면 MCP 설정에서 서버 이름을 바꾼다.
- `/effort`와 프롬프트 입력의 `ultracode` 시각 효과를 평범한 스타일로 바꿨다(ripple, 테두리 장식, 키워드 반짝임 없음). dynamic-workflows spinner 팁은 제거했다.
- 시작 배너의 Clawd 마스코트 발이 몸 모서리 아래에 오도록 바꿨다.
- [VSCode] 긴 답변이 스트림보다 뒤처지던 문제를 수정했다. 이제 패널이 업데이트마다 답변 전체를 다시 파싱하지 않는다.
- [VSCode] 입력창이 스크롤될 만큼 길어지면 받아쓰기 마이크 버튼이 입력창 스크롤바를 가리던 문제를 수정했다.
- [VSCode] 이 컴퓨터에서 시작한 Remote Control 세션이 세션 목록의 Web 항목에서 열리지 않던 문제를 수정했다. 이제 다른 곳에서 실행 중이 아니면 로컬 대화를 연다.
- [VSCode] extension host가 재시작된 뒤 에디터 탭의 로그인 화면이 아무 표시 없이 멈추던 문제를 수정했다. 이제 여기서도 "stopped responding" 안내를 보여 준다.
- [Cloud sessions] Settings › Connectors › GitHub에 Claude GitHub App 상태를 추가했다. 계정에 앱이 설치됐는지, 연결 가능한지, 그리고 연결·설치·재연결 방법을 보여 준다.
- [Cloud sessions] GitHub가 아닌 Git 서버에 저장소가 있는 cloud session의 저장소 메뉴에 "Open repository"와 "Open compare page" 링크를 추가했다.
- [Cloud sessions] 이미 저장소가 있는 실행 중 cloud session에 fork의 upstream처럼 다른 GitHub 소유자의 저장소를 붙일 수 있게 했다. Slack에서 시작한 세션도 포함한다.
- [Cloud sessions] 인도처럼 30분 단위 시차 시간대의 사용자에게 매시간 routine의 다음 실행 시각이 30분 어긋나 보이던 문제를 수정했다.
- [Cloud sessions] 지난 세션들이 체크인 알림을 많이 예약한 계정에서 Routines 페이지와 사이드바 Scheduled 목록이 더 빨리 뜨도록 개선했다.
- [Claude Tag] Enterprise Grid 조직 전체 설치에서 Claude Tag 관리 설정의 workspace별 auto-join 채널 패턴이 무시되던 문제를 수정했다. 이제 Claude가 패턴에 맞는 새 채널에 참여한다.
- [Claude Tag] 한 조직의 두 workspace가 공유하는 Enterprise Grid 채널에서, 채널의 Claude Tag 버전을 다른 workspace에서 저장하면 Claude가 응답하지 않던 문제를 수정했다.
- [Claude Tag] GitHub Enterprise Server 저장소 세션에서 이전 Claude in Slack 앱의 진행 카드를 수정했다. 이제 저장소 이름을 표시하고 동작하는 Create PR 버튼을 제공한다.
- [Claude Tag] 모델이 퇴역한 Slack 스레드가 답할 때마다 다른 모델로 fallback되어 느려지고 매번 fallback 안내가 붙던 문제를 수정했다. 이제 스레드가 동작하는 모델로 옮겨 간다.
- [Claude Tag] Claude가 Slack에 올리는 파일에 표가 든 캡션을 달 수 없던 문제를 수정했다. 이제 캡션도 답변과 같은 형식으로 렌더링된다.
- [Claude Tag] Slack의 Agents & tools 보기에서 Claude 스레드가 이름 대신 첫 메시지로 표시되던 문제를 수정했다. 나중에 이름을 바꿔도 목록이 갱신된다.
- [Claude Tag] GitHub 조직 연결을 끊은 뒤, Claude Tag 관리 설정의 access bundle Repositories 탭에서 그 조직의 권한 제거가 저장되지 않던 문제를 수정했다.
- [Claude Tag] Claude가 추가되지 않은 Grid workspace와 공유된 채널에서 항상 "Couldn't check this channel just now"라고 답하던 문제를 수정했다. 이제 어느 workspace에 앱이 필요한지 알려 준다.
- [Claude Tag] 세션의 cloud worker가 재시작된 뒤 Claude 답변 footer의 비용·토큰 합계가 몇 배로 부풀던 문제를 수정했다.
- [Claude Tag] Slack 답변에서 계획·표·세부 정보를 담는 테두리 카드가 좁은 너비 대신 기본으로 넓게 렌더링되도록 변경했다.
- [Claude Tag] 새로 연결한 Slack workspace가 연결 당시의 기본 모델에 머무르지 않고 현재 기본 모델을 따르도록 변경했다.

---

## 🎯 챌린지

이번 버전에서 내 환경에 적용해볼 만한 항목입니다.

### 1. 답변 글 너비 제한 적용
- **파일**: `~/.claude/settings.json`
- **근거**: 새로 추가된 `maxProseWidth` 설정과 연결된다. 한국어 보고서형 답변과 CLAUDE.md 원칙 블록이 넓은 터미널에서 한 줄로 길게 늘어나면 읽기 어렵다. `"maxProseWidth": 100`처럼 값을 넣으면 글은 읽기 좋은 폭으로 줄고, 표와 코드 블록은 전체 폭을 그대로 쓴다.
- **난이도**: ★☆☆ (약 5분)

### 2. Bash 권한 규칙의 `:*` 패턴 점검
- **파일**: `~/.claude/settings.json` (`permissions.allow`/`deny`), 각 프로젝트의 `.claude/settings.json`·`.claude/settings.local.json`
- **근거**: 패턴 중간에 `:*`가 있는 Bash 규칙(예: `Bash(git push origin:* dev)`)은 지금까지 settings 파일에서 무시됐지만, 이번 버전부터 적용된다. 그래서 전에는 없던 허용·차단이 갑자기 생길 수 있다. `deploy-guard.sh`와 겹치거나 부딪히는 규칙이 없는지 확인한다. 재시작할 때 뜨는 매칭 경고를 보고 의도대로 동작하는지도 확인한다.
- **난이도**: ★★☆ (약 15분)

### 3. auto mode 분류기 경로를 명시적으로 고정
- **파일**: `~/.claude/settings.json` (`env` 블록)
- **근거**: `autoMode` 설정을 쓰는 환경이므로, auto mode 판정 방식이 바뀐 이번 변경의 영향을 받을 수 있다. Anthropic API에 직접 연결하고 텔레메트리가 꺼져 있으면 서버 쪽 분류기가 기본값이 된다. 텔레메트리를 끈 상태라면 판정 방식이 조용히 바뀌지 않도록 `env`에 `CLAUDE_CODE_AUTO_MODE_SERVER`를 적어 둔다. `0`은 기존 방식 유지, 생략은 새 기본값이다. 정한 뒤 `/status`에서 반영됐는지 확인한다. (텔레메트리 설정 상태는 제공된 컨텍스트로 확인할 수 없음 — 가정)
- **난이도**: ★☆☆ (약 10분)
