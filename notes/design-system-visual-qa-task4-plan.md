# Design System Visual QA Task 4 Plan

Date: 2026-06-10

## Goal

Run a focused visual QA pass across the design-system site and fix concrete navigation, spacing, hierarchy, or responsive issues only.

## Scope

- Check `/design-system`, `/foundation`, `/components`, `/patterns`, and `/templates` as one site.
- Keep every touched file under 300 lines.
- Improve mobile navigation availability.
- Tighten shared hero/action alignment if needed.
- Confirm the site still reads as a separate xGen design-system documentation area.

## Out of Scope

- New routes.
- Production editor changes.
- shadcn primitive source changes.
- Broad redesign of page content.

## Before Screenshots

- `notes/screenshots/design-system-visual-qa-task4-2026-06-10/before-overview-fullscreen.png`
- `notes/screenshots/design-system-visual-qa-task4-2026-06-10/before-components-fullscreen.png`
- `notes/screenshots/design-system-visual-qa-task4-2026-06-10/before-patterns-fullscreen.png`
- `notes/screenshots/design-system-visual-qa-task4-2026-06-10/before-mobile-components.png`

## Verification Plan

- `wc -l` on design-system files.
- `./node_modules/.bin/eslint src/app/design-system`
- `npm run build:next`
- HTTP checks for all design-system routes.
- After screenshots for overview, components, patterns, and mobile components.
