# Claude Code v2.1.277

> 작성일: 2026-09-19

---

# 📋 요약본

## 🎉 신기능 (11건)
- **AGENTS.md 지원** — `CLAUDE.md` 가 없는 프로젝트에서는 `AGENTS.md` 를 대신 읽는다. `/config` 의 "Project instructions" 에서 변경한다. Bedrock·Vertex·Foundry 는 아직 미지원.
- **`CLAUDE_GATEWAY_PROXY_IS_EGRESS_BOUNDARY=1`** — 외부로 나가는 통로가 forward proxy 하나뿐인 Claude apps gateway 용. 나가는 요청마다 호스트명을 직접 풀지 않고 프록시에 넘긴다.
- **gateway upstream 의 `headers:` 맵** — 제공자 앞단에 직접 운영하는 프록시로 고정 헤더를 보낼 수 있다.
- **백그라운드 작업 완료 알림 줄** — `/tasks` 같은 패널이 열린 상태에서 작업이 끝나면 업데이트가 대기 중이라는 줄을 띄운다.
- **[VSCode] 로그아웃** — 패널 메뉴에 Sign out 줄, 타이핑 명령 메뉴에 `/logout` 추가.
- **[VSCode] 에이전트 맵에 실행 중 작업 표시** — 백그라운드 셸과 실행 중 작업이 각각 Stop 버튼과 함께 보이고, `/tasks` 로 열 수 있다.
- **[VSCode] 응답 복사** — 응답마다 Copy response 버튼, 타이핑 `/copy` 추가.
- **[VSCode] 세션 자동 보관 안내** — 비활성 세션이 자동 보관될 때 1회 안내, Archived sessions 그룹에 "Unarchive all" 동작 추가.
- **[VSCode] 비용·토큰 사용량 표시** — 플랜 한도가 없는 환경(Vertex·Bedrock·Foundry·API key)에서 Account & usage 대화상자와 세션 매니저에 세션 비용과 토큰 사용량 표시.
- **[웹] 환경 선택기 Personal/Organization 구분** — Team·Enterprise 플랜에서 개인/조직 환경을 나눠 보여주고, 관리자는 개인 환경을 조직에 공유할 수 있다.
- **[Claude Tag] Pylon EU 호스트** — Claude Tag 액세스 번들의 Pylon 자격증명 프리셋을 Pylon EU 호스트로 지정 가능.

## 🛠️ 개선/수정 (76건)
- **`claude -p`·Agent SDK 무한 대기 수정** — 내부 오류 시 결과 없이 멈추던 문제. 이제 오류를 보고하고 종료 코드 1로 끝난다.
- **빈 텍스트 블록으로 대화 전체가 실패하던 문제 수정** — 이전 어시스턴트 턴에 빈 텍스트 블록이 섞여 있으면 `--resume` 이후를 포함해 매 요청이 "text content blocks must be non-empty" 로 실패하던 문제.
- **예기치 않은 로그아웃 수정** — 같은 기기에서 구버전 빌드(예: IDE 확장에 번들된 CLI)가 실행되면 로그아웃되던 문제.
- **`ANTHROPIC_API_KEY` 사용자 시작 멈춤 수정** — `~/.claude.json` 의 `customApiKeyResponses` 값이 깨져 있을 때 대화형 시작이 멈추거나 오류가 나던 문제.
- **업데이트 확인 오류 수정** — 프록시가 잘못된 버전을 돌려줄 때 30분마다 오류가 나고 `claude update` 가 멈추던 문제. 깨진 `minimumVersion` 은 이제 무시한다.
- **`claude update` 오보고 수정** — winget·apk 로 설치된 환경에서 버전 조회 실패 시 "up to date" 라고 말하던 문제.
- **`claude plugin install` 재설치 파손 수정** — 다른 세션·프로그램이 쓰고 있던 플러그인 버전을 재설치할 때 설치본이 망가지던 문제. 변경 없는 사본은 건드리지 않는다.
- **Grep·Glob 자원 부족 오류 표시** — 프로세스·메모리·파일 핸들이 모자라 검색을 시작하지 못했을 때 "결과 없음" 대신 오류를 반환한다.
- **Write 도구 디렉토리 경로 오류 표시** — 대상 경로가 기존 디렉토리일 때 권한 거부처럼 턴을 조용히 끝내던 문제. 이제 명확한 오류를 낸다.
- **Edit 도구 `\uXXXX` 오인식 수정** — 이스케이프된 역슬래시 뒤의 `uXXXX` 를 유니코드 이스케이프로 착각해 비ASCII 문자 수정이 엉뚱한 곳을 고치던 문제.
- **Edit 도구 오류 메시지 수정** — 비ASCII 가 섞인 매우 큰 수정이 파일과 맞지 않을 때 "정규식이 너무 큼" 대신 "String not found in file" 을 낸다.
- **널 바이트 조기 종료 수정** — 도구 호출 경로에 `\u0000` 이 이스케이프 문자열로 들어오면 턴이 끝나던 문제. 이스케이프된 제어문자는 이제 그냥 글자로 남는다.
- **`claude --bg` 종료 수정** — 플러그인의 LSP 서버가 종료되거나 stdin 을 닫으면 백그라운드 세션이 같이 죽던 문제.
- **`/mcp`·`/plugin manage` 크래시 수정** — `~/.claude.json` 의 `claudeAiMcpEverConnected` 값이 깨져 있을 때 "Type error".
- **실행 시 크래시 수정** — `~/.claude.json` 의 `theme` 값이 깨져 있을 때 시작 크래시.
- **터미널 색상 코드 크래시 수정** — 히스토리에서 불러온 프롬프트나 외부 편집기 텍스트에 색상 코드가 섞였을 때 "unrecoverable interface error".
- **세션 재개 크래시 수정** — 저장된 기록에 어시스턴트 메시지가 순수 문자열로 들어있을 때.
- **느린 기기 시작 종료 수정** — 부하가 큰 기기에서 첫 스피너가 뜰 때 세션이 오류로 종료되던 문제.
- **화면 갱신 멈춤 수정** — 내부 렌더링 오류 이후 세션 내내 화면이 안 바뀌던 드문 경우.
- **[Windows] 도구 호출 유실 수정** — Claude 응답 직후 "Out of memory" 등으로 턴이 멈춰 그 응답의 도구 호출이 아예 실행되지 않던 드문 경우.
- **`/clear` 이후 첫 메시지 누락 수정** — SessionStart hook 출력이 있으면 재시작·`--continue`·`--resume` 시 첫 메시지 일부가 빠져 프롬프트 캐시가 전부 날아가던 문제.
- **에이전트 메시지 위치 수정** — 턴 중간에 도착한 다른 에이전트의 메시지(예: 서브에이전트 SendMessage)가 "Ran N shell commands" 줄 아래에 뜨던 문제.
- **"copied" 알림 누락 수정** — 전체화면 `/resume` 선택기 등 프롬프트 영역을 덮는 패널에서 드래그 선택 후 알림이 안 뜨던 문제.
- **`$TMPDIR` 빈 값 수정** — 샌드박스가 켜진 상태에서 샌드박스 밖으로 실행되는 Bash 명령의 `$TMPDIR` 가 비어 있던 문제.
- **Cowork 클라우드 세션 WebFetch·WebSearch 사유 전달** — 가져오기 예산 소진·관리자 정책 등 거부 이유를 Claude 에게 알려준다.
- **gateway 텔레메트리 릴레이 `NO_PROXY` 수정** — 프록시 설정 시 `NO_PROXY` 에 적힌 수집기 호스트명·도메인을 무시하던 문제.
- **엔터프라이즈 마켓플레이스 정책 수정** — `strictKnownMarketplaces`·`blockedMarketplaces` 항목 하나가 깨지면 정책 전체가 조용히 꺼지던 문제.
- **실패한 자동 업데이트 잔여물 정리** — `~/.cache/claude/staging` 에 큰 스테이징 다운로드가 쌓이던 문제.
- **`/plugin` 제어문자 제거** — Installed 탭 메시지(예: 플러그인 업데이트 실패 오류)의 터미널 제어문자를 걸러낸다.
- **`/plugin` Installed·`/skills` 크래시 수정** — 스킬·레거시 명령 이름이 `constructor`·`toString` 등 내장 Object 속성명과 같을 때.
- **`/plugin` 다중 설치 실패 수정** — 여러 개 선택 설치가 전부 실패하면 메시지 없이 닫히던 문제.
- **삭제된 플러그인 잔존 수정** — 제거한 플러그인이 `/plugin` Installed 에 "failed to load" 줄로 다시 뜨고 Remove 로도 안 없어지던 문제.
- **플러그인 커밋 기록 수정** — 공식 마켓플레이스 플러그인이 `installed_plugins.json` 에 커밋 없이 기록되고, 커밋 고정 플러그인을 업데이트해도 옛 커밋이 남던 문제.
- **플러그인 리로드 미리보기 정리** — 미리본 아카이브 사본이 종료 때까지 전부 풀려 있고, 다운로드 실패 시 되돌아갈 `--plugin-url` 캐시 아카이브를 덮어쓰던 문제.
- **Remote Control 세션 기록 수정** — `~/.claude.json` 에 깨진 placeholder 레코드가 있을 때 실패하던 문제.
- **로그인 만료 오류 문구 수정** — claude.ai 로그인이 취소됐을 때 프로필 만료 탓을 하던 것을 `/login` 안내로 바꿨다.
- **`claude agents` 입력 깨짐 수정** — 키 반복·매우 빠른 입력 중 디스패치 입력창의 글자가 섞이던 문제.
- **stop hook 요약 크래시 수정** — 저장된 기록에 hook 목록이 제대로 없는 stop hook 요약이 있을 때 재개 크래시.
- **에이전트 패널 Enter 수정** — `keybindings.json` 에서 Chat 컨텍스트의 Enter 를 `chat:queueSubmit` 등으로 재지정했을 때 선택 행에서 Enter 가 먹지 않던 문제.
- **[Windows] PDF 페이지 읽기 수정** — 작업 폴더 경로가 길면(약 120자 이상) 실패하던 문제.
- **헤드리스 재개 비용 집계 수정** — `claude -p --resume`·SDK·VS Code 확장 재시작 시 비용·사용량이 0부터 시작하던 문제. 헤드리스 세션도 종료 시 누적치를 저장한다.
- **`--worktree` 프로젝트 스킬 수정** — `.claude/skills` 가 git 추적 대상이 아니면 메인 저장소의 프로젝트 스킬이 로드되지 않던 문제.
- **`sandbox.excludedCommands` 글롭 수정** — 복합 Bash 명령의 한 부분만 매칭돼도 전체가 샌드박스에서 빠지던 문제. 이제 모든 부분이 매칭돼야 한다.
- **재개된 서브에이전트 캐시 수정** — 서브에이전트·팀메이트가 이미 로드한 MCP 도구 정의를 다시 렌더링해 해당 에이전트의 프롬프트 캐싱이 깨지던 문제.
- **아티팩트 발행 rate limit 수정** — 재시도를 멈추라고 하던 것을 "발행되지 않았음 + 언제 다시 보낼지" 로 바꿨다.
- **첨부 재렌더링 수정** — 대화 앞쪽에 기록된 첨부가 재개·재실행 후 다시 렌더링돼 확장 사고가 사라지고 프롬프트 캐시를 놓치던 문제.
- **Console 로그인 오류 메시지** — API 키 생성 거부 시 "Request failed with status code 400" 만 뜨던 것을 서버 메시지로 바꿨다.
- **작업 중 입력 무시 수정** — Claude 가 일하는 중에 친 메시지를 모델이 못 보던 문제.
- **SDK·헤드리스 시작 속도 개선** — 첫 턴이 디렉토리별 `CLAUDE.md` 조회를 기다리지 않는다.
- **gateway 루프백 오류 메시지 개선** — `CLAUDE_GATEWAY_ALLOW_LOOPBACK` 를 명시한다.
- **`/plugin` Installed 개선** — 플러그인과 따로 표시된 MCP 서버가 어느 플러그인 소속인지 보여준다.
- **`claude plugin install` 안내 개선** — 이미 설치된 플러그인이면 마켓플레이스에 더 새 버전이 있는지 알려주고 `claude plugin update` 를 안내한다.
- **시작 알림 넘침 줄 문구 개선** — "+N more · /status" 대신 "N more notices hidden".
- **프롬프트 정리 개선** — 프롬프트의 보이지 않는 유니코드 서식·태그 문자를 제거하고, 정리된 프롬프트를 전송 전에 보여준다.
- **`/ultrareview` 빈 대상 처리 개선** — 어떤 상황인지 알려주고 최신 커밋을 리뷰하는 명령을 제안한다. 새 저장소의 첫 커밋은 전체를 리뷰한다.
- **아티팩트 링크 처리 개선** — claude.ai 아티팩트 링크를 WebFetch 대신 Artifact 도구로 읽는다.
- **위험한 rm 권한 프롬프트 개선** — 문제된 rm 명령을 이름으로 짚고 `${VAR:?}` 가드를 제안해 헤드리스 실행도 복구 가능.
- **Artifact 도구 권한 프롬프트 개선** — 문장을 짧게, 페이지·아티팩트는 제목이나 파일명으로, 링크는 본문 뒤에 나열.
- **Fable `/model` 표시 변경** — Anthropic API 에서 항상 보이고, 조직 설정에서 껐을 때만 회색 처리된다.
- **Bedrock·Vertex·Foundry 샌드박스 문구 변경** — 1st-party 문구로 통일. 샌드박스를 "주어진 작업의 경계" 로 설명한다.
- **비대화형 `/ultrareview` 거부** — 저장소에 base 브랜치나 공통 이력이 없으면 거부한다.
- **서브에이전트 결과 구분** — 서브에이전트 출력임을 표시하는 헤더와 들여쓰기를 달아 전달한다. 결과 안의 텍스트가 세션 지시처럼 읽히지 않는다.
- **워크플로 스크립트 프롬프트 구분** — Bedrock·Vertex·Foundry 에서 `agent()` 의 계산된 프롬프트를 "스크립트가 쓴 글" 로 전달해 안전 분류기가 사용자 발언으로 읽지 않게 한다.
- **Haiku 자동 제목 요청 제거** — SDK·IDE 밖에서 띄운 `claude -p` 실행에서 백그라운드 제목 생성 요청을 없앴다.
- **TaskOutput 도구 제거** — 백그라운드 작업 출력은 Read 로 읽는다. `taskOutputMaxChars` 설정과 `TASK_MAX_OUTPUT_LENGTH` 는 이제 아무 효과가 없다.
- **[VSCode] "General config" 메뉴 수정** — `/config` 사용법 텍스트만 뜨던 것을 설정 화면이 열리도록 고쳤고, 타이핑 `/mcp`·`/hooks`·`/memory`·`/rewind` 등도 각 대화상자를 연다.
- **[VSCode] effort 슬라이더 유지 수정** — `/effort` 로 저장된 레벨이 있는 모델에서 이후 세션에 레벨이 이어지지 않던 문제.
- **[VSCode] Auto 모드 누락 수정** — 저장된 모델 설정이 "Sonnet" 처럼 대소문자가 다른 별칭일 때, 이미 사용 중인 패널에서 연 대화의 모드 선택기에 Auto 가 없던 문제.
- **[VSCode] `/fast` 저장 수정** — fast 모드가 기본값으로 저장되지 않아 확장이 Claude Code 를 재실행하면 사라지던 문제.
- **[웹] 조직 환경 읽기 전용화** — Team·Enterprise 플랜에서 Code 탭의 조직 환경은 읽기 전용 요약으로 열리고, 편집은 Admin settings → Cloud environments 에서 한다.
- **[웹] 커스텀 네트워크 접근 수정** — 도메인 없이 Custom network access 로 저장한 클라우드 환경이 조용히 Trusted 로 되돌아가던 문제. 이제 최소 1개 도메인을 요구한다.
- **[웹] 관리자 설정 라벨 변경** — "Web" 을 "Cloud sessions" 로 바꾸고 그 아래 중복된 읽기 전용 Mobile 줄을 없앴다.
- **[Claude Tag] Slack 루틴 수정** — Enterprise Grid 조직 전체 설치의 Slack 채널에서 만든 루틴이 같은 워크스페이스의 다른 공개 채널을 못 읽던 문제.
- **[Claude Tag] "Learn more" 링크 수정** — 자격증명 프리셋의 링크가 일반 API 레퍼런스 대신 각 벤더의 자격증명 설정 페이지로 간다.
- **[Claude Tag] Google Cloud 자격증명 폼 수정** — 키 파일 거부 시 이유를 알려주고, 웹사이트·스코프는 잠기며, 회전 거부 시 붙여넣은 키가 유지된다.
- **[Claude Tag] 네트워크 이벤트 로그 수정** — AWS 서명·클라이언트 인증서·커스텀 CA 를 쓰는 연결의 요청에 응답 상태가 안 뜨던 문제.

## 🔑 이번 버전의 핵심 키워드
**"깨진 설정 파일과 죽은 화면을 끝내는 안정화 릴리스"** — `~/.claude.json` 값 하나가 깨져도 살아남고, 크래시·무한 대기·캐시 미스를 한꺼번에 걷어냈다.

---

# 📜 원문 (한글 번역본)

> 원문 ChangeLog를 원래 순서 그대로 한 줄도 빠짐없이 번역한 문서입니다.

- AGENTS.md 지원 추가: `CLAUDE.md` 가 없는 프로젝트에서 Claude Code 는 `AGENTS.md` 를 대신 읽는다. `/config` 의 "Project instructions" 에서 바꾼다 (Bedrock·Vertex·Foundry 는 아직 미지원)
- 외부로 나가는 유일한 통로가 forward proxy 인 Claude apps gateway 용 `CLAUDE_GATEWAY_PROXY_IS_EGRESS_BOUNDARY=1` 추가: 나가는 요청마다 호스트명을 로컬에서 풀지 않고 프록시에 넘긴다
- Claude apps gateway upstream 에 선택적 `headers:` 맵 추가. 제공자 앞단에 직접 운영하는 프록시로 고정 헤더를 보낼 때 쓴다
- `/tasks` 같은 패널이 열린 채로 백그라운드 작업이 끝나면, 업데이트가 대기 중이라는 줄을 추가
- 내부 오류 후 결과 없이 멈출 수 있던 `claude -p` 와 Agent SDK 세션 수정. 이제 오류를 보고하고 종료 코드 1 로 끝난다
- 이전 어시스턴트 턴이 다른 내용과 함께 빈 텍스트 블록을 갖고 있을 때 `--resume` 이후를 포함해 모든 요청이 "text content blocks must be non-empty" 로 실패하던 문제 수정
- 현재 빌드와 같은 기기에서 구버전 Claude Code 빌드(예: IDE 확장에 번들된 CLI)가 실행되면 예기치 않게 로그아웃되던 문제 수정
- `~/.claude.json` 이 잘못된 `customApiKeyResponses` 값을 갖고 있을 때 `ANTHROPIC_API_KEY` 사용자의 대화형 시작이 멈추거나 오류가 나던 문제 수정
- 프록시가 잘못된 버전을 반환할 때 최소·최대 버전이 설정돼 있으면 업데이트 확인이 30분마다 오류를 내고 `claude update` 가 멈추던 문제 수정. 잘못된 `minimumVersion` 은 이제 무시한다
- winget·apk 로 관리되는 설치에서 버전 조회가 실패했을 때 `claude update` 가 "up to date" 라고 보고하던 문제 수정
- 세션이나 다른 프로그램이 쓰고 있던 플러그인 버전을 재설치할 때 `claude plugin install` 이 이따금 실패하며 설치본을 망가뜨리던 문제 수정. 이제 변경되지 않은 사본은 그대로 둔다
- 시스템의 프로세스·메모리·파일 핸들이 부족해 검색을 시작할 수 없을 때 Grep 과 Glob 이 "일치 없음" 을 보고하던 문제 수정. 이제 그 사실을 알리는 오류를 반환한다
- 대상 경로가 기존 디렉토리일 때 Write 도구가 권한 거부처럼 조용히 턴을 끝내던 문제 수정. 이제 명확한 오류를 보고한다
- 이스케이프된 역슬래시 뒤에 오는 `uXXXX` 텍스트를 `\uXXXX` 이스케이프로 취급해, 비ASCII 문자 수정이 이스케이프된 역슬래시 시퀀스를 대신 고쳐쓸 수 있던 Edit 도구 문제 수정
- 비ASCII 텍스트가 든 매우 큰 수정이 파일과 맞지 않을 때 Edit 도구가 "String not found in file" 대신 "Invalid regular expression: regular expression too large" 를 보고하던 문제 수정
- 도구 호출의 파일 경로에 `\u0000` 이 이스케이프 시퀀스로 들어 있을 때 턴이 "Path contains null bytes" 로 일찍 끝나던 문제 수정. 이스케이프된 제어문자는 이제 그대로 리터럴 텍스트로 남는다
- 플러그인의 LSP 서버가 종료되거나 stdin 을 닫으면 백그라운드 세션(`claude --bg`)이 종료되던 문제 수정
- `~/.claude.json` 에 잘못된 `claudeAiMcpEverConnected` 값이 있을 때 `/mcp` 나 `/plugin manage` 를 열면 크래시("Type error")가 나던 문제 수정
- `~/.claude.json` 이 잘못된 `theme` 값을 갖고 있을 때 실행 시 크래시가 나던 문제 수정
- 히스토리에서 불러온 프롬프트나 외부 편집기에서 읽어온 텍스트처럼, 프롬프트에 터미널 색상 코드가 든 텍스트가 있을 때 크래시("unrecoverable interface error")가 나던 문제 수정
- 저장된 기록에 어시스턴트 메시지가 순수 문자열로 저장된 세션을 재개할 때 크래시가 나던 문제 수정
- 느리거나 부하가 큰 기기에서 첫 스피너가 나타날 때 세션이 이따금 "Claude Code exited after an unrecoverable interface error" 로 종료되던 문제 수정
- 내부 렌더링 오류 이후 남은 세션 내내 화면 갱신이 멈출 수 있던 드문 경우 수정
- Windows 에서 Claude 가 응답한 직후 "Out of memory" 같은 오류로 턴이 멈춰, 그 응답의 도구 호출이 전혀 실행되지 않던 드문 경우 수정
- SessionStart hook 이 출력을 냈을 때, `/clear` 이후 이어진 세션(재시작·`--continue`·`--resume`)의 첫 메시지 일부가 빠져 프롬프트 캐시가 전부 미스나던 문제 수정
- 턴 중간에 도착한 다른 에이전트의 메시지(예: 서브에이전트의 SendMessage)가 도착한 자리가 아니라 "Ran N shell commands" 줄 아래에 표시되던 문제 수정
- 전체화면 `/resume` 선택기와 프롬프트 영역을 덮는 다른 패널에서 텍스트를 드래그 선택한 뒤 "copied" 알림이 뜨지 않던 문제 수정
- 샌드박싱이 켜진 상태에서 샌드박스 밖으로 실행되는 Bash 명령에서 `$TMPDIR` 가 빈 값으로 확장되던 문제 수정
- Cowork 클라우드 세션의 WebFetch 와 WebSearch 가 요청이 거부된 이유(소진된 가져오기 예산, 관리자 정책 등)를 Claude 에게 알리지 않던 문제 수정
- 프록시가 설정돼 있을 때 Claude apps gateway 의 텔레메트리 릴레이가 `NO_PROXY` 에 나열된 수집기 호스트명이나 도메인을 무시하던 문제 수정
- 잘못된 `strictKnownMarketplaces` 또는 `blockedMarketplaces` 항목 하나가 엔터프라이즈 마켓플레이스 정책 전체를 조용히 비활성화하던 문제 수정
- 실패한 자동 업데이트가 `~/.cache/claude/staging` 에 큰 스테이징 다운로드를 남기던 문제 수정
- `/plugin` 이 Installed 탭의 메시지(실패한 플러그인 업데이트의 오류 등)에서 터미널 제어문자를 제거하지 않던 문제 수정
- 스킬이나 레거시 명령의 이름이 `constructor`·`toString` 같은 내장 Object 속성명과 같을 때 `/plugin` → Installed 와 `/skills` 가 크래시하던 문제 수정
- 다중 선택의 모든 설치가 실패했을 때 `/plugin` 이 아무 메시지 없이 닫히던 문제 수정
- 제거한 플러그인이 `/plugin` Installed 에 "failed to load" 줄로 다시 나타나고, Remove 로도 그 줄이 지워지지 않던 문제 수정
- 공식 마켓플레이스의 플러그인이 `installed_plugins.json` 에 커밋 없이 기록되던 문제와, 커밋 고정 플러그인을 업데이트한 뒤에도 `installed_plugins.json` 이 옛 커밋을 유지하던 문제 수정
- 플러그인 리로드 미리보기가 미리 본 모든 플러그인 아카이브 사본을 종료 시점까지 풀어 둔 채로 두던 문제와, 다운로드 실패 시 리로드가 되돌아가는 캐시된 `--plugin-url` 아카이브를 덮어쓰던 문제 수정
- `~/.claude.json` 이 잘못된 placeholder 레코드를 갖고 있을 때 Remote Control 세션 기록이 실패하던 문제 수정
- 취소된 claude.ai 로그인 이후의 오류가 Anthropic 프로필 만료 탓을 하던 문제 수정. 이제 `/login` 을 앞세운다
- 키 반복이나 아주 빠른 입력 중에 `claude agents` 디스패치 입력창에서 타이핑·붙여넣기한 텍스트가 이따금 뒤섞여 나오던 문제 수정
- 저장된 트랜스크립트에 hook 목록이 제대로 갖춰지지 않은 stop hook 요약이 있는 세션을 재개할 때 크래시("unrecoverable interface error")가 나던 문제 수정
- `keybindings.json` 이 Chat 컨텍스트의 Enter 를 예컨대 `chat:queueSubmit` 으로 재지정했을 때, 선택된 에이전트 패널 행에서 Enter 가 아무 동작도 하지 않던 문제 수정
- 작업 폴더의 경로가 길 때(약 120자 이상) Windows 에서 PDF 페이지 읽기가 실패하던 문제 수정
- 헤드리스 재개(`claude -p --resume`, SDK, VS Code 확장 창 리로드)가 세션의 비용·사용량 합계를 0 에서 시작하던 문제 수정. 헤드리스 세션도 이제 종료 시 합계를 저장한다
- `.claude/skills` 가 git 에 추적되지 않을 때 메인 저장소의 프로젝트 스킬이 `--worktree` 세션에서 로드되지 않던 문제 수정
- 복합 Bash 명령의 한 부분만 일치해도 `sandbox.excludedCommands` 글롭이 명령 전체를 샌드박스에서 면제하던 문제 수정. 이제 모든 부분이 일치해야 한다
- 재개된 서브에이전트와 팀메이트가 이미 로드한 MCP 도구 정의를 다시 렌더링해 해당 에이전트의 프롬프트 캐싱이 깨지던 문제 수정
- rate limit 에 걸린 아티팩트 발행이 Claude 에게 재시도를 멈추라고 하던 문제 수정. 이제 아무것도 발행되지 않았다는 사실과 같은 발행을 언제 다시 보내면 되는지를 알려준다
- 대화 앞쪽에 기록된 첨부가 재개·재실행 후 다시 렌더링돼 확장 사고(extended thinking)가 사라지고 프롬프트 캐시를 놓치던 문제 수정
- 서버가 API 키 생성을 거부할 때 Console 로그인이 "Request failed with status code 400" 만 보여주던 문제 수정. 이제 서버의 메시지를 보여준다
- Claude 가 아직 작업 중일 때 입력한 메시지가 이따금 모델에게 무시되던 문제 수정
- SDK 와 헤드리스(`-p`) 사용의 세션 시작 개선: 첫 턴이 더 이상 디렉토리별 `CLAUDE.md` 조회를 기다리지 않는다
- Claude apps gateway 의 루프백 오류 메시지가 `CLAUDE_GATEWAY_ALLOW_LOOPBACK` 를 명시하도록 개선
- `/plugin` Installed 개선: 플러그인과 따로 나열된 MCP 서버가 어느 플러그인 소속인지 보여준다
- 이미 설치된 플러그인에 대한 `claude plugin install` 개선: 마켓플레이스에 더 새로운 버전이 있으면 알려주고 `claude plugin update` 명령을 이름으로 안내한다
- 로고 아래 시작 알림 넘침 줄 개선: "+N more · /status" 대신 "N more notices hidden" 으로 표시
- 프롬프트 처리 개선: 프롬프트 속 보이지 않는 유니코드 서식·태그 문자를 제거하고, 전송 전에 정리된 프롬프트를 보여준다
- 리뷰할 것이 없을 때의 `/ultrareview` 개선: 어떤 경우인지 알려주고, 최신 커밋을 리뷰하는 명령을 제안하며, 새 저장소의 첫 커밋은 전체가 리뷰된다
- 아티팩트 링크 처리 개선: Artifact 도구를 쓸 수 있을 때 Claude 가 claude.ai 아티팩트 링크를 WebFetch 대신 그 도구로 읽는다
- 위험한 rm 권한 프롬프트 개선: 문제가 된 rm 명령을 짚어 주고 `${VAR:?}` 가드를 제안해, 헤드리스 실행도 복구할 수 있다
- Artifact 도구의 권한 프롬프트 개선: 문장이 짧아지고, 페이지와 아티팩트는 제목이나 파일명으로 표기되며, 링크는 본문 뒤에 나열된다
- Anthropic API 에서 Fable 이 `/model` 에 항상 나타나도록 변경. 조직 설정이 비활성화한 경우에만 회색으로 표시된다
- Bedrock·Vertex·Foundry 의 Bash 샌드박스 안내를 1st-party 문구로 변경. 샌드박스를 주어진 작업의 경계로 설명한다
- 비대화형 세션의 `/ultrareview` 를, 저장소에 base 브랜치나 공통 이력이 없으면 거부하도록 변경
- 서브에이전트 결과가 서브에이전트 출력임을 표시하는 헤더 아래 들여쓰기된 채로 메인 에이전트에 도달하도록 변경. 서브에이전트 결과 속 텍스트가 세션 자체의 지시처럼 통하지 않게 한다
- Bedrock·Vertex·Foundry 에서 워크플로 스크립트의 계산된 `agent()` 프롬프트가 스크립트가 작성한 텍스트로 구분돼 서브에이전트에 도달하도록 변경. 안전 분류기가 그것을 사용자 발언으로 읽지 않게 한다
- SDK 나 IDE 밖에서 실행된 `claude -p` 에서 백그라운드 Haiku 자동 제목 요청 제거
- 사용 중단된 TaskOutput 도구 제거. Claude 는 백그라운드 작업의 출력 파일을 Read 로 읽으며, `taskOutputMaxChars` 설정과 `TASK_MAX_OUTPUT_LENGTH` 는 더 이상 아무 효과가 없다
- [VSCode] 패널 메뉴에 Sign out 줄 추가, 타이핑 명령 메뉴에는 `/logout` 추가
- [VSCode] 에이전트 맵에 백그라운드 셸과 그 밖의 실행 중 작업을 각각 Stop 과 함께 추가하고, 이를 여는 타이핑 `/tasks` 추가
- [VSCode] 응답에 Copy response 버튼과 타이핑 `/copy` 추가
- [VSCode] 비활성 세션이 자동으로 보관될 때의 1회성 안내와, Archived sessions 그룹의 "Unarchive all" 동작 추가
- [VSCode] 플랜 한도가 적용되지 않는 환경(Vertex, Bedrock, Foundry, API key)의 Account & usage 대화상자와 세션 매니저에 세션의 비용과 토큰 사용량 추가
- [VSCode] "General config" 메뉴 줄이 설정을 열지 않고 `/config` 사용법 텍스트를 보여주던 문제 수정. 타이핑한 `/mcp`·`/hooks`·`/memory`·`/rewind` 등 유사 명령도 각자의 대화상자를 열도록 했다
- [VSCode] `/effort` 로 이미 레벨이 저장된 모델에서 effort 슬라이더의 레벨이 이후 세션까지 유지되지 않던 문제 수정
- [VSCode] 저장된 모델 설정이 "Sonnet" 처럼 대소문자가 다른 별칭일 때, 이미 사용 중인 패널에서 연 대화의 모드 선택기에서 Auto 가 빠져 있던 문제 수정
- [VSCode] `/fast` 가 fast 모드를 기본값으로 저장하지 않아, 확장이 Claude Code 를 다시 실행하면 사라지던 문제 수정
- [Claude Code on the web] Team·Enterprise 플랜의 환경 선택기에 Personal 과 Organization 섹션 추가. 관리자는 이제 개인 환경을 조직과 공유할 수 있다
- [Claude Code on the web] Team·Enterprise 플랜에서 조직 환경이 Code 탭에서 읽기 전용 요약으로 열리도록 변경. 편집은 Admin settings → Cloud environments 에서 한다
- [Claude Code on the web] Custom network access 로 저장했으나 도메인이 없는 클라우드 환경이 조용히 Trusted 로 되돌아가던 문제 수정. 대화상자가 이제 최소 1개 도메인을 요구한다
- [Claude Code on the web] 관리자 Claude Code 설정에서 "Web" 라벨을 "Cloud sessions" 로 변경하고, 그 아래 중복된 읽기 전용 Mobile 줄을 제거
- [Claude Tag] Enterprise Grid 조직 전체 설치의 Slack 채널에서 만든 루틴이 실행될 때 같은 워크스페이스의 다른 공개 채널을 읽지 못하던 문제 수정
- [Claude Tag] Claude Tag 액세스 번들의 자격증명 프리셋에 있는 "Learn more" 링크가 일반 API 레퍼런스 대신 각 벤더의 자격증명 설정 페이지를 열도록 수정
- [Claude Tag] Claude Tag 액세스 번들의 Pylon 자격증명 프리셋을 관리자가 Pylon 의 EU 호스트로 지정할 수 있도록 변경
- [Claude Tag] Claude Tag 액세스 번들의 Google Cloud 자격증명 폼 수정: 거부된 키 파일이 이유를 알려주고, 웹사이트와 스코프는 잠긴 채 유지되며, 거부된 회전은 붙여넣은 키를 남긴다
- [Claude Tag] AWS 서명·클라이언트 인증서·커스텀 CA 를 쓰는 연결을 통한 요청에 대해 Claude Tag 관리자 설정의 네트워크 이벤트 로그가 응답 상태를 보여주지 않던 문제 수정

---

## 🎯 챌린지

이번 버전에서 내 환경에 적용해볼 만한 항목입니다.

### 1. SessionStart hook 출력이 캐시를 깨던 문제 — 업데이트 후 확인
- **파일**: `/Users/leeseonro/.claude/settings.json`
- **근거**: 이 버전은 SessionStart hook 이 출력을 내면 `/clear` 이후 이어진 세션의 첫 메시지 일부가 빠져 프롬프트 캐시가 전부 미스나던 문제를 고쳤다. 현재 환경에는 superpowers 를 주입하는 SessionStart hook 이 있으므로(응답 맨 앞에 붙는 `using-superpowers` 블록) 정확히 이 경로에 해당한다. `claude update` 로 v2.1.277 이상인지 확인하고, `/clear` 후 재개 시 첫 메시지가 온전한지 한 번 눌러본다.
- **난이도**: ★☆☆ (약 5분)

### 2. `taskOutputMaxChars`·`TASK_MAX_OUTPUT_LENGTH` 잔재 제거
- **파일**: `/Users/leeseonro/.claude/settings.json`
- **근거**: TaskOutput 도구가 제거되면서 `taskOutputMaxChars` 설정과 `TASK_MAX_OUTPUT_LENGTH` 환경변수는 아무 효과가 없다. 설정이나 셸 프로필에 남아 있으면 지운다 — 죽은 설정이 남아 있으면 나중에 동작한다고 착각한다. `grep -r "taskOutputMaxChars\|TASK_MAX_OUTPUT_LENGTH" ~/.claude ~/.zshrc` 로 확인 후 삭제.
- **난이도**: ★☆☆ (약 5분)

### 3. `sandbox.excludedCommands` 글롭 재점검
- **파일**: `/Users/leeseonro/.claude/settings.json`
- **근거**: 복합 Bash 명령의 한 부분만 매칭돼도 전체가 샌드박스에서 빠지던 동작이 "모든 부분이 매칭돼야" 로 바뀌었다. `excludedCommands` 를 쓰고 있다면 기존에 통과하던 `a && b` 형태 명령이 이제 샌드박스 안으로 들어가 막힐 수 있다. 배포 관련 명령(`deploy-guard.sh` 가 감시하는 git push 등)을 실제로 한 번 돌려 막히는 것이 없는지 확인한다.
- **난이도**: ★★☆ (약 15분)

### 4. `claude plugin update` 로 비활성 플러그인 정리
- **파일**: `/Users/leeseonro/.claude/settings.json` 의 `enabledPlugins`
- **근거**: 이번 버전은 `installed_plugins.json` 의 커밋 기록 누락과 삭제한 플러그인이 "failed to load" 줄로 남는 문제를 고쳤다. 현재 `enabledPlugins` 에 `false` 로 꺼둔 플러그인이 6개 있다 — `/plugin` Installed 를 열어 잔존 행을 Remove 로 정리하고, 쓰는 플러그인은 `claude plugin update` 로 최신 버전 안내를 받는다.
- **난이도**: ★★☆ (약 15분)
