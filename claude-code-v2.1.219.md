# Claude Code v2.1.219

> 작성일: 2026-08-06

---

# 📋 요약본

## 🎉 신기능 (9건)
- **Claude Opus 5 추가** — `claude-opus-5` 신규 추가, 이제 기본 Opus 모델. 1M 컨텍스트, fast mode 지원, 요금은 Mtok당 $10/$50.
- **`sandbox.network.strictAllowlist` 설정** — 샌드박스 명령에서 허용목록에 없는 호스트를 프롬프트 없이 바로 차단.
- **`DirectoryAdded` 훅** — `/add-dir` 또는 SDK `register_repo_root` 요청으로 세션 도중 새 작업 디렉터리가 등록되면 발동.
- **headless stream-json에 `mcp_server_errors`** — 설정 검증에서 스킵된 `--mcp-config` 항목을 init 이벤트에 나열. 터미널 실행 시 시작 경고 출력.
- **`workflowSizeGuideline` 설정 키** — Dynamic workflow 크기 권고값을 아무 설정 파일에서나 지정 가능. 지정 시 `/config` 행은 숨겨짐.
- **stream-json 중첩 서브에이전트 전달** — depth-2 이상에서 생성된 서브에이전트를, 생성한 Agent `tool_use` id 기준으로 `--forward-subagent-text` 설정 시 노출.
- **`claude mcp list`·`/mcp` 연결 실패 정보** — 서버 연결 실패 시 HTTP 상태와 에러 텍스트 표시, MCP 설정값 앞뒤 숨은 공백에 대한 경고 추가.
- **running-workflow 상태줄에 현재 기본 workflow 크기 표시** — 변경은 `/config`로 안내.
- **서브에이전트 중첩 생성 depth 3 기본화** — 서브에이전트가 최대 depth 3까지 중첩 서브에이전트 생성 가능(기존 1). `CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH=1`로 비활성화.

## 🛠️ 개선/수정 (15건)
- **`claude -p` 답변 유실 수정** — 턴이 중간 스트림 API 에러로 죽을 때 이미 생성된 답변을 버리던 문제 수정.
- **Fable 모델 행 라벨 수정** — 플랜에 포함돼 있는데도 오래된 캐시가 "Requires usage credits"를 박아두던 문제 수정.
- **`/model` 선택기 Opus 행 수정** — 병합된 Opus 행을 "Opus (1M context)"가 아닌 그냥 "Opus"로 보이던 문제 수정.
- **GNU screen 복사 수정** — 선택 시 복사가 base64를 터미널에 출력하던 문제 수정.
- **Remote Control fast-mode 상태 수정** — 모델 전환·재접속·org 체크 실패 후에도 오래된 fast-mode 상태를 유지하던 문제 수정.
- **`CLAUDE_CODE_GIT_BASH_PATH` 수정(Windows)** — 경로가 bash/sh 바이너리가 아닐 때 종료되거나 bash로 사용되던 문제를 경고와 함께 무시하도록 수정.
- **Vim 모드 수정** — 빈 프롬프트에서 ← 입력 시 INSERT뿐 아니라 NORMAL 모드에서도 에이전트 뷰로 복귀.
- **스크린리더 모드 수정** — 키 입력마다 입력줄 전체를 다시 쓰던 것을 입력한 문자만 에코하도록 수정.
- **Remote Control 에러 메시지 개선** — "Remote Control is only available via api.anthropic.com" 에러가 원인이 된 설정을 명시.
- **`claude --teleport` 개선** — 현재 체크아웃이 세션 레포와 불일치할 때 어느 레포를 가리키는지 표시.
- **Dynamic workflow 기본 크기 변경** — 기본을 medium 권고(에이전트 15개 미만 지향)로 변경. `/config`의 Dynamic workflow size에서 다른 크기나 무제한 선택.
- **관리형 MCP `${VAR}` 해석 변경** — allowlist/denylist의 `${VAR}` 항목을 설정 파일 env가 아닌 시작 환경·관리형 설정 env에서 해석.
- **`/model` 선택기 강조 변경** — 최신 모델 이름만 강조해, 강조가 신규 릴리스를 가리키도록.
- **fast mode에서 Opus 4.7 제거** — `/fast`는 이제 Opus 5와 Opus 4.8에 적용.
- **claude-api 스킬 갱신** — 기본을 Claude Opus 5로, Opus 4.8에서의 마이그레이션 경로 제공.

## 🔑 이번 버전의 핵심 키워드
**"Opus 5 기본화와 중첩 서브에이전트"** — 새 기본 Opus 모델과 depth 3 서브에이전트 중첩, Dynamic workflow 크기 권고가 이 버전의 축이다.

---

# 📜 원문 (한글 번역본)

> 원문 ChangeLog를 원래 순서 그대로 한 줄도 빠짐없이 번역한 문서입니다.

- Claude Opus 5(`claude-opus-5`) 추가. 이제 기본 Opus 모델 — 1M 컨텍스트, fast mode는 Mtok당 $10/$50.
- 샌드박스 명령에서 허용목록에 없는 호스트를 프롬프트 없이 거부하는 `sandbox.network.strictAllowlist` 설정 추가.
- `/add-dir` 또는 SDK `register_repo_root` 컨트롤 요청이 세션 도중 새 작업 디렉터리를 등록한 뒤 발동하는 `DirectoryAdded` 훅 추가.
- headless stream-json init 이벤트에 `mcp_server_errors` 추가 — 설정 검증으로 스킵된 `--mcp-config` 항목을 나열. 터미널 실행은 시작 경고를 출력.
- 권고성 Dynamic workflow 크기 가이드라인을 아무 설정 파일에서나 지정할 수 있는 `workflowSizeGuideline` 설정 키 추가. 지정돼 있으면 `/config` 행은 숨겨짐.
- stream-json에 중첩 서브에이전트 전달 추가 — depth-2 이상에서 생성된 서브에이전트가 `--forward-subagent-text` 설정 시, 생성한 Agent `tool_use` id 기준으로 표시됨.
- `claude -p` 텍스트 출력이 턴이 중간 스트림 API 에러로 죽을 때 이미 생성된 답변을 버리던 문제 수정.
- 서버 연결 실패 시 `claude mcp list`·`/mcp`에 HTTP 상태와 에러 텍스트 추가, 그리고 앞뒤 숨은 공백이 있는 MCP 설정값에 대한 경고 추가.
- 오래된 캐시가 라벨을 박아둔 탓에, 해당 플랜에 포함돼 있는데도 Fable 모델 행이 "Requires usage credits"로 표시되던 문제 수정.
- `/model` 선택기가 병합된 Opus 행을 "Opus (1M context)"가 아닌 그냥 "Opus"로 보여주던 문제 수정.
- GNU screen 안에서 선택 시 복사가 선택 영역을 복사하지 않고 base64를 터미널에 출력하던 문제 수정.
- Remote Control 클라이언트가 모델 전환·재접속·org 체크 실패 후에도 오래된 fast-mode 상태를 유지하던 문제 수정.
- Windows에서 `CLAUDE_CODE_GIT_BASH_PATH`가 bash/sh 바이너리가 아닌 경로일 때 종료되거나 bash로 사용되던 문제 수정 — 이제 경고와 함께 무시됨.
- Vim 모드 수정: 빈 프롬프트에서 ← 를 누르면 INSERT뿐 아니라 NORMAL 모드에서도 에이전트 뷰로 복귀함.
- 스크린리더 모드가 키 입력마다 입력줄 전체를 다시 쓰던 것을, 입력한 문자만 에코하도록 수정.
- "Remote Control is only available via api.anthropic.com" 에러를, 원인이 된 특정 설정을 명시하도록 개선.
- `claude --teleport`가 현재 체크아웃이 세션 레포와 불일치할 때 어느 레포를 가리키는지 표시하도록 개선.
- Dynamic workflow가 기본적으로 medium 크기 가이드라인(에이전트 15개 미만 지향)을 쓰도록 변경. `/config`의 Dynamic workflow size에서 다른 크기나 무제한 선택.
- 관리형 MCP allowlist/denylist의 `${VAR}` 항목을 설정 파일 env가 아닌 시작 환경·관리형 설정 env에서 해석하도록 변경.
- `/model` 선택기가 최신 모델의 이름만 강조하도록 변경 — 강조가 목록의 임의 일부가 아닌 신규 릴리스를 가리키도록.
- fast mode에서 Opus 4.7 제거. `/fast`는 이제 Opus 5와 Opus 4.8에 적용됨.
- claude-api 스킬을 기본 Claude Opus 5로 갱신, Opus 4.8에서의 마이그레이션 경로 제공.
- running-workflow 상태줄에 현재 기본 workflow 크기를 추가하고, 변경은 `/config`로 안내.
- 서브에이전트가 기본으로 최대 depth 3까지 중첩 서브에이전트를 생성 가능(기존 1). `CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH=1`로 중첩 비활성화.

---

## 🎯 챌린지

이번 버전에서 내 환경에 적용해볼 만한 항목입니다.

### 1. Dynamic workflow 크기 권고값 고정
- **파일**: `~/.claude/settings.json`
- **근거**: 이번 버전이 dynamic workflow 기본을 medium(15개 미만)으로 바꿨다. CLAUDE.md §7.2는 dynamic workflow를 "대규모 감사 전용"으로 규정하는데, 감사 시엔 medium이 부족할 수 있다. `workflowSizeGuideline`를 명시하면 매번 `/config`로 조정할 필요 없이 의도한 크기로 고정된다.
- **난이도**: ★☆☆ (약 5분)

### 2. 서브에이전트 중첩 depth를 신뢰성 기준으로 결정
- **파일**: `~/.claude/settings.json` (`env`)
- **근거**: 중첩 생성이 이제 depth 3 기본이다. CLAUDE.md §5는 "작은 실패가 downstream으로 전파되는 비용"을 경계하고 서브에이전트 출력을 매번 verify하라고 한다. 깊은 중첩은 검증 사각을 늘리므로, 신뢰성 우선이면 `CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH=1`을 명시하고, 병렬 감사에 중첩이 필요하면 의도적으로 3을 두는 판단을 한 번 내려 둔다.
- **난이도**: ★☆☆ (약 5분)

### 3. `DirectoryAdded` 훅으로 세션 중 디렉터리 추가 기록
- **파일**: `~/.claude/settings.json` (`hooks`)
- **근거**: 이미 `PreToolUse`·`Stop` 훅을 쓰고 있어 훅 구조가 익숙하다. Poplus 30개 마이크로서비스 모노레포를 오가며 `/add-dir`로 작업 범위를 넓히는 상황에서, `DirectoryAdded` 훅으로 추가 시점을 알림·로깅하면 어떤 레포로 컨텍스트가 확장됐는지 추적된다.
- **난이도**: ★★☆ (약 10~15분)

### 4. 샌드박스 명령 네트워크 하드닝
- **파일**: `~/.claude/settings.json` (`sandbox.network`)
- **근거**: `sandbox.network.strictAllowlist`는 허용목록 밖 호스트를 프롬프트 없이 차단한다. `skipAutoPermissionPrompt: true` 환경에서 배포·시크릿 확인(§6)을 직접 하는 만큼, 샌드박스 명령의 외부 접속을 기본 차단으로 두면 의도치 않은 외부 통신을 원천 봉쇄할 수 있다.
- **난이도**: ★★☆ (약 10~15분)
