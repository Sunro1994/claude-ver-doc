# Claude Code v2.1.251

> 작성일: 2026-08-29

---

# 📋 요약본

## 🎉 신기능 (5건)
- **`PreModelSwitch` / `PostModelSwitch` 훅 이벤트** — 모델 전환을 차단·확인·기록할 수 있다. `SessionStart` resume 훅은 세션이 얼마나 오래됐는지와 캐시를 다시 만드는 데 드는 예상 비용을 함께 받는다.
- **포그라운드 서브에이전트 실시간 스트리밍** — 서브에이전트의 도구 호출과 결과가 Remote Control 클라이언트로 실시간 전송된다. 기본값인 백그라운드 서브에이전트는 여전히 상태만 표시.
- **`/usage` Spend limit 바** — 지출 한도가 걸린 Claude apps 게이트웨이 사용자를 위해 지출 한도 막대와 `rate_limits.spend_limit` 상태줄 필드가 추가됐다.
- **`/cost` 프롬프트 캐시 정보** — 세션별 캐시 적중률·미스·재캐시 토큰·warm/cold 를 보여준다. 상태줄 스크립트용 `prompt_cache` 객체도 함께 제공.
- **`claude --help` 백그라운드 세션 명령 노출** — `attach`, `logs`, `stop`, `respawn`, `rm` 이 도움말에 추가됐다. 실행 중인 백그라운드 세션의 `--resume` 안내는 정확한 `claude attach <id>` 명령을 알려준다.

## 🛠️ 개선/수정 (74건)
- **심볼릭 링크 보안 구멍 차단** — Read·Write·Edit 가 권한 검사 후 바꿔치기된 심볼릭 링크를 따라가 승인 범위 밖을 읽거나 쓰던 문제를 고쳤다. Grep·Glob 도 심볼릭 링크 경로로 도달한 파일에 `Read(...)` deny 규칙을 적용한다.
- **경로 탈출 차단** — 마켓플레이스 항목의 플러그인 명령이 플러그인 디렉터리 밖을 가리킬 수 없다. Workflow 도구도 권한 검사 전에 세션 밖 `scriptPath` 를 읽지 않는다.
- **설정 권한 상승 차단** — 프로젝트 설정으로 상세 베타 트레이싱·원시 API 본문 로깅을 켤 수 없고, 관리 설정이 고정한 OTLP 수집기를 우회할 수 없다.
- **Opus 5 effort 오류** — effort 가 xhigh/max 인데 thinking 이 꺼져 있으면 요청이 실패하던 문제. 이제 그 경우 effort 를 `high` 로 보낸다.
- **빈 텍스트 블록 멈춤** — 모델이 thinking 만 출력한 턴 이후 "text content blocks must be non-empty" 에러로 대화가 멈추던 문제를 고쳤다.
- **병렬 서브에이전트 TUI 지연** — 초당 진행 틱이 트랜스크립트에 쌓이지 않고 이전 것을 대체한다.
- **에이전트 팀 통신** — 팀원의 최종 답변이 팀 리드에게 전달되지 않던 문제, 백그라운드 서브에이전트가 이름 없는 형제·부모 에이전트에게 답장하지 못하던 문제를 고쳤다.
- **Bash 권한 우회** — 정수 셸 변수에 산술식을 대입하는 명령(`OPTIND=1/0`, `RANDOM=2+2`)이 자동 승인되던 문제. 이제 승인을 묻는다.
- **`CLAUDE_CODE_SUBAGENT_MODEL` 의미 변경** — 전부 덮어쓰던 것에서 기본값 지정으로 바뀌었다. 에이전트 정의의 `model:` 과 spawn 시 명시한 모델이 우선한다.
- **`/effort` 모델별 저장** — 기본 effort 레벨을 모델마다 따로 기억한다.
- **프로젝트 설정 env 제한** — `.claude/settings.json` 의 `env` 로 `CLAUDE_CONFIG_DIR`·`CLAUDE_CODE_TMPDIR`·`TMPDIR`/`TMP`/`TEMP` 를 설정할 수 없다. 셸·사용자·관리 설정에서 지정해야 한다.
- **승인 요구 확대** — 샌드박스 TLS 종료·프록시 경유·자격증명 주입·격리 약화 서버 설정, 그리고 자격증명·라우팅 계열 `ANTHROPIC_CUSTOM_HEADERS` 는 적용 전 승인이 필요하다.
- **설치 크기 감소** — 네이티브 바이너리 약 5MB 축소. 잘 쓰이지 않는 6개 언어 하이라이팅 제거로 2.5MB 추가 감소.
- **CPU 사용량 개선** — 대화형 세션의 중복 UI 렌더링을 줄였다.
- **Enterprise 기본 모델** — 좌석제 Enterprise 구독의 기본 모델이 Opus 5 로 변경됐다.

## 🔑 이번 버전의 핵심 키워드
**"경로·설정 권한 상승 차단"** — 심볼릭 링크·플러그인 경로·프로젝트 설정을 통한 승인 범위 우회를 전방위로 막고, 훅과 비용 가시성을 함께 넓힌 보안 중심 릴리스.

---

# 📜 원문 (한글 번역본)

> 원문 ChangeLog를 원래 순서 그대로 한 줄도 빠짐없이 번역한 문서입니다.

- `PreModelSwitch` 및 `PostModelSwitch` 훅 이벤트 추가 (모델 전환을 차단·확인·주석 처리). `SessionStart` resume 훅은 이제 세션 노후도(staleness)와 예상 재캐시 비용을 전달받는다
- 포그라운드 서브에이전트의 도구 호출·결과를 Remote Control 클라이언트로 실시간 스트리밍하는 기능 추가 (기본값인 백그라운드 서브에이전트는 여전히 상태만 표시)
- 지출 한도가 있는 Claude apps 게이트웨이 뒤의 개발자를 위해 `/usage` 에 Spend limit 바와 `rate_limits.spend_limit` 상태줄 필드 추가
- `/cost` 에 세션별 프롬프트 캐시 줄 추가 (적중률, 미스, 재캐시된 토큰, warm/cold) 및 상태줄 스크립트용 `prompt_cache` 객체 추가
- `claude --help` 에 `attach`, `logs`, `stop`, `respawn`, `rm` 추가. 실행 중인 백그라운드 세션의 `--resume` 메시지는 정확한 `claude attach <id>` 명령을 알려준다
- 파일 도구(Read, Write, Edit)가 권한 검사 이후 작업 디렉터리 안에서 바꿔치기된 심볼릭 링크를 따라가 승인된 위치 밖을 읽거나 쓸 수 있던 문제 수정
- 마켓플레이스 항목에 선언된 플러그인 명령이 플러그인 디렉터리 밖을 가리킬 수 있던 문제 수정. 이제 그런 경로는 path-traversal 에러로 거부된다
- 프로젝트 설정이 상세 베타 트레이싱이나 원시 API 본문 로깅을 켤 수 있던 문제, 그리고 낮은 범위(scope)의 베타 트레이싱 엔드포인트가 관리 설정 또는 호스트 앱이 고정한 OTLP 수집기를 우회하던 문제 수정
- Workflow 도구가 권한 검사가 실행되기 전에 세션이 읽을 수 있는 범위 밖의 `scriptPath` 를 읽던(그리고 에러 메시지에 인용하던) 문제 수정
- Grep 과 Glob 이 심볼릭 링크된 검색 경로를 통해 도달한 파일에 `Read(...)` deny 규칙을 적용하지 않던 문제 수정
- 모델이 thinking 만 생성한 턴 이후 대화가 "text content blocks must be non-empty" 에러에 갇히던 문제 수정
- 시작 기본값이 auto 모드인 계정에서, 새로 설치한 뒤 첫 실행이 auto 모드가 아닌 default 모드로 시작되던 문제 수정
- effort 가 xhigh/max 이고 thinking 이 꺼져 있을 때 Opus 5 요청이 "effort … is not supported when thinking is disabled" 로 실패하던 문제 수정. 이제 그 경우 effort 를 `high` 로 보낸다
- Claude Desktop 이 다른 세션에서 전달한 메시지에 답장하는 문제 수정. 해당 세션 ID 로의 `SendMessage` 가 "not reachable" 실패 대신 Claude Desktop 을 통해 전달된다
- 병렬 서브에이전트가 많을 때의 TUI 지연 수정. 초당 진행 틱이 트랜스크립트에 쌓이지 않고 이전 틱을 대체한다
- 에이전트 팀 수정: 팀원의 최종 답변이 팀 리드에게 도달하지 않던 문제. 이제 내용 없는 "available" 알림 대신 idle 알림에 담겨 도착한다
- 백그라운드 서브에이전트가 이름 없는 형제 또는 부모 에이전트의 메시지에 답장하지 못하던 문제 수정 (`from` 이 주소가 아닌 에이전트 타입이었음)
- 관리 설정의 `disableAutoMode` 가 세션 도중 도착해도 이미 실행 중인 auto 모드 세션이 default 모드로 되돌아가지 않던 문제 수정
- 현재 Opus 모델이 이미 1M 컨텍스트 창을 가진 경우에도 "switch to Opus 1M for 5x more context" 팁이 표시되던 문제 수정
- Claude apps 게이트웨이 세션이 저장된 Anthropic 프로필(예: Console 로그인)을 활성 상태로 취급하던 문제 수정. 요청에는 전혀 사용되지 않는데도 `/status` 에 표시되고 게이트웨이 401 재시도에 쓰이던 문제
- 호스트가 세션의 초기 모델을 설정했을 뿐인데 클라우드 세션이 Claude 에게 모델이 변경됐다고 알리던 문제 수정
- 조직 정책이 Remote Control 을 비활성화했을 때 실패로 보고하던 문제 수정. 이제 조용한 알림 하나만 표시한다
- Remote Control 에서 `/mcp reconnect` 시, 서버가 다른 세션에서 비활성화된 경우 실제 해결책 대신 세부 정보가 가려진 일반 에러를 보여주던 문제 수정
- `--input-format stream-json` 수정: 메시지 ID 없이 전송된 클라이언트 주입 assistant 도구 호출이 첫 번째 것으로 병합되고 결과가 유실되던 문제 (이전 세션 재개 시 포함)
- 디렉터리 변경으로 세션이 동일 ID 의 기존 트랜스크립트 위로 재배치될 때 세션 트랜스크립트가 조용히 덮어써지던 문제 수정
- 백그라운드 세션과 그 서브에이전트가 `git worktree add` 로 직접 만든 git worktree 안의 파일을 편집하지 못하던 문제 수정
- 다른 Claude Code 프로세스가 같은 순간 플러그인 마켓플레이스를 갱신 중일 때 백그라운드 세션이 플러그인 스킬 없이 시작되고 그 상태로 유지되던 문제 수정
- SSH 를 통한 tmux 안에서 열린 백그라운드 세션의 텍스트 선택 수정. 이제 OSC 52 로 폴백하지 않고 포그라운드 세션처럼 tmux 버퍼에 복사된다
- SDK MCP 서버의 핸드셰이크 확인 응답이 유실됐을 때 SDK·클라우드 세션이 무한정 멈추던 문제 수정. 이제 70초 후 대기가 만료되고 해당 서버만 실패로 표시된다
- 세션이 강제 중지된 후에도 self-hosted 러너가 멈춘 세션의 Bash 도구 프로세스를 계속 실행 상태로 남기던 문제 수정
- 조직 관리자가 사용 크레딧 한도를 $0 으로 설정한 Team·Enterprise 멤버의 `/usage-credits` 수정. 이제 한도에 도달했다고 말하는 대신 관리자에게 요청할지 제안한다
- gitlab.com origin 에서 머지 리퀘스트 번호와 함께 쓴 `--worktree --tmux` 가 GitLab ref 를 직접 가져오지 않고 실패가 예정된 GitHub 방식 fetch 를 먼저 시도하던 문제 수정
- `emacs -nw`, `micro` 처럼 `/dev/tty` 를 여는 에디터에서 백그라운드 세션의 Ctrl+G 가 "Emacs quit unexpectedly" 로 실패하던 문제 수정
- 널 바이트가 포함된 `additionalDirectories` 항목이 시작을 크래시시키거나, SDK 호스트·IDE·훅에서 온 경우 `/add-dir` 과 이후 설정 업데이트를 망가뜨리던 문제 수정. 이제 해당 항목은 건너뛴다
- MCP 서버 메뉴의 복사 단축키 수정. 항상 성공했다고 주장하는 대신 로그인 URL 이 어떻게 복사됐는지 알려준다
- GNU screen 및 `screen` 터미널 타입을 쓰는 tmux 세션에서 이탤릭 텍스트(예: 세션 요약 줄)가 강조 블록으로 렌더링되던 문제 수정
- `claude mcp add --header` 와 `claude mcp add-json` 의 도움말이 잘못된 transport 를 명시하던 문제 수정
- 클라우드 세션 시작에 실패했을 때 `claude ultrareview` 와 `/ultrareview` 가 30분을 다 기다리던 문제 수정. 이제 일찍 중단하고 이유를 보고한다
- 정수 셸 변수에 산술식을 대입하는 명령(예: `OPTIND=1/0`, `RANDOM=2+2`)을 Bash 권한 검사가 자동 승인하던 문제 수정. 이제 승인을 요청한다
- 백그라운드 세션(`←`, `/background`, `--bg`)이 셸에서 export 된 Vertex/Bedrock 게이트웨이(`ANTHROPIC_*_BASE_URL` + `CLAUDE_CODE_SKIP_*_AUTH`)를 잃어 모든 요청이 실패하던 문제 수정
- Max 플랜에서 `claude --bg --model fable` 이, 같은 계정의 대화형 세션에는 아직 Fable 사용량이 남아 있는데도 사용 크레딧을 묻기 위해 멈추던 문제 수정
- 무인 세션(예: 에이전트 팀 팀원 창)에서 "make auto mode your default" 일회성 제안이 나타나 실수로 누른 키가 읽지도 않은 채 수락될 수 있던 문제 수정
- 설정이 변경되지 않았는데도 같은 Claude apps 게이트웨이에 다시 로그인하면 관리 설정 승인 프롬프트가 재등장하던 문제 수정
- 비활성화된 `/bug` 와 `/share` 가 `/feedback` 이 비활성화됐다고 보고하던 문제 수정. 조직 정책이나 환경변수가 `/feedback` 을 끈 경우 팁·`/help`·거부 메시지가 더 이상 `/feedback` 을 제안하지 않는다
- 일시적인 GitHub 연결 실패 후 클라우드 세션 생성이 GitHub 설정을 권하던 문제 수정. 이제 재시도하라고 안내한다
- 중복 UI 재렌더링을 줄여 대화형 세션의 턴 진행 중 CPU 사용량 개선
- 설치 크기 개선: 네이티브 바이너리가 약 5MB 작아졌다
- 클라우드 세션 개선: Bash 명령 도중 세션의 네트워크 프록시가 연결을 끊으면 도구 결과가 "connection reset" 만 표시하지 않고 호스트와 사유를 명시한다
- `/schedule` 개선: Claude Code 에 설정된 MCP 서버는 클라우드 루틴에 붙일 수 없다는 점을 설명한다 (기존의 "No MCP connectors" 단문 대체)
- 자신의 서브에이전트가 보낸 메시지의 프레이밍 개선: 발신자가 무관한 Claude 세션이 아니라 이 세션 내부의 워커임을 Claude 에게 알린다
- 서브에이전트 패널이나 `/tasks` 에서 연 백그라운드 서브에이전트·포크 트랜스크립트를 보는 동안 프롬프트 플레이스홀더가 "Message @name…" 으로 표시되도록 개선
- 에러 메시지·메뉴·명령 결과에서 MCP 서버 이름 살균(sanitization) 개선
- `CLAUDE_CODE_PROVIDER_MANAGED_BY_HOST`(예: Claude Desktop) 하의 Amazon Bedrock 세션 시작 개선: Bedrock 모델 ID 나 ARN 이 주어진 세션은 더 이상 inference-profile 탐색을 기다리지 않는다
- 관리 설정 승인 대화상자가 마지막 승인 이후 변경된 설정만 나열하도록 개선
- 모델의 도구 호출이 잘못된 형식일 때의 재시도 개선: 깨진 출력이 재시도 컨텍스트에서 제거된다 (Bedrock, Vertex, Foundry 포함)
- `/radio` 를 Bedrock, Vertex AI, Foundry, Claude Platform on AWS 에서, 그리고 텔레메트리가 꺼진 경우에도 사용할 수 있도록 변경
- Claude in Chrome 변경: 브라우저 동작이 항상 Claude Code 의 권한 검사를 거친다. 이전에 Chrome 확장의 자체 프롬프트를 쓰던 텔레메트리 비활성 세션 포함
- `CLAUDE_CODE_SUBAGENT_MODEL` 을 전부 덮어쓰는 대신 기본 서브에이전트 모델을 설정하도록 변경. 에이전트 정의의 `model:` 과 spawn 별 명시 모델이 우선한다
- 활성 모델이 인식된 Claude 모델이 아닐 때(예: 커스텀 `ANTHROPIC_BASE_URL` 뒤의 서드파티 모델) 기본 커밋 trailer 를 `Co-Authored-By: Claude Code` 로 변경
- 좌석제 Enterprise 구독의 기본 모델을 다른 프리미엄 플랜과 동일하게 Opus 5 로 변경
- `/effort` 가 기본 effort 레벨을 모델별로 저장하도록 변경. 모델을 전환해도 각 모델이 자기 설정을 유지한다
- 관리 설정이 게이트웨이 로그인을 강제하거나 읽을 수 없다는 이유만으로 로그인 전 분석(analytics)이 꺼지지 않도록 변경. 게이트웨이에 로그인했거나 `DISABLE_TELEMETRY` 를 쓴 경우에는 계속 꺼진 상태를 유지한다
- Bedrock, Vertex, Foundry 및 텔레메트리가 꺼진 경우의 푸터 PR 배지를 `gh pr view` 대신 GitHub API 직접 호출(`gh auth token`, `GH_TOKEN`, `GITHUB_TOKEN` 경유)로 변경
- 샌드박스에서 명령이 실행될 때 Bash 명령 출력 파일을 만들고 다시 읽는 방식을 변경. 샌드박스 명령이 그 파일을 리다이렉트하거나 교체할 수 없다
- 플러그인·LSP 설치 제안과 auto 모드 기본값 제안이 입력 중인 내용을 전송하거나 지울 때까지 대기하도록 변경. 프롬프트를 보내는 Enter 가 제안에 답해버리지 않는다
- 샌드박스 TLS 를 종료하거나, 샌드박스 트래픽을 자체 프록시로 라우팅하거나, 자격증명을 주입하거나, 샌드박스 격리를 약화시키는 서버 관리 설정은 적용 전 승인을 요구하도록 변경
- 관리 설정 또는 프로젝트 설정의 `ANTHROPIC_CUSTOM_HEADERS` 가 자격증명·조직/테넌트·라우팅·API 동작 헤더(예: `Authorization`, `Host`)를 설정하는 경우 승인을 요구하도록 변경
- 프로젝트 수준 `.claude/settings.json` 의 `env` 가 `CLAUDE_CONFIG_DIR`, `CLAUDE_CODE_TMPDIR`, `TMPDIR`/`TMP`/`TEMP` 를 설정하지 않도록 변경. 셸·사용자·관리 설정에서 지정해야 한다
- 잘 쓰이지 않는 6개 언어(1c, gml, isbl, mathematica, maxima, sqf)의 구문 강조 제거. 바이너리가 2.5MB 작아졌다
- [VSCode] 로그인 화면의 "Bedrock, Foundry, or Vertex" 버튼이 서드파티 프로바이더 설정 섹션이 아닌 문서 최상단을 열던 문제 수정
- [VSCode] Remote Control 배너를 푸터 pill 로 변경 (Remote Control 이 켜져 있거나 실패한 동안 표시). claude.ai/code 에서 세션을 연다. `/remote-control` 로 켜고 끈다

---

## 🎯 챌린지

이번 버전에서 내 환경에 적용해볼 만한 항목입니다.

### 1. 상태줄에 프롬프트 캐시 지표 추가
- **파일**: `/Users/leeseonro/.claude/plugins/cache/alexgreensh-token-optimizer/token-optimizer/5.8.8/skills/token-optimizer/scripts/statusline.js`
- **근거**: 이번 버전이 상태줄 스크립트에 `prompt_cache` 객체(적중률·미스·재캐시 토큰·warm/cold)를 새로 전달한다. 토큰 최적화 상태줄을 이미 쓰고 있으므로 캐시 적중률 한 칸만 추가하면 `opus[1m]` 장시간 세션에서 캐시가 깨지는 순간을 바로 볼 수 있다.
- **난이도**: ★★☆ (약 15분)

### 2. 모델 전환 알림 훅 추가
- **파일**: `/Users/leeseonro/.claude/settings.json`
- **근거**: `PostModelSwitch` 훅 이벤트가 새로 생겼다. 이미 `Stop` 훅에 `osascript` 알림을 쓰고 있으니 같은 방식으로 모델이 바뀔 때 알림을 띄우면, 의도치 않은 모델 전환(비용 차이가 큰 Opus↔Haiku)을 놓치지 않는다.
- **난이도**: ★☆☆ (약 10분)

### 3. 서브에이전트 Opus 고정을 `CLAUDE_CODE_SUBAGENT_MODEL` 로 이관
- **파일**: `/Users/leeseonro/.claude/settings.json`
- **근거**: `CLAUDE_CODE_SUBAGENT_MODEL` 이 "전부 덮어쓰기"에서 "기본값 지정"으로 바뀌어, 에이전트 정의의 `model:` 과 spawn 시 명시 모델이 우선한다. CLAUDE.md §5 의 "모든 subagent 는 Opus" 규칙을 프롬프트 규칙 대신 `env` 로 강제할 수 있게 됐다 — 프롬프트를 잊어도 기본이 Opus 가 된다.
- **난이도**: ★☆☆ (약 5분)

### 4. 프로젝트 설정의 금지된 `env` 키 점검
- **파일**: 각 프로젝트의 `.claude/settings.json`
- **근거**: 프로젝트 수준 `env` 가 `CLAUDE_CONFIG_DIR`·`CLAUDE_CODE_TMPDIR`·`TMPDIR`/`TMP`/`TEMP` 를 더 이상 설정하지 못한다. 해당 키를 프로젝트 설정에 넣어둔 곳이 있으면 이번 업데이트 후 조용히 무시되므로, `grep -rl 'CLAUDE_CONFIG_DIR\|CLAUDE_CODE_TMPDIR\|TMPDIR' */.claude/settings.json` 으로 찾아 사용자·셸 설정으로 옮긴다.
- **난이도**: ★★☆ (약 15분)
