# Apps SDK UI Output Settings Visibility Report

작성일: 2026-06-04
브랜치: `feature/apps-sdk-ui-foundation`
작업명: Output Settings Apps SDK UI 적용 가시성 보강

## 1. 문제

Task 3에서 비율/해상도 선택 UI를 `XgenSegmentedControl`로 바꿨지만, 기존 직접 만든 toolbar와 시각 차이가 작아서 앱에서 봤을 때 적용 여부를 알아보기 어려웠다.

또한 사용자가 실행한 packaged `xGen.app` 또는 기존 `3001` 서버는 새 빌드를 반영하지 않을 수 있다.

## 2. 구현 내용

수정 파일:

- `src/components/ui/XgenSegmentedControl.tsx`
- `src/app/globals.css`

변경 사항:

- `XgenSegmentedControl`에 기본 className `xgen-segmented-control`을 부여했다.
- 기존 caller가 넘기는 `className`도 함께 유지한다.
- Apps SDK UI segmented control의 CSS variable을 xGen 노드용으로 오버라이드했다.
- track border, active thumb shadow, resolution port tint를 추가해서 기존 toolbar와 더 분명히 구분되게 했다.

변경하지 않은 것:

- `OutputSettingsNode`, `RatioNode`, `ResolutionNode`의 데이터 계약
- React Flow 포트와 handle
- 생성 API/worker
- Apps SDK UI 원본 import 규칙

## 3. 검증 결과

### 3.1 빌드

명령:

```bash
npm run build:next
```

결과:

- 통과
- Next.js `16.2.6`
- TypeScript 통과
- 19개 route 생성 확인

### 3.2 빌드 산출물

명령:

```bash
rg -n "xgen-segmented-control|segmented-control-thumb-background|segmented-control-background" .next/static .next/server -g '*.*'
```

결과:

- `.next/static` CSS/JS 산출물에서 `xgen-segmented-control`과 segmented control CSS 변수 오버라이드 확인

### 3.3 Audit

명령:

```bash
npm audit --omit=dev --json
```

결과:

- 실패(exit 1)
- 기존과 동일하게 production vulnerability 총 4개
- `@openai/apps-sdk-ui` -> `lodash` advisory 유지
- `next` -> `postcss` advisory 유지

### 3.4 실행 확인

현재 최신 변경을 볼 수 있는 URL:

- `http://127.0.0.1:3002`

주의:

- `pack:mac`는 실행 중 `next build` 단계에서 출력 없이 장시간 멈춰 중단했다.
- 중단 후 `.next` build를 다시 `npm run build:next`로 복구했다.
- packaged `release/mac/xGen.app`는 이번 가시성 보강 변경이 반영됐다고 보장할 수 없다.
- 현재 변경 확인은 `3002` production server 기준이다.

## 4. 스크린샷

- `notes/screenshots/apps-sdk-ui-output-settings-2026-06-04/visibility-after-fullscreen.png`

## 5. 남은 작업

- packaged app 갱신을 다시 하려면 `pack:mac` hang 원인을 별도 확인해야 한다.
- 노드 에디터 화면에서 ratio/resolution segmented control 클릭 QA가 아직 필요하다.
