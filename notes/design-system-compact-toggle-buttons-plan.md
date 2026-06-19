# Design System Compact Toggle Buttons Plan

Date: 2026-06-18

## Request

Remove labels from the two header toggle buttons. Show the language button as
`KO` / `EN`, and show the light/dark button with only the sun/moon icon.

## Before Screenshot

![Before full-screen capture](./screenshots/design-system-compact-toggle-buttons-2026-06-18/before-fullscreen.png)

## Plan

1. Keep the language and theme controls as click-to-toggle buttons.
2. Render language as compact `KO` / `EN` text.
3. Render theme as an icon-only button with the existing sun/moon icons.
4. Use fixed square/compact dimensions so neither button shifts width.
5. Preserve accessible `aria-label` and `aria-pressed`.
6. Verify lint, HTTP response, targeted source checks, and after screenshot.

## Files

- `src/app/design-system/_components/design-system-shell.tsx`
- `src/app/globals.css`
- `notes/design-system-compact-toggle-buttons-report.md`
- `notes/screenshots/design-system-compact-toggle-buttons-2026-06-18/`
