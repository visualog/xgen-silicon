# Figma Weave Layer And Mask Report

Date: 2026-06-01

## Summary

Implemented a lightweight Figma Weave-inspired layer and mask edit workflow for BrandGen.

The implementation treats generated images as reusable media layers and adds a mask edit node that can send a partial-edit instruction back through the existing generation path.

## Screenshots

- Before: `notes/screenshots/figma-weave-layer-mask-2026-06-01/before-fullscreen.png`
- After: `notes/screenshots/figma-weave-layer-mask-2026-06-01/after-fullscreen.png`

## Files Changed

- `src/app/page.tsx`
- `src/components/nodes/ImageLayerNode.tsx`
- `src/components/nodes/MaskEditNode.tsx`
- `src/components/nodes/OutputNode.tsx`
- `notes/figma-weave-layer-mask-plan.md`
- `notes/figma-weave-layer-mask-report.md`

## Behavior

- When a generated image exists, the editor now creates:
  - an image layer node,
  - a mask edit node,
  - graph edges from canvas to layer, layer to mask, and mask back to output.
- The mask edit node supports region presets:
  - subject,
  - center,
  - background,
  - top,
  - bottom,
  - left,
  - right.
- If mask edit is enabled and has an instruction, generation attaches the current generated image as a high-influence layer reference and appends a `MASKED LAYER EDIT` instruction to preserve unmasked regions.

## Verification

- `npm run build:next` passed.
- Production server check via `npm start -- -H 127.0.0.1 -p 3002` returned `HTTP/1.1 200 OK`.
- After screenshot captured from the running app.

## Remaining Risks

- This is prompt-guided partial editing, not a true pixel-mask inpainting engine.
- The mask regions are preset semantic/visual regions, not freehand painted alpha masks.
- Actual preservation quality depends on the image-generation model following the attached source image and `MASKED LAYER EDIT` instruction.

## Rollback

The pre-implementation checkpoint remains available:

- `stash@{0}`
- `checkpoint-before-figma-weave-implementation-2026-06-01`
- `5a7fa8bc744877ae3a548e9c29c0beca83282c42`
