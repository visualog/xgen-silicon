# Apps SDK UI Output Settings Visibility Plan

작성일: 2026-06-04
브랜치: `feature/apps-sdk-ui-foundation`
작업명: Output Settings Apps SDK UI 적용 가시성 보강

## 문제

Task 3에서 `OutputSettingsNode`, `RatioNode`, `ResolutionNode`의 선택 UI를 `XgenSegmentedControl`로 교체했지만, 실행 화면에서 기존 툴바와 차이가 거의 느껴지지 않는다.

추가로 사용자가 보는 `xGen.app`/기존 3001 서버는 새 빌드를 반영하지 않을 수 있다.

## 작업 범위

- `XgenSegmentedControl` wrapper에 xGen 전용 className을 기본 부여한다.
- Apps SDK UI segmented control의 CSS 변수만 xGen 톤으로 오버라이드한다.
- 노드 데이터 계약, 포트, React Flow handle, 생성 로직은 변경하지 않는다.

## 검증 계획

- `npm run build:next`
- 새 빌드 서버 실행 후 화면 확인
- 가능하면 앱 실행 경로가 현재 빌드를 보는지 구분한다.

## 리스크

- 너무 강한 시각 변화는 xGen의 낮은 밀도 방향과 충돌할 수 있으므로, 노드 control surface 안에서만 차이를 만든다.
