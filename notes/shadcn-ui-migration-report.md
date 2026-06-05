# shadcn/ui migration report

Date: 2026-06-05
Branch: `feature/apps-sdk-ui-foundation`
Task: Remove Apps SDK UI dependency and reconnect the local UI wrappers to shadcn/ui-style primitives.

## Summary

The first shadcn/ui migration pass is complete. The runtime dependency and CSS import for `@openai/apps-sdk-ui` were removed, local shadcn/ui primitives were added, and the existing `Xgen*` compatibility wrappers now render through local `Button`, `Badge`, `Card`, and Radix `ToggleGroup` primitives.

This keeps current app call sites stable while changing the component foundation underneath.

## Screenshots

Before:

- `notes/screenshots/shadcn-ui-migration-2026-06-05/before-fullscreen.png`

After:

- `notes/screenshots/shadcn-ui-migration-2026-06-05/after-fullscreen.png`

## Files changed

- `package.json`
- `package-lock.json`
- `src/app/globals.css`
- `src/components/ui/button.tsx`
- `src/components/ui/badge.tsx`
- `src/components/ui/card.tsx`
- `src/components/ui/toggle-group.tsx`
- `src/components/ui/XgenButton.tsx`
- `src/components/ui/XgenBadge.tsx`
- `src/components/ui/XgenSegmentedControl.tsx`
- `src/components/ui/XgenSelectControl.tsx`
- `src/components/ui/XgenControlBridgePreview.tsx`
- `src/components/ui/index.ts`
- `src/lib/utils.ts`

## Implementation notes

- Removed `@openai/apps-sdk-ui` from dependencies.
- Added shadcn/ui runtime dependencies:
  - `class-variance-authority`
  - `clsx`
  - `tailwind-merge`
  - `@radix-ui/react-slot`
  - `@radix-ui/react-toggle-group`
- Replaced Apps SDK UI imports in local wrappers with local primitives.
- Added shadcn-compatible theme variables in `src/app/globals.css`.
- Rebased the existing xGen compatibility tokens on shadcn theme tokens instead of Apps SDK UI foundation tokens.
- Scoped the legacy global `button` reset to `button:not([data-slot])` so shadcn button border and variant styles are not overwritten.
- Updated the `/design-system/components` bridge preview copy from Apps SDK UI to shadcn/ui and used `Card` in the preview block.

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

Command:

```bash
rg -n "@openai/apps-sdk-ui|apps-sdk-ui|Apps SDK UI|font-text|font-heading|control-size|shadow-100|shadow-200|color-background-|color-text|color-surface" src package.json package-lock.json
```

Result:

- No matches.

Command:

```bash
npm audit --omit=dev --json
```

Result:

- 2 moderate vulnerabilities remain.
- Both are the existing `next` -> `postcss <8.5.10` advisory path.
- No Apps SDK UI or lodash-related advisory remains after the dependency removal.

Runtime check:

- Server restarted at `http://127.0.0.1:3002`.
- Opened `/design-system/components`.
- Captured after screenshot.

## Remaining risks

- This is a compatibility-layer migration, not a full page redesign with official shadcn blocks across the whole product.
- Existing app-specific CSS tokens still exist because production screens depend on them, but their source values now come from shadcn-compatible theme variables.
- Historical notes still mention Apps SDK UI and should remain as history unless explicitly archived or superseded.
- `next start` prints the existing warning that the project uses `output: standalone`; runtime still served locally for this visual check.
