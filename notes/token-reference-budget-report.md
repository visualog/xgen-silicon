# Token Reference Budget Report

Date: 2026-06-03

## Summary

Continued the token reduction task after the reported 31,636-token generation. This iteration adds a reference attachment budget so low-impact references stop being attached as image inputs and are instead preserved as compact text guidance.

## Changes

- `scripts/codex-worker.mjs`
  - Added reference attachment policy.
  - Strong style references remain attached as images.
  - Medium/subtle style references are skipped as image inputs when they already have prompt guidance.
  - Medium/high image mix references remain attached.
  - Low-impact image mix references become text-only guidance.
  - Generated-layer / mask-edit references remain attached because they are spatial edit sources.
  - Attached style refs now use smaller limits:
    - strong style: max 640px
    - fallback style: max 512px
  - Attached image mix refs now use smaller limits:
    - generated layer / mask edit: max 1024px
    - high: max 768px
    - medium: max 640px
  - Skipped references are still included in the final instruction as `TEXT-ONLY STYLE GUIDANCE` or `TEXT-ONLY MIX GUIDANCE`.

- `package.json`
  - Added `sharp` as a direct dependency.

- `package-lock.json`
  - Added `sharp` to the root dependency list.

## Expected Token Impact

- If the previous 31,636-token sample used one or more medium/subtle style references, those image inputs should now disappear.
- Low-impact image mix references should no longer add image input tokens.
- Remaining attached references are smaller than the previous iteration.
- Quality-critical cases remain protected:
  - strong visual style refs still attach
  - medium/high image mix refs still attach
  - mask/generated-layer refs still attach

## Verification

- `node --check scripts/codex-worker.mjs`: passed.
- `npm run build:next`: passed.
- `npm run pack:mac`: passed.
- Electron builder packaged `sharp@0.34.5`.
- Packaged resources refreshed:
  - `release/mac/xGen.app/Contents/Resources/next/server.js`: 2026-06-03 13:10:45
- Direct packaged app run:
  - worker started on `127.0.0.1:4317`
  - Next server started on `127.0.0.1:3001`
  - `curl -s --max-time 5 -I http://127.0.0.1:3001/`: `HTTP/1.1 200 OK`

## Screenshots

- Before: `notes/screenshots/token-reference-budget-2026-06-03/before-fullscreen.png`
- After: `notes/screenshots/token-reference-budget-2026-06-03/after-fullscreen.png`

## Runtime Note

Opening the packaged app repeatedly with `open -n` left several old xGen processes around. They were cleaned up after verification, so no xGen app server was left running at the end of this iteration.

## Remaining Risks

- A new real generation is still needed to measure the exact reduction from 31,636 tokens.
- If quality drops for medium style references, the next iteration should selectively re-attach only the active style reference at max 512px instead of re-attaching every reference.
- If token usage remains high, the next likely driver is final model output accounting or hidden overhead from the Codex image-generation backend rather than our prompt/reference payload.

## Next Task

Run the same generation again and record:

- total tokens
- input tokens
- output tokens
- cached input tokens
- attached reference count
- visual quality delta
