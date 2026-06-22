# Codex Prompt Review Panel Plan

Date: 2026-06-22

## Scope

Implement Task 2 from `docs/plans/2026-06-22-codex-canvas-generation.md`.

Add a compact prompt review panel to the output node so connected node settings
can be composed into an optimized image prompt, reviewed, edited, copied, and
used for generation.

## Files

- `src/app/page.tsx`
- `src/components/nodes/OutputNode.tsx`

## Before Screenshot

- `notes/screenshots/codex-prompt-review-panel-2026-06-22/before.png`

## Verification Plan

- Compose prompt through `/api/compose-prompt` from the output node.
- Confirm the optimized prompt textarea fills and can be edited.
- Confirm image generation uses the edited optimized prompt as `prebuiltPrompt`.
- Run targeted lint on changed app files and build with the arm64 login shell.
