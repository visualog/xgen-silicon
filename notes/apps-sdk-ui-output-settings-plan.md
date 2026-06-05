# Apps SDK UI Output Settings Plan

작성일: 2026-06-04
브랜치: `feature/apps-sdk-ui-foundation`
작업명: Output Settings 선택 UI 전환

## 작업 목적

Task 2에서 만든 `src/components/ui/` wrapper를 실제 노드 UI에 처음 적용한다. 비율과 해상도는 독립적인 선택 상태이고 저장/복원 계약이 단순하므로 Apps SDK UI 적용의 첫 제품 화면 대상으로 적합하다.

## 변경 범위

- `OutputSettingsNode`의 비율/해상도 버튼 툴바를 `XgenSegmentedControl` wrapper로 교체한다.
- 독립 `RatioNode`, `ResolutionNode`도 같은 wrapper 패턴으로 맞춘다.
- 포트 chip, React Flow handle, 연결/해제 동작은 유지한다.
- 상태값(`ratio`, `resolution`)과 setter 계약은 변경하지 않는다.

## 제외 범위

- node shell 공통화
- Style Reference Modal 변경
- 저장 데이터 구조 변경
- 생성 API/worker 변경
- Apps SDK UI 원본 컴포넌트 직접 import

## Before Screenshot

- `notes/screenshots/apps-sdk-ui-output-settings-2026-06-04/before-fullscreen.png`

## 검증 계획

- `npm run build:next`
- `npm audit --omit=dev --json`
- after screenshot 저장
- 가능하면 빌드 산출물에서 `XgenSegmentedControl` 적용 확인

## 리스크

- Apps SDK UI audit 리스크는 아직 해소되지 않았다.
- 기존 3001 xGen 서버는 새 변경을 자동 반영하지 않을 수 있으므로 after 캡처는 임시 production server 또는 새 dev server에서 확인한다.
