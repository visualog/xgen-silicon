# Design System CSS Task 2 Plan - Legacy Buttons

Date: 2026-06-10

## Goal

Remove unused legacy global button CSS that conflicts with the shadcn/ui Button source-of-truth.

## Before Evidence

- `notes/screenshots/design-system-css-task2-legacy-buttons-2026-06-10/before-fullscreen.png`

## Findings

- `.btn-primary`, `.btn-secondary`, `.button-primary`, and `.button-secondary` are only found in `src/app/globals.css`.
- `.button-primary { composes: btn-primary; }` and `.button-secondary { composes: btn-secondary; }` are CSS Modules syntax in global CSS and should not remain.

## Plan

1. Remove the unused legacy button CSS block from `src/app/globals.css`.
2. Re-run search to confirm no remaining definitions.
3. Build and verify design-system routes.
4. Capture after screenshot and write report/handoff.
