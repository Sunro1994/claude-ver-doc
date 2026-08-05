# Claude Code v2.1.218

> 작성일: 2026-08-06

---

# 📋 요약본

## 🎉 신기능 (3건)
- **삭제 텍스트 스크린리더 안내** — `--ax-screen-reader` 모드에서 단어/줄 삭제(`Option+Delete`, `Ctrl+W`, `Cmd+Backspace`, `Ctrl+U`, `Ctrl+K`) 시 지워진 텍스트를 음성으로 안내한다.
- **fast mode 전환 알림** — `/config model=<x>` 또는 Remote Control로 모델을 바꿔 fast mode 상태가 달라지면 이를 알린다.
- **frontmatter 불리언 값 확장** — 스킬·플러그인 frontmatter에서 `true`/`false` 외에 `yes`/`no`/`on`/`off`/`1`/`0`(대소문자 무관)을 허용한다.

## 🛠️ 개선/수정 (33건)
- **`/code-review` 백그라운드화** — 리뷰가 백그라운드 subagent로 실행돼 대화창을 채우지 않고, 쌓아둔 slash 명령을 리뷰 대상으로 유지한다.
- **Windows `\u` 경로 손상 수정** — `C:\Users\unicorn` 같은 경로가 CJK 문자로 깨져 파일 접근 불가하던 문제 수정.
- **왼쪽 화살표 대화 폐기 수정** — 편집 직후 누르면 확인을 묻고, agent 뷰에서 Esc는 배경화한 대화로 복귀.
- **멀티라인 붙여넣기 `j` 붕괴 수정** — 붙여넣기 개행을 Ctrl+J로 인코딩하는 터미널에서 한 줄로 합쳐지던 문제 수정.
- **`/context` 토큰 사용량 오표시 수정** — 메시지 피커에서 compact 후 이전 값이 남던 문제 수정.
- **`/ultrareview` 서술형 인자 수정** — "review my auth changes" 같은 문구가 실패하지 않고 현재 브랜치 리뷰로 실행되며 문구는 결과 메모로 반영.
- **`/code-review ultra` 비대화형 수정** — 조용히 로컬 리뷰로 돌던 것을 클라우드 리뷰로 실행.
- **게이트웨이 비용 계측 수정** — Bedrock application-inference-profile ARN 등 설정 매핑 모델 ID를 설정된 모델 요율로 과금.
- **IDE 선택 mojibake 수정** — 긴 IDE 선택이 이모지 중간에서 잘릴 때 깨짐, 그리고 tool executor 오류가 조용히 사라지던 경우 수정.
- **엔진 teardown 경쟁 수정** — 유령 턴을 시작·방치하던 경쟁 상태 수정, close 후 밀려온 입력은 일관되게 거부.
- **가짜 "[Request interrupted by user]" 수정** — 중단된 tool 호출 뒤 발생하던 메시지와 짝 없는 `tool_use` 블록 잔존 문제 수정.
- **VoiceOver "new line" 오독 수정** — `--ax-screen-reader` 모드 입력 끝 공백을 "new line" 대신 제대로 읽음.
- **패널 커서 이동 수정** — 플러그인·설정 패널이 포커스 행으로 커서를 옮기지 않던 문제를 고쳐 스크린리더·확대기가 화살표 이동을 따라감.
- **깊은 트리 크래시 수정** — 깊게 중첩된 감시 디렉터리 삭제·이동, 깊은 UI 트리 렌더 시 스택 초과 크래시 수정.
- **PR 이벤트 유실 수정** — PR 생성·연결 직후 세션 종료 시 이벤트가 간헐 유실되던 문제 수정.
- **Bedrock 셋업 마법사 수정** — 분할 AWS 리전·프록시 전용 망의 assume-role 프로필 검증 실패 수정.
- **턴 시간 측정 수정** — 시스템 시계 조정 후 음수·오측정되던 것을 monotonic 시계로 계측.
- **MCP 인증 알림 과다집계 수정** — claude.ai에서 연결 안 된 커넥터를 과다 집계하던 "N MCP servers need authentication" 문구 수정.
- **프롬프트 히스토리 유실·중복 수정** — 히스토리 쓰기 경쟁·실패 시 항목이 누락·중복되던 문제 수정.
- **재시도 루프·`Ctrl+B` 캡 수정** — context overflow 후 동일 요청 재전송 루프 수정, `Ctrl+B` 배경화에 다른 경로와 동일한 background-shell 캡 적용.
- **agent frontmatter hook 신뢰 수정** — hook이 자기 폴더의 workspace 신뢰를 요구하도록 해 미신뢰 폴더 실행 차단.
- **fork 세션 계보 유실 수정** — headless·SDK 세션에서 compaction 후 계보가 사라지던 문제 수정.
- **재개 세션 실패·크래시 수정** — 잘못된 delta 첨부가 히스토리에 있으면 매 턴 실패·재개 크래시하던 문제 수정.
- **`/ultrareview` 오류 피드백 개선** — 잘못된 인자를 그대로 재시도하지 않고 교정할 수 있게 개선.
- **auto 모드 개선** — dangerous-rm·background-`&`·의심 Windows 경로 검사가 권한 대화 대신 auto-mode 분류기로 판정.
- **IDE 상호작용 샌드박스 개선** — IDE 상호작용에 대한 샌드박스 명령 제약 개선.
- **신뢰 대화 개선** — 신뢰 부여가 적용되는 저장소 루트를 이름으로 명시.
- **`/deep-research` 수동 실행화** — 수동 호출 시에만 시작, Claude가 스스로 실행하지 않음.
- **plan 모드 auto 개선** — 정적 분석이 읽기 전용임을 증명 못하는 Bash를 묻지 않고 auto-mode 분류기가 판정.
- **서버 관리 설정 개선** — 무해한 기능·비용 토글은 설정 승인 프롬프트를 띄우지 않음.
- **agent 이름 `:` 거부** — 플러그인 네임스페이싱 예약 문자 `:`을 이름에 못 쓰게 거부.
- **`context: fork` 스킬 기본 백그라운드화** — 기본 백그라운드 실행, 스킬별 `background: false`로 해제 가능.
- **remote 세션 heartbeat 수정** — worker 교체 후에도 거부된 요청을 몇 초마다 영원히 재시도하던 문제 수정.

## 🔑 이번 버전의 핵심 키워드
**"리뷰·리서치는 백그라운드로, 접근성·경로·재개 안정성은 대거 보강"** — `/code-review`·fork 스킬을 백그라운드로 돌리고 스크린리더·Windows 경로·세션 재개 결함을 폭넓게 손본 안정화 릴리스.

---

# 📜 원문 (한글 번역본)

> 원문 ChangeLog를 원래 순서 그대로 한 줄도 빠짐없이 번역한 문서입니다.

- `/code-review`를 백그라운드 subagent로 실행하도록 변경해, 리뷰 작업이 대화를 채우지 않고 쌓아둔 slash 명령을 리뷰 대상으로 유지한다.
- `--ax-screen-reader` 모드에서 단어·줄 삭제(`Option+Delete`, `Ctrl+W`, `Cmd+Backspace`, `Ctrl+U`, `Ctrl+K`) 시 삭제된 텍스트를 스크린리더로 안내하는 기능 추가.
- `C:\Users\unicorn`처럼 `\u` 접두 세그먼트가 있는 Windows 경로가 tool 입력에서 CJK 문자로 손상돼 해당 파일에 접근 불가하던 문제 수정.
- 왼쪽 화살표 키가 되돌리기 없이 대화를 폐기하던 문제 수정: 편집 직후 누르면 확인을 묻고, agent 뷰에서 Esc는 배경화한 대화로 복귀한다.
- 붙여넣은 개행을 Ctrl+J로 인코딩하는 터미널에서 멀티라인 붙여넣기가 개행 대신 `j`로 한 줄에 합쳐지던 문제 수정.
- 메시지 피커에서 compact한 뒤 `/context`가 compact 이전의 오래된 토큰 사용량을 보고하던 문제 수정.
- "review my auth changes" 같은 서술형 인자에서 `/ultrareview`가 실패하던 문제 수정 — 이제 현재 브랜치 리뷰를 실행하고 해당 문구는 findings에 메모로 적용된다.
- 비대화형 세션에서 `/code-review ultra`가 조용히 로컬 리뷰를 실행하던 문제 수정 — 이제 클라우드 리뷰를 실행한다.
- 게이트웨이 지출 계측이 Bedrock application-inference-profile ARN 및 기타 설정 매핑 업스트림 모델 ID를 설정된 모델의 요율로 과금하도록 수정.
- 긴 IDE 선택이 이모지 중간에서 잘릴 때의 mojibake, 그리고 tool executor 오류가 조용히 누락될 수 있던 경우 수정.
- 유령 턴을 시작하고 방치할 수 있던 엔진 teardown 경쟁 상태 수정, close 이후 밀려온 입력이 일관되게 거부되도록 처리.
- 중단된 tool 호출 이후의 가짜 "[Request interrupted by user]" 메시지, 그리고 tool이 응답 중 중단됐을 때 transcript에 남던 짝 없는 `tool_use` 블록 수정.
- `--ax-screen-reader` 모드에서 VoiceOver가 입력 끝에서 타이핑된 공백을 반향하지 않고 "new line"이라 읽던 문제 수정.
- 플러그인·설정 패널이 포커스된 행으로 터미널 커서를 옮기지 않던 문제 수정 — 스크린리더·확대기가 화살표 이동을 따라갈 수 있게 함.
- 깊게 중첩된 감시 디렉터리 트리가 삭제·이동될 때, 그리고 깊게 중첩된 UI 트리를 렌더할 때의 크래시(maximum call stack exceeded) 수정.
- PR 생성·연결 직후 세션이 종료될 때 pull request 이벤트가 간헐적으로 유실되던 문제 수정.
- 분할된 AWS 리전과 프록시 전용 네트워크에서 assume-role 프로필에 대한 Bedrock 셋업 마법사의 프로필 검증 실패 수정.
- 시스템 시계 조정 이후 드물게 음수·부정확하던 턴 소요 시간 측정을 monotonic 시계로 계측해 수정.
- claude.ai에서 연결되지 않은 커넥터를 과다 집계하던 "N MCP servers need authentication" 시작 알림 수정.
- 히스토리 쓰기가 경쟁하거나 실패할 때 프롬프트 히스토리 항목이 누락·중복되던 문제 수정.
- context-overflow 오류 뒤 큰 thinking budget으로 동일한 가망 없는 요청을 재전송하던 재시도 루프 수정; `Ctrl+B` 배경화가 다른 경로와 동일한 background-shell 캡을 적용하도록 함.
- 미신뢰 폴더에서 agent frontmatter hook이 실행되던 문제 수정: 이제 hook은 agent 파일 자신의 폴더가 workspace 신뢰를 수락했을 것을 요구한다.
- headless·SDK 세션에서 compaction 후 fork-session 계보가 유실되던 문제 수정.
- 히스토리에 잘못된 형식의 delta 첨부가 있을 때 재개된 세션이 매 턴 실패하거나 재개 시 크래시하던 문제 수정.
- 잘못된 인자를 그대로 재시도하지 않고 Claude가 교정할 수 있도록 `/ultrareview` 오류 피드백 개선.
- auto 모드 개선: dangerous-rm, background-`&`, 의심스러운 Windows 경로 검사가 더 이상 권한 대화를 열지 않고 auto-mode 분류기가 판정한다.
- IDE 상호작용에 대한 샌드박스 명령 제약 개선.
- 신뢰 부여가 적용되는 저장소 루트를 이름으로 명시하도록 신뢰 대화 개선.
- 수동 호출 시에만 시작하도록 `/deep-research` 변경; Claude가 스스로 실행하지 않는다.
- plan 모드에서 auto 사용 시, 정적 분석기가 읽기 전용임을 증명하지 못하는 Bash 명령에 대해 더 이상 묻지 않고 auto-mode 분류기가 판정하도록 변경.
- `/config model=<x>` 또는 Remote Control로 모델을 전환한 결과 fast mode가 바뀌면 이를 알리는 안내 추가.
- 서버 관리 설정 변경으로 무해한 기능·비용 토글이 더 이상 설정 승인 프롬프트를 유발하지 않도록 함.
- 플러그인 네임스페이싱에 예약된 `:`을 이름에 포함한 agent를 거부하도록 agent 마크다운 파일 변경.
- `context: fork` 스킬을 기본적으로 백그라운드에서 실행하도록 변경; 스킬별 `background: false`로 해제.
- 스킬·플러그인 frontmatter 불리언에 `true`/`false`와 함께 `yes`/`no`/`on`/`off`/`1`/`0`(대소문자 무관)을 허용 값으로 추가.
- worker가 교체된 뒤에도 remote 세션이 heartbeat를 계속 보내, 장수 데스크톱·IDE 프로세스가 거부된 요청을 몇 초마다 영원히 재시도하던 문제 수정.

---

## 🎯 챌린지

이번 버전에서 내 환경에 적용해볼 만한 항목입니다.

### 1. `context: fork` 스킬의 백그라운드 실행 정책 점검
- **파일**: `~/.claude/skills/*/SKILL.md`, `~/.claude/plugins/**/SKILL.md`
- **근거**: 이번 버전부터 `context: fork` 스킬은 기본 백그라운드로 돈다. `claude-changelog-sync` 등 fork 스킬은 진행을 눈으로 보며 돌리는 게 나을 수 있다. `grep -rl 'context: *fork'`로 대상을 찾고, 포그라운드 유지가 필요한 스킬 frontmatter에 `background: false`를 명시한다.
- **난이도**: ★☆☆ (약 10분)

### 2. 커스텀 에이전트 이름의 `:` 충돌 점검
- **파일**: `~/.claude/agents/*.md`
- **근거**: 이번 버전부터 이름에 `:`이 든 agent 파일은 거부된다(플러그인 네임스페이싱 예약). 모든 subagent를 Opus로 운용하는 환경에서 로드 실패는 downstream 실패로 번진다. agent md의 `name:` 값에 `:`이 있는지 점검하고 있으면 교체한다.
- **난이도**: ★☆☆ (약 5분)

### 3. `/deep-research` 자동 실행 중단 인지
- **파일**: (설정 변경 불필요 — 동작 확인)
- **근거**: `/deep-research`가 수동 호출 시에만 시작하도록 바뀌었다. 리서치가 필요할 때 Claude가 알아서 안 돌리므로, 이제 명시적으로 `/deep-research`를 불러야 한다. `deep-research` 스킬 보유 환경이라 워크플로우 인지만으로 충분.
- **난이도**: ★☆☆ (약 5분)

### 4. 스킬 frontmatter 불리언 표기 표준화
- **파일**: `~/.claude/skills/*/SKILL.md`
- **근거**: frontmatter 불리언이 `yes`/`no`/`on`/`off`/`1`/`0`도 허용된다. 여러 스킬을 운용 중이라 표기가 혼재할 수 있으니, `true`/`false`로 통일해 가독성·일관성을 확보한다(선택적 정리 작업).
- **난이도**: ★★☆ (약 10~20분)
