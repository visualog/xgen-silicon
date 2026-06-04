# Token Image Input Optimization Report

Date: 2026-06-02

## Summary

The reported 31,636 token generation is still too high after text prompt compaction. This iteration targets the likely remaining driver: attached image input tokens from style references, image mix references, generated layers, and mask edit sources.

## Changes

- `scripts/codex-worker.mjs`
  - Added `sharp`-based image optimization before passing image references to `codex exec`.
  - Style references are resized to max 768px edge as WebP.
  - Element sheet references are resized to max 1024px edge as WebP.
  - General image mix references are resized to max 1024px edge as WebP.
  - Generated-layer / mask-edit references are resized to max 1280px edge as WebP to preserve more spatial detail.
  - Added fallback to original image write if optimization fails.

## Why This Should Reduce Usage

The final prompt text is already compact. A 31,636 token total is likely dominated by image input tokens, especially when one or more high-resolution reference images are attached. Resizing references before attaching them should reduce input token use while keeping enough visual information for style, composition, and mask guidance.

## Verification

- `sharp` availability check: passed.
- `node --check scripts/codex-worker.mjs`: passed.
- `npm run build:next`: passed.
- `npm run pack:mac`: passed.
- Packaged app resources refreshed:
  - `release/mac/xGen.app/Contents/Resources/next/server.js`: 2026-06-02 23:50:30
- App runtime:
  - `127.0.0.1:4317`: worker listening.
  - `127.0.0.1:3001`: packaged Next app listening.
- `curl -s --max-time 5 -I http://127.0.0.1:3001/`: `HTTP/1.1 200 OK`.
- Direct app log showed `/translate` succeeds without Codex execution logs, confirming deterministic prompt composition remains active.

## Screenshots

- Before: `notes/screenshots/token-image-input-optimization-2026-06-02/before-fullscreen.png`
- After: `notes/screenshots/token-image-input-optimization-2026-06-02/after-fullscreen.png`

## Remaining Risks

- A real post-change generation is still needed to measure the new total token count.
- If 31,636 remains high after image resizing, the next target should be reducing the number of attached references per generation and adding a "style image prompt only" mode for low-impact references.
- Mask edit quality should be checked visually because its layer reference is now capped at 1280px.

## Next Task

Run one controlled generation using the same setup that previously consumed 31,636 tokens and compare:

- total tokens
- final image generation input/output/cached tokens
- output quality
- whether attached reference count is still excessive
