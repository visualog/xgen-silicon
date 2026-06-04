# Token Medium Image Mix Text-Only Report

Date: 2026-06-03

## Summary

Implemented the next token-reduction step from `notes/token-controlled-generation-measurement-report.md`: medium image mix references are now text-only by default.

The controlled dry-run now proves the expected attachment reduction:

- Strong style reference remains attached.
- Medium image mix reference is preserved as `TEXT-ONLY MIX GUIDANCE`.
- Attached image mix count drops from `1` to `0`.
- For the measured controlled setup, total attached image inputs should drop from `2` to `1` before the next real generation.

No real image generation was run in this iteration.

## Changes

- `scripts/codex-worker.mjs`
  - `shouldAttachImageMixReference()` now attaches only:
    - generated-layer / mask-edit references
    - `high` weight image mix references
  - `medium` image mix references now fall into `skippedImageMixItems`.
  - Dry-run output now includes:
    - `attachedStyleReferenceCount`
    - `attachedImageMixCount`
    - `textOnlyStyleGuidance`
    - `textOnlyMixGuidance`
  - Dry-run instruction now renders skipped medium image mix references under `TEXT-ONLY MIX GUIDANCE`.

- `scratch/verify-style-reference-generation.mjs`
  - Added assertions that the dry-run keeps one strong style reference attached.
  - Added assertions that medium image mix is not attached.
  - Added assertions that medium image mix remains represented as text-only guidance.

## Verification

- `node --check scripts/codex-worker.mjs`: passed.
- `node scripts/codex-worker.mjs --dry-run-style-reference`: passed and reported:

```json
{
  "styleReferenceCount": 1,
  "attachedStyleReferenceCount": 1,
  "imageMixCount": 1,
  "attachedImageMixCount": 0,
  "textOnlyMixGuidance": "TEXT-ONLY MIX GUIDANCE: 1) palette, medium: Use only color mood from this mix reference."
}
```

- `node scratch/verify-style-reference-generation.mjs`: passed with `28` checks.

## Screenshots

- Before: `notes/screenshots/token-medium-image-mix-text-only-2026-06-03/before-fullscreen.png`
- After: `notes/screenshots/token-medium-image-mix-text-only-2026-06-03/after-fullscreen.png`

## Remaining Risks

- This iteration verifies attachment policy only; it does not measure a new real generation token count.
- A medium image mix reference now influences output through text guidance only, so fine-grained visual transfer may be weaker for medium references.
- High image mix and layer-edit references remain image-attached to protect quality-critical cases.

## Next Small Task

Run one approved controlled generation using the same request shape as `notes/token-controlled-generation-measurement-report.md` and compare token usage against:

- previous post-change measurement: `32,773` total tokens
- original observed baseline: `31,636` total tokens

Expected runtime evidence for that next measurement:

- `styleReferenceCount: 1`
- `attachedStyleReferenceCount: 1`
- `imageMixCount: 1`
- `attachedImageMixCount: 0`
- `imageCount: 1`
