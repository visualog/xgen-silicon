# Design Foundation Current State Handoff

Date: 2026-06-18
Repo: `/Users/im_018/Documents/GitHub/2026_important/BrandGen`

## 1. Current Decision

The active design direction is now split by responsibility:

- Service UI and service previews use **Luma**.
- The `/design-system` documentation shell uses **Vega/Rhea**.

This means `/design-system` should not be globally styled as Luma. It should behave as a compact documentation/exhibition surface, while the examples inside it show the actual Luma service UI.

```text
/design-system shell = compact documentation style, Vega/Rhea
/design-system service examples = actual service style, Luma
actual xGen service UI = Luma
```

## 2. Rules Now Documented

The foundation rules are now documented in:

- `AGENTS.md`
- `docs/ui-style-system.md`

Rules added:

- Service UI and design-system service previews use Luma.
- `/design-system` documentation shell uses Vega/Rhea.
- Spacing, padding, gaps, and margins should stay on a 4px grid.
- Larger layout rhythm should prefer 8px increments.
- Divider lines and border-heavy grouping should be avoided by default.
- Nested rounded surfaces should be avoided; when necessary:

```text
inner radius = max(outer radius - inset spacing, 4px)
```

- Grid-based layouts and baseline-aware vertical rhythm should guide page structure and text-heavy documentation.
- CSS ownership should stay separated:
  - `src/components/ui/*`: shadcn primitive source of truth
  - `/design-system` shell CSS: compact documentation shell
  - service example wrappers: Luma preview styling
  - legacy xGen aliases: migration support only

## 3. Recent Changes

### Operating Rules

- `AGENTS.md`
  - Added the concise shadcn/ui style operating rules.
  - Added BrandGen defaults and foundation constraints.

### Detailed Style Guide

- `docs/ui-style-system.md`
  - Added style preset selection.
  - Added BrandGen style boundary.
  - Added spacing system.
  - Added shadcn Card slot structure notes.
  - Added nested radius rule.
  - Added divider/border discipline.
  - Added grid and baseline rhythm.
  - Added CSS ownership rules.

### Design-System Luma Pass

The previous pass applied Luma too broadly to the design-system shell:

- `src/app/globals.css`
- `src/app/design-system/_components/design-system-shell.tsx`
- `src/app/design-system/_components/page-sections.tsx`

This made the docs shell softer and more spacious. Based on later user clarification, this should be partially corrected: keep Luma for service examples/previews, but bring the docs shell back toward Vega/Rhea compact documentation behavior.

## 4. Important Existing Issue

`src/app/globals.css` currently has overlapping route-layer CSS:

- shadcn primitive source classes live in `src/components/ui/*`
- `.shadcn-docs-surface [data-slot="..."]` rules in `globals.css` override primitive slots
- docs-only composed surface rules are mixed with primitive guard rules

This makes DevTools noisy and blurs source-of-truth.

Relevant prior notes:

- `notes/design-system-css-audit-report.md`
- `notes/design-system-padding-collision-report.md`
- `notes/design-system-css-cleanup-handoff.md`
- `notes/design-system-luma-style-report.md`
- `notes/design-foundation-rules-report.md`

## 5. Verification Status

Latest completed verification from the Luma pass:

- `npm run build:next`: passed
- Scoped eslint passed:

```bash
./node_modules/.bin/eslint src/app/design-system/_components/design-system-shell.tsx src/app/design-system/_components/page-sections.tsx
```

- HTTP route checks passed on `http://127.0.0.1:3002`:
  - `/design-system`
  - `/design-system/foundation`
  - `/design-system/components`
  - `/design-system/patterns`
  - `/design-system/templates`

Full `npm run lint` failed due to existing broad repo issues outside this task:

- `require()` import lint errors in `codex/` and `scratch/`
- existing `set-state-in-effect` issue in `design-system-preferences.tsx`
- existing `<img>` warnings

## 6. Screenshots

Recent screenshot folders:

- `notes/screenshots/shadcn-style-rules-merge-2026-06-18/`
- `notes/screenshots/design-system-luma-style-2026-06-18/`
- `notes/screenshots/design-foundation-rules-2026-06-18/`

Note: screenshots are full desktop captures, so other windows may be visible. Review the browser area only.

## 7. Process / agentOS Note

No separate `agentOS` file was found in this repo. The active task workflow is defined in `AGENTS.md`.

For meaningful implementation work:

1. Create a planning note in `notes/`.
2. Capture before screenshots under `notes/screenshots/<task-slug>-<YYYY-MM-DD>/`.
3. Implement.
4. Verify.
5. Capture after screenshots.
6. Write a completion report in `notes/`.

Recent work followed this process.

## 8. Current Working Tree Caution

`git status --short` shows many pre-existing untracked notes/screenshots and deleted files under `sample/capture/`.

Do not revert or clean those unless explicitly asked.

Known files changed by the recent style/foundation work include:

- `AGENTS.md`
- `docs/ui-style-system.md`
- `src/app/globals.css`
- `src/app/design-system/_components/design-system-shell.tsx`
- `src/app/design-system/_components/page-sections.tsx`
- `notes/shadcn-style-rules-merge-plan.md`
- `notes/shadcn-style-rules-merge-report.md`
- `notes/design-system-luma-style-plan.md`
- `notes/design-system-luma-style-report.md`
- `notes/design-foundation-rules-plan.md`
- `notes/design-foundation-rules-report.md`
- `notes/design-foundation-current-state-handoff.md`

## 9. Recommended Next Task

Refactor `/design-system` styling so the new rules are reflected in implementation:

1. Keep `/design-system` shell compact as Vega/Rhea.
2. Move Luma styling into service-preview wrappers instead of the whole docs shell.
3. Reduce primitive overrides in `.shadcn-docs-surface [data-slot="..."]`.
4. Split CSS ownership:
   - docs shell
   - service preview Luma wrappers
   - explicit primitive exceptions
5. Normalize authored spacing to 4px increments.
6. Reduce divider/border usage in composed docs surfaces.
7. Check nested radius against inset spacing.
8. Preserve shadcn primitive source of truth in `src/components/ui/*`.

## 10. Suggested Next Prompt

```text
Continue in /Users/im_018/Documents/GitHub/2026_important/BrandGen.

Read:
- AGENTS.md
- docs/ui-style-system.md
- notes/design-foundation-current-state-handoff.md
- notes/design-system-luma-style-report.md
- notes/design-foundation-rules-report.md
- notes/design-system-css-audit-report.md
- notes/design-system-padding-collision-report.md

Goal:
Refactor /design-system styling to follow the new foundation rules. Keep the /design-system documentation shell compact with Vega/Rhea behavior, move Luma styling to service-facing preview wrappers, reduce global primitive overrides, keep spacing on the 4px grid, minimize borders/dividers, and preserve shadcn primitives as the source of truth. Follow AGENTS.md: create a plan note, capture before screenshots, implement, verify build/scoped lint/route checks, capture after screenshots, and write a completion report.
```
