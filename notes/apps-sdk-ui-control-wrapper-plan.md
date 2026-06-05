# Apps SDK UI Control Wrapper Plan

작성일: 2026-06-04
브랜치: `feature/apps-sdk-ui-foundation`
작업명: Apps SDK UI Control Wrapper 도입

## 작업 목적

Task 1에서 Apps SDK UI foundation과 Tailwind 4 처리 파이프라인이 연결됐다. 이번 Task 2는 Apps SDK UI React 컴포넌트를 xGen 화면에 직접 흩뿌리지 않도록 `src/components/ui/` 아래 로컬 wrapper를 먼저 만든다.

## 변경 범위

- `XgenButton`, `XgenSelectControl`, `XgenSegmentedControl` wrapper 추가
- wrapper export entry 추가
- `/design-system/components`에 작은 SDK bridge 샘플 추가
- 실제 노드 캔버스와 생성 플로우는 변경하지 않음

## 확인한 기준

- `@openai/apps-sdk-ui@0.2.2` export: `components/Button`, `components/SelectControl`, `components/SegmentedControl`
- Next.js 16.2.6 문서: 인터랙티브 wrapper는 `'use client'` 경계 파일로 둔다.
- Next.js 16.2.6 Turbopack 문서: PostCSS config와 global CSS import는 지원된다.

## Before Screenshot

- `notes/screenshots/apps-sdk-ui-control-wrapper-2026-06-04/before-fullscreen.png`

## 검증 계획

- `npm run build:next`
- `npm audit --omit=dev --json`
- `http://127.0.0.1:3001/design-system/components` after screenshot 저장

## 리스크

- Apps SDK UI 패키지의 audit 리스크는 Task 1에서 확인된 상태이며, 이번 태스크에서도 결과를 다시 기록한다.
- wrapper는 클라이언트 컴포넌트이므로 서버 컴포넌트에서 import할 때 props 직렬화 경계를 지켜야 한다.
