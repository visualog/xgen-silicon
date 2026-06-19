# Design System Grid Overlay Colors Plan

Date: 2026-06-18
Route: `/design-system/*`

## Problem

The column grid and baseline grid both use the same `--ring` color family, so they are difficult to distinguish when overlaid on top of page content.

## Before

![Before full-screen capture](./screenshots/design-system-grid-overlay-colors-2026-06-18/before-fullscreen.png)

## Scope

- Keep the existing grid toggle behavior.
- Keep the overlay at the highest z-index and non-interactive.
- Change only the overlay colors and responsive grid settings so columns and baselines are visually distinct across viewport sizes.

## Plan

1. Add overlay-only color variables for column grid and baseline grid.
2. Use a cool blue for columns and a warm amber/red for baselines.
3. Make the column grid responsive: 4 columns on mobile, 8 on tablet, 12 on desktop.
4. Add dark-mode tuned values so both layers remain legible.
5. Verify lint/build route health and capture the after state.
