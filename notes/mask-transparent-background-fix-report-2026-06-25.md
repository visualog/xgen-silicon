# Mask Transparent Background Fix Report

## Summary

- Fixed the Mask Edit background-removal flow so transparent PNG requests are passed as an explicit transparent-background edit instead of only free-form prompt text.
- Added stronger generation guidance to require real alpha transparency and prohibit checkerboard/grid/tiled transparency preview patterns.
- Preserved PNG format for layer-edit reference inputs in the Codex worker so alpha-capable assets are not unnecessarily converted to WebP.
- Added a worker-side postprocess for transparent-background mask edits that converts edge-connected checkerboard/transparent-preview backgrounds into actual PNG alpha.

## Screenshots

- Before: `notes/screenshots/mask-transparent-background-fix-2026-06-25/before-fullscreen.png`
- After: `notes/screenshots/mask-transparent-background-fix-2026-06-25/after-fullscreen.png`

## Changed Files

- `src/app/page.tsx`
- `src/lib/codex-worker-client.ts`
- `scripts/codex-worker.mjs`
- `notes/mask-transparent-background-fix-plan-2026-06-25.md`

## Verification

- `node --check scripts/codex-worker.mjs` passed.
- `npx tsc --noEmit --pretty false` passed.
- `npx eslint src/app/page.tsx src/lib/codex-worker-client.ts scripts/codex-worker.mjs` passed with existing unused-function warnings only.
- `npm run build` passed.
- Restarted `npm run dev` so the running Codex worker loads the updated transparent-background postprocess code.

## Remaining Risk

- I did not run a live paid/long image generation pass. The fix is verified at the request construction, worker prompt, image-reference materialization, transparent-background postprocess path, TypeScript, lint, and build levels.
- The postprocess is intentionally conservative: it only removes background-like pixels connected to the image edges so subject details are less likely to be erased.
