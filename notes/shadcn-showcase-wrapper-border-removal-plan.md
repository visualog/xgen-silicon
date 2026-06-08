# shadcn showcase wrapper border removal plan

Date: 2026-06-08

## Scope

- Remove the outer framed container treatment around the first `/design-system/components` card showcase.
- Remove empty decorative overlay blocks inside the showcase wrapper.
- Keep the internal shadcn Card grid and card contents unchanged.

## Before evidence

- `notes/screenshots/shadcn-showcase-wrapper-border-removal-2026-06-08/before-fullscreen.png`

## Findings

- `FoundationShowcase` wraps multiple cards in a `rounded-3xl border bg-muted/30` container.
- The wrapper makes the section read like cards nested inside another card-like surface.
- Two empty absolutely positioned `<div>` elements add left/right gradient overlays, but they are only useful when the wrapper is an overflow-hidden framed surface.

## Tasks

- Remove wrapper `border`, rounded frame, muted background, overflow clipping, and inner padding.
- Remove the two decorative empty gradient overlay blocks.
- Verify lint, build, route response, and after screenshot.
