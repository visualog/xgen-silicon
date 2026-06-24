# xGen에서 Codex를 백엔드로 사용하는 방법

이 문서는 BrandGen/xGen 프로젝트에서 Codex CLI를 이미지 생성 백엔드처럼 사용하는 현재 구조와 실행 방법을 정리한다. 구현의 핵심은 Next.js API Route가 직접 긴 Codex 작업을 처리하지 않고, 별도 로컬 worker 프로세스에 요청을 위임하는 방식이다.

## 현재 결론

- xGen은 Codex 내부 tool을 직접 호출하지 않는다.
- 앱 서버는 `scripts/codex-worker.mjs`로 뜬 로컬 HTTP worker에 요청한다.
- worker는 `codex exec --json`을 subprocess로 실행하고 JSONL 이벤트를 해석한다.
- 이미지 생성 결과는 Codex thread id를 기준으로 `~/.codex/generated_images/<thread_id>/`에서 회수한다.
- 개발 환경에서는 Next.js 서버와 Codex worker를 함께 실행해야 한다.
- 현재 방식은 OpenAI API 키를 앱 화면에서 받는 구조가 아니라, 로컬에 설치되고 로그인된 Codex CLI 환경을 백엔드 실행 권한으로 사용한다.
- 패키징된 Electron 앱도 `codex-worker.mjs`와 Next 서버는 함께 띄우지만, Codex CLI 자체와 로그인 상태까지 앱에 포함하는 구조는 아니다.

## 제품 경계

이 프로젝트에서 "Codex를 백엔드로 사용한다"는 뜻은 앱이 ChatGPT 웹 화면이나 Codex 데스크톱 앱 내부 기능을 직접 임베드한다는 뜻이 아니다. 현재 구현은 다음 경계를 가진다.

- 사용자는 xGen 화면에서 노드, 설명, 참조 이미지, 출력 조건을 조절한다.
- xGen 앱은 이 값을 구조화된 payload로 정리한다.
- Next.js API Route는 payload를 로컬 worker로 전달한다.
- worker는 로컬 `codex` CLI를 비대화형 명령으로 실행한다.
- Codex CLI는 이미 로그인된 로컬 사용자 환경을 사용해 프롬프트 구성, 이미지 분석, 이미지 생성을 수행한다.
- xGen은 Codex가 반환한 JSONL 이벤트와 생성 파일을 해석해 다시 화면에 표시한다.

따라서 현재 방식의 장점은 사용자가 앱 안에 별도 OpenAI API 키를 입력하지 않아도 된다는 점이다. 반대로 독립 배포 관점에서는 실행 컴퓨터에 Codex CLI 설치, 로그인, 사용 권한, 네트워크 접근, 모델/이미지 생성 기능 사용 가능 상태가 필요하다.

## 전체 구조

```text
브라우저 UI
  -> src/app/api/*/route.ts
  -> src/lib/codex-worker-client.ts
  -> http://127.0.0.1:4317
  -> scripts/codex-worker.mjs
  -> codex exec --json
  -> ~/.codex/generated_images/<thread_id>/
  -> Next.js route 응답
  -> 캔버스/갤러리 표시
```

각 계층의 역할은 다음과 같다.

| 계층 | 파일 | 역할 |
| --- | --- | --- |
| UI | `src/app/page.tsx`, `src/components/nodes/*` | 사용자가 프롬프트, 스타일, 참조 이미지, 비율, 해상도, 카메라/오브젝트 설정을 구성한다. |
| Next.js Route | `src/app/api/*/route.ts` | 브라우저 요청을 검증하고 worker client에 전달한다. |
| Worker Client | `src/lib/codex-worker-client.ts` | `BRANDGEN_CODEX_WORKER_URL`로 HTTP 요청을 보내고 타임아웃과 연결 오류를 공통 처리한다. |
| Codex Worker | `scripts/codex-worker.mjs` | 요청을 직렬 큐로 처리하고 `codex exec --json`을 실행한다. |
| Codex CLI | `CODEX_BIN` | 실제 텍스트 분석, 이미지 분석, 이미지 생성을 수행한다. |
| 결과 저장 | `~/.codex/generated_images`, `src/lib/gallery-store.ts` | Codex 산출 파일을 찾고 앱 갤러리가 쓸 수 있는 이미지 URL로 저장한다. |

## 실행 방법

### 1. Codex CLI 준비

로컬에서 `codex` 명령이 실행 가능해야 한다. worker는 `CODEX_BIN`이 지정되어 있으면 해당 경로를 우선 사용하고, 지정되어 있지 않으면 `/opt/homebrew/bin/codex`, `/usr/local/bin/codex`, `PATH` 순서로 자동 탐색한다.

```bash
codex --version
```

자동 탐색이 실패하거나 특정 경로를 고정하려면 `CODEX_BIN`을 지정한다.

```bash
CODEX_BIN="$(which codex)" npm run codex-worker
```

### 2. Codex worker 실행

표준 개발 실행은 worker와 Next.js 앱을 함께 실행한다.

```bash
npm run dev
```

worker만 별도로 실행해야 할 때는 다음 명령을 사용한다.

```bash
npm run codex-worker
```

기본 worker 주소는 다음과 같다.

```text
http://127.0.0.1:4317
```

worker 상태는 `/health`에서 확인한다.

```bash
curl http://127.0.0.1:4317/health
```

포트를 바꾸려면 `BRANDGEN_CODEX_WORKER_PORT`를 지정한다.

```bash
BRANDGEN_CODEX_WORKER_PORT=4320 npm run codex-worker
```

### 3. Next.js 개발 서버 실행

Next.js 앱만 별도로 실행하려면 `dev:next`를 사용한다.

```bash
npm run dev:next
```

worker 포트를 바꿨다면 Next.js 쪽에도 같은 URL을 넘긴다.

```bash
BRANDGEN_CODEX_WORKER_URL=http://127.0.0.1:4320 npm run dev
```

### 4. Electron 개발 실행

Electron 개발 흐름은 `electron/dev.mjs`가 worker 포트를 확인하고 필요한 경우 worker를 함께 실행한다.

```bash
npm run electron:dev
```

패키징된 앱에서는 `electron/main.mjs`가 사용 가능한 worker 포트를 찾고, `BRANDGEN_CODEX_WORKER_URL`을 Next.js 서버에 주입한다.

## 환경 변수

| 변수 | 기본값 | 쓰임 |
| --- | --- | --- |
| `CODEX_BIN` | 자동 탐색 | worker가 실행할 Codex CLI 바이너리 경로 |
| `BRANDGEN_CODEX_WORKER_PORT` | `4317` | worker HTTP 서버 포트 |
| `BRANDGEN_CODEX_WORKER_URL` | `http://127.0.0.1:4317` | Next.js Route가 호출할 worker 주소 |
| `BRANDGEN_CODEX_CWD` | 현재 작업 디렉터리 | `codex exec -C`에 넘길 작업 디렉터리 |

## worker가 제공하는 주요 엔드포인트

| 엔드포인트 | 호출 함수 | 역할 |
| --- | --- | --- |
| `/translate` | `translateViaWorker` | 연결된 노드 설정을 생성용 영문 프롬프트로 정리한다. |
| `/compose-prompt` | `composePromptViaWorker` | 여러 창작/참조/잠금 소스를 최적화된 실행 프롬프트로 합친다. |
| `/translate-korean` | `translateKoreanViaWorker` | 영문 프롬프트를 갤러리 표시용 한국어로 변환한다. |
| `/generate-title` | `generateTitleViaWorker` | 결과 카드 제목을 만든다. |
| `/analyze-style` | `analyzeStyleViaWorker` | 업로드 이미지를 스타일, 캐릭터, 오브젝트 관점으로 분석한다. |
| `/analyze-consistency` | `analyzeConsistencyViaWorker` | 생성 결과에서 다음 생성에 재사용할 일관성 요소를 추출한다. |
| `/generate` | `generateViaWorker` | 최종 이미지를 생성하고 결과 이미지, `threadId`, 파일 경로, 프롬프트 정보를 반환한다. |
| `/generate-element-sheet` | `generateElementSheetViaWorker` | 선택한 앨리먼트의 전개도/시트 이미지를 생성한다. |

## `codex exec` 실행 방식

worker는 텍스트 작업과 이미지 생성 작업 모두 비대화형 `codex exec`로 실행한다.

```text
codex exec
  --json
  --skip-git-repo-check
  --ignore-rules
  -C <BRANDGEN_CODEX_CWD>
  --sandbox read-only
  [-i <image-path> ...]
  --
  <instruction>
```

중요한 운영 기준은 다음과 같다.

- `--json` 출력의 JSONL 이벤트에서 최종 agent message, `thread_id`, token usage를 추출한다.
- 이미지 입력은 임시 파일 또는 해석 가능한 로컬/앱 URL을 `-i`로 넘긴다.
- subprocess를 시작한 뒤 `stdin`을 즉시 닫아 Codex가 추가 입력을 기다리지 않게 한다.
- 긴 작업은 worker 내부 큐로 직렬화해 동시에 여러 Codex 프로세스가 경쟁하지 않게 한다.
- 기본 sandbox는 `read-only`로 둔다. 앱 생성물 회수는 Codex가 자체 생성 디렉터리에 만든 결과를 worker가 읽는 방식으로 처리한다.

## Codex 백엔드로 설계할 때의 정석 경계

Codex CLI를 백엔드처럼 쓸 때 가장 중요한 기준은 "앱이 상태와 부작용을 소유하고, Codex는 추론과 변환만 담당한다"는 것이다.

### xGen 앱이 책임지는 것

- 노드 연결 상태, 입력값, 참조 이미지 목록, 비율/해상도 같은 결정적 상태 수집
- 브라우저 상대 URL을 worker가 접근 가능한 절대 URL로 변환
- worker 호출, 타임아웃, 오류 메시지, 갤러리 저장 처리
- 생성된 data URL을 앱 데이터 디렉터리에 저장하고 화면에 표시
- 사용자가 볼 수 있는 상태 라벨, 오류, 진행 상태 관리

### Codex worker가 책임지는 것

- payload를 Codex가 이해할 instruction으로 압축
- `codex exec --json` 실행
- stdout JSONL 이벤트 파싱
- 최종 agent message, `thread_id`, token usage 추출
- 이미지 생성 파일을 `~/.codex/generated_images/<thread_id>/`에서 찾기
- 실패 시 route가 렌더링할 수 있는 오류 메시지 반환

### Codex가 책임지는 것

- 창작 입력을 이미지 생성에 적합한 영어 프롬프트로 재작성
- 업로드/참조 이미지의 스타일, 캐릭터, 오브젝트, 일관성 요소 분석
- 최종 이미지 생성
- 생성 결과를 Codex 생성 이미지 디렉터리에 기록

앱이 이미 알고 있는 노드 상태를 Codex가 다시 추측하게 만들면 안 된다. 반대로 사용자의 모호한 설명을 이미지 생성용 창작 방향으로 다듬는 작업은 Codex에 맡기는 것이 맞다.

## 프롬프트 생성 흐름

프롬프트 패널의 `AI로 다듬기` 흐름은 `/api/compose-prompt`를 사용한다.

```text
OutputNode
  -> POST /api/compose-prompt
  -> composePromptViaWorker()
  -> worker /compose-prompt
  -> composeOptimizedPromptWithCodex()
  -> rewriteCreativeDirectionWithCodex()
  -> codex exec --json
```

worker는 입력 노드를 다음처럼 분류한다.

| 분류 | 예시 | Codex 처리 |
| --- | --- | --- |
| creative | 설명, 스타일, 구도, 배경, 무드, 팔레트, 조명, 제스처, 소품, 이미지 믹스 | Codex가 하나의 창작 방향 문장으로 재작성할 수 있다. |
| reference | 캐릭터 고정, 오브젝트 고정 | 재작성 대상이 아니라 모순 방지용 참조/잠금 값으로 둔다. |
| locked | 비율, 해상도, 제한사항, 카메라 앵글, 오브젝트 방향, 밀도 | 고정값으로 유지하고 Codex가 임의로 바꾸지 못하게 한다. |
| quality | 품질 가드 | 항상 붙는 안전/품질 조건으로 유지한다. |

Codex 재작성에 실패하면 worker는 deterministic fallback으로 프롬프트를 조합한다. 이 때문에 `AI로 다듬기`가 실패해도 완전히 빈 결과가 아니라 현재 노드값 기반 실행 프롬프트를 만들 수 있다.

## 이미지 생성 결과 회수

`/generate` 흐름은 다음 순서로 동작한다.

1. UI가 현재 노드 설정과 참조 이미지를 `/api/generate`에 보낸다.
2. Next.js route가 상대 이미지 URL을 절대 URL로 정리한다.
3. `generateViaWorker`가 worker의 `/generate`로 요청한다.
4. worker가 최종 instruction을 만들고 `codex exec --json`을 실행한다.
5. JSONL 이벤트에서 `thread_id`와 완료 이벤트를 확인한다.
6. worker가 `~/.codex/generated_images/<thread_id>/`에서 최신 이미지 파일을 찾는다.
7. 이미지를 data URL로 변환해 Next.js route에 반환한다.
8. Next.js route가 `saveGeneratedImageFromDataUrl`로 앱 갤러리용 파일을 저장하고 브라우저에 응답한다.

응답에는 보통 다음 값이 포함된다.

```json
{
  "url": "/generated/...",
  "threadId": "...",
  "filePath": "/Users/.../.codex/generated_images/.../image.png",
  "imagePath": "...",
  "title": "...",
  "englishPrompt": "...",
  "koreanPrompt": "...",
  "tokenUsage": null,
  "tokenUsageBreakdown": []
}
```

## 배포와 설치 전제

현재 구조에서 Electron 앱을 다른 컴퓨터에 설치해 실행하려면 앱 파일만으로는 충분하지 않을 수 있다. 앱은 worker와 Next 서버를 함께 실행할 수 있지만, 실제 AI 실행 권한은 로컬 Codex CLI에 의존한다.

필요 조건:

- 대상 컴퓨터에 `codex` CLI가 설치되어 있어야 한다.
- worker는 `/opt/homebrew/bin/codex`, `/usr/local/bin/codex`, `PATH`를 자동 탐색한다.
- 자동 탐색이 실패하면 `CODEX_BIN`으로 경로를 지정해야 한다.
- 대상 사용자가 Codex CLI에 로그인되어 있어야 한다.
- Codex CLI가 이미지 생성 기능을 사용할 수 있어야 한다.
- Apple Silicon 배포라면 Node/Electron/native optional dependency가 arm64 기준으로 맞아야 한다.
- `~/.codex/generated_images`와 앱 userData 디렉터리를 읽고 쓸 수 있어야 한다.

즉, 현재 방식은 "앱이 자체 AI 서버를 내장한 독립 제품"이라기보다 "로컬 Codex CLI를 백엔드 작업자로 사용하는 데스크톱 도구"에 가깝다. 현재 worker는 Codex CLI 경로를 자동 탐색하고 `/health`로 상태를 노출하지만, 완전 독립 배포를 목표로 하면 설치 시 Codex CLI 존재 확인과 로그인 상태 안내 UI가 추가로 필요하다.

## 현재 구현에서 주의할 점

- `WORK_GUIDE.md`에는 과거 Gemini/Pollinations 중심 설명이 남아 있다. 실제 현재 Codex 경로는 `scripts/codex-worker.mjs`와 `src/lib/codex-worker-client.ts`를 기준으로 확인한다.
- `src/lib/codex-cli.ts`에는 direct subprocess helper가 남아 있지만, 앱 route의 주 경로는 worker 위임 방식이다.
- Codex worker가 꺼져 있으면 route는 `Codex worker에 연결할 수 없습니다. npm run dev로 worker와 앱을 함께 실행하거나, 별도 터미널에서 npm run codex-worker를 실행하세요.` 계열 오류를 반환한다.
- 이미지 생성은 최대 300초까지 기다릴 수 있다. 중간에 타임아웃이 나면 worker 로그에서 `runCodexExecForImageGeneration:timeout`을 확인한다.
- 생성 파일을 찾지 못하면 `~/.codex/generated_images/<thread_id>/`에 실제 파일이 있는지 확인한다.
- Codex 로그인, 권한, 모델 사용 가능 여부는 앱이 아니라 로컬 Codex CLI 환경에 의존한다.
- 현재 worker는 JSONL 이벤트를 직접 파싱한다. 더 강한 계약이 필요하면 텍스트 작업부터 `--output-schema`와 `--output-last-message` 기반으로 고도화하는 것이 좋다.
- 이미지 생성은 최종 텍스트 응답보다 생성 파일 존재가 더 중요한 성공 신호다. 따라서 `thread_id`, `saved_path`, 생성 디렉터리 조회를 함께 봐야 한다.

## 향후 보강하면 좋은 항목

- 앱 내 진단 화면 추가
- Codex CLI 설치/로그인/이미지 생성 가능 여부 사전 점검
- 실패 유형을 `codex_timeout`, `codex_process_failed`, `codex_non_json_output`, `codex_schema_validation_failed`, `codex_artifact_not_found`처럼 코드화
- 텍스트 응답 작업에 JSON Schema 출력 계약 적용
- 이미지 생성 성공 판정을 `saved_path` 이벤트, 생성 디렉터리 신규 파일, inline image fallback 순서로 더 명확히 구조화
- 배포 패키지에서 arm64/x64 Node native dependency가 섞이지 않도록 빌드 검증 자동화

## 빠른 점검 명령

Codex 바이너리 확인:

```bash
codex --version
```

worker 기동 확인:

```bash
npm run codex-worker
```

다른 터미널에서 worker 연결 확인:

```bash
curl -s -X POST http://127.0.0.1:4317/translate \
  -H 'Content-Type: application/json' \
  -d '{"prompt":"고급 스킨케어 병","ratio":"1:1","resolution":"HD"}'
```

Next.js route 연결 확인:

```bash
npm run dev
curl -s -X POST http://127.0.0.1:3000/api/translate \
  -H 'Content-Type: application/json' \
  -d '{"prompt":"고급 스킨케어 병","ratio":"1:1","resolution":"HD"}'
```

## 트러블슈팅

### worker 연결 실패

원인:

- `npm run codex-worker`가 실행 중이 아니다.
- worker 포트와 `BRANDGEN_CODEX_WORKER_URL`이 다르다.
- 다른 프로세스가 `4317` 포트를 사용 중이다.

대응:

```bash
BRANDGEN_CODEX_WORKER_PORT=4320 npm run codex-worker
BRANDGEN_CODEX_WORKER_URL=http://127.0.0.1:4320 npm run dev
```

### Codex CLI 실행 실패

원인:

- `CODEX_BIN` 경로가 잘못됐다.
- Codex CLI 로그인이 되어 있지 않다.
- 현재 환경에서 Codex 실행 권한이 없다.

대응:

```bash
which codex
codex --version
CODEX_BIN="$(which codex)" npm run codex-worker
```

### 이미지 생성 완료 후 파일을 찾지 못함

원인:

- JSONL 이벤트에서 받은 `thread_id`와 실제 생성 디렉터리가 맞지 않는다.
- Codex가 inline image만 반환했거나 생성 파일 기록 위치가 달라졌다.
- 생성은 실패했지만 완료 이벤트처럼 보이는 출력이 남았다.

대응:

```bash
ls ~/.codex/generated_images
ls ~/.codex/generated_images/<thread_id>
```

worker 로그의 `generateImageWithCodex:fileLookup`와 `runCodexExecForImageGeneration:events`를 같이 확인한다.

### 요청이 너무 오래 걸림

원인:

- 이미지 생성 자체가 오래 걸린다.
- 참조 이미지가 많거나 instruction이 길다.
- worker 큐 앞에 다른 작업이 있다.

대응:

- `/translate`나 `/analyze-style`은 90초 안에 끝나는지 먼저 확인한다.
- `/generate`는 최대 300초 타임아웃을 기준으로 본다.
- worker 로그의 `request:start`, `request:success`, `elapsedMs`를 확인한다.

## 관련 문서

- `CODEX_REPLACEMENT_PLAN.md`: Gemini/Pollinations에서 Codex worker로 전환한 이력과 원인 분석
- `CODEX_CLI_SURVEY.md`: `codex exec` 중심의 CLI 조사
- `CODEX_INTERNAL_TOOLS.md`: Codex 내부 tool 구조 조사
- `WORK_GUIDE.md`: xGen 앱 구조와 기존 작업 가이드
