# Claude Code v2.1.314

> 작성일: 2026-11-02

---

# 📋 요약본

## 🎉 신기능 (6건)
- **`permissions.blockWritesOutsideWorkingDirectories`** — 켜면 Write, Edit, NotebookEdit가 작업 디렉토리 밖 경로에는 쓰지 않는다. 모든 permission 모드에 적용된다.
- **Claude apps gateway upstream `groups`** — 목록에 넣은 IdP 그룹의 개발자만 해당 upstream으로 보낸다. failover 때도 같은 규칙을 따른다.
- **Bedrock upstream `guardrail_trace`** — 요청에 걸린 Amazon Bedrock guardrail 필터를 로그에 남긴다. 걸린 원문 텍스트는 남기지 않는다.
- **VS Code·Claude Desktop Code 탭 idle compaction** — 20만 토큰이 넘는 대화를 오래 두면 미리 요약해 둔다. 다음 메시지를 보낼 때 prompt cache가 만료됐으면 이 요약을 쓴다.
- **[Cloud sessions] Include completed 버튼** — 숨겨진 작업이 끝난 일회성 작업뿐일 때 Scheduled tasks 페이지에 버튼이 나온다. Sort 메뉴를 열지 않고 바로 볼 수 있다.
- **[Claude Tag] API 문서 링크** — Slack을 연결한 Enterprise 조직의 관리자 설정에서 Bundles·Channels 탭에 닫을 수 있는 문서 링크가 붙는다.

## 🛠️ 개선/수정 (20건)
- **effort 상한 대응** — 관리자가 모델의 effort를 제한했을 때 "Invalid effort level"로 매 턴 실패하던 문제를 고쳤다. 이제 effort를 낮춰 다시 시도하고, 어느 레벨을 쓰는지 알려준다.
- **`claude -p` 시작 실패 처리** — 시작에 실패하면 exit 0과 빈 출력으로 끝나던 문제를 고쳤다. 이제 에러를 출력하고 exit 1로 끝난다.
- **Bedrock 이미지 과다 세션** — 오래된 이미지를 빼고 compact한다. 더 이상 "400 Input is too long."으로 매 턴 실패하지 않는다.
- **Monitor 셸 명령에 Bash hook 적용** — Bash matcher hook이 Monitor 도구가 띄운 셸 명령에도 실행된다. 이런 hook은 차단하거나 확인을 요청할 수 있지만, 승인하거나 명령을 고쳐 쓸 수는 없다.
- **hook `if` 조건의 Monitor 매칭** — `Monitor(tail *)`가 Bash의 `Bash(tail *)`와 같은 방식으로 셸 명령에 매칭된다.
- **PreCompact hook 출력 제한** — hook마다 출력을 10,000자에서 자른다. 출력이 커서 compaction이 실패하거나 반복되던 문제를 막는다.
- **git index.lock 충돌** — 백그라운드 diff 갱신이 index lock을 잠깐 잡는 바람에 동시에 실행한 git 명령이 실패하던 문제를 고쳤다.
- **`.trash` 무한 증가** — `~/.claude/skills/.trash`와 `~/.claude/plugins/.trash`를 약 1024개 항목으로 제한한다. `cleanupPeriodDays` 값과 상관없다. 삭제한 스킬마다 file watcher 부하가 늘던 문제도 고쳤다.
- **`--setting-sources` 제외 누수** — 제외한 settings 파일이 auto mode 규칙이나 저장된 permission 동의를 계속 제공하던 문제를 고쳤다.
- **worktree sandbox** — `claude -p --resume`·`--continue`로 들어간 worktree에도 sandbox 보호가 적용된다.
- **auto mode 차단 표시** — 안전 검사가 판정을 내지 않은 호출을 차단으로 표시하던 문제를 고쳤다. 차단 메시지는 명령 이름, 재시도 가능 여부, `/permissions` 안내를 보여준다.
- **gateway 호환성** — gateway가 거부한 beta header나 tool search `tool_reference`는 빼고 다시 보낸다. 점이 들어간 모델 ID(`claude-opus-4.8`)도 올바르게 인식한다.
- **TLS 교차 서명 루트 인증서** — 교차 서명된 갱신 루트 인증서 때문에 `UNABLE_TO_GET_ISSUER_CERT`가 나던 문제를 고쳤다.
- **MCP 인증** — 로그인 없이도 쓸 수 있는 서버는 저장된 로그인이 깨져도 로그아웃 상태로 쓴다. `claude mcp logout`이 실제로 지우지 못했는데 성공으로 보고하던 문제도 고쳤다.
- **Continue automatically 횟수** — 사용량 한도에서 자동 계속이 사용자 확인 없이 3회를 넘던 문제를 고쳤다.
- **subagent 메모리** — headless·SDK 턴에서 부모 세션이 subagent의 tool 결과를 턴이 끝날 때까지 들고 있지 않는다.
- **Ctrl+R 검색** — 접힌 `[Pasted text]` 내용도 검색된다.
- **macOS `git grep` 로케일** — C locale로 실행한다. UTF-8이 아닌 파일에서 생기던 regex 메모리 누수를 피한다.
- **Bash 셸 `which` 정리** — 상속된 `which` alias와 함수를 제거해 시스템 `which`를 쓴다.
- **vim 모드·UI 다수 수정** — `dw`/`yw`/`aw`/`iw`/`p` 동작, markdown 표 렌더링, 붙여넣기 유실, `/resume` 제목 오표시 등을 고쳤다.

## 🔑 이번 버전의 핵심 키워드
**"쓰기 범위를 잠그고, hook이 빈틈없이 걸리게 한다"** — 작업 디렉토리 밖 쓰기 차단과 Monitor 셸 명령의 hook 적용으로 안전장치를 넓혔다. 동시에 gateway와 클라우드 공급자 호환성 실패를 대거 고친 버전이다.

---

# 📜 원문 (한글 번역본)

> 원문 ChangeLog를 원래 순서 그대로 한 줄도 빠짐없이 번역한 문서입니다.

- `permissions.blockWritesOutsideWorkingDirectories` 추가: 모든 permission 모드에서 Write, Edit, NotebookEdit가 작업 디렉토리 밖 경로를 거부한다
- Claude apps gateway upstream에 선택 항목 `groups` 목록 추가: 목록의 IdP 그룹에 속한 개발자만 해당 upstream으로 보낸다. failover 때도 같다
- Claude apps gateway Bedrock upstream에 `guardrail_trace` 추가: 요청에 걸린 Amazon Bedrock guardrail 필터를 로그에 남긴다. 걸린 텍스트는 남기지 않는다
- VS Code와 Claude Desktop Code 탭에 idle compaction 추가: 200K 토큰 이상 대화를 방치하면 요약해 두고, 다음 메시지 때 prompt cache가 만료됐으면 그 요약을 쓴다
- 조직 관리자가 모델 effort에 상한을 두었을 때 세션이 "Invalid effort level"로 매 턴 실패하던 문제 수정: effort를 낮춰 재시도하고 사용하는 레벨을 알려준다
- 시작 실패 시 `claude -p`가 출력 없이 exit 0으로 끝나던 문제 수정: 에러를 출력하고 exit 1로 끝난다
- 이미지가 많은 Bedrock 세션이 매 턴과 `/compact`에서 "400 Input is too long."으로 실패하던 문제 수정: 오래된 이미지를 제거하고 compact한다
- Microsoft Foundry 리소스에 기본 Sonnet, Opus, Haiku 배포가 없을 때 세션이 실패하던 문제 수정: 같은 계열의 이전 모델로 fallback한다
- tool search의 `tool_reference` 블록을 받지 않는 gateway 뒤에서 요청이 반복 거부되던 문제 수정: tool search 없이 한 번 다시 보내고 세션이 이를 기억한다
- 시스템 인증서 저장소에 이전 루트와 교차 서명된 갱신 루트 인증서가 있을 때 TLS 연결이 `UNABLE_TO_GET_ISSUER_CERT`로 실패하던 문제 수정
- 로그인 없이도 동작하는 MCP 서버가 저장된 로그인이 깨진 뒤 "needs authentication"으로 표시되던 문제 수정: 로그아웃 상태로 사용한다
- MCP 로그인이 제거되지 않았는데 `claude mcp logout`이 성공을 보고하던 문제 수정 (예: SSH 접속 중 macOS keychain이 잠긴 경우)
- 여러 세션이 Anthropic 프로필 로그인을 공유하고 credentials lock이 바쁠 때 로그인 갱신이 중복되던 문제 수정
- 터미널이 있는 CI job에서 `claude ultrareview`와 `claude remote-control`이 workspace trust 질문을 하던 문제 수정: `CI`가 설정돼 있으면 신뢰하지 않은 폴더를 즉시 거부한다
- managed settings의 관리자 TLS trust 설정이 Claude Desktop 세션에 적용되지 않던 문제 수정
- managed plugin settings가 있는 머신에서 사용자의 `--plugin-dir`·`--plugin-url` plugin 중 하나가 manifest 오류나 다운로드 실패일 때 모델 전환이 거부되던 문제 수정
- managed settings가 모델을 고정했는데 Bedrock·Vertex 모델 업그레이드 제안이 매번 시작 때 다시 나오던 문제 수정
- 원격 managed settings에만 설정한 `forceRemoteSettingsRefresh`가 저장 사본 만료 후 적용되지 않아, 서버에 닿지 못하면 정책 없이 세션이 시작되던 문제 수정
- 대기 사이에 작업이 스스로 재시작될 때(/goal 체크인, 백그라운드·예약 작업) "Continue automatically at usage limit"이 사용자 확인 없이 3회 넘게 계속되던 문제 수정
- Ultracode로 시작한 백그라운드·클라우드 세션이 꺼진 뒤 다음 시작 때 다시 켜지던 문제 수정
- 파싱할 수 없는 tool call을 Claude가 포기한 뒤 마지막 깨진 응답과 재시도 프롬프트가 대화에 남던 문제 수정
- 출력이 매우 큰 PreCompact hook 때문에 compaction이 실패하거나 반복되던 문제 수정: hook별 출력을 10,000자에서 자른다
- 백그라운드 diff 갱신이 저장소 index lock을 잠깐 잡아, 같은 순간 실행한 git 명령이 "Unable to create '.git/index.lock': File exists"로 실패할 수 있던 문제 수정
- 스트리밍 중 반쯤 입력된 행 때문에 markdown 표가 grid와 stacked 레이아웃 사이를 오가고, 긴 표가 raw pipe로 떨어지던 문제 수정
- slash command만 실행한 세션의 제목으로 /resume 선택기가 CLAUDE.md나 CLAUDE.local.md 내용을 보여주던 문제 수정
- subagent transcript를 연 상태에서 `/btw`가 메인 대화 기준으로 답하던 문제 수정
- SSH로 Linux 머신에 이미지를 붙여넣으면 아무 반응 없던 문제 수정: 파일을 복사한 뒤 경로를 붙여넣으라고 안내한다
- 세션 서비스가 잠시 느릴 때 `claude remote-control` 세션 시작이 실패하던 문제 수정: worker 등록을 대기 시간을 늘려가며 재시도한다
- Remote Control에서 8초 넘게 걸리는 모델 전환이 최종 결과 대신 "still pending" 에러를 받던 문제 수정
- `sandbox.excludedCommands` 설정 설명이 목록의 명령은 항상 sandbox 밖에서 실행된다고 적던 문제 수정: 호출 안의 모든 명령이 항목과 일치해야 한다고 적는다
- auto mode, deny 규칙, PreToolUse hook이 막았거나 실행되지 않은 셸·MCP 호출이 접힌 tool 그룹에서 실행된 것처럼 보이던 문제 수정
- `claude -p --resume`·`--continue`로 들어간 worktree에 sandbox 보호가 적용되지 않던 문제 수정
- Bash에 매칭되는 hook이 Monitor 도구가 시작한 셸 명령에서 실행되지 않던 문제 수정: 이런 hook은 차단하거나 확인을 요청할 수 있지만 승인하거나 명령을 고쳐 쓸 수는 없다
- `--setting-sources`로 제외한 settings 파일이 auto mode 규칙, 저장된 permission 동의 등 일부 설정을 계속 제공하던 문제 수정
- 안전 검사가 판정을 내지 않았는데 auto mode가 호출을 차단으로 보고하고 `/permissions`에 올리던 문제 수정
- Google token endpoint가 연결만 받고 응답하지 않을 때 Claude apps gateway Vertex upstream이 몇 분간 멈추던 문제 수정
- 아직 작성된 그대로 제공 중인 deprecated Claude Desktop 키에 대해 Claude apps gateway 시작 경고가 종료일 이후에도 "stops being accepted"라고 표시하던 문제 수정
- App Store나 Google Play로 결제한 플랜에서 `/upgrade`가 브라우저를 열고 새 로그인을 시작하던 문제 수정: 플랜을 바꿀 곳을 안내한다
- `--resume`이나 거부 후 다른 모델로 전환한 지점 이전으로 rewind할 때, Claude Code가 모르는 모델 이름의 세션이 다른 모델로 바뀌던 문제 수정
- gateway나 클라우드 공급자가 Claude Code의 beta header 중 하나를 이름으로 거부할 때 요청이 실패하던 문제 수정: 해당 header 없이 다시 보낸다
- LLM gateway 뒤에서 `claude-opus-4.8`처럼 점이 들어간 모델 ID가 이전 모델로 취급돼 context window, 출력 한도, effort, thinking mode, 비용이 잘못 잡히던 문제 수정
- /compact 이후 Remote Control 클라이언트에 불필요한 "Compacted (ctrl+o to see full summary)" 행이 나오던 문제 수정
- 조직 정책이 기능을 껐는데 클라우드 세션 팁과 Remote Control idle 알림이 표시되던 문제 수정
- 이전 worker가 새 채팅의 파일을 받은 직후 멈췄을 때, 재개한 claude.ai 클라우드 세션이 요청하지 않은 모델 호출을 하던 문제 수정
- Cowork 클라우드 세션의 WebFetch가 PDF 텍스트 100,000자 이후를 조용히 버리던 문제 수정: 읽지 못한 양과 이어 읽을 위치를 알려준다
- 클라우드 세션이나 IDE에서 Esc·Stop으로 명령을 멈췄을 때 Claude가 거절됐다는 사실만 듣던 문제 수정: 명령이 실행됐을 수 있다는 사실도 전달한다
- 코드 블록이 인용문을 열 때 코드 블록 맨 위 빈 줄이 사라지던 문제 수정
- transcript 보기(Ctrl+O)에서 일부 `⎿` 행 위에 빈 줄이 생기던 문제 수정
- vim 모드 `dw`, `dW`, `yw`, `yW`가 줄 끝을 넘어 계속되던 문제 수정, `w`와 `W`가 빈 줄에서 멈추게 변경
- 다른 agent가 시작하거나 끝날 때 agent 패널의 x와 Enter가 엉뚱한 agent에 동작하던 문제 수정
- Claude 질문 대화상자에서 "Other" 행에 포커스가 없으면 붙여넣은 텍스트와 드래그한 파일이 사라지던 문제 수정
- 프롬프트 footer의 행이 선택된 상태에서 붙여넣은 텍스트가 사라지던 문제 수정
- vim 모드에서 문자 선택 위 `p`가 yank한 텍스트가 줄 단위인지 무시하던 문제 수정
- vim 모드 `aw`와 `iw`가 줄 끝 줄바꿈까지 포함하던 문제 수정
- ↓ 키가 ? 도움말 메뉴, 명령 목록, 붙여넣기 힌트에 가려진 footer 항목을 선택하던 문제 수정
- `/btw` 같은 명령 패널에서 Esc를 누르면 transcript가 열린 subagent까지 중단되던 문제 수정
- fullscreen 모드에서 다른 모델로 실행 중인 subagent나 teammate를 볼 때 환영 헤더가 세션 모델을 보여주던 문제 수정
- 위로 스크롤한 상태에서 rewind 메뉴의 "Restore conversation" 후 fullscreen transcript가 대화 중간에 머물던 문제 수정
- 삭제한 세션이 거의 빈 항목으로 resume 목록에 다시 나타나던 드문 문제 수정
- `<bash-stdout>`, `<local-command-stdout>` 같은 태그가 든 프롬프트를 로컬 stream-json host에 수신 확인하지 않던 문제 수정
- 첫 프롬프트가 실패(예: 사용량 한도)한 뒤 대화가 이어져도 세션이 제목 없이 남던 문제 수정
- skill file watcher가 `~/.claude/skills/.trash`에 보관된 삭제 스킬을 모두 검사해 삭제할수록 파일 시스템 부하가 늘던 문제 수정
- Claude가 permission이나 plan 결정을 물을 때 /rename으로 붙인 세션 이름이 사라지던 문제 수정. 나란히 둔 세션을 계속 구분할 수 있다
- 시작에 실패한 백그라운드 세션을, 바이너리가 디스크에 있는데도 daemon 바이너리 삭제로 보고하던 문제 수정
- `/config`의 push 설정이 숨겨졌거나 조직이 Remote Control을 껐는데 push 알림 팁과 idle 리마인더가 나오던 문제 수정
- `~/.claude/skills/.trash`와 `~/.claude/plugins/.trash`가 무한히 커지던 문제 수정: `cleanupPeriodDays`와 상관없이 각각 약 1024개 항목만 보관한다
- git 줄바꿈 변환을 받는 CRLF 파일을 변경 없이 다시 저장하거나 한 줄만 고쳤을 때 Bash edit diff가 파일 전체를 변경으로 표시하던 문제 수정
- Self-hosted runner: runner의 일시정지 요청이 Anthropic 응답 전에 연결이 끊기면 idle 세션이 일시정지 대신 다른 runner로 옮겨가던 문제 수정
- 많은 subagent를 실행하는 긴 headless·SDK 턴의 메모리 사용 개선: 부모 세션이 턴이 끝날 때까지 subagent의 tool 결과를 들고 있지 않는다
- 프롬프트 기록 개선: Ctrl+R이 접힌 `[Pasted text]` 안의 텍스트도 찾는다
- `/design-sync` 업로드 프롬프트 개선: 업로드하거나 삭제할 폴더, 프로젝트, 파일을 보여준다
- `/permissions` 검토 탭 개선, 이름을 Recently blocked로 변경: 표시한 행에 Esc가 무엇을 하는지 footer에 적는다
- auto mode 차단 호출 메시지 개선: 명령 이름을 적고, Claude가 재시도할 수 있고 auto mode가 다시 검사한다고 알리며, 검토할 곳으로 `/permissions`를 안내한다
- permission 프롬프트 개선: 긴 사유가 차지하는 행을 줄여 승인할 명령이 화면 밖으로 밀리는 터미널을 줄였다
- claude.ai 로그인으로 거부된 요청을 재시도하는 동안 보이는 클라우드 세션 에러 개선: `claude auth login`도 제안한다
- MDM과 원격 설정의 base URL이나 `apiKeyHelper`가 다를 때 저장된 claude.ai, Team, Enterprise 로그인 동작 개선
- agent view의 `/config` 개선: agent view가 기본으로 열리지 않게 하는 방법을 알려준다
- 세션 자동 제목 개선: 스킬이나 `/security-review` 같은 프롬프트 기반 명령으로 시작한 세션이 제목 없이 남지 않고 그 명령에서 제목을 얻는다
- 손상된 transcript에서 `--resume` 속도와 메모리 사용 개선
- MCP tool이 1만 개 이상인 세션에서 `/context` 속도 개선
- Self-hosted runner: 세션 브랜치가 git remote에 없을 때 에러 개선: 한 번도 push하지 않은 브랜치도 다루고, 경우별 해결법을 알려주며, 재시도를 더 이상 권하지 않는다
- `/claude-api` 스킬 업데이트: API tracing용 Datadog 설정이 Console처럼 `dd-llmobs-enabled: true` header를 보내고, `ant` 설치 안내에서 오래된 macOS `xattr` 단계를 뺐다
- 번들 dataviz 스킬 업데이트: y축 눈금 라벨은 10,000 미만이면 전체 숫자로, 가로 눈금은 들어가면 100만 미만까지 전체 숫자로 쓰라고 권한다
- 번들 dataviz 스킬 업데이트: donut·pie 차트 요청에 순위 막대나 값을 표시하는 분할 막대로 답한다
- 조직 서버 관리 설정의 로컬 사본을 편집하기 전에 Claude의 파일 도구가 묻도록 변경. 사용자 settings 파일과 같은 처리다
- `/ultrareview`가 `claude ultrareview`처럼 git 실행 전에 workspace trust를 확인하도록 변경
- Bash 도구 셸이 상속된 `which` alias나 함수를 지우고, export된 `which`/`unsetenv` 함수를 명령에 넘기지 않도록 변경. `which`는 시스템 명령이나 zsh builtin이 된다
- `/permissions` Recently blocked가 전체를 읽을 수 없는 호출의 승인을 거부하도록 변경. 터미널이 짧아 다 보이지 않는 경우도 포함한다
- Cowork 클라우드 세션의 auto mode 변경: hook이 MCP tool 호출을 허용해도 응답 없음으로 취급하고, classifier나 permission 프롬프트가 결정한다
- `Monitor(tail *)` 같은 hook `if` 조건이 `Bash(tail *)`가 Bash에 매칭되듯 Monitor 도구의 셸 명령에 매칭되도록 변경
- Managed Agents workflow run을 개선하려고 agent를 바꾸기 전에 `claude-api` 스킬이 해당 run의 workflow를 읽어도 되는지 묻도록 변경
- `ANTHROPIC_DEFAULT_OPUS_MODEL`, `availableModels`, `deniedModels` 때문에 이전 Opus 모델만 남거나 아무것도 남지 않을 때, 플래그된 요청이 거부로 끝나지 않고 다른 모델로 재시도하도록 변경
- idle compaction이 telemetry를 끈 구독자에게도, 그리고 1시간 prompt cache가 켜진 Bedrock, Vertex, Foundry, LLM gateway에서도 동작하도록 변경
- `FORCE_HYPERLINK=false`(`no`, `off` 포함)가 hyperlink를 켜지 않고 끄도록 변경
- macOS: Claude가 실행하는 대부분의 명령에서 `git grep`이 C locale을 쓰도록 변경. UTF-8이 아닌 파일에서 macOS regex 라이브러리에 보고된 메모리 누수를 피한다
- [VSCode] 저장된 로그인을 지우지 못했는데 MCP 서버의 "Clear authentication"이 성공을 보고하던 문제 수정
- [VSCode] 대기 중인 메시지의 hook이 실행되는 동안 spinner와 Stop 버튼이 없던 문제 수정
- [VSCode] 삭제처럼 저장할 수 없는 세션 그룹 변경이 조용히 실패하던 문제 수정: 에러 알림을 띄운다
- [VSCode] plan 미리보기 탭에서 Cmd+F / Ctrl+F가 찾기 위젯을 열지 않던 문제 수정
- [VSCode] 러시아어, 그리스어, 히브리어 같은 비라틴 키보드 배열에서 음성 받아쓰기 단축키(Ctrl+D)가 동작하지 않던 문제 수정
- [VSCode] 채팅 없이 확장이 열릴 때 놓친 일회성 저장 예약 작업이 묻지 않고 삭제되던 문제 수정
- [VSCode] `CLAUDE_CODE_DISABLE_CFC_PROMPT`가 Claude in Chrome 안내를 세션 메시지에 넣는 것도 막도록 변경. 브라우저 도구는 그대로 쓸 수 있다
- [Cloud sessions] 숨겨진 작업이 끝난 일회성 작업뿐일 때 Scheduled tasks 페이지에 Include completed 버튼 추가. Sort 메뉴를 열지 않고 볼 수 있다
- [Cloud sessions] 최근 사용한 self-hosted 환경이 새 세션 카드의 최근 환경 목록에 나오지 않던 문제 수정
- [Cloud sessions] 다른 worktree에서 push한 커밋으로 Claude가 브랜치를 옮긴 뒤 클라우드 세션이 매 턴 uncommitted changes를 보고하던 문제 수정
- [Cloud sessions] 아주 짧은 창이나 높은 확대 비율에서 관리자 설정의 self-hosted 환경 상세 대화상자가 내용을 화면 밖으로 밀어내던 문제 수정. 대화상자가 스크롤된다
- [Cloud sessions] 실행 중인 클라우드·Remote Control 세션이 전환을 거부했는데 permission 모드 선택기가 Auto에 머물던 문제 수정: 실제 사용 중인 모드를 보여주고 알려준다
- [Cloud sessions] 예약 작업 개선: Anthropic 클라우드에서 실행할 때 claude.ai 계정에 켜진 plugin을 불러온다
- [Cloud sessions] 관리자 설정의 GitHub Enterprise Test connection 개선: 클라우드 세션과 같은 방식으로도 연결해 보고, 두 번째 테스트가 실패하면 경고한다
- [Cloud sessions] 클라우드 세션 transcript 개선: 이름 변경 행에 새 제목을 적고, 저장소·환경 목록을 JSON 한 줄 대신 표로 보여준다
- [Cloud sessions] 웹, 데스크톱, 모바일 앱에서 시작한 클라우드 세션이 setup script가 에러로 끝나도 시작되도록 변경. 더 이상 시작에 실패하지 않는다
- [Remote Control] Remote Control 세션의 permission 모드 버튼이 입력하기 전까지 잘못된 모드를 보여주던 문제 수정: 컴퓨터가 온라인이면 열 때 실제 모드를 보여준다
- [Claude Tag] Slack을 연결한 Enterprise 조직의 관리자 설정 Bundles·Channels 탭에 닫을 수 있는 Claude Tag API 문서 링크 추가
- [Claude Tag] Enterprise Grid 워크스페이스 간 공유 채널에서 `@Claude !restart`가 워크스페이스 확인 한 번 실패로 포기하던 문제 수정: 재시도한 뒤 다시 실행해 달라고 요청한다
- [Claude Tag] 같은 링크로 몇 분 안에 Slack에서 Claude 계정을 두 번 연결하면 확인 DM과 채널 알림이 두 번 오던 문제 수정
- [Claude Tag] Claude 세션이 self-hosted runner를 기다리는 동안 Slack 후속 메시지에 진행 표시가 없던 문제 수정: 스레드에 대기 알림을 올린다
- [Claude Tag] 양쪽 조직이 모두 Claude를 설치한 Slack Connect 채널에서 Claude가 자기 스레드의 태그에 가끔 답하지 않던 문제 수정
- [Claude Tag] Claude Tag 관리자 설정의 plugin·skill 페이지에서 불러오기 실패 후 Retry가 저장하지 않은 접근 권한 변경을 버리던 문제 수정: 편집 내용이 유지된다
- [Claude Tag] Claude Tag 관리자 설정의 저장소 컨트롤에 같은 동작이 두 번 나오던 문제 수정: 메뉴에는 버튼이 하지 않는 동작만 나온다

---

## 🎯 챌린지

이번 버전에서 내 환경에 적용해볼 만한 항목입니다.

### 1. deploy-guard hook이 Monitor 명령도 막는지 점검
- **파일**: `~/.claude/hooks/deploy-guard.sh`
- **근거**: 이번 버전부터 Bash matcher hook이 Monitor 도구가 띄운 셸 명령에도 실행된다. 스크립트가 `tool_name == "Bash"`로 걸러내면 Monitor로 실행한 `git push origin feat/*`는 그대로 통과한다. 스크립트가 도구 이름이 아니라 `tool_input.command`를 기준으로 판단하는지 확인하고, 필요하면 고친다. 그러면 feature 브랜치 push 금지 규칙에 빈틈이 생기지 않는다.
- **난이도**: ★☆☆ (약 10분)

### 2. 체인지로그 동기화 cron에 `claude -p` 실패 감지 추가
- **파일**: `~/.claude/skills/claude-changelog-sync/` 안의 동기화 스크립트
- **근거**: 이전에는 `claude -p`가 시작에 실패해도 빈 출력과 exit 0으로 끝났다. 매일 08:00 cron이 빈 MD 파일을 만들 수 있었다. 이제 exit 1과 에러 메시지를 주므로, 종료 코드가 0이 아니거나 출력이 비었으면 파일을 쓰지 않는다. 대신 에러를 로그에 남기는 분기를 넣는다.
- **난이도**: ★★☆ (약 15분)

### 3. 프로젝트 단위로 작업 디렉토리 밖 쓰기 차단
- **파일**: `{EOS-H5 루트}/.claude/settings.json`
- **근거**: 새 설정 `permissions.blockWritesOutsideWorkingDirectories: true`를 넣으면 Write·Edit가 그 프로젝트 밖 경로를 수정하지 못한다. CLAUDE.md §10의 "남의 폴더에서 원격으로 만지지 않는다" 규칙을 도구 수준에서 강제한다.
  - 전역 `~/.claude/settings.json`에는 넣지 않는다. 메모리 디렉토리(`~/.claude/projects/...`)와 `~/claude-ver-doc/` 쓰기까지 막힐 수 있다. 실제 차단 범위는 적용한 뒤 직접 확인해야 한다.
- **난이도**: ★☆☆ (약 10분)
