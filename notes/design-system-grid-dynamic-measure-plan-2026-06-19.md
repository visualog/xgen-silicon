# Design System Grid Dynamic Measure Plan - 2026-06-19

## Request

컬럼 그리드 번호 아래에 현재 컬럼 너비를 동적으로 표시하고, 각 갭에도 현재 갭 너비를 동적으로 표시한다.

## Before Screenshot

- `notes/screenshots/design-system-grid-dynamic-measure-2026-06-19/before-fullscreen.png`

## Plan

1. Keep the existing responsive grid rules: 4 columns on mobile, 8 on tablet, 12 on desktop.
2. Measure the active viewport rail in the grid overlay client component.
3. Render the computed column width under each visible column number.
4. Render gap-width labels inside the grid gutters.
5. Verify lint, build, and local route response.
