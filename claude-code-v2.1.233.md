# Claude Code v2.1.233

> 작성일: 2026-08-15

---

# 📋 요약본

## 🎉 신기능 (4건)
- **GitLab MR 지원** — `--worktree` 플래그와 `claude agents` 화면이 GitLab merge request URL을 인식한다. MR은 `!N` 형태로 표시된다.
- **`forward_user_identity` 게이트웨이 설정** — Anthropic upstream에 옵트인으로 켜면 로그인한 사용자 신원을 헤더로 전달한다. 게이트웨이 뒤 프록시가 사용자별 지출을 집계할 수 있다.
- **Bash 도구 메모리 cgroup 제한 (Linux)** — `CLAUDE_CODE_TOOL_MEMORY_LIMIT` 환경변수로 옵트인. 폭주하는 빌드가 세션 전체를 멈추는 것을 막는다.
- **`CLAUDE_CODE_WEBFETCH_CACHE_TTL_MS` 환경변수** — WebFetch 세션 URL 캐시 TTL을 조정한다. 기본값은 15분으로 변경 없음.

## 🛠️ 개선/수정 (15건)
- **클라우드 세션 유실 오탐 수정** — 권한 프롬프트 대기 중 환경이 종료되면 세션이 "손실됨"으로 잘못 표시되던 문제를 고쳤다.
- **MCP v2 스트림 재연결 폭주 수정** — 긴 연결을 고정 타임아웃으로 끊는 서버(예: serverless 호스트)를 상대로 `subscriptions/listen` 스트림을 무한 재개방하던 문제를 고쳤다.
- **Notification hook 미발동 수정** — Claude Desktop·VS Code에서 권한 프롬프트에 Notification hook이 발동하지 않던 문제를 고쳤다.
- **Linux CPU 점유 수정** — 샌드박싱이 켜진 상태에서 유휴 세션이 CPU 코어 하나를 100%로 물고 있던 문제를 고쳤다.
- **번들 스킬 별칭 인식 수정** — 사용자·프로젝트 스킬이 번들 스킬을 가릴 때 `/checkup`·`/review` 같은 별칭이 `-p` 모드나 플러그인·MCP 로드 상황에서 "Unknown command"로 나오던 문제를 고쳤다.
- **스킬 인자 치환 수정** — 인자 값이 템플릿 마커로 다시 확장되지 않도록 막았다.
- **Windows NT 경로 취약점 수정** — `\??\` 장치 접두사로 표기한 경로가 UNC 경로 검증을 우회하던 문제를 고쳐 NTLM 자격증명 유출 경로를 차단했다.
- **`claude self-hosted-runner` 시작 속도 개선** — 세션 브랜치를 working tree 재작성 없이 만들고, 서버 왕복 2회가 더 이상 에이전트 실행을 막지 않는다.
- **게이트웨이 오류 전달 개선** — Vertex·Foundry·Claude Platform on AWS upstream의 400/413 오류가 원본 메시지를 그대로 전달한다. 게이트웨이에서의 auto-compact 버그도 함께 해결됐다.
- **`claude plugin validate` 개선** — 단독 `.claude/skills` 디렉터리를 검사하고 frontmatter 파싱에 실패하는 SKILL.md를 보고한다.
- **스크린 리더 모드 개선** — `/effort` 선택기가 번호 목록 + 숫자 입력 방식으로 렌더되고, 힌트·다이얼로그 텍스트가 잘리지 않는다.
- **print 모드 진단 개선** — 인식하지 못하는 모델 ID로 요청이 나가면 stderr에 `[claude-code:unrecognized_model]` 줄이 찍힌다. `modelOverrides`로 매핑하면 사라진다.
- **GitHub 앱 설정 안내 조정** — origin remote가 gitlab.com·bitbucket.org인 레포에서는 안내가 뜨지 않는다. GitHub 외 내부 git 호스트는 엔터프라이즈 마켓플레이스 안내가 담당한다.
- **Todo 도구 기본 비활성화** — TaskCreate/Get/Update/List·TodoWrite가 Opus 4.8, Sonnet 5, Fable 5, Mythos 5 및 이후 모델에서 제공되지 않는다. `CLAUDE_CODE_ENABLE_TODO_TOOLS=1`로 되살릴 수 있다.
- **Windows Bash 권한 회귀 수정·되돌림** — `cd <dir> && <command> > file` 형태에서 auto 모드가 반복해서 수동 승인을 요구하던 2.1.232 회귀를 고쳤다. Cygwin 심볼릭 링크·입력 리다이렉션(`< file`) 관련 2.1.232 권한 변경은 되돌렸고, 범위를 좁힌 버전이 이후 릴리스에 다시 들어온다.

## 🔑 이번 버전의 핵심 키워드
**"GitLab을 1급으로, 자원 폭주는 울타리로"** — GitLab MR 지원과 Linux 자원 제어를 더하고, 권한·hook·스킬 별칭의 오래된 흠집을 정리한 릴리스.

---

# 📜 원문 (한글 번역본)

> 원문 ChangeLog를 원래 순서 그대로 한 줄도 빠짐없이 번역한 문서입니다.

- `--worktree` 플래그와 `claude agents` 화면에 GitLab merge request URL 지원을 추가했다 (MR은 `!N`으로 표시된다)
- Anthropic upstream에 옵트인 `forward_user_identity` apps gateway 설정을 추가했다. 로그인한 사용자의 신원을 헤더로 전송해, 게이트웨이 뒤의 프록시가 사용자별 지출을 귀속할 수 있다
- Linux에서 Bash 도구 명령에 대한 옵트인 메모리 cgroup 지원(`CLAUDE_CODE_TOOL_MEMORY_LIMIT`)을 추가했다. 폭주하는 빌드가 세션을 멈추지 못한다
- WebFetch 세션 URL 캐시 TTL을 설정하는 `CLAUDE_CODE_WEBFETCH_CACHE_TTL_MS` 환경변수를 추가했다 (기본값 15분, 변경 없음)
- Claude가 권한 프롬프트를 기다리는 동안 환경이 종료되면 클라우드 세션이 간헐적으로 손실됨으로 표시되던 문제를 고쳤다
- 긴 연결을 고정 타임아웃으로 종료하는 서버(예: serverless 호스트)를 상대로 MCP v2 연결이 `subscriptions/listen` 스트림을 끝없이 다시 열던 문제를 고쳤다
- Claude Desktop 또는 VS Code에서 실행할 때 권한 프롬프트에 Notification hook이 발동하지 않던 문제를 고쳤다
- 샌드박싱이 활성화된 상태에서 Linux의 유휴 세션이 때때로 CPU 코어 하나를 100%로 유지하던 문제를 고쳤다
- 사용자 또는 프로젝트 스킬이 번들 스킬을 가릴 때, `/checkup`·`/review` 같은 번들 스킬 별칭이 `-p` 모드 또는 플러그인·MCP 로드 상황에서 "Unknown command"로 보고되던 문제를 고쳤다
- 인자 값이 템플릿 마커로 재확장되지 않도록 스킬/커맨드 인자 치환을 고쳤다
- NT `\??\` 장치 접두사로 표기된 Windows 경로가 UNC 경로 검증을 우회하던 문제를 고쳐 NTLM 자격증명 유출 경로를 차단했다
- `claude self-hosted-runner` 세션 시작 시간을 개선했다. 세션 브랜치를 working tree 재작성 없이 생성하며, 서버 왕복 2회가 더 이상 에이전트 실행을 가로막지 않는다
- apps gateway 오류 전달을 개선했다. Vertex, Foundry, Claude Platform on AWS upstream의 400/413 오류가 upstream 자체 메시지를 담아 전달되며, apps gateway의 auto-compact 버그를 해결했다
- `claude plugin validate`가 단독 `.claude/skills` 디렉터리를 검사하도록 개선해, frontmatter 파싱에 실패하는 SKILL.md 파일을 보고한다
- 스크린 리더 모드를 개선했다. `/effort` 선택기가 번호 목록과 숫자 입력 프롬프트로 렌더되며, 힌트·다이얼로그 텍스트가 잘리지 않는다
- print 모드 진단을 개선했다. Claude Code가 인식하지 못하는 모델 ID로 요청이 나가면 stderr에 `[claude-code:unrecognized_model]` 줄이 기록된다. `modelOverrides`로 매핑하면 표시되지 않는다
- origin remote가 gitlab.com 또는 bitbucket.org인 저장소에서는 GitHub 앱 설정 안내가 더 이상 나타나지 않도록 변경했다. GitHub이 아닌 내부 git 호스트는 엔터프라이즈 마켓플레이스 안내가 담당한다
- Todo·task 추적 도구(TaskCreate/Get/Update/List, TodoWrite)가 Opus 4.8, Sonnet 5, Fable 5, Mythos 5 및 이후 모델에서 더 이상 제공되지 않는다. `CLAUDE_CODE_ENABLE_TODO_TOOLS=1`로 되돌릴 수 있다
- Windows: 일반적인 `cd <dir> && <command> > file` 형태의 Bash 명령에서 auto 모드가 반복적으로 수동 승인을 요구하던 문제(2.1.232 회귀)를 고쳤다
- Cygwin 스타일 심볼릭 링크와 입력 리다이렉션(`< file`)에 대한 2.1.232의 Windows Bash 권한 변경을 되돌렸다. 범위를 좁힌 버전이 이후 릴리스에 다시 들어온다

---

## 🎯 챌린지

이번 버전에서 내 환경에 적용해볼 만한 항목입니다.

### 1. Todo 도구 유지 여부 결정
- **파일**: `~/.claude/settings.json` (`env` 블록)
- **근거**: 현재 모델이 `opus[1m]`이라 이번 버전부터 TaskCreate/TodoWrite가 사라진다. CLAUDE.md §10은 "마이크로 단위 작업 분할"과 "현재 작업 표시"를 요구하는데, 할 일 추적 도구가 없으면 진행 상황이 텍스트로만 남는다. 유지하려면 `"env": { "CLAUDE_CODE_ENABLE_TODO_TOOLS": "1" }`을 추가한다. 반대로 도구 없이 짧은 진행 문구만 쓰는 쪽이 맞다면 그대로 두고 CLAUDE.md에 근거를 한 줄 남긴다.
- **난이도**: ★☆☆ (약 5분)

### 2. Notification hook 추가
- **파일**: `~/.claude/hooks` (settings.json 내 `hooks` 블록)
- **근거**: 지금은 `Stop` hook만 있어 작업 완료만 알림이 온다. 이번 버전에서 권한 프롬프트의 Notification hook 발동 버그가 고쳐졌으니, `Notification` 이벤트에 같은 `osascript` 알림을 붙이면 승인 대기 중인 프롬프트를 놓치지 않는다. `skipAutoPermissionPrompt: true` 환경에서도 남는 승인 요청을 즉시 알아챌 수 있다.
- **난이도**: ★☆☆ (약 10분)

### 3. 스킬 frontmatter 일괄 검증
- **파일**: `~/.claude/skills/` 하위 각 `SKILL.md`
- **근거**: `claude plugin validate`가 단독 `.claude/skills` 디렉터리를 검사하도록 개선됐다. 개인 스킬(`claude-changelog-sync`, `claude-ver-dashboard`, `report-writer`, `update-repos`, `graphify`)의 frontmatter 파싱 오류를 한 번에 잡아낸다. 파싱이 깨진 스킬은 조용히 로드되지 않으므로 지금 확인해둔다.
- **난이도**: ★☆☆ (약 10분)

### 4. WebFetch 캐시 TTL 조정
- **파일**: `~/.claude/settings.json` (`env` 블록)
- **근거**: `claude-changelog-sync`는 GitHub raw CHANGELOG.md를 반복해서 가져온다. 기본 15분 캐시는 하루 1회 cron에는 무의미하고, 같은 세션에서 재확인할 때는 오래된 응답을 줄 수 있다. `CLAUDE_CODE_WEBFETCH_CACHE_TTL_MS`를 짧게(예: `60000`) 잡으면 동기화 중 최신 changelog를 확실히 받는다.
- **난이도**: ★☆☆ (약 5분)
