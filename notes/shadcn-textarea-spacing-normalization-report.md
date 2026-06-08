# shadcn textarea spacing normalization report

Date: 2026-06-08

## Summary

Checked and normalized textarea spacing for `/design-system/components`. The shadcn Textarea source was structurally correct, so the fix keeps the registry component unchanged and adds documentation-route guards.

## Screenshots

- Before: `notes/screenshots/shadcn-textarea-spacing-normalization-2026-06-08/before-fullscreen.png`
- After: `notes/screenshots/shadcn-textarea-spacing-normalization-2026-06-08/after-fullscreen.png`

## Root Cause

- `src/components/ui/textarea.tsx` already has expected shadcn classes: `field-sizing-content`, `min-h-16`, `w-full`, `px-3`, `py-2`, `text-base`, and `md:text-sm`.
- Tailwind compiled CSS includes `field-sizing-content`, `min-h-16`, `px-3`, `py-2`, `text-base`, and `md:text-sm`.
- The global Tailwind reset targets `textarea`, but shadcn utility classes override it.
- The practical issue is visual rhythm: `field-sizing-content` plus local `min-h-24 resize-none` can make textarea controls feel disconnected from the input/select/button spacing guards in the documentation preview.

## Files Changed

- `src/app/globals.css`
  - Added docs-route guard for `[data-slot="textarea"]`:
    - `min-height: 6rem`
    - `padding-inline: 0.875rem`
    - `padding-block: 0.625rem`
    - `line-height: 1.55`
- `notes/shadcn-textarea-spacing-normalization-plan.md`
  - Recorded scope, findings, and before screenshot.

## Verification

- `./node_modules/.bin/eslint src/components/ui/textarea.tsx src/app/design-system/components/page.tsx`
  - Result: passed.
- `npm run build:next`
  - Result: passed.
- `curl -s -I http://127.0.0.1:3013/design-system/components`
  - Result: `200 OK`.

## Server

- Restarted production server on `http://127.0.0.1:3013`.
- Existing warning remains: `next start` warns that `output: standalone` should use `.next/standalone/server.js`.
