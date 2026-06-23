# xGen dark mode color repair plan

## Context

- Date: 2026-06-23
- Surface: `http://localhost:3000/`
- Screenshot: `notes/screenshots/xgen-dark-mode-colors-2026-06-23/before.png`

## Reproduction

Browser computed style audit confirmed the app is in dark mode:

- `data-theme="dark"`
- root class includes `dark`
- `color-scheme: dark`

But the xGen legacy tokens are inverted:

- `--bg-canvas` resolves near white because it is mixed from dark-mode foreground/ink tokens.
- `--text-primary` resolves near black because it is assigned from `--ui-surface-white`, which aliases `--card` and becomes dark in dark mode.
- Top-level service UI text and commands therefore render with incorrect contrast in dark mode.

## Root Cause

The dark-mode override in `src/app/globals.css` uses semantically light aliases:

- `--ui-ink-primary` / `--ui-ink-strong` as surface sources
- `--ui-surface-white` as text source

After shadcn token aliasing, those values change meaning in dark mode, so xGen legacy tokens no longer map to stable surface/text roles.

## Plan

1. Keep the existing `.dark` class and `data-theme` plumbing.
2. Change only the dark-mode xGen legacy token overrides.
3. Map dark surfaces to `--background`, `--card`, and `--muted`.
4. Map dark text to `--foreground` and `--muted-foreground`.
5. Verify with computed browser styles and targeted lint.
