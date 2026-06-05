# shadcn visual alignment plan

Date: 2026-06-05
Branch: `feature/apps-sdk-ui-foundation`
Task: Make `/design-system/components` visually align with shadcn/ui, not just use its primitives.

## Problem

The current page technically uses shadcn `Card`, `Button`, and `Badge`, but it still looks unlike shadcn/ui because the first viewport is a dense legacy component catalog. The visible style has heavy borders, cramped cards, many old xGen previews, and no shadcn-like hero or block composition.

## Before screenshot

- `notes/screenshots/shadcn-visual-alignment-2026-06-05/before-fullscreen.png`

## Plan

1. Rebuild the first viewport as a shadcn-like docs/showcase page:
   - simple top navigation
   - centered hero
   - black primary button
   - muted secondary action
   - spacious showcase grid
2. Use real local shadcn primitives in the showcase:
   - `Button`
   - `Badge`
   - `Card`
   - `ToggleGroup`
3. Move the existing xGen component taxonomy below the showcase as a quieter catalog section.
4. Soften catalog cards so they do not dominate the first screen.
5. Verify with `npm run build:next` and after screenshot.

## Out of scope

- Perfect clone of the shadcn marketing page.
- Removing the xGen component taxonomy entirely.
- Adding network-fetched registry blocks.
