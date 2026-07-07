# Claude Code v2.1.172

> 작성일: 2026-06-11

---

# 📋 요약본

## 🎉 신기능 (4건)
- **서브에이전트의 중첩 spawn 지원** — 서브에이전트가 자체 서브에이전트를 spawn 가능, **최대 5단계 깊이까지**.
- **Amazon Bedrock의 AWS region 자동 감지** — `AWS_REGION`이 설정되지 않으면 `~/.aws` config 파일에서 읽음 (AWS SDK precedence와 일치). `/status`가 region 출처 표시.
- **`/plugin`의 마켓플레이스 플러그인 탐색에 검색 바 추가**.
- **`claude_code.lines_of_code.count` OTEL 메트릭에 `model` 속성 추가**.

## ⚙️ 개선 (8건)
- **긴 대화에서의 성능 개선** — 중복된 메시지 normalization 제거 + 스트리밍 tool-use 상태가 변하지 않을 때 전체 message-history transform 회피.
- **유휴 CPU 사용량 감소** — `/goal` 상태 chip이 idle 상태에서 5Hz로 터미널을 다시 그리지 않음 + 서브에이전트 병렬 실행 중 UI re-render 감소.
- **Claude in Chrome 도구 로딩 개선** — 브라우저 도구가 도구당 한 번씩이 아닌 단일 batched 호출로 로드.
- **non-interactive Usage Policy 거부 메시지 개선** — 새 세션 시작 또는 모델 변경을 제안.
- **`/code-review`에서 claude.ai 미로그인 사용자에게도 `ultra` 옵션 유지** — 클라우드 리뷰는 claude.ai 계정이 필요하다는 설명 포함.
- **Remote Control footer 표시 단축** — "/rc active"로 줄였고, 좁은 터미널에서는 숨김.
- **원격 세션에서 `/loop` 권유 중단** — pending loop가 컨테이너를 keep-alive 시키지 못하기 때문.
- **완전히 지원되지 않는 Windows 콘솔에서 마우스 트래킹 비활성화**.

## 🐛 버그 수정 (18건) — 카테고리별
- **컨텍스트 / 이미지**:
  - usage credit 없이 1M context를 사용하는 세션이 영구 stuck되던 문제 수정 — 이제 표준 context limit 아래로 자동 compact.
  - 대화에 여러 이미지가 포함될 때 "an image in the conversation could not be processed and was removed" 오류가 반복되던 문제 수정.
- **백그라운드 세션 / Agents View**:
  - worker가 답변한 후에도 세션이 최대 30초간 busy spinner와 함께 Working에 머물던 문제 수정.
  - pre-warmed worker로 dispatch된 백그라운드 에이전트가 다른 디렉토리의 프로젝트 설정(`.mcp.json` approval, trust)을 읽을 수 있던 문제 수정.
  - 데몬이 자동 업데이트된 후 이전 버전에서 시작된 세션의 백그라운드 세션 attach가 EAUTH로 실패하던 문제 수정.
  - spawn한 nested 에이전트가 중단된 후에도 백그라운드 서브에이전트가 agent 패널에서 "active" 상태로 stuck되던 문제 수정.
- **모델 선택 / `/model`**:
  - `claude agents` dispatch 입력의 `/model` 제안이 오해 소지가 있는 슬래시 prefix로 렌더링되고 조직에서 비활성화된 모델까지 표시하던 문제 수정.
  - `availableModels` 제한이 서브에이전트 모델 override, agent dispatch 모델 선택기, advisor 모델에 적용되지 않던 문제 수정.
  - `availableModels` allowlist가 `claude-opus-4-8` 같은 버전별 ID를 사용할 때 `/model` 선택기의 Opus / Sonnet 1M 행을 숨기던 문제 수정.
  - Bedrock의 `/model` 선택기가 provider가 제공하지 않는 모델을 표시하고, 선택 시 세션 모델이 silently 전환되며 여러 행에 선택 마커가 켜지던 문제 수정.
  - `ANTHROPIC_DEFAULT_OPUS_MODEL`이 이미 suffix를 포함하고 있을 때 모델 ID에 1M-context suffix가 중복되던(예: `[1M][1m]`) 문제 수정.
  - 자격이 있는 사용자의 `opusplan` 모델 설정이 plan 모드에서 1M context와 함께 출시되지 않던 문제 수정; `opusplan[1m]` workaround도 이제 plan 모드에서 Opus로 올바르게 전환.
- **🔐 권한 규칙**:
  - `WebFetch(domain:*.example.com)` wildcard 도메인 규칙이 allow, deny, ask 위치에서 서브도메인과 절대 매칭되지 않던 문제, 그리고 중간 패턴 와일드카드(예: `Read(secrets-*/config.json)`)를 가진 파일 권한 규칙이 시작 시 거부되던 문제 수정.
- **UI / 히스토리**:
  - 서브에이전트의 채팅 탭이 열려 있는 동안 ↑ prompt history가 메인 에이전트의 프롬프트를 표시하던 문제 수정.
- **메모리 / 원격 세션**:
  - 원격 세션에서 memory recall이 mount된 팀 memory store(`CLAUDE_MEMORY_STORES`)를 찾지 못하던 문제 수정.
- **워크플로우**:
  - 프롬프트 문자열이나 주석에 단순히 `Date.now()`/`Math.random()`을 언급한 스크립트를 workflow validation이 거부하던 문제 수정.
- **플러그인 UI**:
  - 긴 플러그인 목록에서 빠져나온 후 `/plugin` 마켓플레이스 목록의 cursor가 사라지던 문제, 그리고 플러그인 browser에서 Esc 시 잘못된 탭으로 돌아가던 문제 수정.
- **VS Code**:
  - PowerShell 도구 호출이 적절한 명령 표시와 권한 다이얼로그 대신 raw JSON으로 렌더링되던 문제 수정 + 표시되는 셸 출력에서 ANSI escape code 제거.

## 🔑 이번 버전의 핵심 키워드
**"중첩 에이전트 + 모델 선택 정합성"** — 서브에이전트가 자체 서브에이전트를 5단계까지 spawn할 수 있게 되어 동적 워크플로우의 표현력이 한 단계 확장되었습니다. 동시에 `availableModels` 제한이 dispatch picker / 서브에이전트 override / advisor / 1M 변형 등 모든 경로에서 일관되게 적용되도록 정돈했고, Bedrock의 region 자동 감지·1M suffix 중복·`opusplan[1m]` 같은 잡다한 모델 선택 정합성 누수를 광범위하게 정리했습니다. 1M context + credit 없음 시 영구 stuck 문제(자동 compact로 해결)와 nested 서브에이전트 stuck "active" 상태도 함께 정리된 안정화 버전입니다.

---

# 📜 원문 (한글 번역본)

> 원문 ChangeLog를 원래 순서 그대로 한 줄도 빠짐없이 번역한 문서입니다.

- 서브에이전트가 이제 자신의 서브에이전트를 spawn할 수 있습니다 (최대 5단계 깊이까지).
- Amazon Bedrock이 이제 `AWS_REGION`이 설정되지 않았을 때 `~/.aws` config 파일에서 AWS region을 읽으며, 이는 AWS SDK precedence와 일치합니다; `/status`가 region이 어디에서 왔는지 표시합니다.
- `/plugin`에서 마켓플레이스의 플러그인을 탐색할 때 검색 바를 추가했습니다.
- `claude_code.lines_of_code.count` OTEL 메트릭에 `model` 속성을 추가했습니다.
- usage credit 없이 1M context를 사용하는 세션이 영구적으로 stuck되던 문제를 수정했습니다 — 세션이 이제 표준 context limit 아래로 자동으로 compact됩니다.
- 대화에 여러 이미지가 포함되었을 때 반복되는 "an image in the conversation could not be processed and was removed" 오류를 수정했습니다.
- worker가 답변한 후에도 최대 30초 동안 에이전트 뷰가 busy spinner와 함께 세션을 Working에 유지하던 문제를 수정했습니다.
- pre-warmed worker로 dispatch된 백그라운드 에이전트가 잠재적으로 다른 디렉토리의 프로젝트 설정(`.mcp.json` approval, trust)을 읽을 수 있던 문제를 수정했습니다.
- 데몬이 자동 업데이트된 후 이전 버전에서 시작된 세션의 백그라운드 세션 attach가 EAUTH로 실패하던 문제를 수정했습니다.
- spawn한 nested 에이전트가 stop된 후 백그라운드 서브에이전트가 agent 패널에서 "active"로 stuck되던 문제를 수정했습니다.
- `claude agents` dispatch 입력의 `/model` 제안이 오해 소지가 있는 슬래시 prefix로 렌더링되고 조직에서 비활성화된 모델을 표시하던 문제를 수정했습니다.
- `availableModels` 제한이 서브에이전트 모델 override, agent dispatch 모델 선택기, advisor 모델에 적용되지 않던 문제를 수정했습니다.
- `availableModels` allowlist가 `claude-opus-4-8` 같은 버전별 ID를 사용할 때 `/model` 선택기의 Opus와 Sonnet 1M 행을 숨기던 문제를 수정했습니다.
- Bedrock의 `/model` 선택기가 provider가 제공하지 않는 모델을 제공하던 문제를 수정했습니다 — 그중 하나를 선택하면 세션 모델이 silently 전환되고 여러 행에 선택 마커가 켜졌습니다.
- `ANTHROPIC_DEFAULT_OPUS_MODEL`에 이미 하나가 포함되어 있을 때 모델 ID에 1M-context suffix가 중복되던(예: `[1M][1m]`) 문제를 수정했습니다.
- 자격이 있는 사용자의 경우 `opusplan` 모델 설정이 plan 모드에서 1M context와 함께 출시되지 않던 문제를 수정했습니다; `opusplan[1m]` workaround도 이제 plan 모드에서 Opus로 올바르게 전환합니다.
- `WebFetch(domain:*.example.com)` wildcard 도메인 규칙이 allow, deny, ask 위치에서 서브도메인에 절대 매칭되지 않던 문제, 그리고 중간 패턴 와일드카드를 가진 파일 권한 규칙(예: `Read(secrets-*/config.json)`)이 시작 시 거부되던 문제를 수정했습니다.
- 서브에이전트의 채팅 탭이 열려 있는 동안 ↑ prompt history가 메인 에이전트의 프롬프트를 표시하던 문제를 수정했습니다.
- 원격 세션에서 memory recall이 mount된 팀 memory store(`CLAUDE_MEMORY_STORES`)를 찾지 못하던 문제를 수정했습니다.
- 프롬프트 문자열이나 주석에서 단순히 `Date.now()`/`Math.random()`을 언급한 스크립트를 workflow validation이 거부하던 문제를 수정했습니다.
- 마우스 트래킹을 완전히 지원하지 않는 Windows 콘솔에서 마우스 트래킹을 비활성화합니다.
- 긴 플러그인 목록에서 backout한 후 `/plugin` 마켓플레이스 목록이 cursor를 잃던 문제, 그리고 플러그인 browser에서 Esc 시 잘못된 탭으로 돌아가던 문제를 수정했습니다.
- 중복된 메시지 normalization을 제거하고 스트리밍 tool-use 상태가 변경되지 않을 때 전체 message-history transform을 피함으로써 긴 대화에서의 성능을 개선했습니다.
- 유휴 CPU 사용량 감소: `/goal` 상태 chip이 idle 상태에서 5Hz로 터미널을 다시 그리지 않으며, 서브에이전트가 병렬로 실행되는 동안 UI re-render가 줄었습니다.
- Claude in Chrome 도구 로딩 개선: 브라우저 도구가 이제 도구당 하나의 호출이 아니라 단일 batched 호출로 로드됩니다.
- non-interactive Usage Policy 거부 메시지를 개선하여 새 세션을 시작하거나 모델을 변경할 것을 제안합니다.
- `/code-review`가 이제 claude.ai에 로그인하지 않은 경우에도 `ultra` 옵션을 계속 표시하며, 클라우드 리뷰는 claude.ai 계정이 필요하다는 설명을 포함합니다.
- Remote Control footer 표시기를 "/rc active"로 단축했으며 좁은 터미널에서는 숨겼습니다.
- pending loop가 컨테이너를 keep-alive 시키지 못하는 원격 세션에서 `/loop` 권유를 중단했습니다.
- [VSCode] PowerShell 도구 호출이 적절한 명령 표시와 권한 다이얼로그 대신 raw JSON으로 렌더링되던 문제를 수정했으며, 표시되는 셸 출력에서 ANSI escape code를 제거했습니다.

---

## 🎯 챌린지

이번 버전에서 내 환경에 적용해볼 만한 항목입니다.

### 1. 중첩 서브에이전트로 `subagent-driven-development` 재설계
- **파일**: `~/agent-infra/hooks/subagent-reload-claude.sh` 및 관련 dev 워크플로우 문서
- **근거**: 이번 버전부터 서브에이전트가 자체 서브에이전트를 5단계까지 spawn 가능. CLAUDE.md `7. 페르소나 라우팅`의 6단계 dev 워크플로우 중 review 단계에서 `review-agent`가 내부적으로 `code-review` → `qa-agent`를 직접 spawn하도록 묶으면 메인 컨텍스트 오염 없이 깊이 있는 검토 체인 구성 가능.
- **난이도**: ★★★ (약 30분)

### 2. `WebFetch` 와일드카드 도메인 권한 규칙 정비
- **파일**: `~/.claude/settings.json` (permissions 섹션)
- **근거**: `WebFetch(domain:*.example.com)` 같은 와일드카드가 이전엔 서브도메인 매칭이 깨져 있다가 이번에 수정됨. Poplus 사내 도메인이나 자주 쓰는 docs 사이트(`*.anthropic.com`, `*.poplus.*` 등)를 allow에 한 번에 등록해두면 deep-research·verify 스킬 사용 시 권한 프롬프트가 사라짐.
- **난이도**: ★☆☆ (약 5분)

### 3. `claude_code.lines_of_code.count` OTEL `model` 속성 활용 점검
- **파일**: `~/.claude/settings.json` (OTEL/telemetry 환경 변수) 또는 dashboard 스킬 출력
- **근거**: OTEL 메트릭에 `model` 속성이 추가됨. `token-optimizer:fleet-auditor`로 모델별 코드 생성량을 분리 분석할 수 있게 됨 — CLAUDE.md `5. Model Routing`의 "Opus는 보존, Sonnet 기본"이 실제 어디서 깨지는지 측정 가능.
- **난이도**: ★★☆ (약 15분)

### 4. `availableModels` allowlist 명시로 모델 누수 차단
- **파일**: `~/.claude/settings.json`
- **근거**: 이번 버전에서 `availableModels`가 서브에이전트 override·dispatch picker·advisor에까지 일관 적용되도록 수정됨. `claude-opus-4-7`, `claude-sonnet-4-6`, `claude-haiku-4-5-20251001` 세 개만 allowlist에 박아두면 서브에이전트가 임의의 구버전 모델로 silently 라우팅되는 경로를 차단할 수 있음.
- **난이도**: ★☆☆ (약 5분)

### 5. `/plugin` 마켓플레이스 검색 바로 플러그인 정리
- **파일**: `~/.claude/settings.json` `enabledPlugins`
- **근거**: 검색 바가 새로 들어와 마켓플레이스 탐색이 빨라짐. 현재 `andrej-karpathy-skills`는 비활성 상태인데 — 다시 켤지 완전히 제거할지 정리하고, agent-infra 진행 중인 워크플로우에 도움되는 새 플러그인이 있는지 5분만 훑어보면 됨.
- **난이도**: ★☆☆ (약 5분)
