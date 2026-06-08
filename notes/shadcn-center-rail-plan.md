# shadcn center rail plan

Date: 2026-06-05
Branch: `feature/apps-sdk-ui-foundation`
Task: Fix `/design-system/components` so the whole content rail is centered instead of visually hugging the left side.

## User issue

The current screen still reads as left-heavy: the block content starts near the browser's left edge and leaves a large unused area on the right. The fix needs to move the entire document body onto a centered page rail, not just add another max-width value to individual sections.

## Before evidence

- User-provided full-screen screenshot in the current conversation.
- Existing local before screenshot path from the previous centering pass: `notes/screenshots/shadcn-responsive-centering-2026-06-05/before-fullscreen.png`.

## Plan

1. Keep the current shadcn primitives and page content.
2. Replace the loose body shell with a single centered rail shared by the header and all body sections.
3. Use a narrower shadcn-style max width so the rail visibly centers in wide browser windows.
4. Preserve responsive grids, but make them fill the centered rail instead of forming a left-starting block.
5. Verify with `npm run build:next`, route checks where possible, and an after screenshot/report.

## Risk

The previous centering attempt already modified this file. This pass should refine that work without reverting unrelated changes or changing the component content.
