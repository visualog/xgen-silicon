# Design System IA Task 1 Plan

Date: 2026-06-10

## Goal

Reframe `/design-system` as a separate xGen design-system site built on shadcn/ui, not as a mixed component showcase. Keep route files lightweight and establish a directory structure that can support later component, pattern, and template work.

## Scope

- Add a shared design-system shell for header/navigation and page framing.
- Add shared content/data helpers under a private route folder so route files stay under 300 lines where practical.
- Normalize top-level IA:
  - `/design-system`: overview and entry points.
  - `/design-system/components`: component catalog direction, not a mixed shadcn reference clone.
  - `/design-system/templates`: screen template contracts.
- Fix active navigation so the design-system page does not look like Home is selected.

## Out of Scope

- Full production xGen editor redesign.
- Deep component primitive changes.
- Moving every current block into `/design-system/patterns`; that is Task 2.

## Before Screenshots

- `notes/screenshots/design-system-ia-task1-2026-06-10/before-design-system-fullscreen.png`
- `notes/screenshots/design-system-ia-task1-2026-06-10/before-components-fullscreen.png`
- `notes/screenshots/design-system-ia-task1-2026-06-10/before-templates-fullscreen.png`

## Verification Plan

- `./node_modules/.bin/eslint src/app/design-system`
- `npm run build:next`
- HTTP checks for `/design-system`, `/design-system/components`, `/design-system/templates`
- After screenshots for the same routes

## Remaining Task Split

1. Task 1: IA shell and page structure cleanup.
2. Task 2: Add `/design-system/patterns` and move xGen workflow examples there.
3. Task 3: Refine component catalog content and add do/don't usage notes.
4. Task 4: Visual QA and production app entry alignment.
