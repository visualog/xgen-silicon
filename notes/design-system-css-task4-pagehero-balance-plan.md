# Design System CSS Task 4 Plan - PageHero Balance

Date: 2026-06-10

## Goal

Inspect and adjust the design-system `PageHero` composition after CSS cleanup. Remaining left-heavy perception should be handled by layout composition, not global CSS overrides.

## Before Evidence

- `notes/screenshots/design-system-css-task4-pagehero-balance-2026-06-10/before-fullscreen.png`

## Finding

`PageHero` uses `lg:grid-cols-[0.9fr_0.5fr]`, which reserves a wide right column for a single button. This can make the hero feel left-heavy even when the body rail itself is centered.

## Plan

1. Keep left-aligned documentation copy.
2. Change hero grid to use a flexible content column plus an `auto` action column.
3. Narrow hero text from `max-w-4xl` to `max-w-3xl`.
4. Build, verify routes, capture after screenshot, and write report/handoff.
