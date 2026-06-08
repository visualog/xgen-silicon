# shadcn control row spacing normalization plan

Date: 2026-06-08

## Scope

- Inspect the `Consistency pass` row inside the Style reference card.
- Normalize similar label/control rows that combine text, badges, or switches inside bordered rows.

## Before evidence

- `notes/screenshots/shadcn-control-row-spacing-normalization-2026-06-08/before-fullscreen.png`

## Findings

- `Consistency pass` is not a standalone shadcn primitive. It is a composed row: label, helper text, and shadcn `Switch`.
- The row currently uses direct utility classes: `flex items-center justify-between rounded-lg border p-3`.
- A similar composed row exists in the workspace navigation list.
- Tailwind spacing utilities such as `.p-3` are present in the compiled CSS, so the root issue is not missing Tailwind spacing generation.
- The issue is that composed control rows were not included in the route-scoped shadcn foundation guards already added for Card, Button, Badge, Input, Select, and Textarea.

## Tasks

- Mark composed rows with `data-slot="control-row"` for auditing and route-scoped styling.
- Add docs-route-only spacing guard for control rows: minimum height, padding, gap, and child min-width behavior.
- Preserve the shadcn `Switch` primitive source and avoid production-surface changes.
- Verify lint, production build, route response, and after screenshot.
