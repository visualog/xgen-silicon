# xGen dark mode color repair report

## Summary

Fixed the xGen dark-mode color inversion at the token layer.

The page was correctly entering dark mode, but xGen legacy tokens mapped dark
surfaces from foreground/ink aliases and mapped primary text from a surface
alias. That made `--bg-canvas` resolve near white and `--text-primary` resolve
near black in dark mode.

## Files Changed

- `src/app/globals.css`
- `notes/xgen-dark-mode-colors-plan-2026-06-23.md`
- `notes/xgen-dark-mode-colors-report-2026-06-23.md`
- `notes/screenshots/xgen-dark-mode-colors-2026-06-23/before.png`
- `notes/screenshots/xgen-dark-mode-colors-2026-06-23/after.png`

## Implementation

Updated only the dark-mode legacy token overrides:

- `--bg-canvas` now maps from `--background` and `--card`.
- `--bg-node-base` now maps to `--card`.
- `--bg-node-header` now mixes `--card` and `--muted`.
- `--border-node` now mixes `--border` and `--muted-foreground`.
- `--text-primary` now maps to `--foreground`.
- `--text-secondary`, `--text-tertiary`, and `--text-muted` now map from `--muted-foreground`.
- `--shadow-node` now uses a black transparent shadow source instead of a foreground/ink alias.

## Verification

Browser verification at `http://localhost:3000/`:

- root `data-theme`: `dark`
- root class includes `dark`
- `color-scheme`: `dark`
- after cache reset, computed values:
  - `--bg-canvas`: `color-mix(in srgb, var(--background) 88%, var(--card))`
  - `--bg-node-base`: `var(--card)`
  - `--text-primary`: `var(--foreground)`
  - `--text-secondary`: `var(--muted-foreground)`
- entered the image editor and confirmed:
  - editor shell renders dark surface with light foreground
  - topbar/mode toggle render dark translucent surfaces with light foreground
  - prompt node textarea renders dark surface with light foreground

Commands:

- `npm run lint` failed because of existing unrelated repo-wide lint errors in `codex/` and `scratch/` requiring CommonJS `require()` cleanup.
- `npm exec prettier -- --check src/app/globals.css` did not return promptly and was interrupted.

## Screenshots

- Before: `notes/screenshots/xgen-dark-mode-colors-2026-06-23/before.png`
- After: `notes/screenshots/xgen-dark-mode-colors-2026-06-23/after.png`

## Notes

The Next/Turbopack dev server continued serving the old CSS after the source edit.
Deleting generated `.next` cache and restarting `npm run dev` made the updated
tokens appear in the served CSS and browser-computed styles.
