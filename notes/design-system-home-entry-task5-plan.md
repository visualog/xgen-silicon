# Design System Home Entry Task 5 Plan

Date: 2026-06-10

## Goal

Inspect the main `/` entry point to `/design-system` and make the link read as a separate xGen design-system documentation site.

## Scope

- Keep the editor/workspace behavior unchanged.
- Keep the change limited to the existing home topbar action if possible.
- Avoid broad `src/app/page.tsx` refactors because the file is already large.
- Preserve current icon/action styling.

## Out of Scope

- Production editor redesign.
- Design-system route content changes.
- Splitting the large home page file.

## Before Screenshots

- `notes/screenshots/design-system-home-entry-task5-2026-06-10/before-home-fullscreen.png`

## Verification Plan

- `./node_modules/.bin/eslint src/app/page.tsx`
- `npm run build:next`
- HTTP checks for `/` and `/design-system`
- After screenshots for `/` and `/design-system`
