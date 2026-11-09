# Claude Code v2.1.321

> 작성일: 2026-11-10

---

# 📋 요약본

## 🎉 신기능 (3건)
- **Claude Fable 5.2 추가** — `claude-fable-5-2`가 새로 나왔고, 이제 Fable을 고르면 이 모델이 기본으로 쓰인다.
  - 1M 컨텍스트를 지원한다. 가격은 입력 $8, 출력 $40, 캐시 읽기 $0.20(각 Mtok당)이다.
- **`claude remote-control --settings <file>`** — 지정한 설정 파일이 remote-control이 띄우는 모든 세션에 적용된다.
  - 파일을 바꾸면 `claude remote-control`을 재시작하기 전까지 새 세션이 시작되지 않는다.
- **[VSCode] 인증 중복 경고** — auth token과 API key가 함께 설정돼 있으면 입력창 위에 경고가 뜬다. 터미널의 시작 경고와 같은 동작이다.

## 🛠️ 개선/수정 (16건)
- **MCP OAuth 시크릿 유출 차단** — 서버가 요청을 다른 곳으로 보내면(redirect) refresh token 같은 비밀값이 다른 호스트로 넘어가던 문제를 고쳤다.
- **Bash 권한 검사 구멍 수정** — 아래 경우에 권한 확인이 빠지던 문제를 고쳤다.
  - 읽기 전용 명령이 샌드박스 밖에서 확인 없이 실행되던 경우
  - 파일 쓰기를 엉뚱한 폴더 기준으로 판단하던 경우
  - `cp`·`mv`로 디렉토리에 복사·이동할 때 deny 규칙이 빠지던 경우
  - `/bin/cp`처럼 전체 경로로 적은 `cp`·`mv`는 이제 일반 `cp`·`mv`와 같은 경로 검사를 받는다.
- **네트워크 경로 편집 버그 수정** — UNC 공유, WSL 폴더, `/net` 마운트에서 Edit와 `NotebookEdit`가 엉뚱한 곳을 고치거나 파일 전체를 덮어쓰던 문제를 고쳤다.
- **Fable 모델 전환** — 저장해 둔 Fable 5.1 선택은 `fable`로 옮겨진다. 예전 모델로 돌아가려면 `/model claude-fable-5-1`을 쓴다. Enterprise 좌석에서 "사용 크레딧 차감" 안내가 잘못 뜨던 문제도 고쳤다.
- **훅 동작 정확도 개선** — 여러 훅을 함께 쓸 때 생기던 문제를 고쳤다.
  - 큰 훅 출력이 다른 훅의 출력 파일을 가리키던 문제
  - 다른 훅의 `defer` 때문에 PreToolUse의 `ask`가 사라지던 문제
  - `mcp_tool` 훅 응답이 16MiB를 넘으면 훅을 건너뛰던 문제(이제 도구 호출을 거부한다)
- **프로젝트 스킬·에이전트 재로딩** — `git stash`처럼 폴더가 사라졌다 다시 생기거나 worktree에 들어간 뒤 스킬·커맨드·에이전트가 사라지던 문제를 고쳤다.
- **fast mode 폴백 개선** — fast 서빙이 제한되거나 실패하면 다른 모델로 넘어가기 전에 같은 모델의 표준 속도부터 시도한다.
- **백그라운드 에이전트 처리** — 컨텍스트를 압축할 때 서브에이전트 보고가 사라지던 문제와, 한 요청에 보고가 과하게 실리던 문제를 고쳤다. 1,000자가 넘는 명령은 앞부분과 끝부분만 보여줘 컨텍스트를 아낀다.
- **Remote Control 안정화** — 아래를 고쳤다.
  - 실제로는 연결돼 있는데 꺼진 것처럼 보이던 문제
  - "Queue for later"로 보낸 메시지가 실행 중인 턴 중간에 끼어들던 문제
  - 연결된 클라이언트가 세션의 작업 폴더를 바꿀 수 있던 문제(이제 시작 폴더로 고정된다)
- **`claude -p` 안정화** — 아래를 고쳤다.
  - 백그라운드 명령 제한 시간을 실제 10분이 아니라 30분으로 안내하던 문제
  - NFS 저장소가 가득 차 기록이 사라져도 조용히 exit 0으로 끝나던 문제(이제 exit 1)
  - 메모리가 부족할 때 멈추던 문제
- **세션 시작 git status 정확도** — git status가 실패하면 "깨끗함" 대신 "확인 불가"로 알린다. 첫 번째 파일을 staged로 잘못 표시하던 문제도 고쳤다.
- **mods 권한 정책 변경** — mods(Claude가 직접 만드는 확장 기능)는 auto·bypass 모드에서 묻지 않고 켜지고, `dontAsk` 모드에서는 로드되지 않는다. mods 자체의 도구 호출은 확인 창을 띄우지 않지만 deny 규칙과 조직 정책은 그대로 적용된다.
- **시작·설치 속도 개선** — 설치가 2~4초 빨라졌고 TLS 인증서 로딩이 빨라졌다. Windows는 PATH 탐색과 git 확인 단계를 줄였다.
- **Claude apps gateway 개선** — 사용 한도 검사를 정확하게 하고, 리셋 시각을 현지 시간으로 보여준다. 오류 메시지에서 사용자명과 비밀번호를 숨긴다. Bedrock·Vertex·Foundry 업스트림은 `ANTHROPIC_*_BASE_URL`을 무시한다.
- **`/model`·`/config` UI 정리** — "More models"가 맨 아래 번호 없는 줄로 옮겨졌다. 새 세션이 auto 모드로 시작할 때 `/config`에 기본 모드가 Manual로 잘못 표시되던 문제도 고쳤다.
- **플러그인 업데이트 중복 다운로드 제거** — 같은 레포의 worktree나 폴더마다 플러그인을 다시 받던 문제를 고쳤다. `~/.claude/plugins` 안의 `.claude/skills`는 더 이상 중첩 로드되지 않는다.

## 🔑 이번 버전의 핵심 키워드
**"Fable 5.2 기본화 + 권한·훅의 빈틈 메우기"** — 새 기본 Fable 모델을 들이고, Bash·`cp`/`mv`·OAuth·훅 조합에서 권한 확인이 새던 길을 막은 보안·안정성 릴리스다.

---

# 📜 원문 (한글 번역본)

> 원문 ChangeLog를 원래 순서 그대로 한 줄도 빠짐없이 번역한 문서입니다.

- Claude Fable 5.2(`claude-fable-5-2`) 추가. 이제 기본 Fable 모델이다 — 1M 컨텍스트, Mtok당 $8/$40, 캐시 읽기 Mtok당 $0.20
- `claude remote-control`에 `--settings <file>` 추가. 이것이 시작하는 모든 세션에 설정 파일을 적용한다. 파일이 바뀌면 `claude remote-control`을 재시작할 때까지 새 세션이 시작되지 않는다
- 서버가 리다이렉트할 때 MCP OAuth 요청이 refresh token 같은 시크릿을 다른 호스트로 보내던 문제 수정
- 읽기 전용 Bash 명령이 권한 확인 없이 샌드박스 밖에서 실행되던 경우 수정
- Bash 권한 검사가 파일 쓰기를 잘못된 폴더 기준으로 판단해 확인을 띄우지 않던 경우 수정
- 디렉토리로의 `cp`·`mv`가 쓰는 파일에 deny 규칙과 보호 파일 확인이 적용되지 않던 문제 수정
- 플랜에 Fable이 포함된 Enterprise 좌석에서 Fable로 전환한 뒤 "Draws from usage credits" 안내가 표시되던 문제 수정
- 첫 모델이 응답 전에 차단됐을 때 폴백 모델이 요청을 거절하거나 중단된 응답을 언급하던 문제 수정
- Claude Code가 등록한 서버에 다시 로그인할 때마다 `claude mcp login`이 SEP-2352 issuer 경고를 출력하던 문제 수정
- 네트워크 경로(UNC 공유, WSL 폴더, `/net` 마운트)에서 셀을 지정하지 않은 호출에 `NotebookEdit`가 노트북의 첫 셀을 삭제하거나 덮어쓰던 문제 수정
- 네트워크 경로(UNC 공유, WSL 폴더, `/net` 마운트)에서 Edit가 여러 일치 중 첫 번째를 바꾸거나, 빈 `old_string`으로 파일 전체를 교체하거나, 노트북을 텍스트로 편집하던 문제 수정
- 새 세션이 auto 모드로 시작할 때 `/config`가 기본 권한 모드를 Manual로 표시하던 문제 수정. 이제 "Auto (default)"에서 Space를 누르면 Plan이 아니라 Don't Ask가 저장된다
- Windows: 세션 작업 디렉토리의 드라이브 문자가 소문자일 때 첫 셸 명령 이후 `watchPaths`로 지정한 경로의 `FileChanged` 훅이 멈추던 문제 수정
- `--plugin-dir .`와 `--plugin-dir ./builtin`이 Claude Code 내장 플러그인용 생성 타입 파일을 `builtin` 폴더에 쓰던 문제 수정
- 정확한 토큰 수를 얻을 수 없을 때 컨텍스트 사용량 추정이 도구 정의를 과다 계산하던 문제 수정
- 웹과 모바일의 Remote Control에서 `/compact`가 두 번 표시되던 문제 수정
- 플러그인 자동 업데이트와 `/plugin` 마켓플레이스 업데이트가 레포의 worktree·폴더마다 플러그인을 다시 내려받던 문제 수정
- Claude가 답하기 전에 대화가 압축되면 auto 모드에서 턴을 시작한 백그라운드 서브에이전트의 보고가 사라지던 문제 수정
- `git stash` 등으로 폴더가 세션 중 삭제됐다 돌아왔을 때 프로젝트 스킬·커맨드·에이전트가 계속 누락되던 문제 수정(worktree 진입 이후 포함)
- `claude -p`가 백그라운드 명령은 10분 뒤 중단되는데도 Claude에게 30분이라고 안내하던 문제 수정
- 클라우드 세션에서 `pkill`·`pgrep`·`pidwait`이 세션 자신의 부모 프로세스와 일치하던 문제 수정
- 연결을 지연시키는 프록시 뒤에서 부모 종료 후에도 Claude in Chrome과 computer use 서버 프로세스가 살아 있던 문제 수정
- 큰 훅 출력이 같은 도구 호출의 다른 훅 출력을 담은 파일을 Claude에게 가리키던 문제 수정
- Claude Code를 내장한 앱에서 두 훅이 모두 ask일 때 다른 훅이 아니라 자신의 PreToolUse 훅 `ask` 사유를 받던 문제 수정
- 다른 훅의 `defer`가 먼저 끝났으나 따를 수 없을 때 PreToolUse 훅의 `ask`가 사라지던 문제 수정
- 권한 확인 창과 백그라운드 작업에서 드물게 발생하던 크래시 수정
- SDK·데스크톱 세션에서 Claude가 worktree에 들어간 뒤 프로젝트 스킬·커맨드·에이전트가 메뉴에서 사라지던 문제 수정
- macOS에서 Claude Desktop이 `~/Applications`에 있을 때 `/desktop`이 설치되지 않았다고 말하던 문제 수정
- 미리 시작된 프로세스에서 시작하는 Claude Desktop 세션에 OpenTelemetry 레포 속성(`vcs.*`)이 빠지던 문제 수정
- 페이지를 읽는 모델이 텍스트를 반환하지 않을 때 WebFetch가 "No response from model"을 페이지 내용으로 Claude에 전달하던 문제 수정. 이제 명확한 오류로 실패한다
- Claude Code 시작 중 시스템 시계가 뒤로 이동하면 스크린 리더 모드가 시작 시 프롬프트를 지연시키던 문제 수정
- 다이얼로그가 닫힌 뒤 커맨드 패널이 돌아오지 않아 다음 다시 그리기까지 화면에 패널·프롬프트가 없던 문제 수정
- 데스크톱 앱에 같은 이름의 MCP 서버나 확장이 있을 때 Claude Desktop Code 탭 세션에서 첫 메시지 후 프로젝트 MCP 서버 연결이 끊기던 문제 수정
- 응답 도중 연결이 끊기면 턴이 "API Error: EPROTO: The TLS handshake failed"로 끝나던 문제 수정. 2.1.302 이전처럼 부분 응답을 유지하거나 요청을 재시도한다
- 큰 파일에서 한 줄씩 반복해 읽는 긴 세션의 높은 메모리 사용 수정
- fast 서빙이 rate limit·과부하·실패 상태일 때 fast mode가 응답을 잃거나 모델을 바꾸거나 수 분간 재시도하던 문제 수정. 이제 같은 모델의 표준 속도를 먼저 시도한다
- 여러 보고가 대기 중일 때 Claude를 멈춘 뒤 한 요청에 의도보다 훨씬 많은 백그라운드 에이전트 보고가 실리던 문제 수정
- Claude가 작업 중일 때 입력하면 Claude Desktop Code 탭 세션에서 다른 세션으로 보내는 메시지가 일시정지 상태로 남던 문제 수정
- `--verbose` 같은 플래그가 함께 있을 때 `agents` 앞에 쓴 `--permission-mode`·`--dangerously-skip-permissions`·`--model`·`--effort`·`--agent`를 `claude agents`가 무시하던 문제 수정
- 데스크톱 앱이 잠시 로그인 토큰을 넘기지 못해, 연결이 살아 있는데도 Remote Control이 "login expired"로 꺼진 것처럼 표시되던 경우 수정
- "Queue for later"로 보낸 Remote Control 메시지가 실행 중인 턴 도중 Claude에 도달하던 문제 수정
- 세션 시작 시 git status가 실패하면 Claude에게 깨끗한 상태로 전달되던 문제 수정. 이제 "unavailable"로 전달된다
- 세션 시작 시 git status가 변경이 staged되지 않은 첫 파일을 staged로 표시하던 문제 수정
- 클라우드 세션의 커넥터가 매우 긴 이름의 리소스를 나열할 때 멈추거나 메모리 부족으로 크래시되던 문제 수정
- 세션 기록 업로드 중 연결이 완전히 닫혔는데 Remote Control이 연결됨으로 표시되던 문제 수정
- 에이전트 뷰에서 대화로 돌아올 때 스크린 리더 모드가 꺼지던 문제 수정
- 스크린 리더 모드의 y/n 질문이 질문이 열릴 때 입력된 텍스트 끝의 잘못 들어간 "y"를 yes로 받던 문제 수정
- 호스트가 허용돼 있는데 네트워크 프록시가 연결하지 못했을 때 클라우드 세션이 Claude에게 해당 호스트가 허용되지 않았을 것이라 안내하던 문제 수정
- 재연결되거나 세션 디렉토리가 도구 로딩 중 바뀐 뒤 MCP 서버가 도구 없이 연결됨으로 표시되던 문제 수정
- Claude가 여러 Bash 명령을 동시에 보내고 앞 명령이 폴더를 바꿨을 때 명령이 잘못된 폴더에서 실행되던 문제 수정
- 클라우드·Remote Control 세션에서 Claude가 보내는 파일 업로드가 프록시의 HTTP 507을 받으면 즉시 실패하던 문제 수정. 이제 한 번 더 시도한다
- 기록을 읽는 중 메모리가 부족하면 새 메시지가 저장되지 않고 `claude -p`·SDK·VS Code 세션이 멈추던 문제 수정
- 네트워크의 무언가가 연결은 받되 TLS 핸드셰이크에 응답하지 않을 때 로그인·토큰 갱신·로그아웃이 무한 대기하던 문제 수정
- 이름에 텍스트 방향 문자나 제어 문자가 숨어 있을 때 보낸 파일이 Claude 앱에서 다른 이름으로 보이던 문제 수정. 이제 Claude가 그런 파일 전송을 거부한다
- 모델이 도구 호출로 응답한 뒤에도 서브에이전트 진행 요약이 요청을 끝까지 실행하던 문제 수정
- 경로를 직접 적은 같은 명령은 확인 없이 실행되는데 `grep -r foo "$PWD/src"` 같은 Bash 읽기는 권한을 묻던 문제 수정
- `desktop` 설정에 관리형 MCP 서버의 `oauth.omitResource`처럼 게이트웨이보다 새로운 필드가 있을 때 Claude apps gateway가 시작을 거부하던 문제 수정. 이제 경고하고 그대로 제공한다
- `.zshrc`에서 `KSH_OPTION_PRINT`를 설정한 zsh 사용자의 Bash 명령 결과가 비어 오던 문제 수정
- macOS: 유효한 MDM 프로필 읽기가 느릴 때 시작 시 "Unable to read managed policy settings"가 뜨던 문제 수정. 읽기를 한 번 재시도하고, 타임아웃은 이제 타임아웃으로 보고한다
- 입력이 없는 상태로 업데이트 재시작될 때 에이전트 뷰가 다른 에이전트 뷰의 저장된 입력 텍스트를 지우던 문제 수정
- `UserPromptSubmit` 훅이 재생된 권한 응답을 차단하면 재시작 후 원격 세션이 응답하지 않던 문제 수정. 이 재생에서는 해당 훅이 더 이상 실행되지 않는다
- 터미널 입력이 끝났을 때 `claude remote-control`이 첫 실행 질문에서 Enter 없이 입력된 `y`를 받아들이던 문제 수정
- 정책에 `code:` 규칙이 없는 Claude apps gateway 뒤에서 Claude Desktop이 사용 한도 경고를 표시하지 않던 문제 수정
- 일부 플러그인을 쓰는 전체 화면 세션에서 짧아진 도구 결과가 화면 위로 스크롤되면 오류로 종료되던 문제 수정
- 모델이 도구 호출로 응답할 때 프롬프트 제안이 추가 API 요청을 보내던 문제 수정
- stdio·HTTP MCP 서버의 `PreToolUse` `mcp_tool` 훅 응답이 16MiB를 넘으면 건너뛰던 문제 수정. 이제 도구 호출을 거부한다
- 일부 폰트에서 빈칸으로 그려지는 Bamum 문자가 포함된 스킬·커맨드 이름 수정. 이제 거부된다
- Linux에서 NFS export가 가득 차거나 NFS 쿼터를 다 써서 기록 줄이 손실될 때 `claude -p`가 조용히 exit 0으로 끝나던 문제 수정. 이제 오류를 출력하고 text·json 출력에서 exit 1로 끝난다
- 아무도 Stop을 누르지 않았는데 서비스가 클라우드 세션을 중단하면 백그라운드 에이전트가 사용자가 중지한 것으로 보고되고 재개가 거부되던 문제 수정
- 권한 확인 창이 열린 동안 노트북이 바뀌는 등 편집이 실패했을 때 NotebookEdit가 훅과 텔레메트리에 성공으로 보고하던 문제 수정
- 저장된 MCP 로그인 기록이 null일 때 시작 시 빈 화면이나 무응답, 빈 `claude mcp list` 출력이 나오던 문제 수정
- 아티팩트의 데이터베이스 컬렉션이 정렬하기에 너무 클 때 Artifact 도구가 Claude에게 필터를 추가하라고 안내하던 문제 수정. 이제 페이지 단위로 읽고 결과를 정렬하라고 안내한다
- Claude의 첫 응답 전에 재시작되면 재시작된 클라우드 세션이 큰 이미지가 담긴 메시지를 누락하던 문제 수정
- 재시작된 클라우드 세션이 서브에이전트가 메인 대화로 보낸 메시지에 응답하지 않던 문제 수정
- 실행 중인 워크플로를 중지하거나 일시정지해도 Claude가 알지 못하던 문제 수정. 더 이상 워크플로가 실행 중이라고 말하지 않는다
- `/model` 피커 개선: "More models"가 다른 모든 줄 아래의 번호 없는 줄이 되었고, 이전 모델은 나머지 번호를 바꾸지 않고 그 아래에서 열린다
- Gateway: 바쁜 레플리카의 사용 한도 개선. 건너뛰는 검사가 줄고 사용량이 더 빨리 기록된다
- Claude Code와 `/device` 페이지의 Claude apps gateway 로그인 한도 메시지 개선: 게이트웨이 설정 이름을 더 이상 노출하지 않는다(게이트웨이 자체 로그에는 여전히 표시)
- `claude install`과 설치 스크립트 개선: 2~4초 빨리 끝난다
- 프로세스가 크래시된 Remote Control 세션이 새 메시지를 받기까지의 시간 개선
- Windows: helper 프로세스를 띄우지 않고 PATH에서 프로그램을 찾아 시작 및 첫 명령 시간 개선
- 헤드리스 세션, 데스크톱 앱, VS Code의 auto 모드 개선: 함께 대기하는 백그라운드 서브에이전트 보고를 터미널처럼 한 번의 모델 호출로 응답한다
- worktree를 설정하지 못한 `claude --bg --worktree` 세션의 에이전트 뷰 행 개선: 내부 태그나 마지막 200자가 아니라 처음부터 오류를 표시한다
- 아티팩트가 다른 조직에 있을 때의 메시지 개선: 사용자의 조직일 때만 `/login`을 제안하고, 계정 이동 후 사본이 어디 있을 수 있는지 안내한다
- 한 요청에 담을 수 있는 것보다 이미지가 많은 세션 개선: 누락된 이미지를 이미 봤는지 Claude에게 알리고, 변경 없는 이미지의 반복 읽기를 제한한다
- 응답하지 않은 첫 실행 질문에 대한 `claude remote-control` 메시지 개선: 각 메시지가 다음에 할 일을 알려준다
- 신뢰할 수 있는 TLS 인증서를 더 빨리 로드해 시작 시간 개선
- Claude apps gateway 오류 메시지 개선: 사용자명·비밀번호 없이 게이트웨이 주소만 표시한다
- Claude apps gateway 사용 한도 오류 개선: 리셋 시각을 "resets 4pm (America/Los_Angeles)"처럼 현지 시간으로 표시한다
- Windows: 표준 Git for Windows 설치에서 매 실행마다 어떤 git.exe를 쓸지 확인하지 않아 시작 시간 개선
- 세션 피드백 메시지와 `allowedProviders` 설정 설명에 Pro·Max와 함께 Ultra를 명시하고, `forceLoginMethod` 설명이 모든 유료 Claude 플랜을 포괄하도록 업데이트
- 번들 dataviz 스킬이 각자 한도가 있는 여러 비율에 대해 항목당 한 줄의 미터 목록을 제안하도록 업데이트
- "Upgrade to Max" 옵션 문구를 "Upgrade to Max or Ultra"로 업데이트
- Claude가 작성한 mods가 관리형 `allowUnsandboxedCommands: false`나 `allowManagedDomainsOnly`가 있어도 auto·bypass 모드에서 묻지 않고 켜지고, `dontAsk` 모드에서는 로드되지 않도록 변경
- mods 자체의 도구 호출(`$.tool.call`, `$.mcp.call`)이 사용자의 ask 규칙이나 `dontAsk`·`-p` 실행에서도 권한 확인을 띄우지 않도록 변경. deny 규칙과 조직 정책은 계속 적용된다
- 저장된 Fable 5.1 모델 선택을 `fable`로 옮기도록 변경: Pro·Max 플랜은 즉시, Team·Enterprise 플랜은 조직이 허용하면 적용된다. 되돌리려면 `/model claude-fable-5-1`을 쓴다
- `/fast`·`/config`·`/model`의 fast mode 라벨이 현재 모델이 fast mode를 지원하면 그 모델 이름을 표시하도록 변경하고, VS Code 행에서 "(Opus only)"를 제거
- 중첩 스킬 로딩 변경: Claude가 `~/.claude/plugins` 안의 파일을 작업할 때 그 안의 `.claude/skills` 폴더를 더 이상 로드하지 않는다
- Self-hosted runner: 필요 없다는 이유(세션 종료·일시정지, 작업 지시 대체)로 서버가 거부한 온디맨드 러너가 1 대신 0으로 종료하도록 변경
- Windows: Claude Code가 git처럼 직접 시작하는 프로그램을 찾을 때 상대 경로·UNC PATH 항목과 네트워크 공유로의 링크를 건너뛰고, 설정의 PATH 변경을 반영하도록 변경
- 비대화형 세션의 OpenTelemetry 훅 이벤트가 Bash·PowerShell 호출 후 `num_hooks`·`num_success`에서 내장 훅 두 개를 제외하도록 변경
- Claude Desktop Code 탭 세션이 사용자 입력을 다시 기다리기 전까지 다른 세션으로 보낼 수 있는 메시지 수를 10개에서 20개로 변경
- `claude -p`와 SDK 세션의 `AskUserQuestion`이 문서화되지 않은 `afkTimeoutMs` 입력 필드를 설정한 호스트의 권한 응답을 거부하도록 변경
- 관리형 `extraKnownMarketplaces` 변경: 선언된 이름을 다른 소스에서 추가할 수 없고, 다른 곳의 항목은 숨겨지며, 선언된 마켓플레이스가 나열하는 플러그인은 그곳에서 재설치된다
- Claude 데스크톱 앱의 Code 탭처럼 Claude Code를 실행하는 앱이 제공하는 Claude in Chrome 도구가 조직의 Claude in Chrome 정책을 따르도록 변경
- Claude apps gateway의 `policy_mode: layered` 변경: 관리형 MCP 서버가 `match: {}`를 포함한 모든 일치 정책에서 합산되므로, 이미 이 모드를 쓰는 게이트웨이는 업그레이드 후 더 많은 서버를 제공한다
- Gateway: Bedrock·Vertex·Foundry 업스트림이 게이트웨이 환경의 `ANTHROPIC_*_BASE_URL` 변수를 무시하도록 변경. 다른 엔드포인트를 쓰려면 업스트림에 `base_url`을 설정한다
- 헤드리스 세션이 `.claude/skills`의 mods 파일이 바뀌면 다시 로드하도록 변경. 끄려면 `CLAUDE_CODE_PLUGIN_DIR_WATCH=0`을 설정한다
- 사이버 안전장치 차단 시 Cyber Verification Program 문장을 claude.ai와 같은 문구로 변경
- Cowork 클라우드 세션 변경: PostToolUse 훅이 더 이상 AskUserQuestion 응답이나 ExitPlanMode 결과의 계획을 바꿀 수 없다. Claude는 원본을 읽는다
- `/bin/cp`처럼 경로로 쓴 `cp`·`mv`가 `cp`·`mv`와 같은 경로 검사를 받도록 변경
- 백그라운드 명령 알림과 TaskStop 결과가 1,000자를 넘는 명령은 앞부분과 끝부분만 Claude에게 보여주도록 변경해 컨텍스트를 절약
- 아티팩트 디자인 가이드가 Inter와 Space Grotesk를 좋은 기본 서체로 취급하도록 변경
- 계정 이메일 검사가 이메일을 포함하고 User-Agent를 지정한 셸 명령만 묻지 않고 거부하도록 변경. 다른 명령과 예약 실행이 더 이상 확인 창에서 멈추지 않는다
- Remote Control 세션이 시작한 폴더를 유지하도록 변경: 연결된 클라이언트가 더 이상 세션을 다른 폴더로 옮길 수 없다
- 선언되지 않은 소스로부터의 관리형 `extraKnownMarketplaces` 인계 변경: 저장 데이터는 `cleanupPeriodDays` 동안 따로 보관되고, 옵션과 시크릿은 `claude plugin restore-set-aside` 전까지 보관된다
- [VSCode] auth token과 API key가 함께 설정돼 있으면 터미널 시작 경고처럼 입력창 위에 경고를 표시하도록 추가
- [VSCode] 플러그인 권한 요청이 숨은 문자가 섞인 이름을 표시하던 문제 수정. 이제 "a plugin"으로 표시된다

---

## 🎯 챌린지

이번 버전에서 내 환경에 적용해볼 만한 항목입니다.

### 1. Fable 모델별 effort 설정을 5.2로 옮기기
- **파일**: `~/.claude/settings.json`
- **근거**: 이번 버전에서 Fable 5.2가 기본 Fable 모델이 되고, 저장해 둔 Fable 5.1 선택은 `fable`로 옮겨진다. 지금 설정은 `modelSettings`에 `claude-fable-5-1`만 `effortLevel: "high"`로 지정한다. 따라서 Fable 5.2로 바뀐 세션에는 이 설정이 적용되지 않을 수 있다. 같은 값을 `claude-fable-5-2` 키에도 넣어 effort 설정이 이어지게 한다. 5.2 가격은 Mtok당 $8/$40이니 비용도 함께 점검한다.
- **난이도**: ★☆☆ (약 5분)

### 2. `deploy-guard.sh`가 우회 경로까지 막는지 점검
- **파일**: `~/.claude/hooks/deploy-guard.sh`
- **근거**: 이번 버전은 `/bin/cp`처럼 전체 경로로 쓴 명령이 권한 검사를 빠져나가던 구멍을 막았다. 같은 원리로 내 훅이 아래 형태의 push도 잡는지 확인한다.
  - `/usr/bin/git push origin feat/x`
  - `git -C <dir> push origin feat/x`
  - `git push origin HEAD:feat/x`
  
  빠지는 형태가 있으면 매칭 패턴을 보강한다. "feat/* 원격 push 금지" 규칙을 지키는 유일한 장치라서 빈틈을 남기면 안 된다.
- **난이도**: ★★☆ (약 15분)

### 3. 체인지로그 동기화의 `claude -p` 종료 코드 검사
- **파일**: `~/.claude/skills/claude-changelog-sync/` 안의 실행 스크립트(정확한 파일명 확인 필요)
- **근거**: 이번 버전부터 `claude -p`는 기록 손실·메모리 부족 같은 실패 때 exit 0 대신 exit 1을 낸다. 매일 08:00 cron으로 도는 동기화가 실패해도 빈 MD 파일이 그대로 저장되지 않도록 한다. 0이 아닌 종료 코드이거나 출력이 비었으면 파일을 쓰지 않고 로그만 남기게 바꾼다.
- **난이도**: ★★☆ (약 15분)
