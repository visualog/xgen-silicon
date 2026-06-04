# Token Prompt-Only Styleless Controlled Measurement Report

Date: 2026-06-03

## Summary

Re-ran the controlled prompt-only generation after removing the default hidden style injection from the no-reference path.

Result: **21,341 total tokens**.

Compared with the prior prompt-only run of **21,474 tokens**, this is a small reduction of **133 tokens** (`-0.62%`).

The worker log confirms the hidden default style strings were removed from the actual model prompt preview, while the stored `englishPrompt` stayed unchanged.

## Code Change

- `scripts/codex-worker.mjs`
  - Added a `useDefaultStyle` option to `buildImagePrompt()`.
  - Disabled default style injection when the request has no explicit style, no style references, and no image mix references.

## Runtime

- Current checkout worker was started on `4318`.
- Packaged xGen processes remained on `3001/4317`.

## Controlled Input

- Prompt: premium skincare serum bottle on clean studio background
- Ratio: `1:1`
- Resolution: `HD`
- Style references: none
- Image mix references: none

## One-Generation Guard

One successful generation request was completed:

- Request artifact: `notes/token-prompt-only-styleless-controlled-measurement-response.json`
- HTTP result: `200`
- Thread ID: `019e8c47-f1c5-7e02-806a-976ed92d1043`
- Generated file: `/Users/im_018/.codex/generated_images/019e8c47-f1c5-7e02-806a-976ed92d1043/ig_040c526e527f9ecf016a1fd0e61a7881918cedc492771ff6d4.png`

## Token Usage

| Metric | Tokens |
|---|---:|
| Total | 21,341 |
| Input | 21,242 |
| Output | 99 |
| Cached input | 2,432 |

## Token Breakdown

| Stage | Input | Output | Cached | Total |
|---|---:|---:|---:|---:|
| 노드 설정 프롬프트 구성 | 0 | 0 | 0 | 0 |
| 최종 프롬프트 구성 | 0 | 0 | 0 | 0 |
| 최종 이미지 생성 | 21,242 | 99 | 2,432 | 21,341 |

## Comparison

| Measurement | Total | Input | Output | Cached |
|---|---:|---:|---:|---:|
| Previous no-reference run | 21,474 | 21,330 | 144 | 3,456 |
| Styleless prompt-only rerun | 21,341 | 21,242 | 99 | 2,432 |

Against the previous no-reference run:

- Total tokens: **-133**
- Input tokens: **-88**
- Output tokens: **-45**
- Cached input tokens: **-1,024**

## Reference Attachment Evidence

Captured from the worker log:

```text
styleReferenceCount: 0
attachedStyleReferenceCount: 0
imageMixCount: 0
attachedImageMixCount: 0
imageCount: 0
promptPreview: 'xGen image brief. Subject: premium skincare serum bottle on clean studio background Aspect ratio: 1:1 Resolution: HD Quality: premium brand image, coherent composition, high detail, no readable text, no logo, no watermark.'
turn.completed usage: input_tokens=21242 cached_input_tokens=2432 output_tokens=99
```

This verifies the hidden default style language is no longer present in the prompt-only path.

## Visual Quality Notes

The image remains a clean, coherent product shot:

- Centered serum bottle with neutral warm tone.
- No readable text, logo, or watermark.
- Composition is simple and closer to a baseline studio product render.

There is no obvious quality regression from removing the hidden style wrapper.

## Screenshots

- Before: `notes/screenshots/token-prompt-only-styleless-controlled-measurement-2026-06-03/before-fullscreen.png`
- After: `notes/screenshots/token-prompt-only-styleless-controlled-measurement-2026-06-03/after-fullscreen.png`

## Verification Commands

- `node --check scripts/codex-worker.mjs`: passed.
- `curl -sS --max-time 300 -H 'Content-Type: application/json' -d ... http://127.0.0.1:4318/generate`: `HTTP 200`.
- `ls -lh notes/screenshots/token-prompt-only-styleless-controlled-measurement-2026-06-03/`: confirmed before/after screenshots.
- `ls -lh /Users/im_018/.codex/generated_images/019e8c47-f1c5-7e02-806a-976ed92d1043/ig_040c526e527f9ecf016a1fd0e61a7881918cedc492771ff6d4.png`: generated PNG exists.

## Remaining Risk

The prompt-only floor is still high even after removing the hidden style wrapper. The remaining cost appears to be dominated by the image-generation backend itself.

## Next Small Task

Compare the prompt-only floor against the styled/reference-backed runs in the handoff notes and decide whether any further token work is worth doing versus stopping at the backend floor.
