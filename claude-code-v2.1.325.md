# Claude Code v2.1.325

> 작성일: 2026-11-14

---

# 📋 요약본

## 🎉 신기능 (6건)
- **노트북 재실행 팁** — VS Code 등 통합 터미널에서 Claude가 Jupyter 노트북을 읽거나 고친 뒤, 셀을 다시 실행하라는 스피너 팁을 한 번 띄운다.
- **조직 정책 차단 시 다음 행동 안내** — 정책 차단 에러 아래에 `/rewind`로 메시지를 고치거나 `/clear`를 실행하라는 줄을 추가한다.
- **샌드박스 git 보호 파일 알림** — 샌드박스 안의 `git checkout`·`git stash`·autostash pull이 `.claude` 같은 보호 파일을 갱신하지 못하면 Claude에게 이를 알린다.
- **[VSCode] 프롬프트 제안** — 터미널처럼 다음 프롬프트를 제안한다. Tab으로 받고, `promptSuggestionEnabled: false`로 끈다.
- **[VSCode] API 키 없는 Console 로그인** — API 키를 만들지 않는 Console 로그인을 추가한다.
- **[VSCode] MCP 리다이렉트 URL 붙여넣기 칸** — SSH·WSL·컨테이너 창에서 MCP 서버에 로그인할 때 리다이렉트 URL을 붙여넣는 칸을 추가한다.

## 🛠️ 개선/수정 (16건)
- **보안: zstd 디코딩** — zstd로 압축된 응답을 푸는 방식의 보안 문제를 고친다.
- **권한 규칙 우회 차단** — 일부 복합 Bash 명령이 묻지 않고 실행되던 틈을 막는다. allow 규칙이 이름과 다른 프로그램을 실행하던 경우, `cd` 뒤에 상대 경로 deny 규칙(`Read(./.env)`)이 풀리던 문제, 대소문자가 다른 `mcp__plugin_*_` 규칙이 빠지던 문제를 고친다.
- **샌드박스 기본 동작 변경** — 샌드박스 안의 Bash도 일반 권한 흐름을 따른다. 기존처럼 묻지 않으려면 `sandbox.autoAllowBashIfSandboxed: true`를 설정한다.
- **샌드박스 보호 강화** — worktree 설정·hook, 공유 git 폴더, 업데이터 다운로드 폴더를 더 확실히 보호한다. 추가 디렉토리의 `.claude` 설정 쓰기도 막는다. 내부 헬퍼에는 로그인 토큰·API 키·mTLS 키 암호를 넘기지 않는다.
- **신뢰하지 않은 레포의 git** — 프로젝트 레포도 아니고 신뢰한 레포도 아니면 읽기 전용 git 명령도 먼저 묻는다. 묻지 않게 하려면 `--add-dir`로 지정한다.
- **예약 작업·`/loop`의 스킬 실행** — `allowed-tools`나 hook을 선언한 스킬은 실행 전에 묻는다. 무인으로 돌리려면 `permissions.allow`에 `Skill(name)`을 추가한다.
- **서브에이전트 모델 처리** — `opusplan`/`haiku` 설정에서 자기 모델을 가진 서브에이전트가 plan 모델로 바뀌던 문제와, 파일 읽기 크기를 메인 세션 모델 기준으로 잡던 문제를 고친다. 출력 토큰 한도에서 잘린 서브에이전트에게는 답 전체를 더 짧게 다시 요청한다.
- **세션 안정성** — 게이트웨이·Foundry에서 compact 대신 매 턴 context length 에러로 멈추던 문제, 비정상 종료 뒤 resume하면 최근 턴이 빠지던 문제, 작업 디렉토리가 지워진 뒤 실행 위치가 잘못 잡히던 문제를 고친다.
- **plan 저장 손실 방지** — `plansDirectory`에 저장하지 못하면 기본 폴더에 저장하고 경고를 띄운다.
- **MCP 안정성** — 인증 상태, 재연결, elicitation, 백그라운드 작업 질문 처리를 고친다. 질문에서 Esc를 누르면 "나중에 답하기"로 처리되고, 질문은 `/tasks`에 남는다.
- **로그인·인증 흐름** — Console 로그인이 기존 로그인을 덮어쓰던 문제, lock 파일이 남던 문제, 백그라운드 세션이 셸의 API 키로 과금되던 문제를 고친다. `/login`은 개인정보 설정을 바꾸기 전에 묻는다.
- **Artifact 권한** — 조직 밖에서 보이는 artifact를 수정하거나 업로드하거나 게시할 때 확인 절차를 빠뜨리지 않게 한다.
- **플러그인 보안·로딩** — 위험한 경로·링크를 건너뛰고, 코드 실행 위험을 경고한다. `.mcpb`는 plugins 디렉토리에 푼다. `pluginDigests`는 폐기됐다. marketplace `ref`에 commit ID를 쓸 수 있다.
- **UI·명령 표시 수정** — `/stats`의 활동일 +1 오류, `/insights`의 이스케이프 누락, `/voice`·`/fast`·`/model` 메시지, 줄바꿈 겹침, 제어문자 표시를 고친다.
- **Windows·Linux 플랫폼 수정** — Windows의 드라이브 문자 대소문자 때문에 생기던 `/resume` 문제와 시작 지연, Linux의 `bwrap: Can't create file` 문제를 고친다.
- **[VSCode]·웹·Claude Tag 수정** — 모델 선택 체크 표시, effort 상한, 로그인 제공자 필터를 고친다. 웹의 MCP 도구 설명 한도는 16,384자로 늘었다. Slack에 붙인 artifact 링크에 카드가 나온다.

## 🔑 이번 버전의 핵심 키워드
**"권한 틈 메우기"** — Bash 복합 명령·샌드박스·artifact·예약 작업에서 묻지 않고 실행되던 틈을 막는 데 집중한 보안 강화 릴리스다.

---

# 📜 원문 (한글 번역본)

> 원문 ChangeLog를 원래 순서 그대로 한 줄도 빠짐없이 번역한 문서입니다.

- zstd로 압축된 응답을 디코딩하는 방식의 보안 문제 수정
- VS Code 등 통합 터미널에서 Claude가 Jupyter 노트북을 읽거나 편집한 뒤 노트북 셀 재실행에 관한 스피너 팁을 한 번 표시
- 조직 정책이 요청을 차단할 때 나오는 에러 아래에 계속하는 방법을 안내하는 줄 추가: `/rewind`를 실행해 메시지를 바꾸거나 `/clear` 실행
- 샌드박스에서 `git checkout`, `git stash`, autostash pull이 `.claude` 안의 파일 같은 보호 파일을 갱신하지 못할 때 Claude에게 알리는 메모 추가
- bare 저장소의 worktree, `--separate-git-dir` checkout, Android `repo` checkout에서 `/security-review`와 스킬의 인라인 git 명령이 에러로 멈추던 문제 수정
- model 설정이 `opusplan` 또는 `haiku`일 때 자체 모델을 가진 서브에이전트가 plan 모드 모델로 바뀌던 문제 수정
- 다른 모델을 쓰는 서브에이전트가 파일 읽기와 MCP 결과 크기를 메인 세션 모델 기준으로 정하던 문제 수정
- 여러 서드파티 게이트웨이와 Foundry에서 세션이 compact하지 않고 매 턴 context length 에러로 멈추던 문제 수정
- Claude Code가 정상 종료 없이 멈춘 뒤 재개한 세션에서 최근 턴이 가끔 사라지던 문제 수정
- 작업 디렉토리가 삭제된 뒤 셸 명령이 실행 시작 디렉토리에서 돌던 문제 수정. 이제 명령은 메시지와 함께 실패하고 다시 실행할 수 있음
- `plansDirectory` 폴더가 받지 못할 때 승인된 plan 편집이 사라지던 문제 수정. 이제 plan을 기본 plans 폴더에 저장하고 위치와 이유를 경고로 알림
- 새로 설치할 때 저장된 `sonnet[1m]` 모델 설정이 API가 거부하는 모델 ID로 바뀌던 문제 수정
- 예약 작업이 뒤에 답했을 때 focus view가 내 프롬프트에 대한 답을 숨기던 문제 수정
- fullscreen이 꺼져 있을 때 백그라운드 서브에이전트 화면에서 프롬프트가 가끔 빠지던 문제 수정
- 목록과 권한 프롬프트의 긴 옵션이 줄바꿈될 때 일부가 덮여 쓰이던 문제, 좁은 터미널에서 첫 실행 화면의 줄이 사라지던 문제 수정
- 권한 규칙 관련 시작 경고와 "N MCP servers need authentication" 알림이 화면 밖으로 스크롤됐는데도 본 것으로 기록되던 문제 수정
- 에이전트 이름이나 작업 폴더에 제어문자나 줄바꿈이 있을 때 환영 헤더에 제어문자가 보이거나 여러 줄로 나뉘던 문제 수정
- 사용자만 실행할 수 있는 명령을 Claude가 시도할 때 나오던 빨간 에러 수정: 이제 프롬프트에 직접 입력할 때만 실행된다는 흐린 줄을 표시
- `/stats`의 Active days 합계가 하루 많게 나오던 문제 수정
- 분석 대상 세션이 없는데 `/insights`가 리포트 준비 완료라고 하던 문제, HTML 리포트에 두 값을 이스케이프 없이 쓰던 문제 수정
- managed settings, `--settings`, 프로젝트의 `.claude/settings.json` 또는 `.claude/settings.local.json`이 값을 고정하고 있는데 `/voice`가 voice mode를 바꿨다고 하던 문제 수정. 이제 어떤 설정이 값을 고정하는지 알려줌
- Windows와 Linux에서 IDE 환영 대화상자가 Quick Launch 단축키를 Cmd+Esc로 표시하던 문제 수정
- 조직 정책이 클라우드 세션을 거부하는데도 Slack 앱 팁이 표시되던 문제 수정
- 키 입력을 읽을 터미널이 없을 때 `claude purge`가 조용히 멈추던 문제, stdin이 파이프일 때 프로젝트 선택기와 `-i` 프롬프트가 키보드를 무시하던 문제 수정
- `claude plugin eval --output-dir ''`가 리포트를 현재 폴더에 쓰던 문제 수정. 이제 에러로 종료
- 터미널에서 `claude -p` 텍스트 출력이 텍스트 스타일 외의 제어 시퀀스를 그대로 내보내던 문제 수정. 파이프와 파일 출력은 그대로
- 설정 디렉토리에 `.oauth_refresh.lock.owner.tmp.*` 파일이 쌓이던 문제 수정
- 키 없는 Console 로그인에서 Claude Code가 서버에 묻지도 않았는데 `/fast`가 "Fast mode has been disabled by your organization"이라고 하던 문제 수정
- 네트워크가 없는 경우처럼 Claude Code가 확인할 수 없는데도 `/model`이 조직이 모델을 제한한다고 하던 문제 수정
- 브라우저 단계 직후 Esc를 누르면 `/login`의 "Sign in with your Console account"가 기존 로그인을 덮어쓰던 문제 수정
- 로그인이 실패하거나 취소됐는데도 브라우저에 로그인 성공 페이지가 나오던 일부 경우 수정
- `claude auth status` 등 짧은 명령이 Console 프로필에 lock을 남겨 다음 세션이 약 1분간 멈추던 문제 수정
- claude.ai 로그인으로 시작한 백그라운드 세션이 백그라운드 서비스를 시작한 셸의 API 키나 토큰을 사용(및 과금)하던 문제 수정
- 백그라운드에서 세션이 다른 로그인으로 옮겨지던 경우를 더 수정. 이제 이런 이동은 거부하고 가능한 방법을 메시지로 안내
- 백그라운드 이동이 거부된 뒤 종료 대화상자에서 Enter를 한 번 더 누르면 백그라운드 작업이 중지되던 문제 수정
- `allowedProviders` managed setting이 허용하지 않는데도 Amazon Bedrock 토큰 계산이 대화를 Bedrock에 보내던 문제 수정
- `HOME` 환경변수 없이 Claude Code를 시작하면 AWS `credential_process` 헬퍼와 Google Cloud 기본 자격증명이 실패하던 문제 수정
- 서브에이전트의 plan이 승인된 뒤 세션이 가끔 이전 권한 모드로 돌아가던 문제 수정
- Agent SDK `applyFlagSettings()` 호출에 잘못된 값이 하나 있으면 이전 호출의 설정이 모두 조용히 버려지던 문제 수정. 이제 그런 호출은 에러로 거부
- 끝난 pull request가 내 리뷰나 병합만 기다리는데 세션이 입력 대기로 표시되던 문제 수정
- 인식할 수 없는 `teammateMode` 설정값이 경고 없이 무시되던 문제 수정: `claude -p`, 시작 경고, `claude doctor`가 건너뛴 항목으로 표시(여전히 적용은 안 됨)
- 새 홈 디렉토리에서 처음 실행할 때 `--worktree`가 `CLAUDE_CODE_PLUGIN_SEED_DIR` 플러그인의 `WorktreeCreate` hook을 건너뛰던 문제 수정
- Dispatch 같은 brief-mode 세션이 이미 답한 턴에 다시 답을 보내던 문제 수정
- 플러그인이 다른 URL로 등록한 경우, 클라우드 세션에서 정상 동작하는 Atlassian·Asana·Sentry 커넥터를 Claude가 실패했다고 하던 문제 수정
- 폴더 이동이나 pre-warmed 시작 뒤 Claude Desktop과 SDK 세션이 폴더 자체의 MCP 서버(`.mcp.json`, local)를 호스트 추가로 표시하거나 아예 표시하지 않고, WebSocket 서버를 연결하지 않던 문제 수정
- 연결 중에 플러그인 reload로 제거된 플러그인 MCP 서버를 `/mcp`가 계속 표시하던 문제 수정
- 토큰 갱신이 잠깐만 거부됐는데 MCP 서버가 "needs authentication" 상태로 남고 `mcp_tool` hook을 건너뛰던 문제 수정
- 도구 호출 중 서버 연결이 교체된 뒤 headless 모드에서 MCP elicitation 요청이 묻지 않고 취소되던 문제 수정
- 도구 호출이 MCP 서버를 재연결한 뒤 SDK 호스트의 MCP 도구 호출이 "Not connected"로 답하던 문제 수정
- 질문을 Esc로 닫거나 다시 받은 뒤 MCP 작업이 멈추던 문제 수정: 이제 footer에 입력이 필요하다고 표시하고, `/tasks`에서 Enter를 누르면 질문을 다시 보여줌
- 같은 서버에 대한 다른 호출이 연결을 잃은 뒤 업데이트가 멈춘 백그라운드 MCP 작업을, 이후 호출이 재연결하면 다시 진행하도록 수정
- 작성 중인 메시지 위로 백그라운드 MCP 작업의 질문이 열리던 문제 수정. 이제 초안을 보내거나 지울 때까지 기다리고, 스피너와 턴 타이머는 계속 동작
- 2.34 같은 구버전 git에서 `worktree.sparsePaths`와 sparse 플러그인·marketplace clone이 저장소 루트 파일을 빠뜨리던 문제 수정
- 저장소가 여러 개인 self-hosted runner 세션이 세션 중간에 추가된 저장소를 쓰지 못하던 문제 수정
- 내 artifact나 그 데이터를 읽기 전에 Claude가 권한을 묻던 문제 수정
- 일부 클라우드 세션에서 Artifact 도구의 deny·ask 권한 규칙과 hook이 적용되지 않던 문제 수정
- Code Mode 스크립트가 `EnterWorktree`로 들어간 worktree를 무시하던 문제, 프로젝트에 `~` 경로를 쓰던 문제, 로그인이 만료된 MCP 서버를 `/mcp`가 연결됨으로 표시하던 문제 수정
- Code Mode에서 권한 대화상자나 plan 승인 시 Yes와 함께 입력한 말이 Claude에게 전달되지 않던 문제 수정
- Code Mode 스크립트 도중 끝난 세션을 재개하면 Claude가 스스로 작업을 시작하던 문제 수정. 이제 다음 프롬프트를 기다림
- 도구 호출이 실행되는 동안 보낸 메시지에 대해 OpenTelemetry `user_prompt` 이벤트가 빠지던 문제 수정. 이 이벤트에는 `delivery.mode: "mid_turn"`과 실행 중인 턴의 `prompt.id`가 들어감
- VS Code에서 대기 메시지가 한 턴으로 합쳐지거나 메시지에 이미지가 있을 때 OpenTelemetry `user_prompt` 이벤트가 이전 메시지 텍스트를 빠뜨리던 문제 수정
- 슬래시 명령의 `allowed-tools` 허용이 그 턴 중이나 이후에 깨어난 백그라운드 에이전트에도 적용되던 문제 수정
- `/feedback`과 `/bug`가 로그인한 계정이나 조직이 기록한 다른 세션만 업로드하도록 수정
- 상대 경로 deny·ask 권한 규칙(예: `Read(./.env)`)이 `cd` 뒤에 프로젝트를 덮지 못하던 문제 수정. 이제 추가 디렉토리에도 적용
- `mcp__plugin_*_`으로 시작하는 deny·ask 권한 규칙이 대소문자가 다른 플러그인 MCP 서버나 도구를 놓치던 문제 수정
- self-hosted runner와 `claude remote-control` 세션에서 Claude Code 재시작 뒤 도착한 권한 승인에 deny 규칙이 적용되지 않던 문제 수정
- 저장소의 특정 하위 폴더에서 Claude Code를 시작하면 커밋된 `.claude/settings.local.json`을 사용자 본인 설정으로 취급할 수 있던 문제 수정
- 일부 deny·ask 규칙이 특정 Bash 명령에 적용되지 않던 문제 수정
- 일부 복합 명령이 묻지 않고 실행될 수 있던 Bash 권한 검사의 틈 수정. 이제 권한을 물음
- Bash allow 규칙이 이름과 다른 프로그램을 실행할 수 있던 경우 수정
- 플러그인을 불러오는 동안 클라우드 세션에서 커넥터 도구의 승인 프롬프트가 자동으로 응답되던 문제 수정
- allow 규칙이 있거나 이전에 업로드를 승인했을 때, 일부 서브에이전트가 조직 밖에서 볼 수 있는 artifact를 묻지 않고 바꾸거나 파일을 올리던 문제 수정
- Artifact에 "don't ask again"을 골랐을 때, 조직 밖에서 볼 수 있는 페이지의 일부 artifact 게시가 확인을 건너뛰던 문제 수정
- auto mode가 조직 밖에서 볼 수 있는 artifact의 첫 변경만 판단하던 문제 수정. 이제 승인은 그 변경 하나에만 적용
- 이미 실행 중인 세션에서 managed `strictPluginOnlyCustomization`의 에이전트·스킬 잠금이 적용되지 않던 문제 수정
- 일부 경우 샌드박스 명령이 네이티브 업데이터의 다운로드 폴더에 쓸 수 있던 문제 수정
- Bash 샌드박스가 worktree의 설정과 hook을 완전히 보호하지 못하던 경우 수정
- Bash 샌드박스가 linked worktree의 공유 git 폴더를 완전히 보호하지 못하던 경우 수정
- 일부 특이한 git 상태에서 `/teleport`의 stash 선택 수정: 이제 멈추고 해야 할 일을 알려줌
- Windows: 사용자 계정이 열 수 없는 폴더 아래의 PATH 항목 때문에 시작이 약 1초 멈추던 문제 수정
- Windows에서 드라이브 문자 대소문자나 슬래시가 다르게 기록된 세션을 `/resume`가 거부하거나 숨기던 문제 수정
- Windows에서 드라이브 문자 대소문자가 다르게 기록된 세션을 세션 내 `/resume`로 열면 프로젝트에 저장된 신뢰가 사라지던 문제 수정
- Linux: 심볼릭 링크된 홈 디렉토리 아래처럼 작업 디렉토리가 `denyRead` 안의 `allowRead` 폴더 아래에 있으면 샌드박스 Bash 명령이 `bwrap: Can't create file`로 실패하던 문제 수정
- Claude Desktop의 서드파티 배포가 토큰 갱신이 끝날 때까지 "Stopping"에 머물던 문제 수정(이 버전이 포함된 뒤부터)
- 출력 토큰 한도에서 잘린 서브에이전트 개선: 끝부분만 돌려주지 않고 답 전체를 더 짧게 다시 요청
- 키 없는 Console 로그인과 기타 Anthropic 프로필 로그인의 시작 개선: 아직 유효한 토큰은 자격증명 lock을 기다리지 않고 읽음
- 계정 이메일 검사 개선: 명령이 실행하는 스크립트, 파일 쓰기, 웹 fetch, MCP 호출에서도 사용자 이메일을 클라이언트 신원으로 쓰는 것을 거부
- 비공개 플러그인 marketplace의 `HTTPS authentication failed` 메시지 개선: git 터미널 프롬프트와 askpass 프로그램이 꺼져 있다고 알리고, 최신 git 버전에서도 표시
- marketplace 추가 확인, 플러그인 추천 프롬프트, 플러그인 설치 경고 개선: 플러그인이 파일과 셸에 접근해 컴퓨터에서 코드를 실행할 수 있다고 알림
- `claude --desktop` 로그인 에러 개선: Claude 계정 로그인을 막는 API 키, 제공자, 설정을 지목
- macOS와 Windows의 `/voice` "No audio detected" 메시지 개선: 마이크를 고르는 위치를 알려줌
- MCP 작업 개선: 작업이 사용자 답을 기다리면 Claude에게 알려 `/tasks`로 안내할 수 있게 함
- `claude remote-control` 개선: 스스로 멈추면 상태 코드 4(단일 세션 실행은 계속 0), 등록에 실패하면 69로 종료해 서비스 매니저가 다시 시작할 수 있음
- 백그라운드 세션이 세션의 API 키나 토큰을 쓸 수 없을 때 나오는 메시지 개선: 더 이상 키를 settings에 추가하라고 하지 않음
- 번들 dataviz 스킬의 부분-전체 조언 개선: 정적 이미지, 그리고 연령대처럼 자연스러운 순서가 있는 부분에 대한 조언 보강
- 샌드박스 Bash 명령이 기본적으로 일반 권한 흐름을 따르도록 변경. 프롬프트 없이 계속 실행하려면 `sandbox.autoAllowBashIfSandboxed: true` 설정
- 샌드박스를 켜는 managed settings 변경: 프롬프트 없이 실행하려면 가장 우선순위가 높은 managed 소스에 `sandbox.autoAllowBashIfSandboxed: true` 설정
- 프로젝트 저장소도 아니고 신뢰한 저장소도 아닌 곳에서는 읽기 전용 git 명령도 먼저 묻도록 변경. 프롬프트 없이 실행하려면 `additionalDirectories` 설정이 아니라 `--add-dir`로 지정
- 예약 작업과 `/loop`가 `allowed-tools`나 hook을 선언한 스킬을 실행하기 전에 묻도록 변경. 무인 실행하려면 `permissions.allow`에 `Skill(name)` 추가
- Desktop·IDE·SDK 호스트의 "Always allow" 변경: 규칙 저장이 그 명령을 다시 허용할 때만 규칙 단독 옵션을 제시. 그래서 이를 믿던 예약 작업이 사용자를 기다릴 수 있음
- 실행 폴더와 마찬가지로 추가 디렉토리의 `.claude` settings·skills·agents·commands·hooks에 대한 샌드박스 쓰기도 거부하도록 변경
- worktree 격리 변경: 격리된 worktree 세션·에이전트는 `git bisect run`, `git maintenance register|start`, `scalar` 설정 명령을 거부당하고, 대신 가능한 것을 안내받음
- 플러그인 MCP 번들(`.mcpb`, `.dxt`)을 플러그인 폴더의 `.mcpb-cache`가 아니라 plugins 디렉토리 아래에 풀도록 변경. 읽기 전용 플러그인 폴더도 로드됨. URL로 받은 번들은 한 번 다시 다운로드
- managed settings가 선언·활성화하고 `prependPlugins`·`appendPlugins`에 나열한 원격 marketplace의 플러그인을 조직 플러그인으로 취급하도록 변경. `pluginDigests`는 폐기되어 무시
- 플러그인 폴더의 일부 위험한 경로·링크를 플러그인 로딩은 건너뛰고 `claude plugin validate`는 보고하도록 변경
- 중첩 스킬 로딩 변경: `--plugin-dir` 플러그인 안의 `.claude/skills` 폴더는 그 위에서 시작한 세션에서 더 이상 로드되지 않음. 플러그인 폴더에서 Claude Code를 시작할 것
- EnterWorktree가 프로젝트 안의 심볼릭 링크를 거치는 `WorktreeCreate` hook 경로를 거부하도록 변경. hook이 실제 경로를 출력하게 할 것
- tmux·iTerm2 팀원, 그리고 agents view에서 ←로 연 새 세션이 셸이 마지막으로 `cd`한 곳이 아니라 세션 폴더에서 시작하도록 변경
- 백그라운드나 예약 작업이 시작한 턴이 8번 연속되면 터미널 프롬프트 제안을 덜 자주 갱신하도록 변경. 키를 누르거나 터미널로 돌아올 때까지 사용량 절약
- 백그라운드 MCP 작업 질문에서 Esc를 "나중에 답하기"로 변경: 서버에 아무것도 보내지 않고 질문은 `/tasks`에 남음
- `CLAUDE_CODE_MAX_CONTEXT_TOKENS`가 게이트웨이의 `claude-sonnet-latest`처럼 `claude-`로 시작하는 인식 불가 모델 ID의 context window도 설정하도록 변경
- `/login`이 개인정보 설정을 바꾸기 전에 권한을 묻도록 변경
- `/cost`, `$.session.usage()`, `--max-budget-usd`, 비용·토큰 지표가 mod의 `$.model.complete`·`$.model.classify` 호출도 집계하도록 변경
- 네트워크 브리지처럼 샌드박스가 자체 용도로 시작하는 프로그램은 Claude Code의 로그인 토큰과 API 키가 없는 환경에서 실행하도록 변경
- ripgrep, 로컬 git 명령, 샌드박스 런타임 헬퍼는 mTLS 클라이언트 키 암호가 없는 환경에서 실행하도록 변경
- Remote Control: 연결된 세션에 공유 링크가 있거나 이를 확인할 수 없으면 `/resume`과 `/teleport`가 먼저 연결을 끊도록 변경. 다시 연결하려면 `/remote-control` 실행
- Claude Code on the web, 클라우드 예약 작업, Cowork 클라우드 세션은 `sandbox.failIfUnavailable`이 있어도 시작하도록 변경: 호스팅 컨테이너에는 명령 샌드박스가 없음
- 클라우드·self-hosted 세션 연결을 통한 settings·권한 규칙·hook·상태 요청이 더 적게 반환되거나 거부되도록 변경. 세션에 적용되는 내용은 그대로
- 캐시된 계정 데이터가 없는 `claude -p`는 첫 요청 전에 그 데이터를 기다리도록 변경. 깨끗한 환경의 첫 실행은 몇 초 늦게 시작할 수 있음
- 임시 scratchpad 폴더는 비워질 수 있으므로, 남겨야 할 파일은 그 밖에 두라는 지침을 Claude에게 추가
- marketplace `ref`가 브랜치나 태그 위 어떤 커밋의 전체 ID도 받도록 변경. 이전 버전 클라이언트는 이런 고정을 clone하지 못해 해당 marketplace를 로드하지 못함
- `ALL_PROXY`만 설정된 경우 플러그인 marketplace와 플러그인 다운로드가 CONNECT 터널을 쓰도록 변경. CONNECT를 거부하는 프록시에서는 이제 실패
- 컨테이너에 마운트된 worktree나 submodule에서 `-p`·SDK를 실행할 때 `.claude/settings.local.json`의 allow 규칙은 폴더를 신뢰한 뒤에만 적용하도록 변경
- self-hosted runner가 세션 폴더나 저장소 경로가 심볼릭 링크인 세션을 거부하도록 변경(`checkout` hook의 checkout 제외)
- 클라우드 세션과 Remote Control에서 지출 한도·공유 예산 에러의 "ask your admin to raise it" 문구 제거
- [VSCode] 터미널처럼 프롬프트 제안 추가: Tab으로 제안된 다음 프롬프트를 수락. Claude Code settings.json의 `promptSuggestionEnabled: false`로 끔
- [VSCode] API 키를 만들지 않는 Console 로그인 추가
- [VSCode] SSH·WSL·컨테이너 창의 패널에서 MCP 서버에 로그인할 때 리다이렉트 URL을 붙여넣는 칸 추가
- [VSCode] Claude Code가 다른 모델로 재시작되거나 Remote Control로 모델이 바뀐 뒤 모델 선택기의 체크 표시가 이전 모델에 남던 문제 수정
- [VSCode] effort 선택기가 조직이나 `maxEffortLevel` 설정이 정한 상한보다 높은 수준을 제시하던 문제 수정
- [VSCode] managed `allowedProviders` 설정이 거부하는 로그인을 로그인 화면이 제시하던 문제 수정
- [VSCode] 안전 검사가 질문을 띄웠을 때 MCP 도구 권한 프롬프트가 이유를 말하지 않던 문제 수정
- [VSCode] 조직 설정을 불러오지 못했을 때 명령을 다시 실행하라던 메시지 수정. 이제 탭의 Retry 링크에 맞춰 다시 시도하라고 안내
- [VSCode] 신뢰하지 않은 폴더 안내 개선: 확장이 꺼진 이유와 켜는 방법을 알려줌
- [VSCode] 시스템이 Claude Code 실행을 거부할 때의 에러 개선: IT 팀이 차단된 프로그램을 허용할 수 있다고 안내
- [VSCode] 브라우저가 localhost 연결 에러를 보일 때 할 일을 로그인 카드에 안내
- [VSCode] 설치 링크의 marketplace 확인 버튼을 "Trust marketplace and continue"로 변경
- [Claude Code on the web] 새 클라우드 세션이 tool search로 불러온 MCP 도구 설명을 4,096자에서 자르던 문제 수정. 이제 다른 Claude Code 세션과 같은 16,384자
- [Claude Tag] 조직이 관리하지 않는 워크스페이스에서 게시자의 Claude 로그인이 만료됐을 때 Slack에 붙인 artifact 링크에 카드가 생기지 않던 문제 수정. 이제 기본 카드가 표시됨

---

## 🎯 챌린지

이번 버전에서 내 환경에 적용해볼 만한 항목입니다.

### 1. `.env`·SSH 키 읽기 차단 규칙 추가
- **파일**: `~/.claude/settings.json`
- **근거**: 이번 버전부터 `Read(./.env)` 같은 상대 경로 deny 규칙이 `cd` 뒤나 추가 디렉토리에서도 적용된다. 현재 설정에는 `permissions.deny`가 보이지 않는다. 여러 레포를 오가는 EOS·Flyff 작업에서 `.env`와 `~/.ssh/` 키(`eos_dev.pem` 등)가 Claude 컨텍스트에 실수로 들어가는 것을 막는다. `permissions.deny`에 `Read(./.env)`, `Read(./.env.*)`, `Read(~/.ssh/**)`를 추가한다.
- **난이도**: ★☆☆ (약 10분)

### 2. 작업 브랜치 push를 deny 규칙으로 이중 차단
- **파일**: `~/.claude/settings.json`
- **근거**: 이번 버전에서 복합 Bash 명령의 권한 검사 틈과 deny 규칙 누락이 고쳐졌다. 지금은 `deploy-guard.sh` hook 하나로만 `feat/*`·`fix/*` push를 막는다. `permissions.deny`에 `Bash(git push origin feat/*)`, `Bash(git push origin fix/*)`를 추가하면 hook이 실패해도 차단이 유지된다. 추가한 뒤 `cd x && git push origin feat/test`처럼 복합 명령도 막히는지 확인한다.
- **난이도**: ★★☆ (약 15분)

### 3. 체인지로그 자동 동기화 스킬의 무인 실행 점검
- **파일**: `~/.claude/skills/claude-changelog-sync/SKILL.md`, `~/.claude/settings.json`
- **근거**: 이번 버전부터 예약 작업과 `/loop`는 `allowed-tools`나 hook을 선언한 스킬을 실행하기 전에 묻는다. 매일 08:00 자동 동기화가 Claude Code 예약 작업으로 돌고 SKILL.md에 `allowed-tools`가 있으면 사용자 응답을 기다리며 멈출 수 있다. 그런 경우 `permissions.allow`에 `Skill(claude-changelog-sync)`를 추가한다. 시스템 cron이 `claude -p`를 직접 부르는 방식이면 해당하지 않는다.
- **난이도**: ★☆☆ (약 10분)
