# Claude Code v2.1.316

> 작성일: 2026-11-02

---

# 📋 요약본

## 🎉 신기능 (10건)
- **`CLAUDE_CODE_DISABLE_ULTRATHINK`** — `ultrathink` 키워드를 끄는 환경변수. 프롬프트에 이 단어가 섞여도 추론 강도가 바뀌지 않는다.
- **풀링 그룹 예산 (Claude apps gateway)** — 그룹 멤버가 함께 쓰는 월 예산 하나를 둔다. 각 멤버의 개인 한도는 그대로 유지된다.
  - spend limits admin API의 `pooled_budget` 으로 설정한다.
- **`CLAUDE_CODE_DISABLE_LOOPED_CROSS_CERT_DROP`** — 서로를 인증하며 고리를 이루는 시스템 교차 인증서를 버리지 않고 유지한다. 이런 인증서가 필요한 사설 CA 서버용이다.
- **`CLAUDE_CODE_SUBAGENT_EFFORT`** — 따로 지정한 값이 없을 때 서브에이전트가 쓸 effort 레벨을 정한다. 지정하지 않으면 지금처럼 세션 값을 물려받는다.
- **`managed.policy_mode: layered` (Claude apps gateway)** — 개발자에게 맞는 정책을 첫 번째 하나만 쓰지 않고 전부 적용한다. 위에 있는 정책이 아래 정책을 덮어쓰는 순서로 합쳐진다.
- **`guardrail.input_tagging` (Bedrock upstream)** — Amazon Bedrock guardrail의 prompt attacks 필터가 요구하는 입력 태그로 프롬프트를 감싼다.
  - `all_messages_and_system` 을 쓰면 시스템 프롬프트에도 태그를 붙인다.
- **[VSCode] 채팅 패널에서 gateway 로그인** — 터미널 없이 채팅 패널에서 Claude apps gateway에 로그인한다.
- **[Cloud sessions] 폼 카드** — MCP 서버가 폼 입력을 요청하면 카드가 뜬다. 채우거나 거절할 수 있다. 이전에는 사용자가 모르는 사이에 요청이 취소됐다.
- **[Cloud sessions] "Catching up…" 표시** — 다시 돌아온 cloud·Remote Control 세션이 메시지를 따라잡는 동안 이 줄을 표시한다.
- **[Code Review] 심각도별 findings 카드** — 분석 페이지에 기간 내 총 finding 수, 심각도별로 쌓은 일별 차트, 심각도별 개수를 보여준다.

## 🛠️ 개선/수정 (21건)
- **Opus 4.8 fast mode 지원 중단 예고** — 2026-10-30부터 deprecated 상태이고, 2026-11-30에 제거된다. 제거 후에는 일반 Opus 4.8로 넘어가지 않고 에러를 반환한다. 속도 이점을 유지하려면 Opus 5.5로 옮겨야 한다.
- **Bash 도구 셸 안정성** — 다음 문제를 고쳤다.
  - Claude Code가 스스로 종료될 때 셸 명령이 남아 계속 돌던 문제
  - 값에 줄바꿈이 있는 alias와 `-` 로 시작하는 함수가 깨지거나 사라지던 문제
  - `SHELLOPTS` 를 export한 상태에서 스크립트가 첫 명령 뒤에 멈추던 문제
  - Windows Git Bash에서 alias와 함수가 사라지던 문제
- **PowerShell hook 차단** — 명령이 타입 캐스트·`param`·`using`·attribute로 시작하면 exit code 2를 줘도 차단되지 않던 문제를 고쳤다.
- **네트워크·SSL** — 압축 응답이 잘리거나 손상되면 요청이 멈추던 문제를 고쳤다. SSL 인증서 에러는 이제 가능한 원인과 원인별 해결책을 알려준다.
- **Vertex AI·Bedrock 모델 별칭** — 계정이나 리전에서 최신 모델을 아직 못 쓰면 `sonnet`·`opus`·`haiku` 가 세션 중간에 에러를 내던 문제를 고쳤다. 이제 이전 모델로 넘어간다.
- **Gateway 모델 검사·로그인** — 요청에 들어 있는 모든 모델을 `availableModels`·`deniedModels`·`models` 와 대조한다. 막힌 모델이 있으면 어느 필드에 걸렸는지 적은 400을 반환한다. gateway가 필수인 환경에서도 `claude auth login` 이 실행된다.
- **`--restricted` 업로드 범위** — Read 허용 규칙에 걸린 작업 디렉터리 밖 파일이 업로드되던 문제를 고쳤다.
- **보이지 않는 문자가 든 프롬프트** — Enter를 두 번 눌러야 보내지던 문제를 고쳤다. 일반 프롬프트는 문자를 지운 뒤 한 번에 보낸다. 명령은 지금처럼 검토를 기다린다.
- **서브에이전트 모델 유지** — 부모 서브에이전트의 모델을 물려받은 서브에이전트가 백그라운드 작업이나 메시지로 깨어날 때 메인 모델로 바뀌던 문제를 고쳤다.
- **auto mode 묶음** — 다음 문제를 고치거나 동작을 바꿨다.
  - `"$defaults"` 가 없는 `autoMode.allow` 목록에 기본 예외가 다시 들어오던 문제
  - 안전 판정이 없어 턴이 멈췄는데 cloud 세션이 실패로 표시되지 않던 문제
  - `claude -p` 가 멈춘 이유를 출력하지 않던 문제
  - `CLAUDE_CODE_AUTO_MODE_SERVER=1` 이 무시되던 문제
  - `"$defaults"` 가 없는 allow 목록이 scheduled-task 기본 규칙을 지우지 않도록 변경
- **플러그인 MCP `headersHelper`** — 자격증명 이름의 환경변수가 `1` 같은 스위치 값이면 `CLAUDE_PLUGIN_ROOT` 와 URL이 손상되던 문제를 고쳤다.
- **SDK `register_repo_root`** — 작업 디렉터리 밖 경로의 CLAUDE.md를 불러오지 않던 문제를 고쳤다.
- **Artifact 도구** — `self` 레벨 DB 접근 규칙이 `?` 로 표시되던 문제와, 재게시를 거부할 때 규칙을 인용하지 않던 문제를 고쳤다.
- **`/model <id>` 경고** — 이 버전이 모르는 모델 ID를 넣으면 경고한다. 이 경우 자동 압축은 200K 컨텍스트로 가정한다.
- **UX 소소한 수정** — 다음 문제를 고쳤다.
  - push-to-talk 힌트가 한 세션에서 노출 횟수를 다 써버리던 문제
  - 첫 실행 안내 문구에서 단어가 빠지던 문제
  - Enterprise 설문이 Enter 없이 입력을 받던 문제
  - Grep·Glob이 타임아웃 뒤에도 끝나지 않던 문제
  - resume 시 plan이 복원되지 않던 문제
- **Self-hosted runner** — Stop 뒤에 메시지에 응답하던 문제와, 세션이 다른 머신으로 옮겨갈 때 MCP on/off 설정이 사라지던 문제를 고쳤다.
- **`/code-review`·`/diff`·`/ultrareview`** — 다음을 개선했다.
  - 클라우드에서 실행한 `/code-review` 결과가 findings 카드로 표시된다.
  - `/diff` 를 새로 고칠 때 git 명령을 하나 덜 실행한다.
  - GitHub remote가 없을 때 안내 문구를 바로잡았다.
- **server-managed settings** — Team·Enterprise 로그인에서 승인 프롬프트 없이 바로 적용된다. 검증되지 않는 저장본은 거부한다.
- **[VSCode] 개선·수정** — 다음을 바꾸고 고쳤다.
  - `ultrathink` 가 `xhigh` effort로 실행되고 무지개색으로 표시된다.
  - `opus[1m]` 처럼 `[1m]` 태그가 붙은 모델에서 Effort 슬라이더가 사라지던 문제
  - `/btw` 기록이 너무 일찍 지워지던 문제
  - 다시 불러오면 Auto 모드로 돌아오던 문제
- **[Cloud sessions] 개선·수정** — Enterprise 멤버가 network secrets를 직접 추가·삭제할 수 있다. Changes pane 안내를 배지로 바꿨다. Files 검색이 `../..` 경로를 보여주던 문제를 고쳤다.
- **[Claude Tag] Slack 연동** — 다음을 고치고 바꿨다.
  - 다른 곳에도 공유된 canvas를 편집하지 못하던 문제
  - Slack Connect 스레드에서 답장이 누락되던 문제
  - 체크리스트가 반쯤 남던 문제
  - 자동 응답 스위치를 "How Claude participates" 선택지로 변경

## 🔑 이번 버전의 핵심 키워드
**"정책은 겹겹이, 서브에이전트는 따로"** — gateway 정책·예산을 여러 층으로 관리하게 됐고, 서브에이전트 effort를 독립 설정하게 됐다. 셸·auto mode·모델 fallback의 빈틈도 대거 메웠다.

---

# 📜 원문 (한글 번역본)

> 원문 ChangeLog를 원래 순서 그대로 한 줄도 빠짐없이 번역한 문서입니다.

- `ultrathink` 키워드를 끄는 `CLAUDE_CODE_DISABLE_ULTRATHINK` 추가
- Claude apps gateway에 풀링 그룹 예산 추가: 그룹 멤버가 함께 쓰는 월 예산 하나를 각 멤버의 개인 한도와 별도로 둔다. spend limits admin API의 `pooled_budget` 으로 설정한다
- 서로를 고리 형태로 인증하는 시스템 교차 인증서를 유지하는 `CLAUDE_CODE_DISABLE_LOOPED_CROSS_CERT_DROP` 추가 (사설 CA가 이를 필요로 하는 서버용)
- 따로 지정된 값이 없을 때 서브에이전트가 쓸 effort 레벨을 정하는 `CLAUDE_CODE_SUBAGENT_EFFORT` 추가 (세션 값을 물려받는 대신 사용)
- Claude apps gateway에 `managed.policy_mode: layered` 추가: 개발자에게 맞는 정책이 첫 번째 하나가 아니라 전부 적용되며, 각 정책은 그 아래에 나열된 정책 위에 덮어쓰는 방식으로 합쳐진다
- Claude apps gateway Bedrock upstream에 `guardrail.input_tagging` 추가: Amazon Bedrock guardrail의 prompt attacks 필터가 요구하는 입력 태그로 프롬프트를 감싼다. `all_messages_and_system` 은 시스템 프롬프트에도 태그를 붙인다
- Opus 4.8의 fast mode를 2026년 10월 30일부로 deprecated 처리. 2026년 11월 30일에 제거된다. 제거 후 Opus 4.8의 fast mode 요청은 에러를 반환하며 일반 Opus 4.8로 넘어가지 않는다. 속도 이점을 유지하려면 Opus 5.5로 옮긴다
- macOS·Linux에서 Claude Code가 스스로 종료될 때(예: 자격증명 거부, cloud 세션 보관 처리) 셸 명령이 계속 실행된 채 남던 문제 수정
- Bash 도구의 셸에서 값에 줄바꿈이 있는 bash alias(Git Bash 제외)와 이름이 `-` 로 시작하는 함수가 깨지거나 사라지던 문제 수정
- `SHELLOPTS` 가 export된 상태에서 Bash 도구로 시작한 bash 스크립트가 첫 명령 후 멈추던 문제 수정
- 명령이 타입 캐스트·`param`·`using`·attribute로 시작할 때 PowerShell hook이 exit code 2에서 차단하지 않던 문제 수정
- 압축된 응답이 잘리거나 손상되면 일부 네트워크 요청이 멈추던 문제 수정
- Vertex AI·Amazon Bedrock에서 최신 모델을 아직 계정·리전에서 쓸 수 없을 때 `sonnet`·`opus`·`haiku` 가 이전 모델로 넘어가지 않고 세션 중간에 에러를 표시하던 문제 수정
- Claude apps gateway가 요청에 들어 있는 모든 모델을 `availableModels`·`deniedModels`·`models` 와 대조하지 않던 문제 수정. 차단된 모델이 든 요청은 이제 해당 필드를 명시한 400을 받는다
- managed settings가 Claude apps gateway를 요구하는 환경에서 `claude auth login` 이 실행을 거부하던 문제 수정. 터미널에서는 이제 gateway 로그인 화면을 보여준다
- Read 허용 규칙이 적용되면 `--restricted` 세션이 작업 디렉터리 밖의 파일을 업로드하던 문제 수정
- 보이지 않는 문자가 든 프롬프트를 보내려면 Enter를 두 번 눌러야 하던 문제 수정. 일반 프롬프트는 이제 문자를 정리해 첫 Enter에 전송되고, 명령은 여전히 검토를 기다린다
- 부모 서브에이전트의 모델을 물려받은 서브에이전트가 백그라운드 작업이나 메시지로 깨어날 때 메인 모델로 바뀌던 문제 수정
- `"$defaults"` 가 없는 managed `autoMode.allow` 목록이 호스트 앱의 `--settings`, `/permissions` 에서 처음 추가한 규칙, `/auto-mode-setup` 때문에 기본 예외를 되찾던 문제 수정
- 서버가 안전 판정을 반환하지 않아 auto mode가 턴을 멈췄을 때 cloud 세션과 cloud scheduled task가 실패로 표시되지 않던 문제 수정
- 백그라운드 에이전트가 아직 실행 중일 때 `claude -p` 텍스트 출력이 auto mode가 턴을 멈춘 이유를 알려주지 않던 문제 수정
- 실험적 beta를 끈 proxy·LLM gateway 뒤에서 호스트 앱(예: Claude Desktop)이 시작한 세션에서 `CLAUDE_CODE_AUTO_MODE_SERVER=1` 이 무시되던 문제 수정
- 자격증명 이름의 환경변수가 `1` 같은 스위치 값일 때 플러그인 MCP `headersHelper` 스크립트가 손상된 `CLAUDE_PLUGIN_ROOT` 와 서버 URL을 받던 문제 수정
- SDK `register_repo_root` 제어 요청이 작업 디렉터리 밖 디렉터리의 CLAUDE.md를 불러오지 않던 문제 수정 (`CLAUDE_CODE_ADDITIONAL_DIRECTORIES_CLAUDE_MD=1` 사용 시)
- Artifact 도구가 `self` 레벨의 artifact DB 접근 규칙을 `?` 로 표시하던 문제, 그리고 그 규칙을 없애는 재게시를 거부할 때 규칙을 인용하지 않던 문제 수정
- 이 버전이 모르는 모델이면 `/model <id>` 가 경고하지 않던 문제 수정 (이 경우 auto-compact는 200K 컨텍스트 창으로 가정한다)
- "hold space to speak" 힌트가 세 번의 노출 횟수를 한 세션에서 다 써버리던 문제, 그리고 push-to-talk가 지정되지 않았을 때 빈 키를 표시하던 문제 수정
- 검색 프로세스가 타임아웃으로 kill됐는데도 종료되지 않으면 Grep·Glob이 영영 돌아오지 않던 문제 수정 (Windows에서 확인)
- 대화 일부가 아직 저장 중일 때 `/clear` 나 `/resume` 을 실행하면 그 대화를 재개해도 plan이 복원되지 않던 드문 문제 수정
- 좁은 터미널에서 첫 실행 설정이 보안 안내와 terminal-setup 설명의 단어를 빠뜨리던 문제 수정
- Enterprise 설문 카드가 잠시 멈춘 뒤 입력한 1이나 0을 그대로 받던 문제 수정. 이제 입력한 답은 Enter가 필요하다
- Self-hosted runner: 세션 프로세스가 교체된 뒤 Claude가 작업하는 동안 보낸 메시지에 Stop 이후 응답하던 문제 수정
- Self-hosted runner: 세션이 새 머신으로 옮겨질 때 MCP 서버의 on/off 스위치가 가끔 사라지던 문제 수정
- Windows: rc 파일이 errexit와 pipefail을 설정하고 winpty alias만 있거나 alias가 없을 때 Git Bash에서 Bash 도구가 alias와 함수를 잃던 문제 수정
- Claude Desktop의 Code 탭이나 웹에서 시작한 `/code-review` 개선: cloud 및 `claude remote-control` 세션이 이제 일반 텍스트 목록 대신 findings 카드를 보여준다
- 대형 저장소에서 `/diff` 개선: 새로 고칠 때마다 보통 저장소 전체 git 명령을 하나 덜 실행하고, git이 느리면 새로 고침 간격을 늘린다
- `/ultrareview`·cloud 세션·cloud 에이전트가 GitHub remote를 찾지 못했을 때의 메시지 개선: 이제 https://github.com/new 에서 저장소를 만들라고 안내하고, `/ultrareview` 는 더 이상 `gh` 가 거부하는 `gh` 명령을 제안하지 않는다
- SSL 인증서 에러 메시지 개선: 중간 인증서를 빠뜨린 서버 등 가능한 원인과 원인별 해결책을 알려준다
- `"$defaults"` 가 없는 `autoMode.allow` 목록이 더 이상 scheduled-task 프롬프트의 기본 규칙을 지우지 않도록 auto mode 변경
- Team·Enterprise 로그인의 server-managed settings 변경: Anthropic API에서 가져온 설정은 승인 프롬프트 없이 적용되고, 검증되지 않는 저장본은 거부된다
- [VSCode] 터미널 없이 채팅 패널에서 Claude apps gateway에 로그인하는 기능 추가
- [VSCode] 터미널과 마찬가지로 `ultrathink` 가 해당 턴을 `xhigh` effort로 실행하고 채팅 입력창에 무지개색으로 표시되도록 변경
- [VSCode] 모델 설정에 `opus[1m]` 처럼 `[1m]` 태그가 있을 때 Effort 슬라이더·Ultracode 스위치·모델 이름이 사라지던 문제 수정
- [VSCode] 설정 파일에 에러가 있는 동안 저장된 `/btw` 곁질문 기록이 너무 일찍 삭제되던 문제 수정
- [VSCode] plan을 "Yes, and manually approve edits"로 승인한 대화가 다시 불러오거나 재시작한 뒤 Auto 모드로 돌아오던 문제 수정
- [Cloud sessions] cloud 세션에 폼 카드 추가: MCP 서버가 요청한 폼이 사용자 모르게 취소되지 않고, 직접 채우거나 거절할 수 있다
- [Cloud sessions] 다시 돌아온 cloud·Remote Control 세션이 메시지를 따라잡는 동안 "Catching up…" 줄 표시 추가
- [Cloud sessions] Enterprise 멤버가 network secrets를 보기만 하지 않고 자기 cloud 환경에서 추가·삭제할 수 있도록 변경
- [Cloud sessions] cloud 세션의 Changes pane 개선: 목록에서 빠진 항목에 대한 안내가 diff 위의 행이 아니라 브랜치 이름 옆 배지로 표시된다
- [Cloud sessions] Claude가 디렉터리를 바꾼 뒤 Files pane 파일 검색이 폴더를 `../..` 경로로 보여주던 문제 수정. 이제 프로젝트 루트 기준 경로로 보여준다
- [Claude Tag] Slack 채널에서 Claude가 만든 canvas가 다른 채널이나 DM에도 공유되면, 원래 채널에서 그 canvas를 편집·추가하지 않던 문제 수정
- [Claude Tag] 양쪽 조직이 모두 Claude를 설치했고 Slack이 답장을 상대 조직의 앱으로 보냈을 때, Slack Connect 스레드의 태그 없는 답장에 응답하지 않던 문제 수정
- [Claude Tag] cloud scheduled task의 Slack 실시간 상태 체크리스트가 반쯤 완료된 채 남던 문제 수정. 이제 실행 중 게시한 최상위 메시지를 그 실행에서 편집할 수 있다
- [Claude Tag] Slack 채널의 "Respond automatically" 스위치를 채널 Configure 페이지와 Claude Tag 관리자 설정의 "How Claude participates" 선택지로 변경
- [Code Review] Code Review 분석 페이지에 심각도별 findings 카드 추가: 기간 내 총 finding 수, 심각도별로 쌓은 일별 차트, 심각도별 개수를 보여준다

---

## 🎯 챌린지

이번 버전에서 내 환경에 적용해볼 만한 항목입니다.

### 1. 서브에이전트 effort 별도 지정
- **파일**: `~/.claude/settings.json` (`env` 블록에 `"CLAUDE_CODE_SUBAGENT_EFFORT": "high"` 추가)
- **근거**: 지금은 메인 세션이 `effortLevel: "xhigh"` 이고, 모든 서브에이전트가 이 값을 물려받는다. CLAUDE.md §5 정책상 서브에이전트를 Opus로 많이 띄우므로, 이번 버전의 `CLAUDE_CODE_SUBAGENT_EFFORT` 로 서브에이전트 effort만 따로 정하면 비용과 속도를 조절할 수 있다. 모델은 Opus 그대로 두고 강도만 바꾸기 때문에 §5의 신뢰성 원칙과 충돌하지 않는다. 같은 버전에 서브에이전트가 메인 모델로 바뀌던 버그 수정도 들어 있어 함께 효과가 있다.
- **난이도**: ★☆☆ (약 5분)

### 2. ChangeLog 동기화 파이프라인에서 ultrathink 끄기
- **파일**: `claude-changelog-sync` 스킬의 `claude -p --model opus` 호출부 (`~/.claude/skills/claude-changelog-sync/` 아래 스크립트로 추정, 실제 경로는 확인 필요)
- **근거**: 이 파이프라인은 ChangeLog 원문을 프롬프트에 그대로 넣는다. 그래서 원문에 `ultrathink` 라는 단어가 있으면 원치 않게 깊은 추론 모드가 켜진다. 이번 버전 원문에도 이 단어가 들어 있다. 호출 앞에 `CLAUDE_CODE_DISABLE_ULTRATHINK=1` 을 붙이면 cron 실행의 비용과 시간이 버전마다 들쭉날쭉해지는 것을 막을 수 있다.
- **난이도**: ★☆☆ (약 10분)
