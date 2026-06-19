# Design System Quiet Preference Buttons Plan

Date: 2026-06-18

## Request

Make the language and light/dark preference buttons keep the same quiet style in light mode and avoid standing out too much in dark mode.

## Before Screenshot

- `notes/screenshots/design-system-quiet-preference-buttons-2026-06-18/before-fullscreen.png`

## Finding

The current `data-state="on"` style visually promotes active buttons with stronger border, background, and foreground color. This makes the language button too prominent in light mode and both active controls too prominent in dark mode.

## Plan

1. Keep the existing fixed-size preference button structure.
2. Remove active-state visual promotion for these header utility controls.
3. Use the same low-contrast surface for language and theme buttons.
4. Add a dark-mode-specific quiet surface so the controls do not glow against the header.
5. Verify the route and capture the after state.
