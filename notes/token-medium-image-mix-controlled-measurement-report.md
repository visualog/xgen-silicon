# Token Medium Image Mix Controlled Measurement Report

Date: 2026-06-03

## Summary

Retried the controlled post-policy generation exactly once after the Codex usage reset.

Result: **22,047 total tokens** with one attached image input:

- `styleReferenceCount: 1`
- `attachedStyleReferenceCount: 1`
- `imageMixCount: 1`
- `attachedImageMixCount: 0`
- `imageCount: 1`

The medium image mix text-only policy materially reduced token usage versus the prior two-image controlled run, but the result is still far above the 10-20% target range.

## Runtime

- Existing packaged xGen processes remained on `3001/4317`.
- Current checkout worker was started separately:
  - `BRANDGEN_CODEX_WORKER_PORT=4318`
  - `BRANDGEN_APP_URL=http://127.0.0.1:3001`
- The running app on `3001` served the checked-in style reference image URLs.
- The successful measurement used one direct `POST` to `http://127.0.0.1:4318/generate`.

## Controlled Input

Same controlled setup as the previous measurement:

- Prompt: premium skincare serum bottle on clean studio background
- Ratio: `1:1`
- Resolution: `HD`
- Strong style reference:
  - `http://127.0.0.1:3001/api/style-references/image/aurora-prompts/001-nttxjRjN0`
- Medium image mix reference:
  - `http://127.0.0.1:3001/api/style-references/image/aurora-prompts/002-MVDihRNcK`
  - represented as text-only mix guidance, not attached as an image

## One-Generation Guard

One successful generation request was completed after the usage reset:

- Request artifact: `notes/token-medium-image-mix-controlled-measurement-response.json`
- HTTP result: `200`
- Thread ID: `019e8c39-9b58-7010-bf77-a9fb47b0358a`
- Generated file: `/Users/im_018/.codex/generated_images/019e8c39-9b58-7010-bf77-a9fb47b0358a/ig_04ca28cbd8ab2d0e016a1fcd3b11c48191a48d52758475e981.png`

Earlier in the same task, a pre-reset request reached the worker but failed with Codex usage limits. That attempt returned `HTTP 500` and no token usage. It is preserved as blocked evidence, but the measurement above is the only successful post-reset generation used for token comparison.

## Token Usage

| Metric | Tokens |
|---|---:|
| Total | 22,047 |
| Input | 21,836 |
| Output | 211 |
| Cached input | 3,456 |

## Token Breakdown

| Stage | Input | Output | Cached | Total |
|---|---:|---:|---:|---:|
| 노드 설정 프롬프트 구성 | 0 | 0 | 0 | 0 |
| 최종 프롬프트 구성 | 0 | 0 | 0 | 0 |
| 최종 이미지 생성 | 21,836 | 211 | 3,456 | 22,047 |

## Comparison

| Measurement | Attached Images | Total | Input | Output | Cached |
|---|---:|---:|---:|---:|---:|
| Original observed baseline | unknown | 31,636 | unknown | unknown | unknown |
| Previous controlled measurement | 2 | 32,773 | 32,567 | 206 | 2,432 |
| Medium image mix text-only rerun | 1 | 22,047 | 21,836 | 211 | 3,456 |

Against the previous controlled measurement:

- Total tokens: **-10,726** (`-32.73%`)
- Input tokens: **-10,731** (`-32.95%`)
- Output tokens: **+5**
- Cached input tokens: **+1,024**

Against the original 31,636-token observation:

- Total tokens: **-9,589** (`-30.31%`)
- Result is still **69.69%** of the observed baseline.
- Target range for 10-20% of baseline remains **3,164-6,327 tokens**.
- Current total is **3.48x** the upper target bound.

## Reference Attachment Evidence

Captured from the current checkout worker logs:

```text
styleReferenceCount: 1
attachedStyleReferenceCount: 1
imageMixCount: 1
attachedImageMixCount: 0
imageCount: 1
turn.completed usage: input_tokens=21836 cached_input_tokens=3456 output_tokens=211
```

This confirms the medium image mix policy reduced the controlled path from two attached image inputs to one attached image input.

## Visual Quality Notes

The generated image is usable and coherent:

- Clear centered serum dropper bottle.
- Good glass/liquid rendering and product silhouette.
- No readable text, logo, or watermark.
- Strong style-reference influence is visible: vivid purple/yellow palette, soft illustration texture, and graphic studio shapes.

Quality tradeoff:

- The object guidance survived without attaching the medium image mix reference.
- Prompt fit is slightly less neutral than the previous warm clean-studio product shot because the strong style reference dominates the background and palette.
- No obvious collapse or composition error from making the image mix text-only.

## Screenshots

- Original before: `notes/screenshots/token-medium-image-mix-controlled-measurement-2026-06-03/before-fullscreen.png`
- Usage-limit after: `notes/screenshots/token-medium-image-mix-controlled-measurement-2026-06-03/after-fullscreen.png`
- Rerun before: `notes/screenshots/token-medium-image-mix-controlled-measurement-2026-06-03/before-fullscreen-rerun.png`
- Rerun after: `notes/screenshots/token-medium-image-mix-controlled-measurement-2026-06-03/after-fullscreen-rerun.png`

## Verification Commands

- `git status --short`: confirmed dirty worktree before measurement; unrelated existing changes were not reverted.
- `node --check scripts/codex-worker.mjs`: passed.
- `curl -sS --max-time 5 -I http://127.0.0.1:3001/api/style-references/image/aurora-prompts/001-nttxjRjN0`: `HTTP/1.1 200 OK`.
- `curl -sS --max-time 5 -I http://127.0.0.1:3001/api/style-references/image/aurora-prompts/002-MVDihRNcK`: `HTTP/1.1 200 OK`.
- `curl -sS --max-time 300 -H 'Content-Type: application/json' -d ... http://127.0.0.1:4318/generate`: `HTTP 200`.
- `ls -lh notes/screenshots/token-medium-image-mix-controlled-measurement-2026-06-03`: confirmed before/after screenshots.
- `ls -lh /Users/im_018/.codex/generated_images/019e8c39-9b58-7010-bf77-a9fb47b0358a/ig_04ca28cbd8ab2d0e016a1fcd3b11c48191a48d52758475e981.png`: generated PNG exists.

## Remaining Risk

The medium image mix text-only change helps, but image generation remains expensive with a single attached strong style reference. The remaining high usage is likely tied to attached image input accounting and fixed image-generation overhead rather than text prompt size alone.

## Next Small Task

Run one no-reference or text-only-only controlled measurement with the same prompt, ratio, and resolution. Compare it against this 22,047-token result to isolate the remaining cost of the one attached strong style reference.
