# Claude Code v2.1.309

> 작성일: 2026-10-23

---

# 📋 요약본

## 🎉 신기능 (10건)
- **`sed -i` 처리 방식 변경** — 더 이상 파일 편집 미리보기로 흉내 내지 않는다. 일반 Bash 확인 창을 거쳐 쓴 그대로 실행한다.
  - 다른 Bash 편집처럼 `/rewind`로 되돌릴 수 없다.
- **`claude ultrareview` 실행 전 작업 폴더 신뢰 확인** — 터미널에서는 신뢰 여부를 묻고, 터미널이 아니면 실행을 거부한다.
  - 스크립트에서는 `--trust-workspace`를 쓴다. 이 옵션은 값을 받지 않으므로 PR 번호나 base 브랜치를 그 앞에 둔다. 또는 `CLAUDE_CODE_DISABLE_ULTRAREVIEW_TRUST_CHECK=1`을 설정한다.
- **bypass 모드의 위험한 `rm`·`rmdir` 즉시 거부** — Desktop 앱과 VS Code에서는 확인 창 없이 바로 거부하고 명령을 고쳐 쓰는 방법을 알려준다. 사람이 지켜보지 않는 세션도 멈추지 않는다.
- **sandbox 제외 명령의 쓰기 제한 강화** — sandbox가 켜져 있지만 실행될 수 없는 상태라면, 제외 명령이 write-list 경로에 쓰기 전에 먼저 묻는다. sandbox 없이 실행하는 우회 경로는 거부한다.
- **worktree 생성 시 git 객체를 그때그때 받아오지 않음** — 일반 clone과, Bash sandbox가 설정된 partial clone 모두 해당한다. partial clone은 필요한 객체를 미리 받아둔다.
- **`/claude-api` Managed Agents 팀 구성 변경** — `coordinator` 대신 `multiagent_20261001` 위에서 subagent 팀을 만든다. dynamic workflow가 기본으로 켜진다.
- **dataviz skill에 APCA 대비 기준 추가** — APCA(글자와 배경의 명도 대비를 재는 방식)를 지원한다. AA 준수가 필요한 곳에는 WCAG 2 비율을 그대로 쓴다.
  - palette validator에 `apca(text, background)` 함수를 추가했다. 색이 칠해진 차트 영역 안의 라벨을 흰색으로 할지 검정에 가까운 색으로 할지도 알려준다.
- **`/claude-api` OpenTelemetry 대상 관리 권한 확대** — service account key와 Workload Identity Federation 토큰으로도 관리할 수 있다.
- **[VSCode] 인증서 검증 실패 시 안내 로그 추가** — TLS를 검사하는 프록시 뒤에 있을 때 무엇을 해야 하는지 로그로 알려준다.
- **[Self-hosted runner] runner 이동 시 중단된 도구 호출 표시** — 세션이 새 runner로 옮겨가면, 끊긴 도구 호출을 "결과 알 수 없음"으로 표시해 Claude에게 보여준다.

## 🛠️ 개선/수정 (14건)
- **sandbox 우회 구멍 차단** — 셸 시작 파일이 sandbox 밖에서 실행되던 문제, symlink를 거쳐 들어간 경로에 `denyWrite`가 적용되지 않던 문제, `--mcp-config` 파일이 수정되던 문제, Linux에서 백그라운드 명령이 세션보다 오래 남으면 쓰기 차단이 풀리던 문제를 고쳤다.
- **Bash 권한 검사 강화** — 감싸거나 앞에 무언가 붙인 `cd` 뒤에 git을 실행하는 복합 명령도 이제 확인을 묻는다. 열기에 실패할 수 있는 redirect가 붙은 명령이 설정한 변수를 믿던 문제, subshell이 섞인 명령에서 `Edit(path)` deny 규칙이 redirect를 막지 못하던 문제도 고쳤다.
- **worktree 격리 우회 차단** — locale 접두어가 붙은 명령과 zsh 산술 명령이 격리 검사를 통과하던 문제를 고쳤다. git replace ref도 무시한다.
- **Windows PowerShell 권한·hook 수정** — 현재 폴더를 가리키는 `Set-Location`·`cd`에 인자가 더 붙으면 자동 승인되던 문제를 고쳤다. exit 2로 종료한 hook이 작업을 막지 못하던 문제, Git for Windows가 없을 때 hook이 실패하면 그냥 통과시키던 문제도 고쳤다.
- **큰 nested CLAUDE.md 반복 compact 해결** — 크기 제한을 넘는 nested CLAUDE.md는 앞부분만 읽는다. compact(긴 대화를 요약해 줄이는 동작)가 계속 반복되던 문제가 사라졌다.
- **입력·키 동작 수정** — ctrl+enter(지금 보내기) 동작, `!` 모드에서 키에 연결된 slash command가 셸에서 실행되던 문제, ctrl+o에서 아직 전달 대기 중인 메시지가 보이지 않던 문제를 고쳤다.
- **transcript·Read 안정화** — 출력 미리보기가 이모지 중간에서 잘려 `jq`가 파싱하지 못하던 문제, Linux sandbox에서 PDF 페이지 범위 읽기가 실패하던 문제를 고쳤다.
- **세션·팀 동작 수정** — 분할 창 teammate가 leader의 도구 deny·`--tools` 규칙을 물려받지 못하던 문제를 고쳤다. `/rename` 이름 유지, `/rewind`에서 변경 내역이 빠지던 문제, Desktop 세션 메시지 유실도 고쳤다.
- **skill 탐색 수정** — `--add-dir` 폴더의 skill 이름이 다른 skill과 겹치면 `<folder>:<name>`으로 제공한다. `/verify`·`/code-review`가 nested 패키지의 skill을 찾지 못하던 문제도 고쳤다.
- **`/claude-api` skill 정확도 개선** — tracing 관련 잘못된 설명을 고쳤다. API tracing도 함께 제안하고, 지원하지 않는다고 말하기 전에 최신 문서를 확인한다.
- **git·디스크 오류 메시지 개선** — Windows에서 내부 git 명령이 빨라졌다. git 오류는 영어로 표시한다. 디스크가 가득 찼을 때 비울 폴더를 알려준다. hooks module이 너무 깊어 로드되지 않으면 해당 파일 이름을 알려준다.
- **GitHub 오멘션 방지** — PR·이슈·댓글에서 역할 이름이나 placeholder를 멘션으로 써서 관계없는 사용자에게 알림이 가던 문제를 고쳤다.
- **[VSCode] 패널·입력 개선** — 빈 패널 자동 복구, "Untitled" 빈 세션이 쌓이던 문제, 긴 메시지 접기, Ctrl+J 동작, LaTeX 붙여넣기를 고쳤다. Edit·Write 후 대기 시간이 0.75초로 줄었다.
- **Cloud sessions·Claude Tag·Code Review 수정** — 커넥터 목록, 환경 변수 편집기, Slack 게시 채널 오류와 승인 카드, 리뷰 check 표시 문제를 고쳤다.

## 🔑 이번 버전의 핵심 키워드
**"권한·sandbox 구멍 메우기"** — 우회될 수 있던 권한 검사, sandbox, worktree 격리를 대거 막은 보안 정비 버전이다.

---

# 📜 원문 (한글 번역본)

> 원문 ChangeLog를 원래 순서 그대로 한 줄도 빠짐없이 번역한 문서입니다.

- macOS와 Linux에서 sandbox 안에서 실행되는 Bash 명령이, 명령마다 셸 시작 파일을 sandbox 밖에서 먼저 실행하던 문제 수정
- macOS sandbox의 `denyWrite` glob 패턴이, 패턴의 폴더에 symlink를 거쳐 도달하면 실제 경로에 적용되지 않던 문제 수정
- sandbox 명령과 자동 승인된 편집이 `--mcp-config`로 넘긴 MCP 설정 파일을 수정할 수 있던 문제 수정
- print·SDK 세션에서 비활성화한 MCP 서버가 이후 권한 확인 창 때문에 다시 연결되던 문제 수정
- Bash 권한 검사가, 열기에 실패할 수 있는 redirect가 붙은 명령이 설정한 변수를 믿던 문제 수정
- 디렉터리를 바꾼 뒤 git을 실행하는 일부 복합 명령에서 `cd`가 감싸져 있거나 앞에 무언가 붙어 있으면 Bash 권한 검사가 확인을 묻지 않던 문제 수정. 이제 그냥 `cd`일 때처럼 묻는다
- subshell이 함께 들어 있는 일부 명령에서 `Edit(path)` deny 규칙이 해당 경로로의 Bash redirect를 막지 못하던 문제 수정
- worktree 격리 세션이 격리 검사에서 거부해야 할 일부 locale 접두어 명령을 받아들이던 문제 수정
- zsh의 worktree 격리 세션이 격리 검사에서 거부해야 할 일부 산술 명령을 받아들이던 문제 수정
- Claude Code가 만드는 worktree와 브랜치 checkout이 git replace ref를 무시하도록 수정. 다른 git 작업은 이미 그렇게 하고 있었다
- config 디렉터리에 symlink를 거쳐 도달하면 profile store 쓰기 보호가 적용되지 않던 문제 수정
- 매우 큰 nested CLAUDE.md 아래의 파일을 읽은 뒤 세션이 compact를 반복하던 문제 수정. 크기 제한을 넘는 nested CLAUDE.md는 이제 앞부분만 읽는다
- ctrl+enter(지금 보내기)가 응답 시작 전에 눌렀을 때만 메시지를 대기열에 넣던 문제 수정. 프롬프트의 hook이 실행 중일 때 누르면 hook을 다시 시작하면서 메시지는 대기열에 남겨두던 문제도 수정
- 키에 연결된 slash command가 `!` 모드에서 셸 명령으로 실행되던 문제 수정
- ctrl+o에서 다른 agent·세션이 보낸, 아직 전달 대기 중인 메시지가 보이지 않던 문제 수정. 이제 transcript 아래에 대기 중 표시와 함께 전체가 보인다
- 긴 도구 출력 미리보기가 이모지 중간에서 잘려 `jq`가 파싱할 수 없는 세션 transcript가 생기던 문제 수정
- 부모의 `/proc`을 공유하는 Linux sandbox에서 Read가 PDF 페이지 범위에 대해 "File does not exist"를 보고하던 문제 수정
- Claude Desktop에서 호스팅되는 세션의 메시지가 연결이 새로 고쳐질 때 가끔 유실되던 문제 수정
- 같은 컴퓨터의 터미널이 다른 계정이나 조직으로 로그인되어 있으면 Claude 데스크톱 앱의 Claude Code 세션에서 일부 기능이 빠지던 문제 수정
- git 저장소가 아닌 폴더에서 `claude remote-control` status line이 브랜치를 `HEAD`로 표시하던 문제 수정
- 분할 창 agent teammate가 leader의 명령줄에 준 도구 deny 규칙과 `--tools` 규칙을 물려받지 않던 문제 수정
- `/rename`으로 이름을 바꾼 세션이, VS Code 창을 다시 불러오거나 비대화형 `--resume` 뒤에 다른 세션에서 자동 생성된 이름으로 보이던 문제 수정
- `/code-review --fix`, subagent, 셸 명령으로 checkpoint 대상 파일을 바꾼 turn을 `/rewind` 목록이 "No code changes"로 표시하던 문제 수정
- `/privacy-settings`가 오래된 "Help improve our AI models" 값을 보여주던 문제 수정. 설정을 가져올 수 없으면 그 사실도 알려준다
- 조직이 피드백을 받지 않을 때 피드백 화면이 "try again later"라고 하던 문제 수정. 이제 서버가 보낸 이유와 버그를 신고할 곳을 보여준다
- 너무 큰 /feedback 보고서가 실패하던 문제 수정. 이제 transcript를 빼고 다시 보낸다
- 다른 skill이 이미 같은 이름을 쓰고 있으면 `--add-dir` 폴더의 skill에 접근할 수 없던 문제 수정. 이제 `<folder>:<name>`으로 제공한다
- 셸에서 파일을 바꾸면 `/verify`와 `/code-review`가 nested 패키지 자체의 skill을 찾지 못하던 문제 수정
- /claude-api skill이 `ant beta:worker poll --on-work`가 명령에 trace context를 넘긴다고 잘못 말하던 문제 수정
- /claude-api skill의 C# tracing 설정에서 클라우드 플랫폼 클라이언트의 span이 빠지던 문제 수정
- /claude-api skill이 AWS의 Claude Platform으로 보낸 요청의 API span은 호출자의 trace에 합류할 수 없다고 잘못 말하던 문제 수정
- PowerShell에서 실행되는 hook이 exit code 2로 끝나도 작업을 막지 못하던 문제 수정. Windows에서 `"shell": "powershell"`인 `PreToolUse`·`PermissionRequest` hook이 Git for Windows가 없을 때 실패하면 그냥 통과시키던(fail open) 문제도 수정
- mod의 `turn.step` hook이 `haiku` 같은 alias로 모델을 지정하면 모든 요청이 모델 오류로 실패하던 문제 수정. 이제 alias가 실제 모델로 바뀐다
- claude.ai에서 동기화한 plugin과 skill이 디스크 읽기 오류 뒤에 제거되던 문제 수정. 세션 도중에 제거되는 경우도 있었다
- 특정 minified 스크립트가 있는 페이지나 Claude가 먼저 읽지 못한 artifact 등, 일부 평범한 페이지의 artifact 게시·업데이트가 거부되던 문제 수정
- 한 turn 안에서 대화가 compact되면, 그 turn이 끝날 때까지 artifact를 업데이트할 때마다 Claude가 권한을 묻던 문제 수정
- `ANTHROPIC_BEDROCK_BASE_URL`을 기본 `bedrock-runtime.<region>.amazonaws.com` endpoint로 설정하면 Amazon Bedrock에서 fine-grained tool streaming이 계속 꺼져 있던 문제 수정
- keepalive ping만 보내는 gateway 뒤에서 "Waiting for API response" 안내가 깜빡이던 문제 수정. Anthropic backend가 아닌 경로는 이제 45초를 기다린다
- Claude가 PR·이슈·댓글에서 역할 이름과 placeholder를 멘션으로 써서 관계없는 GitHub 사용자에게 알림을 보내던 문제 수정
- Linux: 백그라운드 명령이 세션보다 오래 살아남으면 sandbox 쓰기 차단이 풀리던 문제 수정
- Windows: 현재 디렉터리를 가리키면서 인자가 더 붙은 일부 `Set-Location`·`cd` 명령을 PowerShell 권한 검사가 자동 승인하던 문제 수정. 이제 승인을 묻는다
- macOS: Xcode나 Command Line Tools가 없는 Mac에서 Claude Code를 시작할 때마다 "Install Command Line Developer Tools" 창이 열리던 문제 수정
- Self-hosted runner: `/code-review`처럼 첫 프롬프트가 subagent에서 아직 작업 중인 세션을 `--startup-timeout-min`이 중지시키던 문제 수정. 멈춘 프로세스는 여전히 중지한다
- Windows에서 Claude Code가 자체적으로 실행하는 여러 git 명령의 속도 개선. 모든 플랫폼에서, git이 다른 언어로 설정되어 있어도 이 명령들의 오류를 영어로 표시한다
- hooks module이 너무 깊이 중첩되어 로드할 수 없을 때의 오류 개선. 맨 stack-overflow 메시지 대신 해당 파일 이름을 알려준다
- 디스크 가득 참 처리 개선. 디스크가 차서 중단된 Bash 명령은 그 사실과 비울 폴더를 알려준다. 가득 찬 임시 볼륨에서 시작하면 날것의 ENOSPC 오류 대신 명확한 메시지를 출력한다
- OpenTelemetry 추가를 요청받으면 /claude-api skill이 SDK tracing과 함께 API tracing도 제안하도록 개선
- /claude-api skill이 기능을 지원하지 않는다고 말하기 전에 최신 문서를 확인하도록 개선
- Self-hosted runner: 새 runner로 옮겨가는 세션 개선. 중단된 도구 호출을 "결과 알 수 없음"으로 표시해 Claude에게 보여준다
- 내장 dataviz skill 업데이트: APCA를 글자 대비 척도로 받아들인다(AA 준수가 필요한 곳에는 WCAG 2 비율 유지). palette validator 스크립트에 `apca(text, background)` 함수를 추가했고, 색이 칠해진 차트 영역 안의 라벨을 흰색으로 할지 검정에 가까운 색으로 할지 알려준다
- /claude-api skill 업데이트: service account key와 Workload Identity Federation 토큰으로 OpenTelemetry 대상을 관리할 수 있다
- `sed -i`가 흉내 낸 파일 편집 미리보기 대신 일반 Bash 확인 창을 거쳐 쓴 그대로 실행되도록 변경. 다른 Bash 편집처럼 더 이상 `/rewind`로 복원되지 않는다
- `claude ultrareview`가 작업 폴더 신뢰를 요구하도록 변경: 터미널에서는 묻고, 아니면 거부한다. 스크립트는 `--trust-workspace`를 넘긴다. 이 옵션은 값을 받지 않으므로 PR 번호나 base 브랜치를 그 앞에 둔다. 또는 `CLAUDE_CODE_DISABLE_ULTRAREVIEW_TRUST_CHECK=1`을 설정한다
- Desktop 앱과 VS Code의 bypass permissions 모드에서 위험한 `rm`·`rmdir` 확인 창을, 명령을 즉시 거부하고 고쳐 쓰는 힌트를 주는 방식으로 변경. 사람이 지켜보지 않는 세션이 계속 진행된다
- sandbox가 켜져 있지만 실행될 수 없을 때, 설정에서 sandbox 제외로 지정한 명령이 write-list 경로에 쓰기 전에 묻도록 변경. 이 경우 sandbox 없이 실행하는 대체 경로는 거부한다
- 일반 clone과, Bash sandbox가 설정된 partial clone에서 worktree를 만들거나 재사용할 때 git이 객체를 그때그때 받아오지 않도록 변경. 그런 partial clone은 객체를 먼저 받아둔다
- `/claude-api` skill이 Managed Agents subagent 팀을 `coordinator` 대신 `multiagent_20261001` 위에 만들고, dynamic workflow를 기본으로 켜도록 변경
- [VSCode] TLS를 검사하는 프록시 뒤에 있을 때처럼 받아쓰기나 확장 자체 요청이 인증서 검증에 실패하면 무엇을 해야 하는지 알려주는 로그 경고 추가
- [VSCode] 편집기가 불완전한 파일 사본을 캐시한 뒤 Claude 패널이 빈 채로 남던 문제 수정. 이제 스스로 복구하거나, 무엇이 잘못됐고 어떻게 고치는지 알려준다
- [VSCode] 메시지를 보내지 않고 새 세션을 시작할 때마다 Session history에 빈 "Untitled" 세션이 쌓이던 문제 수정
- [VSCode] `/goal` 같은 긴 slash command 메시지가 채팅 패널을 가득 채우던 문제 수정. 이제 다른 프롬프트처럼 Show more 뒤로 접힌다 (anthropics/claude-code#97469)
- [VSCode] 채팅 패널을 좁힌 뒤 긴 메시지가 Show more 뒤로 접히지 않던 문제 수정
- [VSCode] 채팅 입력의 Ctrl+J가 항상 줄바꿈을 넣던 문제 수정. ~/.claude/keybindings.json의 Chat context에서 "ctrl+j"를 null로 설정하면 이제 VS Code와 OS에 맡긴다
- [VSCode] mod의 "From the … plugin" 라벨이 프롬프트 위에서 slash command·@-mention 메뉴를 덮어 그려지던 문제 수정 (anthropics/claude-code#102981)
- [VSCode] 복사한 LaTeX 수식을 붙여넣을 때 빈 목록 항목·문단·코드 블록이 생기고 목록 번호가 1부터 다시 매겨지던 문제 수정
- [VSCode] 조직이 피드백을 받지 않을 때 피드백 오류가 HTTP 상태만 보여주던 문제 수정
- [VSCode] 채팅 패널의 Edit·Write 속도 개선: 편집 후 새 문제를 기다리는 시간이 대부분 1~1.5초에서 0.75초로 줄었다
- [Cloud sessions] routine 양식의 Add connector 목록이 아직 불러오는 중인데도 사용 가능한 connector가 없다고 표시하던 문제 수정
- [Cloud sessions] 클라우드 환경 편집기가 환경 변수 순서를 뒤섞고, 두 종류의 따옴표가 모두 든 값에 백슬래시를 추가하던 문제 수정
- [Cloud sessions] 관리자 설정의 self-hosted 환경 상세 창에서 제목·탭·버튼은 화면에 고정되고 내용만 스크롤되도록 수정
- [Cloud sessions] 클라우드 세션의 "read documentation" 도구 행이 읽을 수 있는 페이지 대신 escape된 JSON을 보여주던 문제 수정
- [Cloud sessions] 클라우드 세션의 Changes 창 개선. push된 커밋만 나열하는지, Claude의 편집만 나열하는지 이제 알려준다
- [Claude Tag] Slack에서 채널용으로 승인한 초안을 Claude가 실수로 DM에 게시하던 문제 수정. 채널이 없는 게시는 이제 거부되어 승인된 채널로 갈 수 있다
- [Claude Tag] 세션이 멈췄을 때 Slack의 Claude 승인 카드에서 Allow·Deny가 아무 동작도 하지 않던 문제 수정. 이제 응답하면 세션이 다시 시작된다
- [Claude Tag] workspace가 다른 Claude 조직으로 옮겨진 뒤 Claude가 Slack 채널의 태그 없는 메시지를 무시하던 문제 수정. Enterprise Grid의 공유되지 않은 채널도 포함한다
- [Claude Tag] Slack 채널의 Claude가 스레드에 방금 추가된 새 메시지를 읽기 전에 스레드 답글을 게시하던 문제 수정
- [Claude Tag] Claude Tag 관리자 설정의 Slack 페이지가 목록 로드에 실패하면 연결된 workspace가 없다고 표시하던 문제 수정. 이제 Retry 버튼과 함께 오류를 보여준다
- [Code Review] 앞선 check 생성 시도가 실패하면 끝난 리뷰가 pull request에 check를 표시하지 않던 문제 수정. 마지막 시도로 완료된 check를 추가한다
- [Code Review] `@claude review stop` 뒤에도 실행 중인 리뷰 뒤에 대기하던 push가 리뷰를 시작하던 문제 수정. 이제 그 check는 닫히고 이유를 알려준다

---

## 🎯 챌린지

이번 버전에서 내 환경에 적용해볼 만한 항목입니다.

### 1. deploy-guard.sh 우회 패턴 점검
- **파일**: `~/.claude/hooks/deploy-guard.sh`
- **근거**: 이번 버전은 감싸거나 접두어가 붙은 `cd` 뒤에 git을 실행하는 복합 명령이 권한 검사를 빠져나가던 문제를 고쳤다. 내 `PreToolUse` hook도 같은 구멍이 있을 수 있다. `cd repo && git push origin feat/x`, `(cd repo; git push origin feat/x)`, `git -C repo push origin feat/x`, `env LANG=C git push origin fix/y`를 hook에 직접 넣어 모두 막히는지 확인하고, 빠지는 패턴은 정규식에 추가한다.
- **난이도**: ★★☆ (약 20분)

### 2. CLAUDE.md에 `sed -i` 금지 규칙 추가
- **파일**: `~/.claude/CLAUDE.md`
- **근거**: 이제 `sed -i`는 그냥 Bash 명령으로 실행되고 `/rewind`로 되돌릴 수 없다. "실수가 잦지 않게" 원칙에 맞게 §3 Surgical Changes에 "파일 수정은 Edit/Write 도구로만 한다. `sed -i`·`perl -i`로 파일을 고치지 않는다(`/rewind` 복원 불가)" 한 줄을 넣는다.
- **난이도**: ★☆☆ (약 5분)

### 3. 프로젝트 CLAUDE.md 크기 점검과 핵심 규칙 앞으로 옮기기
- **파일**: `~/gitlab/**/CLAUDE.md` (EOS-H5·flyff 등 프로젝트별 nested CLAUDE.md)
- **근거**: 크기 제한을 넘는 nested CLAUDE.md는 이제 앞부분만 읽힌다. 뒤쪽에 있는 ⛔ 규칙(브랜치 정책, CDN 배포 순서 등)은 조용히 빠질 수 있다. `find ~/gitlab -name CLAUDE.md -exec wc -c {} +`로 크기를 확인하고, 큰 파일은 필수 규칙을 맨 위로 올린다. 긴 절차는 별도 문서로 빼고 링크만 남긴다.
- **난이도**: ★★☆ (약 15분)
