# Claude Code v2.1.200

> 작성일: 2026-07-05

---

# 📋 요약본

## 🛠️ 개선/수정 (17건)
- **`AskUserQuestion` 자동 진행 제거** — 대화상자가 기본적으로 자동 진행하지 않음. `/config` 에서 idle timeout 을 선택적으로 활성화.
- **권한 모드 "default" → "Manual" 개명** — CLI·`--help`·VS Code·JetBrains 통일. `manual` 명칭을 `default` 와 병행 허용.
- **`.claude.json` 비배열 값 크래시 수정** — `disabledMcpServers`/`enabledMcpServers` 가 배열이 아니면 시작 시 크래시하던 것 해결.
- **백그라운드 세션 중단 수정** — 절전/깨어남·멈춘 세션 재오픈 시 턴 중간에 조용히 멈추던 문제.
- **취소 턴 재실행 수정** — 멈춤 재생성(respawn) 후 Esc 로 취소한 턴을 다시 실행하던 문제.
- **stale `daemon.lock` 복구** — OS 가 PID 를 재사용한 오래된 락 때문에 백그라운드 에이전트가 안 켜지던 문제.
- **데몬 인수인계 방어** — 재설치된 구버전 빌드가 데몬을 가로채지 못하도록, 빌드 타임스탬프로 최신 여부 판단.
- **로스터(roster) 손상 문제 3종** — 고아(orphan) 정리 영구 비활성화, 신버전 필드 미보존, 소켓 인증 토큰 제거 수정.
- **rate limit 서브에이전트 처리** — 출력 전 잘린 서브에이전트가 빈 결과를 반환하지 않고 깔끔히 실패.
- **제어 바이트 누출 차단** — 백그라운드 출력의 제어 바이트(control bytes)가 에이전트 뷰 터미널에 도달하던 문제.
- **`--plugin-dir` 위치 버그** — 플래그를 `agents` 뒤에 두면 플러그인 에이전트·스킬이 안 보이던 문제.
- **worktree 플러그인 로드 수정** — 동일 저장소의 git worktree 에서 프로젝트 범위 플러그인 로드 실패.
- **`/mcp` 접근성 포커스** — 서버 목록이 스크린 리더·확대기(magnifier) 포커스를 추적하도록 수정.
- **음성 받아쓰기 오탐 메시지** — 무음 녹음 시 잘못된 "Voice connection failed" 표시 제거.
- **tmux 깜빡임 수정** — 동기화 출력 활성화로 tmux 3.4+ 렌더링 flicker 해결.
- **스크린 리더 출력 개선** — 장식용 글리프(glyph) 숨김, 기호를 짧은 라벨로, 중첩 표를 `Header: value.` 줄로 읽음.
- **설치 스크립트 OOM 안내** — 메모리 부족으로 설치가 죽으면 그 이유를 설명.

## 🔑 이번 버전의 핵심 키워드
**"백그라운드 에이전트 데몬 안정화 + 접근성 개선"** — 새 기능 없이 데몬·세션 신뢰성과 스크린 리더 지원을 다진 유지보수 릴리스.

---

# 📜 원문 (한글 번역본)

> 원문 ChangeLog를 원래 순서 그대로 한 줄도 빠짐없이 번역한 문서입니다.

- `AskUserQuestion` 대화상자가 기본적으로 자동 진행(auto-continue)하지 않도록 변경. `/config` 에서 idle timeout 을 선택적으로 활성화 가능.
- CLI, `--help`, VS Code, JetBrains 전반에서 "default" 권한 모드의 명칭을 "Manual" 로 변경. `--permission-mode manual` 과 `"defaultMode": "manual"` 을 `default` 와 함께 허용.
- `.claude.json` 의 `disabledMcpServers` 또는 `enabledMcpServers` 가 배열이 아닌 값으로 설정됐을 때 시작 시 발생하던 크래시 수정.
- 절전/깨어남(sleep/wake) 후 또는 멈춘(stalled) 세션 재오픈 시 백그라운드 세션이 턴 중간에 조용히 멈추던 문제 수정.
- 멈춤 후 재생성(respawn)된 뒤 Esc 로 취소한 턴을 백그라운드 세션이 다시 실행하던 문제 수정.
- 크래시로 남은 오래된 `daemon.lock`(그 PID 를 OS 가 재사용)으로 인해 백그라운드 에이전트가 다시 시작되지 못하던 문제 수정.
- 백그라운드 에이전트 데몬 인수인계(handover) 수정 — 재설치된 구버전 빌드가 데몬을 가로챌 수 없도록. 이제 빌드 최신 여부는 버전에 내장된 빌드 타임스탬프로 판단.
- 백그라운드 에이전트 로스터(roster) 문제 수정: 일시적 손상이 고아(orphan) 정리를 영구 비활성화하던 것, 구버전 바이너리가 신버전이 기록한 필드를 보존하지 못하던 것, 데몬 재시작 시 소켓 인증 토큰이 제거되던 것.
- 텍스트 출력 전에 rate limit 으로 잘린 서브에이전트가 깔끔하게 실패하지 않고 빈 결과를 반환하던 문제 수정.
- 백그라운드 에이전트 출력의 제어 바이트(control bytes)가 에이전트 뷰의 터미널에 도달하던 문제 수정.
- `claude agents --plugin-dir <dir>` 에서 `--plugin-dir` 플래그를 `agents` 뒤에 두면 해당 플러그인의 에이전트·스킬이 에이전트 뷰에 표시되지 않던 문제 수정.
- 같은 저장소의 git worktree 에서 프로젝트 범위(project-scoped) 플러그인이 올바로 로드되지 않던 문제 수정.
- `/mcp` 서버 목록이 스크린 리더·확대기(magnifier)를 위한 포커스를 추적하지 못하던 문제 수정.
- 녹음에 오디오가 없을 때 음성 받아쓰기가 오해를 부르는 "Voice connection failed" 메시지를 표시하던 문제 수정.
- 동기화된 터미널 출력(synchronized terminal output)을 활성화해 tmux 3.4+ 에서의 렌더링 깜빡임(flicker) 수정.
- 스크린 리더 출력 개선: 장식용 글리프(glyph)를 숨기고, 트랜스크립트 기호를 짧은 라벨로 읽으며, 중첩된 표를 `Header: value.` 줄로 읽음.
- 시스템 메모리 부족으로 설치가 종료됐을 때 이를 설명하도록 설치 스크립트 개선.

---

## 🎯 챌린지

이번 버전에서 내 환경에 적용해볼 만한 항목입니다.

### 1. 자동 실행이 멈추지 않게 `AskUserQuestion` idle timeout 켜기
- **파일**: `~/.claude/settings.json` (또는 `/config` 로 설정)
- **근거**: 이번 버전부터 `AskUserQuestion` 대화상자가 기본 자동 진행을 멈춘다. 당신은 `claude-changelog-sync` 를 매일 08:00 cron 으로 돌리는데, 자동 실행 중 질문 창이 뜨면 이제 무한 대기로 멈춘다. `/config` 에서 idle timeout 을 켜 두면 무인 흐름이 답변 없이도 진행돼 막히지 않는다.
- **난이도**: ★☆☆ (약 5분)

### 2. `.claude.json` 의 MCP 서버 키가 배열인지 확인
- **파일**: `~/.claude.json`
- **근거**: 이번 버전이 `disabledMcpServers`/`enabledMcpServers` 가 배열이 아닌 값일 때의 시작 크래시를 고쳤다. 당신은 `playwright` 등 MCP 서버를 쓰므로, 두 키가 존재한다면 값이 배열(`[]`)인지 지금 확인해 두면 설정 실수나 구버전 실행 시 발생할 시작 크래시를 예방한다.
- **난이도**: ★☆☆ (약 5분)

### 3. 권한 모드를 새 명칭 `manual` 로 명시
- **파일**: `~/.claude/settings.json`
- **근거**: 권한 모드 표준 명칭이 "default" 에서 "Manual" 로 바뀌었다(`default` 표기는 아직 허용). deploy-guard·precheck 로 안전을 우선하는 환경이니 `"defaultMode": "manual"` 을 명시해 "수동 승인" 의도를 설정 파일에 문서화하고, 향후 `default` 명칭 폐기에 미리 대비한다. 동작은 현재와 동일한 명시화다.
- **난이도**: ★☆☆ (약 5분)
