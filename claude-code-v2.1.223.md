# Claude Code v2.1.223

> 작성일: 2026-08-11

---

# 📋 요약본

## 🎉 신기능 (3건)
- **마켓플레이스 조직 단위 와일드카드** — 관리형 설정 `strictKnownMarketplaces`·`blockedMarketplaces`에 `"owner/*"` 형식을 넣을 수 있다. GitHub 조직 하나 아래 모든 마켓플레이스 레포를 한 줄로 허용하거나 차단한다.
- **subagent 모델 제한 경고** — 워크플로우 에이전트·포크된 스킬·슬래시 커맨드·재개된 백그라운드 에이전트가 요청한 subagent 모델이 제한돼 부모 모델로 대체 실행되면 경고를 띄운다. 조용히 다른 모델로 도는 상황이 드러난다.
- **`/teleport` 힌트** — 클라우드 세션에서 `claude --teleport <session id>`로 로컬에서 이어받는 방법을 안내한다.

## 🛠️ 개선/수정 (16건)
- **Bash 권한 우회 차단** — 조작된 명령이 권한 검사에서 자기 일부를 숨길 수 있던 문제를 고쳤다.
- **권한 프롬프트 은닉 차단** — 탭·보이지 않는 유니코드로 패딩한 명령이 승인 대화상자에서 일부를 감추지 못하게 했다.
- **워크플로우 샌드박스 탈출 차단** — 워크플로우 스크립트가 동적 `import()`로 샌드박스 밖 코드를 실행하던 문제를 막았다.
- **`bypassPermissions` 정책 누수 수정** — 에이전트 정의의 `bypassPermissions` 모드가 조직의 bypass-permissions 비활성 정책을 무시하던 권한 구멍을 고쳤다.
- **세션 중간 `/cd` 후 재개** — 세션 도중 `/cd` 한 뒤 재개하면 빈 화면으로 돌아오던 문제를 고쳤다.
- **게이트웨이 모델 탐색** — `vertex_ai/claude-*`, `bedrock/anthropic.claude-*` 처럼 프로바이더 접두사가 붙은 ID로 등록된 Claude 모델이 목록에서 숨겨지던 문제를 고쳤다.
- **`modelOverrides` 키 처리** — Anthropic 모델 ID가 아닌 키를 세션의 표준 모델 ID로 취급하던 문제를 고쳤다. 문서대로 알 수 없는 키는 무시한다.
- **관리형 설정 env 병합** — 서버가 내려준 설정이 로컬 `managed-settings.json`이나 MDM 프로파일의 env 블록을 통째로 무력화하지 않는다. 관리자 env는 키 단위로 병합된다.
- **Linux 샌드박스 실행 실패** — `sandbox.filesystem.denyWrite`가 작업 디렉터리를 포함할 때 샌드박스 명령이 시작되지 않던 문제를 고쳤다.
- **포크 백그라운드 에이전트 고착** — 재개 중 포크의 부모 프롬프트 재구성이 실패하면 남은 세션 내내 "already resuming"에 갇히던 문제를 고쳤다.
- **잘못된 진단 첨부 처리** — 히스토리에 깨진 diagnostics 첨부가 있으면 재개된 세션이 매 턴 실패하거나 응답 없는 오류 화면에 머물던 문제를 고쳤다.
- **`git push` 출력 파싱 행 걸림** — 비정상적인 `git push` 출력에서 드물게 멈추던 문제를 고쳤다.
- **`CLAUDE_CODE_DISABLE_1M_CONTEXT` 확대 적용** — 고정 목록이 아니라 1M 네이티브 컨텍스트를 가진 모든 Claude 모델을 auto-compaction으로 200K에 묶는다. 200K 유지가 안 되면 시작 시 경고가 뜬다.
- **알 수 없는 모델 ID의 컨텍스트 관리** — 인식되지 않는 모델 ID의 세션도 가정된 컨텍스트 창 안에서 auto-compact 한다. 이전 동작으로 되돌리려면 `CLAUDE_CODE_DISABLE_UNKNOWN_MODEL_WINDOW_ENFORCEMENT=1`.
- **`/review` → `/code-review` 별칭화** — `/review`가 `/code-review`의 별칭이 됐다. 현재 diff 또는 PR을 리뷰한다(`/code-review <level> <pr#>`). 깊은 클라우드 리뷰는 `/code-review ultra`.
- **`/code-review` 레벨 기억** — 레벨 없이 실행하면 마지막에 입력한 레벨을 재사용한다. 바꾸려면 `/code-review high` 처럼 레벨을 붙인다.

## 🔑 이번 버전의 핵심 키워드
**"권한 우회 구멍 일괄 봉합 + 컨텍스트 창 강제 관리"** — 명령 은닉·샌드박스 탈출·조직 정책 무시 세 갈래의 권한 구멍을 막고, 모델별 컨텍스트 한도를 자동으로 붙잡는 버전.

---

# 📜 원문 (한글 번역본)

> 원문 ChangeLog를 원래 순서 그대로 한 줄도 빠짐없이 번역한 문서입니다.

- 관리형 설정 `strictKnownMarketplaces`·`blockedMarketplaces`에 소유자 와일드카드 항목(`"owner/*"`)을 추가했다. GitHub 조직 아래 모든 마켓플레이스 레포를 한 번에 허용하거나 차단할 수 있다
- 워크플로우 에이전트·포크된 스킬·슬래시 커맨드·재개된 백그라운드 에이전트가 요청한 subagent 모델이 제한되어 부모 모델이 대신 실행될 때 경고를 추가했다
- 클라우드 세션에서 `claude --teleport <session id>`로 로컬에서 이어가는 방법을 보여주는 `/teleport` 힌트를 추가했다
- 조작된 명령이 권한 검사에서 자기 일부를 숨길 수 있던 Bash 권한 우회를 고쳤다
- 탭이나 보이지 않는 유니코드로 패딩된 명령이 승인 대화상자에서 명령 일부를 숨기지 못하도록 권한 프롬프트를 고쳤다
- 워크플로우 스크립트가 동적 `import()`를 사용해 워크플로우 샌드박스 밖의 코드를 실행할 수 있던 문제를 고쳤다
- 에이전트 정의의 `bypassPermissions` 모드가 조직의 bypass-permissions 비활성화 정책을 무시하던 권한 구멍을 고쳤다
- 세션 중간에 `/cd` 한 뒤 세션을 재개하면 빈 상태로 돌아오던 문제를 고쳤다
- `vertex_ai/claude-*`나 `bedrock/anthropic.claude-*` 같은 프로바이더 접두사 ID로 등록된 Claude 모델을 게이트웨이 모델 탐색이 숨기던 문제를 고쳤다
- Anthropic 모델 ID가 아닌 `modelOverrides` 키를 세션의 표준 모델 ID로 취급하던 문제를 고쳤다. 이제 알 수 없는 키는 문서대로 무시된다
- 관리형 설정 수정: 서버가 전달한 설정이 더 이상 머신 로컬 `managed-settings.json`이나 MDM 프로파일의 env 블록을 비활성화하지 않는다. 관리자 env는 이제 키 단위로 병합된다
- `sandbox.filesystem.denyWrite`가 작업 디렉터리를 포함할 때 Linux에서 샌드박스 명령이 시작되지 않던 문제를 고쳤다
- 재개 중 포크의 부모 프롬프트 재구성이 실패하면 포크된 백그라운드 에이전트가 남은 세션 동안 "already resuming" 상태로 멈춰 있던 문제를 고쳤다
- 히스토리에 잘못된 형식의 diagnostics 첨부가 있을 때, 재개된 세션이 매 턴 실패하거나 대화형 앱이 응답 없는 오류 화면에 머물던 문제를 고쳤다
- 비정상적인 `git push` 출력을 파싱할 때 드물게 발생하던 행(hang)을 고쳤다
- `CLAUDE_CODE_DISABLE_1M_CONTEXT`를 고정 목록이 아니라 네이티브 1M 창을 가진 모든 Claude 모델에 대해 auto-compaction으로 200K에 묶도록 변경했다. auto-compaction이 세션을 200K로 유지하지 못하면 시작 시 경고가 표시된다
- auto-compact가 인식되지 않는 모델 ID의 세션을 그대로 늘어나게 두지 않고 가정된 컨텍스트 창 안에 유지하도록 변경했다. 이전 동작으로 되돌리려면 `CLAUDE_CODE_DISABLE_UNKNOWN_MODEL_WINDOW_ENFORCEMENT=1`을 설정한다
- `/review`를 `/code-review`의 별칭으로 변경했다. `/code-review`는 현재 diff 또는 PR을 리뷰한다(`/code-review <level> <pr#>`). 깊은 클라우드 리뷰에는 `/code-review ultra`를 사용한다
- 효과 수준 없이 실행한 `/code-review`가 마지막으로 입력한 수준을 재사용하도록 변경했다. 수준을 바꾸려면 `/code-review high`처럼 입력한다

---

## 🎯 챌린지

이번 버전에서 내 환경에 적용해볼 만한 항목입니다.

### 1. `[1m]` 모델 설정과 컨텍스트 강제 정책 확인
- **파일**: `~/.claude/settings.json`
- **근거**: 현재 `model`이 `claude-opus-4-8[1m]`로 1M 컨텍스트를 쓰고 있다. 이번 버전에서 `CLAUDE_CODE_DISABLE_1M_CONTEXT`가 1M 네이티브 모델 전체에 적용되도록 바뀌었으므로, 이 환경변수가 어딘가에 설정돼 있으면 의도치 않게 200K로 묶인다. `env` 블록과 셸 프로파일을 확인하고, 1M을 계속 쓸 거면 해당 변수가 없는지 확정한다.
- **난이도**: ★☆☆ (약 5분)

### 2. 마켓플레이스를 조직 와일드카드로 정리
- **파일**: `~/.claude/settings.json` (`extraKnownMarketplaces`) 또는 `~/.claude/managed-settings.json`
- **근거**: 지금 `anthropics/*`, `forrestchang`, `alexgreensh`, `Lum1104` 등 개별 레포를 하나씩 등록해 두고 있다. `strictKnownMarketplaces`에 `"anthropics/*"` 를 넣어 공식 마켓플레이스는 조직 단위로 허용하고, 나머지는 명시 항목만 남기면 신뢰 범위가 명확해진다.
- **난이도**: ★★☆ (약 15분)

### 3. subagent 모델 제한 경고를 Opus 라우팅 검증에 활용
- **파일**: `~/.claude/CLAUDE.md` §5 Model Routing
- **근거**: CLAUDE.md는 "모든 subagent는 Opus로 지정한다"를 규칙으로 두는데, 실제로 부모 모델로 대체 실행되는지 확인할 방법이 없었다. 이번 버전부터 요청 모델이 제한되면 경고가 뜬다. §5에 "경고가 뜨면 Opus 라우팅 실패로 간주하고 재실행" 한 줄을 추가해 규칙과 런타임 신호를 연결한다.
- **난이도**: ★☆☆ (약 5분)

### 4. `/code-review` 기본 레벨 고정
- **파일**: `~/.claude/CLAUDE.md` §7.1 검증 등급
- **근거**: `/code-review`가 레벨 없이 실행되면 마지막 입력 레벨을 재사용한다. 치명 등급에서만 리뷰하는 현재 정책과 맞물려, §7.1에 "치명 등급 리뷰는 `/code-review high` 이상으로 명시 호출" 을 적어 두면 이전 세션의 낮은 레벨이 조용히 재사용되는 사고를 막는다.
- **난이도**: ★☆☆ (약 5분)
