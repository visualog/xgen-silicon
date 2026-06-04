# Token Usage Reduction Plan

Date: 2026-06-02

## Task

Reduce token consumption for node setting prompt generation, final prompt generation, and image generation while preserving output quality.

## Context

- Guidance document: `/Users/im_018/Documents/TCREI-auto-verification-loop.md`
- Current repo state is dirty with many existing feature changes.
- Main token hot path:
  - `src/app/page.tsx` auto-calls `/api/translate` after node changes.
  - `scripts/codex-worker.mjs` runs large `buildPromptWithCodex` prompts.
  - `generateImageWithCodex` duplicates node settings, style references, image mix references, and then calls separate metadata generation.

## Requirements

- Target current usage toward 10-20% of prior usage.
- Do not reduce image quality by removing key constraints.
- Prefer deterministic compaction and fewer calls over weaker prompts.
- Keep token usage reporting intact.
- Keep changes scoped to generation pipeline.

## Small Tasks

1. Stop automatic high-token Codex prompt generation for every node setting change.
2. Build compact execution prompts from structured node settings.
3. Remove duplicate final prompt sections and skip nonessential metadata Codex call.

## Verification Commands

- `npm run build:next`
- Optional app packaging if build passes: `npm run pack:mac`

## Artifacts

- Before screenshot: `notes/screenshots/token-usage-reduction-2026-06-02/before-fullscreen.png`
- Completion report: `notes/token-usage-reduction-report.md`

## Pass Criteria

- Build passes.
- Generation request still contains all connected settings.
- Token breakdown can show reduced or zero token use for prompt/metadata stages.
- Final image generation receives one compact, non-duplicated instruction.

## Next Task Trigger

If quality drops in visual comparison, restore only the specific missing rule as a compact deterministic instruction instead of reintroducing full Codex prompt rewriting.
