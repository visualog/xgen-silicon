# Design System Body Centering Report

Date: 2026-06-10

## Summary

Fixed the design-system page shell so the body content rail is not left-pinned when the shell is interpreted as a flex layout.

## Files Changed

- `src/app/design-system/_components/design-system-shell.tsx`
  - Changed the design-system `main` to an explicit vertical stack with `flex flex-col`.
  - Added `data-slot="design-system-body"` to the body wrapper for easier DevTools inspection.
  - Replaced the body rail class with an explicit `max-w-[1040px]`.

## Screenshots

- Before: `notes/screenshots/design-system-body-centering-2026-06-10/before-patterns-fullscreen.png`
- After: `notes/screenshots/design-system-body-centering-2026-06-10/after-patterns-fullscreen.png`
- After exact URL: `notes/screenshots/design-system-body-centering-2026-06-10/after-patterns-exact-url-fullscreen.png`

## Verification

- `npm run build:next`
  - Passed.
  - Design-system routes were prerendered successfully.
- Restarted local server on `http://127.0.0.1:3002`.
- `curl -s --max-time 8 -I http://127.0.0.1:3002/design-system/patterns`
  - Returned `HTTP/1.1 200 OK`.
- Checked built output under `.next/server/app/design-system` and `.next/static`.
  - Confirmed `shadcn-docs-surface flex min-h-screen flex-col`.
  - Confirmed `data-slot="design-system-body"`.
  - Confirmed `max-w-[1040px]`.

## Notes

The browser DevTools screenshot showed an inline `style="display: flex;"` on `main`, while the source did not define that inline style. The shell now explicitly uses `flex-col`, so even if the main element is flex, the header and body stack vertically and the body wrapper can center normally.

`curl` returned a valid 200 header but did not stream the full body in this environment, matching prior local Next server behavior. Build output was used as the source-of-truth markup verification.

## Remaining Risk

If a browser tab still shows the previous `max-w-5xl` node without `data-slot="design-system-body"`, the tab is stale. Hard refresh or reopen `http://127.0.0.1:3002/design-system/patterns`.
