# Token No-Reference Controlled Measurement Report

Date: 2026-06-03

## Summary

Ran one controlled generation with the same prompt, ratio, and resolution as the prior measurements, but with no style references and no image mix references.

Result: **21,474 total tokens**.

Compared with the previous `22,047`-token run, prompt-only generation lowered usage by **573 tokens** (`-2.60%`). The gap is small, which suggests the remaining cost is dominated by the fixed image-generation path rather than the single attached strong style reference alone.

## Runtime

- Current checkout worker was started on `4318`.
- Packaged xGen processes remained on `3001/4317`.
- The successful request used one direct `POST` to `http://127.0.0.1:4318/generate`.

## Controlled Input

- Prompt: premium skincare serum bottle on clean studio background
- Ratio: `1:1`
- Resolution: `HD`
- Style references: none
- Image mix references: none

## One-Generation Guard

One successful generation request was completed:

- Request artifact: `notes/token-no-reference-controlled-measurement-response.json`
- HTTP result: `200`
- Thread ID: `019e8c41-d194-7fb1-a284-afe6944563e5`
- Generated file: `/Users/im_018/.codex/generated_images/019e8c41-d194-7fb1-a284-afe6944563e5/ig_0d94a9c37c2346da016a1fcf55db908190ac2abeecf75cbc94.png`

## Token Usage

| Metric | Tokens |
|---|---:|
| Total | 21,474 |
| Input | 21,330 |
| Output | 144 |
| Cached input | 3,456 |

## Token Breakdown

| Stage | Input | Output | Cached | Total |
|---|---:|---:|---:|---:|
| 노드 설정 프롬프트 구성 | 0 | 0 | 0 | 0 |
| 최종 프롬프트 구성 | 0 | 0 | 0 | 0 |
| 최종 이미지 생성 | 21,330 | 144 | 3,456 | 21,474 |

## Comparison

| Measurement | Attached Images | Total | Input | Output | Cached |
|---|---:|---:|---:|---:|---:|
| Medium image mix text-only rerun | 1 | 22,047 | 21,836 | 211 | 3,456 |
| No-reference rerun | 0 | 21,474 | 21,330 | 144 | 3,456 |

Against the previous run:

- Total tokens: **-573**
- Input tokens: **-506**
- Output tokens: **-67**
- Cached input tokens: **0**

Interpretation:

- Removing the last attached strong style image helped only slightly.
- The cost floor is still high even when no images are attached.
- The current prompt and image-generation path itself appear to account for most of the usage.

## Reference Attachment Evidence

Captured from the worker log:

```text
styleReferenceCount: 0
attachedStyleReferenceCount: 0
imageMixCount: 0
attachedImageMixCount: 0
imageCount: 0
turn.completed usage: input_tokens=21330 cached_input_tokens=3456 output_tokens=144
```

## Visual Quality Notes

The generated image is coherent and usable:

- Centered serum bottle with clean proportions.
- Warm neutral editorial look rather than the earlier purple/yellow style-heavy result.
- No readable text, logo, or watermark.
- Composition is simpler and feels closer to a baseline product shot.

Quality tradeoff:

- Prompt-only output is calmer and more neutral than the previous style-heavy version.
- The lack of reference images makes the image less distinctive, but not degraded in structure.

## Screenshots

- Before: `notes/screenshots/token-no-reference-controlled-measurement-2026-06-03/before-fullscreen.png`
- After: `notes/screenshots/token-no-reference-controlled-measurement-2026-06-03/after-fullscreen.png`

## Verification Commands

- `node --check scripts/codex-worker.mjs`: passed.
- `curl -sS --max-time 300 -H 'Content-Type: application/json' -d ... http://127.0.0.1:4318/generate`: `HTTP 200`.
- `ls -lh notes/screenshots/token-no-reference-controlled-measurement-2026-06-03/`: confirmed before/after screenshots.
- `ls -lh /Users/im_018/.codex/generated_images/019e8c41-d194-7fb1-a284-afe6944563e5/ig_0d94a9c37c2346da016a1fcf55db908190ac2abeecf75cbc94.png`: generated PNG exists.

## Remaining Risk

The prompt-only path is still expensive, so further improvement will likely need changes in the image-generation backend or model invocation contract rather than more prompt trimming.

## Next Small Task

Inspect whether the prompt assembly path still injects any hidden style language for the prompt-only path, then compare that with the generated `englishPrompt` to see whether the remaining overhead is purely backend-side.
