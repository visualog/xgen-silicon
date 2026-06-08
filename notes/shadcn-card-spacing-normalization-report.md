# shadcn card spacing normalization report

Date: 2026-06-08

## Summary

Normalized the design-system card rhythm before applying the design to production. The fix does not modify the shadcn registry `Card` source. Instead it adds a documentation-route rhythm layer and applies it to `/design-system/*`.

## Screenshots

- Before: `notes/screenshots/shadcn-card-spacing-normalization-2026-06-08/before-fullscreen.png`
- After: `notes/screenshots/shadcn-card-spacing-normalization-2026-06-08/after-fullscreen.png`

## Files Changed

- `src/app/design-system/components/page.tsx`
  - Added `shadcn-docs-surface` route wrapper.
  - Reduced overly dense grid pressure from 4-column-heavy layouts to wider 3-column and larger card spans.
  - Tightened section intro rhythm and widened card interior perception through larger card widths.
- `src/app/design-system/page.tsx`
  - Added `shadcn-docs-surface`.
  - Aligned documentation rail to `max-w-7xl`.
- `src/app/design-system/templates/page.tsx`
  - Added `shadcn-docs-surface`.
  - Aligned documentation rail to `max-w-7xl`.
- `src/app/globals.css`
  - Added `.shadcn-docs-surface` to isolate design-system documentation pages from legacy body visual defaults.
  - Added route-scoped card rhythm rules for `data-slot="card"`, `card-header`, `card-content`, `card-footer`, and `card-description`.

## Spacing Map

- Page rail: `max-w-7xl` with existing responsive page padding.
- Section gap: 24px to 32px around section intros.
- Card shell: 24px vertical padding and 24px internal gap.
- Card header/content/footer: `clamp(20px, 2vw, 28px)` inline padding, 16px on mobile.
- Inner groups: 8px to 20px, depending on nesting depth.

## Verification

- Card direct-child guard:
  - `rg --pcre2 -n "<Card(?:\\s[^>]*)?>\\s*<(?!CardHeader|CardContent|CardFooter|/Card)" src/app/design-system src/components`
  - Result: no matches.
- Legacy token/class guard:
  - `rg -n "style=|CSSProperties|--ui-|--bg-|--text-|--border-node|--port-|studio-|brand-|tool-pill|system-pulse|secondary-command" src/app/design-system/page.tsx src/app/design-system/components/page.tsx src/app/design-system/templates/page.tsx`
  - Result: no matches.
- ESLint:
  - `./node_modules/.bin/eslint src/app/design-system/page.tsx src/app/design-system/components/page.tsx src/app/design-system/templates/page.tsx src/app/globals.css`
  - Result: TSX files passed; CSS is ignored by current ESLint config with a warning.
- Build:
  - `npm run build:next`
  - Result: passed.
- Route smoke:
  - `curl -s -I http://127.0.0.1:3013/design-system/components`
  - Result: `200 OK`.

## Server

- Restarted production server on `http://127.0.0.1:3013`.
- Existing warning remains: `next start` warns that `output: standalone` should use `.next/standalone/server.js`.

## Remaining Risks

- The production editor is still on compatibility styling and should not consume this route-scoped docs rhythm directly.
- The screenshot was taken with a half-screen browser viewport; full-width desktop review should still be done before treating this as visually final.
