# Claude Code v2.1.243

> 작성일: 2026-08-28

---

# 📋 요약본

## 🎉 신기능 (10건)
- **`/usage` Loops 분석** — `/loop` 작업별 실행 횟수, 총 토큰, 실행당 토큰, 마지막 실행 시각을 표시한다. 토큰을 폭식하는 루프를 바로 찾아낸다.
- **`modelPicker` 설정** — `/model` 선택 목록을 직접 큐레이션한다. 순서와 라벨을 지정하고, 어떤 형식의 모델 id든(Vertex·Bedrock id 포함) 쓸 수 있다. 기본 목록에 덧붙이거나 통째로 교체한다.
- **`promptCacheTtl`·`subagentPromptCacheTtl` 설정** — API 키·클라우드 제공자 사용자가 메인 대화는 1시간 프롬프트 캐시로 유지하면서 서브에이전트는 5분으로 둘 수 있다.
- **`modelPricing` 관리 설정** — 조직의 계약 단가와 할인 배수를 `/cost`, 상태 표시줄, 텔레메트리 비용 계산에 반영한다. 정가 대신 실제 계약가로 나온다.
- **API 키 없는 로그인** — `/login` → Anthropic Console 에서 "Sign in with your Console account"(권장)를 고를 수 있다. API 키 발급을 금지한 조직도 로그인 가능하다.
- **`/status` 의 `Skipped sources` 줄** — 존재하지만 더 높은 우선순위 관리 소스에 밀려 적용되지 않은 관리 설정 소스(예: `managed-settings.json`)를 나열한다.
- **`managed` 표시** — `/mcp` 와 `/plugins` 에서 조직이 인증을 관리하는 claude.ai 커넥터에 `managed` 마커를 붙인다.
- **`/web-setup` 안내 팁** — 웹용 Claude Code 에 GitHub 을 연결하지 않은 claude.ai 사용자에게 `/web-setup` 을 안내한다.
- **`/status` 의 GitHub 연결 상태 줄** — 웹용 Claude Code(Pro/Max)에 GitHub 이 연결됐는지 표시하고, 안 됐으면 `/web-setup` 을 가리킨다.
- **`/tasks` 에 서브에이전트 모델 표시** — 각 서브에이전트가 어떤 모델과 effort level 로 돌았는지 `/tasks` 와 에이전트 상세 대화상자에 표시한다.

## 🛠️ 개선/수정 (51건)
- **비대화형·SDK 세션의 원격 MCP 복구** — `-p` 및 SDK 세션에서 연결이 끊긴 원격 MCP 서버가 영영 살아나지 않던 문제 수정. 이제 자동 재연결하거나 실패로 보고한다.
- **데스크톱 앱발 MCP 로그인 실패** — client ID metadata document 를 지원하는 서버(예: Linear)에서 "Invalid redirect URI" 로 실패하던 문제 수정.
- **auto mode 시작 불가** — 서버 측 임시 비활성화가 캐시된 뒤 이후 플래그 조회가 실패하면 auto mode 가 계속 막혀 있던 문제 수정.
- **auto mode 도구 호출 거부** — API 가 잠시 과부하로 재시도를 요청했을 때 약 1분 대기 후 "temporarily unavailable" 로 거부되던 문제 수정.
- **`/model` 의 Ultracode 선택 무시** — 이제 Ultracode 를 고르면 현재 세션에 실제로 적용된다.
- **`/resume` 목록 50개 제한** — 최근 50개만 보이던 제약 해소. 스크롤하면 더 불러온다.
- **클라우드 세션 재개 오동작** — 턴 도중 재시작된 뒤 대기 중이던 hook·백그라운드 작업 알림이 정상 이어가기 메시지 대신 프롬프트로 재전송되던 문제 수정.
- **크로스 세션 메시징 무단 비활성화** — 2.1.232 소켓 디렉터리 하드닝 이후 user namespace·rootless 컨테이너에서 조용히 꺼지던 문제 수정.
- **컨테이너 밖으로 넘친 텍스트 깨짐** — 화면 다른 부분이 다시 그려질 때 `/login` 의 로그인 URL 같은 텍스트가 앞 컬럼을 잃던 문제 수정.
- **`spellcheck` 이모지 직후 오타** — 이모지 바로 뒤에 친 오타에 밑줄이 안 그어지던 문제 수정.
- **백그라운드 서브에이전트 미기상** — 마지막 백그라운드 Bash 작업이 끝나도 깨어나지 않던 문제 수정.
- **응답 없는 API 로 인한 10분+ 침묵** — 이제 약 3분 후 타임아웃하고 한 번 재시도한 뒤 `API Error: No response from API` 를 표시한다.
- **클라이언트 오류 메시지 렌더링** — 인증·모델 가용성 등 클라이언트가 만든 오류가 모델 출력처럼 보이던 문제 수정. 이제 오류 줄로 표시된다.
- **CI 의 workload identity federation** — 한 job 안의 여러 프로세스가 교환된 토큰을 공유한다(일회용 토큰 재교환 방지). 교환이 거부되면 서버 메시지와 함께 즉시 실패한다.
- **`companyAnnouncements` 미표시** — 로그인으로 시작한 세션(예: `/logout` 후 첫 실행)에서 서버 관리 공지가 시작 시 안 보이던 문제 수정.
- **hook `if` 조건 오발동** — `Bash(cat *)` 같은 조건이 `$()`·백틱 명령 치환 뒤에 인자가 더 붙은 무관한 Bash 명령에도 걸리던 문제 수정.
- **플러그인 의존성 미해결** — `marketplace` 필드로 선언된 의존성이 두 플러그인을 `--plugin-dir` 로 함께 로드할 때 전혀 풀리지 않던 문제 수정.
- **`/reload-plugins` 의 LSP 잔존** — 마지막 LSP 플러그인을 꺼도 LSP 도구가 남던 문제 수정. 대화를 다시 읽게 만드는 LSP 플러그인 변경 전에는 경고한다.
- **`--agents` 의 조용한 무시** — 잘못된 JSON 이나 잘못된 에이전트 정의를 무시하던 것을 `--mcp-config` 처럼 명확한 오류로 종료하도록 수정.
- **`/status` 의 파일명 없는 경고** — `~/.claude.json` 에 잘못된 MCP 서버 항목이 있을 때 "Found invalid entries in: ." 로 나오던 문제 수정.
- **`/clear` 의 세션 이름 삭제** — 새 세션에 이름이 유지되는데도 프롬프트 바에서 `/rename` 이름이 사라지던 문제 수정.
- **history 파일 손상 시 검색 불능** — `~/.claude/history.jsonl` 에 깨진 항목이 있으면 Ctrl+R 검색과 위쪽 화살표 기록이 망가지던 문제 수정.
- **Ctrl+[ 로 vim INSERT 탈출 불가** — 수정 키를 인코딩하는 터미널(modifyOtherKeys / kitty protocol)에서 동작하지 않던 문제 수정.
- **IDE 연결의 프록시 우회 실패** — `NO_PROXY` 에 `localhost` 가 있으나 소문자 `no_proxy` 엔 없을 때 로컬 IDE 연결이 `HTTPS_PROXY` 를 타던 문제 수정. 이제 대소문자 양쪽을 모두 인정한다.
- **샌드박스 네트워크 위반 정보 유실** — 차단된 명령이 그래도 0 으로 종료하면(예: `curl` 이 프록시의 403 페이지를 출력) 위반 상세가 Bash 결과에서 빠지던 문제 수정.
- **rate limit 창 초기화 후 옛 수치** — 세션이 유휴인 채 창이 초기화돼도 상태 표시줄 `rate_limits` 필드와 `/usage` 가 초기화 전 사용률을 보여주던 문제 수정.
- **`claude --teleport <session>` 의 미커밋 변경 처리** — 그냥 종료하던 것을 세션 선택기처럼 stash 후 계속할지 제안하도록 수정.
- **`/web-setup` 반복 로그인 요구** — `gh auth token` 이 없는 구버전 GitHub CLI 로 이미 인증된 경우 계속 로그인을 요구하던 문제 수정.
- **Chrome 용 Claude 연결 끊김** — 자동 업데이트가 설정 당시 버전을 정리하면 연결이 끊기던 문제 수정. 이제 native host 가 안정적인 `claude` 런처로 실행된다.
- **[VSCode] 기본 권한 모드로 열림** — 기능 플래그를 처음 가져오기 전에 시작한 세션(예: 설치 직후)이 auto mode 나 설정한 기본 모드 대신 기본 권한 모드로 열리던 문제 수정.
- **[VSCode] Focus 뷰 자동 접힘** — 펼쳐 둔 섹션이 서브에이전트 도구 활동 중 저절로 접히던 문제 수정.
- **시작 속도 개선** — 샌드박스·MCP 기동이 첫 화면을 막지 않고, 맨몸 실행은 서브커맨드 등록을 건너뛰며, 워크플로우 탐색·설정·trust store 작업이 가벼워졌다.
- **설치·자동 업데이트 다운로드 축소** — 바이너리를 zstd 로 압축해 Linux x64 기준 340MB → 약 75MB.
- **`ANTHROPIC_AUTH_TOKEN` 세션의 조직 귀속 개선** — Anthropic API 에 직접 인증하는 세션의 사용량 텔레메트리가 조직에 제대로 귀속돼 해당 데이터 처리 설정이 적용된다.
- **네이티브 바이너리 크기 축소** — 번들 스킬·프롬프트 텍스트를 더 조밀하게 저장해 약 2MB 감소.
- **네이티브 빌드 메모리 사용량 개선** — 번들 전체를 상주시키지 않고 필요할 때 코드를 로드한다. 세션당 약 40~70MB 절감.
- **장기 세션 최대 메모리 개선** — 힙이 커질수록 런타임이 더 일찍 GC 한다.
- **SSH 환경 `/login` 개선** — 로그인 URL 이 즉시 보이고, `c` 를 누르면 무조건 성공했다고 하지 않고 어떻게 복사됐는지 알려주며, 전체 화면에서 텍스트 선택하는 법을 힌트로 준다.
- **effort `xhigh`/`max` 오류 메시지 개선** — thinking 이 꺼진 상태에서 쓰면 해당 레벨, thinking 을 끈 설정, 해법인 `/effort high` 를 함께 알려준다.
- **`/loop` 출력 개선** — 할 일이 없는 연속 기상은 터미널에서 한 줄로 접힌다.
- **샌드박스 Bash 프롬프트 변경** — 허용된 네트워크 호스트 목록을 더 이상 나열하지 않는다. Claude 가 요청을 시도하고 사용자가 새 호스트를 승인할 수 있게 한다(목록에 없다고 차단으로 단정하지 않는다).
- **Sonnet 5 가격 표기 변경** — `/model` 선택기와 번들 `claude-api` 스킬에서 $2/$10 per Mtok 을 한시 프로모가 아닌 표준 정가로 표시한다.
- **macOS computer use 권한 변경** — 데스크톱·Dock·Finder 창 클릭 시 다른 앱과 마찬가지로 접근 대화상자에서 Finder 권한을 요구한다.
- **`/model`·`/fast`·`/effort` 즉시 실행** — Bedrock·Vertex·Foundry 와 텔레메트리 비활성 환경에서도 턴이 끝날 때까지 큐에 쌓이지 않고 바로 적용된다.
- **`claude remote-control` 종료 문제** — 서버가 세션 도중 환경을 내려버리면 종료되며 붙어 있던 Remote Control 세션을 고립시키던 문제 수정. 이제 복구한다.
- **Remote Control 세션 멈춤** — `claude remote-control` 을 중지·재시작한 뒤 admin·owner 권한이 없는 Team·Enterprise 구성원의 세션이 멈추던 문제 수정.
- **크로스 세션 메시징 소켓 타임아웃** — 30초 안에 완전한 한 줄을 보내지 않는 연결을 닫는다. 소켓에 데이터를 보내는 스크립트는 보낼 준비가 된 뒤 연결해야 한다.
- **Remote Control 점유 안내 개선** — 다른 터미널이 Remote Control 을 쥔 대화를 재개할 때, 다른 기기의 세션은 여기서 보이지도 닿지도 않는다고 설명한다.
- **[VSCode] 장기 세션 기록 정리 개선** — 오래된 도구 활동 줄을 먼저 버려 사용자 메시지와 Claude 의 답변이 계속 보이게 한다.
- **[VSCode] 확장 텔레메트리 조직 귀속 개선** — Claude 계정으로 로그인한 경우 확장 자체의 사용량 텔레메트리가 조직에 귀속돼 해당 데이터 처리 설정이 적용된다.

## 🔑 이번 버전의 핵심 키워드
**"관측과 통제"** — `/usage` 루프 분석·`modelPicker`·`modelPricing`·프롬프트 캐시 TTL 로 무엇이 얼마나 쓰이는지 보이게 하고, 그걸 직접 고를 수 있게 한 버전.

---

# 📜 원문 (한글 번역본)

> 원문 ChangeLog를 원래 순서 그대로 한 줄도 빠짐없이 번역한 문서입니다.

- `/usage` 에 Loops 분석 추가: 루프별 실행 횟수, 총 토큰, 실행당 토큰, 마지막 실행을 보여줘 폭주하거나 수다스러운 `/loop` 작업을 쉽게 찾아낸다
- `modelPicker` 설정 추가: `/model` 선택기를 순서와 라벨을 가진 모델 목록(Vertex·Bedrock id 포함 어떤 id 표기든)으로 큐레이션한다. 기본 라인업에 덧붙이거나 대체한다
- `promptCacheTtl` 과 `subagentPromptCacheTtl` 설정 추가: API 키·클라우드 제공자 사용자가 메인 대화의 프롬프트 캐시를 1시간으로 유지하면서 서브에이전트는 5분으로 둘 수 있다
- `modelPricing` 관리 설정 추가: `/cost`, 상태 표시줄, 텔레메트리 비용 수치에 정가 대신 조직의 계약 모델 단가와 할인 배수를 사용한다
- `/login` → Anthropic Console 아래에 키 없는 로그인 추가: API 키 생성과 나란히 "Sign in with your Console account"(권장)를 제공해, API 키를 허용하지 않는 조직도 로그인할 수 있다
- `/status` 에 `Skipped sources` 줄 추가: 존재하지만 더 높은 우선순위의 관리 소스가 활성이라 적용되지 않은 관리 설정 소스(예: `managed-settings.json`)를 나열한다
- 조직이 인증을 관리하는 claude.ai 커넥터에 대해 `/mcp` 와 `/plugins` 에 `managed` 마커 추가
- 웹용 Claude Code 에 GitHub 을 연결하지 않은 claude.ai 사용자를 `/web-setup` 으로 안내하는 팁 추가
- 웹용 Claude Code(Pro/Max)에 GitHub 이 연결됐는지 보여주고, 안 됐을 때 `/web-setup` 을 가리키는 `/status` 줄 추가
- 각 서브에이전트가 실행된 모델(및 effort level)을 `/tasks` 와 에이전트 상세 대화상자에 추가
- 비대화형(`-p`)·SDK 세션에서 원격 MCP 서버가 연결이 끊긴 뒤 결코 복구되지 않던 문제 수정. 이제 자동 재연결하거나 실패로 보고한다
- client ID metadata document 를 지원하는 서버(예: Linear)에서 데스크톱 앱으로 시작한 MCP 서버 로그인이 "Invalid redirect URI" 로 실패하던 문제 수정
- 서버 측 임시 비활성화가 캐시되고 이후 플래그 조회가 실패했을 때 시작 시 auto mode 가 계속 사용 불가 상태로 남던 문제 수정
- API 가 잠시 과부하 상태여서 클라이언트에 재시도를 요청했을 때, 약 1분 대기 후 auto mode 도구 호출이 "temporarily unavailable" 로 거부되던 문제 수정
- `/model` 선택기가 Ultracode 선택을 조용히 무시하던 문제 수정. 이제 Ultracode 를 고르면 현재 세션에 적용된다
- `/resume` 이 최근 50개 세션만 나열하던 문제 수정. 이제 스크롤하면 선택기가 더 불러온다
- 클라우드 세션이 턴 도중 재시작 후 재개될 때, 대기 중이던 hook 또는 백그라운드 작업 알림이 정상 이어가기 메시지 대신 프롬프트로 재전송되던 문제 수정
- 2.1.232 의 소켓 디렉터리 하드닝 이후 user namespace 와 rootless 컨테이너에서 크로스 세션 메시징이 조용히 꺼지던 문제 수정
- 컨테이너 밖으로 넘치는 텍스트(예: `/login` 의 로그인 URL)가 화면의 다른 부분이 다시 그려질 때 앞쪽 컬럼을 잃던 문제 수정
- 이모지 바로 뒤에 입력한 오타에 `spellcheck` 가 밑줄을 긋지 않던 문제 수정
- 마지막 백그라운드 Bash 작업이 완료될 때 백그라운드 서브에이전트가 깨어나지 않던 문제 수정
- Anthropic API 가 응답을 아예 시작하지 않을 때 세션이 10분 넘게 침묵하던 문제 수정: 이제 약 3분 후 요청이 타임아웃되고 한 번 재시도한 뒤 `API Error: No response from API` 를 표시한다
- 인증, 모델 가용성 등 클라이언트가 생성한 오류 메시지가 오류 줄이 아니라 모델 출력처럼 렌더링되던 문제 수정
- CI 의 workload identity federation 수정: 한 job 의 여러 프로세스가 일회용 토큰을 재교환하는 대신 교환된 토큰을 공유한다. 교환이 거부되면 서버 메시지와 함께 즉시 실패한다
- 로그인으로 시작한 세션(예: `/logout` 후 첫 실행)에서 서버가 관리하는 `companyAnnouncements` 가 시작 시 표시되지 않던 문제 수정
- 명령에 `$()` 나 백틱 명령 치환이 있고 그 뒤에 인자가 더 붙었을 때, `Bash(cat *)` 같은 hook `if` 조건이 무관한 Bash 명령에도 발동하던 문제 수정
- `marketplace` 필드로 선언된 플러그인 의존성이 두 플러그인을 `--plugin-dir` 로 함께 로드할 때 전혀 해결되지 않던 문제 수정
- 마지막 LSP 플러그인을 비활성화한 뒤에도 `/reload-plugins` 가 LSP 도구를 유지하던 문제 수정. 이제 대화를 다시 읽게 되는 LSP 플러그인 변경 전에 경고도 한다
- `--agents` 가 잘못된 JSON 이나 잘못된 에이전트 정의를 조용히 무시하던 문제 수정. 이제 `--mcp-config` 처럼 명확한 오류와 함께 종료한다
- `~/.claude.json` 에 잘못된 MCP 서버 항목이 있을 때 `/status` 가 파일명 없이 "Found invalid entries in: ." 를 보여주던 문제 수정
- 새 세션에 이름이 유지됨에도 `/clear` 가 프롬프트 바에서 `/rename` 세션 이름을 제거하던 문제 수정
- `~/.claude/history.jsonl` 에 형식이 깨진 항목이 있을 때 Ctrl+R 기록 검색과 위쪽 화살표 기록이 망가지던 문제 수정
- 수정 키를 인코딩하는 터미널(modifyOtherKeys / kitty protocol)에서 Ctrl+[ 로 vim INSERT 모드를 빠져나가지 못하던 문제 수정
- `NO_PROXY` 에는 `localhost` 가 있지만 소문자 `no_proxy` 에는 없을 때 로컬 IDE 연결이 `HTTPS_PROXY` 를 경유하던(그리고 때때로 실패하던) 문제 수정. 이제 두 표기 모두 인정한다
- 차단된 명령이 그래도 0 으로 종료한 경우(예: `curl` 이 프록시의 403 페이지를 출력) 샌드박스 네트워크 위반 상세가 Bash 도구 결과에서 누락되던 문제 수정
- 세션이 유휴인 동안 rate limit 창이 초기화된 뒤에도 상태 표시줄 `rate_limits` 필드와 `/usage` 가 초기화 이전 사용률을 계속 보여주던 문제 수정
- `claude --teleport <session>` 이 미커밋 변경이 있을 때 세션 선택기처럼 stash 후 계속할지 제안하지 않고 종료하던 문제 수정
- `gh auth token` 이 없는 구버전 GitHub CLI 로 이미 인증된 상태에서 `/web-setup` 이 반복적으로 로그인을 요구하던 문제 수정
- 자동 업데이트가 설정에 사용된 버전을 정리해 Chrome 용 Claude 가 Claude Code 와의 연결을 잃던 문제 수정. 이제 native host 가 안정적인 `claude` 런처를 통해 실행된다
- [VSCode] 기능 플래그를 처음 가져오기 전에 시작된 세션(예: 설치 직후)이 auto mode 나 설정한 기본 모드 대신 기본 권한 모드로 열리던 문제 수정
- [VSCode] 펼쳐 둔 Focus 뷰 섹션이 서브에이전트 도구 활동 중 스스로 접히던 문제 수정
- 시작 시간 개선: 샌드박스와 MCP 기동이 더 이상 첫 프레임을 막지 않고, 맨몸 실행은 서브커맨드 등록을 건너뛰며, 워크플로우 탐색·설정·trust store 작업이 더 저렴해졌다
- 네이티브 설치·자동 업데이트 다운로드 크기 개선: 바이너리가 zstd 로 압축돼 Linux x64 기준 340MB 대신 약 75MB
- `ANTHROPIC_AUTH_TOKEN` 으로 Anthropic API 에 직접 인증하는 세션의 사용량 텔레메트리를 조직에 더 잘 귀속시켜, 조직의 데이터 처리 설정이 적용되도록 개선
- 네이티브 바이너리 크기 개선: 번들된 스킬·프롬프트 텍스트를 더 조밀하게 저장해 약 2MB 감소
- 네이티브 빌드의 메모리 사용량 개선: 번들 전체를 상주시키는 대신 필요할 때 코드를 로드한다(세션당 대략 40~70MB 절감)
- 장기 실행 세션의 최대 메모리 사용량 개선(런타임이 힙이 커질수록 더 일찍 가비지 컬렉션한다)
- SSH 환경의 `/login` 개선: 로그인 URL 이 즉시 나타나고, `c` 를 누르면 항상 성공했다고 주장하는 대신 URL 이 어떻게 복사됐는지 알려주며, 전체 화면에서 텍스트를 선택하는 방법을 힌트로 설명한다
- thinking 이 꺼진 상태에서 effort `xhigh`/`max` 를 사용할 때의 오류 개선: 이제 해당 레벨, thinking 을 비활성화한 설정, 해결책인 `/effort high` 를 함께 알려준다
- `/loop` 개선: Claude 가 할 일이 없는 연속 기상은 각각 출력되지 않고 터미널에서 한 줄로 접힌다
- 샌드박스 Bash 도구 프롬프트가 허용된 네트워크 호스트를 더 이상 나열하지 않도록 변경. Claude 가 목록에 없는 호스트를 차단됐다고 단정하는 대신 요청을 시도하고(사용자는 새 호스트를 승인할 수 있다)
- `/model` 선택기와 번들된 `claude-api` 스킬이 Sonnet 5 의 $2/$10 per Mtok 가격을 한시 프로모가 아닌 표준 정가로 표시하도록 갱신
- macOS 의 computer use 변경: 데스크톱, Dock, Finder 창을 클릭할 때 다른 앱과 마찬가지로 접근 대화상자에서 Finder 권한 부여를 요구한다
- `/model`, `/fast`, `/effort` 가 Bedrock, Vertex, Foundry 및 텔레메트리 비활성 환경에서도 턴이 끝날 때까지 큐에 대기하지 않고 즉시 실행되도록 변경
- 서버가 세션 도중 환경을 내려버릴 때 `claude remote-control` 이 종료되며 붙어 있던 Remote Control 세션을 고립시키던 문제 수정. 이제 복구한다
- admin 또는 owner 역할이 없는 Team·Enterprise 구성원에게서, `claude remote-control` 을 중지했다 재시작한 뒤 그것이 제공하는 Remote Control 세션이 때때로 멈추던 문제 수정
- 크로스 세션 메시징 인박스 소켓이 30초 안에 완전한 한 줄을 보내지 않는 연결을 닫도록 변경. 소켓에 보내는 스크립트는 데이터가 준비된 뒤에 연결해야 한다
- Remote Control 을 다른 터미널이 쥐고 있는 대화를 재개할 때의 안내 개선: 이제 다른 기기의 세션은 여기서 볼 수도, 여기에 닿을 수도 없다고 알린다
- [VSCode] 장기 세션의 기록 정리 개선: 오래된 도구 활동 줄을 먼저 버려 사용자 메시지와 Claude 의 답변이 계속 보이게 한다
- [VSCode] Claude 계정으로 로그인했을 때 확장 자체의 사용량 텔레메트리를 조직에 더 잘 귀속시켜, 조직의 데이터 처리 설정이 적용되도록 개선

---

## 🎯 챌린지

이번 버전에서 내 환경에 적용해볼 만한 항목입니다.

### 1. `modelPicker` 로 `/model` 목록을 실제 쓰는 모델만 남기기
- **파일**: `~/.claude/settings.json`
- **근거**: 현재 `model` 은 `claude-fable-5[1m]` 이지만 CLAUDE.md §5 는 서브에이전트를 Opus 로 고정한다. `modelPicker` 에 Opus 5·Fable 5·Sonnet 5 만 라벨과 순서를 지정해 남기면 모델 전환 시 잘못 고르는 사고를 줄인다.
- **난이도**: ★☆☆ (약 8분)

### 2. `promptCacheTtl` 로 메인 대화 캐시 1시간 유지
- **파일**: `~/.claude/settings.json`
- **근거**: `effortLevel: xhigh` + 서브에이전트 다수 dispatch 조합은 메인 컨텍스트가 크다. `promptCacheTtl` 을 1시간으로, `subagentPromptCacheTtl` 은 5분으로 두면 긴 세션의 캐시 히트가 올라간다. 단 이 설정은 API 키·클라우드 제공자 인증에만 적용되므로 본인 인증 방식을 먼저 확인해야 한다.
- **난이도**: ★☆☆ (약 10분)

### 3. hook `if` 조건 오발동 수정에 맞춰 `deploy-guard.sh` 매처 점검
- **파일**: `~/.claude/settings.json`, `~/.claude/hooks/deploy-guard.sh`
- **근거**: 이번 버전에서 `Bash(cat *)` 형태의 hook `if` 조건이 `$()`·백틱이 섞인 명령에 오발동하던 버그가 고쳐졌다. `deploy-guard.sh` 는 `git push` 차단이 목적이므로, 명령 치환이 섞인 push 명령에서 이전엔 잘못 걸리거나 빠지지 않았는지 실제 push 형태 몇 개로 확인한다.
- **난이도**: ★★☆ (약 15분)

### 4. `/usage` Loops 분석으로 `/loop` 토큰 소모 확인
- **파일**: `~/.claude/settings.json` (필요 시 `/loop` 주기 조정)
- **근거**: changelog 동기화 등 반복 작업을 `/loop` 로 돌리고 있다면 실행당 토큰이 지금 처음 보인다. 실행당 토큰이 큰 루프를 찾아 주기를 늘리거나 프롬프트를 줄인다. 상태 표시줄이 token-optimizer 스크립트라 토큰 관심도가 높은 환경에 바로 맞는다.
- **난이도**: ★☆☆ (약 10분)
