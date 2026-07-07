# Claude Code v2.1.161

> 작성일: 2026-06-02

---

# 📋 요약본

## 🎉 신기능 / 동작 변경 (5건)
- **`OTEL_RESOURCE_ATTRIBUTES` 값을 메트릭 데이터포인트의 라벨로 포함** — team, repo 같은 custom dimension으로 usage 메트릭 slicing 가능.
- **`claude agents` 행에 `done/total` 표시** — 작업이 fan-out된 경우 detail 앞에 진행률 표시, peek는 가장 오래 실행 중인 항목 표시.
- **`/mcp`에서 사용한 적 없는 claude.ai 커넥터를 "Show unused connectors" 행 뒤에 collapse**.
- **병렬 도구 호출 동작 개선** — 같은 batch에서 실패한 Bash 명령이 다른 호출을 더 이상 취소하지 않음. 각 도구가 독립적으로 결과 반환.
- **풀스크린 모드 클립보드 확장** — Linux에서 사용 가능 시 `wl-copy`/`xclip`/`xsel` 사용, 클립보드와 PRIMARY 선택 영역 모두에 복사(가운데 클릭 paste 가능), "hold {key} for native selection" 힌트가 터미널별로 올바른 키 표시.

## ⚙️ 개선 (3건)
- **layout engine JIT 컴파일 프로필 안정화로 터미널 렌더링 성능 개선**.
- **대용량 파일 쓰기 렌더링 성능 개선**.
- **[VSCode] 깨진 글리프 수정을 위한 터미널 GPU 가속 비활성화(또는 `/terminal-setup` 실행) 팁 추가**.

## 🐛 버그 수정 (14건) — 카테고리별
- **♿ 접근성**:
  - "Reduce motion" 설정이 `/effort` 다이얼로그, 워크플로우 애니메이션, 프롬프트 키워드 shimmer에 적용되지 않던 문제 수정.
- **🔐 인증 / 관리 정책**:
  - `forceLoginOrgUUID`/`forceLoginMethod` managed-settings 정책이 third-party provider 세션(Bedrock, Vertex, Foundry, Mantle)을 org pin과 함께 차단하던 문제 수정 (v2.1.146 회귀).
  - `/usage-credits`가 Team/Enterprise 관리자에게 조직의 usage 설정 페이지를 가리키는 대신 재로그인을 시작하던 문제 수정.
- **🔐 보안 / 비밀**:
  - `claude mcp` list/get/add가 터미널에 비밀을 출력하던 문제 수정 — `${VAR}` 참조는 더 이상 expand되지 않으며 credential 헤더와 URL secret은 redact됨.
- **출력 / 통합**:
  - `--output-format text` 또는 `json` 사용 시 백그라운드 서브에이전트 출력이 `claude -p` stdout을 corrupt하던 문제 수정.
- **세션 / 워크트리**:
  - 세션이 git worktree 또는 다른 저장소 내부에 있을 때 `/autofix-pr`이 "cannot run on the default branch"로 보고하던 문제 수정.
  - 현재 디렉토리가 git worktree가 아닐 때(예: jj workspace) `--resume` 선택기가 해당 디렉토리의 세션을 표시하지 않던 문제 수정.
- **🪟 Windows**:
  - bash를 명시적으로 호출하는 Windows 훅(예: `/usr/bin/bash script.sh`)이 "command not found" 또는 "cannot execute binary file"로 실패하던 문제 수정.
- **OpenTelemetry**:
  - 텔레메트리 초기화 완료 이전에 emit된 OpenTelemetry 로그 이벤트(`user_prompt`, `api_request`, `tool_result`, `tool_decision`)가 silently drop되던 문제 수정.
- **워크플로우 / 백그라운드 세션**:
  - 백그라운드 세션에서 `isolation: "worktree"`로 spawn된 워크플로우 에이전트가 자신의 worktree 내부 파일 편집이 차단되던 문제 수정.
  - `claude agents`에서 dispatch된 백그라운드 세션이 `settings.json`의 모델 대신 데몬 환경의 stale 모델로 booting되던 문제 수정.
- **렌더링 / 안정성**:
  - 세션 재개 후 Write 도구 결과 렌더링 시 발생할 수 있던 잠재적 crash 수정.
  - 결과 finalize 중 오류 발생 시 완료된 서브에이전트가 running 상태로 멈춰 표시되던 문제 수정.
- **임시 디렉토리**:
  - `CLAUDE_CODE_TMPDIR`가 깊은 경로로 설정될 때 `$TMPDIR` 아래 Unix 소켓을 bind하는 도구의 `EADDRINUSE` 오류 수정.

## ⚠️ 주목할 회귀 수정
- **v2.1.146 회귀**: `forceLoginOrgUUID`/`forceLoginMethod` managed-settings 정책이 third-party provider 세션을 차단

## 🔑 이번 버전의 핵심 키워드
**"관측성 강화 + 병렬 처리 / 통합 환경 정합성"** — OTEL 메트릭에 custom dimension 라벨링과 `claude agents`의 done/total 진행률 등 관측성을 끌어올렸습니다. 동시에 병렬 도구 호출이 한 실패에 따라 다른 호출이 취소되지 않도록 격리되고, jj workspace, worktree, Bedrock/Vertex/Foundry/Mantle 등 다양한 통합 환경의 정합성 누수를 정리했습니다. **`claude mcp` 출력에서 비밀을 redact**한 보안 패치도 포함되어 있습니다.

---

# 📜 원문 (한글 번역본)

> 원문 ChangeLog를 원래 순서 그대로 한 줄도 빠짐없이 번역한 문서입니다.

- `OTEL_RESOURCE_ATTRIBUTES` 값이 이제 메트릭 데이터포인트의 라벨로 포함되어, team이나 repo 같은 custom dimension으로 usage 메트릭을 slicing할 수 있습니다.
- 작업이 fan-out될 때 `claude agents` 행이 이제 detail 앞에 `done/total`을 표시하며; peek는 가장 오래 실행 중인 항목을 표시합니다.
- `/mcp`가 이제 한 번도 sign in하지 않은 claude.ai 커넥터를 "Show unused connectors" 행 뒤로 collapse합니다.
- 병렬 도구 호출: 실패한 Bash 명령이 같은 batch의 다른 호출을 더 이상 취소하지 않습니다 — 각 도구는 자신의 결과를 독립적으로 반환합니다.
- 풀스크린 모드: 클립보드가 이제 Linux에서 사용 가능할 때 `wl-copy`/`xclip`/`xsel`을 사용하고, 가운데 클릭 paste를 위해 클립보드와 PRIMARY 선택 영역 모두에 복사하며, "hold {key} for native selection" 힌트가 이제 터미널마다 올바른 키를 표시합니다.
- `/effort` 다이얼로그, 워크플로우 애니메이션, 프롬프트 키워드 shimmer가 "Reduce motion" 설정을 존중하지 않던 문제를 수정했습니다.
- `forceLoginOrgUUID`/`forceLoginMethod` managed-settings 정책이 org pin과 함께 third-party provider 세션(Bedrock, Vertex, Foundry, Mantle)을 차단하던 문제를 수정했습니다 (v2.1.146 회귀).
- `--output-format text` 또는 `json`을 사용할 때 백그라운드 서브에이전트 출력이 `claude -p` stdout을 corrupt하던 문제를 수정했습니다.
- `/usage-credits`가 Team과 Enterprise 관리자에게 조직의 usage 설정 페이지를 가리키는 대신 재로그인을 시작하던 문제를 수정했습니다.
- 세션이 git worktree 또는 다른 저장소 내부에 있을 때 `/autofix-pr`이 "cannot run on the default branch"를 보고하던 문제를 수정했습니다.
- 현재 디렉토리가 git worktree가 아닐 때(예: jj workspace) `--resume` 선택기가 해당 디렉토리의 세션을 표시하지 않던 문제를 수정했습니다.
- bash를 명시적으로 호출하는 Windows 훅(예: `/usr/bin/bash script.sh`)이 "command not found" 또는 "cannot execute binary file"로 실패하던 문제를 수정했습니다.
- 텔레메트리 초기화 완료 전에 emit된 OpenTelemetry 로그 이벤트(`user_prompt`, `api_request`, `tool_result`, `tool_decision`)가 silently drop되던 문제를 수정했습니다.
- `claude mcp` list/get/add가 비밀을 터미널에 출력하던 문제를 수정했습니다: `${VAR}` 참조는 더 이상 expand되지 않으며, credential 헤더와 URL 비밀은 redact됩니다.
- 백그라운드 세션에서 `isolation: "worktree"`로 spawn된 워크플로우 에이전트가 자신의 worktree 내부 파일 편집이 차단되던 문제를 수정했습니다.
- `claude agents`에서 dispatch된 백그라운드 세션이 `settings.json`의 모델 대신 데몬 환경의 stale 모델로 booting되던 문제를 수정했습니다.
- 세션 재개 후 Write 도구 결과 렌더링 시 발생할 수 있는 잠재적 crash를 수정했습니다.
- 결과를 finalize하는 중 오류가 발생할 때 완료된 서브에이전트가 running으로 stuck되어 표시되던 문제를 수정했습니다.
- `CLAUDE_CODE_TMPDIR`가 깊은 경로로 설정될 때 `$TMPDIR` 아래 Unix 소켓을 bind하는 도구에서 발생하던 `EADDRINUSE` 오류를 수정했습니다.
- layout engine의 JIT 컴파일 프로필을 안정화하여 터미널 렌더링 성능을 개선했습니다.
- 대용량 파일 쓰기에 대한 렌더링 성능을 개선했습니다.
- [VSCode] 깨진 글리프를 수정하기 위해 터미널 GPU 가속을 비활성화(또는 `/terminal-setup` 실행)할 것을 제안하는 팁을 추가했습니다.
