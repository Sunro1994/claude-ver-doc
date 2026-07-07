# 팀 공유 패턴

Skills · hooks · CLAUDE.md를 GitHub repo로 관리하면 팀 전체가 동일한 Claude 환경을 쓴다.

## 공유 대상

| 파일 | 공유 여부 | 위치 |
|---|---|---|
| 프로젝트 `CLAUDE.md` | ✅ 공유 | repo 안 |
| 팀 공용 skills | ✅ 공유 | 별도 config repo |
| 팀 공용 hooks | ✅ 공유 | 별도 config repo |
| `settings.template.json` | ✅ 공유 | 시크릿은 placeholder |
| `MEMORY.md`, `memory/*.md` | ❌ 개인 | 각자 로컬 |
| `settings.local.json` | ❌ 개인 | 각자 로컬 |
| `.env`, 시크릿 파일 | ❌ 절대 금지 | .gitignore |

## Repo 구조 예

```
team-claude-config/
├── skills/
│   ├── team-review/SKILL.md
│   └── team-deploy-check/SKILL.md
├── hooks/
│   ├── secret-scan.sh
│   └── convention-check.sh
├── settings.template.json    # placeholder 포함
└── install.sh                # symlink 설치 스크립트
```

## install.sh 골자

```bash
#!/usr/bin/env bash
set -e
REPO_DIR="$(cd "$(dirname "$0")" && pwd)"
mkdir -p ~/.claude/skills ~/.claude/hooks

for d in "$REPO_DIR"/skills/*/; do
  ln -sfn "$d" ~/.claude/skills/"$(basename "$d")"
done
for f in "$REPO_DIR"/hooks/*.sh; do
  ln -sfn "$f" ~/.claude/hooks/"$(basename "$f")"
done

echo "✅ team-claude-config 설치됨"
```

## 팀 공용 skill 예

- **팀 리뷰 skill** — 코드리뷰 시 팀 컨벤션 강제
- **배포 precheck** — 팀 secret 검사 규칙
- **리포트 템플릿** — 팀 로고·포맷 고정
- **온보딩 skill** — 신규 입사자를 위한 코드베이스 투어

## 갱신 흐름

1. 리드가 `team-claude-config` repo에 PR
2. 팀원은 `git pull` — symlink이므로 즉시 반영
3. 심각한 변경은 사내 채널에 공지

## 프로젝트 CLAUDE.md와의 조합

- `team-claude-config`의 skills = 공용 규칙
- 프로젝트 `CLAUDE.md` = 프로젝트 전용 규칙
- 두 개는 서로 참조 가능 — 프로젝트 CLAUDE.md에서 "팀 리뷰 skill 사용" 명시
