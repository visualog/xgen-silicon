# Apps SDK UI bridge foundation alignment 계획

작성일: 2026-06-04
브랜치: `feature/apps-sdk-ui-foundation`
작업명: Apps SDK UI bridge 샘플을 공식 foundation/component 톤에 맞게 재정렬

## 배경

사용자가 `/design-system/components`의 `Apps SDK UI bridge` 샘플이 OpenAI Apps SDK UI 페이지의 foundation/component 예시와 다르게 보인다고 지적했다.

현재 샘플은 Apps SDK UI 컴포넌트를 import하고 있지만 다음 이유로 공식 예시와 시각적으로 차이가 난다.

- 샘플 카드가 xGen 인라인 스타일과 두꺼운 패널 테두리를 사용한다.
- `xgen-segmented-control`에서 Apps SDK UI 기본 segmented control 토큰을 다시 override한다.
- `SelectControl` 기본값이 `outline`이라 브라우저 기본 select처럼 강하게 보인다.
- 샘플 문구가 wrapper 검증용이라 실제 Apps SDK UI component sample처럼 읽히지 않는다.

## 작업 범위

- `XgenControlBridgePreview`를 Apps SDK UI README 예시와 가까운 카드/텍스트/spacing 패턴으로 재작성한다.
- Apps SDK UI `Badge` wrapper를 추가해서 bridge 샘플도 wrapper 경계를 유지한다.
- `XgenSelectControl` 기본 variant를 `soft`로 조정한다.
- `xgen-segmented-control`의 커스텀 색/그림자 override를 제거하거나 최소화해서 패키지 기본 토큰을 우선한다.
- before/after 스크린샷과 완료 리포트를 남긴다.

## 제외 범위

- 노드 캔버스 전체 리디자인
- 생성 플로우 로직 변경
- Apps SDK UI 패키지 버전 변경
- 전역 `--radius-*` 충돌의 대규모 정리

## Before 스크린샷

- `notes/screenshots/apps-sdk-ui-bridge-foundation-alignment-2026-06-04/before-fullscreen.png`

## 검증 계획

- `npm run build:next`
- `npm audit --omit=dev --json`
- production server에서 `/design-system/components` after 스크린샷 저장
