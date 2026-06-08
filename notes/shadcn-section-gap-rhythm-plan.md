# shadcn section gap rhythm plan

Date: 2026-06-08

## Scope

- Make section-to-section spacing explicit on `/design-system/components`.
- Make section header-to-content spacing visibly larger and consistent.
- Avoid relying on scattered per-section vertical padding as the main rhythm control.

## Before evidence

- `notes/screenshots/shadcn-section-gap-rhythm-2026-06-08/before-fullscreen.png`

## Findings

- The page rail currently contains adjacent sections without a parent stack gap.
- Each section uses its own `py-*`, which makes section spacing harder to reason about visually.
- `SectionIntro` uses only `mb-8`, so section headers and grids feel too close.

## Tasks

- Turn the body rail into a vertical grid stack with explicit section gaps.
- Remove broad `py-*` from individual non-hero sections.
- Increase `SectionIntro` bottom margin.
- Keep component card contents unchanged.
- Verify lint, build, route response, and after screenshot.
