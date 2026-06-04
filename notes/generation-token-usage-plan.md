# Generation Token Usage Plan

Date: 2026-06-02

## Request

After image generation completes, show the token amount used from node settings processing through final image generation.

## Current State

- `scripts/codex-worker.mjs` parses Codex JSONL events but discards usage/token metadata.
- `/api/generate` returns image URL, prompts, title, and paths only.
- `src/app/page.tsx` stores generation duration but not token usage.
- `CanvasNode` and gallery cards have no token usage display.

## Plan

1. Extract token usage from Codex JSONL events in the worker.
2. Track usage for prompt building, metadata generation, and final image generation inside `/generate`.
3. Return normalized usage through `src/lib/codex-worker-client.ts` and `src/app/api/generate/route.ts`.
4. Store usage on the generated result and current canvas state.
5. Display usage after generation completes:
   - Canvas node: detailed usage summary.
   - Gallery card: compact total token count.
6. Verify with `npm run build:next`.

## Screenshots

- Before: `notes/screenshots/generation-token-usage-2026-06-02/before-fullscreen.png`
