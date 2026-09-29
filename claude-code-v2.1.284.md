# Claude Code v2.1.284

> 작성일: 2026-09-30

---

# 📋 요약본

## 🎉 신기능 (9건)
- **Claude Sonnet 5.5 추가** — `claude-sonnet-5-5`가 Anthropic API의 기본 Sonnet 모델이 된다. 1M 컨텍스트를 지원한다. 요금은 입력 $2, 출력 $10, 캐시 읽기 $0.20(모두 Mtok당)이다.
- **auto mode에 "이번만 허용" 선택지 추가** — 작업 디렉토리 밖의 파일을 읽기 전에 묻는 창에 "Yes, but ask again next time"이 생긴다. 이번 한 번만 허용하고, 다음 읽기에서는 다시 묻는다.
- **gateway 지출 한도를 금액으로 표시** — `/usage`와 status line에 "$271.40 / $500.00 spent this month" 형식으로 나온다. status line의 `rate_limits.spend_limit`에 `used_usd`, `limit_usd`, `period` 필드가 추가된다.
- **effort 슬라이더 키 재지정** — `effortSlider:decreaseEffort`, `increaseEffort`, `toggleUltracode` 액션이 추가된다. `keybindings.json`에서 슬라이더의 화살표 키와 Tab 키를 바꿀 수 있다.
- **`/mcp reconnect all`** — 연결에 실패했거나 인증이 필요한 MCP 서버를 한 번에 모두 다시 연결한다.
- **`/rate-limit-options` 노출** — claude.ai 구독자는 `/help`와 명령 메뉴에서 이 명령을 찾을 수 있다.
- **Claude apps gateway 기능 확장**
  - 관리 정책의 `availableModels`가 비어 있거나 시작 모델을 빠뜨리면 시작할 때 경고한다.
  - `telemetry.forward_to`에 `auth: { google: {} }`를 지원한다. 텔레메트리를 Google Cloud OTLP로 바로 보낼 수 있다.
  - identity provider와 인증서 방식(`private_key_jwt`)으로 인증할 수 있다.
- **VSCode 기능 추가**
  - 메시지 타임스탬프를 표시할 수 있다(기본값 꺼짐).
  - Manage plugins 목록에 플러그인 로드 오류가 표시된다. 팝업에서 비활성화·삭제·오류 복사를 할 수 있다.
  - Effort 슬라이더 아래에 Ultracode on/off 스위치가 생긴다.
- **Claude Tag 기능 추가** — "Opus (latest)"처럼 모델 계열을 고르면 그 계열의 최신 모델을 자동으로 따라간다. 지출 예측 차트에 조직 전체 한도의 사용량이 함께 표시된다.

## 🛠️ 개선/수정 (15건)
- **auto mode 기본 시작** — 권한 모드를 설정하지 않은 터미널·VSCode 세션은 이제 auto mode로 시작한다. `permissions.defaultMode`를 설정하면 그 값이 우선한다.
- **Ultracode 독립 토글** — `/effort`에서 Tab 또는 `/effort ultracode [on|off]`로 켜고 끈다. 켜도 effort가 xhigh로 강제되지 않고, 어떤 effort 단계에서도 켜진 상태를 유지한다.
- **응답 스트림 오류 복구** — 스트림이 손상돼 "JSON Parse error"나 "undefined"가 답변에 섞이던 문제를 고쳤다. 이제 재시도하거나 중단된 응답으로 보고한다. thinking 블록 직후의 overloaded 오류도 재시도한다. 연결 끊김 후 재시도는 요청 전체의 재시도 예산을 함께 쓴다.
- **컴팩트 후 "Prompt is too long" 해결** — 컴팩트해도 요청이 길면 최근 대화를 덜 남기고 한 번 더 컴팩트한다. VSCode에서 큰 텍스트 파일을 첨부했을 때의 같은 오류도 고쳤다.
- **MCP 안정성 개선** — 재개한 세션에서 서버가 아직 연결 중이면 최대 10초 기다린다. 관리 설정이 MCP를 제한하면 `claude mcp add`가 거부한다. 비대화 모드의 첫 턴은 필요한 서버를 최대 2초 기다린다.
- **Explore 서브에이전트 모델 상속** — Claude Code가 모르는 모델 ID(예: 프록시 뒤 커스텀 모델)로 세션을 돌려도 Explore가 Opus로 바뀌지 않고 그 모델을 그대로 쓴다.
- **`/loop` 진행 상황 표시** — 자가 페이스 모드에서 매 업데이트와 종료 결과를 reasoning이 아닌 화면 텍스트로 쓴다.
- **보안 강화**
  - 관리 설정 `allowManagedPermissionRulesOnly` 아래에서 비공식 출처 플러그인이 `allowed-tools`로 자기 도구를 사전 승인하던 문제를 막았다.
  - `.claude/rules`에 외부 경로를 심볼릭 링크로 걸면 승인 창이 뜬다.
  - `ANTHROPIC_FOUNDRY_RESOURCE` 값을 검증한다.
  - `MEMORY.md`에서 보이지 않는 문자와 Claude Code 마크업을 흉내 낸 태그를 무력화한다.
  - 네트워크 공유 경로의 artifact 게시를 거부한다.
- **hook 디버깅 개선** — stdout을 같이 쓴 hook이 실패해도 stderr가 디버그 로그에 남는다. 실패한 hook은 상태 코드도 기록한다. Elicitation 계열 hook의 `{"decision":"block"}`이 정상 동작한다.
- **사용량 한도 UX 개선** — plan-usage 엔드포인트가 거부하면 요청 간격을 늘린다(backoff). 최상위 Max 플랜 사용자에게는 `/upgrade` 대신 `/usage-credits`를 안내한다. 대기 카운트다운은 한 블록으로 합쳐 보여준다.
- **플러그인 관리 수정** — `/plugin` 설정 화면의 입력 검증을 고쳤다. 설치에 실패한 플러그인이 활성 상태로 남던 문제를 고쳤다. 구버전 git에서 `sparsePaths`가 빈 복제를 만들던 문제와 Windows의 PATH 중복을 고쳤다. 같은 이름의 marketplace를 교체하면 알려준다.
- **터미널 UI·vim 수정** — fullscreen 스크롤·출력 지움, 좁은 터미널의 탭 줄바꿈, `/model`의 "+1 model" 표시를 고쳤다. vim `.` 반복과 이미지 placeholder 위의 커서 위치도 고쳤다.
- **시작 속도·메모리 개선** — 설정 파일이 실제로 쓰는 부분의 settings schema만 만든다.
- **VSCode 수정** — Memory 편집 후 Reload 순서, 다른 프로세스가 연 대화의 중복 열기, 서브에이전트 작업 중 접히는 섹션, `/model` 입력, 비ASCII 파일 링크 등을 고쳤다.
- **Claude Tag·Code Review 개선** — 채널 안내·권한·러너 대기 문구를 개선했다. 제출되지 않은 리뷰가 열려 있어도 Code Review가 포기하지 않고 게시를 재시도한다.

## 🔑 이번 버전의 핵심 키워드
**"auto mode 기본화와 복원력"** — 권한 모드 기본값이 auto로 바뀌었다. 스트림·컴팩트·MCP 연결 실패에서 스스로 회복하는 능력을 크게 보강했다.

---

# 📜 원문 (한글 번역본)

> 원문 ChangeLog를 원래 순서 그대로 한 줄도 빠짐없이 번역한 문서입니다.

- Claude Sonnet 5.5(`claude-sonnet-5-5`)를 추가했다. 이제 Anthropic API의 기본 Sonnet 모델이다. 1M 컨텍스트, Mtok당 $2/$10, 캐시 읽기 Mtok당 $0.20.
- auto mode가 작업 디렉토리 밖의 파일을 읽기 전에 묻는 창에 "Yes, but ask again next time" 답을 추가했다. 그 한 번의 읽기만 허용하고, 이후 읽기에서는 다시 묻는다.
- gateway가 이 버전 이상으로 실행 중이면 `/usage`와 status line에서 Claude apps gateway 지출 한도를 금액으로 보여준다(예: "$271.40 / $500.00 spent this month"). status line의 `rate_limits.spend_limit`에도 `used_usd`, `limit_usd`, `period`가 추가된다.
- `effortSlider:decreaseEffort`, `increaseEffort`, `toggleUltracode` keybinding 액션을 추가했다. `/effort` 슬라이더의 화살표 키와 Tab 키를 `keybindings.json`에서 다시 지정할 수 있다.
- claude.ai 구독자용으로 `/rate-limit-options`를 `/help`와 명령 메뉴에 추가했다. 이 명령을 언급하는 사용량 한도 안내가 실제로 찾을 수 있는 명령을 가리키게 된다.
- 대화형 터미널에 `/mcp reconnect all`을 추가했다. 연결에 실패했거나 인증이 필요한 MCP 서버를 한 번에 모두 재시도한다.
- 관리 정책의 `availableModels`가 비어 있을 때, 또는 `model`이나 `enforceAvailableModels`를 설정하지 않은 채 Claude Code의 시작 모델을 빠뜨렸을 때 Claude apps gateway가 시작 경고를 띄우게 했다.
- Claude apps gateway의 `telemetry.forward_to` 대상에 `auth: { google: {} }`를 추가했다. gateway의 Google Cloud 자격 증명으로 텔레메트리를 Google Cloud OTLP 엔드포인트에 바로 보낼 수 있다.
- Claude apps gateway와 identity provider 사이에 인증서 클라이언트 인증(`private_key_jwt`)을 추가했다. client secret 대신 인증서 자격 증명을 발급하는 identity provider용이다.
- 손상된 응답 스트림이 "JSON Parse error"나 "undefined is not an object" 같은 원시 오류를 보여주거나 답변에 "undefined"를 쓰던 문제를 고쳤다. 이제 재시도하거나 중단된 응답으로 보고한다.
- thinking 블록 직후에 도착한 overloaded 또는 서버 오류가 재시도되지 않고 턴을 오류로 끝내던 문제를 고쳤다.
- 컴팩트 후에도 "Prompt is too long" 오류가 계속되던 문제를 고쳤다. 컴팩트한 요청이 여전히 길면 최근 대화를 덜 남기고 한 번 더 컴팩트한다.
- 모델을 쓸 수 없고 남은 fallback 모델도 없는 세션이 모델 사용 불가 안내와 Learn more 링크 대신 "is currently unavailable" 문구만(클라우드 세션에서는 "Something went wrong") 보여주던 문제를 고쳤다.
- 사용자 메시지에 `source`가 잘못된 이미지가 있으면 Agent SDK 세션이 충돌하던 문제, 잘못된 document 블록 이후 모든 턴이 실패하던 문제를 고쳤다. 잘못된 이미지는 설명 메모로 대체된다.
- 재개한 세션에서 서버가 아직 연결 중일 때 MCP 도구 호출이 "No such tool available"로 실패하던 문제를 고쳤다. 이제 서버를 최대 10초 기다린다.
- plan-usage 엔드포인트가 rate limit을 걸거나 로그인을 거부한 뒤에도 반복 호출하던 문제를 고쳤다. `/usage`, `/extra-usage`, IDE 사용량 화면이 재요청 대신 backoff한다.
- 관리 설정이 MCP 서버를 플러그인으로 제한할 때 `claude mcp add`가 성공을 보고하던 문제를 고쳤다. 이제 로드되지 않을 서버를 저장하지 않고 거부하며, 할 일을 알려준다.
- `/plugin` 설정 화면을 고쳤다. boolean 옵션은 자유 입력 대신 true/false 선택이 되고, number 옵션은 잘못된 입력을 거부한다. ←/→는 탭 전환 대신 옵션 필드 값을 바꾼다.
- `ANTHROPIC_FOUNDRY_RESOURCE`가 검증 없이 Foundry 엔드포인트 호스트에 삽입되던 문제를 고쳤다. 단순 리소스 이름이 아닌 값은 거부한다.
- Claude apps gateway 뒤의 Claude Desktop에서 1M 컨텍스트 선택지가 없던 문제를 고쳤다. gateway가 1M 지원 모델을 Desktop용으로 자동 표시한다.
- shell mode에서 ↓가 숨겨진 background-tasks pill을 선택해 Backspace와 Ctrl+U로 프롬프트를 편집할 수 없던 문제를 고쳤다.
- Windows에서 플러그인이 많을 때 Bash 도구가 실패하던 문제를 고쳤다. 존재하지 않는 플러그인 `bin/` 디렉토리는 PATH에 넣지 않고, 상속된 항목도 두 번 넣지 않는다.
- 구버전 git(2.39 이전)에서 `sparsePaths` 플러그인 marketplace가 빈 상태로 복제돼 정상 로컬 사본을 대체하고, 이후 모든 갱신이 "marketplace.json file is no longer present"로 실패하던 문제를 고쳤다.
- transcript 모드에서 `[`로 대화를 scrollback에 쓸 때 fullscreen 렌더링이 세션 위의 터미널 출력을 지우던 문제를 고쳤다(macOS·Linux).
- 위로 스크롤한 상태에서 답변 스트리밍이 끝나면 fullscreen 스크롤 위치가 이전 메시지나 맨 아래로 튀던 문제를 고쳤다.
- 좁은 터미널에서 `/config`, `/plugin` 같은 대화창의 탭 바가 제목과 탭 이름을 단어 중간에서 끊던 문제를 고쳤다. 맞지 않는 탭은 통째로 다음 줄로 넘어간다.
- `/model` 선택기에서 마지막 모델까지 스크롤하면 목록 아래에 "+1 model"이 표시되던 문제를 고쳤다. 이제 보이는 줄 아래에 있는 모델 수만 센다.
- `/keybindings`가 아무 동작도 하지 않는 footer 액션의 Backspace·Delete 바인딩을 생성된 `keybindings.json`에 쓰던 문제를 고쳤다.
- 다시 지정한 에이전트 패널 닫기 키(`footer:close`)가 보고 있는 에이전트 줄에서 자기 동작 대신 "x"를 입력하던 문제를 고쳤다.
- vim mode의 `.`이 매우 빠르게 입력된 텍스트(예: ssh·tmux)나 bracketed paste 없이 붙여넣은 텍스트를 반복하지 못하던 문제를 고쳤다. 입력 없이 변경을 반복한 뒤(예: `cw` 후 Esc) INSERT 모드에 남던 문제도 고쳤다.
- vim mode에서 마지막 줄 `dd`나 프롬프트 끝의 `yy` 후 커서가 이미지 placeholder의 여는 괄호에 남아 `r`이나 `x`가 이미지를 깨거나 지우던 문제를 고쳤다.
- 터미널이 포커스를 되찾는 순간 누른 키가 짧은 안전 지연이 다시 시작되기 전에 Remote Control 활성화 창에 응답해 버리던 문제를 고쳤다.
- 홈 디렉토리에서 Claude Code를 시작한 경우 렌더러 전환이나 업데이트 후 workspace trust 창이 다시 뜨던 문제를 고쳤다.
- 프로젝트 밖에서 `.claude/rules`로 심볼릭 링크한 규칙이 external-imports 승인 창 없이 건너뛰어지던 문제를 고쳤다. 프로젝트 밖에서 심볼릭 링크한 `.claude` 디렉토리도 같은 승인을 요청한다.
- 관리 설정 `allowManagedPermissionRulesOnly` 아래에서 marketplace·claude.ai·npm 플러그인이 `allowed-tools`로 자기 도구를 사전 승인하던 문제를 고쳤다. 공식 Anthropic 출처이거나 관리 설정이 보증한 출처의 플러그인만 사전 승인을 유지한다.
- 의존성의 버전 범위를 맞출 수 없어 첫 `claude plugin install`이 실패했을 때 플러그인이 활성·기록 상태로 남던 문제를 고쳤다.
- 실패한 hook이 stdout에도 출력했을 때 디버그 로그가 stderr를 빠뜨리던 문제, 출력 없이 실패한 hook을 아무것도 기록하지 않던 문제를 고쳤다. 실패한 hook은 상태 코드도 기록한다.
- Elicitation·ElicitationResult hook이 반환한 `{"decision":"block"}`이 무시되던 문제를 고쳤다. 이제 exit code 2처럼 MCP elicitation을 거절한다.
- `SendMessage` 도구 없이 시작된 세션(예: Claude Desktop)에 여전히 그 도구로 다른 세션에 메시지를 보내라는 안내가 전달되던 문제를 고쳤다.
- Claude 앱에서 Remote Control로 보낸 사진이 대기 메시지를 터미널 프롬프트로 꺼내 편집할 때 사라지던 문제, 캡션 없는 사진에서 커서가 한 글자 이동하던 문제를 고쳤다.
- 자동 사용량 한도 대기 중에 메시지를 입력하면, 그 턴이 다시 한도에 걸렸을 때 대기가 "Continue automatically at usage limit" 설정의 통제를 벗어나던 문제를 고쳤다.
- 이미 최상위 Max 플랜인 사용자에게 사용량 한도 경고가 `/upgrade`를 제안하던 문제를 고쳤다. 경고와 `/upgrade` 자체가 가능하면 `/usage-credits`를 안내한다.
- 세션이 Claude Code가 모르는 모델 ID(예: 프록시 뒤 커스텀 모델)로 실행될 때 Claude API에서 Explore 서브에이전트가 Opus로 바뀌던 문제를 고쳤다. Explore는 이제 그 모델을 상속한다.
- 자가 페이스 모드의 `/loop` 상태 업데이트가 Claude가 reasoning에만 써서 자주 표시되지 않던 문제를 고쳤다. Claude가 각 업데이트와 루프 종료 결과를 화면 텍스트로 쓴다.
- macOS·Linux에서 Claude 데스크톱 앱이 만든 git worktree에서 시작한 `/ultrareview`가 작업 트리 업로드에 실패하던 문제를 고쳤다.
- Linux에서 작업 디렉토리가 쓰기 금지이고 그 안에 읽기 금지 디렉토리가 있을 때 샌드박스 Bash 명령이 시작되지 않던 문제를 고쳤다.
- artifact 데이터베이스 쓰기 결과가 viewer의 개인 `data/users/` 하위 트리 쓰기를 모든 viewer가 본다고 Claude에게 알리던 문제를 고쳤다. `as_level`에 "view" 단계를 추가했다.
- identity provider가 그룹을 많이 나열하는 로그인의 모든 요청에 Claude apps gateway가 `431 Request Header Fields Too Large`로 응답하던 문제를 고쳤다. 요청 헤더를 최대 256 KiB까지 받는다.
- 사용량 한도 대기를 개선했다. 한도 상태와 usage-credits 선택지가 포함된 카운트다운이 프롬프트 아래 한 블록으로 표시되고, 한도 메시지는 카운트다운을 반복하지 않는다.
- Claude in Chrome 도구를 접두사 없이 호출했을 때의 "No such tool available" 오류를 개선했다. 호출해야 할 도구 이름을 알려준다.
- Monitor 이벤트 행이 설명을 반복하는 대신 각 이벤트가 출력한 내용을 보여주게 개선했다. 변하지 않은 "Waiting for N … to finish" 줄을 이벤트마다 반복하지 않는다.
- 비동기 스크립트 hook이 던진 오류에 대한 Workflow 도구 샌드박스 보호를 강화했다.
- 설정 파일이 실제로 쓰는 부분만 settings schema로 만들어 시작 시간과 메모리 사용을 개선했다.
- `/claude-api`를 개선했다. `hillclimb`는 eval로 측정할 수 없을 만큼 작은 프롬프트 문구 수정에 라운드를 쓰지 않는다. `report.html` 옆에 요청한 추가 페이지는 네트워크에서 아무것도 불러오지 않는 단일 로컬 파일로 만든다.
- `/tasks`, `/copy`, `/hooks` 같은 목록을 개선했다. 이름 뒤의 세부 정보가 맞으면 한 열로 정렬되고, 아니면 오른쪽 끝에 붙는다.
- `claude plugin marketplace add`가 같은 이름으로 다른 출처에서 추가된 marketplace를 교체할 때 그 사실과 되돌리는 방법을 알려주게 개선했다.
- 관리 설정이 로그인을 요구하는데(`forceLoginMethod` 또는 `forceLoginOrgUUID`) API 키·토큰·`apiKeyHelper`가 설정된 경우의 시작 거부 안내를 개선했다. 사용 중인 자격 증명, 설정 위치, 제거 방법을 알려준다.
- auto-memory 로딩을 개선했다. `MEMORY.md`와 불러온 메모리 노트에서 보이지 않는 문자와 Claude Code 자체 마크업을 흉내 낸 태그를 Claude에 전달되기 전에 무력화한다.
- `claude remote-control`을 개선했다. 아직 신뢰하지 않은 폴더에서 종료하지 않고 터미널에서 workspace trust를 묻는다.
- artifact 페이지를 개선했다. Claude가 디자인 계획을 답변이 아닌 페이지에 쓰고, 사용자가 이미 붙인 이름을 페이지 제목으로 쓴다.
- Artifact 도구를 개선했다. claude.ai 채팅·프로젝트 링크, 채팅의 artifact, artifact id만 받았을 때 멈추지 않고 올바른 링크나 내용을 요청한다.
- 권한 모드가 설정되지 않은 대화형 터미널과 VSCode 세션이 모든 플랜·제공자에서 auto mode로 시작하게 변경했다. `permissions.defaultMode`가 여전히 우선한다.
- Ultracode를 `/effort` 안의 독립 토글로 변경했다(Tab 또는 `/effort ultracode [on|off]`). 더 이상 xhigh effort를 강제하지 않고 어떤 effort 단계에서도 켜진 상태를 유지한다.
- 응답 도중 연결이 끊긴 뒤의 재시도가 요청의 나머지 재시도와 하나의 예산을 공유하게 변경했다. 실패하는 요청은 더 빨리 포기한다.
- Sonnet 모델의 safeguards가 메시지를 표시했을 때의 안내를 변경했다. 이유를 설명하고 편집·재시도를 제안한다.
- `ANTHROPIC_DEFAULT_OPUS_MODEL`이나 `modelOverrides`로 Opus 모델을 고정한 세션의 안전 관련 모델 전환을 변경했다. Anthropic API에서는 고정 모델이 아닌 API가 플래그 종류별로 전환할 모델을 고른다.
- 비대화 모드의 첫 턴이 `CLAUDE_CODE_MCP_STARTUP_WAIT_MS`가 `0`이어도 `--allowedTools`나 `mcp_tool` hook이 지정한 연결 중 MCP 서버를 최대 2초 기다리게 변경했다.
- `/recap`이 채팅 스레드(본인 것 포함), routine, webhook에서 중계되어 오면 짧은 안내와 함께 거절하게 변경했다. 터미널·Claude 앱·Remote Control·`-p`·SDK 호스트에서 입력하면 이전처럼 실행된다.
- `/artifacts`의 필터 탭을 제목 옆에 한 단어 라벨(All, Mine, Shared)로 표시하게 변경했다. `/config`, `/plugin`과 같은 탭 바를 쓴다.
- artifact 게시가 네트워크 공유 파일(`\\host\share` 경로나 `/net` automount)을 거부하게 변경했다. `--add-dir`로 추가한 매핑된 네트워크 드라이브는 예외다.
- [VSCode] 각 프롬프트와 응답 위에 선택적으로 시간을 표시하고, 날짜가 바뀌는 곳에 날짜 줄을 추가했다(Claude Code: Show Message Timestamps 설정, 기본값 꺼짐).
- [VSCode] Manage plugins 행에 플러그인 로드 오류와 메모를 추가했다. 팝업에서 비활성화·삭제·오류 복사를 할 수 있다.
- [VSCode] Effort 슬라이더 아래에 Ultracode on/off 스위치를 추가해 슬라이더의 Ultracode 단계를 대체했다. 모델 pill은 어떤 effort 단계에서도 "· Ultracode"를 표시한다.
- [VSCode] Memory 대화창의 Reload Claude가 편집한 파일이 저장되기 전에 재시작하던 문제를 고쳤다.
- [VSCode] 복원된 탭이 다른 Claude 프로세스가 아직 연 대화를 열던 문제를 고쳤다. 이제 먼저 묻는다.
- [VSCode] 서브에이전트가 작업 중이거나 섹션의 첫 단계가 화면에서 잘릴 때, 펼쳐 둔 Focus view 섹션이 저절로 닫히던 문제를 고쳤다.
- [VSCode] `/model` 입력 후 Enter를 누르면 모델 선택기 대신 사용법 텍스트가 채팅에 출력되던 문제를 고쳤다.
- [VSCode] Vertex·Bedrock·Foundry에서 Send를 누른 뒤 `/feedback`이 거부되던 문제를 고쳤다. 터미널처럼 보고서를 이 컴퓨터에 저장한다.
- [VSCode] 창을 다시 로드한 뒤 로그인이 Python 확장을 최대 1분 기다리던 문제를 고쳤다.
- [VSCode] Restart Extensions 후 응답하지 않던 Claude Code 탭을 고쳤다. 이제 해당 대화로 다시 열린다.
- [VSCode] 발신자 기록이 없는 다른 에이전트의 메시지가 채팅에 원시 XML로 표시되던 문제를 고쳤다.
- [VSCode] 다른 에이전트·세션·채널에서 온 메시지가 다시 로드한 뒤 사라지던 문제를 고쳤다.
- [VSCode] 사용자가 직접 만든 `/mcp`, `/config`, `/settings` 명령이 확장의 대화창에 가려지던 문제를 고쳤다.
- [VSCode] 실행 중인 턴이 없을 때 Escape가 모든 백그라운드 에이전트를 멈추던 문제를 고쳤다.
- [VSCode] 플러그인 설치 링크가 같은 이름을 쓰는 기존 marketplace를 교체하던 문제를 고쳤다.
- [VSCode] 메시지에 큰 텍스트 파일이 첨부되면 컴팩트 후 "Prompt is too long" 오류가 나던 문제를 고쳤다.
- [VSCode] 경로에 비ASCII 문자·공백·괄호가 있는 파일의 채팅 링크가 열리지 않던 문제를 고쳤다.
- [VSCode] `claudeCode.environmentVariables` 설정의 `CLAUDE_CONFIG_DIR`이 절대 경로일 때만 적용되게 변경했다. 채팅을 이어받는 터미널에도 전달한다.
- [Cloud sessions] 오프라인 상태에서 routine의 Edit·Duplicate 버튼이 아직 로딩 중이라고 하던 문제를 고쳤다. 이제 오프라인이라고 알려준다.
- [Claude Tag] 스레드·채널 기본값·DM에 "Opus (latest)" 같은 모델 계열 선택지를 추가했다. 선택이 그 계열의 최신 모델을 따라간다.
- [Claude Tag] analytics 지출 예측 차트에 조직 전체 한도에 포함되는 지출과 한도 사용량을 추가했다.
- [Claude Tag] GitHub Enterprise 호스트 이름에 밑줄이 있으면 이전 Claude in Slack 앱의 진행 카드와 링크 미리보기에서 저장소와 Create PR 버튼이 빠지던 문제를 고쳤다.
- [Claude Tag] 환경이 Claude 시작을 거부하는 채널에서 Claude가 침묵하던 문제를 고쳤다. 이제 관리자에게 문의하라는 안내를 한 번 올리고, @멘션되면 재시도한다.
- [Claude Tag] Claude 계정을 연결하지 않은 사람이 @멘션할 때마다 Claude가 개인 로그인 안내를 올리게 변경했다. 이전에는 첫 번째 이후 조용해졌다.
- [Claude Tag] 관리자 설정의 "Notify members now"를 개선했다. 한 번 누르면 Enterprise Grid에서 조직이 소유한 모든 workspace에 전달되고, 큰 workspace에서 더 많은 멤버에게 닿는다.
- [Claude Tag] on-demand runner를 쓰는 self-hosted 환경의 대기 안내를 개선했다. runner가 시작 중인지, 시작을 재시도할지, 시작되지 않을지를 알려준다.
- [Claude Tag] 채널의 Slack workspace가 조직에 연결됐는지 확인할 수 없어 채널 관리자 추가에 실패할 때의 오류 안내를 개선했다.
- [Claude Tag] 관리자 설정의 채널 접근 목록을 개선했다. auto-join 패턴이 붙이는 connector·저장소·플러그인과 각각의 출처를 보여준다.
- [Claude Tag] 채널 관리자로 저장소를 추가하는 흐름을 개선했다. GitHub 로그인으로 저장소 관리자임을 확인할 수 없으면 GitHub 로그인을 요청한다.
- [Code Review] GitHub App 아래에 제출되지 않은 리뷰가 PR에 열려 있으면 Code Review가 완료된 리뷰를 게시하지 않고 포기하던 문제를 고쳤다. 이제 먼저 게시를 재시도한다.

---

## 🎯 챌린지

이번 버전에서 내 환경에 적용해볼 만한 항목입니다.

### 1. 권한 기본 모드 명시 고정
- **파일**: `~/.claude/settings.json`
- **근거**: 이번 버전부터 권한 모드를 정하지 않은 세션은 auto mode로 시작한다. CLAUDE.md는 확인 게이트와 복명복창을 요구한다. 그래서 의도한 모드를 `permissions.defaultMode`에 적어 두어야 업데이트 때 동작이 조용히 바뀌지 않는다. 현재 요약된 설정에서는 이 키가 보이지 않는다.
- **난이도**: ★☆☆ (약 5분)

### 2. deploy-guard hook의 차단 사유 로그 점검
- **파일**: `~/.claude/hooks/deploy-guard.sh`
- **근거**: 실패한 hook의 stderr와 상태 코드가 이제 디버그 로그에 남는다. `feat/*` push를 막을 때 차단 사유를 stderr로 쓰고 exit 2로 끝나는지 확인한다. 그런 다음 `claude --debug`로 로그에 사유가 찍히는지 본다. 차단 원인을 추적하기 쉬워진다.
- **난이도**: ★★☆ (약 15분)

### 3. Ultracode 토글 단축키 지정
- **파일**: `~/.claude/keybindings.json`
- **근거**: Ultracode가 effort와 독립된 토글이 되었고, `effortSlider:toggleUltracode` 액션을 다시 지정할 수 있다. `effortLevel`을 `xhigh`로 쓰면서 Workflow를 자주 쓰는 환경이므로, 익숙한 키에 붙이면 켜고 끄는 조작이 빨라진다.
- **난이도**: ★☆☆ (약 10분)
