# Claude Code v2.1.295

> 작성일: 2026-10-09

---

# 📋 요약본

## 🎉 신기능 (17건)
- **hook `onFailure: "block"`** — command·HTTP hook이 시작하지 못하거나, 시간 초과로 끝나거나, 예상하지 못한 종료 코드를 내면 작업을 통과시키지 않고 막는다. 지금까지는 실패한 guard hook이 작업을 그대로 통과시켰다.
- **Program Status Protocol(OSC 7501)** — 이 프로토콜을 지원하는 터미널은 Claude Code가 작업 중인지, 사용자를 기다리는지, 끝났는지를 표시한다.
- **`/copy` 인용문 복사** — 초안 메시지를 `>` 기호 없이 복사한다.
- **plugin 설정 파일 경고** — `claude plugin install`·`enable`·`disable`·`marketplace add`가 쓰려는 settings 파일이 로드되지 않으면 경고한다.
- **`claude -p` 대기 사유 표시** — 마지막 턴 뒤에도 실행이 끝나지 않으면, 무엇을 기다리는지 stderr(터미널일 때)에 한 줄로 알린다.
- **gateway `timeouts.upstream_ttfb_ms`** — Bedrock·Vertex·Foundry 등 클라우드 upstream에서 응답 스트림이 시작되기까지의 대기 상한을 정한다. 넘으면 다른 upstream으로 넘기거나(failover) 502를 반환한다.
- **"Backgrounding cancelled" 메시지** — `←`로 백그라운드 전환을 기다리는 중에 턴을 멈추면 이 메시지를 띄운다.
- **gateway upstream `models` 목록** — 목록에 있는 모델만 해당 upstream으로 보낸다. failover 때도 같다. `*` 와일드카드를 1개 쓸 수 있다.
- **사용자 설정 `forceLoginMethod: "gateway"`** — managed settings가 없는 기기에서는 사용자 설정에 `forceLoginGatewayUrl`도 함께 넣을 수 있다. 그러면 `/login`이 해당 gateway로 열린다.
- **`claude plugin validate` README 조언** — README에 설치 명령 줄이 없으면 붙여 넣을 줄을 알려준다. 종료 코드는 바꾸지 않는다.
- **gateway 감사 로그 `upstream_request_id`** — `inference` 이벤트에 upstream의 요청 ID를 남긴다. 지원 문의에 쓴다.
- **mod `$.ui.notify`** — 사용자 알림 설정에 맞춰 네이티브 알림을 띄우고, 어느 채널이 보냈는지 표시한다.
- **mod `Button` 자식 요소** — 문자열과 `Text`를 넣을 수 있다. 목록 한 줄 전체를 누를 수 있는 버튼으로 만든다.
- **`CLAUDE_CODE_RETRY_WATCHDOG_MAX_WAIT_MS`** — 무인 재시도 모드(`CLAUDE_CODE_RETRY_WATCHDOG`)가 429·529 에러를 기다리는 최대 시간을 정한다.
- **gateway `request-id` 헤더** — 성공 응답에 붙인다. telemetry의 `request_id`와 gateway 감사 로그를 맞춰 볼 수 있다.
- **[VSCode] 파일 전송 행** — Claude가 보낸 파일을 채팅에 한 줄로 보여준다. 파일 이름을 클릭하면 편집기에서 열린다.
- **[Claude Tag] 채널 관리자 추가 확인** — 채널 관리자를 추가하면 해당 멤버가 Custom roles로 옮겨진다. 다른 권한을 잃을 수 있어서 추가 전에 확인을 받는다.

## 🛠️ 개선/수정 (20건)
- **`[1m]` 모델 실패 수정** — gateway·Bedrock·Vertex·Foundry가 context-1m beta를 거부하면 모든 요청이 실패했다. 이제 beta를 빼고 다시 보낸다.
- **`claude -p` 응답 누락 수정** — 백그라운드 작업이 새 턴을 시작해도 각 턴의 응답을 턴이 끝날 때 출력한다.
- **원격 MCP 재연결 수정** — headless·SDK 세션에서 15초가 넘는 장애 뒤에도 다시 연결한다. 연결이 반복해서 끊기면 최대 30초까지 간격을 늘린다.
- **MCP 파일 확장자 수정** — CSS·JS·XML 파일이 `.bin`으로 저장되어 Read tool이 읽지 못하던 문제를 고쳤다.
- **Bash `command_description` 호환** — 모델이 `description` 대신 `command_description`을 넘겨도 Bash 호출이 실패하지 않는다.
- **`--tools`·`--restricted` 적용 범위 수정** — 실행 뒤에 등록되는 내장 tool에도 적용한다.
- **mod hook 입력 잘림 수정** — 깊게 중첩된 입력이 에러 없이 잘려서, guard가 보지 못한 내용을 통과시키던 문제를 고쳤다.
- **`FORCE_COLOR=3` 상속 수정** — 백그라운드 세션의 명령·hook 출력에 색상 코드가 섞이지 않는다.
- **Workflow 내 forked skill 결과 수정** — 결과가 메인 대화가 아니라 호출한 agent에게 간다.
- **파일 읽음 판정 수정** — `cat`이 출력 없이 끝났거나 mtime(파일 수정 시각)이 그대로인 채 내용이 바뀐 경우, 파일을 이미 읽은 것으로 보지 않는다.
- **skill `allowed-tools`·`effort` 유실 수정** — `-p` 실행에서 skill의 Bash 명령이 거부되던 문제를 고쳤다.
- **async hook 다중 줄 JSON 인식** — 여러 줄로 출력한 JSON도 무시하지 않는다.
- **SessionStart hook 개선** — `CLAUDE_ENV_FILE` 변수가 `/resume`·`/branch` 뒤에도 Bash tool에 전달된다. async hook의 같은 컨텍스트를 resume 때마다 다시 넣지 않는다.
- **터미널 멈춤 수정** — 수만 줄 응답, 깊게 중첩된 인용, 긴 줄 문법 강조에서 터미널이 멈추던 문제를 고쳤다.
- **`/loop` 제어 수정** — 백그라운드로 옮긴 `/loop`을 Esc로 멈출 수 있다. wakeup(예약된 다음 실행)을 놓치면 알린다.
- **subagent worktree git 정보 수정** — 자기 worktree를 가진 subagent에게 부모 세션의 branch·status를 보여주지 않는다.
- **`xhigh`·`max` effort 속도 개선** — web search와 `agent` hook 평가가 크게 느려지던 문제를 고쳤다.
- **Grep 플래그 허용** — `-l`·`-c`·`-r`을 넘겨도 호출이 실패하지 않고 실행된다.
- **MCP tool 설명 길이 상향** — tool search로 로드하는 설명을 2,048자 대신 16,384자에서 자른다.
- **subagent skill 미리 로드 상한** — `skills` 필드의 skill은 최대 32개까지, 각각 한 번만 미리 로드한다.

## 🔑 이번 버전의 핵심 키워드
**"실패하면 막는다"** — hook 실패 시 차단(`onFailure`), guard 우회 구멍 차단, 무인 실행(`-p`·백그라운드·MCP)의 안정성을 함께 다진 버전이다.

---

# 📜 원문 (한글 번역본)

> 원문 ChangeLog를 원래 순서 그대로 한 줄도 빠짐없이 번역한 문서입니다.

- command·HTTP hook에 `onFailure: "block"` 추가: 시작하지 못하거나, 시간 초과로 끝나거나, 예상하지 못한 코드로 종료한 hook이 작업을 통과시키지 않고 차단한다
- Program Status Protocol(OSC 7501) 지원 추가: 이를 구현한 터미널은 Claude Code가 작업 중인지, 사용자를 기다리는지, 완료됐는지 표시할 수 있다
- `/copy` 선택기에 인용문 추가: 초안 메시지를 `>` 기호 없이 복사한다
- `claude plugin install`·`enable`·`disable`·`marketplace add`가 기록하는 settings 파일이 로드되지 않으면 경고를 추가했다
- `claude -p` 실행이 마지막 턴 뒤에도 열려 있으면, 무엇을 기다리는지 알리는 줄을 stderr에 추가했다(stderr가 터미널일 때)
- Claude apps gateway의 Bedrock·Vertex·Foundry 및 기타 클라우드 upstream에 `timeouts.upstream_ttfb_ms` 지원 추가: 설정한 값만큼만 스트림 시작을 기다리고, 넘으면 failover하거나 502를 반환한다
- `←`가 현재 tool 종료를 기다리는 동안 턴을 멈추면 "Backgrounding cancelled" 메시지를 추가했다
- 모든 Claude apps gateway upstream에 선택 항목 `models` 목록 추가: 목록에 있는 모델만 해당 upstream으로 보내고(failover 포함), 항목 하나에 `*` 와일드카드 1개를 쓸 수 있다
- managed settings가 없는 기기에서 사용자 설정의 `forceLoginMethod: "gateway"`·`forceLoginGatewayUrl` 지원 추가: `/login`이 해당 Claude apps gateway로 열린다
- 플러그인 README에 설치 줄이 없으면 `claude plugin validate`가 붙여 넣을 줄을 안내하도록 추가: 종료 코드는 바꾸지 않으며 `--strict`에서도 같다
- Claude apps gateway의 `inference` 감사 이벤트에 `upstream_request_id` 추가: Amazon Bedrock·Anthropic API 등 upstream의 요청 ID로, 지원 문의용이다
- mod용 `$.ui.notify` 추가: 사용자의 알림 설정을 거쳐 네이티브 알림을 띄우고 보낸 채널을 표시한다
- mod `Button`에 자식 요소(문자열·`Text`) 추가: 목록의 한 행을 칩이나 흐린 세부 정보를 포함한 하나의 버튼으로 만든다
- 무인 재시도 모드(`CLAUDE_CODE_RETRY_WATCHDOG`)가 429·529 에러를 기다리는 시간의 상한을 정하는 `CLAUDE_CODE_RETRY_WATCHDOG_MAX_WAIT_MS` 추가
- Claude apps gateway의 성공한 inference 응답에 `request-id` 헤더 추가: Claude Code telemetry의 `request_id`가 gateway 감사 로그와 일치한다
- gateway·Bedrock·Vertex·Foundry가 context-1m beta를 거부하면 `[1m]` 모델의 모든 요청이 실패하던 문제 수정: 이제 beta 없이 다시 보낸다
- 백그라운드 작업이 새 턴을 시작하면 `claude -p` 텍스트 출력이 앞선 응답을 누락하던 문제 수정: 각 턴의 응답을 턴이 끝날 때 출력한다
- headless·SDK 세션에서 원격 MCP 서버가 15초 넘는 장애 뒤 계속 연결 끊김 상태로 남거나, 연결 직후 끊는 서버에 쉬지 않고 재연결하던 문제 수정: 반복해서 끊기면 최대 30초까지 대기 간격을 늘린다
- 서버의 에러 응답에 우연히 네트워크 에러 이름이 들어 있으면 원격 MCP 연결이 끊기던 문제 수정
- pagination cursor를 반복하는 MCP 서버에 연결할 때마다 같은 페이지를 최대 20번 요청하던 문제 수정
- MCP tool이 반환한 CSS·JavaScript·XML 파일이 Read tool이 거부하는 .bin으로 저장되던 문제 수정: 폰트·아이콘 파일도 각자의 확장자를 받는다
- 모델이 `description` 대신 `command_description`을 넘기면 Bash tool 호출이 실패하던 문제 수정
- Claude in Chrome이 포트 80으로 쓴 사이트 차단 규칙(`host:80`)을 해당 호스트의 일반 `http://` 페이지에 적용하지 않던 문제 수정
- `/plugin`의 Errors 탭에서 Enter를 누르면 확인 없이, 로드에 실패한 marketplace를 제거하고 그 플러그인들을 제거하던 문제 수정
- 어떤 플러그인도 설치할 수 없는 이름의 marketplace에 대해 `claude plugin marketplace add`가 성공을 보고하던 문제 수정: 이제 추가를 거부한다
- `CLAUDE_AUTO_BACKGROUND_TASKS`가 뒤에서 편집·셸 명령이 기다리는 subagent를 백그라운드로 옮겨, subagent가 끝나기 전에 그 호출이 시작되던 문제 수정
- `claude remote-control` 세션에서 휴대폰 메시지 직후, `/config` 토글이 없을 때, 또는 Claude Code 안에서 시작했을 때 PushNotification이 푸시를 보내지 않았다고 말하던 문제 수정
- 원격 세션에서 256개가 넘는 파일을 한 번에 보내면 "could not be vouched for"로 거부되던 문제 수정
- 로그인 갱신 직후 시작할 때 드물게 managed settings 로드에 실패하던 문제 수정
- Claude Code를 다시 시작할 수 없을 때 `/tui`가 메시지 없이, 또는 날것의 시스템 에러와 함께 종료되던 문제 수정
- 응답이 남긴 색상·숨김 스타일 때문에 텍스트로 표시한 링크 주소가 가려지던 문제 수정(표 안 줄바꿈, 질문 미리보기 포함)
- Claude apps gateway에 로그인한 세션에서 `availableModels`에 넣은 Fable 모델이 `/model` 선택기에 나타나지 않던 문제 수정: 같은 모델의 `modelPicker` 행 대신 내장 행을 보여준다
- 개발자 세션이 그룹 정보를 더 이상 갖지 않는데도 gateway 관리자 지출 화면에 예전 그룹·그룹 상한이 보이던 문제 수정
- `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC`가 `/usage`·status line에서 gateway 지출 한도를 숨기던 문제 수정. 지출 한도 요청은 세션이 로그인한 gateway로 간다
- 자체 linked worktree의 subagent에게 부모 세션의 git branch·status·최근 커밋이 보이던 문제 수정
- 프롬프트에 입력한 텍스트로 `←` 백그라운드 전환을 취소하면 Claude가 현재 tool이 끝날 때 멈추던 문제 수정: 이제 foreground에서 계속 작업한다
- `--tools`·`--restricted`가 실행 뒤 등록되는 내장 tool에 적용되지 않고, 폐기된 tool 이름이 호출자의 tool 집합 밖의 tool에 닿던 문제 수정
- Claude가 MCP 서버의 resource 목록을 기다리는 동안 중단해도 시간 초과까지 턴이 끝나지 않던 문제 수정
- mod의 hook이 깊게 중첩된 tool 입력을 에러 없이 잘린 채로 받아, guard가 보지 못한 내용을 통과시킬 수 있던 문제 수정
- `←`로 백그라운드에 옮긴 self-paced `/loop`을 Esc로 멈출 수 없던 문제 수정: 대기 중인 wakeup을 취소하면 알림을 띄운다
- 백그라운드 세션의 명령·hook이 `FORCE_COLOR=3`을 물려받아, Claude가 읽는 출력에 색상 escape 코드가 들어가던 문제 수정
- 세션이 열린 상태에서 `claude agents`와 백그라운드 서비스가 함께 중지될 때(예: 재부팅), 종료하면서 새 백그라운드 서비스를 시작해 종료를 늦추고 중단된 세션을 재시작할 수 있던 문제 수정
- `worker`라는 이름의 custom agent가 auto-mode 거부 알림과 task 상세 화면의 활동 목록에서 "Agent"로 표시되던 문제 수정
- glob 패턴을 도는 for-loop의 Bash 권한 검사 수정: 권한 검사 정확도를 높였다
- Workflow subagent에서 호출한 forked skill이 결과를 호출한 agent가 아니라 메인 대화로 보내던 문제 수정
- in-process agent teammate가 tool search로 tool을 로드하기 전까지 첫 SendMessage 호출에 실패하던 문제 수정
- resume 시 끝나지 않은 백그라운드 workflow가 `TaskStop`으로 멈췄을 수 있다고 Claude에게 알리던 문제 수정(그럴 수 없는 원인이다)
- tasks 패널이나 연결된 클라이언트에서 오래 걸리는 MCP tool 호출을 멈춰도 Claude에게 알리지 않던 문제 수정
- 백그라운드 세션의 프로세스가 내려가 있는 동안 다음 wakeup 시점이 오면 `/loop`이 알림 없이 멈추던 문제 수정: 세션이 이를 알리고 Claude에게도 전달한다
- 응답이나 teammate 메시지 안의 날것 터미널 하이퍼링크 바이트가 주소가 숨겨진 클릭 가능한 링크로 그려지던 문제 수정
- 저장소에 큰 git submodule이 있는 plugin marketplace의 추가·갱신이 실패하던 문제 수정: 플러그인 파일이 있는 submodule만 가져온다
- 저장된 advisor 모델을 더 이상 쓸 수 없는데도 `/advisor` 대화상자가 체크 표시를 하던 문제 수정: 이제 "No advisor"로 열린다
- 백그라운드로 옮긴 MCP tool 호출 알림이 줄어든 task id를 보여주던 문제 수정
- vim 모드의 `~`가 커서를 줄 마지막 글자 너머로 옮겨 이후 `x`가 동작하지 않고, `3~`가 다음 줄까지 넘어가던 문제 수정
- macOS에서 복사한 악센트 문자(파일 이름 등)를 프롬프트 중간에 붙여 넣으면 커서가 한 글자 더 가던 문제 수정
- 응답이 수만 줄에 이르면 터미널이 멈추고 ctrl+c도 무시되던 문제 수정
- plugin hooks worker 재시작 중 mod가 다시 로드되는 동안 보낸 호출이 `.catch`가 있는 다른 mod의 guard hook을 통과하던 문제 수정: 이제 그런 호출을 거부한다
- hooks 모듈의 코드가 수천 단계로 중첩된 플러그인이 맨 stack-overflow 메시지만 남기고 로드·검증에 실패하던 문제 수정
- 실제 세션이 유지하는 tool call·tool result·thinking 블록을 제거하는 `session.append` hook을 `claude plugin test`가 통과시키던 문제 수정
- 세션이 kill되고 두 번째로 resume된 뒤, 백그라운드 subagent를 SendMessage로 재개할 수 있다는 사실을 Claude에게 알리지 않던 문제 수정
- `cat` 같은 Bash 명령이 내용을 출력하지 않고 끝났는데도 파일을 이미 읽은 것으로 취급하던 문제 수정
- `constructor`·`prototype`이라는 이름의 plugin option이 항상 기본값으로 읽히고, 수정해도 플러그인을 다시 로드하지 않던 문제 수정
- `/reload-plugins`나 세션 시작이 mod 파일을 읽는 동안 저장한 변경을 mod hot reload가 놓치던 문제 수정
- 답을 고르지 않고 승인하면 mod hot-reloading 질문이 세션 내내 매 턴 다시 나오던 문제 수정
- `/model`·`/fast`·`/output-style`이 플러그인의 `config.set` hook에 묻지 않고 설정을 저장하던 문제 수정
- 파이프 출력에서 dim 텍스트 바로 뒤의 bold 텍스트가 흐리게 그려지던 문제 수정
- 몇 줄마다 인용이 더 깊게 중첩되는 응답이 터미널을 몇 초간 멈추고 수 GB 메모리를 쓰던 문제 수정
- 마지막 reload 후 몇 밀리초 안에 저장한 변경을 mod hot reload가 놓쳐, 다음 저장 전까지 옛 버전에 머물던 문제 수정
- `claude mcp serve`의 백그라운드 Bash 결과가 출력 파일 이름을 알려주지 않고, tool 설명이 오지 않는 알림을 약속하던 문제 수정
- async SessionStart hook의 변하지 않은 컨텍스트가 resume 때마다 대화에 다시 추가되던 문제 수정
- SessionStart hook이 `CLAUDE_ENV_FILE`에 쓴 변수가 앱 내 `/resume`·`/branch` 뒤 Bash tool에 전달되지 않던 문제 수정
- 응답 스트림이 끝나기 전에 Skill tool이 끝나면 skill의 `allowed-tools`·`effort`가 빠져, `-p` 실행에서 skill의 Bash 명령이 거부되던 문제 수정
- managed settings가 플러그인을 나열·활성화하는 기기에서, 변조된 서버 관리 설정 캐시가 개인 플러그인을 조직 관리 플러그인으로 취급하게 만들던 문제 수정
- feature flag를 쓸 수 없는 환경에서, tool search를 거부하는 Claude 3 Opus·Claude 3.x Sonnet 세션에 tool search를 제공하던 문제 수정
- `-p`·SDK 세션에서 생성된 타입 파일이 `--plugin-dir` 플러그인 폴더에 써지던 문제 수정: 이제 mod를 개발 중인 곳에만 쓴다
- 탭이나 양방향 제어 문자가 든 텍스트가 화면 끝에서 끝부분을 잃거나 옆 행을 덮어 그리던 문제 수정
- `/model`이 Max effort 선택을 새 세션 기본값으로 저장했다고 말하던 문제 수정: Max는 현재 세션에만 적용된다
- async hook의 JSON 출력이 여러 줄로 출력되면 무시되던 문제 수정
- Read tool이 빈 `pages` 매개변수를 생략으로 보지 않고 호출을 거부하던 문제 수정
- Windows VS Code에서 드라이브 문자 대소문자 차이로 project-scope 플러그인이 로드되지 않던 문제 수정 (anthropics/claude-code#74612)
- Windows에서 드라이브 문자 대소문자만 다를 때 project·local scope의 `plugin install`·`uninstall`이 설치 기록을 놓치거나 두 번째 기록을 추가하던 문제 수정
- `←` 직후 `↑`나 `Esc`로 대기 메시지를 프롬프트로 되돌리면 메시지가 사라지던 문제 수정: 이제 프롬프트 기록에 남는다
- SDK 호스트가 아무도 답하기 전에 활성화 질문을 닫으면 mod hot-reloading이 세션 내내 꺼지던 문제 수정: 이제 최대 3번까지 묻는다
- mod의 `prompt.submit` hook이 다시 쓰거나 버린 프롬프트가 입력한 그대로 프롬프트 기록과 transcript의 queued-prompt 기록에 저장되던 문제 수정
- 비대화형 세션이 요청과 관계없는 MCP 서버의 인증 필요 사실을 알리던 문제 수정
- Claude apps gateway 로그인 시 `claude_code.auth` OpenTelemetry 로그인 이벤트가 나가지 않던 문제 수정. 기기에 OpenTelemetry가 설정됐거나 세션이 이미 gateway에 로그인돼 있을 때 내보낸다
- 아주 큰 인터페이스를 추가하는 플러그인 때문에 plugin hooks worker가 멈추면 다른 플러그인이 unload되던 문제 수정
- 파일 내용이 바뀌었는데 수정 시각이 그대로면 Edit가 파일을 전부 읽은 것으로 취급하던 문제 수정
- Windows 줄바꿈(CRLF)을 쓰는 짧은 명령 출력이 한 줄로 그려지던 문제 수정
- rewind 뒤 resume하면 멈춘 scheduled task가 되살아나고, compaction 뒤 Esc나 rewind를 거쳐 resume하면 scheduled task가 사라지던 문제 수정
- 줄이 아주 긴 코드, 긴 빈 줄 연속, 닫히지 않은 문자열·heredoc의 문법 강조 중 터미널이 몇 초~몇 분 멈추던 문제 수정
- 중단된 `/ultrareview` 업로드가 `~/.claude/seed-admin`에 남긴 임시 파일을 보존 기간 정리가 지우지 않던 문제 수정
- settings에서 `disableAutoMode`를 지워도 Desktop·SDK 세션이 재시작 전까지 auto mode로 돌아가지 않던 문제 수정
- 다른 세션이 플러그인 업데이트를 동기화한 뒤, 오래 실행된 세션에서 claude.ai 동기화 플러그인 hook이 "Plugin directory does not exist"로 실패하던 문제 수정
- 세션을 백그라운드로 옮기거나 kill 뒤 resume하면 `/rewind` 뒤 보낸 프롬프트가 사라지고 제거한 턴이 돌아오던 문제 수정
- mod의 `session.receive` hook이 메시지를 넘기기 전에 권한을 요청하면 cloud 세션이 멈추던 문제 수정
- macOS에서 업데이트 뒤 함께 재시작한 백그라운드 세션이 가끔 stable app wrapper 밖에서 실행돼 폴더 접근 프롬프트가 다시 뜨던 문제 수정
- headless·SDK 세션에서 늦게 끝난 MCP 로그인·재연결이 `setMcpServers()`로 설정한 서버를 사용자 자신의 서버로 다시 나열하던 문제 수정
- `/config`에서 자동 업데이트 채널을 바꾸면 플러그인의 `config.set` hook에 묻기 전에 저장하던 문제 수정
- macOS: 홈 폴더나 그 상위에서 세션을 시작하면, 시작 시 파일 수 집계가 다른 앱 데이터까지 닿아 "access data from other apps" 프롬프트가 뜰 수 있던 문제 수정
- Amazon Bedrock 위 Claude apps gateway의 토큰 수 계산 개선(`/context`·대용량 파일 읽기에 사용): 1토큰 모델 요청 대신 AWS CountTokens API로 구한다. `bedrock:CountTokens` 권한이 필요하다
- Claude apps gateway의 PostgreSQL DB가 읽기 전용인 동안 30초마다 무엇이 실패하는지와 복구 방법을 경고로 남기도록 개선
- Remote Control·claude.ai·데스크톱 앱에서 권한 프롬프트를 기다리는 세션 상태가 MCP tool을 `mcp__server__tool` 식별자 대신 서버명과 읽기 쉬운 이름으로 표시하도록 개선
- Claude apps gateway 뒤의 백그라운드 요청이 세션 모델 대신 Haiku 4.5를 쓰도록 개선. gateway가 Haiku 4.5를 제공하지 않으면 세션 모델로 돌아간다
- AWS 미국 권역 밖 Amazon Bedrock 리전에서 `models:`에 없는 모델 처리 개선. AWS는 늘 거부했지만, 이제 gateway가 사용자 리전에서 모델을 시도하고 거부되면 추가할 모델을 알려준다
- headless `rate_limit_event` 사용량 한도 경고가 계정의 extra usage 활성 여부를 말하도록 개선
- 내장 `plugin-authoring` skill 개선: 터미널 없는 세션에 터미널 명령을 시키지 않고, mod 공유는 요청할 때만 설명한다
- Grep 입력 처리 개선: grep의 `-l`·`-c`·`-r` 플래그를 넣은 검색이 실패하지 않고 실행된다
- `claude plugin validate`와 플러그인 로딩 개선: 최상위 `var` 재바인딩으로 hooks 모듈을 거부하면 해당 줄·원인·해결책을 알려준다
- Workflow tool의 `scriptPath` 거부 메시지 개선: Read tool이 없는 세션에서도 통하는 방법인 `script` 인라인 전달을 안내한다
- 큰 파일 업로드가 이유 없이 실패할 때 Claude에게 전하는 내용 개선: 파일을 줄이지 않고 실패를 보고한다
- tool search로 로드하는 MCP tool 설명을 2,048자 대신 16,384자에서 자르도록 변경
- subagent가 `skills` 필드에서 미리 로드하는 skill을 최대 32개, 각각 한 번으로 변경. Skill tool이 있는 subagent는 나머지를 직접 호출할 수 있다
- attach한 백그라운드 세션의 대기 프롬프트에서 Ctrl+C가 대기 중인 `/loop` wakeup을 건드리지 않도록 변경: 두 번 누르면 detach되고 loop는 계속 돈다. 멈추려면 Esc를 누른다
- `claude agents`가 백그라운드 서비스와 함께 중지되면(macOS, 또는 서비스 미설치 Linux) 다시 실행하지 않는 한 실행 중 세션이 약 1분 안에 멈추고, 이를 알리도록 변경
- flag를 가져오지 않는 설치에서 claude.ai connector가 기본으로 MCP protocol 버전 2026-07-28을 협상하도록 변경. `MCP_PROTOCOL_NEGOTIATION=legacy`로 끌 수 있다
- 자체 배경이 없는 Artifact 페이지를 off-white 대신 흰색 위에 표시하도록 변경
- tool 실행 후 mod가 tool call을 거부했을 때 Claude와 사용자가 읽는 내용 변경: tool이 실행됐고 플러그인이 결과를 보류했다고 말한다
- 탭 간격을 화면 왼쪽 끝이 아니라 텍스트 시작점부터 세도록 변경: 2칸 들여쓴 답변의 첫 탭 위치가 6칸에서 8칸이 된다
- telemetry를 끈 설치의 Artifact tool 권한 프롬프트를 다른 설치와 같은 5개 질문으로 변경. 이전에는 남의 artifact를 읽을 때마다, 데이터를 편집할 때마다 물었다
- telemetry를 끈 설치에서 scheduled·Run now routine 실행이 다른 설치처럼 묻지 않고 새 private artifact를 게시하고 자기 artifact를 갱신하도록 변경
- 조직 mod의 toast를 다른 mod toast 뒤에서 기다리지 않고 먼저 표시하도록 변경
- Claude apps gateway가 번들된 Claude Desktop schema가 모르는 `desktop` policy key를 경고와 함께 시작하고 제공하도록 변경. 새 Desktop 설정에 gateway 업그레이드가 필요 없다
- WebSocket(`ws`) MCP 서버 변경: 16 MiB가 넘는 메시지는 파싱하지 않고 연결을 닫는다. 다른 transport와 같은 한도다
- [VSCode] Claude가 보낸 파일을 위한 채팅 행 추가: 파일 이름을 클릭하면 편집기에서 열리고, Claude의 설명이 아래에 나오며, Focus view에서도 계속 보인다
- [VSCode] 백그라운드 agent 활동이나 패널 자체 상태 줄 뒤에 "Fork conversation from here"와 Rewind 대화 복원이 "Message not found in session"으로 실패하던 문제 수정
- [VSCode] 채팅 입력에서 Ctrl+Shift+Tab·Cmd+Shift+Tab·Alt+Shift+Tab이 권한 모드도 바꾸고, Ctrl+Tab이 추천 프롬프트를 수락하던 문제 수정
- [VSCode] Claude 뷰 두 개가 동시에 보이면 키보드 포커스가 오가며 입력이 엉뚱한 대화로 갈 수 있던 문제 수정
- Self-hosted runner: runner가 세션 환경에 `CCR_AUTO_MODE_ALLOW`·`CCR_AUTO_MODE_ENVIRONMENT`·`CCR_AUTO_MODE_SOFT_DENY`를 넘기지 않도록 변경
- Self-hosted runner: 큰 저장소에서 git 서버가 아직 진행 상황을 보고하는 중에 git fetch가 끊기던 문제 수정. `CLAUDE_RUNNER_FETCH_SERVER_PROGRESS_CAP_MS`로 대기 시간을 조정하거나 끈다
- [Cloud sessions] cloud 세션 보관 해제 직후 보낸 메시지가 컨테이너를 시작하지 못해 가끔 응답을 받지 못하던 문제 수정
- [Cloud sessions] 일부 오래된 routine이 저장된 프롬프트를 Claude에게 주지 않고 실행되던 문제 수정: 해당 routine은 이제 프롬프트를 다시 실행한다
- [Cloud sessions] 연결이 끊긴 뒤 cloud 세션이 따라잡는 속도 개선: 놓친 활동을 한 행씩이 아니라 한 번에 보여준다
- [Cloud sessions] cloud 환경 양식의 setup script 입력창 개선: 처음부터 더 크고, 스크립트에 맞춰 늘어나며, 드래그로 크기를 바꿀 수 있다
- [Claude Tag] Claude가 Slack 채널에 올리는 설정 확인 카드가 10분 대신 30분 동안 열려 있도록 변경
- [Claude Tag] Enterprise Grid 워크스페이스 간 공유 채널이 조직 기본값을 쓴다는 Claude의 안내를 누군가 Claude를 언급할 때만, 최대 월 1회 게시하도록 변경
- [Claude Tag] fork한 스레드의 "Continued from" 카드에서 채널 링크와 @-멘션이 날것 Slack 코드로 보이던 문제 수정
- [Claude Tag] `@Claude !restart`가 재시작을 이미 확인했는데도 스레드 아래 Slack Working 상태가 계속 돌던 문제 수정
- [Claude Tag] Claude가 태그 없는 메시지 읽기를 멈춘 바쁜 채널에서 다른 앱·봇의 @Claude에 응답하지 않던 문제 수정
- [Claude Tag] Claude Tag 관리자 설정에서 채널 관리자를 추가하기 전에 확인을 추가했다. 추가하면 해당 멤버가 Custom roles로 옮겨져 다른 권한을 잃을 수 있다
- [Code Review] 이전 지적이 아직 열려 있는데도 Code Review 재검토가 문제가 없다고 말하던 문제 수정: 이제 열린 지적 수를 알린다
- [Code Review] pull request가 큰 CLAUDE.md를 수정해도 Code Review가 그 파일의 규칙을 계속 건너뛰던 문제 수정
- `xhigh`·`max` effort에서 web search와 `agent` hook 평가가 훨씬 오래 걸리던 문제 수정

---

## 🎯 챌린지

이번 버전에서 내 환경에 적용해볼 만한 항목입니다.

### 1. deploy-guard.sh 종료 코드 정리
- **파일**: `~/.claude/hooks/deploy-guard.sh`
- **근거**: 챌린지 2에서 `onFailure: "block"`을 켜면 "예상하지 못한 종료 코드"가 모두 차단으로 바뀐다. 먼저 스크립트가 통과 시 `exit 0`, 차단 시 `exit 2`만 내는지 확인해야 한다. 예를 들어 `set -e` 때문에 중간에 실패하면 1이 나갈 수 있다. 확인하지 않으면 모든 Bash 호출이 막힌다.
- **난이도**: ★☆☆ (약 10분)

### 2. push 차단 hook에 `onFailure: "block"` 적용
- **파일**: `~/.claude/settings.json`
- **근거**: 지금은 `deploy-guard.sh`가 실행되지 않거나 멈추면 `git push origin feat/*`가 그대로 통과한다. `PreToolUse` Bash hook 항목에 `"onFailure": "block"`을 추가하면, guard가 실패했을 때도 push가 막혀서 원격 feat 브랜치 사고(2026-07-08 같은 사고)를 막는 마지막 안전장치가 된다.
- **난이도**: ★☆☆ (약 5분)

### 3. 체인지로그 cron에 재시도 대기 상한 설정
- **파일**: `~/.claude/skills/claude-changelog-sync/` 안의 `claude -p` 호출 스크립트
- **근거**: 매일 08:00 무인 실행 중 429·529 에러가 나면 끝없이 기다리거나 바로 실패할 수 있다. `CLAUDE_CODE_RETRY_WATCHDOG=1`과 `CLAUDE_CODE_RETRY_WATCHDOG_MAX_WAIT_MS`(예: `600000`, 10분)를 export하면 대기 상한이 생긴다. 이번 버전에서 `-p` 실행 중 skill의 `allowed-tools`가 빠지던 문제도 고쳐졌으니, 실행 로그로 Bash 거부가 사라졌는지 함께 확인한다. 스크립트의 정확한 파일명은 직접 확인해야 한다.
- **난이도**: ★★☆ (약 15분)
