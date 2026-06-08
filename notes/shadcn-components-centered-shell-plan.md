# shadcn components centered shell plan

## Context

- Route: `/design-system/components`
- Target file: `src/app/design-system/components/page.tsx`
- Before screenshot: `notes/screenshots/shadcn-components-centered-shell-2026-06-08/before-fullscreen.png`

## Problem

- With DevTools open, the page viewport is narrower than the previous `max-w-7xl` shell.
- Because the viewport is narrower than `max-w-7xl`, `mx-auto` cannot create visible side margins.
- The page therefore reads as left-attached even though the wrapper technically has `mx-auto`.

## Plan

1. Use a narrower shared shell width for the components route.
2. Apply the same shell width to the header and content wrapper.
3. Keep vertical padding and section rhythm unchanged.
4. Verify with lint, build, route check, and after screenshot.
