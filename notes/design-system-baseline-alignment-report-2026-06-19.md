# Design System Baseline Alignment Report - 2026-06-19

## Summary

Foundation 화면의 주요 spacing과 card rhythm을 8px baseline 및 12-column grid에 더 잘 맞도록 정리했다.

## Screenshots

- Before: `notes/screenshots/design-system-baseline-alignment-2026-06-19/before-fullscreen.png`
- After: `notes/screenshots/design-system-baseline-alignment-2026-06-19/after-fullscreen.png`
- After with grid overlay: `notes/screenshots/design-system-baseline-alignment-2026-06-19/after-grid-visible-headless.png`

## Files Changed

- `src/app/design-system/_components/foundation-page-content.tsx`
  - Section intro/content gap changed to 32px.
  - Repeated card grids now use 24px gaps so 2/3/4-column layouts align more closely with the 12-column rail.
  - Raw color, semantic color, spacing, radius, and state rows use 8px rhythm values.
- `src/app/design-system/_components/page-sections.tsx`
  - Hero and section intro line-height and vertical padding now land on 8px rhythm values.
  - Shared design-system grids use 24px gaps.
- `src/app/globals.css`
  - Docs cards changed from 28px/18px/10px values to 24px/16px/8px rhythm values.
  - Preview frame and mobile card padding now match the same spacing ladder.

## Verification

- `npm run lint -- src/app/design-system/_components/foundation-page-content.tsx src/app/design-system/_components/page-sections.tsx src/app/design-system/_components/design-system-shell.tsx`: passed.
- `curl -s -I --max-time 10 http://127.0.0.1:3000/design-system/foundation`: `200 OK`.
- `npm run build:next`: first run hit `.next/server` `ENOTEMPTY`; immediate retry passed.
- Headless Chrome captures saved normal and grid-overlay after states.

## Spacing Map

- Page rail: 1120px, unchanged.
- Section separation: 64px.
- Section intro to content: 32px.
- Card grid gap: 24px.
- Card padding: 24px desktop, 16px mobile.
- Inner item rhythm: 8px and 16px.

## Remaining Risk

- Text baselines in web rendering can vary slightly by browser font metrics. The layout now uses baseline-compatible line-height and spacing values, but exact glyph baseline snapping is not enforced per text node.
