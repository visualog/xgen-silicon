# shadcn/ui current state handoff

Date: 2026-06-05
Branch: `feature/apps-sdk-ui-foundation`
Repo: `/Users/im_018/Documents/GitHub/2026_important/BrandGen`

## Current state

The user changed direction from Apps SDK UI to shadcn/ui. The first migration pass has been implemented:

- `@openai/apps-sdk-ui` dependency removed.
- Apps SDK UI CSS import removed.
- Local shadcn/ui-style primitives added under `src/components/ui/`.
- Existing `XgenButton`, `XgenBadge`, `XgenSegmentedControl`, and `XgenSelectControl` now wrap local shadcn/Radix primitives.
- `XgenControlBridgePreview` now says `shadcn/ui bridge` and uses `Card`.
- `globals.css` now defines shadcn-compatible theme tokens and maps xGen compatibility tokens to those values.
- Node accent colors are still unified from the previous task.

## Verification status

Passed:

```bash
npm run build:next
```

Passed with no matches:

```bash
rg -n "@openai/apps-sdk-ui|apps-sdk-ui|Apps SDK UI|font-text|font-heading|control-size|shadow-100|shadow-200|color-background-|color-text|color-surface" src package.json package-lock.json
```

Audit:

```bash
npm audit --omit=dev --json
```

Result: 2 moderate advisories remain through `next` -> `postcss <8.5.10`. Apps SDK UI and lodash advisories are gone.

Visual evidence:

- Before: `notes/screenshots/shadcn-ui-migration-2026-06-05/before-fullscreen.png`
- After: `notes/screenshots/shadcn-ui-migration-2026-06-05/after-fullscreen.png`

Local server:

- `http://127.0.0.1:3002/design-system/components`
- Started with `npm start -- -H 127.0.0.1 -p 3002`
- Note: Next prints the existing standalone-output warning.

## Key files

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

## Recommended next task

Apply real shadcn/ui blocks to the visible design-system page and then to the main app surfaces, instead of stopping at primitive compatibility wrappers.

Suggested order:

1. Replace the component gallery cards on `/design-system/components` with shadcn `Card`, `Button`, `Badge`, and `ToggleGroup` patterns consistently.
2. Introduce additional shadcn primitives only when used by a visible block, such as `Separator`, `Tabs`, `Sheet`, or `Tooltip`.
3. Migrate one real app surface at a time from app-specific panel/card styles to shadcn primitives.
4. Keep old `Xgen*` wrappers only as compatibility adapters until call sites are migrated.

## Copy-paste prompt for next session

Continue in `/Users/im_018/Documents/GitHub/2026_important/BrandGen`.

Read:

- `AGENTS.md`
- `notes/shadcn-ui-migration-plan.md`
- `notes/shadcn-ui-migration-report.md`
- `notes/shadcn-ui-current-state-handoff.md`

Goal:

Continue the shadcn/ui migration beyond wrappers. Apply shadcn/ui components and block-level composition to `/design-system/components` first, then verify visually and with `npm run build:next`. Follow AGENTS.md by creating a planning note, saving before/after screenshots under `notes/screenshots/`, and writing a completion report.
