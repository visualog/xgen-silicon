# Generation Error Details Report

Date: 2026-06-02

## Summary

Generation failures now show the actual error message instead of only `생성 실패`.

The generate API also normalizes relative attached image URLs to the current request origin before sending them to the Codex worker.

## Root Cause

Two issues were identified:

1. The UI discarded the error detail returned from `/api/generate`.
   - `src/app/page.tsx` only set a boolean error state.
   - `CanvasNode` only displayed `생성 실패`.
2. Attached image references could be passed as relative URLs.
   - `scripts/codex-worker.mjs` resolves relative URLs against `BRANDGEN_APP_URL || http://127.0.0.1:3000`.
   - If the running app is on another port or inside Electron, the worker can fetch the wrong URL and fail with an image URL error.

## Files Changed

- `src/app/api/generate/route.ts`
- `src/app/page.tsx`
- `src/components/nodes/CanvasNode.tsx`
- `notes/generation-error-details-plan.md`
- `notes/generation-error-details-report.md`

## Screenshots

- Before: `notes/screenshots/generation-error-details-2026-06-02/before-fullscreen.png`
- After: `notes/screenshots/generation-error-details-2026-06-02/after-fullscreen.png`

## Verification

- `npm run build:next` passed.
- `npm start -- -H 127.0.0.1 -p 3002` returned `HTTP/1.1 200 OK`.

## Remaining Risk

If Codex CLI itself fails, the app will now show that CLI error. This improves diagnosis but does not mask or retry provider-level generation failures.
