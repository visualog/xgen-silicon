# Token Controlled Generation Measurement Plan

Date: 2026-06-03

## Task

Run exactly one controlled BrandGen image generation after the token-reference-budget changes and measure post-change token usage against the previously observed 31,636 tokens.

## Context

- Operating method: `/Users/im_018/Documents/TCREI-auto-verification-loop.md`
- Handoff: `notes/token-reduction-next-session-handoff.md`
- Prior reports:
  - `notes/generation-token-usage-report.md`
  - `notes/token-usage-reduction-report.md`
  - `notes/token-image-input-optimization-report.md`
  - `notes/token-reference-budget-report.md`
- Current repo state is authoritative.
- The packaged app ports from the prior reports are the target runtime:
  - Next app: `127.0.0.1:3001`
  - worker: `127.0.0.1:4317`

## Requirements

- Capture a full-screen before screenshot before generation.
- Run one real image generation only.
- Use the same or maximally similar conditions available from current repo state.
- Record:
  - total/input/output/cached tokens
  - token breakdown rows
  - style reference count and attached style reference count
  - image mix count and attached image mix count
  - visual quality notes
- Capture a full-screen after screenshot.
- Save the final report at `notes/token-controlled-generation-measurement-report.md`.
- Define the next smallest task from the measured result.

## Small Tasks

1. Start or reuse the packaged app runtime without creating duplicate app servers.
2. Capture `before-fullscreen.png`.
3. Call `/api/generate` once with a controlled prompt and a small reference set:
   - one strong style reference from the checked-in style library
   - one medium image mix reference from the checked-in style library
4. Parse the API response for token usage and generated image path.
5. Capture worker debug lines for attached reference counts.
6. Visually inspect the generated image and compare against expected prompt/style constraints.
7. Capture `after-fullscreen.png`.
8. Write the report.

## Verification Commands

- `lsof -nP -iTCP -sTCP:LISTEN`
- `curl -s --max-time 5 -I http://127.0.0.1:3001/`
- `curl -s --max-time 300 -X POST http://127.0.0.1:3001/api/generate ...`
- `node --check scripts/codex-worker.mjs`
- `ls -l notes/screenshots/token-controlled-generation-measurement-2026-06-03/`

## Artifacts

- `notes/token-controlled-generation-measurement-plan.md`
- `notes/screenshots/token-controlled-generation-measurement-2026-06-03/before-fullscreen.png`
- `notes/screenshots/token-controlled-generation-measurement-2026-06-03/after-fullscreen.png`
- `notes/token-controlled-generation-measurement-report.md`

## Pass Criteria

- Exactly one successful real generation is used for the measurement.
- The response includes token usage or the report records why usage was missing.
- Attached reference counts are captured from runtime evidence.
- The result is compared against 31,636 tokens.
- A next small task is defined from the measurement.

## Next Task Trigger

- If input tokens dominate, reduce attached references further before changing prompt text.
- If output tokens dominate, investigate image backend token accounting and cost display rather than deleting quality constraints.
- If quality drops, restore only the missing compact guard or one reference category.
