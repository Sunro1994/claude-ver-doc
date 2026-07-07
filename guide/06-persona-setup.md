# 페르소나 설정 방법

각 페르소나는 별도 폴더 + 전용 `CLAUDE.md`로 격리한다.
Claude Code 세션을 그 폴더에서 열면 해당 페르소나 규칙이 자동 적용.

## 1. 영어 마케터 (귀 악세서리 브랜드 CEO)

**폴더**: `~/work/earring-brand/`

**`CLAUDE.md` 골자**:
```markdown
# 브랜드 톤 & 페르소나
- 타겟: 25-40세 여성, 미국·영국·호주
- 톤: 미니멀, 지속 가능, 감성적
- 금지어: "cheap", "trendy"

# 응답 규칙
- 마케팅 카피는 영어 원문 + 한국어 부제 병기
- SNS 문구는 220자 이내

# 자주 쓰는 문서
- `positioning.md` — 포지셔닝 스테이트먼트
- `campaigns/` — 캠페인 히스토리
```

## 2. 신소재 연구 박사과정

**폴더**: `~/research/materials-phd/`

```markdown
# 연구 주제
- 리튬이온 배터리 양극재 (NCM)

# 응답 규칙
- 논문 인용 시 저자·연도·저널 명시
- 수식은 LaTeX
- 실험 로그는 `logs/YYYY-MM-DD.md` 포맷

# 자주 참조
- `references/` — 논문 요약
- `experiments/` — raw data
- `drafts/` — 논문 초안
```

## 3. 채권 금융

**폴더**: `~/work/fixed-income/`

```markdown
# 도메인
- 국내 회사채, 신용등급 A- 이상
- BM: KIS채권가격지수

# 응답 규칙
- 수치는 소수점 2자리
- YTM, spread, duration 명시
- 모든 조언 끝에 "투자자문 아님" 명시

# 문서
- `deals/` — 딜별 브리프
- `models/` — Excel 모델
```

## 4. 비자 컨설팅

**폴더**: `~/work/visa-consulting/`

```markdown
# 사무 분야
- 미국 E-2, EB-5 위주

# 개인정보 취급
- 클라이언트 정보는 `clients/{익명ID}.md`에만
- git 커밋 금지 (.gitignore 필수)

# 응답 규칙
- 법률 자문 아님 명시
- 최신 USCIS 정책 fetch로 확인
- 케이스 요약은 사실만, 결론 강요 금지
```

## 폴더 분리의 이유

- 각 페르소나의 규칙이 서로 오염되지 않음
- memory도 프로젝트별로 분리 저장 → 마케팅 학습이 논문 작성에 새지 않음
- 팀·클라이언트에 공유할 때 파일 경계가 명확
