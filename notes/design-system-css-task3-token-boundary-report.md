# Design System CSS Task 3 Report - Token Boundary

Date: 2026-06-10

## Summary

Clarified token ownership in `src/app/globals.css` and removed a global body-level override that was taking precedence over the shadcn base layer.

## Files Changed

- `src/app/globals.css`
  - Marked `--background`, `--foreground`, `--card`, `--primary`, and related values as shadcn/ui source tokens.
  - Marked `--ui-*` and `--surface-*` values as xGen migration aliases backed by shadcn tokens.
  - Marked `--bg-*` and `--text-*` values as legacy app surface aliases.
  - Removed `font: var(--ui-type-base)`, `background-color: var(--bg-canvas)`, and `color: var(--text-primary)` from the global `html, body` rule.

## Screenshots

- Before: `notes/screenshots/design-system-css-task3-token-boundary-2026-06-10/before-fullscreen.png`
- After: `notes/screenshots/design-system-css-task3-token-boundary-2026-06-10/after-fullscreen.png`

## Verification

- `rg -n "html,body\\{[^}]*var\\(--bg-canvas\\)|html,body\\{[^}]*var\\(--text-primary\\)|html,body\\{[^}]*var\\(--ui-type-base\\)" .next/static/chunks -S`
  - No matches.
- `npm run build:next`
  - Passed.
- `curl -s --max-time 8 -I http://127.0.0.1:3002/design-system/components`
  - Returned `HTTP/1.1 200 OK`.
- `curl -s --max-time 8 -I http://127.0.0.1:3002/design-system/patterns`
  - Returned `HTTP/1.1 200 OK`.

## Remaining Risks

- Legacy aliases are still present because existing app surfaces use them. They are now labeled as migration aliases.
- The next task should inspect visual balance in `PageHero`; remaining left-heavy appearance is likely composition, not CSS token conflict.
