# Style Library Scroll Plan

Date: 2026-06-02

## Goal

Fix scroll behavior in the Style Reference library modal:

- category filters scroll horizontally,
- style tag filters scroll horizontally,
- library cards scroll vertically,
- scrollbars are visible only while scrolling.

## Before Screenshot

- `notes/screenshots/style-library-scroll-2026-06-02/before-fullscreen.png`

## Diagnosis

- Filter pills can shrink inside the flex row, so horizontal overflow may not be created.
- The library modal body does not give the library grid a fully constrained height, so the card list's `overflowY: auto` may not become an active internal scroll area.
- Native scrollbars are always visible when enabled unless styled.

## Plan

1. Add a small scroll-area wrapper in `StyleAddModal` that marks a region as scrolling during scroll events.
2. Use it for the category row, style tag row, and card list.
3. Make filter pills non-shrinking so horizontal scroll is real.
4. Constrain modal body/library grid/list heights with `minHeight: 0` and `flex: 1`.
5. Add CSS that hides scrollbars by default and shows them only while the scroll area has the active scrolling class.
6. Verify with `npm run build:next`.
