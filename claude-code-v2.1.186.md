# Claude Code v2.1.186

> 작성일: 2026-06-23

---

# 📋 요약본

## 🎉 신기능 (6건)
- **`claude mcp login`/`logout`** — `/mcp` 인터랙티브 메뉴를 열지 않고 CLI에서 MCP 서버를 인증/로그아웃한다. `--no-browser` stdin 리다이렉트를 지원해 SSH 환경에서도 인증 완료 가능.
- **`/workflows` 상태 필터** — agent 상세 뷰에서 `f` 키로 상태별 필터링 추가.
- **`/plugin` Skills 섹션** — Installed 탭에 "Skills" 섹션 추가.
- **`teammateMode: "iterm2"` 설정** — iTerm2 teammate 모드 추가. auto 모드가 `it2` CLI를 찾지 못하면 경고를 띄운다.
- **`/login` AWS 자격증명 갱신** — `awsAuthRefresh` 설정 시 "Claude Platform on AWS - refresh credentials" 옵션 제공.
- **`!` bash 명령 자동 응답** — `!` bash 명령 출력에 Claude가 자동으로 응답한다. `"respondToBashCommands": false`로 기존의 컨텍스트 전용 동작을 유지할 수 있다.

## 🛠️ 개선/수정 (27건)
- **슬립 복귀 후 스트리밍 실패** — 절전에서 깨어난 뒤 "Content block not found"/JSON 파싱 오류로 스트리밍 요청이 실패하던 문제 수정.
- **서브에이전트 스크롤 위치 누출** — 종료 시 서브에이전트 트랜스크립트 스크롤 위치가 메인 트랜스크립트로 번지던 문제 수정.
- **백그라운드 작업 미리보기 깜빡임** — 에이전트 plan 로드 전 원시 도구명이 잠깐 노출되던 문제 수정.
- **Chrome 탭 그룹 격리** — 동시 CLI 세션에서 in-product 권한 게이트가 꺼졌을 때 탭 그룹 격리가 적용되지 않던 문제 수정.
- **백그라운드 세션 recap 중복** — recap이 중복되던 문제 수정. 이제 에이전트의 턴 종료 요약이 recap 줄로 표시된다.
- **백그라운드 세션 화면 잔상** — `claude agents`에서 세션을 열 때 이전 화면이 뒤에 남던 문제 수정.
- **`Agent(type)` 규칙 미적용** — 이름 있는 서브에이전트 spawn에 `Agent(type)` deny 규칙과 `Agent(x,y)` 허용 타입 제한이 적용되지 않던 문제 수정.
- **Esc/Ctrl+C 무응답** — 메인 턴 종료 후 백그라운드 에이전트가 실행 중일 때 Esc/Ctrl+C가 반응하지 않던 문제 수정.
- **권한 프롬프트 번호 정렬 오류** — 옵션 텍스트가 넘칠 때 번호가 어긋나던 문제 수정.
- **완료된 서브에이전트 `x` 미해제** — agent 패널에서 완료된 서브에이전트에 `x`를 눌러도 닫히지 않던 문제 수정.
- **잘못된 "MCP server disconnected" 알림** — 구버전 세션 재개 시 의도적으로 폐기된 도구에 대해 오해를 부르는 알림이 뜨던 문제 수정.
- **`/plugin` Installed "more above" 표시** — 이미 맨 위로 스크롤했는데도 "more above" 표시가 뜨던 문제 수정.
- **`~~취소선~~` 렌더링** — 어시스턴트 메시지에서 틸드가 그대로 보이던 문제를 수정, 취소선으로 렌더링.
- **`--tools` 게이트 우회** — 콜드 첫 실행 시 플래그 로드 전 feature-gated 도구가 빠져나가던 문제 수정.
- **`claude agents` 오래된 "needs input"** — 응답 후에도 백그라운드 작업 상태가 낡은 "needs input"으로 표시되던 문제 수정.
- **다크 테마 깜빡임** — 라이트 터미널에서 `claude agents`로 세션을 열 때 다크 테마가 번쩍이던 문제 수정.
- **마우스 선택 텍스트 잔류** — `claude agents`에서 삭제 후에도 선택 강조가 남던 문제 수정.
- **세션 비용 미표시** — 사용량 기반 Enterprise·Team 구독자에게 세션 비용이 표시되지 않던 문제 수정.
- **agent teams `--effort` 상속** — tmux/pane 백엔드로 spawn된 teammate가 리더의 `--effort` 레벨을 상속하도록 수정.
- **Workflow `agent({schema})` 무한 루프** — 스키마 검증 반복 실패 시 무한 반복하던 것을 5회 시도 후 중단하도록 수정.
- **`claude mcp get`/`remove` 개선** — 오타 시 가장 가까운 설정 서버명을 제안하고 긴 서버 목록을 잘라 표시.
- **메모리 개선** — `MEMORY.md` 인덱스가 크기 한계에 가까워지면 컴팩션하도록 에이전트에 리마인드.
- **스킬 frontmatter 개선** — `display-name`, `default-enabled`, `fallback`, `metadata.*` 키가 kebab-case·snake_case·camelCase를 모두 허용.
- **잘못된 `SKILL.md` frontmatter 처리** — YAML이 깨져도 조용히 실패하지 않고 빈 메타데이터로 본문을 로드.
- **`CLAUDE_CODE_MAX_RETRIES` 상한** — 최대 15로 제한. 무인 세션은 `CLAUDE_CODE_RETRY_WATCHDOG` 사용 권장.
- **백그라운드 서브에이전트 권한 프롬프트** — 자동 거부 대신 메인 세션에 권한 프롬프트를 노출한다. 어느 에이전트의 요청인지 표시되며 Esc는 해당 도구만 거부.
- **`/review <pr>` 엔진 변경** — `/code-review medium`과 동일한 리뷰 엔진을 사용.

## 🔑 이번 버전의 핵심 키워드
**"백그라운드 에이전트 안정화와 MCP CLI 인증"** — 다수의 `claude agents`/백그라운드 세션 버그를 잡고, MCP 서버를 CLI에서 직접 인증·관리할 수 있게 됐다.

---

# 📜 원문 (한글 번역본)

> 원문 ChangeLog를 원래 순서 그대로 한 줄도 빠짐없이 번역한 문서입니다.

- 인터랙티브 `/mcp` 메뉴를 열지 않고 CLI에서 MCP 서버를 인증하는 `claude mcp login <name>` 과 `claude mcp logout <name>` 추가. SSH로 인증을 완료할 수 있도록 `--no-browser` stdin 리다이렉트 지원.
- `/workflows` agent 상세 뷰에 상태 필터링(`f` 키) 추가.
- `/plugin` Installed 탭에 "Skills" 섹션 추가.
- `teammateMode: "iterm2"` 설정 추가. auto 모드가 `it2` CLI를 찾지 못하면 경고를 표시.
- `awsAuthRefresh`가 설정된 경우 `/login`에 "Claude Platform on AWS - refresh credentials" 옵션 추가.
- 이제 `!` bash 명령이 그 출력에 Claude가 자동으로 응답하도록 트리거한다. 기존의 컨텍스트 전용 동작을 유지하려면 settings.json에 `"respondToBashCommands": false`를 설정.
- 머신이 절전에서 깨어난 뒤 스트리밍 요청이 "Content block not found" 또는 JSON 파싱 오류로 실패하던 문제 수정.
- 종료 시 서브에이전트 트랜스크립트 스크롤 위치가 메인 트랜스크립트로 번지던 문제 수정.
- 에이전트의 plan이 로드되기 전 백그라운드 작업 미리보기에 원시 도구명이 깜빡이던 문제 수정.
- 동시 CLI 세션에서 in-product 권한 게이트가 꺼졌을 때 Chrome 탭 그룹 격리가 적용되지 않던 문제 수정.
- 백그라운드 세션 recap이 중복되던 문제 수정. 이제 에이전트 자신의 턴 종료 요약이 recap 줄로 표시된다.
- `claude agents`에서 백그라운드 세션을 열 때 이전 화면이 뒤에 칠해진 채 남던 문제 수정.
- 이름 있는 서브에이전트 spawn에 대해 `Agent(type)` deny 규칙과 `Agent(x,y)` 허용 타입 제한이 적용되지 않던 문제 수정.
- 메인 턴이 끝난 뒤 백그라운드 에이전트가 아직 실행 중일 때 Esc와 Ctrl+C가 반응하지 않던 문제 수정.
- 옵션 텍스트가 넘칠 때 권한 프롬프트의 옵션 번호가 어긋나던 문제 수정.
- agent 패널에서 완료된 서브에이전트에 `x`를 눌러도 닫히지 않던 문제 수정.
- 구버전 세션 재개 시 의도적으로 폐기된 도구에 대해 오해를 부르는 "MCP server disconnected" 알림이 뜨던 문제 수정.
- 이미 맨 위로 스크롤한 상태인데도 `/plugin` Installed에 "more above" 표시가 뜨던 문제 수정.
- 어시스턴트 메시지에서 `~~strikethrough~~`가 취소선으로 렌더링되지 않고 틸드가 그대로 보이던 문제 수정.
- 콜드 첫 실행 시 플래그가 로드되기 전 `--tools`가 feature-gated 도구를 통과시키던 문제 수정.
- 답변 후에도 `claude agents`의 백그라운드 작업 상태가 낡은 "needs input" 메시지를 표시하던 문제 수정.
- 라이트 터미널에서 `claude agents`로 백그라운드 세션을 열 때 발생하던 다크 테마 깜빡임 문제 수정.
- `claude agents`에서 마우스로 선택한 텍스트를 삭제한 뒤에도 강조가 남던 문제 수정.
- 사용량 기반 Enterprise 및 Team 구독자에게 세션 비용이 표시되지 않던 문제 수정.
- agent teams: tmux/pane 백엔드로 spawn된 teammate가 이제 리더의 `--effort` 레벨을 상속한다.
- Workflow `agent({schema})` 서브에이전트가 스키마 검증 실패를 반복할 때 영원히 루프하지 않고 5회 시도 후 중단하도록 수정.
- `claude mcp get`과 `claude mcp remove`를 개선: 오타 시 가장 가까운 설정 서버명을 제안하고 긴 서버 목록을 잘라 표시.
- 메모리 개선: `MEMORY.md` 인덱스가 크기 한계에 가까워지면 에이전트에게 컴팩션하도록 리마인드.
- 스킬 frontmatter 개선: `display-name`, `default-enabled`, `fallback`, `metadata.*` 키가 이제 kebab-case, snake_case, camelCase를 모두 허용.
- 잘못된 `SKILL.md` YAML frontmatter 처리 개선: 조용히 실패하는 대신 빈 메타데이터로 스킬 본문을 로드.
- `CLAUDE_CODE_MAX_RETRIES`를 최대 15로 제한하도록 변경. 무인 세션에서는 대신 `CLAUDE_CODE_RETRY_WATCHDOG`를 사용.
- 백그라운드 서브에이전트가 자동 거부하는 대신 메인 세션에 권한 프롬프트를 노출하도록 변경. 어느 에이전트가 요청하는지 다이얼로그에 표시되며 Esc는 해당 도구만 거부.
- `/review <pr>`가 `/code-review medium`과 동일한 리뷰 엔진을 사용하도록 변경.

---

## 🎯 챌린지

이번 버전에서 내 환경에 적용해볼 만한 항목입니다.

### 1. `respondToBashCommands` 동작 명시
- **파일**: `/Users/leeseonro/.claude/settings.json`
- **근거**: 이번 버전부터 `!` bash 명령 출력에 Claude가 자동 응답한다(기본 `true`). 당신은 bash를 자주 쓰고 `PreToolUse` Bash hook(`deploy-guard.sh`)까지 걸려 있어, 모든 출력에 자동 응답이 붙으면 토큰·노이즈가 늘 수 있다. 기존의 컨텍스트 전용 동작을 원하면 `"respondToBashCommands": false`를 명시한다.
- **난이도**: ★☆☆ (약 5분)

### 2. 무인 cron 세션에 `CLAUDE_CODE_RETRY_WATCHDOG` 적용
- **파일**: `claude-changelog-sync` cron 실행 래퍼 스크립트(환경변수 export 지점)
- **근거**: 이번 버전이 `CLAUDE_CODE_MAX_RETRIES`를 15로 제한하고 무인 세션에는 `CLAUDE_CODE_RETRY_WATCHDOG`를 권장한다. 당신은 매일 08:00 cron으로 무인 `claude -p`를 돌리므로, 단순 재시도 상한 대신 watchdog를 켜면 hang·일시 오류에서 더 안정적으로 복구된다.
- **난이도**: ★★☆ (약 10~15분)

### 3. `MEMORY.md` 인덱스 컴팩션
- **파일**: `/Users/leeseonro/.claude/MEMORY.md`
- **근거**: 이번 버전이 인덱스가 크기 한계에 가까워지면 컴팩션하라고 리마인드하는 동작을 추가했다. 현재 MEMORY.md 항목이 길어지고 있어, 중복·만료 항목을 미리 정리하면 매 세션 로드되는 컨텍스트를 줄일 수 있다.
- **난이도**: ★★☆ (약 15분)
