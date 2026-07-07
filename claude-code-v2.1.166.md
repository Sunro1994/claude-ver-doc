# Claude Code v2.1.166

> 작성일: 2026-06-06

---

# 📋 요약본

## 🎉 신기능 / 동작 변경 (7건)
- **`fallbackModel` 설정 도입** — primary 모델이 overload 또는 사용 불가일 때 순서대로 시도할 최대 3개의 fallback 모델 구성. `--fallback-model`이 이제 인터랙티브 세션에도 적용됨.
- **deny 규칙 도구 이름 위치에서 glob 패턴 지원** — `"*"`는 모든 도구를 deny. allow 규칙은 non-MCP glob을 거부하며, deny 규칙의 알 수 없는 도구 이름은 시작 시 경고.
- **🔐 cross-session 메시징 보안 강화** — 다른 Claude 세션에서 `SendMessage`로 중계된 메시지가 더 이상 user authority를 가지지 않음. 수신자는 중계된 권한 요청을 거부하며 auto 모드도 차단.
- **`MAX_THINKING_TOKENS=0`, `--thinking disabled`, per-model thinking 토글이 default thinking 모델에서도 thinking 비활성화** (Claude API 경로. 3P provider는 변동 없음).
- **API가 예기치 못한 non-retryable 오류 반환 시 fallback 모델로 한 번 재시도** — auth, rate-limit, request-size, transport 오류는 여전히 즉시 표면화.
- **`claude update`가 다운로드 전 target 버전을 안내** — 더 이상 silent 상태로 빠지지 않음.
- **`claude agents` 목록에 URL 타이핑 시 첫 프롬프트에 해당 URL이 포함된 세션으로 필터링**.

## 🐛 버그 수정 (14건) — 카테고리별
- **이미지 / 토큰**:
  - 세션에서 처리 불가 이미지가 전송될 때 반복되는 "image could not be processed" 오류와 추가 토큰 사용량 수정.
- **원격 / 백그라운드 세션**:
  - 시작 시 worker registration 도중 짧은 백엔드 disruption 발생 시 원격 세션이 영구적으로 stuck되던 문제 수정.
  - `claude agents`에서 git worktree에 진입한 백그라운드 에이전트 세션이 재오픈 시 "No conversation found"로 crash-loop하던 문제 수정.
  - macOS에서 attach된 상태로 데몬이 죽은 후 orphaned `claude --bg-pty-host` 프로세스가 100% CPU 점유하던 문제 수정.
- **🪟 Windows / 터미널**:
  - JetBrains IDE 터미널(IntelliJ, PyCharm, WebStorm 등) 2026.1+ 버전의 깜빡임 수정 (synchronized output 활성화).
  - Kitty keyboard protocol을 사용하는 터미널(WezTerm, Ghostty, kitty)에서 Shift+non-ASCII 문자(예: Shift+ä → Ä)가 dropping되던 문제 수정.
  - Windows에서 killed 프로세스의 자식이 출력 파이프를 잡고 있을 때 PowerShell 명령 검증이 시간 budget을 훨씬 넘어 hang되던 문제 수정.
- **음성**:
  - `/voice` 토글 후 stale auth check 때문에 voice 모드가 `/login`을 요구하던 문제 수정.
- **관리 정책 / Managed Settings**:
  - 잘못된 항목 하나 때문에 나머지 유효한 관리 정책의 강제가 silently 비활성화되던 문제 수정.
  - `allowedMcpServers`/`deniedMcpServers` 정책이 `${VAR}` 참조 사용 시 매칭되지 않던 문제 수정.
- **UI / 렌더링**:
  - 스트리밍 중 Ctrl+O transcript 뷰에 thinking 텍스트가 중복 표시되던 문제 수정.
  - 원격 세션 내부에서 실행했는데도 `/doctor`가 "Not inside a remote session"으로 모순된 실패 체크를 표시하던 문제 수정.
  - `claude agents` dispatch 및 reply 입력에서 멀티라인 프롬프트 작성 시 커서가 첫 라인 끝에 sticking되던 문제 수정.
  - Unicode 미지원 터미널의 task 목록에서 백그라운드 에이전트 행 사이에 빈 라인이 나타나던 문제 수정.

## 🔑 이번 버전의 핵심 키워드
**"신뢰성/가용성 강화 + 권한 안전망 확장"** — Multi-fallback 모델 체인(`fallbackModel`)과 non-retryable 오류의 자동 fallback 재시도로 모델 장애 시 가용성을 끌어올렸습니다. 동시에 cross-session 메시징의 권한 인가 분리로 `SendMessage` 경로를 통한 권한 escalation 가능성을 차단하고, deny 규칙의 glob 지원과 managed-settings의 robustness를 보강했습니다. JetBrains IDE 깜빡임, Kitty keyboard protocol의 non-ASCII, macOS daemon 잔존 프로세스 등 환경별 누수도 함께 정리되었습니다.

---

# 📜 원문 (한글 번역본)

> 원문 ChangeLog를 원래 순서 그대로 한 줄도 빠짐없이 번역한 문서입니다.

- primary 모델이 overload되거나 사용 불가일 때 순서대로 시도할 최대 3개의 fallback 모델을 구성하는 `fallbackModel` 설정을 추가했습니다; `--fallback-model`이 이제 인터랙티브 세션에도 적용됩니다.
- deny 규칙 도구 이름 위치에 glob 패턴 지원을 추가했습니다 (`"*"`는 모든 도구를 deny); allow 규칙은 non-MCP glob을 거부하며, deny 규칙의 알 수 없는 도구 이름은 시작 시 경고합니다.
- cross-session 메시징을 강화했습니다: 다른 Claude 세션에서 `SendMessage`를 통해 중계된 메시지는 더 이상 user authority를 가지지 않습니다 — 수신자는 중계된 권한 요청을 거부하며, auto 모드는 이를 차단합니다.
- `MAX_THINKING_TOKENS=0`, `--thinking disabled`, per-model thinking 토글이 이제 Claude API를 통해 default로 thinking하는 모델에서도 thinking을 비활성화합니다 (3P provider는 변동 없음).
- API가 예기치 못한 non-retryable 오류를 거부할 때 Claude Code가 이제 fallback 모델로 턴을 한 번 재시도합니다; auth, rate-limit, request-size, transport 오류는 여전히 즉시 표면화됩니다.
- `claude update`가 이제 silent 상태로 빠지는 대신 다운로드 전 target 버전을 announce합니다.
- `claude agents`: 목록에 URL을 타이핑하면 이제 첫 프롬프트에 그 URL이 포함되었던 세션으로 필터링됩니다.
- 세션에서 처리 불가 이미지가 전송될 때 발생하던 반복적 "image could not be processed" 오류와 추가 토큰 사용량을 수정했습니다.
- 시작 시 worker registration 중 짧은 백엔드 disruption이 발생할 때 원격 세션이 영구적으로 stuck되던 문제를 수정했습니다.
- 2026.1+의 JetBrains IDE 터미널(IntelliJ, PyCharm, WebStorm 등)에서 synchronized output을 활성화하여 깜빡임을 수정했습니다.
- Kitty keyboard protocol을 사용하는 터미널(WezTerm, Ghostty, kitty)에서 Shift+non-ASCII 문자(예: Shift+ä → Ä)가 dropping되던 문제를 수정했습니다.
- Windows에서 killed 프로세스의 자식이 그 프로세스의 출력 파이프를 잡고 있을 때 PowerShell 명령 검증이 시간 budget을 훨씬 넘어 가끔 hang되던 문제를 수정했습니다.
- macOS에서 연결된 상태로 데몬이 죽은 후 orphaned `claude --bg-pty-host` 프로세스가 100% CPU에서 도는 문제를 수정했습니다.
- `/voice` 토글 후 stale auth check를 클리어하기 위해 voice 모드가 `/login`을 요구하던 문제를 수정했습니다.
- 잘못된 항목을 가진 managed settings가 남은 유효한 정책의 강제를 silently 비활성화시키던 문제를 수정했습니다.
- managed-settings `allowedMcpServers`/`deniedMcpServers` predicate가 `${VAR}` 참조를 사용할 때 매칭되지 않던 문제를 수정했습니다.
- git worktree에 진입한 백그라운드 에이전트 세션이 `claude agents`에서 재오픈될 때 "No conversation found"로 crash-loop하던 문제를 수정했습니다.
- 스트리밍 중 Ctrl+O transcript 뷰에서 중복된 thinking 텍스트 문제를 수정했습니다.
- 원격 세션 내부에서 실행되었을 때 `/doctor`가 모순된 실패 "Not inside a remote session" 체크를 표시하던 문제를 수정했습니다.
- `claude agents` dispatch와 reply 입력에서 멀티라인 프롬프트를 타이핑할 때 커서가 첫 라인 끝에 sticking되던 문제를 수정했습니다.
- Unicode 지원이 없는 터미널의 task 목록에서 백그라운드 에이전트 행 사이에 빈 라인이 나타나던 문제를 수정했습니다.

---

## 🎯 챌린지

이번 버전에서 내 환경에 적용해볼 만한 항목입니다.

### 1. fallbackModel 설정으로 Opus 과부하 대비
- **파일**: `~/.claude/settings.json`
- **근거**: 이번 버전에서 도입된 `fallbackModel`(최대 3개)을 추가하면 Opus 4.7 과부하/장애 시 Sonnet 4.6 → Haiku 4.5 순으로 자동 fallback. 현재 settings.json에 해당 키 없음.
- **난이도**: ★☆☆ (약 5분)

### 2. deny 규칙에 glob `"*"`로 위험 도구 일괄 차단
- **파일**: `~/.claude/settings.json` 의 `permissions.deny`
- **근거**: 이번 버전부터 deny 규칙에서 glob 패턴 지원. `Bash(rm -rf*)`, `Bash(git push --force*)` 같은 파괴적 명령 패턴을 deny에 추가해 안전망 구성. 현재 permissions 블록 자체가 비어 있음.
- **난이도**: ★★☆ (약 10분)

### 3. MAX_THINKING_TOKENS로 thinking 토큰 제어
- **파일**: `~/.claude/settings.json` 의 `env`
- **근거**: 이번 버전부터 `MAX_THINKING_TOKENS=0`이 default-thinking 모델(Opus 4.7 등)에서도 정확히 thinking을 비활성화. 빠른 응답이 필요한 작업 흐름에서 토큰 절감 효과. token-optimizer 플러그인을 쓰는 환경과 결합도 좋음.
- **난이도**: ★☆☆ (약 3분)

### 4. claude agents URL 필터 활용을 위한 단축 워크플로 메모
- **파일**: `~/.claude/CLAUDE.md` 또는 새 메모 (`reference-claude-agents-url-filter.md`)
- **근거**: 이번 버전부터 `claude agents` 목록에 URL을 타이핑하면 그 URL을 포함한 첫 프롬프트의 세션으로 필터링. Poplus 30개 마이크로서비스 학습 중인 사용자가 GitHub/Jira URL 기준으로 과거 세션을 빠르게 되찾는 데 유용 — 사용법을 메모로 박아두기.
- **난이도**: ★☆☆ (약 5분)

### 5. managed-settings의 `${VAR}` 참조 수정 검증
- **파일**: `~/.claude/settings.json` 의 `enabledPlugins` / 향후 추가할 `allowedMcpServers`
- **근거**: 이번 버전에서 `allowedMcpServers`/`deniedMcpServers`의 `${VAR}` 참조 매칭 버그 수정. 현재 4개 플러그인을 enabled 상태로 운영 중인데, MCP 서버 allow/deny 정책을 환경변수로 분리해 두면 작업/팀 컨텍스트별 토글이 가능해짐.
- **난이도**: ★★☆ (약 15분)
