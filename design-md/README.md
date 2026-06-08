# Archived design-md tokens

`design-md` is retained for historical reference only.

The active runtime design system is shadcn/ui, configured through:

- `components.json`
- `src/app/globals.css`
- `src/components/ui/*`

Do not import `design-md/variables.css` or `design-md/theme.css` into the app runtime.

`scripts/sync-design-tokens.mjs` is guarded to prevent accidental regeneration. If a historical export is intentionally needed, run it with:

```bash
DESIGN_MD_ALLOW_SYNC=1 node scripts/sync-design-tokens.mjs
```
