# shadcn Task 5 Plan: Chart Performance

Date: 2026-06-05
Branch: `feature/apps-sdk-ui-foundation`

## Scope

Evaluate and reduce the loading impact of the official shadcn chart/Recharts addition on `/design-system/components`.

## Before Capture

- `notes/screenshots/shadcn-task5-chart-performance-2026-06-05/before-fullscreen.png`

## Findings Before Changes

- Route response: `200 OK`
- Route HTML content length: `115829`
- The route client reference manifest includes chart-related modules synchronously.
- Static chunks containing Recharts-related code:
  - `.next/static/chunks/0musd1mr9k4-k.js`: `334433` bytes
  - `.next/static/chunks/03jiw.wsa8oym.js`: `100470` bytes
- `RenderProgressChart` is present in `.next/static/chunks/03jiw.wsa8oym.js`.

## Plan

1. Keep the official shadcn chart component installed.
2. Move the chart renderer behind a small client dynamic boundary.
3. Keep the chart below the first viewport.
4. Rebuild and confirm whether Recharts moves out of the initial route entry chunks.
5. Capture after screenshot and write report/handoff.

## Guardrails

- Do not remove the official shadcn chart component.
- Do not introduce arbitrary spacing, type, or color values.
- Use a token-based placeholder while the chart client chunk loads.
