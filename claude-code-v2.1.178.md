# Claude Code v2.1.178

> 작성일: 2026-06-16

---

# 📋 요약본

## 🎉 신기능 (3건)
- **`Tool(param:value)` 권한 규칙 문법** — 도구 입력 파라미터 단위로 권한을 매칭한다. `*` 와일드카드 지원. 예: `Agent(model:opus)` 로 Opus 서브에이전트만 차단 가능.
- **중첩 `.claude/skills` 자동 로드** — 작업 중인 디렉터리의 중첩 스킬 디렉터리에서 스킬이 자동 로드된다. 이름 충돌 시 중첩 스킬은 `<dir>:<name>` 형식으로 표시되어 양쪽 모두 사용 가능.
- **중첩 `.claude/` 우선순위 규칙** — agent / workflow / output-style 이름 충돌 시 작업 디렉터리에 가장 가까운 것이 이긴다. 프로젝트 범위 workflow 저장은 가장 가까운 기존 `.claude/workflows/` 에 저장.

## 🛠️ 개선/수정 (19건)
- **Auto mode 강화** — 서브에이전트 스폰을 실행 전 classifier 가 평가. 차단된 동작을 서브에이전트가 우회하던 허점을 막음.
- **`/doctor` 개선** — 모든 섹션에 일관된 flat tree 레이아웃, 명확한 상태 아이콘, 커맨드명 하이라이트.
- **Skill listing truncation 경고 개선** — 잘려나간 스킬 description 개수를 명시.
- **Workflow 키워드 트리거 정밀화** — 보라색 shimmer 하이라이트, `"run a workflow"` / `"workflow:"` 같은 명시적 표현에만 반응. 단어가 우연히 포함된 경우는 무시.
- **Remote Control 에러 메시지 개선** — 연결 실패 시 footer 에 빨간 `/rc failed` 표시 유지. "not yet enabled" 에러는 gate / check 실패 / 만료된 entitlement / 조직 정책 중 어느 것인지 명시.
- **`/bug` 제출 강화** — 설명 입력 필수. 모델 거부 텍스트가 GitHub issue 제목이 되지 않음.
- **OOM 크래시 수정** — 부모 프로세스로부터 상속된 stale websocket / OAuth file descriptor 환경변수로 인한 CLI 크래시 해결.
- **Claude in Chrome 무음 실패 수정** — OAuth 토큰이 Claude Code 로그인과 다른 계정일 때 조용히 실패하던 문제 수정.
- **중첩 스킬 권한 프롬프트 차단 수정** — 디렉터리 한정 이름을 가진 중첩 스킬이 non-interactive 실행에서 권한 프롬프트로 차단되던 문제 수정.
- **서브에이전트 다중 이슈 수정** — 트랜스크립트에 tool result 와 라이브 진행 표시, 턴 종료 중 보낸 메시지 누락 방지, ctrl+b 백그라운드 전환 시 재시작되지 않음.
- **`claude agents` worker 401 수정** — `ANTHROPIC_BASE_URL` + `ANTHROPIC_AUTH_TOKEN` 환경에서 daemon 시작 시 `401 Invalid bearer token` 오류 해결.
- **Compaction `--fallback-model` 수정** — overload 또는 모델 가용성 오류 시 설정된 fallback 모델 체인으로 fallback.
- **외부 자격증명 갱신 후 인증 오류 수정** — 세션 외부에서 갱신된 credential 이 stale cached request configuration 때문에 인증 오류를 계속 내던 문제 해결.
- **`/bg` 백그라운드 세션 무한 "Working" 수정** — 턴 종료 후 `/bg` 또는 `←←` 로 생성된 백그라운드 세션이 에이전트 목록에서 영원히 "Working" 으로 표시되던 문제 수정.
- **`CLAUDE_CODE_PLUGIN_KEEP_MARKETPLACE_ON_FAILURE=1` 수정** — 이 플래그가 신규 마켓플레이스 설치의 clone 을 막던 문제 해결.
- **서브에이전트 `disallowedTools` MCP 서버 스펙 수정** — `mcp__server`, `mcp__server__*`, `mcp__*` 가 조용히 무시되던 문제 해결.
- **Vim 모드 undo `u` 수정** — NORMAL/VISUAL 모드 명령이 빠르게 연속될 때 단일 undo 로 합쳐지지 않고 하나씩 되돌려짐.
- **커스텀 URI 스킴 statusline 링크 수정** — `claude agents` 에서 `vscode://` 등 커스텀 스킴 링크 클릭 시 열리지 않던 문제 해결.
- **[VSCode] CJK IME Esc 처리 수정** — CJK IME 후보창을 Esc 로 닫을 때 실행 중이던 Claude 작업이 취소되던 문제 해결.

## 🔑 이번 버전의 핵심 키워드
**"파라미터 단위 권한 + 중첩 `.claude/` 정식 지원"** — 권한 규칙이 도구 인자까지 매칭 가능해졌고, 중첩 스킬·에이전트·워크플로우가 1급 시민으로 승격됐다.

---

# 📜 원문 (한글 번역본)

> 원문 ChangeLog를 원래 순서 그대로 한 줄도 빠짐없이 번역한 문서입니다.

- 도구의 입력 파라미터를 매칭하는 `Tool(param:value)` 문법을 권한 규칙에 추가 (`*` 와일드카드 지원). 예: `Agent(model:opus)` 로 Opus 서브에이전트 차단.
- 중첩된 `.claude/skills` 디렉터리의 스킬이 해당 위치에서 작업할 때 자동 로드. 이름 충돌 시 중첩 스킬은 `<dir>:<name>` 형식으로 노출되어 양쪽 모두 사용 가능.
- 중첩된 `.claude/` 디렉터리: agent, workflow, output-style 이 이름 충돌 시 작업 디렉터리에 가장 가까운 것이 이김. 프로젝트 범위 workflow 저장은 가장 가까운 기존 `.claude/workflows/` 를 대상으로 함.
- Auto mode 개선: 서브에이전트 스폰을 실행 전 classifier 가 평가하여, 서브에이전트가 차단된 동작을 검토 없이 요청하던 허점을 막음.
- `/doctor` 개선: 모든 섹션에 일관된 flat tree 레이아웃, 명확한 섹션 상태 아이콘, 커맨드명 하이라이트 적용.
- Skill listing 잘림 경고 개선: 영향받은 스킬 description 개수를 표시.
- Workflow 프롬프트 키워드를 보라색 shimmer 하이라이트로 변경. `"run a workflow"` 또는 `"workflow:"` 같은 명시적 표현에만 트리거되며, 단어 언급만으로는 발동하지 않음.
- Remote Control 에러 메시지 개선: 연결 실패 시 footer 에 빨간색 `/rc failed` 표시가 유지되고, "not yet enabled" 에러는 gate, check 실패, stale entitlement, 조직 정책 중 어느 원인인지 설명.
- `/bug` 는 제출 전 description 입력을 요구하며, 모델 거부 텍스트를 GitHub issue 제목으로 사용하지 않음.
- 부모 프로세스로부터 상속된 stale websocket / OAuth file descriptor 환경변수로 인해 CLI 가 크래시(out-of-memory)되던 문제 수정.
- OAuth 토큰이 Claude Code 로그인과 다른 계정에 속할 때 Claude in Chrome 이 조용히 연결 실패하던 문제 수정.
- 디렉터리 한정 이름을 가진 중첩 `.claude/skills` 스킬이 non-interactive 실행에서 권한 프롬프트로 차단되던 문제 수정.
- 여러 서브에이전트 문제 수정: 서브에이전트 트랜스크립트에서 tool result 와 live progress 가 표시되고, 턴 종료 중 보낸 메시지가 더 이상 누락되지 않으며, 실행 중인 서브에이전트를 백그라운드로 보낼 때(ctrl+b) 처음부터 재시작되지 않음.
- 커스텀 API gateway 를 `ANTHROPIC_BASE_URL` 와 `ANTHROPIC_AUTH_TOKEN` 으로 설정한 shell 에서 daemon 을 시작했을 때 `claude agents` worker 가 `401 Invalid bearer token` 으로 실패하던 문제 수정.
- Compaction 이 `--fallback-model` 을 따르지 않던 문제 수정: overload 나 모델 가용성 오류 시 설정된 fallback 모델 체인으로 fallback 함.
- 세션 외부에서 자격증명을 갱신한 뒤에도 stale cached request configuration 때문에 모델 요청이 인증 오류로 계속 실패하던 문제 수정.
- 턴이 끝난 후 `/bg` 또는 `←←` 로 생성된 백그라운드 세션이 에이전트 목록에서 영원히 "Working" 으로 표시되던 문제 수정.
- `CLAUDE_CODE_PLUGIN_KEEP_MARKETPLACE_ON_FAILURE=1` 이 신규 마켓플레이스 설치의 cloning 을 막던 문제 수정.
- 서브에이전트 `disallowedTools` 의 MCP 서버 레벨 스펙(`mcp__server`, `mcp__server__*`, `mcp__*`)이 조용히 무시되던 문제 수정.
- Vim 모드 undo 수정: `u` 가 빠르게 연속된 NORMAL/VISUAL 모드 명령들을 단일 undo step 으로 합치지 않고 하나씩 되돌림.
- `claude agents` 에서 커스텀 URI 스킴(예: `vscode://`)을 가진 statusline 링크가 클릭해도 열리지 않던 문제 수정.
- [VSCode] CJK IME 후보창을 Esc 로 닫을 때 실행 중이던 Claude 작업이 취소되던 문제 수정.

---

## 🎯 챌린지

이번 버전에서 내 환경에 적용해볼 만한 항목입니다.

### 1. `Agent(model:opus)` 권한 규칙으로 Karpathy 가이드라인 #5 강제
- **파일**: `~/.claude/settings.json`
- **근거**: CLAUDE.md 가이드라인 #5 는 "서브에이전트는 Sonnet 기본, Opus 는 아키텍처 결정·복잡 디버깅에만" 이다. 지금까지 이 규칙은 수동 준수였지만, 이번 버전의 `Tool(param:value)` 문법으로 강제 가능. `permissions.ask` 에 `Agent(model:opus)` 를 추가하면 Opus 서브에이전트 호출 시 확인 프롬프트가 떠서 의도치 않은 라우팅을 차단한다.
- **난이도**: ★☆☆ (약 5분)

### 2. agent-infra 레포에 중첩 `.claude/skills/` 디렉터리 검토
- **파일**: `~/agent-infra/.claude/skills/` (신규)
- **근거**: agent-infra 는 deploy-guard, persona-drift-warn 등 인프라 전용 hook 을 관리하는 레포다. 인프라 검증·점검 스킬을 글로벌 `~/.claude/skills/` 에 두는 대신 레포 안 중첩 디렉터리에 두면, agent-infra 작업 시에만 자동 로드되고 다른 프로젝트의 스킬 목록을 오염시키지 않는다. 이번 버전부터 정식 지원됨.
- **난이도**: ★★☆ (약 15분)

### 3. `/doctor` 실행으로 hook·플러그인 설정 점검
- **파일**: 없음 (진단만)
- **근거**: 현재 settings.json 은 8개 hook 과 5개 플러그인을 사용 중인데, 이번 버전의 `/doctor` 는 flat tree 와 상태 아이콘이 개선됐다. token-optimizer, superpowers 등 외부 마켓플레이스 플러그인이 정상 등록됐는지, hook 스크립트 경로가 살아있는지 한 번에 확인 가능.
- **난이도**: ★☆☆ (약 5분)

### 4. workflow 트리거 표현 정리
- **파일**: `~/.claude/CLAUDE.md` 의 페르소나 라우팅 섹션
- **근거**: 이번 버전부터 workflow 는 `"run a workflow"` / `"workflow:"` 같은 명시적 표현에만 트리거된다. CLAUDE.md 페르소나 라우팅에 "워크플로우 다중 에이전트 실행이 필요하면 `'워크플로우 실행'` 또는 `'run a workflow'` 라고 명시" 같은 한 줄을 추가하면, 의도치 않은 워크플로우 발동을 피하면서 필요할 때만 정확히 호출 가능.
- **난이도**: ★☆☆ (약 5분)
