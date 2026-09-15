# Claude Code v2.1.271

> 작성일: 2026-09-15

---

# 📋 요약본

## 🎉 신기능 (9건)
- **Remote 세션 fast mode** — Claude Code Remote(클라우드·자체 호스팅 러너)에서도 fast mode 가 동작한다. 호스트의 fast-mode 설정이나 세션에서 친 `/fast` 가 조직 허용 범위 안에서 적용된다.
- **`/config` 패널 마우스 지원** — 전체화면 모드에서 휠로 설정 목록을 스크롤하고, 설정 값을 클릭해 바꾸고, 포인터가 놓인 행이 강조된다.
- **`claude self-hosted-runner --drain-marker-file <path>`** — SIGTERM drain 시점에 그 파일이 있으면 러너가 서버에 "호스트 drain" 으로 종료를 보고한다. 텔레메트리 전용.
- **명령 단위 `allowed_domains`** — 샌드박스가 켜진 auto mode 에서 Bash·PowerShell·Monitor 에 붙는다. 명령이 필요로 하는 호스트를 그 명령과 함께 검토해 그 명령에만 열어주고, 다른 호스트는 거부한다.
- **에이전트 `omitClaudeMd`** — agent frontmatter 와 `--agents` JSON 에 추가. 커스텀·플러그인 서브에이전트를 user·project·local CLAUDE.md 없이 실행한다. 관리형 정책 파일은 그대로 로드된다.
- **`--accept-command <sha256>`** — `claude plugin install`·`claude plugin update` 에서 `-y` 대신, 앞선 `--json` 실행이 보여준 바로 그 명령만 정확히 수락한다.
- **`modelPricing` 배수 1 초과 지원** — 관리형 설정 `modelPricing` 과 Claude apps 게이트웨이 `pricing` 블록에서 `multiplier` 를 1 초과 10 이하로 줄 수 있다. 내부 사내 정산 단가에 마크업을 얹는 용도.
- **스피너 팁 — 데스크톱 앱 안내** — Bedrock·Vertex AI·Foundry·LLM 게이트웨이 사용자에게 Claude 데스크톱 앱을 안내한다. claude.ai 데스크톱 앱 팁은 `/desktop` 을 제안하고, 그 명령이 앱 다운로드를 안내한다.
- **[Claude Code on the web] 클라우드 환경 Custom network access** — 관리자 설정의 Cloud environments 편집기에 추가. claude.ai/code 의 환경 대화상자와 같은 허용 도메인 목록을 쓴다.

## 🛠️ 개선/수정 (79건)
- **조직 정책 캐시** — 계정·조직·API 키를 바꿔도 이전 조직 정책이 재사용되던 문제, 세션 중 자격 증명이 바뀌어도 매시 점검 전까지 정책이 갱신되지 않던 문제 수정.
- **정책 로드 후 목록 갱신** — 조직 정책이 시작 후 늦게 로드되거나 세션 중 바뀔 때 도구·명령 목록이 갱신되지 않던 문제 수정.
- **엔터프라이즈 `managed-mcp.json`** — 읽거나 파싱할 수 없는 파일이 그냥 무시되던 문제 수정. 이제 MCP 배타 제어를 유지(user·project·plugin 서버 미로드)하고 시작 시 경고한다.
- **`ANTHROPIC_UNIX_SOCKET` 프록시** — 서드파티 로컬 프록시를 통해 조직 정책을 가져오다 거부되던 문제 수정. 다시 다른 커스텀 게이트웨이와 동일하게 취급되며 Remote Control 도 포함.
- **클라우드 세션 서브에이전트 거부** — 워커 재시작 이후 워크플로·에이전트 승인이 적용되면 모든 서브에이전트 도구 호출이 `updatedInput … failed schema validation` 으로 거부되던 문제 수정.
- **`/fast off`** — 조직이 fast mode 를 껐을 때 끄지 않고 "Fast mode unavailable" 만 답하던 문제 수정.
- **`CLAUDE_CODE_SKIP_FAST_MODE_ORG_CHECK`** — API 가 fast mode 를 거부한 뒤에도 매 턴 fast 요청을 재전송하던 문제 수정. 이제 거부가 유지되고 사유가 표시된다.
- **`CLAUDE_CODE_RETRY_WATCHDOG` 하 fast mode** — 사용량 크레딧 한도에서 턴이 실패하거나 과부하를 fast 속도로 재시도하던 문제 수정. 표준 속도로 폴백한다.
- **Bash 권한 검사 4건** — ①`fmt`·`column` 류가 읽는 파일이 미인식 옵션 뒤에 올 때 놓치던 문제 ②와일드카드가 패턴·옵션 값 안에 있을 때 확장 파일을 건너뛰던 문제(`grep -v dir/* file`) ③셸 변수 선언 플래그로 실제 실행 명령을 위장하지 못하도록 ④디렉터리 이동 2회·서브셸·`cd`+`git` 체인이 `permissions.blockReadsOutsideWorkingDirectories` 아래 bypass·auto mode 에서 프롬프트를 건너뛰던 문제.
- **`.git/config.lock` 잔류(Linux)** — 샌드박스 명령이 시작에 실패한 뒤 남은 락이 세션 내내 `git checkout -b`·`git push -u`·`git config` 를 깨뜨리던 문제 수정.
- **설정 파일 외부 변경 감지(macOS)** — 시스템 파일 이벤트 서비스가 포화된 머신에서 변경을 놓치던 문제 수정. 워처가 폴링으로 폴백한다.
- **MCP 관련 6건** — 재개된 `claude -p` 세션의 `defer_loading` 실패, `text/plain` 비스트리밍 응답의 빈 응답 오류, `list_changed` 폭주로 인한 CPU 과부하, OAuth 클라이언트 등록 오취급, 도구 검색이 짧은 이름 선택 시 미매칭, Ctrl+O 가 재연결을 취소하고 트랜스크립트 뷰에서 `/mcp` 가 실패하던 문제.
- **세션 간 메시지** — 수신 세션의 권한 모드 정책에 걸려 흔적 없이 사라지던 문제 수정. headless 발신자는 전달 통지를 받고, `SendMessage` 결과가 읽힌 것처럼 보이지 않는다.
- **백그라운드 명령 중복 실행** — 컴파션 후에도 살아 있던 watch 태스크·dev 서버를 Claude 가 한 번 더 띄우던 문제 수정.
- **세션 재개 관련 5건** — `/model` 의 잘못된 캐시 경고, `/reload-skills` 의 스킬 수 불일치, `/resume`·`/continue` 의 세션 1~2개만 표시, `/resume`·`/teleport` 의 이전 대화 파일 읽기 추적 유지, `--resume` 의 1M 컨텍스트(`[1m]`) 유실.
- **UI·터미널 렌더링** — 스테일 배경색 잔류, st 의 Delete·rxvt-unicode 의 Alt+화살표, 종료·중단·에디터 진입 직후 터미널 응답(`^[[?1;2c`) 노출, `/add-dir` 경로 입력 커서·Enter 동작, 선행 `!` 가 뒤로 밀리던 텍스트 필드, `__proto__` 매처로 `/hooks` 메뉴가 죽던 문제 수정.
- **성능 개선 2건** — 큰 diff·긴 트랜스크립트 렌더링이 빨라지고 느린 프레임이 줄었다. 내장 모델 데이터 중복 검증을 건너뛰어 시작 시간이 소폭 단축.
- **훅 피드백 개선** — SessionStart·UserPromptSubmit·PreToolUse·SessionEnd 훅이 도는 동안 스피너가 경과 시간과 함께 그 사실을 알리고, SessionStart 훅 대기 중 프롬프트는 Esc 로 취소된다.
- **스피너 문구 개선** — 45초 후 "deep in thought", 출력 토큰 한도 복구 중에는 "picking the thought back up".
- **auto mode 동작 변경 2건** — 스킬·슬래시 명령 안의 인라인 `!` 셸 명령이 분류기 대신 기본 모드 권한 규칙을 따른다. 서브에이전트는 마지막 메시지를 사후 검토받는 대신, 안전 분류기가 검토하는 전용 hand-back 호출로 보고한다.
- **Monitor watch 변경** — 항상 마감 시한(최대 30분, 단일 프롬프트 `-p` 는 10분)을 갖고 재무장하도록 알린다. 무제한 `persistent` 옵션 폐지.
- **동적 워크플로 2건** — 사용량 한도에 걸리면 해당 에이전트를 버리지 않고 일시정지 후 리셋 시 자동 재개. 기본 크기는 Pro 플랜에서 small, medium 가이드라인은 15 → 10 에이전트로 하향.
- **아티팩트 4건** — Markdown 아티팩트가 문서형 스타일로 렌더, publish 오류 메시지 개선, 미지원 capability 오류에 지원 목록·상위 계약 버전 안내, 동시 감시 5개 → 10개.
- **[VSCode] 12건** — Attach Open File 설정 추가, Hooks·Permission 대화상자 저장 오보고·빈 화면·중복 훅·시크릿 유지·gitignore 처리, Windows 매핑/SUBST 드라이브 세션 이력, Active 필터, 새 채팅 전환, `CLAUDE_CONFIG_DIR` 반영, Windows 콘솔 창 깜빡임, 툴팁 지연, 토글 색상.
- **[Claude Tag] 5건** — 스레드 위주 채널에서 매시간 컨텍스트가 리셋되던 문제, 재시작 후 PR 감시 중단, 첫 메시지 삭제 시 작업 미종료, 다른 봇 대상 지시에 묶여 게시를 보류하던 문제, 참여 카드의 잘못된 사유 문구.
- **[Code Review] 4건** — 리뷰 대기 중 커밋 도착 시 미리뷰, 동일 발견 2~3회 중복 게시, 이미 해결된 보안 발견 재게시, `/ultrareview` 세션 재개 시 전체 재실행.
- **Windows PowerShell** — 임시 출력 경로가 260자에 닿으면 출력 없이 "Exit code 1" 로 실패하던 문제 수정.

## 🔑 이번 버전의 핵심 키워드
**"권한·정책 경계를 조인다"** — Bash 권한 검사 구멍 4건과 조직 정책 캐시·MCP 배타 제어를 막고, auto mode 의 인라인 셸·서브에이전트 보고·명령 단위 도메인 허용을 전부 검토 경로로 끌어들인 버전.

---

# 📜 원문 (한글 번역본)

> 원문 ChangeLog를 원래 순서 그대로 한 줄도 빠짐없이 번역한 문서입니다.

- Claude Code Remote 세션(클라우드·자체 호스팅 러너)에 fast mode 추가. 조직이 허용하는 범위에서 호스트의 fast-mode 설정 또는 세션에 입력한 `/fast` 가 적용된다
- 전체화면 모드의 `/config` 패널에 마우스 지원 추가. 휠로 설정 목록을 스크롤하고, 설정 값을 클릭해 변경하며, 포인터 아래 행이 강조된다
- `claude self-hosted-runner --drain-marker-file <path>` 추가. SIGTERM drain 시 해당 파일이 존재하면 러너가 종료를 호스트 drain 으로 서버에 보고한다(텔레메트리 전용)
- 샌드박싱이 적용된 auto mode 에서 Bash·PowerShell·Monitor 에 명령별 `allowed_domains` 추가. 명령이 필요로 하는 호스트를 명령과 함께 검토해 그 명령에만 열어주고, 다른 호스트는 거부한다
- agent frontmatter 와 `--agents` JSON 에 `omitClaudeMd` 추가. 커스텀·플러그인 서브에이전트가 user·project·local CLAUDE.md 없이 실행된다. 관리형 정책 파일은 여전히 로드된다
- `claude plugin install` 과 `claude plugin update` 에 `--accept-command <sha256>` 추가. `-y` 대신, 이전 `--json` 실행이 표시한 바로 그 명령만 정확히 수락한다
- `modelPricing` 관리형 설정과 Claude apps 게이트웨이 `pricing` 블록에서 1 초과 10 이하의 `multiplier` 지원 추가. 마크업된 내부 사내 정산 단가용
- Bedrock·Vertex AI·Foundry·LLM 게이트웨이 사용자에게 Claude 데스크톱 앱을 안내하는 스피너 팁 추가. claude.ai 데스크톱 앱 팁은 이제 `/desktop` 을 제안하며, 이 명령이 앱 다운로드를 제안한다
- 계정·조직·API 키를 전환한 뒤에도 캐시된 조직 정책이 재사용되고, 세션 중 자격 증명이 바뀌어도 매시 점검 전까지 정책이 갱신되지 않던 문제 수정
- 조직 정책이 시작 후 로드 완료되거나 세션 중 변경될 때 도구·명령 목록이 갱신되지 않던 문제 수정
- 읽기·파싱할 수 없는 엔터프라이즈 `managed-mcp.json` 이 무시되던 문제 수정. 이제 배타적 MCP 제어를 유지하며(user·project·plugin 서버가 로드되지 않음) 시작 시 경고한다
- `ANTHROPIC_UNIX_SOCKET` 으로 설정한 서드파티 로컬 프록시를 통해 조직 정책을 가져오다 거부되던 문제 수정. 다시 다른 커스텀 게이트웨이와 동일하게 취급되며 Remote Control 도 포함된다
- 세션의 워커가 재시작된 뒤 워크플로·에이전트 승인이 적용되면 클라우드 세션이 모든 서브에이전트 도구 호출을 거부("updatedInput … failed schema validation")하던 문제 수정
- 조직이 fast mode 를 비활성화한 경우 `/fast off` 가 fast mode 를 끄지 않고 "Fast mode unavailable" 이라고 답하던 문제 수정
- `CLAUDE_CODE_SKIP_FAST_MODE_ORG_CHECK` 로 시작한 세션이 API 의 fast mode 거부 이후에도 매 턴 fast 요청을 재전송하던 문제 수정. 이제 거부가 유지되고 그 사유가 표시된다
- `CLAUDE_CODE_RETRY_WATCHDOG` 하의 fast mode 가 사용량 크레딧 한도에서 턴을 실패시키거나 과부하를 fast 속도로 재시도하던 문제 수정. 이제 표준 속도로 폴백한다
- `fmt`·`column` 등의 명령이 읽는 파일이 검사기가 인식하지 못하는 옵션 뒤에 올 때 Bash 권한 검사가 이를 놓치던 문제 수정
- 와일드카드가 명령의 패턴이나 옵션 값 안에 있을 때(예: `grep -v dir/* file`) Bash 권한 검사가 와일드카드가 확장하는 파일을 건너뛰던 문제 수정
- 셸 변수 선언 플래그가 실행 중인 명령을 잘못 표현할 수 없도록 Bash 권한 검사 수정
- 디렉터리 변경이 두 번이거나 서브셸, 또는 `cd`+`git` 체인이 있는 Bash 명령이 bypass·auto mode 에서 `permissions.blockReadsOutsideWorkingDirectories` 아래 프롬프트를 건너뛰던 문제 수정
- 샌드박스 명령이 시작에 실패한 뒤 남은 `.git/config.lock` 이 세션 내내 `git checkout -b`·`git push -u`·`git config` 를 깨뜨리던 문제 수정(Linux)
- 시스템 파일 이벤트 서비스가 포화된 macOS 머신에서 세션 외부의 설정 파일 변경이 감지되지 않던 문제 수정. 이제 워처가 폴링으로 폴백한다
- 모든 도구가 MCP 서버에서 오는 재개된 `claude -p` 세션이 "At least one tool must have defer_loading=false" 로 실패하던 문제 수정
- LLM 게이트웨이가 비스트리밍 응답을 `text/plain` 으로 반환할 때 턴이 "API returned an empty or malformed response" 로 실패하던 문제 수정
- MCP 서버가 `list_changed` 알림을 촘촘히 반복 전송할 때 지속적인 높은 CPU 사용과 도구 목록 요청 반복이 발생하던 문제 수정
- MCP OAuth 의 클라이언트 등록 오취급 수정. 동의를 거부하면 새 등록을 강제하고, 다른 리다이렉트 URI 의 등록을 재사용하며, 동시 쓰기가 유효한 등록을 삭제하거나 불일치 등록을 유지할 수 있던 문제
- Claude 가 MCP 도구를 전체 이름 `mcp__server__tool` 대신 짧은 이름으로 선택할 때 도구 검색이 매칭에 실패하던 문제 수정
- Ctrl+O 가 대기 중인 MCP 서버 재연결을 취소하고, 트랜스크립트 뷰가 열린 상태에서 Remote Control 로 보낸 `/mcp` 가 실패하던 문제 수정
- ToolSearch 를 사용할 수 없을 때도 Claude in Chrome 프롬프트가 모델에게 ToolSearch 로 도구를 로드하라고 지시하던 문제 수정
- 수신 세션의 권한 모드 정책에 보류된 세션 간 메시지가 아무 흔적도 남기지 않던 문제 수정. headless 발신자는 이제 전달 통지를 받고, `SendMessage` 결과가 메시지가 읽혔음을 암시하지 않는다
- 대화 압축(compact) 이후에도 여전히 실행 중이던 백그라운드 명령(watch 태스크·dev 서버 등)을 Claude 가 두 번째로 시작하던 문제 수정
- 대화가 실제로 실행된 모델로 다시 전환할 때 `/model` 이 대화 캐시 손실을 경고하던 문제 수정
- `/cd` 이후 `/reload-skills` 가 슬래시 메뉴와 맞지 않는 스킬 수를 보고하던 문제 수정
- 짧은 터미널의 전체화면 모드에서 `/resume`·`/continue` 가 세션을 1~2개만 표시하던 문제 수정
- `/resume`·`/teleport` 가 이전 대화의 파일 읽기 추적을 유지해, 재개된 대화가 읽은 적 없는 파일을 Claude 가 편집할 수 있던 문제 수정
- 재개한 세션의 모델 계열이 설정된 기본 모델과 다를 때 `--resume` 이 1M 컨텍스트 창(`[1m]`)을 잃던 문제 수정
- `/artifacts` 로 첨부한 아티팩트가 `--resume` 이후 세션에서 사라지던 문제 수정
- 백그라운드 세션(`claude --bg`, `claude agents`)이 자신이 게시한 아티팩트의 외부 재게시를 감시하지 않던 문제 수정
- inode 0 을 보고하는 가상 드라이브(Windows 드라이브로 마운트된 암호화 볼트 등)에서 첫 번째를 제외한 커스텀 에이전트·슬래시 명령·출력 스타일이 로드되지 않던 문제 수정
- 호스트 설정 디렉터리가 64MiB 를 넘을 때 자체 호스팅 러너 세션이 모든 호스트 설정(설정·스킬·플러그인·MCP 서버)을 조용히 잃던 문제 수정. `--host-config-snapshot disk|memory` 추가
- 로그아웃 후에도 claude.ai 에서 동기화된 스킬이 디스크에 무기한 남던 문제 수정. `cleanupPeriodDays` 안에 갱신되지 않은 사본은 다음 실행 시 복구 가능한 휴지통으로 이동한다
- 스피너 팁이 계정 유형에 제공되지 않거나 세션에서 비활성화된 명령을 제안하던 문제 수정
- `/add-dir` 경로 입력 수정. 좌우 방향키가 커서를 이동하고, Enter 는 강조된 자동완성까지 추가하지 않고 입력한 경로만 추가한다
- 메인 프롬프트 외 텍스트 필드가 선행 `!` 를 입력 끝으로 옮기던 문제 수정(`!foo` 가 `foo!` 로 나옴)
- 훅 매처 이름이 `__proto__`·`constructor` 같은 상속된 객체 속성일 때 대화형 `/hooks` 메뉴가 죽던 문제 수정
- 텍스트를 둘러싼 박스가 배경을 잃은 뒤에도 텍스트가 오래된 배경색을 유지하던 전체화면 렌더링 결함 수정
- 연결된 백그라운드 세션에서 st 의 Delete 키와 rxvt-unicode 의 Alt+방향키가 동작하지 않던 문제 수정
- Claude Code 가 종료·중단되거나 시작 직후 에디터를 열 때 터미널의 기능 질의 응답(`^[[?1;2c`)이 셸 프롬프트나 에디터에 나타나던 문제 수정
- 터미널 렌더링 성능 개선. 큰 diff 와 긴 트랜스크립트가 더 빠르게 렌더되고 느린 프레임이 줄었다
- 매 실행 시 내장 모델 데이터의 중복 검증을 건너뛰어 시작 시간이 소폭 개선
- 훅 피드백 개선. SessionStart·UserPromptSubmit·PreToolUse·SessionEnd 훅이 실행되는 동안 스피너가 경과 시간과 함께 이를 알리고, SessionStart 훅을 기다리는 프롬프트는 Esc 로 취소된다
- 긴 사고 중 스피너 상태 개선. 45초 후 "deep in thought" 로 표시되고, 출력 토큰 한도에서 복구하는 동안 "picking the thought back up" 을 보여준다
- 동적 워크플로 개선. 사용량 한도에 도달하면 해당 에이전트를 버리는 대신 일시정지하고 한도가 리셋되면 자동으로 계속한다
- 불안정한 네트워크에서 설정이 실패할 때 claude.ai 에 빈 세션을 덜 남기도록 Remote Control 개선
- 브라우저에 연결할 수 없을 때 클라우드 세션의 Claude in Chrome 메시지 개선. 설치를 제안하기 전에 컴퓨터가 절전 상태일 수 있다고 알린다
- `claude mcp serve` 개선. 실행 중인 도구 호출이 30초마다 진행 상황을 전송해, 클라이언트가 실행 중임을 표시하고 아무것도 출력하지 않는 긴 명령이 유휴 타임아웃으로 중단되지 않는다
- Foundry·Claude Platform on AWS 세션 개선. 대화 도중 연결이 완료된 `alwaysLoad` MCP 서버를 도구 검색 왕복 없이 다음 턴에 바로 사용할 수 있다
- 아티팩트로 게시한 Markdown 파일 개선. 이제 스타일이 적용된 문서 페이지(제목 헤더·문서 타이포그래피·구문 강조 코드)로 렌더된다
- Artifact 도구 게시 오류 개선. 파일 없이 게시하면 먼저 페이지를 파일로 작성하라고 안내하고, 지원하지 않는 파일 형식은 파비콘 누락보다 먼저 보고된다
- 페이지가 계약 버전에 없는 capability 를 선언했을 때의 Artifact 도구 오류 개선. 지원되는 capability 를 모두 나열하고, 더 최신 계약 버전에 그것이 있는지 알린다
- 아티팩트 감시 개선. 한 세션이 외부 재게시를 감시할 수 있는 게시 아티팩트가 5개에서 10개로 늘었다
- PDF @-멘션 개선. pdfinfo 가 페이지 수를 셀 수 없을 때 파일 크기로 추정한 페이지 수 대신 "page count unknown" 으로 표시한다
- `/mobile` 개선. claude.ai/mobile 용 QR 코드 하나만 표시하며, 이 코드가 사용자의 폰에 맞는 앱스토어를 연다
- auto mode 변경. 스킬·슬래시 명령의 인라인 `!` 셸 명령이 분류기 대신 기본 모드 권한 규칙을 따르고, 어떤 규칙도 결정하지 못하는 명령은 검토되는 도구 호출로 실행된다
- auto mode 변경. 서브에이전트가 마지막 메시지를 사후 검토받는 대신, 안전 분류기가 검토하는 전용 hand-back 호출로 호출자에게 보고한다
- Monitor watch 변경. 항상 마감 시한(최대 30분, 단일 프롬프트 `-p` 실행은 10분)을 가지며 재무장하도록 Claude 에게 알린다. 타임아웃 없는 `persistent` 옵션을 대체한다
- 프롬프트의 IDE 선택 표시를 `[⧉ …]` 알약 형태로 변경. 여러 줄 프롬프트를 압축하지 않고 텍스트와 함께 줄바꿈되며, Backspace 로 지우면 선택이 제외된다
- 기본 동적 워크플로 크기를 Pro 플랜에서 small 로 변경하고, medium 크기 가이드라인을 15에서 10 에이전트로 하향
- Claude apps 게이트웨이·Bedrock·Vertex AI·Foundry 세션이 해당 세션에서 사용하지 않는 잔여 claude.ai 로그인을 더 이상 갱신하지 않도록 변경
- 번들된 `claude-api` 스킬 업데이트. 스트리밍 커스텀 도구에서 `eager_input_streaming` 을 활성화하고, 산출물 형태의 Managed Agents 작업을 `user.define_outcome` 으로 시작한다
- [VSCode] Attach Open File 설정 추가. 끄면 열린 파일이 메시지에 추가되지 않는다. 선택한 텍스트는 계속 첨부된다
- [VSCode] Hooks·Permission rules 대화상자가 성공한 저장을 실패로 보고하던 문제, 플러그인 전용 정책 잠금에서 Hooks 대화상자가 비어 보이거나 저장 오류에 색상 코드가 나타나던 문제 수정
- [VSCode] Hooks 대화상자 저장 수정. 교체 시 훅이 중복되지 않고, 헤더 이름을 다른 대소문자로 다시 입력해도 시크릿이 유지되며, 저장이 반환되기 전에 settings.local.json 이 gitignore 된다
- [VSCode] 워크스페이스가 Windows 매핑 네트워크 드라이브나 SUBST 드라이브에 있을 때 세션 이력이 현재 세션만 표시하던 문제 수정
- [VSCode] 필터 메뉴에서 Open 도 체크된 경우 세션 목록의 Active 필터가 열린 유휴 세션을 숨기던 문제 수정
- [VSCode] 세션 목록이 새로고침될 때 새 채팅이 이전 채팅으로 되돌아가던 문제 수정
- [VSCode] `environmentVariables` 설정에서 `CLAUDE_CONFIG_DIR` 이 바뀐 뒤에도 열린 탭과 사이드바가 창을 다시 로드할 때까지 이전 설정 폴더를 유지하던 문제 수정
- [VSCode] 확장이 git·ripgrep·로그인 상태 확인 같은 백그라운드 명령을 실행할 때 Windows 에서 콘솔 창이 깜빡이던 문제 수정
- [VSCode] 프롬프트 캐시 시계의 호버 텍스트가 지연 후에야 나타나고, 자동 압축 아이콘이 팝업 옆에 브라우저 자체 툴팁을 표시하던 문제 수정
- [VSCode] Hooks 대화상자 개선. 설정 파일 자체 때문에 저장이 거부되면 "Open settings file" 버튼과 "Copy error" 뒤의 사유가 담긴 팝업이 열린다
- [VSCode] 토글 스위치의 켜짐 상태 색상을 Claude 오렌지에서 에디터 테마의 버튼 색상으로 변경
- [Claude Code on the web] 클라우드 세션의 프로세스가 종료됐는데도 세션이 살아 있는 것처럼 보이며 응답까지 약 10분이 걸리던 문제 수정. 이제 메시지를 보내면 즉시 재시작된다
- [Claude Code on the web] claude.ai/code 의 Routines 페이지를 Yours·Templates 탭과 실행 상태를 보여주는 2열 루틴 카드의 새 레이아웃으로 변경하고 캘린더 뷰 제거
- [Claude Code on the web] 관리자 설정의 Cloud environments 편집기에 Custom network access 옵션 추가. claude.ai/code 의 환경 대화상자가 제공하는 것과 같은 허용 도메인 목록을 사용한다
- [Claude Code on the web] Cloud environments 관리자 페이지 개선. Claude Tag 와 Claude Code 의 기본 환경을 변경 링크와 함께 표시하고, 생성 권장 종류를 표시한다
- [Claude Tag] 대화가 대부분 스레드에서 이뤄지는 채널에서 Claude 가 활성 상태를 유지하다 약 한 시간마다 작업 컨텍스트를 잃던 문제 수정. 이제 스레드 활동이 리셋을 막는다
- [Claude Tag] Claude 에게 풀 리퀘스트를 감시하라고 요청한 스레드가 Claude 재시작 이후 CI 실패·코멘트·리뷰를 더 이상 전달받지 못하던 문제 수정
- [Claude Tag] Claude 가 이미 답한 스레드의 첫 메시지를 삭제해도 그곳의 작업이 종료되지 않던 문제 수정. 이제 답글 없는 메시지를 삭제했을 때처럼 중단된다
- [Claude Tag] 다른 봇·어시스턴트를 향한 앞선 지시 때문에 Claude 가 게시를 보류하던 문제 수정. Claude 를 향한 지시만 구속력이 있고, 불확실하면 묻는다
- [Claude Tag] 붐비는 채널에 참여할 때 Claude 가 게시하는 응답 모드 카드가, 채널이 단지 활발하거나 클 뿐인데도 "자동화된 게시물이 많이 보인다" 고 말하던 문제 수정. 이제 카드가 실제 사유를 명시한다
- [Claude Tag] Claude Tag 관리자 설정의 Environment 선택기 개선. 옵션에 Anthropic-hosted 또는 self-hosted 라벨이 붙고, 해당 환경을 편집하거나 새로 만드는 링크가 제공된다
- [Code Review] PR 당 한 번 리뷰하는 저장소에서 리뷰가 시작을 기다리는 동안 커밋이 도착하면 간혹 리뷰가 이뤄지지 않던 문제 수정. 이제 요청된 커밋을 리뷰한다
- [Code Review] GitHub 이 실제로 생성된 리뷰에 대해 오류를 보고할 때 Code Review 가 같은 발견을 두세 번 게시하던 문제 수정
- [Code Review] 이후 푸시가 발견이 고정된 줄을 옮겼을 때, 사람이 이미 해결한 보안 발견을 후속 리뷰가 다시 게시하던 문제 수정
- [Code Review] Claude 앱에서 완료된 /ultrareview 클라우드 세션을 다시 열면 요청 없이 리뷰 전체가 처음부터 다시 시작되던 문제 수정
- Windows: 세션의 임시 출력 경로가 260자에 도달하면 PowerShell 명령이 출력 없이 "Exit code 1" 로 실패하던 문제 수정

---

## 🎯 챌린지

이번 버전에서 내 환경에 적용해볼 만한 항목입니다.

### 1. EOS-H5 서브에이전트에 `omitClaudeMd` 검토 적용
- **파일**: `/Users/leeseonro/.claude/agents/` (또는 프로젝트 `.claude/agents/*.md` frontmatter)
- **근거**: 이번 버전에 agent frontmatter `omitClaudeMd` 가 추가됐다. EOS-H5 는 루트 `CLAUDE.md` 가 길고 레포마다 자체 `CLAUDE.md` 가 또 있어 서브에이전트마다 수천 토큰이 중복 주입된다. 순수 검색·조회용 서브에이전트(Explore 류)에만 `omitClaudeMd: true` 를 켜면 컨텍스트를 아낄 수 있다. 단, 라이브 접근 규칙이 CLAUDE.md 에만 있으므로 **라이브에 닿는 에이전트에는 절대 켜지 않는다.**
- **난이도**: ★★☆ (약 15분)

### 2. `deploy-guard.sh` 훅을 Bash 권한 검사 수정과 대조
- **파일**: `/Users/leeseonro/.claude/hooks/deploy-guard.sh`
- **근거**: 이번 버전은 Bash 권한 검사에서 `cd`+`git` 체인·서브셸·와일드카드 확장·변수 선언 플래그 위장을 놓치던 구멍 4건을 막았다. 같은 우회 패턴(`cd /repo && git push origin feat/x`, 서브셸 `(git push …)`)이 `deploy-guard.sh` 의 `feat/*` 차단도 뚫는지 직접 확인하고 매처를 보강한다. feature 브랜치 원격 push 금지가 이 훅 하나에 걸려 있다.
- **난이도**: ★★☆ (약 20분)

### 3. 훅 스피너 피드백 확인 후 Stop 훅 정리
- **파일**: `/Users/leeseonro/.claude/settings.json` (`hooks.Stop`)
- **근거**: 이번 버전부터 SessionStart·PreToolUse 훅 실행 중 스피너가 경과 시간을 보여준다. 현재 Stop 훅은 `osascript` 알림뿐이라 실행 흔적이 안 보이는데, PreToolUse 의 `deploy-guard.sh` 가 얼마나 걸리는지 이제 화면에서 바로 확인 가능하다. 실제 지연을 재보고 느리면 훅을 가볍게 다듬는다.
- **난이도**: ★☆☆ (약 10분)

### 4. 동적 워크플로 크기 가이드라인 재확인
- **파일**: `/Users/leeseonro/.claude/settings.json`
- **근거**: medium 가이드라인이 15 → 10 에이전트로 낮아졌다. 현재 `effortLevel: "xhigh"` + `skipWorkflowUsageWarning: true` 로 경고가 꺼져 있어, 대규모 fan-out 이 의도보다 커질 때 알아채기 어렵다. `/config` 의 Dynamic workflow size 값을 확인하고 EOS-H5 작업 규모(보통 병렬 3~5개)에 맞춰 small 로 낮춘다.
- **난이도**: ★☆☆ (약 5분)
