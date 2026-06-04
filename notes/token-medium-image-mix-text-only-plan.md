# Token Medium Image Mix Text-Only Plan

Date: 2026-06-03

## Task

Reduce image-generation input tokens by making medium image mix references text-only by default while preserving strong style references and high-impact / layer-edit image mix attachments.

## Context

- Previous measurement: `notes/token-controlled-generation-measurement-report.md`
- Measured result: `32,773` total tokens, dominated by `32,567` input tokens.
- Runtime evidence from that measurement:
  - `styleReferenceCount: 1`
  - `attachedStyleReferenceCount: 1`
  - `imageMixCount: 1`
  - `attachedImageMixCount: 1`
  - `imageCount: 2`
- Next small task from the report: make medium image mix references text-only by default and verify attached image count drops for the controlled setup.

## Requirements

- Do not run another real image generation in this iteration.
- Keep strong style references attached.
- Keep high image mix references attached.
- Keep generated-layer / mask-edit references attached.
- Make medium image mix references text-only by default.
- Preserve skipped medium image mix references in `TEXT-ONLY MIX GUIDANCE`.
- Add or update dry-run/unit verification to prove the controlled setup would move from two attached image inputs to one.

## Small Tasks

1. Capture a before screenshot.
2. Update worker image mix attachment policy.
3. Update dry-run output to expose attached/skipped image mix counts and text-only guidance.
4. Update the existing style-reference verification script to assert medium image mix is text-only.
5. Run targeted syntax and dry-run verification.
6. Capture an after screenshot.
7. Write a completion report.

## Verification Commands

- `node --check scripts/codex-worker.mjs`
- `node scratch/verify-style-reference-generation.mjs`
- `node scripts/codex-worker.mjs --dry-run-style-reference`
- `ls -lh notes/screenshots/token-medium-image-mix-text-only-2026-06-03/`

## Artifacts

- `notes/token-medium-image-mix-text-only-plan.md`
- `notes/screenshots/token-medium-image-mix-text-only-2026-06-03/before-fullscreen.png`
- `notes/screenshots/token-medium-image-mix-text-only-2026-06-03/after-fullscreen.png`
- `notes/token-medium-image-mix-text-only-report.md`

## Pass Criteria

- `shouldAttachImageMixReference()` attaches layer-edit and high image mix references only.
- Dry-run reports:
  - `styleReferenceCount: 1`
  - `attachedStyleReferenceCount: 1`
  - `imageMixCount: 1`
  - `attachedImageMixCount: 0`
  - `textOnlyMixGuidance` containing the medium image mix prompt.
- Existing style-reference safeguards still pass.

## Next Task Trigger

After this policy change is verified, the next generation measurement should be a single approved controlled generation using the same setup as `notes/token-controlled-generation-measurement-report.md`, expecting image input count to drop from two to one.
