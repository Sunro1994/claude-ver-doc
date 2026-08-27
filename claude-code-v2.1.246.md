# Claude Code v2.1.246

> 작성일: 2026-08-28

---

# 📋 요약본

## 🎉 신기능 (4건)
- **Bash allow 룰 와일드카드 경고** — `Bash(git * main)` 처럼 서브커맨드 앞에 `*` 가 오는 허용 규칙은 서브커맨드 앞에 끼워넣은 옵션까지 매칭한다. 시작 시 경고가 뜬다.
- **`/permissions` 에 Auto mode 탭 추가** — auto mode 분류기(classifier) 룰을 보고 편집할 수 있다.
- **턴 종료 시각 표시** — 턴 소요 시간 줄 끝에 완료 시각이 붙는다. 예: `✻ Sautéed for 23s · done 6:05 PM`.
- **`/cd` 개선** — 이동한 디렉터리의 project settings, hooks, `.mcp.json` 서버(기존 승인 프롬프트 거침), skills, agents 가 이동 직후 바로 적용된다. 전에는 `--resume` 해야 적용됐다.

## 🛠️ 개선/수정 (57건)
- **풀스크린 전사(transcript) 렌더** — 터미널 크기 변경 후 화면이 빈 채로 남고 다음 키 입력까지 맨 아래로 튀던 문제 수정.
- **긴 한 줄 diff 지연** — base64 문자열처럼 아주 긴 한 줄이 diff에 들어가면 전사가 심하게 느려졌다. 이제 그런 줄은 마커와 함께 잘려서 표시된다.
- **풀스크린 스크롤 불안정** — 이전 메시지 위치에서 스크롤이 튀고, 맨 아래로 이동이 중간에 걸리던 문제 수정.
- **백그라운드 세션 45초 실패** — 시작 디렉터리가 삭제됐거나, 머신이 절전에서 깼거나, 호스트가 프로세스를 느리게 띄우는 경우 열리지 않던 문제 수정.
- **백그라운드 세션 `EACCES`** — 다른 Claude Code 프로세스가 그 순간 npm 패키지를 재설치 중이면 "Couldn't start the background service … EACCES" 로 실패했다.
- **마크다운 렌더 비활성화** — 첫 500자에 마크다운이 없으면 메시지 전체의 마크다운 렌더가 꺼졌다. `+` / `N)` 목록과 setext 헤딩도 함께 수정.
- **MCP 도구 호출 중단 보고** — headless/remote 세션에서 들어온 메시지에 끊긴 MCP 호출이 모델에 "completed with no output" 으로 전달됐다. 이제 명시적 중단 에러로 전달된다.
- **MCP 인자 타입** — 파라미터 스키마가 빈 객체(`{}`)일 때 인자가 JSON 문자열로 전송됐다. 이제 실제 타입으로 보낸다.
- **중간에 끊긴 명령 표시** — "Ran 1 shell command" 로만 보이고 잘렸다는 표시가 없던 문제 수정.
- **dynamic workflow 중 서브에이전트 재시작** — ← 키나 `/background` 를 누르면 이미 끝난 서브에이전트가 재시작됐다. 이제 먼저 묻고, 몇 개가 재시작되는지 알려준다.
- **`claude agents` 부팅 중 세션 열기** — 워커가 아직 부팅 중인 세션을 열면 "was stopped while the respawn was in flight" 로 멈췄다(Windows에서 흔함).
- **`claude agents` 중복 표시** — 백그라운드로 보낸 이름 있는 세션이 두 번 나열됐다. 이제 같은 대화를 다시 백그라운드로 보내면 새 행에 번호가 붙는다(예: `my-session (2)`).
- **worktree 삭제 사고** — 백그라운드 보존 정리(retention sweep)가, 오래된 백그라운드 세션 기록이 가리키고 있다는 이유로 사용자가 직접 만든 `.claude/worktrees/` 아래 git worktree 를 지웠다.
- **auto mode 대형 세션 거부** — 도구 호출이 "temporarily unavailable" 로 거부됐다. 안전 검사 데드라인이 프롬프트 크기에 비례해 늘어난다.
- **플러그인 캐시 중복 디렉터리** — 같은 플러그인에 대해 SHA 이름 디렉터리가 중복 생성됐다.
- **플러그인 스킬 접두어 중복** — frontmatter `name` 에 이미 `<plugin>:` 접두어가 있으면 슬래시 메뉴에 두 번 붙어 보였다(예: `/plugin:plugin:skill`).
- **`claude plugin update` 이름 해석** — 설치된 플러그인을 짧은 이름으로 지정하면 실패했다(완전 수식 이름만 동작).
- **BOM 붙은 `plugin.json`** — UTF-8 byte-order mark 로 저장된 경우 플러그인 설치가 실패했다.
- **`/reload-plugins` 스킬 0개 보고** — `skills/*/SKILL.md` 형태로 스킬을 정의한 플러그인에서 0개로 보고됐다.
- **hook 에러 메시지 경로** — `${CLAUDE_PLUGIN_ROOT}` 가 문자 그대로 출력되고 실제 플러그인 경로로 치환되지 않았다.
- **`/rename` 이 테마 색을 덮어씀** — 프롬프트 테두리 색(커스텀 테마의 `promptBorder` 포함)이 기본 cyan 으로 바뀌었다. 이제 `/color` 로 직접 고르지 않는 한 테마 색을 유지한다.
- **커스텀 테마 diff 색 무시** — `diffAdded`/`diffRemoved` 와 흐린 변형이 diff 와 `/theme` 미리보기에서 무시됐다.
- **`keybindings.json` 잘못된 액션명** — 알 수 없는 액션 이름이 그 키를 조용히 죽였다. 이제 건너뛰어서 기본 바인딩이 살아 있고, `--debug` 에 경고가 남는다.
- **`/stats` 히트맵 한 칸 밀림** — UTC 동쪽 타임존에서 일별 활동이 한 칸씩 밀려 표시됐다(일요일 수치가 월요일 자리에).
- **`/fork` 빈 대화** — 이미 fork 됐거나 백그라운드로 보낸 세션에서 fork 하면 새 세션이 빈 대화로 시작했다.
- **`/--` 로 시작하는 프롬프트** — Lean 문서 주석 등이 알 수 없는 슬래시 명령으로 거부됐다. 이제 Claude 에게 그대로 전달된다.
- **`@` 파일 선택기** — 입력한 텍스트가 실제 경로와 더 이상 맞지 않아도 열린 채로 남았다.
- **상태줄 비용·시간 초기화** — agents 뷰로 갔다 돌아오면 0으로 리셋됐다.
- **풀스크린 포커스 탈취** — 창을 다시 활성화하려고 클릭했을 뿐인데 포인터 아래 컨트롤로 키보드 포커스가 옮겨갔다.
- **null 바이트 경로 완성** — 완성 토큰이나 작업 디렉터리에 null 바이트가 있으면 경로 완성이 실패했다.
- **Windows/macOS 세션 정리** — 비정상 종료한 세션이 `~/.claude/sessions` 에 남긴 낡은 항목을 headless 세션이 정리하지 않았다.
- **`tool_use` id 누락 렌더 에러** — 서드파티 Anthropic 호환 엔드포인트(`ANTHROPIC_BASE_URL`)가 `id` 없는 `tool_use` 블록을 스트리밍하면 첫 도구 호출에서 UI 가 렌더 에러로 멈췄다.
- **Write 도구 Out of memory** — 아주 큰 기존 파일을 덮어쓴 뒤 파일은 이미 써졌는데도 "Out of memory" 를 보고하거나 오래 멈췄다.
- **`claude plugin install <name>` 무응답** — `~/.claude/plugins/known_marketplaces.json` 이 비어 있거나 손상됐을 때 에러 없이 조용히 종료하거나 멈췄다.
- **재개 세션 400 에러** — 저장된 히스토리에 Anthropic API 가 받지 않는 도구 블록(주로 서드파티 API 프록시가 쓴 것)이 있으면 매 턴 400 으로 실패했다.
- **설치 스크립트 raw mode** — 서버 관리 설정을 쓰는 일부 Team/Enterprise 사용자에서 `curl -fsSL https://claude.ai/install.sh | bash` 가 "Raw mode is not supported" 로 실패했다.
- **plan mode 로 끝난 세션 재개** — VS Code 확장, 그리고 permission mode 가 설정되지 않은 `claude -p --continue`/`--resume`(권한 프롬프트 도구 사용 시)에서 plan mode 밖으로 재개됐다.
- **`Notification` hook 미발동** — 샌드박스의 "Network request outside of sandbox" 권한 프롬프트가 대기 중일 때 hook 이 발동하지 않았다.
- **Bash 권한 검사 강화** — 매달린 `&&` 또는 `||` 연산자가 있는 잘못된 형식의 명령은 항상 승인을 요구한다.
- **`--strict-mcp-config` 불필요한 프롬프트** — 절대 로드하지 않을 `.mcp.json` 서버 승인을 물어서 백그라운드 세션이 시작 단계에서 대기했다.
- **텔레메트리 키 유출** — Anthropic 으로 가는 텔레메트리·메트릭 요청이 서드파티 게이트웨이(`ANTHROPIC_BASE_URL`)용 API 키를 실어 보냈다. 이제 자격증명은 자기 호스트에만 전송된다.
- **`apiKeyHelper` 만료 토큰** — 짧은 수명 JWT 를 반환하는 경우 유휴 후 첫 프롬프트에서 API 에러가 보였다. 이제 만료된 캐시 토큰은 전송 전에 갱신하고, 401/403 인증 에러는 조용히 재시도한다.
- **전사 뷰 메모리 증가** — 풀스크린·Ctrl+O 전사 뷰에서 세션 길이에 따라 메모리가 늘었다. 렌더된 메시지 행이 전사 전체 도구 조회 테이블 사본을 더 이상 붙들지 않는다.
- **`/ultrareview`·클라우드 세션 교차 오염** — 한 저장소에서(예: 여러 worktree) 동시에 띄운 실행이 다른 실행의 커밋 안 된 변경으로 시작하는 경우가 있었다.
- **백그라운드 클라우드 세션 진행 카운트** — `/autofix-pr` 등에서 `3/5` 같은 태스크 수가 간간이 하나 빠졌다.
- **Remote Control 세션 이름** — claude.ai 와 Claude 앱에서 두 번째 프롬프트까지 임시 이름을 유지했다. 이제 첫 프롬프트 후 자동 생성 제목이 나온다.
- **`requiresUserInteraction` MCP 도구** — 권한 프롬프트에 "Yes, and don't ask again" 이 계속 떴다. 그 옵션이 쓰는 allow 룰은 해당 도구가 무시했다.
- **self-hosted runner 폴링** — work-poll 응답이 잘못된 형식(예: 중간 프록시의 HTML 페이지)이면 라이브 세션을 종료하거나 프로세스가 나갔다. 이제 폴링을 재시도한다.
- **Bash 도구 지연 개선** — bash 셸에서 스냅샷 함수를 함수당 base64 서브셸 없이 재생한다.
- **서브에이전트 결과 개선** — `maxTurns` 한계에서 멈춘 서브에이전트가 이제 출력을 부분(partial) 표시로 반환하고 `SendMessage` 로 이어가라는 힌트를 준다. 전에는 완료된 것처럼 보였다.
- **비대화형 세션 자동 이어쓰기** — `-p`, SDK, 클라우드 세션에서 서버 에러·연결 끊김·정지로 중간에 끊긴 응답을 에러로 끝내지 않고 자동으로 이어간다.
- **사용량 텔레메트리 귀속 개선** — workload identity federation 세션, 시작 시 `apiKeyHelper` 실행 중 전송된 이벤트, 유휴 중 로그인 토큰 만료 후의 조직 귀속이 개선됐다.
- **`/code-review` 자체 시작 확대** — Bedrock, Vertex AI, Foundry, Claude 앱 게이트웨이, 그리고 텔레메트리·비필수 트래픽이 비활성화된 환경에서도 Claude 가 스스로 시작할 수 있다.
- **`/goal` 체크인 제한** — 유휴 세션이 장시간 백그라운드 작업에 대해 목표당 최대 3회만 체크인을 시작한다. 다음 메시지를 보내면 3회가 다시 허용된다.
- **`claude install`·`claude update` 동의 프롬프트** — 대기 중인 managed-settings 동의 프롬프트를 명령 중간에 띄우지 않고 다음 대화형 세션으로 넘긴다.
- **OpenTelemetry 플러그인 이벤트** — claude.ai 에서 동기화된 플러그인의 `plugin_id_hash` 가 실제 마켓플레이스를 반영하고, admin 설치 플러그인은 `enabled_via` 가 `admin-install` 이다.
- **명령 샌드박스 설정 소스** — 파일시스템 구성이 `--setting-sources` 를 따르지 않던 문제 수정.

## 🔑 이번 버전의 핵심 키워드
**"경계에서 새던 것들을 막았다"** — 권한 룰의 와일드카드 함정, 서드파티 게이트웨이로 흘러가던 API 키, 사용자가 만든 worktree 삭제, 조용히 죽던 키바인딩까지 — 신뢰 경계와 데이터 경계를 손본 대규모 수정 릴리스.

---

# 📜 원문 (한글 번역본)

> 원문 ChangeLog를 원래 순서 그대로 한 줄도 빠짐없이 번역한 문서입니다.

- 서브커맨드 앞에 와일드카드가 오는 Bash allow 룰(예: `Bash(git * main)`)에 대한 시작 시 경고를 추가했다. 이런 룰은 서브커맨드 앞에 끼워넣은 옵션까지 매칭한다.
- `/permissions` 에 Auto mode 탭을 추가해 auto mode 분류기 룰을 보고 편집할 수 있게 했다.
- 턴 소요 시간 줄 끝에 턴 완료 시각을 추가했다. 예: `✻ Sautéed for 23s · done 6:05 PM`
- 터미널 크기를 바꾼 뒤 풀스크린 모드가 빈 전사를 보여주고 다음 키 입력까지 맨 아래로 튀는 문제를 수정했다.
- diff 에 아주 긴 한 줄(예: base64 문자열)이 포함될 때 전사가 심하게 느려지는 문제를 수정했다. 이제 그런 줄은 마커와 함께 잘려서 렌더된다.
- 이전 메시지에 위치했을 때 풀스크린 스크롤이 불안정한 문제(맨 아래로 이동이 전사 중간에 걸리는 것 포함)를 수정했다.
- Claude Code 의 시작 디렉터리가 삭제됐거나, 머신이 절전 상태였거나, 호스트가 프로세스를 느리게 시작할 때 백그라운드 세션이 45초 후 열리지 않는 문제를 수정했다.
- 다른 Claude Code 프로세스가 그 시점에 npm 패키지를 재설치하고 있을 때 백그라운드 세션이 "Couldn't start the background service … EACCES" 로 열리지 않는 문제를 수정했다.
- 메시지의 첫 500자에 마크다운이 없으면 그 메시지 전체에서 마크다운 렌더링이 비활성화되는 문제, 그리고 `+`/`N)` 목록과 setext 헤딩에서의 문제를 수정했다.
- headless/remote 세션에서 들어온 메시지에 의해 중단된 MCP 도구 호출이 모델에 명시적인 중단 에러 대신 "completed with no output" 으로 보고되는 문제를 수정했다.
- 파라미터 스키마가 비어 있을 때(`{}`) MCP 도구 인자가 실제 타입 대신 JSON 문자열로 전송되는 문제를 수정했다.
- 실행 중간에 중단된 명령이 잘렸다는 표시 없이 "Ran 1 shell command" 로 표시되는 문제를 수정했다.
- dynamic workflow 진행 중 ← 를 누르거나 `/background` 를 실행하면 끝난 서브에이전트가 재시작되는 문제를 수정했다. 이제 먼저 묻고, 몇 개의 서브에이전트가 재시작되는지 알려준다.
- 워커가 아직 부팅 중인, 방금 시작한 세션을 `claude agents` 에서 열면 "was stopped while the respawn was in flight" 로 멈추는 문제(Windows 에서 흔함)를 수정했다.
- `claude agents` 가 백그라운드로 보낸 이름 있는 세션을 두 번 나열하는 문제를 수정했다. 같은 대화를 다시 백그라운드로 보내면 이제 새 행에 번호가 붙는다(예: `my-session (2)`).
- 오래된 백그라운드 세션 기록이 가리킨다는 이유로, 백그라운드 보존 정리가 사용자가 직접 만든 `.claude/worktrees/` 아래 git worktree 를 제거하는 문제를 수정했다.
- 매우 큰 세션에서 auto mode 도구 호출이 "temporarily unavailable" 로 거부되는 문제를, 안전 검사 데드라인을 프롬프트 크기에 비례해 늘려 수정했다.
- 플러그인 캐시가 같은 플러그인에 대해 SHA 이름 디렉터리를 중복 생성하는 문제를 수정했다.
- frontmatter `name` 에 이미 `<plugin>:` 접두어가 포함된 플러그인 스킬이 슬래시 메뉴에서 접두어가 겹쳐 보이는 문제(예: `/plugin:plugin:skill`)를 수정했다.
- 설치된 플러그인을 짧은 이름으로 지정했을 때 `claude plugin update` 가 실패하는 문제를 수정했다(완전 수식 이름만 동작했다).
- `plugin.json` 이 UTF-8 byte-order mark(BOM)와 함께 저장됐을 때 플러그인 설치가 실패하는 문제를 수정했다.
- `skills/*/SKILL.md` 아래에 스킬을 정의한 플러그인에 대해 `/reload-plugins` 가 스킬 0개로 보고하는 문제를 수정했다.
- hook 에러 메시지가 해석된 플러그인 경로 대신 문자 그대로 `${CLAUDE_PLUGIN_ROOT}` 를 보여주는 문제를 수정했다.
- `/rename` 이 테마의 프롬프트 테두리 색(커스텀 테마의 `promptBorder` 포함)을 기본 cyan 으로 바꾸는 문제를 수정했다. 이제 `/color` 로 직접 고르지 않는 한 테두리가 테마 색을 유지한다.
- 커스텀 테마의 diff 색(`diffAdded`/`diffRemoved` 및 흐린 변형)이 diff 와 `/theme` 미리보기에서 무시되는 문제를 수정했다.
- `keybindings.json` 의 알 수 없는 액션 이름 바인딩이 그 키를 조용히 죽이는 문제를 수정했다. 이제 해당 바인딩은 건너뛰어져 기본 바인딩이 계속 동작하고, `--debug` 에서 경고가 기록된다.
- UTC 동쪽 타임존에서 `/stats` 활동 히트맵이 각 날짜의 활동을 한 칸 밀려 표시하는(일요일 수치가 월요일 아래에) 문제를 수정했다.
- 이미 fork 됐거나 백그라운드로 보낸 세션에서 `/fork` 하면 새 세션이 빈 대화로 시작하는 문제를 수정했다.
- `/--` 로 시작하는 프롬프트(예: Lean 문서 주석)가 Claude 에게 전달되지 않고 알 수 없는 슬래시 명령으로 거부되는 문제를 수정했다.
- 입력한 텍스트가 실제 경로와 더 이상 매칭되지 않아도 `@` 파일 선택기가 열린 채 남는 문제를 수정했다.
- agents 뷰로 이동한 뒤 돌아오면 상태줄의 비용과 소요 시간이 0으로 리셋되는 문제를 수정했다.
- 터미널 창을 다시 포커스하려고 클릭했을 뿐인데 풀스크린 모드가 포인터 아래 컨트롤로 키보드 포커스를 옮기는 문제를 수정했다.
- 완성 토큰 또는 작업 디렉터리에 null 바이트가 포함될 때 경로 완성이 실패하는 문제를 수정했다.
- Windows/macOS: 비정상 종료한 세션이 `~/.claude/sessions` 에 남긴 낡은 항목을 headless 세션이 정리하지 않는 문제를 수정했다.
- 서드파티 Anthropic 호환 엔드포인트(`ANTHROPIC_BASE_URL`)가 `id` 없는 `tool_use` 블록을 스트리밍할 때 첫 도구 호출에서 UI 가 렌더 에러로 멈추는 문제를 수정했다.
- 아주 큰 기존 파일을 덮어쓴 뒤, 파일이 이미 써졌음에도 Write 도구가 "Out of memory" 를 보고하거나 오래 멈추는 문제를 수정했다.
- `~/.claude/plugins/known_marketplaces.json` 이 비어 있거나 손상됐을 때 `claude plugin install <name>` 이 에러를 보고하지 않고 조용히 종료하거나(터미널에서 멈추거나) 하는 문제를 수정했다.
- 저장된 히스토리에 Anthropic API 가 허용하지 않는 도구 블록(주로 서드파티 API 프록시가 작성)이 포함될 때 재개된 세션이 매 턴 400 으로 실패하는 문제를 수정했다.
- 서버 관리 설정을 쓰는 일부 Team/Enterprise 사용자에서 `curl -fsSL https://claude.ai/install.sh | bash` 가 "Raw mode is not supported" 로 실패하는 문제를 수정했다.
- plan mode 로 끝난 세션이 VS Code 확장에서, 그리고 permission mode 가 설정되지 않은 상태의 권한 프롬프트 도구가 있는 `claude -p --continue`/`--resume` 에서 plan mode 밖으로 재개되는 문제를 수정했다.
- 샌드박스의 "Network request outside of sandbox" 권한 프롬프트가 대기 중일 때 `Notification` hook 이 발동하지 않는 문제를 수정했다.
- 매달린 `&&` 또는 `||` 연산자가 있는 잘못된 형식의 명령에 대해 Bash 권한 검사가 항상 승인을 요구하도록 수정했다.
- `--strict-mcp-config` 세션이 절대 로드하지 않을 `.mcp.json` 서버의 승인을 묻는 문제를 수정했다. 이 때문에 백그라운드 세션이 시작 단계에서 대기했다.
- Anthropic 으로 보내는 텔레메트리·메트릭 요청이 서드파티 게이트웨이(`ANTHROPIC_BASE_URL`)용으로 설정된 API 키를 실어 보내는 문제를 수정했다. 이제 자격증명은 자기 호스트에만 전송된다.
- `apiKeyHelper` 가 짧은 수명 JWT 를 반환할 때 유휴 후 첫 프롬프트에서 API 에러가 보이는 문제를 수정했다. 이제 만료된 캐시 토큰은 전송 전에 갱신되고, 401/403 인증 에러는 조용히 재시도한다.
- 풀스크린 및 Ctrl+O 전사 뷰에서 세션 길이에 따라 메모리가 증가하는 문제를 수정했다. 렌더된 각 메시지 행이 전사 전체의 도구 조회 테이블 사본을 더 이상 보유하지 않는다.
- 한 저장소에서(예: 여러 worktree 에서) 동시에 시작한 `/ultrareview` 실행과 클라우드 세션이 때때로 다른 실행의 커밋되지 않은 변경으로 시작하는 문제를 수정했다.
- `/autofix-pr` 같은 백그라운드 클라우드 세션에 표시되는 태스크 진행 수(예: `3/5`)가 때때로 하나 빠지는 문제를 수정했다.
- Remote Control 세션이 claude.ai 와 Claude 앱에서 두 번째 프롬프트까지 임시 이름을 유지하는 문제를 수정했다. 이제 자동 생성 제목이 첫 프롬프트 후에 나타난다.
- `requiresUserInteraction` 으로 표시된 MCP 도구의 권한 프롬프트가 여전히 "Yes, and don't ask again" 을 제공하는 문제를 수정했다. 그 옵션은 해당 도구가 무시하는 allow 룰을 작성했다.
- work-poll 응답이 잘못된 형식일 때(예: 중간 프록시의 HTML 페이지) self-hosted runner 가 라이브 세션을 종료하거나 프로세스가 종료되는 문제를 수정했다. 이제 폴링을 재시도한다.
- `/cd` 개선: 이동 직후 새 디렉터리의 project settings, hooks, `.mcp.json` 서버(기존 승인 프롬프트를 거침), skills, agents 가 `--resume` 없이 바로 적용된다.
- bash 셸에서 스냅샷 함수를 함수당 base64 서브셸 없이 재생하도록 Bash 도구 지연을 개선했다.
- 서브에이전트 결과 개선: `maxTurns` 한계에서 멈춘 서브에이전트가 완료된 것처럼 보이지 않고, 출력을 부분(partial)으로 표시해 반환하며 `SendMessage` 로 이어가라는 힌트를 준다.
- 비대화형 세션(`-p`, SDK, 클라우드 세션)이 서버 에러·연결 끊김·정지로 중간에 끊긴 응답을 에러로 끝내지 않고 자동으로 이어가도록 개선했다.
- workload identity federation 세션, 시작 시 `apiKeyHelper` 실행 중 전송된 이벤트, 유휴 중 로그인 토큰 만료 후의 사용량 텔레메트리 조직 귀속을 개선했다.
- Bedrock, Vertex AI, Foundry 에서, Claude 앱 게이트웨이를 통해서, 그리고 텔레메트리나 비필수 트래픽이 비활성화된 상태에서도 Claude 가 스스로 `/code-review` 를 시작할 수 있게 변경했다.
- `/goal`: 유휴 세션이 장시간 백그라운드 작업에 대해 목표당 최대 3회까지만 체크인을 시작하도록 변경했다. 다음 메시지를 보내면 3회가 더 허용된다.
- `claude install` 과 `claude update` 가 대기 중인 managed-settings 동의 프롬프트를 명령 중간에 띄우지 않고 다음 대화형 세션으로 미루도록 변경했다.
- claude.ai 에서 동기화된 플러그인의 OpenTelemetry 플러그인 이벤트를 변경했다: `plugin_id_hash` 가 이제 플러그인의 실제 마켓플레이스를 반영하고, admin 설치 플러그인은 `enabled_via` 가 `admin-install` 이다.
- 명령 샌드박스의 파일시스템 구성이 `--setting-sources` 를 따르지 않는 문제를 수정했다.

---

## 🎯 챌린지

이번 버전에서 내 환경에 적용해볼 만한 항목입니다.

### 1. Bash allow 룰의 와일드카드 함정 점검
- **파일**: `~/.claude/settings.json`, `~/.claude/settings.local.json`
- **근거**: 이번 버전은 `Bash(git * main)` 처럼 서브커맨드 앞에 `*` 가 오는 허용 룰에 시작 시 경고를 띄운다. 이런 룰은 `git --exec-path=... main` 처럼 서브커맨드 앞에 끼워넣은 옵션까지 통과시킨다. Deploy 정책(CLAUDE.md §6)이 `git push` 를 hook 으로 막는 환경이라 권한 룰이 새면 그 게이트가 무력화된다. `permissions.allow` 에 `Bash(...)` 룰이 있으면 `*` 위치를 서브커맨드 뒤로 옮긴다(`Bash(git push:*)` 형태).
- **난이도**: ★☆☆ (약 10분)

### 2. `deploy-guard.sh` 를 매달린 연산자 명령까지 방어하게 확인
- **파일**: `~/.claude/hooks/deploy-guard.sh`
- **근거**: 이번 버전은 매달린 `&&`/`||` 가 있는 잘못된 형식의 명령에 대해 Bash 권한 검사가 항상 승인을 요구하도록 바뀌었다. 하지만 hook 은 별도 계층이다. `git push origin feat/x &&` 같은 입력에서 스크립트의 브랜치 파싱이 통과되지 않는지 직접 넣어 확인하고, 파싱이 빈 문자열을 만들면 차단(exit 2)으로 fail-closed 처리한다.
- **난이도**: ★★☆ (약 20분)

### 3. `Notification` hook 추가로 샌드박스 권한 대기 알림 받기
- **파일**: `~/.claude/settings.json`
- **근거**: 현재 `hooks` 에는 `PreToolUse`(deploy-guard)와 `Stop`(작업 완료 알림)만 있다. 이번 버전에서 샌드박스의 "Network request outside of sandbox" 프롬프트 대기 중에도 `Notification` hook 이 발동하도록 고쳐졌다. `Stop` 과 같은 `osascript` 방식으로 `Notification` 엔트리를 추가하면 권한 프롬프트에서 세션이 조용히 멈춰 대기하는 상황을 즉시 알 수 있다.
- **난이도**: ★☆☆ (약 5분)

### 4. `/permissions` Auto mode 탭에서 분류기 룰 확인
- **파일**: `~/.claude/settings.json` (`permissions` 블록)
- **근거**: `skipAutoPermissionPrompt: true` 로 자동 승인 프롬프트를 건너뛰는 설정이므로 auto mode 분류기가 무엇을 자동 허용하는지 눈으로 볼 기회가 없었다. 이번 버전에 추가된 `/permissions` 의 Auto mode 탭에서 현재 룰을 열어 확인하고, 위험한 자동 허용(파일 삭제·원격 push 계열)이 있으면 deny 룰로 명시한다.
- **난이도**: ★★☆ (약 15분)
