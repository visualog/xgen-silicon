# Unified Node Color Plan

작성일: 2026-06-04
브랜치: `feature/apps-sdk-ui-foundation`
작업명: 노드별 컬러 통일

## 문제

현재 xGen은 `--port-prompt`, `--port-style`, `--port-resolution`처럼 노드 타입마다 다른 포트/칩/액션 컬러를 사용한다. 사용자는 노드마다 특정 컬러가 적용되는 방식을 원하지 않고, 전체 노드 컬러를 통일하길 원한다.

## 작업 범위

- `src/app/globals.css`에서 공통 노드 accent 토큰을 만든다.
- 모든 `--port-*` 토큰을 공통 accent로 alias한다.
- 개별 노드 파일은 대규모로 수정하지 않는다.
- React Flow 연결 구조, handle id, 데이터 계약은 변경하지 않는다.

## Before Screenshot

- `notes/screenshots/apps-sdk-ui-unified-node-color-2026-06-04/before-fullscreen.png`

## 검증 계획

- `npm run build:next`
- `.next` 산출물에서 `--node-accent-unified` 확인
- after screenshot 저장

## 리스크

- 포트 컬러를 모두 통일하면 노드 타입 구분은 색이 아니라 라벨, 아이콘, 위치, 내용으로 해야 한다.
- 갤러리/문서 페이지 일부 장식도 `--port-*`를 참조하므로 더 차분한 단색 톤으로 바뀔 수 있다.
