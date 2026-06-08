# shadcn select spacing normalization report

Date: 2026-06-08

## Summary

Checked and normalized dropdown/select spacing for `/design-system/components`. The shadcn Select source was already structurally correct, so the fix keeps the registry component unchanged and adds documentation-route guards.

## Screenshots

- Before: `notes/screenshots/shadcn-select-spacing-normalization-2026-06-08/before-fullscreen.png`
- After: `notes/screenshots/shadcn-select-spacing-normalization-2026-06-08/after-fullscreen.png`

## Root Cause

- `src/components/ui/select.tsx` already has the expected shadcn trigger classes: `px-3 py-2`, `data-[size=default]:h-9`, `data-[size=sm]:h-8`.
- Tailwind compiled CSS includes `--spacing`, `px-3`, `py-2`, `h-9`, and `w-full`.
- `SelectTrigger` already exposes `data-slot="select-trigger"` and `data-size`, unlike the earlier Button gap that required adding size metadata.
- The remaining risk is shadcn's trigger default `w-fit`: when a caller forgets `className="w-full"`, the dropdown collapses to content width.
- Select items are intentionally compact in the registry (`pl-2 pr-8 py-1.5`), which can look under-padded in this large documentation preview.

## Files Changed

- `src/app/globals.css`
  - Added docs-route guards for `[data-slot="select-trigger"]`.
  - Added docs-route guards for `[data-slot="select-trigger"][data-size="sm"]`.
  - Added docs-route minimum width for `[data-slot="select-content"]`.
  - Added docs-route padding/min-height guard for `[data-slot="select-item"]`.
- `notes/shadcn-select-spacing-normalization-plan.md`
  - Recorded scope, findings, and before screenshot.

## Verification

- `./node_modules/.bin/eslint src/components/ui/select.tsx src/app/design-system/components/page.tsx`
  - Result: passed.
- `npm run build:next`
  - Result: passed.
- `curl -s -I http://127.0.0.1:3013/design-system/components`
  - Result: `200 OK`.

## Server

- Restarted production server on `http://127.0.0.1:3013`.
- Existing warning remains: `next start` warns that `output: standalone` should use `.next/standalone/server.js`.
