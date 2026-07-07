# Claude Code v2.1.169

> 작성일: 2026-06-09

---

# 📋 요약본

## 🎉 신기능 (3건)
- **`--safe-mode` 플래그 추가** (및 `CLAUDE_CODE_SAFE_MODE` 환경변수) — 모든 커스터마이즈(CLAUDE.md, 플러그인, 스킬, 훅, MCP 서버)를 비활성화한 상태로 Claude Code 시작. 문제 분리 진단용.
- **`/cd` 명령 추가** — 세션 중간에 working directory를 바꿔도 prompt cache가 깨지지 않게 이동.
- **`disableBundledSkills` 설정 + `CLAUDE_CODE_DISABLE_BUNDLED_SKILLS` 환경변수** — bundled 스킬, 워크플로우, 내장 슬래시 명령을 모델에게 숨김.

## ⚙️ 개선 / 동작 변경 (14건)
- **`/workflows`가 턴 진행 중에도 즉시 열림**.
- **`TaskCreate` 신뢰성 강화** — 잘못된 입력은 자동 복구되고, 로드되지 않은 도구의 검증 오류에 스키마 포함.
- **조직이 API 키 인증을 비활성화했을 때 오류 메시지 개선** — 현재 활성 API 키의 출처에 따른 안내 제공.
- **응답 스트리밍 및 스피너 애니메이션 중 CPU 사용량 감소**.
- **Vertex/Foundry에서 5분 idle timeout 기본값 복원** — 멈춘 stream이 무한 hang 대신 abort. opt-out: `API_FORCE_IDLE_TIMEOUT=0`.
- **Remote-managed settings의 잘못된 항목 처리 개선** — 전체 payload silent 폐기 대신 나머지 유효한 정책 적용 + validation 오류 표면화.
- **백그라운드 세션이 retire→wake 사이에 `--ide`, `--chrome`, `--bare`, `--remote-control` 등 플래그 보존**. respawn 상태 검증도 강화.
- **백그라운드 세션에게 worktree 진입 전까지 shared-checkout 편집 차단을 사전 안내** — `EnterWorktree` 전에 거부될 편집을 낭비하지 않음.
- **"CLAUDE.md is too long" 경고 임계값이 모델의 context window 크기에 따라 스케일**.
- **Windows 자동 업데이터가 세션 중 `claude.exe`가 다른 프로세스에 의해 잡혀 있으면 재시도 중단**.
- **`/` 메뉴 스킬 태그의 색상 contrast 개선**.
- **Apple/Google 결제 구독자 중 payment method 미등록 사용자의 promo credit 클레임에 등록 위치 안내**.
- **다수 동시 세션 실행 시 `claude agents` 사용을 제안하는 tip 추가**.
- **`claude agents --json` 출력 확장** — 차단된/방금 dispatch된 백그라운드 세션 누락 수정 + `--all` 플래그로 완료 세션 포함, 신규 `id`·`state` 필드 추가.

## 🐛 버그 수정 (12건) — 카테고리별
- **입력 / UI**:
  - 긴 입력 라인의 wrapped row를 건너뛰고 Up/Down 화살표가 command history로 점프하던 문제 수정 — 이제 visual row를 먼저 이동하고 가까운 edge에서 history recall로 진입.
- **🔐 권한 / 관리 정책**:
  - 엔터프라이즈 managed MCP 정책(`allowedMcpServers`/`deniedMcpServers`)이 reconnect, IDE-typed config, 설치 후 첫 세션의 `--mcp-config` 서버, 원격 설정 로드 전에 강제되지 않던 문제 수정. remote settings 없는 조직의 느린 cold start도 수정.
  - 신뢰되지 않은 프로젝트 설정이 trust 확인 없이 OTEL client-certificate 경로를 설정할 수 있던 문제 수정.
- **macOS**:
  - claude.ai 자격증명으로 로그인한 macOS 사용자에게 매 턴 시작 시 발생하던 ~30-50ms UI stall 수정.
- **🪟 Windows**:
  - 슬래시 명령/스킬 스캔 대기로 `claude -p`가 느리거나 hang으로 보이던 문제 수정 (v2.1.161 회귀).
  - 시작 시 백그라운드 git 명령이 캐시된 자격증명 없이 실행될 때 Git Credential Manager의 "Connect to GitHub" 팝업이 뜨던 문제 수정.
- **원격 세션 / Remote Control**:
  - 세션 재개와 동시에 OAuth 토큰 갱신이 일어날 때 Remote Control이 "reconnecting" 상태에 stuck되던 문제 수정.
  - worker가 권한/다이얼로그 프롬프트 대기 중에 죽은 원격 세션에 reattach할 때마다 stale 프롬프트가 반복 표시되던 문제 수정.
- **UI / 통합**:
  - 커스텀 statusline 사용자에게 footer 힌트(예: "esc to interrupt")가 표시되지 않던 문제 수정.
  - WSL의 Windows Terminal에서 에이전트로부터 navigate back할 때 agents view에 stale/garbled 프레임이 남던 문제 수정.
- **백그라운드 에이전트**:
  - pre-warmed worker로 dispatch된 백그라운드 에이전트가 프로젝트 레벨 settings의 `env` 값(예: `ANTHROPIC_MODEL`)을 무시하던 문제 수정.
- **플러그인**:
  - Windows에서 MCPB 플러그인 캐시가 잘못 invalidate되어 불필요한 재추출이 발생하던 문제 수정.
  - 플러그인 `.in_use` PID lock 파일이 무한히 누적되던 문제 수정 — crashed 세션이 남긴 stale 마커는 이제 하루에 한 번 sweep.

## ⚠️ 주목할 회귀 수정
- **v2.1.161 회귀**: Windows에서 슬래시 명령/스킬 스캔 대기 때문에 `claude -p` slow / hang

## 🔑 이번 버전의 핵심 키워드
**"진단 도구 + 엔터프라이즈 정책 정합성"** — `--safe-mode`(모든 커스터마이즈 비활성)와 `disableBundledSkills`로 문제 분리 진단 경로를 명시적으로 제공했습니다. 동시에 엔터프라이즈 managed MCP 정책의 reconnect/IDE/--mcp-config/원격 설정 적용 누수, OTEL client-cert 신뢰 우회, Vertex/Foundry idle timeout 등 정책·신뢰성 경로의 정합성을 광범위하게 다듬었습니다. `/cd`와 `--safe-mode`는 평소 가렵던 운영 시나리오(디렉토리 이동·문제 분리)를 매끄럽게 풀어주는 실용 신기능입니다.

---

# 📜 원문 (한글 번역본)

> 원문 ChangeLog를 원래 순서 그대로 한 줄도 빠짐없이 번역한 문서입니다.

- 모든 커스터마이즈(CLAUDE.md, 플러그인, 스킬, 훅, MCP 서버)를 비활성화한 상태로 Claude Code를 시작하여 troubleshooting할 수 있는 `--safe-mode` 플래그(및 `CLAUDE_CODE_SAFE_MODE`)를 추가했습니다.
- 세션 중간에 prompt cache를 깨지 않으면서 세션을 새 working directory로 이동시키는 `/cd` 명령을 추가했습니다.
- bundled 스킬, 워크플로우, 내장 슬래시 명령을 모델로부터 숨기는 `disableBundledSkills` 설정과 `CLAUDE_CODE_DISABLE_BUNDLED_SKILLS` 환경 변수를 추가했습니다.
- 긴 입력 라인의 wrapped row를 지나쳐 Up/Down 화살표가 command history로 점프하던 문제를 수정했습니다 — 이제 visual row를 먼저 이동하고, history recall은 가까운 edge에서 진입합니다.
- 엔터프라이즈 managed MCP 정책(`allowedMcpServers`/`deniedMcpServers`)이 reconnect, IDE-typed config, 설치 후 첫 세션 동안의 `--mcp-config` 서버, 그리고 원격 설정 로드 전에 강제되지 않던 문제를 수정했습니다; 또한 원격 설정이 없는 조직의 느린 cold start도 수정했습니다.
- claude.ai 자격증명으로 로그인한 macOS 사용자에게 매 턴 시작에서 발생하던 ~30-50ms UI stall을 수정했습니다.
- 슬래시 명령/스킬 스캔을 기다리는 동안 Windows에서 `claude -p`가 느리거나 hang으로 보이던 문제를 수정했습니다 (v2.1.161 회귀).
- 세션을 재개할 때 OAuth 토큰 갱신이 동시에 발생하면 Remote Control이 "reconnecting"에 stuck되던 문제를 수정했습니다.
- 백그라운드 git 명령이 캐시된 자격증명 없이 실행될 때 Windows의 시작 시점에 Git Credential Manager의 "Connect to GitHub" 팝업이 나타나던 문제를 수정했습니다.
- 커스텀 statusline을 가진 사용자에게 footer 힌트(예: "esc to interrupt")가 표시되지 않던 문제를 수정했습니다.
- worker가 권한/다이얼로그 프롬프트를 기다리는 동안 죽은 원격 세션에 reattach할 때마다 stale 권한 및 다이얼로그 프롬프트가 다시 나타나던 문제를 수정했습니다.
- `claude agents --json`이 차단된 및 방금 dispatch된 백그라운드 세션을 누락시키던 문제를 수정했습니다; 완료된 세션을 포함하기 위한 `--all`을 추가했으며, 새로운 `id`와 `state` 필드를 추가했습니다.
- WSL의 Windows Terminal에서 에이전트로부터 navigate back한 후 agents view에 stale/garbled 프레임이 남던 문제를 수정했습니다.
- pre-warmed worker로 dispatch된 백그라운드 에이전트가 프로젝트 레벨 settings의 `env` 값(예: `ANTHROPIC_MODEL`)을 무시하던 문제를 수정했습니다.
- Windows에서 MCPB 플러그인 캐시가 spurious하게 invalidate되어 불필요한 재추출이 발생하던 문제를 수정했습니다.
- 플러그인 `.in_use` PID lock 파일이 무한히 누적되던 문제를 수정했습니다; crashed 세션의 stale 마커는 이제 하루에 한 번 sweep됩니다.
- 신뢰되지 않은 프로젝트 settings가 trust confirmation 없이 OTEL client-certificate 경로를 설정할 수 있던 문제를 수정했습니다.
- `/workflows`가 이제 턴이 진행 중이어도 즉시 열립니다.
- `TaskCreate` 신뢰성을 개선했습니다: 잘못 형성된 입력은 자동으로 복구되고, 로드되지 않은 도구에 대한 validation 오류는 스키마를 포함합니다.
- 조직이 API 키 인증을 비활성화했을 때 표시되는 오류 메시지를 개선하여, 활성 API 키의 출처에 따른 안내를 제공합니다.
- 응답이 스트리밍되는 동안과 스피너 애니메이션 중 CPU 사용량을 줄였습니다.
- Vertex/Foundry에서 기본 5분 idle timeout을 복원하여, 멈춘 stream이 무한히 hang되는 대신 abort됩니다; opt out하려면 `API_FORCE_IDLE_TIMEOUT=0`로 설정하세요.
- 잘못된 항목을 가진 Remote-managed settings가 이제 전체 payload를 silently drop하는 대신 남은 유효한 정책을 적용하고 validation 오류를 표면화합니다.
- 백그라운드 세션이 이제 retire→wake에 걸쳐 `--ide`, `--chrome`, `--bare`, `--remote-control` 및 다른 플래그를 보존하며, respawn 상태 validation이 강화되었습니다.
- 백그라운드 세션에 이제 worktree에 진입하기 전까지 shared-checkout 편집이 차단됨이 사전 안내되어, `EnterWorktree` 전 거부될 편집을 낭비하지 않습니다.
- "CLAUDE.md is too long" 경고 임계값이 이제 모델의 context window와 함께 스케일됩니다.
- Windows의 auto-updater가 이제 세션 내에서 `claude.exe`가 다른 프로세스에 의해 잡혀 있으면 재시도를 중단합니다.
- 슬래시 명령 메뉴의 스킬 태그에 대한 색상 contrast를 개선했습니다.
- payment method가 없는 Apple/Google-billed 구독자의 promo credit 클레임이 이제 어디에 추가해야 하는지 설명합니다.
- 다수의 동시 세션을 실행할 때 `claude agents`를 제안하는 tip을 추가했습니다.

---

## 🎯 챌린지

이번 버전에서 내 환경에 적용해볼 만한 항목입니다.

### 1. `--safe-mode` alias 등록으로 문제 분리 진단 경로 확보
- **파일**: `~/.zshrc`
- **근거**: 현재 환경은 플러그인 4개, 글로벌 훅 3종(UserPromptSubmit/PreToolUse/Stop), 커스텀 statusLine까지 활성화돼 있어 문제가 생기면 원인 분리가 어렵습니다. 이번 버전에 추가된 `--safe-mode` 플래그를 `alias claude-safe='claude --safe-mode'`로 등록해두면 훅이나 token-optimizer가 의심될 때 즉시 비교 실행이 가능합니다.
- **난이도**: ★☆☆ (약 3분)

### 2. `/cd` 명령으로 Poplus 모노레포 내 프로젝트 전환 워크플로 정착
- **파일**: 사용 습관 (별도 파일 변경 없음)
- **근거**: Poplus 30개 마이크로서비스 모노레포를 학습 중이라 프로젝트 간 디렉토리 이동이 잦습니다. 기존엔 새 세션을 띄우거나 cd로 인해 prompt cache가 깨졌는데, 이번에 추가된 `/cd`는 캐시를 유지하면서 working directory만 바꿔줍니다. 한 번 써보고 [[user-poplus-new-developer]] 메모리에 사용 패턴 추가하면 다음 세션에도 이어집니다.
- **난이도**: ★☆☆ (약 5분)

### 3. `disableBundledSkills` 시도 후 본인 환경에 맞는지 판단
- **파일**: `~/.claude/settings.json`
- **근거**: 현재 `skillListingBudgetFraction: 0.08`로 스킬 리스팅 토큰을 이미 제한 중이고, superpowers·token-optimizer·understand-anything 등 외부 플러그인 스킬 위주로 사용 중입니다. bundled 스킬·워크플로우·내장 슬래시 명령을 모델에서 숨기는 `"disableBundledSkills": true`를 한 세션 켜보고 워크플로우에 빠지는 게 없는지 확인해 토큰 절감 여지가 있는지 검증할 가치가 있습니다.
- **난이도**: ★★☆ (약 15분)

### 4. Vertex/Foundry idle timeout opt-out 결정 명시
- **파일**: `~/.claude/settings.json` (env 섹션 추가)
- **근거**: 이번 버전에서 Vertex/Foundry의 5분 idle timeout 기본값이 복원됐습니다. 현재 Anthropic API를 직접 쓰는지 Vertex/Foundry 경로인지에 따라 영향이 갈리는데, 의도적으로 timeout을 끄려면 `"env": {"API_FORCE_IDLE_TIMEOUT": "0"}`를 추가해야 합니다. 5분 후 abort가 기본 동작이 됐다는 사실 자체를 [[feedback-reliability-over-cost]] 맥락에서 한 번은 인지하고 결정해두는 게 좋습니다.
- **난이도**: ★☆☆ (약 5분)

### 5. `claude agents --json --all` 기반 백그라운드 세션 점검 루틴
- **파일**: 사용 습관 + 선택적으로 `~/.claude/commands/` 슬래시 명령 추가
- **근거**: 이번 버전에 `claude agents --json`의 누락 버그가 수정되고 `--all` 플래그, `id`·`state` 필드가 추가됐습니다. parallel dispatch를 자주 쓰는 [[feedback-reliability-over-cost]] 환경에서 차단된/완료된 세션을 빠르게 점검할 수 있는 명령이 생긴 셈이므로, 한 번 직접 실행해 출력 구조를 확인하고 자주 쓸 만하면 짧은 슬래시 명령으로 래핑해두면 됩니다.
- **난이도**: ★★☆ (약 10분)
