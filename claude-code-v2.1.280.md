# Claude Code v2.1.280

> 작성일: 2026-09-27

---

# 📋 요약본

## 🎉 신기능 (6건)
- **Claude Opus 5.5 추가** — `claude-opus-5-5`가 새 기본 Opus 모델이 된다. 1M 컨텍스트를 지원한다. 가격은 입력 $4 / 출력 $20 / 캐시 읽기 $0.20 (Mtok당)이다.
- **풀스크린 마우스 지원 확대** — `/skills` 목록을 휠로 스크롤할 수 있다. `/plugin`에서 스킬 상태 옵션을 클릭할 수 있다.
- **`CLAUDE_CODE_MAX_MCP_DESCRIPTION_LENGTH` 환경변수** — MCP 도구 설명과 서버 instructions에 걸린 2,048자 상한을 세션 전체에서 바꿀 수 있다.
- **OpenTelemetry hook 지표 추가** — `hook_execution_complete` 이벤트에 hook 출력 크기와, 너무 커서 파일로 저장된 출력 수가 담긴다.
- **VSCode 다이얼로그·명령 대거 추가** — `/status`, `/sandbox`, `/chrome`, `/export`, `/skills`, `/plan` 명령과 각 다이얼로그가 생겼다.
  - Slash commands 다이얼로그에 스킬 출처, 토큰 추정치, on/off 상태가 보이고 클릭으로 켜고 끈다.
- **Claude Tag Slack 연동 강화** — Slack 기본 Working 표시, Stop 버튼, 스레드 제목을 지원한다. 게스트가 들어오거나 나가서 응답 방식이 바뀌면 채널에 알린다.

## 🛠️ 개선/수정 (16건)
- **심링크 쓰기 권한 판정 수정** — 파일이 실제로 저장되는 위치로 판정한다. 작업 트리 밖에 쓰이는 경우 `acceptEdits`, allow 규칙, auto mode가 자동 승인하지 않는다.
- **auto mode 반복 재시도 수정** — 안전 검사가 검토를 거부하면 한 번만 거부한다. 응답이 없으면 간격을 두고 재시도하고, 10회 연속이면 턴을 멈춘다.
- **Write 파라미터 관용 처리** — 모델이 `path`, `file_text` 같은 잘못된 이름을 보내도 검증에서 실패하지 않는다.
- **다이얼로그 Ctrl+C/Ctrl+D 동작 수정** — 두 번 눌러도 Claude Code가 꺼지지 않고 다이얼로그만 닫힌다.
- **y/n 단축키 동작 변경** — 실수로 누른 `n`·`y`가 다이얼로그를 닫거나 확정하지 않는다. Enter·Esc만 쓴다. 예전 방식은 `keybindings.json`에서 되살린다.
- **세션이 매 턴 실패하던 버그 수정** — "role 'system' must precede", advisor 400 에러, 깨진 MCP 알림 등을 고쳤다.
- **프롬프트 캐시 미스 수정** — 호스트 앱에서 모델을 바꾸거나 fork subagent를 재개할 때 캐시가 깨지던 문제를 고쳤다.
- **백그라운드 subagent 안정화** — 메시지 유실, compact 후 보고서 유실, LSP 사용 불가, Ctrl+C를 3~4번 눌러야 종료되던 문제를 고쳤다.
- **`~/.claude/skills/` 스킬 휴지통 이동 버그 수정** — 폴더의 `manifest.json`에 이름이 있다는 이유로 스킬이 `.trash`로 옮겨지던 문제를 고쳤다.
- **플러그인·마켓플레이스 수정** — 업데이트 후 커밋 기록, git credential helper 무시, 버전 "unknown" 문제를 고쳤다.
- **UI 다듬기** — `/config`, `/model`, `/skills`, `/mcp` 키 동작과 아이콘을 통일했다. 긴 목록에 스크롤바가 보인다.
- **`/permissions` 개선** — 작업 후 포커스가 규칙 목록으로 돌아온다. 삭제 확인의 기본값이 No다.
- **effort 레벨 동작 변경** — `/effort`가 모델별로 바뀌기 전에 저장한 값은 Opus 5.5 같은 새 모델에 적용하지 않는다.
- **Pro·Team Standard 기본 모델 Opus로 변경** — 기본 모델이 Sonnet에서 Opus로 바뀐다.
- **보안 강화** — 예약된 이름을 흉내 낸 마켓플레이스를 거부한다. `PermissionRequest`에서 agent-type hook을 막는다. `/ultrareview` 업로드에서 민감 파일의 복사본도 제외한다.
- **`ctrl+l` / `cmd+k` 되돌림** — 풀스크린에서 transcript를 지우지 않고 다시 화면을 다시 그리는 동작으로 돌아간다.

## 🔑 이번 버전의 핵심 키워드
**"Opus 5.5 기본화와 대규모 안정화"** — 새 기본 모델 Opus 5.5를 넣고, auto mode·백그라운드 agent·다이얼로그 조작에서 반복되던 실패와 오작동을 한꺼번에 정리한 버전이다.

---

# 📜 원문 (한글 번역본)

> 원문 ChangeLog를 원래 순서 그대로 한 줄도 빠짐없이 번역한 문서입니다.

- Claude Opus 5.5(`claude-opus-5-5`) 추가. 이제 기본 Opus 모델이다. 1M 컨텍스트, Mtok당 $4/$20, 캐시 읽기 $0.20/Mtok
- 풀스크린 모드에서 더 많은 목록에 마우스 지원 추가: 휠로 `/skills` 목록을 스크롤하고, `/plugin`에서 스킬 상태 옵션을 클릭할 수 있다
- 세션의 모든 MCP 서버에 대해 MCP 도구 설명과 서버 instructions의 2,048자 상한을 바꾸는 `CLAUDE_CODE_MAX_MCP_DESCRIPTION_LENGTH` 추가
- `hook_execution_complete` OpenTelemetry 이벤트에 hook 출력 크기와 파일로 저장된 초과 크기 출력 수 추가
- 심링크 경로를 통한 쓰기가 트리 안 경로 표기로 판정되던 문제 수정: 프롬프트가 실제 쓰기 위치를 표시하며, `acceptEdits`, allow 규칙, auto mode가 트리 밖에 쓰이는 경우를 더 이상 승인하지 않는다
- 안전 검사가 검토를 거부했을 때 auto mode가 같은 동작을 계속 재시도하던 문제 수정. 이제 한 번 거부하고 재시도해도 소용없다고 알린다
- 안전 검사가 응답하지 않았을 때 auto mode가 쉬지 않고 계속 거부하던 문제 수정. 이제 재시도 간격을 늘리고, 10회 연속이면 메시지와 함께 턴을 멈춘다
- 모델이 `file_path`와 `content` 대신 `path`, `file_text`, `file_content` 또는 불필요한 `description`을 보낼 때 Write 호출이 검증에서 실패하던 문제 수정
- 대부분의 다이얼로그(`/model`, `/effort`, `/config`, `/status`, `/usage`, `/plugin`, `/sandbox`, `/permissions`, `/artifacts`, `/mobile`, `/login`, `/upgrade`, `/usage-credits`, `/install-github-app`, `/setup-bedrock`, `/setup-vertex`)에서 Ctrl+C 또는 Ctrl+D를 두 번 누르면 다이얼로그가 닫히지 않고 Claude Code가 종료되던 문제 수정
- 터미널 창을 앞으로 가져오기만 한 클릭이 포인터 아래 항목까지 실행하던 문제 수정 — 검색 피커, 탭 바, agent/workflow 행, 슬래시 명령 링크, 제안 드롭다운에서
- 잘못 누른 `n`이 다이얼로그를 닫고 잘못 누른 `y`가 확정하던 문제 수정. Enter와 Esc로 수락·취소한다(복원하려면 `keybindings.json`에서 `y`/`n`을 `confirm:yes`/`confirm:no`에 바인딩)
- 다이얼로그 텍스트 필드에서 입력한 문자·숫자·Space가 해당 키의 키바인딩에 먹히던 문제 수정
- Windows 터미널에서 Enter 시 보이지 않는 문자가 제거된 뒤 프롬프트 줄이 뒤섞인 채 남던 문제 수정. 이제 화면을 다시 그려 실제로 전송될 텍스트를 확인할 수 있다
- 보이지 않는 문자 정리 과정에서, 페르시아어·아랍어가 라틴어 단어나 숫자에 접미사를 붙일 때 쓰는 zero-width non-joiner(예: "PDF"의 복수형)를 지우던 문제 수정
- 음성 받아쓰기가 Ctrl+C에 멈추지 않던 문제(프롬프트는 지워지지만 마이크는 계속 녹음), 전사 처리 중 Esc로 취소되지 않던 문제, transcript 화면과 vim NORMAL 모드에서 Space를 누르고 있으면 받아쓰기가 시작되던 문제 수정
- Claude가 작업 중일 때 호스트 앱(Claude Desktop, VS Code, SDK)에서 모델을 바꾸면 다음 프롬프트에서 프롬프트 캐시 미스가 나던 문제 수정
- 재개된 fork subagent가 처음 쓴 도구 목록을 다시 보내지 않고 새로 구성해 해당 agent의 프롬프트 캐싱이 깨지던 문제 수정
- verbose 모드가 아닐 때 subagent 반환 메시지를 펼치면 내부 출처 머리말이 보이던 문제 수정
- 브랜치나 태그를 추적하는 GitHub 저장소 또는 git URL에서 플러그인을 업데이트한 뒤에도 `installed_plugins.json`이 설치 당시 커밋을 유지하던 문제 수정
- `~/.claude/skills/` 폴더의 `manifest.json`에 이름이 나열된 스킬이 `~/.claude/skills/.trash/`로 옮겨지던 문제 수정
- 세션 피드백 설문에서 light·ANSI 테마일 때 hover 강조가 안 보이던 문제 수정
- `/workflows`가 실행이 하나뿐일 때 그 실행을 열기 전에 한 줄짜리 목록을 잠깐 보여주던 문제 수정
- 풀스크린 모드에서 숨겨진 옵션이 있는 선택 목록(`/model`, `/permissions` 등)이 마우스 휠로 스크롤되지 않던 문제 수정
- `/plugin`과 `/skills`에서 사용자가 끈 스킬이 로드 실패한 플러그인과 같은 빨간 ✘로 보이던 문제 수정. 꺼진 상태는 흐린 ◯로 보인다
- 다중 선택 옵션 설명이 라벨이 아니라 옵션 번호 아래로 들여쓰기되던 문제 수정
- 풀스크린 모드에서 `/plugin`, `/skills`, `/mcp` 검색 상자의 오른쪽 테두리가 사라지던 문제 수정
- 같은 서버를 `/mcp` 서버 목록은 △로, 상세 화면은 ⚠로 보여주던 문제 수정. 목록, 상세 화면, `/plugin` 모두 ⚠로 통일
- `/config` 설정 목록과 `/model`, `/memory`, 권한 프롬프트 같은 선택 목록에서 Home과 End가 동작하지 않던 문제 수정
- `/skills` 메뉴에서 PgUp/PgDn이 첫 번째나 마지막 스킬에서 멈추지 않고 반대쪽으로 넘어가던 문제 수정
- `/config` 목록에서 Tab이 선택한 설정값을 말없이 바꾸던 문제 수정. 이제 아무 동작도 하지 않는다
- 매 턴 "role 'system' must precede an 'assistant' message" API 에러로 대화가 실패하던 문제 수정
- 지원하지 않는 프록시나 게이트웨이 뒤에서 advisor를 켠 대화가 매 턴 API Error 400 "Input tag 'advisor_20260301'"로 실패하던 문제 수정. 이제 해당 태그 없이 재요청한다
- 저장된 기록에 로드하지 못한 MCP 도구에 관한 깨진 알림이 있으면 세션이 매 턴과 `/compact`에서 실패하던 문제 수정
- 저장된 transcript에 깨진 system 메시지나 파일 목록 없는 memory-saved 알림이 있는 세션을 재개할 때 크래시 나던 문제 수정
- 오래 실행한 풀스크린 세션이 "Claude Code exited after an unrecoverable interface error"로 종료되던 원인 하나 수정: 손상된 캐시 메시지 목록을 다시 만든다
- 설정 파일, 또는 편집 후 다시 읽는 파일이 읽는 도중 named pipe로 바뀌면 Claude Code가 멈추던 문제 수정
- `settings.json`으로 옮겨간 환경설정이 `~/.claude.json`에 `null`이나 `"false"` 같은 값으로 남아 있을 때 `/config`가 크래시 나고 일부 on/off 설정을 잘못 읽던 문제 수정
- 끝나지 않은 백그라운드 agent, shell, workflow가 있는 세션을 재개하면 사용자가 입력하기 전에 모델 턴이 스스로 시작되던 문제 수정
- headless·SDK 세션에서 백그라운드 subagent가 턴을 마무리하는 중에 보낸 메시지가 말없이 사라지던 문제 수정
- subagent를 띄운 대화가 보고서를 읽기 전에 compact되면 완료된 subagent의 보고서가 사라지던 문제 수정
- LSP 플러그인이 켜져 있을 때 백그라운드 subagent가 LSP 도구를 쓰지 못하던 문제 수정
- 백그라운드 shell 작업이 문제없는 0이 아닌 종료 코드(예: 일치 항목이 없는 grep)를 실패로 보고하던 문제 수정
- 세션에 넘긴 환경변수에 NUL 문자가 있으면 백그라운드 세션(`claude --bg`)이 git, hook, 플러그인 등 보조 프로그램을 실행하지 못하던 문제 수정
- 백그라운드 subagent가 실행 중일 때 종료하려면 Ctrl+C를 세네 번 눌러야 하던 문제 수정. 이제 두 번이면 종료된다
- 보낸 프롬프트가 입력창으로 돌아올 때(Esc로 수정, rewind, 시작 hook 실행 중 Esc) IDE 선택 영역이 사라지던 문제 수정
- Ctrl+S로 보관한 `!` shell 모드 프롬프트를 복원하면 일반 프롬프트로 돌아오던 문제와, 보관 직후 `/`가 파일 경로를 나열하던 문제 수정
- 임시 디렉터리가 가득 찼거나 쓰기 불가이거나 다른 사용자 소유일 때 `claude agents`가 에러 대신 빈 먹통 화면을 보여주던 문제 수정
- `claude mcp remove` 후 같은 이름으로 다시 추가한 MCP 서버가 재연결되지 않고 인증 필요로 표시되던 문제 수정
- 백그라운드 플러그인 마켓플레이스 자동 업데이트가 git credential helper를 무시해 비공개 저장소 마켓플레이스를 매번 다시 clone하거나 전혀 업데이트하지 않던 문제 수정
- 공식 마켓플레이스의 스냅샷 파일이 링크이거나 너무 클 때 `claude plugin update`가 플러그인의 기록된 커밋을 지우고 버전을 "unknown"으로 바꾸던 문제 수정
- 조직 정책을 불러오지 못할 때(예: 웹 프록시 뒤) Artifact 도구가 말없이 사라지던 문제 수정. 이제 Claude가 무엇이 막고 있는지 알려준다
- 해당 기능을 다시 보낼 때 빠뜨리면 artifact 재게시가 저장된 데이터베이스 접근 규칙을 말없이 초기화하거나 viewer profile scope를 빠뜨리던 문제 수정. 이제 거부한다
- `/ultrareview`가 중지된 클라우드 리뷰를 완료나 재시도할 에러로 보고하던 문제, 세션이 삭제되거나 로그인 계정이 바뀌었을 때 타임아웃까지 기다리던 문제 수정
- /compact 또는 /clear 직후 Remote Control·클라우드 세션의 컨텍스트 사용량이 Claude 앱에서 빠지거나 오래된 값으로 보이던 문제 수정
- 커밋되지 않은 변경이 함께 있을 때 Claude 앱의 Remote Control·클라우드 세션 diff 화면이 브랜치의 커밋된 파일을 빠뜨리던 문제 수정
- 긴 과부하를 기다리는 동안 세션 접근 토큰이 교체되면 클라우드·self-hosted runner 세션이 "Authentication failed"로 실패하던 문제 수정
- Cowork 세션의 메모리 쓰기 충돌 시 약 10,800자를 넘는 메모리 파일은 처음과 끝만 Claude에게 보여줘 재시도한 쓰기가 가운데를 날리던 문제 수정
- Self-hosted runner: `--configure-git` 사용 시 lifecycle-hook 커밋 서명이 실패하던 문제 수정
- Windows: 백그라운드 정리가 `~/.claude/session-env`, `image-cache` 등 정리 대상 폴더를 옮기려고 쓴 디렉터리 심링크나 junction을 삭제하던 문제 수정
- Self-hosted runner: `--retire-at` 릴리스 시점에 딱 끝난 턴이 완료 신호를 잃던 문제 수정. 세션을 멈추기 전에 턴 보고를 잠깐 기다린다
- 풀스크린 모드에서 `ctrl+l` / `cmd+k`가 transcript 화면을 지우던 동작(2.1.260에서 추가) 되돌림. 다시 화면을 다시 그린다
- `/permissions` 개선: 규칙을 보거나 추가·삭제한 뒤 포커스가 규칙 목록으로 돌아오고, 규칙 삭제·디렉터리 제거 확인의 기본값이 No가 된다
- `/permissions` 탭 이동 개선: 규칙 목록에서 ←/→와 Tab을 누르면 포커스를 탭 바로 옮기지 않고 탭을 바꾼다
- `/cost`의 캐시 미스 원인에 thinking 모드와 thinking 표시 변경을 명시
- Artifact 도구 개선: Claude가 받은 artifact 링크를 읽지 못하면 계속하기 전에 사용자에게 알린다
- `/install-github-app` 개선: GitHub CLI 확인과 저장소 선택 단계에 "Esc to cancel" 표시
- `/artifacts`와 `/workflows` 목록 개선: 오른쪽 끝 스크롤바가 긴 목록에서 숨겨진 양과 현재 위치를 보여준다
- workflow 진행 트리 개선: 실행 중인 agent와 phase가 ⟳ 대신 흐린 점으로 표시된다
- 풀스크린 `/plugin`의 Add Marketplace 양식 개선: 창 안에 상자를 그리지 않고, 텍스트와 키 안내가 `/plugin`의 나머지 부분과 정렬된다
- 풀스크린 `/workflows` 상세 화면 개선: 창 구분선 아래에 두 번째 가로줄을 그리지 않는다
- 언어를 지정하지 않은 코드 블록 개선: inline code처럼 색을 입혀 명령이 주변 텍스트에서 눈에 띈다
- 도구 실행 중 묻는 `/btw` 개선: 곁가지 질문이 그 호출을 실패로 읽지 않고 진행 중임을 안다
- UserPromptSubmit hook 타임아웃 알림과 debug 로그가 어느 hook 명령이 타임아웃됐는지 명시
- `@` 파일 제안 개선: 파일 이름에 검색어가 들어 있는 파일이 폴더 이름에 걸쳐서만 일치하는 파일보다 위에 온다
- artifact 페이지 개선: 뷰어가 막는 Print 버튼, 확인 다이얼로그, 기기 기능을 없애고, 이메일·전화 정보를 텍스트로 보여주며, 다크 모드가 폼 컨트롤과 스크롤바까지 적용된다
- `/ultrareview` 업로드 개선: `id_rsa copy`나 `kubeconfig (1).yaml` 같은 핵심 파일의 이름 바꾼 복사본도 로컬에 남긴다
- 세션 간 메시징 시작 경고가 `--debug-file`이 사용자가 고른 경로에 debug 로그를 쓴다고 설명
- Pro·Team Standard 플랜의 기본 모델을 Sonnet에서 Opus로 변경. Max, Team Premium, Enterprise와 같아졌다
- `/effort`가 모델별이 되기 전에 저장한 effort 레벨을 Opus 5.5 같은 새로 출시된 모델에 더 이상 적용하지 않도록 변경. 레벨을 고르기 전까지 기본값으로 시작한다
- Opus 4.7, Opus 4.8, Fable 5가 `-p`나 Agent SDK의 `/effort`, 프로젝트·관리형·`--settings`의 `effortLevel`, 모델별 레벨보다 출시 기본 effort를 우선하던 동작을 멈추도록 변경
- `/autocompact` 하단 안내가 다른 순서형 값을 조정하는 키인 ←/→를 명시하도록 변경
- `/fast` 하단 안내가 토글 키로 Space를 명시하도록 변경
- Self-hosted runner: lifecycle hook의 git이 runner 공유 git 파일에 지정된 hook 폴더와 프로그램을 무시하도록 변경. 여기서 local-path와 `git://` 원격은 이제 `GIT_ALLOW_PROTOCOL`이 필요하다
- 예약된 마켓플레이스 이름을 흉내 낸 플러그인 마켓플레이스는 추가 시 거부되고, 이미 추가된 경우 로드를 멈추도록 변경
- `PermissionRequest` hook 변경: agent-type hook은 요청을 허용하거나 거부할 수 없으므로 더 이상 여기서 실행되지 않는다. command 또는 http hook을 쓰라는 에러를 보여준다
- [VSCode] 세션의 버전, 계정, 모델, 서버 정보를 보여주는 Status 다이얼로그 추가(`/status` 입력으로도 열림)
- [VSCode] sandbox 모드, sandbox 밖 대체 실행, 제외 명령을 다루는 Sandbox 다이얼로그 추가. 패널 메뉴나 `/sandbox` 입력으로 연다
- [VSCode] Claude in Chrome 다이얼로그 추가(확장 상태, 설치·재연결·권한 페이지, 기본 활성화 설정). 패널 메뉴나 `/chrome` 입력으로 연다
- [VSCode] 대화를 일반 텍스트로 복사하거나 저장하는 Export conversation 추가(`/export` 입력으로도 실행)
- [VSCode] Slash commands 다이얼로그에 스킬별 출처, 토큰 추정치, on/off 상태를 추가하고 클릭으로 상태를 바꾸게 함. `/skills` 입력으로 연다
- [VSCode] plan 모드로 전환하거나, 첫 계획 프롬프트를 보내거나, 세션의 계획을 보여주는 `/plan` 입력 추가
- [VSCode] 채팅창 붙여넣기 처리 개선: 800자 초과 또는 줄바꿈 2개 초과 붙여넣기를 표시해 Claude가 직접 입력과 구분할 수 있다
- [VSCode] 채팅창 프롬프트 처리 개선: 붙여넣은 텍스트에서 보이지 않는 Unicode 서식·태그 문자를 알림과 함께 제거하고, 그 밖의 입력에서는 전송 전에 제거한다
- [VSCode] "Open in New Tab"이 마지막 에디터 그룹 뒤가 아니라 현재 작업 중인 에디터 그룹 옆에 Claude를 열도록 변경
- [VSCode] effort 칩이 세션이 실제로 쓰는 레벨 대신 오래된 저장값을 보여주던 문제 수정
- [VSCode] Python 확장이 활성화 중에 멈추면 Claude Code가 시작되지 않던 문제 수정. 이제 60초 뒤 Python 환경 없이 시작한다
- [VSCode] plan 승인 카드가 auto mode를 제안하지 않던 문제 수정: auto mode를 쓸 수 있으면 터미널처럼 첫 옵션이 "Yes, and use auto mode"가 된다
- [VSCode] 키보드로 세션을 보관하거나 보관 해제한 뒤 세션 목록의 화살표 키 이동이 멈추던 문제 수정
- [VSCode] 세션을 다시 열면 내 메시지에 붙여넣기 표시 줄이 보이던 문제 수정
- [Claude Code on the web] 관리자 Routines on/off 설정을 Admin settings → Capabilities → Remote sessions 아래로 옮김. Claude Code 관리자 페이지에서 링크한다
- [Claude Code on the web] GitHub Enterprise Server 저장소의 클라우드 세션에서 약 8시간 뒤 `gh`와 GitHub API 호출이 실패하던 문제 수정. 토큰이 자동 갱신된다
- [Claude Code on the web] 예약 실행 직전에 편집한 routine이 기존 세션을 재개할 때 예전 프롬프트와 이름으로 실행되던 문제 수정
- [Claude Code on the web] 클라우드 세션 transcript에서 세션 작업 디렉터리 밖을 가리키는 파일 링크가 로드되지 않는 파일 카드를 열던 문제 수정. 이제 비활성화되고 이유를 알려준다
- [Claude Code on the web] 응답 없이 만료되거나 새 메시지로 대체된 승인 프롬프트가 사용자 거부로 기록돼 auto mode가 도구 호출 재시도를 거부하던 문제 수정
- [Claude Code on the web] Claude 앱에서 보는 클라우드 세션 개선: 사용자용 파일을 앱에서 열 수 있는 위치에 저장한다
- [Claude Code on the web] 관리자가 GitHub를 끈 조직에서 self-hosted 환경 세션을 시작할 때 보이던 빈 저장소 선택기 제거
- [Claude Tag] 채널 내 Claude 스레드에 Slack 기본 Working 표시, Stop 버튼, 스레드 제목 추가. 표시는 Claude가 끝날 때까지 유지되고 Stop은 작업을 중단한다
- [Claude Tag] Restrict 또는 Channel only 게스트 설정에서 게스트 입장이나 마지막 게스트 퇴장으로 Claude의 응답 방식이 바뀌면 Slack 채널에 짧은 알림 추가
- [Claude Tag] Enterprise Grid 가입 전에 Claude와 연결된 Slack 워크스페이스에서 예약 routine이 말없이 실행되지 않던 문제 수정
- [Claude Tag] 파일이 아니라 잠깐의 파일 스캔 장애가 원인일 때 Claude가 Slack 파일을 다시 올려달라고 하던 문제 수정. 스캔을 재시도하고, 스캐너가 다운되면 그 사실을 전달받는다
- [Claude Tag] Slack 답변에서 +, -, *로 시작하는 글머리 항목이 빈 항목과 엉뚱한 하위 항목으로 렌더링되던 문제 수정. 문자를 유지한 한 개 항목으로 보인다
- [Claude Tag] 클라우드 환경 setup 스크립트 실패 시 Slack 알림이 가끔 일반적인 "mention me to retry"로 나오던 문제 수정. setup 스크립트를 지목하고 먼저 고치라고 안내한다
- [Claude Tag] Claude Tag 관리자 설정의 GitHub 배너가 연결되지 않은 이유(로그인 안 됨, 앱 미연결 또는 미설치, 로그인 만료, SSO 미승인)를 알려주도록 개선
- [Code Review] REVIEW.md 지침이 크기 제한 초과로 잘리거나 빠졌을 때 Code Review check run이 파일과 제한값을 명시해 알리도록 개선

---

## 🎯 챌린지

이번 버전에서 내 환경에 적용해볼 만한 항목입니다.

### 1. 휴지통으로 옮겨진 스킬 복구
- **파일**: `~/.claude/skills/.trash/`
- **근거**: 이 버전은 `manifest.json`에 이름이 있다는 이유로 스킬이 `.trash`로 옮겨지던 버그를 고쳤다. 이미 옮겨진 스킬은 되돌아오지 않는다. `claude-changelog-sync`, `eos-cdn-deploy`, `eos-store-round` 같은 직접 만든 스킬이 여기로 빠졌는지 보고, 있으면 `~/.claude/skills/`로 되돌린다.
- **난이도**: ★☆☆ (약 5분)

### 2. Opus 5.5용 effort 레벨 정하기
- **파일**: `~/.claude/settings.json` (`"effortLevel": "xhigh"`)
- **근거**: 모델별 `/effort`가 생기기 전에 저장한 `xhigh`는 새 모델 Opus 5.5에 적용되지 않는다. CLAUDE.md §5에 따라 subagent를 모두 Opus로 돌리므로, 이 규칙이 이제 Opus 5.5에 걸린다. `/model`에서 Opus 5.5를 고르고 `/effort`로 레벨을 명시해 저장한다. 그다음 `/status`로 실제 적용된 레벨을 확인한다.
- **난이도**: ★☆☆ (약 10분)

### 3. 다이얼로그 y/n 단축키 선택
- **파일**: `~/.claude/keybindings.json`
- **근거**: 이제 `y`·`n` 한 글자로 다이얼로그를 확정하거나 닫지 못한다. Enter·Esc만 먹는다. 기존 습관을 유지하려면 `y`는 `confirm:yes`, `n`은 `confirm:no`에 바인딩한다. 실수 방지(작업 원칙 1번)를 우선하면 바인딩하지 않고 새 기본값을 그대로 쓴다. 둘 중 하나로 정한다.
- **난이도**: ★☆☆ (약 5분)
