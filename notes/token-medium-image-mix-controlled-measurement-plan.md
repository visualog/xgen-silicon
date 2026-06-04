# Token Medium Image Mix Controlled Measurement Plan

Date: 2026-06-03

## Task

Run exactly one controlled generation after the medium image mix text-only policy change and measure whether attached image inputs drop from two to one.

## Context

- Previous measurement report: `notes/token-controlled-generation-measurement-report.md`
- Policy change report: `notes/token-medium-image-mix-text-only-report.md`
- Previous measured usage:
  - total: `32,773`
  - input: `32,567`
  - output: `206`
  - cached: `2,432`
  - attached references: style `1/1`, image mix `1/1`, imageCount `2`
- New expected reference evidence:
  - `styleReferenceCount: 1`
  - `attachedStyleReferenceCount: 1`
  - `imageMixCount: 1`
  - `attachedImageMixCount: 0`
  - `imageCount: 1`

## Runtime Choice

Existing `xGen` processes are already listening on `3001/4317`. Because the policy change is in the current checkout's `scripts/codex-worker.mjs`, the measurement must use the current worker file rather than assuming packaged resources were rebuilt.

Plan:

- Leave existing `xGen` processes untouched.
- Start current checkout worker on a separate port.
- Use the already running app only as a static source for checked-in style reference image URLs.
- Call the current worker `/generate` endpoint directly exactly once.

## Requirements

- Capture a full-screen before screenshot.
- Run one real generation only.
- Use the same controlled prompt and references as the previous measurement.
- Record:
  - total/input/output/cached tokens
  - token breakdown rows
  - attached reference counts from current worker logs
  - generated image path and thread id
  - visual quality notes
- Capture a full-screen after screenshot.
- Save the report at `notes/token-medium-image-mix-controlled-measurement-report.md`.

## Small Tasks

1. Start current checkout worker on an alternate port.
2. Verify the reference image URLs are reachable from the running app.
3. POST the controlled payload once to the current worker.
4. Capture worker log evidence for attached counts.
5. Inspect token usage and generated image quality.
6. Capture after screenshot.
7. Write the report and define the next task.

## Verification Commands

- `node --check scripts/codex-worker.mjs`
- `node scratch/verify-style-reference-generation.mjs`
- `curl -sS --max-time 5 -I http://127.0.0.1:3001/api/style-references/image/aurora-prompts/001-nttxjRjN0`
- `curl -sS --max-time 300 -H 'Content-Type: application/json' -d ... http://127.0.0.1:<worker-port>/generate`
- `ls -lh notes/screenshots/token-medium-image-mix-controlled-measurement-2026-06-03/`

## Artifacts

- `notes/token-medium-image-mix-controlled-measurement-plan.md`
- `notes/token-medium-image-mix-controlled-measurement-response.json`
- `notes/token-medium-image-mix-controlled-measurement-report.md`
- `notes/screenshots/token-medium-image-mix-controlled-measurement-2026-06-03/before-fullscreen.png`
- `notes/screenshots/token-medium-image-mix-controlled-measurement-2026-06-03/after-fullscreen.png`

## Pass Criteria

- Exactly one successful generation is used for the measurement.
- Worker log proves `attachedImageMixCount: 0`.
- Worker log proves `imageCount: 1`.
- Response includes token usage and token breakdown.
- Result is compared against both `32,773` and `31,636`.

## Next Task Trigger

- If usage is still far above target with one image input, run a no-reference controlled measurement or investigate backend fixed image-generation overhead.
- If usage drops materially, keep medium image mix text-only and decide whether high image mix should become opt-in.
