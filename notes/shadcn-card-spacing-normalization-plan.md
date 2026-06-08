# shadcn card spacing normalization plan

Date: 2026-06-08

## Scope

Normalize card spacing on `/design-system/components` before applying the design to production surfaces.

## Before Screenshot

- `notes/screenshots/shadcn-card-spacing-normalization-2026-06-08/before-fullscreen.png`

## Context

The user identified that card interiors visually look like they have no padding and content sits too close to card edges. Investigation showed the registry `Card` itself only owns vertical padding, while `CardHeader`, `CardContent`, and `CardFooter` own horizontal padding. The page generally uses those parts, but the composition is too dense and relies on narrow 4-column cards with full-width children.

## Tasks

1. Add a documentation-route shell class so shadcn docs pages can opt out of legacy body foreground/background influence.
2. Add card rhythm helper classes for design-system documentation cards:
   - page rail
   - roomy card shell
   - consistent `CardHeader`, `CardContent`, and `CardFooter` padding
   - relaxed internal gaps
3. Apply the helpers to `/design-system/components` card blocks and preview cards.
4. Reduce overly narrow 4-column card pressure by using more readable spans.
5. Verify with lint, build, route smoke test, and after screenshot.

## Out Of Scope

- Do not migrate production editor nodes.
- Do not alter shadcn registry component source unless necessary.
- Do not remove the global xGen compatibility layer yet.
