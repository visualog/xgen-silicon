# Token Image Input Optimization Plan

Date: 2026-06-02

## Task

Reduce the remaining high token usage after a real generation reported 31,636 tokens.

## Context

- Text prompt compaction was already applied in the previous iteration.
- Remaining usage is likely dominated by attached image inputs:
  - style reference images
  - image mix references
  - generated layer / mask edit source images
- `sharp` is available in the local runtime.

## Requirements

- Reduce token usage without harming generation quality.
- Do not remove references; optimize their size/format by role.
- Style-only references do not require full-resolution pixels.
- Mask/layer references need more spatial detail than style-only references.

## Small Tasks

1. Add worker-side image optimization with safe fallback.
2. Downscale style references and image mix references before passing them to Codex CLI.
3. Preserve higher limits for mask/generated-layer references.
4. Verify worker syntax, build, package, and app runtime.

## Verification Commands

- `node --check scripts/codex-worker.mjs`
- `npm run build:next`
- `npm run pack:mac`
- `curl -s --max-time 5 -I http://127.0.0.1:3001/`

## Artifacts

- Before screenshot: `notes/screenshots/token-image-input-optimization-2026-06-02/before-fullscreen.png`
- Completion report: `notes/token-image-input-optimization-report.md`

## Pass Criteria

- Build passes.
- Packaged app runs.
- Worker optimizes attached image files before image generation.
- No quality-critical reference category is dropped.
