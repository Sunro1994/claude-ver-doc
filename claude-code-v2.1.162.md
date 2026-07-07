# Claude Code v2.1.162

> 작성일: 2026-06-03

---

# 📋 요약본

## 🎉 신기능 / 동작 변경 (6건)
- **`claude agents --json`에 `waitingFor` 필드 추가** — 대기 중인 세션이 무엇에 막혀 있는지 표시 (예: 권한 프롬프트).
- **`--tools`에 Grep/Glob 명시적 지정 시 전용 검색 도구 제공** — embedded search가 있는 네이티브 빌드에서 이전엔 silently 무시되던 이름을 이제 인식.
- **`/effort` 변경이 새 세션의 기본값으로 persist될 때 확인 메시지 표시**.
- **자동완성 메뉴의 슬래시 명령 클릭 동작 변경** — 즉시 실행 대신 프롬프트에 채워 넣음. Enter로 실행.
- **Remote Control이 시작 메시지 대신 persistent footer pill로 표시** (세션 링크 포함).
- **Windsurf → Devin Desktop 리네이밍** (`/ide` 메뉴, `/terminal-setup`, `/scroll-speed` 적용. 에디터 리브랜드 반영).

## ⚙️ 개선 (7건)
- **조용한 시작** — 알림이 severity별로 그룹화되고 세션 정보와 announcement는 launch당 한 줄 공유.
- **시작 경고 메시지 단순화** — 더 짧고 명확하게, 각각 구체적 수정 방법 포함.
- **Launch-prompt 경고가 입력 아래에 pinned 유지** — 사용자가 액션할 때까지 스크롤로 사라지지 않음.
- **실패한 턴이 멀티라인 빨간 에러 블록 대신 compact warning 라인으로 표시**.
- **백그라운드 서비스 시작 및 `claude update` 검증이 endpoint-security 스캔을 기다림** — 5초 후 실패 대신 대기.
- **백그라운드 dispatch spawn 실패 시 errno가 없을 때 에러 클래스명 보고**.
- **시작 메시지 정리** — "Claude in Chrome enabled" 및 "marketplace installed" 시작 메시지 제거. 모델 자동 업데이트와 팀 온보딩 팁은 이제 로고 아래의 조용한 알림으로 표시.

## 🐛 버그 수정 (15건) — 카테고리별
- **시작 / 안정성**:
  - 설정 디렉토리가 read-only이거나 쓰기 불가일 때 silent 시작 hang 수정 — 이제 빈 화면 대신 in-memory config로 시작하고 시작 오류 표면화.
- **🔐 권한 / 보안**:
  - WebFetch 권한 규칙이 built-in 사전승인 도메인에 적용되지 않던 문제 수정 — 명시적 `WebFetch(domain:...)` deny/ask/allow 규칙이 사전승인 호스트 자동 allow보다 우선.
  - 백슬래시(`~\`, `\\server\share`)나 case 다른 경로로 작성된 Windows 권한 규칙이 절대 매칭되지 않던 문제, Read deny 규칙이 Glob/Grep 결과에서 파일을 숨기지 못하던 문제 수정.
- **인터럽트 / 입력**:
  - stream-json/SDK 세션에서 턴 시작 직후 보낸 인터럽트(Esc)가 silently drop되어 "Interrupted" 피드백 없이 턴이 계속 돌던 문제 수정.
- **MCP / LSP**:
  - 분류기 사이드 쿼리와 truncation 경계 근처에 이모지가 포함된 MCP 서버 설명에서 API 400 `no low surrogate in string` 오류 수정.
  - MCP per-server `timeout` 설정값이 1000ms 미만일 때 모든 도구 호출을 abort시키는 1초 watchdog으로 floor되던 문제 수정 — 이제 1000ms 미만 값은 무시(`MCP_TOOL_TIMEOUT` 또는 default로 fallback)되며 `claude mcp get`에서 표시.
  - LSP 도구의 `workspaceSymbol` 동작이 결과를 반환하지 않던 문제 수정 — 이제 `query` 파라미터를 받아 언어 서버에 전달.
- **`claude agents` UI**:
  - 와이드 터미널에서 live status 텍스트(도구 args, 답변, 프롬프트, exec 출력)가 60–120열에서 잘리던 문제 수정 — 이제 전체 터미널 폭 사용.
  - 긴 세션 이름이 40열에서 잘리던 문제 수정 — 이제 이름 컬럼이 터미널 폭에 따라 성장.
  - 백그라운드 서비스 재시작 후 첫 시도에서 attach가 가끔 곧바로 세션 목록으로 튕기던 문제 수정.
  - dispatch 입력과 세션 reply 박스에서 Ctrl+V 이미지 paste가 동작하지 않던 문제 수정 — 이미지 없는 paste는 이제 힌트 표시.
- **백그라운드 세션 / 메시징**:
  - 백그라운드 서비스가 시작 불가일 때 ←로 세션을 백그라운드 전환하면 대화가 silently 사라지던 문제 수정 — 이제 실패 행으로 목록에 남아 Enter로 wake 가능.
  - agents view에서 전송 실패한 reply가 사라지던 문제 수정 — 이제 다음 세션 시작 시 전달을 위해 queue됨.
  - `CLAUDE_CODE_TMPDIR` 또는 `$TMPDIR`가 깊은 디렉토리를 가리킬 때 cross-session 메시징(`SendMessage`)이 silently 깨지던 문제 수정.
  - `claude agents`에서 실행 중인 백그라운드 세션을 열 때 attach 전 5초 stall되던 문제 수정.

## 🔑 이번 버전의 핵심 키워드
**"`claude agents` 마무리 다듬기 + 시작 UX 정돈"** — agents 목록과 attach 흐름의 잔여 누수(컬럼 잘림, attach 튕김, 5초 stall, 이미지 paste, reply 손실, ← detach 손실 등)를 한 번에 정리하고, 시작 시 노이즈(중복 메시지, 5초 endpoint-security 실패, 멀티라인 에러 블록 등)를 광범위하게 조용하게 다듬은 안정화 버전입니다. 권한 규칙의 Windows 경로 처리, WebFetch 사전승인 vs 명시 규칙 우선순위, MCP 사이드 쿼리의 이모지 truncation 같은 핵심 정합성 버그도 함께 잡혔습니다.

---

# 📜 원문 (한글 번역본)

> 원문 ChangeLog를 원래 순서 그대로 한 줄도 빠짐없이 번역한 문서입니다.

- `claude agents --json`이 이제 대기 중인 세션이 무엇에 막혀 있는지 보여주는 `waitingFor`를 포함합니다 (예: 권한 프롬프트).
- `--tools`: Grep/Glob을 명시적으로 나열하면 이제 embedded search가 있는 네이티브 빌드에서 전용 검색 도구를 제공합니다 (이전에는 이러한 이름이 silently 무시되었음).
- `/effort`가 이제 선택한 레벨이 새 세션의 기본값으로 persist될 때 확인합니다.
- 자동완성 메뉴의 슬래시 명령을 클릭하면 이제 즉시 실행하는 대신 프롬프트에 채워집니다; 실행하려면 Enter를 누르세요.
- Remote Control이 이제 시작 메시지 대신 persistent footer pill로 표시됩니다 (세션 링크 포함).
- 에디터의 리브랜드를 따라 `/ide` 메뉴, `/terminal-setup`, `/scroll-speed`에서 Windsurf를 Devin Desktop으로 이름을 변경했습니다.
- 설정 디렉토리가 read-only이거나 쓰기 불가일 때 silent 시작 hang을 수정했습니다 — Claude Code가 이제 빈 화면을 표시하는 대신 in-memory config로 시작하고 시작 오류를 표면화합니다.
- WebFetch 권한 규칙이 built-in 사전승인 도메인에 적용되지 않던 문제를 수정했습니다; 명시적 `WebFetch(domain:...)` deny/ask/allow 규칙이 이제 사전승인 호스트 자동 allow보다 우선합니다.
- 백슬래시(`~\`, `\\server\share`)나 case 변형 경로로 작성된 Windows 권한 규칙이 절대 매칭되지 않던 문제, 그리고 Read deny 규칙이 Glob/Grep 결과에서 파일을 숨기지 않던 문제를 수정했습니다.
- 턴의 맨 시작에 보낸 인터럽트(Esc)가 stream-json/SDK 세션에서 silently drop되어 "Interrupted" 피드백 없이 턴이 계속 실행되던 문제를 수정했습니다.
- 분류기 사이드 쿼리와 truncation 경계 근처에 이모지를 포함하는 MCP 서버 설명에 대해 API 400 `no low surrogate in string` 오류를 수정했습니다.
- MCP per-server `timeout` 설정값이 1000ms 미만일 때 모든 도구 호출을 abort시키는 1초 watchdog으로 floor되던 문제를 수정했습니다; 1000ms 미만 값은 이제 무시되며(`MCP_TOOL_TIMEOUT` 또는 default로 fallback) `claude mcp get`이 이를 적절히 annotate합니다.
- LSP 도구의 `workspaceSymbol` 작업이 결과를 반환하지 않던 문제를 수정했습니다; 이제 `query` 파라미터를 받아 언어 서버에 전달합니다.
- 와이드 터미널에서 `claude agents`가 live status 텍스트(도구 args, replies, prompts, exec 출력)를 60–120열에서 자르던 문제를 수정했습니다; status 상세는 이제 전체 터미널 폭을 사용합니다.
- `claude agents`가 긴 세션 이름을 40열에서 자르던 문제를 수정했습니다; 이름 컬럼은 이제 터미널 폭에 따라 성장합니다.
- `claude agents` attach가 백그라운드 서비스 재시작 후 첫 시도에서 가끔 곧바로 세션 목록으로 튕겨 돌아가던 문제를 수정했습니다.
- `claude agents`의 Ctrl+V 이미지 paste가 dispatch 입력과 세션 reply 박스에서 동작하지 않던 문제를 수정했습니다; 이미지 없이 paste하면 이제 힌트를 표시합니다.
- 백그라운드 서비스가 시작할 수 없을 때 ←로 세션을 백그라운드 전환하면 대화가 silently 사라지던 문제를 수정했습니다; 세션은 이제 실패 행으로 목록에 남아 Enter로 wake할 수 있습니다.
- agents view에서 전송에 실패한 reply가 사라지던 문제를 수정했습니다; 이제 다음 세션 시작에 전달을 위해 queue됩니다.
- `CLAUDE_CODE_TMPDIR` 또는 `$TMPDIR`가 깊은 디렉토리를 가리킬 때 cross-session 메시징(`SendMessage`)이 silently 깨지던 문제를 수정했습니다.
- `claude agents`에서 실행 중인 백그라운드 세션을 열 때 attach 전에 5초 stall되던 문제를 수정했습니다.
- 더 조용한 시작: 알림이 severity로 그룹화되고, 세션 정보와 announcement가 launch당 단일 라인을 공유합니다.
- 시작 경고 메시지를 더 짧고 명확하게 다시 작성했으며, 각각 구체적 수정 방법을 포함합니다.
- Launch-prompt 경고(deep link/pre-filled 프롬프트)가 이제 사라지지 않고 사용자가 액션할 때까지 입력 아래에 pinned 유지됩니다.
- 실패한 턴이 이제 멀티라인 빨간 에러 블록 대신 compact 경고 라인을 표시합니다.
- 백그라운드 서비스 시작과 `claude update` 검증을 개선하여 5초 후 실패하는 대신 새 바이너리에 대한 endpoint-security 스캔을 기다리도록 했습니다.
- 백그라운드 dispatch spawn 실패가 errno를 사용할 수 없을 때 이제 에러 클래스 이름을 보고합니다.
- "Claude in Chrome enabled"와 "marketplace installed" 시작 메시지를 제거했습니다; 모델 자동 업데이트와 팀 온보딩 팁은 이제 로고 아래의 조용한 알림으로 표시됩니다.
