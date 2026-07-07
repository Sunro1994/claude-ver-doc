# Claude Code v2.1.196

> 작성일: 2026-07-01

---

# 📋 요약본

## 🎉 신기능 (3건)
- **조직 기본 모델** — 관리자가 조직 콘솔에서 기본 모델을 지정한다. 직접 모델을 고르지 않은 경우 `/model` 에 `Org default`(또는 `Role default`)로 표시된다.
- **읽기 쉬운 세션 기본 이름** — 세션 시작 시 식별·메시지 전송이 쉬운 기본 이름이 자동 부여된다.
- **클릭 가능한 파일 첨부** — 채팅 첨부 파일을 Cmd/Ctrl-클릭하면 Finder/Explorer 에서 위치를 연다.

## 🛠️ 개선/수정 (24건)
- **MCP 보안 강화** — `claude mcp list`/`get` 가 커밋된 `.claude/settings.json` 으로 레포가 자체 승인한 `.mcp.json` 서버를 더 이상 실행하지 않는다. 신뢰 안 된 워크스페이스는 `⏸ Pending approval` 표시.
- **백그라운드 작업 대화 보존** — transcript 오판으로 대화를 영구 삭제하고 원래 프롬프트를 재실행하던 치명 버그 수정. 이제 삭제 대신 따로 보관.
- **백그라운드 세션·에이전트 안정성** — 장시간 명령·워크플로우가 프로세스 중지·재시작·업데이트를 견디고, 데몬 재시작으로 죽은 워커는 다음 뷰 열 때 자동 재개(Windows 포함).
- **`claude agents` 패널·상태 다수 수정** — 포커스 멈춤, subagent 유형 유실, 잘못된 실행 상태, `Done`↔`Needs your input` 깜빡임, 멈춘 에이전트 `Needs attention` 라벨, PR 클릭 링크.
- **`--dangerously-skip-permissions` 적용** — 조용히 auto 모드로 폴백하던 문제 수정, bypass 고지·모드 정상 적용.
- **rate-limit 경고/텔레메트리** — 병렬 요청 중 한도 도달 시 경고 깜빡임·과다 집계 수정.
- **중복 recap 줄** — 스키마 거부된 StructuredOutput 시도가 재시도와 함께 렌더링되던 문제 수정.
- **PowerShell exit-1 오탐** — `git diff`/`git grep`, `egrep`/`fgrep`, `|` 포함 따옴표 패턴을 실패로 보고하던 문제를 Bash 동작에 맞춤.
- **Remote 세션 크래시 복구** — 서버 재시작으로 중단된 세션이 다음 워커에서 자동 재개.
- **`/cd` 잔존 resume 항목** — 특수문자 경로에서 비정상 종료 후 옛 디렉터리 목록에 다시 나타나던 문제 수정.
- **`claude plugin validate`** — source `.` 로컬 플러그인을 건너뛰고 첫 오류 부류 이후 멈추던 문제 수정.
- **Esc Esc rewind 메뉴 회귀 수정** — 유휴 프롬프트에서 다시 동작.
- **MCP OAuth `invalid_scope`** — 전체 `scopes_supported` 요청으로 GitLab self-hosted 등에서 실패하던 문제 수정.
- **Bedrock `/context`** — 모든 도구 그룹을 0 토큰으로 표시하던 문제 수정.
- **`/deep-research` 오보** — 검증기 실패를 `unverified` 대신 "all claims refuted" 로 보고하던 문제 수정.
- **플러그인 버전 고정** — git 기반 로컬 폴더 마켓플레이스에서 무시되던 의존성 버전 핀 수정.
- **음성 받아쓰기** — 빠른 타이핑 시 공백 삼킴·오녹음 수정.
- **`/code-review` 토큰 25% 절감** — cleanup finder 5개를 1개로 병합.
- **터미널 렌더링 경량화** — 스트리밍 중 무의미한 하위 트리 순회 생략.
- **스트리밍 유휴 워치독 기본 활성화** — 5분 무응답 시 중단·재시도, `CLAUDE_ENABLE_STREAM_WATCHDOG=0` 으로 끔.
- **Remote Control 비활성화** — `ANTHROPIC_BASE_URL` 이 비-Anthropic 호스트일 때.
- **에이전트 뷰 단일 `←` 단축** — 포그라운드 세션에서 두 번 대신 한 번 누름으로 변경.

## 🔑 이번 버전의 핵심 키워드
**"백그라운드 신뢰성 + MCP 보안"** — 백그라운드 세션·에이전트가 프로세스 재시작을 견디고, 대화 영구 삭제 버그를 막고, 레포 자체 승인 MCP 실행을 차단한 안정·보안 강화 릴리스.

---

# 📜 원문 (한글 번역본)

> 원문 ChangeLog를 원래 순서 그대로 한 줄도 빠짐없이 번역한 문서입니다.

- 조직 기본 모델 지원 추가 — 관리자가 조직 콘솔에서 설정하며, 직접 모델을 고르지 않은 경우 `/model` 에 `Org default`(또는 `Role default`)로 표시된다.
- 세션 시작 시 읽기 쉬운 기본 이름 부여 추가 — 세션 식별과 메시지 전송이 쉬워진다.
- 채팅에서 클릭 가능한 파일 첨부 추가 — Cmd/Ctrl-클릭 시 Finder/Explorer 에서 파일 위치를 연다.
- 보안: `claude mcp list`/`get` 가 더 이상 커밋된 `.claude/settings.json` 으로 레포가 자체 승인한 `.mcp.json` 서버를 실행하지 않는다. 신뢰되지 않은 워크스페이스는 `⏸ Pending approval` 로 표시된다.
- 백그라운드 작업을 깨울 때 transcript 탐지가 실제 transcript 를 잘못 읽어 대화를 영구 삭제하고 원래 프롬프트를 재실행하던 문제 수정. 이제 파일은 삭제되지 않고 따로 보관된다.
- 사용량 한도 도달 시점에 여러 병렬 요청이 진행 중이면 rate-limit 경고가 깜빡이며 사라지고 rate-limit 텔레메트리가 과다 집계되던 문제 수정.
- 백그라운드 세션 턴 이후 중복 recap 줄이 표시되던 문제 수정: 스키마가 거부한 StructuredOutput 시도가 재시도와 함께 렌더링되지 않는다.
- PowerShell 에서 `git diff`/`git grep`, `egrep`/`fgrep`, 그리고 `|` 를 포함한 따옴표 검색 패턴이 종료 코드 1 로 끝날 때 실패로 보고되던 문제 수정 — Bash 동작과 일치시킴.
- `claude agents` 사이드 패널의 여러 문제 수정: 에이전트를 열 때 키보드 포커스가 멈추던 문제, 백그라운드 작업이 열 때마다 subagent 유형을 잃던 문제, 실행 중인 세션이 잘못된 상태로 표시되던 문제.
- `claude agents --dangerously-skip-permissions` 가 bypass 고지를 표시하고 생성된 에이전트에 bypass 모드를 적용하는 대신 조용히 auto 모드로 폴백하던 문제 수정.
- Remote 세션의 턴 도중 크래시 복구 수정 — 서버 재시작으로 중단된 세션이 다음 워커에서 자동 재개된다.
- 옛 경로에 특수문자가 있을 때 비정상 종료 후 `/cd` 로 이동한 세션이 옛 디렉터리의 resume 목록에 다시 나타나던 문제 수정.
- `claude plugin validate` 가 source 가 `.` 인 로컬 플러그인을 건너뛰고 첫 번째 오류 부류 이후 멈추던 문제 수정.
- 유휴 프롬프트에서 Esc Esc 가 rewind 메뉴를 열지 않던 문제(회귀) 수정. 백그라운드 에이전트 중단은 Ctrl+C 또는 Ctrl+X Ctrl+K 사용.
- scope 를 지정하지 않았을 때 MCP OAuth 가 인증 서버의 전체 `scopes_supported` 목록을 요청해 GitLab self-hosted 및 기타 엔터프라이즈 IdP 에서 `invalid_scope` 실패를 일으키던 문제 수정.
- Bedrock 에서 `/context` 가 모든 도구 그룹을 0 토큰으로 표시하던 문제 수정.
- `/deep-research` 가 검증기 실패를 `unverified` 대신 "all claims refuted" 로 잘못 보고하던 문제 수정.
- 마켓플레이스가 git 레포 기반 로컬 폴더 경로로 추가됐을 때 플러그인 의존성 버전 고정이 지켜지지 않던 문제 수정.
- `claude agents` 세션 상태 수정: 완료된 행이 `Done` 과 `Needs your input` 사이를 오가지 않고, 멈춘 에이전트는 `Needs attention` 으로 표시되며, PR 을 언급한 결과는 클릭 가능한 링크를 보여준다.
- 음성 모드 활성화 시 매우 빠르게 타이핑하면 음성 받아쓰기가 공백을 삼키고 녹음이 잘못 시작되던 문제 수정.
- 백그라운드 세션 안정성 개선: 장시간 실행 명령과 워크플로우가 세션 프로세스의 중지·재시작·업데이트를 견딘다 — Windows 에서도 백그라운드 셸이 종료되지 않고 인계된다.
- 백그라운드 에이전트 개선: 데몬 재시작으로 종료된 워커가 다음에 에이전트 뷰를 열 때 멈춘 지점에서 자동 재개된다.
- `/code-review` 워크플로우 개선: 5개의 cleanup finder 를 하나로 병합해 토큰 사용량을 약 25% 절감.
- 스트리밍 중 무의미한 하위 트리 순회를 건너뛰어 터미널 UI 의 프레임당 렌더링 작업 감소.
- 스트리밍 유휴 워치독이 이제 모든 프로바이더에서 기본 활성화 — 응답 스트림이 5분간 아무 이벤트도 내지 않으면 중단 후 재시도한다. 비활성화는 `CLAUDE_ENABLE_STREAM_WATCHDOG=0` 설정.
- `ANTHROPIC_BASE_URL` 이 비-Anthropic 호스트를 가리키면 이제 Remote Control 이 비활성화된다 — `CLAUDE_CODE_USE_BEDROCK`/`_VERTEX`/`_FOUNDRY` 의 기존 동작과 일치.
- 포그라운드 세션에서 에이전트 뷰 열기를 두 번이 아닌 한 번의 `←` 누름으로 변경 — 백그라운드 세션 동작과 일치.

---

## 🎯 챌린지

이번 버전에서 내 환경에 적용해볼 만한 항목입니다.

### 1. 스트리밍 유휴 워치독 의도 고정
- **파일**: `~/.claude/settings.json`
- **근거**: 이번 버전부터 워치독이 기본 활성화돼 5분 무응답 시 자동 재시도한다. cron `claude-changelog-sync` 와 dynamic workflow 등 장시간 백그라운드 작업을 자주 돌리는 환경이라 이 동작이 유리하다. `env` 블록에 `CLAUDE_ENABLE_STREAM_WATCHDOG=1` 을 명시해 새 기본값을 의도적으로 고정한다.
- **난이도**: ★☆☆ (약 5분)

### 2. MCP 자체 승인 서버 점검
- **파일**: `~/.claude/settings.json` 및 각 Poplus 레포의 `.claude/settings.json`
- **근거**: 보안 수정으로 커밋된 `.claude/settings.json` 으로 레포가 자체 승인한 `.mcp.json` 서버는 더 이상 자동 실행되지 않는다. 30개 마이크로서비스 레포를 오가는 환경이라, 전역 설정에 `enableAllProjectMcpServers` 같은 무차별 승인이 없는지 확인하고 새 `Pending approval` 흐름에 맡긴다.
- **난이도**: ★★☆ (약 10분)

### 3. 백그라운드 에이전트 중단 단축키 명시
- **파일**: `~/.claude/keybindings.json`
- **근거**: 버전 노트가 백그라운드 에이전트 중단은 Ctrl+C 또는 Ctrl+X Ctrl+K 라고 안내한다. 병렬 subagent·workflow 를 상시 돌리는 환경이라, 폭주 작업을 빠르게 끊을 수 있도록 중단 단축키를 keybindings 에 확인·고정해둔다.
- **난이도**: ★★☆ (약 10분)
