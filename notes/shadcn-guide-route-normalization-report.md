# shadcn guide route normalization report

Date: 2026-06-08

## Summary

Normalized `/guide` as the next bounded shadcn foundation task. The route no longer uses inline `CSSProperties`, archived xGen/design-md CSS variables, or production editor classes. It now renders with installed shadcn primitives and a route-specific centered rail.

## Screenshots

- Before: `notes/screenshots/shadcn-guide-route-normalization-2026-06-08/before-fullscreen.png`
- After: `notes/screenshots/shadcn-guide-route-normalization-2026-06-08/after-fullscreen.png`

## Files Changed

- `src/app/guide/page.tsx`
  - Replaced custom inline style objects with shadcn primitives and Tailwind utility classes.
  - Removed direct references to `--ui-*`, `--bg-*`, `--text-*`, `--border-node`, `--port-*`, and `studio-*` classes.
  - Preserved guide content and route metadata.
- `src/app/globals.css`
  - Added `.shadcn-guide-rail` to guarantee centered layout independent of Tailwind max-width utility behavior.
- `notes/shadcn-guide-route-normalization-plan.md`
  - Recorded implementation scope and before screenshot.

## Verification

- `rg -n "style=|CSSProperties|--ui-|--bg-|--text-|--border-node|--port-|studio-|brand-|tool-pill|system-pulse|secondary-command" src/app/guide/page.tsx`
  - Result: no matches.
- `./node_modules/.bin/eslint src/app/guide/page.tsx`
  - Result: passed.
- `npm run build:next`
  - Result: passed.
- `curl -s -I http://127.0.0.1:3013/guide`
  - Result: `200 OK`, static prerender hit.

## Server

- Restarted local production server on `http://127.0.0.1:3013`.
- `next start` still warns that the repository is configured for `output: standalone`; this is existing behavior from prior verification runs.

## Remaining Risks

- The production editor route `src/app/page.tsx` and node components still depend on legacy compatibility tokens and custom classes.
- `src/app/globals.css` still contains the compatibility layer because the editor is not migrated yet.
- The next safe task is to normalize one production-facing component family at a time, starting with the node component wrappers or the home/guide navigation boundary.
