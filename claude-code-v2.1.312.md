# Claude Code v2.1.312

> 작성일: 2026-10-30

---

# 📋 요약본

## 🎉 신기능 (4건)
- **Claude apps gateway `oidc.user_id_claim`** — 사용자를 `sub`가 아닌 다른 id_token claim으로 식별한다.
  - 예: Microsoft Entra ID의 `oid`.
- **클릭으로 즉시 전송** — 전체 화면에서 대기 중인 메시지 아래 "to send now" 안내를 클릭하면 바로 보낸다. 단축키와 동작이 같다.
- **[Cloud sessions] 루틴 모델 선택기에 effort 레벨 추가** — 클라우드 루틴을 만들거나 고칠 때 effort 레벨을 지정한다.
- **[Cloud sessions] setup script용 Bash 에디터** — 클라우드 환경 설정의 setup script 입력란에 색상, 줄 번호, Copy 버튼이 생겼다.

## 🛠️ 개선/수정 (12건)
- **큰 CLAUDE.md·rules 파일 덮어쓰기 방지** — Claude가 하위 디렉토리의 아주 큰 CLAUDE.md, rules 파일, @-include 파일을 앞부분만 읽고 덮어쓰던 문제를 고쳤다. 이제 Write는 파일 전체를 읽거나 제자리 편집(Edit)을 하라고 요구한다.
- **스킬·명령어 로딩 안정화** — Bash로 git 저장소 깊은 곳에 `cd`하면 디렉토리별 스킬과 `paths:` 스킬을 찾지 못하던 문제를 고쳤다. 이름이 잘못된 명령어 하나 때문에 모든 명령어 로딩이 멈춰 `claude -p` 출력이 비던 문제도 고쳤다.
- **세션·설정 안정성** — VS Code에서 로그인한 뒤 managed settings와 조직 정책을 받아오지 않던 문제를 고쳤다. 세션 재개 후 첫 답변이 사라지던 드문 문제, PDF 읽기 중 정리 작업과 겹치면 `pdftoppm` 오류가 나던 문제도 고쳤다.
- **effort 표시 정확도** — 스피너, OpenTelemetry `effort` 값, transcript가 아직 적용되지 않은 새 effort 레벨을 보여주던 문제를 고쳤다. 이제 실제로 적용 중인 레벨을 보여준다. 작업 중 바꾸면 다음 메시지까지 기다릴 수 있다고 안내하고, 해당하지 않게 되면 안내를 지운다. `/model`·`/effort` 캐시 경고 문구도 바로잡았다.
- **UI 자잘한 버그** — 대기 상태를 잘못 판정하던 문제, agent view의 입력 텍스트 복원 문제와 셸 모드 재진입 문제, vim `d`/`c`/`y` + `gj`/`gk` 카운트 오동작, `/verify` 설명이 너무 길게 나오던 문제를 고쳤다.
- **WebFetch 오류 안내 개선** — 클라우드 세션에서 호스트 이름이 해석되지 않으면, 허용된 네트워크 도메인 밖일 수 있다고 설명한다.
- **인식되지 않는 모델명 처리 변경** — Bedrock, Vertex, Foundry, Mantle에서 모르는 모델명에는 짧은 system prompt를 쓴다. 차단된(flagged) 메시지 뒤 자동 모델 전환도 이런 모델명에 적용한다. 끄는 환경변수는 `CLAUDE_CODE_SIMPLE_SYSTEM_PROMPT=0`, `CLAUDE_CODE_DISABLE_REFUSAL_FALLBACK=1`이다.
- **사용량 한도 문구** — "session limit"을 "5-hour limit"으로 바꿨다. VS Code는 리셋 시각을 "Resets at 3:10 PM" 같은 시계 시간으로 보여준다.
- **hook 동시 실행 제한** — prompt·agent hook은 세션당(서브에이전트 포함) 동시에 최대 24개까지 돈다. 타임아웃을 넘겨 기다리는 것은 별도로 최대 12개다. 1초 미만 `timeout`은 1초로 친다.
- **서브에이전트 `autoCompactWindow` 동작** — 서브에이전트의 `autoCompactWindow`가 이제 `CLAUDE_CODE_AUTO_COMPACT_WINDOW`로 정한 값을 낮출 수 있다. 올리지는 못한다.
- **OpenTelemetry 변경** — 공식 마켓플레이스 플러그인의 원격 MCP 서버는 `mcp_server.name`에 실제 이름이 찍힌다. `claude_code.safety_event` 이벤트는 더 이상 보내지 않는다.
- **클라우드·VS Code·Slack·Code Review 수정** — 클라우드 세션 이름과 브랜치 이름은 서버가 정한다. 그 밖에 메시지 중복 실행, 오류 표시 위치, 루틴 Edit 메뉴, Remote Control 상태, Claude Tag 채널 설정·스레드·네트워크 문제, Code Review가 오래된 커밋을 리뷰하던 문제를 고쳤다.

## 🔑 이번 버전의 핵심 키워드
**"조용히 망가지던 것들을 막는다"** — 큰 설정 파일을 몰래 덮어쓰거나, 스킬을 못 찾거나, 출력이 비거나, effort를 잘못 표시하던 문제를 바로잡았다.

---

# 📜 원문 (한글 번역본)

> 원문 ChangeLog를 원래 순서 그대로 한 줄도 빠짐없이 번역한 문서입니다.

- Claude apps gateway에 `oidc.user_id_claim` 추가. `sub`가 아닌 다른 id_token claim으로 사용자를 식별한다. 예: Microsoft Entra ID의 `oid`
- 클릭 전송 추가: 전체 화면에서 대기 중인 메시지 아래 "to send now" 안내를 클릭하면, 해당 단축키처럼 즉시 전송한다
- VS Code 확장에서 로그인한 뒤 남은 세션 동안 managed settings와 조직 정책을 받아오지 않던 문제 수정
- 하위 디렉토리의 아주 큰 CLAUDE.md, rules 파일, @-include 파일을 Claude가 앞부분만 보고 덮어쓰던 문제 수정. 이제 Write는 전체를 읽거나 제자리에서 편집하라고 요구한다
- Bash로 git 저장소 더 깊은 곳에 `cd`한 뒤 디렉토리별 스킬과 `paths:` 스킬을 찾지 못하던 문제 수정
- 터미널에서 세션을 재개한 뒤의 첫 답변이 다음 재개 때 사라질 수 있던 드문 문제 수정
- 이름이 잘못된 명령어 하나 때문에 모든 명령어가 로드되지 않아 `claude -p`가 아무것도 출력하지 않을 수 있던 문제 수정
- 오래된 세션 파일 정리가 동시에 돌 때 Read 도구가 PDF 페이지에서 "pdftoppm failed: Could not write image"로 실패하던 문제 수정
- 작업 중 새로 고른 effort 레벨을 모델이 적용하기 전부터 스피너, OpenTelemetry `effort` 값, transcript에 표시하던 문제 수정. 이제 실제 적용 중인 레벨을 보여준다
- `/model`·`/effort` 캐시 경고가 다음 메시지 때 다시 읽는다고 안내하던 문제 수정. Claude가 작업 중일 때 바꾸면 더 일찍 다시 읽을 수 있다
- 마지막 메시지 문장 중간에 사용자 대기 항목이 언급만 돼도 세션이 사용자를 기다리는 상태로 표시되던 문제 수정
- 종료 직전 Ctrl+C로 지운 입력 텍스트를 agent view가 다음 실행 때 복원하던 문제 수정
- 빈 `!` 입력에서 Ctrl+D로 나간 뒤 agent view가 셸 모드로 다시 열리던 문제 수정
- vim 모드에서 남은 줄 수보다 큰 카운트의 `gj`/`gk`와 함께 쓴 `d`, `c`, `y`가 텍스트를 지우거나 복사하던 문제 수정. Vim처럼 이제 커서만 옮긴다
- `/help`와 `/` 명령 메뉴에서 `/verify`가 짧은 설명 대신 Claude용 긴 설명을 보여주던 문제 수정
- 프롬프트의 effort 표시 개선: 작업 중 바꾸면 다음 메시지까지 기다릴 수 있다고 알려주고, 해당하지 않게 되면 안내를 지운다
- 클라우드 세션의 WebFetch 오류 개선: 해석되지 않는 호스트는 허용된 네트워크 도메인 밖일 수 있다고 설명하므로, Claude가 허용할 호스트 이름을 알려준다
- Bedrock, Vertex, Foundry, Mantle이 Claude Code가 모르는 모델명(커스텀 배포명, inference profile ARN 등)에는 짧은 system prompt를 쓰도록 변경. 실제로는 Sonnet이나 Haiku를 가리켜도 마찬가지다. 전체 프롬프트를 유지하려면 `CLAUDE_CODE_SIMPLE_SYSTEM_PROMPT=0` 설정
- 차단된(flagged) 메시지 뒤 자동 모델 전환이 Claude Code가 모르는 모델명(커스텀 배포명 등)에도 적용되도록 변경. 끄려면 `CLAUDE_CODE_DISABLE_REFUSAL_FALLBACK=1` 설정
- 사용량 한도 메시지에서 5시간 창을 "session limit" 대신 "5-hour limit"으로 부르도록 변경
- CLI에서 시작한 클라우드 세션이 세션 이름과 브랜치 이름을 서버에서 받도록 변경
- prompt hook과 agent hook이 세션당(서브에이전트 포함) 동시에 최대 24개, 여기에 이벤트 타임아웃보다 오래 기다린 것 최대 12개까지 돌도록 변경. 1초 미만 `timeout`은 이제 1초로 친다
- 서브에이전트의 `autoCompactWindow`가 `CLAUDE_CODE_AUTO_COMPACT_WINDOW`로 정한 창을 낮추도록 변경. 이전에는 효과가 없었다. 여전히 그 창을 높이지는 않는다
- OpenTelemetry `mcp_server.name`이 공식 Anthropic 마켓플레이스 플러그인이 선언한 고정 URL 원격 MCP 서버를 `custom` 대신 실제 이름으로 보고하도록 변경
- Claude Code가 `claude_code.safety_event` OpenTelemetry 이벤트를 보내지 않도록 변경
- [VSCode] 시작할 때 조직 설정을 불러오지 못하거나 거부되면 세션이 종료 코드만 남기고 끝나던 문제 수정. 이제 탭에 이유를 보여주고 Retry 또는 Sign in again을 제안한다
- [VSCode] 사용량 한도 리셋을 시계 시간("Resets at 3:10 PM")으로 보여주고 "5-hour limit"으로 부르도록 변경
- [Cloud sessions] 클라우드에서 도는 루틴을 만들거나 고칠 때 모델 선택기에 effort 레벨 추가
- [Cloud sessions] 클라우드 환경 설정의 setup script 입력란에 색상, 줄 번호, Copy 버튼이 있는 Bash 에디터 추가
- [Cloud sessions] Claude가 클라우드 세션에 저장소를 추가하는 단계 표시 개선: 열면 raw JSON 대신 무슨 일이 있었는지 짧은 표로 보여준다
- [Cloud sessions] 클라우드 세션에서 전송 실패 후 바뀌지 않은 메시지를 다시 보내면 가끔 두 번 실행되던 문제 수정
- [Cloud sessions] 클라우드 환경 생성 실패 오류가 열린 대화상자 밖 토스트로만 나오던 문제 수정. 이제 대화상자 안에 표시한다
- [Cloud sessions] Routines 페이지의 루틴 메뉴에서 Edit를 누르면 편집 대화상자 없이 루틴 페이지로만 이동하던 문제 수정
- [Remote Control] 보관 해제한 Remote Control 세션이 컴퓨터가 다시 연결될 때까지 작업 중으로 보이던 문제 수정. 이제 대기(idle)로 보인다
- [Claude Tag] Slack에서 Claude Tag 재시도 안내가 일반 API 오류 대신 사용 중인 모델 이름이나 rate limit 도달을 알려주도록 개선
- [Claude Tag] 오래된 비공개 Slack 채널이 공개로 바뀌며 새 ID를 받으면 Claude Tag 채널의 on/off 스위치와 agent 설정이 워크스페이스 기본값으로 돌아가던 문제 수정
- [Claude Tag] 환경의 네트워크 접근이 None인 채널에서 Slack의 Claude가 답하지 않던 문제 수정
- [Claude Tag] 같은 채널의 다른 스레드에 답하는 중일 때 Slack의 Claude가 가끔 파일을 엉뚱한 스레드에 올리던 문제 수정
- [Code Review] GitHub가 push 이벤트를 늦게 보내면 Code Review가 오래된 커밋을 리뷰하거나 아예 리뷰하지 않던 문제 수정. 이제 pull request의 현재 커밋을 리뷰한다

---

## 🎯 챌린지

이번 버전에서 내 환경에 적용해볼 만한 항목입니다.

### 1. 체인지로그 동기화 결과가 비면 실패로 처리하기
- **파일**: `~/.claude/skills/claude-changelog-sync/` 안에서 `claude -p`를 부르는 스크립트(SKILL.md 또는 생성 스크립트. 정확한 파일명은 확인 필요)
- **근거**: 이번 버전에서 "잘못된 명령어 하나 때문에 `claude -p` 출력이 비던" 버그를 고쳤다. 매일 08:00 cron은 이런 빈 출력을 그대로 버전 MD 파일로 저장할 수 있다. 출력이 비었거나 `# Claude Code v`로 시작하지 않으면 파일을 쓰지 않고 오류를 남기도록 검사를 추가한다.
- **난이도**: ★★☆ (약 15분)

### 2. EOS 전용 스킬에 `paths:` 범위 지정하기
- **파일**: `~/.claude/skills/eos-cdn-deploy/SKILL.md`, `~/.claude/skills/eos-store-round/SKILL.md`, `~/.claude/skills/update-repos/SKILL.md` (위치는 가정. 실제 경로 확인 필요)
- **근거**: 이번 버전에서 Bash `cd` 뒤 `paths:` 스킬을 찾지 못하던 문제가 고쳐져, 경로 범위 지정을 믿고 쓸 수 있다. EOS 전용 스킬에 eos-h5 경로 `paths:`를 걸면 다른 프로젝트에서는 스킬 목록에서 빠진다. 그만큼 `skillListingBudgetFraction: 0.08` 예산이 남고, 엉뚱한 프로젝트에서 잘못 실행될 위험도 줄어든다.
- **난이도**: ★☆☆ (약 10분)

### 3. 글로벌 CLAUDE.md의 SSH 키 표를 별도 파일로 분리하기
- **파일**: `~/.claude/CLAUDE.md` → `~/.claude/rules/ssh-keys.md`(신규, @-include)
- **근거**: 이번 버전은 아주 큰 CLAUDE.md나 rules 파일을 앞부분만 읽고 덮어쓰는 사고를 막았다. 현재 CLAUDE.md는 4KB를 넘을 만큼 크다. 자주 바뀌지 않는 SSH 키 표를 떼어 내면 본문이 짧아지고, 고칠 때 덮어쓸 위험도 줄어든다.
- **난이도**: ★☆☆ (약 10분)
