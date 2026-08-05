# Claude Code v2.1.216

> 작성일: 2026-08-06

---

# 📋 요약본

## 🎉 신기능 (1건)
- **`sandbox.filesystem.disabled` 설정 추가** — 파일시스템 격리는 건너뛰면서 네트워크 송신(egress) 통제는 유지한다. 파일 접근 제약 없이 외부 네트워크 통신만 막고 싶을 때 쓴다.

## 🛠️ 개선/수정 (39건)
- **긴 세션 성능 회복** — 메시지 정규화 비용이 턴 수에 따라 제곱으로 늘어나 수 초 멈춤·느린 resume를 유발하던 문제 수정.
- **auto 모드 OAuth 만료 오분류 수정** — 세션 중 토큰 만료·교체 시 `HTTP 401` 분류 오류로 명령을 거부하던 문제 해결.
- **AskUserQuestion 어조 수정** — 답변이 "기다리라/먼저 설명하라"였는데도 계속 진행하라고 지시하던 문제. 자유 서술 답변은 중립 어조로 처리.
- **웹 세션 질문 중복 수정** — 몇 분 유휴 후 같은 질문을 다시 묻고 답을 버리던 문제 해결.
- **@-멘션·vim·statusline·resume 다발 수정** — 파일 수정 hook 이후 @-멘션이 아무것도 첨부 못 하던 것, `c` 연산자와 붙여넣기의 vim dot-repeat, resume 시 statusline 2회 실행, 실패 시 resume 선택창 멈춤 수정.
- **background agent 세션 resume 시 에이전트 복원** — 기본 에이전트로 되돌아가던 문제. 프롬프트·도구 제한을 함께 복원.
- **worktree 격리 subagent의 git 리다이렉트 차단** — `git -C`·`--git-dir`·`GIT_DIR`/`GIT_WORK_TREE`로 공유 체크아웃에 git을 돌리던 문제 수정.
- **worktree 세션 오배치 수정** — 작업 디렉터리가 선택 프로젝트와 안 맞을 때 다른 프로젝트의 잔여 worktree에 들어가던 문제 해결.
- **git 없는 worktree background 세션 삭제 가능화** — 삭제 불가였던 문제 수정.
- **`claude daemon stop --any` 오종료 방지** — 오래된 레거시 daemon lockfile로 무관한 프로세스를 종료할 수 있던 문제 해결.
- **유휴 프롬프트 Esc-Esc rewind 선택창** — background 작업이 있는 장시간 세션에서 열리지 않던 문제 수정.
- **Bash 복합 명령 권한 검사 수정** — `&&` 리스트나 부정(negation) 안의 리다이렉트가 있는 복합 문 검사 수정.
- **agent 목록 Ctrl+X 삭제 수정** — Ctrl+X 두 번으로 세션 삭제가 실패하던 것, background worker가 죽은 삭제 세션이 되살아나던 문제 해결.
- **background subagent 시작창 취소 방지** — 시작 중 고우선순위 메시지 도착 시 취소되던 문제 수정.
- **GUI 에디터 열림 중 터미널 잔상 수정** — `/memory`·`/plan`·`/keybindings`·Ctrl+G 에디터 사용 중 마우스·포커스 잔상 제거. `/memory`는 에디터 종료를 더 이상 기다리지 않음.
- **Claude-in-Chrome 403 루프 수정** — 재접속 시 세션 OAuth 토큰에 필요한 scope가 없으면 403이 반복되던 문제 해결.
- **`.claude` 심링크 경유 쓰기 차단** — workflow 저장·예약 작업 쓰기가 `.claude` 심링크를 따라 프로젝트 밖으로 리다이렉트되던 문제 수정.
- **MCP 재인증 순서 수정** — 새 로그인 성공 전 정상 자격 증명을 폐기하던 문제, background 세션의 재인증 안내가 쓸 수 없는 명령을 가리키던 문제 해결.
- **Windows 읽기 전용 명령의 네트워크 경로 접근 수정** — 권한 프롬프트 없이 접근하던 문제 해결.
- **Bash 비-ASCII 문자 파싱 수정** — 실제 셸 단어 경계와 일치하도록 파싱 개선.
- **PowerShell 도구 권한 검증 수정** — 보이지 않는 유니코드 문자가 포함된 명령의 검증 수정.
- **전체화면 다이얼로그 우측 넘침 수정** — 패널 오른쪽 끝을 넘어 늘어나던 문제 해결.
- **전체화면 `/config` 설정 목록 수정** — 키보드 힌트 푸터가 잘리던 문제 해결.
- **transcript 모드(Ctrl+O) 푸터 힌트 수정** — 104컬럼 미만 터미널에서 줄바꿈되던 문제 해결.
- **Prometheus 메트릭 엔드포인트 수정** — `OTEL_METRICS_EXPORTER=prometheus`가 잘못된 `# UNIT` 줄을 방출하던 문제 해결.
- **세션 중 변경한 skill·command 반영** — 재시작 전까지 슬래시 메뉴에 안 뜨던 문제 수정.
- **플러그인 skill 접두어 보존** — `name` frontmatter가 있는 플러그인 skill이 슬래시 자동완성에서 플러그인 접두어를 잃던 문제 해결.
- **텔레메트리 권한 거부 오보고 수정** — 실패한 권한 프롬프트 요청을 사용자 거부로 세지 않도록, 사용자 인터럽트는 거부가 아닌 중단(abort)으로 보고.
- **`/fork` 확인 한 줄로 개선** — 새 세션 이름·`claude attach` id 표기, 체크아웃 공유 시 안내 문구 추가.
- **PowerShell 도구 `git`·`gh` 인자 검증 개선.**
- **`/ultrareview` diff 초과 오류 개선** — 설정 한도·측정된 diff 크기·최다 기여 파일 표시.
- **`/code-review ultra` 빈 diff 메시지 개선** — 정확한 base ref 명시 및 명시적 base 전달 제안.
- **spend limit 조정 프롬프트 개선** — 변경 거부 시 서버 사유 표시.
- **`/context` 및 `/compact` 개선** — 대화가 컨텍스트 윈도우를 초과하면 명시적 경고 표시, 실패한 `/compact`는 오류로 표시.
- **`/rewind` 심링크·하드링크 보호** — 추적 경로의 심링크·하드링크로 파일을 복원·삭제하지 않고, 건너뛴 경로 수를 보고.
- **background 세션 입력 대기 처리** — 클라이언트 미연결 시 `/mcp`·`/install-github-app`이 agent 뷰에 "입력 필요" 요청을 등록.
- **번들 dataviz skill 갱신** — 기본 차트 팔레트 순서 재정렬, 4계열 차트에 직접 라벨을 권하던 안내 수정.
- **[VSCode] 우측-좌측 텍스트 렌더링 수정** — 아랍어·히브리어·페르시아어가 영어·코드와 섞일 때 순서가 뒤집히던 문제 해결.
- **클라우드 세션 in-flight 메시지 유실 수정** — 턴 도중 컨테이너 재시작 시 메시지를 버리던 문제. 중단된 턴을 resume 시 재실행.

## 🔑 이번 버전의 핵심 키워드
**"worktree·resume·권한 검사의 안전성 대청소"** — 신규 sandbox 옵션 하나를 제외하면 대부분 격리·복원·권한 처리의 조용한 버그를 걷어낸 안정화 릴리스.

---

# 📜 원문 (한글 번역본)

> 원문 ChangeLog를 원래 순서 그대로 한 줄도 빠짐없이 번역한 문서입니다.

- 파일시스템 격리는 건너뛰면서 네트워크 송신 통제는 유지하는 `sandbox.filesystem.disabled` 설정 추가
- 긴 세션에서 메시지 정규화 비용이 턴 수에 따라 제곱으로 증가해 수 초 멈춤과 느린 resume를 유발하던 성능 저하 수정
- OAuth 토큰이 세션 도중 만료·교체된 뒤 auto 모드가 "HTTP 401" 분류 오류로 명령을 거부하던 문제 수정
- 답변이 먼저 기다리거나 설명하라고 요청했는데도 AskUserQuestion이 Claude에게 계속 진행하라고 지시하던 문제 수정 — 이제 자유 서술 답변은 중립적 어조로 처리됨
- 세션이 몇 분간 유휴 상태였다가 웹의 Claude Code가 같은 질문을 다시 묻고 답변을 버리던 문제 수정
- 파일 수정 hook 이후 @-멘션이 아무것도 첨부하지 않던 것, `c` 연산자와 붙여넣기의 vim dot-repeat, resume 시 statusline이 두 번 실행되던 것, 실패 시 resume 선택창이 멈추던 문제 수정
- resume된 background agent 세션이 기본 에이전트로 되돌아가던 문제 수정: 이제 에이전트의 프롬프트와 도구 제한이 복원됨
- worktree 격리 subagent가 `git -C`, `--git-dir`, `GIT_DIR`/`GIT_WORK_TREE`를 통해 git을 공유 체크아웃으로 리다이렉트하던 문제 수정
- 작업 디렉터리가 선택한 프로젝트와 일치하지 않을 때 worktree 세션이 다른 프로젝트의 잔여 worktree에 들어가던 문제 수정
- worktree에 git 저장소가 없는 background 세션이 삭제 불가하던 문제 수정
- 오래된 레거시 daemon lockfile을 통해 `claude daemon stop --any`가 무관한 프로세스를 종료할 수 있던 문제 수정
- background 작업이 있는 장시간 세션에서 유휴 프롬프트의 Esc-Esc가 rewind 선택창을 열지 않던 문제 수정
- `&&` 리스트나 부정 안에 리다이렉트가 있는 복합 문에 대한 Bash 명령 권한 검사 수정
- agent 목록에서 Ctrl+X를 두 번 눌러도 세션 삭제가 실패하던 것, 그리고 background worker가 죽은 삭제된 세션이 다시 나타나던 문제 수정
- 시작 창(startup window) 동안 고우선순위 메시지가 도착하면 background subagent가 취소되던 문제 수정
- `/memory`, `/plan`, `/keybindings`, Ctrl+G에서 연 GUI 에디터가 열려 있는 동안 터미널의 마우스·포커스 잔상 문제 수정; `/memory`는 더 이상 에디터가 닫힐 때까지 기다리지 않음
- 세션의 OAuth 토큰에 필요한 scope가 없을 때 재접속 시 Claude-in-Chrome이 403 루프에 빠지던 문제 수정
- workflow 저장과 예약 작업 쓰기가 `.claude`의 심링크를 따라가 프로젝트 밖으로 쓰기를 리다이렉트할 수 있던 문제 수정
- MCP 재인증이 새 로그인 성공 전에 정상 작동하는 자격 증명을 폐기하던 것, 그리고 background 세션의 재접속 인증 필요 메시지가 사용할 수 없는 명령을 가리키던 문제 수정
- Windows에서 읽기 전용 명령이 권한 프롬프트 없이 네트워크 경로에 접근하던 문제 수정
- 실제 셸 단어 경계와 일치하도록 Bash 명령의 비-ASCII 문자 파싱 수정
- 보이지 않는 유니코드 문자가 포함된 명령에 대한 PowerShell 도구 권한 검증 수정
- 전체화면 모드에서 다이얼로그가 패널의 오른쪽 끝을 넘어 늘어나던 문제 수정
- 전체화면 모드에서 `/config` 설정 목록이 키보드 힌트 푸터를 잘라내던 문제 수정
- 104컬럼보다 좁은 터미널에서 transcript 모드(Ctrl+O) 푸터 힌트가 줄바꿈되던 문제 수정
- Prometheus 메트릭 엔드포인트(`OTEL_METRICS_EXPORTER=prometheus`)가 잘못된 `# UNIT` 줄을 방출하던 문제 수정
- 세션 중 변경된 skill과 command가 재시작 전까지 슬래시 메뉴에 나타나지 않던 문제 수정
- `name` frontmatter 필드가 있는 플러그인 skill이 슬래시 명령 자동완성에서 플러그인 접두어를 잃던 문제 수정
- 권한 거부에 대한 텔레메트리 오보고 수정: 실패한 권한 프롬프트 요청은 더 이상 사용자 거부로 집계되지 않으며, 사용자 인터럽트는 거부가 아닌 사용자 중단(abort)으로 보고됨
- `/fork` 확인을 새 세션 이름, `claude attach` id, 그리고 사본이 체크아웃을 공유할 때의 안내와 함께 한 줄로 개선
- PowerShell 도구에서 `git`과 `gh` 명령 인자 검증 개선
- `/ultrareview`의 diff 초과 오류를 설정된 한도, 측정된 diff 크기, 최다 기여 파일과 함께 표시하도록 개선
- `/code-review ultra`의 빈 diff 메시지를 정확한 base ref를 명시하고 명시적 base 전달을 제안하도록 개선
- spend limit 조정 프롬프트가 spend limit 변경이 거부될 때 서버의 사유를 표시하도록 개선
- `/context`가 대화가 컨텍스트 윈도우를 초과할 때 명시적 경고를 표시하고, 실패한 `/compact`가 오류로 표시됨
- `/rewind`가 추적 경로의 심링크나 하드링크를 통해 파일을 복원·삭제하지 않고, 건너뛴 경로 수를 보고함
- background 세션: 클라이언트가 연결되지 않았을 때 `/mcp`와 `/install-github-app`이 agent 뷰에 "입력 필요" 요청을 등록함
- 번들 dataviz skill 갱신: 기본 차트 팔레트 순서를 재정렬하고 4계열 차트에 직접 라벨을 권하던 안내 수정
- [VSCode] 우측-좌측 텍스트(아랍어, 히브리어, 페르시아어)가 영어나 코드와 섞일 때 잘못된 순서로 렌더링되던 문제 수정
- 세션의 컨테이너가 턴 도중 재시작될 때 클라우드 세션이 in-flight 메시지를 버리던 문제 수정 — 중단된 턴이 이제 세션을 무응답 상태로 남기는 대신 resume 시 재실행됨

---

## 🎯 챌린지

이번 버전에서 내 환경에 적용해볼 만한 항목입니다.

### 1. sandbox 네트워크 송신 통제 도입
- **파일**: `~/.claude/settings.json`
- **근거**: 이번 버전에 추가된 `sandbox.filesystem.disabled`는 파일 접근 제약 없이 네트워크 송신만 통제한다. §6 Deploy 정책에서 시크릿 유출·외부 노출을 직접 확인하는데, 세션이 의도치 않게 외부로 데이터를 보내는 경로를 sandbox로 한 겹 막아두면 방어선이 는다. `sandbox` 블록에 `"filesystem": { "disabled": true }`와 egress 허용 목록을 넣어 파일 작업은 그대로 두고 통신만 제한한다.
- **난이도**: ★★☆ (약 15분)

### 2. Bash 허용목록 정리로 권한 프롬프트 감축
- **파일**: `~/.claude/settings.json` (또는 프로젝트 `.claude/settings.json`)
- **근거**: 이번 버전이 복합 문(`&&`·부정 안 리다이렉트)과 비-ASCII 문자의 Bash 권한 검사를 수정해 권한 판정이 더 정확해졌다. `deploy-guard.sh` hook과 잦은 Bash 사용 환경에서 `/fewer-permission-prompts`로 자주 쓰는 읽기 전용 명령을 허용목록에 추가하면 반복 프롬프트가 줄고, 개선된 검사 로직 위에서 안전하게 동작한다.
- **난이도**: ★☆☆ (약 10분)
