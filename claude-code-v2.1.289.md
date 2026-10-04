# Claude Code v2.1.289

> 작성일: 2026-10-05

---

# 📋 요약본

## 🎉 신기능 (1건)
- **팀원 에이전트 API 확장** — 플러그인·모드 쪽 에이전트 제어 기능이 늘었다.
  - `agent.spawn` 으로 teammate 에이전트를 직접 띄울 수 있다.
  - 플러그인 hook 이벤트 전체에서 같은 agent id를 쓴다. 이벤트를 에이전트 단위로 묶어 추적할 수 있다.
  - `$.agent.list()` 가 idle·waiting 상태를 함께 돌려준다.

## 🛠️ 개선/수정 (26건)
- **복합 명령 deny/ask 규칙 우선 적용** — 관리형 머신에서 복합 셸 명령 안쪽에 걸린 deny·ask 규칙이 사용자 설치 mod의 승인보다 우선한다.
- **Bash 규칙 우회 차단 (환경변수 prefix)** — sandbox auto-allow 상태에서 `TZ="$HOME" rm -rf build` 처럼 값이 확장되는 환경변수 prefix가 붙어도 deny·ask 규칙이 적용된다.
- **Bash 규칙 우회 차단 (변수 대입)** — sandbox auto-allow 상태에서 명령 앞에 단독 변수 대입이 있어도 deny·ask 규칙을 건너뛰지 않는다.
- **심링크 경유 `Read` deny 적용** — IDE에서 @-mention·변경·선택한 파일이 심링크를 거쳐도 `Read` deny 규칙이 적용된다.
- **조직 관리 MCP 보호** — 사용자 설치 플러그인이 조직 관리 MCP 서버의 로그인 도구 설명을 바꿔 쓸 수 없다.
- **터미널 프리징 수정** — 닫히지 않은 `<script>` 태그가 많거나 `${` 치환이 깊게 중첩된 짧은 코드 블록에서 터미널이 멈추지 않는다.
- **게시 artifact 페이지 프리징 수정** — 같은 패턴의 코드 블록이 있어도 읽는 사람의 브라우저 탭이 멈추거나 죽지 않는다.
- **[VSCode] `claude auth status` 롤백** — 2.1.288의 변경을 되돌렸다. 로그아웃이 잦아지는 원인으로 의심된 변경이다.
- **플러그인 코드 창 속도 개선** — 큰 파일을 열 때 하이라이트 화면을 최종 너비 기준으로 한 번만 배치한다. 그만큼 빨리 열린다.
- **로컬 marketplace 캐시 수정** — 로컬 폴더 marketplace에서 설치한 플러그인을 `plugin list`·`plugin eval`·`plugin update` 가 옛 사본으로 보여주던 문제를 고쳤다. 심링크된 `--plugin-dir` 의 hot reload도 고쳤다.
- **업그레이드 직후 mod 미로딩 수정** — 업그레이드 후 첫 세션에서도 설치한 mod가 로드된다.
- **Background tasks 화면 잔상 수정** — fullscreen에서 Background tasks 창을 연 동안 프롬프트 위 플러그인 행이 옛 내용을 보여주던 문제를 고쳤다.
- **플러그인 창 링크 렌더 수정** — localhost 주소, 경로 안의 `@`, 대문자 호스트, `file:` 경로가 든 링크가 있어도 창이 정상으로 그려진다.
- **Box 테두리 스타일 프리징 수정** — 터미널이 모르는 Box 테두리 스타일을 플러그인이 그려도 실행 시 멈추거나 강제 종료되지 않는다.
- **비동기 예외 세션 종료 수정** — 플러그인 화면 핸들러가 비동기로 예외를 던져도 supervised·background 세션이 끝나지 않는다.
- **높이 0 영역 세션 종료 수정** — 높이가 0인 플러그인 영역이 계속 커져도 interface error로 세션이 끝나지 않는다.
- **`ui.render` 예외 대응** — mod의 `ui.render` hook이 쓴 값 때문에 행이 그려지다 예외가 나면, 세션을 끝내지 않고 엔진이 그 행을 직접 그린다.
- **제어문자 텍스트 겹침 수정** — 탭·떠도는 escape·C1 제어문자가 섞인 텍스트, 탭과 CRLF 줄바꿈이 섞인 짧은 텍스트가 아래 행을 덮어쓰지 않는다.
- **우측 정렬 겹침 수정** — mod 창·band의 우측 정렬 내용이 닫기 표시나 `[-]` 아래로 깔리지 않는다. 두 표시는 터미널 끝에서 한 칸 띄운다.
- **`Client` 오류 격리** — 그리는 중 실패한 mod의 `Client` 는 혼자만 실패하고 `ui.fault` 를 발생시킨다. 주변 화면까지 무너뜨리지 않는다.
- **`Client` 영역 복구** — 터미널이 그리기 중 예외를 던진 뒤에도 해당 영역이 세션 끝까지 실패 상태로 남지 않는다.
- **band 실패 시 레이아웃 흔들림 수정** — 그리기에 실패한 band가 아래 카드를 잠깐 밀어내던 문제를 고쳤다.
- **mod 작성자용 오류 문구 개선** — band·창 그리기 실패 시 문구에 mod 이름을 넣고, 아무것도 그려지지 않았다고 알려준다.
- **실패 사유 표시 수정** — 메시지 없이 실패한 플러그인 구성요소의 사유가 `Error` 나 빈칸으로 나오던 문제를 고쳤다.
- **`claude plugin validate` 누락 수정** — 같은 폴더에 marketplace manifest가 있어도 플러그인 검사를 건너뛰지 않는다.
- **`claude plugin validate` 오판 수정** — Anthropic marketplace 자체 플러그인을 실패로 판정하던 문제와, `--json` 출력에 문제없는 `plugin.json` 까지 올리던 문제를 고쳤다.

## 🔑 이번 버전의 핵심 키워드
**"권한 규칙 우회 차단 + 플러그인 렌더링 안정화"** — 환경변수 prefix·심링크·mod 승인으로 deny 규칙이 빠지던 틈을 막았다. 플러그인·mod가 화면을 그리다 실패해도 세션이 죽지 않게 했다.

---

# 📜 원문 (한글 번역본)

> 원문 ChangeLog를 원래 순서 그대로 한 줄도 빠짐없이 번역한 문서입니다.

- 관리형 머신에서 복합 셸 명령의 안쪽 부분에 걸린 deny·ask 규칙이 사용자 설치 mod의 승인보다 우선하지 않던 문제 수정
- 닫히지 않은 `<script>` 태그가 많거나 `${` 치환이 깊게 중첩된 짧은 코드 블록에서 터미널이 멈추던 문제 수정
- IDE에서 심링크를 거쳐 @-mention·변경·선택한 파일에 `Read` deny 규칙이 적용되지 않던 문제 수정
- [VSCode] 로그아웃을 더 잦게 만들었을 수 있는 2.1.288의 `claude auth status` 변경을 되돌림
- 플러그인 코드 창에서 큰 파일이 열리는 속도 개선 — 하이라이트된 화면을 최종 너비에서 한 번만 배치함
- 로컬 폴더 marketplace에서 설치한 플러그인을 `plugin list`·`plugin eval`·`plugin update` 가 옛 사본으로 보여주던 문제와, 심링크된 `--plugin-dir` 의 hot reload 문제 수정
- 업그레이드 후 첫 세션에서 설치한 mod가 로드되지 않던 문제 수정
- fullscreen에서 Background tasks 창이 열린 동안 프롬프트 위 플러그인 행이 옛 행을 보여주던 문제 수정
- 링크에 localhost 주소, 경로 안의 `@`, 대문자 호스트, `file:` 경로가 있을 때 플러그인 창이 아무것도 그리지 않던 문제 수정
- 사용자 설치 플러그인이 조직 관리 MCP 서버의 로그인 도구 설명을 바꿔 쓸 수 있던 문제 수정
- 터미널이 모르는 테두리 스타일의 Box를 플러그인이 그릴 때 실행 시 멈추거나 강제 종료되던 문제 수정
- 플러그인의 화면 핸들러가 비동기로 예외를 던지면 supervised·background 세션이 끝나던 문제 수정
- 높이가 없는 플러그인 영역이 계속 커질 때 세션이 interface error로 끝나던 문제 수정
- sandbox가 명령을 auto-allow할 때, 값이 확장되는 환경변수 prefix 뒤의 명령(예: `TZ="$HOME" rm -rf build`)을 Bash deny·ask 규칙이 놓치던 문제 수정
- sandbox auto-allow 상태에서 명령 앞에 단독 변수 대입이 있으면 Bash deny·ask 규칙을 건너뛰던 문제 수정
- 폴더에 marketplace manifest도 있을 때 `claude plugin validate` 가 플러그인을 건너뛰던 문제 수정
- teammate용 `agent.spawn`, 플러그인 hook 이벤트 전체에서 쓰는 단일 agent id, `$.agent.list()` 의 idle·waiting 상태 추가
- mod의 `ui.render` hook이 쓴 값 때문에 행이 그려지다 예외가 나면 세션이 "unrecoverable interface error"로 끝나던 문제 수정 — 이제 엔진이 그 행을 직접 그림
- 탭·떠도는 escape·C1 제어문자가 든 텍스트, 또는 탭과 CRLF 줄바꿈이 든 짧은 텍스트가 아래 행을 덮어 그리던 문제 수정
- mod 창·band의 우측 정렬 내용이 닫기 표시나 `[-]` 아래에 그려지던 문제 수정 — 두 표시도 이제 터미널 끝에서 한 칸 안쪽에 둠
- 그리는 중 실패한 mod의 `Client` 가 그 mod가 주변에 그린 것을 모두 무너뜨리던 문제 수정 — 이제 혼자만 실패하고 `ui.fault` 를 발생시킴
- `claude plugin validate` 가 Anthropic marketplace 자체 플러그인을 실패로 판정하고, `--json` 에서 문제없는 `plugin.json` 을 목록에 올리던 문제 수정
- 그리기에 실패한 mod의 band가 아래 카드에게 잠깐 비키라고 하던 문제 수정
- 메시지 없이 실패한 플러그인 구성요소의 사유가 `Error` 나 빈칸으로 표시되던 문제 수정
- mod의 band나 창 그리기가 실패할 때 mod 작성자가 보는 문구 개선 — mod 이름을 밝히고 아무것도 그려지지 않았다고 알림
- 게시된 artifact 페이지가 닫히지 않은 `<script>` 태그가 많은 짧은 코드 블록에서 읽는 사람의 브라우저 탭을 멈추거나 죽이던 문제 수정
- 터미널이 그리기 중 예외를 던진 뒤 mod의 Client 영역이 세션 내내 실패 상태로 남던 문제 수정

---

## 🎯 챌린지

이번 버전에서 내 환경에 적용해볼 만한 항목입니다.

### 1. `git push`·`git commit` 을 ask 규칙으로 이중 잠금
- **파일**: `~/.claude/settings.json` (`permissions.ask`)
- **근거**: CLAUDE.md §6은 사용자 요청 없이 commit·push하지 않는다고 정한다. 그런데 지금 기계적으로 막는 장치는 `deploy-guard.sh` 하나뿐이고, 이 hook도 `feat/*`·`fix/*` push만 막는다. 이번 버전에서 환경변수 prefix(`GIT_SSH_COMMAND=... git push`)나 복합 명령 안쪽에 숨은 명령에도 ask 규칙이 걸리게 됐다. 그래서 `Bash(git push:*)`·`Bash(git commit:*)` 를 ask로 등록하면 hook이 놓친 경우까지 확인 창이 뜬다.
- **난이도**: ★☆☆ (약 10분)

### 2. 시크릿 파일 `Read` deny 규칙 추가
- **파일**: `~/.claude/settings.json` (`permissions.deny`)
- **근거**: CLAUDE.md는 배포 전 시크릿 유출을 직접 확인하라고 한다. 하지만 `.env`·키 파일 읽기 자체를 막는 규칙은 요약본에서 보이지 않는다(요약이 잘려 있어 추정이다). 이번 버전부터 IDE에서 심링크로 @-mention한 파일에도 `Read` deny가 적용된다. `Read(**/.env*)`·`Read(**/*.pem)`·`Read(~/.ssh/**)` 를 넣으면 GCP 프로젝트 자격증명이 대화에 실수로 들어오는 경로를 줄인다.
- **난이도**: ★☆☆ (약 10분)

### 3. `deploy-guard.sh` 우회 패턴 점검
- **파일**: `~/.claude/hooks/deploy-guard.sh`
- **근거**: 이번 버전은 권한 규칙이 `TZ="$HOME" rm -rf build` 같은 환경변수 prefix나 변수 대입 앞붙이기에 뚫리던 문제를 고쳤다. 다만 이 수정은 deny·ask 규칙에만 해당하고, 직접 만든 hook에는 적용되지 않는다. `FOO=1 git push origin feat/x`, `cd repo && git push origin feat/x`, `git -C repo push origin HEAD:feat/x` 를 hook 입력 JSON으로 넣어 차단(exit 2)되는지 확인한다. 새는 패턴이 있으면 정규식을 보강한다.
- **난이도**: ★★☆ (약 20분)
