# MCP — 페르소나별 추천

MCP(Model Context Protocol) = Claude가 외부 도구·서비스에 접근하는 표준 인터페이스.

## 공통 필수

- `filesystem` — 로컬 파일 접근 (기본 내장)
- `fetch` — 웹페이지 fetch
- **Notion** — 노트·DB (개인·팀 병용)

## 영어 마케터 (귀 악세서리 브랜드 CEO)

- **Google Drive** — 자산·자료
- **Gmail** — 클라이언트·파트너 커뮤니케이션
- **Canva** — 소셜 콘텐츠 초안
- **HubSpot** — CRM (도입한 경우)
- **playwright** — 경쟁사 사이트 자동 캡처

## 신소재 연구 박사과정

- **Google Drive** — 데이터·초안 공유
- **GitHub** — 실험 코드·시뮬레이션 리포지토리
- **playwright** — 논문 검색 자동화 (arXiv, Google Scholar)
- `fetch` + PDF reader — 논문 본문 추출

## 채권 금융

- **Microsoft 365 (Excel)** — 모델링 파일
- **Slack** — 팀 커뮤니케이션
- `fetch` — 뉴스·공시 스크래핑
- Bloomberg (있으면 커뮤니티 MCP)

## 비자 컨설팅

- **Google Drive** — 서류·PDF 관리
- **Gmail** — 클라이언트 대응
- **Notion** — 케이스 트래킹 DB
- `fetch` — USCIS·이민청 정책 페이지 확인

## MCP 도입 원칙

- 필요한 만큼만 등록 (많을수록 컨텍스트 낭비)
- 인증 토큰은 `settings.json`에 하드코딩하지 말고 env로
- 세션 시작 시 자동 재인증되지 않는 MCP는 헤드리스/cron에선 사용 불가
