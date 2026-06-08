# shadcn button spacing normalization report

Date: 2026-06-08

## Summary

Normalized documentation action buttons after identifying that some buttons looked under-padded. The first pass removed inappropriate `size="sm"` usage. The second pass added explicit `data-size` and `data-variant` attributes to the shadcn Button wrapper so docs-route CSS can verify and protect component sizing without relying on visual inference.

## Screenshots

- Before: `notes/screenshots/shadcn-button-spacing-normalization-2026-06-08/before-fullscreen.png`
- After: `notes/screenshots/shadcn-button-spacing-normalization-2026-06-08/after-fullscreen.png`

## Files Changed

- `src/app/design-system/components/page.tsx`
  - Removed `size="sm"` from preview/action buttons in foundation showcase and composable blocks.
  - Kept `size="sm"` only for header utility controls where compact sizing is appropriate.
  - Removed repeated `ButtonGroup className="gap-2"` in favor of route-scoped docs rhythm.
- `src/components/ui/button.tsx`
  - Added `data-size` and `data-variant` attributes while preserving the shadcn class contract.
- `src/app/globals.css`
  - Added `.shadcn-docs-surface [data-slot="button-group"]` wrap/gap behavior.
  - Added a `min-width: max-content` guard for buttons inside docs button groups.
  - Added docs-route size guards for `[data-slot="button"][data-size="default" | "sm" | "icon"]`.

## Root Cause

- Tailwind compiled CSS does include `--spacing:.25rem`, `.px-4`, `.px-3`, `.h-9`, and `.py-2`; the Tailwind spacing utilities are not missing.
- shadcn `Button` source includes the expected padding classes: default buttons use `h-9 px-4 py-2`, and small buttons use `h-8 px-3 text-xs`.
- The global legacy `button:not([data-slot])` rule does not apply to shadcn buttons because shadcn buttons render with `data-slot="button"`.
- The actual failure mode was that the docs page overused small buttons in compact groups, and the Button DOM did not expose `data-size`, making route-level guards impossible. This can create the same kind of ambiguity for other components unless slot and state attributes are preserved.

## Verification

- `./node_modules/.bin/eslint src/app/design-system/components/page.tsx`
  - Result: passed.
- `./node_modules/.bin/eslint src/components/ui/button.tsx src/app/design-system/components/page.tsx`
  - Result: passed.
- `npm run build:next`
  - Result: passed.
- `curl -s -I http://127.0.0.1:3013/design-system/components`
  - Result: `200 OK`.

## Notes

- The remaining `size="sm"` usages are header utility buttons only.
- The screenshot was captured in a half-width browser viewport, so full-width visual review is still recommended.
