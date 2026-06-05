# shadcn visual alignment report

Date: 2026-06-05
Branch: `feature/apps-sdk-ui-foundation`
Task: Make `/design-system/components` visually align with shadcn/ui.

## Summary

The page no longer opens with the dense legacy xGen component catalog. The first viewport now follows a shadcn/ui-style docs/showcase structure:

- simple top navigation
- centered hero
- black primary action
- outline secondary action
- spacious component block showcase
- catalog moved below the showcase

## Screenshots

Before:

- `notes/screenshots/shadcn-visual-alignment-2026-06-05/before-fullscreen.png`

After:

- `notes/screenshots/shadcn-visual-alignment-2026-06-05/after-fullscreen.png`

## Files changed

- `src/app/design-system/components/page.tsx`
- `notes/shadcn-visual-alignment-plan.md`
- `notes/shadcn-visual-alignment-report.md`

## Implementation notes

- Added a `ShadcnShowcase` block above the existing catalog.
- Used local shadcn primitives directly:
  - `Button`
  - `Badge`
  - `Card`
  - `CardHeader`
  - `CardTitle`
  - `CardDescription`
  - `CardContent`
  - `CardFooter`
  - `ToggleGroup`
  - `ToggleGroupItem`
- Removed the old `XgenControlBridgePreview` from the first viewport.
- Moved the xGen component taxonomy into a lower `Component catalog` section.
- Kept legacy preview examples because they document existing app components.

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

## Remaining risks

- This is a close visual alignment pass, not a pixel clone of the shadcn/ui website.
- The lower catalog still contains legacy xGen previews and intentionally looks like the existing app component inventory.
- The screenshot is a full-screen desktop capture, so neighboring windows are visible.
