# shadcn button spacing normalization plan

Date: 2026-06-08

## Scope

Fix button interior spacing on `/design-system/components` before applying the design to production.

## Before Screenshot

- `notes/screenshots/shadcn-button-spacing-normalization-2026-06-08/before-fullscreen.png`

## Findings

- shadcn `Button` itself has padding, but `size="sm"` uses `h-8 px-3 text-xs`.
- `/design-system/components` uses `size="sm"` for primary preview/action buttons, making them visually too compressed inside already dense cards.
- `ButtonGroup` currently only provides `inline-flex items-center`; it does not wrap or add spacing by default.
- The global legacy `button:not([data-slot])` rule does not target shadcn buttons because shadcn buttons include `data-slot="button"`.

## Tasks

1. Keep shadcn `Button` source unchanged.
2. Remove `size="sm"` from documentation preview/action buttons that should read as normal actions.
3. Add route-scoped `ButtonGroup` rhythm for documentation pages.
4. Verify lint, build, route smoke, and after screenshot.

## Out Of Scope

- Do not change production editor buttons.
- Do not change xGen compatibility button wrappers.
