# Output Settings Ratio and HD Label Report

- Date: 2026-05-30
- Plan: `notes/output-settings-ratio-hd-plan.md`
- Screenshot folder: `notes/screenshots/output-settings-ratio-hd-2026-05-30/`

## Result

Completed.

## Changes

- `src/components/nodes/OutputSettingsNode.tsx`
  - Added `4:3` landscape ratio button.
  - Added `3:4` portrait ratio button, titled as `4:3 세로형`.
  - Changed the HD resolution button from a monitor icon to visible `HD` text.

- `src/components/nodes/RatioNode.tsx`
  - Added matching `4:3` and `3:4` ratio buttons for the legacy/separate ratio node.

## Verification

```bash
rg -n "4:3 가로형|4:3 세로형|data\\.setRatio\\(\\\"4:3\\\"\\)|data\\.setRatio\\(\\\"3:4\\\"\\)|value === \\\"HD\\\" \\? <Monitor|HD" src/components/nodes/OutputSettingsNode.tsx src/components/nodes/RatioNode.tsx
```

Result: confirmed `4:3`, `3:4`, and text `HD` rendering. No `Monitor`-based HD rendering remains in `OutputSettingsNode`.

```bash
npm run build:next
```

Result: passed. Next.js compiled successfully, TypeScript completed, and 19 static pages were generated.

## Screenshots

- Before: `before-fullscreen.png`
- After: `after-fullscreen.png`
