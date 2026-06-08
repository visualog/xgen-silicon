# shadcn spacing foundation reset plan

## Context

- Route: `/design-system/components`
- Target file: `src/app/design-system/components/page.tsx`
- Before screenshot: `notes/screenshots/shadcn-spacing-foundation-reset-2026-06-08/before-fullscreen.png`

## Problem

- Previous spacing values were too large for a shadcn documentation-style route.
- `gap-40`, `gap-52`, and hero `gap-24/28` created exaggerated section separation instead of a stable documentation rhythm.
- The page did use shadcn components and tokens, but the layout rhythm drifted from nearby `/design-system` and `/design-system/templates` pages.
- Header-to-content, section-to-section, and section-heading-to-content spacing need one consistent owner and scale.

## Plan

1. Match the page shell to nearby shadcn docs routes: centered `max-w-7xl`, `px-4 sm:px-6 lg:px-8`, and moderate vertical padding.
2. Replace oversized inter-section grid gaps with `space-y-16 lg:space-y-20`.
3. Use `gap-10 lg:gap-12` for hero intro to showcase.
4. Use `gap-8 lg:gap-10` for section heading to content.
5. Keep shadcn components, color tokens, and component-owned card/input/button padding intact.
6. Verify with lint, build, route check, and after screenshot.
