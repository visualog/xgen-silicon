# Design System Components Task 3 Plan

Date: 2026-06-10

## Goal

Refine `/design-system/components` from a simple primitive catalog into a compact usage guide with concise do/don't guidance and small anatomy examples.

## Scope

- Keep workflow examples on `/design-system/patterns`.
- Keep `/design-system/components` primitive-only.
- Add usage guidance for major component categories.
- Add small anatomy examples for Button, Card, and Input.
- Keep every touched file under 300 lines.

## Out of Scope

- shadcn primitive source changes.
- Production app/editor redesign.
- Adding interactive documentation search.

## Before Screenshots

- `notes/screenshots/design-system-components-task3-2026-06-10/before-components-fullscreen.png`

## Verification Plan

- `wc -l` on touched files.
- `./node_modules/.bin/eslint src/app/design-system`
- `npm run build:next`
- HTTP checks for design-system routes.
- After screenshots for `/design-system/components` and `/design-system/patterns`.
