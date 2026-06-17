# Character reference image mode report

Date: 2026-06-17

## Summary

Implemented a per-character-reference mode that lets the user choose between extracted text guidance and actual attached image reference.

## Screenshots

- Before: `notes/screenshots/character-reference-image-mode-2026-06-17/before-fullscreen.png`
- After: `notes/screenshots/character-reference-image-mode-2026-06-17/after-fullscreen.png`

## Files changed

- `src/components/StyleAddModal.tsx`
  - Added `referenceMode` to `StyleEntry`.
  - Added a character-only checkbox that becomes usable after an image is attached.
  - New character references use image-reference mode only when that checkbox is checked.
- `src/components/nodes/ReferenceNode.tsx`
  - Added a character-only `이미지 참조` checkbox on saved reference cards.
  - Updates image-reference mode without replacing the reference.
- `src/app/page.tsx`
  - Normalizes persisted reference modes.
  - Builds `characterReferenceImages` only when the active character reference is connected and set to image-reference mode.
  - Adds an execution-setting line when a character identity image will be attached.
- `src/app/api/generate/route.ts`
  - Accepts and resolves `characterReferenceImages`.
- `src/lib/codex-worker-client.ts`
  - Added `characterReferenceImages` to the worker generate payload type.
- `scripts/codex-worker.mjs`
  - Normalizes character reference images.
  - Adds character identity instructions separate from style/image mix.
  - Optimizes and attaches character reference images before calling `codex exec`.

## Verification

- `npx eslint src/app/page.tsx src/app/api/generate/route.ts src/components/StyleAddModal.tsx src/components/nodes/ReferenceNode.tsx src/lib/codex-worker-client.ts scripts/codex-worker.mjs`
  - Passed with existing warnings only.
- `npm run build:next`
  - Passed.

## Notes and risks

- `npm run lint` across the full repository still fails on existing `codex/` and `scratch/` require-import errors unrelated to this change.
- Image-reference mode will increase input token cost when enabled because the uploaded character image is attached to generation.
- Existing saved character references default to `특징만`; users must opt into `이미지도` per reference.
