# Claude Code v2.1.183

> 작성일: 2026-06-20

---

# 📋 요약본

## 🎉 신기능 (3건)
- **모델 deprecated 경고** — 요청한 모델이 지원 중단되었거나 자동으로 최신 모델로 교체되면 경고를 표시한다. print 모드(`-p`)의 stderr에 출력되며, 이제 agent frontmatter에 지정된 모델까지 포함해 검사한다.
- **`attribution.sessionUrl` 설정** — web·Remote Control 세션에서 커밋과 PR에 붙는 claude.ai 세션 링크를 생략할 수 있는 설정을 추가했다.
- **`/config --help`** — `/config key=value`에서 쓸 수 있는 모든 단축 키 목록을 출력하는 도움말을 추가했다.

## 🛠️ 개선/수정 (14건)
- **auto mode 안전성 강화** — 파괴적 git 명령(`git reset --hard`, `git checkout -- .`, `git clean -fd`, `git stash drop`)은 로컬 작업 폐기를 요청하지 않은 경우 차단되고, `git commit --amend`는 이번 세션에서 에이전트가 만든 커밋이 아니면 차단되며, `terraform destroy`/`pulumi destroy`/`cdk destroy`는 해당 스택을 명시적으로 요청하지 않으면 차단된다.
- **`/config` 토글 동작 변경** — Enter와 Space 모두 선택한 설정을 변경하고, Esc는 되돌리지 않고 저장 후 닫는다.
- **시작 화면 "setup issues" 줄 제거** — 로고 아래에 표시되던 줄을 제거했다. 설정 문제는 `/doctor` 또는 `--debug`로 확인한다.
- **`thinking.disabled.display` 400 오류 수정** — 서브에이전트 생성과 세션 제목 생성 시 발생하던 `Extra inputs are not permitted` 오류를 고쳤다.
- **서브에이전트 WebSearch 빈 결과 수정** — 서브에이전트에서 WebSearch가 빈 결과를 반환하던 문제를 고쳤다.
- **vim 모드 커서 수정** — 네이티브 커서가 켜진 vim 모드에서 히스토리 탐색 후 터미널 커서가 프롬프트 위에 멈춰 있던 문제를 고쳤다.
- **Windows Terminal 풀스크린 TUI 깨짐 수정** — 중첩 서브에이전트 부하가 큰 상황에서 발생하던 statusline 위치 이상, 스피너 행 중복, 텍스트 병합 문제를 고쳤다.
- **thinking 블록만 반환 시 무출력 수정** — 모델이 thinking 블록만 반환해 턴이 출력 없이 조용히 끝나던 문제를 고쳤다. 이제 한 번 재프롬프트한다.
- **스킬 중복 노출 수정** — 여러 플러그인이 켜진 상태에서 user 레벨 스킬이 슬래시 명령 자동완성에 여러 번 나타나던 문제를 고쳤다.
- **MCP auth-stub 도구 노출 수정** — headless/SDK 모드에서 인증이 필요한 MCP 서버가 모델에 auth-stub 도구를 노출하던 문제를 고쳤다.
- **tmux teammate pane 수정** — 셸 rc 파일 초기화가 느릴 때 teammate pane이 실행되지 않던 문제와, 에이전트 생성 중 입력한 키가 새 tmux pane으로 새어 들어가던 문제를 고쳤다.
- **teammate 백그라운드 작업 종료 수정** — teammate가 시작한 백그라운드 작업이 teammate가 턴을 마칠 때 종료되던 문제를 고쳤다.
- **예약 작업·웹훅 전달 분류 수정** — 예약 작업과 웹훅 트리거 전달이 키보드 입력으로 취급되던 문제를 고쳤다. 이제 task notification으로 분류되며, auto mode에서 대기 중인 동작을 승인하거나 세션 제목을 설정할 수 없다.
- **focus mode 훅 타이밍 줄 수정** — 응답마다 "Ran N PostToolUse hooks" 타이밍 줄이 표시되던 문제를 고쳤다.

## 🔑 이번 버전의 핵심 키워드
**"auto mode가 파괴적 명령에 손대지 못하도록 잠그고, 훅·서브에이전트·MCP의 누수 동작을 정리했다"** — 안전 가드와 자동화 안정성에 집중한 버전.

---

# 📜 원문 (한글 번역본)

> 원문 ChangeLog를 원래 순서 그대로 한 줄도 빠짐없이 번역한 문서입니다.

- auto mode 안전성 개선: 로컬 작업 폐기를 요청하지 않았을 때 파괴적 git 명령(`git reset --hard`, `git checkout -- .`, `git clean -fd`, `git stash drop`)이 차단되고, `git commit --amend`는 이번 세션에서 에이전트가 만든 커밋이 아니면 차단되며, `terraform destroy`/`pulumi destroy`/`cdk destroy`는 특정 스택을 요청하지 않는 한 차단된다
- 요청한 모델이 deprecated되었거나 자동으로 최신 모델로 업데이트될 때 경고를 추가했다. print 모드(`-p`)의 stderr에 표시되며, 이제 agent frontmatter에 설정된 모델도 포함한다
- web 및 Remote Control 세션에서 커밋과 PR의 claude.ai 세션 링크를 생략하는 `attribution.sessionUrl` 설정을 추가했다
- `/config key=value`의 모든 단축 키를 나열하는 `/config --help`를 추가했다
- `/config` 토글 동작 변경: Enter와 Space 모두 선택한 설정을 변경하고, Esc는 이제 되돌리지 않고 저장 후 닫는다
- 로고 아래의 시작 시 "setup issues" 줄을 제거했다 — 설정 문제는 `/doctor`로 확인하거나 `--debug`를 사용한다
- 특정 설정에서 서브에이전트 생성과 세션 제목 생성 시 발생하던 `thinking.disabled.display: Extra inputs are not permitted` 400 오류를 고쳤다
- 서브에이전트에서 WebSearch가 빈 결과를 반환하던 문제를 고쳤다
- 네이티브 커서가 활성화된 vim 모드에서 히스토리를 탐색한 후 터미널 커서가 프롬프트 위에 방치되던 문제를 고쳤다
- 중첩 서브에이전트 부하가 큰 Windows Terminal에서 풀스크린 TUI가 깨지던(statusline이 화면 중간에 표시, 스피너 행 중복, 텍스트 병합) 문제를 고쳤다
- 모델이 thinking 블록만 반환했을 때 출력 없이 턴이 조용히 완료되던 문제를 고쳤다. 이제 Claude가 한 번 재프롬프트한다
- 여러 플러그인이 활성화되었을 때 user 레벨 스킬이 슬래시 명령 자동완성에 여러 번 나타나던 문제를 고쳤다
- headless/SDK 모드에서 인증이 필요한 MCP 서버가 모델에 auth-stub 도구를 노출하던 문제를 고쳤다
- 셸의 rc 파일 초기화가 느릴 때 tmux teammate pane이 실행되지 않던 문제와, 에이전트 생성 중 입력한 키가 leader 프롬프트 대신 새 tmux pane으로 새어 들어가던 문제를 고쳤다
- teammate가 시작한 백그라운드 작업이 teammate가 턴을 마칠 때 종료되던 문제를 고쳤다
- 예약 작업과 웹훅 트리거 전달이 키보드 입력으로 취급되던 문제를 고쳤다. 이제 task notification으로 분류되며, auto mode에서 대기 중인 동작을 승인하거나 세션 제목을 설정할 수 없다
- focus mode에서 각 응답 아래에 "Ran N PostToolUse hooks" 타이밍 줄이 표시되던 문제를 고쳤다

---

## 🎯 챌린지

이번 버전에서 내 환경에 적용해볼 만한 항목입니다.

### 1. 커밋/PR에서 claude.ai 세션 링크 제거
- **파일**: `~/.claude/settings.json`
- **근거**: 이번 버전의 `attribution.sessionUrl` 설정을 추가하면 web·Remote Control 세션에서 만든 커밋·PR에 claude.ai 세션 링크가 붙지 않는다. `deploy-precheck`로 secret leak를 검사하는 환경에서, 내부 세션 URL이 공개 PR에 노출되는 것을 원천 차단한다.
- **난이도**: ★☆☆ (약 5분)

### 2. 커스텀 에이전트 frontmatter의 deprecated 모델 점검
- **파일**: `~/.claude/agents/*.md` (frontmatter `model:` 필드)
- **근거**: 이번 버전부터 deprecated 모델 경고가 agent frontmatter까지 검사한다. `qa-agent`·`review-agent` 등 커스텀 에이전트의 `model:` 값이 구형(`claude-3-*` 등)이면 자동 교체되므로, frontmatter를 열어 `claude-opus-4-8`/`claude-sonnet-4-6`/`claude-haiku-4-5`로 명시했는지 확인한다.
- **난이도**: ★★☆ (약 10분)

### 3. `/config --help`로 단축 키 정리
- **파일**: (실행만) `/config --help`
- **근거**: `/config key=value`에서 쓸 수 있는 전체 단축 키 목록을 새로 확인할 수 있다. `settings.json`을 직접 편집하는 대신 어떤 키를 토글 명령으로 다룰 수 있는지 파악해, 설정 관리 루틴을 단순화한다.
- **난이도**: ★☆☆ (약 5분)
