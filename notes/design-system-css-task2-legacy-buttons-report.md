# Design System CSS Task 2 Report - Legacy Buttons

Date: 2026-06-10

## Summary

Removed unused legacy global button CSS from `src/app/globals.css` so shadcn/ui `Button` remains the only button styling source for the design-system pages.

## Files Changed

- `src/app/globals.css`
  - Removed `.btn-primary`.
  - Removed `.btn-secondary`.
  - Removed `.button-primary { composes: btn-primary; }`.
  - Removed `.button-secondary { composes: btn-secondary; }`.

## Screenshots

- Before: `notes/screenshots/design-system-css-task2-legacy-buttons-2026-06-10/before-fullscreen.png`
- After: `notes/screenshots/design-system-css-task2-legacy-buttons-2026-06-10/after-fullscreen.png`

## Verification

- `rg -n "\\b(btn-primary|btn-secondary|button-primary|button-secondary|composes:)\\b" src/app/globals.css src/components src/app/design-system`
  - No matches.
- `npm run build:next`
  - Passed.
- `curl -s --max-time 8 -I http://127.0.0.1:3002/design-system/components`
  - Returned `HTTP/1.1 200 OK`.
- `curl -s --max-time 8 -I http://127.0.0.1:3002/design-system/patterns`
  - Returned `HTTP/1.1 200 OK`.

## Remaining Risks

- Root token namespace still mixes shadcn source tokens and compatibility aliases. That is Task 3.
- Page hero composition still needs visual balance review after CSS cleanup. That is Task 4.
