# shadcn components page plan

Date: 2026-06-05
Branch: `feature/apps-sdk-ui-foundation`
Task: Apply shadcn/ui components to `/design-system/components`.

## Request

The user asked to apply shadcn/ui components to the design-system page.

## Before screenshot

- `notes/screenshots/shadcn-components-page-2026-06-05/before-fullscreen.png`

## Current issue

The page still renders most of its structure with inline style objects and older xGen-specific card/link classes. shadcn/ui primitives exist locally, but the page does not visibly use them as the main page structure.

## Implementation plan

1. Keep the existing component taxonomy and previews.
2. Replace the page shell, header actions, group cards, detail panel, state chips, and variant cards with local shadcn/ui primitives.
3. Add small local helpers for shadcn `Badge`, `Button`, and `Card` composition so the page reads as shadcn-based.
4. Preserve anchors and detail overlays so existing navigation behavior stays intact.
5. Verify with `npm run build:next`, source search, and an after screenshot.

## Out of scope

- Full redesign of every preview mini-component.
- Adding more shadcn components that are not yet needed by the page.
- Renaming historical notes.
