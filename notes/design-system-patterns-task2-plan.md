# Design System Patterns Task 2 Plan

Date: 2026-06-10

## Goal

Add `/design-system/patterns` as the home for xGen workflow-specific shadcn compositions. Keep `/design-system/components` focused on primitive behavior and keep changed files under 300 lines.

## Scope

- Add Patterns to the design-system navigation and overview cards.
- Create `src/app/design-system/patterns/page.tsx`.
- Add pattern data to `src/app/design-system/_data/design-system.ts`.
- Reuse existing shared page sections where possible.
- Document composed examples:
  - Prompt builder
  - Style reference picker
  - Generation queue
  - Output preset
  - Gallery action
  - Settings/status row

## Out of Scope

- Production editor redesign.
- shadcn primitive source changes.
- Full visual polish pass beyond making the new route coherent.

## Before Screenshots

- `notes/screenshots/design-system-patterns-task2-2026-06-10/before-overview-fullscreen.png`
- `notes/screenshots/design-system-patterns-task2-2026-06-10/before-components-fullscreen.png`

## Verification Plan

- `wc -l` on touched design-system files.
- `./node_modules/.bin/eslint src/app/design-system`
- `npm run build:next`
- HTTP checks for `/design-system`, `/design-system/patterns`, `/design-system/components`, `/design-system/templates`
- After screenshots for overview, patterns, and components.
