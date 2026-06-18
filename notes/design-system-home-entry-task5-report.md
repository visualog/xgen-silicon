# Design System Home Entry Task 5 Report

Date: 2026-06-10

## Summary

Updated the main xGen home topbar entry to make `/design-system` read as a separate documentation/design-system site. The visible label now says `디자인 시스템 문서`, with matching title and aria-label.

## Files Changed

- `src/app/page.tsx`

## Change

- Changed the `/design-system` topbar link from `디자인 시스템` to `디자인 시스템 문서`.
- Added `title="xGen 디자인 시스템 문서"`.
- Added `aria-label="xGen 디자인 시스템 문서 열기"`.
- Kept the existing icon, styling, and route behavior.

## Screenshots

Before:

- `notes/screenshots/design-system-home-entry-task5-2026-06-10/before-home-fullscreen.png`

After:

- `notes/screenshots/design-system-home-entry-task5-2026-06-10/after-home-fullscreen.png`
- `notes/screenshots/design-system-home-entry-task5-2026-06-10/after-design-system-fullscreen.png`

## Verification

- `./node_modules/.bin/eslint src/app/page.tsx`: passed with existing unused-variable warnings.
- `npm run build:next`: passed.
- `curl http://127.0.0.1:3002/`: `200`
- `curl http://127.0.0.1:3002/design-system`: `200`
- `curl http://127.0.0.1:3002/design-system/components`: `200`

## Server

Current server:

- `http://127.0.0.1:3002`
- command: `npm start -- -H 127.0.0.1 -p 3002`

## Remaining Risks

- `src/app/page.tsx` is already a large legacy file, currently over 3900 lines. This task kept the edit minimal instead of attempting a risky split.
- The focused lint command reports existing unused-variable warnings unrelated to this change.
- `next start` still warns that standalone output should use `node .next/standalone/server.js`; this is existing project behavior.
