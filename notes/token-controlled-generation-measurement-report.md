# Token Controlled Generation Measurement Report

Date: 2026-06-03

## Summary

Ran one controlled post-change image generation to measure token usage after the text prompt compaction, image input optimization, and reference attachment budget changes.

Result: **32,773 total tokens**, which is **1,137 tokens higher than the prior 31,636-token observation**. This does not meet the target of reducing usage to 10-20% of the observed baseline.

The generated image quality is acceptable for the requested product-advertising use case, so the current evidence points to attached image inputs or backend image-generation accounting as the next target rather than removing quality prompt constraints.

## Controlled Input

- Runtime: packaged xGen app
- App URL: `http://127.0.0.1:3001`
- Worker URL: `http://127.0.0.1:4317`
- Prompt: premium skincare serum bottle on clean studio background
- Ratio: `1:1`
- Resolution: `HD`
- Prebuilt compact prompt: used
- Style reference:
  - `pure style reference 001`
  - weight: `strong`
  - source: `/api/style-references/image/aurora-prompts/001-nttxjRjN0`
- Image mix reference:
  - `eye serum macro product reference`
  - role: `object`
  - weight: `medium`
  - source: `/api/style-references/image/aurora-prompts/002-MVDihRNcK`

## One-Generation Guard

One real generation request was completed successfully:

- Request artifact: `notes/token-controlled-generation-measurement-response.json`
- Thread ID: `019e8bd9-8763-79b1-9f4c-f484a6a51cd0`
- Generated file: `/Users/im_018/.codex/generated_images/019e8bd9-8763-79b1-9f4c-f484a6a51cd0/ig_070f8bca854a073d016a1fb4aa59f48191baf52b2a2a0904ce.png`
- Saved gallery image: `/Users/im_018/Pictures/xGen/2026-06-03_140123_-.png`

A first POST attempt failed before connecting to the server because the sandbox blocked local TCP access. It returned `HTTP 000`, did not create a response file, and did not reach the worker. The successful request above is the only completed generation.

## Token Usage

| Metric | Tokens |
|---|---:|
| Total | 32,773 |
| Input | 32,567 |
| Output | 206 |
| Cached input | 2,432 |

Compared with the prior observed **31,636** tokens:

- Absolute change: **+1,137 tokens**
- Relative change: **+3.59%**
- Target range if reduced to 10-20% of baseline: **3,164-6,327 tokens**
- Result: **not reduced; still far above target**

## Token Breakdown

| Stage | Input | Output | Cached | Total |
|---|---:|---:|---:|---:|
| 노드 설정 프롬프트 구성 | 0 | 0 | 0 | 0 |
| 최종 프롬프트 구성 | 0 | 0 | 0 | 0 |
| 최종 이미지 생성 | 32,567 | 206 | 2,432 | 32,773 |

## Attached Reference Counts

Captured from worker runtime log:

```text
styleReferenceCount: 1
attachedStyleReferenceCount: 1
imageMixCount: 1
attachedImageMixCount: 1
imageCount: 2
```

The token result is dominated by final image generation input tokens even with only two attached optimized references.

## Visual Quality Notes

The generated image is visually acceptable:

- Centered serum bottle product shot.
- Clean warm neutral studio background.
- Premium glossy glass and liquid detail.
- Soft commercial lighting and reflection.
- No readable text, logo, or watermark visible.
- No obvious quality drop from the compact prompt path based on prompt-fit inspection.

No exact prior baseline image was available in the current repo state, so quality comparison is against the controlled prompt and reference intent rather than a pixel-level before/after pair.

## Screenshots

- Before: `notes/screenshots/token-controlled-generation-measurement-2026-06-03/before-fullscreen.png`
- After: `notes/screenshots/token-controlled-generation-measurement-2026-06-03/after-fullscreen.png`

## Verification Commands

- `git status --short`: confirmed dirty worktree before measurement; unrelated existing changes were not reverted.
- `lsof -nP -iTCP -sTCP:LISTEN`: confirmed packaged xGen worker/app listeners.
- `curl -sS --max-time 5 -I http://127.0.0.1:3001/`: `HTTP/1.1 200 OK`.
- `curl -sS --max-time 300 -H 'Content-Type: application/json' -d ... http://127.0.0.1:3001/api/generate`: `HTTP 200`.
- `node --check scripts/codex-worker.mjs`: passed.
- `ls -lh notes/screenshots/token-controlled-generation-measurement-2026-06-03`: confirmed before/after screenshots.

## Remaining Risk

The controlled setup was comparable but not proven identical to the previous 31,636-token generation because the exact prior request payload was not present in the current repo state. The measurement still shows that the current two-reference path remains high-cost.

## Next Small Task

Make medium image mix references text-only by default, leaving only strong style references attached for the balanced path. Then run a dry-run or unit-level verification to confirm:

- medium image mix is still represented as `TEXT-ONLY MIX GUIDANCE`
- attached image count drops from 2 to 1 for this controlled setup
- strong style references remain attached

Only after that policy change should another single controlled generation be approved to measure whether input tokens fall materially.
