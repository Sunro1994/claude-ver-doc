# Claude Code v2.1.193

> 작성일: 2026-06-26

---

# 📋 요약본

## 🎉 신기능 (6건)
- **`autoMode.classifyAllShell` 설정** — 모든 Bash/PowerShell 명령을 auto-mode 분류기로 보낸다. 기존에는 임의 코드 실행(arbitrary-code-execution) 패턴만 분류했으나, 이제 전체 셸 명령을 대상으로 한다.
- **auto-mode 거부 사유 노출** — auto-mode가 차단한 이유를 transcript, 거부 토스트, `/permissions` 최근 거부 목록 세 곳에 모두 기록한다.
- **`claude_code.assistant_response` OpenTelemetry 로그 이벤트** — 모델 응답 텍스트를 담는 로그 이벤트를 추가했다. 기본은 비공개(redacted)이며 `OTEL_LOG_ASSISTANT_RESPONSES=1`일 때만 노출된다.
  - 이 변수가 미설정이면 `OTEL_LOG_USER_PROMPTS`를 따른다. 따라서 이미 프롬프트를 로깅하던 배포 환경은 **업그레이드 즉시 응답 내용까지 수집**하기 시작한다. 프롬프트만 유지하려면 `OTEL_LOG_ASSISTANT_RESPONSES=0`을 명시해야 한다.
- **bash 모드(`!`) 실시간 파일 경로 자동완성** — 셸 입력 중 파일 경로를 실시간으로 자동완성한다.
- **MCP 인증 필요 시 시작 알림** — MCP 서버가 인증을 요구하면 시작 시 알림을 띄우고 `/mcp`로 안내한다.
- **유휴 백그라운드 셸 자동 회수** — 메모리 압박 시 유휴 상태의 백그라운드 셸 명령을 자동으로 회수한다. `CLAUDE_CODE_DISABLE_BG_SHELL_PRESSURE_REAP=1`로 끌 수 있다.

## 🛠️ 개선/수정 (9건)
- **`/login` 직후 stale 상태 수정** — `/login` 직후 `/model` 등 클라이언트 데이터에 의존하는 UI가 오래된/빈 상태로 보이던 문제를 고쳤다.
- **백그라운딩(←←) 오취소 수정** — 모든 실행 태스크가 새 세션으로 이월됨에도 "N background tasks would be abandoned"로 잘못 취소되던 문제를 고쳤다.
- **고정 백그라운드 에이전트 재프롬프트 수정** — 고정된 백그라운드 에이전트가 자동 업데이트마다 "Continue from where you left off"로 다시 묻던 문제를 고쳤다.
- **phantom 서브에이전트 수정** — 메인 턴을 백그라운딩할 때 메인 대화를 다시 실행하는 유령 "general-purpose (resumed)" 서브에이전트가 생기던 문제를 고쳤다.
- **형제 에이전트 숨김 수정** — 서브에이전트를 볼 때 에이전트 패널이 형제 에이전트를 숨기던 문제를 고쳤다.
- **백그라운드 에이전트 동작 개선** — launch 결과가 더 이상 "end your response"를 지시하지 않는다. 에이전트가 도는 동안 다른 작업을 계속한다.
- **MCP `headersHelper` 인증 개선** — 도구 호출이 401/403을 반환하면 헬퍼가 자동으로 재실행·재연결한다.
- **플러그인 자동 이름변경 개선** — marketplace `renames` 맵을 자동으로 따라가 설정을 새 이름으로 갱신한다.
- **`/add-dir` 메시지 개선** — 이미 작업 디렉터리인 경로를 추가할 때의 메시지를 개선했다.

## 🔑 이번 버전의 핵심 키워드
**"모든 셸을 분류기에 태우고, 백그라운드 에이전트·셸의 생애주기를 다듬는다"** — 셸 명령 전수 분류와 거부 사유 가시화, 그리고 백그라운드 작업·에이전트의 잔존·중복·오취소를 정리한 안정화 릴리스.

---

# 📜 원문 (한글 번역본)

> 원문 ChangeLog를 원래 순서 그대로 한 줄도 빠짐없이 번역한 문서입니다.

- 임의 코드 실행(arbitrary-code-execution) 패턴만이 아니라 모든 Bash/PowerShell 명령을 auto-mode 분류기로 라우팅하는 `autoMode.classifyAllShell` 설정을 추가했다.
- auto-mode 거부 사유를 transcript, 거부 토스트, `/permissions` 최근 거부 목록에 추가했다.
- 모델 응답 텍스트를 담는 `claude_code.assistant_response` OpenTelemetry 로그 이벤트를 추가했다. `OTEL_LOG_ASSISTANT_RESPONSES=1`이 아니면 비공개 처리(redacted)되며, 이 변수가 미설정이면 `OTEL_LOG_USER_PROMPTS`를 따른다. 따라서 이미 프롬프트 내용을 로깅하던 배포 환경은 업그레이드 시 응답 내용까지 수신하기 시작하므로, 프롬프트만 유지하려면 `OTEL_LOG_ASSISTANT_RESPONSES=0`으로 설정하라.
- bash 모드(`!`)에 실시간 파일 경로 자동완성을 추가했다.
- MCP 서버가 인증을 필요로 할 때 `/mcp`를 가리키는 시작 알림을 추가했다.
- 유휴 백그라운드 셸 명령에 대한 메모리 압박 자동 회수를 추가했다(`CLAUDE_CODE_DISABLE_BG_SHELL_PRESSURE_REAP=1`로 비활성화).
- `/login` 직후 `/model` 등 클라이언트 데이터에 의존하는 UI가 오래되거나 빈 상태로 표시되던 문제를 고쳤다.
- 실행 중인 모든 태스크가 새 세션으로 이월됨에도 백그라운딩(←←)이 "N background tasks would be abandoned"로 잘못 취소되던 문제를 고쳤다.
- 고정된 백그라운드 에이전트가 자동 업데이트마다 "Continue from where you left off"로 다시 프롬프트되던 문제를 고쳤다.
- 메인 턴을 백그라운딩할 때 메인 대화를 다시 실행하는 유령 "general-purpose (resumed)" 서브에이전트가 생성되던 문제를 고쳤다.
- 서브에이전트를 볼 때 에이전트 패널이 형제 에이전트를 숨기던 문제를 고쳤다.
- 백그라운드 에이전트를 개선했다. launch 결과가 더 이상 Claude에게 "end your response"를 지시하지 않고, 에이전트가 실행되는 동안 다른 작업을 계속한다.
- MCP `headersHelper` 인증을 개선했다. 도구 호출이 401/403을 반환하면 헬퍼가 자동으로 재실행되고 재연결된다.
- 플러그인 자동 이름변경을 개선했다. marketplace `renames` 맵을 자동으로 따라가 설정을 새 이름으로 갱신한다.
- 디렉터리가 이미 작업 디렉터리인 경우의 `/add-dir` 메시지를 개선했다.

---

## 🎯 챌린지

이번 버전에서 내 환경에 적용해볼 만한 항목입니다.

### 1. 모든 셸 명령을 auto-mode 분류기에 태우기
- **파일**: `~/.claude/settings.json`
- **근거**: `autoMode.classifyAllShell` 신설. 현재 환경은 `deploy-guard.sh`(Bash PreToolUse)와 read-once hook으로 셸·읽기를 강하게 통제한다. 이 설정을 켜면 임의 코드 실행 패턴뿐 아니라 **모든** Bash 명령이 분류기를 거치므로 hook 보안 라인과 결이 맞는다.
- **난이도**: ★☆☆ (약 5분)

### 2. 백그라운드 대시보드 서버가 유휴 회수에 죽지 않게 보호
- **파일**: `~/.claude/settings.json` (`env` 블록)
- **근거**: 이번 버전부터 메모리 압박 시 유휴 백그라운드 셸을 자동 회수한다. `claude-ver-dashboard`(5174 포트 로컬 서버)처럼 띄워두고 쓰는 백그라운드 프로세스가 유휴 판정으로 끊길 수 있다. `CLAUDE_CODE_DISABLE_BG_SHELL_PRESSURE_REAP=1`을 `env`에 추가해 의도치 않은 종료를 막는다. (장시간 백그라운드 서버를 쓰지 않으면 적용하지 말 것.)
- **난이도**: ★☆☆ (약 5분)

### 3. OTEL 응답 로깅 누출 방지선 선제 설정
- **파일**: `~/.claude/settings.json` (`env` 블록)
- **근거**: `claude_code.assistant_response`가 신설되며, `OTEL_LOG_USER_PROMPTS`가 켜진 환경은 업그레이드 즉시 응답 본문까지 수집한다. secret leak·개인문서 검사를 중시하는 환경이므로, OTEL을 쓰지 않더라도 `OTEL_LOG_ASSISTANT_RESPONSES=0`을 미리 박아두면 향후 OTEL 활성화 시 응답 본문 유출을 원천 차단한다. (선제적 방어 — 현재 OTEL 미사용이면 무영향.)
- **난이도**: ★☆☆ (약 5분)
