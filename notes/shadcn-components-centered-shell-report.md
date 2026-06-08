# shadcn components centered shell report

## Summary

- Narrowed the `/design-system/components` shell so it remains visibly centered when DevTools reduces the page viewport.
- Applied the same shell width to the header and content wrapper.
- Kept the established top/bottom padding and section rhythm.

## Root cause

- The previous shell used `max-w-7xl`.
- In the inspected browser layout, DevTools made the page viewport narrower than `max-w-7xl`.
- When the viewport is narrower than the max width, `mx-auto` cannot create visible side margins, so the page reads as left-attached.

## What changed

- `bodyShellClassName`: `max-w-7xl` -> `max-w-5xl`
- `pageShellClassName`: `max-w-7xl` -> `max-w-5xl`
- Existing vertical shell padding remains `py-20 lg:py-28`.
- Existing section rhythm remains `mt-16` and `gap-8 lg:gap-10`.

## Files changed

- `src/app/design-system/components/page.tsx`
- `notes/shadcn-components-centered-shell-plan.md`
- `notes/shadcn-components-centered-shell-report.md`

## Screenshots

- Before: `notes/screenshots/shadcn-components-centered-shell-2026-06-08/before-fullscreen.png`
- After: `notes/screenshots/shadcn-components-centered-shell-2026-06-08/after-fullscreen.png`

## Verification

- `./node_modules/.bin/eslint src/app/design-system/components/page.tsx` passed.
- `curl -s -I --max-time 10 http://localhost:3013/design-system/components` returned `HTTP/1.1 200 OK`.
- `npm run build:next` passed.
- Before and after screenshots were both captured at `5120x2880`.
