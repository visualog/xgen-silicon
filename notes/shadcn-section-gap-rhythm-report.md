# shadcn section gap rhythm report

Date: 2026-06-08

## Summary

- Added an explicit page-level section stack gap for `/design-system/components`.
- Increased the gap between section headers and their content grids.
- Removed broad per-section vertical padding from non-hero sections so spacing is controlled by one parent rhythm.

## Before / after evidence

- Before: `notes/screenshots/shadcn-section-gap-rhythm-2026-06-08/before-fullscreen.png`
- After: `notes/screenshots/shadcn-section-gap-rhythm-2026-06-08/after-fullscreen.png`
- Both screenshots are `5120x2880`.

## Files changed

- `src/app/design-system/components/page.tsx`
  - Added `pageSectionStackClassName` with `grid gap-32 ... lg:gap-44`.
  - Changed body rail to use that stack class.
  - Removed `py-*` rhythm control from individual non-hero sections.
  - Increased `SectionIntro` bottom margin from `mb-8` to `mb-14 lg:mb-16`.
- `notes/shadcn-section-gap-rhythm-plan.md`
  - Captured the plan and before evidence path.
- `notes/screenshots/shadcn-section-gap-rhythm-2026-06-08/`
  - Added before/after full-screen captures.

## Verification

- `./node_modules/.bin/eslint src/app/design-system/components/page.tsx`
  - Passed.
- `npm run build:next`
  - Passed.
- `curl -s -I --max-time 10 http://localhost:3013/design-system/components`
  - Passed with `HTTP/1.1 200 OK`.

## Remaining risks

- The first hero-to-showcase gap is still controlled inside `FoundationShowcase` with `mt-20 sm:mt-24 lg:mt-28`, because that is a within-section relationship rather than a section-to-section gap.
