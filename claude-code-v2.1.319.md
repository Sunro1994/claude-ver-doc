# Claude Code v2.1.319

> 작성일: 2026-11-08

---

# 📋 요약본

## 🎉 신기능 (11건)
- **터미널에서 MCP task 지원** — MCP 서버가 도구 호출을 task로 실행하면 Claude Code가 이를 즉시 백그라운드로 보낸다. 끝나면 결과를 Claude에게 알린다.
  - 즉시 백그라운드로 보내지 않고 기다리게 하려면 `CLAUDE_CODE_DISABLE_MCP_TASK_BACKGROUND`를 쓴다.
  - feature flag를 받지 않는 환경(Bedrock, Vertex, Foundry, LLM gateway, `DISABLE_TELEMETRY`)에서도 동작한다. 끄려면 `CLAUDE_CODE_DISABLE_MCP_TASKS=1`을 쓴다.
- **`permissions.denyInsteadOfPrompting` 설정** — 권한 확인 창을 기다려야 하는 도구 호출을 거부하고 turn을 계속 진행한다. 터미널 세션, subagent, teammate에 적용된다.
- **`/claude-api latency-optimize`** — Claude API 코드에서 사용자를 기다리게 하는 지점을 찾는다. 더 빠른 설정을 eval 기준으로 시험한다.
- **`CLAUDE_CODE_DISABLE_FEATURE_FLAGS` 환경변수** — telemetry는 그대로 두고 feature flag 가져오기만 멈춘다. 모든 flag가 내장 기본값으로 동작한다.
- **`/tasks`에 "Earlier in this session" 행 추가** — 끝난 subagent 목록을 보여준다. 목록에서 사라졌거나 재시작한 뒤에도 다시 열어 메시지를 보낼 수 있다.
- **`ant auth login` 과금 경고** — claude.ai 로그인이 끝나 `ant auth login` 로그인으로 넘어가면 경고를 띄운다. 시작할 때 과금되는 Claude Console 조직 이름도 보여준다.
- **Claude apps gateway 지출·예산 기능** — 지출 한도가 없는 개발자의 `/usage`에 오늘·이번 주·이번 달 지출을 표시한다. `admin.pooled_conflict_rule`·`admin.pooled_priority_order`로 여러 그룹에 속한 개발자의 지출을 어느 공동 예산에서 먼저 뺄지 정한다.
- **Claude apps gateway 운영 기능** — `login_notice`로 로그인 화면에 운영자 메시지를 띄운다. `CLAUDE_GATEWAY_LOG_FORMAT=json`을 켜면 운영 로그를 JSON으로 출력한다.
- **Claude apps gateway 시작 경고 강화** — 다음 경우에 시작할 때 경고한다.
  - `availableModels`가 서로 겹치는 경우
  - `desktopHome`이 없는 정책
  - AWS GovCloud와 다른 upstream을 섞은 경우
  - base URL 변수가 설정된 경우
  - Bedrock guardrail이 누락된 경우
- **`/loop` 클라우드 안내** — 클라우드 세션에서 `/loop`를 확인할 때 "컨테이너가 멈추면 타이머도 멈춘다"는 안내를 붙인다. 컨테이너가 멈춰도 이어지는 loop도 제안한다.
- **Claude Tag 모델 관리 행** — Enterprise 조직의 Models 관리 페이지에 Claude Tag 행을 추가한다. 이 행은 모델 기본값을 관리하는 곳으로 연결된다.

## 🛠️ 개선/수정 (16건)
- **auto mode 서버 검사 정책 변경** — telemetry나 feature flag가 꺼져 있으면 서버가 검사하지 못한 호출을 묻거나 거부한다. 내장 분류기로 대신 판단하지 않는다. 예전처럼 쓰려면 `CLAUDE_CODE_AUTO_MODE_SERVER=0`을 설정한다.
- **`claude -p` 종료 코드 수정** — auto mode에서 안전 검사를 쓸 수 없어 작업이 거부되면 text·JSON 출력 모두 exit 1로 끝난다. 이전에는 0을 반환했다.
- **Bash 권한 우회 차단** — 다음 우회 경로를 막았다.
  - 따옴표로 감싼 단어가 들어간 명령을 deny·ask 규칙이 놓치던 문제
  - 조작한 환경변수 접두어로 명령 일부를 숨기는 문제
  - `sed`로 권한 검사를 건너뛰는 문제
  - worktree 생성 시 sandbox를 벗어나는 문제
- **broader deny 규칙 우선** — 세션의 정확한 Bash·PowerShell ask 규칙이 있어도 더 넓은 deny 규칙이 그 명령을 덮으면 묻지 않고 거부한다.
- **`which` 권한 확인** — 조회·표시용이 아닌 flag를 붙인 `which`는 실행 전에 권한을 묻는다.
- **`timeout DURATION` 불필요한 확인 제거** — `timeout 30 rg foo`처럼 읽기 전용 명령을 `timeout`으로 감싸도 더는 권한을 묻지 않는다.
- **self-paced `/loop` 종료 방식 변경** — 다시 예약하지 않고 turn이 끝나면 loop도 끝난다. 예전처럼 대비용 wakeup을 남기려면 `CLAUDE_CODE_LOOP_KEEPALIVE=1`을 설정한다.
- **PostToolUse hook 실행 보장** — 새 메시지가 turn을 끊은 뒤에 끝난 도구 호출에서도 PostToolUse hook이 최대 10초 동안 실행된다.
- **설정 파일 저장 안정성** — 다음 문제를 고쳤다.
  - Claude Code가 설정 파일을 쓴 직후 몇 초 안에 한 수정이 무시되던 문제
  - 디스크가 가득 찼을 때 `~/.claude.json`이 비거나 잘리던 문제
  - 예전 이름의 설정 파일이 남아 있으면 경고 없이 설정이 가려지던 문제
- **`/clear` 시 백그라운드 작업 보호** — `/clear`가 계속 실행 중인 백그라운드 agent·teammate·workflow의 명령을 죽이지 않는다.
- **`/context` 토큰 절약** — 이후 매 turn마다 시각 그리드 전체를 보내지 않고 표만 보낸다. 표는 목록별로 큰 순서 10행까지만 남긴다.
- **MCP 구버전 handshake 연결 수정** — 오래된 handshake를 쓰는 MCP 서버가 연결에 실패하거나 빈 결과를 돌려주던 문제를 고쳤다.
- **`/diff` 오류 수정** — 다음 두 경우에 `/diff`가 제대로 열리도록 고쳤다.
  - 저장소 최상위에 `HEAD`라는 파일이나 폴더가 있을 때
  - 파일을 수정한 turn이 64개 이상일 때
- **앞에 공백이 있는 slash command 수정** — 앞에 공백·탭·줄바꿈이 있으면 slash command가 실행되지 않고 일반 텍스트로 전송되던 문제를 고쳤다.
- **백그라운드 Bash 출력 누락 수정** — 거의 즉시 끝나는 백그라운드 Bash 명령의 출력이 사라지던 문제를 고쳤다. 명령이 끝나기 직전에 쓴 파일이 변경 diff에서 빠지던 문제도 고쳤다.
- **plugin 의존성 설치 수정** — `claude plugin update`·`/plugin` "Update now"·백그라운드 자동 업데이트가 새 버전에서 추가된 의존성을 설치하지 않던 문제를 고쳤다.

## 🔑 이번 버전의 핵심 키워드
**"권한 경계 강화와 MCP task의 백그라운드 처리"** — 권한 검사의 우회 경로를 막고 auto mode 정책을 명확히 했다. 오래 걸리는 MCP 작업은 백그라운드로 보낸다.

---

# 📜 원문 (한글 번역본)

> 원문 ChangeLog를 원래 순서 그대로 한 줄도 빠짐없이 번역한 문서입니다.

- telemetry나 feature flag가 꺼진 auto mode(LLM gateway 뒤 포함)를 변경: 서버가 검사할 수 없는 호출은 묻거나 거부하며 내장 분류기로 fallback하지 않음. 계속 쓰려면 `CLAUDE_CODE_AUTO_MODE_SERVER=0` 설정 (Bedrock, Vertex, Foundry는 변경 없음)
- LLM gateway 뒤의 auto mode 변경: `CLAUDE_CODE_DISABLE_EXPERIMENTAL_BETAS`가 설정돼 있어도 `CLAUDE_CODE_AUTO_MODE_SERVER=1`이면 서버 측 검사가 켜짐. managed settings에서 후자를 설정했다면 `1`도 함께 설정해야 함
- 터미널에서 MCP task 지원 추가: MCP 서버가 도구 호출을 task로 실행하면 Claude Code가 즉시 백그라운드로 옮기고, 끝나면 Claude에게 결과를 알림
- `CLAUDE_CODE_DISABLE_MCP_TASK_BACKGROUND` 환경변수 추가: MCP task를 즉시 백그라운드로 옮기지 않고 도구 호출 안에서 기다리게 함
- `permissions.denyInsteadOfPrompting` 설정 추가: 권한 확인 창을 기다려야 할 도구 호출을 거부하고 turn을 계속 진행. 터미널 세션, subagent, teammate에 적용
- `/claude-api latency-optimize` 추가: Claude API 코드에서 사용자를 기다리게 하는 지점을 찾고 eval 기준으로 더 빠른 설정을 시험
- `CLAUDE_CODE_DISABLE_FEATURE_FLAGS` 환경변수 추가: telemetry는 끄지 않고 feature flag 가져오기만 중단. 모든 flag가 내장 기본값을 사용
- 지출 한도가 없는 Claude apps gateway 사용 개발자의 `/usage`에 오늘·이번 주·이번 달 지출 추가 (gateway가 이 버전 이상일 때)
- Claude apps gateway에 `admin.pooled_conflict_rule`, `admin.pooled_priority_order` 추가: 여러 그룹에 속한 개발자의 지출을 어느 공동 그룹 예산이 먼저 부담할지 설정
- Claude apps gateway에 선택 설정 `login_notice` 추가: gateway 브라우저 인증 페이지와 Claude Code 로그인 화면에 운영자 지정 메시지 표시
- Claude apps gateway에 `CLAUDE_GATEWAY_LOG_FORMAT=json` 추가: 운영 로그 줄을 `severity`, `time`, `message`를 담은 JSON으로 출력. 필드에서 레벨을 읽는 로그 수집기용
- 한 정책이 이름으로 지정한 custom model id를 다른 정책의 `availableModels`도 허용하는 경우 Claude apps gateway 부팅 경고 추가
- `desktopHome` 없이 `coworkTabEnabled: false` 또는 `chatSessionRetentionDays`에 의존하는 정책에 대해 Claude apps gateway 시작 경고 추가 (Claude Desktop의 11월 10일 변경 대비)
- claude.ai 로그인이 끝나 Claude Code가 `ant auth login` 로그인으로 계속 진행할 때 경고 추가. 이 경우 사용량은 Claude Console 조직에 과금됨
- Claude Code가 `ant auth login` 로그인을 쓰는 경우 시작 시 과금되는 Claude Console 조직 이름을 보여주는 줄 추가
- `/tasks`에 끝난 subagent를 나열하는 "Earlier in this session" 행 추가. 목록에서 사라지거나 재시작한 후에도 다시 열어 메시지를 보낼 수 있음
- 클라우드 세션의 `/loop` 확인 메시지에 컨테이너가 멈추면 타이머도 멈춘다는 안내와 계속 유지되는 loop 제안 추가
- 오래된 handshake를 쓰는 MCP 서버가 연결에 실패하거나 빈 결과를 반환하던 문제 수정 (Claude Code가 새 서버에서만 쓰는 확장을 선언했기 때문)
- claude.ai connector의 오래 걸리는 MCP 도구 호출이 `--resume` 후 결과를 보고하지 않던 문제 수정
- Claude Code가 실행되는 폴더에 `HEAD`라는 파일·폴더가 있으면 claude.ai와 모바일 앱에서 세션 diff가 로드되지 않던 문제 수정
- git 저장소 최상위에 `HEAD`라는 파일·폴더가 있으면 `/diff`가 "Diff unavailable"을 보여주던 문제 수정
- 파일을 수정한 turn이 64개 이상인 세션에서 `/diff` 창이 빈 상태로 열리던 문제 수정
- 앞에 공백·탭·줄바꿈이 붙은 slash command가 실행되지 않고 일반 텍스트로 Claude에게 전송되던 문제 수정
- 계속 401로 실패하는 요청이 재시도마다 로그인을 갱신해 다른 세션에도 401을 일으키던 문제 수정
- `/context`가 이후 매 turn마다 시각 그리드 전체를 Claude에게 보내던 문제 수정. 이제 Claude는 표만 읽음
- auto mode에서 안전 검사를 쓸 수 없어 작업이 거부돼도 `claude -p`가 0으로 종료하던 문제 수정: text·JSON 출력은 이제 1로 종료
- Linux에서 네트워크 파일 시스템(NFS, SMB, Lustre 등)에 있는 프로젝트를 시작할 때 모든 프로젝트 파일을 나열하던 문제 수정
- 클라이언트가 모델 변경과 auto mode 요청을 연달아 보내면 auto mode가 잘못 거부되던 문제 수정
- 서버 측 검토가 세션에 도달하지 않는데도(예: 이를 버리는 LLM gateway 뒤) `/status`가 "Auto mode server: Enabled"로 표시되던 문제 수정
- 서버가 조직의 피드백을 거부한 후에도 Claude가 작성한 피드백, 설문, `/feedback`이 계속 나타나던 문제 수정
- 보낼 수 없는 제3자 gateway에서 Claude가 피드백을 작성하던 문제 수정
- 권한 규칙이나 `autoMode` 설정이 매우 클 때 auto mode가 이유 없이 작업을 거부하던 문제 수정: 이제 이유를 설명하고, `autoMode` deny 규칙이 없으면 터미널에서 물어봄
- 따옴표로 감싼 단어로 작성한 명령을 Bash deny·ask 규칙이 놓치던 문제 수정
- verbose 모드가 아닐 때 subagent 반환 보고서를 펼치면 내부 마커와 출처 메모가 보이던 문제 수정
- MCP 서버가 없을 때 프롬프트와 함께 실행한 `claude -p --resume`이 지연된 도구 호출을 잃던 문제 수정: 이제 1로 종료하고, 호출을 보존하며, 이후 입력을 거부
- SDK 클라이언트로 보내는 안내 메시지에서 텍스트가 빠지던 문제 수정
- 디스크가 가득 찼을 때 Agent SDK 호스트가 실패한 실행의 고유 오류 메시지 대신 일반적인 종료 코드 오류를 받던 문제 수정
- 세션이 다른 권한 모드로 재개될 때 `CLAUDE_CODE_RESUME_INTERRUPTED_TURN`이 plan mode에서 중단된 turn을 다시 실행하던 문제 수정
- Claude Code가 설정 파일을 쓴 직후 몇 초 안에 한 수정이 무시되던 문제 수정
- 예전 이름으로 남은 설정 파일이 경고 없이 설정을 가리던 문제 수정: home에 설정 파일이 두 개 있으면 stderr로 알리고 어떤 파일을 쓰는지 표시
- 읽기 전용 폴더에서 저장하거나 bind mount된 파일에 저장하는 중 디스크가 가득 차면 `~/.claude.json`, 설정, 수정한 파일이 비거나 잘리던 문제 수정 (한 번에 한 세션만 저장)
- 덮어쓸 파일을 읽지 못하면 Write가 거부로 turn을 끝내던 문제 수정
- 거의 즉시 끝나는 백그라운드 Bash 명령이 완료로 보고되면서 출력을 잃던 문제 수정
- 명령이 끝나기 직전에 쓴 파일이 Bash 도구의 변경 파일 diff에서 빠지던 문제 수정
- `opus-5-5` 같은 잘못된 모델 이름을 입력하면 의도한 모델을 제안하지 않고 Claude Code를 업데이트하라고 하던 문제 수정
- 권한 확인 창이 열린 동안 notebook이 바뀌면 `NotebookEdit`이 엉뚱한 셀을 수정하던 문제 수정
- `/login` 성공 화면에서 Enter를 누르면 약 0.5초 멈추던 문제 수정: 이제 대화상자가 즉시 닫히고 로그인 후 갱신은 백그라운드에서 실행
- screen reader 모드에서 질문에 "Other" 답을 입력하는 중 Ctrl+G로 외부 편집기가 열리지 않던 문제 수정
- `CLAUDE_CODE_PROXY_RESOLVES_HOSTS`가 설정되고 기기에 자체 DNS가 없을 때 proxy 뒤에서 Monitor의 WebSocket watch가 "could not resolve"로 실패하던 문제 수정
- 호출되면 안 되는 도구에 대해 `claude plugin eval` 경고가 결코 통과할 수 없는 `max: 0`을 제안하던 문제 수정
- 백그라운드 plugin 자동 업데이트가 업데이트된 plugin 버전에서 추가된 의존성을 설치하지 않던 문제 수정
- agents view에서 연 세션에서 tmux 위 Ghostty의 Cmd+클릭으로 링크가 열리지 않던 문제 수정
- `.claude/skills`의 mod hot reload가 생성 직후 삭제된 파일을 놓치고, 그 파일이 다시 생겨도 놓치던 문제 수정
- `/branch` 이전 checkpoint로 코드를 복원할 때 `/rewind`가 "No files were restored"로 실패하던 문제 수정
- `/claude-api` skill이 Console 웹 설정이 Managed Agents 세션에 적용되지 않는다고 잘못 안내하던 문제 수정, 자격 증명·권한 예시를 엄격하게 정리
- `timeout 30 rg foo`처럼 단순 `timeout DURATION`으로 감싼 읽기 전용 명령에 불필요한 권한 확인이 뜨던 문제 수정
- WebFetch가 claude.ai 공유 채팅 링크를 빈 페이지로 설명하던 문제 수정: 이제 공유 채팅은 읽을 수 없으니 대화를 붙여넣으라고 안내
- 데이터베이스가 없는 artifact에 Artifact 데이터베이스 호출이 다시 전송되던 문제 수정: 오류가 재게시로 해결되는지 알려줌
- 폴더(`out_dir`)에 저장하는 artifact 데이터베이스 읽기가 거부되던 문제 수정
- 상세 beta tracing이 클라이언트 인증서를 요구하는 수집기에 `CLAUDE_CODE_CLIENT_CERT`를 제출하지 않던 문제 수정
- OpenTelemetry `claude_code.session.count` 지표가 사용되지 않은 Agent SDK `prewarm()` 프로세스까지 세던 문제 수정: 미리 시작한 프로세스는 사용될 때 한 번만 셈
- `/clear`가 계속 실행 중인 백그라운드 agent·teammate·workflow의 실행 중 명령과, 백그라운드 agent·teammate의 foreground subagent를 죽이던 문제 수정
- Claude apps gateway 로그인이 만료된 터미널이 gateway가 거부하고 `invalid_token`으로 기록하는 telemetry·managed settings 요청을 보내던 문제 수정
- 권한 확인 대기 중인 백그라운드 세션에 agents view가 답장을 보낸 것처럼 보이던 문제 수정: 답장은 입력창에 남고 세션을 열어 답하라는 안내가 표시됨
- agent view 종료 시 같은 디렉터리의 다른 agent view가 저장한 초안을 지우던 문제 수정
- 업데이트로 재시작한 agent view가 다른 agent view의 입력 텍스트를 들고 돌아오던 문제 수정
- agents view 미리보기가 긴 명령·결과·상태 줄을 말줄임표 없이 자르고, 승인 대기 명령에서 `**`, backtick, 태그를 빼던 문제 수정
- 작업 중 연결이 끊기면 Claude in Chrome이 확장이 연결되지 않았다고 보고하던 문제 수정: 이미 실행됐을 수 있는 작업을 반복하기 전에 페이지를 확인
- 세션 밖에서 사용 한도가 풀린 후에도 Remote Control 세션이 다른 기기에서 "Limit reached"를 표시하던 문제 수정
- Claude가 파일 하나를 보냈을 때 Claude iOS 앱에서 파일 카드가 빠지던 문제 수정
- 서버가 모델 접근 갱신을 계속 거부하면 self-hosted runner 세션이 설명 없이 실패하던 문제 수정: runner가 더 빨리 재시도하고 세션에 경고를 게시
- 클라우드 세션의 `/permissions`가 사용할 수 없다고만 답하던 문제 수정: 세션 규칙이 어디 있고 어떻게 바꾸는지 안내
- 세션이 새 worker로 옮겨갈 때 클라우드 세션이 PermissionRequest hook이 추가한 것 등 세션 범위 deny·ask 권한 규칙을 잃던 문제 수정
- 클라우드 세션에서 질문에 답하지 않고 메시지를 세 번 입력하면 그 세션의 mod hot reload가 꺼지던 문제 수정
- 웹의 Claude Code에서 `/clear` 후 계속 실행되는 백그라운드 task가 다른 task가 시작·종료될 때까지 목록에서 사라지던 문제 수정
- 모바일·웹 클라우드 세션의 slash command 메뉴에 숨김 명령이 나타나던 문제 수정
- `/rewind`가 디렉터리 symlink를 통해 파일을 복원하거나 삭제할 수 있던 문제 수정
- accept-edits와 auto mode에서 `sed` 명령이 권한 검사를 건너뛸 수 있던 문제 수정
- gateway URL이 managed settings에만 있고 server-managed settings를 가져올 수 없을 때 LLM gateway 뒤에서 managed settings의 `CLAUDE_CODE_AUTO_MODE_SERVER=1`이 무시되던 문제 수정
- 조작한 환경변수 접두어로 명령 일부를 권한 검사에서 숨길 수 있던 Bash 권한 우회 수정
- claude.ai connector의 터미널 이름(`mcp__claude_ai_Slack`)으로 작성한 deny·ask 규칙, hook matcher, `disallowedTools` 항목이 Claude Desktop에서 무시되던 문제 수정 (Claude Desktop이 이 버전을 포함한 후 적용)
- worktree 생성 시 sandbox를 벗어나던 문제 수정
- self-hosted runner 수정: `--trust-workspace false`가 저장소 설정 파일과 skill의 hook 실행도 막음
- shell에서 export한 LLM gateway로 시작한 유휴 백그라운드 세션이 업데이트 후 gateway를 벗어나던 문제 수정
- `/status`와 auto mode 과금 안내의 도움말 링크가 줄바꿈되면 주소 일부만 열던 문제 수정
- `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC`가 설정된 상태에서 TLS 검사 proxy 뒤의 인증서 오류가 계속되던 문제 수정. 설정 시 인증서 실패 후 설정된 API 호스트와 TLS handshake를 수행(http:// proxy가 있으면 경유). API 요청은 보내지 않음
- 첫 실행 질문에 답이 없으면(스크립트, 서비스, 배치 작업, Ctrl+C) `claude remote-control`이 status 0으로 조용히 종료하던 문제 수정: 이유를 알리고 1로 종료
- 첫 실행 질문에서 줄바꿈 없이 pipe로 넣은 `y`를 `claude remote-control`이 무시하던 문제 수정: 이제 yes로 처리
- 새 이름을 세션 transcript에 저장하지 못했는데도 `/rename`이 단순 성공을 보고하던 문제 수정: 이름이 유지되지 않을 수 있다고 경고
- plugin이 제공하는 `subagentStatusLine` 명령에서 `${CLAUDE_PLUGIN_ROOT}`가 치환되지 않던 문제 수정. 이제 plugin 자체 스크립트를 참조할 수 있음
- `claude plugin update`와 `/plugin` "Update now"가 새 plugin 버전에서 추가된 의존성을 설치하지 않던 문제 수정
- compaction 후 subagent가 자신이 시작하거나 넘겨받지 않은 백그라운드 agent의 완료 알림을 기다리라고 안내받던 문제 수정
- 백그라운드 agent의 이후 보고가 조용히 사라지던 문제 수정: 이제 알림이 거부 사실과 다시 요청하는 방법을 알려줌
- Windows 설정 저장 개선: 다른 프로그램이 연 파일을 더 오래 기다려 저장 중 강제 종료로 `~/.claude.json`이 비는 일이 줄어듦
- 짧은 연결 끊김 후 Claude in Chrome 개선: 다른 브라우저를 고르기 전에 세션 자신의 브라우저가 돌아오길 최대 6초 기다림
- Claude in Chrome 개선: 최대 60,000자의 `javascript_tool` 결과가 파일로 저장되지 않고 대화에 남음
- `claude purge`와 오래된 세션 정리 개선: 완전히 지우지 못한 폴더를 재시도하고, 남으면 오류로 보고
- macOS·Windows에서 작업 디렉터리 밖 경로 거부 메시지 개선: 대소문자만 다른 경우 작업 디렉터리 안의 철자를 알려줌
- 힌트, `/stats`·`/model`·`/sandbox`의 세부 정보, 거부된 작업 메시지 등 흐린 회색 보조 텍스트의 대비 개선
- 존재하지 않는 문서를 업데이트하거나 서비스가 반복 거부된 쓰기를 일시 중지할 때 artifact 데이터베이스 오류 메시지 개선
- 실패한 upstream 호출에 대한 Claude apps gateway 경고 개선: 제공자뿐 아니라 upstream 이름도 표시
- Claude apps gateway 지출 한도 오류 개선: "spend limit reached · resets Dec 1"로 표시하고, `admin.blocked_message`가 있으면 이어서 표시
- `/model` picker 개선: 이전 모델을 현재 모델 뒤에 나열하지 않고 "More models" 행 아래로 묶음
- 터미널의 `/context` 개선: Claude가 읽는 표를 짧게 유지. 목록마다 큰 순서 10행만 남기고, 필요할 때 로드하는 MCP 도구는 호출 전까지 서버당 한 행으로 묶음
- 클라우드 세션의 `/usage` 개선: 요금제 한도를 보여줄 수 없을 때 claude.ai의 Settings → Usage로 링크
- [VSCode] plugin marketplace 제거 확인 개선: 그 시점에 설치된 plugin을 확인
- MCP task가 feature flag 가져오기 없이도 터미널에서 동작하도록 변경 (Bedrock, Vertex, Foundry, LLM gateway, `DISABLE_TELEMETRY`). 끄려면 `CLAUDE_CODE_DISABLE_MCP_TASKS=1` 설정
- 프로젝트 밖에서 auto mode 서버 측 검사를 끈 후에는 프로젝트 설정 파일이나 plugin이 다시 켤 수 없도록 변경
- Monitor의 WebSocket watch가 모든 Bash 명령에 적용되는 규칙을 따르도록 변경: deny는 거부하고, ask 규칙 아래에서는 Monitor allow·bypass mode·auto mode가 확인을 건너뛰지 않음
- 호스트가 네트워크를 관리하는 환경에서 설정 파일로 `CLAUDE_CODE_PROXY_RESOLVES_HOSTS`를 설정할 수 없도록 변경. 프로세스 환경에서 설정해야 함
- 더 넓은 deny 규칙이 명령을 덮으면 세션의 정확한 Bash·PowerShell ask 규칙을 묻지 않고 거부하도록 변경
- 조회·표시용 flag 세트 밖의 flag로 `which`를 실행하기 전에 Bash 도구가 권한을 묻도록 변경
- `--add-dir` 디렉터리가 자체 신뢰 대화상자를 수락한 후에만 plugin marketplace를 등록하도록 변경
- 중첩 skill 로딩 변경: Bash sandbox가 켜져 있으면 시작 폴더 아래 `.claude/skills` 폴더의 skill은 그곳에서 Claude Code를 시작하거나 `/cd`로 이동한 경우에만 로드
- self-paced `/loop`가 다시 예약하지 않고 끝난 turn에서 종료되도록 변경 (fallback wakeup 예약 안 함). 이전 동작을 유지하려면 `CLAUDE_CODE_LOOP_KEEPALIVE=1` 설정
- 새 메시지가 turn을 끊은 후 끝난 도구 호출에서도 PostToolUse hook이 최대 10초 동안 실행되도록 변경
- 안전장치가 subagent를 멈춘 후 Claude가 받는 안내 변경: 직접 작업하지 않고 더 좁은 프롬프트로 재시도하거나 사용자에게 알림
- 클라우드 세션이 새 worker로 옮겨갈 때 deny·ask 규칙을 모두 유지할 수 없으면 세션 범위 allow 규칙을 버리도록 변경 (다시 물어볼 수 있음)
- TLS 검사 proxy 뒤의 자동 인증서 복구 변경: `ALL_PROXY`만 설정된 경우 실행하지 않음. 대신 `HTTPS_PROXY`를 proxy의 http:// URL로 설정
- 다른 사람이 썼을 수 있는 행의 artifact 데이터베이스 저장 변경: 파일마다 숨김 마커 파일을 만들고, 마커가 없는 기존 파일(이전 버전 export 포함)은 건드리지 않고 보고
- `/claude-api managed-agents-onboard` 템플릿을 Claude Console에 맞게 갱신: Performance tuner 제거, 두 개 이름 변경, 프롬프트에서 쓰지 않는 다섯 개의 web search·fetch 끔
- Claude Code 내장 Claude in Chrome 도구에서 확장에 저장된 shortcut을 나열·실행하던 `shortcuts_list`, `shortcuts_execute` 제거
- Gateway: AWS GovCloud와 다른 upstream을 섞은 경우와 gateway 환경의 base URL 변수에 대한 시작 경고 추가
- Gateway: managed settings가 header에 Amazon Bedrock guardrail을 지정했지만(gateway는 이를 전달하지 않음) `guardrail`을 설정한 `bedrock` upstream이 없을 때 시작 로그 경고 추가
- Gateway: 모든 upstream이 Amazon Bedrock일 때 Claude Desktop이 항상 실패하는 web search 도구를 제공하던 문제 수정
- Self-hosted runner: `--use-anthropic-git-proxy` 또는 `--configure-git`으로 시작한 runner가 시작 검사 실패로 종료하기 전에 등록되던 문제 수정. 이제 먼저 종료
- Self-hosted runner: `CLAUDE_RUNNER_CHECKOUT_PATH` 변경으로 세션의 저장소마다 별도 폴더 사용. 세션에서 이미 쓰인 폴더 이름에는 `-2`, `-3`, …을 붙임
- Self-hosted runner: 세션 종료 시 디버그 로그 업로드 제거. 실패한 세션의 로그는 `--remove-session-state`를 설정하지 않으면 runner 호스트에 남음
- [VSCode] 50,000자를 넘는 프롬프트가 조용히 잘리던 문제 수정: 프롬프트는 안내와 함께 채팅창에 남고, 한도를 넘는 붙여넣기는 안내와 함께 거부
- [VSCode] 설문이나 "Report a problem" 버튼 클릭이 작성 중인 프롬프트를 전송하던 문제 수정
- [VSCode] 확장의 Web 탭에서 연 클라우드 세션이 `/clear`나 입력 프롬프트의 Retry·Edit로 지운 turn을 되살리던 문제 수정
- [VSCode] 확장에서 세션 이름을 바꾸면 삭제된 세션 파일이 되살아나던 문제 수정
- [VSCode] 창을 다시 로드한 후 Claude가 승인되지 않은 plan을 실행하던 문제 수정: plan mode에서 중단된 단계는 다른 권한 모드로 세션이 돌아오면 안내와 함께 멈춤
- [VSCode] Claude apps gateway 뒤의 "not signed in" 메시지 개선: 오류처럼 보이고 Sign in 링크가 있음
- [VSCode] Claude 답변 중 Claude 로그인·connector·API 주소를 가리키는 링크를 브라우저에서 열지 않고 주소가 보이는 텍스트로 표시하도록 변경
- [VSCode] 끌어다 놓은 항목 경로에 매우 긴 "/" 연속이 있으면 채팅 패널이 멈출 수 있던 문제 수정
- [VSCode] `claude-vscode.toggleDictation` 명령이 열린 모든 Claude view에서 동시에 받아쓰기를 시작하던 문제 수정: 사용 중인 view에서만 동작하고 다시 누르면 멈춤
- [VSCode] 닫히지 않은 `$$` 수식 블록이 점점 짧아지며 많이 스트리밍되는 답변에서 채팅 패널이 느려지던 문제 수정
- [VSCode] 대규모 workspace용 채팅 패널 진단 도구 개선: 문제가 없는 파일은 빼고, 압축된 JSON을 반환하며, 선택적 최소 심각도를 받음
- [Cloud sessions] 예약된 task가 memory라는 이름의 connector를 조용히 빼던 문제 수정: 이제 그 이름에 짧은 접미사를 붙여 mount해 유지
- [Cloud sessions] 클라우드 세션에서 대기 메시지의 Send now가 실행 중인 백그라운드 agent를 종료하던 문제 수정: 이제 계속 실행
- [Cloud sessions] self-hosted 환경의 setup 지연 경고 개선: 링크가 조직 기본값이나 실행 중인 runner가 있는 환경을 우선하고 그 이름을 표시
- [Code Review] GitHub 조직 연결 해제 시 Code Review의 All repositories 설정도 끄도록 변경. 다시 연결해도 직접 켤 때까지 꺼진 상태 유지
- [Claude Tag] 채널 목록을 완전히 로드하지 못하면 Claude Tag 설정이 시작을 막던 문제 수정: 관리자가 채널을 고르지 않고도 시작 가능
- [Claude Tag] Claude Tag가 연결된 Enterprise 조직의 Models 관리 페이지에 모델 기본값 관리 위치로 연결되는 Claude Tag 행 추가
- [Claude Tag] Claude Tag 관리 설정에서 auto mode allow 규칙을 저장하면 다른 관리자의 변경을 덮어쓰던 문제 수정: 이제 메시지와 함께 저장을 거부

---

## 🎯 챌린지

이번 버전에서 내 환경에 적용해볼 만한 항목입니다.

### 1. feat/fix 브랜치 push 금지를 deny 규칙으로도 막기
- **파일**: `~/.claude/settings.json`
- **근거**: 지금은 `deploy-guard.sh` hook 하나만 `git push origin feat/*`를 막는다. 이번 버전에서 따옴표가 들어간 명령을 Bash deny 규칙이 놓치던 문제와 환경변수 접두어 우회가 고쳐졌다. `permissions.deny`에 `"Bash(git push origin feat/*)"`, `"Bash(git push origin fix/*)"`를 추가하면 hook이 실패해도 이 규칙이 한 번 더 막는다.
- **난이도**: ★☆☆ (약 10분)

### 2. changelog-sync cron에서 `claude -p` 종료 코드 확인
- **파일**: `~/.claude/skills/claude-changelog-sync/` 아래 생성 스크립트
- **근거**: 이번 버전부터 auto mode에서 작업이 거부되면 `claude -p`가 1로 종료한다. 이전에는 0을 반환했다. 생성 스크립트가 종료 코드를 확인하도록 고치면 매일 08:00 cron 실행이 실패했을 때 빈 MD 파일이 남지 않는다. 실패 사실도 로그에 남는다.
- **난이도**: ★★☆ (약 15분)

### 3. self-paced `/loop` 예전 동작 유지 여부 정하기
- **파일**: `~/.claude/settings.json` (`env` 블록)
- **근거**: 이번 버전부터 self-paced `/loop`는 다시 예약하지 않은 turn이 끝나면 종료한다. 배포나 상태를 `/loop`로 감시하는 일이 있으면 `"CLAUDE_CODE_LOOP_KEEPALIVE": "1"`을 넣어 대비용 wakeup을 유지한다. `/loop`를 쓰지 않으면 넣지 않는다.
- **난이도**: ★☆☆ (약 5분)
