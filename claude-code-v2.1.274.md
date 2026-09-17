# Claude Code v2.1.274

> 작성일: 2026-09-17

---

# 📋 요약본

## 🎉 신기능 (11건)
- **메모리 위험 경고 표시** — 메모리 사용량이 위험 수준에 도달하면 눈에 보이는 경고가 뜬다. 메모리를 비우거나 안전하게 재시작하는 방법도 함께 안내한다.
- **`CLAUDE_CODE_MCP_STARTUP_WAIT_MS`** — 비대화형 첫 턴이 연결 중인 MCP 서버를 얼마나 기다릴지 상한을 정한다. `0`이면 기다리지 않는다.
- **OTel `effort` 속성 추가** — `claude_code.llm_request` 트레이스 스팬에 `effort` 속성이 붙는다. `api_request` 이벤트와 동일한 값이다.
- **`claude_code.managed_settings_resolved` OTel 이벤트** — 관리 설정(managed settings)의 출처와 정책 헬퍼 상태를 남긴다. `OTEL_LOG_MANAGED_SETTINGS=1`을 켜면 마스킹된 설정값과 다이제스트도 기록한다.
- **`store.connect_timeout_seconds`** — Claude apps 게이트웨이 설정에서 Postgres 접속 타임아웃을 늘릴 수 있다(기본 5초). DB에 닿지 않을 때의 부팅 에러도 `store.postgres_url`과 설정된 타임아웃을 짚어준다.
- **`enduser.sub` 텔레메트리** — Claude Desktop과 Cowork가 Claude apps 게이트웨이로 보내는 텔레메트리에 IdP 주체(subject) 식별자가 포함된다.
- **게이트웨이 동시요청 한도 경고** — 복제본이 상류로 한 번에 보내는 256개보다 많은 요청을 열고 있으면 경고한다. 시작 로그에도 그 한도를 찍는다.
- **접힌 메시지 클릭 펼치기** — 전체화면 모드에서 접힌 팀메이트·에이전트 메시지를 클릭해 펼칠 수 있다.
- **[VSCode] 창 리로드 중단 지점 이어가기** — 창을 다시 로드하느라 끊긴 단계를 이어서 진행하고, 채팅에 그 사실을 표시한다. Claude Code: Continue After Reload 설정으로 끌 수 있다.
- **[VSCode] Customize 메뉴에 Memory·Instructions 추가** — Memory는 자동 메모리 토글·저장된 메모리·메모리 폴더를 보여주고, Instructions는 CLAUDE.md 파일을 편집한다.
  - `claudeCode.lockEditorGroups` 설정도 추가됐다. Claude가 여는 에디터 그룹을 잠그지 않게 만든다.
- **[Claude Code on the web] 비교 대상 브랜치 선택** — 클라우드 세션 diff 화면에서 base 브랜치 말고 임의의 브랜치와 비교할 수 있다.
  - [Claude Tag] Add channel·Add workspace 폼에 Guests 설정이 추가돼 Inherit·Allow·Channel only·Restrict 중에서 미리 고를 수 있다.

## 🛠️ 개선/수정 (다수)
- **끊기지 않는 400 재시도 루프 해결** — "unexpected tool_use_id" 400 에러로 세션이 무한 재시도에 빠지던 문제. 손상된 트랜스크립트는 가능하면 스스로 복구하고, 안 되면 `/rewind` 힌트가 붙은 명확한 에러로 루프를 끝낸다.
- **MCP 연결·타임아웃·알림 계열 수정** — `http`로 설정했지만 구형 HTTP+SSE만 쓰는 서버가 첫 요청 422/4xx로 연결 실패하던 문제, Streamable HTTP 도구 호출이 서버별 `timeout`을 길게 잡아도 약 5분에 끊기던 문제, 서버가 `listChanged` 선언 없이 list-changed 알림을 보낼 때 프롬프트·리소스가 갱신되지 않던 문제를 고쳤다.
- **403 insufficient_scope 오인 수정** — 권한 부족으로 거절된 MCP 호출을 "로그인 만료"로 잘못 알리던 문제. 이제 빠진 권한 이름과 `/mcp` 재인증 경로를 알려준다.
- **`/goal` 관련 수정** — 반응형 압축 뒤 컨텍스트가 또 넘칠 때 압축 대신 "Prompt is too long"으로 끝나던 문제, 압축된 세션을 `--continue`/`--resume` 할 때 활성 `/goal`이 사라지던 문제를 고쳤다.
- **`claude agents` 플래그 유실** — 자동 업데이트 재실행 뒤 `--model`, `--effort`, `--permission-mode`, `--allow-dangerously-skip-permissions`, `--agent`가 날아가던 문제.
- **Bedrock/Vertex/Foundry에서 `model: "opus"` 서브에이전트** — 모델 ID에서 계열을 알아볼 수 없으면 세션 모델을 벗어나던 문제 수정(`ANTHROPIC_DEFAULT_OPUS_MODEL` 지정 시는 예외).
- **셸 프로필 재소싱 stall 제거** — 플러그인 리로드마다 Bash 도구가 셸 프로필을 다시 읽어 다음 명령이 수 초 멈추던 문제. 이제 플러그인 `bin/` 디렉터리가 바뀐 경우에만 다시 읽는다.
- **보안 관련 수정 3건** — MCP 설정의 `${VAR}` 플레이스홀더에서 풀린 시크릿이 에러·도구 설명에 노출되던 문제, 특수 셸 변수를 순회·대입하는 Bash 명령이 권한 확인 없이 지나가던 문제, worktree 격리 세션이 중첩 셸 확장이 든 명령을 받아들이던 문제.
- **백그라운드 명령 조기 종료** — 가벼운 메모리 압박만 있어도 30분 유휴 후 중단되던 문제. 이제 메모리가 정말 위험할 때만 중단하고, 디버그 로그에 이유를 남긴다.
- **`/code-review` 방식 변경** — 튜닝된 설정이 없는 모델에서는 다수의 리뷰 서브에이전트를 띄우는 대신 가벼운 인라인 리뷰 프롬프트를 쓴다.
- **`"type": "sdk"` MCP 항목 무시** — `.mcp.json`·설정·플러그인·에이전트 파일의 sdk 항목은 경고와 함께 건너뛴다. 인프로세스 서버 등록은 SDK 호스트 앱만 할 수 있다.
- **v2 MCP 클라이언트 기본 적용 확대** — Bedrock·Vertex·Foundry·텔레메트리 비활성 설치도 v2 클라이언트와 MCP 2026-07-28 협상을 기본으로 쓴다(해제: `MCP_SDK_GENERATION=v1` 또는 `MCP_PROTOCOL_NEGOTIATION=legacy`).
- **[VSCode] 설정 파일 손상 수정** — 확장에서 설정 쓰기가 겹치면 `~/.claude/settings.json`이 파싱 불가가 되거나 설정 한 개가 사라지던 문제.
- **[Claude Code on the web] 루틴 안정화** — 루틴 수정 시 두 번 실행되거나 방금 멈춘 루틴이 다시 켜지던 문제, GitHub 연결이 없을 때 첫 실패에 바로 꺼지는 대신 최대 72시간 재시도하도록 변경.

## 🔑 이번 버전의 핵심 키워드
**"멈추지 않게 만든다"** — 무한 재시도 루프·5분 MCP 타임아웃·유휴 강제 종료·프로필 재소싱 stall 등 세션을 붙잡아 두던 지점을 걷어낸 안정화 버전.

---

# 📜 원문 (한글 번역본)

> 원문 ChangeLog를 원래 순서 그대로 한 줄도 빠짐없이 번역한 문서입니다.

- 메모리 사용량이 위험 수준일 때 눈에 보이는 경고를 추가했다. 메모리를 비우거나 안전하게 재시작하는 절차도 함께 안내한다
- `CLAUDE_CODE_MCP_STARTUP_WAIT_MS`를 추가해, 비대화형 첫 턴이 연결 중인 MCP 서버를 기다리는 시간의 상한을 정한다(`0` = 기다리지 않음)
- `claude_code.llm_request` OpenTelemetry 트레이스 스팬에 `effort` 속성을 추가했다. `api_request` 이벤트와 값이 같다
- `claude_code.managed_settings_resolved` OTel 이벤트를 추가했다. 관리 설정의 출처와 정책 헬퍼 상태를 담고, `OTEL_LOG_MANAGED_SETTINGS=1`이면 마스킹된 설정값과 다이제스트도 담는다
- Claude apps 게이트웨이 설정에 `store.connect_timeout_seconds`를 추가해 Postgres 접속 타임아웃을 늘릴 수 있게 했다(기본 5초). 또 DB에 닿지 않을 때의 부팅 에러가 `store.postgres_url`과 설정된 타임아웃을 짚도록 개선했다
- Claude Desktop과 Cowork가 Claude apps 게이트웨이로 보내는 텔레메트리에 IdP 주체인 `enduser.sub`를 추가했다
- 복제본이 상류로 한 번에 보내는 256개보다 많은 요청을 열고 있을 때 Claude apps 게이트웨이가 경고하도록 하고, 그 한도를 보여주는 시작 로그 줄을 추가했다
- 전체화면 모드에서 접힌 팀메이트·에이전트 메시지에 클릭해 펼치기를 추가했다
- "unexpected tool_use_id" 400 에러를 끝없이 재시도하며 세션이 멈추던 문제를 고쳤다. 손상된 트랜스크립트는 가능하면 스스로 복구되고, 그렇지 않으면 `/rewind` 힌트가 붙은 명확한 에러로 루프를 끝낸다
- `http`로 설정했지만 구형 HTTP+SSE만 말하는 MCP 서버가 첫 요청에 422 등 4xx로 답할 때 연결에 실패하던 문제를 고쳤다
- 서버별 `timeout`을 더 길게 설정해도 Streamable HTTP MCP 도구 호출이 약 5분 뒤 타임아웃되던 문제를 고쳤다
- 서버가 `listChanged`를 선언하지 않고 list-changed 알림을 보낼 때 MCP 프롬프트와 리소스가 갱신되지 않던 문제를 고쳤다
- 403 insufficient_scope로 거절된 MCP 도구 호출이 로그인 만료로 보고되던 문제를 고쳤다. 이제 에러가 빠진 권한을 명시하고 `/mcp` 재인증을 안내한다
- 훅 기반 세션(예: 활성 `/goal`)이 반응형 압축 뒤 컨텍스트가 다시 넘쳤을 때 압축하지 않고 "Prompt is too long"으로 끝나던 문제를 고쳤다
- 압축이 일어난 세션을 재개(`--continue` / `--resume`)할 때 활성 `/goal`이 사라지던 문제를 고쳤다
- 자동 업데이트 재실행 후 `claude agents`가 `--model`, `--effort`, `--permission-mode`, `--allow-dangerously-skip-permissions`, `--agent`를 잃던 문제를 고쳤다
- 언어 서버가 수천 개 파일에 대한 프로젝트 전역 진단을 발행할 때 턴마다 느려지던 문제를 고쳤다
- Bedrock·Vertex·Foundry에서 `model: "opus"` 서브에이전트가, 모델 ID에 알아볼 수 있는 모델 계열이 없을 때 세션 모델을 벗어나던 문제를 고쳤다(`ANTHROPIC_DEFAULT_OPUS_MODEL`이 설정된 경우는 제외)
- 셀프 호스트 러너 세션이 토큰 갱신 몇 번 실패한 뒤 다음 예약 갱신까지 매 턴 401로 실패하던 문제를 고쳤다. 이제 러너가 계속 재시도하고, 401을 받으면 새 토큰을 가져온다
- 로컬 파일 경로 클릭 링크가 VS Code 등 `file://` URI를 요구하는 터미널에서 아무 동작도 하지 않던 문제를 고쳤다
- 트랜스크립트가 사용자 메시지의 순서 목록 번호를 다시 매기던 문제를 고쳤다("3. 2. 1."을 입력하면 "3. 4. 5."로 표시). 이제 숫자와 "N)" 표기가 입력한 대로 보인다
- AskUserQuestion 미리보기 메모가 강조된 선택지가 아니라 이전에 고른 선택지에 붙던 문제를 고쳤다
- AskUserQuestion 미리보기 모드에서 Enter로 메모를 제출할 때 강조된 선택지가 사라지던 문제를 고쳤다
- 재개된 백그라운드 에이전트가, 중단된 도구 배치 중 하나가 메시지와 함께 승인됐을 때 그 배치의 절반을 그대로 들고 있던 문제를 고쳤다
- `CLAUDE_CODE_RESUME_INTERRUPTED_TURN`으로 시작한 로컬 `claude -p --resume`이 이전 프로세스가 끝내지 못한 백그라운드 작업을 보고하지 않던 문제를 고쳤다
- 클라우드 세션의 첫 턴이, 아직 연결 중이던 SDK 호스팅 MCP 서버의 도구 없이 시작되던 문제를 고쳤다
- 백그라운드 에이전트 알림이, 에이전트가 자기 백그라운드 작업을 기다리며 곧 재개될 상황인데도 진행 중인 백그라운드 작업이 없다고 말하던 문제를 고쳤다
- Claude Desktop 세션의 에러 힌트를 고쳐, 거기서 쓸 수 없는 CLI 플래그 대신 `/usage-credits` 같은 슬래시 명령을 안내하도록 했다
- Claude가 루틴 목록 조회가 반환하는 형태로 루틴을 작성했을 때 `/schedule`이 프롬프트의 메시지 역할(role)을 빼고 저장하던 문제를 고쳤다
- `/status`가 자기 에러 배너에서 확인하라고 안내한 `apiKeyHelper` 실패를 정작 보여주지 않던 문제를 고쳤다
- 조직의 관리형 fast mode 정책 아래에서 비대화형 세션의 `/fast on`이 켜졌다고 보고한 뒤 꺼지던 문제를 고쳤다. 이제 조직이 비활성화했다고 알린다
- Artifact 도구가 아티팩트 업데이트 승인을 요구해 놓고, 세션이 최신 버전을 읽지 않았다는 이유로 그 업데이트를 거절하던 문제를 고쳤다
- 네트워크 접근이 켜진 Cowork·claude.ai 클라우드 세션이 팀메이트 아티팩트 읽기를 네트워크 접근이 꺼진 것처럼 다루던 문제를 고쳤다
- 자체 git 저장소가 없는 플러그인·마켓플레이스 디렉터리가 상위 git 저장소(예: git으로 관리되는 `~/.claude`)에서 버전을 가져오던 문제를 고쳤다
- 빈 `--mcp-config`와 함께 쓴 `--strict-mcp-config`가 부수적인 MCP 서버 때문에 비대화형 첫 턴을 최대 `MCP_TIMEOUT`만큼 붙잡던 문제를 고쳤다
- Stop 프롬프트 훅이 차단할 때마다 프롬프트 전체를 다시 보내던 문제를 고쳤다. 반복 차단은 이제 500자 라벨로 조건만 알린다
- Cursor 또는 VS Code 터미널 안에서 실행할 때 Wayland 환경의 Linux에서 시작 시 빈 에디터 창이 더 열리던 문제를 고쳤다
- 지출 확인 중 Postgres가 연결을 끊을 때 Claude apps 게이트웨이에서 처리되지 않은 프로미스 거절이 발생하던 문제를 고쳤다
- Claude apps 게이트웨이가 SIGTERM에 열린 스트림을 전부 끊던 문제를 고쳤다. 이제 진행 중인 요청이 최대 25초까지 끝나게 둔 뒤 종료한다(`CLAUDE_GATEWAY_DRAIN_TIMEOUT_MS`)
- 플러그인 정책이 원격 관리 설정에서 올 때 시작할 때마다 `installed_plugins.json`이 거의 매번 다시 쓰이던 문제를 고쳤다. 이 때문에 Claude Desktop이 열린 모든 세션의 플러그인을 다시 로드했다
- 헤드리스·SDK 세션이 끝난 백그라운드 작업마다 별도의 모델 호출을 하던 문제를 고쳤다. 이미 대기열에 쌓인 완료 건은 이제 한 번의 호출로 처리한다
- 플러그인 리로드마다 Bash 도구가 셸 프로필을 다시 읽어(다음 명령에서 수 초 지연) 발생하던 문제를 고쳤다. 이제 플러그인의 `bin/` 디렉터리가 바뀐 경우에만 다시 읽는다
- `hooks/hooks.json`에 최상위 `$schema`가 있는 플러그인에 "unknown key" 알림이 뜨던 문제를 고쳤다
- MCP 연결 에러와 MCP 로그인 도구 설명에 MCP 설정의 `${VAR}` 플레이스홀더에서 풀린 시크릿이 노출되던 문제를 고쳤다
- 특정 특수 셸 변수를 순회하거나 대입하는 명령의 Bash 권한 확인 문제를 고쳤다. 이런 명령은 이제 권한을 묻는다
- worktree 격리 세션이 특정 중첩 셸 확장이 든 Bash 명령을 받아들이던 문제를 고쳤다. 이제 거절한다
- 멀티바이트 문자가 있는 파일에서 Edit 권한 프롬프트 미리보기가 실제 승인되는 편집과 다른 위치를 보여주던 문제를 고쳤다
- 가벼운 메모리 압박만 있는 머신에서 백그라운드 명령이 30분 유휴 후 중단되던 문제를 고쳤다. 이제 메모리가 위험하게 낮을 때만 중단하고, 디버그 로그에 그 이유를 적는다
- 서브에이전트가 메인 세션에 보낸 메시지가 재실행 후 Claude Desktop 트랜스크립트에서 사라지던 문제를 고쳤다
- `.zip`에서 로드된 플러그인이 여러 리로드가 겹친 뒤 오래된 추출본으로 제공되던 문제를 고쳤다
- 서브에이전트의 진행 요약이 제멋대로 길어진 여러 문단의 답변으로 대체되던 문제를 고쳤다
- `--input-format stream-json` 세션의 시작을 개선했다. 첫 턴이 도구 검색으로 지연되는 도구를 가진, 아직 연결 중인 MCP 서버를 최대 2초 기다리지 않는다. 그 도구들은 이후 턴에 들어온다
- Monitor 도구 알림을 개선했다. 스크립트의 최종 출력과 종료가 두 번이 아니라 한 번의 알림으로 도착해 모델 턴을 아낀다
- Artifact 도구 에러를 개선했다. claude.ai에 로그인되어 있지 않으면 터미널이 첫 시도에 그렇게 알리고, Claude에게는 거절된 호출을 더 빨리 그만 재시도하라고 알린다
- 아티팩트 게시를 개선했다. 오래된 버전 위에서 만든 게시는 전송 전에 중단되고, 병합할 최신 페이지를 알려준다
- 서브모듈 체크아웃이 든 에이전트 worktree를 제거하기 전의 안전 확인을 개선했다
- `OTEL_LOG_RAW_API_BODIES=file:<dir>` 출력을 개선했다. 새 `index.jsonl`과 `request_body_id` / `message.id` 이벤트 속성이 각 응답을 요청 파일·트랜스크립트 메시지와 연결한다
- Claude apps 게이트웨이 부팅을 개선했다. 종료 전에 첫 Postgres 연결을 최대 세 번 시도하므로, 몇 초 늦게 닿는 DB 때문에 부팅이 실패하지 않는다
- 부하 상태의 Claude apps 게이트웨이 지출 한도 확인을 개선했다. DB 왕복이 네 번에서 한 번으로 줄어, 바쁜 게이트웨이에서 타임아웃되는 확인이 줄어든다
- Claude apps 게이트웨이 로그인 속도 제한 에러를 개선했다. `/login`이 거절 사유를 설명하고, 게이트웨이 로그가 어떤 한도에 걸렸는지와 어떤 설정을 바꿔야 하는지 알려준다
- Bedrock·Vertex·Foundry·텔레메트리 비활성 설치도 다른 설치와 마찬가지로 직접 HTTP 서버에 v2 MCP 클라이언트와 MCP 2026-07-28 협상을 기본으로 쓰도록 바꿨다(해제: `MCP_SDK_GENERATION=v1` 또는 `MCP_PROTOCOL_NEGOTIATION=legacy`)
- `/code-query`가 아니라 `/code-review`를, 자체 튜닝 설정이 없는 모든 모델에 대해 다수의 리뷰 서브에이전트를 띄우는 대신 더 가벼운 인라인 리뷰 프롬프트를 쓰도록 바꿨다
- `.mcp.json`·설정·플러그인·에이전트 파일의 `"type": "sdk"` MCP 항목을 경고와 함께 건너뛰도록 바꿨다. 인프로세스 서버 등록은 SDK 호스트 애플리케이션만 할 수 있다
- 로컬 세션의 아티팩트 감시 방식을 바꿨다. 다른 곳에서 새 버전이 게시돼도 턴이 시작되지 않고, Claude는 이후 Artifact 도구 결과에서 그 사실을 알게 된다
- 플러그인·마켓플레이스 클론이 Git LFS 파일을 내려받지 않고 포인터로 두도록 바꿨다. 체크아웃에서 `git lfs pull`로 가져온다
- 셀프 호스트 러너가, 접근 확인 단계에서 git 호스트가 거부하는 읽기 전용 저장소를 세션 시작 실패로 만들지 않고 건너뛰도록 바꿨다
- `/status`의 GitHub 줄을 "Cloud sessions"로, `/web-setup`·`/ultrareview`·텔레포트 메시지를 "Claude Code on the web" 대신 "cloud session"으로 바꿨다
- [VSCode] 창 리로드로 끊긴 단계를 이어서 진행하고 채팅에 표시하는 기능을 추가했다. Claude Code: Continue After Reload 설정으로 끌 수 있다
- [VSCode] Customize 메뉴에 Memory와 Instructions 항목을 추가했다. Memory는 자동 메모리 토글·저장된 메모리·메모리 폴더를 보여주고, Instructions는 CLAUDE.md 파일을 편집한다
- [VSCode] Claude가 자신이 여는 에디터 그룹을 잠그지 않게 하는 `claudeCode.lockEditorGroups` 설정을 추가했다
- [VSCode] 새 대화의 처음 몇 초 안에 물은 `/btw` 곁가지 질문이 가끔 다른 세션의 곁가지 질문 기록을 보여주던 문제를 고쳤다
- [VSCode] 확장이 전역 gitignore 파일을 처음 찾을 때 잠깐 멈추던 문제를 고쳤다
- [VSCode] Claude가 도구를 실행하는 동안 보낸 메시지가 창 리로드 후 대화에서 사라지던 문제를 고쳤다
- [VSCode] Manage Plugins의 활성화 토글과 MCP 서버 대화상자 행에 키보드로 접근할 수 없던 문제를 고쳤다
- [VSCode] Environment Variables 설정에서 `CLAUDE_CONFIG_DIR`이 바뀐 뒤, 터미널에서 한 로그인·로그아웃이 리로드 전까지 반영되지 않던 문제를 고쳤다
- [VSCode] 채팅의 Edit diff가 특정 패널 너비와 길게 줄바꿈된 줄에서 아래가 잘리던 문제를 고쳤다. 이제 diff 상자가 보여주는 행 수에 맞춰진다
- [VSCode] 확장의 설정 쓰기가 겹쳐 `~/.claude/settings.json`이 파싱 불가가 되거나 설정 하나가 사라지던 문제를 고쳤다
- [VSCode] Open in New Tab(Ctrl/Cmd+Shift+Esc)이 가끔 새 탭의 입력창에 포커스를 주지 않아, 클릭하기 전까지 입력이 아무 데도 가지 않던 문제를 고쳤다
- [VSCode] 닫은 Claude 탭을 다시 열 때, 그 잠긴 그룹에 다른 Claude 탭과 파일이 남아 있으면 에디터 레이아웃이 쪼개지던 문제를 고쳤다
- [VSCode] 파일 탭이 Claude 탭과 같은 그룹을 쓰고 있을 때마다 New session이 잠긴 에디터 그룹을 또 열던 문제를 고쳤다
- [VSCode] 세션 선택기에서 검색어를 입력하는 동안 세션 이름이 좌우로 밀리던 문제를 고쳤다
- [VSCode] 계획에 코멘트가 여럿 달렸을 때 계획 리뷰 카드가 Send feedback 버튼과 사유 입력란을 잘라내던 문제를 고쳤다. 이제 코멘트 목록이 스크롤된다
- [VSCode] High Contrast 테마에서 채팅 답변의 인라인 코드와 코드 블록이 읽기 어렵던 문제를 고쳤다
- [VSCode] 대화의 스크린 리더 탐색을 개선했다. 각 메시지가 "You" 또는 "Claude"로 안내되고, 도구 단계는 도구 이름도 함께 안내된다
- [VSCode] `XDG_CONFIG_HOME`이 절대 경로일 때 기본 전역 gitignore 파일을 `$XDG_CONFIG_HOME/git/ignore`로 바꿨다
- [Claude Code on the web] 클라우드 세션 diff 화면에 "Compare against" 브랜치 선택기를 추가해, base 브랜치뿐 아니라 임의의 브랜치와 변경사항을 비교할 수 있게 했다
- [Claude Code on the web] GitHub의 토큰 갱신이 잠깐 오류를 낼 때 클라우드 세션의 git 작업이 "service unavailable"로 실패하던 문제를 고쳤다
- [Claude Code on the web] 루틴을 수정할 때 가끔 두 번 실행되거나, 방금 일시정지한 루틴이 다시 켜지던 문제를 고쳤다
- [Claude Code on the web] 세션 자격증명이 갱신된 뒤 몇 분 동안 클라우드 세션의 커밋이 가끔 서명 오류로 실패하던 문제를 고쳤다
- [Claude Code on the web] GitHub 트리거를 연결하지 못한 루틴을 저장했을 때의 토스트가 "edit to retry"만 말하지 않고 저장소별 트리거 한도 같은 사유를 보여주도록 고쳤다
- [Claude Code on the web] 세션을 읽음으로 표시한 직후 다시 읽지 않음으로 돌아가던 문제를 고쳤다
- [Claude Code on the web] 소유자의 GitHub 연결이 없을 때 루틴이 첫 확인 실패에 바로 꺼지는 대신, 실행을 건너뛰고 최대 72시간 재시도하도록 바꿨다
- [Claude Code on the web] 루틴의 보류 안내를 바꿨다. 구독이 일시정지된 경우 자동 재개를 약속하는 대신 직접 루틴을 다시 켜라고 알린다
- [Claude Tag] Claude Tag 관리자 설정의 Add channel·Add workspace 폼에 Guests 설정을 추가해, 소유자가 Inherit·Allow·Channel only·Restrict 중에서 미리 고를 수 있게 했다
- [Claude Tag] 다른 Slack 앱이나 봇이 Claude를 @멘션했을 때 Claude가 답하지 않던 문제를 고쳤다. 이제 태그에 답이 가고, 며칠간 활동이 없어 따라가기를 멈춘 채널에서도 Claude가 깨어난다
- [Claude Tag] 새 Slack 채널이 만들어진 직후 다른 앱이 @Claude를 태그한 메시지를 Claude가 놓치던 문제를 고쳤다. 이제 Claude가 참여한 뒤 전달된다
- [Claude Tag] 마지막 Slack 메시지 몇 분 뒤에 보낸 후속 내용을 Claude가 그 메시지에 조용한 수정으로 접어 넣던 문제를 고쳤다. 블로커 같은 늦은 갱신은 이제 알림이 가는 새 답글로 올라간다
- [Claude Tag] Claude의 Slack 검색이 단일 채널 안을 검색할 때마다 에러로 실패하던 문제를 고쳤다. 이제 그 채널의 일치하는 메시지를 반환한다
- [Claude Tag] 아무도 기다리지 않을 때 안전 필터 중단이 Slack 스레드의 맥락을 조용히 초기화하던 문제를 고쳤다. 이제 Claude가 항상 그 사실을 말하고, 실행 중인 백그라운드 작업을 더는 취소하지 않는다
- [Claude Tag] Claude의 Slack 답변에서 이메일 주소가 `mailto:` 접두사가 보이는 채로 렌더링되던 문제를 고쳤다. 이제 클릭 가능한 평문 주소로 보인다
- [Claude Tag] 그리드의 다른 워크스페이스에서 요청했을 때, 조직 전체에 공유된 Enterprise Grid 채널을 Claude가 감시하기를 거부하던 문제를 고쳤다
- [Claude Tag] Claude Tag 관리자 설정의 Environment 선택기가 보관되었거나 앱이 만든 환경에 대해 환경 이름 대신 원시 환경 ID를 보여주던 문제를 고쳤다
- [Claude Tag] Slack의 실시간 진행 체크리스트를 개선했다. 2,000자로 제한하고, 바쁜 스레드에서는 최대 15분에 한 번만 다시 올리며, 이전 "Latest task list" 링크를 갱신한다
- [Claude Tag] "Channel only" 게스트 설정을 쓰는 채널에서 Claude가 Slack 캔버스를 편집할 때마다 덧붙이던 반복적인 게스트 귀속 안내를 제거했다
- [Code Review] 재리뷰에서, 새 리뷰가 같은 자리에 더 낮은 심각도의 메모를 달면 이미 고쳐진 발견의 스레드가 가끔 열린 채로 남던 문제를 고쳤다
- [Code Review] GitHub나 내부 서비스가 시작 시점에 일시적으로 실패할 때 리뷰가 드물게 "Code review encountered an error"로 끝나던 문제를 고쳤다. 이제 기다렸다가 재시도한다
- [Code Review] Code Review가 게시하는 각 발견의 표현을 개선했다. 누가 영향을 받는지, 코드의 어디가 잘못됐는지, 어떻게 고치는지를 앞세운 짧고 평이한 문장으로 쓴다
- [Code Review] 조직 한도 때문에 리뷰가 건너뛰어졌을 때의 체크런 카드와 PR 코멘트를 개선했다. 각 원인이 그것을 해결하는 관리 페이지로 링크된다

---

## 🎯 챌린지

이번 버전에서 내 환경에 적용해볼 만한 항목입니다.

### 1. `~/.claude` git 관리 여부 확인 — 플러그인 버전 오인 방지
- **파일**: `~/.claude/` (`git rev-parse --is-inside-work-tree` 로 확인)
- **근거**: 이번 버전에서 "자체 git 저장소가 없는 플러그인 디렉터리가 상위 git 저장소에서 버전을 가져오던 문제"가 수정됐다. `~/.claude/plugins/cache/` 아래에 `superpowers`·`token-optimizer` 등 플러그인이 캐시돼 있고, `~/.claude` 자체가 git 저장소라면 그동안 잘못된 버전이 표시됐을 가능성이 있다. `/plugin` 으로 버전 표기를 한 번 대조한다.
- **난이도**: ★☆☆ (약 5분)

### 2. 비활성 플러그인 4종 정리 — 시작 시 플러그인 리로드 비용 제거
- **파일**: `~/.claude/settings.json` 의 `enabledPlugins`
- **근거**: `token-optimizer`·`understand-anything`·`vercel`·`playground`·`swift-lsp`·`clangd-lsp` 가 `false` 로만 남아 있다. 이번 버전은 "플러그인 리로드마다 Bash 도구가 셸 프로필을 재소싱해 수 초 stall" 을 고쳤는데, 애초에 쓰지 않는 마켓플레이스·플러그인 항목을 지우면 리로드 트리거 자체가 줄어든다. 단, statusLine 이 `token-optimizer` 캐시 경로의 `statusline.js` 를 직접 참조하므로 그 항목은 지우지 말 것.
- **난이도**: ★★☆ (약 15분)

### 3. `deploy-guard.sh` 훅을 셸 특수변수 우회에 맞춰 점검
- **파일**: `~/.claude/hooks/deploy-guard.sh`
- **근거**: 이번 버전은 "특수 셸 변수를 순회·대입하는 Bash 명령이 권한 확인을 우회하던 문제" 와 "worktree 세션이 중첩 셸 확장을 받아들이던 문제" 를 고쳤다. `deploy-guard.sh` 는 `feat/*`·`fix/*` 원격 push 를 문자열로 막는 훅이므로, `git push origin $(echo feat/x)` 같은 중첩 확장 형태가 통과하는지 직접 한 번 시험해 본다. 뚫리면 패턴 매칭을 정규화 후 검사로 바꾼다.
- **난이도**: ★★☆ (약 20분)

### 4. `CLAUDE_CODE_MCP_STARTUP_WAIT_MS` 로 비대화형 첫 턴 대기 차단
- **파일**: `~/.claude/settings.json` 의 `env` 블록 (없으면 신설)
- **근거**: 현재 `figma`·`google-sheets`·`lazyweb`·`mobbin` 에 더해 인증 대기 중인 claude.ai 커넥터가 14개나 붙어 있다. `claude -p` 로 도는 changelog 동기화 같은 비대화형 작업은 이 서버들이 연결되기를 기다릴 이유가 없다. `"CLAUDE_CODE_MCP_STARTUP_WAIT_MS": "0"` 을 넣어 첫 턴 지연을 없앤다.
- **난이도**: ★☆☆ (약 5분)
