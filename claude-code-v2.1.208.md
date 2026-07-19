# Claude Code v2.1.208

> 작성일: 2026-07-19

---

# 📋 요약본

## 🎉 신기능 (4건)
- **스크린 리더 모드** — 스크린 리더 사용자를 위한 옵트인 평문 렌더링. `claude --ax-screen-reader` 실행, `CLAUDE_AX_SCREEN_READER=1` 설정, 또는 settings에 `"axScreenReader": true` 추가로 켠다.
- **`vimInsertModeRemaps` 설정** — vim 모드에서 `jj` 같은 두 글자 insert-mode 시퀀스를 Escape로 매핑한다.
- **`CLAUDE_CODE_PROCESS_WRAPPER`** — agent view와 백그라운드 서비스가 Claude Code의 모든 self-spawn을 지정된 래퍼 실행파일을 거치도록 강제해 사내 런처를 준수한다.
- **다중 선택 메뉴 마우스 클릭 지원** — 전체화면 모드에서 다중 선택 메뉴와 "Other" 입력 행을 마우스로 클릭할 수 있다.

## 🛠️ 개선/수정 (41건)
- **백그라운드 세션 안정성** — 업데이트로 바이너리가 교체된 뒤 attach가 영구 실패("Couldn't start the background daemon")하던 문제, 전달 실패 시 입력한 답장이 유실되던 문제, 구버전 데몬이 신버전 워커를 구버전 바이너리로 재시작하던 문제를 수정.
- **컨텍스트 창 거짓 100%** — 자동 업데이트 후 컨텍스트 창(과 auto-compact 표시)이 잠시 200k로 리셋되며 장기 세션 재개 시 "100% 사용" 오표기되던 문제 수정.
- **`claude -p` / stream-json** — 대용량 응답 파이핑 시 출력이 잘리고 result 메시지가 누락되던 문제, Windows SDK 호스트의 빈 CRLF·공백줄이 세션을 죽이던 문제, 비문자열 `set_model` 페이로드로 세션이 무한 대기하던 문제 수정.
- **여러 메모리 누수 수정** — MCP stdio stderr(서버당 최대 64MB), LSP 문서 무한 유지(이제 50개 LRU 상한), 백그라운드 후 async hook 출력, headless/SDK 세션의 tool-result 무한 증가, agent view의 붙여넣기 이미지 유지, 극단적으로 긴 단일 라인 읽기 시 메모리 폭증 수정.
- **성능** — permission deny/ask 규칙이 많은 세션의 턴당 지연을 규칙 매처 캐싱으로 제거, MCP 도구가 많은 print/SDK 세션의 도구 라운드 최대 7배 가속, 세션 트랜스크립트 크기 최대 79배 축소, edit read 캐시 16MB 상한.
- **도구 수정** — 읽은 뒤 수정됐지만 대상 텍스트가 여전히 유일하게 매칭되면 Edit이 실패하던 문제, Read의 빈 파일 오표기, Grep의 잘못된 정규식·페이지네이션 카운트, Glob의 널바이트 처리 수정.
- **`CLAUDE_CODE_MAX_OUTPUT_TOKENS`** — `1e6` 같은 과학적 표기 값이 가수(`1`)만 먹던 문제 수정.
- **대용량 마크다운 테이블** — 렌더링이 멈추거나 메모리를 과다 사용하던 문제 수정. 200행 초과 테이블은 첫 200행 + "… N more rows" 표시.
- **Bedrock** — SSO 리전이 Bedrock 리전과 다른 AWS SSO 프로필 인증 실패(2.1.207 회귀), 게이트웨이 응답 변환 시 오해 소지 있는 스트리밍 에러 수정.
- **파괴적 삭제** — `$(…)`·백틱·`<(…)`를 포함한 명령의 `rm -rf ~` 류가 `--dangerously-skip-permissions`·auto 모드에서도 이제 프롬프트를 띄운다.
- **`/usage`·`/mcp`·`/release-notes`** — 캐시된 오래된 사용량 막대, placeholder 서버 재분류 실패, "Show all"이 전체 changelog를 이후 모든 요청 컨텍스트에 주입하던 문제 수정.
- **Agent 도구** — 서브에이전트 `tools` 목록이 전부 비면 도구 없이 실행되던 것을 인식 못 한 항목명을 짚는 명확한 에러로 변경.
- **`apiKeyHelper`** — 스크립트 실패가 일반 401 뒤에 ~10회 무음 재시도로 숨던 것을 3회 안에 스크립트 자체 에러로 표시.

## 🔑 이번 버전의 핵심 키워드
**"백그라운드 세션·메모리·성능 대청소"** — 장기·백그라운드 세션의 attach 실패, 메모리 누수, 턴당 지연을 광범위하게 잡은 안정화 릴리스.

---

# 📜 원문 (한글 번역본)

> 원문 ChangeLog를 원래 순서 그대로 한 줄도 빠짐없이 번역한 문서입니다.

- 스크린 리더 모드 추가: 스크린 리더 사용자를 위한 옵트인 평문 렌더링. `claude --ax-screen-reader` 실행, `CLAUDE_AX_SCREEN_READER=1` 설정, 또는 settings에 `"axScreenReader": true` 추가.
- `vimInsertModeRemaps` 설정 추가: vim 모드에서 `jj` 같은 두 글자 insert-mode 시퀀스를 Escape로 매핑.
- `CLAUDE_CODE_PROCESS_WRAPPER` 추가: agent view와 백그라운드 서비스가 모든 Claude Code self-spawn을 필수 래퍼 실행파일을 거쳐 실행해 사내 런처를 준수.
- 전체화면 모드의 다중 선택 메뉴와 "Other" 입력 행에 마우스 클릭 지원 추가.
- 지원 모델로 다시 전환한 뒤 fast mode가 꺼진 채 유지되던 문제 수정 — settings에서 켜져 있으면 이제 자동 복원.
- 백그라운드 에이전트에 입력한 답장이 전달 실패 시 유실되던 문제 수정 — 텍스트를 저장했다가 세션 재시작 시 전달.
- 실행 중이던 `claude agents` 프로세스가 기동된 바이너리를 업데이트가 교체한 뒤 백그라운드 세션 attach가 영구 실패("Couldn't start the background daemon")하던 문제 수정.
- CLI 자동 업데이트 후 컨텍스트 창(과 auto-compact 표시)이 잠시 200k로 리셋되어 장기 컨텍스트 세션 재개 시 거짓 "100% context used"를 유발하던 문제 수정.
- 요청 진행 중 서버가 HTTP/2 연결을 GOAWAY로 닫을 때 supervised·백그라운드 세션이 크래시하던 문제 수정.
- `claude -p`에서 대용량 응답을 파이핑할 때 stream-json/JSON 출력이 잘리고 result 메시지가 누락되던 문제 수정.
- `CLAUDE_CODE_MAX_OUTPUT_TOKENS` 등 env 변수가 과학적 표기 값의 가수만 조용히 사용하던 문제 수정 (`1e6`이 `1`이 됨).
- 매우 큰 마크다운 테이블이 렌더링을 멈추거나 메모리를 과다 사용하던 문제 수정. 200행 초과 테이블은 첫 200행과 "… N more rows" 안내를 표시.
- 읽은 뒤 수정된 파일에서 대상 텍스트가 여전히 유일하게 매칭되는데도 Edit 도구가 실패하던 문제 수정.
- Read가 빈 파일을 "shorter than offset"으로 보고하던 문제, Grep이 잘못된 정규식에 조용히 "No files found"를 반환하던 문제, 페이지네이션 시 Grep count 모드가 총계를 과소 보고하던 문제, 패턴·경로·작업 디렉터리에 널바이트가 포함되면 Glob이 불명확한 에러로 크래시하던 문제 수정.
- `apiKeyHelper` 스크립트 실패가 일반 401 뒤에 ~10회 무음 재시도로 숨던 문제 수정 — 이제 스크립트 자체 에러가 3회 안에 표시.
- 게이트웨이가 응답을 변환할 때 Bedrock 스트리밍 요청이 오해 소지 있는 "Truncated event message received"로 실패하던 문제 수정 — 이제 에러가 content-type을 명시하고 프록시를 지목.
- 브라우저 실행 실패 시 `/upgrade`가 업그레이드 URL 대신 로그인 플로우를 표시하던 문제 수정.
- Windows 스타일 SDK 호스트의 빈 CRLF·공백만 있는 줄에서 stream-json 입력이 세션을 죽이던 문제 수정.
- `control_request`가 비문자열 `set_model` 페이로드를 실을 때 headless stream-json 세션이 영구 대기하던 문제 수정 — 이제 CLI가 에러 응답으로 답함.
- 세션 재개 시 "No completion record was found" 알림이 반복되던 문제 수정 — 고아 백그라운드 작업이 이제 단일 요약으로 합쳐짐.
- 터미널 호스팅 세션에 attach한 Remote Control 클라이언트가 작업이 시작·종료될 때까지 백그라운드 에이전트와 워크플로 진행을 보지 못하던 문제 수정.
- 서브에이전트의 `tools` 목록이 아무것도 안 남을 때 Agent 도구가 도구 없이 실행되던 문제 수정 — 이제 인식 못 한 항목명을 명시하는 명확한 에러를 반환.
- `/usage`가 더 최신 데이터 위에 오래된 캐시 막대를 표시하던 문제와 `/mcp`가 config 편집 후 placeholder 서버를 재분류하지 않던 문제 수정.
- 실행 중인 백그라운드 작업이 있는 유휴 세션에서 SDK 호스트(예: Claude Desktop)의 "Change directory"가 "A turn is in progress"로 실패하던 문제 수정.
- 워크플로 저장 대화상자가 user-scope 저장 시 `CLAUDE_CONFIG_DIR` 위치 대신 `~/.claude/workflows/`를 표시하던 문제 수정.
- `/release-notes`가 조회한 노트를 모델 컨텍스트에 추가하던 문제 수정 — 이전엔 "Show all"이 전체 changelog를 이후 모든 요청에 주입.
- agent view에서 붙여넣은 이미지가 peek 답장 전송 후 화면 수명 동안 유지되던 메모리 누수 수정.
- 클라이언트 attach 전 플러그인 새로고침이 실행되면 SDK 세션이 initialize 요청으로 정의된 에이전트를 잃던 문제 수정.
- 장기 세션의 여러 메모리 누수 수정: MCP stdio 서버 stderr가 서버당 최대 64MB까지 누적되던 문제, LSP 문서가 무한 열려 있던 문제(이제 50개 상한 LRU), 백그라운드 후 async hook 출력 유지, headless/SDK 세션의 대용량 tool-result 페이로드에 의한 무한 증가.
- offset/limit로 극단적으로 긴 단일 라인 파일을 읽을 때 메모리가 폭증하던 문제 수정 — 이제 라인 전체를 로드하지 않고 깔끔한 에러를 반환.
- permission deny/ask 규칙이 많은 세션의 턴당 수 초 지연 수정 — 규칙 매처를 이제 한 번만 컴파일해 캐시.
- 에이전트 작업 목록이 갱신되는 동안 입력 반응성 개선 — 작업 갱신이 더 이상 전체 UI를 다시 렌더링하지 않음.
- 도구가 많은 print/SDK 세션의 tool-pool 조립을 캐싱해 tool-call당 CPU 오버헤드 감소(높은 도구 수에서 tool 라운드 최대 7배 빠름).
- file edit read 캐시를 최대 1,000개 전체 파일 고정 대신 16MB로 제한해 메모리 사용 감소.
- superseded된 file-history 백업을 정리해 세션 트랜스크립트 크기를 감소(edit-heavy 세션에서 최대 79배)하고 checkpoint 디스크 사용을 제한.
- 대용량 대화에서 파생된 백그라운드 에이전트·fork가 있는 세션 재개 시 메모리 사용 감소.
- 완료된 백그라운드 에이전트가 종료 즉시 사라지지 않고 정리 전까지 `/tasks`에 계속 표시됨.
- 정지된 백그라운드 에이전트에 attach하면 빈 "Session is starting" 화면 대신 세션 준비 중에도 트랜스크립트를 즉시 표시.
- 백그라운드 세션: 구버전 데몬이 신버전이 생성한 워커를 구버전 바이너리로 조용히 재시작하지 않음.
- Agent view: Ctrl+X가 이제 이름이 바뀐 브랜치 worktree를 삭제하고, 푸시 안 된 커밋은 절대 파괴하지 않으며, worktree를 유지하면 세션 행도 유지하고, 재사용된 worktree 이름은 현재 base로 리셋.
- `$(…)`·백틱·`<(…)`를 포함한 명령의 파괴적 삭제(예: `rm -rf ~`)가 이제 `--dangerously-skip-permissions`·auto 모드에서도 평문형과 동일하게 프롬프트를 띄움.
- `/install-github-app`과 `/mcp` 설정 메뉴가 이제 백그라운드 세션에서 열리지 않음.
- 빈 URL로 설정된 MCP 서버가 config 에러 대신 `/mcp`에서 "not configured"로 표시.
- 사용량 엔드포인트가 rate-limit될 때 `/usage`가 에러 화면 대신 "as of" 표기와 함께 마지막으로 알려진 사용량 막대를 표시.
- sso_region이 Bedrock 리전과 다른 AWS SSO 프로필에서 Bedrock 인증이 "Session token not found or invalid"로 실패하던 문제 수정(2.1.207 회귀).

---

## 🎯 챌린지

이번 버전에서 내 환경에 적용해볼 만한 항목입니다.

### 1. 커스텀 서브에이전트 `tools` frontmatter 오탈자 점검
- **파일**: `~/.claude/agents/*.md` (및 프로젝트 `.claude/agents/`)
- **근거**: 이번 버전은 서브에이전트 `tools` 목록이 전부 인식 불가일 때 "도구 없이 실행"되던 것을 인식 못 한 항목명을 짚는 에러로 바꿨다. `qa-agent`·`review-agent` 같은 커스텀 에이전트를 쓰므로, `tools` 항목에 오탈자가 있었다면 지금까지 조용히 무력화됐을 수 있다. 지금 목록을 훑어 도구명을 실제 이름과 대조한다.
- **난이도**: ★★☆ (약 15분)

### 2. `CLAUDE_CODE_MAX_OUTPUT_TOKENS` 과학적 표기 점검
- **파일**: `~/.claude/settings.json`, 스킬·cron 스크립트
- **근거**: `1e6` 같은 과학적 표기 값이 가수(`1`)만 먹던 버그가 이번에 수정됐다. `claude-changelog-sync`가 `claude -p`를 cron으로 돌리므로, 이 env를 어딘가 지수 표기로 넣었다면 지금까지 사실상 1토큰으로 잘렸을 수 있다. `grep -rn CLAUDE_CODE_MAX_OUTPUT_TOKENS`로 확인하고 정수로 바꾼다.
- **난이도**: ★☆☆ (약 5분)

### 3. `vimInsertModeRemaps`로 `jj` → Esc 매핑 (vim 모드 사용 시)
- **파일**: `~/.claude/settings.json`
- **근거**: 이번 버전에 추가된 `vimInsertModeRemaps`로 insert 모드에서 `jj` 같은 두 글자 시퀀스를 Escape에 매핑할 수 있다. vim 모드를 쓴다면 insert→normal 전환을 홈로우에서 끝낼 수 있어 손 이동이 준다.
- **난이도**: ★☆☆ (약 5분)
