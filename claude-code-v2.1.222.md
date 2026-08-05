# Claude Code v2.1.222

> 작성일: 2026-08-06

---

# 📋 요약본

## 🛠️ 개선/수정 (21건)
- **worktree 격리 강화** — worktree로 격리된 세션과 그 subagent가 메인 체크아웃에 파괴적 git 명령을 실행할 수 있던 문제 수정. 이제 파일 편집과 Bash 격리가 모든 세션 유형에 적용된다.
- **백그라운드 작업의 훅 우회 차단** — 백그라운드 agent 작업(요약·압축·이름변경)에서 `PreToolUse` auto-allow 훅이 도구 제한을 우회하던 문제 수정.
- **`/usage-credits` 재요청 차단 해제** — Team·Enterprise에서 이전 요청이 기각된 멤버에게 "이미 요청을 보냈다"고 표시돼 새 요청을 못 보내던 문제 수정.
- **HTTPS 프록시 뒤 연결 점검 수정** — 시작 시 연결 점검이 멈췄다 실패하던 문제 수정. 이제 API 요청과 같은 프록시 인식 전송을 쓰고 명확한 메시지로 타임아웃한다.
- **오탐 연결 종료 오류 제거** — 실제로 완료된 응답에 "Connection closed mid-response" 오류가 뜨던 문제 수정.
- **`/usage` MCP 과대집계 수정** — 서버 사용량이 이제 그 서버의 도구 결과를 실제로 소비한 요청만 반영한다. 호출 이후 모든 턴에 배분하지 않는다.
- **PR 링크 누락 수정** — 브랜치 push 이후(및 GitHub REST API 경유) 생성된 PR에 세션이 연결되지 않던 문제 수정.
- **org 제한 모델 별칭 강등 수정** — `model: opus` 류 subagent·teammate 별칭이 부모 모델로 떨어지지 않고, 해당 계열에서 org가 허용한 최신 모델로 단계 하향되도록 수정.
- **커스텀 게이트웨이 idle 타임아웃 수정** — 서버 keep-alive ping이 오는데도 `ANTHROPIC_BASE_URL` 커스텀 게이트웨이에서 스트림 idle 타임아웃이 발동하던 문제 수정.
- **connector 인증 오탐 수정** — 세션 토큰이 무효일 때 claude.ai connector가 인증 필요로 잘못 표시되던 문제 수정. 이제 `/login` 안내를 보여준다.
- **제거된 도구의 오류 표시** — 로컬에서 더는 쓸 수 없는 도구(예: MCP 서버 제거 후)의 오류가 표시되지 않던 문제 수정.
- **`SendMessage` 긴 요약 거부 수정** — 긴 요약을 거부하지 않고 잘라내도록 변경. 글자 수 제한으로 전송이 실패하지 않는다.
- **subagent effort 라벨 수정** — subagent 트랜스크립트의 스피너 effort 라벨이 세션 effort가 아닌 subagent 자신의 `effort:` 설정을 표시하도록 수정.
- **호스트 모델 선택 키 우선 적용** — `CLAUDE_CODE_PROVIDER_MANAGED_BY_HOST` 설정 시, 호스트 모델 선택 키가 낡은 `managed-settings.json`보다 우선하도록 수정.
- **파일 감시자 크래시 수정** — 파일 감시자가 파일시스템 오류를 만나거나 해제 중 발생하던 드문 크래시 수정.
- **스크린리더 백스페이스 수정** — `--ax-screen-reader` 모드에서 백스페이스마다 입력 줄 전체를 다시 읽던 문제 수정. 이제 줄 끝 삭제는 삭제된 글자만 읽는다.
- **auto 모드 안전성 개선** — `SendMessage`로 다른 agent 세션에 보내는 메시지를 전송 전 권한 분류기가 평가한다.
- **skill 거부 안내 개선** — `disable-model-invocation` skill을 호출하려 하면, workflow를 흉내 내지 말고 사용자에게 실행을 요청하도록 안내한다.
- **diff 뷰 raw git blob 사용** — `/diff`·Remote Control 워크스페이스 diff·웹 세션 파일 편집 diff가 워크스페이스 diff 드라이버와 textconv를 무시하고 raw git blob 콘텐츠를 쓰도록 개선.
- **Remote Control 자동 시작 제한** — repo-로컬 설정(`.claude/settings.json`·`.claude/settings.local.json`)으로는 더 이상 켤 수 없다(끄는 건 가능). 사용자 스코프에서 `/config`로 켠다.
- **ultraplan 기능 제거**

## 🔑 이번 버전의 핵심 키워드
**"격리와 훅의 빈틈을 메운 안정화 릴리스"** — worktree·백그라운드 agent·프록시 경로의 안전 구멍을 닫고 사용량·연결 표시 오류를 바로잡았다.

---

# 📜 원문 (한글 번역본)

> 원문 ChangeLog를 원래 순서 그대로 한 줄도 빠짐없이 번역한 문서입니다.

- worktree로 격리된 세션과 그 subagent가 메인 체크아웃을 상대로 파괴적 git 명령을 실행할 수 있던 문제 수정. 이제 격리가 모든 세션 유형에서 파일 편집과 Bash에 적용된다.
- 백그라운드 agent 작업(요약, 압축, 이름변경)에서 `PreToolUse` auto-allow 훅이 도구 제한을 우회하던 문제 수정.
- Team·Enterprise에서 이전 요청이 기각된 멤버에게 `/usage-credits`가 "이미 usage credit 요청을 보냈다"고 표시해 새 요청 전송을 막던 문제 수정.
- HTTPS 프록시 뒤에서 시작 시 연결 점검이 멈췄다가 실패하던 문제 수정. 이제 API 요청과 동일한 프록시 인식 전송을 사용하고 명확한 메시지와 함께 타임아웃한다.
- 실제로 완료된 응답에 "Connection closed mid-response" 오류가 보고되던 문제 수정.
- `/usage`가 MCP 서버에 사용량을 과다 배분하던 문제 수정: 서버의 몫이 이제 그 서버의 도구 결과를 실제로 소비한 요청만 반영하며, 그 서버를 호출한 이후의 모든 턴을 반영하지 않는다.
- 브랜치가 push된 뒤(GitHub REST API 경유 포함) 생성된 pull request에 세션이 연결되지 않던 문제 수정.
- org 제한된 `model: opus` 류 subagent·teammate 계열 별칭이 부모 모델로 떨어지지 않고, 해당 계열에서 org가 허용한 최신 모델로 단계 하향되도록 수정.
- 서버 keep-alive ping이 실제로 도착하는데도 커스텀 `ANTHROPIC_BASE_URL` 게이트웨이에서 스트림 idle 타임아웃이 발동하던 문제 수정.
- 세션 토큰이 무효일 때 claude.ai connector가 인증이 필요하다고 잘못 표시되던 문제 수정 — 이제 `/login` 안내를 보여준다.
- 로컬에서 더 이상 사용할 수 없는 도구(예: MCP 서버 제거 후)의 도구 오류가 표시되지 않던 문제 수정.
- `SendMessage`가 긴 요약을 거부하던 문제 수정 — 이제 잘라내므로 글자 수 제한으로 전송이 실패하지 않는다.
- subagent 트랜스크립트 뷰의 스피너 effort 라벨이 subagent 자신의 `effort:` 설정 대신 세션의 effort 레벨을 표시하던 문제 수정.
- 파일 감시자가 파일시스템 오류를 만나거나 파일 감시자 해제 중 발생하던 드문 크래시 수정.
- `--ax-screen-reader` 모드에서 백스페이스마다 스크린리더가 입력 줄 전체를 다시 읽던 문제 수정 — 이제 줄 끝 삭제는 삭제된 글자만 출력한다.
- `CLAUDE_CODE_PROVIDER_MANAGED_BY_HOST`가 설정된 경우 호스트 모델 선택 키가 낡은 디스크상의 `managed-settings.json`보다 우선하지 않던 문제 수정.
- auto 모드 안전성 개선: `SendMessage`로 다른 agent 세션에 보내는 메시지가 이제 전송 전 권한 분류기에 의해 평가된다.
- Claude가 `disable-model-invocation` skill을 호출하려 할 때의 거부 개선: 이제 Claude는 workflow를 복제하지 말고 사용자에게 skill 실행을 요청하도록 안내받는다.
- Claude Code on the web 세션의 `/diff` 뷰, Remote Control 워크스페이스 diff, 파일 편집 diff가 워크스페이스에 설정된 diff 드라이버와 textconv를 무시하고 raw git blob 콘텐츠를 사용하도록 개선.
- Remote Control 자동 시작을 변경해 repo-로컬 설정(`.claude/settings.json` 또는 `.claude/settings.local.json`)으로는 더 이상 켤 수 없게 함(끄는 것은 여전히 가능); 사용자 스코프에서 `/config`로 켠다.
- ultraplan 기능 제거.

---

## 🎯 챌린지

이번 버전에서 내 환경에 적용해볼 만한 항목입니다.

### 1. 커스텀 subagent에 `effort:` 명시
- **파일**: `~/.claude/agents/*.md`
- **근거**: 이번 버전이 subagent 스피너가 세션 effort가 아닌 자신의 `effort:` 설정을 표시하도록 고쳤다(#13). 지금은 전역 `effortLevel: high`만 있고 agent별 명시가 없어, subagent가 어떤 effort로 도는지 트랜스크립트에서 불명확하다. 각 agent frontmatter에 `effort:`를 박아두면 의도한 effort가 확실히 적용되고 표시된다.
- **난이도**: ★☆☆ (약 5분)

### 2. `deploy-guard.sh` 백그라운드 작업 대응 점검
- **파일**: `~/.claude/hooks/deploy-guard.sh`
- **근거**: 백그라운드 agent 작업에서 `PreToolUse` 훅이 도구 제한을 우회하던 버그가 수정됐다(#2). 이제 deploy-guard 훅이 요약·압축·이름변경 같은 백그라운드 작업에서도 실행되므로, 훅이 push가 아닌 무해한 Bash 호출까지 오탐·차단하지 않는지 입력 파싱(브랜치·명령 매칭)을 한 번 확인해두면 안전하다.
- **난이도**: ★★☆ (약 15분)

### 3. Remote Control 활성화 스코프 정리
- **파일**: `~/.claude/settings.json`
- **근거**: repo-로컬 설정으로는 Remote Control을 더 이상 켤 수 없고 사용자 스코프에서 `/config`로만 켜도록 바뀌었다(#20). Remote Control을 쓸 계획이면 사용자 스코프 설정에 의도를 명시하고, 안 쓸 거면 repo 설정에 남은 자동 시작 흔적을 정리해 혼동을 없앤다.
- **난이도**: ★☆☆ (약 10분)
