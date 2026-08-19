# Claude Code v2.1.234

> 작성일: 2026-08-19

---

# 📋 요약본

## 🎉 신기능 (8건)
- **`CLAUDE_CODE_PROJECT_DIR_NAME` 환경변수** — 세션마다 별도 config 디렉토리를 쓰는 호스트가 프로젝트별 transcript 디렉토리 이름을 짧게 지정할 수 있다.
- **`selection:clear` 키바인딩 액션** — 앱 내 텍스트 선택을 해제하는 키를 지정할 수 있다. agents 뷰에서도 동작한다.
- **GitLab MR 뱃지** — GitLab remote가 있고 `glab` CLI가 인증된 레포는 footer·statusline에 `MR !N`을 draft/pending/green 상태로 표시한다.
- **사용량 한도 리셋 시 자동 이어하기** — claude.ai 사용량 한도가 리셋되면 세션을 자동으로 재개한다. `/config`의 "Continue automatically at usage limit"에서 끌 수 있다.
- **`/permissions` 작업 중 열기** — Claude가 작업하는 도중에도 열 수 있고, 규칙 변경이 남은 턴에 즉시 적용된다.
- **`/add-dir` 등 다이얼로그 작업 중 열기** — `/add-dir`을 작업 중 쓸 수 있고, `/add-dir`·`/autocompact`·`/theme`·`/help`·`/config`·`/advisor`가 fullscreen TUI에서 턴 도중에도 열린다.
- **`/goal` 자동 정리·체크인** — 복구 불가 오류(인증 취소·크레딧 소진·컨텍스트 초과)로 턴이 죽으면 goal이 알림과 함께 스스로 해제된다. 백그라운드 작업이 goal을 30분 이상 붙잡으면 Claude가 상태를 확인한다(`CLAUDE_CODE_GOAL_CHECKIN_MINUTES=0`으로 해제).
- **원격 제어 확장** — Desktop·VS Code 호스팅 원격 세션이 권한 모드(및 claude.ai/code에는 모델)를 연결 기기에 계속 반영하고, 휴대폰·claude.ai/code에서 고른 effort가 터미널·Desktop·VS Code 세션에도 적용된다.

## 🛠️ 개선/수정 (35건)
- **계정 이메일 사용 제한** — Claude는 계정 이메일을 본인 식별 용도로만 쓰고, 요청하지 않는 한 무관한 서비스에 보내지 않는다.
- **보안: Windows NT 네임스페이스 경로 차단** — 원격 파일 읽기·세션 복원·CLAUDE.md include·workflow 스크립트·파일 업로드가 `\??\` 경로를 거부한다. NTLM 자격증명 유출 경로를 막는다.
- **auto 모드 반복 거부 수정** — 아주 긴 세션에서 컴팩션 이후 샌드박스 명령의 네트워크 접근을 반복 재검사·거부하던 문제를 고쳤다.
- **세션 범위 권한 응답 유실 수정** — 백그라운드 서브에이전트 권한 프롬프트에 답할 때 세션 범위 응답(거부 포함)이 버려지던 문제를 고쳤다.
- **비스트리밍 fallback 크래시 수정** — thinking 필드 없는 thinking 블록, text 필드 없는 text 블록이 오면 죽던 문제를 고쳤다(주로 서드파티 게이트웨이 경유).
- **마크다운 렌더링 속도** — 특이한 유니코드 시퀀스가 든 메시지에서 극도로 느려지던 문제를 고쳤다.
- **`SendMessage` 수신자 거부 수정** — `ListAgents`에서 복사한 이름이 200자 상한이거나 이모지가 많으면 거부되던 문제를 고쳤다.
- **git remote 호스트 오독 수정** — 특이한 userinfo가 붙은 remote의 호스트를 잘못 읽어 엉뚱한 호스트용 링크·동작을 내던 문제를 고쳤다.
- **MCP 진단의 시크릿 노출 수정** — scope 충돌 경고는 설정된 `${VAR}` 형태로 보여주고, 연결 실패 상세는 서버 origin만 보여준다.
- **`strictKnownMarketplaces` 우회 수정** — git이 실제로 접속할 호스트와 다른 SCP 형식 marketplace 소스를 허용하던 문제를 고쳤다.
- **fullscreen 복사 누락 수정** — `/login` OAuth URL 같은 모달 텍스트를 fullscreen에서 복사하면 글자가 빠지던 문제를 고쳤다.
- **`---` 수평선 겹침 수정** — 렌더된 마크다운에서 수평선이 다음 줄과 붙던 문제를 고쳤다.
- **셸 명령 행 분리 수정** — 사이에 todo/task 갱신이 끼면 연속 셸 명령이 "Ran 1 shell command" 행 여럿으로 쪼개지던 문제를 고쳤다.
- **다이얼로그 조기 종료 수정** — `!` 셸 명령 실행 중 연 `/permissions` 같은 다이얼로그가 명령 종료 시 닫히던 문제를 고쳤다.
- **큐잉된 `!` 명령 수정** — 위쪽 화살표로 편집한 뒤 일반 텍스트로 모델에 전달되던 문제를 고쳤다.
- **큐 메시지 동작 정리** — 큐에 있는 메시지가 프롬프트 히스토리에 다시 뜨지 않고, 큐 메시지 선택 중 Esc가 턴을 끊지 않으며, 턴 도중 제출 후 `!` 모드가 남지 않는다.
- **fullscreen 렌더러 전환 시 설정 유실 수정** — 재시작하며 권한 모드(`--dangerously-skip-permissions` 등)·allow/deny 규칙·모델·effort 플래그를 잃던 문제를 고쳤다.
- **`/tui` 규칙 유실 수정** — 재시작 시 `--allowed-tools`/`--disallowed-tools`를 버리던 문제를 고쳤다. 재시작으로 옮길 수 없는 제한이 있으면 이유를 밝히고 전환을 거절한다.
- **trust 프롬프트 경고 누락 수정** — 레포가 생기기 전에 처음 본 디렉토리에서 레포 전역 범위 경고가 빠지던 문제를 고쳤다.
- **IDE diff 탭 오답 수정** — 권한 재확인 도중 diff 탭이 닫히면 이전 입력으로 새 프롬프트에 답해버리던 경우를 고쳤다.
- **원격 제어 파일 전송 수정** — Desktop·VS Code 호스팅 원격 세션에서 보낸 파일이 실제로 업로드돼 휴대폰·웹에서 열린다(빈 카드 표시 해소).
- **stale 토큰 알림 누출 수정** — `CLAUDE_CODE_OAUTH_TOKEN`이 설정된 상태에서 `/login` 한 뒤, 알림이 자동 재개된 턴에 섞이지 않고 사용자에게만 보인다.
- **권한 미리보기 중계 제한** — inbound trust 게이트를 통과한 채널 서버에만 중계하고, 서버의 권한 기능 opt-out을 존중한다.
- **자격증명 마스킹 과잉 수정** — 마스킹이 승인자에게서 명령·경로·대상을 가리지 못하게 했고, 큰 개인키 블록은 최대 강도로 가린다.
- **토큰 마스킹 누락 수정** — 셸 구분자가 바로 뒤에 붙은 provider API 토큰도 마스킹된다.
- **Desktop 세션 간 메시지 유실 수정** — 교차 세션 메시지가 비활성으로 읽혀 조용히 버려지면서 발신 세션이 수 분간 "thinking"에 멈추던 문제를 고쳤다.
- **원격 제어 계정 전환 처리** — 다른 claude.ai 계정·조직으로 로그인하면 몇 초 안에 세션을 멈추고 이유를 알린다(기존: 몇 시간 뒤 HTTP 404).
- **`SendMessage`·`ListAgents` 목록 한계 고지** — 계정 세션 목록이 너무 길어 다 확인하지 못하면 그렇다고 말한다. 못 본 세션을 없는 것으로 취급하지 않는다.
- **만료 자격증명 안내** — 만료된 Anthropic 프로필 자격증명은 claude.ai 로그인이 우선하는 경우 `/login`을 안내한다.
- **transcript 개선** — 내 프롬프트도 답변과 똑같이 마크다운으로 렌더된다(코드 블록 하이라이트·인라인 코드·목록).
- **빈 응답 오류 메시지 개선** — 무엇이 왔는지(content type·body 종류·크기·request ID)와 원래 스트리밍 요청이 왜 실패했는지 알려준다.
- **세션 제목 개선** — 요청을 문장으로 되풀이하지 않고 짧고 구체적인 이름으로 짓는다(예: "Login button bug").
- **`claude-api` 스킬 컨텍스트 절감** — 참조 문서를 필요할 때만 로드해 20만+ 토큰에서 약 2.5만 토큰으로 줄였다.
- **`claude setup-token` 인자 검증** — 예상 밖 인자를 조용히 무시하지 않고 거부한다.
- **기타 UI·동작 정리** — fullscreen Esc가 마우스 선택을 지우지 않고, auto 모드의 "Allowed by auto mode classifier" 줄과 `/config`의 "Default teammate model" 설정이 제거됐으며, 실행 중 도구 헤더의 경과 시간이 흐려졌고, 턴 사이 백그라운드 알림이 `<system-reminder>` 태그로 전달되며, Mantle은 메인 모델이 이미 정해졌으면 admin-pin 탐색을 건너뛰고, Windows는 `~/.claude.json`이 읽기 전용일 때 시작이 멈추지 않는다.

## 🔑 이번 버전의 핵심 키워드
**"턴을 멈추지 않는 UI, 새지 않는 시크릿"** — 작업 중에도 설정·권한을 바꿀 수 있게 열어주면서, 경로·자격증명·이메일이 새는 경로는 전부 막았다.

---

# 📜 원문 (한글 번역본)

> 원문 ChangeLog를 원래 순서 그대로 한 줄도 빠짐없이 번역한 문서입니다.

- 선택적 환경변수 `CLAUDE_CODE_PROJECT_DIR_NAME` 추가: 세션마다 자체 config 디렉토리를 주는 호스트가 프로젝트별 transcript 디렉토리에 짧은 이름을 고를 수 있다
- `selection:clear` 키바인딩 액션 추가 — 앱 내 텍스트 선택을 해제하는 키를 바인딩할 수 있다. agents 뷰에서도 동작한다
- footer·statusline에 GitLab merge request 뱃지 추가: GitLab remote가 있고 `glab` CLI가 인증된 레포는 `MR !N`을 draft/pending/green 상태로 표시한다
- claude.ai 사용량 한도가 리셋되면 Claude Code가 세션을 자동으로 이어간다. `/config`의 "Continue automatically at usage limit"에서 끌 수 있다
- Claude는 이제 계정 이메일을 본인 식별 용도로만 쓰고, 요청하지 않는 한 무관한 서비스에 보내지 않도록 지시받는다
- 보안: 원격 파일 읽기·세션 복원·CLAUDE.md include·workflow 스크립트·파일 업로드가 Windows NT 네임스페이스(`\??\`) 경로를 거부한다. 사전 승인 이전 파일 접근 경로를 NTLM 자격증명 유출 벡터로부터 강화했다
- 아주 긴 세션에서 대화가 컴팩션된 뒤 auto 모드가 샌드박스 명령의 네트워크 접근을 반복 재검사·거부하던 문제 수정
- 백그라운드 서브에이전트 도구 권한 프롬프트에 답할 때 세션 범위 권한 응답(거부 포함)이 버려지던 문제 수정
- 비스트리밍 fallback 경로(주로 서드파티 게이트웨이 경유)의 API 응답에 thinking 필드가 없는 thinking 블록이나 text 필드가 없는 text 블록이 들어있을 때 발생하던 크래시 수정
- 특이한 유니코드 시퀀스를 포함한 일부 메시지에서 마크다운 렌더링이 극도로 느려지던 문제 수정
- 세션 이름이 200자 상한이거나 이모지가 많을 때 `ListAgents`에서 복사한 수신자를 `SendMessage`가 거부하던 문제 수정
- 특이한 userinfo가 붙은 git remote의 호스트를 레포 감지가 잘못 읽어, 엉뚱한 호스트용 링크와 레포별 동작을 내던 문제 수정
- MCP 진단이 해석된 시크릿을 출력하던 문제 수정: scope 충돌 경고는 설정된 `${VAR}` 형태로 표시하고, 연결 실패 상세는 서버 origin만 표시한다
- git이 실제로 접속할 호스트와 다른 호스트를 가진 SCP 형식 git marketplace 소스를 `strictKnownMarketplaces` 허용목록이 받아들이던 문제 수정
- `/login` OAuth URL 같은 모달 텍스트를 fullscreen에서 복사하면 글자가 빠지던 문제 수정
- 렌더된 마크다운의 `---` 수평선이 다음 줄과 붙어 이어지던 문제 수정
- 사이에 todo/task 업데이트가 끼어들면 연속된 셸 명령이 여러 개의 "Ran 1 shell command" 행으로 쪼개지던 문제 수정
- `!` 셸 명령 실행 중에 연 `/permissions` 같은 다이얼로그가 명령이 끝날 때 닫히던 문제 수정
- 큐에 들어간 입력을 위쪽 화살표로 편집한 뒤, 큐잉된 `!` 셸 명령이 일반 텍스트로 모델에 전달되던 문제 수정
- 큐잉된 메시지가 아직 큐에 있는 동안 프롬프트 히스토리에 다시 나타나던 문제 수정. 큐 메시지 선택 중 Esc가 더 이상 턴을 중단하지 않으며, 턴 도중 제출 후 `!` 모드가 남아있지 않는다
- "Try the new fullscreen renderer?" 프롬프트를 수락하면 권한 모드(예: `--dangerously-skip-permissions`)·도구 allow/deny 규칙·모델·effort 플래그 없이 세션이 재시작되던 문제 수정
- `/tui`가 재시작할 때 실행 시 지정한 `--allowed-tools`/`--disallowed-tools` 규칙을 버리던 문제 수정. 재시작으로 이어갈 수 없는 제한이 세션에 있으면 이유와 함께 전환을 거절한다
- 레포가 생기기 전에 그 디렉토리를 처음 본 경우 trust 프롬프트에서 레포 전역 범위 경고가 빠지던 문제 수정
- 권한 재확인 중 IDE diff 탭이 닫히면 이전 입력으로 새 프롬프트에 답해버릴 수 있던 경우 수정
- 수정: Claude Code Desktop 또는 VS Code가 호스팅하는 Remote Control 세션에서 사용자에게 보낸 파일이 이제 업로드되어, 빈 카드 대신 휴대폰·웹에서 열린다
- 수정: `CLAUDE_CODE_OAUTH_TOKEN`이 설정된 상태에서 `/login` 한 뒤, stale 토큰 알림이 자동 재개된 Claude의 턴에 새어 들어가지 않고 사용자에게만 보인다
- 수정: 권한 미리보기는 inbound trust 게이트가 허용한 채널 서버에만 중계되며, 서버의 명시적 권한 기능 opt-out을 존중한다
- 수정: 중계된 권한 미리보기의 자격증명 마스킹이 승인자로부터 명령·경로·대상을 가릴 수 없게 됐다. 크기가 큰 개인키 블록은 최대 강도로 가려진다
- 수정: 권한 미리보기에서 마스킹되는 provider API 토큰이 셸 구분자 바로 뒤에 오는 경우에도 마스킹된다
- Claude Desktop 세션 간 메시지가 교차 세션 메시징이 비활성으로 읽히면서 수신 세션에서 조용히 버려져, 발신 쪽 쿼리가 수 분간 "thinking" 상태로 남던 문제 수정
- Remote Control: 이 컴퓨터를 다른 claude.ai 계정·조직으로 로그인하면 몇 시간 뒤 오해를 부르는 HTTP 404 대신, 몇 초 안에 실행 중인 세션을 멈추고 이유를 알린다
- Claude Code Desktop 또는 VS Code에서 시작한 Remote Control 세션이 세션의 권한 모드(그리고 claude.ai/code에는 모델)를 변경될 때마다 휴대폰과 claude.ai/code에 계속 갱신한다
- Remote Control: 휴대폰이나 claude.ai/code에서 고른 effort가 터미널·Desktop/VS Code 호스팅 세션에도 적용되고, 세션이 자신의 effort 수준을 연결된 클라이언트에 게시한다
- `SendMessage`·`ListAgents`가 계정의 세션 목록이 너무 길어 전부 확인하지 못했을 때 그렇다고 알린다. 확인하지 못한 세션을 없는 것으로 취급하지 않는다
- 만료된 Anthropic 프로필 자격증명은 claude.ai 로그인이 우선하는 경우 `/login`을 안내한다
- transcript 개선: 사용자 본인의 프롬프트도 이제 답변과 같은 방식으로 마크다운 렌더링된다(하이라이트된 코드 블록·인라인 코드·목록)
- "API returned an empty or malformed response" 오류를 개선해, 무엇이 돌아왔는지(content type·body 종류·크기·request ID)와 원래 스트리밍 요청이 왜 실패했는지 알려준다
- 자동 생성 세션 제목을 개선해, 요청을 되풀이하는 문장(예: "Fix the login button on mobile") 대신 짧고 구체적인 이름(예: "Login button bug")으로 읽히게 했다
- 내장 `claude-api` 스킬 로딩의 컨텍스트 비용을 참조 문서 온디맨드 로딩으로 약 20만+ 토큰에서 약 2.5만 토큰으로 줄였다
- Claude가 작업 중일 때도 `/permissions`를 열 수 있다 — 규칙 변경은 현재 턴의 남은 부분에 적용된다
- Claude가 작업 중일 때도 `/add-dir <path>`를 쓸 수 있다. `/add-dir`·`/autocompact`·`/theme`·`/help`·`/config`·`/advisor` 다이얼로그가 fullscreen TUI에서 턴 도중에 열린다
- `/goal`이 복구 불가능한 오류(예: 인증 취소·크레딧 잔액 소진·컨텍스트 초과)로 턴이 죽으면 계속 무장 상태로 남지 않고 알림과 함께 스스로 해제된다
- `/goal`: 백그라운드 작업이 goal을 30분 이상 대기시키면 Claude가 무한정 기다리지 않고 상태를 확인한다(`CLAUDE_CODE_GOAL_CHECKIN_MINUTES=0`으로 해제)
- `claude setup-token`이 예상 밖의 추가 인자를 조용히 무시하지 않고 거부한다
- fullscreen 모드의 Esc가 마우스 텍스트 선택을 더 이상 지우지 않도록 변경: 평소대로 중단·해제하되 선택은 하이라이트된 채로 남는다
- auto 모드가 모든 Agent 도구 호출 아래에 보여주던 불필요한 "Allowed by auto mode classifier" 줄 제거
- `/config`에서 "Default teammate model" 설정 제거. agent-team 팀원은 spawn이 지정하지 않는 한 리더의 모델을 쓴다
- 실행 중 도구 헤더의 경과 시간 카운터를 흐리게 해 굵은 카운트와 경쟁하지 않게 했다
- 턴 사이에 전달되는 백그라운드 작업 알림이 이제 `<system-reminder>` 태그 안에 담겨 모델에 전달된다 — 턴 도중 전달과 동일해졌다
- Mantle: 메인 루프 모델이 이미 선택돼 있으면 시작 시 admin-pin 가용성 탐색을 건너뛴다
- Windows: `~/.claude.json`이 읽기 전용일 때 반복 rename 재시도로 시작이 멈추지 않는다

---

## 🎯 챌린지

이번 버전에서 내 환경에 적용해볼 만한 항목입니다.

### 1. GitLab MR 뱃지 켜기 — `glab` 인증 확인
- **파일**: 인증 확인만 — `GITLAB_HOST=gitlab.bpmg.dev glab auth status`
- **근거**: 이번 버전에서 GitLab remote + 인증된 `glab`이면 statusline에 `MR !N`이 뜬다. EOS-H5 전 레포가 `gitlab.bpmg.dev`이고 이미 `glab api`로 sj.park 인증을 쓰고 있으니, 인증만 유효하면 MR 상태를 터미널에서 바로 본다. feat 브랜치 원격 push 금지 정책상 남의 MR 상태 파악에 특히 유용하다.
- **난이도**: ★☆☆ (약 5분)

### 2. `selection:clear` 키바인딩 추가
- **파일**: `~/.claude/keybindings.json`
- **근거**: 이번 버전에서 fullscreen Esc가 더 이상 마우스 선택을 지우지 않는다. 선택 해제 수단이 사라졌으니 `selection:clear`를 별도 키에 바인딩해 둔다. 로그·경로를 자주 복사하는 라이브 조회 작업에서 체감된다.
- **난이도**: ★☆☆ (약 5~10분)

### 3. `/goal` 30분 체크인 정책 정하기
- **파일**: `~/.claude/settings.json`의 `env` (필요 시 `CLAUDE_CODE_GOAL_CHECKIN_MINUTES`)
- **근거**: `/goal`이 백그라운드 작업을 30분 이상 기다리면 Claude가 자동으로 상태를 확인한다. 다만 CLAUDE.md에 "SSH 폴링 금지" 원칙이 있어 라이브 노드 대상 백그라운드 작업에서는 이 체크인이 불필요한 접속을 유발할 수 있다. 기본 유지할지 `0`으로 끌지 한 번 정해 명시해 둔다.
- **난이도**: ★☆☆ (약 5~10분)

### 4. 사용량 한도 자동 이어하기 확인
- **파일**: `/config` — "Continue automatically at usage limit"
- **근거**: 한도 리셋 시 세션이 자동 재개된다. `model: "opus[1m]"` + `effortLevel: "high"` 설정이라 한도에 닿기 쉽고, 라이브 조작이 걸린 세션이 무인 상태로 자동 재개되는 건 위험하다. 기본값을 확인하고 원하는 쪽으로 고정한다.
- **난이도**: ★☆☆ (약 5분)
