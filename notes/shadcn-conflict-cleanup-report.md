# shadcn conflict cleanup report

Date: 2026-06-08
Branch: `feature/apps-sdk-ui-foundation`
Task: Split and execute cleanup work for files that can conflict with shadcn/ui foundation.

## Summary

Separated the active shadcn/ui foundation from archived `design-md` and xGen compatibility wrappers. The `/design-system/*` routes now use shadcn primitives and token classes directly, while legacy xGen wrappers remain available through a separate compatibility barrel for production node screens.

## Tasks completed

1. Archived `design-md` runtime paths.
   - Added `design-md/README.md`.
   - Guarded `scripts/sync-design-tokens.mjs` behind `DESIGN_MD_ALLOW_SYNC=1`.
2. Preserved shadcn as the design-system route source of truth.
   - Rebuilt `/design-system`, `/design-system/components`, and `/design-system/templates` away from legacy inline style/token documentation.
   - Removed `--ui-*`, `--bg-*`, `--text-*`, `--component-*`, and `--port-*` usage from the design-system pages.
3. Split shadcn registry exports from xGen compatibility wrappers.
   - `src/components/ui/index.ts` now exports shadcn registry primitives only.
   - `src/components/ui/xgen.ts` exports the `Xgen*` wrappers.
   - Updated node imports to use `@/components/ui/xgen`.
4. Completed the registry component rebuild.
   - Added official shadcn registry components: `label`, `select`, `switch`, `skeleton`, `textarea`, `slider`.
   - Added a visible `FoundationShowcase` using those components.

## Files changed

- `design-md/README.md`
- `scripts/sync-design-tokens.mjs`
- `package.json`
- `package-lock.json`
- `src/app/design-system/page.tsx`
- `src/app/design-system/components/page.tsx`
- `src/app/design-system/templates/page.tsx`
- `src/components/ui/index.ts`
- `src/components/ui/xgen.ts`
- `src/components/ui/label.tsx`
- `src/components/ui/select.tsx`
- `src/components/ui/skeleton.tsx`
- `src/components/ui/slider.tsx`
- `src/components/ui/switch.tsx`
- `src/components/ui/textarea.tsx`
- `src/components/nodes/OutputSettingsNode.tsx`
- `src/components/nodes/RatioNode.tsx`
- `src/components/nodes/ResolutionNode.tsx`

## Verification

- `./node_modules/.bin/eslint src/app/design-system/page.tsx src/app/design-system/components/page.tsx src/app/design-system/templates/page.tsx src/components/ui/index.ts src/components/ui/xgen.ts src/components/nodes/RatioNode.tsx src/components/nodes/ResolutionNode.tsx src/components/nodes/OutputSettingsNode.tsx scripts/sync-design-tokens.mjs` passed.
- `npm run build:next` passed.
- Restarted local production server on `http://127.0.0.1:3013`.
- `curl -sS -I --max-time 10 http://127.0.0.1:3013/design-system` returned `200 OK`.
- `curl -sS -I --max-time 10 http://127.0.0.1:3013/design-system/components` returned `200 OK`.
- `curl -sS -I --max-time 10 http://127.0.0.1:3013/design-system/templates` returned `200 OK`.

## Remaining risks

- Existing production app screens still use xGen compatibility tokens in `src/app/globals.css`, `src/app/page.tsx`, `src/app/page.module.css`, and node components. This is intentional for compatibility, but future work should migrate one production surface at a time to shadcn primitives.
- `design-md` is archived but still present. The guard prevents accidental sync, but deletion would require a separate explicit cleanup decision.
- Existing unrelated screenshot changes in `notes/screenshots/shadcn-responsive-centering-2026-06-05/` were already present before this cleanup and were not reverted.
