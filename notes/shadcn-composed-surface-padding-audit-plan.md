# shadcn composed surface padding audit plan

Date: 2026-06-08

## Scope

- Audit `/design-system/components` for composed UI surfaces that are not covered by shadcn primitive guards.
- Normalize internal padding for custom composed surfaces before applying design rules to production.

## Before evidence

- `notes/screenshots/shadcn-composed-surface-padding-audit-2026-06-08/before-fullscreen.png`

## Findings

- shadcn primitives already have route-scoped guards: Card, Button, Badge, Input, Select, Textarea, and control rows.
- Remaining padding issues are mostly direct composition surfaces, not primitive components.
- Examples include media tiles, queue/status items, preview frames, checklist tiles, preset panels, component block tiles, notification option rows, and muted note rows.
- These elements use classes like `rounded-xl border p-3` or `rounded-md bg-muted p-3`, but they do not expose semantic `data-slot` names for auditing or consistent docs-route normalization.

## Tasks

- Add semantic `data-slot` markers to composed surfaces.
- Add `.shadcn-docs-surface` guards for composed surface padding and inner spacing.
- Convert notification checkbox rows into shadcn-like option rows with internal padding.
- Keep changes scoped to `/design-system/components` and `.shadcn-docs-surface`.
- Verify lint, production build, route response, and after screenshot.
