# shadcn Badge spacing normalization report

Date: 2026-06-08

## Summary

- Confirmed the `Live` chip in the Prompt system card is a shadcn/ui `Badge`.
- Added `data-variant` metadata to the Badge primitive for clearer component auditing.
- Added a docs-route-only Badge spacing guard under `.shadcn-docs-surface`.

## Before / after evidence

- Before: `notes/screenshots/shadcn-badge-spacing-normalization-2026-06-08/before-fullscreen.png`
- After: `notes/screenshots/shadcn-badge-spacing-normalization-2026-06-08/after-fullscreen.png`

## Files changed

- `src/components/ui/badge.tsx`
  - Added `data-variant={variant ?? "default"}` while preserving the shadcn Badge class contract.
- `src/app/globals.css`
  - Added `.shadcn-docs-surface [data-slot="badge"]` guard for minimum height, inline padding, block padding, and line-height.

## Verification

- `./node_modules/.bin/eslint src/components/ui/badge.tsx src/app/design-system/components/page.tsx`
  - Passed.
- `npm run build:next`
  - Passed.
- `curl -s -I http://127.0.0.1:3013/design-system/components`
  - Passed with `HTTP/1.1 200 OK`.

## Server

- Restarted `http://127.0.0.1:3013` after the production build.
- Existing warning remains: `next start` reports that standalone output should be served through `.next/standalone/server.js`.

## Remaining risks

- The Badge normalization is intentionally scoped to `.shadcn-docs-surface`; production surfaces are unchanged.
- If production needs the same Badge rhythm, apply it after the design-system page is approved.
