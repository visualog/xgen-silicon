# shadcn/ui design system handoff

Date: 2026-06-05
Branch: `feature/apps-sdk-ui-foundation`
Repo: `/Users/im_018/Documents/GitHub/2026_important/BrandGen`

## Current direction

The user changed the design-system direction away from Apps SDK UI and asked to use shadcn/ui components and blocks instead.

Latest clarification:

- Apps SDK UI is no longer needed for this project.
- Treat Apps SDK UI as a superseded historical direction, not as an active dependency, reference design system, or future migration target.
- Do not use the older `apps-sdk-ui-*` notes as implementation guidance except when reconstructing history.
- The current branch name still contains `apps-sdk-ui-foundation`, but the active product/design direction is shadcn/ui.

Important clarification from the latest review:

- The user does not only want shadcn components imported.
- The page must visually follow shadcn/ui foundation behavior: header density, font scale, spacing, neutral colors, soft borders, and component internal padding.
- The user explicitly called out two issues that were fixed in the last pass:
  - component internals were touching card edges
  - the overall page looked left-aligned because the container was too wide

## Implemented state

### Dependency and foundation migration

Removed Apps SDK UI runtime usage and moved the local UI layer to shadcn-style primitives.

Current shadcn-related dependencies in `package.json`:

- `@radix-ui/react-slot`
- `@radix-ui/react-toggle-group`
- `class-variance-authority`
- `clsx`
- `tailwind-merge`

`@openai/apps-sdk-ui` is no longer in `package.json`.

### Local shadcn primitives

Added local primitives under `src/components/ui/`:

- `button.tsx`
- `badge.tsx`
- `card.tsx`
- `toggle-group.tsx`
- `index.ts`

Added utility:

- `src/lib/utils.ts`

Existing xGen wrapper components now wrap local shadcn/Radix primitives:

- `XgenButton.tsx`
- `XgenBadge.tsx`
- `XgenSegmentedControl.tsx`
- `XgenSelectControl.tsx`

### Foundation tokens and global CSS

Main file:

- `src/app/globals.css`

Important current state:

- `@import "tailwindcss";`
- shadcn-compatible `@theme inline` variables exist.
- `:root` defines shadcn foundation variables including `--background`, `--foreground`, `--card`, `--primary`, `--secondary`, `--muted`, `--border`, `--ring`.
- `--radius` is now `0.625rem`.
- The shadcn base layer was added:

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

This base layer is essential. Without it, Tailwind `border` utilities render like dark/currentColor borders and the page stops looking like shadcn/ui.

### Design-system page

Main file:

- `src/app/design-system/components/page.tsx`

Current visual structure:

- shadcn-style top nav
- centered hero
- `Composable blocks` showcase
- lower `Component catalog` section for existing xGen component taxonomy

The latest spacing fix:

- page container: `w-[min(1120px,calc(100vw-48px))]`
- showcase/catalog max width: `max-w-[980px]`
- showcase cards use explicit `p-6`
- catalog cards use explicit `p-5`
- nested `CardHeader`, `CardContent`, `CardFooter` use `px-0` inside padded cards
- preview padding increased to reduce edge crowding

## Key reports and screenshots

Read these in order for this migration:

1. `notes/shadcn-ui-migration-report.md`
2. `notes/shadcn-components-page-report.md`
3. `notes/shadcn-visual-alignment-report.md`
4. `notes/shadcn-foundation-match-report.md`
5. `notes/shadcn-layout-spacing-fix-report.md`

Latest visual evidence:

- `notes/screenshots/shadcn-layout-spacing-fix-2026-06-05/after-fullscreen.png`

Other relevant screenshot folders:

- `notes/screenshots/shadcn-ui-migration-2026-06-05/`
- `notes/screenshots/shadcn-components-page-2026-06-05/`
- `notes/screenshots/shadcn-visual-alignment-2026-06-05/`
- `notes/screenshots/shadcn-foundation-match-2026-06-05/`

## Verification status

Latest build command run after the spacing fix:

```bash
npm run build:next
```

Result:

- Passed.
- Next.js compiled successfully.
- TypeScript passed.
- Static generation completed for 19 pages.

Latest local URL:

- `http://127.0.0.1:3002/design-system/components`

Server status at handoff time:

- port `3002` has an active `next start` process.
- `next start` still prints the existing warning:
  - `"next start" does not work with "output: standalone" configuration. Use "node .next/standalone/server.js" instead.`
- Despite that warning, the route served and screenshots were captured.

## Known gaps and risks

- The lower `Component catalog` intentionally still shows legacy xGen component previews. The catalog documents existing app components, so not every preview should become a generic shadcn block.
- The latest screenshots are full desktop captures, so other app windows are visible.
- There are many untracked historical notes/screenshots from earlier Apps SDK UI work. Do not delete them unless the user explicitly asks.
- The branch has several modified files from the full design-system migration, including `package.json`, `package-lock.json`, `src/app/globals.css`, `src/app/design-system/components/page.tsx`, `src/app/page.tsx`, and node components.
- Do not reintroduce Apps SDK UI or the old design-md foundation.
- If Apps SDK UI appears only in old notes or screenshot folder names, treat those references as archived context. Active verification should check `src`, `package.json`, and `package-lock.json`.

## Suggested next task

Do a focused visual QA pass on `/design-system/components` against shadcn/ui:

1. Inspect the current page at `http://127.0.0.1:3002/design-system/components`.
2. Compare against shadcn/ui docs/block examples for:
   - header alignment and nav spacing
   - hero width and typography
   - card inner padding
   - grid width and centering
   - muted/background/border color tone
3. Fix only concrete visual mismatches.
4. Re-run `npm run build:next`.
5. Capture a new screenshot and write a small completion report.

## Copy-paste prompt for next session

Continue in `/Users/im_018/Documents/GitHub/2026_important/BrandGen`.

Read first:

- `AGENTS.md`
- `notes/shadcn-ui-design-system-handoff.md`
- `notes/shadcn-layout-spacing-fix-report.md`
- `notes/shadcn-foundation-match-report.md`

Current goal:

Continue the shadcn/ui design-system migration. The user is reviewing `/design-system/components` against shadcn/ui and cares about visual foundation fidelity, not just imports. Apps SDK UI is no longer needed and must not be reintroduced. Keep shadcn foundation variables and the base layer in `src/app/globals.css`. Inspect the actual running page, fix concrete mismatches in header, font size, spacing, colors, centering, and component inner padding, then verify with `npm run build:next` and save before/after screenshots plus a short report under `notes/`.
