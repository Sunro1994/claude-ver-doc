# Claude Code v2.1.281

> 작성일: 2026-09-27

---

# 📋 요약본

## 🎉 신기능 (13건)
- **Claude apps gateway `desktop` 정책 키 확장** — 새 Claude Desktop 키를 지원한다. `blockReadsOutsideWorkingDirectories`, `disableBypassPermissionsMode` 등이 포함된다.
- **Bedrock upstream `assume_role`** — gateway가 STS로 IAM 역할을 넘겨받아 Bedrock을 호출한다. 다른 AWS 계정의 역할도 쓸 수 있고, 개발자마다 세션을 따로 둘 수 있다.
- **Bedrock upstream `guardrail: {id, version}`** — upstream을 거치는 모든 요청에 Amazon Bedrock guardrail(요청 필터)을 적용한다. 모든 Bedrock upstream에 설정하거나, 아무 데도 설정하지 않아야 한다.
- **gateway `telemetry.resource_attributes`** — Claude Desktop과 `/login` 세션의 telemetry에 고정 라벨을 붙인다.
- **`settings.json`의 `"attribution": false`** — 커밋·PR에 붙는 작성자 표기를 모두 숨긴다.
  - 구버전 CLI는 이 값이 든 settings 파일을 통째로 건너뛴다. 여러 버전이 함께 쓰는 파일에는 객체 형태를 유지한다.
- **MCP URL-mode elicitation** — 2026-07-28 프로토콜로 연결된 MCP 서버가 Claude Code에 브라우저 인증 같은 흐름을 열도록 요청할 수 있다. 서버가 완료를 알려줄 수 없으면 대기 창을 띄워두지 않는다.
- **`claude plugin validate`의 MCP 검사** — 로드할 때 조용히 빠지는 `.mcp.json` 항목, 선언하지 않은 `${user_config.*}` 참조, 안전하지 않은 URL을 찾아 알려준다.
- **`/insights` auto mode 추천** — 최근 세션의 권한 확인 창 가운데 auto mode가 대신 처리할 수 있었던 개수를 추정해 보여준다.
- **목록 스크롤바** — fullscreen 모드의 `/skills`·`/mcp`·`/plugin` Installed 목록에 스크롤바가 생긴다. `/workflows`와 같은 방식이며, 클릭과 드래그가 된다.
- **[VSCode] auto mode 과금 전환 확인 창** — auto mode가 과금되는 classifier 요청으로 넘어갈 때 Continue/Stop 창을 띄운다.
- **[Web] Fast mode 스위치** — 요금제와 모델이 fast mode를 지원하면 cloud 세션 모델 메뉴에 스위치가 나온다.
- **[Web] GitHub 연결 바로가기** — GitHub 설정 팁에 설정 바로가기가, 저장소 선택기에 "Troubleshoot GitHub connection" 링크가 생긴다.
- **[Claude Tag] Stop 안내** — Slack에서 누가 응답을 멈췄는지, 이어가려면 @Claude를 부르라는 안내를 한 줄 남긴다.

## 🛠️ 개선/수정 (20건)
- **세션 재개 안정화** — 이전 turn을 바뀐 형태로 다시 보내 앞선 추론이 사라지던 문제를 고쳤다. 큰 세션이 마지막 몇 메시지만 복원되던 문제, 권한 확인 대기 중 재시작하면 prompt cache가 깨지던 문제도 고쳤다.
- **도구 호출 중에 끝난 세션 재개** — Claude가 그 호출을 보고, 결과를 알 수 없다는 안내를 받는다. 수동 재개할 때 숨은 "Continue" 메시지도 더는 넣지 않는다.
- **proxy·gateway 스트림 처리** — 중간에 잘린 응답을 완료로 표시하던 문제를 고쳤다. 이벤트가 중복되면 도구가 두 번 실행되던 문제, "Content block not found" 오류, stop reason이 사라지던 문제도 고쳤다.
- **재시도 크래시·무한 루프** — 재시도 중에 나던 "unrecoverable interface error"를 고쳤다. `--max-turns`를 무시하고 끝없이 재시도하던 문제도 고쳤다.
- **명령 치환 `rm` 보호** — `rm -rf "$(pwd)"`처럼 삭제 대상이 명령 치환 결과뿐인 재귀 `rm`은 auto 모드와 skip-permissions 모드에서도 확인을 받는다.
- **위험한 `rm` 확인 창 2분 대기** — auto 모드와 skip-permissions 모드에서 2분 안에 답이 없으면 거부하고 다른 명령을 쓰라는 힌트를 준다. `CLAUDE_CODE_DISABLE_DANGEROUS_RM_TIMEOUT=1`로 끈다.
- **dangerous-rm 검사 확대** — `$VAR/최상위디렉토리`, 작업 디렉토리에서 나온 변수, 백슬래시만 있는 대상도 잡는다.
- **auto mode 서버측 검토 확대** — 서버에서 classifier(명령 위험도 판별기)가 돌 때는 읽기 전용·sandbox 명령도 검토를 기다린다. 검토에서 걸리면 차단한다.
- **NUL 바이트 권한 규칙** — NUL 바이트가 든 권한 규칙이 wildcard처럼 넓게 매칭되던 문제를 고쳤다. 이제 아무것도 매칭하지 않는다.
- **`claude --bg` workspace trust** — 신뢰 확인을 받지 않은 디렉토리에서 백그라운드 세션을 시작하고 hook을 실행하던 문제를 고쳤다.
- **`--setting-sources` 전달** — teammate, `/bg`, `claude agents`, `--worktree --tmux` 세션에도 부모 세션의 제한을 넘긴다.
- **예약 작업·`/loop` 재발사** — 전달에 실패하면 매초 다시 발사되던 문제를 고쳤다.
- **macOS keychain** — keychain이 잠겨 있을 때 MCP OAuth 토큰이 사라지던 문제를 고쳤다.
- **MCP 연결** — `mcp_tool` hook은 서버 연결을 기다린다. URL 표기만 다른 같은 서버에 두 번 연결하던 문제도 고쳤다.
- **plugin CLI** — project scope의 uninstall·update 오류와 validate 오탐을 고쳤다.
- **UI 입력 버그** — Ctrl+C 두 번이 dialog를 닫지 않고 앱을 종료하던 문제를 고쳤다. 한꺼번에 들어온 키가 이전 선택에 적용되던 문제, vim 모드 여러 동작도 고쳤다.
- **시작·재개 속도** — git 읽기, telemetry, 모델 업그레이드 검사를 첫 화면 이후로 미뤘다. 긴 세션과 compact된 세션의 재개도 빨라졌다.
- **큰 CLAUDE.md 알림 확장** — instruction 파일 여러 개와 @-import를 합산해서 판단한다.
- **send now 동작 변경** — ctrl+enter는 turn을 취소하지 않고 실행 중인 도구를 백그라운드로 옮긴다.
- **목록 UI 통일** — `/mcp`·`/workflows`·`/skills`·`/plugin` 목록의 정렬, 페이지 이동, 좁은 터미널 표시 방식을 통일했다.

## 🔑 이번 버전의 핵심 키워드
**"재개·스트림·권한의 신뢰성 보강"** — 세션 재개와 proxy 스트림 처리의 빈틈을 대거 메우고, 무인 모드 `rm`과 권한 규칙의 구멍을 막았다.

---

# 📜 원문 (한글 번역본)

> 원문 ChangeLog를 원래 순서 그대로 한 줄도 빠짐없이 번역한 문서입니다.

- Claude apps gateway가 `desktop` 정책 블록에서 새 Claude Desktop 키를 지원한다. `blockReadsOutsideWorkingDirectories`, `disableBypassPermissionsMode` 등이 포함된다.
- Claude apps gateway의 Bedrock upstream에 `assume_role`을 추가했다. gateway가 STS로 넘겨받은 IAM 역할로 Bedrock을 호출한다. 필요하면 다른 AWS 계정의 역할을 쓰고, 선택적으로 개발자마다 세션을 하나씩 둔다.
- Claude apps gateway의 Bedrock upstream에 `guardrail: {id, version}`을 추가했다. 그 upstream으로 보내는 모든 요청에 Amazon Bedrock guardrail을 적용한다. 모든 Bedrock upstream에 설정하거나 아무 데도 설정하지 않는다.
- Claude apps gateway 설정에 `telemetry.resource_attributes`를 추가했다. Claude Desktop과 `/login` 세션의 telemetry에 고정 라벨을 붙인다.
- `settings.json`에 `"attribution": false`를 추가했다. 커밋·PR attribution을 모두 숨긴다. 구버전 CLI는 이 값이 든 settings 파일을 건너뛰므로, 여러 버전이 공유하는 파일에는 객체 형태를 유지한다.
- 2026-07-28 프로토콜 연결에 MCP URL-mode elicitation을 추가했다. 서버가 Claude Code에 브라우저 기반 흐름을 열도록 요청할 수 있다. 서버가 완료를 확인할 방법이 없으면 대기 dialog를 화면에 남기지 않는다.
- `claude plugin validate`에 MCP 서버 검사를 추가했다. 로드할 때 조용히 빠질 `.mcp.json` 항목, 선언하지 않은 `${user_config.*}` 참조, 안전하지 않은 URL을 보고한다.
- `/insights`에 auto mode 추천을 추가했다. 최근 세션에서 auto mode가 처리할 수 있었던 권한 확인 창 개수를 추정한다.
- fullscreen 모드의 `/skills`, `/mcp`, `/plugin` Installed 목록에 스크롤바를 추가했다. 지금 `/workflows`에 있는 것과 같다. 마우스가 목록 위에 있을 때 나타나고 클릭·드래그할 수 있다.
- API 요청을 재시도하는 동안 세션을 끝낼 수 있던 크래시("unrecoverable interface error")를 고쳤다.
- 모델이 파싱할 수 없는 도구 호출과 출력 한도 잘림을 번갈아 낼 때, turn이 `--max-turns`를 무시하고 끝없이 재시도하던 문제를 고쳤다.
- 재개한 세션이 이전 turn을 바뀐 형태로 다시 보내 API가 대화의 앞선 추론을 버릴 수 있던 문제를 고쳤다. 해당 경우는 병렬 도구 호출 turn, 서버가 재연결 중일 때의 MCP 도구 호출 입력이나 tool-search 결과, 로딩 turn이 중단된 tool-search 결과다.
- 매우 큰 세션을 재개하면 마지막 몇 메시지만 복원되던 문제를 고쳤다.
- 권한 확인 대기 중에 재시작한 뒤 재개한 세션이 이전과 다른 히스토리를 보내 그 지점부터 prompt cache가 깨지던 문제를 고쳤다.
- 도구 호출 중에 끝난 세션의 재개를 고쳤다. Claude가 그 호출을 보고 결과를 알 수 없다는 안내를 받는다. 수동 재개할 때 숨은 "Continue" 메시지를 더는 넣지 않는다.
- API가 더는 읽을 수 없는 이전 advisor 결과가 있는 세션이 매 turn 요청 하나씩 실패하고 앞선 추론을 반복해서 잃던 문제를 고쳤다. 이제 히스토리를 한 번 복구한다.
- tool search가 꺼진 상태(예: proxy나 gateway 뒤)에서 대화 중 MCP 서버 연결이 끊기거나 재개 후 아직 연결 중일 때 prompt cache가 사라지던 문제를 고쳤다.
- proxy나 gateway가 스트림을 정상 종료해 응답이 중간에 잘려도 경고 없이 완료로 표시되던 문제, 스트림 이벤트가 중복되면 도구 호출이 두 번 실행되던 문제를 고쳤다.
- proxy가 응답 중간에 스트림 이벤트를 누락하면 "Content block not found"로 실패하던 문제를 고쳤다. 이제 부분 응답을 보존하고, web search는 이미 도착한 결과를 유지한다.
- 스트림 마지막 이벤트 전에 연결이 끊기면 빈 완료 응답을 두 번 요청하던 문제를 고쳤다.
- proxy가 끝에 usage만 담은 frame을 보내면 stop reason이 사라지던 문제를 고쳤다.
- `CLAUDE_CODE_RETRY_WATCHDOG` 세션이 429/529 대기가 이어진 뒤 첫 5xx나 연결 끊김에 실패하던 문제, 5xx의 긴 `Retry-After`에 상한 없이 조용히 잠들던 문제를 고쳤다.
- 서버가 `Retry-After: 0`을 보내면 fast mode가 rate limit에 걸린 요청을 연달아 재시도하던 문제를 고쳤다.
- 도구가 너무 큰 이미지를 반환하면 형제 도구 호출이 응답 없이 계속 실행되거나 turn이 최종 메시지 없이 끝나던 문제를 고쳤다.
- 모델이 지나치게 긴 이름으로 도구를 호출한 뒤 대화가 "tool_use.name: String should have at most 200 characters"에 영구히 막히던 문제를 고쳤다.
- Claude Code가 자기 메모리 사용량을 읽지 못할 때(예: file descriptor 고갈) 도구 호출이 "Failed to get memory usage"로 실패하거나 실행 후 실패로 보고되던 문제를 고쳤다.
- 이전 assistant 메시지 내용이 plain string이면 `--input-format stream-json` 세션(Agent SDK, VS Code 확장)과 예약 cloud 세션이 매 turn 오류로 실패하던 문제를 고쳤다.
- 세션 중에 시작 디렉토리가 삭제되면 비대화형 세션(`-p`, Agent SDK)이 다음 turn에 실패하던 문제를 고쳤다.
- host가 handshake 도중 응답을 멈추면 host측(SDK) MCP 서버를 쓰는 headless 세션이 첫 메시지에서 멈추던 문제를 고쳤다. remote 세션은 이제 길어야 몇 초만 기다린다.
- MCP 서버나 plugin이 설정되지 않았는데도 대화형 시작이 managed-settings 네트워크 요청을 기다리던 문제를 고쳤다(약 80ms, 네트워크에 닿지 않으면 17초 이상).
- 3MB보다 큰 PDF를 읽거나 @-mention하면 응답 전에 최대 2분 지연되던 문제를 고쳤다.
- 특정 PDF 페이지를 읽는 Read를 중단해도 페이지 렌더가 최대 2분 동안 계속 돌던 문제를 고쳤다.
- 권한 dialog와 첨부 검사가 승인 전에 macOS의 `/.vol`, `/.nofollow`, `/.resolve` 아래 경로(네트워크 마운트에 닿을 수 있음)를 읽던 문제를 고쳤다.
- `rm -rf "$(pwd)"`처럼 대상이 명령 치환 결과뿐인 재귀 `rm`이 auto 모드와 `--dangerously-skip-permissions` 모드에서 확인 없이 실행되던 문제를 고쳤다. 이제 Bash allow 규칙이 있어도 확인을 받는다. `CLAUDE_CODE_DISABLE_SUBSTITUTION_RM_PROMPT=1`로 실행하면 예외다.
- NUL 바이트가 든 권한 규칙이 wildcard 매칭으로 확장되던 문제를 고쳤다. 이런 규칙은 이제 아무것도 매칭하지 않는다.
- sandbox `excludedCommands` 항목이 `git rev-parse --git-dir`, shell builtin과 이름이 같은 프로그램, `[WIP]`나 `#` 줄이 든 커밋 메시지와 매칭되지 않던 문제를 고쳤다.
- `CLAUDE_CODE_TMPDIR`를 설정하면 sandbox Bash 명령이 `$TMPDIR`에 쓰지 못하던 문제를 고쳤다.
- `claude --bg`가 workspace trust 확인을 통과하지 않은 디렉토리에서 백그라운드 세션을 시작하고 프로젝트 hook을 실행하던 문제를 고쳤다. 이제 먼저 신뢰를 묻고, 비대화형이면 종료한다.
- `--setting-sources`(와 SDK `settingSources`)가 생성된 세션에 전달되지 않던 문제를 고쳤다. teammate, `/bg`, `claude agents` 세션, `--worktree --tmux`가 부모의 제한을 이어받고 시작한다.
- Read, Write, Edit, NotebookEdit을 고쳤다. 파일 경로에 null 바이트가 있으면 turn 전체를 끝내지 않고 그 도구 호출만 명확한 오류로 실패한다.
- Write가 파일 경로나 내용을 두 파라미터 이름으로 같은 값씩 두 번 받으면 거부하던 문제를 고쳤다.
- headless·SDK 세션에서 작업 디렉토리 안의 `--add-dir` 디렉토리에 있는 CLAUDE.md와 rules 파일이 모델에 두 번 전송되던 문제를 고쳤다.
- 권한 확인 창과 sandbox 네트워크 접근 확인 창이 겹쳐 둘 다 답한 뒤에도 remote 세션이 오래된 확인 창과 함께 "needs approval"에 머물던 문제를 고쳤다.
- worker 재시작 직전에 끝난 백그라운드 agent를 cloud 세션이 Claude에 알리지 않던 문제를 고쳤다.
- remote 세션의 예약 routine·알림 turn이 첫 도구 호출 뒤에야 turn 시작 안내(새로 쓸 수 있는 도구, MCP 변경, 날짜, todo)를 받던 문제를 고쳤다.
- 전달에 실패한 예약 작업과 `/loop` wakeup이 매초 다시 발사되어 turn이 끝날 때 Claude Code가 종료될 수 있던 문제를 고쳤다.
- 조직 정책이 아직 로드되지 않았을 뿐인데 Remote Control이 "disabled by your organization's policy"라고 보고하던 문제를 고쳤다. 이제 가져오기를 재시도하고, 확인하지 못했다고 알린다.
- Claude Desktop, claude.ai, 모바일 앱에서 열도록 `claude remote-control`이 시작해 주는 Remote Control 세션에 Artifact 도구가 없던 문제를 고쳤다.
- login keychain이 잠겨 있을 때(예: 깨어난 직후) macOS 자격 증명 쓰기가 저장된 MCP OAuth 토큰을 버리거나 keychain 항목을 지우던 문제를 고쳤다.
- Claude Code가 종료되거나 갱신이 시간 초과되면 `gcpAuthRefresh`/`awsAuthRefresh` 로그인 프로세스가 계속 돌고(Windows에서는 localhost callback 포트를 쥐고) 남던 문제를 고쳤다.
- 다른 Claude Code 프로세스에서 로그인한 뒤에도 세션에 "Not logged in · Run /login" footer가 남고 claude.ai connector가 빠져 있던 문제를 고쳤다.
- 차단 이벤트(PreToolUse 등)의 `mcp_tool` hook이 MCP 서버 연결 중이면 건너뛰어지던 문제를 고쳤다. 이제 MCP 연결 timeout까지 기다린다.
- plugin이나 claude.ai connector와 직접 설정한 서버가 같은 서버 URL을 다르게 표기하면(호스트 대소문자, 기본 포트, 끝 슬래시) 두 번 연결하던 문제를 고쳤다.
- `MCP_CONNECTION_NONBLOCKING=0`이 `MCP_CONNECT_TIMEOUT_MS`를 따르지 않고 1초 만에 claude.ai connector를 포기하던 문제를 고쳤다.
- `--channels` plugin 항목을 설치된 plugin의 marketplace만으로 확인하던 문제를 고쳤다. 이제 설치된 plugin 이름도 항목과 일치해야 한다.
- `.claude-plugin/marketplace.json`도 있는 plugin 폴더 묶음에 `--plugin-dir`을 쓰면 안의 plugin들 대신 빈 plugin 하나를 로드하던 문제를 고쳤다.
- `claude plugin uninstall`이 활성화되지 않은 project scope plugin을 "enabled at project scope"라며 제거를 거부하던 문제를 고쳤다. `claude plugin disable`은 같은 plugin을 이미 비활성이라고 말하던 상황이다.
- `--scope`를 생략하면 `claude plugin update`가 project scope plugin에서 실패하던 문제를 고쳤다. 이제 user로 가정하지 않고 plugin이 설치된 scope를 찾는다.
- `claude plugin validate`가 plugin.json의 `privacyPolicyUrl`, `supportUrl` 등 목록 metadata 키를 알 수 없는 필드로 보고하던 문제를 고쳤다.
- 원격에 닿지 못해 `CLAUDE_CODE_PLUGIN_KEEP_MARKETPLACE_ON_FAILURE`가 기존 clone을 유지했는데도 `known_marketplaces.json`이 그 marketplace를 갱신된 것으로 기록하던 문제를 고쳤다.
- `/plugin` Errors 탭에서 마지막 오류를 해결한 뒤 확인 표시가 없던 문제를 고쳤다.
- 첫 작업이 진행 중일 때 Enter를 다시 누르면 `/plugin`이 같은 plugin의 uninstall이나 update를 한 번 더 시작하던 문제를 고쳤다.
- `/plugin`이 marketplace 소스를 확인하는 동안 `y`를 누르고 있으면, "Add marketplace?" 질문을 읽기도 전에 나타나는 순간 marketplace가 추가되던 문제를 고쳤다.
- `/permissions`의 삭제·디렉토리 제거 확인 창에서 포인터가 No에 있어도 `1`이 Yes로 답하던 문제를 고쳤다. `1`을 누르고 있으면 workspace 디렉토리가 연달아 제거될 수 있었다.
- thinking을 끌 수 없는 모델에서 Alt+T와 `/config`가 thinking 끄기를 제안하던 문제를 고쳤다. 이제 thinking은 켜진 채로 두고, 스위치 자리에 이유를 한 줄 보여준다.
- `/context` 합계가 마지막 응답 뒤에 추가된 메시지를 빼던 문제를 고쳤다. 이제 카테고리 합과 일치하며 status line보다 높게 나올 수 있다.
- API가 선택한 모델을 거부하면 `/model`이 원시 API 오류 JSON과 request ID를 보여주던 문제를 고쳤다. 이제 서버 메시지를 보여주고 모델이 바뀌지 않았다고 알린다.
- HTML 오류 페이지(proxy의 429·502 페이지 등)에서 온 API 오류가 페이지의 원시 markup을 출력하거나 HTTP 상태를 빠뜨리던 문제를 고쳤다. 서버 오류 텍스트가 줄바꿈으로 끝나면 오류 메시지가 두 줄로 나뉘던 문제도 고쳤다.
- 전송 중에 취소한 /feedback, /bug, /share 보고가 그래도 전송되던 문제를 고쳤다.
- dialog가 열린 동안 Remote Control Stop이 도착하면 /feedback, /bug, /share의 모든 전송이 "Couldn't send feedback"으로 실패하던 문제를 고쳤다.
- `/ide`가 실행 중인 IDE를 목록에 보여주면서 "No available IDEs detected"라고 표시하던 문제를 고쳤다.
- `/setup-bedrock`이나 `/setup-vertex`가 새 설정을 적용하려고 Claude Code를 재시작하면 터미널이 깨진 상태(크래시나 입력 깨짐)로 남던 문제를 고쳤다.
- `~/.claude.json`의 `respectGitignore`나 `copyFullResponse`가 `null`이면 `/config`가 종료되던 문제를 고쳤다.
- Claude가 객관식 질문을 하는 동안 /rename으로 정한 세션 이름이 사라지던 문제를 고쳤다. 나란히 띄운 세션을 계속 구분할 수 있다.
- VS Code나 Remote Control에서 온 prompt, 펼친 paste placeholder에서 한 줄 붙여넣기가 보낸 메시지에 따로 줄을 차지하던 문제를 고쳤다.
- Claude가 작업 중일 때 대기열에 넣은 메시지가 작성 당시의 IDE 선택 영역을 잃거나 바꾸던 문제, 대기열 메시지가 선택 영역을 보여주지 않던 문제를 고쳤다.
- Shift+Tab을 빠르게 두 번 누르면 엉뚱한 권한 모드에 도착하던 문제를 고쳤다.
- 남은 dialog와 picker에서 Ctrl+C나 Ctrl+D를 두 번 누르면 dialog를 닫지 않고 Claude Code를 종료하던 문제를 고쳤다. 해당 화면은 `/memory`, `/hooks`, `/mcp`(서버 로그인 화면 포함), `/export`, `/copy`, `/theme`, `/teleport`의 미커밋 변경·로그인 확인 창(Esc도 종료했음) 등이다.
- 한꺼번에 들어온 키(예: Remote Control로 온 화살표 다음 Enter, `x`, `s`)가 이전 선택에 적용되던 문제를 고쳤다. `/effort`와 모델 picker에서는 오래된 effort 단계가 적용됐고, `/skills`, prompt 아래 백그라운드 작업 행, MCP 서버 확인 창, `/install-github-app`에서는 이전에 강조된 행에 적용됐다.
- `/install-github-app`의 세 가지 문제를 고쳤다. "Skip workflow update"를 골라도 workflow를 갱신하던 문제, Enter를 반복하면 설정을 두 번 실행하던 문제, 저장소를 감지하지 못했을 때 저장소 단계에서 ↑가 직접 입력한 저장소 이름을 막던 문제다.
- vim 모드를 고쳤다. `dj`/`dk`/`dG`/`dgg`와 그 `c`/`y` 형태가 줄 일부에만 작용하던 문제, `1G`가 마지막 줄로 가던 문제, `d0`/`c0`/`y0`가 아무것도 안 하던 문제, `.`로 insert를 반복한 뒤 커서가 한 칸 어긋나던 문제, `!`로 시작하는 줄에서 `o`/`p`가 shell 모드로 전환하던 문제다.
- vim 모드를 추가로 고쳤다. 공백·빈 줄·단어 마지막 글자·한 글자 단어에서 `cw`가 다음 단어까지 바꾸던 문제, Hindi·Bengali 등의 문자에서 단어 이동이 단어 중간에 멈추던 문제, `!`로 시작하는 텍스트를 넣는 `.`, `p`, `P`가 shell 모드로 전환하거나 텍스트를 잃거나 엉뚱한 글자를 편집하던 문제다.
- accent를 별도 키로 입력한 뒤 prompt 커서가 한 글자 더 이동하던 문제를 고쳤다.
- screen-reader 모드, 인용된 목록, 긴 목록에서 글머리 기호 다음 줄에서 텍스트가 시작하는 목록 항목 위에 빈 줄이 더 생기던 문제를 고쳤다.
- 숫자만 있는 글머리 목록(예: `- 316.`)이 문자, 로마 숫자, 잘못된 숫자로 표시되던 문제를 고쳤다.
- agent 패널 footer 힌트가 `keybindings.json`에서 바꾼 키를 무시하던 문제, stop-all-agents 단축키가 해제되면 떠도는 ` · `를 보여주던 문제를 고쳤다.
- agent 패널 footer가 이미 보고 있는 agent에 "Enter to view"와 "x to stop"을 제안하던 문제(거기서 x는 입력창에 입력된다), main이 이미 보일 때 main 행에 "Enter to view"를 제안하던 문제를 고쳤다.
- agent 패널 행을 마우스로 클릭해도 키보드 커서가 이전 선택 행에 남던 문제를 고쳤다.
- Esc가 선택된 agent 패널 행의 선택을 풀지 않고 실행 중인 turn을 중단하던 문제를 고쳤다.
- fullscreen 모드에서 dialog 목록(예: `/skills`)의 PgUp·PgDn이 동작하지 않던 문제를 고쳤다.
- 메모리 대부분이 JS heap snapshot에 있는데 `/heapdump` 요약이 대부분 native라고 말하던 문제를 고쳤다.
- Bash 편집 diff snapshot 디렉토리가 임시 폴더에 쌓이던 문제를 고쳤다. 버려진 것은 즉시, 나머지는 Claude Code 종료 시 지운다.
- 목록이 열린 동안 새 실행이 시작되면 /workflows 포인터가 다른 실행으로 옮겨가고 `x`가 그 실행을 멈추던 문제를 고쳤다.
- color가 꺼진 상태(`NO_COLOR`)에서 탭 바에 focus가 있을 때 탭 dialog(`/config`, `/plugin`, `/permissions`)의 선택 탭이 강조되지 않던 문제를 고쳤다.
- `/plugin` Installed 목록 위의 마우스 휠이 목록 대신 뒤 창을 스크롤하던 문제를 고쳤다.
- fullscreen 모드에서 스크롤이나 필터로 행이 마우스 밖으로 옮겨간 뒤에도 hover 강조가 남던 문제를 고쳤다.
- 좁은 터미널에서 /remote-control 메뉴 같은 긴 목록 행이 두 줄로 넘어가던 문제를 고쳤다. 이제 …로 자른다.
- 좁은 터미널에서 `/hooks`와 `/mcp` 상세 화면이 긴 값을 아래 행 위에 겹쳐 출력하던 문제를 고쳤다.
- screen-reader 모드에서 `/plugin`의 skill 상태 옵션 같은 목록에 숫자 입력으로 답할 수 없던 문제를 고쳤다.
- Windows: `$TMPDIR/…`에 쓰는 Bash 명령이 "Permission denied"로 실패하던 문제를 고쳤다.
- Windows: 같은 순간에 업데이트하는 Claude Code 세션들이 서로의 `claude.exe` 백업을 지워 `claude.exe`가 남지 않을 수 있던 race를 고쳤다.
- Claude Desktop 로그인·사용량 한도 오류 메시지가 터미널 명령 대신 앱을 가리키도록 개선했다.
- 시작을 개선했다. managed settings와 정책 가져오기가 절대 성공할 수 없는 요청을 더는 재시도하지 않는다.
- 대화형 시작 시간을 개선했다. git 읽기, 시작 telemetry, Bedrock/Vertex 모델 업그레이드 검사를 첫 화면 전에 실행하지 않는다.
- 파일을 많이 읽은 긴 세션의 재개 시간을 개선했다. 복원된 파일 캐시가 읽을 당시의 파일과 일치한다.
- compact된 매우 긴 세션의 재개 시간을 개선했다. Agent SDK와 Claude Desktop에서 가장 크게 체감된다.
- 매우 큰 첫 prompt 하나가 대부분인 세션의 "Prompt is too long" 복구를 개선했다. 그 prompt를 요약에서 빼지 않고 따로 요약한다.
- 새 프로세스에서 세션을 재개한 뒤의 auto mode를 개선했다. 권한 classifier가 이전 prompt cache를 다시 쓰지 않고 재사용한다.
- auto mode 거부 메시지를 개선했다. Claude가 거부를 정확한 명령 하나가 아니라 그 결과 전체에 대한 것으로 받아들인다.
- dangerous-rm 검사를 개선했다. shell 변수 뒤에 최상위 디렉토리 이름이 오는 삭제, 작업 디렉토리에서 나온 변수에 대한 삭제, 백슬래시만 있는 대상도 잡는다.
- macOS sandbox 안내를 개선했다. 로컬 dev 서버가 포트를 bind하지 못하면 Claude가 `sandbox.network.allowLocalBinding`을 알려준다.
- `--agents`를 개선했다. 인라인 JSON뿐 아니라 JSON 파일 경로도 받고(`-p`와 함께), 빈 `prompt`를 허용한다.
- `/batch`를 개선했다. git 저장소 안뿐 아니라 WorktreeCreate hook이 agent worktree를 제공하는 곳에서도 실행된다.
- plugin hook 실패 오류가 문제의 plugin 이름을 알려준다. shell 형태 hook이 `${CLAUDE_PLUGIN_ROOT}`를 따옴표 없이 쓰면 `claude plugin validate`가 경고하도록 했다(공백이 든 plugin 경로에서 깨진다).
- `/` 메뉴, `/skills`, `/context`, `/plugin` Installed 목록을 개선했다. claude.ai에서 동기화된 skill은 다른 명령이 같은 이름을 쓰지 않으면 `anthropic-skills:<name>` 대신 짧은 이름으로 보여준다.
- `/deep-research`의 긴 리서치 brief 신뢰성을 개선했다. scope 단계 출력에서 쓰지 않는 필수 필드를 제거했다.
- 게시되는 artifact 페이지의 문장을 개선했다. 번들된 artifact-design skill이 Claude에게 평이하고 직접적인 글을 요구한다.
- 느린 연결에서의 artifact 게시를 개선했다. 큰 페이지 업로드를 압축해서 보낸다.
- 큰 CLAUDE.md 시작 알림을 개선했다. instruction 파일을 합산해서, 중간 크기 파일 여러 개와 @-import도 잡는다.
- 세션 실행 환경에 이미 설정되어 있어 무시된 settings `env` 변수의 이름을 debug 로그에 남기도록 개선했다.
- `/permissions`, `/usage` 같은 탭 dialog의 키보드 이동을 개선했다. ↑/↓가 탭 행과 내용 사이의 focus를 옮기고, 목록은 focus가 있을 때만 키에 반응한다.
- `/help`와 `/sandbox`를 개선했다. 탭 목록 안에서도 ←/→와 Tab으로 탭을 바꾼다. `/help`의 빈 Custom commands 탭에서 ↓를 누르면 Esc 전까지 키가 막히던 문제도 없앴다.
- `/install-github-app`, `/desktop`, `/permissions` auto mode 환경 확인 창, `/plugin`의 "Add marketplace?"·"Run this command?" 확인 창을 개선했다. 표준 dialog 틀과 키 힌트를 쓰고, 다른 dialog처럼 Ctrl+C나 Ctrl+D를 두 번 누르면 취소한다.
- `/workflows`와 `/mcp` 목록을 개선했다. 페이지 이동(PgUp/PgDn, Home/End)이 되고, 다른 목록처럼 j/k와 마우스를 받는다. 화살표는 `select:previous`/`select:next` 재바인딩을 따르고, `/workflows`의 `x`는 포인터가 있는 실행을 멈춘다.
- `/plugin`의 plugin·marketplace 상세 메뉴와 `/remote-control`의 이미 연결됨 메뉴를 개선했다. Home/End와 행 클릭을 지원한다.
- prompt 아래 백그라운드 workflow 행을 개선했다. 이름, 진행 막대, 넓은 터미널에서는 agent 수, 경과 시간, 전체 토큰, 대형 workflow 경고를 보여준다.
- /plugin Installed 목록을 개선했다. 모든 섹션에서 행이 열(상태, 이름, 종류, 상세)에 맞춰 정렬된다.
- `/skills`를 개선했다. 각 행이 skill 이름으로 시작하고, ✔나 ◯ 하나로 켜짐·꺼짐을 표시하며, 좁은 터미널에서도 한 줄을 유지한다.
- 좁은 목록 행(`/skills`, `/workflows`, `/feedback`)을 개선했다. 이름은 첫 상세 옆에 20칸을 유지하고, 상세는 전부 보이거나 아예 안 보인다.
- `/diff`를 개선했다. 긴 변경 파일 목록에서 스크롤바가 현재 위치를 보여주고, 긴 경로가 행을 넘기지 않는다.
- `/hooks`를 개선했다. hook 상세 화면이 늘 settings.json을 가리키지 않고 hook 종류와 수정할 위치를 알려준다. hooks 비활성, safe mode, managed hooks 전용 안내는 각각 무슨 일인지 쉬운 한 문장으로 말한다.
- `/mcp`의 screen-reader 출력을 개선했다. 비활성 서버를 "pending" 대신 "off"로 읽는다.
- Remote Control 확인 창을 개선했다. 터미널 창이 focus를 다시 얻으면 선택지가 잠깐 비활성이 되어, 창을 전환하며 누른 키가 답하지 못한다.
- send now(ctrl+enter 또는 ctrl+x ctrl+s)가 turn을 취소하지 않고 실행 중인 도구를 백그라운드로 옮기도록 바꿨다.
- auto mode를 바꿨다. classifier 검토가 서버에서 도는 곳에서는 읽기 전용·sandbox shell 명령도 그 검토를 기다리고, 검토에서 걸리면 차단한다.
- `CLAUDE_CODE_AUTO_MODE_SERVER`를 바꿨다. Anthropic API에 직접 연결할 때도 적용된다. `0`은 서버측 auto mode classifier를 쓰지 않고(그러면 로컬 classifier가 사용량에 잡힌다), `1`은 쓴다.
- `--dangerously-skip-permissions`와 auto 모드의 위험한 `rm` 확인 창을 바꿨다. 답을 2분 기다린 뒤 명령을 거부하고 다시 쓰라는 힌트를 줘서, 무인 세션이 계속 진행되게 한다(`CLAUDE_CODE_DISABLE_DANGEROUS_RM_TIMEOUT=1`로 끈다).
- AGENTS.md 지원을 바꿨다. Amazon Bedrock, Google Vertex AI, Microsoft Foundry, LLM gateway, telemetry를 끈 세션에서도 동작한다.
- Claude apps gateway를 바꿨다. `managedMcpServers` 항목의 `envHelper` 경로가 `\??\`나 `/??/`로 시작하면 시작을 거부한다. 현재 Claude Desktop이 실행을 거부하는 경로 형태다.
- self-hosted runner를 바꿨다. system prompt를 명령줄 텍스트가 아닌 비공개 파일로 Claude Code에 넘겨, 큰 prompt 때문에 실행이 실패하지 않는다. `--system-prompt`나 `--append-system-prompt`를 덧붙이는 wrapper나 `command` hook은 `--system-prompt-file`이나 `--append-system-prompt-file`로 바꿔야 한다.
- 대기열 메시지가 spinner 아래가 아니라 위쪽 대화 안에 보이도록 바꿨다.
- prompt 아래의 세션 artifact 링크를 `/artifacts`를 여는 footer pill 하나(`⧉ name` 또는 `⧉ N`)로 바꿨다. `/artifacts`는 이 세션의 artifact를 먼저 보여준다.
- Artifact 도구를 바꿨다. Claude가 artifact 페이지에서 unpkg.com의 script를 로드할 수 있다.
- fullscreen 모드(`/config` 포함)에서 목록 행에 hover하면, focus 행의 ❯ 옆에 두 번째 ❯를 그리지 않고 행 색을 입히도록 바꿨다.
- /mcp를 바꿨다. 각 서버 행이 상태 아이콘과 이름으로 시작하고 상태를 한 번만 말한다. 좁은 터미널에서는 이름을 줄이기 전에 "managed" 같은 뒷부분 정보를 먼저 뺀다.
- /workflows를 바꿨다. 각 실행 행이 상태 아이콘과 경과 시간으로 시작하고, 좁은 터미널에서는 실행 이름과 시간을 남기고 agent·토큰 수를 먼저 뺀다.
- Remote Control 첨부 다운로드가 연결을 재사용하고, 세션에서 이미 받은 파일은 건너뛰도록 바꿨다.
- MCP resource 목록(resource 목록 도구와 @-mention 제안)이 MCP Apps UI resource를 건너뛰도록 바꿨다. URI로 직접 읽는 것은 그대로 된다.
- `claude plugin uninstall --json`과 /plugin dialog를 바꿨다. 다른 설치 plugin이 폴더를 쓰거나 설치 기록을 읽을 수 없어 폴더가 남으면, plugin 데이터를 보존했다고 알린다.
- 백그라운드 작업 목록(`/tasks`)을 바꿨다. 실행 중인 `/ultrareview`에서 `x`를 누르면 멈추기 전에 확인을 받는다.
- 명령 메뉴와 `/help`에 남아 있던 "(removed)" `/agents` 항목을 제거했다. `/agents`를 입력하면 wizard가 어디로 옮겼는지 여전히 알려준다.
- [VSCode] auto mode가 과금되는 classifier 요청으로 넘어가면 VS Code·JetBrains 패널에 Continue/Stop 창을 추가했다. 답할 수 없던 경고 줄을 대체한다.
- [VSCode] 메시지가 없는 Web 세션을 열면 재개할 수 없는 빈 로컬 사본을 저장하던 문제를 고쳤다. 이제 어디서 이어갈지 알려주는 오류를 띄운다.
- [VSCode] claude.ai/code 세션이 오류 없이 비어 있거나 대화 일부만 열리던 문제를 고쳤다. 서버가 히스토리를 반환하지 못했거나, 일부 로드에 실패했거나, 네트워크 로그인 페이지가 대신 응답한 경우다. 이제 오류를 보여주고 다시 열 수 있다.
- [VSCode] extension host가 재시작하면 편집기 탭의 대화가 조용히 멈추던 문제를 고쳤다. 이제 탭이 세션 목록에서 다시 열라고 알려준다.
- [VSCode] 질문 카드가 보여주지 못하는 옵션 미리보기를 Claude가 채팅 패널의 객관식 질문에 붙이던 문제를 고쳤다.
- [VSCode] 좁은 사이드 바에서 세션 관리자의 비용·사용량 블록이 텍스트 중간에서 줄바꿈되던 문제, 계정을 바꾼 뒤에도 이전 로그인의 합계를 보여주던 문제를 고쳤다.
- [Claude Code on the web] 요금제에 fast mode가 있고 선택한 모델이 지원하면, cloud 세션 composer의 모델 메뉴에 Fast mode 스위치를 추가했다.
- [Claude Code on the web] GitHub 설정 팁에 설정 바로가기를, 저장소 picker에 "Troubleshoot GitHub connection" 링크를 추가했다. 둘 다 GitHub 연결 페이지를 연다.
- [Claude Code on the web] pull request를 draft로 전환하는 GitHub 트리거 routine이 발동하지 않던 문제를 고쳤다. 이제 전환 시 실행을 시작한다.
- [Claude Code on the web] GitHub에 호스팅되지 않은 저장소의 cloud 세션에 절대 동작할 수 없는 Create PR 버튼이 보이던 문제를 고쳤다. 이제 거기서는 버튼을 숨긴다.
- [Claude Code on the web] picker가 열린 동안 claude.ai/code의 GitHub 설정 팁이 저장소 picker의 검색창과 행을 가리던 문제를 고쳤다. 이제 picker가 닫힐 때까지 비켜 있다.
- [Claude Code on the web] cloud 세션이 파일을 열지 못할 때의 파일 카드를 개선했다. 파일이 더는 없는지, 세션 권한 설정이 읽기를 막는지 알려준다.
- [Claude Tag] 누군가 Stop을 누르면 Slack 스레드에 누가 응답을 멈췄는지와 이어가려면 @Claude를 부르라는 짧은 줄을 추가했다.
- [Claude Tag] Claude가 스레드 안 답글에 영구히 응답을 멈출 수 있던 Slack 채널 문제를 고쳤다. 해당 채널은 Claude에게 새 메시지가 오면 스스로 복구된다.
- [Claude Tag] Slack에서 Stop을 누른 뒤 Claude가 멈춘 요청을 재개하던 문제(예: check-in이 발동하거나 백그라운드 작업이 끝날 때)를 고쳤다. 응답 중에 보낸 메시지도 이제 읽는다.
- [Claude Tag] 실패한 setup script 등으로 Claude 세션이 작업 중 크래시하면 Slack 답장이 수십 분 늦거나 오지 않던 문제를 고쳤다. 이제 몇 분 안에 스스로 재시작한다.
- [Claude Tag] 세션 설정이 너무 커서 시작할 수 없을 때 Slack의 Claude가 자동 재시작을 약속한 뒤 막연하게 실패하던 문제를 고쳤다. 이제 스레드에 이유와 재시도 방법을 알린다.
- [Claude Tag] 매우 긴 Slack 스레드 문제를 고쳤다. Claude가 몇 주 전 메시지에 비춰 판단한 뒤 답장을 조용히 보류할 수 있었고, 스레드 깊숙이에서 재시작하면 최근 맥락을 잃을 수 있었다.
- [Claude Tag] Enterprise Grid 조직 전체 공유에서 단일 workspace로 옮긴 Slack 채널에서 Claude가 모든 mention에 "Couldn't check this channel just now"로 답하던 문제를 고쳤다.
- [Claude Tag] 주로 workspace 간 공유 채널로 접근하는 매우 큰 Enterprise Grid workspace가 한 시간 조용하면 다시 "Couldn't check this channel"을 받던 문제를 고쳤다.
- [Claude Tag] 조직의 inference hook이 막은 Slack 요청에 일반 재시도 안내가 뜨던 문제를 고쳤다. 이제 스레드에 hook의 거부 메시지를 보여주고 Claude가 재시도하지 않는다.
- [Claude Tag] Slack의 Claude가 조직이 쓸 수 없는 모델로 전환을 제안하던 문제를 고쳤다. 이제 전환이 실제로 받아들일 모델만 나열하고 제안한다.
- [Claude Tag] Claude Tag의 AWS 연결로 보낸 DynamoDB와 Kinesis account 기반 endpoint 요청이 인증에 실패하던 문제를 고쳤다.
- [Claude Tag] 조직 관리자에게 Claude Tag 관리 설정의 Plugins 섹션이 로드되지 않고 연결된 plugin을 원시 ID로 보여주던 문제를 고쳤다. 이제 로드되고 각 plugin 이름을 보여준다.
- [Claude Tag] Slack 스레드에서 요청할 때 Claude가 주는 routine 목록을 바꿨다. 기본으로 채널의 모든 routine이 아니라 그 스레드의 예약 작업을 보여준다.
- [Code Review] 모든 push를 리뷰하도록 설정하지 않은 저장소에서, 실패한 리뷰를 재시도하는 동안 리뷰 대상 커밋이 force-push로 사라지면 pull request가 리뷰를 받지 못하던 문제를 고쳤다.

---

## 🎯 챌린지

이번 버전에서 내 환경에 적용해볼 만한 항목입니다.

### 1. 위험한 `rm` 확인 창 자동 거부 끄기
- **파일**: `~/.claude/settings.json`
- **근거**: 이번 버전부터 auto 모드의 위험한 `rm` 확인 창은 2분 안에 답이 없으면 스스로 거부하고 다른 명령으로 우회를 유도한다. `autoMode`를 쓰는 환경에서 "예외 상황은 선 보고, 맘대로 조치 금지" 원칙을 지키려면 `env`에 `"CLAUDE_CODE_DISABLE_DANGEROUS_RM_TIMEOUT": "1"`을 넣는다. 그러면 사용자가 답할 때까지 기다린다.
- **난이도**: ★☆☆ (약 5분)

### 2. `deploy-guard.sh`의 명령 치환 우회 점검
- **파일**: `~/.claude/hooks/deploy-guard.sh`
- **근거**: 이번 버전은 `rm -rf "$(pwd)"`처럼 대상을 명령 치환(`$(...)`, 명령 실행 결과로 인자를 채우는 문법)으로 숨긴 경우를 막았다. 같은 수법으로 `git push origin "$(git branch --show-current)"`나 `git push origin HEAD`를 쓰면 `feat/*` 차단 문자열 검사를 빠져나갈 수 있다. 이런 명령으로 hook을 직접 시험하고, 뚫리면 치환이나 `HEAD`가 든 push는 확인을 받도록 규칙을 추가한다.
- **난이도**: ★★☆ (약 20분)

### 3. CLAUDE.md 전체 크기 점검과 분리
- **파일**: `~/.claude/CLAUDE.md`
- **근거**: 큰 CLAUDE.md 시작 알림이 이제 instruction 파일과 @-import를 합산해서 판단한다. 전역 `CLAUDE.md`는 이미 4KB를 넘고, 프로젝트별 CLAUDE.md까지 더하면 알림이 뜰 가능성이 높다. `wc -c`로 크기를 재고, 자주 쓰지 않는 §6 Deploy 세부 규칙 같은 긴 절을 별도 파일로 옮겨 매 세션 컨텍스트 부담을 줄인다.
- **난이도**: ★★★ (약 30분)
