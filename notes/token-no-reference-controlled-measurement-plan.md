# Token No-Reference Controlled Measurement Plan

Date: 2026-06-03

## Task

Run one controlled generation with the same prompt, ratio, and resolution, but with no style references and no image mix references, to isolate the remaining cost of the single attached strong style image from the previous measurement.

## Context

- Previous measurement: `notes/token-medium-image-mix-controlled-measurement-report.md`
- Last successful result:
  - total: `22,047`
  - input: `21,836`
  - output: `211`
  - cached: `3,456`
  - attached style refs: `1`
  - attached image mix refs: `0`
  - attached images total: `1`
- This task removes the remaining attached style reference so the next measurement can show the cost of prompt-only generation.

## Requirements

- Use the same prompt: `premium skincare serum bottle on clean studio background`
- Keep `ratio: 1:1` and `resolution: HD`
- Send exactly one generation request
- Do not attach any style reference images
- Do not attach any image mix images
- Record token usage, token breakdown, thread id, generated file path, and a short visual-quality note
- Capture before and after full-screen screenshots

## Small Tasks

1. Capture a before screenshot.
2. Run one no-reference generation through the current checkout worker.
3. Confirm the worker logs show `attachedStyleReferenceCount: 0`, `attachedImageMixCount: 0`, and `imageCount: 0` or the equivalent prompt-only count path.
4. Record the token usage and output file.
5. Capture an after screenshot.
6. Write the completion report and compare against `22,047`.

## Verification Commands

- `node --check scripts/codex-worker.mjs`
- `curl -sS --max-time 300 -H 'Content-Type: application/json' -d ... http://127.0.0.1:4318/generate`
- `ls -lh notes/screenshots/token-no-reference-controlled-measurement-2026-06-03/`

## Artifacts

- `notes/token-no-reference-controlled-measurement-plan.md`
- `notes/token-no-reference-controlled-measurement-report.md`
- `notes/token-no-reference-controlled-measurement-response.json`
- `notes/screenshots/token-no-reference-controlled-measurement-2026-06-03/before-fullscreen.png`
- `notes/screenshots/token-no-reference-controlled-measurement-2026-06-03/after-fullscreen.png`

## Pass Criteria

- Exactly one successful generation is used for the measurement.
- Token usage is captured in the response artifact.
- Worker logs confirm no attached style or image mix references were used.
- The report compares the result against `22,047`.

## Next Task Trigger

- If the prompt-only path is still above target, investigate fixed image-generation overhead versus attached image cost.
- If token usage drops materially, keep the current reference policy and record the practical floor.
