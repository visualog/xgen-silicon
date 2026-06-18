# Design System CSS Cleanup Handoff

Date: 2026-06-10

## Completed Tasks

### Task 1 - Primitive Overrides

Removed `.shadcn-docs-surface [data-slot="..."]` primitive overrides from `src/app/globals.css`.

Result:

- shadcn primitives now own their own default styling through `src/components/ui/*`.

### Task 2 - Legacy Buttons

Removed unused global legacy button CSS:

- `.btn-primary`
- `.btn-secondary`
- `.button-primary`
- `.button-secondary`
- invalid `composes:` rules

### Task 3 - Token Boundary

Clarified token ownership in `src/app/globals.css`:

- shadcn tokens are marked as source tokens.
- `--ui-*` / `--surface-*` aliases are marked as migration aliases.
- `--bg-*` / `--text-*` aliases are marked as legacy app surface aliases.
- `html, body` no longer overrides shadcn base color/font with legacy aliases.

### Task 4 - PageHero Balance

Adjusted `PageHero` composition:

- `lg:grid-cols-[0.9fr_0.5fr]` -> `lg:grid-cols-[minmax(0,1fr)_auto]`
- `max-w-4xl` -> `max-w-3xl`

## Current Validation

- `npm run build:next` passed after each task.
- Local server is running:

```text
http://127.0.0.1:3002
```

- Verified:
  - `/design-system/components` 200
  - `/design-system/patterns` 200

## Key Files Changed

- `src/app/globals.css`
- `src/app/design-system/_components/page-sections.tsx`

## Task Reports

- `notes/design-system-css-audit-report.md`
- `notes/design-system-css-task1-primitive-overrides-report.md`
- `notes/design-system-css-task2-legacy-buttons-report.md`
- `notes/design-system-css-task3-token-boundary-report.md`
- `notes/design-system-css-task4-pagehero-balance-report.md`

## Screenshots

- `notes/screenshots/design-system-css-task1-primitive-overrides-2026-06-10/`
- `notes/screenshots/design-system-css-task2-legacy-buttons-2026-06-10/`
- `notes/screenshots/design-system-css-task3-token-boundary-2026-06-10/`
- `notes/screenshots/design-system-css-task4-pagehero-balance-2026-06-10/`

## Remaining Risk

`src/app/globals.css` is still a large global stylesheet with legacy production app styles. The high-risk design-system collisions have been removed, but a future task could extract design-system shell CSS into a route-owned stylesheet or CSS module if the repo direction allows it.

## Copy-Paste Continuation Prompt

```text
Continue in /Users/im_018/Documents/GitHub/2026_important/BrandGen. Design-system CSS cleanup tasks 1-4 are complete. Removed docs primitive overrides, removed unused legacy button/composes CSS, clarified shadcn token source-of-truth, removed body-level legacy color/font override, and adjusted PageHero composition. Build passed and local server is running at http://127.0.0.1:3002. Review notes/design-system-css-cleanup-handoff.md and continue with visual QA or broader globals.css extraction.
```
