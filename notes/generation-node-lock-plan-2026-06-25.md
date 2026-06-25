# Generation Node Lock Plan

## Context

- Image generation reads the current node graph and sends it to the Codex worker.
- If users modify node values, node positions, or connections during generation, the screen can diverge from the request that is actually running.

## Screenshot

- Before: `notes/screenshots/generation-node-lock-2026-06-25/before-fullscreen.png`

## Plan

1. Treat `isGenerating` as a graph edit lock.
2. Ignore node and edge changes while the lock is active.
3. Disable React Flow dragging, connecting, selecting, and deletion while generating.
4. Keep pan/zoom available so users can inspect the canvas during generation.
5. Verify with TypeScript, targeted lint, build, and local app health.
