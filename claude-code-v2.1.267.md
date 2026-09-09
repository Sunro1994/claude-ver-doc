# Claude Code v2.1.267

> 작성일: 2026-09-10

---

# 📋 요약본

## 🎉 신기능 (3건)
- **`maxEffortLevel` 설정 추가** — 최상위 또는 `modelSettings` 아래 모델별로 지정한다. Bedrock·Vertex·Foundry 를 포함한 모든 provider 에서 effort level 상한을 강제한다. 사용자는 그보다 낮은 값은 여전히 고를 수 있다.
- **`--system-prompt-snapshot off` 플래그 추가** — 대화에 기록된 system prompt 를 재사용하지 않고 매 요청마다 새로 렌더링한다. 프롬프트 문구를 반복 수정하며 실험할 때 쓴다.
- **[Claude Tag] 커스텀 커넥터 링크 추가** — Claude Tag 관리자 설정의 프리셋 연결 폼에 "Use a custom connector" 링크가 생겼다. 처음부터 다시 시작하지 않고 커스텀 연결로 전환할 수 있다.

## 🛠️ 개선/수정 (52건)
- **프롬프트 캐시 안정화 (11건 집중 수정)** — 이번 버전의 최대 덩어리. 세션 재개·모델 전환·MCP 재연결 때 도구 목록이 다시 쓰이며 캐시가 깨지고 extended thinking 이 유실되던 문제를 전방위로 잡았다.
  - `/model` 로 모델을 바꿀 때 모든 도구 정의를 재전송하던 문제 수정. commit·PR attribution 문구는 이제 모델 변경 시 갱신되는 대화 노트로 전달된다.
  - 세션 중간에 추가되던 MCP·플러그인 도구를 ToolSearch 없는 세션에서도 도구 목록에 끼워넣지 않는다. 지원 모델은 deferred 정의로 받는다.
  - 재개된 세션이 MCP 커넥터 재연결 시점 차이로 inline 도구 집합을 다시 쓰던 문제, 기록된 설명 대신 도구 설명을 다시 렌더링하던 문제 수정.
  - print 모드(`-p`) 대화를 대화형으로 재개할 때 system prompt prefix 가 바뀌던 캐시 미스 수정.
  - `--system-prompt`·`--append-system-prompt` 로 시작한 subagent·세션은 system prompt 와 도구 정의를 한 번만 기록한다.
- **세션 재개 관련 수정** — `-p --resume` 로 `/compact` 등 슬래시 명령 이후 재개할 때 "Continue from where you left off." 턴이 끼어들지 않는다. 5MB 초과 대형 transcript 재개 시 병렬 도구 호출과 hook 출력이 누락되지 않는다.
- **보안·격리 수정** — 백슬래시가 든 마켓플레이스 항목 경로가 macOS·Linux 에서 containment 검사를 우회할 수 있던 문제 수정. 관리 설정 `allowedHttpHookUrls`·`httpHookAllowedEnvVars`·`allowedChannelPlugins` 가 읽기 실패 시 전부 허용이 아니라 전부 차단으로 동작한다.
- **`effort:` frontmatter 수정** — 기본 effort 가 고정된 모델(Opus 4.7·4.8·Fable 5)에서 커스텀 커맨드·스킬·subagent 의 `effort:` 지정이 무시되던 문제 수정.
- **인증·자격증명** — Claude Desktop 등 호스트 앱에서 만료된 AWS·Google Cloud 자격증명이 재인증 안내 전에 10회 재시도하던 문제 수정. `claude remote-control` 이 서버 자격증명 만료(시작 후 약 30일)로 종료되며 붙은 세션을 전부 끊던 문제 수정 — 이제 호스트가 재등록하고 계속 돈다.
- **터미널·입력** — tmux·ssh 재접속 후 shift+enter·option+backspace 가 먹지 않던 문제, 전체화면에서 위로 스크롤할 때 흐린 last-prompt 헤더가 안 뜨던 문제 수정. 키 입력이 스피너·스트리밍 리페인트 뒤로 한 프레임 밀리지 않는다.
- **VSCode 확장 8건** — 순환 parent 링크가 있는 transcript 에서 fork·수정·rewind 시 extension host 가 CPU 100% 로 멈추던 문제, WSL2/WSLg 스크린샷 붙여넣기, diff 블록 테마 미적용, RTL 텍스트 순서, CRLF 파일 편집 수락 실패, 공백 포함 경로 @-mention 누락, Remote-SSH 세션 목록 로드 실패, ripgrep 프로세스 폭주를 모두 잡았다.
- **Claude Code on the web / Claude Tag** — GitHub Enterprise Server 토큰 만료 자동 갱신, Claude GitHub App 없는 조직의 `gh`·GitHub API 호출 대체, 크레딧 소진 시 오해 소지 있던 오류 메시지 개선, 스레드에서의 메시지 수정·삭제 요청 라우팅, Tool access 요청 **Connect** 실패 수정.
- **기타** — `/context` 등 로컬 커맨드 출력이 모바일에서 빈 화면으로 뜨던 문제, `/diff` 패널 깜빡임, Workflow `agent()` 대형 output schema 거부, artifact publish 재시도·UTF-8 오류 메시지 개선, 사용량 경고 깜빡임, 샌드박스에서 `pbcopy` 실패 시 `/copy` 안내, Bash 도구 설명 가이드 개선.

## 🔑 이번 버전의 핵심 키워드
**"프롬프트 캐시를 깨뜨리던 모든 경로를 봉인한 버전"** — 세션 재개·모델 전환·MCP 재연결에서 도구 목록이 다시 쓰이며 캐시가 날아가고 extended thinking 이 유실되던 문제를 11건 연속으로 수정했다.

---

# 📜 원문 (한글 번역본)

> 원문 ChangeLog를 원래 순서 그대로 한 줄도 빠짐없이 번역한 문서입니다.

- `maxEffortLevel` 설정 추가 (최상위 또는 `modelSettings` 아래 모델별): Bedrock·Vertex·Foundry 를 포함한 모든 provider 에서 effort level 에 상한을 건다. 사용자는 여전히 더 낮은 레벨을 고를 수 있다
- `--system-prompt-snapshot off` 추가: 대화에 기록된 프롬프트를 재사용하지 않고 매 요청마다 system prompt 를 새로 렌더링한다 (프롬프트 문구를 반복 수정할 때 사용)
- 관리 설정에서 샌드박싱을 요구하는 조직에서 클라우드의 Cowork 예약 작업이 시작 시 실패하던 문제 수정
- `/context` 및 기타 로컬 커맨드 출력이 모바일 클라이언트에서 빈 화면으로 렌더링되던 문제 수정
- agent view 안에서 tmux 또는 ssh 세션에 재접속한 뒤 shift+enter 와 option+backspace 가 동작하지 않던 문제 수정
- 전체화면 모드에서 위로 스크롤할 때 대화 상단에 흐린 last-prompt 헤더가 나타나지 않던 문제 수정
- 큰 output schema 를 가진 Workflow `agent()` 호출이 auto 모드에서 safety classifier 검사를 거치지 않고 거부되던 문제 수정
- 백슬래시가 포함된 마켓플레이스 항목 경로가 macOS·Linux 에서 fetch 된 마켓플레이스의 containment 검사를 우회할 수 있던 경우 수정
- Claude Desktop 같은 호스트 앱에서 만료된 AWS 또는 Google Cloud 자격증명이 재인증 오류가 뜨기 전에 일반적인 "request failed" 로 10회 재시도하던 문제 수정
- `-p --resume` 로 `/compact` 나 다른 슬래시 커맨드가 실행된 뒤 세션을 재개할 때 가짜 "Continue from where you left off." 턴이 더 이상 삽입되지 않도록 수정
- 대형 세션(transcript 5MB 초과) 재개 시 병렬 도구 호출과 그 hook 출력이 재로드된 대화에서 누락되던 문제 수정
- 관리 설정의 `allowedHttpHookUrls`·`httpHookAllowedEnvVars`·`allowedChannelPlugins` 가 읽기 불가일 때 전부 허용이 아니라 아무것도 허용하지 않도록 수정
- 관리 설정이 Claude apps gateway 로그인을 요구하는 머신에서의 `/login` 수정: 이제 Esc 로 다이얼로그가 닫힌다 (기존엔 아무 동작도 하지 않음)
- 업로드 중 연결이 끊겨 잘린 artifact publish 수정: 업로드가 완료되지 않았음을 Claude Code 가 판별할 수 있으면 결과 불명으로 보고하는 대신 한 번 재시도한다
- 기본 effort 가 여전히 고정된 모델(Opus 4.7, Opus 4.8, Fable 5)에서 커스텀 커맨드·스킬·subagent 의 `effort:` frontmatter 가 무시되던 문제 수정
- 페이지 파일이 유효한 UTF-8 이 아니거나 replacement character(U+FFFD)를 포함할 때 artifact publish 가 불친절한 오류로 실패하던 문제 수정: 이제 고쳐야 할 줄과 열을 알려준다
- `claude agents` 의 `@` 디렉토리 메뉴가 세션 시작 이후 생성된 저장소를 목록에 표시하지 않던 문제 수정
- Claude Desktop 또는 VS Code 세션에 참여한 Remote Control 클라이언트가 권한 모드를 다시 바꾸기 전까지 오래된 값을 보여주던 문제 수정
- `claude remote-control` 이 서버 자격증명 만료(시작 후 약 30일) 시 종료되며 붙어 있던 모든 세션을 끊던 문제 수정: 이제 호스트가 재등록하고 계속 동작한다
- 서로 다른 모델이나 모드의 요청이 각기 다른 limit window 를 보고할 때 세션 중 사용량 한도 경고가 켜졌다 꺼졌다 깜빡이던 문제 수정
- MCP 서버가 재전송하거나 내장 도구가 재렌더링할 때, 모델이 이미 로드한 도구 때문에 앞선 reasoning 이 유실되던 문제 수정
- 연결이 끊긴 MCP 서버나 업그레이드로 인해 대화 도중 도구가 사라지면 도구 목록이 다시 쓰이며 앞선 thinking 이 버려지던 문제 수정
- 대화에서 fork 된 백그라운드 워커가 세션 도중 대화의 도구 블록에 EnterWorktree 를 추가해 prompt-cache 재사용을 깨뜨리던 문제 수정
- ToolSearch 가 없는 세션에서 MCP·플러그인 도구가 세션 도중 도구 목록에 추가되며 prompt-cache 재사용을 깨뜨리던 문제 수정: 지원 모델은 이제 deferred 정의로 받는다
- `/model` 로 모델을 전환할 때 모든 도구 정의가 재전송되던 문제(prompt-cache 미스) 수정: commit·PR attribution 텍스트는 이제 모델 변경 시 갱신되는 대화 노트로 전달된다
- MCP 커넥터가 이전과 다른 시점에 재연결할 때 재개된 세션이 inline 도구 집합을 다시 쓰던 문제 수정
- 첫 턴에서 도구가 실행된 경우 재개된 세션이 기록된 도구 설명을 재생하지 않고 다시 렌더링하던 문제 수정
- claude.ai 커넥터의 도구가 세션과 그 재개 사이에 바뀔 때 발생하던 prompt-cache 미스와 extended thinking 유실 수정
- 재개된 세션이 커넥터 재연결 전에 이전 MCP 도구 announcement 를 다시 쓰던(그리고 extended thinking 을 버리던) 문제 수정
- print 모드(`-p`) 대화를 대화형으로 재개할 때 발생하던 prompt-cache 깨짐 수정: system prompt prefix 가 더 이상 바뀌지 않는다
- `/diff` 패널 개선: 정리되기 전에 "0 files changed" 와 스피너가 번쩍이지 않고, 빈 상태가 패널 가운데 정렬된다
- Bash 도구의 description 가이드 개선: Claude 가 명령어를 그대로 옮기는 대신 그 명령이 무엇을 하는지 평이한 말로 설명한다
- 샌드박스 가이드 개선: 샌드박스 안에서 `pbcopy` 같은 클립보드 명령이 실패하면 Claude 가 `/copy` 를 제안한다
- Bash 도구 호출이 많은 세션의 `--resume` 첫 렌더링 시간 개선
- 프롬프트 입력 반응성 개선: 키 입력이 더 이상 스피너나 스트리밍 리페인트 뒤로 한 프레임 밀리지 않는다
- prompt-cache 안정성 개선: `--system-prompt` 또는 `--append-system-prompt` 로 시작한 subagent 와 세션이 system prompt 와 도구 정의를 재렌더링하지 않고 한 번만 기록한다
- Artifact 도구 publish 오류 개선: publish 가 거부되면 이제 그 이유와 대처 방법을 알려준다
- Self-hosted runner: `--use-anthropic-git-proxy` 를 등록 시 서버에 보고하고, 여전히 레거시 git proxy 로 clone 하는 세션마다 경고를 출력하도록 변경
- Gateway: `forward_user_identity` upstream 이 이메일이 전달된 개발자에게 429 를 다음 upstream 으로 failover 하지 않고 그대로 반환하도록 변경 — 프록시의 사용자별 한도가 유지된다
- [VSCode] 저장된 transcript 에 순환 parent 링크가 있는 대화에서 fork, 이전 메시지 편집, rewind 시 extension host 가 CPU 100% 로 멈추던 문제 수정
- [VSCode] WSL2/WSLg 에서 스크린샷을 붙여넣으면 원시 이미지 바이트가 채팅 입력창에 삽입되던 문제 수정: 클립보드가 이미지를 제공하면 첨부하고, 아니면 붙여넣기를 무시한다
- [VSCode] 채팅 diff 블록이 항상 어두운 에디터 테마로 렌더링되던 문제 수정: 이제 고대비 테마를 포함해 활성 VS Code 색 테마를 따른다
- [VSCode] 메시지 입력창에서 타이핑할 때 우→좌 텍스트와 영어가 섞이면 순서가 잘못 렌더링되던 문제 수정
- [VSCode] Windows(CRLF) 줄바꿈 파일에서 diff view 의 편집 수락이 "String not found in file" 로 실패하던 문제 수정
- [VSCode] @-mention 이 공백이 포함된 경로의 파일을 누락시키던 문제 수정
- [VSCode] 워크스페이스 폴더가 원격 호스트에만 존재할 때 Remote-SSH 로 연결된 창에서 세션 목록 뷰가 로드되지 않던 문제 수정
- [VSCode] 크거나 심볼릭 링크가 많은 워크스페이스에서 파일을 볼 때 ripgrep 프로세스가 폭주하던 문제 수정
- [Claude Code on the web] GitHub Enterprise Server 세션에서 토큰이 만료되면 GitHub 계정이 연결 해제된 것으로 표시되던 문제 수정: PR·issue 작업이 이제 자동으로 토큰을 갱신한다
- [Claude Code on the web] Claude GitHub App 이 없는 조직에서 `gh` 와 GitHub API 호출이 실패하던 문제 수정: 이제 연결된 GitHub 계정을 사용하고, 연결된 계정이 없으면 그렇다고 알려준다
- [Claude Tag] Claude Tag 관리자 설정의 프리셋 연결 폼에 "Use a custom connector" 링크 추가 — 처음부터 다시 시작하지 않고 커스텀 연결로 전환할 수 있다
- [Claude Tag] 조직의 사용 크레딧이 소진되었을 때 Claude 가 "The API rejected the request as invalid" 라고 답하던 문제 수정: 이제 크레딧 소진임을 알리고 충전 방법을 설명한다
- [Claude Tag] Claude 가 채널 최상위에 올린 메시지를 스레드에서 수정·삭제해 달라는 요청이, 그 메시지를 올린 세션에 도달하지 않고 정정 응답으로 처리되던 문제 수정
- [Claude Tag] Admin settings > Review requests 의 Tool access 요청에서 **Connect** 가 "Authorization failed" 로 실패하거나 요청된 access bundle 이 삭제된 것으로 표시되던 문제 수정

---

## 🎯 챌린지

이번 버전에서 내 환경에 적용해볼 만한 항목입니다.

### 1. `maxEffortLevel` 로 subagent 폭주 방지선 긋기
- **파일**: `~/.claude/settings.json`
- **근거**: 현재 `effortLevel: "xhigh"` 를 전역으로 쓰고 있다. CLAUDE.md §5 는 모든 subagent 를 Opus 로 지정하는데, 여기에 xhigh 가 곱해지면 대형 fan-out 에서 토큰이 급증한다. `maxEffortLevel` 은 상한만 걸고 낮은 값 선택은 그대로 허용하므로, 치명 등급 작업은 xhigh 를 쓰되 상한을 명시해 사고성 초과를 막을 수 있다. `modelSettings` 아래 모델별로도 걸 수 있어 Opus 만 상한을 다르게 두는 것도 가능하다.
- **난이도**: ★☆☆ (약 7분)

### 2. 스킬·subagent 의 `effort:` frontmatter 재확인
- **파일**: `~/.claude/skills/*/SKILL.md`, `~/.claude/agents/*.md`
- **근거**: 이번 버전에서 Opus 4.7·4.8·Fable 5 처럼 기본 effort 가 고정된 모델에서 `effort:` frontmatter 가 무시되던 버그가 고쳐졌다. 지금까지 무시되던 값이 이제 실제로 먹는다는 뜻이다. `claude-changelog-sync`·`eos-store-round` 등 자체 스킬에 `effort:` 가 박혀 있다면 의도한 값인지 지금 확인해야 한다. 안 그러면 버그 수정이 곧 동작 변경으로 나타난다.
- **난이도**: ★☆☆ (약 10분)

### 3. MCP 서버 정리로 prompt-cache 재사용 되찾기
- **파일**: `~/.claude/settings.json` (또는 `claude mcp` 로 관리 중인 MCP 설정)
- **근거**: 이번 세션만 봐도 `lazyweb` 은 429 로 실패하고 `figma`·`mobbin` 은 지연 연결 중이며 claude.ai 커넥터 14개가 미인증 상태다. 이번 버전이 "커넥터 재연결 시점 차이로 도구 목록이 다시 쓰이는" 캐시 깨짐을 여럿 고쳤지만, 애초에 쓰지 않는 커넥터를 끄는 것이 근본 해결이다. 안 쓰는 서버를 비활성화하면 세션 시작·재개 때 도구 블록이 흔들릴 여지 자체가 사라진다.
- **난이도**: ★★☆ (약 15분)

### 4. `--system-prompt-snapshot off` 로 스킬 프롬프트 반복 수정하기
- **파일**: `~/.claude/skills/claude-changelog-sync/SKILL.md` (및 해당 스킬이 호출하는 `claude -p` 명령)
- **근거**: `claude-changelog-sync` 는 `claude -p --model opus` 로 문서를 생성한다. 프롬프트 문구를 고쳐가며 결과를 비교할 때, 기존에는 대화에 기록된 system prompt 가 재사용돼 수정이 즉시 반영되지 않았다. 스킬을 다듬는 동안만 이 플래그를 붙이면 매 요청이 새 프롬프트로 나간다. 튜닝이 끝나면 캐시 이득을 위해 다시 뗀다.
- **난이도**: ★★☆ (약 15분)
