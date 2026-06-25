# Mask Thumbnail Aspect Plan

## Context

- The Mask Edit node thumbnail currently uses a fixed `16 / 10` aspect ratio.
- This makes wide, square, and vertical generated images appear cropped or distorted relative to the visible mask overlay.

## Screenshot

- Before: `notes/screenshots/mask-thumbnail-aspect-2026-06-25/before-fullscreen.png`

## Plan

1. Read the source image natural dimensions in `MaskEditNode`.
2. Use the actual image aspect ratio for the thumbnail container.
3. Switch the thumbnail image from `cover` to `contain` so the full image remains visible.
4. Keep the preset mask overlay aligned to the visible image area.
5. Verify with TypeScript, targeted lint, and build.
