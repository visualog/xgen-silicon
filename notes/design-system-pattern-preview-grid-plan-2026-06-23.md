# Design System Pattern Preview Grid Plan - 2026-06-23

## Scope

- Align the `/design-system/patterns` preview card layout to the design-system grid overlay.
- Replace the arbitrary preview split with a 12-column grid on desktop.
- Keep the existing cards, copy, controls, and component examples unchanged.

## Before Evidence

- Screenshot: `notes/screenshots/design-system-pattern-preview-grid-2026-06-23/before.png`

## Files To Change

- `src/app/design-system/_components/patterns-page-content.tsx`

## Expected Change

- The preview section should use `lg:grid-cols-12` with explicit card spans instead of `lg:grid-cols-[1.1fr_0.9fr]`.
- Left preview cards should align to the left grid columns.
- Right preview cards should start on a grid column boundary and align to the right rail.

## Verification

- Run targeted lint on the changed file.
- Verify `/design-system/patterns` in the browser with grid overlay enabled.
- Capture after evidence.
