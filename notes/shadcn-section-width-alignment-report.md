# shadcn section width alignment report

Date: 2026-06-08

## Summary

- Aligned section intro wrappers to the full section rail.
- Expanded the first showcase grid to use the same available width as the following component sections.
- Kept card contents and component styling unchanged.

## Before / after evidence

- Before: `notes/screenshots/shadcn-section-width-alignment-2026-06-08/before-fullscreen.png`
- After: `notes/screenshots/shadcn-section-width-alignment-2026-06-08/after-fullscreen.png`
- Both screenshots are `5120x2880`.

## Files changed

- `src/app/design-system/components/page.tsx`
  - Changed `SectionIntro` from a `max-w-3xl` wrapper to a full-width section wrapper.
  - Changed `FoundationShowcase` from `max-w-6xl` to the parent section width.
- `notes/shadcn-section-width-alignment-plan.md`
  - Captured the plan and before evidence path.
- `notes/screenshots/shadcn-section-width-alignment-2026-06-08/`
  - Added before/after full-screen captures.

## Verification

- `./node_modules/.bin/eslint src/app/design-system/components/page.tsx`
  - Passed.
- `npm run build:next`
  - Passed.
- `curl -s -I --max-time 10 http://localhost:3013/design-system/components`
  - Passed with `HTTP/1.1 200 OK`.

## Remaining risks

- The hero intro remains intentionally narrower (`max-w-3xl`) for readable line length. Only section intros and showcase content rails were widened.
