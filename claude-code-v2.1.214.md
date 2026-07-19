# Claude Code v2.1.214

> 작성일: 2026-07-19

---

# 📋 요약본

## 🎉 신기능 (7건)
- **EndConversation 도구** — Claude 가 극도로 악의적인 사용자나 탈옥(jailbreak) 시도에 대해 세션을 종료할 수 있다. claude.ai 에서는 2025년부터 적용된 기능이다.
- **장시간 도구 호출 진행 하트비트** — 이전에는 조용히 멈춰 있던 오래 걸리는 도구 호출이 이제 주기적으로 진행 신호를 보낸다.
- **메모리 frontmatter `modified` 타임스탬프** — 메모리 파일에 ISO 형식 수정 시각이 자동 기록된다.
- **OTel 로그 속성 3종 추가** — `message.uuid`, `client_request_id`, `tool_source` 로 메시지 단위 상관관계와 도구 출처를 추적한다.
- **`CLAUDE_CODE_OTEL_CONTENT_MAX_LENGTH`** — OpenTelemetry content 속성의 60 KB 절단 한도를 환경변수로 조정한다.
- **`subagentStatusLine` 에 reasoning effort 추가** — 커스텀 서브에이전트 행이 모델과 effort 를 함께 렌더링할 수 있다.
- **`docker` 데몬 리다이렉트 권한 프롬프트** — `--url`·`--connection`·`--identity` 및 Podman 원격 모드 플래그를 담은 `docker` 명령(Podman shim 포함)이 이제 권한을 요구한다.

## 🛠️ 개선/수정 (40건)
- **Bash 권한 검사 fail-closed 강화** — 파일 디스크립터 리다이렉트, 10,000자 초과 초장문 명령, `[[ ]]` 안 zsh subscript·modifier, 위험 옵션을 담은 `help`·`man` 명령을 이제 자동 승인 대신 프롬프트로 돌린다.
- **권한 우회·규칙 매칭 수정** — Windows PowerShell 5.1 우회, 로컬 확인 대화상자보다 먼저 진행되던 원격 프롬프트, `Edit(src/**)` 같은 규칙이 트리 전체 중첩 `dir/` 를 자동 승인하던 문제를 고쳤다.
- **Windows PowerShell 도구 안정화** — 표준 입력 대기 시 타임아웃까지 멈춤, Python non-UTF-8 입력·비ASCII 출력 크래시, `where.exe`·`fc.exe`·`diff.exe` 오탐, `>`·`>>` 의 UTF-16LE 파일 생성 문제를 수정했다.
- **백그라운드 세션 수명주기 정리** — 후임 제어 소켓 삭제, 유휴 방치 세션의 데몬·워커 무기한 점유, 완료 세션 삭제 불가, 비 git 폴더 세션 삭제 불가, 중단 세션 복원 실패를 고쳤다.
- **세션 종료·드레인 수정** — 느린 소비자 대상 stream-json 출력 잘림(고정 2초 상한 → 대기 바이트 비례)과 기업 프록시 뒤 Windows "Socket is closed" 실패를 수정했다.
- **hook·예약 작업 수정** — stdout JSON 스키마 검증 실패 시 exit code 2 가 차단하지 않던 문제, 예약 작업이 자기 프롬프트를 거부하던 문제, 단일 세그먼트 `dir/**` hook `if:` 조건을 `<cwd>/dir` 로만 일치하도록 변경했다.
- **메모리·설정 파일** — frontmatter 값이 인라인 `#` 에서 조용히 잘리던 문제, `--settings` 가 대용량/디바이스 파일일 때 무제한 메모리 증가(이제 >2 MiB 시작 실패), `--settings` 로 활성화한 플러그인 미로드 회귀를 수정했다.
- **텔레메트리·플래그** — GrowthBook null 크래시와 플래그 캐시 소실, 이중 계산되던 비용·토큰 텔레메트리, OAuth 토큰 회전 후 stale 플래그, async 컨텍스트 밖 OTel trace 누락을 고쳤다.
- **CLI·진단** — 셸 설정 경로가 디렉터리일 때 `claude update`·`claude doctor` 멈춤, merge base 없는 레포에서 `/ultrareview` 거부, 에이전트 뷰의 `/install-github-app`·`/mcp` 차단, 홈 디렉터리 `claude rc` 신뢰 오류 안내를 개선했다.
- **기타** — `pkill -f` 가 CLI 자신을 죽이던 문제(Linux), 밀려난 데몬 소켓 삭제, Remote Control 오발동 알림, advisor 사고 중 잘못된 "check your network" 경고, MCP 일시 오류의 슬래시 커맨드 소실, `file -m`/`-f` 자동 허용 제거, stale 후 keep-alive 풀 비활성화, 포크 세션의 SessionStart 소스 `"fork"` 보고를 수정·변경했다.

## 🔑 이번 버전의 핵심 키워드
**"권한 검사는 애매하면 차단하고, 백그라운드 세션은 확실히 정리한다"** — Bash·PowerShell·docker 권한 검사를 fail-closed 로 조이고, 백그라운드 세션·데몬의 수명주기 누수를 걷어낸 하드닝 릴리스.

---

# 📜 원문 (한글 번역본)

> 원문 ChangeLog를 원래 순서 그대로 한 줄도 빠짐없이 번역한 문서입니다.

- `Edit(src/**)` 같은 단일 세그먼트 `dir/**` 허용 규칙이 `<cwd>/dir` 에만 적용되어야 하는데, 트리 어디에 있든 중첩된 `dir/` 디렉터리로의 쓰기를 자동 승인하던 문제 수정
- Windows PowerShell 5.1 세션에서 실행되는 명령에 영향을 주던 권한 검사 우회 문제 수정
- 권한 분석기와 다르게 bash 가 파싱하는 파일 디스크립터 리다이렉트 형태에서 Bash 권한 검사가 fail-closed(안전하게 차단)하도록 수정
- 매우 긴 명령을 잘못 판정하던 Bash 권한 검사 수정 — 10,000자를 초과하는 명령은 이제 자동 실행 대신 항상 프롬프트를 띄운다
- Bash 권한 검사가 `[[ ]]` 비교 안의 zsh 변수 subscript 와 modifier 를 무의미한 텍스트로 취급하던 문제 수정 — 이런 명령은 이제 승인 프롬프트를 띄운다
- 안전하지 않은 옵션·명령 치환·백슬래시 경로를 실행할 수 있는 특정 `help`·`man` 명령을 더 이상 자동 허용하지 않도록 Bash 권한 검사 수정
- 로컬 확인 대화상자보다 먼저 진행될 수 있던 원격 세션 권한 프롬프트 문제 수정
- EndConversation 도구 추가: Claude 가 극도로 악의적인 사용자나 탈옥(jailbreak) 시도에 대해 세션을 종료할 수 있다 (claude.ai 에서는 2025년부터 적용) — https://www.anthropic.com/research/end-subset-conversations 참조
- 이전에는 조용히 멈춰 있던 장시간 실행 도구 호출에 주기적 진행 하트비트 추가
- 메모리 파일 frontmatter 에 ISO `modified` 타임스탬프 추가
- 메시지 단위 상관관계와 도구 출처(provenance) 추적을 위해 OpenTelemetry 로그 이벤트에 `message.uuid`, `client_request_id`, `tool_source` 속성 추가
- OpenTelemetry content 속성의 60 KB 절단 한도를 설정하는 `CLAUDE_CODE_OTEL_CONTENT_MAX_LENGTH` 추가
- `subagentStatusLine` 페이로드에 reasoning effort 추가 — 커스텀 에이전트 행이 모델과 effort 를 렌더링할 수 있다
- 이전에는 프롬프트 없이 실행되던, 데몬 리다이렉트 플래그(`--url`, `--connection`, `--identity`, Podman 원격 모드)를 담은 `docker` 명령(Podman `docker` shim 포함)에 권한 프롬프트 추가
- GrowthBook 기능이 null 로 평가될 때의 크래시, 그리고 잘못된 형식의 플래그 페이로드가 캐시된 기능 플래그를 지워버리던 버그 수정
- `pkill -f` 패턴이 CLI 자신의 프로세스와 우연히 일치할 때 Bash 도구가 Claude 세션을 종료시키던 문제 수정 (Linux)
- `--settings` 가 디바이스 파일이나 수 GB 파일을 가리킬 때의 무제한 메모리 증가 수정 — 초과(>2 MiB) 설정 파일은 이제 시작 시 명확한 오류와 함께 실패한다
- 기업 프록시 뒤 Windows 에서 스트리밍 턴이 "Socket is closed" 로 실패하던 문제 수정
- 느리게 읽는 SDK/파이프라인 소비자에게 종료 시 stream-json 출력이 잘리던 문제 수정 — 종료 drain 이 이제 고정 2초 상한 대신 대기 중인 바이트 양에 따라 확장된다
- 예약 작업이 자신의 설정된 프롬프트를 신뢰할 수 없는 입력으로 거부하던 문제 수정 — 발동된 프롬프트는 이제 세션에 배정된 작업으로 전달된다
- 자식 프로세스가 표준 입력을 기다릴 때 PowerShell 도구 명령이 타임아웃까지 멈춰 있던 문제 수정 (Windows)
- PowerShell 도구에서 실행되는 Python 스크립트가 표준 입력에서 non-UTF-8 데이터를 읽을 때 UnicodeDecodeError 로 크래시하던 문제 수정 (Windows)
- PowerShell 도구로 실행되는 Python 스크립트가 non-ASCII 출력 시 UnicodeEncodeError 로 크래시하고, PowerShell 7 오류 메시지에 raw ANSI 이스케이프 시퀀스가 포함되던 문제 수정 (Windows)
- PowerShell 도구가 `where.exe`, `fc.exe`, `diff.exe` 가 유효한 음수(부정) 답을 반환할 때 이를 오류로 보고하던 문제 수정 (Windows)
- Windows PowerShell 5.1 의 PowerShell 도구에서 `>` 와 `>>` 가 다른 도구가 UTF-8 로 읽지 못하는 UTF-16LE 파일을 쓰던 문제 수정
- 밀려난 백그라운드 데몬이 종료 시 후임의 제어 소켓을 삭제해, 다음 클라이언트가 정상 교체 데몬을 죽이게 만들던 문제 수정
- `←` 또는 `/background` 로 대기시킨 뒤 방치된 백그라운드 세션이 백그라운드 데몬과 워커 프로세스를 무기한 살려두던 문제 수정
- 백그라운드 서비스가 유휴 상태가 되면 완료된 백그라운드 세션을 `claude rm` 이나 에이전트 뷰로 제거할 수 없던 문제 수정
- 비 git 폴더에서 디스패치된 백그라운드 세션을 에이전트 뷰에서 삭제할 수 없던 문제 수정
- 세션 저장소에 읽을 수 없는 폴더가 있을 때 중단된 백그라운드 세션을 다시 열면 저장된 대화를 복원하지 못하던 문제 수정
- Remote Control 이 명시적으로 활성화되지 않은 세션에 대해 "session ready" 푸시 알림이 발동하던 문제 수정
- 에이전트 뷰 세션에서 차단되던 `/install-github-app` 과 `/mcp` 설정 메뉴 수정 — 이제 터미널이 연결되지 않은 백그라운드 세션에서만 거부된다
- `--settings` CLI 플래그로 활성화한 플러그인이 로드되지 않던 문제 수정 (v2.1.181 이후의 회귀)
- OAuth 토큰이 회전된 뒤 장시간 세션에서 기능 플래그가 오래되던(stale) 문제 수정
- merge base 가 없는 레포에서 `/ultrareview` 가 실행을 거부하던 문제 수정 — 이제 추적 중인 모든 파일을 리뷰하도록 제안한다
- 셸 설정 경로가 디렉터리일 때 `claude update` 와 `claude doctor` 가 조용히 멈추고 `/status` 시스템 진단 섹션이 비던 문제 수정
- 메모리 파일 저장 시 frontmatter 값이 인라인 `#` 에서 조용히 잘리던 문제 수정
- 여러 누적 `message_delta` 프레임을 방출하는 스트림에서 세션 비용·토큰 텔레메트리가 이중 계산되던 문제 수정
- advisor 가 사고 중일 때 나타나던 잘못된 "check your network" 경고 수정
- hook 의 stdout JSON 이 스키마 검증에 실패할 때 exit code 2 hook 이 문서대로 차단하지 않던 문제 수정
- 턴의 async 컨텍스트 밖에서 방출된 OTel 로그 이벤트에 interaction span 의 trace 컨텍스트가 누락되던 문제 수정
- 프롬프트/리소스 새로고침 중 MCP 일시적 오류가 서버의 슬래시 커맨드와 리소스를 지워버리던 문제 수정
- 홈 디렉터리의 `claude rc` 워크스페이스 신뢰 오류 메시지를 개선 — 여기서는 신뢰가 절대 저장되지 않음을 알리고 프로젝트 디렉터리에서 실행하도록 제안한다
- 단일 세그먼트 `dir/**` hook `if:` 조건을 `<cwd>/dir` 에만 일치하도록 변경 — 임의 깊이 일치는 `**/dir/**` 로 작성한다. `deny`/`ask` 권한 규칙은 임의 깊이 일치를 유지한다
- `-m`/`--magic-file` 또는 `-f`/`--files-from` 을 쓰는 `file` 명령을 읽기 전용으로 자동 허용하던 것에서 권한 필요로 변경
- stale 연결 오류 발생 후 keep-alive 연결 풀링을 비활성화하도록 변경 — 재시도가 새 소켓을 연다
- 포크(fork)로 시작된 세션에 대해 SessionStart hook 이 `"resume"` 대신 소스 `"fork"` 를 보고하도록 변경

---

## 🎯 챌린지

이번 버전에서 내 환경에 적용해볼 만한 항목입니다.

### 1. 차단용 hook 의 exit-2 계약 점검
- **파일**: `~/agent-infra/hooks/deploy-guard.sh`, `~/.claude/settings.json` 의 UserPromptSubmit 컨텍스트 검사 hook
- **근거**: 이번 버전은 "hook 의 stdout JSON 이 스키마 검증에 실패하면 exit code 2 가 차단하지 않던" 버그를 고쳤다. `deploy-guard.sh` 와 컨텍스트 사용률 hook 은 `exit 2` 로 커밋/프롬프트를 막는 핵심 방어선이다. 두 스크립트가 사람용 메시지를 반드시 stderr(`>&2`)로 보내고 stdout 엔 스키마에 맞지 않는 JSON 을 흘리지 않는지 확인하면, 이번 수정과 무관하게 차단이 항상 동작함을 보장할 수 있다.
- **난이도**: ★★☆ (약 15분)

### 2. subagentStatusLine 로 서브에이전트 모델·effort 표시
- **파일**: `~/.claude/settings.json`
- **근거**: 이번 버전에서 `subagentStatusLine` 페이로드에 reasoning effort 가 추가돼 행마다 모델·effort 렌더링이 가능해졌다. 사용자는 "모든 subagent 는 Opus" 규칙과 `effortLevel: xhigh` 를 쓰므로, 서브에이전트 상태줄에 model+effort 를 띄우면 라우팅 실수(작은 모델로 새는 것)를 즉시 눈으로 잡을 수 있다.
- **난이도**: ★★☆ (약 20분)

### 3. 메모리 frontmatter `#` 절단 재점검
- **파일**: `/Users/leeseonro/.claude/projects/-Users-leeseonro-Document-BE/memory/*.md` 및 `~/.claude` 메모리 파일
- **근거**: 이번 버전은 "frontmatter 값이 인라인 `#` 에서 조용히 잘리던" 문제를 고쳤다. 사용자는 메모리 파일을 20개 이상 운용한다. `description:` 등 값에 `#` 이 포함돼 과거에 뒷부분이 사라진 항목이 없는지 grep 으로 한 번 훑고, 잘린 게 있으면 복구하면 된다.
- **난이도**: ★☆☆ (약 10분)
