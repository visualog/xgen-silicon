# Design System Grid Toggle Plan

Date: 2026-06-18
Route: `/design-system/*`

## Problem

The design-system header has language and theme controls, but there is no quick way to inspect layout rhythm while reviewing foundation, component, pattern, or template pages.

## Before

![Before full-screen capture](./screenshots/design-system-grid-toggle-2026-06-18/before-fullscreen.png)

## Scope

- Add a grid visibility toggle before the language button.
- Keep the button style identical to the existing compact preference buttons.
- Persist the grid preference with the existing design-system preference storage.
- Add a non-interactive docs-surface grid overlay.

## Plan

1. Extend design-system preferences with `showGrid`.
2. Add a grid icon preference button before the language toggle.
3. Add CSS for the visible grid overlay when enabled.
4. Verify lint, route response, build, and after screenshots.

