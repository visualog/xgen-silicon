# Design-system padding collision plan

Date: 2026-06-17

## Goal

Fix `/design-system` pages where card, button, badge, input, textarea, select, button-group, grouped-control, nested card-like content, and code-chip item padding/gap is not reliably applied because global xGen CSS rules collide with shadcn/Tailwind primitive styles or because slot-level spacing is not guarded in the docs surface. Also keep usage-card microcopy consistent with the section title and give Do/Don't guidance distinct semantic tones.

## Before screenshot

- `notes/screenshots/design-system-padding-collision-2026-06-17/before-components-fullscreen.png`
- `notes/screenshots/design-system-padding-collision-2026-06-17/before-nested-surfaces-fullscreen.png`
- `notes/screenshots/design-system-padding-collision-2026-06-17/before-boundary-code-chips-fullscreen.png`
- `notes/screenshots/design-system-padding-collision-2026-06-17/before-do-dont-label-fullscreen.png`
- `notes/screenshots/design-system-padding-collision-2026-06-17/before-do-dont-tone-fullscreen.png`
- `notes/screenshots/design-system-padding-collision-2026-06-17/before-do-green-background-fullscreen.png`

## Current context

- `/design-system` is intended to be a separate shadcn-native docs site.
- shadcn source tokens live in `globals.css` and local primitives live in `src/components/ui/*`.
- Legacy xGen globals still include broad selectors such as `button:not([data-slot])` and product-specific card/component classes.

## Plan

1. Keep shadcn primitive source files unchanged unless the issue is local to a primitive.
2. Scope or neutralize broad legacy app rules inside `.shadcn-docs-surface`.
3. Add a small docs-surface guard for shadcn primitive slots so card, button, button-group, badge, input, textarea, select, toggle, and tabs spacing wins inside design-system pages.
4. Mark composed nested surfaces such as preview frames, status tiles, option rows, and summary tiles with docs-only slots, then guard their internal padding/gap inside `.shadcn-docs-surface`.
5. Mark BoundaryGrid code-chip rows with a docs-only slot and guard their inline padding, line-height, and minimum height.
6. Align the English usage-card label with the “Do and don't rules” section by using `Don't` instead of `Avoid`.
7. Add `do` and `dont` tones to summary tiles, using restrained green/red styling inside `.shadcn-docs-surface`.
8. Increase the Do tile background tint so it clearly reads as green in the docs dark theme.
9. Rebuild and verify `/design-system/components` and related pages.

## Risks

- Overly broad resets could affect product pages, so changes should stay inside `.shadcn-docs-surface`.
- Tailwind utility classes should remain the primary source; guards should only prevent legacy global collisions.
