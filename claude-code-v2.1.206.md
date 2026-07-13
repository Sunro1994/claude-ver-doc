# Claude Code v2.1.206

> 작성일: 2026-07-13

---

# 📋 요약본

## 🎉 신기능 (5건)
- **`/cd` 경로 자동완성** — `/cd` 가 이제 `/add-dir` 과 동일하게 디렉터리 경로 제안을 보여준다.
- **`/doctor` CLAUDE.md 다이어트 검사** — 커밋된 `CLAUDE.md` 에서 Claude가 코드베이스로부터 유도할 수 있는 내용을 잘라내자고 제안하는 검사가 추가됐다. 문서 군살 정리에 직접 쓰인다.
- **`/commit-push-pr` push 원격 자동 허용** — `origin` 뿐 아니라 레포에 설정된 push 원격(`remote.pushDefault`, 또는 원격이 하나뿐이면 그 원격)으로의 `git push` 도 자동 허용한다.
- **Gateway `/login` 공용 엔드포인트 지원** — `/login` 이 Anthropic 운영 공용 gateway 엔드포인트를 지원한다.
- **`EnterWorktree` 진입 확인** — `.claude/worktrees/` 밖의 git worktree로 들어갈 때 확인을 먼저 묻는다.

## 🛠️ 개선/수정 (22건)
- **백그라운드 업그레이드** — 업데이트 직후 백그라운드 에이전트가 즉시 새 버전으로 올라간다. 접속 시 느린 오래된-세션 업그레이드를 안 겪는다.
- **만료 로그인 오류 메시지** — 만료된 로그인이 "There's an issue with the selected model" 로 오인시키지 않고 `/login` 을 안내하도록 고쳤다.
- **`--resume`/`--continue` 키 입력** — 시작 시 키보드 입력에 반응하지 않던 문제 수정.
- **MCP `request_timeout_ms` 무시** — `--mcp-config`/`.mcp.json` 서버별 타임아웃 설정이 무시돼 새 세션에서 60초에 걸리던 문제 수정.
- **`CLAUDE_CODE_EXTRA_BODY` 무시** — `claude agents`/`--bg` 워커에서 조용히 무시되던 override가 이제 디스패치 세션을 따라간다.
- **OAuth MCP 재인증** — 토큰 갱신 1회 실패 후 수동 재인증을 요구하던 문제 수정.
- **`--permission-prompt-tool` 크래시** — MCP 서버 연결 완료 전 콜드 스타트에서 "MCP tool not found" 로 죽던 문제 수정.
- **`/model` 가격 오표기** — 행 이름과 다른 모델 가격을 찍던 문제, 청구 안 하는 provider의 정가 표기를 중단.
- **`/model` 행 위치** — entitlement/allowlist 제약으로 기준 행이 빠질 때 서버 제공 행이 잘못 배치되던 문제 수정.
- **데스크톱 "running" 멈춤** — 턴 중간 슬래시 커맨드 전송 후 상태가 멈춰 있던 문제 수정.
- **Windows agents 뷰 키 입력** — 단독 `claude --resume` 앞에 설정 프롬프트가 뜰 때 입력이 무시되던 문제 수정.
- **`claude rm` 잔존** — 제거한 잡이 데몬 로스터에 남아 `claude agents` 에 다시 뜨던 문제 수정.
- **`/remote-control` 로그아웃** — "Unknown command" 대신 로그인 방법을 안내한다.
- **워크플로우 왼쪽 화살표** — phase/agent 밖으로 되돌아 나가지 못하던 문제 수정.
- **`/status` 중복 경고** — 동일한 설치 손상 경고를 두 번 나열하던 문제 수정.
- **LSP 미사용 오탐** — LSP 플러그인의 잘못된 "미사용 플러그인" 팁과 왜곡된 텔레메트리 수정.
- **`/doctor` Homebrew 채널** — 업데이트 검사가 settings 채널이 아니라 cask 채널과 비교하도록 수정.
- **전체화면 하단 이동 알약** — macOS에서 Ctrl+End 오제안, 재지정 단축키 미표시, 트랜스크립트 위 겹침 수정.
- **Bedrock 시작 멈춤** — egress 제한 네트워크에서 `awsCredentialExport` 헬퍼 사용 시 수 분 멈추던 문제 수정.
- **`/code-review` 품질** — claude-opus-4-8에서 모든 effort 레벨의 발견 품질 개선.
- **agents 뷰 너비** — 상태 열이 64자에서 잘리지 않고 터미널 전체 너비를 쓴다.
- **agents 뷰 Ctrl+X** — 완료 세션을 영구 제거하고, 세션 이중 렌더링 제거, 삭제된 백그라운드 잡은 삭제 상태 유지.

## 🔑 이번 버전의 핵심 키워드
**"안정화 릴리스 — MCP·로그인·agents 뷰 버그를 대거 잡고 `/doctor`로 CLAUDE.md 군살까지 제안한다."**

---

# 📜 원문 (한글 번역본)

> 원문 ChangeLog를 원래 순서 그대로 한 줄도 빠짐없이 번역한 문서입니다.

- `/cd` 에 디렉터리 경로 제안을 추가했다 — `/add-dir` 동작과 동일하게.
- Claude가 코드베이스에서 유도할 수 있는 내용을 잘라내 커밋된 `CLAUDE.md` 파일을 줄이도록 제안하는 `/doctor` 검사를 추가했다.
- `/commit-push-pr` 이 이제 `origin` 외에도 레포에 설정된 push 원격(`remote.pushDefault`, 또는 원격이 하나뿐일 때 그 원격)으로의 `git push` 를 자동 허용한다.
- Gateway: `/login` 이 이제 Anthropic이 운영하는 공용 gateway 엔드포인트를 지원한다.
- `EnterWorktree` 가 이제 프로젝트의 `.claude/worktrees/` 디렉터리 밖에 있는 git worktree로 진입하기 전에 확인을 묻는다.
- 백그라운드 에이전트가 이제 Claude Code 업데이트 직후 백그라운드에서 새 버전으로 업그레이드한다 — 접속할 때 느린 오래된 세션 업그레이드를 치르는 대신.
- 만료된 로그인이 `/login` 실행을 안내하는 대신 모든 모델에 대해 오해를 부르는 "There's an issue with the selected model" 오류로 실패하던 문제를 수정했다.
- `claude --resume` 와 `--continue` 가 시작 시 키보드 입력에 반응하지 않던 문제를 수정했다.
- `--mcp-config` 또는 `.mcp.json` 로 설정한 MCP 서버가 서버별 `request_timeout_ms` 를 무시해, 새 세션에서 오래 걸리는 MCP 도구 호출이 기본값 60초에 타임아웃되던 문제를 수정했다.
- `CLAUDE_CODE_EXTRA_BODY` 가 `claude agents` / `--bg` 백그라운드 워커에서 조용히 무시되던 문제를 수정했다 — 셸에서 export한 override가 이제 디스패치한 세션을 따라간다.
- OAuth MCP 서버가 토큰 갱신에 한 번 실패한 뒤 수동 재인증을 요구하던 문제를 수정했다.
- MCP 서버를 가리키는 `--permission-prompt-tool` 이 서버 연결이 끝나기 전 콜드 스타트에서 "MCP tool not found" 로 크래시하던 문제를 수정했다.
- `/model` 선택기 행이 해당 행 이름과 다른 모델의 가격을 출력하던 문제를 수정하고, 청구하지 않는 provider에서 자사 정가를 표시하던 것을 중단했다.
- entitlement 또는 allowlist 제약이 기준이 되던 행을 제거할 때 서버가 제공한 모델 행이 `/model` 선택기에서 잘못 배치되던 문제를 수정했다.
- 턴 중간에 슬래시 커맨드를 보낸 뒤 데스크톱 세션이 "running" 표시에 멈춰 있던 문제를 수정했다.
- Windows에서 단독 `claude --resume` 앞에 설정 프롬프트가 나타날 때 agents 뷰에서 키보드 입력이 무시되던 문제를 수정했다.
- `claude rm` 이 제거한 잡을 데몬 로스터에 남겨 `claude agents` 에서 그 행이 다시 나타나던 문제를 수정했다.
- 로그아웃 상태에서 `/remote-control` 이 "Unknown command" 를 표시하던 문제를 수정했다 — 이제 로그인 방법을 안내한다.
- 워크플로우 상세 뷰에서 왼쪽 화살표가 phase나 agent 밖으로 되돌아 나가지 못하던 문제를 수정했다.
- `/status` 가 동일한 설치 손상 경고를 두 번 나열하던 문제를 수정했다.
- LSP 플러그인에 대한 잘못된 "미사용 플러그인(disused plugin)" 팁과 왜곡된 미사용 텔레메트리를 수정했다.
- `/doctor` 의 업데이트 검사가 Homebrew 설치를 settings 채널이 아니라 해당 cask의 채널과 비교하도록 수정했다.
- 전체화면 맨 아래로 이동 알약(pill)이 macOS에서 Ctrl+End를 제안하고, 재지정된 단축키(chord)를 표시하지 않으며, 트랜스크립트 위로 겹쳐 나오던 문제를 수정했다.
- Bedrock: egress가 제한된 네트워크에서 `awsCredentialExport` 헬퍼를 사용할 때 수 분간 시작이 멈추던 문제를 수정했다.
- 모든 effort 레벨에서 claude-opus-4-8의 `/code-review` 발견 품질을 개선했다.
- agents 뷰 개선: 상태 열이 이제 64자에서 잘리는 대신 터미널 전체 너비를 사용한다.
- agents 뷰 변경: Ctrl+X가 이제 완료된 세션을 영구 제거하고, 세션이 더 이상 두 번 렌더링되지 않으며, 삭제된 백그라운드 잡은 삭제된 상태로 유지된다.

---

## 🎯 챌린지

이번 버전에서 내 환경에 적용해볼 만한 항목입니다.

### 1. `/doctor` 로 프로젝트 CLAUDE.md 군살 빼기
- **파일**: `/Users/leeseonro/Document/BE/CLAUDE.md` (및 `module-*/CLAUDE.md`)
- **근거**: 이번 버전에 커밋된 `CLAUDE.md` 에서 코드베이스로부터 유도 가능한 내용을 잘라내자고 제안하는 `/doctor` 검사가 추가됐다. 프로젝트 CLAUDE.md가 표·모듈 구조·서픽스 목록으로 상당히 크다. `/doctor` 실행 → 제안 검토 후 코드에서 자명한 부분을 걷어내면 매 세션 로딩되는 컨텍스트가 줄어, 80% 경고를 띄우는 `context_fill_degradation` hook에도 직접 도움이 된다.
- **난이도**: ★★☆ (약 15분)

### 2. playwright MCP 에 `request_timeout_ms` 명시
- **파일**: `~/.claude.json` 의 `mcpServers.playwright` (또는 프로젝트 `.mcp.json`)
- **근거**: 이번 버전에서 서버별 `request_timeout_ms` 가 새 세션에서 무시돼 60초에 타임아웃되던 버그가 수정됐다. `qa-agent` 가 playwright로 브라우저를 조작하는 시나리오는 60초를 쉽게 넘긴다. 서버 설정에 `"request_timeout_ms": 180000` 같은 값을 명시해두면 긴 스냅샷·네비게이션 도중 끊기지 않는다.
- **난이도**: ★☆☆ (약 5분)

### 3. `/commit-push-pr` 자동 push 대상 확인
- **파일**: `.git/config` (`remote.pushDefault` 확인)
- **근거**: 이번 버전부터 `/commit-push-pr` 이 `origin` 뿐 아니라 `remote.pushDefault`·단일 원격으로도 `git push` 를 자동 허용한다. "feature 브랜치는 로컬 전용, `dev`만 push" 정책과 어긋날 수 있으니 현재 레포의 push 원격이 무엇인지 `git config --get remote.pushDefault` 로 한 번 확인한다. deploy-guard hook이 최종 차단하긴 하지만, 자동 허용 대상이 어디인지 알아두면 의도치 않은 push를 사전에 막는다.
- **난이도**: ★☆☆ (약 5분)
