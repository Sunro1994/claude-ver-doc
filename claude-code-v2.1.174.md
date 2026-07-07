# Claude Code v2.1.174

> 작성일: 2026-06-12

---

# 📋 요약본

## 🎉 신기능 (2건)
- **`wheelScrollAccelerationEnabled` 설정 추가** — 풀스크린 모드에서 마우스 휠 스크롤 가속을 비활성화할 수 있는 옵션.
- **[VSCode] `/usage`에 사용량 attribution 추가** — Account & usage 다이얼로그가 cache miss, long context, 서브에이전트, 그리고 스킬/에이전트/플러그인/MCP별 breakdown을 최근 24시간 또는 7일 기준으로 표시.

## 🐛 버그 수정 (11건) — 카테고리별
- **모델 선택 / `/model`**:
  - `/model` 선택기가 Default가 resolve되는 모델 family를 숨기던 문제 수정 — 이제 Max/Team Premium/Enterprise 플랜에서는 Opus, Pro/Team 플랜에서는 Sonnet, pay-as-you-go API 계정에서는 Opus가 자체 행으로 표시.
  - `ANTHROPIC_DEFAULT_SONNET_MODEL`이 다른 Sonnet을 pin할 때 `/model` 선택기가 하드코딩된 Sonnet 버전 라벨을 표시하던 문제 수정.
  - `/advisor` 다이얼로그가 `availableModels` allowlist에 의해 차단된 저장된 advisor 모델을 pre-select하던 문제 수정.
- **결제 / 청구**:
  - usage-based billing을 사용하는 enterprise 계정에 "Fable 5 is now consuming usage credits" 배너가 잘못 표시되던 문제 수정.
- **🔐 Bedrock GovCloud**:
  - Bedrock GovCloud region(`us-gov-*`)이 `us-gov` 대신 `global`로 잘못된 inference profile prefix를 derive하여 derived 모델 ID에서 400 오류가 발생하던 문제 수정.
- **백그라운드 세션 / 환경 변수**:
  - 백그라운드 데몬을 시작한 셸로부터 다른 세션의 `ANTHROPIC_*` provider 환경 변수(gateway URL, custom 헤더, `/model` alias)를 백그라운드 세션이 상속받던 문제 수정.
  - pre-warmed 백그라운드 worker가 idle 상태로 있다가 claim될 때 "Could not resolve authentication method"로 실패하던 문제 수정.
- **macOS / Linux 종료**:
  - 셸 명령이 interrupt되거나 killed된 직후 Claude Code 종료 시 1-2초 pause가 발생하던 문제 수정.
- **Git / Attribution**:
  - 일부 모델에서 git commit co-author attribution이 잘못된 모델 이름을 표시하던 문제 수정.
  - Workflow 도구의 `agent()` 서브에이전트에 per-agent attribution 헤더가 누락되던 문제 수정.
- **스킬 / 핫리로드**:
  - 단일 스킬이 변경되었을 때 skill hot-reload가 전체 스킬 목록을 다시 전송하던 문제 수정 — 이제 변경된 스킬만 재공지.

## 🔑 이번 버전의 핵심 키워드
**"모델 선택 UX 정돈 + 백그라운드/엔터프라이즈 정합성"** — `/model` 선택기에서 Default가 어떤 모델로 resolve되는지 명확히 표시되도록 다듬었고, `ANTHROPIC_DEFAULT_SONNET_MODEL`·`/advisor` allowlist 같은 모델 선택 정합성 누수를 추가로 정리했습니다. 동시에 Bedrock GovCloud의 region prefix 오류, 백그라운드 세션의 다른 셸 env 누수, pre-warmed worker의 idle 후 auth 실패 등 백그라운드·엔터프라이즈 환경의 잔여 결함을 잡고, [VSCode]에는 `/usage`에 풍부한 attribution breakdown(스킬/에이전트/플러그인/MCP별)이 추가되어 비용 가시성이 한층 좋아졌습니다.

---

# 📜 원문 (한글 번역본)

> 원문 ChangeLog를 원래 순서 그대로 한 줄도 빠짐없이 번역한 문서입니다.

- 풀스크린 모드에서 마우스 휠 스크롤 가속을 비활성화하는 `wheelScrollAccelerationEnabled` 설정을 추가했습니다.
- `/model` 선택기가 Default가 resolve되는 모델 family를 숨기던 문제를 수정했습니다 — Opus는 이제 Max/Team Premium/Enterprise 플랜에서, Sonnet은 Pro/Team 플랜에서, Opus는 pay-as-you-go API 계정에서 자체 행으로 나타납니다.
- `ANTHROPIC_DEFAULT_SONNET_MODEL`이 다른 Sonnet을 pin할 때 `/model` 선택기가 하드코딩된 Sonnet 버전 라벨을 표시하던 문제를 수정했습니다.
- usage-based billing을 사용하는 enterprise 계정에 "Fable 5 is now consuming usage credits" 배너가 잘못 표시되던 문제를 수정했습니다.
- Bedrock GovCloud region(`us-gov-*`)이 `us-gov` 대신 `global`이라는 잘못된 inference profile prefix를 derive하여 derived 모델 ID에서 400 오류를 발생시키던 문제를 수정했습니다.
- 백그라운드 데몬을 시작한 셸로부터 다른 세션의 `ANTHROPIC_*` provider env(gateway URL, custom header, `/model` alias)를 백그라운드 세션이 상속하던 문제를 수정했습니다.
- macOS와 Linux에서 셸 명령이 interrupt되거나 killed된 직후 Claude Code를 종료할 때 1-2초 pause가 발생하던 문제를 수정했습니다.
- 일부 모델에 대해 git commit co-author attribution이 잘못된 모델 이름을 표시하던 문제를 수정했습니다.
- `/advisor` 다이얼로그가 `availableModels` allowlist에 의해 차단된 저장된 advisor 모델을 pre-select하던 문제를 수정했습니다.
- 단일 스킬이 변경되었을 때 skill hot-reload가 전체 스킬 목록을 다시 전송하던 문제를 수정했습니다; 이제 변경된 스킬만 재공지됩니다.
- Workflow 도구 `agent()` 서브에이전트에 per-agent attribution 헤더가 누락되던 문제를 수정했습니다.
- [VSCode] Account & usage 다이얼로그(`/usage`)에 cache miss, long context, 서브에이전트, 그리고 스킬/에이전트/플러그인/MCP별 breakdown을 최근 24시간 또는 7일 기준으로 보여주는 사용량 attribution을 추가했습니다.
- pre-warmed 백그라운드 worker가 idle 상태로 있다가 claim될 때 "Could not resolve authentication method"로 실패하던 문제를 수정했습니다.

---

## 🎯 챌린지

이번 버전에서 내 환경에 적용해볼 만한 항목입니다.

### 1. 마우스 휠 스크롤 가속 비활성화
- **파일**: `~/.claude/settings.json`
- **근거**: 이번 버전에 추가된 `wheelScrollAccelerationEnabled: false` 설정으로 풀스크린 모드에서 긴 ChangeLog·plan 파일을 스크롤할 때 가속으로 인한 위치 놓침을 막을 수 있다. agent-infra spec/plan 같은 긴 문서를 자주 보는 환경에 도움이 된다.
- **난이도**: ★☆☆ (약 2분)

### 2. `/usage`로 스킬·플러그인별 토큰 attribution 확인
- **파일**: VSCode에서 `/usage` 실행 (확인용, 파일 수정 없음)
- **근거**: 이번 버전부터 `/usage`가 최근 24시간/7일 기준으로 스킬·에이전트·플러그인·MCP별 breakdown을 보여준다. token-optimizer, understand-anything, vercel, superpowers 등 다수 플러그인이 활성화된 현재 환경에서 어느 스킬이 토큰을 가장 많이 쓰는지 실제 수치로 확인하면 quality bar 튜닝의 근거가 된다.
- **난이도**: ★☆☆ (약 5분)

### 3. `/model` 선택기에서 Default resolve 모델 재확인
- **파일**: 터미널에서 `/model` 실행 (확인용)
- **근거**: 이번 버전에서 Default가 어떤 모델 family로 resolve되는지(Pro/Team→Sonnet, Max→Opus 등)가 명시적으로 노출된다. CLAUDE.md의 "Sonnet 기본, Opus는 architecture/synthesis만" 정책이 실제로 어떤 모델로 매핑되는지 확인하고, 의도와 다르면 명시적 alias로 고정한다.
- **난이도**: ★☆☆ (약 3분)

### 4. Workflow agent() attribution 헤더 활용한 회고 추가
- **파일**: `~/agent-infra/hooks/session-end-retro.sh`
- **근거**: 이번 버전에서 Workflow `agent()` 서브에이전트에 per-agent attribution 헤더가 복구됐다. SessionEnd retro hook이 어떤 서브에이전트가 어떤 토큰을 썼는지 attribution 헤더 기반으로 집계하면, 8개나 쌓인 retro draft를 더 구조화된 데이터로 정리할 수 있다.
- **난이도**: ★★☆ (약 20분)

### 5. 백그라운드 세션 env 누수 점검
- **파일**: `~/.zshrc`, `~/.claude/settings.json`
- **근거**: 이번 버전에서 백그라운드 데몬을 시작한 셸의 `ANTHROPIC_*` env(gateway URL, custom 헤더, `/model` alias)가 다른 세션으로 누수되던 버그가 수정됐다. `.zshrc`에 export된 `ANTHROPIC_*` 변수가 있는지 점검하고, 의도치 않게 모든 세션에 적용되는 것을 settings.json `env` 블록으로 옮기면 격리성이 좋아진다.
- **난이도**: ★★☆ (약 10분)
