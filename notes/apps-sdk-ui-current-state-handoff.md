# Apps SDK UI 현재 상태 핸드오프

작성일: 2026-06-04
브랜치: `feature/apps-sdk-ui-foundation`
대상 repo: `/Users/im_018/Documents/GitHub/2026_important/BrandGen`
확인 URL: `http://127.0.0.1:3002/design-system/components`

## 1. 요약

Apps SDK UI 적용은 현재 foundation 연결, local wrapper 도입, Output Settings 선택 UI 전환, 노드 컬러 통일, bridge 샘플 시각 보정, `design-md` 자동 적용 제거까지 진행된 상태다.

초기 목표는 xGen 전체를 한 번에 Apps SDK UI로 바꾸는 것이 아니라, 기존 무한 캔버스/노드 기반 구조를 유지하면서 작은 control 단위로 점진 적용하는 것이다. 현재 원본 Apps SDK UI 컴포넌트는 `src/components/ui/` wrapper 내부에서만 직접 import하는 방향을 유지하고 있다.

최근 사용자 피드백 두 가지가 반영됐다.

- 노드별 포트/칩 색상이 다르게 보이는 문제: 전역 `--port-*` 토큰을 단일 `--node-accent-unified`로 alias 처리했다.
- `/design-system/components`의 bridge 샘플이 OpenAI Apps SDK UI 페이지와 다르게 보이는 문제: xGen 인라인 패널 스타일과 segmented control override를 걷어내고 Apps SDK UI foundation utility 기반 카드로 재구성했다.
- 기존 `design-md`를 적용하지 말라는 요청: `design-md/variables.css` import와 `sync:design` 자동 실행을 제거하고, xGen 호환 토큰을 Apps SDK UI foundation token 기반으로 재정의했다.

## 2. 현재 구현 상태

### 2.1 Apps SDK UI foundation

관련 파일:

- `package.json`
- `package-lock.json`
- `postcss.config.mjs`
- `src/app/layout.tsx`
- `src/app/globals.css`

적용 내용:

- `@openai/apps-sdk-ui` 추가
- Tailwind 4 처리용 `tailwindcss`, `@tailwindcss/postcss` 추가
- `src/app/globals.css` 상단에 다음 import 연결
  - `@import "tailwindcss";`
  - `@import "@openai/apps-sdk-ui/css";`
  - `@source "../../node_modules/@openai/apps-sdk-ui";`
- `src/app/layout.tsx`는 더 이상 `design-md/variables.css`를 import하지 않는다.
- `package.json`에서 `sync:design`, `predev`, `prebuild`, `prebuild:next`를 제거했다.
- 기존 xGen compatibility token은 `src/app/globals.css`에서 Apps SDK UI foundation token 기반으로 공급한다.

주의:

- Next.js 16.2.6 기준 App Router CSS 문서를 확인하고 진행했다.
- `design-md/` 폴더와 `scripts/sync-design-tokens.mjs` 파일은 삭제하지 않았다. 다만 앱 실행/빌드에서는 더 이상 자동 적용되지 않는다.
- Apps SDK UI 자체 foundation token인 `--radius-sm`, `--radius-lg`, `--font-sans`, `--shadow-sm`은 xGen alias로 덮지 않도록 제거했다.

### 2.2 React Flow 라인 컬러 단순화

관련 파일:

- `src/app/page.tsx`
- `src/app/globals.css`

적용 내용:

- 노드 타입별 라인 컬러를 입력/출력 흐름 중심으로 줄였다.
- `--flow-line-input`, `--flow-line-output`, `--flow-line-pending` 토큰을 추가했다.
- output node로 들어가는 설정/입력 라인은 input flow로, output 이후 canvas/layer/mask/element 흐름은 output flow로 처리한다.

### 2.3 노드별 포트/칩 컬러 통일

관련 파일:

- `src/app/globals.css`

적용 내용:

- `--node-accent-unified`를 추가했다.
- `--port-prompt`, `--port-style`, `--port-ratio`, `--port-resolution`, `--port-image-mix` 등 기존 포트 컬러 토큰을 모두 `--node-accent-unified`로 alias 처리했다.
- 노드 컴포넌트별 색상 로직을 대량 수정하지 않고 전역 토큰에서 통일했다.

주의:

- 일부 갤러리/디자인 시스템 장식도 `--port-*`를 참조하므로, 노드 외 장식 색도 함께 중립화될 수 있다.
- React Flow line의 input/output 구분 컬러는 별도 토큰으로 남아 있다.

### 2.4 Local wrapper

관련 파일:

- `src/components/ui/XgenButton.tsx`
- `src/components/ui/XgenBadge.tsx`
- `src/components/ui/XgenSelectControl.tsx`
- `src/components/ui/XgenSegmentedControl.tsx`
- `src/components/ui/XgenControlBridgePreview.tsx`
- `src/components/ui/index.ts`

현재 wrapper:

- `XgenButton`: Apps SDK UI `Button`
- `XgenBadge`: Apps SDK UI `Badge`
- `XgenSelectControl`: Apps SDK UI `SelectControl`, 기본 `variant="soft"`
- `XgenSegmentedControl`: Apps SDK UI `SegmentedControl`
- `XgenControlBridgePreview`: `/design-system/components`의 bridge 샘플

운영 규칙:

- 제품 노드나 페이지에서 Apps SDK UI 원본 컴포넌트를 직접 import하지 않는다.
- `src/components/ui/` wrapper를 통해서만 사용한다.
- 패키지 API 변경 또는 audit 리스크가 생기면 wrapper만 좁게 고친다.

### 2.5 Output Settings 선택 UI

관련 파일:

- `src/components/nodes/OutputSettingsNode.tsx`
- `src/components/nodes/RatioNode.tsx`
- `src/components/nodes/ResolutionNode.tsx`

적용 내용:

- 기존 ratio/resolution 버튼 toolbar를 `XgenSegmentedControl`로 교체했다.
- 기존 상태값과 props 계약은 유지했다.
- React Flow handle, connection, disconnect 로직은 유지했다.

주의:

- 좁은 노드 폭에서 `4:3`, `3:4`, `8K` 텍스트가 답답해 보일 수 있다. 시각 QA를 계속 봐야 한다.

### 2.6 Design System bridge 샘플

관련 파일:

- `src/app/design-system/components/page.tsx`
- `src/components/ui/XgenControlBridgePreview.tsx`
- `src/components/ui/XgenBadge.tsx`
- `src/app/globals.css`

적용 내용:

- `/design-system/components` 상단에 Apps SDK UI bridge 샘플을 노출한다.
- 샘플은 `bg-surface`, `border-default`, `heading-lg`, `text-secondary`, `shadow-lg`, `Badge`, `Button` 등 Apps SDK UI foundation utility를 직접 보여준다.
- `.xgen-segmented-control`의 커스텀 background, thumb gradient, border, shadow override를 제거했다.
- `SelectControl`은 `soft` 톤으로 조정했다.

## 3. 문서와 스크린샷

핵심 task 문서:

- `notes/apps-sdk-ui-foundation-task1-handoff.md`
- `notes/apps-sdk-ui-control-wrapper-task2-handoff.md`
- `notes/apps-sdk-ui-output-settings-task3-handoff.md`
- `notes/apps-sdk-ui-output-settings-visibility-report.md`
- `notes/unified-node-color-report.md`
- `notes/apps-sdk-ui-bridge-foundation-alignment-report.md`
- `notes/apps-sdk-ui-remove-design-md-report.md`

통합 운영 가이드:

- `notes/apps-sdk-ui-handoff-guidelines.md`

스크린샷 폴더:

- `notes/screenshots/apps-sdk-ui-foundation-2026-06-04/`
- `notes/screenshots/apps-sdk-ui-control-wrapper-2026-06-04/`
- `notes/screenshots/apps-sdk-ui-output-settings-2026-06-04/`
- `notes/screenshots/apps-sdk-ui-unified-node-color-2026-06-04/`
- `notes/screenshots/apps-sdk-ui-bridge-foundation-alignment-2026-06-04/`
- `notes/screenshots/apps-sdk-ui-remove-design-md-2026-06-04/`

## 4. 검증 상태

### 4.1 Build

명령:

```bash
npm run build:next
```

결과:

- 통과
- Next.js `16.2.6`
- `/`, `/design-system`, `/design-system/components`, `/guide`, `/xmark`, API routes 포함 19개 route 생성 확인
- build 로그에서 `sync:design` 실행 없음

### 4.2 Live server

현재 확인 URL:

```text
http://127.0.0.1:3002/design-system/components
```

상태:

- `npm start -- -H 127.0.0.1 -p 3002`로 최신 빌드 기준 실행 중
- `curl -s -I http://127.0.0.1:3002/design-system/components` 응답 `HTTP/1.1 200 OK`

주의:

- `next start`는 `output: standalone` 설정에서 `node .next/standalone/server.js` 사용 권장 경고를 출력한다.
- 현재 서버는 시각 QA용 임시 production server다.

### 4.3 Audit

명령:

```bash
npm audit --omit=dev --json
```

결과:

- 실패
- 총 4개 production advisory
- `@openai/apps-sdk-ui` bundled `lodash` 관련 advisory 3개, `fixAvailable: false`
- `next` -> `postcss` advisory 1개, npm 제안 fix는 부적절한 major downgrade

## 5. 현재 작업 트리

현재 커밋 전 dirty state다.

주요 수정 파일:

- `package.json`
- `package-lock.json`
- `postcss.config.mjs`
- `src/app/layout.tsx`
- `src/app/globals.css`
- `src/app/page.tsx`
- `src/app/design-system/components/page.tsx`
- `src/components/nodes/OutputSettingsNode.tsx`
- `src/components/nodes/RatioNode.tsx`
- `src/components/nodes/ResolutionNode.tsx`
- `src/components/ui/*`
- `notes/apps-sdk-ui-remove-design-md-plan.md`
- `notes/apps-sdk-ui-remove-design-md-report.md`

문서/스크린샷도 다수 untracked 상태다. 다음 작업자는 커밋 전 `git status --short`로 범위를 다시 확인해야 한다.

## 6. 알려진 리스크

1. Apps SDK UI audit 리스크가 있다.
   - `@openai/apps-sdk-ui@0.2.2`가 bundled `lodash`를 포함하며 현재 npm audit 기준 fix가 없다.
   - wrapper 경계를 유지해 blast radius를 줄여야 한다.

2. compatibility token layer는 남아 있다.
   - 기존 UI가 아직 `--ui-*`, `--component-*`, `--size-*`를 많이 사용한다.
   - 값의 출처는 Apps SDK UI foundation으로 바뀌었지만, 모든 화면이 Apps SDK UI component로 재작성된 것은 아니다.

3. packaged app은 최신 반영이 보장되지 않는다.
   - 이전 `npm run pack:mac` 시도가 `next build` 단계에서 멈춰 중단됐다.
   - `release/mac/xGen.app`을 열면 현재 변경이 안 보일 수 있다.
   - 현재 확인은 `http://127.0.0.1:3002` 기준으로 해야 한다.

4. 시각 QA는 아직 부분적이다.
   - `/design-system/components`와 노드 선택 UI는 캡처했다.
   - 실제 생성 플로우에서 모든 노드 조합, 다크 모드, 모바일 폭까지 완전 검증한 상태는 아니다.

## 7. 다음 태스크 제안

### 우선순위 1: design system page 문서/토큰명 정리

목표:

- `/design-system/components`의 설명과 token 목록을 Apps SDK UI foundation/component 기준으로 갱신한다.

후보 작업:

- `--ui-*`, `--component-*` 중심 설명을 Apps SDK UI `--color-*`, `--radius-*`, `--font-*`, component utility 중심으로 바꾼다.
- bridge sample 외의 component cards도 Apps SDK UI component usage를 더 명확히 보여준다.

검증:

- `npm run build:next`
- `/design-system/components` bridge 샘플 캡처
- 노드 캔버스 캡처

### 우선순위 2: Task 4 생성 백엔드/토큰 컨트롤 UI 준비

목표:

- 생성 백엔드, preview/final 모드, reference attachment 정책 같은 제어 UI를 Apps SDK UI wrapper로 설계한다.

주의:

- 실제 API route나 worker backend 교체는 하지 않는다.
- UI shell과 상태 저장 구조만 작게 준비한다.

### 우선순위 3: Style Reference Modal 정리

목표:

- `StyleAddModal`의 검색, 필터, 선택, 추가 UI를 Apps SDK UI control 패턴으로 정리한다.

주의:

- 이미지 URL 처리, reference attachment 정책, 라이브러리 로딩 로직은 별도 태스크로 분리한다.

## 8. 다음 작업자 운영 규칙

- Next.js 관련 코드 수정 전에는 `node_modules/next/dist/docs/`의 관련 문서를 확인한다.
- 의미 있는 구현 전에는 `notes/`에 계획 문서를 남기고 before screenshot을 저장한다.
- 구현 후에는 after screenshot과 완료 리포트를 남긴다.
- Apps SDK UI 원본 컴포넌트는 `src/components/ui/` wrapper 외부에서 직접 import하지 않는다.
- 사용자가 "적용이 안 보인다"고 말하면 코드 적용 여부보다 먼저 화면 가시성, 서버 포트, packaged app stale 여부를 확인한다.
- 현재 앱 확인은 packaged app이 아니라 `http://127.0.0.1:3002` 기준으로 한다.
