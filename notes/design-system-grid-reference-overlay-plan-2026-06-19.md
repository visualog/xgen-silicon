# Design System Grid Reference Overlay Plan

Date: 2026-06-19
Route: `/design-system/*`

## Problem

The current inspection overlay distinguishes column and baseline colors, but it still lacks the reference details shown in the provided example: visible column fills, column borders, top column numbers, and an explicit baseline/column legend.

## Reference

User-provided screenshot shows:

- pink column fills
- stronger pink column borders
- column numbers at the top of each column
- separate baseline color
- small legend explaining column count and baseline rhythm

## Before

![Before full-screen capture](./screenshots/design-system-grid-reference-overlay-2026-06-19/before-fullscreen.png)

## Scope

- Keep the existing header toggle and persisted `showGrid` preference.
- Replace pseudo-only overlay with an overlay DOM layer that can render column numbers.
- Keep overlay responsive: 4 columns on mobile, 8 on tablet, 12 on desktop.
- Keep overlay above all UI with `z-index: 2147483647` and `pointer-events: none`.

## Plan

1. Add a `DesignGridOverlay` element to the design-system shell.
2. Render 12 possible column slots and hide extra columns by breakpoint.
3. Style column fill, column border, column numbers, baseline lines, and legend with distinct colors.
4. Verify lint, route response, build, and after screenshot.

