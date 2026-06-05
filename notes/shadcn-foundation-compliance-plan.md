# shadcn foundation compliance plan

Date: 2026-06-05
Branch: `feature/apps-sdk-ui-foundation`
Task: Rework `/design-system/components` to obey shadcn/ui foundation rules and improve cold initial load.

## User requirements

- Do not create arbitrary custom margins, font sizes, line heights, or spacing.
- Use the installed shadcn/ui design-system primitives and Tailwind spacing/type scale.
- Import/use needed shadcn/ui components and replace content only.
- Rebuild layout using shadcn-style container, stack, and grid patterns.
- Reduce initial loading time after cache invalidation by removing render-blocking/heavy initial content.

## Current problems

- The page currently renders a large catalog and target overlays on initial load.
- Built standalone response for `/design-system/components` is about `581476` bytes.
- The page contains arbitrary bracket utilities and inline styles in active page/showcase code.
- The showcase content is custom-shaped instead of using the local shadcn primitives' default padding and typography.

## Before screenshot

- `notes/screenshots/shadcn-foundation-compliance-2026-06-05/before-fullscreen.png`

## Tasks

1. Replace arbitrary page shell values with standard Tailwind/shadcn scale utilities.
2. Add missing local shadcn primitive `Input` and use it for search/prompt fields.
3. Rebuild the first page using `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`, `Button`, `Badge`, `Input`, and `ToggleGroup`.
4. Remove the heavy detail overlay and full catalog render from initial output.
5. Verify `npm run build:next`, built route status, response size, and screenshots.

## Acceptance criteria

- No active page/showcase arbitrary spacing/type classes such as `max-w-[...]`, `min-h-[...]`, `text-[...]`, or inline `style` for sizing.
- Initial rendered page is substantially smaller than the current `581476` byte response.
- First viewport uses shadcn component defaults wherever possible.
- Apps SDK UI remains absent from active code/package references.
