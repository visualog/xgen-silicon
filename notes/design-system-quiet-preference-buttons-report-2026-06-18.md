# Design System Quiet Preference Buttons Report

Date: 2026-06-18

## Summary

Reduced the visual prominence of the `/design-system` header preference buttons and removed active-state styling that made the language and theme buttons stand out differently.

## Screenshots

- Before: `notes/screenshots/design-system-quiet-preference-buttons-2026-06-18/before-fullscreen.png`
- After: `notes/screenshots/design-system-quiet-preference-buttons-2026-06-18/after-fullscreen.png`

## Files Changed

- `src/app/globals.css`
- `notes/design-system-quiet-preference-buttons-plan-2026-06-18.md`
- `notes/design-system-quiet-preference-buttons-report-2026-06-18.md`

## Verification

- `npm run lint -- src/app/design-system/_components/design-system-shell.tsx` passed.
- `curl -s -I --max-time 10 http://127.0.0.1:3000/design-system` returned `HTTP/1.1 200 OK`.
- CSS no longer has a visual `data-state="on"` rule for `design-system-preference-button`.
- After screenshot confirms the light-mode language button now matches the theme button's quiet tone.

## Remaining Risk

The current environment does not include a Playwright binary, so dark-mode visual verification was done by CSS inspection and the shared dark-mode override rather than an automated dark-mode screenshot.
