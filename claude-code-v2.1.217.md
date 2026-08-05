# Claude Code v2.1.217

> 작성일: 2026-08-06

---

# 📋 요약본

## 🎉 신기능 (3건)
- **이모지 단축코드 자동완성** — 프롬프트 입력창에서 `:heart:` 를 치면 ❤️ 가 삽입되고, `:hea` 처럼 일부만 쳐도 후보가 뜬다. `emojiCompletionEnabled` 설정으로 끌 수 있다.
- **transcript 저장 실패 경고** — 디스크 부족 등으로 transcript 쓰기가 실패하거나, 상속된 환경변수로 세션 저장이 꺼져 있을 때 조용히 잃지 않고 경고를 띄운다.
- **동시 실행 subagent 상한** — 한 메시지가 무한정 백그라운드 에이전트를 뿜어내지 못하도록 동시 실행 subagent 수에 상한(기본 20)을 뒀다. `CLAUDE_CODE_MAX_CONCURRENT_SUBAGENTS` 로 조정한다.

## 🛠️ 개선/수정 (17건)
- **메모리 누수 수정** — 잘린 MCP 도구 출력이 세션 내내 원본 전체를 메모리에 붙들던 누수를 고쳤다.
- **Windows 자동 업데이트** — `claude.exe` 가 사라질 수 있던 실패를 고치고, 실패 시 보존된 실행 파일을 자동 복구한다.
- **백그라운드 세션 격리** — symlink 작업 디렉터리를 정규화하지 않아 세션이 워크스페이스 밖으로 벗어나던 문제를 고쳤다.
- **auto-compact / `/compact`** — Bedrock의 Claude Opus 4.8에서 auto-compact가 발동하지 않고 한도 초과 후 `/compact` 가 실패하던 문제를 고쳤다.
- **Claude Desktop 기업 설정** — mTLS·TLS 검증·OAuth scope·프록시 설정이 무시되던 문제를 고쳤다.
- **스크린리더 모드** — 시작 안내가 첫 프롬프트 렌더에 잘리고, thinking 상태 행이 몇 초마다 재렌더되던 문제를 고쳤다.
- **OTEL 텔레메트리** — 관리형 설정의 `OTEL_EXPORTER_OTLP_ENDPOINT` 를 하위 범위 신호별 override가 덮어써 텔레메트리를 딴 데로 돌리던 문제를 고쳤다.
- **`--resume`/`--continue`/`/resume`** — transcript에 잘못된 attachment 항목이 있으면 TypeError로 실패하던 문제를 고쳤다.
- **Remote Control** — 권한 프롬프트가 뜬 뒤 접속한 뷰어에게 대기 중 프롬프트/대화가 안 보이던 문제를 고쳤다.
- **백그라운드 셸** — 세션을 백그라운드로 보내거나 과부하 머신에서 종료할 때 백그라운드 셸이 멈추지 않던 문제를 고쳤다(특히 Windows).
- **brace 확장 OOM** — `CLAUDE.md`/`SKILL.md` frontmatter의 paths 값에 brace 그룹이 많으면 시작 시 OOM·멈춤이 나던 문제를 예산 제한으로 고쳤다.
- **transcript 미리보기 간격** — 시작 중인 백그라운드 세션에 붙을 때 미리보기가 입력창에 붙던 것을 라이브 레이아웃과 같은 한 줄 간격으로 맞췄다.
- **PR 배지 링크 개선** — 터미널 지원 감지가 안 돼도(ssh/tmux) 푸터 PR 배지를 클릭 가능한 하이퍼링크로 만들었다. `FORCE_HYPERLINK=0` 으로 끈다.
- **로그인 만료 경고** — 만료 5일 전 대신 3일 전에 뜨도록 바꿨다.
- **frontend-design 팁 제한** — plugin 제안 팁을 무한 반복 대신 평생 3회로 제한했다.
- **subagent 중첩 spawn 기본 비활성화** — subagent가 기본적으로 중첩 subagent를 생성하지 않도록 바꿨다. 더 깊은 중첩은 `CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH` 로 허용한다.
- **`--max-budget-usd`** — 예산 한도가 백그라운드 subagent를 멈추지 못하던 문제를 고쳐, 한도 도달 시 새 생성을 막고 실행 중인 것도 중단한다.

## 🔑 이번 버전의 핵심 키워드
**"subagent 폭주 방지"** — 동시 실행 상한·중첩 spawn 기본 차단·예산 한도 강제로 fan-out을 통제하는 버전.

---

# 📜 원문 (한글 번역본)

> 원문 ChangeLog를 원래 순서 그대로 한 줄도 빠짐없이 번역한 문서입니다.

- 프롬프트 입력창에 이모지 단축코드 자동완성 추가: `:heart:` 를 치면 ❤️ 를 삽입하고, `:hea` 로 후보를 본다 — `emojiCompletionEnabled` 설정으로 비활성화.
- transcript 쓰기가 실패하거나(예: 디스크 가득 참) 상속된 환경변수로 세션 저장이 꺼졌을 때, 조용히 transcript를 잃는 대신 경고를 추가.
- 잘린 MCP 도구 출력이 세션 남은 동안 잘리지 않은 전체 결과를 메모리에 유지하던 메모리 누수 수정.
- `claude.exe` 가 사라질 수 있던 Windows 자동 업데이트 실패 수정; 실패한 업데이트는 이제 보존된 실행 파일을 자동 복구.
- symlink된 작업 디렉터리를 정규화하지 않던 백그라운드 세션 격리 문제 수정 — 세션이 워크스페이스 폴더를 벗어날 수 있었음.
- Bedrock의 Claude Opus 4.8에서 auto-compact가 절대 발동하지 않고 한도 초과 후 `/compact` 가 실패하던 문제 수정.
- Claude Desktop 세션에서 기업용 mTLS·TLS 검증·OAuth scope·프록시 설정이 무시되던 문제 수정.
- 스크린리더 모드의 시작 안내가 첫 프롬프트 렌더에 잘리고, thinking 상태 행이 경과 시간·토큰 수 갱신을 위해 몇 초마다 재렌더되던 문제 수정.
- `OTEL_EXPORTER_OTLP_ENDPOINT` 를 설정한 관리형 설정이 모든 신호를 다스리지 못하던 문제 수정 — 하위 범위 신호별 override가 더 이상 텔레메트리를 관리형 엔드포인트에서 다른 곳으로 돌리지 않음.
- transcript에 잘못된 형식의 attachment 항목이 있을 때 `--resume`/`--continue` 와 `/resume` 가 TypeError로 실패하던 문제 수정.
- 권한 프롬프트가 나타난 뒤 접속한 뷰어에게 대기 중 권한 프롬프트나 대화가 표시되지 않던 Remote Control 세션 문제 수정.
- 세션을 백그라운드로 보낸 뒤(`/background` 또는 `←`)나 과부하 머신에서 세션이 종료될 때 백그라운드 셸을 멈추는 게 불가능해지던 문제 수정, Windows에서 가장 두드러짐.
- brace 그룹이 많은 `CLAUDE.md`·`SKILL.md` paths frontmatter 값이 시작 시 CLI를 OOM-kill하거나 멈추게 하던 문제 수정 — brace 확장이 이제 예산으로 제한됨.
- 시작 중인 백그라운드 세션에 붙을 때 transcript 미리보기가 입력 영역에 딱 붙던 것을 수정; 이제 라이브 레이아웃과 같은 한 줄 간격을 두어, 세션이 넘겨받을 때 transcript가 밀리지 않음.
- 터미널 지원을 감지할 수 없어도(예: ssh/tmux) 푸터 PR 배지 링크를 클릭 가능한 하이퍼링크로 개선; `FORCE_HYPERLINK=0` 으로 opt-out.
- 로그인 만료 경고를 만료 5일 전 대신 3일 전에 나타나도록 변경.
- frontend-design plugin 제안 팁을 무한 반복 대신 평생 3회 노출로 제한.
- 한 메시지가 무한정 백그라운드 에이전트를 fan-out하지 못하도록 동시 실행 subagent에 상한(기본 20, `CLAUDE_CODE_MAX_CONCURRENT_SUBAGENTS` 로 override) 추가.
- subagent가 기본적으로 더 이상 중첩 subagent를 생성하지 않도록 변경; 더 깊은 중첩을 허용하려면 `CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH` 설정.
- `--max-budget-usd` 가 백그라운드 subagent를 멈추지 못하던 문제 수정: 한도 도달 시 새 생성이 거부되고 실행 중인 백그라운드 에이전트가 중단됨.

---

## 🎯 챌린지

이번 버전에서 내 환경에 적용해볼 만한 항목입니다.

### 1. 이모지 자동완성 끄기
- **파일**: `~/.claude/settings.json`
- **근거**: 이번 버전에 이모지 단축코드 자동완성이 기본 켜졌다. 산출물 이모지 금지 원칙([[feedback-no-emoji-in-docs]])을 지키는 환경에선 입력 중 실수 삽입을 막도록 `"emojiCompletionEnabled": false` 를 추가하는 편이 낫다.
- **난이도**: ★☆☆ (약 5분)

### 2. 동시 subagent 상한 명시
- **파일**: `~/.claude/settings.json` (`env` 블록)
- **근거**: 이번 버전이 동시 실행 subagent 기본 상한을 20으로 뒀다. 병렬 dispatch·Workflow fan-out을 자주 쓰는 환경이라 `env` 에 `CLAUDE_CODE_MAX_CONCURRENT_SUBAGENTS` 를 명시해 원하는 폭(예: 로컬 코어 수에 맞춘 값)으로 고정하면 예측 가능성이 올라간다.
- **난이도**: ★☆☆ (약 10분)

### 3. subagent 중첩 spawn 정책 확인
- **파일**: `~/.claude/settings.json` (`env` 블록)
- **근거**: 이번 버전부터 subagent가 기본적으로 중첩 subagent를 생성하지 않는다. `superpowers:subagent-driven-development` 흐름에서 하위 에이전트가 또 에이전트를 띄우는 구조가 있었다면 지금은 막힌다. 필요 시 `CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH` 를 명시하고, 아니면 기본값 유지로 폭주를 막는다.
- **난이도**: ★★☆ (약 15분)
