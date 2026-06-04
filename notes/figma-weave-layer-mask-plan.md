# Figma Weave Layer And Mask Plan

Date: 2026-06-01

## Goal

Introduce the Figma Weave-inspired idea that generated images are editable media assets, not final dead-end outputs.

## Before Screenshot

- `notes/screenshots/figma-weave-layer-mask-2026-06-01/before-fullscreen.png`

## Relevant Source Document

- `notes/figma-weave-reverse-engineering-analysis.md`

## Implementation Plan

1. Add a generated image layer concept to the editor state so the latest generated image can be treated as a reusable layer.
2. Add a layer node that visually exposes the generated image as a layer source.
3. Add a mask edit node that lets the user choose a mask region and describe the local change.
4. Feed the active layer image plus mask instruction into the existing generation route as a controlled image reference.
5. Keep the implementation lightweight: no new provider/model switch, no destructive migration, and no replacement of the existing generation path.

## Expected UX

- After an image exists, the canvas exposes a generated layer node.
- The mask edit node shows the selected region and edit instruction.
- Running generation with mask edit enabled sends the previous image as a layer reference and instructs the model to preserve the unmasked area.

## Verification

- `npm run build:next`
- Manual browser screenshot after implementation.

## Rollback

- Pre-implementation checkpoint is saved in git stash:
  - `stash@{0}`
  - `checkpoint-before-figma-weave-implementation-2026-06-01`
  - `5a7fa8bc744877ae3a548e9c29c0beca83282c42`
