# shadcn center rail report

Date: 2026-06-05
Branch: `feature/apps-sdk-ui-foundation`
Task: Fix `/design-system/components` so the whole content rail is centered instead of visually hugging the left side.

## Summary

The previous layout still read as left-heavy because the page relied on section/container sizing instead of forcing the full document content onto one centered rail. This pass centers the route at the page-shell level and uses a shadcn-style `max-w-7xl` rail shared by the header and all body sections.

## Files changed

- `src/app/design-system/components/page.tsx`
- `notes/shadcn-center-rail-plan.md`
- `notes/shadcn-center-rail-report.md`
- `notes/screenshots/shadcn-center-rail-2026-06-05/after-fullscreen.png`

## What changed

- Added `grid justify-items-center` to the page `<main>` so direct children are centered by the page shell.
- Made the header full-width while keeping its inner nav on the same centered rail as the body.
- Replaced the previous `max-w-[1440px]` body rail with `max-w-7xl`, making the centered column visually obvious in wide browser windows.
- Ensured block, chart, and catalog grids use `w-full` inside the centered rail.
- Kept the existing shadcn primitives and xGen demo content intact.

## Verification

- `npm run build:next` passed.
- `curl -sS -I --max-time 10 http://127.0.0.1:3013/design-system/components` returned `200 OK`.
- `./node_modules/.bin/eslint src/app/design-system/components/page.tsx` passed.
- `npm run lint` still fails on pre-existing unrelated issues in `codex/`, `scratch/`, and `src/components/StyleAddModal.tsx`.

## Screenshots

- Before: user-provided full-screen screenshot in the current conversation.
- Prior local before reference: `notes/screenshots/shadcn-responsive-centering-2026-06-05/before-fullscreen.png`
- After: `notes/screenshots/shadcn-center-rail-2026-06-05/after-fullscreen.png`

## Remaining risk

The after screenshot was captured with other desktop windows visible because the requirement is full-screen capture. The browser region itself shows the content rail centered with balanced left/right whitespace.
