# shadcn section width alignment plan

Date: 2026-06-08

## Scope

- Align section intro width with the section content rail on `/design-system/components`.
- Let the first showcase grid use the same available section width as the following component sections.
- Keep card contents and component styling unchanged.

## Before evidence

- `notes/screenshots/shadcn-section-width-alignment-2026-06-08/before-fullscreen.png`

## Findings

- `SectionIntro` uses `max-w-3xl`, so section titles do not occupy the same width as the section content below them.
- `FoundationShowcase` uses `max-w-6xl`, while the surrounding body shell is `max-w-7xl`.
- This makes the first showcase card grid visually narrower than the following sections even though they live in the same page rail.

## Tasks

- Change `SectionIntro` to fill the section width while keeping the text centered.
- Change `FoundationShowcase` to use the parent section width.
- Verify lint, build, route response, and after screenshot.
