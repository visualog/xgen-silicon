# Unified Node Color Report

작성일: 2026-06-04
브랜치: `feature/apps-sdk-ui-foundation`
작업명: 노드별 컬러 통일

## 1. 작업 목적

노드마다 프롬프트/스타일/출력/구도/배경 등 타입별 컬러가 다르게 적용되던 방식을 제거하고, 전체 노드 포트/칩/선택 accent를 하나의 공통 컬러로 통일했다.

## 2. 구현 내용

수정 파일:

- `src/app/globals.css`

추가/변경한 토큰:

- `--node-accent-unified`
- `--port-prompt`
- `--port-style`
- `--port-character-reference`
- `--port-object-reference`
- `--port-element-board`
- `--port-ratio`
- `--port-resolution`
- `--port-composition`
- `--port-background`
- `--port-constraint`
- `--port-mood`
- `--port-palette`
- `--port-camera-angle`
- `--port-object-angle`
- `--port-lighting`
- `--port-gesture`
- `--port-props`
- `--port-detail`
- `--port-image-mix`

모든 `--port-*` 토큰을 `--node-accent-unified`로 alias했다. 따라서 개별 노드 파일에서 기존처럼 `var(--port-style)` 또는 `var(--port-resolution)`을 참조해도 실제 화면에서는 같은 공통 accent로 보인다.

## 3. 의도적으로 유지한 것

- React Flow handle id
- 연결/연결 해제 동작
- 노드 데이터 계약
- 생성 API/worker
- 개별 노드 파일 구조

이번 변경은 토큰 alias 방식이라, 노드별 타입 정보는 색이 아니라 라벨, 아이콘, 위치, 노드 제목으로 구분된다.

## 4. 검증 결과

### 4.1 빌드

명령:

```bash
npm run build:next
```

결과:

- 통과
- Next.js `16.2.6`
- TypeScript 통과
- 19개 route 생성 확인

### 4.2 Audit

명령:

```bash
npm audit --omit=dev --json
```

결과:

- 실패(exit 1)
- 기존과 동일하게 production vulnerability 총 4개
- `@openai/apps-sdk-ui` -> `lodash` advisory 유지
- `next` -> `postcss` advisory 유지

### 4.3 빌드 산출물

명령:

```bash
rg -n -e "--node-accent-unified" -e "--port-prompt:var\\(--node-accent-unified\\)" -e "--port-image-mix:var\\(--node-accent-unified\\)" .next/static .next/server -g '*.*'
```

결과:

- `.next/static` CSS 산출물에서 공통 node accent와 port alias 반영 확인

### 4.4 실행 확인

현재 최신 변경을 볼 수 있는 URL:

- `http://127.0.0.1:3002`

기존 packaged `release/mac/xGen.app`는 아직 이번 변경이 반영됐다고 보장할 수 없다. 현재 확인은 `3002` production server 기준이다.

## 5. 스크린샷

- Before: `notes/screenshots/apps-sdk-ui-unified-node-color-2026-06-04/before-fullscreen.png`
- After: `notes/screenshots/apps-sdk-ui-unified-node-color-2026-06-04/after-fullscreen.png`

## 6. 남은 리스크

- 포트 컬러가 모두 통일되면서 노드 타입 구분은 색상이 아니라 라벨과 위치에 더 의존한다.
- 갤러리/문서 페이지 일부 장식도 `--port-*`를 참조하므로 단색 톤으로 같이 정리된다.
- packaged app 갱신은 별도 확인이 필요하다.
