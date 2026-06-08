# shadcn conflict cleanup plan

Date: 2026-06-08
Branch: `feature/apps-sdk-ui-foundation`
Task: Split and execute cleanup work for files that can conflict with shadcn/ui foundation.

## Task 1: Archive design-md runtime paths

- Keep `design-md/` files for historical reference.
- Prevent accidental regeneration or reintroduction of `design-md/variables.css` and `design-md/theme.css`.
- Add explicit documentation that `design-md` is not the active runtime design system.

## Task 2: Preserve shadcn as the design-system route source of truth

- Keep `/design-system/*` pages on shadcn primitives and shadcn tokens.
- Avoid `Xgen*` wrappers and legacy `--ui-*`, `--bg-*`, `--text-*` token use in the design-system page.
- Leave production app compatibility tokens in place for existing app screens.

## Task 3: Finish the current registry rebuild safely

- Complete the partially started `/design-system/components` rebuild so the route compiles.
- Use the newly installed official shadcn registry components (`label`, `select`, `switch`, `skeleton`, `textarea`, `slider`) in the visible showcase.
- Keep xGen content, but let shadcn components own internal padding, line-height, radius, and focus behavior.

## Task 4: Verify and report

- Run `npm run build:next`.
- Run targeted ESLint on touched source files.
- Check `/design-system/components` route if a local server is available.
- Write a completion report with files changed, results, and remaining risks.
