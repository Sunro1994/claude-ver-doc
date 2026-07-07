# Claude Code v2.1.198

> 작성일: 2026-07-02

---

# 📋 요약본

## 🎉 신기능 (5건)
- **Claude in Chrome 정식 출시(GA)** — 크롬 브라우저에서 Claude를 정식으로 사용할 수 있다.
- **배경 에이전트 알림** — `claude agents`에서 입력이 필요하거나 작업이 끝난 세션이 `Notification` hook을 발생시킨다(`agent_needs_input` / `agent_completed`). hook만 걸어두면 완료·대기 순간을 알림으로 받을 수 있다.
- **`/dataviz` 스킬 추가** — 차트·대시보드 디자인 가이드를 제공하며, 실행 가능한 색상 팔레트 검증기가 딸려 있다.
- **Gateway에 AWS의 Claude Platform(`anthropicAws`) 추가** — 상위(upstream) provider로 편입됐고, model-not-found 응답 시 failover 체인이 다음 후보로 넘어간다.
- **배경 에이전트 자동 마무리** — `claude agents`로 띄운 배경 에이전트가 worktree에서 코드 작업을 끝내면 멈춰서 묻지 않고 commit·push 후 draft PR을 연다.

## 🛠️ 개선/수정 (27건)
- **Explore 에이전트 모델 상향** — haiku 대신 메인 세션 모델을 상속한다(opus 상한).
- **서브에이전트·컨텍스트 압축이 확장 사고(extended thinking) 설정 상속** — 위임 작업 출력 품질이 올라간다.
- **네트워크 순단 재시도** — `ECONNRESET` 같은 일시 오류가 턴을 중단시키지 않고 backoff로 재시도한다.
- **배경 classifier 과다 요청 수정** — 샌드박스 프로세스가 같은 호스트에 반복 접근할 때 발생하던 문제.
- **배경 작업 "Running" 멈춤 수정** — web·desktop·VS Code 패널에서 완료/세션 재개 후에도 멈춰 있던 문제.
- **에이전트 팀 안정화** — API 오류로 죽은 팀원이 lead에 "failed"를 보고하고, 멈춘 팀원에 메시지를 보내면 즉시 깨어나 재시도한다.
- **`/diff` 패널 갱신** — 브랜치 전환이나 세션 밖 커밋 시 갱신되지 않던 문제.
- **AWS·Mantle STS 토큰 만료 자동 갱신** — `awsAuthRefresh`가 자동 실행돼 "Please run /login" 막힘이 사라졌다.
- **macOS 배경 세션 로컬 네트워크 접근** — Local Network entitlement 선언으로 "no route to host" 해소.
- **`/desktop` 작업 디렉터리 오류 수정** — worktree 진입·이탈 후 "Cannot determine working directory" 문제.
- **배경 에이전트 "Reconnecting…" 반복 수정** — macOS에서 ~52초마다 반복되던 문제.
- **`claude attach` 방향키·`claude --bg` 플래그 처리** — `←` 입력 시 셸로 빠지지 않게, `--bg`+`--print`/`-p` 충돌은 사전 거부한다.
- **워크플로 진행 뷰 초기 에이전트 누락 수정** — SDK·desktop 세션에서 목록 앞쪽 에이전트가 사라지던 문제.
- **`.claude/rules/` 심링크 경로 조건 규칙 로딩 수정**.
- **플랜 모드 개선** — read-only 도구 호출 자동 허용, `/branch` 기본 이름을 압축 요약이 아닌 첫 실제 프롬프트에서 도출.
- **렌더링·터미널 개선** — fullscreen 표 우측 테두리 넘침, Warp Cmd+click URL 열기, 더블클릭 URL 전체 선택, highlight.js 11 문법 강조, Mac SSH 접속 시 opt/cmd 힌트 표기.
- **UX 개선** — 포커스 모드에 서브에이전트 표시·완료 알림 접기, API 재시도 이유 노출·상태 페이지 링크, `claude agents` 뷰에서 `/login` 진입, 서브에이전트가 실행 에이전트 메시지를 작업 지시로 처리, `/agents` 마법사 제거.

## 🔑 이번 버전의 핵심 키워드
**"배경 에이전트가 스스로 알리고 스스로 마무리한다"** — 완료·대기 알림 hook, 자동 commit/push/draft PR, 연결·모델 상속 안정화가 이번 버전의 중심축이다.

---

# 📜 원문 (한글 번역본)

> 원문 ChangeLog를 원래 순서 그대로 한 줄도 빠짐없이 번역한 문서입니다.

- Claude in Chrome이 정식 출시(generally available)됐다.
- `claude agents`에 배경 에이전트 알림을 추가했다 — 입력이 필요하거나 작업이 끝난 세션이 이제 `Notification` hook을 발생시킨다(`agent_needs_input` / `agent_completed`).
- 차트·대시보드 디자인 가이드를 위한 `/dataviz` 스킬을 추가했다. 실행 가능한 색상 팔레트 검증기를 포함한다.
- Gateway: 상위 provider로 AWS의 Claude Platform(`anthropicAws`)을 추가했다. model-not-found 응답이 이제 failover 체인을 다음으로 진행시킨다.
- `claude agents`에서 띄운 배경 에이전트가 이제 worktree에서 코드 작업을 끝내면 멈춰 묻지 않고 commit·push 후 draft PR을 연다.
- 내장 Explore 에이전트가 이제 haiku로 돌지 않고 메인 세션의 모델을 상속한다(opus 상한).
- 서브에이전트와 컨텍스트 압축(compaction)이 이제 세션의 확장 사고(extended thinking) 설정을 상속해, 위임 작업의 출력 품질이 향상된다.
- 응답 도중의 짧은 네트워크 순단이 턴을 중단시키던 문제를 수정했다 — `ECONNRESET` 같은 일시 오류는 이제 실패 대신 backoff로 재시도한다.
- 샌드박스 프로세스가 같은 네트워크 호스트에 반복 접근할 때 배경 classifier 요청이 과다하게 발생하던 문제를 수정했다.
- web·desktop·VS Code 작업 패널의 배경 작업이 완료 후 또는 세션 재개 후 "Running"에서 멈춰 있던 문제를 수정했다.
- 에이전트 팀 수정: API 오류로 죽은 팀원이 이제 lead에 "failed"를 보고하고, 멈춘 팀원에 메시지를 보내면 즉시 깨어나 재시도한다.
- 브랜치를 전환하거나 세션 밖에서 커밋할 때 `/diff` 패널이 갱신되지 않던 문제를 수정했다.
- fullscreen 모드에서 마크다운 표가 넘쳐 우측 테두리가 줄바꿈되던 문제를 수정했다.
- STS 토큰 만료 시 AWS의 Claude Platform·Mantle 세션이 "Please run /login"으로 막히던 문제를 수정했다 — 이제 `awsAuthRefresh`가 자동 실행된다.
- macOS 배경 에이전트 세션에서 로컬 네트워크 호스트에 대한 "no route to host" 문제를 Local Network entitlement 선언으로 수정했다.
- worktree 진입·이탈 후 `/desktop`이 "Cannot determine working directory"로 실패하던 문제를 수정했다.
- macOS에서 에이전트 뷰를 열어둔 동안 배경 에이전트가 ~52초마다 "Reconnecting…"을 반복 표시하던 문제를 수정했다.
- `claude attach <id>` 안에서 `←`를 누르면 에이전트 뷰가 열리지 않고 셸로 빠지던 문제를 수정했다.
- `claude --bg`를 `--print`/`-p`와 함께 쓰면 attach 불가능한 세션이 조용히 생성되던 문제를 수정했다 — 이제 충돌하는 플래그를 사전에 거부한다.
- SDK·desktop 앱 세션에서 phase 카운터는 맞는데 워크플로 진행 뷰가 목록 앞쪽 에이전트를 누락시키던 문제를 수정했다.
- 대상 파일에 심링크 경로로 도달할 때 `.claude/rules/` 조건 규칙이 로딩되지 않던 문제를 수정했다.
- macOS의 Warp에서 fullscreen 모드일 때 Cmd+click으로 URL이 열리지 않던 문제를 수정했다.
- fullscreen 모드의 더블클릭 단어 선택이 scheme을 포함한 전체 URL을 선택하도록 수정했다.
- 세션이 플랜 모드로 시작할 때 플랜 모드가 read-only 도구 호출을 자동 허용하지 않던 문제를 수정했다.
- `/branch`가 기본 fork 이름을 첫 실제 프롬프트가 아닌 압축 요약에서 도출하던 문제를 수정했다.
- 포커스 모드 개선: 한 턴에서 띄운 서브에이전트가 이제 그 턴의 활동 요약에 나타나고, 완료된 배경 알림은 하나의 개수로 접힌다.
- highlight.js 11로 업그레이드해 코드 블록·diff·파일 미리보기의 문법 강조 정확도를 개선했다.
- Mac에서 SSH로 접속했을 때 키보드 단축키 힌트가 alt/super 대신 opt/cmd로 표시된다.
- API 재시도 UX 개선: 두 번째 시도 후 오류 이유를 표시하고, API 과부하 시 spinner 팁 대신 상태 페이지 링크가 표시된다.
- `/login`이 이제 "사용 불가"라고 말하지 않고 `claude agents` 뷰에서 로그인 대화상자를 연다.
- 서브에이전트가 이제 자신을 띄운 에이전트의 메시지를 일반 작업 지시로 취급한다. 단, 에이전트의 메시지는 여전히 사용자의 승인으로 취급되지 않는다.
- `/agents` 마법사를 제거했다. 서브에이전트 생성·관리는 Claude에게 요청하거나 `.claude/agents/`를 직접 편집한다.

---

## 🎯 챌린지

이번 버전에서 내 환경에 적용해볼 만한 항목입니다.

### 1. 배경 에이전트 완료·대기 알림 hook 추가
- **파일**: `~/.claude/settings.json` (`hooks.Notification`)
- **근거**: 이번 버전이 `agent_needs_input` / `agent_completed`를 `Notification` hook으로 쏘기 시작했다. 이미 `Stop` hook에서 `osascript display notification`을 쓰고 있으니, 같은 방식으로 `Notification` 항목을 추가하면 배경 에이전트가 입력을 기다리거나 끝날 때 데스크톱 알림을 받는다. 서브에이전트·워크플로를 자주 돌리는 환경(agent-infra)에서 대기·완료 순간을 놓치지 않게 된다.
- **난이도**: ★☆☆ (약 10분)

### 2. 배경 에이전트 자동 commit/push와 `deploy-guard.sh` 충돌 점검
- **파일**: `~/agent-infra/hooks/deploy-guard.sh`
- **근거**: 이번 버전부터 배경 에이전트가 worktree 작업을 끝내면 **자동으로 commit·push·draft PR**을 만든다. CLAUDE.md §6은 "명시적 요청 없이는 commit/push 금지 + precheck 토큰 없으면 차단"을 규정한다. 자동 커밋이 `deploy-guard.sh`에 걸려 배경 에이전트가 실패하는지, 아니면 hook을 우회해 정책이 뚫리는지 실제로 확인해야 한다. worktree 커밋 경로에 대한 예외/차단 규칙을 명시하면 정책과 신기능이 충돌 없이 맞물린다.
- **난이도**: ★★☆ (약 15분)

### 3. CLAUDE.md §6에 배경 에이전트 worktree 커밋 정책 한 줄 명시
- **파일**: `~/.claude/CLAUDE.md` (§6 Deploy 정책)
- **근거**: 신기능(배경 에이전트 자동 커밋/PR)과 기존 "직접 commit/push 안 한다" 원칙이 정면으로 만난다. worktree에서 도는 배경 에이전트의 자동 커밋을 허용할지, precheck를 강제할지 한 줄로 못 박아두면 이후 세션에서 판단이 흔들리지 않는다. 2번(hook 동작 확인)과 짝이 되는 문서화 조치다.
- **난이도**: ★☆☆ (약 5분)
