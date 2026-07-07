# Claude Code v2.1.191

> 작성일: 2026-06-25

---

# 📋 요약본

## 🎉 신기능 (1건)
- **`/rewind`로 `/clear` 이전 대화 복원** — `/clear`를 실행하기 전 시점부터 대화를 다시 이어갈 수 있다. 실수로 컨텍스트를 지웠을 때의 복구 경로를 제공한다.

## 🛠️ 개선/수정 (19건)
- **스트리밍 중 스크롤 튐 수정** — 응답 스트리밍 도중 이전 출력을 읽을 때 스크롤이 맨 아래로 튀던 문제를 고쳤다.
- **백그라운드 에이전트 부활 수정** — 중지한 에이전트가 다시 살아나던 문제를 고쳐, 작업 패널에서의 중지가 이제 영구적이다.
- **`/voice` 정책 메시지 수정** — 조직 정책으로 비활성화된 경우 일반 "사용 불가" 대신 제한 사유를 설명한다.
- **`/login` URL 잘림 수정** — Windows Terminal에서 줄바꿈될 때 URL이 잘려 열리던 문제를 고쳤다.
- **Ghostty Cmd+클릭 수정** — ssh/tmux 위 Ghostty 전체화면 모드에서 링크 Cmd+클릭이 동작하도록 했다.
- **`claude agents` 슬래시 명령 처리 수정** — `/usage` 같은 내장 명령을 프롬프트 텍스트로 보내던 문제를 고쳐 힌트를 표시한다.
- **`claude agents` 이미지 경로 표시 수정** — 붙여넣은 이미지에 전체 경로 대신 `[Image #N]` 자리표시자를 보여준다.
- **쉼표 matcher hook 수정** — `"Bash,PowerShell"`처럼 쉼표로 구분된 matcher hook이 조용히 한 번도 실행되지 않던 문제를 고쳤다.
- **`/permissions` 거부 승인 유지 수정** — Recently-denied 탭에서 승인한 항목이 닫을 때 폐기되지 않고 유지된다.
- **에이전트 패널 행 튐 수정** — roster를 overflow cap 너머로 스크롤할 때 패널이 한 행씩 튀던 문제를 고쳤다.
- **환영 스플래시 아트 오버플로 수정** — 기본 80×24 macOS Terminal 창에서 아트가 넘치던 문제를 고쳤다.
- **managed settings 수정** — `forceRemoteSettingsRefresh`가 MDM·파일 정책으로 설정 시 적용되고, fetch에 `Cache-Control: no-cache`를 보내 프록시의 stale 응답을 막는다.
- **샌드박스 네트워크 권한 대화상자 개선** — "Yes"로 허용한 호스트를 세션 동안 기억해 매 연결마다 다시 묻지 않는다.
- **MCP 서버 안정성 개선** — capability discovery(`tools/list`, `prompts/list`, `resources/list`)가 일시적 네트워크 오류를 짧은 backoff로 재시도한다.
- **MCP OAuth 개선** — discovery·token 요청이 일시 오류 후 1회 재시도하고, headless 환경은 브라우저 팝업 없이 URL 붙여넣기 프롬프트로 직행한다.
- **MCP 오류 메시지 개선** — HTTP 404 오류가 URL을 보여주고 MCP 설정 위치를 가리킨다.
- **vim 모드 기록 검색 개선** — NORMAL `/` 검색에서 슬래시 명령에 도달하는 방법을 힌트로 안내한다.
- **스트리밍 CPU 사용량 감소** — 텍스트 업데이트를 100ms로 합쳐 CPU 사용량을 약 37% 줄였다.
- **긴 세션 메모리 증가 감소** — 터미널 출력 캐시로 인한 메모리 증가를 줄였다.

## 🔑 이번 버전의 핵심 키워드
**"끊긴 흐름을 되살리는 복원력 릴리스"** — `/rewind`로 지운 대화를 복구하고, 중지·재시도·hook·캐시 관련 결함을 광범위하게 손봤다.

---

# 📜 원문 (한글 번역본)

> 원문 ChangeLog를 원래 순서 그대로 한 줄도 빠짐없이 번역한 문서입니다.

- `/clear`를 실행하기 이전 시점부터 대화를 다시 이어가는 `/rewind` 지원 추가
- 스트리밍 응답 도중 이전 출력을 읽고 있을 때 스크롤 위치가 맨 아래로 튀던 문제 수정
- 중지된 백그라운드 에이전트가 다시 살아나던 문제 수정 — 작업 패널에서 에이전트를 중지하면 이제 영구적으로 중지됨
- 조직 정책으로 비활성화된 경우 `/voice`가 일반적인 "사용 불가" 메시지를 보여주던 문제 수정 — 이제 제한 사유를 설명함
- 줄바꿈되어 여러 줄로 표시될 때 Windows Terminal에서 `/login` URL이 잘려서 열리던 문제 수정
- ssh/tmux 위 Ghostty 전체화면 모드에서 링크 Cmd+클릭이 동작하지 않던 문제 수정
- `claude agents`가 `/usage` 같은 내장 슬래시 명령을 힌트로 보여주는 대신 프롬프트 텍스트로 백그라운드 세션에 보내던 문제 수정
- `claude agents` 작업 행에서 붙여넣은 이미지에 대해 `[Image #N]` 자리표시자 대신 전체 파일시스템 경로를 보여주던 문제 수정
- 쉼표로 구분된 matcher(예: `"Bash,PowerShell"`)를 가진 hook이 조용히 한 번도 실행되지 않던 문제 수정
- `/permissions`의 Recently-denied 탭: 거부 항목을 승인하면 이제 조용히 폐기되지 않고 닫을 때 유지됨
- roster를 overflow cap 너머로 스크롤할 때 에이전트 패널이 한 행씩 튀던 문제 수정
- 기본 80×24 macOS Terminal 창에서 환영 스플래시 아트가 넘쳐 흐르던 문제 수정
- managed settings 수정: `forceRemoteSettingsRefresh`가 MDM 또는 파일 정책으로 설정됐을 때 이제 적용되며, 프록시가 오래된 응답을 제공하지 못하도록 fetch에 `Cache-Control: no-cache`를 전송함
- 샌드박스 네트워크 권한 대화상자 개선: "Yes"로 허용한 호스트를 매 연결마다 다시 묻지 않고 세션 동안 기억함
- MCP 서버 안정성 개선: capability discovery(`tools/list`, `prompts/list`, `resources/list`)가 이제 일시적 네트워크 오류를 짧은 backoff와 함께 재시도함
- MCP OAuth 개선: discovery 및 token 요청이 일시적 네트워크 오류 후 한 번 재시도하며, headless 환경에서는 브라우저 팝업을 건너뛰고 곧장 URL 붙여넣기 프롬프트로 진행함
- MCP 오류 메시지 개선: HTTP 404 오류가 이제 URL을 보여주고 MCP 설정을 가리킴
- vim 모드 프롬프트 기록 검색(NORMAL `/`) 개선 — 슬래시 명령에 도달하는 방법을 힌트로 안내
- 텍스트 업데이트를 100ms로 합쳐 스트리밍 응답 중 CPU 사용량을 약 37% 감소
- 긴 세션의 터미널 출력 캐시로 인한 메모리 증가 감소

---

## 🎯 챌린지

이번 버전에서 내 환경에 적용해볼 만한 항목입니다.

### 1. 중복 `task-checkbox-sync.sh` hook을 `"Write,Edit"` 단일 matcher로 통합
- **파일**: `~/.claude/settings.json`
- **근거**: 현재 `PostToolUse`에서 `Write`와 `Edit` 블록이 각각 `task-checkbox-sync.sh`를 따로 호출한다. 이번 버전이 쉼표 matcher hook이 조용히 실행되지 않던 버그를 고쳤으므로, 두 호출을 `"matcher": "Write,Edit"` 한 블록으로 합칠 수 있다. (`doc-sprawl-warn.sh`는 `Write` 전용이므로 그대로 둔다.) 중복이 줄고 동기화 누락 위험이 사라진다.
- **난이도**: ★★☆ (약 10~15분, 통합 후 파일 Write/Edit로 실제 발화 확인)

### 2. `/permissions` Recently-denied에서 반복 거부 항목 영구 승인
- **파일**: `~/.claude/settings.json` (permissions allowlist)
- **근거**: 이번 버전에서 Recently-denied 탭의 승인이 닫을 때 폐기되지 않고 유지되도록 고쳐졌다. MCP 커넥터와 도구가 많은 환경이라 반복적으로 재승인하는 항목이 쌓이기 쉽다. 탭을 열어 항상 허용하는 도구를 승인하면 allowlist에 반영돼 이후 권한 프롬프트가 줄어든다.
- **난이도**: ★☆☆ (약 5~10분)
