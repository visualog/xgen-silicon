# Prompt Panel Review Console Plan - 2026-06-22

## Scope

- Improve the current OutputNode prompt panel UI/UX.
- Reframe the panel as an input brief plus execution-prompt review console.
- Reduce ambiguity between `프롬프트 생성`, `생성에 사용`, and `이미지 생성`.

## Design Direction

- Use xGen service UI defaults: Luma with a slightly compact Rhea rhythm for the narrow node panel.
- Keep the final primary action as `이미지 생성`.
- Make optimized prompt review feel like the actual execution prompt, not a secondary text box.

## Before Evidence

- Screenshot: `notes/screenshots/prompt-panel-review-console-2026-06-22/before.png`

## Files To Change

- `src/components/nodes/OutputNode.tsx`

## Expected UX Changes

- Rename the first prompt section to `입력 브리프`.
- Rename optimized prompt section to `실행 프롬프트`.
- Change `프롬프트 생성` action to `AI로 다듬기`.
- Remove the visible `생성에 사용` decision button and replace it with a clear status line.
- Keep copy and image generation actions available.
- Preserve existing generation behavior, where optimized prompt is used automatically when present.

## Verification

- Targeted lint for the changed component.
- Browser visual check on `http://localhost:3000/`.
- Confirm optimized prompt textarea remains editable and copy/generate actions are available.
