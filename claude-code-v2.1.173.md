# Claude Code v2.1.173

> 작성일: 2026-06-11

---

# 📋 요약본

## 🐛 버그 수정 (2건)
- **Fable 5 모델 이름 정규화 수정** — `[1m]` suffix가 정규화되지 않던 문제 수정. Fable 5는 1M context를 기본 포함하므로 suffix가 자동 stripping됨.
- **Windows에서 잘못된 "sandbox dependencies missing" 시작 경고 수정** — settings에서 sandbox가 활성화되어 있을 때 잘못 표시되던 spurious 경고 제거.

## 🔑 이번 버전의 핵심 키워드
**"Fable 5 핫픽스 + Windows sandbox 경고 정리"** — v2.1.170에서 도입된 Fable 5의 모델 ID 정규화 누수(이미 1M 기본 포함인데 suffix가 붙어 잘못 처리됨)와 Windows에서 sandbox 활성화 상태에서 잘못 뜨던 시작 경고를 잡은 미니 패치입니다.

---

# 📜 원문 (한글 번역본)

> 원문 ChangeLog를 원래 순서 그대로 한 줄도 빠짐없이 번역한 문서입니다.

- `[1m]` suffix가 붙은 Fable 5 모델 이름이 정규화되지 않던 문제를 수정했습니다 — Fable 5는 기본적으로 1M context를 포함하므로, suffix가 이제 자동으로 stripping됩니다.
- settings에서 sandbox가 활성화되어 있을 때 Windows에서 잘못 표시되던 spurious "sandbox dependencies missing" 시작 경고를 수정했습니다.
