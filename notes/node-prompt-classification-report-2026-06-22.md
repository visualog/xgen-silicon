# Node Prompt Classification Report

Date: 2026-06-22

## Summary

Added deterministic node prompt classification to the Codex worker prompt
composition path.

The worker now separates prompt inputs into:

- `creative`: values Codex can later rewrite or expand
- `reference`: identity/style/object lock guidance
- `locked`: exact constraints that should not be creatively rewritten
- `quality`: deterministic output guardrails

The composed prompt now emits explicit sections:

- `Creative direction`
- `Reference locks`
- `Locked constraints`
- `Quality guard`

The existing `/translate` API response shape remains `{ englishPrompt }`, but
the prompt content now uses the same classified section structure.

## Changed Files

- `scripts/codex-worker.mjs`
- `src/lib/codex-worker-client.ts`
- `notes/node-prompt-classification-plan-2026-06-22.md`
- `notes/node-prompt-classification-report-2026-06-22.md`

## Screenshots

- Before: `notes/screenshots/node-prompt-classification-2026-06-22/before.png`
- After: `notes/screenshots/node-prompt-classification-2026-06-22/after.png`

## Verification

- `node --check scripts/codex-worker.mjs` passed.
- `npx eslint scripts/codex-worker.mjs src/lib/codex-worker-client.ts` passed with existing worker unused-function warnings.
- Restarted `npm run codex-worker`.
- `POST /api/compose-prompt` returned `classifiedSources` plus sectioned `optimizedPrompt`.
- `POST /api/translate` still returned the existing `englishPrompt` response shape.
- `zsh -lc 'npm run build'` passed.

## Notes

This does not yet make Codex rewrite creative nodes through `codex exec`.
It prepares the boundary so the next step can send only `creative` and selected
reference context to Codex while reinserting `locked` constraints deterministically.
