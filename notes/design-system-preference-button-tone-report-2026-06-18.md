# Design System Preference Button Tone Report

Date: 2026-06-18

## Summary

Adjusted the `/design-system` header preference buttons so the language and theme controls no longer look over-wrapped or visually loud in dark mode.

## Screenshots

- Before: `notes/screenshots/design-system-preference-button-tone-2026-06-18/before-fullscreen.png`
- After: `notes/screenshots/design-system-preference-button-tone-2026-06-18/after-fullscreen.png`

## Files Changed

- `src/app/globals.css`
- `notes/design-system-preference-button-tone-plan-2026-06-18.md`
- `notes/design-system-preference-button-tone-report-2026-06-18.md`

## Verification

- `npm run lint -- src/app/design-system/_components/design-system-shell.tsx` passed.
- `curl -s -I --max-time 10 http://127.0.0.1:3000/design-system` returned `HTTP/1.1 200 OK`.
- After screenshot confirms the active preference buttons use a quieter muted surface instead of strong white/black fill.

## Remaining Risk

The after screenshot was captured from the live browser in dark mode. If the final desired tone is even flatter, the same CSS block can be reduced further by removing the active-state border emphasis.
