# Claude Code 버전 대시보드

`~/claude-ver-doc/claude-code-v*.md` 를 일자별로 훑고, 각 버전에 대해 `~/.claude` 환경에 적용해볼 만한 "챌린지"를 `claude -p --model opus` 로 생성해 원본 .md 맨 아래에 붙인다.

## 실행

```sh
node /Users/leeseonro/claude-ver-doc/dashboard/server.mjs
```

- 자동으로 `http://127.0.0.1:5174` 열림 (loopback only — poplus-dashboard가 5173을 쓰므로 충돌 회피)
- 열지 않으려면 `--no-open` 옵션

## 동작

| 구성 | 내용 |
|---|---|
| 사이드바 | 일자별로 그룹화된 버전 목록. `🎯` 배지는 챌린지 섹션이 이미 들어가 있음을 의미 |
| 본문 | 선택한 버전의 마크다운 렌더. 상단에 **챌린지 생성** 버튼 |
| 챌린지 버튼 | 해당 .md에 `## 🎯 챌린지` 가 없을 때만 활성화. 클릭하면 서버가 `claude -p --model opus` 호출 후 결과를 원본 .md 끝에 append |

## API

| Method | Path | 설명 |
|---|---|---|
| GET | `/api/versions` | 버전 메타데이터 목록 (file, version, date, keyword, hasChallenge) |
| GET | `/api/version?file=...` | 단일 버전 마크다운 원문 |
| POST | `/api/generate-challenge` | body: `{file}`. 챌린지 생성 후 원본에 append |

## 컨텍스트로 전달되는 정보

`claude -p` 프롬프트에 다음을 함께 전달:

- `~/.claude/settings.json` (최대 4KB)
- `~/.claude/projects/-Users-leeseonro/memory/MEMORY.md` (최대 2KB)
- 해당 버전 .md 전문
