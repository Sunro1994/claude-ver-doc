# Claude Code v2.1.232

> 작성일: 2026-08-15

---

# 📋 요약본

## 🎉 신기능 (10건)
- **Subagent forking 기본 활성화** — `subagent_type: "fork"` 서브에이전트가 전체 대화와 프롬프트 캐시를 그대로 물려받는다. 대화형 세션에서 teammate 가 아닌 에이전트 spawn 은 이제 기본으로 백그라운드 실행된다.
- **`@` 로 다른 Claude 세션 호출** — 프롬프트에 `@` 를 치면 다른 Claude 세션을 이름으로 멘션한다. Claude 가 `SendMessage` 로 해당 세션에 직접 전달한다.
- **`SendMessage` 이름 직접 전달** — 살아있는 세션 하나와 이름이 정확히 일치하면 ref 확인을 묻지 않고 바로 보낸다.
- **세션 이름 자동 중복 방지** — 한 머신의 대화형 세션은 이름이 겹치지 않는다. 이미 쓰는 이름으로 시작·변경하면 `name-word-word` 형태 변형을 붙이고 알려준다.
- **`/config` 신규 항목 2종** — "Dialog expiry" 와 "Messages from your other sessions"(다른 세션에서 오는 메시지 accept/hold/refuse) 행이 추가됐다.
- **GitLab 토큰 시크릿 마스킹** — `glrt-`, `gloas-`, `glptt-`, `glagent-`, `glimt-`, `glsoat-`, `glcbt-`, `glft-`, `glffct-` 계열을 가린다. 라우팅 가능한 `glpat-`/`gldt-` 토큰은 전체 마스킹. `glab` CLI 설정 저장소도 `gh` 와 동일한 샌드박스·자격증명 경로 보호를 받는다.
- **플러그인 마켓플레이스 GitLab 지원** — 중첩 서브그룹 포함 `gitlab.com` 저장소 URL 을 `github.com` 처럼 clone 한다. clone 인증 실패 안내가 실제 git 호스트 이름을 표시한다.
- **마켓플레이스 설정 키 별칭** — `additionalMarketplaces`, `allowedMarketplaces` 를 각각 `extraKnownMarketplaces`, `strictKnownMarketplaces` 의 별칭으로 받는다.
- **Gateway `desktop:` 오버레이 전체 설정 수용** — 손으로 나열한 11개 키 대신 출시된 모든 Desktop 설정을 받는다. 부팅 시 Desktop 자체 스키마로 검증하고, 모르는 키나 잘못된 값이면 부팅 실패.
- **`/advisor` 에 Fable 5 재등장** — Fable 접근 권한이 있는 조직에서 어드바이저로 제공된다. 사용 크레딧 동의는 `/model fable` 로 진행한다.

## 🛠️ 개선/수정 (33건)
- **Gateway 잘못된 정책 값 부팅 차단** — `managed.policies[].match.groups`·`admin.admin_groups` 의 빈 항목, 잘못된 `email_domain`(빈 값, `@`·공백·쉼표 포함)이 조용히 아무도 매칭 안 하거나 admin 권한을 주는 대신 부팅에서 실패한다.
- **엔터프라이즈 정책 `blockedMarketplaces`** — bare 저장소 URL 에 대한 url 타입 항목이 CLI 가 git clone 으로 분류할 때도 계속 차단한다.
- **PowerShell 권한 우회 수정** — 변수 기록 파라미터가 `$PSDefaultParameterValues` 를 조용히 덮어써 이후 명령의 파일 접근을 돌리던 문제를 막았다.
- **Windows 권한 우회 수정** — Git Bash 가 Cygwin 스타일 심볼릭 링크를 따라가고 경로 검증은 일반 파일로 보던 문제. 이제 그 링크를 통한 쓰기도 권한 승인이 필요하다.
- **중첩 git 저장소 신뢰 상속 수정** — 상위 디렉터리의 신뢰를 물려받지 않는다. 저장소마다 개별 신뢰 확인이 필요하다.
- **MCP 연결 30초 대기 수정** — 서버가 프로토콜 버전 probe 에 응답하지 않거나 잘못된 응답을 보낼 때 연결 타임아웃 전체를 기다리며 멈추던 문제를 고쳤다.
- **Remote Control 자격증명 격리** — 클라우드 세션 내부 브리지가 호스팅하는 Remote Control 세션이 그 세션의 트랜스크립트나 자격증명을 물려받던 문제를 고쳤다.
- **Remote Control 세션 재연결** — Claude Desktop·IDE 에서 시작한 세션이 로컬 세션을 resume 할 때마다 claude.ai 에 새 세션으로 뜨던 문제. 이제 기존 세션에 다시 붙는다.
- **유휴 Remote Control 세션 도달 불가 수정** — 새로 붙은 클라이언트에게 연결 불가로 보이던 문제를 고쳤다.
- **Remote Control 브리지 히스토리 복원** — 세션 워커가 재시작될 때 대화 히스토리를 복원하지 않던 문제를 고쳤다.
- **삭제된 세션 resume 처리** — claude.ai 나 앱에서 삭제된 세션의 대화를 resume 하면 로그인 관련 메시지로 실패하는 대신 대체 세션을 시작한다. (v2.1.227 회귀)
- **Cloud gateway `/login` 무응답 수정** — managed settings 로드 실패 시 조용히 종료하거나 "Press Enter to continue" 이후 터미널이 먹통이 되던 문제. 이제 이유를 표시한다.
- **음성 모드 무한 "listening…" 수정** — 네이티브 빌드에서 음성 서비스가 연결을 거부하면 즉시 거부 사실을 표시한다.
- **mTLS 클라이언트 인증서 회전** — 재시작 없이 회전된 인증서와 키를 연결 오류 시 자동 재로드한다.
- **잘못된 리전 값 처리** — 형식이 깨진 AWS·Vertex 리전 값으로 요청 URL 을 만들지 않고 기본 리전으로 폴백한다.
- **스트림 유휴 타임아웃 복구** — Bedrock·Vertex·gateway 배포에서 요청을 실패시키는 대신 복구한다.
- **오버레이 렌더링 수정** — 내용 크기에 맞춘 오버레이가 잘린 텍스트를 담을 때 한 칸 넓게 그려지던 문제, 앞부분이 잘린 텍스트가 말줄임표 하나로 뭉개지던 문제를 고쳤다.
- **깨진 문자 수정** — 긴 셸 명령·에이전트 설명 미리보기가 이모지 중간에서 잘리며 이상한 문자가 남던 문제.
- **마켓플레이스 등록 해제 수정** — `known_marketplaces.json` 동시 쓰기로 시작 시 플러그인 마켓플레이스가 조용히 해제되던 경합을 고쳤다.
- **`/update`·`/tui` 재시작 거부 수정** — 재실행 후에도 살아남는 작업이 돌고 있을 때 재시작을 거부하던 문제.
- **사용량 한도 안내 수정** — SDK·remote 세션에서 쓸 수 없는 슬래시 명령을 제안하지 않는다.
- **`--advisor fable` 동의 메시지 수정** — 방금 종료한 대화형 세션에서 `/model fable` 을 실행하라고 안내하던 문구를 고쳤다.
- **전체화면 스트리밍 개선** — 업데이트마다 전체 대화를 다시 정규화하지 않아 긴 세션도 반응성을 유지한다.
- **managed settings 승인 다이얼로그 개선** — 엔드포인트 URL 을 표시하고, 텔레메트리 전용 변경 문구를 명확히 하며, 일상적인 OpenTelemetry 옵션은 건너뛴다. 서버 관리 샌드박스 바이너리 오버라이드(`sandbox.bwrapPath`, `sandbox.socatPath`, `sandbox.ripgrep`)는 승인을 요구한다.
- **`/feedback`·`/bug` 즉시 실행** — Claude 가 응답 중일 때 호출해도 턴이 끝날 때까지 기다리지 않고 바로 열린다.
- **`/plugin install plugin@marketplace` 자동 새로고침** — 마켓플레이스를 먼저 갱신해, 새로 게시된 플러그인도 수동 업데이트 없이 설치된다.
- **`/code-review` 백그라운드 실행** — high·xhigh·max effort 에서도 다른 레벨처럼 백그라운드 에이전트로 돈다.
- **이미지 붙여넣기 비블로킹** — 붙여넣기·클립보드 이미지를 이벤트 루프를 막지 않고 읽는다.
- **Remote Control 재연결 강화** — 네트워크 끊김 후 약 30분간 재연결을 계속하고, 한 시간에 걸쳐 몇 번 끊겨도 더 이상 떨어지지 않는다.
- **Remote Control 소유권 보호** — 대화 resume 이 같은 머신의 다른 Claude Code 로부터 Remote Control 을 조용히 빼앗지 않는다. 옮기려면 그쪽에서 `/remote-control` 을 실행한다.
- **에이전트 패널 개선** — 완료된 서브에이전트는 즉시 숨기고 `/tasks` 힌트를 푸터에 표시한다. "↓ N more" 오버플로 표시가 잘 보이도록 왼쪽으로 이동했다.
- **Remote Control 종료 사유 표시** — 다른 기기가 가져갔는지, 다른 앱에서 종료했는지, 삭제됐는지를 터미널이 알려주고, 그걸 되돌릴 재연결을 더는 권하지 않는다.
- **Bash 입력 리디렉션 권한 검사** — 모든 플랫폼에서 `< file` 을 인자 형태와 동일하게 권한 검사한다.
- **백그라운드 에이전트 resume 메시지 단축** — 완료된 백그라운드 에이전트를 resume 할 때 나오는 메시지를 줄였다.
- **Cowork 세션 @-import 제한** — 사용자 스코프 메모리 파일의 외부 @-import 를 인라인하지 않는다.
- **공유 `/tmp` 소켓 디렉터리 하드닝** — 자동 생성되는 세션 간 메시징 소켓 디렉터리에서 미리 심어둔 심볼릭 링크나 다른 사용자의 디렉터리를 쓰지 않고 거부한다.
- **Linux 파일시스템 샌드박스 하드닝** — 보호 경로 우회를 막았다.
- **`sandbox.ripgrep` 적용 범위 축소** — user·managed·`--settings` 설정에서만 적용된다. 프로젝트 설정은 더 이상 샌드박스의 ripgrep 바이너리를 덮어쓸 수 없다.
- **커스텀 서브에이전트 안내 제거** — 시작 시 뜨던 커스텀 서브에이전트 생성 권유 팁과 `/powerup` 투어의 같은 안내를 없앴다.

## 🔑 이번 버전의 핵심 키워드
**"세션끼리 말이 통한다"** — fork 서브에이전트 기본 활성화와 `@` 멘션으로 세션 간 협업이 표준 동작이 됐고, GitLab 지원과 권한 우회 차단이 그 밑을 받친다.

---

# 📜 원문 (한글 번역본)

> 원문 ChangeLog를 원래 순서 그대로 한 줄도 빠짐없이 번역한 문서입니다.

- Subagent forking 이 이제 기본 활성화다. `subagent_type: "fork"` 서브에이전트는 전체 대화와 프롬프트 캐시를 물려받고, 대화형 세션에서 teammate 가 아닌 에이전트 spawn 은 기본으로 백그라운드에서 실행된다
- 프롬프트에 `@` 를 입력해 다른 Claude 세션을 이름으로 멘션한다. Claude 는 `SendMessage` 로 그 세션에 직접 연결한다
- `SendMessage` 는 ref 로 먼저 확인을 요구하는 대신, 살아있는 세션 하나와 정확히 일치하는 이름이면 바로 전달한다
- 한 머신의 대화형 세션은 이제 고유한 이름을 유지한다. 다른 살아있는 세션이 이미 쓰는 이름으로 세션을 시작하거나 이름을 바꾸면 `name-word-word` 변형이 붙고 그 사실을 알려준다
- `/config` 에 "Dialog expiry" 와 "Messages from your other sessions"(세션 간 수신 accept/hold/refuse) 행이 추가됐다
- GitLab 토큰 계열(`glrt-`, `gloas-`, `glptt-`, `glagent-`, `glimt-`, `glsoat-`, `glcbt-`, `glft-`, `glffct-`)에 대한 시크릿 마스킹과 라우팅 가능한 `glpat-`/`gldt-` 토큰의 전체 마스킹이 추가됐다. `glab` CLI 설정 저장소는 `gh` 와 동일한 샌드박스·자격증명 경로 보호를 받는다
- 플러그인 마켓플레이스에 GitLab 지원이 추가됐다. 중첩 서브그룹을 포함한 bare `gitlab.com` 저장소 URL 이 `github.com` URL 처럼 clone 되고, clone 인증 실패 힌트가 실제 git 호스트 이름을 알려준다
- 설정: `additionalMarketplaces` 와 `allowedMarketplaces` 가 `extraKnownMarketplaces`, `strictKnownMarketplaces` 의 더 친숙한 별칭으로 받아들여진다
- 엔터프라이즈 정책: bare 저장소 URL 에 대한 url 타입 `blockedMarketplaces` 항목이 CLI 가 그것을 git clone 으로 분류할 때도 계속 그 URL 을 차단한다
- Gateway: `desktop:` 오버레이가 이제 출시된 모든 Desktop 설정을 받는다(기존엔 손으로 나열한 11개 키). 부팅 시 Desktop 자체 스키마로 검증하며, 모르는 키나 잘못된 키는 부팅을 실패시킨다
- Gateway: 비어 있는 `managed.policies[].match.groups`/`admin.admin_groups` 항목과 잘못된 `email_domain` 값(빈 값, 또는 `@`·공백·쉼표 포함)은 이제 조용히 아무도 매칭하지 않거나 admin 권한을 부여하는 대신 부팅에서 실패한다
- Fable 5 가 Fable 접근 권한이 있는 조직에서 `/advisor` 의 어드바이저로 다시 제공된다. 사용 크레딧 동의는 `/model fable` 로 설정한다
- 변수 기록 파라미터가 `$PSDefaultParameterValues` 를 조용히 덮어써 이후 명령의 파일 접근을 리다이렉트할 수 있던 PowerShell 권한 우회를 수정했다
- Git Bash 가 경로 검증에는 일반 파일로 보이는 Cygwin 스타일 심볼릭 링크를 따라가던 Windows 권한 우회를 수정했다. 이제 그 링크를 통한 쓰기는 권한 승인이 필요하다
- 중첩된 git 저장소가 상위 디렉터리의 신뢰를 물려받던 문제를 수정했다. 이제 각 저장소가 자체 신뢰 확인을 요구한다
- 서버가 프로토콜 버전 probe 에 답하지 않거나 잘못된 응답을 보낼 때 MCP 연결이 30초 연결 타임아웃을 꽉 채워 멈추던 문제를 수정했다
- 클라우드 세션 내부의 브리지가 호스팅하는 Remote Control 세션이 그 세션의 트랜스크립트나 자격증명을 물려받던 문제를 수정했다
- Claude Desktop 이나 IDE 에서 시작한 Remote Control 세션이 로컬 세션을 resume 할 때마다 claude.ai 에 매번 새 세션으로 나타나던 문제를 수정했다. 이제 기존 세션에 다시 붙는다
- Remote Control 세션이 유휴 상태일 때 새로 붙은 클라이언트에게 도달 불가로 보이던 문제를 수정했다
- Remote Control 브리지 세션이 세션 워커 재시작 시 대화 히스토리를 복원하지 않던 문제를 수정했다
- Remote Control: claude.ai 나 앱에서 삭제된 세션의 대화를 resume 하면 로그인 관련 메시지와 함께 실패하는 대신 대체 세션을 시작한다 (v2.1.227 에서 회귀)
- managed settings 로드가 실패했을 때 Cloud gateway `/login` 이 조용히 종료되거나 "Press Enter to continue" 이후 응답 없는 터미널을 남기던 문제를 수정했다. 이제 그 이유를 표시한다
- 음성 서비스가 연결을 거부했을 때 네이티브 빌드의 음성 모드가 "listening…" 에서 멈추던 문제를 수정했다. 이제 거부가 즉시 표시된다
- mTLS 클라이언트 인증서 회전에 재시작이 필요하던 문제를 수정했다. Claude Code 가 연결 오류 시 회전된 인증서와 키를 자동으로 다시 로드한다
- 형식이 잘못된 AWS·Vertex 리전 값이 요청 URL 구성에 쓰이던 문제를 수정했다. 이제 기본 리전으로 폴백한다
- 스트림 유휴 타임아웃 오류가 Bedrock·Vertex·gateway 배포에서 복구되지 않고 요청을 실패시키던 문제를 수정했다
- 잘린 텍스트를 담은 내용 크기 기반 오버레이가 한 열 넓게 렌더링되던 문제와, 앞부분이 잘린 텍스트가 말줄임표로 축소되던 문제를 수정했다
- 긴 셸 명령이나 에이전트 설명 미리보기가 이모지 중간에서 잘릴 때 남던 깨진 문자를 수정했다
- `known_marketplaces.json` 에 대한 동시 쓰기로 플러그인 마켓플레이스가 조용히 등록 해제될 수 있던 시작 시 경합을 수정했다
- 재실행 후에도 유지되는 작업이 실행 중일 때 `/update` 와 `/tui` 가 재시작을 거부하던 문제를 수정했다
- 사용량 한도 안내가 SDK·remote 세션에서 사용할 수 없는 슬래시 명령을 제안하던 문제를 수정했다
- 대화형 `--advisor fable` 실행 시 방금 종료된 대화형 세션에서 `/model fable` 을 실행하라고 안내하던 동의 메시지를 수정했다
- 전체화면 스트리밍 개선: 업데이트마다 전체 대화를 다시 정규화하지 않아 긴 세션도 반응성을 유지한다
- managed settings 승인 다이얼로그 개선: 엔드포인트 URL 을 표시하고, 텔레메트리 전용 변경에 더 명확한 문구를 쓰며, 일상적인 OpenTelemetry 옵션은 건너뛰고, 서버 관리 샌드박스 바이너리 오버라이드(`sandbox.bwrapPath`, `sandbox.socatPath`, `sandbox.ripgrep`)에는 승인을 요구한다
- `/feedback` 과 `/bug` 가 Claude 응답 중에 호출돼도 턴이 끝나길 기다리지 않고 즉시 열린다
- `/plugin install plugin@marketplace` 가 마켓플레이스를 먼저 새로고침해, 새로 게시된 플러그인도 수동 마켓플레이스 업데이트 없이 설치된다
- high, xhigh, max effort 의 `/code-review` 가 다른 레벨과 마찬가지로 백그라운드 에이전트에서 실행된다
- 붙여넣기·클립보드 이미지를 이벤트 루프를 막지 않고 읽는다
- Remote Control 이 네트워크 끊김 후 약 30분간 재연결을 계속하며, 한 시간에 걸쳐 몇 번 끊겨도 더는 연결이 끊기지 않는다
- Remote Control: 대화 resume 이 같은 머신에서 아직 Remote Control 을 쥐고 있는 다른 Claude Code 로부터 그것을 조용히 빼앗지 않는다. 옮기려면 그쪽에서 `/remote-control` 을 실행한다
- 에이전트 패널 갱신: 완료된 서브에이전트는 즉시 숨겨지고 `/tasks` 푸터 힌트가 표시되며, "↓ N more" 오버플로 표시가 잘 보이도록 왼쪽으로 이동했다
- Remote Control: 세션이 다른 기기에 인계됐는지, 다른 앱에서 종료됐는지, 삭제됐는지를 터미널이 알려주고, 그것을 되돌릴 재연결을 더 이상 제안하지 않는다
- Bash 입력 리디렉션(`< file`)이 모든 플랫폼에서 인자 표기와 동일하게 권한 검사된다
- 완료된 백그라운드 에이전트를 resume 할 때 표시되는 메시지를 줄였다
- Cowork 세션이 사용자 스코프 메모리 파일의 외부 @-import 를 더 이상 인라인하지 않는다
- 공유 `/tmp` 에 자동 생성되는 세션 간 메시징 소켓 디렉터리를 하드닝했다. 미리 심어둔 심볼릭 링크나 다른 사용자의 디렉터리는 사용되지 않고 거부된다
- Linux 파일시스템 샌드박스를 보호 경로 우회에 대해 하드닝했다
- `sandbox.ripgrep` 은 user·managed·`--settings` 설정에서만 적용되도록 변경됐다. 프로젝트 설정은 더 이상 샌드박스의 ripgrep 바이너리를 덮어쓸 수 없다
- 커스텀 서브에이전트 생성을 권하던 시작 팁과 `/powerup` 투어의 대응 안내를 제거했다

---

## 🎯 챌린지

이번 버전에서 내 환경에 적용해볼 만한 항목입니다.

### 1. 세션 간 메시지 수신 정책 정하기
- **파일**: `~/.claude/settings.json` (또는 `/config` 의 "Messages from your other sessions")
- **근거**: 이번 버전에서 `@` 멘션과 `SendMessage` 이름 직접 전달이 열리면서 다른 세션이 내 세션으로 바로 메시지를 밀어 넣을 수 있다. 여러 프로젝트 세션을 동시에 띄우는 환경이므로 accept/hold/refuse 중 하나를 명시적으로 골라두지 않으면 작업 중 세션이 예상 못 한 지시를 받는다. `/config` 에서 한 번 정하고 "Dialog expiry" 도 같이 확인한다.
- **난이도**: ★☆☆ (약 5분)

### 2. 마켓플레이스 설정 키를 새 별칭으로 정리
- **파일**: `~/.claude/settings.json` 의 `extraKnownMarketplaces`
- **근거**: 현재 4개 마켓플레이스(`karpathy-skills`, `alexgreensh-token-optimizer`, `understand-anything`, `claude-plugins-official`)를 `extraKnownMarketplaces` 로 등록해 두고 있다. 이번 버전부터 `additionalMarketplaces` 가 동일하게 동작하는 별칭이므로 이름만 바꿔 가독성을 올릴 수 있다. 동작 변화는 없으니 바꾼 뒤 `/plugin` 목록에 4개가 그대로 뜨는지만 확인한다.
- **난이도**: ★☆☆ (약 5분)

### 3. CLAUDE.md §5 모델 라우팅에 fork 기본값 반영
- **파일**: `/Users/leeseonro/.claude/CLAUDE.md`
- **근거**: §5 는 "모든 subagent 는 Opus" 를 규정하는데, 이번 버전부터 `fork` 서브에이전트는 부모 모델을 강제 상속하고 대화형 세션의 에이전트 spawn 이 기본 백그라운드다. 세션 모델이 `opus[1m]` 이라 결과는 맞지만, 규칙과 실제 동작이 어긋난 채 남으면 나중에 헷갈린다. "fork 는 부모 모델 상속 — 별도 지정 불필요, 백그라운드가 기본" 한 줄을 §5 에 추가한다.
- **난이도**: ★☆☆ (약 5~10분)

### 4. `deploy-guard.sh` 에 입력 리디렉션 케이스 점검
- **파일**: `~/.claude/hooks/deploy-guard.sh`
- **근거**: 이번 버전에서 Bash 입력 리디렉션(`< file`)이 인자와 동일하게 권한 검사되도록 바뀌었다. 이 hook 은 `PreToolUse` 로 모든 Bash 명령을 가로채 `feat/*`·`fix/*` push 를 막는데, 커맨드 문자열 파싱 방식이라면 리디렉션이 섞인 형태에서 패턴 매칭이 어긋날 수 있다. `git push origin feat/x < /dev/null` 같은 입력을 hook 에 흘려 차단이 유지되는지 한 번 확인한다.
- **난이도**: ★★☆ (약 15분)
