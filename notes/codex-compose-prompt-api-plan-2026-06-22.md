# Codex Compose Prompt API Plan

Date: 2026-06-22

## Scope

Implement Task 1 from `docs/plans/2026-06-22-codex-canvas-generation.md`.

Add a backend prompt composition API that converts the current node-style inputs
into a reviewable, image-generation-ready prompt without starting image
generation.

## Files

- `scripts/codex-worker.mjs`
- `src/lib/codex-worker-client.ts`
- `src/app/api/compose-prompt/route.ts`

## Before Screenshot

- `notes/screenshots/codex-compose-prompt-api-2026-06-22/before.png`

## Verification Plan

- Syntax-check the Codex worker.
- Build or targeted-check the Next route/client change.
- Restart the Codex worker and call both worker and Next API compose routes.
- Confirm `/api/translate` still returns the existing `englishPrompt` shape.
