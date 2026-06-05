# shadcn/ui 1차 전환 계획

작성일: 2026-06-05
브랜치: `feature/apps-sdk-ui-foundation`
작업명: Apps SDK UI 제거와 shadcn/ui 기반 컴포넌트 전환

## 배경

사용자가 Apps SDK UI 디자인 시스템을 걷어내고 shadcn/ui의 컴포넌트와 블록을 적용하는 방향이 좋겠다고 요청했다.

현재 프로젝트는 이미 Next.js App Router, React 19, Tailwind 4를 사용하고 있고 `@/* -> ./src/*` alias도 설정되어 있어 shadcn/ui 공식 Next.js 기존 프로젝트 조건과 맞는다. 다만 기존 `src/components/ui/`에는 Apps SDK UI wrapper가 들어 있으므로 CLI가 무심코 덮어쓰게 하지 않고, 1차 전환은 수동으로 작게 진행한다.

## 공식 문서 기준

- shadcn/ui Next.js 설치 문서는 기존 프로젝트에서 Tailwind CSS와 `@/*` alias를 확인한 뒤 `shadcn@latest init`, `shadcn@latest add button` 같은 흐름을 안내한다.
- shadcn/ui Tailwind v4 문서는 React 19와 Tailwind v4 지원, `@theme`/data-slot 기반 컴포넌트, `new-york` 스타일을 기준으로 설명한다.

## 목표

- `@openai/apps-sdk-ui` dependency와 CSS import를 제거한다.
- `src/components/ui/`에 shadcn 방식의 `button`, `badge`, `card`, `toggle-group` primitive와 `cn` 유틸을 추가한다.
- 기존 제품 코드가 쓰는 `XgenButton`, `XgenBadge`, `XgenSegmentedControl`, `XgenSelectControl` wrapper는 shadcn primitive 기반으로 재연결한다.
- `/design-system/components`의 bridge 샘플 문구를 shadcn/ui 기준으로 갱신한다.
- `OutputSettingsNode`, `RatioNode`, `ResolutionNode`는 import 경로를 유지한 채 shadcn 기반 segmented control을 사용하게 한다.

## 제외 범위

- shadcn blocks 전체 도입은 이번 1차 태스크에서 하지 않는다.
- node shell 전체 리디자인은 하지 않는다.
- StyleAddModal 전환은 다음 태스크로 둔다.
- Electron packaged app 재패키징은 하지 않는다.

## Before 스크린샷

- `notes/screenshots/shadcn-ui-migration-2026-06-05/before-fullscreen.png`

## 검증 계획

- `npm run build:next`
- `npm audit --omit=dev --json`
- `rg`로 `@openai/apps-sdk-ui` import가 `src`와 `package.json`에 남아 있는지 확인
- 최신 production server 재시작
- `/design-system/components` after screenshot 저장
