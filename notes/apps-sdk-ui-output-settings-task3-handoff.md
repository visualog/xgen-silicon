# Apps SDK UI 적용 Task 3 핸드오프

작성일: 2026-06-04
브랜치: `feature/apps-sdk-ui-foundation`
작업명: Output Settings 선택 UI 전환

## 1. 작업 목적

Task 2에서 만든 `src/components/ui/` wrapper를 실제 노드 UI에 처음 적용했다. 이번 Task 3의 목표는 비율/해상도처럼 독립적이고 저장 구조가 단순한 선택 UI를 Apps SDK UI 기반 `XgenSegmentedControl`로 바꾸는 것이다.

전체 노드 쉘이나 모달은 건드리지 않고, 선택 컨트롤만 교체해서 실제 제품 화면 적용 리스크를 작게 유지했다.

## 2. 적용 범위

이번 태스크에 포함한 범위:

- `OutputSettingsNode`의 비율 선택 UI 교체
- `OutputSettingsNode`의 해상도 선택 UI 교체
- 독립 `RatioNode`의 비율 선택 UI 교체
- 독립 `ResolutionNode`의 해상도 선택 UI 교체
- before/after 스크린샷 저장
- 빌드, audit, 빌드 산출물 검증

이번 태스크에서 제외한 범위:

- node shell 공통화
- 포트 chip/handle 구조 변경
- 연결/연결 해제 동작 변경
- 저장/복원 데이터 구조 변경
- 생성 API 또는 worker 변경
- `StyleAddModal` 변경
- Apps SDK UI 원본 컴포넌트 직접 import

## 3. 구현 내용

### 3.1 OutputSettingsNode 전환

수정 파일:

- `src/components/nodes/OutputSettingsNode.tsx`

기존 구현:

- 각 비율/해상도 옵션을 개별 `button`으로 렌더링
- 로컬 `toolbarStyle`, `toolbarButtonStyle`로 active 상태를 직접 스타일링

변경 후:

- `XgenSegmentedControl` wrapper 사용
- 비율 옵션: `1:1`, `16:9`, `9:16`, `4:3`, `3:4`
- 해상도 옵션: `SD`, `HD`, `4K`, `8K`
- 기존 `data.ratio`, `data.setRatio`, `data.resolution`, `data.setResolution` 계약 유지
- 포트 chip과 React Flow `Handle` 유지

### 3.2 RatioNode 전환

수정 파일:

- `src/components/nodes/RatioNode.tsx`

기존 독립 ratio toolbar를 `XgenSegmentedControl`로 교체했다. 값 목록과 setter 계약은 그대로 유지했다.

### 3.3 ResolutionNode 전환

수정 파일:

- `src/components/nodes/ResolutionNode.tsx`

기존 독립 resolution toolbar를 `XgenSegmentedControl`로 교체했다. 값 목록과 setter 계약은 그대로 유지했다.

### 3.4 Wrapper import 규칙 유지

이번 태스크에서 Apps SDK UI 원본 컴포넌트는 노드 파일에 직접 import하지 않았다.

노드 파일은 로컬 wrapper만 import한다.

```ts
import { XgenSegmentedControl } from "@/components/ui";
```

## 4. 변경 파일 목록

코드:

- `src/components/nodes/OutputSettingsNode.tsx`
- `src/components/nodes/RatioNode.tsx`
- `src/components/nodes/ResolutionNode.tsx`

문서/검증 자료:

- `notes/apps-sdk-ui-output-settings-plan.md`
- `notes/apps-sdk-ui-output-settings-task3-handoff.md`
- `notes/screenshots/apps-sdk-ui-output-settings-2026-06-04/before-fullscreen.png`
- `notes/screenshots/apps-sdk-ui-output-settings-2026-06-04/after-fullscreen.png`

참고:

- 작업 트리에는 Task 1 foundation 변경과 Task 2 wrapper 변경도 아직 함께 남아 있다.

## 5. 검증 결과

### 5.1 빌드

명령:

```bash
npm run build:next
```

결과:

- 통과
- Next.js `16.2.6`
- TypeScript 통과
- `/`, `/design-system/components`, `/guide`, `/xmark`, API routes 포함 19개 route 생성 확인
- `scripts/prepare-electron-package.mjs` 실행 완료

### 5.2 Audit

명령:

```bash
npm audit --omit=dev --json
```

결과:

- 실패(exit 1)
- production vulnerability 총 4개
- moderate 3개, high 1개
- `@openai/apps-sdk-ui` -> `lodash` advisory 유지
- `next` -> `postcss` advisory 유지
- `@openai/apps-sdk-ui`/`lodash` 쪽은 현재 `fixAvailable: false`

판단:

- Task 1, Task 2에서 확인한 audit 리스크와 동일하다.
- 이번 태스크는 wrapper 적용 범위 안에서 실제 노드 UI만 부분 교체했으며, 패키지 리스크 자체는 아직 해소하지 않았다.

### 5.3 빌드 산출물 확인

명령:

```bash
rg -n "화면 비율|XgenSegmentedControl|ratioOptions|해상도" .next/static .next/server -g '*.*'
```

결과:

- `.next` 산출물에서 새 segmented control 경로와 비율/해상도 문자열 확인
- `OutputSettingsNode`, `RatioNode`, `ResolutionNode` 변경이 production build에 포함된 것으로 확인

### 5.4 로컬 서버와 스크린샷

before:

- 기존 `127.0.0.1:3001` xGen 서버를 열어 캡처

after:

- 새 빌드 기준 임시 production server 실행

```bash
npm start -- -H 127.0.0.1 -p 3002
```

결과:

- `http://127.0.0.1:3002` 실행 확인
- `next start` standalone 경고 출력
- after screenshot 저장 후 3002 서버 종료

스크린샷:

- Before: `notes/screenshots/apps-sdk-ui-output-settings-2026-06-04/before-fullscreen.png`
- After: `notes/screenshots/apps-sdk-ui-output-settings-2026-06-04/after-fullscreen.png`

주의:

- after 캡처는 홈 화면 기준이다.
- Playwright가 설치되어 있지 않아 자동으로 노드 에디터에 진입해 ratio/resolution 컨트롤을 클릭 검증하지는 못했다.
- 노드 컨트롤 적용 여부는 `npm run build:next`와 `.next` 산출물 확인을 주 검증 근거로 삼았다.

## 6. 현재 상태

- 브랜치: `feature/apps-sdk-ui-foundation`
- Task 3 구현: 완료
- Task 3 핸드오프: 완료
- 커밋: 아직 생성하지 않음
- 3002 임시 서버: 종료
- 기존 3001 xGen 서버: 작업 전부터 실행 중이었고 이번 태스크에서 재시작하지 않음

## 7. 알려진 리스크

### 7.1 수동 상호작용 QA 미완료

빌드와 산출물 검증은 통과했지만, 자동화 도구 부재로 다음 항목은 수동 QA가 필요하다.

- 비율 segmented control 클릭
- 해상도 segmented control 클릭
- output node 연결 유지
- 페이지 새로고침 후 상태 복원
- 다크/라이트 모드에서 active segment 시각 확인

### 7.2 Apps SDK UI audit 리스크

`@openai/apps-sdk-ui@0.2.2`의 lodash advisory는 계속 남아 있다. 다음 태스크에서도 원본 컴포넌트를 직접 import하지 말고 wrapper를 유지해야 한다.

### 7.3 Apps SDK UI 스타일 밀도

기존 xGen toolbar보다 Apps SDK UI segmented control이 더 정돈되어 보일 수 있지만, 노드 폭이 좁은 상태에서는 텍스트 옵션(`4:3`, `3:4`, `8K`)의 밀도를 반드시 직접 확인해야 한다.

## 8. 다음 태스크 제안

Task 4: 생성 백엔드/토큰 컨트롤 UI 준비

목표:

- 생성 백엔드, 생성 모드, reference policy 같은 선택 상태를 wrapper 기반으로 설계한다.
- 실제 API route나 worker backend 교체는 하지 않는다.
- UI shell과 상태 저장 구조만 검토한다.

검증 기준:

- 상태 선택
- 새로고침 후 상태 복원
- 기존 이미지 생성 버튼 동작 불변
- `npm run build:next`
- before/after screenshot 저장

## 9. 다음 작업자에게 남기는 운영 규칙

- Apps SDK UI 원본 컴포넌트를 제품 노드 파일에 직접 import하지 않는다.
- `src/components/ui/` wrapper를 통해서만 사용한다.
- Task 4 시작 전 planning note와 before screenshot을 먼저 남긴다.
- 이번 Task 3는 수동 노드 상호작용 QA가 남아 있으므로, Task 4 전에 가능하면 노드 화면에서 ratio/resolution 클릭을 먼저 확인한다.
