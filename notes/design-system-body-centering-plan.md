# Design System Body Centering Plan

Date: 2026-06-10

## Issue

The design-system body wrapper is still visually attached to the left side in the browser even after narrowing the body rail. The shared screenshot shows the selected body wrapper as `max-w-5xl`, but the rail begins at the left edge instead of being centered in the viewport.

The screenshot also shows an inline `style="display: flex;"` on the `main` element in DevTools, while the source shell does not define that inline style. If `main` is flex-row, the header and body can be laid out as sibling flex items and the body rail can appear left-pinned.

## Before Evidence

- `notes/screenshots/design-system-body-centering-2026-06-10/before-patterns-fullscreen.png`

## Plan

1. Make the design-system `main` layout explicit as a vertical stack.
2. Give the body wrapper a clear `data-slot` for DevTools inspection.
3. Use an explicit body rail width so the intended centered container is obvious.
4. Rebuild, restart/verify the local route, and capture an after screenshot.

## Expected Result

The header remains full-width with a centered inner nav rail, and the body content wrapper is visibly centered under it instead of being pinned to the viewport's left edge.
