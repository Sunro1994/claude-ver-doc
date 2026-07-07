# Claude Code v2.1.175

> 작성일: 2026-06-12

---

# 📋 요약본

## 🎉 신기능 (1건)
- **`enforceAvailableModels` managed setting 추가** — 활성화 시 `availableModels` allowlist가 Default 모델까지 제약함. 즉:
  - Default가 disallowed 모델로 resolve될 경우 첫 번째 allowed 모델로 fallback.
  - 사용자 또는 프로젝트 설정이 더 이상 managed `availableModels` 목록을 확장(widen)할 수 없음.

## 🔑 이번 버전의 핵심 키워드
**"엔터프라이즈 모델 통제 강화"** — 관리자가 설정한 `availableModels` allowlist가 Default 경로와 사용자/프로젝트 설정 override 시도를 모두 봉쇄하도록 강제할 수 있게 되었습니다. v2.1.163의 `requiredMinimumVersion`/`requiredMaximumVersion`과 비슷한 결의 엔터프라이즈 통제 강화 패치입니다.

---

# 📜 원문 (한글 번역본)

> 원문 ChangeLog를 원래 순서 그대로 한 줄도 빠짐없이 번역한 문서입니다.

- `enforceAvailableModels` managed setting을 추가했습니다 — 활성화하면 `availableModels` allowlist가 Default 모델도 제약하며(disallowed 모델로 resolve될 Default는 이제 첫 번째 allowed 모델로 fallback함), 사용자 또는 프로젝트 settings가 더 이상 managed `availableModels` 목록을 widen할 수 없습니다.

---

## 🎯 챌린지

이번 버전에서 내 환경에 적용해볼 만한 항목입니다.

### 1. `availableModels` allowlist로 모델 라우팅 자동 강제
- **파일**: `~/.claude/settings.json`
- **근거**: CLAUDE.md §5에 "Sonnet 기본, Opus는 합성/디버깅, Haiku 금지"가 적혀 있지만 현재 settings에는 강제 수단이 없음. `availableModels`에 `claude-opus-4-7`, `claude-sonnet-4-6`만 등록하면 Haiku 선택을 원천 차단해 §5 원칙이 코드로 보장됨.
- **난이도**: ★☆☆ (약 5분)

### 2. `enforceAvailableModels: true` 켜고 Default fallback 검증
- **파일**: `~/.claude/settings.json`
- **근거**: 이번 버전 핵심 기능. allowlist만 두면 Default 경로가 우회될 수 있음. enforce를 켠 뒤 `/model` 또는 새 세션에서 Default가 첫 번째 allowed 모델(Opus 4.7)로 fallback되는지 직접 확인하면, 엔터프라이즈 통제 동작을 손에 잡히게 이해할 수 있음.
- **난이도**: ★★☆ (약 10분)

### 3. Managed settings로 본인 self-lock 구성
- **파일**: `/Library/Application Support/ClaudeCode/managed-settings.json`
- **근거**: ChangeLog의 "user/project settings가 더 이상 managed allowlist를 widen할 수 없다"는 변경은 managed 위치에 둘 때만 의미가 있음. 개인 환경에서도 managed 위치에 model 정책을 박아두면 실수로 user settings를 수정해도 정책이 풀리지 않음. agent-infra 자동화와 잘 맞음.
- **난이도**: ★★☆ (약 15분)

### 4. CLAUDE.md §5에 `availableModels` 정책 명시
- **파일**: `~/.claude/CLAUDE.md`
- **근거**: 현재 §5는 "Sonnet 기본 / Opus 합성용" 원칙만 있음. allowlist를 도입하면 settings와 문서가 어긋날 수 있으므로, §5에 "허용 모델: Opus 4.7, Sonnet 4.6" 한 줄을 추가해 settings와 정책 문서를 sync. 미래의 자신에게 보내는 root cause 기록.
- **난이도**: ★☆☆ (약 5분)
