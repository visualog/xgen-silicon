# Design System Header Pill Padding Plan

Date: 2026-06-18

## Request

Fix the `/design-system` header menu pills because they read like pill-shaped
buttons but the internal padding and touch area feel missing.

## Before Screenshot

![Before full-screen capture](./screenshots/design-system-header-pill-padding-2026-06-18/before-fullscreen.png)

## Finding

The nav links are styled with repeated Tailwind utility branches. They have
some inline padding, but no shared slot that guarantees pill button geometry,
minimum height, line-height, or consistent active/inactive padding.

## Plan

1. Add a `data-slot="design-system-nav-link"` marker to each header nav link.
2. Move pill geometry into `globals.css` under the design-system surface.
3. Set `display`, `min-height`, horizontal and vertical padding, radius, and
   line-height explicitly.
4. Keep active/inactive visual state in component classes.
5. Verify with lint, HTTP, targeted search, and after screenshot.

## Files

- `src/app/design-system/_components/design-system-shell.tsx`
- `src/app/globals.css`
- `notes/design-system-header-pill-padding-report.md`
- `notes/screenshots/design-system-header-pill-padding-2026-06-18/`
