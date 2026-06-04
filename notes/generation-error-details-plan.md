# Generation Error Details Plan

Date: 2026-06-02

## Goal

Fix the current "생성 실패" behavior so BrandGen shows the actual failure reason, and address the likely cause introduced by relative image URLs in layer/mask/reference generation flows.

## Before Screenshot

- `notes/screenshots/generation-error-details-2026-06-02/before-fullscreen.png`

## Diagnosis

The UI currently treats generation failure as a boolean. `/api/generate` returns an `error` string, but `src/app/page.tsx` only calls `setError(true)`, so the canvas can only show `생성 실패`.

The likely runtime cause is relative image URLs. The worker resolves paths beginning with `/` against `BRANDGEN_APP_URL || http://127.0.0.1:3000`. If the app is running on another port, or in Electron, attached layer/style/mix images can fail with "이미지 URL을 가져오지 못했습니다."

## Plan

1. Normalize relative image URLs in `/api/generate` using the current request origin before sending them to the worker.
2. Store a generation error message in editor state and generated snapshots.
3. Pass that message to `CanvasNode`.
4. Render the specific error reason instead of only `생성 실패`.
5. Verify with `npm run build:next`.

## Expected Result

When generation fails, the user sees an actionable reason such as:

- `Codex worker에 연결할 수 없습니다...`
- `이미지 URL을 가져오지 못했습니다. (404)`
- `Codex CLI 이미지 생성 실패...`

## Rollback

The earlier checkpoint remains available:

- `stash@{0}`
- `checkpoint-before-figma-weave-implementation-2026-06-01`
