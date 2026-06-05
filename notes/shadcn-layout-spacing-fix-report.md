# shadcn layout spacing fix report

Date: 2026-06-05
Branch: `feature/apps-sdk-ui-foundation`
Task: Fix internal padding and page centering on `/design-system/components`.

## Summary

The user correctly identified two concrete visual problems:

- Several component cards looked like their children were stuck to the edges.
- The full page read as left-aligned because the container was too wide for the current browser viewport.

This pass adds explicit card padding on the design-system page and reduces the content width so the page is visibly centered.

## Screenshots

Before:

- `notes/screenshots/shadcn-foundation-match-2026-06-05/after-fullscreen.png`

After:

- `notes/screenshots/shadcn-layout-spacing-fix-2026-06-05/after-fullscreen.png`

## Files changed

- `src/app/design-system/components/page.tsx`
- `notes/shadcn-layout-spacing-fix-plan.md`
- `notes/shadcn-layout-spacing-fix-report.md`

## Implementation notes

- Reduced the page shell width from `1400px` to `1120px`.
- Reduced the main showcase/catalog width to `980px`.
- Added explicit `p-6` to showcase Cards.
- Added explicit `p-5` to catalog Cards.
- Changed Card children in padded Cards to `px-0` so padding comes from the Card container itself.
- Increased preview padding from `--ui-space-16` to `--ui-space-20`.
- Kept shadcn primitives and foundation tokens intact.

## Verification

Command:

```bash
npm run build:next
```

Result:

- Passed.
- Next.js compiled successfully.
- TypeScript passed.
- Static generation completed for 19 pages.

Runtime:

- Restarted server at `http://127.0.0.1:3002`.
- Opened `/design-system/components`.
- Captured after screenshot.

## Remaining risk

- The lower xGen catalog still has legacy preview content, so those mini-previews retain some xGen-specific visual traits by design.
- The screenshot is a full desktop capture, so the browser viewport is only part of the image.
