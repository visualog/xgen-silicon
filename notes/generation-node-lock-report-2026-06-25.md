# Generation Node Lock Report

## Summary

- Added a generation-time graph edit lock so users cannot modify nodes while an image generation request is running.
- During generation, React Flow now ignores node changes, edge changes, and new connections.
- Node dragging, connecting, selecting, focusing, and delete-key removal are disabled while generating.
- Node, edge, and handle pointer events are disabled with a locked React Flow class so internal controls cannot be edited during generation.
- Pan and zoom remain available for inspecting the canvas.

## Screenshots

- Before: `notes/screenshots/generation-node-lock-2026-06-25/before-fullscreen.png`
- After: `notes/screenshots/generation-node-lock-2026-06-25/after-fullscreen.png`

## Changed Files

- `src/app/page.tsx`
- `src/app/globals.css`
- `notes/generation-node-lock-plan-2026-06-25.md`

## Verification

- `npx tsc --noEmit --pretty false` passed.
- `npx eslint src/app/page.tsx src/app/globals.css` passed with existing warnings; CSS was ignored by the current ESLint config.
- `npm run build` passed.
- Local app responded with `HTTP/1.1 200 OK`.

## Remaining Risk

- This locks node editing at the graph/UI interaction layer. It does not change the underlying request snapshot logic.
