# Hooks 활용법

Hook = Claude Code 이벤트에 반응하는 bash 스크립트. 자동화의 유일한 정식 수단.

## 이벤트 타입

| 이벤트 | 발화 시점 | 예 |
|---|---|---|
| **SessionStart** | 세션 시작 (실행·재개·clear) | 회고 초안 목록 표시 |
| **UserPromptSubmit** | 사용자 프롬프트 제출 후 | 정책 주입, 프리셋 로드 |
| **PreToolUse** | 도구 실행 직전 | 위험 커맨드 차단 (`git commit`) |
| **PostToolUse** | 도구 실행 직후 | 결과 로깅·검증 |
| **Stop** | 응답 종료 | 세션 회고 자동 생성 |

## 설정

`~/.claude/settings.json`:
```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": { "toolName": "Bash" },
        "hooks": [
          { "type": "command", "command": "$HOME/hooks/deploy-guard.sh" }
        ]
      }
    ]
  }
}
```

## Hook 스크립트 규약

- stdin으로 JSON 받음: `{ tool_name, tool_input, ... }`
- 종료 코드 `0` = 통과
- PreToolUse에서 차단하려면 stdout으로 JSON 응답:
  ```json
  {
    "hookSpecificOutput": {
      "hookEventName": "PreToolUse",
      "permissionDecision": "deny",
      "permissionDecisionReason": "이유"
    }
  }
  ```
- stdout의 나머지는 SessionStart/UserPromptSubmit hook 성공 메시지로 표시됨

## 실전 예: deploy-guard

- PreToolUse에서 `git commit`/`git push` 인터셉트
- `.claude/.deploy-token-*` 존재·유효성 검증
- 없으면 `permissionDecision: deny`
- 토큰 발급은 `/deploy-precheck` skill

## 주의

- Hook은 세션 CWD 기준으로 동작 — 다중 프로젝트 워크플로우 설계 시 CWD 오류 유의
- Hook 실패 시 도구 실행 전체가 차단됨 → hook 자체 오류 처리 필수
