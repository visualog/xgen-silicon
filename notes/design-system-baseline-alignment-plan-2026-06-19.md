# Design System Baseline Alignment Plan - 2026-06-19

## Request

Foundation 화면의 실제 레이아웃을 컬럼 그리드와 8px baseline rhythm에 더 잘 맞도록 정리한다.

## Before Screenshot

- `notes/screenshots/design-system-baseline-alignment-2026-06-19/before-fullscreen.png`

## Spacing Hierarchy

- Page rail: existing 1120px rail, aligned with grid overlay.
- Page padding: 80px top / 96px bottom on desktop, 56px / 64px on mobile.
- Section separation: 64px.
- Section intro to content: 32px.
- Card grid gap: 24px.
- Card padding: 24px desktop, 16px mobile.
- Card internals: 8px and 16px.

## Plan

1. Replace non-baseline card and grid values such as 20px, 28px, 10px, and 18px with 8px rhythm values where possible.
2. Keep the existing responsive column layout but align gaps to 24px.
3. Add local docs classes for Foundation rows so raw color rows, spacing rows, and state callouts share the same rhythm.
4. Verify lint, route response, build, and after screenshots including grid overlay.
