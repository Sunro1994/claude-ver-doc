# Claude Code v2.1.261

> 작성일: 2026-09-05

---

# 📋 요약본

## 🎉 신기능 (8건)
- **`/status`·`claude doctor`에 "Organization policy" 줄 추가** — 조직 정책을 못 불러온 이유를 표시한다. 프록시가 엔드포인트를 통과시키지 않는 경우 등을 바로 확인한다.
- **`bashOutputMaxChars`·`taskOutputMaxChars` 설정 추가** — 명령·백그라운드 작업 출력이 파일로 저장되기 전에 Claude가 인라인으로 받는 양을 최대 128K자까지 늘린다.
- **`--append-subagent-system-prompt-file` 추가** — 서브에이전트 시스템 프롬프트를 파일에서 읽는다. 명령줄에 넣기엔 너무 큰 프롬프트용.
- **`/skill-doctor` 추가** — 로드된 스킬 중 안 쓰이는 것과 각각의 컨텍스트 비용을 보여준다. 정리 판단에 쓴다.
- **[VSCode] Output styles 메뉴에 "Build a custom style" 워크스루 추가** — 커스텀 출력 스타일 파일을 작성하고 즉시 목록에 표시한다.
- **[VSCode] MCP 서버 다이얼로그에 Add server 폼·Remove 액션 추가** — IDE를 벗어나지 않고 MCP 서버를 추가·제거한다.
- **[VSCode] 세션 목록에 빈 고리(hollow ring) 표시 추가** — 터미널·다른 VS Code 창·Claude Desktop에서 열린 세션이 닫힌 것처럼 보이지 않는다.
- **[VSCode] 권한·질문 프롬프트에 접기 버튼 추가** — 프롬프트를 닫지 않고도 뒤의 대화를 읽는다. 프롬프트 옆 공간에서 대화 스크롤도 된다.
- **[VSCode] 세션 목록 우클릭 메뉴에 "Archive session" 추가** — Unarchive에는 별도 아이콘을 부여했다.

## 🛠️ 개선/수정 (55건)
- **입력 문자 순서 뒤바뀜·유실 수정** — 빠른 입력이나 키 반복 중 타이핑·붙여넣기 문자가 어긋나던 문제.
- **`/add-dir <subdirectory>` 오탐 오류 수정** — 작업 디렉터리가 `/net` 자동마운트일 때 "couldn't be resolved" 오류를 잘못 출력하던 문제.
- **Bedrock 설정 마법사 멈춤 수정** — AWS나 자격 증명 헬퍼가 응답하지 않으면 타임아웃 후 명확한 오류를 낸다. TLS 검사 프록시 뒤에서 모델 확인이 실패하던 문제도 수정.
- **클라우드 세션의 플러그인 폐기 문제 수정** — 관리 설정이 `enabledPlugins`로 강제 활성화할 때 claude.ai에서 동기화된 플러그인을 버리고 실패 가능한 마켓플레이스 클론으로 대체하던 문제.
- **인라인 `[Image #N]` 칩 바로 앞 문자 삭제 불가 수정.**
- **세션 재개 시 컨텍스트 유실 수정** — 병렬 도구 호출 주변의 hook 출력 등이 사라져 재개된 요청이 달라지던 문제.
- **Remote Control 권한 모드 표시 정합성 수정** — 폰·브라우저·claude.ai 앱이 터미널 세션에 붙거나 터미널에서 모드가 바뀐 뒤 오래된 값을 보여주던 문제.
- **Remote Control 스피너 멈춤 수정** — 연결된 폰·브라우저에서 턴을 중지하거나 `/clear` 같은 로컬 슬래시 명령 뒤에도 작업 중으로 보이던 문제.
- **SDK·클라우드 세션의 중단 무시 수정** — 첫 프롬프트 직후 턴 시작 전에 보낸 Stop이 무시되고 끝까지 실행되던 문제.
- **`/teleport` 세션 중복 업로드 수정** — 폰·웹에서 원본에 덧붙은 것처럼 보이던 문제.
- **Remote Control 이벤트 스트림 수정** — 네이티브 Windows에서 TLS 검사 기업 프록시 뒤 실패하던 문제.
- **Remote Control 노력 수준 표시 수정** — 설정에서 온 값인데 claude.ai에서 기본값으로 보이던 문제.
- **`gcpAuthRefresh` 불필요한 브라우저 실행 수정** — 자격 증명이 유효한데도 확인이 느리면 시작 시 브라우저를 열던 문제.
- **claude.ai 커넥터 부재 수정** — 시작 시 커넥터 조회가 타임아웃되면 세션 내내 없던 문제. 이제 백그라운드에서 재시도한다.
- **CPU 과점유 수정** — 백그라운드 에이전트 재개 실패 시 깨우기를 촘촘한 루프로 재시도하던 문제.
- **기능 플래그 오적용 수정** — 같은 머신의 구버전 Claude Code에 신버전용 플래그가 적용되던 문제.
- **`/usage`·VS Code 사용량 패널 행 누락 수정** — 사용량 엔드포인트가 rate limit이거나 시작 직후 열면 모델별 주간 한도 행이 빠지던 문제.
- **`claude -p --resume <file>` 세션 ID 수정** — 트랜스크립트에 기록된 잘못된 세션 ID를 쓰지 않고 새 ID로 재개한다.
- **터미널 진행 표시기 수정** — iTerm2·Ghostty·ConEmu에서 백그라운드 워크플로우·에이전트가 실행 중인데 완료로 표시되던 문제.
- **레이아웃 높이 오류 수정** — 컨테이너가 row↔column으로 바뀐 뒤 박스 높이가 잘못 렌더되던 드문 문제.
- **Claude apps 게이트웨이 클라이언트 IP 수정** — 신뢰 프록시가 `X-Forwarded-For`에 포트를 붙일 때. 접근 목록이 설정된 경우 읽을 수 없는 항목은 403 처리.
- **Desktop OpenTelemetry 포맷 수정** — 터미널 CLI가 protobuf를 쓰는데 게이트웨이가 Desktop에 JSON 내보내기를 지시해 protobuf 전용 수집기가 거부하던 문제.
- **Desktop·웹 세션 상태 수정** — 아티팩트 업데이트만 감시 중인데 바쁨으로 표시되던 문제.
- **Claude in Chrome `file_upload` 실패 수정** — Claude Desktop에서 실행한 로컬 Cowork 세션의 "paths: expected array, received undefined" 오류.
- **`SendMessage` 전달 상태 수정** — 다른 머신의 오프라인 Remote Control 세션에 보낸 메시지가 전달됨으로 표시되던 문제. 이제 해당 머신 재연결까지 대기 중이라고 알린다.
- **플러그인 설치 힌트 수정** — 백그라운드 Bash 명령의 CLI에서도 감지되고, 원시 `<claude-code-hint>` 태그가 대화에 새지 않는다.
- **에이전트 팀 프롬프트 캐시 미스 수정** — 인프로세스 팀원이 두 번째 턴에 첫 턴 도구·스킬 안내를 다시 보내 요청 접두부가 바뀌던 문제.
- **`/model` 선택기·VS Code 모델 필 표시 개선** — Bedrock·Vertex AI·LLM 게이트웨이의 원시 ID 대신 인식된 모델 이름을 보여준다.
- **Vertex AI 시작 성능 개선** — `GOOGLE_APPLICATION_CREDENTIALS`가 설정되면 API 클라이언트 생성 시 프로젝트 탐색을 재실행하거나 추가 `gcloud` 프로세스를 띄우지 않는다.
- **스트리밍 성능 개선** — 이미 렌더된 블록을 업데이트마다 레이아웃이 다시 검사하지 않는다.
- **위험한 `rm` 안전 프롬프트 강화** — 위치 매개변수 대상 `rm -rf`와 큰따옴표로 감싼 `sh -c` 스크립트 내부까지 잡는다.
- **응답 헤더 없음 처리 개선** — 재시도가 3분 대신 `API_TIMEOUT_MS`(기본 10분)까지 대기하고, 메시지가 무엇을 바꿔야 하는지 알려준다.
- **게이트웨이 403 메시지 변경** — 재로그인 권유 대신 조직에 Claude Code가 활성화되지 않았을 수 있다고 안내한다.
- **`forceLoginMethod: "gateway"` 동작 변경** — 남아 있는 API 키·claude.ai 로그인을 무시하고 `/login`을 요구한다. Bedrock·Vertex AI·Foundry 세션은 영향 없음.
- **auto mode 링크 처리 변경** — 공개 다이어그램 렌더러 URL에 내용을 담는 링크를 해당 사이트 업로드로 간주해 자동 승인하지 않는다.
- **프롬프트 단어 편집 키를 Bash에 맞춤** — Ctrl+W는 공백까지 삭제, Alt+F·Alt+D는 단어 끝에서 멈추고 구두점이 단어를 나눈다. `keybindingFlavor`는 더 이상 효과 없음.
- **`/context` 토큰 계산 변경** — 토큰 계산 API를 못 쓰면 추가 소형 모델 요청 대신 로컬 추정치를 쓴다.
- **[VSCode] 웹에서 텔레포트한 세션 수정** — 클라우드 세션 종료로 잘린 질문을 거부로 처리하던 문제.
- **[VSCode] 세션 탭 Rename 상자 수정** — 창과 함께 복원된 탭에서 빈 채로 열리던 문제. 현재 이름으로 시작한다.
- **[VSCode] 세션 목록 접힘 상태 수정** — 패널 로드마다 접힌 섹션이 잠깐 펼쳐 보이던 문제.
- **[VSCode] Focus view 도구 호출 표시 수정** — Claude가 이미 넘어갔는데 실행 중으로 보이던 문제(질문 대기 중 등).
- **[VSCode] 세션 목록 활성 행 하이라이트 수정** — 포커스 없는 Claude 탭의 세션 ID가 정정될 때 낡은 값이 남던 문제.
- **[VSCode] 탭 배치 수정** — Cmd/Ctrl+Shift+T 재열기와 딥링크 열기가 Claude 탭 포커스 상태에서 Claude 편집기 그룹 밖에 놓이던 문제.
- **[VSCode] "Add to group" 중복 수정** — 웹에서 연 세션이 두 그룹에 들어가던 문제. 이제 세션 목록이 보여주는 항목을 이동한다.
- **[VSCode] 모델 선택기 수정** — 조직이 비활성화한 모델이 창을 두 번 리로드할 때까지 남던 문제.
- **[VSCode] 탭 뷰 리로드 후 동작 수정** — 세션 목록에서 연 탭이 그 세션으로 되돌아가고, 웹 세션에서 연 탭이 텔레포트를 다시 시작하거나 빈 채로 남던 문제.
- **[VSCode] `/btw` 사이드 질문 기록 덮어쓰기 수정** — 창 리로드 직후나 설정 파일에 오류가 있을 때 이전 세션 기록이 덮이던 문제.
- **[VSCode] 대기 질문 카드 수정** — Claude.ai·Console 계정 로그인 시 패널 리로드 후 다시 나타나지 않던 문제.
- **[VSCode] claude.ai 전용 기능 노출 수정** — 한 패널이 설정 파일에서 서드파티 프로바이더를 잡은 뒤에도 같은 창의 다른 패널에 남던 문제.
- **[VSCode] 로그인 화면 노출 수정** — Disable Login Prompt 설정에도 로그인 없음 보고·요청 실패 시 나타나던 문제.
- **[VSCode] 큐 대기 권한 프롬프트 수정** — 이전 프롬프트에 입력한 텍스트가 남고 즉시 두 번째 클릭이 받아들여지던 문제.
- **[VSCode] 플러그인 설치 링크 수정** — 세션 목록만 표시했던 창에서 설치 다이얼로그 없이 사이드바만 열리던 문제.
- **[VSCode] 사이드바 사용량 미터 수정** — 새 창에서 Account & usage 다이얼로그를 열기 전까지 비어 있던 문제, 0% 한도가 미터에서 빠지던 문제.
- **[VSCode] 그룹·읽지 않음 표시 수정** — "Start new session in this group"이 New conversation 후 그룹을 잃던 문제, 사이드바 목록 로드 전에 끝난 세션의 읽지 않음 점 누락.
- **[VSCode] 편집기 탭 배지 수정** — 실행 중인 턴에 읽지 않음이 뜨거나 세션 목록에서 연 탭에 누락되던 문제, 보관된 세션에서 "Add Session Tab to Group"이 동작하지 않던 문제.
- **[VSCode] "Enable Remote Control for all sessions" 수정** — 전환 시 다른 VS Code 창의 세션에도 즉시 적용된다.
- **[VSCode] 세션 목록 Open 필터 수정** — claude.ai에서 이어진 세션의 탭이 웹 세션 아래 기록돼 있던 문제. 필터 메뉴 섹션에 스크린 리더용 레이블도 추가.
- **[VSCode] 모델 선택기 변경** — 모든 모델을 하나의 평면 목록으로 보여주고, 구형 모델 표기 행은 맨 뒤에 둔다.

## 🔑 이번 버전의 핵심 키워드
**"컨텍스트 예산을 직접 조절하고, 원격·IDE 세션의 상태 표시를 믿을 수 있게 만든 버전"** — `/skill-doctor`와 출력 상한 설정으로 컨텍스트를 사용자가 관리하고, Remote Control·VS Code의 낡은 상태 표시를 대거 정리했다.

---

# 📜 원문 (한글 번역본)

> 원문 ChangeLog를 원래 순서 그대로 한 줄도 빠짐없이 번역한 문서입니다.

- `/status`와 `claude doctor`에 "Organization policy" 줄을 추가했다. 조직 정책을 불러오지 못한 이유(프록시가 엔드포인트를 통과시키지 않는 경우 등)를 알려준다
- `bashOutputMaxChars`와 `taskOutputMaxChars` 설정을 추가했다. 명령·백그라운드 작업 출력이 파일로 저장되기 전에 Claude가 인라인으로 받는 양을 최대 128K자까지 늘린다
- `--append-subagent-system-prompt-file`을 추가했다. 명령줄로 넘기기엔 너무 큰 서브에이전트 시스템 프롬프트를 파일에서 읽는다
- `/skill-doctor`를 추가했다. 로드된 스킬 중 쓰이지 않는 것과 각각의 컨텍스트 비용을 보여줘 정리할 수 있게 한다
- 빠른 입력이나 키 반복 중 타이핑·붙여넣기한 문자가 순서가 어긋나거나 유실되던 문제를 고쳤다
- 작업 디렉터리가 `/net` 자동마운트일 때 `/add-dir <subdirectory>`가 "couldn't be resolved" 오류를 잘못 출력하던 문제를 고쳤다
- AWS나 AWS 자격 증명 헬퍼가 응답하지 않을 때 Bedrock 설정 마법사가 멈추던 문제를 고쳤다(이제 타임아웃 후 명확한 오류를 낸다). TLS 검사 프록시 뒤에서 모델 확인이 실패하던 문제도 고쳤다
- 관리 설정이 `enabledPlugins`로 플러그인을 강제 활성화할 때 클라우드 세션이 claude.ai에서 동기화된 플러그인을 버리고, 실패할 수 있는 마켓플레이스 클론으로 대체하던 문제를 고쳤다
- 프롬프트 입력창에서 인라인 `[Image #N]` 칩 바로 앞 문자를 삭제할 수 없던 문제를 고쳤다
- 세션 재개 시 병렬 도구 호출 주변의 hook 출력과 기타 컨텍스트가 유실돼 재개된 요청이 달라지던 문제를 고쳤다
- 폰·브라우저·claude.ai 앱이 터미널 세션에 연결하거나 터미널에서 모드가 바뀐 뒤 Remote Control이 오래된 권한 모드를 보여주던 문제를 고쳤다
- 연결된 폰·브라우저에서 턴을 중지하거나 `/clear` 같은 로컬 슬래시 명령을 실행한 뒤에도 Remote Control 세션이 여전히 작업 중(스피너·Stop 버튼 고착)으로 보이던 문제를 고쳤다
- 첫 프롬프트 직후 턴이 시작되기 전에 보낸 Stop이나 인터럽트를 SDK·클라우드 세션이 무시하던 문제를 고쳤다. 이제 끝까지 실행되지 않고 중지된다
- Remote Control이 `/teleport`로 가져온 세션을 연결된 세션에 업로드해 폰·웹에서 원본에 덧붙은 것처럼 보이던 문제를 고쳤다
- 네이티브 Windows에서 TLS 검사 기업 프록시 뒤에 있을 때 Remote Control의 인바운드 이벤트 스트림이 실패하던 문제를 고쳤다
- 노력 수준(effort level)이 설정에서 오는데도 Remote Control 세션이 claude.ai에서 기본값으로 보이던 문제를 고쳤다
- Google 자격 증명 확인이 느릴 때 자격 증명이 여전히 유효한데도 `gcpAuthRefresh`가 시작 시 브라우저를 열던 문제를 고쳤다
- 시작 시 커넥터 조회가 타임아웃되면 claude.ai 커넥터가 세션 내내 없던 문제를 고쳤다. 이제 CLI가 백그라운드에서 재시도한다
- 백그라운드 에이전트를 재개할 수 없어 깨우기를 촘촘한 루프로 재시도하며 CPU를 계속 높게 쓰던 문제를 고쳤다
- 신버전에 한정된 기능 플래그가 같은 머신에서 돌아가는 구버전 Claude Code에 간혹 적용되던 문제를 고쳤다
- 사용량 엔드포인트가 rate limit에 걸렸거나 시작 직후 열었을 때 `/usage`와 VS Code 사용량 패널이 모델별 주간 한도 행을 누락하던 문제를 고쳤다
- `claude -p --resume <file>`이 트랜스크립트에 기록된 잘못된 세션 ID를 그대로 쓰던 문제를 고쳤다. 이제 새 세션 ID로 재개한다
- 백그라운드 워크플로우나 에이전트가 아직 실행 중인데 터미널 진행 표시기(iTerm2, Ghostty, ConEmu)가 세션을 완료로 표시하던 문제를 고쳤다
- 컨테이너가 row·column 방향을 오갈 때 박스가 잘못된 높이로 렌더되던 드문 레이아웃 오류를 고쳤다
- 신뢰 프록시가 `X-Forwarded-For`에 포트를 덧붙일 때의 Claude apps 게이트웨이 클라이언트 IP 처리를 고쳤다. 접근 목록이 설정된 경우 읽을 수 없는 항목은 403을 받는다
- 터미널 CLI가 protobuf를 쓰는데도 Claude apps 게이트웨이가 Claude Desktop에 OpenTelemetry를 JSON으로 내보내라고 지시해 protobuf 전용 수집기가 Desktop 데이터를 거부하던 문제를 고쳤다
- 아티팩트 업데이트만 감시 중인 세션을 Desktop과 웹이 바쁨으로 표시하던 문제를 고쳤다
- Claude Desktop 앱에서 실행한 로컬 Cowork 세션에서 Claude in Chrome `file_upload`이 "paths: expected array, received undefined"로 실패하던 문제를 고쳤다
- 다른 머신의 오프라인 Remote Control 세션에 보낸 `SendMessage`가 전달됨으로 표시되던 문제를 고쳤다. 이제 결과에 해당 머신이 재연결할 때까지 전달이 대기 중이라고 표시된다
- 백그라운드 Bash 명령으로 실행한 CLI의 플러그인 설치 힌트 처리를 고쳤다. 이제 감지되며, 원시 `<claude-code-hint>` 태그가 대화에 새지 않는다
- 인프로세스 에이전트 팀 팀원이 두 번째 턴에 첫 턴의 도구·스킬 안내를 다시 보내 요청 접두부가 바뀌고 프롬프트 캐시를 놓치던 문제를 고쳤다
- `/model` 선택기와 VS Code 모델 필이, Claude Code가 인식하는 모델일 경우 원시 Bedrock·Vertex AI·LLM 게이트웨이 ID 대신 모델 이름을 보여주도록 개선했다
- `GOOGLE_APPLICATION_CREDENTIALS`가 설정된 Google Vertex AI에서 시작 과정을 개선했다. API 클라이언트 생성 시 Google Cloud 프로젝트 탐색을 다시 실행하거나 추가 `gcloud` 프로세스를 띄우지 않는다
- 스트리밍 성능을 개선했다. 이미 렌더된 블록은 업데이트마다 레이아웃이 다시 검사하지 않는다
- 위험한 `rm` 안전 프롬프트를 개선해 위치 매개변수에 대한 `rm -rf`와 큰따옴표로 감싼 `sh -c` 스크립트 내부까지 잡는다
- API가 응답 헤더를 보내지 않을 때의 처리를 개선했다. 재시도가 3분을 더 기다리는 대신 `API_TIMEOUT_MS`(기본 10분)까지 대기하고, 메시지가 무엇을 바꿔야 하는지 알려준다
- 관리 설정 로드(시작 시 또는 `/login` 후)에서 발생한 Claude apps 게이트웨이 403 메시지를 바꿨다. 새로 로그인하라고 안내하는 대신, 조직에 Claude Code가 활성화되지 않았을 수 있다고 알린다
- 관리 설정이 `forceLoginMethod: "gateway"`로 고정된 머신은 남아 있는 API 키나 claude.ai 로그인을 무시하고 `/login`을 요구하도록 바꿨다. Bedrock·Vertex AI·Foundry 세션은 영향받지 않는다
- auto mode가, 공개 다이어그램 렌더러의 URL에 내용을 담아 넣는 링크를 해당 사이트로의 업로드로 간주하도록 바꿨다. 요청하지 않은 한 자동 승인하지 않는다
- 프롬프트의 단어 편집 키를 Bash와 맞췄다. Ctrl+W는 공백까지 뒤로 삭제하고, Alt+F와 Alt+D는 단어 끝에서 멈추며, 구두점이 단어를 구분한다. `keybindingFlavor`는 더 이상 아무 효과가 없다
- `/context` 토큰 계산을 바꿨다. 토큰 계산 API를 쓸 수 없으면 추가 소형 모델 요청 대신 로컬 추정치를 쓴다
- [VSCode] Output styles 메뉴에 "Build a custom style" 워크스루를 추가했다. 커스텀 출력 스타일 파일을 작성하고 즉시 목록에 표시한다
- [VSCode] MCP 서버 다이얼로그에 Add server 폼과 Remove 액션을 추가해, IDE를 벗어나지 않고 MCP 서버를 추가·제거할 수 있다
- [VSCode] 세션 목록에 빈 고리 표시를 추가했다. 터미널·다른 VS Code 창·Claude Desktop에서 열린 세션이 더 이상 닫힌 것처럼 보이지 않는다
- [VSCode] 권한·질문 프롬프트에 접기 버튼을 추가해, 프롬프트를 닫지 않고도 뒤의 대화를 읽을 수 있다. 프롬프트 옆 공간에서 대화를 스크롤할 수 있다
- [VSCode] 세션 목록 우클릭 메뉴에 "Archive session"을 추가하고 Unarchive에 별도 아이콘을 부여했다
- [VSCode] Claude Code on the web에서 텔레포트한 세션이, 클라우드 세션 종료로 잘린 질문을 거부된 것으로 처리하던 문제를 고쳤다
- [VSCode] 창과 함께 복원된 탭에서 세션 탭의 Rename 상자가 빈 채로 열리던 문제를 고쳤다. 이제 현재 이름으로 시작한다
- [VSCode] 세션 목록 패널이 로드될 때마다 접힌 섹션이 잠깐 펼쳐 보이던 문제를 고쳤다
- [VSCode] 질문이 답을 기다리는 동안처럼, Claude가 이미 다음으로 넘어갔는데 Focus view가 도구 호출을 실행 중으로 표시하던 문제를 고쳤다
- [VSCode] 포커스가 없는 Claude 탭의 세션 ID가 정정될 때 세션 목록의 활성 행 하이라이트가 낡은 상태로 남던 문제를 고쳤다
- [VSCode] Claude 탭에 포커스가 있을 때 Cmd/Ctrl+Shift+T 재열기와 딥링크 열기가 Claude 탭을 Claude 편집기 그룹 밖에 배치하던 문제를 고쳤다
- [VSCode] 세션 탭의 "Add to group"이 Claude Code on the Web에서 연 세션을 두 그룹에 넣던 문제를 고쳤다. 이제 세션 목록이 보여주는 항목을 옮긴다
- [VSCode] 조직이 이후 비활성화한 모델이 창을 두 번 리로드할 때까지 모델 선택기에 남던 문제를 고쳤다
- [VSCode] VS Code가 탭의 뷰를 리로드한 뒤, 세션 목록에서 연 탭이 그 세션으로 되돌아가고 Web 세션에서 연 탭이 텔레포트를 다시 시작하거나 빈 채로 남던 문제를 고쳤다
- [VSCode] 창 리로드 직후나 설정 파일에 오류가 있는 상태에서 질문하면 이전 세션의 `/btw` 사이드 질문 기록이 덮이던 문제를 고쳤다
- [VSCode] Claude.ai 또는 Console 계정으로 로그인한 경우, Claude 패널 리로드 후 대기 중인 질문 카드가 다시 나타나지 않던 문제를 고쳤다
- [VSCode] 한 패널이 설정 파일에서 서드파티 프로바이더를 인식한 뒤에도 같은 창의 다른 Claude 패널에 claude.ai 전용 기능이 계속 보이던 문제를 고쳤다
- [VSCode] Claude Code가 로그인 없음을 보고하거나 로그인이 없어 요청이 실패할 때, Disable Login Prompt 설정에도 불구하고 로그인 화면이 나타나던 문제를 고쳤다
- [VSCode] 큐에 대기 중인 다음 권한 프롬프트가 이전 프롬프트에 입력한 텍스트를 유지하고 즉각적인 두 번째 클릭을 받아들이던 문제를 고쳤다
- [VSCode] 세션 목록만 표시했던 창에서 플러그인 설치 링크가 설치 다이얼로그 없이 Claude 사이드바만 열던 문제를 고쳤다
- [VSCode] 새 창에서 Account & usage 다이얼로그를 열기 전까지 사이드바 사용량 미터가 비어 있던 문제와, 0% 사용 한도가 미터에서 빠지던 문제를 고쳤다
- [VSCode] "Start new session in this group"이 New conversation 후 그룹을 잃던 문제와, 사이드바의 읽지 않음 목록이 로드되기 전에 끝난 세션의 읽지 않음 점이 누락되던 문제를 고쳤다
- [VSCode] 실행 중인 턴에 편집기 탭 배지가 읽지 않음으로 표시되거나 세션 목록에서 연 탭에 배지가 누락되던 문제와, 보관된 세션에서 "Add Session Tab to Group"이 아무 동작도 하지 않던 문제를 고쳤다
- [VSCode] "Enable Remote Control for all sessions"를 고쳤다. 전환하면 다른 VS Code 창에서 열린 세션에도 즉시 적용된다
- [VSCode] 탭이 여전히 웹 세션 아래 기록돼 있던, claude.ai에서 이어진 세션에 대한 세션 목록 Open 필터를 고치고, 필터 메뉴의 섹션에 스크린 리더용 레이블을 달았다
- [VSCode] 모델 선택기를 모든 모델을 담은 하나의 평면 목록으로 바꿨다. 구형 모델 표기 행은 맨 뒤에 둔다

---

## 🎯 챌린지

이번 버전에서 내 환경에 적용해볼 만한 항목입니다.

### 1. `/skill-doctor`로 스킬 컨텍스트 비용 점검
- **파일**: `~/.claude/settings.json` (`skillListingBudgetFraction`, `enabledPlugins`)
- **근거**: 현재 `skillListingBudgetFraction: 0.08`로 스킬 목록 예산을 이미 제한 중이다. `/skill-doctor`를 실행해 안 쓰는 스킬과 각 비용을 확인하면, 추측 대신 실측으로 예산 값을 조정하거나 미사용 플러그인을 정리할 수 있다.
- **난이도**: ★☆☆ (약 10분)

### 2. `bashOutputMaxChars`·`taskOutputMaxChars` 설정
- **파일**: `~/.claude/settings.json`
- **근거**: 서브에이전트 병렬 dispatch(§7.2)를 자주 쓰는 환경이라 백그라운드 작업 출력이 파일로 잘려 나가면 결과 검증(§5 "verify subagent output")이 번거로워진다. 두 값을 올려두면 잘린 출력을 다시 읽으러 가는 왕복이 줄어든다. 128K가 상한이니 컨텍스트 여유를 보고 중간값부터 시작한다.
- **난이도**: ★☆☆ (약 5분)

### 3. `keybindingFlavor` 잔재 제거
- **파일**: `~/.claude/settings.json`, `~/.claude/keybindings.json`
- **근거**: 이번 버전에서 `keybindingFlavor`는 효과가 사라졌고 Ctrl+W·Alt+F·Alt+D가 Bash 방식으로 고정됐다. 설정 파일에 남아 있으면 지우고, 단어 편집 키를 실제로 눌러보며 손에 익은 동작과 달라진 부분을 확인한다.
- **난이도**: ★☆☆ (약 5분)

### 4. `--append-subagent-system-prompt-file`로 서브에이전트 규칙 외부화
- **파일**: `~/.claude/CLAUDE.md`에서 발췌한 새 파일 (예: `~/.claude/subagent-rules.md`)
- **근거**: §5(모든 subagent는 Opus)·§7.1(검증 등급)·§10(마이크로 단위) 같은 서브에이전트 공통 규칙을 파일 하나로 빼두면, `claude -p` 자동화(체인지로그 동기화 cron 등)에서 명령줄 길이 걱정 없이 매번 주입할 수 있다. 서브에이전트가 spec을 임의로 바꾸던 문제(`feedback-subagent-spec-fidelity`)에도 직접 대응된다.
- **난이도**: ★★☆ (약 20분)
