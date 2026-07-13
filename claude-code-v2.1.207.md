# Claude Code v2.1.207

> 작성일: 2026-07-13

---

# 📋 요약본

## 🎉 신기능 (1건)
- **Auto mode 옵트인 불필요화** — Bedrock, Vertex AI, Foundry에서 `CLAUDE_CODE_ENABLE_AUTO_MODE` 환경변수 없이 auto mode를 바로 쓸 수 있다. 끄려면 settings의 `disableAutoMode`를 쓴다.

## 🛠️ 개선/수정 (23건)
- **스트리밍 프리즈 해소** — 매우 긴 리스트·표·문단·코드 블록 응답을 스트리밍할 때 터미널이 멈추고 키 입력이 밀리던 문제를 고쳤다.
- **비대화형 보안 동의 버그** — `claude -p`·SDK 실행에서 보안 동의 대화상자를 띄우지 않고도 원격 관리 설정이 영구 동의로 기록되던 문제를 고쳤다.
- **잘못된 프롬프트 인젝션 경고** — 무해한 시스템 대화 업데이트가 유발하던 오탐 경고를 제거했다.
- **커스텀 런처 보존** — auto-updater가 릴리스마다 `~/.local/bin/claude`의 커스텀 런처/심링크를 덮어쓰던 문제를 고쳤고, `/doctor`가 외부 관리 런처를 보고한다.
- **`/dev/null` 리다이렉트 권한 요청 제거** — `cd` 포함 복합 명령에서 출력이 `/dev/null`로만 갈 때 불필요하게 권한을 묻던 문제를 고쳤다.
- **트랜스크립트 스크롤 튐** — 스트리밍이 끝날 때 화면이 답변 시작 위로 튀어 오르던 문제를 고쳤다.
- **worktree 관련 정합성** — `extensions.worktreeConfig`가 `.git/config`에 잔존해 `tea` 등 go-git 도구를 망가뜨리던 문제, glob·skill 경로·`.ignore`·`.worktreeinclude`의 잘못된 대괄호 패턴 문제를 고쳤다.
- **agent teams 크래시 루프** — 잘못된 팀메이트 메일박스 메시지가 매초 에러를 반복하던 문제를 고쳤다.
- **백그라운드 세션 표시·재개** — 자동 명명 이름 미표시, worktree 진입 세션의 콜드 재오픈 시 빈 화면 문제를 고쳤다.
- **Remote Control 안정화** — 연결 복구 시 작업 상태 유실, 데스크톱 호스팅 세션의 모바일·웹 진행 상황 미표시를 고쳤다.
- **Deep research 라벨** — Fetch 단계 agent를 "unknown"으로 표기하던 것을 소스 호스트명 표시로 고쳤다.
- **AWS/Bedrock 자격 증명** — Bedrock의 매 요청 SSO 재요청, Windows에서 자격 증명 해석 멈춤 시 무한 대기 문제를 고쳤다.
- **agent view UX** — 동일 텍스트 재붙여넣기 시 접힌 placeholder를 펼치고, 차단 세션 peek에 질문 우선·문구형 staleness 시계를 표시한다.
- **기본 모델 변경** — Bedrock, Vertex, AWS Claude Platform 기본값을 Claude Opus 4.8로 변경했다.
- **auto mode 설정 소스 변경** — `.claude/settings.local.json`의 `autoMode`를 더 이상 읽지 않고 `~/.claude/settings.json`을 쓴다.
- **Plugin 보안 강화** — 쉘 형식 명령의 `${user_config.*}`를 거부(쉘 인젝션 차단)하고, `pluginConfigs`를 프로젝트 수준 설정에서 읽지 않도록 했다.
- **`/usage-credits` 입력 검증** — 잘못된 금액을 조용히 숫자로 깎던 것을 에러로 거부하고, $1,000 초과는 타이핑 확인을 요구한다.

## 🔑 이번 버전의 핵심 키워드
**"프로바이더 기본값·설정 소스 정리, 그리고 스트리밍·백그라운드 안정화"** — Bedrock/Vertex/Foundry의 auto mode·모델 기본값을 손보고, 플러그인 설정을 안전한 소스로 좁힌 정비 릴리스.

---

# 📜 원문 (한글 번역본)

> 원문 ChangeLog를 원래 순서 그대로 한 줄도 빠짐없이 번역한 문서입니다.

- Auto mode는 이제 Bedrock, Vertex AI, Foundry에서 `CLAUDE_CODE_ENABLE_AUTO_MODE` 옵트인 없이 사용할 수 있다. settings의 `disableAutoMode`로 비활성화한다.
- 매우 긴 리스트·표·문단·코드 블록이 포함된 응답을 스트리밍하는 동안 터미널이 멈추고 키 입력이 지연되던 문제를 수정했다.
- 비대화형 실행(`claude -p`, SDK)에서 원격 관리 설정(remote managed settings)이 보안 동의 대화상자를 한 번도 표시하지 않은 채 영구적으로 동의된 것으로 기록되던 문제를 수정했다.
- 무해한 시스템 생성 대화 업데이트가 잘못된 프롬프트 인젝션 경고를 유발하던 문제를 수정했다.
- auto-updater가 릴리스마다 `~/.local/bin/claude`의 커스텀 런처 스크립트나 심링크를 덮어쓰던 문제를 수정했다. 이제 `/doctor`가 외부에서 관리되는 런처를 보고한다.
- `cd`가 포함된 복합 명령에서 유일한 출력 리다이렉트가 `/dev/null`로 향할 때 권한을 묻던 문제를 수정했다.
- 응답 스트리밍이 끝났을 때 트랜스크립트가 답변 시작 위로 튀어 오르던 문제를 수정했다.
- 마지막 `worktree.sparsePaths` worktree가 제거된 후에도 `extensions.worktreeConfig`가 레포의 `.git/config`에 남아(있어 `tea` 같은 go-git 도구를 망가뜨리던) 문제를 수정했다.
- rules glob, skill 경로, `.ignore`, `.worktreeinclude`의 잘못된 대괄호 패턴이 파일 읽기·파일 제안·worktree 생성을 망가뜨리던 문제를 수정했다.
- 잘못된 형식의 팀메이트 메일박스 메시지가 메일박스 파일을 수동 삭제할 때까지 매초 에러를 반복 발생시키던 agent teams의 크래시 루프를 수정했다.
- 계획 수락으로 자동 명명된 백그라운드 세션이 agent-view 행에 그 이름을 표시하지 않던 문제를 수정했다.
- git worktree에 진입한 백그라운드 세션이 agent 목록에서 콜드 재오픈 후 빈 화면으로 재개되던 문제를 수정했다.
- 네트워크 중단이나 자격 증명 갱신에서 연결이 복구될 때 Remote Control 작업 상태 업데이트가 유실되던 문제를 수정했다.
- 데스크톱 앱이 호스팅하는 Remote Control 세션이 모바일·웹에서 백그라운드 agent 및 workflow 진행 상황을 표시하지 않던 문제를 수정했다.
- Deep research 실행이 Fetch 단계의 모든 agent를 "unknown"으로 라벨링하던 문제를 수정했다 — 이제 칩(chip)에 소스 호스트명이 표시된다.
- Bedrock이 매 API 요청마다 IAM Identity Center에서 새 AWS SSO 자격 증명을 반복 요청하던 문제를 수정했다.
- agent view 개선: 동일한 텍스트를 다시 붙여넣으면 두 번째 placeholder를 추가하는 대신 접힌 `[Pasted text #N]` placeholder를 펼친다.
- agent view 개선: 차단된 세션 peek이 이제 질문을 먼저 보여주고, 동일한 타임스탬프를 두 번 표시하는 대신 문구로 된 staleness 시계(`waiting 3m`)를 표시한다.
- Bedrock, Vertex, AWS의 Claude Platform가 기본값으로 Claude Opus 4.8을 사용하도록 변경했다.
- auto mode가 더 이상 `.claude/settings.local.json`(레포에 상주)에서 `autoMode`를 읽지 않도록 변경했다. 대신 `~/.claude/settings.json`을 사용한다.
- Windows에서 AWS 자격 증명 해석이 멈출 때(예: `credential_process`가 멈춤) 무한 대기하던 문제를 수정했다. 이제 60초 정지 가드가 무한 대기 대신 발동한다.
- Plugin hooks/monitors/MCP headersHelper: 쉘 형식(shell-form) 명령의 `${user_config.*}`가 이제 거부된다(쉘 인젝션 수정). Hooks는 exec 형식(`args` 배열) 또는 `$CLAUDE_PLUGIN_OPTION_<KEY>`를 사용하고, monitors와 headersHelper는 스크립트 내부(설정 파일 또는 서버의 `env` 블록)에서 값을 읽는다.
- Plugin 옵션 값(`pluginConfigs`)이 더 이상 프로젝트 수준 `.claude/settings.json`에서 읽히지 않는다. user, `--settings`, managed settings만 인정된다.
- `/usage-credits` 금액 입력이 잘못된 값(예: 붙여넣은 타임스탬프)을 숫자만 남기고 조용히 제거하던 문제를 수정했다. 이제 잘못된 금액은 에러와 함께 거부되며, $1,000 초과 금액은 타이핑된 확인을 요구한다.

---

## 🎯 챌린지

이번 버전에서 내 환경에 적용해볼 만한 항목입니다.

### 1. 플러그인 훅의 `${user_config.*}` 쉘 인젝션 점검
- **파일**: `/Users/leeseonro/.claude/plugins/cache/`
- **근거**: 이번 버전이 쉘 형식 명령의 `${user_config.*}`를 쉘 인젝션 위험으로 거부하기 시작했다. `superpowers`·`token-optimizer`·`understand-anything` 등 다수 플러그인을 활성화한 환경이라, 훅 정의에 `${user_config.*}`가 남아 있으면 조용히 동작이 막힐 수 있다. `grep -rn 'user_config' <위 경로>`로 확인하고, 발견 시 exec 형식(`args` 배열)이나 `$CLAUDE_PLUGIN_OPTION_<KEY>`로 옮긴다.
- **난이도**: ★★☆ (약 15분)

### 2. `autoMode` 설정 위치 이전
- **파일**: `/Users/leeseonro/Document/BE/.claude/settings.local.json`
- **근거**: auto mode가 더 이상 레포 상주 `.claude/settings.local.json`의 `autoMode`를 읽지 않는다. 프로젝트 로컬 설정에 `autoMode` 키가 있으면 이제 무시되므로, `grep autoMode`로 확인 후 값이 있으면 `~/.claude/settings.json`으로 옮긴다.
- **난이도**: ★☆☆ (약 5분)

### 3. 프로젝트 설정의 `pluginConfigs` 위치 검증
- **파일**: `/Users/leeseonro/Document/BE/.claude/settings.json`
- **근거**: 플러그인 옵션 값(`pluginConfigs`)이 프로젝트 수준 `.claude/settings.json`에서 더 이상 읽히지 않는다. 프로젝트 설정에 `pluginConfigs`가 들어 있으면 무효 처리되므로, 확인 후 user 설정(`~/.claude/settings.json`)이나 `--settings`로 옮겨 플러그인 옵션이 계속 적용되게 한다.
- **난이도**: ★☆☆ (약 5분)
