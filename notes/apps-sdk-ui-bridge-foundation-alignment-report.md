# Apps SDK UI bridge foundation alignment 완료 리포트

작성일: 2026-06-04
브랜치: `feature/apps-sdk-ui-foundation`
작업명: Apps SDK UI bridge 샘플을 공식 foundation/component 톤에 맞게 재정렬

## 1. 작업 목적

`/design-system/components`의 `Apps SDK UI bridge` 샘플이 OpenAI Apps SDK UI 페이지의 foundation/component 예시와 다르게 보이는 문제를 줄였다.

기존 화면은 Apps SDK UI 컴포넌트를 사용하고 있었지만, xGen 인라인 패널 스타일과 `xgen-segmented-control` override가 강하게 적용되어 공식 컴포넌트 샘플보다 브라우저 기본 control 또는 xGen 노드 카드처럼 보였다.

## 2. 구현 내용

### 2.1 bridge 샘플 재구성

수정 파일:

- `src/components/ui/XgenControlBridgePreview.tsx`

변경 내용:

- 인라인 `CSSProperties` 기반 패널을 제거했다.
- Apps SDK UI README 예시와 같은 foundation utility를 사용했다.
- 적용 utility 예:
  - `rounded-2xl`
  - `border border-default`
  - `bg-surface`
  - `shadow-lg`
  - `heading-lg`
  - `text-secondary`
  - `border-subtle`
  - `bg-surface-elevated`
- 오른쪽 preview를 `Selected output` 요약 카드와 `dl` 기반 데이터 행으로 바꿨다.
- action row를 2열 버튼 영역으로 정리했다.

### 2.2 Badge wrapper 추가

새 파일:

- `src/components/ui/XgenBadge.tsx`

수정 파일:

- `src/components/ui/index.ts`

변경 내용:

- `@openai/apps-sdk-ui/components/Badge`를 직접 여러 화면에 흩뿌리지 않기 위해 `XgenBadge` wrapper를 추가했다.
- 기본값은 `secondary / soft / md / pill`로 설정했다.

### 2.3 SelectControl 기본 톤 조정

수정 파일:

- `src/components/ui/XgenSelectControl.tsx`

변경 내용:

- 기본 variant를 `outline`에서 `soft`로 바꿨다.
- 브라우저 기본 select처럼 보이는 강한 outline 느낌을 줄이고 Apps SDK UI의 부드러운 control 톤에 맞췄다.

### 2.4 SegmentedControl override 제거

수정 파일:

- `src/app/globals.css`

변경 내용:

- `.xgen-segmented-control`에서 커스텀 background, thumb gradient, border, shadow override를 제거했다.
- 이제 Apps SDK UI 패키지의 `--segmented-control-*` 기본 foundation 토큰이 우선 적용된다.
- wrapper class는 `min-width: 0`만 유지한다.

## 3. 스크린샷

저장 위치:

- Before: `notes/screenshots/apps-sdk-ui-bridge-foundation-alignment-2026-06-04/before-fullscreen.png`
- After: `notes/screenshots/apps-sdk-ui-bridge-foundation-alignment-2026-06-04/after-fullscreen.png`

## 4. 검증 결과

### 4.1 Next build

명령:

```bash
npm run build:next
```

결과:

- 통과
- Next.js `16.2.6`
- `/design-system/components` 포함 19개 route 생성 확인

### 4.2 Production server

명령:

```bash
npm start -- -H 127.0.0.1 -p 3002
curl -s -I http://127.0.0.1:3002/design-system/components
```

결과:

- `HTTP/1.1 200 OK`
- 최신 빌드 기준 ETag 확인
- 현재 확인 URL: `http://127.0.0.1:3002/design-system/components`

참고:

- `next start`는 `output: standalone` 설정에서는 `node .next/standalone/server.js` 사용을 권장한다는 경고를 출력한다.
- 이번 확인은 로컬 시각 QA 목적의 임시 production server로 진행했다.

### 4.3 Audit

명령:

```bash
npm audit --omit=dev --json
```

결과:

- 실패
- 기존과 같은 4개 production advisory 유지
- `@openai/apps-sdk-ui` -> bundled `lodash` 관련 3개 advisory, `fixAvailable: false`
- `next` -> `postcss` advisory, npm 제안 fix는 부적절한 major downgrade

## 5. 남은 리스크

- `@openai/apps-sdk-ui/css` import 이후 xGen 전역 `:root`에서 `--radius-sm`, `--radius-lg` 같은 일반 토큰명을 다시 정의하고 있다. Apps SDK UI도 같은 토큰명을 쓰기 때문에, 공식 컴포넌트의 radius 일부가 xGen 토큰 영향을 받을 수 있다.
- 이번 작업에서는 대규모 radius alias 정리를 하지 않았다. 전역 토큰 충돌 정리는 별도 태스크로 분리하는 것이 안전하다.
- 캡처는 전체 화면 기준이라 브라우저 창만 잘라낸 비교 이미지는 아니다.

## 6. 변경 파일 목록

코드:

- `src/components/ui/XgenBadge.tsx`
- `src/components/ui/XgenControlBridgePreview.tsx`
- `src/components/ui/XgenSelectControl.tsx`
- `src/components/ui/index.ts`
- `src/app/globals.css`

문서/스크린샷:

- `notes/apps-sdk-ui-bridge-foundation-alignment-plan.md`
- `notes/apps-sdk-ui-bridge-foundation-alignment-report.md`
- `notes/screenshots/apps-sdk-ui-bridge-foundation-alignment-2026-06-04/before-fullscreen.png`
- `notes/screenshots/apps-sdk-ui-bridge-foundation-alignment-2026-06-04/after-fullscreen.png`
