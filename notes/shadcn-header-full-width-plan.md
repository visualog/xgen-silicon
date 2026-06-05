# shadcn Header Full Width Plan

Date: 2026-06-05

## Scope

Make the `/design-system/components` header content align to the browser width instead of the page container width.

## Before Capture

- `notes/screenshots/shadcn-header-full-width-2026-06-05/before-fullscreen.png`

## Change

- Replace the header inner wrapper's `container mx-auto` constraint with a full-width wrapper.
- Keep shadcn/Tailwind spacing scale only.
- Do not change body layout, sections, or components.

## Verification

- `npm run build:next`
- `curl -s -I --max-time 10 http://127.0.0.1:3013/design-system/components`
- after screenshot
