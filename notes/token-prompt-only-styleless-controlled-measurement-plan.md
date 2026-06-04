# Token Prompt-Only Styleless Controlled Measurement Plan

Date: 2026-06-03

## Task

Re-run the same controlled prompt-only generation after removing the default hidden style injection from the no-reference path, then measure the new token floor.

## Context

- Previous no-reference measurement before the code change:
  - total: `21,474`
  - input: `21,330`
  - output: `144`
  - cached: `3,456`
- Current code change:
  - `buildImagePrompt()` now skips the default `Plus X` style when there are no explicit style/reference inputs.
- Expected effect:
  - `englishPrompt` should stay the same.
  - worker log `promptPreview` should no longer include the default style strings on the prompt-only path.

## Requirements

- Use the same prompt: `premium skincare serum bottle on clean studio background`
- Keep `ratio: 1:1` and `resolution: HD`
- Use no style references and no image mix references
- Send exactly one generation request
- Capture token usage, token breakdown, worker log evidence, and the generated file path
- Capture before and after full-screen screenshots

## Small Tasks

1. Capture a before screenshot.
2. Run one prompt-only generation through the current checkout worker.
3. Confirm the log no longer contains the default style strings in the prompt preview.
4. Record token usage and output file.
5. Capture an after screenshot.
6. Write the completion report and compare against `21,474`.

## Verification Commands

- `node --check scripts/codex-worker.mjs`
- `curl -sS --max-time 300 -H 'Content-Type: application/json' -d ... http://127.0.0.1:4318/generate`
- `ls -lh notes/screenshots/token-prompt-only-styleless-controlled-measurement-2026-06-03/`

## Artifacts

- `notes/token-prompt-only-styleless-controlled-measurement-plan.md`
- `notes/token-prompt-only-styleless-controlled-measurement-report.md`
- `notes/token-prompt-only-styleless-controlled-measurement-response.json`
- `notes/screenshots/token-prompt-only-styleless-controlled-measurement-2026-06-03/before-fullscreen.png`
- `notes/screenshots/token-prompt-only-styleless-controlled-measurement-2026-06-03/after-fullscreen.png`

## Pass Criteria

- Exactly one successful generation is used for the measurement.
- Worker log prompt preview no longer contains the hidden default style text.
- Token usage is captured and compared against `21,474`.

## Next Task Trigger

- If usage falls materially, keep the no-reference path styleless and update the handoff/report chain.
- If usage barely changes, the remaining cost is mostly backend image-generation overhead.
