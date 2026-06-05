# shadcn foundation match report

Date: 2026-06-05
Branch: `feature/apps-sdk-ui-foundation`
Task: Match shadcn/ui header, typography, spacing, colors, and component foundation.

## Summary

The main visual mismatch was not just layout. The project was missing shadcn's base foundation rule that maps Tailwind border utilities to `--border`. As a result, `border` rendered as current text color and all cards/buttons/badges looked like heavy black outlined components.

This pass fixes the foundation layer and tightens the `/design-system/components` page to match the shadcn docs/showcase density more closely.

## Screenshots

Before:

- `notes/screenshots/shadcn-foundation-match-2026-06-05/before-fullscreen.png`

After:

- `notes/screenshots/shadcn-foundation-match-2026-06-05/after-fullscreen.png`

## Files changed

- `src/app/globals.css`
- `src/app/design-system/components/page.tsx`
- `notes/shadcn-foundation-match-plan.md`
- `notes/shadcn-foundation-match-report.md`

## Implementation notes

- Added the shadcn base layer:

```css
@layer base {
  * {
    @apply border-border outline-ring/50;
  }

  body {
    @apply bg-background text-foreground;
  }
}
```

- Changed the default radius to `0.625rem`, matching shadcn's default foundation more closely.
- Adjusted page max width to a shadcn docs-like `1400px` container.
- Reduced header height and nav spacing.
- Reduced overuse of pill buttons/badges in the hero and showcase.
- Increased showcase spacing and softened Card borders through the corrected foundation token.
- Kept the lower xGen catalog as a reference section, but the first viewport now follows shadcn docs/block structure.

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

- This is visually aligned with shadcn's foundation and component style, but not a pixel-for-pixel clone of the shadcn marketing page.
- The lower catalog still shows legacy xGen component previews by design.
- The screenshot is a full-screen desktop capture, so surrounding apps are visible.
