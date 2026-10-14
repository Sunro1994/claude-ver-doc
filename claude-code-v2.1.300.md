# Claude Code v2.1.300

> 작성일: 2026-10-15

---

# 📋 요약본

## 🎉 신기능 (12건)
- **mod 프롬프트 `virtualText`** — 입력창 안에 글자를 띄우는 기능. 이 글자는 작성 중인 내용(draft)에도, 전송되는 프롬프트에도 들어가지 않는다.
- **OpenTelemetry 캐시 쓰기 구분** — `api_request` 이벤트에 `cache_creation_5m_tokens`·`cache_creation_1h_tokens`가 추가됐다. 캐시 쓰기를 유지 시간(5분/1시간)별로 따로 집계한다.
- **mod `$.ui.view({ agentId })`** — 요청하면 메인 화면에 특정 에이전트의 대화 기록을 보여준다. `$.ui.view({})`를 호출하면 원래 화면으로 돌아간다.
- **mod `Text`의 `dir` prop** — 오른쪽에서 왼쪽으로 쓰는 글자(RTL)를 지원한다. Windows와 VS Code 터미널에서 줄이 그 방향으로 읽히고 오른쪽 끝에 붙는다.
- **Claude Platform on AWS의 `/advisor`** — 기본으로는 advisor가 돌지 않는다. `/advisor`, `advisorModel`, `--advisor` 중 하나로 골라야 켜진다.
  - `CLAUDE_CODE_DISABLE_ADVISOR_TOOL=1`이면 완전히 꺼진다.
- **OpenTelemetry GenAI 표준 속성** — trace span에 `gen_ai.provider.name`, `gen_ai.conversation.id`, `gen_ai.tool.name`, `error.type` 등 업계 표준 이름의 속성이 붙는다.
- **`agent.spawn` hook의 workflow 에이전트 수정** — 이전에는 workflow 에이전트를 거부만 할 수 있었다. 이제 `prompt`와 `model`을 바꿔 쓸 수 있다.
- **`prompt.change` mod hook** — 사람이 직접 타이핑하지 않았는데 입력창 글자가 바뀔 때 발생한다. 대상은 히스토리 불러오기, 지우기, 실행 취소(undo), 플러그인 자동 채우기다.
- **[VSCode] `claudeCode.attachSelection`** — 에디터에서 선택한 텍스트가 메시지에 자동으로 붙지 않게 막는 설정이다.
- **[Claude Tag] Slack Connect 채널 지원** — Owner나 Claude Tag 관리자가 허용하면, 다른 조직과 공유한 채널에서도 Claude가 답한다. 기본값은 꺼짐이다.
- **[Claude Tag] Allow once / Deny 카드** — 승인이 필요한 커넥터 작업을 거절하지 않고, Slack 스레드에 나에게만 보이는 승인 카드를 띄워 묻는다. 다른 사람에게는 "승인 대기 중"으로만 보인다.
- **[Claude Tag] Slack 음성 클립** — Slack이 만든 받아쓰기(transcript)가 있으면 Claude가 그 내용을 읽는다.

## 🛠️ 개선/수정 (16건)
- **hook `updatedInput` 검증 강화** — PreToolUse·PermissionRequest hook이 돌려준 `updatedInput`을 Claude가 직접 만든 입력과 똑같이 검사한다. 모르는 키는 버리고, 도구가 거부하는 입력이면 호출 자체를 막는다.
- **SessionEnd hook 누락 수정** — 백그라운드 명령이 돌고 있을 때 종료하면 SessionEnd hook이 실행되지 않던 문제를 고쳤다.
- **종료 시 백그라운드 명령 강제 종료** — 멈추라고 요청한 뒤 1.5초가 지나도 살아 있는 명령은 강제로 끈다.
- **agent hook의 `model` 존중** — `haiku` 같은 별칭을 인식한다. subagent의 모델이 이 값을 덮어쓰지 않는다. 사용할 수 없는 모델이면 작업을 허용하지 않고 호출한 쪽 모델로 대신 돈다.
- **로컬 transcript 기록 범위 확대** — API 요청마다 시스템 프롬프트, 도구, 파라미터까지 기록한다. 공유한 transcript로 요청을 똑같이 재현할 수 있다.
- **`--worktree` 안정화** — 태그·브랜치 이름이 커밋 ID처럼 생겼을 때 엉뚱한 커밋에서 시작하던 문제, 시작할 때 잘못된 브랜치 이름이 보이던 문제, bare 저장소에서 실패하던 문제를 고쳤다. 플러그인 `WorktreeCreate`/`WorktreeRemove` hook도 이제 실행된다.
- **reftable 저장소 호환** — git의 reftable 방식으로 ref를 저장하는 저장소에서 브랜치가 ".invalid"로 보이던 문제, worktree를 다시 열지 못하던 문제, diff 충돌을 감지하지 못하던 문제, `git_commit_id`가 빠지던 문제를 고쳤다.
- **MCP 스키마 400 에러 회피** — API가 MCP 도구의 입력 스키마를 거부하면, 그 대화가 끝날 때까지 해당 도구를 파라미터 없이 보낸다. 매 턴 400 에러로 실패하던 문제가 사라진다.
- **자동 tool search 꺼짐 수정** — `ENABLE_TOOL_SEARCH=auto`가 대화 도중 꺼지던 문제를 고쳤다. 예: resume 뒤 MCP 서버가 다시 연결되는 동안.
- **compaction 후 resume 손실 수정** — headless/Agent SDK 세션을 resume할 때 compaction 요약이나 최근 메시지가 사라지던 문제를 고쳤다. compaction 뒤 MCP 도구가 바로 알려지지 않던 문제도 고쳤다.
- **백그라운드 명령 polling 제거** — 백그라운드 명령이 도는 동안 Claude가 출력 파일을 반복 확인하거나 sleep하던 동작을 고쳤다.
- **dark ANSI 테마 dim 텍스트** — dark ANSI 테마와 16색 터미널에서 보조(dim) 텍스트가 일반 텍스트와 똑같이 보이던 문제를 고쳤다.
- **gzip 요청 압축 상시 적용** — telemetry를 꺼도 api.anthropic.com으로 가는 큰 요청은 gzip으로 압축한다. 끄려면 `CLAUDE_CODE_GZIP_REQUEST_BODIES=0`을 쓴다.
- **`forceLoginOrgUUID` 토큰 정리** — 로그인이 거부된 조직의 토큰이 저장된 채로 남던 문제를 고쳤다.
- **클라우드 세션 안정화** — policy를 못 읽을 때 턴마다 5분씩 멈추던 문제, 재시작 뒤 이미 답한 메시지를 다시 실행하던 문제, 차단 원인을 잘못 안내하던 문제를 고쳤다.
- **`claude remote-control --sandbox`/`--no-sandbox` 제거** — 원래 아무 효과가 없던 플래그다. 넘기면 에러로 종료한다. sandbox를 쓰려면 settings의 `sandbox.enabled`를 쓴다.

## 🔑 이번 버전의 핵심 키워드
**"mod 확장과 hook 신뢰성"** — mod API를 넓히고, hook·worktree·resume의 빈틈을 대거 메운 안정화 릴리스다.

---

# 📜 원문 (한글 번역본)

> 원문 ChangeLog를 원래 순서 그대로 한 줄도 빠짐없이 번역한 문서입니다.

- mod의 프롬프트 장식에 `virtualText` 추가: 입력창 안에 그려지지만 draft에도, 전송되는 프롬프트에도 들어가지 않는 텍스트
- OpenTelemetry `api_request` 이벤트에 `cache_creation_5m_tokens`와 `cache_creation_1h_tokens` 추가. 캐시 쓰기를 유지 시간별로 나눔
- mod용 `$.ui.view({ agentId })` 추가: 요청하면 메인 화면에 에이전트의 transcript를 보여주고, `$.ui.view({})`로 돌아감
- RTL 텍스트용으로 mod `Text`에 `dir` prop 추가: Windows와 VS Code 터미널에서 줄이 그 방향으로 읽히고 오른쪽 끝에 붙음
- Claude Platform on AWS에 `/advisor` 추가. `/advisor`, `advisorModel`, `--advisor`로 고르기 전에는 advisor가 돌지 않고, `CLAUDE_CODE_DISABLE_ADVISOR_TOOL=1`이면 꺼짐
- trace span에 `gen_ai.provider.name`, `gen_ai.conversation.id`, `gen_ai.tool.name`, `error.type` 같은 OpenTelemetry GenAI semantic-convention 속성 추가
- `agent.spawn` mod hook에서 workflow 에이전트의 `prompt`와 `model`을 바꿔 쓰는 기능 추가. 이전에는 workflow 에이전트를 거부만 할 수 있었음
- `prompt.change` mod hook 추가: 타이핑 없이 입력창 텍스트가 바뀔 때 발생. 히스토리 불러오기, 지우기, undo, 플러그인 채우기가 해당
- 클라우드 세션의 네트워크 설정이 호스트를 막았는데도 조직 policy가 막았다고 Claude에 안내하던 문제 수정
- 더 작은 auto-compact 창을 골랐을 때 `/autocompact`가 높은 토큰 사용량을 경고하던 문제 수정
- 백그라운드 명령이 돌고 있을 때 종료하면 SessionEnd hook이 가끔 실행되지 않던 문제 수정
- `claude --help`의 `--restricted` 설명에 삭제된 도구 이름이 나오던 문제 수정
- PR 하나의 데이터가 불완전하게 오면 `claude agents`가 모든 PR의 상태를 갱신하지 않던 문제 수정
- 클라우드 세션의 컨테이너가 교체된 뒤, 이미 한 번 resume된 백그라운드 에이전트를 Claude가 "유실되어 resume 불가"로 안내받던 문제 수정
- 메시지를 보낸 적 있는 subagent가 끝난 직후 `/tasks`에서 사라져 대화로 돌아갈 방법이 없던 문제 수정
- 자식 에이전트를 보는 동안 완료된 부모 에이전트가 breadcrumb에서 빠지고 자식이 최상위로 다시 표시되던 문제 수정
- 입력이 한꺼번에 몰려 들어올 때 agents 화면이 "up", "down", "escape" 같은 단어를 키 입력으로 받아들여, 답하는 도중 peek가 움직이거나 draft가 지워질 수 있던 문제 수정
- 자동 tool search(`ENABLE_TOOL_SEARCH=auto`)가 대화 도중 꺼지던 문제 수정. 예: resume 뒤 MCP 서버가 다시 연결되는 동안
- `forceLoginOrgUUID`가 거부한 로그인에서 거부된 조직의 토큰이 저장되거나 `/login` 뒤에도 살아 있던 문제 수정
- Claude Desktop과 Remote Control 세션의 diff 화면이 reftable 저장소에서 충돌난 cherry-pick·revert를 감지하지 못하던 문제 수정
- Artifact 도구의 verbose 및 ctrl+o 줄이 입력이 도착하는 동안 `Artifact("(unprintable path)")`로 표시되던 문제 수정. 이제 Bash처럼 "Waiting…"과 "Running…"을 보여줌
- 충돌로 transcript 마지막 줄이 잘렸을 때, 세션 resume 뒤 처음 쓰는 transcript 항목이 사라지던 문제 수정
- Unicode 줄/문단 구분자(U+2028, U+2029)가 들어 있으면 `/branch`가 메시지를 빠뜨리고 `claude purge`가 하위 폴더 프로젝트를 건너뛰던 문제 수정
- Claude Code를 `--worktree`로 시작하면 플러그인 `WorktreeCreate`·`WorktreeRemove` hook이 실행되지 않던 문제 수정(`--tmux`는 아직 미지원)
- reftable ref 저장소를 쓰는 저장소에서 `git commit -q` 뒤 OpenTelemetry `tool_result` 이벤트에 `git_commit_id`가 빠지던 문제 수정
- mod의 `prompt.submit` hook이 바꾸거나 버린 프롬프트가 OpenTelemetry `user_prompt` 이벤트와 interaction span, 세션 제목 요청에 타이핑한 그대로 기록되던 문제 수정
- mod hot-reload에 관해 Claude에게 보내는 안내문이 사용자가 입력한 것처럼 transcript에 보이던 문제 수정
- agent hook이 자신의 `model`을 무시하던 문제 수정: `haiku` 같은 별칭을 인식하고, subagent 모델이 덮어쓰지 않으며, 사용할 수 없는 모델이면 작업을 허용하지 않고 호출한 쪽 모델로 대신 돔
- 태그·브랜치 이름이 커밋 ID처럼 생겼을 때 `--worktree` 세션이 잘못된 커밋에서 시작하던 문제, 시작 시 git status에 새 worktree가 아닌 다른 브랜치가 표시되던 문제 수정
- git reftable ref 저장소를 쓰는 저장소에서 브랜치가 ".invalid"로 보이고 `--worktree`가 worktree를 다시 열지 못하던 문제 수정
- Claude가 세션 scratchpad의 파일을 전체 경로가 아닌 파일 이름만이나 상대 경로로 부르던 문제 수정
- `claude remote-control` 서버가 잠긴 keychain 같은 짧은 로그인 오류 뒤 연결 갱신을 포기하던 문제 수정. 이제 재시도하고, `claude /login`이 필요하면 경고함
- bare 저장소의 worktree에서 origin의 기본 브랜치를 fetch하지 못하면 `--worktree`가 실패하던 문제 수정. 대체 기준점은 이제 메인 저장소가 아닌 현재 checkout의 HEAD
- VS Code, Cursor, Devin Desktop 통합 터미널에서 Claude Code를 시작하면 확장 설치를 확인하려고 에디터 CLI를 두 번 실행하던 문제 수정. 이제 한 번만 실행
- `chat:newline` 키 바인딩(Ctrl+J 또는 다시 지정한 Enter)으로 줄바꿈하면 mod의 `prompt.edit` hook이 발생하지 않던 문제 수정
- API가 MCP 도구의 입력 스키마를 거부하면 매 턴 400 에러로 대화가 실패하던 문제 수정. 이제 그 대화가 끝날 때까지 해당 도구를 파라미터 없이 보냄
- 출력 토큰 한도에서 잘린 답 뒤에 compaction이 일어나면, headless 또는 Agent SDK 세션 resume 시 compaction이 남긴 최근 메시지가 사라지던 문제 수정(이 버전 이후의 compaction부터 적용)
- compaction 뒤 MCP 서버 연결이 끝났을 때, 다음 도구 호출 전까지 Claude가 그 서버의 도구와 instructions를 모르던 문제 수정
- 여러 세션을 동시에 서비스하는 컴퓨터에서 Remote Control 세션이 실행 중인데도 중지됨으로 표시되던 문제 수정
- 같은 턴 안에서 재시도했거나 끝나지 않은 답 뒤에 compaction이 일어나면, headless 또는 Agent SDK 세션 resume 시 compaction 요약을 잃거나 compaction 이전 기록이 되살아나던 문제 수정
- 백그라운드 명령이 도는 동안 Claude가 출력 파일을 polling하거나 sleep하던 문제 수정
- OS 인증서 저장소로만 신뢰되는 인증서를 쓰는 TLS 검사 프록시 뒤에서 feature flag와 단계적 배포가 갱신되지 않던 문제 수정
- 멈춘 백그라운드 서비스가 계속 돌고 있는데 `claude daemon stop --any`가 "stopped"를 출력하던 문제 수정: 이제 기다렸다가 강제 종료하고, 그래도 남아 있으면 그렇게 알리며 exit 1로 끝남
- telemetry가 꺼져 있으면 `claude daemon stop`이 아무 출력 없이 끝나고 세션이 실행 중으로 남던 문제 수정
- Cowork 클라우드 세션에서 Write, Edit, NotebookEdit이 내 컴퓨터 경로에 대해 성공을 보고했지만 파일은 도착하지 않던 문제 수정
- 도구 목록이 없는 기록을 resume한 세션에서, 앞서 이미 로드한 deferred 도구를 Claude가 다시 검색하던 문제 수정
- dark ANSI 테마와 16색 터미널에서 보조(dim) 텍스트가 일반 텍스트와 똑같이 보이던 문제 수정
- 조직 policy를 읽을 수 없을 때 클라우드 세션이 턴마다 5분씩 멈추던 문제 수정. 이제 턴이 바로 끝나고 이유를 알려줌
- 긴 답변 중 세션이 재시작되면 클라우드 세션이 이미 답한 메시지를 다시 실행하던 문제 수정
- Self-hosted runner: 아무도 출력을 읽지 않으면 runner와 orchestrator가 멈추던 문제(poll·`/healthz`·`SIGTERM` 종료 불가) 수정. 로그는 최근 256 KiB만 남기고 버린 양을 셈(Windows 제외)
- Cowork 클라우드 세션의 WebFetch 개선: 방금 실패한 페이지를 다시 가져오지 않고 실패했다고 Claude에 알림
- 내장 `plugin-authoring` 스킬의 mod 공유 개선: Claude가 mod 파일을 열기 전에 키(비밀값)를 검사하고, 프로젝트 밖 폴더를 검사하기 전에는 먼저 물음
- @로 언급한 PDF에 대해 Claude 3 모델이 받는 안내문 개선. 읽지 않고 답하는 일이 줄어듦
- artifact 업데이트 개선: 작은 변경은 한 번의 호출로 적용하고 다시 게시하며, 큰 수정은 한 응답 안에서 수정하고 다시 게시함
- `CLAUDE_CODE_PROVIDER_MANAGED_BY_HOST` 세션이 settings 안의 CA-bundle, tool-proxy, git TLS, `SSL_CERT_FILE` 같은 git config 변수를 무시하도록 변경. Claude Desktop에서는 project settings에서만 무시
- 종료 시 멈추라는 요청 뒤 1.5초가 지나도 돌고 있는 백그라운드 명령을 강제 종료하도록 변경. 이전에는 fullscreen 모드에서 계속 돌 수 있었음
- `forceLoginGatewayUrl`이 세션 호스트명을 서비스하는 Anthropic 운영 gateway를 가리키면, Claude Desktop의 Code 탭이 managed settings를 적용하도록 변경. 시작 시 그 gateway에 접속할 수 있어야 함
- `claude gateway`가 Claude Desktop이 gateway에서 쓸 수 없는 `desktop:` policy 키를 만나면, 경고만 하고 시작하던 이전과 달리 키 이름을 알리고 시작 단계에서 멈추도록 변경
- telemetry를 꺼도 api.anthropic.com으로 가는 큰 요청은 gzip 압축을 쓰도록 변경. 끄려면 `CLAUDE_CODE_GZIP_REQUEST_BODIES=0` 설정
- `claude-api` 스킬이 보관·삭제를 요청하지 않는 한 Managed Agents 세션을 그대로 두도록 변경
- 백그라운드 세션이 넘겨받은 workflow를 handoff 파일에서 바로 실행하지 않고, Workflow 도구의 승인을 거쳐 이어가도록 변경
- 로컬 세션 transcript에 API 요청마다 시스템 프롬프트, 도구, 파라미터도 기록하도록 변경. 공유하기로 한 transcript로 요청을 정확히 재현할 수 있음
- `/sandbox` 모드 옵션 문구를 "Sandbox BashTool"에서 "Sandbox commands"로 변경
- Cowork 클라우드 세션의 `PermissionRequest` hook 변경: hook의 allow 안에 있는 `setMode` 업데이트는 무시하고, 나머지 승인은 그대로 적용
- hook 변경: PreToolUse·PermissionRequest hook의 `updatedInput`을 Claude가 직접 만든 입력처럼 검증함. 모르는 키는 버리고, 도구가 거부하는 입력이면 호출을 거부함
- `claude remote-control`에서 효과가 없던 `--sandbox`·`--no-sandbox` 플래그 제거. 넘기면 에러로 종료함. 세션을 sandbox로 돌리려면 settings에 `sandbox.enabled` 설정
- [VSCode] 에디터에서 선택한 텍스트가 메시지에 붙지 않게 하는 `claudeCode.attachSelection` 설정 추가
- [VSCode] 사용 크레딧이 떨어진 뒤에도 fast mode가 켜져 있어 요청마다 거부되고 재전송되던 문제 수정. 이제 다시 켤 때까지 꺼지고 에러 알림을 띄움
- [VSCode] 항상 생각하는 모델에서 Thinking 토글이 Off로 바뀌던 문제 수정. 그런 모델에는 토글을 더 이상 보여주지 않음
- [VSCode] 플래그된 메시지에서 "Edit prompt"를 누르면 복원된 프롬프트 위에 파일·명령 메뉴가 열리던 문제 수정. 이제 Enter를 누르면 쓴 그대로 전송됨
- [VSCode] Windows에서 Shift+드래그로 파일을 프롬프트에 놓으면 작업 디렉터리 기준 mention 대신 읽을 수 없는 `/c:/…` 경로가 들어가던 문제 수정
- [VSCode] VS Code 채팅 글꼴 크기 설정을 바꾸면 창을 다시 로드해야 하거나 테마 변경 시 되돌아가던 문제 수정. diff와 plan 미리보기도 이제 이 설정을 따름
- [VSCode] "Resume session"과 다시 로드 후 복원된 탭이, git worktree로 옮겨간 대화 대신 빈 새 대화를 열던 문제 수정
- [VSCode] 불러온 slash command에서 ↑ 다음 Enter를 누르면 인자 없이 실행되던 문제 수정. 불러온 프롬프트는 수정하기 전까지 명령·파일 메뉴가 열리지 않음
- [VSCode] WSL, SSH, Dev Container 창에서 Explorer나 에디터 탭의 파일을 Shift+드래그로 프롬프트에 놓으면 아무것도 들어가지 않던 문제 수정
- [VSCode] Windows와 Linux에서 Explorer, 기타 트리 뷰, Debug Console의 Ctrl+Alt+F가 Find를 열지 않고 Focus view를 토글하던 문제 수정
- [VSCode] macOS에서 다른 창·터미널에 열린 세션을 확인할 때 추가 프로세스가 생기던 문제 수정: 매번 PATH에서 `ps`를 찾지 않고 `/bin/ps`를 직접 실행함
- [VSCode] Windows: 충돌이나 정전 뒤 Windows가 재시작되면서 이전 프로세스 ID가 다른 프로그램에 할당됐을 때 대화가 "still open somewhere else"로 표시되던 문제 수정
- [Cloud sessions] 조직이 "Always allow"를 끈 커넥터 도구에서 Cowork 승인 프롬프트에 "Allow for this task"가 빠지던 문제 수정(2.1.292 회귀)
- [Cloud sessions] 두 번째 메시지를 보낸 뒤 클라우드 세션의 / 메뉴 명령 대부분에서 설명이 사라지던 문제 수정
- [Remote Control] claude.ai와 데스크톱 앱의 Remote Control 세션 diff 화면이 삭제·이름 변경된 파일을 수정된 파일로 표시하던 문제 수정. 내 컴퓨터에 Claude Code v2.1.296 이상 필요
- [Claude Tag] Slack Connect 채널 지원 추가: Owner나 Claude Tag 관리자가 허용하면 Slack의 Claude가 다른 조직과 공유한 채널에서 답할 수 있음. 기본값은 꺼짐
- [Claude Tag] 승인이 필요한 커넥터 작업용으로 Slack 스레드에 나만 보는 Allow once / Deny 카드 추가. Claude가 거절하지 않고 물어봄. 다른 사람에게는 내 승인을 기다리는 중이라는 것만 보임
- [Claude Tag] Slack의 Claude에 Slack 음성 클립 지원 추가: Slack에 클립 받아쓰기가 있으면 Claude가 그것을 읽음
- [Claude Tag] Claude가 채널에 직접 올린 메시지 아래 스레드에서 다른 앱이 Claude를 태그하면 답하지 않던 문제 수정
- [Claude Tag] 관리자가 Slack 채널에 붙인 access bundle이 그 채널이 Slack Connect 채널이 된 뒤에도 계속 적용되도록 변경. 떼었다 다시 붙일 필요 없음
- [Code Review] GitHub 조직 멤버십이 비공개인 쓰기 권한 사용자의 `@claude review` 댓글을 Code Review가 무시하던 문제 수정. 이제 그 댓글로도 리뷰가 시작됨
- [Code Review] Code Review의 "paused for this repository" 댓글이 관리자를 Code Review 설정으로 보내던 문제 수정. 이제 누가 해결할 수 있는지 알려주고 Git providers 페이지로 연결함

---

## 🎯 챌린지

이번 버전에서 내 환경에 적용해볼 만한 항목입니다.

### 1. deploy-guard hook 출력 형식 점검
- **파일**: `~/.claude/hooks/deploy-guard.sh`
- **근거**: 이번 버전부터 PreToolUse hook이 돌려주는 `updatedInput`을 엄격하게 검사한다. 모르는 키는 버리고, 도구가 거부하는 입력이면 호출을 막는다. 이 hook이 JSON으로 입력을 고쳐 쓰고 있다면 동작이 바뀔 수 있다. 스크립트 출력 부분을 확인하고, 실제로 `git push origin feat/test` 차단이 여전히 되는지 확인한다(exit 2 차단만 쓰면 영향 없음).
- **난이도**: ★☆☆ (약 10분)

### 2. transcript 보관 기간 재검토
- **파일**: `~/.claude/settings.json` (`cleanupPeriodDays`)
- **근거**: 이번 버전부터 로컬 transcript에 API 요청마다 시스템 프롬프트, 도구 목록, 파라미터까지 저장한다. 현재 시스템 프롬프트에는 `autoMode.environment`(GCP 프로젝트 ID 등)와 CLAUDE.md 전문이 들어간다. 그래서 `~/.claude/projects/` 용량과 민감도가 함께 커진다. 지금 값은 30일이다. 필요한 만큼으로 줄이고 현재 디렉터리 크기를 확인한다.
- **난이도**: ★☆☆ (약 10분)

### 3. SessionEnd 종료 알림 hook 추가
- **파일**: `~/.claude/settings.json` (`hooks.SessionEnd`)
- **근거**: 지금 쓰는 `Stop` hook은 턴이 끝날 때마다 울린다. 그래서 세션이 완전히 끝났는지는 따로 알 수 없다. 이번 버전에서 백그라운드 명령이 돌고 있을 때 종료하면 SessionEnd가 빠지던 문제를 고쳤고, 백그라운드 명령도 1.5초 뒤 강제 종료된다. 이제 SessionEnd를 믿고 쓸 수 있다. 기존 `osascript` 알림과 같은 방식으로 "세션 종료" 알림을 추가한다.
- **난이도**: ★☆☆ (약 10분)
