# shadcn section content centering report

## Summary

- Centered the actual content sections inside the wider `/design-system/components` page shell.
- Restored a wide page/header shell while constraining sections to a centered `max-w-5xl`.
- This addresses the issue where the page shell existed but the content groups read as left-attached inside the available site area.

## Root cause

- Previous fixes focused on the outer shell width.
- The user intent was that the content groups themselves should be visually centered within the site area.
- A wide wrapper with left-starting full-width sections still reads left-aligned when the content does not occupy the full available width.

## What changed

- `bodyShellClassName` uses `max-w-7xl`.
- `pageShellClassName` uses `max-w-7xl`.
- Added `centeredSectionClassName = "mx-auto grid w-full max-w-5xl"`.
- `components`, `blocks`, `component-progress`, and `catalog` sections now use the centered section contract.

## Files changed

- `src/app/design-system/components/page.tsx`
- `notes/shadcn-section-content-centering-plan.md`
- `notes/shadcn-section-content-centering-report.md`

## Screenshots

- Before: `notes/screenshots/shadcn-section-content-centering-2026-06-08/before-fullscreen.png`
- After: `notes/screenshots/shadcn-section-content-centering-2026-06-08/after-fullscreen.png`

## Verification

- `./node_modules/.bin/eslint src/app/design-system/components/page.tsx` passed.
- `curl -s -I --max-time 10 http://localhost:3013/design-system/components` returned `HTTP/1.1 200 OK`.
- `npm run build:next` passed.
- Before and after screenshots were both captured at `5120x2880`.
