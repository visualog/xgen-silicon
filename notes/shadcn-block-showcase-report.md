# shadcn block showcase report

Date: 2026-06-05
Branch: `feature/apps-sdk-ui-foundation`
Task group: Rebuild `/design-system/components` to follow the shadcn/ui landing and block showcase style.

## Summary

Reworked the first viewport of `/design-system/components` from a component catalog page into a shadcn/ui-style landing and block showcase.

The previous version used shadcn primitives, but the visual structure still read like a narrow documentation index. This pass changes the page hierarchy so the hero and broad block mosaic are the primary first-screen experience, with the legacy xGen component catalog pushed below.

## Tasks completed

### Task 1: Reference audit and plan

- Used `https://ui.shadcn.com/` as the visual reference.
- Captured the current state before implementation.
- Wrote `notes/shadcn-block-showcase-plan.md`.

### Task 2: First viewport rebuild

- Updated the top nav toward the shadcn docs pattern: Home, Docs, Components, Blocks, Charts, Directory, Create, search, and New.
- Kept the centered hero, but made the block mosaic the main follow-up experience.
- Removed the visible section heading between hero and blocks so the block showcase starts immediately like the reference.

### Task 3: Responsive block mosaic

- Replaced the small equal preview cards with a varied xGen block mosaic.
- Added larger product-facing blocks for prompt building, render activity, output presets, style references, component blocks, generation queue, gallery action, and handoff state.
- Tuned breakpoints so half-width desktop views do not collapse into tiny 12-column cards too early.
- Pushed `Component catalog` below the first-screen block showcase.

### Task 4: Verification

```bash
npm run build:next
```

Result:

- Passed.
- Next.js compiled successfully.
- TypeScript passed.
- Static generation completed for 19 pages.

Runtime check:

```bash
curl -s -I --max-time 10 http://127.0.0.1:3013/design-system/components
```

Result:

- `HTTP/1.1 200 OK`

## Screenshots

- Before: `notes/screenshots/shadcn-block-showcase-2026-06-05/before-fullscreen.png`
- After: `notes/screenshots/shadcn-block-showcase-2026-06-05/after-final-fullscreen.png`

## Files changed

- `src/app/design-system/components/page.tsx`
- `notes/shadcn-block-showcase-plan.md`
- `notes/shadcn-block-showcase-report.md`
- `notes/screenshots/shadcn-block-showcase-2026-06-05/`

## Remaining risks

- The page now follows the shadcn block-showcase structure more closely, but the preview block content is still custom xGen UI rather than copied shadcn registry blocks.
- Screenshots are full-desktop captures and include other open windows.
- The branch name still contains `apps-sdk-ui-foundation`, but Apps SDK UI remains out of the active implementation.
