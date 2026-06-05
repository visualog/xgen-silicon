# shadcn Task 4 Plan: Registry Component Alignment

Date: 2026-06-05
Branch: `feature/apps-sdk-ui-foundation`

## Scope

Align the visible `/design-system/components` page with official shadcn registry/CLI component usage.

## Before Capture

- `notes/screenshots/shadcn-task4-registry-components-2026-06-05/before-fullscreen.png`

## Context

Task 1 restored `components.json`, and `npx --yes shadcn@latest info` can now read the project. Task 2 normalized typography. Task 3 recomposed the page into Hero, Blocks, Charts, and Directory.

The next visible gap is the Charts section. It currently states that the official chart component is planned, but it does not use the shadcn chart component yet.

## Plan

1. Run `npx --yes shadcn@latest info` to confirm the current registry state.
2. Add the official `chart` component through the shadcn CLI if available.
3. Review generated files and package changes.
4. Replace the lightweight Charts section with the installed shadcn chart component pattern.
5. Verify build and route response size.
6. Save after screenshot, report, and handoff.

## Guardrails

- Do not install third-party directory components in this task.
- Do not hand-create new visual tokens.
- Keep spacing and typography on existing shadcn/Tailwind scale.
- Record bundle/route size impact because chart libraries can add client work.
