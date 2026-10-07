# Claude Code v2.1.293

> 작성일: 2026-10-08

---

# 📋 요약본

## 🎉 신기능 (3건)
- **Claude Haiku 5.5 추가** — `claude-haiku-5-5`가 Anthropic API의 기본 Haiku 모델이 된다.
  - 컨텍스트는 1M이다.
  - 가격은 입력 $0.10, 출력 $0.50 (Mtok당)이다. 프롬프트가 100K를 넘으면 $0.50 / $2.50이다.
- **`subagentStatusLine` payload에 `agentType` 추가** — 상태줄 스크립트가 사용자 정의 서브에이전트 종류를 구분해 표시할 수 있다.
- **mod용 `$.tool.register`에 `isDeferred` 추가** — `false`로 두면 tool search 뒤에 숨기지 않는다. 도구 schema를 처음부터 프롬프트에 노출한다.

## 🛠️ 개선/수정 (20건)
- **compaction 직후 작업 혼동 수정** — Claude가 압축 직전 자기 작업을 압축 뒤에 한 일로 여기던 문제를 고쳤다. 끝난 작업을 철회하거나 다시 하지 않는다.
- **HTTP MCP 메모리 누수 수정** — 연결이 닫힐 때까지 보낸 요청을 전부 쥐고 있던 문제를 고쳤다.
- **`←` 백그라운드 전환 관련 버그 4건 수정**
  - 작업 중 보낸 메시지가 사라지던 문제를 고쳤다.
  - 입력창에 보내지 않은 글이 있거나 질문이 대기 중일 때 10초 뒤 전환되던 문제를 고쳤다.
  - 전환 직후 권한 프롬프트에서 Esc나 No를 눌러도 턴이 멈추지 않던 문제를 고쳤다.
  - 메시지를 옮길 수 없으면 전환하지 않고 그 이유를 알린다.
- **`/model` effort 순환 버그 수정** — ←/→가 최고·최저 단계를 넘어 돌아가던 문제를 고쳤다. 이 때문에 Low가 기본 effort로 저장될 수 있었다.
- **도구 비활성 안내 오류 수정**
  - `SendMessage`가 제거된 세션에서 Claude에게 그 도구를 쓰라고 안내하던 문제를 고쳤다.
  - 서브에이전트의 도구 목록에만 빠진 built-in 도구를 세션 전체에서 꺼진 것처럼 안내하던 문제를 고쳤다.
- **Bash로 파일을 볼 때 규칙 로드 수정** — `cat`·`head`·`tail`·`sed -n`·`grep`으로 파일 하나를 봐도 path-scoped rules와 nested CLAUDE.md가 로드된다.
- **로그인 만료 시 강제 로그아웃 수정** — `claude logs`·`stop`·`kill`·`rm`·`claude daemon` 명령에 해당한다.
- **agents 표시 버그 수정**
  - 세션 폴더를 일시적으로 못 읽으면 footer 카운트가 사라지고 목록이 placeholder로 바뀌던 문제를 고쳤다.
  - 이름이 `worker`인 에이전트가 "Agent"로 표시되던 문제를 고쳤다.
- **`/ultrareview` 업로드 버그 2건 수정**
  - Linux에서 중첩된 checkout을 거부하던 문제를 고쳤다.
  - split-index 오류 안내가 위험한 git 명령을 권하던 문제를 고쳤다.
- **Remote Control·클라우드 세션 수정**
  - 긴 세션에서 답변이 스트리밍되지 않고 덩어리로 나오던 문제를 고쳤다.
  - 인증을 복구할 때마다 초기 기록을 다시 업로드하던 문제를 고쳤다.
  - PushNotification 상태가 잘못 표시되던 문제를 고쳤다.
- **plugin·mod 수정**
  - `classic.*` hook이 건너뛰어지던 문제를 고쳤다.
  - `claude plugin test`가 `$.session.append`에서 실패하던 문제를 고쳤다. 새 `mock.session`을 추가했다.
  - `claude plugin eval`이 Docker Desktop이 있는 Mac에서 실행을 거부하던 문제를 고쳤다.
- **`claude agents` bypass 권한 수정** — 동의가 `.claude/settings.local.json`이나 `--settings` 파일에만 있으면 먼저 동의를 받는다. bypass가 무시된 세션은 그 사실을 알린다.
- **붙여넣기 판정 수정** — 붙여넣은 글이 직접 타이핑한 것으로 처리되던 2가지 경우를 고쳤다.
- **`claude purge` 수정** — 지울 수 없는 항목이 있어도 나머지는 지운다. 실패 목록을 보여주고 exit 1로 끝난다.
- **입력·편집기 수정**
  - keybindings.json 검사 결과를 바로잡았다.
  - vim 모드 `>>`·`<<`와 Visual `V`+`d` 후 커서 위치를 고쳤다.
  - `/feedback` 전송 취소 불가 문제를 고쳤다.
- **기타 수정**
  - `/tui`가 Chrome 연결을 끊던 문제를 고쳤다.
  - claude.ai 스킬 설명 변경이 늦게 반영되던 문제를 고쳤다.
  - Artifact 행 표시를 고쳤다.
  - apps gateway 시작 거부를 고쳤다.
  - Windows에서 PID가 재사용되면 다른 프로세스를 종료하던 문제를 고쳤다.
- **되돌림 2건**
  - 2.1.281에서 바꾼 auto mode 거부 메시지를 되돌렸다.
  - 2.1.290의 클라우드 세션 `/loop` 깨우기 수정을 되돌렸다.
- **개선**
  - Team·Enterprise 정책을 더 일찍 불러온다. 응답이 멈추면 3초 뒤 다시 시도한다.
  - Claude in Chrome이 동작을 덜 거부하고, 안내 문구가 더 명확해졌다.
  - Bash diff 안내 문구가 더 정확해졌다.
  - artifacts가 라이브러리 버전을 고정한다.
- **동작 변경**
  - 세션을 쓰지 않을 때 스킬 동기화 주기를 10분에서 40분으로 늘렸다.
  - 이름에 비ASCII 문자가 있으면 ASCII 이름 뒤에 정렬한다.
  - OTel `at_mention` 이벤트 수를 제한한다.
  - self-hosted runner의 polling 간격을 4~6초로 흩뜨린다.
- **[Claude Tag]·[Code Review]** — Slack 연동 수정 4건, 관리자 설정 개선 1건, 변경 2건이 있다. Code Review 저장소 추가 dialog도 개선했다.

## 🔑 이번 버전의 핵심 키워드
**"싸고 큰 Haiku, 덜 새는 세션"** — Haiku 5.5를 기본 Haiku로 바꾸고, compaction·백그라운드 전환·도구 안내에서 작업과 메시지가 꼬이던 문제를 대거 고쳤다.

---

# 📜 원문 (한글 번역본)

> 원문 ChangeLog를 원래 순서 그대로 한 줄도 빠짐없이 번역한 문서입니다.

- Claude Haiku 5.5(`claude-haiku-5-5`)를 추가했다. 이제 Anthropic API의 기본 Haiku 모델이다. 1M 컨텍스트, Mtok당 $0.10/$0.50(100K 초과 프롬프트는 $0.50/$2.50).
- `subagentStatusLine` payload에 `agentType`을 추가했다. 스크립트가 사용자 정의 서브에이전트 종류를 구분할 수 있다.
- mod용 `$.tool.register`에 `isDeferred`를 추가했다. `false`로 두면 tool search 뒤에 두지 않고 처음부터 도구 schema를 프롬프트에 나열한다.
- Claude가 context compaction 직전에 한 자기 작업을 압축 이후에 한 것으로 여겨, 끝난 작업을 철회하거나 다시 하던 문제를 수정했다.
- HTTP MCP 연결이 닫힐 때까지 보낸 모든 요청을 유지하던 메모리 누수를 수정했다.
- `←`로 세션을 백그라운드로 옮길 때 Claude 작업 중 보낸 메시지가 사라지던 문제를 수정했다. 대기 메시지를 옮길 수 없으면 `←`는 이동하지 않고 그 사실을 알린다.
- `/model` effort ←/→가 최고·최저 단계를 넘어 순환해, 모델 기본 effort가 실수로 Low로 저장될 수 있던 문제를 수정했다.
- `--chrome`으로 시작한 세션에서 `/tui`가 Claude in Chrome 연결을 끊고 `--no-chrome`을 무시하던 문제를 수정했다.
- 호스트·권한 규칙·`--tools` 목록이 `SendMessage`를 제거한 세션(재개된 세션 포함)에서 Claude에게 `SendMessage`로 서브에이전트를 계속하거나 메시지를 보내라고 안내하던 문제를 수정했다.
- 서브에이전트와 `--agent` 세션이 자기 도구 목록에서만 빠진 built-in 도구를 세션 전체에서 비활성화된 것으로 안내받던 문제를 수정했다.
- claude.ai에서 동기화된 스킬의 수정된 설명이 새 대화나 `/clear` 전까지 모델에 전달되지 않던 문제를 수정했다.
- 로그인이 만료됐거나 만료 직전일 때 `claude logs`, `stop`, `kill`, `rm`과 `claude daemon status`, `stop`, `uninstall`이 로그아웃시키던 문제를 수정했다.
- 세션 폴더 읽기가 일시적으로 실패하면(예: 열린 파일 수 초과) footer의 agents 카운트가 사라지던 문제를 수정했다.
- `worker`라는 이름의 사용자 정의 에이전트가 시작 시 "Agent"로 표시되고, 에이전트가 끝나면 상세 dialog 제목에서 에이전트 종류가 사라지던 문제를 수정했다.
- publish 호출이 스트리밍되는 동안 Artifact 도구의 transcript 행이 잠깐 `Artifact("(unprintable path)")`로 표시되던 문제를 수정했다.
- Linux에서 sandbox 명령이 실행 중일 때, settings 파일을 "파싱할 수 없다"는 이유로 `/ultrareview` 업로드가 일부 저장소(다른 checkout 안의 저장소 등)를 잘못 거부하던 문제를 수정했다.
- split-index 파일 때문에 `/ultrareview` 업로드가 거부될 때, git이 index를 읽지 못하게 만들 수 있는 git 명령을 권하던 문제를 수정했다.
- 매우 긴 Remote Control·클라우드 세션에서 답변이 스트리밍되지 않고 블록 단위로 나타날 수 있던 문제를 수정했다.
- Remote Control이 인증 복구 때마다 세션 초기 기록을 다시 업로드하던 문제를 수정했다.
- `claude remote-control`로 시작한 세션에서 PushNotification이 "Remote Control inactive"로 보고하던 문제를 수정했다.
- plugin hooks worker가 재시작되는 동안 mod의 `classic.*` 이벤트 hook이 건너뛰어져, settings hook만으로 응답하던 문제를 수정했다.
- `$.session.append`를 호출하는 mod에서 `claude plugin test`가 실패하던 문제를 수정했다. 테스트는 새 `mock.session`으로 추가된 행을 읽을 수 있다.
- Docker Desktop이 있는 Mac(`~/.docker/bin` 아래 링크)에서 `claude plugin eval`이 Bash 권한을 주는 모든 실행을 거부하던 문제를 수정했다. 이제 거부 메시지가 자격 증명 저장소의 어느 부분에 링크가 있었는지 알려준다.
- `desktop` 정책이 Claude Desktop 내장 브라우저 키(예: `builtinBrowserEnabled`)를 설정하면 Claude apps gateway가 시작을 거부하던 문제를 수정했다.
- 동의가 `.claude/settings.local.json`이나 `--settings` 파일에만 저장됐을 때, `claude agents`가 백그라운드 세션이 무시할 bypass permissions를 제시하던 문제를 수정했다. 이제 먼저 동의를 묻고, bypass를 무시한 세션은 사라지지 않는 짧은 안내를 표시한다.
- 입력창에 보내지 않은 텍스트가 있거나 답을 기다리는 질문이 있을 때 `←`가 10초 뒤 세션을 백그라운드로 보내던 문제를 수정했다(텍스트가 있으면 이동을 취소한다).
- `←`를 막 눌러 백그라운드로 옮기는 중일 때, 권한 프롬프트에서 Esc나 피드백 없는 No가 턴을 멈추지 못하던 문제를 수정했다.
- 세션 폴더를 읽을 수 없을 때(예: 열린 파일 수 초과) agents 뷰가 세션 목록을 잠깐 placeholder 행으로 바꾸던 문제를 수정했다.
- Claude가 Read 도구 대신 Bash 도구의 단일 파일 cat, head, tail, sed -n, grep 명령으로 파일을 볼 때 path-scoped rules와 nested CLAUDE.md 파일이 로드되지 않던 문제를 수정했다.
- 같은 단어로 시작하고 끝나는 붙여넣은 텍스트가 가끔 타이핑한 것처럼 Claude에 전송되던 문제를 수정했다.
- 붙여넣기 직후 입력한 악센트 문자가 마지막 글자와 합쳐지면, 붙여넣은 텍스트 속 스킬 이름이 타이핑한 것으로 처리되던 문제를 수정했다.
- 보고서 전송 중 Ctrl+O나 Ctrl+Z를 누르면 `/feedback`이 drafts 목록으로 돌아가 전송을 취소할 수 없던 문제를 수정했다.
- 파일·폴더를 삭제할 수 없을 때 `claude purge`가 조용히 멈추던 문제(exit 0, 또는 터미널에서 멈춤)를 수정했다. 이제 나머지를 지우고, 지우지 못한 항목을 나열한 뒤 exit 1로 끝난다.
- keybindings.json 검사를 수정했다. 단독 " "(스페이스 키)는 더 이상 오류로 보고되지 않고, "ctrl+ k" 같은 키에는 경고를 띄운다.
- vim 모드에서 공백만 있는 줄에 `>>`·`<<`를 쓰면 커서가 줄 끝을 넘어가, 뒤이은 `x`가 아무것도 지우지 못하던 문제를 수정했다.
- vim 모드: Visual 모드에서 줄 전체를 지운 뒤(`V` 후 `d`) 커서가 첫 non-blank에 놓이고, 이후 `.`가 커서 줄에 작동하도록 수정했다.
- Windows: status line, hook, shell 명령을 멈출 때 같은 프로세스 ID를 받은 무관한 프로세스가 종료될 수 있던 문제를 수정했다.
- 2.1.281의 auto mode 거부 메시지 변경(거부가 정확한 명령뿐 아니라 그 결과까지 포함한다고 Claude에게 알리던 변경)을 되돌렸다.
- 컨테이너 재시작으로 대기 중이던 `/loop` 깨우기나 예약 작업을 잃어 클라우드 세션이 계속 잠들어 있던 문제에 대한 2.1.290 수정을 되돌렸다. Claude는 더 이상 이 사실을 안내받지 않고 세션은 잠든 상태로 남는다.
- Team·Enterprise 조직의 시작 속도를 개선했다. policy와 managed settings를 더 일찍 가져오고, 멈춘 요청은 3초 뒤 재시도한다.
- Claude in Chrome을 개선했다. 브라우저가 탭 보고를 늦게 해도 거부되는 페이지 동작이 줄었다.
- 클라우드 세션에서 브라우저에 연결할 수 없을 때의 Claude in Chrome 메시지를 개선했다. 여러 조직에 속해 있으면 확장 프로그램이 같은 조직으로 로그인돼야 한다는 점과 변경 방법을 알려준다.
- Bash 편집 diff 안내를 개선했다. 나열된 파일이 명령 실행 중 변경됐다고 표시하며, 여기에는 다른 프로세스의 쓰기도 포함될 수 있다.
- artifacts를 개선했다. Claude가 라이브러리를 2주 이상 지난 정확한 버전으로 고정한다.
- 사용 중인 세션이 없을 때 claude.ai 스킬 동기화가 변경을 확인하는 주기를 10분에서 약 40분으로 바꿨다.
- 에이전트 목록과 모델에 알리는 MCP 서버의 순서를 바꿨다. 비ASCII 문자가 들어간 이름은 ASCII 이름 뒤에 정렬된다.
- OpenTelemetry `claude_code.at_mention` 로깅을 바꿨다. 프롬프트를 읽을 때마다 agent 이벤트 최대 100개, MCP-resource 이벤트 최대 100개만 내보낸다.
- Self-hosted runner: orchestrator의 polling 간격을 고정 5초에서 4~6초로 바꿨다. 한 환경의 여러 replica가 동시에 polling하지 않는다.
- [Claude Tag] Slack이 연결되지 않은 workspace로 메시지를 표시할 때, 여러 workspace가 공유하는 Enterprise Grid 채널에서 Claude in Slack이 workspace가 설정되지 않았다고 말하던 문제를 수정했다.
- [Claude Tag] 관리자가 채널의 connectors, plugins, skills, rules를 바꾸면 Claude in Slack이 채널 작업 중간에 멈추던 문제를 수정했다. 이제 변경은 Claude가 작업을 마친 뒤 적용된다.
- [Claude Tag] Claude in Slack에 추가 메모와 함께 스레드 routine을 지금 실행하라고 하면, 다시 글을 올릴 수 없는 별도 실행이 시작되던 문제를 수정했다. 이제 그 스레드에서 실행이 이어진다.
- [Claude Tag] Claude Tag 관리자 설정에서 access bundle의 Add a connector dialog가 Google 로그인 한 번 뒤 모든 Google connector를 연결됨으로 표시하던 문제를 수정했다.
- [Claude Tag] 아직 연결되지 않은 Enterprise Grid를 Connect 버튼과 함께 Claude Tag 관리자 설정에 표시하도록 개선했다.
- [Claude Tag] 관리자만 글을 쓸 수 있는 공지 채널에는 Claude in Slack이 소개 글 없이 참여하도록 바꿨다.
- [Claude Tag] Claude Tag 관리자 설정의 채널 규칙 한도를 workspace별, 조직 전체 Slack 페이지별로 20개에서 50개로 바꿨다.
- [Code Review] Code Review의 Add a repository dialog를 개선했다. 추가하지 못한 저장소마다 이유(예: GitHub 쓰기 권한 없음)를 표시한다.

---

## 🎯 챌린지

이번 버전에서 내 환경에 적용해볼 만한 항목입니다.

### 1. 모델별 기본 effort가 Low로 저장됐는지 점검
- **파일**: `~/.claude/settings.json`
- **근거**: 이번 버전 전까지는 `/model`에서 effort를 ←/→로 바꾸다 단계가 한 바퀴 돌아 Low가 기본값으로 저장될 수 있었다. 전역 설정은 `"effortLevel": "xhigh"`이지만 모델별 기본값이 Low로 덮였는지 `/model` 화면과 settings 파일에서 확인한다. 잘못돼 있으면 xhigh로 되돌린다. 신뢰성 우선 원칙(§5)과 직접 연결된다.
- **난이도**: ★☆☆ (약 5분)

### 2. 서브에이전트 상태줄에 에이전트 종류 표시
- **파일**: `~/.claude/settings.json` (`subagentStatusLine` 항목 추가), `~/.claude/hooks/subagent-statusline.sh` (신규)
- **근거**: 새로 추가된 `agentType` 필드로 지금 돈 서브에이전트가 Explore·Plan·general-purpose 중 무엇인지 상태줄에 띄울 수 있다. 서브에이전트를 병렬로 많이 띄우는 작업(§7.2)에서 어느 에이전트가 진행 중인지 바로 보인다. 현재 `statusLine`은 비활성화된 token-optimizer 플러그인 캐시 경로를 가리킨다. 서브에이전트 상태줄은 별도 스크립트로 둔다.
- **난이도**: ★★☆ (약 15분)

### 3. Haiku 기본 모델 변경을 명시적으로 통제
- **파일**: `~/.claude/settings.json` (`env.ANTHROPIC_DEFAULT_HAIKU_MODEL`)
- **근거**: 이번 버전부터 기본 Haiku가 `claude-haiku-5-5`로 바뀌었다. 백그라운드 작업이나 Haiku를 쓰는 에이전트의 동작과 비용이 사용자도 모르게 달라질 수 있다. "예외 상황은 선 보고·통제" 원칙에 맞게 쓸 Haiku 모델을 `env`에 고정한다. 바뀌어도 의도한 변경이 되게 한다.
- **난이도**: ★☆☆ (약 5분)
