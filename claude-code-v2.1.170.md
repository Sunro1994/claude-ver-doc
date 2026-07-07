# Claude Code v2.1.170

> 작성일: 2026-06-10
> Fable 5 공식 발표일: 2026-06-09

---

# 📋 요약본

## 🚀 메이저 신기능 — Claude Fable 5 (Mythos-class) 일반 공개

### 한 줄 요약
**Anthropic이 지금까지 일반 공개한 어떤 모델보다도 강력한** 새로운 모델 클래스 **Mythos**를 도입하면서, 일반 사용을 위해 safeguard를 입힌 버전인 **Claude Fable 5**가 v2.1.170에 추가되었습니다.

### 모델 라인업의 변화
지금까지 Anthropic의 모델 계급은 Opus가 최상위였습니다. 이번에 그 **위**에 **Mythos** 클래스가 신설되었습니다.

```
[새 최상위 계급] Mythos
                  ├─ Claude Fable 5  ← 일반 공개 (safeguard 적용)
                  └─ Claude Mythos 5 ← 신뢰 액세스 프로그램 전용 (safeguard 해제)
[기존 최상위 계급] Opus 4.8 / 4.7 / ...
                Sonnet / Haiku / ...
```

- `Mythos`는 모델 클래스(계급) 이름.
- `Fable 5`와 `Mythos 5`는 **동일한 underlying 모델**입니다. 차이는 safeguard 적용 여부뿐.
- `Fable`은 라틴어 *fabula*(이야기되는 것)에서, `Mythos`는 그리스어로 어원이 같습니다. 이름이 다른 이유는 safeguard 적용 차이 때문.

### Fable 5의 capability (요약)
- **거의 모든 AI capability 벤치마크에서 SOTA**.
- 길고 복잡한 작업일수록 다른 Claude 모델 대비 격차가 커짐.
- **소프트웨어 엔지니어링**: Stripe 사전 테스트에서 5천만 라인 Ruby 코드베이스의 전사 마이그레이션을 **하루 만에** 처리 (수작업으로는 팀 전체가 두 달 이상). Cognition의 FrontierCode 평가에서 medium effort에서도 frontier 모델 중 최고 점수.
- **지식 노동**: Hebbia Finance Benchmark에서 최고 점수, IMC의 트레이딩 분석 평가도 거의 전 분야 만점.
- **비전**: 새로운 SOTA. 정밀한 과학 figure에서 수치 추출, 스크린샷만으로 웹 앱 소스 코드 재구성. **Pokémon FireRed를 비전만으로 클리어** (이전 Claude는 보조 도구 harness가 있어도 어려워했음).
- **장기 컨텍스트 / 메모리**: 수백만 토큰에 걸친 작업에서도 집중 유지. Slay the Spire에 persistent file 메모리를 주면 Opus 4.8 대비 3배 더 개선.
- **생명과학**: Mythos 5로 단백질 디자인 task에서 숙련된 인간과 동급/이상 결과, 분자생물학에서 일관되게 참신한 가설 생성 (블라인드 비교에서 약 80% 선호).

### 주목할 safeguard 설계 — "거부 대신 fallback"
Mythos 클래스 모델은 사이버보안·생물학 같은 영역에서 악용 위험이 있어, Anthropic은 **거부(refusal) 대신 Opus 4.8로 자동 fallback**시키는 safety classifier 방식을 채택했습니다.

- 분류기가 트리거되는 3개 영역: **사이버보안**, **생물학·화학**, **distillation 시도**.
- 트리거되면 Fable 5 대신 **Opus 4.8이 응답**하고 사용자에게 통보.
- 약 **5% 미만의 세션**에서만 fallback이 발생. 95% 이상은 Fable 5가 그대로 응답.
- 1,000시간 이상의 외부 bug bounty와 red-teaming에서도 universal jailbreak를 찾지 못함 (단, UK AISI가 짧은 초기 테스트에서 진전 보임).

### 데이터 보존 정책 변경
- **Mythos 클래스 모델 트래픽은 1st-party / 3rd-party 모두 30일 보존 의무화** (Fable 5, Mythos 5, 그리고 동급 이상 미래 모델).
- 모델 학습이나 비안전 용도로는 사용 안 함. 잠재적 우회 시도 분석에만 사용.
- 30일 후 거의 모든 경우 삭제, 사람의 접근은 모두 로깅.

### 가격
- **Input $10/M tokens · Output $50/M tokens**.
- Claude Mythos Preview의 **절반 미만** 가격.

### 가용성 (Claude Code 관점에서 중요)
- **Claude API**: `claude-fable-5` 모델 ID로 즉시 사용 가능 (`--model claude-fable-5`).
- **Mythos 5**: 일반 사용자 미공개. Project Glasswing 파트너 및 신뢰 액세스 프로그램 한정.
- **구독 플랜 롤아웃 일정**:
  - **2026-06-09 ~ 06-22**: Pro, Max, Team, seat-based Enterprise에 **무료 포함**.
  - **2026-06-23 이후**: 구독 플랜에서 일시 제거. 이후 사용은 **usage credit 필요**.
  - 향후 용량이 확보되면 구독 플랜 표준 모델로 복귀 예정.
- 수요 폭증 가능성 때문에 단계적 롤아웃 채택.

### 업계 초기 피드백
- **Cursor (Michael Truell, CEO)**: "CursorBench에서 SOTA. 이전 모델로는 불가능했던 long-horizon 문제 영역을 열어줬다."
- **GitHub (Mario Rodriguez, CPO)**: "복잡한 long-horizon 코딩 작업을 이전 벤치마크를 초과하는 자율성·신뢰성으로 처리."
- **Cognition (Scott Wu, CEO)**: "FrontierBench 최고 점수, long-horizon reasoning과 처음 보는 도구에 대한 일반화 우수."
- **Replit (Michele Catasta, President)**: "ViBench(vibe-coding 벤치마크)에서 우리가 테스트한 모델 중 최고."
- **Anthropic 자체 Claude Code**: "여러 turn에서 더 capable한 엔지니어링 결과 + 직원들이 매일 돌리는 멀티에이전트 워크플로우 처리."

---

## 🐛 버그 수정 (1건)
- VS Code 통합 터미널 또는 Claude Code 환경 변수를 상속한 어떤 셸에서든, 시작된 세션이 transcript를 저장하지 않고 `--resume`에도 나타나지 않던 문제 수정.

---

## 🔑 이번 버전의 핵심 키워드
**"Claude Fable 5 — Mythos 시대의 시작"** — Anthropic 모델 계층의 최상위에 새로 신설된 Mythos 클래스의 첫 일반 공개 모델입니다. 이전까지의 어떤 generally-available 모델도 가지 못한 자율성·long-horizon·비전 영역의 경계를 넓혔고, 동시에 거부 대신 Opus 4.8로 fallback시키는 새로운 safeguard 패러다임을 도입했습니다. Claude Code v2.1.170으로 업데이트해야 `claude-fable-5` 모델에 접근할 수 있습니다.

---

# 📜 원문 (한글 번역본)

> 원문 ChangeLog를 원래 순서 그대로 한 줄도 빠짐없이 번역한 문서입니다.

- Claude Fable 5를 소개합니다: 일반 사용을 위해 우리가 안전화한 Mythos-class 모델. Fable의 capability는 우리가 지금까지 일반 공개해 온 어떤 모델보다도 뛰어납니다. 접근하려면 버전 2.1.170으로 업데이트하세요. https://www.anthropic.com/news/claude-fable-5-mythos-5
- VS Code 통합 터미널 또는 Claude Code 환경 변수를 상속한 어떤 셸에서든 시작된 세션이 transcript를 저장하지 않고 (그리고 --resume에 나타나지 않던) 문제를 수정했습니다.

---

## 📚 출처
- [Claude Fable 5 and Claude Mythos 5 — Anthropic 공식 발표 (2026-06-09)](https://www.anthropic.com/news/claude-fable-5-mythos-5)
- [Claude Fable 5 & Mythos 5 System Card](https://anthropic.com/claude-fable-5-mythos-5-system-card)
- [Project Glasswing](https://www.anthropic.com/glasswing)

---

## 🎯 챌린지

이번 버전에서 내 환경에 적용해볼 만한 항목입니다.

### 1. Fable 5를 기본 모델로 시범 사용
- **파일**: `~/.claude/settings.json`
- **근거**: v2.1.170에서 `claude-fable-5`가 공개되었고, 2026-06-22까지 Pro/Max 플랜에 무료 포함됩니다. 6월 22일 전까지가 비용 부담 없이 SOTA 모델을 체감해볼 수 있는 유일한 창입니다. `"model": "claude-fable-5"` 한 줄 추가로 즉시 적용 가능.
- **난이도**: ★☆☆ (약 3분)

### 2. Mythos 클래스 전용 라우팅 규칙을 CLAUDE.md에 추가
- **파일**: `~/.claude/CLAUDE.md` (Model Routing 섹션)
- **근거**: 현재 라우팅 규칙은 Opus/Sonnet/Haiku 3계급 기준입니다. Fable 5는 long-horizon·멀티파일 리팩토링·비전 작업에서 Opus 4.8보다 명확히 우위지만 출력 단가가 $50/M로 5배 비쌉니다. "언제 Fable 5를 쓰고 언제 Opus 4.7에 머물지" 1~2줄 기준을 추가하면 비용 폭주를 막을 수 있습니다.
- **난이도**: ★★☆ (약 10분)

### 3. 6/23 무료 종료일을 schedule로 미리 알림
- **파일**: schedule 스킬로 routine 등록
- **근거**: 2026-06-23부터 Fable 5는 구독 플랜에서 빠지고 usage credit이 필요합니다. 무료 사용 중인 세션이 그날 갑자기 과금으로 바뀌면 청구가 튈 수 있어, 6/22 저녁에 "내일부터 Fable 5 유료 전환" 알림을 받도록 routine을 거는 게 안전합니다.
- **난이도**: ★☆☆ (약 5분)

### 4. Mythos 데이터 30일 보존 정책을 메모리에 기록
- **파일**: `~/.claude/projects/-Users-leeseonro/memory/` 에 새 reference 메모리
- **근거**: Fable 5 트래픽은 1st·3rd party 모두 30일 의무 보존됩니다 (학습엔 미사용, 우회 분석 한정). Poplus 사내 코드를 다루는 사용자 특성상, "Fable 5에는 민감 코드/시크릿 직접 붙여넣지 않기" 기준을 메모리에 박아두면 다음 세션부터 자동 반영됩니다.
- **난이도**: ★☆☆ (약 5분)

### 5. Fable 5 safeguard fallback 감지 hook
- **파일**: `~/.claude/settings.json` 의 `hooks` (PostToolUse 또는 SessionStart)
- **근거**: Fable 5 사용 중 ~5% 세션은 Opus 4.8로 자동 fallback되며 사용자에게 통보됩니다. 사이버보안·생물학·distillation 키워드가 트리거인데, 정상 개발 작업이 오탐될 경우 비용·성능 모두 영향이 있습니다. fallback 발생 시 osascript 알림을 띄우는 hook을 추가하면 빈도를 체감 가능 (기존 Stop hook과 같은 패턴 재사용).
- **난이도**: ★★★ (약 25분)
