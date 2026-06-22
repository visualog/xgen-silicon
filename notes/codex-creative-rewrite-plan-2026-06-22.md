# Codex Creative Rewrite Plan - 2026-06-22

## Scope

- Improve `/compose-prompt` so creative node inputs are optimized through Codex CLI.
- Keep reference, locked, and quality sections deterministic.
- Preserve the current response shape used by the prompt review panel.
- Add fallback behavior so prompt composition still works if Codex CLI fails.

## Before Evidence

- Screenshot: `notes/screenshots/codex-creative-rewrite-2026-06-22/before.png`
- Current behavior: node inputs are classified, but the optimized prompt is assembled deterministically without asking Codex to rewrite creative inputs.

## Files To Change

- `scripts/codex-worker.mjs`
- `src/lib/codex-worker-client.ts`

## Verification

- Syntax-check the worker.
- Run targeted eslint for changed files.
- Restart the Codex worker.
- Call `/api/compose-prompt` with creative, reference, and locked inputs.
- Confirm the response keeps deterministic reference/locked sections while reporting Codex rewrite status.
