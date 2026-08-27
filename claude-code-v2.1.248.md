# Claude Code v2.1.248

> 작성일: 2026-08-28

---

# 📋 요약본

## 🎉 신기능 (7건)
- **`--restricted` 모드** — `--restricted` 플래그 또는 `CLAUDE_CODE_RESTRICTED=1` 로 위험한 도구를 통째로 차단한다.
  - 명령·코드 실행 도구와 `WebFetch` 를 제거한다 (`--tools` 로 명시한 것만 예외).
  - 파일 도구는 작업 디렉터리 안으로 제한하고, `bypassPermissions` 를 거부한다.
  - user·project·local 설정 파일을 전부 무시한다.
- **에이전트별 프롬프트 캐시 TTL** — 에이전트 frontmatter 에 `experimental.cacheTtl` (`"5m"` 또는 `"1h"`) 을 지정한다. 서브에이전트 TTL 설정이 따로 없을 때 이 값을 쓴다.
- **self-hosted runner 라벨 지정** — `claude self-hosted-runner --client-label <label>` 또는 `SELF_HOSTED_RUNNER_CLIENT_LABEL` 로 러너 등록 라벨을 바꾼다. 기본값은 호스트명.
- **서버 관리 설정 진단** — 설정 로드 실패 시 시작 경고를 띄운다. `/doctor` 와 `/status` 에 실패 이유 또는 아예 가져오지 않은 이유(Bedrock/Vertex/서드파티 프로바이더, 커스텀 `ANTHROPIC_BASE_URL`)를 한 줄로 표시한다.
- **`/web-setup` 의 `workflow` 스코프 경고** — GitHub CLI 토큰에 `workflow` 스코프가 없으면 경고한다. 이게 없으면 아주 큰 레포 push 가 거부될 수 있다.
- **`/usage-credits`** — AWS Marketplace 청구·셀프서브 Enterprise·Enterprise 체험판 조직 구성원이 관리자에게 사용량 한도 상향을 요청한다.
- **세션 간 메시징 확대** — 같은 머신의 세션끼리 `SendMessage` / `ListAgents` 를 Bedrock·Vertex·Foundry 에서도, 텔레메트리를 끈 상태에서도 쓴다.

## 🛠️ 개선/수정 (44건)
- **한 시간에 한 번씩 나던 프롬프트 캐시 미스** — OAuth 토큰 갱신 후 도구 정의가 다시 렌더링되면서 긴 세션에서 캐시가 깨지고 extended thinking 컨텍스트가 날아가던 문제를 고쳤다.
- **`--resume` 첫 턴 캐시 전체 미스** — 계정이 usage overage 에 들어갔을 때 `ScheduleWakeup` 도구 정의가 세션과 재개 세션 사이에서 달라지던 문제를 고쳤다.
- **Desktop·Cowork 세션 30일 후 소실** — 트랜스크립트 정리가 앱 안에 있는 desktop 작성 세션을 남긴다 (조직 정책이 보관을 관리하는 경우 제외). 새 설정 `desktopSessionCleanupPeriodDays` 로 예외 기간에 상한을 건다.
- **토큰 갱신 락 충돌 시 로그인 화면 튕김** — 다른 Claude Code 프로세스가 갱신 락을 쥔 채 세션 토큰이 만료된 경우, 이제 재시도 가능한 에러로 실패한다.
- **Windows `claude agents` 키보드 무응답** — 세션에서 detach 한 뒤, 또는 win32-input-mode 로 남은 터미널 탭에서 목록이 키 입력을 받지 못하던 문제를 고쳤다.
- **`/login` Console 로그인 OAuth 실패** — `ANTHROPIC_API_KEY` 나 API key helper 가 설정돼 Console 로그인을 쓸 수 없는 환경에서 URL 도 못 보여주고 실패하던 문제. 이제 API 키 로그인으로 폴백한다.
- **`/model` 모델명 렌더링** — 모델명과 fast-mode 전환 안내를 코드로 표시해 `[1m]` 같은 접미사가 링크가 아니라 그대로 보인다.
- **`CI` 환경변수 시 워크스페이스 신뢰 프롬프트 건너뜀** — `claude agents` 가 프롬프트를 생략하던 문제를 고쳤다.
- **PR 상태 캐시 손상 시 `claude agents` 크래시** — 잘못된 엔트리로 실행 시 죽던 문제를 고쳤다.
- **몇 주 된 백그라운드 세션 되살아남** — 머신을 꺼둔 뒤 agent view 가 오래된 세션을 살리던 문제. 이제 실제 종료 시점에 stopped 로 표시하고, 열 때 저장된 대화를 재개할지 먼저 묻는다.
- **새 세션 시작 시 옛 대화 열림·입력 유실** — agent view 가 가끔 이전 대화를 열고 입력한 프롬프트를 버리던 문제를 고쳤다.
- **중복 프로세스 실행** — `claude agents` 에서 다른 터미널로 이미 재개한 stopped 세션을 열어도 같은 대화에 두 번째 프로세스가 뜨지 않는다. 해당 행이 "터미널에서 열려 있음" 으로 표시된다.
- **병합된 브랜치 삭제 거부** — worktree 브랜치가 체크아웃한 기본 브랜치(예: 로컬 `main`)에 이미 병합됐지만 push 는 안 된 경우, `claude agents` 와 `claude rm` 이 "push 안 된 커밋이 있다" 며 삭제를 거부하던 문제를 고쳤다.
- **훅 응답 오류 시 조용한 대기** — `PermissionRequest` 나 `PreToolUse` 훅이 잘못된 답을 출력했을 때 백그라운드 세션이 말없이 멈추던 문제. 이제 `claude agents` 행에 훅 이름과 스키마 오류가 뜬다.
- **훅 stdout JSON 파싱 실패 무시** — `{…}` 모양이지만 유효한 JSON 이 아닌 출력을 평문으로 취급하던 문제. 이제 파싱 메시지와 함께 훅 에러로 보고한다.
- **`/mcp` 스코프 오표시** — 프로젝트 `.mcp.json` 의 claude.ai 커넥터 타입 항목을 신뢰된 "claude.ai" 헤딩 아래 나열하던 문제. 이제 실제 스코프 아래에 표시된다.
- **`headersHelper` 401 처리** — `Authorization` 헤더를 공급하는 MCP 서버가 401 에서 헬퍼를 다시 실행해 재시도하지 않고 OAuth 디스커버리로 빠지던 문제를 고쳤다.
- **Claude apps 게이트웨이 `/login` 멈춤** — 관리 설정 보안 승인 다이얼로그가 필요할 때 멈추던 문제를 고쳤다.
- **게이트웨이 모델 디스커버리 미동작** — `apiKeyHelper` 가 유일한 자격 증명일 때 `CLAUDE_CODE_ENABLE_GATEWAY_MODEL_DISCOVERY` 가 아예 실행되지 않던 문제를 고쳤다.
- **`claude logs` 터미널 오염** — 마우스 트래킹·bracketed paste·대체 화면을 켠 채 종료하던 문제를 고쳤다.
- **신뢰 다이얼로그 깨진 문자** — 긴 규칙이 이모지 중간에서 잘릴 때 나던 깨짐을 고쳤다.
- **권한 모드 표시 가려짐** — ctrl+c 직후 shift+tab 을 누르면 "Ctrl-C 다시 눌러 종료" 힌트 뒤에 숨던 문제를 고쳤다.
- **`/ultrareview`·클라우드 세션의 민감 파일 업로드** — 커밋되지 않은 `prod.env` 류·`*.tfvars`, 그리고 자격 증명 파일의 편집기 swap·임시·백업 사본(`key.pem.tmp`, `id_rsa.swo` 등)을 올리던 문제. 이제 로컬에 남는다.
- **Remote Control 재연결 후 무반응** — CLI 가 조용히 재연결한 뒤 연결된 기기에서 권한 프롬프트나 최신 메시지가 안 뜨던 문제를 고쳤다.
- **클라우드 세션 시작 실패** — 컨테이너의 세션 자격 증명을 아직 읽을 수 없을 때 간헐적으로 실패하던 문제를 고쳤다.
- **`claude remote-control` 플래그 거부** — 전역 플래그나 래퍼가 끼워 넣은 옵션이 서브커맨드 앞에 올 때 `--spawn`·`--name` 등 자기 플래그를 거부하던 문제를 고쳤다.
- **시작 경고 정렬** — "N MCP servers need authentication" 같은 경고가 트랜스크립트보다 한 칸 오른쪽에 렌더링되던 문제를 고쳤다.
- **백그라운드 worktree 세션의 체크아웃 유실** — 이제 백그라운드 세션이 실행 중 worktree 락을 잡아 cleanup 과 `git worktree remove` 가 건드리지 않는다.
- **비라틴 문자 @-멘션** — 한국어를 IME 로 입력한 이름 등이 다른 세션 @-멘션에서 매칭되지 않던 문제를 고쳤다.
- **잘못된 `crossSessionInbound` 값 무시** — 이제 경고하고, 고칠 때까지 세션 간 메시지를 보류(user settings)하거나 거부(managed settings)한다.
- **없는 명령 안내** — 조직에서 `/usage-credits` 를 쓸 수 없는데(예: `DISABLE_EXTRA_USAGE_COMMAND` 로 숨김) 실행하라고 안내하던 rate-limit·usage·fast-mode 메시지를 고쳤다.
- **[VSCode] "No conversation found" 고착** — 저장된 적 없는 세션의 채팅 탭이 멈추던 문제. 이제 새 대화를 시작한다.
- **Workflow 도구 프롬프트 경량화** — 도구 설명이 5.7k 에서 약 1k 토큰으로 줄었다. 스크립트 작성 레퍼런스는 번들 스킬 `workflow-authoring` 으로 옮겼다.
- **PR 배지 갱신 최적화** — 프롬프트 푸터의 PR 배지가 PR 이 그대로면 GitHub 을 덜 확인한다. push 나 `gh pr` 명령은 즉시 갱신한다.
- **관리 설정 승인 프롬프트 축소** — 클라이언트 타임아웃·MCP 시작 모드·stream watchdog 환경변수는 더 이상 설정 승인 프롬프트를 띄우지 않는다.
- **`/ultrareview <PR#>` 사전 확인** — 클라우드 세션이 뜬 뒤 실패하는 대신, 실행 전에 Claude 계정에 연결된 GitHub 계정이 그 레포에 접근 가능한지 확인하고 해결 방법을 안내한다.
- **세션 간 메시징 디렉터리 폴백** — 기본 디렉터리를 못 쓰면 사용자 전용 `/tmp` 디렉터리로 폴백한다. 안내와 `/status` 가 고쳐야 할 디렉터리 이름을 알려준다.
- **agent view 입력 키 변경** — dispatch 입력에서 shift+enter 는 줄바꿈(프롬프트와 동일), ctrl+enter 는 dispatch 후 attach.
- **`/loop` 상시 제공** — 자율 페이싱 dynamic 모드와 프롬프트 없는 autonomous 기본값을 Bedrock/Vertex/Foundry 에서도 항상 쓸 수 있다.
- **텔레메트리 로그 태그 변경** — Anthropic 텔레메트리 전송 실패를 `[3P telemetry] OTEL diag error` 가 아니라 debug 레벨 `[Anthropic telemetry]` 로 기록한다. 내 OTel 컬렉터 장애로 오해하지 않게 하려는 것.
- **Linux user namespace 신뢰 범위 축소** — 세션 간 메시징에서 매핑되지 않은 소유자에 대한 root 동등 신뢰를 표준 시스템 디렉터리로 제한한다.
- **서브에이전트 `SendMessage` 안내** — 서브에이전트가 다른 세션에 메시지를 보내면, 답장이 서브에이전트가 아니라 부모 세션 대화로 전달된다는 점을 결과에 명시한다.

## 🔑 이번 버전의 핵심 키워드
**"캐시를 지키고, 비밀을 막고, 세션을 잃지 않는다"** — 시간당 한 번 터지던 프롬프트 캐시 미스와 `--restricted` 샌드박스, 민감 파일 업로드 차단, 세션 소실·중복 실행 정리가 축이다.

---

# 📜 원문 (한글 번역본)

> 원문 ChangeLog를 원래 순서 그대로 한 줄도 빠짐없이 번역한 문서입니다.

- `--restricted` (또는 `CLAUDE_CODE_RESTRICTED=1`) 추가: 명령이나 코드를 실행하는 내장 도구와 `WebFetch` 를 제거하고(`--tools` 에 명시된 것은 유지), 파일 도구는 작업 디렉터리 안으로 제한하며, `bypassPermissions` 를 거부하고, user·project·local 설정 파일을 무시한다
- 에이전트 frontmatter 에 `experimental.cacheTtl` (`"5m"` 또는 `"1h"`) 추가: 서브에이전트 TTL 설정이 구성돼 있지 않을 때 사용하는 에이전트별 프롬프트 캐시 TTL
- `claude self-hosted-runner --client-label <label>` (또는 `SELF_HOSTED_RUNNER_CLIENT_LABEL`) 추가: 러너가 등록하는 라벨을 재정의한다 (기본값: 호스트명)
- 서버 관리 설정 진단 추가: 설정 로드 실패 시 시작 경고, 그리고 로드 실패 이유나 애초에 가져오지 않은 이유(Bedrock/Vertex/서드파티 프로바이더, 커스텀 `ANTHROPIC_BASE_URL`)를 설명하는 `/doctor`·`/status` 한 줄
- `/web-setup` 에 GitHub CLI 토큰이 `workflow` 스코프를 갖지 않을 때의 경고 추가 — 이 스코프가 없으면 아주 큰 레포로의 push 가 거부될 수 있다
- AWS Marketplace 를 통해 청구되는 Enterprise 조직, 셀프서브 Enterprise, Enterprise 체험판을 위한 `/usage-credits` 추가 — 구성원이 관리자에게 사용량 한도 상향을 요청할 수 있다
- 같은 머신의 세션 간 메시징(`SendMessage` / `ListAgents`)을 Bedrock·Vertex·Foundry 에서, 그리고 텔레메트리를 비활성화한 경우에도 지원하도록 추가
- 긴 세션에서 대략 한 시간에 한 번씩 발생하던 프롬프트 캐시 미스(및 extended thinking 컨텍스트 유실)를 수정 — OAuth 토큰 갱신 후 도구 정의가 다시 렌더링되는 것이 원인이었다
- 계정이 usage overage 에 들어간 경우 세션과 그 `--resume` 사이에서 `ScheduleWakeup` 도구 정의가 달라져 재개된 세션의 첫 턴에 프롬프트 캐시가 전부 미스 나던 문제 수정
- Claude Desktop 및 Cowork 세션이 30일 후 사라지던 문제 수정: 이제 트랜스크립트 정리가 desktop 에서 작성된 세션을 앱에 있는 동안 유지한다(조직 정책이 보관을 관리하는 경우 제외). 새 설정 `desktopSessionCleanupPeriodDays` 로 이 예외에 상한을 건다
- 다른 Claude Code 프로세스가 토큰 갱신 락을 쥐고 있는 동안 세션 토큰이 만료돼 로그인 화면으로 보내지던 문제 수정 — 이제 재시도 가능한 에러로 요청이 실패한다
- Windows: 세션에서 detach 한 뒤, 또는 win32-input-mode 로 남겨진 터미널에서 실행했을 때 `claude agents` 목록이 키보드에 반응하지 않던 문제 수정
- 사용할 수 없는 머신에서(예: `ANTHROPIC_API_KEY` 나 API key helper 가 설정된 경우) `/login` 의 권장 Console 로그인이 로그인 URL 도 보여주지 못한 채 OAuth 에러로 실패하던 문제 수정 — 이제 API 키 로그인으로 폴백한다
- `/model` 과 fast-mode 전환 안내의 모델명을 코드로 렌더링하도록 수정 — `[1m]` 같은 접미사가 링크가 아니라 문자 그대로 표시된다
- `CI` 환경변수가 설정돼 있을 때 `claude agents` 가 워크스페이스 신뢰 프롬프트를 건너뛰던 문제 수정
- PR 상태 캐시에 잘못된 엔트리가 있을 때 `claude agents` 가 실행 중 크래시하던 문제 수정
- 머신이 꺼져 있던 뒤 agent view 가 몇 주 된 백그라운드 세션을 되살리던 문제 수정: 이제 그런 세션은 실제 종료 시점에 stopped 로 표시되고, 열면 저장된 대화를 재개할지 먼저 묻는다
- 새 세션을 시작할 때 agent view 가 가끔 더 오래된 대화를 열고, 입력한 프롬프트를 버리던 문제 수정
- `claude agents` 수정: 다른 터미널에서 이미 재개한 stopped 세션을 열어도 그 대화에 두 번째 프로세스가 시작되지 않는다. 해당 행에 터미널에서 열려 있다고 표시된다
- worktree 브랜치가 체크아웃한 기본 브랜치(예: 로컬 `main`)에 이미 병합됐지만 아직 push 되지 않은 경우 `claude agents` 와 `claude rm` 이 세션 삭제를 거부하던("push 되지 않은 커밋이 있다") 문제 수정
- `PermissionRequest` 나 `PreToolUse` 훅이 유효하지 않은 답을 출력했을 때 백그라운드 세션이 조용히 대기하던 문제 수정: 이제 `claude agents` 행이 훅 이름과 스키마 오류를 알려준다
- 훅이 유효한 JSON 이 아닌 stdout `{…}` 객체를 조용히 평문으로 취급하던 문제 수정 — 이제 파싱 메시지와 함께 훅 에러로 보고된다
- `/mcp` 가 claude.ai 커넥터 타입을 선언한 프로젝트 `.mcp.json` 항목을 신뢰된 "claude.ai" 헤딩 아래 나열하던 문제 수정 — 이제 실제 스코프 아래에 나타난다
- `headersHelper` 가 `Authorization` 헤더를 공급하는 MCP 서버가 401 응답에서, 문서대로 헬퍼를 다시 실행해 호출을 재시도하는 대신 OAuth 디스커버리로 빠지던 문제 수정
- 관리 설정 보안 승인 다이얼로그가 필요할 때 Claude apps 게이트웨이로의 `/login` 이 멈추던 문제 수정
- `apiKeyHelper` 가 유일한 자격 증명일 때 게이트웨이 모델 디스커버리(`CLAUDE_CODE_ENABLE_GATEWAY_MODEL_DISCOVERY`)가 전혀 실행되지 않던 문제 수정
- `claude logs` 가 실행된 터미널에 마우스 트래킹·bracketed paste·대체 화면을 켜진 채로 남기던 문제 수정
- 긴 규칙이 이모지 중간에서 잘렸을 때 신뢰 다이얼로그의 레포 권한 규칙 목록에 깨진 문자가 표시되던 문제 수정
- ctrl+c 직후 shift+tab 을 누르면 권한 모드 표시가 "Press Ctrl-C again to exit" 힌트 뒤에 숨어 있던 문제 수정
- `/ultrareview` 와 로컬에서 시드된 클라우드 세션이 커밋되지 않은 `prod.env` 류·`*.tfvars` 파일, 또는 자격 증명 파일의 편집기 swap·임시·백업 사본(예: `key.pem.tmp`, `id_rsa.swo`)을 업로드하던 문제 수정 — 이제 머신에 남는다
- CLI 가 조용히 재연결한 뒤 Remote Control 세션이 연결된 기기에서 권한 프롬프트나 최신 메시지를 전혀 보여주지 않던 문제 수정
- 컨테이너의 세션 자격 증명을 아직 읽을 수 없을 때 클라우드 세션이 시작에 간헐적으로 실패하던 문제 수정
- 전역 플래그나 래퍼가 주입한 옵션이 서브커맨드보다 앞에 올 때 `claude remote-control` 이 자신의 플래그(예: `--spawn`, `--name`)를 거부하던 문제 수정
- 시작 경고(예: "N MCP servers need authentication")가 나머지 트랜스크립트보다 한 칸 오른쪽에 렌더링되던 문제 수정
- 백그라운드로 돌린 worktree 세션이 체크아웃을 잃던 문제 수정: 이제 백그라운드 세션이 실행되는 동안 worktree 의 락을 쥐고 있어 cleanup 과 `git worktree remove` 가 건드리지 않는다
- 비라틴 문자로 입력한 이름(예: IME 로 입력한 한국어)이 다른 세션 @-멘션에서 매칭되지 않던 문제 수정
- 유효하지 않은 `crossSessionInbound` 값이 조용히 무시되던 문제 수정: 이제 경고하고, 고쳐질 때까지 세션 간 메시지를 보류(user settings)하거나 거부(managed settings)한다
- 조직에서 사용할 수 없는 명령인데도(예: `DISABLE_EXTRA_USAGE_COMMAND` 로 숨겨진 경우) rate-limit·usage·fast-mode 메시지가 `/usage-credits` 실행을 안내하던 문제 수정
- [VSCode] 세션이 저장된 적이 없을 때 채팅 탭이 "No conversation found" 에서 멈추던 문제 수정 — 이제 새 대화를 시작한다
- Workflow 도구의 프롬프트 사용량 개선: 도구 설명이 5.7k 에서 약 1k 토큰으로 줄었고, 스크립트 작성 레퍼런스는 번들된 `workflow-authoring` 스킬로 옮겼다
- 프롬프트 푸터의 PR 배지 개선: pull request 가 변경되지 않은 동안 GitHub 을 덜 자주 확인한다. push 나 `gh pr` 명령은 여전히 즉시 갱신한다
- 관리 설정 개선: 클라이언트 측 타임아웃, MCP 시작 모드, stream watchdog 환경변수는 더 이상 설정 승인 프롬프트를 띄우지 않는다
- `/ultrareview <PR#>` 개선: 클라우드 세션이 시작된 뒤 실패하는 대신, 실행 전에 Claude 계정에 연결된 GitHub 계정이 해당 레포에 접근할 수 있는지 확인하고 해결 방법을 설명한다
- 세션 간 메시징 개선: 기본 디렉터리를 사용할 수 없으면 사용자 전용 비공개 `/tmp` 디렉터리로 폴백하며, 안내와 `/status` 가 고쳐야 할 디렉터리를 알려준다
- agent view dispatch 입력에서 shift+enter 를 줄바꿈 삽입으로 변경(프롬프트와 동일). ctrl+enter 가 dispatch 후 attach 한다
- `/loop` 변경: 자율 페이싱 dynamic 모드와 프롬프트 없는 autonomous 기본값을 Bedrock/Vertex/Foundry 를 포함해 항상 사용할 수 있다
- Anthropic 텔레메트리 전송 실패를 `[3P telemetry] OTEL diag error` 대신 debug 레벨 `[Anthropic telemetry]` 로 기록하도록 변경 — 사용자의 OTel 컬렉터 장애로 오인되지 않게 하려는 것
- Linux user namespace 에서의 세션 간 메시징 변경: 매핑되지 않은 소유자에 대한 root 동등 신뢰를 표준 시스템 디렉터리로 제한한다
- 서브에이전트에서 다른 세션으로의 `SendMessage` 변경: 이제 결과에 답장이 서브에이전트가 아니라 부모 세션의 대화로 전달된다는 점을 명시한다

---

## 🎯 챌린지

이번 버전에서 내 환경에 적용해볼 만한 항목입니다.

### 1. 서브에이전트 `experimental.cacheTtl` 지정
- **파일**: `~/.claude/agents/*.md`
- **근거**: 이번 버전에 에이전트 frontmatter 의 `experimental.cacheTtl` (`"5m"` / `"1h"`) 이 추가됐다. CLAUDE.md §5·§7.2 대로 subagent 병렬 dispatch 를 자주 돌리는 환경이므로, 재사용이 잦은 에이전트에 `"1h"` 를 걸면 fan-out 마다 시스템 프롬프트를 다시 태우지 않는다. 에이전트 파일이 없으면 자주 쓰는 역할 하나를 만들어 붙인다.
- **난이도**: ★☆☆ (약 10분)

### 2. 훅 stdout 을 JSON 오류 없이 정리
- **파일**: `~/.claude/hooks/deploy-guard.sh`
- **근거**: 이번 버전부터 훅이 `{…}` 모양인데 유효한 JSON 이 아닌 stdout 을 내면 조용히 평문 처리하지 않고 훅 에러로 보고한다. `deploy-guard.sh` 가 차단 사유를 출력할 때 중괄호가 섞이면 이제 에러로 뜬다. 출력이 순수 텍스트인지, 아니면 정식 JSON 인지 한 번 확인하고 맞춘다.
- **난이도**: ★☆☆ (약 10분)

### 3. `--restricted` 로 읽기 전용 점검 세션 만들기
- **파일**: `~/.zshrc` (alias 추가)
- **근거**: `--restricted` 는 실행 계열 도구와 `WebFetch` 를 빼고 파일 접근을 작업 디렉터리로 묶는다. 로그·코드만 읽는 점검 작업에서 실수로 명령이 나가는 걸 원천 차단한다. `alias cread='claude --restricted'` 한 줄이면 끝난다. 단 이 모드는 user·project·local 설정을 전부 무시하므로 `deploy-guard.sh` 훅과 statusLine 도 함께 꺼진다는 점을 알고 쓴다.
- **난이도**: ★☆☆ (약 5분)

### 4. `workflow-authoring` 스킬로 옮겨간 레퍼런스 확인
- **파일**: `~/.claude/settings.json` (`skillListingBudgetFraction`)
- **근거**: Workflow 도구 설명이 5.7k → 약 1k 토큰으로 줄고 스크립트 작성 레퍼런스가 번들 스킬 `workflow-authoring` 으로 빠졌다. 현재 `skillListingBudgetFraction` 이 `0.08` 로 조여 있어 스킬 목록에 새 번들 스킬이 노출되는지 확인이 필요하다. `/context` 로 스킬 목록에 `workflow-authoring` 이 뜨는지 보고, 안 뜨면 값을 소폭 올린다.
- **난이도**: ★★☆ (약 15분)
