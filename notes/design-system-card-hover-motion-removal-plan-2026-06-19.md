# Design System Card Hover Motion Removal Plan - 2026-06-19

## Request

디자인 시스템 카드에 hover 시 위로 살짝 이동하는 효과가 일부 페이지에만 제거된 상태라, 모든 디자인 시스템 카드 그리드에서 제거한다.

## Before Screenshot

- `notes/screenshots/design-system-card-hover-motion-removal-2026-06-19/before-fullscreen.png`

## Plan

1. Search all `/design-system` sources for hover translate and transform transition classes.
2. Remove `hover:-translate-y-*` from shared card grid components.
3. Remove `transform` from those card transition lists so hover no longer implies motion.
4. Keep non-motion hover affordance such as border color.
5. Verify search, lint, route response, build, and after screenshot.
