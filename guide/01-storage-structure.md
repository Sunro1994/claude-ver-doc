# `~/.claude/` 저장 구조

> Claude Code CLI가 사용자별로 관리하는 폴더. 지침·기억·자동화·확장이 여기 모여 있다.

## 폴더 트리

```
~/.claude/
├── settings.json          # hooks, permissions, env vars
├── settings.local.json    # (선택) 로컬 오버라이드, git-ignore
├── CLAUDE.md              # 모든 프로젝트에 적용되는 전역 지침
├── keybindings.json       # 키 바인딩 커스텀
├── skills/                # 커스텀 skill 정의
│   └── {name}/SKILL.md
├── agents/                # 서브에이전트 정의 (Task tool로 호출)
│   └── {agent}.md
├── commands/              # 슬래시 커맨드 (/foo)
│   └── {cmd}.md
├── hooks/                 # 이벤트 자동화 스크립트 (bash)
├── plugins/               # skill + MCP + agent 번들
└── projects/{프로젝트별}/
    ├── CLAUDE.md          # 프로젝트 전용 지침
    ├── memory/            # 자동 저장 memory
    │   ├── MEMORY.md
    │   └── {name}.md
    └── history/           # 세션 기록
```

## 계층 우선순위 (충돌 시)

1. 프로젝트 저장소 안 `CLAUDE.md`
2. `~/.claude/projects/{proj}/CLAUDE.md`
3. `~/.claude/CLAUDE.md`

## 커밋 여부

| 파일 | Git 관리 |
|---|---|
| 프로젝트 안 `CLAUDE.md` | 팀과 공유 → commit |
| 개인 `~/.claude/CLAUDE.md` | 개인 dotfiles로 별도 관리 |
| `memory/*.md` | commit 금지 (개인 학습) |
| `settings.local.json` | commit 금지 |
