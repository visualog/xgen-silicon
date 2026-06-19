# Design System Preference Button Normalize Plan

Date: 2026-06-18

## Request

Make the language toggle button use the same visual style as the light/dark toggle button.

## Before Screenshot

- `notes/screenshots/design-system-preference-button-normalize-2026-06-18/before-fullscreen.png`

## Plan

1. Keep the existing `PreferenceButton` component and click toggle behavior.
2. Remove the text button's wider dimensions so both controls share the same `2rem x 2rem` button shell.
3. Use one shared radius and padding model for text and icon variants.
4. Keep the label centered and fixed so `KO` and `EN` do not resize the control.
5. Verify lint, HTTP response, and capture an after screenshot.
