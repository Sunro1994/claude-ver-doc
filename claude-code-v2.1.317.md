# Claude Code v2.1.317

> 작성일: 2026-11-04

---

# 📋 요약본

## 🎉 신기능 (10건)
- **`/schedule` 커넥터 경고** — 새 클라우드 예약 작업에 요청하지 않은 커넥터가 붙으면 경고하고, 제거 방법을 알려준다.
- **계정 이메일 전송 전 확인** — 웹·셸 도구 호출이 계정 이메일 주소를 네트워크로 보내려 하면 실행 전에 묻는다.
- **Agent SDK 훅 `onFailure: "block"`** — 훅 콜백이 실패하면 동작을 그대로 실행하지 않고 막는다. 실패했을 때 막는 쪽으로 동작하는 가드 훅을 만들 수 있다.
- **Desktop 원격 관리 설정 로드 알림** — Claude Desktop Code 탭에서 조직의 원격 관리 설정이 아직 로드되지 않았으면 알리고, 로드되면 다시 알린다.
- **auto mode 서브에이전트 판정 실패 알림** — auto mode 검사가 서브에이전트의 도구 호출에 답을 내지 못하면 메인 화면에 알림을 띄운다. 이전에는 아무것도 표시되지 않았다.
- **OTel 속성 추가** — 메트릭·이벤트·스팬에 `anthropic.plan`, `anthropic.seat_type`, `anthropic.provider`, `anthropic.custom_base_url`을 붙인다.
- **게이트웨이 비용 리포트 API** — `GET /v1/organizations/analytics/cost`로 기간별 지출을 조회한다. 전체·개발자별·일별·IdP 그룹별로 묶어 볼 수 있다.
- **IdP 그룹 일별 기록** — `admin:`이 설정된 Claude apps 게이트웨이는 개발자별 IdP 그룹을 매일 기록한다. 기록은 `admin.identity_retention_days` 동안 보관하고, 비용 리포트가 이 기록으로 그룹을 묶는다.
- **`CLAUDE_CODE_DISABLE_NESTED_SESSION_ID`** — self-hosted runner에서 `1`로 설정하면, 세션 안에서 실행한 `claude -p`가 이전 버전처럼 그 세션의 ID와 트랜스크립트를 쓴다.
- **[Cloud] 링크 카드** — MCP 서버가 방문을 요청한 링크를 카드로 띄워 열거나 거절할 수 있다. 이전에는 요청이 눈에 띄지 않고 지나갔다.

## 🛠️ 개선/수정 (16건)
- **auto mode 안정화** — LLM 게이트웨이가 안전 검사에 403/422를 돌려주면 매 턴 실패하던 문제를 고쳤다. 클라우드 세션에서 Artifact 도구가 업로드·DB 쓰기·outputs 저장을 할 때 승인 대기로 멈추던 문제도 고쳤다. tmux·iTerm2 팀원이 수동 모드인 리더를 무시하고 auto mode로 시작하던 문제도 해결했다.
- **`claude -p` 신뢰성** — 디스크가 가득 차거나 쿼터를 넘어 트랜스크립트나 `~/.claude.json` 저장에 실패하면 이제 오류를 출력하고 exit 1로 끝난다. 이전에는 실패해도 exit 0이었다.
  - 클라우드·runner 세션 안에서 실행한 `claude -p`가 바깥 세션의 ID를 공유하고 제목을 덮어쓰던 문제를 고쳤다.
  - 플러그인이 많은 헤드리스 세션의 메모리 과다 사용과 느린 시작을 개선했다.
- **압축(compaction) 안정화** — CLAUDE.md가 매우 크고 지난 전송 뒤 바뀐 경우 자동 압축 후 "Prompt is too long"이 나던 문제를 고쳤다. 압축 요청을 줄이는 과정에서 이전 요약이 사라지던 문제와, 게이트웨이가 Bedrock의 "Input is too long." 오류를 가려 압축이 일어나지 않던 문제도 고쳤다.
- **세션 재개(resume)** — Claude가 이미 아는 파일 변경을 다시 알려주던 문제를 고쳤다. 앞서 꺼진 도구 때문에 실패한 내장 도구를 재개 후에도 쓰지 않던 문제와, `--from-pr`가 오래된 세션을 찾지 못하던 문제도 고쳤다. 종료 시 표시하는 재개 안내에는 실행할 때 쓴 플래그를 함께 보여준다.
- **MCP** — Desktop에서 project·local MCP 서버가 첫 턴 뒤 끊기던 문제를 고쳤다. env 설정에서 빈 값으로 둔 `AWS_BEARER_TOKEN_BEDROCK`은 이제 변수 자체를 지워서 넘긴다. 서버가 머신의 AWS 자격증명을 쓸 수 있다.
- **네트워크·인증 오류 메시지** — 지역·네트워크 차단(403)을 로그인 실패로 잘못 보여주던 문제를 고쳤다. 루트 인증서 갱신 후 TLS 검사 프록시 뒤에서 나던 "unable to get local issuer certificate" 오류도 고쳤다. 게이트웨이와 Foundry의 오류 안내도 더 정확하게 바꿨다.
- **OpenTelemetry 내보내기** — 프록시 뒤 https 전송이 누락되던 문제, 403 프록시에 연결 시도가 쏟아지던 문제를 고쳤다. 응답 없는 프록시에서 무한 대기하던 전송은 이제 10초 뒤 끊는다. `OTEL_EXPORTER_OTLP_TIMEOUT`으로 최대 30초까지 늘릴 수 있다.
- **검색·읽기 도구** — Grep·Glob이 시간 제한에 걸려 일부만 찾은 결과를 Claude가 전체 결과로 여기던 문제를 고쳤다. PDF 메타데이터 때문에 페이지 수를 적게 세던 문제도 고쳤다. Read 도구의 "file unchanged" 안내 문구는 제거했고, 바뀌지 않은 파일을 다시 읽어도 내용을 돌려준다.
- **서브에이전트·팀** — 메인 대화와 다른 모델로 도는 서브에이전트는 이제 세션의 effort 대신 그 모델에 저장된 effort나 기본값을 쓴다. SendMessage는 실행 중인 명령을 멈추지 않고 백그라운드로 옮겨 메시지를 더 빨리 전달한다. 입력 지우려고 누른 Ctrl+C가 백그라운드 에이전트까지 멈추던 문제와, 팀 inbox·팀원이 꼬이던 문제도 고쳤다.
- **예약 작업·`/loop`** — 필드가 빠진 요청에서 `/loop` 자가 페이스 wakeup이 예약되지 않던 문제를 고쳤다. `/schedule` 결과에 다음 실행 시각과 링크가 빠지던 문제도 고쳤다. 예약 작업을 끈 뒤 저장된 작업을 조회·삭제할 수 없던 문제도 고쳤다.
- **설정 반영** — 프로젝트의 `effortLevel`이 미리 시작된 세션에서 무시되던 문제를 고쳤다. 실행 직후 1초 안에 고친 설정이 반영되지 않던 문제, 일부 실행에서 오래된 트랜스크립트가 정리되지 않던 문제도 고쳤다. `DISABLE_PROMPT_CACHING_OPUS`/`_SONNET`은 이제 `[1m]` 등 다른 표기의 기본 모델에도 적용된다.
- **self-hosted runner 복구** — 5xx 오류나 heartbeat 무응답이 생기면 실패한 연결을 재사용하지 않고 새 연결을 연다. 계획 승인 대기 중 재시작하면 대화가 사라지던 문제, 머신을 옮기면 꺼둔 MCP가 다시 켜지던 문제도 고쳤다.
- **`/team-onboarding` 삭제 안전성** — 어떤 가이드인지 지정하지 않은 삭제 요청에 Claude가 가장 최근 가이드를 지우던 문제를 고쳤다. 서버가 삭제를 거절했는데도 삭제됐다고 말하던 문제도 고쳤다.
- **VSCode 확장** — 포크한 대화에서 메시지가 빠지던 문제를 고쳤다. 시작 지연으로 메시지가 사라지던 문제, `chat.fontSize`를 키워도 UI 크기가 그대로이던 문제, 텔레메트리가 꺼져 있으면 `ultrathink`가 effort를 올리지 않던 문제 등 7건도 고쳤다.
- **Windows** — 경로 조회가 실패하는 볼륨에서 모든 도구 호출을 거부하던 문제를 고쳤다. 임시 경로가 길어져 260자 제한에 걸리던 문제도 고쳤다.
- **Remote Control·Cloud·기타** — 포크 이름 규칙을 개선했다. 재시작 직후 유휴 세션에 보낸 메시지가 응답을 받지 못하던 문제를 고쳤다. 기존 네트워크 시크릿을 조용히 덮어쓰던 문제를 고쳤다. 예약 작업이 조직 기본 환경을 무시하던 문제를 고쳤다. 스크린 리더가 갱신마다 낭독하던 문제를 고쳤다. claude.ai 스킬이 10분마다 다시 받아지던 문제를 고쳤다. Slack 아티팩트 카드를 단순하게 바꿨다.

## 🔑 이번 버전의 핵심 키워드
**"조용한 실패를 드러내기"** — 실패했는데 성공처럼 보이던 동작을 바로잡았다. exit 0이던 `claude -p`, 일부만 찾은 검색 결과, 로그인 실패로 보이던 네트워크 차단, 거절됐는데 삭제됐다고 하던 가이드가 이제 제대로 드러난다.

---

# 📜 원문 (한글 번역본)

> 원문 ChangeLog를 원래 순서 그대로 한 줄도 빠짐없이 번역한 문서입니다.

- 새 클라우드 예약 작업에 요청하지 않은 커넥터가 붙으면 `/schedule`이 경고하고 제거 방법을 안내하도록 추가
- 웹·셸 도구 호출이 계정 이메일 주소를 네트워크로 보내기 전에 묻는 검사 추가
- Agent SDK 훅 콜백에 `onFailure: "block"` 추가 — 콜백이 실패하면 동작을 실행하지 않고 막는다
- 조직의 원격 관리 설정이 세션에 로드되지 않았을 때와, 로드됐을 때 Claude Desktop Code 탭에 알림 추가
- auto mode 검사가 서브에이전트의 도구 호출에 답을 내지 못할 때 알림 추가 — 이전에는 메인 화면에 아무것도 표시되지 않았다
- OTel 메트릭·이벤트·스팬에 `anthropic.plan`, `anthropic.seat_type`, `anthropic.provider`, `anthropic.custom_base_url` 추가
- Claude apps 게이트웨이 관리자 API에 비용 리포트 `GET /v1/organizations/analytics/cost` 추가 — 기간별 과거 지출을 전체·개발자별·일별·IdP 그룹별로 조회한다
- `admin:`이 설정된 Claude apps 게이트웨이에서 개발자별 IdP 그룹을 매일 기록하는 기능 추가 — `admin.identity_retention_days` 동안 보관하며 비용 리포트가 이 기준으로 그룹을 묶는다
- `CLAUDE_CODE_DISABLE_NESTED_SESSION_ID` 추가 — self-hosted runner에서 `1`로 설정하면 세션 안에서 실행한 `claude -p`가 이전 버전처럼 그 세션의 ID와 트랜스크립트를 사용한다
- 일부 Claude desktop 세션에서 project·local MCP 서버가 첫 턴 후 연결이 끊기던 문제 수정
- base URL로 설정한 LLM 게이트웨이가 서버 측 안전 검사에 403 또는 422로 응답하면 auto mode가 매 턴 실패하던 문제 수정 (apiKeyHelper를 쓰는 403은 기존과 동일)
- `claude auth status`가 느린 토큰 갱신이 저장되기 전에 종료되어 다음 실행 때 로그아웃될 수 있던 문제 수정
- 앱이 미리 시작해 두었다가 프로젝트에서 여는 세션(예: desktop 앱 Code 탭의 새 세션)에서 프로젝트의 `effortLevel` 설정이 무시되던 문제 수정
- 세션이 많은 프로젝트에서 연결된 세션이 첫 페이지보다 오래되면 `claude --from-pr`가 "No conversations found"를 보고하던 문제 수정
- claude.ai와 모바일 앱에서 동시에 뜬 권한 프롬프트 두 개 중 두 번째에 파일 경로나 명령이 표시되지 않던 문제 수정
- Remote Control과 SDK 호스트가 mod의 도구 호출에 "don't ask again"을 제시하던 문제 수정
- 클라우드·SDK 세션에서 제목 생성 중 새 메시지나 Stop이 도착하면 세션 제목이 사라지던 문제 수정
- Claude가 요청에서 필드를 빠뜨리면 자가 페이스 `/loop` wakeup이 가끔 예약되지 않던 문제 수정
- 클라우드 세션에서 Artifact 도구가 업로드·데이터베이스 쓰기·outputs 폴더를 통한 파일 저장을 할 때 auto mode가 승인 대기로 멈추던 문제 수정
- claude.ai에서 동기화한 스킬을 디스크에 쓸 수 없으면 사라지거나 10분마다 다시 다운로드되던 문제 수정
- `/schedule`이 클라우드 예약 작업을 생성·수정한 뒤 결과에서 다음 실행 시각과 링크를 빠뜨리던 문제 수정
- 스크린 리더 모드에서 실행 중인 서브에이전트의 경과 시간과 토큰 수가 바뀔 때마다 낭독되던 문제 수정
- 지역·네트워크 차단(HTTP 403)이 로그인 실패로 표시되던 문제 수정 — 이제 오류가 차단을 설명한다
- 클라우드 세션에서 동기화된 플러그인에 같은 서버가 포함되어 있으면, 정상 동작하는 claude.ai 커넥터를 Claude가 인증 필요 또는 실패로 말하던 문제 수정
- 디스크 가득 참이나 쿼터 초과로 트랜스크립트나 ~/.claude.json 쓰기가 유실되어도 `claude -p`가 0으로 종료하던 문제 수정 — 이제 오류를 출력하고, text·json 출력에서는 1로 종료한다. 가득 찬 NFS export는 감지하지 못할 수 있다
- 실행 직후 약 1초 안에 수정한 설정 파일이 다른 설정 파일이 다시 바뀔 때까지 반영되지 않던 문제 수정
- `--setting-sources`를 쓰는 실행처럼 일부 실행이 정리를 건너뛰는 머신에서 오래된 트랜스크립트가 정리되지 않던 문제 수정
- 삭제한 에이전트 팀 inbox가 팀원의 늦은 메시지로 다시 생성되던 문제 수정
- 다시 만든 에이전트 팀원이 이전의 종료 승인 때문에 팀에서 제거되던 문제 수정
- 예약 작업을 끈 뒤 저장된 예약 작업을 조회하거나 삭제할 수 없던 문제 수정
- 어떤 가이드인지 지정하지 않고 삭제를 요청하면 Claude가 가장 최근에 수정한 `/team-onboarding` 가이드를 삭제하던 문제 수정
- 서버가 삭제를 거부했는데도 Claude가 `/team-onboarding` 가이드가 삭제됐다고 말하던 문제 수정
- Claude apps 게이트웨이가 Amazon Bedrock의 "Input is too long." 오류를 숨겨, 세션이 압축하지 않고 매 턴 "upstream rejected the request"로 실패하던 문제 수정
- 계획 승인 대기 중 재시작된 self-hosted runner 세션이 최근 턴이나 대화 전체를 잃던 문제 수정
- 매우 큰 CLAUDE.md가 마지막 전송 이후 바뀐 세션에서 자동 압축 후 "Prompt is too long"이 나던 문제 수정
- 명령을 등록하는 플러그인이 많은 헤드리스 세션의 높은 메모리 사용과 느린 시작 수정
- env 설정에서 `AWS_BEARER_TOKEN_BEDROCK`을 빈 값으로 두면 stdio MCP 서버가 빈 값을 받던 문제 수정 — 이제 변수를 해제해 서버가 머신의 AWS 자격증명을 쓸 수 있다
- 루트 인증서 갱신 후 일부 TLS 검사 프록시 뒤에서 API 요청이 "unable to get local issuer certificate"로 실패하던 문제 수정
- 압축이 자기 요청을 줄여야 할 때 매우 긴 대화가 이전 요약을 잃던 문제 수정
- PDF 자체 메타데이터 때문에 Read와 @-멘션이 페이지 수를 적게 셀 수 있던 문제 수정
- `DISABLE_PROMPT_CACHING_OPUS`와 `DISABLE_PROMPT_CACHING_SONNET`이 기본 모델의 `[1m]`·다른 리전·날짜 없는 표기에 효과가 없던 문제 수정
- 내 아티팩트가 200개 이상이면 `/artifacts`와 Artifact 도구의 공유 목록에 공유 아티팩트가 표시되지 않던 문제 수정
- 검색이 시간 제한에 걸린 Grep·Glob의 부분 결과를 Claude가 완전한 결과로 취급하던 문제 수정
- 프록시를 거친 `https://` 엔드포인트로의 OpenTelemetry 내보내기가 다른 내보내기 진행 중에 시작되면 전송되지 않던 문제 수정
- `http://` 엔드포인트로의 OpenTelemetry 내보내기를 차단(HTTP 403)하는 프록시에 연결 시도가 쏟아지던 문제 수정
- 응답하지 않는 프록시 뒤에서 OpenTelemetry 내보내기가 무한정 멈추던 문제 수정 — 이제 10초 후, 또는 `OTEL_EXPORTER_OTLP_TIMEOUT`으로 최대 30초 후 시간 초과된다
- 재개한 세션이 Claude가 이미 아는 파일 변경을 다시 알려주던 문제 수정
- 앞서 도구가 꺼져 호출이 실패한 뒤, 재개한 세션에서 Claude가 가끔 내장 도구를 쓰지 않던 문제 수정
- `disableRemoteControl` 설정으로 Remote Control이 꺼져 있을 때 `/remote-control`이 그 사실 대신 "Unknown command"로 답하던 문제 수정
- 리더 세션이 수동 모드인데 tmux·iTerm2 창의 에이전트 팀원이 auto mode로 시작하던 문제 수정
- 백그라운드 세션이 업그레이드·종료될 때 방금 바꾼 권한 모드를 가끔 잃던 문제 수정
- 프롬프트에서 입력한 텍스트를 지우려고 누른 Ctrl+C가 실행 중인 백그라운드 에이전트를 모두 멈추던 문제 수정
- 리포트 전송 중 /feedback이 "Enter to confirm"을 표시하던 문제 수정
- 중지된 셸 명령의 자식 프로세스가 가끔 SIGTERM을 두 번 받아 일부 프로그램이 정리 작업을 건너뛰던 문제 수정
- 클라우드·self-hosted runner 세션 안에서 실행한 `claude -p`가 그 세션의 ID를 공유하던 문제 수정 — 세션 트랜스크립트에 기록되고, 재시작 시 엉뚱한 대화가 재개될 수 있었다
- 클라우드·self-hosted runner 세션 안에서 실행한 `claude -p`가 자체 제목을 생성해 그 세션에 보내던 문제 수정
- Microsoft Foundry에서 Azure 자격증명을 불러올 수 없을 때의 오류 개선 — 확인·갱신하라고 안내하고 `cloud_credential_error`로 보고한다
- `/design-sync` 개선 — 디자인 시스템이 Claude로 이전됐으면 처음에 알리고, 업로드 단계에서 실패하지 않고 빌드 전에 멈춘다
- 필수 Claude apps 게이트웨이에 연결할 수 없을 때의 시작 오류 개선 — 로그인 대신 네트워크를 가리키고, 게이트웨이 TLS 인증서를 검증할 수 없으면 그렇다고 알린다
- 종료 시 표시되는 "Resume this session with" 안내 개선 — 실행 시 쓴 플래그(예: `--chrome --debug`)를 `--resume` 앞에 반복해 보여준다
- self-hosted runner의 서버 오류 복구 개선 — 501·529 이외의 5xx 후 다음 poll은 실패한 연결을 재사용하지 않고 새 연결을 연다
- self-hosted runner 세션의 서버 오류 복구 개선 — 501·529 이외의 5xx 후 세션은 실패한 연결을 재사용하지 않고 새 연결을 연다
- self-hosted runner 세션의 연결 무응답 복구 개선 — heartbeat가 응답을 받지 못하면 유휴 연결을 하나씩 시도하지 않고 새 연결을 연다
- 실행 중인 백그라운드 에이전트에 보내는 SendMessage 메시지가 더 일찍 도착하도록 변경 — 실행 중인 명령은 중지하지 않고 백그라운드로 옮긴다
- 메인 대화와 다른 모델로 동작하는 서브에이전트·팀원이 세션의 effort 레벨 대신 그 모델에 저장된 effort 레벨이나 기본값을 쓰도록 변경
- 종료 시 플러그인 모니터에 대해서는 "Background work is running" 프롬프트를 건너뛰도록 변경
- 내장 `plugin-authoring` 스킬이 직접 만든 mod가 동작하면 공유를 도와주겠다고 한 번 제안하도록 변경
- Read 도구의 "file unchanged since your last Read" 대체 응답 제거 — 바뀌지 않은 파일을 다시 읽어도 내용을 돌려준다
- Windows: 네이티브 경로 조회가 실패하는 일부 볼륨에서 모든 도구 호출이 거부되던 문제 수정 — 작업 디렉터리 검사가 이제 폴더의 고유 식별자를 비교한다
- Windows: Claude Desktop이 시작하지 않은 세션에서 세션 scratchpad 등 임시 경로가 프로젝트 경로 길이만큼 길어져, 그 안에 clone한 저장소가 260자 경로 제한에 걸리던 문제 수정
- Gateway: 그룹 공용 예산이 소진된 뒤 상태 표시줄과 `/usage`가 개발자 개인 지출 한도를 100% 사용으로 표시하던 문제 수정
- Self-hosted runner: 세션이 새 runner로 옮겨 가고 턴이 `CLAUDE_CODE_RESUME_INTERRUPTED_TURN_MAX_AGE_MS`보다 오래되면 Claude가 중단된 도구 호출을 보지 못하던 문제 수정
- Self-hosted runner: 세션 서비스가 끄기 설정 저장을 거부한 경우, 세션이 새 머신으로 옮겨 가면 꺼둔 MCP 서버가 다시 켜지던 문제 수정
- Remote Control: 앱이 포크 이름을 지정하지 않을 때의 이름 개선 — 긴 이름도 "(fork)" 끝부분을 유지하고, `claude remote-control`로 시작한 세션에서 "Name (fork)"의 포크는 "Name (fork 2)"가 된다
- [VSCode] 포크한 대화에서 메시지가 빠지던 문제 수정 — 병렬로 실행한 도구 호출 중 하나만 남고, 압축이 남긴 마지막 메시지가 사라져 Claude의 답변에 해당 질문이 없을 수 있었다
- [VSCode] Claude가 제시간에 시작을 마치지 못하면 메시지가 사라지던 문제 수정 — 이제 오류를 보여주기 전에 Claude를 한 번 더 시작한다
- [VSCode] 요청이 지역·네트워크 때문에 차단되면 로그인 화면이 열리던 문제 수정
- [VSCode] Account 패널에서 플랜 이름의 두 번째 단어가 소문자로 표시되던 문제 수정
- [VSCode] Claude 탭의 파일 링크가 다른 에디터 그룹이 아니라 채팅 위에 열리던 문제 수정
- [VSCode] `chat.fontSize`를 키워도 Claude 패널의 첨부 칩·메뉴·배너·대화상자가 작게 유지되던 문제 수정
- [VSCode] 텔레메트리가 꺼져 있으면 `ultrathink`가 해당 턴의 effort를 올리지 않고 무지개 표시도 보이지 않던 문제 수정
- [Cloud sessions] 클라우드 세션에 링크 카드 추가 — MCP 서버가 방문을 요청한 링크를 놓치지 않고 열거나 거절할 수 있다
- [Cloud sessions] 관리자 설정의 조직 환경 대화상자를 개인 대화상자의 짧은 레이아웃으로 변경 — 각 섹션은 행에서 열리고, 저장하지 않은 입력이 있으면 닫기 전에 묻는다
- [Cloud sessions] 이미 시크릿이 있는 호스트에 네트워크 시크릿을 추가하면 조용히 교체되던 문제 수정 — Add secret 양식이 거부하고 기존 시크릿을 안내한다
- [Cloud sessions] 새 예약 작업이 조직 기본 환경을 무시하던 문제 수정 — 양식이 Anthropic 호스팅 기본값 대신 관리자가 고른 환경으로 시작한다
- [Remote Control] `claude remote-control`을 재시작한 뒤 이전 메시지로부터 1분 안에 유휴 세션에 보낸 다음 메시지가 응답받지 못하던 문제 수정
- [Claude Tag] Slack에 새로 붙여 넣은 아티팩트 링크가 Slack 사이드 패널 대신 Open 버튼이 있는 단순한 카드를 보여주고, 버튼을 누르면 Claude에서 열리도록 변경

---

## 🎯 챌린지

이번 버전에서 내 환경에 적용해볼 만한 항목입니다.

### 1. 서브에이전트 Opus effort를 명시해 고정
- **파일**: `~/.claude/settings.json`
- **근거**: 이번 버전부터 메인과 다른 모델로 도는 서브에이전트는 세션의 `effortLevel`(`xhigh`)이 아니라 그 모델에 저장된 effort나 기본값을 쓴다. 메인은 `opus[1m]`이고 CLAUDE.md §5는 모든 subagent를 Opus로 지정한다. 1M이 아닌 Opus가 별도 모델로 판정되면 서브에이전트 effort가 기본값으로 내려갈 수 있다. 이 판정 여부는 확인되지 않은 가정이다. `modelSettings`에 `"claude-opus-5-5": { "effortLevel": "xhigh" }`를 추가해 의도한 수준을 고정한다. 기존 `claude-fable-5-1` 항목 옆에 넣는다.
- **난이도**: ★☆☆ (약 5분)

### 2. 체인지로그 동기화 cron에서 `claude -p` 종료 코드 검사
- **파일**: `~/.claude/skills/claude-changelog-sync/` 아래의 동기화 스크립트 (`claude -p --model opus`를 호출하는 부분)
- **근거**: 이번 버전부터 `claude -p`는 디스크가 가득 차거나 쿼터 때문에 저장에 실패하면 exit 1로 끝난다. 매일 08:00 자동 실행에서 종료 코드가 0이 아닌 결과는 `~/claude-ver-doc/`에 저장하지 않게 하고, 실패 로그를 남기는 분기를 추가한다. 그러면 깨진 버전 문서가 조용히 쌓이지 않는다.
- **난이도**: ★★☆ (약 15분)

### 3. 전역 CLAUDE.md에서 SSH 키 표를 메모리로 분리
- **파일**: `~/.claude/CLAUDE.md` → `~/.claude/projects/-/memory/reference-ssh-keys.md` (+ `MEMORY.md` 한 줄 추가)
- **근거**: 이번 버전은 큰 CLAUDE.md가 바뀐 뒤 자동 압축에서 "Prompt is too long"이 나던 문제를 고쳤다. 사용자의 전역 CLAUDE.md는 4KB를 넘고, 모든 세션에 매번 실린다. 작업 규칙이 아닌 참조 정보인 SSH 키 경로 표를 reference 메모리로 옮기면 매 세션의 고정 컨텍스트가 줄어든다. CLAUDE.md에는 "SSH 키 위치는 메모리 참조, 접속 전 사전 허가" 한 줄만 남긴다.
- **난이도**: ★☆☆ (약 10분)
