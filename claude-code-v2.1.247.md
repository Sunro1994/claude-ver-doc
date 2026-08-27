# Claude Code v2.1.247

> 작성일: 2026-08-28

---

# 📋 요약본

## 🎉 신기능 (5건)
- **`SendFeedback` 도구** — 세션 중 문제가 생기면 Claude가 피드백 리포트 초안을 작성한다. 사용자가 `/feedback`에서 검토 후 전송한다. `feedbackDrafts` 설정으로 끌 수 있다.
- **`spinnerTipsOverride` 확장** — `{id, text, cooldownSessions, priority}` 항목과 `tipsFile`, `label`이 추가됐다. 조직이 내장 팁과 함께 자체 팁을 돌려 쓸 수 있다.
- **Bash 권한 프롬프트에 auto 모드 안내** — 권한 프롬프트에 auto 모드를 알려주는 팁이 붙었다. "Yes, and switch to auto mode" 옵션으로 한 번에 전환한다.
- **`/claude-api cost-optimize`** — 기존 프로젝트의 Claude API 지출을 프로파일링하고 비용 레버(캐싱, 토큰 위생, 배치, effort, 모델 선택)를 한 번에 하나씩 측정하며 조정한다.
- **`/claude-api` 스킬에 Admin API 커버리지 추가** — 조직 멤버, 초대, 워크스페이스, API 키, rate limit 리포트, workload identity federation, CMEK를 다룬다.

## 🛠️ 개선/수정 (28건)
- **히스토리 검색·메뉴 방향키 오작동 수정** — 방향키+Enter를 빠르게 누르면 한 줄 위 항목이 선택되던 문제. 히스토리 검색, `/config`, `/mcp`, `/skills`, 백그라운드 작업, `/model`에 적용.
- **서브에이전트 모델 404 사망 수정** — 첫 호출에서 모델 404가 나면 죽던 문제. 이제 세션의 fallback 모델 체인을 쓰고, 부모에게 반환되는 에러에 에러 타입·상태·request id·모델이 포함된다.
- **대용량 에러 출력로 인한 세션 잠김 수정** — hook이나 백그라운드 에이전트가 메가바이트 단위 에러를 뿜으면 대화가 넘쳐 "Prompt is too long"으로 세션이 막히던 문제.
- **비라틴 키보드 레이아웃 Ctrl 단축키 수정** — kitty 프로토콜 터미널에서 키릴 문자 등 비라틴 레이아웃일 때 Ctrl 단축키가 안 먹던 문제.
- **마우스 리포트 텍스트 삽입 수정** — 이스케이프 접두사 직후 마우스 리포트가 읽기 경계에 걸쳐 들어오면 `<35;150;7M` 같은 텍스트가 프롬프트에 박히던 문제.
- **Bash 샌드박스가 `~/.claude/settings.json` 심볼릭 링크를 지우던 문제 수정** — nix/home-manager, stow 같은 dotfile 관리 도구가 만든 심볼릭 링크가 샌드박스 쓰기 영역 밖을 가리킬 때 명령 후 정리 단계에서 삭제되던 문제.
- **`/terminal-setup`의 Zed `keymap.json` 덮어쓰기 수정** — 전체를 덮어쓰지 않고 키바인딩만 병합한다.
- **`/rename` 무언의 성공 표시 수정** — 세션 레지스트리 갱신 실패 시 조용히 성공으로 표시하던 문제. 이제 다른 세션에는 옛 이름이 남을 수 있다고 알린다.
- **`--agent`로 시작한 세션의 `/compact` 수정** — `/compact`와 "Summarize from here"가 대화 자신의 시스템 프롬프트가 아닌 기본 시스템 프롬프트로 요약하던 문제.
- **`claude agents`의 "opening…" 무한 대기 수정** — 터미널 호스트 프로세스가 죽은 백그라운드 세션이 계속 "opening…"으로 남던 문제. 이제 수 초 내에 사유와 함께 실패 처리되고 Enter로 재시작한다.
- **hook·백그라운드 작업 출력 파일 기록 실패 시 메모리 무한 증가 수정** — 이제 출력이 어디서 유실됐는지 파일에 기록한다.
- **SSH 환경의 `/install-github-app` 수정** — 복사 단축키가 항상 성공했다고 주장하는 대신 로그인 URL을 어떻게 복사했는지 알린다. 브라우저를 열 수 없으면 URL이 즉시 표시된다.
- **포그라운드에서 넘어온 셸 명령 로그 수정** — 백그라운드 세션에서 끝날 때 내부 에러를 남기거나 오해를 부르는 `[exited with code -1]` 줄을 보이던 문제.
- **버전 없는 마켓플레이스 플러그인 캐시 삭제 수정** — 두 번째 scope 설치 시 live 캐시 디렉터리가 삭제·재생성되며 그걸 쓰던 실행 중 세션이 깨질 수 있던 문제.
- **Remote Control 세션의 diff 미보고 수정** — `/remote-control`로 시작한 세션이 연결된 클라이언트에 working-tree diff를 보고하지 않던 문제.
- **self-hosted 러너 세션의 조기 `running` 보고 수정** — Claude Code가 시작되기 전에 `running`으로 보고해 데스크톱 앱에서 "Claude is waiting for your input" 알림이 조기 발생하던 문제.
- **첫 실행 설정 연결 실패 수정** — managed settings가 Claude apps 게이트웨이 로그인을 설정했고 Anthropic 엔드포인트에 닿을 수 없을 때 "Unable to connect to Anthropic services"로 종료되던 문제.
- **클라우드 세션 권한 모드 표시 지연 수정** — 메시지 전송 직후 모드를 바꾸면 이전 권한 모드가 표시되던 문제. Claude Code 웹, 데스크톱, 모바일 앱 대상.
- **클라우드 세션 침묵 수정** — 백그라운드 에이전트·셸·모니터가 도는 중에 턴 사이에서 컨테이너가 재시작하면 세션이 조용해지던 문제. 이제 재개된 세션이 유실된 작업을 보고한다.
- **플러그인 마켓플레이스 하드닝** — 제어 문자나 보이지 않는 문자가 든 이름은 거부한다. `/plugin`과 `claude plugin` 출력의 마켓플레이스 제공 텍스트는 escape-safe 처리된다.
- **MCP 연결 실패를 Claude에게 알림** — Bedrock, Vertex, Foundry 세션과 텔레메트리를 끈 세션에서, MCP 서버 연결 실패 시 도구가 없다고 결론짓지 않도록 실패 사실을 알린다.
- **Sonnet 5 auto-compact 창을 1M 전체로 변경** — 1M 창 세션의 auto-compact 시점이 약 934K에서 약 967K 토큰으로 올라갔다.
- **세션 간 피어 메시지 기본 접힘** — `Message from @<sender>: <first line>` 한 줄 미리보기로 접힌다. Ctrl+O로 전체를 편다.
- **마크다운 터미널 하이퍼링크 제한** — 네트워크·automounter 경로를 가리키거나, 제어 문자를 포함하거나, 보이지 않는 문자로 시작하는 링크 대상은 일반 텍스트로 렌더링된다.
- **프롬프트 푸터 PR 배지 재검사 생략** — 마지막 검사가 1분 이내면 터미널 재포커스 시 GitHub 재검사를 건너뛴다.
- **analytics 시작부터 비활성** — managed settings가 게이트웨이 로그인을 강제하거나 커스텀 OAuth 배포가 설정된 경우, 로그인 후가 아니라 시작 시점부터 꺼진다.
- **게이트웨이 로그인 요청에 Claude Code 식별자 추가** — `surface=claude_code` device-authorization 파라미터와 `claude-code/<version>` User-Agent를 보낸다.
- **조직 로그인 강제 정책 강화** — 관리자의 managed settings를 읽을 수 없으면, 호스트 제공 설정이나 사용자별 Windows 레지스트리 설정이 있어도 시작 시 종료한다.

## 🔑 이번 버전의 핵심 키워드
**"조용한 실패를 말하게 만든 버전"** — 서브에이전트 404, MCP 연결 실패, 출력 유실, 컨테이너 재시작, `/rename` 실패까지 — 그동안 침묵하거나 거짓 성공을 보고하던 경로들이 전부 사유를 말하게 바뀌었다.

---

# 📜 원문 (한글 번역본)

> 원문 ChangeLog를 원래 순서 그대로 한 줄도 빠짐없이 번역한 문서입니다.

- `SendFeedback` 도구 추가: 세션에서 문제가 생기면 Claude가 피드백 리포트를 작성해 두고, 사용자가 `/feedback`에서 검토 후 전송한다 (`feedbackDrafts` 설정으로 끄기).
- `spinnerTipsOverride`에 `{id, text, cooldownSessions, priority}` 항목과 `tipsFile`, `label` 추가. 조직이 내장 팁과 함께 자체 팁을 돌려 쓸 수 있다.
- Bash 권한 프롬프트에 auto 모드를 안내하는 팁 추가. 키 한 번으로 되는 "Yes, and switch to auto mode" 옵션 포함.
- `/claude-api cost-optimize` 추가: 기존 프로젝트의 Claude API 지출을 프로파일링하고 비용 레버(캐싱, 토큰 위생, 배치, effort, 모델 선택)를 한 번에 하나씩 측정하며 조정한다.
- `/claude-api` 스킬에 Admin API 커버리지 추가 (조직 멤버, 초대, 워크스페이스, API 키, rate limit 리포트, workload identity federation, CMEK).
- 히스토리 검색, `/config`, `/mcp`, `/skills`, 백그라운드 작업, `/model`에서 빠른 방향키+Enter 조합이 이동한 줄이 아니라 그 위 줄에 적용되던 문제 수정.
- 서브에이전트가 첫 호출 모델 404에서 죽던 문제 수정: 이제 세션의 fallback 모델 체인을 사용하고, 부모에게 반환되는 에러에 에러 타입·상태·request id·모델이 포함된다.
- hook이나 백그라운드 에이전트가 메가바이트 단위 에러 출력을 뿜어 대화를 넘치게 하고 "Prompt is too long"으로 세션을 막아버리던 문제 수정.
- kitty 프로토콜 터미널에서 비라틴(예: 키릴) 키보드 레이아웃일 때 Ctrl 단축키가 동작하지 않던 문제 수정.
- 이스케이프 접두사 직후 마우스 리포트가 읽기 단위에 걸쳐 도착할 때 `<35;150;7M` 같은 텍스트가 프롬프트에 삽입되던 문제 수정.
- Bash 샌드박스의 명령 후 정리 작업이, 샌드박스 쓰기 영역 밖을 가리키도록 재지정된 dotfile 관리(nix/home-manager, stow) `~/.claude/settings.json` 심볼릭 링크를 삭제하던 문제 수정.
- `/terminal-setup`이 Zed `keymap.json` 전체를 덮어쓰지 않고 자신의 키바인딩만 병합하도록 수정.
- `/rename`이 세션 레지스트리를 갱신하지 못했는데도 조용히 확인 처리하던 문제 수정. 이제 다른 세션에는 옛 이름이 그대로 보일 수 있다고 알린다.
- `--agent`로 시작한 세션에서 `/compact`와 "Summarize from here"가 대화 자체의 시스템 프롬프트가 아닌 기본 시스템 프롬프트로 요약하던 문제 수정.
- 터미널 호스트 프로세스가 죽은 뒤 백그라운드 세션이 `claude agents`에서 영원히 "opening…"으로 표시되던 문제 수정. 이제 해당 행은 수 초 내에 사유와 함께 실패 처리되고, Enter로 재시작한다.
- hook이나 백그라운드 작업의 출력 파일을 쓸 수 없을 때 메모리가 무한히 늘어나던 문제 수정. 이제 해당 파일에 출력이 어디서 유실됐는지 기록된다.
- SSH 환경의 `/install-github-app` 수정: 복사 단축키가 항상 성공을 주장하는 대신 로그인 URL을 어떤 방식으로 복사했는지 알리고, 브라우저를 열 수 없을 때 URL이 즉시 표시된다.
- 포그라운드에서 이어진 셸 명령이 백그라운드 세션에서 종료될 때 내부 에러를 로깅하거나 오해를 부르는 `[exited with code -1]` 줄을 보이던 문제 수정.
- 버전이 없는 마켓플레이스 플러그인의 live 캐시 디렉터리가 두 번째 scope 설치 시 삭제·재생성되어, 그것을 쓰던 실행 중 세션을 방해할 수 있던 문제 수정.
- `/remote-control`로 시작한 Remote Control 세션이 연결된 클라이언트에 working-tree diff를 보고하지 않던 문제 수정.
- self-hosted 러너 세션이 Claude Code 시작 전에 `running`으로 보고해, Claude 데스크톱 앱에서 "Claude is waiting for your input" 알림이 조기에 뜰 수 있던 문제 수정.
- managed settings가 Claude apps 게이트웨이 로그인을 설정했고 Anthropic 엔드포인트에 도달할 수 없을 때, 첫 실행 설정이 "Unable to connect to Anthropic services"로 종료되던 문제 수정.
- 클라우드 세션(Claude Code 웹, 데스크톱·모바일 앱)에서 메시지를 보낸 직후 모드를 전환하면 이전 권한 모드가 표시되던 문제 수정.
- 백그라운드 에이전트·셸·모니터가 아직 실행 중인 상태에서 턴 사이에 세션 컨테이너가 재시작하면 클라우드 세션이 응답을 멈추던 문제 수정 — 재개된 세션이 유실된 작업을 보고한다.
- 플러그인 마켓플레이스 하드닝 개선: 제어 문자나 보이지 않는 문자가 포함된 이름은 거부되고, `/plugin` 및 `claude plugin` 출력의 마켓플레이스 제공 텍스트는 escape-safe 하게 처리된다.
- Bedrock, Vertex, Foundry 세션(및 텔레메트리를 끈 모든 세션) 개선: 설정된 MCP 서버가 연결에 실패하면 Claude에게 그 사실을 알려, 해당 도구가 존재하지 않는다고 결론짓지 않게 한다.
- Sonnet 5의 기본 auto-compact 창을 전체 1M 컨텍스트로 변경. 1M 창 세션은 이제 약 934K가 아니라 약 967K 토큰에서 auto-compact 된다.
- 세션 간 피어 메시지를 기본적으로 `Message from @<sender>: <first line>` 한 줄 미리보기로 접도록 변경. Ctrl+O로 전체 본문을 편다.
- 렌더링된 마크다운의 터미널 하이퍼링크 변경: 네트워크나 automounter 경로를 가리키거나, 제어 문자를 포함하거나, 보이지 않는 문자로 시작하는 링크 대상은 일반 텍스트로 렌더링된다.
- 프롬프트 푸터 PR 배지가 마지막 검사 후 1분이 지나지 않았으면 터미널 재포커스 시 GitHub 재검사를 건너뛰도록 변경.
- managed settings가 게이트웨이 로그인을 강제하거나 커스텀 OAuth 배포가 설정된 경우, analytics가 로그인 이후가 아니라 시작 시점부터 꺼지도록 변경.
- Claude apps 게이트웨이 로그인 요청이 Claude Code임을 식별하도록 변경 (`surface=claude_code` device-authorization 파라미터와 `claude-code/<version>` User-Agent).
- 조직 로그인 강제 정책을 변경: 관리자의 managed settings를 읽을 수 없으면 호스트 제공 설정이나 사용자별 Windows 레지스트리 설정이 있더라도 시작 시 종료한다.

---

## 🎯 챌린지

이번 버전에서 내 환경에 적용해볼 만한 항목입니다.

### 1. 서브에이전트 fallback 모델 체인 확인
- **파일**: `~/.claude/settings.json`
- **근거**: CLAUDE.md §5는 모든 subagent를 Opus로 지정한다. 이번 버전에서 첫 호출 404 시 세션 fallback 체인을 타도록 바뀌었으므로, 현재 `model`이 `claude-fable-5[1m]`인 상태에서 Opus 서브에이전트가 404를 만나면 어디로 떨어지는지 명시적으로 정해둘 값이 있다. `/model`로 fallback 설정을 확인하고 settings.json에 의도한 모델을 고정한다.
- **난이도**: ★☆☆ (약 10분)

### 2. Bash hook의 출력량 상한 걸기
- **파일**: `~/.claude/hooks/deploy-guard.sh`
- **근거**: hook이 대용량 에러를 뿜으면 세션이 "Prompt is too long"으로 막히던 문제가 이번에 수정됐지만, 근본 방어는 hook 쪽에 있다. `deploy-guard.sh`는 매 Bash 호출마다 실행되므로 출력을 `head -c` 등으로 잘라 상한을 두면 자기 세션을 스스로 막을 위험이 사라진다.
- **난이도**: ★☆☆ (약 10분)

### 3. `feedbackDrafts` 설정 명시
- **파일**: `~/.claude/settings.json`
- **근거**: `SendFeedback`이 새로 켜졌다. 세션 중 문제가 생기면 Claude가 피드백 초안을 만든다. 초안 작성 자체가 토큰을 쓰고 흐름을 끊으므로, 쓸지 말지를 기본값에 맡기지 말고 `feedbackDrafts`를 명시적으로 `true`/`false`로 박아둔다.
- **난이도**: ★☆☆ (약 5분)

### 4. `settings.json` 심볼릭 링크 여부 점검
- **파일**: `~/.claude/settings.json`
- **근거**: Bash 샌드박스 정리 작업이 dotfile 관리 심볼릭 링크를 삭제하던 버그가 수정됐다. 현재 `settings.json`이 실제 파일인지 심볼릭 링크인지 `ls -l`로 확인하고, 링크라면 이번 버전으로 올린 뒤 Bash 명령을 한 번 돌려 링크가 살아있는지 검증한다. 이 파일에는 hooks·statusLine·플러그인 설정이 전부 들어 있어 유실 비용이 크다.
- **난이도**: ★☆☆ (약 5분)
