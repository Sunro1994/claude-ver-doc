# Claude Code v2.1.212

> 작성일: 2026-07-19

---

# 📋 요약본

## 🎉 신기능 (6건)
- **`/fork` → 백그라운드 세션 복사 + `/subtask` 분리** — `/fork`가 이제 현재 대화를 새 백그라운드 세션(`claude agents`에 별도 행)으로 복사하고, 그동안 사용자는 계속 작업할 수 있다. 기존에 `/fork`가 띄우던 인-세션 서브에이전트는 `/subtask`로 이름이 바뀌었다.
- **`claude auto-mode reset`** — auto-mode 설정을 기본값으로 복원하는 명령. 확인 프롬프트가 뜨며 `--yes`로 건너뛸 수 있다.
- **WebSearch 세션 한도** — 세션당 WebSearch 호출 상한(기본 200)을 추가해 검색 무한 루프를 차단. `CLAUDE_CODE_MAX_WEB_SEARCHES_PER_SESSION`으로 조정.
- **서브에이전트 생성 한도** — 세션당 서브에이전트 생성 상한(기본 200)으로 위임 무한 루프를 차단. `CLAUDE_CODE_MAX_SUBAGENTS_PER_SESSION`으로 재정의, `/clear`로 리셋.
- **MCP 자동 백그라운드** — 2분 넘게 실행되는 MCP 도구 호출은 자동으로 백그라운드로 전환돼 세션이 계속 쓸 수 있게 된다. `CLAUDE_CODE_MCP_AUTO_BACKGROUND_MS`로 임계값 조정·비활성화.
- **`/resume` 세션 피커** — 에이전트 뷰에서 `/resume`를 입력하면 과거 세션(목록에서 삭제된 것 포함) 피커가 열리고, 선택한 세션을 백그라운드 세션으로 재개한다.

## 🛠️ 개선/수정 (17건)
- **플랜 모드 파일 수정 명령 무단 실행 수정** — `touch`·`rm` 등이 권한 프롬프트나 SDK `canUseTool` 콜백 없이 실행되던 문제.
- **worktree 심링크 탈출 수정** — 커밋된 `.claude/worktrees` 심링크를 따라가 레포 밖에 파일이 생성되던 문제.
- **hook 중단·오류 처리 수정** — 도구 실패/스트림 중간 완료 시 `continue:false` halt가 유실되고, hook 인프라 오류가 사용자 거부로 오표시되던 문제.
- **SIGTERM 프로세스 정리** — print/SDK 모드에서 Bash 프로세스 트리가 고아화되던 문제 → 이제 턴을 중단하고 트리를 종료하며 exit 143.
- **Windows 백그라운드 실행 수정** — Group Policy가 PowerShell 5.1을 막을 때 `/background`·`claude --bg`가 `uv_spawn` 오류로 실패하던 문제 → PowerShell 7 우선.
- **`/ultrareview` 다수 수정** — `#123`·`PR 123`·붙여넣은 URL 허용, 원격 존재 시 브랜치 fetch, `/clear` 후 과금 확인 누락, Desktop에서 레포 폴더 안내.
- **호스팅 세션 mTLS/CA/OAuth 시작 실패 수정** — 해당 전송 설정을 경고와 함께 무시.
- **세션 재개 관련 수정** — "File has not been read yet" 오탐, `ExitWorktree` 실패, 정지된 백그라운드 세션 재개 실패(이제 재개 또는 강제 재시작).
- **`/fork` 라이브-부모 보호 유실 수정** — state write 실패 후 보호가 상실되던 문제.
- **UI 렌더링 수정 모음** — plan-approval 푸터 분리, 웰컴 배너 폭, 좁은 레이아웃 diff 줄번호/마커, Ctrl+J 줄바꿈, 깨진 이모지 알림.
- **텔레메트리 수정** — OTLP chunked encoding에 대한 411/400 거부, `TRACEPARENT` 설정 시 `trace_id`/`span_id` 누락.
- **이미지 다수 대화 오류 수정** — 잘못된 "Request too large" 실패 + 실제 원인 설명 개선.
- **웹 검색/페치 안정성 개선** — 과부하 시 "API Error" 텍스트 오출력 수정, 529·rate-limit 재시도 백오프 추가.
- **프롬프트 캐싱·토큰 개선** — 게이트웨이 뒤 mid-conversation system 블록 동작, `SendMessage` 본문 중복 제거, cold-attach 시 트랜스크립트 즉시 표시.
- **Task 도구 `mode` 파라미터 폐기** — 이제 무시되며, 서브에이전트가 부모 세션의 권한 모드를 상속.
- **Enterprise `forceLoginMethod` 확대 적용** — VS Code·SDK·`setup-token`·`install-github-app` 로그인에도 강제.
- **동작 변경 모음** — 트랜스크립트에 reasoning effort 기록, headless/SDK `set_model` 턴 중간 적용, "Needs input" 상태 표시, 인증 패널 제목 변경, `/fork` 사본 이름 지정, `/btw`·`←` 힌트 개선, tmux 노트 정정.

## 🔑 이번 버전의 핵심 키워드
**"위임과 검색에 안전벨트를 채운 백그라운드 세션 릴리스"** — `/fork`가 백그라운드로 독립하고, 서브에이전트·WebSearch·MCP에 세션 한도가 붙어 무한 루프를 막는다.

---

# 📜 원문 (한글 번역본)

> 원문 ChangeLog를 원래 순서 그대로 한 줄도 빠짐없이 번역한 문서입니다.

- `/fork`가 이제 대화를 새 백그라운드 세션(`claude agents`에 자체 행)으로 복사하면서 사용자는 계속 작업할 수 있다. 기존에 띄우던 인-세션 서브에이전트는 이제 `/subtask`다.
- auto-mode 설정을 기본값으로 복원하는 `claude auto-mode reset`을 추가. 확인 프롬프트가 있으며 `--yes`로 건너뛸 수 있다.
- 검색 무한 루프를 막기 위해 세션 전체 WebSearch 도구 호출 한도(기본 200, `CLAUDE_CODE_MAX_WEB_SEARCHES_PER_SESSION`로 조정)를 추가.
- 위임 무한 루프를 막기 위해 세션당 서브에이전트 생성 상한(기본 200, `CLAUDE_CODE_MAX_SUBAGENTS_PER_SESSION`로 재정의)을 추가. `/clear`가 예산을 리셋한다.
- 2분 넘게 실행되는 MCP 도구 호출은 이제 자동으로 백그라운드로 이동해 세션을 계속 쓸 수 있게 한다. 임계값은 `CLAUDE_CODE_MCP_AUTO_BACKGROUND_MS`로 설정하거나 비활성화.
- 에이전트 뷰에서 `/resume`를 입력하면 이제 과거 세션 피커가 열린다 — 목록에서 삭제된 세션 포함 — 선택한 것을 백그라운드 세션으로 재개한다.
- 플랜 모드가 파일 수정 Bash 명령(예: `touch`, `rm`)을 권한 프롬프트나 SDK `canUseTool` 콜백 없이 자동 실행하던 문제 수정.
- worktree 생성이 레포에 커밋된 `.claude/worktrees` 심링크를 따라가 레포 밖에 파일을 생성할 수 있던 문제 수정.
- 도구가 실패하거나 스트림 중간에 완료될 때 `continue:false` hook의 halt가 유실되던 문제, 그리고 hook 인프라 오류가 사용자 거부로 잘못 보고되던 문제 수정.
- print/SDK 모드에서 실행 중인 Bash 도구 도중 SIGTERM이 명령의 프로세스 트리를 고아로 만들던 문제 수정. 이제 CLI가 턴을 중단하고 트리를 종료하며 143으로 종료한다.
- Group Policy가 PowerShell 5.1을 차단할 때 Windows에서 `/background`·`claude --bg`가 "EUNKNOWN: unknown error, uv_spawn"으로 실패하던 문제 수정. 데몬이 이제 PowerShell 7을 우선한다.
- 경로 자동완성 팝업이 열려 있는 동안 shell 모드(`!`)가 파일 경로를 포함한 명령을 실행하지 않던 문제 수정.
- 긴 거부 사유가 이모지 중간에서 잘릴 때 auto-mode 거부 알림이 깨진 문자로 렌더링되던 문제 수정.
- 확장 키 리포팅 터미널에서 에이전트 뷰 디스패치 입력창에 Ctrl+J가 줄바꿈을 삽입하지 않던 문제 수정. `?` 도움말 오버레이에 줄바꿈 단축키를 노출.
- `/ultrareview`가 `#123`, `PR 123`, 붙여넣은 PR URL 같은 PR 참조를 거부하던 문제 수정. 오류 힌트가 이제 실제로 입력한 명령 이름을 알려준다.
- `/ultrareview <branch>`가 원격에 존재하는 브랜치를 origin에서 fetch하지 않던 문제 수정. 오타 시 가장 가까운 브랜치 이름을 제안한다.
- `/clear` 이후 새 대화에서 `/ultrareview`가 과금 확인을 건너뛰던 문제 수정.
- Claude Desktop에서 `/ultrareview`의 "not a git repository" 오류가 이제 터미널 명령 대신 프로젝트의 레포지토리 폴더를 제안하도록 수정.
- 레포 설정이 mTLS 인증서, 추가 CA 번들, OAuth 스코프를 구성했을 때 호스팅(호스트 관리) 세션이 시작 시 실패하던 문제 수정. 이 전송 설정들은 이제 경고와 함께 무시된다.
- 세션 재개 전에 offset/limit로 읽은 파일을 편집할 때 발생하던 잘못된 "File has not been read yet" 오류 수정.
- print/SDK 모드에서 `--continue`/`--resume`로 세션을 재개한 뒤 `ExitWorktree`가 "no active EnterWorktree session"으로 실패하던 문제 수정.
- 실행 중간에 합류한 Remote Control 클라이언트에서 워크플로 에이전트 그리드가 계속 비어 있던 문제 수정.
- 스트리밍 모드 제어 요청이 핸들러 완료 전에 완료로 표시돼 세션 재시작 시 요청이 유실될 수 있던 문제 수정.
- `/fork`로 만든 백그라운드 세션이 state write 실패 후 라이브-부모 보호를 잃던 문제 수정.
- 에이전트 뷰에서 정지된 백그라운드 세션을 다시 여는 것이 조용히 실패하던 문제 수정 — 이제 세션을 재개하거나, 재개할 수 없는 이유를 보여주고 강제 재시작을 허용한다.
- 에이전트 팀: 세션 내에서 팀 초기화가 재실행될 때 정지 중인 팀원이 리더에게 중복 idle 알림을 보낼 수 있던 문제 수정.
- 파일 경로가 길 때 플랜 승인 대화상자 푸터가 "ctrl+g to edit in <editor>"를 갈라놓던 문제 수정.
- 전체화면 모드에서 폭+높이 동시 터미널 리사이즈 후 웰컴 배너가 이전 패널 폭을 유지하던 문제 수정.
- 좁은 레이아웃에서 diff 미리보기가 줄번호와 +/- 마커를 잃던 문제 수정.
- 부분 파일 읽기 후 @-멘션이 아무것도 첨부하지 않던 문제, 플러그인 삭제가 잘못된 마켓플레이스를 대상으로 하던 문제, 종료 코드 143에서의 잘못된 "Command timed out" 문제 수정.
- Azure Monitor 및 chunked transfer encoding을 받지 않는 기타 엔드포인트가 OpenTelemetry HTTP export를 411/400으로 거부하던 문제 수정.
- SDK/headless 모드에서 `TRACEPARENT`가 설정됐을 때 OTLP 이벤트 로그 레코드에 `trace_id`/`span_id`가 누락되던 문제 수정.
- 이미지가 많은 대화가 "Request too large" 오류로 잘못 실패하던 문제 수정, 그리고 실제 원인을 설명하도록 오류 메시지 개선.
- API 과부하 시 웹 검색·웹 페치가 "API Error" 텍스트를 검색 결과나 페이지 내용으로 반환하던 문제 수정.
- 529 오류와 rate-limit된 요청을 제한된 백오프로 재시도해 웹 검색·웹 페치 신뢰성 개선.
- 프롬프트 캐싱 개선: mid-conversation system 블록이 이제 LLM 게이트웨이와 커스텀 base URL(Bedrock, Vertex, 1P) 뒤에서도 동작.
- 백그라운드 에이전트 attach 개선: cold-attach 시 세션이 부팅되는 동안 빈 화면 대기 대신 포맷된 트랜스크립트를 즉시 표시.
- inter-agent 메시징 토큰 사용량 절감: `SendMessage` 본문이 리플레이된 히스토리와 도구 결과에 더 이상 중복되지 않는다.
- 세션에 제목이 없을 때 `/fork`가 프롬프트를 기준으로 사본 이름을 짓도록 변경해 에이전트 뷰에서 행을 알아볼 수 있게 함.
- 맨 `/btw`가 가장 최근 대화에서 사이드 질문 패널을 다시 열도록 변경해 이전 답변을 훑어볼 수 있게 함.
- 입력이 필요 없는 동안 백그라운드 에이전트가 완료되면 `←` 푸터 힌트가 잠시 `N done`으로 펄스하도록 변경.
- Task 도구의 `mode` 파라미터 폐기(이제 무시됨). 서브에이전트는 기본적으로 부모 세션의 권한 모드를 상속한다.
- Enterprise `forceLoginMethod`가 터미널뿐 아니라 VS Code 확장, SDK, `setup-token`, `install-github-app` 로그인에도 강제되도록 변경.
- 세션 트랜스크립트가 각 assistant 메시지에 reasoning effort 수준을 기록하도록 변경.
- headless/SDK 세션이 `set_model` 제어 요청을 턴 중간에 적용하도록 변경. 다음 모델 왕복이 다음 턴을 기다리지 않고 새 모델을 사용한다.
- 에이전트 뷰 / `claude agents --json`: 샌드박스, MCP 입력, managed-settings 프롬프트를 기다리는 세션이 이제 "Working" 대신 "Needs input"으로 표시.
- 인증 상태 패널 제목을 "Cloud authentication"에서 "Authentication"으로 변경.
- 이전 릴리스 노트(2.1.200) 정정: 3.6 시리즈의 tmux는 synchronized output이 없으며, 지원하는 최신 tmux는 자동으로 감지된다.

---

## 🎯 챌린지

이번 버전에서 내 환경에 적용해볼 만한 항목입니다.

### 1. 서브에이전트 세션 한도 명시
- **파일**: `~/.claude/settings.json` (`env` 블록)
- **근거**: 이번 버전이 세션당 서브에이전트 생성 상한(기본 200, `/clear`로 리셋)을 추가했다. 당신은 Workflow pipeline·parallel dispatch를 상시 쓰므로(`CLAUDE.md §7.2`) 대규모 감사 워크플로가 조용히 200에서 잘릴 수 있다. `CLAUDE_CODE_MAX_SUBAGENTS_PER_SESSION`을 워크플로 규모에 맞는 값으로 명시하면 한도가 의도치 않은 사고가 아니라 통제 가능한 설정이 된다.
- **난이도**: ★☆☆ (약 5분)

### 2. MCP 자동 백그라운드 임계값 조정
- **파일**: `~/.claude/settings.json` (`env` 블록)
- **근거**: Playwright·Notion·claude.ai MCP를 쓰는 환경에서 2분 넘는 MCP 호출이 이제 자동으로 백그라운드로 넘어간다. Playwright의 브라우저 대기·스냅샷이 길어질 수 있으니 `CLAUDE_CODE_MCP_AUTO_BACKGROUND_MS`를 원하는 임계값으로 설정하거나(예: 더 길게), 방해되면 비활성화해 QA 흐름을 예측 가능하게 만든다.
- **난이도**: ★☆☆ (약 5~10분)

### 3. WebSearch 세션 한도 명시
- **파일**: `~/.claude/settings.json` (`env` 블록)
- **근거**: `deep-research` 스킬은 fan-out 웹 검색을 다수 실행한다. 이번 버전이 세션당 WebSearch 상한(기본 200)을 추가했으니 `CLAUDE_CODE_MAX_WEB_SEARCHES_PER_SESSION`을 리서치 규모에 맞게 명시해 무한 검색 루프는 막되 정상 리서치가 중간에 끊기지 않도록 조정한다.
- **난이도**: ★☆☆ (약 5분)

### 4. `/subtask` 이름 변경 반영
- **파일**: `~/.claude/CLAUDE.md` 또는 관련 스킬/문서 내 `/fork` 언급부
- **근거**: `/fork`가 백그라운드 세션 복사로 바뀌고, 기존 인-세션 서브에이전트 동작은 `/subtask`로 분리됐다. 당신의 문서·워크플로 지침에 `/fork`로 서브에이전트를 띄운다는 서술이 있으면 `/subtask`로 갱신해 실제 동작과 어긋나지 않게 한다.
- **난이도**: ★☆☆ (약 5~10분)
