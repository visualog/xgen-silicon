# shadcn page rhythm correction plan

## Context

- Route: `/design-system/components`
- Target file: `src/app/design-system/components/page.tsx`
- Before screenshot: `notes/screenshots/shadcn-page-rhythm-correction-2026-06-08/before-fullscreen.png`

## Problem

- The hero text block starts too close to the fixed page header rhythm.
- The hero intro and foundation showcase are visually too compressed.
- Reusable section intros rely on bottom margin, while sections rely on parent gaps, so header-to-content spacing is not owned consistently.
- The Composable blocks header reads attached to its card grid.

## Plan

1. Keep one centered page shell, but give it explicit top and bottom breathing room.
2. Make each section a grid stack with its own header-to-content gap.
3. Remove `SectionIntro` bottom margin so spacing is controlled by the parent section, not by a reusable heading component.
4. Remove the showcase top margin and let the hero section gap control the intro-to-showcase relationship.
5. Verify with lint, build, live route check, and after screenshot.
