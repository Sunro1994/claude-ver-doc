# Claude Code v2.1.181

> 작성일: 2026-06-18

---

# 📋 요약본

## 🎉 신기능 (3건)
- **`/config key=value` 프롬프트 설정** — 프롬프트에서 직접 임의 설정을 변경한다 (예: `/config thinking=false`). 인터랙티브 모드, `-p`, Remote Control 모두에서 동작한다.
- **`sandbox.allowAppleEvents` 옵트인 설정** — 샌드박스된 명령이 macOS에서 Apple Events 를 전송할 수 있게 허용한다.
- **`CLAUDE_CLIENT_PRESENCE_FILE` 환경변수** — 마커 파일을 지정하면 사용자가 기기 앞에 있는 동안 모바일 푸시 알림을 억제한다.

## 🛠️ 개선/수정 (36건)
- **Bun 런타임 1.4 업그레이드** — 번들된 Bun 런타임을 1.4 로 올렸다.
- **긴 문단 스트리밍 개선** — 첫 줄바꿈을 기다리지 않고 텍스트가 줄 단위로 즉시 표시된다.
- **자동 재시도 개선** — thinking 도중 API 연결이 끊겨도 "Connection closed while thinking" 대신 자동 재시도한다.
- **서브에이전트 패널 개선** — 유휴 서브에이전트는 30초 후 자동 숨김, 목록은 최대 5행으로 스크롤 힌트 제공, 키보드 힌트를 푸터에 표시한다.
- **MCP OAuth 브라우저 페이지 개선** — Claude Code 비주얼 스타일에 맞추고 성공 시 자동 닫힌다.
- **풀스크린 URL 열기 동작 변경** — macOS Cmd+click / Ctrl+click 으로만 열리도록 변경, 네이티브 터미널 동작과 일치시켰다.
- **`Improved N memories` 줄 변경** — verbose 모드가 아니면 개별 파일을 더 이상 나열하지 않는다.
- **prompt caching 미적용 수정** — 커스텀 `ANTHROPIC_BASE_URL` 및 Foundry 에서 매 턴 바뀌는 요청별 attestation 토큰 때문에 캐시를 읽지 못하던 문제를 고쳤다.
- **0바이트/잘린 파일 수정** — 네트워크 드라이브 및 클라우드 동기화 폴더에서 Write/Edit 가 0바이트 또는 잘린 파일을 생성하던 문제를 고쳤다.
- **macOS -600 오류 수정** — Apple Events 엔타이틀먼트를 추가해 `open`, `osascript`, 브라우저 기반 인증 흐름이 -600 으로 실패하던 문제를 고쳤다.
- **시작 회귀 수정** — 2.1.169 에서 유입된, 새 환경에서 실행당 ~120ms 지연을 고쳤다. MCP 서버 미설정 시 첫 프롬프트가 managed-settings 페치를 기다리지 않는다.
- **시작 블로킹 수정** — 저하된 네트워크에서 계정 설정 페치가 느릴 때 빈 터미널로 최대 15초 멈추던 문제를 고쳤다.
- **시작 크래시 수정** — `.claude.json` 에 손상된 null 프로젝트 항목이 있을 때 발생하던 `TypeError: Cannot read properties of null` 을 고쳤다.
- **macOS TUI 멈춤 수정** — Spotlight 재색인 중일 때 세션 시작 시 TUI 가 멈추고 Ctrl+C 가 안 듣던 문제를 고쳤다.
- **장기 유휴 세션 히스토리 손실 수정** — 다른 Claude Code 프로세스가 30일 트랜스크립트 정리를 돌릴 때 히스토리를 잃던 문제를 고쳤다.
- **포그라운드 서브에이전트 무한 중첩 수정** — 백그라운드 서브에이전트와 동일한 5단계 깊이 제한을 따르도록 했다.
- **`/recap` 및 포크 모델 수정** — 모델 전환 직후 `/recap` 과 대화 포크가 이전 모델을 사용하던 문제를 고쳤다.
- **서브에이전트 "Thinking" 시간 표시 수정** — 부모 에이전트 경과 시간 대신 서브에이전트 자신의 시간을 표시한다.
- **중첩 에이전트 대기 표시 수정** — 중첩 에이전트에서 블록된 서브에이전트가 경과 시간 대신 "waiting" 을 표시한다.
- **API 재시도 인디케이터 수정** — 재시도 성공 후에도 화면에 남던 "Retrying in 0s · attempt N/10" 을 고쳤다.
- **AWS `awsCredentialExport` 수정** — 잔여 수명이 짧은 자격증명이 매분 갱신을 유발하던 문제를 고치고, `aws configure export-credentials` 의 JSON 형태를 수용한다.
- **`claude mcp get`/`list` 상태 수정** — tools/list 실패 시 `✓ Connected` 대신 `! Connected · tools fetch failed` 와 오류 상세를 표시한다.
- **`/remote-control` 잔류 줄 수정** — "connecting…" 줄이 남던 문제를 고치고, 연결되면 트랜스크립트에서 확인한다.
- **ExitWorktree 수정** — Windows 에서 bare `git` 을 해석하지 못할 때 깨끗한 워크트리를 "Could not verify worktree state" 로 제거 거부하던 문제를 고쳤다.
- **심볼릭 링크 설정 변경 수정** — `~/.claude/settings.json` 이 심볼릭 링크된 `~/.claude` 아래의 상대 심볼릭 링크일 때 `/effort`·`/model` 등 설정 변경이 ENOENT 로 실패하던 문제를 고쳤다.
- **IDE 선택 줄번호 수정** — 컨텍스트 리마인더의 IDE 선택 줄번호가 1만큼 어긋나던 문제를 고쳤다 (IntelliJ, VS Code).
- **풀스크린 Ctrl+C 클립보드 수정** — 네이티브 터미널 선택(modifier+drag) 후 풀스크린에서 Ctrl+C 가 앱의 이전 선택으로 클립보드를 덮어쓰던 문제를 고쳤다.
- **Ctrl+V 수정** — 클립보드에 텍스트가 있을 때 붙여넣기 대신 "No image found in clipboard" 가 뜨던 문제를 고쳤다.
- **에이전트 생성 EEXIST 수정** — agents 디렉터리가 이미 존재할 때 "EEXIST: file already exists" 로 실패하던 문제를 고쳤다 (Windows/OneDrive).
- **AskUserQuestion 미리보기 수정** — 미리보기 내용이 다이얼로그 가장자리에서 잘리지 않고 단어 단위로 줄바꿈된다.
- **AskUserQuestion 다중 선택 수정** — 다중 선택 질문에서 입력한 "Other" 자유 텍스트 답변이 제출 시 누락되던 문제를 고쳤다.
- **`/stats` 날짜 수정** — UTC 음수 시간대에서 "Most active day" 와 일일 토큰 차트 날짜가 하루 빠르게 표시되던 문제를 고쳤다.
- **`/copy` 및 선택 복사 수정** — Linux 에서 Claude Code 시작 후 설치된 클립보드 유틸리티를 감지하지 못하던 문제를 고쳤다.
- **탭 들여쓰기 코드 렌더링 수정** — Write(파일 생성) 미리보기에서 탭 들여쓰기 코드가 잘못 들여쓰기되던 문제를 고쳤다.
- **큐 대기 프롬프트 하이라이트 수정** — 턴 도중 큐에 들어간 사용자 프롬프트가 트랜스크립트에서 전체 너비 배경 하이라이트를 표시하지 않던 문제를 고쳤다.
- **Ghostty 스피너 수정** — 활동 스피너의 펄스가 Ghostty 에서 잘못된 글리프 크기에 머무르던 문제를 고쳤다.

## 🔑 이번 버전의 핵심 키워드
**"macOS Apple Events 정상화와 시작 안정성 중심의 대규모 버그 수정 정비 릴리스"** — 신기능은 셋뿐이고, 시작 지연·크래시·클립보드·서브에이전트 패널 등 실사용 결함을 대거 손봤다.

---

# 📜 원문 (한글 번역본)

> 원문 ChangeLog를 원래 순서 그대로 한 줄도 빠짐없이 번역한 문서입니다.

- 프롬프트에서 임의의 설정을 지정하는 `/config key=value` 문법 추가 (예: `/config thinking=false`) — 인터랙티브, `-p`, Remote Control 에서 동작
- 샌드박스된 명령이 macOS 에서 Apple Events 를 전송하게 허용하는 `sandbox.allowAppleEvents` 옵트인 설정 추가
- `CLAUDE_CLIENT_PRESENCE_FILE` 환경변수 추가: 마커 파일을 가리키면 기기 앞에 있는 동안 모바일 푸시 알림을 억제
- 번들된 Bun 런타임을 1.4 로 업그레이드
- 긴 문단 스트리밍 개선: 텍스트가 첫 줄바꿈을 기다리지 않고 줄 단위로 표시됨
- 자동 재시도 개선: thinking 도중 API 연결이 끊겨도 "Connection closed while thinking" 을 표시하는 대신 자동으로 재시도함
- 서브에이전트 패널 개선: 유휴 서브에이전트는 30초 후 자동 숨김, 목록은 최대 5행으로 스크롤 힌트 제공, 키보드 힌트를 푸터에 표시
- MCP OAuth 브라우저 페이지를 Claude Code 비주얼 스타일에 맞추고 성공 시 자동 닫히도록 개선
- 풀스크린 모드의 URL 열기를 Cmd+click (macOS) / Ctrl+click 필요로 변경, 네이티브 터미널 동작과 일치
- `Improved N memories` 줄을 verbose 모드 밖에서는 개별 파일을 나열하지 않도록 변경
- 매 턴 바뀌는 요청별 attestation 토큰 때문에 커스텀 `ANTHROPIC_BASE_URL` 및 Foundry 에서 prompt caching 이 읽히지 않던 문제 수정
- 네트워크 드라이브 및 클라우드 동기화 폴더에서 Write/Edit 가 0바이트 또는 잘린 파일을 생성하던 문제 수정
- Apple Events 엔타이틀먼트를 추가해 `open`, `osascript`, 브라우저 기반 인증 흐름이 macOS 에서 -600 오류로 실패하던 문제 수정
- 시작 회귀(새 환경에서 실행당 ~120ms, 2.1.169 에서 유입) 수정: MCP 서버 미설정 시 첫 프롬프트가 managed-settings 페치를 더 이상 기다리지 않음
- 저하된 네트워크에서 계정 설정 페치가 느릴 때 빈 터미널로 최대 15초간 시작이 블로킹되던 문제 수정
- `.claude.json` 에 손상된 null 프로젝트 항목이 있을 때 발생하던 시작 크래시(`TypeError: Cannot read properties of null`) 수정
- Spotlight 가 재색인 중일 때 세션 시작 시 macOS TUI 가 멈추던(Ctrl+C 무반응) 문제 수정
- 다른 Claude Code 프로세스가 30일 트랜스크립트 정리를 실행할 때 장기 유휴 세션이 히스토리를 잃던 문제 수정
- 포그라운드 서브에이전트가 무한 중첩 체인을 생성하던 문제 수정; 이제 백그라운드 서브에이전트와 동일한 5단계 깊이 제한을 따름
- 모델 전환 직후 `/recap` 과 대화 포크가 이전 모델을 사용하던 문제 수정
- 서브에이전트 "Thinking" 시간이 서브에이전트 자신의 경과 시간 대신 부모 에이전트의 경과 시간을 표시하던 문제 수정
- 중첩 에이전트에서 블록된 서브에이전트가 에이전트 패널에서 "waiting" 대신 경과 시간이 흐르게 표시되던 문제 수정
- 재시도 성공 후에도 API 재시도 인디케이터("Retrying in 0s · attempt N/10")가 화면에 남던 문제 수정
- AWS `awsCredentialExport` 자격증명의 잔여 수명이 짧을 때 매분 자격증명 갱신을 유발하던 문제 수정, 이제 `aws configure export-credentials` 의 JSON 형태를 수용
- `claude mcp get`/`list` 가 tools/list 실패 시 `✓ Connected` 로 표시하던 문제 수정; 이제 오류 상세와 함께 `! Connected · tools fetch failed` 로 표시
- `/remote-control` 이 잔류 "connecting…" 줄을 남기던 문제 수정; 이제 연결되면 트랜스크립트에서 확인
- Windows 에서 bare `git` 을 해석할 수 없을 때 ExitWorktree 가 깨끗한 워크트리를 "Could not verify worktree state" 로 제거 거부하던 문제 수정
- 심볼릭 링크된 `~/.claude` 아래의 상대 심볼릭 링크가 `~/.claude/settings.json` 일 때 설정 변경(`/effort` 나 `/model` 등)이 ENOENT 로 실패하던 문제 수정
- 컨텍스트 리마인더의 IDE 선택 줄번호가 1만큼 어긋나던 문제 수정 (IntelliJ, VS Code)
- 네이티브 터미널 선택(modifier+drag) 후 풀스크린에서 Ctrl+C 가 앱의 이전 선택으로 클립보드를 덮어쓰던 문제 수정
- 클립보드에 텍스트가 있을 때 Ctrl+V 가 붙여넣기 대신 "No image found in clipboard" 를 표시하던 문제 수정
- agents 디렉터리가 이미 존재할 때 에이전트 생성이 "EEXIST: file already exists" 로 실패하던 문제 수정 (Windows/OneDrive)
- AskUserQuestion 미리보기 내용이 단어 단위 줄바꿈 대신 다이얼로그 가장자리에서 잘리던 문제 수정
- AskUserQuestion 다중 선택 질문에서 제출 시 입력한 "Other" 자유 텍스트 답변이 조용히 누락되던 문제 수정
- UTC 음수 시간대에서 `/stats` 의 "Most active day" 와 일일 토큰 차트 날짜가 하루 빠르게 표시되던 문제 수정
- Claude Code 시작 후 설치된 클립보드 유틸리티를 Linux 에서 `/copy` 및 선택 복사가 감지하지 못하던 문제 수정
- 탭 들여쓰기 코드가 Write(파일 생성) 미리보기에서 잘못된 들여쓰기로 렌더링되던 문제 수정
- 턴 도중 큐에 들어간 사용자 프롬프트가 트랜스크립트에서 전체 너비 배경 하이라이트를 표시하지 않던 문제 수정
- 활동 스피너의 펄스가 Ghostty 에서 잘못된 글리프 크기에 머무르던 문제 수정

---

## 🎯 챌린지

이번 버전에서 내 환경에 적용해볼 만한 항목입니다.

### 1. osascript 알림을 위한 Apple Events 허용 점검
- **파일**: `~/.claude/settings.json`
- **근거**: `Stop` hook 에서 `osascript -e 'display notification ...'` 으로 작업 완료 알림을 쓰고 있다. 이번 버전이 `open`/`osascript` 의 -600 오류와 `sandbox.allowAppleEvents` 옵트인을 추가했다. 샌드박스 모드를 쓴다면 `sandbox.allowAppleEvents: true` 를 추가해 알림 hook 이 막히지 않게 하고, 안 쓴다면 -600 수정으로 이미 정상화됐는지 알림이 실제로 뜨는지 확인한다.
- **난이도**: ★☆☆ (약 5분)

### 2. `CLAUDE_CLIENT_PRESENCE_FILE` 로 기기 앞 푸시 억제
- **파일**: `~/.claude/settings.json` 의 `env` 블록
- **근거**: macOS 데스크톱에서 작업 중인데 모바일 푸시가 중복으로 온다면, `env` 에 `CLAUDE_CLIENT_PRESENCE_FILE` 을 마커 파일 경로로 지정하고 기존 `SessionStart`/`SessionEnd` hook 에서 해당 파일을 생성·삭제하게 연결하면 기기 앞에 있는 동안만 푸시를 억제할 수 있다.
- **난이도**: ★★☆ (약 15분)

### 3. `/config thinking=false` 등 프롬프트 설정 토글 익히기
- **파일**: (파일 변경 없음) 인터랙티브 세션에서 직접 실행
- **근거**: 이번 버전이 `/config key=value` 를 추가했다. `/effort`, `/model` 처럼 자주 바꾸는 값을 프롬프트에서 즉시 토글할 수 있는지 한 번 실행해 확인하고, 자주 쓰는 조합을 메모로 남긴다. `-p` 모드와 cron 스크립트(체인지로그 동기화 등)에도 인라인 설정으로 쓸 수 있는지 검증한다.
- **난이도**: ★☆☆ (약 5분)
