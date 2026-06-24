# Symbol Render Workflow Report

Date: 2026-06-23

## Summary

Improved the existing image-mix workflow so a flat symbol image can be used as a strong symbol/object reference for 3D brand/app-icon style generation. No new node was added.

## Screenshots

- Before: `notes/screenshots/symbol-render-workflow-2026-06-23/before-fullscreen.png`
- After: `notes/screenshots/symbol-render-workflow-2026-06-23/after-fullscreen.png`

## Files Changed

- `src/components/nodes/ImageMixNode.tsx`
  - Added a `symbol` image-mix role.
  - New image-mix uploads now default to `symbol` with `high` influence.
  - The add modal opens in object-reference mode.
  - Added compact role hints and adjusted empty-state/button copy for symbol/object use.
- `src/app/page.tsx`
  - Added `symbol` to image-mix role normalization.
  - Updated image-mix prompt text so symbol references preserve silhouette, internal geometry, node relationships, color identity, and negative space while still allowing material, depth, camera, and lighting changes.
- `scripts/codex-worker.mjs`
  - Added worker-side symbol role labeling.
  - Symbol references now attach when influence is not low.
  - Updated worker image-mix prompt guidance to match the client prompt.
- `notes/symbol-render-workflow-plan-2026-06-23.md`
  - Added the implementation plan and before-screenshot reference.

## Verification

- `./node_modules/.bin/eslint src/components/nodes/ImageMixNode.tsx src/app/page.tsx`
  - Passed with existing warnings:
    - unused helper warnings in `src/app/page.tsx`
    - existing `<img>` warning in `ImageMixNode`
- `node --check scripts/codex-worker.mjs`
  - Passed.
- `npm run build:next`
  - Passed.
- `curl -sS --max-time 10 -I http://127.0.0.1:3002/`
  - Returned `HTTP/1.1 200 OK`.

## Remaining Risks

- The after screenshot captures the main app shell; the optional Image Mix node may need a manual canvas interaction to visually inspect the new empty-state copy.
- The exact generated output still depends on the image model following the stronger symbol guidance. A controlled generation with `SYMBOL.png` should be the next validation step if output quality needs to be measured.
