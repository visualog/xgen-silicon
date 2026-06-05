# Apps SDK UI 적용 핸드오프 작성 가이드

작성일: 2026-06-04
브랜치: `feature/apps-sdk-ui-foundation`
목적: Apps SDK UI 디자인 시스템 적용 작업을 작은 태스크 단위로 나누고, 각 태스크 완료 후 한글 핸드오프를 일관된 형식으로 남기기 위한 기준 문서

## 1. 전체 작업 방향

Apps SDK UI 디자인 시스템은 xGen에 한 번에 전면 적용하지 않는다. 현재 xGen은 무한 캔버스, 노드 기반 이미지 생성 흐름, 포트 컬러, 갤러리, 스타일 참조 라이브러리 등 자체 구조가 강하다. 따라서 Apps SDK UI는 아래 순서로 천천히 적용한다.

1. foundation 연결
2. 로컬 wrapper 생성
3. 작은 control 계열 교체
4. 생성/토큰 관련 control 정리
5. 복잡한 modal 정리
6. node shell 공통화
7. 전체 visual QA

각 태스크는 독립적으로 검증 가능해야 하며, 한 태스크가 실패해도 이전 안정 상태로 쉽게 돌아갈 수 있어야 한다.

## 2. 태스크 운영 원칙

각 태스크는 다음 원칙을 따른다.

- 변경 범위는 작게 유지한다.
- 한 번에 여러 UI 영역을 바꾸지 않는다.
- Apps SDK UI 컴포넌트는 직접 여러 파일에 흩뿌리지 않는다.
- 먼저 `src/components/ui/` wrapper를 통해 도입한다.
- 기존 xGen 토큰과 포트 색상은 바로 제거하지 않는다.
- 매 태스크마다 before/after screenshot을 저장한다.
- 매 태스크마다 한글 핸드오프 문서를 작성한다.
- 검증 결과와 실패한 검증도 숨기지 않고 기록한다.
- 다음 작업자가 바로 이어갈 수 있도록 다음 태스크를 명시한다.

## 3. 공통 핸드오프 문서 구조

각 태스크 완료 후 `notes/apps-sdk-ui-<task-name>-task<N>-handoff.md` 형식으로 문서를 저장한다.

권장 구조:

```md
# Apps SDK UI 적용 Task N 핸드오프

작성일:
브랜치:
작업명:

## 1. 작업 목적
왜 이 태스크를 했는지, 어떤 문제를 줄이려는지 설명한다.

## 2. 적용 범위
이번 태스크에 포함한 것과 제외한 것을 나눈다.

## 3. 구현 내용
변경된 구조와 핵심 의사결정을 설명한다.

## 4. 변경 파일 목록
코드, 설정, 문서, 스크린샷을 나누어 적는다.

## 5. 검증 결과
실행한 명령, 통과/실패, 실패 원인, 재시도 여부를 적는다.

## 6. 현재 상태
브랜치, 커밋 여부, 서버 상태, 작업 트리 상태를 적는다.

## 7. 알려진 리스크
audit, 시각 QA 미완료, 접근성, 패키지 충돌 등을 적는다.

## 8. 다음 태스크 제안
다음 작업의 목표, 파일 후보, 검증 기준을 적는다.

## 9. 다음 작업자에게 남기는 운영 규칙
주의할 점과 반복해야 할 절차를 적는다.
```

## 4. 태스크별 상세 계획

### Task 1: Foundation bridge와 라인 컬러 통합

상태:

- 완료
- 문서: `notes/apps-sdk-ui-foundation-task1-handoff.md`

목표:

- Apps SDK UI CSS foundation을 연결한다.
- Tailwind 4 PostCSS 설정을 추가한다.
- React Flow edge를 입력/출력 라인 두 타입으로 줄인다.

핵심 파일:

- `package.json`
- `package-lock.json`
- `postcss.config.mjs`
- `src/app/layout.tsx`
- `src/app/globals.css`
- `src/app/page.tsx`

검증:

- `npm run build:next`
- production server 응답 확인
- before/after screenshot 저장

### Task 2: Apps SDK UI Control Wrapper 도입

목표:

- Apps SDK UI 컴포넌트를 xGen 코드에 직접 흩뿌리지 않고, 로컬 wrapper로 감싼다.
- 이후 패키지 API 변경이나 audit 리스크가 생겨도 교체 지점을 좁힌다.

작업 후보:

- `src/components/ui/XgenButton.tsx`
- `src/components/ui/XgenSelectControl.tsx`
- `src/components/ui/XgenSegmentedControl.tsx`
- `src/components/ui/index.ts`

적용 범위:

- 실제 주요 노드에 바로 적용하지 않는다.
- 먼저 디자인 시스템 페이지나 작은 샘플 영역에서 wrapper가 SSR/build에 안전한지 확인한다.

검증:

- `npm run build:next`
- wrapper import가 서버 컴포넌트/클라이언트 컴포넌트 경계에서 문제없는지 확인
- `npm audit --omit=dev --json` 결과 업데이트

핸드오프:

- `notes/apps-sdk-ui-control-wrapper-task2-handoff.md`

### Task 3: Output Settings 선택 UI 전환

목표:

- 비율/해상도처럼 작고 독립적인 선택 UI부터 Apps SDK UI 패턴으로 바꾼다.
- 노드 캔버스 전체를 건드리지 않고 작은 컨트롤 단위로 검증한다.

작업 후보:

- `src/components/nodes/OutputSettingsNode.tsx`
- `src/components/nodes/RatioNode.tsx`
- `src/components/nodes/ResolutionNode.tsx`

적용 방식:

- `XgenSegmentedControl` 또는 `XgenSelectControl` wrapper를 사용한다.
- 기존 상태값과 props 계약은 유지한다.
- 저장/복원 데이터 구조는 바꾸지 않는다.

검증:

- 비율 변경
- 해상도 변경
- output node 연결 유지
- 페이지 새로고침 후 상태 복원
- `npm run build:next`

핸드오프:

- `notes/apps-sdk-ui-output-settings-task3-handoff.md`

### Task 4: 생성 백엔드/토큰 컨트롤 UI 준비

목표:

- 토큰/비용 최적화를 위한 제어 UI를 Apps SDK UI 패턴으로 설계한다.
- 실제 백엔드 구현 전에 UI와 상태 모델을 작게 준비한다.

작업 후보:

- 생성 백엔드 선택: `Codex`, `OpenAI Images`, `ComfyUI Local`, `Ollama Prompt`
- 생성 모드 선택: `Preview`, `Final`
- 참조 이미지 정책: `텍스트만`, `자동`, `강제 첨부`

주의:

- 실제 API route나 worker backend 교체는 하지 않는다.
- UI shell과 상태 저장 구조만 검토한다.
- 토큰 사용량 라벨은 `사용 토큰`보다 `생성 호출 사용량` 또는 `Codex 보고 사용량`처럼 오해가 적은 표현을 검토한다.

검증:

- 상태 선택
- 새로고침 후 상태 복원
- 기존 이미지 생성 버튼 동작 불변
- `npm run build:next`

핸드오프:

- `notes/apps-sdk-ui-generation-controls-task4-handoff.md`

### Task 5: Style Reference Modal 정리

목표:

- 가장 복잡한 `StyleAddModal`의 검색, 필터, 선택, 추가 UI를 Apps SDK UI control 패턴으로 정리한다.
- 기능은 바꾸지 않고 UI 일관성만 높인다.

작업 후보:

- `src/components/StyleAddModal.tsx`
- `src/lib/style-reference-library.ts`

적용 범위:

- 검색 input
- category filter
- tag filter
- library item action
- add/import 버튼

주의:

- 라이브러리 로딩/검색 로직은 바꾸지 않는다.
- 이미지 URL 처리나 reference attachment 정책은 별도 태스크로 분리한다.

검증:

- 라이브러리 로드
- 검색
- 필터 적용
- 스타일 추가
- URL/파일 업로드 경로 회귀 없음
- `npm run build:next`

핸드오프:

- `notes/apps-sdk-ui-style-modal-task5-handoff.md`

### Task 6: Node Shell 공통화

목표:

- 노드마다 반복되는 header/body/action/port layout을 공통 컴포넌트로 정리한다.
- 전체 노드를 한 번에 바꾸지 않고 대표 노드 2~3개부터 적용한다.

작업 후보:

- `src/components/nodes/PromptNode.tsx`
- `src/components/nodes/StyleNode.tsx`
- `src/components/nodes/OutputSettingsNode.tsx`
- `src/components/ui/XgenNodeShell.tsx`
- `src/components/ui/XgenNodeHeader.tsx`
- `src/components/ui/XgenPortHandle.tsx`

검증:

- 노드 드래그
- 노드 삭제
- 라인 연결/해제
- 다크/라이트 모드
- 긴 텍스트 overflow
- `npm run build:next`

핸드오프:

- `notes/apps-sdk-ui-node-shell-task6-handoff.md`

### Task 7: 전체 Visual QA

목표:

- Apps SDK UI 기반 적용 후 전체 화면 밀도, 대비, 라인 노이즈, 노드 정체성, 다크/라이트 모드 품질을 검토한다.

검증 화면:

- 갤러리 첫 화면
- 노드 캔버스 기본 상태
- optional node 여러 개 추가 상태
- output/canvas/image layer/mask 연결 상태
- Style Reference Modal
- token usage card
- preview modal
- 좁은 화면/낮은 높이 화면

검증:

- screenshot set 저장
- `npm run build:next`
- 가능하면 수동 QA 체크리스트 작성

핸드오프:

- `notes/apps-sdk-ui-visual-qa-task7-handoff.md`

## 5. 매 태스크 시작 전 체크리스트

태스크 시작 전:

- 현재 브랜치 확인
- `git status --short` 확인
- 이전 태스크 핸드오프 읽기
- `notes/`에 계획 노트 작성
- before screenshot 저장
- 변경 범위를 한 문장으로 제한

## 6. 매 태스크 완료 전 체크리스트

태스크 완료 전:

- `npm run build:next` 실행
- 필요 시 `npm audit --omit=dev --json` 실행
- after screenshot 저장
- 변경 파일 목록 기록
- 실패한 검증도 그대로 기록
- 한글 핸드오프 작성
- 다음 태스크를 구체적으로 제안

## 7. 현재 브랜치에서 이어갈 때 주의할 점

- Task 1 변경은 아직 커밋되지 않았다.
- Apps SDK UI package가 추가되면서 audit 리스크가 생겼다.
- 다음 태스크에서 wrapper를 만들기 전에는 Apps SDK UI 컴포넌트를 여러 노드 파일에 직접 import하지 않는다.
- xGen의 포트 컬러는 아직 노드 정체성에 필요하므로 제거하지 않는다.
- 라인 컬러는 입력/출력 흐름 기준으로 유지한다.
