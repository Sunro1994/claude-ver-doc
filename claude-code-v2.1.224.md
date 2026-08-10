# Claude Code v2.1.224

> 작성일: 2026-08-11

---

# 📋 요약본

## 🎉 신기능 (6건)
- **셀프 호스팅 실행 환경** — `claude self-hosted-runner` 명령으로 내 머신이나 컨테이너를 Claude Code web·mobile·desktop 세션의 실행 장소로 바꾼다. Team·Enterprise 플랜 전용.
- **`archive` 플러그인 소스** — git·npm 없이 HTTPS로 받은 zip에서 플러그인을 설치한다. SHA-256 핀 고정을 선택적으로 걸 수 있다.
- **크로스 세션 `SendMessage`** — Claude Code 세션끼리 서로 메시지를 보낸다. 내 여러 머신에 걸쳐 동작하며 `ListAgents`로 상대 세션을 찾는다. macOS·Linux 지원.
  - 함께 추가된 `crossSessionInbound`·`dialogExpiry` 설정으로, 권한 우회(bypass) 상태로 도는 세션에 온 메시지는 승인을 받을 때까지 보류하고 그 외 세션엔 자동 전달한다.
- **`ANTHROPIC_BEDROCK_REGION_PREFIX` 환경변수** — Bedrock에서 `AWS_REGION`으로 유추한 프로필 대신 지정한 cross-region inference 프로필을 우선 쓴다.
- **샌드박스 자격증명 마스킹 옵션** — 구조화된 env 값용 `extract`·`onExtractNoMatch`, JWT를 이해하는 `decode: "jwt"` + `maskClaims`, AWS SigV4 재서명용 `awsPairs`·`sigv4`. `network.tlsTerminate`가 필요하고 user·managed·`--settings` 설정에서만 인정된다.
- **붙여넣기 제거 시 취소·확인 단계** — 사용할 수 없는 paste를 지우면서 명령 텍스트가 바뀌는 경우 확인을 거친다.

## 🛠️ 개선/수정 (24건)
- **긴 경로 세션 격리 수정** — 200자 넘는 프로젝트 경로가 같은 접두사로 잘려 다른 프로젝트의 세션 디렉터리로 연결되던 문제 수정. 세션 목록·이름변경·fork·삭제·`/resume`가 더는 프로젝트를 넘나들지 않는다.
- **`SendMessage` 거짓 성공 수정** — 상대 inbox 쓰기가 실패했는데 "Message sent"로 보고하던 문제 수정. 실패는 에러로 보고한다.
- **샌드박스 deny 우회 수정** — `denyRead: "~/.aws/"`처럼 끝에 슬래시를 붙여 쓴 파일시스템 거부 항목이 Linux·macOS에서 조용히 우회되던 문제 수정.
- **샌드박스 위반 사유 노출** — Bash 도구 결과에 위반 상세가 아예 안 나오던 문제 수정. 어떤 파일·네트워크 접근이 왜 막혔는지 모델이 본다.
- **턴 중간 MCP 연결 수정** — 턴 도중 붙은 MCP 도구가 이름도 모델에 알리지 않은 채 tool search용으로 미뤄지던 문제 수정.
- **플러그인 설치 기록 손상 수정** — 같은 플러그인을 여러 프로젝트에서 설치할 때 기록이 조용히 깨지던 문제 수정.
- **paste 복구 오류 수정** — 만료됐거나 placeholder 번호가 겹친 paste를 되살릴 때 엉뚱한 데이터가 붙거나 텍스트가 사라지던 문제 수정.
- **Wayland 클립보드 경합 수정** — 선택 즉시 복사가 클립보드에 도달하지 못하던 문제 수정. 두 번의 selection 쓰기가 더는 경합하지 않는다.
- **피드백 설문 transcript 공유 실패 노출** — 긴 세션에서 조용히 실패하던 것을 에러로 표시한다.
- **Remote Control 자동 시작 실패 수정** — 로그인 토큰이 낡은 콜드 스타트에서 "Remote credentials fetch failed"로 간헐 실패하던 문제 수정.
- **`(no content)` 빈 메시지 수정** — `/clear` 등 출력 없는 명령 뒤 Remote Control·SDK 클라이언트에 빈 메시지가 뜨던 문제 수정.
- **Remote Control 히스토리 유출 수정** — 서버 세션 만료 후 재생성된 세션에 이전 로컬 대화 기록이 업로드되던 문제 수정.
- **전체화면 scrollback 유지** — 압축을 반복해도 마지막 구간만이 아니라 압축 이전 전체 기록을 scrollback에 남긴다.
- **Remote Control 압축 표시** — 붙어 있는 web·mobile 클라이언트가 무음 대기 대신 압축 진행과 압축 경계를 본다. `/clear` 리셋도 클라이언트로 전파된다.
- **Remote Control 연결 실패 표시** — 8초 토스트로 끝나던 것을 상세 정보와 재연결 단축키가 있는 상시 표시로 바꿨다.
- **서브에이전트 200개 상한 제거** — 세션당 spawn 상한을 없앴다. 장시간 세션이 새 에이전트를 거부하지 않는다. 동시 실행·깊이 제한은 그대로.
- **managed settings 승인 반복 제거** — 조직 설정이 그대로면 재로그인·조직 전환 후 승인 프롬프트가 다시 뜨지 않는다.
- **피드백 설문 공유 범위 변경** — 동의하면 마지막 요청의 모델 설정도 함께 올라간다. 시스템 프롬프트(`CLAUDE.md` 지시 포함), 도구 정의, 모델 파라미터가 대상. 시크릿은 기존대로 가려지고, 용량이 크면 이 항목들이 먼저 빠진다.
- **Bash 도구 설명 변경** — 명령 출력이 모델에는 보이지만 사용자에게 확실히 보이지는 않는다는 점을 항상 명시한다.
- **paste placeholder 번호 재부여** — 입력에 반영될 때 번호를 다시 매긴다.
- **Remote Control 죽은 세션 정리** — 압축·`/resume` 후 새 세션이 생기면 낡은 서버 세션을 목록에 남기지 않고 보관 처리한다.
- **[VSCode] 연결 실패 표시 수정** — 연결이 실패했는데 Remote Control이 연결됨으로 보이던 문제 수정.
- **세션 resume 시 Remote Control 무단 재연결 수정** — 사용자가 껐는데 조용히 다시 붙던 문제 수정. `--resume`·SDK 호스트·VS Code 확장 해당.
- **[VSCode] `remoteControlAtStartup` 무시 수정** — 명시적으로 켰는데 세션이 이를 따르지 않던 문제 수정.

## 🔑 이번 버전의 핵심 키워드
**"세션이 서로 말하고, 내 머신이 실행 장소가 된다"** — 크로스 세션 메시징과 셀프 호스팅 러너로 Claude Code가 단일 세션 도구에서 벗어나고, 샌드박스 우회·경로 충돌 같은 격리 결함을 함께 막았다.

---

# 📜 원문 (한글 번역본)

> 원문 ChangeLog를 원래 순서 그대로 한 줄도 빠짐없이 번역한 문서입니다.

- 셀프 호스팅 환경 추가: `claude self-hosted-runner`로 내 머신이나 컨테이너를 Claude Code web·mobile·desktop 세션이 돌아갈 장소로 만든다. Team·Enterprise 플랜 대상
- `archive` 플러그인 소스 추가: git이나 npm 없이 HTTPS로 zip을 받아 플러그인을 설치한다. SHA-256 핀 고정 선택 가능
- 사용할 수 없는 paste를 제거해 명령 텍스트가 바뀌는 경우 취소·확인 단계 추가
- Bedrock용 `ANTHROPIC_BEDROCK_REGION_PREFIX` 환경변수 추가: `AWS_REGION`에서 유추한 것보다 지정한 cross-region inference 프로필을 우선한다
- `crossSessionInbound`·`dialogExpiry` 설정 추가: 권한 우회 상태로 실행 중인 세션에 온 크로스 세션 메시지는 승인 대기로 보류하고, 그 외 세션으로 가는 메시지는 자동 전달한다
- 샌드박스 자격증명 마스킹 옵션 추가: 구조화된 env 값을 위한 `extract`·`onExtractNoMatch`, JWT를 인식하는 `decode: "jwt"`와 `maskClaims`, AWS SigV4 재서명용 `awsPairs`·`sigv4`. 이 옵션들은 `network.tlsTerminate`가 필요하며 user·managed 또는 `--settings` 설정에서만 인정된다
- 크로스 세션 `SendMessage` 추가: Claude Code 세션끼리 메시지를 주고받을 수 있고, 내 어느 머신에서든 동작하며 `ListAgents`로 세션을 찾는다 (macOS·Linux)
- 200자가 넘는 긴 프로젝트 경로가 공유된 sanitized 접두사 아래에서 다른 프로젝트의 세션 디렉터리로 해석되던 문제 수정. 세션 목록·이름변경·fork·삭제와 `/resume`이 더는 프로젝트를 넘어가지 않는다
- 팀원 inbox 쓰기가 실제로 실패했는데도 `SendMessage`가 "Message sent"라고 보고하던 문제 수정. 전달 실패는 이제 에러로 보고된다
- 끝에 슬래시를 붙여 작성한 샌드박스 파일시스템 거부 항목(예: `denyRead: "~/.aws/"`)이 Linux·macOS에서 조용히 우회 가능하던 문제 수정
- 샌드박스 위반 상세가 Bash 도구 결과에 전혀 나타나지 않던 문제 수정. 이제 어떤 파일·네트워크 접근이 왜 거부됐는지 Claude가 볼 수 있다
- 턴 도중에 연결된 MCP 도구가 이름을 모델에 알리지 않은 채 tool search 대상으로 미뤄지던 문제 수정
- 같은 플러그인을 여러 프로젝트에서 설치할 때 플러그인 설치 기록이 조용히 손상되던 문제 수정
- 되살리거나 복원한 paste 내용이, 해당 paste가 만료됐거나 placeholder 번호가 충돌한 경우 간헐적으로 잘못된 데이터를 붙이거나 텍스트를 조용히 잃던 문제 수정
- Wayland에서 선택 즉시 복사(copy-on-select)가 클립보드에 도달하지 못하던 문제 수정. 두 번의 selection 쓰기가 더는 경합하지 않는다
- 긴 세션에서 피드백 설문의 transcript 공유가 조용히 실패하던 문제 수정. 실패한 공유는 성공 메시지 대신 에러를 표시한다
- 낡은 로그인 토큰으로 콜드 스타트할 때 Remote Control 자동 시작이 "Remote credentials fetch failed"로 간헐 실패하던 문제 수정
- `/clear` 등 출력이 없는 명령 뒤에 Remote Control·SDK 클라이언트가 빈 "(no content)" 메시지를 표시하던 문제 수정
- 서버 세션 만료 후 다시 만들어진 Remote Control 세션이 이전 로컬 대화 기록을 새 세션에 업로드하던 문제 수정
- 전체화면 모드 개선: 압축을 반복해도 가장 최근 구간만이 아니라 압축 이전 전체 기록을 scrollback에 유지한다
- Remote Control 개선: 붙어 있는 web·mobile 클라이언트가 조용한 멈춤 대신 압축 진행 상황과 압축 이후 경계를 본다. `/clear` 리셋도 붙어 있는 클라이언트로 전파된다
- Remote Control 개선: 연결 실패 시 8초짜리 토스트만 띄우는 대신, 상세 정보와 재연결 단축키가 있는 지속 실패 표시를 보여준다
- 세션당 서브에이전트 200개 spawn 상한 제거. 장시간 실행되는 세션이 더는 새 에이전트를 거부하지 않는다 (동시 실행·깊이 제한은 여전히 적용)
- managed settings 변경: 조직의 설정이 그대로라면 재로그인이나 조직 전환 후에 승인 프롬프트가 다시 나타나지 않는다
- 피드백 설문의 transcript 공유 변경: 동의하면 마지막 요청의 모델 설정도 함께 업로드된다 — 시스템 프롬프트(`CLAUDE.md` 지시 포함), 도구 정의, 모델 파라미터. 시크릿은 기존과 같이 가려지며, 공유 용량이 너무 크면 이 필드들이 가장 먼저 제외된다
- Bash 도구 설명 변경: 명령 출력이 모델에는 표시되지만 사용자에게는 확실히 표시되지 않는다는 점을 항상 명시한다
- 되살린 paste의 placeholder 번호를 입력에 반영될 때 다시 매기도록 변경
- Remote Control 변경: 압축이나 `/resume` 후 새 세션이 생성되면 죽은 세션을 목록에 남기는 대신 낡은 서버 세션을 보관 처리한다
- [VSCode] 연결이 실패한 뒤에도 확장이 Remote Control을 연결됨으로 표시하던 문제 수정
- 사용자가 Remote Control을 끈 뒤에도 세션 resume이 조용히 다시 연결하던 문제 수정 (`--resume`, SDK 호스트, VS Code 확장)
- [VSCode] `remoteControlAtStartup`을 명시적으로 켰을 때 세션이 이를 따르지 않던 문제 수정

---

## 🎯 챌린지

이번 버전에서 내 환경에 적용해볼 만한 항목입니다.

### 1. 샌드박스 deny 경로에 붙은 끝 슬래시 제거
- **파일**: `~/.claude/settings.json`
- **근거**: 이번 버전에서 `denyRead: "~/.aws/"`처럼 끝에 슬래시를 붙인 항목이 조용히 우회되던 버그가 고쳐졌다. 현재 `settings.json`에는 sandbox 블록이 없으니, 있다면 슬래시를 떼고 없다면 `denyRead`로 `~/.aws`·`~/.ssh`·`~/.claude/.credentials.json`을 막는 최소 설정을 추가한다. Deploy 정책상 시크릿 노출을 직접 확인하는 습관과 맞물린다.
- **난이도**: ★★☆ (약 15분)

### 2. 크로스 세션 메시지 수신 정책 명시
- **파일**: `~/.claude/settings.json`
- **근거**: `SendMessage`가 머신을 넘어 세션끼리 메시지를 보낼 수 있게 됐다. `skipAutoPermissionPrompt: true`로 쓰는 환경이라 외부 세션 메시지가 검토 없이 들어올 여지가 있다. `crossSessionInbound`를 승인 필요로 두고 `dialogExpiry`로 방치된 승인 대화가 쌓이지 않게 만료 시간을 정한다.
- **난이도**: ★☆☆ (약 10분)

### 3. 서브에이전트 상한 해제에 맞춰 병렬 dispatch 폭 재조정
- **파일**: `~/.claude/CLAUDE.md` (§7.2 병렬 실행)
- **근거**: 세션당 200개 spawn 상한이 사라져 장시간 세션에서 에이전트 거부가 없어졌다. §7.2는 병렬화 원칙만 있고 폭 기준이 없으니, "동시 실행·깊이 제한은 여전히 적용된다"는 사실과 한 fan-out의 권장 에이전트 수를 한 줄로 못박는다. §5의 Opus 단일 티어 규칙과 함께 두면 대규모 dispatch 시 판단이 흔들리지 않는다.
- **난이도**: ★☆☆ (약 10분)

### 4. 플러그인 설치 기록 손상 여부 점검
- **파일**: `~/.claude/plugins/` (설치 기록 파일)
- **근거**: 같은 플러그인을 여러 프로젝트에서 설치하면 기록이 조용히 깨지던 버그가 고쳐졌다. `settings.json`의 `enabledPlugins`에는 4개 마켓플레이스에서 온 8개 플러그인이 등록돼 있고 대부분 `false` 상태다. 이번 업데이트 후 활성 플러그인(`superpowers`)이 정상 로드되는지, 비활성 항목의 잔여 기록이 남아 있는지 한 번 확인하고 필요 없는 항목은 정리한다.
- **난이도**: ★★☆ (약 15분)
