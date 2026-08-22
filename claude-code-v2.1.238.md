# Claude Code v2.1.238

> 작성일: 2026-08-22

---

# 📋 요약본

## 🎉 신기능 (5건)
- **`keybindingFlavor` 설정 추가** — `"readline"` 로 두면 프롬프트에서 Ctrl+W 가 Bash 처럼 앞쪽 공백까지 지운다. 기본값 `"classic"` 은 그대로다.
- **플러그인 마켓플레이스 `headersHelper`** — url 마켓플레이스나 카탈로그 항목에 `headersHelper` 를 두면, 명령을 실행해 HTTP 헤더(예: 단기 토큰)를 만들어 카탈로그·동일 출처 아카이브 요청에 붙인다.
  - 카탈로그 항목의 `headersHelper` 는 해당 플러그인을 설치·업데이트할 때만 실행되고, 실행할 명령을 먼저 보여준다. `claude plugin install/update` 는 `[y/N]` 로 묻는다(`-y` 로 생략).
- **`claude self-hosted-runner --defer-shutdown-max-min <minutes>`** — SIGTERM 을 받아도 붙어 있는 세션은 계속 처리하고, 지정한 분이 지나면 남은 것을 park 한 뒤 종료한다.
- **`claude self-hosted-runner --proxy-authorization-command` / `--proxy-authorization-file`** — 연결마다 새로 발급한 `Proxy-Authorization` 헤더를 요구하는 egress 프록시용 옵션이다.
- **크로스 세션 메시징 실패 통보** — 같은 기기의 세션이 수신을 거부하거나(`crossSessionInbound: "refuse"`) 받은편지함이 메시지를 버리면(rate limit·큐 포화) 보낸 세션에 "거부됨"·"드롭됨"이 알려진다. 전에는 조용히 성공으로 보였다.

## 🛠️ 개선/수정 (30건)
- **긴 세션 메모리 누수 수정** — 서브에이전트 도구 결과가 최근 표시 창에서 벗어나면 해제된다. 무한정 늘던 메모리가 잡혔다.
- **출력 스타일 유지** — 커스텀·프로젝트·플러그인 출력 스타일이 세션 중간에 기본 어조로 되돌아가는 문제를 고쳤다.
- **`CLAUDE_CODE_ENABLE_PROMPT_SUGGESTION=true`** — 사용량 한도에 근접했지만 넘지는 않은 계정에서 프롬프트 제안이 꺼지던 문제를 고쳤다.
- **worktree 격리 Bash 거부 메시지** — 리다이렉트가 없는 명령에도 "리다이렉트를 지우라"고 안내하던 문구를 고쳤다.
- **self-hosted runner 오제거** — 폴링 한 번이 느리거나 유실됐을 뿐인데 서버가 러너를 제거하고 정상 세션을 다른 러너에 넘기던 문제를 고쳤다.
- **MCP elicitation 대화상자** — URL 이 4,096자를 넘으면 아무것도 안 보이던 문제, 그리고 프로젝트 경로가 터미널 폭에 안 맞을 때 권한 프롬프트에서 "다시 묻지 않기" 옵션이 사라지던 문제를 고쳤다.
- **`/tmp/claude-*-cwd` 잔여 파일** — Bash 명령이 kill·타임아웃·중단될 때 남던 파일을 정리한다.
- **Backspace 연타 무시** — Backspace 로 Ctrl+H 를 보내는 터미널에서 키 입력이 몰려 들어올 때(느린 SSH/mosh) 눌린 Backspace 가 무시되던 문제를 고쳤다.
- **권한 프롬프트 diff 줄바꿈** — 이모지 같은 멀티 코드포인트 문자나 탭이 든 줄이 잘리지 않는다.
- **Ctrl+Z 세션 종료 후 터미널 상태** — 중단된 세션을 kill 했을 때 bracketed-paste 모드가 남고 커서가 숨어 있던 문제를 고쳤다.
- **stdio MCP 서버 초기화 순서** — `initialize` 전에 `server/discover` 를 받아 lazy 서버가 세션 열 때마다 백엔드를 띄우던 문제를 고쳤다.
- **프록시 거부 표시** — 프록시가 연결을 거부한 것을 일반 네트워크 오류로 뭉개지 않고 프록시를 지목한다.
- **`/model`·`/effort` 캐시 미스 경고** — 프롬프트 캐시가 이미 만료된 뒤에도 뜨던 경고를 고쳤다.
- **Remote Control tasks 패널의 태스크별 Stop** — CLI 호스팅 세션에서 아무 동작도 하지 않던 문제를 고쳤다.
- **원격 세션 종료** — 클라이언트가 role 이 유효하지 않은 사용자 메시지를 보내면 세션이 종료되던 문제를 고쳤다.
- **`claude remote-control` 환경변수 상속** — 실행한 셸의 세션 범위 환경변수를 물려받던 문제를 고쳤다.
- **크래시된 Remote Control 세션 재사용** — 프로세스가 죽은 세션이 `claude remote-control` 재시작까지 못 쓰이던 문제를 고쳤다. 다음에 메시지를 보내면 다시 쓸 수 있다.
- **턴 중간에 온 Remote Control 메시지** — 웹·데스크톱에서 Claude 가 턴을 진행하는 중에 보낸 메시지가 턴이 끝난 뒤 트랜스크립트에서 사라지던 문제를 고쳤다.
- **Remote Control 모델 선택 반영** — 휴대폰·웹에서 고른 모델이 터미널 표시에 반영되지 않던 문제를 고쳤다.
- **Remote Control "login expired"** — 짧은 네트워크 장애로 로그인 갱신이 늦어질 때 연결이 끊기던 문제를 고쳤다. 이제 재시도하며 연결을 유지한다.
- **로그아웃 시 Remote Control 메시지** — 재연결 실패로 보고하던 것을 고쳤다. 로그아웃하면 명확한 메시지와 함께 세션이 끝난다.
- **`ListAgents`/`SendMessage` 접근성** — `claude remote-control`(서버 모드)이나 데스크톱·IDE 호스트가 돌리는 세션에서 "Remote Control is not connected" 로 응답하던 문제를 고쳤다. 이제 Remote Control 피어를 나열하고 연결한다.
- **`ListAgents`/`SendMessage` 노출 범위** — 에이전트 뷰가 다음 백그라운드 세션용으로 미리 띄워 둔 유휴 워커가 목록에 보이던 문제를 고쳤다. 태스크가 잡은 뒤에만 나타난다.
- **시작 속도** — macOS 에서 인자 없는 `claude` 실행이 더 빨리 뜬다.
- **Bash 권한 검사** — 셸 조건문의 zsh 전용 문법을 더 잘 판정한다.
- **Remote Control 연결 복원력** — 네트워크 엣지·VPN·프록시의 짧은 HTTP 403 거부를 최대 3분까지 견딘다. 차단이 계속되면 거부 주체를 지목한다.
- **시작 응답성** — 자동 업데이트 확인을 실행 직후가 아니라 약 10초 뒤에 돌려 시작 시 CPU 경쟁을 피한다.
- **번들 `claude-api` 스킬 갱신** — Managed Agents 8월 19일 릴리스 반영. 셀프호스팅 샌드박스의 웹 검색·fetch 도메인 설정과 메모리 스토어를 담았다.
- **Ctrl+L·Cmd+K 동작 변경** — 풀스크린에서 항상 화면만 다시 그린다. 두 번 눌러 `/clear` 하던 단축키가 제거돼, 1행짜리 nvim 터미널이 자동 `/clear` 루프에 빠지지 않는다.
- **`claude mcp list`·`claude mcp get`** — 비활성 서버를 헬스체크로 연결해 보지 않고 `⊘ Disabled` 로 표시한다.
- **프로젝트 `.mcp.json` 의 MCP `headersHelper`** — 프로젝트나 `--add-dir` 에이전트 파일의 인라인 MCP 서버와 함께, 해당 폴더의 신뢰 대화상자를 수락해야 동작한다(`claude -p` 에서도 동일).
- **MCP `headersHelper` 실행 환경 격리** — 프로젝트 `.mcp.json`·플러그인·에이전트 파일에서 온 helper 는 상속된 자격증명 환경변수 없이 실행된다. user·managed·claude.ai 범위 helper 는 Claude 설정 디렉터리에서 실행된다.

## 🔑 이번 버전의 핵심 키워드
**"Remote Control 안정화와 `headersHelper` 자격증명 경계"** — 원격 세션이 끊기고 사라지던 경로를 대거 정리하고, 마켓플레이스·MCP 헤더 발급 명령에 신뢰·환경 격리를 걸었다.

---

# 📜 원문 (한글 번역본)

> 원문 ChangeLog를 원래 순서 그대로 한 줄도 빠짐없이 번역한 문서입니다.

- `keybindingFlavor` 설정 추가: `"readline"` 로 설정하면 프롬프트에서 Ctrl+W 가 Bash 처럼 앞쪽 공백까지 삭제한다. 기본값(`"classic"`)은 변경 없음
- 플러그인 마켓플레이스: url 마켓플레이스 또는 카탈로그 항목의 `headersHelper` 가 명령을 실행해 카탈로그·동일 출처 아카이브 요청용 HTTP 헤더(예: 단기 토큰)를 발급한다
- 카탈로그 항목의 `headersHelper` 는 해당 플러그인을 설치·업데이트할 때만, 명령을 표시한 뒤 실행된다. `claude plugin install/update` 는 `[y/N]` 로 확인을 묻는다(`-y` 전달 가능)
- `claude self-hosted-runner --defer-shutdown-max-min <minutes>` 추가: SIGTERM 시 붙어 있는 세션은 계속 서비스하고, 지정 분이 지난 뒤 남은 것을 park 하고 종료한다
- `claude self-hosted-runner --proxy-authorization-command` / `--proxy-authorization-file` 추가: 매 연결마다 새로 발급된 `Proxy-Authorization` 헤더를 요구하는 egress 프록시용
- 긴 대화형 세션에서 메모리가 무한정 증가하던 문제 수정: 서브에이전트 도구 결과가 최근 표시 창을 벗어나면 해제된다
- 커스텀·프로젝트·플러그인 출력 스타일이 세션 중간에 기본 어조로 되돌아가던 문제 수정
- 계정이 사용량 한도에 근접했지만 초과하지는 않았을 때 `CLAUDE_CODE_ENABLE_PROMPT_SUGGESTION=true` 가 프롬프트 제안을 유지하지 못하던 문제 수정
- worktree 격리 Bash 거부가 리다이렉트가 없는 명령에도 리다이렉트를 제거하라고 안내하던 문제 수정
- self-hosted runner 가 느리거나 유실된 폴링 요청 한 번으로 서버에 의해 제거되면서 정상 세션을 다른 러너에 넘기던 문제 수정
- MCP elicitation 대화상자가 4,096자를 넘는 URL 에 아무것도 표시하지 않던 문제, 그리고 프로젝트 경로가 터미널 폭에 맞지 않을 때 권한 프롬프트가 "다시 묻지 않기" 옵션을 빠뜨리던 문제 수정
- Bash 명령이 kill·타임아웃·중단될 때 `/tmp/claude-*-cwd` 파일이 남던 문제 수정
- Backspace 로 Ctrl+H 를 보내는 터미널에서 키 입력이 대량으로 몰려 도착할 때(느린 SSH/mosh 링크) 눌린 Backspace 가 무시되던 문제 수정
- 권한 프롬프트 diff 의 텍스트 줄바꿈 수정: 넓은 멀티 코드포인트 문자(이모지 등)나 탭이 포함된 줄이 더 이상 잘리지 않는다
- 중단된(Ctrl+Z) 세션을 kill 했을 때 터미널이 bracketed-paste 모드로 남고 커서가 숨겨지던 문제 수정
- stdio MCP 서버가 `initialize` 보다 먼저 `server/discover` 요청을 받아, lazy 서버가 세션을 열 때마다 백엔드를 시작하게 만들던 문제 수정
- 프록시의 연결 거부가 프록시를 지목하지 않고 일반 네트워크 오류로 보고되던 문제 수정
- 프롬프트 캐시가 이미 만료된 상태에서도 `/model`·`/effort` 캐시 미스 경고가 표시되던 문제 수정
- Remote Control tasks 패널의 태스크별 Stop 이 CLI 호스팅 세션에서 아무 동작도 하지 않던 문제 수정
- 클라이언트가 유효한 role 없이 사용자 메시지를 전달할 때 원격 세션이 종료되던 문제 수정
- `claude remote-control` 로 시작된 Remote Control 세션이 실행 셸의 세션 범위 환경변수를 상속하던 문제 수정
- 프로세스가 크래시한 Remote Control 세션이 `claude remote-control` 재시작 전까지 사용 불가로 남던 문제 수정. 이제 다음에 메시지를 보내면 재사용된다
- Claude 가 턴 진행 중일 때 웹·데스크톱에서 보낸 Remote Control 메시지가 턴 종료 후 트랜스크립트에서 사라지던 문제 수정
- 휴대폰·웹에서 고른 Remote Control 모델 선택이 터미널에 표시된 모델을 갱신하지 않던 문제 수정
- 짧은 네트워크 장애로 로그인 갱신이 지연될 때 Remote Control 이 "login expired" 로 연결을 끊던 문제 수정. 이제 재시도하며 연결을 유지한다
- 로그아웃 시 Remote Control 이 재연결 실패로 보고하던 문제 수정. 로그아웃하면 명확한 메시지와 함께 세션이 종료된다
- `claude remote-control`(서버 모드) 또는 데스크톱·IDE 호스트가 실행하는 세션에서 `ListAgents`/`SendMessage` 가 "Remote Control is not connected" 로 응답하던 문제 수정. 이제 Remote Control 피어를 나열하고 연결한다
- `ListAgents` 와 `SendMessage` 가 에이전트 뷰가 다음 백그라운드 세션용으로 미리 띄운 유휴 워커를 노출하던 문제 수정. 이제 태스크가 점유한 뒤에만 나타난다
- 크로스 세션 메시징: 수신 메시지를 거부하는(예: `crossSessionInbound: "refuse"`) 같은 기기의 세션으로 보낼 때, 조용한 성공 대신 발신자에게 "거부됨"을 보고한다
- 크로스 세션 메시징: 받은편지함이 메시지를 드롭하는 세션(rate limit 또는 큐 포화)이 이제 발신 세션에 알린다. 메시지가 조용히 사라지지 않는다
- 시작 개선: macOS 에서 인자 없는 `claude` 가 더 빨리 시작된다
- 셸 조건문의 zsh 전용 문법에 대한 Bash 도구 권한 검사 개선
- Remote Control 연결 복원력 개선: 네트워크 엣지·VPN·프록시의 짧은 HTTP 403 거부를 최대 3분까지 허용하고, 차단이 지속되면 거부 주체를 지목한다
- 시작 응답성 개선: 자동 업데이트 확인이 시작과 CPU 를 다투지 않고 실행 약 10초 후에 실행된다
- Managed Agents 8월 19일 릴리스에 맞춰 번들 `claude-api` 스킬 갱신: 셀프호스팅 샌드박스의 웹 검색·fetch 도메인 설정과 메모리 스토어
- 풀스크린의 Ctrl+L·Cmd+K 를 항상 다시 그리기만 하도록 변경 — 두 번 눌러 `/clear` 하는 단축키가 제거되고, 1행 nvim 터미널이 자동 `/clear` 루프를 유발하지 않는다
- `claude mcp list` 와 `claude mcp get` 이 비활성 서버를 헬스체크로 연결하지 않고 `⊘ Disabled` 로 표시하도록 변경
- 프로젝트 `.mcp.json` 의 MCP `headersHelper`, 그리고 프로젝트나 `--add-dir` 에이전트 파일의 인라인 MCP 서버는 이제 해당 폴더의 신뢰 대화상자를 수락했을 것을 요구한다(`claude -p` 에서도 동일)
- 프로젝트 `.mcp.json`·플러그인·에이전트 파일의 MCP `headersHelper` 는 상속된 자격증명 환경변수 없이 실행된다. user·managed·claude.ai 범위 helper 는 Claude 설정 디렉터리에서 실행된다

---

## 🎯 챌린지

이번 버전에서 내 환경에 적용해볼 만한 항목입니다.

### 1. Ctrl+W 를 Bash 방식으로 바꾸기
- **파일**: `~/.claude/settings.json`
- **근거**: 이번 버전에 추가된 `keybindingFlavor` 를 `"readline"` 로 두면 프롬프트에서 Ctrl+W 가 공백 단위로 지운다. zsh 를 쓰는 환경이라 터미널 습관과 맞고, 긴 경로(`infra-compose/docker-compose.yml` 같은 것)를 지울 때 한 번에 끊긴다. 현재 settings.json 에 이 키가 없으므로 새로 추가한다.
- **난이도**: ★☆☆ (약 5분)

### 2. 비활성 플러그인 정리 + `claude mcp list` 로 상태 확인
- **파일**: `~/.claude/settings.json` 의 `enabledPlugins`
- **근거**: `false` 로 꺼둔 플러그인이 6개다(`token-optimizer`, `andrej-karpathy-skills`, `vercel` 등). 그런데 `statusLine` 은 꺼둔 `token-optimizer` 플러그인 캐시 경로의 스크립트를 그대로 가리킨다 — 플러그인을 정리하면 상태줄이 깨진다. 이번 버전에서 `claude mcp list` 가 비활성 서버를 연결 시도 없이 `⊘ Disabled` 로 보여주니, 먼저 목록으로 실제 상태를 확인한 뒤 안 쓰는 항목을 빼고 statusLine 경로를 정리한다.
- **난이도**: ★★☆ (약 15분)

### 3. Bash 훅에 `/tmp` 잔여 파일·zsh 조건문 확인 추가
- **파일**: `~/.claude/hooks/deploy-guard.sh`
- **근거**: 이번 버전은 Bash 명령이 kill·타임아웃될 때 남던 `/tmp/claude-*-cwd` 파일을 정리하고, 셸 조건문의 zsh 전용 문법 판정을 개선했다. `deploy-guard.sh` 는 `git push` 를 문자열로 판정하는데 zsh 조건문·따옴표 조합에서 우회될 수 있다. 훅이 `feat/*` push 를 실제로 막는지 한 번 실행해 검증하고, 우회 케이스가 있으면 매칭을 보강한다.
- **난이도**: ★★☆ (약 20분)

### 4. Remote Control 수신 정책 명시
- **파일**: `~/.claude/settings.json`
- **근거**: 이번 버전에서 크로스 세션 메시징이 거부·드롭을 발신자에게 알려주게 됐고, `ListAgents`/`SendMessage` 가 서버 모드·IDE 호스트에서도 동작한다. 여러 세션을 병렬로 돌리는 작업 방식(§7.2)이라면 `crossSessionInbound` 를 의도한 값으로 명시해 두는 편이 낫다 — 지금은 설정이 없어 기본값에 의존한다. 원치 않는 메시지를 막으려면 `"refuse"`, 세션 간 조율을 쓰려면 허용값으로 둔다.
- **난이도**: ★☆☆ (약 10분)
