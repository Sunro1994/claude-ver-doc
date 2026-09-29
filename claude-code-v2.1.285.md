# Claude Code v2.1.285

> 작성일: 2026-09-30

---

# 📋 요약본

## 🎉 신기능 (10건)
- **`CLAUDE_CODE_DISABLE_WEB_FETCH` 환경변수** — 이 변수를 설정하면 WebFetch 도구가 꺼진다.
- **`claude --desktop`** — 현재 디렉토리를 Claude 데스크톱 앱으로 연다.
  - `--continue` 또는 `--resume <id>`와 함께 쓰면 해당 세션을 데스크톱 앱에서 연다.
- **`claude plugin configure <plugin>`** — 플러그인 옵션과 아직 값이 없는 옵션을 보여준다.
  - `--values-stdin`을 주면 stdin으로 받은 값을 저장한다.
- **`claude plugin install --config`에 `<server>.<key>=<value>` 형식 추가** — 플러그인에 들어 있는 `.mcpb` MCP 서버의 설정을 설치할 때 바로 넣는다. 설치 후 `/plugin` → Configure에 들어가지 않아도 서버가 시작된다.
- **`allowedProviders` 관리 설정** — 한 기기에서 쓸 수 있는 API 제공자를 제한한다.
  - 대상: Anthropic API, 커스텀 엔드포인트, Bedrock, Mantle, Vertex AI, Foundry, Claude Platform on AWS, Cloud gateway.
- **`CLAUDE_CODE_NONSTREAMING_TIMEOUT_RETRIES` 환경변수** — non-streaming fallback 요청(스트리밍이 실패했을 때 쓰는 대체 요청)이 타임아웃되면 몇 번까지 다시 보낼지 정한다.
- **[VSCode] 중단된 탭 안내** — 창을 다시 불러오면서 턴이 끊긴 복원 탭의 마지막 메시지 아래에 "답장이 오지 않는다"는 안내가 붙는다.
- **[VSCode] 플러그인 옵션 폼** — Manage plugins에서 옵션이 있는 플러그인을 설치하면 비어 있는 옵션을 묻는다. 나중에는 해당 행의 톱니바퀴로 바꾼다.
- **[VSCode] 진단 도구** — Claude가 Problems 패널의 오류·경고를 필요할 때마다 읽는다. 이전에는 파일을 편집한 직후에만 읽었다.
- **[Claude Tag] Claude와 DM** — Enterprise 플랜에서 Standard 또는 Usage-Based Chat 좌석과 Cowork를 함께 가진 멤버가 Claude와 DM을 할 수 있다. Claude Code가 포함된 좌석은 더 이상 필요 없다.

## 🛠️ 개선/수정 (18건)
- **백그라운드 Bash·PowerShell 시간 제한** — `run_in_background` 명령은 `timeout`이 지나면 멈춘다. 기본값은 30분, 최대 2시간이다. 멈추면 Claude가 알림을 받는다.
- **`claude -p`의 기본 권한 모드 변경** — 서드파티 제공자를 쓰거나 텔레메트리를 끈 상태에서 권한 모드를 정하지 않으면 auto mode로 시작한다. `--permission-mode`를 주면 그 값이 우선한다.
- **커스텀 `ANTHROPIC_BASE_URL`에서 1M 컨텍스트 사용** — 1M 창이 있는 모델(Opus 4.7+, Sonnet 5+, Fable)은 1M으로 동작한다. 게이트웨이가 200K에서 막히면 `/autocompact 200k`를 실행한다.
- **동기 hook 멈춤 수정** — hook이 띄운 백그라운드 프로세스(`some-daemon &` 등)가 출력을 붙잡고 있어도, hook은 자기 프로세스가 끝나면 곧 종료된다.
- **fork 서브에이전트 권한 모드 유지** — fork는 부모의 권한 모드(plan, `dontAsk` 포함)를 그대로 따른다. plan mode를 스스로 빠져나가지 못한다.
- **auto mode 서브에이전트 정리** — 보고를 호출자에게 넘기면 바로 끝난다. 이후의 불필요한 턴과 중복 답장이 사라졌다.
- **`claude -p --permission-prompt-tool` 수정** — 백그라운드 서브에이전트의 권한 요청이 자동 거부되지 않고 prompt tool로 간다.
- **workflow 스크립트 안정화** — `agent()`·`parallel()`·`pipeline()` 호출이 실패했는데 나중에 await하거나 아예 await하지 않은 경우, 처리되지 않은 promise rejection으로 취급되어 백그라운드 세션이 끝날 수 있었다. 이 문제를 고쳤다.
- **재시도 폭주 수정** — 스트리밍이 계속 실패할 때 최대 21번 재시도하던 문제를 고쳤다. fallback도 원래 요청의 재시도 횟수를 함께 쓴다.
- **콘텐츠 필터 차단 즉시 표시** — API 출력 필터에 막힌 응답은 몇 분씩 다시 보내지 않고 바로 오류를 보여준다.
- **ExitPlanMode plan 누락 수정** — 같은 응답에서 쓴 plan을 hook과 SDK 권한 콜백이 빠뜨리거나 옛 버전으로 보던 문제를 고쳤다.
- **Artifact 도구 안전성 강화** — rewind 이후나 읽기가 중간에 잘린 뒤 파일을 덮어쓰던 문제, 작업 디렉토리 밖 파일에 allow 규칙이 적용되던 문제, 충돌 오보를 고쳤다.
- **`/ultrareview` 업로드 정비** — worktree·partial clone·특이한 파일명 처리를 고쳤고 git 2.31 이상을 요구한다. 콜론이 들어간 자격증명 파일(`server:8443.key` 등)이 업로드에 섞이던 문제도 막았다.
- **sandbox 설정 강화** — 관리자가 강제한 sandbox를 프로젝트 설정으로 넓히거나 끄거나 우회할 수 없다. 인라인 스크립트(`python3 -c`, `node -e`)에 `=`가 있다는 이유만으로 매번 승인을 요청하던 문제도 고쳤다.
- **`/resume` 백그라운드 세션 열기** — 백그라운드에서 돌고 있는 세션을 거부하지 않고 연다. `claude --resume <id> "prompt"`로 준 프롬프트는 그 세션의 다음 턴으로 들어간다.
- **`/tasks` 정리** — Claude Code가 스스로 돌리는 백그라운드 작업을 "System tasks" 한 줄로 묶는다.
- **MCP 목록·출력 수정** — `claude mcp list`가 WebSocket 서버를 빠뜨리던 문제와 이스케이프 시퀀스를 그대로 출력하던 문제를 고쳤다. 플러그인이 제공한 stdio 서버의 값은 숨긴다.
- **VSCode 확장 안정화** — 긴 세션의 메시지 유실, 파일 도구가 10분 멈추던 문제, 플러그인 제거 오류 등 20여 건을 고쳤다.

## 🔑 이번 버전의 핵심 키워드
**"경계를 단단히"** — 백그라운드 작업 시간 제한, 권한 모드 상속, sandbox·Artifact 보호처럼 에이전트가 넘어가면 안 되는 선을 코드로 확실히 그은 버전이다.

---

# 📜 원문 (한글 번역본)

> 원문 ChangeLog를 원래 순서 그대로 한 줄도 빠짐없이 번역한 문서입니다.

- WebFetch 도구를 끄는 `CLAUDE_CODE_DISABLE_WEB_FETCH` 환경변수 추가
- 현재 디렉토리를 Claude 데스크톱 앱으로 여는 `claude --desktop` 추가. `--continue` / `--resume <id>`와 함께 쓰면 해당 세션을 연다
- 플러그인 옵션과 값이 비어 있는 옵션을 보여주는 `claude plugin configure <plugin>` 추가. `--values-stdin`을 주면 stdin으로 받은 새 값을 저장한다
- `claude plugin install --config`에 `<server>.<key>=<value>` 추가. 번들된 `.mcpb` MCP 서버의 자체 설정을 설치 때 넣을 수 있어 `/plugin` → Configure를 거치지 않고 시작된다
- 한 기기가 쓸 수 있는 API 제공자(Anthropic API, 커스텀 엔드포인트, Bedrock, Mantle, Vertex AI, Foundry, Claude Platform on AWS, Cloud gateway)를 제한하는 `allowedProviders` 관리 설정 추가
- 타임아웃된 non-streaming fallback 요청의 재전송 횟수를 제한하는 `CLAUDE_CODE_NONSTREAMING_TIMEOUT_RETRIES` 환경변수 추가
- `CLAUDE_CODE_FORK_SUBAGENT=1`을 켠 `claude -p` 수정: 서브에이전트가 직접 호출한 Agent를 포그라운드로 실행해, 서브에이전트가 자식의 결과를 받는다
- SSH로 플러그인·마켓플레이스를 설치·업데이트할 때 `GIT_SSH` 또는 git config `core.sshCommand`에 지정한 ssh 프로그램을 무시하던 문제 수정
- OS가 managed settings 파일 읽기를 거부하면 Claude Code가 시작을 거부하던 문제 수정. 이제 경고를 띄우고 그 파일의 정책 없이 시작한다. 다른 읽기 오류나 파싱 불가 파일은 모든 세션을 멈춘다
- 대화 압축 후 재시작한 클라우드 세션이, 이미 읽었거나 게시한 artifact의 다음 업데이트를 거부하던 문제 수정
- 전체 `name@marketplace` id로 `claude plugin disable`·`enable`을 실행하면 설치된 플러그인 항목 대신 대소문자만 다른 다른 설정 항목을 바꾸던 문제 수정
- Remote Control로 보낸 메시지의 첨부 파일이 다운로드 한 번 실패로 빠지던 문제 수정. 네트워크 오류·타임아웃·서버 오류는 최대 두 번 재시도한다
- `set_model` 요청(Agent SDK의 `setModel` 등)으로 세션 중 모델을 바꾸면 새 모델이 재시작 전까지 기본 출력 토큰 한도와 auto-compact 창에 머물던 문제 수정
- 마스킹된 로그·트랜스크립트에서 `@`가 들어간 URL 비밀번호가 일부 드러나거나, `@`를 `%40`으로 쓴 경우 전부 드러나던 문제 수정
- worktree·`/teleport`의 fetch에서 나오는 SSH 암호문·새 호스트 확인 프롬프트가 터미널을 차지하던 문제 수정. 이제 묻지 않고 바로 실패한다
- SDK·`-p` 세션에서 세션 중 추가한 MCP 서버를 꺼도 그 도구가 계속 쓰이던 문제 수정
- `claude -p --permission-prompt-tool` 수정: 백그라운드 서브에이전트의 권한 요청이 자동 거부되지 않고 prompt tool로 간다
- `claude mcp list`·`claude mcp get`, 그리고 `claude mcp remove`·`login`·`logout`의 not-found 오류가 MCP 서버 이름·값에 든 줄바꿈과 터미널 이스케이프 시퀀스를 그대로 출력하던 문제 수정
- sandbox auto-allow가 많은 인라인 스크립트(`python3 -c`, `node -e`)를 `=`가 들어 있다는 이유만으로 실행할 때마다 승인 요청하던 문제 수정
- fork 서브에이전트가 세션의 plan mode나 `dontAsk` 모드를 유지하지 않던 문제 수정: fork는 부모의 권한 모드로 실행되며 plan mode를 나갈 수 없다
- `claude remote-control --help`가 `--[no-]chrome`의 기본값을 기기의 `/chrome` 설정이라고 안내하던 문제 수정. 생성된 세션은 `--chrome`을 주지 않으면 Claude in Chrome이 꺼진 상태다
- auto mode의 백그라운드 서브에이전트가 보고마다 불필요한 두 번째 답장을 유도하던 문제 수정
- 클라우드 세션 생성과 `/remote-env`가 계정 환경 중 최신 20개만 읽던 문제 수정
- Remote Control이 메시지를 Claude가 처리를 시작할 때가 아니라 도착하자마자 읽음 처리하던 문제, 터미널 종료 시 대기 중이던 메시지를 잃던 문제 수정(이제 다음 resume 때 도착한다)
- `claude plugin install`·`/plugin`으로 설치할 때 id가 `.`, `-`, `@` 또는 (macOS, Windows) 대소문자만 다른 기존 플러그인의 캐시·데이터 폴더에 넣던 문제 수정. 이제 설치를 거부한다
- 같은 응답에서 plan을 쓴 경우 ExitPlanMode 시점에 hook과 SDK 권한 콜백이 plan을 못 보거나 옛 버전을 보던 문제 수정
- 클라우드 세션의 첫 응답이 수십 ms 늦게 도착하던 문제 수정(2.1.283 회귀)
- Anthropic API에 `ANTHROPIC_AUTH_TOKEN`으로 인증한 세션이 조직 정책을 전혀 불러오지 않던 문제 수정
- workflow 스크립트가 나중에 await하거나 아예 await하지 않는 `agent()`·`parallel()`·`pipeline()` 호출이 실패하면 처리되지 않은 promise rejection으로 취급되어 백그라운드 세션이 끝날 수 있던 문제 수정
- hook이 띄운 백그라운드 프로세스(예: `some-daemon &`)가 출력을 열어두면 동기 hook이 Claude Code를 멈추던 문제 수정. hook은 자기 프로세스가 끝나면 곧 종료된다
- WebFetch가 rate limit에 걸린 도메인 안전 검사를 네트워크·엔터프라이즈 정책 차단으로 보고하던 문제 수정
- 파일 읽기·검색이 수백 개인 턴에서 fullscreen ctrl+o 트랜스크립트를 열면 잠시 멈추던 문제 수정. 트랜스크립트를 열 때 실행 중이던 도구 호출은 끝나면 결과를 보여준다
- Amazon Bedrock 스트리밍 중 `modelTimeoutException`·`serviceUnavailableException` 오류가 오류 메시지 대신 raw JSON 본문으로 보이던 문제 수정
- 설치 상태를 아직 확인하지 않은 저장소에서 `/autofix-pr`·`/schedule`이 Claude GitHub App이 설치되지 않았다고 말하던 문제 수정
- `/artifacts`에서 행을 닫으면(x) 파일과 artifact의 연결이 끊겨, 같은 파일을 다시 게시하면 업데이트 대신 새 artifact가 생기던 문제 수정
- 대화 rewind(Esc Esc) 후 Artifact 도구 게시가, rewind된 턴에서만 읽은 파일의 더 새로운 내용을 덮어쓰던 문제 수정. Claude가 파일을 다시 읽기 전까지 게시를 거부한다
- `Artifact` allow 규칙("don't ask again")이 작업 디렉토리 밖 파일도 묻지 않고 게시하게 하던 문제 수정. 규칙이 적용되게 하려면 파일 폴더를 `--add-dir`로 추가한다
- 서버가 거절 응답에 클라이언트 예상과 다른 fallback 모델을 쓴 경우 `/cost`와 SDK `modelUsage`가 턴을 잘못된 모델로 집계하던 문제 수정
- Claude의 이전 읽기가 중간에 잘렸거나 그 뒤 파일이 바뀐 경우, 페이지 게시 시 Claude가 다시 읽지 않고 원본 파일을 덮어쓸 수 있던 Artifact 도구 문제 수정
- 다른 권한 모드에서 해당 artifact를 이미 승인했으면 auto mode가 Artifact 도구의 에셋 업로드와 타인 artifact 읽기에 대해 classifier를 건너뛰던 문제 수정
- 프로젝트 폴더를 잠깐 읽을 수 없을 때 `/ultrareview`가 "core.worktree is set"이라는 잘못된 오류를 내던 문제 수정
- macOS·Linux에서 worktree별 config에 `core.longpaths`가 설정된 git worktree의 작업 트리를 `/ultrareview`가 업로드하지 못하던 문제 수정
- 일시적 서버 오류로 재시도한 뒤 첫 시도가 실제로는 성공했는데도 Artifact 도구가 다른 세션과의 충돌로 보고하던 문제 수정
- 확장자 앞에 콜론이 있는 자격증명 파일(`server:8443.key` 등)의 미커밋 변경이 `/ultrareview` 업로드에 포함되던 문제 수정
- 크래시한 프로세스가 남긴 로그인 갱신 lock을 두 세션이 동시에 복구할 때 드물게 인증이 실패하던 문제 수정
- 명령 파서가 시작에 실패하면(예: 메모리 부족) PowerShell 도구의 권한 검사가 deny·ask 규칙을 건너뛰고 그 실패를 이후 검사에 캐시하던 문제 수정
- macOS·Linux에서 특이한 파일명 때문에 `/ultrareview` 업로드가 느려지던 문제, 백업·에디터 표식이 많이 붙은 파일·폴더명을 자격증명 파일 검사가 놓치던 문제 수정
- 셋업 도중 취소가 들어온 셸 명령·hook이 그대로 시작해 끝까지 실행되던 문제 수정
- vim mode: 외부 에디터(Ctrl+G) 편집 후 NORMAL 모드의 `x`·`r`이 프롬프트 끝의 붙여넣기 placeholder를 깨지 않게 수정
- API 출력 콘텐츠 필터에 막힌 응답을 때로는 몇 분씩 재전송·재시도하던 문제 수정. 필터 오류를 바로 보여준다
- 설정이 필요한 번들 `.mcpb` MCP 서버를 플러그인이 조용히 건너뛰던 문제 수정: `/plugin`, 설치 메시지, `claude plugin install`이 이를 알리고 Configure로 안내한다
- 저장된 트랜스크립트의 compaction 마커나 loop wakeup 항목에 필드가 없거나 잘못되어 있으면 압축·resume이 실패하거나, 히스토리 없이 열리거나, 크래시하던 문제 수정
- WSL: 변경 파일명에 콜론이 있거나 점·공백으로 끝나면 `/ultrareview`가 Linux 볼륨의 checkout 업로드를 거부하던 문제 수정
- `CLAUDE_CODE_RESUME_INTERRUPTED_TURN`이 `--max-turns`에서 끝난 턴을 다시 실행하던 문제 수정
- 브라우저에 성공이 표시된 뒤에도 로그인이 끝없이 대기할 수 있던 문제 수정
- Windows: 홈 폴더가 루트인 저장소의 linked worktree를 `/ultrareview`가 경우에 따라 업로드하던 문제 수정
- 클라우드 세션이 파일을 하나도 올리기 전에 uploads 폴더가 없다고 보고하던 문제 수정
- 권한 프롬프트를 기다리는 백그라운드 세션에 `claude agents`에서 보낸 답장이 대기 중인 명령을 승인해 버리던 문제 수정
- 셸 alias처럼 명령 이름 앞에 옵션이 오면 `claude attach`·`logs`·`stop`·`respawn`·`rm`이 명령 이름을 프롬프트로 삼아 새 세션을 시작하던 문제 수정
- `claude mcp list`가 WebSocket(`ws`) MCP 서버를 빠뜨리던 문제 수정. 각각 URL과 상태를 표시한다
- config 항목에 `type` 필드가 없는 stdio 서버에 대해 `claude mcp get`이 Type·Command·Args·Environment를 표시하지 않던 문제 수정
- git trace2 출력이 설정된 경우 git 저장소 밖에서 `.claude/settings.local.json`의 allow 규칙이 보류되던 문제 수정
- `/claude-api` eval runner scaffold와 report builder가 출력 파일 위치에 심어진 symlink·hard link를 따라 쓰던 문제 수정
- `/claude-api` eval runner scaffold가 `max_tokens`에서 잘린 응답을 점수 평균에 넣던 문제 수정. 이제 truncated로 표시해 따로 집계한다
- 응답이 들여쓰기(마크다운 표의 행 라벨 등)에 `&nbsp;`를 쓰면 터미널에 글자 그대로 보이던 문제 수정
- fullscreen 모드가 아닌 긴 세션 중간에 최대 1초 멈추던 문제 수정(`/clear`·`/compact` 후 재발하던 문제)
- 대상이 장치 파일(예: /dev/null에 연결된 symlink)이고 IDE diff 뷰에서 승인했거나 승인 과정에서 편집이 바뀐 경우, 승인된 Edit가 끝내 적용되지 않던 문제 수정
- 스트리밍이 계속 실패하면 API 요청을 최대 21번 재시도하던 문제 수정. non-streaming fallback이 새 재시도 횟수를 받지 않고 원래 요청의 재시도 예산을 공유한다
- Claude in Chrome 개선: native host가 컴퓨터 이름을 보고해, 연결된 브라우저가 "Browser 1"/"Browser 2" 대신 컴퓨터 이름으로 표시된다
- Bedrock·Vertex AI 세션 개선: 관리자가 기본 모델 접근을 막으면 실패하지 않고 같은 등급의 사용 가능한 이전 모델로 바꾼다. 세션 제목·요약도 함께 대체된다
- 플러그인 마켓플레이스 오류 개선: git 주소가 거부된 이유를 엔터프라이즈 정책 대신 실제 이유로 알려준다
- 플러그인·마켓플레이스·현재 저장소 remote의 git URL 검증 개선
- Artifact 도구 결과 개선: 페이지를 쓰거나 편집하는 단계에서 게시까지 함께 하도록 제안해 왕복을 줄인다
- Remote Control 개선: Claude Desktop 같은 앱이 호스팅하는 세션에 `/btw` 곁질문을 하면 마지막 완료 턴뿐 아니라 진행 중인 턴도 본다
- Claude가 BMP·HEIC·HEIF·AVIF·TIFF로 보내는 이미지 개선: Claude Code가 변환할 수 있는 곳에서는 Claude 앱이 미리보기를 보여준다
- auto mode 서브에이전트 개선: 보고를 호출자에게 넘기면 바로 끝나고, 아무에게도 닿지 않는 추가 턴을 쓰지 않는다
- Bedrock·Vertex 시작 시 모델 검사 개선: 계정이 쓸 수 없는 모델을 매번 다시 검사하지 않고 최대 하루 동안 기억한다
- Artifact 도구 게시 결과의 토큰 절감: artifact 업데이트 안내를 줄였고, artifact 위치 안내를 게시마다 반복하지 않는다
- non-streaming fallback 중 SDK 생존 신호 개선: partial messages를 켜면 Anthropic API·Claude Platform on AWS·게이트웨이에서 30초마다 `ping` stream event를 보낸다
- 백그라운드에서 실행 중인 세션에 대한 `/resume`·`claude --resume` 개선: 거부하지 않고 그 세션을 연다. `claude --resume <id> "prompt"`로 준 프롬프트는 다음 턴으로 보낸다
- permission deny 규칙과 MCP 도구가 많을 때 턴당 성능 개선
- fullscreen 렌더링을 끈 긴 세션에서 ctrl+o 트랜스크립트 뷰를 나갈 때 반응성 개선
- Bedrock·Vertex·Mantle 시작 시 모델 검사가 일반 요청과 같은 User-Agent·x-app·session ID 헤더를 보내도록 개선
- MCP 도구 변경: 자체 `_meta['anthropic/alwaysLoad']`를 false로 설정한 도구는 `--mcp-config`·Agent SDK·플러그인 서버가 `alwaysLoad`여도 지연 로딩을 유지한다
- 백그라운드 Bash·PowerShell 명령 변경: 시간 제한(`run_in_background`와 함께 준 `timeout`, 기본 30분, 최대 2시간)이 지나면 멈춘다. 멈추면 Claude가 알림을 받는다
- Code Review의 PR 리뷰와 `/ultrareview` 변경: `disableWorkflows`가 켜져 있어도 실행된다. 단 리뷰를 실행하는 기기의 관리자가 직접(MDM 또는 managed-settings 파일) 설정했다면 실행하지 않는다
- 커스텀 `ANTHROPIC_BASE_URL` 세션 변경: 1M 컨텍스트 창이 있는 모델(Opus 4.7+, Sonnet 5+, Fable)은 1M을 쓴다. 게이트웨이가 200K에서 멈추면 `/autocompact 200k`를 실행한다
- Team·Enterprise 세션과 로그인 플랜을 판별할 수 없는 세션 변경: 시작 시 조직 정책을 불러오지 못했으면 정책이 로드될 때까지 WebFetch를 막는다
- /memory 변경: 백그라운드 세션이나 Claude Code 자체 도구가 시작한 세션에서는 Auto-memory를 켤 수 없다. 끄기는 가능하다
- auto mode를 기본 권한 모드로 삼자는 1회성 제안 변경: 사용자 설정 기본값이 다른 모드면 서드파티 제공자와 텔레메트리 off 환경에서도 표시한다
- 서드파티 제공자나 텔레메트리 off 환경의 `claude -p`·Python Agent SDK 세션 변경: 권한 모드가 설정되지 않았으면 대화형 세션처럼 auto mode로 시작한다. `--permission-mode`가 여전히 우선한다
- Bedrock·Mantle·Claude Platform on AWS 요청 변경: 기본이 아닌 포트를 쓰는 base URL이면 SigV4 서명 Host 헤더에 포트를 넣는다
- MCP 서버 이름 `widgets` 예약 변경: 클라우드 세션과 self-hosted runner에서 이 이름이나 `widgets_` 같은 비슷한 이름의 사용자 서버는 로드되지 않는다. 이름을 바꾼다
- macOS·Linux `/ultrareview` 변경: 로컬 checkout 업로드 시 symbolic ref를 제외한다. 현재 브랜치가 symbolic ref인 checkout은 설명과 함께 거부한다
- Windows: 프로젝트·로컬 설정의 `env`가 더 이상 `ALLUSERSPROFILE`·`SystemDrive`·`CommonProgramFiles` 변수를 설정하지 않는다. 사용자 설정이나 관리 설정에서 지정한다
- `/tasks` 변경: Claude Code가 자체적으로 돌리는 백그라운드 작업을 "System tasks" 한 줄로 묶는다. Enter를 누르면 펼친다
- macOS·Linux `/ultrareview` 변경: 로컬 저장소를 업로드하려면 git 2.31 이상이 필요하다. `--separate-git-dir`로 만든 checkout은 옛 방식으로 올리지 않고 거부한다
- macOS·Linux `/ultrareview` 업로드 변경: git 2.31 이상에서는 partial clone을 작업 트리 스냅샷으로 보낸다. git 버전이 낮아 보인다는 이유로 fallback하거나 거부하지 않는다
- macOS·Linux `/ultrareview` 업로드 변경: 옛 git 버전에서 작업 트리 파일 일부가 없는 partial clone은 fetch하지 않고 거부한다. `--filter` 없이 만든 clone은 업로드된다
- Bedrock·Vertex·Mantle 시작 시 모델 검사가 다른 요청처럼 Claude Code로 자신을 식별하도록 변경
- `claude mcp get` 변경: 플러그인이 제공한 stdio MCP 서버의 command·arguments·environment 값을 숨긴다. 변수 이름은 계속 보인다
- `/claude-api`를 Remote Control 클라이언트에서 실행할 수 없도록 변경
- `/config chrome=true` 변경: Claude in Chrome을 기본으로 켜지 않고 /config 패널로 안내한다. 켜져 있을 때 `/config chrome=false`로 끄는 것은 그대로 된다
- sandbox 설정 변경: 프로젝트 설정으로 관리자 필수 sandbox를 넓히거나 끄기, managed deny list 뒤의 proxy 교체, strict allowlist 확장, managed read-deny 해제를 할 수 없다
- [VSCode] 창 재로드로 끊겨 답장이 오지 않을 복원 탭의 마지막 메시지 아래에 안내 추가
- [VSCode] Manage plugins에 플러그인 옵션 폼 추가: 옵션이 있는 플러그인을 설치하면 비어 있는 옵션을 묻고, 행의 톱니바퀴로 나중에 바꾼다
- [VSCode] 패널의 Claude가 파일 편집 직후뿐 아니라 언제든 Problems 패널의 현재 오류·경고를 읽는 on-demand 진단 도구 추가
- [VSCode] 슬래시 명령을 입력하고 Enter를 누르면 fuzzy match로 고른 엉뚱한 메뉴 항목이 실행되거나 아무 일도 없던 문제 수정
- [VSCode] 긴 세션에서 열려 있는 에이전트 트랜스크립트가 에이전트의 새 메시지를 잃던 문제 수정
- [VSCode] Claude Code·IDE 태그를 인용한 메시지가 채팅에서 나머지 텍스트를 잃던 문제 수정
- [VSCode] Claude 작업 중 보낸 메시지가 세션을 다시 열면 대화에서 사라지던 문제 수정
- [VSCode] 계정 전환 후 세션 목록의 Web 탭에 이전 계정의 세션이 보이던 문제 수정
- [VSCode] `CLAUDE_CODE_RESUME_INTERRUPTED_TURN`을 설정하고 VS Code를 시작하면 Continue After Reload가 꺼져 있어도 복원 탭이 중단된 턴을 다시 실행하던 문제 수정
- [VSCode] 명령 메뉴 행을 클릭한 뒤 Escape를 누르면 메뉴를 닫지 않고 실행 중인 턴을 멈추던 문제 수정
- [VSCode] Past conversations를 열면 진행 중인 대화를 저장본으로 바꿔치기하던 문제 수정
- [VSCode] 확장 재시작 후 다시 불러온 Claude 탭이 복구 방법 안내 없이 빈 화면으로 남던 문제 수정
- [VSCode] 다른 창이나 앱에서 이미 열린 대화를 열면 경고 없이 두 번째 사본을 시작하던 문제 수정. 이제 먼저 묻는다
- [VSCode] 창 재로드 후 hook이 프롬프트를 막거나 멈춘 이유가 사라지던 문제 수정
- [VSCode] resume할 수 없는 대화에 탭이 갇히던 문제 수정: 오류가 이를 알리고 새 대화 시작을 제안한다
- [VSCode] 도구 실행 전에 에디터가 확장의 자동 저장에 응답하지 않으면 모든 Read·Write·Edit가 10분간 멈춘 뒤 건너뛰어지던 문제 수정
- [VSCode] 에이전트 맵이 서브에이전트를 실제 실행 모델이 아닌 세션 모델로 표시하던 문제 수정(예: `CLAUDE_CODE_SUBAGENT_MODEL_FORCE`나 에이전트 자체 `model` 사용 시)
- [VSCode] Manage plugins 대화상자에서 플러그인을 제거하면 엉뚱한 설치본을 지우거나, 프로젝트용으로 설치한 플러그인 제거가 실패하던 문제 수정
- [VSCode] 뒤로 갔다가 같은 로그인 방식을 다시 고르면 로그인이 authorization-code 단계에 머물던 문제 수정
- [VSCode] 긴 세션이 가장 오래된 행을 정리할 때 채팅 패널이 멈추던 문제 수정
- [VSCode] 에이전트가 많이 실행되면 세션에서 대화가 사라지던 문제 수정
- [VSCode] /rename, SessionStart hook, claude.ai에서 세션 이름을 바꿔도 에디터 탭이 옛 이름을 유지하던 문제 수정
- [VSCode] 에이전트 맵의 트랜스크립트 뷰가 실행 중인 에이전트에게 보낸 메시지를 빠뜨리던 문제 수정
- [VSCode] Manage plugins 대화상자 개선: 플러그인 작업이 실패하면 이유를 설명하고, 해결책이 있으면 제안하는 팝업을 연다
- [VSCode] Manage plugins 대화상자 변경: 프로젝트 공유 `.claude/settings.json`이 켜 둔 플러그인을 끄거나 마켓플레이스를 제거하기 전에 묻는다
- [Cloud sessions] routine의 Run now가 시작 전에 거부되면 내부 오류 텍스트를 보여주던 문제 수정. routine 실패 알림과 같은 설명을 보여준다
- [Cloud sessions] `MCP_DISCOVERY_CACHE=1` 변경: 설정 파일이 아닌 클라우드 환경 변수에 설정하면 세션 재시작 후 커넥터의 도구 목록을 재사용한다. 다른 MCP 서버는 캐시하지 않고 시작 시 연결한다
- [Claude Tag] Enterprise 플랜에서 Standard 또는 Usage-Based Chat 좌석과 Cowork를 함께 가진 멤버에게 Claude와의 DM 추가. Claude Code가 포함된 좌석은 더 이상 필요 없다
- [Claude Tag] 관리자 설정의 Default model과 채널 Configure 페이지가 조직이 쓸 수 없는 모델을 제시해 저장이나 새 세션이 실패하던 문제 수정
- [Claude Tag] Claude가 Slack 메시지를 나중에 수정하면 fallback 모델로 답했다는 안내와 이유가 사라지던 문제 수정
- [Code Review] "Add a repository" 대화상자의 조직 메뉴에 GitHub 조직이 몇 개만 보이던 문제 수정. 스크롤하면 더 불러온다
- [Code Review] 저장소의 REVIEW.md가 적용되지 않았을 때(아주 큰 PR이거나 REVIEW.md가 symbolic link인 경우 등) Code Review check run이 이를 알리도록 개선

---

## 🎯 챌린지

이번 버전에서 내 환경에 적용해볼 만한 항목입니다.

### 1. changelog-sync 호출에 권한 모드 명시
- **파일**: `~/.claude/skills/claude-changelog-sync/` 안에서 `claude -p --model opus`를 호출하는 스크립트(cron 08:00 실행분)
- **근거**: 이번 버전부터 `claude -p`는 권한 모드가 없으면 조건에 따라 auto mode로 시작한다. 매일 도는 무인 작업이 버전마다 다르게 동작하지 않도록 `--permission-mode`를 직접 적어 고정한다. 문서 생성만 하는 작업이므로 가장 좁은 모드를 고른다.
- **난이도**: ★☆☆ (약 10분)

### 2. 오래 걸리는 백그라운드 명령에 timeout 명시
- **파일**: `~/.claude/skills/eos-cdn-deploy/SKILL.md`
- **근거**: 이제 백그라운드 Bash는 기본 30분, 최대 2시간이 지나면 강제로 멈춘다. CDN 업로드·원본 대조·퍼지 단계를 백그라운드로 돌리다 30분을 넘기면 중간에 끊긴다. 해당 단계에 "`run_in_background` 사용 시 `timeout`을 명시한다(최대 2시간)"는 규칙을 넣고, 멈춤 알림을 받으면 재시도하지 말고 보고하도록 적는다. §0 원칙 3번과도 맞다.
- **난이도**: ★★☆ (약 15분)
