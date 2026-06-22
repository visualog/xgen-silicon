# Korean Button Labels Plan - 2026-06-22

## Scope

- Current editor screen at `http://localhost:3000/`.
- Replace remaining English button labels and accessibility labels with Korean.
- Keep behavior, layout, and prompt-generation logic unchanged.

## Before Evidence

- Screenshot: `notes/screenshots/korean-button-labels-2026-06-22/before.png`
- Found English labels:
  - `Compose`
  - `Use For Generation`
  - `Copy`
  - `Editor mode controls`
  - `Control Panel`
  - `Zoom In`
  - `Zoom Out`
  - `Fit View`
  - `Toggle Theme`
  - `Dark theme`

## Files To Change

- `src/components/nodes/OutputNode.tsx`
- `src/app/page.tsx`

## Verification

- Run targeted lint for changed files.
- Reload `http://localhost:3000/` and inspect button text, `aria-label`, `title`, and placeholder values.
- Capture after screenshot.
