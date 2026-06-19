# Design System Dark Card Sharpness Report

Date: 2026-06-18

## Summary

Confirmed the dark-mode card blur was caused by the `/design-system` card shadow treatment, not a transparent card background. Added a dark-mode override that keeps the card opaque and removes the large outer glow.

## Screenshots

- Before: `notes/screenshots/design-system-dark-card-sharpness-2026-06-18/before-fullscreen.png`
- After: `notes/screenshots/design-system-dark-card-sharpness-2026-06-18/after-fullscreen.png`

## Files Changed

- `src/app/globals.css`
- `notes/design-system-dark-card-sharpness-plan-2026-06-18.md`
- `notes/design-system-dark-card-sharpness-report-2026-06-18.md`

## Verification

- `npm run lint -- src/app/design-system/_components/design-system-shell.tsx src/app/design-system/_components/page-sections.tsx` passed.
- `curl -s -I --max-time 10 http://127.0.0.1:3000/design-system` returned `HTTP/1.1 200 OK`.
- After screenshot confirms the dark cards read with a sharper boundary and reduced halo.

## Remaining Risk

The light-mode card shadow remains unchanged. If light mode also feels too soft, it should be tuned separately.
