# Character reference image mode plan

Date: 2026-06-17

## Goal

Let each character reference choose whether generation uses only the extracted text prompt or also attaches the uploaded image as an identity reference.

## Before screenshot

- `notes/screenshots/character-reference-image-mode-2026-06-17/before-fullscreen.png`

## Current behavior

- Character reference entries store an image and prompt, but generation only sends the selected entry prompt as `characterReference`.
- Style and image mix images have explicit attachment paths; character reference images do not.

## Implementation plan

1. Add a per-reference mode field that supports text-only and image-reference behavior.
2. Expose a compact mode selector on character reference entries.
3. Send active character reference images through `/api/generate` only when the mode requires image attachment.
4. Extend the worker to serialize attached character images and add character-specific identity instructions.
5. Verify with type/lint/build checks and after screenshot.

## Risks

- Image-reference mode increases image input token cost.
- Existing saved references may not have the new mode field, so normalization must default safely to text-only.
