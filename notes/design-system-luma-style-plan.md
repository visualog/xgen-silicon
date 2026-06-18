# Design System Luma Style Plan

Date: 2026-06-18

## Goal

Apply the Luma direction to the active `/design-system` surface:

- soft, rounded, spacious product UI
- rounded geometry
- soft surfaces
- breathable spacing
- calm visual rhythm

## Scope

- Update the shared design-system shell and page section composition.
- Keep local shadcn primitives as the source of truth.
- Avoid changing app runtime screens outside `/design-system/*`.

## Before Screenshot

- `notes/screenshots/design-system-luma-style-2026-06-18/before-fullscreen.png`

## Implementation Plan

1. Add a Luma-flavored docs surface layer in `src/app/globals.css` using shadcn tokens.
2. Soften the design-system header, cards, preview frames, and composed rows through `.shadcn-docs-surface` guards.
3. Adjust shared section spacing and card grids in `page-sections.tsx` so the docs route breathes more.
4. Verify `/design-system` and sibling routes still respond.

## Risks

- Too much card padding could make component docs inefficient on small screens.
- Overriding primitive internals too broadly would conflict with earlier shadcn cleanup work, so changes should remain route-scoped.
