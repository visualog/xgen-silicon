# shadcn layout spacing fix plan

Date: 2026-06-05
Branch: `feature/apps-sdk-ui-foundation`
Task: Fix component internal padding and page centering on `/design-system/components`.

## Problem

The user pointed out that component internals are stuck to card edges and the overall layout reads as left-aligned.

Confirmed causes:

- The local `Card` primitive follows the official py/child-px structure, but the page showcase needs explicit card padding because several examples are nested blocks and visual spacing is too weak.
- The page container was widened to `1400px`, which makes it almost full-width in the current side-by-side browser window. It technically centers, but visually reads as left-aligned.

## Before screenshot

- `notes/screenshots/shadcn-foundation-match-2026-06-05/after-fullscreen.png`

## Plan

1. Add explicit `p-6` to showcase and catalog Cards.
2. Set CardHeader/CardContent/CardFooter to `px-0` inside those padded Cards.
3. Add padding to nested block rows and form-like rows.
4. Reduce page and showcase max width so the layout visibly centers in the current viewport.
5. Rebuild and capture an after screenshot.
