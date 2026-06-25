# Mask Thumbnail Aspect Report

## Summary

- Updated the Mask Edit node preview thumbnail to use the source image's real aspect ratio instead of a fixed `16 / 10` frame.
- The source image is now rendered with `object-fit: contain`, so wide, square, and vertical images remain fully visible in the mask preview.
- The preset mask overlay stays in the same visible image coordinate space instead of being applied over a cropped thumbnail.

## Screenshots

- Before: `notes/screenshots/mask-thumbnail-aspect-2026-06-25/before-fullscreen.png`
- After: `notes/screenshots/mask-thumbnail-aspect-2026-06-25/after-fullscreen.png`

## Changed Files

- `src/components/nodes/MaskEditNode.tsx`
- `notes/mask-thumbnail-aspect-plan-2026-06-25.md`

## Verification

- `npx tsc --noEmit --pretty false` passed.
- `npx eslint src/components/nodes/MaskEditNode.tsx` passed with one existing `<img>` warning.
- `npm run build` passed.
- Local app responded with `HTTP/1.1 200 OK`.

## Remaining Risk

- This keeps the current preset region model. It improves thumbnail fidelity, but it does not yet add direct drag-to-select or brush masking.
