# Symbol Render Workflow Plan

Date: 2026-06-23

## Goal

Improve the existing xGen node workflow for turning a flat symbol image into a polished 3D brand/app-icon style render. This task should not add a new node yet; it should make the current image reference path clearer for symbol/object use.

## Before Screenshot

- `notes/screenshots/symbol-render-workflow-2026-06-23/before-fullscreen.png`

## Scope

- Improve `ImageMixNode` so an uploaded symbol can be treated as a symbol/object reference instead of defaulting to style-only guidance.
- Add clearer role labels and prompt guidance for symbol-preserving generation.
- Keep the existing generation pipeline shape: `imageMixImages` remains the visual-reference payload.
- Avoid package installs, broad schema migration, and unrelated canvas/UI refactors.

## Implementation Notes

- Prefer improving existing nodes over adding a new one.
- Preserve the current Luma-like soft creative-tool surface.
- Keep controls compact inside the React Flow node.
- Use existing lucide icons and local component patterns.

## Verification Plan

- Run TypeScript/ESLint checks against touched files where practical.
- Verify the app still responds locally at `http://127.0.0.1:3002/`.
- Capture an after screenshot for visual review.
