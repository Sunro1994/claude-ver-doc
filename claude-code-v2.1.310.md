# Claude Code v2.1.310

> 작성일: 2026-10-25

---

# 📋 요약본

## 🎉 신기능 (3건)
- **Bedrock·Vertex·Foundry에서 Monitor 도구 지원** — `Monitor` 도구와 plugin monitor를 Bedrock, Vertex, Foundry에서 쓸 수 있다. telemetry나 nonessential traffic을 끈 환경에서도 쓸 수 있다.
  - 이 환경들에서도 긴 foreground `sleep`을 막는다. 무언가를 기다릴 때는 Monitor를 써야 한다.
- **[Cloud sessions] Enterprise custom role 권한 추가** — 회사 관리자가 만드는 사용자 정의 역할(custom role)에 cloud session 권한과 Remote Control 권한이 들어갔다. Owner는 역할마다 각 기능의 사용 여부를 정할 수 있다.
- **[Cloud sessions] setup script 파일 불러오기** — cloud environment에 Choose file 버튼이 생겼다. 환경을 준비하는 setup script를 파일에서 바로 불러올 수 있다.

## 🛠️ 개선/수정 (23건)
- **gateway 호환성 수정** — `effort-2025-11-24` beta 값이나 대화 중간의 system message를 거부하는 gateway·호환 서버에서 요청이 실패했다. 이제 그 값을 빼고 다시 요청한다.
- **`cleanupPeriodDays` 큰 값 버그 수정** — 값을 매우 크게 잡으면 백그라운드 정리 작업이 붙여넣은 이미지 같은 최근 파일을 지웠다. 이 문제를 고쳤다.
- **"Prompt is too long" 이후 compaction 수정** — base64·SVG처럼 글자가 빽빽한 대화를 압축(compaction)할 때 너무 많이 남겨서 다음 요청이 또 실패했다. 이 문제를 고쳤다.
- **symlink 대상 표시** — 파일 읽기 권한 프롬프트가 이제 symbolic link가 실제로 가리키는 위치를 보여준다.
- **외부 편집기 종료 직후 timeout 수정** — 외부 편집기에서 오래 편집하고 닫으면 질문의 auto-continue timeout이 바로 발동했다. 이 문제를 고쳤다.
- **Windows hook 우회 수정** — Git Bash가 없고 hook 명령이 따옴표 문자열(예: 따옴표로 감싼 경로)뿐이면 `PreToolUse`·`PermissionRequest` hook이 도구 호출을 막지 못하고 통과시켰다. 이 문제를 고쳤다.
- **auto mode 첫 외부 읽기 안내 개선** — 작업 디렉토리 밖을 처음 읽기 전에 나오는 프롬프트가 달라졌다. 그런 읽기를 막으면 shell 명령도 권한을 묻게 된다는 점을 알려준다.
- **비대화형 세션 메모리 사용 개선** — transcript 파일이 매우 클 때 `-p`·Agent SDK 세션이 compaction 중 쓰는 메모리를 줄였다.
- **mod `Image` 렌더링 개선** — tmux(`allow-passthrough`·`focus-events` 켬)와 fullscreen 렌더링을 쓰는 kitty, Ghostty, iTerm2 3.5+에서 이미지가 `alt` 텍스트로만 보였다. 이제 실제 이미지를 그린다.
- **Linux sandbox 안내 개선** — Ubuntu의 AppArmor가 user namespace를 막아 bubblewrap이 sandbox를 띄우지 못하면, `/sandbox`와 시작 경고가 그 원인과 해제 방법을 알려준다.
- **MCP elicitation timeout 오류 문구 변경** — 비대화형 세션에서 MCP 서버의 추가 입력 요청(elicitation)에 아무도 답하지 않아 시간이 초과되면, Claude에게 답이 오지 않았으니 같은 호출을 반복하지 말라고 알린다.
- **[VSCode] plan 피드백 버튼 수정** — "Send feedback and keep planning" 버튼에서 Enter를 누르면 피드백을 보내는 대신 plan을 승인했다. 이 문제를 고쳤다.
- **[VSCode] 브랜치 전환 오류 수정** — Session history의 Web 탭에서 연 cloud session에서 "Switch branch & continue"를 누르면 "Something went wrong"이 떴다. 이 문제를 고쳤다.
- **[Cloud sessions] 편집 dialog 오류 표시** — cloud environment 편집 dialog에서 저장·보관이 실패해도 dialog 안에 오류가 나오지 않았다. 이 문제를 고쳤다.
- **[Cloud sessions] routine API token 오류 표시** — routine API token 작업이 실패하면 toast만 떴다. 이제 routine 편집 dialog 안에 오류가 나온다.
- **[Cloud sessions] setup script 출력 스크롤** — 세션 시작 체크리스트가 setup script 출력을 스크롤 상자에 보여준다.
- **[Cloud sessions] 활성화 확인 절차 추가** — admin settings에서 Cloud sessions나 Remote Control을 켜면 확인을 묻고, 그 권한을 가진 custom role 목록을 보여준다.
- **[Cloud sessions] 환경 dialog 구성 변경** — network access, setup script, environment variables 편집기를 한꺼번에 펼치지 않고 각 행에서 연다.
- **[Claude Tag] 서식 입힌 `!` 명령 인식** — 굵게·기울임·취소선으로 보낸 `!restart`·`!help`를 일반 메시지로 처리했다. 이 문제를 고쳤다.
- **[Claude Tag] admin 페이지 로드 오류 수정** — 백그라운드에서 bundle 목록 갱신이 실패하면 admin channel·workspace 페이지 전체가 로드 오류 화면으로 바뀌었다. 이 문제를 고쳤다.
- **[Claude Tag] spend limits 필터 표시 수정** — channel 이름을 아직 불러오는 중인데 필터에 맞는 channel이 없다고 표시했다. 이 문제를 고쳤다.
- **[Code Review] admin 섹션 사라짐 수정** — repository 목록 갱신이 실패하면 repository와 스위치가 화면에서 사라졌다. 이 문제를 고쳤다.
- **[Code Review] 첫 로드 재시도** — 첫 로드가 실패하면 다시 시도한다. 그래도 실패하면 Try again 배너를 하나만 보여준다.

## 🔑 이번 버전의 핵심 키워드
**"막혀야 할 곳은 막고, 실패는 보이게"** — hook 우회와 파일 삭제 버그를 고치고, 숨어 있던 오류를 dialog 안에 드러낸 안정화 릴리스다.

---

# 📜 원문 (한글 번역본)

> 원문 ChangeLog를 원래 순서 그대로 한 줄도 빠짐없이 번역한 문서입니다.

- Bedrock, Vertex, Foundry에서, 그리고 telemetry나 nonessential traffic이 꺼져 있을 때도 Monitor 도구와 plugin monitor를 추가했다. 이 환경들에서도 이제 긴 foreground sleep을 막는다.
- `effort-2025-11-24` beta 값이나 대화 중간의 system message를 거부하는 일부 gateway·호환 서버 뒤에서 요청이 실패하던 문제를 고쳤다. 이제 Claude Code는 그것들을 빼고 다시 시도한다.
- `cleanupPeriodDays`를 매우 큰 값으로 설정하면 백그라운드 정리가 붙여넣은 이미지 같은 일부 최근 파일을 지우던 문제를 고쳤다.
- "Prompt is too long" 오류 이후 compaction이 base64나 SVG처럼 빽빽한 텍스트가 있는 대화를 너무 많이 남겨 다음 요청이 다시 실패할 수 있던 문제를 고쳤다.
- 파일 읽기 권한 프롬프트가 symbolic link가 가리키는 위치를 보여주지 않던 문제를 고쳤다.
- 오래 편집한 뒤 외부 편집기를 닫는 순간 질문의 auto-continue timeout이 발동하던 문제를 고쳤다.
- Windows: Git Bash가 없고 hook 명령이 따옴표로 감싼 경로처럼 따옴표 문자열로만 되어 있을 때 `PreToolUse`·`PermissionRequest` hook이 도구 호출을 통과시키던 문제를 고쳤다.
- 작업 디렉토리 밖을 처음 읽기 전에 나오는 auto mode 프롬프트를 개선했다. 이제 그런 읽기를 막으면 shell 명령이 권한을 묻게 된다는 점을 알려준다.
- transcript 파일이 매우 클 때 compaction 중 비대화형 세션(`-p`, Agent SDK)의 메모리 사용을 개선했다.
- mod의 `Image`가 tmux(`allow-passthrough`·`focus-events` 켬)와 fullscreen 렌더링을 쓰는 kitty, Ghostty, iTerm2 3.5+에서 그려지도록 개선했다. 전에는 `alt` 텍스트만 보였다.
- Linux: Ubuntu의 AppArmor가 user namespace를 제한해 bubblewrap이 sandbox를 시작하지 못할 때, `/sandbox`와 sandbox 시작 경고가 그 제한과 해제 방법을 알려주도록 개선했다.
- 비대화형 세션에서 서버의 elicitation에 답이 없는 상태로 MCP 도구 호출이 timeout될 때의 오류를 바꿨다. 이제 Claude에게 답이 오지 않았으니 호출을 반복하지 말라고 알린다.
- [VSCode] plan review 카드의 "Send feedback and keep planning" 버튼에서 Enter를 누르면 코멘트를 돌려보내지 않고 plan을 승인하던 문제를 고쳤다.
- [VSCode] Session history의 Web 탭에서 연 cloud session에서 "Switch branch & continue"를 누른 뒤 패널에 "Something went wrong"이 뜨던 문제를 고쳤다.
- [Cloud sessions] Enterprise custom role에 Claude Code cloud session 권한과 Remote Control 권한을 추가했다. Owner는 역할별로 각각의 접근을 통제할 수 있다.
- [Cloud sessions] cloud environment의 setup script를 파일에서 불러오는 Choose file 버튼을 추가했다.
- [Cloud sessions] cloud environment 편집 dialog에서 저장·보관이 실패해도 dialog 안에 오류가 나오지 않던 문제를 고쳤다.
- [Cloud sessions] routine API token 작업이 실패하면 toast만 뜨던 문제를 고쳤다. 이제 오류가 routine 편집 dialog에 나온다.
- [Cloud sessions] 세션 시작 체크리스트가 cloud environment의 setup script 출력을 스크롤 상자에 보여주도록 개선했다.
- [Cloud sessions] admin settings에서 Cloud sessions나 Remote Control을 켤 때 확인을 묻고, 그 권한을 가진 custom role을 나열하도록 바꿨다.
- [Cloud sessions] cloud environment dialog가 모든 편집기를 한꺼번에 나열하지 않고, network access·setup script·environment variables를 각 행에서 열도록 바꿨다.
- [Claude Tag] 굵게·기울임·취소선으로 보낸 `!restart`·`!help` 같은 `!` 명령을 Claude Tag가 일반 메시지로 처리하던 문제를 고쳤다.
- [Claude Tag] bundle 목록의 백그라운드 갱신이 실패하면 Claude Tag admin channel·workspace 페이지가 로드 오류로 바뀌던 문제를 고쳤다.
- [Claude Tag] admin settings의 Claude Tag spend limits 페이지가 channel 이름을 아직 불러오는 중인데 필터에 맞는 channel이 없다고 표시하던 문제를 고쳤다.
- [Code Review] repository 목록 갱신이 실패하면 Code Review admin 섹션이 repository와 스위치를 숨기던 문제를 고쳤다.
- [Code Review] Code Review admin 섹션이 첫 로드를 다시 시도하고, 그래도 실패하면 Try again 배너를 하나만 보여주도록 개선했다.

---

## 🎯 챌린지

이번 버전에서 내 환경에 적용해볼 만한 항목입니다.

### 1. deploy-guard.sh가 오류 시에도 push를 막는지 점검
- **파일**: `~/.claude/hooks/deploy-guard.sh`
- **근거**: 이번 버전은 Windows에서 hook 실행이 실패하면 도구 호출이 그대로 통과되던 문제를 고쳤다. macOS에서도 Claude Code는 hook이 exit code 2로 끝날 때만 호출을 막는다. 스크립트가 다른 오류(exit 1, `jq` 없음 등)로 끝나면 `feat/*` push가 그냥 통과한다. 스크립트 맨 위에 `set -euo pipefail`과 `trap 'exit 2' ERR`를 넣는다. 그다음 `echo '{"tool_input":{"command":"git push origin feat/x"}}' | ~/.claude/hooks/deploy-guard.sh; echo $?` 를 실행해 결과가 `2`인지 확인한다.
- **난이도**: ★★☆ (약 15분)

### 2. CDN 엣지 확인 대기를 `sleep`에서 Monitor로 교체
- **파일**: `~/.claude/skills/eos-cdn-deploy/SKILL.md` (경로는 추정. 실제 스킬 위치를 확인한다)
- **근거**: 이번 버전은 Monitor를 지원하는 환경을 넓혔고, 긴 foreground `sleep`을 막는 범위도 함께 넓혔다. 퍼지 후 엣지 반영을 기다리는 단계가 `sleep` 반복이면 차단되거나 턴이 낭비된다. "엣지 확인은 `Monitor`로 until-loop 대기, foreground `sleep` 금지" 규칙을 한 줄 추가하면 퍼지 → 엣지 확인 순서가 끊기지 않는다.
- **난이도**: ★☆☆ (약 10분)

### 3. 자주 읽는 외부 경로를 `additionalDirectories`에 등록
- **파일**: `~/.claude/settings.json`
- **근거**: auto mode가 작업 디렉토리 밖을 처음 읽기 전에 묻는 프롬프트에, 이제 그런 읽기를 막으면 shell 명령도 권한을 묻게 된다는 안내가 붙는다. 사용자는 프로젝트 세션에서 `~/claude-ver-doc`, `~/agent-infra`, `~/.claude/projects/-/memory` 같은 공용 경로를 자주 읽는다. `permissions.additionalDirectories`에 이 경로들을 넣으면 매번 프롬프트가 뜨고 shell 명령까지 막히는 일을 줄인다. 범위를 넓히는 설정이므로 쓰기 위험이 없는 경로만 넣는다.
- **난이도**: ★☆☆ (약 5분)
