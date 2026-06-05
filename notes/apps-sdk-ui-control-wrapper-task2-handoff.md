# Apps SDK UI 적용 Task 2 핸드오프

작성일: 2026-06-04
브랜치: `feature/apps-sdk-ui-foundation`
작업명: Apps SDK UI Control Wrapper 도입

## 1. 작업 목적

Task 1에서 Apps SDK UI foundation과 Tailwind 4 처리 파이프라인이 연결됐다. 이번 Task 2의 목표는 Apps SDK UI React 컴포넌트를 xGen 코드 전반에 직접 import하지 않고, `src/components/ui/` 아래 로컬 wrapper를 통해서만 사용하게 만드는 것이다.

이 구조를 먼저 두면 이후 `OutputSettingsNode`, `StyleAddModal`, node shell 같은 실제 제품 화면에 Apps SDK UI 컴포넌트를 적용할 때 패키지 API 변경이나 audit 리스크 대응 범위를 좁힐 수 있다.

## 2. 적용 범위

이번 태스크에 포함한 범위:

- `XgenButton` wrapper 추가
- `XgenSelectControl` wrapper 추가
- `XgenSegmentedControl` wrapper 추가
- wrapper export entry 추가
- `/design-system/components`에 작은 SDK bridge 샘플 추가
- before/after 스크린샷 저장
- 빌드와 audit 검증

이번 태스크에서 제외한 범위:

- 실제 노드 캔버스 컨트롤 교체
- `OutputSettingsNode`, `RatioNode`, `ResolutionNode` 변경
- `StyleAddModal` 구조 변경
- 생성 백엔드/토큰 컨트롤 추가
- Apps SDK UI provider 전역 적용

## 3. 구현 내용

### 3.1 Wrapper 파일 추가

새 파일:

- `src/components/ui/XgenButton.tsx`
- `src/components/ui/XgenSelectControl.tsx`
- `src/components/ui/XgenSegmentedControl.tsx`
- `src/components/ui/index.ts`

각 wrapper는 `'use client'` 경계 파일이다. Next.js 16.2.6 문서 기준으로 이벤트 처리와 상태 변경이 필요한 UI 컴포넌트는 클라이언트 컴포넌트 entry로 두는 것이 맞다.

Apps SDK UI 원본 import는 다음 wrapper 파일 안에만 둔다.

- `@openai/apps-sdk-ui/components/Button`
- `@openai/apps-sdk-ui/components/SelectControl`
- `@openai/apps-sdk-ui/components/SegmentedControl`

### 3.2 xGen 기본값 고정

`XgenButton`은 xGen 쪽 기본값을 고정했다.

- `color`: `secondary`
- `variant`: `soft`
- `size`: `md`
- `pill`: `true`

`XgenSelectControl`은 선택형 컨트롤에 맞는 기본값을 고정했다.

- `variant`: `outline`
- `size`: `md`
- `block`: `true`
- `selected`: `true`
- `dropdownIconType`: `dropdown`

`XgenSegmentedControl`은 옵션 배열을 받는 형태로 감싸서 이후 ratio/resolution 같은 값 목록을 단순하게 넘길 수 있게 했다.

### 3.3 디자인 시스템 샘플 추가

새 파일:

- `src/components/ui/XgenControlBridgePreview.tsx`

수정 파일:

- `src/app/design-system/components/page.tsx`

`/design-system/components`의 컴포넌트 사용 원칙 아래에 작은 `Apps SDK UI bridge` 샘플을 추가했다. 이 샘플은 `SegmentedControl`, `SelectControl`, `Button` wrapper를 모두 사용하며, 상태 변경도 포함한다.

중요하게도 이번 샘플은 디자인 시스템 검증 화면에만 들어갔다. 실제 생성 노드나 캔버스 동작은 변경하지 않았다.

## 4. 변경 파일 목록

코드:

- `src/components/ui/XgenButton.tsx`
- `src/components/ui/XgenSelectControl.tsx`
- `src/components/ui/XgenSegmentedControl.tsx`
- `src/components/ui/XgenControlBridgePreview.tsx`
- `src/components/ui/index.ts`
- `src/app/design-system/components/page.tsx`

문서/검증 자료:

- `notes/apps-sdk-ui-control-wrapper-plan.md`
- `notes/apps-sdk-ui-control-wrapper-task2-handoff.md`
- `notes/screenshots/apps-sdk-ui-control-wrapper-2026-06-04/before-fullscreen.png`
- `notes/screenshots/apps-sdk-ui-control-wrapper-2026-06-04/after-fullscreen.png`

참고:

- `package.json`, `package-lock.json`, `postcss.config.mjs`, `src/app/globals.css`, `src/app/layout.tsx`, `src/app/page.tsx`의 변경은 Task 1에서 이미 남아 있던 foundation 변경이다.

## 5. 검증 결과

### 5.1 빌드

명령:

```bash
npm run build:next
```

결과:

- 통과
- Next.js `16.2.6`
- `/design-system/components` 포함 19개 route 생성 확인
- TypeScript 통과
- `scripts/prepare-electron-package.mjs` 실행 완료

### 5.2 Audit

명령:

```bash
npm audit --omit=dev --json
```

결과:

- 실패(exit 1)
- production vulnerability 총 4개
- moderate 3개, high 1개
- `@openai/apps-sdk-ui`가 포함한 `lodash` advisory 3개
- 기존 `next` -> `postcss` advisory 1개
- `@openai/apps-sdk-ui`/`lodash` 쪽은 현재 `fixAvailable: false`

판단:

- Task 1에서 확인한 audit 리스크가 그대로 재현됐다.
- 이번 Task 2는 wrapper 도입으로 Apps SDK UI 적용 범위를 작게 유지했지만, 패키지 자체 리스크는 아직 해소되지 않았다.

### 5.3 로컬 서버와 화면 확인

기존 `127.0.0.1:3001` xGen 서버는 떠 있었지만 새 빌드 내용을 즉시 반영하지 않았다.

따라서 after 캡처는 임시 production server로 확인했다.

명령:

```bash
npm start -- -H 127.0.0.1 -p 3002
```

결과:

- `http://127.0.0.1:3002` 실행 확인
- `next start`의 standalone 경고 출력
- 캡처 후 3002 서버 종료

빌드 산출물 확인:

- `.next/static` 산출물에서 `XgenControlBridgePreview`, `Apps SDK UI bridge`, `wrapper import boundary check` 포함 확인

### 5.4 스크린샷

저장 위치:

- Before: `notes/screenshots/apps-sdk-ui-control-wrapper-2026-06-04/before-fullscreen.png`
- After: `notes/screenshots/apps-sdk-ui-control-wrapper-2026-06-04/after-fullscreen.png`

after 캡처에서 `/design-system/components` 상단에 `Apps SDK UI bridge` 샘플이 표시되는 것을 확인했다.

## 6. 현재 상태

- 브랜치: `feature/apps-sdk-ui-foundation`
- Task 2 구현: 완료
- Task 2 핸드오프: 완료
- 커밋: 아직 생성하지 않음
- 3002 임시 서버: 종료
- 기존 3001 xGen 서버: 작업 전부터 실행 중이었고 이번 태스크에서 재시작하지 않음

현재 작업 트리에는 Task 1 변경과 Task 2 변경이 함께 남아 있다.

## 7. 알려진 리스크

### 7.1 Apps SDK UI audit 리스크

`@openai/apps-sdk-ui@0.2.2`가 `lodash@4.17.21`을 포함하고 있고, npm audit이 high/moderate advisory를 보고한다. 현재 npm audit 기준 fixAvailable은 없다.

다음 태스크에서 실제 제품 화면에 적용하더라도 wrapper를 통해 적용 범위를 제한해야 한다.

### 7.2 클라이언트 경계

wrapper는 모두 `'use client'` 파일이다. 서버 컴포넌트에서 wrapper를 직접 사용할 수는 있지만, 서버에서 함수 props를 만들어 넘기는 패턴은 피해야 한다. 상태와 이벤트 핸들러가 필요한 샘플/제품 조합은 클라이언트 컴포넌트로 분리한다.

### 7.3 Visual QA 범위

이번 캡처는 `/design-system/components`의 샘플 렌더링 확인용이다. 실제 노드 캔버스 컨트롤은 아직 바꾸지 않았으므로 캔버스 상호작용 QA는 Task 3에서 해야 한다.

## 8. 다음 태스크 제안

Task 3: Output Settings 선택 UI 전환

목표:

- 비율/해상도처럼 작고 독립적인 선택 UI부터 wrapper를 적용한다.
- 데이터 구조와 저장/복원 계약은 유지한다.

작업 후보:

- `src/components/nodes/OutputSettingsNode.tsx`
- `src/components/nodes/RatioNode.tsx`
- `src/components/nodes/ResolutionNode.tsx`

검증 기준:

- 비율 변경
- 해상도 변경
- output node 연결 유지
- 페이지 새로고침 후 상태 복원
- `npm run build:next`
- before/after screenshot 저장

## 9. 다음 작업자에게 남기는 운영 규칙

- Apps SDK UI 원본 컴포넌트를 노드 파일에서 직접 import하지 않는다.
- `src/components/ui/` wrapper를 통해서만 사용한다.
- 한 번에 여러 노드나 모달을 바꾸지 않는다.
- Task 3에서도 시작 전에 planning note와 before screenshot을 먼저 남긴다.
- audit 실패는 숨기지 말고 handoff에 계속 기록한다.
