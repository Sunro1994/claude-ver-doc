# Claude Code v2.1.283

> 작성일: 2026-09-27

---

# 📋 요약본

## 🎉 신기능 (11건)
- **게이트웨이 prompt ID 헤더** — 게이트웨이 힌트 헤더에 `x-claude-code-prompt-id`가 추가됐다. LLM 게이트웨이가 사용자 프롬프트 하나를 처리하는 요청들을 한 묶음으로 볼 수 있다. `CLAUDE_CODE_GATEWAY_HINT_HEADERS=1`로 켠다.
- **`availableModelsMatch` 관리 설정** — 값을 `"exact"`로 두면 `availableModels` 항목은 적힌 모델 버전 하나만 허용한다. 새 모델이 나와도 목록에 추가하기 전까지는 막힌다.
- **`deniedModels` 관리 설정** — 특정 모델을 차단한다. `availableModels`가 허용한 모델이라도 여기 있으면 막힌다.
- **OTel 도구 출력 기록 확대** — `OTEL_LOG_TOOL_CONTENT=1`이면 MCP 도구, WebFetch, WebSearch 결과도 `tool.output` span 이벤트에 남는다.
- **`/doctor prompt-audit`** — `/checkup prompt-audit`로도 부른다. CLAUDE.md, 스킬, 에이전트, 커맨드를 훑어서 예전 모델용으로 쓰인 프롬프트 패턴을 찾아낸다.
- **다른 세션 메시지 펼치기** — 전체화면 모드에서 다른 세션의 잘린 메시지를 클릭하면 전체가 보인다.
- **`plugin_errors`에 `path` 추가** — stream-json `system/init`의 `--plugin-dir` 로드 실패 항목에 로드되지 않은 디렉터리 경로가 찍힌다.
- **Claude apps 게이트웨이 `load_test_mode`** — 켜면 요청을 만들고 서명까지만 하고 upstream으로는 보내지 않는다. 클라이언트는 미리 정해 둔 응답을 받는다. 배포 환경 부하 테스트용이다.
- **`mantle` upstream provider** — Claude apps 게이트웨이가 Amazon Bedrock의 Mantle endpoint를 upstream으로 쓸 수 있다.
- **[Claude Tag] Slack 검색 채널 제한** — "Channels Claude can search" 관리자 설정이 생겼다. Claude가 Slack에서 검색하는 범위를 자신이 추가된 공개 채널로 제한한다. 조직, 워크스페이스, 채널 단위로 설정한다.
- **[Claude Tag] Back to Slack 버튼** — Claude 계정을 연결한 뒤 뜨는 페이지에서 원래 있던 스레드로 바로 돌아간다.

## 🛠️ 개선/수정 (16건)
- **SDK 세션 안정성** — 턴이 일찍 끝날 때 지연된 tool call이나 완료된 결과가 사라지던 문제를 고쳤다. 워커 재시작 뒤 승인 프롬프트가 멈춰 있던 문제와 non-streaming fallback의 `result.usage` 오류도 고쳤다.
- **MCP 안정성** — 도구가 백그라운드로 넘어간 뒤에도 진행 알림이 보인다. 세션이 끝날 때 시작 중이던 stdio 서버도 함께 종료된다. 원격 서버가 잠깐 404를 내도 이후 세션 내내 못 쓰게 되지 않는다. URL이 잘못된 서버에서는 인증 메뉴가 뜨지 않는다. `claude mcp add`/`add-json`/`remove`는 설정 파일 쓰기에 실패하면 성공이라고 보고하지 않는다.
- **MCP UX** — `/mcp` 도구 목록에 한 번에 더 많은 도구가 보이고, 페이지 키와 마우스로 스크롤된다. 조직이 차단한 도구에는 경고 아이콘이 붙는다. MCP 도구가 반환한 이미지는 파일로도 저장돼 Bash, Read 등 다른 도구에서 열 수 있다. 로그인 완료 페이지 디자인이 바뀌었다.
- **모델/사용량 표시** — telemetry를 꺼도 주간 Fable 한도가 보인다. `/model`의 `[1m]` 허용 판정과 Haiku 버전·가격 표시가 정확해졌다. 모델 fallback 중에 시작한 dynamic workflow가 원래 설정한 모델로 재시도한다. `DISABLE_PROMPT_CACHING_HAIKU`가 제대로 동작한다.
- **플러그인 관리** — `claude plugin validate` 검증이 엄격해졌다. `details`가 MCP 서버 수를 정확히 보여준다. 마켓플레이스를 지우면 함께 제거된 플러그인 목록을 알려준다. 대소문자만 다른 플러그인을 엉뚱하게 삭제하던 문제를 고쳤다. version이 없는 플러그인이 설치 당시 커밋으로 복원된다. 홈 디렉터리를 옮긴 뒤에도 로드된다.
- **`installed_plugins.json` 복구** — 읽을 수 없는 레코드가 있어도 파일이 날아가지 않는다. 파일 전체가 손상되면 원본을 옆에 백업한 뒤 새로 만든다.
- **`/context` 정확도** — MCP 서버 instructions가 별도 행으로 표시되고 합계에 포함된다.
- **키바인딩/입력** — 빠르게 연속 입력한 키가 이전 상태 기준으로 처리되던 문제를 고쳤다. `ctl+k` 같은 오타는 debug 로그에 경고가 남는다. 키바인딩 가이드의 chord 대기 시간 설명이 3초로 바로잡혔다. 다시 바인딩한 뒤 footer 힌트가 예전 키를 안내하던 문제를 고쳤다.
- **vim 모드** — `.` 반복, `J` 줄 합치기, 커서 위치가 실제 Vim과 똑같이 동작하도록 여러 곳을 고쳤다.
- **sandbox/git** — worktree에서 `GIT_CONFIG_COUNT`로 넘긴 CA 인증서를 인식한다. sandbox proxy 로그인을 credential helper에 저장하려다 실패 메시지가 뜨던 문제를 고쳤다. managed `sandbox` 설정에서 값 하나가 잘못되면 그 값만 막히고 나머지는 적용된다.
- **auto-memory 쓰기** — git 레포 하위 디렉터리에서 실행했을 때 memory 파일 편집이 민감 파일 쓰기로 오인돼 막히던 문제를 고쳤다.
- **목록 UI 통일** — `/tasks`, `/help`, `/hooks`, `/plugin` 등 대부분의 목록이 페이지 키, 마우스 휠, 클릭을 지원한다. 검색창 옆 목록은 포인터를 하나만 강조한다.
- **성능** — 첫 응답과 첫 요청이 빨라졌다. `claude -p`와 Remote에서는 대화형 UI를 로드하지 않는다. compaction 스피너가 실제 요약 토큰 수를 보여준다.
- **정책/동작 변경** — third-party provider를 쓰거나 telemetry를 끈 대화형 세션은 권한 모드를 따로 정하지 않았으면 auto mode로 시작한다. `--system-prompt` 계열 옵션은 텍스트와 `-file`을 함께 받는다. 2.1.282에서 예약했던 `claude-ai` 이름은 되돌렸다.
- **Windows 보안** — PowerShell 도구에서 `cmd /c rd`/`del` 등으로 드라이브 루트나 홈 폴더를 지울 수 있던 문제를 고쳤다.
- **VSCode·Cloud·Claude Tag·Code Review** — 권한 모드 표시와 세션 복원 문제, 클라우드 세션에서 이미 끝낸 단계를 다시 실행하던 문제, Slack 중복 답변, 리뷰 과금 오류 등을 고쳤다.

## 🔑 이번 버전의 핵심 키워드
**"통제와 정리"** — 관리자가 모델을 더 세밀하게 막을 수 있게 됐고, `prompt-audit`로 오래된 프롬프트를 점검할 수 있다. 플러그인과 MCP의 여러 조용한 실패도 고쳤다.

---

# 📜 원문 (한글 번역본)

> 원문 ChangeLog를 원래 순서 그대로 한 줄도 빠짐없이 번역한 문서입니다.

- 게이트웨이 힌트 헤더에 `x-claude-code-prompt-id` 추가. LLM 게이트웨이가 사용자 프롬프트 하나를 처리하는 요청들을 묶을 수 있다. `CLAUDE_CODE_GATEWAY_HINT_HEADERS=1`로 켠다.
- `availableModelsMatch` managed setting 추가. `"exact"`로 두면 `availableModels` 항목은 적힌 모델 버전만 허용하므로, 새 릴리스는 목록에 올리기 전까지 막힌다.
- `deniedModels` managed setting 추가. `availableModels`가 허용하더라도 특정 모델을 차단한다.
- `OTEL_LOG_TOOL_CONTENT=1`일 때 MCP 도구, WebFetch, WebSearch 출력도 `tool.output` OpenTelemetry span 이벤트에 추가.
- `/doctor prompt-audit`(`/checkup prompt-audit`도 가능) 추가. CLAUDE.md 파일, 스킬, 에이전트, 커맨드에서 예전 모델용으로 쓰인 프롬프트 패턴을 점검한다.
- 전체화면 모드에서 다른 세션의 잘린 메시지를 클릭해 펼치는 기능 추가.
- stream-json `system/init`의 `plugin_errors`에서 `--plugin-dir` 로드 실패 항목에 `path` 추가. 로드되지 않은 디렉터리를 알려준다.
- Claude apps 게이트웨이 설정에 opt-in `load_test_mode` 블록 추가. 요청을 만들고 서명하지만 upstream으로 보내지 않고 클라이언트에 미리 정한 응답을 돌려준다. 배포 환경 부하 테스트에 쓴다.
- Claude apps 게이트웨이에 Amazon Bedrock Mantle endpoint용 `mantle` upstream provider 추가.
- SDK 세션에서 턴이 일찍 끝날 때 지연된 tool call이나 완료된 tool 결과가 사라지던 문제, 워커 재시작 뒤 승인 프롬프트가 멈춰 있던 문제, non-streaming fallback의 `result.usage` 문제 수정.
- 오래 걸리는 tool call이 백그라운드로 넘어간 뒤 MCP 진행 알림이 버려지던 문제 수정. 백그라운드 작업에 최신 진행 상황이 표시된다.
- 시작 중인 stdio MCP 서버가 세션 종료 후에도 계속 실행되던 문제 수정.
- stateless 원격 MCP 서버(예: 재배포 중인 proxy)가 잠깐 HTTP 404를 내면, 연결됨으로 표시된 채 세션 내내 쓸 수 없게 되던 문제 수정.
- 유효한 URL이 없는 서버의 MCP 로그인이 알아보기 힘든 SDK 에러로 실패하던 문제 수정. 이런 서버는 `/mcp`에서 Authenticate를 보여주지 않는다.
- telemetry를 끄면 주간 Fable 한도가 `/usage`와 VS Code 사용량 미터에 나타나지 않던 문제 수정.
- 일반 id는 거부되는 경우인데도, 날짜나 `-v1:0` 접미사가 붙은 id에 `[1m]`을 붙인 Sonnet 4.6·Sonnet 5를 `/model`이 받아들이던 문제 수정.
- `ANTHROPIC_DEFAULT_HAIKU_MODEL`로 다른 모델을 지정해도 `/model` picker가 하드코딩된 Haiku 버전과 가격을 보여주던 문제 수정.
- 모델 fallback 중에 시작한 dynamic workflow가 설정된 모델을 재시도하지 않고 모든 에이전트를 fallback 모델로 돌리던 문제 수정.
- Haiku가 세션의 메인 모델이면 `DISABLE_PROMPT_CACHING_HAIKU`가 효과 없던 문제 수정.
- Claude Code가 설치할 수 없는 플러그인·마켓플레이스 이름을 `claude plugin validate`가 허용된다고 말하던 문제 수정. `marketplace.json`에 그런 이름이 있으면 이제 검증에 실패한다.
- `outputStyles`, `themes`, `monitors`, `lspServers` 경로가 없거나 플러그인 디렉터리 밖을 가리키는데도 `claude plugin validate`가 통과시키던 문제 수정.
- `plugin.json`에 서버를 선언한 플러그인에 대해 `claude plugin details`가 MCP 서버 0개로 표시하던 문제 수정.
- `claude plugin marketplace remove`가 마켓플레이스와 함께 제거한 설치 플러그인을 알려주지 않던 문제 수정. 이제 목록을 보여준다.
- 지정한 플러그인에 해당 scope의 `enabledPlugins` 항목이 없을 때, id가 대소문자만 다른 다른 플러그인이 옵션·secret과 함께 `claude plugin uninstall`로 제거되던 문제 수정.
- version을 선언하지 않은 플러그인의 캐시 파일이 없어지면, 설치했던 커밋이 아니라 소스의 최신 커밋으로 조용히 복원되던 문제 수정.
- 홈이나 config 디렉터리를 옮긴 뒤(예: bind-mount된 devcontainer) 사용자가 설치한 플러그인과 마켓플레이스가 "cache-miss"로 로드되지 않던 문제 수정.
- 잘못된 plugin id의 레코드가 들어 있으면 `installed_plugins.json`이 플러그인을 하나도 보여주지 않던 문제 수정. 이런 파일도 다시 로드된다.
- 이 버전이 읽을 수 없는 레코드가 있으면 `installed_plugins.json`이 다시 쓰이며 레코드를 잃던 문제 수정. `claude plugin` 커맨드가 해당 레코드와 복구 방법을 알려준다.
- screen-reader 모드의 권한 다이얼로그가 따옴표로 감싼 커맨드와 경로를 다이얼로그 자체 문구처럼 읽던 문제 수정.
- `/context`가 MCP 서버 instructions를 세지 않던 문제 수정. 이제 별도 행으로 나오고 합계에 포함된다.
- Warp 터미널에서 markdown 링크가 클릭 가능한 하이퍼링크가 아니라 일반 텍스트로 보이던 문제 수정.
- 샌드박스 안처럼 user·local config 파일을 쓸 수 없을 때 `claude mcp add`, `add-json`, `remove`가 성공을 보고하던 문제 수정.
- 클라우드 세션에서 답변 첫 단어가 Claude가 쓰는 대로 스트리밍되지 않고 늦게 나타나던 문제 수정.
- Claude 내장 키바인딩 가이드가 chord 대기 시간을 3초가 아니라 1초라고 하고 `cmd`를 `meta`의 별칭이라고 안내하던 문제 수정. 이 안내 때문에 대부분의 터미널이 보내지 않는 `cmd+` 단축키가 만들어질 수 있었다.
- `keybindings.json`이 `ctl+k` 같은 modifier 오타를 조용히 받아들이던 문제 수정. 이제 debug 로그에 경고하고 수정안을 제시한다.
- `keybindings.json`에서 `footer:openSelected`를 다시 바인딩하거나 해제한 뒤에도 footer 힌트가 "Enter to view"라고 표시되던 문제 수정.
- 빠르게 함께 입력된 키(type-ahead, key repeat, ssh·tmux의 몰아치는 입력)가 가끔 이전 상태를 기준으로 처리되던 문제 수정.
- CA 인증서를 `GIT_CONFIG_COUNT` 환경 변수 쌍으로 git에 넘기면 worktree checkout이 인증서 검증(예: Git LFS 다운로드)에 실패하던 문제 수정.
- 샌드박스 안의 `git`이 credential helper에 sandbox proxy 로그인을 저장하도록 요청해 "failed to store"가 출력되던 문제 수정.
- managed `sandbox` 설정의 중첩 값 하나가 잘못되면 블록 전체가 무시되던 문제 수정. 잘못된 값은 fail closed 처리되고 나머지는 계속 적용된다.
- git 레포 하위 디렉터리에서 Claude Code를 시작하면 Claude가 자기 auto-memory 노트를 고치는 것이 민감 파일 쓰기로 막히던 문제 수정.
- `DISABLE_TELEMETRY`나 `DO_NOT_TRACK`으로 telemetry를 끄면 유료 플랜에서 Remote Control을 쓸 수 없던 문제 수정.
- 좁은 터미널에서 `/remote-control` 메뉴의 QR 코드 안내가 단어 중간에서 잘리던 문제 수정.
- vim 모드에서 `.`가 Shift+Enter 줄바꿈을 빠뜨리고, 커서를 악센트 문자 안쪽에 두고, 마지막 줄에서 `3J`나 Visual 모드 `J`를 쓴 뒤 더 이전 변경을 반복하던 문제 수정.
- vim 모드 커서 위치 수정. normal 모드에서 10,000자가 넘는 프롬프트를 불러와도 커서가 끝을 넘어가지 않고, `V` 다음 `p`를 하면 첫 번째 비공백 문자에 놓인다.
- vim 모드 `J`가 Vim과 다른 간격으로 줄을 합치던 문제(`)` 앞 공백, tab 뒤 공백 등)와, 마지막 줄에서 `3J`나 Visual 모드 `J`를 해도 커서가 Vim처럼 움직이지 않던 문제 수정.
- Windows: PowerShell 도구에서 `cmd /c rd`, `rmdir`, `del`, `erase`로 드라이브 루트, 홈 폴더 등 `Remove-Item`이 거부하는 폴더를 지울 수 있던 문제 수정.
- `/mcp` 도구 목록 개선. 한 번에 더 많은 도구를 보여주고, 페이지 키와 마우스로 스크롤되며, 조직이 차단한 도구에 경고 아이콘을 붙인다.
- MCP 도구 결과 개선. MCP 도구가 반환한 이미지를 파일로도 저장해 Bash, Read 등 다른 도구가 열 수 있다.
- `/tasks` 개선. 행에 상태 아이콘, 이름, 잘리지 않은 정보가 표시된다. 작업이 많아도 제목과 키 안내가 화면에 남는다. 페이지 키, 마우스 휠, 클릭을 지원한다.
- `/help`, `/hooks`, `/copy`, `/chrome`, `/memory`, `/ide`, `/release-notes`, `/rewind`, `/diff`, `/remote-env`, `/plugin` 등의 목록과 picker에 페이지 키, 마우스 휠, 클릭 지원 추가.
- `/skills`, `/artifacts`처럼 검색창 옆에 있는 목록은 검색창에 입력 포커스가 있을 때 포인터를 흐리게 표시해, 강조되는 포인터가 하나만 남도록 개선.
- compaction 스피너 개선. 타이머가 compaction 시작 시점부터 돌고, 퍼센트 바 대신 스트리밍되는 요약의 토큰 수를 센다.
- MCP 서버 로그인 뒤 뜨는 브라우저 페이지 개선: 가운데 정렬, 다크 모드, 새 아트워크.
- 로드에 실패한 플러그인에 속한 스킬을 부를 때 Skill 도구의 응답 개선. Claude가 스킬이 설치되지 않았다고 하지 않고 플러그인을 로드하지 못했다고 알려준다.
- Claude Code 설정에 대한 `prompt-audit` 개선. 오래된 경로, 오래된 커맨드, 서로 충돌하는 instruction 파일을 보고서 맨 앞에 두고, Claude Code 문서에 있는 thinking 키워드는 지적하지 않는다.
- `installed_plugins.json`을 전혀 읽을 수 없을 때의 복구 개선. 다시 만들기 전에 기존 내용을 옆 파일에 보관하고, `claude plugin list`가 그 파일을 알려준다.
- artifact 데이터베이스 읽기 개선. 정렬된 쿼리가 한 페이지를 꽉 채워 반환하면 한 페이지뿐이라는 것과 나머지를 읽는 방법을 알려준다.
- 첫 응답 지연 개선. 세션의 첫 응답이 끝날 때 돌던 패턴 컴파일 단계를 응답이 스트리밍되는 동안 실행한다.
- 미리 연결해 둔 API 연결을 재사용해 첫 요청 지연 개선.
- 시작 속도 개선. `claude -p`와 Claude Code Remote는 대화형 UI를 로드하지 않고, auto-mode classifier 규칙과 Artifact 도구는 실행 시점이 아니라 처음 쓸 때 로드한다.
- 첫 실행처럼 Artifact 도구 기능 정보를 아직 모르는 claude.ai 계정의 시작 속도 개선. 프롬프트가 확인을 위해 최대 1.5초 기다리지 않고, 필요하면 첫 메시지가 기다린다.
- third-party provider를 쓰거나 telemetry를 끈 대화형 세션은 권한 모드가 설정돼 있지 않으면 auto mode로 시작하도록 변경. `permissions.defaultMode`가 있으면 그 값이 우선한다.
- `/ultrareview` 시작 다이얼로그에 로컬 브랜치를 리뷰하면 추적 중인 파일의 커밋되지 않은 변경이 업로드될 수 있다는 안내 추가.
- Opus가 이미 1M context window를 가지는 경우 `/model` picker의 Opus 행과 Default 모델 이름에서 "(1M context)" 표기 제거. window 크기는 그대로다.
- 터미널 프롬프트 제안이 20번 연속 쓰이지 않으면 덜 자주 나타나도록 변경. 하나를 쓰면 다시 원래대로 나온다.
- `--system-prompt`와 `--append-system-prompt`가 텍스트와 `-file` 형태를 함께 받도록 변경. 파일 내용이 먼저 온다.
- `Skill(anthropic-skills:<name>)` deny 규칙이 Claude Desktop이 플러그인으로 전달한 해당 스킬도 막도록 변경. `Skill(skill:<name>)` deny는 스킬의 별칭과 표시 이름에도 매칭된다.
- `/rewind`, `/diff` 목록이 다른 모든 목록과 같은 키바인딩 액션(`select:*`)으로 움직이도록 변경. `messageSelector:*`/`diff:*` 재바인딩도 계속 동작한다.
- `/workflows` 실행 목록 크기를 다른 목록과 같게 변경. inline에서는 터미널의 절반을 쓰고, 아래에 프롬프트가 보일 때도 제목을 화면에 유지한다.
- git이 설치돼 있으면 `claude plugin eval`이 git 2.31 이상을 요구하도록 변경. 더 오래된 git에서는 버전을 알려주며 실행을 거부한다.
- artifact watch 변경. 사용자가 요청하지 않고 자동으로 걸린 watch는 3.5시간 동안 활동이 없으면 끝난다. artifact를 다시 publish하거나 watch하면 다시 걸린다.
- Self-hosted runner: lifecycle hook의 git이 레포의 Git LFS `pre-push` hook을 건너뛰고, 쓰기 가능한 시스템 `core.hooksPath`를 무시하고, `--configure-git` 없이는 커밋에 서명하지 않도록 변경.
- Self-hosted runner: Anthropic 관리 git에서 `GIT_SSL_CAINFO`, `GIT_SSL_NO_VERIFY` 처리 변경. runner 자체 git은 Anthropic git 경로를 항상 검증하고, 경고 문구가 어느 설정이 어디에 적용되는지 알려준다.
- 2.1.282의 `claude-ai` 이름 예약을 되돌림. 이 이름의 스킬, 커맨드, workflow, MCP 서버 스킬·프롬프트가 다시 로드되고, `Skill(claude-ai:*)` 규칙은 일반 prefix 규칙으로 동작한다.
- [VSCode] auto나 bypass 모드에서 자동으로 빠져나오는 전환이 실패했을 때, 세션은 계속 그 모드로 도는데 권한 모드 표시는 Default로 나오던 문제 수정. 이제 전환이 성공할 때까지 재시도한다.
- [VSCode] 웹에서 teleport한 세션이 Claude 작업 중에 보낸 메시지를 잃던 문제 수정.
- [VSCode] 예전 버전이 빈 로컬 사본을 저장해 둔 경우 Web 세션이 세션 목록에서 숨겨지고 그 자리에 빈 채팅이 열리던 문제 수정.
- [VSCode] 다시 연 세션에서 자동 continuation처럼 턴 도중에 받은 메시지를 기준으로 턴이 나뉘던 문제 수정.
- [VSCode] 다시 로드한 세션에 rewind로 지운 턴이 보이거나, compaction 이전 행만 보이던 문제 수정.
- [VSCode] 좁은 패널에서 footer의 agents pill 아이콘이 중앙에서 벗어나고 상태 점이 가장자리에 붙던 문제 수정.
- [VSCode] 줄바꿈으로 끝나는 줄들을 긴 프롬프트에 붙여 넣은 뒤 채팅 입력의 텍스트가 커서와 선택 영역보다 약간 아래에 보이던 문제 수정.
- [Cloud sessions] 실행 중인 클라우드 세션에 레포 추가 개선. GitHub 계정이 읽기만 가능하고 push는 못 하는 private 레포도 읽기 전용으로 붙는다.
- [Cloud sessions] 서버 쪽 재시작에서 복구한 뒤 클라우드 세션이 중복 댓글이나 push처럼 이미 끝낸 단계를 가끔 다시 하던 문제 수정.
- [Cloud sessions] 새 routine 일정의 기본값을 정각에서 몇 분 지난 시각으로 변경. 정각에 맞춘 routine은 몇 분 늦게 시작될 수 있다는 안내를 함께 보여준다.
- [Claude Tag] "Channels Claude can search" 관리자 설정 추가. Claude의 Slack 검색을 자신이 추가된 공개 채널로 제한한다. 조직, 워크스페이스, 채널 단위로 설정한다.
- [Claude Tag] Claude 계정 연결 후 나오는 페이지에 시작했던 스레드로 돌아가는 Back to Slack 버튼 추가.
- [Claude Tag] 채널이 attach rule로 access bundle을 받으면 채널 configure 페이지에 connector와 플러그인이 하나도 나오지 않던 문제 수정. rule로 붙은 bundle도 이제 표시된다.
- [Claude Tag] 선택한 레포가 많은 목록으로 제한된 GitHub App 설치에서 access-bundle 레포 검색이 일부 레포를 놓치던 문제 수정.
- [Claude Tag] 답변 도중 새 메시지가 끼어들면 Claude가 같은 답변을 두 번 올리던 문제 수정.
- [Claude Tag] Slack Connect 공유 등으로 Slack 채널 ID가 바뀐 오래된 private 채널에서 채널 routine이 멈추던 문제 수정.
- [Claude Tag] "Channel only"로 설정된 채널에서 guest가 아닌 멤버가 들어왔는데 Slack의 멤버십 확인이 늦으면 대화가 모두 끝나던 문제 수정.
- [Code Review] GitHub가 pull request를 돌려주지 못하면 "@claude review" 요청이 조용히 사라지던 문제 수정. 한 번 재시도하고, 그래도 실패하면 댓글로 이유를 설명한다.
- [Code Review] 검증한 내용 없이 시간 제한에 걸려 멈춘 리뷰의 과금 문제 수정. incomplete로 표시되고, 요금이 청구되지 않으며, 한 번 재시도한다.

---

## 🎯 챌린지

이번 버전에서 내 환경에 적용해볼 만한 항목입니다.

### 1. 전역 CLAUDE.md를 prompt-audit로 점검
- **파일**: `~/.claude/CLAUDE.md`
- **근거**: `/doctor prompt-audit`는 예전 모델용 프롬프트 패턴을 찾아내고, 오래된 경로와 커맨드, 서로 충돌하는 지시를 보고서 맨 앞에 보여준다. 현재 CLAUDE.md는 ⛔ 같은 강조 표현이 많고, 제거된 스킬(`qa-agent`, `/deploy-precheck` 등) 이력도 여러 줄 남아 있다. 보고서에서 지적된 줄만 골라 정리하면 매 세션 컨텍스트가 줄고 지시끼리 부딪히는 일도 줄어든다.
- **난이도**: ★★☆ (약 20분)

### 2. MCP instructions 토큰을 확인하고 안 쓰는 서버 끄기
- **파일**: `~/.claude.json` (`mcpServers` 섹션)
- **근거**: 이제 `/context`에서 MCP 서버 instructions가 별도 행으로 보인다. lazyweb처럼 긴 instructions를 넣는 서버와 blender, figma, mobbin, google-sheets 등이 늘 연결되어 있다. `/context`로 실제 비용을 확인하고, 현재 작업(EOS/Flyff)에 필요 없는 서버는 제거하거나 프로젝트 scope로 옮긴다.
- **난이도**: ★☆☆ (약 10분)

### 3. changelog-sync의 고정 출력 규칙을 system prompt 파일로 분리
- **파일**: `~/.claude/skills/claude-changelog-sync/` (내부의 `claude -p` 호출 스크립트)
- **근거**: 이번 버전부터 `--append-system-prompt`와 `--append-system-prompt-file`을 함께 쓸 수 있고, `claude -p`는 대화형 UI를 로드하지 않아 더 빨리 시작한다. 매 버전 똑같이 반복되는 출력 포맷과 작성 규칙을 파일 하나로 빼고, 사용자 프로필에는 버전별 ChangeLog만 넣으면 스크립트가 단순해지고 규칙 관리도 한곳에서 한다.
- **난이도**: ★★☆ (약 15분)
