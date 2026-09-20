# Claude Code v2.1.278

> 작성일: 2026-09-21

---

# 📋 요약본

## 🎉 신기능 (1건)
- **`/status` 에 `Auto mode server` 행 추가** — 현재 세션의 auto mode 분류기(classifier)가 서버에서 도는지 내 쪽에서 도는지 한눈에 보인다. 분류기 과금 여부를 세션 단위로 바로 확인할 수 있다.

## 🛠️ 개선/수정 (1건)
- **auto mode 분류기 기본값이 서버 사이드로 전환** — Claude API·Enterprise 사용자, 그리고 Bedrock·Vertex·Foundry·게이트웨이 환경에서 auto mode 분류기가 기본으로 서버에서 실행된다. 서버 분류기는 분류 오버헤드에 과금하지 않는다.
  - Bedrock·Vertex·Foundry·게이트웨이는 `CLAUDE_CODE_AUTO_MODE_SERVER=0` 으로 opt-out 가능.
  - 과금되는 fallback 으로 떨어지면 경고를 띄운다.
  - 문서: https://code.claude.com/docs/en/auto-mode-classifier-billing

## 🔑 이번 버전의 핵심 키워드
**"auto mode 분류기를 서버로 옮겨 공짜로 만들고, `/status` 로 그 상태를 보여준다"** — 숨어 있던 auto mode 부가 비용을 없애고, 어디서 도는지 투명하게 드러낸 버전.

---

# 📜 원문 (한글 번역본)

> 원문 ChangeLog를 원래 순서 그대로 한 줄도 빠짐없이 번역한 문서입니다.

- Claude API 및 Enterprise 사용자, 그리고 Bedrock·Vertex·Foundry·게이트웨이 환경의 auto mode 를 서버 사이드 분류기(classifier) 기본값으로 변경. 서버 사이드 분류기는 분류기 오버헤드에 과금하지 않는다 (Bedrock·Vertex·Foundry·게이트웨이에서는 `CLAUDE_CODE_AUTO_MODE_SERVER=0` 으로 opt-out). 과금되는 fallback 발생 시 경고한다. https://code.claude.com/docs/en/auto-mode-classifier-billing 참조
- 이번 세션의 auto mode 분류기가 서버에서 실행되는지 보여주는 `Auto mode server` 행을 `/status` 에 추가

---

## 🎯 챌린지

이번 버전에서 내 환경에 적용해볼 만한 항목입니다.

### 1. `/status` 로 내 세션 분류기 위치 확인
- **파일**: 없음 (세션에서 `/status` 실행)
- **근거**: 이번 버전에서 추가된 `Auto mode server` 행을 직접 확인한다. 내 설정은 `autoMode.environment` 가 채워져 있어 auto mode 를 쓰는 환경이다 — 분류기가 서버에서 도는지, 과금되는 로컬 fallback 인지 지금 상태를 먼저 알아야 다음 조치를 정할 수 있다.
- **난이도**: ★☆☆ (약 5분)

### 2. 과금 fallback 경고를 흘려보내지 않게 기록 규칙 추가
- **파일**: `/Users/leeseonro/.claude/CLAUDE.md`
- **근거**: 이번 버전은 분류기가 과금 fallback 으로 떨어질 때 경고만 띄운다. 경고는 스크롤에 묻히기 쉽다. §0 "예외적인 상황 발생 시 선 보고" 항목 아래에 "auto mode 분류기 fallback 경고가 뜨면 즉시 보고하고 계속 진행하지 않는다" 한 줄을 넣어 실수로 넘어가는 것을 막는다.
- **난이도**: ★☆☆ (약 5분)

### 3. `CLAUDE_CODE_AUTO_MODE_SERVER` 사용 여부 판단 후 명시
- **파일**: `/Users/leeseonro/.claude/settings.json` (`env` 키)
- **근거**: 이 환경변수는 Bedrock·Vertex·Foundry·게이트웨이에서만 의미가 있다. 내 `settings.json` 에는 이런 프록시 설정이 없어 보이므로 기본 서버 분류기가 그대로 맞다 — 챌린지의 실제 조치는 "설정하지 않는다"를 확인하고, `/status` 결과가 서버가 아니면 그때 이유를 찾는 것이다. 불필요한 `CLAUDE_CODE_AUTO_MODE_SERVER=0` 추가는 과금 경로로 되돌리는 역효과를 낸다.
- **난이도**: ★☆☆ (약 10분)

### 4. 분류기 과금 문서 링크를 레퍼런스 메모리로 저장
- **파일**: `/Users/leeseonro/.claude/projects/-/memory/reference-auto-mode-classifier-billing.md` + `MEMORY.md` 한 줄
- **근거**: `MEMORY.md` 에 Claude Code 과금 관련 레퍼런스가 없다. auto mode 분류기 과금 규칙은 환경(Enterprise / Bedrock / 게이트웨이)마다 갈려 매번 다시 찾게 된다. 공식 문서 URL 과 "서버 분류기 = 무과금, fallback = 과금" 한 줄을 메모리로 남겨 재검색 비용을 없앤다.
- **난이도**: ★☆☆ (약 10분)
