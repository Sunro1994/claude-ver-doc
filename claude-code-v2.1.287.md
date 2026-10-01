# Claude Code v2.1.287

> 작성일: 2026-10-02

---

# 📋 요약본

## 🎉 신기능 (9건)
- **Claude Mods** — 플러그인이 Claude Code의 더 깊은 동작까지 바꿀 수 있다.
- **You should know (내장 mod)** — 옆에서 따로 도는 에이전트가 사용자나 Claude가 놓친 부분을 짚어준다.
  - 켜는 법: `/plugin enable cc-plugin-you-should-know@builtin`
  - 조건: first-party 세션이고 telemetry가 켜져 있어야 한다.
- **agents view `n:<text>` 필터** — 세션 이름과 task를 검색한다. 접힌 섹션에 있는 결과도 보여주고, Enter를 누르면 첫 번째 결과가 열린다.
- **OpenTelemetry `prompt_text` 필드** — `user_prompt` 이벤트에 `prompt` 복사본이 추가됐다. `prompt`를 지우거나 가리던 곳에서는 `prompt_text`도 똑같이 처리해야 한다.
- **MCP URL 프롬프트** — 2025-11-25 프로토콜을 쓰는 MCP 서버가 로그인 같은 URL 요청을 보낼 수 있다. 업데이트 뒤 연결이 안 되는 서버는 설정 항목에 `"bareElicitationCapability": true`를 넣는다.
- **Windows 셸 도구 경고** — Bash 도구를 막으면 PowerShell 도구도 같이 꺼진다. 이때 셸 도구가 하나도 없게 되므로 시작할 때 경고를 띄운다.
- **Self-hosted runner 내장 `gh api`** — GitHub CLI가 없는 macOS·Linux에서도 REST 전용 `gh api`를 쓸 수 있다. Anthropic-managed git을 쓰는 세션에만 해당한다.
- **[VSCode] "Run in background"** — 실행 중인 명령이나 sub-agent를 백그라운드로 옮기고 다른 작업을 이어간다.
- **[VSCode] agent map 출력 표시** — 백그라운드 셸과 Monitor의 출력이 agent map 카드에 나온다.

## 🛠️ 개선/수정 (16건)
- **위험한 `rm` 안전장치 복구** — `/`나 홈 디렉토리를 지우는 `rm`에 `~`·와일드카드 경로로의 출력 리다이렉트가 붙으면 "항상 묻기"가 빠지던 문제를 고쳤다.
- **민감 파일 쓰기 차단 강화** — repo에 커밋된 symlink를 거쳐 민감 파일이나 작업 폴더 밖에 쓰면, 실제로 써지는 위치를 보여주고 사람의 승인을 기다린다. Bash 전체 허용 규칙이나 허용 hook이 있어도 credential 파일 쓰기는 실행하지 않고 묻는다.
- **CLAUDE.md 중복 첨부 수정** — 세션 재개나 compaction 뒤에 폴더 CLAUDE.md가 두 번 붙던 문제를 고쳤다.
- **hook 안정화** — 스크립트 파일이 없는 `asyncRewake` hook이 Claude를 계속 깨우던 문제를 고쳤다. 이제 한 번만 보고한다. "N hooks ran" 숫자에서 내부 callback을 뺐다. 동기화된 플러그인의 SessionStart hook이 cloud 세션에서 실행된다.
- **모델 전환 관련 수정** — Opus 5.5와 Sonnet 5.5를 오가면 앞선 extended thinking이 사라질 수 있던 문제를 고쳤다. `-p`·SDK에서 model fallback이 반복되던 문제도 고쳤다. 자동 모델 전환 때 현재 effort level을 유지한다.
- **Fable 기본값 추종** — claude.ai 로그인에서 저장된 Fable 기본값이 Opus·Sonnet처럼 최신 Fable을 따라간다.
- **1M context 기본화** — Bedrock·Vertex·Foundry·Claude apps gateway에서 Opus 4.7 이상과 Fable이 `[1m]` 없이 1M을 쓴다. 200K로 돌리려면 `CLAUDE_CODE_DISABLE_1M_CONTEXT=1`을 설정한다.
- **MCP 개선** — `alwaysLoad: false`이면 그 서버의 도구 전체를 tool search 뒤로 미룬다(필요할 때만 불러온다). 큰 결과를 처리할 때 메모리를 덜 쓴다. 도구 호출이 두 번 실행되던 문제를 고쳤다. headless 모드에서는 일시적으로 실패한 연결을 다시 시도한다.
- **`/advisor` 짝 검사** — Sonnet 5.5가 Opus 4.7·4.8의 advisor가 될 수 있다. API가 거절할 짝은 조용히 버리지 않고 미리 표시한다.
- **권한 프롬프트 가독성** — 내부 parser 이름(예: "Contains simple_expansion") 대신 쉬운 설명을 보여준다. 대기 중인 프롬프트는 오래된 순으로 뜬다. MCP 도구 호출은 점선 사이에 보여준다.
- **Remote Control·cloud 세션 안정화** — 재연결이 30초 안에 안 되면 다시 시도한다. 파일 업로드 대기 시간을 35초로 늘리고 실패하면 한 번 재시도한다. macOS 유휴 잠자기에 들어가도 멈추지 않는다. 큰 이미지는 줄여서 보낸다.
- **screen reader 모드 다수 수정** — 커서 위치, diff 누락, 같은 내용 반복 읽기, 쓸모없는 안내 문구를 고쳤다.
- **`/config`·`/memory` 키 조작** — 값이 순환하는 설정은 ←/→로 앞뒤로 움직인다. PgUp·PgDn으로 페이지를 넘긴다. `/memory`의 on/off 설정은 좌우 화살표로 바꾼다.
- **플러그인·마켓플레이스 오류 문구** — 마켓플레이스가 무시되거나 거부된 이유를 쉬운 말로 알려준다. 설치되지 않은 의존성을 표시하고, 덜 끝난 설치는 업데이트할 때 다시 시도한다.
- **`claude agents` 동작 변경** — 답장은 대기열 메시지로 도착한다. 실행 중에 보낸 slash command는 `/stop`만 바로 실행되고 나머지는 턴이 끝난 뒤 실행된다. 백그라운드 세션의 권한 프롬프트가 안 보이던 문제를 고쳤다.
- **[VSCode]·[Cloud]·[Claude Tag]·[Code Review] 수정** — 탭 중복 실행, 링크 미동작, 토큰 거부, Slack 알림 남발, 리뷰 코멘트가 문장 중간에서 끊기던 문제 등을 고쳤다.

## 🔑 이번 버전의 핵심 키워드
**"플러그인이 더 깊이 들어오고, 실수는 더 단단히 막는다"** — Claude Mods와 You should know로 확장성을 넓혔고, `rm`·symlink·credential 쓰기 차단을 강화했다.

---

# 📜 원문 (한글 번역본)

> 원문 ChangeLog를 원래 순서 그대로 한 줄도 빠짐없이 번역한 문서입니다.

- Claude Mods 추가: 플러그인이 이제 더 깊은 동작을 수정할 수 있다
- You should know 추가. 옆에서 도는 에이전트가 사용자와 Claude가 놓칠 수 있는 것을 지켜보고 알려주는 내장 mod다. `/plugin enable cc-plugin-you-should-know@builtin`로 켠다 (telemetry가 켜진 first-party 세션 대상)
- agents view에 세션 이름과 task를 검색하는 `n:<text>` 필터 추가. 필터를 걸면 접힌 섹션의 결과도 보여주고, Enter를 누르면 첫 번째 결과가 열린다
- OpenTelemetry `user_prompt` 이벤트에 `prompt_text` 추가. 점이 들어간 키를 중첩 구조로 바꾸는 백엔드를 위한 `prompt`의 복사본이다. `prompt`를 지우거나 가리는 곳이라면 `prompt_text`도 똑같이 처리한다 (anthropics/claude-code#70763)
- 2025-11-25 프로토콜을 쓰는 MCP 서버의 URL 프롬프트 추가 (예: 로그인). 이 업데이트 뒤 서버가 연결되지 않으면 해당 MCP 설정 항목에 "bareElicitationCapability": true를 추가한다
- Windows: Bash 도구를 거부하면 PowerShell 도구도 꺼져 Claude가 쓸 셸 도구가 없어지는 경우, 시작할 때 경고를 띄우도록 추가
- Self-hosted runner: GitHub CLI가 설치되지 않은 macOS·Linux 머신에서 Anthropic-managed git을 쓰는 세션용 내장 `gh api` (REST 전용) 추가
- 사용자 계정이 없는 에이전트가 소유한 원격 세션에서, 조직이 허용해도 fast mode가 계속 꺼져 있던 문제 수정
- 재연결 요청에 응답이 없으면 Remote Control이 몇 분씩 메시지를 받지 못하던 문제 수정. 이제 30초 뒤 포기하고 다시 시도한다
- `asyncRewake`로 설정된 hook의 스크립트 파일이 없으면 "found issues" 알림으로 Claude를 계속 깨우던 문제 수정. 고장 난 hook은 이제 한 번만 보고한다
- 모델 응답 스트림이 데이터 없이 멈춰 있는 동안 tool heartbeat가 SDK host에 전달되지 않던 문제 수정
- Bedrock·Vertex 시작 시 모델 확인이 강제된 `availableModels` 목록을 무시해 `/model`이 Opus 한 줄로 줄어들 수 있던 문제 수정
- Chrome에 연결할 수 없을 때 Claude in Chrome 브라우저 선택기가 JSON parse 오류를 보여주던 문제 수정
- claude.ai 로그인에서 `/model`로 Fable을 고르면 현재 버전 id가 저장되던 문제 수정. 이제 저장된 기본값이 Opus·Sonnet처럼 최신 Fable을 따라간다
- Opus 5.5와 Sonnet 5.5 사이를 전환할 때(`/model`, `opusplan`) 앞선 MCP 도구 안내가 다시 쓰여 이전 extended thinking이 사라질 수 있던 문제 수정
- 답변이 thinking으로 시작했을 때, 응답 중간에 도착한 Amazon Bedrock Guardrails 차단이 guardrail 메시지 대신 API 오류로 턴을 끝내던 문제 수정
- 위험한 `rm`(예: `/`나 홈 디렉토리 대상)이 같은 명령 안에서 `~`나 와일드카드 경로로 출력을 리다이렉트하면 "항상 묻기" 안전장치가 사라지던 문제 수정
- 답변이 실행되는 중에 모델을 바꾸면 `claude -p`와 SDK 세션이 이후 메시지마다 model fallback을 반복하던 문제 수정
- 세션을 재개하거나 compaction을 한 뒤 폴더의 CLAUDE.md가 한 번 더 첨부되던 문제 수정
- 에이전트가 종료되면서 세션을 시작한 worktree를 지운 경우, 백그라운드 세션을 `claude agents`에서 다시 열 수 없던 문제 수정
- `/advisor` 짝 검사 수정: Sonnet 5.5가 이제 Opus 4.7·4.8의 advisor가 될 수 있고, API가 거절할 advisor는 조용히 버리지 않고 미리 표시한다
- Bash 권한 프롬프트가 쉬운 설명 대신 "Contains simple_expansion" 같은 내부 parser 이름을 보여주던 문제 수정
- 느리거나 바쁜 머신의 fullscreen 세션에서, 긴 대화 중 스크롤 키를 누르고 있으면 "Claude Code exited after an unrecoverable interface error"로 종료되던 원인 하나를 수정
- 이름이 `__proto__`인 MCP 도구에 대해 조직의 도구별 권한 상한이 조용히 빠지던 문제 수정
- JSON으로 저장된 큰 MCP 결과를 Read의 offset·limit으로 나눠 읽으라고 Claude에게 안내하던 문제 수정 (한 줄로 된 긴 내용은 나눌 수 없다)
- compaction 뒤에 commit attribution 리마인더가 도구 결과 안에 섞여 전달되던 문제 수정
- screen reader 모드에서 검색창(/resume, /permissions 등)과 로그인 코드 입력란의 커서가 입력한 글자에서 떨어져 있던 문제 수정
- screen reader 모드에서 /rewind의 요약 옵션이 아무것도 입력하지 않은 Enter를 거부하던 문제 수정 (추가 내용은 선택 사항이다)
- screen reader 모드에서 Tab이 아무 동작도 하지 않는 승인 프롬프트에 "Tab to amend" 안내가 나오던 문제 수정
- screen reader 모드에서 /permissions·/mcp에 동작하지 않는 화살표 키를 안내하고, 빈 메뉴나 검색창이 키를 가져간 상태에서 "Select with numbers"라고 말하던 문제 수정
- screen reader 모드에서 파일 편집 승인 프롬프트와 다른 diff의 변경 줄이 빠지던 문제 수정
- screen reader 모드에서 `claude --teleport` 진행 화면과, 확인 중인 MCP 폼 필드를 spinner가 돌 때마다 screen reader에 다시 보내던 문제 수정
- `CLAUDE_CODE_DISABLE_EXPERIMENTAL_BETAS`가 세션 제목 요청과 prompt-hook 요청에서 structured-output 형식을 빼지 못하던 문제 수정 (Bedrock 기반 gateway는 이를 거부한다)
- 이전 화면이 터미널 창보다 길 때, screen reader 모드에서 두 번째 승인 프롬프트의 윗줄, 바뀐 /config 행, 거절된 plan 줄이 빠지던 문제 수정
- `--include-partial-messages`가 중간에 잘린 답변의 `message_stop`을 늦게 보내거나 아예 안 보내, 앱이 답변을 계속 진행 중으로 보여줄 수 있던 문제 수정
- `claude agents`가 백그라운드 세션이 기다리는 권한 프롬프트를 가끔 보여주지 않던 문제 수정
- 읽을 수 없는 커밋된 `.gitattributes`(예: UTF-16으로 저장된 파일) 때문에 업로드가 멈추면 `/ultrareview`가 `.git/info/attributes`에 대한 조언을 하던 문제 수정
- HTTP proxy 뒤에서 `claude remote-control` 등록이 실패하며 "Check your organization permissions"라는 엉뚱한 오류를 보여주던 문제 수정 (anthropics/claude-code#97352)
- Linux의 sandbox 처리된 Bash 명령이 Claude Code 실행 파일의 열린 handle을 물려받던 문제 수정
- "Reduce motion" 설정을 켜도 실행 중 도구 점과 spinner 세 개가 계속 움직이던 문제, /rewind 확인 화면이 메모를 입력하는 동안 "ago" 시간을 갱신하던 문제 수정
- screen reader 모드에서 `claude agents`의 시간이 매초 바뀌던 문제 수정. 이제 최대 10초마다 바뀐다
- 취소된 claude.ai 로그인이 "OAuth token revoked" 대신 일반 `API Error: 401`을 보여주던 문제 수정. `-p` 모드에서는 오류가 "Failed to authenticate"로 시작한다
- `/ultrareview` 업로드가 거부될 때, repository 설정 파일에 적힌 변수를 사용자 설정으로 복사하라고 안내하던 문제 수정
- `/<skill>`을 프롬프트로 입력해 실행한 `context: fork` skill의 턴을 `--output-format stream-json`과 SDK가 스트리밍하지 않던 문제 수정 (Skill 도구의 fork는 스트리밍한다)
- /feedback·/bug 수정: 미리 채워진 GitHub issue에 최근 오류 메시지가 더는 들어가지 않고, 확인 화면이 이를 보고 내용의 일부로 보여준다
- repository가 평문 http로 제공될 때 `claude plugin marketplace add --sparse`와 `git-subdir` 플러그인 설치가 "transport 'http' not allowed"로 실패하던 문제 수정
- compaction 중에 세션이 재시작되면 cloud 세션이 앞선 대화를 가끔 잃던 문제 수정
- 시작 시 `--plugin-url` 다운로드와 겹친 플러그인 reload가 세션에 캐시된 플러그인 archive를 망가뜨리던 문제 수정
- Claude Desktop 열기가 시간 초과되거나 출력이 너무 많을 때 `/desktop`이 일부 출력만 인용하던 문제 수정. 이제 오류가 원인을 알려준다
- MCP 서버가 지원하는 MCP 프로토콜 버전을 바꾸면 connector 도구 호출이 가끔 두 번 실행되거나, 재시작 전까지 connector 호출이 실패하던 문제 수정
- 동기화된 플러그인의 SessionStart hook이 새 cloud 세션에서 실행되지 않던 문제 수정
- transcript의 "N hooks ran" 요약과 verbose debug log의 matched-hooks 개수에 Claude Code 내부 callback이 포함되던 문제 수정. 이제 설정한 hook 하나가 두 개로 표시되지 않는다
- cloud·Remote Control 세션에서 Claude가 보내는 파일의 업로드가 30초 시간 초과 직후에 끝나면 실패하던 문제 수정. 이제 35초를 기다린다
- cloud·SDK 세션에서 세션 중간에 추가한 repository의 skill과 플러그인이 로드되지 않고, CLAUDE.md는 Claude가 디렉토리를 바꾼 뒤에야 늦게 로드되던 문제 수정
- 한 변이 8,000픽셀을 넘는 PNG·JPEG·WebP 이미지를 원격 세션에서 보내지 못하던 문제 수정. 이제 축소한 사본을 보낸다
- Claude 앱에서 첨부 파일 17~20개와 함께 보낸 메시지가 처음 16개만 전달하던 문제 수정
- headless 세션에서 한 번 거절된 호출 뒤에 MCP 서버를 인증 필요 상태로 보고하던 문제 수정 (이후 호출은 성공한다)
- macOS: `claude remote-control`로 시작한 Remote Control 세션이 Mac이 유휴 잠자기에 들어가면 턴 중간에 멈추던 문제 수정
- Windows: 입력이 pipe나 리다이렉트로 들어오면 interactive `claude`가 "Raw mode is not supported"로 멈추거나 죽던 문제 수정. 이제 이유를 알려주고 종료한다 (pipe 입력에는 `-p`를 쓴다)
- Bedrock·Vertex·Mantle: `ANTHROPIC_CUSTOM_HEADERS`가 `Authorization` 헤더를 다시 지정할 때, `CLAUDE_CODE_SKIP_*_AUTH` 아래의 모델 가용성 확인이 실제 요청과 다른 `Authorization` 헤더를 보내던 문제 수정
- `/config` 개선: 순환하는 설정은 ‹ ›를 표시하고 ←/→로 양방향 이동한다. 좁은 터미널에서는 각 값을 라벨 아래에 쌓는다. PgUp·PgDn으로 목록을 페이지 단위로 넘긴다
- 플러그인 마켓플레이스 오류 개선: 마켓플레이스가 무시되거나 거부된 이유와 해야 할 일을 쉬운 말로 알려준다
- 플러그인 목록 개선: 의존성이 설치되지 않았으면 표시하고, 플러그인 업데이트 시 끝나지 않은 설치를 다시 시도한다
- Amazon Bedrock이 모델 ID를 거부할 때 Claude apps gateway의 오류 개선: 개발자는 어떤 모델이 안 되는지 볼 수 있고, gateway 로그에 보낸 ID가 남는다
- SDK 세션 개선: priority "now"로 보낸 메시지가 실행 중인 web fetch나 web search를 더는 취소하지 않고, 백그라운드에서 계속 로딩한다
- `/memory` 개선: 좌우 화살표 키로 Auto-memory 같은 on/off 설정을 바꾼다
- 메시지 중간에 입력한 `/skill` 이름 개선: `disable-model-invocation` skill까지 포함해, 그것이 skill이라는 사실을 Claude에게 알린다
- light 테마에서 프롬프트 입력 테두리와 이전 메시지 앞 ❯의 대비 개선
- cloud 세션과 Remote Control에서 Claude가 보내는 파일 전달 개선: 시간 초과, 네트워크 오류, 502·503·504로 실패한 업로드를 한 번 재시도한다
- 일시적인 이유로 파일을 보내지 못할 때 Claude의 안내 개선: 몇 분 뒤 파일을 다시 요청할 수 있다고 알려준다
- 다른 세션에서 보류된 메시지의 프롬프트 개선: 다른 권한 프롬프트처럼 메시지를 점선 사이에 보여준다
- MCP 등 도구 권한 프롬프트 개선: 파일 편집 프롬프트처럼 도구 호출을 점선 사이에 보여준다
- headless 모드의 MCP 시작 개선: 첫 연결이 일시적으로 실패한 원격 서버는 가장 느린 서버의 연결을 기다리지 않고 다시 시도한다
- 원격 세션에서 Claude가 보내는 파일 개선: 큰 파일은 메모리에 올리지 않고 디스크에서 스트리밍한다. 크기 제한을 넘는 파일은 서버의 제한값을 밝히며 거부한다
- Remote Control·cloud 세션에서 보낸 파일을 서버가 거부할 때(예: 너무 큰 이미지) Claude의 설명 개선
- 큰 MCP 도구 결과 처리 개선: 메모리를 덜 쓰고, 세션 파일이 작아지며, 한도를 크게 넘는 결과는 token을 세기 위한 추가 업로드를 하지 않는다
- Windows: 모든 명령 전에 실행되던 subshell을 없애 Bash 도구 속도 개선
- 변경: repo에 커밋된 symlink를 거쳐 민감 파일이나 작업 폴더 밖에 쓰는 셸 쓰기는 실제 위치를 밝히고 사람을 기다린다. `~` 대상이 있는 줄도 포함한다
- 변경: Bedrock·Vertex·Foundry·Claude apps gateway에서 Opus 4.7 이상과 Fable이 `[1m]` 접미사 없이 기본으로 1M context window를 쓴다 (`CLAUDE_CODE_DISABLE_1M_CONTEXT=1`이면 200K 유지)
- 변경: `claude agents`의 답장은 대기열 메시지로 도착한다. 턴 실행 중에 보낸 `/stop` 외의 slash command는 턴이 끝난 뒤 실행된다
- 변경: Bash 도구 전체 허용 규칙과 허용 hook이 있어도, Claude Code 파일 도구가 아예 거부하는 파일(Anthropic profile store, host credentials 파일)에 대한 셸 쓰기는 실행하지 않고 묻는다
- 변경: Windows·Linux의 우클릭 붙여넣기와 Linux의 가운데 클릭 붙여넣기는 버튼을 뗄 때 일어난다. 떼기 전에 포인터를 치우면 취소된다
- 변경: MCP 서버의 `alwaysLoad: false`가 그 서버의 도구 전체를 tool search 뒤로 미룬다
- 변경: screen reader 모드가 새 줄이나 바뀐 줄을 쓸 때 줄 맨 앞에 커서를 두고 잠시 멈추지 않는다. 멈춤을 되살리려면 `CLAUDE_AX_PREPARK_MS=50`을 설정한다
- 변경: 표시된 메시지 뒤의 자동 모델 전환이 새 모델의 기본값 대신 현재 effort level을 유지한다
- 변경: 대기 중인 권한 프롬프트를 오래된 순으로 보여줘, 새 프롬프트가 읽고 있는 프롬프트를 덮지 않는다 (countdown이 있는 프롬프트는 여전히 위에 열린다)
- [VSCode] 실행 중인 명령이나 sub-agent에 "Run in background" 추가. 백그라운드로 옮기고 작업을 계속한다
- [VSCode] agent map 카드에 백그라운드 셸과 Monitor 출력 추가
- [VSCode] Claude Code의 답장이 너무 커서 저장 확인을 못 할 때 설정 대화상자가 시간 초과 탓을 하던 문제 수정
- [VSCode] side bar가 이미 이 머신으로 가져온 cloud 세션을 다시 열면 새 탭에서 또 열리던 문제 수정. 이제 side bar를 보여준다
- [VSCode] 창이 로드된 뒤 시작된 cloud 세션이 side bar의 Web 탭에 나오지 않던 문제 수정. 로드에 실패하면 "No web sessions yet" 대신 "Remote server is not connected"라고 표시한다
- [VSCode] reload 뒤 복원된 탭이 side bar가 이미 연 대화에 두 번째 Claude 프로세스를 띄우던 문제 수정. 이제 "still open somewhere else" 안내를 보여준다
- [VSCode] 도구 행의 파일 링크, 세션 목록 링크, 안내 두 개가 일반 텍스트로 보이던 문제 수정
- [VSCode] 메인 턴이 끝나면 백그라운드 에이전트의 실행 중인 명령이 실패로 표시되던 문제 수정
- [VSCode] 명령 메뉴에서 사용자가 만든 `/usage`·`/context` 명령을 고르면 실행 대신 extension 대화상자가 열리던 문제 수정
- [VSCode] plan 미리보기 탭의 파일 링크를 눌러도 아무 일이 없던 문제 수정. 이제 채팅 답변의 링크처럼 파일을 연다
- [VSCode] WSL 같은 원격 host에서 탭이 늦게 뜨면 도구 입력·출력을 editor 탭으로 열 때 "Timeout waiting after 1000ms"로 실패하던 문제 수정
- [VSCode] Manage plugins 대화상자 개선: 마켓플레이스 추가·제거·새로고침이 실패하면 무엇이 잘못됐는지 알려준다
- [VSCode] Claude in Chrome의 "Enabled by default" 스위치가 editor 자체 세션도 연결하도록 변경. 이 세션들도 브라우저 작업 전에 묻는다
- [Cloud sessions] 새로 발급된 access token을 GitHub이 잠깐 거부할 때 GitHub fetch·push가 가끔 실패하던 문제 수정
- [Claude Tag] GitHub 활동 같은 백그라운드 이벤트가 Claude를 깨웠고 답을 기다리는 사람이 없는데도, Slack thread에 실패 경고(예: spend limit 알림)를 올리던 문제 수정
- [Claude Tag] 채널이 많은 조직에서 관리자 설정의 spend limits 페이지에 최근 만든 채널과 비공개 채널이 빠지던 문제 수정
- [Claude Tag] 긴 Slack thread의 task list 개선: 백그라운드 작업이 이를 새 메시지로 다시 올리지 않아, thread를 따라가는 사람에게 알림이 가지 않는다
- [Code Review] finding 코멘트와 "Why this was flagged" 문구가 문장 중간에서 끊기던 문제 수정. 이제 완결된 문장으로 끝난다
- [Code Review] 이전 커밋에서 리뷰가 두 번 실패한 PR을 새 push 뒤에 건너뛰던 문제 수정. 이제 최신 커밋을 리뷰한다
- [Code Review] 대화가 잠긴 PR의 리뷰 실패 카드 개선: 잠금 때문에 리뷰가 막혔고 아무것도 올리거나 청구하지 않았다고 알려준다

---

## 🎯 챌린지

이번 버전에서 내 환경에 적용해볼 만한 항목입니다.

### 1. You should know mod 켜기
- **파일**: `~/.claude/settings.json` (`enabledPlugins`에 `"cc-plugin-you-should-know@builtin": true` 추가)
- **근거**: 이번 버전의 내장 mod다. 옆에서 도는 에이전트가 사용자나 Claude가 놓친 것을 짚어준다. CLAUDE.md의 "실수가 잦지 않게 신경쓴다"·"예외는 선 보고" 원칙과 잘 맞는다. 단, telemetry가 켜진 first-party 세션에서만 동작하므로 켠 뒤 실제로 알림이 뜨는지 확인한다.
- **난이도**: ★☆☆ (약 5분)

### 2. 무거운 MCP 서버를 필요할 때만 불러오기
- **파일**: `~/.claude.json` (`mcpServers`의 `lazyweb`·`figma`·`google-sheets`·`mobbin` 항목에 `"alwaysLoad": false` 추가)
- **근거**: 이번 버전부터 `alwaysLoad: false`이면 그 서버의 도구 전체를 tool search 뒤로 미룬다. 지금 환경에는 도구가 수십 개인 MCP 서버가 여럿 붙어 있다. 자주 쓰지 않는 서버를 미뤄두면 매 세션의 context 낭비가 준다. 적용 뒤 `/context`로 도구가 차지하는 양이 줄었는지 확인한다.
- **난이도**: ★★☆ (약 15분)
