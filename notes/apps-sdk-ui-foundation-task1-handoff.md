# Apps SDK UI 적용 Task 1 핸드오프

작성일: 2026-06-04
브랜치: `feature/apps-sdk-ui-foundation`
작업명: Apps SDK UI 파운데이션 연결과 노드 라인 컬러 단순화

## 1. 작업 목적

현재 xGen 노드 캔버스는 각 노드 타입마다 서로 다른 포트 컬러가 라인에도 그대로 적용되어 화면이 지나치게 화려하게 보인다. 이번 Task 1의 목표는 전체 UI를 한 번에 바꾸지 않고, Apps SDK UI 디자인 시스템을 사용할 수 있는 기반만 먼저 연결한 뒤 라인 컬러를 입력/출력 흐름 중심으로 단순화하는 것이다.

이번 태스크는 다음 작업을 위한 기반 작업이다.

- Apps SDK UI foundation CSS를 프로젝트에 연결한다.
- Tailwind 4 처리 파이프라인을 추가한다.
- React Flow 엣지 컬러를 노드별 컬러에서 흐름별 컬러로 바꾼다.
- 노드 포트와 핸들 색상은 유지해서 각 노드의 정체성은 보존한다.
- 이후 태스크에서 `SelectControl`, `SegmentedControl`, `Button` 같은 Apps SDK UI 컴포넌트를 점진적으로 적용할 수 있게 한다.

## 2. 적용 범위

이번 태스크에서 의도적으로 처리한 범위는 작다.

- 파운데이션 CSS 연결
- Tailwind 4 PostCSS 설정 추가
- xGen 전용 bridge token 추가
- React Flow 라인 스타일 통합
- before/after 스크린샷 저장
- 빌드 검증과 audit 리스크 기록

이번 태스크에서 의도적으로 제외한 범위는 다음과 같다.

- `SelectControl` 등 Apps SDK UI React 컴포넌트 실제 화면 적용
- 노드 쉘 전체 리디자인
- Style Reference Modal 구조 변경
- 백엔드 선택/프리뷰 모드 같은 새 기능 추가
- 포트/핸들 색상 통합

## 3. 구현 내용

### 3.1 Apps SDK UI 패키지 설치

추가된 의존성:

- `@openai/apps-sdk-ui`
- `tailwindcss`
- `@tailwindcss/postcss`

관련 파일:

- `package.json`
- `package-lock.json`

확인한 패키지 조건:

- `@openai/apps-sdk-ui@0.2.2`
- React peer dependency: React 18 또는 19
- Tailwind peer dependency: Tailwind 4
- CSS export: `@openai/apps-sdk-ui/css`
- 컴포넌트 export 예: `@openai/apps-sdk-ui/components/SelectControl`

### 3.2 Tailwind 4 PostCSS 설정 추가

새 파일:

- `postcss.config.mjs`

내용:

- `@tailwindcss/postcss` 플러그인을 등록했다.
- Apps SDK UI CSS와 Tailwind 4 layer 처리를 위해 필요하다.

### 3.3 전역 CSS 연결 방식 조정

수정 파일:

- `src/app/globals.css`
- `src/app/layout.tsx`

`src/app/globals.css`에는 다음 import가 추가됐다.

- `@import "tailwindcss";`
- `@import "@openai/apps-sdk-ui/css";`
- `@source "../../node_modules/@openai/apps-sdk-ui";`

기존 xGen 디자인 토큰 파일인 `design-md/variables.css`는 `src/app/layout.tsx`에서 전역 CSS로 직접 import하도록 옮겼다. 이 조정은 Tailwind/App SDK CSS import 이후 기존 상대 경로 해석이 dev 서버에서 흔들리는 문제를 피하기 위한 것이다.

### 3.4 xGen bridge token 추가

수정 파일:

- `src/app/globals.css`

추가된 토큰:

- `--flow-line-input`
- `--flow-line-output`
- `--flow-line-pending`

의미:

- `--flow-line-input`: 프롬프트, 스타일, 설정, 선택 노드가 output node로 들어가는 입력 라인
- `--flow-line-output`: output node 이후 canvas, image layer, mask edit, element result로 이어지는 생성 결과 라인
- `--flow-line-pending`: 사용자가 연결 중일 때 보이는 임시 라인

라이트/다크 모드 모두에 값을 정의했다.

### 3.5 React Flow edge 스타일 통합

수정 파일:

- `src/app/page.tsx`

추가된 공통 스타일 상수:

- `FLOW_INPUT_EDGE_STYLE`
- `FLOW_OUTPUT_EDGE_STYLE`
- `FLOW_PENDING_EDGE_STYLE`

변경 전:

- prompt 라인: `--port-prompt`
- style 라인: `--port-style`
- output settings 라인: `--port-resolution`
- image mix 라인: `--port-image-mix`
- mask 라인: `--port-constraint`
- element board 라인: `--port-element-board`

변경 후:

- output node로 들어가는 모든 설정/입력 라인: `FLOW_INPUT_EDGE_STYLE`
- 생성 결과가 canvas/layer/mask/element로 흐르는 라인: `FLOW_OUTPUT_EDGE_STYLE`
- 사용자가 드래그 중인 연결 라인: `FLOW_PENDING_EDGE_STYLE`

노드 포트와 핸들 색상은 변경하지 않았다. 따라서 사용자는 노드 타입 구분을 포트/노드 색으로 유지하면서도, 화면 전체 라인 노이즈는 줄어든다.

## 4. 변경 파일 목록

코드/설정:

- `package.json`
- `package-lock.json`
- `postcss.config.mjs`
- `src/app/layout.tsx`
- `src/app/globals.css`
- `src/app/page.tsx`

문서/검증 자료:

- `notes/apps-sdk-ui-foundation-plan.md`
- `notes/apps-sdk-ui-foundation-task1-handoff.md`
- `notes/screenshots/apps-sdk-ui-foundation-2026-06-04/before-fullscreen.png`
- `notes/screenshots/apps-sdk-ui-foundation-2026-06-04/after-fullscreen.png`

## 5. 검증 결과

### 5.1 빌드

명령:

```bash
npm run build:next
```

결과:

- 통과
- Next.js `16.2.6`
- `/`, `/design-system`, `/guide`, `/xmark`, style reference API, gallery API, generate API 등 19개 route 생성 확인

참고:

- 첫 sandboxed build는 Turbopack/PostCSS가 내부 process/port 작업을 시도하면서 `Operation not permitted`로 실패했다.
- 같은 명령을 승인된 권한으로 재실행했을 때 정상 통과했다.
- 이는 코드 오류라기보다 현재 Codex sandbox 제한과 Tailwind/PostCSS 처리 방식의 충돌로 판단된다.

### 5.2 로컬 서버 확인

명령:

```bash
npm start -- -H 127.0.0.1 -p 3002
curl -I http://127.0.0.1:3002/
```

결과:

- `HTTP/1.1 200 OK`
- `next start` 실행 시 standalone 경고는 출력됐다.
- 경고 내용: `output: standalone` 설정에서는 `node .next/standalone/server.js` 사용 권장
- 이번 캡처는 응답 확인 목적의 임시 production server로 진행했다.

### 5.3 스크린샷

저장 위치:

- Before: `notes/screenshots/apps-sdk-ui-foundation-2026-06-04/before-fullscreen.png`
- After: `notes/screenshots/apps-sdk-ui-foundation-2026-06-04/after-fullscreen.png`

주의:

- after 캡처는 앱 shell과 갤러리 로드 확인에는 유효하다.
- macOS 보조 접근 권한 제한으로 `osascript` 자동 클릭이 실패해 노드 캔버스의 모든 라인 상태를 자동 캡처하지는 못했다.
- 다음 태스크에서는 수동으로 노드 화면을 열거나 Playwright/CDP 방식으로 캔버스 상태를 직접 캡처하는 것이 좋다.

### 5.4 Audit

명령:

```bash
npm audit --omit=dev --json
```

결과:

- 총 4개 production vulnerability 보고
- `@openai/apps-sdk-ui`가 포함한 `lodash` 관련 high/moderate advisory가 새로 보인다.
- npm audit 기준 현재 fixAvailable은 없다.
- 기존 `next`/`postcss` advisory도 계속 존재한다.

중요 판단:

- Apps SDK UI를 실제 제품 화면에 넓게 적용하기 전, 이 audit 리스크를 인지해야 한다.
- 다음 태스크에서는 wrapper를 통해 적용 범위를 작게 유지하고, 나중에 패키지 업데이트나 대체 전략을 선택할 수 있게 해야 한다.

## 6. 현재 상태

- 브랜치: `feature/apps-sdk-ui-foundation`
- Task 1 구현: 완료
- Task 1 핸드오프: 완료
- 커밋: 아직 생성하지 않음
- 서버: 검증 후 `3002` 임시 서버 종료

현재 작업 트리에는 Task 1 변경사항이 남아 있다. 다음 작업자는 이 상태에서 Task 2를 이어가거나, Task 1만 커밋한 뒤 다음 태스크로 넘어가면 된다.

## 7. 알려진 리스크

### 7.1 Apps SDK UI와 기존 xGen 디자인 시스템의 충돌 가능성

xGen은 이미 `design-md/variables.css`와 `globals.css`에 커스텀 토큰이 많다. Apps SDK UI는 Tailwind 4 layer와 자체 semantic token을 전제로 하므로, 전체 UI를 한 번에 바꾸면 예상치 못한 cascade 충돌이 생길 수 있다.

대응:

- 직접 컴포넌트 import를 여러 파일에 흩뿌리지 않는다.
- `src/components/ui/` 아래에 xGen wrapper를 먼저 만든다.
- wrapper 내부에서만 Apps SDK UI 컴포넌트를 사용한다.

### 7.2 노드 라인 시각 QA 미완료

코드상 edge 스타일은 입력/출력 두 타입으로 통합됐지만, 모든 저장/복원/수동 연결 케이스를 시각적으로 캡처하지는 못했다.

다음 태스크에서 확인할 것:

- 기본 필수 라인 3개
- optional node 추가 후 output node 연결 라인
- output node에서 canvas node로 가는 라인
- canvas → image layer → mask edit → output node 라인
- element board 기반 element item 라인
- 사용자가 직접 드래그 중인 pending line

### 7.3 audit 리스크

Apps SDK UI의 transitive dependency인 lodash advisory가 있다. 현재 fix가 없으므로 wrapper 기반 적용으로 blast radius를 줄여야 한다.

## 8. 다음 태스크 제안

### Task 2: Apps SDK UI Control Wrapper 도입

목표:

- Apps SDK UI 컴포넌트를 xGen 화면에 직접 흩뿌리지 않고, 로컬 wrapper를 통해 안전하게 도입한다.

작업 파일 후보:

- `src/components/ui/XgenButton.tsx`
- `src/components/ui/XgenSelectControl.tsx`
- `src/components/ui/XgenSegmentedControl.tsx`
- `src/app/design-system/page.tsx`

적용 범위:

- 실제 노드 화면 전체 교체는 하지 않는다.
- 먼저 디자인 시스템 페이지나 작은 isolated control 예시에서 확인한다.

검증:

- `npm run build:next`
- wrapper import가 tree-shaking/SSR에서 문제없는지 확인
- audit 결과 기록

완료 산출물:

- `notes/apps-sdk-ui-control-wrapper-task2-handoff.md`
- before/after screenshot

### Task 3: Output Settings 노드 선택 UI 전환

목표:

- 비율/해상도 선택처럼 작은 컨트롤부터 Apps SDK UI 패턴으로 전환한다.

작업 파일 후보:

- `src/components/nodes/OutputSettingsNode.tsx`
- `src/components/nodes/RatioNode.tsx`
- `src/components/nodes/ResolutionNode.tsx`

검증:

- 비율/해상도 선택
- 노드 연결 유지
- 저장/복원
- `npm run build:next`

완료 산출물:

- `notes/apps-sdk-ui-output-settings-task3-handoff.md`

### Task 4: 생성 백엔드/토큰 컨트롤 UI 준비

목표:

- 토큰/비용 최적화를 위한 백엔드 선택과 preview/final 생성 모드 UI를 Apps SDK UI 패턴으로 설계한다.

주의:

- 실제 백엔드 구현은 이 태스크에서 하지 않는다.
- UI shell과 상태 모델만 먼저 잡는다.

완료 산출물:

- `notes/apps-sdk-ui-generation-controls-task4-handoff.md`

## 9. 다음 작업자에게 남기는 운영 규칙

이 브랜치의 Apps SDK UI 적용은 반드시 작은 태스크 단위로 진행한다.

각 태스크는 아래 순서를 지킨다.

1. `notes/`에 태스크 계획 노트 작성
2. before screenshot 저장
3. 작은 범위만 구현
4. `npm run build:next` 검증
5. 가능한 경우 after screenshot 저장
6. 한글 핸드오프 문서 작성
7. 리스크와 다음 태스크를 명시

핸드오프 문서는 다음 항목을 반드시 포함한다.

- 작업 목적
- 적용 범위
- 변경 파일
- 구현 내용
- 검증 명령과 결과
- 스크린샷 위치
- 남은 리스크
- 다음 태스크

이 규칙을 지켜야 토큰 소모와 회귀 범위를 작게 유지할 수 있다.
