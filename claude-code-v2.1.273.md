# Claude Code v2.1.273

> 작성일: 2026-09-16

---

# 📋 요약본

## 🎉 신기능 (4건)
- **LLM 게이트웨이용 요청 헤더 추가** — `x-claude-code-request-class`, `x-claude-code-agent-type`, `x-claude-code-prev-tool-durations`, `x-claude-code-compaction`, `x-claude-code-context-compacted` 헤더를 붙인다. `CLAUDE_CODE_GATEWAY_HINT_HEADERS=1` 로 켠다.
  - 게이트웨이가 요청 성격(에이전트 타입·압축 여부·직전 도구 소요시간)을 알고 라우팅·과금할 수 있다.
- **MCP 서버 끊김 알림** — 세션 중 MCP 서버가 끊기고 자동 재연결도 포기하면 알림이 뜨고 `/mcp` 로 안내한다. 예전엔 조용히 죽었다.
- **원격 제어 세션 포크** — `claude --remote-control` 또는 `/remote-control` 로 시작한 세션을 Claude 앱에서 포크할 수 있다. 포크본은 내 컴퓨터에서 백그라운드 세션으로 돈다.
- **[Claude Code on the web] 루틴 편집 이탈 확인창** — 새 루틴 페이지나 편집 대화상자를 닫을 때 입력한 이름·프롬프트·수정 내용을 버리기 전에 "저장 안 된 변경을 버릴까요?" 를 묻는다.

## 🛠️ 개선/수정 (60건)
- **권한 검사 우회 구멍 차단** — 권한 검사기가 완전히 분석하지 못하는 Bash 명령이 `permissions.blockReadsOutsideWorkingDirectories` 아래서 확인 창을 건너뛰던 문제, bypass 모드에서 서브셸이 위험한 `rm` 을 숨기던 문제를 고쳤다.
- **조직이 Skills 를 끈 뒤에도 남던 스킬** — claude.ai 에서 동기화된 스킬이 계속 쓸 수 있는 상태로 남았다. 이제 복구 가능한 휴지통으로 옮긴다.
- **MDM 설정 무시 문제** — MDM·`managed-settings.json` 으로 지정한 `allowManagedMcpServersOnly`, `deniedMcpServers`, `disableClaudeAiConnectors` 가 서버 관리 설정이 같이 있으면 무시되던 문제를 고쳤다.
- **엉뚱한 `/login` 안내 제거** — Bedrock·Vertex·Foundry 의 401/403, Claude 앱 게이트웨이 403 에서 `/login` 을 시키던 메시지를 고쳤다. 이제 갱신할 자격증명 이름을 대거나 게이트웨이 관리자에게 안내한다.
- **프롬프트 캐시 전면 재작성 방지** — `/login`, `/upgrade`, `/extra-usage` 가 대화의 이전 thinking 을 버려 다음 요청에서 캐시를 통째로 다시 쓰게 만들던 문제를 고쳤다.
- **컨텍스트 계측 2배 오류** — 컨텍스트 미터와 auto-compact 가 advisor 도구 턴을 실제의 약 2배로 세어, auto-compact 가 실제 윈도의 절반쯤에서 터졌다. 고쳤다.
- **서브에이전트 실패 오보** — 마지막 스트리밍 응답에 토큰 사용량이 빠졌거나 모델 id 가 없으면 서브·백그라운드 에이전트가 실패로 보고되고 결과가 영영 전달되지 않던 문제를 고쳤다.
- **auto mode 오동작** — 클라우드·Remote Control 세션에서 채팅에 첨부한 파일을 Artifact 도구가 업로드할 때 auto mode 가 승인 대기로 멈추던 문제를 고쳤다.
- **`.git/info/exclude` 재생성** — 레포의 `.git` 디렉토리를 지우거나 옮긴 뒤에도 장시간 세션이 stub 을 다시 만들던 문제를 고쳤다.
- **shell 모드 `!` 유실** — 이미 shell 모드일 때 맨 앞에 친 `!` 가 사라져 `! grep …` 같은 부정 명령을 못 치던 문제를 고쳤다.
- **드래그한 스크린샷 Read 거부** — macOS 에서 드래그해 넣은 스크린샷이나 시스템이 두 번째 경로로 보고하는 파일을 "symlink resolution changed after permission was checked" 로 거부하던 문제를 고쳤다.
- **메모리 디렉토리 누수 차단** — `permissions.blockReadsOutsideWorkingDirectories` 아래서 레포 설정이 고른 메모리 디렉토리가 프롬프트에 실리거나 recall·색인·메모리 추출에 쓰이지 않는다.
- **`/tui` 재시작 거부** — 이미 일을 마치고 에이전트 패널에서 사라진 팀원 때문에 `/tui` 가 재시작을 거부하던 문제를 고쳤다.
- **예약 작업이 엉뚱한 세션에서 실행** — `.claude/scheduled_tasks.json` 을 새 worktree 같은 다른 폴더로 복사한 뒤 생기던 문제를 고쳤다.
- **SDK·stream-json 출력 유실** — 서브에이전트가 도중에 백그라운드로 옮겨지면(`CLAUDE_AUTO_BACKGROUND_TASKS` 등) 남은 메시지와 최종 보고가 빠지던 문제를 고쳤다.
- **`/install-github-app` 오진단** — SAML SSO 차단을 "관리자 권한 필요" 로 보고하던 문제를 고쳤다.
- **Remote Control 컨텍스트 조회 거부** — Claude Desktop·VS Code·JetBrains 세션에 붙은 Remote Control 클라이언트가 컨텍스트 사용량을 물으면 거부되던 문제를 고쳤다.
- **스피너 말줄임표 중복** — "Running PreCompact hooks…" 같은 압축 상태 줄에 "……" 가 찍히던 문제를 고쳤다.
- **가짜 스피너 팁** — Artifacts 를 읽거나 게시한 뒤 frontend-design 플러그인을 권하던 오탐을 고쳤다.
- **2.1.268 변경 되돌림** — 권한 검사기가 분석 못 하는 Bash 줄(`eval`, `env -C`)에 Read·Edit deny 규칙을 검사하던 변경을 되돌렸다. `time -p make build` 같은 명령은 거부 대신 다시 확인 창이 뜬다.
- **긴 세션 반응성 개선** — hook 진행 상황과 서브에이전트 활동이 갱신될 때마다 대화 전체를 다시 처리하지 않는다.
- **Artifact 도구 개선 묶음** — 게시 불가 파일 타입 오류가 서빙 가능한 타입과 대안을 알려주고, 페이지 읽기가 아티팩트 서비스의 권한·DB 규칙을 명시하고, DB 업데이트가 문서 전체 재작성 없이 필드 하나만 지울 수 있고, claude.ai 도달 후 연결이 끊긴 게시는 중복 버전 없이 안전하게 재전송된다.
- **오류 메시지 대거 개선** — 클라우드 세션 GitHub 오류(IP 허용 목록·앱 정지·SAML), `/autofix-pr` 의 `gh pr view` 실패와 webhook 설정 실패 사유, `/web-setup` 의 GitHub 토큰 거부·연결 실패, 세션 중 SSL 인증서·프록시 오류(`NODE_EXTRA_CA_CERTS` 등), 만료된 Claude 로그인, MCP 서버 로그인 만료(`/mcp`) — 전부 원인과 조치를 이름으로 말한다.
- **auto mode 분류기 기본값 변경** — Bedrock·Vertex·Foundry 에선 당분간 로컬 분류기를 쓴다. 서버 분류기는 `CLAUDE_CODE_AUTO_MODE_SERVER=1`.
- **텔레메트리·피드백 범위 조정** — `OTEL_LOG_TOOL_DETAILS=1` 이 비용·토큰 지표에 실제 에이전트·스킬·플러그인·MCP 서버 이름을 포함한다. `/bug`·`/feedback` 은 마지막 API 요청의 모델 동작 파라미터(model, system prompt, tools)만 담고 요청 메타데이터·`CLAUDE_CODE_EXTRA_BODY` 는 뺀다.
- **Claude 계정 로그인 범위 확대** — claude.ai 플러그인 접근 권한도 함께 요청한다.
- **[VSCode]** 제품 피드백을 끈 조직에서 "Report a problem" 과 `/bug`·`/feedback` 양식이 계속 뜨던 문제, Windows 에서 턴 종료 후 빨간 "process exited with code 4294967295" 배너가 뜨던 문제를 고쳤다.
- **Windows** — `--add-dir` 로 매핑된 네트워크 드라이브를 추가했을 때 UNC 경로 권한 검사를 개선했다.
- **[Claude Code on the web]** 커넥터 재등록 후 루틴이 옛 커넥터를 계속 부르던 문제, 자체 호스팅 환경 생성이 서버 오류로 반쯤 만들다 마는 문제를 고쳤다. "클라우드 세션 공유" 관리자 설정은 Data and privacy 로 옮겼고, 신규 사용자에게 뜨던 데스크톱 앱 다운로드 전체 화면은 없앴다. 루틴 상세 페이지도 재정비했다.
- **[Claude Tag] Slack 연동 수정 묶음** — Enterprise Grid 연결 해제 후 침묵, 조직 공유 비공개 채널의 예약 작업 미게시, 오래된 스레드 회신 시 작업 재시작·유실, 토큰 갱신 직후 "환경을 못 찾음" 오보, 채널 관리자 추가 거부를 고쳤다. 연관 공개 채널(예: 장애 채널)은 이제 요청 없이도 스스로 지켜본다. 관리자 Memory 페이지에 Claude 가 자체 개설한 채널도 뜬다.
- **[Claude Tag] AWS·OAuth 연결** — Budgets·Savings Plans·WAF Classic·Import/Export 같은 리전 없는 엔드포인트 거부와 Global Accelerator 서명 문제, 소문자 token type 을 반환하는 공급자와의 OAuth client-credentials·JWT-bearer 실패를 고쳤다. 서명 실패 시 원인과 해법을 알려준다.
- **[Code Review]** base 병합 시 전체 재리뷰 유발, @-멘션·줄바꿈 코드 스팬·백틱 HTML 태그 때문에 REVIEW.md 전체가 무시되던 문제, `/ultrareview --post` 의 중복·누락 게시, 대문자 포함 레포에서 빈 푸시 재리뷰를 고쳤다. 제안 수정은 "무엇이 계속 동작해야 하는지" 를 말하고, 두 번째 위치를 가리키는 코멘트는 잘린 조각 대신 완전한 문장으로 쓴다.

## 🔑 이번 버전의 핵심 키워드
**"조용한 실패를 말하게 만든 버전"** — 권한 우회·컨텍스트 2배 계측·서브에이전트 결과 유실 같은 침묵형 버그를 잡고, 거의 모든 오류 메시지가 원인과 조치를 이름으로 대도록 바꿨다.

---

# 📜 원문 (한글 번역본)

> 원문 ChangeLog를 원래 순서 그대로 한 줄도 빠짐없이 번역한 문서입니다.

- LLM 게이트웨이용 `x-claude-code-request-class`, `x-claude-code-agent-type`, `x-claude-code-prev-tool-durations`, `x-claude-code-compaction`, `x-claude-code-context-compacted` 요청 헤더 추가. `CLAUDE_CODE_GATEWAY_HINT_HEADERS=1` 로 옵트인.
- 세션 중 MCP 서버가 끊기고 자동 재연결이 포기했을 때 알림 추가. `/mcp` 를 가리킨다.
- `claude --remote-control` 또는 `/remote-control` 로 시작한 세션을 Claude 앱에서 포크하는 기능 추가. 포크는 내 컴퓨터의 백그라운드 세션으로 실행된다.
- 권한 검사기가 완전히 분석할 수 없는 Bash 명령이 `permissions.blockReadsOutsideWorkingDirectories` 아래서 확인 창을 건너뛰던 문제, 그리고 bypass 모드에서 서브셸이 위험한 `rm` 을 숨기던 문제 수정.
- 조직이 Skills 를 끈 뒤에도 claude.ai 에서 동기화된 스킬이 계속 사용 가능하던 문제 수정. 이제 복구 가능한 휴지통으로 이동한다.
- MDM 또는 `managed-settings.json` 으로 설정한 `allowManagedMcpServersOnly`, `deniedMcpServers`, `disableClaudeAiConnectors` 가 서버 관리 설정이 함께 있을 때 무시되던 문제 수정.
- Bedrock·Vertex·Foundry 의 401/403 오류와 Claude 앱 게이트웨이 403 이 `/login` 실행을 안내하던 문제 수정. 이제 갱신할 자격증명을 지목하거나 게이트웨이 관리자를 가리킨다.
- `/login`, `/upgrade`, `/extra-usage` 가 대화의 이전 thinking 을 버려 다음 요청에서 프롬프트 캐시를 전면 재작성하게 만들던 문제 수정.
- 클라우드 또는 Remote Control 세션에서 채팅에 첨부한 파일을 Artifact 도구가 업로드할 때 auto mode 가 승인을 기다리며 멈추던 문제 수정.
- 레포의 `.git` 디렉토리가 삭제·이동된 뒤에도 장시간 세션이 stub `.git/info/exclude` 를 다시 만들던 문제 수정.
- 이미 shell 모드일 때 메인 프롬프트가 맨 앞에 입력한 `!` 를 버리던 문제 수정. 이제 `! grep …` 같은 부정 명령을 입력할 수 있다.
- macOS 에서 Read 가 드래그해 넣은 스크린샷, 또는 시스템이 두 번째 경로로 보고하는 파일을 "symlink resolution changed after permission was checked" 로 거부하던 문제 수정.
- `permissions.blockReadsOutsideWorkingDirectories` 수정: 레포 설정이 선택한 메모리 디렉토리가 더 이상 프롬프트에 로드되거나, 회상·색인되거나, 메모리 추출에 사용되지 않는다.
- 최종 스트리밍 응답에 토큰 사용량이 빠졌거나 모델 id 가 없을 때 서브에이전트·백그라운드 에이전트가 실패로 보고되고 결과가 전달되지 않던 문제 수정.
- 컨텍스트 미터와 auto-compact 가 advisor 도구 턴을 실제 컨텍스트 크기의 약 2배로 계산해 auto-compact 가 실제 윈도의 약 절반에서 발동하던 문제 수정.
- 이미 작업을 마치고 에이전트 패널에 표시되지 않는 agent-team 팀원 때문에 `/tui` 가 재시작을 거부하던 문제 수정.
- `.claude/scheduled_tasks.json` 을 새 worktree 같은 다른 폴더로 복사한 뒤 저장된 예약 작업이 엉뚱한 세션에서 실행되던 문제 수정.
- 서브에이전트가 실행 중 백그라운드로 이동될 때(예: `CLAUDE_AUTO_BACKGROUND_TASKS`) SDK 및 `--output-format stream-json` 출력이 남은 메시지와 최종 보고를 누락하던 문제 수정.
- `/install-github-app` 이 SAML 싱글 사인온 차단을 "관리자 권한 필요" 로 보고하던 문제 수정.
- Claude Desktop·VS Code·JetBrains 세션에 연결된 Remote Control 클라이언트가 세션의 컨텍스트 윈도 사용량을 요청할 때 거부되던 문제 수정.
- "Running PreCompact hooks…" 같은 압축 상태 줄에서 스피너가 말줄임표를 이중("……")으로 표시하던 문제 수정.
- Artifacts 를 읽거나 게시한 뒤 frontend-design 플러그인을 제안하던 거짓 양성 스피너 팁 수정.
- 권한 검사기가 분석할 수 없는 Bash 줄(`eval`, `env -C`)에 대해 Read·Edit deny 규칙을 검사하던 2.1.268 변경 되돌림. `time -p make build` 같은 명령은 거부되지 않고 다시 확인 창이 뜬다.
- 긴 세션에서의 반응성 개선: hook 진행 상황과 서브에이전트 활동이 갱신마다 대화 전체를 재처리하지 않는다.
- Artifact 도구의 오류 개선: 아티팩트가 제공하지 않는 파일 타입이 게시에 포함되면, Claude 에게 제공 가능한 타입과 대안을 알려주고 터미널엔 한 줄로 표시한다.
- Artifact 도구의 페이지 읽기 개선: 해당 페이지에 게시 권한이 있는 사람을 위해, 아티팩트 서비스가 그 페이지에 대해 보유한 기능과 데이터베이스 규칙을 명시한다.
- 아티팩트 데이터베이스 쓰기 개선: 업데이트가 문서 전체를 재작성하지 않고 필드 하나만 제거할 수 있다.
- 아티팩트 게시 개선: claude.ai 에 도달한 뒤 연결이 끊긴 게시는 실패하거나 중복 버전을 만들지 않고 안전하게 재전송된다.
- IP 허용 목록, 정지된 앱 설치, SAML 싱글 사인온에 대한 클라우드 세션 GitHub 오류를 일반적인 설치 안내 대신 원인을 표시하도록 개선.
- `/autofix-pr` 개선: `gh pr view` 가 실패하면 일반적인 종료 코드 줄 대신 gh 자체 오류(로그인, SAML, 속도 제한)를 표시한다.
- `/autofix-pr` 개선: PR 에 GitHub webhook 전달을 설정할 수 없는 이유(예: 연결된 GitHub 계정 없음)를 일반 경고 대신 알려준다.
- `/web-setup` 오류 개선: 거부된 GitHub 토큰은 유력한 원인과 해결책을 나열하고, 연결 실패는 설정된 프록시나 TLS 인증서 문제를 지목한다.
- 세션 중 SSL 인증서·프록시 연결 오류를 개선해 오류 코드와 고칠 대상(예: 신뢰되지 않은 사내 CA 를 위한 `NODE_EXTRA_CA_CERTS`)을 명시.
- Claude 로그인이 만료되거나 취소되어 클라우드 세션을 만들 수 없을 때의 오류 개선: `/login` 실행을 안내한다.
- MCP 서버의 로그인이 세션 중 만료됐을 때 표시되는 오류를 개선해 재인증 방법(`/mcp`)을 알린다.
- Bedrock·Vertex·Foundry 의 auto mode 를 당분간 로컬 분류기 기본 사용으로 변경. 플랫폼의 서버 측 분류기를 쓰려면 `CLAUDE_CODE_AUTO_MODE_SERVER=1`.
- `OTEL_LOG_TOOL_DETAILS=1` 이 비용·토큰 지표에 실제 에이전트·스킬·플러그인·MCP 서버 이름도 포함하도록 변경.
- Claude 계정 로그인이 claude.ai 플러그인 접근 권한도 요청하도록 변경.
- `/bug`·`/feedback` 보고가 마지막 API 요청의 모델 동작 파라미터(model, system prompt, tools)만 포함하고 요청 메타데이터와 `CLAUDE_CODE_EXTRA_BODY` 필드는 제외하도록 변경.
- [VSCode] 제품 피드백을 비활성화한 조직에서 "Report a problem" 이 계속 표시되고 `/bug`·`/feedback` 이 보고 양식을 열던 문제 수정.
- [VSCode] Windows 에서 턴 완료 후 빨간 "Claude Code process exited with code 4294967295" 배너가 나타나던 문제 수정.
- Windows: `--add-dir` 로 매핑된 네트워크 드라이브를 추가했을 때 UNC 경로에 대한 네트워크 경로 권한 검사 개선.
- [Claude Code on the web] 관리자가 조직 커넥터를 제거 후 재추가하면 루틴이 접근을 잃고 옛 커넥터를 계속 호출하던 문제 수정.
- [Claude Code on the web] 조직 설정에서 자체 호스팅 환경을 만들 때 간헐적으로 서버 오류가 나며 반쯤 만들어진 환경이 남던 문제 수정.
- [Claude Code on the web] 관리자 "클라우드 세션 공유" 설정을 Claude Code 페이지 대신 Data and privacy 아래로 이동. Data and privacy 관리자도 관리할 수 있다.
- [Claude Code on the web] 새 루틴 페이지나 루틴 편집 대화상자가 입력한 루틴 이름·프롬프트·수정을 버리기 전에 "저장되지 않은 변경을 버릴까요?" 확인을 추가.
- [Claude Code on the web] 클라우드 환경이 없는 신규 사용자가 Mac·Windows 에서 보던 전체 화면 데스크톱 앱 다운로드 화면 제거. 이제 곧바로 설정으로 간다.
- [Claude Code on the web] 루틴 상세 페이지 개선: 브레드크럼에 메뉴와 이름 변경, 상단에 on/off 스위치와 Run now, 루틴 설정 옆에 실행 이력.
- [Claude Tag] Enterprise Grid 는 연결 해제됐지만 그 워크스페이스 중 하나가 연결된 채 남았을 때, 앱 재설치 몇 분 뒤 Claude 가 침묵하던 문제 수정.
- [Claude Tag] 조직 공유 비공개 Slack 채널에 설정한 예약 작업이 조용히 게시되지 않던 문제 수정. 이제 생성된 스레드에서 계속 실행된다.
- [Claude Tag] Claude 가 작업 중일 때 오래된 Slack 스레드에 회신하면 간혹 처음부터 재시작하며 아직 푸시하지 않은 작업을 잃던 문제 수정.
- [Claude Tag] 계정 토큰 갱신 직후 Claude 가 간혹 "Claude Code 환경을 찾을 수 없음" 이라는 잘못된 안내와 함께 메시지를 누락하던 문제 수정.
- [Claude Tag] AWS 연결이 Budgets, Savings Plans, WAF Classic, Import/Export 같은 리전 없는 엔드포인트를 거부하던 문제 수정. Global Accelerator 요청도 올바르게 서명된다.
- [Claude Tag] AWS 연결 실패 개선: 리전 없는 호스트명처럼 요청에 서명할 수 없을 때 Claude 에게 맨 오류 대신 이유와 해결 방법을 알린다.
- [Claude Tag] 소문자 token type 을 반환하는 공급자에서 OAuth client-credentials·JWT-bearer 연결이 실패하던 문제 수정. 이제 표준 Bearer 스킴으로 전송한다.
- [Claude Tag] Enterprise Grid 공유 채널, Claude 를 아직 쓰지 않은 채널, 레거시 비공개 채널에서 채널 관리자 추가가 거부되던 문제 수정.
- [Claude Tag] Claude 가 요청받았을 때만이 아니라, 대화가 의존하는 장애 채널 같은 연관 공개 채널을 스스로 지켜보기 시작하도록 변경.
- [Claude Tag] 관리자 Memory 페이지가 Claude 가 스스로 개설한 Slack 채널을 저장된 메모리가 있어도 표시하지 않던 문제 수정. 이제 관리자가 그 메모리를 열고·수정하고·삭제할 수 있다.
- [Code Review] 이전 리뷰가 "Additional findings" 를 나열한 PR 에 base 브랜치를 병합하면 전체 재리뷰가 발동하던 문제 수정. 이런 푸시는 이제 가벼운 후속 리뷰를 받는다.
- [Code Review] @-멘션, 여러 줄로 감싼 코드 스팬, 백틱으로 감싼 HTML 태그 때문에 REVIEW.md 전체가 무시되던 문제 수정. 이제 변경된 파일로 연결되는 줄만 보류된다.
- [Code Review] 다른 코드가 변경 대상 동작에 의존할 때, 제안된 수정이 무엇이 계속 동작해야 하는지 말하도록 개선.
- [Code Review] 두 번째 영향 위치를 가리키는 리뷰 코멘트가 잘린 조각 대신 완전한 문장으로 그 위치의 문제를 진술하도록 개선.
- [Code Review] `/ultrareview --post` 수정: GitHub 오류 후 재시도가 findings 코멘트를 누락하거나 중복하지 않고 정확히 한 번 게시한다. 코멘트에 리뷰한 커밋이 명시된다.
- [Code Review] 소유자나 이름에 대문자가 포함된 GitHub 레포에서 비어 있거나 내용이 동일한 푸시가 재리뷰되던 문제 수정. 이제 건너뛴다.

---

## 🎯 챌린지

이번 버전에서 내 환경에 적용해볼 만한 항목입니다.

### 1. MCP 서버 끊김 알림을 Stop hook 알림과 연결
- **파일**: `~/.claude/settings.json`
- **근거**: `figma`·`google-sheets`·`lazyweb`·`mobbin` 4개 MCP 서버를 쓰는데, 지금은 `Stop` hook 에만 macOS 알림이 붙어 있다. 이번 버전이 MCP 끊김 알림을 추가했으니 `Notification` hook 을 붙여 서버가 죽었을 때도 데스크톱 알림을 받도록 한다. MCP 도구가 조용히 안 뜨는 상황을 눈치채지 못한 채 작업하는 일을 막는다.
- **난이도**: ★☆☆ (약 10분)

### 2. `permissions.blockReadsOutsideWorkingDirectories` 켜기
- **파일**: `~/.claude/settings.json`
- **근거**: 이번 버전에서 이 설정의 구멍 두 개(분석 불가 Bash 명령이 확인 창을 건너뜀, 레포 설정이 고른 메모리 디렉토리가 프롬프트에 실림)가 막혔다. 홈 디렉토리에서 세션을 여는 일이 잦고 EOS·Poplus·flyff 등 여러 레포를 오가는 환경이라, 작업 디렉토리 밖 파일 읽기에 확인 창이 붙으면 엉뚱한 프로젝트 파일을 건드리는 사고(CLAUDE.md §10)를 한 겹 더 막는다.
- **난이도**: ★★☆ (약 15분)

### 3. `OTEL_LOG_TOOL_DETAILS=1` 로 스킬·서브에이전트별 토큰 비용 보기
- **파일**: `~/.claude/settings.json` 의 `env` 블록
- **근거**: 이번 버전부터 이 변수가 비용·토큰 지표에 실제 에이전트·스킬·플러그인·MCP 서버 이름을 담는다. 모든 subagent 를 Opus 로 돌리는(CLAUDE.md §5) 환경이라 어느 스킬·에이전트가 토큰을 먹는지 이름 단위로 보이면 `effortLevel: xhigh` + `opus[1m]` 조합의 실제 비용을 근거 있게 판단할 수 있다.
- **난이도**: ★☆☆ (약 5분)

### 4. `deploy-guard.sh` 에 서브셸 `rm` 패턴 점검 추가
- **파일**: `~/.claude/hooks/deploy-guard.sh`
- **근거**: 이번 버전이 bypass 모드에서 서브셸이 위험한 `rm` 을 숨기던 문제를 고쳤다. 현재 `deploy-guard.sh` 는 `PreToolUse`/`Bash` 에 붙어 push 만 막는다. 같은 hook 에 `$(...)`·백틱 안의 `rm -rf` 패턴 차단을 한 줄 추가하면, 하니스 수정과 무관하게 내 쪽에서도 같은 구멍을 막는다.
- **난이도**: ★★☆ (약 20분)
