# Style Library Visible Plan

Date: 2026-06-02

## Goal

Make the style reference library visibly available from the Style Reference node as soon as the add modal opens.

## Before Screenshot

- `notes/screenshots/style-library-visible-2026-06-02/before-fullscreen.png`

## Diagnosis

The style reference modal supports the library, and the local manifest exists with 314 items. The current UX still opens the modal on the upload tab, so the library is not immediately displayed from the Style Reference node.

The library loading logic also depends on the user switching tabs before it fetches `/api/style-references`.

## Plan

1. Allow `StyleAddModal` to receive an `initialTab`.
2. Open the Style Reference node modal on the `library` tab by default.
3. Start library loading immediately when the modal opens in style/library mode.
4. Keep upload and URL tabs available for manual references.
5. Verify with `npm run build:next`.

## Expected Result

Clicking `추가` on the Style Reference node opens the modal with the library list visible or loading immediately.
