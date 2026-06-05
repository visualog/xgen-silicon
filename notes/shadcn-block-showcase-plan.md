# shadcn block showcase plan

Date: 2026-06-05
Branch: `feature/apps-sdk-ui-foundation`
Task group: Rebuild `/design-system/components` to follow the shadcn/ui landing and block showcase style.

## Reference

- `https://ui.shadcn.com/`
- The reference first viewport has a compact docs nav, a centered hero, and a broad dashboard-style mosaic of component blocks.
- The page is not primarily a component taxonomy. The taxonomy comes after the visual block showcase.

## User issue

The current xGen page uses shadcn primitives, but it still looks like a narrow documentation/catalog page. The requested direction is to follow the shadcn/ui site's design-system and component usage style.

## Before screenshot

- `notes/screenshots/shadcn-block-showcase-2026-06-05/before-fullscreen.png`

## Tasks

### Task 1: Reference audit and plan

- Capture current state.
- Identify the structural mismatch: small equal preview cards and early catalog content.

### Task 2: First viewport rebuild

- Keep the compact nav and centered hero.
- Replace the small `Composable blocks` preview with a broad block mosaic.
- Use varied card spans and realistic xGen product UI blocks.

### Task 3: Responsive behavior

- Make the mosaic dense and wide on desktop.
- Collapse cleanly to two columns/tablet and one column/mobile.
- Push the legacy catalog below the block showcase.

### Task 4: Verification and report

- Run `npm run build:next`.
- Verify the built route.
- Capture after screenshots.
- Write completion report.

## Acceptance criteria

- The first viewport visually reads like a shadcn/ui blocks page, not a catalog index.
- Cards vary in size and content density.
- The layout remains centered and responsive.
- Apps SDK UI remains out of the active implementation.
