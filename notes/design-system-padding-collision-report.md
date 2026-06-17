# Design-system padding collision report

Date: 2026-06-17

## Summary

Fixed `/design-system` primitive padding drift by adding docs-route-only guards for shadcn primitive slots, excluding design-system preference buttons from broad legacy button globals, guarding nested card-like content used inside larger cards, guarding BoundaryGrid code-chip rows, aligning Do/Don't usage-card labels, and adding semantic Do/Don't tones with an explicit green Do background.

## Screenshots

- Before: `notes/screenshots/design-system-padding-collision-2026-06-17/before-components-fullscreen.png`
- After: `notes/screenshots/design-system-padding-collision-2026-06-17/after-components-fullscreen.png`
- After expanded controls: `notes/screenshots/design-system-padding-collision-2026-06-17/after-expanded-controls-fullscreen.png`
- After button group gap: `notes/screenshots/design-system-padding-collision-2026-06-17/after-button-group-gap-fullscreen.png`
- Before nested surfaces: `notes/screenshots/design-system-padding-collision-2026-06-17/before-nested-surfaces-fullscreen.png`
- After nested surfaces: `notes/screenshots/design-system-padding-collision-2026-06-17/after-nested-surfaces-fullscreen.png`
- Before boundary code chips: `notes/screenshots/design-system-padding-collision-2026-06-17/before-boundary-code-chips-fullscreen.png`
- After boundary code chips: `notes/screenshots/design-system-padding-collision-2026-06-17/after-boundary-code-chips-fullscreen.png`
- Before Do/Don't label: `notes/screenshots/design-system-padding-collision-2026-06-17/before-do-dont-label-fullscreen.png`
- After Do/Don't label: `notes/screenshots/design-system-padding-collision-2026-06-17/after-do-dont-label-fullscreen.png`
- Before Do/Don't tone: `notes/screenshots/design-system-padding-collision-2026-06-17/before-do-dont-tone-fullscreen.png`
- After Do/Don't tone: `notes/screenshots/design-system-padding-collision-2026-06-17/after-do-dont-tone-fullscreen.png`
- Before Do green background: `notes/screenshots/design-system-padding-collision-2026-06-17/before-do-green-background-fullscreen.png`
- After Do green background: `notes/screenshots/design-system-padding-collision-2026-06-17/after-do-green-background-fullscreen.png`
- After Do fixed green background: `notes/screenshots/design-system-padding-collision-2026-06-17/after-do-green-fixed-fullscreen.png`

## Files changed

- `src/app/globals.css`
  - Added `.shadcn-docs-surface` scoped guards for `data-slot="button"` sizes.
  - Added `.shadcn-docs-surface` scoped gap guards for `ButtonGroup` and `ButtonGroupSeparator`.
  - Added `.shadcn-docs-surface` scoped guards for `Card`, `CardHeader`, `CardContent`, and `CardFooter` padding.
  - Added `.shadcn-docs-surface` scoped guards for `Badge`, `Input`, `Textarea`, `SelectTrigger`, `ToggleGroup`, `ToggleGroupItem`, `TabsList`, and `TabsTrigger` spacing.
  - Added `.shadcn-docs-surface` scoped guards for composed nested surfaces: `status-tile`, `summary-tile`, `preview-frame`, `option-row`, and `media-tile`.
  - Added `.shadcn-docs-surface` scoped green/red semantic tones for `summary-tile` guidance states.
  - Replaced the Do tile `color-mix()` background with explicit light/dark green values to avoid unintended pink/orange color interpolation.
  - Added `.shadcn-docs-surface` scoped guards for `docs-code-chip` rows used by runtime-boundary source lists.
  - Added portal-safe select item/label guards for dropdown content rendered outside the docs surface.
  - Added mobile card padding adjustments inside the same docs scope.
- `src/app/design-system/_components/design-system-shell.tsx`
  - Added `data-slot="design-system-preference-option"` to native preference toggle buttons so they are not caught by broad legacy `button:not([data-slot])` rules.
- `src/app/design-system/_components/components-page-content.tsx`
  - Marked nested feedback rows, switch rows, usage summary boxes, and anatomy preview frames with docs-only slots.
  - Changed the English usage-card negative label from `Avoid` to `Don't` to match the section title and `dont` data model.
  - Added `data-tone="do"` and `data-tone="dont"` plus label slots to the usage summary tiles.
- `src/app/design-system/_components/patterns-page-content.tsx`
  - Marked nested status rows, media tiles, preview frames, checkbox rows, and switch rows with docs-only slots.
- `src/app/design-system/_components/page-sections.tsx`
  - Marked template preview frames with a docs-only slot.
  - Marked BoundaryGrid code rows with `data-slot="docs-code-chip"` so inline padding and row height survive legacy CSS collisions.

## Verification

- `npx eslint src/app/design-system/_components/design-system-shell.tsx`
  - Passed after expanded primitive guards.
- `npx eslint src/app/design-system/_components/components-page-content.tsx src/app/design-system/_components/patterns-page-content.tsx src/app/design-system/_components/page-sections.tsx`
  - Passed after nested surface slot changes.
- `npx eslint src/app/design-system/_components/page-sections.tsx`
  - Passed after BoundaryGrid code-chip slot changes.
- `npx eslint src/app/design-system/_components/components-page-content.tsx`
  - Passed after Do/Don't label and tone changes.
- `npm run build:next`
  - Passed.
- `curl -I --max-time 10 http://127.0.0.1:3002/design-system`
  - Passed with `HTTP/1.1 200 OK`.
- `curl -I --max-time 10 http://127.0.0.1:3002/design-system/components`
  - Passed with `HTTP/1.1 200 OK`.
- `curl -I --max-time 10 http://127.0.0.1:3002/design-system/foundation`
  - Passed with `HTTP/1.1 200 OK`.
- `curl -I --max-time 10 http://127.0.0.1:3002/design-system/patterns`
  - Passed with `HTTP/1.1 200 OK`.

## Remaining risks

- `src/app/globals.css` already has unrelated uncommitted design-system cleanup changes in this worktree. This patch stayed scoped to the docs surface and did not revert those changes.
- If padding drift appears on additional composed custom surfaces, add semantic `data-slot` names and scoped docs guards rather than broad global selectors.
