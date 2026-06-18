# Design System CSS Audit Report

Date: 2026-06-10

## Scope

CSS audit for the xGen design-system pages from the perspective of applying shadcn/ui as the primary design system.

## Findings

### P1 - Docs CSS overrides shadcn primitives globally within the docs surface

Location:

- `src/app/globals.css:2223-2350`
- `src/components/ui/card.tsx:5-26`
- `src/components/ui/button.tsx:9-25`
- `src/components/ui/badge.tsx:6-14`
- `src/components/ui/input.tsx:7-17`
- `src/components/ui/textarea.tsx:5-11`
- `src/components/ui/select.tsx:27-113`

Impact:

The design-system pages are supposed to document the actual local shadcn primitives, but `.shadcn-docs-surface [data-slot="..."]` changes card padding, button sizes, badge padding, select sizing, input padding, and textarea sizing after the component classes are applied. DevTools then shows stacked rules and the docs no longer represent the real primitive defaults.

Recommendation:

Remove primitive-level overrides from `.shadcn-docs-surface`. Keep only shell/layout selectors such as `.shadcn-docs-surface`, `.shadcn-docs-header`, and `.shadcn-docs-body`. Put any example-specific spacing in local page/component `className` props.

### P1 - Legacy CSS Modules `composes:` is present in global CSS

Location:

- `src/app/globals.css:2176-2177`

Impact:

`composes:` is CSS Modules syntax, not useful in global CSS. It is likely ignored by the browser, so `.button-primary` and `.button-secondary` do not actually inherit `.btn-primary` and `.btn-secondary`. This creates a hidden compatibility break.

Recommendation:

Replace these with explicit selector grouping or delete them if unused. Current search found no app usage of `.button-primary`, `.button-secondary`, `.btn-primary`, or `.btn-secondary`, so deletion is likely safe after one broader usage check.

### P2 - Unused docs-only data-slot selectors remain in globals

Location:

- `src/app/globals.css:2276-2315`
- `src/app/globals.css:2365-2375`

Impact:

Selectors for `control-row`, `media-tile`, `preview-frame`, `status-tile`, `summary-panel`, `summary-tile`, `option-row`, and `muted-row` are not currently matched by DOM usage under `src/app` or `src/components`. They add noise and make DevTools harder to reason about.

Recommendation:

Remove unused selectors or move them next to the feature that uses them if they are reintroduced.

### P2 - Compatibility tokens and shadcn tokens live in the same root namespace

Location:

- `src/app/globals.css:30-120`

Impact:

The root token block mixes primary shadcn tokens (`--background`, `--card`, `--primary`) with compatibility aliases (`--ui-*`, `--surface-*`). This is workable for migration, but it blurs which tokens are source-of-truth for the design-system site.

Recommendation:

Keep shadcn tokens as the source of truth. Move compatibility alias comments into a clearly marked migration section or extract legacy app styling away from design-system docs.

### P3 - Docs shell width is now correct but still split between CSS and page composition

Location:

- `src/app/globals.css:2194-2215`
- `src/app/design-system/_components/page-sections.tsx:30-59`

Impact:

The body rail is centered by `.shadcn-docs-body`, but the page can still look visually left-heavy because `PageHero` uses a left-dominant grid and action column. This is composition, not shell CSS.

Recommendation:

After cleanup, adjust `PageHero` layout deliberately if visual balance remains a concern.

## Positive Findings

- The design-system shell now has clear wrapper classes:
  - `shadcn-docs-surface`
  - `shadcn-docs-header`
  - `shadcn-docs-body`
- Global `body` owns background/text via the shadcn base layer.
- Current build passed before this audit.

## Recommended Cleanup Order

1. Remove `.shadcn-docs-surface [data-slot="button" | "badge" | "input" | "textarea" | "select-*"]` primitive overrides.
2. Remove or replace `.button-primary { composes: ... }` and `.button-secondary { composes: ... }`.
3. Remove unused docs-only data-slot selectors.
4. Rebuild and verify `/design-system/components` and `/design-system/patterns`.
5. If still visually left-heavy, tune `PageHero` composition separately.
