# Apps SDK UI foundation 전환 계획

작성일: 2026-06-04
브랜치: `feature/apps-sdk-ui-foundation`
작업명: design-md import 제거와 Apps SDK UI 기반 호환 토큰 전환

## 배경

사용자가 이 프로젝트에서 기존 `design-md` 적용을 하지 말고 Apps SDK UI의 foundation과 component를 사용하라고 요청했다.

현재 상태는 Apps SDK UI CSS와 컴포넌트 wrapper가 추가되어 있지만, `src/app/layout.tsx`가 여전히 `design-md/variables.css`를 직접 import하고 있다. 또한 `src/app/globals.css`의 많은 xGen 토큰이 `design-md`에서 제공하던 `--ui-*`, `--surface-*`, `--component-*`, `--size-*` 값에 의존한다.

## 목표

1차 전환에서는 다음을 처리한다.

- `src/app/layout.tsx`에서 `design-md/variables.css` import를 제거한다.
- `src/app/globals.css`에서 xGen 호환 토큰을 Apps SDK UI foundation token 기반으로 직접 정의한다.
- Apps SDK UI가 사용하는 일반 토큰명 `--radius-*`, `--color-*`, `--font-*`를 xGen alias로 덮지 않는다.
- 기존 노드/갤러리 화면이 깨지지 않도록 `--ui-*`, `--component-*`, `--size-*` 호환 토큰은 유지한다.

## 제외 범위

- 모든 노드 컴포넌트를 즉시 Apps SDK UI component로 재작성하지 않는다.
- `design-md/` 폴더와 token sync script를 삭제하지 않는다.
- `StyleAddModal` 또는 생성 backend control UI는 이번 태스크에서 다루지 않는다.
- Electron packaged app 재패키징은 하지 않는다.

## Before 스크린샷

- `notes/screenshots/apps-sdk-ui-remove-design-md-2026-06-04/before-fullscreen.png`

## 검증 계획

- `npm run build:next`
- `npm audit --omit=dev --json`
- 최신 production server 재시작
- `/design-system/components` after screenshot 저장
- `rg`로 `design-md/variables.css` import가 남아 있는지 확인
