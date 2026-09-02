# Claude Code v2.1.259

> 작성일: 2026-09-03

---

# 📋 요약본

## 🎉 신기능 (5건)
- **`managedMcpServers` 관리 설정** — 조직이 모든 사용자에게 HTTP/SSE MCP 서버를 배포할 수 있다. 항목 형식은 `.mcp.json`과 동일하다. 실행할 커맨드를 지정한 항목은 무시한다.
- **`--permission-prompts none`** — 무인 헤드리스 환경용 플래그. 권한 확인창이 뜰 상황을 자동 거부한다. 현재 권한 모드(auto 모드 포함)의 판단은 그대로 유지된다.
- **GitLab MR 명령 인식** — `glab mr create/merge/close/reopen/note/update`를 인식한다. 접힌 도구 요약에 `MR !N`으로 표시되고 하단 MR 배지가 갱신된다.
- **`claude plugin validate --json`** — 검증 결과를 기계가 읽을 수 있는 JSON 리포트로 출력한다.
- **[VSCode] 세션 목록 필터** — 사이드바에 Active 빠른 필터와 상태 필터 메뉴(Needs input, Working, Completed)가 추가됐다.

## 🛠️ 개선/수정 (31건)
- **동시 세션의 `~/.claude.json` 덮어쓰기** — 여러 세션이 서로의 변경을 조용히 되돌리던 문제를 수정. 워크스페이스 신뢰 설정이 초기화되지 않고 MCP·프로젝트 상태도 유실되지 않는다.
- **thinking 거부 반복** — 한 번 thinking이 거부된 대화가 이후 모든 턴에서 계속 거부되던 문제를 수정.
- **Bash `Read()` deny 규칙 누락** — 옵션 값으로 준 파일(`--ignore-revs-file=.env`, `-f.env`, `@file`), `git diff`/`git grep`의 파일 인자, `cd DIR && cat FILE` 복합 명령이 deny 규칙에 걸리지 않던 문제를 수정. 거부 대상 파일이 든 디렉터리에 `grep -r`/`cp -r`을 걸면 이제 확인창이 뜬다.
- **OAuth 토큰 갱신 시 prompt cache 무효화** — 텔레메트리를 끈 세션에서 캐시가 깨지던 문제를 수정.
- **fullscreen 빈 화면** — 도구 호출이 수백 건인 긴 턴 이후 대화가 비어 보이던 문제를 수정.
- **auto 모드의 미지원 모델 실행** — 커맨드·스킬 frontmatter `model:`이 지정한 모델을 auto 모드가 그대로 쓰던 문제를 수정. 이제 세션 모델을 유지한다.
- **`CLAUDE_CODE_MAX_CONTEXT_TOKENS` 무시** — Claude Code가 모르는 모델 버전의 Vertex 스타일 ID(`@YYYYMMDD` 접미사)에서 무시되던 문제를 수정.
- **셸 명령 실시간 출력** — 앞 줄이 줄바꿈되면 최신 줄이 가려지던 문제를 수정.
- **GitHub 연결 확인** — claude.ai 사용자에게 매 실행마다 돌던 백그라운드 점검을 수정. 결과를 실행 간에 기억한다.
- **`--resume` 실패** — 저장된 세션에 payload 없는 첨부 항목이 있으면 `--resume`이 실패하고 `--continue`가 빈 대화를 열던 문제를 수정.
- **커스텀 커맨드·스킬의 frontmatter `model:`** — 대화형 세션에서 무시되던 문제를 수정.
- **Artifact 게시 오류** — 구버전에서 이어온 대화에서 "unexpected parameter `note`" 오류로 한 번 실패하던 문제를 수정.
- **`forceRemoteSettingsRefresh` 무시** — MDM이나 관리 설정 파일이 구성한 정책 헬퍼가 이미 실행된 경우 시작 시 무시되던 문제를 수정.
- **worktree 격리와 hook 생성 worktree** — `git rev-parse`가 "not a git repository" 외의 메시지로 실패하는 머신에서 거부되던 문제를 수정.
- **OpenTelemetry 속성 누락** — 클라우드 세션의 메트릭·이벤트에서 `user.email`, `organization.id`, `user.account_uuid`가 빠지던 문제를 수정.
- **MCP 서버 연결 끊김 표시** — 시작 시 도구 목록을 받는 중 끊긴 서버가 오류 대신 "도구 없는 연결됨"으로 보이던 문제를 수정.
- **파일 편집 권한 확인창** — 변경된 줄이 잘렸는데 아무 표시도 없던 문제를 수정.
- **레포 식별 유실** — 일시적 git 조회 실패 후 알던 레포 정체성을 버리던 문제를 수정.
- **관리 설정 미적용** — 관리 설정 파일·드롭인·MDM plist·HKLM 값을 파싱할 수 없을 때 조용히 무시되던 문제를 수정. 이제 시작을 거부하고 어느 소스가 문제인지 알려준다.
- **Stop이 백그라운드 작업을 멈추지 못함** — 원격 제어 세션에서 백그라운드 에이전트·워크플로우가 안 멈추던 문제를 수정. 종료된 작업은 프로세스가 끝날 때까지 보이고 다시 중지할 수 있다.
- **워크플로우 중복 실행** — 이전 중지된 실행이 아직 종료 중일 때 재개하면 에이전트가 중복 실행되던 문제를 수정.
- **마켓플레이스 URL 파싱** — github.com 주소 끝에 슬래시나 남은 `?`/`#`가 붙으면 쓸 수 없는 `.git` clone URL이 만들어지던 문제를 수정.
- **Stop hook 차단 시 reasoning 유실** — 차단 다음 턴에서 모델의 reasoning이 사라지고 일부 모델에선 prompt cache를 놓치던 문제를 수정.
- **원격 세션 60초 지연** — 브라우저에 떠 있던 MCP 서버 페이지가 사라진 뒤 claude.ai 세션이 턴 시작에 60초 걸리던 문제를 수정.
- **worktree 격리 세션의 명령 거부** — 메인 체크아웃에 접근할 수 없는 일반 Bash 루프, xargs 파이프라인, 런처로 감싼 명령을 거부하던 문제를 수정.
- **터미널 리사이즈·초기 렌더 성능** — 텍스트 측정값을 재사용해 긴 응답의 성능을 개선.
- **`/workflows` 에이전트 상세** — JSON 결과를 구문 색상과 실제 줄바꿈으로 정렬 출력하고, 긴 결과는 펼치기 토글 뒤로 접는다.
- **헤드리스/SDK 세션 시작** — MCP 서버 연결이 끝나면 첫 턴이 최대 50ms 빨리 시작한다.
- **`/install-github-app` 안내** — GitLab 레포에서 실행하면 GitHub 전용임을 알리고 GitLab CI/CD 문서를 가리킨다.
- **중첩 백그라운드 서브에이전트 결과** — 부모 서브에이전트 트랜스크립트에 저장된다. 재개한 서브에이전트가 결과를 유지하고 공유 트랜스크립트에도 전달 내역이 남는다.
- **`allowedMcpServers` 범위 변경** — 사용자가 직접 추가한 서버만 관리한다. allowlist가 걸러내던 `managed-mcp.json` 서버는 업그레이드 후 로드된다. 끄려면 `deniedMcpServers`를 쓴다.
- **원격·예약 세션 무응답** — 세션이 일시정지된 동안 커넥터 도구 권한이 승인되면 이후 아무 동작도 안 하던 문제를 수정.

## 🔑 이번 버전의 핵심 키워드
**"조직 배포와 무인 실행의 안정화"** — 관리 설정·MCP 정책이 조용히 실패하지 않고, 동시 세션·헤드리스·원격 실행의 상태 유실이 대거 정리됐다.

---

# 📜 원문 (한글 번역본)

> 원문 ChangeLog를 원래 순서 그대로 한 줄도 빠짐없이 번역한 문서입니다.

- `managedMcpServers` 관리 설정 추가: 조직이 모든 사용자에게 HTTP/SSE MCP 서버를 제공할 수 있다(항목 형태는 `.mcp.json`과 동일). 실행할 커맨드를 지정한 항목은 건너뛴다
- 무인 헤드리스 호스트용 `--permission-prompts none` 추가: 확인창이 뜰 만한 것은 자동으로 거부되며, 현재 권한 모드(auto 모드 포함)의 판단은 그대로 유지된다
- `glab mr create/merge/close/reopen/note/update` 인식 추가: GitLab merge request가 접힌 도구 요약에 `MR !N`으로 표시되고 하단 MR 배지가 갱신된다
- `claude plugin validate`에 `--json` 추가: 기계가 읽을 수 있는 검증 리포트 출력
- 동시 세션이 서로의 `~/.claude.json` 변경을 조용히 되돌리던 문제 수정 — 워크스페이스 신뢰가 초기화되지 않고, 여러 세션을 동시에 실행해도 MCP·프로젝트 상태가 유실되지 않는다
- thinking이 한 번 거부된 대화가 이후 모든 턴에서 다시 거부되던 문제 수정
- Bash `Read()` deny 규칙이 옵션 값으로 주어진 파일(`--ignore-revs-file=.env`, `-f.env`, `@file`), `git diff`/`git grep`의 파일 인자, `cd DIR && cat FILE` 복합 명령을 포함하지 못하던 문제 수정. 거부된 파일이 들어 있는 디렉터리에 대한 `grep -r`/`cp -r`은 이제 확인을 요청한다
- 텔레메트리를 비활성화한 세션에서 OAuth 토큰이 갱신될 때 prompt cache가 무효화되던 문제 수정
- 도구 호출이 수백 건인 긴 턴 이후 fullscreen 모드에서 대화가 빈 화면으로 보이던 문제 수정
- 커맨드나 스킬의 frontmatter `model:`이 지정한 모델을 auto 모드가 지원하지 않는데도 그 모델로 턴을 실행하던 문제 수정. 이제 세션 모델을 유지한다
- Claude Code가 인식하지 못하는 모델 버전의 Vertex 스타일 모델 ID(`@YYYYMMDD` 접미사)에서 `CLAUDE_CODE_MAX_CONTEXT_TOKENS`가 무시되던 문제 수정
- 실행 중인 셸 명령의 실시간 출력 미리보기에서 앞선 줄이 줄바꿈되면 최신 줄이 가려지던 문제 수정
- claude.ai 사용자에게 매 실행마다 돌던 백그라운드 GitHub 연결 확인 문제 수정. 결과가 실행 간에 기억된다
- 저장된 세션에 payload 없는 첨부 항목이 있을 때 `--resume`이 실패하고 `--continue`가 빈 대화를 열던 문제 수정
- 대화형 세션에서 커스텀 커맨드와 스킬의 frontmatter `model:`이 무시되던 문제 수정
- 구버전에서 이어온 대화에서 Artifact 게시가 "unexpected parameter `note`" 오류로 한 번 실패하던 문제 수정
- MDM이나 관리 설정 파일이 구성한 정책 헬퍼가 이미 실행된 경우, 시작 시 관리 설정 `forceRemoteSettingsRefresh`가 무시되던 문제 수정
- `git rev-parse`가 "not a git repository" 외의 메시지로 실패하는 머신에서 worktree 격리가 hook이 만든 worktree를 거부하던 문제 수정
- 클라우드 세션의 OpenTelemetry 메트릭·이벤트에 `user.email`, `organization.id`, `user.account_uuid` 속성이 빠지던 문제 수정
- 시작 시 도구 목록을 받는 도중 연결이 끊긴 MCP 서버가 오류를 보고하지 않고 도구 없는 연결 상태로 표시되던 문제 수정
- 파일 편집 권한 확인창에서 변경된 줄이 잘려 표시되는데 아무 표시도 없던 문제 수정
- 일시적인 git 조회 실패 후 레포 감지가 이미 알고 있던 레포 정체성을 버리던 문제 수정
- 관리 설정 파일, 드롭인, MDM plist, HKLM 값을 파싱할 수 없을 때 관리 설정이 조용히 적용되지 않던 문제 수정: 이제 Claude Code가 시작을 거부하고 어느 소스가 문제인지 알려준다
- 원격 제어 세션에서 Stop이 백그라운드 에이전트와 워크플로우를 실제로 멈추지 못하던 문제 수정: 종료된 작업은 프로세스가 끝날 때까지 계속 표시되고 다시 중지할 수 있다
- 이전에 중지된 실행이 아직 종료되는 중에 워크플로우 실행을 재개하면 에이전트가 중복 실행될 수 있던 문제 수정
- github.com 마켓플레이스 레포 URL 끝에 슬래시나 남은 `?`/`#`가 붙어 쓸 수 없는 `.git` clone URL이 만들어지던 문제 수정
- 차단하는 Stop hook 때문에 차단 다음 턴에서 모델의 reasoning이 유실되고 일부 모델에서는 prompt cache를 놓치던 문제 수정
- 브라우저에 떠 있던 MCP 서버 페이지가 사라진 뒤 원격(claude.ai) 세션이 턴 시작에 60초가 걸리던 문제 수정
- worktree로 격리된 세션이 메인 체크아웃에 접근할 수 없는 일반적인 Bash 루프, xargs 파이프라인, 런처로 감싼 명령을 거부하던 문제 수정
- 텍스트 측정값을 재사용해 긴 응답의 터미널 리사이즈·초기 렌더 성능 개선
- `/workflows` 에이전트 상세 개선: JSON 결과가 구문 색상과 실제 줄바꿈으로 보기 좋게 출력되고, 긴 결과는 펼치기 토글 뒤로 접힌다
- 헤드리스/SDK 세션 시작 개선: MCP 서버 연결이 끝나면 첫 턴이 최대 50ms 더 빨리 시작한다
- `/install-github-app` 개선: GitLab 레포 안에서 실행하면 GitHub 전용임을 설명하고 GitLab CI/CD 문서를 가리킨다
- 중첩된 백그라운드 서브에이전트 결과가 부모 서브에이전트의 트랜스크립트에 저장되도록 개선. 재개된 서브에이전트가 결과를 유지하고 공유된 트랜스크립트에도 전달 내역이 보인다
- `allowedMcpServers`가 사용자가 추가한 서버만 관리하도록 변경: allowlist가 걸러내던 `managed-mcp.json` 서버가 업그레이드 후 로드된다. 계속 끄려면 `deniedMcpServers`를 사용한다
- [VSCode] 세션 목록 사이드바에 Active 빠른 필터와 상태 필터 메뉴(Needs input, Working, Completed) 추가
- 세션이 일시정지된 동안 커넥터 도구 권한 확인이 승인되면 원격·예약 세션이 아무 동작도 하지 않던 문제 수정

---

## 🎯 챌린지

이번 버전에서 내 환경에 적용해볼 만한 항목입니다.

### 1. `.env` 등 시크릿 파일에 Bash `Read()` deny 규칙 추가
- **파일**: `~/.claude/settings.json`
- **근거**: 이번 버전에서 `Read()` deny 규칙이 `--ignore-revs-file=.env`, `-f.env`, `git diff` 파일 인자, `cd DIR && cat FILE`까지 잡도록 강화됐다. deny 규칙 자체가 없으면 이 수정의 혜택이 0이다. `permissions.deny`에 `Read(./.env)`, `Read(./**/.env*)`, `Read(./**/*.pem)`을 넣으면 CLAUDE.md §6의 "deploy 전 secret leak 직접 확인" 부담이 줄어든다.
- **난이도**: ★☆☆ (약 7분)

### 2. `deploy-guard.sh` hook 이후 reasoning 유실 확인
- **파일**: `~/.claude/hooks/deploy-guard.sh`
- **근거**: 차단하는 Stop hook 다음 턴에서 reasoning이 유실되고 prompt cache를 놓치던 버그가 수정됐다. 현재 `deploy-guard.sh`는 PreToolUse hook이지만 차단 동작을 하므로, 실제로 `git push origin feat/test`를 시도해 차단 메시지가 뜨고 이후 턴이 정상 동작하는지 한 번 확인한다. 차단 문구가 CLAUDE.md의 origin 표준(`dev`·`ext-dev`만 허용)과 일치하는지도 같이 점검.
- **난이도**: ★★☆ (약 15분)

### 3. Stop hook의 macOS 알림에 세션 구분 추가
- **파일**: `~/.claude/settings.json`
- **근거**: 동시 세션이 서로의 `~/.claude.json`을 덮어쓰던 버그가 고쳐져 멀티 세션 운용이 안전해졌다. 그런데 현재 Stop hook 알림은 모든 세션이 동일한 "작업이 완료되었습니다" 문구라 어느 세션이 끝났는지 알 수 없다. `subtitle`에 `$(basename "$PWD")`를 넣어 작업 디렉터리를 표시하면 병렬 세션에서 구분된다.
- **난이도**: ★☆☆ (약 8분)

### 4. `claude plugin validate --json`으로 플러그인 상태 점검
- **파일**: `~/.claude/settings.json` (`enabledPlugins` 정리)
- **근거**: `--json` 리포트가 새로 생겨 플러그인 검증 결과를 한눈에 볼 수 있다. 현재 `enabledPlugins`에 비활성 항목이 6개 쌓여 있고 마켓플레이스도 4개 등록돼 있다. `claude plugin validate --json`으로 각 플러그인 상태를 확인한 뒤, 다시 쓸 일 없는 항목과 대응하는 `extraKnownMarketplaces` 항목을 제거한다.
- **난이도**: ★★☆ (약 15분)
