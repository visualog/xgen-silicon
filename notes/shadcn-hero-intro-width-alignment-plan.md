# shadcn hero intro width alignment plan

Date: 2026-06-08

## Scope

- Make the `/design-system/components` hero intro wrapper fill the section rail.
- Keep the headline and supporting copy visually centered with readable line length.
- Keep the first showcase grid and card styling unchanged.

## Before evidence

- `notes/screenshots/shadcn-hero-intro-width-alignment-2026-06-08/before-fullscreen.png`

## Findings

- The hero intro wrapper uses `mx-auto max-w-3xl`.
- DevTools selection shows the wrapper itself is only `768px` wide, so it does not fill the section rail.
- The desired behavior is for the wrapper/container to align with the full section width while the text remains centered.

## Tasks

- Change the hero intro wrapper to `w-full`.
- Move readable width constraints to the inner text group.
- Verify lint, build, route response, and after screenshot.
