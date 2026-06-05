# Apps SDK UI foundation 전환 완료 리포트

작성일: 2026-06-04
브랜치: `feature/apps-sdk-ui-foundation`
작업명: design-md import 제거와 Apps SDK UI 기반 호환 토큰 전환

## 1. 작업 목적

사용자 요청에 따라 기존 `design-md` 적용을 중단하고, xGen UI의 foundation을 Apps SDK UI 기반으로 전환했다.

이번 작업은 전체 화면을 한 번에 재작성하지 않고, 현재 앱이 깨지지 않도록 xGen compatibility token은 유지하되 값의 출처를 `design-md/variables.css`에서 Apps SDK UI foundation token으로 옮기는 1차 전환이다.

## 2. 구현 내용

### 2.1 design-md import 제거

수정 파일:

- `src/app/layout.tsx`

변경 내용:

- `../../design-md/variables.css` import를 제거했다.
- 앱 전역 CSS는 `src/app/globals.css`만 import한다.

### 2.2 design-md 자동 sync 제거

수정 파일:

- `package.json`

변경 내용:

- `sync:design` script를 제거했다.
- `predev`, `prebuild`, `prebuild:next`에서 design token sync가 더 이상 실행되지 않게 했다.
- `npm run dev`, `npm run build:next`는 더 이상 `scripts/sync-design-tokens.mjs`를 자동 실행하지 않는다.

### 2.3 Apps SDK UI 기반 compatibility token 추가

수정 파일:

- `src/app/globals.css`

변경 내용:

- `--ui-*`, `--component-*`, `--size-*`, `--surface-*` 호환 토큰을 Apps SDK UI foundation token 기반으로 직접 정의했다.
- 주요 매핑:
  - surface: `--color-surface`, `--color-surface-secondary`, `--color-surface-tertiary`
  - text: `--color-text`, `--color-text-secondary`, `--color-text-tertiary`
  - border: `--color-border`
  - spacing: Apps SDK UI `--spacing`
  - radius: Apps SDK UI `--radius-*`
  - typography: Apps SDK UI `--font-text-*`, `--font-heading-*`
  - shadow: Apps SDK UI `--shadow-100`, `--shadow-200`, `--shadow-hairline`
  - controls: Apps SDK UI `--control-size-*`
- Apps SDK UI 자체가 사용하는 일반 foundation token인 `--radius-sm`, `--radius-lg`, `--font-sans`, `--shadow-sm`을 xGen alias로 덮지 않도록 제거했다.

## 3. 현재 적용 상태

현재 앱은 다음 기반으로 동작한다.

- `@import "tailwindcss";`
- `@import "@openai/apps-sdk-ui/css";`
- `@source "../../node_modules/@openai/apps-sdk-ui";`
- xGen compatibility tokens backed by Apps SDK UI foundation
- Apps SDK UI components through `src/components/ui/` wrappers

현재 앱은 다음을 더 이상 자동 적용하지 않는다.

- `design-md/variables.css` global import
- `predev` design token sync
- `prebuild` design token sync
- `prebuild:next` design token sync

## 4. 스크린샷

저장 위치:

- Before: `notes/screenshots/apps-sdk-ui-remove-design-md-2026-06-04/before-fullscreen.png`
- After: `notes/screenshots/apps-sdk-ui-remove-design-md-2026-06-04/after-fullscreen.png`

## 5. 검증 결과

### 5.1 Build

명령:

```bash
npm run build:next
```

결과:

- 통과
- Next.js `16.2.6`
- 19개 route 생성 확인
- build 로그에서 `sync:design` 실행 없음

### 5.2 design-md 적용 경로 검색

명령:

```bash
rg -n "sync:design|predev|prebuild|design-md/variables.css|\\.\\./\\.\\./design-md|@import .*design-md" package.json src
```

결과:

- 매칭 없음
- `package.json`과 `src` 기준으로 design-md 자동 적용/import 경로 제거 확인

### 5.3 Production server

명령:

```bash
npm start -- -H 127.0.0.1 -p 3002
curl -s -I http://127.0.0.1:3002/design-system/components
```

결과:

- `HTTP/1.1 200 OK`
- 현재 확인 URL: `http://127.0.0.1:3002/design-system/components`
- `next start`는 standalone 권장 경고를 계속 출력한다.

### 5.4 Audit

명령:

```bash
npm audit --omit=dev --json
```

결과:

- 실패
- 기존과 같은 4개 production advisory 유지
- `@openai/apps-sdk-ui` bundled `lodash` 관련 advisory 3개, `fixAvailable: false`
- `next` -> `postcss` advisory 1개, npm 제안 fix는 부적절한 major downgrade

## 6. 남은 리스크

- `design-md/` 폴더와 `scripts/sync-design-tokens.mjs` 파일은 삭제하지 않았다. 다만 앱 실행/빌드에서는 더 이상 자동 적용되지 않는다.
- 많은 기존 UI는 아직 `--ui-*`, `--component-*` 같은 xGen compatibility token을 사용한다. 값의 출처는 Apps SDK UI지만, 모든 화면이 Apps SDK UI component로 재작성된 상태는 아니다.
- `/design-system/components`는 확인했지만, 모든 노드 조합/다크 모드/모바일 폭은 추가 QA가 필요하다.
- packaged `release/mac/xGen.app`은 최신 반영이 보장되지 않는다. 현재 확인은 `http://127.0.0.1:3002` 기준이다.

## 7. 다음 태스크

1. `src/app/design-system/components/page.tsx`의 토큰 목록과 설명을 Apps SDK UI token naming에 맞게 갱신한다.
2. node shell 공통 스타일을 Apps SDK UI `Card`/surface 패턴으로 묶을 수 있는지 검토한다.
3. `StyleAddModal`의 input/filter/action을 `src/components/ui/` wrapper 기반 Apps SDK UI component로 전환한다.
