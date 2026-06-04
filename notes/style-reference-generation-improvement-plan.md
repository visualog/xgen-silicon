# Style Reference Generation Improvement Plan

- Date: 2026-05-30
- Goal source: `notes/style-reference-generation-improvement-meta-prompt.md`
- Screenshot folder: `notes/screenshots/style-reference-generation-improvement-2026-05-30/`
- Before screenshots:
  - `before-fullscreen.png`
  - `before-app-open.png`

## Problem Summary

The current style reference node stores `StyleEntry.imageUrl`, but the generation path only sends `activeStyle.prompt` as `style`.

This means the UI behaves like an image reference system while generation behaves like a text-only style prompt. The problem is especially serious for library entries tagged `needs-reference-image`, because their prompt explicitly depends on an accompanying reference image.

## Current Code Path

```text
StyleAddModal -> StyleEntry { id, imageUrl, prompt, label }
StyleNode -> activeStyleId selects one StyleEntry
page.tsx -> /api/generate sends style: activeStyle?.prompt
codex-worker-client.ts -> generateViaWorker forwards payload
scripts/codex-worker.mjs -> attaches imageMixImages only
```

## Implementation Plan

1. Extend `StyleEntry` with style influence metadata.
   - Add `weight: "subtle" | "medium" | "strong"`.
   - Keep default as `medium`.
   - Preserve existing saved entries by normalizing missing values to `medium`.

2. Make the style node truthful.
   - Clearly show only the active style is used for generation.
   - Add a compact influence selector on each style card.
   - Keep inactive style entries as stored references, not generation inputs.

3. Pass active style image into generation.
   - Add `styleReferenceImages` to the `/api/generate` payload.
   - Include `imageUrl`, `prompt`, `label`, `weight`, and `mode: "style-only"` for the active style when connected.

4. Update API and worker client types.
   - Forward `styleReferenceImages` from the route to the worker.
   - Keep existing `imageMixImages`, element sheets, character references, and object references unchanged.

5. Update worker generation.
   - Accept `styleReferenceImages`.
   - Resolve each image via existing `imageInputToBuffer`.
   - Attach each style image to `codex exec` as a temp file.
   - Include style-only guard text in the final instruction.
   - Include influence labels in prompt text.

6. Improve output prompt truthfulness.
   - Add visible English/Korean prompt context that states:
     - active style reference image name,
     - style influence,
     - style-only guard.

7. Add deterministic verification.
   - Add a small dry-run helper that exercises worker prompt assembly without generating an image.
   - Verify attached image count, style-only guard, style reference image labels, and existing image mix behavior.

## Verification Plan

- Run deterministic worker dry-run verification.
- Run `npm run build:next`.
- Capture after screenshots showing active style and influence UI.
- Create `notes/style-reference-generation-improvement-report.md`.

## Known Constraints

- Do not bundle the full `style-references/` directory into Electron.
- Do not replace character/object reference behavior.
- Do not build a custom IPAdapter/ControlNet backend in this pass.
