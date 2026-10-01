# Claude Code v2.1.286

> 작성일: 2026-10-02

---

# 📋 요약본

## 🎉 신기능 (7건)
- **권한 요청 개수 표시** — 권한 요청이 여러 개 쌓이면 프롬프트에 "2 of 5" 같은 순번이 붙는다. 남은 요청 수를 바로 알 수 있다.
- **"N more" 행 마우스 지원** — fullscreen 모드에서 목록의 "N more" 행을 클릭하면 목록 끝으로 이동한다. hover·pressed 상태도 표시된다.
- **[VSCode] 북마크** — Claude 응답을 저장하고 Bookmarks 사이드 패널에 띄워 둔다.
- **[VSCode] 질문·답변 기록** — 질문 카드에 답하면 대화에 Questions 행이 생기고, 질문마다 고른 답이 남는다.
- **[VSCode] 질문 카드 옵션 미리보기** — 선택한 항목의 mockup이나 snippet이 옵션 옆이나 아래에 보인다.
- **[VSCode] 메시지 첨부 맥락 행** — 메시지와 함께 보낸 터미널 출력, 브라우저 탭, 브라우저 지시, 선택 코드를 메시지 아래 행에서 열어 볼 수 있다.
- **[Claude Tag] 채널 지출 한도 추가 버튼** — admin 설정에서 channel ID나 Slack 링크로 private 채널을 포함한 아무 채널에나 지출 한도를 건다.

## 🛠️ 개선/수정 (14건)
- **세션 복구 안정화** — 이전 세션이 크래시했거나 강제 종료됐을 때 `--resume`/`--continue`가 병렬 tool call 이후 턴을 전부 잃던 문제를 고쳤다.
- **모델 거부·fallback 처리** — API가 기본 모델을 거부하면 같은 등급의 이전 모델로 한 번 재시도한다. fast 불가 fallback은 standard 속도로 실행한다. 1M→200K 컨텍스트 축소도 안내한다.
- **API 재시도 한도 통합** — 재시도 한도가 모델 호출 1회 전체에 적용된다. 기본값 기준 실패한 호출은 최대 14회까지만 요청한다.
- **`--bare` 동작 변경** — 명령줄에 지정한 MCP 서버만 연결하고, system reminder를 보내지 않고, 백그라운드 작업을 시작하지 않는다. timeout에 도달한 shell 명령은 백그라운드로 넘기지 않고 멈춘다.
- **비텍스트 tool/hook 결과로 인한 400 에러 수정** — tool이나 hook이 object·number·boolean을 반환해도 에러가 나지 않는다. 재개한 세션도 포함이다.
- **비밀값 마스킹 강화** — Bearer/Basic 토큰, percent-encoded 토큰, zero-width 문자가 낀 키 이름, 특수문자가 들어간 URL 비밀번호를 끝까지 가린다. `/feedback` zip 안의 JSON이 깨지던 문제도 고쳤다.
- **인증·로그인 정리** — 여러 프로세스가 각자 로그인 브라우저를 여는 문제, macOS에서 로그인 후에도 "Not logged in"이 남는 문제를 고쳤다. `claude auth status`와 `/status`의 표시도 바로잡았다.
- **MCP 안정화** — 예전 handshake를 버린 서버의 tool 목록 누락, 로그인 링크 덮어쓰기, 재인증 후 반복되는 안내, `/usage` 집계 누락을 고쳤다.
- **subagent·Workflow 수정** — 메시지 중복 표시, raw task id 노출, task 추적 tool 누락, worktree에서 CLAUDE.md 이중 로드, 연결이 멈추면 Workflow subagent가 처음부터 다시 시작되던 문제를 고쳤다.
- **다른 대화 보기 중 명령 오작동 방지** — 백그라운드 agent나 teammate의 transcript를 보는 중에 `/compact`·`/clear`·`/rewind`를 입력하면 대상을 밝히는 확인창이 먼저 뜬다.
- **commit 가이드 개선** — `verify`라는 이름의 skill이 있으면 Claude가 commit 직전에 실행한다. docs 전용·tests 전용 commit은 제외한다.
- **권한 프롬프트·목록 UI 통일** — 권한 프롬프트 디자인을 file edit 프롬프트에 맞췄다. 목록 열 정렬, 스크롤바 화살표, `↑ N more` 표기를 정리했다. `/hooks`는 event별 목록 하나로 열린다.
- **Remote Control·클라우드 세션 수정** — 정책으로 꺼지면 연결이 끊긴다. 첨부 파일 실패를 Claude에 알리고, 종료 중 받은 메시지는 큐에 남긴다. 대용량 기록 세션이 깨어나지 않던 문제, routine 실패가 성공으로 표시되던 문제를 고쳤다.
- **plugin 보안·오류 안내** — npm git·폴더 source를 거부하고, 의존성은 registry 패키지에서만 설치한다. 로드를 거부한 marketplace는 이유와 해결 방법을 알려 준다.

## 🔑 이번 버전의 핵심 키워드
**"복구·재시도·마스킹의 신뢰성 강화"** — 세션 복구, 모델 fallback, 비밀값 가리기를 대거 손보고 UI 일관성을 맞춘 안정화 릴리스다.

---

# 📜 원문 (한글 번역본)

> 원문 ChangeLog를 원래 순서 그대로 한 줄도 빠짐없이 번역한 문서입니다.

- 권한 요청이 여러 개 쌓이면 권한 프롬프트에 "2 of 5" 같은 개수를 표시한다
- fullscreen 모드에서 목록의 "N more" 행에 마우스 지원을 추가했다: 클릭하면 목록의 그쪽 끝으로 이동하고, hover·pressed 상태를 표시한다
- `gcpAuthRefresh`나 `awsAuthRefresh` 자격 증명이 만료됐을 때 여러 Claude Code 프로세스와 IDE 확장이 각자 로그인 브라우저를 열던 문제를 수정했다
- 이전 세션이 크래시했거나 강제 종료됐을 때 `claude --resume`과 `--continue`가 병렬 tool call 묶음 이후의 턴을 전부 잃던 문제를 수정했다
- tool이나 hook이 텍스트 대신 object·number·boolean을 반환한 뒤 API 400 에러가 나던 문제를 수정했다. 재개한 세션도 포함이다
- 기록이 매우 큰 클라우드 세션이 transcript를 로딩하는 중에 컨테이너가 멈춰 끝내 깨어나지 않던 문제를 수정했다
- Claude apps gateway의 spend meter가 1시간 prompt cache 쓰기를 더 싼 5분 요금으로 계산하던 문제, 그리고 web search 같은 server-side tool을 실행하는 streamed 턴에서 첫 모델 호출의 input token만 세던 문제를 수정했다
- 남아 있는 `~/.claude/.credentials.json`이 있을 때, 다른 Claude Code 창에서 `/login`에 성공한 뒤에도 macOS 세션에 "Not logged in"이나 "Login expired"가 계속 표시되던 문제를 수정했다
- 기본 모델이나 model alias가 가리키는 모델을 Anthropic API가 거부하면 모든 턴이 실패하던 문제를 수정했다: 이제 같은 등급의 이전 모델로 한 번 재시도한다
- 조직 정책이 Remote Control을 끈 뒤에도 Remote Control 세션(`claude remote-control` 포함)이 연결 상태로 남던 문제를 수정했다. 이제 안내와 함께 연결이 끊긴다
- fallback 모델이 fast로 실행될 수 없을 때 refusal 및 `--fallback-model` 재시도가 실패하던 문제를 수정했다. 이제 standard 속도로 실행하고, interactive 세션에서는 안내를 한 번 띄운다
- MCP discovery cache가 켜져 있을 때 재인증에 성공한 뒤에도 headless 세션이 "MCP servers require authentication" 안내를 반복하던 문제를 수정했다
- `claude auth status`가 Console 로그인으로 저장된 API key를 `claude.ai`로 보고하던 문제를 수정했다. 이제 `api_key`로 보고하고, VS Code 확장은 그 세션을 API key 세션으로 다룬다
- `/status`가 API key 옆에 Anthropic profile을 둘 다 적용 중인 것처럼 표시하던 문제를 수정했다. 이제 profile은 사용 안 함으로 표시된다
- Remote Control로 보낸 메시지에 첨부한 파일이 도착하지 않았을 때 Claude에 알리지 않던 문제, 그리고 파일의 마지막 다운로드 시도에 10초만 주어지던 경우가 있던 문제를 수정했다
- Claude Code가 종료되는 중에 도착한 Remote Control 메시지가 전달됨으로 표시된 뒤 끝내 답을 받지 못하던 문제를 수정했다. 이제 세션의 다음 실행까지 큐에 남는다
- 키 이름 앞에 "Bearer"나 "Basic"이 오면 MCP 에러 메시지에 자격 증명 값이 노출되던 문제를 수정했다
- percent-encoded Bearer token이 에러 메시지에서 일부만 가려지던 문제를 수정했다
- 키 이름에 zero-width space 같은 보이지 않는 문자가 들어 있으면 redact된 로그와 transcript에 비밀값이 보이던 문제를 수정했다
- URL 비밀번호에 `)`, 따옴표, `]`, `&`, 두 번째 `@` 같은 구두점이 있거나, ssh URL에서 `/`를 지나 `[::1]` 같은 괄호 host까지 이어지면 로그와 transcript에 비밀번호 일부가 보이던 문제를 수정했다
- `/feedback`이 디스크에 저장하는 zip 안의 세션 transcript가 비밀값 redaction 후 잘못된 JSON 줄을 담던 문제를 수정했다
- 서버가 예전 MCP handshake를 지원하지 않게 된 뒤 MCP connector가 최대 하루 동안 tool을 하나도 표시하지 않던 문제를 수정했다
- Claude가 MCP 로그인을 다시 요청하면 대기 중인 로그인 링크가 바뀌어 그 링크가 작동하지 않을 수 있던 문제를 수정했다
- 재시작 직후처럼 MCP 서버가 아직 연결 중이거나 막 연결됐을 때 실행한 tool call을 `/usage`가 그 서버 몫으로 집계하지 않던 문제를 수정했다
- 일시적인 서버 에러 뒤에 claude.ai에서 켠 plugin이 한 세션 동안 Claude Code에서 가끔 사라지던 문제를 수정했다
- 실행 중인 subagent에 입력한 메시지가 subagent가 읽은 뒤 transcript에 두 번 보이던 문제를 수정했다
- 등록된 이름이 없는 subagent의 hand-back 메시지에 agent 이름 대신 raw task id가 보이던 문제를 수정했다
- task 추적 tool(TaskCreate/Get/Update/List, TodoWrite)이 켜진 세션에서 foreground subagent에 이 tool들이 가끔 빠져 있던 문제를 수정했다
- worktree isolation으로 생성한 subagent가 첫 파일 읽기 때 worktree 사본에서 프로젝트 CLAUDE.md와 그 import를 한 번 더 로드하던 문제를 수정했다
- 응답 도중 연결이 몇 분간 멈추면 Workflow tool subagent가 원래 prompt부터 다시 시작되던 문제를 수정했다
- 백그라운드 agent나 teammate의 transcript를 보는 중에 입력한 `/compact`, `/clear`, `/rewind`가 조용히 메인 대화에 적용되던 문제를 수정했다: 이제 대상을 밝히는 확인창이 먼저 뜬다
- 승인을 기다리는 백그라운드 작업이 완료로 표시되던 문제를 수정했다
- 모델 fallback이 한 턴만 지속될 때 commit attribution 안내가 tool 출력 안에 다시 보내지던 문제를 수정했다
- fullscreen 모드에서 접힌 행("Thought for 4s" 등)의 단어 사이 빈칸을 클릭하면 펼쳐지지 않고 강조만 되던 문제를 수정했다
- 목록 화면에서 이름이 긴 action 행처럼 세부 정보가 없는 행이 다른 모든 행의 세부 정보를 오른쪽으로 밀던 문제를 수정했다
- 이름이 매우 긴 파일을 클라우드 세션에 첨부하면 전달되지 않던 문제를 수정했다
- Claude Code가 로드를 거부하는 marketplace의 plugin 에러를 수정했다: "not found" 대신 이유와 해결 방법을 알려 준다
- `/plugin`의 Discover 탭에서, 목록 행은 marketplace 이름을 따옴표로 감싸는데 "Checking … for new plugins" 줄에서는 따옴표 없이 표시하던 문제를 수정했다
- commit 가이드를 개선했다: 프로젝트나 사용자 skill 중 `verify`라는 이름이 있으면 Claude가 commit 직전에 그것을 실행하도록 안내받는다. docs 전용·tests 전용 commit은 제외한다
- subagent 화면의 send now(ctrl+enter)를 개선했다: subagent의 실행 중인 명령을 백그라운드로 옮겨 메시지를 바로 읽게 한다
- 백그라운드 agent가 내 메시지에 답할 때 내가 한 말을 따로 요약하며 시작하지 않도록 개선했다
- claude.ai artifact 링크 읽기를 개선했다: WebFetch가 Artifact tool의 읽기와 같은 질문을 한다(세션의 네트워크 접근이 켜져 있으면 artifact 프롬프트 없음, 꺼져 있으면 artifact마다 한 번). 사용자만 답할 수 있는 곳에서는 auto-mode의 yes를 인정하지 않는다
- fetch, skill, file read, sandbox network, Claude in Chrome, workflow script, notebook edit 권한 프롬프트를 file edit 프롬프트와 같은 모양으로 개선했다
- Bash, PowerShell, Monitor 권한 프롬프트가 명령을 점선 사이에 보여 주도록 개선해 file edit 프롬프트와 맞췄다
- fullscreen 모드의 목록 스크롤바를 개선했다: 대부분의 목록에서 "N more" 행이 생기고 사라져도 bar가 움직이지 않고, 클릭하거나 누르고 있으면 스크롤되는 ↑/↓ 화살표가 생겼다
- 외부 에디터(Ctrl+G)를 개선했다: 줄 번호를 받는 에디터는 prompt에서 커서가 있는 줄로 열린다
- skill이나 plugin 명령이 많이 설치돼 있을 때 입력 중 slash command 제안의 반응 속도를 개선했다. 명령 설명은 단어 접두어로 매칭된다
- output style 선택기를 개선했다: Default 대신 현재 style에서 열리고, 각 style 이름 아래 줄에 설명이 보인다. 숫자 키로는 더 이상 style을 고르지 않는다
- `/hooks`를 개선했다: hook 상세 화면의 마지막 줄이 "it" 대신 "this hook"이라고 쓴다
- 모델 fallback 안내와 autocompact-thrashing 에러가, fallback으로 컨텍스트 창이 1M에서 200K token으로 줄었을 때 그 사실을 알리도록 개선했다
- host가 이미 연결된 MCP 서버의 enable을 다시 보낼 때 SDK와 `-p` 세션의 반응 속도를 개선했다
- Claude apps gateway가 `/protocol`에서 제공하는 protocol 페이지를 개선했다: 알 수 없는 입력을 거부하지 말라고 적고, 현재 Claude Code가 보내는 내용과 맞췄다
- 아무것도 실행 중이거나 대기 중이지 않을 때 보낸 prompt가 회색 대신 바로 일반 텍스트 색으로 보이도록 변경했다
- 실패한 API 요청의 재시도 방식을 변경했다: 하나의 한도가 모델 호출 전체에 적용되므로, 기본 재시도 설정에서 실패하는 호출은 최대 14회까지만 요청한다
- `--bare`가 명령줄에 지정한 MCP 서버만 연결하고, 모델에 system reminder를 보내지 않고, 백그라운드 작업을 시작하지 않도록 변경했다. `--bare`에서는 timeout에 도달한 shell 명령이 백그라운드로 넘어가지 않고 멈춘다
- send-now 키(ctrl+enter)가 skill 자체의 shell 명령을 끝내지 않고 백그라운드로 옮기도록 변경했다
- 속도 제한에 걸린 도메인 안전 검사에 대한 WebFetch 에러가 Claude에게 반복 재시도하지 말라고 알리도록 변경했다
- plugin 설치가 git 저장소나 폴더인 npm source를 거부하고, plugin 의존성은 registry 패키지에서만 설치하도록 변경했다
- 목록 화면(`/artifacts`, `/mcp`, `/skills`, `/hooks` 등)이 각 행의 세부 정보를 이름 뒤 한 열에 항상 맞추도록 변경했다
- 목록의 넘침 행 표기를 "N more above" / "N more below"에서 "↑ N more" / "↓ N more"로 변경했다
- `/hooks`가 설정된 hook을 event별로 묶은 목록 하나로 열리도록 변경했다. hook을 보는 데 Enter 세 번 대신 한 번이면 된다
- 테마 선택기를 미리보기를 화면 밖으로 밀어내지 않고 터미널에 맞는 스크롤 목록으로 변경했다. 숫자 키로는 더 이상 테마를 고르지 않는다
- `/exit`의 Remove worktree가 Claude Code가 그곳에서 띄운 서버와 shell을 멈춘 뒤 실행되도록 변경했다. Windows에서는 이것들 때문에 폴더가 삭제되지 않을 수 있었다
- `claude-api` skill의 Managed Agents 예제가 네트워크가 제한된 environment를 만들도록 변경했다
- `/ultrareview`와 `claude ultrareview` 출력에서 브라우저 링크를 제거했다
- Windows: `claude`가 이미 신뢰하는 폴더인데 신뢰 기록의 대소문자가 다르게 저장됐다는 이유로 `claude --bg`와 agents 화면이 그 폴더를 거부하던 문제를 수정했다
- [VSCode] 북마크를 추가했다: Claude의 응답을 저장하고 Bookmarks 사이드 패널에 띄워 둔다
- [VSCode] Claude가 한 질문과 내 답을 대화에 추가했다: 질문 카드에 답하면 Questions 행에 질문마다 고른 답이 보인다
- [VSCode] 채팅 패널의 질문 카드에 옵션 미리보기를 추가했다: 강조된 선택지의 mockup이나 snippet이 옵션 옆이나 아래에 보인다
- [VSCode] 메시지 아래에 함께 보낸 터미널 출력, 브라우저 탭, 브라우저 지시, 선택 코드를 여는 행을 추가했다
- [VSCode] 사이드 바에 이미 열린 대화를 탭에 하나 더 열던 문제를 수정했다. 이제 사이드 바가 그 대화로 전환된다
- [VSCode] Claude Code가 1 MB 넘게 출력하면 설정 창이 다시 확인하지 않고 저장 실패로 보고하던 문제를 수정했다
- [VSCode] 확장이 응답하지 않을 때 "Teleporting session…" 스피너가 끝없이 돌던 문제를 수정했다
- [VSCode] Manage plugins 창을 개선했다: 끈 plugin이 다른 설정 때문에 여전히 켜져 있으면 알려 주고, plugin 폴더 충돌을 설명한다
- [VSCode] Stop과 Escape가 현재 턴만 끝내도록 변경했다. 백그라운드 agent는 계속 실행되며 agent map에서 하나씩 멈출 수 있다
- [VSCode] "✻ Claude Code" 상태 바 항목이 모든 창에 보이도록 변경했다. 파일이 열려 있지 않아도 Claude를 열 수 있다
- [Cloud sessions] Claude가 메시지를 보낸 뒤 세션이 idle 상태가 되면 답한 질문 카드나 승인한 tool call이 응답을 받지 못하던 문제를 수정했다
- [Cloud sessions] admin 설정에서 조직 environment의 setup script를 지워도 새 클라우드 세션이 예전 script를 계속 실행하던 문제를 수정했다
- [Cloud sessions] self-hosted environments admin 페이지의 Runner 작업 메뉴가 열린 지 몇 초 뒤 저절로 닫히던 문제를 수정했다
- [Cloud sessions] 클라우드 세션이 시작조차 되지 않은 routine 실행이 Runs 패널, routine 페이지, 사이드바에 Succeeded로 보이던 문제를 수정했다. 이제 Failed로 보인다
- [Cloud sessions] 클라우드 세션의 Outputs 카드에서 오디오·비디오 파일을 클릭하면 재생 대신 빈 파일 검색이 열리던 문제를 수정했다
- [Cloud sessions] 예약 실행이 늦어져 아직 시작하지 않았을 때, routine 페이지가 이미 지난 다음 실행 시각 대신 예약 시각과 함께 "Due"로 표시하도록 변경했다
- [Claude Tag] admin 설정의 Claude Tag 지출 한도 페이지에 Add channel 버튼을 추가했다. channel ID나 Slack 링크로 private 채널을 포함한 아무 채널에나 한도를 걸 수 있다
- [Claude Tag] 기본 Sonnet 모델을 쓸 수 없는 조직에서 memory recall이 아무것도 찾지 못하던 문제를 수정했다
- [Claude Tag] Enterprise Grid 관리자가 Slack 채널을 다른 workspace로 옮긴 뒤 첫 게시글이 Claude를 언급하지 않으면 채널의 Claude 설정이 사라지던 문제를 수정했다
- [Claude Tag] Claude가 방금 한 질문에 답했을 때 Slack thread의 Claude가 가끔 새 machine에서 다시 시작해 push하지 않은 작업을 잃던 문제를 수정했다
- [Claude Tag] 큰 조직에서 Claude Tag 지출 한도 페이지의 public 채널 이름이 raw Slack ID로 보이던 문제를 수정했다
- [Claude Tag] Slack에서 시작한 세션의 claude.ai 제목을 개선했다: Slack user ID나 escape code 없이 입력한 말 그대로 보인다

---

## 🎯 챌린지

이번 버전에서 내 환경에 적용해볼 만한 항목입니다.

### 1. commit 전 smoke 검증용 `verify` skill 만들기
- **파일**: `~/.claude/skills/verify/SKILL.md`
- **근거**: 이번 버전부터 `verify`라는 skill이 있으면 Claude가 commit 직전에 자동으로 실행한다. docs·tests 전용 commit은 건너뛴다. CLAUDE.md §7.1의 "일반 등급 = 빌드/lint 통과 + 실행 확인" smoke 기준과 §6의 "commit 전 secret leak·하드코딩 시크릿 확인"을 이 skill에 적어 두면, 사람이 기억하지 않아도 commit할 때마다 같은 순서로 점검한다.
- **난이도**: ★★☆ (약 15분)

### 2. 체인지로그 자동 생성 호출에 `--bare` 적용 검토
- **파일**: `~/.claude/skills/claude-changelog-sync/` 아래에서 `claude -p --model opus`를 호출하는 script
- **근거**: 이번 버전의 `--bare`는 명령줄에 지정한 MCP 서버만 연결하고, system reminder를 보내지 않고, 백그라운드 작업도 시작하지 않는다. 매일 08:00 cron으로 도는 변환 작업에는 figma·lazyweb 같은 MCP 연결이나 확인 게이트·복명복창 같은 대화형 규칙이 필요 없다. 오히려 출력 형식을 깨뜨릴 위험이 있다. `--bare`를 붙이면 생성 속도와 출력 안정성이 함께 좋아진다. 적용 전에 `--bare`에서 현재 인증 방식(OAuth 또는 `ANTHROPIC_API_KEY`)이 그대로 동작하는지 수동 실행 1회로 확인한다.
- **난이도**: ★★☆ (약 15분)
