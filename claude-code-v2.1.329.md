# Claude Code v2.1.329

> 작성일: 2026-11-20

---

# 📋 요약본

## 🎉 신기능 (7건)
- **신뢰 대화상자에 훅 선언 위치 표시** — 폴더를 신뢰할지 묻는 대화상자가 그 폴더의 훅(hook, 특정 시점에 자동 실행되는 명령)이 어느 파일에 선언됐는지 경고로 보여준다.
- **관리형 설정 훅 로드 실패 경고** — Claude Desktop 등 비대화형 호스트에서 managed settings의 훅이 로드되지 않으면 대화에 경고를 띄운다.
- **`/tasks` 범위 확대** — 이번 세션의 예약 작업, `/loop` 깨우기, 목표(goal), 대화 포크(fork)까지 `/tasks`에 나온다. `x`를 누르면 확인 후 하나를 중지한다.
- **`/mcp` "Server message" 행** — 원격 HTTP MCP 서버가 연결을 거부하면 그 JSON-RPC 오류 메시지를 서버 페이지에 보여준다.
- **`/status` "Marketplace auto-update" 행** — 자동 업데이트를 받지 않는 관리형 마켓플레이스 이름과 그 이유를 보여준다.
- **OpenTelemetry와 Code Mode 동시 사용** — OpenTelemetry 이벤트·메트릭을 켠 상태에서도 Code Mode를 켤 수 있다. 코드가 부르는 도구 호출마다 이벤트를 보낸다. tracing을 켜면 여전히 꺼진다.
- **[VSCode] 신뢰 거절 후 "Review trust" 줄** — 신뢰 프롬프트를 거절하면 입력창 위에 줄이 생기고, 창을 다시 불러오지 않고 프롬프트를 되살릴 수 있다.

## 🛠️ 개선/수정 (20건)
- **`~/.claude.json` 초기화 버그 수정** — 네트워크 지연이나 파일 잠금으로 읽기 실패 시 저장 중 기본값으로 덮어쓰이던 문제를 고쳤다.
- **macOS Keychain 반복 로그아웃 수정** — Keychain 읽기는 되고 쓰기는 안 될 때 반복 로그아웃되던 문제를 고쳤다. 해당 세션만 만료 시 멈추고 이유를 알린다.
- **끝없이 출력하는 status line 스크립트 대응** — 프롬프트가 멈추고 메모리를 수 GB 쓰던 문제를 고쳤다.
- **`/code-review` 동작 정비** — PR 번호를 주면 `gh pr diff`로 PR을 읽는다. 대상 없이 실행하면 브랜치 전체를 기본 브랜치와 비교한다. 존재하지 않는 `~/.claude/CLAUDE.md`를 찾다 권한 프롬프트에서 멈추던 문제, 실제로는 medium으로 돌았는데 "high"로 표시되던 문제도 고쳤다.
- **`/code-review` PR 실패 시 중단** — `<pr number> --fix` 또는 PR URL을 줬을 때 `gh pr diff`가 거부·실패하면 리뷰 없이 멈춘다.
- **Code Mode 훅 실패 정책 변경** — PreToolUse 훅이 오류를 내도 스크립트의 도구 호출을 더는 거부하지 않는다. 반드시 막아야 하는 훅에는 `"onFailure": "block"`을 설정한다.
- **Code Mode 안정화 다수** — 무한 루프로 메모리가 차던 문제에 상한을 두고, 대형 파일 메모리 보관, `let x;` 값이 이전 스크립트 값을 유지하던 문제, 4,096개 넘는 도구 세션에서 `tools` 접근 상실 등을 고쳤다.
- **Code Mode 시작 조건 완화** — telemetry·비필수 트래픽·feature flag가 꺼져 있어도 시작한다. 관리자는 managed settings로 끌 수 있다.
- **`/teleport` 대화 덮어쓰기 수정** — 클라우드 세션을 고르면 `/clear`처럼 새 세션을 시작한다. 이전 대화는 `/resume`으로 돌아온다.
- **IDE diff 저장 시 마지막 줄바꿈·BOM 손실 수정** — 파일 끝 줄바꿈과 바이트 순서 표시(BOM)가 보존된다.
- **`/terminal-setup` 설정 파일 손상 수정** — VS Code 설정·키바인딩 파일의 블록 주석 주변을 망가뜨리던 문제와 macOS 27 Terminal.app 관련 오동작을 고쳤다.
- **MCP 안정화** — 재연결 후 멈춘 백그라운드 작업, `application/octet-stream`으로 받은 PDF·이미지가 .bin으로 저장되던 문제, 도구 로드 실패를 "도구 없는 서버"로 착각하던 문제를 고쳤다.
- **Agent 도구 `effort` 파라미터 반영** — 에이전트 팀의 이름 붙은 팀원에게 `effort`가 무시되던 문제를 고쳤다.
- **auto mode 개선** — 작업 디렉토리 밖·자기 자신을 가리키는 심볼릭 링크 `rm` 시 수동 승인 요청 문제를 고쳤다. `git status` 실행 빈도를 줄여 대형 저장소에서 대기가 줄었다.
- **`/team-onboarding` 공유 성공 오보 수정** — 서버가 업로드를 거부했는데 공유됐다고 표시하던 문제를 고쳤다.
- **예약 작업 저장 방식 변경** — 이전 버전에서 저장한 예약 작업 대부분은 새 세션에서 다시 예약해야 한다. 'Exit and stop tasks'는 이번 세션의 예약 작업을 끝내 재개 시 다시 돌지 않게 한다.
- **`max_tokens` 자동 재시도 제거** — 2.1.326의 자동 재시도를 없앴다. 출력 토큰이 적은 게이트웨이를 쓰면 `CLAUDE_CODE_MAX_OUTPUT_TOKENS`를 설정한다.
- **메모리 사용 개선** — 긴 세션, 대형 MCP 결과, 유휴 Desktop/SDK 세션, `--resume` 세션의 메모리 사용을 줄였다.
- **Self-hosted runner 다수 수정** — Git LFS 저장소, SSH 호스트 별칭, 클론 경로 규칙, `--push-outcome-on-release`의 브랜치 삭제 문제 등을 고치거나 바꿨다.
- **[VSCode] IME·접근성·로그인 수정** — IME 조합 중 키 입력 오동작, 토큰 갱신 지연 시 전체 로그아웃, 스크린리더 안내 누락 등을 고쳤다.

## 🔑 이번 버전의 핵심 키워드
**"훅·작업·리뷰의 신뢰성 다지기"** — 훅 출처를 드러내고, 백그라운드 작업을 한곳에 모으고, `/code-review`와 Code Mode가 조용히 틀리던 지점을 대거 바로잡은 안정화 릴리스다.

---

# 📜 원문 (한글 번역본)

> 원문 ChangeLog를 원래 순서 그대로 한 줄도 빠짐없이 번역한 문서입니다.

- 폴더의 훅이 어디에 선언되어 있는지 알려주는 신뢰 대화상자 경고 추가
- Claude Desktop 및 기타 비대화형 호스트에서 managed settings의 훅 로드가 실패하면 대화에 경고를 표시하는 기능 추가
- 이번 세션의 예약 작업, `/loop` 깨우기, 목표(goal), 이 대화의 포크를 `/tasks`에 추가. x는 확인 후 하나를 중지
- 연결을 거부하는 원격 HTTP MCP 서버의 JSON-RPC 오류 메시지를 보여주는 "Server message" 행을 `/mcp`의 서버 페이지에 추가
- 자동 업데이트를 받지 않는 관리형 마켓플레이스와 그 이유를 알려주는 "Marketplace auto-update" 행을 `/status`에 추가
- OpenTelemetry 이벤트·메트릭이 켜진 상태에서도 Code Mode를 켤 수 있도록 지원 추가. 코드가 하는 각 도구 호출이 이벤트를 전송. tracing은 여전히 Code Mode를 끔
- 네트워크 지연이나 파일 잠금으로 `~/.claude.json`을 읽을 수 없게 되어 저장 중 비워질 때 기본값으로 초기화되던 문제 수정
- macOS에서 Claude Code가 Keychain을 읽을 수는 있지만 저장할 수 없을 때 반복 로그아웃되던 문제 수정. 이제 해당 세션은 만료 시 멈추고 이유를 알리며, 다른 세션은 로그인 상태를 유지
- `/terminal-setup`이 블록 주석 주변에서 VS Code 설정·키바인딩 파일을 손상시키고, keybindings.json에 닫히지 않은 문자열이 있을 때 Shift+Enter 바인딩을 잃으면서도 성공으로 보고하던 문제 수정
- IDE diff로 수락한 파일이 마지막 줄바꿈 없이 저장되고, VS Code에서 diff를 저장해 편집을 수락할 때 바이트 순서 표시(BOM)를 잃던 문제 수정
- `/teleport`에서 클라우드 세션을 고르면 열린 대화를 대체하던 문제 수정: 이제 `/clear`처럼 새 세션을 시작하고, `/resume`으로 이전 세션을 되돌릴 수 있음
- `/usage-credits`가 브라우저를 연 뒤 Pro·Max 사용자에게 다시 로그인을 요구하던 문제, 브라우저가 열리지 않고 작업이 usage credits 때문에 멈출 때 링크가 8초 후 사라지던 문제 수정
- usage credits가 소진되었거나 월 한도에 도달했을 때 `/usage`가 꺼져 있다고 표시하던 문제, 그 한도가 usage credits로 동작하는 모델을 막을 때 `/model`이 Pro·Max 사용자에게 알리지 않던 문제 수정
- 지출 한도 메뉴가 지출액을 월 한도로 표시하고, 좁은 창에서 행이 포인터 아래로 줄바꿈되던 문제 수정
- 끝없이 출력하는 status line 스크립트가 프롬프트를 멈추고 수 GB의 메모리를 쓰던 문제 수정
- --resume 선택기, 신뢰 대화상자 또는 다른 설정 화면이 대기 중일 때 managed settings를 승인하면 빈 화면으로 멈추던 문제 수정
- Default 행이 이미 저장된 모델을 보여줄 때 `/model`에서 Default를 고르면 저장된 모델이 조직 기본값으로 바뀌던 문제 수정
- 토큰 갱신 중 인증을 지웠을 때 MCP 서버가 다시 로그인되던 문제 수정
- 느린 재연결 후 멈춘 백그라운드 MCP 작업 수정: 이전 프로토콜 버전에 남은 대부분의 HTTP MCP 서버를 Claude Code가 스스로 재연결
- MCP 서버나 웹사이트가 `application/octet-stream`으로 보낸 PDF, 이미지, `.docx`·`.xlsx`·`.pptx` 파일이 .bin으로 저장되어 Claude가 PDF와 이미지를 읽지 못하던 문제 수정
- `/code-review <pr number>`가 알리지 않고 PR 대신 체크아웃된 브랜치를 리뷰하던 문제 수정: 이제 `gh pr diff`로 PR을 읽거나, 읽을 수 없으면 알림
- 대부분의 모델에서 `/code-review`가 존재하지 않는 `~/.claude/CLAUDE.md`를 찾으려다 권한 프롬프트에서 멈추던 문제 수정
- Self-hosted runner: `--push-outcome-on-release`가 git 호스트에서 세션 브랜치를 삭제하던 경우 수정
- Esc 후 Code Mode가 스크립트의 완료된 편집과 중지된 명령을 숨기고, 종료 시 잃던 문제 수정
- Code Mode의 폭주 루프가 머신 메모리를 채우던 문제 수정. 이제 한도에서 중지
- 재개 중에 중지된 백그라운드 에이전트가 계속 실행되던 문제 수정
- 백그라운드 셸 명령이 종료될 때까지 이전 대화용 메모리를 쓰던 문제 수정
- Claude Desktop, IDE, SDK가 실행한 세션에서 compaction이나 `/clear` 후 Remote Control이 이전 대화용 메모리를 쓰던 문제 수정
- Bedrock의 Claude Desktop 세션에서 멈춘 AWS credential_process 또는 로그인 호출을 기다리는 동안 Stop이 요청을 끝내지 못하던 문제 수정
- Opus 4.8과 Opus 5에서 Claude가 첫 시도에 파일 전송에 실패하던 경우 수정
- tool search 세션에서 연결된 MCP 서버의 도구를 로드할 수 없다는 사실을 Claude가 듣지 못하고 도구가 없는 서버로 여기던 문제 수정
- 서비스의 클라이언트 등록이 폐기된 경우(HTTP 410 Gone) `claude mcp login`과 `/mcp`가 해당 서비스가 Claude Code 로그인을 받지 않는다고 말하던 문제 수정
- macOS에서 세션 실행 중 claude.ai 동기화 플러그인 훅이 "Plugin directory does not exist"로 실패하던 또 다른 경우 수정
- 작업 디렉토리 밖이나 자기 자신을 가리키는 심볼릭 링크를 `rm`할 때 auto mode가 수동 승인을 요구하던 문제 수정
- Linux에서 `/sandbox`가 `allowUnixSockets` 항목을 허용된 것으로 표시하던 문제 수정: 실제로 해당 소켓을 열지 않으며, 이제 `/sandbox`가 그렇게 알림
- `/install-github-app`에서 잘못 입력한 코드를 지우려고 Esc를 두 번 누르면 로그인이 끝나던 문제 수정
- Remote Control: 앱은 선택한 수준을 보여주는데 재시작 후 세션이 처음 effort 수준으로 돌아가던 문제 수정 (Ultracode로 시작하는 세션은 아직 미적용)
- `reload_plugins` 후 또는 계정 플러그인 목록에서 빠졌을 때 headless 세션에서 제거된 플러그인의 MCP 서버가 연결 상태로 남던 문제 수정
- 같은 주소의 플러그인이나 MCP 서버 연결이 실패하면 Claude Docs 커넥터의 도구가 사라지고, 오류가 잘못 `/login`을 제안하던 문제 수정
- `--add-dir`가 작업 디렉토리를 가리키거나 홈 폴더에서 Claude Code를 시작할 때 새 skills·commands·agents 폴더를 놓치던 문제 수정
- 미리 데워진 프로세스로 시작한 세션이 프로젝트 `.claude/settings.json`의 `autoCompactWindow` 설정을 무시하던 문제 수정
- settings.json에서 제거한 뒤에도 실행 중인 세션에서 `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE`가 계속 적용되던 문제 수정
- 에이전트 팀의 이름 붙은 팀원에게 Agent 도구의 `effort` 파라미터가 무시되던 문제 수정
- `/auto-mode-setup`이 규칙 제안을 위해 프로젝트를 스캔할 때 최근 auto mode 거부를 무시하던 문제 수정. 이제 그로부터 allow 규칙을 제안할 수 있으며, 저장 전 각각 검토
- 자체 `.claude/settings.local.json`이 읽을 수 없거나 형식이 잘못된 하위 폴더·worktree에서 권한 규칙이나 디렉토리 추가 후 잘못된 "Couldn't save this change" 경고가 뜨던 문제 수정
- 요청 실패 후 클라우드 세션이 Claude에게 네트워크 프록시 확인을 지시하고, auto mode가 그것을 차단하던 문제 수정
- 모델 변경 직후 보낸 메시지가 아직 대기 중일 때 headless rewind와 fork가 진행되던 문제 수정
- 클라우드 세션 재시작 중 백그라운드 작업이 중지되었을 때 Claude가 알림을 받지 못하던 문제 수정
- Team·Enterprise 플랜에서 서버가 업로드를 거부했는데 `/team-onboarding`이 가이드를 공유됨으로 보고하던 문제 수정
- 전체화면에서 패널과 질문이 프롬프트에서 잘리고, 짧은 창에서 `/help`·기록 검색·백그라운드 작업 목록이 행이나 제목을 잃고, 대화상자에서 표가 줄바꿈되던 문제 수정
- 재개된 세션이 세션 종료로 끊긴 편집·질문·계획을 "Rejected" 또는 "Declined"로 표시하던 문제 수정
- 서버 오류 후 `/passes`가 잘못된 패스 수를 보여주고, 게스트 패스가 남지 않았는데 공유 대가로 usage credits를 제안하던 문제 수정
- 다른 프로그램으로 파이프할 때 `claude --help` 출력이 잘리던 문제 수정
- macOS 27에서 `/terminal-setup`이 Terminal.app의 "Use Option as Meta key"를 켜고, 팁이 Shift+Enter 대신 Option+Enter를 제안하던 문제 수정
- Self-hosted runner: Anthropic 관리 git으로 클론한 Git LFS 저장소에서 설정이 실패하던 문제 수정. 이제 세션은 포인터 파일로 시작하고 `git lfs pull`이 내용을 가져옴
- SSH 호스트 별칭, GitHub SSH 인증서, GHE.com SSH 사용자를 쓰는 git remote에서 self-hosted 환경 세션이 시작되지 않던 문제 수정. 해석되지 않은 별칭의 오류는 git 명령 두 개를 안내
- 시간 초과나 네트워크 오류 후 self-hosted runner 세션의 원격 MCP 서버가 도구 없이 남거나 (https에서) 연결이 끊긴 채 남던 문제 수정
- Claude Code가 아직 시작 중인데 self-hosted runner 세션이 응답을 멈춘 것으로 표시되던 문제 수정
- Code Mode가 코드가 읽은 모든 대형 텍스트 파일을 메모리에 유지하고, 백그라운드 서브에이전트가 깨어날 때마다 메모리가 늘던 문제 수정
- MCP 폼, MCP 링크 프롬프트, 항상 묻는 프롬프트가 응답을 기다리는 동안 Code Mode가 10분 한도에서 스크립트를 중지하던 문제 수정
- 2분 넘는 대부분의 MCP 호출에서 Code Mode 스크립트가 "moved to the background" 메시지를 데이터로 받던 문제 수정: 이제 최대 10분 기다린 뒤 오류를 받음
- 일부 도구만 나열하는 mod가 Code Mode를 조용히 끄던 문제 수정. 이제 그런 mod는 Code Mode를 끄지 않으므로, 끄려면 managed settings를 사용
- Claude가 기다리는 스크립트에서 호출된 MCP 도구의 턴 종료 요청을 Code Mode가 무시하던 문제 수정
- Code Mode 스크립트의 `let x;`가 이전 스크립트가 `x`에 준 값을 유지하던 문제 수정
- 인자가 필요 없는 도구를 인자 없이 호출하면 Code Mode 스크립트가 missing-parameter 오류로 실패하던 문제 수정
- 도구가 4,096개를 넘는 세션에서 Code Mode 스크립트가 `tools`를 통한 도구 접근을 잃던 문제 수정
- 대부분의 모델에서 medium으로 실행된 리뷰인데 `/code-review` 결과 카드가 자주 "high"로 표시하던 문제 수정
- 권한 프롬프트, 질문, `/model`, `/rewind`의 키 힌트가 `keybindings.json`을 무시하던 문제 수정
- 실행 중인 세션에서 자동 스크롤, PR 상태 배지, auto-compact 경고, ultracode 태그가 이를 제어하는 `/config` 스위치를 따르지 않던 문제 수정
- `/add-dir`, `/tui` 피드백, save-workflow 폼에서 사용자 지정 취소 키가 동작하지 않던 문제 수정
- save-workflow 폼의 방향키가 뒤쪽 workflow 보기의 선택을 움직이던 문제 수정
- 여러 설정을 바꾼 뒤 `/config`가 아무 말도 없거나 "dismissed"라고 하던 문제 수정
- 줄바꿈으로 끝나는 파일에서 Read와 @-mention이 한 줄 더 보여주던 문제 수정
- plan mode에서 opusplan과 haiku가 쓰는 모델을 `/status`가 표시하지 않던 문제 수정
- macOS sandbox 안에서 잠금 해제가 도움이 안 되는데도 `claude doctor`가 Keychain 잠금 해제를 권하던 문제 수정
- 텍스트 복사 후 스크롤하면 "Jump to bottom" 알약이 숨겨진 채로 남고, 라벨이 바뀌면 그 아래 행이 비고, 전체화면에서 PageUp을 빠르게 누르면 너무 멀리 스크롤되던 문제 수정
- 메모리가 부족할 때 화면 업데이트가 가끔 건너뛰어지던 문제 수정
- 긴 코드 블록이 스크롤백에서 빈 줄 하나를 잃고 다른 줄을 반복하던 문제 수정
- 프롬프트 제안에 `_(no suggestion)_` 같은 자리표시 텍스트가 가끔 보이던 문제 수정
- 재개 시 이전 메시지 안내 문구가 파일이 멀쩡한데 손상된 파일 탓을 하던 문제 수정
- 여러 스타일을 지정하는 색상 코드가 포함된 텍스트에서 키워드나 명령이 강조될 때 프롬프트의 문자가 사라지던 문제 수정
- `claude remote-control` 세션에서 `/rename`과 `UserPromptSubmit` 훅 제목이 claude.ai와 모바일에 보이지 않던 문제 수정
- 브랜치가 파일 이름을 바꾼 뒤 편집하면 Remote Control diff가 그 파일을 두 번 나열하던 문제 수정
- managed settings가 있는 컴퓨터에서 오래된 세션 자동 정리 개선
- `/tui` 등 제자리 재시작이 로그인 갱신을 잠시 기다리도록 개선해 로그아웃 가능성 감소
- 많은 파일을 편집하는 긴 세션, 대형 MCP 도구 결과가 많은 macOS·Linux의 긴 Claude Desktop 세션에서 메모리 사용 개선
- Windows: Claude Code의 검색 프로그램이 느리게 시작하는 PC에서 시작과 첫 검색 개선
- telemetry가 꺼졌거나, Anthropic API 게이트웨이 뒤에 있거나, Microsoft Foundry일 때 Claude 질문에 대한 "yes" 같은 짧은 답을 auto mode가 처리하는 방식 개선
- 긴 턴 후, 그리고 스크린샷이나 대형 도구 결과를 가진 세션의 `--resume`·`--continue` 후 유휴 Claude Desktop·SDK 세션의 메모리 사용 개선
- Remote Control이 켜진 Claude Desktop Code 세션이 답변 후 다음 메시지를 받을 준비가 되는 속도 개선
- 클라우드 세션이 시작 시 다운로드에 실패한 플러그인을 재시도하도록 개선
- Code Mode 개선: 스크립트가 수천 번 도구 호출을 한 뒤 터미널이 멈추는 시간이 크게 줄어듦
- Code Mode 개선: 서브에이전트 시작 후 Claude가 Code Mode 밖과 같은 대기 안내를 받음
- macOS의 computer use를 새 안전 규칙으로 업데이트해 일부 동작은 거부되고 일부 앱은 접근이 줄어듦
- 저장된 예약 작업 변경: 로그인된 새 세션에서는 이전 버전이 저장한 대부분을 다시 예약해야 하지만, 해당 세션을 `--resume`하면 여전히 실행됨
- 대부분의 모델에서 대상 없는 `/code-review`가 브랜치 전체를 기본 브랜치와 비교해 리뷰하도록 변경하고, 여러 커밋 브랜치에서 diff를 잃던 문제 수정
- 대형 저장소에서 대부분의 요청 대기가 줄도록 auto mode가 `git status`를 덜 자주 실행하도록 변경. 변경 사항을 버리는 git 명령은 작업 트리 확인 전까지 차단될 수 있음
- `/code-review <pr number> --fix`와 PR URL을 준 `/code-review`가 `gh pr diff`가 거부되거나 실패하면 리뷰 없이 멈추도록 변경
- 'Exit and stop tasks'가 이번 세션의 예약 작업을 끝내 재개 시 다시 실행되지 않도록 변경 (Claude가 응답 중일 때 종료한 경우 제외)
- 일부 팀원 창이 /bin/sh로 시작하도록 변경해 셸 시작 파일을 읽지 않을 수 있음
- macOS의 computer use가 30초 내에 끝나지 않은 앱 실행을 포기하도록 변경
- Gateway: `access_control.allow_cidrs`가 비어 있을 때 보이던 시작 경고를 매 시작 시 공지로 바꾸고 텍스트 로그에서는 박스로 표시: 게이트웨이를 공용 인터넷에 절대 노출하지 말 것
- Self-hosted runner: 같은 owner/name을 두 번째 호스트 이름으로 클론하면 베이스 폴더의 `_repos/clones/<host>/` 아래에 두도록 변경. 기존 클론은 이동하지 않음
- Self-hosted runner: 주소 경로에 특이한 문자가 있는 저장소는 새 폴더에 새로 클론하도록 변경. 이전 폴더를 지정한 규칙과 볼륨은 더 이상 적용되지 않으며, 이전 클론은 그대로 남음
- Self-hosted runner: `--capacity 1`에서 `--repository-folder`가 베이스 폴더 안 대부분의 폴더를 받도록 변경 (1 초과일 때 그런 폴더가 있으면 시작이 멈춤). 겹치는 다른 저장소의 세션은 거부
- Code Mode에서 오류를 낸 PreToolUse 훅이 Code Mode 밖과 같이 스크립트의 도구 호출을 더는 거부하지 않도록 변경. 반드시 거부해야 하는 command·HTTP·MCP 도구 훅에는 `"onFailure": "block"`을 설정
- 수 GB의 메모리를 쓸 수 있는 256 MiB 초과 라인 범위의 스크립트 읽기를 Code Mode가 거부하도록 변경하고, 매우 긴 줄 읽기가 시간 초과되던 문제 수정
- telemetry, 비필수 트래픽, feature flag가 꺼져 있어도 Code Mode가 시작하도록 변경. 관리자는 managed settings로 끌 수 있음
- 자체 `log`, `preview`, `sleep`을 선언한 스크립트를 이전에는 거부했으나 이제 Code Mode가 실행하도록 변경
- macOS 로그인 갱신이 `Claude Code-write-check` 항목으로 Keychain을 테스트하도록 변경
- `/tasks` 헤더와 하단의 백그라운드 개수를 셸, 모니터, MCP 호출, 에이전트, workflow, 예약 작업을 아우르는 하나의 숫자로 변경
- Stop·SubagentStop 훅이 `background_tasks`에서 Monitor의 스크립트를 `shell`이 아니라 `monitor`로 나열하도록 변경
- `max_tokens` 오류에 명시된 한도로 자동 재시도하던 2.1.326 기능 제거. 출력 토큰이 더 적은 모델의 게이트웨이 뒤에 있다면 `CLAUDE_CODE_MAX_OUTPUT_TOKENS`를 그 한도로 설정
- [VSCode] 신뢰 프롬프트를 거절한 뒤 메시지 상자 위에 줄을 추가하고, Review trust로 창을 다시 불러오지 않고 프롬프트를 되살릴 수 있게 함
- [VSCode] 로그인 서버가 확장의 토큰 갱신에 10~30초 걸려 응답할 때 모든 창과 터미널에서 Claude Code 로그아웃되던 문제 수정
- [VSCode] 입력기(IME) 조합 중 누른 키가 권한 프롬프트에서 포커스를 옮기거나 거절하고, 메뉴 행을 실행하고, 대화상자를 닫던 문제 수정 (anthropics/claude-code#106358)
- [VSCode] Bash, Edit, Write 등 내장 도구의 권한 프롬프트가 안전 검사가 묻는 이유를 보여주지 않던 문제 수정
- [VSCode] 작성 중인 plan 댓글이 사라지거나 다른 구절로 옮겨지고, 입력기의 Enter가 댓글을 보내거나 세션 이름 변경을 끝내거나 @-mention 파일을 선택하던 문제 수정
- [VSCode] 한도 배너가 usage credits 사용 중임을 알리지 않고, 세션 설문이 그 배너와 usage credits 카드를 가리던 문제 수정
- [VSCode] Account & Usage 대화상자가 열린 동안 도착한 권한 요청을 스크린리더가 대화상자를 닫을 때까지 안내하지 않던 문제 수정
- [VSCode] 터미널 Claude Code 세션 연결이 끊긴 뒤 제안된 편집 diff 탭이 아무 동작도 하지 않는 Accept 버튼과 함께 열린 채로 남던 문제 수정
- [VSCode] 짧은 도구 입력·출력이 패널 가장자리에서 잘려 나머지를 읽을 방법이 없던 문제(이제 편집기 탭으로 열림), 드래그로 텍스트를 선택해도 탭이 열리던 문제 수정
- [VSCode] 메시지 상자에서 입력기(IME)가 조합 중인 텍스트 위에 Up 키가 이전 메시지를 덮어쓰던 문제 수정 (anthropics/claude-code#101294)
- [VSCode] VS Code 1.103~1.139 또는 떠 있는 채팅 창에서 Explorer 폴더를 채팅에 끌어다 놓으면 아무것도 삽입되지 않고, 드롭 강조가 사라지며 잘못된 "Hold Shift" 힌트가 뜨던 문제 수정
- [VSCode] 버튼이 활성화되면서 권한 프롬프트가 스크롤 중이던 세부 내용에서 키보드 포커스를 빼앗던 문제 수정
- [VSCode] `claudeCode.lockEditorGroups`가 꺼져 있을 때 Claude 탭의 파일 링크가 다른 편집기 그룹에서 열리던 문제 수정 (anthropics/claude-code#108884)
- [VSCode] 물결표 하나로 쓴 범위(`3~5 … 7~10`)가 물결표를 잃고 그 사이 텍스트에 취소선이 그어지던 문제 수정. 이제 `~~text~~`만 취소선 처리
- [VSCode] 받아쓰기 오류가 좁은 열로 줄바꿈되고, 질문 카드 대기 중 스피너가 돌고, 실패한 UTF-16 명령 출력에서 글자마다 NUL 기호가 붙던 문제 수정
- [VSCode] 권한 프롬프트에서 Down 키가 Yes로 돌아가지 않고 마지막 항목에서 멈추도록 변경
- [VSCode] 명령 출력에서 일반 색상 외의 숨은 문자와 제어 시퀀스를 기호로 표시하도록 변경. 이로 인해 페르시아어, 크메르어, 라오어, 싱할라어, 말라얄람어 텍스트가 깨지거나 순서가 어긋나 보일 수 있음

---

## 🎯 챌린지

이번 버전에서 내 환경에 적용해볼 만한 항목입니다.

### 1. deploy-guard 훅에 실패 시 차단 지정
- **파일**: `~/.claude/settings.json`
- **근거**: 이번 버전부터 Code Mode에서는 PreToolUse 훅이 오류를 내도 도구 호출을 막지 않는다. `deploy-guard.sh`는 `feat/*`·`fix/*` 원격 push를 막는 안전장치다. 스크립트가 오류를 내면 그냥 통과될 수 있으므로, `hooks.PreToolUse`의 해당 command 훅에 `"onFailure": "block"`을 넣어 실패해도 막히게 한다.
- **난이도**: ★☆☆ (약 5분)

### 2. CLAUDE.md의 `/code-review` 사용법 갱신
- **파일**: `~/.claude/CLAUDE.md`
- **근거**: §7 Review는 치명 등급에서 내장 `/code-review`를 쓴다고만 적혀 있다. 이번 버전에서 대상 없이 실행하면 브랜치 전체를 기본 브랜치와 비교하고, PR 번호를 주면 `gh pr diff`로 읽는다. 사용자 환경은 GitLab이라 `gh`가 동작하지 않을 수 있다. "PR 번호 대신 로컬 브랜치에서 대상 없이 실행한다"는 한 줄을 추가해 리뷰 대상이 헷갈리지 않게 한다.
- **난이도**: ★☆☆ (약 10분)

### 3. 비활성 플러그인을 가리키는 statusLine 경로 정리
- **파일**: `~/.claude/settings.json`
- **근거**: `statusLine.command`는 `token-optimizer` 플러그인 캐시(`.../5.8.8/.../statusline.js`)를 가리키지만, 그 플러그인은 `enabledPlugins`에서 꺼져 있다. 캐시가 정리되거나 버전이 바뀌면 status line이 깨진다. 이번 버전은 status line 스크립트의 멈춤 문제를 고쳤다. 이 기회에 스크립트를 `~/.claude/statusline.js`로 복사하고 경로를 바꾸거나, 쓰지 않으면 `statusLine` 블록을 지운다.
- **난이도**: ★★☆ (약 15분)
