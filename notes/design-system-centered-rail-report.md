# Design System Centered Rail Report

Date: 2026-06-10

## Summary

Centered the design-system body content by narrowing the shared body rail from `max-w-7xl` to `max-w-5xl`. The header remains wide, but page content now reads as a deliberate centered documentation rail instead of appearing attached to the browser's left edge.

## Files Changed

- `src/app/design-system/_components/design-system-shell.tsx`

## Change

- Changed the shared design-system body wrapper:
  - from `max-w-7xl`
  - to `max-w-5xl`
- Kept existing header, navigation, mobile navigation, page content, and shadcn primitives unchanged.

## Screenshots

Before:

- `notes/screenshots/design-system-centered-rail-2026-06-10/before-overview-fullscreen.png`
- `notes/screenshots/design-system-centered-rail-2026-06-10/before-components-fullscreen.png`

After:

- `notes/screenshots/design-system-centered-rail-2026-06-10/after-overview-fullscreen.png`
- `notes/screenshots/design-system-centered-rail-2026-06-10/after-components-fullscreen.png`

## Verification

- `wc -l src/app/design-system/_components/design-system-shell.tsx`: 74 lines
- `./node_modules/.bin/eslint src/app/design-system`: passed
- `npm run build:next`: passed
- `curl http://127.0.0.1:3002/design-system`: `200`
- `curl http://127.0.0.1:3002/design-system/foundation`: `200`
- `curl http://127.0.0.1:3002/design-system/components`: `200`
- `curl http://127.0.0.1:3002/design-system/patterns`: `200`
- `curl http://127.0.0.1:3002/design-system/templates`: `200`

## Server

Current server:

- `http://127.0.0.1:3002`
- command: `npm start -- -H 127.0.0.1 -p 3002`

## Remaining Risks

- This is a shared shell adjustment, so every `/design-system/*` page inherits the narrower rail.
- The full-screen screenshots include the desktop and adjacent windows, per repo screenshot practice.
- `next start` still warns that standalone output should use `node .next/standalone/server.js`; this is existing project behavior.
