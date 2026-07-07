# Claude Code v2.1.160

> 작성일: 2026-06-01

---

# 📋 요약본

## 🚨 메이저 변경 (1건)
- **dynamic-workflow 트리거 키워드 `workflow` → `ultracode`로 이름 변경**.
  - "workflow"라는 단어는 더 이상 실행을 트리거하지 않음.
  - 자기 언어로 워크플로우를 요청하는 것은 여전히 동작.
  - 프롬프트 입력에서 트리거 키워드는 violet 색상으로 하이라이트됨.

## 🔐 보안 / 권한 강화 (2건)
- **셸 startup 파일 쓰기 전 프롬프트 추가** — `.zshenv`, `.zlogin`, `.bash_login`, `~/.config/git/` 등에 쓸 때 의도하지 않은 명령 실행으로 이어질 수 있어 사용자 확인 요청.
- **`acceptEdits` 모드에서 코드 실행 권한을 주는 빌드 도구 config 파일 쓰기 전 프롬프트** — `.npmrc`, `.yarnrc*`, `bunfig.toml`, `.bazelrc`, `.pre-commit-config.yaml`, `.devcontainer/` 등.

## 🎉 신기능 / 동작 변경 (1건)
- **Edit가 `grep` 후 별도 Read 불필요** — 단일 파일 대상 `grep`/`egrep`/`fgrep` 명령이 read-before-edit 체크를 만족.

## ⚙️ 개선 (3건)
- **`claude agents`에서 오랫동안 비활성 상태였던 백그라운드 에이전트 세션 여는 성능 개선**.
- **Auto 모드 분류기 latency 개선** — 일상적인 액션의 reasoning 감소로 "could not evaluate this action" 차단 가능성 낮춤.
- **백그라운드 세션 teardown 개선** — `claude rm`/`stop`, idle reap이 실행 중인 셸 서브프로세스에 SIGKILL 전에 SIGTERM을 보내 cleanup 핸들러가 동작하도록 함.

## 🐛 버그 수정 (18건) — 카테고리별
- **🪟 Windows / WSL**:
  - WSL에서 copy-on-select가 Windows 클립보드에 쓰지 않던 문제 수정 — OSC 52 대신 PowerShell interop 사용 (MobaXterm 같은 터미널 호환).
  - Windows에서 백그라운드 세션이 시작된 디렉토리가 `claude rm` 후에도 백그라운드 데몬 종료 전까지 삭제되지 않던 문제 수정.
  - 호스트의 무거운 CPU 부하 상태에서 백그라운드 세션 attach 또는 agent view에서 Esc/방향키/타이핑이 응답하지 않던 문제 수정.
  - Windows 터미널의 hyperlink 지원에서 유효한 `file:///C:/...` 링크가 깨진 경로로 다시 쓰이던 문제 수정.
- **백그라운드 세션 / Agents View**:
  - `claude agents`에서 완료 세션을 복원할 때 채팅 히스토리가 드롭되고 원래 프롬프트가 다시 실행되던 문제 수정.
  - 야간 retire 이후 다시 attach된 백그라운드 세션이 대화를 잃고 원래 프롬프트를 다시 실행하던 문제 수정.
  - 부하 많은 머신에서 백그라운드 데몬이 cold-start할 때 `claude --bg`가 가끔 "socket missing"으로 실패하던 문제 수정.
  - 작업을 재개한 백그라운드 에이전트가 agents 목록에서 Completed 아래에 표시되던 문제 수정.
  - 매 exit마다 auto-updater가 재확인하면서 `claude agents`가 세션 목록으로 돌아갈 때 몇 초간 freeze되던 문제 수정.
  - 백그라운드 에이전트가 terminal sync-output 마커를 지원하지 않는 터미널(Apple Terminal, tmux)로 emit하여 실행 중인 에이전트 진입 시 render artifact가 발생하던 문제 수정.
  - agents 목록에서 세션을 연 직후 마우스 휠 스크롤이 transcript 대신 prompt history를 스크롤하던 문제 수정.
  - `claude agents` 뷰에서 CJK IME composition이 입력 caret이 아닌 화면 좌하단에 나타나던 문제 수정.
- **음성 / 입력**:
  - 프로젝트 디렉토리나 브랜치 이름에 non-ASCII 또는 특수 문자가 포함되면 voice mode가 연결에 실패하던 문제 수정.
- **모델 / Auto 모드**:
  - third-party provider(Bedrock/Vertex/Foundry)에서 auto 모드 사용 불가 메시지가 모델을 잘못 탓하던 문제 수정 — 이제 `CLAUDE_CODE_ENABLE_AUTO_MODE` opt-in을 가리킴.
  - 모델이 xhigh를 실행할 수 없을 때 `/effort ultracode`가 dynamic workflows 설정을 잘못 탓하던 문제 수정; 이제 지원하지 않는 모델에는 ultracode 옵션 미제공.
  - SDK 등 CLI 플래그가 적용되지 않는 호스트에서 실행 시 model-not-found 오류가 `--model`을 제안하던 문제 수정.
- **UI / 모드**:
  - brief 모드를 끈 상태로 brief 모드 세션을 재개할 때 Claude의 과거 답변이 scrollback에서 사라지던 문제 수정.
  - vim 모드에서 register가 `v$`로 yank되었을 때 `p`가 커서가 아닌 아래 라인에 paste되던 문제 수정.

## 🚮 제거 (2건)
- **`CLAUDE_CODE_OPUS_4_6_FAST_MODE_OVERRIDE` 제거** — 환경변수는 이제 no-op. (v2.1.154에서 06/01 제거 예고했던 것이 실제 제거됨.)
- **시작 시 JetBrains plugin 설치 제안 제거**.

## 🔑 이번 버전의 핵심 키워드
**"트리거 키워드 정상화 + 권한 안전망 강화"** — v2.1.154에서 도입된 "workflow" 단어 자동 트리거가 일상 대화에서 자주 오발동했던 문제를 정면 해결했습니다. 트리거 키워드를 흔하지 않은 단어 `ultracode`로 바꾸고 violet 하이라이트를 제공해 명시적으로만 작동하도록 했습니다. 동시에 shell startup 파일과 빌드 도구 config 파일에 대한 쓰기를 권한 프롬프트로 보호해, 원치 않는 코드 실행 경로를 차단했습니다. 백그라운드 세션의 히스토리 손실(완료 세션 복원, 야간 retire 후 re-attach)과 Windows·WSL 환경의 누수도 광범위하게 정리되었습니다.

---

# 📜 원문 (한글 번역본)

> 원문 ChangeLog를 원래 순서 그대로 한 줄도 빠짐없이 번역한 문서입니다.

- 의도하지 않은 명령 실행으로 이어질 수 있는 셸 startup 파일(`.zshenv`, `.zlogin`, `.bash_login`)과 `~/.config/git/`에 쓰기 전에 프롬프트를 추가했습니다.
- `acceptEdits` 모드가 이제 코드 실행 권한을 부여하는 빌드 도구 config 파일(`.npmrc`, `.yarnrc*`, `bunfig.toml`, `.bazelrc`, `.pre-commit-config.yaml`, `.devcontainer/` 등)에 쓰기 전에 프롬프트를 표시합니다.
- Edit가 이제 `grep`으로 파일을 본 후 별도의 Read를 요구하지 않습니다: 단일 파일 `grep`/`egrep`/`fgrep` 명령이 read-before-edit 체크를 만족합니다.
- WSL에서 copy-on-select가 Windows 클립보드에 쓰지 않던 문제를 수정했습니다 — 이제 MobaXterm 같은 터미널이 지원하지 않는 OSC 52 대신 PowerShell interop을 사용합니다.
- `claude agents`에서 완료된 세션을 복원할 때 채팅 히스토리가 드롭되고 원래 프롬프트가 다시 실행되던 문제를 수정했습니다.
- 야간 retire 후 다시 attach된 백그라운드 세션이 대화를 잃고 원래 프롬프트를 다시 실행하던 문제를 수정했습니다.
- 부하가 많은 머신에서 백그라운드 데몬이 cold-start 중일 때 `claude --bg`가 가끔 "socket missing"으로 실패하던 문제를 수정했습니다.
- Windows에서 백그라운드 세션이 시작된 디렉토리가 `claude rm` 후에도 백그라운드 데몬이 종료될 때까지 삭제될 수 없던 문제를 수정했습니다.
- 작업을 재개한 백그라운드 에이전트가 agents 목록의 Completed 아래에 표시되던 문제를 수정했습니다.
- 매 exit마다 auto-updater가 재확인하기 때문에 `claude agents`가 세션 목록으로 돌아갈 때 몇 초간 freeze되던 문제를 수정했습니다.
- 호스트가 무거운 CPU 부하를 받는 동안 백그라운드 세션에 attach되어 있거나 agent view에 있을 때 Esc, 방향키, 타이핑이 응답하지 않게 되던 Windows 문제를 수정했습니다.
- 백그라운드 에이전트가 이를 지원하지 않는 터미널(Apple Terminal, tmux)로 terminal sync-output 마커를 emit하여 실행 중인 에이전트에 진입할 때 render artifact가 발생하던 문제를 수정했습니다.
- agents 목록에서 세션을 연 직후 마우스 휠이 transcript 대신 prompt history를 스크롤하던 문제를 수정했습니다.
- `claude agents` 뷰에서 CJK IME composition이 입력 caret이 아닌 화면 좌하단에 나타나던 문제를 수정했습니다.
- hyperlink를 지원하는 Windows 터미널에서 유효한 `file:///C:/...` 링크가 깨진 경로로 다시 쓰이던 문제를 수정했습니다.
- 프로젝트 디렉토리나 브랜치 이름에 non-ASCII 또는 특수 문자가 포함될 때 voice mode가 연결에 실패하던 문제를 수정했습니다.
- third-party provider(Bedrock/Vertex/Foundry)의 auto 모드 사용 불가 메시지가 모델을 잘못 탓하는 대신 `CLAUDE_CODE_ENABLE_AUTO_MODE` opt-in을 가리키도록 수정했습니다.
- 모델이 xhigh를 실행할 수 없을 때 `/effort ultracode`가 dynamic workflows 설정을 잘못 탓하던 문제를 수정했습니다; ultracode는 이제 이를 지원하지 않는 모델에는 제공되지 않습니다.
- SDK 또는 CLI 플래그가 적용되지 않는 다른 호스트를 통해 실행할 때 model-not-found 오류가 `--model`을 제안하던 문제를 수정했습니다.
- brief 모드가 꺼진 상태로 brief 모드 세션을 재개할 때 Claude의 과거 답변이 scrollback에서 사라지던 문제를 수정했습니다.
- register가 `v$`로 yank된 상태에서 vim 모드 `p`가 커서가 아닌 아래 라인에 paste되던 문제를 수정했습니다.
- `claude agents`에서 최근 비활성 상태였던 백그라운드 에이전트 세션을 여는 성능을 개선했습니다.
- 일상적인 액션에 대한 reasoning을 줄여 auto 모드 분류기의 latency를 개선했으며, "could not evaluate this action" 차단 가능성을 낮췄습니다.
- 백그라운드 세션 teardown(`claude rm`/`stop`, idle reap)을 개선하여 SIGKILL 전에 실행 중인 셸 서브프로세스로 SIGTERM을 보내, cleanup 핸들러가 동작하도록 했습니다.
- `CLAUDE_CODE_OPUS_4_6_FAST_MODE_OVERRIDE`를 제거했습니다; 환경 변수는 이제 no-op입니다.
- 시작 시 JetBrains plugin 설치 제안을 제거했습니다.
- dynamic-workflow 트리거 키워드를 `workflow`에서 `ultracode`로 이름을 변경했습니다. "workflow"라는 단어는 더 이상 실행을 트리거하지 않습니다; 자기 언어로 워크플로우를 요청하는 것은 여전히 동작합니다. 트리거 키워드는 프롬프트 입력에서 violet 색상으로 하이라이트됩니다.
