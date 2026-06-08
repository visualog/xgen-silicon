# shadcn textarea spacing normalization plan

Date: 2026-06-08

## Scope

Check and normalize textarea spacing on `/design-system/components`.

## Before Screenshot

- `notes/screenshots/shadcn-textarea-spacing-normalization-2026-06-08/before-fullscreen.png`

## Findings

- `src/components/ui/textarea.tsx` is structurally aligned with shadcn.
- The textarea includes `data-slot="textarea"` and expected spacing classes: `field-sizing-content`, `min-h-16`, `w-full`, `px-3`, `py-2`, `text-base`, and `md:text-sm`.
- Tailwind compiled CSS includes `field-sizing-content`, `min-h-16`, `px-3`, `py-2`, `text-base`, and `md:text-sm`.
- The global Tailwind reset targets `textarea`, but shadcn utility classes should override it.
- The practical issue is visual rhythm: `field-sizing-content` plus local `min-h-24 resize-none` can make textarea controls feel disconnected from the input/select/button spacing guards.

## Tasks

1. Keep the shadcn Textarea source unchanged.
2. Add docs-route guards for `[data-slot="textarea"]`.
3. Verify lint, build, route smoke, and after screenshot.

## Out Of Scope

- Do not change production editor textareas.
- Do not change xGen compatibility styles.
