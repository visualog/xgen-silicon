# shadcn showcase wrapper border removal report

Date: 2026-06-08

## Summary

- Removed the outer bordered frame around the first `/design-system/components` showcase grid.
- Removed the two empty decorative gradient overlay blocks inside that wrapper.
- Kept all internal cards, grid spans, and card content unchanged.

## Before / after evidence

- Before: `notes/screenshots/shadcn-showcase-wrapper-border-removal-2026-06-08/before-fullscreen.png`
- After: `notes/screenshots/shadcn-showcase-wrapper-border-removal-2026-06-08/after-fullscreen.png`
- Both screenshots are `5120x2880`.

## Files changed

- `src/app/design-system/components/page.tsx`
  - Changed the `FoundationShowcase` wrapper from a framed `rounded-3xl border bg-muted/30 p-*` surface to a simple centered width wrapper.
  - Removed two empty left/right gradient overlay `<div>` elements.
- `notes/shadcn-showcase-wrapper-border-removal-plan.md`
  - Captured the plan and before evidence path.
- `notes/screenshots/shadcn-showcase-wrapper-border-removal-2026-06-08/`
  - Added before/after full-screen captures.

## Verification

- `./node_modules/.bin/eslint src/app/design-system/components/page.tsx`
  - Passed.
- `npm run build:next`
  - Passed.
- `curl -s -I --max-time 10 http://localhost:3013/design-system/components`
  - Passed with `HTTP/1.1 200 OK`.

## Remaining risks

- The showcase still uses individual Card borders by design. If the page should become even flatter, the next pass should review individual nested demo surfaces such as `media-tile`, `summary-tile`, and `preview-frame`.
