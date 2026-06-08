# shadcn Badge spacing normalization plan

Date: 2026-06-08

## Scope

- Verify whether the `Live` chip in the Prompt system card is a shadcn/ui `Badge`.
- Normalize Badge spacing only inside the design-system documentation surface before applying design rules to production.

## Before evidence

- `notes/screenshots/shadcn-badge-spacing-normalization-2026-06-08/before-fullscreen.png`

## Findings

- `Live` is rendered by `Badge variant="secondary"` in `src/app/design-system/components/page.tsx`.
- `src/components/ui/badge.tsx` uses the registry-style compact badge classes: `px-2 py-0.5 text-xs`.
- The compact default is valid for a status chip, but it looks underpadded next to the already normalized card, button, input, select, and textarea rhythm.
- The badge primitive exposes `data-slot="badge"` but does not expose `data-variant`, which makes route-scoped audits less explicit.

## Tasks

- Keep the shadcn badge primitive as the source component.
- Add `data-variant` metadata to `Badge` without changing its import contract.
- Add a `.shadcn-docs-surface` guard for Badge minimum height, inline padding, block padding, and line-height.
- Verify lint, production build, route response, and after screenshot.
