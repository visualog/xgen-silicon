# shadcn control row spacing normalization report

Date: 2026-06-08

## Summary

- Confirmed `Consistency pass` is a composed control row, not a standalone shadcn primitive.
- It combines a label, helper text, and shadcn `Switch`.
- Added `data-slot="control-row"` to this pattern and to the similar workspace navigation rows.
- Added a docs-route-only guard for row padding, minimum height, gap, and text overflow behavior.

## Before / after evidence

- Before: `notes/screenshots/shadcn-control-row-spacing-normalization-2026-06-08/before-fullscreen.png`
- After: `notes/screenshots/shadcn-control-row-spacing-normalization-2026-06-08/after-fullscreen.png`

## Files changed

- `src/app/design-system/components/page.tsx`
  - Marked composed bordered rows with `data-slot="control-row"`.
- `src/app/globals.css`
  - Added `.shadcn-docs-surface [data-slot="control-row"]` spacing guard.
  - Added mobile adjustment for the same row pattern.

## Verification

- `./node_modules/.bin/eslint src/app/design-system/components/page.tsx src/components/ui/switch.tsx`
  - Passed.
- `npm run build:next`
  - Passed.
- `curl -s -I http://127.0.0.1:3013/design-system/components`
  - Passed with `HTTP/1.1 200 OK`.

## Server

- Restarted `http://127.0.0.1:3013` after the production build.
- Existing standalone warning remains from the repository configuration.

## Remaining risks

- The control-row guard is scoped to `.shadcn-docs-surface`; production surfaces are unchanged.
- `Switch` itself was not changed because the source primitive is already a shadcn component and the visible issue was the composed row container spacing.
