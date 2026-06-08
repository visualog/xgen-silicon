# shadcn input spacing normalization plan

Date: 2026-06-08

## Scope

Check and normalize text input spacing on `/design-system/components`.

## Before Screenshot

- `notes/screenshots/shadcn-input-spacing-normalization-2026-06-08/before-fullscreen.png`

## Findings

- `src/components/ui/input.tsx` is structurally aligned with shadcn.
- The input includes `data-slot="input"` and expected spacing classes: `h-9`, `w-full`, `px-3`, `py-1`, `text-base`, and `md:text-sm`.
- Tailwind compiled CSS includes `h-9`, `px-3`, `py-1`, `text-base`, and `md:text-sm`.
- The global Tailwind reset targets `button,input,select,optgroup,textarea`, but shadcn utility classes should override it.
- The practical issue is that `py-1` is intentionally compact, so in the larger documentation preview it can look under-padded compared with buttons/selects.

## Tasks

1. Keep the shadcn Input source unchanged.
2. Add docs-route guards for `[data-slot="input"]`.
3. Verify lint, build, route smoke, and after screenshot.

## Out Of Scope

- Do not change production editor-specific inputs.
- Do not change xGen compatibility input styles.
