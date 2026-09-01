# Claude Code v2.1.252

> 작성일: 2026-09-02

---

# 📋 요약본

## 🛠️ 개선/수정 (4건)
- **Bash 명령 실패 수정** — 일부 Mac에서 Bash 명령이 `"task output swap refused (tasks dir moved or linked)"` 오류로 실패하던 문제를 고쳤다. tasks 디렉터리가 이동됐거나 심볼릭 링크일 때 발생했다.
- **"always allow" 저장 실패 수정** — `.claude/settings.local.json` 파일이 아직 없는 프로젝트에서 "always allow"(항상 허용) 선택이 저장되지 않던 문제를 고쳤다. 이제 파일이 없으면 새로 만들어 저장한다.
- **Remote Control 세션 지연 수정** — Claude Desktop 또는 VS Code가 호스트인 Remote Control 세션에서, claude.ai 연결 상태가 나쁠 때 도구 실행이 끝난 뒤에도 수 분간 멈춰 있던 문제를 고쳤다.
- **대용량 실패 출력으로 인한 API 요청 크기 초과 수정** — 백그라운드 작업 알림의 실패 출력이 아주 클 때(예: 디스크가 꽉 찬 상태의 git 오류) 대화가 API 요청 크기 제한을 넘던 문제를 고쳤다.

## 🔑 이번 버전의 핵심 키워드
**"전부 버그 수정 — Bash 실행, 권한 저장, Remote Control 응답성, 대용량 출력 처리"** — 신기능 없이 실사용 중 걸리던 4개 결함만 정리한 안정화 릴리스.

---

# 📜 원문 (한글 번역본)

> 원문 ChangeLog를 원래 순서 그대로 한 줄도 빠짐없이 번역한 문서입니다.

- 일부 Mac에서 Bash 명령이 `"task output swap refused (tasks dir moved or linked)"` 오류로 실패하던 문제 수정
- `.claude/settings.local.json` 이 아직 없는 프로젝트에서 "always allow"가 저장되지 않던 문제 수정
- claude.ai 연결이 불안정할 때, Claude Desktop 또는 VS Code가 호스트인 Remote Control 세션이 도구 실행 완료 후 수 분간 멈추던 문제 수정
- 백그라운드 작업 알림의 실패 출력이 매우 클 때(예: 디스크가 가득 찬 상태의 git 오류) 대화가 API 요청 크기 제한을 초과하던 문제 수정

---

## 🎯 챌린지

이번 버전에서 내 환경에 적용해볼 만한 항목입니다.

### 1. 자주 쓰는 읽기 전용 명령을 프로젝트 allowlist 로 승격
- **파일**: `.claude/settings.local.json` (작업 프로젝트 루트)
- **근거**: 이번 버전이 `settings.local.json` 이 없는 프로젝트에서 "always allow"가 저장되지 않던 버그를 고쳤다. 그동안 허용 선택이 날아갔을 수 있으니 `/fewer-permission-prompts` 로 실제 사용 이력을 스캔해 읽기 전용 명령을 한 번에 등록한다. 권한 프롬프트가 줄어든다.
- **난이도**: ★☆☆ (약 10분)

### 2. Bash 훅 경로가 심볼릭 링크·이동 경로를 타지 않는지 확인
- **파일**: `~/.claude/settings.json`, `~/.claude/hooks/deploy-guard.sh`
- **근거**: 이번 버전의 `"task output swap refused (tasks dir moved or linked)"` 수정은 tasks 디렉터리가 링크·이동된 경우와 관련된다. `PreToolUse` 로 모든 Bash 를 가로채는 `deploy-guard.sh` 가 있으므로, `ls -l ~/.claude/hooks/` 로 심볼릭 링크 여부와 실행 권한을 확인하고 훅이 정상 동작하는지 Bash 한 번으로 점검한다.
- **난이도**: ★☆☆ (약 5분)

### 3. 백그라운드 작업의 실패 출력 절단 습관 고정
- **파일**: 작업 프로젝트의 `CLAUDE.md` 또는 배포 스크립트
- **근거**: 대용량 실패 출력이 API 요청 크기를 넘기던 문제가 고쳐졌지만, 애초에 출력을 줄이면 컨텍스트가 절약된다. 장시간 도는 배포·빌드 명령에 `2>&1 | tail -n 200` 를 붙이는 규칙을 명시한다. Docker compose 배포처럼 로그가 긴 작업에서 특히 효과가 있다.
- **난이도**: ★☆☆ (약 10분)

### 4. Remote Control 사용 시 호스트 선택 기준 메모
- **파일**: `~/.claude/CLAUDE.md`
- **근거**: Claude Desktop·VS Code 호스트 Remote Control 세션의 수 분 지연이 이번에 수정됐다. 원격 세션을 쓴다면 최신 버전에서만 호스트를 붙이도록 한 줄 규칙을 남긴다. 구버전 호스트가 섞이면 같은 지연이 재현된다.
- **난이도**: ★☆☆ (약 5분)
