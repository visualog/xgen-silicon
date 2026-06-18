# Design System CSS Task 1 Report - Primitive Overrides

Date: 2026-06-10

## Summary

Removed design-system docs CSS that overrode local shadcn/ui primitive internals. The design-system pages now rely on the actual `src/components/ui/*` component classes for card, button, badge, input, textarea, and select sizing/styling.

## Files Changed

- `src/app/globals.css`
  - Removed `.shadcn-docs-surface [data-slot="..."]` primitive override selectors.
  - Kept only shell-level docs CSS:
    - `.shadcn-docs-surface`
    - `.shadcn-docs-header`
    - `.shadcn-docs-body`
  - Kept mobile body rail adjustment.

## Screenshots

- Before: `notes/screenshots/design-system-css-task1-primitive-overrides-2026-06-10/before-fullscreen.png`
- After: `notes/screenshots/design-system-css-task1-primitive-overrides-2026-06-10/after-fullscreen.png`

## Verification

- `rg -n "shadcn-docs-surface \\[data-slot" src/app/globals.css`
  - No matches.
- `npm run build:next`
  - Passed.
- `curl -s --max-time 8 -I http://127.0.0.1:3002/design-system/components`
  - Returned `HTTP/1.1 200 OK`.
- `curl -s --max-time 8 -I http://127.0.0.1:3002/design-system/patterns`
  - Returned `HTTP/1.1 200 OK`.
- Server restarted on `http://127.0.0.1:3002`.

## Remaining Risks

- `globals.css` still contains legacy button compatibility classes and CSS Modules-style `composes:` rules. That is Task 2.
- Token namespace cleanup remains Task 3.
