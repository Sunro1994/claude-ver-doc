# 트러블슈팅 체크리스트

## 자주 만나는 오류

| 증상 | 원인 | 해결 |
|---|---|---|
| `permission decided by hook` | precheck 토큰 부재/만료 | `/deploy-precheck` 재실행 |
| MCP tool `disconnected` | 세션 갱신 필요 | 재인증 or 세션 재시작 |
| Skill이 실행 안됨 | frontmatter 누락/오탈자 | `SKILL.md`의 `name`, `description` 확인 |
| Cron이 로그를 안 남김 | launchd 최소 PATH | plist `EnvironmentVariables`에 PATH 명시 |
| Cron이 08:00에 안 돌음 | 그 시간 슬립 | launchd는 슬립 후 미뤄서 실행 (누락 아님) |
| `git push` 훅 차단 | deploy-guard | `/deploy-precheck` 후 재시도 |
| Memory가 반영 안됨 | `MEMORY.md` 인덱스 누락 | 파일 만들고 `MEMORY.md`에 링크 추가 |
| Sub-agent 결과 이상 | 티어 혼합 | Opus로 통일 |
| `Opus 호출 실패` | 일시적 rate limit / auth | 로그 확인, 잠시 후 재시도 |
| Sync 파일 미생성 | 업스트림 신규 없음 | 정상 — 새 버전 없으면 skip |

## 조사 순서

1. **로그 위치 확인**
   - launchd: `~/Library/Logs/{label}.log`
   - hooks: 스크립트가 직접 로깅한 경로
2. **재현** — 로컬 CLI에서 같은 명령 직접 실행
3. **최소화** — 문제 발생하는 최소 케이스로 축소
4. **로그 분석** — stderr까지 남기고 있는지
5. **훅·플러그인 격리** — 의심 훅을 임시 비활성화

## 자주 놓치는 것

- **훅 실패도 blocking**: PreToolUse hook의 오류는 도구 실행 자체를 막음 → hook 스크립트에 자체 error handling 필수
- **경로 상대성**: 스크립트가 실행되는 위치는 예측 불가 — 절대 경로 사용
- **환경변수 부재**: launchd·cron은 로그인 셸 rc 안 읽음 → 필요한 env는 plist/crontab에 명시
- **`.tmp` 잔재**: sync 중단 시 `.md.tmp` 남음 → 다음 실행 전 정리

## 마지막 수단

- 새 세션 + `/clear`
- `~/.claude/settings.json`을 최소 상태로 리셋 후 하나씩 되살리기
- `token-optimizer:health`로 좀비 세션 정리
