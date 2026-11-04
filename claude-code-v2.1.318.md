# Claude Code v2.1.318

> 작성일: 2026-11-05

---

# 📋 요약본

## 🎉 신기능 (9건)
- **mod 활성화 응답 기록** — Claude Code가 세션 중 직접 만든 mod를 켤지 물을 때, 사용자가 고른 답을 기록으로 남긴다.
- **Claude apps gateway `mantle` 업스트림 `assume_role`** — 다른 AWS 계정의 역할을 빌려 쓸 수 있다. 개발자별 AWS 비용 구분도 된다.
- **mod `$.model.fork` 에 `effort` 옵션 추가** — 간단한 곁가지 작업은 세션 설정과 상관없이 `low` effort로 돌린다. 실제로 보낸 effort는 결과에 표시된다.
- **claude.ai 로그인 만료일 표시** — `claude auth status` 에 `loginExpiresAt`, `claude -p` JSON 결과에 `credential_expires_at` 가 추가됐다.
- **`claude -p` 로그인 만료 사전 경고** — 저장된 claude.ai 로그인이 끝나기 10일 전부터 텍스트 출력 모드에서 stderr에 한 줄 경고를 띄운다.
- **Self-hosted runner `CLAUDE_RUNNER_SPAWN_REASON`** — orchestrator의 spawn-runner hook 환경변수에 Anthropic이 실행을 요청한 이유(`runner_lost`, `resumed` 등)를 넣어준다.
- **Cloud 세션 "No repository" 옵션** — Anthropic 호스팅 환경에서 저장소를 고르지 않고도 cloud 세션을 시작한다.
- **Cloud 세션 Chrome 이름 제공** — `google-chrome`, `CHROME_PATH` 로 내장 Chromium을 찾을 수 있어 Playwright 외 도구도 브라우저를 쓴다.
- **삭제된 환경 카드에 New session 버튼** — 입력창이 숨겨진 상태에서도 새 세션을 바로 연다.

## 🛠️ 개선/수정 (16건)
- **`--continue` 대화 유실 수정** — 잘못된 tool call 재시도가 다 떨어진 뒤 이전 대화가 사라지던 2.1.314 회귀를 고쳤다.
- **macOS Bash 다수 실행 시 멈춤 수정** — Bash 명령이 많이 돌 때 세션이 멈추고 메모리가 계속 늘던 문제를 고쳤다.
- **권한 프롬프트 오입력 수정** — 메시지를 보낸 직후 친 키나, 프롬프트가 늦게 뜨기 전에 친 키가 권한 질문의 답으로 처리되던 문제를 막았다.
- **`~/.claude.json` 보호 강화** — 비대화형 실행이 깨진 `~/.claude.json` 을 기본값으로 덮어쓰지 않는다. 시작을 멈추고 복구 방법을 알려준다. 빈 파일은 손상으로 보지 않는다.
- **네트워크 홈 디렉터리 저장 안정화** — 설정·로그인 파일이 공유 네트워크 홈에서 지워지거나 비거나 옛 사본으로 바뀌는 일이 줄었다. 저장 실패 시 성공으로 보고하던 문제도 고쳤다.
- **`claude mcp add`/`remove` 잠금 처리** — 설정 파일 잠금을 기다리거나 exit 1로 끝난다.
- **idle compaction 오류 수정** — 요약이 아닌 응답으로 대화를 바꿔치던 문제를 고쳤다.
- **workflow 재개 시 중복 실행 수정** — 사용량 한도 후 재개할 때 이미 끝난 agent를 다시 돌리던 문제를 고쳤다.
- **`claude -p`/SDK 성공 오보 수정** — API 오류로 응답이 잘렸는데도 성공으로 보고하던 문제(`turn.step` hook 사용 시)를 고쳤다.
- **로그인 만료 시 안내 개선** — 로그인 시간 제한에 걸리면 그렇다고 알려주고, `claude -p` 에서는 `claude auth login`, `claude setup-token` 을 안내한다.
- **`NODE_EXTRA_CA_CERTS` 손상 대응** — 파일이 비었거나 일부가 손상돼도 읽을 수 있는 인증서만 쓰고 경고한다.
- **MCP 도구 오류 개선** — 도구가 로드되기 전 호출하면 그 도구의 입력 schema(입력 형식 정의)를 돌려준다.
- **macOS `/bin/bash` 에서 git commit·PR 생성 안정화** — macOS 기본 bash에서 커밋·PR 생성이 더 안정적으로 동작한다.
- **비대화형 실행의 불필요한 쓰기 제거** — `claude -p`, SDK 앱이 바뀐 게 없으면 `~/.claude.json` 을 매번 다시 쓰지 않는다.
- **IDE 확장 자동 설치 중단** — IDE 터미널에서 시작해도 확장을 설치·업데이트하지 않는다. `/ide` 나 편집기 확장 메뉴를 쓴다.
- **background subagent 셸 3분 규칙** — 모든 provider에서 셸 명령이 3분을 넘으면 background로 옮겨 prompt cache 만료를 막는다.

## 🔑 이번 버전의 핵심 키워드
**"설정·로그인 파일을 지키고, 만료를 미리 알린다"** — `~/.claude.json`·로그인 파일 손상을 막고, 무인 실행(`claude -p`)에서 로그인 만료를 미리 보여주는 안정화 릴리스.

---

# 📜 원문 (한글 번역본)

> 원문 ChangeLog를 원래 순서 그대로 한 줄도 빠짐없이 번역한 문서입니다.

- Claude Code가 세션에서 직접 작성한 mod를 켤지 물을 때, 사용자의 답을 기록하도록 추가
- Claude apps gateway의 `mantle` 업스트림에 `assume_role` 추가 — 다른 AWS 계정의 역할 사용 및 개발자별 AWS 비용 귀속 지원
- mod의 `$.model.fork` 에 `effort` 옵션 추가 — 세션의 effort와 상관없이 짧은 곁가지 작업을 `low` 로 실행 가능. 결과에 실제 전송된 effort가 표시됨
- 저장된 claude.ai 로그인의 만료일을 `claude auth status`(`loginExpiresAt`)와 `claude -p` JSON 결과(`credential_expires_at`)에 추가
- 저장된 claude.ai 로그인 만료 10일 전부터 `claude -p` 텍스트 출력에 stderr 한 줄 경고 추가
- 잘못된 tool call의 재시도가 소진된 뒤 `--continue` 가 이전 대화를 잃어버리던 문제 수정 (2.1.314 회귀)
- macOS에서 Bash 명령이 많이 실행 중일 때 세션이 멈추고 메모리가 증가하던 문제 수정
- 메시지 전송 직후 입력한 키, 또는 느린 프롬프트가 뜨기 전에 입력한 키로 권한 프롬프트가 응답되던 문제 수정
- 공유 네트워크 홈 디렉터리에서 설정 파일을 갱신할 수 없을 때 `/logout`, `claude auth logout`, `claude mcp remove` 가 성공으로 보고하고, trust·동의·MCP 설정 변경이 아무 알림 없이 버려지던 문제 수정
- 같은 홈에서 다른 터미널이나 호스트가 같은 계정·조직으로 다시 로그인하면 작업이 `Not logged in` 으로 종료되던 문제 수정
- `claude mcp add` 와 `remove` 가 잠금 없이 설정을 쓰던 문제 수정: 이제 잠금을 기다리거나 exit 1로 종료. 단, 다른 작업의 저장이 저장된 서버를 덮어쓸 수는 있음
- 느린 토큰 갱신이 저장되기 전에 `claude plugin` 명령이 종료되어 다음 실행 시 로그아웃될 수 있던 문제 수정
- `claude plugin marketplace add` 가 거부하는 사용자 지정 이름의 marketplace 파일을 `claude plugin validate` 가 통과시키던 문제 수정
- 버전 확인 단계에서 종료되는 stdio MCP 서버가 매 시작마다 재확인되던 문제 수정. 자체 이유로 3초 안에 죽는 서버도 7일간 legacy handshake로 고정
- 같은 머신의 다른 로그인이 저장한 `allowedProviders` 목록 때문에 시작 시 세션이 거부되던 문제 수정
- idle compaction이 요약이 아닌 응답으로 대화를 대체하던 문제 수정
- background subagent 실행 중 "Now using usage credits" 알림이 약 30초마다 다시 뜨던 문제 수정
- 실패하거나 Claude만 호출할 수 있는 custom slash command가 `claude -p` 및 SDK 세션에서 아무것도 출력하지 않던 문제 수정
- mod가 `turn.step` 을 hook한 상태에서 API 오류로 응답이 잘렸을 때 `claude -p` 와 Agent SDK 세션이 성공으로 보고하던 문제 수정
- headless 세션에서 모델 변경 직후 보낸 메시지가 Stop 후에도 계속 실행되던 문제 수정: 이제 Stop이 대기 메시지와 같은 방식으로 취소·중지함
- idle 상태의 비대화형 세션이 종료될 때 삭제된 세션 transcript가 마지막 프롬프트와 함께 다시 생성되던 문제 수정
- 업데이트나 버전 정리로 실행 중인 프로세스의 바이너리가 지워진 뒤 `claude remote-control` 호스트, background daemon, self-hosted runner가 새 세션을 시작하지 못하던(`spawn ENOENT`) 문제 수정
- 다른 사용자가 소유한 실행 중 Claude Code 프로세스(예: `sudo claude` 로 남은 것)를 버전 정리가 죽은 것으로 보고 바이너리를 지울 수 있던 문제 수정
- 연결 실패 후에도 `/remote-control` 이 세션을 사용 가능으로 표시하던 문제 수정
- 요청이 404로 실패했는데 `/design revoke` 가 성공으로 보고하던 문제 수정
- self-hosted runner나 cloud 세션 재시작 후 승인된 셸 명령이 요청된 폴더가 아니라 세션 시작 폴더에서 실행되던 문제 수정. 해당 폴더에 들어갈 수 없으면 실행하지 않음
- cloud 세션 재시작 후 승인된 connector 도구를 쓸 수 없을 때 Claude에게 알리지 않던 문제 수정
- 서비스가 몇 분간 업로드를 거부하면 cloud 세션이 턴 중간에 중지되던 문제 수정
- 일부 cloud 세션에서 `Setup` hook이 `CLAUDE_ENV_FILE` 에 쓴 변수가 Bash 도구에 전달되지 않던 문제 수정
- tool call에서 응답이 잘렸거나 거부된 이미지·문서가 제거된 뒤, iPhone 앱이 실행 중인 cloud 세션의 턴을 끝난 것으로 표시하던 문제 수정
- 재시작된 세션이 API 오류로 실패한 메시지를 뒤에 대기 중인 새 메시지보다 먼저 다시 보내던 문제 수정
- Claude가 큰 이미지를 읽거나 tool call을 재시도한 직후 재시작되면 중단된 턴을 버리던 문제 수정
- `NODE_EXTRA_CA_CERTS` 파일이 비었거나 PEM이 아니거나 손상된 인증서로 시작하면 모든 연결이 실패하던 문제 수정: 이제 읽을 수 있는 인증서를 쓰고 stderr에 경고
- 사용량 한도 이후 재개할 때 workflow가 완료된 agent를 다시 실행하던 문제 수정
- cloud 세션의 `/mcp` 가 모델이 쓸 수 없는 도구까지 세던 문제 수정. 서버 행에 사용 가능한 도구 수를 표시
- Claude가 PushNotification 호출에서 status 필드를 빠뜨리면 알림이 중복되던 문제 수정
- 이미지가 20장을 넘는 요청에서 너무 큰 이미지 오류가 항상 2000px 제한이라고 표시되던 문제 수정. 이제 API의 실제 제한을 표시
- background shell 상세 다이얼로그가 열려 있는 동안 실행 시간이 갱신되지 않던 문제 수정
- headless 실행에서 mod의 `turn.step` hook이 중지된 응답을 성공으로 끝내던 문제 수정
- `claude -p` 만 실행하는 홈에서 retention 정리가 `~/.claude.json` 백업을 하나도 남기지 않던 문제 수정: 마지막 정상 백업을 지우기 전에 새 백업을 먼저 만듦
- 네트워크 홈 디렉터리에 데이터 공간은 없지만 새 파일은 만들어지는 경우 저장된 로그인이 빈 파일로 바뀌던 문제 수정
- `forceLoginOrgUUID` 가 설정된 머신에서 허용된 조직의 `setup-token` 토큰이 시작 시 거부되던 문제 수정
- 비대화형 실행이 유효한 JSON이 아닌 `~/.claude.json` 을 기본값으로 덮어쓰던 문제 수정: 이제 시작이 실패하고 복구 방법을 알려주며 파일은 그대로 둠 (anthropics/claude-code#87551)
- 백업 없는 빈 `~/.claude.json` 이 손상으로 보고되던 문제 수정. 이제 파일이 없을 때처럼 시작
- 손상되거나 없는 `~/.claude.json` 에 대해 출력되는 복구 명령이 비었거나 잘린 백업을 가리키거나, 읽기 전용 파일에서 실패하던 문제 수정
- 저장된 claude.ai 로그인이 시간 제한에 도달했을 때의 로그인 실패 수정: 이제 그 사실을 알리고, `claude -p` 에서는 `claude auth login` 과 `claude setup-token` 을 안내
- 공유 네트워크 홈 디렉터리에서 `~/.claude.json`, 설정 파일, 저장된 로그인이 저장 과정을 견디는 방식 개선: 삭제·일시적 비움·거의 빈 사본이나 옛 사본으로의 교체가 줄어듦
- 네트워크 파일 시스템에서 설정 파일이 없다고 잘못 보고될 때 다시 확인하도록 개선. MCP 서버와 신뢰 폴더 없이 시작하는 세션이 줄어듦
- MCP 도구 오류 개선: 도구가 로드되기 전에 호출하면 입력 schema를 반환
- Bash 도구가 macOS 내장 `/bin/bash` 로 실행될 때 git commit과 pull request 생성의 안정성 개선
- 사용량 한도 메뉴의 "Ask your admin for more usage" 가 요청을 한 번에 보내도록 개선
- 일시정지·잠자기 후 원격 세션 재연결 속도 개선
- You should know 토스트가 터미널에서만 통하는 "press 2" 대신 "try again" 으로 안내하도록 개선
- 자동 업데이트 안정성 개선: 릴리스 검증 중 짧은 네트워크 실패를 다음 확인까지 기다리지 않고 바로 재시도
- 무인 실행(`claude -p`, SDK 앱)이 변경 사항이 없으면 매 실행마다 `~/.claude.json` 을 다시 쓰지 않도록 개선
- IDE 터미널에서 시작해도 IDE 확장을 더 이상 설치·업데이트하지 않도록 변경. 외부 터미널의 `/ide` 나 편집기 확장 메뉴를 사용
- "Switch models when a message is flagged" 가 "Ask each time" 일 때 subagent가 모델을 바꾸지 않고 멈추도록 변경
- background subagent가 모든 provider에서 셸 명령을 3분 후 background로 옮기도록 변경. 실행 중 prompt cache가 만료되지 않게 함
- Bedrock, Vertex, Foundry 또는 telemetry가 꺼진 경우의 subagent 진행 요약 변경: prompt cache가 차가울 때 subagent의 대기 응답을 최대 5분까지 기다릴 수 있음
- mod가 `prompt.submit` 에서 첨부하는 내용이 system message로 나가지 않고 사용자 턴 안에 머물도록 변경
- `deniedMcpServers` URL 항목이 upstream URL이 일치하는 Anthropic 제공 서버와, 세션에 connector 자체 URL이 주어지는 cloud 세션·self-hosted runner의 connector도 차단하도록 변경. 그 외에는 connector를 이름으로 차단
- `/permissions` 의 규칙 상세, 내장 규칙, 삭제 확인 화면을 표준 다이얼로그로 변경. 여기서 Ctrl+C 두 번은 종료 대신 뒤로 가기·취소
- `/claude-api managed-agents-onboard` 가 새 agent의 내장 도구와 quickstart 템플릿의 MCP 도구에 기본으로 `auto` 권한 정책("Judge risky actions")을 주도록 변경 (Claude Console과 동일). 해제하려면 "run without asking" 이라고 말하면 됨
- 2.1.286 이하에서 시작한 대화를 재개할 때 모델의 이전 thinking을 유지하던 2.1.288 수정 제거. 이제 해당 thinking은 버려질 수 있음
- Gateway: federation(`external_account`) 자격 증명 파일의 Google access token이 곧 만료될 때 로그 경고 추가
- Gateway: `listen.trusted_proxies` 로그 안내 개선: 접속 주소를 직접 `X-Forwarded-For` 에 추가하는 proxy만 나열하라고 안내
- Gateway: Amazon Bedrock에서 AWS CountTokens 실패 시 경고 개선: 501 이후에는 gateway가 아닌 Claude Code가 토큰을 센다고 알리고, AWS가 접근을 거부한 경우에만 IAM을 지목
- Self-hosted runner: orchestrator의 spawn-runner hook 환경에 `CLAUDE_RUNNER_SPAWN_REASON` 추가 — Anthropic이 요청을 보낸 이유(예: `runner_lost`, `resumed`). 보낸 요청이 없으면 unset
- Self-hosted runner: `--release-idle-session-min` 이 값 없이 마지막 인자로 오거나(여전히 무시) 값이 공백뿐일 때(여전히 `0` 으로 읽음) 시작 경고 추가
- Self-hosted runner: orchestrator 로그 줄 변경: `ok session=…` 이 모든 로그 레벨에서 stdout으로 출력(기존 debug 전용, stderr)되며 `jti=…` 뒤에 `reason=…` 이 붙음. `nack session=…` 은 `retryable=…` 뒤에 `reason=…` 으로 끝남. `retryable=true:` 나 `retryable=false:` 를 매칭하는 스크립트는 수정 필요
- Remote Control: 세션 작업 폴더가 없을 때 오해를 부르는 "spawn error: ENOENT" 수정. 이제 오류가 폴더 이름을 알려줌
- Remote Control: 앱이 제목을 정하지 않을 때 터미널 fork의 fork 제목을 "Name (fork 2)" 형태로 개선
- [VSCode] 조직 설정이 로그인을 거부하는 창이 매분 background에서 새 Claude Code 프로세스를 시작하던 문제 수정
- [VSCode] 채팅 패널 오류 배너의 긴 단어가 닫기 버튼을 화면 밖으로 밀어내던 문제 수정
- [VSCode] 로그인 상태 확인이 실패할 때 Claude Code가 출력한 내용을 로그인 화면에 보여주도록 개선
- [Cloud sessions] No repository 옵션 추가: Anthropic 호스팅 환경의 cloud 세션을 저장소 선택 없이 시작 가능
- [Cloud sessions] cloud 세션에 일반적인 Chrome 이름 추가. Playwright 외 도구도 google-chrome과 CHROME_PATH로 내장 Chromium을 찾을 수 있음
- [Cloud sessions] cloud 세션의 환경이 삭제되어 메시지 입력창이 숨겨질 때 표시되는 카드에 New session 버튼 추가
- [Cloud sessions] cloud 세션에서 GitHub Actions 로그 읽기 수정: `gh run view --log` 와 `gh api` 로그 요청이 접근 불가 redirect 대신 대부분 환경에서 로그를 받음
- [Cloud sessions] cloud 및 Remote Control 세션의 Create PR 실패 메시지 대부분 개선: Try again 대신 이유나 GitHub 링크를 제공
- [Cloud sessions] connector 검색 결과가 connector 디렉터리의 일부만 검색했다고 Claude에게 알리도록 변경
- [Remote Control] 한 저장소의 나란한 checkout들이 환경 메뉴의 Remote Control 행에서 똑같아 보이던 문제 수정. 각자 폴더 이름을 표시
- [Claude Tag] Claude Tag 관리자 설정의 키보드 포커스와 화면 낭독기 안내 수정. connect 폼에서 Escape를 눌러도 Add 다이얼로그까지 닫히지 않음
- [Code Review] Code Review 분석 페이지가 서버·네트워크 실패 후 한 번 재시도하고, 빈 카드 대신 Try again 배너를 보여주도록 개선

---

## 🎯 챌린지

이번 버전에서 내 환경에 적용해볼 만한 항목입니다.

### 1. 체인지로그 동기화 cron에 로그인 만료 사전 점검 추가
- **파일**: `~/.claude/skills/claude-changelog-sync/` 의 동기화 스크립트 (매일 08:00 cron이 실행하는 파일)
- **근거**: 이 스킬은 `claude -p --model opus` 로 무인 실행된다. 로그인이 만료되면 아침 동기화가 조용히 실패한다. 이번 버전의 `claude auth status` → `loginExpiresAt` 을 실행 전에 읽어 10일 이내면 `osascript` 알림을 띄우면, 만료 전에 미리 다시 로그인할 수 있다.
- **난이도**: ★★☆ (약 15분)

### 2. cron 실행의 stderr를 로그 파일로 남기기
- **파일**: crontab 또는 launchd plist의 `claude-changelog-sync` 실행 줄
- **근거**: 새 기능은 만료 10일 전부터 `claude -p` stderr에 경고를 한 줄 찍는다. 깨진 `~/.claude.json` 일 때 이제 덮어쓰지 않고 실패하며 복구 방법도 stderr로 알려준다. stderr를 버리면 둘 다 놓친다. `2>> ~/claude-ver-doc/.sync-stderr.log` 처럼 보호 영역(`~/Documents/` 아님) 밖 파일로 남긴다.
- **난이도**: ★☆☆ (약 5분)

### 3. 동기화 전 `~/.claude.json` 유효성 검사
- **파일**: `~/.claude/skills/claude-changelog-sync/` 의 동기화 스크립트
- **근거**: 이번 버전부터 비대화형 실행은 JSON이 깨진 `~/.claude.json` 을 기본값으로 덮지 않고 시작을 멈춘다. 스크립트 앞부분에 `jq empty ~/.claude.json` 검사를 넣고 실패하면 알림 후 종료하면, 원인 모를 동기화 실패를 바로 구분할 수 있다.
- **난이도**: ★☆☆ (약 10분)
