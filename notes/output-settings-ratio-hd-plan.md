# Output Settings Ratio and HD Label Plan

- Date: 2026-05-30
- Screenshot folder: `notes/screenshots/output-settings-ratio-hd-2026-05-30/`
- Before screenshot: `before-fullscreen.png`

## Request

- Add `4:3` landscape ratio.
- Add `4:3` portrait ratio, represented in generation state as `3:4`.
- Change the HD resolution control from an icon to the visible text `HD`.

## Scope

- Primary target: `src/components/nodes/OutputSettingsNode.tsx`
- Compatibility target: `src/components/nodes/RatioNode.tsx`

The generation path already supports `4:3` and `3:4` in the worker pixel-size mapping, so this pass only needs UI control updates.

## Verification

- Confirm source contains both ratio options.
- Confirm HD renders as text.
- Run `npm run build:next`.
- Capture after screenshot.
