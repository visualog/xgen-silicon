# Design System CSS Normalization Report

Date: 2026-06-10

## Summary

Normalized the design-system shell CSS so layout, background, and body rail responsibilities are clearer in DevTools.

## Files Changed

- `src/app/design-system/_components/design-system-shell.tsx`
  - Replaced stacked Tailwind surface classes on `main` with `shadcn-docs-surface`.
  - Replaced stacked sticky/background utility classes on `header` with `shadcn-docs-header`.
  - Replaced body wrapper utility stack with `shadcn-docs-body`.
- `src/app/globals.css`
  - Added explicit shell layout CSS for `.shadcn-docs-surface`.
  - Added `.shadcn-docs-header` for sticky header styling.
  - Added `.shadcn-docs-body` with `width: min(calc(100% - 2rem), 1040px)` and `margin-inline: auto`.
  - Removed duplicate background/text responsibility from the design-system shell; global `body` owns page background/text.

## Screenshots

- Before: `notes/screenshots/design-system-css-normalization-2026-06-10/before-fullscreen.png`
- After: `notes/screenshots/design-system-css-normalization-2026-06-10/after-fullscreen.png`
- Final after: `notes/screenshots/design-system-css-normalization-2026-06-10/after-final-fullscreen.png`

## Verification

- `npm run build:next`
  - Passed.
- Restarted local server on `http://127.0.0.1:3002`.
- `curl -s --max-time 8 -I http://127.0.0.1:3002/design-system/patterns`
  - Returned `HTTP/1.1 200 OK`.
  - Latest ETag: `r6721xlx5x1rww`.
- Built output confirms:
  - `<main class="shadcn-docs-surface">`
  - `<header class="shadcn-docs-header">`
  - `<div data-slot="design-system-body" class="shadcn-docs-body">`

## Remaining Risk

`src/app/globals.css` is still a large legacy global stylesheet. This pass reduced design-system shell overlap but did not split global CSS into smaller route-owned modules. A future cleanup could extract design-system-only CSS if the app router setup allows it safely.
