# Design System Card Hover Motion Removal Report - 2026-06-19

## Summary

공유 디자인 시스템 카드 그리드에서 hover 시 카드가 위로 이동하는 motion을 제거했다.

## Screenshots

- Before: `notes/screenshots/design-system-card-hover-motion-removal-2026-06-19/before-fullscreen.png`
- After: `notes/screenshots/design-system-card-hover-motion-removal-2026-06-19/after-fullscreen.png`

## Files Changed

- `src/app/design-system/_components/page-sections.tsx`
  - Removed `hover:-translate-y-0.5` from `LinkCardGrid`, `InfoGrid`, `BoundaryGrid`, and `TemplateGrid`.
  - Removed `transform` from those card transition lists.
  - Kept the subtle border-color hover state.

## Verification

- `rg -n "hover:-translate|transition-\\[border-color,box-shadow,transform\\]" src/app/design-system src/app/globals.css`: no matches.
- `npm run lint -- src/app/design-system/_components/page-sections.tsx`: passed.
- `curl -s -I --max-time 10 http://127.0.0.1:3000/design-system/components`: `200 OK`.
- `npm run build:next`: passed.

## Scope Note

The remaining transform rules in `globals.css` belong to non-card UI areas such as other app surfaces, animation keyframes, and the grid overlay positioning. They were not changed.
