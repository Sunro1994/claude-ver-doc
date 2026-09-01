# Claude Code v2.1.257

> 작성일: 2026-09-02

---

# 📋 요약본

## 🎉 신기능 (12건)

- **Claude Fable 5.1 (`claude-fable-5-1`)** — 새 기본 Fable 모델. 1M 컨텍스트, Mtok당 $10/$50, 캐시 읽기 $0.25/Mtok.
  - 단 Claude apps gateway 세션에서 `fable`·`best`는 당분간 Fable 5로 유지된다. 5.1을 쓰려면 `/model`에서 직접 고른다.
- **`timeFormat` / `timeZone` 설정** — 턴 종료 시각과 트랜스크립트 타임스탬프의 표기를 12시간제·24시간제·24시간 UTC·strftime 패턴 중에서 고른다.
- **auto 모드 Containment Escape 규칙** — 클라우드 메타데이터 자격증명 조회, 이그레스 우회, 크로스 테넌트 접근을 자동 승인 대상에서 제외한다. 환경이 "정상 동작"으로 표시한 경우만 예외.
- **`CLAUDE_CODE_SUBAGENT_MODEL_FORCE`** — `CLAUDE_CODE_SUBAGENT_MODEL`(또는 메인 모델)을 모든 서브에이전트에 강제 적용한다. spawn별·에이전트 정의별 모델 오버라이드를 전부 무시한다.
- **`/effort`의 `s` 옵션** — `/model`과 동일하게 현재 세션에만 effort를 바꾼다.
- **`/doctor` 샌드박스 경고** — 강제 종료된 세션이 남긴 오래된 sandbox mask 파일을 경고한다.
- **작업 디렉토리 밖 파일 읽기 1회 확인** — auto 모드에서 첫 외부 읽기 전에 물어본다. `permissions.blockReadsOutsideWorkingDirectories`로 아예 차단할 수 있다.
- **게이트웨이 모델 설명 표시** — `CLAUDE_CODE_ENABLE_GATEWAY_MODEL_DISCOVERY`로 발견한 `/model` 항목에 게이트웨이가 준 `description`을 보여준다.
- **[VSCode] 세션 목록 섹션 헤더** — ACCOUNT & USAGE / SESSION MANAGER를 접을 수 있고, 계정 이메일·사용량 미터·상세 보기 링크가 붙는다.
- **[VSCode] 입력창 모델 pill** — 현재 모델을 표시하고 클릭하면 모델 피커가 열린다. Effort 행과 "More models" 페이지 포함.
- **[VSCode] Ungrouped 섹션 접기 토글**.
- **[VSCode] 커맨드 메뉴에서 output style 선택** — 커스텀 스타일도 고를 수 있다.

## 🛠️ 개선/수정 (92건)

- **권한·보안 우회 차단** — 이번 버전에서 가장 무거운 묶음.
  - `permissions.ask` 규칙이 compound command·subshell 안에서 건너뛰어져 확인 없이 실행되던 문제 수정.
  - Bash `Read()`/`Edit()` deny 규칙이 `< file` 리다이렉트와 `tac`·`egrep` 같은 읽기 명령에 적용되지 않던 문제 수정. 이제 인자·리다이렉트 대상 어디에 걸려도 거부한다.
  - zsh가 bash와 다르게 파싱하는 `[[ ]]` 조건문이 자동 승인되던 문제 수정.
  - 플러그인이 심볼릭 링크 경로로 자기 디렉토리 밖 파일을 읽을 수 있던 문제 수정.
  - `--disallowedTools`와 세션 deny 규칙이 `allowManagedPermissionRulesOnly`에서 첫 설정 리로드 후 사라지던 문제 수정.
- **자격증명 누출·오전송 수정** — Bedrock·Mantle·Vertex·WIF의 중복 `Authorization` 헤더 문제, Foundry에 남은 Anthropic 키가 함께 전송되던 문제, MCP 로그에 URL·헤더의 자격증명이 그대로 찍히던 문제.
- **백그라운드 세션 안정화** — 자기 업데이트 중 시작 실패, 삭제된 디렉토리에서의 `--bg`, 구버전 바이너리로 계속 돌던 세션, `--resume`/`--continue` 중복 표시, `state.json` 프롬프트 중복 등 10여 건.
- **서브에이전트 신뢰성** — 스트리밍이 절전·연결 끊김·서버 오류로 끊기면 서브에이전트가 미완성 응답으로 종료되던 문제를 자동 이어가기로 수정. 5MB 넘는 트랜스크립트 재개 실패, 중지한 서브에이전트를 재개해도 메인 에이전트가 모르던 문제도 수정.
- **prompt cache 미스 제거** — advisor 모델 세션의 백그라운드 요청(compaction·`/recap`), 스크린샷 많은 긴 세션, Remote Control 중간 연결, `/fork` 등에서 매 턴 캐시를 놓치던 문제들.
- **렌더링·응답성 개선** — 긴 대화의 턴당 재렌더 감소, 응답이 길어져도 스트리밍이 느려지지 않음, 키 입력당 렌더 작업 감소.
- **샌드박스·worktree** — 끝에 점이 붙은 호스트(`example.com.`)의 `deniedDomains` 미적용, 하위 디렉토리로 `cd` 후 linked worktree의 `.git` 쓰기 권한 상실, worktree 세션이 git과 무관한 Bash 루프·heredoc을 거부하던 문제.
- **`/code-review --comment` GitLab 지원** — `glab mr note`로 merge request에 findings를 남긴다.
- **`/btw` 히스토리 키 변경** — `←`/`→` 대신 `Shift+←`/`Shift+→`(또는 `[`/`]`).
- **`defaultMode: "bypassPermissions"` 무시** — 프로젝트 `.claude/settings.json`·`settings.local.json`에서는 더 이상 먹지 않는다. user·managed 설정이나 `--permission-mode`를 써야 한다.
- **`--add-dir` 네트워크 경로 거부** — UNC 공유·`/net/<host>` 자동마운트는 접근 전에 거부한다. Windows는 매핑된 드라이브 문자를 쓴다.
- **[VSCode]** 서드파티 프로바이더에서 claude.ai 전용 기능이 노출되던 문제, 사용량 미터 공백, Remote Control 전역 토글 미적용, 스크린리더 오독 수정. "Delete session"은 "Archive session"으로 바뀌었다.

## 🔑 이번 버전의 핵심 키워드

**"자동 승인의 구멍을 메운 버전"** — Fable 5.1과 서브에이전트 모델 강제가 눈에 띄지만, 실질은 subshell·리다이렉트·zsh 파싱 차이로 권한 검사를 빠져나가던 경로를 전부 닫은 보안 정비다.

---

# 📜 원문 (한글 번역본)

> 원문 ChangeLog를 원래 순서 그대로 한 줄도 빠짐없이 번역한 문서입니다.

- Claude Fable 5.1(`claude-fable-5-1`) 추가 — 이제 기본 Fable 모델이다. 1M 컨텍스트, Mtok당 $10/$50, 캐시 읽기 $0.25/Mtok.
- "Time format"(`timeFormat`)과 `timeZone` 설정 추가 — 턴 종료 시각과 트랜스크립트 뷰 타임스탬프에 12시간제, 24시간제, 24시간 UTC, 또는 strftime 패턴을 적용한다.
- auto 모드에 Containment Escape 규칙 추가 — 클라우드 메타데이터 자격증명 조회, 이그레스 회피, 크로스 테넌트 접근은 환경이 이를 예상된 동작으로 표시하지 않는 한 더 이상 자동 승인되지 않는다.
- `CLAUDE_CODE_SUBAGENT_MODEL_FORCE` 추가 — `CLAUDE_CODE_SUBAGENT_MODEL`(또는 메인 모델)을 모든 서브에이전트에 적용하고, spawn별·에이전트 정의별 모델 오버라이드를 무시한다.
- `/effort`에 `s` 추가 — `/model`과 동일하게 현재 세션에만 effort를 변경한다.
- 강제 종료된 세션이 남긴 오래된 샌드박스 mask 파일에 대한 `/doctor` 경고 추가.
- auto 모드에서 작업 디렉토리 밖 첫 파일 읽기 전에 1회성 프롬프트 추가 — 그런 읽기를 차단하는 옵션 포함(`permissions.blockReadsOutsideWorkingDirectories`).
- 발견된 `/model` 피커 항목에 게이트웨이가 제공하는 `description` 지원 추가(`CLAUDE_CODE_ENABLE_GATEWAY_MODEL_DISCOVERY`). description이 없는 항목은 여전히 "From gateway"로 표시된다.
- 시작 이후에 생성된 `.claude/` 폴더의 설정이 재시작 전까지 인식되지 않던 문제 수정.
- `←`로 연 에이전트 뷰에서 dispatch한 세션이 항상 원래 세션의 권한 모드로 시작해, 대상 디렉토리의 `defaultMode`와 에이전트의 `permissionMode`를 덮어쓰던 문제 수정.
- `claude agents`에서 `keybindings.json`의 Ctrl+G 재바인딩이 무시되던 문제 수정. Ctrl+S / Ctrl+T도 새 `Agents` 컨텍스트로 재바인딩할 수 있다.
- 자기 업데이트 중 macOS npm 설치 환경에서, 그리고 Windows에서 오래된 데몬 lock 파일이 재사용된 프로세스 id를 가리킬 때 백그라운드 세션이 시작되지 않던 문제 수정.
- 슬래시 커맨드 패널 뒤에서 응답이 스트리밍되는 동안 작업 스피너가 멈추던 문제 수정.
- 예약된 wake-up 이후 백그라운드 세션의 `state.json` `detail`이 자신의 dispatch 프롬프트를 반복하던 문제 수정.
- `claude agents`에서 다시 프롬프트를 준 백그라운드 세션이 완료된 뒤에도 Completed 아래쪽에 묻혀 있던 문제 수정. 이제 Completed는 최근 완료 순으로 정렬된다.
- 방금 삭제된 디렉토리에서 실행한 `claude --bg`가 "backgrounded"라고 보고하고 크래시된 세션 행을 남기던 문제 수정. 이제 이유를 출력하고 exit 1로 종료한다.
- 세션 도중 Remote Control이 연결되면 Bash 도구 정의를 다시 보내 prompt cache 미스가 발생하던 문제 수정.
- Bedrock·Mantle·Vertex·WIF에서 중복 등록된 커스텀 `Authorization` 헤더가 설정된 자격증명을 덮어쓰던 문제, 그리고 Vertex 설정 마법사가 `~/.config/anthropic`에 남은 Anthropic 프로필을 가져오던 문제 수정.
- Claude apps gateway가 Foundry·Vertex·Bedrock에 불필요한 호스트 `Authorization` 또는 프로필 헤더를 보내던 문제, 그리고 `ANTHROPIC_FOUNDRY_API_KEY`가 설정되면 Foundry Entra ID upstream이 시작되지 않던 문제 수정.
- API 키 모드에서 남아 있던 Anthropic API 키나 auth token이 Foundry 구독 키와 함께 전송되던 문제 수정.
- 메시지 role 없이 프롬프트가 저장되어 실행 시 할 일이 없던 `/schedule` 루틴 문제 수정.
- `claude agents`가 백그라운드 세션이 다른 세션의 메시지 승인을 기다리는 중이라는 사실과 보낸 주체를 표시하지 않던 문제 수정.
- 열려 있는 백그라운드 세션 안에서 Ctrl+S로 임시 저장한 프롬프트가 세션이 idle 되거나 중지 후 다시 열릴 때 사라지던 문제 수정.
- 서버 관리 설정으로 내려온 텔레메트리(OTEL) 설정이 warm start에서 무시되던 문제 수정. 데스크톱 앱의 Code 세션 포함.
- 리더의 메일박스 쓰기가 잠시 잠겼을 때 팀원 권한 요청이 두 번 응답되던 문제 수정.
- 커맨드의 자동 이어진 응답이 스트리밍되는 동안 진행 중인 턴 아래에 유령 중복 슬래시 커맨드 행이 렌더되던 문제 수정.
- `policyHelper`의 `timeoutMs`·`refreshIntervalMs`가 타이머 최대값(2147483647)을 넘으면 실패하거나 1밀리초마다 재실행되던 문제 수정. 이제 값이 clamp된다.
- 다른 서브에이전트의 트랜스크립트로 전환한 뒤 토큰 카운터가 멈추거나 느려지던 문제 수정. 백그라운드 서브에이전트와 팀원의 카운터도 응답 스트리밍 중 실시간으로 갱신된다.
- 끝에 점이 붙은 샌드박스 네트워크 호스트(`example.com.`) 문제 수정 — `deniedDomains` 항목이 샌드박스 안에서 해당 호스트를 차단하지 못했고, 그런 호스트에 "don't ask again"을 해도 계속 물어보던 문제.
- Remote Control 동의 프롬프트를 닫은 것(Esc, 또는 `claude remote-control`에서 `n`)이 동의로 처리되어 다음 요청이 묻지 않고 연결되던 문제 수정.
- 시작 이후 로드된 managed MCP allow/deny 목록이나 `strictPluginOnlyCustomization`이 차단해야 할 설정 파일 MCP 서버를 `/mcp` 재연결·활성화가 여전히 연결하던 문제 수정.
- `strictPluginOnlyCustomization`이 MCP를 플러그인 전용 서버로 제한할 때 `claude mcp remove`가 원격 서버의 저장된 OAuth 자격증명을 남기던 문제 수정.
- Claude 앱에서 시작한 Remote Control(`claude remote-control`) 세션이 선택한 모델을 무시하고 머신 기본 모델로 실행되던 문제 수정.
- `allowManagedPermissionRulesOnly`가 켜져 있을 때 `--disallowedTools`와 세션 deny 규칙이 첫 설정 리로드 이후 사라지던 문제 수정.
- `--resume`이 백그라운드로 보낸 대화를 두 번 나열하고 `--continue`가 그 대화의 멈춘 백그라운드 이전 복사본을 열던 문제 수정. `--continue`는 이제 완료된 백그라운드 세션도 연다.
- 전체화면 모드에서 `!` 셸 명령 출력을 클릭해 펼칠 수 없던 문제 수정.
- 자동 업데이트를 거치며 구버전 Claude Code 바이너리로 계속 실행되던 백그라운드 세션이 정리되지 않고 쌓이던 문제 수정.
- `claude agents --json`이 잠시 터미널을 raw 모드로 바꿔 종료 시 다른 프로그램의 터미널 설정을 되돌리던 문제 수정.
- Proactive output style 세션이 자신이 시작한 백그라운드 명령이나 Monitor가 아직 실행 중일 때 idle 상태로 기다리지 않고 채우기 메시지와 반복 로그 읽기로 busy loop를 돌던 문제 수정.
- 컴퓨터 절전, 연결 끊김, 서버 오류로 응답이 스트리밍 도중 끊기면 서브에이전트가 멈추던 문제 수정. 이제 미완성 응답으로 끝내지 않고 자동으로 이어간다.
- `claude agents` 세션 안의 `/btw` 패널에서 `←`가 아무 동작도 하지 않던 문제 수정 — 이제 (답변 도중에도) 에이전트 목록으로 돌아가며, 세션을 다시 열면 패널이 복원된다.
- advisor 모델이 설정된 세션이 백그라운드 요청(compaction, `/recap`, 프롬프트 제안)에서 prompt cache를 놓치고 매번 전체 대화를 캐시 없이 다시 보내던 문제 수정.
- 모델이 걸어둔 Monitor가 아직 실행 중인데도 `claude -p`가 최종 결과 약 5초 뒤에 종료되던 문제 수정. 이제 감시가 발동하거나 타임아웃될 때까지 기다린다.
- auto 모드에서 대상 명령이 compound command나 subshell 안에서 실행될 때 `permissions.ask` 규칙이 건너뛰어져 확인 프롬프트 없이 실행되던 문제 수정.
- 플러그인이 선언한 커맨드·에이전트·스킬·훅 등 컴포넌트 경로가 심볼릭 링크일 때 자기 디렉토리 밖 파일을 읽을 수 있던 문제 수정. 이제 그런 경로는 오류로 거부된다.
- `/add-dir`가 현재 작업 디렉토리 안의 디렉토리를 거부하던 문제 수정. 이제 시작 시 `--add-dir`가 하듯 그 디렉토리의 스킬·커맨드·에이전트를 로드한다.
- 트랜스크립트 뷰에서 중지시킨 서브에이전트를 재개해도 메인 에이전트가 이를 통보받지 못하던 문제 수정.
- ANSI 색상이 포함된 텍스트(예: CI 로그)를 `/feedback` 같은 다이얼로그에 붙여넣으면 크래시하던 문제 수정.
- 프로젝트의 `.mcp.json`이 FIFO이거나 디바이스 파일 심볼릭 링크일 때 `claude mcp add/remove`가 멈추거나 메모리를 소진하던 문제 수정. 이제 실행 가능한 안내와 함께 즉시 실패한다.
- `claude -p --input-format stream-json`에 JSONL이 아닌 데이터가 파이프될 때 메모리가 무한히 증가하던 문제 수정. 이제 명확한 오류와 함께 즉시 실패한다.
- 서브에이전트나 다른 도구가 실행 중일 때 턴을 백그라운드로 보내면(`←` 또는 Ctrl+B) 백그라운드 세션이 그 도구를 거부된 것으로 처리하고 재실행하지 않는 경우가 있던 문제 수정.
- Bash `Read()`/`Edit()` deny 규칙이 `< file` 리다이렉트와 `tac`·`egrep` 같은 읽기 명령에 적용되지 않던 문제 수정. 이제 인자나 리다이렉트 대상 어디에든 deny 규칙이 걸리면 명령을 거부한다.
- 트랜스크립트가 5MB를 넘긴(예: 이미지를 많이 읽은) 서브에이전트를 재개하거나 메시지를 보낼 때 "No transcript found"로 실패하던 문제 수정.
- worktree로 격리된 세션이 git을 전혀 건드리지 않는 Bash 루프, `$VAR` 읽기, `"$(…)"`, heredoc을 "worktree 안에 머무는지 검증하기에 너무 복잡함"이라며 거부하던 문제 수정.
- 대화를 빈 상태까지 되감은 뒤 `/model`과 `/effort`가 prompt cache 경고를 표시하던 문제 수정.
- 스크린샷이 많은 긴 세션에서 이미지가 요청당 크기 상한을 넘으면 매 턴 prompt cache 미스가 나던 문제 수정.
- Edit 권한 프롬프트의 diff 뷰가 이모지와 다중 코드포인트 문자의 폭을 잘못 렌더하던 문제 수정.
- WebSocket MCP 서버 연결 실패가 실제 오류 대신 "[object ErrorEvent]"로 기록되던 문제 수정.
- 다른 Claude Code 프로세스가 npm 업데이트를 다운로드하는 동안 백그라운드 세션이 "Couldn't start the background service"로 열리지 않던 문제 수정. 이제 다운로드 완료를 기다린 뒤 시작한다.
- 셸에서 분리되는 백그라운드 명령(예: `timeout`이나 `setsid` 아래)이 task 중지나 Claude Code 종료 후에도 살아남던 문제 수정.
- 태스크 패널이나 연결된 클라이언트에서 백그라운드 명령을 중지해도 Claude가 이를 통보받지 못하던 문제 수정.
- 백그라운드 서브에이전트를 중지해도 그 monitor들이 계속 돌던 문제 수정.
- linked worktree에서 하위 디렉토리로 `cd`한 뒤 샌드박스 git 명령이 저장소 공통 `.git` 디렉토리에 대한 쓰기 권한을 잃던 문제 수정.
- Opus 4.7 이상에서 긴 hidden-thinking 구간 동안 Bedrock·Bedrock Mantle 요청이 무응답 상태가 되어 idle 타임아웃이 연결을 끊던 문제 수정. 이제 스트림이 진행 이벤트를 함께 보낸다.
- Claude apps gateway 세션이 만료되거나 취소된 뒤 Claude Code를 실행하면 네트워크 오류로 보고하던 문제 수정. 이제 세션이 종료됐다고 알리고 `/login`을 안내한다.
- 세션의 네트워크 프록시가 실행 시점에 시작되지 않으면 클라우드 세션이 남은 세션 내내 git/GitHub 자격증명을 잃던 문제 수정. 이제 백그라운드에서 재시도해 복구한다.
- 백그라운드 데몬 시작이 중단된 뒤 시스템 temp 디렉토리에 남던 `cc-daemon-*` 폴더 문제 수정. 이제 `cleanupPeriodDays` 보존 정리가 이들을 제거한다.
- zsh가 bash와 다르게 파싱하는 일부 `[[ ]]` 조건문을 Bash 권한 검사가 자동 승인하던 문제 수정. 이제 이런 명령은 승인을 요청한다.
- 관리 설정이 상세 추적이나 원본 API 본문 로깅을 끄거나 trace export를 켤 때, managed-settings 승인 프롬프트가 텔레메트리 문구 대신 일반 경고를 표시하던 문제 수정.
- tmux/iTerm2 pane의 agent-team 팀원이 종료 요청을 확인한 뒤에도 가끔 열린 채로 남던 문제 수정.
- 키 없는 Console 로그인("Sign in with your Console account")이 조직의 서버 관리 설정을 적용하지 않던 문제, 그리고 그 로그인에서 `/status`가 Organization을 표시하지 않던 문제 수정.
- 렌더링 성능 개선 — 긴 대화에서 턴당 재렌더 작업이 줄었고, 응답이 길어져도 스트리밍이 느려지지 않으며, 백그라운드 에이전트 업데이트가 화면 전체를 다시 그리지 않는다.
- 키 입력당 렌더링 작업을 줄여 프롬프트 입력 반응성 개선.
- policy helper 진단 개선 — 갱신 실패가 `/status`에 표시되고, managed-settings 다이얼로그를 거부하면 Claude Code가 종료된 이유를 출력하며, helper 타임아웃은 타임아웃으로 보고된다.
- `/code-review --comment` 개선 — 대상이 지원되지 않는다고 보고하는 대신 `glab mr note`로 GitLab merge request에 findings를 게시한다.
- 알림 개선 — 다른 다이얼로그 아래에 대기 중인 MCP elicitation이나 권한 요청도 화면에 보이는 요청과 동일한 지연으로 idle 데스크톱 알림을 보낸다.
- verbose/트랜스크립트 출력 개선 — 함께 도착한 비동기 훅 완료 알림이 훅마다 한 줄이 아니라 한 줄로 묶여 표시된다.
- `claude self-hosted-runner --configure-git` 개선 — git push negotiation도 활성화해, 오래된 클론에서 새 브랜치를 처음 push할 때 전체 트리가 아니라 새 커밋만 업로드한다.
- 게이트웨이 keep-alive로 응답이 열려 있는 동안 SDK 호스트에 대한 liveness 보고 개선 — `CLAUDE_STREAM_IDLE_TIMEOUT_MS`를 올린 상태의 긴 대기가 멈춘 세션으로 오인되지 않는다.
- MCP 연결 및 OAuth 디버그/오류 로그 개선 — 서버 URL이나 요청 헤더에 담긴 자격증명이 가려진다.
- `/fork` 개선 — 새 백그라운드 세션에서 원래 대화의 prompt cache를 유지한다. worktree 브리핑이 시스템 프롬프트 변경이 아니라 메시지로 전달된다.
- 이모지 자동완성 개선 — 남아 있던 GitHub/Slack shortcode 별칭(`:satisfied:`, `:telephone:`, `:collision:`, …)을 인식한다.
- `--effort` 변경 — 새 모델의 기본 effort 고정을 영구가 아니라 해당 세션에서만 해제한다. Remote Control 세션에서 claude.ai로 고른 effort가 고정 기간 중에도 적용된다.
- MDM이나 `managed-settings.json`의 `policyHelper`가 실행 시점에 캐시된 서버 관리 설정에 가려졌을 때의 동작 변경 — 다음 실행이 아니라, 해당 설정이 제거됐다고 fetch가 보고하는 즉시 실행(또는 종료)된다.
- `managedSourcesBehavior: "merge"` 변경 — `sandbox.credentials.awsPairs`와 `sandbox.ripgrep`은 여러 소스의 값을 합치지 않고, 이를 설정한 가장 높은 관리 소스의 값을 통째로 가져온다.
- 게이트웨이 모델 발견(`CLAUDE_CODE_ENABLE_GATEWAY_MODEL_DISCOVERY=1`) 변경 — 게이트웨이에만 질의하므로 `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC`이 설정돼 있어도 실행된다.
- `claude --resume <session-id> --bg` 변경 — 해당 세션을 실행 중인 것이 없으면 조용히 복사본을 시작하지 않고 원래 ID로 이어간다. 복사본이 만들어지는 경우엔 이를 알린다.
- `/btw` 히스토리 탐색 키 변경 — `←`/`→`에서 `Shift+←`/`Shift+→`(또는 `[`/`]`)로. 최근 곁가지 질문들을 오가고 현재 답변으로 돌아온다.
- `.claude/settings.json`이나 `.claude/settings.local.json`의 `defaultMode: "bypassPermissions"` 변경 — `"auto"`와 마찬가지로 무시된다. user 또는 managed 설정에 지정하거나 `--permission-mode`를 쓴다.
- Claude apps gateway 세션의 `fable`과 `best` 변경 — Fable 5.1로 아직 구성되지 않은 게이트웨이가 이를 거부하므로 당분간 Fable 5로 계속 해석된다. 5.1을 쓰려면 `/model`에서 고른다.
- `--add-dir`, `/add-dir`, `additionalDirectories` 변경 — 네트워크 경로(UNC 공유, `/net/<host>` 자동마운트)는 접근하기 전에 메시지와 함께 거부한다. Windows에서는 매핑된 드라이브 문자를 쓴다.
- Claude apps gateway 로그인과 토큰 갱신 요청 변경 — 관리 설정 fetch가 이미 그렇게 하듯, 게이트웨이의 고정(pinned) TLS 인증서를 검증한다.
- Cowork 및 claude.ai 클라우드 세션 변경 — 본인 소유가 아닌 artifact를 읽을 때는 auto 모드에서도 항상 먼저 물어본다.
- Bash·PowerShell 권한 프롬프트의 Ctrl+E 명령 설명 제거.
- [VSCode] 세션 목록 패널에 접을 수 있는 ACCOUNT & USAGE, SESSION MANAGER 섹션 헤더 추가 — 계정 이메일, 사용량 미터, 사용량 다이얼로그를 여는 View details 링크 포함.
- [VSCode] 입력 푸터에 모델 pill 추가 — 현재 모델을 표시하고 클릭하면 모델 피커가 열린다. Effort 행과 "More models" 페이지 포함.
- [VSCode] 세션 목록의 Ungrouped 섹션에 접기 토글 추가.
- [VSCode] 커맨드 메뉴에 output style 선택 추가 — 커스텀 스타일 포함.
- [VSCode] 서드파티 프로바이더 배포(Bedrock, Vertex 등)에서 claude.ai 전용 기능(원격 세션, 받아쓰기, 사용량)이 여전히 표시되고 남은 로그인 정보로 claude.ai를 호출하던 문제 수정.
- [VSCode] 패널 로드 후 세션 목록의 사용량 미터가 비어 있던 문제 수정. 이제 마지막으로 알려진 사용량을 즉시 표시한다.
- [VSCode] "Enable Remote Control for all sessions" 토글 수정 — 켜고 끄는 것이 새 세션뿐 아니라 이미 열려 있는 세션에도 적용된다.
- [VSCode] 스크린리더 안내 수정 — 코드 펜스나 heading 앞의 제어 문자가 보이는 줄을 읽기에서 누락시키지 않고, heading을 가로지르는 굵게 표시 마커가 잘못 짝지어지지 않는다.
- [VSCode] 액션 메뉴 변경 — 슬래시 커맨드를 인라인이 아니라 필터 가능한 "Slash commands" 다이얼로그에 나열하고, 선택하면 실행된다. MCP 서버 다이얼로그에도 같은 필터 박스가 추가됐다.
- [VSCode] "Delete session"을 "Archive session"으로 변경 — 보관된 세션은 목록 하단의 접을 수 있는 "Archived sessions" 그룹으로 이동하며 Unarchive 액션을 제공한다.

---

## 🎯 챌린지

이번 버전에서 내 환경에 적용해볼 만한 항목입니다.

### 1. 서브에이전트 Opus 강제를 설정으로 못박기
- **파일**: `~/.claude/settings.json`
- **근거**: CLAUDE.md §5의 "모든 subagent는 Opus로 지정한다"는 지금 문서상의 규칙일 뿐이라 스킬·플러그인이 자기 에이전트 정의에 다른 모델을 박아두면 그대로 새어나간다. 이번에 추가된 `CLAUDE_CODE_SUBAGENT_MODEL_FORCE`가 spawn별·에이전트 정의별 오버라이드를 전부 무시하므로, `env` 블록에 `CLAUDE_CODE_SUBAGENT_MODEL`을 `opus`로 두고 `..._FORCE`를 켜면 규칙이 harness 레벨에서 강제된다. `/team-onboarding` 같은 외부 스킬에도 예외 없이 적용된다.
- **난이도**: ★☆☆ (약 5분)

### 2. `git push origin feat/*` 금지를 deny 규칙으로 이중 방어
- **파일**: `~/.claude/settings.json` (`permissions.deny`), 기존 `~/.claude/hooks/deploy-guard.sh`는 그대로 둠
- **근거**: 지금은 `deploy-guard.sh` hook 하나로만 작업 브랜치 push를 막고 있다. 이번 버전에서 `permissions.ask`/deny 규칙이 compound command와 subshell 안에서 건너뛰어지던 버그, 그리고 zsh가 다르게 파싱하는 `[[ ]]` 조건문이 자동 승인되던 버그가 함께 고쳐졌다. 즉 이제 `git push ... && ...` 같은 복합 명령에서도 권한 규칙을 신뢰할 수 있으므로, `Bash(git push origin feat/*)`·`Bash(git push origin fix/*)` deny를 추가해 hook 우회 경로를 한 겹 더 막는다. 2026-07-08 `feat/serverbuff-uid` 사고의 재발 방지책이다.
- **난이도**: ★★☆ (약 15분 — 규칙 추가 후 실제 명령으로 차단 확인까지)

### 3. 시간 표기를 한국 시간·24시간제로 고정
- **파일**: `~/.claude/settings.json`
- **근거**: 회고·보고서·문서 작성일을 자주 기록하는데 지금은 턴 종료 시각과 트랜스크립트 타임스탬프의 형식·시간대가 환경 기본값에 맡겨져 있다. 새로 추가된 `timeFormat`을 `24h`, `timeZone`을 `Asia/Seoul`로 지정하면 표기가 고정돼 로그를 나중에 볼 때 시차를 되짚을 필요가 없다.
- **난이도**: ★☆☆ (약 5분)

### 4. 작업 디렉토리 밖 파일 읽기 차단 켜기
- **파일**: `~/.claude/settings.json` (`permissions.blockReadsOutsideWorkingDirectories`)
- **근거**: EOS-H5·NeckGuard·agent-infra·Poplus 등 여러 저장소를 오가며 작업하고, CLAUDE.md §6은 배포 전 "개인 문서 포함" 여부를 직접 확인하라고 정하고 있다. 이번에 추가된 이 설정을 켜면 auto 모드에서 작업 디렉토리 밖 파일을 읽으려 할 때 애초에 차단되므로, `~/Documents` 같은 영역이 대화에 딸려 들어오는 경로가 사라진다. 여러 프로젝트를 한 세션에서 봐야 할 때는 `/add-dir`로 명시적으로 추가하면 된다 — 이번 버전에서 현재 작업 디렉토리 하위를 거부하던 `/add-dir` 버그도 함께 고쳐졌다.
- **난이도**: ★★☆ (약 10분 — 켠 뒤 실제 다중 저장소 작업으로 마찰 정도 확인)
