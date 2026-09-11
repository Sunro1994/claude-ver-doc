# Claude Code v2.1.268

> 작성일: 2026-09-11

---

# 📋 요약본

## 🎉 신기능 (7건)
- **게이트웨이 요금 정보 전달** — `gateway.yaml`에 `pricing:`을 설정하면 로그인한 Claude Code 클라이언트가 managed settings를 통해 동일한 요금을 받는다. `/cost`와 telemetry 수치가 실제 지출 미터와 일치한다.
- **게이트웨이 접근 제어 경고** — `access_control.allow_cidrs`가 비어 있으면 시작 시 경고한다. 공인 IP에서 첫 요청이 들어올 때도 1회 경고한다.
- **`gatewayInternalNetworks` managed setting 추가** — 관리자가 조직 소유 공인 IPv4 대역에서 게이트웨이로 `/login`을 허용할 수 있다.
- **`claude self-hosted-runner --remove-session-state`** — 기본 off. 세션 종료 시 `<base-dir>/_sessions/` 아래 세션별 디렉토리를 삭제한다.
- **`claude auth status --json`에 `configDirectory` 추가** — 설정 디렉토리 경로를 JSON으로 확인할 수 있다.
- **플러그인 CLI의 `--json` 지원 확대** — `claude plugin install`·`uninstall`·`update`·`enable`·`disable`에 `--json`을 추가. `claude plugin list --json` 각 행에 `errorDetails`/`noteDetails`가 붙는다.
- **아티팩트 브라우저 탭 아이콘** — 게시된 아티팩트에 Claude가 페이지에 맞는 아이콘을 골라 넣는다.

## 🛠️ 개선/수정 (80건)

### 치명 버그 수정
- **서드파티 엔드포인트 HTTP 400 전면 실패 수정** — `ANTHROPIC_BASE_URL`로 Anthropic 호환 엔드포인트를 쓰면 2.1.265부터 모든 턴이 400으로 실패했다. 원인은 Artifact 도구 입력 스키마의 정규식을 그 엔드포인트들이 거부한 것.
- **WebFetch 무한 대기 수정** — 응답을 끝내지 않고 열어두는 서버에서 영원히 멈추던 문제. 이제 300초 후 실패한다. `CLAUDE_CODE_WEBFETCH_DEADLINE_MS`로 조정 가능(0이면 해제).
- **CPU 상시 점유 수정** — 장시간 idle 세션의 busy loop가 CPU 코어를 붙잡던 문제, 세션 recap 중 빠른 터미널 포커스 보고로 CPU가 계속 높던 문제 해결.
- **신뢰하지 않은 폴더의 에이전트 파일 오염 수정** — 재생성된 in-process 팀메이트가 미신뢰 폴더의 동명 에이전트 파일에서 도구·시스템 프롬프트를 가져오던 문제.

### 권한·보안
- **심볼릭 링크 경로 deny/ask 규칙 수정** — macOS의 `/etc`·`/tmp`·`/var`, Linux의 `/bin`에서 실제 경로로 지정하면 규칙이 적용되지 않던 문제. Bash 명령이 심볼릭 링크 표기 deny 규칙을 무시하던 문제도 해결.
- **분석 불가 명령과 같은 줄의 deny 규칙 수정** — `env -C`·`eval` 등 권한 검사기가 분석할 수 없는 명령이 같은 줄에 있으면 Read/Edit deny 규칙이 적용되지 않던 문제.
- **시크릿 노출 수정** — 플러그인·마켓플레이스 에러가 git 소스 URL의 토큰·비밀번호를 표시하던 문제. `/mcp`·`/plugin` 서버 상세, `claude mcp list`/`get`, MCP 로그인 에러가 `${VAR}` 치환 결과를 그대로 보여주던 문제.
- **Cowork 로컬 세션 승인 생략 모드 변경** — Artifact 도구가 세션 폴더 밖 파일이나 심볼릭 링크 뒤 파일을 묻지 않고 읽던 동작을 거부로 변경.
- **`WebFetch` deny/ask 규칙 적용 범위 변경** — 평범한 `WebFetch` 규칙은 Artifact 도구의 읽기·수정에 더 이상 적용되지 않는다. 차단하려면 `Artifact` 규칙 또는 `WebFetch(domain:claude.ai)`를 쓴다.
- **Bash 샌드박스 안내 문구 과장 수정** — 파일시스템 격리가 꺼져 있을 때 강제되지 않는 경로 목록을 보여주지 않는다. strict 모드도 "절대 샌드박스 밖에서 실행될 수 없다"고 주장하지 않는다.

### 모델·세션
- **SDK `excludeDynamicSections` 캐싱 깨짐 수정** — 첫 메시지를 요청마다 다시 렌더링하지 않아 prompt caching과 extended thinking이 세션 중간에 깨지지 않는다.
- **모델 접근 캐시 오류 수정** — 재시작 후나 Desktop Code 탭에서 자격 있는 사용자에게 모델이 제한되었다고 잘못 안내하던 문제. 다른 Claude Code 프로세스가 캐시를 갱신하면 실행 중 세션이 조용히 조직 기본 모델로 바뀌던 문제.
- **Fable 모델 long-context 429 메시지 수정** — Pro·Team 플랜에서 1M 컨텍스트 안내 대신 usage-credits 동의 프롬프트가 뜨던 문제.
- **`/compact` 요약의 `$` 문자 깨짐 수정**, **`/compact`로 끝난 대화 재개 시 복원 파일 노트 순서 고정**, **SDK 프롬프트 제안·사이드 질문·`/rename`이 압축 이전 대화를 보내던 문제 수정**.
- **작업 추적 도구 제공 범위 변경** — TaskCreate/Get/Update/List·TodoWrite는 Claude 3.x, Opus 4.0~4.7, Sonnet 4.0~4.6, Haiku 4.5에서만 제공. 그 외에는 `CLAUDE_CODE_ENABLE_TODO_TOOLS=1` 설정 필요.

### 성능
- **fullscreen 모드 재렌더링 개선** — Shift+Enter로 프롬프트 줄을 추가·삭제할 때 문자 입력만큼 빠르게 다시 그린다.
- **`--continue`/`--resume` 개선** — SessionStart hook을 기다리지 않고 대화가 즉시 뜬다. 첫 메시지가 전체 트랜스크립트를 다시 읽지 않는다.
- **도구 집약 턴 반응성 개선** — 숨겨진 per-tool-batch reminder 때문에 트랜스크립트를 다시 그리지 않는다.
- **`.claude/workflows/` 프로젝트 시작 속도 개선** — 목록 표시에 각 스크립트를 파싱하지 않는다.
- **Claude in Slack 읽기 전용 조회 병렬화** — Slack 검색·스레드 읽기·사람 찾기를 순차가 아닌 동시에 실행한다.

### UI·UX
- **auto 모드 거부 메시지 개선** — 어떤 규칙이 막았는지 이름을 밝히고, 더 안전한 방법을 시도하고 무관한 작업을 끝낸 뒤 질문하도록 요청한다.
- **`/plugin` 즉시 반영** — 설치·활성화·비활성화가 메뉴를 닫는 즉시 적용된다. `/reload-plugins` 불필요.
- **MEMORY.md 잘림 경고 개선** — 몇 줄이 잘렸는지, 어디부터 잘렸는지 표시한다.
- **스피너 줄바꿈 수정** — 작업 라벨이 길어도 라벨과 "Next:" 줄이 한 터미널 행을 넘지 않는다.
- **프롬프트 푸터 개선** — 에디터·`/diff` 선택 영역이 프롬프트 입력 안에 표시된다. fullscreen 모드는 Remote Control 상태를 푸터 대신 헤더에 보여준다.
- **`@` 파일·`/` 명령 제안 수정** — 위 화살표로 이전 프롬프트를 불러와 편집하면 제안이 뜨지 않던 문제.
- **`claude agents` 조작 개선** — ← 키 연타가 1초 넘게 쉬어야만 먹히던 문제, worktree 제거 실패 시 세션 삭제가 멈추던 문제(원인·다음 단계 안내, ctrl+x 재입력 시 디렉토리 강제 삭제) 수정. 에이전트 패널의 백그라운드 에이전트·워크플로우 행이 줄바꿈 때문에 여러 줄로 늘어나던 문제도 수정.
- **hook·headless 수정** — `--print` 모드에서 PermissionRequest hook이 발화하지 않던 문제, `-p` 실행에서 policy-helper 경고가 출력되지 않던 문제, `CLAUDE_CODE_SESSIONEND_HOOKS_TIMEOUT_MS`가 per-hook `timeout` 없는 SessionEnd hook에 적용되지 않던 문제(1.5초에 취소됨) 해결.
- **명령 안내 개선** — `/remote-control` 등은 로그아웃 상태에서 `/login`을 안내한다. `/autofix-pr` 등은 GitHub 계정 미연결 시 `/web-setup`을 안내한다. `/teleport`·`/remote-env`는 조직 정책으로 꺼졌음을 설명한다.
- **MCP 인증 알림 변경** — "N개 MCP 서버 인증 필요" 공지를 매 실행이 아니라 서버당 1회만 알린다.

### 플랫폼 (Bedrock/Vertex/Foundry)
- **시스템 프롬프트 전달 방식 변경** — 환경·모델·설정 정보를 첨부(attachment)로 전달해 1st-party 세션과 일치시켰다.
- **도구 목록 byte 안정성 확보** — 늦게 연결되는 도구는 deferred로 로드해 대화 중 도구 목록을 다시 쓰지 않는다.

### VSCode (11건)
- `CLAUDE_CONFIG_DIR` 관련 세션 목록·설정 토글·채팅 탭 수정, 커스텀 스타일 저장 위치 수정
- 로그인·로그아웃·계정 전환 후 모델 pill·모델 선택기·명령 메뉴가 잠시 빈 화면이 되던 문제 수정
- 프로젝트/로컬 설정이 `~/.claude/settings.json` 모델을 덮어쓸 때 Auto가 모드 선택기에서 사라지던 문제 수정
- SessionStart hook 설정 시 창 리로드 후 세션 이름이 마지막 프롬프트로 되돌아가던 문제 수정
- 푸터 pill이 다른 탭이 이미 떠 있는데도 새 탭 프로세스 시작을 기다리던 문제, 두 번째 Claude 프로세스가 전체 startup을 다시 돌던 문제 수정
- `claudeCode.preferredLocation: "sidebar"` 무시 문제 수정
- Windows: WSL 미설치 기기의 WSL 설치 프롬프트 제거, WSL 설치 시 Windows 파일 IDE 진단 정상화
- 접근성: always-allow 권한 규칙 저장 위치를 ←/→ 키로 변경, "Claude Code: Focus last message" 명령 추가
- Manage plugins 변경 사항이 재시작 없이 열린 세션에 적용됨. 일부 아티팩트 권한 프롬프트에서 "don't ask again" 제거

### Claude Code on the web (3건)
- 6시간 넘게 실행된 클라우드 세션이 persisted 폴더 저장 파일을 조용히 잃던 문제 수정(이제 최대 1일 유지)
- 관리자가 effort를 제한한 조직에서 "Invalid effort level" 오류 수정
- 커넥터 없는 routine 생성 시 그 사실과 추가 방법을 안내

### Claude Tag / Slack (13건)
- 관리자 설정 페이지 로딩 실패 시 Retry 버튼 제공, Slack 채널 설정 페이지에서 조직 관리 설정으로 가는 링크 추가
- Slack Enterprise Grid 채널을 다른 워크스페이스로 옮기면 설정(레포·환경·접근)이 사라지던 문제 수정
- 차단된 동작 설명 개선(권한 검사·스스로의 확인 판단·접근 권한 부재 중 무엇인지 명시)
- 문장 길이 비교는 가로 스크롤 표 대신 목록으로 출력, 긴 셀은 줄바꿈
- `@Claude !restart`, 게스트 @mention, 장시간 세션 교체, 설정 카드 중복 클릭, 꺾쇠 괄호 URL 링크 등 다수 수정
- 공개 채널 메모리 분리 — 채널마다 자기 노트만 유지, 다른 공개 채널 노트는 회상하지 않는다. 워크스페이스 노트는 공유 유지
- org 불일치 안내 개선 — 워크스페이스를 조직에 연결하는 방법을 설명

### Code Review (4건)
- 후속 리뷰의 미해결 목록에 안내 추가 — 답글만 달지 말고 스레드를 resolve 해야 다음 리뷰에서 미해결로 세지 않는다
- 검증 에이전트가 중간에 실패해도 대체 에이전트를 투입해 판정까지 도달
- 실행 중 리뷰 뒤에 대기하던 push 리뷰가 PR이 draft로 바뀐 뒤에도 게시되던 문제 수정
- PR이 루트 파일(예: `README.md`)을 수정했을 때 이름만 같은 파일 때문에 디렉토리 CLAUDE.md 규칙을 무시하던 문제 수정
- Claude in Slack 세션이 조직 managed settings의 MCP allowlist 때문에 Slack 도구를 잃던 문제 수정
- Claude in Chrome: 스키마는 있으나 호스트 파싱이 불가한 URL에서 "https" 호스트 허용을 묻던 문제 수정, 긴 페이지 읽기를 파일로 저장·재읽기 하지 않고 인라인 유지
- 기타: MCP 도구 호출 후 "메시지가 비어 있습니다" 응답, workload identity federation `401 … jti reused`, MCP OAuth "No available ports for OAuth redirect", `claude plugin validate`의 점 두 개 디렉토리명 거부, 기본 monitors 파일·루트 SKILL.md 조용한 skip, WebFetch의 localhost 거부 사유 미설명, `/resume`의 `/fork` 세션 이름, Remote Control 세션 `ListAgents` 이름, `/bug`·`/feedback` 커서 미표시, 아티팩트 권한 프롬프트 문구·카드화 수정

## 🔑 이번 버전의 핵심 키워드
**"샌드박스·권한 규칙의 구멍을 메우고, 멈춤·발열을 잡았다"** — 심볼릭 링크·`eval` 우회로 뚫리던 deny 규칙과 로그에 새던 시크릿을 막고, WebFetch 무한 대기·CPU 상시 점유·서드파티 엔드포인트 전면 400을 동시에 해결한 안정화 릴리스.

---

# 📜 원문 (한글 번역본)

> 원문 ChangeLog를 원래 순서 그대로 한 줄도 빠짐없이 번역한 문서입니다.

- Claude apps 게이트웨이에 추가: `gateway.yaml`에 `pricing:`을 설정하면 로그인한 Claude Code 클라이언트가 managed settings를 통해 동일한 요금을 받는다. `/cost`와 telemetry가 지출 미터와 일치한다
- `access_control.allow_cidrs`가 비어 있는 게이트웨이에 시작 경고를 추가하고, 공인 주소에서 요청이 처음 도착할 때 1회 경고를 추가
- `gatewayInternalNetworks` managed setting 추가 — 관리자가 조직 소유 공인 IPv4 대역에서 Claude apps 게이트웨이로 `/login`을 허용할 수 있다
- `claude self-hosted-runner --remove-session-state` 추가(기본 off): 세션이 끝날 때 `<base-dir>/_sessions/` 아래 세션별 디렉토리를 삭제한다
- `claude auth status --json` 출력에 `configDirectory` 추가
- `claude plugin install`·`uninstall`·`update`·`enable`·`disable`에 `--json` 추가, `claude plugin list --json`의 각 행에 `errorDetails`/`noteDetails` 추가
- 게시된 아티팩트에 브라우저 탭 아이콘 추가 — Claude가 각 페이지에 맞게 고른다
- 2.1.265부터 서드파티 Anthropic 호환 엔드포인트(`ANTHROPIC_BASE_URL`)에서 모든 턴이 HTTP 400으로 실패하던 문제 수정: Artifact 도구 입력 스키마의 정규식을 그 엔드포인트들이 거부한 것이 원인
- 응답을 끝내지 않고 열어두는 서버에서 WebFetch가 무한정 멈추던 문제 수정. 이제 300초 후 실패한다. `CLAUDE_CODE_WEBFETCH_DEADLINE_MS`로 마감 시간을 재정의할 수 있다(0이면 해제)
- 재생성된 in-process 팀메이트가 신뢰하지 않은 폴더의 동명 에이전트 파일에서 도구나 시스템 프롬프트를 가져오던 문제 수정
- 지속적인 높은 CPU 사용 수정: 장시간 idle 세션의 busy loop가 더 이상 CPU 코어를 점유하지 않으며, 세션 recap 중 빠른 터미널 포커스 보고도 CPU를 높게 유지하지 않는다
- MCP 도구 호출 후 Claude가 간혹 "메시지가 비어 있게 도착했습니다"라고 답하던 문제 수정
- 심볼릭 링크 디렉토리(macOS의 `/etc`·`/tmp`·`/var`, Linux의 `/bin`)에 대한 deny·ask 권한 규칙이 경로를 실제 위치로 지정했을 때 적용되지 않던 문제와, Bash 명령이 심볼릭 링크 표기로 쓴 deny 규칙을 무시하던 문제 수정
- 권한 검사기가 분석할 수 없는 `env -C`·`eval` 등의 명령이 같은 줄에 있을 때 Read 또는 Edit deny 규칙이 적용되지 않던 경우 수정
- 플러그인·마켓플레이스 에러가 git 소스 URL의 토큰이나 비밀번호를 노출하던 문제 수정
- `/mcp`·`/plugin` 서버 상세, `claude mcp list`/`get`, MCP 로그인 에러가 MCP 설정의 `${VAR}` 자리표시자에서 해석된 시크릿을 노출하던 문제 수정
- `excludeDynamicSections`를 쓰는 SDK 세션에서 prompt caching과 extended thinking이 세션 도중 깨지던 문제 수정: 첫 메시지를 요청마다 다시 렌더링하지 않는다
- 캐시된 모델 접근 거부 항목이 오래되었을 때, 자격 있는 사용자에게 재시작 후나 Desktop Code 탭에서 모델이 제한되었다고 안내하던 문제 수정
- 다른 Claude Code 프로세스가 오래된 모델 접근 항목을 갱신했을 때 실행 중 세션이 조용히 조직 기본 모델로 바뀌던 문제 수정
- Fable 모델의 long-context 429가 Pro·Team 플랜에서 1M 컨텍스트 메시지 대신 usage-credits 동의 프롬프트를 보여주던 문제 수정
- 프로필을 통한 workload identity federation(claude-code-action이 설정하는 방식) 수정: 프로필을 공유하는 프로세스들이 실행 중 `401 … jti reused`로 실패할 수 있던 문제
- 로컬 콜백 포트 범위를 바인딩할 수 없을 때 MCP 서버 OAuth 로그인이 "No available ports for OAuth redirect"로 실패하던 문제 수정
- `/compact`와 auto-compact가 만든 대화 요약이 `$` 시퀀스가 포함된 텍스트를 망가뜨리던 문제 수정
- `/compact`로 끝난 대화를 재개할 때, 복원된 파일 노트가 재개할 때마다 같은 순서로 로드되도록 수정
- SDK 프롬프트 제안·사이드 질문·`/rename`이 압축 이전 시점의 대화를 보내던 문제 수정
- 위 화살표로 이전 프롬프트를 불러와 편집한 뒤 `@` 파일·`/` 명령 제안이 나타나지 않던 문제 수정
- `claude agents` 수정: 에이전트 목록으로 돌아가려고 자연스러운 속도로 ←를 다시 누를 때 1초 넘게 쉬어야만 인식되던 문제 해소
- worktree를 제거할 수 없을 때 `claude agents`의 세션 삭제가 멈추던 문제 수정: 메시지가 원인과 다음 단계를 알려주며, git worktree의 경우 ctrl+x를 다시 누르면 디렉토리를 그냥 삭제한다
- 에이전트 패널의 백그라운드 에이전트·워크플로우 행이 텍스트에 줄바꿈이 있으면 여러 줄로 늘어나던 문제 수정
- 조직 managed settings가 MCP allowlist를 설정했을 때 Claude in Slack 세션이 Slack 도구를 잃던 문제 수정
- 내비게이션 URL에 스키마는 있으나 호스트를 파싱할 수 없을 때 Claude in Chrome이 호스트 "https" 허용을 묻던 문제 수정
- 현재 작업의 라벨이 길 때 스피너가 여러 줄로 넘어가던 문제 수정. 이제 라벨과 "Next:" 줄이 한 터미널 행 안에 들어간다
- 터미널의 네이티브 커서가 켜져 있을 때 `/bug`·`/feedback` 설명 입력란에 커서가 보이지 않던 문제 수정
- `claude remote-control`이 제공하는 Remote Control 세션이 `ListAgents`에서 세션 제목 대신 생성된 이름으로 표시되던 문제 수정
- 플러그인 로더는 허용하는데 `claude plugin validate`는 디렉토리명이 점 두 개로 시작하는 플러그인 경로를 거부하던 문제 수정
- 확인할 수 없는 기본 monitors 파일이나 루트 SKILL.md를 플러그인이 조용히 건너뛰던 문제 수정
- WebFetch의 localhost 및 점 없는 호스트명 에러를 수정해, URL이 거부되는 이유를 설명하고 curl을 제안하도록 변경
- `--print` 모드에서 PermissionRequest hook이 발화하지 않던 문제 수정
- headless(`-p`) 실행에서 policy-helper 경고가 출력되지 않던 문제 수정
- `/resume`이 `/fork` 백그라운드 세션을 자기 고유의 `⑂` fork 이름 대신 부모 이름으로 나열하던 문제 수정
- `/remote-control` 등 claude.ai 연동 명령이 로그아웃 상태에서 Claude for Enterprise 마이그레이션 메시지 대신 `/login`을 제안하도록 수정
- per-hook `timeout`이 없는 SessionEnd hook을 `CLAUDE_CODE_SESSIONEND_HOOKS_TIMEOUT_MS`가 연장하지 못하던 문제 수정(여전히 1.5초 후 취소되었다)
- `/autofix-pr` 등 클라우드 세션 명령이 GitHub 계정 미연결 상태에서 재시도나 Claude GitHub App 설치를 안내하던 문제 수정. 이제 `/web-setup` 또는 웹 연결 페이지를 안내한다
- `/teleport`·`/remote-env` 같은 클라우드 세션 명령이 조직 정책으로 꺼졌을 때 "Unknown command"라고 답하는 대신 그 사실을 설명하도록 수정
- Bash 샌드박스 안내가 격리 범위를 과장하던 문제 수정: 파일시스템 격리가 꺼져 있으면 강제되지 않는 경로 목록을 보여주지 않고, strict 모드도 명령이 절대 샌드박스 밖에서 실행될 수 없다고 주장하지 않는다
- fullscreen 모드 개선: 프롬프트 줄 추가·삭제(Shift+Enter)가 보이는 트랜스크립트를 다시 렌더링하지 않고 문자 입력만큼 빠르게 다시 그려진다
- `--continue`/`--resume` 개선: SessionStart hook을 기다리지 않고 대화가 즉시 나타나며, 첫 메시지가 트랜스크립트 전체를 다시 읽지 않는다
- 숨겨진 per-tool-batch reminder 때문에 트랜스크립트를 다시 그리지 않도록 해, 도구 집약적인 턴의 반응성 개선
- `.claude/workflows/` 스크립트가 있는 프로젝트의 시작 시간 개선: 목록을 만들 때 각 스크립트를 파싱하지 않는다
- auto 모드 거부 개선: Claude가 받는 메시지가 어떤 규칙이 동작을 막았는지 밝히고, 더 안전한 방법을 시도하고 무관한 작업을 끝낸 뒤 사용자에게 물으라고 요청한다
- Claude in Chrome 개선: 긴 페이지 읽기가 파일로 저장했다가 다시 읽는 대신 인라인으로 유지된다
- MEMORY.md 잘림 경고 개선 — 몇 줄이 잘렸고 어디서부터 잘렸는지 표시
- 아티팩트에 대한 터미널 권한 프롬프트 개선 — 이제 질문을 먼저 제시한다
- 프롬프트 푸터 개선: 에디터나 `/diff` 선택이 프롬프트 입력 안에 표시되고, fullscreen 모드는 Remote Control 상태를 푸터 대신 헤더에 표시
- "1M 컨텍스트에 usage credits 필요" 메시지 개선 — 세션 도중 켠 usage credits는 Claude Code를 재시작해야 적용된다고 안내
- `/plugin` 개선: 플러그인 설치·활성화·비활성화가 메뉴를 닫을 때 적용된다. 이후 `/reload-plugins`가 더 이상 필요 없다
- Bedrock·Vertex·Foundry의 시스템 프롬프트를 변경해 환경·모델·설정 정보를 첨부로 전달 — 1st-party 세션과 일치
- Bedrock·Vertex·Foundry 세션이 대화 전체에서 도구 목록을 byte 단위로 안정하게 유지하도록 변경(늦게 연결되는 도구는 목록을 다시 쓰지 않고 deferred로 로드) — 1st-party 세션과 일치
- 작업 추적 도구(TaskCreate/Get/Update/List, TodoWrite)를 Claude 3.x, Opus 4.0~4.7, Sonnet 4.0~4.6, Haiku 4.5에서만 제공하도록 변경. 그 외에는 `CLAUDE_CODE_ENABLE_TODO_TOOLS=1`을 설정
- 터미널의 아티팩트 데이터 수정 권한 프롬프트를 문서 개수와 열람 가능 대상을 보여주는 카드로 변경
- 모든 승인을 건너뛰도록 설정된 로컬 Cowork 세션 변경: Artifact 도구가 세션 폴더 밖 파일이나 심볼릭 링크 뒤의 파일을 묻지 않고 읽는 대신 거부한다
- 평범한 `WebFetch` deny·ask 규칙이 Artifact 도구의 읽기·수정에 더 이상 적용되지 않도록 변경. 차단하거나 게이트하려면 `Artifact` 규칙(또는 `WebFetch(domain:claude.ai)`)을 사용
- "N개의 MCP 서버에 인증이 필요합니다" 시작 알림을 매 실행마다가 아니라 서버당 한 번만 알리도록 변경
- [VSCode] 설정 파일이나 `environmentVariables` 설정에서 `CLAUDE_CONFIG_DIR`이 지정됐을 때의 세션 목록·설정 토글·채팅 탭 수정
- [VSCode] 로그인·로그아웃·계정 전환 후 열린 탭에서 모델 pill·모델 선택기·명령 메뉴가 몇 초간 빈 화면이 되던 문제 수정
- [VSCode] 프로젝트 또는 로컬 설정이 `~/.claude/settings.json`에 지정된 모델을 덮어쓸 때 새 탭이나 방금 리로드한 대화의 모드 선택기에서 Auto가 사라지던 문제 수정
- [VSCode] SessionStart hook이 설정된 상태에서 창을 리로드하면 세션 이름이 마지막 프롬프트로 되돌아가던 문제 수정
- [VSCode] 같은 창의 다른 탭이 이미 떠 있는데도 푸터의 모델 pill과 Remote Control pill이 새 탭의 Claude 프로세스 시작을 기다리던 문제 수정
- [VSCode] 세션 탭의 실행 요청이 설정 읽기보다 0.5초 넘게 늦게 도착했을 때 두 번째 Claude 프로세스가 전체 startup을 다시 돌던 문제 수정
- [VSCode] 세션 목록에서 세션을 재개할 때 `claudeCode.preferredLocation: "sidebar"`를 무시하고 항상 패널로 열리던 문제와, 프로그래밍 방식 열기가 그 설정을 "panel"로 되돌리던 문제 수정
- [VSCode] Windows 문제 수정: WSL이 설치되지 않은 기기에서 WSL 설치 프롬프트가 뜨지 않으며, WSL이 설치된 경우 Windows 파일에 대한 IDE 진단이 올바르게 반환된다
- [VSCode] `CLAUDE_CONFIG_DIR`이 설정을 통해 지정됐을 때 커스텀 스타일 빌더가 User 레벨 스타일을 CLI가 읽지 않는 폴더에 저장하던 문제 수정
- [VSCode] 키보드·스크린리더 사용자를 위해, always-allow 권한 규칙의 저장 위치를 바꾸는 ←·→ 키 추가
- [VSCode] 키보드·스크린리더 사용자를 위해, 대화의 최신 메시지로 키보드 포커스를 옮기는 "Claude Code: Focus last message" 명령 추가
- [VSCode] Manage plugins 대화상자의 설치·활성화·비활성화·제거가 재시작 없이 열린 세션에 적용되도록 변경
- [VSCode] 일부 아티팩트 권한 프롬프트에서 "don't ask again" 선택지를 제거해 터미널과 일치시킴
- [Claude Code on the web] 약 6시간 넘게 실행된 클라우드 세션이 persisted 세션 폴더에 저장한 파일을 조용히 잃던 문제 수정. 이제 최대 하루까지 유지된다
- [Claude Code on the web] routine이 세션을 재개하거나 effort가 설정되지 않은 채 세션이 시작될 때, 관리자가 모델 effort 상한을 둔 조직에서 "Invalid effort level" 오류가 나던 문제 수정
- [Claude Code on the web] 대화에서 routine을 만들 때 개선: 새 routine에 커넥터가 없으면 Claude가 확인만 하지 않고 그 사실과 추가 방법을 알려준다
- [Claude Tag] 관리자 설정 페이지가 일시적 로드 실패 후 로딩 스켈레톤에서 멈추거나 빈 화면이 되던 문제 수정. 로드에 실패한 섹션은 이제 Retry 버튼을 보여준다
- [Claude Tag] Slack 채널 설정 페이지에서 조직의 Claude in Slack 관리자 설정으로 돌아가는 링크 추가
- [Claude Tag] Slack 관리자가 Slack Enterprise Grid 채널을 다른 워크스페이스로 옮겼을 때 그 채널의 Claude 설정(레포·환경·접근)이 사라지던 문제 수정
- [Claude Tag] Claude가 차단된 동작을 설명하는 방식 개선 — 권한 검사, 먼저 확인하겠다는 자체 판단, 접근 권한 부재 중 무엇이 막았는지 밝힌다
- [Claude Tag] 응답 속도 개선 — 여러 읽기 전용 조회(Slack 검색, 스레드 읽기, 사람 찾기)를 순차가 아닌 동시에 실행한다
- [Claude Tag] 비교 형식 개선 — 문장 길이의 비교는 가로로 스크롤되는 넓은 표 대신 목록으로 나오며, 긴 표 셀은 줄바꿈된다
- [Claude Tag] 자체 세션이 있는 스레드에서 `@Claude !restart`가 간혹 "이 스레드는 채널 세션이 처리합니다"라는 모순된 공지도 함께 올리던 문제 수정
- [Claude Tag] Claude 계정이 Slack 워크스페이스와 다른 조직에 있을 때 표시되는 메시지 개선 — 이제 워크스페이스를 조직에 연결하는 방법을 설명한다
- [Claude Tag] URL이 꺾쇠 괄호로 감싸인 Markdown 링크가 Slack에서 클릭 가능한 링크 대신 대괄호 텍스트로 표시되던 문제 수정
- [Claude Tag] 게스트가 Claude를 쓸 수 있는 채널에서 워크스페이스 게스트의 최상위 @mention이 간혹 답 대신 "Slack 계정이 연결되지 않았습니다"로 응답되던 문제 수정
- [Claude Tag] 채널의 장시간 실행 세션이 대화 도중 새 세션으로 교체되던 문제 수정. 예약된 갱신은 이제 채널과 스레드가 조용해질 때까지 기다린다
- [Claude Tag] 두 번 이상 클릭된 채널 설정 카드가 이미 적용된 뒤에 제안한 세션에 변경이 거부됐다고 알리던 문제 수정. 결과는 이제 한 번만 전송된다
- [Claude Tag] 공개 채널의 메모리 변경 — 이제 각 채널이 자기 노트를 따로 보관하며, Claude는 다른 공개 채널에서 저장한 노트를 회상하지 않는다. 워크스페이스 노트는 계속 공유된다
- [Code Review] 후속 리뷰의 미해결 findings 목록 아래에 안내 추가 — 답글만 다는 것이 아니라 스레드를 resolve 해야 이후 리뷰가 미해결로 세지 않는다
- [Code Review] finding을 검증하는 에이전트 중 하나가 도중에 실패하면 리뷰가 미완으로 끝나던 문제 수정. 이제 그 에이전트를 교체해 판정까지 도달한다
- [Code Review] 실행 중인 리뷰 뒤에 대기하던 push 트리거 리뷰가, PR이 draft로 전환된 뒤에도 게시되던 문제 수정
- [Code Review] PR이 루트 파일(예: `README.md`)을 수정했을 때, CLAUDE.md가 나열한 파일과 이름만 같다는 이유로 리뷰가 해당 디렉토리의 CLAUDE.md 규칙을 무시하던 문제 수정

---

## 🎯 챌린지

이번 버전에서 내 환경에 적용해볼 만한 항목입니다.

### 1. WebFetch 무한 대기 마감 시간 조정
- **파일**: `~/.claude/settings.json` (`env` 블록에 `CLAUDE_CODE_WEBFETCH_DEADLINE_MS` 추가)
- **근거**: 이번 버전에서 WebFetch에 300초 기본 마감이 생겼다. `claude-changelog-sync` 스킬은 GitHub raw CHANGELOG를 가져오고, lazyweb·figma MCP도 네트워크를 탄다. 300초는 자동 cron 실행에서 너무 길다 — `60000`(60초)로 줄이면 매일 08:00 동기화가 멈춘 서버 때문에 5분씩 붙잡히지 않는다.
- **난이도**: ★☆☆ (약 5분)

### 2. SessionEnd hook 타임아웃 명시
- **파일**: `~/.claude/settings.json` (`hooks.Stop`의 osascript 알림, `env`에 `CLAUDE_CODE_SESSIONEND_HOOKS_TIMEOUT_MS`)
- **근거**: `per-hook timeout`이 없는 SessionEnd hook이 1.5초에 취소되던 버그가 이번에 고쳐졌다. 현재 Stop hook의 `osascript` 알림에는 `timeout`이 없다 — macOS에서 알림 표시가 느릴 때 조용히 잘렸을 수 있다. 각 hook에 `"timeout": 5`를 명시하거나 환경변수로 전역 연장하면 작업 완료 알림이 안정적으로 뜬다.
- **난이도**: ★☆☆ (약 5~10분)

### 3. `deploy-guard.sh`의 심볼릭 링크·`eval` 우회 점검
- **파일**: `~/.claude/hooks/deploy-guard.sh`
- **근거**: 이번 버전은 `env -C`·`eval`이 같은 줄에 있으면 deny 규칙이 무력화되던 문제를 고쳤다. `deploy-guard.sh`는 `git push origin feat/*` 차단이 목적인 PreToolUse hook인데, 커맨드 문자열을 단순 패턴으로만 검사한다면 `eval "git push ..."` 같은 형태로 그대로 뚫린다. hook 스크립트가 그런 래핑을 걸러내는지 직접 확인하고, 아니면 `eval`·`env -C`·`sh -c`로 시작하는 명령은 일단 차단하도록 한 줄 추가한다. CLAUDE.md §6 deploy 정책의 실효성이 여기 달려 있다.
- **난이도**: ★★☆ (약 15분)

### 4. MEMORY.md 잘림 여부 확인
- **파일**: `~/.claude/projects/-/memory/MEMORY.md`
- **근거**: 이번 버전부터 MEMORY.md 잘림 경고가 "몇 줄이 잘렸고 어디서부터인지"를 알려준다. 현재 MEMORY.md는 이미 컨텍스트에 실릴 때 중간(`[Reference: 모의주식 앱 경로](reference-m`)에서 끊긴 상태로 보인다 — 뒤쪽 메모리들이 매 세션 로드되지 않고 있다는 뜻이다. 새 세션에서 경고 메시지를 확인하고, 잘리는 지점 이후 항목을 정리하거나 오래된 프로젝트 메모리를 삭제해 인덱스를 한도 안으로 줄인다.
- **난이도**: ★★☆ (약 15~20분)
