# shadcn responsive centering fix report

Date: 2026-06-05
Branch: `feature/apps-sdk-ui-foundation`
Task: Center the `/design-system/components` body content so it matches the shadcn-style reference more closely.

## Summary

Adjusted the `/design-system/components` body shell to use an explicit centered max-width around the full body content, then widened the large-screen grids so the blocks, chart section, and catalog distribute more like the reference on the right side of the comparison image.

## Files changed

- `src/app/design-system/components/page.tsx`

## What changed

- Added a shared centered body shell with a larger max width.
- Replaced the `container mx-auto` wrappers for the body sections with the explicit shell.
- Expanded the block and catalog grids to `xl:grid-cols-4`.
- Expanded the chart section to `xl:grid-cols-4` and let the main chart card span three columns on extra-large screens.
- Moved the `ComponentBlocksCard` to a wider `xl` span so the row composition feels less left-heavy.
- Kept the hero and each content section at full width inside the centered shell so the body reads from a middle column instead of the far left edge.

## Verification

- `npm run build:next` — passed.
- `curl -sS -I --max-time 10 http://127.0.0.1:3013/design-system/components` — returned `200 OK`.
- Browser capture of the route at `http://127.0.0.1:3013/design-system/components`.

## Screenshots

- Before: `notes/screenshots/shadcn-responsive-centering-2026-06-05/before-fullscreen.png`
- After: `notes/screenshots/shadcn-responsive-centering-2026-06-05/after-fullscreen.png`

## Remaining risk

The page is still a dense demo surface, so exact centering perception depends on viewport width and whether browser devtools are open. If the user wants it closer to the shadcn reference still, the next pass should tune the hero width and the block grid composition rather than changing the shared primitives.
