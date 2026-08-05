# Claude Code v2.1.221

> 작성일: 2026-08-06

---

# 📋 요약본

## 🎉 신기능 (4건)
- **[VSCode] Focus view** — 채팅 메뉴 토글로 도구 실행 내역을 턴별 요약 뒤로 숨긴다. 실행 중인 도구는 라이브 인디케이터로 표시. `Ctrl+Alt+F` 또는 "Claude Code: Toggle Focus view" 명령으로 켠다.
- **샌드박스 자격증명 `mode: "mask"`** — Linux·WSL에서 샌드박스 명령은 센티넬(대체) 사본만 읽고, 실제 값은 샌드박스 프록시가 외부 전송 시점에 치환한다. `extract` 정규식으로 일부 구간만 마스킹 가능. macOS는 `deny`로 폴백.
- **`claude plugin validate` 경고 추가** — 마켓플레이스·플러그인 이름이 Claude Desktop의 관리형 마켓플레이스 sync에서 거부될 경우 경고를 낸다.
- **`prompt-audit` 서브커맨드** — `claude-api` 스킬에 추가. 프롬프트·도구 설명이 구형 모델용 패턴으로 작성됐는지 감사한다.

## 🛠️ 개선/수정 (35건)
- **Bash 권한 우회 수정** — zsh가 `[[ ]]` 정규식 조건문 안에서 숨은 명령을 실행하던 권한 검사 우회를 차단. 이제 권한을 묻는다.
- **PowerShell 경로 처리 수정** — Windows에서 따옴표가 포함된 경로 오처리를 수정. 이제 승인을 묻는다.
- **thinking 토글 수정** — thinking을 끈 채로 시작한 세션에서 토글이 무효이던 문제, 연결 중 MCP 서버 비활성화가 조용히 되돌려지던 문제 수정.
- **`--mcp-config` MCP 수정** — print 모드(`-p`)에서 첫 턴 전에 연결되지 않아 모델이 도구 호출을 리터럴 텍스트로 뱉던 문제 수정.
- **@-멘션 파일 유실 수정** — Esc로 프롬프트를 취소 후 재제출할 때 @-멘션 파일이 조용히 누락되던 문제 수정.
- **`constructor` 크래시 수정** — `constructor` 등 내장 객체 속성 이름을 가진 SDK MCP 도구의 API 요청 준비 시 크래시 수정.
- **WebSearch 400 수정** — thinking을 끈 상태에서 effort `xhigh`/`max`일 때 400 에러로 실패하던 문제 수정.
- **샌드박스 대용량 업로드 수정** — 프록시 경유 시 TLS 에러로 실패하던 문제 수정.
- **spend-limit 메시지 수정** — Team·Enterprise에서 조직 월 한도가 아니라 개인 지출 한도임을 잘못 안내하던 문구 수정.
- **Bedrock 인증 수정** — Windows에서 잘못된 `HOME` 환경변수가 설정된 desktop 관리 세션에서 AWS SSO 명명 프로필 인증 실패 수정.
- **`CLAUDE_CODE_RESUME_INTERRUPTED_TURN=0` 수정** — falsy 값이 자동 재개를 끄지 못하던 문제 수정. 이제 falsy 값을 존중한다.
- **wake-from-sleep 경쟁 수정** — 두 Claude Code 프로세스가 같은 MCP 커넥터나 WIF OAuth 토큰을 동시 갱신해 재인증을 강제하던 희귀 경쟁 수정.
- **세션 이름 변경 수정** — Desktop·claude.ai에서 바꾼 세션 이름이 CLI에 반영되지 않던 문제 수정. 모든 변경 경로의 이름이 정규화된다.
- **내장 이름 스킬 수정** — `/help`, `/feedback` 등 터미널 전용 내장과 같은 이름의 플러그인·조직 스킬이 비대화형 세션에서 호출 불가하던 문제 수정.
- **"Plugins changed" 알림 수정** — 플러그인 재로드 후에도 알림이 사라지지 않던 문제 수정.
- **Vim yank 레지스터 수정** — 다이얼로그·히스토리 검색·트랜스크립트 뷰를 거쳐도 yank 레지스터가 비워지지 않도록 유지.
- **Vim undo 수정** — 빈 프롬프트까지 undo 시 에이전트 뷰로 돌아가기 전 "← 다시 누르기" 확인을 띄운다.
- **Vertex AI 도구 검색 개선** — Claude 4.5 세대 이상 모델에서 재활성화.
- **auto 모드 개선** — 병렬 도구 호출 권한 검사가 캐시 효율적으로 동작하고, 검사 대기 중 모드 전환 시 낡은 결과 대신 확실히 다시 묻는다.
- **prompt-cache 비용 절감** — auto 모드 권한 결정에서 캐시된 대화 프리픽스를 재사용해 비용 절감.
- **Stats 패널 개선** — 토큰 총계에 캐시 토큰을 포함하고 입력·출력·캐시 읽기·캐시 쓰기로 분해해 표시.
- **`/ultrareview` 에러 메시지 개선** — 베이스와 히스토리를 공유하지 않는 레포는 앞단에서 거부하고 브랜치 생성을 안내. 이미 완전한 클론에는 `git fetch --unshallow`를 제안하지 않는다.
- **Windows 시작 개선** — 프로세스 생성 시각을 PowerShell 대신 kernel32 네이티브 호출로 읽어, `powershell.exe`를 게이트하는 엔드포인트 보안 도구가 더는 묻지 않는다.
- **백그라운드 세션 변경** — 작업 보존을 위해 커밋·push하고, 필요할 때만 draft PR을 열며, CLAUDE.md의 git 지침을 따르고, 항상 작업 위치를 보고하며 종료한다.
- **`/plugin install` 변경** — 플러그인을 못 찾으면 낡은 마켓플레이스 카탈로그를 새로고침 후 재시도한 뒤 보고한다.
- **`/plugin` 설치 즉시 활성화** — 안전할 때 즉시 활성화한다. 더는 항상 `/reload-plugins`를 요구하지 않는다.
- **`"."` skills 경로 허용** — 플러그인이 `skills` 경로로 `"."`를 허용하고, 루트 `SKILL.md` 검증 에러는 플러그인 루트 사용을 제안한다.
- **`/status` 세션 종류 표시** — `interactive`, 또는 `attached`·`unattended` 백그라운드 잡을 표시.
- **이모지 자동완성 변경** — `:thumbsup:`, `:thumbsdown:`, `:love:` 등 흔한 대체 숏코드를 허용.
- **`/fork` 워크트리 변경** — 포크된 세션은 원본 세션 체크아웃 대신 자기 소유의 새 워크트리를 만든다.
- **Chrome의 Claude 변경** — 연 탭이 더 필요 없어지면 브라우저 탭을 닫는다.
- **fast 모드 변경** — 세션 중 사용 크레딧이 소진되면 조용히 실패하지 않고 스트림에 보고한다.
- **Monitor 변경** — 출력 없이 종료한 watch는 "stream ended" 대신 그렇다고 명시한다.
- **Gateway `model` 검증 변경** — 문자열이 아닌 값은 전달하지 않고 400으로 거부한다.
- **"Permission mode changed" 문구 제거** — auto 모드 분류기 호출이 큐에 있을 때 뜨던 반복 안내를 승인 프롬프트에서 제거.

## 🔑 이번 버전의 핵심 키워드
**"권한 검사 강화와 플러그인·세션 관리 정돈"** — Bash·PowerShell 권한 우회를 막고, 플러그인 설치·검증·활성화 흐름을 매끄럽게 다듬은 안정화 버전.

---

# 📜 원문 (한글 번역본)

> 원문 ChangeLog를 원래 순서 그대로 한 줄도 빠짐없이 번역한 문서입니다.

- [VSCode] Focus view 추가: 도구 실행 내역을 확장 가능한 턴별 요약 뒤로 숨기고 실행 중인 도구를 라이브 인디케이터로 보여주는 채팅 메뉴 토글. `Ctrl+Alt+F` 또는 "Claude Code: Toggle Focus view" 명령으로 켠다.
- Linux·WSL의 샌드박스 자격증명 파일에 `mode: "mask"` 추가 — 샌드박스 명령은 센티넬 사본(파일 전체, 또는 `extract` 정규식으로 잡힌 구간만)을 읽고, 샌드박스 프록시가 외부 전송 시 실제 값으로 치환한다. macOS의 파일 마스킹은 `deny`로 폴백한다.
- 마켓플레이스나 플러그인 이름이 Claude Desktop의 관리형 마켓플레이스 sync에서 거부될 경우 `claude plugin validate`에 경고를 추가.
- 구형 모델용으로 작성된 패턴을 프롬프트·도구 설명에서 감사하는 `prompt-audit` 서브커맨드를 `claude-api` 스킬에 추가.
- zsh가 `[[ ]]` 정규식 조건문 안에서 숨은 명령을 실행할 수 있던 Bash 도구 권한 검사 우회를 수정. 해당 명령은 이제 권한을 묻는다.
- Windows에서 따옴표 문자가 포함된 경로를 오처리하던 PowerShell 권한 검사를 수정. 그런 경로는 이제 승인을 묻는다.
- thinking을 끈 채로 시작한 세션에서 남은 세션 동안 thinking 토글이 무효이던 문제 수정. 연결 중 MCP 서버를 비활성화해도 더는 조용히 되돌려지지 않는다.
- `--mcp-config`의 MCP 서버가 print 모드(`-p`) 첫 턴 전에 연결되지 않아 모델이 도구 호출을 리터럴 텍스트로 내보내던 문제 수정.
- Esc로 프롬프트를 취소했다가 다시 제출할 때 @-멘션 파일이 조용히 누락되던 문제 수정.
- `constructor` 같은 내장 객체 속성 이름을 가진 SDK MCP 도구의 API 요청 준비 시 발생하던 크래시 수정.
- thinking이 비활성화된 상태에서 effort `xhigh`/`max`일 때 WebSearch가 400 에러로 실패하던 문제 수정.
- 샌드박스 대용량 업로드가 샌드박스 프록시를 통과할 때 TLS 에러로 실패하던 문제 수정.
- Team·Enterprise 지출 한도 메시지가 개인 지출 한도 대신 조직의 월 한도를 잘못 지목하던 문제 수정.
- 잘못된 `HOME` 환경변수가 설정된 Windows 머신의 desktop 관리 세션에서 AWS SSO 명명 프로필을 이용한 Bedrock 인증이 실패하던 문제 수정.
- `CLAUDE_CODE_RESUME_INTERRUPTED_TURN=0`이 중단 턴 자동 재개를 끄지 못하던 문제 수정. 이제 falsy 값을 존중한다.
- 절전에서 깨어날 때 두 Claude Code 프로세스가 같은 MCP 커넥터나 WIF OAuth 토큰을 동시에 갱신해 재인증을 강제하던 희귀 경쟁 조건 수정.
- Claude Code Desktop이나 claude.ai에서 세션 이름을 바꿔도 CLI의 세션 이름이 갱신되지 않던 문제 수정. 모든 변경 경로의 세션 이름이 정규화된다.
- `/help`, `/feedback` 같은 터미널 전용 내장과 이름이 같은 플러그인·조직 제공 스킬이 비대화형 세션에서 호출 불가하던 문제 수정.
- 플러그인 재로드 후에도 "Plugins changed" 알림이 사라지지 않고 남아 있던 문제 수정.
- Vim 모드 수정: yank 레지스터가 다이얼로그·히스토리 검색·트랜스크립트 뷰를 거쳐도 조용히 비워지지 않고 유지된다.
- Vim 모드 수정: 빈 프롬프트까지 undo하면 에이전트 뷰로 돌아가기 전에 "← 다시 누르기" 확인을 띄운다.
- Google Vertex AI의 도구 검색 개선: Claude 4.5 세대 이상 모델에서 재활성화.
- auto 모드 개선: 병렬 도구 호출의 권한 검사가 캐시 효율적으로 동작하고, 검사가 대기 중일 때 모드를 전환하면 낡은 결과를 적용하지 않고 확실히 다시 묻는다.
- auto 모드 권한 결정에서 캐시된 대화 프리픽스를 결정 간에 재사용해 prompt-cache 비용을 절감.
- Stats 패널 개선: 토큰 총계에 캐시 토큰을 포함하고 입력·출력·캐시 읽기·캐시 쓰기로 분해해 표시.
- `/ultrareview` 에러 메시지 개선: 베이스와 히스토리를 공유하지 않는 레포에서, 브랜치가 없는 체크아웃은 앞단에서 거부하며 브랜치 생성을 조언한다. 이미 완전한 클론에는 거부 힌트가 `git fetch --unshallow`를 더는 제안하지 않는다.
- Windows 시작 개선: 프로세스 생성 시각을 PowerShell 스폰 대신 kernel32 네이티브 호출로 읽어, `powershell.exe`를 게이트하는 엔드포인트 보안 도구가 더는 묻지 않는다.
- 백그라운드 세션 변경: 작업 보존을 위해 커밋·push하고, 작업에 필요할 때만 draft PR을 열며, CLAUDE.md의 git 지침을 따르고, 항상 작업이 있는 위치를 보고하며 종료한다.
- `/plugin install` 변경: 낡은 마켓플레이스 카탈로그를 새로고침하고 재시도한 뒤에 플러그인 미발견을 보고한다.
- `/plugin`에서 설치한 플러그인 변경: 안전할 때 즉시 활성화하며, 더는 항상 `/reload-plugins`를 요구하지 않는다.
- 플러그인이 `skills` 경로로 `"."`를 허용하도록 변경하고, 루트 레벨 `SKILL.md` 검증 에러는 이제 플러그인 루트 사용을 제안한다.
- `/status` 변경: 세션 종류를 표시한다 — `interactive`, 또는 `attached`·`unattended` 백그라운드 잡.
- 이모지 자동완성 변경: `:thumbsup:`, `:thumbsdown:`, `:love:` 같은 흔한 대체 숏코드를 허용한다.
- `/fork`로 포크한 세션 변경: 원본 세션의 체크아웃에서 작업하는 대신 자기 소유의 새 워크트리를 만든다.
- Chrome의 Claude 변경: 연 브라우저 탭이 더 필요 없어지면 닫는다.
- fast 모드 변경: 세션 도중 사용 크레딧이 소진되면 조용히 실패하는 대신 스트림에 보고한다.
- Monitor 변경: 출력을 하나도 내지 않고 종료한 watch는 "stream ended" 대신 그렇다고 명시한다.
- Gateway `model` 필드 검증 변경: 문자열이 아닌 값은 전달하지 않고 400으로 거부한다.
- auto 모드 분류기 호출이 큐에 있을 때 뜨던 "Permission mode changed while the auto-mode classifier call was queued" 반복 안내를 승인 프롬프트에서 제거.

---

## 🎯 챌린지

이번 버전에서 내 환경에 적용해볼 만한 항목입니다.

### 1. 등록된 마켓플레이스·플러그인 이름 검증
- **파일**: `~/.claude/settings.json`의 `extraKnownMarketplaces` (4개 등록)
- **근거**: 이번 버전이 `claude plugin validate`에 "Desktop 관리형 sync에서 거부될 이름" 경고를 추가했다. `karpathy-skills`, `alexgreensh-token-optimizer` 등 등록 마켓플레이스에 `claude plugin validate`를 돌려 이름 규칙 위반을 미리 잡으면, 나중에 Desktop 연동 시 sync 실패를 예방한다.
- **난이도**: ★☆☆ (약 5분)

### 2. 자주 쓰는 스킬 프롬프트를 `prompt-audit`로 점검
- **파일**: `claude-changelog-sync`·`report-writer` 등 직접 작성한 스킬의 `SKILL.md`
- **근거**: 이번 버전이 `claude-api` 스킬에 `prompt-audit` 서브커맨드를 추가했다. 이 스킬들은 `claude -p --model opus`로 프롬프트를 돌리는데, 구형 모델용 패턴이 남아 있으면 최신 모델(Opus 4.8·Fable 5)에서 비효율적이다. 감사로 손볼 지점을 찾는다.
- **난이도**: ★★☆ (약 15분)

### 3. 캐시 토큰 소비 실측 확인
- **파일**: 별도 편집 없음 — `/stats` 패널 확인
- **근거**: Stats 패널이 이제 캐시 토큰을 총계에 포함하고 입력·출력·캐시 읽기·쓰기로 분해한다. token-optimizer statusline을 쓰는 환경이니, `/stats`로 캐시 읽기 비중을 실측해 prompt-cache가 실제로 효과를 내는지 눈으로 확인해두면 이후 비용 판단의 기준이 된다.
- **난이도**: ★☆☆ (약 5분)
