# shadcn Style Rules Merge Report

Date: 2026-06-18

## Summary

Merged the local shadcn/ui style preset guidance into the repo's operating rules.

The full reference now lives in `docs/ui-style-system.md`, while `AGENTS.md` contains only the concise operating-rule block needed by future agents.

## Files Changed

- `AGENTS.md`
  - Added `shadcn/ui Style Rules`.
  - Points future UI/design work to `docs/ui-style-system.md`.
  - Defines default choices for Vega, Nova, Luma, Rhea, Mira, Maia, Lyra, and Sera.
  - Sets BrandGen defaults: Luma/Rhea for the creative workspace, Vega/Nova for docs/settings/admin-like screens.
- `docs/ui-style-system.md`
  - Added the detailed style selection guide.
  - Preserves the current local shadcn foundation as the source of truth.
  - Documents style presets, selection table, BrandGen defaults, and agent prompt snippet.
- `notes/shadcn-style-rules-merge-plan.md`
  - Planning note for this task.
- `notes/shadcn-style-rules-merge-report.md`
  - Completion report.

## Screenshots

- Before: `notes/screenshots/shadcn-style-rules-merge-2026-06-18/before-fullscreen.png`
- After: `notes/screenshots/shadcn-style-rules-merge-2026-06-18/after-fullscreen.png`

## Verification

Command:

```bash
rg -n "shadcn/ui Style Rules|docs/ui-style-system.md|BrandGen defaults|Vega|Nova|Luma|Rhea|Mira|Maia|Lyra|Sera" AGENTS.md docs/ui-style-system.md notes/shadcn-style-rules-merge-plan.md
```

Result:

- Passed. The operating rule block and all style preset references are present.

Command:

```bash
git diff -- AGENTS.md docs/ui-style-system.md notes/shadcn-style-rules-merge-plan.md
```

Result:

- Reviewed. The tracked diff is limited to the `AGENTS.md` operating-rule addition; new documentation files are untracked until staged.

## Remaining Risks

- This was a documentation-only change; no runtime build was run.
- Upstream shadcn preset names and dates were imported from the provided local `style.ini`. Re-check upstream docs before changing CLI or registry configuration.
