# Design System Header Alignment Plan

Date: 2026-06-18

## Request

Fix the design-system header because the header content appears stuck to the
left edge, menu links look cramped, and the current DOM shows one nav inside the
top row plus another nav directly under the header.

## Before Screenshot

![Before full-screen capture](./screenshots/design-system-header-alignment-2026-06-18/before-fullscreen.png)

## Findings

- The header currently uses a wide `max-w-7xl` rail while the body uses a
  narrower `1120px` rail, so the header brand sits far left of the main content.
- There are two navigation elements:
  - a desktop nav inside the header row, hidden below `md`
  - a mobile nav below that row, hidden at `md` and above
- This is valid responsive markup, but it makes the DOM look duplicated and
  leaves spacing split across two separate nav implementations.
- Desktop menu gap is only `gap-1`, which makes text links read as attached.

## Plan

1. Refactor `DesignSystemShellContent` to render a single responsive nav.
2. Align the header inner rail with the body by using a narrower max width.
3. Increase menu link gap and preserve horizontal scrolling on small screens.
4. Keep the preference controls and xGen link as the right-side action group.
5. Verify with HTTP/browser evidence and targeted source checks.

## Files

- `src/app/design-system/_components/design-system-shell.tsx`
- `notes/design-system-header-alignment-report.md`
- `notes/screenshots/design-system-header-alignment-2026-06-18/`
