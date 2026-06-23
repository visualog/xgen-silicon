# Background Node Recipe Reference Plan

Date: 2026-06-23

## Goal

Improve the xGen Background node so its presets work as meaningful linked recipes instead of independent parameter rows, and add background reference image support that can be analyzed and used during generation.

## Before Screenshot

- `notes/screenshots/background-node-recipe-reference-2026-06-23/before-fullscreen.png`

## Scope

- Reframe the Background node around recipe presets:
  - clean app icon studio
  - premium product studio
  - soft brand graphic
  - lifestyle interior
  - desk/workspace
  - abstract campaign
  - outdoor natural light
  - urban architecture
- Keep existing six controls as fine tuning under the selected recipe.
- Add a compact background reference image section inside the Background node.
- Reuse `StyleAddModal` object mode for upload/URL/analysis.
- Send connected background references into generation as background-role image references.
- Keep existing `backgroundPrompt` string compatibility.

## Non-Goals

- Do not add a separate Background Reference node.
- Do not install packages.
- Do not redesign unrelated nodes or the whole canvas.
- Do not remove the existing background prompt pipeline.

## Verification Plan

- ESLint touched frontend files.
- `node --check scripts/codex-worker.mjs`.
- `npm run build:next`.
- Verify local app route returns `HTTP 200`.
- Capture after screenshot and write completion report.
