# Background Transparent Alpha Report

## Summary

- Added a first-class transparent background option to the Background node.
- The new `투명 배경` recipe writes a structured prompt that requests true PNG alpha and forbids checkerboard, grid, white, gray, studio, and fake transparency backgrounds.
- Transparent background requests now skip background reference images so reference backgrounds do not conflict with alpha output.
- The Codex worker now treats transparent Background node prompts like transparent mask edits and runs the existing checkerboard-to-alpha PNG postprocess on generated results.

## Screenshots

- Before: `notes/screenshots/background-transparent-alpha-2026-06-25/before-fullscreen.png`
- After: `notes/screenshots/background-transparent-alpha-2026-06-25/after-fullscreen.png`

## Changed Files

- `src/components/nodes/BackgroundNode.tsx`
- `src/app/page.tsx`
- `scripts/codex-worker.mjs`
- `notes/background-transparent-alpha-plan-2026-06-25.md`

## Verification

- `node --check scripts/codex-worker.mjs` passed.
- `npx tsc --noEmit --pretty false` passed.
- `npx eslint src/components/nodes/BackgroundNode.tsx src/app/page.tsx scripts/codex-worker.mjs` passed with existing warnings only.
- `npm run build` passed.
- Restarted `npm run dev`; app responded with `HTTP/1.1 200 OK`.
- Codex worker `/health` returned `{"ok":true}`.

## Remaining Risk

- I did not run a live image generation pass. The flow is verified through request construction, UI/runtime checks, worker prompt handling, postprocess wiring, TypeScript, lint, and build.
