# Claude Code v2.1.328

> 작성일: 2026-11-20

---

# 📋 요약본

## 🎉 신기능 (8건)
- **서드파티 플랫폼에서 Opus 4.6·Sonnet 4.6 auto mode 지원** — Amazon Bedrock, Google Cloud Agent Platform, Microsoft Foundry, Claude apps gateway에서 auto mode를 쓸 수 있다. 권한 모드를 지정하지 않은 대화형 세션은 auto mode로 시작한다.
- **`mcp_tool` hook에 `"onFailure": "block"` 추가** — command·HTTP hook과 같은 방식이다. hook 호출이 실패하면 동작을 막는다.
- **세션 간 메시지 보류 경고** — 권한 확인을 건너뛰는 세션에서 보낸 메시지는 클라우드 세션이 보류하거나 버릴 수 있다. 이때 경고를 띄운다. VSCode에서도 보류 알림과 허용 설정 파일 링크를 보여준다.
- **OpenTelemetry endpoint 누락 알림** — exporter에 endpoint가 없어 데이터를 잃을 수 있으면 `/status`와 `claude doctor`가 알려준다.
- **`CLAUDE_CODE_DISABLE_DEFERRED_TOOL_RESUME` 환경변수** — hook이 미뤄둔 tool 호출을 `claude -p --resume`·`--continue`가 실행하지 못하게 막는다.
- **관리 정책 관련 옵션** — Claude Code를 내장한 앱에서 policy plugin의 `allowManagedModsOnly`를 켤 수 있다. 관리자 managed settings가 우선한다. `maxEffortLevel` 값이 잘못되면 gateway가 시작할 때 경고한다.
- **Self-hosted runner 옵션 추가** — `--repository-folder`, `--hook-label`, `claude --environment`의 `--metadata key=value`를 추가했다. settings.json의 기본 권한 모드를 세션이 무시하는 경우 시작 시 경고한다.
- **Self-hosted orchestrator 지표 2종** — 대기 사유별 큐 대기 시간과, 원인별 runner 시작 포기 횟수를 집계한다.

## 🛠️ 개선/수정 (14건)
- **zsh Bash 명령 `=` 오류 수정** — `echo ====`, `[ a == b ]`처럼 `=`로 시작하는 단어에서 "not found"로 멈추던 문제를 고쳤다.
- **자동 compaction 시스템 프롬프트 재구성** — 자동 요약(compaction)도 `/compact`처럼 시스템 프롬프트를 새로 만든다.
- **`/code-review` 역할 축소·등급 표시** — 버그와 CLAUDE.md 위반만 보고한다. 지적마다 Important / Pre-existing / Nit 등급을 붙이고, 요약 끝에 수정 제안을 넣는다. 재사용·단순화·효율 정리는 `/simplify`가 맡는다.
- **Code Mode 대량 수정** — 스크립트 중단, 변수 `undefined`, `{`로 시작하는 스크립트 거부 등 10여 건을 고쳤다. auto·bypass 모드에서 0.75초 대기를 없앴고, 실행 중인 명령과 출력을 보여준다.
- **입력·터미널 안정성** — 권한 프롬프트에서 Esc가 사라지던 문제, 붙여넣기가 끊기던 문제, Cmd·Alt 키 입력, Konsole·GNOME Terminal·GNU screen 관련 문제를 고쳤다.
- **Linux 클립보드** — Ctrl+Z로 멈춘 동안 다른 앱의 붙여넣기가 멈추던 문제와 Ctrl+V 이미지 오류를 고쳤다.
- **예약 작업 파일 보호** — 파일을 읽지 못할 때 다른 예약 작업이 지워지던 문제, 오타가 있는 작업이 삭제되던 문제를 고쳤다.
- **토큰 카운트 정확도** — 재시도한 응답을 두 번 세던 문제, 생각하는 동안 숫자가 멈추던 문제를 고쳤다.
- **서드파티 provider 안정성** — `anyOf`·`oneOf`·`allOf` 스키마의 MCP tool이 사라지던 문제, "Prompt is too long"으로 세션이 끝나던 문제, `CLAUDE_STREAM_IDLE_TIMEOUT_MS`가 적용되지 않던 문제를 고쳤다.
- **Remote Control·클라우드 세션** — 권한 프롬프트 유실, 되감기 후 `/clear` 하면 지운 대화가 복원되던 문제, 세션 간 메시지가 닿지 않던 문제를 고쳤다.
- **슬래시 명령 UI 수정** — `/plugin`, `/hooks`, `/export`, `/bug`, `/goal`, `/usage`, `/login`, `/exit`, `/terminal-setup`, `/install-github-app`의 오동작을 고쳤다. `/bug`는 보내기 전에 Yes/No를 묻는다.
- **hook 동작 변경** — Code Mode는 스크립트 출력에 UserPromptSubmit hook을 더 이상 실행하지 않는다. managed `PostToolUse`는 실행 전에 거부된 호출에는 발동하지 않는다.
- **subagent 대기 정책** — `CLAUDE_CODE_FORK_SUBAGENT=0`이면 subagent가 자기 하위 subagent를 기다린다. `claude -p`의 대기 상한은 10분이다.
- **Self-hosted runner 안정성** — 프록시 응답 오인, 임시 디스크 오류 시 데이터 삭제, 토큰 만료, git 인증 등 십수 건을 고쳤다.

## 🔑 이번 버전의 핵심 키워드
**"서드파티 auto mode 확대 + Code Mode·runner 안정화"** — Opus 4.6·Sonnet 4.6의 auto mode를 클라우드 플랫폼으로 넓혔다. 많은 수정이 Code Mode와 self-hosted runner의 경계 상황 오류를 다룬다.

---

# 📜 원문 (한글 번역본)

> 원문 ChangeLog를 원래 순서 그대로 한 줄도 빠짐없이 번역한 문서입니다.

- Amazon Bedrock, Google Cloud Agent Platform, Microsoft Foundry, Claude apps gateway에서 Claude Opus 4.6·Sonnet 4.6용 auto mode 추가. 권한 모드 없이 시작한 대화형 세션은 auto mode로 시작한다
- command·HTTP hook처럼 `mcp_tool` hook에도 `"onFailure": "block"` 추가. 호출이 실패한 hook은 동작을 막는다
- 권한 확인을 건너뛰는 세션의 메시지를 클라우드 세션이 보류했다가 버릴 수 있을 때 경고 추가
- OpenTelemetry exporter에 endpoint가 없어 데이터를 잃을 가능성이 높을 때 `/status`와 `claude doctor`에 알림 추가
- `CLAUDE_CODE_DISABLE_DEFERRED_TOOL_RESUME` 추가. host가 `claude -p --resume`·`--continue`에서 hook이 미뤄둔 tool 호출을 실행하지 못하게 막을 수 있다
- Claude Code를 내장한 앱이 policy plugin의 `allowManagedModsOnly` 옵션을 켤 수 있게 지원 추가. 관리자 managed settings가 여전히 우선한다
- 정책의 `maxEffortLevel`이 유효한 effort 단계가 아닐 때 Claude apps gateway에 시작 경고 추가
- Self-hosted runner: `--capacity 1`에서 base 폴더 아래 경로 대신 세션이 레포에 쓸 폴더를 지정하는 `--repository-folder` 추가. symbolic link일 수 없다
- Self-hosted runner: host의 settings.json이 세션이 무시하는 기본 권한 모드를 지정하면 시작 경고 추가
- Self-hosted runner: `claude self-hosted-runner orchestrator`에 `--hook-label` 추가. 고른 세션 라벨을 `spawn-runner` hook에 넘긴다
- Self-hosted runner: `claude --environment`에 `--metadata key=value` 추가. `spawn-runner` hook용으로 세션에 라벨을 붙인다
- Self-hosted runner: orchestrator `/metrics`에 `claude_code_self_hosted_orchestrator_session_queue_wait_by_reason_seconds` 추가. 다시 열린 세션의 대기를 새 세션의 대기와 구분할 수 있다
- Self-hosted runner: Anthropic이 세션용 runner 시작을 포기한 횟수를 원인별로 세는 orchestrator 지표 `claude_code_self_hosted_orchestrator_sessions_given_up_total` 추가
- zsh의 Bash 명령이 `echo ====`, `[ a == b ]`처럼 `=`로 시작하는 단어에서 "not found" 오류로 멈추던 문제 수정. `=cmd`는 더 이상 명령 경로로 확장되지 않는다
- 자동 compaction이 `/compact`처럼 시스템 프롬프트를 다시 만들지 않고 세션의 이전 시스템 프롬프트를 재사용하던 문제 수정
- 매우 길거나 형식이 깨진 입력에서 markdown 렌더링이 멈추던 문제 수정
- 드물게 화면이 멈추던 문제 수정
- 권한 프롬프트나 질문 직후 바로 입력하면 Esc가 자주 사라지던 문제 수정. Alt를 Esc+키로 보내는 터미널에서는 쓰이지 않는 Alt·Option 키가 거기서 거절로 동작한다
- 느린 연결에서 붙여넣기나 터미널 응답이 둘로 끊겨 프롬프트에 입력되던 문제 수정
- 서드파티 provider 또는 telemetry·feature flag가 꺼진 환경에서 예약 작업 파일을 읽지 못할 때, 예약 작업을 저장하면 프로젝트의 다른 저장된 작업이 지워지던 문제 수정
- 프로젝트 예약 작업 파일에 오타가 있는 예약 작업이 다음 저장 때 삭제되던 문제 수정
- 메시지가 늦게 저장되면 재개한 클라우드 세션이 compaction 요약이나 최근 메시지를 잃을 수 있던 문제 수정
- spinner와 subagent의 토큰 카운트가 재시도한 응답을 두 번 세고, 스트리밍되지 않은 응답을 빠뜨리고, Claude가 생각하는 동안 멈춰 있던 문제 수정
- 응답 중 사용 크레딧이 떨어졌을 때 rate limit이라고 표시하던 오류 메시지 수정
- gateway가 beta를 거부하는 환경에서 `CLAUDE_CODE_DISABLE_EXPERIMENTAL_BETAS`를 켜면 Claude Desktop 밖의 auto mode가 Bedrock, Agent Platform, Foundry, Claude apps gateway에서 매 턴 실패하던 문제 수정
- `CLAUDE_STREAM_IDLE_TIMEOUT_MS`가 gateway, custom base URL, 클라우드 provider에서 5분 연결 제한을 늘리지 못하던 문제 수정
- 서드파티 provider의 일부 Claude Desktop 세션(예약 작업 제외)이 큰 tool 결과 뒤 "Prompt is too long"으로 영구 종료되던 문제 수정. 가장 큰 결과는 이제 빠진다
- 서드파티 provider 또는 telemetry·feature flag가 꺼진 환경에서 입력 스키마가 `anyOf`, `oneOf`, `allOf`로 시작하는 MCP tool이 사라지던 문제 수정
- 서드파티 provider 또는 telemetry·feature flag가 꺼진 환경에서 입력 스키마가 잘못된 MCP tool 때문에 요청이 실패하던 문제 수정. 해당 tool은 빠지고 Claude가 그 이유를 전달받는다
- Bedrock, Google Cloud Agent Platform, Foundry가 진행 요약의 effort 설정을 거부하면 세션 동안 subagent 모델의 effort가 꺼지던 문제 수정 (2.1.327 회귀)
- auto·bypass 모드 밖에서 권한 프롬프트, plan 승인, 질문이 10분간 열려 있으면 Code Mode가 스크립트를 멈추던 문제 수정
- auto·bypass-permissions 모드에서 Code Mode 스크립트가, 이전 스크립트 실행 중 연결된 MCP 서버를 호출하지 못하던 문제 수정
- `claude --resume` picker로 고른 세션에서 auto·bypass permissions 모드인데도 Code Mode 스크립트가 백그라운드로 실행되지 않던 문제 수정
- 한 응답에서 스크립트 여러 개를 실행한 세션을 재개할 때 Code Mode가 로드한 skill, hook context, 권한 승인과 함께 입력한 메모를 잃던 문제 수정
- picker로 재개하거나 권한을 묻는 모드에서 재개했을 때 Code Mode 스크립트가 중간에 끊겼다는 사실을 Claude가 전달받지 못하던 문제 수정
- 이전에 실패한 스크립트가 설정하지 못한 최상위 변수를 Code Mode가 조용히 `undefined`로 쓰던 문제 수정
- 실패한 명령의 긴 출력이 잘렸을 때 Code Mode 스크립트가 이를 전달받지 못하던 문제 수정
- `{` 블록으로 시작하는 유효한 스크립트를 Code Mode가 거부하던 문제 수정
- 최상위 `await`와 최상위 `return`을 함께 쓰는 스크립트를 Code Mode가 거부하던 문제 수정
- 스크립트가 읽거나 쓴 뒤 Code Mode에서 @-mention한 작은 파일이 첨부되지 않던 문제 수정
- 호출할 수 없는 읽기 전용 subagent에 Code Mode가 `write()`·`edit()`를 제공하던 문제 수정
- Code Mode에서 Esc 뒤에 `/model` 같은 명령을 입력하면 Claude가 스스로 턴을 시작하던 문제 수정
- Code Mode에서 Claude가 사용자가 요청할 때만 workflow를 실행하라는 안내와 `/config`에서 정한 workflow 크기를 전달받지 못하던 문제 수정
- Remote Control이 같은 연결 끊김 메시지를 반복하고, 재연결할 수 없는 세션을 다시 시도하라고 안내하던 문제 수정
- 서비스가 느릴 때 원격 세션이 재시작되면 대기 중인 권한 프롬프트가 사라지고 그 응답이 무시되던 문제 수정
- 되감기 후 `/clear` 하면 클라우드 세션이 지운 대화를 재개하던 문제 수정
- 끊긴 모델 스트림을 재시도한 뒤 runner나 worker를 잃으면 원격 세션이 그 턴의 tool 호출과 결과를 잃던 문제 수정
- Remote Control이 켜진 세션에서, 막 시작했거나 제목에 @가 있는 클라우드·Remote Control 세션에 세션 간 메시지를 보낼 수 없던 문제 수정
- Claude가 클라우드 세션은 절대 답할 수 없다고 안내받던 문제 수정. 이제 언제 답이 올 수 있는지와 결과를 얻는 다른 방법을 안내받는다
- 명령이 다른 레포로 이동한 뒤 `/diff`, Remote Control 세션의 Changes 창, 편집 옆 diff가 커밋된 작업을 빠뜨리던 문제 수정
- IDE 확장이나 다른 SDK 앱이 실행하는 세션을 workflow의 마지막 진행 후 1시간 넘게 지나 열면 Remote Control이 실행 중인 workflow의 agent를 보여주지 않던 문제 수정
- Remote Control: Remote Control을 켠 뒤 유휴 상태인 Desktop·VS Code 세션이 실행 중으로 표시되던 문제 수정
- SDK interrupt가 백그라운드 agent를 멈춘 뒤에도 모델이 아직 실행 중이라고 말하던 문제 수정
- 데스크톱 앱과 SDK host의 Send now가, 멈춘 웹 검색이 결과를 찾지 못했다고 Claude에게 전하던 문제 수정
- Cmd를 보고하는 터미널에서 Cmd+문자가 프롬프트에 입력되던 문제 수정
- 전체화면 모드에서 GNOME Terminal의 Ctrl+클릭이 링크를 두 번 열고, 마우스 측면 버튼이 클릭으로 동작하고, 잠시 멈춘 뒤 반대 방향 휠 첫 칸이 무시되던 문제 수정
- tmux·ssh 밖 Konsole의 Shift+Enter, kitty keyboard protocol을 쓰는 터미널에서 비라틴 키보드 배열의 Alt 단축키 문제 수정
- Linux: `xclip`이나 `wl-copy`가 설치된 경우 Claude Code를 Ctrl+Z로 멈춘 동안 다른 앱의 붙여넣기가 멈추던 문제 수정
- Linux: Ctrl+V가 클립보드 이미지를 놓치거나, 예전 이미지를 붙이거나, 멈추던 문제 수정
- 전체화면 모드에서 복사한 텍스트에 인용 막대가 포함되고, 위로 드래그 스크롤할 때 줄바꿈 위치의 공백이 사라지고, "Jump to bottom" 버튼 아래 단어가 빠지던 문제 수정
- `!` 명령에 붙여넣은 이미지 경로가 첨부 파일로 바뀌던 문제 수정
- `?` 단축키 목록이 열려 있을 때 Ctrl+C 종료 경고가 표시되지 않던 문제 수정
- 키가 동시에 들어올 때 전체화면 모드의 Ctrl+R 검색과 `/theme` 색 편집기가 엉뚱한 행을 고르고, 그곳과 `/config`·`/plugin` 검색에서 키가 누락되던 문제 수정
- GNU screen 안에서 색이 틀리거나 빠지던 문제 수정
- 전체화면 모드에서 다수의 백그라운드 알림이 열린 대화상자의 위쪽 테두리를 침범하던 문제 수정
- 백그라운드 agent에 보낸 메시지에서 붙여넣은 이미지 대신 긴 파일 경로가 표시되던 문제 수정
- 문구가 같을 때 `/goal`이 skill의 Stop hook을 제거하거나 다른 hook 결과로 일찍 끝나던 문제 수정
- 보고서를 보낸 뒤 `/bug`가 취소됐다고 표시하던 문제 수정
- Pro·Max 사용자에게 Esc로 transcript 공유 질문이 닫히지 않던 문제 수정
- 뒤로 갈 때 `/hooks`가 위치를 잃던 문제 수정
- 이름을 비워두면 `/export`가 `.txt`라는 파일을 만들던 문제 수정
- Zed에서 `/terminal-setup`이 symlink된 `keymap.json`을 일반 파일로 바꾸던 문제 수정
- 기존 workflow 파일 업데이트를 요청했는데 `/install-github-app`이 code review workflow를 추가하던 문제 수정
- 뒤로 간 뒤 느린 저장·제거가 끝나면 `/plugin`이 skill을 다시 열거나 열린 페이지를 닫던 문제 수정
- 변경이 진행 중인 plugin에서 나간 뒤 `/plugin`이 엉뚱한 plugin 제거를 묻거나 Esc를 무시하던 문제 수정
- 결과 없는 검색 후나 탭 행 클릭 후 `/plugin` Installed 탭에서 입력과 방향키가 동작하지 않던 문제 수정
- `/plugin`에서 Enter를 누르고 있으면 설치된 plugin 여러 개가 꺼지던 문제 수정
- 1M context 모델에서 `/usage` plugin 합계가 2,000 토큰에서 멈추던 문제, 모델을 고르지 않았을 때 `/usage`·`/plugin`의 토큰 추정치가 낮던 문제 수정
- Bedrock access key 단계에서 Esc가 뒤로 가지 않고 `/login`을 닫던 문제 수정
- `/exit`와 Ctrl+D가 실행 중인 작업을 다르게 설명하고, `/exit`가 이미 멈춘 workflow를 경고하던 문제 수정
- 공유 폴더의 artifact를 읽거나 다른 조직 폴더에 게시한 뒤 Claude가 artifact를 비공개라고 하고, 폴더 구성원도 열 수 있는데 지정한 사람만 열 수 있다고 말하던 문제 수정
- plugin의 toast가 가끔 다른 plugin의 문구를 표시하던 문제 수정
- 턴 시작 직후 저장한 mod가 턴이 끝날 때가 아니라 턴 도중에 다시 로드되던 문제 수정
- `OTEL_RESOURCE_ATTRIBUTES` 항목 하나가 잘못되면 metric point, event, span에서 나머지 라벨까지 빠지던 문제 수정. 이제 그 항목만 빠진다
- 너무 커서 거부된 요청 뒤 compaction 중 agent hook이 timeout을 넘겨 실행되던 문제 수정
- `FORCE_COLOR`가 음수일 때 시작 시 crash 수정
- 메모리가 거의 바닥났을 때 secret masking에서 나던 crash 수정
- 브랜치 이름이 유효한 UTF-8이 아니면 Linux Bash sandbox가 명령마다 `.git/HEAD` 이름을 바꾸던 문제 수정
- Self-hosted runner: 프록시나 웹 필터가 poll에 HTTP 200과 `{}` 같은 본문으로 응답하면 실행 중인 세션이 모두 멈추던 문제 수정. 이제 그런 poll을 재시도한다
- Self-hosted runner: 일시적인 디스크 오류 뒤 보관 clone의 object·ref와 그곳에만 있던 커밋을 삭제하던 문제 수정. 이제 그 시작이 실패한다
- 시계가 느리거나 뒤로 맞춰진 host에서 토큰 만료 시 self-hosted runner가 멈추던 문제 수정
- Self-hosted runner: 세션 안의 스크립트나 hook이 `claude`를 다시 실행하면 Anthropic-managed git 세션이 GitHub git 접근을 잃던 문제 수정
- 머신의 git config가 `http.proactiveAuth`를 설정하면 Anthropic-managed git을 쓰는 self-hosted runner가 fetch·push하지 못하던 문제 수정
- Self-hosted runner: 등록 후 setup이 실패하면 runner가 서버에 알리지 않고 종료되던 문제 수정. 이제 사유와 함께 등록을 해제하고, on-demand runner는 시작 실패를 보고한다
- Self-hosted runner: `--capacity` 1 초과에서 다른 세션이 같은 레포를 준비하는 동안 기다리는 세션의 보관·재대기열 처리가 적용되지 않던 문제 수정
- Self-hosted runner: `--trust-workspace false`에서 `.claude.json`이 손상된 세션이 이후 시작마다 실패하던 문제 수정. 이제 기본값으로 시작하고, 거기서 꺼진 MCP 서버는 다시 꺼진 채로 둔다
- Self-hosted runner: checkout hook이나 git이 출력을 많이 내면 실패한 시작 메시지에서 무엇이 실패했는지 말하는 부분이 사라지던 문제 수정
- 디스크가 몇 초 멈추면 self-hosted runner가 post-session hook을 건너뛰던 문제 수정. 죽은 디스크에서는 세션 종료가 기본 25초 더 걸릴 수 있다
- Self-hosted runner: 새 Claude config 디렉터리에서 재개한 세션이 더 이상 task 목록을 잃지 않는다
- Self-hosted 세션이 레포 하나 없이 시작될 때 Claude가 그 사실과 이유를 전달받지 못하던 문제 수정
- Self-hosted runner: `claude --environment`의 `--correlation-id`가 `spawn-runner` hook에 전달되지 않던 문제 수정
- Self-hosted runner setup wizard의 키 교체 안내 수정. 이제 키를 폐기하면 그 키로 실행 중인 세션이 멈춘다고 경고한다
- `claude -p`와 SDK 세션이 자체 git 레포를 가진 managed-settings plugin을 백그라운드에서 받아 다음 세션에 쓰도록 개선
- 새 머신에서 `claude -p`, SDK, Claude Desktop 세션이 git marketplace의 managed-settings plugin을 더 빨리 로드하도록 개선. 짧은 실행은 최대 30초 늦게 끝날 수 있다
- 큰 세션의 재개 시간 개선
- 이미지가 많은 세션을 재개할 때 메모리 사용량 개선
- 느린 명령이나 tool을 실행하는 긴 SDK·데스크톱 세션의 메모리 사용량과 응답 시간 개선
- auto·bypass-permissions 모드에서 대부분의 스크립트 뒤 0.75초 대기를 없애 Code Mode 속도 개선
- MCP 서버가 있는 새 Code Mode 세션의 prompt caching 개선. 서버가 아직 연결 중일 때와 서버 목록이 바뀔 때 Claude가 안내받는다
- tool 설명을 줄여 Code Mode의 토큰 사용량 개선
- Code Mode가 스크립트가 실행 중인 명령과 그 출력을 실행 중에 보여주도록 개선
- Code Mode 편집 개선: 아무것도 바꾸지 않는 편집이 더 이상 스크립트를 멈추지 않고, 실패한 편집이 어디와 일치하거나 가장 가까운지 Claude가 안내받는다
- Code Mode 개선: 스크립트가 실패했을 때 아직 실행 중이던 tool 호출을 Claude가 안내받는다
- Code Mode의 auto·bypass 모드에서 Claude가 dev 서버를 시작하는 방식 개선: `/tasks`에 보이는 백그라운드 task로 실행하라고 안내받는다
- Windows: 스크립트의 shell 명령은 Git Bash에서 실행되고 같은 이름의 함수 대신 PowerShell alias가 실행된다고 Claude에게 알려 Code Mode 개선
- in-process teammate 여러 개를 동시에 시작할 때 개선: "Lock file is already being held"로 실패하는 경우가 크게 줄었다
- computer use 승인 대화상자 개선: 앱별 접근 수준과 더 쉬운 경고를 보여준다
- 세션 간 메시지 개선: 클라우드 세션이나 다른 컴퓨터가 목록에 없으면 Remote Control이 꺼져 있다고 Claude가 설명한다
- 다른 세션의 메시지가 보류되거나 버려지면 `claude -p` 텍스트 출력이 stderr에 그 사실과 허용 방법을 알리도록 개선
- Claude가 게시한 artifact를 누가 열 수 있는지 답변 개선: 마지막 게시 때의 답을 반복하지 말고 artifact를 다시 확인하라고 안내받는다
- 재개한 self-hosted runner 세션 개선: Claude가 이전 작업이 남아 있는지 확인하고 빠진 것을 말한다
- 서드파티 provider의 Opus 4.6·Sonnet 4.6에서도 최신 모델처럼 plan mode와 Bash 프롬프트가 auto mode를 쓰고 제안하도록 변경. `disableAutoMode`로 둘 다 끈다
- Code Mode가 스크립트 출력에 managed를 포함한 UserPromptSubmit hook을 더 이상 실행하지 않도록 변경. 출력을 가리려면 `updatedToolOutput`을 쓰는 PostToolUse hook을 사용한다
- 대부분의 모델에서 `/code-review`가 버그와 CLAUDE.md 위반만 보고하도록 변경. 재사용·단순화·효율 정리는 `/simplify`를 실행한다
- 대부분의 모델에서 `/code-review`가 지적마다 Important, Pre-existing, Nit 표시를 붙이고, 요약마다 수정 제안으로 끝나도록 변경. 문제가 없으면 "Code review found no issues."라고 표시한다
- `claude.ai <name>` 형식의 `deniedMcpServers` 항목이 클라우드·self-hosted runner 세션의 해당 connector에도 적용되도록 변경
- managed `PostToolUse` hook이 실행 전에 거부된 호출에는 더 이상 발동하지 않도록 변경: 로그 기록, 재작성, 차단, 중지 모두 없다. `PostToolBatch`는 대부분을 받지만 거부 표시는 없다
- `/bug`가 보내기 전에 Yes/No를 묻도록 변경. Enter를 반복해도 보고서가 전송되거나 GitHub이 열리지 않는다
- `CLAUDE_CODE_FORK_SUBAGENT=0`이면 `claude -p`, Agent SDK, 데스크톱, VS Code의 subagent가 기본적으로 자기 subagent를 기다리도록 변경
- `CLAUDE_CODE_FORK_SUBAGENT=0`이면 `claude -p`가 백그라운드 subagent와 그것이 기다리는 subagent를 하나의 10분 대기로 계산하도록 변경. 더 긴 체인은 `CLAUDE_CODE_PRINT_BG_WAIT_CEILING_MS`를 늘린다
- PermissionRequest hook이 sandbox 제외 명령으로 재작성한 shell 명령은 sandbox 밖에서 실행되도록 변경
- Claude in Chrome 환영 화면과 `/chrome`이, 권한 모드나 `/permissions`의 규칙이 답하지 않는 한 Claude가 사이트에서 행동하기 전에 Claude Code가 묻는다고 안내하도록 변경
- 서드파티 provider 또는 telemetry·feature flag가 꺼진 환경의 Claude Desktop·Agent SDK 세션이 질문이 열린 채 닫히면 답 없이 계속하지 않고 턴을 끝내도록 변경
- 서드파티 provider 또는 telemetry·feature flag가 꺼진 환경에서 붙여넣은 텍스트를 Claude에게 붙여넣은 것으로 표시하도록 변경
- Anthropic API 터미널 세션의 subagent 진행 요약을 telemetry가 꺼져 있어도 기본 소형 고속 모델이 짧은 메모로 작성하도록 변경. 토큰을 훨씬 적게 쓴다
- `sandbox.failIfUnavailable`이 설정되지 않았을 때 sandbox가 시작하지 못하는 경우의 보고 방식 변경: 다음 sandbox Bash 명령이 거부되고 세션 동안 sandbox가 꺼졌다고 알린다
- `/list-agents`가 목록을 사용자에게만 보여주도록 변경. Claude는 필요할 때 직접 세션 목록을 조회한다
- Self-hosted runner: 설정이 Claude의 GitHub tool을 이름으로 막는 환경에서는 내장 `gh api`가 기본으로 꺼지도록 변경. `--use-anthropic-gh true`로 켠다
- Self-hosted runner: wrapper 스크립트가 세션 자체의 `claude`가 뜨기 전이나 끝난 뒤 실행하는 `claude`에는 Anthropic-managed git이 없도록 변경
- Self-hosted runner: `CLAUDE_RUNNER_SESSION_UUID`와 `CLAUDE_CODE_REMOTE_SESSION_UUID`가 세션과 그 `checkout`, `post-session`, `spawn-runner` hook에 모두 설정되도록 변경
- `--capacity 1`의 self-hosted runner가 push 대상 레포 경로가 symbolic link이면 세션을 더 일찍 거부하도록 변경
- [VSCode] 다른 세션의 메시지가 보류되면 알림과 함께 이를 허용할 수 있는 설정 파일 링크 추가
- [VSCode] 패널이 낮거나 명령·URL·설명이 길 때 권한 프롬프트의 No 버튼, 응답 칸, 제목이 잘리던 문제 수정
- [VSCode] 실패하거나 차단된 tool 호출의 사유가 표시되지 않거나 잘리던 문제, Glob·Grep이 오류를 결과 수로 세던 문제 수정

---

## 🎯 챌린지

이번 버전에서 내 환경에 적용해볼 만한 항목입니다.

### 1. deploy-guard hook이 실패하면 push 차단
- **파일**: `~/.claude/settings.json`
- **근거**: 이번 버전은 `"onFailure": "block"`을 `mcp_tool` hook까지 넓혔고, command hook에는 이미 같은 옵션이 있다고 밝혔다. 지금 `deploy-guard.sh`는 스크립트 자체가 죽으면(문법 오류, 권한 문제 등) 검사 없이 통과될 수 있다. PreToolUse의 해당 hook 객체에 `"onFailure": "block"`을 추가하면 가드가 고장 났을 때 `feat/*` push가 그냥 나가지 않는다.
- **난이도**: ★☆☆ (약 5분)

### 2. CLAUDE.md §7 Review 항목에 `/simplify` 역할 나누기
- **파일**: `~/.claude/CLAUDE.md`
- **근거**: `/code-review`가 이제 버그와 CLAUDE.md 위반만 본다. 정리 작업(재사용·단순화·효율)은 `/simplify`로 넘어갔다. §7 "Review" 줄은 `/code-review`만 적고 있어 품질 정리가 빠질 수 있다. "치명 등급: `/code-review`(버그) / 정리 필요 시: `/simplify`"로 둘을 나눠 적는다.
- **난이도**: ★☆☆ (약 5분)

### 3. `/code-review` 등급별 처리 기준 명시
- **파일**: `~/.claude/CLAUDE.md` (§7.1 검증 등급)
- **근거**: 리뷰 결과에 Important / Pre-existing / Nit 표시가 붙는다. §7.1에 "Important는 반드시 수정, Pre-existing은 보고만, Nit는 생략" 규칙을 한 줄 넣는다. §3 Surgical Changes 원칙에 맞게 지금 바꾼 범위 밖 코드를 건드리지 않게 하고, 검증이 반복되는 시간도 줄인다.
- **난이도**: ★☆☆ (약 10분)
