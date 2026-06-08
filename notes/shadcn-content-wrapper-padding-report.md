# shadcn content wrapper padding report

## Summary

- Removed unnecessary grid layout from `main` on `/design-system/components`.
- Made header-to-content and page-bottom spacing explicit on the content wrapper.
- Kept `main` as the shadcn docs surface and left spacing ownership to the wrapper below `header`.

## What changed

- `main` changed from `grid min-h-screen w-full justify-items-center ...` to `min-h-screen ...`.
- `pageSectionStackClassName` changed from `py-*` to explicit `pt-*` and `pb-*`:
  - `pt-16 pb-20`
  - `sm:pt-20 sm:pb-24`
  - `lg:pt-24 lg:pb-28`
- Existing section rhythm stayed moderate:
  - section-to-section: `space-y-16 lg:space-y-20`
  - section heading-to-content: `gap-8 lg:gap-10`

## Why this structure

- `header` owns the navigation bar height.
- The content wrapper below `header` owns the top and bottom page breathing room.
- `main` should not need `gap` here because the page does not need grid layout between chrome and content.

## Files changed

- `src/app/design-system/components/page.tsx`
- `notes/shadcn-content-wrapper-padding-plan.md`
- `notes/shadcn-content-wrapper-padding-report.md`

## Screenshots

- Before: `notes/screenshots/shadcn-content-wrapper-padding-2026-06-08/before-fullscreen.png`
- After: `notes/screenshots/shadcn-content-wrapper-padding-2026-06-08/after-fullscreen.png`

## Verification

- `./node_modules/.bin/eslint src/app/design-system/components/page.tsx` passed.
- `curl -s -I --max-time 10 http://localhost:3013/design-system/components` returned `HTTP/1.1 200 OK`.
- `npm run build:next` passed.
- Before and after screenshots were both captured at `5120x2880`.
