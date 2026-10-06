# Claude Code v2.1.292

> 작성일: 2026-10-07

---

# 📋 요약본

## 🎉 신기능 (8건)
- **`claude plugin install --marketplace <source>`** — 플러그인을 설치할 때 마켓플레이스가 없으면 먼저 추가한 뒤 그 마켓플레이스에서 설치한다. `claude plugin marketplace add`와 같은 정책 검사를 거친다.
- **Agent tool `effort` 파라미터** — 서브에이전트를 원하는 effort 수준(생각을 얼마나 깊게 할지 정하는 단계)으로 실행한다. 모델과 effort를 따로 정할 수 있다.
- **`CLAUDE_CODE_OVERLOADED_RETRY_BASE_DELAY_MS` 환경변수** — 서버 과부하(529) 응답 뒤 재시도할 때 처음 기다리는 시간을 더 길게 잡는다.
- **mod용 `prompt.autocomplete` 이벤트** — mod가 프롬프트 입력창의 자동완성 목록에 자기 항목을 추가한다.
- **`$.model.complete` 프롬프트 캐싱** — `prompt`·`system`을 텍스트 블록 단위로 받는다. 블록에 `cache: true`를 붙이면 요청의 그 블록까지 캐시한다.
- **`agent.spawn` hook에 workflow agent 포함** — workflow 에이전트도 run 정보·index와 함께 넘어온다. mod가 실행을 거부할 수 있다.
- **[Claude Tag] Allowed domains 카드 Edit 버튼** — Enterprise 관리자가 채널 도메인을 정하는 access bundle을 바로 연다.
- **[Code Review] 분석 차트 확장** — 리뷰한 PR 차트에 기간 합계, 이전 기간 대비 변화, 레포별 분류가 추가됐다.

## 🛠️ 개선/수정 (16건)
- **보안·샌드박스 수정** — 샌드박스 안의 명령, 파일 링크 바꿔치기, 정책 캐시 위조, UNC(Windows 네트워크 공유 경로) 읽기로 권한을 우회하던 경로를 막았다.
  - `/ultrareview` 업로드 사본(`~/.claude/seed-admin`) 읽기를 차단했다.
  - PreToolUse hook 승인이나 auto mode로 UNC 경로 파일을 읽을 때 권한 확인 창이 건너뛰어지던 문제를 고쳤다.
  - Windows 8.3 짧은 이름으로 홈 폴더·드라이브를 `rm -rf`하는 명령을 이제 홈 폴더·드라이브 삭제로 판정한다.
- **권한·모드 정합성** — `permissionMode: auto` 서브에이전트가 auto mode를 쓸 수 없는 상황에서도 auto mode로 들어가던 문제를 고쳤다. 턴 중간에 auto/plan mode를 빠져나오면 `allowed-tools` 규칙이 다음 턴에 되살아나던 문제도 고쳤다.
- **`claude -p`·SDK 안정성** — 최종 결과 5초 뒤 백그라운드 명령이 끊기던 문제와 예약 wakeup이 버려지던 문제를 고쳤다. 이제 둘 다 끝날 때까지 기다린다. 첫 턴이 HTTP/SSE MCP의 `resources/list` 응답을 기다리지 않아 시작이 빨라졌다.
- **세션 재개·예약 작업** — `--resume`·`/resume` 뒤 plan mode가 복원된다. `/resume`·`/branch`·`/clear` 뒤 만든 예약 작업도 실행된다. 프로세스가 재시작돼도 `/loop`가 멈추지 않는다.
- **도구 결과 정확성** — 읽을 수 없는 경로에서 Grep·Glob이 "결과 없음"으로 답하던 문제를 고쳤다. PDF `pages`에 "6,9,15" 같은 목록을 주면 이제 오류를 낸다. 256KB를 넘는 @-mention 파일은 크기를 알리고 나눠 읽게 한다.
- **도구 입력 관용** — Grep이 `path` 대신 `file_path`도 받는다. Write·WebFetch·Read는 엉뚱한 파라미터가 섞여도 무시하고 실행한다.
- **hook 출력 이스케이프** — hook 출력에 들어 있는 `<system-reminder>` 태그를 Claude에 전달하기 전에 이스케이프한다(태그로 인식되지 않게 바꾼다).
- **네트워크·MCP** — `HTTPS_PROXY`가 설정돼 있어도 `NO_PROXY`가 적용된다. 이름이 128자를 넘는 MCP 도구는 목록에서 빠지고 오류 메시지에 이름이 표시된다. 새 프로토콜 확인을 무시하는 stdio MCP 서버는 7일 동안 기억해 기다리지 않고 연결한다.
- **MCP 프로토콜 기본값 변경** — 로컬(stdio) MCP 서버는 기본으로 `2026-07-28` 프로토콜 버전을 협상한다. 예전 방식이 필요하면 `MCP_PROTOCOL_NEGOTIATION=legacy`로 되돌린다.
- **입력창 UX** — 겹친 붙여넣기, vim mode 커서 위치, `/add-dir` 줄바꿈, 빠른 타이핑 시 글자 누락, iTerm2 fullscreen 화면 지우기 문제를 고쳤다. Ctrl+C로 지운 초안을 Up 키로 다시 불러올 수 있다.
- **렌더링·표시** — 긴 목록형 답변의 렌더링이 빨라졌다. mod가 도구 호출을 거부한 이유가 화면에 표시된다. "instruction file not loaded" 안내가 정확해졌다.
- **plugin·mod hook 엔진 다수 수정** — hooks worker가 재시작되는 동안 권한 hook이 빠지던 문제, `next(e)` 이후 거부가 잘못 처리되던 문제, `tool.check`가 허용했을 때 질문 창이 생략되던 문제, guard `.catch`가 건너뛰어지던 문제 등을 고쳤다. `claude plugin test`·`validate` 판정도 엄격해졌다.
- **플러그인 설치 순서** — 첫 실행에서 조직 managed settings가 로드되기 전에 `claude plugin` 명령이 실행되던 문제를 고쳤다. 공식 Anthropic 마켓플레이스처럼 보이는 이름에 대한 안내 단계를 개선했다.
- **샌드박스 auto-allow 개선** — strict sandbox mode에서 `FOO=bar python3 app.py`처럼 앞에 환경변수가 붙은 인터프리터 명령도 확인 창 없이 실행된다.
- **Cloud·Remote Control·desktop** — 클라우드 세션의 턴 종료 표시, 권한 재질문, 알림 유실, thinking 설정 유실, 루틴 상태, 이미지 첨부를 고쳤다. Artifact 목록을 한 번에 200개까지 본다.
- **[Claude Tag]·[Code Review]** — Slack 스레드 응답 지연·모델 미반영·잘못된 지출 한도 안내·세션 멈춤을 고쳤다. 리뷰 대상 PR이 CLAUDE.md를 수정하면 base 브랜치의 CLAUDE.md를 기준으로 리뷰한다.

## 🔑 이번 버전의 핵심 키워드
**"권한 우회 봉쇄와 자동화 실행의 신뢰성"**: 샌드박스·hook·mod의 빈틈을 막고, `-p`·예약 작업·`/loop` 같은 무인 실행이 끝까지 돌도록 다졌다.

---

# 📜 원문 (한글 번역본)

> 원문 ChangeLog를 원래 순서 그대로 한 줄도 빠짐없이 번역한 문서입니다.

- `claude plugin install`에 `--marketplace <source>` 추가: 필요하면 `claude plugin marketplace add`와 같은 정책 검사를 거쳐 마켓플레이스를 추가한 뒤, 그 마켓플레이스에서 플러그인을 설치한다
- Agent tool에 `effort` 파라미터 추가: Claude가 요청한 effort 수준으로 서브에이전트를 실행한다
- 과부하(529) 요청 재시도 backoff의 기본 지연을 더 길게 잡는 `CLAUDE_CODE_OVERLOADED_RETRY_BASE_DELAY_MS` 환경변수 추가
- mod가 hook으로 프롬프트 입력창 자동완성 목록에 자기 항목을 추가하는 이벤트 `prompt.autocomplete` 추가
- mod용 `$.model.complete`에 프롬프트 캐싱 추가: `prompt`와 `system`은 텍스트 블록을 받고, 블록에 `cache: true`를 붙이면 그 블록까지의 요청을 캐시한다
- `agent.spawn` mod hook에 workflow agent를 run·index와 함께 추가해, mod가 이를 거부할 수 있다
- `permissionMode: auto`인 서브에이전트 정의가 auto mode를 쓸 수 없을 때(설정으로 비활성, circuit breaker, 미지원 모델)에도 auto mode에 들어가던 문제 수정
- 샌드박스 명령이 `~/.claude/seed-admin` 아래 `/ultrareview` 업로드용 스테이징 사본을 읽을 수 있던 문제 수정
- 세션 중에 생기거나 대상이 바뀐 managed sandbox read-deny 경로(및 그 옆의 사용자 경로)가 그 안의 프로젝트 권한을 회수하지 않고, 해당 파일에서의 credential 주입도 끝내지 않던 문제 수정
- macOS·Windows에서 notebook이나 PDF를 읽는 중 링크가 바꿔치기되면 승인 범위 밖의 파일이 반환될 수 있던 문제 수정
- 설정 fetch가 실패한 동안 위조된 server-managed settings 디스크 캐시가 내장 정책 플러그인을 끄거나 밀어낼 수 있던 문제 수정
- 홈 폴더나 드라이브의 8.3 짧은 이름 또는 다른 Windows 대체 표기에 대한 `rm -rf`가 해당 폴더 삭제로 취급되지 않던 문제 수정
- 보안: PreToolUse hook 승인과 auto mode가 네트워크(UNC) 경로 파일 읽기에 대해 권한 확인 창을 우회하던 문제 수정
- 턴 중간에 auto mode나 plan mode를 빠져나오면 skill·slash command의 `allowed-tools` 규칙이 이후 턴에 되살아나던 문제 수정
- `HTTPS_PROXY`가 설정된 경우 Claude Code 자체 API 요청(로그인, 정책, 피드백, artifacts)에서 `NO_PROXY`가 무시되던 문제 수정
- 이름이 128자를 넘는 MCP 도구 때문에 모든 요청이 실패하던 문제 수정. 이제 해당 도구는 제외되고 MCP 오류가 그 이름을 알려준다
- 첫 실행에서 조직 managed settings가 로드되기 전에 `marketplace add`·`install` 같은 `claude plugin` 명령이 실행되던 문제 수정
- one-shot `claude -p`와 Agent SDK 실행이 최종 결과 5초 뒤 백그라운드 명령을 멈추던 문제, one-shot `claude -p`가 예약된 wakeup을 버리던 문제 수정. 이제 둘 다 기다린다
- `claude --resume` 세션 선택기나 `/resume`로 세션을 재개할 때 plan mode가 복원되지 않던 문제 수정
- `/resume`·`/branch`·`/clear` 뒤에 만든 저장된 예약 작업이 실행되지 않던 문제, 작업 파일에 수 밀리초 간격으로 두 번 쓰면 이후 생성·삭제를 무시하던 문제 수정
- 백그라운드 세션의 `/loop`가 프로세스 재시작(예: 크래시) 시 대기 중인 wakeup이 사라져 조용히 멈추던 문제 수정
- 주어진 파일·폴더를 읽을 수 없을 때 Grep·Glob이 일치 항목 없음으로 보고하던 문제 수정. 이제 Claude가 한 번 재시도하거나 알려준다
- PDF `pages`가 "6,9,15" 같은 목록이면 Read 도구가 오류 없이 첫 항목만 반환하던 문제 수정. 이제 페이지나 범위를 하나씩 읽으라는 오류를 반환한다
- 256KB를 넘는 @-mention 텍스트 파일이 조용히 빠지던 문제 수정. 이제 Claude에게 파일 크기와 나눠 읽으라는 안내가 전달된다
- 이미 메인 대화를 멈춘 한도로 백그라운드 에이전트들이 실패할 때 사용량 한도 알림이 에이전트마다 반복되던 문제 수정
- desktop app이나 IDE가 호스팅하는 세션에서 Remote Control 시청자에게 백그라운드 서브에이전트 창이 비어 보이던 문제 수정
- 세션 간 전달 알림이 이름이 비슷한 두 세션을 한 수신자로 보여주던 문제, 터미널 세션이 메시지를 만료시켰는데 만료 알림이 desktop app 탓으로 표시하던 문제 수정
- desktop app에서 다른 메시지가 이미 대기 중일 때 Send now가 턴이 기다리던 서브에이전트를 종료하던 문제 수정
- 리포트 전송 중 Ctrl+O나 Ctrl+Z를 누르면 `/bug`·`/share`·`/feedback <text>`가 처음부터 다시 시작하던 문제, 전송 뒤 취소로 닫히던 문제 수정
- 바로 Enter를 누르면 `/remote-env`가 저장된 기본 환경을 바꾸던 문제 수정: 목록이 기본 환경에서 열리고, 기본값이 없으면 체크 표시가 없다
- 한 프롬프트에서 여러 붙여넣기가 겹칠 때 일부 붙여넣은 텍스트가 타이핑한 텍스트로 전달되던 문제 수정
- vim mode에서 커서가 줄 끝을 넘어가던 문제, 짧은 줄에서 j/k가 열 위치를 잃던 문제, `f`/`t`/`F`/`T`/`;`/`,`가 프롬프트의 다른 줄에 있는 일치 항목으로 이동하거나 거기까지 삭제하던 문제 수정
- `/add-dir` 경로 입력창에서 Shift+Enter나 붙여넣기로 줄바꿈이 들어가던 문제, 빠르게 친 "tab"·"up"·"down"을 해당 키로 처리하던 문제 수정
- 프롬프트 footer 행이 선택된 동안 빠른 타이핑, 입력기 텍스트, 분해된 악센트가 누락되던 문제, `!`가 행 선택을 유지하던 문제 수정
- iTerm2가 감지되면 fullscreen mode가 창 크기 변경과 Ctrl+L마다 전체 화면 지우기를 보내던 문제 수정. iTerm2 scrollback이 오래된 페이지로 채워지던 원인일 수 있다
- Read deny 규칙이 설정되고 작업 디렉토리가 symlink 아래일 때 파일을 가리키지 않는 @-word에 엉뚱한 "could not be examined" 안내가 뜨던 문제 수정
- `/cd`나 권한 변경 뒤 "instruction file not loaded" 줄이 낡거나 빠지던 문제 수정, 중첩된 파일이 로드되지 않으면 transcript에 한 줄 추가
- `/name`을 반복한 compaction 요약이 사용자 전용 skill을 Claude가 호출하게 만들던 문제 수정
- Write·Edit·NotebookEdit·LSP 행과 단일 Read·Grep·Glob 행이 mod의 거부 이유를 숨기던 문제 수정: 이제 행에 이유가 표시된다
- 턴이 끝나는 순간 worker가 멈추면 클라우드 세션이 끝나지 않은 턴을 보여주던 문제 수정
- transcript가 큰 클라우드 세션이 이미 승인된 권한을 다시 묻던 문제 수정
- Claude가 알림을 읽는 중 메시지가 재시도·편집되면 클라우드 세션에서 예약 작업 등 대기 알림이 사라지던 문제 수정
- 세션 컨테이너가 재시작되면 클라우드 세션이 클라이언트에서 고른 thinking 설정을 잊던 문제 수정
- Anthropic이 조직 설정을 확인하지 못했을 때 Cowork 클라우드 세션이 프록시가 artifacts를 막았다고 표시하던 문제 수정
- hooks 모듈이 하나의 const를 통해 `$.state`를 많이 호출하는 플러그인의 로드·검증에 수 분이 걸리던 문제 수정
- `claude plugin validate`가 엔진이 다른 곳에서 읽는 hooks 모듈의 matcher나 state 값을 나열하던 문제 수정
- `claude plugin validate`가 다시 선언되거나 재할당된 최상위 `var`를 통해 읽은 `$.state` 값을 나열하던 문제 수정. 이런 모듈은 이제 거부된다
- 플러그인이 제공한 `$` 메서드가 hook origin을 재시작해, 위에 `.catch`가 있는 guard hook이 끝없이 다시 실행될 수 있던 문제 수정
- 플러그인 hooks worker 재시작 중 실행된 plugin interface 호출이 다른 플러그인이 건 hook 없이 실행되던 문제 수정
- `next(e)` 호출 후 거부하는 mod의 `config.set`·`state.set`·`env.set`·`agent.spawn` hook이 거부로 응답되던 문제 수정: 이제 해당 hook이 이름과 함께 실패로 보고된다
- `/theme`, `/config` Theme 메뉴, 첫 실행 테마 단계가 플러그인의 `config.set` hook에 묻기 전에 테마를 저장하던 문제 수정
- 플러그인의 `tool.check` hook이 allow로 답하면 사용자 답이 필요한 도구(질문, plan 승인)가 대화상자 없이 실행되던 문제 수정
- hooks worker가 교체되면 mod의 시작 프롬프트·명령·서브에이전트가 두 번 대기열에 들어가던 문제 수정
- `next(e)` 호출 후 턴이 중단된 동안 실패한 mod hook이 호출을 통과시키던 문제 수정. 이제 호출이 거부된다
- 이유가 4,096자를 넘으면 플러그인의 프롬프트 drop이나 설정 deny가 무시되던 문제 수정
- 사용자가 설치한 mod가 추가한 `$` 이름을 조직 플러그인이 반환하면, 자체 재로드나 다른 플러그인 크래시 뒤 조직 플러그인이 언로드되던 문제 수정. 이제 mod가 언로드된다
- 플러그인 hooks worker 재시작 중 실행된 도구 호출이 플러그인 권한 hook 없이 응답되던 문제 수정
- 플러그인 `tool.call` hook이 잘못된 파라미터 이름이 고쳐지기 전의 도구 호출을 보던 문제 수정. 이제 hook은 도구가 실제로 실행할 인자를 본다
- 다른 mod의 hook이 guard 자신의 `$` 호출 아래에서 만든 호출에 대해, `.catch`가 있는 mod guard hook이 조용히 건너뛰어지던 문제 수정. 이제 그 `.catch`가 호출된다
- `claude -p`와 SDK 세션 시작 개선: 첫 턴이 HTTP·SSE MCP 서버의 `resources/list` 응답을 기다리지 않는다
- 긴 글머리표·번호 목록 답변의 렌더링 속도 개선: 스트리밍, 크기 조정, transcript(ctrl+o) 다시 열기가 훨씬 빠르다
- Ctrl+C 초안 복구 개선: 지운 프롬프트를 slash command나 메시지 전송 뒤에도 Up으로 불러올 수 있다
- hook 출력 처리 개선: hook 출력에 쓰인 `<system-reminder>` 태그가 Claude에 도달하기 전에 이스케이프된다
- 도구 입력 처리 개선: Grep이 `path`로 `file_path`를 받고, Write·WebFetch·Read는 몇몇 엉뚱한 파라미터를 실패 대신 무시한다
- 설정 파일에 선언된 마켓플레이스 이름이 공식 Anthropic 마켓플레이스처럼 보일 때 보여주는 안내 단계 개선
- 샌드박스 auto-allow 개선: user·managed·--settings 설정에 strict sandbox mode가 있으면 `FOO=bar python3 app.py`처럼 환경변수 prefix가 붙은 인터프리터 명령이 확인 없이 실행된다
- Artifact 도구 목록 개선: Claude가 게시된 artifact 수를 알고 한 번에 50개 대신 200개까지 나열한다
- 재시작 후 클라우드 세션 개선: 멈춘 백그라운드 에이전트 중 id로 재개할 수 있는 것을 Claude에게 알려준다
- 브라우저에 연결할 수 없을 때 claude.ai 클라우드 세션의 Claude in Chrome 메시지 개선: 사용자가 원하면 대안으로 계속해도 된다고 Claude에게 알린다
- /focus 팁 개선: 턴 중간에 focus view를 써보라고 안내하고 되돌아가는 법을 보여준다
- 새 프로토콜 확인을 무시하는 로컬(stdio) MCP 서버로 시작하는 속도 개선: 한 번 느리게 연결되면 7일 동안 기억해 기다림 없이 예전 방식으로 연결한다
- 로컬(stdio) MCP 서버 연결이 Bedrock·Vertex·Foundry를 포함한 모든 설치에서 기본으로 프로토콜 버전 2026-07-28을 협상하도록 변경. `MCP_PROTOCOL_NEGOTIATION=legacy`로 끌 수 있다
- `claude plugin test` 변경: 테스트가 등록한 hook 안의 `expect` 실패나 엔진이 거부한 stub 응답이 조용히 통과하지 않고 테스트를 실패시킨다
- 사용량 한도 메시지가 claude.ai 설정 링크를 https://로 쓰도록 변경해 터미널과 앱에서 클릭할 수 있다
- 예약 실행과 Run now 루틴 실행이 승인 요청 없이 본인만 보는 새 artifact를 게시하도록 변경. connector나 다른 접근을 요청하는 artifact는 여전히 묻는다
- 에이전트 이름을 최대 256자로 제한하도록 변경: 더 긴 이름은 거부되고, skill이나 플러그인 파일의 256자 초과 `name`은 무시된다
- [Cloud sessions] 루틴 실행이 끝난 뒤에도 몇 시간 동안 실행 중으로 표시되던 문제 수정
- [Cloud sessions] 저장된 알림 설정이 없는 루틴을 편집·복제하면 push 알림이 꺼지던 문제 수정
- [Cloud sessions] SVG·HEIC·TIFF 등 흔하지 않은 이미지 파일 첨부가 실패하던 문제 수정. 이제 일반 파일로 첨부된다
- [Cloud sessions] 조직이 승인 필수로 지정한 connector 도구에 효과 없는 "Always allow"를 제시하던 문제 수정
- [Remote Control] claude.ai/code에서 시작한 새 Remote Control 세션의 첫 메시지가 이미지만 받던 문제 수정. 이제 이후 메시지처럼 PDF와 다른 파일도 받는다
- [Claude Tag] 채널 Configure 페이지의 Allowed domains 카드에 Edit 버튼 추가. Enterprise 관리자가 채널 도메인을 정하는 access bundle을 열 수 있다
- [Claude Tag] Claude가 Slack 스레드의 첫 요청을 처리하는 동안 보낸 답글이 그 요청이 끝날 때까지 보류되거나, 몇 초 간격으로 보내면 누락되던 문제 수정
- [Claude Tag] GitHub PR 활동이나 루틴으로만 깨어난 Slack 스레드가 관리자가 채널·워크스페이스 기본 모델을 바꾼 뒤에도 원래 모델에 머물던 문제 수정
- [Claude Tag] 실제 원인이 조직 사용 크레딧 소진인데 Slack에 지출 한도 알림을 게시하던 문제 수정
- [Claude Tag] Slack에서 답할 수 없는 권한 요청이 자동 거부되면 세션이 중단될 때까지 멈춰 있던 문제 수정
- [Claude Tag] 채널의 `@Claude !status`가 Claude가 태그 없는 메시지 읽기를 멈춘 시점·이유와 @-mention으로 다시 읽기 시작한다는 점을 알려주도록 개선
- [Claude Tag] `!fork`로 이어진 Slack 스레드의 첫 메시지를 출처·요청·요청자와 원 스레드 링크를 보여주는 카드로 변경
- [Claude Tag] 관리자 설정 Claude Tag 지출 한도 페이지의 조직 전체·기본 지출 한도 입력칸이 다른 곳을 클릭할 때가 아니라 Save나 Enter를 누를 때만 저장되도록 변경
- [Code Review] Code Review 분석의 PRs reviewed 차트에 기간 합계, 이전 기간 대비 변화, 레포별 분류 추가
- [Code Review] PR이 새 base 브랜치로 옮겨지고 이전 브랜치가 삭제되면 대기 중인 리뷰가 실패하던 문제 수정. 이제 커밋을 다시 리뷰 대기열에 넣는다
- [Code Review] PR이 CLAUDE.md를 수정하면 리뷰가 그 파일의 규칙을 무시하던 문제 수정. 이제 base 브랜치의 CLAUDE.md를 사용한다

---

## 🎯 챌린지

이번 버전에서 내 환경에 적용해볼 만한 항목입니다.

### 1. 서브에이전트 effort 규칙을 §5에 추가
- **파일**: `~/.claude/CLAUDE.md`
- **근거**: §5는 서브에이전트 모델을 Opus로 정하지만 effort(생각의 깊이)는 정하지 않는다. 이번 버전부터 Agent tool의 `effort` 파라미터로 서브에이전트마다 effort를 따로 정할 수 있다. 메인 세션은 `effortLevel: xhigh`를 쓴다. 단순 탐색(Explore)은 `medium`, 치명 등급 구현·리뷰는 `xhigh`처럼 §7.1 검증 등급에 맞춘 규칙 한 줄을 넣는다. 그러면 신뢰성을 지키면서 시간 초과를 줄인다.
- **난이도**: ★☆☆ (약 10분)

### 2. 매일 08:00 changelog 동기화의 529 재시도 간격 늘리기
- **파일**: `~/.claude/settings.json` (`env` 키)
- **근거**: `claude-changelog-sync`는 cron으로 매일 `claude -p --model opus`를 무인 실행한다. 서버 과부하(529)가 나면 짧은 간격으로 재시도하다 실패할 수 있다. `env`에 `"CLAUDE_CODE_OVERLOADED_RETRY_BASE_DELAY_MS": "5000"`을 추가하면 처음 기다리는 시간이 길어져 성공 확률이 높아진다. cron 스크립트에만 적용하려면 그 스크립트 안에서 `export`한다.
- **난이도**: ★☆☆ (약 5분)

### 3. stdio MCP 서버(blender·google-sheets) 연결 점검
- **파일**: `~/.claude.json` (`mcpServers` 항목) / 필요 시 `~/.claude/settings.json` `env`
- **근거**: 이번 버전부터 로컬 stdio MCP 서버는 기본으로 `2026-07-28` 프로토콜을 협상한다. 세션 시작 시 `blender`·`google-sheets`는 아직 연결 중이었다. `/mcp`로 두 서버가 정상 연결되는지 확인한다. 실패하거나 계속 느리면 `MCP_PROTOCOL_NEGOTIATION=legacy`를 넣어 원인이 새 프로토콜인지 가려낸다.
- **난이도**: ★★☆ (약 15분)
