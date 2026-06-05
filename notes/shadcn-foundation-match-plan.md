# shadcn foundation match plan

Date: 2026-06-05
Branch: `feature/apps-sdk-ui-foundation`
Task: Match shadcn/ui foundation styling more closely.

## Problem

The page layout was closer to shadcn/ui, but the visual foundation was still wrong:

- shadcn `border` utilities rendered as dark/currentColor borders because the base layer did not apply `border-border`.
- Header spacing and typography were larger/looser than the shadcn docs header.
- Showcase cards were too cramped and their borders looked heavy.
- Card/button/badge styling therefore looked unlike shadcn/ui even though the components were in use.

## Before screenshot

- `notes/screenshots/shadcn-foundation-match-2026-06-05/before-fullscreen.png`

## Plan

1. Add the shadcn base layer:
   - `* { @apply border-border outline-ring/50; }`
   - `body { @apply bg-background text-foreground; }`
2. Align shadcn foundation variables:
   - default radius
   - neutral background
   - muted/border/input values
3. Adjust the components page header, hero, and showcase spacing to match shadcn docs density.
4. Remove pill overuse where shadcn examples use rounded-md or rounded-lg controls.
5. Rebuild, restart, and capture after screenshot.
