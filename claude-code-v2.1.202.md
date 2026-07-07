# Claude Code v2.1.202

> 작성일: 2026-07-07

---

# 📋 요약본

## 🎉 신기능 (2건)
- **Dynamic workflow size 설정 추가** — `/config`에 Claude가 dynamic workflow를 대체로 얼마나 크게(에이전트 수 small/medium/large) 만들지 조절하는 설정이 생김. 강제 상한이 아니라 권고 가이드라인.
- **workflow OpenTelemetry 속성 추가** — workflow가 띄운 에이전트의 텔레메트리에 `workflow.run_id`, `workflow.name` 속성이 붙음. OTel 데이터만으로 한 workflow 실행의 활동을 재구성할 수 있음.

## 🛠️ 개선/수정 (16건)
- **Ctrl+R 히스토리 검색 크래시 수정** — 인라인 Ctrl+R 검색이 히스토리 파일을 아직 훑는 중에 수락/취소하면 죽던 문제.
- **`/rename` 백그라운드 세션 되돌림 수정** — 작업(job) 재시작 시 이름이 원복돼 새 이름으로 세션을 지정하지 못하던 문제.
- **mTLS 핸드셰이크 실패 수정** — 클라이언트 인증서를 무중단 교체하며 설정을 재적용할 때 나던 일시적 핸드셰이크 실패.
- **Remote Control 명령 "Unknown command" 수정** — 모바일/웹의 Remote Control에서 대화형 세션으로 보낸 명령이 실패하던 문제.
- **Remote Control 캡션 없는 이미지·파일 유실 수정** — 캡션 없이 보낸 이미지·파일이 조용히 버려지던 문제.
- **로그인 URL 클릭 불가 수정** — `claude auth login`·`claude mcp login --no-browser`가 출력한 로그인 URL이 SSH에서 줄바꿈되면 클릭 안 되던 문제. 이제 하나의 하이퍼링크로 출력.
- **`claude agents` 채팅 열기 실패 수정** — 채팅을 열 때 "currently running as a background agent" 뒤로 워커 크래시/재생성 루프에 빠지던 문제.
- **workflow 스크립트 유니코드 따옴표 이스케이프 손상 수정** — 파싱 전에 문자열이 깨지던 문제. 이제 workflow 파싱 오류가 항상 TypeScript 탓으로 돌리지 않고 문제된 줄을 표시.
- **음성 받아쓰기 무한 재시도 수정** — 마이크/녹음기 실패 시 무한 루프로 재시도하던 것을 반복 실패 시 음성 입력을 일시 정지하도록 변경.
- **`/remote-control` 권한 모드 오표시 수정** — 모바일·웹 앱에서 잘못된 권한 모드가 보이던 문제.
- **이름으로 세션 재개 지연·메모리 폭증 수정** — git worktree가 많은 저장소에서 이름으로 세션을 재개하거나 재개 선택기를 여는 데 수 분이 걸리고 메모리를 크게 쓰던 문제.
- **설치·업데이트 다운로드 "aborted" 실패 수정** — 프록시/네트워크가 다운로드 도중 끊으면 즉시 실패하던 것을, 일시적 연결 끊김은 재시도하도록 변경.
- **스킬 중복 로드 수정** — 이미 로드된 스킬을 다시 호출하면 그 지시문이 컨텍스트에 한 부 더 붙던 문제.
- **`/workflows` 에이전트 목록 레이아웃 개선** — 제목 열 확대, 별도 시간 열 추가, 모델명 축약, 행별 도구 호출 수 제거.
- **MCP 오류 메시지 개선** — 서버 설정에 `url`은 있고 `type`이 없을 때, 오해를 부르던 "command: expected string" 대신 `"type": "http"`를 제안하는 명확한 오류로 변경.
- **`/review <pr>` 단일 패스 복귀** — `/review <pr>`를 빠른 단일 패스 리뷰로 되돌림. 원하는 강도의 멀티 에이전트 리뷰는 `/code-review <level> <pr#>` 사용.

## 🔑 이번 버전의 핵심 키워드
**"workflow 제어·관측을 손보고, 원격 제어·세션 재개 안정화 버그를 무더기로 잡은 정비 버전"** — 신기능은 workflow 크기 설정과 OTel 속성 둘뿐, 나머지는 대부분 버그 수정.

---

# 📜 원문 (한글 번역본)

> 원문 ChangeLog를 원래 순서 그대로 한 줄도 빠짐없이 번역한 문서입니다.

- `/config`에 "Dynamic workflow size" 설정을 추가해, Claude가 dynamic workflow를 대체로 얼마나 크게(에이전트 수 small/medium/large) 만들지 제어할 수 있게 함 — 강제 상한이 아닌 권고 가이드라인.
- workflow가 생성한 에이전트가 내보내는 텔레메트리에 `workflow.run_id`, `workflow.name` OpenTelemetry 속성을 추가해, OTel 데이터로 한 workflow 실행의 활동을 재구성할 수 있게 함.
- 인라인 Ctrl+R 히스토리 검색이 히스토리 파일을 아직 스캔하는 중에 수락하거나 취소할 때 발생하던 크래시 수정.
- 백그라운드 세션에서 `/rename`이 작업 재시작 시 되돌려져 새 이름으로 세션을 지정하지 못하게 되던 문제 수정.
- 무중단(in-place) 클라이언트 인증서 교체 중 설정이 재적용될 때 발생하던 일시적 mTLS 핸드셰이크 실패 수정.
- Remote Control(모바일/웹)에서 대화형 세션으로 보낸 명령이 "Unknown command"로 실패하던 문제 수정.
- Remote Control 모바일 또는 웹 앱에서 캡션 없이 보낸 이미지와 파일이 조용히 유실되던 문제 수정.
- `claude auth login`과 `claude mcp login --no-browser`가 출력하는 로그인 URL이 SSH에서 줄바꿈될 때 안정적으로 클릭되지 않던 문제 수정 — 이제 하나의 하이퍼링크로 출력됨.
- `claude agents`에서 채팅을 열 때 "currently running as a background agent" 뒤로 워커 크래시/재생성 루프가 이어지며 간헐적으로 실패하던 문제 수정.
- 문자열에 유니코드 따옴표 이스케이프가 있는 workflow 스크립트가 파싱 전에 손상되던 문제 수정; workflow 파싱 오류가 이제 항상 TypeScript를 탓하는 대신 문제된 줄을 표시함.
- 마이크 또는 오디오 레코더가 실패할 때 음성 받아쓰기가 무한 루프로 재시도하던 문제 수정 — 반복적인 캡처 실패 시 이제 음성 입력을 일시 정지함.
- `/remote-control` 세션이 모바일·웹 앱에서 잘못된 권한 모드를 표시하던 문제 수정.
- git worktree가 많은 저장소에서 이름으로 세션을 재개하거나 재개 선택기를 여는 데 수 분이 걸리고 많은 메모리를 사용하던 문제 수정.
- 프록시나 네트워크가 다운로드 도중 연결을 끊을 때 설치 프로그램과 업데이트 프로그램 다운로드가 "aborted"로 즉시 실패하던 문제 수정 — 이제 일시적 연결 끊김은 재시도함.
- 이미 로드된 스킬을 다시 호출하면 그 지시문 사본이 컨텍스트에 중복으로 추가되던 문제 수정.
- `/workflows` 에이전트 목록 레이아웃 개선: 더 넓은 제목, 전용 시간 열, 짧아진 모델명, 행별 도구 호출 수 제거.
- MCP 오류 메시지 개선: 서버 설정에 `url`은 있으나 `type`이 없을 때, 오해를 부르는 "command: expected string" 대신 `"type": "http"`를 제안하는 더 명확한 오류.
- `/review <pr>`를 빠른 단일 패스 리뷰로 되돌림; 원하는 강도 수준의 멀티 에이전트 리뷰는 `/code-review <level> <pr#>`를 사용.

---

## 🎯 챌린지

이번 버전에서 내 환경에 적용해볼 만한 항목입니다.

### 1. Dynamic workflow size를 small로 고정
- **파일**: `~/.claude/settings.json` (또는 `/config` 화면에서 "Dynamic workflow size")
- **근거**: 신기능 "Dynamic workflow size" 설정과 연결. CLAUDE.md §7.2는 "dynamic workflow(budget 스케일링)는 대규모 감사 전용, 일반 개발엔 쓰지 않는다"고 명시함. 기본 크기를 small로 고정하면 이 정책이 설정 레벨에서도 강제되어, 일반 작업에서 에이전트가 과도하게 커지는 것을 막는다.
- **난이도**: ★☆☆ (약 5분)

### 2. HTTP 방식 MCP 서버 설정에 `type` 명시
- **파일**: `~/.claude.json` (`mcpServers` 항목)
- **근거**: "MCP 오류 메시지 개선" 항목과 연결. `url`만 있고 `type`이 없으면 이제 `"type": "http"`를 제안하는 오류가 뜬다. 메모리에 기록된 Figma `use_figma` 등 HTTP 기반 MCP가 있다면 지금 `type: "http"`를 미리 채워 두면 다음 연결 실패를 예방한다. stdio(`command`) 방식 서버는 해당 없음.
- **난이도**: ★★☆ (약 10분)

### 3. 죽은 git worktree 정리로 세션 재개 가속
- **파일**: 각 저장소 `.git/worktrees/` (예: Poplus 모노레포, EOS-H5)
- **근거**: "이름으로 세션 재개 지연·메모리 폭증 수정" 항목과 연결. 이 버그는 worktree가 많을수록 심했다. 사용자는 30개 프로젝트 모노레포와 worktree 격리를 자주 쓰므로, `git worktree prune`으로 사라진 worktree 참조를 청소하면 재개 속도가 추가로 개선된다. 명령 실행 전 `git worktree list`로 대상 확인.
- **난이도**: ★★☆ (약 10분)
