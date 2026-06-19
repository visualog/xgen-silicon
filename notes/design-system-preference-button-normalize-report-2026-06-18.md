# Design System Preference Button Normalize Report

Date: 2026-06-18

## Summary

Normalized the language and theme preference buttons in the `/design-system` header so both controls use the same fixed `2rem x 2rem` button shell.

## Screenshots

- Before: `notes/screenshots/design-system-preference-button-normalize-2026-06-18/before-fullscreen.png`
- After: `notes/screenshots/design-system-preference-button-normalize-2026-06-18/after-fullscreen.png`

## Files Changed

- `src/app/globals.css`
- `notes/design-system-preference-button-normalize-plan-2026-06-18.md`
- `notes/design-system-preference-button-normalize-report-2026-06-18.md`

## Verification

- `npm run lint -- src/app/design-system/_components/design-system-shell.tsx src/app/design-system/_components/page-sections.tsx` passed.
- `curl -s -I --max-time 10 http://127.0.0.1:3000/design-system` returned `HTTP/1.1 200 OK`.
- After screenshot confirms both preference buttons use the same visual shell.

## Remaining Risk

The language label uses two uppercase characters inside a compact square control. It fits `KO` and `EN`; longer locale labels would need a wider variant.
