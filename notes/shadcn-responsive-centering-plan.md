# shadcn responsive centering plan

Date: 2026-06-05
Branch: `feature/apps-sdk-ui-foundation`
Task: Make `/design-system/components` center and respond like shadcn/ui blocks.

## User issue

The user compared the current xGen page with a shadcn/ui block page and pointed out that the xGen page should be centered and responsive in the same way. In the current layout, the page can collapse into a narrow left-column composition instead of keeping the shadcn-style centered hero and broad responsive block grid.

## Before screenshot

- `notes/screenshots/shadcn-responsive-centering-2026-06-05/before-fullscreen.png`

## Plan

1. Keep the shadcn/ui foundation and local primitives.
2. Change `/design-system/components` from a narrow fixed document container to a full-width page shell with a centered inner nav and hero.
3. Make the block showcase use a wide responsive horizontal grid with overflow clipping, similar to shadcn block examples.
4. Keep the lower xGen component catalog readable, but stop it from driving the first viewport layout.
5. Verify with `npm run build:next`, capture an after screenshot, and write a completion report.

## Risk

The showcase cards are local demo blocks, not real shadcn registry blocks. The fix should focus on layout behavior, centering, and responsive grid fidelity rather than replacing all preview content.
