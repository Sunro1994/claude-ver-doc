# Claude Code v2.1.288

> 작성일: 2026-10-03

---

# 📋 요약본

## 🎉 신기능 (7건)
- **`$.ui.selection()` mod API** — mod에서 fullscreen 모드로 마지막에 선택한 텍스트를 가져온다. 선택 영역이 transcript 한 줄 안에 있으면 그 줄 정보도 함께 준다.
- **클라우드 세션 내장 `gh api`** — GitHub CLI가 없는 이미지에서도 `gh api`를 쓸 수 있다. 파일명·jq 필터·GitHub 오류에 섞인 제어 문자가 터미널로 새던 문제도 고쳤다.
- **Ctrl+C로 지운 프롬프트 복구** — 빈 프롬프트에서 Up을 누르면 지운 초안이 돌아온다. 붙여넣은 텍스트와 이미지도 포함한다.
- **MCP OAuth 추가 권한 재인증** — tool call 중에 MCP 서버가 더 넓은 OAuth 권한(scope)을 요구하면 재인증 프롬프트를 띄운다.
- **`/code-review --max-findings <n>|all`** — 리뷰가 보고하는 지적 수를 늘리거나 줄인다. 한 번 고른 값은 `--max-findings default`를 줄 때까지 유지된다.
- **agents view 단축키** — Ctrl+F로 이름으로 세션을 찾고, Alt+↑/↓로 그룹 사이를 이동한다. 이 둘과 rename은 `keybindings.json`에서 바꿀 수 있다.
- **screen reader 모드 권한 모드 안내** — 계획을 승인하면 바뀐 permission mode를 읽어 준다. Shift+Tab으로 바꿀 때도 같다.

## 🛠️ 개선/수정 (18건)
- **응답 도중 API timeout 복구** — 비대화형 세션과 subagent는 받은 응답에서 이어서 진행한다. thinking만 있는 응답은 재시도한다.
- **"Prompt is too long" 오류** — 마지막 응답의 토큰 사용량이 0으로 보고돼도 auto-compact가 정상 동작한다.
- **`--resume` 안정성 묶음** — compaction이 복원한 파일 누락, 턴의 마지막 응답 미저장, 로드 중 파일이 다시 써져 transcript가 잘리는 문제, 2.1.286 이하 대화의 thinking 유실을 모두 고쳤다.
- **structured outputs 끄기** — Mantle이나 gateway 환경에서 세션 제목·memory recall·prompt hook이 실패하던 문제를 고쳤다. `CLAUDE_CODE_DISABLE_STRUCTURED_OUTPUTS`를 추가했다.
- **auto mode 수정** — 차단된 도구가 Bash가 아닌데 Bash 권한 규칙을 안내하던 문제, Bedrock·Mantle에서 local classifier로 계속 고정되던 문제를 고쳤다. 대화가 classifier 한도를 넘으면 매번 묻지 않고 compact한다.
- **Hook 안전성** — PreToolUse·PermissionRequest hook의 매칭이 실패하거나 입력을 JSON으로 바꿀 수 없으면 건너뛰지 않고 호출을 차단한다. `idle_prompt` 알림이 백그라운드 에이전트 실행 중에 뜨던 문제도 고쳤다.
- **`bash -c` 안의 위험한 `rm`** — bypassPermissions 모드나 shell allow 규칙 아래에서 `bash -c`·`sh -c` 안의 `rm /` 같은 명령이 프롬프트 없이 실행되던 문제를 고쳤다.
- **Bash 권한 검사** — 산술식으로 평가되는 `BASHPID` 할당을 그냥 허용하지 않고 묻는다. 따옴표 없는 heredoc을 매번 묻던 문제를 고쳤다. 확인할 수 없는 부분이 있을 때 이유를 짧게 보여 준다.
- **path-scoped rules 로드** — `.claude/rules`와 하위 폴더 CLAUDE.md가 Read뿐 아니라 Write/Edit에서도 로드된다.
- **LSP 무한 대기** — 응답 없는 언어 서버 요청은 60초 뒤 timeout된다. 서버별 `requestTimeout`으로 바꿀 수 있다.
- **MCP tool call 중복 실행** — 16MB를 넘거나 파싱할 수 없는 원격 결과에서 호출이 두 번 실행되던 문제를 고쳤다.
- **headless SIGTERM 무시** — `timeout`·systemd가 SIGCONT를 함께 보낼 때 `-p`·SDK 세션이 SIGTERM을 무시하던 문제를 고쳤다.
- **`/login` 저장 실패 숨김** — 보안 저장소에 저장하지 못했는데도 성공이라고 보고하던 문제를 고쳤다. `--bare` 세션의 엉뚱한 로그인 실행도 고쳤다.
- **플러그인 수정 묶음** — LSP placeholder 미치환, worktree subagent에서 `tool.call` hook 오작동, 구버전 git의 `git-subdir` 설치 실패, SSH 키가 없을 때 HTTPS 대체 clone을 처리했다.
- **agent teams 플러그인 에이전트** — 이름으로 띄운 플러그인 정의 에이전트가 기본값 대신 자기 prompt·tools·effort로 실행된다.
- **백그라운드 명령 시간 제한 변경** — 시간 제한은 무인 세션(`-p`, SDK, CI, cloud)에만 걸린다. 터미널·데스크톱·VS Code에는 제한이 없다.
- **`/autocompact` 모델별 저장** — 모델마다 auto-compact window 설정을 따로 기억한다.
- **`claude project purge` → `claude purge`** — 이름이 바뀌었다. 옛 이름도 동작하며 안내를 출력한다.

## 🔑 이번 버전의 핵심 키워드
**"끊겨도 이어지고, 빠져나갈 틈은 막는다"** — timeout·resume·compaction 복구로 세션 연속성을 높이고, hook·Bash 권한 검사의 우회 경로를 차단한 안정성·보안 릴리스다.

---

# 📜 원문 (한글 번역본)

> 원문 ChangeLog를 원래 순서 그대로 한 줄도 빠짐없이 번역한 문서입니다.

- mod용 `$.ui.selection()` 추가: fullscreen 모드에서 마지막으로 선택한 텍스트를 반환한다. 선택 영역이 transcript 한 행 안에 있으면 그 행도 반환한다
- GitHub CLI가 없는 이미지의 클라우드 세션에 내장 `gh api` 추가. 내장 기능이 파일명·jq 필터·GitHub 오류의 제어 문자를 터미널로 보내던 문제 수정
- Ctrl+C로 지운 프롬프트 복구 추가: 빈 프롬프트에서 Up을 누르면 붙여넣은 텍스트와 이미지를 포함한 초안이 돌아온다
- tool call 중 MCP 서버가 더 많은 OAuth scope를 요청하면 재인증 프롬프트를 띄우는 기능 추가
- /code-review에 `--max-findings <n>|all` 추가: 기본 한도보다 많거나 적은 지적을 보고한다. `--max-findings default`를 줄 때까지 선택값을 재사용한다
- agents view에 이름으로 세션을 찾는 Ctrl+F와 그룹 간 이동 Alt+↑/↓ 추가. 이 둘과 rename은 keybindings.json에서 재지정할 수 있다
- 계획 승인 시 새 permission mode를 알리는 screen reader 모드 안내 추가(Shift+Tab 포함)
- 응답 중 API timeout으로 턴이 실패하던 문제 수정: 비대화형 세션과 subagent는 부분 응답에서 이어 가고, thinking만 있는 응답은 재시도한다
- 마지막 응답이 토큰 사용량 0을 보고하면 긴 대화가 auto-compact 대신 "Prompt is too long"으로 실패하던 문제 수정
- `--resume`이 compaction이 방금 복원한 파일 등 컨텍스트를 가끔 누락하던 문제 수정
- 재개한 세션이 턴의 마지막 응답을 저장하지 않아 다음 `--resume`에서 프롬프트가 미응답으로 보이던 문제 수정
- 로드 중 같은 세션이 파일을 다시 쓰면 resume이 잘린 transcript를 불러오던 문제 수정
- 2.1.286 이하에서 시작한 대화를 재개하면 모델의 이전 thinking이 사라지던 문제 수정
- Mantle이나 structured outputs를 거부하는 gateway 뒤에서 세션 제목·memory recall·prompt hook이 실패하던 문제 수정. structured outputs를 끄는 `CLAUDE_CODE_DISABLE_STRUCTURED_OUTPUTS` 추가
- 차단된 도구가 Bash가 아닌데 auto mode 거부가 Bash 권한 규칙을 가리키던 문제 수정
- Bedrock·Mantle의 auto mode가 WebFetch 요약이나 `sonnet` subagent 같은 구형 모델 요청 후 세션 내내 local classifier로 전환되던 문제 수정
- 새로 고른 모델로 재시작한 클라우드 세션이 서버가 그 모델을 거부한 뒤에도 그 모델로 응답하던 문제 수정
- 미승인 URL의 WebFetch 권한 프롬프트가 5분간 응답이 없을 때 Cowork 클라우드 세션이 입력 대기 상태로 남던 문제 수정
- 다른 기기에서 시작한 Cowork 클라우드 세션에 참여한 휴대폰에 prompt suggestion이 나오지 않던 문제 수정
- Claude Code 재시작 전에 그려진 화면에서 mod 버튼을 누르면 다른 버튼 동작이 실행되던 문제 수정
- 플러그인 pane의 `Code` 요소 하나에 파싱 불가 diff가 있으면 아무것도 표시되지 않던 문제 수정. 이제 일반 코드로 그린다
- 플러그인 LSP 서버가 `initializationOptions`와 `settings`에서 치환값이나 manifest 기본값 대신 `${user_config.*}`·`${CLAUDE_PLUGIN_ROOT}` placeholder를 그대로 받던 문제 수정
- worktree에서 실행되는 subagent에서 플러그인 `tool.call` hook이 Bash를 실패시키고 파일 검색이 잘못된 폴더를 읽던 문제 수정
- 구버전 git(2.39 미만, 예: Ubuntu 22.04의 2.34)에서 `git-subdir` 플러그인 설치가 실패하거나 불완전하게 캐시되던 문제 수정
- `--plugin-dir`로 로드한 플러그인이 `/plugin`에 "Configure options"를 표시하지 않던 문제 수정
- 플러그인의 타이머나 읽기 작업이 진행 중일 때 플러그인을 reload·비활성화하면 백그라운드 세션이 종료되던 문제 수정
- sandbox auto-allow에서 본문이 일반 텍스트와 단순 `$VAR` 참조만 있는 따옴표 없는 delimiter heredoc(`python3 <<EOF`)이 매번 승인을 묻던 문제 수정
- Bash 도구 권한 검사가 셸이 산술식으로 평가할 값의 `BASHPID` 할당을 조용히 허용하지 않고 묻도록 수정
- 플러그인이나 mod가 프롬프트 위에 행을 표시할 때 background tasks 대화상자를 열면 fullscreen 세션이 "unrecoverable interface error"로 종료되던 문제 수정
- 다른 세션이 보류한 메시지를 Claude가 전달됨으로 보고하던 문제 수정: 이제 전달되지 않았다고 알리고 세션 이름을 밝힌다. SDK 세션에서는 Claude가 턴 도중에 이를 알 수 있다
- `-p`·SDK 세션과 PreToolUse hook 승인에서 OpenTelemetry `claude_code.tool.blocked_on_user` span이 source나 decision을 `unknown`으로 보고하던 문제 수정
- `-p`나 중단된 턴에서 응답 없이 끝난 권한 요청이 `tool_decision` 이벤트를 내보내지 않던 문제 수정
- Cowork 클라우드 세션의 Edit·Retry가 히스토리가 남아 있는데도 `/compact` 이전 메시지를 거부하던 문제 수정
- 무인 세션(`CLAUDE_CODE_RETRY_WATCHDOG`)이 매우 긴 응답 스트림 실패 후 몇 시간씩 재시도하던 문제 수정. 이제 다시 스트리밍하고 timeout 3회 후 포기한다
- 자격 증명을 보안 저장소에 저장하지 못했는데 `/login`이 "Login successful"을 보고하던 문제 수정. 이제 실패를 표시하고, 새 로그인이 적용되지 않으면 재시도를 제안한다 (anthropics/claude-code#73861)
- Bedrock 자격 증명 조회 중 Stop이 요청을 끝내지 않고 세션을 fallback 모델로 옮기던 문제 수정
- 다른 Claude Code 프로세스가 로그인 중에 노트북이 sleep에서 깨어나면 두 번째 `gcpAuthRefresh`/`awsAuthRefresh` 브라우저 로그인이 열리던 문제 수정
- agent teams 수정: 이름으로 띄운 플러그인 정의 에이전트가 기본값 대신 자체 prompt·tools·disallowedTools·effort로 실행된다
- `timeout`·systemd 같은 supervisor가 SIGTERM과 함께 SIGCONT를 보내면 headless(`-p` / SDK) 세션이 SIGTERM을 가끔 무시하던 문제 수정
- 재시작한 클라우드 세션이 조직의 강제 모델 목록이 거부하는 모델을 복원하던 문제 수정
- 원격 서버 결과가 16MB를 넘거나 파싱할 수 없을 때 MCP tool call이 두 번 실행되던 문제 수정
- Claude Desktop Code 탭의 subagent가 사용자 설정 MCP 서버 `memory`의 도구를 하나도 받지 못하던 문제 수정
- auto mode를 쓸 수 없을 때(`disableAutoMode`나 구형 모델 등) 허용한 사이트에서도 Claude in Chrome이 스크린샷·페이지 읽기마다 묻던 문제 수정. 입력·이동·JavaScript는 여전히 묻는다
- GitHub SSH 키가 없는 macOS·Linux에서 GitHub 소스 플러그인의 `claude plugin install`이 실패하던 문제 수정: clone이 HTTPS로 대체되고 안내를 출력한다
- `permissions.blockReadsOutsideWorkingDirectories`가 켜져 있으면 git config 파일에 대한 `sandbox.credentials.files` 항목이 적용되지 않던 문제 수정
- Team·Enterprise 플랜이나 managed settings 기기에서 Artifact 도구로 슬라이드·디자인을 시작할 때 조직 디자인 시스템이 빠지던 문제 수정
- Claude Code가 스스로 재시작한 뒤(Claude apps gateway 첫 로그인, provider 설정, `/tui`) Windows에서 키보드가 동작하지 않던 문제 수정
- `tools:`에 `Agent(...)` 항목이 아주 많은 에이전트를 실행할 때 멈추던 문제 수정
- PDF 전체가 대화에 들어간 뒤 Claude 3 Opus·Claude 3 Sonnet 세션이 매 턴 실패하던 문제 수정
- 플랫폼 네이티브 바이너리 다운로드가 실패하고 placeholder `claude` stub만 설치됐는데 npm auto-updater가 성공을 보고하던 문제 수정
- Remote Control 정리가 아직 연결 중이거나 다른 Claude Code 프로세스가 방금 다시 연결한 세션을 보관 처리하던 문제 수정
- SSH·HTTPS fetch가 모두 실패할 때 `owner/repo` 플러그인 marketplace가 두 번째 시도의 오류만 보여 주던 문제 수정. 이제 두 오류를 모두 표시하며 먼저 시도한 전송 방식이 위에 온다
- Write나 Edit이 범위 안 파일을 만들거나 바꿀 때 path-scoped `.claude/rules`와 하위 CLAUDE.md가 로드되지 않던 문제 수정(이전엔 Read만 로드)
- bypassPermissions 모드나 shell allow 규칙 아래에서 `bash -c`·`sh -c` 스크립트 안의 위험한 `rm`(`/`나 홈 디렉토리 대상 등)이 프롬프트 없이 실행되던 문제 수정 (anthropics/claude-code#96300)
- 언어 서버가 dynamic capability registration을 쓰거나 응답을 멈추면 LSP tool call이 무한 대기하던 문제 수정. 요청은 60초 뒤 timeout된다(서버별 `requestTimeout`)
- 백그라운드 에이전트 실행 중에 `idle_prompt` notification hook이 발동하던 문제 수정 (anthropics/claude-code#93672)
- 매칭이 실패하거나 도구 입력을 JSON으로 직렬화할 수 없을 때 PreToolUse·PermissionRequest hook을 건너뛰던 문제 수정. 이제 호출을 차단한다
- 새 환경이나 모델 전환 후 첫 요청이 서버 값 대신 내장 output limit과 auto-compact window를 쓰던 문제 수정. 이 요청은 최대 1.5초 기다릴 수 있다
- ctrl+enter로 대기 메시지를 보낸 뒤 Interrupted 행에 "What should Claude do instead?" 힌트가 표시되던 문제 수정
- `--bare` 세션의 `/login`이 세션이 읽지도 않는 로그인을 실행해 저장된 로그인을 덮어쓸 수 있던 문제 수정. 이제 어떤 자격 증명이 동작하는지 알려 준다
- subagent의 파일 접근으로 rule이나 하위 CLAUDE.md가 로드될 때 InstructionsLoaded hook이 agent_id·agent_type을 빠뜨리던 문제 수정. 파일 접근 시 로드되는 rule·하위 CLAUDE.md도 effort를 보고한다
- `claude mcp serve`의 Agent 도구가 사용 가능한 에이전트가 없다고 보고하고 모든 subagent_type을 거부하던 문제 수정
- fullscreen transcript viewer 검색과 `/theme` 사용자 색상 검색에서 터미널 커서가 입력 텍스트를 따라가지 않던 문제 수정
- screen reader 모드의 `/permissions` 수정: 규칙 번호를 입력하면 검색창을 열지 않고 해당 규칙을 고른다
- auto mode 개선: 대화가 client-side safety classifier가 검토하기에 너무 길어지면 매 tool call마다 묻거나 실패하지 않고 compact한다
- screen reader 모드 개선: 삭제된 단어 같은 짧은 안내가 다음 키 입력이나 위쪽 화면 변경 때까지 화면에 남는다
- screen reader 모드 개선: 질문 대화상자에서 답한 질문 옆에 "answered"를 표시한다
- 조직이 사용량 크레딧 요청을 끈 Team·Enterprise 멤버에게 보이는 `/usage-credits` 메시지 개선
- 클라우드 세션 개선: 새 대화의 첫 턴이 config에 `alwaysLoad: false`인 stdio MCP 서버를 기다리지 않는다
- "You should know" 노트가 결정 주체에 따라 "we", "the main agent", "you"로 말하도록 개선
- 데이터베이스 크기 한도로 artifact 데이터베이스 쓰기가 거부될 때 오류 개선: 한도와 공간을 확보하는 방법을 알려 준다
- 명령 일부를 실행 전에 확인할 수 없을 때 Bash 권한 프롬프트가 더 짧은 이유를 보여 주도록 개선
- Self-hosted runner: 내장 `gh api` 개선: 거부된 gh 명령은 대응하는 `gh api` 명령을 출력하고, `--paginate`는 저장소 목록의 모든 페이지를 따라가며, 중첩된 `claude`가 이를 제거하지 않는다
- 서버 자격 증명 만료 시 Remote Control 복구 개선: 갱신 중에도 세션이 연결을 유지하고, 서버 장애로 갱신을 포기해도 세션을 유지한다
- 백그라운드 명령 시간 제한이 무인 세션(`-p`, Agent SDK, CI, cloud)에만 적용되도록 변경. 터미널·데스크톱 앱·VS Code 세션은 제한이 없다
- client-side auto mode classifier가 Claude Sonnet 5.5나 Opus 5.5를 지정한 `ANTHROPIC_DEFAULT_SONNET_MODEL` 고정을 무시하고 Claude Sonnet 5를 쓰도록 변경
- `claude project purge`를 `claude purge`로 변경. 옛 이름도 동작하며 안내를 출력한다
- agents view `n:` 필터(와 Ctrl+F 검색)에서 Enter가 맨 위 행 대신 이름이 가장 잘 맞는 세션을 열도록 변경
- `/autocompact`가 auto-compact window를 모델별로 저장하도록 변경. 모델을 바꿔도 각자 설정을 유지한다
- 완료 시점을 알릴 수 없는 서버의 MCP URL 프롬프트가 "I'm done, continue"를 기다린 뒤 tool call을 이어 가도록 변경. 브라우저에서 먼저 작업을 마칠 수 있다
- [VSCode] 승인 후에도 claude.ai connector가 "Needs authentication"에 머물던 문제 수정: MCP 서버 대화상자에 Check connection을 추가했다
- [VSCode] opt-in New Conversation 단축키(Cmd/Ctrl+N)가 현재 뷰가 아닌 보이는 모든 Claude 뷰에서 대화를 시작하던 문제 수정
- [VSCode] 표시 중인 세션을 보관하면 채팅 뷰가 다음 저장 세션을 재개하던 문제 수정. 이제 새 대화를 시작한다
- [Cloud sessions] 관련 없는 보안 설정이 로딩 중이거나 로드에 실패하면 Claude Code 관리자 설정의 Cloud sessions 스위치가 꺼진 채 잠기던 문제 수정
- [Cloud sessions] self-hosted runner 시작 중에 Stop을 눌러도 대기 메시지가 취소되지 않아 runner가 올라온 뒤 실행될 수 있던 문제 수정
- [Claude Tag] 자동 생성된 채널 설정에서 항상 실패하는 "Remove this scope" 옵션을 Claude Tag 관리자 설정이 제공하던 문제 수정
- [Claude Tag] Claude가 읽기만 한 다른 채널의 관련 Slack 스레드도 따라가도록 개선. 그쪽 업데이트가 의존하는 대화에 전달된다
- [Claude Tag] 채널 Configure 페이지 저장 오류 개선: 너무 긴 채널 지침은 줄이라고 안내하고, 접근 권한 상실로 거부된 저장은 더 이상 재시도를 권하지 않는다
- 오래된 저장 설정만 읽고 `claude plugin test`가 mod를 원격에서 꺼졌다고 보고하던 문제 수정

---

## 🎯 챌린지

이번 버전에서 내 환경에 적용해볼 만한 항목입니다.

### 1. `idle_prompt` 알림 hook 추가
- **파일**: `~/.claude/settings.json`
- **근거**: 지금은 `Stop` hook으로 "작업 완료" 알림만 받는다. 이번 버전에서 `idle_prompt`가 백그라운드 에이전트 실행 중에 잘못 뜨던 문제가 고쳐졌다. 이제 `Notification` hook(matcher `idle_prompt`)에 osascript 알림을 붙이면 "입력 대기 중"만 정확히 받는다. 확인 게이트·복명복창으로 응답이 자주 멈추는 작업 방식에 바로 도움이 된다.
- **난이도**: ★☆☆ (약 10분)

### 2. `deploy-guard.sh`의 `bash -c` 우회 점검
- **파일**: `~/.claude/hooks/deploy-guard.sh`
- **근거**: 이번 버전은 `bash -c` 안의 위험한 `rm` 우회와 PreToolUse hook 매칭 실패 시 건너뛰던 문제를 막았다. 하지만 내 hook이 `bash -c "git push origin feat/x"`나 `sh -c '...'`처럼 감싼 push를 잡는지는 hook 스크립트 자체에 달렸다. 감싼 명령 3~4개로 실제 차단되는지 테스트하고, 빠지면 정규식을 보강한다.
- **난이도**: ★★☆ (약 20분)

### 3. 치명 등급 리뷰에 `--max-findings` 기준 명시
- **파일**: `~/.claude/CLAUDE.md` (§7.1 검증 등급)
- **근거**: 치명 등급(인증·결제·삭제/마이그레이션)에서만 `/code-review`를 쓰는 규칙이 있다. 새 옵션 `--max-findings all`을 치명 등급 리뷰 기본값으로 적어 두면 지적이 기본 한도에 잘리지 않는다. 값이 다음 리뷰에도 유지되므로, 끝나면 `--max-findings default`로 되돌린다는 문구도 함께 적는다.
- **난이도**: ★☆☆ (약 5분)

### 4. 체인지로그 cron의 `claude -p`에 `timeout` 씌우기
- **파일**: `~/.claude/skills/claude-changelog-sync/` 안의 cron 실행 스크립트
- **근거**: 매일 08:00 cron이 `claude -p --model opus`로 문서를 만든다. 이번 버전에서 `-p` 세션은 응답 도중 timeout이 나도 이어서 진행하고, `timeout`이 보내는 SIGTERM도 확실히 받는다. 호출을 `timeout 600 claude -p ...`로 감싸면 멈춘 프로세스가 다음 날까지 남지 않는다. 종료 코드 124를 로그에 남기도록 같이 고친다.
- **난이도**: ★★☆ (약 15분)
