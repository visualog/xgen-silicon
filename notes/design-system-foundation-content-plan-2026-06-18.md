# Design System Foundation Content Plan

Date: 2026-06-18
Route: `/design-system/foundation`

## Problem

The current foundation page explains that xGen should start from shadcn tokens, but it does not show the actual foundation system clearly enough. It has baseline cards and boundary notes, but no practical color, typography, spacing, radius, or state reference.

## Before

![Before full-screen capture](./screenshots/design-system-foundation-content-2026-06-18/before-fullscreen.png)

## Scope

- Keep the existing `/design-system` shell and page rhythm.
- Add visible foundation references to `/design-system/foundation`.
- Keep implementation grounded in shadcn primitives and local design-system data.
- Avoid changing production xGen screens.

## Plan

1. Expand foundation data with color tokens, type scale, spacing, radius, and state guidance.
2. Add compact preview sections that make those foundation choices inspectable at a glance.
3. Keep copy direct and operational: what token exists, where it applies, and what rule it enforces.
4. Verify lint and the live route, then capture an after screenshot.

