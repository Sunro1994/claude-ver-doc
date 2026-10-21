# Claude Code v2.1.305

> 작성일: 2026-10-21

---

# 📋 요약본

## 🎉 신기능 (4건)
- **`sandbox.allowNestedUserNamespaces` 설정 추가** — Linux 샌드박스(명령을 격리된 공간에서 실행하는 장치) 안에서 user namespace를 만들 수 있게 한다. Chromium, rootless podman 같은 도구가 샌드박스 안에서 돌아간다.
  - 대가가 있다. 이 설정을 켜면 해당 명령이 샌드박스의 파일 보호를 우회할 수 있다. 필요한 경우에만 켠다.
- **`CLAUDE_CODE_RETRY_WATCHDOG_USAGE_LIMIT_RECHECK_MS` 환경변수 추가** — 무인 재시도 모드(`CLAUDE_CODE_RETRY_WATCHDOG`)가 사용량 한도를 주기적으로 다시 확인한다. 예정된 리셋 시각 전에 한도가 풀리면 바로 알아채고 작업을 이어간다.
- **[VSCode] "Running start-up hooks" 스피너 추가** — `SessionStart`나 `Setup` hook이 도는 동안 상태 표시가 나온다. 스크린 리더도 이 상태를 읽어준다.
- **[Claude Tag] Claude가 아직 참여하지 않은 공개 Slack 채널 검색** — 관리자가 Add place 검색에서 이런 채널을 찾아 바로 설정할 수 있다.

## 🛠️ 개선/수정 (34건)
- **ToolSearch 거부 시 전체 요청 실패 수정** — Vertex, Bedrock 같은 provider나 게이트웨이가 tool search를 거부하면 모든 요청이 실패했다(2.1.304 회귀). ToolSearch가 막혀 있거나 `--tools`에서 빠진 경우도 같았다. 이제 tool search 없이 다시 시도한다.
- **`/effort`·`/autocompact` 설정 미적용 수정** — 모델 이름이 `modelOverrides` 값과 대소문자나 `[1m]` 태그만 달라도 설정이 적용되지 않던 문제를 고쳤다.
- **worktree 시작점·정리 수정** — bare 저장소에서 새 worktree가 기본 브랜치가 아니라 로컬 HEAD에서 시작하던 문제를 고쳤다. 변경 없는 subagent worktree가 정리되지 않던 문제도 고쳤다.
- **디스크 가득 참 에러 개선** — 예전에는 날것의 `ENOSPC` 파일 경로만 보였다. 이제 디스크가 가득 찼고 명령이 실행되지 않았다고 알려준다.
- **MCP 서버 덮어쓰기 수정** — 클라우드 세션이나 SDK의 `setMcpServers`로 넘긴 MCP 서버가 세션 도중 내 설정의 같은 이름 서버로 바뀌던 문제를 고쳤다.
- **subagent fallback 모델 이름 수정** — subagent가 fallback 모델로 바뀐 뒤에도 Claude가 원래 모델 이름을 말하던 문제를 고쳤다.
- **compaction 누락 알림 수정** — compaction(긴 대화를 요약해 줄이는 작업)이 공간이 모자라 가장 오래된 메시지를 요약에서 빼도, 클라우드 세션과 teammate가 이를 Claude에 알리지 않던 문제를 고쳤다.
- **Cowork 예약 세션 대기 수정** — subagent의 WebFetch가 URL 승인을 기다리면 승인해 줄 사람이 없어도 subagent마다 5분씩 멈췄다. 이런 경우를 더 많이 고쳤다.
- **Workflow resume 중복 실행 수정** — resume 때 이미 끝난 `pipeline()`·`parallel()` agent를 다시 돌리던 문제를 고쳤다. 이제 실행 journal(실행 기록)에서 결과를 꺼내 쓴다.
- **Remote Control 빈 세션 항목 수정** — `/resume`으로 대화를 바꾼 뒤 `/resume` 목록에 빈 "(session)" 항목이 남던 문제를 고쳤다.
- **`/usage` 잘림 수정** — 좁은 터미널에서 `/usage`의 행이 잘리던 문제를 고쳤다.
- **시작 경고 표시 정리** — 경고가 로고 위에 날것의 텍스트로 찍히지 않고 debug 로그로 간다. 아무것도 막지 않는 permission rule은 배너 아래 경고 행으로 보여준다.
- **스크린 리더 모드 수정** — 검색창 기호를 VoiceOver가 "telephone recorder"로 읽던 것을 "Search:"로 바꿨다. Ctrl+R 검색 결과나 "ultrathink"처럼 강조된 텍스트에서 단어 중간에 공백이 끼던 문제도 고쳤다.
- **Self-hosted runner `TERM` 에러 수정** — stdout만 공유하는 시작 스크립트가 `TERM`이 설정되어 있으면 `Resource temporarily unavailable`로 실패하던 문제를 고쳤다(2.1.300 회귀).
- **Self-hosted runner `GIT_CONFIG` 수정** — git credential helper나 askpass가 `GIT_CONFIG`로 설정을 읽으면 2.1.296부터 저장소 접근이 실패하던 문제를 고쳤다.
- **Self-hosted runner hook 타임아웃 오판 수정** — 백그라운드로 띄운 runner가 출력을 열어두면 orchestrator가 spawn-runner hook을 타임아웃으로 잘못 보고하던 문제를 고쳤다.
- **`/usage` 경고 개선** — 경고마다 원인과 한 줄 해결책을 보여준다. `f`를 누르면 해결책을 바로 적용한다. VS Code와 `/doctor`에도 같은 해결책이 나온다.
- **MCP 동의 창 오입력 방지** — 프롬프트용으로 누른 Enter가 Accept로 처리될 가능성을 줄였다.
- **mod `Image` iTerm2 지원** — iTerm2 3.5 이상 fullscreen 렌더링에서 `alt` 텍스트만 보이던 것을 실제 그림으로 그린다.
- **Remote Control spawn-mode 안내 개선** — `w`를 누르면 새 모드가 이 폴더에 저장됐다고 알려준다. 다음에 `claude remote-control`이 저장된 모드로 시작하면 그 모드가 어디서 왔는지도 알려준다.
- **`allowedMcpServers` 필터링 변경** — `env`에서만 `${VAR}`를 쓰는 `managed-mcp.json` stdio 서버는 더 이상 걸러지지 않는다. 그래서 allowlist에 없던 서버도 업그레이드 후 로드된다. 계속 끄려면 `deniedMcpServers`를 쓴다.
- **Desktop 경로 마운트 플러그인 권한 변경** — 조직 managed settings에 `allowManagedPermissionRulesOnly`가 켜져 있으면, Claude Desktop이 경로로 마운트한 플러그인의 `allowed-tools`가 더 이상 유지되지 않는다.
- **`/artifacts` 삭제 확인 키 변경** — 1이나 Enter는 유지, 2는 삭제, Esc는 취소다. `y`·`n`은 더 이상 먹지 않는다.
- **mod 고정 창 너비 제한** — 고정(docked) 창은 터미널 너비의 45%를 넘지 않는다. 더 넓은 터미널에서 쓰던 너비가 남아 있어도 마찬가지다.
- **[VSCode] "Compacting..." 잘림 수정** — `spinnerVerbs`로 기본 동사를 짧은 것으로 바꿨을 때 "Compacting..."이 잘리던 문제를 고쳤다.
- **[VSCode] 세션 시작 지연 안내 변경** — hook이 돌지 않는데 세션이 제때 시작되지 않으면, 로그인·네트워크 안내 대신 출력 로그를 먼저 보여주고 가능한 원인을 나열한다.
- **[Cloud] 환경 저장 거부 수정** — 관리 페이지가 기존 환경을 저장하려 할 때 "installs packages" 에러로 잘못 거부하던 문제를 고쳤다.
- **[Cloud] self-hosted 환경 삭제 안내 개선** — 삭제를 막는 것이 무엇인지, 삭제하면 무엇이 영향받는지 창과 에러 메시지에 나온다.
- **[Claude Tag] 옮겨진 저장소 재등록 수정** — 다른 GitHub 계정으로 옮겨간 저장소를 access bundle에 다시 추가할 수 있다.
- **[Claude Tag] Slack DM 스레드 routine 수정** — 같은 스레드의 다른 routine이 대화를 다시 시작하면 기존 routine이 게시를 멈추던 문제를 고쳤다. 이제 둘 다 계속 게시한다.
- **[Claude Tag] 성공 오보고 수정** — 대화가 끝난 Slack 스레드의 routine이 게시하지 않고 성공을 보고하던 문제를 고쳤다. 이제 해당 실행을 건너뛰고 만든 사람에게 알린다.
- **[Claude Tag] 대규모 조직 관리 페이지 개선** — 채널 목록이 아직 로딩 중이어도 plugin·skill·bundle을 편집할 수 있다.
- **[Code Review] 최신 커밋 누락 수정** — 리뷰 도중 PR에 push가 여러 번 들어오면 최신 커밋을 리뷰하지 않던 문제를 고쳤다.
- **[Code Review] 재리뷰 LGTM 변경** — 앞선 리뷰의 blocking finding(병합을 막는 지적)이 아직 열려 있으면 재리뷰가 LGTM으로 시작하지 않는다.

## 🔑 이번 버전의 핵심 키워드
**"조용히 실패하던 곳을 드러내고 바로잡는다"** — 2.1.304의 ToolSearch 회귀를 바로잡고, 디스크 가득 참·compaction 누락·Workflow resume처럼 몰래 틀어지던 동작을 명확하게 고쳤다.

---

# 📜 원문 (한글 번역본)

> 원문 ChangeLog를 원래 순서 그대로 한 줄도 빠짐없이 번역한 문서입니다.

- `sandbox.allowNestedUserNamespaces` 추가. Linux에서 샌드박스 안의 명령이 user namespace를 만들 수 있다(Chromium, rootless podman). 이 설정을 쓰면 해당 명령이 샌드박스의 파일 보호를 우회할 수 있다
- `CLAUDE_CODE_RETRY_WATCHDOG_USAGE_LIMIT_RECHECK_MS` 추가. 무인 재시도 모드(`CLAUDE_CODE_RETRY_WATCHDOG`)가 리셋 전에 풀린 사용량 한도를 알아챈다
- 엔드포인트나 게이트웨이가 tool search를 거부할 때, 또는 게이트웨이에서 ToolSearch가 금지되거나 `--tools`에서 빠졌을 때 Vertex, Bedrock 등 provider에서 모든 요청이 실패하던 문제 수정(2.1.304 회귀). 이제 Claude Code가 tool search 없이 재시도한다
- 모델 이름이 `modelOverrides` 값과 대소문자나 `[1m]` 태그만 다를 때 `/effort`·`/autocompact` 설정이 적용되지 않던 문제 수정
- bare 저장소의 새 worktree가 기본 브랜치 대신 로컬 HEAD에서 시작하는 경우와, 변경 없는 subagent worktree가 정리되지 않는 경우 수정
- 디스크가 가득 찼을 때 Bash 명령이 날것의 `ENOSPC` 파일 경로를 내며 실패하던 문제 수정. 이제 디스크가 가득 찼고 아무것도 실행되지 않았다고 알려준다
- 클라우드 세션이나 SDK의 `setMcpServers`로 넘긴 MCP 서버가 세션 도중 내 설정의 같은 이름 서버로 교체되던 문제 수정
- subagent가 fallback 모델로 바뀐 뒤 Claude가 그 작업의 모델 이름을 잘못 말하던 문제 수정
- compaction이 크기를 맞추려고 가장 오래된 메시지를 요약에서 빼야 했을 때 클라우드 세션과 teammate가 Claude에 알리지 않던 문제 수정
- 예약된 Cowork 클라우드 세션에서 subagent의 WebFetch가 아무도 줄 수 없는 URL 승인을 기다리면 subagent마다 5분씩 기다리던 경우를 더 많이 수정
- Workflow resume이 이미 끝난 `pipeline()`·`parallel()` agent를 실행 journal에서 꺼내 쓰지 않고 다시 실행하던 문제 수정
- `/resume`으로 대화를 바꾼 뒤 Remote Control이 `/resume`에 빈 "(session)" 항목을 남기던 문제 수정
- 좁은 터미널에서 `/usage` 행이 잘리던 문제 수정
- 시작 경고가 로고 위에 날것의 텍스트로 찍히던 문제 수정. 이제 debug 로그로 가고, 아무것도 막지 않는 permission rule은 배너 아래 경고 행으로 표시된다
- 스크린 리더 모드 수정. 검색창은 VoiceOver가 "telephone recorder"로 읽던 기호 대신 "Search:"라고 말한다. Ctrl+R 검색 결과나 "ultrathink" 같은 강조된 프롬프트 텍스트에서 단어 안에 공백이 더 이상 끼지 않는다
- Self-hosted runner: runner나 orchestrator와 stdout만 공유하는 시작 스크립트가 `TERM`이 설정되어 있으면 `Resource temporarily unavailable`로 실패하던 문제 수정(2.1.300 회귀)
- Self-hosted runner: git credential helper나 askpass 프로그램이 `GIT_CONFIG`로 설정을 읽을 때 2.1.296부터 저장소 접근이 실패하던 문제 수정
- Self-hosted runner: 백그라운드로 시작한 runner가 출력을 열어두면 orchestrator가 spawn-runner hook을 타임아웃으로 보고하던 문제 수정
- `/usage` 개선: 각 경고가 원인을 밝힌 한 줄 해결책이 되고, `f`로 해결책을 적용한다. 같은 해결책이 VS Code와 `/doctor`에도 나온다
- 프롬프트용 Enter가 Accept로 처리될 가능성이 줄도록 MCP 동의 창 개선
- mod의 `Image`가 iTerm2 3.5 이상 fullscreen 렌더링에서 `alt` 텍스트만 보이던 것을 실제 그림으로 그리도록 개선
- Remote Control: spawn-mode 메시지 개선. `w`를 누르면 새 모드가 이 폴더에 저장됐다고 알려주고, 이후 저장된 모드로 `claude remote-control`을 시작하면 그 모드의 출처를 알려준다
- `allowedMcpServers` 변경: `env`에서만 `${VAR}`를 쓰는 `managed-mcp.json` stdio 서버를 더 이상 거르지 않는다. allowlist에서 빠진 서버도 업그레이드 시 로드된다. 계속 끄려면 `deniedMcpServers`를 쓴다
- 조직 managed settings에 `allowManagedPermissionRulesOnly`가 설정되면, Claude Desktop이 경로로 마운트한 플러그인이 `allowed-tools`를 더 이상 유지하지 않도록 변경
- `/artifacts` 삭제 확인 변경: 1이나 Enter는 유지, 2는 삭제, Esc는 취소. `y`·`n`은 더 이상 응답으로 받지 않는다
- mod의 고정 창이 터미널 너비의 45% 안에 머물도록 변경. 더 넓은 터미널에서 유지된 너비도 포함한다
- [VSCode] `SessionStart`나 `Setup` hook이 도는 동안 "Running start-up hooks" 스피너 상태와 스크린 리더 안내 추가
- [VSCode] `spinnerVerbs` 설정이 기본 동사를 짧은 것으로 바꿀 때 스피너가 "Compacting..."을 자르던 문제 수정
- [VSCode] 세션이 제때 시작되지 않고 hook도 돌지 않을 때의 메시지 변경. 로그인·네트워크를 먼저 가리키지 않고 출력 로그를 앞세우며 원인을 나열한다
- [Cloud sessions] Cloud environments 관리 페이지가 기존 환경 저장을 "installs packages" 에러로 잘못 거부하던 문제 수정
- [Cloud sessions] self-hosted 환경 삭제 개선. 창과 에러 메시지가 삭제를 막는 것과 삭제가 영향을 줄 대상을 알려준다
- [Claude Tag] Claude가 참여하지 않은 공개 Slack 채널을 Claude Tag 관리자 Add place 검색에 추가. 관리자가 거기서 바로 설정할 수 있다
- [Claude Tag] 다른 GitHub 계정으로 옮겨간 저장소를 Claude Tag access bundle에 다시 추가할 수 있도록 수정
- [Claude Tag] Slack DM 스레드에 설정한 routine이, 같은 스레드의 다른 routine이 대화를 다시 시작한 뒤 게시를 멈추던 문제 수정. 이제 둘 다 그 스레드에 계속 게시한다
- [Claude Tag] Slack 스레드에 설정한 routine이 대화가 끝난 뒤 게시하지 않고 성공을 보고하던 문제 수정. 이제 해당 실행은 건너뛰고 만든 사람에게 알린다
- [Claude Tag] 대규모 조직의 Claude Tag 관리 페이지 개선. 채널 목록이 로딩 중이어도 plugin·skill·bundle 편집이 된다
- [Code Review] 리뷰 도중 PR에 여러 push가 들어오면 Code Review가 최신 커밋을 리뷰하지 않던 경우 수정
- [Code Review] 앞선 blocking finding이 아직 열려 있으면 재리뷰가 LGTM으로 시작하지 않도록 변경

---

## 🎯 챌린지

이번 버전에서 내 환경에 적용해볼 만한 항목입니다.

### 1. 디스크 가득 참 메시지를 멈춤 신호로 규칙화
- **파일**: `~/.claude/CLAUDE.md` (§10 "대용량 체크아웃·복사 전 디스크 확인" 항목)
- **근거**: 이번 버전부터 디스크가 가득 차면 Bash가 날것의 `ENOSPC` 경로 대신 "디스크가 가득 찼고 아무것도 실행되지 않았다"고 알려준다. §10에는 이미 2026-10-20 worktree 20G 사고 기록이 있다. 여기에 "이 메시지가 나오면 명령은 실행되지 않은 것이다. 재시도·우회하지 말고 `df` 결과와 함께 즉시 보고한다"를 한 줄 추가한다. 디스크 사고가 났을 때 같은 명령을 반복해 상황을 키우는 일을 막는다.
- **난이도**: ★☆☆ (약 5분)

### 2. 매일 08:00 체인지로그 cron에 무인 재시도 모드 적용
- **파일**: `~/.claude/skills/claude-changelog-sync/` 안의 cron 실행 스크립트(`claude -p --model opus`를 호출하는 쉘)
- **근거**: 이 동기화는 지켜보는 사람 없이 매일 돈다. 사용량 한도에 걸리면 그날 생성이 빠진다. 스크립트에 `export CLAUDE_CODE_RETRY_WATCHDOG=1`과 이번에 추가된 `CLAUDE_CODE_RETRY_WATCHDOG_USAGE_LIMIT_RECHECK_MS`(예: `600000`, 10분마다 재확인)를 넣는다. 그러면 한도가 일찍 풀렸을 때 리셋 시각까지 기다리지 않고 바로 이어서 만든다. 적용 후 다음 날 실행 로그를 확인한다.
- **난이도**: ★★☆ (약 15분)

### 3. `/usage` 경고를 `f` 한 번으로 정리하고 쓸모없는 permission rule 걷어내기
- **파일**: `~/.claude/settings.json`
- **근거**: 이번 버전에서 `/usage`는 경고마다 원인과 한 줄 해결책을 보여주고, `f`로 바로 적용한다. 아무것도 막지 않는 permission rule은 시작 배너 아래 경고 행으로 드러난다. 내 `settings.json`에는 `autoMode.environment`, 비활성 플러그인 다수, hook이 쌓여 있다. `/usage`를 열어 경고를 확인한다. 각 해결책이 바꾸는 내용을 먼저 읽고, 내 의도와 맞는 것만 `f`로 적용한다. 배너에 뜬 무의미한 rule은 직접 지운다.
- **난이도**: ★☆☆ (약 10분)
