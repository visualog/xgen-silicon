# shadcn components shell reset plan

## Context

- Route: `/design-system/components`
- Target file: `src/app/design-system/components/page.tsx`
- Before screenshot: `notes/screenshots/shadcn-components-shell-reset-2026-06-08/before-fullscreen.png`

## Problem

- The `/design-system/components` shell drifted from the already stable `/design-system` page shell.
- The wrapper used a custom `space-y` structure, making top and bottom page padding harder to reason about visually.
- The page should use the same shadcn docs shell pattern as the sibling design-system pages.

## Plan

1. Match the content wrapper to `/design-system`: `mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28`.
2. Remove wrapper-level `space-y` and use explicit section `mt-16` for sections after the hero.
3. Keep section header-to-content gaps moderate with `gap-8 lg:gap-10`.
4. Verify with lint, build, route check, and after screenshot.
