# shadcn content wrapper padding plan

## Context

- Route: `/design-system/components`
- Target file: `src/app/design-system/components/page.tsx`
- Before screenshot: `notes/screenshots/shadcn-content-wrapper-padding-2026-06-08/before-fullscreen.png`

## Problem

- The page uses `main` as a grid container even though it only needs normal document flow.
- The content wrapper uses `py-*`, which makes top and bottom spacing less explicit when inspecting the header-to-content relationship.
- The desired ownership is: `header` owns its own height, the following content wrapper owns the gap below header and bottom page breathing room.

## Plan

1. Remove unnecessary grid layout from `main`.
2. Keep `main` as the shadcn docs surface only.
3. Split content wrapper vertical padding into explicit `pt-*` and `pb-*`.
4. Preserve current moderate section rhythm.
5. Verify with lint, build, route check, and after screenshot.
