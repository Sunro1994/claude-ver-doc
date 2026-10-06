# Claude Code v2.1.290

> 작성일: 2026-10-07

---

# 📋 요약본

## 🎉 신기능 (8건)
- **mod 훅 API 확장** — mod와 플러그인 훅이 받는 정보가 늘었다.
  - `turn.step` 결과에 `serverToolUses`가 추가된다. API 서버가 직접 실행한 도구 호출(advisor)이 담긴다.
  - `tool.check` 이벤트에 `agentId`가 추가된다. 서브에이전트의 권한 검사와 메인 세션의 권한 검사를 구분할 수 있다.
  - `tool.check`의 질문과 판정에 `ceiling`이 추가된다. 조직이 그 도구에 요구하는 승인 수준이 담긴다.
  - typings에 `ThemeKey`, `Color` 타입이 추가된다. 에디터가 테마 색상 이름을 자동완성한다.
- **`claude plugin validate` 게이팅 훅 점검** — gating site에 등록된 훅을 나열하고 각 훅에 `.catch`가 있는지 표시한다. `--json`에서는 `gatingHooks`로 나온다.
- **`claude attach <name>` / `claude logs <name>`** — 세션 id 대신 세션 이름의 일부만 입력해도 된다.
- **`/claude-api managed-agents-onboard`** — 두 가지 방식으로 Managed Agents 설정을 만든다.
  - URL을 주면 그 페이지가 설명하는 패턴을 `ant apply` 파일로 만든다.
  - `deep-researcher` 같은 Console quickstart 이름을 주면 `ant` CLI로 템플릿을 만든다.
- **managed settings 경고 추가** — managed settings 파일이 managed settings 폴더 밖을 가리키는 링크이면 경고한다. 사용자가 설정한 sandbox `allowRead` 경로나 허용 도메인을 managed settings가 무시하는 경우에는 `/status`와 doctor가 경고한다.
- **Claude apps gateway 로그인 거부 버튼** — 로그인 승인 페이지에 Deny 버튼이 생긴다. 누르면 대기 중인 로그인이 끝나고, 기다리던 터미널이 몇 초 안에 멈춘다.
- **[VSCode] 접근성·마켓플레이스** — Claude가 작업 중일 때 메시지를 보내면 스크린 리더가 "Message queued."를 읽는다. Manage plugins 대화상자에서 마켓플레이스의 설치·업데이트 명령을 검토하고 실행할 수 있다.
- **[Claude Tag] Slack fast mode·경로 제한** — `!fast`로 스레드를 fast mode로 바꾸고, 필요하면 Opus로 옮긴다. `!fast off`로 되돌린다. 커스텀 연결의 allow 규칙에 Path prefixes를 지정해 호스트 전체가 아닌 특정 경로만 허용할 수 있다.

## 🛠️ 개선/수정 (15건)
- **WebFetch 잘림 수정** — 100,000자를 넘는 페이지 텍스트를 말없이 버리던 문제를 고쳤다. 이제 읽지 못한 양을 알려 주고, `offset`으로 이어서 읽을 수 있다.
- **예약 작업 복구** — compaction 후 세션을 재개하면 `/loop`와 리마인더가 사라지던 문제를 고쳤다. ←나 `/background`로 넘긴 뒤 예약 작업이 실행되지 않던 문제, 재개할 때마다 반복 작업이 한 번 더 실행되던 문제도 고쳤다.
- **Bash 권한 검사 강화** — 셸이 와일드카드로 펼칠 인자가 있는 `rg`·`git grep`은 이제 승인을 묻는다. zsh와 bash가 변수명을 다르게 읽는 명령, `declare`·`export` 접두 변수로 이름이 정해진 명령도 마찬가지다. `pyright`와 더 많은 `ps` 형태도 자동 승인에서 빠졌다.
- **링크·Read deny 우회 차단** — 읽는 도중 링크를 바꿔치기해 승인 범위 밖 파일을 읽는 경로를 막았다(이미지 읽기, `@`-mention). 프롬프트에 붙여 넣은 이미지 경로와 `@` 폴더의 파일 목록에도 Read deny 규칙을 적용한다.
- **PreToolUse 훅 입력 재작성 후 검사 누락 수정** — 훅이 도구 입력을 바꿔 쓴 뒤에 일부 권한 규칙과 안전 검사가 적용되지 않던 문제를 고쳤다.
- **Mac 절전 복귀 안정화** — 절전에서 깨어나면 background agent가 "Agent stalled"로 실패하던 문제를 고쳤다. Workflow 서브에이전트가 처음부터 다시 시작하던 문제와 자동 compaction이 "Prompt is too long"으로 포기하던 문제도 고쳤다.
- **스킬 이름 탐색 수정** — SKILL.md의 이름과 폴더 이름이 다르면(예: 한글 폴더명) 스킬을 찾지 못하던 문제를 고쳤다. 목록에 두 이름을 함께 보여 준다.
- **재개한 서브에이전트·팀원 상태 보존** — 실행 중에 메시지를 받으면 이전 thinking과 prompt cache를 잃던 문제를 고쳤다.
- **plan mode 복원** — `--continue`나 `--resume <session-id>`로 재개할 때 plan mode가 돌아오지 않던 문제를 고쳤다.
- **비동기 Stop 훅 무한 루프 수정** — 공백이 든 경로를 따옴표 없이 넘기는 비동기 Stop 훅 때문에 Claude가 끝없이 답하던 문제를 고쳤다.
- **WebSearch 한도 방식 변경** — 200회를 다 쓰면 끝나던 방식에서 시간당 100회씩 다시 채워지는 방식으로 바뀌었다. 속도는 `CLAUDE_CODE_WEB_SEARCH_REFILLS_PER_HOUR`로 정하고, 0이면 끈다.
- **`/code-review` medium 범위 확대** — tuned 설정이 없는 Opus 5.5·Sonnet 5.5에서도 medium effort가 cleanup 지적과 CLAUDE.md 규칙 위반을 함께 보고한다.
- **프로젝트 설정 권한 축소** — 레포의 `.claude/settings.json`으로는 Claude in Chrome을 켜거나 `CLAUDE_CODE_DISABLE_ATTACHMENTS`를 설정할 수 없다.
- **긴 세션 안정성** — 이미지가 수백 장인 세션의 "unprocessable" 오류를 고쳤다. 매우 긴 메시지, 토큰처럼 생긴 긴 텍스트, 비ASCII 출력에서 생기던 멈춤도 고쳤다.
- **`CLAUDE_CODE_USER_DIALOG_TIMEOUT_MS` 단위 해석 수정** — `5m`을 5ms로 읽어 원격 대화상자가 바로 취소되던 문제를 고쳤다. 단위 접미사가 붙은 값은 `dialogExpiry`로 대체한다.

## 🔑 이번 버전의 핵심 키워드
**"권한 우회 차단과 장시간 세션 안정화"** — 링크·와일드카드·변수를 이용한 권한 우회 경로를 막고, 절전·compaction·재개 뒤에도 예약 작업과 에이전트가 끊기지 않게 했다.

---

# 📜 원문 (한글 번역본)

> 원문 ChangeLog를 원래 순서 그대로 한 줄도 빠짐없이 번역한 문서입니다.

- mod의 `turn.step` 훅 결과에 `serverToolUses` 추가: API가 직접 실행한 도구 호출(advisor)을 담는다. 각 항목에 id, name, input, 시작·종료 시각이 있다
- 플러그인 훅의 `tool.check` 이벤트에 `agentId` 추가: 훅이 서브에이전트의 권한 검사와 메인 세션의 권한 검사를 구분할 수 있다
- mod의 `tool.check` 훅이 읽는 질문과 판정에 `ceiling` 추가: 조직이 그 도구에 요구하는 승인 수준을 나타낸다
- 플러그인 훅 typings에 `ThemeKey`, `Color` 타입 추가: mod가 그릴 때 쓸 수 있는 테마 색상을 에디터가 목록으로 보여 준다
- `claude plugin validate`에 기능 추가: mod가 gating site에 등록한 각 훅을 `.catch` 유무와 함께 나열한다(`--json`에서는 `gatingHooks`)
- Claude apps gateway의 로그인 승인 페이지에 Deny 버튼 추가: 대기 중인 로그인을 끝내 기다리던 터미널이 몇 초 안에 멈춘다
- `claude attach <name>`, `claude logs <name>` 추가: id 대신 세션 이름의 일부를 쓸 수 있다
- 페이지가 설명하는 Managed Agents 패턴을 `ant apply` 파일로 설정하는 `/claude-api managed-agents-onboard <url>` 추가
- `deep-researcher` 같은 Console quickstart 템플릿을 `ant` CLI로 만드는 `/claude-api managed-agents-onboard <quickstart-name>` 추가
- managed settings 파일이 managed settings 폴더 밖 파일을 가리키는 링크이면 경고 추가
- managed settings가 사용자가 설정한 sandbox `allowRead` 경로나 허용 도메인을 무시하면 /status와 doctor에서 경고 추가
- Claude Code의 beta 헤더 하나를 400이 아닌 상태 코드로 거부하거나, 두 번째 beta와 함께 쓰일 때 거부하는 프록시·게이트웨이 뒤에서 요청이 실패하던 문제 수정
- 이미지가 수백 장인 긴 세션이 "Request rejected as unprocessable by the model" 오류에 갇히던 문제 수정
- Claude가 thinking 중일 때 API의 출력 콘텐츠 필터가 응답을 멈추면 턴이 바로 끝나던 문제 수정. 이제 오류를 보여 주기 전에 한 번 재시도한다
- 재개한 서브에이전트와 팀원이 실행 중 메시지를 받으면 이전 thinking과 prompt cache를 잃던 문제 수정
- WebFetch가 100,000자를 넘는 페이지 텍스트를 말없이 버리던 문제 수정. 이제 읽지 못한 양을 알려 주고, `offset`으로 이어서 읽을 수 있다
- 응답 안에 목록이나 인용이 수천 단계로 중첩되면 충돌("Maximum call stack size exceeded")하던 문제 수정
- Claude가 작업 중일 때 보낸 프롬프트가 `/rewind` 목록에 나오지 않던 문제 수정
- 대화가 compaction된 뒤 재개하면 예약 작업(간격을 준 `/loop`, 리마인더)이 말없이 돌아오지 않던 문제 수정. 이 버전부터 만든 compaction에 적용된다
- foreground에서 설정한 예약 작업이 ←나 `/background`로 넘긴 뒤 실행되지 않던 문제, 반복 작업이 resume·respawn·fork마다 한 번 더 실행되던 문제 수정
- headless `--json-schema` 실행에서 구조화된 출력을 이미 전달한 뒤 연결이 끊기면, `success` 결과인데도 `is_error: true`로 0이 아닌 코드로 종료되던 문제 수정
- 서버가 보낸 ask 정책이 붙은 읽기 전용이 아닌 connector 도구를 plan mode에서 auto mode 분류기가 승인하던 문제 수정
- `permissions.blockReadsOutsideWorkingDirectories`나 `Read` deny 규칙이 있는데도, 작업 디렉터리 밖을 가리키는 심볼릭 링크인 프로젝트 `CLAUDE.md`·rule·`AGENTS.md`가 로드되던 문제 수정
- `xn--` 호스트 라벨 안에 와일드카드가 있는 URL allow·deny 패턴이 프로세스마다 다르게 매칭되던 문제 수정
- 조직이 제공한 MCP 서버가 로그인·재연결 후 사용자 소유로 다시 표시되던 문제 수정. headless·SDK 세션에서 늦게 도착한 결과로 생기는 경우도 포함한다
- Windows에서 `git stash create`가 실패하면 `/ultrareview`가 경고 없이 커밋 안 된 변경을 빠뜨리던 문제, `git add -N` 파일을 지우거나 옮긴 뒤 변경을 거부하던 문제 수정
- macOS·Linux에서 백슬래시가 든 경로에 대한 `plansDirectory` 설정의 프로젝트 루트 검사 수정
- 매우 긴 Remote Control·클라우드 세션에서 응답이 스트리밍되지 않고 블록 단위로 나타나던 문제 수정
- `claude daemon run`, `claude daemon logs`에서 백그라운드 데몬 로그가 터미널 제어 문자를 화면에 그대로 보내던 문제 수정. 이제 `\uXXXX` 이스케이프로 보인다
- Self-hosted runner: 세션 오류 출력에 조작된 매우 긴 줄이 있으면 runner가 몇 초간 멈추던 문제 수정
- `.catch`가 있는 플러그인 훅이 프롬프트나 도구 호출 처리로 hooks worker를 붙잡고 있으면 언로드되고 `.catch`도 건너뛰던 문제 수정
- 응답 도중 모델 fallback이 버린 도구 호출이 mod의 `turn.step` 결과에 남던 문제 수정
- Claude가 메시지나 파일을 보낸 직후 컨테이너가 재시작되면 Cowork 클라우드 세션의 응답이 끝나지 않던 문제 수정
- 최상위 함수와 이름이 같은 옵션을 구조 분해하는 hooks 모듈을 `claude plugin validate`와 플러그인 로딩이 거부하던 문제 수정
- git 설정에 `core.safecrlf=true`가 있으면 `/ultrareview`가 커밋 안 된 변경을 업로드하지 못하던 문제 수정
- 표시된 메시지를 fallback 모델로 재시도할 때, 그 모델에 settings에 저장된 다른 effort 수준이 있으면 effort가 바뀌던 문제 수정
- Windows: CRLF 줄바꿈으로 저장된 스킬·커맨드의 여러 줄 `!` 셸 블록이 실패하던 문제 수정
- fullscreen 모드에서 검색 중 `/permissions` 탭을 클릭하면 강제 종료할 때까지 멈추던 문제 수정
- 대화 compaction이 가끔 "null is not an object" 오류로 실패하던 문제 수정
- auto mode에서 보고를 넘기는 서브에이전트의 `turn.complete`에서 플러그인 훅이 빈 `answer`를 읽던 문제 수정
- reload 실패 뒤 refresh가 이어지면 mod가 메시지 없이 언로드되던 문제 수정. 이제 실패 줄에 이전에 로드된 버전이 언로드됐다고 적힌다
- `next(e)`를 호출한 뒤 프롬프트를 버리는 mod의 `prompt.submit` 훅이 말없이 무시되던 문제 수정. 이제 해당 훅을 이름과 함께 실패로 보고한다
- 그릴 때마다 높이가 바뀌는 트리에서 끝을 따라가는 mod의 pane이나 band가 끝없이 다시 그려지던 문제 수정
- macOS·Windows에서 이미지를 읽는 도중 링크를 바꿔치기하면 승인 범위 밖 파일이 반환될 수 있던 문제 수정
- 사용자가 설치한 mod가 조직의 플러그인을 언로드시킬 수 있던 문제 수정. 이제 그 mod가 언로드된다
- `.mcp.json`, 플러그인, 에이전트에 선언된 일부 MCP 항목에 `disableClaudeAiConnectors`와 `allowedMcpServers` URL 규칙이 적용되지 않던 문제 수정
- 트리 높이가 그릴 때마다 바뀌면 mod의 inline pane이 끝없이 다시 그려지던 문제 수정
- read block이나 `--restricted` 상태에서 `@`-mention이 읽는 도중 바뀐 링크를 통해 작업 디렉터리 밖 파일을 읽을 수 있던 문제 수정
- agents view에서 Esc가 "Press enter again to restart this session — it isn't responding"을 확인 처리하던 문제 수정. 이제 Esc는 세션을 다시 열기만 한다
- 백그라운드 세션이 직접 만든 worktree로 들어가면 agent view가 그 세션의 `/loop` 실행 횟수, 카운트다운, 실시간 상태 줄을 잃던 문제 수정
- manual 권한 모드의 `claude agents` 세션이 답장이나 새 에이전트 프롬프트에 붙여 넣은 이미지를 읽을 때 승인을 묻던 문제 수정
- `declare`, `typeset`, `export`, `readonly`에 접두로 설정한 변수에서 이름이 온 명령·경로를 deny·ask 규칙이 놓치던 문제 수정
- 프롬프트에 붙여 넣거나 끌어 놓은 이미지 경로, @-mention한 폴더의 파일 목록에 Read deny 규칙이 적용되지 않던 문제 수정
- 사용자가 설치한 mod가 조직의 guard 검사를 건너뛰게 만들 수 있던 문제 수정. 그런 mod는 이제 언로드된다
- mod가 비라틴 문자가 든 긴 여러 줄 텍스트를 그리면 플러그인 훅이 매 redraw마다 지연되던 문제 수정
- 섹션의 맨 아래 세션을 삭제한 뒤 agents view에서 Ctrl+X를 반복하면 다음 섹션 전체가 삭제되던 문제 수정
- You should know가 `language` 설정과 관계없이 영어로 노트를 쓰던 문제 수정
- 매우 긴 메시지를 보낸 뒤 멈추던 문제 수정
- 화살표, 대시, 박스 문자 같은 비ASCII 문자가 든 큰 도구 출력에서 transcript 펼치기(ctrl+o)나 창 크기 조정이 느려지던 문제 수정
- 저장된 transcript가 없는 백그라운드 세션에 `claude respawn`이 빈 대화로 시작하지 않고 이전 메시지를 다시 보내던 문제 수정
- agents view에서 `n:`이나 Ctrl+F 검색 후 Esc를 누르면 포커스가 섹션 헤더로 가고, 거기서 Ctrl+X를 두 번 누르면 섹션의 모든 세션이 삭제되던 문제 수정
- `claude agents`가 멈춘 세션에 전달하지 못한 슬래시 커맨드를 저장했다가, 그 세션이 다음에 재시작될 때 저절로 실행하던 문제 수정
- 이름이 `unset`이나 `unspecified`인 git filter driver 아래 파일의 커밋 안 된 변경을 `/ultrareview`가 필터 없이 업로드하던 문제 수정. 이제 업로드를 멈추고 driver 이름을 바꾸라고 안내한다
- auto mode 거부 시, 도구 전체에 대해 분류기를 건너뛰게 하거나 Claude Code가 무시할 권한 규칙을 제안하던 문제 수정
- 같은 이름의 추적 파일 자리를 폴더가 차지한 상태에서 stash를 고르면 `claude --teleport`와 `/teleport`가 그 폴더의 파일을 지우던 문제 수정. 이제 stash를 거부하고 이유를 알려 준다
- Esc가 agent view의 "Press enter again to restart this session fresh" 프롬프트를 확인 처리하던 문제 수정
- `/clear` 후 agent view의 `/loop` 실행 횟수가 멈추고 카운트다운이 사라지던 문제 수정. 이제 새 대화와 함께 횟수가 다시 시작된다
- `--channels` 권한 중계 수정: 세션 안에서 반복된 reply ID는 다른 프롬프트를 승인하지 않고 무시한다
- `/chrome`의 "Reconnect extension"이 Chrome 연결 실패 후 브라우저 도구를 복구하지 못하던 문제 수정. 복구할 수 없을 때는 이유를 설명한다 (anthropics/claude-code#98135)
- Anthropic 계정 없이 게이트웨이(`ANTHROPIC_BASE_URL`과 `ANTHROPIC_AUTH_TOKEN`)로 Claude에 접근하는 사용자에게 mod가 계속 꺼져 있던 문제 수정
- 백그라운드 세션이 충돌한 직후 `claude agents`에서 보낸 답장이 2초 뒤 거부되던 문제 수정. 이제 세션이 재시작되는 동안 최대 12초까지 재시도한다
- `claude agents`가 실행 중인 세션에 전달하지 못한 슬래시 커맨드와 객관식 질문 답이 저장됐다가, 다음 재시작 때 저절로 전송되던 문제 수정
- heredoc을 다른 명령으로 파이프하는 sandbox 명령(`cat <<EOF | python3`)이 실행할 때마다 승인을 묻던 문제 수정
- Homebrew 업그레이드 후 `claude agents`가 "Couldn't restart the background service"로 실패하고 백그라운드 세션이 멈추던 문제 수정 (이번 다음 업그레이드부터 적용)
- agent view의 "restart this session fresh"가 빈 대화로 시작하지 않고 세션의 이전 메시지를 다시 보내던 문제 수정
- 셸이 여전히 와일드카드로 펼칠 인자가 있는 일부 읽기 전용 명령(`rg`, `git grep` 등)을 Bash 권한 검사가 자동 승인하던 문제 수정. 이제 승인을 묻는다
- zsh가 bash와 다르게 읽는 변수명을 쓰는 일부 명령을 Bash 권한 검사가 자동 승인하던 문제 수정. 이제 승인을 묻는다
- `git clone` 옵션의 짧은 형태가 `sandbox.excludedCommands`의 `git *` 같은 git 패턴에서 sandbox 예외를 유지하던 문제 수정. 이제 긴 형태와 똑같이 취급한다
- 세션의 첫 feature-flag 요청이 프로젝트 settings에 설정된 프록시나 API 엔드포인트를 무시하던 문제 수정
- 브랜치를 `.git` 밖에 두는 레포(git 2.54+)에서 로컬 브랜치를 대상으로 `/ultrareview`가 커밋 안 된 작업을 말없이 업로드에서 빼던 문제 수정. 이제 설명과 함께 거부한다
- 컨테이너 재시작으로 대기 중이던 `/loop` wakeup이나 예약 작업을 잃으면 클라우드 세션이 계속 잠들어 있던 문제 수정. 이제 Claude에게 알려 주고, Claude가 다시 예약할 수 있다
- 2025년 11월 수정이 없는 PostgreSQL 버전에서 Claude apps gateway의 보존 정리 작업이 같은 순간 갱신된 복귀 개발자의 identity row를 지우던 문제 수정
- sandbox auto-allow에서 sandbox Monitor 도구 명령이 권한 프롬프트를 건너뛰던 문제 수정. 이제 권한 규칙을 따른다
- identity provider에 제시하는 인증서의 subject가 비어 있으면 Claude apps gateway가 시작하지 못하던 문제 수정
- `store.postgres_url`을 파싱하지 못하면 Claude apps gateway가 "Invalid URL"만 남기고 종료하던 문제 수정. 이제 오류에 설정 이름과 URL에 들어갈 수 있는 값을 적는다
- Mac이 절전에서 깨어나면 background agent가 "Agent stalled"로 실패하고 Workflow 도구 서브에이전트가 프롬프트부터 다시 시작하던 문제 수정
- managed settings가 느린 파일시스템(특히 WSL의 Windows 드라이브)의 많은 경로 읽기를 거부하면 VS Code 확장 같은 SDK 호스트에서 2.1.285 이후 시작이 느리거나 실패하던 문제 수정
- Bedrock, Vertex, Foundry, 커스텀 게이트웨이에서 컴퓨터 절전으로 끊긴 응답을 멈춘 스트림으로 취급하던 문제 수정
- `~/**/.env` 같은 sandbox read 규칙이 큰 폴더를 덮으면 Linux·WSL에서 첫 요청 전과 `/sandbox` Config 탭에서 멈추던 문제 수정
- 폴더 이름이 SKILL.md의 이름과 다르면(예: 영어가 아닌 이름) SKILL.md의 이름으로 요청한 스킬을 찾지 못하던 문제 수정. 스킬 목록에 두 이름을 모두 보여 준다
- plan을 보여 주기 전에 클라우드 세션의 컨테이너가 재시작되면 plan mode에서 작성한 plan이 사라지던 문제 수정
- 새 config 디렉터리에서 시작 몇 초 뒤 첫 명령이 실행되면 Bash 도구가 세션 내내 셸 alias, 함수, 플러그인 PATH 항목을 잃던 문제 수정
- HTTP MCP 서버가 매우 큰 응답을 보내면 메모리 사용이 끝없이 늘던 문제 수정
- 클라우드 세션 안에서 시작한 Claude Code 실행(예: Bash 도구에서 실행한 `claude -p`)에서 artifact 작업이 실패하던 문제 수정
- 원격 세션에서 파일을 네 개 이상 한 번에 보내면 가끔 "not the one approved"로 거부되던 문제 수정
- 터미널에서 `--continue`나 `--resume <session-id>`로 세션을 재개할 때 plan mode가 복원되지 않던 문제 수정
- 다른 GitHub 마켓플레이스의 다운로드 폴더와 같은 이름의 마켓플레이스가 그 마켓플레이스의 다운로드를 막던 문제 수정
- 자동 compaction 실행 중 Mac이 절전에 들어가면 "Prompt is too long"으로 포기하던 문제 수정
- 대화에 매우 큰 스택 트레이스나 소스 파일이 붙여 넣어져 있으면 rewind 메뉴(Esc Esc / `/rewind`)가 키 입력마다 수백 ms씩 멈추던 문제 수정
- 하위 디렉터리의 파일을 @-mention할 때 그 디렉터리의 AGENTS.md가 첨부되지 않던 문제 수정
- sessions 폴더가 상대 경로 심볼릭 링크이면 runner가 멈춘 뒤 재개한 self-hosted runner 세션이 "missing but already registered worktree"로 실패하던 문제 수정
- secret 스캔이나 권한 프롬프트가 토큰처럼 생긴 긴 텍스트를 만나면 멈추던 문제 수정
- 읽기 전용 명령의 일부 옵션 값에 든 와일드카드에 Bash 권한 검사가 Read deny 규칙이나 디렉터리 밖 읽기 차단을 적용하지 않던 문제 수정
- `CLAUDE_CODE_USER_DIALOG_TIMEOUT_MS=5m`을 5ms로 읽어 원격 대화상자를 바로 취소하던 문제 수정. 단위 접미사가 붙은 값은 이제 `dialogExpiry`로 대체한다
- MCP 서버의 도구 목록에 결합 문자가 매우 길게 이어지면 멈추던 문제 수정
- 한 프롬프트에서 겹친 두 붙여넣기가 하나의 붙여넣기 블록이 아닌, 일부는 타이핑한 텍스트로 모델에 전송되던 문제 수정
- 선택한 브라우저 연결이 끊겼을 때 Claude in Chrome의 브라우저 선택기가 Claude에게 보낼 메시지를 보여 주던 문제, 전환 후 VS Code 대화상자 목록이 갱신되지 않던 문제 수정
- 메인 세션이 다른 worktree에 들어가거나 나오면 background 서브에이전트가 자기 worktree에서 쓰기·Bash 권한을 잃던 문제 수정
- 머신의 managed settings가 게이트웨이 로그인을 강제하지 않는데 Claude apps gateway 뒤에서 백그라운드 명령, agents view, daemon worker가 Anthropic에 telemetry와 feature-flag 요청을 보내던 문제 수정
- `--restricted`(및 `CLAUDE_CODE_RESTRICTED=1`) 세션이 세션 간 메시징 소켓을 열던 문제 수정
- 유휴 상태로 백그라운드로 옮긴 세션이 재시작이나 유휴 정리 뒤 "no saved transcript"로 다시 열리던 문제 수정. 이제 대화를 이어서 재개한다
- bypass-permissions 고지에 동의하지 않았는데도 background worker가 respawn 때 `--allow-dangerously-skip-permissions`를 따르던 문제 수정
- 플러그인의 비동기 Stop 훅이 Application Support처럼 공백이 든 폴더 아래 스크립트 경로를 따옴표 없이 넘기면 Claude가 끝없이 응답하던 문제 수정
- secret masking이 매우 긴 끊김 없는 텍스트를 만나면 몇 초간 멈추던 문제 수정
- PreToolUse 훅이 도구 호출 입력을 바꿔 쓴 뒤 일부 권한 규칙과 안전 검사가 그 호출에 적용되지 않던 문제 수정
- `claude auth login` 후나 config 디렉터리에 자격 증명 파일이 이미 있을 때 첫 실행에서 로그인 방식을 다시 고르라고 하던 문제 수정
- 줄바꿈이 든 파일 이름이 파일 도구 오류와 권한 프롬프트에서 잘못 표시되던 문제 수정
- macOS 파일 이름처럼 악센트를 별도 문자로 저장한 텍스트가 든 큰 붙여넣기를 제자리에서 펼치면, 다음 키 입력 후 타이핑한 텍스트로 모델에 전송되던 문제 수정
- 키체인이 새 로그인을 거부하고 지울 수 없는 이전 로그인을 유지했는데도 macOS `/login`이 성공으로 보고하던 문제 수정
- `--include-partial-messages`를 쓰는 SDK 호스트에서 스트림이 끊기거나 중단되거나 non-streaming으로 fallback되면 턴이 끝난 뒤에도 응답이 열린 채로 남던 문제 수정
- `.claude/settings.json`이나 `.claude/settings.local.json`이 없으면 Linux의 sandbox Bash 명령이 실행 도중 `ConfigChange` 훅을 실행하고 설정을 다시 로드하던 문제 수정
- git이나 gh처럼 Claude Code가 실행하는 도구가 설치되어 있지 않으면 없는 프로그램 이름 대신 "Premature close" 오류가 나오던 문제 수정 (macOS, Linux)
- Linux에서 sandbox Bash 명령을 실행하거나 `.claude/scheduled_tasks.json`을 지우면 `/loop` 등 세션 전용 반복 예약 작업이 한 번 더 실행되던 문제 수정
- 심볼릭 링크인 settings 파일이 가리키는 원본 파일을 편집할 때 settings 파일 권한 질문 없이 진행되던 문제 수정
- 네트워크 프록시 뒤 MCP 시작 개선: 프록시가 차단한(HTTP 403) 서버를 더는 세 번 재시도하지 않는다
- background agent의 권한 프롬프트에 모든 background agent를 멈추는 Ctrl+X Ctrl+K 단축키를 표시하도록 개선
- 내장 `plugin-authoring` 스킬 개선: 직접 만든 mod를 다른 사람이 설치할 때 실행할 명령 하나를 알려 주고, README의 설치 섹션에 적는다
- 데스크톱 앱 Code 탭의 `/plugin` 응답 개선: 그곳에서 플러그인을 설치하고 관리하는 위치를 알려 준다
- Bash 변경 파일 보기 개선: 연결된 명령에 git merge, pull, checkout이 있으면 전체 diff 없이 파일 목록만 보여 준다
- upstream의 클라우드 자격 증명이나 연결이 실패할 때 Claude apps gateway 로그 개선: 경고 끝에 근본 원인을 적는다
- claude.ai 로그인 없이 클라우드 세션을 시작할 때 오류 개선: `claude auth login`과 /login을 안내하고, 더는 API 키 인증 탓으로 돌리지 않는다
- 바이너리 파일에 대한 Read 도구 메시지 개선: 그 형식을 읽을 수 있는 스킬이나 셸 명령을 Claude에게 알려 준다
- git config 파일 때문에 `/ultrareview` 업로드가 멈출 때 오류 개선: 길이가 절반 정도로 줄고, 어떤 종류의 파일이 문제인지 알려 준다
- `/ultrareview` 업로드가 checkout을 거부할 때 오류 개선: 알려진 원인마다 별도 메시지와 해결 방법을 보여 준다
- Claude apps gateway 개선: identity provider에 제시하는 인증서 만료 전 마지막 30일 동안 경고를 로그에 남긴다
- Claude in Chrome 개선: `browser_batch` 호출의 타임아웃이 60초에서 90초로 늘었다
- Claude apps gateway 브라우저 로그인 페이지 개선: 브랜드 폰트, 가운데 정렬 레이아웃, 다크 모드
- 큰 세션 재개 중 반응성 개선: transcript를 로드하는 동안에도 타이머, 입력, 렌더링이 계속 동작한다
- / 와 @ 제안 목록 개선: 선택한 행이 ❯ 포인터로 시작해 색 없이도 알아볼 수 있다
- `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC`이 시작 시 연결 warm-up도 건너뛰도록 변경
- 프로젝트 settings 파일로 Claude in Chrome을 켤 수 없도록 변경. `--chrome`, `/chrome`, 사용자 settings를 쓴다
- Bash 도구가 `pyright` 실행 전에 권한을 묻도록 변경. 더는 읽기 전용 명령으로 취급하지 않는다
- 자식 프로세스가 실행된 뒤 다른 mod가 거부할 때 mod의 `$.process.spawn`이 내는 거부 사유 변경: 호출은 실행됐고 플러그인이 결과를 보류했다고 알려 준다
- 백그라운드 데몬 로그가 여러 줄 메시지를 JSON 인용 문자열 한 줄로 쓰도록 변경
- 스킬과 커스텀 커맨드가 탭·줄바꿈 외의 원시 제어 문자가 든 `!` 셸 명령을 거부하고, 그 위치를 보여 주는 메시지를 내도록 변경
- `/artifacts` 변경: 브라우저에서 artifact를 열면 목록이 닫힌다
- Bash 권한 검사 변경: 더 많은 형태의 `ps` 명령이 묻지 않고 실행되는 대신 승인을 묻는다
- 플러그인 훅 변경: 긴 텍스트를 거부하거나 말없이 버리지 않고 잘라서 로그에 남긴다
- 예약 작업이 사라진 백그라운드 세션 변경: 약 20초 뒤 Completed로 옮겨지고, 유휴 상태일 때 업데이트하거나 종료할 수 있다
- 방금 비운 프롬프트의 "Press ← again" 확인 변경: 두 번째 ←가 1초를 기다리지 않고 바로 전환하며, ←를 누르고 있어도 전환된다
- `/ultrareview` 업로드가 git 단계에서 실패할 때 오류 변경: 실패한 단계와 시도할 방법을 알려 주고, git 자체 오류 텍스트를 반복하지 않는다
- tuned 리뷰 설정이 없는 모델(Opus 5.5, Sonnet 5.5 포함)에서도 medium effort `/code-review`가 cleanup과 CLAUDE.md 규칙 지적을 보고하도록 변경
- Agent 결과에서 in-process 팀원의 `agent_id`를 agent ID로 변경(`name@team` 주소는 `teammate_id`에 남는다). TeammateIdle 훅이 그 팀원의 서브에이전트나 fork에서 더는 실행되지 않는다
- 예약된 wakeup(`/loop`)을 기다리는 백그라운드 세션 변경: 업데이트나 메모리 부족 상황에서도 계속 실행된다. 재시작이나 종료로 wakeup을 말없이 잃을 수 있었기 때문이다
- `claude agents`에서 바쁜 백그라운드 세션에 보낸 `/model`, `/effort`, `/rename`이 턴이 끝날 때가 아니라 확인 없이 바로 적용되도록 변경
- Claude apps gateway의 최소 지원 PostgreSQL 버전을 14에서 11로 변경
- interactive 세션의 WebSearch 한도를 200회 소진 시 종료하는 방식에서 시간이 지나며 다시 채워지는 방식(시간당 100회)으로 변경. `CLAUDE_CODE_WEB_SEARCH_REFILLS_PER_HOUR`로 속도를 정하고, 0이면 끈다
- 레포의 `.claude/settings.json`이나 `.claude/settings.local.json`으로 `CLAUDE_CODE_DISABLE_ATTACHMENTS`를 설정할 수 없도록 변경. 셸, 사용자, managed settings에서는 여전히 설정할 수 있다
- 디렉터리에서 로드한 플러그인에 대한 `claude plugin update`가 내장 플러그인처럼 "Failed to update plugin" 접두어 없이 사유만 출력하도록 변경
- 클라우드 세션의 내장 `gh api` 변경: `GH_HOST`나 `GH_REPO`에 github.com이 아닌 호스트를 설정하면 거부한다(`--hostname`이나 전체 URL을 쓴다). 다른 호스트로 가는 요청은 stderr에 표시한다
- `claude-api` 스킬의 Managed Agents 예제 변경: 에이전트에 필요하지 않으면 웹 도구를 끄고, `auto` 권한 정책을 쓴다
- Self-hosted runners: `claude --environment <id>`가 현재 Sessions API로 세션을 만들도록 변경. 출력과 JSON의 세션 id는 session_… 형태를 유지한다
- [VSCode] Claude가 작업 중일 때 메시지를 보내면 스크린 리더가 "Message queued."를 읽도록 추가
- [VSCode] Manage plugins 대화상자에서 플러그인 마켓플레이스의 설치·업데이트 명령을 검토하고 실행하는 방법 추가
- [VSCode] 아무것도 입력하지 않은 빈 채팅 자리에 저장된 대화를 열어도 백그라운드 Claude 프로세스가 계속 실행되던 문제 수정
- [VSCode] 저장 중 Claude Code가 예기치 않게 멈췄는데 settings 대화상자가 타임아웃 탓으로 돌리던 문제 수정
- [VSCode] 커밋 안 된 변경을 확인하지 못했는데도 브랜치 전환 대화상자가 전환을 제안하던 문제 수정
- [VSCode] 열린 대화상자 뒤에서 도착한 권한 프롬프트가 키보드 포커스를 가져가, 대화상자에서 누른 키가 프롬프트에 답하던 문제 수정
- [VSCode] Claude Code가 프로그램을 찾거나 시작하지 못할 때 로그인과 새 세션이 분명한 이유를 알려 주지 않던 문제 수정
- [VSCode] agent map이 중첩된 서브에이전트를 "Tool calls (0)"으로 표시하고, 그것이 시작한 에이전트를 메인 에이전트 아래에 두던 문제 수정
- [VSCode] Continue After Reload 개선: VS Code가 확장을 재시작한 뒤 다시 열린 탭이 재시작으로 중단된 단계도 마저 끝낸다
- [VSCode] 메시지의 파일 pill 개선: 마우스를 올리면 프로젝트 폴더 기준 경로가 보여 같은 이름의 파일을 구분할 수 있다
- [VSCode] 메시지 타임스탬프를 기본으로 표시하도록 변경 (Claude Code: Show Message Timestamps 설정으로 끈다)
- [Cloud sessions] 클라우드 환경 변수로 프롬프트 제안을 꺼도 새 클라우드 세션에 적용되지 않던 문제 수정
- [Cloud sessions] Claude의 응답이 끝난 뒤에도 클라우드 세션의 작업 표시가 몇 초간 계속 돌던 문제 수정. 이제 응답과 함께 멈춘다
- [Cloud sessions] 한 번도 실행하지 않은 routine 페이지에서 Run now를 눌러도 History가 계속 "No runs yet"을 보여 주던 문제 수정. 이제 새 실행을 보여 준다
- [Cloud sessions] 보관 해제한 클라우드 세션이 메시지를 다시 보낼 때까지 Claude가 작업 중인 것처럼 보이던 문제 수정
- [Remote Control] 방금 Remote Control을 시작한 컴퓨터가 새 세션의 Remote Control 메뉴에 나타나기까지 최대 1분 걸리던 문제 수정. 이제 몇 초 안에 나타난다
- [Claude Tag] Slack에 fast mode 추가: Claude를 `!fast`로 멘션하면 스레드가 fast mode로 바뀌고, 필요하면 Opus로 옮긴다. `!fast off`로 되돌린다. 켜져 있는 동안 응답에 (fast)가 표시된다
- [Claude Tag] access bundle에서 커스텀 연결을 만들 때 선택 항목인 Path prefixes 필드 추가: allow 규칙이 호스트 전체가 아닌 해당 경로만 허용한다
- [Claude Tag] Claude Tag Admin 권한이 있는 멤버가 Activity 페이지 Memory 탭에서 "Couldn't load memory files"를 받던 문제 수정. 이제 workspace와 channel 메모리를 읽을 수 있다
- [Claude Tag] Slack의 Claude 설정 카드에서 workspace 게스트가 Confirm을 누르면 모든 사람에게서 버튼이 사라지던 문제 수정. 거부 메시지는 게스트에게만 보이고, 멤버는 계속 확인하거나 취소할 수 있다
- [Claude Tag] Slack 채널의 예약 routine이 채널 기본값이 아닌 모델로 실행되던 문제 수정. 새 세션을 시작하는 실행마다 현재 기본 모델을 쓴다
- [Claude Tag] 채널 이름 규칙으로 붙인 access bundle의 GitHub 레포가 그 규칙이 적용되는 채널에서 거부되던 문제 수정. 이제 Claude가 그곳에서 레포를 추가, 나열, 클론할 수 있다
- [Claude Tag] 본인 Claude 플랜의 사용 한도에 도달했을 때 DM으로 오는 Claude 알림 개선: 몇 초 안에 표시되고, 한도가 초기화되는 시각을 알려 준다
- [Claude Tag] 이전 Claude in Slack 앱이 세션을 시작하지 못할 때 응답 개선: 무엇이 실패했고 누가 고칠 수 있는지 알려 준다. 전체 내용은 스레드마다 한 번만 보낸다
- [Claude Tag] 채널 지시문 한도를 8,192바이트에서 8,192자로 변경해 영어가 아닌 텍스트도 같은 분량을 쓸 수 있게 하고, Configure 페이지의 Save 옆에 글자 수 표시 추가
- [Code Review] 차단 수준 리뷰 코멘트가 심각도와 맞지 않는 "nit" 라벨로 시작하던 문제 수정
- [Code Review] Code Review를 끈 조직의 fork·Manual 모드 PR에 "@claude review" 코멘트 안내가 게시되던 문제 수정

---

## 🎯 챌린지

이번 버전에서 내 환경에 적용해볼 만한 항목입니다.

### 1. `language` 설정을 한국어로 고정
- **파일**: `~/.claude/settings.json`
- **근거**: 이번 버전부터 You should know가 `language` 설정을 따른다. CLAUDE.md §8은 사용자에게 보이는 텍스트를 한국어로 쓰라고 정하는데, 받은 settings 요약(4KB에서 잘림)에는 `language` 키가 없다. `"language": "korean"`을 추가하면 프롬프트 지시 없이 설정만으로 언어가 고정된다. 이미 설정되어 있으면 이 항목은 건너뛴다.
- **난이도**: ★☆☆ (약 5분)

### 2. changelog-sync 스킬의 CHANGELOG 가져오기 방식 점검
- **파일**: `~/.claude/skills/claude-changelog-sync/SKILL.md`
- **근거**: GitHub raw `CHANGELOG.md`는 100,000자를 훌쩍 넘는다. 이전 버전의 WebFetch는 그 뒤를 말없이 버렸다. 스킬이 WebFetch로 원문을 가져온다면 오래된 버전이 누락됐을 수 있다. 가져오는 방식을 `curl -fsSL`로 고정하거나, 새 `offset` 파라미터로 끝까지 읽도록 명시한다. 매일 08:00 자동 실행의 누락을 막는다.
- **난이도**: ★★☆ (약 15분)

### 3. 치명 등급 리뷰의 `/code-review` effort 기준 명시
- **파일**: `~/.claude/CLAUDE.md` (§7 Review, §7.1 치명 등급)
- **근거**: 이번 버전부터 Opus 5.5에서 medium effort `/code-review`도 CLAUDE.md 규칙 위반과 cleanup을 지적한다. 지금 기본 effort가 `xhigh`이므로, effort를 적지 않으면 리뷰가 지나치게 넓어질 수 있다. 치명 등급은 `/code-review high`, 일반 규칙 점검은 `/code-review medium`처럼 effort를 명시하면 §7.1의 "검증 중복 방지" 원칙과 맞는다.
- **난이도**: ★☆☆ (약 10분)

### 4. `deploy-guard.sh` 우회 패턴 회귀 테스트
- **파일**: `~/.claude/hooks/deploy-guard.sh`
- **근거**: 이번 버전에서 Claude Code는 `export B=feat/x`처럼 변수 접두로 이름을 숨긴 명령을 deny 규칙이 놓치던 문제와, 와일드카드 펼침 문제를 고쳤다. 같은 우회가 문자열 매칭 기반인 이 훅에서도 통할 수 있다. 다음 명령을 넣어 모두 차단되는지 확인하고, 통과하는 패턴은 막는다.
  - `git push origin HEAD:feat/x`
  - `git push -u origin fix/y`
  - `B=feat/x; git push origin "$B"`
  - `git -C repo push origin feat/z`
- **난이도**: ★★★ (약 25분)
