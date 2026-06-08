# shadcn section content centering plan

## Context

- Route: `/design-system/components`
- Target file: `src/app/design-system/components/page.tsx`
- Before screenshot: `notes/screenshots/shadcn-section-content-centering-2026-06-08/before-fullscreen.png`

## Problem

- The user intent is not to shrink the whole page shell.
- The content groups inside the page need to be centered in the available site area.
- Previous changes centered the shell, but the actual sections still read as left-attached in the page.

## Plan

1. Restore a wider page/header shell.
2. Center each primary content section inside that shell with `mx-auto`.
3. Keep content sections at `max-w-5xl`.
4. Preserve top/bottom page padding and section rhythm.
5. Verify with lint, build, route check, and after screenshot.
