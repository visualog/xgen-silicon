# Node Prompt Classification Plan

Date: 2026-06-22

## Scope

Classify xGen node inputs before prompt composition so Codex-facing creative
material and deterministic lock values are separated.

This is the smallest backend slice for the next prompt pipeline step:

- creative nodes can be rewritten or expanded later by Codex
- reference nodes preserve identity/style guidance
- locked nodes are emitted as fixed constraints
- output/quality rules stay deterministic

## Files

- `scripts/codex-worker.mjs`
- `src/lib/codex-worker-client.ts`

## Before Screenshot

- `notes/screenshots/node-prompt-classification-2026-06-22/before.png`

## Verification Plan

- Syntax-check the worker.
- Run targeted lint on changed files.
- Restart or use the current worker and call `/api/compose-prompt`.
- Confirm the output contains `Creative direction`, `Reference locks`, and
  `Locked constraints` sections when matching nodes are present.
