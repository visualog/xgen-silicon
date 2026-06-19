# Design System Header Rail Correction Plan

Date: 2026-06-18

## Request

Re-check the `/design-system` header because the previous fix removed internal
header breathing room and the content still reads like a fixed-width block stuck
to the left.

## Before Screenshot

![Before full-screen capture](./screenshots/design-system-header-rail-correction-2026-06-18/before-fullscreen.png)

## Findings

- The previous change moved the header layout into a component-level Tailwind
  max-width (`max-w-[1184px]`) while the body uses a CSS rail:
  `width: min(calc(100% - 2rem), 1120px)`.
- Because the header and body rail are calculated differently, the header still
  does not feel like it belongs to the same page structure.
- Replacing `h-16` with `py-3` made the header feel compressed.

## Plan

1. Add a `.shadcn-docs-header-inner` CSS slot next to `.shadcn-docs-body`.
2. Give it the same rail formula as the body: `min(calc(100% - 2rem), 1120px)`.
3. Restore a stable desktop header height with `min-height: 4rem`.
4. Keep one semantic nav from the previous correction.
5. Use component classes only for layout relationships, not rail sizing.

## Files

- `src/app/design-system/_components/design-system-shell.tsx`
- `src/app/globals.css`
- `notes/design-system-header-rail-correction-report.md`
- `notes/screenshots/design-system-header-rail-correction-2026-06-18/`
