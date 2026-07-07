# 기능 개발·구조 설정 패턴

효율의 원천은 재사용. 재사용의 단위는 skill · sub-agent · hook · cron 네 가지.

## A. Skill 생성

- 반복 프롬프트 3회 이상 → skill 화 대상
- `~/.claude/skills/{name}/SKILL.md`
- 프론트매터 필수:
  ```yaml
  ---
  name: my-skill
  description: 언제 이 skill을 써야 하는지 한 줄
  ---
  ```
- 지침 본문은 짧고 단호하게. 예시·반례 포함.

## B. Sub-agent 조합

- 독립 병렬 작업 → Task tool로 다수 sub-agent 동시 실행
- 결과 병합은 sub-agent 종료 후
- 티어 혼합 금지 — 한 fan-out에서는 Opus로 통일 (실패 파급 비용이 토큰비보다 큼)

## C. Hook 자동화

이벤트별 활용:

| 이벤트 | 예 |
|---|---|
| SessionStart | 세션 정보 로드, 회고 초안 목록 |
| UserPromptSubmit | 프롬프트 정제, 정책 주입 |
| PreToolUse | 위험 커맨드 사전 차단 |
| PostToolUse | 결과 로깅, 검증 |
| Stop | 세션 회고 자동 생성 |

설정 위치: `~/.claude/settings.json`

## D. Cron / launchd

시간 반복 작업의 표준.

**macOS**: `~/Library/LaunchAgents/*.plist`
```xml
<key>StartCalendarInterval</key>
<dict>
  <key>Hour</key><integer>8</integer>
  <key>Minute</key><integer>0</integer>
</dict>
```

**Linux**: `crontab -e`

**주의**: launchd·cron은 최소 PATH 환경 — 스크립트 첫 줄에 PATH 확장 필수.
```bash
export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:$PATH"
```

## 결정 순서

1. 먼저 skill로 해결되는가? → skill
2. 병렬 여러 개인가? → sub-agent
3. 특정 이벤트에서 자동 실행? → hook
4. 시간 기준 반복? → cron/launchd
