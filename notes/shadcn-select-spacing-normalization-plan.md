# shadcn select spacing normalization plan

Date: 2026-06-08

## Scope

Check and normalize dropdown/select spacing on `/design-system/components`.

## Before Screenshot

- `notes/screenshots/shadcn-select-spacing-normalization-2026-06-08/before-fullscreen.png`

## Findings

- `src/components/ui/select.tsx` is the shadcn registry Select implementation.
- `SelectTrigger` already renders `data-slot="select-trigger"` and `data-size`.
- The trigger includes expected shadcn spacing classes: `px-3 py-2`, `data-[size=default]:h-9`, and `data-[size=sm]:h-8`.
- Tailwind compiled CSS includes `--spacing`, `px-3`, `py-2`, `h-9`, and related utilities.
- The risk is shadcn's `w-fit` trigger default: if the caller omits `w-full`, the dropdown collapses to content width. Select items also use compact registry padding (`pl-2 pr-8 py-1.5`).

## Tasks

1. Keep the shadcn Select source unchanged unless required.
2. Add docs-route guards for select trigger width, size, and padding.
3. Add docs-route guards for select content and item padding.
4. Verify lint, build, route smoke, and after screenshot.

## Out Of Scope

- Do not modify production editor select wrappers.
- Do not remove the global compatibility layer yet.
