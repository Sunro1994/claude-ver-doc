# Claude Code v2.1.163

> 작성일: 2026-06-04

---

# 📋 요약본

## 🎉 신기능 / 동작 변경 (6건)
- **`requiredMinimumVersion` / `requiredMaximumVersion` managed settings 추가** — Claude Code 버전이 허용 범위 밖이면 시작을 거부하고 승인된 버전으로 안내.
- **`/plugin list` 명령 추가** — 설치된 플러그인 목록 표시. `--enabled`/`--disabled` 필터 지원.
- **`/btw`에 "c to copy" 단축키 추가** — raw markdown 답변을 클립보드에 복사하여 다른 곳에 paste 시 formatting 유지.
- **훅 동작 확장** — Stop과 SubagentStop 훅이 이제 `hookSpecificOutput.additionalContext`를 반환하여 hook error로 라벨링되지 않으면서 Claude에게 피드백을 주고 턴을 이어갈 수 있음.
- **스킬에 `\$` escape 문법** — 명령 body의 숫자 앞에 literal `$`를 포함하기 위해 사용.
- **stdio MCP 서버가 `--resume` 시에도 hooks/Bash와 동일한 `CLAUDE_CODE_SESSION_ID` 수신**.

## ⚙️ 개선 (4건)
- **백그라운드 에이전트 세션이 새 Claude Code 버전으로 백그라운드 업데이트** — 업데이트 후 세션 오픈 시 더 이상 cold restart 대기 없음.
- **`/` 메뉴의 내장 명령 및 스킬 설명 명확화**.
- **구독 전환 제안이 토스트 대신 시작 announcement 슬롯에 표시**.
- **`claude agents`에서 state-grouped 뷰로부터 dispatch한 세션이 agent view를 연 디렉토리에서 시작**.

## 🐛 버그 수정 (12건) — 카테고리별
- **`claude -p` / Headless / CI**:
  - 백그라운드 명령이 끝나지 않을 때 `claude -p`가 최종 결과 후 영원히 hang되던 문제 수정 — 결과 후 stdin이 닫히면 백그라운드 셸이 약 5초 뒤 중지됨.
  - `CI=true`이며 Anthropic API 키 미설정 상태의 Bedrock/Vertex/Foundry에서 `claude -p`가 "ANTHROPIC_API_KEY required"로 실패하던 문제 수정.
- **Bash / 환경 변수 (회귀)**:
  - bazel 및 EDR 보호된 Go 워크플로우에서 bash 명령 실패 수정 — `$TMPDIR`가 sandboxed 명령뿐 아니라 모든 명령에 대해 `/tmp/claude-{uid}`로 override되던 문제 (v2.1.154 회귀).
- **🪟 Windows**:
  - 세션-env 디렉토리에 read-only 속성이 있거나 OneDrive 내부에 있을 때 Bash 명령이 "EEXIST: file already exists"로 실패하던 문제 수정.
- **🔐 관리 정책 / 권한**:
  - 새 config 디렉토리에서 시작 중 managed settings fetch가 완료될 때 org-managed 권한 규칙이 세션 전체에 적용되지 않던 문제 수정.
  - 홈 디렉토리 경로의 deny 규칙(예: `Read(~/Desktop/**)`)이 `$HOME`을 통해 경로를 참조하는 Bash 명령을 차단하지 못하던 문제 수정.
- **백그라운드 세션 / Agents View**:
  - `claude agents`의 백그라운드 세션이 Claude Code 업데이트 후 reattach될 때 실행 중이던 백그라운드 작업을 잃던 문제 수정.
  - Esc로 agent view를 빠져나갈 때 터미널 misalignment와 수 초 hang 수정.
  - 데스크톱 앱에서 백그라운드 작업 chip의 Stop 클릭이 underlying 프로세스가 이미 사라진 경우 chip을 클리어하지 않던 문제 수정.
- **입력 / UI**:
  - paste 작업의 end marker가 터미널에 의해 drop될 때 키보드 입력이 영구적으로 응답 없게 되던 문제 수정.
  - 훅 `if: "Bash(...)"` 조건이 `$()` 또는 `$VAR`를 포함하는 모든 Bash 명령에서 발동하던 문제 수정 — 패턴이 이제 subshell과 backtick 내부 명령에도 매칭됨.
  - `/mcp`, `/plugins` 같은 panel 다이얼로그를 닫은 후 transcript에 stray "(no content)" 라인이 남던 문제 수정.

## ⚠️ 주목할 회귀 수정
- **v2.1.154 회귀**: `$TMPDIR`가 모든 명령(sandboxed 외)에도 `/tmp/claude-{uid}`로 override되어 bazel 및 EDR-protected Go 워크플로우의 bash 명령 실패

## 🔑 이번 버전의 핵심 키워드
**"엔터프라이즈 통제 + Headless 신뢰성"** — `requiredMinimumVersion`/`requiredMaximumVersion`로 조직 관리자가 허용 가능한 클라이언트 버전을 엄격 통제할 수 있게 되었습니다. Stop/SubagentStop 훅의 `additionalContext`는 훅을 hook error 라벨링 없이 대화 흐름에 정상 참여시키는 자연스러운 경로를 제공합니다. 동시에 `claude -p`의 hang/CI 회귀, `$TMPDIR` 회귀(v2.1.154), Windows OneDrive 세션-env, 홈 디렉토리 deny 규칙 등 headless·관리 정책 경로의 정합성 누수가 광범위하게 정리되었습니다.

---

# 📜 원문 (한글 번역본)

> 원문 ChangeLog를 원래 순서 그대로 한 줄도 빠짐없이 번역한 문서입니다.

- `requiredMinimumVersion`과 `requiredMaximumVersion` managed settings를 추가했습니다 — Claude Code는 자신의 버전이 허용 범위 밖이면 시작을 거부하고 사용자를 승인된 버전으로 안내합니다.
- 설치된 플러그인 목록을 보여주는 `/plugin list` 명령을 추가했으며, `--enabled`/`--disabled` 필터를 지원합니다.
- `/btw`에 raw markdown 답변을 클립보드에 복사하여 다른 곳에 paste할 때 formatting을 보존하는 "c to copy" 단축키를 추가했습니다.
- 훅: Stop과 SubagentStop 훅이 이제 `hookSpecificOutput.additionalContext`를 반환하여 hook error로 라벨링되지 않고 Claude에게 피드백을 주고 턴을 이어갈 수 있습니다.
- 스킬: 명령 body의 숫자 앞에 literal `$`를 포함하기 위한 `\$` escape 문법을 추가했습니다.
- stdio MCP 서버가 이제 `--resume` 시 hooks/Bash와 동일한 `CLAUDE_CODE_SESSION_ID`를 받습니다.
- 백그라운드 명령이 절대 끝나지 않을 때 `claude -p`가 최종 결과 후 영원히 hang되던 문제를 수정했습니다 — 백그라운드 셸은 이제 stdin이 닫힌 후 결과 약 5초 뒤에 중지됩니다.
- `CI=true`이고 Anthropic API 키가 설정되지 않은 상태에서 Bedrock/Vertex/Foundry의 `claude -p`가 "ANTHROPIC_API_KEY required"로 실패하던 문제를 수정했습니다.
- bazel 및 EDR-보호된 Go 워크플로우에서 bash 명령이 실패하던 문제를 수정했습니다: `$TMPDIR`가 sandboxed 명령에만 적용되는 대신 모든 명령에 대해 `/tmp/claude-{uid}`로 override되던 문제 (v2.1.154 회귀).
- 세션-env 디렉토리에 read-only 속성이 있거나 OneDrive 내부에 있을 때 Windows의 Bash 명령이 "EEXIST: file already exists"로 실패하던 문제를 수정했습니다.
- managed settings fetch가 새 config 디렉토리에서 시작 중 완료될 때 org-managed 권한 규칙이 전체 세션에 대해 적용되지 않던 문제를 수정했습니다.
- `claude agents`의 백그라운드 세션이 Claude Code 업데이트 후 재attach될 때 실행 중이던 백그라운드 작업을 잃던 문제를 수정했습니다.
- Esc를 눌러 agent view를 종료할 때 발생하던 터미널 misalignment와 수 초의 hang을 수정했습니다.
- 데스크톱 앱에서 백그라운드 작업 chip의 Stop을 클릭해도 underlying 프로세스가 이미 사라진 상태일 때 chip이 클리어되지 않던 문제를 수정했습니다.
- 종료 마커가 터미널에 의해 drop된 paste 작업 이후 키보드 입력이 영구적으로 응답 없게 되던 문제를 수정했습니다.
- `if: "Bash(...)"` 훅 조건이 `$()` 또는 `$VAR`를 포함하는 모든 Bash 명령에서 발동되던 문제를 수정했습니다; 패턴이 이제 subshell과 backtick 내부 명령에도 매칭됩니다.
- 홈 디렉토리 경로의 deny 규칙(예: `Read(~/Desktop/**)`)이 `$HOME`을 통해 경로를 참조하는 Bash 명령을 차단하지 못하던 문제를 수정했습니다.
- /mcp와 /plugins 같은 panel 다이얼로그를 닫은 후 transcript에 stray "(no content)" 라인이 남던 문제를 수정했습니다.
- 백그라운드 에이전트 세션이 이제 새 Claude Code 버전으로 백그라운드에서 업데이트되므로, 업데이트 후 세션을 여는 것이 더 이상 cold restart를 기다리지 않습니다.
- / 메뉴의 내장 명령과 스킬에 대한 더 명확한 설명을 제공합니다.
- 구독 전환 제안이 이제 토스트 대신 시작 announcement 슬롯에 표시됩니다.
- state-grouped 뷰로부터 dispatch한 `claude agents`가 이제 agent view를 연 디렉토리에서 세션을 시작합니다.

---

## 🎯 챌린지

이번 버전에서 내 환경에 적용해볼 만한 항목입니다.

### 1. Stop 훅으로 컨텍스트 사용률을 turn 종료 시점에도 알려주기
- **파일**: `~/.claude/settings.json`
- **근거**: 이번 버전부터 Stop/SubagentStop 훅이 `hookSpecificOutput.additionalContext`를 반환해 hook error 라벨 없이 Claude에게 자연스러운 피드백을 줄 수 있습니다. 현재 UserPromptSubmit에서만 컨텍스트 사용률을 체크하는데, Stop 훅에도 동일 measure.py를 붙여 턴 종료 시 80%↑면 다음 턴 시작 전 `/compact` 안내를 additionalContext로 흘려보내면 막판 hang을 예방할 수 있습니다.
- **난이도**: ★★☆ (약 15분)

### 2. `/plugin list --enabled`로 실제 활성 플러그인 점검
- **파일**: (명령 실행만) `claude` 세션 내에서 `/plugin list --enabled`
- **근거**: settings.json `enabledPlugins`에 superpowers / karpathy / token-optimizer / understand-anything 4개가 켜져 있는데, marketplace fetch나 cache 경로 문제로 실제 로드 상태가 다를 수 있습니다. 이번 버전에 새로 추가된 `/plugin list` 필터로 "설정상 enabled vs 실제 enabled" 차이를 한 번 확인해두면 좋습니다.
- **난이도**: ★☆☆ (약 3분)

### 3. `requiredMinimumVersion`을 settings에 명시해 회귀 버전 방지
- **파일**: `~/.claude/settings.json`
- **근거**: 이번 버전이 v2.1.154의 `$TMPDIR` 회귀를 고친 패치인 만큼, `"requiredMinimumVersion": "2.1.163"`을 박아두면 향후 다운그레이드나 오래된 바이너리로 실수로 실행하는 상황을 차단할 수 있습니다. 단일 사용자 환경에서도 회귀 가드 용도로 유효합니다.
- **난이도**: ★☆☆ (약 2분)

### 4. `Read(~/Desktop/**)` 같은 홈 deny 규칙 추가로 민감 경로 차단
- **파일**: `~/.claude/settings.json` (`permissions.deny`)
- **근거**: 이번 버전에서 `~`로 시작하는 deny 규칙이 `$HOME` 경유 Bash 명령까지 제대로 차단하도록 수정됐습니다. 이전엔 우회되던 패턴이라 안 걸어둔 사용자가 많은데, Poplus 30개 마이크로서비스를 학습 중인 환경에서 데스크톱·다운로드 같은 비작업 경로를 deny에 넣어두면 안전 마진이 늘어납니다.
- **난이도**: ★☆☆ (약 5분)

### 5. `/btw` + "c to copy"로 답변을 외부 노트로 옮기는 루틴화
- **파일**: (행동 변경) Poplus 학습 메모 작성 시
- **근거**: 이번 버전에 `/btw`에 "c to copy" 단축키가 추가돼 raw markdown이 그대로 복사됩니다. STUDY_PLAN.md나 Mermaid 다이어그램이 포함된 학습 정리를 Notion·Obsidian으로 옮길 때 코드블록·표 포맷이 깨지지 않아 Unity 1주 집중 트랙 기록에 바로 쓸모가 있습니다.
- **난이도**: ★☆☆ (약 3분)
