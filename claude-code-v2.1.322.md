# Claude Code v2.1.322

> 작성일: 2026-11-11

---

# 📋 요약본

## 🎉 신기능 (1건)
- **Vertex에서 fast mode 지원** — Google Cloud Vertex AI로 Claude를 쓸 때도 fast mode를 쓸 수 있다.
  - 지원 리전은 `global`, `us`, `eu` 세 곳이다.
  - Vertex가 fast mode 요청을 받아주지 않으면 작업이 실패하지 않고 표준 속도로 바꿔서 계속 처리한다.

## 🔑 이번 버전의 핵심 키워드
**"Vertex에서도 fast mode"** — Vertex 사용자도 fast mode를 쓸 수 있고, 거절되면 표준 속도로 자동 전환된다.

---

# 📜 원문 (한글 번역본)

> 원문 ChangeLog를 원래 순서 그대로 한 줄도 빠짐없이 번역한 문서입니다.

- Vertex의 `global`, `us`, `eu` 리전에서 fast mode를 추가했다. Vertex가 fast mode를 거부하면 표준 속도로 대체한다.

---

## 🎯 챌린지

이번 버전에서 내 환경에 적용해볼 만한 항목입니다.

### 1. Flyff 프로젝트에서만 Vertex 경로 시험 연결
- **파일**: `/Users/leeseonro/gitlab/flyff/.claude/settings.local.json`
- **근거**: 이미 GCP 프로젝트 `flyff-legacy-494807`가 있다. 이 프로젝트 폴더에만 `env`로 `CLAUDE_CODE_USE_VERTEX=1`, `ANTHROPIC_VERTEX_PROJECT_ID=flyff-legacy-494807`, `CLOUD_ML_REGION=global`을 넣으면 Vertex에서 fast mode가 되는지 시험할 수 있다. 리전은 이번 버전이 지원하는 `global`, `us`, `eu` 중 하나여야 한다. 전역 `~/.claude/settings.json`은 건드리지 않는다. 그래야 다른 프로젝트의 과금 경로가 바뀌지 않는다.
- **난이도**: ★★☆ (약 15분)

### 2. Vertex fast mode 제약을 메모리에 기록
- **파일**: `/Users/leeseonro/.claude/projects/-/memory/reference-vertex-fast-mode.md` (+ `MEMORY.md`에 포인터 1줄)
- **근거**: Vertex는 fast mode를 거부해도 오류 없이 표준 속도로 넘어간다. 그래서 체감 속도가 느려져도 원인을 알아채기 어렵다. 지원 리전이 `global`, `us`, `eu`뿐이라는 점과 거부되면 표준 속도로 바뀐다는 점을 reference 메모리로 남겨 두면 다음 세션에서 원인을 빨리 찾는다.
- **난이도**: ★☆☆ (약 5분)
