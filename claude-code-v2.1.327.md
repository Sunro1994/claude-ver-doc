# Claude Code v2.1.327

> 작성일: 2026-11-19

---

# 📋 요약본

## 🎉 신기능 (9건)
- **`/install-github-app` 변경 전 확인** — 저장소를 바꾸기 전에 확인 단계를 거친다.
- **`claude mcp add-json <name> -`** — 서버 JSON을 stdin으로 받는다. 토큰을 명령줄에 남기지 않는다. Claude Code 세션 안에서는 쓸 수 없다.
- **재개 세션 로드 실패 안내** — 재개한 세션의 이전 메시지를 불러오지 못하면 그 사실을 한 줄로 알린다.
- **`/status` 진단 목록** — 깨진 agent·skill·command·output style 파일, keybinding 오류, 쓸 수 없는 sandbox, 무시된 권한 설정, 절대 매칭되지 않는 hook matcher를 보여준다.
- **`/config` 덮어쓰기 표시** — 다른 설정이 해당 항목을 덮어쓰면 메모를 띄운다.
- **`x-claude-code-managed-settings-checksum` 헤더** — managed settings가 `CLAUDE_CODE_GATEWAY_HINT_HEADERS=1`을 설정한 곳에서 gateway hint 헤더에 추가된다.
- **`attributionProject` 설정** — `admin.billing_group_tag`를 쓰는 Claude apps gateway에서 세션의 billing group 이름을 지정한다.
- **`/tui classic`** — 전체화면이 아닌 렌더러의 새 이름이다. `/tui default`도 그대로 동작한다.
- **[VSCode] "Claude Code: Add to Chat"** — Explorer 우클릭 메뉴에서 선택한 파일·폴더를 채팅에 @-mention한다.

## 🛠️ 개선/수정 (20건)
- **파일 삭제 사고 방지** — Remote Control worktree 모드 종료 시 `.env` 같은 git-ignored 파일이 지워지던 문제, `GIT_CONFIG_GLOBAL` 디렉터리 삭제 문제, `claude mcp add/remove`가 `.mcp.json`의 다른 최상위 키를 지우던 문제를 고쳤다.
- **`/export` 덮어쓰기 확인** — 기존 파일을 묻지 않고 덮어쓰지 않는다.
- **세션 재개·compaction 유실 수정** — 크래시·재시작·`/clear`·출력 한도 직후 compaction 등에서 메시지·작업·tool call이 사라지던 여러 경로를 막았다. 긴 transcript 읽기가 일찍 끝나면 한 번 재시도한다.
- **`--agents`·plugin agent 유실 수정** — plugin 로드·`--resume` 선택 후에도 agent가 유지된다.
- **subagent 모델·effort 수정** — 형제 subagent의 모델로 재개되던 문제, teammate가 lead의 context 한도로 compaction하던 문제를 고쳤다. 모델 없이 시작한 subagent는 `/model` 이후에도 원래 모델을 유지한다.
- **백그라운드 agent 알림 수정** — 종료 알림 누락, "아직 실행 중" 오보고를 고쳤다. compaction 후 출력 파일을 못 읽으면 `SendMessage`로 묻게 안내한다.
- **hook 표시 수정** — 실패한 SubagentStop·SessionEnd·CwdChanged·FileChanged hook이 아무것도 표시하지 않던 문제, 실행 실패한 Stop hook이 "문제 보고"로 보이던 문제를 고쳤다. `/hooks`가 `--settings`의 hook을 보여준다.
- **설정 저장 실패 경고** — `/config` 등에서 저장 실패 시 프롬프트 아래에 알린다. `/statusline`이 `CLAUDE_CONFIG_DIR`를 따른다.
- **원격 MCP 재연결** — VPN 끊김 같은 긴 장애 뒤에도 https hostname 서버를 약 하루 동안 백그라운드 재시도한다.
- **도구 동작 수정** — compaction 후 Edit의 "File has not been read yet" 오류, Grep의 `head_limit`/`offset` 페이징 중복·누락(이제 파일 경로순 정렬), Jupyter Read/NotebookEdit 문제, 10MB 이상 파일 크기 오보고를 고쳤다.
- **멈춤·크래시 수정** — `claude -p` 첫 요청 전 멈춤(10초 후 진행), OOM 후 빈 화면, 수천 개 `@` mention(앞 100개만 조회), 2,000자 초과 WebFetch URL 거부, 대용량 파일 쓰기 거부 후 멈춤을 고쳤다.
- **Stop 후에도 실행되던 명령 수정** — 재시작 뒤 승인이 도착하면 Stop 후에도 실행되던 문제를 고쳤다.
- **첫 Bash 명령 속도** — 승인 전에 shell 시작 파일을 먼저 실행한다. `CLAUDE_CODE_DISABLE_SHELL_HEAD_START=1`로 끈다.
- **커밋 시 secret 제외** — 최신 모델·PowerShell에서 secret이 들어 있을 법한 파일을 커밋하지 않도록 안내한다.
- **`ExitWorktree` 확인** — 저장 안 된 작업이 있을 수 있는 worktree를 지우기 전에 묻는다. don't-ask 모드나 응답자가 없으면 거부한다.
- **권한 체크 강화** — 일부 symlink를 거부하고 작업 디렉터리 판정을 바꿨다. `permissions.blockReadsOutsideWorkingDirectories`가 더 많은 Bash 명령을 묻거나 거부한다. 아주 긴 변수 확장 Bash 명령은 거부된다.
- **auto mode 정책 변경** — `Bash(pnpm dlx *)`처럼 아무 패키지나 실행하는 allow rule을 무시한다. 과금 classifier fallback은 다음 릴리스에서 사라진다고 안내한다.
- **Artifact 승인 강화** — plugin만 만든 artifact 거부 가능, 응답자 없는 세션은 즉시 거부, subagent 등에서는 "don't ask again"을 제공하지 않는다.
- **Windows·VSCode 속도 개선** — Windows 시작·PowerShell 실행이 빨라졌다. VSCode는 연속 편집 대기 공유, `rg` 기반 @-mention 검색, 즉시 준비되는 model picker를 지원한다.
- **UI 대량 수정** — 좁은 터미널 레이아웃, 권한 프롬프트 화살표가 No에서 멈춤, 번호 없는 목록, tmux/Ghostty/Windows Terminal 표시 오류, transcript 검색 개선 등을 반영했다.

## 🔑 이번 버전의 핵심 키워드
**"유실과 오삭제를 막는 안정화"** — 파일·메시지·agent가 조용히 사라지던 경로를 막고, 권한·artifact 승인을 더 엄격히 했다.

---

# 📜 원문 (한글 번역본)

> 원문 ChangeLog를 원래 순서 그대로 한 줄도 빠짐없이 번역한 문서입니다.

- `/install-github-app`이 저장소를 변경하기 전에 확인 단계를 추가했다
- 서버의 JSON을 stdin에서 읽는 `claude mcp add-json <name> -`을 추가했다. 토큰을 명령줄에 남기지 않을 수 있다. Claude Code 세션 안에서는 쓸 수 없다
- 재개한 세션의 이전 메시지를 불러올 수 없을 때 안내 한 줄을 추가했다
- `/status`에 깨진 agent·skill·command·output style 파일, keybinding 오류, 사용할 수 없는 sandbox, 무시된 권한 설정, 절대 매칭되지 않는 hook matcher 목록을 추가했다
- `/config`에서 다른 설정이 해당 항목을 덮어쓸 때 메모를 추가했다
- gateway hint 헤더에 `x-claude-code-managed-settings-checksum`을 추가했다. managed settings가 `CLAUDE_CODE_GATEWAY_HINT_HEADERS=1`을 설정한 곳에서 전송되며, 이미 설정된 곳도 포함한다
- `admin.billing_group_tag`를 설정한 Claude apps gateway에서 `attributionProject` 설정으로 세션의 billing group 이름을 지정하는 기능을 추가했다
- 전체화면이 아닌 렌더러의 이름으로 `/tui classic`을 추가했다. `/tui default`도 계속 동작한다
- Remote Control: worktree 모드에서 서버를 멈추면 실행 중인 세션의 `.env` 같은 git-ignored 파일이 삭제되던 문제를 수정했다
- `--use-anthropic-git-proxy`를 쓰는 self-hosted runner가 시작 시 `GIT_CONFIG_GLOBAL`이 가리키는 비어 있지 않은 디렉터리를 삭제하던 문제를 수정했다. 이제 runner는 디렉터리를 유지하고, 변수를 무시하며, 경고한다
- project scope의 `claude mcp add`·`claude mcp remove`가 `.mcp.json`의 `$schema`나 다른 도구의 `servers` 같은 최상위 키를 삭제하던 문제를 수정했다
- `/export`가 기존 파일을 묻지 않고 덮어쓰던 문제를 수정했다. 이제 대화상자가 묻고, `/export <name>`은 파일을 유지하며 `/export`를 실행하라고 안내한다
- feature flag가 로드되지 않은 cloud·self-hosted runner 세션에서, 재시작 후 승인이 도착하면 Stop을 눌렀는데도 허용한 명령이 실행되던 문제를 수정했다
- Enter가 `/teleport`의 로드 오류 화면을 닫던 문제를 수정했다
- `/plugin`에서 클릭 후 Enter가 plugin을 설치하거나 비활성화하던 문제를 수정했다
- 사용량 한도 메뉴 뒤에 Enter를 한 번 더 누르면 반쯤 입력한 `!` 명령이 실행되던 문제를 수정했다
- 내용에 괄호가 있는 일부 `--disallowedTools` 규칙을 수정했다
- auto mode가 `PowerShell(.\scripts\build.ps1 *)`처럼 `.\`로 스크립트를 지정한 일부 wildcard PowerShell allow 규칙을 무시하던 문제를 수정했다
- auto mode에서 Claude가 auto mode가 허용한 두 번째 스크립트를 시작하면 실행 중이던 Code Mode 스크립트가 권한 프롬프트와 거부를 받던 문제를 수정했다
- 계정 변경 후 미리 시작된 일부 백그라운드 세션을 폐기하도록 변경했다
- 터미널에서 사용량 한도로 멈춘 workflow가 로그인 후에도, 이전 로그인이 돌아오거나 프롬프트를 입력할 때까지 멈춘 상태로 남도록 변경했다
- 자체 토큰을 가진 중첩 `claude`가 `forceLoginOrgUUID`에 의해 거부되던 문제를 수정했다. 세션의 토큰을 받지 않는 명령은 더 이상 `CLAUDE_CODE_OAUTH_SCOPES`도 받지 않는다. 필요한 명령에는 직접 설정한다
- 프로세스가 강제 종료된 뒤 같은 UUID로 메시지를 다시 보냈을 때 headless 세션이 재개 시 저장된 메시지를 잃던 문제를 수정했다
- 빈 응답이나 강제 종료된 명령 뒤에 재개한 세션이, 또 한 번의 크래시나 백그라운드 전환 후 답변을 잃거나 되감은 프롬프트를 되살리던 경우를 수정했다
- 재시작 중 Stop을 누른 뒤 보낸 메시지를, 이후 Claude Code가 크래시하면 원격 세션이 잊던 문제를 수정했다
- feature flag가 로드되지 않은 cloud·self-hosted runner 세션이 나중에 재개될 때 `/clear` 이후 만든 task가 사라지고 지운 task가 돌아오던 문제를 수정했다
- 출력 토큰 한도에서 잘린 응답 직후의 compaction이 그 응답의 tool call과 결과를 잃던 문제를 수정했다
- `/config` 등에서 설정 변경 저장이 경고 없이 실패하던 문제를 수정했다. 이제 프롬프트 아래에 한 줄로 알린다
- 일부 파일을 복원할 수 없을 때 `/rewind`가 아무 말 없이 닫히던 문제를 수정했다
- 프롬프트가 `/tmp/a.txt` 같은 파일 경로로 시작하면 붙여넣은 이미지가 빠지던 문제를 수정했다
- `--agents`로 전달한 agent가 plugin 로드·재로드 후 사라지던 문제를 수정했다
- `--resume` 선택기로 세션을 재개할 때 plugin의 agent가 빠지던 문제를 수정했다
- `https_proxy`나 `HTTPS_PROXY`가 단순 `host:port`이고 입력·출력 모두 터미널이 아닐 때(데스크톱 앱, SDK, cron) Claude Code가 시작을 거부하던 문제를 수정했다
- Linux에서 시작 시 자체 재시작 중 shell로 돌아가던 문제를 수정했다. 예: Claude apps gateway 첫 로그인 후, Code Mode를 켤 때
- 모델 설정 가져오기가 proxy 등에서 멈추면 `claude -p`가 첫 요청 전에 멈추던 문제를 수정했다. 이제 10초 후 설정 없이 진행한다
- 짧은 out-of-memory 오류 후 화면이 빈 채로 또는 멈춘 채로 남던 문제를 수정했다
- 화면을 멈추거나 세션을 종료시킬 수 있던 드문 표시 오류를 수정했다
- 프로그램이 세션의 네트워크 proxy에 수천 개의 연결을 열어두면 cloud 세션이 깨지던 문제를 수정했다
- mod의 `$.model.complete`나 `$.model.classify` 호출이 사용량 한도에 걸리면 turn이 멈추던 문제를 수정했다. 이제 호출이 즉시 API 오류를 받는다. mod는 그 오류를 처리해야 한다
- 닫히지 않은 태그가 수천 개인 compaction 응답과 일부 매우 긴 WebFetch URL에서 멈추던 문제를 수정했다. 이제 WebFetch는 2,000자를 넘는 URL을 권한 프롬프트 전에 거부한다
- `@` mention이 수천 개인 메시지가 Claude 응답 전에 멈추던 문제를 수정했다. 이제 처음 100개 mention만 파일로 조회한다
- 매우 큰 파일 쓰기를 거부한 뒤 프롬프트가 멈추던 문제를 수정했다. 거부된 쓰기는 이제 짧은 미리보기를 보여준다
- `/plugin` 검색창에 키 입력이 몰려 들어올 때의 크래시를 수정했다
- Linux 보안 정책이 프로세스의 자기 자신 signal 전송을 막는 환경에서, 일시 중지된 세션 재개 시나 종료 시 잘못된 크래시 보고와 exit code가 나던 문제를 수정했다
- VPN 끊김 같은 긴 장애 후 원격 MCP 서버가 계속 연결 해제 상태로 남던 문제를 수정했다. 이제 https hostname으로 연결하는 다른 머신의 서버 대부분을 약 하루 동안 백그라운드에서 재시도한다
- Claude가 이미 전체를 읽은 프로젝트 밖의 변경 없는 파일에 대해 compaction 후 Edit이 "File has not been read yet"으로 거부하던 문제를 수정했다
- `head_limit`·`offset`으로 페이징할 때 Grep이 결과를 반복하거나 건너뛰던 문제를 수정했다. content·count 결과는 이제 파일 경로순으로 정렬된다
- 알 수 없는 타입의 출력이 있는 Jupyter notebook에서 Read가 실패하던 문제를 수정했다
- NotebookEdit이 notebook 파일의 마지막 개행을 지우던 문제를 수정했다
- 10MB 이상 파일이 한 번에 읽기엔 너무 클 때 Read 도구가 실제 크기 대신 512KB로 보고하던 문제를 수정했다
- Bash 도구의 변경 파일 diff가 바이너리이거나 너무 크거나 너무 많아 보여줄 수 없는 파일의 이름을 표시하지 않던 문제를 수정했다
- 동기화·원격 기반 폴더가 파일의 timestamp만 바꿨을 때 artifact publish가 "the source file changed between approval and publish"로 실패하던 문제를 수정했다
- 새 artifact마다 승인을 요구하는 조직에서, 승인한 새 artifact가 cloud 예약 작업 세션에서 거부되던 문제를 수정했다
- 새 artifact마다 승인을 요구하는 조직에서, Agent SDK 기반 앱이 승인한 새 artifact가 거부되던 문제를 수정했다
- 목록 추가 요청이 실패하면 `/artifacts`가 일부만 보여주거나 "No artifacts yet"을 표시하던 문제를 수정했다. 이제 재시도하고, 전체 목록을 불러오지 못하면 경고한다
- lead와 다른 모델을 쓰는 in-process agent teammate가 lead의 context 한도에서 잘못된 모델로 compaction하던 문제를 수정했다. 이제 자기 한도와 모델, 그 모델의 요금으로 처리한다
- 끝난 subagent가 자신에게 메시지를 보낸 형제 subagent의 모델과 effort로 재개되던 문제를 수정했다
- auto mode 밖에서, 백그라운드 agent를 시작한 subagent가 결과를 읽지 않고 스스로 끝나면 메인 대화가 그 백그라운드 agent의 종료를 통보받지 못하던 문제를 수정했다
- 데스크톱 앱, 웹, SDK에서 권한 프롬프트를 30초 이상 기다린 백그라운드 agent를 Claude가 아직 실행 중이라고 보고하던 문제를 수정했다
- auto mode에서 후속 메시지에 대한 백그라운드 agent의 응답이 누락돼도 Claude가 통보받지 못하던 문제를 수정했다. 백그라운드 명령을 기다리는 agent의 반복 wake-up도 줄였다
- 백그라운드 task가 subagent를 깨운 뒤 데스크톱 앱, 웹의 Claude Code, VS Code가 원시 task notification을 subagent의 프롬프트로 표시하던 문제를 수정했다
- Remote Control·Claude Desktop 세션에서 다른 세션이 "later" 우선순위로 보낸 메시지가 turn 종료를 기다리지 않고 실행 중인 turn에 합류하던 문제를 수정했다
- cloud·Remote Control 세션으로 보낸 메시지가 timeout이나 rate limit 후 오래된 주소로 실패 처리되던 문제를 수정했다. 이제 메시지가 도착했을 수 있다고 알린다
- Claude 작업 중 보낸 메시지를 `UserPromptSubmit` hook이 막을 때 cloud 세션이 오류를 표시하지 않던 문제를 수정했다
- 실패한 hook이 아무것도 표시하지 않던 문제를 수정했다: 백그라운드 agent의 SubagentStop, `/clear`·`/resume` 시의 SessionEnd, 전체화면의 CwdChanged·FileChanged
- 실행에 실패한 Stop hook이 문제를 보고한 것으로 표시되던 문제를 수정했다
- Stop hook 실행 중 focus view가 끝난 응답을 숨겨두던 문제를 수정했다
- mod가 tool call에 context를 추가할 때 긴 managed PostToolUse hook 출력을 Claude가 두 번 받던 문제를 수정했다
- 프로젝트의 `.claude/settings.json`이 `ANTHROPIC_BASE_URL`을 LLM gateway로 설정한 일부 터미널 세션에서 `/model`이 잘못된 모델을 나열하던 문제를 수정했다
- `CLAUDE_CONFIG_DIR`가 다른 폴더를 가리킬 때 `/statusline`이 `~/.claude/settings.json`에 쓰던 문제를 수정했다
- Windows에서 드라이브 문자의 대소문자가 다른 경로에 `claudeMdExcludes` 패턴이 매칭되지 않던 문제를 수정했다
- worktree 최상위에 `HEAD`라는 파일·폴더가 있으면 `claude agents`·`claude rm`이 완전히 push된 세션 제거를 거부하던("The worktree has unpushed commits") 문제를 수정했다
- cloud·Remote Control 세션이 많은 계정에서 긴 ListAgents 결과가 대부분의 세션을 숨기던 문제를 수정했다. 긴 목록은 이제 페이지로 나뉜다
- connector tool 권한이 수만 개인 조직에서 재개 세션의 turn이 느리던 문제를 수정했다
- Self-hosted runner: 세션의 스크립트나 hook이 시작한 `claude -p`가 세션의 retry 설정을 상속해 rate limit을 기다리던 문제를 수정했다
- 서버가 거부했는데도 spend limit 메뉴가 한도 변경을 보고하던 문제를 수정했다
- `/tasks`의 task 상세에서 `x`를 두 번 누르면 다음 task까지 멈추던 문제를 수정했다
- 방금 나타난 권한 프롬프트에서 Esc가 무시되던 문제를 수정했다
- 행을 늦게 불러오는 목록이 Enter와 화살표 키를 무시하던 문제를 수정했다
- cloud 세션을 멈추는 동안 Esc 후에도 `/autofix-pr`가 키보드를 잡고 있던 문제를 수정했다. 대화상자는 즉시 닫히고, 멈춤 실패는 나중에 링크와 함께 보고된다
- ←로 agents view를 연 직후 ctrl+c로 종료하면 shell에 빈 화면과 마우스 코드가 남던 문제를 수정했다
- trust 질문 직후 Ctrl+C를 누르면 터미널이 전체화면으로 남던 문제를 수정했다
- 전체화면 모드에서 ←로 agents view를 열 때 shell이 화면에 번쩍이던 문제를 수정했다
- 터미널 표시 오류를 수정했다: Ghostty 크기 변경 시 대부분의 scrollback 깨짐, 구형 tmux 아래 Windows Terminal과 VTE 0.50.0에서 링크 주소 숨김, 16색에서 선택 강조 없음
- kitty·Ghostty·iTerm2 안에서 tmux `allow-passthrough`가 켜졌을 때 일부 행이 깨지던 문제를 수정했다
- 세션 중 서버를 추가했거나 거절한 뒤 `/mcp`가 설정된 서버가 없다고 표시하던 문제를 수정했다. 이제 무엇을 할지 안내한다
- `/hooks`가 `--settings`로 지정한 hook을 빠뜨리던 문제를 수정했다
- `/` 메뉴가 같은 이름의 skill마다 행을 하나씩 나열했지만 모두 첫 번째를 실행하던 문제를 수정했다
- 선택한 세션 재개에 실패했을 때 `/teleport`가 메시지를 표시하지 않던 문제를 수정했다
- transcript 검색에서 n·N이 일치 항목을 건너뛰던 문제를 수정했다
- 긴 세션에서 transcript 검색(ctrl+o 후 /)을 취소하면 검색 시작 지점과 먼 곳으로 이동하던 문제를 수정했다
- 짧거나 빈 행을 지날 때 위·아래 키가 커서 열 위치를 잃던 문제를 수정했다
- shell 모드에서 `&&`·`;`·`|` 뒤의 명령 자리에 Tab이 파일 이름을 채우던 문제를 수정했다
- 브랜치 이름이나 폴더 경로가 길 때 `claude --resume`·`/resume`에서 선택된 세션이 화면 밖으로 나가던 문제를 수정했다
- `/mcp`·`/plugin`의 MCP tool 목록에서 tool에서 돌아올 때 위치를 잃던 문제를 수정했다
- `/resume`가 창 공간보다 세션을 하나 적게 나열하던 문제와, 재전송해도 소용없는 대부분의 spend cap 뒤에 'Resend your message' 힌트가 뜨던 문제를 수정했다
- MCP 서버의 긴 질문이 한 행 뒤에 잘리던 문제, 텍스트 필드가 긴 붙여넣기를 표시 없이 숨기던 문제, `/plugin` 옵션과 `/login`의 Bedrock·Vertex 단계에서 구분선이 두 번 나오던 문제를 수정했다
- 링크나 색상이 있는 명령 출력에서 "+N lines" 수가 너무 크던 문제와, 짧은 창에서 transcript의 `?` 도움말이 종료 방법을 숨기던 문제를 수정했다
- 브라우저 목록에서 Ctrl+C 두 번으로 `/chrome`이 닫히지 않던 문제를 수정했다
- screen reader 모드에서 agent의 plan 승인 시 숫자와 Enter를 너무 일찍 입력하면 다음 숫자까지 누락되던 문제를 수정했다
- deck이나 design을 시작할 때 Claude가 존재하지 않는 design system token 파일을 읽으려던 문제를 수정했다
- 종료 시 worktree를 유지했다고 알리지 않던 문제를 수정했다
- `/hooks` 도움말이 존재하지 않는 입력 필드를 언급하던 문제를 수정했다
- 외부 편집기 키를 다시 지정한 뒤에도 질문 대화상자가 ctrl+g를 안내하던 문제를 수정했다
- `forceLoginMethod`가 `console`로 설정된 컴퓨터에서 두 로그인 오류 메시지가 Claude 구독 옵션을 안내하던 문제를 수정했다
- 테마 변경 후 `/config`가 "Set theme to …" 대신 대화상자가 닫혔다고 표시하던 문제를 수정했다
- 버그 수정 및 안정성 개선
- 세션 첫 Bash 명령의 속도를 개선했다: 명령 승인 전에, 거부되더라도 shell 시작 파일이 먼저 실행될 수 있다. `CLAUDE_CODE_DISABLE_SHELL_HEAD_START=1`로 끈다
- 최신 모델과 PowerShell에서의 커밋을 개선했다: secret이 들어 있을 법한 파일은 커밋하지 말라고 Claude에게 안내한다
- sandbox 내 shell 명령을 개선했다: sandbox 예외 명령이 권한 체크가 sandbox에 의존해 sandbox 안에 남았을 때 Claude가 이를 알 수 있다
- 위험 `rm` 체크가 해석하지 못하는 `rm` 없는 shell 명령의 거부 메시지를 개선했다. Claude가 포기하지 않고 무해한 명령을 단순 문법으로 다시 보낼 수 있다
- 매우 긴 세션 재개를 개선했다: 일찍 끝난 transcript 읽기를 한 번 재시도해 메시지 유실이 줄었다
- 출력 토큰 한도에 두 번 걸린 subagent 응답을 개선했다: 더 자주 전체가 돌아오거나, 일부임을 먼저 밝힌다
- 인식되지 않는 모델의 긴 응답을 개선했다: 32,000 출력 토큰에서 잘린 응답이 128,000 한도로 이어진다
- compaction 후 완료된 subagent 알림을 개선했다: agent의 출력 파일을 읽을 수 없으면 `SendMessage`로 agent에게 물으라고 안내한다
- API key와 Anthropic profile이 둘 다 설정됐을 때의 경고를 개선했다: 어느 쪽을 쓰는지와 profile로 전환하는 방법을 알려준다
- `/plugin`을 개선했다: marketplace 제거 전 질문이 그 plugin들의 설정과 저장 데이터가 삭제된다고 알리고, marketplace 페이지에 다른 marketplace의 오류가 더 이상 표시되지 않는다
- Windows: Git Bash와 `pwsh`가 PATH에 없을 때 PowerShell 표준 설치 위치를 한 번에 확인해 시작 시간을 개선했다. 이제 System32의 `powershell.exe`가 PATH에서 앞선 것보다 우선한다
- PATH가 Git for Windows의 bin 폴더를 가리킬 때 launcher 대신 git.exe를 직접 실행해 Windows 시작 시간을 개선했다
- Windows: PowerShell 도구 속도를 명령당 최대 약 0.5초 개선했다
- auto·bypass permissions 모드에서 Bash 도구의 변경 파일 diff가 준비되는 시간을 개선했다
- macOS·Linux에서 매우 깊게 중첩된 없는 경로에 대한 Bash 권한 체크 속도와, URL이 있는 매우 긴 텍스트의 secret masking 속도를 개선했다
- transcript 검색이 편집 내용과 작성한 파일의 텍스트도 찾도록 개선했다
- 큰 PNG 이미지 읽기 속도와 대신 보내는 JPEG의 품질을 개선했다
- Artifact 도구가 artifact 페이지에 표시된 주소로 업로드 파일을 읽도록 개선했다. 다른 형식은 여전히 실패하며, 대부분 업로드는 호출당 하나씩 id로 읽으라는 메시지를 표시한다
- Artifact 도구가 일부 호출에서 쓰지 않는 `prompt`·`limit`·`label`을 실패시키지 않고 무시하도록 개선했다
- `/mcp`의 MCP 서버 페이지를 개선했다: local·remote·agent 서버가 한 레이아웃을 공유하고, 메뉴는 Back으로 끝나며, screen reader 모드 밖에서는 항목에 번호를 붙이지 않는다. 화살표 키와 Enter를 쓴다
- 좁은 터미널을 개선했다: `/status`·폼·상세 화면 배치가 나아졌고, `/model`·`/effort`가 약 40열에 맞으며, `←/→ to adjust` 같은 키 힌트가 유지된다
- `/install-github-app`을 개선했다: 저장소·secret·API key 단계가 표준 목록과 키를 쓰고, 메시지가 짧아졌으며, spinner와 더 명확한 오류를 표시한다
- `/desktop`을 개선했다: 다운로드 질문이 y/n 대신 표준 목록이다
- `ExitWorktree`가 저장되지 않은 작업이 있을 수 있는 worktree를 제거하기 전에 묻도록 변경했다. allow 규칙·auto·bypass permissions 모드가 허용하지 않으면 don't-ask 모드나 응답자가 없을 때 거부한다
- `.mcp.json`이 `mcpServers` 키 없이 최상위에 서버를 나열할 때 `claude mcp add --scope project`가 파일을 덮어쓰지 않고 멈추도록 변경했다
- 대부분의 권한 프롬프트에서 화살표 키가 순환하지 않고 No에서 멈추도록 변경했다. 마지막 답보다 큰 숫자는 No로 이동한다
- 경로 체크가 일부 symbolic link를 거부하도록 변경했다
- 작업 디렉터리 내부로 치는 범위를 변경해, 일부 경로는 이제 권한을 묻는다
- `permissions.blockReadsOutsideWorkingDirectories`가 bypass·auto 모드에서 더 많은 Bash 명령을 묻고, auto 모드에서 일부를 거부하도록 변경했다
- `permissions.blockReadsOutsideWorkingDirectories`가 Read·Edit deny 규칙 아래 경로를 지정한 Bash 명령을 묻던 대신 더 많이 거부하도록 변경했다
- 과금 classifier 요청으로의 fallback에 대한 auto mode 알림이 다음 릴리스에서 fallback이 제거된다고 말하도록 변경했다. 검사했을 각 동작은 묻거나 거부된다
- auto mode가 `Bash(pnpm dlx *)`처럼 아무 패키지나 실행하는 allow 규칙과, 이미 무시하던 규칙의 경로·버전 형태(`/usr/bin/npm run:*`)를 더 많이 무시하도록 변경했다. 이런 경우는 safety check가 결정한다
- `/sandbox`와 대부분의 `/config` 값 목록이 screen reader 모드 밖에서 번호 없이 표시되도록 변경했다. 화살표 키와 Enter를 쓴다
- 변수가 매우 긴 텍스트로 확장되는 Bash 명령은 거부되도록 변경했다. 더 짧은 값이나 파일을 쓰라는 메시지를 표시한다
- PowerShell 도구가 명령 하나를 더, 그 명령을 지정한 규칙이 있어도 묻도록 변경했다. 응답이 없으면 whole-tool 규칙·auto mode·bypass permissions 모드가 허용하지 않는 한 거부된다
- 형제의 메시지로 재개된 subagent가 세션의 권한 설정을 따르도록 변경했다. 이제 묻거나, 응답자가 없으면 거부될 수 있다
- 실행 폴더 옆의 상대 `--add-dir`와 함께 쓴 `--worktree`가 worktree 옆 폴더가 아닌 그 폴더를 Bash sandbox에 주도록 변경했다
- `..`처럼 실행 폴더 위의 상대 `--add-dir`와 함께 시작한 일부 `--worktree`가 Bash sandbox와 `--bg` 세션에 worktree만 주도록 변경했다
- Claude in Chrome이 일부 credential 파일 업로드를 거부하도록 변경했다. 해당 파일은 직접 페이지에 첨부한다
- 새 artifact마다 승인을 요구하는 조직의 artifact 승인을 변경했다: plugin만 만들었거나 허용한 artifact는 거부될 수 있다
- 새 artifact마다 승인을 요구하는 조직에서, 물어볼 사람이 없는 세션은 권한 프롬프트 없이 새 artifact를 즉시 거부하도록 변경했다
- 설정에서 Artifacts를 끄면 이미 실행 중인 세션에서도 Artifact 도구가 호출을 거부하도록 변경했다
- subagent에서, 그리고 백그라운드 task 결과·다른 사람의 메시지·compaction 이후에는 Artifact publish 프롬프트가 "don't ask again"을 제공하지 않도록 변경했다
- `claude plugin eval`이 plugin의 permission hook보다 자체 deny 규칙을 우선하고, hook이 통과시킨 호출을 표시하도록 변경했다
- MCP 서버 로그가 elicitation 요청과 hook 응답의 전체 내용 대신 mode·action·필드 이름만 기록하도록 변경했다
- `fg`로 재개한 직후 잠시 동안 대부분의 프롬프트가 Esc 외의 응답을 무시하도록 변경했다
- 설치된 mod가 tool call에 hook을 걸어도 Code Mode가 시작을 거부하지 않도록 변경했다. 관리자는 managed settings로 여전히 Code Mode를 끌 수 있다
- 모델 없이 시작한 subagent가 재개될 때, `/model` 이후에도 시작한 모델을 유지하도록 변경했다
- 어떤 모델의 첫 subagent가 Anthropic에서 그 모델의 설정을 받기까지, 설정 없이 시작하지 않고 최대 1.5초(`claude -p`에서는 10초) 기다리도록 변경했다
- 재시작된 백그라운드 subagent와 스스로 시작하는 turn이 plugin 로드를 기다리도록 변경했다
- Claude가 실행한 `claude --bg`처럼 다른 Claude Code 세션이 시작한 세션의 실행 프롬프트 대부분을 프롬프트 기록에서 제외하도록 변경했다
- Amazon Bedrock·Google Vertex AI·Microsoft Foundry 터미널 세션의 subagent 진행 요약이 전체 대화가 아닌 짧은 메모로 작성되도록 변경해 토큰을 크게 줄였다
- non-interactive(`-p`) 모드가 첫 요청 전에 git 명령을 더 적게 실행하도록 변경했다
- 원격 VS Code·Cursor·Devin Desktop 세션에서는 설정을 바꿀 수 없으므로 첫 실행 설정이 터미널 설정을 건너뛰도록 변경했다
- 전체화면 텍스트 선택에서 system·thinking·수신 메시지 행의 기호를 제외하도록 변경했다
- Anthropic 호스팅 cloud 세션이 저장소의 flag·plugin 전달 설정을 더 많이 무시하도록 변경했다. 저장소의 `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC`는 최대 `DISABLE_TELEMETRY` 수준으로만 동작한다
- [VSCode] Explorer 우클릭 메뉴에 선택한 파일·폴더를 채팅에 @-mention하는 "Claude Code: Add to Chat"을 추가했다
- [VSCode] PreToolUse hook이 확인을 요청할 때 제시한 이유를 권한 프롬프트가 표시하지 않던 문제를 수정했다 (anthropics/claude-code#85950)
- [VSCode] 권한 프롬프트 제목에서 긴 tool·파일 이름이 잘리던 문제를 수정했다
- [VSCode] 터미널 세션의 diff에 입력한 뒤 Claude가 같은 파일을 다시 편집하면 이전 제안 편집을 보여주던 문제를 수정했다
- [VSCode] 피드백이나 "Build a custom style" 대화상자, @-mention 메뉴, model·mode·"+" 메뉴, 기타 popup을 닫는 Escape가 Claude의 응답까지 멈추던 문제를 수정했다
- [VSCode] Claude가 연속으로 여러 편집을 할 때 속도를 개선했다: 대기 중인 편집이 새 problem을 한 번만 기다린다. problem이 이후 편집과 함께 보고될 수 있다
- [VSCode] `rg`가 `PATH`에 있으면 큰 workspace에서 @-mention 파일 검색 속도를 개선했다. 결과 순위가 터미널과 비슷해졌고 오타 허용은 줄었다
- [VSCode] 시작을 개선했다: 처음 연 폴더, 빈 창, worktree에서 model picker가 즉시 준비된다. third-party provider는 제외
- [VSCode] 같은 창의 터미널 세션이 프롬프트를 보내도 채팅 편집의 diff가 열린 채 승인을 계속 요청하도록 변경했다
- [VSCode] IDE 연결에서 쓰지 않는 도구(openFile, saveDocument, getOpenEditors 등)를 제거했다

---

## 🎯 챌린지

이번 버전에서 내 환경에 적용해볼 만한 항목입니다.

### 1. `/status`로 깨진 설정과 hook matcher 점검
- **파일**: `~/.claude/settings.json`, `~/.claude/skills/`, `~/.claude/agents/`
- **근거**: 이번 버전부터 `/status`가 깨진 agent·skill 파일과 절대 매칭되지 않는 hook matcher를 보여준다. 개인 skill(`eos-cdn-deploy`, `eos-store-round` 등)이 많고 `PreToolUse` `Bash` matcher로 `deploy-guard.sh`에 의존하므로, 조용히 깨진 항목이 있는지 한 번 확인하고 고친다.
- **난이도**: ★☆☆ (약 10분)

### 2. 승인 전 shell 시작 파일 실행 영향 확인
- **파일**: `~/.zshrc`, `~/.claude/settings.json`
- **근거**: 첫 Bash 명령은 이제 승인 전, 거부되더라도 shell 시작 파일을 먼저 실행한다. `~/.zshrc`에 원격 접속·네트워크 호출·파일 쓰기 같은 부수 효과가 있으면 `settings.json`의 `env`에 `CLAUDE_CODE_DISABLE_SHELL_HEAD_START=1`을 넣어 끈다. 부수 효과가 없으면 그대로 둔다.
- **난이도**: ★☆☆ (약 10분)

### 3. 토큰이 든 MCP 서버를 stdin 방식으로 재등록
- **파일**: `~/.claude.json` (MCP 서버 정의), `~/.zsh_history`
- **근거**: `claude mcp add-json <name> -`로 서버 JSON을 stdin에서 받아 토큰을 명령줄·shell 기록에 남기지 않는다. `trilium`, `google-sheets` 등 토큰이 필요한 서버를 명령줄 인자로 등록했다면 이 방식으로 다시 등록하고 history에 남은 토큰 줄을 지운다. Claude Code 세션 밖의 터미널에서 실행한다.
- **난이도**: ★★☆ (약 15분)
