# shadcn checkbox primitive normalization plan

Date: 2026-06-08

## Scope

- Replace the local Checkbox primitive with the shadcn/Radix checkbox structure.
- Keep the `/design-system/components` notification option row layout unchanged.
- Preserve shadcn token classes and local `data-slot` conventions.

## Before evidence

- `notes/screenshots/shadcn-checkbox-primitive-normalization-2026-06-08/before-fullscreen.png`

## Findings

- `src/components/ui/checkbox.tsx` currently renders a native `<input type="checkbox">`.
- The component uses some shadcn token classes, but it does not use `@radix-ui/react-checkbox`, `CheckboxPrimitive.Root`, or an indicator icon.
- `/design-system/components` uses the Checkbox in notification option rows, so row spacing should remain controlled by `.shadcn-docs-surface [data-slot="option-row"]`.

## Tasks

- Convert `src/components/ui/checkbox.tsx` to the shadcn Radix primitive pattern.
- Add the checked indicator icon with lucide `Check`.
- Verify lint, production build, route response, and after screenshot.
