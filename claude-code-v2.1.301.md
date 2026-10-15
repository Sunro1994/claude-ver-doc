# Claude Code v2.1.301

> 작성일: 2026-10-16

---

# 📋 요약본

## 🎉 신기능 (8건)
- **사용량 한도 대기 상한 환경변수** — `CLAUDE_CODE_RETRY_WATCHDOG_MAX_USAGE_LIMIT_WAIT_MS`를 추가했다. 무인 재시도 모드(`CLAUDE_CODE_RETRY_WATCHDOG`)에서 사용량 한도가 너무 먼 시점에 풀리면, 기다리지 않고 요청을 끝낸다.
  - cron처럼 사람이 지켜보지 않는 `claude -p` 작업이 몇 시간씩 멈춰 있는 일을 막는다.
- **`claude-api` 스킬에 OpenTelemetry 추적 안내 추가** — 추적 데이터를 보낼 곳을 `ant` CLI로 설정하는 방법을 담았다.
- **vim 모드 `%` 이동** — 짝이 되는 괄호로 바로 이동한다. 단독으로 쓰거나 d/c/y와 함께 쓴다.
- **mod `Input`의 `rows` 옵션** — 터미널에서 여러 줄 입력칸을 만든다. Enter는 제출이고, Shift+Enter나 줄 끝 백슬래시 뒤 Enter는 줄바꿈이다.
- **OTel `tool_decision`에 `classifier_verdict`·`permission_mode` 추가** — auto mode 분류기의 판단과 권한 규칙에 따른 판단을 구분할 수 있다.
- **OTel `tool_decision`에 `classifier_category` 추가** — `OTEL_LOG_TOOL_DETAILS=1`일 때, 분류기가 막은 요청이 어느 기본 규칙에 걸렸는지 이름을 남긴다.
- **[VSCode] LaTeX 수식 렌더링** — `$$`, 여러 줄 `\[ … \]` 블록, 인라인 `$…$`·`\(…\)` 수식을 그려 준다.
- **[VSCode] "Get more usage" 링크** — Pro·Max 요금제에서 VS Code와 JetBrains 패널의 사용량 한도 배너에 표시된다.

## 🛠️ 개선/수정 (43건)
- **WorktreeCreate 워크트리 삭제** — 종료할 때 `WorktreeCreate` hook이 만든 워크트리를, push하지 않은 커밋이 있을 수 있는데도 묻지 않고 지우던 문제를 고쳤다.
- **`fable`·`best` 별칭 폴백** — 최신 Fable 모델을 조직에서 쓸 수 없을 때 에러를 내지 않는다. 이전 Fable 모델로 한 번 다시 시도한다.
- **디스크 가득 참 오류 문구** — 디스크가 가득 차 로그인을 갱신하지 못할 때 엉뚱하게 "/login 하라"고 안내하던 문제를 고쳤다. 이제 디스크가 원인이니 파일을 지우라고 알려 준다.
- **Grep·Glob 실패 은폐** — 검색 프로그램이 결과를 내기 전에 죽으면 "결과 없음"으로 보고하던 문제를 고쳤다. 이제 검색 실패 에러를 반환한다.
- **워크플로 agent 단계 건너뜀** — "작업 텍스트에는 사용자 권한이 없다"는 harness 안내를 읽은 agent가 단계를 건너뛰고도 성공으로 보고되던 문제를 고쳤다.
- **artifact 갱신 거부** — PreToolUse hook이 Edit·Write를 감시하는 환경에서 artifact 갱신이 거부되던 문제를 고쳤다. 이제 파일을 고친 뒤 다시 게시한다.
- **인자 이름이 많은 스킬 지연** — 인자 이름이 아주 많거나 길면 호출할 때 몇 초씩 멈추던 문제를 고쳤다. 앞의 64개 이름, 이름당 64자까지만 채운다.
- **placeholder 메모리 폭증** — 인자가 placeholder 자리를 많이 채울 때 스킬·커맨드·hook이 메모리를 과하게 쓰던 문제를 고쳤다.
- **VTE 0.53 미만 터미널 잡문자** — MATE Terminal(RHEL 8) 등에서 `>0q`, `>4m` 같은 문자가 찍히던 문제를 고쳤다.
- **iTerm2 `GOK` 출력** — 일부 iTerm2 버전에서 시작할 때 `GOK`가 입력창에 찍히던 문제를 고쳤다.
- **`application-inference-profile` 오작동** — Bedrock이 아닌데도 이 이름이 들어간 모델로 바꾸면 `awsAuthRefresh`가 실행되던 문제를 고쳤다.
- **토큰 갱신 중단 시 로그아웃** — `claude auth status` 같은 짧은 명령이 토큰 갱신 도중 끝나면 시간 초과나 로그아웃이 생기던 문제를 고쳤다.
- **중간 메시지로 끊긴 도구 호출** — 권한 확인 중에 사용자가 메시지를 보내 도구 호출이 끊기면, 모델에게 "사용자가 거부했다"고 잘못 전하던 문제를 고쳤다.
- **작은 context 모델 전환 시 과금** — context가 더 작은 모델로 바꿀 때 묻지 않고 이전 모델로 요약해 사용량 크레딧을 쓰던 문제를 고쳤다.
- **LLM 게이트웨이 반복 압축** — 응답에 요청과 다른 모델 이름을 적어 보내는 LLM 게이트웨이 뒤에서, 고르지 않은 모델로 대화를 계속 압축하던 문제를 고쳤다.
- **vim Escape 후 INSERT 유지** — 느리거나 바쁜 기기에서 Escape를 눌러도 INSERT 모드에 남던 문제를 고쳤다.
- **AskUserQuestion 입력 소실** — vim 모드에서 Esc를 누르면 입력한 답이 사라지던 문제를 고쳤다. 이제 NORMAL 모드를 지원하고, NORMAL에서 누른 Esc만 취소로 처리한다.
- **Read 바이너리 오독** — .xlsm, .parquet, .epub, .heic 같은 바이너리 파일을 텍스트로 읽던 문제를 고쳤다.
- **헤더만 있는 표 미표시** — 헤더 행만 있는 Markdown 표가 터미널보다 넓으면 아무것도 안 그리던 문제를 고쳤다. 플랜 승인 카드도 포함한다.
- **`/claude-api` CMEK 안내 오류** — CMEK 외부 키 엔드포인트를 AWS의 Claude Platform에서 쓸 수 없다고 잘못 안내하던 문제를 고쳤다.
- **`/rewind` 후 스킬 목록 누락** — `/rewind`를 쓰면 모델에게 스킬 목록이 더 이상 전달되지 않던 문제를 고쳤다.
- **재개 세션 압축 행** — 불러오지 않은 기록을 ctrl+o로 보라고 안내하던 문제를 고쳤다. 이제 이전 메시지의 저장 위치를 보여 주고, fullscreen에서도 표시한다.
- **`/clear` 힌트 재등장** — 응답을 중단하자마자 "새 작업? /clear" 힌트가 다시 뜨던 문제를 고쳤다.
- **hook `ask` 출처 미표시** — 플러그인·스킬 hook이 `ask`로 권한을 물을 때 어느 플러그인·스킬의 hook인지 보여 주지 않던 문제를 고쳤다.
- **`/diff` reftable 충돌 감지** — reftable 저장소에서 git 확인이 시간 초과되거나 실패하면 충돌 난 cherry-pick·revert를 감지하지 못하던 문제를 고쳤다.
- **Bash `cd` 후 워크플로 스크립트 권한** — 같은 세션에서 Bash `cd`를 한 뒤 워크플로 스크립트를 읽거나 고치거나 다시 실행하면 권한을 묻거나 거부되던 문제를 고쳤다.
- **dark ANSI 테마 흐린 글씨** — 16색 터미널을 포함해 흐린 글씨 처리를 바로잡았다.
- **mod `$.model.fork` 조기 호출** — 첫 응답이 끝나기 전에 호출하면 `nothing-to-fork`를 반환하던 문제를 고쳤다.
- **Fullscreen 압축 중 멈춤** — `/compact`와 auto-compact 때 UI가 잠깐 멈추던 문제를 고쳤다.
- **Self-hosted runner Slack 세션** — MCP 서버가 제한된 환경에서 저장소를 찾지 못하던 문제를 고쳤다.
- **Self-hosted runner 브랜치 삭제 오판** — 관계없는 실패를 "소스 브랜치 삭제됨"으로 잘못 판정하던 문제를 고쳤다.
- **Self-hosted runner 재시도 로그** — 끝나는 세션인데도 재시도한다고 적던 로그를 고쳤다. 반복 실패 횟수도 표시한다.
- **Windows PowerShell `[killed]` 누락** — 멈춘 백그라운드 명령의 출력 파일 끝에 `[killed]` 줄이 빠지던 문제를 고쳤다.
- **작은 context 모델 전환 개선** — 대화가 새 모델에 비해 너무 길면 이전 모델로 먼저 요약한다.
- **subagent 진행 표시 성능** — 진행 기록을 매번 통째로 다시 처리하지 않고, 바뀐 부분만 갱신한다.
- **artifact sticky 헤더** — 고정 헤더 위쪽 여백을 칠해, 모바일 앱에서 스크롤된 글이 그 자리에 비치지 않는다.
- **mod 트리 확장** — VS Code·데스크톱·모바일에서 Markdown을 쓸 수 있고 최대 48행까지 담는다. 터미널은 일반 텍스트 12행을 유지한다.
- **mod hook `.catch` 동작 변경** — hook이 예외를 던지거나 시간 초과될 때만 실행한다.
- **mod `$.env.set` 반환값 변경** — 성공하면 `{}`를 반환하고, 쓰기가 막히면 이유를 담은 `{ deny }`를 반환한다.
- **[VSCode] 크래시 대화 재오픈** — 패널을 죽이거나 멈추게 한 대화가 새로고침할 때마다 다시 열리던 문제를 고쳤다.
- **[VSCode] 긴 thinking 중 느려짐** — thinking 텍스트 전체를 매번 다시 파싱하던 문제를 고쳤다.
- **[VSCode] 진단 `[object Object]` 표시** — 규칙 코드(예: MD013) 대신 `[object Object]`가 보이던 문제를 고쳤다.
- **[VSCode] 받아쓰기 모듈 불필요 로드** — 받아쓰기 기능이 없는 환경에서 받아쓰기 오디오 모듈을 불러오던 문제를 고쳤다.

## 🔑 이번 버전의 핵심 키워드
**"무인 실행과 판단 추적의 신뢰성"** — 무인 재시도의 대기 상한, auto mode 판단의 OTel 기록, 조용히 성공으로 넘어가던 실패(Grep·Glob, 워크플로 agent)를 바로잡은 버전이다.

---

# 📜 원문 (한글 번역본)

> 원문 ChangeLog를 원래 순서 그대로 한 줄도 빠짐없이 번역한 문서입니다.

- `CLAUDE_CODE_RETRY_WATCHDOG_MAX_USAGE_LIMIT_WAIT_MS` 추가. 무인 재시도 모드(`CLAUDE_CODE_RETRY_WATCHDOG`)에서 사용량 한도가 너무 먼 시점에 풀리면 기다리지 않고 요청을 끝낸다
- `claude-api` 스킬에 OpenTelemetry 추적 안내 추가. `ant` CLI로 추적 목적지를 설정하는 방법을 포함한다
- vim 모드에 `%` 모션 추가: 짝이 되는 괄호로 이동한다. 단독으로 또는 d/c/y와 함께 쓴다
- mod의 `Input`에 `rows` 추가: 터미널에서 여러 줄 텍스트 입력칸을 만든다. Enter는 제출, Shift+Enter 또는 Enter 앞의 백슬래시는 새 줄을 시작한다
- OpenTelemetry `tool_decision` 이벤트에 `classifier_verdict`와 `permission_mode` 추가. auto mode 분류기의 결정과 권한 규칙을 구분할 수 있다
- `OTEL_LOG_TOOL_DETAILS=1`일 때 OpenTelemetry `tool_decision` 이벤트에 `classifier_category` 추가. 분류기 차단이 일치한 기본 규칙의 이름을 남긴다
- 종료 시 `WorktreeCreate` hook이 만든 워크트리를, push되지 않은 커밋이 있을 수 있는데도 묻지 않고 제거하던 문제 수정
- 최신 Fable 모델을 조직에서 쓸 수 없을 때 `fable`(및 `best`) 모델 별칭이 Anthropic API에서 에러를 내던 문제 수정: 이제 이전 Fable 모델로 한 번 재시도한다
- 디스크가 가득 차 로그인을 갱신하지 못할 때 "Please run /login"이라는 오해의 소지가 있는 에러가 나던 문제 수정. 이제 디스크를 지목하고 파일을 지우라고 안내한다
- 검색 프로그램이 결과를 반환하기 전에 예기치 않게 실패하면 Grep과 Glob이 일치 항목 없음으로 보고하던 문제 수정. 이제 검색 실패 에러를 반환한다
- 워크플로 agent가 "작업 텍스트에 사용자 권한이 없다"는 harness 안내를 읽은 뒤 단계를 건너뛰고, 실행은 성공으로 보고되던 문제 수정
- PreToolUse hook이 Edit 또는 Write를 감시하는 환경에서 artifact 갱신이 거부되던 문제 수정. 이제 Claude는 게시 호출 안에서 바꾸지 않고, 파일을 편집한 뒤 다시 게시한다
- 인자 이름이 매우 많거나 긴 스킬·커맨드가 호출 시 몇 초간 멈추던 문제 수정. 이제 앞의 64개 이름만, 이름당 최대 64자까지 채운다
- 인자가 많은 placeholder를 채울 때 스킬·커맨드·hook이 메모리를 매우 많이 쓰던 문제 수정
- MATE Terminal(RHEL 8) 등 VTE 0.53 미만 기반 터미널에서 폴더 신뢰 프롬프트를 가리는 `>0q`, 종료 시 셸 프롬프트 앞의 `>4m` 같은 잡문자 문제 수정
- 일부 iTerm2 버전에서 시작 시 프롬프트에 `GOK` 문자가 나타나던 문제 수정
- 제공자가 Bedrock이 아닌데도 이름에 `application-inference-profile`이 포함된 모델로 전환하면 `awsAuthRefresh` 명령이 실행되고 모델 전환 hook이 지연되던 문제 수정
- `claude auth status`나 `claude plugin list` 같은 짧은 명령이 토큰 갱신 도중 종료된 뒤 로그인 갱신 시간 초과와 예기치 않은 로그아웃이 발생하던 문제 수정
- 권한 확인 중 턴 중간에 보낸 메시지로 끊긴 도구 호출이 모델에게 사용자 거부로 보고되던 문제 수정
- 더 작은 context window 모델로 전환할 때 묻지 않고 이전 모델의 요약에 사용량 크레딧을 쓰던 경우 수정
- 요청한 모델과 다른 모델 이름을 응답에 담는 LLM 게이트웨이 뒤에서, 고르지 않은 모델로 대화가 반복 압축되던 문제 수정
- 느리거나 바쁜 기기에서 vim 모드가 Escape 후에도 INSERT에 머무는 문제 수정
- vim 모드에서 Esc가 입력한 AskUserQuestion 답변을 지우던 문제 수정: 자유 입력 칸이 이제 vim NORMAL 모드를 지원하고, Esc는 NORMAL에서만 취소한다
- Read 도구가 .xlsm, .parquet, .epub, .heic 같은 바이너리 파일을 텍스트로 읽던 문제 수정
- 헤더 행만 있는 Markdown 표가 터미널보다 넓으면 아무것도 그리지 않던 문제 수정. 플랜 승인 카드의 플랜도 포함한다
- /claude-api 스킬이 AWS의 Claude Platform에서 CMEK 외부 키 엔드포인트를 쓸 수 없다고 말하던 문제 수정
- `/rewind` 사용 후 스킬이 모델에게 더 이상 나열되지 않던 문제 수정
- 재개한 세션의 압축 행이 불러오지 않은 기록에 ctrl+o를 제안하던 문제 수정. 이제 이전 메시지가 저장된 위치를 알려 주고, fullscreen에서도 표시한다
- 응답을 중단한 직후 "new task? /clear to save tokens" 힌트가 다시 나타나던 문제 수정
- 플러그인·스킬 hook의 `ask` 결정에 대한 권한 프롬프트가 hook의 출처 플러그인·스킬을 보여 주지 않던 문제 수정
- reftable 저장소에서 git 확인 중 하나가 시간 초과되거나 실패하면 `/diff`가 충돌 난 cherry-pick·revert를 감지하지 못하던 문제 수정
- 같은 세션에서 Bash `cd` 후 워크플로 스크립트를 읽거나 편집하거나 다시 실행할 때 권한을 묻거나 거부되던 문제 수정
- dark ANSI 테마와 16색 터미널의 흐린 글씨 수정: 채워진 상자 안에서는 흐리게, 선택·검색 강조 아래에서는 흐리지 않게, 목록 설명은 다른 보조 텍스트처럼 흐리게 표시한다
- `claude -p` 실행이나 cloud 세션처럼 새 Claude Code 프로세스의 첫 응답이 끝나기 전에 호출하면 mod의 `$.model.fork`가 `nothing-to-fork`를 반환하던 문제 수정
- Fullscreen 모드: 보이는 대화 기록을 다시 만드는 동안 `/compact`와 auto-compact가 UI를 잠시 멈추던 문제 수정
- Self-hosted runner: managed settings가 MCP 서버를 제한할 때 Slack에서 시작한 세션이 저장소를 찾거나 연결하지 못하던 문제 수정. 해당 도구를 막으려면 `deniedMcpServers`를 쓴다
- Self-hosted runner: 관련 없는 설정·세션 실패 메시지에 git의 ref 누락 문구가 인용되면, 세션의 소스 브랜치가 삭제된 것으로 보고되고 재시도되지 않던 문제 수정
- Self-hosted runner: 종료 중인 세션에 대해, 실패하거나 거절된 세션 해제를 재시도한다고 로그에 적던 문제 수정. 반복 실패는 이제 횟수를 표시한다
- Windows: 멈춘 백그라운드 PowerShell 명령의 출력 파일에 마지막 `[killed]` 줄이 빠지던 문제 수정
- 더 작은 context window 모델로 전환하는 동작 개선: 새 모델에 비해 너무 긴 대화는 이전 모델이 먼저 요약한다
- 오래 실행되는 subagent 작업 중 렌더링 성능 개선: 진행 기록을 렌더링마다 통째로 다시 처리하지 않고 점진적으로 갱신한다
- artifact 개선: Claude가 쓰는 페이지가 sticky 헤더 위쪽 영역을 칠해, 모바일 앱에서 스크롤된 글이 그 자리에 보이지 않는다
- mod 개선: VS Code와 데스크톱·모바일 앱에서 질문 대화상자 위에 그리는 트리가 Markdown과 최대 48행을 담을 수 있다. 터미널은 일반 텍스트 12행을 유지한다
- mod hook의 `.catch` 핸들러가 hook이 예외를 던지거나 시간 초과될 때만 실행되도록 변경. hook 자신의 호출 아래에서 발생한 이벤트는 그 hook의 `.catch`를 거치지 않고 건너뛴다
- mod의 `$.env.set`이 변수를 설정하거나 해제하면 `{}`로, 쓰기가 이루어지지 않으면 이유를 담은 `{ deny }`로 resolve되도록 변경
- [VSCode] Claude 응답의 LaTeX 수식 렌더링 추가. `$$`와 여러 줄 `\[ … \]` 블록, 인라인 `$…$`·`\(…\)` 수식을 포함한다
- [VSCode] VS Code와 JetBrains 패널의 사용량 한도 배너에 Pro·Max 요금제용 "Get more usage" 링크 추가
- [VSCode] 패널을 크래시시키거나 멈추게 한 대화가 새로고침할 때마다 다시 열리던 문제 수정
- [VSCode] 긴 thinking 중 채팅 패널이 느려지던 문제 수정: 업데이트마다 thinking 텍스트 전체를 다시 파싱하지 않는다
- [VSCode] 일부 language server에서 진단이 규칙 코드(예: MD013) 대신 "[object Object]"로 표시되던 문제 수정
- [VSCode] 받아쓰기를 제공하지 않는 환경(claude.ai 외 로그인, 원격 창)에서 마이크 권한을 확인하려고 네이티브 받아쓰기 오디오 모듈을 불러오던 문제 수정

---

## 🎯 챌린지

이번 버전에서 내 환경에 적용해볼 만한 항목입니다.

### 1. 체인지로그 cron 작업에 사용량 한도 대기 상한 걸기
- **파일**: `~/.claude/skills/claude-changelog-sync/` (매일 08:00 cron이 `claude -p --model opus`를 실행하는 스크립트)
- **근거**: 이 cron은 사람이 지켜보지 않는다. 사용량 한도에 걸리면 한도가 풀릴 때까지 몇 시간씩 멈출 수 있다. 실행 환경에 `CLAUDE_CODE_RETRY_WATCHDOG=1`과 `CLAUDE_CODE_RETRY_WATCHDOG_MAX_USAGE_LIMIT_WAIT_MS`(예: `1800000` = 30분)를 넣으면, 한도가 30분 넘게 남았을 때 기다리지 않고 바로 끝난다. 그날 실패하면 다음 날 실행에서 다시 동기화한다.
- **난이도**: ★☆☆ (약 10분)

### 2. auto mode 판단을 OTel 로그로 확인하기
- **파일**: `~/.claude/settings.json` (`env` 블록)
- **근거**: `autoMode.environment`를 직접 설정해 두었지만, 분류기(요청을 허용할지 막을지 정하는 판단기)가 어떤 근거로 막았는지는 지금 볼 방법이 없다. `CLAUDE_CODE_ENABLE_TELEMETRY=1`, `OTEL_LOGS_EXPORTER`, `OTEL_LOG_TOOL_DETAILS=1`을 설정하면 `tool_decision` 이벤트에 새로 생긴 `classifier_verdict`·`permission_mode`·`classifier_category`가 남는다. 이 값으로 `deploy-guard.sh` hook의 차단과 분류기의 차단을 구분하고, `autoMode.environment` 문구를 손볼 근거로 쓴다.
- **난이도**: ★★★ (약 25분)
