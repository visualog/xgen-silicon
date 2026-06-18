# Design System Centered Rail Plan

Date: 2026-06-10

## Goal

Center the design-system body content so it reads as a deliberate documentation rail instead of appearing attached to the browser's left edge.

## Scope

- Keep the design-system header width unchanged.
- Narrow and center the body content wrapper in the shared design-system shell.
- Avoid changing page content, component primitives, or production xGen surfaces.
- Keep every touched file under 300 lines.

## Before Screenshots

- `notes/screenshots/design-system-centered-rail-2026-06-10/before-overview-fullscreen.png`
- `notes/screenshots/design-system-centered-rail-2026-06-10/before-components-fullscreen.png`

## Verification Plan

- `wc -l src/app/design-system/_components/design-system-shell.tsx`
- `./node_modules/.bin/eslint src/app/design-system`
- `npm run build:next`
- HTTP checks for design-system routes
- After screenshots for overview and components
