# shadcn hero section rhythm report

Date: 2026-06-08

## Summary

- Increased vertical rhythm between the hero, first showcase, and following sections.
- Adjusted the hero h1 closer to shadcn typography scale.
- Allowed the hero h1 to stay on one line on large screens while preserving responsive wrapping below that breakpoint.

## Before / after evidence

- Before: `notes/screenshots/shadcn-hero-section-rhythm-2026-06-08/before-fullscreen.png`
- After: `notes/screenshots/shadcn-hero-section-rhythm-2026-06-08/after-fullscreen.png`
- Both screenshots are `5120x2880`.

## Files changed

- `src/app/design-system/components/page.tsx`
  - Changed the hero section padding to separate the title area from the first showcase and next section.
  - Changed the h1 from `lg:text-6xl font-semibold` to a shadcn-like `text-4xl ... sm:text-5xl font-extrabold` scale.
  - Added `lg:text-nowrap` so the title can render as one line on large screens.
  - Increased `FoundationShowcase` top margin.
  - Added vertical padding to following sections for clearer section separation.
- `notes/shadcn-hero-section-rhythm-plan.md`
  - Captured the plan and before evidence path.
- `notes/screenshots/shadcn-hero-section-rhythm-2026-06-08/`
  - Added before/after full-screen captures.

## Verification

- `./node_modules/.bin/eslint src/app/design-system/components/page.tsx`
  - Passed.
- `npm run build:next`
  - Passed.
- `curl -s -I --max-time 10 http://localhost:3013/design-system/components`
  - Passed with `HTTP/1.1 200 OK`.

## Remaining risks

- The h1 is set to remain one line only at the `lg` breakpoint and above. Smaller screens can still wrap naturally.
