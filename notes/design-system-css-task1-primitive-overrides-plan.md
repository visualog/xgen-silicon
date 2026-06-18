# Design System CSS Task 1 Plan - Primitive Overrides

Date: 2026-06-10

## Goal

Remove design-system docs CSS that overrides shadcn/ui primitive internals. The design-system pages should show the actual local primitives from `src/components/ui/*`, not route-specific restyling layered on top.

## Before Evidence

- `notes/screenshots/design-system-css-task1-primitive-overrides-2026-06-10/before-fullscreen.png`

## Scope

- Keep shell/layout CSS:
  - `.shadcn-docs-surface`
  - `.shadcn-docs-header`
  - `.shadcn-docs-body`
- Remove `.shadcn-docs-surface [data-slot="..."]` primitive overrides for card, button, badge, input, textarea, select, and unused docs-only slots.
- Keep the mobile `.shadcn-docs-body` adjustment.

## Verification

- `npm run build:next`
- Verify `/design-system/components` and `/design-system/patterns` return 200.
- Capture after screenshot.
