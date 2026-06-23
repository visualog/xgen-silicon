# Background Node Recipe Reference Report

Date: 2026-06-23

## Summary

Reworked the Background node from independent parameter rows into a recipe-first workflow, then added background reference image support. The existing `backgroundPrompt` string pipeline remains compatible.

## Screenshots

- Before: `notes/screenshots/background-node-recipe-reference-2026-06-23/before-fullscreen.png`
- After: `notes/screenshots/background-node-recipe-reference-2026-06-23/after-fullscreen.png`

## Files Changed

- `src/components/nodes/BackgroundNode.tsx`
  - Added eight background recipes:
    - app icon studio
    - product studio
    - brand graphic
    - lifestyle interior
    - desk workspace
    - abstract campaign
    - outdoor natural light
    - urban architecture
  - Kept the existing six controls as collapsible fine tuning.
  - Added a background reference section with image upload, analysis modal, enable toggle, remove action, and influence controls.
- `src/components/StyleAddModal.tsx`
  - Added `background` mode copy for background reference image analysis.
- `src/lib/codex-worker-client.ts`
  - Allowed `background` mode for style/image analysis.
- `scripts/codex-worker.mjs`
  - Added background-specific image analysis focus.
  - Background image references now attach when influence is not low.
- `src/app/page.tsx`
  - Added persistent `backgroundReferences` state.
  - Restores and saves background references with editor snapshots/results.
  - Sends connected background references as `role: "background"` image references during generation.
  - Includes background reference count in the generated brief.

## Verification

- `./node_modules/.bin/eslint src/components/nodes/BackgroundNode.tsx src/components/StyleAddModal.tsx src/app/page.tsx`
  - Passed with warnings only.
  - Remaining warnings are existing unused helper warnings in `page.tsx` plus `<img>` warnings in image preview components.
- `node --check scripts/codex-worker.mjs`
  - Passed.
- `npm run build:next`
  - Passed.
- `curl -sS --max-time 10 -I http://127.0.0.1:3002/`
  - Returned `HTTP/1.1 200 OK`.

## Remaining Risks

- The after screenshot captures the full app shell; the Background node UI should still be manually opened from the canvas for visual review.
- A real generation with a background reference image is still needed to judge output quality and whether the background-only guard is strong enough.
