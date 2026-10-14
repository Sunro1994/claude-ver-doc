# Claude Code v2.1.299

> 작성일: 2026-10-15

---

# 📋 요약본

## 🎉 신기능 (8건)
- **유휴 상태 자동 압축(idle compaction)** — 200K 토큰 이상인 대화를 약 54분 동안 건드리지 않으면, 1시간짜리 prompt cache가 만료되기 전에 대화를 압축한다. 다음 메시지를 보낼 때 전체를 다시 처리하지 않아도 된다.
  - 최소 토큰 기준은 `CLAUDE_CODE_IDLE_COMPACT_MIN_TOKENS`로 바꾼다. 기능을 끄려면 settings.json에 `"idleCompaction": false`를 넣는다. v2.1.290 이상이 필요하다.
- **`CLAUDE_CODE_DISABLE_FILE_MENTIONS` 환경변수** — `@`로 파일을 언급하면 파일 내용 대신 경로만 넘어간다. Claude는 그 경로를 파일 도구로 직접 읽는다.
- **mod API 확장** — `$.prompt.media`(첨부한 이미지·문서의 바이트 읽기)와 `$.session.identity()`(로그인 방식·조직·이메일)를 추가했다. `Text`에는 `size`·`weight`·`mono`·`tabular`를, `Box`에는 간격 단계 `xs`~`xl`을 추가했다. `skill.prompt` hook은 이제 frontmatter·출처·플러그인명·경로도 받는다. `session.append`에는 `queue` door가 생겼다.
- **agent view에서 `/effort`·`/fast` 사용** — 새 세션이 어떤 설정으로 시작할지 정한다. 인자 없이 `/model`·`/effort`·`/fast`를 입력하면 선택 창이 열린다.
- **`/usage` 경고 추가** — max effort, workflow, 항상 켜져 있는 context, 큰 도구 결과가 사용량을 많이 쓰면 경고한다.
- **`claude plugin eval`에 `--disallow-tools` 추가** — eval 실행에서 Agent 같은 특정 내장 도구를 뺄 수 있다. case 필드 `disallowed_tools`도 추가했다.
- **self-hosted runner의 `--shutdown-drain-sec`** — SIGTERM을 받으면 지정한 초만큼 진행 중인 작업이 끝나기를 기다린 뒤 종료한다.
- **plan mode 안내와 safe mode 표시** — bypass permissions를 쓸 수 있어 plan mode가 묻지 않고 진행하는 경우 1회 안내한다. `--safe-mode`로 시작한 백그라운드 세션은 peek 패널에 표시한다.

## 🛠️ 개선/수정 (12건)
- **MCP 권한 규칙 범위 축소** — `mcp__a` 규칙이 더 이상 `a__b`·`a_` 서버에 적용되지 않는다. 서버 전체 이름으로 `mcp__<server>__*` 형태로 적어야 한다. agent의 `tools:` 목록도 같은 방식으로 바뀌었다.
- **`UserPromptSubmit` 실행 순서 변경** — skill이나 커스텀 slash command가 펼쳐지기 전에 hook이 실행된다. hook이 프롬프트를 막으면 그 안에 든 shell 명령도 함께 멈춘다.
- **plan mode 쓰기 차단 강화** — `PreToolUse` hook이 허용하더라도 plan mode에서는 쓰기 작업이 실행되지 않는다.
- **sandbox 보안 수정 다수** — symlink를 거쳐 거부된 경로에 접근하던 문제, `--plugin-dir`에 쓰기가 가능하던 문제, glob 해석이 서로 다르던 문제를 고쳤다.
- **서드파티 gateway API key 유출 방지** — feature flag·startup 같은 Anthropic 요청에 gateway key가 실리지 않는다. 응답 없는 stream의 타임아웃은 180초에서 300초로 늘었다.
- **`claude -p` 설정 오류 표시** — settings 파일이 검증에 실패하면 어느 파일의 어떤 항목인지 stderr에 출력한다.
- **ScheduleWakeup·예약 작업 수정** — 백그라운드 작업이 도는 동안 wakeup이 발동하지 않던 문제를 고쳤다. 다음 실행 시각을 정확히 알려주고, 서머타임이 끝나는 시간대에 중복 실행되던 문제도 고쳤다.
- **CJK·이모지 줄바꿈 표시 수정** — 한글과 영문이 섞인 텍스트에서 마지막 줄이 사라지거나 빈 줄이 생기던 문제를 고쳤다.
- **Write 인코딩 보호** — BOM이 사라지거나 Shift-JIS 같은 인코딩이 UTF-8로 몰래 바뀌던 문제를 고쳤다. 이제 이런 쓰기는 거부한다.
- **`SendMessage` 이름 검색 복구** — CLI가 재시작한 뒤에도 subagent를 이름으로 찾는다.
- **`/reload-skills` 안내 개선** — compaction 후 skill 목록을 되살리는 방법임을 알려준다.
- **resume 명령 안전화** — 종료할 때 출력되는 resume 명령이 세션 이름 대신 ID를 쓴다. 이름에 든 문자열이 붙여넣기로 실행되는 일을 막는다.

## 🔑 이번 버전의 핵심 키워드
**"긴 세션은 싸게, 권한 경계는 좁게"** — 유휴 상태 압축으로 1M 세션의 캐시 재처리 비용을 줄이고, MCP 규칙·sandbox·hook 순서를 더 엄격하게 바꿨다.

---

# 📜 원문 (한글 번역본)

> 원문 ChangeLog를 원래 순서 그대로 한 줄도 빠짐없이 번역한 문서입니다.

- `CLAUDE_CODE_DISABLE_FILE_MENTIONS` 환경변수 추가: `@` 파일 언급 시 Claude가 파일 내용 대신 경로를 받아 파일 도구로 읽는다
- 터미널에 idle compaction 추가: 200K+ 토큰 대화를 약 54분간 방치하면 1시간 prompt cache가 만료되기 전에 압축한다. 다음 메시지에서 전체를 재처리하지 않는다
- idle compaction의 200K 토큰 최솟값을 바꾸는 `CLAUDE_CODE_IDLE_COMPACT_MIN_TOKENS` 추가. settings.json의 `"idleCompaction": false`로 끈다. 둘 다 v2.1.290 이상 필요
- `$.prompt.media` 추가: managed settings로 설치된 mod의 `prompt.submit` hook이 프롬프트에 첨부된 이미지·문서의 바이트를 읽을 수 있다
- managed settings로 설치된 mod용 `$.session.identity()` 추가: 세션의 로그인 방식, 그리고 managed `forceLoginOrgUUID`가 해당 조직을 나열한 경우 조직과 이메일
- mod의 `Text`에 `size`, `weight`, `mono`, `tabular`를, `Box`에 이름 붙은 간격 단계(`xs`~`xl`)를 추가. `bold`는 `weight`로 대체되어 deprecated
- `claude self-hosted-runner orchestrator`에 `--shutdown-drain-sec` 추가: SIGTERM 시 polling을 멈추고 진행 중인 poll과 실행 중인 spawn hook에 최대 해당 초만큼 완료 시간을 준다
- mod의 `skill.prompt` hook이 받는 정보에 skill의 frontmatter, 출처, 플러그인 이름, 파일 경로 추가
- agent view에 새 세션 시작값을 정하는 `/effort`와 `/fast` 추가. 인자 없는 `/model`, `/effort`, `/fast`는 이제 picker를 연다
- `--safe-mode`로 시작한 백그라운드 세션에 대해 agents view peek 패널에 "safe mode" 줄 추가
- bypass permissions가 가능해 plan mode가 대부분의 편집·명령 전에 묻지 않을 때 1회 안내 추가
- `claude plugin eval`에 `--disallow-tools`와 `disallowed_tools` case 필드 추가: Agent 같은 특정 내장 도구를 eval 실행에서 제외
- Claude Desktop Code 탭의 attribution block 끄기 지원: Claude apps gateway의 `code` policy `env`에 `CLAUDE_CODE_ATTRIBUTION_HEADER=0` 설정
- Claude apps gateway 뒤의 Claude Code 세션 attribution block에 필드 추가. `CLAUDE_CODE_ATTRIBUTION_HEADER=0`로 block 제거
- `session.append` mod hook에 `queue` door 추가: mod가 transcript의 queue 기록을 실제 전송된 프롬프트와 다르게 만들 수 있다
- 조직이 Claude Code를 관리하는 환경에서 건너뛰는 mod hook 이름을 `/plugin`과 `claude plugin validate`에 안내 추가
- max effort, workflow, always-on context, 큰 도구 결과에 대한 `/usage` 경고 추가
- `apiKeyHelper` key 사용 시 거부된 cloud session 오류가 잘못된 조직을 가리키던 문제 수정
- 커스텀 `ANTHROPIC_BASE_URL` 뒤의 gateway 전용 모델 이름 세션이 200K 토큰 근처에서 요청을 보내지 않고 "Prompt is too long · automatic compaction failed"로 끝나던 문제 수정
- 매 턴 끝에 프롬프트를 제출하는 mod가 headless 실행을 `--max-turns`, `--max-budget-usd`, 인터럽트, 호스트 대화 종료 이후까지 계속 돌리던 문제 수정
- cloud session에서 도구 그룹 한 줄 라벨 뒤에 모델의 후속 텍스트가 가끔 보이던 문제 수정
- config 디렉터리 경로에 `.claude`가 없을 때 accept-edits 모드에서 Write·Edit 도구가 묻지 않고 세션 mods 폴더에 mod를 만들던 문제 수정
- 원격으로 꺼진 설치 mod가 열린 세션에서 계속 실행되던 문제 수정. 이제 턴 사이에 unload된다
- Cowork·claude.ai cloud session에서 `UserPromptSubmit` 또는 mod `prompt.submit` hook 실행 중 중단된 메시지의 Edit·Retry 실패 수정 (2.1.296 회귀)
- description 없이 시작한 agent teammate가 프롬프트의 credential 일부를 표시되는 task description에 남기던 문제 수정
- 느린 연결에서 대량 이벤트 업로드가 끝나지 않을 때 Remote Control·cloud session의 claude.ai 화면이 멈추던 문제 수정
- sandbox된 shell 명령이 `--plugin-dir` 폴더에 쓸 수 있던 문제 수정 (Claude Code가 그 코드를 sandbox 밖에서 재로드·실행함)
- 과도한 debug 로깅(`--debug`, `--debug-file`) 시 메모리 증가, 그리고 debug 로그가 쓰기를 멈춘 디스크·네트워크 마운트에 있을 때 종료 시 hang 수정
- debug 출력이 stderr로 가고 부모 프로세스가 읽기를 멈출 때 메모리가 무한히 늘던 문제 수정
- `rm`을 실행하지 않는 shell `-c` 스크립트에 rm 프롬프트가 뜨던 문제 수정. Claude Code가 읽을 수 없는 스크립트에서 런타임에 만들어진 rm은 `CLAUDE_CODE_STRICT_INLINE_SHELL_RM_PROMPT=1`이 아니면 더 묻지 않는다
- fullscreen 모드에서 펼친 transcript 행의 단어를 더블클릭하면 단어 선택 대신 행이 접히던 문제 수정
- `claude mcp list`, `claude doctor`, `/status`가 빈 `.mcp.json`을 invalid로 보고하던 문제 수정
- fullscreen에서 위로 스크롤한 상태로 `/btw` 질문 시 transcript가 맨 아래로 튀던 문제 수정
- sandbox가 Windows 드라이브에 쓸 수 있을 때 WSL2에서 `bwrap: Can't mkdir /mnt/c/Program Files/ClaudeCode`로 sandbox 명령이 실패하던 문제 수정
- Agent SDK, IDE, `claude remote-control` 세션에서 백그라운드 작업 실행 중 예약 wakeup(ScheduleWakeup)이 발동하지 않던 문제 수정
- 붙여넣은 이미지나 읽을 수 없는 이미지가 있는 일부 프롬프트에서 mod의 `prompt.submit` 재작성이 무시되고 입력 그대로 전송되던 문제 수정
- 같은 배치의 다른 대기 프롬프트 전달 실패 시 Remote Control 프롬프트가 유실되던 문제 수정
- Stop이 다음 대기 프롬프트의 hook을 중단할 때 hook을 통과한 Remote Control 프롬프트가 프롬프트 히스토리에서 빠지던 문제 수정
- sandbox 명령이 config 디렉터리에 빈 `.config.json`을 남긴 뒤 Linux에서 로그인·MCP 서버·프로젝트 trust가 사라진 것처럼 보이던 문제 수정
- 프로젝트 폴더에 쓸 수 없어 설정 저장에 실패해도 `/sandbox`가 성공을 보고하던 문제 수정. 이제 변경 없음과 이유를 알린다
- 호스트가 auto mode를 지원하지 않는 모델로 전환한 뒤에도 SDK·headless 세션이 auto mode에 남던 문제 수정
- MCP config에서 이름이 `constructor` 또는 `prototype`인 MCP 서버가 연결되지 않던 문제 수정
- 이름이 `constructor` 또는 `toString`인 MCP 서버의 도구가 auto mode와 bypass permissions mode에서 권한을 묻던 문제 수정
- 다른 Claude Code 프로세스가 claude.ai 동기화 플러그인을 막 업데이트했을 때 시작 시 나던 허위 "synced[0] commands path not found" 플러그인 오류 수정
- connector 등 접근을 요청하는 publish가 서버·프록시에서 거부(HTTP 403)될 때 Artifact 도구가 재시도를 권하던 문제 수정. 이제 거부 사실과 사용자에게 전할 내용을 알린다
- 플러그인 reload 타임아웃이나 최근 동기화를 재사용한 재시작 후 Cowork cloud session이 옛 계정 플러그인에 머물던 문제 수정
- Claude 작업 중 보낸 내 메시지에서 document block이 빠지던 문제 수정
- 브라우저 미연결 시 Claude in Chrome이 권한을 묻던 문제 수정. 이제 extension 미연결을 알린다
- fullscreen "Update installed" 안내가 유휴 상태의 "/clear to save tokens" 힌트에 가려지던 문제 수정. 이제 힌트 옆에 표시된다
- 다른 mod의 noun이 호출 밖에서 작업할 때 그것을 기다리는 mod hook이 `.catch` 유무와 관계없이 끝없이 재실행되던 문제 수정
- policy의 `availableModelsMatch: exact` 또는 `deniedModels`가 막은 모델을 Claude apps gateway가 제공하던 문제 수정. 이제 400으로 응답하고 모델 목록에서 뺀다
- managed settings 파일이 `ANTHROPIC_BASE_URL`을 설정할 때 Anthropic으로 가는 server-managed settings 요청에 서드파티 gateway API key가 실리던 문제 수정
- 커스텀 `ANTHROPIC_BASE_URL`을 통한 stream이 데이터 없이 180초 후 중단되던 문제 수정. feature flag 로드 여부와 관계없이 이제 300초를 기다린다
- `$.ui.invalidate` 이후 바뀐 mod의 `tool.describe` 또는 `prompt.section` 답이 Claude에 전달되지 않던 문제 수정. 새 답은 다음 턴에 보내진다
- `enabledMcpjsonServers` 또는 `disabledMcpjsonServers`에 서버 이름 하나(문자·숫자·- 또는 _)를 일반 문자열로 넣으면 settings 파일이 무시되던 문제 수정
- hook이 호출한 served `$` method가 응답 후에도 `$` 호출을 계속할 때 `claude plugin test`가 hook의 시간 예산을 멈추던 문제 수정
- 많은 subagent를 실행한 cloud·Remote Control 세션을 resume한 뒤 메모리를 많이 쓰던 문제 수정
- 매우 깊게 중첩된 도구 입력이나 메시지를 next()로 넘길 때 플러그인 hook이 건너뛰어지던 문제 수정
- mod hook이 `next()`로 넘기거나 반환하거나 `$` method로 보내는 값의 getter 하나가 `RangeError`를 던지면 값 전체가 거부되던 문제 수정. 이제 해당 key만 거부한다
- `/usage`, 한도 근접 경고(터미널·VS Code), status line이 가끔 100% 넘게 사용했다고 표시하던 문제 수정 (anthropics/claude-code#92238)
- CJK·이모지와 라틴 단어가 섞인 줄바꿈 텍스트가 일부 터미널 너비에서 마지막 줄을 잃거나 빈 행을 남기던 문제 수정
- 세션 worker 교체 중 답한 권한 프롬프트·질문 응답을 cloud session이 가끔 무시하던 문제 수정
- bold, italic 등 중첩 텍스트 스타일이 표 테두리를 넘거나 줄바꿈된 행에서 사라지던 문제 수정
- 다른 기기에서 변경·제거·비활성화한 계정 플러그인을 Cowork cloud session이 재시작 전까지 옛 버전으로 실행하던 문제 수정
- MCP 서버의 정규화된 이름에 이중 밑줄이 있을 때 해당 서버(`mcp__<server>`)의 deny·ask 규칙이 적용되지 않던 문제 수정
- 과대 이미지 하나가 API에서 거부된 뒤 긴 대화에서 매 턴 새로 첨부한 이미지가 사라지던 문제 수정
- hooks module 형태의 hook을 가진 플러그인(내장 플러그인 포함)에 대해 `plugin_loaded` telemetry 이벤트가 `has_hooks`를 false로 보고하던 문제 수정
- Claude 작업 중 첨부한 이미지(VS Code, 데스크톱 앱, SDK)가 원본 크기로 전송되어 긴 대화에서 이미지 오류가 반복되던 문제 수정
- 최신 모델에서 큰 정사각형에 가까운 이미지의 좌표 힌트가 빠지거나 약간 어긋나던 문제 수정
- feature flag, startup, fast mode, profile, feedback 요청에 서드파티 gateway(`ANTHROPIC_BASE_URL`)용 API key가 실리던 문제 수정. Anthropic API key는 계속 전송된다
- reload 실패 직후 저장한 수정을 mod hot reload가 무시하던 문제 수정. 변경 없이 mod 파일을 저장하면 더 이상 reload하지 않는다
- hook이 mod의 다른 파일에서 import한 function declaration에 `$`를 넘길 때 소스 파일에서 로드한 mod가 거부되던 문제 수정
- 2.1.296 회귀 수정: 재시작 후 세션 resume 중 새 메시지가 오면 cloud·headless 세션이 승인된 도구 호출을 두 번 실행할 수 있던 문제
- 예약 작업이 잘못된 분으로 안내되던 문제 수정: 스케줄링 도구가 각 작업의 실제 다음 실행 시각을 보고한다
- mod hook에 넘기는 값에서 `__proto__` key가 조용히 제거되어 다른 mod의 도구 호출에 대한 `tool.check` guard를 건너뛸 수 있던 문제 수정
- settings 파일 검증 실패 시 `claude -p`가 아무 말도 하지 않던 문제 수정: text 출력 실행은 이제 stderr에 파일과 잘못된 항목을 나열한다
- bracketed paste가 없는 터미널에서 긴 붙여넣기가 보이지 않는 제어 문자(잘못 디코딩된 둥근 따옴표 등) 이후 텍스트를 모두 잃던 문제 수정
- MDM 또는 managed-settings 파일이 `forceLoginOrgUUID`를 설정한 기기에서 저장된 로그인의 plan이 로컬에서 바뀌면 managed settings와 조직 policy를 가져오지 않던 문제 수정
- 서버가 notification 응답 body를 끝내지 않을 때 HTTP MCP 연결이 30초 hang 후 실패하던 문제 수정 (anthropics/claude-code#99014)
- 실행 중인 headless·SDK 세션에 추가된 MCP 서버가 일부 policy 검사 전에 연결되던 문제 수정. 차단된 서버는 접촉 없이 실패로 보고된다
- `claude mcp list`, `claude mcp get`, subagent MCP 서버가 policy 검사에서 차단된 서버를 시작하던 문제 수정. 이제 시작하지 않고 차단으로 보고한다
- 다른 터미널에서 방금 설치한 플러그인을 `/reload-plugins`가 로드하지 않던 문제 수정
- 매우 좁은 터미널처럼 한 칸 컬럼에 끼워진 CJK·이모지 텍스트 아래 빈 행이 생기던 문제 수정
- 전각 문자 옆에서 잘린 텍스트가 셀 하나를 비우거나 두 번 잘리던 문제, 색이 바뀌는 지점의 이모지가 사라지던 문제 수정
- 백그라운드 세션의 bare mode 안내가 모드를 유지하는 `--bare` 없이 재시작하라고 하던 문제 수정. 이제 safe mode 안내처럼 `/stop`과 `claude --resume`을 안내한다
- Remote Control 사용 중 대기 메시지 위에서 `←`가 움직이지 않는 이유를 알리지 않던 문제 수정
- mods의 `$.http.fetch`가 4 MiB body 한도를 넘는 `Content-Length`를 선언한 `304`, `204`, `205` 응답을 거부하던 문제 수정
- `/config` 푸시 알림 토글이 방금 고른 설정 대신 이전 설정을 계정에 보내던 문제 수정
- 응답이 출력 토큰 한도에 닿은 직후 worker가 교체되면 cloud session이 답을 미완성으로 남기던 문제 수정
- 상승 권한 없이 실행되는 Linux 원격 세션에서 PDF 페이지 범위 Read가 실패하던 문제 수정
- 보내지 않은 메시지를 입력하는 동안 보류된 질문·권한 프롬프트에 Enter가 답하던 문제 수정
- 원격 세션에서 메시지 첨부 파일 다운로드가 중간에 멈추면 파일이 빠지던 문제 수정. 이제 다운로드를 재시도한다
- `--input-format stream-json`으로 content block 형태로 보낸 대기 프롬프트가 한 턴으로 합쳐질 때 줄바꿈 없이 붙던 문제 수정
- 세션 중 connector가 바뀌면 self-hosted runner 세션이 `--exec-path` wrapper 자체의 `--mcp-config`로 추가한 MCP 서버를 종료하던 문제 수정
- API가 거부한 실행을 `claude plugin eval`이 통과시키던 문제 수정: API 오류로 끝난 실행은 채점 없이 0점, suite는 exit 1
- 이유 텍스트에 keycap 이모지나 결합 이모지가 있을 때 권한 프롬프트가 잘리거나 너무 일찍 줄바꿈되던 문제 수정
- MDM 또는 managed-settings 파일의 `forceLoginOrgUUID`, `forceLoginMethod`가 server-managed settings에 가려지거나 대체되던 문제 수정
- `--channels`가 요청한 `constructor` 또는 `prototype` 이름의 MCP 서버를 `--bare` 세션이 빠뜨리던 문제 수정
- `/clear` 이전 대화를 resume하면 그 다음 대화의 Remote Control 세션에 다시 붙던 문제 수정
- Agent SDK `verbatimPrompts` 옵션으로 보낸 `/`로 시작하는 프롬프트가 재시작 후 `CLAUDE_CODE_RESUME_INTERRUPTED_TURN`으로 재실행될 때 slash command로 실행되던 문제 수정
- `--safe-mode`로 시작한 백그라운드 세션이 깨어나거나 재시작될 때 조용히 safe mode를 벗어나던 문제 수정
- 서머타임 종료로 반복되는 한 시간 동안 예약 작업과 loop가 매 턴 후 다시 발동하거나 일찍 발동하던 문제 수정
- 이름이 공백으로 시작하거나 끝나는 새 파일이 diff view에 잘못된 이름으로 나열되던 문제 수정
- 백그라운드 재연결이 실행 중인 연결을 닫을 때 headless·SDK 세션의 MCP 도구 호출이 가끔 실패하거나 두 번 실행되던 문제 수정
- 비대화형 세션의 `/btw` 질문이 세션 종료 시 취소되지 않고, 같은 요청이 실행 중 다시 오면 두 번 실행되던 문제 수정
- 거부 경로가 symlink를 거칠 때 macOS sandbox 명령이 실제 위치로 해당 경로를 읽거나 쓸 수 있던 문제 수정
- 폴더 이름에 중괄호·괄호·백슬래시가 있는 sandbox `denyRead`·`allowRead` glob을 Claude Code 설정 검사와 sandbox가 다르게 해석하던 문제 수정
- 시작 디렉터리가 symlink로 교체될 때 sandbox glob `allowRead`·`allowWrite` 항목이 재검사되지 않던 문제 수정
- worktree 격리 세션이 격리 guard가 거부해야 할 일부 awk 프로그램을 허용하던 문제 수정
- `claude mcp add <name> -- <command> --background`가 백그라운드 세션으로 시작되던 문제 수정
- 백그라운드 세션에 보낸 `--bg` 또는 `--background` 프롬프트·답이 flag로 해석되어 전달 대신 새 세션을 반복 시작할 수 있던 문제 수정
- 프롬프트 검사 중 새 메시지가 커스텀 slash command를 인터럽트하면 내장 shell 줄이 두 번 실행되던 문제 수정
- git reftable ref 저장소를 쓰는 레포에서 `--worktree` 세션이 `.git/worktrees`에 폴더를 남기던 문제 수정
- Anthropic 관리 git을 쓰는 `claude self-hosted-runner` 세션이 remote가 아직 빈 재사용 clone에서 시작할 때 추적 파일을 staged deletion으로 보여주던 문제 수정
- settings에서 `ultracode`가 켜져 있을 때 예약 작업 등 전달된 headless 턴에 Ultracode가 안내되지 않던 문제 수정
- MCP OAuth 로그인·토큰 갱신·로그아웃이 설정한 `headers`/`headersHelper` 값을 보내지 않아 인증 프록시 뒤 서버가 깨지던 문제 수정
- `<head>` 뒤에 줄바꿈이 있는 큰 페이지를 변경 없이 다시 publish할 때 Artifact 도구가 라이브 페이지와 허위로 한 줄 차이를 보고하고 publish를 거부하던 문제 수정
- Claude Code for VS Code, `claude -p`처럼 pane을 그리는 화면이 없는 세션에서 `$.ui.open`이 mod pane을 배치했다고 보고하던 문제 수정
- 완료된 subagent나 종료된 teammate를 resume할 때 `agent.spawn` mod hook이 실행되지 않던 문제 수정: hook 이벤트가 이제 `resume`을 담고 mod가 거부할 수 있다
- `plugin.json`에 `types` key가 없고 contract가 `./types/index.d.ts`에 있을 때 `claude plugin validate`가 mod의 `$.state` 참조를 거부하던 문제 수정
- dark ANSI 테마와 16색 터미널에서 mod의 `dimColor` 텍스트가 일반 텍스트와 같아 보이던 문제 수정
- `PreToolUse` hook이나 mod의 `tool.check` hook이 허용한 쓰기(MCP 도구·파일·shell 명령)를 plan mode가 실행하던 문제 수정
- auto mode 백그라운드 subagent가 최종 보고를 결과와 메시지로 두 번 보내던 문제 수정
- CLI 재시작 후 세션 resume 시 `SendMessage`가 이름으로 subagent를 찾지 못하던 문제 수정 (마지막 compaction 이전에 준 이름은 여전히 agent ID 필요)
- 요청이 non-streaming 모드로 fallback된 뒤 출력 토큰 한도에서 잘린 답이 재시도·오류 없이 턴을 조용히 끝내던 문제 수정
- BOM이 있는 UTF-16LE 파일을 Read가 깨뜨리던 문제, Write가 BOM을 버리거나 Windows-1252·Shift-JIS·GBK·UTF-16BE 파일을 UTF-8로 조용히 변환하던 문제 수정 (이제 거부)
- compaction 직후 worker가 교체되면 cloud session이 가끔 메시지에 답하지 않던 문제 수정
- 도구가 턴을 끝내고 같은 단계에서 skill이 로드될 때 cloud session과 `CLAUDE_CODE_RESUME_INTERRUPTED_TURN`이 재시작 후 끝난 턴에 다시 답하던 문제 수정
- Remote Control로 보낸 사진의 사본을 컴퓨터에 저장하지 못하면 사진이 빠지던 문제 수정. 이제 Claude가 사진을 계속 본다
- 장시간 세션에서 Remote Control로 보낸 파일이 가끔 도착하지 않던 문제 수정
- Remote Control이나 cloud session으로 보낸 30~35 MiB 파일이 도착하지 않던 문제 수정
- 사용자 설치 mod의 `$.env.set`이 managed settings command hook의 시작 환경이나 shell prefix를 바꾸던 문제 수정
- Windows: 바쁜 기기에서 프로세스 생존 검사가 고아 PowerShell 프로세스를 남겨 메모리가 바닥나던 문제 수정
- Windows: Git for Windows가 없을 때 shell을 지정하지 않은 PreToolUse·PermissionRequest hook이 fail-open되던 문제 수정. 실패한 guard는 이제 호출을 막는다
- Windows: Git Bash가 시작 시 PATH를 보고하지 않으면 세션 내내 Bash 명령이 "command not found"로 실패하던 문제 수정
- Self-hosted runner: 실행 기기에 git credential이 없을 때 `setup`과 `doctor`의 안내 개선
- Self-hosted runner: 첫 턴 전에 출력을 쓴 세션이 release timer 없이 남아 `--retire-at`을 무시하고 종료를 지연하던 문제 수정
- claude.ai 로그인이 거부되거나 만료되어 cloud session이 거부될 때 오류 개선: `claude auth login`으로 다시 로그인하라고 안내한다
- 사용자 설치 mod에 대한 managed 권한 규칙, managed hook, 조직 MCP 도구 이름의 적용 강화
- PDF를 @-mention할 때 메모리·디스크 사용 개선: PDF 바이트를 세션 transcript에 더 이상 보관하지 않는다
- Linux sandbox Bash 개선: 명령의 wildcard read 규칙을 펼치는 중에도 Esc와 Ctrl-C가 동작한다
- 인식되지 않는 모델 ID 시작 경고 개선: 긴 원문 메시지 대신 환영 배너 아래 짧은 한 줄과 문서 링크로 표시
- plugin-authoring skill의 mod 공유 단계 개선: GitHub 레포 생성 전에 공개/비공개를 묻고 파일을 확인한다
- Claude가 skill 이름에 `anthropic-skills:` prefix를 잘못 붙일 때 Skill 도구의 "Unknown skill" 오류가 목록상의 이름을 제안하도록 개선
- `/reload-skills`가 전체 skill 목록을 Claude에 다시 보낸다고 안내하도록 개선 (compaction 후 skill을 되살리는 방법)
- base commit을 해석할 수 없어 worktree 생성이 실패할 때 오류 개선: 조회가 어떻게 끝났는지와 커밋 없는 레포 같은 가능한 이유를 알린다
- bare-repository 레이아웃 루트에 worktree를 만들 때 오류 개선: 관계없는 git 오류 대신 레이아웃을 설명한다
- artifact 감시 개선: 로컬 세션이 publish된 artifact를 최대 10개에서 25개까지 동시에 감시한다
- 백그라운드 agent 알림 개선: agent가 자신의 백그라운드 작업만 기다리는 중인지, 결과에 늦게 메시지를 받았는지, 사용 한도로 멈췄는지 알린다
- 플러그인 hook과 workflow 스크립트가 반환하는 값이 28,000단계보다 깊게 중첩되면 한도를 명시한 오류로 거부하도록 변경 (workflow 스크립트는 기존 100,000 허용)
- 플러그인 hook이 막을 수 있는 동작을 hook에 넘기지 못하거나 hook이 답을 돌려주지 못하면 통과 대신 거부하도록 변경. 이미 실행된 도구는 결과를 보류한다
- claude.ai connector proxy와 Anthropic 호스팅 MCP 서버로의 요청이 HTTP redirect를 더 이상 따르지 않도록 변경. connector 자체 서버의 redirect는 영향 없음
- cloud·self-hosted runner 세션의 MCP 요청이 세션 MCP proxy의 HTTP redirect를 더 이상 따르지 않도록 변경
- skill·command 로딩 변경: 파일·폴더 이름에 숨김·방향 전환·공백 유사 문자, `<`, `>`가 있으면 이름을 바꾸기 전까지 제공하지 않는다. 그런 `name:`은 무시된다
- `claude plugin test`의 `ui.render` 트리 변경: 각 mod의 Box·Text root가 mod를 가리키는 `part: { plugin }`을 가진다. 정확한 트리 assertion에 포함해야 한다
- WebFetch 페이지 읽기의 effort를 웹 검색과 같은 방식으로 정하도록 변경: 호출자 자체 모델에서는 호출자의 level, 아니면 settings가 small model에 주는 level
- `claude plugin test`가 10초 안에 응답하지 않는 mod의 served `$` method 호출을 세션처럼 실패시키도록 변경
- MCP allow 규칙이 이름 지정한 서버에만 적용되도록 변경: `mcp__a`는 더 이상 `a__b`나 `a_` 서버를 허용하지 않는다. 서버의 정규화된 전체 이름으로 `mcp__<server>__*`를 쓴다
- agent `tools:` 목록이 이름 지정한 MCP 서버의 도구만 받도록 변경: 이름에 `__`가 있는 서버는 `mcp__<whole name>__*`로 적는다
- auto mode 밖 Cowork cloud session의 Claude in Chrome 변경: 승인된 사이트 동작을 safety classifier가 표시하면 거부 대신 묻는다 (managed settings 적용 시 제외)
- 플래그를 가져오지 않는 설치에서 cloud session·Remote Control MCP connector가 기본으로 MCP protocol 버전 2026-07-28을 협상하도록 변경. `MCP_PROTOCOL_NEGOTIATION=legacy`로 opt-out
- `api.anthropic.com`의 Anthropic first-party MCP 서버 도구 설명과 서버 지시문이 4,096자에서 잘리지 않고 전체가 Claude에 전달되도록 변경
- Cowork cloud session auto mode 변경: `PermissionRequest` hook이 더 이상 shell 명령이나 subagent를 승인할 수 없다. 해당 프롬프트는 대기하거나 거부된다
- 종료 시 출력되는 resume 명령 변경: 세션을 이름 대신 ID로 지정해 붙여넣을 때 세션 이름 속 내용이 실행되지 않게 한다
- worktree 세션 종료 시 출력되는 resume 명령 변경: 긴 flag가 터미널에 맞지 않으면 `-w`와 `-r`을 쓴다. 둘 다 맞지 않으면 유지된 worktree 위 행에 실행 위치를 안내한다
- 비대화형 세션의 `/btw` 질문이 11분 후에도 답이 없으면 timeout 오류를 반환하도록 변경
- `UserPromptSubmit` hook이 skill·커스텀 slash command 확장 전에 실행되도록 변경. 프롬프트를 막는 hook이 내장 shell 명령도 멈춘다
- skill 자체 front-matter의 `UserPromptSubmit` hook이 skill을 호출한 프롬프트 다음 프롬프트부터 처음 실행되도록 변경
- `turn.start` mod hook이 main loop뿐 아니라 subagent·teammate의 턴도 듣도록 변경. `e.agentId`로 구분한다 (main loop에는 없음)
- `/ultrareview`가 레포를 업로드하지 못할 때 오류가 `git add .`를 더 이상 제안하지 않도록 변경 (`.env` 같은 미추적 파일을 stage·commit할 수 있었음)
- cyber safeguard 안내가 Cyber Verification Program 신청을 더 이상 요청하지 않도록 변경
- [VSCode] 다른 세션으로 갔다 돌아올 때 보내지 않은 프롬프트와 첨부가 사라지던 문제 수정
- [VSCode] 새 대화 시작 후 사용하지 않은 빈 채팅이 백그라운드 Claude 프로세스를 계속 돌리던 문제 수정
- [VSCode] claude.ai에서 로그아웃된 상태에서 마이크 버튼이 내부 오류 메시지를 보여주던 문제 수정. 이제 로그인을 제안한다
- [VSCode] Python 환경이 없는 workspace에서 Python extension 로딩 중 Claude를 시작해 시작 시간 개선
- [VSCode] 시작 개선: 이전에 연 폴더의 새 창에서 모델 picker와 slash command 메뉴가 바로 채워진다
- [Cloud sessions] 기존 출력 파일 다수가 한꺼번에 재전송될 때 세션을 crash시킬 수 있던 메모리 급증 수정
- [Cloud sessions] 원래 환경이 삭제되었거나 목록에 없을 때 편집한 routine 저장 시 다른 환경으로 조용히 옮겨지던 문제 수정. 이제 routine이 자기 환경을 유지한다
- [Cloud sessions] self-hosted 환경 admin 상세에서 세션 링크의 session ID를 붙여넣어도 Sessions 검색이 아무것도 찾지 못하던 문제 수정
- [Cloud sessions] self-hosted 환경 admin 상세의 Sessions·Runners 목록이 검색 결과가 없을 뿐인데 목록이 비었다고 표시하던 문제 수정
- [Cloud sessions] self-hosted 환경이나 environment key 생성 시 deploy 명령 표시 개선: 전체를 표시하고 인자 사이에서 줄바꿈하며 복사 버튼이 보인다
- [Cloud sessions] self-hosted 환경 삭제 시 routine 실행이 실패하도록 두지 않고 즉시 끄고 각 routine에 이유를 표시하도록 변경
- [Remote Control] 컴퓨터에 연결할 수 없는 Remote Control 세션이 메시지를 보내는 것처럼 보이던 문제 수정. 재연결 전까지 텍스트는 입력창에 남고 Send는 꺼진다
- [Claude Tag] Slack의 Claude가 요청 시 채널에 자신이 만든 canvas를 삭제하는 기능 추가
- [Claude Tag] 게스트가 있는 채널에서 채널 지시가 답하라고 한 태그 없는 글(다른 사람을 태그한 글 등)에 Slack의 Claude가 침묵하던 문제 수정
- [Claude Tag] 멤버가 아닌 다른 채널 스레드 답글을 Slack의 Claude가 게시했다고 보고하던 문제 수정. 이제 미전달 사실과 해결 방법을 알린다
- [Claude Tag] self-hosted runner 이미지에 python3가 없을 때 Slack의 Claude가 답을 게시하지 않고 턴을 끝내던 문제 수정
- [Claude Tag] Slack의 Claude가 잘못 쓴 메시지를 고치는 방식 변경: 옛 텍스트에 취소선을 긋는 대신 메시지를 그 자리에서 편집하고 짧은 "Edited" 표시를 단다
- [Claude Tag] Slack의 Claude가 멤버 100명 초과 채널에 소개 메시지 없이 조용히 참여하도록 변경
- [Code Review] Code Review의 월 지출 한도 코멘트와 check-run 카드가 관리자를 Claude Code 설정으로 보내던 문제 수정. 이제 한도를 설정하는 Usage 페이지로 링크한다

---

## 🎯 챌린지

이번 버전에서 내 환경에 적용해볼 만한 항목입니다.

### 1. 1M 세션에 맞게 idle compaction 기준 정하기
- **파일**: `~/.claude/settings.json`
- **근거**: 기본 모델이 `opus[1m]`이고 `effortLevel`이 `xhigh`라 세션이 길어진다. idle compaction은 200K 토큰부터 자동으로 압축한다. 1M 세션의 맥락을 더 오래 유지하려면 `env`에 `CLAUDE_CODE_IDLE_COMPACT_MIN_TOKENS`(예: `400000`)를 넣는다. 맥락을 그대로 두고 싶으면 `"idleCompaction": false`로 끈다. 어느 쪽이든 명시적으로 정해 둔다.
- **난이도**: ★☆☆ (약 5분)

### 2. MCP 권한 규칙을 `mcp__<server>__*` 형태로 정리
- **파일**: `~/.claude/settings.json` (`permissions.allow`/`deny`), 각 프로젝트의 `.claude/settings.json`
- **근거**: 이번 버전부터 `mcp__a` 규칙은 이름이 정확히 같은 서버에만 적용된다. figma·google-sheets·mobbin·blender·lazyweb 등 연결된 MCP 서버의 allow 규칙이 접두어 매칭에 기대고 있었다면 권한 프롬프트가 다시 뜬다. 서버 전체 이름 기준으로 다시 적는다.
- **난이도**: ★★☆ (약 15분)

### 3. changelog-sync의 `claude -p` stderr를 로그로 남기기
- **파일**: `~/.claude/skills/claude-changelog-sync/` 안의 동기화 스크립트 (매일 08:00 cron 실행)
- **근거**: settings 파일 검증에 실패하면 `claude -p`가 이제 stderr에 원인을 출력한다. cron 실행은 화면에 보이지 않으므로 `2>> <로그파일>`로 stderr를 파일에 쌓는다. 버전 문서가 비어 생성될 때 원인을 바로 찾을 수 있다.
- **난이도**: ★☆☆ (약 10분)

### 4. custom agent의 `tools:` 목록 점검
- **파일**: `~/.claude/agents/*.md`
- **근거**: agent의 `tools:` 목록도 이제 이름을 지정한 MCP 서버의 도구만 받는다. Opus subagent 위임이 기본인 환경이라, MCP 도구를 쓰는 agent가 도구를 조용히 잃으면 위임한 작업이 실패한다. `mcp__` 항목을 서버 전체 이름 형태로 맞춘다.
- **난이도**: ★★☆ (약 15분)
