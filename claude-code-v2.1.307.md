# Claude Code v2.1.307

> 작성일: 2026-10-22

---

# 📋 요약본

## 🎉 신기능 (4건)
- **`/claude-api api-version` 추가** — Claude API를 쓰는 코드를 API 버전 `2026-10-21`로 옮겨 준다.
- **`claude_code.safety_event` OpenTelemetry 이벤트 추가** — 도구 호출이 막히거나, 확인을 요청하거나, 되돌려 보내질 때마다 이벤트를 하나씩 남긴다.
  - 기록 대상은 권한 규칙, auto mode, 안전 검사, hook, sandbox가 개입한 경우다.
- **[VSCode] 음성 받아쓰기 자동 종료 안내** — 받아쓰기가 저절로 멈추면 마이크 버튼에 이유를 보여 준다.
  - 멈추는 조건은 15초 동안 인식된 말이 없을 때와 2분 한도에 닿았을 때다. 그때까지 받아 적은 글자는 남는다.
- **[Code Review] `@claude review stop` 추가** — `@claude review always` 구독을 새 리뷰 없이 끝낸다. `off`, `pause`로도 쓸 수 있다.

## 🛠️ 개선/수정 (19건)
- **`[1m]` 모델 별칭 오류 수정** — `CLAUDE_CODE_DISABLE_1M_CONTEXT`가 켜진 상태에서 `opus[1m]` 같은 별칭을 쓰면 model-not-found로 요청이 실패하던 문제를 고쳤다.
- **`prompt-caching-scope` beta header 전송 중단** — 효과가 없는 환경(커스텀 `ANTHROPIC_BASE_URL` gateway, Foundry)에서는 이 헤더를 더 이상 보내지 않는다.
- **MCP 안정성 수정**
  - macOS에서 로그인 keychain(암호 보관함)이 잠겨 있으면 `claude -p`의 MCP 서버가 "needs authentication"으로만 표시됐다. 이제 이유를 알려 주고, 잠금을 푼 뒤 다음 실행에서는 다시 로그인하지 않아도 연결된다.
  - MCP 서버가 연결되는 도중 컴퓨터가 잠들면 timeout으로 처리되고, headless 실행에서는 실패 상태로 남던 문제를 고쳤다.
  - HTTP MCP 연결이 호출 도중 끊기면 같은 도구 호출이 두 번 전송되던 문제를 고쳤다. 이제 읽기 전용이거나 여러 번 실행해도 결과가 같은 도구만 재시도한다.
  - background task가 실행 중이면 턴이 SDK MCP 서버의 최신 도구 목록 없이 시작되던 문제를 고쳤다.
- **Autocompact 수정** — PDF·이미지 등 큰 결과를 많이 읽은 턴에서 나던 "Autocompact is thrashing" 오류 일부를 고쳤다. 클라우드 세션을 재시작하면 `/autocompact` 설정이 기본값으로 돌아가던 문제도 고쳤다.
- **`/clear` 내용 부활 수정** — 클라우드·self-hosted runner 세션이 재시작될 때 `/clear`로 지운 대화가 되살아나던 문제를 고쳤다.
- **Claude apps gateway 세션 수정** — `CLAUDE_STREAM_FIRST_BYTE_TIMEOUT_MS`가 무시되던 문제를 고쳤다. `OTEL_EXPORTER_OTLP_HEADERS`를 설정하면 Desktop 세션의 telemetry가 거부되던 문제도 고쳤다.
- **`/permissions` > Recently denied 수정** — 거부된 shell 명령이 목록에 보인다. auto mode의 로컬 분류기는 이 목록에서 승인한 내용을 재시도된 명령에 반영한다. 승인 행에는 명령의 설명 대신 명령 자체가 표시된다.
- **`/help` 설명 정리** — `/claude-api` 같은 기본 스킬이 `/help`와 `/` 메뉴에서 모델용 긴 설명 대신 짧은 설명으로 보인다.
- **서브에이전트·SDK 수정**
  - 스트리밍 응답에서 서브에이전트 기록에 임시 토큰 사용량과 빈 stop reason이 남던 문제를 고쳤다.
  - API의 모델 확인이 5초를 넘으면 `setModel()` 모델 전환이 거부되던 문제를 고쳤다. 이제 최대 15초까지 기다린다.
- **백그라운드 명령 중지 안내 수정** — 연결된 앱이 멈춘 명령을 사용자가 멈춘 것으로 보고하지 않는다. 안내에는 출력 파일 이름이 들어간다.
- **데스크톱·클라우드 도구 오류 수정**
  - Cowork 클라우드 세션의 WebFetch는 4xx 응답이나 robots.txt 거부를 도구 오류가 아닌 일반 결과로 처리한다.
  - 직접 설정한 GitHub MCP 서버의 쓰기 도구 폼이 아무것도 만들지 않고 닫히던 문제를 고쳤다.
  - Artifact 도구 읽기가 connection reset으로 실패하던 문제를 고쳤다.
- **Self-hosted runner 수정·변경**
  - 이전 세션이 남긴 `.claude/settings.local.json`이 커밋되던 문제를 고쳤다.
  - checkout hook 실행 중에 세션을 정리하거나 runner를 멈추면 hook 프로세스와 runner 슬롯이 남던 문제를 고쳤다.
  - checkout hook은 기본 30분 뒤 멈춘다. 늘리려면 `--checkout-hook-timeout-min`을 쓴다.
  - 인증서 필터링 방식을 CLI와 맞췄다.
- **잘못된 도구 호출 복구 개선** — 해석할 수 없는 도구 호출은 최대 2회 재시도한 뒤에 오류로 끝낸다.
- **fork 서브에이전트 개선** — 함께 띄운 fork마다 자기 몫이 어느 것인지 알려 준다. 서로의 작업을 대신 시작하는 일이 크게 줄어든다.
- **로그인·검색·응답 속도 개선**
  - 브라우저 로그인 성공 화면이 계정 정보를 기다리지 않고 바로 뜬다.
  - 클라우드에서 웹 검색이 403으로 거부되면 실제 이유를 보여 준다.
  - 데스크톱 앱의 MCP가 연결되지 않아도 클라우드 세션의 첫 응답이 빨라졌다.
  - 큰 이미지나 PDF가 들어 있는 세션에서 Remote Control 연결이 빨라졌다.
- **WebSearch 예산 소진 안내 강화** — 예산을 다 쓰면 브라우저나 computer use로 검색엔진을 쓰는 것도 금지한다고 Claude에게 알린다.
- **`axScreenReader` 적용 범위 축소** — 이 설정과 `CLAUDE_AX_SCREEN_READER`는 user, managed, `--settings` 설정에서만 적용된다.
- **[VSCode] 수정·변경**
  - 펼친 긴 프롬프트는 패널의 40%까지만 차지하고 스크롤된다.
  - LaTeX가 든 목록 항목이나 표 셀을 붙여넣으면 새 목록이나 표로 붙던 문제를 고쳤다.
  - TLS 검사 프록시 뒤에서 받아쓰기가 실패하던 문제를 고쳤다.
  - "still open somewhere else" 안내가 확장 재시작 후 남은 프로세스도 다룬다.
  - 받아쓰기와 확장 자체 요청의 인증서 처리를 CLI와 맞췄다.
- **[Cloud sessions] UI 수정** — 저장소 검색 중에는 "Searching…"을 보여 준다. "Waiting for a runner" 상태가 잘리지 않고, 대기 시간과 실패 횟수를 보여 준다.

## 🔑 이번 버전의 핵심 키워드
**"막힌 도구 호출을 기록하고, MCP 연결을 단단하게"** — 무엇이 도구 호출을 막았는지 telemetry로 남기고, headless 환경과 MCP의 실패 원인을 줄인 안정화 릴리스다.

---

# 📜 원문 (한글 번역본)

> 원문 ChangeLog를 원래 순서 그대로 한 줄도 빠짐없이 번역한 문서입니다.

- Claude API 코드를 API 버전 `2026-10-21`로 옮기는 `/claude-api api-version` 추가
- 권한 규칙, auto mode, 안전 검사, hook, sandbox가 도구 호출을 막거나 확인을 요청하거나 되돌려 보낼 때마다 발생하는 `claude_code.safety_event` OpenTelemetry 이벤트 추가
- `CLAUDE_CODE_DISABLE_1M_CONTEXT`가 설정되고 모델이 `opus[1m]`처럼 `[1m]` 접미사가 붙은 별칭일 때 요청이 model-not-found 오류로 실패하던 문제 수정
- 커스텀 `ANTHROPIC_BASE_URL` gateway 뒤와 Foundry에서 효과가 없는 `prompt-caching-scope` beta header가 전송되던 문제 수정
- macOS에서 로그인 keychain이 잠긴 동안 `claude -p`의 MCP 서버가 "needs authentication"으로 표시되던 문제 수정. 이제 이유를 알려 주며, 잠금 해제 후 다음 실행에서는 새로 로그인하지 않아도 연결된다
- MCP 서버가 연결되는 동안 macOS나 Linux 컴퓨터가 잠들면 timeout으로 보고되고 headless 실행에서는 실패 상태로 남던 문제 수정
- 호출 도중 연결이 닫히면 HTTP MCP 도구 호출이 두 번 전송되던 문제 수정. 이제 read-only 또는 idempotent 도구만 재시도한다
- background task가 실행 중일 때 턴이 SDK MCP 서버의 최신 도구 없이 시작되는 경우가 있던 문제 수정
- PDF 페이지, 이미지 등 큰 도구 결과를 많이 읽는 턴에서 발생하던 "Autocompact is thrashing" 오류 일부 수정
- 클라우드 세션에서 세션 재시작 후 `/autocompact`가 기본 윈도로 돌아가던 문제 수정
- 클라우드 또는 self-hosted runner 세션이 재시작될 때 `/clear`로 지운 대화가 되살아나는 경우가 있던 문제 수정
- Claude apps gateway 세션에서 `CLAUDE_STREAM_FIRST_BYTE_TIMEOUT_MS`가 무시되던 문제 수정
- `OTEL_EXPORTER_OTLP_HEADERS`가 설정되었을 때 Claude apps gateway 뒤의 Claude Desktop 세션 telemetry가 거부되던 문제 수정
- `/permissions` > Recently denied에 거부된 shell 명령이 표시되지 않고, auto mode의 로컬 분류기가 재시도된 명령을 검사할 때 그곳에서 한 승인을 무시하던 문제 수정. 행을 승인하면 이제 명령의 설명이 아닌 명령 자체가 표시된다
- `/help`와 `/` 명령 메뉴에서 `/claude-api` 같은 기본 스킬이 짧은 설명 대신 모델용 긴 설명으로 표시되던 문제 수정
- 스트리밍 응답에서 서브에이전트 기록에 임시 토큰 사용량과 빈 stop reason이 기록되던 문제 수정
- API의 모델 확인이 5초를 넘으면 Agent SDK의 `setModel()`과 이를 기반으로 한 앱의 모델 전환이 거부되던 문제 수정. 이제 최대 15초까지 기다린다
- 연결된 앱(예: 데스크톱 앱이 유휴 세션을 보관 처리하는 경우)이 멈춘 background 명령이 사용자가 멈춘 것으로 Claude에게 보고되던 문제 수정. 이제 안내에 출력 파일 이름이 들어간다
- Cowork 클라우드 세션에서 사이트가 4xx 상태나 robots.txt 거부로 응답하면 WebFetch가 도구 오류를 보고하던 문제 수정. 이제 로컬 세션처럼 일반 결과로 처리된다
- 데스크톱 앱 Code 탭에서 직접 설정한 GitHub MCP 서버의 쓰기 도구가 아무것도 만들지 않고 닫히는 폼을 보여 주던 문제 수정
- 서버가 재사용된 연결을 닫았을 때 Artifact 도구 읽기가 connection reset으로 실패하던 문제 수정
- Self-hosted runner: `--use-anthropic-git-proxy`를 쓰는 세션이 이전 세션이 clone에 남긴 `.claude/settings.local.json`을 커밋하던 문제 수정
- Self-hosted runner: checkout hook 실행 중에 세션을 보관 처리하거나 다시 대기열에 넣거나 runner를 멈추면 hook 프로세스가 계속 실행되고 runner 슬롯이 점유된 채로 남던 문제 수정
- 해석할 수 없는 도구 호출의 복구 개선: Claude Code는 이제 오류로 턴을 끝내기 전에 호출을 최대 두 번 재시도한다
- 함께 실행한 fork 서브에이전트 개선: 각 fork에 어느 실행이 자기 것인지 알려 주어, fork가 서로의 작업을 시작하려 할 가능성이 크게 줄었다
- 브라우저 로그인 개선: 계정 프로필 로드를 기다리지 않고 로그인이 끝나는 즉시 성공 페이지가 표시된다
- 클라우드 및 self-hosted runner 세션의 웹 검색 오류 개선: 이유가 담긴 403으로 검색이 거부되면 일반적인 "Authentication error" 대신 그 이유를 보여 준다
- 데스크톱 앱의 MCP 서버 중 하나가 연결되지 않을 때 클라우드 세션의 첫 응답 시간 개선
- 기록에 큰 붙여넣은 이미지나 PDF 읽기가 포함된 세션의 Remote Control 연결 시간 개선
- WebSearch 예산을 다 썼을 때 Claude가 받는 안내에 브라우저나 computer use로 검색엔진을 조회하지 말라는 내용을 추가
- `axScreenReader` 설정과 settings `env` 블록의 `CLAUDE_AX_SCREEN_READER`가 user, managed, `--settings` 설정에서만 적용되도록 변경 (2.1.305부터)
- Self-hosted runner: checkout hook이 기본적으로 30분 뒤 중지되어 세션 setup이 실패하도록 변경. 더 오래 걸린다면 `--checkout-hook-timeout-min`을 늘리거나 `0`으로 설정한다
- Self-hosted runner: Anthropic 관리 git용으로 만드는 인증서 파일이 CLI와 같은 방식으로 신뢰 인증서를 필터링하도록 변경. `[runner:warn]` 줄에 제외된 인증서 수가 표시된다
- [VSCode] 음성 받아쓰기가 스스로 멈출 때(인식된 말 없이 15초 경과 또는 2분 한도) 마이크 버튼에 이유와 지금까지의 텍스트가 유지된다는 안내 추가
- [VSCode] Show more로 펼친 긴 프롬프트가 채팅 패널 전체를 덮던 문제 수정. 고정된 프롬프트는 이제 패널의 40%까지만 차지하고 스크롤된다
- [VSCode] LaTeX 수식이 든 목록 항목이나 표 셀의 일부가 rich text 편집기에서 새 목록이나 표로 붙여넣어지던 문제 수정
- [VSCode] `NODE_EXTRA_CA_CERTS`가 `~/.claude/settings.json`에만 설정된 경우 TLS 검사 프록시 뒤에서 받아쓰기가 실패하던 문제 수정. 이제 `CLAUDE_CODE_CERT_STORE`도 따른다
- [VSCode] "still open somewhere else" 안내가 확장 재시작 후 남은 Claude 프로세스도 다루도록 변경. 이런 프로세스는 보통 10분 안에 스스로 종료된다
- [VSCode] 음성 받아쓰기가 CLI와 같은 방식으로 신뢰 인증서를 필터링하도록 변경
- [VSCode] 확장 자체 요청이 CLI와 같은 방식으로 신뢰 인증서를 필터링하고, 환경이나 user settings에 지정된 `NODE_EXTRA_CA_CERTS` 파일을 신뢰하도록 변경
- [Cloud sessions] 검색이 아직 진행 중인데 저장소 선택기가 "No repositories match"로 표시되던 문제 수정. 이제 결과가 올 때까지 "Searching…"을 보여 준다
- [Cloud sessions] self-hosted 환경의 "Waiting for a runner" 상태가 잘리던 문제 수정. on-demand runner에서는 마지막 메시지부터 시간을 세고 실패한 시도를 보여 준다
- [Code Review] Code Review에 `@claude review stop`(`off`, `pause`도 가능) 추가. 새 리뷰를 시작하지 않고 pull request의 `@claude review always` 구독을 끝낸다

---

## 🎯 챌린지

이번 버전에서 내 환경에 적용해볼 만한 항목입니다.

### 1. deploy-guard 차단 기록을 telemetry로 남기기
- **파일**: `~/.claude/settings.json`
- **근거**: 새 `claude_code.safety_event`는 hook이 도구 호출을 막을 때마다 이벤트를 남긴다. 지금 쓰는 `deploy-guard.sh` PreToolUse hook이 `feat/*`·`fix/*` push를 막은 기록이 여기에 해당한다. `env`에 `CLAUDE_CODE_ENABLE_TELEMETRY=1`과 logs exporter(예: `OTEL_LOGS_EXPORTER=console`)를 넣으면 차단 이력을 확인할 수 있다. auto mode가 막은 기록도 함께 남는다.
- **난이도**: ★★☆ (약 15분)

### 2. 체인지로그 자동 동기화 cron에서 MCP 로드 끄기
- **파일**: `~/.claude/skills/claude-changelog-sync/` 안의 `claude -p` 호출 스크립트 (경로 추정, 확인 필요)
- **근거**: 이번 버전은 headless(`claude -p`) 실행의 MCP 실패를 고쳤다. 대상은 macOS keychain 잠금과 연결 중 절전이다. 매일 08:00 cron은 화면 잠금이나 절전 상태에서 돌 가능성이 높다. 이 작업에는 figma·Notion 같은 MCP가 필요 없으므로 `--strict-mcp-config`로 MCP를 아예 불러오지 않으면 같은 종류의 실패를 막을 수 있다.
- **난이도**: ★☆☆ (약 10분)
