# shadcn input spacing normalization report

Date: 2026-06-08

## Summary

Checked and normalized text input spacing for `/design-system/components`. The shadcn Input source was structurally correct, so the fix keeps the registry component unchanged and adds documentation-route guards.

## Screenshots

- Before: `notes/screenshots/shadcn-input-spacing-normalization-2026-06-08/before-fullscreen.png`
- After: `notes/screenshots/shadcn-input-spacing-normalization-2026-06-08/after-fullscreen.png`

## Root Cause

- `src/components/ui/input.tsx` already has expected shadcn classes: `h-9`, `w-full`, `px-3`, `py-1`, `text-base`, and `md:text-sm`.
- Tailwind compiled CSS includes `h-9`, `px-3`, `py-1`, `text-base`, and `md:text-sm`.
- The global Tailwind reset targets `button,input,select,optgroup,textarea`, but shadcn utility classes override it.
- The practical issue is that shadcn Input uses compact vertical padding (`py-1`). In the larger documentation preview, this can appear under-padded compared with buttons and select triggers.

## Files Changed

- `src/app/globals.css`
  - Added docs-route guard for `[data-slot="input"]`:
    - `min-height: 2.25rem`
    - `padding-inline: 0.875rem`
    - `padding-block: 0.375rem`
- `notes/shadcn-input-spacing-normalization-plan.md`
  - Recorded scope, findings, and before screenshot.

## Verification

- `./node_modules/.bin/eslint src/components/ui/input.tsx src/app/design-system/components/page.tsx`
  - Result: passed.
- `npm run build:next`
  - Result: passed.
- `curl -s -I http://127.0.0.1:3013/design-system/components`
  - Result: `200 OK`.

## Server

- Restarted production server on `http://127.0.0.1:3013`.
- Existing warning remains: `next start` warns that `output: standalone` should use `.next/standalone/server.js`.
