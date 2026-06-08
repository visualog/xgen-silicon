# shadcn hero intro width alignment report

Date: 2026-06-08

## Summary

- Made the `/design-system/components` hero intro wrapper fill the section rail.
- Moved the readable width constraint to the inner text group.
- Preserved centered text alignment and existing hero content.

## Before / after evidence

- Before: `notes/screenshots/shadcn-hero-intro-width-alignment-2026-06-08/before-fullscreen.png`
- After: `notes/screenshots/shadcn-hero-intro-width-alignment-2026-06-08/after-fullscreen.png`
- Both screenshots are `5120x2880`.

## Files changed

- `src/app/design-system/components/page.tsx`
  - Changed the hero intro wrapper from `mx-auto max-w-3xl` to `w-full`.
  - Added `max-w-3xl` to the inner text group so the text remains readable while the container fills the section.
- `notes/shadcn-hero-intro-width-alignment-plan.md`
  - Captured the plan and before evidence path.
- `notes/screenshots/shadcn-hero-intro-width-alignment-2026-06-08/`
  - Added before/after full-screen captures.

## Verification

- `./node_modules/.bin/eslint src/app/design-system/components/page.tsx`
  - Passed.
- `npm run build:next`
  - Passed.
- `curl -s -I --max-time 10 http://localhost:3013/design-system/components`
  - Passed with `HTTP/1.1 200 OK`.

## Remaining risks

- This pass only fixes the hero intro container width. Any remaining perceived left bias should be checked against the browser viewport, page rail, and header alignment together.
