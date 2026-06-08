# shadcn responsive centering fix plan

Date: 2026-06-05
Branch: `feature/apps-sdk-ui-foundation`
Task: Center the `/design-system/components` body content so it matches the shadcn-style reference on the right side of the comparison image.

## User issue

The current `/design-system/components` body content is anchored too far to the left. The user expects the page to behave like the shadcn reference: centered hero, centered block showcase, and a body layout that reads from the middle instead of hugging the left edge.

## Before screenshot

- `notes/screenshots/shadcn-responsive-centering-2026-06-05/before-fullscreen.png`

## Plan

1. Inspect the current page structure and isolate which wrapper is forcing the left-heavy layout.
2. Adjust the body shell so the hero and block showcase sit on a centered content axis with balanced horizontal padding.
3. Keep the existing shadcn primitives and xGen-specific demo content intact.
4. Rebuild or verify the route, capture an after screenshot, and record the result in a completion note.

## Risk

The page already uses a mix of centered and full-width sections. The fix should stay narrow: correct the body shell and spacing first, rather than changing the content blocks themselves.
