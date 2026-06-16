# Image Generation CLI Output Plan

Date: 2026-06-16

## Problem

Image generation currently fails with:

`생성된 이미지 파일을 ~/.codex/generated_images 에서 찾지 못했습니다.`

Direct `codex exec --json` verification shows the current Codex CLI completes the image generation turn without writing a new file under `~/.codex/generated_images/<thread_id>/`.

## Before Screenshot

- `notes/screenshots/image-generation-cli-output-2026-06-16/before.png`

## Plan

1. Inspect the current Codex JSONL session shape for image-generation output.
2. Update `scripts/codex-worker.mjs` so image generation accepts both legacy disk files and the current inline image result format.
3. Verify `/api/generate` returns a saved gallery URL instead of the missing-file error.
4. Capture an after screenshot and write a completion report.

## Validation

- `node --check scripts/codex-worker.mjs`
- `curl http://127.0.0.1:3002/api/generate` with a minimal prompt
